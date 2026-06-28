import { useState, useEffect, useRef, useCallback } from "react";
import { cn } from "@/lib/utils";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import {
  Mic, Loader2, Play, Square, Volume2, VolumeX, RefreshCw,
  ChevronRight, Download, CheckCircle, ArrowRight,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useWhisperTranscription } from "@/hooks/useWhisperTranscription";
import { useUserProgress } from "@/hooks/useUserProgress";
import { useAuth } from "@/hooks/useAuth";
import { useFeatureGating } from "@/hooks/useFeatureGating";
import { UpgradeModal } from "@/components/UpgradeModal";

// ── Fallback question banks ────────────────────────────────────────────────
const FALLBACK = {
  part1: [
    { topic: "Hometown",     question: "Where do you come from? Can you describe your hometown?" },
    { topic: "Work/Studies", question: "Do you work or are you a student? What do you like most about it?" },
    { topic: "Hobbies",      question: "What do you enjoy doing in your free time? How often do you do this?" },
    { topic: "Music",        question: "What kind of music do you like? Do you prefer listening alone or with others?" },
    { topic: "Reading",      question: "Do you like reading? What types of books or articles do you usually read?" },
    { topic: "Travel",       question: "Do you like traveling? Where would you like to travel in the future?" },
    { topic: "Food",         question: "What is your favorite type of food? Do you prefer eating at home or out?" },
    { topic: "Weather",      question: "What's the weather like in your country? Does weather affect your mood?" },
    { topic: "Technology",   question: "How often do you use the internet? What do you mainly use it for?" },
    { topic: "Sports",       question: "Do you enjoy playing or watching sports? Which sport do you like most?" },
    { topic: "Family",       question: "Tell me about your family. How much time do you spend with them?" },
    { topic: "Friends",      question: "How important are friends to you? How do you usually spend time with friends?" },
  ],
  part2: [
    { topic: "A memorable trip",        cueCard: "Describe a memorable trip you took.\n\nYou should say:\n• Where you went\n• Who you went with\n• What you did there\n\nAnd explain why it was memorable.",               prepTime: "1 minute", speakTime: "1–2 minutes" },
    { topic: "A person who influenced you", cueCard: "Describe a person who has influenced you.\n\nYou should say:\n• Who this person is\n• How you know them\n• What qualities they have\n\nAnd explain why they influenced you.", prepTime: "1 minute", speakTime: "1–2 minutes" },
    { topic: "A skill you want to learn", cueCard: "Describe a skill you would like to learn.\n\nYou should say:\n• What the skill is\n• Why you want to learn it\n• How you would learn it\n\nAnd explain how it would benefit you.",  prepTime: "1 minute", speakTime: "1–2 minutes" },
    { topic: "A time you helped someone", cueCard: "Describe a time you helped someone.\n\nYou should say:\n• Who you helped\n• What the situation was\n• How you helped them\n\nAnd explain how you felt afterwards.",            prepTime: "1 minute", speakTime: "1–2 minutes" },
    { topic: "An important decision",    cueCard: "Describe an important decision you made.\n\nYou should say:\n• What the decision was\n• When you made it\n• What factors you considered\n\nAnd explain how it affected your life.",  prepTime: "1 minute", speakTime: "1–2 minutes" },
    { topic: "A favourite place",        cueCard: "Describe a place you enjoy visiting.\n\nYou should say:\n• Where it is\n• How often you go there\n• What you do there\n\nAnd explain why you enjoy it.",                          prepTime: "1 minute", speakTime: "1–2 minutes" },
  ],
  part3: [
    { topic: "Travel & Tourism",    questions: ["How has tourism changed in recent years?", "What are the pros and cons of mass tourism?", "Will people travel more or less in the future?"] },
    { topic: "Influence & Role Models", questions: ["Why do people need role models?", "How do celebrities influence young people?", "Does the media present good role models?"] },
    { topic: "Learning & Skills",   questions: ["How has the way people learn changed?", "What skills matter most in the modern world?", "Should schools teach more practical skills?"] },
    { topic: "Helping Others",      questions: ["Why is it important to help others?", "How can governments encourage volunteering?", "Are people more or less helpful than in the past?"] },
    { topic: "Decision Making",     questions: ["How do people make important life decisions?", "Should young people seek advice from elders?", "Does technology help or hinder decision-making?"] },
    { topic: "Technology & Society",questions: ["How has technology changed communication?", "What are the downsides of depending on technology?", "What might daily life look like in 50 years?"] },
  ],
};

// ── Types ─────────────────────────────────────────────────────────────────
type TestPhase = 'library' | 'part1' | 'part2' | 'part3' | 'results';

interface P1Answer   { topic: string; question: string; transcript: string; }
interface TestSet {
  id: string;
  label: string;
  theme: string;
  part1: Array<{ topic: string; question: string }>;
  part2: { topic: string; cueCard: string; prepTime: string; speakTime: string };
  part3: { topic: string; questions: string[] };
}

// ── Helpers (module-level, stable references) ─────────────────────────────
const doneKey = (uid: string) => `ielts-speaking-done-${uid}`;
const getDone = (uid: string): Set<string> => {
  try { return new Set(JSON.parse(localStorage.getItem(doneKey(uid)) ?? '[]')); }
  catch { return new Set(); }
};
const addDone = (uid: string, id: string) => {
  try {
    const s = getDone(uid); s.add(id);
    localStorage.setItem(doneKey(uid), JSON.stringify([...s]));
  } catch { /* ignore */ }
};

