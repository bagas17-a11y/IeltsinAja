import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Band Examples for Calibration
const BAND_EXAMPLES = {
  task1: {
    band9: `The pie charts show the amount of revenue and expenditures in 2016 for a children's charity in the USA. Overall, it can be seen that donated food accounted for the majority of the income, while program services accounted for the most expenditure. Total revenue sources just exceeded outgoings.

In detail, donated food provided most of the revenue for the charity, at 86%. Similarly, with regard to expenditures, one category, program services, accounted for nearly all of the outgoings, at 95.8%. 

The other categories were much smaller. Community contributions, which were the second largest revenue source, brought in 10.4% of overall income, and this was followed by program revenue, at 2.2%. Investment income, government grants, and other income were very small sources of revenue, accounting for only 0.8% combined.

There were only two other expenditure items, fundraising and management and general, accounting for 2.6% and 1.6% respectively. The total amount of income was $53,561,580, which was just enough to cover the expenditures of $53,224,896.`,
    band5: `The chart shows how people travel to work in one city. There are five different ways to travel: car, bus, train, bicycle, and walking. The numbers are in percentages.

Car is the most popular way to travel. About 45% of people use car to go to work. This is the highest number in the chart. Bus is the second most popular. Around 25% of people use bus. Train is used by about 15% of people. Bicycle is used by 10% of people. Walking is the least popular way. Only 5% of people walk to work.

In summary, most people in this city use car to go to work. The second most popular is bus. Train, bicycle and walking are less common. Car is much more popular than the other ways.`
  },
  task2: {
    band5: `Governments need to think about spending money on public transportation or roads. This is a big problem in many countries. I think public transportation is more important to spend money on.

Public transportation like buses and trains can help reduce traffic jams and pollution. Many cities have too many cars on the roads and people spend a lot of time in traffic every day. This is very bad. If the government makes good public transport, people will use their cars less. This is good for the environment because there will be less smoke from cars. Also, public transport is cheaper for poor people who cannot buy cars. This helps everyone in the city to move around easily. It is good for the economy too because people can get to work faster.

But some people think building more roads is better. They think more roads means less traffic. But this is not true because when you build more roads, more people buy cars and the traffic comes back again. So it is not a good solution for the traffic problem. Also, building roads is very expensive and bad for the environment because you need to cut trees and destroy nature.

In conclusion, I think governments should spend more money on public transportation instead of roads. Public transport helps reduce traffic and pollution and helps poor people. This is better for the future of cities and for the next generation. We need clean air and less traffic.`
  }
};

