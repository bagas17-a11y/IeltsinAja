/**
 * Human+AI Curriculum – Writing Module
 * Sourced from IELTS Curriculum PDF (Grammar, Vocabulary, Writing formats, Text types).
 */

import type { CurriculumModule } from "../types";

export const writingModule: CurriculumModule = {
  id: "writing",
  title: "Writing",
  description:
    "Grammar, vocabulary, writing formats, and text types for IELTS Academic Writing Task 1 and Task 2.",
  topics: [
    {
      id: "parts-of-speech",
      order: 1,
      title: "Parts of speech",
      items: [
        {
          id: "pos-core",
          title: "Core elements",
          items: [
            "Subject, verb, pronouns, adjectives, adverbs",
          ],
        },
        {
          id: "pos-imperatives",
          title: "Imperatives",
          items: ["Form and use in instructions and advice"],
        },
      ],
    },
    {
      id: "apostrophes",
      order: 2,
      title: "Apostrophes",
      items: [
        { id: "apost-types", title: "Types", items: ["Possessive; contraction"] },
        { id: "apost-functions", title: "Functions", items: ["When and how to use each type"] },
      ],
    },
    {
      id: "verb-tenses",
      order: 3,
      title: "Verb tenses",
      notes: "For each tense, include the aspects: simple, continuous, perfect, perfect continuous.",
      items: [
        { id: "tense-past", title: "Past", items: ["Simple, continuous, perfect, perfect continuous"] },
        { id: "tense-present", title: "Present", items: ["Simple, continuous, perfect, perfect continuous"] },
        { id: "tense-future", title: "Future", items: ["Simple, continuous, perfect, perfect continuous"] },
      ],
    },
    {
      id: "subject-verb-agreement",
      order: 4,
      title: "Subject-verb agreement",
      items: [
        { id: "sva-singular", title: "Singular", items: ["Agreement with singular subjects"] },
        { id: "sva-plural", title: "Plural", items: ["Agreement with plural subjects"] },
        {
          id: "sva-conditionals",
          title: "Conditionals",
          subItems: [
            {
              title: "Types",
              items: ["Zero, first, second, third, mixed"],
            },
          ],
        },
        {
          id: "sva-word-order",
          title: "Word order",
          subItems: [
            { title: "Structures", items: ["Sentence and questions"] },
          ],
        },
      ],
    },
    {
      id: "punctuation",
      order: 5,
      title: "Punctuation",
      items: [
        { id: "punc-commas", title: "Commas", items: ["Lists, clauses, after introductory phrases"] },
        { id: "punc-colons-semicolons", title: "Colons and semicolons", items: ["When to use each"] },
        { id: "punc-quotation", title: "Quotation marks", items: ["Direct speech and quoted text"] },
        { id: "punc-dashes", title: "Dashes", items: ["Em dashes and hyphens in academic writing"] },
      ],
    },
    {
      id: "sentence-structure",
      order: 6,
      title: "Sentence structure",
      items: [
        { id: "sent-active-passive", title: "Active or passive", items: ["Choosing and forming both voices"] },
        {
          id: "sent-types",
          title: "Simple, compound, basic complex",
          items: ["Building variety and clarity"],
        },
      ],
    },
    {
      id: "vocabulary-ielts-wordlist",
      order: 7,
      title: "Vocabulary (IELTS Wordlist)",
      items: [
        {
          id: "voc-topic-basic",
          title: "Topic (basic)",
          items: [
            "Personal info, work, home, family, education, health, likes/dislikes",
            "Technology, environment, travel, culture, global issues, crime, punishment",
          ],
        },
        {
          id: "voc-idioms-phrasal",
          title: "Idioms and phrasal verbs",
          level: "intermediate",
          items: ["Common idioms and phrasal verbs for formal and semi-formal writing"],
        },
        {
          id: "voc-collocations",
          title: "Collocations",
          level: "advance",
          items: ["Verb–noun and adjective–noun collocations for academic writing"],
        },
      ],
    },
    {
      id: "transition-words",
      order: 8,
      title: "Transition words",
      items: [
        {
          id: "trans-logical",
          title: "Logical links",
          items: [
            "Addition, contrast, cause/effect, examples, sequence",
          ],
        },
        {
          id: "trans-emphasis-summary",
          title: "Emphasis and conclusion",
          items: ["Emphasis, summary/conclusion"],
        },
      ],
    },
    {
      id: "countable-uncountable",
      order: 9,
      title: "Countable and uncountable nouns",
      items: [
        { id: "cu-tenses", title: "Tenses", items: ["Effect on verb agreement and articles"] },
        { id: "cu-container", title: "Container words", items: ["Piece of, bit of, etc."] },
        { id: "cu-quantifiers", title: "Quantifiers", items: ["Many, much, some, any, a lot of, etc."] },
      ],
    },
    {
      id: "clauses",
      order: 10,
      title: "Clauses",
      items: [
        {
          id: "clauses-dependent-independent",
          title: "Dependent and independent",
          items: ["Identifying and combining clauses correctly"],
        },
      ],
    },
    {
      id: "synonyms-paraphrasing",
      order: 11,
      title: "Synonyms and paraphrasing",
      items: [
        {
          id: "syn-paraphrase",
          title: "Techniques",
          items: [
            "Avoiding repetition in Task 1 and Task 2",
            "Paraphrasing the question and key ideas",
          ],
        },
      ],
    },
    {
      id: "writing-formats",
      order: 12,
      title: "Writing formats",
      items: [
        {
          id: "wf-task1",
          title: "Academic report (Task 1)",
          items: [
            "Describing a given graph/diagram (basic)",
            "Explaining trends and comparisons (intermediate)",
            "Analyzing data and drawing conclusions (advance)",
          ],
        },
        {
          id: "wf-task2",
          title: "Academic essay (Task 2)",
          items: ["Essay about a given topic: structure, argumentation, and cohesion"],
        },
      ],
    },
    {
      id: "text-types",
      order: 13,
      title: "Text types",
      items: [
        {
          id: "text-sources",
          title: "Sources",
          items: ["Books, journals, articles, newspapers"],
        },
      ],
      notes: "Find practice questions for each part of the syllabus.",
    },
  ],
};
