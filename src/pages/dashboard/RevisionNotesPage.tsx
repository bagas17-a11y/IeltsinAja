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
  getNextTopicId,
  getPrevTopicId,
  type RevisionNoteTopicId,
} from "@/content/revisionNotes";
import { REVISION_TOPIC_COMPONENTS } from "./revision-notes";
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
  const viewAll = searchParams.get("view") === "all";

  const currentTopic: RevisionNoteTopicId =
    topicParam && REVISION_NOTE_TOPICS.some((t) => t.id === topicParam)
      ? topicParam
      : FIRST_TOPIC;

  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [expandedSections, setExpandedSections] = useState<string[]>([
    "parts-of-speech",
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

  const showTopicList = viewAll && !topicParam;

  const TopicContent = useMemo(
    () => REVISION_TOPIC_COMPONENTS[currentTopic],
    [currentTopic]
  );

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
        description="Access grammar and vocabulary revision notes across topics. Upgrade to the Human+AI package to use this feature."
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
              {/* Neon progress thread: vertical line + topic items */}
              <div className="relative pl-5 mt-2">
                {/* Vertical line - full height gray */}
                <div
                  className="absolute left-[11px] top-0 bottom-0 w-px bg-slate-600"
                  aria-hidden
                />
                {/* Neon segment: from top to center of active topic */}
                {(() => {
                  const activeIdx = REVISION_NOTE_TOPICS.findIndex(
                    (t) => t.id === currentTopic
                  );
                  if (activeIdx < 0) return null;
                  const segmentHeight = 24 + activeIdx * 48;
                  return (
                    <div
                      className="absolute left-[11px] top-0 w-px bg-[#3b82f6] opacity-90"
                      style={{
                        height: segmentHeight,
                        boxShadow: "0 0 10px rgba(59, 130, 246, 0.7)",
                      }}
                      aria-hidden
                    />
                  );
                })()}
                {REVISION_NOTE_TOPICS.map((section, sectionIndex) => {
                  const isExpanded = expandedSections.includes(section.id);
                  const isActive = currentTopic === section.id;
                  const progress = progressState[section.id];
                  const sectionNum = sectionIndex + 1;
                  return (
                    <div key={section.id} className="relative">
                      <div className="relative flex items-center gap-2 py-1.5">
                        {/* Circle indicator */}
                        <div className="absolute left-0 flex items-center justify-center">
                          {progress === "complete" ? (
                            <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" />
                          ) : progress === "in_progress" ? (
                            <div
                              className="h-3 w-3 rounded-full shrink-0 ring-2 ring-[#3b82f6] ring-offset-2 ring-offset-[#0f172a]"
                              style={{
                                backgroundColor: isActive ? PRIMARY_GLOW : "transparent",
                                boxShadow: isActive
                                  ? "0 0 10px rgba(59, 130, 246, 0.8)"
                                  : "none",
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
                            onClick={() => setTopic(section.id as RevisionNoteTopicId)}
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
                              <span className="flex-1 font-medium">
                                {sectionNum}. {section.title}
                              </span>
                            )}
                          </button>
                        </div>
                      </div>
                      {!sidebarCollapsed && isExpanded && (
                        <div className="ml-6 pl-3 border-l border-slate-600 space-y-0.5 pb-1 mt-0.5">
                          {section.subItems.map((sub) => (
                            <div key={sub.id} className="text-xs text-slate-400">
                              {sub.label}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
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
                  {getTopicTitle(currentTopic)} (IELTSInAja Grammar): Revision Note
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
            <div className="p-6 max-w-4xl">
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
                  <p className="text-slate-400 text-sm mb-8">
                    Topics cover grammar (parts of speech, apostrophes, verb
                    tenses). Select a topic below to open the full revision note.
                  </p>
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
              ) : (
                <>
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={currentTopic}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.2 }}
                      className="prose prose-invert max-w-none"
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
            {stickyBarVisible && !showTopicList && (
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
