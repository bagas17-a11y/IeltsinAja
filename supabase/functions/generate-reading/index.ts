import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { validateRequest, GenerateReadingSchema } from "../shared/validation.ts";
import {
  corsHeaders,
  handleCorsPreflightRequest,
  successResponse,
  validationError,
  unauthorizedError,
  rateLimitError,
  aiServiceError,
  internalError
} from "../shared/errors.ts";
import { verifyUser } from "../shared/auth.ts";
import { checkRateLimit } from "../shared/rate-limit.ts";
import { getMockReadingTest } from "./mock-data.ts";

const READING_GENERATOR_PROMPT = `You are an IELTS Academic Reading test designer with 20+ years of experience creating official Cambridge IELTS materials. You are familiar with ALL official question types from the IDP/British Council/Cambridge past papers.

=== YOUR TASK ===
Generate a complete IELTS Academic Reading passage with questions that precisely mirrors the real exam format, incorporating the full range of official question types.

=== PASSAGE REQUIREMENTS ===
- Length: 700-900 words
- Style: Academic, formal, third-person, structured with clear paragraphs (labelled A, B, C…)
- Topics: Rotate between Archaeology, Climate Science, Urban Planning, Psychology, Marine Biology, Technology History, Anthropology, Economics, Environmental Science, Cognitive Science
- Difficulty levels:
  - Easy: Straightforward vocabulary, explicit answers, clear topic sentences
  - Medium: Some technical terms, mild paraphrasing required, some implicit information
  - Hard: Dense academic prose, heavy paraphrasing, abstract concepts, nuanced arguments

=== QUESTION MIX (EXACTLY 13 QUESTIONS) ===
Generate questions using a RANDOM selection from these official IELTS question types.
Each generation should vary the mix. Choose 3 types from the list below:

OPTION SET A (always generate):
- Type "tfng": True/False/Not Given (5 questions) — statements the candidate classifies as TRUE, FALSE, or NOT GIVEN. At least 1 must be NOT GIVEN.

OPTION SET B (choose ONE per generation):
- Type "matching_headings": Matching Headings (4 questions) — match a heading from a pool of 6 to paragraphs B–E. Pool has 2 distractors.
- Type "multiple_choice": Multiple Choice A/B/C/D (4 questions) — one should test the writer's purpose or overall meaning.
- Type "matching_features": Matching Features (4 questions) — match statements to categories/sources listed in a box (pool of 5, 1 distractor; options can repeat).

OPTION SET C (choose ONE per generation):
- Type "sentence_completion": Sentence Completion (4 questions) — fill blanks with words from passage, max TWO WORDS each.
- Type "summary_completion": Summary Completion with Word Bank (4 questions) — fill gaps from a box of 7 words (3 distractors).
- Type "matching_sentence_endings": Matching Sentence Endings (4 questions) — complete sentence starters by choosing from a pool of 6 endings (2 distractors).

=== ANSWER KEY REQUIREMENTS ===
For EVERY question, provide:
1. The exact correct answer
2. The verbatim sentence(s) from the passage that prove the answer
3. A brief explanation of the logic

=== STRICT JSON OUTPUT FORMAT ===
{
  "passage": {
    "title": "Academic title",
    "content": "Full 700-900 word passage. Paragraphs labelled A, B, C, D, E, F...",
    "topic": "e.g., Climate Science",
    "wordCount": 850
  },
  "difficulty": "easy/medium/hard",
  "questions": {
    "typeA": {
      "type": "tfng",
      "instruction": "Do the following statements agree with the information in the passage? Write TRUE if the statement agrees with the information, FALSE if the statement contradicts the information, NOT GIVEN if there is no information on this.",
      "items": [
        {
          "number": 1,
          "statement": "Statement text here",
          "answer": "TRUE",
          "evidence": "Exact quote from passage",
          "explanation": "Why this is the answer"
        }
      ]
    },
    "typeB": {
      "type": "multiple_choice",
      "instruction": "Choose the correct letter, A, B, C or D.",
      "items": [
        {
          "number": 6,
          "question": "Question text here?",
          "options": { "A": "...", "B": "...", "C": "...", "D": "..." },
          "answer": "B",
          "evidence": "Exact quote from passage",
          "explanation": "Why B is correct"
        }
      ]
    },
    "typeC": {
      "type": "sentence_completion",
      "instruction": "Complete the sentences below. Choose NO MORE THAN TWO WORDS from the passage for each answer.",
      "items": [
        {
          "number": 10,
          "sentence": "The researchers discovered that _____ was the primary cause.",
          "answer": "climate change",
          "evidence": "Exact quote from passage",
          "explanation": "The answer comes from paragraph 3"
        }
      ]
    }
  },
  "metadata": {
    "estimatedTime": "20 minutes",
    "questionTypes": ["tfng", "multiple_choice", "sentence_completion"],
    "skillsFocus": ["Skimming", "Scanning", "Inference"]
  }
}

IMPORTANT: For "matching_headings" typeB, use this structure:
"typeB": {
  "type": "matching_headings",
  "instruction": "The Reading Passage has several paragraphs A–E. Choose the correct heading for each paragraph from the list of headings below.",
  "headings_pool": ["i. ...", "ii. ...", "iii. ...", "iv. ...", "v. ...", "vi. ..."],
  "items": [{"number": 6, "paragraph": "B", "answer": "iii", "evidence": "...", "explanation": "..."}]
}

For "matching_features" typeB:
"typeB": {
  "type": "matching_features",
  "instruction": "Look at the following statements and the list of sources/categories. Match each statement to the correct source/category.",
  "options_pool": {"A": "Category A", "B": "Category B", "C": "Category C", "D": "Category D", "E": "Category E"},
  "note": "NB You may use any letter more than once.",
  "items": [{"number": 6, "statement": "...", "answer": "B", "evidence": "...", "explanation": "..."}]
}

For "summary_completion" typeC:
"typeC": {
  "type": "summary_completion",
  "instruction": "Complete the summary below. Choose NO MORE THAN ONE WORD from the box for each answer.",
  "word_bank": ["word1", "word2", "word3", "word4", "word5", "word6", "word7"],
  "summary": "The passage explains that ___10___ played a critical role in...",
  "items": [{"number": 10, "answer": "word3", "evidence": "...", "explanation": "..."}]
}

For "matching_sentence_endings" typeC:
"typeC": {
  "type": "matching_sentence_endings",
  "instruction": "Complete each sentence with the correct ending A–F from the box below.",
  "endings_pool": {"A": "...", "B": "...", "C": "...", "D": "...", "E": "...", "F": "..."},
  "items": [{"number": 10, "sentence_start": "The early researchers...", "answer": "C", "evidence": "...", "explanation": "..."}]
}`;

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return handleCorsPreflightRequest(req);
  }

  try {
    // Parse and validate request body
    let requestBody;
    try {
      requestBody = await req.json();
    } catch {
      return validationError("Invalid JSON body", undefined, corsHeaders);
    }

    // Validate request data
    const validation = validateRequest(GenerateReadingSchema, requestBody);
    if (!validation.success) {
      return validationError(
        validation.error.message,
        validation.error.details,
        corsHeaders
      );
    }

    const { difficulty } = validation.data;

    // Verify user authentication before making any API call
    const auth = await verifyUser(req);
    if (!auth.success) {
      return unauthorizedError(auth.error ?? "Authentication required", corsHeaders);
    }

    // Check per-user rate limit (10 requests per hour)
    const rateLimit = await checkRateLimit(auth.userId!, "generate-reading");
    if (!rateLimit.allowed) {
      return rateLimitError(undefined, rateLimit.retryAfter, corsHeaders);
    }

    const ANTHROPIC_API_KEY = Deno.env.get("ANTHROPIC_API_KEY");
    // USE_MOCK_DATA is the global kill switch; USE_MOCK_READING_DATA is the legacy per-function flag
    const USE_MOCK_DATA = Deno.env.get("USE_MOCK_DATA") === "true" || Deno.env.get("USE_MOCK_READING_DATA") === "true";

    // Use mock data if enabled or if API key is missing
    if (USE_MOCK_DATA || !ANTHROPIC_API_KEY) {
      console.log("Using mock reading data (API key missing or mock mode enabled)");
      const mockTest = getMockReadingTest(difficulty);
      const responseData = {
        ...mockTest,
        generatedAt: new Date().toISOString(),
        id: crypto.randomUUID(),
        isMock: true
      };
      return successResponse(responseData, 200, corsHeaders);
    }

    // Randomly select a topic
    const topics = [
      "Archaeology",
      "Climate Science",
      "Urban Planning",
      "Marine Biology",
      "Psychology",
      "Technology History",
      "Anthropology",
      "Economics",
      "Environmental Science",
      "Cognitive Science",
      "Linguistics",
      "Astronomy",
      "Medical Research",
      "Biodiversity",
      "Ancient Civilisations",
    ];
    const randomTopic = topics[Math.floor(Math.random() * topics.length)];

    // Randomly choose Type B and Type C question types for variety
    const typeBOptions = ["multiple_choice", "matching_headings", "matching_features"];
    const typeCOptions = ["sentence_completion", "summary_completion", "matching_sentence_endings"];
    const selectedTypeB = typeBOptions[Math.floor(Math.random() * typeBOptions.length)];
    const selectedTypeC = typeCOptions[Math.floor(Math.random() * typeCOptions.length)];

    const userPrompt = `Generate a complete IELTS Academic Reading passage and question set.

REQUIREMENTS:
- Topic: ${randomTopic}
- Difficulty: ${difficulty}
- EXACTLY 13 questions total
- Type A (Questions 1-5): "tfng" — True/False/Not Given (at least 1 must be NOT GIVEN)
- Type B (Questions 6-9): "${selectedTypeB}" — follow the exact schema for this type
- Type C (Questions 10-13): "${selectedTypeC}" — follow the exact schema for this type

CRITICAL RULES:
- Passage MUST be 700-900 words with paragraphs labelled A, B, C, D, E, F
- ALL answers must be directly verifiable from the passage
- Include the verbatim evidence sentence for EVERY question
- Passage must be academically rigorous but readable
- For matching_headings: create a pool of 6 headings (2 are distractors)
- For matching_features: create a pool of 5 category options (1 is a distractor); options CAN repeat
- For summary_completion: provide a 7-word bank (3 distractors); summary should paraphrase passage
- For matching_sentence_endings: provide 6 endings in the pool (2 distractors)

Return ONLY valid JSON in the specified schema format. No markdown, no commentary.`;

    console.log("Generating reading passage with topic:", randomTopic, "difficulty:", difficulty);

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key": ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
        "content-type": "application/json",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-6",
        max_tokens: 8192,
        temperature: 0.8,
        messages: [
          { role: "user", content: `${READING_GENERATOR_PROMPT}\n\n${userPrompt}` },
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Claude API error:", response.status, errorText);

      // Fall back to mock data for any API failure (credits, billing, overloaded, etc.)
      console.log("Claude API unavailable (status:", response.status, "), falling back to mock reading test");
      const mockTest = getMockReadingTest(difficulty);
      const responseData = {
        ...mockTest,
        generatedAt: new Date().toISOString(),
        id: crypto.randomUUID(),
        isMock: true,
        note: "Generated using mock data (Claude API unavailable)",
      };
      return successResponse(responseData, 200, corsHeaders);
    }

    const data = await response.json();
    const aiResponse = data.content?.[0]?.text;
    console.log("AI Response received, length:", aiResponse?.length);

    // Parse JSON from response
    let parsedResponse;
    try {
      const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        parsedResponse = JSON.parse(jsonMatch[0]);
      } else {
        console.error("No JSON found in AI response. Response:", aiResponse?.substring(0, 500));
        throw new Error("No JSON found in response");
      }
    } catch (parseError) {
      console.error("JSON parse error:", parseError);
      console.error("AI response text:", aiResponse?.substring(0, 500));
      return aiServiceError("Failed to parse AI response. Please try again.", {
        error: String(parseError),
        responsePreview: aiResponse?.substring(0, 200)
      }, corsHeaders);
    }

    // Validate response structure
    if (!parsedResponse.passage || !parsedResponse.questions) {
      console.error("Invalid response structure:", parsedResponse);
      return aiServiceError("AI returned incomplete data. Please try again.", {
        hasPassage: !!parsedResponse.passage,
        hasQuestions: !!parsedResponse.questions
      }, corsHeaders);
    }

    if (!parsedResponse.passage.title || !parsedResponse.passage.content) {
      console.error("Invalid passage structure:", parsedResponse.passage);
      return aiServiceError("AI returned invalid passage format. Please try again.", {
        hasTitle: !!parsedResponse.passage?.title,
        hasContent: !!parsedResponse.passage?.content
      }, corsHeaders);
    }

    // Add timestamp for caching
    parsedResponse.generatedAt = new Date().toISOString();
    parsedResponse.id = crypto.randomUUID();

    console.log("Successfully generated reading passage:", {
      title: parsedResponse.passage.title,
      questionCount: Object.values(parsedResponse.questions).reduce((sum: number, q: any) => sum + (q.items?.length || 0), 0)
    });

    return successResponse(parsedResponse, 200, corsHeaders);
  } catch (error: unknown) {
    console.error("Generate reading error:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return internalError(errorMessage, { error: String(error) }, corsHeaders);
  }
});
