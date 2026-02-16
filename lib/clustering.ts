import { cosineSimilarity } from "@/lib/ranking";

export const CLUSTER_SIMILARITY_THRESHOLD = 0.88;

export function shouldJoinCluster(articleEmbedding: number[], clusterEmbedding: number[]) {
  return cosineSimilarity(articleEmbedding, clusterEmbedding) >= CLUSTER_SIMILARITY_THRESHOLD;
}
