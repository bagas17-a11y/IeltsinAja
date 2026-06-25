import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Bookmark,
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
  ArrowRight,
  Users,
  Zap,
} from "lucide-react";
import { WritingCheatsheet } from "@/components/writing/WritingCheatsheet";
import { SpeakingTutorial } from "@/components/speaking/SpeakingTutorial";
import { ReadingTutorial } from "@/components/reading/ReadingTutorial";
import { ListeningTutorial } from "@/components/listening/ListeningTutorial";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";

const sectionPractice = [
  {
    id: "reading",
    title: "Reading",
    description: "AI-generated passages with answer-evidence highlighting.",
    time: "60 min",
    route: "/dashboard/reading",
    icon: BookOpen,
  },
  {
    id: "listening",
    title: "Listening",
    description: "AI-generated 4-section tests with full transcripts.",
    time: "30 min",
    route: "/dashboard/listening",
    icon: Headphones,
  },
  {
    id: "writing",
    title: "Writing",
    description: "Task 1 + Task 2 with band-score feedback and Band 8 rewrites.",
    time: "60 min",
    route: "/dashboard/writing",
    icon: PenTool,
  },
  {
    id: "speaking",
    title: "Speaking",
    description: "Parts 1–3 with AI fluency analysis on your recorded answer.",
    time: "11–14 min",
    route: "/dashboard/speaking",
    icon: Mic,
  },
];

const coaches = [
  {
    name: "Bagas H. Wicaksono",
    title: "Founder & lead coach",
    specialization: "Writing & Speaking strategy",
    score: "IELTS 8.5",
  },
];

const eliteStats = [
  { value: "8.5+", label: "Coach band score" },
  { value: "4", label: "Full modules" },
  { value: "16+", label: "Revision topics" },
  { value: "1-on-1", label: "Expert coaching" },
];