function buildTestSets(bank: typeof FALLBACK): TestSet[] {
  const numTests = Math.min(
    Math.max(Math.floor(bank.part1.length / 4), bank.part2.length, bank.part3.length),
    6
  );
  return Array.from({ length: numTests }, (_, i) => ({
    id: `test-${i}`,
    label: `Test ${i + 1}`,
    theme: bank.part2[i % bank.part2.length].topic,
    part1: [0, 1, 2, 3].map(j => bank.part1[(i * 4 + j) % bank.part1.length]),
    part2: bank.part2[i % bank.part2.length],
    part3: bank.part3[i % bank.part3.length],
  }));
}

// ── Component ─────────────────────────────────────────────────────────────
export default function SpeakingModule() {
  const { user } = useAuth();
  const { toast } = useToast();
  const { saveProgress } = useUserProgress();
  const { canAccess, refreshCounts } = useFeatureGating();
  const isMountedRef = useRef(true);
  useEffect(() => { isMountedRef.current = true; return () => { isMountedRef.current = false; }; }, []);

  const [bank, setBank]           = useState(FALLBACK);
  const [tests, setTests]         = useState<TestSet[]>(() => buildTestSets(FALLBACK));
  const [completedIds, setCompletedIds] = useState<Set<string>>(new Set());
  const [phase, setPhase]         = useState<TestPhase>('library');
  const [activeTest, setActiveTest]   = useState<TestSet | null>(null);
  const [p1Index, setP1Index]     = useState(0);
  const [p1Answers, setP1Answers] = useState<P1Answer[]>([]);
  const [p2Transcript, setP2Transcript] = useState('');
  const [p3Transcript, setP3Transcript] = useState('');
  const [feedback, setFeedback]   = useState<any>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const recordingStartRef = useRef<number | null>(null);
  const feedbackRef = useRef<HTMLDivElement>(null);

  const {
    isListening, isTranscribing, transcript, startListening, stopListening,
    resetTranscript, isSupported, audioLevel, audioUrl,
  } = useWhisperTranscription();

  // Load DB questions
  useEffect(() => {
    const load = async () => {
      try {
        const { data, error } = await supabase
          .from("speaking_library")
          .select("part, topic, question, follow_up_questions, prep_time, speak_time")
          .eq("is_active", true).order("topic");
        if (error || !data?.length) return;
        const p1 = data.filter(r => r.part === 1).map(r => ({ topic: r.topic, question: r.question }));
        const p2 = data.filter(r => r.part === 2).map(r => ({
          topic: r.topic, cueCard: r.question,
          prepTime: r.prep_time ?? "1 minute", speakTime: r.speak_time ?? "1–2 minutes",
        }));
        const p3 = data.filter(r => r.part === 3).map(r => ({
          topic: r.topic,
          questions: Array.isArray(r.follow_up_questions) ? r.follow_up_questions as string[] : [],
        }));
        const newBank = {
          part1: p1.length ? p1 : FALLBACK.part1,
          part2: p2.length ? p2 : FALLBACK.part2,
          part3: p3.length ? p3 : FALLBACK.part3,
        };
        setBank(newBank);
        setTests(buildTestSets(newBank));
      } catch { /* use fallback */ }
    };
    load();
  }, []);

  // Load completed test IDs from localStorage
  useEffect(() => {
    if (user?.id) setCompletedIds(getDone(user.id));
  }, [user?.id]);

  useEffect(() => {
    if (feedback && feedbackRef.current)
      setTimeout(() => feedbackRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100);
  }, [feedback]);

  // ── Recording handlers (stable, not inline components) ─────────────────
  const handleStart = useCallback(async () => {
    if (!isSupported) {
      toast({ title: "Microphone unavailable", description: "Allow microphone access and reload.", variant: "destructive" });
      return;
    }
    resetTranscript();
    recordingStartRef.current = Date.now();
    await startListening();
  }, [isSupported, resetTranscript, startListening, toast]);

  const handleStop = useCallback(() => {
    recordingStartRef.current = null;
    stopListening();
  }, [stopListening]);

  // ── Test flow ──────────────────────────────────────────────────────────
  const startTest = (test: TestSet) => {
    if (!canAccess("speaking")) { setShowUpgradeModal(true); return; }
    setActiveTest(test);
    setP1Index(0);
    setP1Answers([]);
    setP2Transcript('');
    setP3Transcript('');
    setFeedback(null);
    resetTranscript();
    setPhase('part1');
  };

  const saveP1 = () => {
    if (!activeTest || !transcript.trim()) return;
    const q = activeTest.part1[p1Index];
    const updated = [...p1Answers, { topic: q.topic, question: q.question, transcript: transcript.trim() }];
    setP1Answers(updated);
    resetTranscript();
    if (p1Index < 3) { setP1Index(p1Index + 1); }
    else { setPhase('part2'); }
  };

  const saveP2 = () => {
    setP2Transcript(transcript.trim());
    resetTranscript();
    setPhase('part3');
  };

  const saveP3 = () => {
    setP3Transcript(transcript.trim());
    resetTranscript();
  };

  const analyzeFullTest = async () => {
    if (!canAccess("speaking")) { setShowUpgradeModal(true); return; }
    if (!activeTest) return;
    const finalP3 = p3Transcript || transcript.trim();
    if (!finalP3) {
      toast({ title: "Record Part 3 first", description: "Please record your Part 3 response.", variant: "destructive" });
      return;
    }
    let session;
    try {
      const { data: { session: s } } = await supabase.auth.refreshSession();
      session = s ?? (await supabase.auth.getSession()).data.session;
    } catch { /* ignore */ }
    if (!session) { toast({ title: "Sign in required", variant: "destructive" }); return; }

    setIsAnalyzing(true);
    const combined = [
      '[PART 1 — Introduction]',
      ...p1Answers.map((a, i) => `Q${i + 1} (${a.topic}): ${a.question}\nA: ${a.transcript}`),
      '',
      '[PART 2 — Long Turn]',
      `Cue Card: ${activeTest.part2.cueCard}`,
      `A: ${p2Transcript}`,
      '',
      '[PART 3 — Discussion]',
      `Topic: ${activeTest.part3.topic}`,
      `Questions: ${activeTest.part3.questions.join(' / ')}`,
      `A: ${finalP3}`,
    ].join('\n');

    try {
      const { data, error } = await supabase.functions.invoke("ai-analyze", {
        body: { type: "speaking", content: combined, speakingPart: "full_test" },
        headers: { Authorization: `Bearer ${session.access_token}` },
      });
      if (error) throw error;
      const result = data?.success ? data.data : data;
      if (result?.overallBand && user) {
        try {
          await saveProgress({ exam_type: "speaking", score: null, band_score: result.overallBand,
            total_questions: null, correct_answers: null, feedback: `Full Test: ${activeTest.theme}`,
            completed_at: new Date().toISOString(), time_taken: null, errors_log: [],
            metadata: { speakingPart: "full_test", topic: activeTest.theme } });
          await refreshCounts();
        } catch { /* non-critical */ }
        if (user.id) {
          addDone(user.id, activeTest.id);
          setCompletedIds(getDone(user.id));
        }
      }
      if (isMountedRef.current) { setFeedback(result); setPhase('results'); }
    } catch (err: any) {
      toast({ title: "Analysis failed", description: err.message || "Please try again.", variant: "destructive" });
    } finally {
      if (isMountedRef.current) setIsAnalyzing(false);
    }
  };

  // ── Shared UI helpers ──────────────────────────────────────────────────
  const getScoreColor = (s?: number) => !s ? 'text-muted-foreground' : s >= 7 ? 'text-green-500' : s >= 5.5 ? 'text-elite-gold' : 'text-destructive';

  const AccuracyCircle = ({ score }: { score: number }) => {
    const r = 42, circ = 2 * Math.PI * r;
    const color = score >= 80 ? '#22c55e' : score >= 60 ? '#f59e0b' : '#ef4444';
    return (
      <svg width={100} height={100} viewBox="0 0 100 100">
        <circle cx="50" cy="50" r={r} fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="7" />
        <circle cx="50" cy="50" r={r} fill="none" stroke={color} strokeWidth="7"
          strokeDasharray={circ} strokeDashoffset={circ - (score / 100) * circ}
          strokeLinecap="round" transform="rotate(-90 50 50)" style={{ transition: 'stroke-dashoffset 1s ease' }} />
        <text x="50" y="50" textAnchor="middle" dominantBaseline="middle" fontSize="17" fontWeight="300" fill={color}>{score}%</text>
      </svg>
    );
  };

  const stopSpeaking = () => {
    if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    setIsSpeaking(false);
  };

  const speakText = (text: string, gender: 'male' | 'female') => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = 'en-US'; u.rate = 0.95;
    const voices = window.speechSynthesis.getVoices().filter(v => v.lang.startsWith('en'));
    u.voice = gender === 'male'
      ? voices.find(v => /david|guy|aaron|james/i.test(v.name)) ?? voices[0] ?? null
      : voices.find(v => /samantha|aria|zira|female/i.test(v.name)) ?? voices[1] ?? null;
    u.onstart = () => setIsSpeaking(true);
    u.onend = () => setIsSpeaking(false);
    u.onerror = () => setIsSpeaking(false);
    window.speechSynthesis.speak(u);
  };

  // Waveform bars — computed inline, not via inner component
  const waveformBars = Array.from({ length: 12 }, (_, i) =>
    isListening ? 8 + (40 - 8) * audioLevel * (Math.sin((i + Date.now() / 100) * 0.5) * 0.3 + 0.7) : 8
  );

  // ════════════════════════════════════════════════════════════════════════
  // LIBRARY
  // ════════════════════════════════════════════════════════════════════════
  if (phase === 'library') {
    return (
      <DashboardLayout>
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-elite-gold/10 flex items-center justify-center shrink-0">
              <Mic className="w-5 h-5 text-elite-gold" />
            </div>
            <div>
              <h1 className="text-xl font-light">Speaking Practice</h1>
              <p className="text-xs text-muted-foreground">Full IELTS simulation — Part 1, 2 & 3 in one session</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {tests.map((test) => {
              const done = completedIds.has(test.id);
              return (
                <div key={test.id}
                  className={cn(
                    "glass-card p-5 flex flex-col gap-3 border cursor-pointer hover:border-accent/40 transition-colors group",
                    done ? "border-green-500/30 bg-green-500/5" : "border-border/50"
                  )}
                  onClick={() => startTest(test)}
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-sm font-semibold group-hover:text-accent transition-colors">{test.label}</span>
                    {done && (
                      <span className="flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-green-500/15 text-green-500 shrink-0">
                        <CheckCircle className="w-3 h-3" /> Done
                      </span>
                    )}
                  </div>
                  <div className="space-y-1 text-xs text-muted-foreground">
                    <p><span className="text-foreground/60">Part 1:</span> {test.part1.map(q => q.topic).join(', ')}</p>
                    <p><span className="text-foreground/60">Part 2:</span> {test.part2.topic}</p>
                    <p><span className="text-foreground/60">Part 3:</span> {test.part3.topic}</p>
                  </div>
                  <Button variant="outline" size="sm" className="mt-auto w-full group-hover:bg-accent group-hover:text-accent-foreground transition-colors">
                    <Play className="w-3.5 h-3.5 mr-1.5" />
                    {done ? 'Redo Test' : 'Start Test'}
                  </Button>
                </div>
              );
            })}
          </div>
        </div>
        <UpgradeModal isOpen={showUpgradeModal} onClose={() => setShowUpgradeModal(false)} featureName="Speaking" />
      </DashboardLayout>
    );
  }

  // ════════════════════════════════════════════════════════════════════════
  // PART 1
  // ════════════════════════════════════════════════════════════════════════
  if (phase === 'part1' && activeTest) {
    const q = activeTest.part1[p1Index];
    return (
      <DashboardLayout>
        <div className="max-w-2xl mx-auto space-y-5">
          {/* Header */}
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={() => { setPhase('library'); resetTranscript(); }}
              className="text-muted-foreground hover:text-foreground shrink-0">← Tests</Button>
            <div>
              <h1 className="text-lg font-light">{activeTest.label} — Part 1</h1>
              <p className="text-xs text-muted-foreground">Introduction</p>
            </div>
          </div>

          {/* Progress */}
          <div className="flex items-center gap-2">
            {[0, 1, 2, 3].map(i => (
              <div key={i} className={cn("flex-1 h-1.5 rounded-full transition-colors",
                i < p1Answers.length ? "bg-green-500" : i === p1Index ? "bg-accent" : "bg-border/40")} />
            ))}
            <span className="text-xs text-muted-foreground shrink-0">Q{p1Index + 1}/4</span>
          </div>

          {/* Saved answers */}
          {p1Answers.map((a, i) => (
            <div key={i} className="glass-card p-4 flex items-start gap-3 border-green-500/20">
              <CheckCircle className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
              <div className="min-w-0">
                <p className="text-xs text-muted-foreground mb-1">Q{i + 1}: {a.question}</p>
                <p className="text-sm text-foreground/80 line-clamp-2">{a.transcript}</p>
              </div>
            </div>
          ))}

          {/* Current question */}
          <div className="glass-card p-6">
            <span className="text-xs uppercase tracking-widest text-muted-foreground">{q.topic}</span>
            <p className="text-lg text-foreground/90 leading-relaxed mt-2">{q.question}</p>
            <p className="text-xs text-muted-foreground mt-3">Answer in 2–3 sentences.</p>
          </div>

          {/* Recording controls — inlined (no inner component) */}
          <div className="glass-card p-8">
            <div className="flex flex-col items-center">
              <div className={cn("w-full max-w-md h-24 flex items-center justify-center gap-1 mb-6 rounded-xl transition-all",
                isListening ? "bg-destructive/10" : isTranscribing ? "bg-accent/10" : transcript ? "bg-green-500/10" : "bg-secondary/30")}>
                {isListening ? waveformBars.map((h, i) => (
                  <div key={i} className="w-2 bg-destructive rounded-full transition-all duration-75" style={{ height: `${h}px` }} />
                )) : isTranscribing ? (
                  <div className="flex flex-col items-center gap-2">
                    <Loader2 className="w-8 h-8 text-accent animate-spin" />
                    <span className="text-xs text-muted-foreground">Transcribing…</span>
                  </div>
                ) : transcript ? <Volume2 className="w-12 h-12 text-green-500" /> : <Mic className="w-12 h-12 text-muted-foreground" />}
              </div>
              <div className="flex flex-col items-center gap-3">
                <div className="flex items-center gap-4">
                  {!isListening && !isTranscribing && !transcript && (
                    <Button variant="neumorphicPrimary" size="lg" onClick={handleStart} disabled={!isSupported}>
                      <Mic className="w-5 h-5 mr-2" /> Start Speaking
                    </Button>
                  )}
                  {isListening && (
                    <Button variant="destructive" size="lg" onClick={handleStop}>
                      <Square className="w-5 h-5 mr-2" /> Stop Recording
                    </Button>
                  )}
                  {isTranscribing && <Button variant="outline" size="lg" disabled><Loader2 className="w-5 h-5 mr-2 animate-spin" /> Transcribing…</Button>}
                  {transcript && !isListening && !isTranscribing && (
                    <>
                      <Button variant="glass" onClick={handleStart}><Mic className="w-5 h-5 mr-2" /> Re-record</Button>
                      <Button variant="neumorphicPrimary" onClick={saveP1}>
                        <ArrowRight className="w-5 h-5 mr-2" />
                        {p1Index < 3 ? 'Save & Next' : 'Save & Part 2'}
                      </Button>
                    </>
                  )}
                </div>
                {isListening && <p className="text-sm text-destructive animate-pulse">Recording… press Stop when done</p>}
              </div>
            </div>
          </div>

          {transcript && !isListening && !isTranscribing && (
            <div className="glass-card p-5">
              <p className="text-xs text-muted-foreground mb-2">Your response:</p>
              <p className="text-sm text-foreground/80 leading-relaxed">{transcript}</p>
            </div>
          )}
        </div>
        <UpgradeModal isOpen={showUpgradeModal} onClose={() => setShowUpgradeModal(false)} featureName="Speaking" />
      </DashboardLayout>
    );
  }

  // ════════════════════════════════════════════════════════════════════════
  // PART 2
  // ════════════════════════════════════════════════════════════════════════
  if (phase === 'part2' && activeTest) {
    return (
      <DashboardLayout>
        <div className="max-w-2xl mx-auto space-y-5">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={() => { setPhase('part1'); setP1Index(3); resetTranscript(); }}
              className="text-muted-foreground hover:text-foreground shrink-0">← Part 1</Button>
            <div>
              <h1 className="text-lg font-light">{activeTest.label} — Part 2</h1>
              <p className="text-xs text-muted-foreground">Long Turn (Cue Card)</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {[0, 1, 2].map(i => (
              <div key={i} className={cn("flex-1 h-1.5 rounded-full", i < 1 ? "bg-green-500" : i === 1 ? "bg-accent" : "bg-border/40")} />
            ))}
            <span className="text-xs text-muted-foreground shrink-0">Part 2/3</span>
          </div>

          <div className="glass-card p-6">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs uppercase tracking-widest text-muted-foreground">{activeTest.part2.topic}</span>
              <span className="text-xs text-muted-foreground">Prep: {activeTest.part2.prepTime} · Speak: {activeTest.part2.speakTime}</span>
            </div>
            <div className="bg-secondary/30 rounded-xl p-4">
              <pre className="whitespace-pre-wrap text-foreground/80 leading-relaxed font-sans text-sm">{activeTest.part2.cueCard}</pre>
            </div>
            <p className="text-xs text-muted-foreground mt-3">Take a moment to prepare, then speak for 1–2 minutes.</p>
          </div>

          {/* Recording controls — inlined */}
          <div className="glass-card p-8">
            <div className="flex flex-col items-center">
              <div className={cn("w-full max-w-md h-24 flex items-center justify-center gap-1 mb-6 rounded-xl transition-all",
                isListening ? "bg-destructive/10" : isTranscribing ? "bg-accent/10" : transcript ? "bg-green-500/10" : "bg-secondary/30")}>
                {isListening ? waveformBars.map((h, i) => (
                  <div key={i} className="w-2 bg-destructive rounded-full transition-all duration-75" style={{ height: `${h}px` }} />
                )) : isTranscribing ? (
                  <div className="flex flex-col items-center gap-2">
                    <Loader2 className="w-8 h-8 text-accent animate-spin" />
                    <span className="text-xs text-muted-foreground">Transcribing…</span>
                  </div>
                ) : transcript ? <Volume2 className="w-12 h-12 text-green-500" /> : <Mic className="w-12 h-12 text-muted-foreground" />}
              </div>
              <div className="flex items-center gap-4">
                {!isListening && !isTranscribing && !transcript && (
                  <Button variant="neumorphicPrimary" size="lg" onClick={handleStart} disabled={!isSupported}>
                    <Mic className="w-5 h-5 mr-2" /> Start Speaking
                  </Button>
                )}
                {isListening && (
                  <Button variant="destructive" size="lg" onClick={handleStop}>
                    <Square className="w-5 h-5 mr-2" /> Stop Recording
                  </Button>
                )}
                {isTranscribing && <Button variant="outline" size="lg" disabled><Loader2 className="w-5 h-5 mr-2 animate-spin" /> Transcribing…</Button>}
                {transcript && !isListening && !isTranscribing && (
                  <>
                    <Button variant="glass" onClick={handleStart}><Mic className="w-5 h-5 mr-2" /> Re-record</Button>
                    <Button variant="neumorphicPrimary" onClick={saveP2}>
                      <ArrowRight className="w-5 h-5 mr-2" /> Save & Part 3
                    </Button>
                  </>
                )}
              </div>
              {isListening && <p className="text-sm text-destructive mt-3 animate-pulse">Recording… press Stop when done</p>}
            </div>
          </div>

          {transcript && !isListening && !isTranscribing && (
            <div className="glass-card p-5">
              <p className="text-xs text-muted-foreground mb-2">Your response:</p>
              <p className="text-sm text-foreground/80 leading-relaxed">{transcript}</p>
            </div>
          )}
        </div>
        <UpgradeModal isOpen={showUpgradeModal} onClose={() => setShowUpgradeModal(false)} featureName="Speaking" />
      </DashboardLayout>
    );
  }

  // ════════════════════════════════════════════════════════════════════════
  // PART 3
  // ════════════════════════════════════════════════════════════════════════
  if (phase === 'part3' && activeTest) {
    const p3Done = p3Transcript || (transcript && !isListening && !isTranscribing);
    return (
      <DashboardLayout>
        <div className="max-w-2xl mx-auto space-y-5">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={() => { setPhase('part2'); resetTranscript(); }}
              className="text-muted-foreground hover:text-foreground shrink-0">← Part 2</Button>
            <div>
              <h1 className="text-lg font-light">{activeTest.label} — Part 3</h1>
              <p className="text-xs text-muted-foreground">Discussion</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {[0, 1, 2].map(i => (
              <div key={i} className={cn("flex-1 h-1.5 rounded-full", i < 2 ? "bg-green-500" : "bg-accent")} />
            ))}
            <span className="text-xs text-muted-foreground shrink-0">Part 3/3</span>
          </div>

          <div className="glass-card p-6">
            <span className="text-xs uppercase tracking-widest text-muted-foreground">{activeTest.part3.topic}</span>
            <div className="space-y-3 mt-3">
              {activeTest.part3.questions.map((q, i) => (
                <div key={i} className="flex items-start gap-2">
                  <ChevronRight className="w-4 h-4 text-accent mt-0.5 shrink-0" />
                  <p className="text-sm text-foreground/80">{q}</p>
                </div>
              ))}
            </div>
            <p className="text-xs text-muted-foreground mt-3">Discuss analytically. Aim for detailed responses.</p>
          </div>

          {/* Recording controls — inlined */}
          {!p3Transcript && (
            <div className="glass-card p-8">
              <div className="flex flex-col items-center">
                <div className={cn("w-full max-w-md h-24 flex items-center justify-center gap-1 mb-6 rounded-xl transition-all",
                  isListening ? "bg-destructive/10" : isTranscribing ? "bg-accent/10" : transcript ? "bg-green-500/10" : "bg-secondary/30")}>
                  {isListening ? waveformBars.map((h, i) => (
                    <div key={i} className="w-2 bg-destructive rounded-full transition-all duration-75" style={{ height: `${h}px` }} />
                  )) : isTranscribing ? (
                    <div className="flex flex-col items-center gap-2">
                      <Loader2 className="w-8 h-8 text-accent animate-spin" />
                      <span className="text-xs text-muted-foreground">Transcribing…</span>
                    </div>
                  ) : transcript ? <Volume2 className="w-12 h-12 text-green-500" /> : <Mic className="w-12 h-12 text-muted-foreground" />}
                </div>
                <div className="flex items-center gap-4">
                  {!isListening && !isTranscribing && !transcript && (
                    <Button variant="neumorphicPrimary" size="lg" onClick={handleStart} disabled={!isSupported}>
                      <Mic className="w-5 h-5 mr-2" /> Start Speaking
                    </Button>
                  )}
                  {isListening && (
                    <Button variant="destructive" size="lg" onClick={handleStop}>
                      <Square className="w-5 h-5 mr-2" /> Stop Recording
                    </Button>
                  )}
                  {isTranscribing && <Button variant="outline" size="lg" disabled><Loader2 className="w-5 h-5 mr-2 animate-spin" /> Transcribing…</Button>}
                  {transcript && !isListening && !isTranscribing && (
                    <>
                      <Button variant="glass" onClick={handleStart}><Mic className="w-5 h-5 mr-2" /> Re-record</Button>
                      <Button variant="neumorphicPrimary" onClick={saveP3}>
                        <CheckCircle className="w-5 h-5 mr-2" /> Save Response
                      </Button>
                    </>
                  )}
                </div>
                {isListening && <p className="text-sm text-destructive mt-3 animate-pulse">Recording… press Stop when done</p>}
              </div>
            </div>
          )}

          {p3Transcript && (
            <div className="glass-card p-5">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <p className="text-xs text-muted-foreground">Response saved</p>
                </div>
                <button onClick={() => { setP3Transcript(''); resetTranscript(); }}
                  className="text-xs text-muted-foreground hover:text-foreground underline">Re-record</button>
              </div>
              <p className="text-sm text-foreground/80 leading-relaxed">{p3Transcript}</p>
            </div>
          )}

          {transcript && !isListening && !isTranscribing && !p3Transcript && (
            <div className="glass-card p-5">
              <p className="text-xs text-muted-foreground mb-2">Your response:</p>
              <p className="text-sm text-foreground/80 leading-relaxed">{transcript}</p>
            </div>
          )}

          {p3Done && (
            <div className="glass-card p-6 border border-elite-gold/30">
              <p className="text-sm text-muted-foreground mb-4">All three parts complete. Submit for a full band score across Parts 1, 2 & 3.</p>
              <Button variant="neumorphicPrimary" className="w-full" size="lg" onClick={analyzeFullTest} disabled={isAnalyzing}>
                {isAnalyzing ? <><Loader2 className="w-5 h-5 mr-2 animate-spin" /> Analyzing Full Test…</> : <><Play className="w-5 h-5 mr-2" /> Analyze Full Test</>}
              </Button>
              {isAnalyzing && <p className="text-xs text-muted-foreground text-center mt-3">AI analysis takes 20–40 seconds — hang tight…</p>}
            </div>
          )}
        </div>
        <UpgradeModal isOpen={showUpgradeModal} onClose={() => setShowUpgradeModal(false)} featureName="Speaking" />
      </DashboardLayout>
    );
  }

  // ════════════════════════════════════════════════════════════════════════
  // RESULTS
  // ════════════════════════════════════════════════════════════════════════
  const exportResult = () => {
    if (!feedback || !activeTest) return;
    const lines = [
      `IELTS Speaking — ${activeTest.label} Analysis`,
      '='.repeat(40), '',
      `Overall Band: ${feedback.overallBand?.toFixed(1)}`,
      '', '--- CRITERION SCORES ---',
      `Pronunciation:            ${feedback.pronunciation?.score ?? '—'}`,
      `Task Response:            ${feedback.taskResponse?.score ?? '—'}`,
      `Fluency & Coherence:      ${feedback.fluencyCoherence?.score ?? '—'}`,
      `Lexical Resource:         ${feedback.lexicalResource?.score ?? '—'}`,
      `Grammatical Range & Acc.: ${feedback.grammaticalRange?.score ?? '—'}`,
      '', '--- WHAT TO FOCUS ON ---',
      ...(feedback.improvements ?? []).map((s: string, i: number) => `${i + 1}. ${s}`),
    ].join('\n');
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([lines], { type: 'text/plain' }));
    a.download = `ielts-speaking-${activeTest.id}-${Date.now()}.txt`;
    a.click();
  };

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto" ref={feedbackRef}>
        <div className="flex items-center gap-3 mb-6">
          <Button variant="ghost" size="sm" onClick={() => setPhase('library')} className="text-muted-foreground hover:text-foreground">← Back to Tests</Button>
        </div>
        {feedback && (
          <div className="space-y-4">
            {/* Band Score */}
            <div className="glass-card p-6">
              <div className="flex flex-wrap items-center justify-between gap-6">
                <div className="flex flex-col items-center gap-1">
                  <AccuracyCircle score={feedback.accuracyScore ?? 72} />
                  <span className="text-xs text-muted-foreground">Accuracy</span>
                </div>
                <div className="flex flex-col items-center flex-1 min-w-[120px]">
                  <p className="text-xs text-muted-foreground mb-1">Overall Band Score</p>
                  <span className="text-6xl font-light text-elite-gold leading-none">{feedback.overallBand?.toFixed(1) ?? "—"}</span>
                  <span className="text-xs text-muted-foreground mt-1">({feedback.bandScoreRange ?? "+/- 0.5"})</span>
                </div>
                <div className="flex flex-col gap-2 items-end">
                  <Button variant="outline" size="sm" onClick={exportResult}><Download className="w-4 h-4 mr-2" /> Export</Button>
                  <Button variant="ghost" size="sm" onClick={() => setPhase('library')}><RefreshCw className="w-4 h-4 mr-2" /> New Test</Button>
                </div>
              </div>
            </div>

            {/* Polished transcript */}
            {feedback.polishedTranscript && (
              <div className="glass-card p-6">
                <div className="flex items-center gap-3 mb-3 flex-wrap">
                  <span className="text-sm font-semibold">Polished transcript (Part 3):</span>
                  {isSpeaking ? (
                    <button onClick={stopSpeaking} className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-destructive/20 text-xs text-destructive hover:bg-destructive/30">
                      <VolumeX className="w-3 h-3" /> Stop
                    </button>
                  ) : (
                    <>
                      <button onClick={() => speakText(feedback.polishedTranscript, 'male')} className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-secondary/40 text-xs text-muted-foreground hover:text-foreground"><Volume2 className="w-3 h-3" /> Male</button>
                      <button onClick={() => speakText(feedback.polishedTranscript, 'female')} className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-secondary/40 text-xs text-muted-foreground hover:text-foreground"><Volume2 className="w-3 h-3" /> Female</button>
                    </>
                  )}
                </div>
                <p className="text-sm text-foreground/80 leading-relaxed">{feedback.polishedTranscript}</p>
              </div>
            )}

            {/* Criterion cards */}
            {[
              { label: "Pronunciation",                data: feedback.pronunciation },
              { label: "Task Response",                data: feedback.taskResponse },
              { label: "Fluency & Coherence",          data: feedback.fluencyCoherence },
              { label: "Lexical Resource",             data: feedback.lexicalResource },
              { label: "Grammatical Range & Accuracy", data: feedback.grammaticalRange },
            ].filter(c => c.data).map(c => (
              <div key={c.label} className="glass-card p-6 text-center">
                <h3 className="text-base font-semibold mb-2">{c.label}</h3>
                <p className={`text-4xl font-light mb-4 ${getScoreColor(c.data.score)}`}>{c.data.score?.toFixed(1) ?? "—"}</p>
                {Array.isArray(c.data.feedback) ? (
                  <ul className="text-sm text-muted-foreground text-left max-w-xl mx-auto space-y-1.5">
                    {c.data.feedback.map((pt: string, i: number) => (
                      <li key={i} className="flex items-start gap-2"><span className="text-accent mt-0.5 shrink-0">•</span><span className="leading-relaxed">{pt}</span></li>
                    ))}
                  </ul>
                ) : <p className="text-sm text-muted-foreground leading-relaxed max-w-xl mx-auto">{c.data.feedback}</p>}
                {c.label === "Lexical Resource" && c.data.suggestions?.length > 0 && (
                  <div className="mt-3 flex flex-wrap justify-center gap-2">
                    {c.data.suggestions.slice(0, 3).map((s: string, i: number) => (
                      <span key={i} className="px-2 py-0.5 rounded-full bg-accent/10 text-accent text-xs">{s}</span>
                    ))}
                  </div>
                )}
                {c.label === "Grammatical Range & Accuracy" && c.data.errorsFound?.length > 0 && (
                  <ul className="mt-3 space-y-1">
                    {c.data.errorsFound.slice(0, 3).map((e: string, i: number) => (
                      <li key={i} className="text-xs text-muted-foreground flex items-start gap-1.5 text-left max-w-md mx-auto">
                        <span className="text-destructive mt-0.5 shrink-0">×</span>{e}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}

            {/* Priority actions */}
            {feedback.improvements?.length > 0 && (
              <div className="glass-card p-6 border border-elite-gold/20">
                <h3 className="text-sm font-semibold text-elite-gold uppercase tracking-wide mb-4">What to focus on next</h3>
                <ol className="space-y-3">
                  {feedback.improvements.slice(0, 3).map((item: string, i: number) => (
                    <li key={i} className="flex items-start gap-3">
                      <span className="w-6 h-6 rounded-full bg-elite-gold/20 text-elite-gold text-xs font-semibold flex items-center justify-center shrink-0 mt-0.5">{i + 1}</span>
                      <p className="text-sm text-foreground/80 leading-relaxed">{item}</p>
                    </li>
                  ))}
                </ol>
              </div>
            )}

            {/* Model answers — parsed by part */}
            {(feedback.enhancedSpeechNextBand || feedback.enhancedSpeech) && (() => {
              const raw: string = feedback.enhancedSpeechNextBand ?? feedback.enhancedSpeech ?? '';

              // Split into PART 1 / PART 2 / PART 3 sections
              const partBlocks = raw
                .split(/(?=\bPART\s+[123]\b)/i)
                .map(s => s.trim())
                .filter(Boolean);

              const parsed = partBlocks.map(block => {
                const partMatch = block.match(/\bPART\s+([123])\b/i);
                if (!partMatch) return null;
                const num = partMatch[1];
                const body = block.replace(/^\bPART\s+[123]\b\s*[—–:\s]*/i, '').trim();

                if (num === '1') {
                  // Split by Q1 / Q2 / Q3 / Q4
                  const qs = body
                    .split(/(?=\bQ[1-4]\b\s*[—–:.]?\s*)/i)
                    .map(s => s.trim()).filter(Boolean);
                  const questions = qs.map(q => {
                    const qm = q.match(/^\bQ([1-4])\b\s*[—–:.]?\s*/i);
                    return {
                      label: qm ? `Q${qm[1]}` : 'Q',
                      text: q.replace(/^\bQ[1-4]\b\s*[—–:.]?\s*/i, '').trim(),
                    };
                  });
                  return { num, label: 'Part 1 — Introduction', questions };
                }
                return {
                  num,
                  label: num === '2' ? 'Part 2 — Long Turn' : 'Part 3 — Discussion',
                  text: body,
                };
              }).filter(Boolean) as Array<any>;

              const partColors: Record<string, string> = {
                '1': 'border-blue-500/30 bg-blue-500/5',
                '2': 'border-purple-500/30 bg-purple-500/5',
                '3': 'border-cyan-500/30 bg-cyan-500/5',
              };
              const labelColors: Record<string, string> = {
                '1': 'text-blue-400',
                '2': 'text-purple-400',
                '3': 'text-cyan-400',
              };

              return (
                <div className="space-y-3">
                  <div className="flex items-center gap-2 px-1">
                    <span className="text-xs font-semibold text-blue-400 uppercase tracking-wide">Model answers at +1 band</span>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300">
                      Band {((feedback.overallBand ?? 6) + 1).toFixed(1)}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground px-1">Same ideas — elevated vocabulary and smoother structure</p>

                  {parsed.length > 0 ? parsed.map((section: any) => (
                    <div key={section.num} className={`glass-card p-5 border ${partColors[section.num] ?? 'border-border/40'}`}>
                      <p className={`text-xs font-semibold uppercase tracking-widest mb-3 ${labelColors[section.num] ?? 'text-muted-foreground'}`}>
                        {section.label}
                      </p>
                      {section.questions ? (
                        <div className="space-y-4">
                          {section.questions.map((q: any, i: number) => (
                            <div key={i} className="flex gap-3">
                              <span className="shrink-0 w-7 h-7 rounded-full bg-blue-500/15 text-blue-400 text-xs font-semibold flex items-center justify-center mt-0.5">
                                {q.label}
                              </span>
                              <p className="text-sm text-foreground/80 leading-relaxed">{q.text}</p>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-foreground/80 leading-relaxed">{section.text}</p>
                      )}
                    </div>
                  )) : (
                    // Fallback: raw text if parsing found no PART markers
                    <div className="glass-card p-5 border border-blue-500/20">
                      <p className="text-sm text-foreground/80 leading-relaxed whitespace-pre-wrap">{raw}</p>
                    </div>
                  )}
                </div>
              );
            })()}

            {audioUrl && (
              <div className="glass-card p-6">
                <p className="text-xs text-muted-foreground mb-2">Your last recording:</p>
                <audio src={audioUrl} controls className="w-full h-10" />
              </div>
            )}
          </div>
        )}
      </div>
      <UpgradeModal isOpen={showUpgradeModal} onClose={() => setShowUpgradeModal(false)} featureName="Speaking" />
    </DashboardLayout>
  );
}
