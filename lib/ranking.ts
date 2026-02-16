import type { FeedbackAction } from "@/lib/types";

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

export function recencyScore(publishedAt: string, now = new Date()) {
  const hours = Math.max(0, (now.getTime() - new Date(publishedAt).getTime()) / 3_600_000);
  return Math.exp(-hours / 24);
}

export function feedbackWeight(actions: FeedbackAction[]) {
  return actions.reduce((acc, action) => {
    if (action === "more_like_this") return acc + 0.15;
    if (action === "less_like_this") return acc - 0.2;
    if (action === "hide_cluster") return acc - 0.6;
    return acc;
  }, 0);
}

export function clusterScore(params: {
  clusterEmbedding: number[];
  interestEmbeddings: number[][];
  publishedAt: string;
  reliabilityScore: number;
  feedbackActions: FeedbackAction[];
  now?: Date;
}) {
  const maxSim = params.interestEmbeddings.length
    ? Math.max(...params.interestEmbeddings.map((e) => cosineSimilarity(params.clusterEmbedding, e)))
    : 0;
  const recency = recencyScore(params.publishedAt, params.now);
  const reliability = Math.max(0, Math.min(1, params.reliabilityScore));
  const feedback = feedbackWeight(params.feedbackActions);
  return maxSim * 0.6 + recency * 0.25 + reliability * 0.15 + feedback;
}
