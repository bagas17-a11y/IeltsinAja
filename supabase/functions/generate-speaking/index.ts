import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { validateRequest, GenerateSpeakingSchema } from "../shared/validation.ts";
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

// ============================================================
// IELTS Speaking Generator — System Prompt
// Based on official IELTS 2023 Speaking Sample Tasks
// ============================================================
const SPEAKING_SYSTEM_PROMPT = `You are a senior IELTS Speaking examiner and test designer with 20+ years of experience. You create authentic IELTS Speaking questions that mirror the real exam format.

=== IELTS SPEAKING TEST STRUCTURE ===

PART 1 — Introduction and Interview (4–5 minutes)
- Examiner asks 2 familiar topics (e.g. Hometown, Work, Hobbies, Food, Technology)
- 3–5 questions per topic
- Questions are personal, conversational, and direct
- No hypothetical or abstract questions (those belong in Part 3)
- Examples: "Where are you from?", "Do you enjoy cooking?", "How often do you exercise?"

PART 2 — Individual Long Turn (3–4 minutes)
- Examiner gives a cue card with: "Describe a [topic]"
- Card has 3 bullet-point prompts (where/when/who/what/why/how)
- Final instruction: "and explain [why/how/what impact]..."
- Candidate gets 1 minute to prepare, then speaks for 1–2 minutes
- Examiner asks 1–2 short rounding-off questions afterwards

PART 3 — Two-way Discussion (4–5 minutes)
- Thematically linked to Part 2 but more abstract and societal
- 4–6 questions exploring the topic from society/global/comparison angle
- Include: comparison (past vs present), speculation (future trends), opinion, cause-effect
- Examples: "How has [topic] changed in recent years?", "Why do you think [phenomenon] happens?", "Do you think [future trend]?"

=== GENERATION RULES ===
1. Part 1 questions must be answerable from personal experience only
2. Part 2 cue card must follow the exact structure: prompt + 3 bullets + final "and explain..." instruction
3. Part 3 must become progressively more abstract, societal, and analytical
4. All questions must be grammatically natural in spoken English
5. Topics must be culturally diverse and globally relevant

=== OUTPUT FORMAT (STRICT JSON) ===
{
  "topic": "Main theme connecting all 3 parts",
  "part1": {
    "topics": [
      {
        "theme": "Hometown",
        "questions": [
          "What kind of place is it?",
          "What is the most interesting part of your town?",
          "What kind of jobs do people in your town do?",
          "Would you say it is a good place to live? Why?"
        ]
      },
      {
        "theme": "Accommodation",
        "questions": [
          "Tell me about the kind of accommodation you live in.",
          "How long have you lived there?",
          "What do you like about living there?",
          "What sort of accommodation would you most like to live in?"
        ]
      }
    ]
  },
  "part2": {
    "cue_card": "Describe something you own which is very important to you.",
    "bullet_points": [
      "where you got it from",
      "how long you have had it",
      "what you use it for"
    ],
    "final_instruction": "and explain why it is important to you.",
    "prep_time": "1 minute",
    "speak_time": "1–2 minutes",
    "rounding_off_questions": [
      "Is it valuable in terms of money?",
      "Would it be easy to replace?"
    ]
  },
  "part3": {
    "theme": "The role of possessions in modern life",
    "questions": [
      "What kind of things give status to people in your country?",
      "Have attitudes towards material possessions changed since your parents' time?",
      "Do you think advertising influences what people choose to buy?",
      "In the future, do you think people will place more or less importance on owning things?",
      "Are there differences between generations in terms of what they value owning?"
    ]
  },
  "examiner_notes": {
    "part1_purpose": "Establish rapport; test fluency on familiar topics",
    "part2_purpose": "Extended monologue; test ability to organise and develop ideas",
    "part3_purpose": "Abstract discussion; test ability to analyse, speculate, compare"
  }
}`;

// ============================================================
// Speaking topic themes (varied, culturally neutral)
// ============================================================
const SPEAKING_THEMES = [
  "Technology and daily life",
  "Nature and the environment",
  "Travel and exploration",
  "Education and learning",
  "Food and culture",
  "Health and wellbeing",
  "Work and career",
  "Art and creativity",
  "Family and relationships",
  "Sport and physical activity",
  "Music and entertainment",
  "Shopping and consumerism",
  "City life and urban development",
  "Traditions and celebrations",
  "Animals and wildlife",
  "Books and reading",
  "Memory and the past",
  "Plans and ambitions",
  "Helping others and community",
  "Fashion and personal style",
];

