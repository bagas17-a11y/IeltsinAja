import type { RevisionNoteTopicId } from "@/content/revisionNotes";
import { TopicPartsOfSpeech } from "./TopicPartsOfSpeech";
import { TopicApostrophes } from "./TopicApostrophes";
import { TopicVerbTenses } from "./TopicVerbTenses";
import { TopicSubjectVerbAgreement } from "./TopicSubjectVerbAgreement";
import { TopicPunctuation } from "./TopicPunctuation";
import { TopicSentenceStructure } from "./TopicSentenceStructure";
import { TopicRelativeClauses } from "./TopicRelativeClauses";
import { TopicLinkingWordsCoherence } from "./TopicLinkingWordsCoherence";
import { TopicCollocationsParaphrasing } from "./TopicCollocationsParaphrasing";
import { TopicModalVerbs } from "./TopicModalVerbs";
import { TopicArticles } from "./TopicArticles";
import { TopicReportingVerbs } from "./TopicReportingVerbs";
import { TopicHedgingFormalStyle } from "./TopicHedgingFormalStyle";

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
  "relative-clauses": TopicRelativeClauses,
  "linking-words-coherence": TopicLinkingWordsCoherence,
  "collocations-paraphrasing": TopicCollocationsParaphrasing,
  "modal-verbs": TopicModalVerbs,
  articles: TopicArticles,
  "reporting-verbs": TopicReportingVerbs,
  "hedging-formal-style": TopicHedgingFormalStyle,
};

export {
  TopicPartsOfSpeech,
  TopicApostrophes,
  TopicVerbTenses,
  TopicSubjectVerbAgreement,
  TopicPunctuation,
  TopicSentenceStructure,
  TopicRelativeClauses,
  TopicLinkingWordsCoherence,
  TopicCollocationsParaphrasing,
  TopicModalVerbs,
  TopicArticles,
  TopicReportingVerbs,
  TopicHedgingFormalStyle,
};
