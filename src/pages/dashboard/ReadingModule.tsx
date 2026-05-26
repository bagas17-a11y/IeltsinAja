import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  BookOpen, Loader2, Clock, CheckCircle, XCircle,
  ChevronRight, Lightbulb, Target, Lock, Play, Pause, ArrowLeft, FileText,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useUserProgress } from "@/hooks/useUserProgress";
import { useAuth } from "@/hooks/useAuth";
import { useFeatureGating } from "@/hooks/useFeatureGating";
import { UpgradeModal } from "@/components/UpgradeModal";
import { useGenerationContext } from "@/hooks/useGenerationContext";
import { cn } from "@/lib/utils";

// ─── Types ───────────────────────────────────────────────────────────────────

interface QuestionItem {
  number: number;
  statement?: string;
  question?: string;
  sentence?: string;
  sentence_start?: string;
  options?: Record<string, string>;
  paragraph?: string;
  answer: string;
  evidence: string;
  explanation: string;
}

interface QuestionGroup {
  type: string;
  instruction: string;
  question_range: [number, number];
  headings_pool?: string[];
  options_pool?: Record<string, string>;
  word_bank?: string[];
  summary?: string;
  endings_pool?: Record<string, string>;
  note?: string;
  items: QuestionItem[];
}

interface Passage {
  title: string;
  topic: string;
  wordCount: number;
  content: string;
}

interface Section {
  section_number: number;
  passage: Passage;
  question_groups: QuestionGroup[];
}

interface ReadingTest {
  id: string;
  title: string;
  difficulty: string;
  totalQuestions: number;
  durationMinutes: number;
  topicTags: string[];
  sections: Section[];
}

interface LibraryEntry {
  id: string;
  title: string;
  difficulty: "easy" | "medium" | "hard";
  total_questions: number;
  duration_minutes: number;
  topic_tags: string[];
  created_at: string;
}

interface DifficultyCache {
  test: ReadingTest;
  userAnswers: Record<number, string>;
  isSubmitted: boolean;
  timeRemaining: number;
  timerEndAt: number | null;
  isTimerPaused?: boolean;
  activeSection?: number;
}

// ─── Constants ───────────────────────────────────────────────────────────────

const TEST_DURATION_SECONDS = 60 * 60;

// Official IELTS Academic Reading raw-score → band conversion
function rawScoreToBand(correct: number, total: number): number {
  const raw = total === 40 ? correct : Math.round((correct / total) * 40);
  if (raw >= 39) return 9;
  if (raw >= 37) return 8.5;
  if (raw >= 35) return 8;
  if (raw >= 33) return 7.5;
  if (raw >= 30) return 7;
  if (raw >= 27) return 6.5;
  if (raw >= 23) return 6;
  if (raw >= 19) return 5.5;
  if (raw >= 15) return 5;
  if (raw >= 13) return 4.5;
  if (raw >= 10) return 4;
  if (raw >= 8) return 3.5;
  if (raw >= 6) return 3;
  if (raw >= 4) return 2.5;
  if (raw >= 3) return 2;
  if (raw >= 2) return 1.5;
  if (raw >= 1) return 1;
  return 0;
}

const QUESTION_TYPE_LABEL: Record<string, string> = {
  tfng: "True / False / Not Given",
  ynng: "Yes / No / Not Given",
  multiple_choice: "Multiple Choice",
  matching_headings: "Matching Headings",
  matching_features: "Matching Features",
  matching_information: "Matching Information",
  matching_sentence_endings: "Matching Sentence Endings",
  sentence_completion: "Sentence Completion",
  summary_completion: "Summary Completion",
  note_completion: "Note Completion",
};

const DIFFICULTY_COLOR: Record<string, string> = {
  easy: "bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/30",
  medium: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30",
  hard: "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/30",
};

// ─── Main Component ───────────────────────────────────────────────────────────

