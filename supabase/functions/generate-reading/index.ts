import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { validateRequest, GenerateReadingSchema } from "../shared/validation.ts";
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
import { getMockReadingTest } from "./mock-data.ts";

// ============================================================
// Per-section system prompt — outputs in library-compatible format
// ============================================================
const SECTION_SYSTEM_PROMPT = `You are an expert IELTS Academic Reading test designer. Generate ONE SECTION (one passage with questions) of an IELTS Academic Reading test.

Return ONLY valid JSON — no markdown, no commentary:
{
  "section_number": <1|2|3>,
  "passage": {
    "title": "Passage title",
    "topic": "One-word topic category",
    "wordCount": <int approximate word count>,
    "content": "Full passage text. Use paragraph labels: A, B, C … on separate lines before each paragraph."
  },
  "question_groups": [
    {
      "type": "<tfng|ynng|multiple_choice|matching_headings|matching_features|matching_information|sentence_completion|summary_completion>",
      "instruction": "Full IELTS instruction, e.g. 'Write TRUE, FALSE or NOT GIVEN in boxes 1–7.'",
      "question_range": [startNum, endNum],
      "headings_pool": ["i. Heading one", "ii. Heading two", ...],  (matching_headings only — 2 more than questions)
      "options_pool": {"A": "...", "B": "...", ...},                 (matching_features/information — one per paragraph/feature)
      "summary": "Full summary text with gaps marked as ___N___ where N is question number.", (summary_completion only)
      "word_bank": ["word1", "word2", ...],                          (summary_completion only — 4 more words than gaps)
      "items": [
        {
          "number": <int>,
          "statement": "Full statement — tfng/ynng only",
          "question": "Full question — multiple_choice only",
          "options": {"A":"...","B":"...","C":"...","D":"..."},        (multiple_choice only)
          "sentence": "Sentence with _______ — sentence_completion only",
          "paragraph": "A",                                           (matching_information/features — the letter matched)
          "answer": "TRUE|FALSE|NOT GIVEN|A|B|C|D|exact word(s)",
          "evidence": "Verbatim quote or paragraph letter that supports the answer",
          "explanation": "Brief explanation of why this is correct"
        }
      ]
    }
  ]
}

SECTION SPECIFICATIONS:

Section 1 (Q1–13, 13 questions): Accessible academic topic — science, nature, or history
  Group 1 — tfng: 7 questions (1–7). Each item needs a clear statement and a direct answer.
  Group 2 — multiple_choice: 6 questions (8–13). 4 options A/B/C/D per question.

Section 2 (Q14–26, 13 questions): Moderately complex — technology, society, or environment
  Group 1 — matching_headings: 6 questions (14–19). Provide headings_pool with 8 headings (i–viii). Items use "paragraph" (letter A–F) as the answer.
  Group 2 — sentence_completion: 7 questions (20–26). Each item has a "sentence" with _______, answer is 1–3 words from the passage.

Section 3 (Q27–40, 14 questions): Most academic — economics, linguistics, psychology, or archaeology
  Group 1 — summary_completion: 7 questions (27–33). Provide a "summary" paragraph with gaps ___27___ … ___33___ and a word_bank of 11 words.
  Group 2 — matching_features: 7 questions (34–40). Provide options_pool mapping letters A–F to researchers/people/places. Items use "statement" and "paragraph" (letter) as answer.

PASSAGE REQUIREMENTS:
- 650–900 words (Section 1/2), 800–1000 words (Section 3)
- Write 6–8 clearly labelled paragraphs (A, B, C …)
- Academic vocabulary, neutral tone, no first/second person
- ALL answers must be findable in the passage — never invent facts
- evidence must be verbatim text or paragraph letter`;

// ============================================================
// Topic pools per section
// ============================================================
const SECTION_TOPICS: string[][] = [
  // Section 1
  [
    "The history of coffee cultivation",
    "Migration patterns of Arctic birds",
    "The development of the printing press",
    "Ancient agricultural practices in Mesoamerica",
    "The biology of deep-sea organisms",
    "The history of lighthouse engineering",
    "How bees communicate through dance",
    "The origins of the Olympic Games",
  ],
  // Section 2
  [
    "The psychology of decision-making under uncertainty",
    "Urban heat island effect and city planning",
    "The rise of social media and public discourse",
    "Sustainable architecture and green buildings",
    "The impact of fast fashion on the environment",
    "How language shapes thought and perception",
    "The economics of renewable energy transitions",
    "Digital nomadism and the future of work",
  ],
  // Section 3
  [
    "The neuroscience of memory consolidation during sleep",
    "The decline of biodiversity in freshwater ecosystems",
    "The archaeology of Mesopotamian trade networks",
    "The cognitive effects of bilingualism",
    "Quantum computing: promise and practical limitations",
    "The sociology of urban gentrification",
    "Evolutionary psychology and altruistic behaviour",
    "The history and economics of microfinance",
  ],
];

