import type { RevisionNoteTopicId } from "@/content/revisionNotes";
import { TopicPartsOfSpeech, TopicPartsOfSpeechWorksheet1, TopicPartsOfSpeechWorksheet2 } from "./TopicPartsOfSpeech";
import { TopicApostrophes, TopicApostrophesWorksheet2 } from "./TopicApostrophes";
import { TopicVerbTenses, TopicVerbTensesWorksheet1, TopicVerbTensesWorksheet2 } from "./TopicVerbTenses";
import { TopicSubjectVerbAgreement, TopicSubjectVerbAgreementWorksheet1, TopicSubjectVerbAgreementWorksheet2 } from "./TopicSubjectVerbAgreement";
import { TopicPunctuation, TopicPunctuationWorksheet1, TopicPunctuationWorksheet2 } from "./TopicPunctuation";
import { TopicSentenceStructure, TopicSentenceStructureWorksheet1, TopicSentenceStructureWorksheet2 } from "./TopicSentenceStructure";
import { TopicRelativeClauses, TopicRelativeClausesWorksheet1, TopicRelativeClausesWorksheet2 } from "./TopicRelativeClauses";
import { TopicLinkingWordsCoherence, TopicLinkingWordsCoherenceWorksheet1, TopicLinkingWordsCoherenceWorksheet2 } from "./TopicLinkingWordsCoherence";
import { TopicCollocationsParaphrasing } from "./TopicCollocationsParaphrasing";
import { TopicModalVerbs } from "./TopicModalVerbs";
import { TopicArticles, TopicArticlesWorksheet1, TopicArticlesWorksheet2 } from "./TopicArticles";
import { TopicReportingVerbs, TopicReportingVerbsWorksheet2 } from "./TopicReportingVerbs";
import { TopicHedgingFormalStyle } from "./TopicHedgingFormalStyle";
import { TopicTextTypes } from "./TopicTextTypes";
import { TopicParagraphStructuring } from "./TopicParagraphStructuring";
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
  "paragraph-structuring": TopicParagraphStructuring,
  "linking-words-coherence": TopicLinkingWordsCoherence,
  "text-types": TopicTextTypes,
  "reporting-verbs": TopicReportingVerbs,
  "hedging-formal-style": TopicHedgingFormalStyle,
  "collocations-paraphrasing": TopicCollocationsParaphrasing,
  "vocabulary-passages": VocabularyPassageView,
};

export const WORKSHEET_COMPONENTS: Partial<Record<
  RevisionNoteTopicId,
  { "worksheet-1"?: () => JSX.Element; "worksheet-2"?: () => JSX.Element }
>> = {
  "parts-of-speech": {
    "worksheet-1": TopicPartsOfSpeechWorksheet1,
    "worksheet-2": TopicPartsOfSpeechWorksheet2,
  },
  "verb-tenses": {
    "worksheet-1": TopicVerbTensesWorksheet1,
    "worksheet-2": TopicVerbTensesWorksheet2,
  },
  "relative-clauses": {
    "worksheet-1": TopicRelativeClausesWorksheet1,
    "worksheet-2": TopicRelativeClausesWorksheet2,
  },
  "sentence-structure": {
    "worksheet-1": TopicSentenceStructureWorksheet1,
    "worksheet-2": TopicSentenceStructureWorksheet2,
  },
  articles: {
    "worksheet-1": TopicArticlesWorksheet1,
    "worksheet-2": TopicArticlesWorksheet2,
  },
  "subject-verb-agreement": {
    "worksheet-1": TopicSubjectVerbAgreementWorksheet1,
    "worksheet-2": TopicSubjectVerbAgreementWorksheet2,
  },
  apostrophes: {
    "worksheet-2": TopicApostrophesWorksheet2,
  },
  punctuation: {
    "worksheet-1": TopicPunctuationWorksheet1,
    "worksheet-2": TopicPunctuationWorksheet2,
  },
  "linking-words-coherence": {
    "worksheet-1": TopicLinkingWordsCoherenceWorksheet1,
    "worksheet-2": TopicLinkingWordsCoherenceWorksheet2,
  },
  "reporting-verbs": {
    "worksheet-2": TopicReportingVerbsWorksheet2,
  },
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
  TopicTextTypes,
  VocabularyPassageView,
};
