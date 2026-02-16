import fs from "node:fs/promises";
import path from "node:path";
import Parser from "rss-parser";

type Source = { id: string; name: string; rssUrl: string; enabled: boolean; reliability: number; tags: string[] };

const parser = new Parser();

async function readSources(): Promise<Source[]> {
  const fromData = path.join(process.cwd(), "data", "sources.json");
  try {
    const raw = await fs.readFile(fromData, "utf8");
    return JSON.parse(raw) as Source[];
  } catch {
    const mod = await import("../lib/seed-data");
    return mod.seedSources as Source[];
  }
}

async function main() {
  const sources = (await readSources()).filter((s) => s.enabled);
  const items: unknown[] = [];

  for (const source of sources) {
    try {
      const feed = await parser.parseURL(source.rssUrl);
      for (const entry of (feed.items ?? []).slice(0, 15)) {
        if (!entry.link || !entry.title) continue;
        items.push({
          id: `ingested-${source.id}-${Buffer.from(entry.link).toString("base64").slice(0, 10)}`,
          clusterId: `cluster-${Buffer.from(entry.title).toString("base64").slice(0, 8)}`,
          title: entry.title,
          source: source.name,
          sourceUrl: source.rssUrl,
          publishedAt: entry.isoDate ?? new Date().toISOString(),
          summaryBullets: [entry.contentSnippet ?? "New update from this source.", "Open for details.", "Use feedback to tune ranking."],
          whyShown: "From your enabled source list and ranked by recency + reliability.",
          whyItMatters: "Fresh coverage from a source you follow.",
          url: entry.link,
          tags: source.tags,
          reliability: source.reliability,
          embedding: [1, 0.5, 0.2, 0.1]
        });
      }
    } catch (error) {
      console.warn(`Skipping source ${source.name}:`, error instanceof Error ? error.message : error);
    }
  }

  await fs.mkdir(path.join(process.cwd(), "data"), { recursive: true });
  await fs.writeFile(path.join(process.cwd(), "data", "ingested.json"), JSON.stringify(items, null, 2));
  console.log(`Ingested ${items.length} items into data/ingested.json`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
