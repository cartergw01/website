import type { FeedItem, SourceConfig } from "@/lib/types";

const now = Date.now();

export const seedSources: SourceConfig[] = [
  { id: "verge", name: "The Verge", rssUrl: "https://www.theverge.com/rss/index.xml", enabled: true, reliability: 0.74, tags: ["tech"] },
  { id: "reuters", name: "Reuters", rssUrl: "https://www.reutersagency.com/feed/?best-topics=world&post_type=best", enabled: true, reliability: 0.92, tags: ["world"] },
  { id: "mit", name: "MIT Technology Review", rssUrl: "https://www.technologyreview.com/feed/", enabled: true, reliability: 0.81, tags: ["ai"] },
  { id: "substack-demo", name: "Demo Substack", rssUrl: "https://www.platformer.news/feed", enabled: true, reliability: 0.7, tags: ["analysis"] }
];

export const seedItems: FeedItem[] = Array.from({ length: 28 }).map((_, i) => {
  const source = seedSources[i % seedSources.length];
  const cluster = `cluster-${(i % 9) + 1}`;
  return {
    id: `item-${i + 1}`,
    clusterId: cluster,
    title: `AI policy update ${i + 1}: what changed and why teams care`,
    source: source.name,
    sourceUrl: source.rssUrl,
    publishedAt: new Date(now - i * 60 * 60 * 1000).toISOString(),
    summaryBullets: [
      "Regulators published new implementation details affecting model deployment.",
      "Major platforms responded with revised timelines and compliance checklists.",
      "Smaller teams may benefit from clearer definitions and phased adoption windows."
    ],
    whyShown: "Matched your interests in AI policy and product strategy.",
    whyItMatters: "This changes launch risk and roadmap timing for AI features.",
    url: `https://example.com/story/${i + 1}`,
    tags: source.tags,
    reliability: source.reliability,
    embedding: [1, (i % 5) / 5, ((i + 2) % 7) / 7, 0.4],
    cleanedText: "Optional extracted text preview available in seed mode."
  };
});
