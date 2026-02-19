/**
 * Revision Notes: sidebar structure and topic ids for IELTS Writing & Grammar.
 * Used by RevisionNotesPage for navigation and "View all topics" list.
 */

export interface RevisionNoteSection {
  id: string;
  title: string;
  subItems: { id: string; label: string }[];
}

export const REVISION_NOTE_TOPICS: RevisionNoteSection[] = [
  {
    id: "parts-of-speech",
    title: "Parts of Speech",
    subItems: [
      { id: "subject", label: "Subject, Verb, Pronouns, Adjectives, Adverbs" },
      { id: "imperatives", label: "Imperatives" },
    ],
  },
  {
    id: "apostrophes",
    title: "Apostrophes",
    subItems: [
      { id: "types", label: "Types" },
      { id: "functions", label: "Functions" },
    ],
  },
  {
    id: "verb-tenses",
    title: "Verb Tenses",
    subItems: [
      { id: "past", label: "Past" },
      { id: "present", label: "Present" },
      { id: "future", label: "Future" },
    ],
  },
  {
    id: "subject-verb-agreement",
    title: "Subject–Verb Agreement",
    subItems: [
      { id: "sva-basics", label: "Singular/plural, special patterns" },
      { id: "conditionals", label: "Conditionals, word order" },
    ],
  },
  {
    id: "punctuation",
    title: "Punctuation",
    subItems: [
      { id: "commas", label: "Commas, colons, semicolons" },
      { id: "quotes-dashes", label: "Quotation marks, dashes" },
    ],
  },
  {
    id: "sentence-structure",
    title: "Sentence Structure",
    subItems: [
      { id: "active-passive", label: "Active and passive voice" },
      { id: "simple-compound-complex", label: "Simple, compound, complex" },
    ],
  },
  {
    id: "relative-clauses",
    title: "Relative Clauses",
    subItems: [
      { id: "defining", label: "Defining clauses" },
      { id: "non-defining", label: "Non-defining clauses" },
      { id: "pronouns-where-when", label: "Relative pronouns and where/when/why" },
    ],
  },
  {
    id: "linking-words-coherence",
    title: "Linking Words, Referencing & Coherence",
    subItems: [
      { id: "linkers", label: "Linking words" },
      { id: "referencing", label: "Referencing" },
      { id: "paragraph-flow", label: "Paragraph flow" },
    ],
  },
  {
    id: "collocations-paraphrasing",
    title: "Vocabulary: Collocations & Paraphrasing",
    subItems: [
      { id: "collocations", label: "Collocations" },
      { id: "paraphrasing", label: "Paraphrasing" },
      { id: "strategies-practice", label: "Strategies & practice" },
    ],
  },
  {
    id: "modal-verbs",
    title: "Modal Verbs",
    subItems: [
      { id: "ability-possibility", label: "Ability and possibility" },
      { id: "obligation-necessity", label: "Obligation and necessity" },
      { id: "advice-hedging", label: "Advice and academic hedging" },
    ],
  },
  {
    id: "articles",
    title: "Articles (a, an, the, Ø)",
    subItems: [
      { id: "indefinite", label: "A / An" },
      { id: "definite", label: "The" },
      { id: "no-article", label: "No article" },
    ],
  },
  {
    id: "reporting-verbs",
    title: "Reporting Verbs & Passive Reporting",
    subItems: [
      { id: "simple-reporting", label: "Simple reporting structures" },
      { id: "passive-reporting", label: "Passive reporting (It is said that…)" },
    ],
  },
  {
    id: "hedging-formal-style",
    title: "Hedging & Formal Academic Style",
    subItems: [
      { id: "hedging-basics", label: "What is hedging?" },
      { id: "modals-adverbs", label: "Modals, adverbs, adjectives" },
      { id: "academic-style", label: "Other academic style features" },
    ],
  },
];

export const REVISION_NOTE_IDS = REVISION_NOTE_TOPICS.map((t) => t.id) as [
  "parts-of-speech",
  "apostrophes",
  "verb-tenses",
  "subject-verb-agreement",
  "punctuation",
  "sentence-structure",
  "relative-clauses",
  "linking-words-coherence",
  "collocations-paraphrasing",
  "modal-verbs",
  "articles",
  "reporting-verbs",
  "hedging-formal-style",
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
