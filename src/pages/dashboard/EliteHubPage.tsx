import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  BookOpen,
  Layers,
  ChevronRight,
  ChevronLeft,
  Clock,
  Sparkles,
  Crown,
  Lock,
  Calendar,
  PenTool,
  Headphones,
  Mic,
  BookMarked,
  Construction,
  Play,
  ClipboardList,
  TrendingUp,
  Activity,
  Send,
  Loader2,
  Bot,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { RadialBarChart, RadialBar, ResponsiveContainer, Tooltip } from "recharts";
import { WritingCheatsheet } from "@/components/writing/WritingCheatsheet";
import { SpeakingTutorial } from "@/components/speaking/SpeakingTutorial";
import { ReadingTutorial } from "@/components/reading/ReadingTutorial";
import { ListeningTutorial } from "@/components/listening/ListeningTutorial";
import { HeroBackground } from "@/components/HeroBackground";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { getRecentActivity, getSavedNotes, type ActivityEntry } from "@/lib/activity";
import { REVISION_NOTE_TOPICS } from "@/content/revisionNotes";

const TOTAL_REVISION_TOPICS = REVISION_NOTE_TOPICS.length;

const sectionPractice = [
  { id: "reading",   title: "Reading",   description: "AI-generated passages with answer-evidence highlighting.",          time: "60 min",     route: "/dashboard/reading",   icon: BookOpen   },
  { id: "listening", title: "Listening", description: "AI-generated 4-section tests with full transcripts.",               time: "30 min",     route: "/dashboard/listening", icon: Headphones },
  { id: "writing",   title: "Writing",   description: "Task 1 + Task 2 with band-score feedback and Band 8 rewrites.",     time: "60 min",     route: "/dashboard/writing",   icon: PenTool    },
  { id: "speaking",  title: "Speaking",  description: "Parts 1–3 with AI fluency analysis on your recorded answer.",       time: "11–14 min",  route: "/dashboard/speaking",  icon: Mic        },
];

const coaches = [
  { name: "Bagas H. Wicaksono", title: "Founder & lead coach", specialization: "Writing & Speaking strategy", score: "IELTS 8.5" },
];


