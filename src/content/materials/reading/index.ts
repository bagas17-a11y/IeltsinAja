import type { LessonMaterial } from "../types";

const readingMaterials: LessonMaterial[] = [
  {
    topicId: "reading-overview",
    moduleId: "reading",
    title: "Test Format and Strategies",
    summary:
      "Understand the three passages, 40 questions, and 60-minute format, and learn skimming, scanning, and time-management strategies.",
    body: `**Format**  
IELTS Academic Reading has **three passages**, **40 questions**, and **60 minutes** (no extra transfer time). Passages are taken from **books, journals, magazines, and newspapers**—academic or general-interest topics. Length is typically 700–900 words each; **difficulty increases** (Passage 1 is usually easiest, Passage 3 hardest). Topics are varied: science, history, society, technology, environment, etc.

**Strategies**  
1. **Skimming**: Read quickly for the **main idea** and **structure** (first and last sentences of paragraphs, headings). Don’t read every word; get an overview so you know where to look for answers.  
2. **Scanning**: Look for **specific information**—names, numbers, dates, key terms. Move your eyes quickly; stop when you find the relevant part, then read that section carefully.  
3. **Time management**: Aim for about **20 minutes per passage** (including reading and answering). If a question is taking too long, leave it and return later.  
4. **Order of questions**: Often (but not always) questions follow the order of the text. Use that to move through the passage without jumping around unnecessarily.  
5. **Instructions**: Always check the instruction (e.g. *NO MORE THAN TWO WORDS*, *TRUE/FALSE/NOT GIVEN*) and follow it exactly.`,
    keyPoints: [
      "Three passages; 40 questions; 60 minutes total; no extra time for transfer.",
      "Skim for main idea and structure; scan for specific words and details.",
      "Spend about 20 minutes per passage; move on if stuck.",
      "Follow the instruction (word limit, TRUE/FALSE/NOT GIVEN, etc.).",
    ],
    practiceTips: [
      "Practise skimming: set a timer (2–3 min per passage) and write one sentence summarising each paragraph.",
      "Practise scanning: find five names or dates in a passage as fast as you can.",
    ],
    ieltsTip: "You can write on the question paper. Underline key words in questions and mark where you find the answer in the passage so you can check later.",
  },
  {
    topicId: "reading-question-types",
    moduleId: "reading",
    title: "Question Types",
    summary:
      "Learn how to approach TRUE/FALSE/NOT GIVEN, matching, multiple choice, completion, and short-answer questions so you can find and write answers quickly and correctly.",
    body: `**TRUE / FALSE / NOT GIVEN (or YES / NO / NOT GIVEN)**  
You decide whether the statement **agrees** with the text (T/Y), **contradicts** the text (F/N), or has **no information** in the text (NG). Focus on **meaning**, not word matching. NG means the topic might be mentioned but the specific claim in the statement is not supported or contradicted. Don’t infer from general knowledge; only use the passage.

**Matching**  
Types: **headings to paragraphs** (choose the best heading for each paragraph); **information to paragraphs** (which paragraph contains this information?); **sentence endings** (complete the sentence with the correct ending); **features/names** (match descriptions to people, theories, etc.). For headings, read the first and last sentences of each paragraph; for 'which paragraph', scan for the key idea.

**Multiple choice**  
Choose A, B, C, or D (sometimes more than one). Read the question and options; find the relevant section; match meaning, not just words. Wrong options are often partial truths or paraphrases of something else in the text.

**Sentence / summary / table / flow-chart / diagram completion**  
Complete with words from the passage. Respect the **word limit** (e.g. NO MORE THAN TWO WORDS). The question will paraphrase the passage; your answer must be the actual word(s) from the text and must fit grammatically in the gap.

**Short-answer questions**  
Answer in words from the passage; again, respect the word limit. Answer only what is asked (e.g. 'a number' → write the number; 'two reasons' → give two).`,
    keyPoints: [
      "T/F/NG: agree = T, contradict = F, not stated = NG; base only on the text.",
      "Matching: headings = main idea of paragraph; 'which paragraph' = scan for the idea.",
      "Completion and short-answer: words from the passage; obey word limit and grammar.",
    ],
    commonMistakes: [
      "Writing TRUE when the answer is NOT GIVEN (the text doesn’t say, so don’t infer).",
      "Exceeding the word limit (e.g. three words when the instruction says NO MORE THAN TWO).",
      "Copying the wrong part of the passage (e.g. a synonym instead of the exact word when the instruction says 'from the passage').",
    ],
    ieltsTip: "For TRUE/FALSE/NOT GIVEN, if you can’t find the statement in the text at all, the answer is often NOT GIVEN. If the text says the opposite, it’s FALSE.",
  },
  {
    topicId: "reading-skills",
    moduleId: "reading",
    title: "Reading Skills",
    summary:
      "Develop skimming, scanning, paraphrase recognition, and inference so you can locate and understand answers even when the wording differs from the question.",
    body: `**Skimming and scanning**  
**Skimming** = reading for gist. Use it to get the main idea of each paragraph and the overall structure. **Scanning** = looking for specific information (a name, a date, a term). Use it once you know what you need from the question. Combine both: skim first so you know where to scan.

**Paraphrase and synonym**  
Questions rarely use the same words as the passage. You must recognise **paraphrases** (same meaning, different words) and **synonyms** (e.g. increase = rise, growth; problem = issue, difficulty). Build vocabulary in topic areas (environment, technology, society, etc.) and practise matching question wording to passage wording.

**Inference and writer’s view**  
Some questions ask what is **implied** or what the **writer’s purpose or attitude** is. You won’t see a sentence that says 'The writer believes X'; you must infer from tone, choice of words, and structure. Don’t over-infer; the answer must be supported by the text.`,
    keyPoints: [
      "Skim for structure and main idea; scan for the specific detail you need.",
      "Expect paraphrases and synonyms between question and passage.",
      "Inference: base it on the text; don’t use outside knowledge or guess too far.",
    ],
    practiceTips: [
      "After each practice, list the paraphrases (question → passage) for the answers you got right and wrong.",
      "Read one academic article per week and summarise the writer’s main point and attitude in 2–3 sentences.",
    ],
    ieltsTip: "Improving your general reading speed and vocabulary will help more than tricks. Read widely in English (articles, reports) to build speed and paraphrase recognition.",
  },
  {
    topicId: "reading-text-types",
    moduleId: "reading",
    title: "Text Types and Vocabulary",
    summary:
      "Familiarise yourself with sources (books, journals, articles, newspapers) and build topic and academic vocabulary so you can handle any passage.",
    body: `**Sources**  
As in the curriculum, passages come from **books, journals, articles, and newspapers**. They are often adapted for length and level. Style is usually **formal, objective, and informational**. Getting used to this style (long sentences, academic vocabulary, logical structure) will help you read faster and understand better.

**Vocabulary**  
Build **topic vocabulary** (e.g. climate, sustainability, innovation, society, health, education) and **academic/linking words** (however, therefore, furthermore, indicate, suggest, demonstrate, evidence). **Collocations** (e.g. conduct research, reach a conclusion, pose a threat) also appear often. Learning words in context (in sentences and paragraphs) is more useful than learning lists in isolation.`,
    keyPoints: [
      "Passages are from books, journals, articles, newspapers—formal, informational style.",
      "Topic and academic vocabulary + linking words + collocations will help comprehension.",
      "Learn vocabulary in context; practise with real academic-style texts.",
    ],
    practiceTips: [
      "Read at least one full passage per day from an academic or quality newspaper source.",
      "Keep a vocabulary notebook: word, meaning, one example sentence from the passage.",
    ],
    ieltsTip: "You don’t need to understand every word. Focus on the sentences that contain the answer; use context to guess the meaning of unknown words when necessary.",
  },
];

export default readingMaterials;
export { readingMaterials };
