import { describe, it, expect } from "vitest";
import { formatDuration } from "./format.js";

describe("formatDuration", () => {
  it("formats whole minutes", () => {
    const result = formatDuration(180);
    expect(result).toBe("3:00");
  });
  it("formats minutes with remaining seconds", () => {
    const result = formatDuration(205);
    expect(result).toBe("3:25");
  });
  it("formats minutes with the remaining seconds under 10", () => {
    const result = formatDuration(65);
    expect(result).toBe("1:05");
  });
  it("throws on zero duration", () => {
    expect(() => formatDuration(0)).toThrow("Duration must be positive");
  });
  it("throws on negative duration", () => {
    expect(() => formatDuration(-1)).toThrow("Duration must be positive");
  });
});