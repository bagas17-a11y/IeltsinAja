import type { LessonMaterial } from "../types";

export const sentenceStructureMaterial: LessonMaterial = {
  topicId: "sentence-structure",
  moduleId: "writing",
  title: "Sentence Structure",
  summary:
    "Use active and passive voice appropriately and build simple, compound, and basic complex sentences for variety and clarity in Task 1 and Task 2.",
  body: `**Active or passive**  
In **active** voice, the subject does the action (The government *introduced* the policy. Research *shows* that...). In **passive** voice, the subject is acted upon (The policy *was introduced* in 2020. It *is* often *argued* that...). Use active when the doer is important; use passive when the action or result is more important than who did it, or when the doer is unknown or generic (e.g. It is believed that...). In Task 1, passive is useful for describing processes (Water is heated; the liquid is then cooled). Do not overuse passive; mix both for variety.

**Simple, compound, basic complex**  
- **Simple**: one independent clause (The figure increased. Demand fell.).  
- **Compound**: two or more independent clauses joined by and, but, or, so (Demand rose and supply fell. Prices increased, but sales remained stable.).  
- **Complex**: one independent clause + one or more dependent clauses (The figure increased *because* demand was high. *Although* costs rose, profits improved.). Subordinators: because, although, while, when, if, that, which, who. Use a mix of sentence types to show range and improve coherence.`,
  keyPoints: [
    "Active: subject does the action. Passive: subject receives the action (be + past participle).",
    "Use passive when the doer is unknown, obvious, or less important than the result.",
    "Simple = one main clause; compound = two main clauses with and/but/or/so; complex = main clause + dependent clause.",
    "Vary sentence length and type for better band score in Grammatical Range.",
  ],
  examples: [
    { label: "Active", content: "The chart shows a rise in sales. Governments must address this issue." },
    { label: "Passive", content: "The data were collected in 2020. It is often argued that technology has negative effects." },
    { label: "Compound", content: "Unemployment fell, but inflation rose. The trend is clear, and action is needed." },
    { label: "Complex", content: "Although the figure increased, the rate of growth slowed. The report shows that emissions have peaked." },
  ],
  commonMistakes: [
    "Using passive when active is clearer (e.g. 'The policy was introduced by the government' → 'The government introduced the policy' if the focus is who did it).",
    "Writing only simple sentences; aim for at least some compound or complex sentences per paragraph.",
    "Run-on sentences: two main clauses with no conjunction or punctuation (Demand rose supply fell → Demand rose; supply fell. or Demand rose, and supply fell.).",
  ],
  practiceTips: [
    "In each paragraph, include at least one complex sentence (with because, although, when, if, that).",
    "In Task 1, use passive for process diagrams (First, the material is heated...).",
  ],
  ieltsTip: "Grammatical Range and Accuracy rewards variety. Aim for a mix of simple, compound, and complex sentences and appropriate use of active and passive.",
};
