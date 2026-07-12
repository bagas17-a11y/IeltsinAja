import { useState, useEffect, useCallback, useRef } from "react";
import { createPortal } from "react-dom";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import {
  ChevronDown, CheckCircle2, Circle, Clock, ArrowRight,
  Crown, BookOpen, Headphones, PenTool, Mic, Brain,
  Home, ChevronRight, Target, Sparkles, Trophy, Lock,
  X, Maximize2, PlayCircle, ExternalLink, Newspaper, ClipboardList, FileDown,
} from "lucide-react";

import { buildWhatsAppLink } from "@/lib/contact";
import {
  Breadcrumb, BreadcrumbItem, BreadcrumbLink,
  BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { cn } from "@/lib/utils";

// ─────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────
interface VocabExample {
  label: string;
  sentence: string;
}

interface VocabItem {
  term: string;
  replaces?: string;
  why?: string;
  pattern?: string;
  mistake?: string;
  practice?: string;
  workedExample?: string[];
  examples: VocabExample[];
}

interface WorksheetPrompt {
  id: string;
  label: string;
  instruction: string;
  type?: "mcq" | "fill" | "open";
  options?: string[];   // MCQ: option texts; labeled A B C D automatically
  sentence?: string;   // fill/mcq: the sentence with ______ shown in a styled block
  rows: number;
  placeholder?: string;
  sectionHeader?: string;
}

export interface StudyTask {
  id: string;
  label: string;
  description: string;
  resourcePath?: string;
  resourceLabel?: string;
  minutes: number;
  vocabList?: VocabItem[];
  sourceUrl?: string;
  sourceType?: "video" | "article";
  worksheetPrompts?: WorksheetPrompt[];
  relatedSources?: ExternalResource[];  // inline sources shown at top of worksheet
}

interface ExternalResource {
  label: string;
  url: string;
  type: "video" | "article";
}

export interface StudyWeek {
  week: number;
  theme: string;
  focus: string;
  color: "blue" | "green" | "purple" | "amber" | "red";
  rationale: string;
  tasks: StudyTask[];
  weeklyTheme?: string;
  externalResources?: ExternalResource[];
}

export interface TierPlan {
  tier: "Foundation" | "Developing" | "Polishing";
  bandRange: string;
  targetBand: string;
  headline: string;
  description: string;
  color: string;
  weeks: StudyWeek[];
}

// ─────────────────────────────────────────────
// External source worksheet prompt banks
// ─────────────────────────────────────────────

const WEEK1_NOTES_PROMPTS: WorksheetPrompt[] = [
  {
    id: "main-arg",
    label: "Main Argument",
    instruction: "In 1–2 sentences, what is the author's central argument or the main idea of this source?",
    rows: 3,
    placeholder: "The author argues that…",
  },
  {
    id: "evidence",
    label: "Evidence & Examples",
    instruction: "What evidence, statistics, or examples does the author use to support the argument?",
    rows: 3,
    placeholder: "For example, the author mentions…",
  },
  {
    id: "collocation",
    label: "New Collocation or Phrase",
    instruction: "Write down one new collocation or academic phrase you found in this source. Then use it in your own sentence about a different topic.",
    rows: 3,
    placeholder: "Collocation: '…'\nMy sentence: …",
  },
  {
    id: "opinion",
    label: "Your Opinion",
    instruction: "Do you agree or disagree with the main argument? Write 2–3 sentences explaining your position and giving at least one reason.",
    rows: 4,
    placeholder: "I agree / disagree with the argument because…",
  },
];

const WEEK2_ARGUMENT_PROMPTS: WorksheetPrompt[] = [
  {
    id: "q1-response",
    label: "Q1 — Written Response (150–200 words)",
    instruction: "Write a 150–200 word response that includes: (a) Summary of the main argument, (b) Evidence used, (c) Your personal opinion on the argument (and reason).",
    rows: 9,
    placeholder: "Summary of main argument:\n\nEvidence used:\n\nMy personal opinion (and reason):",
  },
  {
    id: "q2-peel",
    label: "Q2 — PEEL Counter-Argument (100 words)",
    instruction: "Pick one argument from the source and write a 100 word paragraph defending the opposite side, following the PEEL structure.",
    rows: 7,
    placeholder: "Point:\nEvidence:\nExplanation:\nLink:",
  },
  {
    id: "q3a-stance",
    label: "What is the author's exact stance?",
    sectionHeader: "Rapid Fire Questions",
    instruction: "Are they entirely supporting the idea or are they presenting it with reservations?",
    rows: 3,
    placeholder: "The author is… because…",
  },
  {
    id: "q3b-transitions",
    label: "3 Transition Words / Cohesive Devices",
    instruction: "List 3 transition words or cohesive devices the author used to move between ideas.",
    rows: 4,
    placeholder: "1.\n2.\n3.",
  },
  {
    id: "q3c-collocations",
    label: "3 Complex Phrases / Collocations",
    instruction: "Find 3 complex phrases or collocations and use each of them to write a different sentence about the weekly theme (3 total).",
    rows: 6,
    placeholder: "1. Phrase: '…'\n   Sentence: …\n2. Phrase: '…'\n   Sentence: …\n3. Phrase: '…'\n   Sentence: …",
  },
];

const WEEK3_COMPREHENSION_PROMPTS: WorksheetPrompt[] = [
  {
    id: "q1-recording-notes",
    label: "Q1 — 2-Minute Voice Recording",
    instruction: "Make a 2 minute voice recording that includes: Summary of the main argument, Evidence used, Your personal opinion. Use this space to note key points before recording.",
    rows: 5,
    placeholder: "Main argument:\nEvidence:\nMy opinion:",
  },
  {
    id: "q2-paraphrase",
    label: "Q2 — 3 Central Concepts (Original + Restated)",
    instruction: "Select 3 central concepts from the material and write down exactly how it was presented in the text/video. Restate the exact same thing in a different way, using synonyms or paraphrasing.",
    rows: 8,
    placeholder: "Concept 1:\n  Original: '…'\n  Restated: …\n\nConcept 2:\n  Original: '…'\n  Restated: …\n\nConcept 3:\n  Original: '…'\n  Restated: …",
  },
  {
    id: "q3a-vocab",
    label: "3 Unknown Words — Guess from Context",
    sectionHeader: "Rapid Fire Questions",
    instruction: "Find 3 words which you did not know the definition of immediately. Based only on the surrounding context clues, write down your best guess of its definition.",
    rows: 5,
    placeholder: "1. Word: '…' → My guess: …\n2. Word: '…' → My guess: …\n3. Word: '…' → My guess: …",
  },
  {
    id: "q3b-pronouns",
    label: "3 Relative Pronouns — Identify the Noun",
    instruction: "Find 3 instances of the use of relative pronouns ('that', 'which', 'those', etc.) and state the noun or idea that these words are referring to.",
    rows: 6,
    placeholder: "1. Sentence: '…'\n   '…' refers to: …\n2. Sentence: '…'\n   '…' refers to: …\n3. Sentence: '…'\n   '…' refers to: …",
  },
];

const WEEK_POLISHING1_IDIOM_PROMPTS: WorksheetPrompt[] = [
  {
    id: "p1-idiom-spoken",
    label: "Idiomatic Expressions — Spoken Practice",
    instruction: "Using the Idiomatic Expressions from the Vocabulary Bank (Revision Notes → Vocabulary Passages), formulate 3 different spoken sentences drawing on information from this source. Each sentence must use a different idiom and reference a specific idea from what you read or watched.",
    rows: 9,
    placeholder: "Idiom 1: e.g. 'a double-edged sword'\nSentence: …\n\nIdiom 2: e.g. 'at the forefront of'\nSentence: …\n\nIdiom 3: e.g. 'pave the way for'\nSentence: …",
  },
];

const WEEK_POLISHING2_PRECISION_PROMPTS: WorksheetPrompt[] = [
  {
    id: "p2-transitory",
    label: "Transitory Phrases — Paragraph Identification",
    instruction: "From this source, identify 2 paragraphs or points where a Transitory Phrase from the Vocabulary Bank would strengthen the transition. Write the original idea and then a sentence using the transitory phrase.",
    rows: 7,
    placeholder: "Point 1 (from source): '…'\nUsing transitory phrase: '…'\n\nPoint 2 (from source): '…'\nUsing transitory phrase: '…'",
  },
  {
    id: "p2-data-descriptors",
    label: "Band 8 Data Descriptor Synonyms",
    sectionHeader: "Data Descriptors",
    instruction: "Select 2 facts, trends, or statistics from this source. For each, write a new sentence using a Band 8 synonym from the Data Descriptors section of the Vocabulary Bank (e.g. replace 'went up a lot' with 'surged' or 'escalated sharply').",
    rows: 6,
    placeholder: "Fact 1 (original phrasing): '…'\nUpgraded sentence: '…'\n\nFact 2 (original phrasing): '…'\nUpgraded sentence: '…'",
  },
];

const WEEK_POLISHING3_SOPHISTICATION_PROMPTS: WorksheetPrompt[] = [
  {
    id: "p3-collocation-rewrite",
    label: "Collocation Rewrite",
    instruction: "Select 3 facts or claims from this source. Using the topic-specific collocations from Section 2 of the Collocations & Paraphrasing revision note, rewrite each fact with at least one Band 8 collocation that fits the topic naturally.",
    rows: 9,
    placeholder: "Fact 1 (original): '…'\nRewritten with collocation: '…'\n\nFact 2 (original): '…'\nRewritten with collocation: '…'\n\nFact 3 (original): '…'\nRewritten with collocation: '…'",
  },
];

const WEEK_POLISHING_IDIOM_WORKSHEET: WorksheetPrompt[] = [
  {
    id: "idiom-mcq-1",
    sectionHeader: "Section 1 — Multiple Choice",
    label: "Q1",
    instruction: "Which idiom best completes the sentence?",
    sentence: '"The widespread adoption of smartphones has been ______ for education — it connects students to information instantly but also fuels distraction."',
    type: "mcq",
    options: [
      "A double-edged sword",
      "A turning point",
      "Paving the way for change",
      "At the forefront of innovation",
    ],
    rows: 1,
  },
  {
    id: "idiom-mcq-2",
    label: "Q2",
    instruction: 'Which sentence uses "at the forefront of" correctly?',
    type: "mcq",
    options: [
      "Scientists are at the forefront of despite the challenges.",
      "Renewable energy is at the forefront of climate policy debates.",
      "The government is at the forefront of, raising questions.",
      "Education at the forefront of students.",
    ],
    rows: 1,
  },
  {
    id: "idiom-mcq-3",
    label: "Q3",
    instruction: "Which pair of idioms correctly completes the sentence?",
    sentence: '"Although social media provides instant news, it may ______ misinformation at ______ accuracy."',
    type: "mcq",
    options: [
      "pave the way for / the expense of",
      "gain ground / a turning point",
      "shed light on / the forefront of",
      "keep pace with / the expense of",
    ],
    rows: 1,
  },
  {
    id: "idiom-mcq-4",
    label: "Q4",
    instruction: "Which idiom best fills the blank?",
    sentence: '"Governments are struggling to ______ rapid technological change, as new platforms emerge faster than regulations can address them."',
    type: "mcq",
    options: [
      "shed light on",
      "keep pace with",
      "take precedence over",
      "gain ground against",
    ],
    rows: 1,
  },
  {
    id: "idiom-fill-5",
    sectionHeader: "Section 2 — Fill in the Blanks",
    label: "Q5",
    instruction: 'Fill in the blank. Clue: the idiom means "opened a new path toward" or "made possible".',
    sentence: '"Research into drought-resistant crops has ______ new possibilities for sustainable agriculture in water-scarce regions."',
    type: "fill",
    rows: 1,
    placeholder: "Your answer…",
  },
  {
    id: "idiom-fill-6",
    label: "Q6",
    instruction: 'Fill in the blank. The idiom means "has two contrasting effects — one positive, one negative".',
    sentence: '"The rise of AI in education is ______ — it personalises learning but risks undermining critical thinking skills."',
    type: "fill",
    rows: 1,
    placeholder: "Your answer…",
  },
  {
    id: "idiom-fill-7",
    label: "Q7",
    instruction: 'Fill in the blank. The idiom means "should be considered more important than".',
    sentence: '"Environmental concerns must ______ short-term economic interests if lasting ecological damage is to be avoided."',
    type: "fill",
    rows: 1,
    placeholder: "Your answer…",
  },
  {
    id: "idiom-open-8",
    sectionHeader: "Section 3 — Open Ended",
    label: "Q8",
    instruction: 'Using the idiom "a turning point", write 2–3 sentences about how a specific technology from this week\'s sources changed society. Reference a specific detail from what you read or watched.',
    type: "open",
    rows: 4,
    placeholder: "The development of … was a turning point because…",
  },
  {
    id: "idiom-open-9",
    label: "Q9",
    instruction: "Choose one idiom from the Vocabulary Bank. Write a PEEL paragraph (4–5 sentences) on AI in education. The idiom must appear naturally in your Explanation or Link — not forced into the Point.",
    type: "open",
    rows: 7,
    placeholder: "Point:\nEvidence:\nExplanation: …\nLink:",
  },
  {
    id: "idiom-open-10",
    label: "Q10",
    instruction: "Across all six sources this week (environment, technology, education), choose the topic you think makes the strongest IELTS Task 2 essay. In 3–4 sentences, outline your argument and use at least two idioms naturally.",
    type: "open",
    rows: 6,
    placeholder: "The strongest topic is … because…\n\nKey argument:\n\nIdioms used: …",
  },
];

const WEEK_POLISHING_TRANSITORY_WORKSHEET: WorksheetPrompt[] = [
  {
    id: "trans-mcq-1",
    sectionHeader: "Section 1 — Multiple Choice",
    label: "Q1",
    instruction: "Which transitory phrase introduces a contrasting idea?",
    type: "mcq",
    options: ["Furthermore", "For instance", "Nevertheless", "As a result"],
    rows: 1,
  },
  {
    id: "trans-mcq-2",
    label: "Q2",
    instruction: "Which data descriptor best describes a trend reaching its highest point?",
    sentence: '"The crime rate ______ in 2019, reaching its highest level in two decades."',
    type: "mcq",
    options: ["levelled off", "peaked at a record high", "plummeted", "narrowed significantly"],
    rows: 1,
  },
  {
    id: "trans-mcq-3",
    label: "Q3",
    instruction: "Which data descriptor describes a sharp increase?",
    sentence: '"Inflation ______ following supply chain disruptions, causing widespread economic concern."',
    type: "mcq",
    options: ["declined steadily", "remained relatively stable", "surged", "levelled off at a moderate rate"],
    rows: 1,
  },
  {
    id: "trans-mcq-4",
    label: "Q4",
    instruction: "Which sentence uses a transitory phrase incorrectly?",
    type: "mcq",
    options: [
      "Furthermore, the government introduced new regulations to combat organised crime.",
      "However, crime rates fell significantly after the programme launched.",
      "As a result, inflation rose. Nevertheless, this caused prices to climb further.",
      "Consequently, stricter sentencing led to fewer repeat offences.",
    ],
    rows: 1,
  },
  {
    id: "trans-mcq-5",
    label: "Q5",
    instruction: "Which descriptor correctly shows inequality decreasing over time?",
    sentence: '"The gap between high and low income earners ______ during periods of sustained economic growth."',
    type: "mcq",
    options: ["surged", "narrowed", "escalated sharply", "peaked at"],
    rows: 1,
  },
  {
    id: "trans-fill-6",
    sectionHeader: "Section 2 — Fill in the Blanks",
    label: "Q6",
    instruction: 'Fill in the blank with a hedging transitory phrase (e.g. "Arguably" or "It could be argued that").',
    sentence: '"______, organised crime thrives in environments where economic inequality is high, though this relationship is complex."',
    type: "fill",
    rows: 1,
    placeholder: "Your answer…",
  },
  {
    id: "trans-fill-7",
    label: "Q7",
    instruction: "Fill in the blank with a data descriptor for a sharp, sustained rise.",
    sentence: '"Obesity rates have ______ over the past three decades, climbing from 15% to over 40% in some regions."',
    type: "fill",
    rows: 1,
    placeholder: "Your answer…",
  },
  {
    id: "trans-fill-8",
    label: "Q8",
    instruction: "Fill in both blanks — one data descriptor for the trend, one cause-effect transitory phrase.",
    sentence: '"Unemployment ______; ______ the government introduced emergency welfare measures to support affected households."',
    type: "fill",
    rows: 2,
    placeholder: "Blank 1: …     Blank 2: …",
  },
  {
    id: "trans-fill-9",
    label: "Q9",
    instruction: "Fill in the blank with a data descriptor for a sudden, sharp decline.",
    sentence: '"Public trust in media ______ following a series of high-profile misinformation cases — it has yet to recover to pre-2016 levels."',
    type: "fill",
    rows: 1,
    placeholder: "Your answer…",
  },
  {
    id: "trans-fill-10",
    label: "Q10",
    instruction: "Fill in both blanks to show a two-stage trend: first rising sharply, then stabilising.",
    sentence: '"Exercise habits ______ during the pandemic home-workout boom, then ______ once gyms fully reopened."',
    type: "fill",
    rows: 2,
    placeholder: "Blank 1: …     Blank 2: …",
  },
  {
    id: "trans-open-11",
    sectionHeader: "Section 3 — Open Ended",
    label: "Q11",
    instruction: "Write 3 sentences on any topic from this week's sources (crime, economy, or lifestyle). Each must use a different transitory phrase: one Adding an idea, one Contrasting, one Cause & effect.",
    type: "open",
    rows: 6,
    placeholder: "Adding an idea: …\nContrasting: …\nCause & effect: …",
  },
  {
    id: "trans-open-12",
    label: "Q12",
    instruction: "Select a statistic or trend from any source this week. Write it first in Band 6 language, then rewrite it as Band 8 using a precise data descriptor from the Vocabulary Bank.",
    type: "open",
    rows: 5,
    placeholder: "Original: '…'\nBand 6: …\nBand 8 (with data descriptor): …",
  },
  {
    id: "trans-open-13",
    label: "Q13",
    instruction: "Write a 4–5 sentence PEEL paragraph on crime and punishment. Include at least 2 transitory phrases from different categories and 1 data descriptor.",
    type: "open",
    rows: 8,
    placeholder: "Point:\nEvidence (with data descriptor): …\nExplanation (transitory phrase): …\nLink (contrasting phrase): …",
  },
  {
    id: "trans-open-14",
    label: "Q14",
    instruction: "From this week's lifestyle/health sources, identify one trend that changed over time. Write (a) a Task 1-style summary sentence using a data descriptor, then (b) an analysis sentence using a hedging transitory phrase.",
    type: "open",
    rows: 5,
    placeholder: "(a) Summary: …\n(b) Analysis (hedging): …",
  },
  {
    id: "trans-open-15",
    label: "Q15",
    instruction: 'Why is it important to hedge academic claims? Write 3–4 sentences using "it could be argued that" and "arguably" in context. Support your point with evidence from any source you read this week.',
    type: "open",
    rows: 6,
    placeholder: "Arguably, … It could be argued that … because…",
  },
];

const WEEK_POLISHING_COLLOCATION_WORKSHEET: WorksheetPrompt[] = [
  {
    id: "colloc-mcq-1",
    sectionHeader: "Section 1 — Multiple Choice",
    label: "Q1",
    instruction: "Which sentence uses an academic collocation correctly?",
    type: "mcq",
    options: [
      "The government did inequality by launching new programmes.",
      "Social media companies work to erode public trust by removing fact-checkers.",
      "Chronic disease imposes a significant burden on national healthcare systems.",
      "Exercise makes your brain do better in terms of thinking.",
    ],
    rows: 1,
  },
  {
    id: "colloc-mcq-2",
    label: "Q2",
    instruction: "Which option uses a Health & Medicine collocation most precisely?",
    sentence: '"Recent studies suggest that physical inactivity ______."',
    type: "mcq",
    options: [
      "does bad things to overall health",
      "imposes a significant burden on cardiovascular health",
      "makes health worse over a long time",
      "gives people more health-related problems",
    ],
    rows: 1,
  },
  {
    id: "colloc-mcq-3",
    label: "Q3",
    instruction: "Which sentence correctly uses a Media & Public Opinion collocation?",
    type: "mcq",
    options: [
      "Social media has the ability to change what people think about politics.",
      "Misinformation on social media platforms can shape public perception of political events.",
      "News on the internet is now making people think differently.",
      "The media tells people what to think through its stories.",
    ],
    rows: 1,
  },
  {
    id: "colloc-fill-4",
    sectionHeader: "Section 2 — Fill in the Blanks",
    label: "Q4",
    instruction: "Fill in both blanks using Health & Medicine collocations from the revision note.",
    sentence: '"Governments must ______ healthcare inequalities if they hope to ______ chronic disease effectively in underserved communities."',
    type: "fill",
    rows: 2,
    placeholder: "Blank 1: …     Blank 2: …",
  },
  {
    id: "colloc-fill-5",
    label: "Q5",
    instruction: "Fill in the blank with a Media & Public Opinion collocation about the effect of misinformation.",
    sentence: '"The spread of unverified claims on social media has begun to ______ in democratic societies."',
    type: "fill",
    rows: 1,
    placeholder: "Your answer…",
  },
  {
    id: "colloc-fill-6",
    label: "Q6",
    instruction: "Fill in the blank with a Government & Politics collocation meaning to assign or direct funding.",
    sentence: '"The housing crisis has prompted calls for governments to ______ more resources to affordable housing schemes."',
    type: "fill",
    rows: 1,
    placeholder: "Your answer…",
  },
  {
    id: "colloc-fill-7",
    label: "Q7",
    instruction: "Fill in the blank with a Media & Public Opinion collocation meaning to give greater reach to underheard perspectives.",
    sentence: '"A free press can ______ by reporting on issues that powerful institutions would prefer to suppress."',
    type: "fill",
    rows: 1,
    placeholder: "Your answer…",
  },
  {
    id: "colloc-open-8",
    sectionHeader: "Section 3 — Open Ended",
    label: "Q8",
    instruction: "From this week's health sources, choose one specific fact. Rewrite it using at least two Health & Medicine collocations. Briefly explain why your rewrite is more precise.",
    type: "open",
    rows: 6,
    placeholder: "Original fact: '…'\nRewritten: '…'\nWhy more precise: …",
  },
  {
    id: "colloc-open-9",
    label: "Q9",
    instruction: "Write a mini-paragraph (3–4 sentences) on media and misinformation. Include at least two Media & Public Opinion collocations. Note the collocations you used at the end.",
    type: "open",
    rows: 7,
    placeholder: "Paragraph:\n\nCollocations used:\n1. …\n2. …",
  },
  {
    id: "colloc-open-10",
    label: "Q10",
    instruction: '"Affordable housing is one of the most pressing issues facing governments today." Write a 5-sentence PEEL paragraph agreeing or disagreeing. Include at least one Government & Politics collocation and one Media & Public Opinion collocation.',
    type: "open",
    rows: 9,
    placeholder: "Point:\nEvidence:\nExplanation (Government collocation): …\nExplanation continued (Media collocation): …\nLink:",
  },
];

// ─────────────────────────────────────────────
// Curriculum Data
// ─────────────────────────────────────────────
const FOUNDATION_PLAN: TierPlan = {
  tier: "Foundation",
  bandRange: "4.0–5.5",
  targetBand: "6.0–6.5",
  headline: "Build from the ground up",
  description: "Your English foundations need strengthening before IELTS technique layers on top. This 4-week plan starts with grammar essentials, then moves into exam strategy and full module practice. Every week adds one brick.",
  color: "blue",
  weeks: [
    {
      week: 1, theme: "Grammar — Tenses & Agreement", focus: "Grammar",
      color: "blue",
      weeklyTheme: "Technology",
      rationale: "Tense consistency and subject-verb agreement are the two most penalised grammar errors at Band 4–5. Fixing these first gives every sentence you write a reliable structure before you layer in exam technique.",
      tasks: [
        {
          id: "f-w1-t1", label: "Day 1: Revision Notes — Verb Tenses (Parts 1–5 + Mini Practice)",
          description: "Work through all five parts of the Verb Tenses notes covering present, past, future, perfect, and continuous tenses. Complete the mini practice at the end to check your understanding.",
          resourcePath: "/dashboard/revision-notes?topic=verb-tenses", resourceLabel: "Open Verb Tenses", minutes: 45,
        },
        {
          id: "f-w1-t2", label: "Day 2: Revision Notes — Subject-Verb Agreement (All Parts + Mini Practice)",
          description: "Study all parts including singular/plural subjects, special patterns (there is/are, subjects joined by 'and'), and the mini practice. Pay attention to collective nouns like 'government' and 'number of'.",
          resourcePath: "/dashboard/revision-notes?topic=subject-verb-agreement", resourceLabel: "Open SVA Notes", minutes: 40,
        },
        {
          id: "f-w1-t3", label: "Day 3: Vocabulary Expansion",
          description: "Read all of this week's external resources (Technology theme). Note down any new words, look up their collocations, and write one sentence using each.",
          minutes: 30,
        },
        {
          id: "f-w1-t4", label: "Day 4: Worksheet — Verb Tenses & Subject-Verb Agreement",
          description: "Open the revision notes for each topic and complete the worksheets at the bottom of the page. Verb Tenses worksheet has 3 parts: tense correction, tense choice, and write-your-own. SVA worksheet has 2 parts: fix the error, and choose the correct verb.",
          resourcePath: "/dashboard/revision-notes?topic=verb-tenses",
          resourceLabel: "Open Verb Tenses Worksheet",
          minutes: 40,
        },
      ],
      externalResources: [
        { label: "Electric Cars", url: "https://english-online.at/news-articles/business-economy/ford-to-invest-11-billion-in-electric-cars.htm", type: "article" },
        { label: "Robot Teachers", url: "https://learnenglish.britishcouncil.org/free-resources/reading/b1/robot-teachers", type: "article" },
        { label: "AI and Health", url: "https://newsinlevels.com/products/screens-and-ai-toys-hurt-children-level-3/", type: "article" },
        { label: "Technology and Health", url: "https://youtu.be/2FZEznNC-Fs?si=MLZJwqXKzIIblxVt", type: "video" },
        { label: "AI and the Future", url: "https://youtu.be/-T__YWoq45I?si=s5NFNTBqV0qu74nU", type: "video" },
      ],
    },
    {
      week: 2, theme: "Grammar — Articles & Sentence Structures", focus: "Grammar",
      color: "purple",
      weeklyTheme: "Health",
      rationale: "Articles (a/an/the) are the most systematic Band 4–5 error in writing. Sentence structure variety is required to reach Band 6. Adding conjunctions and linking words directly addresses two of the four IELTS Writing criteria.",
      tasks: [
        {
          id: "f-w2-t1", label: "Day 1: Revision Notes — Articles (All Parts + Mini Practice)",
          description: "Work through all parts covering when to use a/an, the, or no article. Complete the mini practice — focus especially on uncountable nouns and general statements ('Education is important' vs 'The education system…').",
          resourcePath: "/dashboard/revision-notes?topic=articles", resourceLabel: "Open Articles Notes", minutes: 40,
        },
        {
          id: "f-w2-t2", label: "Day 2: Revision Notes — Sentence Structure & Conjunctions",
          description: "Read through the Sentence Structure notes focusing on compound and complex sentences. Pay attention to the 'See: Coordinating/Subordinating Conjunctions' links within those notes.",
          resourcePath: "/dashboard/revision-notes?topic=sentence-structure", resourceLabel: "Open Sentence Structure", minutes: 35,
        },
        {
          id: "f-w2-t3", label: "Day 3: Revision Notes — Linking Words, Referencing & Coherence",
          description: "Study coordinating conjunctions (FANBOYS) and subordinating conjunctions. Practise writing 3 compound sentences and 3 complex sentences using different conjunctions from the tables.",
          resourcePath: "/dashboard/revision-notes?topic=linking-words-coherence", resourceLabel: "Open Linking Words", minutes: 35,
        },
        {
          id: "f-w2-t4", label: "Day 4: Vocabulary Expansion",
          description: "Read all of this week's external resources (Health theme). For each article or video, write a 2–3 sentence summary using at least one linking word from your notes.",
          minutes: 30,
        },
        {
          id: "f-w2-t5", label: "Day 5: Worksheet — Articles & Sentence Structures",
          description: "Open the revision notes for each topic and complete the worksheets at the bottom of the page. Articles worksheet has 2 parts: gap-fill and error spotting. Linking Words worksheet has 2 parts: joining sentences with conjunctions and fixing conjunction errors.",
          resourcePath: "/dashboard/revision-notes?topic=articles",
          resourceLabel: "Open Articles Worksheet",
          minutes: 45,
        },
      ],
      externalResources: [
        { label: "Going to the Doctor", url: "https://lingua.com/english/reading/doctor/", type: "article" },
        { label: "Health & Lifestyle", url: "https://learningenglish.voanews.com/a/how-physical-therapists-can-prevent-future-health-problems/7921334.html", type: "article" },
        { label: "Exercise and Health", url: "https://learnenglish.britishcouncil.org/free-resources/general/magazine-zone/yoga", type: "article" },
        { label: "Mental Health", url: "https://youtu.be/R4B9BPBiIHo?si=dRmfnVDHUdIIwJvq", type: "video" },
        { label: "Personal Health", url: "https://youtu.be/iNyUmbmQQZg?si=8tbpIGJrvt0qSQfc", type: "video" },
      ],
    },
    {
      week: 3, theme: "Exam Strategy", focus: "Exam Strategy",
      color: "amber",
      weeklyTheme: "Careers",
      rationale: "By Week 3 you have strong grammar foundations. Now you shift to understanding the exam format for all four modules and start practising them. Seeing the test format removes fear and lets you apply your grammar knowledge strategically.",
      tasks: [
        {
          id: "f-w3-t1", label: "Day 1: Revision Notes — Verb Tenses, Part 6",
          description: "Return to the Verb Tenses notes and complete Part 6, which covers the most advanced tense patterns. This builds directly on Week 1 and prepares you for complex sentences in Writing and Speaking.",
          resourcePath: "/dashboard/revision-notes?topic=verb-tenses", resourceLabel: "Open Verb Tenses", minutes: 30,
        },
        {
          id: "f-w3-t2", label: "Day 2: MudahinAja — How to Answer Each Module",
          description: "Open MudahinAja and go through the interactive tutorials for Writing, Listening, Reading, and Speaking. Learn the strategies for each module — structure, timing, and what the examiner expects.",
          resourcePath: "/dashboard/elite?tab=mudahinaja", resourceLabel: "Open MudahinAja", minutes: 30,
        },
        {
          id: "f-w3-t3", label: "Day 3: Module Practice — Listening",
          description: "Complete one full Listening test. Use the pre-reading strategy: read the questions before the audio plays. Write your answers during the audio, not after.",
          resourcePath: "/dashboard/listening", resourceLabel: "Open Listening Module", minutes: 40,
        },
        {
          id: "f-w3-t4", label: "Day 4: Module Practice — Reading",
          description: "Complete one full Reading test. Focus on identifying the question type first (True/False/Not Given, matching headings, etc.) before searching for the answer.",
          resourcePath: "/dashboard/reading", resourceLabel: "Open Reading Module", minutes: 60,
        },
        {
          id: "f-w3-t5", label: "Day 5: Module Practice — Writing",
          description: "Attempt one Writing task (Task 1 or Task 2). Don't aim for perfection — focus on applying correct grammar from Weeks 1–2 and using linking words from your notes.",
          resourcePath: "/dashboard/writing", resourceLabel: "Open Writing Module", minutes: 40,
        },
        {
          id: "f-w3-t6", label: "Day 6: Module Practice — Speaking",
          description: "Complete a full Speaking session covering Parts 1, 2, and 3. Focus on answer length — Part 1: 2–4 sentences, Part 2: at least 90 seconds, Part 3: 3–4 sentences with reasons.",
          resourcePath: "/dashboard/speaking", resourceLabel: "Open Speaking Module", minutes: 30,
        },
      ],
      externalResources: [
        { label: "AI and Careers", url: "https://www.bbc.com/news/articles/ceqdrw2yy3vo", type: "article" },
        { label: "Work from Home", url: "https://youtu.be/03V6p7EZ6G8?si=2dC35HT3bg0zhQus", type: "video" },
        { label: "Work-Life Balance", url: "https://youtu.be/4c_xYLwOx-g?si=dT4LMsRoWE9GSzwe", type: "video" },
        { label: "Job Satisfaction", url: "https://youtu.be/PYJ22-YYNW8?si=rUALJfjN0ULFIcX2", type: "video" },
        { label: "Freelancers", url: "https://www.bbc.com/news/uk-england-bristol-63483597", type: "article" },
      ],
    },
    {
      week: 4, theme: "Exam Integration", focus: "Exam Practice",
      color: "green",
      weeklyTheme: "Environment",
      rationale: "Week 4 is full exam integration — all four modules under realistic conditions. You are not learning new grammar; you are applying everything from Weeks 1–3 at once. Use this week to identify which module still needs the most attention.",
      tasks: [
        {
          id: "f-w4-t1", label: "Day 1: Full Module Practice — Listening",
          description: "Complete one full Listening test under timed conditions. After finishing, review every error and ask: was it a mishearing (strategy) or a spelling/grammar error (knowledge)?",
          resourcePath: "/dashboard/listening", resourceLabel: "Open Listening Module", minutes: 40,
        },
        {
          id: "f-w4-t2", label: "Day 2: Full Module Practice — Reading",
          description: "Complete one full Reading test under timed conditions. After finishing, review errors and note whether they came from misreading the question, rushing, or vocabulary gaps.",
          resourcePath: "/dashboard/reading", resourceLabel: "Open Reading Module", minutes: 60,
        },
        {
          id: "f-w4-t3", label: "Day 3: Full Module Practice — Writing",
          description: "Attempt both Task 1 and Task 2 in a single session. Use the grammar rules from Weeks 1–2. After the AI feedback, identify the one grammar category you still need to improve.",
          resourcePath: "/dashboard/writing", resourceLabel: "Open Writing Module", minutes: 60,
        },
        {
          id: "f-w4-t4", label: "Day 4: Full Module Practice — Speaking",
          description: "Complete a full Speaking session. Record yourself for Part 2. Listen back and count how many times you correctly used a linking word or complex sentence.",
          resourcePath: "/dashboard/speaking", resourceLabel: "Open Speaking Module", minutes: 30,
        },
        {
          id: "f-w4-t5", label: "Day 5: Reflection — Plan Your Next Step",
          description: "After all four modules, rank them from strongest to weakest. Return to the revision notes for your weakest grammar area and do one more mini practice. Set a clear goal for the next study cycle.",
          minutes: 20,
        },
      ],
      externalResources: [
        { label: "Recycling", url: "https://english-online.at/news-articles/environment/coca-cola-to-recycle-all-packaging-by-2030.htm", type: "article" },
        { label: "Renewable Energy", url: "https://youtu.be/RnvCbquYeIM?si=6Ido2p5vqqjSd8iE", type: "video" },
        { label: "Plastic Pollution", url: "https://youtu.be/qdxEG-3GRVs?si=IzQEBRfq3mh1qSLi", type: "video" },
        { label: "Solutions to Pollution", url: "https://www.dcceew.gov.au/environment/protection/npi/reducing-pollution", type: "article" },
        { label: "Endangered Species", url: "https://www.bbc.com/news/articles/cn4g41n9j4lo", type: "article" },
      ],
    },
  ],
};

const DEVELOPING_PLAN: TierPlan = {
  tier: "Developing",
  bandRange: "5.5–6.5",
  targetBand: "7.0–7.5",
  headline: "Bridge the Band 7 gap",
  description: "You can produce coherent English but your arguments need depth, your vocabulary needs precision, and you are likely keyword-hunting rather than understanding the full argument in passages. This 4-week plan targets the exact habits that keep students at Band 6: underdeveloped arguments, memorised phrases, and minimal use of conditionals and complex clauses.",
  color: "purple",
  weeks: [
    {
      week: 1,
      theme: "Exam Format & Writing Skills Review",
      focus: "Writing",
      color: "blue",
      weeklyTheme: "Travel",
      rationale: "Before developing argument depth, you need a solid foundation in the writing skills that support it. Week 1 covers all four module formats via MudahinAja, then dives into the four writing skills most critical for Band 7: PEEL paragraph structure, linking words and coherence, text types, and hedging. Alongside this, you read one travel-themed source per day to build vocabulary and engagement.",
      tasks: [
        {
          id: "d-w1-t2",
          label: "Day 1: Revision Notes — Paragraph Structuring, The PEEL Blueprint",
          description: "Read through the full PEEL notes. This is a new framework: every body paragraph must have a Point (your argument), Evidence (one strong example), Explanation (2–4 sentences analysing what the evidence proves), and a Link back to the question. Most Band 6 essays have Point and Evidence but a weak or missing Explanation — that is the Band 7 gap. Complete the mini practice at the end.",
          resourcePath: "/dashboard/revision-notes?topic=paragraph-structuring",
          resourceLabel: "Open PEEL Notes",
          minutes: 35,
        },
        {
          id: "d-w1-t3",
          label: "Day 2: Revision Notes — Linking Words, Referencing & Coherence",
          description: "Review the coordinating and subordinating conjunctions sections carefully. Focus on comma placement rules and the difference between coordinating conjunctions (joining equal clauses) and subordinating conjunctions (making one clause dependent). Complete the worksheet at the bottom of the page.",
          resourcePath: "/dashboard/revision-notes?topic=linking-words-coherence",
          resourceLabel: "Open Linking Words Notes",
          minutes: 30,
        },
        {
          id: "d-w1-t4",
          label: "Day 2: Revision Notes — Text Types",
          description: "Work through the Text Types notes. Understand the differences between formal and informal registers, and between report, essay, letter, and general writing styles. Pay particular attention to the formal academic register — this is what IELTS Academic Writing Task 1 and Task 2 both require.",
          resourcePath: "/dashboard/revision-notes?topic=text-types",
          resourceLabel: "Open Text Types Notes",
          minutes: 25,
        },
        {
          id: "d-w1-t5",
          label: "Day 3: Revision Notes — Hedging & Formal Academic Style",
          description: "Study hedging language — modals (may, might, could), adverbs (arguably, generally, typically), and reporting structures (It has been suggested that…). Hedging is required in academic writing to avoid overgeneralisation and shows the examiner you understand how academic arguments work. Complete the mini practice.",
          resourcePath: "/dashboard/revision-notes?topic=hedging-formal-style",
          resourceLabel: "Open Hedging Notes",
          minutes: 30,
        },
        { id: "d-w1-src1", label: "Day 4: Adventurous Travelling", description: "Read the article, then open the worksheet below to complete your notes.", sourceUrl: "https://www.bbc.com/travel/article/20260604-why-travellers-are-choosing-holidays-that-hurt", sourceType: "article", minutes: 20, worksheetPrompts: WEEK1_NOTES_PROMPTS },
        { id: "d-w1-src2", label: "Day 4: Sustainable Travelling", description: "Watch the video, then open the worksheet below to complete your notes.", sourceUrl: "https://youtu.be/we6VG3kdkOA?si=8hdIj7g3auqsOiRr", sourceType: "video", minutes: 20, worksheetPrompts: WEEK1_NOTES_PROMPTS },
        { id: "d-w1-src3", label: "Day 5: Tourism and Climate Change", description: "Watch the video, then open the worksheet below to complete your notes.", sourceUrl: "https://youtu.be/cZ8fw2F_E8Y?si=mFGhPQSxgKnuwL7l", sourceType: "video", minutes: 20, worksheetPrompts: WEEK1_NOTES_PROMPTS },
        { id: "d-w1-src4", label: "Day 6: Travel Airlines", description: "Read the article, then open the worksheet below to complete your notes.", sourceUrl: "https://edition.cnn.com/2026/05/01/travel/passengers-need-to-know-spirit-airlines", sourceType: "article", minutes: 20, worksheetPrompts: WEEK1_NOTES_PROMPTS },
        { id: "d-w1-src5", label: "Day 7: Reasons to Travel", description: "Read the article, then open the worksheet below to complete your notes.", sourceUrl: "https://www.nationalgeographic.com/travel/article/why-travel-should-be-considered-an-essential-human-activity", sourceType: "article", minutes: 20, worksheetPrompts: WEEK1_NOTES_PROMPTS },
      ],
    },
    {
      week: 2,
      theme: "Argument Development",
      focus: "Writing",
      color: "purple",
      weeklyTheme: "Society",
      rationale: "Band 6 arguments are often underdeveloped: a point is made, one piece of evidence is dropped, and the paragraph ends. Band 7 requires a full chain — point → reason → evidence → explanation → link back. This week you practise that chain every single day using real-world sources. Complete each day's worksheet before moving to the next source. End the week with a full writing and speaking submission.",
      tasks: [
        { id: "d-w2-src1", label: "Day 1: Chinese Urbanization", description: "Read the article, then open the worksheet to complete all 5 questions.", sourceUrl: "https://www.bbc.com/news/world-asia-pacific-13799997", sourceType: "article", minutes: 35, worksheetPrompts: WEEK2_ARGUMENT_PROMPTS },
        { id: "d-w2-src2", label: "Day 2: Solutions to Housing Shortages", description: "Read the article, then open the worksheet to complete all 5 questions.", sourceUrl: "https://edition.cnn.com/2026/06/04/business/mamdani-housing-new-york-city", sourceType: "article", minutes: 35, worksheetPrompts: WEEK2_ARGUMENT_PROMPTS },
        { id: "d-w2-src3", label: "Day 3: Gender Roles in Modern Society", description: "Read the article, then open the worksheet to complete all 5 questions.", sourceUrl: "https://www.oneworldeducation.org/our-students-writing/gender-roles-in-modern-society/", sourceType: "article", minutes: 35, worksheetPrompts: WEEK2_ARGUMENT_PROMPTS },
        { id: "d-w2-src4", label: "Day 4: Food Addiction", description: "Watch the video, then open the worksheet to complete all 5 questions.", sourceUrl: "https://youtu.be/J_03EXyhYS8?si=LlVhd0mtPPIqpyy2", sourceType: "video", minutes: 35, worksheetPrompts: WEEK2_ARGUMENT_PROMPTS },
        { id: "d-w2-src5", label: "Day 5: Inequality", description: "Watch the video, then open the worksheet to complete all 5 questions.", sourceUrl: "https://youtu.be/rEnf_CFoyv0?si=iy6kg2G94YgFzdGJ", sourceType: "video", minutes: 35, worksheetPrompts: WEEK2_ARGUMENT_PROMPTS },
        {
          id: "d-w2-mudahinaja-speaking",
          label: "Day 6: MudahinAja — Read the Speaking Module",
          description: "Open MudahinAja and work through the Speaking module tutorial. Study how to structure your Part 2 long turn and how to expand answers in Part 3 with reasons and examples. Take notes on any phrases or strategies you want to apply in this week's Speaking practice.",
          resourcePath: "/dashboard/elite?tab=mudahinaja&module=speaking",
          resourceLabel: "Open MudahinAja Speaking",
          minutes: 30,
        },
        {
          id: "d-w2-mudahinaja-writing",
          label: "Day 6: MudahinAja — Read the Writing Module",
          description: "Open MudahinAja and work through the Writing module tutorial. Focus on the Task 2 argument structure guidance and compare it against your PEEL practice from Week 1. Note any new strategies for introductions, topic sentences, and conclusions.",
          resourcePath: "/dashboard/elite?tab=mudahinaja&module=writing",
          resourceLabel: "Open MudahinAja Writing",
          minutes: 30,
        },
        {
          id: "d-w2-hw1",
          label: "Day 7: End-of-Week — 1 Writing Question",
          description: "Attempt one full Writing Task 2. Choose a topic related to any Society source you read this week. Apply PEEL structure to both body paragraphs. Check: is your Explanation the longest section of each paragraph (2–4 sentences)?",
          resourcePath: "/dashboard/writing",
          resourceLabel: "Open Writing Module",
          minutes: 45,
        },
        {
          id: "d-w2-hw2",
          label: "Day 7: End-of-Week — 1 Speaking Question",
          description: "Complete one full Speaking session. In Part 3, use at least one argument from this week's sources as supporting evidence. Screenshot your score.",
          resourcePath: "/dashboard/speaking",
          resourceLabel: "Open Speaking Module",
          minutes: 30,
        },
        {
          id: "d-w2-hw3",
          label: "Day 7: Submit Scores to Group Chat",
          description: "Screenshot your Writing and Speaking scores and share them in the group chat. Your tutor will review and flag which aspect of argument development needs the most attention in Week 3.",
          minutes: 5,
        },
      ],
    },
    {
      week: 3,
      theme: "Passage Comprehension",
      focus: "Reading",
      color: "amber",
      weeklyTheme: "Education",
      rationale: "Keyword hunting — scanning for words from the question without understanding the author's argument — is one of the main reasons Band 6 students consistently miss True/False/Not Given and Matching questions. This week you train comprehension rather than scanning: voice-recording your understanding, paraphrasing key concepts, and identifying how relative clauses qualify claims. End the week with a full reading and listening test.",
      tasks: [
        { id: "d-w3-src1", label: "Day 1: Declining Class Sizes", description: "Read the article, then open the worksheet to complete all 4 questions.", sourceUrl: "https://www.bbc.com/news/articles/crrpg7rgelro", sourceType: "article", minutes: 35, worksheetPrompts: WEEK3_COMPREHENSION_PROMPTS },
        { id: "d-w3-src2", label: "Day 2: AI for Education", description: "Read the article, then open the worksheet to complete all 4 questions.", sourceUrl: "https://edition.cnn.com/2025/09/22/tech/america-literacy-ai-schools", sourceType: "article", minutes: 35, worksheetPrompts: WEEK3_COMPREHENSION_PROMPTS },
        { id: "d-w3-src3", label: "Day 3: Education Budget Cuts", description: "Read the article, then open the worksheet to complete all 4 questions.", sourceUrl: "https://edition.cnn.com/2022/03/21/perspectives/imf-children-education-pandemic", sourceType: "article", minutes: 35, worksheetPrompts: WEEK3_COMPREHENSION_PROMPTS },
        { id: "d-w3-src4", label: "Day 4: A Different Way of Teaching", description: "Watch the video, then open the worksheet to complete all 4 questions.", sourceUrl: "https://youtu.be/-MTRxRO5SRA?si=EodlCYOP0N1DBgPc", sourceType: "video", minutes: 35, worksheetPrompts: WEEK3_COMPREHENSION_PROMPTS },
        { id: "d-w3-src5", label: "Day 5: US Education Debate", description: "Watch the video, then open the worksheet to complete all 4 questions.", sourceUrl: "https://youtu.be/EnBqsLcVSfg?si=VOlC8kfVFreflwEm", sourceType: "video", minutes: 35, worksheetPrompts: WEEK3_COMPREHENSION_PROMPTS },
        {
          id: "d-w3-mudahinaja-reading",
          label: "Day 6: MudahinAja — Read the Reading Module",
          description: "Open MudahinAja and work through the Reading module tutorial. Study the strategies for True/False/Not Given and Matching question types. Focus on how to locate the relevant sentence in the passage and decide whether the text confirms, contradicts, or stays silent on each statement.",
          resourcePath: "/dashboard/elite?tab=mudahinaja&module=reading",
          resourceLabel: "Open MudahinAja Reading",
          minutes: 30,
        },
        {
          id: "d-w3-mudahinaja-listening",
          label: "Day 6: MudahinAja — Read the Listening Module",
          description: "Open MudahinAja and work through the Listening module tutorial. Study the pre-reading strategy: how to use the time before each section to predict answer types and underline keywords in the questions. Apply this strategy in Day 7's listening test.",
          resourcePath: "/dashboard/elite?tab=mudahinaja&module=listening",
          resourceLabel: "Open MudahinAja Listening",
          minutes: 30,
        },
        {
          id: "d-w3-hw1",
          label: "Day 7: End-of-Week Module Practice — Reading",
          description: "Complete one full Reading test. After finishing, review every incorrect True/False/Not Given answer: did the text confirm it, contradict it, or stay silent? 'Not Given' means the text is completely silent — not that the answer is unclear.",
          resourcePath: "/dashboard/reading",
          resourceLabel: "Open Reading Module",
          minutes: 60,
        },
        {
          id: "d-w3-hw2",
          label: "Day 7: End-of-Week Module Practice — Listening",
          description: "Complete one full Listening test. Use the pre-reading strategy: read each set of questions before the audio plays, underlining key nouns. Listen for the answer to the specific question in front of you — not the whole passage.",
          resourcePath: "/dashboard/listening",
          resourceLabel: "Open Listening Module",
          minutes: 40,
        },
      ],
    },
    {
      week: 4,
      theme: "Exam Integration",
      focus: "Exam Strategy",
      color: "green",
      rationale: "Week 4 is full integration at medium difficulty across all four modules. You are not learning new content — you are applying the argument development, passage comprehension, and writing skills from the previous three weeks under realistic exam conditions. Focus on applying PEEL structure in Writing, using connector variety, and reading for intent rather than keywords in Reading. Aim to finish each module without leaving any question unanswered.",
      tasks: [
        {
          id: "d-w4-t1",
          label: "Day 1: Module Practice — Writing, PEEL Applied",
          description: "Attempt one Writing Task 2 at medium difficulty. Before you start, plan your two body paragraphs: write out your Point and Evidence for each. When you write the Explanation, aim for at least 3 sentences — this is where the Band 7 mark lives. After AI feedback, check: was your Explanation the longest part of each paragraph?",
          resourcePath: "/dashboard/writing",
          resourceLabel: "Open Writing Module",
          minutes: 45,
        },
        {
          id: "d-w4-t2",
          label: "Day 2: Module Practice — Speaking, Complex Clauses & Conditionals",
          description: "Complete a full Speaking session at medium difficulty. In Parts 2 and 3, deliberately try to use at least one conditional sentence ('If governments were to… , the result would be…') and at least one complex clause with a relative pronoun ('one of the key reasons that… is…'). These are specifically flagged in the Band 7 Grammatical Range descriptor.",
          resourcePath: "/dashboard/speaking",
          resourceLabel: "Open Speaking Module",
          minutes: 30,
        },
        {
          id: "d-w4-t3",
          label: "Day 3: Module Practice — Reading, Intent over Keywords",
          description: "Complete one Reading test at medium difficulty. For every True/False/Not Given question, locate the specific sentence in the text that the question is based on and decide: does the text CONFIRM it (True), CONTRADICT it (False), or not mention it at all (Not Given)? Do not rely on keywords alone — read the full sentence around each keyword.",
          resourcePath: "/dashboard/reading",
          resourceLabel: "Open Reading Module",
          minutes: 60,
        },
        {
          id: "d-w4-t4",
          label: "Day 4: Module Practice — Listening, Section 4 Focus",
          description: "Complete one Listening test at medium difficulty. Section 4 (the monologue) is the hardest and most relevant to academic reading comprehension. After finishing, review any Section 4 errors: were they caused by mishearing, unfamiliar vocabulary, or losing your place?",
          resourcePath: "/dashboard/listening",
          resourceLabel: "Open Listening Module",
          minutes: 40,
        },
        {
          id: "d-w4-t5",
          label: "Day 5: Reflection & Gap Analysis",
          description: "After completing all four modules, rank them from strongest to weakest. For your two weakest modules, write one specific sentence describing the exact type of question or skill that cost you marks this week. Return to the relevant revision notes or MudahinAja tutorial for that topic and read the relevant section one more time before your next session.",
          minutes: 20,
        },
      ],
    },
  ],
};

const POLISHING_PLAN: TierPlan = {
  tier: "Polishing",
  bandRange: "7.0+",
  targetBand: "8.0–9.0",
  headline: "Polish your language to Band 8+",
  description: "You already produce coherent, accurate English. The gap to Band 8 is precision: natural collocations, exact vocabulary choices, idiomatic fluency, and arguments that flow without overusing linking words. Each of the four weeks focuses on one IELTS module — you study the relevant revision notes first, then master exam strategies in MudahinAja, then apply both in full module practice. Optional exercises at the end of applicable weeks let you test your vocabulary tools against authentic sources.",
  color: "amber",
  weeks: [
    {
      week: 1,
      theme: "Reading — Text Types & Data Descriptors",
      focus: "Reading",
      color: "blue",
      rationale: "Week 1 focuses on Reading. The two revision notes — Text Types and Data Descriptors — are the vocabulary tools most directly relevant to Academic Reading comprehension and Task 1 Writing. You study them first, then use MudahinAja to learn the exact Band 8 inference and skimming strategies, then apply both in full Reading practice. The optional exercise at the end of the week lets you test your Band 8 data descriptor synonyms against authentic reading and video materials.",
      tasks: [
        {
          id: "p-w1-text-types",
          label: "Day 1: Revision Notes — Text Types",
          description: "Work through the Text Types notes. Understand the differences between formal and informal registers, and between report, essay, letter, and general writing styles. At Band 8, the distinction is not just 'formal vs informal' — it is choosing the register that suits the specific audience and purpose. Pay particular attention to the Academic register, which both IELTS Reading passages and Task 1/Task 2 Writing require.",
          resourcePath: "/dashboard/revision-notes?topic=text-types",
          resourceLabel: "Open Text Types Notes",
          minutes: 25,
        },
        {
          id: "p-w1-data-descriptors",
          label: "Day 2: Revision Notes — Vocabulary Bank, Data Descriptors",
          description: "Open the Vocabulary Passages revision note and study the Data Descriptors section. Focus on the Band 8 upgrades for the most common verbs — 'went up', 'went down', 'stayed the same', 'the highest point'. These are the phrases your Task 1 essay needs most urgently, but they also appear in Reading passages and recognising them quickly improves comprehension speed.",
          resourcePath: "/dashboard/revision-notes?topic=vocabulary-passages",
          resourceLabel: "Open Vocabulary Bank",
          minutes: 25,
        },
        {
          id: "p-w1-reading-tutorial",
          label: "Day 3: MudahinAja — Study the Reading Module",
          description: "Open MudahinAja and work through the Reading module tutorial. At Band 8, focus on the inference strategies — the text implies rather than states, and the question tests whether you read the implication correctly. Pay close attention to the True/False/Not Given and matching headings sections.",
          resourcePath: "/dashboard/elite?tab=mudahinaja&module=reading",
          resourceLabel: "Open MudahinAja",
          minutes: 30,
        },
        {
          id: "p-w1-reading-practice",
          label: "Day 4: Module Practice — 3–4 Reading Questions",
          description: "Complete 3–4 Reading questions. Prioritise inference-based question types (True/False/Not Given, matching information, matching headings). After each question, ask: did I locate the specific sentence the question was based on, or did I rely on keywords? Apply any data descriptor vocabulary you recognise in the passages.",
          resourcePath: "/dashboard/reading",
          resourceLabel: "Open Reading Module",
          minutes: 60,
        },
        {
          id: "p-w1-optional-data",
          label: "Optional: Band 8 Data Descriptor Exercise",
          description: "Choose any source below. Select 2 facts, trends, or statistics presented in the source. For each, write a new sentence using a Band 8 synonym from the Data Descriptors section of the Vocabulary Bank — replace phrases like 'went up a lot' with 'surged' or 'escalated sharply'. You can use any of the 9 topic resources available in this plan; the links below are a starting point.",
          minutes: 20,
          worksheetPrompts: [
            {
              id: "p-opt-w1-data-descriptor",
              label: "Band 8 Data Descriptor Synonyms",
              sectionHeader: "Data Descriptors",
              instruction: "Select 2 facts, trends, or statistics from this source. For each, write a new sentence using a Band 8 synonym from the Data Descriptors section of the Vocabulary Bank (e.g. replace 'went up a lot' with 'surged' or 'escalated sharply').",
              rows: 6,
              placeholder: "Fact 1 (original phrasing): '…'\nUpgraded sentence: '…'\n\nFact 2 (original phrasing): '…'\nUpgraded sentence: '…'",
            },
          ],
          relatedSources: [
            { label: "Environment: Turkish Droughts (Article)", url: "https://www.bbc.com/future/article/20260624-droughts-are-transforming-the-turkish-landscape-with-massive-sinkholes", type: "article" },
            { label: "Environment: Restoring Biodiversity (Video)", url: "https://youtu.be/yJX1Te0jey0?si=5xwqm0RGxHUA85sE", type: "video" },
            { label: "Technology: Future of Screens (Article)", url: "https://www.bbc.com/future/article/20260624-why-tech-companies-want-to-take-away-your-screen", type: "article" },
            { label: "Technology: Controversies of Technology (Video)", url: "https://youtu.be/QO3nY_u6hos?si=pDU2-sfJbWDJ_jAK", type: "video" },
            { label: "Education: Consequences of AI in Schools (Article)", url: "https://edition.cnn.com/2026/06/01/health/screens-in-school-education-tech-wellness", type: "article" },
            { label: "Education: Benefits of AI in Education (Video)", url: "https://youtu.be/hJP5GqnTrNo?si=82tHzMplmcz_c4G6", type: "video" },
          ],
        },
      ],
      externalResources: [
        { label: "Environment: Turkish Droughts", url: "https://www.bbc.com/future/article/20260624-droughts-are-transforming-the-turkish-landscape-with-massive-sinkholes", type: "article" },
        { label: "Environment: Restoring Biodiversity", url: "https://youtu.be/yJX1Te0jey0?si=5xwqm0RGxHUA85sE", type: "video" },
        { label: "Technology: Future of Screens", url: "https://www.bbc.com/future/article/20260624-why-tech-companies-want-to-take-away-your-screen", type: "article" },
        { label: "Technology: Controversies of Technology", url: "https://youtu.be/QO3nY_u6hos?si=pDU2-sfJbWDJ_jAK", type: "video" },
        { label: "Education: Consequences of AI in Schools", url: "https://edition.cnn.com/2026/06/01/health/screens-in-school-education-tech-wellness", type: "article" },
        { label: "Education: Benefits of AI in Education", url: "https://youtu.be/hJP5GqnTrNo?si=82tHzMplmcz_c4G6", type: "video" },
      ],
    },
    {
      week: 2,
      theme: "Writing — Transitory Phrases & Idiomatic Expressions",
      focus: "Writing",
      color: "purple",
      rationale: "Week 2 focuses on Writing. You study the two vocabulary areas that most elevate Task 1 and Task 2 writing: transitory phrases (precision connectors that replace generic linking words) and idiomatic expressions (natural high-register phrases). Each has its own targeted worksheet you complete before module practice — this tests whether you can use these tools independently. Two optional exercises then let you test both skills against authentic sources.",
      tasks: [
        {
          id: "p-w2-peel",
          label: "Day 1: Revision Notes — Paragraph Structuring, PEEL at Band 8",
          description: "Review the PEEL notes with a Band 8 lens. At this level, your Explanation section should move beyond analysis of the example to reflect on the societal value or broader impact — ask yourself: what does this point mean for people, systems, or society as a whole?",
          resourcePath: "/dashboard/revision-notes?topic=paragraph-structuring",
          resourceLabel: "Open PEEL Notes",
          minutes: 20,
        },
        {
          id: "p-w2-trans-rv",
          label: "Day 2: Revision Notes — Vocabulary Bank, Transitory Phrases",
          description: "Open the Vocabulary Passages revision note and study the Transitory Phrases section. For each category (Adding an idea, Contrasting, Cause & effect, Giving examples, Hedging, Concluding), identify one phrase you want to prioritise using this week. Precision connectors at Band 8 replace generic phrases like 'Also' and 'But' with 'Furthermore' and 'Nevertheless' — but only where the logical relationship genuinely calls for that connector.",
          resourcePath: "/dashboard/revision-notes?topic=vocabulary-passages",
          resourceLabel: "Open Vocabulary Bank",
          minutes: 20,
        },
        {
          id: "p-w2-idiom-rv",
          label: "Day 3: Revision Notes — Vocabulary Bank, Idiomatic Expressions",
          description: "Open the Vocabulary Passages section and study the Idiomatic Expressions list. For each idiom, read the meaning and the natural use example. Do not try to memorise the list — identify the 3–4 idioms you can imagine using naturally in a writing or speaking context.",
          resourcePath: "/dashboard/revision-notes?topic=vocabulary-passages",
          resourceLabel: "Open Vocabulary Bank",
          minutes: 20,
        },
        {
          id: "p-w2-idiom-ws",
          label: "Day 4: Idiom Worksheet (10 Questions — MCQ, Fill in the Blanks, Open Ended)",
          description: "Complete the 10-question worksheet on idiomatic expressions. Section 1 (Q1–4) is multiple choice — tap the correct option. Section 2 (Q5–7) is fill in the blanks — type the correct idiom. Section 3 (Q8–10) is open-ended — write your own sentences using idioms naturally. Source links are shown inside the worksheet so you can refer to them as you answer.",
          minutes: 35,
          worksheetPrompts: WEEK_POLISHING_IDIOM_WORKSHEET,
          relatedSources: [
            { label: "Environment: Turkish Droughts (Article)", url: "https://www.bbc.com/future/article/20260624-droughts-are-transforming-the-turkish-landscape-with-massive-sinkholes", type: "article" },
            { label: "Environment: Restoring Biodiversity (Video)", url: "https://youtu.be/yJX1Te0jey0?si=5xwqm0RGxHUA85sE", type: "video" },
            { label: "Technology: Future of Screens (Article)", url: "https://www.bbc.com/future/article/20260624-why-tech-companies-want-to-take-away-your-screen", type: "article" },
            { label: "Technology: Controversies of Technology (Video)", url: "https://youtu.be/QO3nY_u6hos?si=pDU2-sfJbWDJ_jAK", type: "video" },
            { label: "Education: Consequences of AI in Schools (Article)", url: "https://edition.cnn.com/2026/06/01/health/screens-in-school-education-tech-wellness", type: "article" },
            { label: "Education: Benefits of AI in Education (Video)", url: "https://youtu.be/hJP5GqnTrNo?si=82tHzMplmcz_c4G6", type: "video" },
          ],
        },
        {
          id: "p-w2-trans-ws",
          label: "Day 5: Transitory Phrases & Data Descriptors Worksheet (15 Questions — MCQ, Fill in the Blanks, Open Ended)",
          description: "Complete the 15-question worksheet. Section 1 (Q1–5) is multiple choice. Section 2 (Q6–10) is fill in the blanks — type the missing phrase or descriptor. Section 3 (Q11–15) is open-ended. This worksheet tests both transitory phrases from Day 2 and data descriptors from Week 1 — the two vocabulary layers most needed for Band 8 Task 1 and Task 2. Source links are shown inside the worksheet.",
          minutes: 50,
          worksheetPrompts: WEEK_POLISHING_TRANSITORY_WORKSHEET,
          relatedSources: [
            { label: "Crime: Organized Crime and Punishment (Article)", url: "https://www.bbc.com/news/articles/c0jyq3990jeo", type: "article" },
            { label: "Crime: Crime Investigation (Video)", url: "https://youtu.be/hQuB4784JPc?si=uXldKsyJe1fs-FK2", type: "video" },
            { label: "Economy: Inflation in the US Economy (Article)", url: "https://edition.cnn.com/2026/06/25/economy/us-pce-inflation-may", type: "article" },
            { label: "Economy: Utilizing Behavioral Economics (Video)", url: "https://youtu.be/bTDBeI-mtDg?si=OFVJxte_t5Jr8Am9", type: "video" },
            { label: "Lifestyle: Lifestyle and Disease Prevention (Article)", url: "https://edition.cnn.com/2025/07/16/health/heart-health-whole-body-wellness", type: "article" },
            { label: "Lifestyle: What Makes a Happy Life? (Video)", url: "https://youtu.be/8KkKuTCFvzI?si=npj8LeZOkKMAwXUs", type: "video" },
          ],
        },
        {
          id: "p-w2-writing-tutorial",
          label: "Day 6: MudahinAja — Study the Writing Module",
          description: "Open MudahinAja and work through the Writing module tutorial. Focus on the Task 2 counterargument structure and the Task 1 data selection strategy — specifically, how to choose which data to highlight and which to group. Compare the strategies against your PEEL practice from Day 1 and identify any gaps in your current approach.",
          resourcePath: "/dashboard/elite?tab=mudahinaja&module=writing",
          resourceLabel: "Open MudahinAja",
          minutes: 30,
        },
        {
          id: "p-w2-writing-practice",
          label: "Day 7: Module Practice — 3–4 Writing Questions",
          description: "Complete 3–4 Writing questions. In Task 2, use at least 1 transitory phrase, 1 idiomatic expression, and 1 PEEL paragraph where the Explanation section runs 2–4 sentences. In Task 1, use at least 2 data descriptor upgrades from your Vocabulary Bank. After AI feedback, note which vocabulary upgrades felt natural and which felt forced.",
          resourcePath: "/dashboard/writing",
          resourceLabel: "Open Writing Module",
          minutes: 60,
        },
        {
          id: "p-w2-optional-idiom",
          label: "Optional A: Idiomatic Expressions — Spoken Sentence Practice",
          description: "Choose any source below (or any of the 9 topic resources in this plan). Using the Idiomatic Expressions from the Vocabulary Bank, formulate 3 different spoken sentences drawing on information from the source. Each sentence must use a different idiom and reference a specific idea from what you read or watched.",
          minutes: 20,
          worksheetPrompts: WEEK_POLISHING1_IDIOM_PROMPTS,
          relatedSources: [
            { label: "Crime: Organized Crime and Punishment (Article)", url: "https://www.bbc.com/news/articles/c0jyq3990jeo", type: "article" },
            { label: "Crime: Crime Investigation (Video)", url: "https://youtu.be/hQuB4784JPc?si=uXldKsyJe1fs-FK2", type: "video" },
            { label: "Economy: Inflation in the US Economy (Article)", url: "https://edition.cnn.com/2026/06/25/economy/us-pce-inflation-may", type: "article" },
            { label: "Economy: Utilizing Behavioral Economics (Video)", url: "https://youtu.be/bTDBeI-mtDg?si=OFVJxte_t5Jr8Am9", type: "video" },
            { label: "Lifestyle: Lifestyle and Disease Prevention (Article)", url: "https://edition.cnn.com/2025/07/16/health/heart-health-whole-body-wellness", type: "article" },
            { label: "Lifestyle: What Makes a Happy Life? (Video)", url: "https://youtu.be/8KkKuTCFvzI?si=npj8LeZOkKMAwXUs", type: "video" },
          ],
        },
        {
          id: "p-w2-optional-trans",
          label: "Optional B: Transitory Phrases — Paragraph Identification",
          description: "Choose any source below (or any of the 9 topic resources in this plan). Identify 2 paragraphs or points where a Transitory Phrase from the Vocabulary Bank would strengthen the transition. Write the original idea and then a sentence using the transitory phrase.",
          minutes: 20,
          worksheetPrompts: [
            {
              id: "p-opt-w2-transitory",
              label: "Transitory Phrases — Paragraph Identification",
              instruction: "From this source, identify 2 paragraphs or points where a Transitory Phrase from the Vocabulary Bank would strengthen the transition. Write the original idea and then a sentence using the transitory phrase.",
              rows: 7,
              placeholder: "Point 1 (from source): '…'\nUsing transitory phrase: '…'\n\nPoint 2 (from source): '…'\nUsing transitory phrase: '…'",
            },
          ],
          relatedSources: [
            { label: "Crime: Organized Crime and Punishment (Article)", url: "https://www.bbc.com/news/articles/c0jyq3990jeo", type: "article" },
            { label: "Crime: Crime Investigation (Video)", url: "https://youtu.be/hQuB4784JPc?si=uXldKsyJe1fs-FK2", type: "video" },
            { label: "Economy: Inflation in the US Economy (Article)", url: "https://edition.cnn.com/2026/06/25/economy/us-pce-inflation-may", type: "article" },
            { label: "Economy: Utilizing Behavioral Economics (Video)", url: "https://youtu.be/bTDBeI-mtDg?si=OFVJxte_t5Jr8Am9", type: "video" },
            { label: "Lifestyle: Lifestyle and Disease Prevention (Article)", url: "https://edition.cnn.com/2025/07/16/health/heart-health-whole-body-wellness", type: "article" },
            { label: "Lifestyle: What Makes a Happy Life? (Video)", url: "https://youtu.be/8KkKuTCFvzI?si=npj8LeZOkKMAwXUs", type: "video" },
          ],
        },
      ],
      externalResources: [
        { label: "Crime: Organized Crime and Punishment", url: "https://www.bbc.com/news/articles/c0jyq3990jeo", type: "article" },
        { label: "Crime: Crime Investigation", url: "https://youtu.be/hQuB4784JPc?si=uXldKsyJe1fs-FK2", type: "video" },
        { label: "Economy: Inflation in the US Economy", url: "https://edition.cnn.com/2026/06/25/economy/us-pce-inflation-may", type: "article" },
        { label: "Economy: Utilizing Behavioral Economics", url: "https://youtu.be/bTDBeI-mtDg?si=OFVJxte_t5Jr8Am9", type: "video" },
        { label: "Lifestyle: Lifestyle and Disease Prevention", url: "https://edition.cnn.com/2025/07/16/health/heart-health-whole-body-wellness", type: "article" },
        { label: "Lifestyle: What Makes a Happy Life?", url: "https://youtu.be/8KkKuTCFvzI?si=npj8LeZOkKMAwXUs", type: "video" },
      ],
    },
    {
      week: 3,
      theme: "Listening — Hedging & Formal Academic Style",
      focus: "Listening",
      color: "amber",
      rationale: "Week 3 focuses on Listening. The Hedging & Formal Academic Style revision note sharpens your awareness of how academic speakers qualify claims — a skill that directly improves your ability to distinguish correct from incorrect completions in Parts 3 and 4, where speakers hedge or qualify key statements before giving the answer. After studying the notes, you apply them through the MudahinAja Listening strategies and full Listening practice.",
      tasks: [
        {
          id: "p-w3-hedging",
          label: "Day 1: Revision Notes — Hedging & Formal Academic Style",
          description: "Study hedging language — modals (may, might, could), adverbs (arguably, generally, typically), and reporting structures (It has been suggested that…). At Band 8, hedging is not just about academic writing: in Listening Parts 3 and 4, speakers hedge when presenting research findings or disputed claims. Recognising hedged language helps you distinguish between what a speaker asserts and what they merely suggest.",
          resourcePath: "/dashboard/revision-notes?topic=hedging-formal-style",
          resourceLabel: "Open Hedging Notes",
          minutes: 25,
        },
        {
          id: "p-w3-listening-tutorial",
          label: "Day 2: MudahinAja — Study the Listening Module",
          description: "Open MudahinAja and work through the Listening module tutorial. Focus on the pre-reading strategy (reading questions before the audio plays) and the note-completion and multiple-choice sections, where Band 8 errors most often occur. Notice how the tutorial describes hedging and qualification — connect this to your Day 1 notes.",
          resourcePath: "/dashboard/elite?tab=mudahinaja&module=listening",
          resourceLabel: "Open MudahinAja",
          minutes: 30,
        },
        {
          id: "p-w3-listening-practice",
          label: "Day 3: Module Practice — 3–4 Listening Questions",
          description: "Complete 3–4 Listening questions. Use the pre-reading strategy before each audio section. After finishing, review any errors: were they caused by mishearing, unfamiliar vocabulary, or losing your place in the audio? Identify whether each error was a strategy issue or a knowledge issue.",
          resourcePath: "/dashboard/listening",
          resourceLabel: "Open Listening Module",
          minutes: 50,
        },
      ],
      externalResources: [
        { label: "Health: Neurological Benefits of Exercise", url: "https://youtu.be/BHY0FxzoKZE?si=eK5x6FWjLMNu7csm", type: "video" },
        { label: "Health: Maternity and Neonatal Care", url: "https://www.bbc.com/news/articles/c2kyn81epdvo", type: "article" },
        { label: "Media: Media and Misinformation", url: "https://edition.cnn.com/2023/02/15/media/gallup-knight-foundation-report-reliable-sources", type: "article" },
        { label: "Media: Social Media and Political Perception", url: "https://youtu.be/GWaKaOGW55w?si=2jdDzUVwHiRTmDd7", type: "video" },
        { label: "Government: Affordable Housing", url: "https://edition.cnn.com/2026/03/12/business/housing-affordability-bill-senate", type: "article" },
        { label: "Government: US Politics", url: "https://youtu.be/1Ws3w_ZOmhI?si=dMbOdA9JguGwA9LD", type: "video" },
      ],
    },
    {
      week: 4,
      theme: "Speaking — Collocations & Paraphrasing",
      focus: "Speaking",
      color: "green",
      rationale: "Week 4 focuses on Speaking. Collocations and paraphrasing are the two skills that most obviously separate Band 7 from Band 8 in spontaneous speech: precise word pairings replace weak generic expressions, and paraphrasing shows the examiner you can express the same idea in multiple ways — a key Band 8 Lexical Resource descriptor. You study the revision notes, complete the collocations worksheet, then move into MudahinAja Speaking strategies and full practice. The optional exercise trains you to rewrite authentic facts using the exact collocations from your notes.",
      tasks: [
        {
          id: "p-w4-colloc-rv",
          label: "Day 1: Revision Notes — Collocations & Paraphrasing",
          description: "Open the Collocations & Paraphrasing revision note and study Section 2 (Topic Collocations). Focus on the collocation categories for Health & Medicine, Media & Public Opinion, and Government & Politics. Identify 4–5 collocations per topic that you want to use in your worksheet answers and Speaking practice.",
          resourcePath: "/dashboard/revision-notes?topic=collocations-paraphrasing",
          resourceLabel: "Open Collocations Notes",
          minutes: 30,
        },
        {
          id: "p-w4-colloc-ws",
          label: "Day 2: Collocations Worksheet (10 Questions — MCQ, Fill in the Blanks, Open Ended)",
          description: "Complete the 10-question collocation worksheet. Section 1 (Q1–3) is multiple choice — tap the correct option. Section 2 (Q4–7) is fill in the blanks. Section 3 (Q8–10) is open-ended. Source links are shown inside the worksheet.",
          minutes: 35,
          worksheetPrompts: WEEK_POLISHING_COLLOCATION_WORKSHEET,
          relatedSources: [
            { label: "Health: Neurological Benefits of Exercise (Video)", url: "https://youtu.be/BHY0FxzoKZE?si=eK5x6FWjLMNu7csm", type: "video" },
            { label: "Health: Maternity and Neonatal Care (Article)", url: "https://www.bbc.com/news/articles/c2kyn81epdvo", type: "article" },
            { label: "Media: Media and Misinformation (Article)", url: "https://edition.cnn.com/2023/02/15/media/gallup-knight-foundation-report-reliable-sources", type: "article" },
            { label: "Media: Social Media and Political Perception (Video)", url: "https://youtu.be/GWaKaOGW55w?si=2jdDzUVwHiRTmDd7", type: "video" },
            { label: "Government: Affordable Housing (Article)", url: "https://edition.cnn.com/2026/03/12/business/housing-affordability-bill-senate", type: "article" },
            { label: "Government: US Politics (Video)", url: "https://youtu.be/1Ws3w_ZOmhI?si=dMbOdA9JguGwA9LD", type: "video" },
          ],
        },
        {
          id: "p-w4-speaking-tutorial",
          label: "Day 3: MudahinAja — Study the Speaking Module",
          description: "Open MudahinAja and work through the Speaking module tutorial. At Band 8, the key is discourse management — using markers to signal shifts ('That said,', 'What is interesting, however,') and sustaining extended, coherent responses in Part 3 without relying on filler phrases. Notice where the tutorial overlaps with collocations and paraphrasing from Day 1.",
          resourcePath: "/dashboard/elite?tab=mudahinaja&module=speaking",
          resourceLabel: "Open MudahinAja",
          minutes: 30,
        },
        {
          id: "p-w4-speaking-practice",
          label: "Day 4: Module Practice — 3–4 Speaking Questions",
          description: "Complete 3–4 Speaking questions. In Part 3, aim to use at least one collocation naturally from Section 2 of your revision notes and at least one paraphrase (restate a key idea differently rather than repeating the same words). After the session, assess your fluency: did your vocabulary feel chosen for precision, or chosen just to impress?",
          resourcePath: "/dashboard/speaking",
          resourceLabel: "Open Speaking Module",
          minutes: 40,
        },
        {
          id: "p-w4-optional-colloc",
          label: "Optional: Collocation Rewrite Exercise",
          description: "Choose any source below (or any of the 9 topic resources in this plan). Select 3 facts or claims from the source. Using the topic-specific collocations from Section 2 of the Collocations & Paraphrasing revision note, rewrite each fact with at least one Band 8 collocation that fits the topic naturally.",
          minutes: 20,
          worksheetPrompts: WEEK_POLISHING3_SOPHISTICATION_PROMPTS,
          relatedSources: [
            { label: "Health: Neurological Benefits of Exercise (Video)", url: "https://youtu.be/BHY0FxzoKZE?si=eK5x6FWjLMNu7csm", type: "video" },
            { label: "Health: Maternity and Neonatal Care (Article)", url: "https://www.bbc.com/news/articles/c2kyn81epdvo", type: "article" },
            { label: "Media: Media and Misinformation (Article)", url: "https://edition.cnn.com/2023/02/15/media/gallup-knight-foundation-report-reliable-sources", type: "article" },
            { label: "Media: Social Media and Political Perception (Video)", url: "https://youtu.be/GWaKaOGW55w?si=2jdDzUVwHiRTmDd7", type: "video" },
            { label: "Government: Affordable Housing (Article)", url: "https://edition.cnn.com/2026/03/12/business/housing-affordability-bill-senate", type: "article" },
            { label: "Government: US Politics (Video)", url: "https://youtu.be/1Ws3w_ZOmhI?si=dMbOdA9JguGwA9LD", type: "video" },
          ],
        },
      ],
      externalResources: [
        { label: "Health: Neurological Benefits of Exercise", url: "https://youtu.be/BHY0FxzoKZE?si=eK5x6FWjLMNu7csm", type: "video" },
        { label: "Health: Maternity and Neonatal Care", url: "https://www.bbc.com/news/articles/c2kyn81epdvo", type: "article" },
        { label: "Media: Media and Misinformation", url: "https://edition.cnn.com/2023/02/15/media/gallup-knight-foundation-report-reliable-sources", type: "article" },
        { label: "Media: Social Media and Political Perception", url: "https://youtu.be/GWaKaOGW55w?si=2jdDzUVwHiRTmDd7", type: "video" },
        { label: "Government: Affordable Housing", url: "https://edition.cnn.com/2026/03/12/business/housing-affordability-bill-senate", type: "article" },
        { label: "Government: US Politics", url: "https://youtu.be/1Ws3w_ZOmhI?si=dMbOdA9JguGwA9LD", type: "video" },
      ],
    },
  ],
};

// ─────────────────────────────────────────────
// ExternalSourceWorksheetCard — answer space for source-based worksheets
const OPTION_LETTERS = ["A", "B", "C", "D"];

function ExternalSourceWorksheetCard({ task }: { task: StudyTask }) {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [open, setOpen] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);

  const setAnswer = (id: string, val: string) =>
    setAnswers(prev => ({ ...prev, [id]: val }));

  const getAnswerText = (p: WorksheetPrompt) => {
    const ans = answers[p.id];
    if (!ans) return "";
    if (p.type === "mcq" && p.options) {
      const idx = parseInt(ans);
      if (isNaN(idx)) return ans;
      return `${OPTION_LETTERS[idx]}) ${p.options[idx]}`;
    }
    return ans;
  };

  const handleDownload = () => {
    const date = new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
    const prompts = task.worksheetPrompts!;
    const html = `<!DOCTYPE html><html><head><meta charset="UTF-8">
<title>${task.label} — Worksheet</title>
<style>
  body{font-family:Arial,sans-serif;max-width:760px;margin:0 auto;padding:28px;color:#1e293b}
  h1{font-size:18px;color:#1e40af;border-bottom:2px solid #1e40af;padding-bottom:8px;margin-bottom:4px}
  .sec-header{font-size:12px;font-weight:700;color:#7c3aed;text-transform:uppercase;letter-spacing:.06em;margin:22px 0 10px;padding-bottom:4px;border-bottom:1px solid #e9d5ff}
  .meta{color:#64748b;font-size:12px;margin-bottom:20px}
  .qblock{margin-bottom:14px;padding:12px;border:1px solid #e2e8f0;border-radius:8px;page-break-inside:avoid}
  .qlabel{font-size:12px;font-weight:700;color:#1e40af;margin-bottom:3px}
  .qinstr{font-size:11px;color:#64748b;margin-bottom:6px;line-height:1.5}
  .qsentence{font-size:12px;font-style:italic;color:#1e293b;background:#f1f5f9;padding:7px 10px;border-radius:4px;margin-bottom:8px}
  .ans{padding:10px 12px;border-radius:6px;border:1px solid #cbd5e1;background:#f8fafc;font-size:13px;min-height:36px;white-space:pre-wrap;line-height:1.6}
  .print-btn{display:inline-flex;align-items:center;gap:6px;margin-bottom:20px;padding:8px 16px;background:#1e40af;color:#fff;border:none;border-radius:6px;font-size:13px;cursor:pointer}
  @media print{.print-btn{display:none!important}}
</style></head><body>
<button class="print-btn" onclick="window.print()">Print / Save as PDF</button>
<h1>${task.label}</h1>
<div class="meta">Completed: ${date} | For review by the Engvolve coaching team</div>
${prompts.map(p => `
${p.sectionHeader ? `<div class="sec-header">${p.sectionHeader}</div>` : ""}
<div class="qblock">
  <div class="qlabel">${p.label}</div>
  <div class="qinstr">${p.instruction}</div>
  ${p.sentence ? `<div class="qsentence">${p.sentence}</div>` : ""}
  <div class="ans">${getAnswerText(p) || '<span style="color:#94a3b8;font-style:italic">No answer given</span>'}</div>
</div>`).join("")}
</body></html>`;
    const win = window.open("", "_blank");
    if (win) { win.document.write(html); win.document.close(); }
  };

  const worksheetContent = (isFS: boolean) => (
    <div className={cn("space-y-5", isFS ? "p-6 max-w-3xl mx-auto" : "pt-3")}>
      {/* Single-source link */}
      {task.sourceUrl && (
        <a
          href={task.sourceUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 rounded-lg border border-blue-500/30 bg-blue-500/8 px-3 py-2.5 text-sm font-medium text-blue-400 hover:bg-blue-500/15 transition-colors"
        >
          {task.sourceType === "video"
            ? <PlayCircle className="w-4 h-4 text-red-400 shrink-0" />
            : <ExternalLink className="w-4 h-4 text-blue-400 shrink-0" />}
          <span>Open source: {task.label.replace(/^Day \d+: /, "")}</span>
          <span className="ml-auto text-[10px] text-muted-foreground/60">{task.sourceType === "video" ? "YouTube" : "Article"}</span>
        </a>
      )}

      {/* Related sources (worksheet tasks with multiple sources) */}
      {task.relatedSources && task.relatedSources.length > 0 && (
        <div className="rounded-lg border border-border/30 bg-card/50 px-3 py-2.5 space-y-1.5">
          <p className="text-[10px] font-bold text-muted-foreground/60 uppercase tracking-wider pb-0.5">Source materials — open before answering</p>
          {task.relatedSources.map((src, i) => (
            <a
              key={i}
              href={src.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-xs text-blue-400 hover:text-blue-300 transition-colors group"
            >
              {src.type === "video"
                ? <PlayCircle className="w-3.5 h-3.5 text-red-400 shrink-0" />
                : <ExternalLink className="w-3.5 h-3.5 text-blue-400 shrink-0" />}
              <span className="group-hover:underline underline-offset-2">{src.label}</span>
              <span className="text-muted-foreground/40 text-[10px] ml-auto">{src.type === "video" ? "YouTube" : "Article"}</span>
            </a>
          ))}
        </div>
      )}

      {/* Questions */}
      {task.worksheetPrompts!.map(prompt => (
        <div key={prompt.id} className="space-y-2">
          {prompt.sectionHeader && (
            <p className="text-[10px] font-bold text-purple-400 uppercase tracking-widest pt-2 pb-0.5 border-b border-purple-500/20">
              {prompt.sectionHeader}
            </p>
          )}

          {/* Question label + instruction */}
          <div className="space-y-0.5">
            <p className="text-xs font-bold text-foreground">{prompt.label}</p>
            <p className="text-xs text-muted-foreground leading-relaxed">{prompt.instruction}</p>
          </div>

          {/* Sentence with blank shown in styled block */}
          {prompt.sentence && (
            <div className="rounded-lg bg-muted/40 border border-border/30 px-3 py-2 text-xs text-foreground/80 italic leading-relaxed">
              {prompt.sentence}
            </div>
          )}

          {/* MCQ: clickable option buttons */}
          {prompt.type === "mcq" && prompt.options ? (
            <div className="space-y-1.5">
              {prompt.options.map((opt, i) => {
                const isSelected = answers[prompt.id] === String(i);
                return (
                  <button
                    key={i}
                    onClick={() => setAnswer(prompt.id, isSelected ? "" : String(i))}
                    className={cn(
                      "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg border text-left text-xs transition-all",
                      isSelected
                        ? "border-accent/60 bg-accent/10 text-foreground"
                        : "border-border/30 bg-background/60 text-foreground/70 hover:border-accent/30 hover:bg-accent/5"
                    )}
                  >
                    <span className={cn(
                      "w-5 h-5 rounded-full border text-[10px] font-bold flex items-center justify-center shrink-0 transition-all",
                      isSelected ? "border-accent bg-accent text-background" : "border-border/50 text-muted-foreground"
                    )}>
                      {OPTION_LETTERS[i]}
                    </span>
                    <span className={cn("leading-snug", isSelected && "font-medium")}>{opt}</span>
                  </button>
                );
              })}
            </div>
          ) : prompt.type === "fill" ? (
            /* Fill in blank: single-line text input */
            <input
              type="text"
              value={answers[prompt.id] || ""}
              onChange={e => setAnswer(prompt.id, e.target.value)}
              placeholder={prompt.placeholder || "Type your answer here…"}
              className="w-full rounded-lg border border-border bg-background/80 px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:ring-1 focus:ring-accent/50"
            />
          ) : (
            /* Open ended: textarea */
            <textarea
              value={answers[prompt.id] || ""}
              onChange={e => setAnswer(prompt.id, e.target.value)}
              rows={prompt.rows}
              placeholder={prompt.placeholder || "Type your answer here…"}
              className="w-full rounded-lg border border-border bg-background/80 px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:ring-1 focus:ring-accent/50 resize-y leading-relaxed"
            />
          )}
        </div>
      ))}

      {/* Action bar */}
      <div className="flex flex-wrap items-center gap-2 pt-1">
        <button
          onClick={handleDownload}
          className="flex items-center gap-1.5 rounded-lg border border-blue-500/30 bg-blue-500/10 px-3 py-1.5 text-xs font-semibold text-blue-400 hover:bg-blue-500/20 transition-colors"
        >
          <FileDown className="w-3.5 h-3.5" />
          Download PDF
        </button>
        <button
          onClick={() => { setFullscreen(!isFS); if (isFS) setOpen(true); }}
          className="flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground hover:border-border/60 transition-colors"
        >
          <Maximize2 className="w-3 h-3" />
          {isFS ? "Exit fullscreen" : "Fullscreen"}
        </button>
      </div>
    </div>
  );

  if (fullscreen) {
    return createPortal(
      <div className="fixed inset-0 z-50 bg-background overflow-y-auto">
        <div className="sticky top-0 z-10 bg-background/95 backdrop-blur border-b border-border px-5 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ClipboardList className="w-4 h-4 text-blue-400" />
            <p className="text-sm font-semibold text-foreground">{task.label}</p>
          </div>
          <button
            onClick={() => setFullscreen(false)}
            className="rounded-lg p-1.5 text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        {worksheetContent(true)}
      </div>,
      document.body
    );
  }

  return (
    <div className="mt-3">
      <button
        onClick={() => setOpen(o => !o)}
        className={cn(
          "w-full flex items-center justify-between gap-2 rounded-lg border px-3 py-2 text-xs font-semibold transition-all",
          open
            ? "border-blue-500/40 bg-blue-500/10 text-blue-400"
            : "border-border bg-secondary/40 text-muted-foreground hover:border-blue-500/30 hover:text-blue-400"
        )}
      >
        <span className="flex items-center gap-1.5">
          <ClipboardList className="w-3.5 h-3.5" />
          {open ? "Hide worksheet" : "Open worksheet"}
        </span>
        <ChevronDown className={cn("w-3.5 h-3.5 transition-transform", open && "rotate-180")} />
      </button>
      {open && worksheetContent(false)}
    </div>
  );
}

// VocabSlideshow — fullscreen lesson viewer
// ─────────────────────────────────────────────
function VocabSlideshow({ items }: { items: VocabItem[] }) {
  const [idx, setIdx] = useState(0);
  const [open, setOpen] = useState(false);
  const [attempts, setAttempts] = useState<Record<number, string>>({});
  const [revealed, setRevealed] = useState<Set<number>>(new Set());
  const item = items[idx];

  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
      if (e.key === "ArrowLeft") setIdx(i => Math.max(0, i - 1));
      if (e.key === "ArrowRight") setIdx(i => Math.min(items.length - 1, i + 1));
    };
    window.addEventListener("keydown", handler);
    return () => {
      window.removeEventListener("keydown", handler);
      document.body.style.overflow = "";
    };
  }, [open, items.length]);

  const fullscreen = open ? createPortal(
    <div className="fixed inset-0 z-[200] bg-background flex flex-col">
      {/* Top bar */}
      <div className="flex-shrink-0 border-b border-border/30 px-4 py-3 flex items-center justify-between bg-background">
        <button
          onClick={() => setOpen(false)}
          className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <X className="w-4 h-4" /> Close
        </button>
        <span className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">Vocabulary Lesson</span>
        <span className="text-xs text-muted-foreground tabular-nums">{idx + 1} / {items.length}</span>
      </div>

      {/* Scrollable body */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-2xl mx-auto px-5 py-8 space-y-5">
          {/* Term */}
          <div>
            <h2 className="text-2xl font-bold text-foreground leading-tight">{item.term}</h2>
            {item.replaces && (
              <p className="text-sm text-muted-foreground mt-1">
                Replaces: <span className="line-through opacity-70">{item.replaces}</span>
              </p>
            )}
          </div>

          {/* Why this matters */}
          {item.why && (
            <div className="rounded-xl border border-green-500/30 bg-green-500/5 p-4 space-y-1.5">
              <p className="text-[10px] font-bold text-green-400 uppercase tracking-widest">Why this matters</p>
              <p className="text-sm text-foreground/90 leading-relaxed">{item.why}</p>
            </div>
          )}

          {/* Usage pattern */}
          {item.pattern && (
            <div className="rounded-xl border border-accent/25 bg-accent/5 p-4 space-y-1.5">
              <p className="text-[10px] font-bold text-accent uppercase tracking-widest">Usage pattern</p>
              <pre className="text-sm text-foreground/90 leading-relaxed whitespace-pre-wrap font-mono">{item.pattern}</pre>
            </div>
          )}

          {/* Examples */}
          <div className="space-y-3">
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">IELTS examples</p>
            {item.examples.map((ex, i) => (
              <div key={i} className="rounded-xl border border-border/30 bg-card/60 p-4">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-accent/15 text-accent border border-accent/25">
                  {ex.label}
                </span>
                <p className="text-sm text-foreground/85 mt-2.5 leading-relaxed italic">"{ex.sentence}"</p>
              </div>
            ))}
          </div>

          {/* Common mistake */}
          {item.mistake && (
            <div className="rounded-xl border border-red-500/30 bg-red-500/5 p-4 space-y-1.5">
              <p className="text-[10px] font-bold text-red-400 uppercase tracking-widest">Common mistake</p>
              <p className="text-sm text-foreground/90 leading-relaxed">{item.mistake}</p>
            </div>
          )}

          {/* Interactive practice prompt */}
          {item.practice && (
            <div className="rounded-xl border border-amber-500/30 bg-amber-500/5 p-4 space-y-3">
              <p className="text-[10px] font-bold text-amber-400 uppercase tracking-widest">Try it yourself</p>
              <p className="text-sm text-foreground/90 leading-relaxed">{item.practice}</p>
              <textarea
                value={attempts[idx] ?? ""}
                onChange={e => setAttempts(prev => ({ ...prev, [idx]: e.target.value }))}
                placeholder="Write your answer here before checking the worked example..."
                rows={4}
                className="w-full rounded-lg bg-background/60 border border-amber-500/20 text-sm text-foreground placeholder:text-muted-foreground/40 px-3 py-2.5 resize-none focus:outline-none focus:border-amber-500/40 transition-colors"
              />
              {!revealed.has(idx) ? (
                <button
                  onClick={() => setRevealed(prev => new Set([...prev, idx]))}
                  disabled={!(attempts[idx] ?? "").trim()}
                  className="text-xs font-semibold text-amber-400 hover:text-amber-300 disabled:opacity-35 disabled:cursor-not-allowed transition-colors"
                >
                  Show worked example →
                </button>
              ) : item.workedExample && item.workedExample.length > 0 ? (
                <div className="space-y-2.5">
                  {item.workedExample.map((ex, ei) => (
                    <div key={ei} className="rounded-lg border border-amber-400/30 bg-amber-400/5 p-3.5 space-y-1.5">
                      <p className="text-[10px] font-bold text-amber-300 uppercase tracking-widest">
                        {item.workedExample!.length > 1 ? `Worked example ${ei + 1}` : "Worked example"}
                      </p>
                      <p className="text-sm text-foreground/85 leading-relaxed whitespace-pre-wrap">{ex}</p>
                    </div>
                  ))}
                </div>
              ) : null}
            </div>
          )}

          {/* Navigation */}
          <div className="flex items-center justify-between pt-2 pb-10">
            <button
              onClick={() => setIdx(i => Math.max(0, i - 1))}
              disabled={idx === 0}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-border/30 bg-card/40 text-sm text-muted-foreground hover:text-foreground hover:bg-card/80 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
              ← Previous
            </button>
            <div className="flex gap-1.5 items-center">
              {items.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setIdx(i)}
                  className={cn(
                    "rounded-full transition-all duration-200",
                    i === idx ? "w-4 h-2 bg-accent" : "w-2 h-2 bg-border/50 hover:bg-border"
                  )}
                />
              ))}
            </div>
            <button
              onClick={() => setIdx(i => Math.min(items.length - 1, i + 1))}
              disabled={idx === items.length - 1}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-border/30 bg-card/40 text-sm text-muted-foreground hover:text-foreground hover:bg-card/80 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
              Next →
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  ) : null;

  return (
    <>
      {fullscreen}
      {/* Compact inline teaser — list of terms, click any to open fullscreen */}
      <div className="mt-3 rounded-lg border border-accent/20 bg-accent/5 overflow-hidden">
        <div className="flex items-center justify-between px-3 py-2.5 bg-card/60 border-b border-border/20">
          <div className="flex items-center gap-1.5">
            <Sparkles className="w-3 h-3 text-accent" />
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
              Vocab lesson · {items.length} items
            </span>
          </div>
          <button
            onClick={() => { setIdx(0); setOpen(true); }}
            className="flex items-center gap-1 text-[11px] font-semibold text-accent hover:text-accent/80 transition-colors"
          >
            <Maximize2 className="w-3 h-3" /> Open lesson
          </button>
        </div>
        <div className="p-2.5 space-y-0.5">
          {items.map((it, i) => (
            <button
              key={i}
              onClick={() => { setIdx(i); setOpen(true); }}
              className="w-full flex items-center gap-2.5 px-2 py-1.5 rounded-lg text-left hover:bg-card/70 transition-colors group"
            >
              <span className="w-5 h-5 rounded-full border border-accent/30 text-accent text-[10px] font-bold flex items-center justify-center flex-shrink-0 group-hover:bg-accent/10 transition-colors">
                {i + 1}
              </span>
              <span className="text-xs text-foreground/80 group-hover:text-foreground transition-colors flex-1 leading-snug">
                {it.term}
              </span>
              {it.replaces && (
                <span className="text-[10px] text-muted-foreground/50 flex-shrink-0 hidden sm:block">
                  replaces <span className="line-through">{it.replaces}</span>
                </span>
              )}
            </button>
          ))}
        </div>
      </div>
    </>
  );
}

