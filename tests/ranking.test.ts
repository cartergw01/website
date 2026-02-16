import { describe, expect, it } from "vitest";
import { clusterScore } from "../lib/ranking";

describe("clusterScore", () => {
  it("prefers high similarity and recency", () => {
    const high = clusterScore({
      clusterEmbedding: [1, 0, 0],
      interestEmbeddings: [[0.9, 0.1, 0]],
      publishedAt: new Date().toISOString(),
      reliabilityScore: 0.9,
      feedbackActions: []
    });

    const low = clusterScore({
      clusterEmbedding: [0, 1, 0],
      interestEmbeddings: [[0.9, 0.1, 0]],
      publishedAt: new Date(Date.now() - 72 * 3_600_000).toISOString(),
      reliabilityScore: 0.2,
      feedbackActions: []
    });

    expect(high).toBeGreaterThan(low);
  });

  it("applies feedback penalties", () => {
    const boosted = clusterScore({
      clusterEmbedding: [1, 0],
      interestEmbeddings: [[1, 0]],
      publishedAt: new Date().toISOString(),
      reliabilityScore: 0.8,
      feedbackActions: ["more_like_this"]
    });

    const penalized = clusterScore({
      clusterEmbedding: [1, 0],
      interestEmbeddings: [[1, 0]],
      publishedAt: new Date().toISOString(),
      reliabilityScore: 0.8,
      feedbackActions: ["less_like_this", "hide_cluster"]
    });

    expect(boosted).toBeGreaterThan(penalized);
  });
});
