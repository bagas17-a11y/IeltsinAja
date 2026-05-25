import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { Plus, Trash2, Loader2, ArrowLeft, Mic, X } from "lucide-react";
import { Json } from "@/integrations/supabase/types";

interface SpeakingQuestion {
  id: string;
  part: number;
  topic: string;
  question: string;
  follow_up_questions: string[];
  prep_time: string | null;
  speak_time: string | null;
  difficulty: string;
  is_active: boolean;
  created_at: string;
}

type ActiveTab = "part1" | "part2" | "part3";

const PART_LABELS: Record<ActiveTab, string> = {
  part1: "Part 1 — Introduction",
  part2: "Part 2 — Cue Card",
  part3: "Part 3 — Discussion",
};

const emptyForm = (part: number) => ({
  part,
  topic: "",
  question: "",
  follow_up_questions: [""],
  prep_time: part === 2 ? "1 minute" : "",
  speak_time: part === 2 ? "1-2 minutes" : "",
  difficulty: "medium",
  is_active: true,
});

export default function SpeakingManager() {
  const { user, isAdmin, isCheckingAdmin } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [questions, setQuestions] = useState<SpeakingQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<ActiveTab>("part1");
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm(1));

  useEffect(() => {
    if (isCheckingAdmin) return;
    if (!isAdmin) {
      navigate("/dashboard");
      return;
    }
    fetchQuestions();
  }, [isAdmin, isCheckingAdmin, navigate]);

  const fetchQuestions = async () => {
    try {
      const { data, error } = await supabase
        .from("speaking_library")
        .select("*")
        .order("part", { ascending: true })
        .order("topic", { ascending: true });

      if (error) throw error;

      setQuestions(
        (data || []).map((q) => ({
          ...q,
          follow_up_questions: Array.isArray(q.follow_up_questions)
            ? (q.follow_up_questions as string[])
            : [],
        }))
      );
    } catch (err) {
      console.error(err);
      toast({ title: "Error", description: "Failed to load questions", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (tab: ActiveTab) => {
    setActiveTab(tab);
    setShowForm(false);
    const part = parseInt(tab.slice(-1));
    setForm(emptyForm(part));
  };

  const handleAddFollowUp = () => {
    setForm((f) => ({ ...f, follow_up_questions: [...f.follow_up_questions, ""] }));
  };

  const handleFollowUpChange = (idx: number, value: string) => {
    setForm((f) => {
      const updated = [...f.follow_up_questions];
      updated[idx] = value;
      return { ...f, follow_up_questions: updated };
    });
  };

  const handleRemoveFollowUp = (idx: number) => {
    setForm((f) => ({
      ...f,
      follow_up_questions: f.follow_up_questions.filter((_, i) => i !== idx),
    }));
  };

  const handleSave = async () => {
    if (!form.topic.trim() || !form.question.trim()) {
      toast({ title: "Missing fields", description: "Topic and question are required", variant: "destructive" });
      return;
    }

    setSaving(true);
    try {
      const payload = {
        part: form.part,
        topic: form.topic.trim(),
        question: form.question.trim(),
        follow_up_questions: form.follow_up_questions.filter((q) => q.trim()) as unknown as Json,
        prep_time: form.prep_time || null,
        speak_time: form.speak_time || null,
        difficulty: form.difficulty,
        is_active: form.is_active,
        created_by: user?.id,
      };

      const { error } = await supabase.from("speaking_library").insert([payload]);
      if (error) throw error;

      toast({ title: "Saved", description: "Speaking question added" });
      const part = parseInt(activeTab.slice(-1));
      setForm(emptyForm(part));
      setShowForm(false);
      fetchQuestions();
    } catch (err) {
      console.error(err);
      toast({ title: "Save failed", description: "Please try again", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this question?")) return;
    try {
      const { error } = await supabase.from("speaking_library").delete().eq("id", id);
      if (error) throw error;
      toast({ title: "Deleted" });
      fetchQuestions();
    } catch (err) {
      console.error(err);
      toast({ title: "Delete failed", variant: "destructive" });
    }
  };

  const handleToggleActive = async (id: string, current: boolean) => {
    try {
      const { error } = await supabase
        .from("speaking_library")
        .update({ is_active: !current })
        .eq("id", id);
      if (error) throw error;
      setQuestions((qs) => qs.map((q) => (q.id === id ? { ...q, is_active: !current } : q)));
    } catch (err) {
      console.error(err);
      toast({ title: "Update failed", variant: "destructive" });
    }
  };

  const currentPartNum = parseInt(activeTab.slice(-1));
  const filtered = questions.filter((q) => q.part === currentPartNum);

  if (isCheckingAdmin || !isAdmin) return null;

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={() => navigate("/admin")}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <div>
              <h1 className="text-2xl font-light">Speaking Manager</h1>
              <p className="text-sm text-muted-foreground">Manage IELTS speaking question bank</p>
            </div>
          </div>
          {!showForm && (
            <Button
              onClick={() => {
                setForm(emptyForm(currentPartNum));
                setShowForm(true);
              }}
              className="gap-2"
            >
              <Plus className="w-4 h-4" />
              Add Question
            </Button>
          )}
        </div>

        {/* Part Tabs */}
        <div className="flex gap-2 mb-6">
          {(["part1", "part2", "part3"] as ActiveTab[]).map((tab) => (
            <Button
              key={tab}
              variant={activeTab === tab ? "default" : "outline"}
              onClick={() => handleTabChange(tab)}
              className="flex-1"
            >
              {PART_LABELS[tab]}
            </Button>
          ))}
        </div>

        {/* Add Form */}
        {showForm && (
          <Card className="backdrop-blur-xl bg-card/50 border-border/50 mb-6">
            <CardHeader>
              <CardTitle className="text-lg font-light flex items-center gap-2">
                <Mic className="w-5 h-5 text-accent" />
                New {PART_LABELS[activeTab]} Question
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm">Topic</Label>
                  <Input
                    value={form.topic}
                    onChange={(e) => setForm((f) => ({ ...f, topic: e.target.value }))}
                    placeholder={
                      currentPartNum === 1
                        ? "e.g., Hometown"
                        : currentPartNum === 2
                        ? "e.g., A memorable trip"
                        : "e.g., Travel & Tourism"
                    }
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label className="text-sm">Difficulty</Label>
                  <Select
                    value={form.difficulty}
                    onValueChange={(v) => setForm((f) => ({ ...f, difficulty: v }))}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="easy">Easy</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="hard">Hard</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label className="text-sm">
                  {currentPartNum === 1
                    ? "Question"
                    : currentPartNum === 2
                    ? "Cue Card Text (full prompt)"
                    : "Theme / Topic Description"}
                </Label>
                <Textarea
                  value={form.question}
                  onChange={(e) => setForm((f) => ({ ...f, question: e.target.value }))}
                  placeholder={
                    currentPartNum === 1
                      ? "Where do you come from? Can you describe your hometown?"
                      : currentPartNum === 2
                      ? "Describe a memorable trip you took.\n\nYou should say:\n• Where you went\n• Who you went with\n• What you did there\n\nAnd explain why it was memorable."
                      : "Travel & Tourism"
                  }
                  className="mt-1 min-h-[120px]"
                />
              </div>

              {currentPartNum === 2 && (
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm">Prep Time</Label>
                    <Input
                      value={form.prep_time || ""}
                      onChange={(e) => setForm((f) => ({ ...f, prep_time: e.target.value }))}
                      placeholder="1 minute"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label className="text-sm">Speak Time</Label>
                    <Input
                      value={form.speak_time || ""}
                      onChange={(e) => setForm((f) => ({ ...f, speak_time: e.target.value }))}
                      placeholder="1-2 minutes"
                      className="mt-1"
                    />
                  </div>
                </div>
              )}

              {/* Follow-up / rounding-off / discussion questions */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <Label className="text-sm">
                    {currentPartNum === 1
                      ? "Follow-up Questions (optional)"
                      : currentPartNum === 2
                      ? "Rounding-off Questions"
                      : "Discussion Questions"}
                  </Label>
                  <Button variant="ghost" size="sm" onClick={handleAddFollowUp} className="h-6 text-xs">
                    <Plus className="w-3 h-3 mr-1" />
                    Add
                  </Button>
                </div>
                <div className="space-y-2">
                  {form.follow_up_questions.map((q, idx) => (
                    <div key={idx} className="flex gap-2">
                      <Input
                        value={q}
                        onChange={(e) => handleFollowUpChange(idx, e.target.value)}
                        placeholder={
                          currentPartNum === 3
                            ? `Discussion question ${idx + 1}`
                            : `Follow-up ${idx + 1}`
                        }
                      />
                      {form.follow_up_questions.length > 1 && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveFollowUp(idx)}
                          className="shrink-0 text-muted-foreground hover:text-destructive"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Switch
                  checked={form.is_active}
                  onCheckedChange={(v) => setForm((f) => ({ ...f, is_active: v }))}
                />
                <Label>Active (visible to students)</Label>
              </div>

              <div className="flex gap-3 justify-end pt-2">
                <Button variant="outline" onClick={() => setShowForm(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSave} disabled={saving} className="gap-2">
                  {saving && <Loader2 className="w-4 h-4 animate-spin" />}
                  Save Question
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Question List */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
          </div>
        ) : filtered.length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Mic className="w-12 h-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground mb-4">No {PART_LABELS[activeTab]} questions yet</p>
              <Button
                onClick={() => {
                  setForm(emptyForm(currentPartNum));
                  setShowForm(true);
                }}
              >
                <Plus className="w-4 h-4 mr-2" />
                Add First Question
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">
              {filtered.length} question{filtered.length !== 1 ? "s" : ""} •{" "}
              {filtered.filter((q) => q.is_active).length} active
            </p>
            {filtered.map((q) => (
              <Card
                key={q.id}
                className={`transition-colors ${!q.is_active ? "opacity-50" : "hover:border-accent/30"}`}
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2 flex-wrap">
                        <span className="text-xs font-medium px-2 py-0.5 rounded bg-primary/10 text-primary">
                          {q.topic}
                        </span>
                        <span
                          className={`text-xs px-2 py-0.5 rounded ${
                            q.difficulty === "hard"
                              ? "bg-red-500/20 text-red-400"
                              : q.difficulty === "easy"
                              ? "bg-green-500/20 text-green-400"
                              : "bg-yellow-500/20 text-yellow-400"
                          }`}
                        >
                          {q.difficulty}
                        </span>
                        {!q.is_active && (
                          <span className="text-xs px-2 py-0.5 rounded bg-muted text-muted-foreground">
                            Inactive
                          </span>
                        )}
                        {currentPartNum === 2 && q.prep_time && (
                          <span className="text-xs text-muted-foreground">
                            Prep: {q.prep_time} | Speak: {q.speak_time}
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-foreground/90 whitespace-pre-line line-clamp-3">
                        {q.question}
                      </p>
                      {q.follow_up_questions.length > 0 && (
                        <div className="mt-2 space-y-0.5">
                          {q.follow_up_questions.slice(0, 3).map((fq, i) => (
                            <p key={i} className="text-xs text-muted-foreground">
                              • {fq}
                            </p>
                          ))}
                          {q.follow_up_questions.length > 3 && (
                            <p className="text-xs text-muted-foreground">
                              +{q.follow_up_questions.length - 3} more
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <Switch
                        checked={q.is_active}
                        onCheckedChange={() => handleToggleActive(q.id, q.is_active)}
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-destructive hover:text-destructive"
                        onClick={() => handleDelete(q.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