function getMockSpeakingTest(theme: string, difficulty: string) {
  return {
    id: crypto.randomUUID(),
    topic: theme,
    difficulty,
    isMock: true,
    generatedAt: new Date().toISOString(),
    part1: {
      topics: [
        {
          theme: "Daily Routines",
          questions: [
            "What time do you usually wake up in the morning?",
            "Do you prefer mornings or evenings? Why?",
            "How do you usually spend your evenings?",
            "Has your daily routine changed much over the past few years?",
          ],
        },
        {
          theme: "Hobbies and Free Time",
          questions: [
            "What do you enjoy doing in your free time?",
            "Is there a hobby you have always wanted to try?",
            "Do you prefer indoor or outdoor activities?",
            "How much free time do you have each week?",
          ],
        },
      ],
    },
    part2: {
      cue_card: "Describe a skill you would like to learn.",
      bullet_points: [
        "what the skill is",
        "why you want to learn it",
        "how you plan to learn it",
      ],
      final_instruction: "and explain how this skill would benefit your life.",
      prep_time: "1 minute",
      speak_time: "1–2 minutes",
      rounding_off_questions: [
        "Do you think it is ever too late to learn new skills?",
        "Have you started learning this skill yet?",
      ],
    },
    part3: {
      theme: "Learning and Personal Development",
      questions: [
        "Why do you think some people are more motivated to learn new skills than others?",
        "How has technology changed the way people learn today compared to the past?",
        "Do you think governments should invest more in adult education programmes?",
        "In what ways can learning new skills benefit society as a whole?",
        "Do you think formal education or self-study is more effective for learning practical skills?",
      ],
    },
    examiner_notes: {
      part1_purpose: "Establish rapport; test fluency on familiar topics",
      part2_purpose: "Extended monologue; test ability to organise and develop ideas",
      part3_purpose: "Abstract discussion; test ability to analyse, speculate, compare",
    },
  };
}

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

    const validation = validateRequest(GenerateSpeakingSchema, requestBody);
    if (!validation.success) {
      return validationError(validation.error.message, validation.error.details, corsHeaders);
    }

    const { difficulty, theme: requestedTheme } = validation.data;
    const ANTHROPIC_API_KEY = Deno.env.get("ANTHROPIC_API_KEY");
    const USE_MOCK_DATA = Deno.env.get("USE_MOCK_DATA") === "true";

    const theme =
      requestedTheme ??
      SPEAKING_THEMES[Math.floor(Math.random() * SPEAKING_THEMES.length)];

    // Global mock mode or missing API key — return mock without calling Claude
    if (USE_MOCK_DATA || !ANTHROPIC_API_KEY) {
      console.log("Mock mode active, skipping Claude API call for speaking");
      return successResponse(getMockSpeakingTest(theme, difficulty), 200, corsHeaders);
    }

    const userPrompt = `Generate a complete IELTS Speaking test (all 3 parts).

THEME: ${theme}
DIFFICULTY LEVEL: ${difficulty}

REQUIREMENTS:
- Part 1: Generate 2 familiar personal topics related to the theme. 4 questions each.
- Part 2: Create a cue card about a specific person, place, thing, event, or experience related to the theme.
- Part 3: Generate 5 abstract discussion questions that thematically link to the Part 2 cue card.
- Difficulty "${difficulty}": ${difficulty === "easy" ? "simple vocabulary; straightforward personal questions; accessible abstract topics" : difficulty === "medium" ? "balanced complexity; mix of simple and nuanced questions; some analytical Part 3 questions" : "sophisticated vocabulary expectations; challenging abstract concepts; speculative and comparative Part 3 questions"}

CRITICAL RULES:
- Part 1 questions must NOT be abstract or societal (those go in Part 3)
- Part 2 cue card must follow the exact format: "Describe a [noun phrase]." + 3 bullet points + "and explain..."
- Part 3 questions must feel naturally linked to Part 2 but broader in scope
- All questions must be grammatically correct spoken English

Return ONLY valid JSON matching the schema. No markdown.`;

    console.log("Generating speaking test:", { theme, difficulty });

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key": ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
        "content-type": "application/json",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-6",
        max_tokens: 4096,
        temperature: 0.85,
        messages: [
          { role: "user", content: `${SPEAKING_SYSTEM_PROMPT}\n\n${userPrompt}` },
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Claude API error:", response.status, errorText);
      if (response.status === 429) return rateLimitError(undefined, 60, corsHeaders);
      if (response.status === 401) return unauthorizedError("Invalid API key", corsHeaders);
      return aiServiceError("Failed to generate speaking questions", { status: response.status }, corsHeaders);
    }

    const data = await response.json();
    const aiText = data.content?.[0]?.text;

    let parsed;
    try {
      const jsonMatch = aiText.match(/\{[\s\S]*\}/);
      if (!jsonMatch) throw new Error("No JSON found");
      parsed = JSON.parse(jsonMatch[0]);
    } catch (e) {
      console.error("JSON parse error:", e);
      return aiServiceError("Failed to parse AI response. Please try again.", {
        error: String(e),
        preview: aiText?.substring(0, 200),
      }, corsHeaders);
    }

    // Validate minimum structure
    if (!parsed.part1 || !parsed.part2 || !parsed.part3) {
      return aiServiceError("AI returned incomplete speaking test data.", {
        hasPart1: !!parsed.part1,
        hasPart2: !!parsed.part2,
        hasPart3: !!parsed.part3,
      }, corsHeaders);
    }

    parsed.generatedAt = new Date().toISOString();
    parsed.id = crypto.randomUUID();
    parsed.difficulty = difficulty;

    console.log("Successfully generated speaking test:", {
      theme: parsed.topic ?? theme,
      part1Topics: parsed.part1?.topics?.length,
      part3Questions: parsed.part3?.questions?.length,
    });

    return successResponse(parsed, 200, corsHeaders);
  } catch (error: unknown) {
    console.error("generate-speaking error:", error);
    return internalError(
      error instanceof Error ? error.message : "Unknown error",
      { error: String(error) },
      corsHeaders
    );
  }
});
