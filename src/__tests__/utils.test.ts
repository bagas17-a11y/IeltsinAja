import { describe, it, expect } from "vitest";
import { cn } from "@/lib/utils";

describe("cn (classname utility)", () => {
  it("merges class strings", () => {
    expect(cn("foo", "bar")).toBe("foo bar");
  });

  it("handles conditional classes", () => {
    const condition = false;
    expect(cn("base", condition && "nope", "end")).toBe("base end");
  });

  it("deduplicates conflicting Tailwind classes (last wins)", () => {
    const result = cn("text-red-500", "text-blue-500");
    expect(result).toBe("text-blue-500");
  });

  it("merges padding overrides correctly", () => {
    const result = cn("p-4", "px-2");
    expect(result).toBe("p-4 px-2");
  });

  it("handles undefined and null gracefully", () => {
    expect(cn(undefined, null, "foo")).toBe("foo");
  });

  it("returns empty string when no args given", () => {
    expect(cn()).toBe("");
  });

  it("handles object syntax", () => {
    expect(cn({ "font-bold": true, italic: false })).toBe("font-bold");
  });

  it("handles array syntax", () => {
    expect(cn(["text-sm", "font-medium"])).toBe("text-sm font-medium");
  });
});