// Build grading prompt with optional injected training
const buildGradingPrompt = (taskType: string, secretContext?: string, modelAnswer?: string, targetKeywords?: string) => {
  const isTask1 = taskType === "Task 1" || taskType.startsWith("Task 1");
  
  let basePrompt = isTask1 ? `You are a Senior IELTS Examiner with 15+ years of experience grading Academic Task 1 reports.

=== STEP-BY-STEP STRUCTURAL AUDIT FRAMEWORK ===

You MUST evaluate the student's submission against this MANDATORY 4-PARAGRAPH STRUCTURE:

**Paragraph 1 (Introduction):**
- Did they paraphrase the question accurately?
- Did they avoid adding personal opinions?
- Grade: ✅ Executed / ⚠️ Partial / ❌ Missing

**Paragraph 2 (Overview):**
- Did they summarize 2-4 main trends?
- Did they use general terms WITHOUT specific data?
- Grade: ✅ Executed / ⚠️ Partial / ❌ Missing

**Paragraph 3 (Body 1):**
- Did they detail the first key feature (e.g., peaks/troughs)?
- Did they provide data support with specific figures?
- Grade: ✅ Executed / ⚠️ Partial / ❌ Missing

**Paragraph 4 (Body 2):**
- Did they detail the second key feature (e.g., contrasts)?
- Did they include precise figures?
- Grade: ✅ Executed / ⚠️ Partial / ❌ Missing

=== KEY FEATURES AUDIT ===
Check if the user pinpointed these standout elements:
- Highest/Lowest values
- Sharp Rises or Falls
- Notable Contrasts or Similarities
- Overall patterns/trends

=== VOCABULARY CATEGORIES FOR SUGGESTIONS ===
Based on the user's writing, suggest words from these categories:
- Sequencing: Firstly, Furthermore, Next, Subsequently, Following this
- Contrast: However, Whereas, Conversely, In contrast, On the other hand
- Result: Consequently, Therefore, As a result, Thus
- Emphasis: Notably, In particular, Significantly, Remarkably

=== BAND 9 CALIBRATION EXAMPLE ===
${BAND_EXAMPLES.task1.band9}

=== BAND 5 CALIBRATION EXAMPLE ===
${BAND_EXAMPLES.task1.band5}

=== SCORING GUIDE ===
- Band 9: All 4 paragraphs executed perfectly, key features identified, sophisticated vocabulary
- Band 8: Minor issues in one paragraph, good key features coverage
- Band 7: Some paragraphs partially executed, adequate vocabulary
- Band 6: Missing or weak overview, limited vocabulary range
- Band 5: Weak/missing structure, basic vocabulary, simple grammar` 
  : `You are a Senior IELTS Examiner with 15+ years of experience grading Task 2 essays.

=== STEP-BY-STEP STRUCTURAL AUDIT FRAMEWORK ===

You MUST evaluate the student's submission against this MANDATORY 4-PARAGRAPH STRUCTURE:

**Paragraph 1 (Introduction):**
- Did they paraphrase the prompt accurately?
- Did they provide a clear Thesis Statement (their opinion/position)?
- Grade: ✅ Executed / ⚠️ Partial / ❌ Missing

**Paragraph 2 (Body 1 - First Argument):**
- Did they start with a clear Topic Sentence?
- Did they support it with explanation AND a specific example?
- Grade: ✅ Executed / ⚠️ Partial / ❌ Missing

**Paragraph 3 (Body 2 - Second Argument):**
- Did they start with a Topic Sentence?
- Did they develop the idea further or provide a counter-argument/concession?
- Grade: ✅ Executed / ⚠️ Partial / ❌ Missing

**Paragraph 4 (Conclusion):**
- Did they summarize the main points?
- Did they restate their final opinion WITHOUT adding new ideas?
- Grade: ✅ Executed / ⚠️ Partial / ❌ Missing

=== KEY HIGHLIGHTS FOR BAND 9 (Secret Context) ===

**The "Hedging" Technique:**
- Reward cautious language like "This could potentially lead to..." instead of "This will lead to..."
- Band 9 writers avoid over-generalizing

**Cohesive Progression:**
- Check if ideas flow LOGICALLY from one sentence to the next
- Not just transition words as a list, but actual logical connection

**Fully Developed Ideas:**
- A Band 9 response takes 2 reasons and explains them DEEPLY
- Not just listing 10 reasons superficially

=== ACADEMIC VOCABULARY UPGRADES ===
Suggest replacing simple words with these academic alternatives:

Function | Band 5-6 (Simple) | Band 8-9 (Advanced)
Agreeing | "I think it's true" | "It is widely acknowledged that..."
Disputing | "Many people disagree" | "This perspective is often contested..."
Showing Cause | "This leads to bad things" | "This precipitates detrimental consequences..."
Emphasizing | "This is a big problem" | "This represents a pressing societal challenge..."
Proving | "For example" | "To illustrate this point, consider..."

=== BAND 5 CALIBRATION EXAMPLE ===
${BAND_EXAMPLES.task2.band5}

=== PENALTIES ===
- If < 250 words, cap Task Response at 5.0
- Unclear thesis or changing position: cap at 6.0
- Off-topic: Max score = 4.0

=== SCORING GUIDE ===
- Band 9: All 4 paragraphs executed, hedging used, cohesive flow, deep development
- Band 8: Minor structural issues, good vocabulary upgrades
- Band 7: Some paragraphs partially executed, adequate development
- Band 6: Missing thesis or weak structure
- Band 5: Poor structure, simple vocabulary, undeveloped ideas`;

  // Inject training from admin CMS
  if (modelAnswer || secretContext || targetKeywords) {
    basePrompt += `

=== HEAD CONSULTANT TRAINING (PRIORITY INSTRUCTIONS) ===
You are grading this essay using specific instructions from the Head Consultant.

`;
    
    if (modelAnswer) {
      basePrompt += `
**BAND 9 REFERENCE ANSWER:**
${modelAnswer}

Compare the student's essay against this reference.
`;
    }
    
    if (secretContext) {
      basePrompt += `
**SECRET CONTEXT (Hidden Instructions):**
${secretContext}
`;
    }
    
    if (targetKeywords) {
      basePrompt += `
**TARGET KEYWORDS TO REWARD:**
${targetKeywords}
`;
    }
  }

  basePrompt += `

=== GRADING PHILOSOPHY ===
Be encouraging and constructive. Help students improve. Acknowledge improvements in revisions.`;

  return basePrompt;
};

