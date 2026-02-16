export type FeedbackAction = "more_like_this" | "less_like_this" | "hide_cluster";

export type RankedCluster = {
  id: string;
  title: string;
  sourceName: string;
  sourceId: string;
  publishedAt: string;
  url: string;
  summaryBullets: string[];
  whyItMatters: string;
  whyShown: string;
  score: number;
};
