import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Band Examples for Calibration
const BAND_EXAMPLES = {
  task1: {
    band9: `The line graph displays the stock values of four different high-tech corporations from 2011 to 2016. Overall, Facebook's value steadily increased, while Yahoo's decreased. Apple's stock price fluctuated wildly throughout the period and Google's stayed relatively unchanged. Facebook started the period with a stock market valuation of approximately 7,500 and this consistently moved up in value year on year to reach a peak of around 20,000 in 2016. Yahoo began the recorded period with a very similar value to Facebook, but in contrast, its stock devalued every year, until it reached a low of about 2,500 in 2016. Apple stock was valued at just below 5,000 in 2011 and this jumped dramatically to nearly 35,000 the following year, before plummeting to around 7,000 in 2013. It recovered slightly in 2014 to around 12,000 and subsequently fell to a price of just over 5,000 in 2016. Google's shares remained at around 1,000 for the entire period.`,
    band5: `The chart shows how people travel to work in one city. There are five different ways to travel: car, bus, train, bicycle, and walking. The numbers are in percentages.

Car is the most popular way to travel. About 45% of people use car to go to work. This is the highest number in the chart. Bus is the second most popular. Around 25% of people use bus. Train is used by about 15% of people. Bicycle is used by 10% of people. Walking is the least popular way. Only 5% of people walk to work.

In summary, most people in this city use car to go to work. The second most popular is bus. Train, bicycle and walking are less common. Car is much more popular than the other ways.`
  },
  task2: {
    band9: `Experts throughout both the developing and developed world have debated whether the advent of sophisticated modern technology such as mobile phones, laptops and iPad have helped to enhance and improve people's social lives or whether the opposite has become the case.

Personally, I strongly advocate the former view. This essay will discuss both sides using examples from the UK government and Oxford University to demonstrate points and prove arguments.

On the one hand there is ample, powerful, almost daily evidence that such technology can be detrimental especially to the younger generation who are more easily affected by it's addictive nature and which can result in people feeling more isolated from the society.

The central reason behind this is twofold, firstly, the invention of online social media sites and apps, such as Twitter and Facebook have reduced crucial face-to-face interactions dramatically. Through use of these appealing and attractive mediums, people feel in touch and connected yet lack key social skills and the ability to communicate.

Secondly, dependence on such devices is built up frighteningly easily which may have a damaging effect on mental health and encourage a sedentary lifestyle. For example, recent scientific research by the UK government demonstrated that 90% of people in their 30s spend over 20 hours per week on Messenger and similar applications to chat with their friends instead of meeting up and spending quality time together or doing sport. As a result, it is conclusively clear that these technology advancements have decreased and diminished our real life interactions.

On the other hand, although there are significant downsides to technological developments, its' multifold advantages cannot be denied. This is largely because the popularity of technology such as cellphones allows people to connect freely and easily with no geographical barriers.

People are able to share any type of news, information, photos and opinions with their loved ones whenever and wherever they want therefore keeping a feeling of proximity and closeness. For example, an extensive study by Oxford University illustrated that people who work, or study abroad and use applications like Facetime and WhatsApp to chat with their families, are less likely to experience loneliness and feel out of the loop than those who do not.

Consistent with this line of thinking is that businessmen are also undoubtedly able to benefit from these advances by holding virtual real-time meetings using Skype which may increase the chance of closing business deals without the need to fly.

From the arguments and examples given I firmly believe that overall communication and mans' sociability has been advanced enormously due to huge the huge technological progress of the past twenty years and despite some potentially serious health implications which governments should not fail to address, it is predicted that its popularity will continue to flourish in the future.`,
    band5: `Governments need to think about spending money on public transportation or roads. This is a big problem in many countries. I think public transportation is more important to spend money on.

Public transportation like buses and trains can help reduce traffic jams and pollution. Many cities have too many cars on the roads and people spend a lot of time in traffic every day. This is very bad. If the government makes good public transport, people will use their cars less. This is good for the environment because there will be less smoke from cars. Also, public transport is cheaper for poor people who cannot buy cars. This helps everyone in the city to move around easily. It is good for the economy too because people can get to work faster.

But some people think building more roads is better. They think more roads means less traffic. But this is not true because when you build more roads, more people buy cars and the traffic comes back again. So it is not a good solution for the traffic problem. Also, building roads is very expensive and bad for the environment because you need to cut trees and destroy nature.

In conclusion, I think governments should spend more money on public transportation instead of roads. Public transport helps reduce traffic and pollution and helps poor people. This is better for the future of cities and for the next generation. We need clean air and less traffic.`
  }
};

