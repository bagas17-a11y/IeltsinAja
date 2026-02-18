import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
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
  getFlashcardsBySubtopic,
  type FlashcardTopic,
} from "@/content/flashcards";
import {
  ChevronRight,
  ChevronDown,
  PanelLeftClose,
  PanelLeft,
  Menu,
  Circle,
  CheckCircle2,
} from "lucide-react";
import { cn } from "@/lib/utils";

const PRIMARY_GLOW = "#3b82f6";
const FLASHCARD_TOPICS = getAllFlashcardTopics();

function getTopicTitle(id: string): string {
  const t = FLASHCARD_TOPICS.find((x) => x.id === id);
  return t?.title ?? id;
}

export default function FlashcardsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const topicParam = searchParams.get("topic");
  const subtopicParam = searchParams.get("subtopic");
  const viewAll = searchParams.get("view") === "all";
  const navigate = useNavigate();

  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [expandedSections, setExpandedSections] = useState<string[]>([
    FLASHCARD_TOPICS[0]?.id ?? "",
  ]);

  const setTopic = (topicId: string, subtopicId?: string) => {
    if (subtopicId) {
      navigate(`/dashboard/flashcards/topic?topic=${topicId}&subtopic=${subtopicId}`);
    } else {
      // Go to first subtopic of the topic
      const topic = FLASHCARD_TOPICS.find((t) => t.id === topicId);
      const firstSubtopic = topic?.subtopics[0];
      if (firstSubtopic) {
        navigate(`/dashboard/flashcards/topic?topic=${topicId}&subtopic=${firstSubtopic.id}`);
      }
    }
    setMobileMenuOpen(false);
  };

  const setViewAll = () => {
    setSearchParams({ view: "all" });
    setMobileMenuOpen(false);
  };

  const showTopicList = viewAll && !topicParam;

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
                                <span className="flex-1 font-medium">
                                  {sectionNum}. {section.title}
                                </span>
                                <span className="text-xs text-slate-500">
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
                                className="flex w-full items-center justify-between text-xs text-slate-400 hover:text-white hover:bg-white/5 rounded px-2 py-1"
                              >
                                <span>{sub.title}</span>
                                <span className="text-slate-600">{cardCount}</span>
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
                {getTopicTitle(topicParam)}: Flashcards
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
              ) : (
                <div className="text-center py-12">
                  <p className="text-slate-400 mb-4">
                    Select a topic from the sidebar to start studying flashcards.
                  </p>
                  <Button
                    onClick={setViewAll}
                    className="bg-[#3b82f6] hover:bg-[#3b82f6]/90 text-white"
                  >
                    View all topics
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
