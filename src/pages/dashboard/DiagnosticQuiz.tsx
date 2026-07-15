import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import {
  BookOpen, PenTool, Headphones, Mic, ChevronRight,
  ChevronLeft, Check, Volume2, Loader2,
  Square, Star, CheckCircle, ArrowRight, Target, Trophy, Crown, Clock, Printer,
} from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend, ResponsiveContainer, Tooltip,
} from "recharts";

// ─── Types ──────────────────────────────────────────────────────────────────────

type Phase = "intro" | "reading" | "writing" | "listening" | "speaking" | "results";

// ─── Timer config (seconds) ─────────────────────────────────────────────────────

const MODULE_TIMES: Partial<Record<Phase, number>> = {
  reading:   15 * 60,
  writing:   20 * 60,
  listening:  8 * 60,
  speaking:  10 * 60,
};

const NEXT_PHASE: Partial<Record<Phase, Phase>> = {
  reading: "writing",
  writing: "listening",
  listening: "speaking",
  speaking: "results",
};

// ─── OpenAI TTS — exact same pattern as ListeningModule ─────────────────────────

const TTS_URL = import.meta.env.DEV
  ? "https://api.openai.com/v1/audio/speech"
  : "/api/tts";

async function fetchTTSBuffer(text: string, voice: string, signal: AbortSignal, attempt = 0): Promise<ArrayBuffer> {
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (import.meta.env.DEV) {
    const key = import.meta.env.VITE_OPENAI_API_KEY;
    if (!key) throw new Error("OpenAI API key not configured (VITE_OPENAI_API_KEY missing)");
    headers["Authorization"] = `Bearer ${key}`;
  }
  const res = await fetch(TTS_URL, {
    method: "POST", signal, headers,
    body: JSON.stringify({ model: "tts-1-hd", input: text.slice(0, 4096), voice, speed: 0.88 }),
  });
  if (res.status === 429 && attempt < 2) {
    await new Promise(r => setTimeout(r, 1000 * (attempt + 1)));
    return fetchTTSBuffer(text, voice, signal, attempt + 1);
  }
  if (!res.ok) { const err = await res.text().catch(() => ""); throw new Error(`TTS ${res.status}: ${err}`); }
  return res.arrayBuffer();
}

// ─── Listening script — speaker-labeled turns ─────────────────────────────────

type SpeakerTurn = { speaker: "OFFICER" | "STUDENT"; text: string };
const LISTENING_TURNS: SpeakerTurn[] = [
  { speaker: "OFFICER", text: "Good morning, University Admissions Office. How can I help you?" },
  { speaker: "STUDENT", text: "Oh hi, good morning. My name is Sarah Chen. I am calling to get some information about undergraduate enrollment for next year." },
  { speaker: "OFFICER", text: "Of course, Sarah. What faculty are you interested in?" },
  { speaker: "STUDENT", text: "I am mainly interested in Business, though I am also considering Engineering." },
  { speaker: "OFFICER", text: "Great choices. So for 2025, our Business faculty actually saw a slight decrease in enrollment. We currently have around eighteen thousand students enrolled, down from twenty thousand in the previous cycle. Engineering, on the other hand, has grown significantly to about twenty-two thousand." },
  { speaker: "STUDENT", text: "Interesting. And what are the admission requirements for Engineering?" },
  { speaker: "OFFICER", text: "For Engineering, you will need a minimum GPA of three point five. It is one of our more competitive faculties." },
  { speaker: "STUDENT", text: "What about the application deadline? Is it still in March?" },
  { speaker: "OFFICER", text: "The deadline is the fifteenth of April. We moved it back from March this year to give students more time." },
  { speaker: "STUDENT", text: "That is helpful. And I was wondering, does the Arts faculty offer any scholarships?" },
  { speaker: "OFFICER", text: "Yes, we do. The Arts faculty has a merit scholarship for outstanding applicants. It covers up to fifty percent of tuition fees." },
  { speaker: "STUDENT", text: "Oh, that is great! And what do I need to submit with my application?" },
  { speaker: "OFFICER", text: "You will need to submit a personal statement outlining your goals and why you want to study at our university." },
  { speaker: "STUDENT", text: "A personal statement, got it. Thank you so much for your help." },
  { speaker: "OFFICER", text: "You are welcome, Sarah. Good luck with your application!" },
];

// ─── Audio utilities (copied from ListeningModule) ───────────────────────────

function createSilenceBuffer(ctx: AudioContext, seconds: number): AudioBuffer {
  return ctx.createBuffer(1, Math.ceil(ctx.sampleRate * seconds), ctx.sampleRate);
}

function concatAudioBuffers(ctx: AudioContext, buffers: AudioBuffer[]): AudioBuffer {
  const total = buffers.reduce((s, b) => s + b.length, 0);
  const out = ctx.createBuffer(1, total, ctx.sampleRate);
  const outData = out.getChannelData(0);
  let offset = 0;
  for (const buf of buffers) {
    const ch0 = buf.getChannelData(0);
    if (buf.numberOfChannels > 1) {
      const ch1 = buf.getChannelData(1);
      for (let i = 0; i < buf.length; i++) outData[offset + i] = (ch0[i] + ch1[i]) / 2;
    } else {
      outData.set(ch0, offset);
    }
    offset += buf.length;
  }
  return out;
}

function encodeWav(audioBuffer: AudioBuffer): Blob {
  const sr = audioBuffer.sampleRate; const n = audioBuffer.length;
  const dataLen = n * 2; const buf = new ArrayBuffer(44 + dataLen);
  const v = new DataView(buf);
  const ws = (o: number, s: string) => { for (let i = 0; i < s.length; i++) v.setUint8(o + i, s.charCodeAt(i)); };
  ws(0, "RIFF"); v.setUint32(4, 36 + dataLen, true); ws(8, "WAVE");
  ws(12, "fmt "); v.setUint32(16, 16, true); v.setUint16(20, 1, true);
  v.setUint16(22, 1, true); v.setUint32(24, sr, true); v.setUint32(28, sr * 2, true);
  v.setUint16(32, 2, true); v.setUint16(34, 16, true);
  ws(36, "data"); v.setUint32(40, dataLen, true);
  const ch = audioBuffer.getChannelData(0); let off = 44;
  for (let i = 0; i < n; i++) {
    const s = Math.max(-1, Math.min(1, ch[i]));
    v.setInt16(off, s < 0 ? s * 0x8000 : s * 0x7fff, true); off += 2;
  }
  return new Blob([buf], { type: "audio/wav" });
}

async function generateListeningAudio(signal: AbortSignal): Promise<string> {
  const items = LISTENING_TURNS.map(t => ({
    text: t.text,
    voice: t.speaker === "OFFICER" ? "fable" : "nova",
  }));

  // Worker pool of 5 concurrent fetches — same pattern as ListeningModule
  const results: ArrayBuffer[] = new Array(items.length);
  let idx = 0;
  const worker = async () => {
    while (idx < items.length) {
      if (signal.aborted) throw new DOMException("Aborted", "AbortError");
      const i = idx++;
      results[i] = await fetchTTSBuffer(items[i].text, items[i].voice, signal);
    }
  };
  await Promise.all(Array.from({ length: 5 }, worker));

  const ctx = new AudioContext();
  const decoded = await Promise.all(results.map(buf => ctx.decodeAudioData(buf)));
  const parts: AudioBuffer[] = [];
  for (const d of decoded) { parts.push(d); parts.push(createSilenceBuffer(ctx, 0.4)); }
  const combined = concatAudioBuffers(ctx, parts);
  const wav = encodeWav(combined);
  await ctx.close();
  return URL.createObjectURL(wav);
}

