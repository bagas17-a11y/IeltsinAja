import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import {
  corsHeaders,
  handleCorsPreflightRequest,
  successResponse,
  internalError,
} from "../shared/errors.ts";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface RequestBody {
  messages: Message[];
  taskType: string;
  questionPrompt: string;
  userEssay?: string;
  feedbackSummary?: string;
}

function buildSystemPrompt(body: RequestBody): string {
  const { taskType, questionPrompt, userEssay, feedbackSummary } = body;

  const essayBlock = userEssay?.trim()
    ? `\n\nSTUDENT'S CURRENT ESSAY:\n"""\n${userEssay.trim()}\n"""`
    : "\n\nThe student has not written their essay yet.";

  const feedbackBlock = feedbackSummary?.trim()
    ? `\n\nAI FEEDBACK ALREADY GIVEN:\n${feedbackSummary.trim()}`
    : "";

  return `You are an embedded IELTS writing tutor inside IELTSinAja. You are coaching a student through a specific ${taskType} question right now.

CURRENT QUESTION (${taskType}):
"""
${questionPrompt.trim()}
"""${essayBlock}${feedbackBlock}

YOUR ROLE:
${!userEssay?.trim()
  ? `- The student is still writing. Help them plan, structure, and understand what the examiner wants for THIS specific question.
- Explain the task requirements, suggest an outline, clarify confusing terms, or give band-level vocabulary tips.`
  : !feedbackSummary?.trim()
  ? `- The student has written an essay but not submitted yet. Review it against the IELTS ${taskType} band descriptors.
- Give targeted tips on task response, coherence, vocabulary, and grammar before they submit.`
  : `- The student has received AI feedback. Help them understand it deeply.
- Answer questions like "why did I lose marks on coherence?", suggest specific sentence-level rewrites, and explain how to improve.`}

RULES:
- Only discuss this question, IELTS writing skills, and English language improvement. Politely decline anything else.
- Be specific — reference the actual question and essay text when relevant.
- Keep responses concise: 2–4 short paragraphs or a short bullet list. Never write a wall of text.
- Be encouraging but honest. Don't inflate scores or give false hope.
- You know the official IELTS public band descriptors for ${taskType} inside out. Apply them accurately.
- Respond in English unless the student writes in Bahasa Indonesia, in which case reply in Bahasa Indonesia.`;
}

serve(async (req) => {
  if (req.method === "OPTIONS") return handleCorsPreflightRequest(req);

  try {
    let body: RequestBody;
    try {
      body = await req.json();
    } catch {
      return internalError("Invalid JSON", undefined, corsHeaders);
    }

    if (!body.messages || !Array.isArray(body.messages) || !body.questionPrompt || !body.taskType) {
      return internalError("Missing required fields: messages, questionPrompt, taskType", undefined, corsHeaders);
    }

    const ANTHROPIC_API_KEY = Deno.env.get("ANTHROPIC_API_KEY");
    if (!ANTHROPIC_API_KEY) {
      return internalError("AI service not configured", undefined, corsHeaders);
    }

    const systemPrompt = buildSystemPrompt(body);

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key": ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
        "content-type": "application/json",
      },
      body: JSON.stringify({
        model: "claude-haiku-4-5-20251001",
        max_tokens: 600,
        system: systemPrompt,
        messages: body.messages,
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      console.error("Claude API error:", err);
      return internalError("AI service error", { status: response.status }, corsHeaders);
    }

    const data = await response.json();
    const reply = data.content?.[0]?.text ?? "Sorry, I couldn't process that. Please try again.";

    return successResponse({ reply }, 200, corsHeaders);
  } catch (error) {
    console.error("writing-tutor error:", error);
    return internalError(String(error), undefined, corsHeaders);
  }
});
