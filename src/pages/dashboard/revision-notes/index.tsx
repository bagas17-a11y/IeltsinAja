import type { RevisionNoteTopicId } from "@/content/revisionNotes";
import { TopicPartsOfSpeech } from "./TopicPartsOfSpeech";
import { TopicApostrophes } from "./TopicApostrophes";
import { TopicVerbTenses } from "./TopicVerbTenses";
import { TopicSubjectVerbAgreement } from "./TopicSubjectVerbAgreement";
import { TopicPunctuation } from "./TopicPunctuation";
import { TopicSentenceStructure } from "./TopicSentenceStructure";

export const REVISION_TOPIC_COMPONENTS: Record<
  RevisionNoteTopicId,
  () => JSX.Element
> = {
  "parts-of-speech": TopicPartsOfSpeech,
  apostrophes: TopicApostrophes,
  "verb-tenses": TopicVerbTenses,
  "subject-verb-agreement": TopicSubjectVerbAgreement,
  punctuation: TopicPunctuation,
  "sentence-structure": TopicSentenceStructure,
};

export {
  TopicPartsOfSpeech,
  TopicApostrophes,
  TopicVerbTenses,
  TopicSubjectVerbAgreement,
  TopicPunctuation,
  TopicSentenceStructure,
};
