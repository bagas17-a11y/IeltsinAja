import { useState, useEffect, useRef } from "react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Mic, MicOff, Loader2, Play, Square, Volume2, RefreshCw, ChevronRight, Download } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useSpeechRecognition } from "@/hooks/useSpeechRecognition";
import { useUserProgress } from "@/hooks/useUserProgress";
import { useAuth } from "@/hooks/useAuth";
import { useFeatureGating } from "@/hooks/useFeatureGating";
import { UpgradeModal } from "@/components/UpgradeModal";
import { generationStore } from "@/stores/generationStore";
import { useGenerationEntry } from "@/hooks/useGenerationEntry";

// Fallback IELTS Speaking Questions (used when AI generation is unavailable)
const FALLBACK_SPEAKING_QUESTIONS = {
  part1: [
    { topic: "Hometown", question: "Where do you come from? Can you describe your hometown?" },
    { topic: "Work/Studies", question: "Do you work or are you a student? What do you like most about your job/studies?" },
    { topic: "Hobbies", question: "What do you enjoy doing in your free time? How often do you do this activity?" },
    { topic: "Music", question: "What kind of music do you like? Do you prefer listening to music alone or with others?" },
    { topic: "Reading", question: "Do you like reading? What types of books or articles do you usually read?" },
    { topic: "Travel", question: "Do you like traveling? Where would you like to travel in the future?" },
    { topic: "Food", question: "What is your favorite type of food? Do you prefer eating at home or in restaurants?" },
    { topic: "Weather", question: "What's the weather like in your country? Does the weather affect your mood?" },
  ],
  part2: [
    {
      topic: "A memorable trip",
      cueCard: "Describe a memorable trip you took recently.\n\nYou should say:\n• Where you went\n• Who you went with\n• What you did there\n\nAnd explain why it was memorable.",
      prepTime: "1 minute",
      speakTime: "1-2 minutes"
    },
    {
      topic: "A person who influenced you",
      cueCard: "Describe a person who has influenced you.\n\nYou should say:\n• Who this person is\n• How you know them\n• What qualities they have\n\nAnd explain why they have influenced you.",
      prepTime: "1 minute",
      speakTime: "1-2 minutes"
    },
    {
      topic: "A skill you learned",
      cueCard: "Describe a skill you would like to learn.\n\nYou should say:\n• What the skill is\n• Why you want to learn it\n• How you would learn it\n\nAnd explain how this skill would benefit you.",
      prepTime: "1 minute",
      speakTime: "1-2 minutes"
    },
    {
      topic: "A time you helped someone",
      cueCard: "Describe a time you helped someone.\n\nYou should say:\n• Who you helped\n• What the situation was\n• How you helped them\n\nAnd explain how you felt afterwards.",
      prepTime: "1 minute",
      speakTime: "1-2 minutes"
    },
    {
      topic: "An important decision",
      cueCard: "Describe an important decision you made.\n\nYou should say:\n• What the decision was\n• When you made it\n• What factors you considered\n\nAnd explain how it affected your life.",
      prepTime: "1 minute",
      speakTime: "1-2 minutes"
    },
  ],
  part3: [
    { topic: "Travel & Tourism", questions: [
      "How has tourism changed in recent years?",
      "What are the advantages and disadvantages of mass tourism?",
      "Do you think people will travel more or less in the future?"
    ]},
    { topic: "Influence & Role Models", questions: [
      "Why do people need role models?",
      "How do celebrities influence young people?",
      "Do you think the media presents good role models?"
    ]},
    { topic: "Learning & Skills", questions: [
      "How has the way people learn changed over time?",
      "What skills are most important for success in the modern world?",
      "Should schools teach more practical skills?"
    ]},
    { topic: "Helping Others", questions: [
      "Why is it important to help others?",
      "How can governments encourage people to volunteer?",
      "Do you think people are more or less helpful than in the past?"
    ]},
    { topic: "Decision Making", questions: [
      "How do people make important life decisions?",
      "Should young people seek advice from older generations?",
      "Do you think technology helps or hinders decision-making?"
    ]},
  ]
};

// Types for AI-generated speaking questions (matches generate-speaking edge function output)
interface AISpeakingTest {
  id: string;
  topic: string;
  difficulty: string;
  part1: {
    topics: Array<{ theme: string; questions: string[] }>;
  };
  part2: {
    cue_card: string;
    bullet_points: string[];
    final_instruction: string;
    prep_time: string;
    speak_time: string;
    rounding_off_questions: string[];
  };
  part3: {
    theme: string;
    questions: string[];
  };
}

// Map AI response to the legacy question format used by the component
function mapAIToLegacy(ai: AISpeakingTest) {
  const p1topics = ai.part1?.topics ?? [];
  const part1Questions = p1topics.flatMap(t =>
    (t.questions ?? []).map(q => ({ topic: t.theme, question: q }))
  );

  const p2 = ai.part2;
  const cueCardText = p2
    ? `${p2.cue_card}\n\nYou should say:\n${(p2.bullet_points ?? []).map(b => `• ${b}`).join('\n')}\n\n${p2.final_instruction}`
    : "";

  const part2Questions = p2 ? [{
    topic: ai.topic ?? "AI Generated",
    cueCard: cueCardText,
    prepTime: p2.prep_time ?? "1 minute",
    speakTime: p2.speak_time ?? "1–2 minutes",
  }] : [];

  const p3 = ai.part3;
  const part3Questions = p3 ? [{
    topic: p3.theme ?? ai.topic ?? "Discussion",
    questions: p3.questions ?? [],
  }] : [];

  return { part1: part1Questions, part2: part2Questions, part3: part3Questions };
}

