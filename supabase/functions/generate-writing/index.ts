import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { validateRequest, GenerateWritingSchema } from "../shared/validation.ts";
import {
  corsHeaders,
  handleCorsPreflightRequest,
  successResponse,
  validationError,
  unauthorizedError,
  rateLimitError,
  aiServiceError,
  internalError,
} from "../shared/errors.ts";

// ============================================================
// IELTS Writing Prompt Generator — System Prompt
// Based on official IELTS Academic Writing Sample Tasks 2023
// ============================================================
const WRITING_SYSTEM_PROMPT = `You are a senior IELTS Academic Writing test designer with 20+ years of experience creating official Cambridge IELTS materials.

=== WRITING TEST STRUCTURE ===

TASK 1 (20 minutes, minimum 150 words):
Candidates describe visual information in their own words.
Visual types and their key features:
- BAR CHART: Compare categories; describe highest/lowest; note trends. Data: 6-10 data points across 2-4 categories.
- LINE GRAPH: Show change over time; describe trends (rise, fall, fluctuate, peak, plateau). Data: 2-3 lines, 6-8 time points.
- PIE CHART: Show proportions/percentages; describe largest/smallest segments. Data: 4-6 segments, must total 100%.
- TABLE: Compare multiple variables; identify patterns and anomalies. Data: 3-5 rows × 3-5 columns.
- PROCESS DIAGRAM: Describe sequential steps; use passive voice and sequence language. Steps: 6-9 stages.
- MAP: Describe change between two time periods; note additions, removals, relocations. Before/after comparison.
- BAR+LINE COMBO: Two data series with different units on dual axes.

TASK 2 (40 minutes, minimum 250 words):
Candidates argue a position, discuss views, or solve a problem.
Essay types:
- OPINION (agree/disagree): "To what extent do you agree or disagree?" — nuanced position required.
- DISCUSSION: "Discuss both views and give your own opinion." — balanced analysis + personal stance.
- ADVANTAGES/DISADVANTAGES: "Do the advantages outweigh the disadvantages?" — weighing exercise.
- PROBLEM/SOLUTION: "What are the causes? What solutions can you suggest?" — analytical.
- DIRECT QUESTION: Two or three specific sub-questions requiring developed answers.

=== ASSESSMENT CRITERIA ===
Task 1: Task Achievement | Coherence and Cohesion | Lexical Resource | Grammatical Range and Accuracy
Task 2: Task Response | Coherence and Cohesion | Lexical Resource | Grammatical Range and Accuracy

=== DATA REQUIREMENTS ===
For all Task 1 visuals, you MUST provide actual numerical data that the candidate can use to write their response. The data should be realistic and internally consistent.

=== OUTPUT FORMAT (STRICT JSON) ===
For Task 1:
{
  "task_type": "Task 1",
  "visual_type": "bar_chart",
  "topic": "Men and women in further education",
  "instruction": "The chart below shows... Summarise the information by selecting and reporting the main features, and make comparisons where relevant. Write at least 150 words.",
  "data": {
    "title": "Full-time and part-time students in UK further education (1970/71, 1980/81, 1990/91)",
    "x_axis": "Time period",
    "y_axis": "Number of students (thousands)",
    "series": [
      {"label": "Male full-time", "values": {"1970/71": 1500, "1980/81": 2100, "1990/91": 1800}},
      {"label": "Female full-time", "values": {"1970/71": 800, "1980/81": 1400, "1990/91": 1700}},
      {"label": "Male part-time", "values": {"1970/71": 2200, "1980/81": 2400, "1990/91": 2600}},
      {"label": "Female part-time", "values": {"1970/71": 700, "1980/81": 1200, "1990/91": 2200}}
    ],
    "unit": "thousands",
    "key_features": ["Female participation grew significantly", "Part-time study dominated", "Gender gap narrowed by 1990/91"]
  },
  "time_limit": "20 minutes",
  "word_limit": 150,
  "model_answer_guide": {
    "overview": "Overall, part-time study was more common, and female participation increased substantially across all modes.",
    "key_points": ["Identify the most significant trend", "Compare the highest and lowest values", "Note any crossover points or anomalies"],
    "language_focus": ["Comparative language", "Trend vocabulary", "Data-specific phrases"]
  }
}

For Task 2:
{
  "task_type": "Task 2",
  "essay_type": "opinion",
  "topic": "Wealth and childhood development",
  "instruction": "Write about the following topic: [Statement]. To what extent do you agree or disagree with this opinion? Give reasons for your answer and include any relevant examples from your own knowledge or experience. Write at least 250 words.",
  "statement": "Children who are brought up in families that do not have large amounts of money are better prepared to deal with the problems of adult life than children brought up by wealthy parents.",
  "time_limit": "40 minutes",
  "word_limit": 250,
  "model_answer_guide": {
    "suggested_structure": "Introduction (paraphrase + thesis) → Body 1 (agree point + evidence) → Body 2 (counter-argument + rebuttal) → Conclusion",
    "key_arguments": {
      "for": ["Resilience through adversity", "Self-reliance and resourcefulness", "Stronger work ethic"],
      "against": ["Access to better education", "Networking opportunities", "Financial security reduces stress"]
    },
    "language_focus": ["Hedging language", "Concession phrases", "Topic-specific vocabulary"]
  }
}`;

