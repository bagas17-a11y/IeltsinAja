import type { LessonMaterial } from "../types";

export const subjectVerbAgreementMaterial: LessonMaterial = {
  topicId: "subject-verb-agreement",
  moduleId: "writing",
  title: "Subject–Verb Agreement",
  summary:
    "Make verbs agree with singular and plural subjects, use conditionals (zero, first, second, third, mixed) correctly, and keep word order clear in statements and questions.",
  body: `**Singular and plural**  
A **singular** subject takes a singular verb (The *number* of cars *has* increased. *Research* *shows* that...). A **plural** subject takes a plural verb (The *figures* *show* a trend. *Many people* *believe* that...). Watch out for: *The number of* + plural noun → singular verb (the number *has*); *A number of* + plural noun → plural verb (a number *have*). Words like *everyone*, *each*, *either* are grammatically singular (Everyone *is*; each of the studies *shows*).

**Conditionals**  
- **Zero**: general truth, *if* + present, present (If you *heat* water, it *boils*).  
- **First**: real future, *if* + present, *will* + base (If the government *acts*, emissions *will fall*).  
- **Second**: unreal present/future, *if* + past simple, *would* + base (If we *had* more data, we *would know* more).  
- **Third**: unreal past, *if* + past perfect, *would have* + past participle (If they *had invested* earlier, costs *would have been* lower).  
- **Mixed**: e.g. past condition + present result (If they *had not* acted, we *would* still *be* in crisis).

**Word order**  
Statements: Subject + Verb + Object (SVO). Questions: invert subject and auxiliary (Is it true? What does the graph show?). In academic writing, keep SVO unless you use a clear adverbial at the start (In conclusion, ...).`,
  keyPoints: [
    "The number of + plural → singular verb; A number of + plural → plural verb.",
    "Everyone, each, either, neither, none (of) often take singular verbs in formal writing.",
    "Conditionals: zero = fact; first = real future; second = hypothetical now/future; third = hypothetical past.",
    "Keep subject and verb next to each other where possible; long phrases between them cause agreement errors.",
  ],
  examples: [
    { label: "Singular", content: "The proportion of people who own a car has risen. Each of the countries has its own policy." },
    { label: "Plural", content: "The data show a clear trend. A number of studies have found similar results." },
    { label: "First conditional", content: "If governments invest in renewable energy, emissions will fall." },
    { label: "Second conditional", content: "If everyone recycled, waste would decrease significantly." },
    { label: "Third conditional", content: "If the policy had been introduced earlier, the problem would have been smaller." },
  ],
  commonMistakes: [
    "The number of students have increased → The number of students has increased.",
    "If they would have known → If they had known (third conditional: if + past perfect, would have + past participle).",
    "Putting a long clause between subject and verb so the verb disagrees (e.g. The results of the study that was published last year *show* – subject is 'results', so 'show' is correct).",
  ],
  practiceTips: [
    "Underline the subject in each sentence and check that the verb matches (singular/plural).",
    "Practise one conditional type per paragraph (e.g. one Task 2 body with a second conditional for a hypothetical).",
  ],
  ieltsTip: "Subject–verb agreement errors are very common and are penalised under Grammatical Range and Accuracy. Double-check after phrases like 'The number of', 'A majority of', 'Each of', and in long sentences.",
};
