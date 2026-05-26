import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { validateRequest, GenerateListeningSchema } from "../shared/validation.ts";
import {
  corsHeaders,
  handleCorsPreflightRequest,
  successResponse,
  validationError,
  unauthorizedError,
  rateLimitError,
  internalError,
} from "../shared/errors.ts";
import { verifyUser } from "../shared/auth.ts";
import { checkRateLimit } from "../shared/rate-limit.ts";
import { getMockListeningTest } from "./mock-data.ts";

// ============================================================
// Per-part system prompt — outputs in library-compatible format
// ============================================================
const PART_SYSTEM_PROMPT = `You are an expert IELTS Listening test designer. Generate ONE PART of an IELTS Listening test.

Return ONLY valid JSON in this exact structure (no markdown, no commentary):
{
  "part_number": <1|2|3|4>,
  "context": "One sentence: who speaks and the situation",
  "transcript": "Full tapescript 250-600 words. Label speakers as SPEAKERNAME: text on each line.",
  "question_groups": [
    {
      "type": "<form_completion|note_completion|sentence_completion|multiple_choice|matching>",
      "title": "HEADING (form/note completion only, else omit)",
      "instruction": "Complete the [form/notes/sentences]. Write NO MORE THAN [N] WORDS [AND/OR A NUMBER] for each answer.",
      "question_range": [startNum, endNum],
      "items": [
        {
          "number": <int>,
          "label": "Field label — form_completion and note_completion only",
          "question": "Full question text — multiple_choice only",
          "sentence": "Complete sentence with _______ — sentence_completion only",
          "options": {"A": "...", "B": "...", "C": "..."} — multiple_choice only,
          "answer": "exact answer or letter (A/B/C)",
          "transcript_quote": "Verbatim phrase from transcript containing the answer",
          "explanation": "Brief explanation of why this is correct"
        }
      ],
      "options_pool": {"A":"...","B":"...","C":"...","D":"...","E":"...","F":"...","G":"..."} — matching ONLY (7 options for 5 questions)
    }
  ]
}

PART RULES:
Part 1 (Q1-10): Two-person everyday transactional conversation (booking, enquiry, registration)
  Group 1 — form_completion: 8 questions (1-8), labels, answers ≤3 words or a number
  Group 2 — multiple_choice: 2 questions (9-10), 3 options A/B/C

Part 2 (Q11-20): Monologue, social context (tour, broadcast, talk)
  Group 1 — multiple_choice: 3 questions (11-13), 3 options A/B/C
  Group 2 — note_completion: 7 questions (14-20), labels, answers ≤2 words or a number

Part 3 (Q21-30): 2-4 speaker academic/educational conversation
  Group 1 — matching: 5 questions (21-25), options_pool of exactly 7 items A-G, items use "label" not "question"
  Group 2 — sentence_completion: 5 questions (26-30), items use "sentence" with _______, answers ≤2 words

Part 4 (Q31-40): Academic lecture / monologue
  Group 1 — note_completion: 10 questions (31-40), labels, answers ≤1 word or a number

QUALITY RULES:
- ALL answers must appear verbatim in the transcript
- Use realistic UK English (names, places, currency £)
- transcript_quote must be exact wording from the transcript
- options in multiple_choice must be plausible distractors
- For matching, options_pool must have exactly 7 entries`;

// ============================================================
// Topic pools by part
// ============================================================
const PART_TOPICS: Record<string, string[]> = {
  "Part 1": [
    "Hotel room booking enquiry",
    "Gym membership registration",
    "Library card sign-up",
    "Dentist appointment scheduling",
    "Language course enrolment",
    "Bicycle rental service",
    "Museum event booking",
    "Property letting enquiry",
    "Phone plan upgrade",
    "Travel insurance query",
    "Sports club membership",
    "Car hire enquiry",
  ],
  "Part 2": [
    "Community centre facilities tour",
    "Radio broadcast about local recycling scheme",
    "Guide talk at a nature reserve",
    "Induction talk for new employees",
    "Podcast about sustainable living",
    "Museum audio guide for an exhibition",
    "Talk about volunteer opportunities",
    "Public information about a new bus route",
  ],
  "Part 3": [
    "Two students discussing their research project",
    "Tutor and student reviewing an essay",
    "Three students planning a group presentation",
    "Two classmates comparing fieldwork experiences",
    "Students debating approaches to a business case study",
    "Academic and student discussing dissertation findings",
  ],
  "Part 4": [
    "Lecture on animal migration patterns",
    "Talk on the history of the printing press",
    "Academic lecture on coral reef ecosystems",
    "Talk on the psychology of decision-making",
    "Lecture on ancient trade routes",
    "Academic talk on renewable energy innovations",
    "Lecture on ocean plastic pollution",
    "Talk on the history of urban planning",
  ],
};

