import type { LessonMaterial } from "../types";

export const clausesMaterial: LessonMaterial = {
  topicId: "clauses",
  moduleId: "writing",
  title: "Clauses",
  summary:
    "Identify and combine dependent and independent clauses correctly so your sentences are complete and your complex sentences are grammatically sound.",
  body: `An **independent clause** can stand alone as a sentence (It has a subject and a verb and expresses a complete thought). A **dependent clause** cannot stand alone; it depends on another clause (e.g. *Because demand rose*, *When the data were published*, *That the figure increased*).

**Combining clauses**  
- **Subordinator** + dependent clause + comma + independent clause: *Although costs were high, profits increased.*  
- Independent clause + subordinator + dependent clause (no comma before the subordinator when it follows the main clause): *Profits increased although costs were high.*  
- **Relative clauses**: *who/which/that* introduce a clause that describes a noun (The report *that was published* last year... The country *which* has the highest rate...). Use *which* for things, *who* for people; *that* can be used for both; no comma before restrictive (essential) clauses, comma before non-restrictive (The report, which was published last year, is widely cited.).

**Common subordinators**  
*Because, although, while, when, if, since, as, so that, until.* Make sure every dependent clause is attached to an independent clause; otherwise you have a fragment (e.g. *Because the figure increased.* ✗ → *Because the figure increased, demand was high.* ✓).`,
  keyPoints: [
    "Independent clause = full sentence on its own. Dependent = needs another clause.",
    "Subordinator (because, although, when, if) introduces a dependent clause.",
    "Relative: who (people), which/that (things). Restrictive = no comma; non-restrictive = comma.",
    "Do not leave a dependent clause as a sentence by itself (fragment).",
  ],
  examples: [
    { label: "Independent", content: "The figure increased. Demand was high." },
    { label: "Dependent + independent", content: "Because the figure increased, prices rose. Although it was expensive, they bought it." },
    { label: "Relative", content: "The study that was published in 2020 found... The data, which are updated annually, show..." },
  ],
  commonMistakes: [
    "Fragment: Starting with Because/Although/When without a main clause (Because the demand rose. ✗).",
    "Comma splice: Two independent clauses joined only by a comma (Demand rose, prices fell ✗ → use . or ; or and/but.).",
    "Using which for people or who for things (The people which... ✗ → The people who...).",
  ],
  practiceTips: [
    "For each sentence that starts with Although/Because/When, check that the other part is a full main clause.",
    "Add one relative clause per paragraph (The factor that matters most... / The report, which is widely cited, ...).",
  ],
  ieltsTip: "Complex sentences (main + dependent clause) are needed for a higher Grammatical Range score. Use at least 2–3 per essay and ensure no fragments or run-ons.",
};
