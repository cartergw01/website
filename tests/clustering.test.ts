import { describe, expect, it } from "vitest";
import { shouldJoinCluster } from "../lib/clustering";

describe("shouldJoinCluster", () => {
  it("does not merge unrelated vectors", () => {
    expect(shouldJoinCluster([1, 0, 0], [0, 1, 0])).toBe(false);
  });
});
