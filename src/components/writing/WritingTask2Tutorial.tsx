import { useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronRight, ChevronLeft, CheckCircle, XCircle,
  Trophy, RotateCcw, Check, Lightbulb, PenTool,
  X, ChevronDown, BookOpen, MessageSquare,
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
function Pill({ label, color = "blue" }: { label: string; color?: "blue" | "green" | "amber" | "purple" | "rose" }) {
  const cls: Record<string, string> = {
    blue:   "bg-blue-100 text-blue-700 border-blue-300",
    green:  "bg-green-100 text-green-700 border-green-300",
    amber:  "bg-amber-100 text-amber-700 border-amber-300",
    purple: "bg-purple-100 text-purple-700 border-purple-300",
    rose:   "bg-rose-100 text-rose-700 border-rose-300",
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

function QuestionBox() {
  return (
    <div className="p-4 rounded-xl bg-blue-50 border border-blue-200">
      <p className="text-[11px] uppercase tracking-wide text-blue-500 mb-2 font-medium">Exam Question</p>
      <p className="text-sm text-gray-800 leading-relaxed">
        Some people think that the best way to reduce crime is to give longer prison sentences. Others, however, believe that there are better alternative methods of reducing crime. <span className="font-semibold text-blue-700">Discuss both views and give your own opinion.</span>
      </p>
    </div>
  );
}

// ─────────────────────────────────────────────
// SLIDE 1 — Welcome (embedded, light-mode safe)
// ─────────────────────────────────────────────
function Slide1Welcome({ onStart }: { onStart: () => void }) {
  const stats = [
    { value: "250+", label: "words required" },
    { value: "40 min", label: "recommended" },
    { value: "2×", label: "marks vs Task 1" },
  ];
  return (
    <div className="space-y-8">
      <motion.div variants={fadeUp(0)} initial="hidden" animate="visible" className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/20 mb-2">
          <PenTool className="w-3.5 h-3.5 text-accent" />
          <span className="text-xs text-accent">Interactive Tutorial</span>
        </div>
        <h1 className="text-3xl font-bold">Task 2: The Academic Essay</h1>
        <p className="text-muted-foreground max-w-lg mx-auto text-sm leading-relaxed">
          A step-by-step guide showing exactly how to analyse a "Discuss both views" question and build a Band 9 response — paragraph by paragraph.
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
        <p className="text-sm font-medium">The 4 scoring criteria:</p>
        {[
          ["Task Response", "Did you answer all parts with a clear, consistent position?"],
          ["Coherence & Cohesion", "Is your essay logically organised and well-linked?"],
          ["Lexical Resource", "Do you use varied, accurate academic vocabulary?"],
          ["Grammatical Range", "Do you use complex structures with good control?"],
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
// SLIDE 2 — Analyse the Question
// ─────────────────────────────────────────────
function Slide2Analyse({ onComplete }: { onComplete: () => void }) {
  const hotspots = [
    {
      label: "Question Type",
      highlight: "Discuss both views and give your own opinion.",
      title: "Question Type: Discuss Both Views + Opinion",
      body: "You must present BOTH sides fairly in separate paragraphs AND state your own clear position. Your opinion should appear in the introduction and conclusion, and can be woven into Body P2.",
      color: "border-blue-300 bg-blue-50",
      pillColor: "blue" as const,
    },
    {
      label: "View A",
      highlight: "longer prison sentences",
      title: "View A: Harsher Punishment",
      body: "The first argument — longer sentences act as a deterrent and protect society. You will explain and support this view in Body Paragraph 1, even if you personally disagree with it.",
      color: "border-purple-300 bg-purple-50",
      pillColor: "purple" as const,
    },
    {
      label: "View B",
      highlight: "better alternative methods",
      title: "View B: Alternative Approaches",
      body: "The second argument — rehabilitation, education, community programmes. You will argue this view in Body Paragraph 2 and this is typically where you embed your own opinion.",
      color: "border-green-300 bg-green-50",
      pillColor: "green" as const,
    },
  ];

  const [revealed, setReveal] = useState<number[]>([]);
  const toggle = (i: number) => {
    if (revealed.includes(i)) return;
    const next = [...revealed, i];
    setReveal(next);
    if (next.length === 3) onComplete();
  };

  return (
    <div className="space-y-5">
      <motion.div variants={fadeUp(0)} initial="hidden" animate="visible">
        <Pill label="Step 1 of 8" color="blue" />
        <h2 className="text-xl font-bold mt-2 text-gray-900">Analyse the Question</h2>
        <p className="text-sm text-gray-500 mt-1">Before writing a word, identify the question type and what you're being asked to do. Click each highlighted part below.</p>
      </motion.div>

      <motion.div variants={fadeUp(0.1)} initial="hidden" animate="visible"
        className="p-4 rounded-xl bg-gray-50 border border-gray-200">
        <p className="text-[11px] uppercase tracking-wide text-gray-400 mb-2">Exam Question</p>
        <p className="text-sm text-gray-700 leading-relaxed">
          Some people think that the best way to reduce crime is to give{" "}
          <button onClick={() => toggle(1)}
            className={`font-semibold px-1 rounded transition-all ${revealed.includes(1) ? "bg-purple-100 text-purple-700" : "bg-purple-50 text-purple-600 hover:bg-purple-100 underline decoration-dotted"}`}>
            longer prison sentences
          </button>
          . Others, however, believe that there are{" "}
          <button onClick={() => toggle(2)}
            className={`font-semibold px-1 rounded transition-all ${revealed.includes(2) ? "bg-green-100 text-green-700" : "bg-green-50 text-green-600 hover:bg-green-100 underline decoration-dotted"}`}>
            better alternative methods
          </button>
          {" "}of reducing crime.{" "}
          <button onClick={() => toggle(0)}
            className={`font-semibold px-1 rounded transition-all ${revealed.includes(0) ? "bg-blue-100 text-blue-700" : "bg-blue-50 text-blue-600 hover:bg-blue-100 underline decoration-dotted"}`}>
            Discuss both views and give your own opinion.
          </button>
        </p>
      </motion.div>

      <div className="space-y-2.5">
        {hotspots.map((h, i) => (
          <motion.div key={i} variants={fadeUp(0.15 + i * 0.07)} initial="hidden" animate="visible">
            <AnimatePresence>
              {revealed.includes(i) && (
                <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}
                  className={`p-4 rounded-xl border ${h.color}`}>
                  <div className="flex items-center gap-2 mb-1.5">
                    <Pill label={h.label} color={h.pillColor} />
                    <span className="text-sm font-semibold text-gray-900">{h.title}</span>
                  </div>
                  <p className="text-xs text-gray-600 leading-relaxed">{h.body}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>

      {revealed.length === 3 && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          className="p-3 rounded-xl bg-green-50 border border-green-200 flex items-start gap-2">
          <CheckCircle className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
          <p className="text-xs text-green-800">You identified all 3 key parts. Now you know exactly what to write — both views fairly presented, plus your own clear position.</p>
        </motion.div>
      )}

      {revealed.length < 3 && (
        <p className="text-xs text-center text-gray-400">Click the 3 highlighted parts to analyse them ({revealed.length}/3)</p>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────
// SLIDE 3 — Essay Blueprint
// ─────────────────────────────────────────────
function Slide3Blueprint({ onComplete }: { onComplete: () => void }) {
  const parts = [
    {
      num: 1, title: "Introduction", badge: "2 sentences",
      bg: "bg-blue-50 border-blue-200 hover:bg-blue-100",
      numBg: "bg-blue-200", numText: "text-blue-800",
      titleText: "text-blue-900", descText: "text-blue-800", badgeStyle: "text-blue-500 border-blue-200",
      text: "Sentence 1: Paraphrase the topic (don't copy the question). Sentence 2: Your thesis — state that you will discuss both views and signal your own position. Never leave your opinion vague.",
    },
    {
      num: 2, title: "Body Paragraph 1", badge: "View A",
      bg: "bg-purple-50 border-purple-200 hover:bg-purple-100",
      numBg: "bg-purple-200", numText: "text-purple-800",
      titleText: "text-purple-900", descText: "text-purple-800", badgeStyle: "text-purple-500 border-purple-200",
      text: "Present the argument FOR longer prison sentences. Even if you disagree, explain it fairly. Use the PEEL pattern: Point → Evidence → Explanation → Link. This shows Task Response breadth.",
    },
    {
      num: 3, title: "Body Paragraph 2", badge: "View B + Opinion",
      bg: "bg-green-50 border-green-200 hover:bg-green-100",
      numBg: "bg-green-200", numText: "text-green-800",
      titleText: "text-green-900", descText: "text-green-800", badgeStyle: "text-green-500 border-green-200",
      text: "Present the argument FOR alternative methods. THIS is where you embed your personal position: 'However, I believe…' or 'In my view…'. Support with an example. Your opinion should be clear and consistent.",
    },
    {
      num: 4, title: "Conclusion", badge: "2–3 sentences",
      bg: "bg-amber-50 border-amber-200 hover:bg-amber-100",
      numBg: "bg-amber-200", numText: "text-amber-800",
      titleText: "text-amber-900", descText: "text-amber-800", badgeStyle: "text-amber-500 border-amber-200",
      text: "Restate your position in new words. Briefly summarise the two main arguments. Do NOT introduce new ideas here. A strong conclusion locks in your Task Response score.",
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
        <Pill label="Step 2 of 8" color="purple" />
        <h2 className="text-xl font-bold mt-2 text-gray-900">The 4-Paragraph Blueprint</h2>
        <p className="text-sm text-gray-500 mt-1">Every Band 7+ "Discuss both views" essay uses this structure. Click each paragraph to understand its role.</p>
      </motion.div>

      <div className="space-y-2.5">
        {parts.map((p, i) => (
          <motion.div key={i} variants={fadeUp(0.1 + i * 0.08)} initial="hidden" animate="visible">
            <button onClick={() => toggle(i)}
              className={`w-full text-left p-4 rounded-xl border transition-all duration-300 ${p.bg}`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-6 h-6 rounded-full ${p.numBg} flex items-center justify-center shrink-0`}>
                    <span className={`text-xs font-bold ${p.numText}`}>{p.num}</span>
                  </div>
                  <span className={`font-semibold text-sm ${p.titleText}`}>{p.title}</span>
                  <span className={`text-[10px] border px-1.5 py-0.5 rounded-full ${p.badgeStyle}`}>{p.badge}</span>
                </div>
                {open.includes(i) && <Check className="w-4 h-4 text-gray-400 shrink-0" />}
              </div>
              <AnimatePresence>
                {open.includes(i) && (
                  <motion.p initial={{ opacity: 0, height: 0, marginTop: 0 }}
                    animate={{ opacity: 1, height: "auto", marginTop: 8 }}
                    exit={{ opacity: 0, height: 0, marginTop: 0 }}
                    transition={{ duration: 0.25 }}
                    className={`text-xs leading-relaxed overflow-hidden pl-9 ${p.descText}`}>
                    {p.text}
                  </motion.p>
                )}
              </AnimatePresence>
            </button>
          </motion.div>
        ))}
      </div>

      {open.length < 4 && (
        <p className="text-xs text-center text-gray-400">Open all 4 paragraphs to continue ({open.length}/4)</p>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────
// SLIDE 4 — Write the Introduction
// ─────────────────────────────────────────────
function Slide4Introduction({ onComplete }: { onComplete: () => void }) {
  const [step, setStep] = useState(0);
  const annotations = [
    { phrase: "Crime prevention remains a major concern for governments around the world.", note: "Background sentence — paraphrases the topic without copying the question", color: "text-blue-700 bg-blue-100 border-blue-300" },
    { phrase: "While some argue that imposing longer prison sentences is the most effective deterrent, others contend that rehabilitation and community-based programmes produce better long-term results.", note: "Introduces BOTH views — shows you understand the question fully", color: "text-purple-700 bg-purple-100 border-purple-300" },
    { phrase: "This essay will discuss both perspectives before arguing that", note: "Signals structure + previews your opinion", color: "text-green-700 bg-green-100 border-green-300" },
    { phrase: "a combination of approaches, with greater emphasis on rehabilitation, offers the most effective solution.", note: "Your thesis — clear position stated upfront", color: "text-amber-700 bg-amber-100 border-amber-300" },
  ];

  return (
    <div className="space-y-5">
      <motion.div variants={fadeUp(0)} initial="hidden" animate="visible">
        <Pill label="Step 3 of 8" color="green" />
        <h2 className="text-xl font-bold mt-2 text-gray-900">Write the Introduction</h2>
        <p className="text-sm text-gray-500 mt-1">Two sentences: a background statement + a thesis. Your position must be clear from line one.</p>
      </motion.div>

      <motion.div variants={fadeUp(0.1)} initial="hidden" animate="visible">
        <QuestionBox />
      </motion.div>

      {step === 0 && (
        <motion.div variants={fadeUp(0.2)} initial="hidden" animate="visible" className="text-center py-2">
          <Button onClick={() => setStep(1)} className="gap-2">
            Watch the transformation <ChevronRight className="w-4 h-4" />
          </Button>
        </motion.div>
      )}

      <AnimatePresence>
        {step >= 1 && (
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="space-y-4">
            <div className="p-4 rounded-xl bg-accent/10 border border-accent/30">
              <p className="text-[11px] uppercase tracking-wide text-accent/70 mb-2">Band 9 Introduction</p>
              <p className="text-sm text-gray-800 leading-relaxed">
                <span className="font-semibold text-blue-700 bg-blue-100 px-1 rounded">Crime prevention remains a major concern for governments around the world.</span>{" "}
                <span className="font-semibold text-purple-700 bg-purple-100 px-1 rounded">While some argue that imposing longer prison sentences is the most effective deterrent, others contend that rehabilitation and community-based programmes produce better long-term results.</span>{" "}
                <span className="font-semibold text-green-700 bg-green-100 px-1 rounded">This essay will discuss both perspectives before arguing that</span>{" "}
                <span className="font-semibold text-amber-700 bg-amber-100 px-1 rounded">a combination of approaches, with greater emphasis on rehabilitation, offers the most effective solution.</span>
              </p>
            </div>
            <div className="grid gap-2">
              {annotations.map((a, i) => (
                <motion.div key={i} initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 + i * 0.07 }}
                  className={`p-2.5 rounded-lg border text-xs ${a.color}`}>
                  <p className="font-semibold leading-snug">"{a.phrase}"</p>
                  <p className="opacity-75 mt-0.5">{a.note}</p>
                </motion.div>
              ))}
            </div>
            <Tip>Never state your opinion in vague terms ("This is a complex issue"). Band 9 says exactly what they think — and the thesis here does that in the final clause.</Tip>
            {step < 2 && (
              <div className="text-center">
                <Button variant="outline" size="sm" onClick={() => { setStep(2); onComplete(); }}
                  className="border-gray-300 text-gray-700 hover:bg-gray-100">
                  Got it, continue <Check className="w-3 h-3 ml-1" />
                </Button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─────────────────────────────────────────────
// Sentence highlight helper (reused from Task 1)
// ─────────────────────────────────────────────
type SentenceData = {
  text: string;
  highlights: { phrase: string; tag: string; color: string }[];
  role?: 'T' | 'E-explain' | 'E-example' | 'P' | 'E-evidence' | 'E-explanation' | 'L';
  roleLabel?: string;
};

const ROLE_STYLES: Record<string, { badge: string; border: string; label: string }> = {
  'T':             { badge: "bg-purple-100 text-purple-700 border-purple-300", border: "border-l-purple-400", label: "T" },
  'E-explain':     { badge: "bg-blue-100 text-blue-700 border-blue-300",       border: "border-l-blue-400",   label: "E" },
  'E-example':     { badge: "bg-rose-100 text-rose-700 border-rose-300",       border: "border-l-rose-400",   label: "E" },
  'P':             { badge: "bg-purple-100 text-purple-700 border-purple-300", border: "border-l-purple-400", label: "P" },
  'E-evidence':    { badge: "bg-blue-100 text-blue-700 border-blue-300",       border: "border-l-blue-400",   label: "E" },
  'E-explanation': { badge: "bg-green-100 text-green-700 border-green-300",    border: "border-l-green-400",  label: "E" },
  'L':             { badge: "bg-amber-100 text-amber-700 border-amber-300",    border: "border-l-amber-400",  label: "L" },
};

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

  const roleStyle = sentence.role ? ROLE_STYLES[sentence.role] : null;

  return (
    <div className={`flex gap-3 items-start pl-2 border-l-[3px] ${roleStyle?.border ?? "border-l-gray-200"}`}>
      {roleStyle && (
        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border shrink-0 mt-0.5 ${roleStyle.badge}`}>
          {roleStyle.label}
        </span>
      )}
      <div className="flex-1">
        <p className="text-sm text-gray-800 leading-relaxed">{parts}</p>
        {sentence.highlights.length > 0 && (
          <p className="text-[10px] text-gray-400 mt-0.5 italic">{sentence.highlights[0].tag}</p>
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// SLIDE 5 — Body Paragraph 1 (View A)
// ─────────────────────────────────────────────
const BODY1_SENTENCES: SentenceData[] = [
  {
    role: 'P',
    roleLabel: 'Point',
    text: "Proponents of longer prison sentences argue that stricter punishments act as a powerful deterrent to potential offenders.",
    highlights: [
      { phrase: "act as a powerful deterrent to potential offenders", tag: "Point: the main claim of the whole paragraph — your PEEL anchor", color: "text-purple-700 bg-purple-100" },
    ],
  },
  {
    role: 'E-evidence',
    roleLabel: 'Evidence',
    text: "When individuals know they face extended imprisonment for breaking the law, they may be far less likely to engage in criminal behaviour.",
    highlights: [
      { phrase: "far less likely to engage in criminal behaviour", tag: "Evidence: the logical basis that supports the Point — fear of prison reduces willingness to offend", color: "text-blue-700 bg-blue-100" },
    ],
  },
  {
    role: 'E-explanation',
    roleLabel: 'Explanation',
    text: "Furthermore, keeping convicted criminals incarcerated for longer periods protects the wider public from repeat offending.",
    highlights: [
      { phrase: "protects the wider public from repeat offending", tag: "Explanation: develops the evidence further — shows HOW/WHY longer sentences work on another level", color: "text-green-700 bg-green-100" },
    ],
  },
  {
    role: 'L',
    roleLabel: 'Link',
    text: "For example, countries that adopted mandatory minimum sentencing in the 1990s, such as the United States, initially reported short-term reductions in certain violent crimes.",
    highlights: [
      { phrase: "countries that adopted mandatory minimum sentencing in the 1990s, such as the United States", tag: "Link: grounds the argument with a real-world reference, connecting back to the essay question", color: "text-amber-700 bg-amber-100" },
    ],
  },
];

function Slide5Body1({ onComplete }: { onComplete: () => void }) {
  const [revealed, setRevealed] = useState(0);
  const add = () => { const n = revealed + 1; setRevealed(n); if (n === BODY1_SENTENCES.length) onComplete(); };

  return (
    <div className="space-y-5">
      <motion.div variants={fadeUp(0)} initial="hidden" animate="visible">
        <Pill label="Step 4 of 8" color="purple" />
        <h2 className="text-xl font-bold mt-2 text-gray-900">Build Body Paragraph 1 (View A)</h2>
        <p className="text-sm text-gray-500 mt-1">Present the case FOR longer prison sentences fairly. Use the PEEL pattern: Point → Evidence → Explanation → Link.</p>
      </motion.div>

      <motion.div variants={fadeUp(0.1)} initial="hidden" animate="visible"
        className="p-3 rounded-xl bg-gray-50 border border-gray-200 space-y-2">
        <p className="text-[10px] uppercase tracking-wide text-gray-400 font-medium">PEEL Pattern — each coloured label shows which part is which</p>
        <div className="flex flex-wrap gap-2">
          {[
            { tag: "P", label: "Point", desc: "1 sentence — states the paragraph's main claim", color: "bg-purple-100 text-purple-700 border-purple-300" },
            { tag: "E", label: "Evidence", desc: "1 sentence — real or illustrative evidence supporting the Point", color: "bg-blue-100 text-blue-700 border-blue-300" },
            { tag: "E", label: "Explanation", desc: "1–2 sentences — explains how the evidence supports the Point", color: "bg-green-100 text-green-700 border-green-300" },
            { tag: "L", label: "Link", desc: "1 sentence — links back to the question or your thesis", color: "bg-amber-100 text-amber-700 border-amber-300" },
          ].map((item, i) => (
            <div key={i} className={`flex items-start gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs ${item.color}`}>
              <span className="font-bold shrink-0">{item.tag}</span>
              <div>
                <span className="font-semibold">{item.label}</span>
                <span className="opacity-70 ml-1">— {item.desc}</span>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      <div className="p-4 rounded-xl bg-gray-50 border border-gray-200 space-y-3 min-h-[120px]">
        <AnimatePresence mode="popLayout">
          {BODY1_SENTENCES.slice(0, revealed).map((s, i) => (
            <motion.div key={i} initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.35 }}>
              <SentenceWithHighlights sentence={s} />
            </motion.div>
          ))}
        </AnimatePresence>
        {revealed === 0 && <p className="text-xs text-gray-300 italic">Click "Add sentence" to start building...</p>}
      </div>

      {revealed < BODY1_SENTENCES.length ? (
        <div className="text-center">
          <Button onClick={add} variant="outline" className="gap-2 border-gray-300 text-gray-700 hover:bg-gray-100">
            Add sentence {revealed + 1} / {BODY1_SENTENCES.length} <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      ) : (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
          <p className="text-xs text-center text-green-600 font-medium">Body Paragraph 1 complete!</p>
          <Tip>You presented View A honestly and with evidence — even if it's not your personal position. This is crucial for Task Response: examiners want to see that you understand both sides.</Tip>
          <div className="p-3 rounded-xl bg-blue-50 border border-blue-200 space-y-2">
            <p className="text-xs font-semibold text-blue-900">Can you make up examples in Task 2?</p>
            <div className="space-y-1.5 text-xs text-blue-800 leading-relaxed">
              <p><span className="font-semibold text-green-700">✓ You CAN invent personal examples</span> — "In my country, many young people..." or "A friend of mine once experienced..." These are illustrative, and examiners expect them.</p>
              <p><span className="font-semibold text-red-600">✗ You CANNOT invent specific factual data</span> — Never fabricate statistics ("Studies show that 73% of criminals...") or fake research findings. If you want to cite data, keep it vague: "Research suggests..." or "Statistics indicate..."</p>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────
// SLIDE 6 — Body Paragraph 2 (View B + Opinion)
// ─────────────────────────────────────────────
const BODY2_SENTENCES: SentenceData[] = [
  {
    text: "However, I believe that rehabilitation-focused approaches are ultimately more effective at reducing crime in the long term.",
    highlights: [
      { phrase: "However,", tag: "CONTRAST LINKER — shifts to View B", color: "text-purple-700 bg-purple-100" },
      { phrase: "I believe that", tag: "OPINION PHRASE — your voice enters clearly", color: "text-rose-700 bg-rose-100" },
      { phrase: "ultimately more effective", tag: "CLEAR POSITION — no hedging here", color: "text-blue-700 bg-blue-100" },
    ],
  },
  {
    text: "Rather than simply punishing offenders, rehabilitation addresses the root causes of criminal behaviour, such as poverty, lack of education, and substance dependency.",
    highlights: [
      { phrase: "Rather than simply punishing", tag: "CONTRAST — shows analytical thinking", color: "text-amber-700 bg-amber-100" },
      { phrase: "addresses the root causes", tag: "EXPLAIN — core mechanism", color: "text-blue-700 bg-blue-100" },
      { phrase: "poverty, lack of education, and substance dependency", tag: "SPECIFICS — three concrete causes", color: "text-green-700 bg-green-100" },
    ],
  },
  {
    text: "For instance, Norway's correctional system, which prioritises education and vocational training, consistently achieves one of the world's lowest reoffending rates — approximately 20%, compared to over 60% in countries that focus primarily on punishment.",
    highlights: [
      { phrase: "For instance,", tag: "EXAMPLE — real-world evidence", color: "text-rose-700 bg-rose-100" },
      { phrase: "approximately 20%, compared to over 60%", tag: "STATISTICS — makes the comparison concrete", color: "text-cyan-700 bg-cyan-100" },
    ],
  },
  {
    text: "This evidence strongly suggests that investing in rehabilitation not only benefits individual offenders but also reduces the long-term burden on society as a whole.",
    highlights: [
      { phrase: "This evidence strongly suggests", tag: "LINK — connects example back to point", color: "text-blue-700 bg-blue-100" },
      { phrase: "not only... but also", tag: "COMPLEX STRUCTURE — range & accuracy", color: "text-purple-700 bg-purple-100" },
    ],
  },
];

function Slide6Body2({ onComplete }: { onComplete: () => void }) {
  const [revealed, setRevealed] = useState(0);
  const add = () => { const n = revealed + 1; setRevealed(n); if (n === BODY2_SENTENCES.length) onComplete(); };

  return (
    <div className="space-y-5">
      <motion.div variants={fadeUp(0)} initial="hidden" animate="visible">
        <Pill label="Step 5 of 8" color="green" />
        <h2 className="text-xl font-bold mt-2 text-gray-900">Build Body Paragraph 2 (View B + Opinion)</h2>
        <p className="text-sm text-gray-500 mt-1">This is where you argue View B AND embed your own position. "I believe" should appear naturally, not forced.</p>
      </motion.div>

      <motion.div variants={fadeUp(0.1)} initial="hidden" animate="visible"
        className="p-3 rounded-xl bg-rose-50 border border-rose-200">
        <p className="text-xs text-rose-700 font-medium flex items-center gap-1.5">
          <MessageSquare className="w-3.5 h-3.5" />
          Watch how "I believe" appears in the topic sentence — it immediately signals your position while opening the argument.
        </p>
      </motion.div>

      <div className="p-4 rounded-xl bg-gray-50 border border-gray-200 space-y-3 min-h-[120px]">
        <AnimatePresence mode="popLayout">
          {BODY2_SENTENCES.slice(0, revealed).map((s, i) => (
            <motion.div key={i} initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.35 }}>
              <SentenceWithHighlights sentence={s} />
            </motion.div>
          ))}
        </AnimatePresence>
        {revealed === 0 && <p className="text-xs text-gray-300 italic">Click "Add sentence" to start building...</p>}
      </div>

      {revealed < BODY2_SENTENCES.length ? (
        <div className="text-center">
          <Button onClick={add} variant="outline" className="gap-2 border-gray-300 text-gray-700 hover:bg-gray-100">
            Add sentence {revealed + 1} / {BODY2_SENTENCES.length} <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      ) : (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
          <p className="text-xs text-center text-green-600 font-medium">Body Paragraph 2 complete!</p>
          <div className="flex flex-wrap gap-1.5 justify-center">
            {[
              { tag: "OPINION PHRASE", c: "text-rose-700 border-rose-300" },
              { tag: "CONTRAST LINKER", c: "text-purple-700 border-purple-300" },
              { tag: "REAL EXAMPLE", c: "text-blue-700 border-blue-300" },
              { tag: "STATISTICS", c: "text-cyan-700 border-cyan-300" },
              { tag: "COMPLEX STRUCTURE", c: "text-green-700 border-green-300" },
            ].map(b => (
              <span key={b.tag} className={`text-[10px] font-medium px-2 py-0.5 rounded-full border ${b.c}`}>{b.tag}</span>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────
// SLIDE 7 — Write the Conclusion
// ─────────────────────────────────────────────
function Slide7Conclusion({ onComplete }: { onComplete: () => void }) {
  const options = [
    {
      text: '"In conclusion, crime is a very serious problem in many countries and there are many different opinions about how to solve it."',
      correct: false,
      reason: "This repeats the question without restating a position. No summary of your argument. This would score Band 5 for Task Response.",
    },
    {
      text: '"In conclusion, while longer sentences offer short-term protection, I believe rehabilitation produces more lasting results by addressing the root causes of crime. Governments should therefore prioritise rehabilitation while reserving lengthy sentences for the most serious offences."',
      correct: true,
      reason: "Restates your position clearly (rehabilitation over punishment), summarises the key contrast, and gives a forward-looking recommendation — all without new arguments.",
    },
    {
      text: '"In conclusion, there are advantages and disadvantages to both approaches. It depends on the specific type of crime and the individual offender\'s circumstances, education level, and background."',
      correct: false,
      reason: "Suddenly 'on the fence' — your thesis said you favoured rehabilitation. This inconsistency destroys your Task Response score. Never flip your opinion in the conclusion.",
    },
  ];

  const [selected, setSelected] = useState<number | null>(null);
  const correctIdx = 1;

  const choose = (i: number) => {
    if (selected !== null) return;
    setSelected(i);
    if (i === correctIdx) onComplete();
  };

  return (
    <div className="space-y-5">
      <motion.div variants={fadeUp(0)} initial="hidden" animate="visible">
        <Pill label="Step 6 of 8" color="amber" />
        <h2 className="text-xl font-bold mt-2 text-gray-900">Write the Conclusion</h2>
        <p className="text-sm text-gray-500 mt-1">Pick the conclusion that best closes this essay. Only one is Band 9 quality — spot the mistakes in the others.</p>
      </motion.div>

      <motion.div variants={fadeUp(0.1)} initial="hidden" animate="visible"
        className="p-3 rounded-xl bg-gray-50 border border-gray-200">
        <p className="text-xs text-gray-500 font-medium mb-1">The three rules for a strong conclusion:</p>
        <div className="flex flex-wrap gap-1.5">
          {["Restate your position (in new words)", "Summarise main arguments", "No new ideas"].map(r => (
            <span key={r} className="text-xs px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 border border-amber-200">{r}</span>
          ))}
        </div>
      </motion.div>

      <div className="space-y-3">
        {options.map((opt, i) => {
          const isSelected = selected === i;
          const isCorrect = i === correctIdx;
          let cls = "w-full text-left p-4 rounded-xl border text-sm transition-all duration-200 ";
          if (selected === null) cls += "bg-gray-50 border-gray-200 hover:border-gray-400 hover:bg-gray-100";
          else if (isCorrect) cls += "bg-green-50 border-green-300";
          else if (isSelected) cls += "bg-red-50 border-red-300";
          else cls += "bg-gray-50 border-gray-100 opacity-50";

          return (
            <motion.div key={i} variants={popIn(0.1 + i * 0.07)} initial="hidden" animate="visible">
              <button onClick={() => choose(i)} disabled={selected !== null} className={cls}>
                <div className="flex items-start gap-3">
                  <span className={`font-bold shrink-0 text-xs mt-0.5 ${isCorrect && selected !== null ? "text-green-600" : isSelected && !isCorrect ? "text-red-500" : "text-gray-400"}`}>
                    {String.fromCharCode(65 + i)}
                  </span>
                  <span className={`text-gray-700 leading-relaxed flex-1`}>{opt.text}</span>
                  {selected !== null && isCorrect && <CheckCircle className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />}
                  {selected !== null && isSelected && !isCorrect && <XCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />}
                </div>
                <AnimatePresence>
                  {selected !== null && (isCorrect || isSelected) && (
                    <motion.p initial={{ opacity: 0, height: 0, marginTop: 0 }}
                      animate={{ opacity: 1, height: "auto", marginTop: 8 }}
                      transition={{ duration: 0.25 }}
                      className={`text-xs overflow-hidden pl-5 ${isCorrect ? "text-green-700" : "text-red-600"}`}>
                      {opt.reason}
                    </motion.p>
                  )}
                </AnimatePresence>
              </button>
            </motion.div>
          );
        })}
      </div>

      {selected !== null && selected !== correctIdx && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
          className="text-center">
          <Button onClick={() => { setSelected(null); }} variant="outline" size="sm"
            className="gap-1.5 border-gray-300 text-gray-700 hover:bg-gray-100">
            <RotateCcw className="w-3 h-3" /> Try again
          </Button>
        </motion.div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────
// SLIDE 8 — Vocabulary Bank
// ─────────────────────────────────────────────
function Slide8Vocab({ onComplete }: { onComplete: () => void }) {
  const categories = [
    {
      title: "Opinion Phrases", icon: "💬",
      color: "bg-blue-50 border-blue-200 hover:bg-blue-100",
      titleColor: "text-blue-900", bodyColor: "text-blue-800",
      phrases: [
        { phrase: "I believe / I would argue that", use: "State your position directly" },
        { phrase: "In my view / In my opinion", use: "Personal stance without being informal" },
        { phrase: "It is my contention that", use: "Formal academic alternative to 'I think'" },
        { phrase: "I am convinced that", use: "Shows strong, confident position" },
      ],
    },
    {
      title: "Contrast & Concession", icon: "⚖️",
      color: "bg-purple-50 border-purple-200 hover:bg-purple-100",
      titleColor: "text-purple-900", bodyColor: "text-purple-800",
      phrases: [
        { phrase: "However, / Nevertheless,", use: "Introduce the contrasting view" },
        { phrase: "While it is true that…, it must be noted that…", use: "Acknowledge and rebut" },
        { phrase: "Despite this, / Notwithstanding,", use: "Concede but maintain position" },
        { phrase: "On the other hand,", use: "Classic view-shift in body paragraph" },
      ],
    },
    {
      title: "Hedging & Claiming", icon: "🎯",
      color: "bg-green-50 border-green-200 hover:bg-green-100",
      titleColor: "text-green-900", bodyColor: "text-green-800",
      phrases: [
        { phrase: "It could be argued that", use: "Introduce a view you'll partly agree with" },
        { phrase: "There is evidence to suggest that", use: "Introduce evidence cautiously" },
        { phrase: "may / might / tends to", use: "Avoid over-claiming certainty" },
        { phrase: "strongly suggests / indicates that", use: "Draw conclusions from evidence" },
      ],
    },
    {
      title: "Academic Vocabulary", icon: "📚",
      color: "bg-amber-50 border-amber-200 hover:bg-amber-100",
      titleColor: "text-amber-900", bodyColor: "text-amber-800",
      phrases: [
        { phrase: "deter / act as a deterrent", use: "Prevent through fear of punishment" },
        { phrase: "rehabilitation / reintegration", use: "Reform offenders to rejoin society" },
        { phrase: "address the root causes", use: "Tackle underlying problems (not symptoms)" },
        { phrase: "reoffending rate / recidivism", use: "Rate at which criminals commit crimes again" },
      ],
    },
  ];

  const [open, setOpen] = useState<number[]>([]);
  const toggle = (i: number) => {
    const next = open.includes(i) ? open.filter(x => x !== i) : [...open, i];
    setOpen(next);
    if (next.length === 4) onComplete();
  };

  return (
    <div className="space-y-5">
      <motion.div variants={fadeUp(0)} initial="hidden" animate="visible">
        <Pill label="Step 7 of 8" color="blue" />
        <h2 className="text-xl font-bold mt-2 text-gray-900">Vocabulary Bank</h2>
        <p className="text-sm text-gray-500 mt-1">Click each category to explore the phrases that push your Lexical Resource score from Band 6 to Band 8+.</p>
      </motion.div>

      <div className="space-y-2.5">
        {categories.map((cat, i) => (
          <motion.div key={i} variants={fadeUp(0.1 + i * 0.07)} initial="hidden" animate="visible">
            <div className={`rounded-xl border overflow-hidden ${cat.color.replace("hover:bg-", "").split(" bg-")[0]} ${cat.color.split(" ")[1]}`}>
              <button onClick={() => toggle(i)}
                className={`w-full flex items-center justify-between px-4 py-3 transition-colors ${cat.color}`}>
                <div className="flex items-center gap-2.5">
                  <span className="text-base">{cat.icon}</span>
                  <span className={`text-sm font-semibold ${cat.titleColor}`}>{cat.title}</span>
                  {open.includes(i) && <Check className="w-3.5 h-3.5 text-gray-400" />}
                </div>
                <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${open.includes(i) ? "rotate-180" : ""}`} />
              </button>
              <AnimatePresence>
                {open.includes(i) && (
                  <motion.div initial={{ height: 0 }} animate={{ height: "auto" }} exit={{ height: 0 }}
                    transition={{ duration: 0.25 }} className="overflow-hidden">
                    <div className="px-4 pb-3 space-y-2 border-t border-current/10">
                      {cat.phrases.map((p, j) => (
                        <div key={j} className="flex items-start gap-2 pt-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-current opacity-40 shrink-0 mt-1.5" />
                          <div>
                            <span className={`text-sm font-semibold ${cat.titleColor}`}>{p.phrase}</span>
                            <span className={`text-xs ml-2 ${cat.bodyColor} opacity-70`}>— {p.use}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        ))}
      </div>

      {open.length < 4 && (
        <p className="text-xs text-center text-gray-400">Open all 4 categories to continue ({open.length}/4)</p>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────
// SLIDE 9 — Full Model Answer
// ─────────────────────────────────────────────
const MODEL_PARAGRAPHS = [
  {
    label: "Introduction", color: "border-blue-300 bg-blue-50", labelColor: "text-blue-700",
    text: "Crime prevention remains a major concern for governments around the world. While some argue that imposing longer prison sentences is the most effective deterrent against criminal behaviour, others contend that rehabilitation and community-based programmes produce better long-term results. This essay will discuss both perspectives before arguing that a combination of approaches, with greater emphasis on rehabilitation, offers the most effective solution.",
  },
  {
    label: "Body Paragraph 1 — View A", color: "border-purple-300 bg-purple-50", labelColor: "text-purple-700",
    text: "Proponents of longer prison sentences argue that stricter punishments act as a powerful deterrent to potential offenders. When individuals know they face extended imprisonment for breaking the law, they may be far less likely to engage in criminal behaviour. Furthermore, keeping convicted criminals incarcerated for longer periods protects the wider public from repeat offending. For example, countries that adopted mandatory minimum sentencing in the 1990s, such as the United States, initially reported short-term reductions in certain violent crimes.",
  },
  {
    label: "Body Paragraph 2 — View B + Opinion", color: "border-green-300 bg-green-50", labelColor: "text-green-700",
    text: "However, I believe that rehabilitation-focused approaches are ultimately more effective at reducing crime in the long term. Rather than simply punishing offenders, rehabilitation addresses the root causes of criminal behaviour, such as poverty, lack of education, and substance dependency. For instance, Norway's correctional system, which prioritises education and vocational training, consistently achieves one of the world's lowest reoffending rates — approximately 20%, compared to over 60% in countries that focus primarily on punishment. This evidence strongly suggests that investing in rehabilitation not only benefits individual offenders but also reduces the long-term burden on society as a whole.",
  },
  {
    label: "Conclusion", color: "border-amber-300 bg-amber-50", labelColor: "text-amber-700",
    text: "In conclusion, while longer prison sentences may provide short-term public protection, rehabilitation programmes are more likely to achieve lasting reductions in crime by addressing its underlying causes. I therefore believe that governments should adopt a balanced strategy that prioritises rehabilitation while reserving lengthy sentences for the most serious offences.",
  },
];

function Slide9Model({ onComplete }: { onComplete: () => void }) {
  const [revealed, setRevealed] = useState(0);
  const next = () => { const n = revealed + 1; setRevealed(n); if (n === MODEL_PARAGRAPHS.length) onComplete(); };

  return (
    <div className="space-y-5">
      <motion.div variants={fadeUp(0)} initial="hidden" animate="visible">
        <Pill label="Step 8 of 8" color="blue" />
        <h2 className="text-xl font-bold mt-2 text-gray-900">The Complete Band 9 Answer</h2>
        <p className="text-sm text-gray-500 mt-1">See how all four paragraphs come together into a coherent, high-scoring essay.</p>
      </motion.div>

      <motion.div variants={fadeUp(0.1)} initial="hidden" animate="visible">
        <QuestionBox />
      </motion.div>

      <div className="space-y-3">
        <AnimatePresence>
          {MODEL_PARAGRAPHS.slice(0, revealed).map((p, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.38 }}
              className={`p-4 rounded-xl border ${p.color}`}>
              <p className={`text-[11px] font-semibold uppercase tracking-wide mb-2 ${p.labelColor}`}>{p.label}</p>
              <p className="text-sm text-gray-700 leading-relaxed">{p.text}</p>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {revealed < MODEL_PARAGRAPHS.length ? (
        <div className="text-center">
          <Button onClick={next} className="gap-2">
            Reveal {MODEL_PARAGRAPHS[revealed].label} <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      ) : (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
          <div className="flex items-center justify-center gap-2 text-green-600">
            <CheckCircle className="w-5 h-5" />
            <span className="text-sm font-semibold">Full Band 9 essay revealed!</span>
          </div>
          <div className="p-3 rounded-xl bg-gray-50 border border-gray-200 text-xs text-gray-600">
            <span className="font-semibold text-gray-800">Word count: ~260 words.</span> Notice how the position is consistent throughout — Introduction → BP2 → Conclusion all say the same thing in different words.
          </div>
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
    q: "You're writing a 'Discuss both views + opinion' essay. Where should your opinion FIRST appear?",
    options: [
      { id: "A", text: "Only in the conclusion — you should stay neutral throughout the body." },
      { id: "B", text: "In the introduction thesis, woven into Body P2, and restated in the conclusion." },
      { id: "C", text: "You don't need to give a personal opinion — just present both sides fairly." },
    ],
    correct: "B",
    explanation: "Your opinion must be consistent from start to finish. It appears in the thesis (intro), is clearly stated in BP2, and is restated in the conclusion. Staying 'neutral' or only mentioning it at the end loses Task Response marks.",
  },
  {
    q: "Which introduction thesis statement is closest to Band 9 quality?",
    options: [
      { id: "A", text: '"This essay will discuss longer prison sentences and alternative methods of reducing crime."' },
      { id: "B", text: '"This essay will discuss both perspectives before arguing that rehabilitation, with its emphasis on root causes, offers a more sustainable long-term solution."' },
      { id: "C", text: '"Both sides have valid points and it is difficult to say which is better."' },
    ],
    correct: "B",
    explanation: "B signals the essay structure ('discuss both'), clearly states a position ('rehabilitation is better'), and gives a reason ('root causes'). A is just a plan with no opinion. C is vague and avoids committing to a view.",
  },
  {
    q: "In Body Paragraph 1 (View A — prison sentences), you present the argument fairly even though you disagree. Why?",
    options: [
      { id: "A", text: "Because you might change your mind while writing." },
      { id: "B", text: "Because Task Response requires you to address BOTH views with genuine understanding and development." },
      { id: "C", text: "Because examiners penalise one-sided essays by default." },
    ],
    correct: "B",
    explanation: "The question says 'Discuss both views' — you must present View A (prison sentences) with real explanation and a supporting example, regardless of your personal opinion. Skipping it or dismissing it in one sentence will lose Task Response marks.",
  },
  {
    q: "Which sentence best introduces your opinion while opening Body Paragraph 2?",
    options: [
      { id: "A", text: '"On the other hand, some people believe that alternative methods can be effective."' },
      { id: "B", text: '"However, I believe that rehabilitation-focused approaches are ultimately more effective at reducing crime in the long term."' },
      { id: "C", text: '"Secondly, there are alternative methods such as community service and education programmes."' },
    ],
    correct: "B",
    explanation: "B uses a contrast linker ('However'), a clear opinion marker ('I believe'), and immediately states your position ('ultimately more effective'). A presents someone else's view neutrally. C is a weak topic sentence that just lists — no opinion, no direction.",
  },
  {
    q: "Which conclusion would HURT your Task Response score?",
    options: [
      { id: "A", text: '"In conclusion, while longer sentences may provide short-term safety, rehabilitation is more effective long-term by addressing the root causes of crime."' },
      { id: "B", text: '"In conclusion, this is a complex issue and both methods have their merits. Different approaches may work for different types of crime."' },
      { id: "C", text: '"In conclusion, I believe governments should prioritise rehabilitation while reserving lengthy sentences for the most serious offences."' },
    ],
    correct: "B",
    explanation: "B suddenly abandons the clear position taken throughout the essay and becomes vague ('complex issue', 'both merits'). This inconsistency destroys your Task Response score. The conclusion must RESTATE your position — never flip it or turn it into a 'depends on' statement at the last minute.",
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
          {pct === 100 ? "Perfect! You have a strong command of Task 2 essay strategy." : pct >= 60 ? "Good work! Re-read any slides you're unsure about, then try a live question." : "Keep going — re-read the slides carefully, then try again."}
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
const SLIDE_TITLES = ["Welcome", "Analyse Q", "Blueprint", "Introduction", "Body P1", "Body P2", "Conclusion", "Vocabulary", "Model Answer", "Quiz"];

export function WritingTask2Tutorial() {
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
    <Slide2Analyse key="s2" onComplete={() => markDone(1)} />,
    <Slide3Blueprint key="s3" onComplete={() => markDone(2)} />,
    <Slide4Introduction key="s4" onComplete={() => markDone(3)} />,
    <Slide5Body1 key="s5" onComplete={() => markDone(4)} />,
    <Slide6Body2 key="s6" onComplete={() => markDone(5)} />,
    <Slide7Conclusion key="s7" onComplete={() => markDone(6)} />,
    <Slide8Vocab key="s8" onComplete={() => markDone(7)} />,
    <Slide9Model key="s9" onComplete={() => markDone(8)} />,
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
