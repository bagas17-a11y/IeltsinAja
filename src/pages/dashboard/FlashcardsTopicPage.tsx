import { useState, useMemo, useEffect } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import {
  getAllFlashcardTopics,
} from "@/content/flashcards";
import {
  ChevronLeft,
  RotateCcw,
  Frown,
  Smile,
  Shuffle,
  Home,
  CreditCard,
} from "lucide-react";
import { cn } from "@/lib/utils";

const STORAGE_KEY_PREFIX = "flashcard-progress-";

function loadFlashcardProgress(topicId: string, subtopicId: string): {
  stillLearning: Set<string>;
  know: Set<string>;
} {
  if (typeof window === "undefined") {
    return { stillLearning: new Set(), know: new Set() };
  }
  try {
    const key = `${STORAGE_KEY_PREFIX}${topicId}-${subtopicId}`;
    const raw = localStorage.getItem(key);
    if (!raw) return { stillLearning: new Set(), know: new Set() };
    const data = JSON.parse(raw) as {
      stillLearning?: string[];
      know?: string[];
    };
    return {
      stillLearning: new Set(data.stillLearning ?? []),
      know: new Set(data.know ?? []),
    };
  } catch {
    return { stillLearning: new Set(), know: new Set() };
  }
}

function saveFlashcardProgress(
  topicId: string,
  subtopicId: string,
  stillLearning: Set<string>,
  know: Set<string>
) {
  if (typeof window === "undefined") {
    return;
  }
  try {
    const key = `${STORAGE_KEY_PREFIX}${topicId}-${subtopicId}`;
    localStorage.setItem(
      key,
      JSON.stringify({
        stillLearning: [...stillLearning],
        know: [...know],
      })
    );
  } catch {
    /* ignore */
  }
}

