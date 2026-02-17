import type { LessonMaterial } from "../types";

const listeningMaterials: LessonMaterial[] = [
  {
    topicId: "listening-overview",
    moduleId: "listening",
    title: "Test Format and Strategies",
    summary:
      "Understand the four sections, timing, and question flow of IELTS Listening, and learn strategies to use before and during the test.",
    body: `**Format**  
IELTS Listening has **four sections**, **40 questions**, and takes about **30 minutes** (plus 10 minutes at the end to transfer answers to the answer sheet).  
- **Section 1**: Everyday conversation between two speakers (e.g. booking accommodation, joining a club). Often form/note completion.  
- **Section 2**: One speaker in an everyday context (e.g. tour of a place, talk about facilities). May include map or diagram labelling.  
- **Section 3**: Conversation in an educational context (e.g. two or more people discussing a project, assignment, or course). More complex vocabulary and ideas.  
- **Section 4**: Academic monologue (e.g. a lecture or talk). One speaker; dense information; no break in the middle.  
Difficulty generally increases; Section 4 is usually the hardest. You hear each recording **once only**.

**Strategies**  
1. **Use the example** (when given) to understand the task and the type of answer.  
2. **Read the questions before the recording starts**; underline key words and think about what kind of answer is needed (number? name? noun?).  
3. **Predict** possible answers (e.g. days, numbers, names) where you can.  
4. **Follow instructions** exactly: e.g. *NO MORE THAN TWO WORDS AND/OR A NUMBER* means your answer must fit that limit or it may be marked wrong.  
5. **Keep going** if you miss one answer; the next question will come. Don’t get stuck.  
6. **Use the 10-minute transfer time** to check spelling, grammar, and that answers are in the right place.`,
    keyPoints: [
      "Four sections; 40 questions; one hearing only; 10 min transfer at the end.",
      "Section 1 = everyday; Section 2 = monologue everyday; Section 3 = educational conversation; Section 4 = academic monologue.",
      "Read questions first; underline key words; predict answer type (word/number/name).",
      "Always obey the word limit (e.g. NO MORE THAN TWO WORDS).",
    ],
    examples: [
      { label: "Answer type", content: "If the question says 'Write NO MORE THAN TWO WORDS', write one or two words only—e.g. 'traffic congestion' ✓, 'the problem of traffic congestion' ✗." },
    ],
    commonMistakes: [
      "Ignoring the word limit and writing a long answer (marked wrong even if the content is correct).",
      "Spelling errors (names, places)—spelling must be correct.",
      "Writing the answer in the wrong place on the answer sheet during transfer.",
    ],
    practiceTips: [
      "Practise with official-style recordings: do Sections 1–4 in one go under timed conditions.",
      "After each practice, check why you missed answers: wrong prediction? spelling? wrong word form?",
    ],
    ieltsTip: "Use the pauses before each section to read the next set of questions. In Section 4, read all questions for that section before the recording starts so you can follow the flow of the lecture.",
  },
  {
    topicId: "listening-question-types",
    moduleId: "listening",
    title: "Question Types",
    summary:
      "Learn how to tackle form/note/table/summary completion, matching, multiple choice, sentence completion, and labelling so you can respond quickly and accurately.",
    body: `**Form / note / table / flow-chart / summary completion**  
You fill gaps with words (and sometimes numbers) from the recording. Read the headings and the sentences around the gaps to understand the context. Predict the type of word (noun, number, name). Write exactly what you hear; check the word limit (e.g. ONE WORD ONLY, NO MORE THAN TWO WORDS).

**Matching**  
You match a list of options (e.g. people, places, opinions) to questions or statements. Options may be used more than once or not at all. Read the options first; during the recording, note who said what or which option fits which statement. Paraphrasing is common—the recording won’t repeat the exact words of the question.

**Multiple choice**  
Choose A, B, C, or D (sometimes more than one answer). Read the question and all options before listening. Listen for the answer; distractors (wrong options that sound plausible) are common, so wait until you hear the full idea before deciding.

**Sentence completion**  
Complete sentences with words from the recording. The sentence on the question paper will often be a paraphrase of what you hear; your answer must be grammatically correct in the sentence (e.g. if the gap needs a noun, write a noun). Respect the word limit.

**Labelling (map, diagram, plan)**  
You label a map, diagram, or plan. Options may be given in a list (choose the correct letter) or you may write words from the recording. Follow the order of the recording; use direction words (left, right, north, past the...) to keep your place.`,
    keyPoints: [
      "Completion: fill the gap with words from the recording; obey word limit and spelling.",
      "Matching: link options to items; options can repeat; listen for paraphrased ideas.",
      "Multiple choice: all options may sound plausible; wait for the full answer; watch for distractors.",
      "Labelling: follow the order of the script; use direction and position language.",
    ],
    practiceTips: [
      "Practise each question type separately, then do full tests that mix all types.",
      "For matching, write short notes (e.g. A, B, C) next to each item as you hear the answer.",
    ],
    ieltsTip: "Answers follow the order of the recording. If you miss one, move on and note the next question number so you don’t lose your place.",
  },
  {
    topicId: "listening-skills",
    moduleId: "listening",
    title: "Listening Skills",
    summary:
      "Develop prediction, key-word recognition, signposting, and inference so you can follow the recording and identify correct answers despite paraphrasing and distractors.",
    body: `**Prediction and key words**  
Before the recording, **predict** what kind of information you need (a date? a name? a reason?). **Key words** in the question (e.g. *reasons*, *problem*, *advantage*) will often be **paraphrased** in the recording (e.g. 'reasons' → 'why', 'because'; 'problem' → 'issue', 'difficulty'). Train yourself to recognise synonyms and rephrasing so you don’t wait for the exact word.

**Signposting and structure**  
Speakers use **signposting** to organise their talk: *First... Second... So to sum up... However... Another point is...* Listening for these helps you know when a new point or answer is coming. In Section 4, the lecture will often follow a clear structure (introduction → main points → conclusion); follow that structure in the questions.

**Detail and inference**  
Some questions ask for **explicit** information (you hear the answer directly). Others require **inference** (you must understand the implication). For example, if the speaker says 'We had to cancel the trip', the answer to 'What happened to the trip?' might be 'cancelled' or 'it was cancelled'. Also watch for **distractors**: the speaker may mention something that sounds like the answer but then correct it or add a condition (e.g. 'It was going to be Monday—actually, we changed it to Tuesday').`,
    keyPoints: [
      "Predict answer type; listen for paraphrases of the question words, not only exact words.",
      "Use signposting (First, However, So...) to follow the structure and anticipate the next answer.",
      "Some answers are stated; others you must infer from what is said.",
      "Distractors are common: wait for the final or correct piece of information.",
    ],
    practiceTips: [
      "After each practice, list the paraphrases used (question word → what you heard).",
      "Listen once without the questions and summarise the main points; then do the same recording with questions.",
    ],
    ieltsTip: "In Section 3 and 4, speakers often correct themselves or change their mind. The last stated view or fact is usually the one that matches the answer.",
  },
  {
    topicId: "listening-vocabulary-grammar",
    moduleId: "listening",
    title: "Vocabulary and Grammar for Listening",
    summary:
      "Improve spelling, word form, and familiarity with different accents so your answers are acceptable and you don’t lose marks for transfer errors.",
    body: `**Spelling and form**  
Correct **spelling** is required; wrong spelling can cost the mark. Practise common topic words (e.g. accommodation, environment, government, questionnaire). **Word form** matters: if the gap is in a noun phrase, write a noun (e.g. *development*, not *develop*); if it needs an adjective, write an adjective. **Numbers and dates** must be written clearly (e.g. 30, 1985). Check **singular/plural** (e.g. 'three reasons' → your answer might need a plural noun).

**Accents and variety**  
You will hear a mix of **British, American, Australian**, and other English accents. Expose yourself to different accents (podcasts, videos, practice tests) so you are not thrown by one accent. Focus on content and key words rather than getting used to only one variety.`,
    keyPoints: [
      "Spelling must be correct; practise high-frequency and topic vocabulary.",
      "Write the correct word form (noun/verb/adjective) to fit the sentence.",
      "Numbers and dates: write them clearly; check singular/plural.",
      "Listen to different accents so you are comfortable in the test.",
    ],
    commonMistakes: [
      "Spelling: accomodation → accommodation; enviroment → environment; writting → writing.",
      "Wrong form: 'the develop of' → 'the development of'; 'it is importance' → 'it is important'.",
    ],
    practiceTips: [
      "Keep a list of words you misspell in practice; revise them before the test.",
      "When transferring answers, read each one back and check spelling and word form.",
    ],
    ieltsTip: "Use the 10-minute transfer time to double-check every answer: spelling, grammar, word limit, and that the answer is in the correct box. A correct answer in the wrong place is marked wrong.",
  },
];

export default listeningMaterials;
export { listeningMaterials };