export default function ReadingModule() {
  const { user } = useAuth();
  const userId = user?.id ?? null;
  const isMountedRef = useRef(true);

  useEffect(() => {
    isMountedRef.current = true;
    return () => { isMountedRef.current = false; };
  }, []);

  // Completed test IDs
  const [completedIds, setCompletedIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (!userId) return;
    try {
      const stored = localStorage.getItem(`ielts-reading-completed-${userId}`);
      if (stored) setCompletedIds(new Set(JSON.parse(stored)));
    } catch { }
  }, [userId]);

  const markReadingCompleted = (testId: string) => {
    if (!userId) return;
    setCompletedIds((prev) => {
      const next = new Set(prev);
      next.add(testId);
      try { localStorage.setItem(`ielts-reading-completed-${userId}`, JSON.stringify([...next])); } catch { }
      return next;
    });
  };

  // Library browser state
  const [libraryTests, setLibraryTests] = useState<LibraryEntry[]>([]);
  const [isBrowserLoading, setIsBrowserLoading] = useState(true);
  const [libraryFilter, setLibraryFilter] = useState<"all" | "easy" | "medium" | "hard">("all");
  const [doneFilter, setDoneFilter] = useState<"all" | "done" | "not-done">("all");
  const [loadingTestId, setLoadingTestId] = useState<string | null>(null);
  const genCtx = useGenerationContext();
  const isAiGenerating = genCtx.reading.status === "generating";
  const [aiDifficulty, setAiDifficulty] = useState<"easy" | "medium" | "hard">("medium");

  // Active test state
  const [currentTest, setCurrentTest] = useState<ReadingTest | null>(null);
  const [difficulty, setDifficulty] = useState<"easy" | "medium" | "hard">("medium");
  const [activeSection, setActiveSection] = useState(1);
  const [userAnswers, setUserAnswers] = useState<Record<number, string>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(TEST_DURATION_SECONDS);
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [isTimerPaused, setIsTimerPaused] = useState(false);
  const [timerEndAt, setTimerEndAt] = useState<number | null>(null);
  const [highlightedEvidence, setHighlightedEvidence] = useState<string | null>(null);
  const [selectedQuestion, setSelectedQuestion] = useState<number | null>(null);
  const [testStartTime, setTestStartTime] = useState<Date | null>(null);
  const [testCache, setTestCache] = useState<Partial<Record<"easy" | "medium" | "hard", DifficultyCache>>>({});

  const passageRef = useRef<HTMLDivElement>(null);
  const questionRefs = useRef<Record<number, HTMLDivElement | null>>({});
  const splitContainerRef = useRef<HTMLDivElement>(null);
  const [splitPercent, setSplitPercent] = useState(60);
  const { toast } = useToast();
  const { saveProgress } = useUserProgress();
  const { canAccess, refreshCounts, isLoading: isGatingLoading } = useFeatureGating();
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const navigate = useNavigate();

  // Fetch library on mount
  useEffect(() => {
    fetchLibrary();
  }, []); // eslint-disable-line

  const fetchLibrary = async () => {
    setIsBrowserLoading(true);
    const { data, error } = await supabase
      .from("reading_test_library")
      .select("id, title, difficulty, total_questions, duration_minutes, topic_tags, created_at")
      .eq("is_active", true)
      .order("created_at", { ascending: false });
    if (!error && data) setLibraryTests(data as LibraryEntry[]);
    setIsBrowserLoading(false);
  };

  // Hydrate cache from sessionStorage; auto-restore an in-progress test
  useEffect(() => {
    if (!userId) return;
    const loaded: Partial<Record<"easy" | "medium" | "hard", DifficultyCache>> = {};
    (["easy", "medium", "hard"] as const).forEach((d) => {
      try {
        const raw = sessionStorage.getItem(`ielts-reading-${userId}-${d}`);
        if (raw) loaded[d] = JSON.parse(raw) as DifficultyCache;
      } catch { /* ignore */ }
    });
    setTestCache(loaded);

    // Restore an in-progress (not submitted) test automatically
    const activeDiff = sessionStorage.getItem(`ielts-reading-active-diff-${userId}`) as "easy" | "medium" | "hard" | null;
    const cached = activeDiff ? loaded[activeDiff] : null;
    if (cached && !cached.isSubmitted) {
      const remaining = cached.timerEndAt && !cached.isTimerPaused
        ? Math.max(0, Math.ceil((cached.timerEndAt - Date.now()) / 1000))
        : cached.timeRemaining;
      setCurrentTest(cached.test);
      setDifficulty(activeDiff!);
      setUserAnswers(cached.userAnswers);
      setTimeRemaining(remaining);
      setTimerEndAt(cached.timerEndAt);
      setActiveSection(cached.activeSection ?? 1);
      if (remaining > 0) {
        setIsTimerActive(true);
        setIsTimerPaused(cached.isTimerPaused ?? false);
      }
    }
  }, [userId]); // eslint-disable-line

  // Persist cache changes
  useEffect(() => {
    if (!userId) return;
    (["easy", "medium", "hard"] as const).forEach((d) => {
      const entry = testCache[d];
      if (entry) sessionStorage.setItem(`ielts-reading-${userId}-${d}`, JSON.stringify(entry));
    });
  }, [testCache, userId]);

  // Timer tick
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isTimerActive && !isTimerPaused && !isSubmitted && timerEndAt) {
      interval = setInterval(() => {
        const remaining = Math.max(0, Math.ceil((timerEndAt - Date.now()) / 1000));
        setTimeRemaining(remaining);
        if (remaining <= 0) { handleSubmit(); clearInterval(interval); }
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerActive, isTimerPaused, isSubmitted, timerEndAt]); // eslint-disable-line

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  const allItems = useMemo(() => {
    if (!currentTest) return [] as { item: QuestionItem; group: QuestionGroup; section: number }[];
    const out: { item: QuestionItem; group: QuestionGroup; section: number }[] = [];
    currentTest.sections.forEach((s) =>
      s.question_groups.forEach((g) =>
        g.items.forEach((it) => out.push({ item: it, group: g, section: s.section_number }))
      )
    );
    return out.sort((a, b) => a.item.number - b.item.number);
  }, [currentTest]);

  const handleAnswerChange = (n: number, ans: string) => {
    if (isSubmitted) return;
    setUserAnswers((prev) => ({ ...prev, [n]: ans }));
  };

  // ─── Load a specific test from the library ─────────────────────────────────
  const loadTestById = async (entry: LibraryEntry) => {
    if (isGatingLoading) return;
    if (!canAccess("reading")) { setShowUpgradeModal(true); return; }
    setLoadingTestId(entry.id);

    try {
      try {
        await saveProgress({
          exam_type: "reading", score: null, band_score: null,
          total_questions: null, correct_answers: null,
          feedback: `Started reading test. Difficulty: ${entry.difficulty}`,
          completed_at: new Date().toISOString(), time_taken: null, errors_log: [],
          metadata: { difficulty: entry.difficulty, testId: entry.id, status: "started" },
        });
        await refreshCounts();
      } catch { /* non-fatal */ }

      const { data, error } = await supabase
        .from("reading_test_library")
        .select("id, title, difficulty, total_questions, duration_minutes, sections, topic_tags")
        .eq("id", entry.id)
        .single();

      if (error) throw error;

      // DB stores sections as { sections: [...] }
      const raw = data.sections as { sections: Section[] } | Section[];
      const sections: Section[] = Array.isArray(raw) ? raw : (raw as { sections: Section[] }).sections;

      if (!sections?.length) throw new Error("Test data is incomplete.");

      const readingTest: ReadingTest = {
        id: data.id, title: data.title, difficulty: data.difficulty,
        totalQuestions: data.total_questions, durationMinutes: data.duration_minutes,
        topicTags: data.topic_tags ?? [], sections,
      };

      const diff = entry.difficulty;
      const newTimerEndAt = Date.now() + TEST_DURATION_SECONDS * 1000;
      const newCache: DifficultyCache = {
        test: readingTest, userAnswers: {}, isSubmitted: false,
        timeRemaining: TEST_DURATION_SECONDS, timerEndAt: newTimerEndAt,
        isTimerPaused: false, activeSection: 1,
      };

      try {
        if (userId) {
          sessionStorage.setItem(`ielts-reading-${userId}-${diff}`, JSON.stringify(newCache));
          sessionStorage.setItem(`ielts-reading-active-diff-${userId}`, diff);
        }
      } catch { /* ignore */ }

      setDifficulty(diff);
      setCurrentTest(readingTest);
      setUserAnswers({});
      setIsSubmitted(false);
      setHighlightedEvidence(null);
      setSelectedQuestion(null);
      setTimerEndAt(newTimerEndAt);
      setTimeRemaining(TEST_DURATION_SECONDS);
      setActiveSection(1);
      setTestCache((prev) => ({ ...prev, [diff]: newCache }));
      setIsTimerActive(true);
      setIsTimerPaused(false);
      setTestStartTime(new Date());
      toast({ title: "Test ready!", description: `${readingTest.title} — 60 minutes. Timer started.` });
    } catch (err: any) {
      toast({ title: "Failed to load test", description: err?.message || "Please try again.", variant: "destructive" });
    } finally {
      setLoadingTestId(null);
    }
  };

  // ─── AI generation ────────────────────────────────────────────────────────
  const generateAITest = () => {
    if (isGatingLoading) return;
    if (!canAccess("reading")) { setShowUpgradeModal(true); return; }
    genCtx.startReadingGeneration(aiDifficulty);
  };

  // React to completed/failed generation (fires even when returning to this module)
  useEffect(() => {
    const { status, data, errorMessage, difficulty: genDiff } = genCtx.reading;
    if (status === "done" && data) {
      const resolved = data;
      const usedDifficulty = (genDiff as "easy" | "medium" | "hard") ?? aiDifficulty;
      const readingTest: ReadingTest = {
        id: resolved.id ?? crypto.randomUUID(),
        title: resolved.title ?? "AI Reading Test",
        difficulty: resolved.difficulty ?? usedDifficulty,
        totalQuestions: resolved.totalQuestions ?? 40,
        durationMinutes: resolved.durationMinutes ?? 60,
        topicTags: resolved.topicTags ?? [],
        sections: resolved.sections,
      };
      genCtx.consumeReading();
      const newTimerEndAt = Date.now() + TEST_DURATION_SECONDS * 1000;
      setCurrentTest(readingTest);
      setDifficulty(usedDifficulty);
      setUserAnswers({});
      setIsSubmitted(false);
      setActiveSection(1);
      setTimeRemaining(TEST_DURATION_SECONDS);
      setTimerEndAt(newTimerEndAt);
      setIsTimerActive(true);
      setIsTimerPaused(false);
      setTestStartTime(new Date());
      setTestCache((prev) => ({
        ...prev,
        [usedDifficulty]: { test: readingTest, userAnswers: {}, isSubmitted: false, timeRemaining: TEST_DURATION_SECONDS, timerEndAt: newTimerEndAt },
      }));
      toast({ title: "AI test ready!", description: `${readingTest.title} — 60 minutes. Timer started.` });
    } else if (status === "error" && errorMessage) {
      genCtx.resetReading();
      toast({ title: "Failed to generate AI test", description: errorMessage, variant: "destructive" });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [genCtx.reading.status]);

  // ─── Submit ────────────────────────────────────────────────────────────────
  const handleSubmit = useCallback(async () => {
    if (!currentTest || !user) return;
    setIsSubmitted(true);
    setIsTimerActive(false);
    setTestCache((prev) => {
      const existing = prev[difficulty];
      if (!existing) return prev;
      return { ...prev, [difficulty]: { ...existing, isSubmitted: true, timerEndAt: null } };
    });

    let correct = 0;
    const errorCounts: Record<string, number> = {};
    allItems.forEach(({ item, group }) => {
      const ua = userAnswers[item.number]?.trim().toUpperCase();
      if (ua === item.answer.trim().toUpperCase()) correct++;
      else errorCounts[group.type] = (errorCounts[group.type] || 0) + 1;
    });

    const total = allItems.length;
    const band = rawScoreToBand(correct, total);

    const timeTaken = testStartTime
      ? Math.floor((Date.now() - testStartTime.getTime()) / 1000)
      : TEST_DURATION_SECONDS - timeRemaining;

    markReadingCompleted(currentTest.id);

    try {
      await saveProgress({
        exam_type: "reading", score: correct, band_score: band,
        total_questions: total, correct_answers: correct,
        feedback: `Test: ${currentTest.title}. Difficulty: ${currentTest.difficulty}`,
        completed_at: new Date().toISOString(), time_taken: timeTaken,
        errors_log: Object.entries(errorCounts).map(([type, count]) => ({ type, count })),
        metadata: { testId: currentTest.id, difficulty: currentTest.difficulty },
      });
    } catch { /* ignore */ }

    toast({ title: `Score: ${correct}/${total}`, description: `Estimated Band Score: ${band}` });
  }, [currentTest, user, allItems, userAnswers, difficulty, testStartTime, timeRemaining, saveProgress, toast]);

  // ─── Helpers ───────────────────────────────────────────────────────────────
  const getQuestionResult = (n: number): "correct" | "incorrect" | "blank" | null => {
    if (!isSubmitted) return null;
    const found = allItems.find((x) => x.item.number === n);
    if (!found) return null;
    const ua = userAnswers[n]?.trim().toUpperCase();
    if (!ua) return "blank";
    return ua === found.item.answer.trim().toUpperCase() ? "correct" : "incorrect";
  };

  const handleQuestionClick = (n: number) => {
    if (!isSubmitted) return;
    const found = allItems.find((x) => x.item.number === n);
    if (!found) return;
    if (found.section !== activeSection) setActiveSection(found.section);
    setSelectedQuestion(n);
    setHighlightedEvidence(found.item.evidence);
    setTimeout(() => questionRefs.current[n]?.scrollIntoView({ behavior: "smooth", block: "center" }), 50);
  };

  const calculateScore = () => {
    let correct = 0;
    allItems.forEach(({ item }) => {
      if (userAnswers[item.number]?.trim().toUpperCase() === item.answer.trim().toUpperCase()) correct++;
    });
    return { correct, total: allItems.length };
  };

  const highlightPassage = (content: string) => {
    if (!highlightedEvidence || !isSubmitted) return content;
    const start = highlightedEvidence.substring(0, 100);
    const idx = content.toLowerCase().indexOf(start.toLowerCase());
    if (idx === -1) return content;
    const before = content.substring(0, idx);
    const match = content.substring(idx, idx + highlightedEvidence.length);
    const after = content.substring(idx + highlightedEvidence.length);
    return `${before}<mark class="bg-accent/30 text-foreground px-0.5 rounded">${match}</mark>${after}`;
  };

  const backToLibrary = () => {
    if (currentTest && !isSubmitted) {
      setTestCache((prev) => ({
        ...prev,
        [difficulty]: {
          test: currentTest, userAnswers, isSubmitted, timeRemaining,
          timerEndAt: isTimerActive && !isTimerPaused ? timerEndAt : null,
          isTimerPaused, activeSection,
        },
      }));
    } else if (isSubmitted && userId) {
      sessionStorage.removeItem(`ielts-reading-active-diff-${userId}`);
    }
    setCurrentTest(null);
    setIsTimerActive(false);
  };

  const handleSplitDrag = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    document.body.style.cursor = "col-resize";
    document.body.style.userSelect = "none";

    const onMouseMove = (ev: MouseEvent) => {
      if (!splitContainerRef.current) return;
      const rect = splitContainerRef.current.getBoundingClientRect();
      const pct = ((ev.clientX - rect.left) / rect.width) * 100;
      setSplitPercent(Math.min(75, Math.max(25, pct)));
    };

    const onMouseUp = () => {
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
  }, []);

  const currentSection = currentTest?.sections.find((s) => s.section_number === activeSection);
  const filteredTests = libraryTests
    .filter(t => libraryFilter === "all" || t.difficulty === libraryFilter)
    .filter(t => doneFilter === "all" || (doneFilter === "done" ? completedIds.has(t.id) : !completedIds.has(t.id)));

  // ─────────────────────────────────────────────────────────────────────────
  // RENDER: Library browser (no active test)
  // ─────────────────────────────────────────────────────────────────────────
  if (isAiGenerating) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center h-64 gap-4">
          <Loader2 className="w-8 h-8 animate-spin text-accent" />
          <p className="text-sm text-muted-foreground animate-pulse">
            Generating your IELTS reading test — this may take a few seconds…
          </p>
        </div>
      </DashboardLayout>
    );
  }

  if (!currentTest) {
    // Free plan lock — shown once the one free reading test has been used
    if (!isGatingLoading && !canAccess("reading")) {
      return (
        <DashboardLayout>
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-accent" />
              </div>
              <div>
                <h1 className="text-2xl font-light">Reading Practice</h1>
                <p className="text-sm text-muted-foreground">IELTS Academic Reading</p>
              </div>
            </div>
            <div className="glass-card p-12 text-center">
              <div className="w-20 h-20 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-6">
                <Lock className="w-10 h-10 text-accent" />
              </div>
              <h2 className="text-xl font-light mb-3">Free Practice Used</h2>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                You've used your one free reading test. Upgrade for unlimited tests.
              </p>
              <Button onClick={() => navigate("/pricing-selection")} variant="neumorphicPrimary">
                View Plans
              </Button>
            </div>
          </div>
          <UpgradeModal isOpen={showUpgradeModal} onClose={() => setShowUpgradeModal(false)} featureName="Reading" />
        </DashboardLayout>
      );
    }

    return (
      <DashboardLayout>
        <div className="space-y-6 max-w-5xl">
          {/* Header */}
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center shrink-0">
                <BookOpen className="w-5 h-5 text-accent" />
              </div>
              <div>
                <h1 className="text-xl font-light">Reading Practice</h1>
                <p className="text-xs text-muted-foreground">
                  IELTS Academic Reading — 3 passages · 40 questions · 60 minutes
                </p>
              </div>
            </div>
            {/* AI Generate button */}
            <div className="flex items-center gap-2">
              <select
                value={aiDifficulty}
                onChange={(e) => setAiDifficulty(e.target.value as typeof aiDifficulty)}
                className="bg-secondary/50 border border-border/50 rounded-md px-2 py-1.5 text-sm text-foreground"
              >
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
              <Button
                onClick={generateAITest}
                disabled={isAiGenerating || !!loadingTestId}
                className="bg-accent hover:bg-accent/90 whitespace-nowrap"
                size="sm"
              >
                {isAiGenerating ? <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" /> : null}
                Generate AI Test
              </Button>
            </div>
          </div>

          {/* Filter bar */}
          <div className="flex items-center gap-2 flex-wrap">
            {(["all", "easy", "medium", "hard"] as const).map((f) => (
              <button
                key={f}
                onClick={() => setLibraryFilter(f)}
                className={cn(
                  "px-4 py-1.5 text-sm rounded-lg border transition-all capitalize font-medium",
                  libraryFilter === f
                    ? f === "all"
                      ? "bg-accent/10 border-accent text-accent"
                      : cn(DIFFICULTY_COLOR[f], "border")
                    : "border-border/50 text-muted-foreground hover:border-border hover:text-foreground"
                )}
              >
                {f === "all" ? "All Tests" : f}
              </button>
            ))}
            {!isBrowserLoading && (
              <span className="ml-auto text-sm text-muted-foreground">
                {filteredTests.length} {filteredTests.length === 1 ? "test" : "tests"} available
              </span>
            )}
          </div>

          {/* Done/Not-Done filter pills */}
          <div className="flex items-center gap-2 flex-wrap">
            {(["all", "done", "not-done"] as const).map((f) => (
              <button
                key={f}
                onClick={() => setDoneFilter(f)}
                className={cn(
                  "text-xs px-3 py-1.5 rounded-full border transition-colors capitalize",
                  doneFilter === f
                    ? "bg-accent text-accent-foreground border-accent"
                    : "border-border/50 text-muted-foreground hover:border-accent/50 hover:text-foreground"
                )}
              >
                {f === "all" ? "All" : f === "done" ? "Done" : "Not Done"}
              </button>
            ))}
          </div>

          {/* Grid */}
          {isBrowserLoading ? (
            <div className="flex justify-center py-24">
              <Loader2 className="w-8 h-8 animate-spin text-accent" />
            </div>
          ) : filteredTests.length === 0 ? (
            <div className="text-center py-24 text-muted-foreground">
              <FileText className="w-12 h-12 mx-auto mb-4 opacity-30" />
              <p className="font-medium">No {libraryFilter !== "all" ? libraryFilter + " " : ""}tests available yet.</p>
              <p className="text-sm mt-1 opacity-70">Check back later or try a different difficulty.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
              {filteredTests.map((test) => (
                <div
                  key={test.id}
                  className={cn(
                    "glass-card p-5 flex flex-col gap-3 hover:border-accent/40 transition-colors cursor-pointer group",
                    completedIds.has(test.id) ? "border-green-500/30 bg-green-500/5" : "border-border/50"
                  )}
                  onClick={() => !loadingTestId && loadTestById(test)}
                >
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="text-sm font-semibold leading-snug group-hover:text-accent transition-colors">
                      {test.title}
                    </h3>
                    <div className="flex items-center gap-1.5 shrink-0">
                      {completedIds.has(test.id) && (
                        <span className="text-xs px-2 py-0.5 rounded flex items-center gap-1 bg-green-500/15 text-green-500">
                          <CheckCircle className="w-3 h-3" />
                          Done
                        </span>
                      )}
                      <Badge variant="outline" className={cn("text-[10px] capitalize", DIFFICULTY_COLOR[test.difficulty])}>
                        {test.difficulty}
                      </Badge>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span>{test.total_questions} questions</span>
                    <span className="opacity-40">·</span>
                    <span>{test.duration_minutes} min</span>
                  </div>

                  {test.topic_tags?.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {test.topic_tags.slice(0, 3).map((tag) => (
                        <span key={tag} className="text-[10px] px-2 py-0.5 rounded-full bg-secondary/60 text-muted-foreground capitalize">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}

                  <Button
                    variant="neumorphicPrimary"
                    size="sm"
                    disabled={!!loadingTestId || isGatingLoading}
                    className="mt-auto w-full"
                    onClick={(e) => { e.stopPropagation(); loadTestById(test); }}
                  >
                    {loadingTestId === test.id ? (
                      <><Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />Loading...</>
                    ) : !canAccess("reading") ? (
                      <><Lock className="w-3.5 h-3.5 mr-1.5" />Upgrade to Access</>
                    ) : (
                      <>Start Test<ChevronRight className="w-3.5 h-3.5 ml-1.5" /></>
                    )}
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>

        <UpgradeModal isOpen={showUpgradeModal} onClose={() => setShowUpgradeModal(false)} featureName="Reading" />
      </DashboardLayout>
    );
  }

  // ─────────────────────────────────────────────────────────────────────────
  // RENDER: Active test view
  // ─────────────────────────────────────────────────────────────────────────
  return (
    <DashboardLayout>
      <div className="h-[calc(100vh-2rem)] flex flex-col gap-3">

        {/* Test header */}
        <div className="flex items-center gap-3 flex-shrink-0">
          <Button variant="ghost" size="sm" onClick={backToLibrary} className="gap-1.5 text-muted-foreground hover:text-foreground shrink-0">
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Library</span>
          </Button>

          <div className="flex-1 min-w-0">
            <h1 className="text-base font-medium truncate">{currentTest.title}</h1>
          </div>

          {/* Timer + pause */}
          <div className="flex items-center gap-2 shrink-0">
            <div className={cn(
              "flex items-center gap-2 px-3 py-1.5 rounded-lg border",
              timeRemaining < 300 ? "border-destructive/50 bg-destructive/10" : "border-border bg-card",
              isTimerPaused && "opacity-60"
            )}>
              <Clock className={cn("w-4 h-4", timeRemaining < 300 ? "text-destructive" : "text-muted-foreground")} />
              <span className={cn("font-mono text-sm tabular-nums", timeRemaining < 300 ? "text-destructive" : "text-foreground")}>
                {formatTime(timeRemaining)}
              </span>
            </div>
            {!isSubmitted && isTimerActive && (
              <Button
                variant="outline"
                size="icon"
                onClick={() => {
                  if (isTimerPaused) {
                    setTimerEndAt(Date.now() + timeRemaining * 1000);
                    setIsTimerPaused(false);
                  } else {
                    if (timerEndAt) setTimeRemaining(Math.max(0, Math.ceil((timerEndAt - Date.now()) / 1000)));
                    setIsTimerPaused(true);
                  }
                }}
                className={cn("h-8 w-8", isTimerPaused ? "bg-emerald-500/10 border-emerald-500/30" : "bg-amber-500/10 border-amber-500/30")}
              >
                {isTimerPaused
                  ? <Play className="w-4 h-4 text-emerald-500 fill-emerald-500/20" />
                  : <Pause className="w-4 h-4 text-amber-500 fill-amber-500/20" />}
              </Button>
            )}
          </div>
        </div>

        {/* Score banner */}
        {isSubmitted && (
          <div className="glass-card px-5 py-3 flex-shrink-0 flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Target className="w-5 h-5 text-accent" />
                <span className="text-base font-light">
                  Score: <span className="text-accent font-semibold">{calculateScore().correct}/{calculateScore().total}</span>
                </span>
              </div>
              <Badge variant="outline" className="text-accent border-accent">
                Band {(() => {
                  const { correct, total } = calculateScore();
                  return rawScoreToBand(correct, total);
                })()}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground hidden sm:block">
              Click any question in the navigator to highlight the evidence
            </p>
          </div>
        )}

        {/* Section tabs */}
        <div className="flex items-center gap-2 flex-shrink-0">
          {currentTest.sections.map((s) => {
            const sectionItems = allItems.filter((x) => x.section === s.section_number);
            const answered = sectionItems.filter((x) => userAnswers[x.item.number]).length;
            const correct = isSubmitted
              ? sectionItems.filter((x) => getQuestionResult(x.item.number) === "correct").length
              : 0;
            return (
              <button
                key={s.section_number}
                onClick={() => { setActiveSection(s.section_number); setSelectedQuestion(null); setHighlightedEvidence(null); }}
                className={cn(
                  "flex-1 text-left px-4 py-2.5 rounded-lg border transition-all",
                  activeSection === s.section_number
                    ? "border-accent bg-accent/10"
                    : "border-border bg-card/50 hover:border-border/80"
                )}
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="min-w-0">
                    <div className="text-[10px] text-muted-foreground">Passage {s.section_number}</div>
                    <div className="text-xs font-semibold truncate">{s.passage.title}</div>
                  </div>
                  <span className="text-xs shrink-0">
                    {isSubmitted
                      ? <span className="text-accent">{correct}/{sectionItems.length}</span>
                      : <span className="text-muted-foreground">{answered}/{sectionItems.length}</span>}
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Two-column body */}
        {currentSection && (
          <div ref={splitContainerRef} className="flex-1 flex flex-row min-h-0 select-none">

            {/* ── Left: Passage ── */}
            <div className="glass-card flex flex-col min-h-0 overflow-hidden flex-shrink-0" style={{ width: `${splitPercent}%` }}>
              <div className="px-6 py-4 border-b border-border/30 flex-shrink-0">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h2 className="text-lg font-bold leading-snug">{currentSection.passage.title}</h2>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Passage {currentSection.section_number} · {currentSection.passage.topic}
                      {currentSection.passage.wordCount ? ` · ~${currentSection.passage.wordCount} words` : ""}
                    </p>
                  </div>
                  <Badge variant="outline" className={cn("text-[10px] capitalize shrink-0 mt-0.5", DIFFICULTY_COLOR[currentTest.difficulty])}>
                    {currentTest.difficulty}
                  </Badge>
                </div>
              </div>

              <ScrollArea className="flex-1">
                <div
                  ref={passageRef}
                  className="px-8 py-6 text-[15.5px] leading-[1.9] text-foreground/90"
                  style={{ fontFamily: "Arial, Helvetica, sans-serif", maxWidth: 700 }}
                  dangerouslySetInnerHTML={{
                    __html: highlightPassage(currentSection.passage.content)
                      .split("\n\n")
                      .map((para) => {
                        const m = para.match(/^([A-Z])\s+([\s\S]+)/);
                        if (m) {
                          return `<p class="mb-5"><strong style="display:inline-block;min-width:1.5rem;font-weight:700;font-size:15.5px">${m[1]}</strong>&nbsp;&nbsp;${m[2]}</p>`;
                        }
                        return `<p class="mb-5">${para}</p>`;
                      })
                      .join(""),
                  }}
                />
              </ScrollArea>
            </div>

            {/* ── Drag handle ── */}
            <div
              onMouseDown={handleSplitDrag}
              className="w-3 flex-shrink-0 flex items-center justify-center cursor-col-resize group z-10 mx-0.5"
              title="Drag to resize"
            >
              <div className="w-0.5 h-10 rounded-full bg-border/50 group-hover:bg-accent group-hover:h-16 transition-all duration-150" />
            </div>

            {/* ── Right: Questions ── */}
            <div className="glass-card flex flex-col min-h-0 overflow-hidden flex-1">
              <div className="px-5 py-4 border-b border-border/30 flex-shrink-0">
                <h2 className="text-base font-bold">
                  Questions {currentSection.question_groups[0]?.question_range[0]}–
                  {currentSection.question_groups[currentSection.question_groups.length - 1]?.question_range[1]}
                </h2>
                <p className="text-xs text-muted-foreground mt-0.5">Based on Passage {currentSection.section_number}</p>
              </div>

              <ScrollArea className="flex-1">
                <div className="px-5 py-5 space-y-8">
                  {currentSection.question_groups.map((group, gi) => (
                    <QuestionGroupBlock
                      key={gi}
                      group={group}
                      userAnswers={userAnswers}
                      onAnswerChange={handleAnswerChange}
                      onQuestionClick={handleQuestionClick}
                      isSubmitted={isSubmitted}
                      selectedQuestion={selectedQuestion}
                      getResult={getQuestionResult}
                      registerRef={(n, el) => { questionRefs.current[n] = el; }}
                    />
                  ))}
                </div>
              </ScrollArea>

              {/* Navigator + submit */}
              <div className="px-4 py-3 border-t border-border/30 flex-shrink-0 space-y-3">
                <div className="flex flex-wrap gap-1">
                  {allItems.map(({ item, section }) => {
                    const result = getQuestionResult(item.number);
                    const answered = !!userAnswers[item.number];
                    return (
                      <button
                        key={item.number}
                        onClick={() => handleQuestionClick(item.number)}
                        className={cn(
                          "w-7 h-7 text-[10px] rounded border transition-all",
                          selectedQuestion === item.number ? "border-accent ring-1 ring-accent" : "border-border/50",
                          isSubmitted && result === "correct" ? "bg-green-500/20 text-green-500"
                            : isSubmitted && result === "incorrect" ? "bg-destructive/20 text-destructive"
                            : isSubmitted && result === "blank" ? "bg-muted/30 text-muted-foreground"
                            : answered ? "bg-accent/15 text-accent"
                            : section === activeSection ? "bg-card text-foreground/80"
                            : "bg-card/50 text-muted-foreground"
                        )}
                        title={`Q${item.number}${isSubmitted ? ` (${result})` : ""}`}
                      >
                        {item.number}
                      </button>
                    );
                  })}
                </div>

                {!isSubmitted ? (
                  <Button
                    onClick={handleSubmit}
                    className="w-full"
                    variant="neumorphicPrimary"
                    disabled={Object.keys(userAnswers).length === 0}
                  >
                    Submit and Review
                    <ChevronRight className="w-4 h-4 ml-2" />
                  </Button>
                ) : (
                  <Button onClick={backToLibrary} className="w-full" variant="glass">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Library
                  </Button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      <UpgradeModal isOpen={showUpgradeModal} onClose={() => setShowUpgradeModal(false)} featureName="Reading" />
    </DashboardLayout>
  );
}

// ─── Sub-components ───────────────────────────────────────────────────────────

interface QGProps {
  group: QuestionGroup;
  userAnswers: Record<number, string>;
  onAnswerChange: (n: number, ans: string) => void;
  onQuestionClick: (n: number) => void;
  isSubmitted: boolean;
  selectedQuestion: number | null;
  getResult: (n: number) => "correct" | "incorrect" | "blank" | null;
  registerRef: (n: number, el: HTMLDivElement | null) => void;
}

function QuestionGroupBlock({ group, userAnswers, onAnswerChange, onQuestionClick, isSubmitted, selectedQuestion, getResult, registerRef }: QGProps) {
  const label = QUESTION_TYPE_LABEL[group.type] ?? group.type;
  const range = `Questions ${group.question_range[0]}–${group.question_range[1]}`;

  const renderPreamble = () => {
    if (group.type === "matching_headings" && group.headings_pool?.length) {
      return (
        <div className="mb-4 p-3 rounded-lg bg-secondary/20 border border-border/30">
          <p className="text-xs font-semibold text-muted-foreground mb-2">List of Headings</p>
          <div className="space-y-1.5">
            {group.headings_pool.map((h) => <p key={h} className="text-xs text-foreground/80">{h}</p>)}
          </div>
        </div>
      );
    }
    if (group.type === "matching_features" && group.options_pool) {
      return (
        <div className="mb-4 p-3 rounded-lg bg-secondary/20 border border-border/30">
          <p className="text-xs font-semibold text-muted-foreground mb-2">{group.note || "Match each statement to a category"}</p>
          <div className="flex flex-wrap gap-2">
            {Object.entries(group.options_pool).map(([k, v]) => (
              <span key={k} className="text-xs px-2 py-1 rounded bg-accent/10 text-accent">
                <strong>{k}:</strong> {v}
              </span>
            ))}
          </div>
        </div>
      );
    }
    if (group.type === "summary_completion") {
      return (
        <>
          {group.word_bank?.length ? (
            <div className="mb-3 p-3 rounded-lg bg-secondary/20 border border-border/30">
              <p className="text-xs font-semibold text-muted-foreground mb-2">Word Bank</p>
              <div className="flex flex-wrap gap-1.5">
                {group.word_bank.map((w) => (
                  <span key={w} className="text-xs px-2 py-1 rounded bg-accent/10 text-accent font-medium">{w}</span>
                ))}
              </div>
            </div>
          ) : null}
          {group.summary ? (
            <div className="mb-4 p-3 rounded-lg bg-secondary/10 border border-border/20 text-xs text-foreground/80 leading-relaxed italic">
              {group.summary}
            </div>
          ) : null}
        </>
      );
    }
    if (group.type === "matching_sentence_endings" && group.endings_pool) {
      return (
        <div className="mb-4 p-3 rounded-lg bg-secondary/20 border border-border/30">
          <p className="text-xs font-semibold text-muted-foreground mb-2">Sentence Endings</p>
          <div className="space-y-1.5">
            {Object.entries(group.endings_pool).map(([k, v]) => (
              <p key={k} className="text-xs text-foreground/80">
                <strong className="text-accent">{k}.</strong> {v}
              </p>
            ))}
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div>
      <div className="flex items-center gap-2 mb-2">
        <Badge variant="secondary" className="text-xs">{range}</Badge>
        <span className="text-xs text-muted-foreground">{label}</span>
      </div>
      <p className="text-xs text-muted-foreground mb-3 italic leading-relaxed">{group.instruction}</p>
      {renderPreamble()}
      <div className="space-y-3">
        {group.items.map((item) => (
          <QuestionItemBlock
            key={item.number}
            group={group}
            item={item}
            userAnswer={userAnswers[item.number] ?? ""}
            onAnswerChange={onAnswerChange}
            onQuestionClick={onQuestionClick}
            isSubmitted={isSubmitted}
            result={getResult(item.number)}
            isSelected={selectedQuestion === item.number}
            registerRef={registerRef}
          />
        ))}
      </div>
    </div>
  );
}

interface QIProps {
  group: QuestionGroup;
  item: QuestionItem;
  userAnswer: string;
  onAnswerChange: (n: number, ans: string) => void;
  onQuestionClick: (n: number) => void;
  isSubmitted: boolean;
  result: "correct" | "incorrect" | "blank" | null;
  isSelected: boolean;
  registerRef: (n: number, el: HTMLDivElement | null) => void;
}

function QuestionItemBlock({ group, item, userAnswer, onAnswerChange, onQuestionClick, isSubmitted, result, isSelected, registerRef }: QIProps) {
  const { type } = group;
  const cardClass = cn(
    "p-4 rounded-xl border transition-all",
    isSelected ? "border-accent bg-accent/10"
      : result === "correct" ? "border-green-500/30 bg-green-500/5"
      : result === "incorrect" ? "border-destructive/30 bg-destructive/5 cursor-pointer hover:bg-destructive/10"
      : result === "blank" ? "border-muted/30 bg-muted/5"
      : "border-border/30 bg-card/50"
  );

  const promptText =
    type === "tfng" || type === "ynng" ? item.statement :
    type === "multiple_choice" ? item.question :
    type === "matching_headings" ? `Paragraph ${item.paragraph}` :
    type === "matching_features" || type === "matching_information" ? item.statement :
    type === "matching_sentence_endings" ? item.sentence_start :
    type === "sentence_completion" || type === "note_completion" ? item.sentence :
    type === "summary_completion" ? `Gap ${item.number}` :
    item.statement || item.question || item.sentence || "";

  const renderInput = () => {
    if (type === "tfng") return <ChoiceButtons opts={["TRUE", "FALSE", "NOT GIVEN"]} item={item} userAnswer={userAnswer} onAnswerChange={onAnswerChange} isSubmitted={isSubmitted} keyed={false} />;
    if (type === "ynng") return <ChoiceButtons opts={["YES", "NO", "NOT GIVEN"]} item={item} userAnswer={userAnswer} onAnswerChange={onAnswerChange} isSubmitted={isSubmitted} keyed={false} />;
    if (type === "multiple_choice" && item.options) return <KeyedChoices options={item.options} item={item} userAnswer={userAnswer} onAnswerChange={onAnswerChange} isSubmitted={isSubmitted} layout="block" />;
    if (type === "matching_headings" && group.headings_pool) {
      const opts: Record<string, string> = {};
      group.headings_pool.forEach((h) => {
        const m = h.match(/^([ivxlcIVXLC]+)\./i);
        opts[m ? m[1].toLowerCase() : h.substring(0, 4).trim()] = h;
      });
      return <KeyedChoices options={opts} item={item} userAnswer={userAnswer} onAnswerChange={onAnswerChange} isSubmitted={isSubmitted} layout="compact" />;
    }
    if (type === "matching_features" && group.options_pool) return <KeyedChoices options={group.options_pool} item={item} userAnswer={userAnswer} onAnswerChange={onAnswerChange} isSubmitted={isSubmitted} layout="compact" />;
    if (type === "matching_information") {
      return (
        <div className="flex gap-1.5 flex-wrap">
          {["A", "B", "C", "D", "E", "F", "G"].map((p) => (
            <button
              key={p}
              onClick={(e) => { e.stopPropagation(); if (!isSubmitted) onAnswerChange(item.number, p); }}
              disabled={isSubmitted}
              className={cn(
                "w-9 h-8 text-xs rounded-md border transition-all font-medium",
                userAnswer.toUpperCase() === p
                  ? isSubmitted
                    ? p === item.answer.toUpperCase() ? "bg-green-500/20 border-green-500 text-green-500" : "bg-destructive/20 border-destructive text-destructive"
                    : "bg-accent/20 border-accent text-accent"
                  : isSubmitted && p === item.answer.toUpperCase() ? "bg-green-500/20 border-green-500 text-green-500"
                  : "border-border/50 text-muted-foreground hover:border-border"
              )}
            >{p}</button>
          ))}
        </div>
      );
    }
    if (type === "matching_sentence_endings" && group.endings_pool) return <KeyedChoices options={group.endings_pool} item={item} userAnswer={userAnswer} onAnswerChange={onAnswerChange} isSubmitted={isSubmitted} layout="compact" />;
    return (
      <input
        type="text"
        value={userAnswer}
        onChange={(e) => onAnswerChange(item.number, e.target.value)}
        disabled={isSubmitted}
        placeholder="Your answer..."
        className={cn(
          "w-full px-3 py-2 text-sm rounded-md border bg-background/50 outline-none transition-all",
          isSubmitted
            ? result === "correct" ? "border-green-500 text-green-500" : "border-destructive text-destructive"
            : "border-border/50 focus:border-accent"
        )}
      />
    );
  };

  return (
    <div ref={(el) => registerRef(item.number, el)} className={cardClass} onClick={() => { if (isSubmitted) onQuestionClick(item.number); }}>
      <div className="flex items-start gap-3">
        <span className="text-xs font-bold text-muted-foreground w-5 flex-shrink-0 pt-0.5">{item.number}.</span>
        <div className="flex-1 min-w-0">
          {promptText && <p className="text-sm text-foreground/90 mb-2.5 leading-snug">{promptText}</p>}
          {renderInput()}

          {isSubmitted && (
            <div className={cn("mt-3 pt-3 border-t", result === "correct" ? "border-green-500/20" : "border-destructive/20")}>
              <div className="flex items-center gap-2 mb-2 flex-wrap">
                {result === "correct" ? (
                  <><CheckCircle className="w-3.5 h-3.5 text-green-500" /><span className="text-xs text-green-500 font-medium">Correct!</span></>
                ) : (
                  <>
                    <XCircle className="w-3.5 h-3.5 text-destructive" />
                    <span className="text-xs text-destructive">Your answer: {userAnswer || "(no answer)"}</span>
                    <span className="text-xs text-muted-foreground">→</span>
                    <CheckCircle className="w-3.5 h-3.5 text-green-500" />
                    <span className="text-xs text-green-500 font-medium">Correct: {item.answer}</span>
                  </>
                )}
              </div>
              <div className="flex items-start gap-2 bg-muted/30 p-2.5 rounded-lg">
                <Lightbulb className="w-3 h-3 text-accent mt-0.5 shrink-0" />
                <p className="text-xs text-muted-foreground leading-relaxed">{item.explanation}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function ChoiceButtons({ opts, item, userAnswer, onAnswerChange, isSubmitted }: {
  opts: string[]; item: QuestionItem; userAnswer: string;
  onAnswerChange: (n: number, ans: string) => void; isSubmitted: boolean; keyed: boolean;
}) {
  return (
    <div className="flex gap-2 flex-wrap">
      {opts.map((opt) => (
        <button
          key={opt}
          onClick={(e) => { e.stopPropagation(); if (!isSubmitted) onAnswerChange(item.number, opt); }}
          disabled={isSubmitted}
          className={cn(
            "px-3 py-1.5 text-xs rounded-lg border transition-all font-medium",
            userAnswer.toUpperCase() === opt.toUpperCase()
              ? isSubmitted
                ? opt.toUpperCase() === item.answer.toUpperCase() ? "bg-green-500/20 border-green-500 text-green-500" : "bg-destructive/20 border-destructive text-destructive"
                : "bg-accent/20 border-accent text-accent"
              : isSubmitted && opt.toUpperCase() === item.answer.toUpperCase() ? "bg-green-500/20 border-green-500 text-green-500"
              : "border-border/50 text-muted-foreground hover:border-border"
          )}
        >{opt}</button>
      ))}
    </div>
  );
}

function KeyedChoices({ options, item, userAnswer, onAnswerChange, isSubmitted, layout }: {
  options: Record<string, string>; item: QuestionItem; userAnswer: string;
  onAnswerChange: (n: number, ans: string) => void; isSubmitted: boolean; layout: "block" | "compact";
}) {
  if (layout === "compact") {
    return (
      <div className="flex gap-1.5 flex-wrap">
        {Object.entries(options).map(([k]) => (
          <button
            key={k}
            onClick={(e) => { e.stopPropagation(); if (!isSubmitted) onAnswerChange(item.number, k); }}
            disabled={isSubmitted}
            className={cn(
              "min-w-[2.25rem] h-8 px-2 text-xs rounded-lg border transition-all uppercase font-medium",
              userAnswer.toLowerCase() === k.toLowerCase()
                ? isSubmitted
                  ? k.toLowerCase() === item.answer.toLowerCase() ? "bg-green-500/20 border-green-500 text-green-500" : "bg-destructive/20 border-destructive text-destructive"
                  : "bg-accent/20 border-accent text-accent"
                : isSubmitted && k.toLowerCase() === item.answer.toLowerCase() ? "bg-green-500/20 border-green-500 text-green-500"
                : "border-border/50 text-muted-foreground hover:border-border"
            )}
          >{k}</button>
        ))}
      </div>
    );
  }
  return (
    <div className="space-y-2">
      {Object.entries(options).map(([k, v]) => (
        <button
          key={k}
          onClick={(e) => { e.stopPropagation(); if (!isSubmitted) onAnswerChange(item.number, k); }}
          disabled={isSubmitted}
          className={cn(
            "w-full text-left px-3 py-2.5 text-xs rounded-lg border transition-all",
            userAnswer === k
              ? isSubmitted
                ? k === item.answer ? "bg-green-500/20 border-green-500 text-green-500" : "bg-destructive/20 border-destructive text-destructive"
                : "bg-accent/20 border-accent text-accent"
              : isSubmitted && k === item.answer ? "bg-green-500/20 border-green-500 text-green-500"
              : "border-border/50 text-muted-foreground hover:border-border"
          )}
        >
          <span className="font-semibold mr-2">{k}.</span>{v}
        </button>
      ))}
    </div>
  );
}
