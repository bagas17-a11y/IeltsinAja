import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, RotateCcw } from "lucide-react";

// ─────────────────────────────────────────────────────────────────────────────
// STEP 1 MOCKUPS
// ─────────────────────────────────────────────────────────────────────────────

const GoalSetupMockup = () => (
  <div className="mt-6 rounded-xl overflow-hidden" style={{ background: "rgba(255,255,255,0.72)", backdropFilter: "blur(8px)", border: "1px solid rgba(24,86,136,0.10)", boxShadow: "0 4px 24px rgba(24,86,136,0.08)" }}>
    <div className="px-4 py-3" style={{ borderBottom: "1px solid rgba(24,86,136,0.08)" }}>
      <p className="text-[11px] font-semibold" style={{ color: "#185688" }}>Welcome to Engvolve ✦</p>
    </div>
    <div className="p-4">
      <p className="text-[11px] font-medium mb-3" style={{ color: "#1A2840" }}>What's your IELTS target band?</p>
      <div className="grid grid-cols-4 gap-1.5 mb-4">
        {["5.0", "6.0", "6.5", "7.0"].map((band, i) => (
          <div key={band} className="py-2 rounded-lg text-center text-[11px] font-semibold"
               style={{ background: i === 2 ? "linear-gradient(135deg, #48A8CC, #185688)" : "rgba(24,86,136,0.06)", color: i === 2 ? "#fff" : "#3A5878", border: i === 2 ? "none" : "1px solid rgba(24,86,136,0.12)" }}>
            {band}
          </div>
        ))}
      </div>
      <p className="text-[11px] font-medium mb-2" style={{ color: "#1A2840" }}>When is your exam?</p>
      <div className="flex gap-1.5 mb-4">
        {["1 month", "3 months", "6 months+"].map((opt, i) => (
          <div key={opt} className="flex-1 py-1.5 rounded-lg text-center text-[10px]"
               style={{ background: i === 1 ? "rgba(72,168,204,0.15)" : "rgba(24,86,136,0.05)", color: i === 1 ? "#185688" : "#7A95B0", border: i === 1 ? "1px solid rgba(72,168,204,0.35)" : "1px solid rgba(24,86,136,0.10)" }}>
            {opt}
          </div>
        ))}
      </div>
      <div className="flex items-center justify-center py-2 rounded-xl text-[11px] font-semibold text-white"
           style={{ background: "linear-gradient(135deg, #48A8CC, #185688)" }}>
        Continue <ArrowRight className="w-3 h-3 ml-1" />
      </div>
    </div>
  </div>
);

const DiagnosticMockup = () => (
  <div className="mt-6 rounded-xl overflow-hidden" style={{ background: "rgba(255,255,255,0.80)", backdropFilter: "blur(8px)", border: "1px solid rgba(24,86,136,0.10)", boxShadow: "0 4px 24px rgba(24,86,136,0.08)" }}>
    <div className="px-4 pt-3 pb-2">
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-[10px]" style={{ color: "#7A95B0" }}>Question 1 of 24</span>
        <span className="text-[10px] px-2 py-0.5 rounded-full" style={{ background: "rgba(24,86,136,0.08)", color: "#185688" }}>Background</span>
      </div>
      <div className="w-full rounded-full" style={{ height: 3, background: "rgba(24,86,136,0.10)" }}>
        <div className="h-full rounded-full" style={{ width: "4%", background: "linear-gradient(90deg, #48A8CC, #185688)" }} />
      </div>
    </div>
    <div className="px-4 pb-4">
      <p className="text-[12px] font-semibold mb-3" style={{ color: "#1A2840", lineHeight: 1.4 }}>How would you describe your current English proficiency?</p>
      {[
        { label: "Beginner — I can understand basic phrases", sel: false },
        { label: "Intermediate — I can handle everyday conversations", sel: false },
        { label: "Upper-Intermediate — comfortable in most situations", sel: false },
        { label: "Advanced — I can express complex ideas fluently", sel: true },
      ].map(({ label, sel }) => (
        <div key={label} className="flex items-center gap-2.5 px-3 py-2 rounded-xl mb-1.5"
             style={{ border: sel ? "1.5px solid #48A8CC" : "1px solid rgba(24,86,136,0.12)", background: sel ? "rgba(72,168,204,0.07)" : "rgba(255,255,255,0.60)" }}>
          <div className="w-3.5 h-3.5 rounded-full flex items-center justify-center shrink-0"
               style={{ border: sel ? "2px solid #48A8CC" : "2px solid #CBD5E1" }}>
            {sel && <div className="w-1.5 h-1.5 rounded-full" style={{ background: "#48A8CC" }} />}
          </div>
          <span className="text-[10.5px]" style={{ color: "#1A2840" }}>{label}</span>
        </div>
      ))}
      <div className="mt-3 flex items-center justify-center py-2 rounded-xl text-[11px] font-semibold text-white"
           style={{ background: "linear-gradient(135deg, #48A8CC, #185688)" }}>
        Next Question <ArrowRight className="w-3 h-3 ml-1" />
      </div>
    </div>
  </div>
);

