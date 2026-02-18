import type { RevisionNoteTopicId } from "@/content/revisionNotes";
import { TopicPartsOfSpeech } from "./TopicPartsOfSpeech";
import { TopicApostrophes } from "./TopicApostrophes";
import { TopicVerbTenses } from "./TopicVerbTenses";

export const REVISION_TOPIC_COMPONENTS: Record<
  RevisionNoteTopicId,
  () => JSX.Element
> = {
  "parts-of-speech": TopicPartsOfSpeech,
  apostrophes: TopicApostrophes,
  "verb-tenses": TopicVerbTenses,
};

export { TopicPartsOfSpeech, TopicApostrophes, TopicVerbTenses };
