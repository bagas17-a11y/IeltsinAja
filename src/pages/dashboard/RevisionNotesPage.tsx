import { useState, useMemo, useEffect, useRef, useCallback } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { logActivity, toggleBookmark, isBookmarked } from "@/lib/activity";
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
  REVISION_NOTE_TOPICS,
  REVISION_NOTE_CATEGORIES,
  getNextTopicId,
  getPrevTopicId,
  type RevisionNoteTopicId,
  type RevisionNoteFormatId,
  REVISION_NOTE_FORMAT_IDS,
} from "@/content/revisionNotes";
import { REVISION_TOPIC_COMPONENTS, WORKSHEET_COMPONENTS, TestFormatsView } from "./revision-notes";
import {
  ChevronRight,
  ChevronDown,
  PanelLeftClose,
  PanelLeft,
  Menu,
  Download,
  Circle,
  CheckCircle2,
  Bookmark,
} from "lucide-react";
import { cn } from "@/lib/utils";

const PRIMARY_GLOW = "#3b82f6";
const FIRST_TOPIC: RevisionNoteTopicId = "parts-of-speech";
const STORAGE_KEY = "revision-notes-completed";

function getTopicTitle(id: RevisionNoteTopicId): string {
  const t = REVISION_NOTE_TOPICS.find((x) => x.id === id);
  return t?.title ?? id;
}

function loadCompletedTopics(): Set<string> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return new Set();
    const arr = JSON.parse(raw) as unknown;
    if (!Array.isArray(arr)) return new Set();
    const valid = REVISION_NOTE_TOPICS.map((t) => t.id);
    return new Set((arr as string[]).filter((id) => valid.includes(id)));
  } catch {
    return new Set();
  }
}

function saveCompletedTopicsLocal(set: Set<string>) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify([...set])); } catch { /* ignore */ }
}