const DIAGNOSTIC_WRITING_PROMPT = `You are a Senior IELTS Examiner with 15+ years of experience. Your role is to provide DIAGNOSTIC FEEDBACK that helps students understand exactly where they stand and how to improve.

=== CALIBRATION BENCHMARKS ===

TASK 1 - BAND 9 EXAMPLE:
${BAND_EXAMPLES.task1.band9}

TASK 1 - BAND 5 EXAMPLE:
${BAND_EXAMPLES.task1.band5}

TASK 2 - BAND 9 EXAMPLE:
${BAND_EXAMPLES.task2.band9}

TASK 2 - BAND 5 EXAMPLE:
${BAND_EXAMPLES.task2.band5}

=== SCORING CRITERIA ===

TASK RESPONSE (Did they answer the prompt? Is the position clear?):
- Band 9: Fully addresses all parts; fully developed position
- Band 7: Addresses all parts; clear position; main ideas developed
- Band 5: Only partially addresses; position unclear; limited development

COHERENCE & COHESION (Logical paragraphing and transition words):
- Band 9: Uses cohesion seamlessly; skilful paragraphing
- Band 7: Logically organises; clear progression; appropriate cohesive devices
- Band 5: Some organisation; lacks progression; limited cohesive devices

LEXICAL RESOURCE (Vocabulary range, precision, and collocations):
- Band 9: Wide range; sophisticated control; rare minor slips
- Band 7: Sufficient range; less common items; aware of style
- Band 5: Limited range; repetitive; noticeable errors

GRAMMATICAL RANGE & ACCURACY (Complex structures vs. error frequency):
- Band 9: Wide range; full flexibility; rare minor errors
- Band 7: Variety of complex structures; frequent error-free sentences
- Band 5: Limited range; attempts complex sentences with limited accuracy

=== PENALTIES ===
- Task 1: If < 150 words, cap Task Response at 5.0
- Task 2: If < 250 words, cap Task Response at 5.0
- Off-topic: Max score = 4.0

=== YOUR FEEDBACK STRUCTURE ===

You MUST provide feedback in this EXACT structure:

1. EXECUTIVE SUMMARY: A 2-sentence overview of the student's current performance level.

2. THE SCORING GRID: Scores (1.0 - 9.0) for each criterion with brief justification.

3. THE BAND 8.0+ TRANSFORMATION: Pick THREE specific sentences from the essay. Show the 'Original' and provide a 'Band 8.0+ Rewrite' for each, explaining the high-level vocabulary or grammatical structure added.

4. CRITICAL FIXES: List the most obvious recurring errors (e.g., 'Article usage', 'Overuse of simple connectors') holding their score back.

5. ACTIONABLE NEXT STEP: Specific exercises they should do before their next attempt.

Be direct, honest, and focused on improvement. Use half-band scores when appropriate.`;

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
      
      userPrompt = `Analyze this IELTS ${taskType} essay and provide DIAGNOSTIC FEEDBACK.

WORD COUNT: ${wordCount} words (Minimum required: ${minWords})
${wordCount < minWords ? `⚠️ PENALTY: Essay is under minimum length. Cap Task Response at 5.0.` : ''}

TASK TYPE: ${taskType}
${taskType === "Task 1" ? "This is an Academic Task 1 - the student should describe/summarize visual information (graph, chart, table, diagram, map, or process)." : "This is a Task 2 Essay - the student should present and justify an opinion, discuss a problem, or compare viewpoints."}

STUDENT'S ESSAY:
${content}

Provide your response in this EXACT JSON format:
{
  "wordCount": ${wordCount},
  "overallBand": 7.0,
  "executiveSummary": "Two sentences summarizing the student's current performance level and main areas for improvement.",
  "scoringGrid": {
    "taskResponse": { "score": 7.0, "justification": "Brief explanation of why this score was given" },
    "coherenceCohesion": { "score": 7.0, "justification": "Brief explanation" },
    "lexicalResource": { "score": 7.0, "justification": "Brief explanation" },
    "grammaticalRange": { "score": 7.0, "justification": "Brief explanation" }
  },
  "band8Transformations": [
    {
      "original": "Quote the exact sentence from the essay",
      "rewrite": "The Band 8.0+ version of this sentence",
      "explanation": "What high-level vocabulary or grammatical structure was added and why it improves the score"
    },
    {
      "original": "Second sentence quote",
      "rewrite": "Band 8.0+ version",
      "explanation": "Explanation of improvements"
    },
    {
      "original": "Third sentence quote",
      "rewrite": "Band 8.0+ version",
      "explanation": "Explanation of improvements"
    }
  ],
  "criticalFixes": [
    "First recurring error (e.g., 'Article usage - missing 'the' before specific nouns')",
    "Second recurring error",
    "Third recurring error"
  ],
  "actionableNextStep": "Specific exercise recommendation with clear instructions for what to practice before the next attempt"
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

    let systemPrompt = DIAGNOSTIC_WRITING_PROMPT;
    if (type === "speaking") {
      systemPrompt = SPEAKING_EXAMINER_PROMPT;
    } else if (type === "reading") {
      systemPrompt = READING_TUTOR_PROMPT;
    }

    console.log("Calling AI gateway with type:", type, "taskType:", taskType);

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
