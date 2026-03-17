import { describe, it, expect, beforeEach, vi } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useReadingCache, type CachedPassage } from "@/hooks/useLocalStorage";

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] ?? null,
    setItem: (key: string, value: string) => { store[key] = value; },
    removeItem: (key: string) => { delete store[key]; },
    clear: () => { store = {}; },
  };
})();

Object.defineProperty(window, "localStorage", { value: localStorageMock });

const makePassage = (id: string, title = "Test"): CachedPassage => ({
  id,
  passage: { title, content: "content", topic: "Science", wordCount: 800 },
  difficulty: "medium",
  questions: {},
  metadata: {},
  generatedAt: new Date().toISOString(),
});

describe("useReadingCache", () => {
  beforeEach(() => {
    localStorageMock.clear();
    vi.clearAllMocks();
  });

  it("starts with an empty cache", () => {
    const { result } = renderHook(() => useReadingCache());
    expect(result.current.cache).toEqual([]);
  });

  it("adds a passage to the cache", () => {
    const { result } = renderHook(() => useReadingCache());
    const p = makePassage("p1", "Marine Biology");
    act(() => result.current.addToCache(p));
    expect(result.current.cache).toHaveLength(1);
    expect(result.current.cache[0].id).toBe("p1");
  });

  it("keeps the most recent passage at index 0", () => {
    const { result } = renderHook(() => useReadingCache());
    act(() => result.current.addToCache(makePassage("p1")));
    act(() => result.current.addToCache(makePassage("p2")));
    expect(result.current.cache[0].id).toBe("p2");
  });

  it("caps the cache at 5 entries", () => {
    const { result } = renderHook(() => useReadingCache());
    for (let i = 1; i <= 7; i++) {
      act(() => result.current.addToCache(makePassage(`p${i}`)));
    }
    expect(result.current.cache).toHaveLength(5);
  });

  it("deduplicates on re-add (moves to front)", () => {
    const { result } = renderHook(() => useReadingCache());
    act(() => result.current.addToCache(makePassage("p1")));
    act(() => result.current.addToCache(makePassage("p2")));
    act(() => result.current.addToCache(makePassage("p1"))); // re-add p1
    expect(result.current.cache[0].id).toBe("p1");
    expect(result.current.cache).toHaveLength(2);
  });

  it("retrieves a passage by id", () => {
    const { result } = renderHook(() => useReadingCache());
    act(() => result.current.addToCache(makePassage("abc")));
    expect(result.current.getCachedPassage("abc")?.id).toBe("abc");
  });

  it("returns undefined for unknown id", () => {
    const { result } = renderHook(() => useReadingCache());
    expect(result.current.getCachedPassage("nope")).toBeUndefined();
  });

  it("getLatestPassage returns null when empty", () => {
    const { result } = renderHook(() => useReadingCache());
    expect(result.current.getLatestPassage()).toBeNull();
  });

  it("getLatestPassage returns the most recent entry", () => {
    const { result } = renderHook(() => useReadingCache());
    act(() => result.current.addToCache(makePassage("p1")));
    act(() => result.current.addToCache(makePassage("p2")));
    expect(result.current.getLatestPassage()?.id).toBe("p2");
  });

  it("updateCacheEntry patches fields without removing others", () => {
    const { result } = renderHook(() => useReadingCache());
    act(() => result.current.addToCache(makePassage("p1")));
    act(() => result.current.updateCacheEntry("p1", { score: 85, submitted: true }));
    const entry = result.current.getCachedPassage("p1");
    expect(entry?.score).toBe(85);
    expect(entry?.submitted).toBe(true);
    expect(entry?.passage.title).toBe("Test");
  });

  it("clearCache empties the array", () => {
    const { result } = renderHook(() => useReadingCache());
    act(() => result.current.addToCache(makePassage("p1")));
    act(() => result.current.clearCache());
    expect(result.current.cache).toHaveLength(0);
  });
});
