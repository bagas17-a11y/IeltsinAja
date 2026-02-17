import type { LessonMaterial } from "../types";

export const countableUncountableMaterial: LessonMaterial = {
  topicId: "countable-uncountable",
  moduleId: "writing",
  title: "Countable and Uncountable Nouns",
  summary:
    "Use countable and uncountable nouns correctly with the right articles, quantifiers, and container words so your grammar is accurate in Task 1 and Task 2.",
  body: `**Countable nouns** can be singular or plural (one *report*, two *reports*; *country/countries*). They take *a/an* in singular and *many*, *few*, *number of* in plural. **Uncountountable nouns** have no plural form (e.g. *research*, *information*, *data* in many uses, *evidence*, *advice*, *water*). They take *much*, *little*, *amount of* and no *a/an* (we say *research shows*, not *a research shows*—though *a piece of research* is possible).

**Tenses and agreement**  
With uncountables, use singular verbs (The *information* is useful. *Research* shows...). *Data* can be treated as plural in some contexts (The data are correct) or singular (The data is correct); both occur in academic writing; stay consistent.

**Container words**  
To 'count' uncountables we use phrases: *a piece of* (information, advice, research), *a bit of* (luck, advice), *a slice of* (bread), *a cup of* (water). In IELTS, *a piece of research/evidence* is common.

**Quantifiers**  
Countable: *many*, *few*, *a few*, *several*, *a number of*, *fewer*. Uncountable: *much*, *little*, *a little*, *a great deal of*, *less*. Both: *some*, *any*, *a lot of*, *lots of*, *plenty of*. Use *less* with uncountables (less water) and *fewer* with countables (fewer people)—though *less* is often used informally with countables; in formal writing prefer *fewer* for plurals.`,
  keyPoints: [
    "Countable: a/an, many, few, number of. Uncountable: no a/an, much, little, amount of.",
    "Research, information, evidence, advice, data (often) are uncountable—singular verb.",
    "Container: a piece of research/information/advice; a bit of; a great deal of.",
    "Fewer + countable plural; less + uncountable (fewer people, less pollution).",
  ],
  examples: [
    { label: "Uncountable", content: "Research shows... The information is useful. There is much evidence." },
    { label: "Countable", content: "A report was published. Many studies have found... Several countries..." },
    { label: "Container", content: "a piece of research, a piece of advice, a great deal of effort" },
    { label: "Quantifiers", content: "much pollution, many people; less waste, fewer cars" },
  ],
  commonMistakes: [
    "A research / many researches → Research (uncountable) or a piece of research / many studies.",
    "Less people → Fewer people (with countable plural in formal writing).",
    "Information are / datas → Information is; data is (or data are if you treat it as plural consistently).",
  ],
  practiceTips: [
    "List common uncountables: research, information, evidence, advice, data, water, traffic, pollution—and use them with singular verbs and much/little.",
    "Practise 'a piece of' and 'a great deal of' in at least one sentence per essay.",
  ],
  ieltsTip: "Errors with countable/uncountable (e.g. many research, less people) are frequent and affect Grammatical Accuracy. Check every noun: does it have a plural? If not, use much/little and singular verb.",
};
