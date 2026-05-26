import { useState, useRef, useEffect, useCallback } from "react";
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
  Lock,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { useSessionStorage } from "@/hooks/useLocalStorage";
import { useUserProgress } from "@/hooks/useUserProgress";
import { useFeatureGating } from "@/hooks/useFeatureGating";
import { UpgradeModal } from "@/components/UpgradeModal";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ListeningCheatsheet } from "@/components/listening/ListeningCheatsheet";

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

export default function ListeningModule() {
  const { user, profile } = useAuth();
  const isElite = profile?.subscription_tier === "elite";

  // isMountedRef: tracks whether component is currently mounted
  const isMountedRef = useRef(true);
  useEffect(() => {
    isMountedRef.current = true;
    return () => { isMountedRef.current = false; };
  }, []);

  // Background generation store — survives component unmount/remount
  const genEntry = useGenerationEntry('listening');
  const isGenerating = genEntry.isGenerating;

  const [completedIds, setCompletedIds] = useState<Set<string>>(new Set());
  const [doneFilter, setDoneFilter] = useState<"all" | "done" | "not-done">("all");

  useEffect(() => {
    if (!user?.id) return;
    try {
      const stored = localStorage.getItem(`ielts-listening-completed-${user.id}`);
      if (stored) setCompletedIds(new Set(JSON.parse(stored)));
    } catch { }
  }, [user?.id]);

  const markListeningCompleted = (testId: string) => {
    if (!user?.id) return;
    setCompletedIds((prev) => {
      const next = new Set(prev);
      next.add(testId);
      try { localStorage.setItem(`ielts-listening-completed-${user.id}`, JSON.stringify([...next])); } catch { }
      return next;
    });
  };

  const [tests, setTests] = useState<ListeningTest[]>([]);
  const [currentTest, setCurrentTest] = useState<ListeningTest | null>(null);
  const [isLoading, setIsLoading] = useState(false);
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
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [difficulty, setDifficulty] = useState<"easy" | "medium" | "hard">(() => {
    if (typeof window !== "undefined") {
      const stored = sessionStorage.getItem(`ielts-listening-active-diff-${user?.id || 'guest'}`);
      if (stored === "easy" || stored === "medium" || stored === "hard") return stored;
    }
    return "medium";
  });

  const audioRef = useRef<HTMLAudioElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const speechRef = useRef<any>(null);
  const lastTestIdRef = useRef<string | null>(null);
  const isPausedRef = useRef(false);
  const resumeCallbackRef = useRef<(() => void) | null>(null);

  const LISTENING_SESSION_PREFIX = `ielts-listening-${user?.id || 'guest'}`;

  const [cachedState, setCachedState] = useSessionStorage<CachedListeningState | null>(
    `${LISTENING_SESSION_PREFIX}-active`,
    null
  );
  const { saveProgress } = useUserProgress();
  const { canAccess, refreshCounts, isLoading: isGatingLoading } = useFeatureGating();
  const navigate = useNavigate();

  useEffect(() => {
    if (user?.id) sessionStorage.setItem(`ielts-listening-active-diff-${user.id}`, difficulty);
  }, [difficulty, user?.id]);

  useEffect(() => {
    if (!user?.id) return;
    const activeKey = `${LISTENING_SESSION_PREFIX}-active`;
    try {
      const stored = sessionStorage.getItem(activeKey);
      if (!stored || stored === 'null') return;
      const parsed = JSON.parse(stored) as CachedListeningState;
      if (!parsed) return;

      const cachedTest = parsed.testContext;
      // Validate structure — stale caches from older code versions don't
      // have the new sections/question_groups shape and will render blank.
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

  const generateTest = async () => {
    if (isGatingLoading) return;
    if (!canAccess("listening")) {
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
      toast.error("Authentication required", { description: "You must be logged in." });
      return;
    }

    try {
      setIsLoading(true);
      const { data, error } = await supabase.functions.invoke("generate-listening", {
        body: { difficulty, exclude_id: lastTestIdRef.current ?? undefined },
        headers: {
          Authorization: `Bearer ${currentSession.access_token}`,
        },
      });

      if (error) throw error;

      // successResponse wraps payload as { success: true, data: {...} }
      const resolved = data?.success ? data.data : data;

      if (!resolved?.sections || !Array.isArray(resolved.sections) || resolved.sections.length === 0) {
        throw new Error("Invalid response from server — sections missing");
      }

      const validSections = resolved.sections.every(
        (s: ListeningPart) =>
          Array.isArray(s?.question_groups) &&
          s.question_groups.length > 0 &&
          s.question_groups.every((g) => Array.isArray(g.items) && g.items.length > 0)
      );
      if (!validSections) {
        throw new Error("Invalid response from server — question groups missing or empty");
      }

      const test: ListeningTest = {
        id: resolved.id ?? crypto.randomUUID(),
        title: resolved.title ?? "Listening Test",
        difficulty: resolved.difficulty ?? difficulty,
        totalQuestions: resolved.totalQuestions ?? 40,
        durationMinutes: resolved.durationMinutes ?? 30,
        topicTags: resolved.topicTags ?? [],
        sections: resolved.sections,
      };

      await startTest(test);
    } catch (error: any) {
      console.error("generate-listening error:", error);
      toast.error(error.message || "Failed to generate test");
    } finally {
      setIsLoading(false);
    }
  };

  const startTest = async (test: ListeningTest) => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    if (window.speechSynthesis.speaking || window.speechSynthesis.pending) {
      window.speechSynthesis.cancel();
    }
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

    if (user) {
      try {
        await saveProgress({
          exam_type: "listening",
          score: null,
          band_score: null,
          total_questions: null,
          correct_answers: null,
          feedback: `Started: ${test.title}. Difficulty: ${test.difficulty}`,
          completed_at: new Date().toISOString(),
          time_taken: null,
          errors_log: [],
          metadata: {
            testId: test.id,
            testTitle: test.title,
            difficulty: test.difficulty,
            status: "started",
          },
        });
        await refreshCounts();
      } catch (err) {
        console.error("Failed to save initial listening progress:", err);
      }
    }
  };

  const speakPart = useCallback((partNumber: number) => {
    if (!currentTest) return;
    const section = currentTest.sections[partNumber - 1];
    if (!section?.transcript) return;

    if (window.speechSynthesis.speaking || window.speechSynthesis.pending) {
      window.speechSynthesis.cancel();
    }
    isPausedRef.current = false;
    resumeCallbackRef.current = null;

    // Unique session token — any stale callbacks check against this
    const token = Symbol();
    speechRef.current = token;

    // Parse transcript into per-speaker turns
    const turns: { speaker: string | null; text: string }[] = [];
    for (const raw of section.transcript.split("\n")) {
      const line = raw.trim();
      if (!line) continue;
      const m = line.match(/^([A-Z][A-Z0-9 ]{0,20}):\s*(.+)$/);
      if (m) {
        turns.push({ speaker: m[1].trim(), text: m[2].trim() });
      } else if (turns.length > 0 && turns[turns.length - 1].speaker === null) {
        turns[turns.length - 1].text += " " + line;
      } else {
        turns.push({ speaker: null, text: line });
      }
    }
    if (turns.length === 0) return;

    const doSpeak = () => {
      const voices = window.speechSynthesis.getVoices();
      // Prefer British English; fall back to any English
      const enGB = voices.filter(v => v.lang === "en-GB");
      const enAU = voices.filter(v => v.lang === "en-AU");
      const enUS = voices.filter(v => v.lang === "en-US");
      const pool = [...enGB, ...enAU, ...enUS, ...voices.filter(v => v.lang.startsWith("en-"))];

      // Map unique speaker names to distinct voices
      const uniqueSpeakers = [...new Set(turns.map(t => t.speaker).filter(Boolean) as string[])];
      const voiceMap: Record<string, SpeechSynthesisVoice | undefined> = {};
      uniqueSpeakers.forEach((sp, i) => {
        voiceMap[sp] = pool[i % Math.max(pool.length, 1)];
      });

      let idx = 0;
      const next = () => {
        if (speechRef.current !== token) return; // Session cancelled
        if (isPausedRef.current) { resumeCallbackRef.current = next; return; }
        if (idx >= turns.length) {
          setIsPlaying(false);
          setIsPaused(false);
          setPlayingPart(null);
          setCompletedParts(prev => ({ ...prev, [partNumber]: true }));
          speechRef.current = null;
          return;
        }
        const { speaker, text } = turns[idx++];
        const utt = new SpeechSynthesisUtterance(text);
        utt.rate = 0.85;
        utt.lang = "en-GB";
        // Alternate pitch for different speakers to help distinguish voices
        utt.pitch = speaker ? (uniqueSpeakers.indexOf(speaker) % 2 === 0 ? 1.1 : 0.9) : 1.0;
        const v = speaker ? voiceMap[speaker] : pool[0];
        if (v) utt.voice = v;
        utt.onend = () => {
          if (speechRef.current !== token) return;
          // Natural pause between speaker turns (longer between different speakers)
          setTimeout(next, speaker ? 380 : 200);
        };
        utt.onerror = () => {
          if (speechRef.current !== token) return;
          setTimeout(next, 100);
        };
        window.speechSynthesis.speak(utt);
      };
      next();
    };

    setPlayingPart(partNumber);
    setIsPlaying(true);
    setIsPaused(false);
    setPlayedParts(prev => ({ ...prev, [partNumber]: true }));

    // Voices may not be ready on first call — wait for them
    if (window.speechSynthesis.getVoices().length === 0) {
      window.speechSynthesis.onvoiceschanged = () => {
        window.speechSynthesis.onvoiceschanged = null;
        if (speechRef.current === token) doSpeak();
      };
    } else {
      doSpeak();
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
      if (window.speechSynthesis.paused) {
        window.speechSynthesis.resume();
      } else if (resumeCallbackRef.current) {
        // Paused between turns — fire the stored continuation
        const cb = resumeCallbackRef.current;
        resumeCallbackRef.current = null;
        cb();
      }
      setIsPaused(false);
      setIsPlaying(true);
      return;
    }

    speakPart(activePart);
  };

  const handlePause = () => {
    if (!isPlaying) return;
    isPausedRef.current = true;
    if (window.speechSynthesis.speaking) window.speechSynthesis.pause();
    setIsPaused(true);
    setIsPlaying(false);
  };

  const handleStop = () => {
    if (window.speechSynthesis.speaking || window.speechSynthesis.pending) {
      window.speechSynthesis.cancel();
    }
    speechRef.current = null;
    isPausedRef.current = false;
    resumeCallbackRef.current = null;
    setIsPlaying(false);
    setIsPaused(false);
    setPlayingPart(null);
  };

  const handleAnswerChange = (questionId: string, value: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }));
  };

  const normalizeAnswer = (answer: string): string => {
    return answer.toLowerCase().trim();
  };

  const checkAnswer = useCallback((userAnswer: string, correctAnswer: string): boolean => {
    const normalizedUser = normalizeAnswer(userAnswer);
    const normalizedCorrect = normalizeAnswer(correctAnswer);

    if (normalizedUser === normalizedCorrect) return true;

    const numberWords: Record<string, string> = {
      "0": "zero", "1": "one", "2": "two", "3": "three", "4": "four",
      "5": "five", "6": "six", "7": "seven", "8": "eight", "9": "nine",
      "10": "ten", "11": "eleven", "12": "twelve", "13": "thirteen",
      "14": "fourteen", "15": "fifteen", "16": "sixteen", "17": "seventeen",
      "18": "eighteen", "19": "nineteen", "20": "twenty", "30": "thirty",
      "40": "forty", "50": "fifty", "60": "sixty", "70": "seventy",
      "80": "eighty", "90": "ninety", "100": "hundred",
    };
    if (numberWords[normalizedUser] === normalizedCorrect) return true;
    const reverseMap = Object.fromEntries(
      Object.entries(numberWords).map(([k, v]) => [v, k])
    );
    if (reverseMap[normalizedUser] === normalizedCorrect) return true;

    const digitsOnly = (s: string) => s.replace(/\D/g, '');
    const userDigits = digitsOnly(normalizedUser);
    const correctDigits = digitsOnly(normalizedCorrect);
    if (userDigits.length >= 4 && userDigits === correctDigits) return true;

    const normalizeDate = (s: string) =>
      s
        .replace(/\b(\d+)(st|nd|rd|th)\b/g, '$1')
        .replace(/\bjan\b/g, 'january').replace(/\bfeb\b/g, 'february')
        .replace(/\bmar\b/g, 'march').replace(/\bapr\b/g, 'april')
        .replace(/\bjun\b/g, 'june').replace(/\bjul\b/g, 'july')
        .replace(/\baug\b/g, 'august').replace(/\bsept?\b/g, 'september')
        .replace(/\boct\b/g, 'october').replace(/\bnov\b/g, 'november')
        .replace(/\bdec\b/g, 'december')
        .replace(/\s+/g, ' ').trim();
    if (normalizeDate(normalizedUser) === normalizeDate(normalizedCorrect)) return true;

    const editDist = (a: string, b: string): number => {
      const m = a.length, n = b.length;
      const dp: number[][] = Array.from({ length: m + 1 }, (_, i) =>
        Array.from({ length: n + 1 }, (_, j) => (i === 0 ? j : j === 0 ? i : 0))
      );
      for (let i = 1; i <= m; i++) {
        for (let j = 1; j <= n; j++) {
          dp[i][j] = a[i - 1] === b[j - 1]
            ? dp[i - 1][j - 1]
            : 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
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

    currentTest.sections.forEach(section => {
      section.question_groups.forEach(group => {
        group.items.forEach(item => {
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
    markListeningCompleted(currentTest.id);

    // Save to database
    if (user) {
      try {
        await supabase.from("listening_submissions").insert({
          user_id: user.id,
          listening_id: currentTest.id,
          answers,
          score: correctCount,
          total_questions: totalQuestions,
          band_score: bandScore,
          completed_at: new Date().toISOString(),
        });

        await saveProgress({
          exam_type: "listening",
          score: correctCount,
          band_score: bandScore,
          total_questions: totalQuestions,
          correct_answers: correctCount,
          feedback: `Test: ${currentTest.title}. Difficulty: ${currentTest.difficulty}`,
          completed_at: new Date().toISOString(),
          time_taken: currentTest.durationMinutes * 60 - timeRemaining,
          errors_log: [],
          metadata: {
            testId: currentTest.id,
            testTitle: currentTest.title,
            difficulty: currentTest.difficulty,
          },
        });
      } catch (error) {
        console.error("Error saving submission:", error);
      }
    }

    toast.success(`Test completed! Score: ${correctCount}/${totalQuestions}`);
  };

  const calculateBandScore = (correct: number, total: number): number => {
    // Official IELTS Listening raw score → band conversion (out of 40)
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
    if (currentTest?.id) lastTestIdRef.current = currentTest.id;
    if (window.speechSynthesis.speaking || window.speechSynthesis.pending) {
      window.speechSynthesis.cancel();
    }
    speechRef.current = null;
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
  };

  // Stop any active playback when switching parts
  const handleSwitchPart = (newPart: number) => {
    if (newPart === activePart) return;
    if (window.speechSynthesis.speaking || window.speechSynthesis.pending) {
      window.speechSynthesis.cancel();
    }
    speechRef.current = null;
    setIsPlaying(false);
    setIsPaused(false);
    setPlayingPart(null);
    setActivePart(newPart);
  };

  // Cancel any speech on unmount to avoid stuck audio
  useEffect(() => {
    return () => {
      if (window.speechSynthesis.speaking || window.speechSynthesis.pending) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  // Build a default options pool for matching groups when the data doesn't
  // include one. We collect the answer letters from the items and (when the
  // test has been submitted) reveal the transcript_quote that each letter
  // corresponds to so the user can see the matches after grading.
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

  const renderQuestion = (
    question: QuestionItem,
    groupType: string,
    matchingPool?: Record<string, string> | null,
  ) => {
    const result = results[question.number.toString()];
    const isCorrect = result?.correct;
    const userAnswer = answers[question.number.toString()] || "";

    const textInput = (
      <Input
        value={userAnswer}
        onChange={(e) => handleAnswerChange(question.number.toString(), e.target.value)}
        className={isSubmitted ? isCorrect ? "border-green-500 bg-green-500/10" : "border-red-500 bg-red-500/10" : ""}
        disabled={isSubmitted}
        placeholder="..."
      />
    );

    const correctnessHint = isSubmitted && !isCorrect && (
      <p className="text-sm text-emerald-600 dark:text-emerald-400 mt-1">
        Correct: <span className="font-medium">{result?.correctAnswer}</span>
        {question.transcript_quote && (
          <span className="text-muted-foreground ml-2">— "{question.transcript_quote}"</span>
        )}
      </p>
    );

    let body: React.ReactNode;

    if (groupType === "form_completion" || groupType === "note_completion" || groupType === "table_completion") {
      body = (
        <div className="space-y-2">
          <p className="text-foreground leading-relaxed">
            <span className="font-medium">{question.label || question.statement}</span>
          </p>
          {textInput}
          {correctnessHint}
        </div>
      );
    } else if (groupType === "sentence_completion") {
      const sentenceText = question.sentence || question.statement || "";
      const parts = sentenceText.split("_____");
      body = (
        <div className="space-y-2">
          <p className="text-foreground leading-relaxed font-serif">
            {parts.map((part, idx) => (
              <span key={idx}>
                {part}
                {idx < parts.length - 1 && (
                  <Input
                    value={userAnswer}
                    onChange={(e) => handleAnswerChange(question.number.toString(), e.target.value)}
                    className={`inline-block w-36 mx-1 h-8 text-center ${isSubmitted ? isCorrect ? "border-green-500 bg-green-500/10" : "border-red-500 bg-red-500/10" : ""}`}
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
          <div className="flex items-center gap-2">
            {poolKeys.length > 0 ? (
              <select
                value={userAnswer}
                onChange={(e) => handleAnswerChange(question.number.toString(), e.target.value)}
                disabled={isSubmitted}
                className={`w-24 px-2 py-1 rounded border bg-background text-foreground text-sm uppercase ${
                  isSubmitted
                    ? isCorrect
                      ? "border-green-500 bg-green-500/10"
                      : "border-red-500 bg-red-500/10"
                    : "border-border/50"
                }`}
              >
                <option value="">—</option>
                {poolKeys.map(k => (
                  <option key={k} value={k}>{k}</option>
                ))}
              </select>
            ) : (
              <Input
                value={userAnswer}
                onChange={(e) => handleAnswerChange(question.number.toString(), e.target.value.toUpperCase())}
                className={`w-16 text-center uppercase ${isSubmitted ? isCorrect ? "border-green-500 bg-green-500/10" : "border-red-500 bg-red-500/10" : ""}`}
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
      // multiple_choice and anything else
      body = (
        <div className="space-y-3">
          <p className="text-foreground leading-relaxed">{question.question || question.statement}</p>
          <div className="space-y-2">
            {question.options && Object.entries(question.options).map(([key, value]) => {
              const isSelected = userAnswer === key;
              const isCorrectOption = result?.correctAnswer === key;
              return (
                <label
                  key={key}
                  className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all ${
                    isSubmitted
                      ? isCorrectOption
                        ? "bg-green-500/10 border border-green-500/50"
                        : isSelected && !isCorrectOption
                        ? "bg-red-500/10 border border-red-500/50"
                        : "bg-secondary/20 border border-transparent"
                      : isSelected
                      ? "bg-accent/10 border border-accent/50"
                      : "bg-secondary/20 border border-transparent hover:bg-secondary/40"
                  }`}
                >
                  <input
                    type="radio"
                    name={`question-${question.number}`}
                    value={key}
                    checked={isSelected}
                    onChange={(e) => handleAnswerChange(question.number.toString(), e.target.value)}
                    disabled={isSubmitted}
                    className="w-4 h-4 text-accent"
                  />
                  <span className="font-medium text-muted-foreground mr-2">{key}.</span>
                  <span className="text-foreground">{value}</span>
                  {isSubmitted && isCorrectOption && <CheckCircle2 className="w-4 h-4 text-green-500 ml-auto" />}
                  {isSubmitted && isSelected && !isCorrectOption && <XCircle className="w-4 h-4 text-red-500 ml-auto" />}
                </label>
              );
            })}
          </div>
        </div>
      );
    }

    return (
      <div
        key={question.number}
        data-question={question.number}
        className={`p-4 rounded-lg border transition-all ${
          isSubmitted
            ? isCorrect
              ? "border-green-500/50 bg-green-500/5"
              : "border-red-500/50 bg-red-500/5"
            : "border-border/50 bg-secondary/20"
        }`}
      >
        <div className="flex items-start gap-3">
          <span className="flex-shrink-0 w-8 h-8 rounded-full bg-accent/10 text-accent flex items-center justify-center text-sm font-medium">
            {question.number}
          </span>
          <div className="flex-1">{body}</div>
        </div>
      </div>
    );
  };

  const currentPart = currentTest?.sections[activePart - 1];
  const partProgress = currentPart ? {
    total: currentPart.question_groups.reduce((sum, group) => sum + group.items.length, 0),
    answered: currentPart.question_groups.reduce((sum, group) =>
      sum + group.items.filter(item => answers[item.number.toString()]).length, 0
    ),
  } : { total: 0, answered: 0 };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent" />
        </div>
      </DashboardLayout>
    );
  }

  if (!currentTest) {
    const practiceContent = tests.length === 0 ? (
      <div className="glass-card p-12 text-center">
        <Headphones className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
        <h2 className="text-xl font-light mb-2">Generate an AI Listening Test</h2>
        <p className="text-muted-foreground mb-6">
          No pre-built tests yet. Generate a fresh IELTS-style test with AI.
        </p>
        <div className="flex flex-col items-center gap-4 max-w-xs mx-auto">
          <div className="flex gap-2 w-full">
            <select
              value={generatePart}
              disabled={isGenerating}
              onChange={(e) => setGeneratePart(e.target.value as typeof generatePart)}
              className="flex-1 bg-secondary/50 border border-border/50 rounded-md px-3 py-2 text-sm text-foreground disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <option value="Part 1">Part 1</option>
              <option value="Part 2">Part 2</option>
              <option value="Part 3">Part 3</option>
              <option value="Part 4">Part 4</option>
            </select>
            <select
              value={generateDifficulty}
              disabled={isGenerating}
              onChange={(e) => setGenerateDifficulty(e.target.value as typeof generateDifficulty)}
              className="flex-1 bg-secondary/50 border border-border/50 rounded-md px-3 py-2 text-sm text-foreground disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </div>
          {isGenerating ? (
            <Button
              onClick={stopGeneration}
              variant="destructive"
              className="w-full"
            >
              <XCircle className="w-4 h-4 mr-2" />
              Stop Generation
            </Button>
          ) : (
            <Button
              onClick={() => !canAccess("listening") ? setShowUpgradeModal(true) : generateTest()}
              className="w-full bg-accent hover:bg-accent/90"
            >
              <Wand2 className="w-4 h-4 mr-2" />
              Generate AI Test
            </Button>
          )}
        </div>
      </div>
    ) : (
      <div className="grid gap-4">
        {/* Done filter pills */}
        <div className="flex items-center gap-2 flex-wrap">
          {(["all", "done", "not-done"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setDoneFilter(f)}
              className={cn(
                "text-xs px-3 py-1.5 rounded-full border transition-colors",
                doneFilter === f
                  ? "bg-accent text-accent-foreground border-accent"
                  : "border-border/50 text-muted-foreground hover:border-accent/50 hover:text-foreground"
              )}
            >
              {f === "all" ? "All" : f === "done" ? "Done" : "Not Done"}
            </button>
          ))}
          <span className="ml-auto text-sm text-muted-foreground">
            {tests.filter(t => doneFilter === "all" || (doneFilter === "done" ? completedIds.has(t.id) : !completedIds.has(t.id))).length} tests
          </span>
        </div>
        {tests.filter(t =>
          doneFilter === "all" || (doneFilter === "done" ? completedIds.has(t.id) : !completedIds.has(t.id))
        ).map((test) => (
          <button
            key={test.id}
            onClick={() => !canAccess("listening") ? setShowUpgradeModal(true) : startTest(test)}
            className={cn(
              "glass-card p-6 text-left hover:scale-[1.01] transition-all group border",
              completedIds.has(test.id) ? "border-green-500/30 bg-green-500/5" : "border-transparent"
            )}
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-light mb-1">{test.title}</h3>
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {test.duration_minutes} mins
                  </span>
                  <Badge variant={
                    test.difficulty === "hard" ? "destructive" :
                    test.difficulty === "easy" ? "secondary" : "default"
                  }>
                    {test.difficulty}
                  </Badge>
                  <span>{test.questions.length} questions</span>
                  {completedIds.has(test.id) && (
                    <span className="flex items-center gap-1 text-green-500">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Done
                    </span>
                  )}
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-accent transition-colors" />
            </div>
          </button>
        ))}
        {/* AI Generation row */}
        <div className="glass-card p-4 border-dashed">
          <div className="flex items-center gap-3 flex-wrap">
            <Wand2 className="w-4 h-4 text-accent flex-shrink-0" />
            <span className="text-sm text-muted-foreground flex-1">Generate a new AI test</span>
            <select
              value={generatePart}
              onChange={(e) => setGeneratePart(e.target.value as typeof generatePart)}
              className="bg-secondary/50 border border-border/50 rounded-md px-2 py-1.5 text-sm text-foreground"
            >
              <option value="Part 1">Part 1</option>
              <option value="Part 2">Part 2</option>
              <option value="Part 3">Part 3</option>
              <option value="Part 4">Part 4</option>
            </select>
            <select
              value={generateDifficulty}
              onChange={(e) => setGenerateDifficulty(e.target.value as typeof generateDifficulty)}
              className="bg-secondary/50 border border-border/50 rounded-md px-2 py-1.5 text-sm text-foreground"
            >
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
            {isGenerating ? (
              <Button size="sm" onClick={stopGeneration} variant="destructive">
                <XCircle className="w-4 h-4 mr-1" /> Stop
              </Button>
            ) : (
              <Button
                size="sm"
                onClick={() => !canAccess("listening") ? setShowUpgradeModal(true) : generateTest()}
                className="bg-accent hover:bg-accent/90"
              >
                Generate
              </Button>
            )}
          </div>
        </div>
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
              <p className="text-sm text-muted-foreground">
                {isElite ? "Select a test or explore MudahInAja" : "Select a test"}
              </p>
            </div>
          </div>

          {isElite ? (
            <Tabs defaultValue="practice" className="w-full">
              <TabsList className="mb-6">
                <TabsTrigger value="practice">Practice Tests</TabsTrigger>
                <TabsTrigger value="cheatsheet">MudahInAja</TabsTrigger>
              </TabsList>
              <TabsContent value="practice" className="mt-0">
                {practiceContent}
              </TabsContent>
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

  return (
    <DashboardLayout>
      <div className="h-[calc(100vh-120px)] flex flex-col">
        {/* Header */}
        <div className="flex-shrink-0 flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
              <Headphones className="w-5 h-5 text-accent" />
            </div>
            <div>
              <h1 className="text-xl font-light">{currentTest.title}</h1>
              <Badge variant={
                currentTest.difficulty === "hard" ? "destructive" :
                currentTest.difficulty === "easy" ? "secondary" : "default"
              }>
                {currentTest.difficulty}
              </Badge>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
              timeRemaining < 60 ? "bg-red-500/10 text-red-500" : "bg-secondary/50"
            }`}>
              <Clock className="w-4 h-4" />
              <span className="font-mono text-lg">{formatTime(timeRemaining)}</span>
            </div>

            {isSubmitted && (
              <Button variant="outline" onClick={resetTest}>
                <RefreshCw className="w-4 h-4 mr-2" />
                New Test
              </Button>
            )}
          </div>
        </div>

        {/* Audio Player */}
        <div className="flex-shrink-0 glass-card p-4 mb-4">
          <audio
            ref={audioRef}
            preload="metadata"
          />

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              {isPlaying && playingPart === activePart ? (
                <Button
                  onClick={handlePause}
                  variant="outline"
                  size="lg"
                  className="rounded-full w-12 h-12"
                  title="Pause"
                  disabled={isSubmitted}
                >
                  <Pause className="w-5 h-5" />
                </Button>
              ) : (
                <Button
                  onClick={handlePlay}
                  variant="neumorphicPrimary"
                  size="lg"
                  className="rounded-full w-12 h-12"
                  title={
                    isPaused && playingPart === activePart
                      ? "Resume"
                      : completedParts[activePart]
                      ? "Replay"
                      : "Play"
                  }
                  disabled={isSubmitted}
                >
                  <Play className="w-5 h-5 ml-0.5" />
                </Button>
              )}

              {(isPlaying || isPaused) && playingPart === activePart && (
                <Button
                  onClick={handleStop}
                  variant="ghost"
                  size="icon"
                  className="rounded-full w-9 h-9 text-muted-foreground hover:text-destructive"
                  title="Stop"
                  disabled={isSubmitted}
                >
                  <Square className="w-4 h-4" />
                </Button>
              )}
            </div>

            <div className="flex-1">
              {isPlaying && playingPart === activePart ? (
                <p className="text-accent text-sm animate-pulse">
                  Audio playing for Part {activePart}... Listen carefully.
                </p>
              ) : isPaused && playingPart === activePart ? (
                <p className="text-yellow-500 text-sm">Paused — press play to resume.</p>
              ) : completedParts[activePart] ? (
                <p className="text-emerald-600 dark:text-emerald-400 text-sm">
                  Part {activePart} complete. Answer the questions below or replay.
                </p>
              ) : playedParts[activePart] ? (
                <p className="text-muted-foreground text-sm">
                  Audio stopped. Press play to restart Part {activePart}.
                </p>
              ) : (
                <p className="text-muted-foreground text-sm">
                  Press play to listen to Part {activePart}.
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Score Banner */}
        {isSubmitted && score !== null && (
          <div className="flex-shrink-0 glass-card p-4 mb-4 bg-gradient-to-r from-accent/10 to-elite-gold/10">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Your Score</p>
                <p className="text-3xl font-light">
                  <span className="text-accent">{score}</span>
                  <span className="text-muted-foreground">/{currentTest.totalQuestions}</span>
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Estimated Band</p>
                <p className="text-3xl font-light text-elite-gold">
                  {calculateBandScore(score, currentTest.totalQuestions)}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-4 gap-4 min-h-0">
          {/* Questions Panel */}
          <div className="lg:col-span-3 glass-card p-4 flex flex-col min-h-0">
            <div className="flex-shrink-0 mb-4">
              <Tabs value={`part-${activePart}`} onValueChange={(v) => handleSwitchPart(parseInt(v.split('-')[1]))}>
                <TabsList>
                  {[1, 2, 3, 4].map(part => (
                    <TabsTrigger key={part} value={`part-${part}`} className="text-xs">
                      Part {part}
                      {!isSubmitted && (
                        <span className="ml-1 text-xs text-muted-foreground">
                          ({currentTest.sections[part - 1]?.question_groups.reduce((sum, g) => sum + g.items.filter(item => answers[item.number.toString()]).length, 0) || 0}/
                          {currentTest.sections[part - 1]?.question_groups.reduce((sum, g) => sum + g.items.length, 0) || 0})
                        </span>
                      )}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </Tabs>
            </div>

            <ScrollArea className="flex-1">
              <div className="space-y-6 pr-4">
                {isSubmitted && currentPart?.transcript && (
                  <div className="p-4 bg-secondary/30 rounded-lg">
                    <h3 className="font-medium mb-3 text-accent">Part {activePart} Transcript</h3>
                    <p className="whitespace-pre-wrap font-serif text-foreground/90 leading-relaxed">
                      {currentPart.transcript}
                    </p>
                  </div>
                )}

                {currentPart?.question_groups.map((group, idx) => {
                  const matchingPool =
                    group.type === "matching"
                      ? group.options_pool ?? deriveMatchingPool(group)
                      : null;
                  return (
                    <div key={idx}>
                      <h3 className="text-sm font-medium text-muted-foreground mb-2">
                        {group.title || QUESTION_TYPE_LABEL[group.type] || group.type}
                      </h3>
                      <p className="text-xs text-muted-foreground mb-4">{group.instruction}</p>

                      {matchingPool && (
                        <div className="mb-4 p-3 rounded-lg border border-border/50 bg-secondary/30">
                          <p className="text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wide">
                            Options
                          </p>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1">
                            {Object.entries(matchingPool).map(([letter, label]) => (
                              <p key={letter} className="text-sm text-foreground">
                                <span className="font-medium text-accent mr-2">{letter}</span>
                                {label}
                              </p>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="space-y-4">
                        {group.items.map(item => renderQuestion(item, group.type, matchingPool))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </ScrollArea>
          </div>

          {/* Notes Sidebar */}
          <div className="glass-card p-4 flex flex-col min-h-0">
            <h2 className="text-lg font-light mb-4 flex-shrink-0 flex items-center gap-2">
              <FileText className="w-4 h-4 text-muted-foreground" />
              Notes
            </h2>
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Jot down keywords while listening..."
              className="flex-1 resize-none bg-secondary/20 border-border/30"
              disabled={isSubmitted}
            />
          </div>
        </div>

        {/* Question Navigator */}
        <div className="flex-shrink-0 mt-4 glass-card p-4">
          <p className="text-xs text-muted-foreground mb-3">Questions</p>
          <div className="flex flex-wrap gap-2">
            {Array.from({ length: currentTest.totalQuestions || 40 }, (_, i) => i + 1).map(num => {
              const result = results[num.toString()];
              const isAnswered = answers[num.toString()];
              let bgColor = "bg-secondary/50";
              if (isSubmitted) {
                bgColor = result?.correct ? "bg-green-500/20 border-green-500/50" : "bg-red-500/20 border-red-500/50";
              } else if (isAnswered) {
                bgColor = "bg-accent/20 border-accent/50";
              }

              return (
                <button
                  key={num}
                  onClick={() => {
                    const part = Math.ceil(num / 10);
                    handleSwitchPart(part);
                    setTimeout(() => {
                      document.querySelector(`[data-question="${num}"]`)?.scrollIntoView({ behavior: 'smooth' });
                    }, 0);
                  }}
                  className={`w-8 h-8 rounded text-xs font-medium border transition-all ${bgColor}`}
                >
                  {num}
                </button>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        {!isSubmitted && (
          <div className="flex-shrink-0 mt-4 flex justify-end">
            <Button
              onClick={handleSubmit}
              size="lg"
              className="bg-accent hover:bg-accent/90"
              disabled={!hasStarted}
            >
              Submit and Review
            </Button>
          </div>
        )}
      </div>

      <UpgradeModal
        isOpen={showUpgradeModal}
        onClose={() => setShowUpgradeModal(false)}
        featureName="Listening"
      />
    </DashboardLayout>
  );
}
