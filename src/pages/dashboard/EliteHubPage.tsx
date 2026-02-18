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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
  Clock,
  Sparkles,
  Crown,
  Lock,
  Star,
  Calendar,
} from "lucide-react";
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

const mockExams = [
  { id: "1", type: "Academic", time: "2h 45m", status: "not_started" as const },
  { id: "2", type: "Academic", time: "2h 45m", status: "not_started" as const },
  { id: "3", type: "General Training", time: "2h 45m", status: "not_started" as const },
];

const consultants = [
  {
    name: "Dr. Sarah Mitchell",
    title: "Former IELTS Chief Examiner",
    experience: "15+ years",
    specialization: "Writing & Speaking",
    rating: 4.9,
    image: null,
  },
  {
    name: "Prof. James Crawford",
    title: "Ex-British Council Examiner",
    experience: "12+ years",
    specialization: "Academic Writing",
    rating: 4.8,
    image: null,
  },
  {
    name: "Ms. Emily Chen",
    title: "IELTS Master Trainer",
    experience: "10+ years",
    specialization: "Speaking & Fluency",
    rating: 4.9,
    image: null,
  },
];

const pastConsultationsPlaceholder = [
  { date: "15 Feb 2025", consultant: "Dr. Sarah Mitchell", duration: "60 min", status: "Completed" },
  { date: "8 Feb 2025", consultant: "Prof. James Crawford", duration: "60 min", status: "Completed" },
];

export default function EliteHubPage() {
  const { profile } = useAuth();
  const navigate = useNavigate();
  const [bookmarked, setBookmarked] = useState(false);

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
            Access the full Human + AI experience: study resources, mock exams, and 1-on-1
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
              Human + AI IELTS Preparation
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
        <Tabs defaultValue="resources" className="w-full">
          <TabsList className="w-full justify-start overflow-x-auto border-b border-border rounded-none bg-transparent p-0 h-auto gap-0">
            <TabsTrigger
              value="resources"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-elite-gold data-[state=active]:text-elite-gold data-[state=active]:bg-transparent px-4 py-3"
            >
              Resources (The Study Hub)
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
                    <Link
                      to="/dashboard/flashcards"
                      className="text-sm font-medium text-accent hover:underline"
                    >
                      Go to Flashcards
                      <ChevronRight className="inline h-4 w-4 ml-1" />
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="mock-exams" className="mt-8 focus-visible:outline-none">
            <p className="text-sm text-muted-foreground mb-6">
              Full practice papers aligned to the exam. Practice in real exam conditions, then submit
              and review with AI and mark schemes.
            </p>
            <div className="space-y-4">
              <h3 className="text-base font-semibold text-foreground">Set A</h3>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {mockExams.map((exam) => (
                  <Card key={exam.id} className="border-border bg-card">
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-base">
                          Paper {exam.id} · {exam.type}
                        </CardTitle>
                        <Badge variant="secondary" className="text-xs font-normal">
                          {exam.type === "Academic" ? "Academic" : "General Training"}
                        </Badge>
                      </div>
                      <CardDescription className="flex items-center gap-1.5 pt-1">
                        <Clock className="h-3.5 w-3.5" />
                        {exam.time}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <Badge
                        variant="outline"
                        className="w-full justify-center py-1.5 text-muted-foreground border-border"
                      >
                        Paper not started
                      </Badge>
                      <div className="flex flex-col gap-2">
                        <Button
                          className="w-full bg-accent text-accent-foreground hover:bg-accent/90"
                          onClick={() => navigate("/dashboard/reading")}
                        >
                          Start Exam
                        </Button>
                        <div className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
                          <Sparkles className="h-3.5 w-3.5 text-elite-gold" />
                          AI-Powered Scoring Available
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="consultation" className="mt-8 focus-visible:outline-none">
            <h2 className="text-lg font-semibold text-foreground mb-4">Meet your Tutors</h2>
            <div className="flex flex-wrap gap-6 mb-8">
              {consultants.map((c) => (
                <div
                  key={c.name}
                  className="flex flex-col items-center text-center gap-2"
                >
                  <Avatar className="h-14 w-14 border-2 border-border">
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
                    <div className="flex items-center justify-center gap-1 mt-1">
                      <Star className="h-3.5 w-3.5 fill-elite-gold text-elite-gold" />
                      <span className="text-xs text-foreground">{c.rating}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="grid gap-6 md:grid-cols-2 mb-8">
              <Card className="border-border bg-card">
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-elite-gold" />
                    Next available slot
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    Select a date and time to book your 1-on-1 session.
                  </p>
                  <Button
                    variant="outline"
                    className="w-full border-elite-gold/30 text-elite-gold hover:bg-elite-gold/10"
                    onClick={() => navigate("/dashboard/consultation")}
                  >
                    Choose date & time
                  </Button>
                </CardContent>
              </Card>
            </div>

            <Button
              size="lg"
              className="w-full sm:w-auto bg-elite-gold/20 text-elite-gold border border-elite-gold/30 hover:bg-elite-gold/30"
              onClick={() => navigate("/dashboard/consultation")}
            >
              Book 1-on-1 Session
            </Button>

            <div className="mt-10">
              <h3 className="text-base font-semibold text-foreground mb-4">Past Consultations</h3>
              <Card className="border-border">
                <Table>
                  <TableHeader>
                    <TableRow className="border-border hover:bg-transparent">
                      <TableHead className="text-muted-foreground">Date</TableHead>
                      <TableHead className="text-muted-foreground">Consultant</TableHead>
                      <TableHead className="text-muted-foreground">Duration</TableHead>
                      <TableHead className="text-muted-foreground">Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pastConsultationsPlaceholder.map((row, i) => (
                      <TableRow key={i} className="border-border">
                        <TableCell className="text-foreground">{row.date}</TableCell>
                        <TableCell className="text-foreground">{row.consultant}</TableCell>
                        <TableCell className="text-foreground">{row.duration}</TableCell>
                        <TableCell className="text-foreground">{row.status}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
