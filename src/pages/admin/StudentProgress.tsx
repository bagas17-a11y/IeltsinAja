import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface StudentRow {
  user_id: string;
  email: string;
  subscription_tier: string;
  moduleScores: Record<string, number | null>;
  lowestModule: string | null;
  studyPlanCompleted: number;
  studyPlanTotal: number;
  rawProgress: ProgressEntry[];
  completedTasks: string[];
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

export default function StudentProgress() {
  const navigate = useNavigate();
  const { user, isLoading, isAdmin, isCheckingAdmin } = useAuth();
  const { toast } = useToast();

  const [students, setStudents] = useState<StudentRow[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedStudent, setSelectedStudent] = useState<StudentRow | null>(null);

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
        supabase.from("profiles").select("user_id, email, subscription_tier").order("created_at", { ascending: false }),
        supabase.from("user_progress").select("id, user_id, exam_type, band_score, score, total_questions, correct_answers, completed_at, errors_log, feedback").order("completed_at", { ascending: false }),
        supabase.from("user_completed_questions").select("user_id, question_id").eq("module", "study_plan"),
      ]);

      if (!profiles) return;

      const completedByUser: Record<string, string[]> = {};
      for (const r of completedRows ?? []) {
        if (!completedByUser[r.user_id]) completedByUser[r.user_id] = [];
        completedByUser[r.user_id].push(r.question_id);
      }

      const latestByModule: Record<string, Record<string, ProgressEntry>> = {};
      const allByUser: Record<string, ProgressEntry[]> = {};
      for (const p of progressRows ?? []) {
        if (!MODULES.includes(p.exam_type)) continue;
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

        const completedTasks = completedByUser[profile.user_id] ?? [];

        return {
          user_id: profile.user_id,
          email: profile.email ?? "—",
          subscription_tier: profile.subscription_tier ?? "free",
          moduleScores,
          lowestModule,
          studyPlanCompleted: completedTasks.length,
          studyPlanTotal: 0,
          rawProgress: allByUser[profile.user_id] ?? [],
          completedTasks,
        };
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
    if (tier === "premium" || tier === "elite") return <Badge variant="outline" className="bg-elite-gold/10 text-elite-gold border-elite-gold/30 text-xs">{tier}</Badge>;
    if (tier === "basic") return <Badge variant="outline" className="bg-accent/10 text-accent border-accent/30 text-xs">{tier}</Badge>;
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
              <p className="text-sm text-muted-foreground">Module scores, weak areas, and study plan completion</p>
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
                      <TableHead></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filtered.map((student) => (
                      <TableRow key={student.user_id} className="cursor-pointer hover:bg-secondary/20" onClick={() => setSelectedStudent(student)}>
                        <TableCell className="text-sm font-medium max-w-[200px] truncate">{student.email}</TableCell>
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
                        <TableCell>
                          <Button variant="ghost" size="sm" className="text-xs text-accent" onClick={(e) => { e.stopPropagation(); setSelectedStudent(student); }}>
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
        <SheetContent className="w-full max-w-xl overflow-y-auto">
          {selectedStudent && (
            <>
              <SheetHeader className="mb-6">
                <SheetTitle className="font-light text-lg">{selectedStudent.email}</SheetTitle>
                <div className="flex items-center gap-2 mt-1">
                  {tierBadge(selectedStudent.subscription_tier)}
                  <span className="text-xs text-muted-foreground">{selectedStudent.studyPlanCompleted} study plan tasks completed</span>
                </div>
              </SheetHeader>

              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide mb-3">Latest Module Scores</h3>
                  <div className="grid grid-cols-2 gap-3">
                    {MODULES.map((mod) => {
                      const score = selectedStudent.moduleScores[mod];
                      const isLowest = selectedStudent.lowestModule === mod;
                      const entries = selectedStudent.rawProgress.filter((p) => p.exam_type === mod);
                      const latest = entries[0];
                      const errors = (latest?.errors_log as ErrorEntry[] | null) ?? [];
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
                              <p className="text-xs text-muted-foreground">{entries.length} attempt{entries.length !== 1 ? "s" : ""}</p>
                            )}
                            {errors.length > 0 && (
                              <div className="space-y-1 pt-1 border-t border-border/20">
                                <p className="text-xs text-muted-foreground">Error breakdown (latest):</p>
                                {errors.map((e, i) => (
                                  <div key={i} className="flex items-center justify-between text-xs">
                                    <span className="text-muted-foreground capitalize">{e.type.replace(/_/g, " ")}</span>
                                    <span className="text-red-400 font-medium">{e.count} wrong</span>
                                  </div>
                                ))}
                              </div>
                            )}
                            {latest?.feedback && (
                              <p className="text-xs text-muted-foreground/70 truncate">{latest.feedback}</p>
                            )}
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                </div>

                {selectedStudent.rawProgress.length > 0 && (
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide mb-3">Score History</h3>
                    <div className="space-y-2 max-h-64 overflow-y-auto">
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
                            <span className="text-muted-foreground/60">
                              {new Date(entry.completed_at).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {selectedStudent.completedTasks.length > 0 && (
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide mb-3">
                      Study Plan Checklist ({selectedStudent.studyPlanCompleted} completed)
                    </h3>
                    <div className="space-y-1.5 max-h-80 overflow-y-auto">
                      {selectedStudent.completedTasks.map((taskId) => (
                        <div key={taskId} className="flex items-center gap-2 text-xs p-2 rounded-lg bg-green-500/5 border border-green-500/10">
                          <CheckSquare className="w-3.5 h-3.5 text-green-400 shrink-0" />
                          <span className="text-muted-foreground font-mono">{taskId}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {selectedStudent.completedTasks.length === 0 && selectedStudent.rawProgress.length === 0 && (
                  <div className="text-center py-8 text-sm text-muted-foreground">
                    <Square className="w-8 h-8 mx-auto mb-2 text-muted-foreground/30" />
                    This student has not started any modules or study plan tasks yet.
                  </div>
                )}
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </DashboardLayout>
  );
}
