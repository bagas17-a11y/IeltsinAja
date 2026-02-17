import type { LessonMaterial } from "../types";

export const verbTensesMaterial: LessonMaterial = {
  topicId: "verb-tenses",
  moduleId: "writing",
  title: "Verb Tenses",
  summary:
    "Use past, present, and future correctly, with simple, continuous, perfect, and perfect continuous aspects, so your Task 1 and Task 2 writing is accurate and appropriate to the context.",
  body: `In IELTS Writing you must choose the right **tense** (past, present, future) and **aspect** (simple, continuous, perfect, perfect continuous) for the meaning you want.

**Past**  
- **Simple**: completed actions or past facts (Sales *fell* in 2020. The study *showed* that...).  
- **Continuous**: action in progress at a time in the past (While exports *were rising*, unemployment *was falling*).  
- **Perfect**: action completed before another past time (By 2019, the figure *had reached* 50%).  
- **Perfect continuous**: duration before a past time (Employment *had been rising* for five years).

**Present**  
- **Simple**: facts, habits, general truths (The chart *shows*... Research *suggests*...).  
- **Continuous**: ongoing now or around now (The proportion *is increasing*).  
- **Perfect**: past with present relevance (The figure *has risen* since 2010).  
- **Perfect continuous**: duration up to now (Spending *has been growing* for a decade).

**Future**  
- **Simple**: predictions or future facts (Unemployment *will fall*. The plan *will take* effect in 2025).  
- **Continuous**: action in progress at a future time (Next year, demand *will be rising*).  
- **Perfect**: action completed before a future time (By 2030, emissions *will have fallen*).  
- **Perfect continuous**: duration before a future time (By then, they *will have been waiting* for years).`,
  keyPoints: [
    "Task 1: If the graph has no date or is 'always true', use present (The chart shows...). If it has past dates, use past (In 2020, sales fell).",
    "Task 2: Use present for general statements (People believe...), past for past events (Historically, ...), future for predictions (will, may, might).",
    "Perfect aspects link two times: past perfect = before another past time; present perfect = past with present relevance.",
  ],
  examples: [
    { label: "Task 1 past", content: "Between 2015 and 2020, the number of users increased from 2 million to 5 million." },
    { label: "Task 1 present (no date)", content: "The diagram shows how solar panels convert light into electricity." },
    { label: "Task 2 present", content: "Many people argue that technology has improved communication." },
    { label: "Present perfect", content: "Governments have introduced various policies to reduce emissions." },
    { label: "Future", content: "If this trend continues, demand will exceed supply by 2030." },
  ],
  commonMistakes: [
    "Using present for clearly past data (e.g. 'In 2018 the figure increases' → use 'increased').",
    "Mixing tenses without reason in one sentence (e.g. 'The graph showed... and is indicating' → keep consistent).",
    "Overusing future (will) in Task 2; use modals (may, might, could) for opinions and possibilities.",
  ],
  practiceTips: [
    "For Task 1, decide once: is the data in the past? If yes, use past tense for the data; use present for 'The chart shows...'.",
    "In Task 2, use present simple for general truth, past for examples from history, and will/may/might for the future.",
  ],
  ieltsTip: "Consistent and accurate tense use is part of Grammatical Range and Accuracy. Wrong tense in Task 1 (e.g. present for past data) is a clear error; in Task 2, match tense to the time you are discussing.",
};
