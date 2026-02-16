export type FeedItem = {
  id: string;
  clusterId: string;
  title: string;
  source: string;
  sourceUrl: string;
  publishedAt: string;
  summaryBullets: string[];
  whyShown: string;
  whyItMatters?: string;
  url: string;
  tags: string[];
  reliability: number;
  embedding: number[];
  cleanedText?: string;
};

export type SourceConfig = {
  id: string;
  name: string;
  rssUrl: string;
  enabled: boolean;
  reliability: number;
  tags: string[];
};

export type UserPrefs = {
  compactMode: boolean;
  interests: string[];
  hiddenSources: string[];
  savedItemIds: string[];
  theme: "dark" | "light";
};
