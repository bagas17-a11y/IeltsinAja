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
import { TopicWritingFormats } from "./TopicWritingFormats";
import { TopicTextTypes } from "./TopicTextTypes";
import { VocabularyPassageView } from "./VocabularyPassageView";
import { TestFormatsView } from "./TestFormatsView";

export const REVISION_TOPIC_COMPONENTS: Record<
  RevisionNoteTopicId,
  () => JSX.Element
> = {
  "parts-of-speech": TopicPartsOfSpeech,
  "verb-tenses": TopicVerbTenses,
  "relative-clauses": TopicRelativeClauses,
  "sentence-structure": TopicSentenceStructure,
  articles: TopicArticles,
  "subject-verb-agreement": TopicSubjectVerbAgreement,
  "modal-verbs": TopicModalVerbs,
  apostrophes: TopicApostrophes,
  punctuation: TopicPunctuation,
  "linking-words-coherence": TopicLinkingWordsCoherence,
  "writing-formats": TopicWritingFormats,
  "text-types": TopicTextTypes,
  "reporting-verbs": TopicReportingVerbs,
  "hedging-formal-style": TopicHedgingFormalStyle,
  "collocations-paraphrasing": TopicCollocationsParaphrasing,
  "vocabulary-passages": VocabularyPassageView,
};

export { TestFormatsView };

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
  TopicWritingFormats,
  TopicTextTypes,
  VocabularyPassageView,
};