const StudyPlanMockup = () => (
  <div className="mt-6 rounded-xl overflow-hidden" style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.10)" }}>
    <div className="px-4 pt-3 pb-2 flex gap-2 flex-wrap" style={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
      <span className="text-[10px] px-2.5 py-1 rounded-full" style={{ background: "rgba(72,168,204,0.18)", color: "#88D4F0", border: "1px solid rgba(72,168,204,0.28)" }}>Foundation Track</span>
      <span className="text-[10px] px-2.5 py-1 rounded-full" style={{ background: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.55)" }}>Predicted 4.5 → Target 6.0–6.5</span>
    </div>
    <div className="grid grid-cols-4 gap-0 px-4 py-3" style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
      {[["4", "Weeks"], ["0", "Done"], ["2/20", "Tasks"], ["13h", "Total"]].map(([val, label]) => (
        <div key={label} className="text-center">
          <p className="text-base font-bold" style={{ color: "#F0F8FF" }}>{val}</p>
          <p className="text-[9px]" style={{ color: "rgba(255,255,255,0.38)" }}>{label}</p>
        </div>
      ))}
    </div>
    <div className="px-4 py-2" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
      <div className="flex justify-between mb-1">
        <span className="text-[9px]" style={{ color: "rgba(255,255,255,0.38)" }}>Overall progress</span>
        <span className="text-[9px]" style={{ color: "#88D4F0" }}>10%</span>
      </div>
      <div className="w-full rounded-full" style={{ height: 3, background: "rgba(255,255,255,0.08)" }}>
        <div className="h-full rounded-full" style={{ width: "10%", background: "linear-gradient(90deg, #48A8CC, #6ECEF5)" }} />
      </div>
    </div>
    <div className="p-3 space-y-2">
      {[
        { num: 1, title: "Grammar — Tenses & Agreement", tag: "Grammar", active: true },
        { num: 2, title: "IELTS Writing Strategy", tag: "Writing", active: false },
        { num: 3, title: "Full Practice Tests", tag: "Mixed", active: false },
      ].map(({ num, title, tag, active }) => (
        <div key={num} className="px-3 py-2.5 rounded-xl"
             style={{ background: active ? "rgba(72,168,204,0.12)" : "rgba(255,255,255,0.05)", border: active ? "1px solid rgba(72,168,204,0.28)" : "1px solid rgba(255,255,255,0.06)" }}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 min-w-0">
              <span className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 text-[9px] font-bold"
                    style={{ background: active ? "rgba(72,168,204,0.25)" : "rgba(255,255,255,0.08)", color: active ? "#88D4F0" : "rgba(255,255,255,0.40)" }}>{num}</span>
              <span className="text-[10.5px] font-medium truncate" style={{ color: active ? "#EAF6FF" : "rgba(255,255,255,0.45)" }}>{title}</span>
            </div>
            <span className="text-[9px] px-1.5 py-0.5 rounded-full ml-2 shrink-0"
                  style={{ background: "rgba(255,255,255,0.07)", color: "rgba(255,255,255,0.35)" }}>{tag}</span>
          </div>
        </div>
      ))}
    </div>
  </div>
);

// ─────────────────────────────────────────────────────────────────────────────
// MAC WINDOW CHROME
// ─────────────────────────────────────────────────────────────────────────────

const MacWindowBar = ({ title, dark = false }: { title?: string; dark?: boolean }) => (
  <div className="flex items-center gap-1.5 px-3 shrink-0"
       style={{ height: 28, background: dark ? "rgba(255,255,255,0.06)" : "rgba(14,56,96,0.04)", borderBottom: dark ? "1px solid rgba(255,255,255,0.08)" : "1px solid rgba(14,56,96,0.08)" }}>
    <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#FF5F57", boxShadow: "0 0 0 0.5px rgba(0,0,0,0.15)" }} />
    <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#FFBD2E", boxShadow: "0 0 0 0.5px rgba(0,0,0,0.12)" }} />
    <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#28C840", boxShadow: "0 0 0 0.5px rgba(0,0,0,0.10)" }} />
    {title && (
      <span className="flex-1 text-center text-[9px] truncate"
            style={{ color: dark ? "rgba(255,255,255,0.28)" : "rgba(14,56,96,0.35)", marginLeft: 4 }}>
        {title}
      </span>
    )}
  </div>
);

// ─────────────────────────────────────────────────────────────────────────────
// STEP 2 MOCKUPS
// ─────────────────────────────────────────────────────────────────────────────

const RevisionNotesMockup = () => (
  <div className="mt-6 rounded-xl overflow-hidden" style={{ border: "1px solid rgba(14,56,96,0.10)", boxShadow: "0 4px 20px rgba(14,56,96,0.06)" }}>
    <MacWindowBar title="Writing Skills — Linking Words &amp; Coherence" />
    <div className="grid grid-cols-5" style={{ minHeight: 220 }}>
      <div className="col-span-2 p-3" style={{ background: "rgba(255,255,255,0.55)", borderRight: "1px solid rgba(14,56,96,0.08)" }}>
        <p className="text-[9px] font-semibold uppercase tracking-wider mb-2" style={{ color: "#7A95B0" }}>Writing Skills</p>
        {["Paragraph Structuring", "Text Types", "Reporting Verbs", "Linking Words & Coherence", "Hedging & Academic Style"].map((item, i) => (
          <div key={item} className="px-2 py-1.5 rounded-lg mb-0.5 text-[9.5px]"
               style={{ background: i === 3 ? "rgba(72,168,204,0.14)" : "transparent", color: i === 3 ? "#185688" : "#5A7A9A", fontWeight: i === 3 ? 600 : 400, borderLeft: i === 3 ? "2px solid #48A8CC" : "2px solid transparent" }}>
            {item}
          </div>
        ))}
      </div>
      <div className="col-span-3 p-3" style={{ background: "rgba(255,255,255,0.90)" }}>
        <p className="text-[11px] font-semibold mb-2" style={{ color: "#0A1C40" }}>Referencing: pronouns &amp; this/that</p>
        <p className="text-[9.5px] mb-2 leading-relaxed" style={{ color: "#3A5878" }}>
          Referencing means referring back to earlier ideas using <span style={{ color: "#185688", fontWeight: 600 }}>pronouns</span> or <span style={{ color: "#185688", fontWeight: 600 }}>reference words</span> instead of repeating the noun.
        </p>
        <div className="rounded-lg px-2.5 py-2 mb-2" style={{ background: "rgba(72,168,204,0.08)", borderLeft: "2px solid #48A8CC" }}>
          <p className="text-[8.5px] font-semibold mb-0.5" style={{ color: "#185688" }}>✦ Worked Example</p>
          <p className="text-[9px]" style={{ color: "#1A2840" }}>"The university is large. <span style={{ fontWeight: 700 }}>It</span> has many students."</p>
        </div>
        <div className="rounded-lg px-2.5 py-2" style={{ background: "rgba(245,188,60,0.08)", borderLeft: "2px solid #F5BC3C" }}>
          <p className="text-[8.5px] font-semibold mb-0.5" style={{ color: "#B8860B" }}>Examiner Tip</p>
          <p className="text-[9px] leading-tight" style={{ color: "#1A2840" }}>Every pronoun must clearly refer to one noun — ambiguity drops your Coherence score.</p>
        </div>
      </div>
    </div>
  </div>
);

const FlashcardMockup = () => {
  const [flipped, setFlipped] = useState(false);
  return (
    <div className="mt-6 rounded-xl overflow-hidden" style={{ border: "1px solid rgba(14,56,96,0.10)", boxShadow: "0 4px 20px rgba(14,56,96,0.06)" }}>
      <MacWindowBar title="Grammar Flashcards — Parts of Speech" />
      <div className="p-4">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-[9.5px] font-semibold px-2.5 py-1 rounded-full"
              style={{ background: "rgba(14,56,96,0.08)", color: "#185688", border: "1px solid rgba(14,56,96,0.14)" }}>Parts of Speech</span>
        <span className="text-[9.5px]" style={{ color: "#7A95B0" }}>Card 7 of 30</span>
      </div>
      <div className="cursor-pointer" style={{ perspective: "800px", height: 170 }} onClick={() => setFlipped(f => !f)}>
        <div style={{ position: "relative", width: "100%", height: "100%", transition: "transform 0.55s cubic-bezier(0.4,0,0.2,1)", transformStyle: "preserve-3d", transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)" }}>
          <div style={{ position: "absolute", inset: 0, backfaceVisibility: "hidden", background: "rgba(255,255,255,0.85)", border: "1px solid rgba(14,56,96,0.12)", borderRadius: 14, boxShadow: "0 4px 20px rgba(14,56,96,0.10)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "16px 20px" }}>
            <p className="text-[10px] mb-2" style={{ color: "#7A95B0" }}>Question</p>
            <p className="text-[13px] font-semibold text-center" style={{ color: "#0A1C40", lineHeight: 1.4 }}>What is the grammatical role of a <span style={{ color: "#185688" }}>pronoun</span> in academic writing?</p>
            <div className="flex items-center gap-1.5 mt-4">
              <div className="w-1.5 h-1.5 rounded-full" style={{ background: "#48A8CC", opacity: 0.6 }} />
              <p className="text-[9.5px]" style={{ color: "#7A95B0" }}>Tap to reveal answer</p>
            </div>
          </div>
          <div style={{ position: "absolute", inset: 0, backfaceVisibility: "hidden", transform: "rotateY(180deg)", background: "linear-gradient(145deg, #EBF7FF, #DDF0F8)", border: "1px solid rgba(72,168,204,0.25)", borderRadius: 14, boxShadow: "0 4px 20px rgba(14,56,96,0.10)", display: "flex", flexDirection: "column", justifyContent: "center", padding: "16px 20px" }}>
            <p className="text-[10px] mb-2 font-semibold" style={{ color: "#185688" }}>Answer</p>
            <p className="text-[11.5px] leading-relaxed" style={{ color: "#0A1C40" }}>A pronoun <span style={{ fontWeight: 600 }}>replaces a noun</span> to avoid repetition: <em style={{ color: "#185688" }}>he, she, they, it, this, those</em>.</p>
            <p className="text-[9.5px] mt-3" style={{ color: "#48A8CC" }}>"The policy was introduced in 2020. <span style={{ fontWeight: 700 }}>It</span> aimed to reduce emissions."</p>
            <div className="flex items-center gap-1.5 mt-4">
              <RotateCcw className="w-3 h-3" style={{ color: "#7A95B0" }} />
              <p className="text-[9.5px]" style={{ color: "#7A95B0" }}>Tap to flip back</p>
            </div>
          </div>
        </div>
      </div>
      <div className="flex justify-center gap-1 mt-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="rounded-full" style={{ width: i === 1 ? 16 : 6, height: 6, background: i < 2 ? "#48A8CC" : "rgba(14,56,96,0.12)" }} />
        ))}
      </div>
      </div>
    </div>
  );
};

const TutorialMockup = () => {
  const [checked, setChecked] = useState<Set<number>>(new Set());
  const allDone = checked.size === 3;
  const passages = [
    { label: "Passage 1 — 18 minutes", tag: "Easiest", desc: "Everyday language. Answer every question — skip none." },
    { label: "Passage 2 — 20 minutes", tag: "Medium", desc: "Mixed vocab. Bank 2 minutes for harder questions later." },
    { label: "Passage 3 — 22 minutes", tag: "Hardest", desc: "Dense academic text. Skim first, then answer precisely." },
  ];
  const tagColor: Record<string, string> = { Easiest: "#22c55e", Medium: "#f59e0b", Hardest: "#ef4444" };
  return (
    <div className="mt-6 rounded-xl overflow-hidden" style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.10)" }}>
      <MacWindowBar title="MudahinAja — Reading Strategies" dark />
      <div className="px-4 pt-3 pb-2" style={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
        <div className="flex items-center justify-between mb-2">
          <div className="flex gap-1">
            {["Time", "TFNG", "Reference", "MCQ"].map((t, i) => (
              <span key={t} className="text-[8.5px] px-2 py-0.5 rounded-full" style={{ background: i === 0 ? "rgba(72,168,204,0.22)" : "rgba(255,255,255,0.07)", color: i === 0 ? "#88D4F0" : "rgba(255,255,255,0.35)" }}>{t}</span>
            ))}
          </div>
          <span className="text-[9px]" style={{ color: "rgba(255,255,255,0.30)" }}>1 / 8</span>
        </div>
        <div className="w-full rounded-full" style={{ height: 2.5, background: "rgba(255,255,255,0.10)" }}>
          <div className="h-full rounded-full" style={{ width: "12%", background: "linear-gradient(90deg, #48A8CC, #6ECEF5)" }} />
        </div>
      </div>
      <div className="px-4 pt-3 pb-3">
        <span className="text-[8.5px] font-semibold tracking-wider" style={{ color: "#88D4F0" }}>TIME STRATEGY · STEP 1 OF 4</span>
        <p className="text-[13px] font-semibold mt-1 mb-1" style={{ color: "#F0F8FF" }}>The 60-Minute Plan</p>
        <p className="text-[9.5px] mb-3 leading-relaxed" style={{ color: "rgba(180,210,240,0.58)" }}>Click each passage to learn how to pace yourself — then hit Next.</p>
        <div className="flex gap-2 px-2.5 py-2 rounded-lg mb-3" style={{ background: "rgba(72,168,204,0.10)", border: "1px solid rgba(72,168,204,0.20)" }}>
          <span className="text-[9px]" style={{ color: "#48A8CC" }}>ℹ</span>
          <p className="text-[9px] leading-tight" style={{ color: "rgba(180,210,240,0.72)" }}>If you finish a passage early, check TFNG answers — don't re-read whole passages.</p>
        </div>
        <div className="space-y-1.5 mb-3">
          {passages.map(({ label, tag, desc }, i) => {
            const done = checked.has(i);
            return (
              <div key={i} className="flex items-start gap-2.5 px-3 py-2.5 rounded-xl cursor-pointer select-none"
                   style={{ background: done ? "rgba(72,168,204,0.12)" : "rgba(255,255,255,0.05)", border: done ? "1px solid rgba(72,168,204,0.30)" : "1px solid rgba(255,255,255,0.08)" }}
                   onClick={() => setChecked(prev => { const s = new Set(prev); s.add(i); return s; })}>
                <div className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5 text-[9px] font-bold"
                     style={{ background: done ? "#48A8CC" : "rgba(255,255,255,0.10)", color: done ? "#fff" : "rgba(255,255,255,0.45)" }}>
                  {done ? "✓" : i + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <span className="text-[10px] font-medium" style={{ color: done ? "#88D4F0" : "rgba(255,255,255,0.65)" }}>{label}</span>
                    <span className="text-[8px] px-1.5 py-0.5 rounded-full font-semibold" style={{ background: `${tagColor[tag]}22`, color: tagColor[tag] }}>{tag}</span>
                  </div>
                  {done && <p className="text-[9px] leading-tight" style={{ color: "rgba(180,210,240,0.55)" }}>{desc}</p>}
                </div>
              </div>
            );
          })}
        </div>
        <div className="flex items-center justify-center gap-1.5 py-2 rounded-xl text-[11px] font-semibold"
             style={{ background: allDone ? "linear-gradient(135deg, #48A8CC, #185688)" : "rgba(255,255,255,0.06)", color: allDone ? "#fff" : "rgba(255,255,255,0.25)", cursor: allDone ? "pointer" : "not-allowed" }}>
          Next <ArrowRight className="w-3 h-3" />
        </div>
        {!allDone && <p className="text-center text-[8.5px] mt-1.5" style={{ color: "rgba(255,255,255,0.25)" }}>Click all {3 - checked.size} remaining passage{checked.size < 2 ? "s" : ""} to continue</p>}
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// STEP 3 SHARED
// ─────────────────────────────────────────────────────────────────────────────

const BAR_HEIGHTS = [8, 14, 20, 16, 24, 18, 28, 22, 16, 26, 20, 14, 18, 24, 28, 22, 16, 20, 14, 10, 8, 6];

const WaveformBars = ({ color = "#fff", opacity = 0.85, count = 22 }: { color?: string; opacity?: number; count?: number }) => (
  <div className="flex items-end gap-0.5" style={{ height: 32 }}>
    {BAR_HEIGHTS.slice(0, count).map((h, i) => (
      <div key={i} style={{
        width: 2.5, height: h, background: color, borderRadius: 1.5,
        opacity: i < Math.floor(count * 0.6) ? opacity : opacity * 0.30,
        animation: `waveBar ${0.6 + (i % 5) * 0.12}s ease-in-out infinite`,
        animationDelay: `${(i * 0.04) % 0.7}s`,
        transformOrigin: "bottom",
      }} />
    ))}
  </div>
);

// ─────────────────────────────────────────────────────────────────────────────
// STEP 3 MOCKUPS
// ─────────────────────────────────────────────────────────────────────────────

const ReadingSliderMockup = () => {
  const [slide, setSlide] = useState(0);
  const [fading, setFading] = useState(false);

  useEffect(() => {
    const t = setInterval(() => {
      setFading(true);
      setTimeout(() => { setSlide(s => 1 - s); setFading(false); }, 280);
    }, 3800);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="mt-6 rounded-xl overflow-hidden" style={{ border: "1px solid rgba(14,56,96,0.12)", boxShadow: "0 4px 20px rgba(14,56,96,0.08)" }}>
      <MacWindowBar title="Engvolve Reading · Academic" />
      <div className="px-3 py-2 flex items-center justify-between"
           style={{ background: slide === 0 ? "rgba(255,255,255,0.90)" : "rgba(254,242,242,0.90)", borderBottom: "1px solid rgba(14,56,96,0.08)", transition: "background 0.4s" }}>
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-semibold" style={{ color: "#0A1C40" }}>The History of the Bicycle</span>
          <span className="text-[8.5px] px-1.5 py-0.5 rounded-full" style={{ background: "#DCFCE7", color: "#166534" }}>Easy</span>
        </div>
        <span className="text-[9.5px]" style={{ color: "#7A95B0" }}>⏱ {slide === 0 ? "59:25" : "00:00"}</span>
      </div>
      {slide === 1 && (
        <div className="px-3 py-1.5" style={{ background: "rgba(239,68,68,0.06)", borderBottom: "1px solid rgba(239,68,68,0.12)" }}>
          <p className="text-[9px] font-semibold" style={{ color: "#B91C1C" }}>Focus areas · 5 missed True / False / Not Given</p>
        </div>
      )}
      <div className="grid grid-cols-5" style={{ opacity: fading ? 0 : 1, transition: "opacity 0.28s ease", minHeight: 170 }}>
        <div className="col-span-3 p-3" style={{ background: "rgba(255,255,255,0.92)", borderRight: "1px solid rgba(14,56,96,0.07)" }}>
          <p className="text-[9px] font-semibold mb-1" style={{ color: "#185688" }}>Passage 1 · Technology</p>
          <p className="text-[8.5px] leading-relaxed" style={{ color: "#3A5878" }}>
            The bicycle has a history of roughly two hundred years. The first device resembling a bicycle was the Laufmaschine.{" "}
            {slide === 1
              ? <mark style={{ background: "rgba(234,179,8,0.28)", borderRadius: 2, padding: "0 1px" }}>It had two wheels and a seat but no pedals: riders pushed it along with their feet.</mark>
              : <span>It had two wheels and a seat but no pedals: riders pushed it along with their feet.</span>}
            {" "}Von Drais intended it as a substitute for horses.
          </p>
        </div>
        <div className="col-span-2 p-3" style={{ background: "rgba(255,255,255,0.95)" }}>
          <p className="text-[9px] font-semibold mb-2" style={{ color: "#0A1C40" }}>Questions 1–13</p>
          {[
            { q: "The first bicycle-like device was invented in 1817.", wrong: false },
            { q: "The Laufmaschine was powered by pedals.", wrong: slide === 1 },
            { q: "The safety bicycle made cycling more accessible.", wrong: false },
          ].map(({ q, wrong }, i) => (
            <div key={i} className="mb-2">
              <p className="text-[8px] mb-1 leading-tight" style={{ color: "#1A2840" }}>{i + 1}. {q}</p>
              <div className="flex gap-1 flex-wrap">
                {["TRUE", "FALSE", "NOT GIVEN"].map(opt => (
                  <span key={opt} className="text-[7.5px] px-1.5 py-0.5 rounded"
                        style={{ background: wrong && opt === "TRUE" ? "rgba(239,68,68,0.10)" : "rgba(14,56,96,0.06)", color: wrong && opt === "TRUE" ? "#DC2626" : "#7A95B0", border: wrong && opt === "TRUE" ? "1px solid rgba(239,68,68,0.25)" : "1px solid rgba(14,56,96,0.09)" }}>
                    {opt}
                  </span>
                ))}
              </div>
              {wrong && (
                <div className="mt-1">
                  <p className="text-[7.5px]" style={{ color: "#DC2626" }}>✗ Your: TRUE → Correct: FALSE</p>
                  <p className="text-[7px] mt-0.5" style={{ color: "#9CA3AF" }}>Paragraph A: Laufmaschine had no pedals.</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
      <div className="px-3 py-2 flex items-center justify-between" style={{ background: "rgba(255,255,255,0.85)", borderTop: "1px solid rgba(14,56,96,0.07)" }}>
        <div className="flex gap-1">
          {[0, 1].map(i => (
            <div key={i} onClick={() => setSlide(i)} className="rounded-full cursor-pointer"
                 style={{ width: i === slide ? 14 : 6, height: 6, background: i === slide ? "#185688" : "rgba(14,56,96,0.18)", transition: "width 0.3s" }} />
          ))}
        </div>
        <span className="text-[8.5px]" style={{ color: "#7A95B0" }}>{slide === 0 ? "Submit and Review" : "Review answers ↗"}</span>
      </div>
    </div>
  );
};

const ListeningMockup = () => (
  <div className="mt-6 rounded-xl overflow-hidden" style={{ background: "rgba(255,255,255,0.80)", border: "1px solid rgba(14,56,96,0.10)", boxShadow: "0 4px 16px rgba(14,56,96,0.07)" }}>
    <MacWindowBar title="Engvolve Listening · Part 1" />
    <div className="px-4 py-3" style={{ borderBottom: "1px solid rgba(14,56,96,0.08)" }}>
      <div className="flex items-center justify-between mb-2">
        <p className="text-[10.5px] font-semibold" style={{ color: "#0A1C40" }}>City Information Service</p>
        <span className="text-[8.5px] px-1.5 py-0.5 rounded-full" style={{ background: "#DCFCE7", color: "#166534" }}>easy</span>
      </div>
      <div className="flex items-center gap-2.5">
        <div className="relative flex items-center justify-center shrink-0" style={{ width: 28, height: 28 }}>
          <div className="absolute inset-0 rounded-full" style={{ background: "rgba(72,168,204,0.15)", animation: "pulse 1.8s ease-in-out infinite" }} />
          <div className="w-7 h-7 rounded-full flex items-center justify-center" style={{ background: "linear-gradient(135deg, #48A8CC, #185688)" }}>
            <div style={{ width: 0, height: 0, borderStyle: "solid", borderWidth: "4px 0 4px 7px", borderColor: "transparent transparent transparent white", marginLeft: 1 }} />
          </div>
        </div>
        <div className="flex-1"><WaveformBars color="#48A8CC" opacity={0.70} count={18} /></div>
        <span className="text-[9px] shrink-0" style={{ color: "#7A95B0" }}>0:00 / 5:30</span>
      </div>
      <p className="text-[8.5px] mt-1.5" style={{ color: "#7A95B0" }}>Part 1: Listen and answer questions 1–10</p>
    </div>
    <div className="p-3">
      <p className="text-[9.5px] font-semibold mb-0.5" style={{ color: "#0A1C40" }}>VISITOR DETAILS</p>
      <p className="text-[8px] mb-2.5" style={{ color: "#7A95B0" }}>Note Completion — Write NO MORE THAN TWO WORDS</p>
      {[
        { label: "Name", pre: "", post: "" },
        { label: "Hotel", pre: "The", post: "Hotel, Park Street" },
        { label: "Arrival", pre: "the", post: "of July" },
        { label: "Stay", pre: "", post: "nights" },
      ].map(({ label, pre, post }, i) => (
        <div key={label} className="flex items-center gap-1.5 mb-2">
          <span className="text-[8.5px] w-12 shrink-0" style={{ color: "#5A7A9A" }}>{i + 1}. {label}:</span>
          {pre && <span className="text-[8.5px]" style={{ color: "#3A5878" }}>{pre}</span>}
          <div className="h-[18px] rounded flex items-center px-1.5" style={{ minWidth: 52, border: i === 0 ? "1px solid #48A8CC" : "1px solid rgba(14,56,96,0.18)", background: i === 0 ? "rgba(72,168,204,0.05)" : "transparent" }}>
            {i === 0 && <div className="w-0.5 h-3 rounded-full" style={{ background: "#48A8CC", animation: "pulse 1s ease-in-out infinite" }} />}
          </div>
          {post && <span className="text-[8.5px]" style={{ color: "#3A5878" }}>{post}</span>}
        </div>
      ))}
    </div>
  </div>
);

const WritingSliderMockup = () => {
  const [frame, setFrame] = useState(0);
  const [fading, setFading] = useState(false);

  useEffect(() => {
    const t = setInterval(() => {
      setFading(true);
      setTimeout(() => { setFrame(f => (f + 1) % 3); setFading(false); }, 280);
    }, 3600);
    return () => clearInterval(t);
  }, []);

  const countries = ["FIN", "NL", "USA", "UK", "KOR"];
  const d2012 = [62, 50, 47, 35, 30];
  const d2022 = [68, 64, 52, 38, 38];

  return (
    <div className="mt-6 rounded-xl overflow-hidden" style={{ border: "1px solid rgba(255,255,255,0.10)", background: "rgba(255,255,255,0.04)" }}>
      <MacWindowBar title="Engvolve Writing · Task 1 Academic" dark />
      <div style={{ minHeight: 230, opacity: fading ? 0 : 1, transition: "opacity 0.28s ease" }}>

        {frame === 0 && (
          <div className="grid grid-cols-5" style={{ minHeight: 230 }}>
            <div className="col-span-3 p-3" style={{ background: "rgba(255,255,255,0.06)" }}>
              <div className="flex items-center justify-between mb-1.5">
                <p className="text-[9.5px] font-semibold" style={{ color: "#F0F8FF" }}>Task 1 Academic</p>
                <span className="text-[8px] px-1.5 py-0.5 rounded-full" style={{ background: "rgba(72,168,204,0.18)", color: "#88D4F0" }}>Bar chart</span>
              </div>
              <p className="text-[8px] leading-tight mb-2" style={{ color: "rgba(180,210,240,0.60)" }}>The bar chart shows adults who exercised in 5 countries in 2012 &amp; 2022. Summarise and compare. Write at least 150 words.</p>
              <div className="flex items-end gap-1 px-1 mb-1" style={{ height: 44 }}>
                {countries.map((c, i) => (
                  <div key={c} className="flex items-end gap-0.5 flex-1 justify-center">
                    <div style={{ width: 5, height: (d2012[i] / 70) * 40, background: "rgba(59,130,246,0.65)", borderRadius: "1px 1px 0 0" }} />
                    <div style={{ width: 5, height: (d2022[i] / 70) * 40, background: "rgba(251,146,60,0.65)", borderRadius: "1px 1px 0 0" }} />
                  </div>
                ))}
              </div>
              <div className="flex justify-around mb-1.5">
                {countries.map(c => <span key={c} className="text-[7px]" style={{ color: "rgba(180,210,240,0.38)" }}>{c}</span>)}
              </div>
              <div className="flex gap-2">
                {[["2012", "rgba(59,130,246,0.65)"], ["2022", "rgba(251,146,60,0.65)"]].map(([yr, bg]) => (
                  <div key={yr} className="flex items-center gap-1">
                    <div style={{ width: 8, height: 5, background: bg as string, borderRadius: 1 }} />
                    <span className="text-[7px]" style={{ color: "rgba(180,210,240,0.45)" }}>{yr}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="col-span-2 p-3" style={{ background: "rgba(255,255,255,0.03)", borderLeft: "1px solid rgba(255,255,255,0.07)" }}>
              <div className="flex items-center gap-1 mb-2">
                <div className="w-4 h-4 rounded-full flex items-center justify-center shrink-0" style={{ background: "rgba(72,168,204,0.20)", border: "1px solid rgba(72,168,204,0.35)" }}>
                  <span style={{ fontSize: 8, color: "#88D4F0" }}>✦</span>
                </div>
                <span className="text-[8.5px] font-semibold" style={{ color: "#88D4F0" }}>Writing Tutor</span>
              </div>
              <p className="text-[8px] leading-relaxed" style={{ color: "rgba(180,210,240,0.60)" }}>I know this Task 1 question inside out. Ask me how to structure your answer, what vocabulary scores well, or how to write a strong overview.</p>
              <div className="mt-3 px-2 py-1.5 rounded-lg text-[7.5px]" style={{ background: "rgba(72,168,204,0.07)", border: "1px solid rgba(72,168,204,0.16)", color: "rgba(180,210,240,0.38)" }}>
                Ask anything about IELTS writing...
              </div>
            </div>
          </div>
        )}

        {frame === 1 && (
          <div className="p-4" style={{ minHeight: 230 }}>
            <div className="flex items-center justify-between mb-2">
              <p className="text-[10px] font-semibold" style={{ color: "#F0F8FF" }}>Your Essay</p>
              <span className="text-[9px]" style={{ color: "#6ECEF5" }}>234 / 150 words min</span>
            </div>
            <div className="rounded-lg p-3 mb-3" style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.09)" }}>
              <p className="text-[8.5px] leading-relaxed" style={{ color: "rgba(200,230,255,0.70)" }}>
                The bar chart compares the proportion of adults who engaged in regular physical exercise in five different countries in 2012 and 2022. Overall, participation rates rose in every country over the ten-year period, with Country C remaining the most active while Country E consistently recorded the lowest figures.
              </p>
              <p className="text-[8.5px] leading-relaxed mt-2" style={{ color: "rgba(200,230,255,0.70)" }}>
                In 2012, around one third of adults in Country C exercised at least twice a week, making it the leader among all five nations...
              </p>
            </div>
            <p className="text-[7.5px] mb-2" style={{ color: "rgba(180,210,240,0.32)" }}>AI analysis takes 20–40 seconds — please wait after clicking</p>
            <div className="flex items-center justify-center gap-1.5 py-2 rounded-xl text-[10px] font-semibold" style={{ background: "linear-gradient(135deg, #48A8CC, #185688)", color: "#fff" }}>
              Get AI Feedback <ArrowRight className="w-3 h-3" />
            </div>
          </div>
        )}

        {frame === 2 && (
          <div className="p-4" style={{ minHeight: 230 }}>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: "rgba(72,168,204,0.18)", border: "1px solid rgba(72,168,204,0.30)" }}>
                <span className="text-lg font-bold" style={{ color: "#6ECEF5" }}>6.5</span>
              </div>
              <div>
                <p className="text-[10px] font-semibold" style={{ color: "#F0F8FF" }}>Diagnostic Feedback Report</p>
                <div className="grid grid-cols-2 gap-x-3 mt-0.5">
                  {[["Task", "6.5"], ["Coherence", "6.5"], ["Vocab", "6.5"], ["Grammar", "6.5"]].map(([l, v]) => (
                    <div key={l} className="flex items-center gap-1">
                      <span className="text-[7.5px]" style={{ color: "rgba(180,210,240,0.50)" }}>{l}</span>
                      <span className="text-[7.5px] font-bold" style={{ color: "#6ECEF5" }}>{v}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="rounded-lg p-2.5 mb-2" style={{ background: "rgba(239,68,68,0.07)", border: "1px solid rgba(239,68,68,0.15)" }}>
              <p className="text-[8.5px] font-semibold mb-1" style={{ color: "#FCA5A5" }}>WHAT TO FIX</p>
              {["Include a clearer overview with 2–3 main trends", "Use more comparison language (whereas, while, in contrast)"].map((fix, i) => (
                <div key={i} className="flex items-start gap-1.5 mb-1">
                  <span className="text-[9px] shrink-0" style={{ color: "#F87171" }}>{i + 1}.</span>
                  <p className="text-[8px] leading-tight" style={{ color: "rgba(253,200,200,0.75)" }}>{fix}</p>
                </div>
              ))}
            </div>
            <div className="rounded-lg px-2.5 py-2" style={{ background: "rgba(72,168,204,0.08)", border: "1px solid rgba(72,168,204,0.18)" }}>
              <p className="text-[8.5px] font-semibold mb-1" style={{ color: "#6ECEF5" }}>STRUCTURE</p>
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-[8px]" style={{ color: "rgba(180,210,240,0.55)" }}>Introduction</span>
                <span className="text-[7.5px] px-1.5 py-0.5 rounded-full" style={{ background: "rgba(72,168,204,0.14)", color: "#88D4F0" }}>✓ Paraphrased</span>
                <span className="text-[7.5px] px-1.5 py-0.5 rounded-full" style={{ background: "rgba(239,68,68,0.10)", color: "#FCA5A5" }}>✗ No Overview</span>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between px-4 py-2" style={{ borderTop: "1px solid rgba(255,255,255,0.07)" }}>
        <div className="flex gap-1">
          {[0, 1, 2].map(i => (
            <div key={i} onClick={() => setFrame(i)} className="rounded-full cursor-pointer"
                 style={{ width: i === frame ? 14 : 6, height: 6, background: i === frame ? "#6ECEF5" : "rgba(255,255,255,0.18)", transition: "width 0.3s" }} />
          ))}
        </div>
        <span className="text-[8.5px]" style={{ color: "rgba(255,255,255,0.30)" }}>{["Question", "Writing", "Feedback"][frame]}</span>
      </div>
    </div>
  );
};

const SpeakingMockup = () => {
  const [secs, setSecs] = useState(4);
  const words = "Tell me about a time you overcame a difficult challenge in your work or studies".split(" ");
  const [visibleWords, setVisibleWords] = useState(5);

  useEffect(() => {
    const t = setInterval(() => setSecs(s => s < 59 ? s + 1 : 0), 1000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    const t = setInterval(() => setVisibleWords(w => w < words.length ? w + 1 : 3), 420);
    return () => clearInterval(t);
  }, [words.length]);

  return (
    <div className="mt-6 rounded-xl overflow-hidden" style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.10)" }}>
      <MacWindowBar title="Engvolve Speaking · Part 2" dark />
      <div className="p-4">
      <div className="text-center mb-3">
        <p className="text-2xl font-bold tabular-nums" style={{ color: "#F0F8FF", letterSpacing: "0.06em" }}>
          00:{String(secs).padStart(2, "0")}
        </p>
        <div className="flex items-center justify-center gap-1.5 mt-0.5">
          <div className="w-1.5 h-1.5 rounded-full" style={{ background: "#EF4444", animation: "pulse 1.2s ease-in-out infinite" }} />
          <span className="text-[9.5px]" style={{ color: "rgba(255,255,255,0.50)" }}>Recording</span>
        </div>
      </div>
      <div className="flex justify-center mb-4">
        <WaveformBars color="#fff" opacity={0.75} count={22} />
      </div>
      <div className="rounded-lg px-3 py-2 mb-3" style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.09)" }}>
        <p className="text-[8.5px] font-semibold mb-0.5" style={{ color: "rgba(255,255,255,0.35)" }}>PART 2 PROMPT</p>
        <p className="text-[9px] leading-relaxed" style={{ color: "rgba(200,230,255,0.65)" }}>Describe a time you overcame a difficult challenge. What was it, how did you prepare, and what did you learn?</p>
      </div>
      <div className="rounded-lg px-3 py-2 mb-3" style={{ background: "rgba(72,168,204,0.08)", border: "1px solid rgba(72,168,204,0.18)" }}>
        <p className="text-[8.5px] mb-1" style={{ color: "rgba(72,168,204,0.65)" }}>Live transcript</p>
        <p className="text-[9px] leading-relaxed" style={{ color: "rgba(200,230,255,0.80)" }}>
          {words.slice(0, visibleWords).join(" ")}
          <span style={{ display: "inline-block", width: 1.5, height: 10, background: "#6ECEF5", marginLeft: 2, verticalAlign: "middle", animation: "pulse 0.8s ease-in-out infinite" }} />
        </p>
      </div>
      <div className="flex gap-1.5 flex-wrap">
        {["What should I say?", "Follow-up questions", "Recap"].map(opt => (
          <div key={opt} className="text-[8px] px-2 py-1 rounded-full" style={{ background: "rgba(255,255,255,0.07)", color: "rgba(255,255,255,0.40)", border: "1px solid rgba(255,255,255,0.09)" }}>{opt}</div>
        ))}
      </div>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// DIVIDER
// ─────────────────────────────────────────────────────────────────────────────

const StepDivider = ({ num, label }: { num: string; label: string }) => (
  <div className="flex items-center gap-4 mb-10">
    <div className="flex items-center gap-3">
      <span className="text-xs font-bold tracking-widest" style={{ color: "#48A8CC" }}>{num}</span>
      <span className="text-lg font-medium" style={{ color: "#0A1C40" }}>{label}</span>
    </div>
    <div className="flex-1 h-px" style={{ background: "rgba(14,56,96,0.10)" }} />
  </div>
);

// ─────────────────────────────────────────────────────────────────────────────
// MAIN SECTION
// ─────────────────────────────────────────────────────────────────────────────

export const HowItWorksSection = () => {
  const navigate = useNavigate();

  return (
    <section className="py-24 px-6" style={{ background: "#F8FAFB" }} id="features">
      <style>{`@keyframes waveBar { 0%,100%{transform:scaleY(0.25)} 50%{transform:scaleY(1)} }`}</style>

      <div className="max-w-6xl mx-auto">

        <div className="mb-14">
          <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: "#48A8CC" }}>How it works</p>
          <h2 className="text-3xl md:text-4xl leading-tight" style={{ fontWeight: 400, color: "#0A1C40" }}>
            From first question<br />
            <span style={{ fontWeight: 600, color: "#185688" }}>to target band.</span>
          </h2>
        </div>

        {/* ── STEP 1 ── */}
        <StepDivider num="STEP 1" label="Diagnose your level & get your roadmap" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-16">
          <div className="rounded-2xl p-6 flex flex-col" style={{ background: "#EBF7FF", minHeight: 480 }}>
            <span className="text-xs font-bold tracking-widest mb-4" style={{ color: "#48A8CC" }}>01</span>
            <h3 className="text-xl mb-2" style={{ fontWeight: 600, color: "#0A1C40" }}>Set your goal</h3>
            <p className="text-sm leading-relaxed" style={{ color: "#3A5878", fontWeight: 300 }}>Tell us your target band and exam date. Free sign-up, no card required.</p>
            <div className="flex-1"><GoalSetupMockup /></div>
          </div>
          <div className="rounded-2xl p-6 flex flex-col" style={{ background: "#DDF0F8", minHeight: 480 }}>
            <span className="text-xs font-bold tracking-widest mb-4" style={{ color: "#185688" }}>02</span>
            <h3 className="text-xl mb-2" style={{ fontWeight: 600, color: "#0A1C40" }}>Take the diagnostic</h3>
            <p className="text-sm leading-relaxed" style={{ color: "#3A5878", fontWeight: 300 }}>24 questions across all 4 modules map your exact level and pinpoint every band gap.</p>
            <div className="flex-1"><DiagnosticMockup /></div>
          </div>
          <div className="rounded-2xl p-6 flex flex-col" style={{ background: "#0E3860", minHeight: 480 }}>
            <span className="text-xs font-bold tracking-widest mb-4" style={{ color: "#6ECEF5" }}>03</span>
            <h3 className="text-xl mb-2" style={{ fontWeight: 600, color: "#F0F8FF" }}>Follow your roadmap</h3>
            <p className="text-sm leading-relaxed" style={{ color: "rgba(180,210,240,0.65)", fontWeight: 300 }}>Not a fixed programme. Your roadmap is calibrated to your predicted score — every session targets the exact skills that move your band fastest.</p>
            <div className="flex-1"><StudyPlanMockup /></div>
          </div>
        </div>

        {/* ── STEP 2 ── */}
        <StepDivider num="STEP 2" label="Study with expert materials — built for IELTS" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-16">
          <div className="rounded-2xl p-6 flex flex-col" style={{ background: "#FFFCF5", minHeight: 480 }}>
            <span className="text-xs font-bold tracking-widest mb-4" style={{ color: "#B8860B" }}>04</span>
            <h3 className="text-xl mb-2" style={{ fontWeight: 600, color: "#0A1C40" }}>Research-backed notes</h3>
            <p className="text-sm leading-relaxed" style={{ color: "#3A5878", fontWeight: 300 }}>Structured grammar and strategy notes written by 8.5+ scorers — worked examples and examiner tips baked in.</p>
            <div className="flex-1"><RevisionNotesMockup /></div>
          </div>
          <div className="rounded-2xl p-6 flex flex-col" style={{ background: "#F2FBFF", minHeight: 480 }}>
            <span className="text-xs font-bold tracking-widest mb-4" style={{ color: "#185688" }}>05</span>
            <h3 className="text-xl mb-2" style={{ fontWeight: 600, color: "#0A1C40" }}>Grammar flashcards</h3>
            <p className="text-sm leading-relaxed" style={{ color: "#3A5878", fontWeight: 300 }}>Flip-card drilling on the exact grammar rules tested in IELTS. Tap the card below.</p>
            <div className="flex-1"><FlashcardMockup /></div>
          </div>
          <div className="rounded-2xl p-6 flex flex-col" style={{ background: "#0A1C40", minHeight: 480 }}>
            <span className="text-xs font-bold tracking-widest mb-4" style={{ color: "#6ECEF5" }}>06</span>
            <h3 className="text-xl mb-2" style={{ fontWeight: 600, color: "#F0F8FF" }}>Interactive tutorials</h3>
            <p className="text-sm leading-relaxed" style={{ color: "rgba(180,210,240,0.65)", fontWeight: 300 }}>Step-by-step guided slides for every IELTS strategy. Click through below to experience the real thing.</p>
            <div className="flex-1"><TutorialMockup /></div>
          </div>
        </div>

        {/* ── STEP 3 ── */}
        <StepDivider num="STEP 3" label="Practice under real exam conditions" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

          <div className="rounded-2xl p-6 flex flex-col" style={{ background: "#EBF7FF", minHeight: 500 }}>
            <span className="text-xs font-bold tracking-widest mb-4" style={{ color: "#48A8CC" }}>07</span>
            <h3 className="text-xl mb-2" style={{ fontWeight: 600, color: "#0A1C40" }}>Reading</h3>
            <p className="text-sm leading-relaxed" style={{ color: "#3A5878", fontWeight: 300 }}>Timed passages with True/False/Not Given, matching, and gap fill. See exactly which answers were wrong and why — then fix them.</p>
            <div className="flex-1"><ReadingSliderMockup /></div>
          </div>

          <div className="rounded-2xl p-6 flex flex-col" style={{ background: "#DDF0F8", minHeight: 500 }}>
            <span className="text-xs font-bold tracking-widest mb-4" style={{ color: "#185688" }}>08</span>
            <h3 className="text-xl mb-2" style={{ fontWeight: 600, color: "#0A1C40" }}>Listening</h3>
            <p className="text-sm leading-relaxed" style={{ color: "#3A5878", fontWeight: 300 }}>Authentic audio, note-completion blanks, and instant answer review — train your ear under real exam pressure.</p>
            <div className="flex-1"><ListeningMockup /></div>
          </div>

          <div className="rounded-2xl p-6 flex flex-col" style={{ background: "#0E3860", minHeight: 500 }}>
            <span className="text-xs font-bold tracking-widest mb-4" style={{ color: "#6ECEF5" }}>09</span>
            <h3 className="text-xl mb-2" style={{ fontWeight: 600, color: "#F0F8FF" }}>Writing</h3>
            <p className="text-sm leading-relaxed" style={{ color: "rgba(180,210,240,0.65)", fontWeight: 300 }}>AI marks your essay, scores every criterion, and tells you the exact two things to fix next — like a real examiner, instant.</p>
            <div className="flex-1"><WritingSliderMockup /></div>
          </div>

          <div className="rounded-2xl p-6 flex flex-col" style={{ background: "#0A1C40", minHeight: 500 }}>
            <span className="text-xs font-bold tracking-widest mb-4" style={{ color: "#6ECEF5" }}>10</span>
            <h3 className="text-xl mb-2" style={{ fontWeight: 600, color: "#F0F8FF" }}>Speaking</h3>
            <p className="text-sm leading-relaxed" style={{ color: "rgba(180,210,240,0.65)", fontWeight: 300 }}>Record your answer, get live transcription, and receive instant pronunciation and fluency feedback from your AI coach.</p>
            <div className="flex-1"><SpeakingMockup /></div>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-14 text-center">
          <button
            onClick={() => navigate("/auth?mode=signup")}
            className="relative overflow-hidden inline-flex items-center gap-2 px-8 py-3.5 rounded-full font-semibold text-sm text-white transition-transform hover:scale-105 active:scale-95"
            style={{ background: "linear-gradient(135deg, #48A8CC 0%, #0E3860 100%)", animation: "btnGlow 2.6s ease-in-out infinite" }}
          >
            <span aria-hidden className="pointer-events-none absolute inset-0"
                  style={{ background: "linear-gradient(105deg, transparent 35%, rgba(255,255,255,0.28) 50%, transparent 65%)", animation: "btnShimmer 2.8s ease-in-out infinite", animationDelay: "0.5s" }} />
            Start free — takes 2 minutes
            <ArrowRight className="w-4 h-4" />
          </button>
          <p className="mt-3 text-xs" style={{ color: "#7A95B0" }}>No credit card · Free diagnostic included</p>
        </div>

      </div>
    </section>
  );
};