// ============================================================
// Generate one part via Claude API (with up to maxAttempts retries)
// ============================================================
async function generateOnePart(
  partLabel: string,
  topic: string,
  difficulty: string,
  apiKey: string,
  maxAttempts = 3,
): Promise<Record<string, unknown> | null> {
  const difficultyNote =
    difficulty === "easy"
      ? "Answers should be explicitly stated, no paraphrasing, simple vocabulary."
      : difficulty === "medium"
      ? "Some paraphrasing, mild distractors, moderate vocabulary."
      : "Heavy paraphrasing, strong distractors, academic vocabulary — answers are easy to miss.";

  const userPrompt = `Generate IELTS Listening ${partLabel}.
SCENARIO: ${topic}
DIFFICULTY: ${difficulty} — ${difficultyNote}`;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "x-api-key": apiKey,
          "anthropic-version": "2023-06-01",
          "content-type": "application/json",
        },
        body: JSON.stringify({
          model: "claude-haiku-4-5-20251001",
          max_tokens: 6000,
          temperature: 0.8,
          messages: [{ role: "user", content: `${PART_SYSTEM_PROMPT}\n\n${userPrompt}` }],
        }),
      });

      if (!res.ok) {
        console.warn(`AI call for ${partLabel} attempt ${attempt} failed: ${res.status}`);
        continue;
      }

      const data = await res.json();
      const text: string = data.content?.[0]?.text ?? "";
      const match = text.match(/\{[\s\S]*\}/);
      if (!match) {
        console.warn(`AI output for ${partLabel} attempt ${attempt} contained no JSON`);
        continue;
      }

      let parsed: Record<string, unknown>;
      try {
        parsed = JSON.parse(match[0]);
      } catch {
        console.warn(`AI output for ${partLabel} attempt ${attempt} had invalid JSON`);
        continue;
      }

      // Validate minimum structure
      if (
        typeof parsed.part_number !== "number" ||
        !parsed.transcript ||
        !Array.isArray(parsed.question_groups) ||
        parsed.question_groups.length === 0
      ) {
        console.warn(`AI output for ${partLabel} attempt ${attempt} missing required fields`);
        continue;
      }

      // Ensure every question_group has items array
      let groupsOk = true;
      for (const g of parsed.question_groups as Array<Record<string, unknown>>) {
        if (!Array.isArray(g.items) || (g.items as unknown[]).length === 0) {
          console.warn(`AI output for ${partLabel} attempt ${attempt} has empty question group`);
          groupsOk = false;
          break;
        }
      }
      if (!groupsOk) continue;

      console.log(`AI generated ${partLabel} on attempt ${attempt}`);
      return parsed;
    } catch (e) {
      console.warn(`AI call for ${partLabel} attempt ${attempt} threw:`, e);
    }
  }

  console.error(`All ${maxAttempts} attempts failed for ${partLabel}`);
  return null;
}

