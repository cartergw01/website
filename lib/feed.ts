import { rankItems } from "@/lib/ranking";
import type { FeedItem } from "@/lib/types";

export function getRankedFeed(items: FeedItem[], interests: number[][]) {
  return rankItems(items, interests).slice(0, 50);
}
