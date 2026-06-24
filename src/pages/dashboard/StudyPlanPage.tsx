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
  label: string;    // e.g. "Writing Task 2", "Speaking Part 3"
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
    instruction: "Write a 150–200 word response covering all three parts: (a) a summary of the main argument, (b) what evidence the author used to support it, and (c) your personal opinion on the argument and your reason for holding it.",
    rows: 9,
    placeholder: "The author's main argument is…\nThe evidence used includes…\nIn my view…",
  },
  {
    id: "q2-peel",
    label: "Q2 — PEEL Counter-Argument (~100 words)",
    instruction: "Pick one argument from the source. Write a ~100-word paragraph defending the OPPOSITE side, following the PEEL structure: Point (your counter-claim) → Evidence (one supporting example) → Explanation (2–3 sentences analysing why the evidence proves your counter-claim) → Link (connect back to the topic).",
    rows: 7,
    placeholder: "Point: …\nEvidence: …\nExplanation: …\nLink: …",
  },
  {
    id: "q3a-stance",
    label: "Q3a — Author's Exact Stance",
    instruction: "Is the author entirely supporting the idea, or presenting it with reservations? Quote one specific phrase from the source that reveals their position.",
    rows: 3,
    placeholder: "The author's stance is… This is shown by the phrase '…'",
  },
  {
    id: "q3b-transitions",
    label: "Q3b — Transition Words & Cohesive Devices",
    instruction: "List 3 transition words or cohesive devices the author used to move between ideas. For each, write the sentence it appeared in.",
    rows: 5,
    placeholder: "1. '…' — sentence: '…'\n2. '…' — sentence: '…'\n3. '…' — sentence: '…'",
  },
  {
    id: "q3c-collocations",
    label: "Q3c — Collocations in Context",
    instruction: "Find 3 complex phrases or collocations from the source. For each one, write a new sentence using that exact phrase — but about this week's theme (Society).",
    rows: 6,
    placeholder: "1. Phrase: '…'\n   My sentence: …\n2. Phrase: '…'\n   My sentence: …\n3. Phrase: '…'\n   My sentence: …",
  },
];