// ─── Reading data ─────────────────────────────────────────────────────────────

const READING_PASSAGE = `Cooling the Concrete Jungle: The Urban Heat Island Effect

A. Anyone who has stepped from a shaded park onto a sun-baked pavement on a summer afternoon has experienced, in miniature, what scientists call the urban heat island (UHI) effect. Cities are consistently warmer than the rural areas that surround them, sometimes by as much as 7°C during the evening hours. This temperature disparity is not simply a matter of comfort; it has measurable consequences for public health, energy consumption and the long-term liveability of the world's rapidly growing metropolitan areas.

B. The primary driver of the effect is the replacement of natural land cover with dense concentrations of pavement, buildings and other surfaces that absorb and retain heat. Unlike vegetation and soil, which release stored moisture through evaporation and thereby cool the surrounding air, materials such as asphalt and concrete radiate absorbed heat back into the atmosphere well after sunset. Compounding this, the tall, closely spaced buildings that characterise many downtown districts trap heat at street level and obstruct the cooling effect of wind, a phenomenon urban planners refer to as the "canyon effect". Waste heat from vehicles, air conditioning units and industrial processes adds a further, human-generated layer to the problem.

C. The consequences extend well beyond discomfort. Elevated urban temperatures increase demand for air conditioning, which in turn raises electricity consumption and strains power grids during peak summer periods. Higher temperatures also worsen air quality by accelerating the formation of ground-level ozone, a pollutant linked to respiratory illness. Perhaps most seriously, prolonged exposure to extreme urban heat has been associated with increased mortality among elderly residents and those with pre-existing health conditions, particularly during heatwaves when night-time temperatures fail to drop to levels that allow the body to recover.

D. Research conducted in several major cities has quantified the scale of the problem. A study of Phoenix, Arizona, found that its urban core could be up to 10°C warmer than its desert surroundings on a summer night. Similarly, satellite thermal imaging of Tokyo revealed that the city's average temperature had risen by nearly 3°C over the past century, a rate significantly higher than the global average attributable to climate change alone. These findings suggest that local urban design decisions, not merely broader atmospheric trends, play a substantial role in the temperatures city residents actually experience.

E. In response, architects and city planners have begun experimenting with a range of countermeasures. Green roofs, in which building rooftops are partially or fully covered with vegetation, have been shown to lower surface temperatures by absorbing solar radiation rather than reflecting it as heat. "Cool pavements", made from reflective or permeable materials, reduce the amount of solar energy retained by road surfaces. Perhaps the most cost-effective measure is simply planting more trees: a single mature tree can lower nearby air temperatures by several degrees through shading and transpiration, while also improving air quality.

F. Despite the evident benefits, implementing these solutions at scale is far from straightforward. Green infrastructure requires ongoing maintenance and upfront investment that many municipal budgets struggle to accommodate, and retrofitting older buildings is often more expensive than incorporating such features into new construction. There is also debate among urban planners over which interventions offer the best return, with some arguing that policy should prioritise large-scale tree-planting programmes over technically complex architectural solutions. What is broadly agreed upon, however, is that as urban populations continue to grow, the urban heat island effect will only intensify unless it is addressed as a core consideration in city design, rather than an afterthought.`;

const HEADING_OPTIONS = [
  { id: "i",    text: "The financial and political obstacles to change" },
  { id: "ii",   text: "A worldwide comparison of temperature records" },
  { id: "iii",  text: "Defining a citywide phenomenon" },
  { id: "iv",   text: "The human and structural sources of excess heat" },
  { id: "v",    text: "Effects on human wellbeing and infrastructure" },
  { id: "vi",   text: "Evidence from specific cities" },
  { id: "vii",  text: "Practical solutions being trialled" },
  { id: "viii", text: "A call for stronger environmental regulation" },
];

const READING_CORRECT: Record<string, string> = {
  q1: "iv", q2: "vi", q3: "i",
  q4: "TRUE", q5: "FALSE", q6: "NOT GIVEN",
  q7: "canyon effect", q8: "trees",
  q9: "C", q10: "C",
};

// ─── Writing data ─────────────────────────────────────────────────────────────

const CHART_DATA = [
  { faculty: "Engineering", "2015": 15, "2025": 22 },
  { faculty: "Business",    "2015": 20, "2025": 18 },
  { faculty: "Arts",        "2015": 8,  "2025": 12 },
];

const T1_PROMPT = "The chart below shows the number of students enrolled in three university faculties in Indonesia in 2015 and 2025. Summarise the information by selecting and reporting the main features, and make comparisons where relevant. Write at least 100 words.";
const T2_PROMPT = "Some people believe that university education should be free for all students, while others think students should pay for their own tuition. Discuss both views and give your own opinion. Write at least 150 words.";

// ─── Listening data ───────────────────────────────────────────────────────────

interface LQ { id: string; text: string; options: string[]; answer: string; }
const LISTENING_QUESTIONS: LQ[] = [
  { id: "l1", text: "Which faculty is Sarah primarily interested in?", options: ["Engineering", "Business", "Arts", "Science"], answer: "B" },
  { id: "l2", text: "How many students are currently enrolled in Business in 2025?", options: ["15,000", "18,000", "20,000", "22,000"], answer: "B" },
  { id: "l3", text: "What is the application deadline?", options: ["15 March", "31 March", "15 April", "30 April"], answer: "C" },
  { id: "l4", text: "What is the minimum GPA requirement for Engineering?", options: ["3.2", "3.5", "3.7", "3.8"], answer: "B" },
  { id: "l5", text: "Does the Arts faculty offer financial support to students?", options: ["Yes, full scholarships", "Yes, merit scholarships covering up to 50%", "No scholarships available", "Only loans"], answer: "B" },
  { id: "l6", text: "What document must Sarah submit with her application?", options: ["Two reference letters", "A portfolio", "A personal statement", "Academic transcripts"], answer: "C" },
];

// ─── Speaking data ────────────────────────────────────────────────────────────

