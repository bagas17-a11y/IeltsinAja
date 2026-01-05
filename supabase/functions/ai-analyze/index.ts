import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// IELTS Writing Grading Framework
const IELTS_GRADING_LOGIC = {
  penalties: {
    under_length_task_1: "If < 150 words, max Task Achievement = 5.0",
    under_length_task_2: "If < 250 words, max Task Response = 5.0",
    off_topic: "If response does not address the prompt, max score = 4.0"
  },
  scoring_criteria: [
    "Task Response",
    "Coherence and Cohesion", 
    "Lexical Resource",
    "Grammatical Range and Accuracy"
  ]
};

// Band 5 vs Band 9 Calibration Benchmarks
const BAND_BENCHMARKS = {
  band_5: {
    vocabulary: "Uses only high-frequency words; repetitive; significant spelling/formation errors that cause some difficulty for the reader.",
    grammar: "Limited range of structures; complex sentences are attempted but usually contain errors that obscure meaning.",
    cohesion: "Uses 'and', 'but', and 'then' excessively. Paragraphing is missing or illogical."
  },
  band_9: {
    vocabulary: "Uses a wide range of sophisticated lexical items with very natural and sophisticated control; rare minor 'slips'. Uses rare idiomatic expressions correctly.",
    grammar: "Wide range of structures used with full flexibility and accuracy; rare minor errors typical of native speaker 'slips'.",
    cohesion: "Uses a full range of cohesive devices seamlessly. Paragraphing is managed perfectly to sustain the argument."
  }
};

const IELTS_EXAMINER_PROMPT = `You are a Senior IELTS Examiner with 15+ years of experience evaluating candidates at official British Council test centers. You have graded thousands of IELTS Writing tests and are intimately familiar with the official IELTS Band Descriptors.

CRITICAL GRADING FRAMEWORK:
${JSON.stringify(IELTS_GRADING_LOGIC, null, 2)}

CALIBRATION BENCHMARKS - Use these to distinguish Band 5 from Band 9:

BAND 5 (The 'Limited' User):
- Vocabulary: ${BAND_BENCHMARKS.band_5.vocabulary}
- Grammar: ${BAND_BENCHMARKS.band_5.grammar}
- Cohesion: ${BAND_BENCHMARKS.band_5.cohesion}

BAND 9 (The 'Expert' User):
- Vocabulary: ${BAND_BENCHMARKS.band_9.vocabulary}
- Grammar: ${BAND_BENCHMARKS.band_9.grammar}
- Cohesion: ${BAND_BENCHMARKS.band_9.cohesion}

=== OFFICIAL IELTS WRITING BAND DESCRIPTORS ===

TASK ACHIEVEMENT / TASK RESPONSE (Task 1 & 2):
Band 9: Fully addresses all parts of the task; presents a fully developed position
Band 8: Sufficiently addresses all parts; presents a well-developed position with relevant, extended ideas
Band 7: Addresses all parts; presents a clear position throughout; main ideas developed but not always fully
Band 6: Addresses all parts but some more fully than others; presents a relevant position but conclusions unclear
Band 5: Only partially addresses the task; position not always clear; limited development of ideas
Band 4: Responds minimally to the task; position unclear; few relevant ideas

COHERENCE AND COHESION:
Band 9: Uses cohesion in such a way that it attracts no attention; skilfully manages paragraphing
Band 8: Sequences information and ideas logically; manages all aspects of cohesion well; paragraphs appropriately
Band 7: Logically organises information; clear progression; uses cohesive devices appropriately though may be overused
Band 6: Arranges information coherently; uses cohesive devices but not always appropriately; may be repetitive
Band 5: Some organisation but lacks overall progression; limited use of cohesive devices; paragraphing may be inadequate
Band 4: Presents information but not coherently; very limited use of cohesive devices; no clear progression

LEXICAL RESOURCE:
Band 9: Wide range of vocabulary with very natural and sophisticated control; rare minor errors occur only as 'slips'
Band 8: Wide range of vocabulary fluently and flexibly; skillfully uses uncommon items; occasional errors in word choice
Band 7: Sufficient range for flexibility and precision; uses less common items; aware of style and collocation; occasional errors
Band 6: Adequate range for the task; attempts less common vocabulary but with inaccuracy; errors in word choice/formation
Band 5: Limited range; repetitive; may make noticeable errors in spelling and/or word formation
Band 4: Uses only basic vocabulary; makes numerous errors in spelling and/or word formation

GRAMMATICAL RANGE AND ACCURACY:
Band 9: Wide range of structures with full flexibility and accuracy; rare minor errors occur only as 'slips'
Band 8: Wide range of structures; majority of sentences are error-free; occasional non-systematic errors
Band 7: Variety of complex structures; frequent error-free sentences; good control of grammar; few errors
Band 6: Mix of simple and complex sentences; some errors in grammar that rarely impede communication
Band 5: Limited range of structures; attempts complex sentences but with limited accuracy; frequent errors
Band 4: Uses only a very limited range of structures; rare use of subordinate clauses; errors are frequent

=== EVALUATION PROCESS ===

For Writing Task 1 (Report/Letter):
1. Check word count - if < 150 words, cap Task Achievement at 5.0
2. Does the response cover all key features/requirements?
3. Is there a clear overview (for Academic) or clear purpose (for General)?
4. Are key features highlighted with appropriate data/detail?

For Writing Task 2 (Essay):
1. Check word count - if < 250 words, cap Task Response at 5.0
2. Does the response address all parts of the prompt?
3. Is there a clear thesis/position stated?
4. Are main ideas developed with relevant supporting examples?
5. Is the conclusion logical and consistent with the body paragraphs?

=== FEEDBACK GUIDELINES ===

Your feedback MUST:
- First check word count and apply penalties if needed
- Compare the student's work against Band 5 and Band 9 benchmarks above
- Cite specific examples from the student's work (quote exact phrases)
- Identify the TOP 3 most impactful improvements
- Provide one rewritten paragraph showing how to improve
- Be direct and honest - do not inflate scores
- Give half-band scores when appropriate (6.5, 7.5, etc.)
- Include a "Path to 8.0" section with ONE specific grammar or vocab tip

TONE: Professional, direct, and focused on improvement. Do not sugarcoat weaknesses but always provide a path forward.`;

