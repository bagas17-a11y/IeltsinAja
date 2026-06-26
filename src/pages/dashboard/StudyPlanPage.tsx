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
  rows: number;
  placeholder?: string;
  sectionHeader?: string;
}

interface StudyTask {
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
}

interface ExternalResource {
  label: string;
  url: string;
  type: "video" | "article";
}

interface StudyWeek {
  week: number;
  theme: string;
  focus: string;
  color: "blue" | "green" | "purple" | "amber" | "red";
  rationale: string;
  tasks: StudyTask[];
  weeklyTheme?: string;
  externalResources?: ExternalResource[];
}

interface TierPlan {
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
          id: "f-w1-t1", label: "Revision Notes: Verb Tenses (Parts 1–5 + Mini Practice)",
          description: "Work through all five parts of the Verb Tenses notes covering present, past, future, perfect, and continuous tenses. Complete the mini practice at the end to check your understanding.",
          resourcePath: "/dashboard/revision-notes?topic=verb-tenses", resourceLabel: "Open Verb Tenses", minutes: 45,
        },
        {
          id: "f-w1-t2", label: "Revision Notes: Subject-Verb Agreement (All Parts + Mini Practice)",
          description: "Study all parts including singular/plural subjects, special patterns (there is/are, subjects joined by 'and'), and the mini practice. Pay attention to collective nouns like 'government' and 'number of'.",
          resourcePath: "/dashboard/revision-notes?topic=subject-verb-agreement", resourceLabel: "Open SVA Notes", minutes: 40,
        },
        {
          id: "f-w1-t3", label: "Vocabulary Expansion",
          description: "Read 2–3 of this week's external resources (Technology theme). Note down any new words, look up their collocations, and write one sentence using each.",
          minutes: 30,
        },
        {
          id: "f-w1-t4", label: "Worksheet: Verb Tenses & Subject-Verb Agreement",
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
          id: "f-w2-t1", label: "Revision Notes: Articles (All Parts + Mini Practice)",
          description: "Work through all parts covering when to use a/an, the, or no article. Complete the mini practice — focus especially on uncountable nouns and general statements ('Education is important' vs 'The education system…').",
          resourcePath: "/dashboard/revision-notes?topic=articles", resourceLabel: "Open Articles Notes", minutes: 40,
        },
        {
          id: "f-w2-t2", label: "Revision Notes: Sentence Structure & Conjunctions",
          description: "Read through the Sentence Structure notes focusing on compound and complex sentences. Pay attention to the 'See: Coordinating/Subordinating Conjunctions' links within those notes.",
          resourcePath: "/dashboard/revision-notes?topic=sentence-structure", resourceLabel: "Open Sentence Structure", minutes: 35,
        },
        {
          id: "f-w2-t3", label: "Revision Notes: Linking Words, Referencing & Coherence",
          description: "Study coordinating conjunctions (FANBOYS) and subordinating conjunctions. Practise writing 3 compound sentences and 3 complex sentences using different conjunctions from the tables.",
          resourcePath: "/dashboard/revision-notes?topic=linking-words-coherence", resourceLabel: "Open Linking Words", minutes: 35,
        },
        {
          id: "f-w2-t4", label: "Vocabulary Expansion",
          description: "Read 2–3 of this week's external resources (Health theme). For each article or video, write a 2–3 sentence summary using at least one linking word from your notes.",
          minutes: 30,
        },
        {
          id: "f-w2-t5", label: "Worksheet: Articles & Sentence Structures",
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
          id: "f-w3-t1", label: "Revision Notes: Verb Tenses — Part 6",
          description: "Return to the Verb Tenses notes and complete Part 6, which covers the most advanced tense patterns. This builds directly on Week 1 and prepares you for complex sentences in Writing and Speaking.",
          resourcePath: "/dashboard/revision-notes?topic=verb-tenses", resourceLabel: "Open Verb Tenses", minutes: 30,
        },
        {
          id: "f-w3-t2", label: "MudahinAja: How to Answer Each Module",
          description: "Open MudahinAja and go through the interactive tutorials for Writing, Listening, Reading, and Speaking. Learn the strategies for each module — structure, timing, and what the examiner expects.",
          resourcePath: "/dashboard/elite", resourceLabel: "Open MudahinAja", minutes: 30,
        },
        {
          id: "f-w3-t3", label: "Module Practice: Listening",
          description: "Complete one full Listening test. Use the pre-reading strategy: read the questions before the audio plays. Write your answers during the audio, not after.",
          resourcePath: "/dashboard/listening", resourceLabel: "Open Listening Module", minutes: 40,
        },
        {
          id: "f-w3-t4", label: "Module Practice: Reading",
          description: "Complete one full Reading test. Focus on identifying the question type first (True/False/Not Given, matching headings, etc.) before searching for the answer.",
          resourcePath: "/dashboard/reading", resourceLabel: "Open Reading Module", minutes: 60,
        },
        {
          id: "f-w3-t5", label: "Module Practice: Writing",
          description: "Attempt one Writing task (Task 1 or Task 2). Don't aim for perfection — focus on applying correct grammar from Weeks 1–2 and using linking words from your notes.",
          resourcePath: "/dashboard/writing", resourceLabel: "Open Writing Module", minutes: 40,
        },
        {
          id: "f-w3-t6", label: "Module Practice: Speaking",
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
          id: "f-w4-t1", label: "Full Module Practice: Listening",
          description: "Complete one full Listening test under timed conditions. After finishing, review every error and ask: was it a mishearing (strategy) or a spelling/grammar error (knowledge)?",
          resourcePath: "/dashboard/listening", resourceLabel: "Open Listening Module", minutes: 40,
        },
        {
          id: "f-w4-t2", label: "Full Module Practice: Reading",
          description: "Complete one full Reading test under timed conditions. After finishing, review errors and note whether they came from misreading the question, rushing, or vocabulary gaps.",
          resourcePath: "/dashboard/reading", resourceLabel: "Open Reading Module", minutes: 60,
        },
        {
          id: "f-w4-t3", label: "Full Module Practice: Writing",
          description: "Attempt both Task 1 and Task 2 in a single session. Use the grammar rules from Weeks 1–2. After the AI feedback, identify the one grammar category you still need to improve.",
          resourcePath: "/dashboard/writing", resourceLabel: "Open Writing Module", minutes: 60,
        },
        {
          id: "f-w4-t4", label: "Full Module Practice: Speaking",
          description: "Complete a full Speaking session. Record yourself for Part 2. Listen back and count how many times you correctly used a linking word or complex sentence.",
          resourcePath: "/dashboard/speaking", resourceLabel: "Open Speaking Module", minutes: 30,
        },
        {
          id: "f-w4-t5", label: "Reflection: Plan Your Next Step",
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
          id: "d-w1-t1",
          label: "Elite Hub: MudahinAja — All 4 Modules",
          description: "Open MudahinAja immediately. Work through the interactive tutorials for all four modules: Writing, Listening, Reading, and Speaking. These tutorials show you exactly how to approach each question type and what the examiner is looking for. Do not skip any module — the strategies in each one are used throughout the 4 weeks.",
          resourcePath: "/dashboard/elite",
          resourceLabel: "Open MudahinAja",
          minutes: 40,
        },
        {
          id: "d-w1-t2",
          label: "Revision Notes: Paragraph Structuring — The PEEL Blueprint",
          description: "Read through the full PEEL notes. This is a new framework: every body paragraph must have a Point (your argument), Evidence (one strong example), Explanation (2–4 sentences analysing what the evidence proves), and a Link back to the question. Most Band 6 essays have Point and Evidence but a weak or missing Explanation — that is the Band 7 gap. Complete the mini practice at the end.",
          resourcePath: "/dashboard/revision-notes?topic=paragraph-structuring",
          resourceLabel: "Open PEEL Notes",
          minutes: 35,
        },
        {
          id: "d-w1-t3",
          label: "Revision Notes: Linking Words, Referencing & Coherence",
          description: "Review the coordinating and subordinating conjunctions sections carefully. Focus on comma placement rules and the difference between coordinating conjunctions (joining equal clauses) and subordinating conjunctions (making one clause dependent). Complete the worksheet at the bottom of the page.",
          resourcePath: "/dashboard/revision-notes?topic=linking-words-coherence",
          resourceLabel: "Open Linking Words Notes",
          minutes: 30,
        },
        {
          id: "d-w1-t4",
          label: "Revision Notes: Text Types",
          description: "Work through the Text Types notes. Understand the differences between formal and informal registers, and between report, essay, letter, and general writing styles. Pay particular attention to the formal academic register — this is what IELTS Academic Writing Task 1 and Task 2 both require.",
          resourcePath: "/dashboard/revision-notes?topic=text-types",
          resourceLabel: "Open Text Types Notes",
          minutes: 25,
        },
        {
          id: "d-w1-t5",
          label: "Revision Notes: Hedging & Formal Academic Style",
          description: "Study hedging language — modals (may, might, could), adverbs (arguably, generally, typically), and reporting structures (It has been suggested that…). Hedging is required in academic writing to avoid overgeneralisation and shows the examiner you understand how academic arguments work. Complete the mini practice.",
          resourcePath: "/dashboard/revision-notes?topic=hedging-formal-style",
          resourceLabel: "Open Hedging Notes",
          minutes: 30,
        },
        { id: "d-w1-src1", label: "Day 1: Adventurous Travelling", description: "Read the article, then open the worksheet below to complete your notes.", sourceUrl: "https://www.bbc.com/travel/article/20260604-why-travellers-are-choosing-holidays-that-hurt", sourceType: "article", minutes: 20, worksheetPrompts: WEEK1_NOTES_PROMPTS },
        { id: "d-w1-src2", label: "Day 2: Sustainable Travelling", description: "Watch the video, then open the worksheet below to complete your notes.", sourceUrl: "https://youtu.be/we6VG3kdkOA?si=8hdIj7g3auqsOiRr", sourceType: "video", minutes: 20, worksheetPrompts: WEEK1_NOTES_PROMPTS },
        { id: "d-w1-src3", label: "Day 3: Tourism and Climate Change", description: "Watch the video, then open the worksheet below to complete your notes.", sourceUrl: "https://youtu.be/cZ8fw2F_E8Y?si=mFGhPQSxgKnuwL7l", sourceType: "video", minutes: 20, worksheetPrompts: WEEK1_NOTES_PROMPTS },
        { id: "d-w1-src4", label: "Day 4: Travel Airlines", description: "Read the article, then open the worksheet below to complete your notes.", sourceUrl: "https://edition.cnn.com/2026/05/01/travel/passengers-need-to-know-spirit-airlines", sourceType: "article", minutes: 20, worksheetPrompts: WEEK1_NOTES_PROMPTS },
        { id: "d-w1-src5", label: "Day 5: Reasons to Travel", description: "Read the article, then open the worksheet below to complete your notes.", sourceUrl: "https://www.nationalgeographic.com/travel/article/why-travel-should-be-considered-an-essential-human-activity", sourceType: "article", minutes: 20, worksheetPrompts: WEEK1_NOTES_PROMPTS },
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
          id: "d-w2-hw1",
          label: "End-of-Week: 1 Writing Question",
          description: "Attempt one full Writing Task 2. Choose a topic related to any Society source you read this week. Apply PEEL structure to both body paragraphs. Check: is your Explanation the longest section of each paragraph (2–4 sentences)?",
          resourcePath: "/dashboard/writing",
          resourceLabel: "Open Writing Module",
          minutes: 45,
        },
        {
          id: "d-w2-hw2",
          label: "End-of-Week: 1 Speaking Question",
          description: "Complete one full Speaking session. In Part 3, use at least one argument from this week's sources as supporting evidence. Screenshot your score.",
          resourcePath: "/dashboard/speaking",
          resourceLabel: "Open Speaking Module",
          minutes: 30,
        },
        {
          id: "d-w2-hw3",
          label: "Submit Scores to Group Chat",
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
          id: "d-w3-hw1",
          label: "End-of-Week Module Practice: Reading",
          description: "Complete one full Reading test. After finishing, review every incorrect True/False/Not Given answer: did the text confirm it, contradict it, or stay silent? 'Not Given' means the text is completely silent — not that the answer is unclear.",
          resourcePath: "/dashboard/reading",
          resourceLabel: "Open Reading Module",
          minutes: 60,
        },
        {
          id: "d-w3-hw2",
          label: "End-of-Week Module Practice: Listening",
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
          label: "Module Practice: Writing — PEEL Applied",
          description: "Attempt one Writing Task 2 at medium difficulty. Before you start, plan your two body paragraphs: write out your Point and Evidence for each. When you write the Explanation, aim for at least 3 sentences — this is where the Band 7 mark lives. After AI feedback, check: was your Explanation the longest part of each paragraph?",
          resourcePath: "/dashboard/writing",
          resourceLabel: "Open Writing Module",
          minutes: 45,
        },
        {
          id: "d-w4-t2",
          label: "Module Practice: Speaking — Complex Clauses & Conditionals",
          description: "Complete a full Speaking session at medium difficulty. In Parts 2 and 3, deliberately try to use at least one conditional sentence ('If governments were to… , the result would be…') and at least one complex clause with a relative pronoun ('one of the key reasons that… is…'). These are specifically flagged in the Band 7 Grammatical Range descriptor.",
          resourcePath: "/dashboard/speaking",
          resourceLabel: "Open Speaking Module",
          minutes: 30,
        },
        {
          id: "d-w4-t3",
          label: "Module Practice: Reading — Intent over Keywords",
          description: "Complete one Reading test at medium difficulty. For every True/False/Not Given question, locate the specific sentence in the text that the question is based on and decide: does the text CONFIRM it (True), CONTRADICT it (False), or not mention it at all (Not Given)? Do not rely on keywords alone — read the full sentence around each keyword.",
          resourcePath: "/dashboard/reading",
          resourceLabel: "Open Reading Module",
          minutes: 60,
        },
        {
          id: "d-w4-t4",
          label: "Module Practice: Listening — Section 4 Focus",
          description: "Complete one Listening test at medium difficulty. Section 4 (the monologue) is the hardest and most relevant to academic reading comprehension. After finishing, review any Section 4 errors: were they caused by mishearing, unfamiliar vocabulary, or losing your place?",
          resourcePath: "/dashboard/listening",
          resourceLabel: "Open Listening Module",
          minutes: 40,
        },
        {
          id: "d-w4-t5",
          label: "Reflection & Gap Analysis",
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
  description: "You already produce coherent, accurate English. The gap to Band 8 is precision: natural collocations, exact vocabulary choices, idiomatic fluency, and arguments that flow without overusing linking words. Over 3 weeks you build that repertoire through authentic reading and video materials — and in Week 4 you integrate everything in a full mock.",
  color: "amber",
  weeks: [
    {
      week: 1,
      theme: "Exam Review",
      focus: "Review",
      color: "blue",
      rationale: "Before drilling new vocabulary, you review the full exam format and consolidate the writing skills and idiomatic expressions that distinguish Band 8 from Band 7. You then engage with the first three source topics, applying your idioms to speak about real-world content rather than memorising a list. You are encouraged to also preview next week's source materials if you have time.",
      tasks: [
        {
          id: "p-w1-t1",
          label: "Elite Hub: MudahinAja — All 4 Modules",
          description: "Open MudahinAja and work through the interactive tutorials for all four modules. At this level, focus on the nuance — the exact Band 8 strategies for Reading inference, Speaking discourse markers, and Writing Task 2 counterargument structure.",
          resourcePath: "/dashboard/elite",
          resourceLabel: "Open MudahinAja",
          minutes: 40,
        },
        {
          id: "p-w1-t2",
          label: "Revision Notes: Paragraph Structuring — PEEL at Band 8",
          description: "Review the PEEL notes with a Band 8 lens. At this level, your Explanation section should move beyond analysis of the example to reflect on the societal value or broader impact — ask yourself: what does this point mean for people, systems, or society as a whole?",
          resourcePath: "/dashboard/revision-notes?topic=paragraph-structuring",
          resourceLabel: "Open PEEL Notes",
          minutes: 25,
        },
        {
          id: "p-w1-t3",
          label: "Revision Notes: Text Types",
          description: "Review Text Types with a focus on formal academic register. At Band 8, the distinction is not just 'formal vs informal' — it is choosing the register that suits the specific audience and purpose: a Task 1 report has a different register to a Task 2 discursive essay.",
          resourcePath: "/dashboard/revision-notes?topic=text-types",
          resourceLabel: "Open Text Types Notes",
          minutes: 20,
        },
        {
          id: "p-w1-t4",
          label: "Revision Notes: Hedging & Formal Academic Style",
          description: "Revisit hedging with focus on the balance between hedging and conviction. Band 8 writing hedges the right claims (contested, uncertain, speculative) while making other claims decisively. Hedging everything sounds uncertain; hedging nothing sounds dogmatic.",
          resourcePath: "/dashboard/revision-notes?topic=hedging-formal-style",
          resourceLabel: "Open Hedging Notes",
          minutes: 25,
        },
        {
          id: "p-w1-t5",
          label: "Revision Notes: Vocabulary Bank — Idiomatic Expressions",
          description: "Open the Vocabulary Passages section and study the Idiomatic Expressions list. For each idiom, read the meaning and the natural use example. Do not try to memorise the list — identify the 3–4 idioms you can imagine using naturally in a speaking or writing context.",
          resourcePath: "/dashboard/revision-notes?topic=vocabulary-passages",
          resourceLabel: "Open Vocabulary Bank",
          minutes: 20,
        },
        {
          id: "p-w1-env-article",
          label: "Environment & Energy: Turkish Droughts (Article)",
          description: "Read the article, then open the worksheet to practise using idiomatic expressions. You are encouraged to also engage with the video for this topic — either now or across the next two weeks.",
          sourceUrl: "https://www.bbc.com/future/article/20260624-droughts-are-transforming-the-turkish-landscape-with-massive-sinkholes",
          sourceType: "article",
          minutes: 20,
          worksheetPrompts: WEEK_POLISHING1_IDIOM_PROMPTS,
        },
        {
          id: "p-w1-env-video",
          label: "Environment & Energy: Restoring Biodiversity (Video)",
          description: "Watch the video, then open the worksheet to practise using idiomatic expressions.",
          sourceUrl: "https://youtu.be/yJX1Te0jey0?si=5xwqm0RGxHUA85sE",
          sourceType: "video",
          minutes: 20,
          worksheetPrompts: WEEK_POLISHING1_IDIOM_PROMPTS,
        },
        {
          id: "p-w1-tech-article",
          label: "Technology & Innovation: Future of Screens (Article)",
          description: "Read the article, then open the worksheet to practise using idiomatic expressions.",
          sourceUrl: "https://www.bbc.com/future/article/20260624-why-tech-companies-want-to-take-away-your-screen",
          sourceType: "article",
          minutes: 20,
          worksheetPrompts: WEEK_POLISHING1_IDIOM_PROMPTS,
        },
        {
          id: "p-w1-tech-video",
          label: "Technology & Innovation: Controversies of Technology (Video)",
          description: "Watch the video, then open the worksheet to practise using idiomatic expressions.",
          sourceUrl: "https://youtu.be/QO3nY_u6hos?si=pDU2-sfJbWDJ_jAK",
          sourceType: "video",
          minutes: 20,
          worksheetPrompts: WEEK_POLISHING1_IDIOM_PROMPTS,
        },
        {
          id: "p-w1-edu-article",
          label: "Education & Employment: Consequences of AI in Education (Article)",
          description: "Read the article, then open the worksheet to practise using idiomatic expressions.",
          sourceUrl: "https://edition.cnn.com/2026/06/01/health/screens-in-school-education-tech-wellness",
          sourceType: "article",
          minutes: 20,
          worksheetPrompts: WEEK_POLISHING1_IDIOM_PROMPTS,
        },
        {
          id: "p-w1-edu-video",
          label: "Education & Employment: Benefits of AI in Education (Video)",
          description: "Watch the video, then open the worksheet to practise using idiomatic expressions.",
          sourceUrl: "https://youtu.be/hJP5GqnTrNo?si=82tHzMplmcz_c4G6",
          sourceType: "video",
          minutes: 20,
          worksheetPrompts: WEEK_POLISHING1_IDIOM_PROMPTS,
        },
      ],
    },
    {
      week: 2,
      theme: "Vocabulary Expansion — Precision Drilling",
      focus: "Vocabulary",
      color: "purple",
      rationale: "Precision drilling trains you to use exact transitory phrases and data descriptors that distinguish Band 8 writing from Band 7. Rather than memorising a list, you identify where these phrases would naturally appear in real-world text and write your own sentences applying them. Engage with both materials for each topic if you can; at minimum, choose one article and one video across the three topics.",
      tasks: [
        {
          id: "p-w2-t1",
          label: "Revision Notes: Vocabulary Bank — Transitory Phrases",
          description: "Open the Vocabulary Passages revision note and study the Transitory Phrases section. For each category (Adding an idea, Contrasting, Cause & effect, Giving examples, Hedging, Concluding), identify one phrase you want to prioritise using this week.",
          resourcePath: "/dashboard/revision-notes?topic=vocabulary-passages",
          resourceLabel: "Open Vocabulary Bank",
          minutes: 20,
        },
        {
          id: "p-w2-t2",
          label: "Revision Notes: Vocabulary Bank — Data Descriptors",
          description: "Study the Data Descriptors section of the Vocabulary Bank. Focus on the Band 8 upgrades for the most common verbs — 'went up', 'went down', 'stayed the same', 'the highest point'. These are the phrases your Task 1 essay needs most urgently at Band 8.",
          resourcePath: "/dashboard/revision-notes?topic=vocabulary-passages",
          resourceLabel: "Open Vocabulary Bank",
          minutes: 20,
        },
        {
          id: "p-w2-crime-article",
          label: "Crime & Justice: Organized Crime and Punishment (Article)",
          description: "Read the article. Look for moments where a transitory phrase would strengthen the argument flow, and for any data or facts that could be described with Band 8 precision. Then complete the worksheet.",
          sourceUrl: "https://www.bbc.com/news/articles/c0jyq3990jeo",
          sourceType: "article",
          minutes: 25,
          worksheetPrompts: WEEK_POLISHING2_PRECISION_PROMPTS,
        },
        {
          id: "p-w2-crime-video",
          label: "Crime & Justice: Crime Investigation (Video)",
          description: "Watch the video, looking for factual claims and argument transitions. Then complete the worksheet.",
          sourceUrl: "https://youtu.be/hQuB4784JPc?si=uXldKsyJe1fs-FK2",
          sourceType: "video",
          minutes: 25,
          worksheetPrompts: WEEK_POLISHING2_PRECISION_PROMPTS,
        },
        {
          id: "p-w2-econ-article",
          label: "Economy & Business: Inflation in the US Economy (Article)",
          description: "Read the article — it likely contains data and statistics that are ideal for data descriptor practice. Then complete the worksheet.",
          sourceUrl: "https://edition.cnn.com/2026/06/25/economy/us-pce-inflation-may",
          sourceType: "article",
          minutes: 25,
          worksheetPrompts: WEEK_POLISHING2_PRECISION_PROMPTS,
        },
        {
          id: "p-w2-econ-video",
          label: "Economy & Business: Utilizing Behavioral Economics (Video)",
          description: "Watch the video, then complete the worksheet applying transitory phrases and data descriptors.",
          sourceUrl: "https://youtu.be/bTDBeI-mtDg?si=OFVJxte_t5Jr8Am9",
          sourceType: "video",
          minutes: 25,
          worksheetPrompts: WEEK_POLISHING2_PRECISION_PROMPTS,
        },
        {
          id: "p-w2-soc-article",
          label: "Society & Lifestyle: Lifestyle and Disease Prevention (Article)",
          description: "Read the article, then complete the worksheet.",
          sourceUrl: "https://edition.cnn.com/2025/07/16/health/heart-health-whole-body-wellness",
          sourceType: "article",
          minutes: 25,
          worksheetPrompts: WEEK_POLISHING2_PRECISION_PROMPTS,
        },
        {
          id: "p-w2-soc-video",
          label: "Society & Lifestyle: What Makes a Happy Life? (Video)",
          description: "Watch the video, then complete the worksheet.",
          sourceUrl: "https://youtu.be/8KkKuTCFvzI?si=npj8LeZOkKMAwXUs",
          sourceType: "video",
          minutes: 25,
          worksheetPrompts: WEEK_POLISHING2_PRECISION_PROMPTS,
        },
      ],
    },
    {
      week: 3,
      theme: "Vocabulary Expansion — Sophistication Drilling",
      focus: "Vocabulary",
      color: "amber",
      rationale: "Sophistication drilling trains you to use topic-specific high-band collocations and paraphrasing instinctively. You rewrite real facts from authentic sources using the Band 8 collocation banks — not to produce perfect academic essays, but to build the habit of reaching for the precise word when you need it in the exam.",
      tasks: [
        {
          id: "p-w3-t1",
          label: "Revision Notes: Collocations & Paraphrasing — Topic Collocations",
          description: "Open the Collocations & Paraphrasing revision note and study Section 2. Focus on the collocation categories that match the topics you plan to read this week: Health & Medicine, Media & Public Opinion, Government & Politics. Identify 4–5 collocations per topic that you want to use in your rewrites.",
          resourcePath: "/dashboard/revision-notes?topic=collocations-paraphrasing",
          resourceLabel: "Open Collocations Notes",
          minutes: 25,
        },
        {
          id: "p-w3-t2",
          label: "Revision Notes: Vocabulary Bank — Idiomatic Expressions (Review)",
          description: "Revisit the Idiomatic Expressions section of the Vocabulary Bank. This time, try to recall the meaning of each idiom before reading its definition. If you can use an idiom naturally without looking it up, you have internalised it.",
          resourcePath: "/dashboard/revision-notes?topic=vocabulary-passages",
          resourceLabel: "Open Vocabulary Bank",
          minutes: 15,
        },
        {
          id: "p-w3-health-video",
          label: "Health & Medicine: Neurological Benefits of Exercise (Video)",
          description: "Watch the video, looking for facts and claims you can rewrite using Health & Medicine collocations. Then complete the worksheet.",
          sourceUrl: "https://youtu.be/BHY0FxzoKZE?si=eK5x6FWjLMNu7csm",
          sourceType: "video",
          minutes: 25,
          worksheetPrompts: WEEK_POLISHING3_SOPHISTICATION_PROMPTS,
        },
        {
          id: "p-w3-health-article",
          label: "Health & Medicine: Maternity and Neonatal Care (Article)",
          description: "Read the article, then complete the worksheet using Health & Medicine collocations.",
          sourceUrl: "https://www.bbc.com/news/articles/c2kyn81epdvo",
          sourceType: "article",
          minutes: 25,
          worksheetPrompts: WEEK_POLISHING3_SOPHISTICATION_PROMPTS,
        },
        {
          id: "p-w3-media-article",
          label: "Media & Public Opinion: Media and Misinformation (Article)",
          description: "Read the article, then complete the worksheet using Media & Public Opinion collocations.",
          sourceUrl: "https://edition.cnn.com/2023/02/15/media/gallup-knight-foundation-report-reliable-sources",
          sourceType: "article",
          minutes: 25,
          worksheetPrompts: WEEK_POLISHING3_SOPHISTICATION_PROMPTS,
        },
        {
          id: "p-w3-media-video",
          label: "Media & Public Opinion: Social Media and Political Perception (Video)",
          description: "Watch the video, then complete the worksheet using Media & Public Opinion collocations.",
          sourceUrl: "https://youtu.be/GWaKaOGW55w?si=2jdDzUVwHiRTmDd7",
          sourceType: "video",
          minutes: 25,
          worksheetPrompts: WEEK_POLISHING3_SOPHISTICATION_PROMPTS,
        },
        {
          id: "p-w3-gov-article",
          label: "Government & Politics: Affordable Housing (Article)",
          description: "Read the article, then complete the worksheet using Government & Politics collocations.",
          sourceUrl: "https://edition.cnn.com/2026/03/12/business/housing-affordability-bill-senate",
          sourceType: "article",
          minutes: 25,
          worksheetPrompts: WEEK_POLISHING3_SOPHISTICATION_PROMPTS,
        },
        {
          id: "p-w3-gov-video",
          label: "Government & Politics: US Politics (Video)",
          description: "Watch the video, then complete the worksheet using Government & Politics collocations.",
          sourceUrl: "https://youtu.be/1Ws3w_ZOmhI?si=dMbOdA9JguGwA9LD",
          sourceType: "video",
          minutes: 25,
          worksheetPrompts: WEEK_POLISHING3_SOPHISTICATION_PROMPTS,
        },
      ],
    },
    {
      week: 4,
      theme: "Exam Integration",
      focus: "Exam Practice",
      color: "green",
      rationale: "Three weeks of precision vocabulary drilling, now applied under full exam conditions. Your goal is not to use as many Band 8 phrases as possible — it is to use them naturally, only where they genuinely fit. One precise collocation in the right place is worth more than three forced ones.",
      tasks: [
        {
          id: "p-w4-t1",
          label: "Mock Practice: Listening",
          description: "Complete one full Listening test under timed conditions. After finishing, review your errors: were they caused by mishearing, unfamiliar vocabulary, or losing your place in the audio?",
          resourcePath: "/dashboard/listening",
          resourceLabel: "Open Listening Module",
          minutes: 40,
        },
        {
          id: "p-w4-t2",
          label: "Mock Practice: Reading",
          description: "Complete one full Reading test. At Band 8, errors are almost always inference errors — the text implied something and you either over-read or under-read it. After finishing, focus your error review exclusively on inference questions.",
          resourcePath: "/dashboard/reading",
          resourceLabel: "Open Reading Module",
          minutes: 60,
        },
        {
          id: "p-w4-t3",
          label: "Mock Practice: Writing",
          description: "Complete both Task 1 and Task 2. In Task 1, use at least 2 data descriptor upgrades from your Vocabulary Bank. In Task 2, use at least 1 topic-specific collocation, 1 transitory phrase, and 1 idiomatic expression — only where they fit naturally. After AI feedback, note which language upgrades landed well and which felt forced.",
          resourcePath: "/dashboard/writing",
          resourceLabel: "Open Writing Module",
          minutes: 60,
        },
        {
          id: "p-w4-t4",
          label: "Mock Practice: Speaking",
          description: "Complete a full Speaking session. In Part 3, use at least 1 idiom naturally — if you cannot find a moment where it fits, do not force it. After the session, assess your fluency: did your language feel natural or rehearsed? The difference is Band 8.",
          resourcePath: "/dashboard/speaking",
          resourceLabel: "Open Speaking Module",
          minutes: 30,
        },
      ],
    },
  ],
};

