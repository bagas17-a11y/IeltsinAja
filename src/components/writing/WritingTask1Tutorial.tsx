import { useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronRight, ChevronLeft, CheckCircle, XCircle,
  Trophy, RotateCcw, Check, Lightbulb, BookOpen,
  FileDown, ExternalLink, X, BarChart3, ChevronDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";

// ─────────────────────────────────────────────
// Assets
// ─────────────────────────────────────────────
const CHART_IMG = "/assets/Screenshot_2026-02-20_at_5.37.54_PM-65ae8c4b-53ac-4130-ac38-7dd99e743023.png";

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
// Shared UI (all designed for dark overlay)
// ─────────────────────────────────────────────
function Pill({ label, color = "blue" }: { label: string; color?: "blue" | "green" | "amber" | "purple" }) {
  const cls: Record<string, string> = {
    blue: "bg-blue-500/20 text-blue-300 border-blue-500/30",
    green: "bg-green-500/20 text-green-300 border-green-500/30",
    amber: "bg-amber-500/20 text-amber-300 border-amber-500/30",
    purple: "bg-purple-500/20 text-purple-300 border-purple-500/30",
  };
  return <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full border ${cls[color]}`}>{label}</span>;
}

function Tip({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex gap-2 p-3 rounded-lg bg-amber-500/10 border border-amber-500/30">
      <Lightbulb className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
      <p className="text-sm text-amber-200/90">{children}</p>
    </div>
  );
}

// Collapsible chart reference shown on data-heavy slides
function ChartRef() {
  const [open, setOpen] = useState(false);
  return (
    <div className="rounded-xl border border-white/10 overflow-hidden">
      <button onClick={() => setOpen(v => !v)}
        className="w-full flex items-center justify-between px-3 py-2 text-xs text-white/50 hover:text-white/80 hover:bg-white/5 transition-colors">
        <span className="flex items-center gap-1.5">
          <BarChart3 className="w-3.5 h-3.5" /> Reference: UK &amp; France spending chart
        </span>
        <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div initial={{ height: 0 }} animate={{ height: "auto" }} exit={{ height: 0 }}
            transition={{ duration: 0.25 }} className="overflow-hidden">
            <img src={CHART_IMG} alt="Bar chart reference" className="w-full h-auto" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─────────────────────────────────────────────
// SLIDE 1 — Welcome (embedded, light-mode safe)
// ─────────────────────────────────────────────
function Slide1Welcome({ onStart }: { onStart: () => void }) {
  const stats = [
    { value: "150+", label: "words required" },
    { value: "20 min", label: "to complete" },
    { value: "Band 9", label: "model inside" },
  ];
  return (
    <div className="space-y-8">
      <motion.div variants={fadeUp(0)} initial="hidden" animate="visible" className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/20 mb-2">
          <BookOpen className="w-3.5 h-3.5 text-accent" />
          <span className="text-xs text-accent">Interactive Tutorial</span>
        </div>
        <h1 className="text-3xl font-bold">Task 1: The Visual Report</h1>
        <p className="text-muted-foreground max-w-lg mx-auto text-sm leading-relaxed">
          A step-by-step guide showing exactly how to analyse a bar chart and build a Band 9 response — sentence by sentence.
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
          ["Task Achievement", "Did you cover all the key features?"],
          ["Coherence & Cohesion", "Is your response logically organised?"],
          ["Lexical Resource", "Do you use varied, accurate vocabulary?"],
          ["Grammatical Range", "Do you use complex structures correctly?"],
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
// SLIDE 2 — Read the Chart
// ─────────────────────────────────────────────
function Slide2Chart({ onComplete }: { onComplete: () => void }) {
  const observations = [
    { q: "Who spends more overall?", a: "The UK outspent France in most categories — it's your main overall trend." },
    { q: "Which category is highest for both?", a: "Cars — both countries spent the most here. Always note shared patterns." },
    { q: "Where is the biggest gap?", a: "Cameras — UK spent just over £350k, France only £150k. Over double!" },
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
        <h2 className="text-xl font-bold mt-2 text-white">Read the Chart First</h2>
        <p className="text-sm text-white/60 mt-1">Before writing a word, spend 2 minutes reading the data. Click each observation below.</p>
      </motion.div>

      <motion.div variants={fadeUp(0.1)} initial="hidden" animate="visible"
        className="rounded-xl overflow-hidden border border-white/10">
        <img src={CHART_IMG} alt="UK vs France consumer goods spending" className="w-full h-auto" />
      </motion.div>

      <div className="grid gap-2.5">
        {observations.map((obs, i) => (
          <motion.button key={i} variants={popIn(0.2 + i * 0.08)} initial="hidden" animate="visible"
            onClick={() => toggle(i)}
            className={`w-full text-left p-4 rounded-xl border transition-all duration-300 ${
              revealed.includes(i) ? "bg-accent/15 border-accent/40" : "bg-white/5 border-white/10 hover:border-white/25"
            }`}>
            <div className="flex items-start gap-3">
              <div className={`w-5 h-5 rounded-full shrink-0 mt-0.5 flex items-center justify-center transition-colors ${
                revealed.includes(i) ? "bg-accent" : "bg-white/10"
              }`}>
                {revealed.includes(i) ? <Check className="w-3 h-3 text-white" /> : <span className="text-[10px] text-white/60">{i + 1}</span>}
              </div>
              <div>
                <p className="text-sm font-medium text-white">{obs.q}</p>
                <AnimatePresence>
                  {revealed.includes(i) && (
                    <motion.p initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.25 }}
                      className="text-xs text-accent/90 mt-1.5 overflow-hidden">
                      {obs.a}
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.button>
        ))}
      </div>
      {revealed.length < 3 && (
        <p className="text-xs text-center text-white/30">Click all 3 observations to continue ({revealed.length}/3)</p>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────
// SLIDE 3 — Blueprint
// ─────────────────────────────────────────────
function Slide3Blueprint({ onComplete }: { onComplete: () => void }) {
  const parts = [
    { title: "Introduction", badge: "1 sentence", bg: "bg-blue-600/25 border-blue-500/40 hover:bg-blue-600/35", text: "Paraphrase the question. Mention: visual type, what it shows, time period, units. Never copy the question word-for-word." },
    { title: "Overview", badge: "1–2 sentences", bg: "bg-purple-600/25 border-purple-500/40 hover:bg-purple-600/35", text: "The big picture — main trends only, no figures. Who wins overall? What is highest/lowest? What is the biggest difference?" },
    { title: "Body Paragraph 1", badge: "Key group", bg: "bg-green-600/25 border-green-500/40 hover:bg-green-600/35", text: "Pick a pattern (e.g. categories where UK > France). Use 2–3 specific figures with comparison language." },
    { title: "Body Paragraph 2", badge: "Other group", bg: "bg-amber-600/25 border-amber-500/40 hover:bg-amber-600/35", text: "The contrasting pattern (e.g. France similar/higher). Link from BP1 with 'On the other hand' or similar." },
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
        <h2 className="text-xl font-bold mt-2 text-white">The 4-Part Structure</h2>
        <p className="text-sm text-white/60 mt-1">Every Band 7+ Task 1 uses this structure. Click each part to understand its role.</p>
      </motion.div>

      <div className="space-y-2.5">
        {parts.map((p, i) => (
          <motion.div key={i} variants={fadeUp(0.1 + i * 0.08)} initial="hidden" animate="visible">
            <button onClick={() => toggle(i)}
              className={`w-full text-left p-4 rounded-xl border transition-all duration-300 ${p.bg}`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-white/15 flex items-center justify-center shrink-0">
                    <span className="text-xs font-bold text-white">{i + 1}</span>
                  </div>
                  <span className="font-semibold text-sm text-white">{p.title}</span>
                  <span className="text-[10px] text-white/50 border border-white/20 px-1.5 py-0.5 rounded-full">{p.badge}</span>
                </div>
                {open.includes(i) && <Check className="w-4 h-4 text-white/70 shrink-0" />}
              </div>
              <AnimatePresence>
                {open.includes(i) && (
                  <motion.p initial={{ opacity: 0, height: 0, marginTop: 0 }}
                    animate={{ opacity: 1, height: "auto", marginTop: 8 }}
                    exit={{ opacity: 0, height: 0, marginTop: 0 }}
                    transition={{ duration: 0.25 }}
                    className="text-xs text-white/75 leading-relaxed overflow-hidden pl-9">
                    {p.text}
                  </motion.p>
                )}
              </AnimatePresence>
            </button>
          </motion.div>
        ))}
      </div>
      {open.length < 4 && (
        <p className="text-xs text-center text-white/30">Open all 4 parts to continue ({open.length}/4)</p>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────
// SLIDE 4 — Introduction
// ─────────────────────────────────────────────
function Slide4Introduction({ onComplete }: { onComplete: () => void }) {
  const [step, setStep] = useState(0);
  const annotations = [
    { phrase: "illustrates", note: "paraphrase of 'shows'", color: "text-blue-300 bg-blue-500/20 border-blue-500/30" },
    { phrase: "amount of money spent on", note: "paraphrase of 'expenditure'", color: "text-green-300 bg-green-500/20 border-green-500/30" },
    { phrase: "France and the UK", note: "names both countries explicitly", color: "text-purple-300 bg-purple-500/20 border-purple-500/30" },
    { phrase: "Units are measured in pounds sterling.", note: "adds the unit — examiners expect this!", color: "text-amber-300 bg-amber-500/20 border-amber-500/30" },
  ];

  return (
    <div className="space-y-5">
      <motion.div variants={fadeUp(0)} initial="hidden" animate="visible">
        <Pill label="Step 3 of 8" color="green" />
        <h2 className="text-xl font-bold mt-2 text-white">Write the Introduction</h2>
        <p className="text-sm text-white/60 mt-1">Paraphrase the question in one sentence. Never copy it word-for-word.</p>
      </motion.div>

      <motion.div variants={fadeUp(0.1)} initial="hidden" animate="visible"
        className="p-4 rounded-xl bg-white/5 border border-white/10">
        <p className="text-[11px] uppercase tracking-wide text-white/40 mb-2">Original question</p>
        <p className="text-sm text-white/50 italic">
          "The chart below shows the expenditure of two countries on consumer goods in 2010. (pounds sterling)"
        </p>
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
              <p className="text-sm text-white/90 leading-relaxed">
                "The chart{" "}
                <span className="font-semibold text-blue-300 bg-blue-500/20 px-1 rounded">illustrates</span>{" "}
                the{" "}
                <span className="font-semibold text-green-300 bg-green-500/20 px-1 rounded">amount of money spent on</span>{" "}
                five consumer goods (cars, computers, books, perfume and cameras) in{" "}
                <span className="font-semibold text-purple-300 bg-purple-500/20 px-1 rounded">France and the UK</span>{" "}
                in 2010.{" "}
                <span className="font-semibold text-amber-300 bg-amber-500/20 px-1 rounded">Units are measured in pounds sterling.</span>"
              </p>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {annotations.map((a, i) => (
                <motion.div key={i} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.1 + i * 0.08 }}
                  className={`p-2.5 rounded-lg border text-xs ${a.color}`}>
                  <p className="font-semibold">"{a.phrase}"</p>
                  <p className="opacity-75 mt-0.5">{a.note}</p>
                </motion.div>
              ))}
            </div>
            <Tip>Notice every word is paraphrased — same meaning, different words. That's all the introduction needs to do.</Tip>
            {step < 2 && (
              <div className="text-center">
                <Button variant="outline" size="sm" onClick={() => { setStep(2); onComplete(); }}
                  className="border-white/20 text-white hover:bg-white/10">
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
// SLIDE 5 — Overview
// ─────────────────────────────────────────────
function Slide5Overview({ onComplete }: { onComplete: () => void }) {
  const items = [
    { check: "Overall winner", sentence: "Overall, the UK spent more money on consumer goods than France in the period given." },
    { check: "Highest & lowest categories", sentence: "Both the British and the French spent most of their money on cars whereas the least amount of money was spent on perfume in the UK compared to cameras in France." },
    { check: "Biggest single gap", sentence: "Furthermore, the most significant difference in expenditure between the two countries was on cameras." },
  ];
  const [checked, setChecked] = useState<number[]>([]);
  const toggle = (i: number) => {
    if (checked.includes(i)) return;
    const next = [...checked, i];
    setChecked(next);
    if (next.length === 3) onComplete();
  };

  return (
    <div className="space-y-5">
      <motion.div variants={fadeUp(0)} initial="hidden" animate="visible">
        <Pill label="Step 4 of 8" color="amber" />
        <h2 className="text-xl font-bold mt-2 text-white">Write the Overview</h2>
        <p className="text-sm text-white/60 mt-1">The make-or-break paragraph for Band 7+. Big picture only — no specific numbers. Tick each element to build it.</p>
      </motion.div>

      <ChartRef />

      <div className="space-y-2.5">
        {items.map((item, i) => (
          <motion.div key={i} variants={fadeUp(0.1 + i * 0.08)} initial="hidden" animate="visible">
            <button onClick={() => toggle(i)}
              className={`w-full text-left p-4 rounded-xl border transition-all duration-300 ${
                checked.includes(i) ? "bg-green-500/15 border-green-500/40" : "bg-white/5 border-white/10 hover:border-green-500/30"
              }`}>
              <div className="flex items-center gap-3">
                <div className={`w-5 h-5 rounded border-2 shrink-0 flex items-center justify-center transition-all ${
                  checked.includes(i) ? "bg-green-500 border-green-500" : "border-white/30"
                }`}>
                  {checked.includes(i) && <Check className="w-3 h-3 text-white" />}
                </div>
                <span className={`text-sm font-medium ${checked.includes(i) ? "text-green-300" : "text-white"}`}>{item.check}</span>
              </div>
              <AnimatePresence>
                {checked.includes(i) && (
                  <motion.p initial={{ opacity: 0, height: 0, marginTop: 0 }}
                    animate={{ opacity: 1, height: "auto", marginTop: 8 }}
                    transition={{ duration: 0.25 }}
                    className="text-xs text-white/65 italic pl-8 overflow-hidden leading-relaxed">
                    "{item.sentence}"
                  </motion.p>
                )}
              </AnimatePresence>
            </button>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {checked.length === 3 && (
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}
            className="p-4 rounded-xl bg-accent/10 border border-accent/30">
            <p className="text-[11px] uppercase tracking-wide text-accent/70 mb-2">Complete Overview Paragraph</p>
            <p className="text-sm text-white/85 leading-relaxed italic">
              "Overall, the UK spent more money on consumer goods than France in the period given. Both the British and the French spent most of their money on cars whereas the least amount of money was spent on perfume in the UK compared to cameras in France. Furthermore, the most significant difference in expenditure between the two countries was on cameras."
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {checked.length < 3 && (
        <p className="text-xs text-center text-white/30">Tick all 3 elements to reveal the full overview ({checked.length}/3)</p>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────
// SLIDE 6 — Grouping
// ─────────────────────────────────────────────
const CATEGORIES = ["Cars", "Computers", "Books", "Perfume", "Cameras"];
const CORRECT_GROUPS: Record<string, number> = { Cars: 0, Books: 0, Cameras: 0, Computers: 1, Perfume: 1 };

function Slide6Grouping({ onComplete }: { onComplete: () => void }) {
  const [assigned, setAssigned] = useState<Record<string, number>>({});
  const assign = (cat: string) => {
    if (assigned[cat] !== undefined) return;
    const next = { ...assigned, [cat]: CORRECT_GROUPS[cat] };
    setAssigned(next);
    if (Object.keys(next).length === 5) onComplete();
  };

  return (
    <div className="space-y-5">
      <motion.div variants={fadeUp(0)} initial="hidden" animate="visible">
        <Pill label="Step 5 of 8" color="purple" />
        <h2 className="text-xl font-bold mt-2 text-white">Group Your Data</h2>
        <p className="text-sm text-white/60 mt-1">Never describe every bar in order. Group by pattern. Click each category to drop it into the correct group.</p>
      </motion.div>

      <ChartRef />

      <motion.div variants={fadeUp(0.1)} initial="hidden" animate="visible"
        className="flex flex-wrap gap-2 p-4 rounded-xl bg-white/5 border border-white/10 min-h-[56px]">
        <p className="text-xs text-white/40 w-full mb-1">Click to assign:</p>
        <AnimatePresence>
          {CATEGORIES.filter(c => assigned[c] === undefined).map(cat => (
            <motion.button key={cat} layout exit={{ opacity: 0, scale: 0.8 }} transition={{ duration: 0.2 }}
              onClick={() => assign(cat)}
              className="px-3 py-1.5 rounded-lg bg-white/10 border border-white/15 text-sm font-medium text-white hover:border-accent/50 hover:bg-accent/15 transition-all">
              {cat}
            </motion.button>
          ))}
        </AnimatePresence>
        {Object.keys(assigned).length === 5 && (
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-xs text-green-400 flex items-center gap-1 w-full">
            <CheckCircle className="w-3 h-3" /> All grouped — this structure makes comparisons much stronger!
          </motion.p>
        )}
      </motion.div>

      <div className="grid grid-cols-2 gap-3">
        {[
          { label: "UK spent more", desc: "→ Body P1", bg: "bg-blue-600/20 border-blue-500/30" },
          { label: "France similar / more", desc: "→ Body P2", bg: "bg-purple-600/20 border-purple-500/30" },
        ].map((g, gi) => (
          <motion.div key={gi} variants={fadeUp(0.2 + gi * 0.05)} initial="hidden" animate="visible"
            className={`rounded-xl border p-4 min-h-[90px] ${g.bg}`}>
            <p className="text-xs font-semibold text-white mb-0.5">{g.label}</p>
            <p className="text-[10px] text-white/40 mb-2.5">{g.desc}</p>
            <div className="flex flex-wrap gap-1.5">
              {CATEGORIES.filter(c => assigned[c] === gi).map(cat => (
                <motion.span key={cat} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
                  className="px-2 py-0.5 rounded-md text-xs font-medium bg-white/15 text-white border border-white/20">
                  {cat}
                </motion.span>
              ))}
            </div>
          </motion.div>
        ))}
      </div>

      <Tip>Grouping by pattern (UK higher vs France higher) creates much stronger comparisons than going category by category.</Tip>
    </div>
  );
}

// ─────────────────────────────────────────────
// Sentence highlight helper
// ─────────────────────────────────────────────
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
  return <p className="text-sm text-white/90 leading-relaxed">{parts}</p>;
}

// ─────────────────────────────────────────────
// SLIDE 7 — Body Paragraph 1
// ─────────────────────────────────────────────
const BODY1_SENTENCES: SentenceData[] = [
  {
    text: "In terms of cars, people in the UK spent about £450,000 on this as opposed to the French at £400,000.",
    highlights: [
      { phrase: "In terms of", tag: "TOPIC OPENER", color: "text-blue-300 bg-blue-500/20" },
      { phrase: "as opposed to", tag: "COMPARISON", color: "text-green-300 bg-green-500/20" },
    ],
  },
  {
    text: "Similarly, the British expenditure was higher on books than the French (around £400,000 and £300,000 respectively).",
    highlights: [
      { phrase: "Similarly,", tag: "LINKER", color: "text-purple-300 bg-purple-500/20" },
      { phrase: "respectively", tag: "DATA TECHNIQUE", color: "text-amber-300 bg-amber-500/20" },
    ],
  },
  {
    text: "In the UK, expenditure on cameras (just over £350,000) was over double that of France, which was only £150,000.",
    highlights: [
      { phrase: "over double that of", tag: "STRONG COMPARISON", color: "text-red-300 bg-red-500/20" },
      { phrase: "just over", tag: "APPROXIMATION", color: "text-cyan-300 bg-cyan-500/20" },
    ],
  },
];

function Slide7Body1({ onComplete }: { onComplete: () => void }) {
  const [revealed, setRevealed] = useState(0);
  const add = () => { const n = revealed + 1; setRevealed(n); if (n === BODY1_SENTENCES.length) onComplete(); };

  return (
    <div className="space-y-5">
      <motion.div variants={fadeUp(0)} initial="hidden" animate="visible">
        <Pill label="Step 6 of 8" color="green" />
        <h2 className="text-xl font-bold mt-2 text-white">Build Body Paragraph 1</h2>
        <p className="text-sm text-white/60 mt-1">Group: UK spent more (Cars, Books, Cameras). Click "Add sentence" — watch each phrase build the paragraph.</p>
      </motion.div>

      <ChartRef />

      <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-3 min-h-[100px]">
        <AnimatePresence mode="popLayout">
          {BODY1_SENTENCES.slice(0, revealed).map((s, i) => (
            <motion.div key={i} initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.35 }}>
              <SentenceWithHighlights sentence={s} />
            </motion.div>
          ))}
        </AnimatePresence>
        {revealed === 0 && <p className="text-xs text-white/25 italic">Click "Add sentence" to start building...</p>}
      </div>

      {revealed < BODY1_SENTENCES.length ? (
        <div className="text-center">
          <Button onClick={add} variant="outline" className="gap-2 border-white/20 text-white hover:bg-white/10">
            Add sentence {revealed + 1} / {BODY1_SENTENCES.length} <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      ) : (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-2">
          <p className="text-xs text-center text-green-400 font-medium">Body Paragraph 1 complete!</p>
          <div className="flex flex-wrap gap-1.5 justify-center">
            {[
              { tag: "TOPIC OPENER", c: "text-blue-300 border-blue-500/30" },
              { tag: "LINKER", c: "text-purple-300 border-purple-500/30" },
              { tag: "COMPARISON", c: "text-green-300 border-green-500/30" },
              { tag: "APPROXIMATION", c: "text-cyan-300 border-cyan-500/30" },
              { tag: "STRONG COMPARISON", c: "text-red-300 border-red-500/30" },
              { tag: "DATA TECHNIQUE", c: "text-amber-300 border-amber-500/30" },
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
// SLIDE 8 — Body Paragraph 2
// ─────────────────────────────────────────────
const BODY2_SENTENCES: SentenceData[] = [
  {
    text: "On the other hand, the amount of money paid out on the remaining goods was higher in France.",
    highlights: [
      { phrase: "On the other hand,", tag: "CONTRAST LINKER", color: "text-purple-300 bg-purple-500/20" },
      { phrase: "the remaining goods", tag: "GROUPING REFERENCE", color: "text-blue-300 bg-blue-500/20" },
    ],
  },
  {
    text: "Above £350,000 was spent by the French on computers which was slightly more than the British who spent exactly £350,000.",
    highlights: [{ phrase: "slightly more than", tag: "COMPARISON", color: "text-green-300 bg-green-500/20" }],
  },
  {
    text: "Neither of the countries spent much on perfume which accounted for £200,000 of expenditure in France but under £150,000 in the UK.",
    highlights: [
      { phrase: "Neither of the countries", tag: "INCLUSIVE COMPARISON", color: "text-amber-300 bg-amber-500/20" },
      { phrase: "accounted for", tag: "FORMAL VERB", color: "text-cyan-300 bg-cyan-500/20" },
    ],
  },
];

function Slide8Body2({ onComplete }: { onComplete: () => void }) {
  const [revealed, setRevealed] = useState(0);
  const add = () => { const n = revealed + 1; setRevealed(n); if (n === BODY2_SENTENCES.length) onComplete(); };

  return (
    <div className="space-y-5">
      <motion.div variants={fadeUp(0)} initial="hidden" animate="visible">
        <Pill label="Step 7 of 8" color="amber" />
        <h2 className="text-xl font-bold mt-2 text-white">Build Body Paragraph 2</h2>
        <p className="text-sm text-white/60 mt-1">Group: France similar or more (Computers, Perfume). Start with the contrast linker to signal the shift.</p>
      </motion.div>

      <ChartRef />

      <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-3 min-h-[100px]">
        <AnimatePresence mode="popLayout">
          {BODY2_SENTENCES.slice(0, revealed).map((s, i) => (
            <motion.div key={i} initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.35 }}>
              <SentenceWithHighlights sentence={s} />
            </motion.div>
          ))}
        </AnimatePresence>
        {revealed === 0 && <p className="text-xs text-white/25 italic">Click "Add sentence" to start building...</p>}
      </div>

      {revealed < BODY2_SENTENCES.length ? (
        <div className="text-center">
          <Button onClick={add} variant="outline" className="gap-2 border-white/20 text-white hover:bg-white/10">
            Add sentence {revealed + 1} / {BODY2_SENTENCES.length} <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      ) : (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
          <p className="text-xs text-center text-green-400 font-medium">Body Paragraph 2 complete!</p>
          <Tip>Starting with "On the other hand" immediately signals contrast to the examiner — earns marks in Coherence & Cohesion.</Tip>
        </motion.div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────
// SLIDE 9 — Full Model Answer
// ─────────────────────────────────────────────
const MODEL_PARAGRAPHS = [
  { label: "Introduction", color: "border-blue-500/40 bg-blue-600/15", labelColor: "text-blue-300", text: "The chart illustrates the amount of money spent on five consumer goods (cars, computers, books, perfume and cameras) in France and the UK in 2010. Units are measured in pounds sterling." },
  { label: "Overview", color: "border-purple-500/40 bg-purple-600/15", labelColor: "text-purple-300", text: "Overall, the UK spent more money on consumer goods than France in the period given. Both the British and the French spent most of their money on cars whereas the least amount of money was spent on perfume in the UK compared to cameras in France. Furthermore, the most significant difference in expenditure between the two countries was on cameras." },
  { label: "Body Paragraph 1", color: "border-green-500/40 bg-green-600/15", labelColor: "text-green-300", text: "In terms of cars, people in the UK spent about £450,000 on this as opposed to the French at £400,000. Similarly, the British expenditure was higher on books than the French (around £400,000 and £300,000 respectively). In the UK, expenditure on cameras (just over £350,000) was over double that of France, which was only £150,000." },
  { label: "Body Paragraph 2", color: "border-amber-500/40 bg-amber-600/15", labelColor: "text-amber-300", text: "On the other hand, the amount of money paid out on the remaining goods was higher in France. Above £350,000 was spent by the French on computers which was slightly more than the British who spent exactly £350,000. Neither of the countries spent much on perfume which accounted for £200,000 of expenditure in France but under £150,000 in the UK." },
];

function Slide9Model({ onComplete }: { onComplete: () => void }) {
  const [revealed, setRevealed] = useState(0);
  const next = () => { const n = revealed + 1; setRevealed(n); if (n === MODEL_PARAGRAPHS.length) onComplete(); };

  return (
    <div className="space-y-5">
      <motion.div variants={fadeUp(0)} initial="hidden" animate="visible">
        <Pill label="Step 8 of 8" color="blue" />
        <h2 className="text-xl font-bold mt-2 text-white">The Complete Band 9 Answer</h2>
        <p className="text-sm text-white/60 mt-1">Click "Reveal" to see how all four paragraphs come together.</p>
      </motion.div>

      <div className="space-y-3">
        <AnimatePresence>
          {MODEL_PARAGRAPHS.slice(0, revealed).map((p, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.38 }}
              className={`p-4 rounded-xl border ${p.color}`}>
              <p className={`text-[11px] font-semibold uppercase tracking-wide mb-2 ${p.labelColor}`}>{p.label}</p>
              <p className="text-sm text-white/85 leading-relaxed italic">"{p.text}"</p>
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
          <div className="flex items-center justify-center gap-2 text-green-400">
            <CheckCircle className="w-5 h-5" />
            <span className="text-sm font-semibold">Full Band 9 response complete!</span>
          </div>
          <div className="flex gap-2 justify-center flex-wrap">
            <a href="/assets/Task-1-Word-List.pdf" target="_blank" rel="noopener noreferrer">
              <Button variant="outline" size="sm" className="gap-1.5 text-xs border-white/20 text-white hover:bg-white/10">
                <ExternalLink className="w-3 h-3" /> Task 1 Word List PDF
              </Button>
            </a>
            <a href="/assets/Step-By-Step-Task-1.pdf" download>
              <Button variant="outline" size="sm" className="gap-1.5 text-xs border-white/20 text-white hover:bg-white/10">
                <FileDown className="w-3 h-3" /> Download Step-by-Step Guide
              </Button>
            </a>
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
  { q: "Which overview sentence best matches a Band 7+ style?", options: [{ id: "A", text: '"The bar chart shows spending on five types of goods."' }, { id: "B", text: '"Overall, the UK spent more on most consumer goods than France, with cameras highest and perfume lowest in both countries."' }, { id: "C", text: '"Overall, cars, computers, books, perfume and cameras all show different amounts of spending."' }], correct: "B", explanation: "B summarises the main trends (UK higher overall + highest & lowest categories) without listing details — the mark of a strong overview." },
  { q: "Which sentence best shows selective use of numbers (not data-dumping)?", options: [{ id: "A", text: '"The UK spent £400,000 on cars, £380,000 on computers, about £290,000 on books…"' }, { id: "B", text: '"In the UK, spending on cameras, at just over £350,000, was the highest figure, while expenditure on perfume was lowest at about £150,000."' }, { id: "C", text: '"All categories had different figures in both countries."' }], correct: "B", explanation: "B picks only two key numbers (highest + lowest) to support a clear message — exactly the 4–6 key numbers technique." },
  { q: "Which body paragraph grouping follows the 'pattern not item-by-item' rule?", options: [{ id: "A", text: "BP1: Cars, Computers, Books — BP2: Perfume, Cameras" }, { id: "B", text: "BP1: Categories where UK spent more — BP2: Categories where France was similar or more" }, { id: "C", text: "BP1: All UK data — BP2: All France data" }], correct: "B", explanation: "B groups by the pattern of spending, which creates stronger comparisons than listing per country or per item." },
  { q: "Which introduction best paraphrases the question?", options: [{ id: "A", text: '"The chart below shows the expenditure of two countries on consumer goods in 2010."' }, { id: "B", text: '"The bar chart illustrates how much money people in France and the UK spent on five categories of consumer goods in 2010, measured in pounds sterling."' }, { id: "C", text: '"This bar chart is about France, the UK and some things they buy."' }], correct: "B", explanation: "B mentions visual type, countries, categories, year and units — a complete paraphrased introduction." },
  { q: "What does NOT belong in the overview paragraph?", options: [{ id: "A", text: '"Overall, the UK spent more on consumer goods than France."' }, { id: "B", text: '"Overall, cameras attracted the highest spending, while perfume was the lowest."' }, { id: "C", text: '"In France, people spent exactly £400,000 on cars and roughly £150,000 on cameras."' }], correct: "C", explanation: "C gives specific figures — those belong in a body paragraph. The overview gives the big picture only." },
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
          <h2 className="text-2xl font-bold text-white">Quiz Complete!</h2>
          <p className="text-white/50 mt-1">You scored {score} / {QUIZ_QUESTIONS.length} ({pct}%)</p>
        </motion.div>
        <motion.p initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="text-sm text-white/70 max-w-sm mx-auto leading-relaxed">
          {pct === 100 ? "Perfect! You have a strong command of Task 1 strategy." : pct >= 60 ? "Good work! Review any concepts that tripped you up, then try a live question." : "Keep going — re-read the slides then try again."}
        </motion.p>
        <Button variant="outline" onClick={reset} className="gap-2 border-white/20 text-white hover:bg-white/10">
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
          <h2 className="text-xl font-bold text-white">Test Yourself</h2>
          <span className="text-sm text-white/40">{idx + 1} / {QUIZ_QUESTIONS.length} · Score: {score}</span>
        </div>
        <div className="w-full bg-white/10 rounded-full h-1.5 mt-2">
          <motion.div className="bg-accent h-1.5 rounded-full" animate={{ width: `${((idx + (shown ? 1 : 0)) / QUIZ_QUESTIONS.length) * 100}%` }} transition={{ duration: 0.3 }} />
        </div>
      </motion.div>

      <AnimatePresence mode="wait">
        <motion.div key={idx} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.25 }} className="space-y-3">
          <div className="p-4 rounded-xl bg-white/5 border border-white/10">
            <p className="text-sm font-medium text-white">{q.q}</p>
          </div>
          <div className="space-y-2">
            {q.options.map(opt => {
              const isCorrect = opt.id === q.correct;
              const isSelected = selected === opt.id;
              let cls = "w-full text-left p-3.5 rounded-xl border text-sm transition-all ";
              if (!shown) cls += "bg-white/5 border-white/10 text-white hover:border-white/30 hover:bg-white/10";
              else if (isCorrect) cls += "bg-green-500/15 border-green-500/50 text-green-200";
              else if (isSelected) cls += "bg-red-500/15 border-red-500/50 text-red-200";
              else cls += "bg-white/3 border-white/5 text-white/30";
              return (
                <button key={opt.id} onClick={() => answer(opt.id)} disabled={shown} className={cls}>
                  <div className="flex items-start gap-2.5">
                    <span className="font-semibold shrink-0">{opt.id}.</span>
                    <span>{opt.text}</span>
                    {shown && isCorrect && <CheckCircle className="w-4 h-4 text-green-400 shrink-0 ml-auto mt-0.5" />}
                    {shown && isSelected && !isCorrect && <XCircle className="w-4 h-4 text-red-400 shrink-0 ml-auto mt-0.5" />}
                  </div>
                </button>
              );
            })}
          </div>
          {shown && (
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
              className="p-3 rounded-lg bg-accent/10 border border-accent/20 text-sm text-white/70">
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
const SLIDE_TITLES = ["Welcome", "Read the Chart", "The Structure", "Introduction", "Overview", "Group Data", "Body P1", "Body P2", "Full Answer", "Quiz"];

export function WritingTask1Tutorial() {
  const [fullscreen, setFullscreen] = useState(false);
  const [slide, setSlide] = useState(1); // 1-indexed fullscreen slides (slides[0] = welcome)
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
  const closeFullscreen = () => { setFullscreen(false); };

  const canNext = completed[slide] && slide < 9;

  const fsSlides = [
    null, // index 0 unused
    <Slide2Chart key="s2" onComplete={() => markDone(1)} />,
    <Slide3Blueprint key="s3" onComplete={() => markDone(2)} />,
    <Slide4Introduction key="s4" onComplete={() => markDone(3)} />,
    <Slide5Overview key="s5" onComplete={() => markDone(4)} />,
    <Slide6Grouping key="s6" onComplete={() => markDone(5)} />,
    <Slide7Body1 key="s7" onComplete={() => markDone(6)} />,
    <Slide8Body2 key="s8" onComplete={() => markDone(7)} />,
    <Slide9Model key="s9" onComplete={() => markDone(8)} />,
    <Slide10Quiz key="s10" />,
  ];

  // Fullscreen overlay rendered via portal
  const overlay = fullscreen ? createPortal(
    <div className="fixed inset-0 z-[200] bg-[#07080f] overflow-y-auto">
      {/* Top bar */}
      <div className="sticky top-0 z-10 bg-[#07080f]/95 backdrop-blur border-b border-white/8 px-6 py-3 flex items-center gap-4">
        <button onClick={closeFullscreen}
          className="flex items-center gap-1.5 text-xs text-white/50 hover:text-white/90 transition-colors">
          <X className="w-4 h-4" /> Exit Tutorial
        </button>
        <div className="flex-1">
          <div className="w-full bg-white/8 rounded-full h-1">
            <motion.div className="bg-accent h-1 rounded-full"
              animate={{ width: `${(slide / 9) * 100}%` }} transition={{ duration: 0.4 }} />
          </div>
        </div>
        <span className="text-xs text-white/40 shrink-0">{SLIDE_TITLES[slide]} · {slide} / 9</span>
      </div>

      {/* Slide dots */}
      <div className="flex items-center justify-center gap-1.5 pt-4 px-6">
        {Array.from({ length: 9 }, (_, i) => i + 1).map(i => (
          <button key={i}
            onClick={() => { if (i < slide || completed[i - 1]) { setDir(i > slide ? 1 : -1); setSlide(i); } }}
            className={`rounded-full transition-all duration-300 ${i === slide ? "w-5 h-2 bg-accent" : completed[i] ? "w-2 h-2 bg-accent/50" : "w-2 h-2 bg-white/15"}`}
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

      {/* Bottom nav (hidden on quiz slide) */}
      {slide !== 9 && (
        <div className="fixed bottom-0 left-0 right-0 bg-[#07080f]/95 backdrop-blur border-t border-white/8 px-6 py-3 flex items-center justify-between max-w-full">
          <Button variant="ghost" size="sm" onClick={goPrev} disabled={slide === 1}
            className="gap-1.5 text-white/60 hover:text-white disabled:opacity-20">
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
