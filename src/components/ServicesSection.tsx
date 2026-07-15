import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Target, GraduationCap, Check, ArrowRight,
  Brain, BookOpen, Headphones, PenTool, Mic, BarChart3,
  FileText, Users, MessageSquare, RefreshCw,
} from "lucide-react";
import { buildWhatsAppLink, CONTACT_MESSAGES } from "@/lib/contact";

// ─── animation helpers ────────────────────────────────────────────────────────

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-60px" },
  transition: { duration: 0.5, ease: "easeOut", delay },
});

// ─── IELTS feature list ───────────────────────────────────────────────────────

const IELTS_FEATURES = [
  { icon: Brain,        label: "Full IELTS Diagnostic",      desc: "4-module timed test with AI grading and instant band score" },
  { icon: Target,       label: "Personalised Study Plan",    desc: "Week-by-week curriculum adapted to your band gap" },
  { icon: BookOpen,     label: "Reading Practice",           desc: "True/False/Not Given, matching, short answer — 3 difficulty levels" },
  { icon: Headphones,   label: "Listening Practice",         desc: "Human-voice audio with real question types and AI grading" },
  { icon: PenTool,      label: "Writing Feedback (AI)",      desc: "Task 1 and Task 2 scored on all 4 IELTS criteria per submission" },
  { icon: Mic,          label: "Speaking Practice",          desc: "Part 1/2/3 prompts, voice recording, Whisper transcription + feedback" },
  { icon: BarChart3,    label: "Progress Analytics",         desc: "Band trend over time, weak-area breakdown, study streak" },
  { icon: FileText,     label: "Revision Notes",             desc: "Grammar, vocabulary bank, PEEL structure, collocations & paraphrasing" },
];

const IELTS_TARGETS = ["Band 6.0", "Band 6.5", "Band 7.0", "Band 7.5", "Band 8.0+"];

// ─── Uni Essays data ──────────────────────────────────────────────────────────

const ESSAY_PLATFORMS = [
  {
    flag: "🇮🇩", name: "IUP Indonesia",
    detail: "UI, ITB, UGM, Unpad, UNDIP International Undergraduate Programs",
    accent: "#C8860A",
    bg: "rgba(245,188,60,0.08)", border: "rgba(245,188,60,0.22)",
  },
  {
    flag: "🇺🇸", name: "US Common App",
    detail: "Personal statement + supplemental essays for Harvard, MIT, Stanford, Columbia, UC Berkeley, UCLA",
    accent: "#185688",
    bg: "rgba(72,168,204,0.08)", border: "rgba(72,168,204,0.22)",
  },
  {
    flag: "🇬🇧", name: "UK UCAS",
    detail: "Personal statement for Oxford, Cambridge, Imperial, UCL, LSE, Edinburgh",
    accent: "#2563eb",
    bg: "rgba(37,99,235,0.07)", border: "rgba(37,99,235,0.20)",
  },
  {
    flag: "🇸🇬", name: "Singapore",
    detail: "NUS, NTU, SMU — personal essay and supplemental materials",
    accent: "#c2410c",
    bg: "rgba(239,68,68,0.07)", border: "rgba(239,68,68,0.18)",
  },
];

const ESSAY_PROCESS = [
  {
    step: "01", icon: MessageSquare, label: "Strategy Session",
    desc: "Free 30-min call with our Berkeley/IELTS alumni coaches to map your application story and choose the right schools.",
  },
  {
    step: "02", icon: Brain, label: "AI-Assisted Draft",
    desc: "Our AI generates a structured first draft from your brainstorm answers. You shape the voice — we handle the structure.",
  },
  {
    step: "03", icon: Users, label: "Expert Human Review",
    desc: "Our coaches — Berkeley, Oxford, and top Indonesian IUP alumni — review, annotate, and provide detailed written feedback.",
  },
  {
    step: "04", icon: RefreshCw, label: "Revisions & Polish",
    desc: "Up to 3 full revision rounds. Each round builds toward a final essay that's authentically you and strategically positioned.",
  },
];

const ESSAY_FEATURES = [
  "Common App personal statement (650 words)",
  "UCAS personal statement (4,000 characters)",
  "IUP motivation letter in English",
  "Supplemental / additional essays",
  "Activities list and awards section",
  "Why this school? essays",
];

