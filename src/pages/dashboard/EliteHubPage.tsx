import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Bookmark,
  Home,
  CheckCircle,
  User,
  GraduationCap,
  Lightbulb,
  FileCheck,
  FileDown,
  ListOrdered,
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
} from "lucide-react";
import { WritingCheatsheet } from "@/components/writing/WritingCheatsheet";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";

const featureBadges = [
  { icon: CheckCircle, label: "Exam specification aligned" },
  { icon: User, label: "Personalise to your ability" },
  { icon: GraduationCap, label: "Written by experts" },
  { icon: Lightbulb, label: "Examiner tips and tricks" },
  { icon: FileCheck, label: "Exam practice with solutions" },
  { icon: FileDown, label: "PDF downloads" },
  { icon: ListOrdered, label: "Step-by-step mark schemes" },
];

const sectionPractice = [
  {
    id: "reading",
    title: "Reading practice",
    description: "AI-generated passages with answer-evidence highlighting.",
    time: "60 min",
    route: "/dashboard/reading",
  },
  {
    id: "listening",
    title: "Listening practice",
    description: "AI-generated 4-section listening tests with full transcripts.",
    time: "30 min",
    route: "/dashboard/listening",
  },
  {
    id: "writing",
    title: "Writing practice",
    description: "Task 1 + Task 2 with band-score feedback and Band 8 rewrites.",
    time: "60 min",
    route: "/dashboard/writing",
  },
  {
    id: "speaking",
    title: "Speaking practice",
    description: "Parts 1–3 with AI fluency analysis on your recorded answer.",
    time: "11–14 min",
    route: "/dashboard/speaking",
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
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Breadcrumb */}
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link to="/dashboard" className="flex items-center gap-1.5">
                  <Home className="h-3.5 w-3.5" />
                  Home
                </Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <span className="text-muted-foreground">IELTS</span>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Elite Tier</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {/* Hero */}
        <div className="space-y-4">
          <div className="flex items-start justify-between gap-4">
            <h1 className="text-3xl font-bold text-foreground tracking-tight md:text-4xl">
              Elite IELTS Preparation
            </h1>
            <Button
              variant="outline"
              size="icon"
              className={cn(
                "shrink-0 rounded-lg border-border",
                bookmarked && "bg-elite-gold/10 border-elite-gold/30 text-elite-gold"
              )}
              onClick={() => setBookmarked(!bookmarked)}
              aria-label={bookmarked ? "Remove bookmark" : "Bookmark"}
            >
              <Bookmark className={cn("h-5 w-5", bookmarked && "fill-current")} />
            </Button>
          </div>
          <p className="text-muted-foreground font-normal max-w-3xl leading-relaxed">
            Tools designed specifically for the IELTS exam to help you achieve your target band,
            including: revision notes, exam-style practice, and mock tests—created by{" "}
            <a
              href="#"
              className="text-accent underline underline-offset-2 hover:text-accent/90"
              onClick={(e) => {
                e.preventDefault();
              }}
            >
              our expert team
            </a>{" "}
            of teachers and examiners. Review your answers using AI and mark schemes.
          </p>

          {/* Feature badges grid */}
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 pt-2">
            {featureBadges.map(({ icon: Icon, label }) => (
              <div
                key={label}
                className="flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-2.5"
              >
                <Icon className="h-4 w-4 shrink-0 text-accent" />
                <span className="text-xs font-medium text-foreground sm:text-sm">{label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="w-full justify-start overflow-x-auto border-b border-border rounded-none bg-transparent p-0 h-auto gap-0">
            <TabsTrigger
              value="resources"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-elite-gold data-[state=active]:text-elite-gold data-[state=active]:bg-transparent px-4 py-3"
            >
              Resources (The Study Hub)
            </TabsTrigger>
            <TabsTrigger
              value="revision-notes"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-elite-gold data-[state=active]:text-elite-gold data-[state=active]:bg-transparent px-4 py-3"
            >
              Revision Notes
            </TabsTrigger>
            <TabsTrigger
              value="flashcards"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-elite-gold data-[state=active]:text-elite-gold data-[state=active]:bg-transparent px-4 py-3"
            >
              Flashcards
            </TabsTrigger>
            <TabsTrigger
              value="mudahinaja"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-elite-gold data-[state=active]:text-elite-gold data-[state=active]:bg-transparent px-4 py-3"
            >
              MudahinAja
            </TabsTrigger>
            <TabsTrigger
              value="mock-exams"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-elite-gold data-[state=active]:text-elite-gold data-[state=active]:bg-transparent px-4 py-3"
            >
              Mock Exams (The Simulation)
            </TabsTrigger>
            <TabsTrigger
              value="consultation"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-elite-gold data-[state=active]:text-elite-gold data-[state=active]:bg-transparent px-4 py-3"
            >
              Consultation (The Human Element)
            </TabsTrigger>
          </TabsList>

          <TabsContent value="resources" className="mt-8 focus-visible:outline-none">
            <h2 className="text-lg font-semibold text-foreground mb-4">Included in this course</h2>
            <p className="text-sm text-muted-foreground mb-6">
              Comprehensive content covering your entire exam specification.
            </p>
            <div className="grid gap-6 md:grid-cols-2">
              <Card className="border-border bg-card">
                <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
                  <div className="w-10 h-10 rounded-lg bg-elite-gold/10 flex items-center justify-center">
                    <BookOpen className="h-5 w-5 text-elite-gold" />
                  </div>
                  <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                    Study
                  </Badge>
                </CardHeader>
                <CardContent className="space-y-3">
                  <CardTitle className="text-lg">Revision Notes</CardTitle>
                  <CardDescription>
                    Concise, high-quality notes to build your understanding of all topics in the
                    specification.
                  </CardDescription>
                  <div className="flex flex-wrap gap-4 pt-2">
                    <Link
                      to="/dashboard/revision-notes?view=all"
                      className="text-sm font-medium text-accent hover:underline"
                    >
                      All topics
                    </Link>
                    <Link
                      to="/dashboard/revision-notes?topic=parts-of-speech"
                      className="text-sm font-medium text-accent hover:underline inline-flex items-center gap-1"
                    >
                      Continue learning
                      <ChevronRight className="h-4 w-4" />
                    </Link>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-border bg-card">
                <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
                  <div className="w-10 h-10 rounded-lg bg-elite-gold/10 flex items-center justify-center">
                    <Layers className="h-5 w-5 text-elite-gold" />
                  </div>
                  <div className="flex gap-1.5">
                    <Badge className="bg-green-500/20 text-green-400 border-green-500/30">Study</Badge>
                    <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">
                      Practice
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <CardTitle className="text-lg">Flashcards</CardTitle>
                  <CardDescription>
                    Interactive digital flashcards that help reinforce facts and definitions.
                  </CardDescription>
                  <div className="flex flex-wrap gap-4 pt-2">
                    <Link
                      to="/dashboard/flashcards?view=all"
                      className="text-sm font-medium text-accent hover:underline"
                    >
                      All topics
                    </Link>
                  </div>
                </CardContent>
              </Card>

              {/* MudahinAja card */}
              <Card className="border-border bg-card md:col-span-2">
                <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
                  <div className="w-10 h-10 rounded-lg bg-elite-gold/10 flex items-center justify-center">
                    <Sparkles className="h-5 w-5 text-elite-gold" />
                  </div>
                  <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30">
                    Interactive
                  </Badge>
                </CardHeader>
                <CardContent className="space-y-3">
                  <CardTitle className="text-lg">MudahinAja — Step-by-Step Tutorials</CardTitle>
                  <CardDescription>
                    Interactive slide-based guides that walk you through exactly how to answer each module, sentence by sentence.
                  </CardDescription>
                  <div className="flex flex-wrap gap-4 pt-2">
                    <button
                      onClick={() => { setActiveTab("mudahinaja"); setMudahinajaModule(null); }}
                      className="text-sm font-medium text-accent hover:underline inline-flex items-center gap-1"
                    >
                      Open MudahinAja
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Revision Notes Tab */}
          <TabsContent value="revision-notes" className="mt-8 focus-visible:outline-none">
            <h2 className="text-lg font-semibold text-foreground mb-2">Revision Notes</h2>
            <p className="text-sm text-muted-foreground mb-6">
              Concise, high-quality notes to build your understanding of all IELTS topics.
            </p>
            <div className="grid gap-4 sm:grid-cols-2">
              <Link to="/dashboard/revision-notes?view=all">
                <Card className="border-border bg-card hover:border-elite-gold/30 transition-colors cursor-pointer">
                  <CardContent className="flex items-center gap-4 p-5">
                    <div className="w-10 h-10 rounded-lg bg-elite-gold/10 flex items-center justify-center shrink-0">
                      <BookOpen className="h-5 w-5 text-elite-gold" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">All Topics</p>
                      <p className="text-xs text-muted-foreground mt-0.5">Browse the full revision library</p>
                    </div>
                    <ChevronRight className="h-4 w-4 text-muted-foreground ml-auto" />
                  </CardContent>
                </Card>
              </Link>
              <Link to="/dashboard/revision-notes?topic=parts-of-speech">
                <Card className="border-border bg-card hover:border-elite-gold/30 transition-colors cursor-pointer">
                  <CardContent className="flex items-center gap-4 p-5">
                    <div className="w-10 h-10 rounded-lg bg-elite-gold/10 flex items-center justify-center shrink-0">
                      <BookMarked className="h-5 w-5 text-elite-gold" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">Continue Learning</p>
                      <p className="text-xs text-muted-foreground mt-0.5">Pick up where you left off</p>
                    </div>
                    <ChevronRight className="h-4 w-4 text-muted-foreground ml-auto" />
                  </CardContent>
                </Card>
              </Link>
            </div>
          </TabsContent>

          {/* Flashcards Tab */}
          <TabsContent value="flashcards" className="mt-8 focus-visible:outline-none">
            <h2 className="text-lg font-semibold text-foreground mb-2">Flashcards</h2>
            <p className="text-sm text-muted-foreground mb-6">
              Interactive digital flashcards to reinforce key facts, definitions, and vocabulary.
            </p>
            <div className="grid gap-4 sm:grid-cols-2">
              <Link to="/dashboard/flashcards?view=all">
                <Card className="border-border bg-card hover:border-elite-gold/30 transition-colors cursor-pointer">
                  <CardContent className="flex items-center gap-4 p-5">
                    <div className="w-10 h-10 rounded-lg bg-elite-gold/10 flex items-center justify-center shrink-0">
                      <Layers className="h-5 w-5 text-elite-gold" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">All Topics</p>
                      <p className="text-xs text-muted-foreground mt-0.5">Browse all flashcard sets</p>
                    </div>
                    <ChevronRight className="h-4 w-4 text-muted-foreground ml-auto" />
                  </CardContent>
                </Card>
              </Link>
            </div>
          </TabsContent>

          {/* MudahinAja Tab */}
          <TabsContent value="mudahinaja" className="mt-8 focus-visible:outline-none">
            {mudahinajaModule === null ? (
              <div className="space-y-6">
                <div>
                  <h2 className="text-lg font-semibold text-foreground mb-1">MudahinAja — Interactive Tutorials</h2>
                  <p className="text-sm text-muted-foreground">
                    Choose a module to start your step-by-step tutorial. Writing is available now — more coming soon.
                  </p>
                </div>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  {[
                    { id: "reading", label: "Reading", icon: BookOpen, available: false },
                    { id: "listening", label: "Listening", icon: Headphones, available: false },
                    { id: "writing", label: "Writing", icon: PenTool, available: true },
                    { id: "speaking", label: "Speaking", icon: Mic, available: false },
                  ].map((mod) => (
                    <button
                      key={mod.id}
                      onClick={() => mod.available && setMudahinajaModule(mod.id)}
                      className={cn(
                        "flex flex-col items-center justify-center gap-3 p-6 rounded-xl border text-center transition-all",
                        mod.available
                          ? "border-elite-gold/30 bg-elite-gold/5 hover:bg-elite-gold/10 cursor-pointer"
                          : "border-border bg-card opacity-50 cursor-not-allowed"
                      )}
                    >
                      <div className={cn(
                        "w-12 h-12 rounded-full flex items-center justify-center",
                        mod.available ? "bg-elite-gold/20" : "bg-secondary"
                      )}>
                        <mod.icon className={cn("w-6 h-6", mod.available ? "text-elite-gold" : "text-muted-foreground")} />
                      </div>
                      <div>
                        <p className={cn("text-sm font-semibold", mod.available ? "text-foreground" : "text-muted-foreground")}>
                          {mod.label}
                        </p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {mod.available ? "Available now" : "Coming soon"}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            ) : mudahinajaModule === "writing" ? (
              <div className="space-y-6">
                <button
                  onClick={() => setMudahinajaModule(null)}
                  className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" /> Back to modules
                </button>
                <WritingCheatsheet />
              </div>
            ) : (
              <div className="space-y-4">
                <button
                  onClick={() => setMudahinajaModule(null)}
                  className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" /> Back to modules
                </button>
                <div className="flex flex-col items-center justify-center py-20 gap-4 text-center">
                  <Construction className="w-12 h-12 text-muted-foreground/40" />
                  <p className="text-lg font-medium text-muted-foreground">Coming Soon</p>
                  <p className="text-sm text-muted-foreground/70 max-w-xs">
                    The {mudahinajaModule.charAt(0).toUpperCase() + mudahinajaModule.slice(1)} tutorial is being built. Check back soon!
                  </p>
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="mock-exams" className="mt-8 focus-visible:outline-none">
            <div className="rounded-lg border border-amber-500/30 bg-amber-500/10 p-4 mb-6 flex items-start gap-3">
              <Sparkles className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-foreground">
                  Full back-to-back mock exams arrive after pilot
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  While we polish the timed full-mock runner, practice each section below.
                  Each one is AI-generated, full-length, and scored automatically.
                </p>
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-2">
              {sectionPractice.map((s) => (
                <Card key={s.id} className="border-border bg-card">
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base">{s.title}</CardTitle>
                      <Badge variant="secondary" className="text-xs font-normal flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {s.time}
                      </Badge>
                    </div>
                    <CardDescription>{s.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button
                      className="w-full bg-accent text-accent-foreground hover:bg-accent/90"
                      onClick={() => navigate(s.route)}
                    >
                      Start practice
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="consultation" className="mt-8 focus-visible:outline-none">
            <h2 className="text-lg font-semibold text-foreground mb-4">Meet your coach</h2>
            <div className="flex flex-wrap gap-6 mb-8">
              {coaches.map((c) => (
                <div
                  key={c.name}
                  className="flex flex-col items-center text-center gap-2"
                >
                  <Avatar className="h-16 w-16 border-2 border-border">
                    <AvatarFallback className="bg-elite-gold/10 text-elite-gold text-sm font-medium">
                      {c.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .slice(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium text-foreground">{c.name}</p>
                    <p className="text-xs text-muted-foreground">{c.title}</p>
                    <p className="text-xs text-muted-foreground">{c.specialization}</p>
                    <Badge variant="outline" className="mt-2 bg-elite-gold/10 text-elite-gold border-elite-gold/30">
                      {c.score}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>

            <div className="grid gap-6 md:grid-cols-2 mb-8">
              <Card className="border-border bg-card">
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-elite-gold" />
                    How booking works
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    Send us your preferred date and time on WhatsApp. We'll confirm within
                    24 hours during the pilot. Each session is 60 minutes.
                  </p>
                  <Button
                    variant="outline"
                    className="w-full border-elite-gold/30 text-elite-gold hover:bg-elite-gold/10"
                    onClick={() => navigate("/dashboard/consultation")}
                  >
                    Open Consultation Hub
                  </Button>
                </CardContent>
              </Card>
            </div>

            <Button
              size="lg"
              className="w-full sm:w-auto bg-elite-gold/20 text-elite-gold border border-elite-gold/30 hover:bg-elite-gold/30"
              onClick={() => navigate("/dashboard/consultation")}
            >
              Book a 1-on-1 session
            </Button>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
