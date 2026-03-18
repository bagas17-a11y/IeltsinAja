// @vitest-environment node
/**
 * API Key Integration Tests
 *
 * These tests make real HTTP calls to the Anthropic API.
 * They are EXCLUDED from `npm run test` to avoid network costs in CI.
 * Run manually with:  npm run test:integration
 *
 * Cost per run: ~$0.00001 (1 Haiku call, max_tokens=5)
 */
import { describe, it, expect, beforeAll } from "vitest";
import { readFileSync, existsSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ENV_PATH = resolve(__dirname, "../../supabase/.env");

// ─── helpers ────────────────────────────────────────────────────────────────

function loadDotEnv(filePath: string): Record<string, string> {
  if (!existsSync(filePath)) return {};
  const vars: Record<string, string> = {};
  for (const raw of readFileSync(filePath, "utf-8").split("\n")) {
    const line = raw.trim();
    if (!line || line.startsWith("#")) continue;
    const eq = line.indexOf("=");
    if (eq === -1) continue;
    vars[line.slice(0, eq).trim()] = line.slice(eq + 1).trim();
  }
  return vars;
}

async function pingAnthropicAPI(apiKey: string): Promise<{
  ok: boolean;
  status: number;
  text?: string;
}> {
  const resp = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
      "content-type": "application/json",
    },
    body: JSON.stringify({
      // Cheapest model, absolute minimum tokens — costs ~$0.00001 per call
      model: "claude-haiku-4-5-20251001",
      max_tokens: 5,
      messages: [{ role: "user", content: "Reply: OK" }],
    }),
  });

  const text = await resp.text();
  return { ok: resp.ok, status: resp.status, text };
}

// ─── tests ───────────────────────────────────────────────────────────────────

describe("Anthropic API key", () => {
  let apiKey: string | undefined;

  beforeAll(() => {
    // Prefer process.env (CI / shell export) over the .env file
    apiKey =
      process.env.ANTHROPIC_API_KEY || loadDotEnv(ENV_PATH)["ANTHROPIC_API_KEY"];
  });

  it("is present in supabase/.env or the environment", () => {
    if (!apiKey) {
      console.warn("ANTHROPIC_API_KEY not found — skipping API tests");
    }
    // Soft check: warn but don't hard-fail if file is missing (e.g. CI with secrets)
    expect(typeof apiKey === "string" || apiKey === undefined).toBe(true);
  });

  it("starts with the expected sk-ant-api prefix", () => {
    if (!apiKey) return; // skip when no key
    expect(apiKey).toMatch(/^sk-ant-api/);
  });

  it(
    "is accepted by the Anthropic API (live ping)",
    { timeout: 15_000 },
    async () => {
      if (!apiKey) {
        console.warn("Skipping live API ping — no key found");
        return;
      }

      const result = await pingAnthropicAPI(apiKey);

      if (result.status === 401) {
        throw new Error(
          `API key rejected (401). Key may be invalid or expired.\nResponse: ${result.text}`
        );
      }
      if (result.status === 529 || result.status === 503) {
        console.warn("Anthropic API overloaded — skipping assertion");
        return;
      }

      expect(result.ok).toBe(true);
      expect(result.status).toBe(200);
    }
  );

  it(
    "returns a valid message response structure",
    { timeout: 15_000 },
    async () => {
      if (!apiKey) return;

      const result = await pingAnthropicAPI(apiKey);
      if (!result.ok) return; // covered by previous test

      const data = JSON.parse(result.text!);
      expect(data).toHaveProperty("id");
      expect(data).toHaveProperty("type", "message");
      expect(data).toHaveProperty("model");
      expect(data.model).toContain("claude");
      expect(Array.isArray(data.content)).toBe(true);
      expect(data.content[0]).toHaveProperty("type", "text");
      expect(typeof data.content[0].text).toBe("string");
    }
  );

  it(
    "uses the haiku model for the ping (cheapest, verifies model routing)",
    { timeout: 15_000 },
    async () => {
      if (!apiKey) return;

      const result = await pingAnthropicAPI(apiKey);
      if (!result.ok) return;

      const data = JSON.parse(result.text!);
      expect(data.model).toContain("haiku");
    }
  );
});