const WEEK3_COMPREHENSION_PROMPTS: WorksheetPrompt[] = [
  {
    id: "q1-recording-notes",
    label: "Q1 — Voice Recording Prep Notes",
    instruction: "Make a 2-minute voice recording (use your phone's voice memo app) covering: (a) summary of the main argument, (b) evidence used, (c) your personal opinion. Use this space to jot down bullet points before you record — do not script it word for word.",
    rows: 5,
    placeholder: "Main argument: …\nEvidence: …\nMy opinion: …",
  },
  {
    id: "q2-paraphrase",
    label: "Q2 — Concept Paraphrasing (3 concepts)",
    instruction: "Select 3 central concepts from the source. For each: first write the exact original phrase as it appeared in the text or video, then restate the same idea in entirely your own words using synonyms or paraphrasing.",
    rows: 8,
    placeholder: "Concept 1:\n  Original: '…'\n  My paraphrase: …\n\nConcept 2:\n  Original: '…'\n  My paraphrase: …\n\nConcept 3:\n  Original: '…'\n  My paraphrase: …",
  },
  {
    id: "q3a-vocab",
    label: "Q3a — Unknown Words from Context",
    instruction: "Find 3 words you did not know the meaning of immediately. Without using a dictionary, write your best guess of each word's definition based only on the surrounding context. Then check if you were right.",
    rows: 5,
    placeholder: "1. Word: '…' → My guess: … → Actual meaning: …\n2. Word: '…' → My guess: … → Actual meaning: …\n3. Word: '…' → My guess: … → Actual meaning: …",
  },
  {
    id: "q3b-pronouns",
    label: "Q3b — Relative Pronouns",
    instruction: "Find 3 instances of relative pronouns ('that', 'which', 'whose', 'who', 'where', etc.) in the source. For each, copy the full sentence and state exactly which noun or idea the pronoun is referring to.",
    rows: 6,
    placeholder: "1. Sentence: '…'\n   '…' refers to: …\n2. Sentence: '…'\n   '…' refers to: …\n3. Sentence: '…'\n   '…' refers to: …",
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
  bandRange: "7.0–8.0",
  targetBand: "8.0–8.5",
  headline: "The final push to Band 8+",
  description: "You are already at a high level. The gap to Band 8 is precision — exact vocabulary choices, varied grammar, and nuanced argument. Four focused weeks, one skill cluster per week.",
  color: "amber",
  weeks: [
    {
      week: 1, theme: "Precision Vocabulary", focus: "Vocabulary",
      color: "blue",
      rationale: "The difference between Band 7 and Band 8 vocabulary is not more words — it is precision and collocation. Replace overused adjectives with words that carry exact meaning, add hedging language that signals critical thinking, and master nominalization. These three upgrades affect every sentence you write and hit every lexical marking criterion simultaneously.",
      tasks: [
        {
          id: "p-w1-t1",
          label: "Upgrade: Replace Your 5 Most Overused Words",
          description: "Open the full lesson to learn not just what replaces each weak word, but WHY it earns marks, HOW to collocate it correctly, what mistake to avoid, and a practice sentence to write before your next essay.",
          minutes: 30,
          vocabList: [
            {
              term: "beneficial / advantageous",
              replaces: "good",
              why: "Band 8 Lexical Resource requires 'uncommon lexical items used with awareness of style and collocation.' 'Good' appears in Band 4 writing — it carries no discriminatory weight because it's used by everyone. 'Beneficial' collocates with impact, effect, outcomes, and consequences. 'Advantageous' collocates with positions, situations, and strategies. Knowing which word pairs with which noun is exactly the collocation awareness the examiner is looking for.",
              pattern: "[Noun phrase] is undeniably / particularly / arguably beneficial for [group, cause, or goal]\n[Policy / approach] is advantageous in [context], particularly when [condition]",
              mistake: "Don't write 'very beneficial' — that reverts to Band 5 intensification. Use 'undeniably beneficial', 'arguably advantageous', or 'particularly beneficial' instead. The adverb before these words is where the extra precision lives.",
              practice: "Upgrade this sentence: 'It is good for governments to invest in renewable energy.' Use 'beneficial' or 'advantageous' with the correct collocating adverb and add a reason clause that begins with 'particularly when' or 'especially given'.",
              workedExample: [
                "It is arguably beneficial for governments to invest substantially in renewable energy, particularly when one considers the long-term fiscal savings generated by reduced dependence on imported fossil fuels and the growing competitiveness of solar and wind technology relative to conventional power sources.",
                "From a social perspective, flexible working arrangements are undeniably beneficial for working parents, particularly when employers provide the infrastructure to support remote collaboration effectively — reducing commute-related stress while preserving productivity.",
                "Universal access to early childhood education is arguably the most advantageous policy investment a government can make, given that the cognitive returns of quality foundational schooling compound across an individual's entire academic lifetime and produce measurable benefits at the macroeconomic level.",
              ],
              examples: [
                { label: "Writing Task 2", sentence: "Stricter environmental regulations are undeniably beneficial for future generations, even if they impose short-term economic costs on industry." },
                { label: "Speaking Part 3", sentence: "I think studying abroad is highly advantageous for students, since exposure to different educational systems builds genuine intellectual adaptability." },
                { label: "Writing Task 2 (essay opener)", sentence: "While technological innovation has proved beneficial in countless respects, its impact on employment equity demands considerably more scrutiny." },
              ],
            },
            {
              term: "detrimental / adverse",
              replaces: "bad",
              why: "'Detrimental' and 'adverse' are not interchangeable — and knowing the difference is Band 8. 'Detrimental' implies causing damage to something that was functioning (detrimental impact, detrimental effect, detrimental consequences). 'Adverse' implies unfavourable external conditions imposed on something (adverse effects, adverse conditions, adverse circumstances). Using each with its correct collocating noun demonstrates the collocational precision the Band 8 Lexical Resource descriptor demands.",
              pattern: "have a detrimental impact / effect / consequence on [noun]\nadversely affect [noun] (particularly / significantly / profoundly)\nthe adverse effects / conditions / circumstances of [noun]",
              mistake: "'Adverse' is an adjective only — 'this adversed the situation' is a grammatical error. When you need a verb, use 'adversely affect': 'social media adversely affects adolescent mental health.' Also, don't confuse 'adverse' (unfavourable) with 'averse' (unwilling): 'I am not averse to change' is correct; 'I am not adverse to change' is wrong.",
              practice: "Rewrite this sentence twice: 'Too much fast food is bad for children's health.' First using 'detrimental' with the right collocating noun. Then again using 'adversely' as an adverb modifying a verb. Both rewrites should be more specific than the original.",
              workedExample: [
                "A diet consistently high in processed food has a detrimental impact on children's long-term health outcomes, contributing to rising rates of childhood obesity and type-2 diabetes that impose significant costs on both healthcare systems and national productivity.",
                "Excessive social media use adversely affects adolescent mental health outcomes, with longitudinal research consistently documenting elevated rates of anxiety and depression in the heaviest users — effects that persist measurably into early adulthood.",
                "The adverse economic conditions generated by rapid deindustrialisation had a demonstrably detrimental impact on social cohesion in affected communities, with measurable increases in unemployment, mental health admissions, and rates of family breakdown.",
              ],
              examples: [
                { label: "Writing Task 2", sentence: "Excessive screen time has a detrimental impact on children's cognitive development, particularly their capacity for sustained concentration." },
                { label: "Speaking Part 3", sentence: "The adverse effects of rapid urbanisation — overcrowding, pollution, and the erosion of community identity — are often underestimated by policymakers." },
                { label: "Writing Task 2 (body paragraph)", sentence: "This trend has adversely affected low-income households to a disproportionate degree, compounding existing inequalities rather than alleviating them." },
              ],
            },
            {
              term: "pivotal / paramount",
              replaces: "important",
              why: "'Pivotal' means functioning as the central point on which everything else turns — it implies structural centrality, not just significance. 'Paramount' means above all else in importance or authority. Both are tested collocations: you 'play a pivotal role', something is 'of paramount importance'. This is precisely what the Band 8 Lexical Resource criterion calls 'awareness of style and collocation' — not just knowing a synonym, but knowing the exact verb or noun it pairs with.",
              pattern: "[Noun phrase] plays a pivotal role in [process / development / change]\n[Noun phrase] is of paramount importance to [stakeholder / outcome]\n[Consideration] remains paramount when [decision context]",
              mistake: "Don't use 'paramount role' — you play a pivotal role, not a paramount role. 'Paramount' belongs with nouns like 'importance', 'concern', and 'consideration'. Also avoid 'most pivotal' — pivotal already implies centrality, so the superlative is redundant and will make you sound uncertain about how the word works.",
              practice: "Write two sentences for a Task 2 essay about education policy: one using 'pivotal' with its correct collocating verb, one using 'paramount' with its correct collocating noun. Neither sentence should contain the word 'important'.",
              workedExample: [
                "Quality teacher training plays a pivotal role in educational reform — no curriculum redesign or technology investment can compensate for inadequate instructional expertise in the classroom, regardless of the level of funding directed at other aspects of the system.",
                "Equity of access to early-childhood education is of paramount importance to any government serious about breaking cycles of intergenerational poverty, as the cognitive benefits of quality foundational schooling compound significantly over a child's academic lifetime.",
                "Community trust plays a pivotal role in the effectiveness of public health campaigns — where governmental credibility has been eroded, even well-designed interventions consistently fail to achieve their intended reach and compliance targets.",
              ],
              examples: [
                { label: "Writing Task 2", sentence: "Access to quality early-childhood education plays a pivotal role in breaking cycles of intergenerational poverty." },
                { label: "Writing Task 2 (thesis)", sentence: "Transparency in governance is of paramount importance if democratic institutions are to retain public trust in the long term." },
                { label: "Speaking Part 1", sentence: "Family plays a pivotal role in shaping a person's core values — the habits and beliefs formed in childhood tend to persist throughout adult life." },
              ],
            },
            {
              term: "considerably / markedly",
              replaces: "very",
              why: "These adverbs do two things simultaneously: they intensify your adjective or verb AND signal academic register. They collocate naturally with verbs of change (increased, decreased, improved, declined, deteriorated) and with comparative adjectives (higher, lower, faster, slower, more effective). This makes them essential in Task 1 data description AND Task 2 argument — two completely different writing contexts — which is the range the Band 8 criterion rewards.",
              pattern: "[Subject] has increased / decreased / improved considerably [over period]\nconsiderably / markedly [comparative adjective] than [comparator]\nthe rate of [noun] declined markedly [between X and Y]",
              mistake: "Don't use 'considerably' with absolute adjectives that cannot be graded: 'considerably unique', 'considerably essential', or 'considerably impossible' are grammatically wrong. These adverbs only work with gradable adjectives (bigger, faster, more effective) and change verbs (risen, fallen, improved). If the adjective describes something that either is or isn't, use a different intensifier.",
              practice: "Upgrade this Task 1 sentence: 'The number of people using smartphones went up very quickly between 2010 and 2020, and many more people now own one than before.' Use 'considerably' or 'markedly' correctly and remove any redundancy.",
              workedExample: [
                "Global smartphone adoption increased considerably faster than any previous consumer technology in the 2010s, rising from approximately 1.5 billion users in 2012 to over 3.5 billion by 2020, with penetration in developing economies growing markedly throughout the latter half of the period.",
                "Energy generated from renewable sources has grown markedly over the past decade, with solar capacity alone increasing by a factor of approximately ten between 2010 and 2022 — a rate of expansion considerably faster than even optimistic projections had anticipated.",
                "Urban populations in the developing world have grown considerably more rapidly than municipal infrastructure investment can accommodate, creating housing deficits and service gaps that are markedly more severe in cities experiencing net migration from rural areas.",
              ],
              examples: [
                { label: "Writing Task 2", sentence: "Urban populations have grown considerably faster than rural areas over the past three decades, placing enormous pressure on infrastructure and public services." },
                { label: "Writing Task 1 (line graph)", sentence: "Renewable energy output increased markedly between 2010 and 2020, rising from 18% to 34% of total generation — the sharpest decade-on-decade rise since records began." },
                { label: "Speaking Part 3", sentence: "The cost of university education has risen considerably since my parents' generation, which I think explains why student debt has become such a politically charged issue." },
              ],
            },
            {
              term: "a growing body of opinion suggests",
              replaces: "people think",
              why: "'People think' commits two Band 4 errors simultaneously: a vague unquantified subject ('people') and a weak cognitive verb ('think'). The replacement corrects both. 'A growing body of opinion suggests' signals three things at once: (1) you're referencing a trend in public or academic opinion, not just personal feeling, (2) the noun phrase subject shows syntactic sophistication, and (3) 'suggests' rather than 'shows' or 'proves' is the correct epistemic hedge for an argumentative essay — indicating inference rather than certainty.",
              pattern: "A growing body of opinion suggests that [complete arguable clause]\nAn increasing body of evidence indicates / demonstrates that [clause]\nA substantial body of research has shown that [clause with specific domain]",
              mistake: "This phrase references collective trend, not specific individuals or studies. Don't write 'A growing body of opinion suggests Einstein believed...' — it's logically incoherent for a named individual. For specific sources, use 'Research conducted by [institution] indicates...' or 'Studies published in [field] have demonstrated...' Keep 'growing body of opinion' for broad social, economic, or cultural claims.",
              practice: "Replace the weak subject and verb in this sentence: 'Many people think that nuclear energy should be reconsidered as part of a national clean energy strategy.' Use the full replacement phrase and adjust any grammar that needs to change as a result.",
              workedExample: [
                "A growing body of opinion suggests that nuclear energy should be reconsidered as a central component of national clean energy strategy, particularly as newer reactor designs address many of the safety concerns that have historically defined public and political opposition to the technology.",
                "An increasing body of evidence indicates that extended periods of remote working correlate with measurable declines in employee sense of belonging and collegial trust — findings that complicate the straightforward productivity gains that early pandemic-era research appeared to document.",
                "A substantial body of research has shown that early exposure to multiple languages produces cognitive benefits extending well beyond linguistic competence, with bilingual children demonstrating measurably superior performance in tasks requiring executive control and selective attention.",
              ],
              examples: [
                { label: "Writing Task 2 (body paragraph)", sentence: "A growing body of opinion suggests that remote working will permanently reshape urban planning and commuter infrastructure, with implications for commercial real estate that are only beginning to emerge." },
                { label: "Writing Task 2 (introduction)", sentence: "An increasing body of evidence indicates that biodiversity loss poses as significant a threat to human welfare as climate change itself, yet it commands a fraction of the political attention." },
                { label: "Speaking Part 3", sentence: "A growing body of opinion suggests that traditional schooling is no longer sufficient preparation for a technology-driven economy — I'd add that the pace of change is the real problem, not the schools themselves." },
              ],
            },
          ],
        },
        {
          id: "p-w1-t2",
          label: "Hedging Language: 6 Phrases That Signal Band 8 Thinking",
          description: "Hedging is not weakness — it is the signal of critical thinking. Open the full lesson to learn where each phrase belongs in an essay, what mistake collapses its effect, and how to write the sentence that follows it.",
          minutes: 25,
          vocabList: [
            {
              term: "It could be argued that…",
              why: "This phrase is the most precise tool for introducing a counter-argument in Band 8 writing. It signals that you are actively considering the opposing view rather than ignoring it — which is exactly what the Band 8 Task Response descriptor ('well-developed ideas with relevant extended support') requires. Crucially, it frames the opposing view as arguable but not settled, which allows your subsequent refutation to carry more logical weight.",
              pattern: "It could be argued that [opposing claim]; however / nevertheless, [your refutation with reason or evidence].\nIt could be argued that [opposing view], yet this position fails to account for [counter-evidence or logical gap].",
              mistake: "Never hedge your own central thesis. If your position is 'technology harms education', do not write 'It could be argued that technology harms education.' This signals to the examiner that you are not committed to your own position. Hedge only the opposing view, then refute it decisively in the same sentence or the next.",
              practice: "Essay position: 'Governments should make university education free.' Write one sentence using 'It could be argued that...' to introduce the strongest possible counter-argument. Then write one more sentence that refutes it using 'however' and a specific reason.",
              workedExample: [
                "It could be argued that free university education would devalue degrees by flooding the labour market with graduates in disciplines where employer demand is insufficient to absorb them; however, this concern overlooks the substantial long-term economic and social returns that accrue when access to higher education is not contingent on family wealth or the willingness to carry significant personal debt.",
                "It could be argued that stricter immigration policies protect domestic employment by reducing competition for low-skilled roles; in reality, however, the economic literature consistently demonstrates that migrant workers predominantly fill positions that domestic populations are structurally unwilling or unable to occupy.",
                "It could be argued that remote work has made urban centres less necessary than they once were — though I'd actually push back on that, since the creative and economic functions that concentrate in cities seem to persist even as the daily commuting culture has weakened.",
              ],
              examples: [
                { label: "Writing Task 2 (body paragraph)", sentence: "It could be argued that stricter gun legislation infringes upon individual freedoms guaranteed by constitutional law; however, the overwhelming evidence linking firearm availability to homicide rates suggests that public safety must ultimately take precedence." },
                { label: "Writing Task 2 (rebuttal)", sentence: "It could be argued that economic growth and environmental protection are fundamentally incompatible objectives, yet this position fails to account for the growing body of evidence that sustainable industries can generate employment at rates comparable to fossil-fuel sectors." },
                { label: "Speaking Part 3", sentence: "It could be argued that universities are becoming less relevant given the rise of online learning — I understand that view, though I personally think the social and networking dimensions of university are still irreplaceable." },
              ],
            },
            {
              term: "Evidence suggests that…",
              why: "This phrase shifts your essay from personal assertion to evidential claim — the register academic discourse requires. Compared to the overused 'Research shows that', 'Evidence suggests that' is both more formally appropriate and correctly hedged: 'suggests' rather than 'proves' or 'demonstrates' signals inference rather than certainty, which is the correct epistemic stance when you are not citing a specific source (as in an IELTS essay). It also elevates any claim that follows it by implying it is grounded in observable data.",
              pattern: "Evidence suggests that [specific, debatable, or counterintuitive claim].\nThe available evidence strongly suggests that [claim], particularly when one considers [qualifier].\nEvidence from [domain: psychology / economics / public health] suggests that [claim], though [appropriate caveat].",
              mistake: "Do not follow 'Evidence suggests that' with an obvious or universally accepted claim: 'Evidence suggests that exercise improves health' undermines the phrase because no reader needed evidence to believe it. The claim after this phrase should be specific, somewhat surprising, or contestable — something that genuinely benefits from evidentiary framing.",
              practice: "Write a body paragraph topic sentence for a Task 2 essay about the effects of social media on political participation. Use 'Evidence suggests that...' The claim must be specific and debatable — not a generalisation that everyone already accepts.",
              workedExample: [
                "Evidence suggests that social media platforms have simultaneously lowered the barrier to political participation among younger demographics and contributed to ideological echo chambers that reduce meaningful exposure to opposing perspectives — a paradox that complicates any straightforward assessment of their net democratic value.",
                "Evidence suggests that green infrastructure investment generates economic returns that substantially outperform comparable fossil fuel subsidies over a twenty-year horizon, though the political incentive structures that govern budget allocation continue to favour the latter.",
                "The available evidence strongly suggests that socioeconomic background remains a more powerful predictor of educational attainment than school quality in most developed nations — a finding that challenges the dominant policy narrative that school reform alone can close achievement gaps.",
              ],
              examples: [
                { label: "Writing Task 2 (body)", sentence: "Evidence suggests that children who read for pleasure outperform their peers academically across all subjects — not merely literacy — by a margin that persists into secondary and tertiary education." },
                { label: "Writing Task 2 (counter-intuitive claim)", sentence: "Evidence suggests that hybrid working models increase productivity in knowledge-sector roles, contrary to initial employer concerns about supervision and collaboration." },
                { label: "Speaking Part 3", sentence: "Evidence suggests that countries with the highest levels of income equality also score highest on measures of social trust and civic participation — which raises an interesting question about what drives political engagement." },
              ],
            },
            {
              term: "This is not to say that…",
              why: "This phrase performs the most sophisticated rhetorical move in academic writing: partial concession with retained position. You acknowledge a legitimate dimension of the opposing view without abandoning your argument. The Band 8 Coherence and Cohesion criterion rewards 'clear overall progression' — this phrase allows your argument to advance while acknowledging nuance, which prevents it from feeling dogmatic or one-sided. It is also structurally elegant: it adds a qualification in one clause rather than requiring a full paragraph for the concession.",
              pattern: "This is not to say that [legitimate concession or exception]; rather / merely, [your actual claim or the qualifier that restores your position].\n[State your main point]. This is not to say that [exception], but [reason your central claim still holds in the general case].",
              mistake: "Do not use this phrase to open a paragraph — it is a mid-argument move. It should appear after you have established and developed a position and now wish to qualify it. Starting a paragraph with 'This is not to say that...' sounds structurally disorganised because the reader does not yet know what 'this' refers to.",
              practice: "Complete this argument: 'Technology has undeniably made communication more efficient and accessible across the globe.' Add one sentence using 'This is not to say that...' that concedes a genuine limitation, then a final sentence that explains why your original point still stands despite that limitation.",
              workedExample: [
                "Technology has undeniably made communication more efficient and accessible across the globe, collapsing geographical barriers that would have made real-time international exchange impossible a generation ago. This is not to say that digital communication is equivalent to face-to-face interaction in every meaningful respect — the nuance, empathy, and trust that build through physical presence remain genuinely difficult to replicate online — but that the net effect on human connectivity has been overwhelmingly positive for those with reliable access to it.",
                "Globalisation has generated unprecedented economic growth across large parts of the developing world over the past four decades. This is not to say that the benefits have been equitably distributed across populations — the evidence on within-country inequality makes that much clear — but that the alternative of economic isolation produces consistently worse outcomes for the populations most at risk.",
                "The decline of traditional manufacturing employment in developed economies is, in aggregate, a structural feature of technological progress rather than a reversible policy failure. This is not to say that governments bear no responsibility for managing the transition — retraining investment, regional development policy, and social safety net design all matter enormously — but that attempting to preserve those industries through trade protection typically prolongs the pain without preventing it.",
              ],
              examples: [
                { label: "Writing Task 2 (qualification)", sentence: "This is not to say that economic growth is irrelevant — merely that it cannot be pursued at the expense of environmental sustainability without ultimately undermining the prosperity it seeks to create." },
                { label: "Writing Task 2 (nuanced concession)", sentence: "Globalisation has demonstrably raised living standards in many developing nations. This is not to say that its benefits have been equitably distributed, but that the solution lies in redistribution policy rather than in reversing economic integration." },
                { label: "Speaking Part 3", sentence: "I do think social media has made political participation more accessible. This is not to say it has made it more substantive — a retweet is not the same as an informed vote." },
              ],
            },
            {
              term: "To varying degrees…",
              why: "This phrase signals that your claim applies differently across different contexts, groups, or cases — which is the hallmark of nuanced thinking at Band 8 level. Blanket statements ('all governments should invest in education') are a Band 6 quality; qualified positions ('most governments have, to varying degrees, acknowledged the link between education investment and economic growth') are Band 8. The phrase also functions as an effective discourse marker at the start of a sentence, signalling analytical sophistication before the main clause.",
              pattern: "To varying degrees, [all / most / many] [subject] have [taken action / acknowledged position / experienced effect].\n[Noun phrase] affects [group] to varying degrees, depending on [determining factor].\nWhile [claim holds broadly], the extent to which it applies varies considerably across [contexts / regions / demographics].",
              mistake: "Do not use 'to varying degrees' when the claim admits no genuine variation. 'To varying degrees, all humans require oxygen' is wrong because there is no variation. Reserve it for claims where real contextual differences exist — policy responses, social impacts, economic consequences, or cultural attitudes across different groups or nations.",
              practice: "Write a sentence using 'to varying degrees' about the impact of artificial intelligence on employment across different sectors of the economy. Make sure the variation you're implying is genuine and worth noting — not just 'some sectors more than others' with no specifics.",
              workedExample: [
                "Artificial intelligence is reshaping the labour market to varying degrees depending on the cognitive complexity and predictability of the tasks involved: workers in manual, repetitive, or data-entry roles face the most acute near-term displacement, while those in positions requiring creative judgment, interpersonal skill, or non-routine problem-solving remain considerably more insulated from automation.",
                "The political consequences of rapid urbanisation have played out to varying degrees across different national contexts: countries with strong municipal governance frameworks and adequate fiscal transfer mechanisms have managed the transition relatively smoothly, while those lacking either have seen the growth of informal settlements and civic unrest.",
                "International climate agreements have been implemented to varying degrees of rigour across signatory nations, with the gap between stated commitments and verifiable emissions reductions widening steadily over successive reporting cycles — a pattern that undermines the credibility of voluntary frameworks as a mechanism for systemic change.",
              ],
              examples: [
                { label: "Writing Task 2 (body)", sentence: "To varying degrees, all developed nations have implemented some form of carbon pricing mechanism over the last decade, though the political will to enforce meaningful emissions targets remains conspicuously uneven." },
                { label: "Writing Task 2 (analysis)", sentence: "Automation affects workers to varying degrees depending on the cognitive complexity of their roles — those in manual, repetitive positions face the most immediate displacement, while highly specialised professionals remain relatively insulated." },
                { label: "Speaking Part 3", sentence: "I think globalisation has benefited people to varying degrees — it's created enormous wealth, but that wealth has concentrated at the top in ways that many communities haven't felt at all." },
              ],
            },
            {
              term: "One might contend that…",
              why: "'One might contend' is formally distanced in a way that 'some people argue' is not. 'One' is impersonal and academic; 'contend' implies deliberate, sustained argumentation rather than casual opinion. Together, they allow you to introduce an opposing view with formal intellectual respect — treating it as a serious position worthy of engagement rather than a strawman — before you dismantle it. This signals the Band 8 quality of genuine critical engagement with the material.",
              pattern: "One might contend that [opposing position]; [in reality / however / upon closer examination], [your counter with evidence or logical reasoning].\nOne might contend that [view], yet this perspective overlooks [critical factor or evidence that changes the analysis].",
              mistake: "Do not use 'One might contend' to introduce your own view — it signals a position you are presenting in order to qualify or refute it. If you write 'One might contend that climate change is the defining challenge of our era' and then agree with it throughout the paragraph, you have created confusion about where your argument actually stands.",
              practice: "Write a complete sentence for a Task 2 essay arguing that 'the internet has done more harm than good': Start with 'One might contend that...' to introduce the strongest pro-internet counter-argument. End the sentence with 'however' or 'yet this perspective fails to account for' and a specific refutation.",
              workedExample: [
                "One might contend that the internet has democratised access to information in ways that were genuinely unimaginable before its invention, providing individuals in under-resourced communities with educational tools previously available only to the wealthy; yet this perspective fails to account for the simultaneous proliferation of disinformation that has demonstrably eroded public trust in expert institutions and, in several documented cases, contributed to real-world political violence.",
                "One might contend that increased competition through market liberalisation invariably benefits consumers through lower prices and improved service quality; however, the evidence from utility and infrastructure sectors suggests that natural monopoly dynamics frequently reassert themselves in the absence of robust regulatory intervention, producing outcomes more harmful to consumers than the regulated alternatives.",
                "One might contend that national cultural traditions are best preserved by limiting cross-cultural exchange and migration — yet this position fundamentally misunderstands how living cultures actually evolve, since the most resilient traditions are precisely those that have historically demonstrated the capacity to absorb and adapt external influences without losing their distinctive character.",
              ],
              examples: [
                { label: "Writing Task 2 (counter-argument)", sentence: "One might contend that automation inevitably leads to mass unemployment; in reality, historical precedent consistently shows that technological disruption tends to shift rather than eliminate employment, creating new categories of work that were previously unimaginable." },
                { label: "Writing Task 2 (nuanced refutation)", sentence: "One might contend that stricter immigration controls protect domestic employment — yet this perspective overlooks the significant contribution migrant labour makes to sectors that local workforces are structurally unwilling to fill." },
                { label: "Speaking Part 3", sentence: "One might contend that young people are less politically engaged than previous generations — though I'd argue the form of engagement has changed more than the level of it, with online activism replacing doorstep canvassing." },
              ],
            },
            {
              term: "It remains to be seen whether…",
              why: "This phrase signals intellectual honesty about genuine uncertainty — an essential quality in Band 8 academic writing. Overconfident conclusions ('It is clear that AI will solve all our problems') sound uncritical. 'It remains to be seen whether' acknowledges that the future is genuinely open, which is the correct epistemic position for claims about emerging technology, policy outcomes, or long-term social change. Used in a conclusion, it demonstrates that you can synthesise an argument without overclaiming — a key Band 8 distinction.",
              pattern: "It remains to be seen whether [genuinely uncertain future outcome or contested claim].\nWhile [current observable trend is clear], it remains to be seen whether [the longer-term extrapolation or policy implication will hold].\n[Conclude your argument]. Ultimately, it remains to be seen whether [the open question your essay has raised but cannot fully resolve].",
              mistake: "Do not use this phrase for things that are already known or empirically settled. 'It remains to be seen whether the Second World War ended in 1945' is obviously wrong. Use it only for claims about genuinely open futures: the long-term social effects of AI, the political viability of a policy, whether a current trend will continue or reverse. The uncertainty must be real, not manufactured.",
              practice: "Write a conclusion sentence for a Task 2 essay about artificial intelligence in the workplace that uses 'It remains to be seen whether...' The phrase should introduce a genuinely open question that your essay's argument has raised — not just paraphrase the thesis in a cautious tone.",
              workedExample: [
                "It remains to be seen whether the current wave of AI-driven automation will generate the new categories of employment that previous technological revolutions have historically produced, or whether the unprecedented pace and breadth of this disruption are sufficiently different to break that historical pattern entirely — a question whose answer will define the social contract of the coming decades.",
                "It remains to be seen whether the shift toward remote and hybrid working that accelerated dramatically during the pandemic will persist as a permanent structural change, or whether the social and collaborative dimensions of shared physical workspaces will reassert their pull as organisational memory of the disruption fades.",
                "While the short-term economic benefits of urban densification are reasonably well-documented, it remains to be seen whether the social and environmental pressures generated by hyperdense cities will prove manageable at the scales that continued global urbanisation implies.",
              ],
              examples: [
                { label: "Writing Task 2 (conclusion)", sentence: "It remains to be seen whether artificial intelligence will ultimately create more jobs than it displaces, but the urgency of preparing the current workforce for that transition is beyond dispute." },
                { label: "Writing Task 2 (qualified prediction)", sentence: "While the short-term economic gains from offshore manufacturing are well-documented, it remains to be seen whether the long-term erosion of domestic industrial capacity will prove an acceptable trade-off for developed economies." },
                { label: "Speaking Part 3", sentence: "I think the shift to remote work has already changed cities in ways we're only beginning to understand. It remains to be seen whether office culture as we knew it will ever fully recover, or whether we're looking at a permanent structural shift." },
              ],
            },
          ],
        },
        {
          id: "p-w1-t3",
          label: "Writing Practice: Apply All Upgrades in One Essay",
          description: "Submit a Task 2 with these non-negotiable rules: no 'good', 'bad', 'important', or 'very'; at least 3 hedging phrases from the lesson above; at least one nominalized structure (e.g. 'the failure of governments to act' instead of 'governments do not act'). Count each rule before submitting.",
          resourcePath: "/dashboard/writing",
          resourceLabel: "Open Writing Module",
          minutes: 45,
        },
      ],
    },
    {
      week: 2, theme: "Task 1 Mastery", focus: "Writing",
      color: "green",
      rationale: "At Band 7 you describe data accurately. At Band 8 you select only the most significant patterns and describe them with pinpoint language — knowing what to leave out is as important as knowing what to include. The overview is one precise sentence per major trend; the body groups data by pattern, not by column order. Open each lesson to learn the exact formula, what to avoid, and a practice sentence to write before your submission.",
      tasks: [
        {
          id: "p-w2-t1",
          label: "Data Language: High-Precision Comparison Phrases",
          description: "Open the full lesson to learn the exact grammatical pattern, what each phrase implies analytically (not just what it means), the most common error, and a practice description to write before your submission.",
          minutes: 25,
          vocabList: [
            {
              term: "constituted approximately / accounted for roughly",
              why: "These verb phrases replace two weak constructions simultaneously: the vague 'was about' and the passive 'represented around'. 'Constituted' implies composition — X was made up of Y. 'Accounted for' implies proportional contribution — X explained or made up Y of the whole. Both signal Band 8 data description precision because they don't just report a number; they embed that number in a relationship to the total, which is the analytical move examiners reward.",
              pattern: "[Category] constituted approximately [X%] of [total noun], making it [superlative / comparative claim].\n[Category] accounted for roughly [X%] of [total], [compared to / while / up from] [comparator figure or time point].",
              mistake: "Don't use 'constituted' with absolute counts — it works with proportions and percentages. 'Oil constituted 3 million barrels' is wrong; 'oil constituted approximately 68% of total consumption' is correct. For absolute figures, use 'stood at', 'reached', or 'totalled' instead.",
              practice: "Describe this data in one sentence using 'constituted approximately' or 'accounted for roughly': In 2010, manufacturing made up 35% of Country A's GDP — the largest single sector. Include a comparative clause.",
              workedExample: [
                "Manufacturing constituted approximately 35% of Country A's GDP in 2010 — the largest single sector by a considerable margin — with services and agriculture each accounting for roughly half that share at around 18% and 17% respectively.",
                "Coal and natural gas together constituted approximately 73% of electricity generation in the early years of the period, with renewables accounting for just 9% — a distribution that had shifted markedly by the final year, when clean energy sources had risen to account for roughly 31% of total output.",
                "Healthcare expenditure accounted for roughly 11% of GDP in the highest-spending nation shown — more than double the proportion in the lowest-spending country, where it constituted approximately 5% — a gap that correlates strongly with the health outcome differentials visible across the other indicators presented.",
              ],
              examples: [
                { label: "Task 1 (pie chart)", sentence: "Oil and gas constituted approximately 68% of total energy consumption in 2005, making them by far the dominant sources and dwarfing renewable alternatives, which accounted for a mere 7%." },
                { label: "Task 1 (bar chart)", sentence: "Renewable sources accounted for roughly a quarter of electricity generation by 2020, up from just 9% a decade earlier — the most dramatic proportional shift of any energy category in the period." },
                { label: "Task 1 (overview)", sentence: "Overall, fossil fuels constituted the majority of energy output throughout the period, though renewables accounted for a growing share of generation by the final year shown." },
              ],
            },
            {
              term: "was dwarfed by / fell considerably short of",
              why: "'Was dwarfed by' communicates extreme proportional difference in a single compact phrase — it implies a visual comparison (one figure looks tiny next to another, like a dwarf next to a giant). 'Fell considerably short of' implies a gap where one figure failed to reach another's level, with a connotation of underperformance. Both phrases allow your data description to carry analytical interpretation — not just number-reporting — which is the quality that separates Band 7 from Band 8 Task 1 responses.",
              pattern: "[Smaller figure / category] was dwarfed by [larger comparator], [which reached / standing at / with the latter at] [specific value].\n[Figure A] fell considerably short of [Figure B], at [value A] compared to [value B] [in year / over the period].",
              mistake: "Don't use 'was dwarfed by' when the difference is modest — these phrases imply striking disparity. Using 'was dwarfed by' for a 5-percentage-point gap sounds hyperbolic and undermines the precision the examiner is looking for. If the gap is small, use 'was marginally lower than' or 'fell slightly short of' instead.",
              practice: "Write a Task 1 comparison sentence about two countries' education spending (Country A: 3.1% of GDP; Country B: 8.7% of GDP) using 'was dwarfed by'. Include the specific values and a comparative clause about what the difference implies.",
              workedExample: [
                "Country A's education investment, at 3.1% of GDP, was dwarfed by Country B's allocation of 8.7% — a disparity of nearly three to one that, given comparable population sizes, suggests fundamentally different policy priorities rather than differences in fiscal capacity.",
                "Renewable energy capacity in the developing nations shown fell considerably short of developed-world benchmarks throughout the period, averaging approximately 14% of total generation compared to the 28% recorded in OECD member states — a gap that existing infrastructure investment trajectories suggest will narrow only slowly.",
                "Public transit passenger numbers were dwarfed by private vehicle usage in every country shown, with car journeys outnumbering bus and rail trips by a ratio of approximately four to one in the most car-dependent nation — falling to just under two to one in the country with the most extensive urban rail network.",
              ],
              examples: [
                { label: "Task 1 (extreme gap comparison)", sentence: "Spending on public transport was dwarfed by private vehicle infrastructure investment throughout the period, with the latter consistently receiving over four times the funding allocated to rail and bus networks." },
                { label: "Task 1 (underperformance contrast)", sentence: "Agricultural output in the northern region fell considerably short of southern levels throughout the decade, at approximately 2.3 million tonnes compared to 5.8 million — a gap that widened rather than narrowed over time." },
                { label: "Task 1 (overview application)", sentence: "Overall, renewable energy output was dwarfed by fossil fuel generation across all years shown, though the gap narrowed considerably by the end of the period." },
              ],
            },
            {
              term: "peaked at / bottomed out at / levelled off at around",
              why: "These three phrases describe the three key narrative moments in any trend line: the highest point, the lowest point, and the period of stability. Band 8 Task 1 essays describe trends with precision about both timing and value simultaneously — 'peaked at' automatically encodes the verb (upward direction), the noun (a maximum), and the implication of subsequent decline, saving words while adding analytical density. Using all three in one sentence or paragraph demonstrates sophisticated trend analysis.",
              pattern: "[Subject] peaked at [value] in [year / period], [before / after which / subsequently] [next movement].\n[Subject] bottomed out at [value] in [year], [before recovering to / then rising to / remaining at] [next value].\n[Subject] levelled off at around [value] [from year to year / throughout / over the following period].",
              mistake: "'Peaked' implies a definitive high point followed by decline. Don't use 'peaked at' if the figure continued to rise — 'peaked at 3 million in 2015 and then continued to grow to 4 million' is a logical contradiction. When a figure reaches a temporary high then continues rising, use 'reached a local high of' or 'hit a temporary high of' instead.",
              practice: "Write one sentence describing a hypothetical unemployment rate trend: it rose from 5% in 2008 to 12% in 2010, then fell to 3.8% by 2014, and held between 4% and 4.5% from 2015 to 2020. Use all three phrases in a single fluid sentence.",
              workedExample: [
                "Following the onset of the global financial crisis, unemployment peaked at 12% in 2010 before a sustained recovery drove it to a decade low, bottoming out at 3.8% in 2014; from 2015 onwards, the rate levelled off at around 4–4.5%, suggesting the economy had reached a structural rather than cyclical employment equilibrium.",
                "Foreign direct investment inflows into the region peaked at $42 billion in 2007 before the financial crisis reduced them sharply; they bottomed out at $18 billion in 2009 and subsequently levelled off at around $25–28 billion per year for the remainder of the decade, recovering only partially from their pre-crisis high.",
                "Average household disposable income peaked at $52,000 in 2008, then fell sharply during the recession before bottoming out at $44,000 in 2011; it subsequently recovered gradually, levelling off at around $49,000 between 2015 and 2018 — still short of the pre-crisis peak at the end of the period shown.",
              ],
              examples: [
                { label: "Task 1 (line graph — peak)", sentence: "Tourist arrivals peaked at just over 4.2 million in 2008 before declining sharply during the global recession, losing more than a third of that total by 2010." },
                { label: "Task 1 (line graph — trough)", sentence: "After falling steadily for three consecutive years, manufacturing employment bottomed out at 1.1 million in 2013 — a figure not seen since the early post-war period." },
                { label: "Task 1 (line graph — plateau)", sentence: "Following a period of sharp recovery between 2014 and 2016, the rate levelled off at around 6.5%, where it remained for the duration of the final four years shown." },
              ],
            },
            {
              term: "in excess of / a fraction of",
              why: "'In excess of' replaces 'more than' when a figure substantially overshoots a reference point — it implies notable, perhaps surprising, magnitude. 'A fraction of' replaces 'much less than' when one figure is proportionally tiny compared to another, carrying a connotation of insignificance or disproportion. Both allow you to make emphatic comparative claims without a long comparison clause, which makes your Task 1 writing more economical — a Band 8 quality.",
              pattern: "[Subject] reached in excess of [round reference figure] [in year / by period], [representing / marking / making it] [significance].\n[Figure A] represented a fraction of [Figure B], at [specific value A] compared to [value B] — a ratio of approximately [X to Y].",
              mistake: "Don't use 'in excess of' for small exceedances — 'in excess of 5 people' sounds dramatically hyperbolic for such a small number. These phrases imply notable magnitude or proportion. 'In excess of' works best with large round-number comparisons: 'in excess of $10 billion', 'in excess of one million households'. For small exceedances, use 'just over' or 'slightly more than'.",
              practice: "Write two sentences comparing military and arts funding in a hypothetical country (military: $45 billion; arts: $800 million). Use 'in excess of' for one figure and 'a fraction of' for the other. Include a ratio or approximate proportion.",
              workedExample: [
                "Defence expenditure stood in excess of $45 billion annually, dwarfing the allocation to arts and culture which, at $800 million, represented a fraction of total government spending — a ratio of approximately 56 to 1 that prompted considerable public debate about whether the balance reflected the nation's stated values.",
                "Annual revenue generated by the digital economy had grown to in excess of $2 trillion globally by the final year shown — a figure that, a decade earlier, had represented a fraction of the revenue attributable to conventional retail, with the proportional positions having almost entirely reversed over the period.",
                "Per-capita healthcare spending in the highest-spending nation shown stood in excess of $11,000 annually, while the lowest-spending country allocated a fraction of that figure at approximately $1,800 — a gap of more than six to one that corresponds broadly to the observable differences in average life expectancy across the two populations.",
              ],
              examples: [
                { label: "Task 1 (large figure)", sentence: "By 2020, annual healthcare spending had reached in excess of $10,000 per capita in the United States — a figure that represented more than double the average of comparable high-income nations." },
                { label: "Task 1 (small proportion)", sentence: "Funding allocated to arts and culture represented a fraction of defence expenditure, at just 0.3% of GDP compared to 3.8% — a ratio of roughly 1 to 13." },
                { label: "Task 1 (comparative overview)", sentence: "Overall, private sector investment remained in excess of public spending throughout the period, while funding for social programmes consistently accounted for a fraction of total infrastructure outlay." },
              ],
            },
            {
              term: "roughly equivalent to / marginally higher than",
              why: "When two figures are close but not identical, Band 6 responses either ignore the nuance ('was similar to' — vague) or overstate it ('was much higher' — inaccurate). Band 8 responses use degree-qualified comparisons precisely: 'roughly equivalent' signals approximate equality within a narrow range; 'marginally higher' signals a small but real and measurable difference. Choosing correctly between them — and knowing what range each implies — is the data precision the examiner rewards.",
              pattern: "[Figure A] was roughly equivalent to [Figure B], at [value A] and [value B] respectively, [suggesting / indicating] [analytical implication].\n[Figure A] was marginally higher than [Figure B], averaging [value A] versus [value B] [over the period / in the final year shown].",
              mistake: "Don't use 'roughly equivalent to' when there is a significant gap — it actively understates the difference and misleads the examiner. A rough guide: use 'roughly equivalent' for differences under approximately 3–5 percentage points. For larger gaps, 'notably higher than', 'substantially above', or 'considerably greater than' are more precise. Picking the wrong degree marker is one of the clearest signals of a Band 7 rather than Band 8 response.",
              practice: "Describe this data accurately: Female part-time employment rate: 38.2%. Male part-time employment rate: 39.4%. Write one sentence using 'marginally higher than' with the correct values assigned to the correct groups, and add a clause noting what this small difference suggests.",
              workedExample: [
                "Male part-time employment rates were marginally higher than female rates throughout the period, averaging 39.4% compared to 38.2% — a gap of barely more than one percentage point that, while consistent across all years shown, is unlikely to be of practical significance given the sampling variability involved.",
                "Carbon emissions from the transport sector were roughly equivalent to those from industry in the early years of the period, at approximately 24% and 26% of total output respectively, though the two diverged considerably by the final year as industrial emissions fell more sharply in response to carbon pricing mechanisms.",
                "The proportion of the population with tertiary qualifications was roughly equivalent across the three Nordic nations shown — hovering between 41% and 43% in each — though all three were marginally higher than the OECD average of 39%, a difference that becomes more pronounced when adjusted for field of study.",
              ],
              examples: [
                { label: "Task 1 (close comparison)", sentence: "In 2010, expenditure on education was roughly equivalent to that on healthcare, at approximately 5.2% and 5.5% of GDP respectively — a parity that had shifted considerably in favour of healthcare by the end of the period." },
                { label: "Task 1 (small measured difference)", sentence: "Female graduation rates were marginally higher than male rates throughout the decade, averaging 63% versus 61% — a gap that, while small, was consistent across all years and all three countries shown." },
                { label: "Task 1 (nuanced overview)", sentence: "Overall, expenditure across the three categories remained roughly equivalent in the early years, though diverged markedly from 2015 onwards as infrastructure spending accelerated." },
              ],
            },
          ],
        },
        {
          id: "p-w2-t2",
          label: "Writing Practice: Task 1 — Selective Data, Under 185 Words",
          description: "Before writing, identify the 3 most striking data points only. Ask: 'If I could tell someone just 3 things about this chart, what would they be?' Write only those. Use at least 2 phrases from the lesson above and check that your overview has no specific numbers in it.",
          resourcePath: "/dashboard/writing",
          resourceLabel: "Open Writing Module",
          minutes: 35,
        },
      ],
    },
    {
      week: 3, theme: "Task 2 + Advanced Grammar", focus: "Writing",
      color: "purple",
      rationale: "Band 9 grammar means a wide range of structures used with full flexibility and accuracy — not as memorised templates, but naturally woven into your argument. Open each lesson to learn the exact structural formula, the most common error, and a practice sentence to write before your essay. The goal is not to drop these structures in artificially but to understand them well enough to use them when they genuinely fit.",
      tasks: [
        {
          id: "p-w3-t1",
          label: "Advanced Grammar: 3 Structures That Signal Band 8+",
          description: "Open the full lesson to see the grammatical formula, common structural errors, and three Band 8 model sentences for each structure. Then write one example of each before attempting the essay below.",
          minutes: 35,
          vocabList: [
            {
              term: "Cleft sentences: What… is / It is… that",
              why: "Cleft sentences are the most immediately recognisable marker of Band 8 grammatical range. They shift the logical emphasis of a sentence onto a specific element by splitting a simple statement into two clauses. 'Technology improves education' becomes 'What technology fundamentally improves is access to education' — the second version tells the examiner exactly which aspect you consider most significant. This structural choice demonstrates flexible grammatical thinking, not just memorised templates.",
              pattern: "What [subject] [verb phrase] is [the element you want to emphasise].\nIt is [emphasised noun phrase] that [rest of the predicate].\nIt is [specific cause / time / actor] that [explains or drives the main claim].",
              mistake: "Don't use cleft sentences to emphasise the obvious: 'What is important is education' adds no rhetorical value because nothing is counterintuitive or precise. Use cleft sentences to highlight a specific cause within a broad field, a counterintuitive factor, or the precise focus of your argument — not a truism the reader already accepts.",
              practice: "Rewrite this sentence as a cleft sentence to emphasise the underlined element: 'The widening digital divide is the most significant barrier to educational equality in developing nations.' Try both the 'What...' pattern and the 'It is...that' pattern. Which creates stronger emphasis?",
              workedExample: [
                "What... pattern: 'What most fundamentally undermines educational equality in developing nations is not the quality of physical school infrastructure, but the widening digital divide that denies millions of students access to the online resources their wealthier counterparts take for granted.'\n\nIt is...that pattern: 'It is the widening digital divide, rather than inadequate physical schooling infrastructure, that constitutes the most significant and least-discussed barrier to educational equality across the developing world.'",
                "Writing Task 2 body use: 'What the data on intergenerational mobility consistently reveals is not a meritocratic system rewarding individual effort, but a structural hierarchy in which the circumstances of birth remain the strongest predictor of adult economic outcome — a finding that should fundamentally reshape debates about educational opportunity and social investment.'",
                "Speaking Part 3 use: 'What I find genuinely counterintuitive about the digital revolution is not that it has created inequality — most technological shifts do — but that it has done so while simultaneously providing the tools by which that inequality could most efficiently be addressed, if the political will to deploy them equitably existed.'",
              ],
              examples: [
                { label: "Writing Task 2 (body — emphasis)", sentence: "What makes this issue particularly intractable is not the absence of policy solutions, but the absence of political will to implement them at a cost that incumbent governments are prepared to bear." },
                { label: "Writing Task 2 (thesis)", sentence: "It is the widening gap between urban and rural opportunity, rather than any single policy failure, that underpins the persistent cycle of poverty in many developing nations." },
                { label: "Speaking Part 3", sentence: "What I find most troubling about this trend is not the technology itself — it's the speed at which society is being asked to restructure around it without adequate public debate." },
              ],
            },
            {
              term: "Inversion: Rarely… / Not only… but also / Only by…",
              why: "Inversion places a negative or restrictive adverbial at the front of the sentence and inverts the subject-auxiliary order, creating immediate rhetorical emphasis and a formal, authoritative register. It is the grammar equivalent of vocal stress in speech. 'This problem has rarely been more urgent' is descriptive; 'Rarely has this problem been more urgent' is emphatic and sophisticated. The Band 9 descriptor — 'uses a wide range of structures with full flexibility and accuracy' — specifically targets this kind of structural variation.",
              pattern: "Rarely / Seldom / Never has [subject] [past participle]...\nNot only does / do [subject] [base verb phrase], but [subject] also [verb phrase]...\nOnly by [gerund phrase or noun phrase] can [subject] [base verb]...\nUnder no circumstances should [subject] [base verb]...",
              mistake: "Inversion requires correct auxiliary placement. 'Rarely the government has addressed this' is wrong — the auxiliary must precede the subject: 'Rarely has the government addressed this.' The most common error is forgetting to invert entirely: 'Not only the policy has failed, but it has also...' should be 'Not only has the policy failed, but it has also...' Check every inversion by asking: 'Is the auxiliary before the subject?'",
              practice: "Rewrite these two sentences using inversion. (1) 'The need for coordinated climate action has never been more urgent than it is today.' → Begin with 'Never...'. (2) 'Governments can only close the wealth gap by reforming both the tax system and the social safety net.' → Begin with 'Only by...'",
              workedExample: [
                "(1) Never... pattern: 'Never has the need for coordinated international climate action been more pressing — nor has the political will to deliver it at the scale required been more conspicuously absent from the governments of the world's largest emitters.'\n\n(2) Only by... pattern: 'Only by reforming both the progressive tax structure and the reach of the social safety net can governments meaningfully address the structural wealth disparities that have widened continuously over the past four decades.'",
                "Not only... but also pattern: 'Not only does this level of income inequality exacerbate inter-generational poverty, but it also creates a two-tier healthcare and education system that entrenches rather than reduces social immobility — a self-reinforcing dynamic that voluntary charitable intervention cannot meaningfully address at scale.'",
                "Seldom... pattern: 'Seldom has the international community faced a challenge as simultaneously urgent and politically intractable as climate change — a crisis in which the nations most responsible for causing the problem are structurally incentivised to defer the costs of solving it to future generations.'",
              ],
              examples: [
                { label: "Writing Task 2 (introduction)", sentence: "Rarely has the need for international cooperation on climate and biodiversity loss been more urgent than it is today, yet rarely has the political will to act on that need been more conspicuously absent." },
                { label: "Writing Task 2 (body)", sentence: "Not only does this level of income inequality exacerbate inter-generational poverty, but it also creates a two-tier healthcare and education system that entrenches rather than reduces social immobility." },
                { label: "Writing Task 2 (conclusion)", sentence: "Only by investing substantially in early childhood education — the period in which cognitive development is most rapid and most malleable — can societies hope to break the cycle of intergenerational disadvantage." },
              ],
            },
            {
              term: "Participial clauses: Having… / Driven by… / Viewed from…",
              why: "Participial clauses compress two clauses into one, making your writing analytically denser and more efficient. They also signal logical relationships — cause, background, sequence, perspective — without requiring the clunky conjunctions ('because', 'since', 'after') that Band 6 writers rely on. The Band 8 Grammatical Range criterion rewards the ability to express complex logical relationships through structural choice. Participial clauses are one of the clearest ways to demonstrate that ability.",
              pattern: "Having [past participle phrase], [main clause with subject — 'it is clear that' / 'one can conclude that' / 'I believe that'].\nDriven by / Fuelled by / Shaped by [noun phrase], [subject] [verb phrase]...\nViewed from [perspective noun: a historical / an economic / a sociological], [claim about what that perspective reveals].\n[Present participle phrase], [subject] [verb]... (e.g. 'Acknowledging this complexity, policymakers should...')",
              mistake: "Participial clauses must share their implied subject with the main clause. 'Having considered both sides, the essay will now conclude...' is a dangling modifier — the essay cannot consider sides; you (the writer) did. Write 'Having considered both sides, I conclude that...' or restructure the sentence to make the subject explicit. This is the most common error and the one most likely to cost marks under Grammatical Accuracy.",
              practice: "Rewrite this pair of sentences as one sentence using a participial clause: 'Technological advancement has transformed every sector of the modern economy. It has left behind workers whose skills became obsolete faster than retraining programmes could respond.' Begin with 'Driven by...' and make the logical connection between the two ideas explicit.",
              workedExample: [
                "Driven by... pattern: 'Driven by relentless technological advancement, the modern economy has transformed virtually every sector while simultaneously displacing workers whose skill sets became obsolete faster than retraining programmes could compensate — a structural mismatch that is both economically damaging at the individual level and politically destabilising at the systemic level.'",
                "Having... pattern: 'Having considered the available evidence across economic, social, and environmental dimensions, I am persuaded that the case for urban densification significantly outweighs the case against it — provided that investment in public transit, green space, and affordable housing keeps pace with population growth.'",
                "Viewed from... pattern: 'Viewed from a long-term fiscal perspective, the upfront cost of transitioning to renewable energy infrastructure represents a sound investment rather than a budgetary burden — particularly given the declining cost trajectory of solar and wind technologies and the increasingly visible costs of climate-related economic disruption.'",
              ],
              examples: [
                { label: "Writing Task 2 (body — cause)", sentence: "Driven largely by the demands of a globalised, knowledge-based economy, the modern labour market requires a degree of cognitive adaptability and continuous relearning that previous generations were never asked to demonstrate." },
                { label: "Writing Task 2 (conclusion)", sentence: "Having examined the economic, social, and environmental dimensions of this issue, it is difficult to avoid the conclusion that incremental reform is insufficient — structural change at the legislative level is what the evidence demands." },
                { label: "Writing Task 2 (body — perspective)", sentence: "Viewed from a long-term fiscal perspective, the upfront cost of renewable energy infrastructure represents a sound investment rather than a budgetary burden, given the declining cost trajectory of solar and wind technologies over the past decade." },
              ],
            },
          ],
        },
        {
          id: "p-w3-t2",
          label: "Writing Practice: Task 2 with 6+ Distinct Structures",
          description: "Submit a Task 2 essay. Before submitting, underline each sentence and label its structural type. Aim for at least 6 distinct types across the essay: simple, complex, compound, cleft, inverted, participial, conditional (advanced), nominalized. If you find fewer than 6, revise before submitting.",
          resourcePath: "/dashboard/writing",
          resourceLabel: "Open Writing Module",
          minutes: 50,
        },
      ],
    },
    {
      week: 4, theme: "Speaking + Full Mock", focus: "Speaking & Mock",
      color: "red",
      rationale: "Your language should now sound effortlessly natural. This final week targets the fluency gap between Band 7 and Band 8 in Speaking — specifically Part 3, where most Band 7 candidates either give short answers or use memorised academic phrases that sound rehearsed. Open the lesson to learn exactly when and how to deploy each opener, what mistake kills its effect, and a practice question to answer aloud before your session.",
      tasks: [
        {
          id: "p-w4-t1",
          label: "Speaking: Natural Part 3 Openers (Replace All Memorised Phrases)",
          description: "Memorised openers like 'That's a very interesting question' are Band 6 cap triggers — examiners are trained to notice them. Open the lesson to learn authentic alternatives, the exact context each one fits, what makes it sound natural rather than rehearsed, and a Part 3 practice question to answer aloud.",
          minutes: 25,
          vocabList: [
            {
              term: "Right, so… / Well, I suppose…",
              why: "Discourse particles like 'Right, so...' are the authentic mark of fluent real-time speech — they signal that you are organising your thought as you speak, which is exactly what native speakers do. They are completely appropriate in a formal speaking test and give you one or two natural seconds to formulate your response. 'Right' signals acknowledgement and redirection; 'Well, I suppose' signals tentative reasoning about something genuinely uncertain. Both sound authentic because they are authentic — they are not exam prep phrases.",
              pattern: "Right, so [briefly reframe or acknowledge the question topic], [state your position and begin developing it].\nWell, I suppose [tentative framing of your position], [reason]. That said, [qualification or nuance].",
              mistake: "Don't drop these particles mid-sentence — 'I think that, right, the government should...' is hesitation, not fluency. Use them only at the very opening of your response, before your first substantive clause, to signal that you are organising your thinking rather than reading from a script.",
              practice: "Answer this Part 3 question aloud using 'Right, so...' as your opener: 'Do you think governments spend enough on public healthcare?' Aim for 4–5 sentences: opener + position + reason + evidence or example + 'That said...' concession.",
              workedExample: [
                "Right, so when it comes to healthcare spending, I think most governments are caught between short-term budget pressures and what would actually be optimal for long-term population health. Well, I suppose the honest answer is that no government spends enough — demand consistently outpaces supply, particularly as populations age and chronic disease rates rise. The data from the OECD consistently shows that countries with higher public health investment have better outcomes across almost every metric. That said, the efficiency of how existing budgets are allocated is arguably as important as the total amount spent.",
                "Right, so the question of whether social media has been good or bad for democracy is genuinely complicated. I'd say it has simultaneously opened up political discourse to people who were previously excluded from it, while also creating the conditions for disinformation to spread at a scale that traditional media gatekeeping would have prevented. Well, I suppose my honest view is that the net effect has been slightly negative, largely because the platform incentive structures reward outrage over accuracy.",
                "Well, I suppose when I think about what's actually driven the decline of traditional industries, the honest answer is that automation and globalisation are both responsible, but to different degrees in different sectors. Right, so manufacturing jobs in particular have been hit hard by automation, while service sector jobs have been more affected by offshoring — though the line between those two forces is increasingly difficult to draw clearly.",
              ],
              examples: [
                { label: "Speaking Part 3 (policy question)", sentence: "Right, so when it comes to climate policy, I think what's often overlooked is the role of individual consumption habits — governments tend to focus on industry regulation, but the demand side of the problem rarely gets the same attention." },
                { label: "Speaking Part 3 (social question)", sentence: "Well, I suppose the most significant factor driving rapid urbanisation is economic opportunity — people follow the jobs, and jobs have concentrated in cities in ways that make it very difficult for rural economies to compete." },
              ],
            },
            {
              term: "What I find… is that / What strikes me is…",
              why: "These cleft-style openers do two things simultaneously: they begin your Part 3 answer with a structurally advanced sentence type (a cleft sentence), AND they immediately signal your analytical angle before you explain it. 'What strikes me most about this issue' tells the examiner that you have identified a specific and perhaps counterintuitive aspect — which is exactly the depth of engagement the Band 8 Fluency and Coherence descriptor rewards in Part 3 responses.",
              pattern: "What I find [adjective: interesting / troubling / significant / counterintuitive] about this is that [claim that matches the adjective].\nWhat strikes me most is that [surprising or underappreciated observation], [which / because / given that] [development of why it matters].",
              mistake: "Don't add 'is' twice: 'What I find is that is...' is a grammatical error. The structure is 'What I find [adjective] about X is that [clause]' — the adjective and optional 'about X' go between 'find' and 'is'. The clause follows 'is'. Also don't use 'interesting' as your adjective — it's vague. Choose something specific: 'counterintuitive', 'troubling', 'underappreciated', 'consistently overlooked'.",
              practice: "Answer this Part 3 question using 'What I find...' as your opener, followed by a PER structure (Position → Evidence → Reasoning): 'In what ways has technology changed the way people communicate?' Aim for 4–5 sentences and make sure your adjective in the opener is specific and matches what you actually say next.",
              workedExample: [
                "What I find most counterintuitive about how technology has changed communication is not that it has made us more connected — that's obvious — but that it has simultaneously made many people feel significantly more isolated. Research consistently shows that people with the highest social media usage often report the lowest levels of genuine social satisfaction, which suggests that frequency of contact and quality of connection are very different things.",
                "What strikes me most about the debate around university education is that it almost always focuses on economic returns — graduate earnings premiums, employer demand for degree holders — when the strongest argument for broad access to higher education might actually be civic rather than economic: the contribution of a well-educated citizenry to the quality of democratic decision-making.",
                "What I find genuinely troubling about current climate policy is not the ambition of the stated targets — most governments have signed up to reasonably ambitious commitments on paper — but the consistent gap between those commitments and the policy mechanisms actually deployed to meet them. That's where the real analysis needs to happen.",
              ],
              examples: [
                { label: "Speaking Part 3 (analytical opener)", sentence: "What I find most counterintuitive about this is that countries with the strongest social safety nets also tend to have the highest levels of entrepreneurial activity — which suggests that security, not risk, is what enables people to take chances." },
                { label: "Speaking Part 3 (critical observation)", sentence: "What strikes me most is that the debate around education funding almost never centres on outcomes — it's almost always framed in terms of budget constraints, which I think is why systemic improvement is so difficult to achieve." },
              ],
            },
            {
              term: "That said… / Having said that…",
              why: "'That said' and 'Having said that' are discourse markers that signal a concession — you are acknowledging that your previous point has a real limit or a genuine exception. This is the single most important fluency technique for Band 8 Speaking Part 3: it allows you to present a balanced, nuanced view without making your answer feel structurally fragmented or contradictory. Critically, it sounds completely natural — unlike 'On the other hand', which many candidates overuse to the point where it sounds like a memorised structure.",
              pattern: "[Main position + development]. That said, [concession or qualification that genuinely limits or nuances the first point without reversing it].\n[Position stated clearly]. Having said that, [the real-world exception or counterpoint], which means [implication or why your overall position still holds].",
              mistake: "Don't use 'That said' to introduce a point that contradicts rather than qualifies your position — it should narrow or nuance, not reverse. If your answer completely changes direction after 'That said', the examiner will perceive it as inconsistency or weak critical thinking. The qualification should make your position more precise, not abandon it.",
              practice: "Answer this Part 3 question aloud, using 'That said...' as a concession after stating and developing your position: 'Is it better for children to grow up in a city or in the countryside?' State your position in 2–3 sentences, then concede a genuine limitation using 'That said...' and explain why the concession doesn't change your overall view.",
              workedExample: [
                "I think on balance a city childhood offers considerably more in terms of educational opportunity, cultural exposure, and social diversity. The range of schools, extracurricular activities, and peer groups available in a major city is simply not replicable in most rural settings. That said, the pace and density of city life come at a real developmental cost: children in urban environments typically get far less unstructured outdoor play, which the developmental psychology literature consistently links to creativity, emotional regulation, and risk tolerance.",
                "Remote working has clearly improved work-life balance for a significant portion of the workforce, and the productivity data from the first couple of years largely supports that picture. Having said that, there's a growing body of evidence that junior employees in particular are losing out on the informal mentoring and cultural transmission that happens naturally in shared workspaces — and that's a real cost that aggregate productivity metrics tend not to capture.",
                "I do think that social media has made political participation considerably more accessible to groups that were historically marginalised from formal political processes, and that's a genuine democratic gain. That said, accessibility and quality of participation are not the same thing — and there's a real question about whether the form of engagement that social media enables actually contributes to better collective decision-making or undermines it.",
              ],
              examples: [
                { label: "Speaking Part 3 (balanced view)", sentence: "I do think technology has genuinely improved access to education in remarkable ways — the range of free, high-quality learning resources available today was unimaginable twenty years ago. That said, the digital divide means that millions of students in lower-income households still lack reliable internet access, which means the benefit is concentrated rather than universal." },
                { label: "Speaking Part 3 (nuanced concession)", sentence: "Remote working has clearly improved work-life balance for a significant portion of the workforce, and the productivity data largely supports that. Having said that, there's a growing body of evidence that junior employees in particular are losing out on the informal mentoring and cultural transmission that happens naturally in shared workspaces — and that's a real cost that productivity metrics don't capture." },
              ],
            },
            {
              term: "I'd argue that… / I'm fairly convinced that…",
              why: "'I'd argue that' is precisely the right epistemic stance for IELTS Speaking Part 3: it signals a personal but reasoned position — one you hold on the basis of logic or evidence, not mere preference. 'I'm fairly convinced that' goes one step further: the adverb 'fairly' signals appropriate intellectual humility (strong grounds, but open to counter-argument), which is exactly the nuanced certainty the Band 8 examiner is looking for. Both phrases also signal to the examiner that an argument — not just a statement — is about to follow.",
              pattern: "I'd argue that [position], [particularly / especially] when one considers [specific evidence, example, or reasoning that supports the position].\nI'm fairly convinced that [claim], [given / based on / in light of] [supporting reason or observable trend].",
              mistake: "Don't use 'I'd argue that' and then fail to provide an argument. If you open with this phrase, the examiner expects a reason, evidence, or logical development within the next one to two sentences. 'I'd argue that cities are better. Because they're fun.' — that 'because' clause fails to deliver an argument, and the mismatch between the sophisticated opener and the thin content will be noticed.",
              practice: "Answer this Part 3 question using 'I'd argue that...' as your opener, a reason and example as your development, then a 'That said...' concession at the end: 'Do you think economic development should take priority over environmental protection?' Aim for 5–6 sentences total.",
              workedExample: [
                "I'd argue that framing this as a binary choice between economic development and environmental protection is itself the fundamental problem — the most compelling economic argument for environmental protection is that long-term development is simply impossible on a degraded resource base. I'm fairly convinced that countries which invest early in clean infrastructure and circular economy models will have a significant competitive advantage within two decades, as both input costs and regulatory environments shift decisively in that direction.",
                "I'd argue that the most consequential education policy change a government can make is not curriculum reform or school structure, but investment in the quality and status of the teaching profession — because teachers are the delivery mechanism for every other improvement. I'm fairly convinced that the countries currently outperforming expectations in international assessments are, without exception, those that have made teacher recruitment, training, and retention a genuine national priority.",
                "I'd argue that the real driver behind rising inequality isn't globalisation itself — it's the consistent political failure to redistribute the gains from it equitably, particularly through progressive taxation and investment in public services for lower-income communities. I'm fairly convinced that reversing inequality through redistribution alone is insufficient without also addressing the structural barriers in housing, education, and social capital that determine which families can actually access the gains from a growing economy.",
              ],
              examples: [
                { label: "Speaking Part 3 (clear evidenced position)", sentence: "I'd argue that the real driver behind rising inequality isn't globalisation itself — it's the consistent political failure to redistribute the gains from it equitably, particularly through progressive taxation and investment in public services for lower-income communities." },
                { label: "Speaking Part 3 (forward-looking claim)", sentence: "I'm fairly convinced that within two decades, the majority of routine cognitive work — data entry, basic legal drafting, standard financial analysis — will be automated, and the question we should be asking right now is not whether that will happen, but whether our education systems are preparing people for the roles that will remain." },
              ],
            },
          ],
        },
        {
          id: "p-w4-t2",
          label: "Speaking Practice: Full Session with Critical Self-Listen",
          description: "Complete a full Part 1, 2, 3 session and record yourself. Listen back critically: do your openers sound natural or rehearsed? Did you use at least one cleft structure in Part 3? Did you use 'That said...' at least once? Identify one specific thing to fix before your mock.",
          resourcePath: "/dashboard/speaking",
          resourceLabel: "Open Speaking Module",
          minutes: 35,
        },
        {
          id: "p-w4-t3",
          label: "Elite Hub: Full Timed Mock (Strict Conditions)",
          description: "Reading: 60 minutes. Listening: 30 minutes. Writing: 60 minutes (20 min Task 1 + 40 min Task 2). No pausing, no phone, no checking answers mid-test. After finishing, score each module against Band 8 descriptors and identify the single remaining gap to focus on before exam day.",
          resourcePath: "/dashboard/elite",
          resourceLabel: "Open Elite Hub",
          minutes: 150,
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
  h2{font-size:13px;color:#1e40af;background:#eff6ff;padding:6px 12px;border-radius:6px;border-left:3px solid #3b82f6;margin:20px 0 10px}
  .meta{color:#64748b;font-size:12px;margin-bottom:20px}
  .source{font-size:12px;color:#2563eb;margin-bottom:20px}
  .qblock{margin-bottom:18px;padding:12px;border:1px solid #e2e8f0;border-radius:8px;page-break-inside:avoid}
  .qlabel{font-size:12px;font-weight:700;color:#1e40af;margin-bottom:3px}
  .qinstr{font-size:11px;color:#64748b;margin-bottom:8px;line-height:1.5}
  .ans{padding:10px 12px;border-radius:6px;border:1px solid #cbd5e1;background:#f8fafc;font-size:13px;min-height:60px;white-space:pre-wrap;line-height:1.6}
  @media print{button{display:none!important}}
</style></head><body>
<h1>${task.label}</h1>
<div class="meta">Completed: ${date} | For review by the EngInAja coaching team</div>
${task.sourceUrl ? `<div class="source">Source: <a href="${task.sourceUrl}">${task.sourceUrl}</a></div>` : ""}
${prompts.map(p => `
<div class="qblock">
  <div class="qlabel">${p.label}</div>
  <div class="qinstr">${p.instruction}</div>
  <div class="ans">${answers[p.id] || '<span style="color:#94a3b8;font-style:italic">No answer given</span>'}</div>
</div>`).join("")}
</body></html>`;
    const win = window.open("", "_blank");
    if (win) { win.document.write(html); win.document.close(); setTimeout(() => win.print(), 400); }
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
                href={buildWhatsAppLink("Hi EngInAja team, I'd like to upgrade to Elite to unlock my full Study Plan and get the +1.5 band guarantee.")}
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
