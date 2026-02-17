import type { LessonMaterial } from "../types";
import { partsOfSpeechMaterial } from "./parts-of-speech";
import { apostrophesMaterial } from "./apostrophes";
import { verbTensesMaterial } from "./verb-tenses";
import { subjectVerbAgreementMaterial } from "./subject-verb-agreement";
import { punctuationMaterial } from "./punctuation";
import { sentenceStructureMaterial } from "./sentence-structure";
import { vocabularyIeltsWordlistMaterial } from "./vocabulary-ielts-wordlist";
import { transitionWordsMaterial } from "./transition-words";
import { countableUncountableMaterial } from "./countable-uncountable";
import { clausesMaterial } from "./clauses";
import { synonymsParaphrasingMaterial } from "./synonyms-paraphrasing";
import { writingFormatsMaterial } from "./writing-formats";
import { textTypesMaterial } from "./text-types";

const writingMaterials: LessonMaterial[] = [
  partsOfSpeechMaterial,
  apostrophesMaterial,
  verbTensesMaterial,
  subjectVerbAgreementMaterial,
  punctuationMaterial,
  sentenceStructureMaterial,
  vocabularyIeltsWordlistMaterial,
  transitionWordsMaterial,
  countableUncountableMaterial,
  clausesMaterial,
  synonymsParaphrasingMaterial,
  writingFormatsMaterial,
  textTypesMaterial,
];

export default writingMaterials;
export { writingMaterials };
