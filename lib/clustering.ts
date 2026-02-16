import { cosineSimilarity } from "@/lib/ranking";

export const CLUSTER_SIMILARITY_THRESHOLD = 0.88;

export function shouldJoinCluster(a: number[], b: number[]) {
  return cosineSimilarity(a, b) >= CLUSTER_SIMILARITY_THRESHOLD;
}
