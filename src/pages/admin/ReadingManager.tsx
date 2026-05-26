import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import {
  BookOpen, Loader2, ArrowLeft, Trash2,
  RefreshCw, FileText, BarChart3,
} from "lucide-react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { cn } from "@/lib/utils";

interface ReadingTest {
  id: string;
  title: string;
  difficulty: "easy" | "medium" | "hard";
  total_questions: number;
  duration_minutes: number;
  topic_tags: string[];
  is_active: boolean;
  created_at: string;
}

const DIFFICULTY_COLOR: Record<string, string> = {
  easy: "bg-green-500/10 text-green-500 border-green-500/30",
  medium: "bg-amber-500/10 text-amber-500 border-amber-500/30",
  hard: "bg-red-500/10 text-red-500 border-red-500/30",
};

export default function ReadingManager() {
  const { user, isAdmin, isCheckingAdmin } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [tests, setTests] = useState<ReadingTest[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    if (!isCheckingAdmin && !isAdmin) navigate("/dashboard");
  }, [isAdmin, isCheckingAdmin, navigate]);

  useEffect(() => {
    if (user && isAdmin) fetchTests();
  }, [user, isAdmin]);

  const fetchTests = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("reading_test_library")
      .select("id, title, difficulty, total_questions, duration_minutes, topic_tags, is_active, created_at")
      .order("created_at", { ascending: false });

    if (error) {
      toast({ title: "Error loading tests", description: error.message, variant: "destructive" });
    } else {
      setTests((data ?? []) as ReadingTest[]);
    }
    setLoading(false);
  };

  const toggleActive = async (test: ReadingTest) => {
    const { error } = await supabase
      .from("reading_test_library")
      .update({ is_active: !test.is_active })
      .eq("id", test.id);

    if (error) {
      toast({ title: "Update failed", description: error.message, variant: "destructive" });
    } else {
      setTests((prev) => prev.map((t) => t.id === test.id ? { ...t, is_active: !t.is_active } : t));
    }
  };

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    const { error } = await supabase.from("reading_test_library").delete().eq("id", id);
    if (error) {
      toast({ title: "Delete failed", description: error.message, variant: "destructive" });
    } else {
      setTests((prev) => prev.filter((t) => t.id !== id));
      toast({ title: "Test deleted" });
    }
    setDeletingId(null);
  };

  const counts = { easy: 0, medium: 0, hard: 0 };
  for (const t of tests) counts[t.difficulty] = (counts[t.difficulty] ?? 0) + 1;

  if (isCheckingAdmin) {
    return (
      <DashboardLayout>
        <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-accent" /></div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-5xl space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => navigate("/admin")}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div className="flex-1">
            <h1 className="text-2xl font-light flex items-center gap-2">
              <BookOpen className="w-6 h-6 text-accent" />
              Reading Manager
            </h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              Pre-generate IELTS Academic Reading tests with AI
            </p>
          </div>
          <Button variant="outline" size="icon" onClick={fetchTests} disabled={loading}>
            <RefreshCw className={cn("w-4 h-4", loading && "animate-spin")} />
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          {(["easy", "medium", "hard"] as const).map((d) => (
            <Card key={d} className="glass-card border-border/50">
              <CardContent className="p-4 flex items-center gap-3">
                <BarChart3 className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="text-2xl font-light">{counts[d]}</p>
                  <p className="text-xs text-muted-foreground capitalize">{d} tests</p>
                </div>
                <Badge variant="outline" className={cn("ml-auto text-xs capitalize", DIFFICULTY_COLOR[d])}>
                  {d}
                </Badge>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Tests List */}
        <Card className="glass-card border-border/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-medium flex items-center gap-2">
              <FileText className="w-4 h-4 text-accent" />
              Test Library
              <span className="text-sm font-normal text-muted-foreground ml-1">({tests.length} tests)</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex justify-center py-10">
                <Loader2 className="w-6 h-6 animate-spin text-accent" />
              </div>
            ) : tests.length === 0 ? (
              <div className="text-center py-10 text-muted-foreground">
                <FileText className="w-10 h-10 mx-auto mb-3 opacity-40" />
                <p className="text-sm">No tests yet. Generate your first one above.</p>
              </div>
            ) : (
              <div className="space-y-2">
                {tests.map((test) => (
                  <div
                    key={test.id}
                    className={cn(
                      "flex items-center gap-4 p-4 rounded-xl border transition-colors",
                      test.is_active
                        ? "border-border/50 bg-secondary/20"
                        : "border-border/30 bg-secondary/5 opacity-60"
                    )}
                  >
                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="text-sm font-medium truncate">{test.title}</p>
                        <Badge
                          variant="outline"
                          className={cn("text-[10px] capitalize shrink-0", DIFFICULTY_COLOR[test.difficulty])}
                        >
                          {test.difficulty}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="text-xs text-muted-foreground">{test.total_questions} questions</span>
                        <span className="text-xs text-muted-foreground">{test.duration_minutes} min</span>
                        {test.topic_tags?.slice(0, 3).map((tag) => (
                          <span key={tag} className="text-xs text-muted-foreground/60">{tag}</span>
                        ))}
                      </div>
                      <p className="text-xs text-muted-foreground/50 mt-0.5">
                        {new Date(test.created_at).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                      </p>
                    </div>

                    {/* Active toggle */}
                    <div className="flex items-center gap-1.5 shrink-0">
                      <span className="text-xs text-muted-foreground">{test.is_active ? "Active" : "Hidden"}</span>
                      <Switch
                        checked={test.is_active}
                        onCheckedChange={() => toggleActive(test)}
                      />
                    </div>

                    {/* Delete */}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="shrink-0 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                      disabled={deletingId === test.id}
                      onClick={() => handleDelete(test.id)}
                    >
                      {deletingId === test.id
                        ? <Loader2 className="w-4 h-4 animate-spin" />
                        : <Trash2 className="w-4 h-4" />
                      }
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
