import { useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronRight, ChevronLeft, CheckCircle, XCircle,
  Trophy, RotateCcw, Check, Lightbulb, X,
  Mic, MessageSquare, Clock, Target,
} from "lucide-react";
import { Button } from "@/components/ui/button";

// ─────────────────────────────────────────────
// Motion variants
// ─────────────────────────────────────────────
const slideVariants = {
  enter: (dir: number) => ({ x: dir > 0 ? "100%" : "-100%", opacity: 0 }),
  center: { x: 0, opacity: 1, transition: { duration: 0.38, ease: [0.25, 0.46, 0.45, 0.94] as const } },
  exit: (dir: number) => ({
    x: dir < 0 ? "100%" : "-100%", opacity: 0,
    transition: { duration: 0.28, ease: "easeIn" },
  }),
};

const fadeUp = (delay = 0) => ({
  hidden: { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.38, ease: "easeOut", delay } },
});

const popIn = (delay = 0) => ({
  hidden: { opacity: 0, scale: 0.88 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.32, ease: "easeOut", delay } },
});

// ─────────────────────────────────────────────
// Shared UI
// ─────────────────────────────────────────────
function Pill({ label, color = "blue" }: { label: string; color?: "blue" | "green" | "amber" | "purple" | "red" }) {
  const cls: Record<string, string> = {
    blue:   "bg-blue-100 text-blue-700 border-blue-300",
    green:  "bg-green-100 text-green-700 border-green-300",
    amber:  "bg-amber-100 text-amber-700 border-amber-300",
    purple: "bg-purple-100 text-purple-700 border-purple-300",
    red:    "bg-red-100 text-red-700 border-red-300",
  };
  return <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full border ${cls[color]}`}>{label}</span>;
}

function Tip({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex gap-2 p-3 rounded-lg bg-amber-50 border border-amber-200">
      <Lightbulb className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
      <p className="text-sm text-amber-800">{children}</p>
    </div>
  );
}

type SentenceData = { text: string; highlights: { phrase: string; tag: string; color: string }[] };

function SentenceWithHighlights({ sentence }: { sentence: SentenceData }) {
  const parts: React.ReactNode[] = [];
  let remaining = sentence.text;
  sentence.highlights.forEach(h => {
    const idx = remaining.indexOf(h.phrase);
    if (idx === -1) return;
    if (idx > 0) parts.push(<span key={parts.length}>{remaining.slice(0, idx)}</span>);
    parts.push(
      <span key={parts.length} className={`font-semibold px-1 rounded ${h.color}`} title={h.tag}>{h.phrase}</span>
    );
    remaining = remaining.slice(idx + h.phrase.length);
  });
  if (remaining) parts.push(<span key="rest">{remaining}</span>);
  return <p className="text-sm text-gray-800 leading-relaxed">{parts}</p>;
}

function CueCard() {
  return (
    <div className="rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 p-4 space-y-2">
      <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">Cue Card</p>
      <p className="text-sm font-medium text-gray-800">Describe a memorable journey you have taken.</p>
      <p className="text-xs text-gray-500 mt-1">You should say:</p>
      <ul className="text-xs text-gray-600 space-y-1 pl-2">
        <li>• where you went</li>
        <li>• who you went with</li>
        <li>• what you did there</li>
      </ul>
      <p className="text-xs text-gray-500 italic">…and explain why the journey was so memorable.</p>
    </div>
  );
}

// ─────────────────────────────────────────────
// SLIDE 1 — Welcome (embedded)
// ─────────────────────────────────────────────
function Slide1Welcome({ onStart }: { onStart: () => void }) {
  const stats = [
    { value: "3 Parts", label: "in the Speaking test" },
    { value: "11–14 min", label: "total exam time" },
    { value: "Band 9", label: "model answers inside" },
  ];
  return (
    <div className="space-y-8">
      <motion.div variants={fadeUp(0)} initial="hidden" animate="visible" className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/20 mb-2">
          <Mic className="w-3.5 h-3.5 text-accent" />
          <span className="text-xs text-accent">Interactive Tutorial</span>
        </div>
        <h1 className="text-3xl font-bold">Speaking: All 3 Parts</h1>
        <p className="text-muted-foreground max-w-lg mx-auto text-sm leading-relaxed">
          A step-by-step guide showing exactly how to answer Parts 1, 2, and 3 — with real example questions and Band 9 model responses.
        </p>
      </motion.div>

      <div className="grid grid-cols-3 gap-4">
        {stats.map((s, i) => (
          <motion.div key={s.value} variants={popIn(0.15 + i * 0.1)} initial="hidden" animate="visible"
            className="glass-card p-4 text-center">
            <p className="text-2xl font-bold text-accent">{s.value}</p>
            <p className="text-xs text-muted-foreground mt-1">{s.label}</p>
          </motion.div>
        ))}
      </div>

      <motion.div variants={fadeUp(0.45)} initial="hidden" animate="visible" className="space-y-3">
        <p className="text-sm font-medium">What examiners score you on:</p>
        {[
          ["Fluency & Coherence", "Do you speak smoothly without long pauses?"],
          ["Lexical Resource", "Do you use a wide, precise range of vocabulary?"],
          ["Grammatical Range & Accuracy", "Do you use complex structures correctly?"],
          ["Pronunciation", "Can a listener understand you easily?"],
        ].map(([title, desc], i) => (
          <motion.div key={title} variants={fadeUp(0.5 + i * 0.08)} initial="hidden" animate="visible"
            className="flex items-start gap-3 p-3 rounded-lg bg-secondary/30 border border-border/20">
            <div className="w-5 h-5 rounded-full bg-accent/20 flex items-center justify-center shrink-0 mt-0.5">
              <span className="text-[10px] font-bold text-accent">{i + 1}</span>
            </div>
            <div>
              <p className="text-sm font-medium">{title}</p>
              <p className="text-xs text-muted-foreground">{desc}</p>
            </div>
          </motion.div>
        ))}
      </motion.div>

      <motion.div variants={fadeUp(0.9)} initial="hidden" animate="visible" className="flex justify-center">
        <Button size="lg" onClick={onStart} className="gap-2 px-8">
          Start Tutorial <ChevronRight className="w-4 h-4" />
        </Button>
      </motion.div>
    </div>
  );
}

// ─────────────────────────────────────────────
// SLIDE 2 — What is Part 1?
// ─────────────────────────────────────────────
function Slide2Part1Overview({ onComplete }: { onComplete: () => void }) {
  const facts = [
    {
      icon: Clock,
      q: "How long does Part 1 last?",
      a: "4–5 minutes. The examiner asks 3 topic areas (e.g. hobbies, home, work/study) with 2–3 questions each. It's meant to warm you up.",
    },
    {
      icon: MessageSquare,
      q: "What kind of questions will I get?",
      a: "Personal, familiar questions: 'Do you enjoy cooking?', 'How often do you travel?', 'Did you like school as a child?' — topics you can answer naturally.",
    },
    {
      icon: Target,
      q: "What does the examiner want to see?",
      a: "Natural fluency and range. Avoid one-word answers. Aim for 2–4 sentences per answer using the PEEL structure on the next slide.",
    },
  ];
  const [revealed, setRevealed] = useState<number[]>([]);
  const toggle = (i: number) => {
    if (revealed.includes(i)) return;
    const next = [...revealed, i];
    setRevealed(next);
    if (next.length === 3) onComplete();
  };

  return (
    <div className="space-y-5">
      <motion.div variants={fadeUp(0)} initial="hidden" animate="visible">
        <Pill label="Part 1 · Step 1 of 3" color="blue" />
        <h2 className="text-xl font-bold mt-2 text-gray-900">What is Part 1?</h2>
        <p className="text-sm text-gray-500 mt-1">Click each question to find out what to expect in the interview section.</p>
      </motion.div>

      <div className="grid gap-3">
        {facts.map((fact, i) => (
          <motion.button key={i} variants={fadeUp(0.1 + i * 0.08)} initial="hidden" animate="visible"
            onClick={() => toggle(i)}
            className={`w-full text-left p-4 rounded-xl border transition-all duration-300 ${
              revealed.includes(i) ? "bg-blue-50 border-blue-300" : "bg-gray-50 border-gray-200 hover:border-blue-200"
            }`}>
            <div className="flex items-start gap-3">
              <div className={`w-8 h-8 rounded-lg shrink-0 flex items-center justify-center transition-colors ${
                revealed.includes(i) ? "bg-blue-200" : "bg-gray-200"
              }`}>
                <fact.icon className={`w-4 h-4 ${revealed.includes(i) ? "text-blue-700" : "text-gray-500"}`} />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">{fact.q}</p>
                <AnimatePresence>
                  {revealed.includes(i) && (
                    <motion.p initial={{ opacity: 0, height: 0, marginTop: 0 }}
                      animate={{ opacity: 1, height: "auto", marginTop: 8 }}
                      exit={{ opacity: 0, height: 0, marginTop: 0 }}
                      transition={{ duration: 0.25 }}
                      className="text-xs text-blue-800 leading-relaxed overflow-hidden">
                      {fact.a}
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>
              {revealed.includes(i) && <Check className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />}
            </div>
          </motion.button>
        ))}
      </div>

      {revealed.length < 3 && (
        <p className="text-xs text-center text-gray-400">Click all 3 to continue ({revealed.length}/3)</p>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────
// SLIDE 3 — PEEL Formula for Part 1
// ─────────────────────────────────────────────
function Slide3PEEL({ onComplete }: { onComplete: () => void }) {
  const parts = [
    {
      letter: "P", title: "Position", badge: "1 sentence",
      bg: "bg-blue-50 border-blue-200 hover:bg-blue-100",
      numBg: "bg-blue-200", numText: "text-blue-900", titleText: "text-blue-900",
      descText: "text-blue-800", badgeText: "text-blue-500 border-blue-200",
      text: "Directly answer the question in your very first sentence. Say yes, no, or your clear stance. Don't build up to it — examiners reward directness. Example: 'Yes, I genuinely enjoy cooking — it's one of my favourite ways to unwind.'",
    },
    {
      letter: "E", title: "Example", badge: "1–2 sentences",
      bg: "bg-green-50 border-green-200 hover:bg-green-100",
      numBg: "bg-green-200", numText: "text-green-900", titleText: "text-green-900",
      descText: "text-green-800", badgeText: "text-green-500 border-green-200",
      text: "Give a specific personal example. Specificity shows fluency. Use 'For example…', 'For instance…', or 'Actually, just last week…' to introduce it. Example: 'Most weekends I try a new recipe — recently I made Thai green curry completely from scratch.'",
    },
    {
      letter: "E", title: "Elaborate", badge: "1–2 sentences",
      bg: "bg-purple-50 border-purple-200 hover:bg-purple-100",
      numBg: "bg-purple-200", numText: "text-purple-900", titleText: "text-purple-900",
      descText: "text-purple-800", badgeText: "text-purple-500 border-purple-200",
      text: "Add depth with a feeling, contrast, or extra detail. Cleft structures ('What I love most is…') are excellent here — they show grammatical range. Example: 'What I find most satisfying is the creative process — you can combine different flavours to make something entirely your own.'",
    },
    {
      letter: "L", title: "Link", badge: "1 sentence",
      bg: "bg-amber-50 border-amber-200 hover:bg-amber-100",
      numBg: "bg-amber-200", numText: "text-amber-900", titleText: "text-amber-900",
      descText: "text-amber-800", badgeText: "text-amber-500 border-amber-200",
      text: "Wrap up with a short concluding thought. This signals you've finished — the examiner won't interrupt a speaker who wraps up cleanly. Example: 'So cooking is something I find both relaxing and genuinely rewarding.'",
    },
  ];
  const [open, setOpen] = useState<number[]>([]);
  const toggle = (i: number) => {
    if (open.includes(i)) return;
    const next = [...open, i];
    setOpen(next);
    if (next.length === 4) onComplete();
  };

  return (
    <div className="space-y-5">
      <motion.div variants={fadeUp(0)} initial="hidden" animate="visible">
        <Pill label="Part 1 · Step 2 of 3" color="green" />
        <h2 className="text-xl font-bold mt-2 text-gray-900">The PEEL Formula</h2>
        <p className="text-sm text-gray-500 mt-1">Every strong Part 1 answer uses this 4-part structure. Click each element to learn how to use it.</p>
      </motion.div>

      <div className="space-y-2.5">
        {parts.map((p, i) => (
          <motion.div key={i} variants={fadeUp(0.1 + i * 0.08)} initial="hidden" animate="visible">
            <button onClick={() => toggle(i)}
              className={`w-full text-left p-4 rounded-xl border transition-all duration-300 ${p.bg}`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full ${p.numBg} flex items-center justify-center shrink-0`}>
                    <span className={`text-sm font-bold ${p.numText}`}>{p.letter}</span>
                  </div>
                  <span className={`font-semibold text-sm ${p.titleText}`}>{p.title}</span>
                  <span className={`text-[10px] border px-1.5 py-0.5 rounded-full ${p.badgeText}`}>{p.badge}</span>
                </div>
                {open.includes(i) && <Check className="w-4 h-4 text-gray-400 shrink-0" />}
              </div>
              <AnimatePresence>
                {open.includes(i) && (
                  <motion.p initial={{ opacity: 0, height: 0, marginTop: 0 }}
                    animate={{ opacity: 1, height: "auto", marginTop: 8 }}
                    exit={{ opacity: 0, height: 0, marginTop: 0 }}
                    transition={{ duration: 0.25 }}
                    className={`text-xs leading-relaxed overflow-hidden pl-11 ${p.descText}`}>
                    {p.text}
                  </motion.p>
                )}
              </AnimatePresence>
            </button>
          </motion.div>
        ))}
      </div>
      {open.length < 4 && (
        <p className="text-xs text-center text-gray-400">Open all 4 parts to continue ({open.length}/4)</p>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────
// SLIDE 4 — Build a Part 1 Answer
// ─────────────────────────────────────────────
const PART1_SENTENCES: SentenceData[] = [
  {
    text: "Yes, I genuinely enjoy cooking — it's actually one of my favourite ways to unwind after a long day.",
    highlights: [
      { phrase: "Yes, I genuinely enjoy cooking", tag: "POSITION (P)", color: "text-blue-700 bg-blue-100" },
      { phrase: "one of my favourite ways to unwind", tag: "ELABORATION", color: "text-green-700 bg-green-100" },
    ],
  },
  {
    text: "For example, most weekends I set aside a couple of hours to try a new recipe — recently I made Thai green curry completely from scratch.",
    highlights: [
      { phrase: "For example,", tag: "EXAMPLE LINKER (E)", color: "text-purple-700 bg-purple-100" },
      { phrase: "completely from scratch", tag: "SPECIFIC DETAIL", color: "text-amber-700 bg-amber-100" },
    ],
  },
  {
    text: "What I find most satisfying is the creative process — you can experiment with different flavours and techniques to make something entirely your own.",
    highlights: [
      { phrase: "What I find most satisfying is", tag: "CLEFT STRUCTURE (E)", color: "text-red-700 bg-red-100" },
      { phrase: "experiment with different flavours", tag: "ELABORATE", color: "text-cyan-700 bg-cyan-100" },
    ],
  },
  {
    text: "So cooking is something I find both relaxing and genuinely rewarding.",
    highlights: [
      { phrase: "So", tag: "CONCLUSION LINKER (L)", color: "text-blue-700 bg-blue-100" },
      { phrase: "both relaxing and genuinely rewarding", tag: "PAIRED ADJECTIVES", color: "text-green-700 bg-green-100" },
    ],
  },
];

function Slide4Part1Answer({ onComplete }: { onComplete: () => void }) {
  const [revealed, setRevealed] = useState(0);
  const add = () => { const n = revealed + 1; setRevealed(n); if (n === PART1_SENTENCES.length) onComplete(); };

  return (
    <div className="space-y-5">
      <motion.div variants={fadeUp(0)} initial="hidden" animate="visible">
        <Pill label="Part 1 · Step 3 of 3" color="blue" />
        <h2 className="text-xl font-bold mt-2 text-gray-900">Build a Part 1 Answer</h2>
        <p className="text-sm text-gray-500 mt-1">Example question: "Do you enjoy cooking? Why or why not?" — click to build the PEEL answer sentence by sentence.</p>
      </motion.div>

      <div className="p-3 rounded-xl bg-blue-50 border border-blue-200">
        <p className="text-xs font-semibold text-blue-700 uppercase tracking-wide mb-1">Question</p>
        <p className="text-sm text-blue-900 italic">"Do you enjoy cooking? Why or why not?"</p>
      </div>

      <div className="p-4 rounded-xl bg-gray-50 border border-gray-200 space-y-3 min-h-[110px]">
        <AnimatePresence mode="popLayout">
          {PART1_SENTENCES.slice(0, revealed).map((s, i) => (
            <motion.div key={i} initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.35 }}>
              <SentenceWithHighlights sentence={s} />
            </motion.div>
          ))}
        </AnimatePresence>
        {revealed === 0 && <p className="text-xs text-gray-300 italic">Click "Add sentence" to start building...</p>}
      </div>

      {revealed < PART1_SENTENCES.length ? (
        <div className="text-center">
          <Button onClick={add} variant="outline" className="gap-2 border-gray-300 text-gray-700 hover:bg-gray-100">
            Add sentence {revealed + 1} / {PART1_SENTENCES.length} <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      ) : (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
          <p className="text-xs text-center text-green-600 font-medium">Part 1 answer complete!</p>
          <div className="flex flex-wrap gap-1.5 justify-center">
            {[
              { tag: "POSITION (P)", c: "text-blue-700 border-blue-300" },
              { tag: "EXAMPLE LINKER (E)", c: "text-purple-700 border-purple-300" },
              { tag: "CLEFT STRUCTURE (E)", c: "text-red-700 border-red-300" },
              { tag: "CONCLUSION LINKER (L)", c: "text-blue-700 border-blue-300" },
              { tag: "SPECIFIC DETAIL", c: "text-amber-700 border-amber-300" },
            ].map(b => (
              <span key={b.tag} className={`text-[10px] font-medium px-2 py-0.5 rounded-full border ${b.c}`}>{b.tag}</span>
            ))}
          </div>
          <Tip>A 4-sentence PEEL answer lasts about 25–35 seconds — exactly what examiners want for Part 1. Never give just one sentence.</Tip>
        </motion.div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────
// SLIDE 5 — What is Part 2?
// ─────────────────────────────────────────────
function Slide5Part2Overview({ onComplete }: { onComplete: () => void }) {
  const steps = [
    { label: "Read the cue card", desc: "You get a card with a topic and 3–4 bullet points. Read it carefully — you must cover every bullet in your answer.", color: "bg-purple-50 border-purple-200", numBg: "bg-purple-200", numText: "text-purple-800", descText: "text-purple-800" },
    { label: "Plan for 60 seconds", desc: "Use the pencil and paper provided. Jot a brief idea for each bullet point. Don't write full sentences — just key words.", color: "bg-blue-50 border-blue-200", numBg: "bg-blue-200", numText: "text-blue-800", descText: "text-blue-800" },
    { label: "Speak for up to 2 minutes", desc: "Open strongly, cover all bullet points, and close with the 'why' (why it was memorable, meaningful, etc.). The examiner will stop you at 2 minutes.", color: "bg-green-50 border-green-200", numBg: "bg-green-200", numText: "text-green-800", descText: "text-green-800" },
  ];
  const [open, setOpen] = useState<number[]>([]);
  const toggle = (i: number) => {
    if (open.includes(i)) return;
    const next = [...open, i];
    setOpen(next);
    if (next.length === 3) onComplete();
  };

  return (
    <div className="space-y-5">
      <motion.div variants={fadeUp(0)} initial="hidden" animate="visible">
        <Pill label="Part 2 · Step 1 of 3" color="purple" />
        <h2 className="text-xl font-bold mt-2 text-gray-900">What is Part 2?</h2>
        <p className="text-sm text-gray-500 mt-1">The Long Turn. You get a cue card and speak for up to 2 minutes without interruption. Click each step to learn the process.</p>
      </motion.div>

      <CueCard />

      <div className="space-y-2.5">
        {steps.map((s, i) => (
          <motion.button key={i} variants={fadeUp(0.15 + i * 0.08)} initial="hidden" animate="visible"
            onClick={() => toggle(i)}
            className={`w-full text-left p-4 rounded-xl border transition-all duration-300 ${s.color}`}>
            <div className="flex items-center gap-3">
              <div className={`w-7 h-7 rounded-full ${s.numBg} flex items-center justify-center shrink-0`}>
                <span className={`text-xs font-bold ${s.numText}`}>{i + 1}</span>
              </div>
              <span className="text-sm font-semibold text-gray-900">{s.label}</span>
              {open.includes(i) && <Check className="w-4 h-4 text-gray-400 ml-auto shrink-0" />}
            </div>
            <AnimatePresence>
              {open.includes(i) && (
                <motion.p initial={{ opacity: 0, height: 0, marginTop: 0 }}
                  animate={{ opacity: 1, height: "auto", marginTop: 8 }}
                  exit={{ opacity: 0, height: 0, marginTop: 0 }}
                  transition={{ duration: 0.25 }}
                  className={`text-xs leading-relaxed overflow-hidden pl-10 ${s.descText}`}>
                  {s.desc}
                </motion.p>
              )}
            </AnimatePresence>
          </motion.button>
        ))}
      </div>

      {open.length < 3 && (
        <p className="text-xs text-center text-gray-400">Click all 3 steps to continue ({open.length}/3)</p>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────
// SLIDE 6 — Plan in 60 Seconds
// ─────────────────────────────────────────────
function Slide6Plan({ onComplete }: { onComplete: () => void }) {
  const bullets = [
    { label: "Where you went", idea: "Yogyakarta, Indonesia — city famous for ancient temples", color: "bg-purple-50 border-purple-200", textColor: "text-purple-800" },
    { label: "Who you went with", idea: "University best friend — our first trip without family", color: "bg-blue-50 border-blue-200", textColor: "text-blue-800" },
    { label: "What you did there", idea: "Borobudur temple at sunrise + local food markets + street food", color: "bg-green-50 border-green-200", textColor: "text-green-800" },
    { label: "Why it was memorable", idea: "First independent trip — planned everything ourselves, sense of freedom", color: "bg-amber-50 border-amber-200", textColor: "text-amber-800" },
  ];
  const [ticked, setTicked] = useState<number[]>([]);
  const tick = (i: number) => {
    if (ticked.includes(i)) return;
    const next = [...ticked, i];
    setTicked(next);
    if (next.length === 4) onComplete();
  };

  return (
    <div className="space-y-5">
      <motion.div variants={fadeUp(0)} initial="hidden" animate="visible">
        <Pill label="Part 2 · Step 2 of 3" color="purple" />
        <h2 className="text-xl font-bold mt-2 text-gray-900">Plan in 60 Seconds</h2>
        <p className="text-sm text-gray-500 mt-1">Click each cue card bullet to reveal what ideas to jot down. Never skip the planning minute.</p>
      </motion.div>

      <CueCard />

      <div className="space-y-2.5">
        {bullets.map((b, i) => (
          <motion.button key={i} variants={fadeUp(0.1 + i * 0.08)} initial="hidden" animate="visible"
            onClick={() => tick(i)}
            className={`w-full text-left p-4 rounded-xl border transition-all duration-300 ${
              ticked.includes(i) ? b.color : "bg-gray-50 border-gray-200 hover:border-gray-300"
            }`}>
            <div className="flex items-center gap-3">
              <div className={`w-5 h-5 rounded border-2 shrink-0 flex items-center justify-center transition-all ${
                ticked.includes(i) ? "bg-green-500 border-green-500" : "border-gray-400"
              }`}>
                {ticked.includes(i) && <Check className="w-3 h-3 text-white" />}
              </div>
              <span className={`text-sm font-medium ${ticked.includes(i) ? b.textColor : "text-gray-900"}`}>{b.label}</span>
            </div>
            <AnimatePresence>
              {ticked.includes(i) && (
                <motion.p initial={{ opacity: 0, height: 0, marginTop: 0 }}
                  animate={{ opacity: 1, height: "auto", marginTop: 8 }}
                  transition={{ duration: 0.25 }}
                  className={`text-xs italic leading-relaxed overflow-hidden pl-8 ${b.textColor}`}>
                  Notes: {b.idea}
                </motion.p>
              )}
            </AnimatePresence>
          </motion.button>
        ))}
      </div>

      {ticked.length < 4 && (
        <p className="text-xs text-center text-gray-400">Tick all 4 bullets to continue ({ticked.length}/4)</p>
      )}

      <AnimatePresence>
        {ticked.length === 4 && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
            <Tip>Your notes are just key words — not full sentences. In the exam, you'd write: "Yogya → friend → temples + food → freedom". That's enough.</Tip>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─────────────────────────────────────────────
// SLIDE 7 — Build a Part 2 Answer
// ─────────────────────────────────────────────
const PART2_SENTENCES: SentenceData[] = [
  {
    text: "I'd like to talk about a trip I took to Yogyakarta, Indonesia, about two years ago — it's a city famous for its ancient temples and vibrant street food scene.",
    highlights: [
      { phrase: "I'd like to talk about", tag: "STRONG OPENING", color: "text-blue-700 bg-blue-100" },
      { phrase: "famous for its ancient temples and vibrant street food scene", tag: "BACKGROUND DETAIL", color: "text-green-700 bg-green-100" },
    ],
  },
  {
    text: "I went there with my closest friend from university, and it was the first time either of us had travelled without our families, which added a real sense of adventure.",
    highlights: [
      { phrase: "it was the first time either of us had travelled", tag: "PAST PERFECT", color: "text-purple-700 bg-purple-100" },
      { phrase: "which added a real sense of adventure", tag: "RELATIVE CLAUSE", color: "text-amber-700 bg-amber-100" },
    ],
  },
  {
    text: "We spent three days exploring the Borobudur temple at sunrise, wandering through local markets, and sampling dishes I'd never tried before.",
    highlights: [
      { phrase: "exploring the Borobudur temple at sunrise", tag: "WHAT (cue card 3)", color: "text-red-700 bg-red-100" },
      { phrase: "sampling dishes I'd never tried before", tag: "SPECIFIC DETAIL", color: "text-cyan-700 bg-cyan-100" },
    ],
  },
  {
    text: "What made it truly unforgettable was the feeling of independence — we had planned everything ourselves, and despite a few hiccups, everything came together beautifully.",
    highlights: [
      { phrase: "What made it truly unforgettable was", tag: "CLEFT FOR WHY MEMORABLE", color: "text-red-700 bg-red-100" },
      { phrase: "despite a few hiccups", tag: "CONTRAST PHRASE", color: "text-purple-700 bg-purple-100" },
    ],
  },
];

function Slide7Part2Answer({ onComplete }: { onComplete: () => void }) {
  const [revealed, setRevealed] = useState(0);
  const add = () => { const n = revealed + 1; setRevealed(n); if (n === PART2_SENTENCES.length) onComplete(); };

  return (
    <div className="space-y-5">
      <motion.div variants={fadeUp(0)} initial="hidden" animate="visible">
        <Pill label="Part 2 · Step 3 of 3" color="purple" />
        <h2 className="text-xl font-bold mt-2 text-gray-900">Build a Part 2 Answer</h2>
        <p className="text-sm text-gray-500 mt-1">Using our plan, click to add each sentence and see how it covers the cue card.</p>
      </motion.div>

      <CueCard />

      <div className="p-4 rounded-xl bg-gray-50 border border-gray-200 space-y-3 min-h-[110px]">
        <AnimatePresence mode="popLayout">
          {PART2_SENTENCES.slice(0, revealed).map((s, i) => (
            <motion.div key={i} initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.35 }}>
              <SentenceWithHighlights sentence={s} />
            </motion.div>
          ))}
        </AnimatePresence>
        {revealed === 0 && <p className="text-xs text-gray-300 italic">Click "Add sentence" to start building...</p>}
      </div>

      {revealed < PART2_SENTENCES.length ? (
        <div className="text-center">
          <Button onClick={add} variant="outline" className="gap-2 border-gray-300 text-gray-700 hover:bg-gray-100">
            Add sentence {revealed + 1} / {PART2_SENTENCES.length} <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      ) : (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
          <p className="text-xs text-center text-green-600 font-medium">Part 2 answer complete!</p>
          <Tip>Starting with "I'd like to talk about…" signals confidence. End with the 'why' (your cleft sentence) — it's the most memorable moment for the examiner.</Tip>
        </motion.div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────
// SLIDE 8 — What is Part 3?
// ─────────────────────────────────────────────
function Slide8Part3Overview({ onComplete }: { onComplete: () => void }) {
  const types = [
    {
      label: "Opinion questions",
      examples: '"Do you think governments should invest more in public transport?" · "Is it better to live in a city or the countryside?"',
      tip: "State your view immediately. Use: 'Absolutely', 'I firmly believe', 'In my view'. Never just say 'I think it depends.'",
      color: "bg-blue-50 border-blue-200", textColor: "text-blue-800", exColor: "text-blue-600",
    },
    {
      label: "Comparison questions",
      examples: '"How has travel changed over the last 20 years?" · "What are the differences between public and private transport?"',
      tip: "Use: 'Compared to the past…', 'In contrast…', 'Whereas older generations…'. Include a then-and-now or A-vs-B structure.",
      color: "bg-purple-50 border-purple-200", textColor: "text-purple-800", exColor: "text-purple-600",
    },
    {
      label: "Speculation questions",
      examples: '"What might happen if car ownership continues to rise?" · "How could better transport affect a city\'s economy?"',
      tip: "Use: 'If governments were to invest…', 'It's likely that…', 'I'd imagine that…'. Show you can reason about hypotheticals.",
      color: "bg-green-50 border-green-200", textColor: "text-green-800", exColor: "text-green-600",
    },
  ];
  const [revealed, setRevealed] = useState<number[]>([]);
  const toggle = (i: number) => {
    if (revealed.includes(i)) return;
    const next = [...revealed, i];
    setRevealed(next);
    if (next.length === 3) onComplete();
  };

  return (
    <div className="space-y-5">
      <motion.div variants={fadeUp(0)} initial="hidden" animate="visible">
        <Pill label="Part 3 · Step 1 of 2" color="green" />
        <h2 className="text-xl font-bold mt-2 text-gray-900">What is Part 3?</h2>
        <p className="text-sm text-gray-500 mt-1">Abstract discussion — broader social topics linked to your Part 2 cue card. Click each question type to learn how to handle it.</p>
      </motion.div>

      <div className="space-y-2.5">
        {types.map((t, i) => (
          <motion.button key={i} variants={fadeUp(0.1 + i * 0.08)} initial="hidden" animate="visible"
            onClick={() => toggle(i)}
            className={`w-full text-left p-4 rounded-xl border transition-all duration-300 ${
              revealed.includes(i) ? t.color : "bg-gray-50 border-gray-200 hover:border-gray-300"
            }`}>
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full shrink-0 ${revealed.includes(i) ? "bg-green-500" : "bg-gray-300"}`} />
              <span className="text-sm font-medium text-gray-900">{t.label}</span>
              {revealed.includes(i) && <Check className="w-4 h-4 text-gray-400 ml-auto shrink-0" />}
            </div>
            <AnimatePresence>
              {revealed.includes(i) && (
                <motion.div initial={{ opacity: 0, height: 0, marginTop: 0 }}
                  animate={{ opacity: 1, height: "auto", marginTop: 10 }}
                  exit={{ opacity: 0, height: 0, marginTop: 0 }}
                  transition={{ duration: 0.25 }}
                  className="overflow-hidden pl-4 space-y-2">
                  <p className={`text-[11px] italic ${t.exColor}`}>{t.examples}</p>
                  <p className={`text-xs leading-relaxed ${t.textColor}`}><strong>Strategy: </strong>{t.tip}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>
        ))}
      </div>

      {revealed.length < 3 && (
        <p className="text-xs text-center text-gray-400">Click all 3 question types to continue ({revealed.length}/3)</p>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────
// SLIDE 9 — Build a Part 3 Answer
// ─────────────────────────────────────────────
const PART3_SENTENCES: SentenceData[] = [
  {
    text: "Absolutely — I strongly believe governments should significantly increase their investment in public transport.",
    highlights: [
      { phrase: "Absolutely —", tag: "STRONG POSITION", color: "text-blue-700 bg-blue-100" },
      { phrase: "significantly increase", tag: "PRECISE ADVERB", color: "text-green-700 bg-green-100" },
    ],
  },
  {
    text: "Take Singapore or Tokyo as prime examples — their world-class metro systems have dramatically reduced traffic congestion and cut carbon emissions across the city.",
    highlights: [
      { phrase: "Take Singapore or Tokyo as prime examples", tag: "EVIDENCE", color: "text-purple-700 bg-purple-100" },
      { phrase: "dramatically reduced", tag: "STRONG VERB", color: "text-amber-700 bg-amber-100" },
    ],
  },
  {
    text: "The underlying reason is that private car ownership simply isn't sustainable — both in terms of the environmental damage and the sheer amount of urban space it consumes.",
    highlights: [
      { phrase: "The underlying reason is that", tag: "REASONING PHRASE", color: "text-red-700 bg-red-100" },
      { phrase: "both in terms of", tag: "DUAL POINT STRUCTURE", color: "text-cyan-700 bg-cyan-100" },
    ],
  },
  {
    text: "That said, the success of such investment ultimately depends on whether services are genuinely affordable and accessible to all income groups.",
    highlights: [
      { phrase: "That said,", tag: "CONCESSION LINKER", color: "text-blue-700 bg-blue-100" },
      { phrase: "ultimately depends on whether", tag: "NUANCED CONCLUSION", color: "text-purple-700 bg-purple-100" },
    ],
  },
];

function Slide9Part3Answer({ onComplete }: { onComplete: () => void }) {
  const [revealed, setRevealed] = useState(0);
  const add = () => { const n = revealed + 1; setRevealed(n); if (n === PART3_SENTENCES.length) onComplete(); };

  return (
    <div className="space-y-5">
      <motion.div variants={fadeUp(0)} initial="hidden" animate="visible">
        <Pill label="Part 3 · Step 2 of 2" color="green" />
        <h2 className="text-xl font-bold mt-2 text-gray-900">Build a Part 3 Answer</h2>
        <p className="text-sm text-gray-500 mt-1">Question: "Do you think governments should invest more in public transport?" — use the PER formula (Position, Evidence, Reasoning).</p>
      </motion.div>

      <div className="p-3 rounded-xl bg-green-50 border border-green-200">
        <p className="text-xs font-semibold text-green-700 uppercase tracking-wide mb-1">Question</p>
        <p className="text-sm text-green-900 italic">"Do you think governments should invest more in public transport?"</p>
      </div>

      <div className="flex gap-2">
        {[
          { letter: "P", label: "Position", color: "bg-blue-100 text-blue-800 border-blue-300" },
          { letter: "E", label: "Evidence", color: "bg-purple-100 text-purple-800 border-purple-300" },
          { letter: "R", label: "Reasoning", color: "bg-red-100 text-red-800 border-red-300" },
        ].map(f => (
          <div key={f.letter} className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-medium ${f.color}`}>
            <span className="font-bold">{f.letter}</span> {f.label}
          </div>
        ))}
      </div>

      <div className="p-4 rounded-xl bg-gray-50 border border-gray-200 space-y-3 min-h-[110px]">
        <AnimatePresence mode="popLayout">
          {PART3_SENTENCES.slice(0, revealed).map((s, i) => (
            <motion.div key={i} initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.35 }}>
              <SentenceWithHighlights sentence={s} />
            </motion.div>
          ))}
        </AnimatePresence>
        {revealed === 0 && <p className="text-xs text-gray-300 italic">Click "Add sentence" to start building...</p>}
      </div>

      {revealed < PART3_SENTENCES.length ? (
        <div className="text-center">
          <Button onClick={add} variant="outline" className="gap-2 border-gray-300 text-gray-700 hover:bg-gray-100">
            Add sentence {revealed + 1} / {PART3_SENTENCES.length} <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      ) : (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
          <p className="text-xs text-center text-green-600 font-medium">Part 3 answer complete!</p>
          <Tip>Add a concession ("That said…", "However…") at the end — it shows balanced critical thinking and earns marks in Coherence & Cohesion.</Tip>
        </motion.div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────
// SLIDE 10 — Quiz
// ─────────────────────────────────────────────
const QUIZ_QUESTIONS = [
  {
    q: "What does the 'P' in the PEEL formula stand for for Part 1 answers?",
    options: [
      { id: "A", text: "Paraphrase — restate the question before answering" },
      { id: "B", text: "Position — directly answer the question in your first sentence" },
      { id: "C", text: "Preview — list the points you're about to make" },
    ],
    correct: "B",
    explanation: "Position means giving a clear, direct answer immediately. Examiners reward speakers who don't hedge — start with 'Yes, I really enjoy…' not 'Well, it kind of depends…'",
  },
  {
    q: "How long do you have to prepare before speaking in Part 2?",
    options: [
      { id: "A", text: "30 seconds" },
      { id: "B", text: "1 minute" },
      { id: "C", text: "2 minutes" },
    ],
    correct: "B",
    explanation: "You get exactly 1 minute to plan. Use it to jot down key words for each bullet point on the cue card. Never waste this time.",
  },
  {
    q: "Which sentence best opens a Part 2 (cue card) answer?",
    options: [
      { id: "A", text: "\"I want to talk about a journey I went on.\"" },
      { id: "B", text: "\"One of the most memorable journeys I have ever taken was a trip to Yogyakarta, which I visited about two years ago.\"" },
      { id: "C", text: "\"The journey was to Japan and it was very good and I liked it a lot.\"" },
    ],
    correct: "B",
    explanation: "B uses a strong superlative opener ('most memorable'), past perfect grammar, and specific details. It immediately signals Band 7+ to the examiner.",
  },
  {
    q: "For Part 3, which response best uses the PER (Position, Evidence, Reasoning) formula?",
    options: [
      { id: "A", text: "\"Yes, I think governments should invest in transport because it is good for people.\"" },
      { id: "B", text: "\"Absolutely — I believe governments should invest more. Cities like Tokyo show efficient metros reduce congestion significantly. The reason this matters is that car ownership simply isn't sustainable long-term.\"" },
      { id: "C", text: "\"It's a difficult question. Some people say yes and some say no depending on the situation.\"" },
    ],
    correct: "B",
    explanation: "B immediately states a Position, gives named Evidence (Tokyo), and provides a Reasoning clause ('the reason this matters is…'). C is the most common Band 5 trap — never sit on the fence.",
  },
  {
    q: "What is the key difference between Part 1 and Part 3 questions?",
    options: [
      { id: "A", text: "Part 3 questions are personal; Part 1 questions are abstract and societal" },
      { id: "B", text: "Part 1 questions are personal and familiar; Part 3 questions are abstract and about wider society" },
      { id: "C", text: "Part 3 is shorter than Part 1 — you only answer 2 questions" },
    ],
    correct: "B",
    explanation: "Part 1 is about you — your habits, preferences, experiences. Part 3 zooms out to society, policy, and trends. The language shifts from 'I enjoy…' to 'I believe governments should…'.",
  },
];

function Slide10Quiz() {
  const [idx, setIdx] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [shown, setShown] = useState(false);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);

  const answer = (id: string) => { if (shown) return; setSelected(id); setShown(true); if (id === QUIZ_QUESTIONS[idx].correct) setScore(s => s + 1); };
  const next = () => { if (idx < QUIZ_QUESTIONS.length - 1) { setIdx(i => i + 1); setSelected(null); setShown(false); } else setDone(true); };
  const reset = () => { setIdx(0); setSelected(null); setShown(false); setScore(0); setDone(false); };
  const q = QUIZ_QUESTIONS[idx];

  if (done) {
    const pct = Math.round((score / QUIZ_QUESTIONS.length) * 100);
    return (
      <div className="space-y-6 text-center py-4">
        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.4 }}>
          <div className="w-20 h-20 rounded-full bg-accent/20 flex items-center justify-center mx-auto mb-4">
            <Trophy className="w-10 h-10 text-accent" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Quiz Complete!</h2>
          <p className="text-gray-500 mt-1">You scored {score} / {QUIZ_QUESTIONS.length} ({pct}%)</p>
        </motion.div>
        <motion.p initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="text-sm text-gray-600 max-w-sm mx-auto leading-relaxed">
          {pct === 100 ? "Perfect! You have a strong grasp of Speaking strategy across all 3 parts." : pct >= 60 ? "Good work! Revisit any slides you're unsure about, then try a live practice question." : "Keep going — re-read the slides, then try the quiz again."}
        </motion.p>
        <Button variant="outline" onClick={reset} className="gap-2 border-gray-300 text-gray-700 hover:bg-gray-100">
          <RotateCcw className="w-4 h-4" /> Try Again
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <motion.div variants={fadeUp(0)} initial="hidden" animate="visible">
        <Pill label="Quick Quiz" color="amber" />
        <div className="flex items-center justify-between mt-2">
          <h2 className="text-xl font-bold text-gray-900">Test Yourself</h2>
          <span className="text-sm text-gray-400">{idx + 1} / {QUIZ_QUESTIONS.length} · Score: {score}</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-1.5 mt-2">
          <motion.div className="bg-accent h-1.5 rounded-full" animate={{ width: `${((idx + (shown ? 1 : 0)) / QUIZ_QUESTIONS.length) * 100}%` }} transition={{ duration: 0.3 }} />
        </div>
      </motion.div>

      <AnimatePresence mode="wait">
        <motion.div key={idx} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.25 }} className="space-y-3">
          <div className="p-4 rounded-xl bg-gray-50 border border-gray-200">
            <p className="text-sm font-medium text-gray-900">{q.q}</p>
          </div>
          <div className="space-y-2">
            {q.options.map(opt => {
              const isCorrect = opt.id === q.correct;
              const isSelected = selected === opt.id;
              let cls = "w-full text-left p-3.5 rounded-xl border text-sm transition-all ";
              if (!shown) cls += "bg-gray-50 border-gray-200 text-gray-800 hover:border-gray-400 hover:bg-gray-100";
              else if (isCorrect) cls += "bg-green-50 border-green-300 text-green-800";
              else if (isSelected) cls += "bg-red-50 border-red-300 text-red-700";
              else cls += "bg-gray-50 border-gray-100 text-gray-400";
              return (
                <button key={opt.id} onClick={() => answer(opt.id)} disabled={shown} className={cls}>
                  <div className="flex items-start gap-2.5">
                    <span className="font-semibold shrink-0">{opt.id}.</span>
                    <span>{opt.text}</span>
                    {shown && isCorrect && <CheckCircle className="w-4 h-4 text-green-500 shrink-0 ml-auto mt-0.5" />}
                    {shown && isSelected && !isCorrect && <XCircle className="w-4 h-4 text-red-400 shrink-0 ml-auto mt-0.5" />}
                  </div>
                </button>
              );
            })}
          </div>
          {shown && (
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
              className="p-3 rounded-lg bg-accent/10 border border-accent/20 text-sm text-gray-700">
              <strong className="text-accent">Explanation: </strong>{q.explanation}
            </motion.div>
          )}
          {shown && (
            <div className="flex justify-end">
              <Button onClick={next} size="sm" className="gap-2">
                {idx < QUIZ_QUESTIONS.length - 1 ? <><span>Next</span><ChevronRight className="w-4 h-4" /></> : <><span>See Results</span><Trophy className="w-4 h-4" /></>}
              </Button>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

// ─────────────────────────────────────────────
// Main orchestrator
// ─────────────────────────────────────────────
const SLIDE_TITLES = [
  "Welcome",
  "What is Part 1?", "PEEL Formula", "Part 1 Answer",
  "What is Part 2?", "Plan in 60s", "Part 2 Answer",
  "What is Part 3?", "Part 3 Answer",
  "Quiz",
];

export function SpeakingTutorial() {
  const [fullscreen, setFullscreen] = useState(false);
  const [slide, setSlide] = useState(1);
  const [dir, setDir] = useState(1);
  const [completed, setCompleted] = useState<boolean[]>(Array(10).fill(false));

  const markDone = (i: number) => setCompleted(prev => { const n = [...prev]; n[i] = true; return n; });

  const goNext = () => {
    if (slide < 9 && completed[slide]) { setDir(1); setSlide(s => s + 1); }
  };
  const goPrev = () => {
    if (slide > 1) { setDir(-1); setSlide(s => s - 1); }
  };

  const openFullscreen = () => { setFullscreen(true); setSlide(1); };
  const closeFullscreen = () => setFullscreen(false);

  const canNext = completed[slide] && slide < 9;

  const fsSlides = [
    null,
    <Slide2Part1Overview key="s2" onComplete={() => markDone(1)} />,
    <Slide3PEEL key="s3" onComplete={() => markDone(2)} />,
    <Slide4Part1Answer key="s4" onComplete={() => markDone(3)} />,
    <Slide5Part2Overview key="s5" onComplete={() => markDone(4)} />,
    <Slide6Plan key="s6" onComplete={() => markDone(5)} />,
    <Slide7Part2Answer key="s7" onComplete={() => markDone(6)} />,
    <Slide8Part3Overview key="s8" onComplete={() => markDone(7)} />,
    <Slide9Part3Answer key="s9" onComplete={() => markDone(8)} />,
    <Slide10Quiz key="s10" />,
  ];

  const overlay = fullscreen ? createPortal(
    <div className="fixed inset-0 z-[200] bg-white overflow-y-auto">
      {/* Top bar */}
      <div className="sticky top-0 z-10 bg-white/95 backdrop-blur border-b border-gray-200 px-6 py-3 flex items-center gap-4">
        <button onClick={closeFullscreen}
          className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-800 transition-colors">
          <X className="w-4 h-4" /> Exit Tutorial
        </button>
        <div className="flex-1">
          <div className="w-full bg-gray-200 rounded-full h-1">
            <motion.div className="bg-accent h-1 rounded-full"
              animate={{ width: `${(slide / 9) * 100}%` }} transition={{ duration: 0.4 }} />
          </div>
        </div>
        <span className="text-xs text-gray-400 shrink-0">{SLIDE_TITLES[slide]} · {slide} / 9</span>
      </div>

      {/* Slide dots */}
      <div className="flex items-center justify-center gap-1.5 pt-4 px-6">
        {Array.from({ length: 9 }, (_, i) => i + 1).map(i => (
          <button key={i}
            onClick={() => { if (i < slide || completed[i - 1]) { setDir(i > slide ? 1 : -1); setSlide(i); } }}
            className={`rounded-full transition-all duration-300 ${i === slide ? "w-5 h-2 bg-accent" : completed[i] ? "w-2 h-2 bg-accent/50" : "w-2 h-2 bg-gray-300"}`}
          />
        ))}
      </div>

      {/* Part labels */}
      <div className="flex items-center justify-center gap-4 pt-2 px-6">
        {[
          { label: "Part 1", slides: [1, 2, 3], color: "text-blue-600" },
          { label: "Part 2", slides: [4, 5, 6], color: "text-purple-600" },
          { label: "Part 3", slides: [7, 8], color: "text-green-600" },
          { label: "Quiz", slides: [9], color: "text-amber-600" },
        ].map(p => (
          <span key={p.label} className={`text-[10px] font-medium ${p.slides.includes(slide) ? p.color : "text-gray-300"}`}>
            {p.label}
          </span>
        ))}
      </div>

      {/* Slide content */}
      <div className="max-w-2xl mx-auto px-6 py-6 pb-24">
        <div className="relative overflow-hidden min-h-[520px]">
          <AnimatePresence custom={dir} mode="wait">
            <motion.div key={slide} custom={dir} variants={slideVariants} initial="enter" animate="center" exit="exit">
              {fsSlides[slide]}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Bottom nav */}
      {slide !== 9 && (
        <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur border-t border-gray-200 px-6 py-3 flex items-center justify-between max-w-full">
          <Button variant="ghost" size="sm" onClick={goPrev} disabled={slide === 1}
            className="gap-1.5 text-gray-500 hover:text-gray-900 disabled:opacity-30">
            <ChevronLeft className="w-4 h-4" /> Back
          </Button>
          <Button size="sm" onClick={goNext} disabled={!canNext}
            className={`gap-1.5 transition-opacity ${!canNext ? "opacity-30 cursor-not-allowed" : ""}`}>
            Next <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      )}
    </div>,
    document.body
  ) : null;

  return (
    <>
      {overlay}
      <Slide1Welcome onStart={openFullscreen} />
    </>
  );
}
