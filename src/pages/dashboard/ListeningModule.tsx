import { useState, useRef, useEffect, useCallback } from "react";
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
  Volume2,
  VolumeX,
  Clock,
  CheckCircle2,
  XCircle,
  FileText,
  RefreshCw,
  ChevronRight,
  Loader2,
  Wand2,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { useSessionStorage } from "@/hooks/useLocalStorage";
import { useUserProgress } from "@/hooks/useUserProgress";
import { useFeatureGating } from "@/hooks/useFeatureGating";
import { UpgradeModal } from "@/components/UpgradeModal";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ListeningCheatsheet } from "@/components/listening/ListeningCheatsheet";
import { generationStore } from "@/stores/generationStore";
import { useGenerationEntry } from "@/hooks/useGenerationEntry";

interface Question {
  id: number;
  type: "gap-fill" | "multiple-choice";
  part: number;
  text: string;
  options?: string[];
  blankPosition?: number; // For inline gap-fill
}

interface ListeningTest {
  id: string;
  title: string;
  audio_url: string;
  transcript: string | null;
  questions: Question[];
  answer_key: Record<string, string>;
  difficulty: string;
  duration_minutes: number;
}

interface UserAnswers {
  [questionId: string]: string;
}

interface CachedListeningState {
  testId: string;
  testContext?: ListeningTest;
  answers: UserAnswers;
  notes: string;
  hasPlayed: boolean;
  timeRemaining: number;
  timerEndAt?: number | null;
  isAudioComplete?: boolean;
  isSubmitted: boolean;
  score?: number;
  results?: Record<string, { correct: boolean; correctAnswer: string }>;
}

