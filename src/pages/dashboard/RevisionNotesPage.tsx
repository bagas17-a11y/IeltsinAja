import { useState, useMemo, useEffect, useRef } from "react";
import { Link, useSearchParams } from "react-router-dom";
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
  REVISION_NOTE_TOPICS,
  REVISION_NOTE_CATEGORIES,
  getNextTopicId,
  getPrevTopicId,
  type RevisionNoteTopicId,
  type RevisionNoteFormatId,
  REVISION_NOTE_FORMAT_IDS,
} from "@/content/revisionNotes";
import { REVISION_TOPIC_COMPONENTS, TestFormatsView } from "./revision-notes";
import {
  ChevronRight,
  ChevronDown,
  PanelLeftClose,
  PanelLeft,
  Menu,
  Download,
  Circle,
  CheckCircle2,
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

function saveCompletedTopics(set: Set<string>) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...set]));
  } catch {
    /* ignore */
  }
}

export default function RevisionNotesPage() {
  const { profile } = useAuth();
  const isElite = profile?.subscription_tier === "elite";

  const [searchParams, setSearchParams] = useSearchParams();
  const topicParam = searchParams.get("topic") as RevisionNoteTopicId | null;
  const formatParam = searchParams.get("format") as RevisionNoteFormatId | null;
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

  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
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

  const markCurrentTopicComplete = () => {
    setCompletedTopics((prev) => {
      const next = new Set(prev);
      next.add(currentTopic);
      saveCompletedTopics(next);
      return next;
    });
  };

  const setTopic = (id: RevisionNoteTopicId) => {
    // When navigating away, mark current topic as complete so checkmark stays green
    markCurrentTopicComplete();
    setSearchParams({ topic: id });
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

  const TopicContent = useMemo(
    () => REVISION_TOPIC_COMPONENTS[currentTopic],
    [currentTopic]
  );

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
          setCompletedTopics((prev) => {
            if (prev.has(currentTopic)) return prev;
            const next = new Set(prev);
            next.add(currentTopic);
            saveCompletedTopics(next);
            return next;
          });
        }
      },
      { root: mainScrollRef.current, rootMargin: "0px", threshold: 0.5 }
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [currentTopic, showTopicList]);

  const nextId = getNextTopicId(currentTopic);
  const prevId = getPrevTopicId(currentTopic);

  if (!isElite) {
    return (
      <HumanPlusAILockScreen
        title="Revision Notes"
        description="Access grammar and vocabulary revision notes across topics. Upgrade to the Elite package to use this feature."
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
      <div className="-m-6 flex h-[calc(100vh-3rem)] min-h-0 bg-[#0f172a]">
        {/* Floating glass sidebar */}
        <aside
          className={cn(
            "flex flex-col transition-[width] duration-200 z-10",
            "backdrop-blur-[12px] bg-[#0f172a]/80 border-r border-[#334155]",
            sidebarCollapsed ? "w-14" : "w-[260px]",
            "hidden md:flex",
            mobileMenuOpen && "!flex !absolute inset-y-0 left-0 z-50 w-[260px]"
          )}
        >
          <div className="flex h-12 items-center justify-between border-b border-[#334155] px-3 shrink-0">
            {!sidebarCollapsed && (
              <h2 className="text-sm font-semibold text-white">
                Revision Notes
              </h2>
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
              {/* Topics grouped by category + Test Formats */}
              <div className="relative pl-5 mt-2 space-y-4">
                <div className="absolute left-[11px] top-0 bottom-0 w-px bg-slate-600" aria-hidden />
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
                          catExpanded ? "text-slate-300" : "text-slate-500"
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
                        <div className="ml-4 mt-1 space-y-0.5 border-l border-slate-600/80 pl-3">
                          {topicsInCategory.map((section, idx) => {
                            const isActive = !showFormatsView && currentTopic === section.id;
                            const progress = progressState[section.id];
                            return (
                              <div key={section.id} className="relative flex items-center gap-2 py-1">
                                <div className="absolute left-0 flex items-center justify-center -ml-5">
                                  {progress === "complete" ? (
                                    <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-emerald-400" />
                                  ) : progress === "in_progress" ? (
                                    <div
                                      className="h-2.5 w-2.5 rounded-full ring-2 ring-[#3b82f6] ring-offset-2 ring-offset-[#0f172a]"
                                      style={{
                                        backgroundColor: isActive ? PRIMARY_GLOW : "transparent",
                                      }}
                                    />
                                  ) : (
                                    <Circle className="h-3 w-3 shrink-0 text-slate-600" />
                                  )}
                                </div>
                                <button
                                  onClick={() => setTopic(section.id as RevisionNoteTopicId)}
                                  className={cn(
                                    "flex-1 rounded px-2 py-1 text-sm text-left transition-all truncate",
                                    isActive
                                      ? "bg-[#3b82f6]/20 text-white border border-[#3b82f6]/50"
                                      : "text-slate-400 hover:bg-white/5 hover:text-slate-300 border border-transparent"
                                  )}
                                >
                                  {section.title}
                                </button>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
                {/* Test Formats section */}
                <div className="pt-2 border-t border-slate-600/80">
                  <button
                    onClick={() => toggleSection("test-formats")}
                    className={cn(
                      "flex w-full items-center gap-2 py-1.5 text-left text-xs font-semibold uppercase tracking-wider",
                      expandedSections.includes("test-formats")
                        ? "text-slate-300"
                        : "text-slate-500"
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
                    <div className="ml-4 mt-1 space-y-0.5 border-l border-slate-600/80 pl-3">
                      {REVISION_NOTE_FORMAT_IDS.map((fmt) => {
                        const isActive = showFormatsView && currentFormat === fmt;
                        return (
                          <button
                            key={fmt}
                            onClick={() => setFormat(fmt)}
                            className={cn(
                              "flex w-full rounded px-2 py-1 text-sm text-left capitalize transition-all",
                              isActive
                                ? "bg-[#3b82f6]/20 text-white border border-[#3b82f6]/50"
                                : "text-slate-400 hover:bg-white/5 hover:text-slate-300"
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

        <div className="flex flex-1 flex-col min-w-0 bg-[#0f172a]">
          <div className="shrink-0 border-b border-[#334155]">
            <div className="flex h-12 items-center gap-2 px-4">
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden text-slate-400 hover:text-white"
                onClick={() => setMobileMenuOpen(true)}
                aria-label="Open menu"
              >
                <Menu className="h-5 w-5" />
              </Button>
              {!showTopicList && (
                <h1 className="text-lg font-semibold text-white truncate">
                  {showFormatsView
                    ? `IELTS Test Formats – ${currentFormat.charAt(0).toUpperCase() + currentFormat.slice(1)}`
                    : `${getTopicTitle(currentTopic)} (IELTSInAja Grammar): Revision Note`}
                </h1>
              )}
            </div>
            {/* Progress bar: completed topics / total */}
            <div
              className="h-1 w-full bg-[#1e293b]"
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
            <div className="p-6 max-w-4xl min-h-[400px] rounded-lg" style={{ backgroundColor: "rgba(15, 23, 42, 0.6)" }}>
              {showTopicList ? (
                <>
                  <h1 className="text-2xl font-bold text-white mb-2">
                    IELTS Writing & Grammar: Revision Notes
                  </h1>
                  <p className="text-slate-300 mb-6 leading-relaxed">
                    Revise effectively with notes aligned to the IELTS syllabus.
                    Clear explanations, examiner insights, and structured
                    content to support exam success.
                  </p>
                  <p className="text-slate-400 text-sm mb-4">
                    Topics cover grammar (parts of speech, apostrophes, verb
                    tenses). Select a topic below to open the full revision note.
                  </p>
                  <div className="rounded-lg border border-[#334155] bg-[#1e293b]/60 px-4 py-3 mb-8 text-sm text-slate-300">
                    <strong className="text-slate-200">Key terms:</strong> Task 1 = IELTS Writing visual report (150+ words, describe data); Task 2 = IELTS Writing essay (250+ words, present argument/opinion).
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    {REVISION_NOTE_TOPICS.map((section, i) => (
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
                              {i + 1}. {section.title}
                            </AccordionTrigger>
                            <AccordionContent className="px-4 pb-3 text-slate-400 text-sm">
                              <ul className="space-y-1">
                                {section.subItems.map((sub) => (
                                  <li key={sub.id}>{sub.label}</li>
                                ))}
                              </ul>
                              <Button
                                variant="outline"
                                size="sm"
                                className="mt-3 border-[#3b82f6] text-blue-300 hover:bg-[#3b82f6]/20"
                                onClick={() =>
                                  setTopic(section.id as RevisionNoteTopicId)
                                }
                              >
                                Open revision note
                              </Button>
                            </AccordionContent>
                          </AccordionItem>
                        </Accordion>
                      </div>
                    ))}
                  </div>
                </>
              ) : showFormatsView ? (
                <div className="prose prose-invert max-w-none border-l-2 border-[#334155]/50 pl-6">
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
                      className="prose prose-invert max-w-none border-l-2 border-[#334155]/50 pl-6"
                    >
                      <TopicContent />
                      {/* Sentinel: when this is in view, mark topic complete */}
                      <div ref={topicEndSentinelRef} className="h-1 w-full" aria-hidden />
                    </motion.div>
                  </AnimatePresence>

                  <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between pt-6 border-t border-[#334155]">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-slate-400 hover:text-white w-fit"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Download notes on {getTopicTitle(currentTopic)}
                    </Button>
                    <div className="flex gap-2">
                      {prevId ? (
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-[#334155] text-slate-300 hover:bg-white/10"
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
                          className="bg-[#3b82f6] hover:bg-[#3b82f6]/90 text-white shadow-[0_0_20px_rgba(59,130,246,0.3)]"
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
                className="fixed bottom-0 left-0 right-0 z-30 border-t border-[#334155] bg-[#0f172a]/95 backdrop-blur-md px-4 py-3 flex items-center justify-between"
              >
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-slate-300 hover:text-white"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download notes on {getTopicTitle(currentTopic)}
                </Button>
                <div className="flex gap-2">
                  {prevId && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-[#334155] text-slate-300"
                      onClick={() => setTopic(prevId)}
                    >
                      ← Previous
                    </Button>
                  )}
                  {nextId && (
                    <Button
                      size="sm"
                      className="bg-[#3b82f6] hover:bg-[#3b82f6]/90 text-white"
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
