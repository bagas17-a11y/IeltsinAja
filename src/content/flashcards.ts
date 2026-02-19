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
  {
    id: "relative-clauses",
    title: "Relative Clauses",
    subtopics: [
      {
        id: "rc-basics",
        title: "Relative clause basics",
        flashcards: [
          {
            id: "rc-basics-1",
            question: "Underline the relative clause and name the noun it describes: 'Many students who want better facilities study abroad.'",
            answer: "Relative clause: 'who want better facilities'. It describes the noun 'students'.",
          },
          {
            id: "rc-basics-2",
            question: "Does this sentence contain a relative clause? 'Many students study abroad for better facilities.' Explain.",
            answer: "No. There is no relative pronoun (who, which, that, etc.) introducing a clause. 'for better facilities' is a prepositional phrase.",
          },
          {
            id: "rc-basics-3",
            question: "Why is this version better for IELTS? a) 'Many students study abroad. They want better facilities.' b) 'Many students who want better facilities study abroad.'",
            answer: "b) is better. It combines ideas into one complex sentence with a relative clause, which shows grammatical range and helps your band score.",
          },
          {
            id: "rc-basics-4",
            question: "In 'The university that I attended offers many courses,' what does the relative clause describe?",
            answer: "The relative clause 'that I attended' describes the noun 'university'.",
          },
          {
            id: "rc-basics-5",
            question: "Identify the relative clause and the noun: 'Public transport, which is often crowded, is still cheaper than driving.'",
            answer: "Relative clause: 'which is often crowded'. It describes 'Public transport'.",
          },
        ],
      },
      {
        id: "defining",
        title: "Defining relative clauses",
        flashcards: [
          {
            id: "defining-1",
            question: "Join the sentences with a defining relative clause: 'The people live in cities. They often face higher living costs.'",
            answer: "'People who live in cities often face higher living costs.' (Defining — no commas; essential information.)",
          },
          {
            id: "defining-2",
            question: "Which sentence is correct for a defining clause and why? a) 'The city which I live in has heavy traffic.' b) 'The city, which I live in, has heavy traffic.'",
            answer: "a) is correct. Defining clauses have no commas. The comma version (b) suggests non-defining (extra info).",
          },
          {
            id: "defining-3",
            question: "In 'Students who study regularly often get higher scores,' is the information in the clause essential or extra? Explain.",
            answer: "Essential. It defines which students we mean (those who study regularly). Without it, we lose the meaning.",
          },
          {
            id: "defining-4",
            question: "Join with a defining clause: 'The course was very helpful. I took it last year.'",
            answer: "'The course (that) I took last year was very helpful.' — we can omit 'that' when it is the object.",
          },
          {
            id: "defining-5",
            question: "Why are there no commas in: 'The teacher who teaches us IELTS is very experienced'?",
            answer: "Defining clause — we need it to know which teacher. Without it, the sentence would be incomplete.",
          },
        ],
      },
      {
        id: "non-defining",
        title: "Non-defining relative clauses",
        flashcards: [
          {
            id: "nondef-1",
            question: "Add commas if needed: 'My brother who lives in Australia is preparing for IELTS.' (Non-defining)",
            answer: "'My brother, who lives in Australia, is preparing for IELTS.' — commas needed for non-defining (extra info).",
          },
          {
            id: "nondef-2",
            question: "Change this to add extra information: 'Public transport is still cheaper than driving. It is often crowded.' (Use a non-defining clause.)",
            answer: "'Public transport, which is often crowded, is still cheaper than driving.' — non-defining with commas.",
          },
          {
            id: "nondef-3",
            question: "Can we use 'that' in this sentence: 'Public transport, that is often crowded, is still cheaper than driving'? Correct it.",
            answer: "No. We cannot use 'that' in non-defining clauses. Correct: 'Public transport, which is often crowded, is still cheaper than driving.'",
          },
          {
            id: "nondef-4",
            question: "Add commas: 'Jakarta which is the capital of Indonesia has very bad traffic.' (Non-defining)",
            answer: "'Jakarta, which is the capital of Indonesia, has very bad traffic.'",
          },
          {
            id: "nondef-5",
            question: "Explain the difference: 'My brother who lives in Australia is a teacher' vs 'My brother, who lives in Australia, is a teacher.'",
            answer: "First (no commas): I have more than one brother; this one lives in Australia. Second (commas): I have one brother; he lives in Australia (extra info).",
          },
        ],
      },
      {
        id: "pronouns",
        title: "Relative pronouns (who/which/that/where/when/whose)",
        flashcards: [
          {
            id: "pron-rc-1",
            question: "Choose the best word: 'People ____ live in big cities often face high living costs.' (who / which / where)",
            answer: "'who' — refers to people ('People'). 'Which' is for things; 'where' is for places.",
          },
          {
            id: "pron-rc-2",
            question: "Complete: 'A period ____ many people lost their jobs was the financial crisis.' (when / where / which)",
            answer: "'when' — refers to time ('period').",
          },
          {
            id: "pron-rc-3",
            question: "Fix: 'The country who population is ageing faces new challenges.' (Use 'whose'.)",
            answer: "'The country whose population is ageing faces new challenges.' — 'whose' shows possession.",
          },
          {
            id: "pron-rc-4",
            question: "Choose: 'The university ____ I study has a large library.' (who / which / where)",
            answer: "'where' — refers to a place ('university' as a location).",
          },
          {
            id: "pron-rc-5",
            question: "Choose: 'The student ____ essay won the prize is from Indonesia.' (who / whose / which)",
            answer: "'whose' — shows possession (the student's essay).",
          },
        ],
      },
      {
        id: "ielts-sentences",
        title: "Relative clauses in IELTS sentences",
        flashcards: [
          {
            id: "ielts-rc-1",
            question: "Combine: 'The government introduced a new policy. The new policy aims to reduce pollution.'",
            answer: "'The government introduced a new policy which aims to reduce pollution.' — avoids repeating 'the new policy'.",
          },
          {
            id: "ielts-rc-2",
            question: "Improve with a relative clause: 'The university is popular. It offers high-quality facilities.'",
            answer: "'The university, which offers high-quality facilities, is popular.' — or: 'The university that offers high-quality facilities is popular.'",
          },
          {
            id: "ielts-rc-3",
            question: "Is this correct? 'The city which the traffic is heavy is unhealthy.' If not, rewrite.",
            answer: "Wrong. Correct: 'The city where traffic is heavy is unhealthy.' or 'The city in which traffic is heavy is unhealthy.' — use 'where' or 'in which' for place.",
          },
          {
            id: "ielts-rc-4",
            question: "Avoid repetition: 'The chart shows data. The data was collected in 2020.'",
            answer: "'The chart shows data which was collected in 2020.' — relative clause replaces the second 'The data'.",
          },
          {
            id: "ielts-rc-5",
            question: "Fix: 'The country that the population is growing faces housing shortages.'",
            answer: "'The country whose population is growing faces housing shortages.' — use 'whose' for possession (the country's population).",
          },
        ],
      },
    ],
  },
  {
    id: "linking-words-coherence",
    title: "Linking Words, Referencing & Coherence",
    subtopics: [
      {
        id: "linkers",
        title: "Linking words – addition, contrast, result, example, sequence",
        flashcards: [
          {
            id: "linkers-1",
            question: "Choose the best linker: 'Many people own cars; ______, public transport is still crowded.' (however / for example / firstly)",
            answer: "'however' — shows contrast (cars are common yet public transport is still crowded).",
          },
          {
            id: "linkers-2",
            question: "Fill the gap: 'Firstly, governments should invest more in education. ______, they should improve healthcare systems.' (In addition / However)",
            answer: "'In addition' — adds another idea; we are not contrasting.",
          },
          {
            id: "linkers-3",
            question: "Which linker shows contrast: 'moreover', 'however', or 'for example'?",
            answer: "'However' — contrast. 'Moreover' = addition; 'for example' = example.",
          },
          {
            id: "linkers-4",
            question: "Choose: 'Traffic causes pollution. ______, it wastes time.' (Therefore / Moreover / However)",
            answer: "'Moreover' — we are adding another negative effect, not showing cause–result.",
          },
          {
            id: "linkers-5",
            question: "Which linker shows result? 'because', 'therefore', or 'although'?",
            answer: "'Therefore' — shows result. 'Because' = cause; 'although' = contrast.",
          },
        ],
      },
      {
        id: "overuse",
        title: "Over-use and misuse of linkers",
        flashcards: [
          {
            id: "overuse-1",
            question: "What is wrong with: 'So, therefore, governments should, like, spend more on education.'? Rewrite.",
            answer: "'So' and 'therefore' together are redundant; 'like' is informal. Better: 'Therefore, governments should spend more on education.'",
          },
          {
            id: "overuse-2",
            question: "Improve: 'And people use cars a lot. And this causes pollution. And the air quality is bad.'",
            answer: "'People use cars a lot, which causes pollution and worsens air quality.' — use fewer linkers and vary structure.",
          },
          {
            id: "overuse-3",
            question: "Is 'plus' suitable for Academic Writing? What should you use instead?",
            answer: "No. Use 'moreover', 'in addition', or 'furthermore' instead.",
          },
          {
            id: "overuse-4",
            question: "What is wrong: 'Firstly, I will discuss benefits. Firstly, I will look at problems. Firstly, I will give my opinion.'",
            answer: "'Firstly' is repeated. Use 'Firstly', 'Secondly', 'Finally' (or 'Furthermore', 'In addition').",
          },
          {
            id: "overuse-5",
            question: "Replace informal linkers: 'People like technology. And so on, it helps education.'",
            answer: "'People like technology. Furthermore, it helps education.' — avoid 'and so on'; use formal linkers.",
          },
        ],
      },
      {
        id: "referencing",
        title: "Referencing – pronouns and this/these",
        flashcards: [
          {
            id: "ref-1",
            question: "Replace the second 'the government' with a pronoun: 'The government increased taxes because the government needed more money.'",
            answer: "'The government increased taxes because it needed more money.' — use 'it' to avoid repetition.",
          },
          {
            id: "ref-2",
            question: "In 'The shops closed early. This made it difficult to buy food,' what does 'This' refer to?",
            answer: "'This' refers to the whole idea: 'The shops closed early.'",
          },
          {
            id: "ref-3",
            question: "Correct: 'People are very busy. This make traffic worse.'",
            answer: "'People are very busy. This makes traffic worse.' — 'This' is singular, so use 'makes'.",
          },
          {
            id: "ref-4",
            question: "Replace repeated noun: 'I prefer the blue jacket, but my friend likes the red jacket.'",
            answer: "'I prefer the blue jacket, but my friend likes the red one.' — use 'one' to substitute.",
          },
          {
            id: "ref-5",
            question: "Fix unclear reference: 'Technology and education are important. It helps students.' (What does 'it' mean?)",
            answer: "'Technology and education are important. Technology helps students.' or '...Education helps students.' — make the pronoun refer clearly to one noun.",
          },
        ],
      },
      {
        id: "paragraph-flow",
        title: "Paragraph flow (topic sentence + support)",
        flashcards: [
          {
            id: "flow-1",
            question: "Which is the best topic sentence for a paragraph about traffic problems? a) 'Cars are big.' b) 'Traffic congestion is a major problem in many cities.' c) 'I drive to work.'",
            answer: "b) — clear, general statement that introduces the main idea. The others are too vague or too personal.",
          },
          {
            id: "flow-2",
            question: "Put in order (1, 2, 3): ___ Many people spend hours commuting. ___ Traffic congestion is a serious issue. ___ Therefore, governments should invest in public transport.",
            answer: "2, 1, 3 — topic sentence first, then support, then conclusion/link.",
          },
          {
            id: "flow-3",
            question: "What should follow a topic sentence?",
            answer: "Supporting ideas — examples, reasons, or evidence — with linking words.",
          },
          {
            id: "flow-4",
            question: "Identify the topic sentence: 'Pollution affects health. Factories release chemicals. Cars produce exhaust. Therefore, air quality has declined.'",
            answer: "'Pollution affects health.' — it states the main idea; the rest supports it.",
          },
          {
            id: "flow-5",
            question: "Which sentence best follows: 'Education plays a vital role in society.'? a) 'I went to school.' b) 'For example, educated people tend to earn more.'",
            answer: "b) — gives an example that supports the topic sentence. a) is too personal.",
          },
        ],
      },
      {
        id: "mini-cohesion",
        title: "Mini cohesion checks",
        flashcards: [
          {
            id: "cohesion-1",
            question: "Which linking word is overused? 'Firstly, I think education is important. Firstly, it helps people find jobs. Firstly, it improves society.' Rewrite one sentence.",
            answer: "'Firstly' is overused. Rewrite: 'Furthermore, it helps people find jobs.' or 'Secondly, it helps people find jobs.'",
          },
          {
            id: "cohesion-2",
            question: "Find the unclear pronoun: 'The government increased taxes. Companies reduced staff. This caused problems.' What does 'This' mean?",
            answer: "'This' could mean taxes, staff cuts, or both. Fix: 'These changes caused problems.' or specify: 'The tax increase caused problems.'",
          },
          {
            id: "cohesion-3",
            question: "Check this paragraph: 'People use cars. So pollution rises. So health gets worse.' Improve.",
            answer: "'People use cars, which causes pollution to rise. As a result, public health deteriorates.' — vary linkers and structure.",
          },
          {
            id: "cohesion-4",
            question: "Is the reference clear? 'Education and healthcare are important. It receives too little funding.'",
            answer: "No. 'It' is unclear — education or healthcare? Specify: 'Healthcare receives too little funding.'",
          },
          {
            id: "cohesion-5",
            question: "Spot the cohesion problem: 'Governments should act. Governments have the power. Governments can change laws.'",
            answer: "'Governments' is repeated too often. Use pronouns: 'Governments should act. They have the power and can change laws.'",
          },
        ],
      },
    ],
  },
  {
    id: "collocations-paraphrasing",
    title: "Collocations & Paraphrasing",
    subtopics: [
      {
        id: "basic-collocations",
        title: "Basic collocations",
        flashcards: [
          {
            id: "coll-1",
            question: "Choose the best collocation: '______ a decision' (do / make)",
            answer: "'make a decision' — 'make' collocates with 'decision'. 'Do a decision' is wrong.",
          },
          {
            id: "coll-2",
            question: "Fill the gap: 'The government should ______ a new policy to reduce pollution.' (make / create / introduce)",
            answer: "'introduce' — 'introduce a policy' is the most natural collocation in this context.",
          },
          {
            id: "coll-3",
            question: "Complete: 'The study ______ the conclusion that exercise improves health.' (achieved / reached / got)",
            answer: "'reached' — we 'reach a conclusion', not 'achieve' or 'get'.",
          },
          {
            id: "coll-4",
            question: "Choose: '______ awareness about climate change' (raise / grow / increase)",
            answer: "'raise awareness' — the correct collocation. 'Increase awareness' is possible but 'raise' is more common.",
          },
          {
            id: "coll-5",
            question: "Complete: 'Technology ______ a vital role in education.' (does / plays / makes)",
            answer: "'plays' — 'play a vital role' is the correct collocation.",
          },
        ],
      },
      {
        id: "academic-collocations",
        title: "Academic collocations for IELTS",
        flashcards: [
          {
            id: "acad-1",
            question: "Complete: 'play a ______ role in society.' (important / vital / tiny — which is most natural in IELTS?)",
            answer: "'vital' — 'play a vital role' is a strong academic collocation. 'Important' works but 'vital' is more precise.",
          },
          {
            id: "acad-2",
            question: "Which collocation is better in an essay: 'big problem' or 'serious problem'? Why?",
            answer: "'serious problem' — more formal and academic. 'Big' is informal.",
          },
          {
            id: "acad-3",
            question: "Complete: 'There was a ______ increase in online sales.' (significant / big / huge)",
            answer: "'significant' — academic and precise. 'Big' and 'huge' are too informal.",
          },
          {
            id: "acad-4",
            question: "Choose: 'The government should ______ the problem of housing shortages.' (address / talk / say)",
            answer: "'address' — 'address a problem' is a formal collocation. 'Talk' and 'say' don't collocate well here.",
          },
          {
            id: "acad-5",
            question: "Complete: 'traffic ______' (congestion / jam / problem)",
            answer: "'traffic congestion' — noun + noun collocation. 'Traffic jam' is fine but 'congestion' is more formal.",
          },
        ],
      },
      {
        id: "wrong-collocations",
        title: "Spotting wrong collocations",
        flashcards: [
          {
            id: "wrong-1",
            question: "Correct: 'People do a decision based on salary.'",
            answer: "'People make a decision based on salary.' — 'make a decision', not 'do'.",
          },
          {
            id: "wrong-2",
            question: "What is wrong in 'achieve a conclusion'? Give a better collocation.",
            answer: "We 'reach a conclusion', not 'achieve'. 'Achieve' collocates with goals, success, etc.",
          },
          {
            id: "wrong-3",
            question: "Fix: 'There was a strong down in sales last year.' (Use 'drop'.)",
            answer: "'There was a sharp drop in sales last year.' — 'sharp drop' or 'significant drop', not 'strong down'.",
          },
          {
            id: "wrong-4",
            question: "Correct: 'The research did a survey of 500 people.'",
            answer: "'The research conducted a survey of 500 people.' or 'The researchers conducted a survey...' — 'conduct research/survey'.",
          },
          {
            id: "wrong-5",
            question: "Fix: 'Education has a big impact on society.'",
            answer: "'Education has a significant impact on society.' — 'significant impact' is more academic than 'big impact'.",
          },
        ],
      },
      {
        id: "simple-paraphrasing",
        title: "Simple paraphrasing – synonyms & word form",
        flashcards: [
          {
            id: "parap-1",
            question: "Paraphrase by changing the verb: 'The chart shows the number of car owners.' (Use 'illustrates'.)",
            answer: "'The chart illustrates the number of car owners.' — 'illustrates' is a synonym for 'shows'.",
          },
          {
            id: "parap-2",
            question: "Change verb to noun: 'People migrated to cities' → 'There was an increase in ______ to cities.'",
            answer: "'migration' — change 'migrated' (verb) to 'migration' (noun).",
          },
          {
            id: "parap-3",
            question: "Choose the best synonym for 'important' in a Task 2 introduction: 'crucial', 'funny', or 'crowded'?",
            answer: "'crucial' — same meaning, formal. 'Funny' and 'crowded' have different meanings.",
          },
          {
            id: "parap-4",
            question: "Paraphrase: 'The graph displays a rise in pollution.' (Change 'displays' and 'rise'.)",
            answer: "'The graph presents an increase in pollution.' — synonyms: display→present, rise→increase.",
          },
          {
            id: "parap-5",
            question: "Change to noun form: 'People consume more energy' → 'Energy ______ has increased.'",
            answer: "'consumption' — verb 'consume' → noun 'consumption'.",
          },
        ],
      },
      {
        id: "whole-sentences",
        title: "Paraphrasing whole sentences",
        flashcards: [
          {
            id: "whole-1",
            question: "Paraphrase: 'The government should ban private cars in city centres.' (Keep meaning, use different structure.)",
            answer: "'Private cars should be banned in city centres by the government.' — passive voice, same meaning.",
          },
          {
            id: "whole-2",
            question: "Change to passive: 'People use the internet for shopping more than ever before.'",
            answer: "'The internet is used for shopping more than ever before (by people).'",
          },
          {
            id: "whole-3",
            question: "Is this paraphrase acceptable? Original: 'The chart shows the main energy sources in 2020.' New: 'The chart illustrates the primary sources of energy in 2020.'",
            answer: "Yes. Same meaning: shows→illustrates, main→primary, energy sources→sources of energy. Good paraphrase.",
          },
          {
            id: "whole-4",
            question: "Paraphrase: 'Many people believe that technology improves education.'",
            answer: "'Technology is believed by many to improve education.' (passive) or 'It is widely believed that technology improves education.'",
          },
          {
            id: "whole-5",
            question: "Rewrite with different structure: 'The number of cars increased between 2010 and 2020.'",
            answer: "'Between 2010 and 2020, there was an increase in the number of cars.' — different word order and 'increase' as noun.",
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