const LISTENING_CACHE_KEY = "ielts-listening-cache";

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

  const [tests, setTests] = useState<ListeningTest[]>([]);
  const [currentTest, setCurrentTest] = useState<ListeningTest | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [answers, setAnswers] = useState<UserAnswers>({});
  const [notes, setNotes] = useState("");
  const [hasPlayed, setHasPlayed] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [timerEndAt, setTimerEndAt] = useState<number | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isAudioComplete, setIsAudioComplete] = useState(false);
  const [score, setScore] = useState<number | null>(null);
  const [results, setResults] = useState<Record<string, { correct: boolean; correctAnswer: string }>>({});
  const [showTranscript, setShowTranscript] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [generateDifficulty, setGenerateDifficulty] = useState<"easy" | "medium" | "hard">(() => {
    if (typeof window !== "undefined") {
      const stored = sessionStorage.getItem(`ielts-listening-active-diff-${user?.id || 'guest'}`);
      if (stored === "easy" || stored === "medium" || stored === "hard") return stored;
    }
    return "medium";
  });
  const [generatePart, setGeneratePart] = useState<"Part 1" | "Part 2" | "Part 3" | "Part 4">(() => {
    if (typeof window !== "undefined") {
      const stored = sessionStorage.getItem(`ielts-listening-active-part-${user?.id || 'guest'}`);
      if (stored === "Part 1" || stored === "Part 2" || stored === "Part 3" || stored === "Part 4") return stored;
    }
    return "Part 1";
  });

  const audioRef = useRef<HTMLAudioElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const speechRef = useRef<SpeechSynthesisUtterance | null>(null);
  
  const LISTENING_SESSION_PREFIX = `ielts-listening-${user?.id || 'guest'}`;

  const [cachedState, setCachedState] = useSessionStorage<CachedListeningState | null>(
    `${LISTENING_SESSION_PREFIX}-active`,
    null
  );
  const { saveProgress } = useUserProgress();
  const { canAccess, refreshCounts, isLoading: isGatingLoading } = useFeatureGating();

  // Persist active difficulty and part to sessionStorage whenever they change
  useEffect(() => {
    if (user?.id) sessionStorage.setItem(`ielts-listening-active-diff-${user.id}`, generateDifficulty);
  }, [generateDifficulty, user?.id]);

  useEffect(() => {
    if (user?.id) sessionStorage.setItem(`ielts-listening-active-part-${user.id}`, generatePart);
  }, [generatePart, user?.id]);

  // Load available tests
  useEffect(() => {
    fetchTests();
  }, []);

  // Restore cached state on mount
  useEffect(() => {
    if (!user?.id) return;
    try {
      const activeKey = `${LISTENING_SESSION_PREFIX}-active`;
      const stored = sessionStorage.getItem(activeKey);
      if (stored && stored !== 'null') {
        const parsed = JSON.parse(stored) as CachedListeningState;
        if (!parsed) return;
        setCachedState(parsed);
        if (!currentTest) {
          const cachedTest = tests.find(t => t.id === parsed.testId) || parsed.testContext;
          if (cachedTest) {
            setCurrentTest(cachedTest);
            setAnswers(parsed.answers || {});
            setNotes(parsed.notes || "");
            setHasPlayed(parsed.hasPlayed || false);
            setTimeRemaining(parsed.timeRemaining);
            setTimerEndAt(parsed.timerEndAt ?? null);
            setIsSubmitted(parsed.isSubmitted || false);
            if (parsed.isAudioComplete !== undefined) setIsAudioComplete(parsed.isAudioComplete);
            if (parsed.score !== undefined) setScore(parsed.score);
            if (parsed.results) setResults(parsed.results);
          }
        }
      }
    } catch { /* ignore parse errors on mount */ }
  }, [user?.id, tests]);

  // Apply generation results that arrived while this component was unmounted
  useEffect(() => {
    if (genEntry.isGenerating) return;
    if (genEntry.result) {
      const { generatedTest } = genEntry.result;
      generationStore.clearEntry('listening');
      if (isMountedRef.current) {
        startTest(generatedTest);
      }
    } else if (genEntry.error) {
      generationStore.clearEntry('listening');
      if (isMountedRef.current) {
        toast.error(genEntry.error);
      }
    }
  }, [genEntry]); // eslint-disable-line react-hooks/exhaustive-deps

  // Save state to cache
  useEffect(() => {
    if (currentTest) {
      const newState = {
        testId: currentTest.id,
        testContext: currentTest,
        answers,
        notes,
        hasPlayed,
        timeRemaining,
        timerEndAt,
        isAudioComplete,
        isSubmitted,
        score: score ?? undefined,
        results: Object.keys(results).length > 0 ? results : undefined,
      };
      setCachedState(newState);
      if (user?.id) sessionStorage.setItem(`${LISTENING_SESSION_PREFIX}-active`, JSON.stringify(newState));
    }
  }, [currentTest, answers, notes, hasPlayed, timeRemaining, timerEndAt, isAudioComplete, isSubmitted, score, results]);

  // Timer logic
  useEffect(() => {
    if (hasPlayed && !isSubmitted && timerEndAt) {
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
  }, [hasPlayed, isSubmitted, timerEndAt]); // eslint-disable-line react-hooks/exhaustive-deps

  const fetchTests = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("listening_library")
        .select("*")
        .eq("is_active", true);

      if (error) throw error;

      const formattedTests: ListeningTest[] = (data || []).map(test => ({
        id: test.id,
        title: test.title,
        audio_url: test.audio_url,
        transcript: test.transcript,
        questions: test.questions as unknown as Question[],
        answer_key: test.answer_key as unknown as Record<string, string>,
        difficulty: test.difficulty || "medium",
        duration_minutes: test.duration_minutes || 30,
      }));

      setTests(formattedTests);
    } catch (error) {
      console.error("Error fetching listening tests:", error);
      toast.error("Failed to load listening tests");
    } finally {
      setIsLoading(false);
    }
  };

  const stopGeneration = () => {
    // Hide the loading UI locally — generation continues in background via the store
    toast.info("Generation continues in the background. Come back to see your test.");
  };

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

    generationStore.startGen('listening', { difficulty: generateDifficulty, part: generatePart });
    try {
      const { data, error } = await supabase.functions.invoke("generate-listening", {
        body: { difficulty: generateDifficulty, part: generatePart },
        headers: {
          Authorization: `Bearer ${currentSession.access_token}`,
        },
      });
      if (error) {
        if (error.name === "AbortError" || error.message?.includes("aborted")) {
        if (isMountedRef.current) generationStore.clearEntry('listening');
        else generationStore.failGen('listening', "Generation cancelled");
        return;
      }
        throw error;
      }

      const aiData = data?.data ?? data;

      // Build questions + answer key from sections
      const questions: Question[] = [];
      const fallbackAnswerKey: Record<string, string> = {};

      (aiData.sections || []).forEach((section: any) => {
        const isMultiChoice = section.type === "multiple_choice";
        (section.questions || []).forEach((q: any) => {
          const id: number = q.number ?? questions.length + 1;
          let text = "";
          let options: string[] | undefined;

          if (isMultiChoice) {
            text = q.question || q.text || `Question ${id}`;
            if (q.options && typeof q.options === "object") {
              if (Array.isArray(q.options)) {
                options = q.options;
              } else {
                options = Object.values(q.options) as string[];
              }
            }
          } else {
            const label = q.label || q.text || `Item ${id}`;
            text = `${label}: _____`;
          }

          questions.push({
            id,
            type: isMultiChoice ? "multiple-choice" : "gap-fill",
            part: parseInt((aiData.part || "Part 1").replace("Part ", "")) || 1,
            text,
            options,
          });
          fallbackAnswerKey[id.toString()] = q.answer;
        });
      });

      const generatedTest: ListeningTest = {
        id: aiData.id || `ai-${Date.now()}`,
        title: `AI Test: ${aiData.part || generatePart} — ${aiData.topic || aiData.context || "Listening Practice"}`,
        audio_url: "",
        transcript: aiData.transcript || null,
        questions,
        answer_key: aiData.answer_key || fallbackAnswerKey,
        difficulty: generateDifficulty,
        duration_minutes: aiData.duration_minutes || 30,
      };

      const newState = {
        testId: generatedTest.id,
        testContext: generatedTest,
        answers: {},
        notes: "",
        hasPlayed: false,
        timeRemaining: generatedTest.duration_minutes * 60,
        isAudioComplete: false,
        isSubmitted: false
      };

      if (user?.id) {
        sessionStorage.setItem(`${LISTENING_SESSION_PREFIX}-active`, JSON.stringify(newState));
        sessionStorage.setItem(`ielts-listening-active-diff-${user.id}`, generateDifficulty);
        sessionStorage.setItem(`ielts-listening-active-part-${user.id}`, generatePart);
      }

      if (isMountedRef.current) {
        generationStore.clearEntry('listening');
        await startTest(generatedTest);
      } else {
        // Component unmounted — store result for remount to apply
        generationStore.finishGen('listening', { generatedTest });
      }
    } catch (error: any) {
      console.error("generate-listening error:", error);
      const msg = error.message || "Failed to generate test. Please try again.";
      if (isMountedRef.current) {
        generationStore.clearEntry('listening');
        toast.error(msg);
      } else {
        generationStore.failGen('listening', msg);
      }
    }
  };

  const startTest = async (test: ListeningTest) => {
    // Stop any currently playing audio or speech synthesis
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    if (window.speechSynthesis.speaking || window.speechSynthesis.pending) {
      window.speechSynthesis.cancel();
    }
    speechRef.current = null;

    const newCache = {
      testId: test.id,
      testContext: test,
      answers: {},
      notes: "",
      hasPlayed: false,
      timeRemaining: test.duration_minutes * 60,
      isSubmitted: false
    };

    if (user?.id) sessionStorage.setItem(`${LISTENING_SESSION_PREFIX}-active`, JSON.stringify(newCache));

    setCurrentTest(test);
    setAnswers({});
    setNotes("");
    setHasPlayed(false);
    setIsPlaying(false);
    setIsSubmitted(false);
    setScore(null);
    setResults({});
    setShowTranscript(false);
    setTimeRemaining(test.duration_minutes * 60);
    setTimerEndAt(null);

    // Save progress immediately to count usage for free tier gating
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

  const handlePlay = () => {
    // Resume from pause
    if (isPaused) {
      setIsPaused(false);
      setIsPlaying(true);
      if (currentTest?.audio_url && audioRef.current) {
        audioRef.current.play();
      } else if (window.speechSynthesis.paused) {
        window.speechSynthesis.resume();
      }
      return;
    }
    if (hasPlayed) return;
    setIsPlaying(true);
    setHasPlayed(true);
    const endAt = Date.now() + timeRemaining * 1000;
    setTimerEndAt(endAt);

    if (currentTest?.audio_url) {
      if (audioRef.current) {
        audioRef.current.volume = volume;
        audioRef.current.play();
      }
    } else if (currentTest?.transcript) {
      const utterance = new SpeechSynthesisUtterance(currentTest.transcript);
      utterance.rate = 0.88;
      utterance.volume = volume;
      utterance.onend = handleAudioEnded;
      speechRef.current = utterance;
      window.speechSynthesis.speak(utterance);
    }
  };

  const handlePause = () => {
    setIsPaused(true);
    setIsPlaying(false);
    if (currentTest?.audio_url && audioRef.current) {
      audioRef.current.pause();
    } else if (window.speechSynthesis.speaking) {
      window.speechSynthesis.pause();
    }
  };

  const handleStop = () => {
    setIsPlaying(false);
    setIsPaused(false);
    setHasPlayed(false);
    setIsAudioComplete(false);
    if (currentTest?.audio_url && audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    } else if (window.speechSynthesis.speaking || window.speechSynthesis.pending) {
      window.speechSynthesis.cancel();
    }
    speechRef.current = null;
  };

  const handleAudioEnded = () => {
    setIsPlaying(false);
    setIsPaused(false);
    setIsAudioComplete(true);
  };

  const toggleMute = () => {
    const newMuted = !isMuted;
    setIsMuted(newMuted);
    if (audioRef.current) {
      audioRef.current.muted = newMuted;
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
      audioRef.current.muted = false;
      setIsMuted(false);
    }
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
    
    // Direct match
    if (normalizedUser === normalizedCorrect) return true;
    
    // Number word equivalents
    const numberWords: Record<string, string> = {
      "0": "zero", "1": "one", "2": "two", "3": "three", "4": "four",
      "5": "five", "6": "six", "7": "seven", "8": "eight", "9": "nine",
      "10": "ten", "11": "eleven", "12": "twelve", "13": "thirteen",
      "14": "fourteen", "15": "fifteen", "16": "sixteen", "17": "seventeen",
      "18": "eighteen", "19": "nineteen", "20": "twenty"
    };
    
    // Check if user typed number and correct is word (or vice versa)
    if (numberWords[normalizedUser] === normalizedCorrect) return true;
    const reverseMap = Object.fromEntries(
      Object.entries(numberWords).map(([k, v]) => [v, k])
    );
    if (reverseMap[normalizedUser] === normalizedCorrect) return true;
    
    return false;
  }, []);

  const handleSubmit = async () => {
    if (!currentTest) return;
    
    if (timerRef.current) clearInterval(timerRef.current);
    
    let correctCount = 0;
    const newResults: Record<string, { correct: boolean; correctAnswer: string }> = {};
    
    Object.entries(currentTest.answer_key).forEach(([questionId, correctAnswer]) => {
      const userAnswer = answers[questionId] || "";
      const isCorrect = checkAnswer(userAnswer, correctAnswer);
      if (isCorrect) correctCount++;
      newResults[questionId] = { correct: isCorrect, correctAnswer };
    });
    
    const totalQuestions = Object.keys(currentTest.answer_key).length;
    const bandScore = calculateBandScore(correctCount, totalQuestions);
    
    setScore(correctCount);
    setResults(newResults);
    setIsSubmitted(true);
    
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

        // Save to user_progress for stats tracking
        await saveProgress({
          exam_type: "listening",
          score: correctCount,
          band_score: bandScore,
          total_questions: totalQuestions,
          correct_answers: correctCount,
          feedback: `Test: ${currentTest.title}. Difficulty: ${currentTest.difficulty}`,
          completed_at: new Date().toISOString(),
          time_taken: currentTest.duration_minutes * 60 - timeRemaining,
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
    const percentage = (correct / total) * 100;
    if (percentage >= 95) return 9;
    if (percentage >= 87) return 8.5;
    if (percentage >= 80) return 8;
    if (percentage >= 72) return 7.5;
    if (percentage >= 65) return 7;
    if (percentage >= 57) return 6.5;
    if (percentage >= 50) return 6;
    if (percentage >= 42) return 5.5;
    if (percentage >= 35) return 5;
    if (percentage >= 27) return 4.5;
    if (percentage >= 20) return 4;
    return 3.5;
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const resetTest = () => {
    setCachedState(null);
    if (user?.id) sessionStorage.removeItem(`${LISTENING_SESSION_PREFIX}-active`);
    setCurrentTest(null);
    setAnswers({});
    setNotes("");
    setHasPlayed(false);
    setIsPlaying(false);
    setIsPaused(false);
    setIsSubmitted(false);
    setIsAudioComplete(false);
    setScore(null);
    setResults({});
    setShowTranscript(false);
  };

  const renderQuestion = (question: Question) => {
    const result = results[question.id.toString()];
    const isCorrect = result?.correct;
    const userAnswer = answers[question.id.toString()] || "";
    
    return (
      <div 
        key={question.id} 
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
            {question.id}
          </span>
          
          <div className="flex-1">
            {question.type === "gap-fill" ? (
              <div className="space-y-3">
                <p className="text-foreground leading-relaxed font-serif">
                  {question.text.split("_____").map((part, idx, arr) => (
                    <span key={idx}>
                      {part}
                      {idx < arr.length - 1 && (
                        <Input
                          value={userAnswer}
                          onChange={(e) => handleAnswerChange(question.id.toString(), e.target.value)}
                          className={`inline-block w-32 mx-1 h-8 text-center ${
                            isSubmitted 
                              ? isCorrect 
                                ? "border-green-500 bg-green-500/10" 
                                : "border-red-500 bg-red-500/10"
                              : ""
                          }`}
                          disabled={isSubmitted}
                          placeholder="..."
                        />
                      )}
                    </span>
                  ))}
                </p>
                {isSubmitted && !isCorrect && (
                  <p className="text-sm text-green-600">
                    Correct answer: <span className="font-medium">{result.correctAnswer}</span>
                  </p>
                )}
              </div>
            ) : (
              <div className="space-y-3">
                <p className="text-foreground leading-relaxed">{question.text}</p>
                <div className="space-y-2">
                  {question.options?.map((option, idx) => {
                    const optionLetter = String.fromCharCode(65 + idx);
                    const isSelected = userAnswer === optionLetter;
                    const isCorrectOption = result?.correctAnswer === optionLetter;
                    
                    return (
                      <label
                        key={idx}
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
                          name={`question-${question.id}`}
                          value={optionLetter}
                          checked={isSelected}
                          onChange={(e) => handleAnswerChange(question.id.toString(), e.target.value)}
                          disabled={isSubmitted}
                          className="w-4 h-4 text-accent"
                        />
                        <span className="font-medium text-muted-foreground mr-2">{optionLetter}.</span>
                        <span className="text-foreground">{option}</span>
                        {isSubmitted && isCorrectOption && (
                          <CheckCircle2 className="w-4 h-4 text-green-500 ml-auto" />
                        )}
                        {isSubmitted && isSelected && !isCorrectOption && (
                          <XCircle className="w-4 h-4 text-red-500 ml-auto" />
                        )}
                      </label>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  // Group questions by part
  const groupedQuestions = currentTest?.questions.reduce((acc, q) => {
    const part = q.part || 1;
    if (!acc[part]) acc[part] = [];
    acc[part].push(q);
    return acc;
  }, {} as Record<number, Question[]>) || {};

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
        {tests.map((test) => (
          <button
            key={test.id}
            onClick={() => !canAccess("listening") ? setShowUpgradeModal(true) : startTest(test)}
            className="glass-card p-6 text-left hover:scale-[1.01] transition-all group"
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
            {/* Timer */}
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
            src={currentTest.audio_url}
            onEnded={handleAudioEnded}
            preload="metadata"
          />

          <div className="flex items-center gap-4">
            {/* Playback Controls */}
            <div className="flex items-center gap-2">
              {!hasPlayed || isPaused ? (
                <Button
                  onClick={handlePlay}
                  variant="neumorphicPrimary"
                  size="lg"
                  className="rounded-full w-12 h-12"
                  title={isPaused ? "Resume" : "Play"}
                >
                  <Play className="w-5 h-5 ml-0.5" />
                </Button>
              ) : isPlaying ? (
                <Button
                  onClick={handlePause}
                  variant="outline"
                  size="lg"
                  className="rounded-full w-12 h-12"
                  title="Pause"
                >
                  <Pause className="w-5 h-5" />
                </Button>
              ) : (
                <div className="w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center">
                  <CheckCircle2 className="w-6 h-6 text-green-500" />
                </div>
              )}

              {hasPlayed && !isAudioComplete && (
                <Button
                  onClick={handleStop}
                  variant="ghost"
                  size="icon"
                  className="rounded-full w-9 h-9 text-muted-foreground hover:text-destructive"
                  title="Stop"
                >
                  <Square className="w-4 h-4" />
                </Button>
              )}
            </div>

            <div className="flex-1">
              {!hasPlayed ? (
                <p className="text-muted-foreground text-sm">
                  Press play to start. You can pause if needed.
                </p>
              ) : isPaused ? (
                <p className="text-yellow-500 text-sm">Paused — press play to resume.</p>
              ) : isPlaying ? (
                <p className="text-accent text-sm animate-pulse">Audio playing... Listen carefully!</p>
              ) : (
                <p className="text-green-600 text-sm">Audio complete. Answer the questions below.</p>
              )}
            </div>

            {/* Volume Control */}
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" onClick={toggleMute}>
                {isMuted || volume === 0 ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
              </Button>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={isMuted ? 0 : volume}
                onChange={handleVolumeChange}
                className="w-24 accent-accent cursor-pointer"
              />
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
                  <span className="text-muted-foreground">/{Object.keys(currentTest.answer_key).length}</span>
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Estimated Band</p>
                <p className="text-3xl font-light text-elite-gold">
                  {calculateBandScore(score, Object.keys(currentTest.answer_key).length)}
                </p>
              </div>
              {currentTest.transcript && (
                <Button 
                  variant="outline" 
                  onClick={() => setShowTranscript(!showTranscript)}
                >
                  <FileText className="w-4 h-4 mr-2" />
                  {showTranscript ? "Hide" : "Show"} Transcript
                </Button>
              )}
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-4 gap-4 min-h-0">
          {/* Questions Panel */}
          <div className="lg:col-span-3 glass-card p-4 flex flex-col min-h-0">
            <h2 className="text-lg font-light mb-4 flex-shrink-0">Questions</h2>
            
            <ScrollArea className="flex-1">
              <div className="space-y-6 pr-4">
                {showTranscript && currentTest.transcript ? (
                  <div className="p-4 bg-secondary/30 rounded-lg">
                    <h3 className="font-medium mb-3 text-accent">Transcript</h3>
                    <p className="whitespace-pre-wrap font-serif text-foreground/90 leading-relaxed">
                      {currentTest.transcript}
                    </p>
                  </div>
                ) : (
                  Object.entries(groupedQuestions).map(([part, questions]) => (
                    <div key={part}>
                      <h3 className="text-sm font-medium text-muted-foreground mb-3 uppercase tracking-wide">
                        Part {part}
                      </h3>
                      <div className="space-y-4">
                        {questions.map(renderQuestion)}
                      </div>
                    </div>
                  ))
                )}
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

        {/* Footer */}
        {!isSubmitted && (
          <div className="flex-shrink-0 mt-4 flex justify-end">
            <Button 
              onClick={handleSubmit}
              size="lg"
              className="bg-accent hover:bg-accent/90"
              disabled={!hasPlayed}
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