export const PLANS: Record<string, TierPlan> = {
  foundation: FOUNDATION_PLAN,
  developing: DEVELOPING_PLAN,
  polishing: POLISHING_PLAN,
};

function getTier(band: number): "foundation" | "developing" | "polishing" {
  if (band <= 5.5) return "foundation";
  if (band <= 6.5) return "developing";
  return "polishing";
}

const FOCUS_ICONS: Record<string, typeof BookOpen> = {
  Grammar: BookOpen,
  Vocabulary: BookOpen,
  Reading: BookOpen,
  Listening: Headphones,
  Writing: PenTool,
  Speaking: Mic,
  "Speaking & Mock": Mic,
  "Mock & Review": Trophy,
  "Speaking + Mock": Mic,
  Review: Sparkles,
  "Exam Practice": Trophy,
  "Exam Strategy": Target,
};

const WEEK_COLORS = {
  blue:   { card: "border-blue-500/30 bg-blue-500/5",   badge: "bg-blue-500/20 text-blue-400", num: "bg-blue-500/20 text-blue-400" },
  green:  { card: "border-green-500/30 bg-green-500/5",  badge: "bg-green-500/20 text-green-400", num: "bg-green-500/20 text-green-400" },
  purple: { card: "border-purple-500/30 bg-purple-500/5", badge: "bg-purple-500/20 text-purple-400", num: "bg-purple-500/20 text-purple-400" },
  amber:  { card: "border-amber-500/30 bg-amber-500/5",  badge: "bg-amber-500/20 text-amber-400", num: "bg-amber-500/20 text-amber-400" },
  red:    { card: "border-red-500/30 bg-red-500/5",      badge: "bg-red-500/20 text-red-400", num: "bg-red-500/20 text-red-400" },
};

