/**
 * Revision Notes: sidebar structure and topic ids for IELTS Writing & Grammar.
 * Used by RevisionNotesPage for navigation and "View all topics" list.
 * Topics are grouped by category for clearer structure.
 */

export type RevisionNoteCategory =
  | "grammar-fundamentals"
  | "verb-system"
  | "mechanics"
  | "writing-skills"
  | "vocabulary";

export interface RevisionNoteSection {
  id: string;
  title: string;
  category: RevisionNoteCategory;
  subItems: { id: string; label: string }[];
}

export const REVISION_NOTE_CATEGORIES: { id: RevisionNoteCategory; label: string }[] = [
  { id: "grammar-fundamentals", label: "Grammar and fundamentals" },
  { id: "verb-system", label: "Verb system" },
  { id: "mechanics", label: "Mechanics and accuracy" },
  { id: "writing-skills", label: "Writing skills" },
  { id: "vocabulary", label: "Vocabulary expansion" },
];

export const REVISION_NOTE_TOPICS: RevisionNoteSection[] = [
  {
    id: "parts-of-speech",
    category: "grammar-fundamentals",
    title: "Parts of Speech",
    subItems: [
      { id: "subject", label: "Subject, Verb, Pronouns, Adjectives, Adverbs" },
      { id: "imperatives", label: "Imperatives" },
    ],
  },
  {
    id: "verb-tenses",
    category: "grammar-fundamentals",
    title: "Verb Tenses",
    subItems: [
      { id: "past", label: "Past" },
      { id: "present", label: "Present" },
      { id: "future", label: "Future" },
    ],
  },
  {
    id: "relative-clauses",
    category: "grammar-fundamentals",
    title: "Relative Clauses",
    subItems: [
      { id: "defining", label: "Defining clauses" },
      { id: "non-defining", label: "Non-defining clauses" },
      { id: "pronouns-where-when", label: "Relative pronouns and where/when/why" },
    ],
  },
  {
    id: "sentence-structure",
    category: "grammar-fundamentals",
    title: "Sentence Structure",
    subItems: [
      { id: "active-passive", label: "Active and passive voice" },
      { id: "simple-compound-complex", label: "Simple, compound, complex" },
    ],
  },
  {
    id: "articles",
    category: "grammar-fundamentals",
    title: "Articles (a, an, the, Ø)",
    subItems: [
      { id: "indefinite", label: "A / An" },
      { id: "definite", label: "The" },
      { id: "no-article", label: "No article" },
    ],
  },
  {
    id: "subject-verb-agreement",
    category: "verb-system",
    title: "Subject–Verb Agreement",
    subItems: [
      { id: "sva-basics", label: "Singular/plural, special patterns" },
      { id: "conditionals", label: "Conditionals, word order" },
    ],
  },
  {
    id: "modal-verbs",
    category: "verb-system",
    title: "Modal Verbs",
    subItems: [
      { id: "ability-possibility", label: "Ability and possibility" },
      { id: "obligation-necessity", label: "Obligation and necessity" },
      { id: "advice-hedging", label: "Advice and academic hedging" },
    ],
  },
  {
    id: "apostrophes",
    category: "mechanics",
    title: "Apostrophes",
    subItems: [
      { id: "types", label: "Types" },
      { id: "functions", label: "Functions" },
    ],
  },
  {
    id: "punctuation",
    category: "mechanics",
    title: "Punctuation",
    subItems: [
      { id: "commas", label: "Commas, colons, semicolons" },
      { id: "quotes-dashes", label: "Quotation marks, dashes" },
    ],
  },
  {
    id: "linking-words-coherence",
    category: "writing-skills",
    title: "Linking Words, Referencing & Coherence",
    subItems: [
      { id: "linkers", label: "Linking words" },
      { id: "referencing", label: "Referencing" },
      { id: "paragraph-flow", label: "Paragraph flow" },
    ],
  },
  {
    id: "writing-formats",
    category: "writing-skills",
    title: "Writing Formats",
    subItems: [
      { id: "task1-format", label: "Task 1 – Academic report" },
      { id: "task2-format", label: "Task 2 – Academic essay" },
    ],
  },
  {
    id: "text-types",
    category: "writing-skills",
    title: "Text Types",
    subItems: [
      { id: "academic-formal", label: "Academic and formal writing" },
    ],
  },
  {
    id: "reporting-verbs",
    category: "writing-skills",
    title: "Reporting Verbs & Passive Reporting",
    subItems: [
      { id: "simple-reporting", label: "Simple reporting structures" },
      { id: "passive-reporting", label: "Passive reporting (It is said that…)" },
    ],
  },
  {
    id: "hedging-formal-style",
    category: "writing-skills",
    title: "Hedging & Formal Academic Style",
    subItems: [
      { id: "hedging-basics", label: "What is hedging?" },
      { id: "modals-adverbs", label: "Modals, adverbs, adjectives" },
      { id: "academic-style", label: "Other academic style features" },
    ],
  },
  {
    id: "collocations-paraphrasing",
    category: "vocabulary",
    title: "Vocabulary: Collocations & Paraphrasing",
    subItems: [
      { id: "collocations", label: "Collocations" },
      { id: "paraphrasing", label: "Paraphrasing" },
      { id: "strategies-practice", label: "Strategies & practice" },
    ],
  },
  {
    id: "vocabulary-passages",
    category: "vocabulary",
    title: "Vocabulary Passages",
    subItems: [
      { id: "passages-read", label: "Read with pop-up definitions" },
      { id: "passages-practise", label: "Practise in sentences" },
    ],
  },
];

/** Test Format explanations – separate tab, not a revision topic */
export const REVISION_NOTE_FORMAT_IDS = ["writing", "listening", "reading", "speaking"] as const;
export type RevisionNoteFormatId = (typeof REVISION_NOTE_FORMAT_IDS)[number];

export const REVISION_NOTE_IDS = REVISION_NOTE_TOPICS.map((t) => t.id) as [
  "parts-of-speech",
  "verb-tenses",
  "relative-clauses",
  "sentence-structure",
  "articles",
  "subject-verb-agreement",
  "modal-verbs",
  "apostrophes",
  "punctuation",
  "linking-words-coherence",
  "writing-formats",
  "text-types",
  "reporting-verbs",
  "hedging-formal-style",
  "collocations-paraphrasing",
  "vocabulary-passages",
];

export type RevisionNoteTopicId = (typeof REVISION_NOTE_IDS)[number];

export function getNextTopicId(current: RevisionNoteTopicId): RevisionNoteTopicId | null {
  const i = REVISION_NOTE_IDS.indexOf(current);
  if (i < 0 || i >= REVISION_NOTE_IDS.length - 1) return null;
  return REVISION_NOTE_IDS[i + 1];
}

export function getPrevTopicId(current: RevisionNoteTopicId): RevisionNoteTopicId | null {
  const i = REVISION_NOTE_IDS.indexOf(current);
  if (i <= 0) return null;
  return REVISION_NOTE_IDS[i - 1];
}
