/**
 * Human+AI Curriculum – Speaking Module
 * Aligned with IELTS Speaking test (Parts 1–3).
 */

import type { CurriculumModule } from "../types";

export const speakingModule: CurriculumModule = {
  id: "speaking",
  title: "Speaking",
  description:
    "Skills and topics for IELTS Speaking: Part 1 (intro), Part 2 (long turn), Part 3 (discussion).",
  topics: [
    {
      id: "speaking-overview",
      order: 1,
      title: "Test format and strategies",
      items: [
        {
          id: "so-format",
          title: "Format",
          items: [
            "Part 1: Introduction and familiar topics (4–5 minutes)",
            "Part 2: Long turn – 1–2 minutes on a cue card (1 min preparation)",
            "Part 3: Two-way discussion on broader themes (4–5 minutes)",
          ],
        },
        {
          id: "so-strategies",
          title: "Strategies",
          items: [
            "Answer directly, then extend with reason or example",
            "Using preparation time in Part 2 (notes, structure)",
            "Linking ideas and managing hesitation naturally",
          ],
        },
      ],
    },
    {
      id: "speaking-part1",
      order: 2,
      title: "Part 1 – Familiar topics",
      items: [
        {
          id: "sp1-topics",
          title: "Topic areas (basic)",
          level: "basic",
          items: [
            "Personal info, work, home, family, education, health, likes/dislikes",
            "Hobbies, daily routine, hometown, studies, travel",
          ],
        },
        {
          id: "sp1-grammar",
          title: "Grammar and fluency",
          items: [
            "Present and past tenses; simple extensions",
            "Avoiding one-word answers; natural pace",
          ],
        },
      ],
    },
    {
      id: "speaking-part2",
      order: 3,
      title: "Part 2 – Long turn (cue card)",
      items: [
        {
          id: "sp2-structure",
          title: "Structure",
          level: "intermediate",
          items: [
            "Introduction (what the topic is); main points (2–3); brief conclusion or opinion",
            "Using the bullet points on the card to organize",
          ],
        },
        {
          id: "sp2-topics",
          title: "Topic types",
          items: [
            "Person, place, object, event, experience, habit, plan",
            "Describe, explain, compare, say why",
          ],
        },
      ],
    },
    {
      id: "speaking-part3",
      order: 4,
      title: "Part 3 – Discussion",
      items: [
        {
          id: "sp3-abstract",
          title: "Abstract and general ideas",
          level: "advance",
          items: [
            "Opinions, reasons, examples; compare past and present; speculate about future",
            "Technology, environment, society, education, culture, global issues",
          ],
        },
        {
          id: "sp3-vocabulary",
          title: "Vocabulary and coherence",
          items: [
            "Linking words (addition, contrast, cause/effect, examples)",
            "Idioms and phrasal verbs where natural; paraphrasing",
          ],
        },
      ],
    },
    {
      id: "speaking-criteria",
      order: 5,
      title: "Assessment criteria (overview)",
      items: [
        {
          id: "sc-fluency-coherence",
          title: "Fluency and coherence",
          items: ["Speaking at length; linking ideas; relevance"],
        },
        {
          id: "sc-lexical",
          title: "Lexical resource",
          items: ["Range and appropriateness of vocabulary; paraphrasing"],
        },
        {
          id: "sc-grammar",
          title: "Grammatical range and accuracy",
          items: ["Variety of structures; accuracy"],
        },
        {
          id: "sc-pronunciation",
          title: "Pronunciation",
          items: ["Clarity; stress and intonation; ease of understanding"],
        },
      ],
      notes: "Find practice questions for each part of the syllabus.",
    },
  ],
};