// ─────────────────────────────────────────────
// Game-map helpers
// ─────────────────────────────────────────────
const WEEK_BANNER_GRADIENTS: Record<string, string> = {
  blue:   "linear-gradient(135deg,#1279A0 0%,#48A8CC 100%)",
  purple: "linear-gradient(135deg,#6d28d9 0%,#a855f7 100%)",
  amber:  "linear-gradient(135deg,#b45309 0%,#f59e0b 100%)",
  green:  "linear-gradient(135deg,#047857 0%,#10b981 100%)",
  red:    "linear-gradient(135deg,#b91c1c 0%,#f87171 100%)",
};

function getNodeInfo(task: StudyTask): { color: string; shadow: string; IconComponent: React.ElementType } {
  const l = task.label.toLowerCase();
  if (l.startsWith("optional"))                          return { color: "#14b8a6", shadow: "#14b8a640", IconComponent: Sparkles };
  if (l.includes("worksheet"))                           return { color: "#6366f1", shadow: "#6366f140", IconComponent: ClipboardList };
  if (l.includes("mudahinaja"))                          return { color: "#f59e0b", shadow: "#f59e0b40", IconComponent: Brain };
  if (l.includes("revision notes") && l.includes("vocab")) return { color: "#a855f7", shadow: "#a855f740", IconComponent: Sparkles };
  if (l.includes("revision notes"))                     return { color: "#8b5cf6", shadow: "#8b5cf640", IconComponent: BookOpen };
  if (l.includes("reading"))                             return { color: "#3b82f6", shadow: "#3b82f640", IconComponent: BookOpen };
  if (l.includes("listening"))                           return { color: "#10b981", shadow: "#10b98140", IconComponent: Headphones };
  if (l.includes("writing"))                             return { color: "#f97316", shadow: "#f9731640", IconComponent: PenTool };
  if (l.includes("speaking"))                            return { color: "#ec4899", shadow: "#ec489940", IconComponent: Mic };
  if (l.includes("end-of-week") || l.includes("submit")) return { color: "#f59e0b", shadow: "#f59e0b40", IconComponent: Trophy };
  return { color: "#48A8CC", shadow: "#48A8CC40", IconComponent: BookOpen };
}

