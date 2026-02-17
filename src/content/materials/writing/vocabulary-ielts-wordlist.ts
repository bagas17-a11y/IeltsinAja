import type { LessonMaterial } from "../types";

export const vocabularyIeltsWordlistMaterial: LessonMaterial = {
  topicId: "vocabulary-ielts-wordlist",
  moduleId: "writing",
  title: "Vocabulary (IELTS Wordlist)",
  summary:
    "Build topic vocabulary (basic), idioms and phrasal verbs (intermediate), and collocations (advance) so your writing is precise and band 7+ in Lexical Resource.",
  body: `**Topic vocabulary (basic)**  
Learn high-frequency words for common IELTS topics: **Personal info, work, home, family, education, health, likes/dislikes** (e.g. career, household, upbringing, qualification, well-being, preference). Then: **Technology, environment, travel, culture, global issues, crime, punishment** (e.g. innovation, sustainability, tourism, heritage, inequality, offence, penalty). Use these accurately in context; avoid vague words (thing, stuff, get) where a precise word fits.

**Idioms and phrasal verbs (intermediate)**  
Use sparingly in Academic Writing; when you do, choose formal or semi-formal ones. Examples: *play a role*, *in the long run*, *on the other hand*, *carry out* (research), *deal with*, *lead to*, *contribute to*. Avoid very informal idioms (e.g. *a piece of cake*) in Task 1 and Task 2.

**Collocations (advance)**  
Collocations are word pairs that native speakers use together. **Verb–noun**: *conduct research*, *reach a conclusion*, *address the issue*, *pose a threat*, *have an impact*. **Adjective–noun**: *significant increase*, *sharp decline*, *major factor*, *key point*, *widespread concern*. Using strong collocations improves Lexical Resource; learning them in chunks is more effective than single words.`,
  keyPoints: [
    "Topic vocabulary: know 2–3 precise words per topic (e.g. environment: emissions, sustainability, renewable).",
    "Idioms/phrasal verbs: use formal ones (carry out, lead to, contribute to); avoid slang.",
    "Collocations: learn verb–noun and adjective–noun pairs (conduct a study, significant effect).",
    "Replace get, thing, a lot, very with more precise alternatives (obtain, issue/factor, many/significant, extremely).",
  ],
  examples: [
    { label: "Topic (environment)", content: "emissions, renewable energy, sustainability, carbon footprint, fossil fuels" },
    { label: "Phrasal/idiom", content: "Governments must carry out policies that lead to change. In the long run, investment pays off." },
    { label: "Collocation verb–noun", content: "conduct research, reach a conclusion, address the issue, pose a threat" },
    { label: "Collocation adjective–noun", content: "significant increase, sharp decline, major factor, key point" },
  ],
  commonMistakes: [
    "Using an idiom that is too informal (e.g. 'at the end of the day' can be overused; prefer 'ultimately' or 'in conclusion').",
    "Wrong collocation (e.g. 'make research' → 'conduct/carry out research'; 'big problem' → 'major/serious problem').",
    "Repeating the same word; use synonyms or paraphrases (e.g. increase → rise, growth, upward trend).",
  ],
  practiceTips: [
    "Keep a topic-word list per PDF area (personal, work, education, technology, environment, etc.) and use 2–3 in each practice essay.",
    "Learn 5–10 collocations per week and use at least two in each Task 2.",
  ],
  ieltsTip: "Lexical Resource is scored on range and accuracy. Show range with topic vocabulary and collocations; show accuracy by using words in the right context and avoiding wrong collocations.",
};
