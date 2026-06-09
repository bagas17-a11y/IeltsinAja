import { useState, useEffect, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import {
  ChevronDown, CheckCircle2, Circle, Clock, ArrowRight,
  Crown, BookOpen, Headphones, PenTool, Mic, Brain,
  Home, ChevronRight, Target, Sparkles, Trophy,
} from "lucide-react";
import {
  Breadcrumb, BreadcrumbItem, BreadcrumbLink,
  BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { cn } from "@/lib/utils";

// ─────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────
interface StudyTask {
  id: string;
  label: string;
  description: string;
  resourcePath?: string;
  resourceLabel?: string;
  minutes: number;
}

interface StudyWeek {
  week: number;
  theme: string;
  focus: string;
  color: "blue" | "green" | "purple" | "amber" | "red";
  rationale: string;
  tasks: StudyTask[];
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
// Curriculum Data
// ─────────────────────────────────────────────
const FOUNDATION_PLAN: TierPlan = {
  tier: "Foundation",
  bandRange: "4.0–5.5",
  targetBand: "6.0–6.5",
  headline: "Build from the ground up",
  description: "Your English foundations need strengthening before IELTS technique layers on top. This 8-week plan starts with grammar and vocabulary, then adds each exam skill one at a time. Every week adds one brick.",
  color: "blue",
  weeks: [
    {
      week: 1, theme: "Grammar Foundations", focus: "Grammar",
      color: "blue",
      rationale: "IELTS penalises systematic grammar errors heavily. Most Band 5 candidates make consistent mistakes with tenses, subject-verb agreement, and articles. Fixing these first creates a stable foundation — you cannot write a coherent Task 2 paragraph without reliable grammar.",
      tasks: [
        { id: "f-w1-t1", label: "Read: Parts of Speech & Sentence Types", description: "Study simple, compound, and complex sentences. Focus on when to use 'because', 'although', 'which', and 'where' to connect ideas.", resourcePath: "/dashboard/revision-notes?topic=parts-of-speech", resourceLabel: "Open Revision Notes", minutes: 30 },
        { id: "f-w1-t2", label: "Flashcards: Articles & Prepositions", description: "The most systematic Band 5 error. Work through the flashcard set covering 'a/an/the' rules and common preposition collocations (interested IN, responsible FOR, depend ON).", resourcePath: "/dashboard/flashcards", resourceLabel: "Open Flashcards", minutes: 20 },
        { id: "f-w1-t3", label: "Practice: Simple → Complex Sentences", description: "Write 10 short simple sentences about any topic. Then rewrite each one using a 'because', 'although', 'which', or 'when' clause. Example: 'Cars are fast.' → 'Cars, which emit large amounts of carbon dioxide, are far faster than public transport.'", minutes: 30 },
        { id: "f-w1-t4", label: "Revision Notes: IELTS Tenses Guide", description: "Learn which tenses are most common in each exam section. Task 1 uses past tenses for historical data and present/future for processes. Task 2 uses present tenses for opinions.", resourcePath: "/dashboard/revision-notes", resourceLabel: "Open Revision Notes", minutes: 20 },
      ],
    },
    {
      week: 2, theme: "Vocabulary: Top IELTS Topics (Part 1)", focus: "Vocabulary",
      color: "purple",
      rationale: "The single biggest jump from Band 5 to 6 is vocabulary range. You need 20–25 words per IELTS topic that go beyond basics. Start with the 3 most frequently tested topics. Don't just memorise words — learn them in collocations (groups of words that go together naturally).",
      tasks: [
        { id: "f-w2-t1", label: "Flashcards: Environment Vocabulary", description: "Learn 25 topic words + collocations: 'environmental degradation', 'carbon emissions', 'renewable energy', 'biodiversity', 'sustainable development'. Practise using 3 in one sentence.", resourcePath: "/dashboard/flashcards", resourceLabel: "Open Flashcards", minutes: 25 },
        { id: "f-w2-t2", label: "Flashcards: Education Vocabulary", description: "Learn 25 topic words: 'academic achievement', 'lifelong learning', 'vocational training', 'higher education', 'critical thinking'. Note which are nouns, verbs, adjectives.", resourcePath: "/dashboard/flashcards", resourceLabel: "Open Flashcards", minutes: 25 },
        { id: "f-w2-t3", label: "Flashcards: Technology Vocabulary", description: "Learn 25 topic words: 'digital literacy', 'artificial intelligence', 'data privacy', 'automation', 'disruptive innovation'. Practise in sentences.", resourcePath: "/dashboard/flashcards", resourceLabel: "Open Flashcards", minutes: 25 },
        { id: "f-w2-t4", label: "Writing Practice: One Sentence Per Topic", description: "Without looking at your notes, write one sentence about each topic using new vocabulary. Example: 'The rapid expansion of digital technology has raised serious concerns about data privacy.' Check, then revise any weak words.", minutes: 20 },
      ],
    },
    {
      week: 3, theme: "Vocabulary: Top IELTS Topics (Part 2)", focus: "Vocabulary",
      color: "purple",
      rationale: "Cover the remaining high-frequency IELTS topics. You'll draw on this vocabulary in every section — Reading passages, Listening conversations, Writing essays, and Speaking answers all revolve around these 12 topic areas. The more automatic it is, the less cognitive load during the exam.",
      tasks: [
        { id: "f-w3-t1", label: "Flashcards: Health Vocabulary", description: "Key words: 'mental health', 'obesity epidemic', 'healthcare access', 'preventive medicine', 'sedentary lifestyle'. Note: 'health' collocates with 'deteriorate', 'improve', 'maintain', 'promote'.", resourcePath: "/dashboard/flashcards", resourceLabel: "Open Flashcards", minutes: 25 },
        { id: "f-w3-t2", label: "Flashcards: Society & Social Issues", description: "Key words: 'social cohesion', 'wealth inequality', 'urbanisation', 'community values', 'social mobility'. Many Speaking Part 3 questions come from this topic area.", resourcePath: "/dashboard/flashcards", resourceLabel: "Open Flashcards", minutes: 25 },
        { id: "f-w3-t3", label: "Flashcards: Work & Economy", description: "Key words: 'economic disparity', 'unemployment rate', 'work-life balance', 'job satisfaction', 'entrepreneurship'. High frequency in Writing Task 2 opinion essays.", resourcePath: "/dashboard/flashcards", resourceLabel: "Open Flashcards", minutes: 25 },
        { id: "f-w3-t4", label: "Revision Notes: Collocations & Word Families", description: "Study noun/verb/adjective forms: 'educate (v) → education (n) → educational (adj) → educationally (adv)'. Using the right word form is tested directly in Reading and Listening.", resourcePath: "/dashboard/revision-notes", resourceLabel: "Open Revision Notes", minutes: 20 },
      ],
    },
    {
      week: 4, theme: "Reading Foundations", focus: "Reading",
      color: "green",
      rationale: "True/False/Not Given is the most common error at Band 5. Candidates confuse 'False' (the text actively contradicts the statement) with 'Not Given' (the topic is simply not mentioned). Getting this one distinction right can lift your Reading score by 0.5 band. This week you'll fix it permanently.",
      tasks: [
        { id: "f-w4-t1", label: "Revision Notes: TFNG Strategy", description: "Read the complete TFNG guide. Key rule: 'False' = the text says the OPPOSITE. 'Not Given' = the text says NOTHING about this. If you're searching for the answer and can't find it, it's Not Given.", resourcePath: "/dashboard/revision-notes", resourceLabel: "Open Revision Notes", minutes: 25 },
        { id: "f-w4-t2", label: "Reading Practice: First Full Test", description: "Attempt a complete reading test. Don't time yourself on this first attempt — focus on accuracy over speed.", resourcePath: "/dashboard/reading", resourceLabel: "Open Reading Module", minutes: 70 },
        { id: "f-w4-t3", label: "Error Analysis: Categorise Your Mistakes", description: "For each error, label it: (A) I misread the text, (B) TFNG confusion, (C) didn't understand vocabulary, (D) ran out of time. Most Band 5 errors fall in category B or C.", minutes: 20 },
        { id: "f-w4-t4", label: "Reading Practice: Second Test (Focus on TFNG)", description: "Attempt a second test. This time, for every TFNG question: (1) find the exact sentence in the text, (2) ask 'does this contradict, or just not mention the statement?'", resourcePath: "/dashboard/reading", resourceLabel: "Open Reading Module", minutes: 70 },
      ],
    },
    {
      week: 5, theme: "Listening Foundations", focus: "Listening",
      color: "amber",
      rationale: "Sections 1 and 2 use everyday language — conversations about accommodation, services, local information. These are fully achievable at Band 6+. Most Band 5 listening errors are spelling mistakes and failure to read ahead, not actual mishearing. Fix these habits this week.",
      tasks: [
        { id: "f-w5-t1", label: "Strategy: Pre-read ALL Questions First", description: "Before the audio plays, read every question in the section. Underline keywords. Predict the answer type: will it be a number, a name, a date, or a word? This alone can add 3–5 marks.", minutes: 15 },
        { id: "f-w5-t2", label: "Listening Practice: First Full Test", description: "Attempt a complete test using the pre-reading strategy. Write your answers during the audio.", resourcePath: "/dashboard/listening", resourceLabel: "Open Listening Module", minutes: 40 },
        { id: "f-w5-t3", label: "Spelling Drill: Section 1 Common Dictations", description: "Practice spelling: days (Monday/Tuesday), months (February/August), street names (Avenue/Boulevard), and common names (Smith/Johnson). Section 1 almost always dictates these.", minutes: 20 },
        { id: "f-w5-t4", label: "Listening Practice: Second Test — Sections 1-2 Focus", description: "Complete a second test. After finishing, review ONLY your Section 1-2 errors. Were errors from mishearing (strategy) or wrong spelling (practice)?", resourcePath: "/dashboard/listening", resourceLabel: "Open Listening Module", minutes: 40 },
      ],
    },
    {
      week: 6, theme: "Writing Task 1 Foundations", focus: "Writing",
      color: "blue",
      rationale: "Task 1 has a clear 4-part structure that Band 5 candidates don't use — they describe data randomly. The overview paragraph (which most Band 5 essays are missing entirely) can add 0.5 band to Task Achievement alone. Learn the structure this week, then apply it immediately.",
      tasks: [
        { id: "f-w6-t1", label: "MudahinAja: Writing Task 1 Tutorial (All 9 Slides)", description: "Complete the full interactive tutorial. Pay particular attention to slides 2 (Structure), 4 (Overview), and 5 (Data Grouping). Take notes on the 4-part structure.", resourcePath: "/dashboard/elite", resourceLabel: "Open MudahinAja", minutes: 50 },
        { id: "f-w6-t2", label: "Writing Practice: First Task 1 Submission", description: "Attempt a Task 1 with AI feedback. Don't aim for perfection — just try to follow the 4-part structure (Introduction, Overview, Body 1, Body 2).", resourcePath: "/dashboard/writing", resourceLabel: "Open Writing Module", minutes: 30 },
        { id: "f-w6-t3", label: "Model Answer Analysis: Identify the 4 Parts", description: "Read the model answer carefully. Label each paragraph: 'Introduction', 'Overview', 'Body 1', 'Body 2'. Notice: the overview has no specific numbers. The body paragraphs do.", minutes: 20 },
        { id: "f-w6-t4", label: "Writing Practice: Second Task 1 (4-Part Structure)", description: "Write a second Task 1. Before starting, write 'INTRO / OVERVIEW / BODY 1 / BODY 2' as headers. Fill in each section. Only delete the headers when submitting.", resourcePath: "/dashboard/writing", resourceLabel: "Open Writing Module", minutes: 30 },
      ],
    },
    {
      week: 7, theme: "Writing Task 2 Foundations", focus: "Writing",
      color: "green",
      rationale: "Task 2 is worth twice as many marks as Task 1. Yet many Band 5 candidates spend equal time on both. The PEEL paragraph structure (Point → Example → Elaborate → Link) addresses all 4 marking criteria simultaneously and guarantees a coherent, developed response.",
      tasks: [
        { id: "f-w7-t1", label: "Revision Notes: The 4 IELTS Essay Types", description: "Learn to identify: Opinion ('Do you agree?'), Discussion ('Discuss both views'), Problem-Solution ('What are the causes and solutions?'), and Two-part ('To what extent… and what should be done?'). Your introduction strategy changes for each type.", resourcePath: "/dashboard/revision-notes", resourceLabel: "Open Revision Notes", minutes: 25 },
        { id: "f-w7-t2", label: "MudahinAja: Writing Task 2 Tutorial", description: "Work through the interactive tutorial, focusing on the thesis statement, PEEL paragraph structure, and the difference between a good and weak conclusion.", resourcePath: "/dashboard/elite", resourceLabel: "Open MudahinAja", minutes: 50 },
        { id: "f-w7-t3", label: "Writing Practice: First Task 2 Submission", description: "Attempt a Task 2 with AI feedback. Focus on: clear thesis sentence, one clear idea per paragraph, relevant examples.", resourcePath: "/dashboard/writing", resourceLabel: "Open Writing Module", minutes: 40 },
        { id: "f-w7-t4", label: "Model Answer Analysis: Introduction vs. Yours", description: "Compare your introduction with the Band 9 model. How does the model's thesis differ from yours? Does the model state a clear position immediately? Rewrite your introduction based on what you learned.", minutes: 25 },
      ],
    },
    {
      week: 8, theme: "Speaking Foundations + First Mock", focus: "Speaking & Mock",
      color: "red",
      rationale: "Speaking is the fastest skill to improve because you can practise anywhere and anytime. By Week 8 you know the PEEL (Part 1) and PER (Part 3) formulas from MudahinAja — now apply them under realistic conditions. The mock exam shows you where you stand with real exam pressure.",
      tasks: [
        { id: "f-w8-t1", label: "MudahinAja: Speaking Tutorial (All 9 Slides)", description: "Complete the full Speaking tutorial covering Part 1 (PEEL formula), Part 2 (cue card planning), and Part 3 (PER formula + question types). The interactive exercises force you to actively build answers.", resourcePath: "/dashboard/elite", resourceLabel: "Open MudahinAja", minutes: 50 },
        { id: "f-w8-t2", label: "Speaking Practice: Full Part 1, 2, and 3", description: "Complete a full speaking session in the Speaking Module. Focus on answer length — Part 1 should be 2–4 sentences, Part 2 at least 90 seconds, Part 3 at least 3–4 sentences.", resourcePath: "/dashboard/speaking", resourceLabel: "Open Speaking Module", minutes: 30 },
        { id: "f-w8-t3", label: "Self-Practice: 3 Part 1 Questions with PEEL", description: "Answer these out loud using PEEL: (1) 'Do you like travelling?', (2) 'How do you usually spend weekends?', (3) 'Did you enjoy school as a child?' Record yourself on your phone and listen back.", minutes: 20 },
        { id: "f-w8-t4", label: "Elite Hub: First Timed Mock Practice", description: "Attempt your first timed practice session. Treat it like the real exam — no pausing, no checking answers mid-way.", resourcePath: "/dashboard/elite", resourceLabel: "Open Elite Hub", minutes: 90 },
        { id: "f-w8-t5", label: "Reflection: Identify Your Weakest Module", description: "After the mock, rank your 4 modules from strongest to weakest. Return to the weakest module's Week resources and do one more practice session before next week.", minutes: 20 },
      ],
    },
  ],
};

const DEVELOPING_PLAN: TierPlan = {
  tier: "Developing",
  bandRange: "5.5–6.5",
  targetBand: "7.0–7.5",
  headline: "Bridge the Band 7 gap",
  description: "You understand the IELTS format and have solid English. The Band 7 gap is about depth and strategy — not more practice, but smarter practice. Each week targets a specific examiner criterion that separates Band 6 from Band 7.",
  color: "purple",
  weeks: [
    {
      week: 1, theme: "Writing Task 1 — The Overview", focus: "Writing",
      color: "blue",
      rationale: "The overview is the single biggest reason candidates score Band 6 instead of 7 in Task 1. It is the make-or-break paragraph for Task Achievement. Most Band 6 candidates either skip it, make it too short, or include specific numbers in it — all three drop your score below 7. Getting the overview right is the single fastest route to Band 7 in Task 1.",
      tasks: [
        { id: "d-w1-t1", label: "MudahinAja: Task 1 — Deep-Dive on the Overview Slide", description: "Reopen the Task 1 tutorial and spend extra time on the Overview slide. Read the explanation 3 times. Key rule: the overview summarises the biggest 1–2 trends in 1–2 sentences, with NO specific numbers whatsoever.", resourcePath: "/dashboard/elite", resourceLabel: "Open MudahinAja", minutes: 30 },
        { id: "d-w1-t2", label: "Practice: Write 3 Overviews (Different Chart Types)", description: "Write one overview for: (1) a bar chart comparing countries' spending, (2) a line graph showing population over time, (3) a pie chart of energy sources. No numbers allowed. Compare your overviews — do they identify the most striking feature?", minutes: 40 },
        { id: "d-w1-t3", label: "Vocabulary: Comparison Language", description: "Memorise and use: 'significantly higher than', 'whereas', 'in contrast to', 'roughly equivalent', 'substantially more', 'marginally lower', 'a marked difference'.", resourcePath: "/dashboard/flashcards", resourceLabel: "Open Flashcards", minutes: 20 },
        { id: "d-w1-t4", label: "Writing Practice: Task 1 Submission with Overview Focus", description: "Submit a Task 1. After getting AI feedback, ask: 'Does my overview give the examiner a clear picture of the data without opening the original chart?' If yes, it's working.", resourcePath: "/dashboard/writing", resourceLabel: "Open Writing Module", minutes: 40 },
      ],
    },
    {
      week: 2, theme: "Writing Task 1 — Data Grouping & Language", focus: "Writing",
      color: "blue",
      rationale: "Describing every data point in order from left to right is the defining characteristic of a Band 6 Task 1. Grouping by pattern — 'categories where Country A was higher' vs. 'categories where Country B was higher' — creates the analytical quality Band 7 requires. Approximation language removes the need to memorise every exact figure.",
      tasks: [
        { id: "d-w2-t1", label: "MudahinAja: Data Grouping Slide — Practice the Assignment Exercise", description: "In the Task 1 tutorial, redo the Data Grouping interactive slide. Try to group the categories before clicking — this trains your eye to spot patterns in the exam.", resourcePath: "/dashboard/elite", resourceLabel: "Open MudahinAja", minutes: 25 },
        { id: "d-w2-t2", label: "Vocabulary: Approximation Language", description: "Memorise: 'roughly double', 'just over', 'approximately', 'marginally higher', 'slightly less than', 'nearly three times as much', 'a fraction of'. These replace the need to know exact numbers.", resourcePath: "/dashboard/flashcards", resourceLabel: "Open Flashcards", minutes: 20 },
        { id: "d-w2-t3", label: "Vocabulary: Strong Comparison Phrases", description: "Memorise: 'over three times as much', 'equivalent to roughly', 'a considerable gap', 'the most striking difference', 'by far the highest'. These lift your Lexical Resource score noticeably.", resourcePath: "/dashboard/flashcards", resourceLabel: "Open Flashcards", minutes: 20 },
        { id: "d-w2-t4", label: "Writing Practice: Task 1 — Grouping by Pattern", description: "Before writing, spend 3 minutes identifying your 2 groups/patterns. Write 'Group 1: ___' and 'Group 2: ___' on paper. Then write Body 1 about Group 1 and Body 2 about Group 2.", resourcePath: "/dashboard/writing", resourceLabel: "Open Writing Module", minutes: 40 },
        { id: "d-w2-t5", label: "Comparison: Your Grouping vs. Model Answer", description: "After submitting, compare your groupings with the model answer. Did you identify the same key patterns? If not, look at the data again — what was the most obvious comparison you missed?", minutes: 20 },
      ],
    },
    {
      week: 3, theme: "Writing Task 2 — Thesis & Counter-Argument", focus: "Writing",
      color: "green",
      rationale: "Band 6 essays have a weak or template thesis ('In this essay I will discuss both sides'). Band 7 requires a clear position stated immediately AND a counter-argument + refutation in the body. One counter-argument + rebuttal paragraph added to your essay can add 0.5 to Coherence & Cohesion.",
      tasks: [
        { id: "d-w3-t1", label: "Revision Notes: How to Write a Band 7 Thesis", description: "Study the difference between a weak thesis ('There are both advantages and disadvantages') and a strong Band 7 thesis ('While social media offers undeniable benefits in terms of connectivity, its detrimental effects on mental health and social isolation significantly outweigh them').", resourcePath: "/dashboard/revision-notes", resourceLabel: "Open Revision Notes", minutes: 25 },
        { id: "d-w3-t2", label: "Vocabulary: Concession Language", description: "Memorise phrases that acknowledge the other side: 'While it is true that…', 'Although X may have some merit…', 'Admittedly…', 'Despite the apparent advantages of…', 'Notwithstanding the fact that…'. Concession + refutation = Band 7 Coherence.", resourcePath: "/dashboard/flashcards", resourceLabel: "Open Flashcards", minutes: 20 },
        { id: "d-w3-t3", label: "Practice: Write Counter-Argument + Refutation", description: "For each position, write a counter-argument (1 sentence) + refutation (1–2 sentences): (1) Social media is harmful. (2) University education should be free. (3) Private cars should be banned in cities.", minutes: 35 },
        { id: "d-w3-t4", label: "Writing Practice: Task 2 — Focus on Thesis & Counter-Argument", description: "Submit a Task 2 essay. After finishing, check: Is your thesis the last sentence of your introduction? Does one body paragraph begin with 'While some argue that…' or 'Admittedly…'?", resourcePath: "/dashboard/writing", resourceLabel: "Open Writing Module", minutes: 45 },
      ],
    },
    {
      week: 4, theme: "Writing Task 2 — Coherence & Cohesion", focus: "Writing",
      color: "green",
      rationale: "'Clear progression throughout' is the Band 7 descriptor for Coherence & Cohesion. This means varied discourse markers, logical paragraph flow, and strong topic sentences. Band 6 essays overuse 'Firstly/Secondly/Finally' and nothing else — examiners notice immediately.",
      tasks: [
        { id: "d-w4-t1", label: "Revision Notes: Discourse Markers by Function", description: "Study discourse markers categorised by what they do: addition (Furthermore, Moreover), contrast (Nevertheless, On the other hand), result (Consequently, As a result), concession (Notwithstanding, Admittedly), example (For instance, To illustrate).", resourcePath: "/dashboard/revision-notes", resourceLabel: "Open Revision Notes", minutes: 25 },
        { id: "d-w4-t2", label: "Audit: Your Last Task 2 Essay", description: "Open your last submitted essay. Highlight every linking device. Count how many TYPES you used (not total count — types). If fewer than 5 types, add 3 different ones to the essay.", minutes: 30 },
        { id: "d-w4-t3", label: "Vocabulary: Advanced Discourse Markers", description: "Memorise and use: 'This is compounded by…', 'By extension…', 'It stands to reason that…', 'Viewed from this perspective…', 'The ramifications of this are…'. These signal sophisticated thinking.", resourcePath: "/dashboard/flashcards", resourceLabel: "Open Flashcards", minutes: 20 },
        { id: "d-w4-t4", label: "Writing Practice: Task 2 — 6+ Discourse Marker Types", description: "Before submitting, count the types of discourse markers in your essay. Aim for at least 6 different functional types. If you only have 'Firstly/Secondly/Finally', replace two of them.", resourcePath: "/dashboard/writing", resourceLabel: "Open Writing Module", minutes: 45 },
      ],
    },
    {
      week: 5, theme: "Vocabulary Upgrade: Band 6 → Band 7", focus: "Vocabulary",
      color: "purple",
      rationale: "The vocabulary gap between Band 6 and 7 is not quantity — it's precision and collocation. 'Make a decision' is fine; 'make an informed, evidence-based decision' shows Band 7 lexical range. 'Many people think' → 'A growing body of opinion suggests'. This week you replace your 20 most overused phrases.",
      tasks: [
        { id: "d-w5-t1", label: "Flashcards: Academic Word List — Top 60 AWL Words", description: "Focus on the 60 most commonly tested AWL words: analyse, approach, assess, assume, authority, available, benefit, concept, consistent, context, create, data, define, derive, distribute, economy, environment, establish, evidence, export, factor, finance, formula, function, identify, income, indicate, individual, interpret, involve, issue, method, occur, percent, period, policy, principle, procedure, process, require, research, role, section, sector, significant, similar, source, specific, structure, theory, vary.", resourcePath: "/dashboard/flashcards", resourceLabel: "Open Flashcards", minutes: 30 },
        { id: "d-w5-t2", label: "Collocations: 20 IELTS Verb+Noun Pairs", description: "Memorise: address an issue, pose a threat, implement a policy, bridge the gap, tackle a problem, raise awareness, alleviate poverty, exacerbate inequality, foster innovation, mitigate the impact. Using these in Writing and Speaking signals Band 7 Lexical Resource.", resourcePath: "/dashboard/flashcards", resourceLabel: "Open Flashcards", minutes: 25 },
        { id: "d-w5-t3", label: "Revision Notes: Formal Register — Words to Avoid", description: "Study the list of informal words that cost marks in IELTS: things, stuff, lots of, get, big, very, a lot, good, bad, important, people think. Every time you use one of these, replace it with a precise alternative.", resourcePath: "/dashboard/revision-notes", resourceLabel: "Open Revision Notes", minutes: 20 },
        { id: "d-w5-t4", label: "Rewrite: Upgrade a Band 6 Paragraph", description: "Take this paragraph and rewrite it at Band 7 level: 'Lots of people think that technology is very important in our lives. It helps us do many things more quickly and makes our lives better. However, technology can also be bad because it makes people lazy.' No sentence from the original should survive unchanged.", minutes: 30 },
        { id: "d-w5-t5", label: "Writing Practice: Zero Generic Words Challenge", description: "Submit a Task 2 with a personal rule: no 'good', 'bad', 'big', 'very', 'a lot', 'people think', 'things'. Before submitting, ctrl+F each word and replace every instance.", resourcePath: "/dashboard/writing", resourceLabel: "Open Writing Module", minutes: 40 },
      ],
    },
    {
      week: 6, theme: "Reading — Band 7 Strategy", focus: "Reading",
      color: "amber",
      rationale: "At Band 6, candidates re-read passages too often and run out of time. Band 7 requires efficient location + accurate inference. Matching headings, author attitude, and sentence completion are the 3 question types that most separate Band 6 from Band 7 candidates — all require understanding meaning beyond the literal words.",
      tasks: [
        { id: "d-w6-t1", label: "Strategy: Matching Headings — First & Last Sentences", description: "For matching headings: read ONLY the first and last sentence of each paragraph. The topic sentence (first) previews the main idea; the last sentence often summarises it. Never read the whole paragraph for headings.", minutes: 20 },
        { id: "d-w6-t2", label: "Reading Practice: Focus on Matching Headings + Sentence Completion", description: "Complete a reading test. After finishing, review your matching headings errors specifically. For each error: go back to the paragraph and find the sentence that contains the heading's meaning.", resourcePath: "/dashboard/reading", resourceLabel: "Open Reading Module", minutes: 70 },
        { id: "d-w6-t3", label: "Strategy: Inference — What the Text Implies", description: "Inference questions ask what the author suggests, not just what they say. Practice distinguishing: (1) text explicitly states, (2) text implies/suggests, (3) text does not address. Only category 1 is True; category 2 might be True or Not Given; category 3 is always Not Given.", minutes: 20 },
        { id: "d-w6-t4", label: "Reading Practice: Second Test — Time Management", description: "Complete a second test with strict 18-minutes-per-passage timing. If you exceed 18 minutes on a passage, move on regardless. Review which questions you left blank due to time — these are your target next week.", resourcePath: "/dashboard/reading", resourceLabel: "Open Reading Module", minutes: 70 },
      ],
    },
    {
      week: 7, theme: "Listening — Sections 3-4 Mastery", focus: "Listening",
      color: "amber",
      rationale: "Sections 3-4 are where Band 6 candidates drop most marks. Section 3 has 2–3 speakers in an academic discussion; Section 4 is a dense, fast academic lecture. Both require you to follow arguments and paraphrase rapidly — completely different strategies from Sections 1-2.",
      tasks: [
        { id: "d-w7-t1", label: "Strategy: Section 3 — Follow the Argument", description: "Section 3 almost always features a student and tutor/supervisor discussing an assignment. The student usually changes their mind or is corrected. Listen for phrases that signal opinion changes: 'Actually, now that I think about it…', 'I'm not sure that's right…', 'You make a good point.'", minutes: 20 },
        { id: "d-w7-t2", label: "Listening Practice: First Test — Sections 3-4 Focus", description: "Complete a full test. After marking, focus exclusively on Section 3 and 4 errors. For each error: find the audio transcript, find where the answer was said, and identify why you missed it (too fast? paraphrased? unexpected vocabulary?).", resourcePath: "/dashboard/listening", resourceLabel: "Open Listening Module", minutes: 40 },
        { id: "d-w7-t3", label: "Strategy: Section 4 — Predict Before It Starts", description: "You get a 30-second pause before Section 4. Use every second: read all questions, predict the topic from questions 31-35 (usually an introduction), predict the subtopics from question numbers 36-40. Mental preparation doubles your accuracy.", minutes: 15 },
        { id: "d-w7-t4", label: "Strategy: Paraphrase Training", description: "The audio NEVER uses the exact same words as the question. Practice: take any sentence from a book, rewrite it 3 different ways with the same meaning. You're training your brain to hear paraphrase in real-time.", minutes: 25 },
        { id: "d-w7-t5", label: "Listening Practice: Second Test — Aim 6+ in Section 4", description: "Complete a second test. Set a personal target of at least 6 correct answers in Section 4. Review errors in detail — were they vocabulary gaps or missed paraphrase?", resourcePath: "/dashboard/listening", resourceLabel: "Open Listening Module", minutes: 40 },
      ],
    },
    {
      week: 8, theme: "Speaking Fluency + Full Mock", focus: "Speaking & Mock",
      color: "red",
      rationale: "At Band 6 your speaking is understandable but too simple — short answers, common vocabulary, audible pauses. Band 7 means: 2-4 full PEEL sentences for Part 1, a 90-second Part 2 monologue with clear structure, and well-reasoned PER answers in Part 3 with varied vocabulary.",
      tasks: [
        { id: "d-w8-t1", label: "MudahinAja: Speaking — Focus on Part 3 PER Formula", description: "Reopen the Speaking tutorial and spend extra time on the Part 3 slides. The PER formula (Position → Evidence → Reasoning) with a final 'That said...' concession is what distinguishes Band 7 from Band 6 in Part 3.", resourcePath: "/dashboard/elite", resourceLabel: "Open MudahinAja", minutes: 30 },
        { id: "d-w8-t2", label: "Vocabulary: 8 Natural 'Buying Time' Phrases", description: "Memorise natural pausing phrases that examiners can't penalise: 'That's an interesting question…', 'Let me think about that for a moment…', 'Off the top of my head…', 'That's something I haven't really considered before, but…', 'I suppose the way I see it is…'", minutes: 15 },
        { id: "d-w8-t3", label: "Speaking Practice: Full Part 1, 2, 3 Session", description: "Record yourself on your phone. For Part 1: use PEEL, 3–4 sentences minimum. For Part 2: use the CueCard structure, open strongly, cover all bullet points, end with 'what made it unforgettable was…'. For Part 3: PER + 'That said...'", resourcePath: "/dashboard/speaking", resourceLabel: "Open Speaking Module", minutes: 35 },
        { id: "d-w8-t4", label: "Elite Hub: Full Timed Mock Exam", description: "Attempt a complete timed mock session. Simulate real exam conditions: no phone, no pausing, strict timing. This is your Band 7 baseline check.", resourcePath: "/dashboard/elite", resourceLabel: "Open Elite Hub", minutes: 90 },
        { id: "d-w8-t5", label: "Self-Assessment: Score Each Section Honestly", description: "After the mock, score yourself in each module on a scale of 1–10. Which module is furthest from your target? That module gets your final week of targeted review.", minutes: 20 },
      ],
    },
  ],
};

const POLISHING_PLAN: TierPlan = {
  tier: "Polishing",
  bandRange: "7.0–8.0",
  targetBand: "8.0–8.5",
  headline: "The final push to Band 8+",
  description: "You are already performing at a high level. The gap to Band 8 is precision — precise vocabulary, varied grammar, and nuanced argument. Six focused weeks, one key skill per week, will close the remaining distance.",
  color: "amber",
  weeks: [
    {
      week: 1, theme: "Advanced Vocabulary — Precision & Register", focus: "Vocabulary",
      color: "blue",
      rationale: "The lexical gap between Band 7 and Band 8 is precision. At Band 7, vocabulary is 'flexible and precise.' At Band 8, you use 'uncommon lexical items with awareness of style and collocation.' Add hedging language (which signals critical thinking), replace all generic adjectives, and master nominalization.",
      tasks: [
        { id: "p-w1-t1", label: "Vocabulary Audit: Replace the 30 Most Overused Words", description: "In your last writing submission, find and replace every instance of: good → beneficial/advantageous/substantial; bad → detrimental/harmful/adverse; important → pivotal/paramount/critical; very → considerably/significantly/markedly; people think → a growing body of opinion suggests.", minutes: 30 },
        { id: "p-w1-t2", label: "Vocabulary: Hedging Language — 10 Essential Phrases", description: "Memorise: 'It could be argued that…', 'There is a tendency to…', 'Evidence suggests that…', 'One might contend that…', 'It remains to be seen whether…', 'This is not to say that…', 'To varying degrees…', 'In certain contexts…'. Use at least 3 per essay.", resourcePath: "/dashboard/flashcards", resourceLabel: "Open Flashcards", minutes: 20 },
        { id: "p-w1-t3", label: "Vocabulary: Nominalization — Verbs to Nouns", description: "Convert verb structures to noun phrases for academic register: 'governments increase spending' → 'an increase in government spending'; 'technology helps solve' → 'the contribution of technology to solving'; 'people fail to consider' → 'a failure to consider'. Nominalization makes writing denser and more academic.", resourcePath: "/dashboard/flashcards", resourceLabel: "Open Flashcards", minutes: 20 },
        { id: "p-w1-t4", label: "Flashcards: Advanced Topic Vocabulary", description: "Focus on low-frequency IELTS vocabulary from your 3 weakest topic areas. Aim to learn 10 new collocations per topic that you have never used in an essay before.", resourcePath: "/dashboard/flashcards", resourceLabel: "Open Flashcards", minutes: 25 },
        { id: "p-w1-t5", label: "Writing Practice: Zero Generic Words, 3+ Hedging Phrases", description: "Submit a Task 2 with these personal rules: no generic adjectives (good/bad/important), no 'very' or 'a lot', and at least 3 hedging phrases. Count them before submitting.", resourcePath: "/dashboard/writing", resourceLabel: "Open Writing Module", minutes: 45 },
      ],
    },
    {
      week: 2, theme: "Writing Task 1 — Band 9 Data Selection", focus: "Writing",
      color: "green",
      rationale: "At Band 7 you group data well. At Band 9 you select only the 3–5 most significant data points. The skill is knowing what NOT to include. Your overview captures the single most striking overall trend in 1–2 precise sentences. Every word earns its place.",
      tasks: [
        { id: "p-w2-t1", label: "Writing Practice: Task 1 — Selective Data Only", description: "Before writing: identify the 3–5 most striking data points. Ask: 'If I could only tell someone 3 things about this data, what would they be?' Write those 3 things only. Submit and check if the model agrees.", resourcePath: "/dashboard/writing", resourceLabel: "Open Writing Module", minutes: 45 },
        { id: "p-w2-t2", label: "Vocabulary: High-Precision Comparison Phrases", description: "Memorise: 'constituted approximately', 'accounted for roughly', 'equivalent to just over', 'in excess of', 'fell considerably short of', 'was dwarfed by', 'peaked at', 'bottomed out at', 'levelled off at around'. These replace 'was about' and 'was more than'.", resourcePath: "/dashboard/flashcards", resourceLabel: "Open Flashcards", minutes: 20 },
        { id: "p-w2-t3", label: "Grammar: Passive Voice in Academic Description", description: "Practice these structures: 'was recorded at', 'can be observed that', 'is illustrated by', 'were attributed to', 'were distributed across', 'was subsequently surpassed by'. Passive voice is preferred in formal data description.", minutes: 20 },
        { id: "p-w2-t4", label: "Overview Quality Check", description: "Read your last 3 Task 1 overviews. For each: does it contain any specific numbers? (It shouldn't.) Does it identify the most striking feature of the data? Does it use precise language rather than vague descriptions?", minutes: 20 },
        { id: "p-w2-t5", label: "Writing Practice: Second Task 1 — Under 180 Words", description: "Challenge: write a Task 1 response in fewer than 180 words that still earns full marks. This forces you to be selective — every sentence must earn its place.", resourcePath: "/dashboard/writing", resourceLabel: "Open Writing Module", minutes: 35 },
      ],
    },
    {
      week: 3, theme: "Writing Task 2 — Band 9 Argument", focus: "Writing",
      color: "green",
      rationale: "Band 8 essays state a clear position and develop it well. Band 9 essays have a qualified, nuanced position — acknowledging complexity while maintaining a clear stance. The conclusion synthesises a new insight rather than summarising the body paragraphs.",
      tasks: [
        { id: "p-w3-t1", label: "Study: Qualified Thesis Writing", description: "A Band 9 thesis acknowledges complexity: 'While both perspectives have some validity, the evidence strongly suggests that X, particularly when one considers Y and Z.' Practice writing 5 qualified thesis statements for different essay prompts before writing a full essay.", minutes: 30 },
        { id: "p-w3-t2", label: "Vocabulary: Sophisticated Conclusion Language", description: "Memorise: 'Ultimately, the evidence overwhelmingly suggests…', 'On balance, the arguments in favour of X significantly outweigh those against…', 'This analysis leads to the inescapable conclusion that…', 'The weight of evidence clearly supports…'.", resourcePath: "/dashboard/flashcards", resourceLabel: "Open Flashcards", minutes: 15 },
        { id: "p-w3-t3", label: "Grammar: Advanced Conditionals for Nuanced Argument", description: "Practice: 'Were governments to invest more heavily in…', 'Should this trend continue unchecked…', 'Had policymakers acted sooner, the consequences…', 'Only if substantial resources are committed…'. These conditionals signal sophisticated reasoning.", minutes: 25 },
        { id: "p-w3-t4", label: "Writing Practice: Synthesis Conclusion Challenge", description: "Submit a Task 2. Write a conclusion that: (1) does NOT simply repeat your introduction, (2) offers a new insight or implication that follows from your argument, (3) begins with 'Ultimately' or 'On balance'.", resourcePath: "/dashboard/writing", resourceLabel: "Open Writing Module", minutes: 50 },
        { id: "p-w3-t5", label: "Analysis: Compare Your Thesis to Band 9 Model", description: "After receiving feedback, compare your thesis to the model. Does your thesis acknowledge complexity before taking a position? Is your conclusion genuinely different from your introduction?", minutes: 20 },
      ],
    },
    {
      week: 4, theme: "Advanced Grammar — Range & Accuracy", focus: "Grammar",
      color: "purple",
      rationale: "Band 9 grammar: 'uses a wide range of structures with full flexibility and accuracy.' That means cleft sentences, inversion, participial clauses, and fronted adverbials — used accurately and naturally, not as memorised templates. Count the distinct grammar structures in your last essay. If fewer than 6, this week is critical.",
      tasks: [
        { id: "p-w4-t1", label: "Grammar: Cleft Sentences", description: "Master 3 patterns: 'What I believe is that…' / 'What makes this issue particularly complex is…' / 'It is the widespread adoption of technology that has transformed…' / 'It was not until recently that governments began to…'. Use in both Writing and Speaking.", minutes: 25 },
        { id: "p-w4-t2", label: "Grammar: Inversion for Emphasis", description: "Master: 'Rarely has this been more evident than…' / 'Not only does this exacerbate inequality, but it also…' / 'Under no circumstances should governments neglect…' / 'Only by investing substantially can societies hope to…'. These instantly signal Band 8+ grammar.", minutes: 25 },
        { id: "p-w4-t3", label: "Grammar: Participial & Absolute Clauses", description: "Master: 'Having examined both perspectives, it is clear that…' / 'Driven largely by economic factors, this trend…' / 'Fuelled by technological advances, society has…' / 'Viewed from this angle, the policy appears…'. These replace weak 'Because' openings.", minutes: 25 },
        { id: "p-w4-t4", label: "Practice: Write 12 Sentences Using Advanced Structures", description: "Write 4 sentences using cleft structures, 4 using inversion, and 4 using participial clauses. Try NOT to use any structure more than once. The variety itself is what earns the mark.", minutes: 35 },
        { id: "p-w4-t5", label: "Writing Practice: 6+ Distinct Grammar Structures", description: "Submit a Task 2. Before submitting, highlight 6 or more structurally distinct sentence types. If you find fewer than 6, revise and add more varied constructions.", resourcePath: "/dashboard/writing", resourceLabel: "Open Writing Module", minutes: 45 },
      ],
    },
    {
      week: 5, theme: "Speaking — Band 8+ Naturalness", focus: "Speaking",
      color: "amber",
      rationale: "At Band 8, the examiner should barely notice your preparation — your language sounds spontaneous, precise, and effortlessly varied. Cleft sentences and sophisticated linkers flow naturally. Connected speech features (linking, assimilation, elision) make fluency sound native-level. And you NEVER use memorised openers.",
      tasks: [
        { id: "p-w5-t1", label: "MudahinAja: Speaking — Reread Part 3 & Concession Technique", description: "Review the Part 3 section of the Speaking tutorial. The 'That said…' concession + qualified conclusion structure is the mark of a Band 8 Part 3 answer. Re-read the model answers on slides 8 and 9.", resourcePath: "/dashboard/elite", resourceLabel: "Open MudahinAja", minutes: 20 },
        { id: "p-w5-t2", label: "Pronunciation: Connected Speech", description: "Practice these connected speech features: (1) Linking: 'turn_off', 'went_away', 'used_it'. (2) Elision: 'nex(t) day', 'mos(t) people'. (3) Assimilation: 'ten_pens' → 'tem pens'. These features are what separate Band 7 and Band 8 pronunciation.", minutes: 30 },
        { id: "p-w5-t3", label: "Strategy: Avoid ALL Memorised Openers", description: "Red flags for Band 8 examiners: 'That's a very interesting question', 'This is a good question', 'I'm glad you asked this'. These signal memorised responses and can cap your score at Band 6.5. Replace with natural alternatives: 'Right, so…', 'Let me think…', 'That's something I find quite…'", minutes: 10 },
        { id: "p-w5-t4", label: "Speaking Practice: Record & Critical Self-Listen", description: "Complete a full Part 1, 2, 3 session. Record yourself. Listen back and ask: Does it sound natural and spontaneous? Do I use varied vocabulary? Do I vary my sentence structures? How is my pronunciation on connected speech?", resourcePath: "/dashboard/speaking", resourceLabel: "Open Speaking Module", minutes: 40 },
        { id: "p-w5-t5", label: "Practice: Part 3 with Cleft Openers", description: "Answer 5 Part 3 questions, each opening with a cleft sentence: 'What I find particularly noteworthy is…', 'What strikes me most about this issue is…', 'What I believe to be the most critical factor is…'. Record yourself and compare to your natural speech.", minutes: 25 },
      ],
    },
    {
      week: 6, theme: "Full Mock + Final Precision Targeting", focus: "Mock & Review",
      color: "red",
      rationale: "Five weeks of targeted practice have addressed your known gaps. A full timed mock under exam conditions reveals your remaining weak points clearly. The final days of your preparation should focus entirely on the single module where the Band 8 gap is largest.",
      tasks: [
        { id: "p-w6-t1", label: "Elite Hub: Full Timed Mock (Strict Conditions)", description: "Reading: 60 minutes. Listening: 30 minutes. Writing: 60 minutes (20 min Task 1 + 40 min Task 2). No pausing. Phone face-down. No checking answers mid-test. This is your final practice before the real thing.", resourcePath: "/dashboard/elite", resourceLabel: "Open Elite Hub", minutes: 150 },
        { id: "p-w6-t2", label: "Self-Assessment Against Band 8 Descriptors", description: "Score each module using official Band 8 descriptors: Writing (Task Achievement, Coherence, Lexical Resource, Grammatical Range); Speaking (Fluency, Lexical, Grammatical, Pronunciation). Which is furthest from Band 8?", minutes: 30 },
        { id: "p-w6-t3", label: "Targeted 90-Minute Review of Weakest Module", description: "Identify your lowest-scoring module from the mock. Spend 90 focused minutes on it: re-read the relevant study plan weeks, attempt 2 more practice questions, and apply the specific strategies that were missing in the mock.", resourcePath: "/dashboard/reading", resourceLabel: "Open Your Weakest Module", minutes: 90 },
        { id: "p-w6-t4", label: "Final Vocabulary Check: Zero Weak Words", description: "Read your mock Task 2 submission. Highlight any remaining generic words (good, bad, important, many, very, a lot, people think, things). Replace every single one.", minutes: 25 },
        { id: "p-w6-t5", label: "Final Grammar Check: 6+ Structures Confirmed", description: "Read your mock Task 2. Annotate each sentence with its grammatical type: simple, compound, complex, cleft, inverted, participial, conditional, nominalized. Count the distinct types — you need 6+.", minutes: 20 },
      ],
    },
  ],
};

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

  const cacheKey = user?.id ? `ielts-studyplan-${user.id}` : null;

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

  useEffect(() => {
    if (!cacheKey) return;
    try {
      const raw = localStorage.getItem(cacheKey);
      if (raw) setCompletedTasks(new Set(JSON.parse(raw)));
    } catch { /* ignore */ }
  }, [cacheKey]);

  const toggleTask = useCallback((taskId: string) => {
    setCompletedTasks(prev => {
      const next = new Set(prev);
      if (next.has(taskId)) next.delete(taskId);
      else next.add(taskId);
      if (cacheKey) {
        try { localStorage.setItem(cacheKey, JSON.stringify([...next])); } catch { /* ignore */ }
      }
      return next;
    });
  }, [cacheKey]);

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

        {/* Elite upsell for non-Elite users */}
        {profile?.subscription_tier !== "elite" && (
          <div className="glass-card p-5 border border-elite-gold/30 bg-elite-gold/5">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-elite-gold/20 flex items-center justify-center shrink-0">
                <Crown className="w-5 h-5 text-elite-gold" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-foreground">Guaranteed +1.5 band increase</p>
                <p className="text-sm text-muted-foreground mt-1">
                  This roadmap shows you what to study. Elite gives you 1-on-1 coaching, AI feedback on every submission, MudahinAja interactive tutorials, and mock exams — so you actually achieve it.
                </p>
                <Button size="sm" className="mt-3 bg-elite-gold/20 text-elite-gold border border-elite-gold/30 hover:bg-elite-gold/30"
                  onClick={() => navigate("/pricing-selection")}>
                  Upgrade to Elite <Crown className="w-3.5 h-3.5 ml-1.5" />
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Week cards */}
        <div className="space-y-3">
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
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
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