const SPEAKING_QS = [
  { id: "s1", part: "Part 1 — Interview",  text: "Tell me about your educational background. What did you study, and where?" },
  { id: "s2", part: "Part 2 — Long Turn",  text: "Do you think university education should be free for all students? Why or why not? Please speak for about 1–2 minutes." },
  { id: "s3", part: "Part 3 — Discussion", text: "How do you think technology has changed the way people learn in recent years? What are the advantages and disadvantages?" },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────

const OPTION_LETTERS = ["A", "B", "C", "D"];

function readingScore(answers: Record<string, string>): number {
  let score = 0;
  for (const [q, correct] of Object.entries(READING_CORRECT)) {
    const given = (answers[q] ?? "").trim().toLowerCase();
    const exp   = correct.toLowerCase();
    if (q === "q7" || q === "q8") { if (given.includes(exp) || exp.includes(given)) score++; }
    else { if (given === exp) score++; }
  }
  return score;
}

function listeningScore(answers: Record<string, string>): number {
  return LISTENING_QUESTIONS.filter(q => (answers[q.id] ?? "") === q.answer).length;
}

// Real IELTS Academic Reading band conversion (scaled from 40 → 10 questions)
function readingBandFromScore(score: number): number {
  const table: [number, number][] = [
    [10, 9.0], [9, 8.5], [8, 7.5], [7, 7.0], [6, 6.5],
    [5, 5.5],  [4, 4.5], [3, 3.5], [2, 3.0], [1, 2.0], [0, 1.0],
  ];
  return table.find(([s]) => score >= s)?.[1] ?? 0;
}

// Real IELTS Listening band conversion (scaled from 40 → 6 questions)
function listeningBandFromScore(score: number): number {
  const table: [number, number][] = [
    [6, 9.0], [5, 7.5], [4, 6.5], [3, 5.5], [2, 4.0], [1, 2.5], [0, 1.0],
  ];
  return table.find(([s]) => score >= s)?.[1] ?? 0;
}

// IELTS overall band rounding rule
function roundIELTS(avg: number): number {
  const floor = Math.floor(avg);
  const dec = avg - floor;
  if (dec < 0.25) return floor;
  if (dec < 0.75) return floor + 0.5;
  return floor + 1;
}

function countWords(text: string): number {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

function fmtTime(s: number): string {
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return `${m}:${sec.toString().padStart(2, "0")}`;
}

// ─── Timer hook ──────────────────────────────────────────────────────────────

function useModuleTimer(phase: Phase, onExpire: () => void) {
  const total = MODULE_TIMES[phase] ?? 0;
  const [remaining, setRemaining] = useState(total);
  const expiredRef = useRef(false);
  const cbRef = useRef(onExpire);
  cbRef.current = onExpire;

  useEffect(() => {
    setRemaining(total);
    expiredRef.current = false;
    if (!total) return;
    const id = setInterval(() => {
      setRemaining(prev => {
        if (prev <= 1) {
          clearInterval(id);
          if (!expiredRef.current) { expiredRef.current = true; cbRef.current(); }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [phase, total]);

  return { remaining, total };
}

// ─── Component ───────────────────────────────────────────────────────────────

export default function DiagnosticQuiz() {
  const navigate = useNavigate();
  const { user, refreshProfile } = useAuth();

  const [phase, setPhase] = useState<Phase>("intro");

  // Reading
  const [readingAnswers, setReadingAnswers] = useState<Record<string, string>>({});

  // Writing
  const [task1Text, setTask1Text] = useState("");
  const [task2Text, setTask2Text] = useState("");

  // Listening audio
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [audioLoading, setAudioLoading] = useState(false);
  const [audioPlayed, setAudioPlayed] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const abortRef = useRef<AbortController | null>(null);
  const audioBlobRef = useRef<string | null>(null);
  const [listeningAnswers, setListeningAnswers] = useState<Record<string, string>>({});

  // Speaking — inline MediaRecorder + Whisper
  const [speakingIndex, setSpeakingIndex] = useState(0);
  const [speakingTranscripts, setSpeakingTranscripts] = useState<string[]>(["", "", ""]);
  const [isRecording, setIsRecording] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const speakingIndexRef = useRef(0);
  useEffect(() => { speakingIndexRef.current = speakingIndex; }, [speakingIndex]);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordedChunksRef = useRef<Blob[]>([]);

  const startRecording = async () => {
    if (isRecording || isTranscribing) return;
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mimeType = MediaRecorder.isTypeSupported("audio/webm") ? "audio/webm" : "audio/ogg";
      const recorder = new MediaRecorder(stream, { mimeType });
      recordedChunksRef.current = [];
      recorder.ondataavailable = (e) => { if (e.data.size > 0) recordedChunksRef.current.push(e.data); };
      recorder.onstop = async () => {
        stream.getTracks().forEach(t => t.stop());
        const blob = new Blob(recordedChunksRef.current, { type: mimeType });
        if (blob.size < 500) { toast.error("Recording too short — please try again."); return; }
        setIsTranscribing(true);
        try {
          const form = new FormData();
          form.append("file", blob, mimeType === "audio/webm" ? "audio.webm" : "audio.ogg");
          form.append("model", "whisper-1");
          form.append("language", "en");
          const headers: Record<string, string> = {};
          if (import.meta.env.DEV) headers["Authorization"] = `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`;
          const res = await fetch(
            import.meta.env.DEV ? "https://api.openai.com/v1/audio/transcriptions" : "/api/transcribe",
            { method: "POST", headers, body: form }
          );
          if (!res.ok) throw new Error(`Whisper ${res.status}: ${await res.text().catch(() => "")}`);
          const json = await res.json();
          const text = (json.text as string)?.trim() ?? "";
          const idx = speakingIndexRef.current;
          setSpeakingTranscripts(prev => { const next = [...prev]; next[idx] = text; return next; });
        } catch (e) {
          toast.error(`Transcription failed: ${(e as Error).message ?? "unknown error"}`);
        } finally {
          setIsTranscribing(false);
        }
      };
      recorder.start();
      mediaRecorderRef.current = recorder;
      setIsRecording(true);
    } catch (e) {
      toast.error("Microphone access denied — please allow permission in your browser and try again.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current = null;
    }
    setIsRecording(false);
  };

  // Cleanup on unmount
  useEffect(() => () => { if (mediaRecorderRef.current?.state !== "inactive") mediaRecorderRef.current?.stop(); }, []);

  // Results
  const [submitting, setSubmitting] = useState(false);
  const [results, setResults] = useState<{
    readingScore: number; readingBand: number;
    listeningScore: number; listeningBand: number;
    writingT1Band: number; writingT2Band: number; writingBand: number;
    writingT1Feedback: string; writingT2Feedback: string;
    speakingBand: number; speakingFeedback: string;
    overallBand: number;
  } | null>(null);

  // Ref for speaking transcripts (used in timer callback)
  const speakingTranscriptsRef = useRef(speakingTranscripts);
  useEffect(() => { speakingTranscriptsRef.current = speakingTranscripts; }, [speakingTranscripts]);

  // Auto-generate listening audio on mount so it's ready by the time user reaches listening
  useEffect(() => {
    const ctrl = new AbortController();
    abortRef.current = ctrl;
    setAudioLoading(true);
    generateListeningAudio(ctrl.signal)
      .then(url => {
        if (audioBlobRef.current) URL.revokeObjectURL(audioBlobRef.current);
        audioBlobRef.current = url;
        setAudioUrl(url);
      })
      .catch(e => {
        if ((e as Error)?.name !== "AbortError") {
          const msg = (e as Error)?.message ?? String(e);
          console.warn("Listening audio pre-gen failed:", msg);
        }
      })
      .finally(() => setAudioLoading(false));
    return () => {
      ctrl.abort();
      if (audioBlobRef.current) URL.revokeObjectURL(audioBlobRef.current);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Final submit — runs all AI analysis here ────────────────────────────────
  const doFinalSubmit = useCallback(async () => {
    setSubmitting(true);
    setPhase("results");

    const rScore = readingScore(readingAnswers);
    const lScore = listeningScore(listeningAnswers);
    const rBand  = readingBandFromScore(rScore);
    const lBand  = listeningBandFromScore(lScore);

    const transcripts = speakingTranscriptsRef.current;
    const speakingCombined = SPEAKING_QS.map((q, i) =>
      `${q.part}: "${q.text}"\nAnswer: "${transcripts[i] || "(no answer given)"}"`
    ).join("\n\n");

    // Run all three AI calls concurrently
    let wT1Band = 0, wT2Band = 0, wT1Fb = "", wT2Fb = "";
    let sBand = 0, sFb = "";

    try {
      const [r1, r2, rs] = await Promise.all([
        supabase.functions.invoke("ai-analyze", {
          body: {
            type: "writing", taskType: "Task 1",
            content: task1Text || "(no answer given — student submitted blank)",
            prompt: T1_PROMPT,
          },
        }),
        supabase.functions.invoke("ai-analyze", {
          body: {
            type: "writing", taskType: "Task 2",
            content: task2Text || "(no answer given — student submitted blank)",
            prompt: T2_PROMPT,
          },
        }),
        supabase.functions.invoke("ai-analyze", {
          body: {
            type: "speaking",
            content: speakingCombined,
            question: "IELTS Speaking diagnostic — evaluate all 3 parts using IELTS band descriptors (0–9). Do not inflate scores. Give 0 or 1 if the response is absent or unintelligible.",
          },
        }),
      ]);

      const fb1 = (r1.data?.data || r1.data || {}) as Record<string, unknown>;
      const fb2 = (r2.data?.data || r2.data || {}) as Record<string, unknown>;
      const fbs = (rs.data?.data || rs.data || {}) as Record<string, unknown>;

      wT1Band = typeof fb1.overallBand === "number" ? fb1.overallBand : 0;
      wT2Band = typeof fb2.overallBand === "number" ? fb2.overallBand : 0;
      sBand   = typeof fbs.overallBand === "number" ? fbs.overallBand : 0;

      wT1Fb = (fb1.taskResponse as Record<string, string[]>)?.justification?.[0] ?? "";
      wT2Fb = (fb2.taskResponse as Record<string, string[]>)?.justification?.[0] ?? "";
      sFb   = (fbs.fluencyCoherence as Record<string, string[]>)?.justification?.[0] ?? "";
    } catch (e) {
      console.error("AI grading error:", e);
    }

    // Writing band = average of T1 and T2, rounded per IELTS convention
    const wBand = wT1Band || wT2Band
      ? roundIELTS((wT1Band + wT2Band) / (wT1Band && wT2Band ? 2 : 1))
      : 0;

    const overall = roundIELTS((rBand + lBand + wBand + sBand) / 4);
    const tier = overall >= 7 ? "polishing" : overall >= 5.5 ? "developing" : "foundation";

    setResults({
      readingScore: rScore, readingBand: rBand,
      listeningScore: lScore, listeningBand: lBand,
      writingT1Band: wT1Band, writingT2Band: wT2Band, writingBand: wBand,
      writingT1Feedback: wT1Fb, writingT2Feedback: wT2Fb,
      speakingBand: sBand, speakingFeedback: sFb,
      overallBand: overall,
    });

    if (user) {
      try {
        await Promise.all([
          supabase.from("profiles").update({ current_band_score: overall, study_plan_tier: tier }).eq("id", user.id),
          supabase.from("diagnostic_results").insert({
            user_id: user.id,
            overall_band: overall,
            reading_band: rBand,
            reading_score: rScore,
            listening_band: lBand,
            listening_score: lScore,
            writing_band: wBand,
            writing_t1_band: wT1Band,
            writing_t2_band: wT2Band,
            writing_t1_feedback: wT1Fb,
            writing_t2_feedback: wT2Fb,
            speaking_band: sBand,
            speaking_feedback: sFb,
            reading_answers: readingAnswers,
            task1_text: task1Text,
            task2_text: task2Text,
            speaking_transcripts: speakingTranscriptsRef.current,
          }),
        ]);
        await refreshProfile();
      } catch { /* non-fatal */ }
    }
    setSubmitting(false);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [readingAnswers, listeningAnswers, task1Text, task2Text, user]);

  // ── Timer auto-advance ──────────────────────────────────────────────────────
  const handleTimerExpire = useCallback(() => {
    setPhase(prev => {
      const next = NEXT_PHASE[prev];
      if (!next) return prev;
      if (next === "results") { void doFinalSubmit(); return "results"; }
      return next;
    });
  }, [doFinalSubmit]);

  const { remaining, total } = useModuleTimer(phase, handleTimerExpire);
  const pctLeft = total ? (remaining / total) * 100 : 100;
  const timerWarn = remaining > 0 && remaining <= 60;

  // ── Reading ─────────────────────────────────────────────────────────────────
  const setRAnswer = (q: string, val: string) => setReadingAnswers(prev => ({ ...prev, [q]: val }));

  // ── Speaking — retry manual load if auto-gen failed ────────────────────────
  const retryAudio = () => {
    const ctrl = new AbortController();
    abortRef.current?.abort();
    abortRef.current = ctrl;
    setAudioLoading(true);
    generateListeningAudio(ctrl.signal)
      .then(url => {
        if (audioBlobRef.current) URL.revokeObjectURL(audioBlobRef.current);
        audioBlobRef.current = url;
        setAudioUrl(url);
      })
      .catch(e => {
        if ((e as Error)?.name !== "AbortError") toast.error(`Audio error: ${(e as Error)?.message ?? String(e)}`);
      })
      .finally(() => setAudioLoading(false));
  };

  // ── Print / PDF ─────────────────────────────────────────────────────────────
  const printResults = () => {
    if (!results) return;
    const date = new Date().toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
    const readingGrid = Object.entries(READING_CORRECT).map(([q, correct]) => {
      const given = (readingAnswers[q] ?? "").trim().toLowerCase();
      const exp   = correct.toLowerCase();
      const ok = q === "q7" || q === "q8"
        ? given.includes(exp) || exp.includes(given)
        : given === exp;
      return `<div style="border:1px solid ${ok ? "#16a34a" : "#dc2626"};background:${ok ? "#f0fdf4" : "#fef2f2"};border-radius:6px;padding:6px 4px;text-align:center;">
        <div style="font-size:9px;color:#6b7280;margin-bottom:2px;">${q.toUpperCase()}</div>
        <div style="font-size:10px;font-weight:700;color:${ok ? "#16a34a" : "#dc2626"};">${ok ? "✓" : correct}</div>
      </div>`;
    }).join("");

    const tier = results.overallBand >= 7 ? "Band 7+ Polishing Plan"
      : results.overallBand >= 5.5 ? "Band 6–7 Developing Plan" : "Band 4–5 Foundation Plan";

    const html = `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8">
<title>IELTS Diagnostic Results — Engvolve</title>
<style>
  *{margin:0;padding:0;box-sizing:border-box}
  body{font-family:Arial,sans-serif;color:#1e293b;background:#fff;padding:32px;max-width:760px;margin:0 auto}
  h1{font-size:20px;font-weight:800;color:#1e293b}
  .subtitle{font-size:12px;color:#64748b;margin-top:2px}
  .band-hero{text-align:center;border:2px solid #e2e8f0;border-radius:12px;padding:24px;margin:20px 0}
  .band-hero .label{font-size:11px;text-transform:uppercase;letter-spacing:1px;color:#64748b;font-weight:600}
  .band-hero .score{font-size:56px;font-weight:900;color:#0f172a;line-height:1}
  .band-hero .rec{font-size:11px;color:#64748b;margin-top:4px}
  .grid-4{display:grid;grid-template-columns:repeat(4,1fr);gap:10px;margin:16px 0}
  .module-card{border:1px solid #e2e8f0;border-radius:10px;padding:12px}
  .module-card .mod-label{font-size:10px;font-weight:700;text-transform:uppercase;color:#64748b;margin-bottom:4px}
  .module-card .mod-band{font-size:22px;font-weight:900}
  .module-card .mod-sub{font-size:10px;color:#64748b;margin-top:2px}
  .reading-grid{display:grid;grid-template-columns:repeat(5,1fr);gap:6px;margin:10px 0}
  .section{border:1px solid #e2e8f0;border-radius:10px;padding:14px;margin:12px 0}
  .section-title{font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:0.5px;margin-bottom:8px}
  .fb-row{display:flex;gap:10px;align-items:flex-start;margin:6px 0}
  .fb-label{font-size:10px;font-weight:700;width:44px;color:#64748b;flex-shrink:0}
  .fb-band{font-size:12px;font-weight:700;color:#0f172a}
  .fb-text{font-size:11px;color:#475569;margin-top:2px;line-height:1.45}
  .plan-box{background:#f8fafc;border:1px solid #e2e8f0;border-radius:10px;padding:14px;margin:12px 0;text-align:center}
  .plan-box .plan-label{font-size:11px;color:#64748b;margin-bottom:4px}
  .plan-box .plan-name{font-size:14px;font-weight:700;color:#0f172a}
  .header-row{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:16px;border-bottom:1px solid #e2e8f0;padding-bottom:12px}
  .blue{color:#2563eb}.violet{color:#7c3aed}.amber{color:#d97706}.emerald{color:#059669}
  @media print{body{padding:20px}@page{margin:1.5cm}}
</style></head><body>
<div class="header-row">
  <div>
    <h1>IELTS Diagnostic Results</h1>
    <div class="subtitle">Engvolve · ${date}</div>
  </div>
  <div style="text-align:right;font-size:11px;color:#64748b">Confidential — for student use only</div>
</div>

<div class="band-hero">
  <div class="label">Overall IELTS Band Score</div>
  <div class="score">${results.overallBand}</div>
  <div class="rec">${results.overallBand >= 7 ? "Good user — Band 7+ Polishing Plan recommended" : results.overallBand >= 5.5 ? "Competent user — Band 6–7 Developing Plan recommended" : "Limited user — Band 4–5 Foundation Plan recommended"}</div>
</div>

<div class="grid-4">
  <div class="module-card"><div class="mod-label">Reading</div><div class="mod-band blue">Band ${results.readingBand}</div><div class="mod-sub">${results.readingScore}/10 correct</div></div>
  <div class="module-card"><div class="mod-label">Listening</div><div class="mod-band amber">Band ${results.listeningBand}</div><div class="mod-sub">${results.listeningScore}/6 correct</div></div>
  <div class="module-card"><div class="mod-label">Writing</div><div class="mod-band violet">Band ${results.writingBand}</div><div class="mod-sub">T1: ${results.writingT1Band} · T2: ${results.writingT2Band}</div></div>
  <div class="module-card"><div class="mod-label">Speaking</div><div class="mod-band emerald">Band ${results.speakingBand}</div><div class="mod-sub">3 questions</div></div>
</div>

<div class="section">
  <div class="section-title" style="color:#2563eb">Reading — Answer Review</div>
  <div class="reading-grid">${readingGrid}</div>
</div>

<div class="section">
  <div class="section-title" style="color:#7c3aed">Writing — AI Feedback</div>
  <div class="fb-row"><div class="fb-label">Task 1</div><div><div class="fb-band">Band ${results.writingT1Band}</div>${results.writingT1Feedback ? `<div class="fb-text">${results.writingT1Feedback}</div>` : ""}</div></div>
  <div class="fb-row"><div class="fb-label">Task 2</div><div><div class="fb-band">Band ${results.writingT2Band}</div>${results.writingT2Feedback ? `<div class="fb-text">${results.writingT2Feedback}</div>` : ""}</div></div>
</div>

<div class="section">
  <div class="section-title" style="color:#059669">Speaking — AI Feedback</div>
  <div class="fb-band">Band ${results.speakingBand}</div>
  ${results.speakingFeedback ? `<div class="fb-text" style="margin-top:4px">${results.speakingFeedback}</div>` : ""}
</div>

<div class="plan-box">
  <div class="plan-label">Recommended Study Plan</div>
  <div class="plan-name">${tier}</div>
</div>

<script>window.onload=function(){window.print();}</script>
</body></html>`;

    const w = window.open("", "_blank");
    if (w) { w.document.write(html); w.document.close(); }
  };

  const showTimer = phase !== "intro" && phase !== "results";

  // ─── Render ─────────────────────────────────────────────────────────────────

  return (
    <DashboardLayout>
      {/* Timer bar */}
      {showTimer && (
        <div className="mb-6 space-y-2">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <div className="flex gap-4">
              {(["reading", "writing", "listening", "speaking"] as Phase[]).map(p => (
                <span key={p} className={cn("capitalize",
                  phase === p ? (
                    p === "reading" ? "text-blue-400 font-semibold" :
                    p === "writing" ? "text-violet-400 font-semibold" :
                    p === "listening" ? "text-amber-400 font-semibold" :
                    "text-emerald-400 font-semibold"
                  ) : ""
                )}>{p}</span>
              ))}
            </div>
            <div className={cn("flex items-center gap-1.5 font-mono font-medium tabular-nums",
              timerWarn ? "text-red-400 animate-pulse" : "text-foreground"
            )}>
              <Clock className="w-3.5 h-3.5" />
              {fmtTime(remaining)}
            </div>
          </div>
          <Progress value={pctLeft} className={cn("h-1.5", timerWarn && "[&>div]:bg-red-400")} />
        </div>
      )}

      {/* ── INTRO ─────────────────────────────────────────────────────────────── */}
      {phase === "intro" && (
        <div className="max-w-2xl mx-auto space-y-8 py-8">
          <div className="text-center space-y-3">
            <div className="w-14 h-14 rounded-2xl bg-accent/10 flex items-center justify-center mx-auto">
              <Target className="w-7 h-7 text-accent" />
            </div>
            <h1 className="text-2xl font-bold text-foreground">IELTS Diagnostic Test</h1>
            <p className="text-muted-foreground text-sm leading-relaxed max-w-md mx-auto">
              A shortened version of the real IELTS exam — all four modules. Each module has a timer. When time runs out, you automatically move to the next section.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {[
              { icon: BookOpen,   label: "Reading",   detail: "10 questions · 15 min",    color: "blue" },
              { icon: PenTool,    label: "Writing",   detail: "Task 1 + Task 2 · 20 min", color: "violet" },
              { icon: Headphones, label: "Listening", detail: "6 questions · 8 min",       color: "amber" },
              { icon: Mic,        label: "Speaking",  detail: "3 questions · 10 min",      color: "emerald" },
            ].map(({ icon: Icon, label, detail, color }) => (
              <div key={label} className="rounded-xl border border-border/40 bg-card/60 p-4">
                <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center mb-2",
                  color === "blue" ? "bg-blue-500/10" : color === "violet" ? "bg-violet-500/10" : color === "amber" ? "bg-amber-500/10" : "bg-emerald-500/10"
                )}>
                  <Icon className={cn("w-4 h-4",
                    color === "blue" ? "text-blue-400" : color === "violet" ? "text-violet-400" : color === "amber" ? "text-amber-400" : "text-emerald-400"
                  )} />
                </div>
                <p className="text-sm font-semibold text-foreground">{label}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{detail}</p>
              </div>
            ))}
          </div>
          <Button className="w-full" size="lg" onClick={() => setPhase("reading")}>
            Start Diagnostic <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      )}

      {/* ── READING ───────────────────────────────────────────────────────────── */}
      {phase === "reading" && (
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-2 mb-5">
            <BookOpen className="w-5 h-5 text-blue-400" />
            <h2 className="text-lg font-semibold text-foreground">Reading Module</h2>
          </div>
          <div className="grid lg:grid-cols-2 gap-6">
            <div className="rounded-xl border border-border/40 bg-card/60 p-5 max-h-[65vh] overflow-y-auto">
              <h3 className="text-sm font-bold text-foreground mb-4">Cooling the Concrete Jungle</h3>
              <div className="space-y-3">
                {READING_PASSAGE.split("\n\n").map((para, i) => (
                  <p key={i} className="text-xs text-muted-foreground leading-relaxed">{para}</p>
                ))}
              </div>
            </div>
            <div className="space-y-5 max-h-[65vh] overflow-y-auto pr-1">
              {/* Q1-3 */}
              <div className="rounded-xl border border-border/40 bg-card/60 p-4 space-y-3">
                <p className="text-xs font-bold text-blue-400 uppercase tracking-wider">Questions 1–3: Matching Headings</p>
                <p className="text-xs text-muted-foreground">Choose the correct heading for paragraphs B, D and F. (Example: Paragraph A = iii)</p>
                <div className="rounded-lg bg-muted/30 p-3 space-y-1">
                  {HEADING_OPTIONS.map(h => <p key={h.id} className="text-xs text-muted-foreground">{h.id}. {h.text}</p>)}
                </div>
                {[{ q: "q1", label: "1. Paragraph B" }, { q: "q2", label: "2. Paragraph D" }, { q: "q3", label: "3. Paragraph F" }].map(({ q, label }) => (
                  <div key={q} className="flex items-center gap-3">
                    <span className="text-xs text-foreground/80 w-32 shrink-0">{label}</span>
                    <select value={readingAnswers[q] ?? ""} onChange={e => setRAnswer(q, e.target.value)}
                      className="flex-1 rounded-lg border border-border/40 bg-background px-2 py-1.5 text-xs text-foreground">
                      <option value="">Select heading…</option>
                      {HEADING_OPTIONS.map(h => <option key={h.id} value={h.id}>{h.id} — {h.text}</option>)}
                    </select>
                  </div>
                ))}
              </div>
              {/* Q4-6 */}
              <div className="rounded-xl border border-border/40 bg-card/60 p-4 space-y-3">
                <p className="text-xs font-bold text-blue-400 uppercase tracking-wider">Questions 4–6: True / False / Not Given</p>
                {[
                  { q: "q4", text: "4. Materials such as asphalt and concrete continue to release heat after the sun has set." },
                  { q: "q5", text: "5. According to researchers, global climate change is the sole explanation for the temperature rise recorded in Tokyo." },
                  { q: "q6", text: "6. Cool pavements are more expensive to install than green roofs." },
                ].map(({ q, text }) => (
                  <div key={q} className="space-y-1.5">
                    <p className="text-xs text-foreground/90">{text}</p>
                    <div className="flex gap-2">
                      {["TRUE", "FALSE", "NOT GIVEN"].map(opt => (
                        <button key={opt} onClick={() => setRAnswer(q, opt)}
                          className={cn("px-3 py-1 rounded-lg border text-xs transition-colors",
                            readingAnswers[q] === opt ? "border-blue-500/60 bg-blue-500/10 text-blue-300" : "border-border/40 text-muted-foreground hover:border-border"
                          )}>{opt}</button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              {/* Q7-8 */}
              <div className="rounded-xl border border-border/40 bg-card/60 p-4 space-y-3">
                <p className="text-xs font-bold text-blue-400 uppercase tracking-wider">Questions 7–8: Summary Completion</p>
                <p className="text-xs text-muted-foreground">Choose NO MORE THAN TWO WORDS from the passage for each answer.</p>
                <p className="text-xs text-foreground/80 leading-relaxed italic">
                  Cities become hotter partly because tall buildings create a <span className="not-italic">(7)</span>{" "}
                  <input value={readingAnswers["q7"] ?? ""} onChange={e => setRAnswer("q7", e.target.value)} placeholder="type answer…"
                    className="mx-1 w-28 rounded border border-border/50 bg-background px-2 py-0.5 text-xs text-foreground not-italic" />{" "}
                  that traps warm air. One cost-effective countermeasure is planting more <span className="not-italic">(8)</span>{" "}
                  <input value={readingAnswers["q8"] ?? ""} onChange={e => setRAnswer("q8", e.target.value)} placeholder="type answer…"
                    className="mx-1 w-28 rounded border border-border/50 bg-background px-2 py-0.5 text-xs text-foreground not-italic" />.
                </p>
              </div>
              {/* Q9-10 */}
              <div className="rounded-xl border border-border/40 bg-card/60 p-4 space-y-4">
                <p className="text-xs font-bold text-blue-400 uppercase tracking-wider">Questions 9–10: Multiple Choice</p>
                {[
                  { q: "q9", text: "9. According to the passage, which of the following is described as possibly the most economical way to reduce urban heat?", opts: ["Installing reflective pavements", "Constructing green roofs", "Planting trees", "Reducing vehicle use"] },
                  { q: "q10", text: "10. What does the passage suggest is the main obstacle preventing wider adoption of heat-reducing measures?", opts: ["Lack of scientific evidence", "Public resistance to city design changes", "Cost and maintenance requirements", "Disagreement among scientists about causes"] },
                ].map(({ q, text, opts }) => (
                  <div key={q} className="space-y-1.5">
                    <p className="text-xs text-foreground/90">{text}</p>
                    {opts.map((opt, i) => (
                      <button key={i} onClick={() => setRAnswer(q, OPTION_LETTERS[i])}
                        className={cn("w-full flex items-center gap-2 px-3 py-1.5 rounded-lg border text-left text-xs transition-colors",
                          readingAnswers[q] === OPTION_LETTERS[i] ? "border-blue-500/60 bg-blue-500/10 text-foreground" : "border-border/40 text-muted-foreground hover:border-border"
                        )}>
                        <span className={cn("w-5 h-5 rounded-full border text-[10px] font-bold flex items-center justify-center shrink-0",
                          readingAnswers[q] === OPTION_LETTERS[i] ? "border-blue-400 bg-blue-400 text-background" : "border-border/50"
                        )}>{OPTION_LETTERS[i]}</span>
                        {opt}
                      </button>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="flex justify-end mt-5">
            <Button onClick={() => setPhase("writing")}>Next: Writing <ChevronRight className="w-4 h-4 ml-1" /></Button>
          </div>
        </div>
      )}

      {/* ── WRITING ───────────────────────────────────────────────────────────── */}
      {phase === "writing" && (
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="flex items-center gap-2">
            <PenTool className="w-5 h-5 text-violet-400" />
            <h2 className="text-lg font-semibold text-foreground">Writing Module</h2>
          </div>
          <div className="rounded-xl border border-border/40 bg-card/60 p-5 space-y-4">
            <p className="text-xs font-bold text-violet-400 uppercase tracking-wider">Task 1 — Bar Chart Description</p>
            <p className="text-xs text-muted-foreground leading-relaxed">{T1_PROMPT}</p>
            <div className="rounded-lg bg-background/60 border border-border/30 p-4">
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={CHART_DATA} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis dataKey="faculty" tick={{ fontSize: 11, fill: "#94a3b8" }} />
                  <YAxis label={{ value: "Students (thousands)", angle: -90, position: "insideLeft", style: { fontSize: 10, fill: "#94a3b8" }, dy: 60 }} tick={{ fontSize: 10, fill: "#94a3b8" }} domain={[0, 25]} />
                  <Tooltip contentStyle={{ background: "#1e293b", border: "1px solid #334155", borderRadius: 8, fontSize: 12 }} />
                  <Legend wrapperStyle={{ fontSize: 11 }} />
                  <Bar dataKey="2015" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="2025" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-1">
              <div className="flex justify-between items-center">
                <span className="text-xs text-muted-foreground">Your response</span>
                <span className={cn("text-xs", countWords(task1Text) >= 100 ? "text-emerald-400" : "text-muted-foreground")}>{countWords(task1Text)} / 100 words minimum</span>
              </div>
              <textarea value={task1Text} onChange={e => setTask1Text(e.target.value)} placeholder="Begin your Task 1 response here…"
                className="w-full h-36 rounded-lg border border-border/40 bg-background/60 px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/50 resize-none focus:outline-none focus:border-violet-500/40" />
            </div>
          </div>
          <div className="rounded-xl border border-border/40 bg-card/60 p-5 space-y-4">
            <p className="text-xs font-bold text-violet-400 uppercase tracking-wider">Task 2 — Discussion Essay</p>
            <p className="text-xs text-muted-foreground leading-relaxed">{T2_PROMPT}</p>
            <div className="space-y-1">
              <div className="flex justify-between items-center">
                <span className="text-xs text-muted-foreground">Your response</span>
                <span className={cn("text-xs", countWords(task2Text) >= 150 ? "text-emerald-400" : "text-muted-foreground")}>{countWords(task2Text)} / 150 words minimum</span>
              </div>
              <textarea value={task2Text} onChange={e => setTask2Text(e.target.value)} placeholder="Begin your Task 2 essay here…"
                className="w-full h-48 rounded-lg border border-border/40 bg-background/60 px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/50 resize-none focus:outline-none focus:border-violet-500/40" />
            </div>
          </div>
          <p className="text-xs text-muted-foreground text-center">AI writing feedback will appear in your results after you complete all modules.</p>
          <div className="flex items-center justify-between gap-3">
            <Button variant="ghost" size="sm" onClick={() => setPhase("reading")}><ChevronLeft className="w-4 h-4 mr-1" /> Back</Button>
            <Button onClick={() => setPhase("listening")}>Next: Listening <ChevronRight className="w-4 h-4 ml-1" /></Button>
          </div>
        </div>
      )}

      {/* ── LISTENING ─────────────────────────────────────────────────────────── */}
      {phase === "listening" && (
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="flex items-center gap-2">
            <Headphones className="w-5 h-5 text-amber-400" />
            <h2 className="text-lg font-semibold text-foreground">Listening Module</h2>
          </div>
          <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-5 space-y-3">
            <p className="text-sm font-medium text-foreground">Section 1 — A conversation between a student (Nova) and an admissions officer (Fable)</p>
            <p className="text-xs text-muted-foreground">Listen carefully, then answer the questions below. You may replay the audio.</p>
            {audioLoading && (
              <div className="flex items-center gap-2 text-xs text-amber-400/80">
                <Loader2 className="w-3.5 h-3.5 animate-spin" /> Generating audio with two distinct voices…
              </div>
            )}
            {!audioLoading && !audioUrl && (
              <Button size="sm" onClick={retryAudio}
                className="bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/30">
                <Volume2 className="w-4 h-4 mr-1.5" /> Retry Audio Generation
              </Button>
            )}
            {audioUrl && (
              <audio ref={audioRef} src={audioUrl} controls onPlay={() => setAudioPlayed(true)}
                className="w-full h-9" style={{ colorScheme: "dark" }} />
            )}
            {audioPlayed && (
              <span className="text-xs text-emerald-400 flex items-center gap-1"><Check className="w-3 h-3" /> Played</span>
            )}
          </div>
          <div className="space-y-4">
            {LISTENING_QUESTIONS.map((lq, qi) => (
              <div key={lq.id} className="rounded-xl border border-border/40 bg-card/60 p-4 space-y-2">
                <p className="text-xs font-medium text-foreground/90">{qi + 1}. {lq.text}</p>
                <div className="grid grid-cols-2 gap-1.5">
                  {lq.options.map((opt, i) => (
                    <button key={i} onClick={() => setListeningAnswers(prev => ({ ...prev, [lq.id]: OPTION_LETTERS[i] }))}
                      className={cn("flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs text-left transition-colors",
                        listeningAnswers[lq.id] === OPTION_LETTERS[i] ? "border-amber-500/60 bg-amber-500/10 text-foreground" : "border-border/40 text-muted-foreground hover:border-border"
                      )}>
                      <span className={cn("w-5 h-5 rounded-full border text-[10px] font-bold flex items-center justify-center shrink-0",
                        listeningAnswers[lq.id] === OPTION_LETTERS[i] ? "border-amber-400 bg-amber-400 text-background" : "border-border/50"
                      )}>{OPTION_LETTERS[i]}</span>
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div className="flex items-center justify-between">
            <Button variant="ghost" size="sm" onClick={() => setPhase("writing")}><ChevronLeft className="w-4 h-4 mr-1" /> Back</Button>
            <Button onClick={() => setPhase("speaking")}>Next: Speaking <ChevronRight className="w-4 h-4 ml-1" /></Button>
          </div>
        </div>
      )}

      {/* ── SPEAKING ──────────────────────────────────────────────────────────── */}
      {phase === "speaking" && (
        <div className="max-w-2xl mx-auto space-y-6">
          <div className="flex items-center gap-2">
            <Mic className="w-5 h-5 text-emerald-400" />
            <h2 className="text-lg font-semibold text-foreground">Speaking Module</h2>
          </div>
          <div className="flex gap-2 text-xs">
            {SPEAKING_QS.map((q, i) => (
              <button key={i} onClick={() => { if (isRecording) stopRecording(); setSpeakingIndex(i); }}
                className={cn("flex-1 py-2 rounded-lg border text-center transition-colors",
                  speakingIndex === i ? "border-emerald-500/50 bg-emerald-500/10 text-emerald-300" :
                  speakingTranscripts[i] ? "border-border/50 text-muted-foreground bg-card/40" : "border-border/30 text-muted-foreground/60"
                )}>
                {q.part.split(" — ")[0]}
                {speakingTranscripts[i] && <Check className="w-3 h-3 inline ml-1" />}
              </button>
            ))}
          </div>
          <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-5 space-y-4">
            <div>
              <p className="text-xs font-bold text-emerald-400 uppercase tracking-wider mb-1">{SPEAKING_QS[speakingIndex].part}</p>
              <p className="text-sm text-foreground leading-relaxed">{SPEAKING_QS[speakingIndex].text}</p>
            </div>

            <div className="flex items-center gap-3 flex-wrap">
              {!isRecording && !isTranscribing && (
                <button
                  onClick={() => void startRecording()}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-sm hover:bg-emerald-500/30 active:scale-95 transition-all cursor-pointer select-none"
                >
                  <Mic className="w-4 h-4" /> Record
                </button>
              )}
              {isRecording && (
                <button
                  onClick={stopRecording}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-500/20 border border-red-500/30 text-red-300 text-sm hover:bg-red-500/30 transition-colors cursor-pointer"
                >
                  <Square className="w-4 h-4" /> Stop & Transcribe
                </button>
              )}
              {isRecording && (
                <span className="flex items-center gap-1.5 text-xs text-red-400 animate-pulse">
                  <span className="w-2 h-2 rounded-full bg-red-400 inline-block animate-ping" /> Recording…
                </span>
              )}
              {isTranscribing && (
                <span className="flex items-center gap-2 text-xs text-amber-400">
                  <Loader2 className="w-3.5 h-3.5 animate-spin" /> Transcribing…
                </span>
              )}
            </div>

            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">
                {isTranscribing ? "Whisper is transcribing your answer…" : "Transcript — auto-filled after recording, edit freely"}
              </p>
              <textarea
                value={speakingTranscripts[speakingIndex]}
                onChange={e => {
                  if (isRecording || isTranscribing) return;
                  setSpeakingTranscripts(prev => { const next = [...prev]; next[speakingIndex] = e.target.value; return next; });
                }}
                readOnly={isRecording || isTranscribing}
                placeholder="Press Record to speak, or type your answer directly."
                className="w-full h-28 rounded-lg border border-border/40 bg-background/60 px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/50 resize-none focus:outline-none focus:border-emerald-500/40"
              />
              <p className="text-xs text-muted-foreground text-right">{countWords(speakingTranscripts[speakingIndex])} words</p>
            </div>

            <div className="flex justify-between">
              {speakingIndex > 0 ? (
                <button onClick={() => { if (isRecording) stopRecording(); setSpeakingIndex(i => i - 1); }}
                  className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1">
                  <ChevronLeft className="w-3 h-3" /> Previous
                </button>
              ) : <span />}
              {speakingIndex < SPEAKING_QS.length - 1 ? (
                <button onClick={() => { if (isRecording) stopRecording(); setSpeakingIndex(i => i + 1); }}
                  className="text-xs text-emerald-400 hover:text-emerald-300 flex items-center gap-1">
                  Next question <ChevronRight className="w-3 h-3" />
                </button>
              ) : <span />}
            </div>
          </div>
          <p className="text-xs text-muted-foreground text-center">AI speaking feedback will appear in your results after you submit.</p>
          <div className="flex items-center justify-between gap-3">
            <Button variant="ghost" size="sm" onClick={() => setPhase("listening")}><ChevronLeft className="w-4 h-4 mr-1" /> Back</Button>
            <Button onClick={doFinalSubmit} disabled={submitting}>
              {submitting ? <Loader2 className="w-4 h-4 animate-spin mr-1" /> : null} Submit & See Results
            </Button>
          </div>
        </div>
      )}

      {/* ── RESULTS loading ───────────────────────────────────────────────────── */}
      {phase === "results" && submitting && (
        <div className="max-w-lg mx-auto py-20 flex flex-col items-center gap-4 text-center">
          <Loader2 className="w-10 h-10 text-accent animate-spin" />
          <p className="text-base font-semibold text-foreground">Analysing your responses…</p>
          <p className="text-xs text-muted-foreground">AI is grading your writing and speaking. This takes about 15–20 seconds.</p>
        </div>
      )}

      {/* ── RESULTS ───────────────────────────────────────────────────────────── */}
      {phase === "results" && results && !submitting && (
        <div className="max-w-2xl mx-auto space-y-5 py-4">
          {/* Overall band */}
          <div className="rounded-2xl border border-accent/20 bg-accent/5 p-6 text-center space-y-1">
            <p className="text-xs font-semibold uppercase tracking-widest text-accent/70">Overall Band Score</p>
            <p className="text-5xl font-black text-foreground">{results.overallBand}</p>
            <p className="text-xs text-muted-foreground">
              {results.overallBand >= 7 ? "Good user — Band 7+ Polishing Plan recommended"
               : results.overallBand >= 5.5 ? "Competent user — Band 6–7 Developing Plan recommended"
               : results.overallBand >= 3 ? "Limited user — Band 4–5 Foundation Plan recommended"
               : "Extremely limited user — Foundation Plan recommended"}
            </p>
          </div>

          {/* Module scores */}
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: "Reading",   icon: BookOpen,   color: "blue",
                val: `Band ${results.readingBand}`,
                sub: `${results.readingScore}/10 correct` },
              { label: "Writing",   icon: PenTool,    color: "violet",
                val: `Band ${results.writingBand}`,
                sub: `T1: ${results.writingT1Band} · T2: ${results.writingT2Band}` },
              { label: "Listening", icon: Headphones, color: "amber",
                val: `Band ${results.listeningBand}`,
                sub: `${results.listeningScore}/6 correct` },
              { label: "Speaking",  icon: Mic,        color: "emerald",
                val: `Band ${results.speakingBand}`,
                sub: "3 questions" },
            ].map(({ label, icon: Icon, color, val, sub }) => (
              <div key={label} className="rounded-xl border border-border/40 bg-card/60 p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Icon className={cn("w-4 h-4",
                    color === "blue" ? "text-blue-400" : color === "violet" ? "text-violet-400" : color === "amber" ? "text-amber-400" : "text-emerald-400"
                  )} />
                  <span className="text-xs font-semibold text-foreground">{label}</span>
                </div>
                <p className={cn("text-xl font-black",
                  color === "blue" ? "text-blue-300" : color === "violet" ? "text-violet-300" : color === "amber" ? "text-amber-300" : "text-emerald-300"
                )}>{val}</p>
                <p className="text-[10px] text-muted-foreground mt-0.5">{sub}</p>
              </div>
            ))}
          </div>

          {/* Reading breakdown */}
          <div className="rounded-xl border border-border/40 bg-card/60 p-4 space-y-2">
            <p className="text-xs font-bold text-blue-400 uppercase tracking-wider">Reading — Answer Review</p>
            <div className="grid grid-cols-5 gap-1.5">
              {Object.entries(READING_CORRECT).map(([q, correct]) => {
                const given = (readingAnswers[q] ?? "").trim().toLowerCase();
                const exp   = correct.toLowerCase();
                const ok = q === "q7" || q === "q8"
                  ? given.includes(exp) || exp.includes(given)
                  : given === exp;
                return (
                  <div key={q} className={cn("rounded-lg p-2 text-center border",
                    ok ? "border-emerald-500/30 bg-emerald-500/10" : "border-red-500/30 bg-red-500/10"
                  )}>
                    <p className="text-[10px] text-muted-foreground">{q.toUpperCase()}</p>
                    {ok
                      ? <Check className="w-3 h-3 text-emerald-400 mx-auto mt-0.5" />
                      : <p className="text-[9px] text-red-400 mt-0.5 leading-tight">{correct}</p>
                    }
                  </div>
                );
              })}
            </div>
          </div>

          {/* Writing feedback */}
          <div className="rounded-xl border border-border/40 bg-card/60 p-4 space-y-3">
            <p className="text-xs font-bold text-violet-400 uppercase tracking-wider">Writing — AI Feedback</p>
            <div className="space-y-2">
              <div className="flex items-start gap-3">
                <span className="text-xs font-semibold text-violet-300 shrink-0 w-14">Task 1</span>
                <div>
                  <span className="text-xs font-bold text-foreground">Band {results.writingT1Band}</span>
                  {results.writingT1Feedback && <p className="text-xs text-muted-foreground mt-0.5">{results.writingT1Feedback}</p>}
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-xs font-semibold text-violet-300 shrink-0 w-14">Task 2</span>
                <div>
                  <span className="text-xs font-bold text-foreground">Band {results.writingT2Band}</span>
                  {results.writingT2Feedback && <p className="text-xs text-muted-foreground mt-0.5">{results.writingT2Feedback}</p>}
                </div>
              </div>
            </div>
          </div>

          {/* Speaking feedback */}
          <div className="rounded-xl border border-border/40 bg-card/60 p-4 space-y-2">
            <p className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Speaking — AI Feedback</p>
            <p className="text-xs font-bold text-foreground">Band {results.speakingBand}</p>
            {results.speakingFeedback && <p className="text-xs text-muted-foreground">{results.speakingFeedback}</p>}
          </div>
          <div className="rounded-xl border border-accent/20 bg-accent/5 p-5 space-y-3">
            <div className="flex items-center gap-2">
              <Crown className="w-4 h-4 text-accent" />
              <p className="text-sm font-semibold text-foreground">Recommended Study Plan</p>
            </div>
            <p className="text-xs text-muted-foreground">
              Based on your Band {results.overallBand} result, we recommend the{" "}
              <span className="text-foreground font-medium">
                {results.overallBand >= 7 ? "Band 7+ Polishing Plan" : results.overallBand >= 5.5 ? "Band 6–7 Developing Plan" : "Band 4–5 Foundation Plan"}
              </span>. This plan targets your weakest areas and is structured for your current level.
            </p>
            <div className="flex gap-2">
              <Button variant="outline" className="flex-1" onClick={printResults}>
                <Printer className="w-4 h-4 mr-2" /> Print / Save PDF
              </Button>
              <Button className="flex-1" onClick={() => navigate("/dashboard/study-plan")}>
                <CheckCircle className="w-4 h-4 mr-2" /> Go to My Study Plan
              </Button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
