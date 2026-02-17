import type { LessonMaterial } from "../types";

export const writingFormatsMaterial: LessonMaterial = {
  topicId: "writing-formats",
  moduleId: "writing",
  title: "Writing Formats",
  summary:
    "Master Task 1 (academic report: describe, explain, analyze) and Task 2 (academic essay) so your structure and style match what IELTS expects.",
  body: `**Task 1 – Academic report**  
You describe visual information (graph, chart, table, map, diagram). **Basic**: describe what you see—main features, key figures, obvious trends (e.g. 'The line graph shows that sales rose from 2018 to 2022'). **Intermediate**: explain how and why—compare categories, highlight contrasts, use accurate data (e.g. 'While X increased by 10%, Y fell by 5%; this may reflect...'). **Advance**: analyze—prioritise information, summarise the main message, perhaps suggest implications or patterns (e.g. 'Overall, the data suggest that... The most striking feature is...').  
Structure: short intro (paraphrase task + overview); 1–2 body paragraphs (logical grouping); no conclusion required but a one-line overview is essential. Aim 150+ words; spend about 20 minutes.

**Task 2 – Academic essay**  
You respond to a point of view, argument, or problem. Structure: intro (background + thesis/position); 2–3 body paragraphs (topic sentence + support + example); conclusion (restate position + summary). Use formal tone; support ideas with reasons and examples; address all parts of the question. Aim 250+ words; spend about 40 minutes. Cohesion (linking words, referencing) and clear paragraphing are essential.`,
  keyPoints: [
    "Task 1: intro (paraphrase + overview) + body (grouped details) + optional one-line summary; 150+ words.",
    "Task 2: intro (thesis) + 2–3 body paragraphs (topic sentence + support) + conclusion; 250+ words.",
    "Task 1: describe → explain → analyze as you move from basic to advance.",
    "Both: formal tone, complete sentences, no bullet points or notes.",
  ],
  examples: [
    { label: "Task 1 overview", content: "Overall, the figure for X rose steadily over the period, while Y remained relatively stable." },
    { label: "Task 2 thesis", content: "Although technology has drawbacks, I believe the benefits for education and communication outweigh them." },
    { label: "Task 2 topic sentence", content: "First, technology has improved access to education. For example, online courses allow people in remote areas to study." },
  ],
  commonMistakes: [
    "Task 1: Giving no overview; the overview is required and should state the main trend or comparison.",
    "Task 2: Writing a narrative or story instead of an argument with clear position and supporting points.",
    "Including your own opinion in Task 1 (e.g. 'I think the graph is interesting')—Task 1 is factual description/analysis only.",
  ],
  practiceTips: [
    "Task 1: Always write the overview (1–2 sentences) after the intro; practise identifying 'main trend' and 'main comparison'.",
    "Task 2: Plan thesis + 2–3 main ideas before writing; each body paragraph = one main idea + support + example.",
  ],
  ieltsTip: "Task 1 is marked on Task Achievement (including overview), Coherence, Lexical Resource, and Grammar. Task 2 is weighted more; both need clear structure and full development of ideas.",
};