export default function EliteHubPage() {
  const { profile } = useAuth();
  const navigate = useNavigate();
  const [bookmarked, setBookmarked] = useState(false);
  const [activeTab, setActiveTab] = useState("resources");
  const [mudahinajaModule, setMudahinajaModule] = useState<string | null>(null);

  const isElite = profile?.subscription_tier === "elite";

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
            Access the full Elite experience: study resources, mock exams, and 1-on-1
            consultation. Upgrade to the Road to 8.0+ plan to access this exclusive feature.
          </p>
          <div className="glass-card p-6 mb-8">
            <h3 className="text-lg font-light mb-4">What's Included:</h3>
            <ul className="space-y-3 text-left max-w-md mx-auto">
              {[
                "Revision notes and flashcards",
                "Full mock exams with AI scoring",
                "5 hours of 1-on-1 consultation",
                "VIP priority support",
              ].map((feature) => (
                <li key={feature} className="flex items-center gap-3 text-foreground/80">
                  <Crown className="w-4 h-4 text-elite-gold flex-shrink-0" />
                  {feature}
                </li>
              ))}
            </ul>
          </div>
          <Button
            size="lg"
            onClick={() => navigate("/pricing-selection")}
            className="bg-elite-gold/20 text-elite-gold border border-elite-gold/30 hover:bg-elite-gold/30"
          >
            Upgrade to Road to 8.0+
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto space-y-6">

        {/* Premium hero banner */}
        <div className="relative rounded-2xl overflow-hidden border border-elite-gold/15">
          <div className="absolute inset-0 bg-gradient-to-br from-zinc-900 via-[#1a1710] to-zinc-900" />
          <div className="absolute inset-0 bg-gradient-to-br from-elite-gold/8 via-transparent to-transparent" />
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-elite-gold/40 to-transparent" />

          <div className="relative z-10 p-7 md:p-10">
            <div className="flex items-start justify-between gap-4 mb-5">
              <div className="flex items-center gap-2">
                <Crown className="w-4 h-4 text-elite-gold" />
                <span className="text-xs font-medium text-elite-gold uppercase tracking-[0.12em]">
                  Elite Plan
                </span>
              </div>
              <button
                onClick={() => setBookmarked(!bookmarked)}
                className={cn(
                  "w-8 h-8 rounded-lg border flex items-center justify-center transition-colors shrink-0",
                  bookmarked
                    ? "bg-elite-gold/10 border-elite-gold/30 text-elite-gold"
                    : "border-white/10 text-white/40 hover:text-white/70"
                )}
                aria-label={bookmarked ? "Remove bookmark" : "Bookmark"}
              >
                <Bookmark className={cn("h-4 w-4", bookmarked && "fill-current")} />
              </button>
            </div>

            <h1 className="text-2xl md:text-3xl font-semibold text-white mb-2 tracking-tight">
              Elite IELTS Preparation
            </h1>
            <p className="text-sm text-white/50 max-w-xl leading-relaxed mb-7">
              Full access to revision notes, flashcards, step-by-step tutorials, mock exams, and 1-on-1 coaching — all built by 8.5+ scorers for Indonesian students.
            </p>

            <div className="flex flex-wrap gap-x-8 gap-y-3 pt-5 border-t border-white/8">
              {eliteStats.map((s) => (
                <div key={s.label}>
                  <p className="text-lg font-semibold text-white">{s.value}</p>
                  <p className="text-xs text-white/40">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="w-full justify-start overflow-x-auto border-b border-border rounded-none bg-transparent p-0 h-auto gap-0">
            {[
              { value: "resources", label: "Study Hub" },
              { value: "revision-notes", label: "Revision Notes" },
              { value: "flashcards", label: "Flashcards" },
              { value: "mudahinaja", label: "MudahinAja" },
              { value: "mock-exams", label: "Mock Exams" },
              { value: "consultation", label: "Consultation" },
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

          {/* Study Hub */}
          <TabsContent value="resources" className="mt-7 focus-visible:outline-none">
            <div className="mb-5">
              <h2 className="text-base font-semibold text-foreground mb-1">Your resources</h2>
              <p className="text-sm text-muted-foreground">Everything in your Elite plan, in one place.</p>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              {/* Revision Notes */}
              <div className="rounded-xl border border-border bg-card hover:border-elite-gold/30 transition-all duration-200 p-5 flex flex-col gap-4">
                <div className="flex items-start justify-between">
                  <div className="w-10 h-10 rounded-xl bg-elite-gold/10 flex items-center justify-center">
                    <BookOpen className="h-5 w-5 text-elite-gold" />
                  </div>
                  <Badge className="bg-green-500/10 text-green-400 border-green-500/20 text-xs">Study</Badge>
                </div>
                <div className="flex-1">
                  <p className="font-medium text-foreground text-sm mb-1">Revision Notes</p>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    16+ topics covering grammar, writing skills, and vocabulary — with worksheets.
                  </p>
                </div>
                <div className="flex flex-col gap-1.5 pt-3 border-t border-border">
                  <Link
                    to="/dashboard/revision-notes?view=all"
                    className="flex items-center justify-between text-xs text-muted-foreground hover:text-foreground transition-colors py-1"
                  >
                    Browse all topics <ChevronRight className="w-3 h-3" />
                  </Link>
                  <Link
                    to="/dashboard/revision-notes?topic=parts-of-speech"
                    className="flex items-center justify-between text-xs text-accent hover:text-accent/80 transition-colors py-1"
                  >
                    Continue learning <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>

              {/* Flashcards */}
              <div className="rounded-xl border border-border bg-card hover:border-elite-gold/30 transition-all duration-200 p-5 flex flex-col gap-4">
                <div className="flex items-start justify-between">
                  <div className="w-10 h-10 rounded-xl bg-elite-gold/10 flex items-center justify-center">
                    <Layers className="h-5 w-5 text-elite-gold" />
                  </div>
                  <div className="flex gap-1.5">
                    <Badge className="bg-green-500/10 text-green-400 border-green-500/20 text-xs">Study</Badge>
                    <Badge className="bg-blue-500/10 text-blue-400 border-blue-500/20 text-xs">Practice</Badge>
                  </div>
                </div>
                <div className="flex-1">
                  <p className="font-medium text-foreground text-sm mb-1">Flashcards</p>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Interactive digital flashcards to reinforce definitions, vocabulary, and key facts.
                  </p>
                </div>
                <div className="flex flex-col gap-1.5 pt-3 border-t border-border">
                  <Link
                    to="/dashboard/flashcards?view=all"
                    className="flex items-center justify-between text-xs text-accent hover:text-accent/80 transition-colors py-1"
                  >
                    Browse all sets <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>

              {/* MudahinAja */}
              <div className="rounded-xl border border-elite-gold/20 bg-card hover:border-elite-gold/40 transition-all duration-200 p-5 flex flex-col gap-4">
                <div className="flex items-start justify-between">
                  <div className="w-10 h-10 rounded-xl bg-elite-gold/10 flex items-center justify-center">
                    <Sparkles className="h-5 w-5 text-elite-gold" />
                  </div>
                  <Badge className="bg-purple-500/10 text-purple-400 border-purple-500/20 text-xs">Interactive</Badge>
                </div>
                <div className="flex-1">
                  <p className="font-medium text-foreground text-sm mb-1">MudahinAja</p>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Step-by-step slide guides for Reading, Listening, Writing, and Speaking.
                  </p>
                </div>
                <div className="pt-3 border-t border-border">
                  <button
                    onClick={() => { setActiveTab("mudahinaja"); setMudahinajaModule(null); }}
                    className="flex items-center justify-between w-full text-xs text-accent hover:text-accent/80 transition-colors py-1"
                  >
                    Open MudahinAja <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>

            {/* Quick access strip */}
            <div className="mt-5 rounded-xl border border-border bg-card p-5">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-4">Quick access</p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {[
                  { label: "Mock Exams", icon: Zap, tab: "mock-exams" },
                  { label: "Revision Notes", icon: BookMarked, tab: "revision-notes" },
                  { label: "Flashcards", icon: Layers, tab: "flashcards" },
                  { label: "Consultation", icon: Users, tab: "consultation" },
                ].map(({ label, icon: Icon, tab }) => (
                  <button
                    key={label}
                    onClick={() => setActiveTab(tab)}
                    className="flex items-center gap-2.5 p-3 rounded-lg border border-border hover:border-elite-gold/25 hover:bg-elite-gold/5 transition-all text-left"
                  >
                    <Icon className="w-4 h-4 text-elite-gold shrink-0" />
                    <span className="text-xs text-foreground/70">{label}</span>
                  </button>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* Revision Notes Tab */}
          <TabsContent value="revision-notes" className="mt-7 focus-visible:outline-none">
            <h2 className="text-base font-semibold text-foreground mb-1">Revision Notes</h2>
            <p className="text-sm text-muted-foreground mb-6">
              Concise, high-quality notes covering grammar, writing skills, and vocabulary.
            </p>
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

          {/* Flashcards Tab */}
          <TabsContent value="flashcards" className="mt-7 focus-visible:outline-none">
            <h2 className="text-base font-semibold text-foreground mb-1">Flashcards</h2>
            <p className="text-sm text-muted-foreground mb-6">
              Interactive digital flashcards to reinforce key facts, definitions, and vocabulary.
            </p>
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

          {/* MudahinAja Tab */}
          <TabsContent value="mudahinaja" className="mt-7 focus-visible:outline-none">
            {mudahinajaModule === null ? (
              <div className="space-y-5">
                <div>
                  <h2 className="text-base font-semibold text-foreground mb-1">MudahinAja</h2>
                  <p className="text-sm text-muted-foreground">Step-by-step tutorials for all four IELTS modules.</p>
                </div>
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                  {[
                    { id: "reading", label: "Reading", icon: BookOpen },
                    { id: "listening", label: "Listening", icon: Headphones },
                    { id: "writing", label: "Writing", icon: PenTool },
                    { id: "speaking", label: "Speaking", icon: Mic },
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
                  <p className="text-sm text-muted-foreground/70 max-w-xs">
                    The {mudahinajaModule.charAt(0).toUpperCase() + mudahinajaModule.slice(1)} tutorial is being built. Check back soon!
                  </p>
                </div>
              </div>
            )}
          </TabsContent>

          {/* Mock Exams Tab */}
          <TabsContent value="mock-exams" className="mt-7 focus-visible:outline-none">
            <div className="flex items-start gap-3 rounded-xl border border-amber-500/20 bg-amber-500/5 p-4 mb-6">
              <Sparkles className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-foreground">Full mock exams arriving after pilot</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Practice each section below — AI-generated, full-length, and automatically scored.
                </p>
              </div>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {sectionPractice.map((s) => (
                <div
                  key={s.id}
                  className="flex items-center gap-4 p-4 rounded-xl border border-border bg-card hover:border-elite-gold/30 transition-all"
                >
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
                  <Button
                    size="sm"
                    className="shrink-0 bg-accent text-accent-foreground hover:bg-accent/90 text-xs"
                    onClick={() => navigate(s.route)}
                  >
                    Start
                  </Button>
                </div>
              ))}
            </div>
          </TabsContent>

          {/* Consultation Tab */}
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
                  <Button
                    className="w-full bg-elite-gold/15 text-elite-gold border border-elite-gold/25 hover:bg-elite-gold/25 text-sm"
                    onClick={() => navigate("/dashboard/consultation")}
                  >
                    Book a 1-on-1 session
                  </Button>
                  <Button
                    variant="ghost"
                    className="w-full text-muted-foreground text-xs"
                    onClick={() => navigate("/dashboard/consultation")}
                  >
                    Open Consultation Hub
                  </Button>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