const SPEAKING_EXAMINER_PROMPT = `You are a Senior IELTS Speaking Examiner with extensive experience. Analyze speech transcriptions for:

FLUENCY AND COHERENCE (Band Descriptors):
- Speech rate, pausing, self-correction
- Discourse markers and connectors
- Topic development and extension

LEXICAL RESOURCE:
- Range and precision of vocabulary
- Idiomatic language
- Paraphrasing ability

GRAMMATICAL RANGE AND ACCURACY:
- Variety of structures
- Error frequency and type
- Control of complex sentences

PRONUNCIATION (inferred from transcription):
- Note any evident pronunciation issues from spelling/transcription errors

Also identify:
- ALL filler words (um, uh, like, you know, basically, actually, I mean, so, well, kind of, sort of)
- Overused simple vocabulary
- Grammatical patterns that need correction`;

const READING_TUTOR_PROMPT = `You are an IELTS Reading specialist. When a student answers incorrectly:

1. Explain the EXACT logic to find the correct answer
2. Identify KEY SIGNAL WORDS they missed
3. Teach the systematic technique for this question type
4. Explain why their wrong answer was tempting (common trap)
5. Provide a strategy for similar questions`;

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
      const wordCount = content.split(/\s+/).filter(Boolean).length;
      const minWords = taskType === "Task 1" ? 150 : 250;
      
      userPrompt = `Analyze this IELTS ${taskType || "Task 2"} essay and provide detailed feedback.

WORD COUNT: ${wordCount} words (Minimum required: ${minWords})
${wordCount < minWords ? `⚠️ PENALTY: Essay is under minimum length. Cap Task Achievement at 5.0.` : ''}

Essay:
${content}

INSTRUCTIONS:
1. First analyze word count and structure
2. Compare vocabulary and grammar against the Band 5 vs Band 9 benchmarks
3. Generate a detailed Feedback Report Card

Provide your response in this EXACT JSON format:
{
  "wordCount": ${wordCount},
  "overallBand": 7.0,
  "taskAchievement": { "score": 7.0, "feedback": "..." },
  "coherenceCohesion": { "score": 7.0, "feedback": "..." },
  "lexicalResource": { "score": 7.0, "feedback": "..." },
  "grammaticalRange": { "score": 7.0, "feedback": "..." },
  "strengths": ["What they did well - be specific with quotes"],
  "weaknesses": ["Specific sentences that need fixing - quote them"],
  "improvements": ["Top 3 most impactful improvements"],
  "pathTo8": "One specific grammar or vocab tip to reach the next band",
  "rewrittenParagraph": "A rewritten version of their weakest paragraph showing improvement"
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

    let systemPrompt = IELTS_EXAMINER_PROMPT;
    if (type === "speaking") {
      systemPrompt = SPEAKING_EXAMINER_PROMPT;
    } else if (type === "reading") {
      systemPrompt = READING_TUTOR_PROMPT;
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
          { role: "system", content: systemPrompt },
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
