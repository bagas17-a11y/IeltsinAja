import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

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
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { difficulty = "medium" } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
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

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: READING_GENERATOR_PROMPT },
          { role: "user", content: userPrompt },
        ],
        temperature: 0.8,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again later." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted. Please add credits." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      throw new Error("AI gateway error");
    }

    const data = await response.json();
    const aiResponse = data.choices?.[0]?.message?.content;
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
      return new Response(JSON.stringify({ error: "Failed to parse AI response. Please try again." }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Add timestamp for caching
    parsedResponse.generatedAt = new Date().toISOString();
    parsedResponse.id = crypto.randomUUID();

    return new Response(JSON.stringify(parsedResponse), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error: unknown) {
    console.error("Generate reading error:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
