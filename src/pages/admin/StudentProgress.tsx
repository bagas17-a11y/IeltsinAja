import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  ArrowLeft,
  BarChart2,
  BookOpen,
  Headphones,
  Loader2,
  Mic,
  PenLine,
  RefreshCw,
  Search,
  TrendingDown,
  CheckSquare,
  Square,
  Clock,
  Activity,
  ChevronDown,
  ChevronRight,
  Save,
} from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { formatDistanceToNow } from "date-fns";
import { PLANS } from "@/pages/dashboard/StudyPlanPage";

interface StudentRow {
  user_id: string;
  email: string;
  subscription_tier: string;
  moduleScores: Record<string, number | null>;
  lowestModule: string | null;
  studyPlanCompleted: number;
  rawProgress: ProgressEntry[];
  completedTaskEntries: CompletedTask[];
  lastActiveAt: string | null;
  lastAction: string | null;
}

interface ProgressEntry {
  id: string;
  exam_type: string;
  band_score: number | null;
  score: number | null;
  total_questions: number | null;
  correct_answers: number | null;
  completed_at: string;
  errors_log: ErrorEntry[] | null;
  feedback: string | null;
  metadata: Record<string, unknown> | null;
}

interface CompletedTask {
  question_id: string;
  completed_at: string;
}

interface ErrorEntry {
  type: string;
  count: number;
}

const MODULE_LABELS: Record<string, string> = {
  writing: "Writing",
  speaking: "Speaking",
  reading: "Reading",
  listening: "Listening",
};

// Study plan tasks are stored as a flat question_id (e.g. "f-w1-t1") with no
// tier/week column — resolve it back to a human label by scanning all three
// tiers' plans once. Task ids are prefixed per tier (f-/d-/p-) so there's no
// ambiguity searching across all of them.
const STUDY_TASK_LOOKUP: Record<string, { label: string; tier: string; week: number }> = (() => {
  const map: Record<string, { label: string; tier: string; week: number }> = {};
  Object.values(PLANS).forEach((plan) => {
    plan.weeks.forEach((week) => {
      week.tasks.forEach((task) => {
        map[task.id] = { label: task.label, tier: plan.tier, week: week.week };
      });
    });
  });
  return map;
})();

const MODULE_ICONS: Record<string, React.ReactNode> = {
  writing: <PenLine className="w-3.5 h-3.5" />,
  speaking: <Mic className="w-3.5 h-3.5" />,
  reading: <BookOpen className="w-3.5 h-3.5" />,
  listening: <Headphones className="w-3.5 h-3.5" />,
};

const MODULES = ["writing", "speaking", "reading", "listening"];

function bandColor(score: number | null): string {
  if (score === null) return "text-muted-foreground";
  if (score >= 7.5) return "text-green-400";
  if (score >= 6.5) return "text-accent";
  if (score >= 5.5) return "text-yellow-400";
  return "text-red-400";
}

function bandBg(score: number | null): string {
  if (score === null) return "bg-secondary/30 text-muted-foreground border-border/30";
  if (score >= 7.5) return "bg-green-500/10 text-green-400 border-green-500/30";
  if (score >= 6.5) return "bg-accent/10 text-accent border-accent/30";
  if (score >= 5.5) return "bg-yellow-500/10 text-yellow-400 border-yellow-500/30";
  return "bg-red-500/10 text-red-400 border-red-500/30";
}

function timeAgo(iso: string | null): string {
  if (!iso) return "Never";
  try {
    return formatDistanceToNow(new Date(iso), { addSuffix: true });
  } catch {
    return "—";
  }
}

