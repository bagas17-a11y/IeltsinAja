import type { LessonMaterial } from "../types";

export const partsOfSpeechMaterial: LessonMaterial = {
  topicId: "parts-of-speech",
  moduleId: "writing",
  title: "Parts of Speech",
  summary:
    "Master the building blocks of English: subjects, verbs, pronouns, adjectives, adverbs, and imperatives so your IELTS sentences are clear and grammatically correct.",
  body: `Every sentence in academic writing needs a **subject** (who or what) and a **verb** (action or state). **Pronouns** (I, you, he, she, it, we, they) replace nouns to avoid repetition. **Adjectives** describe nouns (e.g. *significant* increase, *global* issue); **adverbs** describe verbs, adjectives, or other adverbs (e.g. *significantly* increased, *extremely* important).

**Imperatives** are verb forms used for instructions or advice (e.g. *Consider the following; Note that...*). In Task 1 you might use them sparingly when describing steps; in Task 2 they are less common than declarative sentences. Use them only when giving clear instructions or recommendations.`,
  keyPoints: [
    "Every clause needs a subject and a verb; missing either causes a fragment.",
    "Pronouns must agree in number and person with the noun they replace.",
    "Adjectives go before nouns (or after linking verbs); adverbs often end in -ly but not always (e.g. fast, hard).",
    "Imperatives: base form of the verb (e.g. Compare, Discuss); use sparingly in academic writing.",
  ],
  examples: [
    { label: "Subject + verb", content: "The graph shows an increase. (subject: The graph; verb: shows)" },
    { label: "Pronoun", content: "Governments must act; they have the power to change policy." },
    { label: "Adjective + noun", content: "a sharp decline, environmental concerns" },
    { label: "Adverb", content: "Sales increased dramatically. The issue is extremely complex." },
    { label: "Imperative", content: "Consider both sides before concluding. Note that the figures are estimates." },
  ],
  commonMistakes: [
    "Using a pronoun without a clear antecedent (e.g. 'They say...' with no clear 'they').",
    "Confusing adjective and adverb (e.g. 'The trend increased quick' → use 'quickly').",
    "Overusing imperatives in Task 2; prefer 'It is important to consider...' or 'One should note...'.",
  ],
  practiceTips: [
    "Label subject and verb in every sentence you write; fix any sentence that lacks one.",
    "Replace repeated nouns with pronouns where it stays clear.",
    "Add one adverb to qualify a key verb in each paragraph (e.g. significantly, gradually, clearly).",
  ],
  ieltsTip: "In Task 1, use third person and present tense for describing the graph (The chart shows...). In Task 2, vary your subjects (people, governments, society) and keep verb agreement correct.",
};
