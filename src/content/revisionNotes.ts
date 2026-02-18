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
];

export const REVISION_NOTE_IDS = REVISION_NOTE_TOPICS.map((t) => t.id) as [
  "parts-of-speech",
  "apostrophes",
  "verb-tenses",
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
