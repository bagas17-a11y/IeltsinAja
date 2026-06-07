import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { cn } from "@/lib/utils";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Headphones,
  Play,
  Pause,
  Square,
  Clock,
  CheckCircle2,
  XCircle,
  FileText,
  RefreshCw,
  Loader2,
  ChevronLeft,
  Volume2,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { useSessionStorage } from "@/hooks/useLocalStorage";
import { useUserProgress } from "@/hooks/useUserProgress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ListeningCheatsheet } from "@/components/listening/ListeningCheatsheet";

const NUMBER_WORDS: Record<string, string> = {
  "0": "zero", "1": "one", "2": "two", "3": "three", "4": "four",
  "5": "five", "6": "six", "7": "seven", "8": "eight", "9": "nine",
  "10": "ten", "11": "eleven", "12": "twelve", "13": "thirteen",
  "14": "fourteen", "15": "fifteen", "16": "sixteen", "17": "seventeen",
  "18": "eighteen", "19": "nineteen", "20": "twenty", "30": "thirty",
  "40": "forty", "50": "fifty", "60": "sixty", "70": "seventy",
  "80": "eighty", "90": "ninety", "100": "hundred",
};
const NUMBER_WORDS_REVERSE = Object.fromEntries(
  Object.entries(NUMBER_WORDS).map(([k, v]) => [v, k])
);

const PART_NUMBER_WORDS = ["one", "two", "three", "four"];

const DIFFICULTY_BADGE: Record<string, "destructive" | "secondary" | "default"> = {
  hard: "destructive",
  easy: "secondary",
};

interface QuestionItem {
  number: number;
  label?: string;
  question?: string;
  statement?: string;
  sentence?: string;
  options?: Record<string, string>;
  answer: string;
  transcript_quote: string;
  explanation: string;
}

interface QuestionGroup {
  type: string;
  title?: string;
  instruction: string;
  question_range: [number, number];
  items: QuestionItem[];
  options_pool?: Record<string, string>;
  template?: string;
  group_transcript?: string;
}

interface ListeningPart {
  part_number: number;
  context: string;
  transcript: string;
  question_groups: QuestionGroup[];
}

interface ListeningTest {
  id: string;
  title: string;
  difficulty: string;
  totalQuestions: number;
  durationMinutes: number;
  topicTags: string[];
  sections: ListeningPart[];
}

interface UserAnswers {
  [questionId: string]: string;
}

interface CachedListeningState {
  testId: string;
  testContext?: ListeningTest;
  answers: UserAnswers;
  notes: string;
  hasStarted: boolean;
  playedParts?: Record<number, boolean>;
  completedParts?: Record<number, boolean>;
  timeRemaining: number;
  timerEndAt?: number | null;
  activePart: number;
  isSubmitted: boolean;
  score?: number;
  results?: Record<string, { correct: boolean; correctAnswer: string }>;
}

const QUESTION_TYPE_LABEL: Record<string, string> = {
  form_completion: "Form Completion",
  note_completion: "Note Completion",
  sentence_completion: "Sentence Completion",
  multiple_choice: "Multiple Choice",
  matching: "Matching",
  table_completion: "Table Completion",
};

type SpeakerTurn = { speaker: string | null; text: string };

const parseTranscriptToTurns = (transcript: string): SpeakerTurn[] => {
  const rawTurns: SpeakerTurn[] = [];
  for (const raw of transcript.split("\n")) {
    const line = raw.trim();
    if (!line) continue;
    const m = line.match(/^([A-Z][A-Z0-9 ]{0,20}):\s*(.+)$/);
    if (m) {
      rawTurns.push({ speaker: m[1].trim(), text: m[2].trim() });
    } else if (rawTurns.length > 0) {
      rawTurns[rawTurns.length - 1].text += " " + line;
    } else {
      rawTurns.push({ speaker: null, text: line });
    }
  }
  // Merge consecutive same-speaker turns
  const merged: SpeakerTurn[] = [];
  for (const turn of rawTurns) {
    if (merged.length > 0 && merged[merged.length - 1].speaker === turn.speaker) {
      merged[merged.length - 1].text += " " + turn.text;
    } else {
      merged.push({ ...turn });
    }
  }
  return merged;
};

