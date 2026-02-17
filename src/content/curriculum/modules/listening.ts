/**
 * Human+AI Curriculum – Listening Module
 * Aligned with IELTS Listening test format and skills.
 */

import type { CurriculumModule } from "../types";

export const listeningModule: CurriculumModule = {
  id: "listening",
  title: "Listening",
  description:
    "Skills and question types for IELTS Listening: Sections 1–4, from everyday conversation to academic monologue.",
  topics: [
    {
      id: "listening-overview",
      order: 1,
      title: "Test format and strategies",
      items: [
        {
          id: "lo-format",
          title: "Format",
          items: [
            "Four sections; 40 questions; ~30 minutes + 10 minutes transfer",
            "Section 1: Everyday conversation (e.g. accommodation, booking)",
            "Section 2: Monologue in everyday context (e.g. tour, talk)",
            "Section 3: Conversation in educational context (e.g. project, assignment)",
            "Section 4: Academic monologue (lecture or talk)",
          ],
        },
        {
          id: "lo-strategies",
          title: "Strategies",
          items: [
            "Using the example and reading questions before listening",
            "Predicting answers and key words",
            "Following instructions (word limit, e.g. NO MORE THAN TWO WORDS)",
          ],
        },
      ],
    },
    {
      id: "listening-question-types",
      order: 2,
      title: "Question types",
      items: [
        {
          id: "lq-form-completion",
          title: "Form / note / table / flow-chart / summary completion",
          level: "basic",
          items: ["Fill gaps with words from the recording; respect word limit"],
        },
        {
          id: "lq-matching",
          title: "Matching",
          level: "intermediate",
          items: ["Match items (e.g. speakers to opinions, headings to sections)"],
        },
        {
          id: "lq-multiple-choice",
          title: "Multiple choice",
          level: "intermediate",
          items: ["Single or multiple answers; focus on paraphrasing"],
        },
        {
          id: "lq-sentence-completion",
          title: "Sentence completion",
          level: "intermediate",
          items: ["Complete sentences with words from the recording"],
        },
        {
          id: "lq-labelling",
          title: "Labelling (e.g. map, diagram)",
          level: "intermediate",
          items: ["Choose from a list or write words from the recording"],
        },
      ],
    },
    {
      id: "listening-skills",
      order: 3,
      title: "Listening skills",
      items: [
        {
          id: "ls-prediction",
          title: "Prediction and key words",
          level: "basic",
          items: ["Identifying what to listen for; synonyms and paraphrases"],
        },
        {
          id: "ls-signposting",
          title: "Signposting and structure",
          level: "intermediate",
          items: ["Following how the speaker organizes ideas and changes topic"],
        },
        {
          id: "ls-detail-inference",
          title: "Detail and inference",
          level: "advance",
          items: ["Catching specific facts and implied meaning; avoiding distractors"],
        },
      ],
    },
    {
      id: "listening-vocabulary-grammar",
      order: 4,
      title: "Vocabulary and grammar for listening",
      items: [
        {
          id: "lvg-spelling",
          title: "Spelling and form",
          items: ["Correct spelling counts; numbers, dates, plurals, word class"],
        },
        {
          id: "lvg-accent-variety",
          title: "Accents and variety",
          items: ["British, American, Australian and other accents in context"],
        },
      ],
      notes: "Find practice questions for each part of the syllabus.",
    },
  ],
};