export default function RevisionNotesPage() {
  const { user, profile } = useAuth();
  const isElite = profile?.subscription_tier === "elite";
  const hasAccess = isElite || profile?.subscription_tier === "pro";

  const [searchParams, setSearchParams] = useSearchParams();
  const topicParam = searchParams.get("topic") as RevisionNoteTopicId | null;
  const formatParam = searchParams.get("format") as RevisionNoteFormatId | null;
  const subtopicParam = searchParams.get("subtopic") as "worksheet-1" | "worksheet-2" | null;
  const viewAll = searchParams.get("view") === "all";
  const showFormatsView = searchParams.get("view") === "formats";
  const currentFormat: RevisionNoteFormatId =
    formatParam && REVISION_NOTE_FORMAT_IDS.includes(formatParam)
      ? formatParam
      : "writing";

  const currentTopic: RevisionNoteTopicId =
    topicParam && REVISION_NOTE_TOPICS.some((t) => t.id === topicParam)
      ? topicParam
      : FIRST_TOPIC;

  const currentSubtopic = subtopicParam ?? null;

  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [sidebarWidth, setSidebarWidth] = useState(260);
  const isDraggingRef = useRef(false);
  const dragStartXRef = useRef(0);
  const dragStartWidthRef = useRef(0);

  const onDragHandleMouseDown = useCallback((e: React.MouseEvent) => {
    isDraggingRef.current = true;
    dragStartXRef.current = e.clientX;
    dragStartWidthRef.current = sidebarWidth;
    document.body.style.cursor = "col-resize";
    document.body.style.userSelect = "none";
  }, [sidebarWidth]);

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      if (!isDraggingRef.current) return;
      const delta = e.clientX - dragStartXRef.current;
      const next = Math.max(180, Math.min(480, dragStartWidthRef.current + delta));
      setSidebarWidth(next);
    };
    const onMouseUp = () => {
      if (!isDraggingRef.current) return;
      isDraggingRef.current = false;
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    };
    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
    return () => {
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
    };
  }, []);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [expandedSections, setExpandedSections] = useState<string[]>([
    ...REVISION_NOTE_CATEGORIES.map((c) => c.id),
    "test-formats",
  ]);
  const [stickyBarVisible, setStickyBarVisible] = useState(false);
  const [completedTopics, setCompletedTopics] = useState<Set<string>>(
    loadCompletedTopics
  );
  const mainScrollRef = useRef<HTMLDivElement>(null);
  const topicEndSentinelRef = useRef<HTMLDivElement>(null);

  const persistTopicComplete = useCallback((topicId: string) => {
    // localStorage
    setCompletedTopics((prev) => {
      if (prev.has(topicId)) return prev;
      const next = new Set(prev);
      next.add(topicId);
      saveCompletedTopicsLocal(next);
      return next;
    });
    // Supabase
    if (!user?.id) return;
    (supabase as any)
      .from("user_completed_questions")
      .upsert(
        { user_id: user.id, module: "revision_notes", question_id: topicId },
        { onConflict: "user_id,module,question_id", ignoreDuplicates: true },
      )
      .then(({ error }: any) => { if (error) console.error(error); });
  }, [user?.id]);

  // On mount: sync completed topics from Supabase
  useEffect(() => {
    if (!user?.id) return;
    (supabase as any)
      .from("user_completed_questions")
      .select("question_id")
      .eq("user_id", user.id)
      .eq("module", "revision_notes")
      .then(({ data }: { data: { question_id: string }[] | null }) => {
        if (!data) return;
        setCompletedTopics((prev) => {
          const merged = new Set([...prev, ...data.map((r) => r.question_id)]);
          saveCompletedTopicsLocal(merged);
          return merged;
        });
      });
  }, [user?.id]);

  const markCurrentTopicComplete = useCallback(() => {
    persistTopicComplete(currentTopic);
  }, [currentTopic, persistTopicComplete]);

  const setTopic = (id: RevisionNoteTopicId) => {
    markCurrentTopicComplete();
    const route = `/dashboard/revision-notes?topic=${id}`;
    logActivity(user?.id, "revision_note", getTopicTitle(id), route);
    setSearchParams({ topic: id });
    setMobileMenuOpen(false);
  };

  const setWorksheet = (topicId: RevisionNoteTopicId, worksheetId: "worksheet-1" | "worksheet-2") => {
    setSearchParams({ topic: topicId, subtopic: worksheetId });
    setMobileMenuOpen(false);
  };

  const setViewAll = () => {
    setSearchParams({ view: "all" });
    setMobileMenuOpen(false);
  };

  const setFormat = (format: RevisionNoteFormatId) => {
    setSearchParams({ view: "formats", format });
    setMobileMenuOpen(false);
  };

  const showTopicList = viewAll && !topicParam && !showFormatsView;

  const TopicContent = useMemo(() => {
    if (currentSubtopic) {
      const ws = WORKSHEET_COMPONENTS[currentTopic];
      const wsComponent = ws?.[currentSubtopic];
      if (wsComponent) return wsComponent;
    }
    return REVISION_TOPIC_COMPONENTS[currentTopic];
  }, [currentTopic, currentSubtopic]);

  const showMainContent = !showTopicList && !showFormatsView;

  // Progress: green check if persisted complete; blue dot if current; circle if not started
  const progressState = useMemo(() => {
    const map: Record<string, "complete" | "in_progress" | "not_started"> = {};
    REVISION_NOTE_TOPICS.forEach((t) => {
      if (completedTopics.has(t.id)) map[t.id] = "complete";
      else if (t.id === currentTopic) map[t.id] = "in_progress";
      else map[t.id] = "not_started";
    });
    return map;
  }, [currentTopic, completedTopics]);

  const toggleSection = (id: string) => {
    setExpandedSections((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  // Sticky bottom bar: show when user has scrolled past a threshold
  useEffect(() => {
    const el = mainScrollRef.current;
    if (!el || showTopicList) {
      setStickyBarVisible(false);
      return;
    }
    const threshold = 200;
    const onScroll = () => {
      setStickyBarVisible(el.scrollTop > threshold);
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, [showTopicList]);

  // Mark current topic complete when user scrolls to the end of the content
  useEffect(() => {
    const sentinel = topicEndSentinelRef.current;
    if (!sentinel || showTopicList) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          persistTopicComplete(currentTopic);
        }
      },
      { root: mainScrollRef.current, rootMargin: "0px", threshold: 0.5 }
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [currentTopic, showTopicList, persistTopicComplete]);

  const [bookmarked, setBookmarked] = useState(() => isBookmarked(currentTopic));

  // Keep bookmark icon in sync when topic changes
  useEffect(() => {
    setBookmarked(isBookmarked(currentTopic));
  }, [currentTopic]);

  const handleBookmark = () => {
    const next = toggleBookmark(currentTopic, getTopicTitle(currentTopic));
    setBookmarked(next);
  };

  const nextId = getNextTopicId(currentTopic);
  const prevId = getPrevTopicId(currentTopic);

  if (!hasAccess) {
    return (
      <HumanPlusAILockScreen
        title="Revision Notes"
        description="Access grammar and vocabulary revision notes across topics. Available on Pro and Elite plans."
        features={[
          "Grammar topics (parts of speech, tenses, etc.)",
          "Vocabulary and collocations",
          "Interactive progress tracking",
          "IELTS-focused examples",
        ]}
      />
    );
  }

  return (
    <DashboardLayout>
      <div className="-m-6 flex h-[calc(100dvh-3rem)] min-h-0 bg-background">
        {/* Floating glass sidebar */}
        <aside
          className={cn(
            "flex flex-col z-10",
            "backdrop-blur-[12px] bg-background/90 border-r border-border",
            "hidden md:flex",
            mobileMenuOpen && "!flex !absolute inset-y-0 left-0 z-50"
          )}
          style={{ width: sidebarCollapsed ? 56 : sidebarWidth }}
        >
          <div className="flex h-12 items-center justify-between border-b border-border px-3 shrink-0">
            {!sidebarCollapsed && (
              <h2 className="text-sm font-semibold text-foreground">
                Revision Notes
              </h2>
            )}
            <Button
              variant="ghost"
              size="icon"
              className="text-muted-foreground hover:text-foreground hover:bg-secondary/80"
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
                  className="flex w-full items-center gap-2 rounded-lg px-2 py-2 text-sm text-foreground/80 hover:bg-secondary/80 hover:text-foreground transition-colors"
                >
                  View all topics
                  <ChevronRight className="h-4 w-4 ml-auto" />
                </button>
              )}
              {/* Topics grouped by category + Test Formats */}
              <div className="pl-1 mt-2 space-y-4">
                {REVISION_NOTE_CATEGORIES.map((category) => {
                  const topicsInCategory = REVISION_NOTE_TOPICS.filter(
                    (t) => t.category === category.id
                  );
                  if (topicsInCategory.length === 0) return null;
                  const catExpanded = expandedSections.includes(category.id);
                  return (
                    <div key={category.id}>
                      {/* Category header */}
                      <button
                        onClick={() => toggleSection(category.id)}
                        className={cn(
                          "flex w-full items-center gap-2 py-1.5 text-left text-xs font-semibold uppercase tracking-wider",
                          catExpanded ? "text-foreground/80" : "text-muted-foreground/60"
                        )}
                      >
                        {catExpanded ? (
                          <ChevronDown className="h-3.5 w-3.5" />
                        ) : (
                          <ChevronRight className="h-3.5 w-3.5" />
                        )}
                        {category.label}
                      </button>
                      {catExpanded && (
                        <div className="ml-2 mt-1 space-y-0.5 pl-2">
                          {topicsInCategory.map((section) => {
                            const isTopicActive = !showFormatsView && currentTopic === section.id && !currentSubtopic;
                            const isTopicSelected = !showFormatsView && currentTopic === section.id;
                            const progress = progressState[section.id];
                            return (
                              <div key={section.id}>
                                <div className="flex items-center gap-2 py-0.5">
                                  <div className="flex items-center justify-center shrink-0 w-4">
                                    {progress === "complete" ? (
                                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                                    ) : progress === "in_progress" ? (
                                      <div
                                        className="h-2.5 w-2.5 rounded-full ring-2 ring-[#3b82f6] ring-offset-2 ring-offset-background"
                                        style={{ backgroundColor: PRIMARY_GLOW }}
                                      />
                                    ) : (
                                      <Circle className="h-3 w-3 text-slate-600" />
                                    )}
                                  </div>
                                  <button
                                    onClick={() => setTopic(section.id as RevisionNoteTopicId)}
                                    className={cn(
                                      "flex-1 rounded px-2 py-1 text-sm text-left transition-all truncate",
                                      isTopicActive
                                        ? "bg-[#3b82f6]/20 text-foreground border border-[#3b82f6]/50"
                                        : "text-muted-foreground hover:bg-secondary/40 hover:text-foreground/80 border border-transparent"
                                    )}
                                  >
                                    {section.title}
                                  </button>
                                </div>
                                {isTopicSelected && section.worksheets && section.worksheets.map((ws) => {
                                  const isWsActive = currentSubtopic === ws.id;
                                  return (
                                    <div key={ws.id} className="flex items-center gap-2 py-0.5 pl-6">
                                      <button
                                        onClick={() => setWorksheet(section.id as RevisionNoteTopicId, ws.id)}
                                        className={cn(
                                          "flex-1 rounded px-2 py-1 text-xs text-left transition-all truncate",
                                          isWsActive
                                            ? "bg-[#3b82f6]/20 text-foreground border border-[#3b82f6]/50"
                                            : "text-muted-foreground/70 hover:bg-secondary/40 hover:text-foreground/80 border border-transparent"
                                        )}
                                      >
                                        {ws.label}
                                      </button>
                                    </div>
                                  );
                                })}
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
                {/* Test Formats section */}
                <div className="pt-2 border-t border-border">
                  <button
                    onClick={() => toggleSection("test-formats")}
                    className={cn(
                      "flex w-full items-center gap-2 py-1.5 text-left text-xs font-semibold uppercase tracking-wider",
                      expandedSections.includes("test-formats")
                        ? "text-foreground/80"
                        : "text-muted-foreground/60"
                    )}
                  >
                    {expandedSections.includes("test-formats") ? (
                      <ChevronDown className="h-3.5 w-3.5" />
                    ) : (
                      <ChevronRight className="h-3.5 w-3.5" />
                    )}
                    Test formats
                  </button>
                  {expandedSections.includes("test-formats") && (
                    <div className="ml-4 mt-1 space-y-0.5 border-l border-border pl-3">
                      {REVISION_NOTE_FORMAT_IDS.map((fmt) => {
                        const isActive = showFormatsView && currentFormat === fmt;
                        return (
                          <button
                            key={fmt}
                            onClick={() => setFormat(fmt)}
                            className={cn(
                              "flex w-full rounded px-2 py-1 text-sm text-left capitalize transition-all",
                              isActive
                                ? "bg-[#3b82f6]/20 text-foreground border border-[#3b82f6]/50"
                                : "text-muted-foreground hover:bg-secondary/40 hover:text-foreground/80"
                            )}
                          >
                            {fmt}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </ScrollArea>
        </aside>

        {mobileMenuOpen && (
          <button
            className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm md:hidden"
            onClick={() => setMobileMenuOpen(false)}
            aria-label="Close menu"
          />
        )}

        {/* Drag handle */}
        {!sidebarCollapsed && (
          <div
            onMouseDown={onDragHandleMouseDown}
            className="hidden md:flex w-1 cursor-col-resize items-center justify-center group hover:bg-blue-500/30 transition-colors z-20 shrink-0"
            title="Drag to resize"
          >
            <div className="w-px h-full bg-border group-hover:bg-blue-500/60 transition-colors" />
          </div>
        )}

        <div className="flex flex-1 flex-col min-w-0 bg-background">
          <div className="shrink-0 border-b border-border">
            <div className="flex h-12 items-center gap-2 px-4">
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden text-muted-foreground hover:text-foreground"
                onClick={() => setMobileMenuOpen(true)}
                aria-label="Open menu"
              >
                <Menu className="h-5 w-5" />
              </Button>
              {!showTopicList && (
                <h1 className="text-lg font-semibold text-foreground truncate flex-1">
                  {showFormatsView
                    ? `IELTS Test Formats – ${currentFormat.charAt(0).toUpperCase() + currentFormat.slice(1)}`
                    : currentSubtopic
                      ? `${getTopicTitle(currentTopic)} — ${currentSubtopic === "worksheet-1" ? "Worksheet 1" : "Worksheet 2"}`
                      : `${getTopicTitle(currentTopic)} (Engvolve Grammar): Revision Note`}
                </h1>
              )}
              {!showTopicList && !showFormatsView && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleBookmark}
                  aria-label={bookmarked ? "Remove bookmark" : "Save note"}
                  className={cn("shrink-0", bookmarked ? "text-elite-gold" : "text-muted-foreground hover:text-foreground")}
                >
                  <Bookmark className={cn("h-4 w-4", bookmarked && "fill-current")} />
                </Button>
              )}
            </div>
            {/* Progress bar: completed topics / total */}
            <div
              className="h-1 w-full bg-secondary"
              role="progressbar"
              aria-valuenow={completedTopics.size}
              aria-valuemin={0}
              aria-valuemax={REVISION_NOTE_TOPICS.length}
              aria-label="Revision notes progress"
            >
              <div
                className="h-full bg-emerald-500 transition-[width] duration-300 ease-out"
                style={{
                  width: `${REVISION_NOTE_TOPICS.length ? (completedTopics.size / REVISION_NOTE_TOPICS.length) * 100 : 0}%`,
                }}
              />
            </div>
          </div>

          <div
            ref={mainScrollRef}
            className="flex-1 overflow-y-auto overflow-x-hidden"
          >
            <div className="p-6 pb-20 md:pb-6 max-w-4xl mx-auto min-h-[400px] rounded-lg bg-background/60">
              {showTopicList ? (
                <>
                  <h1 className="text-2xl font-bold text-foreground mb-2">
                    IELTS Writing & Grammar: Revision Notes
                  </h1>
                  <p className="text-foreground/80 mb-6 leading-relaxed">
                    Revise effectively with notes aligned to the IELTS syllabus.
                    Clear explanations, examiner insights, and structured
                    content to support exam success.
                  </p>
                  <p className="text-muted-foreground text-sm mb-4">
                    Topics cover grammar (parts of speech, apostrophes, verb
                    tenses). Select a topic below to open the full revision note.
                  </p>
                  <div className="rounded-lg border border-border bg-secondary/60 px-4 py-3 mb-8 text-sm text-foreground/80">
                    <strong className="text-foreground/90">Key terms:</strong> Task 1 = IELTS Writing visual report (150+ words, describe data); Task 2 = IELTS Writing essay (250+ words, present argument/opinion).
                  </div>
                  <div className="space-y-8">
                    {REVISION_NOTE_CATEGORIES.map((cat) => {
                      const topics = REVISION_NOTE_TOPICS.filter((t) => t.category === cat.id);
                      if (topics.length === 0) return null;
                      return (
                        <div key={cat.id}>
                          <h2 className="text-base font-semibold text-foreground/90 uppercase tracking-wider mb-3 pb-2 border-b border-border">
                            {cat.label}
                          </h2>
                          <div className="grid gap-3 sm:grid-cols-2">
                            {topics.map((section) => (
                              <div
                                key={section.id}
                                className="rounded-xl border border-border bg-secondary/60 overflow-hidden"
                              >
                                <Accordion type="single" collapsible>
                                  <AccordionItem value={section.id} className="border-none">
                                    <AccordionTrigger className="px-4 py-3 text-left text-foreground hover:no-underline hover:bg-secondary/40 text-sm">
                                      {section.title}
                                    </AccordionTrigger>
                                    <AccordionContent className="px-4 pb-3 text-muted-foreground text-sm">
                                      <ul className="space-y-1">
                                        {section.subItems.map((sub) => (
                                          <li key={sub.id}>{sub.label}</li>
                                        ))}
                                      </ul>
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        className="mt-3 border-[#3b82f6] text-blue-300 hover:bg-[#3b82f6]/20"
                                        onClick={() => setTopic(section.id as RevisionNoteTopicId)}
                                      >
                                        Open revision note
                                      </Button>
                                    </AccordionContent>
                                  </AccordionItem>
                                </Accordion>
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </>
              ) : showFormatsView ? (
                <div className="prose prose-invert max-w-none border-l-2 border-border/50 pl-6">
                  <TestFormatsView activeFormat={currentFormat} />
                </div>
              ) : (
                <>
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={currentTopic}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.2 }}
                      className="prose prose-invert max-w-none border-l-2 border-border/50 pl-6"
                    >
                      <TopicContent />
                      {/* Sentinel: when this is in view, mark topic complete */}
                      <div ref={topicEndSentinelRef} className="h-1 w-full" aria-hidden />
                    </motion.div>
                  </AnimatePresence>

                  <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between pt-6 border-t border-border">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-muted-foreground hover:text-foreground w-fit"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Download notes on {getTopicTitle(currentTopic)}
                    </Button>
                    <div className="flex gap-2">
                      {prevId ? (
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-border text-foreground/80 hover:bg-secondary/80"
                          onClick={() => setTopic(prevId)}
                        >
                          ← Previous Topic
                        </Button>
                      ) : (
                        <span />
                      )}
                      {nextId ? (
                        <Button
                          size="sm"
                          className="bg-[#3b82f6] hover:bg-[#3b82f6]/90 text-foreground shadow-[0_0_20px_rgba(59,130,246,0.3)]"
                          onClick={() => setTopic(nextId)}
                        >
                          Next Topic →
                        </Button>
                      ) : null}
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Sticky bottom bar - appears on scroll */}
          <AnimatePresence>
            {stickyBarVisible && !showTopicList && !showFormatsView && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.2 }}
                className="fixed bottom-14 md:bottom-0 left-0 right-0 z-50 border-t border-border bg-background/95 backdrop-blur-md px-4 py-3 flex items-center justify-between"
              >
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-foreground/80 hover:text-foreground"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download notes on {getTopicTitle(currentTopic)}
                </Button>
                <div className="flex gap-2">
                  {prevId && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-border text-foreground/80"
                      onClick={() => setTopic(prevId)}
                    >
                      ← Previous
                    </Button>
                  )}
                  {nextId && (
                    <Button
                      size="sm"
                      className="bg-[#3b82f6] hover:bg-[#3b82f6]/90 text-foreground"
                      onClick={() => setTopic(nextId)}
                    >
                      Next →
                    </Button>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </DashboardLayout>
  );
}
