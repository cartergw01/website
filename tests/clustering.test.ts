import { describe, expect, it } from "vitest";
import { CLUSTER_SIMILARITY_THRESHOLD, shouldJoinCluster } from "../lib/clustering";

describe("clustering threshold", () => {
  it("joins highly similar embeddings", () => {
    expect(shouldJoinCluster([1, 0, 0], [0.95, 0.05, 0])).toBe(true);
  });

  it("rejects below threshold", () => {
    expect(CLUSTER_SIMILARITY_THRESHOLD).toBeGreaterThan(0.8);
    expect(shouldJoinCluster([1, 0, 0], [0.4, 0.6, 0])).toBe(false);
  });
});
