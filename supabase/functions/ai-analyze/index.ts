import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const IELTS_EXAMINER_PROMPT = `You are a Senior IELTS Examiner with 15+ years of experience evaluating candidates at official British Council test centers. 

CRITICAL INSTRUCTION: Evaluate all submissions STRICTLY against official IELTS Band Descriptors. Be critical but constructive. Your role is to help students achieve band 8.0+ through honest, rigorous assessment.

When analyzing Writing:
- Evaluate Task Achievement (TA) - Does the response fully address all parts of the task? Is the position clear throughout?
- Evaluate Coherence and Cohesion (CC) - Is there a clear progression of ideas? Are cohesive devices used appropriately?
- Evaluate Lexical Resource (LR) - Is vocabulary used precisely and naturally? Are there any errors in word formation?
- Evaluate Grammatical Range and Accuracy (GRA) - Is there a wide range of structures? What is the error ratio?
- Provide specific band scores for each criterion (not rounded - use 6.5, 7.0, 7.5 etc.)
- Give detailed, actionable feedback with specific examples from their work
- Identify the TOP 3 improvements that would have the biggest impact on their score

When analyzing Speaking:
- Identify ALL filler words (um, uh, like, you know, basically, actually, I mean)
- Count and categorize filler word frequency
- Evaluate vocabulary variety and sophistication - identify overused simple words
- Check grammatical accuracy - list specific errors
- Assess fluency and coherence - note any hesitations or self-corrections
- Provide band score estimate with justification
- Suggest 3 specific vocabulary upgrades they should practice

When analyzing Reading:
- Explain the logic behind correct answers step-by-step
- Identify key patterns and signal words the student missed
- Teach systematic decoding techniques for this question type
- Explain why the wrong answer was tempting (if applicable)
- Provide a strategy they can use for similar questions

TONE: Professional, direct, and focused on improvement. Do not sugarcoat weaknesses but always provide a path forward. Be specific with examples from the student's actual work.`;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { type, content, taskType } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    let userPrompt = "";
    
    if (type === "writing") {
      userPrompt = `Analyze this IELTS ${taskType || "Task 2"} essay and provide detailed feedback:

Essay:
${content}

Provide your response in this JSON format:
{
  "overallBand": 7.0,
  "taskAchievement": { "score": 7.0, "feedback": "..." },
  "coherenceCohesion": { "score": 7.0, "feedback": "..." },
  "lexicalResource": { "score": 7.0, "feedback": "..." },
  "grammaticalRange": { "score": 7.0, "feedback": "..." },
  "strengths": ["..."],
  "improvements": ["..."],
  "rewrittenParagraph": "..."
}`;
    } else if (type === "speaking") {
      userPrompt = `Analyze this IELTS Speaking transcription:

Transcription:
${content}

Provide your response in this JSON format:
{
  "overallBand": 7.0,
  "fluencyCoherence": { "score": 7.0, "feedback": "..." },
  "lexicalResource": { "score": 7.0, "feedback": "..." },
  "grammaticalRange": { "score": 7.0, "feedback": "..." },
  "pronunciation": { "score": 7.0, "feedback": "..." },
  "fillerWords": { "count": 5, "examples": ["um", "uh"] },
  "vocabularyVariety": { "score": "Good", "suggestions": ["..."] },
  "grammarErrors": ["..."],
  "improvements": ["..."]
}`;
    } else if (type === "reading") {
      userPrompt = `The student answered incorrectly on this IELTS Reading question. Explain the logic step-by-step:

Question and Context:
${content}

Provide your response in this JSON format:
{
  "correctAnswer": "...",
  "stepByStepLogic": ["Step 1: ...", "Step 2: ..."],
  "keySignalWords": ["..."],
  "commonMistake": "...",
  "technique": "..."
}`;
    }

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: IELTS_EXAMINER_PROMPT },
          { role: "user", content: userPrompt },
        ],
        temperature: 0.3,
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

    // Try to parse JSON from response
    let parsedResponse;
    try {
      const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        parsedResponse = JSON.parse(jsonMatch[0]);
      } else {
        parsedResponse = { rawFeedback: aiResponse };
      }
    } catch {
      parsedResponse = { rawFeedback: aiResponse };
    }

    return new Response(JSON.stringify(parsedResponse), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error: unknown) {
    console.error("AI analyze error:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
