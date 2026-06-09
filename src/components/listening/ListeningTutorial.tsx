import { useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronRight, ChevronLeft, CheckCircle, X,
  Volume2, AlertCircle, Lightbulb,
} from "lucide-react";
import { cn } from "@/lib/utils";

// ─── motion ──────────────────────────────────────────────────
const slideVariants = {
  enter: (dir: number) => ({ x: dir > 0 ? "100%" : "-100%", opacity: 0 }),
  center: { x: 0, opacity: 1, transition: { duration: 0.36, ease: [0.25, 0.46, 0.45, 0.94] as const } },
  exit: (dir: number) => ({ x: dir < 0 ? "100%" : "-100%", opacity: 0, transition: { duration: 0.26, ease: "easeIn" } }),
};

// ─── shared primitives ────────────────────────────────────────
function Pill({ label, color = "blue" }: { label: string; color?: "blue" | "green" | "amber" | "purple" | "red" | "sky" }) {
  const cls: Record<string, string> = {
    blue:   "bg-blue-100 text-blue-700 border-blue-300",
    green:  "bg-green-100 text-green-700 border-green-300",
    amber:  "bg-amber-100 text-amber-700 border-amber-300",
    purple: "bg-purple-100 text-purple-700 border-purple-300",
    red:    "bg-red-100 text-red-700 border-red-300",
    sky:    "bg-sky-100 text-sky-700 border-sky-300",
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

// Dark-styled block simulating an audio transcript
function Transcript({ label = "Audio Transcript", children }: { label?: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-gray-700 bg-gray-900 overflow-hidden">
      <div className="flex items-center gap-2 px-4 py-2 bg-gray-800 border-b border-gray-700">
        <Volume2 className="w-3.5 h-3.5 text-emerald-400" />
        <span className="text-[10px] uppercase tracking-widest font-mono text-emerald-400">{label}</span>
      </div>
      <div className="p-4 space-y-2.5">{children}</div>
    </div>
  );
}

const SPEAKER_COLORS: Record<string, string> = {
  Agent:    "text-emerald-400",
  Caller:   "text-sky-400",
  Tom:      "text-violet-400",
  Lisa:     "text-pink-400",
  Lecturer: "text-amber-400",
  Guide:    "text-cyan-400",
};

function Speaker({ name, children }: { name: string; children: React.ReactNode }) {
  return (
    <p className="text-sm font-mono text-gray-200 leading-relaxed">
      <span className={cn("font-bold mr-2", SPEAKER_COLORS[name] ?? "text-gray-400")}>{name}:</span>
      {children}
    </p>
  );
}

// Inline mark inside a dark Transcript
function Mark({ children, color = "yellow" }: { children: React.ReactNode; color?: "yellow" | "green" | "red" }) {
  const cls = {
    yellow: "bg-yellow-300/20 text-yellow-200 rounded px-0.5",
    green:  "bg-emerald-400/20 text-emerald-300 rounded px-0.5",
    red:    "bg-red-400/20 text-red-300 rounded px-0.5 line-through",
  }[color];
  return <span className={cls}>{children}</span>;
}

// ─── SLIDE 0 — 4 Sections ────────────────────────────────────
function Slide0Sections({ onComplete }: { onComplete: () => void }) {
  const [open, setOpen] = useState<number[]>([]);

  const sections = [
    {
      n: 1, color: "sky" as const,
      title: "Everyday Conversation",
      context: "Two people in a social/everyday situation — booking, enquiry, lost property",
      types: "Form completion, Note completion",
      tip: "Speakers often change their mind. Always write the FINAL answer.",
    },
    {
      n: 2, color: "green" as const,
      title: "Social Monologue",
      context: "One person speaking about a public topic — tour guide, community announcement",
      types: "Map / plan labeling, Matching, Multiple choice",
      tip: "Follow directional words: left, opposite, next to, between, behind.",
    },
    {
      n: 3, color: "purple" as const,
      title: "Academic Conversation",
      context: "2–4 people in an educational or training context — students discussing a project",
      types: "Matching, Multiple choice, Sentence completion",
      tip: "Multiple speakers = more distractors. Track who says what and what the final decision is.",
    },
    {
      n: 4, color: "amber" as const,
      title: "Academic Lecture",
      context: "One person delivering a university-style lecture on an academic topic",
      types: "Note completion, Summary completion, Multiple choice",
      tip: "Hardest section. Dense academic vocabulary and a faster pace. Preview questions carefully.",
    },
  ];

  const numBg: Record<string, string> = {
    sky: "bg-sky-100 text-sky-700", green: "bg-green-100 text-green-700",
    purple: "bg-purple-100 text-purple-700", amber: "bg-amber-100 text-amber-700",
  };
  const cardBorder: Record<string, string> = {
    sky: "border-sky-200 bg-sky-50/60", green: "border-green-200 bg-green-50/60",
    purple: "border-purple-200 bg-purple-50/60", amber: "border-amber-200 bg-amber-50/60",
  };

  const toggle = (i: number) => {
    const next = open.includes(i) ? open.filter(x => x !== i) : [...open, i];
    setOpen(next);
    if (next.length === 4) onComplete();
  };

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-bold text-gray-800">The 4 Sections of IELTS Listening</h2>
        <p className="text-sm text-gray-500 mt-1">40 questions · 30 minutes audio + 10 minutes transfer time · Tap each section to learn more</p>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        {sections.map((s, i) => (
          <button
            key={i}
            onClick={() => toggle(i)}
            className={cn(
              "text-left rounded-xl border-2 p-4 transition-all hover:shadow-sm",
              cardBorder[s.color],
              open.includes(i) && "shadow-md"
            )}
          >
            <div className="flex items-center gap-3 mb-1">
              <span className={cn("w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0", numBg[s.color])}>
                {s.n}
              </span>
              <span className="font-semibold text-gray-800 text-sm flex-1">{s.title}</span>
              {open.includes(i) && <CheckCircle className="w-4 h-4 text-green-500 shrink-0" />}
            </div>
            <p className="text-xs text-gray-500 ml-10">{s.context}</p>
            {open.includes(i) && (
              <div className="mt-3 ml-10 space-y-2 text-sm">
                <p className="text-gray-600">
                  <span className="font-medium text-gray-700">Question types: </span>{s.types}
                </p>
                <div className="bg-white/80 rounded-lg p-2 text-xs text-gray-600 flex gap-1.5 border border-white">
                  <span>💡</span><span>{s.tip}</span>
                </div>
              </div>
            )}
          </button>
        ))}
      </div>
      <Tip>The difficulty increases with each section. Sections 1 and 2 use everyday English; Sections 3 and 4 use academic English with complex vocabulary.</Tip>
    </div>
  );
}

// ─── SLIDE 1 — Golden Rules ───────────────────────────────────
function Slide1Rules({ onComplete }: { onComplete: () => void }) {
  const [open, setOpen] = useState<number[]>([]);

  const rules = [
    {
      code: "01", color: "sky" as const,
      title: "Use your preview time",
      body: "Before each section begins, you get 30 seconds to read the questions. Use every second. Identify the question type, predict the answer type (name? number? day?), and underline key words in the question. This primes your brain to catch the right words when the audio plays.",
      example: 'Question: "What time does the shop close?" → You know to listen for a time. Ready for: "nine o\'clock", "9 PM", "half past eight", etc.',
    },
    {
      code: "02", color: "green" as const,
      title: "Expect paraphrase — always",
      body: 'The questions never use the exact same words as the recording. The speaker says "affordable" — the question says "cheap". The speaker says "the journey takes two hours" — the question says "How long is the trip?" You must bridge that gap in real time.',
      example: '"The tour begins at the northern entrance." → Question: "Where does the tour start?"',
    },
    {
      code: "03", color: "amber" as const,
      title: "Spelling and word limits matter",
      body: 'A misspelled answer is marked wrong — even if the meaning is right. "Fourty" instead of "forty" = zero marks. Word limits are also strict: "NO MORE THAN TWO WORDS" means 3 words = wrong, even if the content is correct. Articles count: "a monthly plan" = 3 words.',
      example: '"Write NO MORE THAN TWO WORDS: the membership type is ____" → Write: monthly subscription (not "a monthly subscription")',
    },
  ];

  const pillCls: Record<string, string> = {
    sky: "bg-sky-100 text-sky-700", green: "bg-green-100 text-green-700", amber: "bg-amber-100 text-amber-700",
  };
  const cardCls: Record<string, string> = {
    sky: "border-sky-200 bg-sky-50/60", green: "border-green-200 bg-green-50/60", amber: "border-amber-200 bg-amber-50/60",
  };

  const toggle = (i: number) => {
    const next = open.includes(i) ? open.filter(x => x !== i) : [...open, i];
    setOpen(next);
    if (next.length === 3) onComplete();
  };

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-bold text-gray-800">3 Golden Rules</h2>
        <p className="text-sm text-gray-500 mt-1">Master these before worrying about question types. Tap each rule to expand.</p>
      </div>
      <div className="space-y-3">
        {rules.map((r, i) => (
          <button
            key={i}
            onClick={() => toggle(i)}
            className={cn("w-full text-left rounded-xl border-2 p-4 transition-all hover:shadow-sm", cardCls[r.color])}
          >
            <div className="flex items-center gap-3">
              <span className={cn("px-2 py-0.5 rounded text-xs font-bold font-mono", pillCls[r.color])}>{r.code}</span>
              <span className="font-semibold text-gray-800 text-sm flex-1">{r.title}</span>
              {open.includes(i) && <CheckCircle className="w-4 h-4 text-green-500 shrink-0" />}
            </div>
            {open.includes(i) && (
              <div className="mt-3 space-y-2 text-sm text-gray-600">
                <p>{r.body}</p>
                <div className="bg-white/80 rounded-lg p-2 text-xs border border-white">
                  <span className="font-medium text-gray-700">Example: </span>{r.example}
                </div>
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── SLIDE 2 — Paraphrase Training ───────────────────────────
function Slide2Paraphrase({ onComplete }: { onComplete: () => void }) {
  const [shown, setShown] = useState<Record<number, boolean>>({});

  const pairs = [
    {
      question: "Why did the customer complain?",
      audio: "The guest was deeply disappointed — her room wasn't ready when she arrived.",
      bridge: "complain → disappointed / arrived → when she arrived",
    },
    {
      question: "What is the cheapest option available?",
      audio: "The most affordable package is the basic plan at fifteen dollars a month.",
      bridge: "cheapest → most affordable",
    },
    {
      question: "When does the office close?",
      audio: "We wrap up at half past five every weekday.",
      bridge: "close → wrap up / when → half past five",
    },
    {
      question: "What skill does the lecturer emphasise?",
      audio: "The professor stressed the importance of critical thinking throughout the course.",
      bridge: "emphasise → stressed",
    },
  ];

  const reveal = (i: number) => {
    const next = { ...shown, [i]: true };
    setShown(next);
    if (Object.keys(next).length === pairs.length) onComplete();
  };

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-bold text-gray-800">Paraphrase Training</h2>
        <p className="text-sm text-gray-500 mt-1">
          The recording never uses the question's exact words. See each paraphrase revealed — then train yourself to spot the pattern.
        </p>
      </div>
      <div className="space-y-3">
        {pairs.map((p, i) => (
          <div key={i} className="rounded-xl border border-gray-200 bg-gray-50 p-4 space-y-3">
            <div className="space-y-1">
              <p className="text-[10px] font-semibold uppercase tracking-wide text-gray-400">Question says</p>
              <p className="text-sm font-medium text-gray-800 bg-white rounded-lg px-3 py-2 border border-gray-200">
                "{p.question}"
              </p>
            </div>
            {shown[i] ? (
              <div className="space-y-2">
                <p className="text-[10px] font-semibold uppercase tracking-wide text-emerald-600">You hear</p>
                <p className="text-sm text-gray-700 bg-emerald-50 rounded-lg px-3 py-2 border border-emerald-200">
                  "{p.audio}"
                </p>
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-[10px] text-gray-400 uppercase tracking-wide">Paraphrase key:</span>
                  <span className="bg-yellow-100 text-yellow-700 border border-yellow-200 px-2 py-0.5 rounded text-xs font-mono">{p.bridge}</span>
                </div>
              </div>
            ) : (
              <button
                onClick={() => reveal(i)}
                className="text-xs font-medium text-sky-600 hover:text-sky-800 underline underline-offset-2"
              >
                → Reveal how this sounds in the recording
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── SLIDE 3 — Distractor Alert ──────────────────────────────
function Slide3Distractors({ onComplete }: { onComplete: () => void }) {
  const [choice, setChoice] = useState<string | null>(null);
  const [confirmed, setConfirmed] = useState(false);

  const correct = "B";

  const confirm = () => {
    if (!choice) return;
    setConfirmed(true);
    if (choice === correct) onComplete();
  };

  const opts = [
    { val: "A", text: "Tuesday" },
    { val: "B", text: "Thursday" },
    { val: "C", text: "Friday" },
  ];

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-bold text-gray-800">Distractor Alert</h2>
        <p className="text-sm text-gray-500 mt-1">
          Speakers often mention something and then change their mind. Always write the FINAL answer — not the first one you hear.
        </p>
      </div>

      <div className="flex items-start gap-2 p-3 rounded-xl bg-orange-50 border border-orange-200 text-sm text-orange-800">
        <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-orange-500" />
        <span>Read the question below, then study the transcript — watch for the trap.</span>
      </div>

      <div className="rounded-xl border border-gray-200 bg-gray-50 p-4 space-y-3">
        <p className="text-sm font-semibold text-gray-700">Question: On which day would the caller like to book the appointment?</p>
        <div className="space-y-1.5">
          {opts.map(o => (
            <button
              key={o.val}
              onClick={() => !confirmed && setChoice(o.val)}
              className={cn(
                "w-full text-left px-3 py-2 rounded-lg border text-sm transition-all",
                !confirmed && choice === o.val && "border-sky-400 bg-sky-50 text-sky-800",
                !confirmed && choice !== o.val && "border-gray-200 bg-white hover:border-gray-300",
                confirmed && o.val === correct && "border-green-400 bg-green-50 text-green-800 font-medium",
                confirmed && choice === o.val && o.val !== correct && "border-red-400 bg-red-50 text-red-800",
                confirmed && choice !== o.val && o.val !== correct && "border-gray-200 bg-white opacity-50",
              )}
            >
              {o.val}) {o.text}
            </button>
          ))}
        </div>
      </div>

      <Transcript>
        <Speaker name="Agent">Good afternoon, City Dental. How can I help?</Speaker>
        <Speaker name="Caller">
          Hi, I'd like to book a check-up. Is{" "}
          <Mark color="red">Tuesday</Mark> available?
        </Speaker>
        <Speaker name="Agent">Let me check… Tuesday is fully booked I'm afraid. How about Thursday?</Speaker>
        <Speaker name="Caller">
          Thursday… yes. Actually — could you do <Mark color="red">Friday</Mark> instead? No,
          you know what, <Mark color="green">Thursday is fine</Mark>. I'll take Thursday.
        </Speaker>
        <Speaker name="Agent">Perfect. Thursday it is.</Speaker>
      </Transcript>

      {!confirmed ? (
        <button
          onClick={confirm}
          disabled={!choice}
          className={cn(
            "w-full py-2.5 rounded-xl text-sm font-semibold transition-all",
            choice ? "bg-sky-600 text-white hover:bg-sky-700" : "bg-gray-100 text-gray-400 cursor-not-allowed"
          )}
        >
          Confirm Answer
        </button>
      ) : (
        <div className={cn(
          "rounded-xl p-4 text-sm space-y-1.5",
          choice === correct ? "bg-green-50 border border-green-200 text-green-800" : "bg-red-50 border border-red-200 text-red-800"
        )}>
          <p className="font-semibold">{choice === correct ? "Correct — Thursday (B)" : "Answer: Thursday (B)"}</p>
          <p>Tuesday and Friday were both mentioned but rejected. The caller's confirmed final choice was Thursday. Red highlights show distractors; green shows the answer.</p>
        </div>
      )}
    </div>
  );
}

// ─── SLIDE 4 — Form Completion ───────────────────────────────
function Slide4FormCompletion({ onComplete }: { onComplete: () => void }) {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [checked, setChecked] = useState(false);
  const [results, setResults] = useState<Record<string, boolean>>({});

  const fields: { id: string; label: string; unit?: string; accepted: string[] }[] = [
    { id: "name",       label: "Surname",                  accepted: ["mitchell"] },
    { id: "phone",      label: "Phone number",             accepted: ["07891 442 350", "07891442350"] },
    { id: "membership", label: "Membership type",          accepted: ["monthly"] },
    { id: "source",     label: "How heard about gym",      accepted: ["colleague"] },
  ];

  const checkAnswers = () => {
    const r: Record<string, boolean> = {};
    fields.forEach(f => {
      const val = (answers[f.id] ?? "").toLowerCase().trim();
      r[f.id] = f.accepted.some(a => val === a.toLowerCase() || val === a.toLowerCase().replace(/\s/g, ""));
    });
    setResults(r);
    setChecked(true);
    if (Object.values(r).every(Boolean)) onComplete();
  };

  const allFilled = fields.every(f => (answers[f.id] ?? "").trim().length > 0);
  const numCorrect = Object.values(results).filter(Boolean).length;

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-bold text-gray-800">Form Completion — Section 1</h2>
        <p className="text-sm text-gray-500 mt-1">Read the form, study the transcript, fill in the gaps. Write NO MORE THAN TWO WORDS AND/OR A NUMBER.</p>
      </div>

      <Transcript>
        <Speaker name="Agent">Good morning, FitLife Gym. How can I help you?</Speaker>
        <Speaker name="Caller">Hi, I'd like to enquire about membership. My name is Sarah <Mark>Mitchell</Mark>.</Speaker>
        <Speaker name="Agent">And your contact number?</Speaker>
        <Speaker name="Caller">It's <Mark>07891 442 350</Mark>.</Speaker>
        <Speaker name="Agent">Which membership are you interested in?</Speaker>
        <Speaker name="Caller">
          The <Mark color="red">annual</Mark> one — sorry, I mean the <Mark color="green">monthly</Mark> membership.
        </Speaker>
        <Speaker name="Agent">And how did you hear about us?</Speaker>
        <Speaker name="Caller">My <Mark>colleague</Mark> recommended you.</Speaker>
      </Transcript>

      <div className="rounded-xl border border-gray-200 bg-white p-4 space-y-3">
        <p className="text-[10px] font-semibold uppercase tracking-wide text-gray-400">FitLife Gym — Membership Enquiry Form</p>
        {fields.map(f => (
          <div key={f.id} className="flex items-center gap-3 flex-wrap">
            <label className="text-sm text-gray-600 w-44 shrink-0">{f.label}:</label>
            <div className="flex items-center gap-2 flex-1 min-w-[140px]">
              <input
                type="text"
                value={answers[f.id] ?? ""}
                onChange={e => !checked && setAnswers(a => ({ ...a, [f.id]: e.target.value }))}
                disabled={checked}
                placeholder="type your answer"
                className={cn(
                  "border rounded-lg px-3 py-1.5 text-sm w-full max-w-[180px] outline-none transition-all",
                  !checked && "border-gray-300 focus:border-sky-400",
                  checked && results[f.id] && "border-green-400 bg-green-50 text-green-800",
                  checked && !results[f.id] && "border-red-400 bg-red-50 text-red-800",
                )}
              />
              {checked && (
                results[f.id]
                  ? <CheckCircle className="w-4 h-4 text-green-500 shrink-0" />
                  : <span className="text-xs text-red-500 shrink-0 font-medium">→ {f.accepted[0]}</span>
              )}
            </div>
          </div>
        ))}
      </div>

      {!checked ? (
        <button
          onClick={checkAnswers}
          disabled={!allFilled}
          className={cn(
            "w-full py-2.5 rounded-xl text-sm font-semibold transition-all",
            allFilled ? "bg-sky-600 text-white hover:bg-sky-700" : "bg-gray-100 text-gray-400 cursor-not-allowed"
          )}
        >
          Check Answers
        </button>
      ) : (
        <div className="space-y-3">
          <div className={cn("rounded-xl p-3 text-sm",
            numCorrect === 4 ? "bg-green-50 border border-green-200 text-green-800" : "bg-amber-50 border border-amber-200 text-amber-800"
          )}>
            {numCorrect === 4
              ? "All correct! Notice the distractor on membership type — the caller said 'annual' first, then corrected to 'monthly'."
              : `${numCorrect}/4 correct. Correct answers appear in red on the right. Fix them and try again.`
            }
          </div>
          {numCorrect < 4 && (
            <button
              onClick={() => { setChecked(false); setResults({}); }}
              className="text-sm text-sky-600 hover:underline"
            >
              Try again
            </button>
          )}
        </div>
      )}

      {checked && numCorrect === 4 && (
        <Tip>Listen for correction signals: "sorry, I mean…", "actually…", "no wait…" — these always announce that the previous word was a distractor.</Tip>
      )}
    </div>
  );
}

// ─── SLIDE 5 — Multiple Choice ────────────────────────────────
function Slide5MultipleChoice({ onComplete }: { onComplete: () => void }) {
  const [q1, setQ1] = useState<string | null>(null);
  const [q2, setQ2] = useState<string | null>(null);
  const [confirmed, setConfirmed] = useState(false);

  const q1Correct = "B";
  const q2Correct = "A";

  const confirm = () => {
    setConfirmed(true);
    if (q1 === q1Correct && q2 === q2Correct) onComplete();
  };

  const optBtn = (val: string, text: string, chosen: string | null, correctVal: string) => (
    <button
      key={val}
      onClick={() => {
        if (confirmed) return;
        if (chosen === q1) setQ1(val); else setQ2(val);
      }}
      className={cn(
        "w-full text-left px-3 py-2 rounded-lg border text-sm transition-all",
        !confirmed && chosen === val && "border-sky-400 bg-sky-50 text-sky-800",
        !confirmed && chosen !== val && "border-gray-200 bg-white hover:border-gray-300",
        confirmed && val === correctVal && "border-green-400 bg-green-50 text-green-800 font-medium",
        confirmed && chosen === val && val !== correctVal && "border-red-400 bg-red-50 text-red-800",
        confirmed && chosen !== val && val !== correctVal && "border-gray-200 bg-white opacity-50",
      )}
    >
      {val}) {text}
    </button>
  );

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-bold text-gray-800">Multiple Choice — Sections 2 & 3</h2>
        <p className="text-sm text-gray-500 mt-1">
          Several options are mentioned in the recording. Only one is the correct final answer. Watch for speakers changing their minds.
        </p>
      </div>

      <Transcript>
        <Speaker name="Tom">Should we focus on <Mark color="red">solar panels</Mark> or wind turbines for the energy section?</Speaker>
        <Speaker name="Lisa">
          I was thinking <Mark color="red">solar panels</Mark> at first, but actually <Mark color="green">wind turbines</Mark> fit our coastal location study better.
        </Speaker>
        <Speaker name="Tom">Good point — and they're cheaper to model too.</Speaker>
        <Speaker name="Lisa">Exactly. <Mark color="green">Wind turbines</Mark> it is.</Speaker>
        <Speaker name="Tom">
          What's the main goal? I assumed it was about <Mark color="red">reducing costs</Mark>, but the brief says something else.
        </Speaker>
        <Speaker name="Lisa">
          No — the primary objective is to <Mark color="green">reduce carbon emissions</Mark>. Cost is only a secondary concern.
        </Speaker>
      </Transcript>

      <div className="space-y-4">
        <div className="rounded-xl border border-gray-200 bg-gray-50 p-4 space-y-2">
          <p className="text-sm font-semibold text-gray-700">1. What type of energy do the students decide to focus on?</p>
          {[["A", "Solar panels"], ["B", "Wind turbines"], ["C", "Hydroelectric power"]].map(([val, text]) => (
            <button
              key={val}
              onClick={() => !confirmed && setQ1(val)}
              className={cn(
                "w-full text-left px-3 py-2 rounded-lg border text-sm transition-all",
                !confirmed && q1 === val && "border-sky-400 bg-sky-50 text-sky-800",
                !confirmed && q1 !== val && "border-gray-200 bg-white hover:border-gray-300",
                confirmed && val === q1Correct && "border-green-400 bg-green-50 text-green-800 font-medium",
                confirmed && q1 === val && val !== q1Correct && "border-red-400 bg-red-50 text-red-800",
                confirmed && q1 !== val && val !== q1Correct && "border-gray-200 bg-white opacity-50",
              )}
            >
              {val}) {text}
            </button>
          ))}
        </div>

        <div className="rounded-xl border border-gray-200 bg-gray-50 p-4 space-y-2">
          <p className="text-sm font-semibold text-gray-700">2. What is the primary objective of the assignment?</p>
          {[["A", "Reduce carbon emissions"], ["B", "Reduce costs"], ["C", "Improve energy efficiency"]].map(([val, text]) => (
            <button
              key={val}
              onClick={() => !confirmed && setQ2(val)}
              className={cn(
                "w-full text-left px-3 py-2 rounded-lg border text-sm transition-all",
                !confirmed && q2 === val && "border-sky-400 bg-sky-50 text-sky-800",
                !confirmed && q2 !== val && "border-gray-200 bg-white hover:border-gray-300",
                confirmed && val === q2Correct && "border-green-400 bg-green-50 text-green-800 font-medium",
                confirmed && q2 === val && val !== q2Correct && "border-red-400 bg-red-50 text-red-800",
                confirmed && q2 !== val && val !== q2Correct && "border-gray-200 bg-white opacity-50",
              )}
            >
              {val}) {text}
            </button>
          ))}
        </div>
      </div>

      {!confirmed ? (
        <button
          onClick={confirm}
          disabled={!q1 || !q2}
          className={cn(
            "w-full py-2.5 rounded-xl text-sm font-semibold transition-all",
            q1 && q2 ? "bg-sky-600 text-white hover:bg-sky-700" : "bg-gray-100 text-gray-400 cursor-not-allowed"
          )}
        >
          Check Answers
        </button>
      ) : (
        <div className={cn("rounded-xl p-4 text-sm space-y-1.5",
          q1 === q1Correct && q2 === q2Correct
            ? "bg-green-50 border border-green-200 text-green-800"
            : "bg-amber-50 border border-amber-200 text-amber-800"
        )}>
          <p className="font-semibold">{q1 === q1Correct && q2 === q2Correct ? "Both correct!" : "Review:"}</p>
          <p>Q1: Wind turbines (B) — Lisa proposed solar panels first, then settled on wind turbines. The first option mentioned is almost always a distractor.</p>
          <p>Q2: Reduce carbon emissions (A) — Tom assumed cost reduction, but Lisa corrected him with the actual objective from the brief.</p>
        </div>
      )}
    </div>
  );
}

// ─── SLIDE 6 — Note Completion ────────────────────────────────
function Slide6NoteCompletion({ onComplete }: { onComplete: () => void }) {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [checked, setChecked] = useState(false);
  const [results, setResults] = useState<Record<string, boolean>>({});

  const fields: { id: string; label: string; accepted: string[] }[] = [
    { id: "duration",  label: "Sensory memory lasts:",         accepted: ["1-2", "one or two", "one to two", "1 or 2", "a second", "1 or 2 seconds"] },
    { id: "capacity",  label: "Short-term memory holds about:", accepted: ["7", "seven"] },
    { id: "alias",     label: "Short-term memory also called:", accepted: ["working"] },
    { id: "mechanism", label: "Transfer mechanism:",           accepted: ["sleep"] },
  ];

  const checkAnswers = () => {
    const r: Record<string, boolean> = {};
    fields.forEach(f => {
      const val = (answers[f.id] ?? "").toLowerCase().trim();
      r[f.id] = f.accepted.some(a => val === a || val.startsWith(a) || a.startsWith(val));
    });
    setResults(r);
    setChecked(true);
    const n = Object.values(r).filter(Boolean).length;
    if (n >= 3) onComplete();
  };

  const allFilled = fields.every(f => (answers[f.id] ?? "").trim().length > 0);
  const numCorrect = Object.values(results).filter(Boolean).length;

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-bold text-gray-800">Note Completion — Section 4</h2>
        <p className="text-sm text-gray-500 mt-1">Academic lecture — the hardest section. Write NO MORE THAN TWO WORDS AND/OR A NUMBER for each gap.</p>
      </div>

      <Transcript label="Section 4 — Academic Lecture">
        <Speaker name="Lecturer">
          Today we examine three types of memory. First: sensory memory — it stores information for just{" "}
          <Mark>one or two seconds</Mark> before it fades completely.
        </Speaker>
        <Speaker name="Lecturer">
          Second: short-term memory, also referred to as <Mark>working memory</Mark>. Research shows it can hold approximately{" "}
          <Mark>seven</Mark> items at any one time, though this varies between individuals.
        </Speaker>
        <Speaker name="Lecturer">
          Finally, long-term memory can hold unlimited information for decades. And the key mechanism for transferring from short-term to long-term storage?{" "}
          <Mark>Sleep</Mark>. During sleep, the brain consolidates what we learned during the day.
        </Speaker>
      </Transcript>

      <div className="rounded-xl border-2 border-dashed border-gray-300 bg-white p-4 space-y-3">
        <p className="text-[10px] font-semibold uppercase tracking-wide text-gray-400">Lecture Notes — Types of Memory</p>
        {fields.map(f => (
          <div key={f.id} className="flex items-center gap-2 flex-wrap">
            <label className="text-sm text-gray-600 w-52 shrink-0">{f.label}</label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={answers[f.id] ?? ""}
                onChange={e => !checked && setAnswers(a => ({ ...a, [f.id]: e.target.value }))}
                disabled={checked}
                placeholder="answer"
                className={cn(
                  "border rounded-lg px-3 py-1.5 text-sm w-32 outline-none transition-all",
                  !checked && "border-gray-300 focus:border-sky-400",
                  checked && results[f.id] && "border-green-400 bg-green-50 text-green-800",
                  checked && !results[f.id] && "border-red-400 bg-red-50 text-red-800",
                )}
              />
              {checked && (
                results[f.id]
                  ? <CheckCircle className="w-4 h-4 text-green-500 shrink-0" />
                  : <span className="text-xs text-red-500 font-medium shrink-0">→ {f.accepted[0]}</span>
              )}
            </div>
          </div>
        ))}
      </div>

      {!checked ? (
        <button
          onClick={checkAnswers}
          disabled={!allFilled}
          className={cn(
            "w-full py-2.5 rounded-xl text-sm font-semibold transition-all",
            allFilled ? "bg-sky-600 text-white hover:bg-sky-700" : "bg-gray-100 text-gray-400 cursor-not-allowed"
          )}
        >
          Check Answers
        </button>
      ) : (
        <div className={cn("rounded-xl p-3 text-sm",
          numCorrect >= 3 ? "bg-green-50 border border-green-200 text-green-800" : "bg-amber-50 border border-amber-200 text-amber-800"
        )}>
          {numCorrect >= 3
            ? `${numCorrect}/4 correct — great work! Section 4 is the hardest section; missing one is still a strong result.`
            : `${numCorrect}/4 correct. Review the transcript and trace exactly where each answer appeared.`
          }
        </div>
      )}
    </div>
  );
}

// ─── SLIDE 7 — Map Labeling ──────────────────────────────────
function Slide7MapLabeling({ onComplete }: { onComplete: () => void }) {
  const [sel, setSel] = useState<Record<string, string>>({});
  const [checked, setChecked] = useState(false);
  const [results, setResults] = useState<Record<string, boolean>>({});

  const locations: { id: string; row: number; col: number; answer: string }[] = [
    { id: "A", row: 1, col: 0, answer: "Reception" },
    { id: "B", row: 1, col: 1, answer: "Café" },
    { id: "C", row: 0, col: 0, answer: "Library" },
    { id: "D", row: 0, col: 1, answer: "Study Room" },
  ];
  const options = ["Reception", "Café", "Library", "Study Room", "Staff Room", "Gym"];

  const checkAnswers = () => {
    const r: Record<string, boolean> = {};
    locations.forEach(l => { r[l.id] = sel[l.id] === l.answer; });
    setResults(r);
    setChecked(true);
    if (Object.values(r).filter(Boolean).length >= 3) onComplete();
  };

  const allFilled = locations.every(l => sel[l.id]);
  const numCorrect = Object.values(results).filter(Boolean).length;

  const grid: (typeof locations)[] = [[], []];
  locations.forEach(l => grid[l.row].push(l));
  grid.forEach(row => row.sort((a, b) => a.col - b.col));

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-bold text-gray-800">Map / Plan Labeling — Section 2</h2>
        <p className="text-sm text-gray-500 mt-1">
          A guide describes a building layout. Label each location (A–D) using the word bank below. Two options are distractors.
        </p>
      </div>

      <div className="flex items-start gap-2 p-3 rounded-xl bg-sky-50 border border-sky-200 text-sm text-sky-800">
        <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-sky-500" />
        <span>Strategy: identify the entrance first, then follow each directional word step by step (left, right, behind, straight ahead).</span>
      </div>

      <Transcript label="Section 2 — Community Centre Tour">
        <Speaker name="Guide">
          As you enter through the main entrance at the bottom of the building, the{" "}
          <Mark>reception desk</Mark> is immediately on your left.
        </Speaker>
        <Speaker name="Guide">
          Directly to your right — on the east side — you will find the <Mark>café</Mark>, perfect for grabbing a coffee before your session.
        </Speaker>
        <Speaker name="Guide">
          Head to the back of the building now. In the rear-left corner you will find the{" "}
          <Mark>library</Mark> — floor to ceiling shelves with an impressive collection.
        </Speaker>
        <Speaker name="Guide">
          And the <Mark>study room</Mark> is in the rear-right corner. It has twenty individual workstations, ideal for focused exam practice.
        </Speaker>
      </Transcript>

      {/* Floor plan grid */}
      <div className="space-y-2">
        <p className="text-[10px] font-semibold uppercase tracking-wide text-gray-400">Floor Plan — Community Centre</p>
        <div className="bg-gray-100 rounded-xl p-3 space-y-2">
          {/* Top row (rear of building) */}
          {grid.map((row, ri) => (
            <div key={ri} className="flex gap-2">
              {row.map(loc => (
                <div key={loc.id} className={cn(
                  "flex-1 rounded-xl border-2 p-3 text-center space-y-1.5 bg-white transition-all",
                  !checked && "border-gray-300",
                  checked && results[loc.id] && "border-green-400 bg-green-50",
                  checked && !results[loc.id] && "border-red-400 bg-red-50",
                )}>
                  <span className="text-xs font-bold text-gray-400 block">{loc.id}</span>
                  <select
                    value={sel[loc.id] ?? ""}
                    onChange={e => !checked && setSel(s => ({ ...s, [loc.id]: e.target.value }))}
                    disabled={checked}
                    className="w-full text-xs border border-gray-200 rounded-lg px-1.5 py-1 bg-white outline-none"
                  >
                    <option value="">— select —</option>
                    {options.map(o => <option key={o} value={o}>{o}</option>)}
                  </select>
                  {checked && !results[loc.id] && (
                    <p className="text-[11px] text-green-700 font-medium">→ {loc.answer}</p>
                  )}
                </div>
              ))}
            </div>
          ))}
          {/* Entrance indicator */}
          <div className="flex justify-center pt-1">
            <div className="bg-sky-100 border border-sky-300 rounded-lg px-4 py-1 text-xs text-sky-700 font-semibold">
              ↑ Main Entrance
            </div>
          </div>
        </div>
        <div className="flex flex-wrap gap-1.5 mt-1">
          <span className="text-[10px] text-gray-400 uppercase tracking-wide mr-1">Word bank:</span>
          {options.map(o => (
            <span key={o} className="text-xs bg-gray-100 border border-gray-200 text-gray-600 px-2 py-0.5 rounded">{o}</span>
          ))}
        </div>
      </div>

      {!checked ? (
        <button
          onClick={checkAnswers}
          disabled={!allFilled}
          className={cn(
            "w-full py-2.5 rounded-xl text-sm font-semibold transition-all",
            allFilled ? "bg-sky-600 text-white hover:bg-sky-700" : "bg-gray-100 text-gray-400 cursor-not-allowed"
          )}
        >
          Check Map Labels
        </button>
      ) : (
        <div className={cn("rounded-xl p-3 text-sm",
          numCorrect >= 3 ? "bg-green-50 border border-green-200 text-green-800" : "bg-amber-50 border border-amber-200 text-amber-800"
        )}>
          {numCorrect >= 3
            ? `${numCorrect}/4 correct. Key strategy: anchor at the entrance, then trace each directional word one step at a time.`
            : `${numCorrect}/4 — re-read the transcript and follow each direction from the entrance. Correct labels are shown in green.`
          }
        </div>
      )}
    </div>
  );
}

// ─── SLIDE 8 — Final Quiz ─────────────────────────────────────
function Slide8Quiz({ onComplete }: { onComplete: () => void }) {
  const questions = [
    {
      q: "How many sections does IELTS Listening have?",
      opts: ["3", "4", "5", "6"],
      answer: "4",
    },
    {
      q: 'The word limit is "NO MORE THAN TWO WORDS". Which answer is acceptable?',
      opts: ["a monthly plan", "monthly plan", "the monthly plan", "monthly planning"],
      answer: "monthly plan",
    },
    {
      q: 'A caller says "Could we do Tuesday? Actually no — Thursday." What do you write?',
      opts: ["Tuesday", "Thursday", "Tuesday or Thursday", "Wait for further confirmation"],
      answer: "Thursday",
    },
    {
      q: "Which section of IELTS Listening typically features a university lecture?",
      opts: ["Section 1", "Section 2", "Section 3", "Section 4"],
      answer: "Section 4",
    },
    {
      q: "What is the best use of the 30-second preview time before each section?",
      opts: [
        "Rest your ears and relax",
        "Read ahead and predict answer types",
        "Check spelling from the previous section",
        "Count the total questions remaining",
      ],
      answer: "Read ahead and predict answer types",
    },
  ];

  const [choices, setChoices] = useState<Record<number, string>>({});
  const [submitted, setSubmitted] = useState(false);

  const submit = () => {
    setSubmitted(true);
    const correct = questions.filter((q, i) => choices[i] === q.answer).length;
    if (correct >= 4) onComplete();
  };

  const numCorrect = submitted ? questions.filter((q, i) => choices[i] === q.answer).length : 0;

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-bold text-gray-800">Final Quiz</h2>
        <p className="text-sm text-gray-500 mt-1">5 questions covering everything you have learned. Score 4/5 to complete the tutorial.</p>
      </div>
      <div className="space-y-4">
        {questions.map((q, qi) => (
          <div key={qi} className="rounded-xl border border-gray-200 bg-gray-50 p-4 space-y-2">
            <p className="text-sm font-semibold text-gray-700">{qi + 1}. {q.q}</p>
            <div className="space-y-1.5">
              {q.opts.map(opt => {
                const chosen = choices[qi] === opt;
                const correct = opt === q.answer;
                return (
                  <button
                    key={opt}
                    onClick={() => !submitted && setChoices(c => ({ ...c, [qi]: opt }))}
                    className={cn(
                      "w-full text-left px-3 py-2 rounded-lg border text-sm transition-all",
                      !submitted && chosen && "border-sky-400 bg-sky-50 text-sky-800",
                      !submitted && !chosen && "border-gray-200 bg-white hover:border-gray-300",
                      submitted && correct && "border-green-400 bg-green-50 text-green-800 font-medium",
                      submitted && chosen && !correct && "border-red-400 bg-red-50 text-red-800",
                      submitted && !chosen && !correct && "border-gray-200 bg-white opacity-50",
                    )}
                  >
                    {opt}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {!submitted ? (
        <button
          onClick={submit}
          disabled={Object.keys(choices).length < questions.length}
          className={cn(
            "w-full py-2.5 rounded-xl text-sm font-semibold transition-all",
            Object.keys(choices).length === questions.length
              ? "bg-sky-600 text-white hover:bg-sky-700"
              : "bg-gray-100 text-gray-400 cursor-not-allowed"
          )}
        >
          Submit Quiz
        </button>
      ) : (
        <div className={cn(
          "rounded-xl p-5 text-center space-y-1",
          numCorrect >= 4 ? "bg-green-50 border border-green-200 text-green-800" : "bg-amber-50 border border-amber-200 text-amber-800"
        )}>
          <p className="text-3xl font-bold">{numCorrect}/5</p>
          <p className="text-sm">
            {numCorrect >= 4
              ? "Excellent — you have mastered the IELTS Listening fundamentals. Now apply these skills in the Listening module."
              : "Good effort. Review the slides on any topics you missed and try again to complete the tutorial."}
          </p>
        </div>
      )}
    </div>
  );
}

// ─── constants ────────────────────────────────────────────────
const SLIDE_TITLES = [
  "The 4 Sections",
  "Golden Rules",
  "Paraphrase Training",
  "Distractor Alert",
  "Form Completion",
  "Multiple Choice",
  "Note Completion",
  "Map Labeling",
  "Final Quiz",
];

const SECTION_LABELS = ["Sections", "Rules", "Paraphrase", "Distractors", "Form", "MCQ", "Notes", "Map", "Quiz"];

// ─── main export ──────────────────────────────────────────────
export function ListeningTutorial() {
  const [open, setOpen] = useState(false);
  const [slide, setSlide] = useState(0);
  const [direction, setDirection] = useState(1);
  const [completed, setCompleted] = useState<boolean[]>(Array(9).fill(false));

  const markComplete = (i: number) => {
    setCompleted(prev => {
      if (prev[i]) return prev;
      const next = [...prev];
      next[i] = true;
      return next;
    });
  };

  const canNext = completed[slide] && slide < 8;

  const go = (dir: number) => {
    setDirection(dir);
    setSlide(s => s + dir);
  };

  const jumpTo = (i: number) => {
    if (i === slide) return;
    if (i <= slide || completed[i]) {
      setDirection(i > slide ? 1 : -1);
      setSlide(i);
    }
  };

  const slides = [
    <Slide0Sections onComplete={() => markComplete(0)} />,
    <Slide1Rules    onComplete={() => markComplete(1)} />,
    <Slide2Paraphrase onComplete={() => markComplete(2)} />,
    <Slide3Distractors onComplete={() => markComplete(3)} />,
    <Slide4FormCompletion onComplete={() => markComplete(4)} />,
    <Slide5MultipleChoice onComplete={() => markComplete(5)} />,
    <Slide6NoteCompletion onComplete={() => markComplete(6)} />,
    <Slide7MapLabeling    onComplete={() => markComplete(7)} />,
    <Slide8Quiz           onComplete={() => markComplete(8)} />,
  ];

  const portal = open
    ? createPortal(
        <div className="fixed inset-0 z-[200] bg-white flex flex-col overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-3 border-b border-gray-200 bg-white shrink-0">
            <div className="flex items-center gap-3">
              <Volume2 className="w-5 h-5 text-sky-500" />
              <div>
                <p className="text-[10px] text-gray-400 uppercase tracking-widest font-medium">IELTS Listening · MudahinAja</p>
                <p className="text-sm font-semibold text-gray-800">{SLIDE_TITLES[slide]}</p>
              </div>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors"
              aria-label="Close tutorial"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          {/* Section label bar */}
          <div className="flex overflow-x-auto border-b border-gray-100 bg-gray-50 shrink-0">
            {SECTION_LABELS.map((label, i) => (
              <button
                key={i}
                onClick={() => jumpTo(i)}
                className={cn(
                  "px-4 py-2 text-xs font-medium whitespace-nowrap transition-colors border-b-2 shrink-0",
                  slide === i
                    ? "border-sky-500 text-sky-700 bg-sky-50"
                    : completed[i]
                    ? "border-green-300 text-green-600 hover:bg-green-50"
                    : i <= slide
                    ? "border-transparent text-gray-500 hover:bg-gray-100"
                    : "border-transparent text-gray-300 cursor-default"
                )}
              >
                {completed[i] ? "✓ " : ""}{label}
              </button>
            ))}
          </div>

          {/* Slide content */}
          <div className="flex-1 overflow-y-auto">
            <div className="relative max-w-2xl mx-auto px-6 py-8">
              <AnimatePresence custom={direction} mode="wait">
                <motion.div
                  key={slide}
                  custom={direction}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                >
                  {slides[slide]}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* Footer nav */}
          <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200 bg-white shrink-0">
            <button
              onClick={() => go(-1)}
              disabled={slide === 0}
              className={cn(
                "flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition-all",
                slide > 0 ? "text-gray-600 hover:bg-gray-100" : "text-gray-300 cursor-not-allowed"
              )}
            >
              <ChevronLeft className="w-4 h-4" /> Back
            </button>

            <div className="flex gap-1.5">
              {Array.from({ length: 9 }).map((_, i) => (
                <div
                  key={i}
                  className={cn(
                    "h-2 rounded-full transition-all",
                    i === slide ? "bg-sky-500 w-4" : completed[i] ? "bg-green-400 w-2" : "bg-gray-200 w-2"
                  )}
                />
              ))}
            </div>

            {slide < 8 ? (
              <button
                onClick={() => canNext && go(1)}
                disabled={!canNext}
                className={cn(
                  "flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition-all",
                  canNext ? "bg-sky-600 text-white hover:bg-sky-700" : "bg-gray-100 text-gray-400 cursor-not-allowed"
                )}
              >
                Next <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={() => setOpen(false)}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium bg-green-600 text-white hover:bg-green-700 transition-all"
              >
                <CheckCircle className="w-4 h-4" /> Finish
              </button>
            )}
          </div>
        </div>,
        document.body
      )
    : null;

  return (
    <>
      {portal}
      <div
        className="glass-card p-6 cursor-pointer hover:shadow-lg transition-all border border-sky-200/50"
        onClick={() => setOpen(true)}
      >
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-sky-100 flex items-center justify-center shrink-0">
            <Volume2 className="w-6 h-6 text-sky-600" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-foreground">IELTS Listening Tutorial</h3>
            <p className="text-sm text-muted-foreground mt-0.5">
              4 sections · Paraphrase · Distractors · Form · MC · Notes · Map labeling
            </p>
          </div>
          <ChevronRight className="w-5 h-5 text-muted-foreground" />
        </div>
      </div>
    </>
  );
}
