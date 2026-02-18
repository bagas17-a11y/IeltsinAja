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
];

export const REVISION_NOTE_IDS = REVISION_NOTE_TOPICS.map((t) => t.id) as [
  "parts-of-speech",
  "apostrophes",
  "verb-tenses",
  "subject-verb-agreement",
  "punctuation",
  "sentence-structure",
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
