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
import { 
  Plus, Save, Trash2, Loader2, Wand2, TestTube, ArrowLeft, 
  FileText, Eye, EyeOff, Sparkles, BookOpen, AlertCircle, Upload, X, Image
} from "lucide-react";

interface IeltsQuestion {
  id: string;
  task_type: string;
  title: string;
  question_prompt: string;
  question_image_url: string | null;
  model_answer_band9: string | null;
  ai_secret_context: string | null;
  target_keywords: string | null;
  difficulty: string;
  is_active: boolean;
}

export default function ContentManager() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  // isAdmin comes from useAuth hook

  const [questions, setQuestions] = useState<IeltsQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [testing, setTesting] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [testResult, setTestResult] = useState<string | null>(null);
  const [testEssay, setTestEssay] = useState("");
  const [selectedQuestion, setSelectedQuestion] = useState<IeltsQuestion | null>(null);
  const [formMode, setFormMode] = useState<"list" | "create" | "edit">("list");

  const [formData, setFormData] = useState({
    task_type: "Task 1 Academic",
    title: "",
    question_prompt: "",
    question_image_url: "",
    model_answer_band9: "",
    ai_secret_context: "",
    target_keywords: "",
    difficulty: "medium",
    is_active: true,
  });

  useEffect(() => {
    if (!isAdmin) {
      navigate("/dashboard");
      return;
    }
    fetchQuestions();
  }, [isAdmin, navigate]);

  const fetchQuestions = async () => {
    try {
      const { data, error } = await supabase
        .from("ielts_library")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setQuestions(data || []);
    } catch (error) {
      console.error("Error fetching questions:", error);
      toast({
        title: "Error",
        description: "Failed to load questions",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateModelAnswer = async () => {
    if (!formData.question_prompt) {
      toast({
        title: "Missing prompt",
        description: "Please enter the question prompt first",
        variant: "destructive",
      });
      return;
    }

    setGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke("ai-analyze", {
        body: {
          type: "generate-model",
          taskType: formData.task_type,
          prompt: formData.question_prompt,
        },
      });

      if (error) throw error;

      setFormData(prev => ({
        ...prev,
        model_answer_band9: data.modelAnswer || data.rawFeedback || "",
      }));

      toast({
        title: "Model Answer Generated",
        description: "You can now edit and refine the generated answer",
      });
    } catch (error) {
      console.error("Generation error:", error);
      toast({
        title: "Generation failed",
        description: "Please try again",
        variant: "destructive",
      });
    } finally {
      setGenerating(false);
    }
  };

  const handleTestAILogic = async () => {
    if (!testEssay || !formData.question_prompt) {
      toast({
        title: "Missing data",
        description: "Please enter a test essay and question prompt",
        variant: "destructive",
      });
      return;
    }

    setTesting(true);
    setTestResult(null);
    try {
      const { data, error } = await supabase.functions.invoke("ai-analyze", {
        body: {
          type: "writing",
          content: testEssay,
          taskType: formData.task_type.startsWith("Task 1") ? "Task 1" : "Task 2",
          questionId: selectedQuestion?.id,
          secretContext: formData.ai_secret_context,
          modelAnswer: formData.model_answer_band9,
          targetKeywords: formData.target_keywords,
        },
      });

      if (error) throw error;
      setTestResult(JSON.stringify(data, null, 2));
    } catch (error) {
      console.error("Test error:", error);
      toast({
        title: "Test failed",
        description: "Please try again",
        variant: "destructive",
      });
    } finally {
      setTesting(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid file type",
        description: "Please upload an image file",
        variant: "destructive",
      });
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please upload an image smaller than 5MB",
        variant: "destructive",
      });
      return;
    }

    setUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `questions/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('question-images')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('question-images')
        .getPublicUrl(filePath);

      setFormData(prev => ({ ...prev, question_image_url: publicUrl }));

      toast({
        title: "Image uploaded",
        description: "The image has been uploaded successfully",
      });
    } catch (error) {
      console.error("Upload error:", error);
      toast({
        title: "Upload failed",
        description: "Please try again",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveImage = () => {
    setFormData(prev => ({ ...prev, question_image_url: "" }));
  };

  const handleSave = async () => {
    if (!formData.title || !formData.question_prompt) {
      toast({
        title: "Missing required fields",
        description: "Please fill in title and question prompt",
        variant: "destructive",
      });
      return;
    }

    setSaving(true);
    try {
      const payload = {
        task_type: formData.task_type,
        title: formData.title,
        question_prompt: formData.question_prompt,
        question_image_url: formData.question_image_url || null,
        model_answer_band9: formData.model_answer_band9 || null,
        ai_secret_context: formData.ai_secret_context || null,
        target_keywords: formData.target_keywords || null,
        difficulty: formData.difficulty,
        is_active: formData.is_active,
      };

      if (formMode === "edit" && selectedQuestion) {
        const { error } = await supabase
          .from("ielts_library")
          .update(payload)
          .eq("id", selectedQuestion.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("ielts_library")
          .insert([{ ...payload, created_by: user?.id }]);
        if (error) throw error;
      }

      toast({
        title: formMode === "edit" ? "Updated" : "Created",
        description: `Question "${formData.title}" saved successfully`,
      });

      resetForm();
      fetchQuestions();
    } catch (error) {
      console.error("Save error:", error);
      toast({
        title: "Save failed",
        description: "Please try again",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this question?")) return;

    try {
      const { error } = await supabase
        .from("ielts_library")
        .delete()
        .eq("id", id);
      if (error) throw error;

      toast({ title: "Deleted", description: "Question removed" });
      fetchQuestions();
    } catch (error) {
      console.error("Delete error:", error);
      toast({
        title: "Delete failed",
        description: "Please try again",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (question: IeltsQuestion) => {
    setSelectedQuestion(question);
    setFormData({
      task_type: question.task_type,
      title: question.title,
      question_prompt: question.question_prompt,
      question_image_url: question.question_image_url || "",
      model_answer_band9: question.model_answer_band9 || "",
      ai_secret_context: question.ai_secret_context || "",
      target_keywords: question.target_keywords || "",
      difficulty: question.difficulty,
      is_active: question.is_active,
    });
    setFormMode("edit");
    setTestResult(null);
    setTestEssay("");
  };

  const resetForm = () => {
    setFormData({
      task_type: "Task 1 Academic",
      title: "",
      question_prompt: "",
      question_image_url: "",
      model_answer_band9: "",
      ai_secret_context: "",
      target_keywords: "",
      difficulty: "medium",
      is_active: true,
    });
    setSelectedQuestion(null);
    setFormMode("list");
    setTestResult(null);
    setTestEssay("");
  };

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={() => navigate("/admin")}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <div>
              <h1 className="text-2xl font-light">IELTS Content Manager</h1>
              <p className="text-sm text-muted-foreground">Train the AI for specific questions</p>
            </div>
          </div>
          {formMode === "list" && (
            <Button onClick={() => setFormMode("create")} className="gap-2">
              <Plus className="w-4 h-4" />
              Add Question
            </Button>
          )}
        </div>

        {/* List View */}
        {formMode === "list" && (
          <div className="space-y-4">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
              </div>
            ) : questions.length === 0 ? (
              <Card className="border-dashed">
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <BookOpen className="w-12 h-12 text-muted-foreground mb-4" />
                  <p className="text-muted-foreground mb-4">No questions in the library yet</p>
                  <Button onClick={() => setFormMode("create")}>
                    <Plus className="w-4 h-4 mr-2" />
                    Create First Question
                  </Button>
                </CardContent>
              </Card>
            ) : (
              questions.map((q) => (
                <Card key={q.id} className="hover:border-accent/50 transition-colors">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className={`text-xs px-2 py-0.5 rounded ${
                            q.task_type === "Task 2" 
                              ? "bg-purple-500/20 text-purple-400"
                              : "bg-blue-500/20 text-blue-400"
                          }`}>
                            {q.task_type}
                          </span>
                          <span className={`text-xs px-2 py-0.5 rounded ${
                            q.difficulty === "hard" 
                              ? "bg-red-500/20 text-red-400"
                              : q.difficulty === "easy"
                              ? "bg-green-500/20 text-green-400"
                              : "bg-yellow-500/20 text-yellow-400"
                          }`}>
                            {q.difficulty}
                          </span>
                          {!q.is_active && (
                            <span className="text-xs px-2 py-0.5 rounded bg-muted text-muted-foreground">
                              Inactive
                            </span>
                          )}
                        </div>
                        <h3 className="font-medium text-foreground mb-1">{q.title}</h3>
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {q.question_prompt}
                        </p>
                        <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                          {q.model_answer_band9 && (
                            <span className="flex items-center gap-1">
                              <Sparkles className="w-3 h-3" />
                              Has Model Answer
                            </span>
                          )}
                          {q.ai_secret_context && (
                            <span className="flex items-center gap-1">
                              <EyeOff className="w-3 h-3" />
                              Has Secret Context
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2 ml-4">
                        <Button variant="outline" size="sm" onClick={() => handleEdit(q)}>
                          Edit
                        </Button>
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
              ))
            )}
          </div>
        )}

        {/* Create/Edit Form */}
        {(formMode === "create" || formMode === "edit") && (
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <Button variant="ghost" onClick={resetForm}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Cancel
              </Button>
              <h2 className="text-xl font-light">
                {formMode === "edit" ? "Edit Question" : "Create New Question"}
              </h2>
            </div>

            {/* Glassmorphic Form */}
            <Card className="backdrop-blur-xl bg-card/50 border-border/50">
              <CardHeader>
                <CardTitle className="text-lg font-light flex items-center gap-2">
                  <FileText className="w-5 h-5 text-accent" />
                  Question Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <Label className="text-sm">Task Type</Label>
                    <Select 
                      value={formData.task_type} 
                      onValueChange={(v) => setFormData(prev => ({ ...prev, task_type: v }))}
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Task 1 Academic">Task 1 Academic</SelectItem>
                        <SelectItem value="Task 1 General">Task 1 General</SelectItem>
                        <SelectItem value="Task 2">Task 2</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="text-sm">Difficulty</Label>
                    <Select 
                      value={formData.difficulty} 
                      onValueChange={(v) => setFormData(prev => ({ ...prev, difficulty: v }))}
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
                  <div className="flex items-center gap-3 pt-6">
                    <Switch
                      checked={formData.is_active}
                      onCheckedChange={(v) => setFormData(prev => ({ ...prev, is_active: v }))}
                    />
                    <Label className="text-sm">Active (visible to students)</Label>
                  </div>
                </div>

                <div>
                  <Label className="text-sm">Title</Label>
                  <Input
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="e.g., Housing Tenure in England and Wales"
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label className="text-sm">Question Prompt</Label>
                  <Textarea
                    value={formData.question_prompt}
                    onChange={(e) => setFormData(prev => ({ ...prev, question_prompt: e.target.value }))}
                    placeholder="The chart below shows..."
                    className="mt-1 h-32"
                  />
                </div>

                <div>
                  <Label className="text-sm">Question Image (optional - for Task 1 diagrams/charts)</Label>
                  <div className="mt-2 space-y-3">
                    {formData.question_image_url ? (
                      <div className="relative inline-block">
                        <img 
                          src={formData.question_image_url} 
                          alt="Question diagram" 
                          className="max-h-48 rounded-lg border border-border"
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="icon"
                          className="absolute -top-2 -right-2 h-6 w-6"
                          onClick={handleRemoveImage}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    ) : (
                      <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-border rounded-lg cursor-pointer hover:border-accent/50 transition-colors bg-muted/30">
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          {uploading ? (
                            <Loader2 className="w-8 h-8 text-muted-foreground animate-spin" />
                          ) : (
                            <>
                              <Image className="w-8 h-8 text-muted-foreground mb-2" />
                              <p className="text-sm text-muted-foreground">
                                Click to upload diagram/chart
                              </p>
                              <p className="text-xs text-muted-foreground/70 mt-1">
                                PNG, JPG up to 5MB
                              </p>
                            </>
                          )}
                        </div>
                        <input
                          type="file"
                          className="hidden"
                          accept="image/*"
                          onChange={handleImageUpload}
                          disabled={uploading}
                        />
                      </label>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Model Answer Section */}
            <Card className="backdrop-blur-xl bg-card/50 border-border/50">
              <CardHeader>
                <CardTitle className="text-lg font-light flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-accent" />
                  Band 9 Model Answer
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    onClick={handleGenerateModelAnswer}
                    disabled={generating || !formData.question_prompt}
                    className="gap-2"
                  >
                    {generating ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Wand2 className="w-4 h-4" />
                    )}
                    Generate Model Answer
                  </Button>
                  <span className="text-xs text-muted-foreground">
                    AI will draft a Band 9 response for you to edit
                  </span>
                </div>
                <Textarea
                  value={formData.model_answer_band9}
                  onChange={(e) => setFormData(prev => ({ ...prev, model_answer_band9: e.target.value }))}
                  placeholder="Enter or generate a Band 9 model answer..."
                  className="h-64"
                />
              </CardContent>
            </Card>

            {/* Secret Context Section */}
            <Card className="backdrop-blur-xl bg-card/50 border-accent/30 border">
              <CardHeader>
                <CardTitle className="text-lg font-light flex items-center gap-2">
                  <EyeOff className="w-5 h-5 text-accent" />
                  AI Secret Context
                  <span className="text-xs text-muted-foreground font-normal ml-2">
                    (Hidden instructions for the AI)
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-3 bg-accent/5 rounded-lg border border-accent/20">
                  <p className="text-xs text-muted-foreground flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" />
                    These instructions are injected into the AI's grading prompt but hidden from students.
                    Use this to specify key data points they must mention, penalize specific mistakes, etc.
                  </p>
                </div>
                <Textarea
                  value={formData.ai_secret_context}
                  onChange={(e) => setFormData(prev => ({ ...prev, ai_secret_context: e.target.value }))}
                  placeholder="e.g., 'Ensure the student mentions the 10% drop in 2010; if not, penalize Task Achievement. The crossover point must be identified.'"
                  className="h-32"
                />
                <div>
                  <Label className="text-sm">Target Keywords (comma-separated)</Label>
                  <Input
                    value={formData.target_keywords}
                    onChange={(e) => setFormData(prev => ({ ...prev, target_keywords: e.target.value }))}
                    placeholder="e.g., plummeted, soared, gradual fluctuation, peaked"
                    className="mt-1"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    High-level vocabulary to reward when used
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Test AI Logic Section */}
            <Card className="backdrop-blur-xl bg-card/50 border-border/50">
              <CardHeader>
                <CardTitle className="text-lg font-light flex items-center gap-2">
                  <TestTube className="w-5 h-5 text-accent" />
                  Test AI Logic
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Enter a sample essay to test how the AI will grade it with your current Secret Context.
                </p>
                <Textarea
                  value={testEssay}
                  onChange={(e) => setTestEssay(e.target.value)}
                  placeholder="Paste a sample essay here to test..."
                  className="h-40"
                />
                <Button
                  variant="outline"
                  onClick={handleTestAILogic}
                  disabled={testing || !testEssay || !formData.question_prompt}
                  className="gap-2"
                >
                  {testing ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <TestTube className="w-4 h-4" />
                  )}
                  Test AI Grading
                </Button>
                {testResult && (
                  <div className="p-4 bg-secondary/30 rounded-lg border border-border/30 overflow-auto max-h-96">
                    <pre className="text-xs text-foreground/80 whitespace-pre-wrap">
                      {testResult}
                    </pre>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Save Actions */}
            <div className="flex items-center justify-end gap-4">
              <Button variant="ghost" onClick={resetForm}>
                Cancel
              </Button>
              <Button onClick={handleSave} disabled={saving} className="gap-2">
                {saving ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Save className="w-4 h-4" />
                )}
                {formMode === "edit" ? "Update Question" : "Create Question"}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
