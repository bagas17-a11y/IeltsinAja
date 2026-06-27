import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const SYSTEM_PROMPT = `You are an expert IELTS Academic Reading test writer. You create authentic, high-quality reading tests that closely match the style and difficulty of official Cambridge IELTS tests.

Rules:
- Passages must be factually accurate, academic in tone, and drawn from real-world topics
- Each passage must have clearly labelled paragraphs: A, B, C, D, E, F (minimum 5 paragraphs)
- Each passage must be 700–850 words
- Questions must be answerable ONLY from the passage — no outside knowledge required
- Answers must be directly evidenced by the passage text
- evidence field must be a verbatim excerpt from the passage
- explanation field must state which paragraph and why

Return ONLY valid JSON — no markdown, no code fences, no commentary.`;

const buildPrompt = (difficulty: string) => `Generate a complete IELTS Academic Reading test at ${difficulty} difficulty.

STRUCTURE:
- 3 sections (passages), each with a different academic topic
- Section 1: questions 1–13 (13 questions)
- Section 2: questions 14–27 (14 questions)
- Section 3: questions 28–40 (13 questions)
- Each section has exactly 2 question groups of different types

QUESTION TYPES (pick 2 different types per section):
- tfng: True/False/Not Given — items have "statement" field
- ynng: Yes/No/Not Given — items have "statement" field (about author's views/opinions)
- multiple_choice: A/B/C/D — items have "question" and "options" {A,B,C,D} fields; answer is "A"/"B"/"C"/"D"
- matching_headings: match headings to paragraphs — items have "paragraph" field (e.g. "B"); include "headings_pool" array with 2 extra distractors
- matching_information: which paragraph contains info — items have "question" field; answer is paragraph letter
- sentence_completion: complete sentences with words from passage — items have "sentence" field with blank as ______
- summary_completion: complete a summary using a word bank — include "summary" and "word_bank" array; items have "sentence_start" field; answer is one word from word_bank
- note_completion: complete notes with words from passage — include "note" field describing the notes header; items have "sentence" field with ______; answer is 1–3 words from passage

DIFFICULTY GUIDANCE:
- easy: everyday academic topics (nutrition, urban transport, recycling), straightforward vocabulary, mostly tfng and sentence_completion
- medium: standard academic topics (psychology, technology, ecology), moderate vocabulary, mix of question types
- hard: complex academic topics (economics, neuroscience, linguistics, philosophy of science), sophisticated vocabulary, matching_headings and multiple complex types

Return this exact JSON shape:
{
  "title": "IELTS Academic Reading Test",
  "difficulty": "${difficulty}",
  "totalQuestions": 40,
  "durationMinutes": 60,
  "topicTags": ["topic1", "topic2", "topic3"],
  "sections": [
    {
      "section_number": 1,
      "passage": {
        "title": "Passage title",
        "topic": "Topic area",
        "wordCount": 750,
        "content": "A First paragraph text...\\n\\nB Second paragraph text...\\n\\nC ..."
      },
      "question_groups": [
        {
          "type": "tfng",
          "instruction": "Do the following statements agree with the information given in the passage? Write TRUE, FALSE or NOT GIVEN.",
          "question_range": [1, 7],
          "items": [
            { "number": 1, "statement": "...", "answer": "TRUE", "evidence": "verbatim excerpt", "explanation": "Paragraph A states..." }
          ]
        },
        {
          "type": "sentence_completion",
          "instruction": "Complete the sentences below. Choose NO MORE THAN TWO WORDS from the passage for each answer.",
          "question_range": [8, 13],
          "items": [
            { "number": 8, "sentence": "The ___ was first introduced in...", "answer": "exact words", "evidence": "verbatim excerpt", "explanation": "Paragraph B states..." }
          ]
        }
      ]
    }
  ]
}`;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const anthropicKey = Deno.env.get("ANTHROPIC_API_KEY");

    if (!anthropicKey) {
      return new Response(JSON.stringify({ error: "ANTHROPIC_API_KEY not configured" }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Verify auth
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const anonClient = createClient(supabaseUrl, Deno.env.get("SUPABASE_ANON_KEY")!);
    const { data: { user }, error: authError } = await anonClient.auth.getUser(
      authHeader.replace("Bearer ", "")
    );
    if (authError || !user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Verify admin role
    const admin = createClient(supabaseUrl, supabaseServiceKey);
    const { data: roleRow } = await admin
      .from("user_roles")
      .select("role")
      .eq("user_id", user.id)
      .eq("role", "admin")
      .maybeSingle();

    if (!roleRow) {
      return new Response(JSON.stringify({ error: "Admin access required" }), {
        status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Parse request
    let body: { difficulty?: string };
    try { body = await req.json(); } catch { body = {}; }
    const difficulty = ["easy", "medium", "hard"].includes(body.difficulty ?? "")
      ? (body.difficulty as string)
      : "medium";

    console.log(`Admin ${user.id} generating ${difficulty} reading test...`);

    // Call Claude
    const aiRes = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": anthropicKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-6",
        max_tokens: 8000,
        system: SYSTEM_PROMPT,
        messages: [{ role: "user", content: buildPrompt(difficulty) }],
      }),
    });

    if (!aiRes.ok) {
      const err = await aiRes.text();
      console.error("Anthropic error:", err);
      return new Response(JSON.stringify({ error: "AI generation failed" }), {
        status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const aiData = await aiRes.json();
    let rawText: string = aiData.content?.[0]?.text ?? "";

    // Strip any accidental markdown fences
    rawText = rawText.replace(/^```(?:json)?\s*/i, "").replace(/\s*```\s*$/i, "").trim();

    let testData: Record<string, unknown>;
    try {
      testData = JSON.parse(rawText);
    } catch (e) {
      console.error("JSON parse failed. Raw:", rawText.slice(0, 500));
      return new Response(JSON.stringify({ error: "AI returned invalid JSON", raw: rawText.slice(0, 300) }), {
        status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Validate basic shape
    const sections = testData.sections as unknown[];
    if (!Array.isArray(sections) || sections.length !== 3) {
      return new Response(JSON.stringify({ error: "AI response missing 3 sections", got: sections?.length }), {
        status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Count questions and fix totalQuestions
    let total = 0;
    for (const s of sections as Array<{ question_groups: Array<{ items: unknown[] }> }>) {
      for (const g of s.question_groups ?? []) total += (g.items ?? []).length;
    }

    // Save to reading_test_library
    const { data: saved, error: insertErr } = await admin
      .from("reading_test_library")
      .insert({
        title: (testData.title as string) ?? "IELTS Academic Reading Test",
        difficulty,
        total_questions: total,
        duration_minutes: 60,
        sections: { sections },
        topic_tags: (testData.topicTags as string[]) ?? [],
        is_active: true,
      })
      .select("id, title, difficulty, total_questions, duration_minutes, sections, topic_tags, is_active, created_at")
      .single();

    if (insertErr || !saved) {
      console.error("Insert error:", insertErr);
      return new Response(JSON.stringify({ error: "Failed to save test", details: insertErr?.message }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    console.log("Saved reading test:", saved.id, saved.title);
    return new Response(JSON.stringify({ success: true, test: saved }), {
      status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (err) {
    console.error("Unhandled error:", err);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