// ============================================================
// Topic pools for varied generation
// ============================================================
const TASK1_VISUAL_TYPES = [
  "bar_chart", "line_graph", "pie_chart", "table", "process_diagram", "map", "bar_line_combo",
];

const TASK1_TOPICS: Record<string, string[]> = {
  bar_chart: [
    "Employment rates by sector across three countries",
    "Student enrollment in different university departments over 20 years",
    "Household spending on various categories in four countries",
    "Internet usage by age group in developed vs developing nations",
    "Types of renewable energy produced in five countries",
  ],
  line_graph: [
    "Radio and television audiences throughout the day",
    "Global average temperatures from 1960 to 2020",
    "Sales of electric vs petrol cars from 2010 to 2023",
    "Proportion of urban population in different world regions over 50 years",
    "Annual rainfall in three cities over a 30-year period",
  ],
  pie_chart: [
    "Global water usage by sector",
    "Household energy consumption by type",
    "Sources of government revenue in a country",
    "Visitor nationalities at a tourist attraction",
    "Causes of deforestation worldwide",
  ],
  table: [
    "Hours of sunshine, rainfall, and temperature in five cities",
    "Crime statistics by type in four cities",
    "International student numbers by country and subject area",
    "Energy production data for selected countries",
    "Cost of living index across major global cities",
  ],
  process_diagram: [
    "The process by which bricks are manufactured",
    "How paper is recycled",
    "The water treatment process",
    "How glass is produced",
    "The life cycle of a salmon",
  ],
  map: [
    "Changes to a seaside town centre between 1950 and now",
    "Development of a university campus over 30 years",
    "Proposed changes to a park area",
    "Before and after redevelopment of an industrial area",
  ],
  bar_line_combo: [
    "Tourist arrivals and tourism revenue in a country",
    "CO2 emissions and GDP growth over 20 years",
    "Hospital admissions and healthcare spending",
  ],
};

const TASK2_TYPES = [
  "opinion",
  "discussion",
  "advantages_disadvantages",
  "problem_solution",
  "direct_question",
];