// ─── Component ────────────────────────────────────────────────────────────────

export const ServicesSection = () => {
  const navigate = useNavigate();

  return (
    <section className="py-24 px-6" style={{ background: "linear-gradient(180deg, #F8FAFB 0%, #FFFFFF 100%)" }}>
      <div className="max-w-6xl mx-auto space-y-6">

        {/* Section header */}
        <motion.div {...fadeUp()} className="text-center space-y-3 mb-16">
          <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: "#48A8CC" }}>
            Two services
          </p>
          <h2
            className="max-w-2xl mx-auto leading-tight"
            style={{ fontSize: "clamp(1.8rem, 3.5vw, 2.8rem)", fontWeight: 300, color: "#0A1C40" }}
          >
            Every step of your{" "}
            <span style={{ fontWeight: 600, color: "#185688" }}>global education journey</span>
            , covered.
          </h2>
          <p className="text-sm max-w-lg mx-auto leading-relaxed" style={{ color: "rgba(10,28,64,0.55)" }}>
            From acing the language test to crafting the essay that gets you in — Engvolve coaches both.
          </p>
        </motion.div>

        {/* ── Service 1: IELTS ─────────────────────────────────────────────── */}
        <motion.div
          {...fadeUp(0.1)}
          className="rounded-3xl overflow-hidden"
          style={{
            border: "1px solid rgba(72,168,204,0.20)",
            boxShadow: "0 4px 40px rgba(24,86,136,0.07)",
          }}
        >
          {/* Header band */}
          <div
            className="px-8 py-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
            style={{ background: "linear-gradient(135deg, #0C3D6B 0%, #185688 55%, #2A7AB8 100%)" }}
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0"
                   style={{ background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.20)" }}>
                <Target className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: "rgba(255,255,255,0.55)" }}>Service 01</p>
                <h3 className="text-xl font-semibold text-white leading-tight">IELTS Preparation</h3>
              </div>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {IELTS_TARGETS.map(t => (
                <span key={t} className="px-2.5 py-1 rounded-full text-[11px] font-medium"
                      style={{ background: "rgba(255,255,255,0.12)", color: "rgba(255,255,255,0.80)", border: "1px solid rgba(255,255,255,0.18)" }}>
                  {t}
                </span>
              ))}
            </div>
          </div>

          {/* Body */}
          <div className="p-8 grid md:grid-cols-2 gap-8" style={{ background: "#FAFCFF" }}>
            {/* Left: headline + CTA */}
            <div className="space-y-5">
              <div>
                <h4 className="text-lg font-semibold leading-snug mb-2" style={{ color: "#0A1C40" }}>
                  Go from your current band to 7.0+ with AI-powered practice and expert strategy.
                </h4>
                <p className="text-sm leading-relaxed" style={{ color: "rgba(10,28,64,0.60)" }}>
                  Our full diagnostic identifies exactly where you lose marks. Then a personalised study plan,
                  AI feedback on every writing and speaking submission, and curated revision notes close
                  the gap — week by week.
                </p>
              </div>

              <div className="rounded-2xl p-5 space-y-2"
                   style={{ background: "rgba(72,168,204,0.06)", border: "1px solid rgba(72,168,204,0.16)" }}>
                <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: "#185688" }}>
                  What's included
                </p>
                <div className="grid grid-cols-1 gap-1.5">
                  {IELTS_FEATURES.map(({ icon: Icon, label, desc }) => (
                    <div key={label} className="flex items-start gap-2.5">
                      <div className="w-5 h-5 rounded-md flex items-center justify-center shrink-0 mt-0.5"
                           style={{ background: "rgba(72,168,204,0.15)" }}>
                        <Icon className="w-2.5 h-2.5" style={{ color: "#185688" }} />
                      </div>
                      <div>
                        <span className="text-xs font-semibold" style={{ color: "#0A1C40" }}>{label}</span>
                        <span className="text-xs" style={{ color: "rgba(10,28,64,0.55)" }}> — {desc}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={() => navigate("/auth?mode=signup")}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold text-white transition-all duration-200 hover:opacity-90 hover:scale-[1.01] active:scale-[0.99]"
                style={{ background: "linear-gradient(135deg, #48A8CC 0%, #185688 100%)" }}
              >
                Start your free trial <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* Right: mock app preview */}
            <div className="relative flex items-center justify-center">
              <div className="w-full rounded-2xl overflow-hidden shadow-xl"
                   style={{ background: "#0D1628", border: "1px solid rgba(72,168,204,0.18)" }}>
                {/* Title bar */}
                <div className="flex items-center gap-1.5 px-4 py-2.5"
                     style={{ background: "rgba(255,255,255,0.04)", borderBottom: "1px solid rgba(72,168,204,0.10)" }}>
                  <span className="w-2.5 h-2.5 rounded-full" style={{ background: "#FF5F57" }} />
                  <span className="w-2.5 h-2.5 rounded-full" style={{ background: "#FFBD2E" }} />
                  <span className="w-2.5 h-2.5 rounded-full" style={{ background: "#28C840" }} />
                  <span className="flex-1 text-center text-[10px]" style={{ color: "rgba(255,255,255,0.25)" }}>
                    Engvolve Dashboard
                  </span>
                </div>
                {/* Mock score card */}
                <div className="p-5 space-y-3">
                  <div className="flex items-center justify-between">
                    <p className="text-[11px] font-semibold" style={{ color: "rgba(255,255,255,0.50)" }}>Your Diagnostic Result</p>
                    <span className="text-[10px] px-2 py-0.5 rounded-full" style={{ background: "rgba(72,168,204,0.15)", color: "#48A8CC" }}>AI Graded</span>
                  </div>
                  <div className="text-center py-4">
                    <p className="text-[10px] uppercase tracking-widest mb-1" style={{ color: "rgba(255,255,255,0.35)" }}>Overall Band Score</p>
                    <p className="text-5xl font-black" style={{ color: "#FFE4A0" }}>6.5</p>
                    <p className="text-[10px] mt-1" style={{ color: "rgba(255,255,255,0.40)" }}>Developing Plan recommended</p>
                  </div>
                  <div className="grid grid-cols-4 gap-2">
                    {[
                      { mod: "Reading",   score: "7.0", color: "#48A8CC" },
                      { mod: "Listening", score: "6.5", color: "#f59e0b" },
                      { mod: "Writing",   score: "6.0", color: "#a78bfa" },
                      { mod: "Speaking",  score: "6.5", color: "#34d399" },
                    ].map(({ mod, score, color }) => (
                      <div key={mod} className="rounded-lg p-2 text-center"
                           style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.07)" }}>
                        <p className="text-[9px] mb-1" style={{ color: "rgba(255,255,255,0.35)" }}>{mod}</p>
                        <p className="text-base font-black" style={{ color }}>{score}</p>
                      </div>
                    ))}
                  </div>
                  <div className="rounded-xl p-3"
                       style={{ background: "rgba(72,168,204,0.08)", border: "1px solid rgba(72,168,204,0.15)" }}>
                    <p className="text-[10px] font-semibold mb-1.5" style={{ color: "#48A8CC" }}>AI Writing Feedback</p>
                    <p className="text-[10px] leading-relaxed" style={{ color: "rgba(255,255,255,0.50)" }}>
                      "Your Task Response is strong — your position is clear. However, your Lexical
                      Resource needs more variety: replace 'important' with 'pivotal' or 'instrumental'."
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* ── Service 2: Uni Essays ─────────────────────────────────────────── */}
        <motion.div
          {...fadeUp(0.15)}
          className="rounded-3xl overflow-hidden"
          style={{
            border: "1px solid rgba(200,134,10,0.22)",
            boxShadow: "0 4px 40px rgba(200,134,10,0.06)",
          }}
        >
          {/* Header band */}
          <div
            className="px-8 py-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
            style={{ background: "linear-gradient(135deg, #1A1205 0%, #3B2700 55%, #5C3A00 100%)" }}
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0"
                   style={{ background: "rgba(255,228,160,0.12)", border: "1px solid rgba(255,228,160,0.22)" }}>
                <GraduationCap className="w-6 h-6" style={{ color: "#FFE4A0" }} />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: "rgba(255,228,160,0.50)" }}>Service 02</p>
                <h3 className="text-xl font-semibold leading-tight" style={{ color: "#FFFFFF" }}>University Application Essays</h3>
              </div>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {["IUP 🇮🇩", "Common App 🇺🇸", "UCAS 🇬🇧", "Singapore 🇸🇬"].map(t => (
                <span key={t} className="px-2.5 py-1 rounded-full text-[11px] font-medium"
                      style={{ background: "rgba(255,228,160,0.10)", color: "rgba(255,228,160,0.80)", border: "1px solid rgba(255,228,160,0.18)" }}>
                  {t}
                </span>
              ))}
            </div>
          </div>

          {/* Body */}
          <div className="p-8 grid md:grid-cols-2 gap-8" style={{ background: "#FFFDF7" }}>
            {/* Left: headline + process + CTA */}
            <div className="space-y-5">
              <div>
                <h4 className="text-lg font-semibold leading-snug mb-2" style={{ color: "#1A1205" }}>
                  Write the essay that makes an admissions officer say yes — with alumni coaches who've been there.
                </h4>
                <p className="text-sm leading-relaxed" style={{ color: "rgba(26,18,5,0.60)" }}>
                  Our coaches graduated from UC Berkeley, Oxford, and top Indonesian IUP programs.
                  They've read thousands of successful essays. Now they'll help yours stand out.
                </p>
              </div>

              {/* Process */}
              <div className="space-y-3">
                {ESSAY_PROCESS.map(({ step, icon: Icon, label, desc }) => (
                  <div key={step} className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0"
                           style={{ background: "rgba(200,134,10,0.12)", border: "1px solid rgba(200,134,10,0.22)" }}>
                        <Icon className="w-3.5 h-3.5" style={{ color: "#C8860A" }} />
                      </div>
                      <div className="w-px flex-1 mt-1" style={{ background: "rgba(200,134,10,0.14)", minHeight: 8 }} />
                    </div>
                    <div className="pb-3">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="text-[10px] font-bold" style={{ color: "rgba(200,134,10,0.60)" }}>{step}</span>
                        <span className="text-xs font-semibold" style={{ color: "#1A1205" }}>{label}</span>
                      </div>
                      <p className="text-xs leading-relaxed" style={{ color: "rgba(26,18,5,0.55)" }}>{desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <button
                onClick={() => window.open(buildWhatsAppLink(CONTACT_MESSAGES.essayCoaching), "_blank")}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold transition-all duration-200 hover:opacity-90 hover:scale-[1.01] active:scale-[0.99]"
                style={{
                  background: "linear-gradient(135deg, #C8860A 0%, #8B5E00 100%)",
                  color: "#fff",
                }}
              >
                Book a free consultation <ArrowRight className="w-4 h-4" />
              </button>
              <p className="text-center text-[10px]" style={{ color: "rgba(26,18,5,0.40)" }}>
                30-minute strategy call · No commitment · Via WhatsApp
              </p>
            </div>

            {/* Right: platforms + essay types */}
            <div className="space-y-4">
              {/* Platforms */}
              <div className="space-y-2">
                <p className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: "rgba(26,18,5,0.40)" }}>
                  We cover
                </p>
                {ESSAY_PLATFORMS.map(({ flag, name, detail, accent, bg, border }) => (
                  <div key={name} className="rounded-xl p-3.5 flex gap-3 items-start"
                       style={{ background: bg, border: `1px solid ${border}` }}>
                    <span className="text-xl leading-none mt-0.5 shrink-0">{flag}</span>
                    <div>
                      <p className="text-xs font-semibold" style={{ color: accent }}>{name}</p>
                      <p className="text-[11px] leading-relaxed mt-0.5" style={{ color: "rgba(26,18,5,0.55)" }}>{detail}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Essay types */}
              <div className="rounded-2xl p-4"
                   style={{ background: "rgba(200,134,10,0.05)", border: "1px solid rgba(200,134,10,0.14)" }}>
                <p className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: "#C8860A" }}>
                  Essay types we coach
                </p>
                <div className="space-y-1.5">
                  {ESSAY_FEATURES.map(f => (
                    <div key={f} className="flex items-center gap-2">
                      <Check className="w-3 h-3 shrink-0" style={{ color: "#C8860A" }} />
                      <span className="text-xs" style={{ color: "rgba(26,18,5,0.70)" }}>{f}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Bottom trust line */}
        <motion.p {...fadeUp(0.2)} className="text-center text-xs pt-4" style={{ color: "rgba(10,28,64,0.38)" }}>
          Both services are built and delivered by Engvolve's founders — not outsourced, not automated.
        </motion.p>
      </div>
    </section>
  );
};
