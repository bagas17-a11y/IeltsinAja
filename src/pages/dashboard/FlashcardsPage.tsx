import { useState, useMemo, useEffect, useCallback, useRef } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { HumanPlusAILockScreen } from "@/components/HumanPlusAILockScreen";
import { motion, AnimatePresence } from "framer-motion";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  getAllFlashcardTopics,
} from "@/content/flashcards";
import {
  ChevronRight,
  ChevronDown,
  PanelLeftClose,
  PanelLeft,
  Menu,
  Circle,
  ChevronLeft,
} from "lucide-react";
import { cn } from "@/lib/utils";

const PRIMARY_GLOW = "#3b82f6";

function getTopicTitle(id: string, topics: ReturnType<typeof getAllFlashcardTopics>): string {
  const t = topics.find((x) => x.id === id);
  return t?.title ?? id;
}

export default function FlashcardsPage() {
  const { profile } = useAuth();
  const isElite = profile?.subscription_tier === "elite";

  const [searchParams, setSearchParams] = useSearchParams();
  const topicParam = searchParams.get("topic");
  const subtopicParam = searchParams.get("subtopic");
  const viewAll = searchParams.get("view") === "all";
  const navigate = useNavigate();

  const FLASHCARD_TOPICS = useMemo(() => getAllFlashcardTopics(), []);

  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [sidebarWidth, setSidebarWidth] = useState(280);
  const [isResizing, setIsResizing] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const MIN_SIDEBAR_WIDTH = 220;
  const MAX_SIDEBAR_WIDTH = 420;
  const resizeStartX = useRef(0);
  const resizeStartWidth = useRef(sidebarWidth);

  const handleResizeMove = useCallback((e: MouseEvent) => {
    const delta = e.clientX - resizeStartX.current;
    const next = Math.min(MAX_SIDEBAR_WIDTH, Math.max(MIN_SIDEBAR_WIDTH, resizeStartWidth.current + delta));
    setSidebarWidth(next);
  }, []);

  const handleResizeEnd = useCallback(() => {
    setIsResizing(false);
  }, []);

  const handleResizeStart = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    resizeStartX.current = e.clientX;
    resizeStartWidth.current = sidebarWidth;
    setIsResizing(true);
  }, [sidebarWidth]);

  useEffect(() => {
    if (isResizing) {
      document.body.style.cursor = "col-resize";
      document.body.style.userSelect = "none";
      window.addEventListener("mousemove", handleResizeMove);
      window.addEventListener("mouseup", handleResizeEnd);
      return () => {
        document.body.style.cursor = "";
        document.body.style.userSelect = "";
        window.removeEventListener("mousemove", handleResizeMove);
        window.removeEventListener("mouseup", handleResizeEnd);
      };
    }
  }, [isResizing, handleResizeMove, handleResizeEnd]);
  const [expandedSections, setExpandedSections] = useState<string[]>([
    FLASHCARD_TOPICS[0]?.id ?? "",
  ]);

  const setTopic = (topicId: string, subtopicId?: string) => {
    const topic = FLASHCARD_TOPICS.find((t) => t.id === topicId);
    const firstSubtopic = topic?.subtopics[0];
    const sub = subtopicId ?? firstSubtopic?.id;
    if (sub) {
      setSearchParams((prev) => {
        const next = new URLSearchParams(prev);
        next.set("topic", topicId);
        next.set("subtopic", sub);
        next.delete("view");
        return next;
      });
    }
    setMobileMenuOpen(false);
  };

  const setViewAll = () => {
    setSearchParams((prev) => {
      const next = new URLSearchParams();
      next.set("view", "all");
      return next;
    });
    setMobileMenuOpen(false);
  };

  const showTopicList = viewAll && !topicParam;

  // When not viewing "all", ensure we have a topic/subtopic so a flashcard is shown
  const effectiveTopic = useMemo(() => {
    const id = topicParam ?? FLASHCARD_TOPICS[0]?.id;
    return FLASHCARD_TOPICS.find((t) => t.id === id);
  }, [topicParam, FLASHCARD_TOPICS]);
  const effectiveSubtopic = useMemo(() => {
    if (!effectiveTopic) return null;
    const id = subtopicParam ?? effectiveTopic.subtopics[0]?.id;
    return effectiveTopic.subtopics.find((st) => st.id === id);
  }, [effectiveTopic, subtopicParam]);
  const inlineFlashcards = effectiveSubtopic?.flashcards ?? [];
  const [cardIndex, setCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  useEffect(() => {
    if (!showTopicList && !topicParam && FLASHCARD_TOPICS[0]) {
      const t = FLASHCARD_TOPICS[0];
      const sub = t.subtopics[0];
      if (sub) {
        setSearchParams({ topic: t.id, subtopic: sub.id }, { replace: true });
      }
    }
  }, [showTopicList, topicParam, FLASHCARD_TOPICS, setSearchParams]);

  useEffect(() => {
    setCardIndex(0);
    setIsFlipped(false);
  }, [topicParam, subtopicParam]);

  const currentInlineCard = inlineFlashcards[cardIndex];
  const totalInline = inlineFlashcards.length;
  const isFirstInline = cardIndex === 0;
  const isLastInline = cardIndex === totalInline - 1 && totalInline > 0;

  const toggleSection = (id: string) => {
    setExpandedSections((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const totalFlashcards = FLASHCARD_TOPICS.reduce(
    (sum, topic) =>
      sum + topic.subtopics.reduce((s, st) => s + st.flashcards.length, 0),
    0
  );

  if (!isElite) {
    return (
      <HumanPlusAILockScreen
        title="Flashcards"
        description="Access interactive flip cards for grammar and vocabulary. Upgrade to the Elite package to use this feature."
        features={[
          "Grammar topics 1–13",
          "Interactive flip cards",
          "Progress tracking",
        ]}
      />
    );
  }

  return (
    <DashboardLayout>
      <div className="-m-6 flex h-[calc(100vh-3rem)] min-h-0 bg-[#0f172a]">
        {/* Floating glass sidebar - resizable */}
        <aside
          className={cn(
            "flex flex-col z-10 shrink-0",
            "backdrop-blur-[12px] bg-[#0f172a]/80 border-r border-[#334155]",
            "hidden md:flex",
            sidebarCollapsed && "transition-[width] duration-200",
            mobileMenuOpen && "!flex !absolute inset-y-0 left-0 z-50"
          )}
          style={
            mobileMenuOpen
              ? { width: 280 }
              : sidebarCollapsed
                ? { width: 56 }
                : { width: sidebarWidth, minWidth: sidebarWidth, transition: isResizing ? "none" : "width 0.2s" }
          }
        >
          <div className="flex h-12 items-center justify-between border-b border-[#334155] px-3 shrink-0">
            {!sidebarCollapsed && (
              <h2 className="text-sm font-semibold text-white">Flashcards</h2>
            )}
            <Button
              variant="ghost"
              size="icon"
              className="text-slate-400 hover:text-white hover:bg-white/10"
              onClick={() => setSidebarCollapsed((c) => !c)}
              aria-label={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              {sidebarCollapsed ? (
                <PanelLeft className="h-4 w-4" />
              ) : (
                <PanelLeftClose className="h-4 w-4" />
              )}
            </Button>
          </div>
          <ScrollArea className="flex-1">
            <div className="p-3 space-y-0">
              {!sidebarCollapsed && (
                <button
                  onClick={setViewAll}
                  className="flex w-full items-center gap-2 rounded-lg px-2 py-2 text-sm text-slate-300 hover:bg-white/10 hover:text-white transition-colors"
                >
                  View all topics
                  <ChevronRight className="h-4 w-4 ml-auto" />
                </button>
              )}
              {/* Neon progress thread */}
              <div className="relative pl-5 mt-2">
                <div
                  className="absolute left-[11px] top-0 bottom-0 w-px bg-slate-600"
                  aria-hidden
                />
                {FLASHCARD_TOPICS.map((section, sectionIndex) => {
                  const isExpanded = expandedSections.includes(section.id);
                  const isActive = topicParam === section.id;
                  const sectionNum = sectionIndex + 1;
                  const totalCards = section.subtopics.reduce(
                    (sum, st) => sum + st.flashcards.length,
                    0
                  );
                  return (
                    <div key={section.id} className="relative">
                      <div className="relative flex items-center gap-2 py-1.5">
                        <div className="absolute left-0 flex items-center justify-center">
                          {isActive ? (
                            <div
                              className="h-3 w-3 rounded-full shrink-0 ring-2 ring-[#3b82f6] ring-offset-2 ring-offset-[#0f172a]"
                              style={{
                                backgroundColor: PRIMARY_GLOW,
                                boxShadow: "0 0 10px rgba(59, 130, 246, 0.8)",
                              }}
                            />
                          ) : (
                            <Circle className="h-4 w-4 shrink-0 text-slate-500" />
                          )}
                        </div>
                        <div className="flex flex-1 items-center gap-1 pl-6">
                          <button
                            onClick={() => toggleSection(section.id)}
                            className="p-0.5 rounded text-slate-400 hover:text-white"
                            aria-label={isExpanded ? "Collapse" : "Expand"}
                          >
                            {isExpanded ? (
                              <ChevronDown className="h-4 w-4" />
                            ) : (
                              <ChevronRight className="h-4 w-4" />
                            )}
                          </button>
                          <button
                            onClick={() => setTopic(section.id)}
                            className={cn(
                              "flex flex-1 items-center gap-2 rounded-lg px-2 py-1.5 text-sm text-left transition-all",
                              isActive
                                ? "bg-[#3b82f6]/20 text-white border border-[#3b82f6]/50"
                                : "text-slate-300 hover:bg-white/10 hover:text-white border border-transparent"
                            )}
                            style={
                              isActive
                                ? {
                                    boxShadow: "0 0 16px rgba(59, 130, 246, 0.25)",
                                  }
                                : undefined
                            }
                          >
                            {sidebarCollapsed ? (
                              <span className="flex h-6 w-6 items-center justify-center rounded bg-white/10 text-xs font-medium">
                                {sectionNum}
                              </span>
                            ) : (
                              <>
                                <span className="flex-1 min-w-0 font-medium break-words">
                                  {sectionNum}. {section.title}
                                </span>
                                <span className="text-xs text-slate-500 shrink-0 ml-1">
                                  {totalCards}
                                </span>
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                      {!sidebarCollapsed && isExpanded && (
                        <div className="ml-6 pl-3 border-l border-slate-600 space-y-0.5 pb-1 mt-0.5">
                          {section.subtopics.map((sub) => {
                            const cardCount = sub.flashcards.length;
                            return (
                              <button
                                key={sub.id}
                                onClick={() => setTopic(section.id, sub.id)}
                                className="flex w-full items-center justify-between gap-2 text-xs text-slate-400 hover:text-white hover:bg-white/5 rounded px-2 py-1 text-left"
                              >
                                <span className="min-w-0 flex-1 break-words">{sub.title}</span>
                                <span className="text-slate-600 shrink-0">{cardCount}</span>
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </ScrollArea>
        </aside>

        {/* Resize handle - visible when sidebar expanded on desktop */}
        {!sidebarCollapsed && !mobileMenuOpen && (
          <div
            className="hidden md:flex shrink-0 w-3 cursor-col-resize items-stretch justify-center -mx-1"
            onMouseDown={handleResizeStart}
            role="separator"
            aria-label="Resize sidebar"
          >
            <div
              className={cn(
                "w-0.5 rounded-full transition-colors shrink-0",
                isResizing ? "bg-[#3b82f6]" : "bg-[#334155] hover:bg-[#475569]"
              )}
            />
          </div>
        )}

        {mobileMenuOpen && (
          <button
            className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm md:hidden"
            onClick={() => setMobileMenuOpen(false)}
            aria-label="Close menu"
          />
        )}

        <div className="flex flex-1 flex-col min-w-0 bg-[#0f172a]">
          <div className="flex h-12 items-center gap-2 border-b border-[#334155] px-4 shrink-0">
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden text-slate-400 hover:text-white"
              onClick={() => setMobileMenuOpen(true)}
              aria-label="Open menu"
            >
              <Menu className="h-5 w-5" />
            </Button>
            {!showTopicList && topicParam && (
              <h1 className="text-lg font-semibold text-white truncate">
                {getTopicTitle(topicParam, FLASHCARD_TOPICS)}: Flashcards
              </h1>
            )}
          </div>

          <div className="flex-1 overflow-y-auto overflow-x-hidden">
            <div className="p-6 max-w-4xl">
              {showTopicList ? (
                <>
                  <h1 className="text-2xl font-bold text-white mb-2">
                    IELTS Grammar: Flashcards
                  </h1>
                  <p className="text-slate-300 mb-6 leading-relaxed">
                    Practice grammar rules with interactive flashcards. Test your
                    understanding of Parts of Speech, Apostrophes, Verb Tenses,
                    Subject–Verb Agreement, Punctuation, and Sentence Structure.
                  </p>
                  <p className="text-slate-400 text-sm mb-8">
                    Total: <strong className="text-white">{totalFlashcards}</strong> flashcards
                    across <strong className="text-white">{FLASHCARD_TOPICS.length}</strong> topics.
                    Select a topic below to start studying.
                  </p>
                  <div className="grid gap-4 sm:grid-cols-2">
                    {FLASHCARD_TOPICS.map((section, i) => {
                      const totalCards = section.subtopics.reduce(
                        (sum, st) => sum + st.flashcards.length,
                        0
                      );
                      return (
                        <div
                          key={section.id}
                          className="rounded-xl border border-[#334155] bg-[#1e293b]/80 overflow-hidden"
                        >
                          <Accordion
                            type="single"
                            collapsible
                            defaultValue={i === 0 ? section.id : undefined}
                          >
                            <AccordionItem value={section.id} className="border-none">
                              <AccordionTrigger className="px-4 py-3 text-left text-white hover:no-underline hover:bg-white/5">
                                <div className="flex items-center justify-between w-full pr-4">
                                  <span>
                                    {i + 1}. {section.title}
                                  </span>
                                  <span className="text-sm text-slate-400">
                                    {totalCards} cards
                                  </span>
                                </div>
                              </AccordionTrigger>
                              <AccordionContent className="px-4 pb-3 text-slate-400 text-sm">
                                <ul className="space-y-1 mb-3">
                                  {section.subtopics.map((sub) => (
                                    <li key={sub.id}>
                                      {sub.title} ({sub.flashcards.length})
                                    </li>
                                  ))}
                                </ul>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="border-[#3b82f6] text-blue-300 hover:bg-[#3b82f6]/20"
                                  onClick={() => setTopic(section.id)}
                                >
                                  Go to Flashcards
                                </Button>
                              </AccordionContent>
                            </AccordionItem>
                          </Accordion>
                        </div>
                      );
                    })}
                  </div>
                </>
              ) : effectiveTopic && effectiveSubtopic ? (
                <div className="flex flex-col items-center py-6">
                  <div
                    className="w-full max-w-lg mx-auto"
                    style={{ perspective: "1200px" }}
                  >
                    {totalInline === 0 ? (
                      <p className="text-slate-400 text-center py-8">
                        No flashcards in this subtopic yet.
                      </p>
                    ) : (
                      <>
                        <p className="text-slate-400 text-sm mb-4 text-center">
                          {effectiveTopic.title} → {effectiveSubtopic.title} ({cardIndex + 1} / {totalInline})
                        </p>
                        <div className="relative">
                          <div
                            className="absolute inset-0 rounded-xl bg-slate-900/40 blur-xl -z-10 translate-y-3 scale-[0.98]"
                            aria-hidden
                          />
                          <motion.div
                            className="relative w-full cursor-pointer select-none"
                            style={{ transformStyle: "preserve-3d" }}
                            animate={{ rotateY: isFlipped ? 180 : 0 }}
                            transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
                            onClick={() => setIsFlipped((f) => !f)}
                            role="button"
                            tabIndex={0}
                            onKeyDown={(e) => {
                              if (e.key === " ") {
                                e.preventDefault();
                                setIsFlipped((f) => !f);
                              }
                            }}
                            aria-label="Flip card"
                          >
                            <div
                              className={cn(
                                "rounded-xl border border-[#334155] bg-[#1e293b] p-6 min-h-[240px] flex flex-col",
                                !isFlipped ? "z-10" : "z-0"
                              )}
                              style={{
                                backfaceVisibility: "hidden",
                                WebkitBackfaceVisibility: "hidden",
                                transform: "rotateY(0deg)",
                                boxShadow:
                                  "0 1px 3px rgba(0,0,0,0.2), 0 4px 12px rgba(0,0,0,0.15), 0 8px 24px rgba(0,0,0,0.1)",
                              }}
                            >
                              <span className="text-xs font-semibold text-blue-400 uppercase tracking-wide mb-2">Question</span>
                              <p className="text-base text-white leading-relaxed flex-1 flex flex-col justify-center">Q: {currentInlineCard?.question}</p>
                            </div>
                            <div
                              className={cn(
                                "absolute inset-0 rounded-xl border border-emerald-500/20 bg-[#1e293b] p-6 min-h-[240px] flex flex-col",
                                isFlipped ? "z-10" : "z-0"
                              )}
                              style={{
                                backfaceVisibility: "hidden",
                                WebkitBackfaceVisibility: "hidden",
                                transform: "rotateY(180deg)",
                                boxShadow:
                                  "0 1px 3px rgba(0,0,0,0.2), 0 4px 12px rgba(0,0,0,0.15), 0 8px 24px rgba(0,0,0,0.1)",
                              }}
                            >
                              <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wide mb-2">Answer</span>
                              <p className="text-base text-slate-200 leading-relaxed flex-1 flex flex-col justify-center">A: {currentInlineCard?.answer}</p>
                            </div>
                          </motion.div>
                        </div>
                        <p className="text-slate-500 text-xs mt-2 text-center">Click or press Space to flip</p>
                        <div className="flex items-center justify-center gap-2 mt-4">
                          <Button
                            variant="outline"
                            size="icon"
                            className="border-[#334155] text-slate-300 hover:bg-white/5"
                            disabled={isFirstInline}
                            onClick={() => {
                              setCardIndex((i) => Math.max(0, i - 1));
                              setIsFlipped(false);
                            }}
                          >
                            <ChevronLeft className="h-4 w-4" />
                          </Button>
                          <span className="text-slate-400 text-sm min-w-[4rem] text-center">
                            {cardIndex + 1} / {totalInline}
                          </span>
                          <Button
                            variant="outline"
                            size="icon"
                            className="border-[#334155] text-slate-300 hover:bg-white/5"
                            disabled={isLastInline}
                            onClick={() => {
                              setCardIndex((i) => Math.min(totalInline - 1, i + 1));
                              setIsFlipped(false);
                            }}
                          >
                            <ChevronRight className="h-4 w-4" />
                          </Button>
                        </div>
                        <Button
                          variant="link"
                          className="text-[#3b82f6] mt-4"
                          onClick={() =>
                            navigate(
                              `/dashboard/flashcards/topic?topic=${effectiveTopic.id}&subtopic=${effectiveSubtopic.id}`
                            )
                          }
                        >
                          Open full study view
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              ) : (
                <div className="py-12 text-center">
                  <p className="text-slate-400">Loading…</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