function shortTaskLabel(label: string): string {
  return label
    .replace(/^Day \d+:?\s*/i, "")
    .replace(/^Optional [A-Z]?:?\s*/i, "Optional: ")
    .split("(")[0]
    .replace(/^\s*—\s*/, "")
    .replace(/\s*(—|–)\s*.*$/, "")
    .trim();
}

// ─────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────
export default function StudyPlanPage() {
  const { user, profile, refreshProfile } = useAuth();
  const navigate = useNavigate();
  const [diagnosticBand, setDiagnosticBand] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [completedTasks, setCompletedTasks] = useState<Set<string>>(new Set());
  const [selectedTask, setSelectedTask] = useState<{ task: StudyTask; week: StudyWeek } | null>(null);
  const [showPlanSwitcher, setShowPlanSwitcher] = useState(false);
  const [savingTier, setSavingTier] = useState(false);
  const completedRef = useRef(completedTasks);
  completedRef.current = completedTasks;

  // Load diagnostic band score
  useEffect(() => {
    if (!user?.id) { setLoading(false); return; }
    supabase
      .from("user_progress")
      .select("band_score")
      .eq("user_id", user.id)
      .eq("exam_type", "diagnostic")
      .order("created_at", { ascending: false })
      .limit(1)
      .then(({ data }) => {
        if (data && data.length > 0 && data[0].band_score) {
          setDiagnosticBand(Number(data[0].band_score));
        }
        setLoading(false);
      });
  }, [user?.id]);

  // Load completed tasks: paint from localStorage cache instantly, then sync from Supabase
  useEffect(() => {
    if (!user?.id) return;
    const uid = user.id;
    const lsKey = `ielts-studyplan-${uid}`;

    try {
      const raw = localStorage.getItem(lsKey);
      if (raw) setCompletedTasks(new Set(JSON.parse(raw)));
    } catch { /* ignore */ }

    (supabase as any)
      .from("user_completed_questions")
      .select("question_id")
      .eq("user_id", uid)
      .eq("module", "study_plan")
      .then(({ data }: { data: { question_id: string }[] | null }) => {
        if (!data) return;
        setCompletedTasks(prev => {
          const merged = new Set([...prev, ...data.map(r => r.question_id)]);
          try { localStorage.setItem(lsKey, JSON.stringify([...merged])); } catch { /* ignore */ }
          return merged;
        });
      });
  }, [user?.id]);

  const toggleTask = useCallback((taskId: string) => {
    if (!user?.id) return;
    const uid = user.id;
    const lsKey = `ielts-studyplan-${uid}`;
    const wasChecked = completedRef.current.has(taskId);

    // Optimistic UI update + localStorage
    setCompletedTasks(prev => {
      const next = new Set(prev);
      if (wasChecked) next.delete(taskId); else next.add(taskId);
      try { localStorage.setItem(lsKey, JSON.stringify([...next])); } catch { /* ignore */ }
      return next;
    });

    // Sync to Supabase
    if (wasChecked) {
      (supabase as any)
        .from("user_completed_questions")
        .delete()
        .eq("user_id", uid)
        .eq("module", "study_plan")
        .eq("question_id", taskId)
        .then(({ error }: any) => { if (error) console.error(error); });
    } else {
      (supabase as any)
        .from("user_completed_questions")
        .upsert(
          { user_id: uid, module: "study_plan", question_id: taskId },
          { onConflict: "user_id,module,question_id", ignoreDuplicates: true }
        )
        .then(({ error }: any) => { if (error) console.error(error); });
    }
  }, [user?.id]);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center py-20">
          <div className="w-8 h-8 rounded-full border-2 border-accent/30 border-t-accent animate-spin" />
        </div>
      </DashboardLayout>
    );
  }

  if (!diagnosticBand) {
    return (
      <DashboardLayout>
        <div className="max-w-lg mx-auto text-center py-20 space-y-6">
          <div className="w-20 h-20 rounded-full bg-accent/10 flex items-center justify-center mx-auto">
            <Brain className="w-10 h-10 text-accent" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground mb-2">Take the Diagnostic First</h1>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Your personalised Study Roadmap is built from your diagnostic results. Complete the 20-question diagnostic quiz to unlock your week-by-week plan.
            </p>
          </div>
          <Button onClick={() => navigate("/dashboard/diagnostic")} className="gap-2">
            Take Diagnostic Quiz <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  const tierKey = profile?.preferred_plan_tier ?? getTier(diagnosticBand);
  const plan = PLANS[tierKey];

  const handleChangeTier = async (tier: "foundation" | "developing" | "polishing") => {
    if (!user) return;
    setSavingTier(true);
    await supabase.from("profiles").update({ preferred_plan_tier: tier }).eq("user_id", user.id);
    await refreshProfile();
    setSavingTier(false);
    setShowPlanSwitcher(false);
  };

  const allTasks = plan.weeks.flatMap(w => w.tasks);
  const totalTasks = allTasks.length;
  const completedCount = allTasks.filter(t => completedTasks.has(t.id)).length;
  const totalMinutes = allTasks.reduce((s, t) => s + t.minutes, 0);
  const weeksCompleted = plan.weeks.filter(w =>
    w.tasks.every(t => completedTasks.has(t.id))
  ).length;

  const tierBadgeColors: Record<string, string> = {
    foundation: "bg-blue-500/20 text-blue-400 border-blue-500/30",
    developing: "bg-purple-500/20 text-purple-400 border-purple-500/30",
    polishing: "bg-amber-500/20 text-amber-400 border-amber-500/30",
  };

  // ─── Horizontal map geometry (all weeks, continuous) ──────────────────────
  const NODE_SPACING = 130;
  const MAP_HEIGHT = 420;
  const WAVE_Y = [120, 180, 250, 300, 250, 180];

  const allTasksWithWeek = plan.weeks.flatMap(w => w.tasks.map(t => ({ task: t, week: w })));
  const globalActiveId = allTasksWithWeek.find(({ task }) => !completedTasks.has(task.id))?.task.id ?? null;

  const nodePositions = allTasksWithWeek.map((_, i) => ({
    x: 80 + i * NODE_SPACING,
    y: WAVE_Y[i % WAVE_Y.length],
  }));
  const totalMapWidth = Math.max(80 + (allTasksWithWeek.length - 1) * NODE_SPACING + 80, 400);

  const smoothPath = nodePositions.reduce((d, pos, i) => {
    if (i === 0) return `M ${pos.x},${pos.y}`;
    const prev = nodePositions[i - 1];
    const cx = (prev.x + pos.x) / 2;
    return `${d} C ${cx},${prev.y} ${cx},${pos.y} ${pos.x},${pos.y}`;
  }, "");

  // Start index of each week for boundary labels
  const weekBoundaries = plan.weeks.map(w => ({
    week: w,
    startIndex: allTasksWithWeek.findIndex(({ week }) => week.week === w.week),
  }));

  return (
    <DashboardLayout noPadding>
      {/* Full-bleed container */}
      <div className="flex flex-col flex-1 relative overflow-hidden bg-background">

        {/* ── Header stats ── */}
        <div className="relative z-10 px-5 pt-5 pb-3">
          <div className="max-w-4xl mx-auto">
            <Breadcrumb className="mb-3">
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink asChild>
                    <Link to="/dashboard" className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors">
                      <Home className="h-3.5 w-3.5" /> Home
                    </Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem><BreadcrumbPage>My Journey</BreadcrumbPage></BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>

            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className={cn("px-3 py-1 rounded-full text-xs font-medium border", tierBadgeColors[tierKey])}>
                {plan.tier} Track
              </span>
              <span className="text-xs text-muted-foreground">Predicted Band {diagnosticBand} → Target {plan.targetBand}</span>
              <button
                onClick={() => setShowPlanSwitcher(v => !v)}
                className="ml-auto text-[10px] font-medium text-accent/70 hover:text-accent border border-accent/20 hover:border-accent/50 rounded-full px-2.5 py-0.5 transition-colors"
              >
                {showPlanSwitcher ? "Cancel" : "Change track"}
              </button>
            </div>

            {/* Plan switcher */}
            {showPlanSwitcher && (
              <div className="mb-3 p-3 rounded-2xl border border-border/50 bg-card space-y-2">
                <p className="text-xs text-muted-foreground mb-2">Choose your learning track:</p>
                {(["foundation", "developing", "polishing"] as const).map(t => {
                  const p = PLANS[t];
                  const isSelected = tierKey === t;
                  return (
                    <button
                      key={t}
                      onClick={() => handleChangeTier(t)}
                      disabled={savingTier}
                      className={cn(
                        "w-full flex items-center gap-3 p-3 rounded-xl border text-left transition-all",
                        isSelected
                          ? "border-accent/50 bg-accent/8"
                          : "border-border/40 hover:border-accent/30 hover:bg-secondary/50"
                      )}
                    >
                      <div className={cn("w-2 h-2 rounded-full shrink-0", isSelected ? "bg-accent" : "bg-border")} />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-foreground">{p.tier} <span className="font-normal text-muted-foreground">· Band {p.bandRange}</span></p>
                        <p className="text-[10px] text-muted-foreground truncate">{p.headline}</p>
                      </div>
                      {isSelected && <CheckCircle2 className="w-4 h-4 text-accent shrink-0" />}
                      {savingTier && !isSelected && <div className="w-4 h-4 rounded-full border-2 border-accent/30 border-t-accent animate-spin shrink-0" />}
                    </button>
                  );
                })}
              </div>
            )}

            <h1 className="text-2xl font-bold text-foreground mb-3">Your Study Roadmap</h1>

            <div className="grid grid-cols-4 gap-2 mb-3">
              {[
                { label: "Weeks", value: plan.weeks.length },
                { label: "Done", value: weeksCompleted },
                { label: "Tasks", value: `${completedCount}/${totalTasks}` },
                { label: "Hours", value: `${Math.round(totalMinutes / 60)}h` },
              ].map(s => (
                <div key={s.label} className="rounded-xl p-3 text-center bg-card border border-border/40">
                  <p className="text-lg font-bold text-foreground">{s.value}</p>
                  <p className="text-[10px] text-muted-foreground mt-0.5">{s.label}</p>
                </div>
              ))}
            </div>

            <div>
              <div className="flex justify-between text-[11px] text-muted-foreground mb-1">
                <span>Overall progress</span>
                <span>{Math.round((completedCount / totalTasks) * 100)}%</span>
              </div>
              <div className="w-full rounded-full h-1.5 bg-border">
                <motion.div className="h-1.5 rounded-full bg-accent"
                  animate={{ width: `${(completedCount / totalTasks) * 100}%` }}
                  transition={{ duration: 0.5 }} />
              </div>
            </div>
          </div>
        </div>

        {/* ─── Continuous journey map ─── */}
        <div className="relative flex-1 z-10 min-h-[420px]">
          {/* Elite gate overlay */}
          {profile?.subscription_tier !== "elite" && (
            <div className="absolute inset-0 z-20 flex items-center justify-center">
              <div className="rounded-3xl p-7 border border-elite-gold/40 shadow-2xl text-center max-w-sm mx-4 space-y-4 bg-card">
                <div className="w-14 h-14 rounded-full bg-elite-gold/20 flex items-center justify-center mx-auto">
                  <Lock className="w-7 h-7 text-elite-gold" />
                </div>
                <div>
                  <p className="text-lg font-bold text-foreground">Elite members only</p>
                  <p className="text-sm text-muted-foreground mt-1.5 leading-relaxed">
                    Unlock your full {plan.weeks.length}-week personalised roadmap.
                    Guaranteed +1.5 band increase — or we coach you for free until you hit it.
                  </p>
                </div>
                <a href={buildWhatsAppLink("Hi Engvolve team, I'd like to upgrade to Elite to unlock my full Study Plan and get the +1.5 band guarantee.")}
                  target="_blank" rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full px-5 py-2.5 rounded-xl bg-elite-gold/20 text-elite-gold border border-elite-gold/40 hover:bg-elite-gold/30 transition-colors text-sm font-semibold">
                  <Crown className="w-4 h-4" /> Upgrade to Elite via WhatsApp
                </a>
              </div>
            </div>
          )}

          <div className={cn("h-full", profile?.subscription_tier !== "elite" && "blur-sm pointer-events-none select-none")}>
            <div className="overflow-x-auto overflow-y-visible h-full pb-10" style={{ WebkitOverflowScrolling: "touch" }}>
              <div className="relative" style={{ width: totalMapWidth, height: MAP_HEIGHT, minWidth: "100%" }}>

                {/* SVG: dashed path + week band backgrounds */}
                <svg className="absolute inset-0 pointer-events-none" width={totalMapWidth} height={MAP_HEIGHT}
                  style={{ overflow: "visible" }}>
                  {/* Subtle per-week lane shading */}
                  {weekBoundaries.map(({ week, startIndex }, bi) => {
                    const nextStart = weekBoundaries[bi + 1]?.startIndex ?? allTasksWithWeek.length;
                    const x1 = startIndex === 0 ? 0 : nodePositions[startIndex].x - NODE_SPACING / 2;
                    const x2 = nextStart < allTasksWithWeek.length
                      ? nodePositions[nextStart].x - NODE_SPACING / 2
                      : totalMapWidth;
                    const grad = WEEK_BANNER_GRADIENTS[week.color] ?? WEEK_BANNER_GRADIENTS.blue;
                    const baseColor = grad.match(/#[0-9a-fA-F]{6}/)?.[0] ?? "#48A8CC";
                    return (
                      <rect key={week.week} x={x1} y={0} width={x2 - x1} height={MAP_HEIGHT}
                        fill={baseColor} fillOpacity={0.06} rx={0} />
                    );
                  })}
                  {/* Dashed connector path */}
                  <path d={smoothPath} stroke="var(--border)" strokeWidth="3"
                    strokeDasharray="8,7" fill="none" strokeLinecap="round" />
                </svg>

                {/* Week label banners — pinned at the top of each section */}
                {weekBoundaries.map(({ week, startIndex }) => {
                  const pos = nodePositions[startIndex];
                  const grad = WEEK_BANNER_GRADIENTS[week.color] ?? WEEK_BANNER_GRADIENTS.blue;
                  const weekDone = week.tasks.filter(t => completedTasks.has(t.id)).length;
                  return (
                    <div key={week.week} style={{ position: "absolute", left: pos.x - 44, top: 4 }}>
                      <div className="flex items-center gap-1 px-2.5 py-1 rounded-full text-[9px] font-bold text-white whitespace-nowrap"
                        style={{ background: grad, boxShadow: "0 2px 8px rgba(0,0,0,0.18)" }}>
                        Week {week.week}
                        {weekDone === week.tasks.length
                          ? <span className="text-yellow-300">✓</span>
                          : <span className="opacity-70">{weekDone}/{week.tasks.length}</span>}
                      </div>
                    </div>
                  );
                })}

                {/* Nodes */}
                {allTasksWithWeek.map(({ task, week }, i) => {
                  const pos = nodePositions[i];
                  const done = completedTasks.has(task.id);
                  const isActive = task.id === globalActiveId;
                  const { color, shadow, IconComponent } = getNodeInfo(task);
                  const nodeColor = done ? "#22c55e" : color;
                  const nodeShadow = done ? "#22c55e40" : shadow;
                  const isWeekResourceTask = plan.tier === "Foundation" && !task.resourcePath && !task.sourceUrl && (week.externalResources?.length ?? 0) > 0;
                  const showSource = isWeekResourceTask || (plan.tier === "Foundation" && !!task.sourceUrl);

                  return (
                    <div key={task.id} style={{ position: "absolute", left: pos.x - 32, top: pos.y - 52 }}>
                      {/* Active tooltip */}
                      {isActive && (
                        <div className="absolute -top-10 left-1/2 -translate-x-1/2 z-20 pointer-events-none">
                          <div className="relative bg-foreground text-background rounded-xl shadow-2xl px-3 py-1.5 flex items-center gap-1.5 whitespace-nowrap">
                            <span className="text-xs font-extrabold">
                              {completedCount === 0 ? "START" : "CONTINUE"}
                            </span>
                            <span className="text-sm">⭐</span>
                            <div className="absolute top-full left-1/2 -translate-x-1/2 border-l-[6px] border-r-[6px] border-t-[6px] border-l-transparent border-r-transparent border-t-foreground" />
                          </div>
                        </div>
                      )}

                      {/* Checkmark badge (completed only) */}
                      {done && (
                        <div className="absolute top-0 right-0 z-10 w-5 h-5 rounded-full bg-green-500 flex items-center justify-center shadow-md border-2 border-background">
                          <svg className="w-2.5 h-2.5" viewBox="0 0 10 8" fill="none">
                            <path d="M1 4l3 3 5-6" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </div>
                      )}

                      {/* Node circle */}
                      <button
                        onClick={() => setSelectedTask({ task, week })}
                        className={cn(
                          "relative w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300 focus:outline-none mt-0",
                          isActive && "scale-110",
                        )}
                        style={{
                          background: nodeColor,
                          boxShadow: isActive
                            ? `0 0 0 6px ${nodeShadow}, 0 0 0 14px ${nodeShadow.replace("40","18")}, 0 10px 32px ${nodeShadow}`
                            : `0 6px 20px ${nodeShadow}, 0 2px 6px rgba(0,0,0,0.14)`,
                        }}
                      >
                        <div className="absolute inset-x-0 bottom-0 h-1/3 rounded-b-full bg-black/20 pointer-events-none" />
                        <div className="absolute inset-x-3 top-2 h-[28%] rounded-full bg-white/20 pointer-events-none" />
                        <IconComponent className="w-7 h-7 text-white relative z-10 drop-shadow" />
                        {isActive && (
                          <span className="absolute inset-0 rounded-full animate-ping opacity-20 pointer-events-none"
                            style={{ background: nodeColor }} />
                        )}
                      </button>

                      {/* Label */}
                      <p className="absolute top-[70px] left-1/2 -translate-x-1/2 text-[9.5px] text-center text-muted-foreground w-20 leading-tight line-clamp-2 whitespace-normal">
                        {shortTaskLabel(task.label)}
                      </p>

                      {/* Inline source indicator for Foundation tier */}
                      {isWeekResourceTask && (
                        <div className="absolute top-[90px] left-1/2 -translate-x-1/2 flex items-center gap-0.5 text-[8px] font-medium text-accent bg-accent/10 border border-accent/25 rounded-full px-2 py-0.5 whitespace-nowrap pointer-events-none">
                          <Newspaper className="w-2.5 h-2.5 shrink-0" /> {week.externalResources!.length} sources
                        </div>
                      )}
                      {!isWeekResourceTask && task.sourceUrl && (
                        <a
                          href={task.sourceUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={e => e.stopPropagation()}
                          className="absolute top-[90px] left-1/2 -translate-x-1/2 flex items-center gap-0.5 text-[8px] font-medium text-accent bg-accent/10 border border-accent/25 rounded-full px-2 py-0.5 whitespace-nowrap hover:bg-accent/20 transition-colors"
                        >
                          {task.sourceType === "video"
                            ? <><PlayCircle className="w-2.5 h-2.5 shrink-0" /> Watch</>
                            : <><ExternalLink className="w-2.5 h-2.5 shrink-0" /> Read</>}
                        </a>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Retake CTA */}
        <div className="relative z-10 px-5 pb-6 md:pb-4 pt-2">
          <div className="rounded-2xl p-4 flex items-center justify-between gap-4 bg-card border border-border/40">
            <div>
              <p className="text-sm font-medium text-foreground">Retake the diagnostic?</p>
              <p className="text-xs text-muted-foreground mt-0.5">Your roadmap updates automatically based on your latest diagnostic result.</p>
            </div>
            <Button variant="outline" size="sm" onClick={() => navigate("/dashboard/diagnostic")} className="gap-2 shrink-0">
              <Target className="w-4 h-4" /> Retake
            </Button>
          </div>
        </div>

        <div className="h-28 md:h-0 shrink-0" />
      </div>

      {/* ─── Task Detail Bottom Sheet ─── */}
        <AnimatePresence>
          {selectedTask && (() => {
            const { task, week } = selectedTask;
            const done = completedTasks.has(task.id);
            const { color, IconComponent } = getNodeInfo(task);
            const bannerGrad = WEEK_BANNER_GRADIENTS[week.color] ?? WEEK_BANNER_GRADIENTS.blue;

            return (
              <motion.div
                key="task-sheet"
                className="fixed inset-0 z-50 flex items-end justify-center"
              >
                {/* Backdrop */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                  onClick={() => setSelectedTask(null)}
                />

                {/* Sheet */}
                <motion.div
                  initial={{ y: "100%" }}
                  animate={{ y: 0 }}
                  exit={{ y: "100%" }}
                  transition={{ type: "spring", damping: 28, stiffness: 320 }}
                  className="relative w-full max-w-2xl bg-background rounded-t-3xl shadow-2xl max-h-[88vh] overflow-y-auto"
                  style={{ paddingBottom: "env(safe-area-inset-bottom, 20px)" }}
                >
                  {/* Drag handle */}
                  <div className="flex justify-center pt-3 pb-1 sticky top-0 bg-background/80 backdrop-blur-sm z-10">
                    <div className="w-10 h-1 rounded-full bg-border" />
                  </div>

                  {/* Coloured header strip */}
                  <div className="mx-4 mb-4 rounded-2xl overflow-hidden" style={{ background: bannerGrad }}>
                    <div className="flex items-center gap-3.5 px-4 py-4">
                      <div className="w-12 h-12 rounded-2xl bg-white/25 flex items-center justify-center shrink-0">
                        <IconComponent className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[10px] font-bold text-white/70 uppercase tracking-wider">
                          Week {week.week} · {week.focus}
                        </p>
                        <h2 className="text-base font-extrabold text-white leading-tight mt-0.5 line-clamp-2">
                          {task.label}
                        </h2>
                      </div>
                    </div>
                  </div>

                  <div className="px-4 pb-6 space-y-4">
                    {/* Duration + done badge */}
                    <div className="flex items-center gap-2">
                      <span className="flex items-center gap-1.5 text-xs text-muted-foreground bg-card border border-border/50 rounded-full px-3 py-1.5">
                        <Clock className="w-3.5 h-3.5" /> ~{task.minutes} min
                      </span>
                      {done && (
                        <span className="flex items-center gap-1 text-xs text-green-400 bg-green-500/10 border border-green-500/20 rounded-full px-3 py-1.5 font-semibold">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Completed
                        </span>
                      )}
                    </div>

                    {/* Description */}
                    <p className="text-sm text-muted-foreground leading-relaxed">{task.description}</p>

                    {/* Resource button */}
                    {task.resourcePath && (
                      <button
                        onClick={() => { navigate(task.resourcePath!); setSelectedTask(null); }}
                        className="w-full flex items-center gap-3 p-3.5 rounded-2xl border border-accent/30 bg-accent/5 hover:bg-accent/10 transition-colors text-left"
                      >
                        <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{ background: color }}>
                          <ExternalLink className="w-4 h-4 text-white" />
                        </div>
                        <span className="text-sm font-semibold text-accent flex-1 leading-snug">{task.resourceLabel}</span>
                        <ArrowRight className="w-4 h-4 text-accent/60 shrink-0" />
                      </button>
                    )}

                    {/* External article/video source */}
                    {task.sourceUrl && (
                      <a
                        href={task.sourceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full flex items-center gap-3 p-3.5 rounded-2xl border border-border/30 bg-card/60 hover:bg-card transition-colors"
                      >
                        {task.sourceType === "video"
                          ? <PlayCircle className="w-5 h-5 text-red-400 shrink-0" />
                          : <ExternalLink className="w-5 h-5 text-blue-400 shrink-0" />}
                        <span className="text-sm text-foreground/80 flex-1 leading-snug">
                          Open {task.sourceType === "video" ? "video" : "article"}: {shortTaskLabel(task.label)}
                        </span>
                      </a>
                    )}

                    {/* Vocab slideshow */}
                    {task.vocabList && <VocabSlideshow items={task.vocabList} />}

                    {/* Worksheet */}
                    {task.worksheetPrompts && <ExternalSourceWorksheetCard task={task} />}

                    {/* Week external resources (Foundation vocabulary/reading tasks) */}
                    {plan.tier === "Foundation" && !task.resourcePath && !task.sourceUrl && week.externalResources && week.externalResources.length > 0 && (
                      <div className="space-y-2">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60 flex items-center gap-1.5">
                          <Newspaper className="w-3 h-3" /> This week's resources ({week.weeklyTheme} theme)
                        </p>
                        <div className="space-y-2">
                          {week.externalResources.map((res, ri) => (
                            <a key={ri} href={res.url} target="_blank" rel="noopener noreferrer"
                              className="w-full flex items-center gap-3 p-3 rounded-2xl border border-border/40 bg-card hover:bg-card/80 transition-colors">
                              {res.type === "video"
                                ? <PlayCircle className="w-5 h-5 text-red-400 shrink-0" />
                                : <ExternalLink className="w-5 h-5 text-blue-400 shrink-0" />}
                              <span className="text-sm text-foreground/80 flex-1 leading-snug">{res.label}</span>
                              <ArrowRight className="w-4 h-4 text-muted-foreground/40 shrink-0" />
                            </a>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Mark complete CTA */}
                    <button
                      onClick={() => { toggleTask(task.id); setSelectedTask(null); }}
                      className={cn(
                        "w-full py-4 rounded-2xl text-base font-extrabold tracking-wide transition-all duration-200 shadow-lg active:scale-95",
                        done
                          ? "bg-card border-2 border-border text-muted-foreground hover:border-border/60"
                          : "text-white"
                      )}
                      style={!done ? {
                        background: `linear-gradient(135deg, ${color} 0%, ${color}cc 100%)`,
                        boxShadow: `0 4px 20px ${color}50`,
                      } : undefined}
                    >
                      {done ? "Undo — Mark as Incomplete" : "Mark as Complete ✓"}
                    </button>
                  </div>
                </motion.div>
              </motion.div>
            );
          })()}
        </AnimatePresence>

    </DashboardLayout>
  );
}
