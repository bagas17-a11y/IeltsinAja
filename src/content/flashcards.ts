/**
 * Flashcards content for IELTS Grammar Topics 1-6
 * Format: Q (question) and A (answer) for each flashcard
 */

export interface Flashcard {
  id: string;
  question: string;
  answer: string;
  category?: string;
}

export interface FlashcardTopic {
  id: string;
  title: string;
  subtopics: {
    id: string;
    title: string;
    flashcards: Flashcard[];
  }[];
}

export const FLASHCARD_TOPICS: FlashcardTopic[] = [
  {
    id: "parts-of-speech",
    title: "Parts of Speech",
    subtopics: [
      {
        id: "subject",
        title: "Subject",
        flashcards: [
          {
            id: "subject-1",
            question: "In the sentence 'The percentage of students using online platforms increased between 2010 and 2020.' what is the subject?",
            answer: "The subject is 'The percentage of students using online platforms' — a noun phrase showing a specific group.",
          },
          {
            id: "subject-2",
            question: "Rewrite this with a more academic subject: 'More people use cars now.'",
            answer: "'The number of people using private vehicles has increased significantly.' (Uses a noun phrase instead of 'More people').",
          },
          {
            id: "subject-3",
            question: "What is a dummy subject? Give an example.",
            answer: "A dummy subject is 'It' used when the real subject comes later. Example: 'It is widely believed that education plays a vital role.'",
          },
          {
            id: "subject-4",
            question: "Identify the subject in: 'Globalisation has changed how people communicate.'",
            answer: "The subject is 'Globalisation' — an abstract noun suitable for IELTS Task 2.",
          },
          {
            id: "subject-5",
            question: "Which is more academic: 'Cars cause pollution' or 'The widespread use of private vehicles contributes to air pollution'?",
            answer: "The second — it uses a longer noun phrase ('The widespread use of private vehicles') instead of a simple noun ('Cars').",
          },
        ],
      },
      {
        id: "verb",
        title: "Verb",
        flashcards: [
          {
            id: "verb-1",
            question: "In 'The chart illustrates the changes in energy use,' which word is the main verb and why is it suitable for Task 1?",
            answer: "'Illustrates' is the main verb. It's a reporting verb that introduces what the chart shows, suitable for Task 1 introductions.",
          },
          {
            id: "verb-2",
            question: "Change the verb to a stronger academic verb: 'The graph shows a big rise in sales.'",
            answer: "'The graph demonstrates a significant increase in sales.' (Uses 'demonstrates' and 'significant' instead of 'shows' and 'big').",
          },
          {
            id: "verb-3",
            question: "Is 'was projected to reach' a lexical or auxiliary verb? Explain.",
            answer: "It's auxiliary ('was') + lexical ('projected'). 'Was' helps form the passive, while 'projected' carries the main meaning.",
          },
          {
            id: "verb-4",
            question: "Which verb is better for Task 2: 'argue' or 'say'? Why?",
            answer: "'Argue' — it's a stronger opinion verb that shows you can use academic vocabulary. 'Say' is too neutral.",
          },
          {
            id: "verb-5",
            question: "Complete with a modal: 'If governments invest in public transport, traffic jams ____ decrease.'",
            answer: "'will decrease' — first conditional for real future possibility.",
          },
        ],
      },
      {
        id: "pronoun",
        title: "Pronoun",
        flashcards: [
          {
            id: "pronoun-1",
            question: "Replace the second 'the government' with a pronoun: 'The government increased taxes because the government needed more money.'",
            answer: "'The government increased taxes because it needed more money.' (Uses 'it' to avoid repetition).",
          },
          {
            id: "pronoun-2",
            question: "Join the sentences with a relative pronoun: 'Many people live in cities. They face higher living costs.'",
            answer: "'Many people who live in cities face higher living costs.' (Uses 'who' to join the sentences).",
          },
          {
            id: "pronoun-3",
            question: "What does 'this' refer to in: 'The unemployment rate rose sharply. This trend is likely to continue.'",
            answer: "'This' refers to 'The unemployment rate rose sharply' — the previous sentence about the increase.",
          },
          {
            id: "pronoun-4",
            question: "Fix the unclear pronoun: 'This leads to pollution.' (Previous sentence: 'People use cars.')",
            answer: "'The widespread use of private vehicles leads to pollution.' (Replaces vague 'This' with a clear noun phrase).",
          },
          {
            id: "pronoun-5",
            question: "Which relative pronoun fits: 'Individuals ____ live in cities often face higher costs.'",
            answer: "'who' — refers to people ('Individuals').",
          },
        ],
      },
      {
        id: "adjective",
        title: "Adjective",
        flashcards: [
          {
            id: "adjective-1",
            question: "Which adjective better fits an IELTS Task 1 sentence: 'big' or 'significant'? Explain using this sentence: 'There was a ___ increase in internet usage.'",
            answer: "'Significant' — it's more academic and precise. 'Big' sounds informal. 'There was a significant increase in internet usage.'",
          },
          {
            id: "adjective-2",
            question: "Change 'very good education system' to a more academic noun phrase.",
            answer: "'high-quality education system' or 'effective education system' — avoids 'very' and uses stronger adjectives.",
          },
          {
            id: "adjective-3",
            question: "Choose the best adjective for a trend: 'There was a ___ increase in sales.' (Options: slight, moderate, significant, dramatic)",
            answer: "Depends on the data, but 'significant' or 'dramatic' are stronger academic choices than 'slight' or 'moderate'.",
          },
          {
            id: "adjective-4",
            question: "Which is more academic: 'bad impact' or 'detrimental impact'?",
            answer: "'Detrimental impact' — 'bad' is too informal for Academic Writing.",
          },
          {
            id: "adjective-5",
            question: "Complete: 'Fast food has a ___ impact on public health.' (Use an evaluation adjective)",
            answer: "'detrimental' or 'negative' — evaluation adjectives show you can assess effects.",
          },
        ],
      },
      {
        id: "adverb",
        title: "Adverb",
        flashcards: [
          {
            id: "adverb-1",
            question: "In 'The rate gradually increased over the period,' which word is the adverb and what does it show?",
            answer: "'Gradually' is the adverb. It shows manner — how the increase happened (slowly, steadily).",
          },
          {
            id: "adverb-2",
            question: "Improve this sentence by changing 'really': 'The number of cars really increased.'",
            answer: "'The number of cars increased dramatically.' (Replaces informal 'really' with academic 'dramatically').",
          },
          {
            id: "adverb-3",
            question: "Which adverb fits a Task 1 chart: 'The figure ___ rose in 2015.' (Options: steadily, sharply, gradually)",
            answer: "All can work, but 'sharply' shows a sudden, large change — good for describing dramatic trends.",
          },
          {
            id: "adverb-4",
            question: "What type of adverb is 'Consequently' in: 'Consequently, governments are investing more.'",
            answer: "A sentence adverb (attitude) — it shows the relationship between ideas (cause and effect).",
          },
          {
            id: "adverb-5",
            question: "Replace 'very effective' with a stronger phrase.",
            answer: "'highly effective' or 'extremely effective' — avoids overusing 'very'.",
          },
        ],
      },
      {
        id: "imperative",
        title: "Imperative",
        flashcards: [
          {
            id: "imperative-1",
            question: "Is 'Consider the long‑term consequences' an imperative or not? How can you rewrite it for a formal essay?",
            answer: "Yes, it's an imperative. Rewrite: 'Governments should consider the long-term consequences' or 'It is important to consider the long-term consequences.'",
          },
          {
            id: "imperative-2",
            question: "Rewrite the speaking-style sentence 'Don't ignore this problem' into a formal Task 2 sentence.",
            answer: "'This problem should not be ignored' or 'It is important not to ignore this problem.'",
          },
          {
            id: "imperative-3",
            question: "When are imperatives acceptable in IELTS?",
            answer: "In Speaking (giving advice) — e.g., 'Try to develop good study habits.' Avoid them in Academic Writing.",
          },
          {
            id: "imperative-4",
            question: "Change this imperative to formal writing: 'Ban private cars in city centres.'",
            answer: "'Governments should consider banning private cars in city centres' or 'Private cars should be banned in city centres.'",
          },
          {
            id: "imperative-5",
            question: "Which is better for Task 2: 'Think about the environment' or 'It is important to consider environmental impacts'?",
            answer: "The second — avoids the imperative 'Think' and uses a more formal structure.",
          },
        ],
      },
    ],
  },
  {
    id: "apostrophes",
    title: "Apostrophes",
    subtopics: [
      {
        id: "possessive",
        title: "Possessive apostrophes",
        flashcards: [
          {
            id: "possessive-1",
            question: "Choose the correct form for this IELTS phrase: 'the (workers, workers', worker's) rights' and explain why.",
            answer: "'workers' rights' — plural noun ending in 's' takes apostrophe after the 's' (workers').",
          },
          {
            id: "possessive-2",
            question: "Fix the apostrophe: 'Peoples attitudes to health have changed.'",
            answer: "'People's attitudes to health have changed.' — 'People' is an irregular plural, so it takes 's.",
          },
          {
            id: "possessive-3",
            question: "Which is correct: 'the student's performance' or 'the students' performance'? (Talking about one student)",
            answer: "'the student's performance' — singular possession uses 's.",
          },
          {
            id: "possessive-4",
            question: "Correct: 'governments policies'",
            answer: "'governments' policies' — plural 'governments' ending in 's' takes apostrophe after 's'.",
          },
          {
            id: "possessive-5",
            question: "Fix: 'children education'",
            answer: "'children's education' — irregular plural 'children' takes 's.",
          },
        ],
      },
      {
        id: "contraction",
        title: "Contraction apostrophes",
        flashcards: [
          {
            id: "contraction-1",
            question: "What two words does 'It's' represent in 'It's raining today'?",
            answer: "'It is' — 'It's' is a contraction of 'it is'.",
          },
          {
            id: "contraction-2",
            question: "Change this sentence to a formal Academic style: 'People don't think it's important to recycle.'",
            answer: "'People do not think it is important to recycle.' (Expands contractions to full forms).",
          },
          {
            id: "contraction-3",
            question: "Is 'it's' acceptable in Academic Writing?",
            answer: "No — use 'it is' or 'it has' instead. Contractions are too informal for Academic Writing.",
          },
          {
            id: "contraction-4",
            question: "Expand: 'They can't afford university fees.'",
            answer: "'They cannot afford university fees.' (Expands 'can't' to 'cannot').",
          },
          {
            id: "contraction-5",
            question: "When can you use contractions in IELTS?",
            answer: "In Speaking — contractions are natural in spoken English. Avoid them in Writing.",
          },
        ],
      },
      {
        id: "mistakes",
        title: "Common apostrophe mistakes",
        flashcards: [
          {
            id: "mistakes-1",
            question: "Correct the mistake: 'The 1990's saw rapid growth in internet use.'",
            answer: "'The 1990s saw rapid growth in internet use.' — no apostrophe in plural decades.",
          },
          {
            id: "mistakes-2",
            question: "Which is correct in this sentence and why: 'its education system' or 'it's education system'?",
            answer: "'its education system' — 'its' is possessive (no apostrophe). 'It's' means 'it is'.",
          },
          {
            id: "mistakes-3",
            question: "Fix: 'Researcher's have found a link between diet and health.'",
            answer: "'Researchers have found a link between diet and health.' — no apostrophe in plural 'Researchers'.",
          },
          {
            id: "mistakes-4",
            question: "Correct: 'The government released it's report.'",
            answer: "'The government released its report.' — possessive 'its' has no apostrophe.",
          },
          {
            id: "mistakes-5",
            question: "Why is 'IELT'S' wrong?",
            answer: "Apostrophes are not used in plurals. 'IELTS' is already plural/acronym — no apostrophe needed.",
          },
        ],
      },
    ],
  },
  {
    id: "verb-tenses",
    title: "Verb Tenses",
    subtopics: [
      {
        id: "past",
        title: "Past tenses",
        flashcards: [
          {
            id: "past-1",
            question: "Which tense is used in this Task 1 sentence: 'Car ownership increased significantly between 1990 and 2000'?",
            answer: "Past simple — completed action at a specific time in the past.",
          },
          {
            id: "past-2",
            question: "Rewrite using past perfect: 'By 2010, the population doubled.'",
            answer: "'By 2010, the population had doubled.' — past perfect shows an earlier past before 2010.",
          },
          {
            id: "past-3",
            question: "Identify the tense: 'While internet use was rising, newspaper readership was falling.'",
            answer: "Past continuous — actions in progress at a particular moment in the past.",
          },
          {
            id: "past-4",
            question: "Complete: 'The unemployment rate ___ steadily before the reforms were introduced.' (Use past perfect continuous)",
            answer: "'had been increasing' — emphasises duration before a past point.",
          },
          {
            id: "past-5",
            question: "When do you use past simple vs past perfect in Task 1?",
            answer: "Past simple for completed actions. Past perfect for something that happened before another past event.",
          },
        ],
      },
      {
        id: "present",
        title: "Present tenses",
        flashcards: [
          {
            id: "present-1",
            question: "Choose the best tense: 'The chart (shows / showed / has shown) the main energy sources in 2020.' Explain.",
            answer: "'shows' — present simple for charts with no clear time reference or when describing what the chart currently shows.",
          },
          {
            id: "present-2",
            question: "Identify the tense and meaning: 'Technology has transformed the way people communicate.'",
            answer: "Present perfect — past action ('transformed') with present result (people still communicate differently now).",
          },
          {
            id: "present-3",
            question: "Which tense fits: 'Many countries ___ rapid urbanisation.' (Options: experience / are experiencing)",
            answer: "'are experiencing' — present continuous for temporary/changing situations.",
          },
          {
            id: "present-4",
            question: "Complete: 'Governments ___ heavily in renewable energy.' (Use present perfect continuous)",
            answer: "'have been investing' — action started in past and continues now, emphasising duration.",
          },
          {
            id: "present-5",
            question: "When do you use present simple in Task 2?",
            answer: "For general truths, facts, and opinions — e.g., 'Education plays a vital role in economic development.'",
          },
        ],
      },
      {
        id: "future",
        title: "Future tenses",
        flashcards: [
          {
            id: "future-1",
            question: "Complete the sentence for a prediction: 'The number of cars ____ (continue) to rise in the future.'",
            answer: "'will continue' — future simple for predictions.",
          },
          {
            id: "future-2",
            question: "What tense is 'will have fallen' in this sentence: 'By 2030, emissions will have fallen by half'?",
            answer: "Future perfect — action completed before a future time (2030).",
          },
          {
            id: "future-3",
            question: "Choose: 'The population ___ a peak before 2050.' (Options: will reach / is going to reach)",
            answer: "Both work, but 'is going to reach' shows prediction based on present evidence.",
          },
          {
            id: "future-4",
            question: "Complete: 'In 2030, many people ___ remotely.' (Use future continuous)",
            answer: "'will be working' — future continuous for actions in progress at a future time.",
          },
          {
            id: "future-5",
            question: "When do you use future forms in Task 1?",
            answer: "For projections and predictions — e.g., 'The number is expected to rise by 2030.'",
          },
        ],
      },
      {
        id: "task1",
        title: "Tense choice in Task 1",
        flashcards: [
          {
            id: "task1-1",
            question: "The chart shows data from 1990 to 2010 only. Which tense should you mainly use: present simple or past simple? Why?",
            answer: "Past simple — the data is from the past (1990-2010), so use past tense.",
          },
          {
            id: "task1-2",
            question: "Fill in the gap: 'From 2000 to 2010, the unemployment rate ______ (fall) steadily.' (Write a full Task 1 sentence)",
            answer: "'From 2000 to 2010, the unemployment rate fell steadily.' — past simple for past data.",
          },
          {
            id: "task1-3",
            question: "Which tense for a chart with no dates? 'The chart ___ the proportion of energy sources.'",
            answer: "Present simple — 'The chart shows...' — no time reference means present tense.",
          },
          {
            id: "task1-4",
            question: "Complete: 'By 2030, emissions ___ by half.' (Use future form)",
            answer: "'By 2030, emissions will have fallen by half.' — future perfect for completed action before future time.",
          },
          {
            id: "task1-5",
            question: "What's wrong: 'The number of tourists is increasing between 2000 and 2010.'",
            answer: "Use past tense — 'increased' — because 2000-2010 is in the past.",
          },
        ],
      },
      {
        id: "task2-speaking",
        title: "Tense choice in Task 2 / Speaking",
        flashcards: [
          {
            id: "task2-1",
            question: "Which tense fits better in a Task 2 general statement: 'People (are depending / depend) on cars nowadays'?",
            answer: "'depend' — present simple for general truths and current habits.",
          },
          {
            id: "task2-2",
            question: "Change this Speaking sentence into correct tense: 'I live here for ten years.'",
            answer: "'I have lived here for ten years.' — present perfect for duration up to now.",
          },
          {
            id: "task2-3",
            question: "Which tense for Speaking Part 2 (telling a story about the past)?",
            answer: "Past simple and past continuous — e.g., 'I was studying when I heard the news.'",
          },
          {
            id: "task2-4",
            question: "Complete for Task 2: 'If governments invest in public transport, traffic jams ____ decrease.'",
            answer: "'will decrease' — first conditional for real future possibility.",
          },
          {
            id: "task2-5",
            question: "What tense for Speaking Part 3 predictions?",
            answer: "Future forms — 'will', 'may', 'is likely to' — e.g., 'Technology will continue to evolve.'",
          },
        ],
      },
    ],
  },
  {
    id: "subject-verb-agreement",
    title: "Subject–Verb Agreement",
    subtopics: [
      {
        id: "singular",
        title: "Singular SVA",
        flashcards: [
          {
            id: "sva-singular-1",
            question: "Choose the correct verb: 'The government (play / plays) an important role.'",
            answer: "'plays' — singular subject ('government') needs singular verb with 's'.",
          },
          {
            id: "sva-singular-2",
            question: "Fix: 'This chart show changes in population.'",
            answer: "'This chart shows changes in population.' — singular 'chart' needs 'shows'.",
          },
          {
            id: "sva-singular-3",
            question: "Which is correct: 'He work part-time' or 'He works part-time'?",
            answer: "'He works part-time' — he/she/it + verb-s.",
          },
          {
            id: "sva-singular-4",
            question: "Complete: 'The proportion of students ___ (prefer) studying abroad.'",
            answer: "'prefers' — singular subject ('proportion') needs singular verb.",
          },
          {
            id: "sva-singular-5",
            question: "What's wrong: 'Many students prefers to study abroad.'",
            answer: "'prefer' — plural subject ('students') needs base verb (no 's').",
          },
        ],
      },
      {
        id: "plural-patterns",
        title: "Plural SVA & tricky patterns",
        flashcards: [
          {
            id: "sva-plural-1",
            question: "Choose: 'Many students (prefer / prefers) studying abroad.'",
            answer: "'prefer' — plural subject needs base verb.",
          },
          {
            id: "sva-plural-2",
            question: "What verb for: 'The internet and mobile phones ___ changed communication.'",
            answer: "'have' — subjects joined by 'and' are usually plural.",
          },
          {
            id: "sva-plural-3",
            question: "Complete: 'Either the teacher or the students ___ responsible.'",
            answer: "'are' — verb agrees with closest subject ('students' — plural).",
          },
          {
            id: "sva-plural-4",
            question: "Fix: 'There is several reasons for this problem.'",
            answer: "'There are several reasons for this problem.' — plural noun ('reasons') needs 'are'.",
          },
          {
            id: "sva-plural-5",
            question: "Which verb: 'Either the students or the teacher ___ responsible.'",
            answer: "'is' — verb agrees with closest subject ('teacher' — singular).",
          },
        ],
      },
      {
        id: "conditionals",
        title: "Conditionals",
        flashcards: [
          {
            id: "conditional-1",
            question: "Complete: 'If people eat too much fast food, they ___ weight.' (Zero conditional)",
            answer: "'gain' — zero conditional: If + present simple, present simple (general truth).",
          },
          {
            id: "conditional-2",
            question: "Complete: 'If governments invest in public transport, traffic jams ____ decrease.' (First conditional)",
            answer: "'will decrease' — first conditional: If + present simple, will + verb.",
          },
          {
            id: "conditional-3",
            question: "Complete: 'If I had more free time, I ____ study English every day.' (Second conditional)",
            answer: "'would study' — second conditional: If + past simple, would + verb.",
          },
          {
            id: "conditional-4",
            question: "Complete: 'If the government had invested earlier, unemployment ____ fallen.' (Third conditional)",
            answer: "'would have fallen' — third conditional: If + had + V3, would have + V3.",
          },
          {
            id: "conditional-5",
            question: "Identify: 'If I had studied harder at school, I would have a better job now.'",
            answer: "Mixed conditional — past cause ('had studied') with present result ('would have').",
          },
        ],
      },
      {
        id: "word-order",
        title: "Word order",
        flashcards: [
          {
            id: "wordorder-1",
            question: "Fix the word order: 'Went I yesterday to campus.'",
            answer: "'I went to campus yesterday.' — Subject + Verb + Object + Time.",
          },
          {
            id: "wordorder-2",
            question: "What's the pattern for statements?",
            answer: "Subject + Verb + Object + (Place) + (Time) — e.g., 'She studies English at night.'",
          },
          {
            id: "wordorder-3",
            question: "Complete: 'Do you ___ in Jakarta?' (Yes/No question)",
            answer: "'live' — pattern: Auxiliary + Subject + Verb.",
          },
          {
            id: "wordorder-4",
            question: "Fix: 'Have finished you your homework?'",
            answer: "'Have you finished your homework?' — Auxiliary + Subject + Verb.",
          },
          {
            id: "wordorder-5",
            question: "What's wrong: 'Where you live?'",
            answer: "Missing auxiliary — should be 'Where do you live?' (Question word + Auxiliary + Subject + Verb).",
          },
        ],
      },
    ],
  },
  {
    id: "punctuation",
    title: "Punctuation",
    subtopics: [
      {
        id: "commas",
        title: "Commas",
        flashcards: [
          {
            id: "comma-1",
            question: "Add commas: 'Students need time motivation and good resources to succeed.'",
            answer: "'Students need time, motivation, and good resources to succeed.' — commas separate list items.",
          },
          {
            id: "comma-2",
            question: "Fix: 'Firstly governments should invest more in education.'",
            answer: "'Firstly, governments should invest more in education.' — comma after linking word at start.",
          },
          {
            id: "comma-3",
            question: "Add comma: 'Public transport is cheap but it is often crowded.'",
            answer: "'Public transport is cheap, but it is often crowded.' — comma before 'but' joining two sentences.",
          },
          {
            id: "comma-4",
            question: "Which needs a comma: 'However this solution may be too expensive.'",
            answer: "'However, this solution may be too expensive.' — comma after 'However' at the beginning.",
          },
          {
            id: "comma-5",
            question: "Fix: 'The government should prioritise three areas education healthcare and public transport.'",
            answer: "'The government should prioritise three areas: education, healthcare, and public transport.' — colon before list, commas in list.",
          },
        ],
      },
      {
        id: "colons-semicolons",
        title: "Colons and semicolons",
        flashcards: [
          {
            id: "colon-1",
            question: "Add punctuation: 'The government should prioritise three areas education healthcare and public transport.'",
            answer: "'The government should prioritise three areas: education, healthcare, and public transport.' — colon before list.",
          },
          {
            id: "colon-2",
            question: "Join with semicolon: 'Traffic is a serious problem. Many people spend hours commuting every day.'",
            answer: "'Traffic is a serious problem; many people spend hours commuting every day.' — semicolon joins related sentences.",
          },
          {
            id: "colon-3",
            question: "When do you use a colon?",
            answer: "Before an explanation or list — e.g., 'There is one main reason: cost.'",
          },
          {
            id: "colon-4",
            question: "When do you use a semicolon?",
            answer: "To join two closely related complete sentences — shows connection between ideas.",
          },
          {
            id: "colon-5",
            question: "Are colons and semicolons required for Band 7?",
            answer: "No, but correct use shows wider grammatical range and can help your score.",
          },
        ],
      },
      {
        id: "quotes-dashes",
        title: "Quotation marks and dashes",
        flashcards: [
          {
            id: "quotes-1",
            question: "Add quotation marks: 'Some experts argue that education is the key to success.'",
            answer: "'Some experts argue that 'education is the key to success'.' — quotation marks for exact words.",
          },
          {
            id: "quotes-2",
            question: "When do you use quotation marks in Task 2?",
            answer: "Occasionally — for someone's exact words or special terms. Don't overuse them.",
          },
          {
            id: "quotes-3",
            question: "Add dash: 'The results were surprising almost 80% preferred online learning.'",
            answer: "'The results were surprising — almost 80% preferred online learning.' — dash adds extra information.",
          },
          {
            id: "quotes-4",
            question: "Should you use dashes in IELTS Writing?",
            answer: "Optional — if not confident, use a full stop or comma instead.",
          },
          {
            id: "quotes-5",
            question: "Fix: 'The so-called sharing economy has changed tourism.' (Add quotation marks if needed)",
            answer: "'The so-called \"sharing economy\" has changed tourism.' — quotation marks for special term.",
          },
        ],
      },
    ],
  },
  {
    id: "sentence-structure",
    title: "Sentence Structure",
    subtopics: [
      {
        id: "active-passive",
        title: "Active and passive voice",
        flashcards: [
          {
            id: "voice-1",
            question: "Identify: 'The government increased taxes.' (Active or passive?)",
            answer: "Active — subject ('government') does the action ('increased').",
          },
          {
            id: "voice-2",
            question: "Change to passive: 'The government increased taxes.'",
            answer: "'Taxes were increased by the government.' — passive: subject receives action.",
          },
          {
            id: "voice-3",
            question: "When is passive voice useful in Task 1?",
            answer: "In process diagrams or reports when the action is more important than who does it.",
          },
          {
            id: "voice-4",
            question: "Change to active: 'Taxes were increased by the government.'",
            answer: "'The government increased taxes.' — active: subject does action.",
          },
          {
            id: "voice-5",
            question: "Which is better for Task 1 process: 'Workers produce goods' or 'Goods are produced'?",
            answer: "Both work, but 'Goods are produced' (passive) focuses on the process, common in Task 1.",
          },
        ],
      },
      {
        id: "simple-compound-complex",
        title: "Simple, compound, and complex sentences",
        flashcards: [
          {
            id: "sentence-1",
            question: "Identify: 'Many students study abroad.' (Simple, compound, or complex?)",
            answer: "Simple — one independent clause (one complete idea).",
          },
          {
            id: "sentence-2",
            question: "Join with 'but': 'Many students study abroad. Studying overseas can be expensive.'",
            answer: "'Many students study abroad, but studying overseas can be expensive.' — compound sentence.",
          },
          {
            id: "sentence-3",
            question: "Join with 'because': 'People are healthier. They have better access to medical care.'",
            answer: "'People are healthier because they have better access to medical care.' — complex sentence.",
          },
          {
            id: "sentence-4",
            question: "Join with 'although': 'Studying abroad is expensive. Many students believe it is worth the cost.'",
            answer: "'Although studying abroad is expensive, many students believe it is worth the cost.' — complex sentence.",
          },
          {
            id: "sentence-5",
            question: "What sentence types should Band 7+ candidates use?",
            answer: "A mix of simple, compound, and complex sentences — shows grammatical range.",
          },
        ],
      },
    ],
  },
];

/** Get all flashcards for a topic */
export function getFlashcardsByTopic(topicId: string): Flashcard[] {
  const topic = FLASHCARD_TOPICS.find((t) => t.id === topicId);
  if (!topic) return [];
  return topic.subtopics.flatMap((st) => st.flashcards);
}

/** Get flashcards for a subtopic */
export function getFlashcardsBySubtopic(
  topicId: string,
  subtopicId: string
): Flashcard[] {
  const topic = FLASHCARD_TOPICS.find((t) => t.id === topicId);
  if (!topic) return [];
  const subtopic = topic.subtopics.find((st) => st.id === subtopicId);
  return subtopic?.flashcards ?? [];
}

/** Get all topics */
export function getAllFlashcardTopics(): FlashcardTopic[] {
  return FLASHCARD_TOPICS;
}
