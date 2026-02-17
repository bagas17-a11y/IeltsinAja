import type { LessonMaterial } from "../types";

export const apostrophesMaterial: LessonMaterial = {
  topicId: "apostrophes",
  moduleId: "writing",
  title: "Apostrophes",
  summary:
    "Use apostrophes correctly for possession and contraction so your writing looks precise and avoids losing marks for basic punctuation.",
  body: `Apostrophes have two main **types** and **functions** in English.

**1. Possessive (ownership)**  
Add **'s** to singular nouns (the *government's* policy, *today's* figures). For plural nouns that already end in *s*, add only **'** (the *countries'* economies, *students'* results). For irregular plurals (e.g. children, people), use **'s** (children's health).

**2. Contraction (shortening)**  
Apostrophes replace omitted letters: *it's* = it is; *don't* = do not; *won't* = will not; *they're* = they are. Contractions are generally **avoided in formal IELTS Academic Writing**; use full forms (it is, do not, will not, they are) for a more academic tone.`,
  keyPoints: [
    "Possessive: singular noun + 's (e.g. the company's profits); plural ending in s + ' (e.g. the companies' profits).",
    "Its (possessive) has NO apostrophe; it's = it is. Same for whose/who's, your/you're, their/they're.",
    "In IELTS Writing, prefer it is, do not, cannot rather than it's, don't, can't.",
  ],
  examples: [
    { label: "Possessive singular", content: "the report's conclusion, the data's reliability" },
    { label: "Possessive plural", content: "the researchers' findings, both countries' policies" },
    { label: "Contraction (avoid in essays)", content: "Don't use don't → Use do not. It's → It is." },
    { label: "Its vs it's", content: "The graph has its limitations. (possessive) It's clear that... (it is – prefer: It is clear that...)" },
  ],
  commonMistakes: [
    "Writing *it's* when you mean possessive (*its*): The chart shows its main trend.",
    "Adding apostrophe to plural nouns that are not possessive: *result's* (wrong for 'results').",
    "Using *their* for *there* or *they're*: their = belonging to them; there = place/ existence; they're = they are.",
  ],
  practiceTips: [
    "Proofread every essay for its/it's and your/you're/their/there/they're.",
    "When in doubt, use the full form (it is, they are) in Task 1 and Task 2.",
  ],
  ieltsTip: "Examiners notice apostrophe errors quickly. One or two such errors can affect the grammatical range and accuracy score. Always check possessives and avoid contractions in Academic Writing.",
};
