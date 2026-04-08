import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { validateRequest, GenerateListeningSchema } from "../shared/validation.ts";
import {
  corsHeaders,
  handleCorsPreflightRequest,
  successResponse,
  validationError,
  unauthorizedError,
  rateLimitError,
  aiServiceError,
  internalError,
} from "../shared/errors.ts";
import { verifyUser } from "../shared/auth.ts";
import { checkRateLimit } from "../shared/rate-limit.ts";
import { getMockListeningTest } from "./mock-data.ts";

// ============================================================
// IELTS Listening Generator — System Prompt
// Based on official IELTS 2023 Sample Task formats
// ============================================================
const LISTENING_SYSTEM_PROMPT = `You are a senior IELTS Listening test designer with 20+ years of experience creating official Cambridge IELTS materials. You have studied all official IELTS Listening sample task types:
- Form/Note/Table Completion
- Multiple Choice (A/B/C)
- Short-answer Questions
- Sentence Completion
- Matching (speaker to opinion / feature to list)
- Plan/Map/Diagram Labelling

=== TEST STRUCTURE ===
Generate ONE complete Part of an IELTS Listening test (the part is specified in the request).

Part 1: Two-person conversation in an everyday social/transactional context (e.g., booking, enquiry, registration). 8-10 questions. Types: Form Completion, Multiple Choice, Short-answer.

Part 2: A monologue in an everyday social context (e.g., radio broadcast, tour guide, community talk). 10 questions. Types: Short-answer, Multiple Choice, Note Completion, Diagram Labelling.

Part 3: A conversation between 2-4 speakers in an educational/training context (e.g., students discussing an assignment). 10 questions. Types: Matching, Multiple Choice, Sentence Completion.

Part 4: An academic lecture or monologue. 10 questions. Types: Note Completion, Sentence Completion, Multiple Choice.

=== TRANSCRIPT REQUIREMENTS ===
- Write a complete, natural tapescript (250-400 words for Part 1/2, 400-600 words for Part 3/4)
- Embed answers NATURALLY in the conversation — do not make them stand out
- Use realistic names, places, and numbers
- Include natural speech features: hesitation fillers (um, well, right), false starts, clarifications
- Answers should test LISTENING COMPREHENSION, not reading

=== QUESTION REQUIREMENTS ===
- Use EXACTLY the question types and counts specified
- Form Completion: blanks should be short (1-3 words or a number)
- Multiple Choice: 3 options (A/B/C), only one correct
- Short-answer: "NO MORE THAN THREE WORDS AND/OR A NUMBER"
- Sentence Completion: "NO MORE THAN TWO WORDS"
- Note Completion: "ONE WORD AND/OR A NUMBER"
- Matching: pool has 2+ more options than questions (distractors)

=== ANSWER KEY REQUIREMENTS ===
For each answer:
1. The exact correct answer
2. The verbatim quote from the transcript where the answer appears
3. For number/word equivalents, accept both (e.g. "7 / seven")

=== STRICT JSON OUTPUT ===
{
  "part": "Part 1",
  "context": "Short description of scenario",
  "transcript": "Full tapescript text here...",
  "sections": [
    {
      "type": "form_completion",
      "title": "PACKHAM'S SHIPPING AGENCY – customer quotation form",
      "instruction": "Complete the form below. Write NO MORE THAN THREE WORDS AND/OR A NUMBER for each answer.",
      "questions": [
        {
          "number": 1,
          "label": "Name",
          "answer": "Mkere",
          "transcript_quote": "It's Jacob Mkere. Can you spell your surname? Yes, it's M-K-E-R-E.",
          "accept_alternatives": []
        }
      ]
    },
    {
      "type": "multiple_choice",
      "instruction": "Choose the correct letter, A, B or C.",
      "questions": [
        {
          "number": 9,
          "question": "Type of insurance chosen",
          "options": {"A": "Economy", "B": "Standard", "C": "Premium"},
          "answer": "C",
          "transcript_quote": "I've been stung before with Economy insurance so I'll go for the highest.",
          "explanation": "The highest tier is Premium."
        }
      ]
    }
  ],
  "answer_key": {
    "1": "Mkere",
    "9": "C"
  },
  "ai_secret_context": "If the answer is a number, allow both digits and words. Ignore capitalisation differences. For spelling-based answers, accept minor variants.",
  "difficulty": "medium",
  "duration_minutes": 30,
  "topic": "Shipping enquiry"
}`;