export default function ListeningModule() {
  const { user, profile } = useAuth();
  const isElite = profile?.subscription_tier === "elite";

  const [tests, setTests] = useState<ListeningTest[]>([]);
  const [isLoadingTests, setIsLoadingTests] = useState(true);
  const [currentTest, setCurrentTest] = useState<ListeningTest | null>(null);
  const [difficultyFilter, setDifficultyFilter] = useState<"all" | "easy" | "medium" | "hard">("all");

  const [answers, setAnswers] = useState<UserAnswers>({});
  const [notes, setNotes] = useState("");
  const [hasStarted, setHasStarted] = useState(false);
  const [playedParts, setPlayedParts] = useState<Record<number, boolean>>({});
  const [completedParts, setCompletedParts] = useState<Record<number, boolean>>({});
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [playingPart, setPlayingPart] = useState<number | null>(null);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [timerEndAt, setTimerEndAt] = useState<number | null>(null);
  const [activePart, setActivePart] = useState(1);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [score, setScore] = useState<number | null>(null);
  const [results, setResults] = useState<Record<string, { correct: boolean; correctAnswer: string }>>({});

  // Audio player state
  const [audioCurrentTime, setAudioCurrentTime] = useState(0);
  const [audioDuration, setAudioDuration] = useState(0);
  const [isSeeking, setIsSeeking] = useState(false);

  const audioRef = useRef<HTMLAudioElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const speechRef = useRef<any>(null);
  const audioBlobUrlRef = useRef<string | null>(null);
  const isPausedRef = useRef(false);
  const abortRef = useRef<AbortController | null>(null);
  const [isLoadingAudio, setIsLoadingAudio] = useState(false);

  const LISTENING_SESSION_PREFIX = `ielts-listening-${user?.id || "guest"}`;

  const [cachedState, setCachedState] = useSessionStorage<CachedListeningState | null>(
    `${LISTENING_SESSION_PREFIX}-active`,
    null
  );
  const { saveProgress } = useUserProgress();

  // Fetch tests from DB on mount
  useEffect(() => {
    const fetchTests = async () => {
      const { data, error } = await supabase
        .from("listening_test_library")
        .select("*")
        .eq("is_active", true)
        .order("created_at");

      if (error) {
        console.error("Failed to fetch listening tests:", error);
      } else if (data) {
        setTests(
          data.map((t) => ({
            id: t.id,
            title: t.title,
            difficulty: t.difficulty,
            totalQuestions: t.total_questions,
            durationMinutes: t.duration_minutes,
            topicTags: t.topic_tags || [],
            sections: t.sections as ListeningPart[],
          }))
        );
      }
      setIsLoadingTests(false);
    };
    fetchTests();
  }, []);

  // Restore session state
  useEffect(() => {
    if (!user?.id) return;
    const activeKey = `${LISTENING_SESSION_PREFIX}-active`;
    try {
      const stored = sessionStorage.getItem(activeKey);
      if (!stored || stored === "null") return;
      const parsed = JSON.parse(stored) as CachedListeningState;
      if (!parsed) return;

      const cachedTest = parsed.testContext;
      const isValidStructure =
        cachedTest &&
        Array.isArray(cachedTest.sections) &&
        cachedTest.sections.length > 0 &&
        cachedTest.sections.every(
          (s) => Array.isArray(s?.question_groups) && s.question_groups.length > 0
        );

      if (!isValidStructure) {
        sessionStorage.removeItem(activeKey);
        setCachedState(null);
        return;
      }

      setCachedState(parsed);
      if (!currentTest) {
        setCurrentTest(cachedTest);
        setAnswers(parsed.answers || {});
        setNotes(parsed.notes || "");
        setHasStarted(parsed.hasStarted || false);
        setPlayedParts(parsed.playedParts || {});
        setCompletedParts(parsed.completedParts || {});
        setTimeRemaining(parsed.timeRemaining ?? cachedTest.durationMinutes * 60);
        setTimerEndAt(parsed.timerEndAt ?? null);
        setActivePart(parsed.activePart || 1);
        setIsSubmitted(parsed.isSubmitted || false);
        if (parsed.score !== undefined) setScore(parsed.score);
        if (parsed.results) setResults(parsed.results);
      }
    } catch {
      sessionStorage.removeItem(activeKey);
      setCachedState(null);
    }
  }, [user?.id]);

  // Persist session state
  useEffect(() => {
    if (currentTest) {
      const newState: CachedListeningState = {
        testId: currentTest.id,
        testContext: currentTest,
        answers,
        notes,
        hasStarted,
        playedParts,
        completedParts,
        timeRemaining,
        timerEndAt,
        activePart,
        isSubmitted,
        score: score ?? undefined,
        results: Object.keys(results).length > 0 ? results : undefined,
      };
      setCachedState(newState);
      if (user?.id) sessionStorage.setItem(`${LISTENING_SESSION_PREFIX}-active`, JSON.stringify(newState));
    }
  }, [currentTest, answers, notes, hasStarted, playedParts, completedParts, timeRemaining, timerEndAt, activePart, isSubmitted, score, results]);

  // Timer
  useEffect(() => {
    if (hasStarted && !isSubmitted && timerEndAt) {
      timerRef.current = setInterval(() => {
        const remaining = Math.max(0, Math.ceil((timerEndAt - Date.now()) / 1000));
        setTimeRemaining(remaining);
        if (remaining <= 0) {
          handleSubmit();
          if (timerRef.current) clearInterval(timerRef.current);
        }
      }, 1000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [hasStarted, isSubmitted, timerEndAt]);

  // Audio element event listeners (time/duration tracking)
  useEffect(() => {
    const el = audioRef.current;
    if (!el) return;

    const onTimeUpdate = () => {
      if (!isSeeking) setAudioCurrentTime(el.currentTime || 0);
    };
    const onDurationChange = () => {
      if (Number.isFinite(el.duration)) setAudioDuration(el.duration || 0);
    };
    const onLoadedMetadata = () => {
      if (Number.isFinite(el.duration)) setAudioDuration(el.duration || 0);
      setAudioCurrentTime(el.currentTime || 0);
    };
    const onEnded = () => {
      setIsPlaying(false);
      setIsPaused(false);
      if (playingPart !== null) {
        setCompletedParts((prev) => ({ ...prev, [playingPart]: true }));
      }
      setPlayingPart(null);
    };

    el.addEventListener("timeupdate", onTimeUpdate);
    el.addEventListener("durationchange", onDurationChange);
    el.addEventListener("loadedmetadata", onLoadedMetadata);
    el.addEventListener("ended", onEnded);

    return () => {
      el.removeEventListener("timeupdate", onTimeUpdate);
      el.removeEventListener("durationchange", onDurationChange);
      el.removeEventListener("loadedmetadata", onLoadedMetadata);
      el.removeEventListener("ended", onEnded);
    };
  }, [isSeeking, playingPart]);

  const startTest = async (test: ListeningTest) => {
    if (audioRef.current) { audioRef.current.pause(); audioRef.current.src = ""; }
    if (audioBlobUrlRef.current) { URL.revokeObjectURL(audioBlobUrlRef.current); audioBlobUrlRef.current = null; }
    speechRef.current = null;

    const newCache: CachedListeningState = {
      testId: test.id,
      testContext: test,
      answers: {},
      notes: "",
      hasStarted: false,
      playedParts: {},
      completedParts: {},
      timeRemaining: test.durationMinutes * 60,
      timerEndAt: null,
      activePart: 1,
      isSubmitted: false,
    };

    if (user?.id) sessionStorage.setItem(`${LISTENING_SESSION_PREFIX}-active`, JSON.stringify(newCache));

    setCurrentTest(test);
    setAnswers({});
    setNotes("");
    setHasStarted(false);
    setPlayedParts({});
    setCompletedParts({});
    setIsPlaying(false);
    setIsPaused(false);
    setPlayingPart(null);
    setIsSubmitted(false);
    setScore(null);
    setResults({});
    setActivePart(1);
    setTimeRemaining(test.durationMinutes * 60);
    setTimerEndAt(null);
    setAudioCurrentTime(0);
    setAudioDuration(0);

    if (user) {
      try {
        await saveProgress({
          exam_type: "listening",
          score: null,
          band_score: null,
          total_questions: null,
          correct_answers: null,
          feedback: `Started: ${test.title}`,
          completed_at: new Date().toISOString(),
          time_taken: null,
          errors_log: [],
          metadata: { testId: test.id, testTitle: test.title, difficulty: test.difficulty, status: "started" },
        });
      } catch (err) {
        console.error("Failed to save initial progress:", err);
      }
    }
  };

  const fetchTTS = async (text: string, voice: string, signal: AbortSignal): Promise<Blob> => {
    const res = await fetch("https://api.openai.com/v1/audio/speech", {
      method: "POST",
      signal,
      headers: {
        Authorization: `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ model: "tts-1-hd", input: text.slice(0, 4096), voice, speed: 0.88 }),
    });
    if (!res.ok) {
      const err = await res.text().catch(() => "");
      throw new Error(`TTS ${res.status}: ${err}`);
    }
    return res.blob();
  };

  const speakPart = useCallback(async (partNumber: number) => {
    if (!currentTest) return;
    const section = currentTest.sections[partNumber - 1];
    if (!section?.transcript) return;

    if (audioRef.current) { audioRef.current.pause(); audioRef.current.src = ""; }
    if (audioBlobUrlRef.current) { URL.revokeObjectURL(audioBlobUrlRef.current); audioBlobUrlRef.current = null; }
    abortRef.current?.abort();

    const token = Symbol();
    speechRef.current = token;
    isPausedRef.current = false;
    const abort = new AbortController();
    abortRef.current = abort;

    setPlayingPart(partNumber);
    setIsPlaying(false);
    setIsPaused(false);
    setIsLoadingAudio(true);
    setAudioCurrentTime(0);
    setAudioDuration(0);
    setPlayedParts((prev) => ({ ...prev, [partNumber]: true }));

    // Part info
    const groups = section.question_groups;
    const qStart = groups[0].question_range[0];
    const qEnd = groups[groups.length - 1].question_range[1];
    const partWord = PART_NUMBER_WORDS[partNumber - 1] ?? partNumber.toString();
    const splitGroupIdx = groups.length > 1 ? 1 : null;
    const splitQ = splitGroupIdx !== null ? groups[splitGroupIdx].question_range[0] : null;

    // Parse the full transcript into turns
    const allTurns = parseTranscriptToTurns(section.transcript);

    // Determine speaker voices across the entire part
    const SPEAKER_VOICES = ["fable", "nova", "onyx", "shimmer"];
    const uniqueSpeakers = [...new Set(allTurns.map((t) => t.speaker).filter(Boolean) as string[])];
    const speakerVoice: Record<string, string> = { NARRATOR: "alloy" };
    uniqueSpeakers.forEach((sp, i) => { speakerVoice[sp] = SPEAKER_VOICES[i % SPEAKER_VOICES.length]; });

    // Split turns at midpoint (or use per-group transcripts when provided)
    let group0Turns: SpeakerTurn[] = allTurns;
    let group1Turns: SpeakerTurn[] = [];
    if (splitGroupIdx !== null) {
      if (groups[0].group_transcript) {
        group0Turns = parseTranscriptToTurns(groups[0].group_transcript);
        if (groups[splitGroupIdx].group_transcript) {
          group1Turns = parseTranscriptToTurns(groups[splitGroupIdx].group_transcript!);
        } else {
          // No second group transcript: fall back to the remainder of the full transcript by midpoint
          const mid = Math.ceil(allTurns.length / 2);
          group1Turns = allTurns.slice(mid);
        }
      } else if (groups[splitGroupIdx].group_transcript) {
        group1Turns = parseTranscriptToTurns(groups[splitGroupIdx].group_transcript!);
        const mid = Math.ceil(allTurns.length / 2);
        group0Turns = allTurns.slice(0, mid);
      } else {
        const mid = Math.ceil(allTurns.length / 2);
        group0Turns = allTurns.slice(0, mid);
        group1Turns = allTurns.slice(mid);
      }
    }

    // Update unique speakers in case group transcripts introduced new ones
    const allKnownTurns = [...group0Turns, ...group1Turns];
    for (const t of allKnownTurns) {
      if (t.speaker && !(t.speaker in speakerVoice)) {
        const nextIdx = Object.keys(speakerVoice).length - 1; // exclude NARRATOR
        speakerVoice[t.speaker] = SPEAKER_VOICES[nextIdx % SPEAKER_VOICES.length];
      }
    }

    const voiceFor = (speaker: string | null): string =>
      speaker ? (speakerVoice[speaker] ?? SPEAKER_VOICES[0]) : SPEAKER_VOICES[0];

    // Build the IELTS-format segments
    const segments: { text: string; voice: string }[] = [];

    const firstHalfEnd = splitQ ? splitQ - 1 : qEnd;
    segments.push({
      text: `IELTS Listening. Part ${partWord}. Questions ${qStart} to ${qEnd}. ${section.context}. You now have some time to look at Questions ${qStart} to ${firstHalfEnd}.`,
      voice: "alloy",
    });
    segments.push({
      text: `Now listen carefully and answer Questions ${qStart} to ${firstHalfEnd}.`,
      voice: "alloy",
    });
    for (const turn of group0Turns) {
      if (!turn.text.trim()) continue;
      segments.push({ text: turn.text, voice: voiceFor(turn.speaker) });
    }
    if (splitQ !== null) {
      segments.push({
        text: `Before you hear the rest of Part ${partWord}, look at Questions ${splitQ} to ${qEnd}. Now listen and answer Questions ${splitQ} to ${qEnd}.`,
        voice: "alloy",
      });
      for (const turn of group1Turns) {
        if (!turn.text.trim()) continue;
        segments.push({ text: turn.text, voice: voiceFor(turn.speaker) });
      }
    }
    segments.push({ text: `That is the end of Part ${partWord}.`, voice: "alloy" });

    if (segments.length === 0) { setIsLoadingAudio(false); return; }

    try {
      const blobs = await Promise.all(segments.map((s) => fetchTTS(s.text, s.voice, abort.signal)));
      if (speechRef.current !== token) return;

      // Concatenate MP3 blobs into a single blob
      const combinedBlob = new Blob(blobs, { type: "audio/mpeg" });
      const url = URL.createObjectURL(combinedBlob);
      audioBlobUrlRef.current = url;

      if (!audioRef.current) { setIsLoadingAudio(false); return; }
      audioRef.current.src = url;
      audioRef.current.onended = () => {
        if (speechRef.current !== token) return;
        setIsPlaying(false);
        setIsPaused(false);
        setPlayingPart(null);
        setCompletedParts((prev) => ({ ...prev, [partNumber]: true }));
        if (audioBlobUrlRef.current) {
          URL.revokeObjectURL(audioBlobUrlRef.current);
          audioBlobUrlRef.current = null;
        }
        speechRef.current = null;
      };
      audioRef.current.onerror = () => {
        if (speechRef.current !== token) return;
        setIsPlaying(false);
        setIsPaused(false);
        setPlayingPart(null);
        if (audioBlobUrlRef.current) {
          URL.revokeObjectURL(audioBlobUrlRef.current);
          audioBlobUrlRef.current = null;
        }
        speechRef.current = null;
      };
      await audioRef.current.play();
      setIsPlaying(true);
      setIsLoadingAudio(false);
    } catch (err) {
      if (abort.signal.aborted || speechRef.current !== token) return;
      const msg = err instanceof Error ? err.message : String(err);
      console.error("TTS error:", msg);
      toast.error(`Audio error: ${msg}`);
      setIsLoadingAudio(false);
      setIsPlaying(false);
      setPlayingPart(null);
      speechRef.current = null;
    }
  }, [currentTest]);

  const handlePlay = () => {
    if (!currentTest) return;
    if (!hasStarted) {
      setHasStarted(true);
      setTimerEndAt(Date.now() + timeRemaining * 1000);
    }
    if (isPaused && playingPart === activePart) {
      isPausedRef.current = false;
      if (audioRef.current?.src) audioRef.current.play();
      setIsPaused(false);
      setIsPlaying(true);
      return;
    }
    speakPart(activePart);
  };

  const handlePause = () => {
    if (!isPlaying) return;
    isPausedRef.current = true;
    if (audioRef.current) audioRef.current.pause();
    setIsPaused(true);
    setIsPlaying(false);
  };

  const handleStop = () => {
    abortRef.current?.abort();
    if (audioRef.current) { audioRef.current.pause(); audioRef.current.src = ""; }
    if (audioBlobUrlRef.current) { URL.revokeObjectURL(audioBlobUrlRef.current); audioBlobUrlRef.current = null; }
    speechRef.current = null;
    isPausedRef.current = false;
    setIsLoadingAudio(false);
    setIsPlaying(false);
    setIsPaused(false);
    setPlayingPart(null);
    setAudioCurrentTime(0);
    setAudioDuration(0);
  };

  const handleAnswerChange = (questionId: string, value: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  };

  const normalizeAnswer = (answer: string): string => answer.toLowerCase().trim();

  const checkAnswer = useCallback((userAnswer: string, correctAnswer: string): boolean => {
    const normalizedUser = normalizeAnswer(userAnswer);
    const normalizedCorrect = normalizeAnswer(correctAnswer);
    if (normalizedUser === normalizedCorrect) return true;
    if (NUMBER_WORDS[normalizedUser] === normalizedCorrect) return true;
    if (NUMBER_WORDS_REVERSE[normalizedUser] === normalizedCorrect) return true;

    const digitsOnly = (s: string) => s.replace(/\D/g, "");
    const userDigits = digitsOnly(normalizedUser);
    const correctDigits = digitsOnly(normalizedCorrect);
    if (userDigits.length >= 4 && userDigits === correctDigits) return true;

    const normalizeDate = (s: string) =>
      s
        .replace(/\b(\d+)(st|nd|rd|th)\b/g, "$1")
        .replace(/\bjan\b/g, "january").replace(/\bfeb\b/g, "february")
        .replace(/\bmar\b/g, "march").replace(/\bapr\b/g, "april")
        .replace(/\bjun\b/g, "june").replace(/\bjul\b/g, "july")
        .replace(/\baug\b/g, "august").replace(/\bsept?\b/g, "september")
        .replace(/\boct\b/g, "october").replace(/\bnov\b/g, "november")
        .replace(/\bdec\b/g, "december")
        .replace(/\s+/g, " ").trim();
    if (normalizeDate(normalizedUser) === normalizeDate(normalizedCorrect)) return true;

    // Accept if any slash-separated alternative matches
    const alternatives = normalizedCorrect.split(/\s*\/\s*/);
    if (alternatives.length > 1 && alternatives.some((alt) => normalizeAnswer(alt) === normalizedUser)) return true;

    const editDist = (a: string, b: string): number => {
      const m = a.length, n = b.length;
      const dp: number[][] = Array.from({ length: m + 1 }, (_, i) =>
        Array.from({ length: n + 1 }, (_, j) => (i === 0 ? j : j === 0 ? i : 0))
      );
      for (let i = 1; i <= m; i++) {
        for (let j = 1; j <= n; j++) {
          dp[i][j] =
            a[i - 1] === b[j - 1] ? dp[i - 1][j - 1] : 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
        }
      }
      return dp[m][n];
    };
    const userWords = normalizedUser.split(/\s+/);
    const correctWords = normalizedCorrect.split(/\s+/);
    if (userWords.length === correctWords.length) {
      const allClose = userWords.every((w, i) => {
        const cw = correctWords[i];
        if (w === cw) return true;
        if (w.length >= 4 && cw.length >= 4) return editDist(w, cw) <= 2;
        return false;
      });
      if (allClose) return true;
    }
    return false;
  }, []);

  const handleSubmit = async () => {
    if (!currentTest) return;
    if (timerRef.current) clearInterval(timerRef.current);

    let correctCount = 0;
    const newResults: Record<string, { correct: boolean; correctAnswer: string }> = {};

    currentTest.sections.forEach((section) => {
      section.question_groups.forEach((group) => {
        group.items.forEach((item) => {
          const questionId = item.number.toString();
          const userAnswer = answers[questionId] || "";
          const isCorrect = checkAnswer(userAnswer, item.answer);
          if (isCorrect) correctCount++;
          newResults[questionId] = { correct: isCorrect, correctAnswer: item.answer };
        });
      });
    });

    const totalQuestions = currentTest.totalQuestions;
    const bandScore = calculateBandScore(correctCount, totalQuestions);

    setScore(correctCount);
    setResults(newResults);
    setIsSubmitted(true);

    if (user) {
      try {
        await Promise.all([
          supabase.from("listening_submissions").insert({
            user_id: user.id,
            listening_id: currentTest.id,
            answers,
            score: correctCount,
            total_questions: totalQuestions,
            band_score: bandScore,
            completed_at: new Date().toISOString(),
          }),
          saveProgress({
            exam_type: "listening",
            score: correctCount,
            band_score: bandScore,
            total_questions: totalQuestions,
            correct_answers: correctCount,
            feedback: `Test: ${currentTest.title}`,
            completed_at: new Date().toISOString(),
            time_taken: currentTest.durationMinutes * 60 - timeRemaining,
            errors_log: [],
            metadata: { testId: currentTest.id, testTitle: currentTest.title, difficulty: currentTest.difficulty },
          }),
        ]);
      } catch (error) {
        console.error("Error saving submission:", error);
      }
    }

    toast.success(`Test complete! Score: ${correctCount}/${totalQuestions} — Band ${bandScore}`);
  };

  const calculateBandScore = (correct: number, total: number): number => {
    const raw = total === 40 ? correct : Math.round((correct / total) * 40);
    if (raw >= 39) return 9;
    if (raw >= 37) return 8.5;
    if (raw >= 35) return 8;
    if (raw >= 32) return 7.5;
    if (raw >= 30) return 7;
    if (raw >= 26) return 6.5;
    if (raw >= 23) return 6;
    if (raw >= 18) return 5.5;
    if (raw >= 16) return 5;
    if (raw >= 13) return 4.5;
    if (raw >= 11) return 4;
    if (raw >= 8) return 3.5;
    if (raw >= 6) return 3;
    if (raw >= 4) return 2.5;
    if (raw >= 3) return 2;
    if (raw >= 2) return 1.5;
    if (raw >= 1) return 1;
    return 0;
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const resetTest = () => {
    abortRef.current?.abort();
    if (audioRef.current) { audioRef.current.pause(); audioRef.current.src = ""; }
    if (audioBlobUrlRef.current) { URL.revokeObjectURL(audioBlobUrlRef.current); audioBlobUrlRef.current = null; }
    speechRef.current = null;
    isPausedRef.current = false;
    if (timerRef.current) clearInterval(timerRef.current);
    setCachedState(null);
    if (user?.id) sessionStorage.removeItem(`${LISTENING_SESSION_PREFIX}-active`);
    setCurrentTest(null);
    setAnswers({});
    setNotes("");
    setHasStarted(false);
    setPlayedParts({});
    setCompletedParts({});
    setIsPlaying(false);
    setIsPaused(false);
    setPlayingPart(null);
    setIsSubmitted(false);
    setScore(null);
    setResults({});
    setActivePart(1);
    setTimeRemaining(0);
    setTimerEndAt(null);
    setAudioCurrentTime(0);
    setAudioDuration(0);
  };

  const handleSwitchPart = (newPart: number) => {
    if (newPart === activePart) return;
    abortRef.current?.abort();
    if (audioRef.current) { audioRef.current.pause(); audioRef.current.src = ""; }
    if (audioBlobUrlRef.current) { URL.revokeObjectURL(audioBlobUrlRef.current); audioBlobUrlRef.current = null; }
    speechRef.current = null;
    isPausedRef.current = false;
    setIsLoadingAudio(false);
    setIsPlaying(false);
    setIsPaused(false);
    setPlayingPart(null);
    setAudioCurrentTime(0);
    setAudioDuration(0);
    setActivePart(newPart);
  };

  useEffect(() => {
    return () => {
      abortRef.current?.abort();
      if (audioRef.current) { audioRef.current.pause(); audioRef.current.src = ""; }
      if (audioBlobUrlRef.current) { URL.revokeObjectURL(audioBlobUrlRef.current); }
    };
  }, []);

  const deriveMatchingPool = (group: QuestionGroup): Record<string, string> | null => {
    if (group.type !== "matching") return null;
    const byLetter = new Map<string, string>();
    for (const item of group.items) {
      const a = (item.answer || "").trim().toUpperCase();
      if (a.length !== 1 || a < "A" || a > "Z") continue;
      if (!byLetter.has(a)) {
        byLetter.set(a, isSubmitted && item.transcript_quote ? `"${item.transcript_quote}"` : "—");
      }
    }
    if (byLetter.size === 0) return null;
    const sorted = Array.from(byLetter.keys()).sort();
    const pool: Record<string, string> = {};
    for (const l of sorted) pool[l] = byLetter.get(l)!;
    return pool;
  };

  // Render a template-style note/form completion group
  const renderTemplate = (template: string, group: QuestionGroup) => {
    const itemsByNumber: Record<number, QuestionItem> = {};
    for (const item of group.items) itemsByNumber[item.number] = item;

    const inputForNumber = (n: number) => {
      const item = itemsByNumber[n];
      const result = results[n.toString()];
      const isCorrect = result?.correct;
      const userAnswer = answers[n.toString()] || "";

      const baseCls = "inline-block w-32 h-7 mx-1 px-2 text-sm border rounded align-middle";
      const stateCls = isSubmitted
        ? isCorrect
          ? "border-green-500 bg-green-500/10"
          : "border-red-500 bg-red-500/10"
        : "border-border/60 bg-background";

      return (
        <span key={`q-${n}`} className="inline-flex items-baseline gap-1 align-middle">
          <span className={cn(
            "inline-flex items-center justify-center w-5 h-5 rounded-full text-[10px] font-semibold align-middle",
            isSubmitted
              ? isCorrect
                ? "bg-green-500/20 text-green-700 dark:text-green-400"
                : "bg-red-500/20 text-red-700 dark:text-red-400"
              : "bg-accent/15 text-accent"
          )}>
            {n}
          </span>
          <Input
            value={userAnswer}
            onChange={(e) => handleAnswerChange(n.toString(), e.target.value)}
            disabled={isSubmitted || !item}
            className={cn(baseCls, stateCls)}
            placeholder="…"
            data-question={n}
          />
        </span>
      );
    };

    const renderLineContent = (line: string, lineKey: string) => {
      // Split by {{N}} placeholders
      const tokens: React.ReactNode[] = [];
      const regex = /\{\{(\d+)\}\}/g;
      let lastIdx = 0;
      let match: RegExpExecArray | null;
      let tokenIdx = 0;
      while ((match = regex.exec(line)) !== null) {
        if (match.index > lastIdx) {
          tokens.push(<span key={`${lineKey}-t-${tokenIdx++}`}>{line.slice(lastIdx, match.index)}</span>);
        }
        const num = parseInt(match[1], 10);
        tokens.push(inputForNumber(num));
        tokenIdx++;
        lastIdx = regex.lastIndex;
      }
      if (lastIdx < line.length) {
        tokens.push(<span key={`${lineKey}-t-${tokenIdx++}`}>{line.slice(lastIdx)}</span>);
      }
      return tokens;
    };

    const lines = template.split("\n");
    return (
      <div className="p-5 rounded-2xl border border-border/40 bg-card/50 space-y-1">
        {lines.map((rawLine, idx) => {
          const key = `tpl-${idx}`;
          const line = rawLine.replace(/\s+$/g, "");

          if (line.trim() === "") {
            return <div key={key} className="h-2" />;
          }

          // Bold heading line: starts and ends with **
          const boldMatch = line.trim().match(/^\*\*(.+?)\*\*$/);
          if (boldMatch) {
            return (
              <p key={key} className="font-bold text-foreground mt-4 mb-2">
                {boldMatch[1]}
              </p>
            );
          }

          // Bullet line
          if (/^\s*[–\-]\s+/.test(line)) {
            const content = line.replace(/^\s*[–\-]\s+/, "");
            return (
              <p key={key} className="text-sm text-foreground pl-4">
                <span className="mr-1">–</span>
                {renderLineContent(content, key)}
              </p>
            );
          }

          return (
            <p key={key} className="text-sm leading-relaxed text-foreground">
              {renderLineContent(line, key)}
            </p>
          );
        })}
      </div>
    );
  };

  const renderQuestion = (
    question: QuestionItem,
    groupType: string,
    matchingPool?: Record<string, string> | null
  ) => {
    const result = results[question.number.toString()];
    const isCorrect = result?.correct;
    const userAnswer = answers[question.number.toString()] || "";

    const inputClass = cn(
      "h-9 text-sm",
      isSubmitted
        ? isCorrect
          ? "border-green-500 bg-green-500/10"
          : "border-red-500 bg-red-500/10"
        : ""
    );

    const correctnessHint = isSubmitted && !isCorrect && (
      <p className="text-sm text-emerald-600 dark:text-emerald-400 mt-2">
        Correct answer: <span className="font-semibold">{result?.correctAnswer}</span>
        {question.transcript_quote && (
          <span className="text-muted-foreground ml-2 italic">— "{question.transcript_quote}"</span>
        )}
      </p>
    );

    let body: React.ReactNode;

    if (groupType === "form_completion" || groupType === "note_completion" || groupType === "table_completion") {
      body = (
        <div className="space-y-1">
          <p className="text-sm text-muted-foreground font-medium">{question.label || question.statement}</p>
          <Input
            value={userAnswer}
            onChange={(e) => handleAnswerChange(question.number.toString(), e.target.value)}
            className={inputClass}
            disabled={isSubmitted}
            placeholder="Your answer..."
          />
          {correctnessHint}
        </div>
      );
    } else if (groupType === "sentence_completion") {
      const sentenceText = question.sentence || question.statement || "";
      const parts = sentenceText.split("_____");
      body = (
        <div className="space-y-2">
          <p className="text-foreground leading-relaxed">
            {parts.map((part, idx) => (
              <span key={idx}>
                {part}
                {idx < parts.length - 1 && (
                  <Input
                    value={userAnswer}
                    onChange={(e) => handleAnswerChange(question.number.toString(), e.target.value)}
                    className={cn("inline-block w-40 mx-1 h-8 text-center text-sm", isSubmitted ? (isCorrect ? "border-green-500 bg-green-500/10" : "border-red-500 bg-red-500/10") : "")}
                    disabled={isSubmitted}
                    placeholder="..."
                  />
                )}
              </span>
            ))}
          </p>
          {correctnessHint}
        </div>
      );
    } else if (groupType === "matching") {
      const poolKeys = matchingPool ? Object.keys(matchingPool).sort() : [];
      body = (
        <div className="space-y-2">
          <p className="text-foreground leading-relaxed">{question.label || question.statement}</p>
          <div className="flex items-center gap-3">
            {poolKeys.length > 0 ? (
              <select
                value={userAnswer}
                onChange={(e) => handleAnswerChange(question.number.toString(), e.target.value)}
                disabled={isSubmitted}
                className={cn(
                  "w-28 px-2 py-1.5 rounded-md border bg-background text-foreground text-sm uppercase",
                  isSubmitted ? (isCorrect ? "border-green-500 bg-green-500/10" : "border-red-500 bg-red-500/10") : "border-border/50"
                )}
              >
                <option value="">—</option>
                {poolKeys.map((k) => (
                  <option key={k} value={k}>{k}</option>
                ))}
              </select>
            ) : (
              <Input
                value={userAnswer}
                onChange={(e) => handleAnswerChange(question.number.toString(), e.target.value.toUpperCase())}
                className={cn("w-20 text-center uppercase text-sm", isSubmitted ? (isCorrect ? "border-green-500 bg-green-500/10" : "border-red-500 bg-red-500/10") : "")}
                disabled={isSubmitted}
                maxLength={1}
                placeholder="A–G"
              />
            )}
          </div>
          {correctnessHint}
        </div>
      );
    } else {
      body = (
        <div className="space-y-3">
          <p className="text-foreground leading-relaxed font-medium">{question.question || question.statement}</p>
          <div className="space-y-2">
            {question.options &&
              Object.entries(question.options).map(([key, value]) => {
                const isSelected = userAnswer === key;
                const isCorrectOption = result?.correctAnswer === key;
                return (
                  <label
                    key={key}
                    className={cn(
                      "flex items-start gap-3 p-3.5 rounded-xl cursor-pointer transition-all border",
                      isSubmitted
                        ? isCorrectOption
                          ? "bg-green-500/10 border-green-500/40"
                          : isSelected && !isCorrectOption
                          ? "bg-red-500/10 border-red-500/40"
                          : "bg-secondary/20 border-transparent"
                        : isSelected
                        ? "bg-accent/10 border-accent/50"
                        : "bg-secondary/20 border-transparent hover:bg-secondary/40 hover:border-border/50"
                    )}
                  >
                    <input
                      type="radio"
                      name={`question-${question.number}`}
                      value={key}
                      checked={isSelected}
                      onChange={(e) => handleAnswerChange(question.number.toString(), e.target.value)}
                      disabled={isSubmitted}
                      className="mt-0.5 w-4 h-4 text-accent flex-shrink-0"
                    />
                    <span className="font-semibold text-muted-foreground mr-1 flex-shrink-0">{key}.</span>
                    <span className="text-foreground">{value}</span>
                    {isSubmitted && isCorrectOption && <CheckCircle2 className="w-4 h-4 text-green-500 ml-auto flex-shrink-0 mt-0.5" />}
                    {isSubmitted && isSelected && !isCorrectOption && <XCircle className="w-4 h-4 text-red-500 ml-auto flex-shrink-0 mt-0.5" />}
                  </label>
                );
              })}
          </div>
          {correctnessHint}
        </div>
      );
    }

    return (
      <div
        key={question.number}
        data-question={question.number}
        className={cn(
          "p-5 rounded-2xl border transition-all",
          isSubmitted
            ? isCorrect
              ? "border-green-500/40 bg-green-500/5"
              : "border-red-500/40 bg-red-500/5"
            : "border-border/40 bg-card/50"
        )}
      >
        <div className="flex items-start gap-4">
          <span className={cn(
            "flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold",
            isSubmitted
              ? isCorrect
                ? "bg-green-500/20 text-green-600 dark:text-green-400"
                : "bg-red-500/20 text-red-600 dark:text-red-400"
              : "bg-accent/15 text-accent"
          )}>
            {question.number}
          </span>
          <div className="flex-1 min-w-0">{body}</div>
        </div>
      </div>
    );
  };

  const currentPart = currentTest?.sections[activePart - 1];
  const partCounts = useMemo(() => {
    if (!currentTest) return [] as { answered: number; total: number }[];
    return currentTest.sections.map((section) => ({
      answered: section.question_groups.reduce(
        (sum, g) => sum + g.items.filter((item) => answers[item.number.toString()]).length,
        0
      ),
      total: section.question_groups.reduce((sum, g) => sum + g.items.length, 0),
    }));
  }, [currentTest, answers]);

  const filteredTests = difficultyFilter === "all" ? tests : tests.filter((t) => t.difficulty === difficultyFilter);

  // Library view
  if (!currentTest) {
    const practiceContent = (
      <div className="space-y-6">
        {/* Difficulty filter */}
        <div className="flex items-center gap-2 flex-wrap">
          {(["all", "easy", "medium", "hard"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setDifficultyFilter(f)}
              className={cn(
                "px-4 py-1.5 rounded-full text-sm border transition-colors capitalize",
                difficultyFilter === f
                  ? "bg-accent text-accent-foreground border-accent"
                  : "border-border/50 text-muted-foreground hover:border-accent/50 hover:text-foreground"
              )}
            >
              {f === "all" ? "All Tests" : f}
            </button>
          ))}
          <span className="ml-auto text-sm text-muted-foreground">{filteredTests.length} tests</span>
        </div>

        {isLoadingTests ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
          </div>
        ) : filteredTests.length === 0 ? (
          <div className="glass-card p-12 text-center">
            <Headphones className="w-14 h-14 text-muted-foreground/30 mx-auto mb-4" />
            <p className="text-muted-foreground">No tests available for this difficulty.</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {filteredTests.map((test) => {
              const totalAnswerable = test.sections.reduce(
                (s, sec) => s + sec.question_groups.reduce((ss, g) => ss + g.items.length, 0),
                0
              );
              return (
                <button
                  key={test.id}
                  onClick={() => startTest(test)}
                  className="glass-card p-6 text-left hover:scale-[1.01] transition-all group border border-transparent hover:border-accent/20"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-medium truncate">{test.title}</h3>
                        <Badge variant={DIFFICULTY_BADGE[test.difficulty] ?? "default"} className="flex-shrink-0">
                          {test.difficulty}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5" />
                          {test.durationMinutes} min
                        </span>
                        <span className="flex items-center gap-1.5">
                          <FileText className="w-3.5 h-3.5" />
                          {totalAnswerable} questions
                        </span>
                        <span className="flex items-center gap-1.5">
                          <Headphones className="w-3.5 h-3.5" />
                          4 parts
                        </span>
                      </div>
                      {test.topicTags.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mt-3">
                          {test.topicTags.map((tag) => (
                            <span key={tag} className="text-xs px-2 py-0.5 rounded-full bg-secondary/60 text-muted-foreground capitalize">
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center group-hover:bg-accent/20 transition-colors">
                      <Play className="w-4 h-4 text-accent ml-0.5" />
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>
    );

    return (
      <DashboardLayout>
        <div className="max-w-4xl">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center">
              <Headphones className="w-6 h-6 text-accent" />
            </div>
            <div>
              <h1 className="text-2xl font-light">Listening Practice</h1>
              <p className="text-sm text-muted-foreground">Cambridge IELTS-style tests · 4 parts · 40 questions each</p>
            </div>
          </div>

          {isElite ? (
            <Tabs defaultValue="practice" className="w-full">
              <TabsList className="mb-6">
                <TabsTrigger value="practice">Practice Tests</TabsTrigger>
                <TabsTrigger value="cheatsheet">MudahInAja</TabsTrigger>
              </TabsList>
              <TabsContent value="practice" className="mt-0">{practiceContent}</TabsContent>
              <TabsContent value="cheatsheet" className="mt-0">
                <div className="glass-card p-6">
                  <h2 className="text-lg font-semibold mb-4">Elite Cheatsheet & Hard Tips</h2>
                  <ListeningCheatsheet />
                </div>
              </TabsContent>
            </Tabs>
          ) : (
            practiceContent
          )}
        </div>
      </DashboardLayout>
    );
  }

  // Test view
  const firstGroup = currentPart?.question_groups[0];
  const lastGroup = currentPart?.question_groups[currentPart.question_groups.length - 1];
  const partQStart = firstGroup?.question_range[0];
  const partQEnd = lastGroup?.question_range[1];

  const progressPct = audioDuration > 0 ? (audioCurrentTime / audioDuration) * 100 : 0;

  return (
    <DashboardLayout>
      <div className="h-[calc(100vh-100px)] flex flex-col gap-3">
        {/* Header */}
        <div className="flex-shrink-0 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={resetTest}
              className="p-2 rounded-lg hover:bg-secondary/60 transition-colors text-muted-foreground hover:text-foreground"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-lg font-medium leading-tight">{currentTest.title}</h1>
              <Badge variant={DIFFICULTY_BADGE[currentTest.difficulty] ?? "default"} className="mt-0.5">
                {currentTest.difficulty}
              </Badge>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-xl font-mono text-base",
              timeRemaining < 60 ? "bg-red-500/10 text-red-500" : "bg-secondary/60 text-foreground"
            )}>
              <Clock className="w-4 h-4" />
              {formatTime(timeRemaining)}
            </div>
            {isSubmitted && (
              <Button variant="outline" onClick={resetTest} size="sm">
                <RefreshCw className="w-4 h-4 mr-2" />
                New Test
              </Button>
            )}
          </div>
        </div>

        {/* Score banner */}
        {isSubmitted && score !== null && (
          <div className="flex-shrink-0 glass-card p-4 bg-gradient-to-r from-accent/10 to-elite-gold/10">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Your Score</p>
                <p className="text-3xl font-light">
                  <span className="text-accent">{score}</span>
                  <span className="text-muted-foreground text-xl">/{currentTest.totalQuestions}</span>
                </p>
              </div>
              <div className="text-right">
                <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Estimated Band</p>
                <p className="text-3xl font-light text-elite-gold">
                  {calculateBandScore(score, currentTest.totalQuestions)}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Audio Player */}
        <div className="flex-shrink-0 glass-card p-4">
          <audio ref={audioRef} preload="none" />

          {/* Part header */}
          <div className="flex items-center justify-between mb-3 gap-3 flex-wrap">
            <div className="flex items-center gap-2 min-w-0">
              <Volume2 className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" />
              <p className="text-sm font-medium text-foreground truncate">
                Part {activePart}: Listen and answer questions {partQStart}–{partQEnd}
              </p>
            </div>
            <p className="text-xs text-muted-foreground max-w-md text-right truncate">{currentPart?.context}</p>
          </div>

          {/* Controls row */}
          <div className="flex items-center gap-3">
            {/* Play/Pause or Loading */}
            {isLoadingAudio ? (
              <Button variant="outline" size="icon" className="rounded-full w-10 h-10 flex-shrink-0" disabled>
                <Loader2 className="w-4 h-4 animate-spin" />
              </Button>
            ) : isPlaying && playingPart === activePart ? (
              <Button onClick={handlePause} variant="outline" size="icon" className="rounded-full w-10 h-10 flex-shrink-0" disabled={isSubmitted}>
                <Pause className="w-4 h-4" />
              </Button>
            ) : (
              <Button
                onClick={handlePlay}
                variant="neumorphicPrimary"
                size="icon"
                className="rounded-full w-10 h-10 flex-shrink-0"
                disabled={isSubmitted}
                title={isPaused && playingPart === activePart ? "Resume" : completedParts[activePart] ? "Replay" : "Play"}
              >
                <Play className="w-4 h-4 ml-0.5" />
              </Button>
            )}

            {/* Stop button */}
            {(isPlaying || isPaused) && playingPart === activePart && !isSubmitted && (
              <Button onClick={handleStop} variant="ghost" size="icon" className="rounded-full w-8 h-8 flex-shrink-0 text-muted-foreground hover:text-destructive">
                <Square className="w-3.5 h-3.5" />
              </Button>
            )}

            {/* Progress bar */}
            <div className="flex-1 flex items-center gap-2 min-w-0">
              <input
                type="range"
                min={0}
                max={audioDuration || 0}
                value={audioCurrentTime}
                step={0.1}
                onChange={(e) => {
                  const v = parseFloat(e.target.value);
                  if (audioRef.current && Number.isFinite(v)) {
                    audioRef.current.currentTime = v;
                    setAudioCurrentTime(v);
                  }
                }}
                onMouseDown={() => setIsSeeking(true)}
                onMouseUp={() => setIsSeeking(false)}
                onTouchStart={() => setIsSeeking(true)}
                onTouchEnd={() => setIsSeeking(false)}
                className="flex-1 h-1.5 rounded-full appearance-none bg-border/50 cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3.5 [&::-webkit-slider-thumb]:h-3.5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-accent [&::-webkit-slider-thumb]:cursor-pointer [&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:w-3.5 [&::-moz-range-thumb]:h-3.5 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-accent [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:border-0"
                style={{
                  background: audioDuration
                    ? `linear-gradient(to right, hsl(var(--accent)) ${progressPct}%, hsl(var(--border)) ${progressPct}%)`
                    : undefined,
                }}
                disabled={!audioDuration}
              />
              <span className="text-xs text-muted-foreground font-mono flex-shrink-0 w-24 text-right">
                {formatTime(Math.floor(audioCurrentTime))} / {formatTime(Math.floor(audioDuration || 0))}
              </span>
            </div>
          </div>

          {/* Status */}
          <p className="text-xs text-muted-foreground mt-2">
            {isLoadingAudio
              ? "Generating audio — please wait…"
              : isPlaying && playingPart === activePart
              ? `Playing Part ${activePart} — listen carefully and answer as you go`
              : isPaused && playingPart === activePart
              ? "Paused — press play to resume"
              : completedParts[activePart]
              ? `Part ${activePart} complete — answer the questions below, or press play to replay`
              : playedParts[activePart]
              ? `Stopped — press play to restart Part ${activePart}`
              : `Press play to begin Part ${activePart}`}
          </p>
        </div>

        {/* Main content */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-4 gap-3 min-h-0">
          {/* Questions panel */}
          <div className="lg:col-span-3 glass-card flex flex-col min-h-0 overflow-hidden">
            {/* Part tabs */}
            <div className="flex-shrink-0 border-b border-border/30 px-4 pt-3">
              <div className="flex gap-1">
                {[1, 2, 3, 4].map((part) => (
                  <button
                    key={part}
                    onClick={() => handleSwitchPart(part)}
                    className={cn(
                      "px-4 py-2 text-sm rounded-t-lg transition-colors relative",
                      activePart === part
                        ? "text-accent font-medium bg-accent/5 border-b-2 border-accent"
                        : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    Part {part}
                    {!isSubmitted && (
                      <span className="ml-1 text-xs opacity-60">
                        ({partCounts[part - 1]?.answered ?? 0}/{partCounts[part - 1]?.total ?? 0})
                      </span>
                    )}
                    {completedParts[part] && !isSubmitted && (
                      <span className="ml-1 text-green-500">✓</span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            <ScrollArea className="flex-1">
              <div className="p-6 space-y-8">
                {/* Transcript (after submission) */}
                {isSubmitted && currentPart?.transcript && (
                  <div className="p-5 rounded-2xl bg-secondary/30 border border-border/30">
                    <h3 className="font-semibold mb-3 text-accent flex items-center gap-2">
                      <FileText className="w-4 h-4" />
                      Part {activePart} Transcript
                    </h3>
                    <p className="whitespace-pre-wrap text-foreground/90 leading-relaxed text-sm font-mono">
                      {currentPart.transcript}
                    </p>
                  </div>
                )}

                {/* Question groups */}
                {currentPart?.question_groups.map((group, idx) => {
                  const matchingPool =
                    group.type === "matching"
                      ? group.options_pool ?? deriveMatchingPool(group)
                      : null;
                  return (
                    <div key={idx} className="space-y-4">
                      {/* Group header */}
                      <div className="space-y-1">
                        {group.title && (
                          <h3 className="text-base font-semibold text-foreground uppercase tracking-wide">
                            {group.title}
                          </h3>
                        )}
                        <p className="text-sm font-medium text-muted-foreground">
                          {QUESTION_TYPE_LABEL[group.type] || group.type} — Questions {group.question_range[0]}–{group.question_range[1]}
                        </p>
                        <p className="text-sm text-foreground/70 italic">{group.instruction}</p>
                      </div>

                      {/* Matching pool */}
                      {matchingPool && (
                        <div className="p-4 rounded-2xl border border-border/40 bg-secondary/20">
                          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-3">Options</p>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2">
                            {Object.entries(matchingPool).map(([letter, label]) => (
                              <p key={letter} className="text-sm text-foreground">
                                <span className="font-bold text-accent mr-2">{letter}</span>
                                {label}
                              </p>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Questions: template-driven or card-based */}
                      {group.template ? (
                        renderTemplate(group.template, group)
                      ) : (
                        <div className="space-y-3">
                          {group.items.map((item) => renderQuestion(item, group.type, matchingPool))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </ScrollArea>
          </div>

          {/* Notes sidebar */}
          <div className="glass-card p-4 flex flex-col min-h-0">
            <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3 flex-shrink-0 flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Notes
            </h2>
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder={"Jot down keywords as you listen…\n\nUse this space for:\n• Key numbers\n• Names & places\n• Spelling clues\n• Answer guesses"}
              className="flex-1 resize-none bg-transparent border-border/30 text-sm leading-relaxed placeholder:text-muted-foreground/40"
              disabled={isSubmitted}
            />
          </div>
        </div>

        {/* Question navigator */}
        <div className="flex-shrink-0 glass-card p-4">
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs text-muted-foreground uppercase tracking-wide">Questions</p>
            {!isSubmitted && (
              <p className="text-xs text-muted-foreground">
                {Object.keys(answers).length}/{currentTest.totalQuestions} answered
              </p>
            )}
          </div>
          <div className="flex flex-wrap gap-1.5">
            {Array.from({ length: currentTest.totalQuestions || 40 }, (_, i) => i + 1).map((num) => {
              const result = results[num.toString()];
              const isAnswered = answers[num.toString()];
              const partForNum = Math.ceil(num / 10);
              const isActivePart = partForNum === activePart;
              return (
                <button
                  key={num}
                  onClick={() => {
                    handleSwitchPart(partForNum);
                    setTimeout(() => {
                      document.querySelector(`[data-question="${num}"]`)?.scrollIntoView({ behavior: "smooth", block: "center" });
                    }, 50);
                  }}
                  className={cn(
                    "w-8 h-8 rounded-lg text-xs font-medium border transition-all",
                    isSubmitted
                      ? result?.correct
                        ? "bg-green-500/20 border-green-500/50 text-green-700 dark:text-green-400"
                        : "bg-red-500/20 border-red-500/50 text-red-700 dark:text-red-400"
                      : isAnswered
                      ? "bg-accent/20 border-accent/50 text-accent"
                      : isActivePart
                      ? "bg-secondary/60 border-border/50"
                      : "bg-secondary/30 border-border/30 text-muted-foreground"
                  )}
                >
                  {num}
                </button>
              );
            })}
          </div>
        </div>

        {/* Submit */}
        {!isSubmitted && (
          <div className="flex-shrink-0 flex justify-end">
            <Button
              onClick={handleSubmit}
              size="lg"
              className="bg-accent hover:bg-accent/90 px-8"
              disabled={!hasStarted}
            >
              Submit and Review
            </Button>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