const SPEAKING_EXAMINER_PROMPT = `You are a Senior IELTS Speaking Examiner with 15+ years of experience.

=== CRITICAL: PAUSE MARKER ANALYSIS ===
The transcript uses [pause] markers to indicate silences longer than 1.5 seconds.
- If you see multiple [pause] markers within a single sentence, or if sentences are very short and fragmented, this indicates HESITATION
- Multiple pauses in a short response = Lower Fluency score (cap at 5.5-6.0)
- Explain to the student that their 'flow' was interrupted by frequent hesitations

=== FILLER WORD DETECTION ===
Count ALL filler words: um, uh, like, you know, basically, actually, I mean, so, well, kind of, sort of, right, okay, yeah
- If filler words occur more than once every 10 seconds of estimated speech, cap Fluency at 5.5
- Calculate estimated speech duration: ~150 words per minute average

=== FLUENCY & COHERENCE (25%) ===
Band 9: Speaks fluently with only rare repetition or self-correction. Speech is coherent with fully appropriate cohesive features.
Band 7: Speaks at length without noticeable effort. May demonstrate language-related hesitation at times.
Band 5: Usually maintains flow of speech but uses repetition, self-correction and/or slow speech to keep going. May over-use certain connectors.

=== LEXICAL RESOURCE (25%) ===
Look for:
- Idiomatic expressions (e.g., "at the end of the day", "once in a blue moon")
- Topic-specific vocabulary
- Paraphrasing ability (not repeating the same words)
- Collocations (natural word combinations)

Band 9: Uses vocabulary with full flexibility and precision. Uses idiomatic language naturally and accurately.
Band 7: Uses vocabulary resource flexibly. Uses some less common and idiomatic vocabulary.
Band 5: Manages to talk about familiar and unfamiliar topics but uses vocabulary with limited flexibility.

=== GRAMMATICAL RANGE & ACCURACY (25%) ===
Look for complex structures:
- Conditionals (If I had known..., Were I to...)
- Perfect tenses (I have been living..., By then I had finished...)
- Relative clauses (which, who, that)
- Passive voice
- Reported speech

Band 9: Uses a full range of structures naturally and appropriately. Produces consistently accurate structures.
Band 7: Uses a range of complex structures with some flexibility. Frequently produces error-free sentences.
Band 5: Produces basic sentence forms with reasonable accuracy. Uses a limited range of more complex structures.

=== PRONUNCIATION (25%) ===
Infer from transcription quality:
- Words that appear misspelled might indicate pronunciation issues
- Note: This is an estimate since we only have text

=== GRADING PHILOSOPHY ===
Be encouraging but honest. Help students understand exactly what they need to improve.
Count pauses and filler words explicitly. Provide actionable feedback.`;

const READING_TUTOR_PROMPT = `You are an IELTS Reading specialist. When a student answers incorrectly:

1. Explain the EXACT logic to find the correct answer
2. Identify KEY SIGNAL WORDS they missed
3. Teach the systematic technique for this question type
4. Explain why their wrong answer was tempting (common trap)
5. Provide a strategy for similar questions`;

