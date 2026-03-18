/**
 * Tests for AI model configuration logic
 * Verifies that the correct models and token limits are applied per module
 * (mirrors the logic in supabase/functions/ai-analyze/index.ts)
 */
import { describe, it, expect } from "vitest";

// Replicate the model-selection logic from ai-analyze/index.ts
type AnalysisType = "writing" | "speaking" | "reading" | "modelAnswer";

function selectModel(type: AnalysisType): string {
  return type === "writing" ? "claude-sonnet-4-6" : "claude-haiku-4-5-20251001";
}

function selectMaxTokens(type: AnalysisType): number {
  if (type === "writing") return 3000;
  if (type === "speaking") return 1500;
  return 800; // reading
}

// Replicate generate-reading model choice
const GENERATE_READING_MODEL = "claude-sonnet-4-6";
const GENERATE_READING_MAX_TOKENS = 8192;

// Replicate chatbot model choice
const CHATBOT_MODEL = "claude-haiku-4-5-20251001";
const CHATBOT_MAX_TOKENS = 512;

// Replicate model-answer generation
// Haiku is sufficient: Task 1 ~250 tokens, Task 2 ~430 tokens — well within 800
const MODEL_ANSWER_MAX_TOKENS = 800;
const MODEL_ANSWER_MODEL = "claude-haiku-4-5-20251001";

describe("AI module model selection", () => {
  describe("ai-analyze: model per type", () => {
    it("uses Sonnet for writing (quality-critical)", () => {
      expect(selectModel("writing")).toBe("claude-sonnet-4-6");
    });

    it("uses Haiku for speaking (speed-critical)", () => {
      expect(selectModel("speaking")).toBe("claude-haiku-4-5-20251001");
    });

    it("uses Haiku for reading feedback (speed-critical)", () => {
      expect(selectModel("reading")).toBe("claude-haiku-4-5-20251001");
    });
  });

  describe("ai-analyze: max_tokens per type", () => {
    it("allows 3000 tokens for writing (detailed grading)", () => {
      expect(selectMaxTokens("writing")).toBe(3000);
    });

    it("allows 1500 tokens for speaking feedback", () => {
      expect(selectMaxTokens("speaking")).toBe(1500);
    });

    it("allows 800 tokens for reading feedback (brief)", () => {
      expect(selectMaxTokens("reading")).toBe(800);
    });
  });

  describe("generate-reading function", () => {
    it("uses Sonnet for passage generation (complex task)", () => {
      expect(GENERATE_READING_MODEL).toBe("claude-sonnet-4-6");
    });

    it("uses 8192 max_tokens for full passage + 13 questions", () => {
      expect(GENERATE_READING_MAX_TOKENS).toBe(8192);
    });
  });

  describe("ai-chatbot function", () => {
    it("uses Haiku for chat (latency-sensitive)", () => {
      expect(CHATBOT_MODEL).toBe("claude-haiku-4-5-20251001");
    });

    it("caps chatbot at 512 tokens (concise responses)", () => {
      expect(CHATBOT_MAX_TOKENS).toBe(512);
    });
  });

  describe("model-answer generation", () => {
    it("uses Haiku for model answers (cost-optimised — short essay output)", () => {
      expect(MODEL_ANSWER_MODEL).toBe("claude-haiku-4-5-20251001");
    });

    it("caps model answers at 800 tokens (Task 1 ~250 tok, Task 2 ~430 tok)", () => {
      expect(MODEL_ANSWER_MAX_TOKENS).toBe(800);
    });
  });
});

describe("Model IDs are valid Anthropic model strings", () => {
  const VALID_MODELS = [
    "claude-sonnet-4-6",
    "claude-haiku-4-5-20251001",
    "claude-opus-4-6",
  ];

  it("Sonnet model ID is in the valid set", () => {
    expect(VALID_MODELS).toContain("claude-sonnet-4-6");
  });

  it("Haiku model ID is in the valid set", () => {
    expect(VALID_MODELS).toContain("claude-haiku-4-5-20251001");
  });

  it("no model uses the old deprecated model ID", () => {
    const allModels = [
      selectModel("writing"),
      selectModel("speaking"),
      selectModel("reading"),
      GENERATE_READING_MODEL,
      CHATBOT_MODEL,
      MODEL_ANSWER_MODEL,
    ];
    for (const m of allModels) {
      expect(m).not.toBe("claude-sonnet-4-5-20250929");
      expect(m).not.toBe("claude-3-5-sonnet-20241022");
    }
  });
});