const TASK2_TOPICS: Record<string, string[]> = {
  opinion: [
    "Children from less wealthy families are better prepared for adult life",
    "Governments should prioritise economic growth over environmental protection",
    "Technology has made people less creative",
    "University education should be free for all students",
    "Older people should be required to retire at a fixed age",
    "It is better to live in a big city than in a small town",
  ],
  discussion: [
    "International tourism brings benefits but also has negative impacts on local communities",
    "Some people believe that zoos serve an important conservation purpose; others believe they are cruel",
    "Some argue that globalisation strengthens cultural identity; others believe it destroys it",
    "While some think social media connects people, others argue it increases loneliness",
  ],
  advantages_disadvantages: [
    "The rise of remote working has changed modern life significantly",
    "More countries are making it compulsory for children to study a foreign language at school",
    "Genetic engineering of food crops is becoming increasingly common",
    "Many cities are introducing congestion charges for driving in city centres",
  ],
  problem_solution: [
    "Traffic congestion in cities is a growing problem",
    "The gap between rich and poor is widening in many countries",
    "Many children are spending excessive amounts of time on digital devices",
    "Air pollution levels in major cities continue to rise",
  ],
  direct_question: [
    "Some people prefer to live alone. Why has this become more common? What are the advantages and disadvantages?",
    "Many museums and art galleries are struggling financially. Should governments fund them? Who else could provide financial support?",
    "People are generally living longer. What are the effects of an ageing population? How should governments respond?",
  ],
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return handleCorsPreflightRequest(req);
  }

  try {
    let requestBody;
    try {
      requestBody = await req.json();
    } catch {
      return validationError("Invalid JSON body", undefined, corsHeaders);
    }

    const validation = validateRequest(GenerateWritingSchema, requestBody);
    if (!validation.success) {
      return validationError(validation.error.message, validation.error.details, corsHeaders);
    }

    const { task_type, difficulty, visual_type: requestedVisual, essay_type: requestedEssayType } = validation.data;
    const ANTHROPIC_API_KEY = Deno.env.get("ANTHROPIC_API_KEY");

    if (!ANTHROPIC_API_KEY) {
      return aiServiceError("AI service not configured", undefined, corsHeaders);
    }

    // Pick visual type and topic
    const visualType = requestedVisual ?? TASK1_VISUAL_TYPES[Math.floor(Math.random() * TASK1_VISUAL_TYPES.length)];
    const essayType = requestedEssayType ?? TASK2_TYPES[Math.floor(Math.random() * TASK2_TYPES.length)];

    let topic: string;
    let userPrompt: string;

    if (task_type === "Task 1") {
      const topicPool = TASK1_TOPICS[visualType] ?? TASK1_TOPICS["bar_chart"];
      topic = topicPool[Math.floor(Math.random() * topicPool.length)];

      userPrompt = `Generate a complete IELTS Academic Writing Task 1 prompt.

VISUAL TYPE: ${visualType}
TOPIC: ${topic}
DIFFICULTY: ${difficulty}

REQUIREMENTS:
- Provide a realistic, internally consistent data set (specific numbers, percentages, or stages)
- Write the task instruction in official IELTS format
- Include key features a strong candidate should identify
- Difficulty "${difficulty}": ${difficulty === "easy" ? "clear trends, obvious comparisons, simple data" : difficulty === "medium" ? "mixed trends, some anomalies, moderate complexity" : "complex multi-variable data, subtle trends, requires careful analysis"}
- For process diagrams: provide 6-8 clearly labelled stages with passive voice descriptions

Return ONLY valid JSON matching the Task 1 schema. No markdown.`;
    } else {
      const topicPool = TASK2_TOPICS[essayType] ?? TASK2_TOPICS["opinion"];
      topic = topicPool[Math.floor(Math.random() * topicPool.length)];

      userPrompt = `Generate a complete IELTS Academic Writing Task 2 prompt.

ESSAY TYPE: ${essayType}
TOPIC: ${topic}
DIFFICULTY: ${difficulty}

REQUIREMENTS:
- Write the full task instruction in official IELTS format
- Include a clear, arguable statement or question
- Provide a model answer guide with suggested structure and key arguments
- Difficulty "${difficulty}": ${difficulty === "easy" ? "concrete, familiar topic with obvious arguments" : difficulty === "medium" ? "abstract topic requiring nuanced position" : "complex societal issue requiring sophisticated analysis, speculation, and hedging"}
- For 'direct_question' type: include 2-3 specific sub-questions within the prompt

Return ONLY valid JSON matching the Task 2 schema. No markdown.`;
    }

    console.log("Generating writing prompt:", { task_type, topic, difficulty });

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key": ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
        "content-type": "application/json",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-6",
        max_tokens: 4096,
        temperature: 0.75,
        messages: [
          { role: "user", content: `${WRITING_SYSTEM_PROMPT}\n\n${userPrompt}` },
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Claude API error:", response.status, errorText);
      if (response.status === 429) return rateLimitError(undefined, 60, corsHeaders);
      if (response.status === 401) return unauthorizedError("Invalid API key", corsHeaders);
      return aiServiceError("Failed to generate writing prompt", { status: response.status }, corsHeaders);
    }

    const data = await response.json();
    const aiText = data.content?.[0]?.text;

    let parsed;
    try {
      const jsonMatch = aiText.match(/\{[\s\S]*\}/);
      if (!jsonMatch) throw new Error("No JSON found");
      parsed = JSON.parse(jsonMatch[0]);
    } catch (e) {
      console.error("JSON parse error:", e);
      return aiServiceError("Failed to parse AI response. Please try again.", {
        error: String(e),
        preview: aiText?.substring(0, 200),
      }, corsHeaders);
    }

    if (!parsed.task_type || !parsed.instruction) {
      return aiServiceError("AI returned incomplete writing prompt data.", {
        hasTaskType: !!parsed.task_type,
        hasInstruction: !!parsed.instruction,
      }, corsHeaders);
    }

    parsed.generatedAt = new Date().toISOString();
    parsed.id = crypto.randomUUID();
    parsed.difficulty = difficulty;

    console.log("Successfully generated writing prompt:", {
      task_type: parsed.task_type,
      essay_type: parsed.essay_type ?? parsed.visual_type,
      topic: parsed.topic,
    });

    return successResponse(parsed, 200, corsHeaders);
  } catch (error: unknown) {
    console.error("generate-writing error:", error);
    return internalError(
      error instanceof Error ? error.message : "Unknown error",
      { error: String(error) },
      corsHeaders
    );
  }
});
