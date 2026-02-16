import { describe, expect, it } from "vitest";
import { rankItems } from "../lib/ranking";

describe("rankItems", () => {
  it("returns deterministic ordering for fixed inputs", () => {
    const items = [
      { id: "a", embedding: [1, 0], publishedAt: "2026-01-01T00:00:00.000Z", reliability: 0.9 },
      { id: "b", embedding: [0.1, 1], publishedAt: "2026-01-01T00:00:00.000Z", reliability: 0.5 },
      { id: "c", embedding: [0.8, 0.2], publishedAt: "2026-01-01T00:00:00.000Z", reliability: 0.7 }
    ] as any[];

    const ranked = rankItems(items, [[1, 0]]);
    expect(ranked.map((x) => x.id)).toEqual(["a", "c", "b"]);
  });
});