// ============================================================
// Main handler
// ============================================================
serve(async (req) => {
  if (req.method === "OPTIONS") {
    return handleCorsPreflightRequest(req);
  }

  try {
    let requestBody;
    try {
      requestBody = await req.json();
    } catch {
      return validationError("Invalid JSON body", undefined, corsHeaders);
    }

    const validation = validateRequest(GenerateListeningSchema, requestBody);
    if (!validation.success) {
      return validationError(validation.error.message, validation.error.details, corsHeaders);
    }

    const { difficulty, exclude_id, exclude_topics = [] } = validation.data;

    const auth = await verifyUser(req);
    if (!auth.success) {
      return unauthorizedError(auth.error ?? "Authentication required", corsHeaders);
    }

    const rateLimit = await checkRateLimit(auth.userId!, "generate-listening");
    if (!rateLimit.allowed) {
      return rateLimitError(undefined, rateLimit.retryAfter, corsHeaders);
    }

    const ANTHROPIC_API_KEY = Deno.env.get("ANTHROPIC_API_KEY");
    const USE_MOCK_DATA =
      Deno.env.get("USE_MOCK_DATA") === "true" ||
      Deno.env.get("USE_MOCK_LISTENING_DATA") === "true";

    // ============================================================
    // PRIMARY: AI generation (4 parallel calls, one per part)
    // ============================================================
    if (ANTHROPIC_API_KEY && !USE_MOCK_DATA) {
      const partLabels = ["Part 1", "Part 2", "Part 3", "Part 4"];
      const excludeSet = new Set((exclude_topics ?? []).map((t: string) => t.toLowerCase()));
      const topics = partLabels.map((p) => {
        const pool = PART_TOPICS[p] ?? PART_TOPICS["Part 1"];
        const available = pool.filter(t => !excludeSet.has(t.toLowerCase()));
        const pick = available.length > 0 ? available : pool;
        return pick[Math.floor(Math.random() * pick.length)];
      });

      console.log("Generating AI listening test:", { difficulty, topics });

      const results = await Promise.all(
        partLabels.map((p, i) => generateOnePart(p, topics[i], difficulty, ANTHROPIC_API_KEY)),
      );

      if (results.every((r) => r !== null)) {
        const sections = results as Record<string, unknown>[];
        const responseData = {
          id: crypto.randomUUID(),
          title: topics[0],
          difficulty,
          totalQuestions: 40,
          durationMinutes: 30,
          topicTags: topics,
          sections,
          generatedAt: new Date().toISOString(),
          source: "ai",
        };
        console.log("Served AI-generated listening test");
        return successResponse(responseData, 200, corsHeaders);
      }

      console.warn("One or more AI parts failed, falling back to library");
    }

    // ============================================================
    // FALLBACK: library
    // ============================================================
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (supabaseUrl && supabaseServiceKey) {
      try {
        const adminLibrary = createClient(supabaseUrl, supabaseServiceKey);
        let query = adminLibrary
          .from("listening_test_library")
          .select("id, title, difficulty, total_questions, duration_minutes, sections, topic_tags")
          .eq("difficulty", difficulty)
          .eq("is_active", true);
        if (exclude_id) query = query.neq("id", exclude_id);
        const { data: tests, error: libErr } = await query;

        if (!libErr && tests && tests.length > 0) {
          const pick = tests[Math.floor(Math.random() * tests.length)];
          const responseData = {
            id: pick.id,
            title: pick.title,
            difficulty: pick.difficulty,
            totalQuestions: pick.total_questions,
            durationMinutes: pick.duration_minutes,
            topicTags: pick.topic_tags ?? [],
            sections: pick.sections.sections ?? pick.sections,
            generatedAt: new Date().toISOString(),
            source: "library",
          };
          console.log("Served listening test from library:", pick.title);
          return successResponse(responseData, 200, corsHeaders);
        }

        if (libErr) console.warn("Library lookup failed:", libErr.message);
        else console.warn("No library tests for difficulty:", difficulty);
      } catch (e) {
        console.warn("Library access threw:", e);
      }
    }

    // ============================================================
    // LAST RESORT: mock data
    // ============================================================
    console.log("All sources failed — serving mock data");
    const mockTest = getMockListeningTest("Part 1", difficulty);
    return successResponse(
      {
        ...mockTest,
        generatedAt: new Date().toISOString(),
        id: crypto.randomUUID(),
        source: "mock",
      },
      200,
      corsHeaders,
    );
  } catch (error: unknown) {
    console.error("generate-listening error:", error);
    return internalError(
      error instanceof Error ? error.message : "Unknown error",
      { error: String(error) },
      corsHeaders,
    );
  }
});