const GENERATE_MODEL_PROMPT = `You are a Band 9 IELTS expert. Generate a perfect Band 9 model answer for the given question.

For Task 1:
- Include a clear overview in the second paragraph
- Use sophisticated trend vocabulary (plummeted, soared, gradual fluctuation)
- Include all key data points with precise figures
- Use comparison structures and passive voice where appropriate
- Aim for 170-190 words

For Task 2:
- Clear thesis statement in introduction
- Well-developed body paragraphs with topic sentences and examples
- Academic vocabulary and formal register
- Complex sentence structures (conditionals, relative clauses, passive)
- Strong conclusion that restates position
- Aim for 280-320 words

Return the model answer only, no explanations.`;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { type, content, taskType, isRevision, questionId, secretContext, modelAnswer, targetKeywords, prompt, speakingPart, question } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    let userPrompt = "";
    let systemPrompt = "";
    
    // Handle model answer generation
    if (type === "generate-model") {
      systemPrompt = GENERATE_MODEL_PROMPT;
      userPrompt = `Generate a Band 9 model answer for this ${taskType} question:

${prompt}

Write only the model answer, formatted as a proper IELTS response.`;

      console.log("Generating model answer for:", taskType);

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
          temperature: 0.7,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("AI gateway error:", response.status, errorText);
        throw new Error("AI gateway error");
      }

      const data = await response.json();
      const modelAnswerText = data.choices?.[0]?.message?.content;

      return new Response(JSON.stringify({ modelAnswer: modelAnswerText }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    
    if (type === "writing") {
      const wordCount = content.split(/\s+/).filter(Boolean).length;
      const isTask1 = taskType === "Task 1" || taskType?.startsWith("Task 1");
      const minWords = isTask1 ? 150 : 250;
      
      // Build grading prompt with injected training
      systemPrompt = buildGradingPrompt(taskType, secretContext, modelAnswer, targetKeywords);
      
      const revisionNote = isRevision ? `
⚠️ THIS IS A REVISED ESSAY - The student has already received feedback and has revised their work. 
Be encouraging about progress while still being objective about remaining issues. If they've improved, acknowledge it positively.` : '';
      
      if (isTask1) {
        userPrompt = `Analyze this IELTS Task 1 Academic report using the STEP-BY-STEP STRUCTURAL AUDIT.
${revisionNote}

WORD COUNT: ${wordCount} words (Minimum required: ${minWords})
${wordCount < minWords ? `⚠️ PENALTY: Essay is under minimum length. Cap Task Achievement at 5.0.` : ''}

STUDENT'S TASK 1 REPORT:
${content}

Provide your response in this EXACT JSON format:
{
  "wordCount": ${wordCount},
  "overallBand": 7.0,
  "isRevision": ${isRevision || false},
  "structuralGrade": {
    "paragraph1_introduction": {
      "status": "executed/partial/missing",
      "paraphrased": true,
      "noOpinions": true,
      "feedback": "Brief feedback on introduction"
    },
    "paragraph2_overview": {
      "status": "executed/partial/missing",
      "trendsCount": 2,
      "usedGeneralTerms": true,
      "feedback": "Brief feedback on overview"
    },
    "paragraph3_body1": {
      "status": "executed/partial/missing",
      "hasKeyFeature": true,
      "hasDataSupport": true,
      "feedback": "Brief feedback on body 1"
    },
    "paragraph4_body2": {
      "status": "executed/partial/missing",
      "hasSecondFeature": true,
      "hasPreciseFigures": true,
      "feedback": "Brief feedback on body 2"
    }
  },
  "keyFeaturesAudit": {
    "identified": ["List of key features user identified (highest, lowest, sharp rises, contrasts)"],
    "missed": ["List of key features user missed"]
  },
  "vocabularySuggestions": {
    "sequencing": ["Suggested sequencing words if needed"],
    "contrast": ["Suggested contrast words if needed"],
    "result": ["Suggested result words if needed"],
    "emphasis": ["Suggested emphasis words if needed"]
  },
  "scoringGrid": {
    "taskResponse": { "score": 7.0, "justification": "Brief explanation" },
    "coherenceCohesion": { "score": 7.0, "justification": "Brief explanation" },
    "lexicalResource": { "score": 7.0, "justification": "Brief explanation" },
    "grammaticalRange": { "score": 7.0, "justification": "Brief explanation" }
  },
  "band8Transformations": [
    {
      "original": "Exact sentence from the essay",
      "rewrite": "Band 8.0+ version",
      "explanation": "What was improved"
    }
  ],
  "criticalFixes": ["Recurring error 1", "Recurring error 2"],
  "actionableNextStep": "Specific exercise recommendation"
}`;
      } else {
        userPrompt = `Analyze this IELTS Task 2 essay using the STEP-BY-STEP STRUCTURAL AUDIT.
${revisionNote}

WORD COUNT: ${wordCount} words (Minimum required: ${minWords})
${wordCount < minWords ? `⚠️ PENALTY: Essay is under minimum length. Cap Task Response at 5.0.` : ''}

STUDENT'S TASK 2 ESSAY:
${content}

Provide your response in this EXACT JSON format:
{
  "wordCount": ${wordCount},
  "overallBand": 7.0,
  "isRevision": ${isRevision || false},
  "structuralGrade": {
    "paragraph1_introduction": {
      "status": "executed/partial/missing",
      "paraphrased": true,
      "hasThesis": true,
      "feedback": "Brief feedback on introduction and thesis"
    },
    "paragraph2_body1": {
      "status": "executed/partial/missing",
      "hasTopicSentence": true,
      "hasExample": true,
      "feedback": "Brief feedback on first argument"
    },
    "paragraph3_body2": {
      "status": "executed/partial/missing",
      "hasTopicSentence": true,
      "developedOrCounterArg": true,
      "feedback": "Brief feedback on second argument"
    },
    "paragraph4_conclusion": {
      "status": "executed/partial/missing",
      "summarized": true,
      "noNewIdeas": true,
      "feedback": "Brief feedback on conclusion"
    }
  },
  "band9Highlights": {
    "hedgingUsed": {
      "found": true,
      "examples": ["Examples of hedging language used"],
      "suggestions": ["Suggestions for hedging if not used"]
    },
    "cohesiveProgression": {
      "score": "Strong/Adequate/Weak",
      "feedback": "Analysis of logical flow between sentences"
    },
    "ideaDepth": {
      "score": "Deep/Moderate/Shallow",
      "feedback": "Analysis of idea development depth"
    }
  },
  "vocabularyUpgrades": [
    {
      "original": "Simple word/phrase from essay",
      "upgrade": "Academic Band 8-9 alternative",
      "function": "Agreeing/Disputing/Showing Cause/Emphasizing/Proving"
    }
  ],
  "scoringGrid": {
    "taskResponse": { "score": 7.0, "justification": "Brief explanation" },
    "coherenceCohesion": { "score": 7.0, "justification": "Brief explanation" },
    "lexicalResource": { "score": 7.0, "justification": "Brief explanation" },
    "grammaticalRange": { "score": 7.0, "justification": "Brief explanation" }
  },
  "band8Transformations": [
    {
      "original": "Exact sentence from the essay",
      "rewrite": "Band 8.0+ version",
      "explanation": "What was improved"
    }
  ],
  "criticalFixes": ["Recurring error 1", "Recurring error 2"],
  "actionableNextStep": "Specific exercise recommendation"
}`;
      }
    } else if (type === "speaking") {
      systemPrompt = SPEAKING_EXAMINER_PROMPT;
      
      userPrompt = `Analyze this IELTS Speaking transcription. 

SPEAKING PART: ${speakingPart || 'part2'}
QUESTION CONTEXT: ${question || 'General speaking practice'}

TRANSCRIPTION (with [pause] markers for silences > 1.5 seconds):
${content}

=== ANALYSIS INSTRUCTIONS ===
1. Count all [pause] markers - these indicate hesitation
2. Count all filler words (um, uh, like, you know, basically, etc.)
3. Estimate speech duration (assume ~150 words/minute)
4. If filler frequency > 1 per 10 seconds, cap Fluency at 5.5
5. Identify idiomatic expressions and complex grammar structures used

Provide your response in this EXACT JSON format:
{
  "overallBand": 7.0,
  "fluencyCoherence": { 
    "score": 7.0, 
    "feedback": "Detailed analysis of flow, coherence, and hesitation patterns"
  },
  "pauseAnalysis": {
    "count": 3,
    "impact": "Explanation of how pauses affected fluency score"
  },
  "lexicalResource": { 
    "score": 7.0, 
    "feedback": "Analysis of vocabulary range and precision",
    "idiomaticExpressions": ["List of good expressions used"],
    "suggestions": ["Vocabulary improvements to try"]
  },
  "grammaticalRange": { 
    "score": 7.0, 
    "feedback": "Analysis of grammar variety and accuracy",
    "complexStructures": ["List of complex structures successfully used"],
    "errorsFound": ["List of grammar errors spotted"]
  },
  "pronunciation": { 
    "score": 7.0, 
    "feedback": "Inferred pronunciation assessment based on transcription"
  },
  "fillerWords": { 
    "count": 5, 
    "examples": ["um", "like"], 
    "impact": "How fillers affected the score"
  },
  "grammarErrors": ["Specific error 1", "Specific error 2"],
  "improvements": [
    "Specific actionable improvement 1",
    "Specific actionable improvement 2",
    "Specific actionable improvement 3"
  ]
}`;
    } else if (type === "reading") {
      systemPrompt = READING_TUTOR_PROMPT;
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

    console.log("Calling AI gateway with type:", type, "taskType:", taskType, "isRevision:", isRevision);

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
    console.log("AI Response received:", aiResponse?.substring(0, 200));

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
      console.error("JSON parse error, returning raw feedback");
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
