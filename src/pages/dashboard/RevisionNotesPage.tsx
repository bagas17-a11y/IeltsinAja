import { useState, useMemo } from "react";
import { Link, useSearchParams } from "react-router-dom";
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
  CircleDot,
  CheckCircle2,
} from "lucide-react";
import { cn } from "@/lib/utils";

const ACTIVE_BLUE = "#3b5bdb";
const FIRST_TOPIC: RevisionNoteTopicId = "parts-of-speech";

function getTopicTitle(id: RevisionNoteTopicId): string {
  const t = REVISION_NOTE_TOPICS.find((x) => x.id === id);
  return t?.title ?? id;
}

export default function RevisionNotesPage() {
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

  const setTopic = (id: RevisionNoteTopicId) => {
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

  const progressState = useMemo(() => {
    const idx = REVISION_NOTE_TOPICS.findIndex((t) => t.id === currentTopic);
    const map: Record<string, "complete" | "in_progress" | "not_started"> = {};
    REVISION_NOTE_TOPICS.forEach((t, i) => {
      if (i < idx) map[t.id] = "complete";
      else if (i === idx) map[t.id] = "in_progress";
      else map[t.id] = "not_started";
    });
    return map;
  }, [currentTopic]);

  const toggleSection = (id: string) => {
    setExpandedSections((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const nextId = getNextTopicId(currentTopic);
  const prevId = getPrevTopicId(currentTopic);

  return (
    <DashboardLayout>
      <div className="-m-6 flex h-[calc(100vh-3rem)] min-h-0 bg-[#0f172a]">
        {/* Left sidebar - fixed width, dark blue theme */}
        <aside
          className={cn(
            "flex flex-col border-r border-[#1e293b] bg-[#0f172a] transition-[width] duration-200",
            sidebarCollapsed ? "w-14" : "w-[260px]",
            "hidden md:flex",
            mobileMenuOpen && "!flex !absolute inset-y-0 left-0 z-50 w-[260px]"
          )}
        >
          <div className="flex h-12 items-center justify-between border-b border-[#1e293b] px-3">
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
            <div className="p-3 space-y-1">
              {!sidebarCollapsed && (
                <button
                  onClick={setViewAll}
                  className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm text-slate-300 hover:bg-white/10 hover:text-white"
                >
                  View all topics
                  <ChevronRight className="h-4 w-4 ml-auto" />
                </button>
              )}
              {REVISION_NOTE_TOPICS.map((section) => {
                const isExpanded = expandedSections.includes(section.id);
                const isActive = currentTopic === section.id;
                const progress = progressState[section.id];
                const sectionIndex = REVISION_NOTE_TOPICS.findIndex((t) => t.id === section.id) + 1;
                return (
                  <div key={section.id} className="mt-1">
                    <div className="flex items-center gap-1">
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
                          "flex flex-1 items-center gap-2 rounded-md px-2 py-1.5 text-sm text-left",
                          isActive
                            ? "bg-[#3b5bdb] text-white"
                            : "text-slate-300 hover:bg-white/10 hover:text-white"
                        )}
                      >
                        {sidebarCollapsed ? (
                          <span className="flex h-6 w-6 items-center justify-center rounded bg-white/10 text-xs">
                            {sectionIndex}
                          </span>
                        ) : (
                          <>
                            {progress === "complete" ? (
                              <CheckCircle2 className="h-4 w-4 shrink-0 text-green-400" />
                            ) : progress === "in_progress" ? (
                              <CircleDot
                                className="h-4 w-4 shrink-0"
                                style={{ color: isActive ? "white" : ACTIVE_BLUE }}
                              />
                            ) : (
                              <Circle className="h-4 w-4 shrink-0 text-slate-500" />
                            )}
                            <span className="flex-1">
                              {sectionIndex}. {section.title}
                            </span>
                          </>
                        )}
                      </button>
                    </div>
                    {!sidebarCollapsed && isExpanded && (
                      <div className="ml-6 mt-0.5 border-l border-slate-600 pl-3 space-y-1 pb-1">
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
          </ScrollArea>
        </aside>

        {/* Mobile menu overlay */}
        {mobileMenuOpen && (
          <button
            className="fixed inset-0 z-40 bg-black/50 md:hidden"
            onClick={() => setMobileMenuOpen(false)}
            aria-label="Close menu"
          />
        )}

        {/* Main content */}
        <div className="flex flex-1 flex-col min-w-0 bg-[#0f172a]">
          {/* Top bar: mobile menu + title (when viewing a topic) */}
          <div className="flex h-12 items-center gap-2 border-b border-[#1e293b] px-4 shrink-0">
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

          <ScrollArea className="flex-1">
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
                    tenses), vocabulary, and writing formats. Select a topic
                    below to open the full revision note.
                  </p>
                  <div className="grid gap-4 sm:grid-cols-2">
                    {REVISION_NOTE_TOPICS.map((section, i) => (
                      <Accordion
                        key={section.id}
                        type="single"
                        collapsible
                        defaultValue={i === 0 ? section.id : undefined}
                        className="rounded-lg border border-[#1e293b] bg-[#1e293b]/50"
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
                              className="mt-3 border-[#3b5bdb] text-[#93c5fd] hover:bg-[#3b5bdb]/20"
                              onClick={() => setTopic(section.id as RevisionNoteTopicId)}
                            >
                              Open revision note
                            </Button>
                          </AccordionContent>
                        </AccordionItem>
                      </Accordion>
                    ))}
                  </div>
                </>
              ) : (
                <>
                  <div className="prose prose-invert max-w-none">
                    <TopicContent />
                  </div>

                  {/* Bottom bar: Download + Prev/Next */}
                  <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between pt-6 border-t border-[#1e293b]">
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
                          className="border-[#1e293b] text-slate-300 hover:bg-white/10"
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
                          className="bg-[#3b5bdb] hover:bg-[#3b5bdb]/90 text-white"
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
          </ScrollArea>
        </div>
      </div>
    </DashboardLayout>
  );
}