type SpeakingPart = 'part1' | 'part2' | 'part3';

interface CachedSpeakingState {
  activeQuestions: typeof FALLBACK_SPEAKING_QUESTIONS;
  currentPart: SpeakingPart;
  currentQuestionIndex: number;
  feedback: any;
}

export default function SpeakingModule() {
  // useAuth MUST be called before any useState that references user?.id
  const { user } = useAuth();

  // isMountedRef: tracks whether component is currently mounted
  const isMountedRef = useRef(true);
  useEffect(() => {
    isMountedRef.current = true;
    return () => { isMountedRef.current = false; };
  }, []);

  // Background generation store — survives component unmount/remount
  const genEntry = useGenerationEntry('speaking');
  const isGenerating = genEntry.isGenerating;

  const [currentPart, setCurrentPart] = useState<SpeakingPart>(() => {
    if (typeof window !== "undefined") {
      const stored = sessionStorage.getItem(`ielts-speaking-active-part-${user?.id || 'guest'}`);
      if (stored === "part1" || stored === "part2" || stored === "part3") return stored as SpeakingPart;
    }
    return "part1";
  });
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [feedback, setFeedback] = useState<any>(null);

  // Background analysis store — persists isAnalyzing across module navigation
  const analysisEntry = useGenerationEntry('speaking-analysis');
  const isAnalyzing = analysisEntry.isGenerating;
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [activeQuestions, setActiveQuestions] = useState(FALLBACK_SPEAKING_QUESTIONS);
  const { toast } = useToast();
  const { saveProgress } = useUserProgress();
  const { canAccess, refreshCounts, isLoading: isGatingLoading } = useFeatureGating();
  const [speakingDuration, setSpeakingDuration] = useState<number | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [activeComparison, setActiveComparison] = useState<'naturalness' | 'enhanced' | null>(null);
  const [showDiffs, setShowDiffs] = useState<{ naturalness: boolean; enhanced: boolean }>({ naturalness: false, enhanced: false });
  const [tooltipWord, setTooltipWord] = useState<{ word: string; feedback: string } | null>(null);
  const recordingStartRef = useRef<number | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordedChunksRef = useRef<Blob[]>([]);

  useEffect(() => {
    if (!user?.id) return;
    try {
      const stored = sessionStorage.getItem(`ielts-speaking-cache-${user.id}`);
      if (stored) {
        const state = JSON.parse(stored) as CachedSpeakingState;
        if (state.activeQuestions) setActiveQuestions(state.activeQuestions);
        if (state.currentPart) setCurrentPart(state.currentPart);
        if (state.currentQuestionIndex !== undefined) setCurrentQuestionIndex(state.currentQuestionIndex);
        if (state.feedback) setFeedback(state.feedback);
      }
    } catch (err) { console.error("Cache load error:", err); }
  }, [user?.id]);

  useEffect(() => {
    if (!user?.id) return;
    const state: CachedSpeakingState = {
      activeQuestions,
      currentPart,
      currentQuestionIndex,
      feedback
    };
    sessionStorage.setItem(`ielts-speaking-cache-${user.id}`, JSON.stringify(state));
    sessionStorage.setItem(`ielts-speaking-active-part-${user.id}`, currentPart);
  }, [user?.id, activeQuestions, currentPart, currentQuestionIndex, feedback]);

  // Apply generation results that arrived while this component was unmounted
  useEffect(() => {
    if (genEntry.isGenerating) return;
    if (genEntry.result) {
      const { mapped } = genEntry.result;
      generationStore.clearEntry('speaking');
      if (isMountedRef.current) {
        setActiveQuestions(mapped);
        setCurrentPart('part1');
        setCurrentQuestionIndex(0);
        toast({ title: "Test Generated", description: "Your AI speaking practice is ready!" });
      }
    } else if (genEntry.error) {
      generationStore.clearEntry('speaking');
      if (isMountedRef.current) {
        toast({ title: "Generation failed", description: genEntry.error, variant: "destructive" });
      }
    }
  }, [genEntry]); // eslint-disable-line react-hooks/exhaustive-deps

  // Apply analysis results that arrived while this component was unmounted
  useEffect(() => {
    if (analysisEntry.isGenerating) return;
    if (analysisEntry.result) {
      const { feedbackData } = analysisEntry.result;
      generationStore.clearEntry('speaking-analysis');
      if (isMountedRef.current) {
        setFeedback(feedbackData);
      }
    } else if (analysisEntry.error) {
      generationStore.clearEntry('speaking-analysis');
      if (isMountedRef.current) {
        toast({ title: "Analysis failed", description: analysisEntry.error, variant: "destructive" });
      }
    }
  }, [analysisEntry]); // eslint-disable-line react-hooks/exhaustive-deps

  const {
    isListening,
    transcript,
    interimTranscript,
    startListening,
    stopListening,
    resetTranscript,
    isSupported,
    audioLevel
  } = useSpeechRecognition();

  const getCurrentQuestion = () => {
    switch (currentPart) {
      case 'part1':
        return activeQuestions.part1[currentQuestionIndex % activeQuestions.part1.length];
      case 'part2':
        return activeQuestions.part2[currentQuestionIndex % activeQuestions.part2.length];
      case 'part3':
        return activeQuestions.part3[currentQuestionIndex % activeQuestions.part3.length];
    }
  };

  const generateNewQuestion = async () => {
    if (isGatingLoading) return;
    if (!canAccess("speaking")) {
      setShowUpgradeModal(true);
      return;
    }

    let currentSession;
    try {
      const { data: { session: refreshedSession } } = await supabase.auth.refreshSession();
      currentSession = refreshedSession || (await supabase.auth.getSession()).data.session;
    } catch (e) {
      console.error(e);
    }
    
    if (!currentSession) {
      toast({ title: "Authentication required", description: "You must be logged in.", variant: "destructive" });
      return;
    }

    resetTranscript();
    setFeedback(null);
    generationStore.startGen('speaking');
    try {
      const { data, error } = await supabase.functions.invoke("generate-speaking", {
        body: { difficulty: "medium" },
        headers: {
          Authorization: `Bearer ${currentSession.access_token}`,
        },
      });
      if (error) throw error;
      const aiData: AISpeakingTest = data?.success ? data.data : data;
      if (aiData?.part1 && aiData?.part2 && aiData?.part3) {
        const mapped = mapAIToLegacy(aiData) as typeof FALLBACK_SPEAKING_QUESTIONS;

        // Always persist to sessionStorage (survives component unmount)
        try {
          if (user?.id) {
            const newCache: CachedSpeakingState = { activeQuestions: mapped, currentPart: "part1", currentQuestionIndex: 0, feedback: null };
            sessionStorage.setItem(`ielts-speaking-cache-${user.id}`, JSON.stringify(newCache));
            sessionStorage.setItem(`ielts-speaking-active-part-${user.id}`, "part1");
          }
        } catch (e) {
          console.error("Failed to save generation to cache:", e);
        }

        if (isMountedRef.current) {
          generationStore.clearEntry('speaking');
          setActiveQuestions(mapped);
          setCurrentPart('part1');
          setCurrentQuestionIndex(0);
          toast({ title: "Test Generated", description: "Your AI speaking practice is ready!" });
        } else {
          // Component unmounted — store result for remount to apply
          generationStore.finishGen('speaking', { mapped });
        }
      } else {
        throw new Error("Incomplete AI response");
      }
    } catch (err: any) {
      console.error("Failed to generate AI speaking questions, using fallback:", err);
      if (isMountedRef.current) {
        generationStore.clearEntry('speaking');
        // Cycle through fallback questions instead
        const maxIndex = FALLBACK_SPEAKING_QUESTIONS[currentPart].length;
        setCurrentQuestionIndex((prev) => (prev + 1) % maxIndex);
      } else {
        generationStore.failGen('speaking', err?.message || "Generation failed");
      }
    }
  };

  const handleRestartPractice = () => {
    resetTranscript();
    setFeedback(null);
    setSpeakingDuration(null);
    setAudioUrl(null);
    setActiveComparison(null);
    setShowDiffs({ naturalness: false, enhanced: false });
    setTooltipWord(null);
  };

  const handlePartChange = (part: SpeakingPart) => {
    setCurrentPart(part);
    setCurrentQuestionIndex(0);
    resetTranscript();
    setFeedback(null);
  };

  const handleStartRecording = async () => {
    if (!isSupported) {
      toast({
        title: "Browser not supported",
        description: "Speech recognition is not supported in your browser. Please use Chrome or Edge.",
        variant: "destructive",
      });
      return;
    }
    resetTranscript();
    setFeedback(null);
    setAudioUrl(null);
    setSpeakingDuration(null);
    setActiveComparison(null);
    recordingStartRef.current = Date.now();
    recordedChunksRef.current = [];

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mimeType = MediaRecorder.isTypeSupported('audio/webm') ? 'audio/webm' : 'audio/ogg';
      const recorder = new MediaRecorder(stream, { mimeType });
      recorder.ondataavailable = (e) => { if (e.data.size > 0) recordedChunksRef.current.push(e.data); };
      recorder.onstop = () => {
        const blob = new Blob(recordedChunksRef.current, { type: mimeType });
        const url = URL.createObjectURL(blob);
        setAudioUrl(url);
        stream.getTracks().forEach(t => t.stop());
      };
      recorder.start();
      mediaRecorderRef.current = recorder;
    } catch {
      // MediaRecorder not available — proceed without audio recording
    }

    startListening();
  };

  const handleStopRecording = () => {
    stopListening();
    if (recordingStartRef.current) {
      setSpeakingDuration(Math.round((Date.now() - recordingStartRef.current) / 1000));
      recordingStartRef.current = null;
    }
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current = null;
    }
  };

  const analyzeTranscript = async () => {
    // Check feature gating before analyzing
    if (!canAccess("speaking")) {
      setShowUpgradeModal(true);
      return;
    }

    const finalTranscript = transcript.trim();
    if (!finalTranscript) {
      toast({
        title: "No speech detected",
        description: "Please record your response first.",
        variant: "destructive",
      });
      return;
    }

    // Refresh session so the JWT is valid when invoking the edge function
    let currentSession;
    try {
      const { data: { session: refreshed } } = await supabase.auth.refreshSession();
      currentSession = refreshed ?? (await supabase.auth.getSession()).data.session;
    } catch (e) {
      console.error("Session refresh error:", e);
    }

    if (!currentSession) {
      toast({ title: "Authentication required", description: "Please sign in again.", variant: "destructive" });
      return;
    }

    generationStore.startGen('speaking-analysis');

    try {
      const currentQuestion = getCurrentQuestion();
      const rawContext = currentPart === 'part2'
        ? (currentQuestion as any).cueCard
        : currentPart === 'part3'
        ? (currentQuestion as any).questions?.join('\n') ?? ''
        : (currentQuestion as any).question ?? '';

      // Zod schema limits question to 2000 chars — truncate to be safe
      const questionContext = typeof rawContext === 'string'
        ? rawContext.slice(0, 1900)
        : '';

      const { data, error } = await supabase.functions.invoke("ai-analyze", {
        body: {
          type: "speaking",
          content: finalTranscript,
          speakingPart: currentPart,
          question: questionContext || undefined,
        },
        headers: {
          Authorization: `Bearer ${currentSession.access_token}`,
        },
      });

      if (error) {
        console.error("Speaking analysis invoke error:", error);
        throw error;
      }

      // Unwrap response: supabase.functions.invoke returns {success, data} wrapper
      const unwrappedData = data?.success ? data.data : data;

      // Save progress regardless of mount state
      if (unwrappedData?.overallBand && user) {
        try {
          await saveProgress({
            exam_type: "speaking",
            score: null,
            band_score: unwrappedData.overallBand,
            total_questions: null,
            correct_answers: null,
            feedback: `${currentPart.toUpperCase()}: ${(currentQuestion as any).topic || 'Practice'}`,
            completed_at: new Date().toISOString(),
            time_taken: null,
            errors_log: [],
            metadata: {
              speakingPart: currentPart,
              topic: (currentQuestion as any).topic,
              wordCount: finalTranscript.split(/\s+/).filter(Boolean).length,
            },
          });
          await refreshCounts();
        } catch (err) {
          console.error("Failed to save speaking progress:", err);
        }
      }

      // Save feedback to sessionStorage so it survives navigation
      try {
        if (user?.id) {
          const existingRaw = sessionStorage.getItem(`ielts-speaking-cache-${user.id}`);
          const existing = existingRaw ? JSON.parse(existingRaw) : {};
          sessionStorage.setItem(`ielts-speaking-cache-${user.id}`, JSON.stringify({ ...existing, feedback: unwrappedData }));
        }
      } catch { /* non-critical sessionStorage write */ }

      if (isMountedRef.current) {
        generationStore.clearEntry('speaking-analysis');
        setFeedback(unwrappedData);
      } else {
        // Component unmounted — store result for remount to apply
        generationStore.finishGen('speaking-analysis', { feedbackData: unwrappedData });
      }
    } catch (error: any) {
      console.error("Analysis error:", error);
      const msg = error.message || "Please try again later.";
      if (isMountedRef.current) {
        generationStore.clearEntry('speaking-analysis');
        toast({ title: "Analysis failed", description: msg, variant: "destructive" });
      } else {
        generationStore.failGen('speaking-analysis', msg);
      }
    }
  };

  const currentQuestion = getCurrentQuestion();
  const feedbackRef = useRef<HTMLDivElement>(null);

  // Split a paragraph of feedback into bullet-point sentences
  const toBullets = (text: string | undefined): string[] => {
    if (!text) return [];
    return text
      .split(/(?<=[.!?])\s+/)
      .map(s => s.trim())
      .filter(s => s.length > 0);
  };

  // Auto-scroll to feedback when it appears
  useEffect(() => {
    if (feedback && feedbackRef.current) {
      setTimeout(() => {
        feedbackRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }
  }, [feedback]);

  useEffect(() => {
    return () => { if (audioUrl) URL.revokeObjectURL(audioUrl); };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Generate waveform bars based on audio level
  const waveformBars = Array.from({ length: 12 }, (_, i) => {
    const baseHeight = 8;
    const maxHeight = 40;
    const variation = Math.sin((i + Date.now() / 100) * 0.5) * 0.3 + 0.7;
    const height = isListening
      ? baseHeight + (maxHeight - baseHeight) * audioLevel * variation
      : baseHeight;
    return height;
  });

  // ── Utility: Web Speech TTS ────────────────────────────────────────────────
  const speakText = (text: string, gender: 'male' | 'female') => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    utterance.rate = 0.95;
    const voices = window.speechSynthesis.getVoices();
    const enVoices = voices.filter(v => v.lang.startsWith('en'));
    if (gender === 'male') {
      utterance.voice = enVoices.find(v => /david|guy|aaron|james|male/i.test(v.name)) ?? enVoices[0] ?? null;
    } else {
      utterance.voice = enVoices.find(v => /samantha|aria|zira|female|google us english/i.test(v.name)) ?? enVoices[1] ?? null;
    }
    window.speechSynthesis.speak(utterance);
  };

  // ── Utility: Word diff ────────────────────────────────────────────────────
  const computeDiff = (original: string, improved: string): Array<{ word: string; isNew: boolean }> => {
    const origSet = new Set(original.toLowerCase().split(/\s+/).map(w => w.replace(/[^a-z]/g, '')));
    return improved.split(/\s+/).filter(Boolean).map(word => ({
      word,
      isNew: !origSet.has(word.toLowerCase().replace(/[^a-z]/g, '')),
    }));
  };

  // ── Utility: Export result ────────────────────────────────────────────────
  const exportResult = () => {
    if (!feedback) return;
    const q = getCurrentQuestion();
    const question = (q as any).question ?? (q as any).cueCard ?? '';
    const lines = [
      'IELTS Speaking Practice — Analysis Report',
      '==========================================',
      '',
      `Question: ${question}`,
      `Speaking Part: ${currentPart.toUpperCase()}`,
      speakingDuration ? `Speaking Time: ${speakingDuration}s` : '',
      '',
      `OVERALL BAND SCORE: ${feedback.overallBand} (${feedback.bandScoreRange ?? '+/- 0.5'})`,
      `Accuracy: ${feedback.accuracyScore ?? '—'}%`,
      '',
      '--- CRITERION SCORES ---',
      `Pronunciation:              ${feedback.pronunciation?.score ?? '—'}`,
      `Task Response:              ${feedback.taskResponse?.score ?? '—'}`,
      `Fluency & Coherence:        ${feedback.fluencyCoherence?.score ?? '—'}`,
      `Lexical Resource:           ${feedback.lexicalResource?.score ?? '—'}`,
      `Grammatical Range & Acc.:   ${feedback.grammaticalRange?.score ?? '—'}`,
      '',
      '--- POLISHED TRANSCRIPT ---',
      feedback.polishedTranscript ?? '',
      '',
      '--- IMPROVED NATURALNESS ---',
      feedback.improvedNaturalness ?? '',
      '',
      '--- ENHANCED SPEECH ---',
      feedback.enhancedSpeech ?? '',
      '',
      '--- IMPROVEMENTS TO FOCUS ON ---',
      ...(feedback.improvements ?? []).map((s: string, i: number) => `${i + 1}. ${s}`),
    ].filter(l => l !== undefined).join('\n');

    const blob = new Blob([lines], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ielts-speaking-${currentPart}-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // ── Utility: confidence color ─────────────────────────────────────────────
  const getConfidenceColor = (score: number): string => {
    if (score >= 90) return '#22c55e';
    if (score >= 75) return '#f59e0b';
    if (score >= 55) return '#f97316';
    return '#ef4444';
  };

  const getScoreColor = (score: number | undefined): string => {
    if (!score) return 'text-muted-foreground';
    if (score >= 7) return 'text-green-500';
    if (score >= 5.5) return 'text-elite-gold';
    return 'text-destructive';
  };

  // ── Inline component: Accuracy Circle ────────────────────────────────────
  const AccuracyCircle = ({ score }: { score: number }) => {
    const r = 42;
    const circ = 2 * Math.PI * r;
    const offset = circ - (score / 100) * circ;
    const color = score >= 80 ? '#22c55e' : score >= 60 ? '#f59e0b' : '#ef4444';
    return (
      <svg width={100} height={100} viewBox="0 0 100 100">
        <circle cx="50" cy="50" r={r} fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="7" />
        <circle
          cx="50" cy="50" r={r} fill="none" stroke={color} strokeWidth="7"
          strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round"
          transform="rotate(-90 50 50)"
          style={{ transition: 'stroke-dashoffset 1s ease' }}
        />
        <text x="50" y="50" textAnchor="middle" dominantBaseline="middle" fontSize="17" fontWeight="300" fill={color}>
          {score}%
        </text>
      </svg>
    );
  };

  // ── Inline component: Comparison Panel ───────────────────────────────────
  const ComparisonPanel = ({
    title, improvedLabel, original, improved, showDiff, onToggleDiff,
  }: {
    title: string; improvedLabel: string;
    original: string; improved: string;
    showDiff: boolean; onToggleDiff: () => void;
  }) => {
    const diffWords = computeDiff(original, improved);
    const origCount = original.trim().split(/\s+/).filter(Boolean).length;
    const imprCount = improved.trim().split(/\s+/).filter(Boolean).length;
    return (
      <div className="mt-6">
        <h4 className="text-sm font-semibold mb-3">{title}</h4>
        <button
          onClick={onToggleDiff}
          className={`mb-4 px-4 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
            showDiff ? 'bg-teal-600/20 border-teal-500 text-teal-400' : 'border-border text-muted-foreground hover:border-teal-500 hover:text-teal-400'
          }`}
        >
          Highlight Important Differences
        </button>
        <div className="grid grid-cols-2 gap-3">
          <div className="p-4 rounded-xl bg-secondary/20 border border-border">
            <div className="flex items-center justify-between mb-2 flex-wrap gap-1">
              <span className="text-xs font-medium text-muted-foreground">Original Speech</span>
              <div className="flex gap-2">
                <button onClick={() => speakText(original, 'male')} className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1">
                  <Volume2 className="w-3 h-3" /> Male
                </button>
                <button onClick={() => speakText(original, 'female')} className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1">
                  <Volume2 className="w-3 h-3" /> Female
                </button>
              </div>
            </div>
            <p className="text-sm text-foreground/80 leading-relaxed">{original}</p>
            <p className="text-xs text-muted-foreground mt-2">Word Count: {origCount}</p>
          </div>
          <div className="p-4 rounded-xl bg-secondary/20 border border-border">
            <div className="flex items-center justify-between mb-2 flex-wrap gap-1">
              <span className="text-xs font-medium text-muted-foreground">{improvedLabel}</span>
              <div className="flex gap-2">
                <button onClick={() => speakText(improved, 'male')} className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1">
                  <Volume2 className="w-3 h-3" /> Male
                </button>
                <button onClick={() => speakText(improved, 'female')} className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1">
                  <Volume2 className="w-3 h-3" /> Female
                </button>
              </div>
            </div>
            <p className="text-sm text-foreground/80 leading-relaxed">
              {showDiff
                ? diffWords.map((dw, i) => (
                    <span key={i} className={dw.isNew ? 'bg-yellow-500/25 text-yellow-300 rounded px-0.5' : ''}>
                      {dw.word}{' '}
                    </span>
                  ))
                : improved}
            </p>
            <p className="text-xs text-muted-foreground mt-2">Word Count: {imprCount}</p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <DashboardLayout>
      <div className="max-w-4xl">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 rounded-xl bg-elite-gold/10 flex items-center justify-center">
            <Mic className="w-6 h-6 text-elite-gold" />
          </div>
          <div>
            <h1 className="text-2xl font-light">Speaking Practice</h1>
            <p className="text-sm text-muted-foreground">Real-time voice transcription with AI analysis</p>
          </div>
        </div>

        {/* Part Selection */}
        <div className="flex gap-2 mb-6">
          {(['part1', 'part2', 'part3'] as const).map((part) => (
            <Button
              key={part}
              variant={currentPart === part ? "default" : "outline"}
              onClick={() => handlePartChange(part)}
              className="flex-1"
            >
              Part {part.slice(-1)}
              <span className="ml-2 text-xs opacity-70">
                {part === 'part1' ? 'Introduction' : part === 'part2' ? 'Cue Card' : 'Discussion'}
              </span>
            </Button>
          ))}
        </div>

        {/* Question Card */}
        <div className="glass-card p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium">
                {currentPart === 'part1' ? (currentQuestion as any).topic : 
                 currentPart === 'part2' ? (currentQuestion as any).topic :
                 (currentQuestion as any).topic}
              </span>
              {currentPart === 'part2' && (
                <span className="text-xs text-muted-foreground">
                  Prep: {(currentQuestion as any).prepTime} | Speak: {(currentQuestion as any).speakTime}
                </span>
              )}
            </div>
            <Button variant="ghost" size="sm" onClick={() => !canAccess("speaking") ? setShowUpgradeModal(true) : generateNewQuestion()} disabled={isGenerating}>
              {isGenerating
                ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Generating…</>
                : <><RefreshCw className="w-4 h-4 mr-2" />New Question</>
              }
            </Button>
          </div>
          
          {currentPart === 'part1' && (
            <p className="text-foreground/80 leading-relaxed text-lg">
              {(currentQuestion as any).question}
            </p>
          )}
          
          {currentPart === 'part2' && (
            <div className="bg-secondary/30 rounded-xl p-4">
              <pre className="whitespace-pre-wrap text-foreground/80 leading-relaxed font-sans">
                {(currentQuestion as any).cueCard}
              </pre>
            </div>
          )}
          
          {currentPart === 'part3' && (
            <div className="space-y-3">
              {(currentQuestion as any).questions.map((q: string, i: number) => (
                <div key={i} className="flex items-start gap-2">
                  <ChevronRight className="w-4 h-4 text-primary mt-1 flex-shrink-0" />
                  <p className="text-foreground/80 leading-relaxed">{q}</p>
                </div>
              ))}
            </div>
          )}

          <p className="text-xs text-muted-foreground mt-4">
            {currentPart === 'part1' 
              ? "Answer in 2-3 sentences. This simulates the examiner's introductory questions."
              : currentPart === 'part2'
              ? "You have 1 minute to prepare, then speak for 1-2 minutes on this topic."
              : "Discuss these abstract questions related to the topic. Aim for detailed, analytical responses."}
          </p>
        </div>

        {/* Recording Controls */}
        <div className="glass-card p-8 mb-6">
          <div className="flex flex-col items-center">
            {/* Waveform Visualization */}
            <div className={`w-full max-w-md h-24 flex items-center justify-center gap-1 mb-6 rounded-xl transition-all duration-300 ${
              isListening 
                ? "bg-destructive/10" 
                : transcript 
                ? "bg-green-500/10" 
                : "bg-secondary/30"
            }`}>
              {isListening ? (
                waveformBars.map((height, i) => (
                  <div
                    key={i}
                    className="w-2 bg-destructive rounded-full transition-all duration-75"
                    style={{ height: `${height}px` }}
                  />
                ))
              ) : transcript ? (
                <Volume2 className="w-12 h-12 text-green-500" />
              ) : (
                <Mic className="w-12 h-12 text-muted-foreground" />
              )}
            </div>

            {/* Browser Support Warning */}
            {!isSupported && (
              <p className="text-sm text-destructive mb-4">
                ⚠️ Speech recognition not supported. Please use Chrome or Edge.
              </p>
            )}

            {/* Controls */}
            <div className="flex items-center gap-4">
              {!isListening && !transcript && (
                <Button 
                  variant="neumorphicPrimary" 
                  size="lg" 
                  onClick={handleStartRecording}
                  disabled={!isSupported}
                >
                  <Mic className="w-5 h-5 mr-2" />
                  Start Speaking
                </Button>
              )}
              
              {isListening && (
                <Button variant="destructive" size="lg" onClick={handleStopRecording}>
                  <Square className="w-5 h-5 mr-2" />
                  Stop Recording
                </Button>
              )}

              {transcript && !isListening && (
                <>
                  <Button variant="glass" onClick={handleStartRecording}>
                    <Mic className="w-5 h-5 mr-2" />
                    Re-record
                  </Button>
                  <Button
                    variant="neumorphicPrimary"
                    onClick={analyzeTranscript}
                    disabled={isAnalyzing}
                  >
                    {isAnalyzing ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        Analyzing...
                      </>
                    ) : (
                      <>
                        <Play className="w-5 h-5 mr-2" />
                        Analyze Response
                      </>
                    )}
                  </Button>
                </>
              )}
            </div>

            {isListening && (
              <p className="text-sm text-destructive mt-4 animate-pulse">
                🎤 Recording in progress... Speak naturally
              </p>
            )}
          </div>
        </div>

        {/* Live Transcription */}
        {(transcript || interimTranscript) && (
          <div className="glass-card p-6 mb-6">
            <h2 className="text-lg font-light mb-4 flex items-center gap-2">
              Transcription
              {isListening && <span className="w-2 h-2 rounded-full bg-destructive animate-pulse" />}
            </h2>
            <p className="text-foreground/80 leading-relaxed">
              {transcript}
              {interimTranscript && (
                <span className="text-muted-foreground italic">{interimTranscript}</span>
              )}
            </p>
            {transcript.includes('[pause]') && (
              <p className="text-xs text-muted-foreground mt-3">
                💡 <span className="text-elite-gold">[pause]</span> markers indicate silences longer than 1.5 seconds
              </p>
            )}
          </div>
        )}

        {/* AI Feedback */}
        {feedback && (
          <div ref={feedbackRef} className="space-y-4">

            {/* ── 1. Accuracy + Band Score ───────────────────────────── */}
            <div className="glass-card p-6">
              <div className="flex flex-wrap items-center justify-between gap-6">
                <div className="flex flex-col items-center gap-1">
                  <AccuracyCircle score={feedback.accuracyScore ?? 72} />
                  <span className="text-xs text-muted-foreground">Accuracy</span>
                </div>
                <div className="flex flex-col items-center flex-1 min-w-[120px]">
                  <p className="text-xs text-muted-foreground mb-1">Overall Band Score</p>
                  <span className="text-6xl font-light text-elite-gold leading-none">
                    {feedback.overallBand?.toFixed(1) ?? "—"}
                  </span>
                  <span className="text-xs text-muted-foreground mt-1">
                    ({feedback.bandScoreRange ?? "+/- 0.5"})
                  </span>
                </div>
                <div className="flex flex-col gap-2 items-end">
                  <Button variant="outline" size="sm" onClick={exportResult}>
                    <Download className="w-4 h-4 mr-2" />
                    Export Result to Word
                  </Button>
                  <Button variant="ghost" size="sm" onClick={handleRestartPractice}>
                    <RefreshCw className="w-4 h-4 mr-2" />
                    New Response
                  </Button>
                </div>
              </div>
            </div>

            {/* ── 2. Polished Transcript ─────────────────────────────── */}
            {feedback.polishedTranscript && (
              <div className="glass-card p-6">
                <div className="flex items-center gap-3 mb-3 flex-wrap">
                  <span className="text-sm font-semibold">Polished transcript:</span>
                  <button
                    onClick={() => speakText(feedback.polishedTranscript, 'male')}
                    className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-secondary/40 text-xs text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <Volume2 className="w-3 h-3" /> Male
                  </button>
                  <button
                    onClick={() => speakText(feedback.polishedTranscript, 'female')}
                    className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-secondary/40 text-xs text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <Volume2 className="w-3 h-3" /> Female
                  </button>
                </div>
                <p className="text-sm text-foreground/80 leading-relaxed">{feedback.polishedTranscript}</p>
              </div>
            )}

            {/* ── 3. Word Confidence Display ────────────────────────── */}
            {feedback.wordConfidences && feedback.wordConfidences.length > 0 && (
              <div className="glass-card p-6">
                <p className="text-xs text-muted-foreground mb-4">
                  Actual audio transcript (What native speakers are likely to hear):
                </p>
                <div className="flex flex-wrap gap-x-3 gap-y-4">
                  {feedback.wordConfidences.map((wc: { word: string; confidence: number; feedback: string }, i: number) => (
                    <div
                      key={i}
                      className="flex flex-col items-center cursor-pointer"
                      onClick={() => setTooltipWord(tooltipWord?.word === wc.word + i ? null : { word: wc.word, feedback: wc.feedback })}
                    >
                      <span className="text-[10px] font-mono font-medium leading-none mb-1" style={{ color: getConfidenceColor(wc.confidence) }}>
                        {wc.confidence}%
                      </span>
                      <span className="text-sm font-medium" style={{ color: getConfidenceColor(wc.confidence) }}>
                        {wc.word}
                      </span>
                    </div>
                  ))}
                </div>
                {tooltipWord && (
                  <div className="mt-4 p-3 rounded-lg bg-secondary/40 border border-border flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-medium">"{tooltipWord.word}"</p>
                      <p className="text-xs text-muted-foreground mt-1">{tooltipWord.feedback}</p>
                    </div>
                    <button onClick={() => setTooltipWord(null)} className="text-muted-foreground hover:text-foreground text-xs shrink-0">✕</button>
                  </div>
                )}
                <p className="text-xs text-muted-foreground mt-4">Tips: Click on each word to see feedback.</p>
              </div>
            )}

            {/* ── 4. Criterion Cards ────────────────────────────────── */}
            {[
              { label: "Pronunciation",              data: feedback.pronunciation },
              { label: "Task Response",              data: feedback.taskResponse },
              { label: "Fluency & Coherence",        data: feedback.fluencyCoherence },
              { label: "Lexical Resource",           data: feedback.lexicalResource },
              { label: "Grammatical Range & Accuracy", data: feedback.grammaticalRange },
            ].filter(c => c.data).map(criterion => (
              <div key={criterion.label} className="glass-card p-6 text-center">
                <h3 className="text-base font-semibold mb-2">{criterion.label}</h3>
                <p className={`text-4xl font-light mb-3 ${getScoreColor(criterion.data.score)}`}>
                  {criterion.data.score?.toFixed(1) ?? "—"}
                </p>
                <p className="text-sm text-muted-foreground leading-relaxed max-w-xl mx-auto">
                  {criterion.data.feedback}
                </p>
                {/* Extra detail for specific criteria */}
                {criterion.label === "Lexical Resource" && criterion.data.suggestions?.length > 0 && (
                  <div className="mt-3 flex flex-wrap justify-center gap-2">
                    {criterion.data.suggestions.slice(0, 3).map((s: string, i: number) => (
                      <span key={i} className="px-2 py-0.5 rounded-full bg-accent/10 text-accent text-xs">{s}</span>
                    ))}
                  </div>
                )}
                {criterion.label === "Grammatical Range & Accuracy" && criterion.data.errorsFound?.length > 0 && (
                  <ul className="mt-3 space-y-1">
                    {criterion.data.errorsFound.slice(0, 3).map((e: string, i: number) => (
                      <li key={i} className="text-xs text-muted-foreground flex items-start gap-1.5 text-left max-w-md mx-auto">
                        <span className="text-destructive mt-0.5 shrink-0">×</span>{e}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}

            {/* ── 5. Priority Actions ───────────────────────────────── */}
            {feedback.improvements && feedback.improvements.length > 0 && (
              <div className="glass-card p-6 border border-elite-gold/20">
                <h3 className="text-sm font-semibold text-elite-gold uppercase tracking-wide mb-4">
                  What to focus on next
                </h3>
                <ol className="space-y-3">
                  {feedback.improvements.slice(0, 3).map((item: string, i: number) => (
                    <li key={i} className="flex items-start gap-3">
                      <span className="w-6 h-6 rounded-full bg-elite-gold/20 text-elite-gold text-xs font-semibold flex items-center justify-center shrink-0 mt-0.5">
                        {i + 1}
                      </span>
                      <p className="text-sm text-foreground/80 leading-relaxed">{item}</p>
                    </li>
                  ))}
                </ol>
              </div>
            )}

            {/* ── 6. Audio Playback + Naturalness / Enhanced Comparison */}
            <div className="glass-card p-6">
              {audioUrl && (
                <div className="mb-4">
                  <p className="text-xs text-muted-foreground mb-2">Your recording:</p>
                  <audio src={audioUrl} controls className="w-full h-10" />
                </div>
              )}
              {speakingDuration && (
                <p className="text-sm text-muted-foreground mb-4">Speaking Time: {speakingDuration}s</p>
              )}
              <div className="flex gap-2 flex-wrap">
                <button
                  onClick={() => setActiveComparison(prev => prev === 'naturalness' ? null : 'naturalness')}
                  className={`px-5 py-2 rounded-lg text-sm font-medium transition-colors ${
                    activeComparison === 'naturalness'
                      ? 'bg-teal-600 text-white'
                      : 'bg-secondary/40 text-foreground/70 hover:bg-secondary/60'
                  }`}
                >
                  Improve Naturalness
                </button>
                <button
                  onClick={() => setActiveComparison(prev => prev === 'enhanced' ? null : 'enhanced')}
                  className={`px-5 py-2 rounded-lg text-sm font-medium transition-colors ${
                    activeComparison === 'enhanced'
                      ? 'bg-blue-600 text-white'
                      : 'bg-secondary/40 text-foreground/70 hover:bg-secondary/60'
                  }`}
                >
                  Enhance Speech
                </button>
              </div>

              {activeComparison === 'naturalness' && feedback.improvedNaturalness && (
                <ComparisonPanel
                  title="Improved Naturalness Comparison"
                  improvedLabel="Improved Speech"
                  original={transcript}
                  improved={feedback.improvedNaturalness}
                  showDiff={showDiffs.naturalness}
                  onToggleDiff={() => setShowDiffs(prev => ({ ...prev, naturalness: !prev.naturalness }))}
                />
              )}

              {activeComparison === 'enhanced' && feedback.enhancedSpeech && (
                <ComparisonPanel
                  title="Enhanced Speech Comparison"
                  improvedLabel="Enhanced Speech"
                  original={transcript}
                  improved={feedback.enhancedSpeech}
                  showDiff={showDiffs.enhanced}
                  onToggleDiff={() => setShowDiffs(prev => ({ ...prev, enhanced: !prev.enhanced }))}
                />
              )}
            </div>

          </div>
        )}
      </div>

      <UpgradeModal
        isOpen={showUpgradeModal}
        onClose={() => setShowUpgradeModal(false)}
        featureName="Speaking"
      />
    </DashboardLayout>
  );
}
