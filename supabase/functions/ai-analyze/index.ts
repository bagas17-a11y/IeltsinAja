import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { validateRequest, AIAnalyzeSchema } from "../shared/validation.ts";
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
import { extractJsonObject } from "../shared/json-utils.ts";

// Band Examples for Calibration — based on official IELTS Cambridge sample responses
const BAND_EXAMPLES = {
  task1: {
    band9: `The pie charts compare the revenue sources and expenditure categories of a children's charity based in the USA in 2016. Overall, donated food dominated income while program services accounted for the vast majority of spending. Total revenue marginally exceeded total expenditure.

Donated food was by far the largest source of income, accounting for 86% of all revenue. The second largest contributor was community contributions at 10.4%, followed by program revenue at 2.2%. The remaining sources — investment income, government grants and other income — together made up a negligible 0.8%.

On the expenditure side, program services represented 95.8% of all spending, making it overwhelmingly dominant. The remaining 4.2% was divided between fundraising (2.6%) and management and general costs (1.6%). In total, the charity received $53,561,580 and spent $53,224,896, meaning income exceeded expenditure by a modest margin.`,
    band5: `The chart shows how people travel to work in one city. There are five different ways to travel: car, bus, train, bicycle, and walking. The numbers are in percentages.

Car is the most popular way to travel. About 45% of people use car to go to work. This is the highest number in the chart. Bus is the second most popular. Around 25% of people use bus. Train is used by about 15% of people. Bicycle is used by 10% of people. Walking is the least popular way. Only 5% of people walk to work.

In summary, most people in this city use car to go to work. The second most popular is bus. Train, bicycle and walking are less common. Car is much more popular than the other ways.`
  },
  task2: {
    band9: `The question of whether governments should prioritise investment in railway infrastructure over road development is one that divides urban planners and policymakers alike. I largely agree with this view, though I believe a complete abandonment of road investment would be inadvisable.

The environmental and social arguments for investing in rail are compelling. Trains are significantly more fuel-efficient per passenger than private cars and emit considerably less carbon dioxide per kilometre. In densely populated countries such as Japan and Germany, high-speed rail networks have dramatically reduced both congestion and carbon emissions. Moreover, railways provide an essential service for those who cannot drive — the elderly, people with disabilities, and low-income commuters who cannot afford private transport.

Furthermore, roads are subject to the phenomenon of induced demand: building more roads tends to generate more traffic rather than reduce it. This means road investment often fails to solve the problems it aims to address, whereas investment in public transport creates a genuine alternative to car ownership.

Nonetheless, roads remain indispensable, particularly in rural areas and developing nations where rail infrastructure is not economically viable. In these contexts, well-maintained roads are essential for access to healthcare, education and markets.

In conclusion, while governments should not abandon road maintenance entirely, the evidence suggests that increased investment in railways yields greater benefits for congestion, the environment and social equity. A balanced transport policy, with a clear emphasis on rail, would serve most societies best.`,
    band5: `Governments need to think about spending money on public transportation or roads. This is a big problem in many countries. I think public transportation is more important to spend money on.

Public transportation like buses and trains can help reduce traffic jams and pollution. Many cities have too many cars on the roads and people spend a lot of time in traffic every day. This is very bad. If the government makes good public transport, people will use their cars less. This is good for the environment because there will be less smoke from cars. Also, public transport is cheaper for poor people who cannot buy cars. This helps everyone in the city to move around easily. It is good for the economy too because people can get to work faster.

But some people think building more roads is better. They think more roads means less traffic. But this is not true because when you build more roads, more people buy cars and the traffic comes back again. So it is not a good solution for the traffic problem. Also, building roads is very expensive and bad for the environment because you need to cut trees and destroy nature.

In conclusion, I think governments should spend more money on public transportation instead of roads. Public transport helps reduce traffic and pollution and helps poor people. This is better for the future of cities and for the next generation. We need clean air and less traffic.`
  }
};

