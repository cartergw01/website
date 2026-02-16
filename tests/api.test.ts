import { describe, expect, it } from "vitest";
import { getHealthPayload } from "../lib/api";

describe("health payload", () => {
  it("returns expected shape", () => {
    const payload = getHealthPayload();
    expect(payload.ok).toBe(true);
    expect(payload.app).toBe("inFlow");
    expect(typeof payload.timestamp).toBe("string");
  });
});