// ============================================================
// Topic pools by part (varied to avoid repetition)
// ============================================================
const PART_TOPICS: Record<string, string[]> = {
  "Part 1": [
    "Hotel room booking",
    "Gym membership enquiry",
    "Library card registration",
    "Dentist appointment scheduling",
    "Language course enrolment",
    "Bicycle rental service",
    "Museum event booking",
    "Property letting enquiry",
    "Phone plan upgrade",
    "Travel insurance query",
  ],
  "Part 2": [
    "Community centre facilities tour",
    "Radio broadcast about local recycling scheme",
    "Guide talk at a nature reserve",
    "Induction talk for new employees",
    "Podcast about sustainable living",
    "Public announcement about road works",
    "Museum audio guide for an exhibition",
    "Talk about volunteer opportunities",
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
    "Academic lecture on urban heat islands",
    "Lecture on coral reef ecosystems",
    "Talk on the psychology of decision-making",
    "Lecture on ancient trade routes",
    "Academic talk on renewable energy innovations",
  ],
};

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

    const { difficulty, part } = validation.data;

    // Verify user authentication before making any API call
    const auth = await verifyUser(req);
    if (!auth.success) {
      return unauthorizedError(auth.error ?? "Authentication required", corsHeaders);
    }

    // Check per-user rate limit (5 requests per hour)
    const rateLimit = await checkRateLimit(auth.userId!, "generate-listening");
    if (!rateLimit.allowed) {
      return rateLimitError(undefined, rateLimit.retryAfter, corsHeaders);
    }

    const ANTHROPIC_API_KEY = Deno.env.get("ANTHROPIC_API_KEY");
    const USE_MOCK_DATA = Deno.env.get("USE_MOCK_DATA") === "true";

    // Global mock mode or missing API key — serve mock without hitting Claude
    if (USE_MOCK_DATA || !ANTHROPIC_API_KEY) {
      console.log("Mock mode active, skipping Claude API call");
      const mockTest = getMockListeningTest(part, difficulty);
      return successResponse({
        ...mockTest,
        generatedAt: new Date().toISOString(),
        id: crypto.randomUUID(),
        isMock: true,
      }, 200, corsHeaders);
    }

    // Pick a random topic for the requested part
    const topicPool = PART_TOPICS[part] ?? PART_TOPICS["Part 1"];
    const topic = topicPool[Math.floor(Math.random() * topicPool.length)];

    // Determine question structure per part
    const partConfig: Record<string, string> = {
      "Part 1": `Generate ONE section of type 'form_completion' (8 questions) followed by ONE section of type 'multiple_choice' (2 questions). Total = 10 questions.`,
      "Part 2": `Generate ONE section of type 'multiple_choice' (3 questions) followed by ONE section of type 'note_completion' (7 questions). Total = 10 questions.`,
      "Part 3": `Generate ONE section of type 'matching' (5 questions, pool of 7 options) followed by ONE section of type 'sentence_completion' (5 questions). Total = 10 questions.`,
      "Part 4": `Generate ONE section of type 'note_completion' (10 questions). Total = 10 questions.`,
    };

    const userPrompt = `Generate a complete IELTS Listening test ${part}.

SCENARIO: ${topic}
DIFFICULTY: ${difficulty}
STRUCTURE: ${partConfig[part] ?? partConfig["Part 1"]}

REQUIREMENTS:
- Write a natural, complete tapescript (voices/speakers clearly labelled)
- ALL answers must appear verbatim in the transcript
- Question numbers start at 1 for Part 1, 11 for Part 2, 21 for Part 3, 31 for Part 4
- Difficulty "${difficulty}": ${difficulty === "easy" ? "clear vocabulary, explicit answers, no distractors" : difficulty === "medium" ? "some paraphrasing, mild distractors, moderate vocabulary" : "heavy paraphrasing, strong distractors, academic vocabulary, answers easy to miss"}

Return ONLY valid JSON matching the specified schema. No markdown, no commentary.`;

    console.log("Generating listening test:", { part, topic, difficulty });

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key": ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
        "content-type": "application/json",
      },
      body: JSON.stringify({
        model: "claude-haiku-4-5-20251001",
        max_tokens: 4096,
        temperature: 0.8,
        messages: [
          { role: "user", content: `${LISTENING_SYSTEM_PROMPT}\n\n${userPrompt}` },
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Claude API error:", response.status, errorText);

      if (response.status === 429) return rateLimitError(undefined, 60, corsHeaders);
      if (response.status === 401) return unauthorizedError("Invalid API key", corsHeaders);
      return aiServiceError("Failed to generate listening test", { status: response.status }, corsHeaders);
    }

    const data = await response.json();
    const aiText = data.content?.[0]?.text;

    let parsed;
    try {
      const jsonMatch = aiText.match(/\{[\s\S]*\}/);
      if (!jsonMatch) throw new Error("No JSON found");
      parsed = JSON.parse(jsonMatch[0]);
    } catch (e) {
      console.error("JSON parse error:", e, aiText?.substring(0, 300));
      return aiServiceError("Failed to parse AI response. Please try again.", {
        error: String(e),
        preview: aiText?.substring(0, 200),
      }, corsHeaders);
    }

    // Validate minimum structure
    if (!parsed.transcript || !parsed.sections || !parsed.answer_key) {
      return aiServiceError("AI returned incomplete listening test data.", {
        hasTranscript: !!parsed.transcript,
        hasSections: !!parsed.sections,
        hasAnswerKey: !!parsed.answer_key,
      }, corsHeaders);
    }

    parsed.generatedAt = new Date().toISOString();
    parsed.id = crypto.randomUUID();

    console.log("Successfully generated listening test:", {
      part: parsed.part,
      topic,
      sectionCount: parsed.sections?.length,
      questionCount: Object.keys(parsed.answer_key || {}).length,
    });

    return successResponse(parsed, 200, corsHeaders);
  } catch (error: unknown) {
    console.error("generate-listening error:", error);
    return internalError(
      error instanceof Error ? error.message : "Unknown error",
      { error: String(error) },
      corsHeaders
    );
  }
});