export default function EliteHubPage() {
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");
  const [mudahinajaModule, setMudahinajaModule] = useState<string | null>(null);
  const [dailyBrief, setDailyBrief] = useState<string | null>(null);
  const [briefLoading, setBriefLoading] = useState(false);
  const [chatMessages, setChatMessages] = useState<Array<{ role: "user" | "coach"; text: string }>>([]);
  const [chatInput, setChatInput] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  // Overview state
  const [recentActivity, setRecentActivity] = useState<ActivityEntry[]>([]);
  const [savedNotes, setSavedNotes] = useState<{ id: string; title: string; savedAt: string }[]>([]);
  const [progressStats, setProgressStats] = useState({
    revisionNotes: 0,
    studyPlan: 0,
    practiceTotal: 0,
  });

  const isElite = profile?.subscription_tier === "elite";

  // Load overview data
  useEffect(() => {
    setRecentActivity(getRecentActivity(3));
    setSavedNotes(getSavedNotes());
    if (!user?.id) return;
    const uid = user.id;

    // Revision notes completed
    (supabase as any)
      .from("user_completed_questions")
      .select("question_id", { count: "exact", head: true })
      .eq("user_id", uid)
      .eq("module", "revision_notes")
      .then(({ count }: { count: number | null }) => {
        if (count != null) setProgressStats(p => ({ ...p, revisionNotes: count }));
      });

    // Study plan completed
    (supabase as any)
      .from("user_completed_questions")
      .select("question_id", { count: "exact", head: true })
      .eq("user_id", uid)
      .eq("module", "study_plan")
      .then(({ count }: { count: number | null }) => {
        if (count != null) setProgressStats(p => ({ ...p, studyPlan: count }));
      });

    // Practice sessions
    (supabase as any)
      .from("user_progress")
      .select("id", { count: "exact", head: true })
      .eq("user_id", uid)
      .then(({ count }: { count: number | null }) => {
        if (count != null) setProgressStats(p => ({ ...p, practiceTotal: count }));
      });
  }, [user?.id]);

  const loadDailyBrief = async () => {
    if (!user) return;
    setBriefLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const { data } = await supabase.functions.invoke("mudahinaja-coach", {
        body: { mode: "daily_brief" },
        headers: session?.access_token ? { Authorization: `Bearer ${session.access_token}` } : {},
      });
      setDailyBrief(data?.reply ?? null);
    } catch { /* ignore */ } finally {
      setBriefLoading(false);
    }
  };

  const sendChatMessage = async () => {
    if (!chatInput.trim() || chatLoading || !user) return;
    const msg = chatInput.trim();
    setChatInput("");
    setChatMessages((prev) => [...prev, { role: "user", text: msg }]);
    setChatLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const { data } = await supabase.functions.invoke("mudahinaja-coach", {
        body: { mode: "chat", message: msg },
        headers: session?.access_token ? { Authorization: `Bearer ${session.access_token}` } : {},
      });
      const reply = data?.reply ?? "Maaf, ada masalah. Coba lagi ya.";
      setChatMessages((prev) => [...prev, { role: "coach", text: reply }]);
      setTimeout(() => chatEndRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
    } catch {
      setChatMessages((prev) => [...prev, { role: "coach", text: "Koneksi bermasalah. Coba lagi ya." }]);
    } finally {
      setChatLoading(false);
    }
  };

  if (!isElite) {
    return (
      <DashboardLayout>
        <div className="max-w-2xl mx-auto text-center py-16">
          <div className="w-20 h-20 rounded-full bg-elite-gold/10 flex items-center justify-center mx-auto mb-6">
            <Lock className="w-10 h-10 text-elite-gold" />
          </div>
          <h1 className="text-3xl font-light mb-4">
            Unlock <span className="text-elite-gold">Elite Hub</span>
          </h1>
          <p className="text-muted-foreground mb-8 max-w-lg mx-auto">
            Access the full Elite experience: study resources, mock exams, and 1-on-1 consultation. Upgrade to the Road to 8.0+ plan to access this exclusive feature.
          </p>
          <div className="glass-card p-6 mb-8">
            <h3 className="text-lg font-light mb-4">What's Included:</h3>
            <ul className="space-y-3 text-left max-w-md mx-auto">
              {["Revision notes and flashcards", "Full mock exams with AI scoring", "5 hours of 1-on-1 consultation", "VIP priority support"].map((f) => (
                <li key={f} className="flex items-center gap-3 text-foreground/80">
                  <Crown className="w-4 h-4 text-elite-gold flex-shrink-0" />{f}
                </li>
              ))}
            </ul>
          </div>
          <Button size="lg" onClick={() => navigate("/pricing-selection")} className="bg-elite-gold/20 text-elite-gold border border-elite-gold/30 hover:bg-elite-gold/30">
            Upgrade to Road to 8.0+
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto space-y-6">

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={(v) => { setActiveTab(v); setMudahinajaModule(null); }} className="w-full">
          <TabsList className="w-full justify-start overflow-x-auto border-b border-border rounded-none bg-transparent p-0 h-auto gap-0">
            {[
              { value: "overview",       label: "Overview"       },
              { value: "revision-notes", label: "Revision Notes" },
              { value: "flashcards",     label: "Flashcards"     },
              { value: "mudahinaja",     label: "MudahinAja"     },
              { value: "mock-exams",     label: "Mock Exams"     },
              { value: "consultation",   label: "Consultation"   },
            ].map((tab) => (
              <TabsTrigger
                key={tab.value}
                value={tab.value}
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-elite-gold data-[state=active]:text-elite-gold data-[state=active]:bg-transparent px-4 py-3 text-sm whitespace-nowrap"
              >
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>

          {/* Overview */}
          <TabsContent value="overview" className="mt-7 focus-visible:outline-none space-y-5">

            {/* Daily Tasks — full-width prominent button */}
            <div className="relative rounded-xl border border-elite-gold/20 bg-gradient-to-br from-elite-gold/8 via-card to-card p-6">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <ClipboardList className="w-4 h-4 text-elite-gold" />
                    <p className="text-sm font-semibold text-foreground">Daily Tasks</p>
                  </div>
                  <p className="text-xs text-muted-foreground mb-3">
                    {progressStats.studyPlan} tasks completed from your study plan.
                  </p>
                  <div className="w-full h-1.5 rounded-full bg-muted/40 overflow-hidden mb-4">
                    <div
                      className="h-full rounded-full bg-elite-gold transition-all duration-700"
                      style={{ width: `${Math.min((progressStats.studyPlan / 40) * 100, 100)}%` }}
                    />
                  </div>
                </div>
              </div>
              <Button
                className="w-full bg-elite-gold/20 text-elite-gold border border-elite-gold/30 hover:bg-elite-gold/30 font-medium"
                onClick={() => navigate("/dashboard/study-plan")}
              >
                <Play className="w-4 h-4 mr-2" />
                Open Study Plan
              </Button>
            </div>

            <div className="grid gap-5 md:grid-cols-2">

              {/* Recent Activity */}
              <div className="rounded-xl border border-border bg-card p-5">
                <div className="flex items-center gap-2 mb-4">
                  <Activity className="w-4 h-4 text-elite-gold" />
                  <p className="text-sm font-semibold text-foreground">Recent Activity</p>
                </div>
                {recentActivity.length === 0 ? (
                  <p className="text-xs text-muted-foreground">No activity yet — open a revision note, practice module, or study plan task.</p>
                ) : (
                  <div className="space-y-1.5">
                    {recentActivity.map((a, i) => (
                      <button
                        key={i}
                        onClick={() => navigate(a.route)}
                        className="flex items-center gap-3 w-full text-left p-2.5 rounded-lg hover:bg-muted/30 transition-colors group"
                      >
                        <div className="w-7 h-7 rounded-lg bg-elite-gold/10 flex items-center justify-center shrink-0">
                          {a.activity_type === "revision_note" && <BookOpen className="w-3.5 h-3.5 text-elite-gold" />}
                          {a.activity_type === "practice"      && <TrendingUp className="w-3.5 h-3.5 text-elite-gold" />}
                          {a.activity_type === "elite"         && <Sparkles className="w-3.5 h-3.5 text-elite-gold" />}
                          {a.activity_type === "study_plan"    && <ClipboardList className="w-3.5 h-3.5 text-elite-gold" />}
                          {a.activity_type === "flashcard"     && <Layers className="w-3.5 h-3.5 text-elite-gold" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-medium text-foreground truncate">{a.label}</p>
                          <p className="text-[10px] text-muted-foreground capitalize">{a.activity_type.replace("_", " ")}</p>
                        </div>
                        <ChevronRight className="w-3 h-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Progress Tracker */}
              <div className="rounded-xl border border-border bg-card p-5">
                <div className="flex items-center gap-2 mb-4">
                  <TrendingUp className="w-4 h-4 text-elite-gold" />
                  <p className="text-sm font-semibold text-foreground">Progress Tracker</p>
                </div>
                <div className="space-y-4">
                  {[
                    { label: "Revision Notes",   done: progressStats.revisionNotes, total: TOTAL_REVISION_TOPICS,                        color: "#a78bfa" },
                    { label: "Practice Sessions", done: progressStats.practiceTotal, total: Math.max(progressStats.practiceTotal, 10),    color: "#34d399" },
                    { label: "Study Plan Tasks",  done: progressStats.studyPlan,     total: Math.max(progressStats.studyPlan, 40),        color: "#fbbf24" },
                  ].map(({ label, done, total, color }) => {
                    const pct = total > 0 ? Math.min((done / total) * 100, 100) : 0;
                    return (
                      <div key={label}>
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="text-xs text-foreground/70">{label}</span>
                          <span className="text-xs font-medium text-foreground">{done}/{total}</span>
                        </div>
                        <div className="w-full h-2 rounded-full bg-muted/40 overflow-hidden">
                          <div className="h-full rounded-full transition-all duration-700" style={{ width: `${pct}%`, backgroundColor: color }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>

            {/* Saved Revision Notes */}
            <div className="rounded-xl border border-border bg-card p-5">
              <div className="flex items-center gap-2 mb-4">
                <BookMarked className="w-4 h-4 text-elite-gold" />
                <p className="text-sm font-semibold text-foreground">Saved Revision Notes</p>
              </div>
              {savedNotes.length === 0 ? (
                <p className="text-xs text-muted-foreground">No saved notes yet — click the bookmark icon on any revision note topic to save it here.</p>
              ) : (
                <div className="grid gap-2 sm:grid-cols-2 md:grid-cols-3">
                  {savedNotes.map((note) => (
                    <Link
                      key={note.id}
                      to={`/dashboard/revision-notes?topic=${note.id}`}
                      className="flex items-center gap-2.5 p-3 rounded-lg border border-border hover:border-elite-gold/30 hover:bg-elite-gold/5 transition-all group"
                    >
                      <BookOpen className="w-3.5 h-3.5 text-elite-gold shrink-0" />
                      <span className="text-xs text-foreground/80 truncate group-hover:text-foreground">{note.title}</span>
                    </Link>
                  ))}
                </div>
              )}
            </div>

          </TabsContent>

          {/* Revision Notes */}
          <TabsContent value="revision-notes" className="mt-7 focus-visible:outline-none">
            <h2 className="text-base font-semibold text-foreground mb-1">Revision Notes</h2>
            <p className="text-sm text-muted-foreground mb-6">Concise notes covering grammar, writing skills, and vocabulary — with downloadable worksheets.</p>
            <div className="grid gap-3 sm:grid-cols-2">
              <Link to="/dashboard/revision-notes?view=all">
                <div className="flex items-center gap-4 p-4 rounded-xl border border-border bg-card hover:border-elite-gold/30 transition-colors cursor-pointer">
                  <div className="w-9 h-9 rounded-lg bg-elite-gold/10 flex items-center justify-center shrink-0">
                    <BookOpen className="h-4 w-4 text-elite-gold" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground">All Topics</p>
                    <p className="text-xs text-muted-foreground mt-0.5">Browse the full revision library</p>
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />
                </div>
              </Link>
              <Link to="/dashboard/revision-notes?topic=parts-of-speech">
                <div className="flex items-center gap-4 p-4 rounded-xl border border-border bg-card hover:border-elite-gold/30 transition-colors cursor-pointer">
                  <div className="w-9 h-9 rounded-lg bg-elite-gold/10 flex items-center justify-center shrink-0">
                    <BookMarked className="h-4 w-4 text-elite-gold" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground">Continue Learning</p>
                    <p className="text-xs text-muted-foreground mt-0.5">Pick up where you left off</p>
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />
                </div>
              </Link>
            </div>
          </TabsContent>

          {/* Flashcards */}
          <TabsContent value="flashcards" className="mt-7 focus-visible:outline-none">
            <h2 className="text-base font-semibold text-foreground mb-1">Flashcards</h2>
            <p className="text-sm text-muted-foreground mb-6">Interactive digital flashcards to reinforce key facts, definitions, and vocabulary.</p>
            <div className="grid gap-3 sm:grid-cols-2">
              <Link to="/dashboard/flashcards?view=all">
                <div className="flex items-center gap-4 p-4 rounded-xl border border-border bg-card hover:border-elite-gold/30 transition-colors cursor-pointer">
                  <div className="w-9 h-9 rounded-lg bg-elite-gold/10 flex items-center justify-center shrink-0">
                    <Layers className="h-4 w-4 text-elite-gold" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground">All Topics</p>
                    <p className="text-xs text-muted-foreground mt-0.5">Browse all flashcard sets</p>
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />
                </div>
              </Link>
            </div>
          </TabsContent>


          {/* MudahinAja */}
          <TabsContent value="mudahinaja" className="mt-7 focus-visible:outline-none">
            {mudahinajaModule === null ? (
              <div className="space-y-6">
                {/* Daily Brief */}
                <div className="glass-card p-5 border border-elite-gold/20">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Bot className="w-4 h-4 text-elite-gold" />
                      <span className="text-sm font-medium text-elite-gold">Daily Brief</span>
                    </div>
                    <Button variant="ghost" size="sm" onClick={loadDailyBrief} disabled={briefLoading} className="text-xs h-7">
                      {briefLoading ? <Loader2 className="w-3 h-3 animate-spin" /> : "Get brief"}
                    </Button>
                  </div>
                  {dailyBrief ? (
                    <p className="text-sm text-foreground/80 leading-relaxed">{dailyBrief}</p>
                  ) : (
                    <p className="text-sm text-muted-foreground">Tap "Get brief" for your personalised daily coaching message in Bahasa Indonesia.</p>
                  )}
                </div>

                {/* Module tutorials */}
                <div>
                  <h2 className="text-base font-semibold text-foreground mb-1">MudahinAja — Tutorial Modul</h2>
                  <p className="text-sm text-muted-foreground">Step-by-step tutorials for all four IELTS modules.</p>
                </div>
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                  {[
                    { id: "reading",   label: "Reading",   icon: BookOpen   },
                    { id: "listening", label: "Listening", icon: Headphones },
                    { id: "writing",   label: "Writing",   icon: PenTool    },
                    { id: "speaking",  label: "Speaking",  icon: Mic        },
                  ].map((mod) => (
                    <button
                      key={mod.id}
                      onClick={() => setMudahinajaModule(mod.id)}
                      className="flex flex-col items-center justify-center gap-3 p-6 rounded-xl border border-elite-gold/20 bg-elite-gold/5 hover:bg-elite-gold/10 hover:border-elite-gold/35 transition-all text-center"
                    >
                      <div className="w-11 h-11 rounded-full bg-elite-gold/15 flex items-center justify-center">
                        <mod.icon className="w-5 h-5 text-elite-gold" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">{mod.label}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">Start tutorial</p>
                      </div>
                    </button>
                  ))}
                </div>

                {/* AI Chat */}
                <div className="glass-card p-5 border border-border/30">
                  <div className="flex items-center gap-2 mb-4">
                    <Bot className="w-4 h-4 text-accent" />
                    <span className="text-sm font-medium">Tanya MudahinAja</span>
                    <span className="text-xs text-muted-foreground">— dalam Bahasa Indonesia</span>
                  </div>
                  <div className="min-h-[120px] max-h-72 overflow-y-auto space-y-3 mb-4">
                    {chatMessages.length === 0 && (
                      <p className="text-xs text-muted-foreground text-center pt-4">
                        Tanya apa saja tentang IELTS, strategi belajar, atau minta tips untuk modul tertentu.
                      </p>
                    )}
                    {chatMessages.map((m, i) => (
                      <div key={i} className={`flex gap-2 ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                        <div className={`max-w-xs rounded-xl px-3 py-2 text-sm leading-relaxed ${
                          m.role === "user" ? "bg-accent/15 text-foreground" : "bg-secondary/40 text-foreground/90"
                        }`}>
                          {m.text}
                        </div>
                      </div>
                    ))}
                    {chatLoading && (
                      <div className="flex justify-start">
                        <div className="bg-secondary/40 rounded-xl px-3 py-2">
                          <Loader2 className="w-3.5 h-3.5 animate-spin text-muted-foreground" />
                        </div>
                      </div>
                    )}
                    <div ref={chatEndRef} />
                  </div>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Ketik pertanyaanmu..."
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && sendChatMessage()}
                      className="flex-1 text-sm"
                      disabled={chatLoading}
                    />
                    <Button size="sm" onClick={sendChatMessage} disabled={!chatInput.trim() || chatLoading} className="px-3">
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ) : mudahinajaModule === "listening" ? (
              <div className="space-y-5">
                <button onClick={() => setMudahinajaModule(null)} className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
                  <ChevronLeft className="w-4 h-4" /> Back to modules
                </button>
                <ListeningTutorial />
              </div>
            ) : mudahinajaModule === "reading" ? (
              <div className="space-y-5">
                <button onClick={() => setMudahinajaModule(null)} className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
                  <ChevronLeft className="w-4 h-4" /> Back to modules
                </button>
                <ReadingTutorial />
              </div>
            ) : mudahinajaModule === "speaking" ? (
              <div className="space-y-5">
                <button onClick={() => setMudahinajaModule(null)} className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
                  <ChevronLeft className="w-4 h-4" /> Back to modules
                </button>
                <SpeakingTutorial />
              </div>
            ) : mudahinajaModule === "writing" ? (
              <div className="space-y-5">
                <button onClick={() => setMudahinajaModule(null)} className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
                  <ChevronLeft className="w-4 h-4" /> Back to modules
                </button>
                <WritingCheatsheet />
              </div>
            ) : (
              <div className="space-y-4">
                <button onClick={() => setMudahinajaModule(null)} className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
                  <ChevronLeft className="w-4 h-4" /> Back to modules
                </button>
                <div className="flex flex-col items-center justify-center py-20 gap-4 text-center">
                  <Construction className="w-12 h-12 text-muted-foreground/40" />
                  <p className="text-base font-medium text-muted-foreground">Coming Soon</p>
                </div>
              </div>
            )}
          </TabsContent>

          {/* Mock Exams */}
          <TabsContent value="mock-exams" className="mt-7 focus-visible:outline-none">
            <div className="flex items-start gap-3 rounded-xl border border-amber-500/20 bg-amber-500/5 p-4 mb-6">
              <Sparkles className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-foreground">Full mock exams arriving after pilot</p>
                <p className="text-xs text-muted-foreground mt-1">Practice each section below — AI-generated, full-length, and automatically scored.</p>
              </div>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {sectionPractice.map((s) => (
                <div key={s.id} className="flex items-center gap-4 p-4 rounded-xl border border-border bg-card hover:border-elite-gold/30 transition-all">
                  <div className="w-10 h-10 rounded-xl bg-elite-gold/10 flex items-center justify-center shrink-0">
                    <s.icon className="h-5 w-5 text-elite-gold" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <p className="text-sm font-medium text-foreground">{s.title}</p>
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <Clock className="w-3 h-3" />{s.time}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed">{s.description}</p>
                  </div>
                  <Button size="sm" className="shrink-0 bg-accent text-accent-foreground hover:bg-accent/90 text-xs" onClick={() => navigate(s.route)}>
                    Start
                  </Button>
                </div>
              ))}
            </div>
          </TabsContent>

          {/* Consultation */}
          <TabsContent value="consultation" className="mt-7 focus-visible:outline-none">
            <div className="grid md:grid-cols-2 gap-5">
              {coaches.map((c) => (
                <div key={c.name} className="rounded-xl border border-border bg-card p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <Avatar className="h-14 w-14 border-2 border-elite-gold/20">
                      <AvatarFallback className="bg-elite-gold/10 text-elite-gold text-sm font-medium">
                        {c.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-semibold text-foreground">{c.name}</p>
                      <p className="text-xs text-muted-foreground">{c.title}</p>
                      <p className="text-xs text-muted-foreground">{c.specialization}</p>
                    </div>
                  </div>
                  <Badge variant="outline" className="bg-elite-gold/10 text-elite-gold border-elite-gold/20 text-xs">
                    {c.score}
                  </Badge>
                </div>
              ))}
              <div className="rounded-xl border border-border bg-card p-6 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <Calendar className="h-4 w-4 text-elite-gold" />
                    <p className="text-sm font-semibold text-foreground">How booking works</p>
                  </div>
                  <p className="text-xs text-muted-foreground mb-4 leading-relaxed">
                    Send your preferred date and time on WhatsApp. We confirm within 24 hours. Each session is 60 minutes.
                  </p>
                </div>
                <div className="flex flex-col gap-2">
                  <Button className="w-full bg-elite-gold/15 text-elite-gold border border-elite-gold/25 hover:bg-elite-gold/25 text-sm" onClick={() => navigate("/dashboard/consultation")}>
                    Book a 1-on-1 session
                  </Button>
                  <Button variant="ghost" className="w-full text-muted-foreground text-xs" onClick={() => navigate("/dashboard/consultation")}>
                    Open Consultation Hub
                  </Button>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {/* Atmospheric hero banner — bottom */}
        <div className="relative rounded-2xl overflow-hidden bg-atmospheric" style={{ minHeight: "340px" }}>
          <HeroBackground />
          <div className="noise-overlay" />
          <div className="absolute top-0 left-0 right-0 h-16 bg-gradient-to-b from-background/60 to-transparent" />

          <div className="relative z-10 flex flex-col justify-center px-8 py-16 md:px-12">
            <div className="flex items-center gap-2 mb-5">
              <Crown className="w-4 h-4 text-elite-gold" />
              <span className="text-xs font-medium text-elite-gold uppercase tracking-[0.14em]">Elite Plan</span>
            </div>
            <h2 className="text-5xl md:text-6xl font-black uppercase tracking-tight leading-[0.92] text-white mb-5">
              ELITE IELTS<br />PREPARATION.
            </h2>
            <p className="text-sm text-white/55 max-w-md leading-relaxed">
              Revision notes, flashcards, step-by-step tutorials, mock exams, and 1-on-1 coaching — built by 8.5+ scorers for Indonesian students.
            </p>
          </div>
        </div>

      </div>
    </DashboardLayout>
  );
}