export default function StudentProgress() {
  const navigate = useNavigate();
  const { user, isLoading, isAdmin, isCheckingAdmin } = useAuth();
  const { toast } = useToast();

  const [students, setStudents] = useState<StudentRow[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedStudent, setSelectedStudent] = useState<StudentRow | null>(null);
  const [expandedEssayId, setExpandedEssayId] = useState<string | null>(null);
  const [coachNotes, setCoachNotes] = useState<Record<string, string>>({});
  const [savingNote, setSavingNote] = useState<string | null>(null);

  // Drag-to-resize sheet
  const [sheetWidth, setSheetWidth] = useState(640);
  const isDragging = useRef(false);
  const dragStartX = useRef(0);
  const dragStartWidth = useRef(0);

  useEffect(() => {
    function onMove(e: MouseEvent) {
      if (!isDragging.current) return;
      const delta = dragStartX.current - e.clientX;
      setSheetWidth(Math.max(420, Math.min(1100, dragStartWidth.current + delta)));
    }
    function onUp() { isDragging.current = false; }
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
  }, []);

  useEffect(() => {
    if (!isLoading && !user) { navigate("/auth"); return; }
    if (!isLoading && !isCheckingAdmin && user && !isAdmin) {
      navigate("/dashboard");
      toast({ title: "Access Denied", description: "Admin only.", variant: "destructive" });
    }
  }, [user, isLoading, isCheckingAdmin, isAdmin, navigate, toast]);

  useEffect(() => {
    if (user && isAdmin) fetchData();
  }, [user, isAdmin]);

  const fetchData = async () => {
    setIsLoadingData(true);
    try {
      const [{ data: profiles }, { data: progressRows }, { data: completedRows }] = await Promise.all([
        supabase
          .from("profiles")
          .select("user_id, email, subscription_tier")
          .order("created_at", { ascending: false }),
        supabase
          .from("user_progress")
          .select("id, user_id, exam_type, band_score, score, total_questions, correct_answers, completed_at, errors_log, feedback, metadata")
          .in("exam_type", MODULES)
          .order("completed_at", { ascending: false }),
        supabase
          .from("user_completed_questions")
          .select("user_id, question_id, completed_at")
          .eq("module", "study_plan")
          .order("completed_at", { ascending: false }),
      ]);

      if (!profiles) return;

      // Group completed tasks by user
      const completedByUser: Record<string, CompletedTask[]> = {};
      for (const r of completedRows ?? []) {
        if (!completedByUser[r.user_id]) completedByUser[r.user_id] = [];
        completedByUser[r.user_id].push({ question_id: r.question_id, completed_at: r.completed_at });
      }

      // Group progress by user — first entry per exam_type is the latest (already sorted desc)
      const latestByModule: Record<string, Record<string, ProgressEntry>> = {};
      const allByUser: Record<string, ProgressEntry[]> = {};
      for (const p of progressRows ?? []) {
        if (!latestByModule[p.user_id]) latestByModule[p.user_id] = {};
        if (!latestByModule[p.user_id][p.exam_type]) {
          latestByModule[p.user_id][p.exam_type] = p as ProgressEntry;
        }
        if (!allByUser[p.user_id]) allByUser[p.user_id] = [];
        allByUser[p.user_id].push(p as ProgressEntry);
      }

      const rows: StudentRow[] = profiles.map((profile) => {
        const moduleScores: Record<string, number | null> = {};
        for (const mod of MODULES) {
          moduleScores[mod] = latestByModule[profile.user_id]?.[mod]?.band_score ?? null;
        }

        const attempted = MODULES.filter((m) => moduleScores[m] !== null);
        let lowestModule: string | null = null;
        if (attempted.length > 0) {
          lowestModule = attempted.reduce((low, mod) =>
            (moduleScores[mod] ?? 99) < (moduleScores[low] ?? 99) ? mod : low
          );
        }

        const completedTaskEntries = completedByUser[profile.user_id] ?? [];
        const userProgressList = allByUser[profile.user_id] ?? [];

        // Last active: compare most recent module completion vs most recent study plan task
        const latestModuleAt = userProgressList[0]?.completed_at ?? null;
        const latestTaskAt = completedTaskEntries[0]?.completed_at ?? null;

        let lastActiveAt: string | null = null;
        let lastAction: string | null = null;

        if (latestModuleAt && latestTaskAt) {
          if (new Date(latestModuleAt) >= new Date(latestTaskAt)) {
            lastActiveAt = latestModuleAt;
            const mod = userProgressList[0].exam_type;
            const score = userProgressList[0].band_score;
            lastAction = score !== null
              ? `${MODULE_LABELS[mod] ?? mod} — Band ${score.toFixed(1)}`
              : `${MODULE_LABELS[mod] ?? mod} attempt`;
          } else {
            lastActiveAt = latestTaskAt;
            lastAction = `Study plan: ${completedTaskEntries[0].question_id}`;
          }
        } else if (latestModuleAt) {
          lastActiveAt = latestModuleAt;
          const mod = userProgressList[0].exam_type;
          const score = userProgressList[0].band_score;
          lastAction = score !== null
            ? `${MODULE_LABELS[mod] ?? mod} — Band ${score.toFixed(1)}`
            : `${MODULE_LABELS[mod] ?? mod} attempt`;
        } else if (latestTaskAt) {
          lastActiveAt = latestTaskAt;
          lastAction = `Study plan: ${completedTaskEntries[0].question_id}`;
        }

        return {
          user_id: profile.user_id,
          email: profile.email ?? "—",
          subscription_tier: profile.subscription_tier ?? "free",
          moduleScores,
          lowestModule,
          studyPlanCompleted: completedTaskEntries.length,
          rawProgress: userProgressList,
          completedTaskEntries,
          lastActiveAt,
          lastAction,
        };
      });

      // Sort by most recently active first
      rows.sort((a, b) => {
        if (!a.lastActiveAt && !b.lastActiveAt) return 0;
        if (!a.lastActiveAt) return 1;
        if (!b.lastActiveAt) return -1;
        return new Date(b.lastActiveAt).getTime() - new Date(a.lastActiveAt).getTime();
      });

      setStudents(rows);
    } catch (err) {
      console.error(err);
      toast({ title: "Error", description: "Failed to load student progress.", variant: "destructive" });
    } finally {
      setIsLoadingData(false);
    }
  };

  const filtered = students.filter((s) =>
    s.email.toLowerCase().includes(search.toLowerCase())
  );

  const tierBadge = (tier: string) => {
    if (tier === "premium" || tier === "elite")
      return <Badge variant="outline" className="bg-elite-gold/10 text-elite-gold border-elite-gold/30 text-xs">{tier}</Badge>;
    if (tier === "basic")
      return <Badge variant="outline" className="bg-accent/10 text-accent border-accent/30 text-xs">{tier}</Badge>;
    return <Badge variant="outline" className="text-xs text-muted-foreground">{tier}</Badge>;
  };

  if (isLoading || isCheckingAdmin || !user || !isAdmin) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={() => navigate("/admin")}>
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center">
              <BarChart2 className="w-6 h-6 text-accent" />
            </div>
            <div>
              <h1 className="text-2xl font-light">Student Progress</h1>
              <p className="text-sm text-muted-foreground">
                Sorted by most recently active — updates whenever a student completes a module or checks off a study plan task
              </p>
            </div>
          </div>
          <Button variant="outline" onClick={fetchData} disabled={isLoadingData}>
            <RefreshCw className={`w-4 h-4 mr-2 ${isLoadingData ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </div>

        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search by email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>

        <Card className="glass-card">
          <CardContent className="p-0">
            {isLoadingData ? (
              <div className="flex justify-center py-16">
                <Loader2 className="w-8 h-8 animate-spin text-accent" />
              </div>
            ) : filtered.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-16">No students found</p>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Student</TableHead>
                      <TableHead>Plan</TableHead>
                      <TableHead className="text-center">Writing</TableHead>
                      <TableHead className="text-center">Speaking</TableHead>
                      <TableHead className="text-center">Reading</TableHead>
                      <TableHead className="text-center">Listening</TableHead>
                      <TableHead className="text-center">Weakest</TableHead>
                      <TableHead className="text-center">Study Plan</TableHead>
                      <TableHead>Last Active</TableHead>
                      <TableHead></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filtered.map((student) => (
                      <TableRow
                        key={student.user_id}
                        className="cursor-pointer hover:bg-secondary/20"
                        onClick={() => setSelectedStudent(student)}
                      >
                        <TableCell className="text-sm font-medium max-w-[180px] truncate">
                          {student.email}
                        </TableCell>
                        <TableCell>{tierBadge(student.subscription_tier)}</TableCell>
                        {MODULES.map((mod) => (
                          <TableCell key={mod} className="text-center">
                            {student.moduleScores[mod] !== null ? (
                              <span className={`text-sm font-medium ${bandColor(student.moduleScores[mod])}`}>
                                {student.moduleScores[mod]?.toFixed(1)}
                              </span>
                            ) : (
                              <span className="text-xs text-muted-foreground">—</span>
                            )}
                          </TableCell>
                        ))}
                        <TableCell className="text-center">
                          {student.lowestModule ? (
                            <Badge variant="outline" className="bg-red-500/10 text-red-400 border-red-500/30 text-xs capitalize">
                              <TrendingDown className="w-3 h-3 mr-1" />
                              {student.lowestModule}
                            </Badge>
                          ) : (
                            <span className="text-xs text-muted-foreground">—</span>
                          )}
                        </TableCell>
                        <TableCell className="text-center">
                          {student.studyPlanCompleted > 0 ? (
                            <Badge variant="outline" className="bg-accent/10 text-accent border-accent/30 text-xs">
                              <CheckSquare className="w-3 h-3 mr-1" />
                              {student.studyPlanCompleted} tasks
                            </Badge>
                          ) : (
                            <span className="text-xs text-muted-foreground">Not started</span>
                          )}
                        </TableCell>
                        <TableCell className="min-w-[160px]">
                          {student.lastActiveAt ? (
                            <div className="space-y-0.5">
                              <div className="flex items-center gap-1 text-xs text-accent">
                                <Activity className="w-3 h-3" />
                                <span>{timeAgo(student.lastActiveAt)}</span>
                              </div>
                              <p className="text-xs text-muted-foreground truncate max-w-[150px]">
                                {student.lastAction}
                              </p>
                            </div>
                          ) : (
                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                              <Clock className="w-3 h-3" />
                              <span>No activity yet</span>
                            </div>
                          )}
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-xs text-accent"
                            onClick={(e) => { e.stopPropagation(); setSelectedStudent(student); }}
                          >
                            View
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Sheet open={!!selectedStudent} onOpenChange={(open) => !open && setSelectedStudent(null)}>
        <SheetContent
          className="overflow-y-auto p-0"
          style={{ width: sheetWidth, maxWidth: "none" }}
        >
          {/* Drag handle */}
          <div
            onMouseDown={(e) => {
              isDragging.current = true;
              dragStartX.current = e.clientX;
              dragStartWidth.current = sheetWidth;
              e.preventDefault();
            }}
            className="absolute left-0 top-0 bottom-0 w-1.5 cursor-col-resize hover:bg-accent/40 transition-colors z-10"
          />
          {selectedStudent && (
            <div className="p-6">
              <SheetHeader className="mb-6">
                <SheetTitle className="font-light text-lg">{selectedStudent.email}</SheetTitle>
                <div className="flex flex-wrap items-center gap-2 mt-1">
                  {tierBadge(selectedStudent.subscription_tier)}
                  <span className="text-xs text-muted-foreground">
                    {selectedStudent.studyPlanCompleted} study plan tasks completed
                  </span>
                  {selectedStudent.lastActiveAt && (
                    <span className="text-xs text-accent flex items-center gap-1">
                      <Activity className="w-3 h-3" />
                      Last active {timeAgo(selectedStudent.lastActiveAt)}
                    </span>
                  )}
                </div>
              </SheetHeader>

              <div className="space-y-6">
                {/* Module Score Cards */}
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide mb-3">
                    Latest Module Scores
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    {MODULES.map((mod) => {
                      const score = selectedStudent.moduleScores[mod];
                      const isLowest = selectedStudent.lowestModule === mod;
                      const entries = selectedStudent.rawProgress.filter((p) => p.exam_type === mod);
                      const latest = entries[0];
                      const errors = ((latest?.errors_log as ErrorEntry[] | null) ?? []).filter((e) => e.count > 0);
                      const criteriaScores = latest?.metadata?.criteriaScores as Record<string, number> | undefined;
                      return (
                        <Card key={mod} className={`glass-card border ${isLowest ? "border-red-500/30" : "border-border/30"}`}>
                          <CardContent className="p-3 space-y-2">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-1.5 text-xs text-muted-foreground capitalize">
                                {MODULE_ICONS[mod]}
                                {MODULE_LABELS[mod]}
                                {isLowest && <TrendingDown className="w-3 h-3 text-red-400 ml-1" />}
                              </div>
                              <Badge variant="outline" className={`text-xs ${bandBg(score)}`}>
                                {score !== null ? `Band ${score.toFixed(1)}` : "No data"}
                              </Badge>
                            </div>
                            {entries.length > 0 && (
                              <p className="text-xs text-muted-foreground">
                                {entries.length} attempt{entries.length !== 1 ? "s" : ""}
                                {latest?.completed_at && (
                                  <span className="ml-1 text-muted-foreground/60">
                                    · {timeAgo(latest.completed_at)}
                                  </span>
                                )}
                              </p>
                            )}
                            {errors.length > 0 && (
                              <div className="space-y-1 pt-1 border-t border-border/20">
                                <p className="text-xs text-muted-foreground font-medium">Error breakdown:</p>
                                {errors
                                  .slice()
                                  .sort((a, b) => b.count - a.count)
                                  .map((e, i) => (
                                    <div key={i} className="flex items-center justify-between text-xs">
                                      <span className="text-muted-foreground capitalize">{e.type.replace(/_/g, " ")}</span>
                                      <span className="text-red-400 font-medium">{e.count} wrong</span>
                                    </div>
                                  ))}
                              </div>
                            )}
                            {criteriaScores && (
                              <div className="space-y-1 pt-1 border-t border-border/20">
                                <p className="text-xs text-muted-foreground font-medium">Criteria:</p>
                                {Object.entries(criteriaScores)
                                  .filter(([, v]) => v !== null)
                                  .sort(([, a], [, b]) => (a as number) - (b as number))
                                  .map(([k, v]) => (
                                    <div key={k} className="flex items-center justify-between text-xs">
                                      <span className="text-muted-foreground capitalize">{k.replace(/([A-Z])/g, " $1")}</span>
                                      <span className={`font-medium ${(v as number) >= 7 ? "text-green-400" : (v as number) >= 6 ? "text-yellow-400" : "text-red-400"}`}>
                                        {v}
                                      </span>
                                    </div>
                                  ))}
                              </div>
                            )}
                            {latest?.feedback && !criteriaScores && errors.length === 0 && (
                              <p className="text-xs text-muted-foreground/70 truncate">{latest.feedback}</p>
                            )}
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                </div>

                {/* Score History */}
                {selectedStudent.rawProgress.length > 0 && (
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide mb-3">
                      Score History
                    </h3>
                    <div className="space-y-2 max-h-56 overflow-y-auto">
                      {selectedStudent.rawProgress.map((entry) => (
                        <div key={entry.id} className="flex items-center justify-between text-xs p-2 rounded-lg bg-secondary/20">
                          <div className="flex items-center gap-2">
                            {MODULE_ICONS[entry.exam_type]}
                            <span className="capitalize text-muted-foreground">{entry.exam_type}</span>
                          </div>
                          <div className="flex items-center gap-3">
                            {entry.correct_answers !== null && entry.total_questions !== null && (
                              <span className="text-muted-foreground">{entry.correct_answers}/{entry.total_questions}</span>
                            )}
                            <span className={`font-medium ${bandColor(entry.band_score)}`}>
                              {entry.band_score !== null ? `Band ${entry.band_score.toFixed(1)}` : "—"}
                            </span>
                            <span className="text-muted-foreground/60">{timeAgo(entry.completed_at)}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Writing Submissions — Coach Inbox */}
                {(() => {
                  const writingEntries = selectedStudent.rawProgress
                    .filter((p) => p.exam_type === "writing")
                    .slice(0, 10);
                  if (writingEntries.length === 0) return null;
                  return (
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide mb-3">
                        Writing Submissions ({writingEntries.length})
                      </h3>
                      <div className="space-y-2">
                        {writingEntries.map((entry) => {
                          const meta = entry.metadata as Record<string, unknown> ?? {};
                          const snippet = String(meta.essaySnippet ?? "");
                          const isExpanded = expandedEssayId === entry.id;
                          const noteKey = entry.id;
                          return (
                            <div key={entry.id} className="border border-border/30 rounded-lg overflow-hidden">
                              <button
                                onClick={() => setExpandedEssayId(isExpanded ? null : entry.id)}
                                className="w-full flex items-center justify-between p-3 text-left hover:bg-secondary/20 transition-colors"
                              >
                                <div className="flex items-center gap-2 min-w-0">
                                  <PenLine className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                                  <span className="text-xs text-muted-foreground capitalize">
                                    {String(meta.taskType ?? "Task")}
                                  </span>
                                  <span className="text-xs text-muted-foreground/60 truncate">
                                    {String(meta.questionTitle ?? "")}
                                  </span>
                                </div>
                                <div className="flex items-center gap-2 shrink-0 ml-2">
                                  <Badge variant="outline" className={`text-xs ${bandBg(entry.band_score)}`}>
                                    {entry.band_score ? `Band ${entry.band_score.toFixed(1)}` : "—"}
                                  </Badge>
                                  <span className="text-xs text-muted-foreground/60">{timeAgo(entry.completed_at)}</span>
                                  {isExpanded ? <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" /> : <ChevronRight className="w-3.5 h-3.5 text-muted-foreground" />}
                                </div>
                              </button>
                              {isExpanded && (
                                <div className="p-3 bg-secondary/10 border-t border-border/20 space-y-3">
                                  {snippet && (
                                    <div>
                                      <p className="text-xs text-muted-foreground mb-1">Essay excerpt:</p>
                                      <p className="text-xs text-foreground/80 leading-relaxed bg-secondary/30 rounded p-2">
                                        {snippet}{snippet.length >= 300 ? "…" : ""}
                                      </p>
                                    </div>
                                  )}
                                  <div>
                                    <p className="text-xs text-muted-foreground mb-1">Coach notes:</p>
                                    <Textarea
                                      placeholder="Add tutor feedback for this student..."
                                      value={coachNotes[noteKey] ?? ""}
                                      onChange={(e) => setCoachNotes((prev) => ({ ...prev, [noteKey]: e.target.value }))}
                                      className="text-xs min-h-[80px] resize-none"
                                    />
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      className="mt-2 text-xs h-7"
                                      disabled={savingNote === noteKey}
                                      onClick={async () => {
                                        setSavingNote(noteKey);
                                        await supabase
                                          .from("user_progress")
                                          .update({ coach_notes: coachNotes[noteKey] ?? null })
                                          .eq("id", entry.id);
                                        setSavingNote(null);
                                        toast({ description: "Coach notes saved." });
                                      }}
                                    >
                                      {savingNote === noteKey ? (
                                        <Loader2 className="w-3 h-3 animate-spin mr-1" />
                                      ) : (
                                        <Save className="w-3 h-3 mr-1" />
                                      )}
                                      Save
                                    </Button>
                                  </div>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })()}

                {/* Study Plan Checklist */}
                {selectedStudent.completedTaskEntries.length > 0 && (
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide mb-3">
                      Study Plan Checklist ({selectedStudent.studyPlanCompleted} completed)
                    </h3>
                    <div className="space-y-1.5 max-h-72 overflow-y-auto">
                      {selectedStudent.completedTaskEntries.map((entry) => {
                        const info = STUDY_TASK_LOOKUP[entry.question_id];
                        return (
                          <div key={entry.question_id} className="flex items-center justify-between text-xs p-2 rounded-lg bg-green-500/5 border border-green-500/10">
                            <div className="flex items-center gap-2 min-w-0">
                              <CheckSquare className="w-3.5 h-3.5 text-green-400 shrink-0" />
                              <div className="min-w-0">
                                <p className="text-foreground/85 truncate">{info?.label ?? entry.question_id}</p>
                                {info && (
                                  <p className="text-muted-foreground/60 text-[10px]">{info.tier} · Week {info.week}</p>
                                )}
                              </div>
                            </div>
                            <span className="text-muted-foreground/60 shrink-0 ml-2">{timeAgo(entry.completed_at)}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {selectedStudent.completedTaskEntries.length === 0 && selectedStudent.rawProgress.length === 0 && (
                  <div className="text-center py-8 text-sm text-muted-foreground">
                    <Square className="w-8 h-8 mx-auto mb-2 text-muted-foreground/30" />
                    This student has not started any modules or study plan tasks yet.
                  </div>
                )}
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </DashboardLayout>
  );
}
