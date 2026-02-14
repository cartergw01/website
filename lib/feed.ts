import { clusterScore } from "@/lib/ranking";
import type { FeedbackAction, RankedCluster } from "@/lib/types";
import { createServiceSupabase } from "@/lib/supabase";

export async function getRankedFeedForUser(userId: string): Promise<RankedCluster[]> {
  const supabase = createServiceSupabase();

  const [{ data: interests }, { data: feedback }, { data: hidden }, { data: rows }] = await Promise.all([
    supabase.from("user_interests").select("embedding").eq("user_id", userId),
    supabase.from("user_feedback").select("cluster_id,action").eq("user_id", userId),
    supabase.from("user_hidden_sources").select("source_id").eq("user_id", userId),
    supabase
      .from("clusters")
      .select(
        "id,summary_bullets,why_it_matters,cluster_embedding,created_at,canonical_article:canonical_article_id(id,title,url,published_at,source:source_id(id,name,reliability_score))"
      )
      .order("created_at", { ascending: false })
      .limit(200)
  ]);

  const hiddenSourceIds = new Set((hidden ?? []).map((x) => x.source_id));
  const feedbackByCluster = new Map<string, FeedbackAction[]>();

  for (const f of feedback ?? []) {
    const list = feedbackByCluster.get(f.cluster_id) ?? [];
    list.push(f.action);
    feedbackByCluster.set(f.cluster_id, list);
  }

  const interestEmbeddings = (interests ?? []).map((i) => i.embedding as number[]);

  return (rows ?? [])
    .filter((row: any) => !hiddenSourceIds.has(row.canonical_article?.source?.id))
    .map((row: any) => {
      const article = row.canonical_article;
      const source = article?.source;
      const score = clusterScore({
        clusterEmbedding: row.cluster_embedding ?? [],
        interestEmbeddings,
        publishedAt: article?.published_at ?? row.created_at,
        reliabilityScore: source?.reliability_score ?? 0.5,
        feedbackActions: feedbackByCluster.get(row.id) ?? []
      });
      return {
        id: row.id,
        title: article?.title ?? "Untitled",
        sourceName: source?.name ?? "Unknown",
        sourceId: source?.id,
        publishedAt: article?.published_at ?? row.created_at,
        url: article?.url ?? "#",
        summaryBullets: row.summary_bullets ?? [],
        whyItMatters: row.why_it_matters ?? "",
        whyShown: "Matched to your interests + recency + source quality",
        score
      } as RankedCluster;
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, 50);
}