// Build grading prompt with optional injected training
// Uses official IELTS Writing Band Descriptors (May 2023 update, IELTS.org)
const buildGradingPrompt = (taskType: string, secretContext?: string, modelAnswer?: string, targetKeywords?: string) => {
  const isTask1 = taskType === "Task 1" || taskType.startsWith("Task 1");

  let basePrompt = isTask1 ? `You are a Senior IELTS Examiner with 15+ years of experience grading Academic Task 1 reports. You apply the official IELTS Writing Band Descriptors (May 2023).

=== OFFICIAL IELTS TASK 1 BAND DESCRIPTORS (May 2023) ===

CRITERION 1 — TASK ACHIEVEMENT (TA):
- Band 9: All requirements fully and appropriately satisfied. Extremely rare lapses.
- Band 8: All requirements covered appropriately, relevantly and sufficiently. Key features SKILFULLY selected, clearly presented, highlighted and illustrated. Occasional omissions.
- Band 7: Requirements covered. Key features selected and clearly highlighted but could be more fully illustrated. Presents a CLEAR OVERVIEW; data appropriately categorised; main trends/differences identified.
- Band 6: Key features covered and adequately highlighted. RELEVANT OVERVIEW ATTEMPTED. Some irrelevant/inaccurate detail. Some details missing or excessive.
- Band 5: Key features NOT adequately covered. Recounting of detail mainly MECHANICAL. May be NO DATA to support description. Tendency to focus on details WITHOUT the bigger picture (no overview).
- Band 4: FEW key features selected. Features presented may be irrelevant, repetitive, inaccurate or inappropriate.

CRITERION 2 — COHERENCE & COHESION (CC):
- Band 9: Message followed EFFORTLESSLY. Cohesion rarely attracts attention. Paragraphing SKILFULLY managed.
- Band 8: Message followed with EASE. Ideas logically sequenced, cohesion well managed. Occasional lapses. Paragraphing sufficient and appropriate.
- Band 7: Logically organised, CLEAR PROGRESSION throughout. Range of cohesive devices (reference and substitution) used flexibly but with some inaccuracies or over/under-use.
- Band 6: Generally arranged coherently, clear overall progression. Cohesive devices used to good effect but cohesion WITHIN/BETWEEN sentences may be FAULTY or MECHANICAL (misuse, overuse or omission). Reference/substitution may lack flexibility — some repetition.
- Band 5: Organisation evident but NOT WHOLLY LOGICAL; may lack overall progression. Sentences NOT FLUENTLY LINKED. Limited/overuse of cohesive devices. Writing may be REPETITIVE.
- Band 4: Ideas evident but NOT ARRANGED COHERENTLY. No clear progression. Relationships between ideas UNCLEAR. Basic cohesive devices may be inaccurate or repetitive.

CRITERION 3 — LEXICAL RESOURCE (LR):
- Band 9: FULL FLEXIBILITY and precise use. Wide range with very natural and sophisticated control. Errors extremely rare.
- Band 8: Wide resource FLUENTLY and FLEXIBLY used for precise meanings. Skilful use of UNCOMMON/IDIOMATIC items. Occasional errors with minimal impact.
- Band 7: Sufficient for flexibility and precision. Some ability to use LESS COMMON/IDIOMATIC items. Awareness of style and collocation though inappropriacies occur. Few spelling errors.
- Band 6: Generally adequate and appropriate. Generally clear despite RESTRICTED RANGE or LACK OF PRECISION. Some errors in spelling/word formation but don't impede communication.
- Band 5: LIMITED but minimally adequate. Simple vocabulary may be accurate but LIMITED RANGE. FREQUENT LAPSES in appropriacy. Errors may cause some difficulty for reader.
- Band 4: LIMITED AND INADEQUATE. Basic vocabulary, may be repetitive. INAPPROPRIATE WORD CHOICE or errors may IMPEDE MEANING.

CRITERION 4 — GRAMMATICAL RANGE & ACCURACY (GR):
- Band 9: Wide range with FULL FLEXIBILITY AND CONTROL. Punctuation and grammar appropriate throughout. Minor errors extremely rare.
- Band 8: Wide range FLEXIBLY AND ACCURATELY used. MAJORITY of sentences error-free. Punctuation well managed. Occasional non-systematic errors.
- Band 7: VARIETY OF COMPLEX STRUCTURES with some flexibility and accuracy. Grammar/punctuation generally well controlled. Error-free sentences frequent. Few errors that don't impede communication.
- Band 6: MIX OF SIMPLE AND COMPLEX forms but limited flexibility. Complex structures LESS ACCURATE than simple ones. Errors rarely impede communication.
- Band 5: RANGE LIMITED AND RATHER REPETITIVE. Complex sentences attempted but tend to be FAULTY. Greatest accuracy on simple sentences. Grammatical errors may be frequent and cause some difficulty.
- Band 4: VERY LIMITED RANGE. Subordinate clauses rare; simple sentences predominate. Grammatical errors frequent and may impede meaning. Punctuation often faulty.

=== MANDATORY STRUCTURAL AUDIT — 4-PARAGRAPH FORMAT ===

**Paragraph 1 (Introduction):**
- Paraphrased the question accurately? (do NOT copy the rubric; synonyms and restructuring required)
- Avoided personal opinions?
- Grade: ✅ Executed / ⚠️ Partial / ❌ Missing

**Paragraph 2 (Overview) — CRITICAL FOR BAND 7+:**
- Summarised 2-4 MAIN TRENDS without specific data figures?
- Used general terms and identified the most significant patterns?
- Missing overview → cap Task Achievement at 5.0 (Band 5 descriptor: "may be no data to support description; tendency to focus on details without the bigger picture")
- Grade: ✅ Executed / ⚠️ Partial / ❌ Missing

**Paragraph 3 (Body 1):**
- Detailed the first key feature (peaks/troughs/dominant category)?
- Supported with specific figures and comparison language?
- Grade: ✅ Executed / ⚠️ Partial / ❌ Missing

**Paragraph 4 (Body 2):**
- Detailed a second distinct key feature?
- Used precise figures and contrast/comparison language?
- Grade: ✅ Executed / ⚠️ Partial / ❌ Missing

=== KEY FEATURES AUDIT ===
Check whether the student identified these standout elements:
- Highest/Lowest values across all data series
- Sharp rises or falls / trends over time
- Notable contrasts, similarities or crossover points
- Overall pattern (e.g., general increase, one category dominates)

For PROCESS DIAGRAMS: check passive voice usage and sequence language coverage
For MAPS: check spatial language and before/after contrast language
For TABLES: check that the main anomaly or outlier is identified

=== VOCABULARY ASSESSMENT — CATEGORIES TO CHECK ===
Task 1 trend vocabulary (reward these):
- Sequencing: Subsequently, Following this, Prior to, Thereafter
- Trend direction: peaked, surged, plummeted, remained stable, fluctuated, levelled off
- Comparison: by contrast, whereas, compared with, in stark contrast to
- Approximation: approximately, roughly, just under/over, around, nearly
- Degree: dramatically, marginally, significantly, considerably, slightly
For PROCESS diagrams — Passive voice: was extracted, is placed, are fired, has been transported

=== BAND 9 CALIBRATION EXAMPLE ===
${BAND_EXAMPLES.task1.band9}

=== BAND 5 CALIBRATION EXAMPLE (what to avoid) ===
${BAND_EXAMPLES.task1.band5}

=== SCORING TENDENCIES (from Band Descriptors) ===
These are tendencies, not automatic rules — apply holistic judgement alongside them:
- No overview paragraph → Task Achievement typically 4.5–5.5 (mechanical recounting descriptor)
- No data figures in body → Task Achievement typically cannot exceed 6.0
- Cohesion faulty or mechanical throughout → CC likely 5.5–6.0 range
- Only simple sentences, no complex structures → GR likely 4.5–5.5 range
- Basic vocabulary only, no academic word choice → LR likely 4.5–5.5 range
- Under 150 words → Task Achievement likely 4.0 or lower`
  : `You are a Senior IELTS Examiner with 15+ years of experience grading Task 2 essays. You apply the official IELTS Writing Band Descriptors (May 2023).

=== OFFICIAL IELTS TASK 2 BAND DESCRIPTORS (May 2023) ===

CRITERION 1 — TASK RESPONSE (TR):
- Band 9: Prompt addressed in DEPTH. CLEAR AND FULLY DEVELOPED position which directly answers the question. Ideas RELEVANT, FULLY EXTENDED AND WELL SUPPORTED. Extremely rare lapses.
- Band 8: Appropriately and SUFFICIENTLY addressed. Clear and WELL-DEVELOPED position. Ideas RELEVANT, WELL EXTENDED AND SUPPORTED. Occasional omissions.
- Band 7: MAIN PARTS appropriately addressed. Clear and DEVELOPED POSITION. Main ideas extended and supported but may OVER-GENERALISE or lack precision.
- Band 6: Main parts addressed (some more fully than others). Position relevant but CONCLUSIONS MAY BE UNCLEAR, UNJUSTIFIED OR REPETITIVE. Some ideas insufficiently developed or lack clarity.
- Band 5: INCOMPLETELY addressed. Position expressed but DEVELOPMENT NOT ALWAYS CLEAR. Ideas LIMITED and not sufficiently developed. May be repetitive.
- Band 4: Prompt tackled MINIMALLY or tangentially. Position discernible but reader has to read carefully. Main ideas DIFFICULT TO IDENTIFY; may lack relevance, clarity or support. Large parts repetitive.

CRITERION 2 — COHERENCE & COHESION (CC):
- Band 9: Message followed EFFORTLESSLY. Cohesion rarely attracts attention. Paragraphing SKILFULLY managed.
- Band 8: Message followed with EASE. Ideas logically sequenced, cohesion well managed. Paragraphing sufficient and appropriate.
- Band 7: Logically organised, CLEAR PROGRESSION throughout. Cohesive devices including reference and substitution used flexibly but with some inaccuracies. Paragraphing generally effective. Sequencing of ideas within paragraphs generally logical.
- Band 6: Generally arranged coherently, clear overall progression. Cohesive devices used to good effect but cohesion within/between sentences may be FAULTY OR MECHANICAL. Reference/substitution may lack flexibility. Paragraphing may not always be logical; central topic may not always be clear.
- Band 5: Organisation evident but NOT WHOLLY LOGICAL; may lack overall progression. Sentences NOT FLUENTLY LINKED. Limited/overuse of cohesive devices. Writing may be REPETITIVE. PARAGRAPHING MAY BE INADEQUATE OR MISSING.
- Band 4: Ideas not arranged coherently; NO CLEAR PROGRESSION. Relationships between ideas unclear. Basic cohesive devices inaccurate or repetitive. May be NO PARAGRAPHING.

CRITERION 3 — LEXICAL RESOURCE (LR):
- Band 9: FULL FLEXIBILITY and precise use widely evident. Wide range with very natural and sophisticated control. Errors extremely rare.
- Band 8: Wide resource FLUENTLY AND FLEXIBLY used to convey precise meanings. Skilful use of UNCOMMON/IDIOMATIC items. Occasional errors with minimal impact.
- Band 7: Sufficient for flexibility and precision. Some ability to use less common/idiomatic items. Awareness of style and collocation though inappropriacies occur. Few spelling errors.
- Band 6: Generally adequate and appropriate. Generally clear despite RESTRICTED RANGE or LACK OF PRECISION. Some spelling/word formation errors.
- Band 5: Limited but minimally adequate. FREQUENT LAPSES in word choice appropriacy. Simplifications/repetitions. Errors may cause some difficulty for reader.

CRITERION 4 — GRAMMATICAL RANGE & ACCURACY (GR):
- Band 9: Wide range with FULL FLEXIBILITY AND CONTROL. Punctuation and grammar appropriate throughout.
- Band 8: Wide range FLEXIBLY AND ACCURATELY used. MAJORITY of sentences error-free. Punctuation well managed.
- Band 7: VARIETY OF COMPLEX STRUCTURES with some flexibility and accuracy. Grammar/punctuation generally well controlled. Few errors that don't impede communication.
- Band 6: MIX OF SIMPLE AND COMPLEX but limited flexibility. Complex structures less accurate. Errors rarely impede communication.
- Band 5: RANGE LIMITED AND REPETITIVE. Complex sentences attempted but tend to be FAULTY. Grammatical errors may be frequent and cause some difficulty.

=== MANDATORY STRUCTURAL AUDIT — 4-PARAGRAPH FORMAT ===

**Paragraph 1 (Introduction):**
- Paraphrased the prompt accurately? (paraphrase, not copy)
- Clear THESIS STATEMENT that directly answers the question?
- No thesis or unclear position → cap Task Response at 6.0
- Grade: ✅ Executed / ⚠️ Partial / ❌ Missing

**Paragraph 2 (Body 1 — First Argument):**
- Clear Topic Sentence stating the main idea of this paragraph?
- Supported with explanation AND a specific example or evidence?
- Grade: ✅ Executed / ⚠️ Partial / ❌ Missing

**Paragraph 3 (Body 2 — Second Argument or Counter-argument):**
- Clear Topic Sentence?
- Developed the idea further OR provided a counter-argument with concession?
- Grade: ✅ Executed / ⚠️ Partial / ❌ Missing

**Paragraph 4 (Conclusion):**
- Summarised the main points?
- Restated final opinion WITHOUT introducing new ideas?
- Grade: ✅ Executed / ⚠️ Partial / ❌ Missing

=== BAND 9 FEATURES TO SPECIFICALLY REWARD ===

**Hedging Language (very rare at Band 5-6):**
- "This could potentially lead to..." / "may result in" / "is often associated with"
- Reward as evidence of Band 7-8 sophistication

**Fully Developed Ideas (Band 9 hallmark):**
- Student takes 2 main ideas and explains them DEEPLY with a logical chain (claim → reason → evidence → implication)
- NOT merely listing many superficial points

**Cohesive Progression between sentences:**
- Ideas flow LOGICALLY from one to the next, not just connected by transition words mechanically
- Band 7+ uses reference, substitution and ellipsis, not just "Firstly, Secondly, Finally"

**For Discussion essays specifically:**
- MUST discuss both views AND give own opinion
- Discussing only one view → cap Task Response at 5.0

=== ACADEMIC VOCABULARY REFERENCE ===
Reward Band 8-9 vocabulary over Band 5-6 equivalents:
- "I think" → "It is widely acknowledged that" / "It could be argued that"
- "Many people disagree" → "This perspective is frequently contested"
- "This leads to bad things" → "This precipitates detrimental consequences"
- "This is a big problem" → "This represents a pressing societal challenge"
- "For example" → "To illustrate this point, consider" / "This is evidenced by"

=== BAND 9 CALIBRATION EXAMPLE ===
${BAND_EXAMPLES.task2.band9}

=== BAND 5 CALIBRATION EXAMPLE (what to avoid) ===
${BAND_EXAMPLES.task2.band5}

=== SCORING TENDENCIES (from Band Descriptors) ===
These are tendencies, not automatic rules — apply holistic judgement alongside them:
- Under 250 words → Task Response typically 5.0 or below
- No clear position/thesis → Task Response likely 6.0 or below
- Off-topic → Band 4 typical range
- For "Discuss both views" essays: only one view discussed → TR likely capped at 5.0
- Paragraphs missing or inadequate → CC typically 5.0 or below
- Position inconsistent throughout → TR typically 5.0 or below
- Ideas not extended or supported → typically cannot exceed Band 6`;

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

=== OFFICIAL IELTS BAND CALCULATION (MANDATORY) ===
The overall band score MUST follow the official IELTS formula:
1. Score each of the 4 criteria on the 1–9 scale in 0.5 increments.
2. Average them: (TR + CC + LR + GR) / 4
3. Round to the nearest 0.5 using IELTS rules:
   - If the decimal is .25, round UP to .5
   - If the decimal is .75, round UP to the next whole number
   - Example: average 6.25 → 6.5; average 6.75 → 7.0; average 6.5 → 6.5
4. Report this calculated value as overallBand.
DO NOT assign overallBand subjectively — it must be the rounded average of your 4 criterion scores.

=== GRADING PHILOSOPHY ===
IELTS writing assessment is inherently HOLISTIC — examiners form a global impression of the writing, not a mechanical checklist score.

1. REWARD STRENGTHS FIRST: Actively look for what the student does well. If vocabulary is sophisticated, ideas are clearly developed, or grammar is varied and accurate — reward this, even if one structural element is missing.

2. PENALTIES ARE TENDENCIES, NOT ABSOLUTE RULES: The scoring tendencies above describe typical outcomes, not automatic caps. If an essay is otherwise strong, apply proportional judgement. A student who writes a brief overview is not the same as one who writes no overview at all.

3. HOLISTIC IMPRESSION: Before assigning individual criterion scores, form an overall impression — does this writing communicate effectively? This impression should anchor your scoring.

4. Do not penalise a student purely for not using a specific structure or phrase you expected. If they achieve the communicative purpose through different means, reward that.

5. Be honest and accurate. Do not inflate scores — a Band 6 essay should receive Band 6, not 7. Be encouraging but realistic. Acknowledge improvements in revisions.`;

  return basePrompt;
};

const SPEAKING_EXAMINER_PROMPT = `You are a Senior IELTS Speaking Examiner with 15+ years of experience. Grade the transcript against the 4 official IELTS criteria.

=== PART-SPECIFIC EXPECTATIONS ===
Part 1 — Natural Extension: Student should answer directly then add 1-2 sentences of detail. Look for fluency on familiar topics (home, work, hobbies). Ideal answer = 2-4 sentences.
Part 2 — Long Turn (1.5-2 min): Student must sustain a narrative using Intro → Story/Body → Reflection. Look for chronological markers ("At first…", "After that…"), concrete details, and coherent arc. Penalise if they stop before 90 seconds.
Part 3 — Analytical Discussion: Student must move from descriptive to analytical. Expect Opinion → Reason → Example pattern. Look for hedging ("could potentially", "tends to"), contrast connectors ("On the other hand…"), and societal-level generalisation rather than personal anecdote only.

=== PAUSE & FILLER ANALYSIS ===
[pause] markers = silence >1.5 seconds. Count them. Multiple pauses per sentence = hesitation → cap Fluency at 5.5-6.0.
Filler words (um, uh, like, you know, basically, sort of, right, okay): if >1 per 10 seconds of estimated speech (~150 wpm), cap Fluency at 5.5.

=== FLUENCY & COHERENCE (25%) ===
Band 9: Fluent, rare self-correction, excellent cohesion. Part 3: develops abstract ideas coherently.
Band 7: Speaks at length without effort; hesitation is idea-related not word-searching. Flexible connectives.
Band 5: Maintains flow but uses repetition/slow speech. Over-uses simple connectors ("and", "so", "then").

=== LEXICAL RESOURCE (25%) ===
Reward: collocations ("heavy workload", "tight-knit community"), topic-specific vocab, natural paraphrasing, idiomatic expressions used accurately.
Penalise: overusing "good/bad/nice", forcing rare words incorrectly, stopping because of a missing word.

=== GRAMMATICAL RANGE & ACCURACY (25%) ===
Reward: conditionals (Part 3: "If this trend continues…"), perfect tenses ("I have been living…"), relative clauses, passive voice, cause-effect clauses.
Penalise: errors that change meaning, only short choppy sentences, over-reaching with uncontrolled complex grammar.

=== PRONUNCIATION (25%) ===
Infer from transcription: misspelled words may indicate pronunciation errors. Look for evidence of stress/intonation (punctuation patterns, emotional words). Part 1: clarity and natural pace. Part 3: downward intonation to sound authoritative.

=== GRADING PHILOSOPHY ===
Be encouraging but honest. Count pauses and fillers explicitly. For each criterion give: score, specific evidence from the transcript, and one concrete action to improve.

Speaking is a real-time task — do not penalise minor stumbles or self-corrections that do not impede communication. When a student demonstrates the key features of a band level, even partially, favour the higher band. Reserve the lower band only when the evidence clearly does not meet that level.`;

const READING_TUTOR_PROMPT = `You are an IELTS Reading specialist. A student answered incorrectly. Diagnose the mistake and teach the fix.

=== QUESTION-TYPE RULES (apply the correct one) ===
TRUE/FALSE/NOT GIVEN: "True" = passage clearly confirms. "False" = passage clearly contradicts. "Not Given" = info is absent or incomplete — if you find yourself guessing based on logic rather than text, it's NOT GIVEN. Never infer beyond what is written.
MATCHING HEADINGS: Ignore small details. Read each paragraph for its MAIN IDEA. Look for topic sentences (start/end of paragraph). Match the idea, not individual words.
COMPLETION (Sentence/Summary/Table): The answer must fit grammatically. Predict the word type (noun/verb/adjective) before scanning. Answer comes verbatim from the passage — 1-3 words unless stated otherwise.
MULTIPLE CHOICE: Underline differences between options. Eliminate distractors (options that mention a keyword from the passage but distort the meaning). Distinguish a mention of a keyword from the actual answer.

=== YOUR RESPONSE STEPS ===
1. Identify which question type this is and state the one key rule that applies
2. Show the EXACT logic path from question → passage → correct answer
3. Name the KEY SIGNAL WORDS or paraphrase the student missed
4. Explain the trap: why the wrong answer was tempting (distractor, partial match, inference error)
5. Give a 1-sentence strategy to apply on similar questions`;

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

function getMockResponse(type: string, content: string, speakingPart?: string, taskType?: string) {
  const wordCount = content.split(/\s+/).filter(Boolean).length;

  if (type === "speaking") {
    const fillerWords = (content.match(/\b(um|uh|like|you know|basically|actually|I mean|so|well|kind of|sort of)\b/gi) || []);
    const pauseCount = (content.match(/\[pause\]/g) || []).length;
    const words = content.trim().split(/\s+/).filter(Boolean);

    return {
      overallBand: 6.5,
      bandScoreRange: "+/- 0.5",
      accuracyScore: 72,
      isMock: true,
      polishedTranscript: content.replace(/\b(um|uh|like|you know|basically|actually|I mean|kind of|sort of)\b/gi, '').replace(/\s{2,}/g, ' ').trim(),
      enhancedSpeechNextBand: (() => {
        const clean = content
          .replace(/\[pause\]/gi, '')
          .replace(/\b(um|uh|like|you know|basically|actually|I mean|kind of|sort of|right|okay)\b/gi, '')
          .replace(/\s{2,}/g, ' ').trim();
        return clean.charAt(0).toUpperCase() + clean.slice(1);
      })(),
      taskResponse: {
        score: 6.5,
        feedback: ["The response addresses the question directly with relevant content.", "Some personal detail was included which strengthened the answer.", "Elaborate further and add a specific example to boost task coverage."]
      },
      fluencyCoherence: {
        score: 6.5,
        feedback: ["Reasonable flow maintained throughout the response.", "Basic connectors were used to link ideas.", "Try 'furthermore', 'in addition', and 'on the other hand' for smoother linking."]
      },
      pauseAnalysis: {
        count: pauseCount,
        impact: pauseCount > 3
          ? "Frequent pauses interrupted your flow. Practice speaking on familiar topics for 2 minutes without stopping."
          : "Your pauses were within acceptable range. Keep working on maintaining steady speech."
      },
      lexicalResource: {
        score: 6.5,
        feedback: ["Adequate vocabulary was used for the topic.", "Some natural phrasing came through in the response.", "Incorporate more precise or topic-specific vocabulary to improve range."],
        idiomaticExpressions: ["Good attempt at natural speech patterns"],
        suggestions: [
          "Use 'from my perspective' instead of 'I think'",
          "Try 'it goes without saying' for obvious points",
          "Use 'a wide range of' instead of 'many'"
        ]
      },
      grammaticalRange: {
        score: 6.5,
        feedback: ["A mix of simple and some complex structures was used.", "Sentence variety was present, which is positive.", "Try conditionals ('If I had the chance...') and relative clauses to extend range."],
        complexStructures: ["Basic sentence structures used effectively"],
        errorsFound: ["Consider varying sentence structures more", "Try using more complex tenses"]
      },
      pronunciation: {
        score: 6.5,
        feedback: ["Pronunciation appears generally clear from the transcription.", "Word stress on key content words seems appropriate.", "Focus on intonation patterns to sound more natural and confident."]
      },
      fillerWords: {
        count: fillerWords.length,
        examples: fillerWords.slice(0, 5).map((w: string) => w.toLowerCase()),
        impact: fillerWords.length > 5
          ? "High filler word frequency. Replace fillers with brief pauses — silence sounds more confident than 'um'."
          : "Filler word usage is manageable. Continue working on reducing them."
      },
      grammarErrors: [
        "Practice using past perfect tense for experiences",
        "Work on subject-verb agreement in complex sentences"
      ],
      improvements: [
        "Develop each point with a specific example or personal experience",
        "Use a wider range of linking words (furthermore, nevertheless, consequently)",
        "Practice the 'PEEL' structure: Point, Explain, Example, Link back"
      ]
    };
  }

  if (type === "writing") {
    const isTask1 = taskType === "Task 1" || taskType?.startsWith("Task 1");
    const minWords = isTask1 ? 150 : 250;
    const bandScore = wordCount < minWords ? 5.5 : 6.5;

    if (isTask1) {
      return {
        wordCount,
        overallBand: bandScore,
        isMock: true,
        isRevision: false,
        structuralGrade: {
          paragraph1_introduction: {
            status: "partial",
            paraphrased: true,
            noOpinions: true,
            feedback: "Your introduction paraphrases the question adequately. Try to include more specific details about what the data shows."
          },
          paragraph2_overview: {
            status: "partial",
            trendsCount: 1,
            usedGeneralTerms: true,
            feedback: "Your overview identifies some trends. Aim to highlight 2-3 main patterns without using specific figures."
          },
          paragraph3_body1: {
            status: "executed",
            hasKeyFeature: true,
            hasDataSupport: true,
            feedback: "Good use of data to support your first key feature. Consider adding comparisons between data points."
          },
          paragraph4_body2: {
            status: "partial",
            hasSecondFeature: true,
            hasPreciseFigures: false,
            feedback: "Include more precise figures to strengthen this paragraph. Use phrases like 'approximately', 'roughly', or 'just over'."
          }
        },
        keyFeaturesAudit: {
          identified: ["Main trend identified", "Some data points mentioned"],
          missed: ["Highest/lowest values could be highlighted more", "Notable contrasts between categories"]
        },
        vocabularySuggestions: {
          sequencing: ["Subsequently", "Following this"],
          contrast: ["Conversely", "In contrast"],
          result: ["Consequently", "As a result"],
          emphasis: ["Notably", "Significantly"]
        },
        scoringGrid: {
          taskResponse: { score: bandScore, justification: wordCount < minWords ? ["Under minimum word count — this significantly impacts task achievement"] : ["Key features of the data are identified", "Some comparisons and data figures provided", "Include a clearer overview with 2–3 main trends to improve"] },
          coherenceCohesion: { score: 6.5, justification: ["Logical organisation is generally evident", "Some cohesive devices are used appropriately", "Improve sentence-level linking and avoid repetitive connectors"] },
          lexicalResource: { score: 6.5, justification: ["Adequate range of vocabulary for the task", "Some academic word choices attempted", "Incorporate more precise trend vocabulary (e.g. 'plummeted', 'levelled off')"] },
          grammaticalRange: { score: 6.5, justification: ["A mix of simple and some complex structures used", "Passive voice attempted in places", "Practice more complex comparative and passive constructions"] }
        },
        band8Transformations: [
          {
            original: "The chart shows...",
            rewrite: "The chart delineates the comparative trends in...",
            explanation: "Use more precise academic vocabulary to describe visual data"
          }
        ],
        criticalFixes: [
          "Include a clearer overview paragraph with 2-3 main trends",
          "Use more comparison language (whereas, while, in contrast)"
        ],
        actionableNextStep: "Practice writing overviews for different chart types (pie, bar, line) focusing on identifying 2-3 key features without specific data."
      };
    } else {
      return {
        wordCount,
        overallBand: bandScore,
        isMock: true,
        isRevision: false,
        structuralGrade: {
          paragraph1_introduction: {
            status: "partial",
            paraphrased: true,
            hasThesis: true,
            feedback: "Your introduction addresses the topic. Strengthen your thesis statement to clearly state your position."
          },
          paragraph2_body1: {
            status: "executed",
            hasTopicSentence: true,
            hasExample: true,
            feedback: "Good topic sentence and development. Try to include a more specific, real-world example."
          },
          paragraph3_body2: {
            status: "partial",
            hasTopicSentence: true,
            developedOrCounterArg: false,
            feedback: "Consider adding a counter-argument and then refuting it to show critical thinking."
          },
          paragraph4_conclusion: {
            status: "executed",
            summarized: true,
            noNewIdeas: true,
            feedback: "Your conclusion summarizes well. Try restating your thesis in different words."
          }
        },
        band9Highlights: {
          hedgingUsed: {
            found: false,
            examples: [],
            suggestions: ["Use 'This could potentially lead to...' instead of 'This will lead to...'", "Try 'It is often argued that...' for introducing views"]
          },
          cohesiveProgression: {
            score: "Adequate",
            feedback: "Ideas connect reasonably but could flow more naturally. Ensure each sentence builds on the previous one."
          },
          ideaDepth: {
            score: "Moderate",
            feedback: "Ideas are explained but not deeply. Take 2 main ideas and develop them with specific examples rather than listing many points."
          }
        },
        vocabularyUpgrades: [
          { original: "I think", upgrade: "It is my firm conviction that", function: "Agreeing" },
          { original: "This is a big problem", upgrade: "This represents a pressing societal challenge", function: "Emphasizing" },
          { original: "For example", upgrade: "To illustrate this point, consider", function: "Proving" }
        ],
        scoringGrid: {
          taskResponse: { score: bandScore, justification: wordCount < minWords ? ["Under minimum word count — this significantly impacts task response score"] : ["The main task is addressed with a recognisable position", "Some development of ideas is present", "Extend ideas further with specific examples or evidence"] },
          coherenceCohesion: { score: 6.5, justification: ["Logical paragraph structure is maintained", "Some cohesive devices link ideas between paragraphs", "Improve sentence-to-sentence flow and vary linking expressions"] },
          lexicalResource: { score: 6.5, justification: ["Adequate vocabulary range for the topic", "Some topic-specific and academic word choices attempted", "Incorporate more precise and less common vocabulary for next band"] },
          grammaticalRange: { score: 6.5, justification: ["A variety of sentence structures used", "Some complex sentences attempted with reasonable accuracy", "Practice conditionals, relative clauses and passive voice for more range"] }
        },
        band8Transformations: [
          {
            original: "Many people think this is important",
            rewrite: "It is widely acknowledged that this issue holds considerable significance",
            explanation: "Replace informal language with academic register"
          }
        ],
        criticalFixes: [
          "Develop a stronger thesis statement with a clear position",
          "Include specific examples (statistics, case studies, personal experience)"
        ],
        actionableNextStep: "Practice writing thesis statements for 10 different essay prompts. Each should clearly state your position in one sentence."
      };
    }
  }

  if (type === "reading") {
    return {
      isMock: true,
      correctAnswer: "See the passage for the correct answer",
      stepByStepLogic: [
        "Step 1: Identify the key words in the question",
        "Step 2: Scan the passage for synonyms or paraphrases of these key words",
        "Step 3: Read the surrounding sentences carefully for context",
        "Step 4: Match the information to determine the correct answer"
      ],
      keySignalWords: ["however", "although", "in contrast", "furthermore"],
      commonMistake: "Students often choose answers based on matching individual words rather than understanding the overall meaning of the passage.",
      technique: "Use the 'skim and scan' technique: first skim for general understanding, then scan for specific information related to the question."
    };
  }

  return { isMock: true, feedback: "Mock response - AI service temporarily unavailable" };
}

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
    const validation = validateRequest(AIAnalyzeSchema, requestBody);
    if (!validation.success) {
      return validationError(
        validation.error.message,
        validation.error.details,
        corsHeaders
      );
    }

    const { type, content, taskType, isRevision, questionId, secretContext, modelAnswer, targetKeywords, prompt, speakingPart, question } = validation.data;

    const ANTHROPIC_API_KEY = Deno.env.get("ANTHROPIC_API_KEY");
    const USE_MOCK_DATA = Deno.env.get("USE_MOCK_DATA") === "true";

    // Global mock mode or missing API key — return mock without calling Claude
    if (USE_MOCK_DATA || !ANTHROPIC_API_KEY) {
      console.log("Mock mode active, skipping Claude API call for type:", type);
      const mockResponse = getMockResponse(type, content, speakingPart, taskType);
      return successResponse(mockResponse, 200, corsHeaders);
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

      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "x-api-key": ANTHROPIC_API_KEY,
          "anthropic-version": "2023-06-01",
          "content-type": "application/json",
        },
        body: JSON.stringify({
          // Haiku is sufficient for structured essay generation (Task 1 ~250 tok, Task 2 ~430 tok)
          model: "claude-haiku-4-5-20251001",
          max_tokens: 800,
          temperature: 0.7,
          messages: [
            { role: "user", content: `${systemPrompt}\n\n${userPrompt}` },
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
        return aiServiceError("Failed to generate model answer", { status: response.status }, corsHeaders);
      }

      const data = await response.json();
      const modelAnswerText = data.content?.[0]?.text;

      return successResponse({ modelAnswer: modelAnswerText }, 200, corsHeaders);
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
        userPrompt = `Analyze this IELTS Task 1 Academic report using the official IELTS Band Descriptors (May 2023).
${revisionNote}

WORD COUNT: ${wordCount} words (Minimum required: ${minWords})
${wordCount < minWords ? `⚠️ PENALTY: Under minimum word count (150). Cap Task Achievement at 4.0 per official descriptors.` : ''}

STUDENT'S TASK 1 REPORT:
${content}

SCORING INSTRUCTIONS:
- "taskResponse" in this JSON = TASK ACHIEVEMENT (the official Task 1 criterion name)
- Score each criterion independently on the 0.5-9.0 scale using the official band descriptors provided
- overallBand = mathematical average of 4 scores, IELTS-rounded (see formula)
- IELTS rounding: average 6.125 → 6.0; 6.25 → 6.5; 6.75 → 7.0; 6.875 → 7.0

Provide your response in this EXACT JSON format:
{
  "wordCount": ${wordCount},
  "overallBand": 0.0,
  "isRevision": ${isRevision || false},
  "scoringGrid": {
    "taskResponse": { "score": 0.0, "justification": ["What the student did well on task achievement", "Specific evidence from the essay", "The key thing to improve for the next band"] },
    "coherenceCohesion": { "score": 0.0, "justification": ["What the student did well on coherence", "Specific structural evidence from the essay", "Key improvement needed"] },
    "lexicalResource": { "score": 0.0, "justification": ["Vocabulary strength observed", "Specific word choice evidence from the essay", "Key vocabulary improvement to make"] },
    "grammaticalRange": { "score": 0.0, "justification": ["Grammar strength observed", "Specific grammar evidence from the essay", "Key grammar improvement to make"] }
  },
  "structuralGrade": {
    "paragraph1_introduction": {
      "status": "executed/partial/missing",
      "paraphrased": true,
      "noOpinions": true,
      "feedback": "One sentence fix if not fully executed, else empty string"
    },
    "paragraph2_overview": {
      "status": "executed/partial/missing",
      "trendsCount": 2,
      "usedGeneralTerms": true,
      "feedback": "Brief feedback — does it state main trends WITHOUT data figures? Missing overview = cap TA at 5.0"
    },
    "paragraph3_body1": {
      "status": "executed/partial/missing",
      "hasKeyFeature": true,
      "hasDataSupport": true,
      "feedback": "Brief feedback on whether specific data supports the key feature"
    },
    "paragraph4_body2": {
      "status": "executed/partial/missing",
      "hasSecondFeature": true,
      "hasPreciseFigures": true,
      "feedback": "Brief feedback on second body paragraph"
    }
  },
  "keyFeaturesAudit": {
    "identified": ["specific key features the student correctly covered with data"],
    "missed": ["specific key features from the question that were omitted or under-developed"]
  },
  "band8Transformations": [
    {
      "original": "Exact sentence from the student's essay",
      "rewrite": "Band 8.0+ version using academic vocabulary and complex grammar",
      "explanation": "One sentence: what specific improvement was made"
    }
  ],
  "criticalFixes": ["Most impactful fix based on the rubric", "Second fix", "Third fix if applicable"],
  "actionableNextStep": "One specific, concrete practice task to do before next attempt",
  "nextBandModelAnswer": "A complete Task 1 report written at exactly one band above the student's overallBand. Same data and topic, but elevated to that band level. Must be a full report with intro, overview, and two body paragraphs — not a fragment."
}
IMPORTANT: overallBand MUST equal the mathematically averaged and IELTS-rounded result of your 4 scoringGrid scores. It is NOT subjective — calculate it precisely.`;
      } else {
        userPrompt = `Analyze this IELTS Task 2 essay using the official IELTS Band Descriptors (May 2023).
${revisionNote}

WORD COUNT: ${wordCount} words (Minimum required: ${minWords})
${wordCount < minWords ? `⚠️ PENALTY: Under minimum word count (250). Cap Task Response at 5.0 per official descriptors.` : ''}

STUDENT'S TASK 2 ESSAY:
${content}

SCORING INSTRUCTIONS:
- Score each criterion independently on the 0.5-9.0 scale using the official band descriptors provided
- overallBand = mathematical average of 4 scores, IELTS-rounded
- IELTS rounding: .25 → round up to .5; .75 → round up to next whole; .5 stays as .5
- For "Discuss both views" essays: if only one view discussed → cap Task Response at 5.0
- No clear thesis in introduction → cap Task Response at 6.0

Provide your response in this EXACT JSON format:
{
  "wordCount": ${wordCount},
  "overallBand": 0.0,
  "isRevision": ${isRevision || false},
  "scoringGrid": {
    "taskResponse": { "score": 0.0, "justification": ["What the student did well on task response", "Specific evidence from the essay", "The key thing to improve for the next band"] },
    "coherenceCohesion": { "score": 0.0, "justification": ["What the student did well on coherence", "Specific structural evidence from the essay", "Key improvement needed"] },
    "lexicalResource": { "score": 0.0, "justification": ["Vocabulary strength observed", "Specific word choice evidence from the essay", "Key vocabulary improvement to make"] },
    "grammaticalRange": { "score": 0.0, "justification": ["Grammar strength observed", "Specific grammar evidence from the essay", "Key grammar improvement to make"] }
  },
  "structuralGrade": {
    "paragraph1_introduction": {
      "status": "executed/partial/missing",
      "paraphrased": true,
      "hasThesis": true,
      "feedback": "One sentence — does it paraphrase the prompt AND state a clear position? No thesis = cap TR at 6.0"
    },
    "paragraph2_body1": {
      "status": "executed/partial/missing",
      "hasTopicSentence": true,
      "hasExample": true,
      "feedback": "Brief feedback — topic sentence + developed argument + specific example/evidence?"
    },
    "paragraph3_body2": {
      "status": "executed/partial/missing",
      "hasTopicSentence": true,
      "developedOrCounterArg": true,
      "feedback": "Brief feedback — second argument developed or counter-argument with concession?"
    },
    "paragraph4_conclusion": {
      "status": "executed/partial/missing",
      "summarized": true,
      "noNewIdeas": true,
      "feedback": "Brief feedback — does it summarise without introducing new information?"
    }
  },
  "vocabularyUpgrades": [
    {
      "original": "actual simple word/phrase found in the student's essay",
      "upgrade": "precise academic alternative appropriate for IELTS Band 7-8",
      "function": "Agreeing/Disputing/Showing Cause/Emphasizing/Proving/Hedging"
    }
  ],
  "band8Transformations": [
    {
      "original": "Exact sentence copied from the student's essay",
      "rewrite": "Band 8.0+ version with improved vocabulary, grammar and cohesion",
      "explanation": "One sentence: what specific improvements were made (vocabulary/grammar/structure)"
    }
  ],
  "criticalFixes": ["Most impactful fix tied to the lowest-scoring rubric criterion", "Second fix", "Third fix if applicable"],
  "actionableNextStep": "One specific, concrete practice task to do before next attempt",
  "nextBandModelAnswer": "A complete Task 2 essay written at exactly one band above the student's overallBand. Same question and position, but elevated to that band level. Must be a full essay with intro, two body paragraphs, and conclusion — not a fragment."
}
IMPORTANT: overallBand MUST equal the mathematically averaged and IELTS-rounded result of your 4 scoringGrid scores. It is NOT subjective — calculate it precisely.`;
      }
    } else if (type === "speaking") {
      systemPrompt = SPEAKING_EXAMINER_PROMPT;

      const partLabel = speakingPart === 'part1' ? 'Part 1 (Introduction & Interview — familiar topics, 4-5 min)'
        : speakingPart === 'part3' ? 'Part 3 (Discussion — abstract/analytical, 4-5 min)'
        : 'Part 2 (Long Turn — cue card, 1-2 min monologue)';

      userPrompt = `Analyze this IELTS Speaking transcription.

SPEAKING PART: ${partLabel}
QUESTION/CUE CARD: ${question || 'General speaking practice'}

TRANSCRIPTION (with [pause] markers for silences > 1.5 seconds):
${content}

=== ANALYSIS INSTRUCTIONS ===
1. Count all [pause] markers - these indicate hesitation
2. Count all filler words (um, uh, like, you know, basically, etc.)
3. If filler frequency > 1 per 10 seconds, cap Fluency at 5.5
4. Identify idiomatic expressions and complex grammar structures used
5. Generate a polishedTranscript: fix grammar errors and remove fillers. Keep the student's EXACT topic, ideas, and content.
6. Generate an enhancedSpeechNextBand: rewrite the response targeting exactly one full band above the student's overallBand (e.g., if Band 5 → write at Band 6 level). Keep every one of the student's ideas and personal story. Make incremental, realistic improvements: smoother connectors, slightly better vocabulary, fewer fillers. Sound like a real person improving, not a textbook.

Provide your response in this EXACT JSON format:
{
  "overallBand": 7.0,
  "bandScoreRange": "+/- 0.5",
  "accuracyScore": 73,
  "polishedTranscript": "Grammar-fixed, filler-free version of student's actual words",
  "enhancedSpeechNextBand": "One-band-higher version — same ideas, incremental improvements in flow and word choice",
  "taskResponse": {
    "score": 7.0,
    "feedback": ["Key observation about task coverage", "What was done well", "One specific thing to improve"]
  },
  "fluencyCoherence": {
    "score": 7.0,
    "feedback": ["Observation about flow and hesitation", "Linking device usage", "One specific improvement"]
  },
  "pauseAnalysis": {
    "count": 3,
    "impact": "How pauses affected the fluency score"
  },
  "lexicalResource": {
    "score": 7.0,
    "feedback": ["Vocabulary range observation", "Strength in word choice", "One specific improvement"],
    "idiomaticExpressions": ["good expressions the student used"],
    "suggestions": ["specific vocabulary improvements to try next time"]
  },
  "grammaticalRange": {
    "score": 7.0,
    "feedback": ["Grammar range observation", "Structures used well", "One specific error or gap to address"],
    "complexStructures": ["complex structures successfully used"],
    "errorsFound": ["specific grammar errors found"]
  },
  "pronunciation": {
    "score": 7.0,
    "feedback": ["Pronunciation clarity observation", "Stress and intonation note", "One specific improvement"]
  },
  "fillerWords": {
    "count": 5,
    "examples": ["um", "like"],
    "impact": "How fillers affected the score"
  },
  "grammarErrors": ["Specific error 1", "Specific error 2"],
  "improvements": [
    "Most impactful actionable improvement",
    "Second improvement",
    "Third improvement"
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

    // Writing & Speaking use Sonnet for quality; Reading uses Haiku for speed
    const analysisModel = type === "reading" ? "claude-haiku-4-5-20251001" : "claude-sonnet-4-6";
    const maxTokens = type === "writing" ? 5000 : type === "speaking" ? 7500 : 800;

    console.log("Calling Claude API with type:", type, "model:", analysisModel, "taskType:", taskType, "isRevision:", isRevision);

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key": ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
        "content-type": "application/json",
      },
      body: JSON.stringify({
        model: analysisModel,
        max_tokens: maxTokens,
        temperature: 0.3,
        messages: [
          { role: "user", content: `${systemPrompt}\n\n${userPrompt}` },
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Claude API error:", response.status, errorText);

      if (response.status === 401) {
        return unauthorizedError("Invalid API key", corsHeaders);
      }
      // For all other errors (429, 402, 500, etc.) fall back to mock data
      // so users always receive feedback even when the API is unavailable
      console.log("Claude API unavailable (status:", response.status, "), falling back to mock for:", type);
      const mockResponse = getMockResponse(type, content, speakingPart, taskType);
      return successResponse(mockResponse, 200, corsHeaders);
    }

    const data = await response.json();
    const aiResponse = data.content?.[0]?.text;
    console.log("AI Response received:", aiResponse?.substring(0, 200));

    // Try to parse JSON from response using robust extraction
    const parsedResponse = extractJsonObject(aiResponse);
    if (!parsedResponse) {
      // Claude returned something we can't parse — fall back to mock
      console.warn("Could not parse Claude response as JSON, falling back to mock for:", type);
      const mockResponse = getMockResponse(type, content, speakingPart, taskType);
      return successResponse(mockResponse, 200, corsHeaders);
    }

    return successResponse(parsedResponse, 200, corsHeaders);
  } catch (error: unknown) {
    console.error("AI analyze error:", error);
    // Always return mock rather than a 500 so the user sees useful feedback
    const mockResponse = getMockResponse(type, content, speakingPart, taskType);
    return successResponse(mockResponse, 200, corsHeaders);
  }
});
