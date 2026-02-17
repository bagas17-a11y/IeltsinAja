import type { LessonMaterial } from "../types";

export const punctuationMaterial: LessonMaterial = {
  topicId: "punctuation",
  moduleId: "writing",
  title: "Punctuation",
  summary:
    "Use commas, colons, semicolons, quotation marks, and dashes correctly so your sentences are clear and your writing looks professional.",
  body: `**Commas**  
Use commas: (1) to separate items in a list (A, B, and C – the final 'and' before the last item is optional but common); (2) after introductory phrases (However, ... / In addition, ... / After 2020, ...); (3) to set off non-essential clauses (The figure, which was revised, is now higher). Do not use a comma between subject and verb (The graph, shows → wrong).

**Colons and semicolons**  
**Colon**: introduces a list, explanation, or quote (The main reasons are: cost, time, and quality. One point is clear: action is needed). **Semicolon**: links two closely related independent clauses without a conjunction (Demand rose; supply fell. Some agree; others disagree). Do not overuse; one or two per essay is enough.

**Quotation marks**  
Use for direct speech or quoted words (The report stated that 'emissions have peaked'). In academic writing, paraphrasing is preferred to long quotes; if you quote, keep it short and cite appropriately.

**Dashes**  
**Em dash (—)** can set off an aside or emphasis (The result—a 20% increase—was unexpected). **Hyphen** joins compound modifiers before a noun (well-known fact, long-term effect). Do not confuse with minus or en dash; in IELTS, use sparingly and consistently.`,
  keyPoints: [
    "Comma: lists, after intro phrases, around non-essential clauses. Not between subject and verb.",
    "Colon: before a list or explanation; semicolon: between two full sentences that are closely related.",
    "Quotation marks: for direct quotes; prefer paraphrase in IELTS.",
    "Hyphen: compound adjectives before noun (e.g. high-quality data). Em dash: optional for asides.",
  ],
  examples: [
    { label: "Commas in list", content: "The chart shows changes in population, employment, and income." },
    { label: "Comma after intro", content: "However, not everyone agrees. In 2020, the figure fell." },
    { label: "Colon", content: "Two factors matter: cost and reliability. The conclusion is clear: we must act." },
    { label: "Semicolon", content: "Rates increased in the north; they decreased in the south." },
    { label: "Hyphen", content: "a well-designed study, up-to-date figures" },
  ],
  commonMistakes: [
    "Comma splice: joining two full sentences with only a comma (The figure rose, it then fell → use full stop or semicolon or and/but).",
    "Using a colon after a verb that doesn't introduce a list (e.g. 'The graph shows: an increase' → 'The graph shows an increase').",
    "Hyphenating after the noun (the data is up-to-date ✓; the data is up to date ✓; the up-to-date data ✓).",
  ],
  practiceTips: [
    "Read each sentence aloud; if you pause naturally, a comma might be correct (but check the rule).",
    "Limit semicolons to 1–2 per essay; use full stops or linking words if unsure.",
  ],
  ieltsTip: "Punctuation errors can affect clarity and cohesion. Comma splices and missing commas after However/Therefore are especially common—proofread for these.",
};
