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

const READING_GENERATOR_PROMPT = `You are an IELTS Academic Reading test designer with 20+ years of experience creating official Cambridge IELTS materials.

=== YOUR TASK ===
Generate a complete IELTS Academic Reading passage with questions that precisely mirrors the real exam format.

=== PASSAGE REQUIREMENTS ===
- Length: 700-900 words
- Style: Academic, formal, third-person
- Topics: Rotate between Archaeology, Climate Science, Urban Planning, Psychology, Marine Biology, Technology History, Anthropology, Economics
- Difficulty levels:
  - Easy: Straightforward vocabulary, clear topic sentences
  - Medium: Some technical terms, implicit information
  - Hard: Dense academic prose, abstract concepts, nuanced arguments

=== QUESTION MIX (EXACTLY 13 QUESTIONS) ===
Generate a balanced mix with these EXACT types:

Type A (Questions 1-5): True/False/Not Given OR Yes/No/Not Given
- 5 statements to classify
- Must include at least 1 "Not Given" answer (information not in passage)
- Statements should test understanding, not just word matching

Type B (Questions 6-9): Multiple Choice (4 options each)
- 4 questions with options A, B, C, D
- Mix of detail questions and inference questions
- One question should ask about the writer's purpose or main idea

Type C (Questions 10-13): Sentence/Summary Completion
- 4 fill-in-the-blank questions
- Answers should be 1-3 words from the passage
- Provide a word limit instruction (e.g., "NO MORE THAN TWO WORDS")

=== ANSWER KEY REQUIREMENTS ===
For EVERY question, provide:
1. The correct answer
2. The EXACT sentence(s) from the passage that proves/supports the answer
3. A brief explanation of the logic

=== OUTPUT FORMAT (STRICT JSON) ===
{
  "passage": {
    "title": "Academic title",
    "content": "Full 700-900 word passage with clear paragraph breaks",
    "topic": "e.g., Climate Science",
    "wordCount": 850
  },
  "difficulty": "easy/medium/hard",
  "questions": {
    "typeA": {
      "instruction": "Do the following statements agree with the information in the passage? Write TRUE if the statement agrees with the information, FALSE if the statement contradicts the information, NOT GIVEN if there is no information on this.",
      "items": [
        {
          "number": 1,
          "statement": "Statement text here",
          "answer": "TRUE/FALSE/NOT GIVEN",
          "evidence": "Exact quote from passage",
          "explanation": "Why this is the answer"
        }
      ]
    },
    "typeB": {
      "instruction": "Choose the correct letter, A, B, C or D.",
      "items": [
        {
          "number": 6,
          "question": "Question text here?",
          "options": {
            "A": "Option A text",
            "B": "Option B text",
            "C": "Option C text",
            "D": "Option D text"
          },
          "answer": "B",
          "evidence": "Exact quote from passage",
          "explanation": "Why B is correct"
        }
      ]
    },
    "typeC": {
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
    "skillsFocus": ["Skimming", "Scanning", "Inference"]
  }
}`;

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return handleCorsPreflightRequest();
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
    const ANTHROPIC_API_KEY = Deno.env.get("ANTHROPIC_API_KEY");

    if (!ANTHROPIC_API_KEY) {
      return internalError("AI service not configured", undefined, corsHeaders);
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
      "Economics"
    ];
    const randomTopic = topics[Math.floor(Math.random() * topics.length)];

    const userPrompt = `Generate a complete IELTS Academic Reading passage and question set.

REQUIREMENTS:
- Topic: ${randomTopic}
- Difficulty: ${difficulty}
- EXACTLY 13 questions in the specified format
- Type A: 5 True/False/Not Given questions (ensure at least 1 is "NOT GIVEN")
- Type B: 4 Multiple Choice questions (A, B, C, D)
- Type C: 4 Sentence Completion questions

CRITICAL: 
- The passage MUST be 700-900 words
- ALL answers must be verifiable from the passage text
- Include the EXACT evidence sentence for each answer
- Make the passage academically rigorous but readable

Return ONLY valid JSON in the specified format.`;

    console.log("Generating reading passage with topic:", randomTopic, "difficulty:", difficulty);

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key": ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
        "content-type": "application/json",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-5-20250929",
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

      if (response.status === 429) {
        return rateLimitError(undefined, 60, corsHeaders);
      }
      if (response.status === 401) {
        return unauthorizedError("Invalid API key", corsHeaders);
      }
      return aiServiceError("Failed to generate reading passage", { status: response.status }, corsHeaders);
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
        throw new Error("No JSON found in response");
      }
    } catch (parseError) {
      console.error("JSON parse error:", parseError);
      return aiServiceError("Failed to parse AI response. Please try again.", { error: String(parseError) }, corsHeaders);
    }

    // Add timestamp for caching
    parsedResponse.generatedAt = new Date().toISOString();
    parsedResponse.id = crypto.randomUUID();

    return successResponse(parsedResponse, 200, corsHeaders);
  } catch (error: unknown) {
    console.error("Generate reading error:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return internalError(errorMessage, { error: String(error) }, corsHeaders);
  }
});
