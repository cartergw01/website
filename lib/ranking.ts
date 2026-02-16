import type { FeedItem } from "@/lib/types";

export function cosineSimilarity(a: number[], b: number[]) {
  let dot = 0;
  let na = 0;
  let nb = 0;
  for (let i = 0; i < Math.min(a.length, b.length); i += 1) {
    dot += a[i] * b[i];
    na += a[i] * a[i];
    nb += b[i] * b[i];
  }
  if (!na || !nb) return 0;
  return dot / (Math.sqrt(na) * Math.sqrt(nb));
}

export function rankItems(items: FeedItem[], interestEmbeddings: number[][]) {
  return [...items]
    .map((item) => {
      const sim = interestEmbeddings.length
        ? Math.max(...interestEmbeddings.map((e) => cosineSimilarity(item.embedding, e)))
        : 0.3;
      const ageHours = (Date.now() - new Date(item.publishedAt).getTime()) / 3_600_000;
      const recency = Math.exp(-Math.max(0, ageHours) / 36);
      const score = sim * 0.6 + recency * 0.25 + item.reliability * 0.15;
      return { item, score };
    })
    .sort((a, b) => b.score - a.score)
    .map(({ item }) => item);
}