export default function FlashcardsTopicPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const topicId = searchParams.get("topic") ?? "";
  const subtopicId = searchParams.get("subtopic") ?? "";

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [shuffled, setShuffled] = useState(false);

  const topic = useMemo(
    () => getAllFlashcardTopics().find((t) => t.id === topicId),
    [topicId]
  );

  const subtopic = useMemo(
    () => topic?.subtopics.find((st) => st.id === subtopicId),
    [topic, subtopicId]
  );

  const flashcards = useMemo(() => {
    if (!subtopic) return [];
    const cards = [...subtopic.flashcards];
    return shuffled ? [...cards].sort(() => Math.random() - 0.5) : cards;
  }, [subtopic, shuffled]);

  const [progress, setProgress] = useState(() =>
    topicId && subtopicId
      ? loadFlashcardProgress(topicId, subtopicId)
      : { stillLearning: new Set<string>(), know: new Set<string>() }
  );

  useEffect(() => {
    if (topicId && subtopicId) {
      saveFlashcardProgress(topicId, subtopicId, progress.stillLearning, progress.know);
    }
  }, [topicId, subtopicId, progress]);

  // Keyboard support: SPACE to flip
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.code === "Space" && (e.target as HTMLElement)?.tagName !== "INPUT") {
        e.preventDefault();
        setIsFlipped((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, []);

  const currentCard = flashcards[currentIndex];
  const totalCards = flashcards.length;
  const stillLearningCount = flashcards.filter((c) =>
    progress.stillLearning.has(c.id)
  ).length;
  const knowCount = flashcards.filter((c) => progress.know.has(c.id)).length;

  if (!topic || !subtopic || flashcards.length === 0) {
    return (
      <DashboardLayout>
        <div className="p-6">
          <p className="text-slate-400">Topic or subtopic not found.</p>
          <Button onClick={() => navigate("/dashboard/flashcards")} className="mt-4">
            Back to Flashcards
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const handleStillLearning = () => {
    if (!currentCard) return;
    setProgress((prev) => {
      const next = { ...prev };
      next.stillLearning.add(currentCard.id);
      next.know.delete(currentCard.id);
      return next;
    });
    goToNext();
  };

  const handleKnow = () => {
    if (!currentCard) return;
    setProgress((prev) => {
      const next = { ...prev };
      next.know.add(currentCard.id);
      next.stillLearning.delete(currentCard.id);
      return next;
    });
    goToNext();
  };

  const goToNext = () => {
    setIsFlipped(false);
    if (currentIndex < totalCards - 1) {
      setCurrentIndex(currentIndex + 1);
    }
    // At last card: do not advance (no loop)
  };

  const goToPrevious = () => {
    setIsFlipped(false);
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const isLastCard = currentIndex === totalCards - 1;
  const isFirstCard = currentIndex === 0;

  const handleShuffle = () => {
    setShuffled(!shuffled);
    setCurrentIndex(0);
    setIsFlipped(false);
  };

  const progressPercent =
    totalCards > 0 ? ((knowCount / totalCards) * 100).toFixed(0) : "0";

  return (
    <DashboardLayout>
      <div className="-m-6 flex h-[calc(100vh-3rem)] min-h-0 bg-[#0f172a] flex-col">
        {/* Breadcrumbs */}
        <div className="px-6 pt-4 pb-2 border-b border-[#334155]">
          <div className="flex items-center gap-2 text-sm text-slate-400">
            <Link to="/dashboard" className="hover:text-white flex items-center gap-1">
              <Home className="h-3.5 w-3.5" />
              Home
            </Link>
            <span>/</span>
            <Link
              to="/dashboard/flashcards"
              className="hover:text-white flex items-center gap-1"
            >
              <CreditCard className="h-3.5 w-3.5" />
              Flashcards
            </Link>
            <span>/</span>
            <span className="text-white">{topic.title}</span>
          </div>
        </div>

        {/* Header */}
        <div className="px-6 py-4 border-b border-[#334155] shrink-0">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-xl font-semibold text-white">
              {subtopic.title}
            </h1>
            <div className="text-sm text-slate-400">
              {currentIndex + 1}/{totalCards}
            </div>
          </div>
          {/* Progress bar */}
          <div className="h-1 w-full bg-[#1e293b] rounded-full overflow-hidden mt-2">
            <div
              className="h-full bg-[#3b82f6] transition-[width] duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          {/* Learning metrics */}
          <div className="flex items-center gap-3 mt-3">
            <div className="flex items-center gap-1.5">
              <div className="h-2 w-2 rounded-full bg-red-500" />
              <span className="text-xs text-slate-400">
                Still learning <span className="text-white font-medium">{stillLearningCount}</span>
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="h-2 w-2 rounded-full bg-emerald-500" />
              <span className="text-xs text-slate-400">
                Know <span className="text-white font-medium">{knowCount}</span>
              </span>
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="flex-1 flex items-center justify-center p-6 overflow-hidden">
          <div className="w-full max-w-3xl perspective-1000">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentCard?.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
                className="w-full"
                style={{ perspective: "1000px" }}
              >
                <motion.div
                  className="relative w-full aspect-[4/3] cursor-pointer"
                  onClick={handleFlip}
                  style={{ transformStyle: "preserve-3d", perspective: 1000 }}
                  animate={{ rotateY: isFlipped ? 180 : 0 }}
                  transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
                >
                  {/* Front - Question */}
                  <div
                    className={cn(
                      "absolute inset-0 rounded-2xl border border-[#334155]/80 bg-gradient-to-br from-[#1e293b] to-[#0f172a] p-8 shadow-xl shadow-black/20",
                      "flex flex-col",
                      !isFlipped ? "z-10" : "z-0"
                    )}
                    style={{
                      backfaceVisibility: "hidden",
                      WebkitBackfaceVisibility: "hidden",
                      transform: "rotateY(0deg)",
                      boxShadow: "0 4px 24px rgba(0,0,0,0.3), 0 0 0 1px rgba(255,255,255,0.03)",
                    }}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-xs font-bold text-blue-400 uppercase tracking-widest">
                        Question
                      </span>
                      {currentCard?.category && (
                        <span className="text-xs px-2.5 py-1 rounded-lg bg-[#3b82f6]/15 text-blue-300 border border-[#3b82f6]/25">
                          {currentCard.category}
                        </span>
                      )}
                    </div>
                    <div className="flex-1 flex items-start justify-center pt-2">
                      <div className="text-left w-full max-w-xl">
                        <p className="text-sm font-medium text-slate-400 mb-2">Q:</p>
                        <p className="text-lg text-white leading-relaxed">
                          {currentCard?.question}
                        </p>
                      </div>
                    </div>
                    <div className="mt-4 pt-4 border-t border-[#334155]/60">
                      <p className="text-xs text-slate-500 text-center">
                        Click to flip • Press SPACE
                      </p>
                    </div>
                  </div>

                  {/* Back - Answer */}
                  <div
                    className={cn(
                      "absolute inset-0 rounded-2xl border border-emerald-500/25 bg-gradient-to-br from-emerald-950/40 to-[#0f172a] p-8",
                      "flex flex-col",
                      isFlipped ? "z-10" : "z-0"
                    )}
                    style={{
                      backfaceVisibility: "hidden",
                      WebkitBackfaceVisibility: "hidden",
                      transform: "rotateY(180deg)",
                      boxShadow: "0 4px 24px rgba(0,0,0,0.3), 0 0 0 1px rgba(34,197,94,0.15)",
                    }}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest">
                        Answer
                      </span>
                    </div>
                    <div className="flex-1 flex items-start justify-center pt-2">
                      <div className="text-left w-full max-w-xl">
                        <p className="text-sm font-medium text-emerald-400/80 mb-2">A:</p>
                        <p className="text-lg text-slate-200 leading-relaxed">
                          {currentCard?.answer}
                        </p>
                      </div>
                    </div>
                    <div className="mt-4 pt-4 border-t border-emerald-500/20">
                      <p className="text-xs text-slate-500 text-center">
                        Click to flip back • Press SPACE
                      </p>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Interaction controls */}
        <div className="px-6 py-4 border-t border-[#334155] shrink-0">
          <div className="flex items-center justify-center gap-5 mb-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={goToPrevious}
              disabled={isFirstCard}
              className={cn(
                "rounded-full h-11 w-11 transition-all",
                isFirstCard
                  ? "text-slate-600 cursor-not-allowed"
                  : "text-slate-400 hover:text-white hover:bg-white/10"
              )}
              aria-label="Previous card"
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => {
                setIsFlipped(false);
                setCurrentIndex(0);
              }}
              className="text-slate-400 hover:text-white hover:bg-white/10 rounded-full h-11 w-11"
              aria-label="Back to first card"
            >
              <RotateCcw className="h-5 w-5" />
            </Button>
            <Button
              size="icon"
              onClick={handleStillLearning}
              className="rounded-full h-12 w-12 bg-amber-500/15 hover:bg-amber-500/25 text-amber-400 border border-amber-500/30 transition-all hover:scale-105"
              aria-label="Still learning"
            >
              <Frown className="h-5 w-5" />
            </Button>
            <Button
              size="icon"
              onClick={handleKnow}
              className="rounded-full h-12 w-12 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 border border-emerald-500/30 transition-all hover:scale-105"
              aria-label="Know"
            >
              <Smile className="h-5 w-5" />
            </Button>
          </div>

          {/* Footer: Shuffle + End of set / Back to topics */}
          <div className="flex items-center justify-center gap-4 text-sm">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleShuffle}
              className={cn(
                "text-slate-400 hover:text-white",
                shuffled && "text-[#3b82f6]"
              )}
            >
              <Shuffle className="h-4 w-4 mr-2" />
              Shuffle
            </Button>
            {isLastCard && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate("/dashboard/flashcards")}
                className="border-[#334155] text-slate-300 hover:bg-white/10"
              >
                Back to topics
              </Button>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