// ============================================================
// Generate one section via Claude API
// ============================================================
async function generateOneSection(
  sectionNumber: number,
  topic: string,
  difficulty: string,
  apiKey: string,
): Promise<Record<string, unknown> | null> {
  const difficultyNote =
    difficulty === "easy"
      ? "Use accessible vocabulary and make answers explicit in the text."
      : difficulty === "medium"
      ? "Mix direct and paraphrased answers. Moderate academic vocabulary."
      : "Dense academic vocabulary, heavy paraphrasing, NOT GIVEN answers are genuinely ambiguous.";

  const questionStart =
    sectionNumber === 1 ? 1 : sectionNumber === 2 ? 14 : 27;

  const userPrompt = `Generate IELTS Academic Reading Section ${sectionNumber}.
TOPIC: ${topic}
DIFFICULTY: ${difficulty} — ${difficultyNote}
Question numbers start at ${questionStart}.`;

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
        max_tokens: 4096,
        temperature: 0.7,
        messages: [{ role: "user", content: `${SECTION_SYSTEM_PROMPT}\n\n${userPrompt}` }],
      }),
    });

    if (!res.ok) {
      console.warn(`AI call for Section ${sectionNumber} failed: ${res.status}`);
      return null;
    }

    const data = await res.json();
    const text: string = data.content?.[0]?.text ?? "";
    const match = text.match(/\{[\s\S]*\}/);
    if (!match) return null;

    const parsed = JSON.parse(match[0]);

    // Validate minimum structure
    if (
      typeof parsed.section_number !== "number" ||
      !parsed.passage?.content ||
      !Array.isArray(parsed.question_groups) ||
      parsed.question_groups.length === 0
    ) {
      console.warn(`AI output for Section ${sectionNumber} missing required fields`);
      return null;
    }

    for (const g of parsed.question_groups) {
      if (!Array.isArray(g.items) || g.items.length === 0) {
        console.warn(`AI output for Section ${sectionNumber} has empty question group`);
        return null;
      }
    }

    return parsed;
  } catch (e) {
    console.warn(`AI call for Section ${sectionNumber} threw:`, e);
    return null;
  }
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

    const validation = validateRequest(GenerateReadingSchema, requestBody);
    if (!validation.success) {
      return validationError(validation.error.message, validation.error.details, corsHeaders);
    }

    const { difficulty } = validation.data;

    const auth = await verifyUser(req);
    if (!auth.success) {
      return unauthorizedError(auth.error ?? "Authentication required", corsHeaders);
    }

    const rateLimit = await checkRateLimit(auth.userId!, "generate-reading");
    if (!rateLimit.allowed) {
      return rateLimitError(undefined, rateLimit.retryAfter, corsHeaders);
    }

    const ANTHROPIC_API_KEY = Deno.env.get("ANTHROPIC_API_KEY");
    const USE_MOCK_DATA =
      Deno.env.get("USE_MOCK_DATA") === "true" ||
      Deno.env.get("USE_MOCK_READING_DATA") === "true";

    // ============================================================
    // PRIMARY: AI generation (3 parallel calls, one per section)
    // ============================================================
    if (ANTHROPIC_API_KEY && !USE_MOCK_DATA) {
      const topics = SECTION_TOPICS.map((pool) => pool[Math.floor(Math.random() * pool.length)]);

      console.log("Generating AI reading test:", { difficulty, topics });

      const results = await Promise.all(
        [1, 2, 3].map((n) => generateOneSection(n, topics[n - 1], difficulty, ANTHROPIC_API_KEY)),
      );

      if (results.every((r) => r !== null)) {
        const sections = results as Record<string, unknown>[];
        const responseData = {
          id: crypto.randomUUID(),
          title: topics[0],
          difficulty,
          totalQuestions: 40,
          durationMinutes: 60,
          topicTags: topics,
          sections,
          generatedAt: new Date().toISOString(),
          source: "ai",
        };
        console.log("Served AI-generated reading test");
        return successResponse(responseData, 200, corsHeaders);
      }

      console.warn("One or more AI sections failed, falling back to library");
    }

    // ============================================================
    // FALLBACK: library
    // ============================================================
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (supabaseUrl && supabaseServiceKey) {
      try {
        const admin = createClient(supabaseUrl, supabaseServiceKey);
        const { data: tests, error: libErr } = await admin
          .from("reading_test_library")
          .select("id, title, difficulty, total_questions, duration_minutes, sections, topic_tags")
          .eq("difficulty", difficulty)
          .eq("is_active", true);

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
          console.log("Served reading test from library:", pick.title);
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
    console.log("All sources failed — serving mock reading data");
    const mockTest = getMockReadingTest(difficulty);
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
    console.error("Generate reading error:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return internalError(errorMessage, { error: String(error) }, corsHeaders);
  }
});
