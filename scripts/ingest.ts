import { XMLParser } from "fast-xml-parser";
import * as cheerio from "cheerio";
import crypto from "node:crypto";
import { createServiceSupabase } from "../lib/supabase";
import { embedText, summarizeCluster } from "../lib/openai";
import { shouldJoinCluster } from "../lib/clustering";

const parser = new XMLParser({ ignoreAttributes: false });

function toArray<T>(value: T | T[] | undefined): T[] {
  if (!value) return [];
  return Array.isArray(value) ? value : [value];
}

async function fetchFeed(url: string) {
  const xml = await fetch(url).then((r) => r.text());
  const parsed = parser.parse(xml);
  const items = toArray(parsed?.rss?.channel?.item ?? parsed?.feed?.entry);
  return items.map((item: any) => ({
    title: item.title?.["#text"] ?? item.title ?? "Untitled",
    url: item.link?.href ?? item.link ?? item.guid ?? "",
    publishedAt: item.pubDate ?? item.updated ?? new Date().toISOString()
  }));
}

async function cleanArticleText(url: string) {
  const html = await fetch(url, { redirect: "follow" }).then((r) => r.text());
  const $ = cheerio.load(html);
  $("script,style,noscript,header,footer,nav").remove();
  const text = $("article").text() || $("main").text() || $("body").text();
  return text.replace(/\s+/g, " ").trim();
}

async function main() {
  const supabase = createServiceSupabase();
  const { data: sources, error } = await supabase.from("sources").select("id,name,rss_url,reliability_score");
  if (error) throw error;

  for (const source of sources ?? []) {
    let feedItems: { title: string; url: string; publishedAt: string }[] = [];
    try {
      feedItems = await fetchFeed(source.rss_url);
    } catch {
      continue;
    }

    for (const item of feedItems.slice(0, 20)) {
      if (!item.url) continue;
      const { data: existing } = await supabase.from("articles").select("id").eq("url", item.url).maybeSingle();
      if (existing) continue;

      let cleanedText = "";
      try {
        cleanedText = await cleanArticleText(item.url);
      } catch {
        continue;
      }
      if (!cleanedText) continue;

      const contentHash = crypto.createHash("sha256").update(cleanedText).digest("hex");
      const { data: byHash } = await supabase.from("articles").select("id").eq("content_hash", contentHash).maybeSingle();
      if (byHash) continue;

      const embedding = await embedText(cleanedText.slice(0, 8000));

      const { data: article, error: articleError } = await supabase
        .from("articles")
        .insert({
          source_id: source.id,
          url: item.url,
          title: item.title,
          published_at: new Date(item.publishedAt).toISOString(),
          cleaned_text: cleanedText,
          content_hash: contentHash,
          embedding
        })
        .select("id,title,cleaned_text,embedding,published_at")
        .single();

      if (articleError || !article) continue;

      const cutoff = new Date(Date.now() - 48 * 3_600_000).toISOString();
      const { data: candidateClusters } = await supabase
        .from("clusters")
        .select("id,cluster_embedding")
        .gte("created_at", cutoff)
        .order("created_at", { ascending: false })
        .limit(100);

      let chosenClusterId: string | null = null;
      for (const cluster of candidateClusters ?? []) {
        if (shouldJoinCluster(article.embedding, cluster.cluster_embedding ?? [])) {
          chosenClusterId = cluster.id;
          break;
        }
      }

      if (!chosenClusterId) {
        const summary = await summarizeCluster({ title: article.title, content: article.cleaned_text });
        const { data: cluster } = await supabase
          .from("clusters")
          .insert({
            canonical_article_id: article.id,
            summary_bullets: summary.bullets,
            why_it_matters: summary.whyItMatters,
            cluster_embedding: article.embedding
          })
          .select("id")
          .single();

        chosenClusterId = cluster?.id ?? null;
      } else {
        const { data: canonical } = await supabase
          .from("cluster_members")
          .select("article:article_id(id,title,cleaned_text,published_at)")
          .eq("cluster_id", chosenClusterId)
          .limit(1)
          .maybeSingle();

        const canonicalArticle = canonical?.article as any;
        const currentPublished = new Date(canonicalArticle?.published_at ?? 0).getTime();
        if (new Date(article.published_at).getTime() > currentPublished) {
          const summary = await summarizeCluster({ title: article.title, content: article.cleaned_text });
          await supabase
            .from("clusters")
            .update({
              canonical_article_id: article.id,
              summary_bullets: summary.bullets,
              why_it_matters: summary.whyItMatters,
              cluster_embedding: article.embedding
            })
            .eq("id", chosenClusterId);
        }
      }

      if (chosenClusterId) {
        await supabase.from("cluster_members").upsert({ cluster_id: chosenClusterId, article_id: article.id });
      }
    }
  }

  console.log("Ingestion run complete");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
