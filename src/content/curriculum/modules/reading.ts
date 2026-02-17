/**
 * Human+AI Curriculum – Reading Module
 * Aligned with IELTS Academic Reading (three passages, 40 questions).
 */

import type { CurriculumModule } from "../types";

export const readingModule: CurriculumModule = {
  id: "reading",
  title: "Reading",
  description:
    "Skills and question types for IELTS Academic Reading: skimming, scanning, and understanding long texts.",
  topics: [
    {
      id: "reading-overview",
      order: 1,
      title: "Test format and strategies",
      items: [
        {
          id: "ro-format",
          title: "Format",
          items: [
            "Three passages; 40 questions; 60 minutes",
            "Texts from books, journals, magazines, newspapers (academic style)",
            "Increasing difficulty; topics: general interest, academic",
          ],
        },
        {
          id: "ro-strategies",
          title: "Strategies",
          items: [
            "Skimming for main idea and structure",
            "Scanning for specific information and key words",
            "Managing time (e.g. ~20 minutes per passage)",
          ],
        },
      ],
    },
    {
      id: "reading-question-types",
      order: 2,
      title: "Question types",
      items: [
        {
          id: "rq-tfng",
          title: "True / False / Not Given (or Yes / No / Not Given)",
          level: "basic",
          items: [
            "Statement agrees with text (T/Y), contradicts (F/N), or not mentioned (NG)",
            "Focus on meaning, not word matching",
          ],
        },
        {
          id: "rq-matching",
          title: "Matching",
          level: "intermediate",
          items: [
            "Headings to paragraphs; information to paragraphs; sentence endings; features to names",
          ],
        },
        {
          id: "rq-multiple-choice",
          title: "Multiple choice",
          level: "intermediate",
          items: ["Single or multiple answers; main idea, detail, inference"],
        },
        {
          id: "rq-completion",
          title: "Sentence / summary / table / flow-chart / diagram completion",
          level: "intermediate",
          items: ["Words from the passage; respect word limit (e.g. NO MORE THAN TWO WORDS)"],
        },
        {
          id: "rq-short-answer",
          title: "Short-answer questions",
          level: "intermediate",
          items: ["Answer in words from the passage; word limit applies"],
        },
      ],
    },
    {
      id: "reading-skills",
      order: 3,
      title: "Reading skills",
      items: [
        {
          id: "rs-skimming-scanning",
          title: "Skimming and scanning",
          level: "basic",
          items: ["Main idea, paragraph purpose, locating specific information"],
        },
        {
          id: "rs-paraphrase-synonym",
          title: "Paraphrase and synonym",
          level: "intermediate",
          items: ["Recognizing rephrased ideas and synonyms in questions and text"],
        },
        {
          id: "rs-inference-view",
          title: "Inference and writer’s view",
          level: "advance",
          items: ["Implied meaning; writer’s purpose, opinion, or attitude"],
        },
      ],
    },
    {
      id: "reading-text-types",
      order: 4,
      title: "Text types and vocabulary",
      items: [
        {
          id: "rt-sources",
          title: "Sources",
          items: ["Books, journals, articles, newspapers (as in curriculum PDF)"],
        },
        {
          id: "rt-vocabulary",
          title: "Vocabulary",
          items: [
            "Topic vocabulary (e.g. technology, environment, health, society)",
            "Academic and linking words; collocations",
          ],
        },
      ],
      notes: "Find practice questions for each part of the syllabus.",
    },
  ],
};