// ─────────────────────────────────────────────
// ExternalSourceWorksheetCard — answer space for source-based worksheets
function ExternalSourceWorksheetCard({ task }: { task: StudyTask }) {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [open, setOpen] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);

  const setAnswer = (id: string, val: string) =>
    setAnswers(prev => ({ ...prev, [id]: val }));

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
  .source{font-size:12px;color:#2563eb;margin-bottom:20px}
  .qblock{margin-bottom:14px;padding:12px;border:1px solid #e2e8f0;border-radius:8px;page-break-inside:avoid}
  .qlabel{font-size:12px;font-weight:700;color:#1e40af;margin-bottom:3px}
  .qinstr{font-size:11px;color:#64748b;margin-bottom:8px;line-height:1.5}
  .ans{padding:10px 12px;border-radius:6px;border:1px solid #cbd5e1;background:#f8fafc;font-size:13px;min-height:60px;white-space:pre-wrap;line-height:1.6}
  .print-btn{display:inline-flex;align-items:center;gap:6px;margin-bottom:20px;padding:8px 16px;background:#1e40af;color:#fff;border:none;border-radius:6px;font-size:13px;cursor:pointer}
  @media print{.print-btn{display:none!important}}
</style></head><body>
<button class="print-btn" onclick="window.print()">Print / Save as PDF</button>
<h1>${task.label}</h1>
<div class="meta">Completed: ${date} | For review by the Eng-InAja coaching team</div>
${task.sourceUrl ? `<div class="source">Source: <a href="${task.sourceUrl}">${task.sourceUrl}</a></div>` : ""}
${prompts.map(p => `
${p.sectionHeader ? `<div class="sec-header">${p.sectionHeader}</div>` : ""}
<div class="qblock">
  <div class="qlabel">${p.label}</div>
  <div class="qinstr">${p.instruction}</div>
  <div class="ans">${answers[p.id] || '<span style="color:#94a3b8;font-style:italic">No answer given</span>'}</div>
</div>`).join("")}
</body></html>`;
    const win = window.open("", "_blank");
    if (win) { win.document.write(html); win.document.close(); }
  };

  const worksheetContent = (isFS: boolean) => (
    <div className={cn("space-y-4", isFS ? "p-6 max-w-3xl mx-auto" : "pt-3")}>
      {/* Source link */}
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

      {/* Questions */}
      {task.worksheetPrompts!.map(prompt => (
        <div key={prompt.id} className="space-y-1.5">
          {prompt.sectionHeader && (
            <p className="text-[10px] font-bold text-purple-400 uppercase tracking-widest pt-1 pb-0.5 border-b border-purple-500/20">
              {prompt.sectionHeader}
            </p>
          )}
          <div>
            <p className="text-xs font-semibold text-foreground/90">{prompt.label}</p>
            <p className="text-xs text-muted-foreground leading-relaxed mt-0.5">{prompt.instruction}</p>
          </div>
          <textarea
            value={answers[prompt.id] || ""}
            onChange={e => setAnswer(prompt.id, e.target.value)}
            rows={prompt.rows}
            placeholder={prompt.placeholder || "Type your answer here…"}
            className="w-full rounded-lg border border-border bg-background/80 px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-1 focus:ring-blue-500/50 resize-y leading-relaxed"
          />
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

const PLANS: Record<string, TierPlan> = {
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
// Component
// ─────────────────────────────────────────────
export default function StudyPlanPage() {
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const [diagnosticBand, setDiagnosticBand] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [completedTasks, setCompletedTasks] = useState<Set<string>>(new Set());
  const [expandedWeek, setExpandedWeek] = useState<number | null>(1);
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

  const tierKey = getTier(diagnosticBand);
  const plan = PLANS[tierKey];

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

  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto space-y-8">
        {/* Breadcrumb */}
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link to="/dashboard" className="flex items-center gap-1.5">
                  <Home className="h-3.5 w-3.5" /> Home
                </Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem><BreadcrumbPage>Study Roadmap</BreadcrumbPage></BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {/* Hero */}
        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className={cn("px-3 py-1 rounded-full text-xs font-medium border", tierBadgeColors[tierKey])}>
              {plan.tier} Track
            </span>
            <span className="text-xs text-muted-foreground">Predicted Band {diagnosticBand} → Target {plan.targetBand}</span>
          </div>
          <h1 className="text-3xl font-bold text-foreground">Your Study Roadmap</h1>
          <p className="text-muted-foreground leading-relaxed max-w-2xl">{plan.description}</p>

          {/* Stats row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: "Weeks", value: plan.weeks.length, sub: "total" },
              { label: "Completed", value: weeksCompleted, sub: "weeks" },
              { label: "Tasks done", value: `${completedCount}/${totalTasks}`, sub: "" },
              { label: "Total time", value: `${Math.round(totalMinutes / 60)}h`, sub: "study hours" },
            ].map(s => (
              <div key={s.label} className="glass-card p-4 text-center">
                <p className="text-2xl font-bold text-accent">{s.value}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{s.label}{s.sub ? ` ${s.sub}` : ""}</p>
              </div>
            ))}
          </div>

          {/* Progress bar */}
          <div>
            <div className="flex justify-between text-xs text-muted-foreground mb-1.5">
              <span>Overall progress</span>
              <span>{Math.round((completedCount / totalTasks) * 100)}%</span>
            </div>
            <div className="w-full bg-border/50 rounded-full h-2">
              <motion.div
                className="bg-accent h-2 rounded-full"
                animate={{ width: `${(completedCount / totalTasks) * 100}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </div>
        </div>

        {/* Week cards — gated for non-Elite */}
        <div className="relative">
        {profile?.subscription_tier !== "elite" && (
          <div className="absolute inset-0 z-10 flex items-center justify-center">
            <div className="glass-card p-7 border border-elite-gold/40 bg-card/95 shadow-xl text-center max-w-sm mx-4 space-y-4">
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
              <a
                href={buildWhatsAppLink("Hi Eng-InAja team, I'd like to upgrade to Elite to unlock my full Study Plan and get the +1.5 band guarantee.")}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full px-5 py-2.5 rounded-xl bg-elite-gold/20 text-elite-gold border border-elite-gold/40 hover:bg-elite-gold/30 transition-colors text-sm font-semibold"
              >
                <Crown className="w-4 h-4" /> Upgrade to Elite via WhatsApp
              </a>
            </div>
          </div>
        )}
        <div className={cn("space-y-3", profile?.subscription_tier !== "elite" && "blur-sm pointer-events-none select-none")}>
          {plan.weeks.map(week => {
            const weekTasks = week.tasks;
            const weekDone = weekTasks.filter(t => completedTasks.has(t.id)).length;
            const allDone = weekDone === weekTasks.length;
            const isOpen = expandedWeek === week.week;
            const colors = WEEK_COLORS[week.color];
            const FocusIcon = FOCUS_ICONS[week.focus] ?? BookOpen;

            return (
              <div key={week.week} className={cn("rounded-xl border transition-all", allDone ? "border-green-500/30 bg-green-500/5" : `${colors.card}`)}>
                {/* Week header */}
                <button
                  onClick={() => setExpandedWeek(isOpen ? null : week.week)}
                  className="w-full flex items-center gap-4 p-4 text-left"
                >
                  <div className={cn("w-9 h-9 rounded-full flex items-center justify-center shrink-0 text-sm font-bold", allDone ? "bg-green-500/20 text-green-400" : colors.num)}>
                    {allDone ? <CheckCircle2 className="w-4 h-4" /> : week.week}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="text-sm font-semibold text-foreground">{week.theme}</p>
                      <span className={cn("text-[10px] px-2 py-0.5 rounded-full font-medium", allDone ? "bg-green-500/20 text-green-400" : colors.badge)}>
                        {week.focus}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 mt-0.5">
                      <p className="text-xs text-muted-foreground">{weekDone}/{weekTasks.length} tasks</p>
                      <div className="flex-1 max-w-[120px] bg-border/30 rounded-full h-1">
                        <div
                          className={cn("h-1 rounded-full transition-all", allDone ? "bg-green-500" : "bg-accent")}
                          style={{ width: `${(weekDone / weekTasks.length) * 100}%` }}
                        />
                      </div>
                      <p className="text-xs text-muted-foreground flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {Math.round(weekTasks.reduce((s, t) => s + t.minutes, 0) / 60 * 10) / 10}h
                      </p>
                    </div>
                  </div>
                  <ChevronDown className={cn("w-4 h-4 text-muted-foreground shrink-0 transition-transform duration-200", isOpen && "rotate-180")} />
                </button>

                {/* Expanded content */}
                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      className="overflow-hidden"
                    >
                      <div className="px-4 pb-4 space-y-4 border-t border-border/20 pt-4">
                        {/* Rationale */}
                        <div className="flex gap-2 p-3 rounded-lg bg-card/50 border border-border/30">
                          <Sparkles className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                          <p className="text-xs text-muted-foreground leading-relaxed">{week.rationale}</p>
                        </div>

                        {/* Tasks */}
                        <div className="space-y-2.5">
                          {weekTasks.map((task, ti) => {
                            const done = completedTasks.has(task.id);
                            return (
                              <div key={task.id} className={cn("flex gap-3 p-3.5 rounded-xl border transition-all", done ? "bg-green-500/5 border-green-500/20" : "bg-card/40 border-border/20")}>
                                <button
                                  onClick={() => toggleTask(task.id)}
                                  className="shrink-0 mt-0.5 transition-colors"
                                >
                                  {done
                                    ? <CheckCircle2 className="w-5 h-5 text-green-500" />
                                    : <Circle className="w-5 h-5 text-muted-foreground/40 hover:text-accent/50" />
                                  }
                                </button>
                                <div className="flex-1 min-w-0">
                                  <p className={cn("text-sm font-medium leading-snug", done ? "text-muted-foreground line-through" : "text-foreground")}>
                                    {task.label}
                                  </p>
                                  <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{task.description}</p>
                                  {task.vocabList && <VocabSlideshow items={task.vocabList} />}
                                  {task.worksheetPrompts && <ExternalSourceWorksheetCard task={task} />}
                                  <div className="flex items-center gap-3 mt-2">
                                    <span className="text-xs text-muted-foreground/60 flex items-center gap-1">
                                      <Clock className="w-3 h-3" /> ~{task.minutes} min
                                    </span>
                                    {task.resourcePath && (
                                      <button
                                        onClick={() => navigate(task.resourcePath!)}
                                        className="text-xs text-accent hover:underline flex items-center gap-1"
                                      >
                                        {task.resourceLabel} <ChevronRight className="w-3 h-3" />
                                      </button>
                                    )}
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>

                        {week.externalResources && week.externalResources.length > 0 && (
                          <div className="mt-4">
                            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2 flex items-center gap-1.5">
                              <Newspaper className="w-3.5 h-3.5" />
                              External Resources{week.weeklyTheme ? ` — ${week.weeklyTheme}` : ""}
                            </p>
                            <div className="space-y-1.5">
                              {week.externalResources.map((res, ri) => (
                                <a
                                  key={ri}
                                  href={res.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex items-center gap-2 text-xs text-muted-foreground hover:text-accent transition-colors group"
                                >
                                  {res.type === "video"
                                    ? <PlayCircle className="w-3.5 h-3.5 text-red-400 shrink-0" />
                                    : <ExternalLink className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                                  }
                                  <span className="group-hover:underline underline-offset-2">{res.label}</span>
                                  <span className="text-muted-foreground/40 text-[10px]">{res.type === "video" ? "YouTube" : "Article"}</span>
                                </a>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
        </div>

        {/* Bottom retake CTA */}
        <div className="glass-card p-5 flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-foreground">Retake the diagnostic?</p>
            <p className="text-xs text-muted-foreground mt-0.5">Your roadmap updates automatically based on your latest diagnostic result.</p>
          </div>
          <Button variant="outline" size="sm" onClick={() => navigate("/dashboard/diagnostic")} className="gap-2 shrink-0">
            <Target className="w-4 h-4" /> Retake
          </Button>
        </div>
      </div>
    </DashboardLayout>
  );
}
