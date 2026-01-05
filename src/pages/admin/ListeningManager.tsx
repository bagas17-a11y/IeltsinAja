import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useAuth, isSuperAdmin } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { Json } from "@/integrations/supabase/types";
import { 
  Plus, Save, Trash2, Loader2, ArrowLeft, 
  Headphones, Eye, EyeOff, Upload, X, Music, HelpCircle
} from "lucide-react";

interface Question {
  id: number;
  type: "gap-fill" | "multiple-choice";
  text: string;
  options?: string[];
}

interface ListeningTest {
  id: string;
  title: string;
  audio_url: string;
  transcript: string | null;
  questions: Question[];
  answer_key: Record<string, string>;
  difficulty: string;
  duration_minutes: number;
  is_active: boolean;
  ai_secret_context: string | null;
}

export default function ListeningManager() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const isAdmin = isSuperAdmin(user?.email);
  const audioInputRef = useRef<HTMLInputElement>(null);

  const [tests, setTests] = useState<ListeningTest[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [formMode, setFormMode] = useState<"list" | "create" | "edit">("list");
  const [selectedTest, setSelectedTest] = useState<ListeningTest | null>(null);

  const [formData, setFormData] = useState({
    title: "",
    audio_url: "",
    transcript: "",
    difficulty: "medium",
    duration_minutes: 30,
    is_active: true,
    ai_secret_context: "If the answer is a number, allow both digits and words (e.g., 7 or seven). Ignore capitalization differences.",
  });

  const [questions, setQuestions] = useState<Question[]>([]);
  const [answerKey, setAnswerKey] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!isAdmin) {
      navigate("/dashboard");
      return;
    }
    fetchTests();
  }, [isAdmin, navigate]);

  const fetchTests = async () => {
    try {
      const { data, error } = await supabase
        .from("listening_library")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      
      const formattedTests = (data || []).map(test => ({
        ...test,
        questions: test.questions as unknown as Question[],
        answer_key: test.answer_key as unknown as Record<string, string>,
      }));
      
      setTests(formattedTests);
    } catch (error) {
      console.error("Error fetching tests:", error);
      toast({
        title: "Error",
        description: "Failed to load listening tests",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAudioUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('audio/')) {
      toast({
        title: "Invalid file type",
        description: "Please upload an audio file (MP3, WAV, etc.)",
        variant: "destructive",
      });
      return;
    }

    if (file.size > 50 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please upload an audio file smaller than 50MB",
        variant: "destructive",
      });
      return;
    }

    setUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `listening/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('question-images')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('question-images')
        .getPublicUrl(filePath);

      setFormData(prev => ({ ...prev, audio_url: publicUrl }));

      toast({
        title: "Audio uploaded",
        description: "The audio file has been uploaded successfully",
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

  const addQuestion = (type: "gap-fill" | "multiple-choice") => {
    const newId = questions.length + 1;
    const newQuestion: Question = {
      id: newId,
      type,
      text: "",
      ...(type === "multiple-choice" && { options: ["", "", "", ""] }),
    };
    setQuestions([...questions, newQuestion]);
    setAnswerKey({ ...answerKey, [newId.toString()]: "" });
  };

  const updateQuestion = (id: number, updates: Partial<Question>) => {
    setQuestions(questions.map(q => q.id === id ? { ...q, ...updates } : q));
  };

  const updateQuestionOption = (questionId: number, optionIndex: number, value: string) => {
    setQuestions(questions.map(q => {
      if (q.id === questionId && q.options) {
        const newOptions = [...q.options];
        newOptions[optionIndex] = value;
        return { ...q, options: newOptions };
      }
      return q;
    }));
  };

  const removeQuestion = (id: number) => {
    setQuestions(questions.filter(q => q.id !== id));
    const newAnswerKey = { ...answerKey };
    delete newAnswerKey[id.toString()];
    setAnswerKey(newAnswerKey);
  };

  const handleSave = async () => {
    if (!formData.title || !formData.audio_url) {
      toast({
        title: "Missing required fields",
        description: "Please fill in title and upload audio",
        variant: "destructive",
      });
      return;
    }

    if (questions.length === 0) {
      toast({
        title: "No questions",
        description: "Please add at least one question",
        variant: "destructive",
      });
      return;
    }

    setSaving(true);
    try {
      const payload = {
        title: formData.title,
        audio_url: formData.audio_url,
        transcript: formData.transcript || null,
        questions: questions as unknown as Json,
        answer_key: answerKey as unknown as Json,
        difficulty: formData.difficulty,
        duration_minutes: formData.duration_minutes,
        is_active: formData.is_active,
        ai_secret_context: formData.ai_secret_context || null,
      };

      if (formMode === "edit" && selectedTest) {
        const { error } = await supabase
          .from("listening_library")
          .update(payload)
          .eq("id", selectedTest.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("listening_library")
          .insert([{ ...payload, created_by: user?.id }]);
        if (error) throw error;
      }

      toast({
        title: formMode === "edit" ? "Updated" : "Created",
        description: `Listening test "${formData.title}" saved successfully`,
      });

      resetForm();
      fetchTests();
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
    if (!confirm("Are you sure you want to delete this listening test?")) return;

    try {
      const { error } = await supabase
        .from("listening_library")
        .delete()
        .eq("id", id);
      if (error) throw error;

      toast({ title: "Deleted", description: "Listening test removed" });
      fetchTests();
    } catch (error) {
      console.error("Delete error:", error);
      toast({
        title: "Delete failed",
        description: "Please try again",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (test: ListeningTest) => {
    setSelectedTest(test);
    setFormData({
      title: test.title,
      audio_url: test.audio_url,
      transcript: test.transcript || "",
      difficulty: test.difficulty,
      duration_minutes: test.duration_minutes,
      is_active: test.is_active,
      ai_secret_context: test.ai_secret_context || "",
    });
    setQuestions(test.questions);
    setAnswerKey(test.answer_key);
    setFormMode("edit");
  };

  const resetForm = () => {
    setFormData({
      title: "",
      audio_url: "",
      transcript: "",
      difficulty: "medium",
      duration_minutes: 30,
      is_active: true,
      ai_secret_context: "If the answer is a number, allow both digits and words (e.g., 7 or seven). Ignore capitalization differences.",
    });
    setQuestions([]);
    setAnswerKey({});
    setSelectedTest(null);
    setFormMode("list");
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
              <h1 className="text-2xl font-light">Listening Test Manager</h1>
              <p className="text-sm text-muted-foreground">Upload audio and create listening tests</p>
            </div>
          </div>
          {formMode === "list" && (
            <Button onClick={() => setFormMode("create")} className="gap-2">
              <Plus className="w-4 h-4" />
              Add Listening Test
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
            ) : tests.length === 0 ? (
              <Card className="border-dashed">
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <Headphones className="w-12 h-12 text-muted-foreground mb-4" />
                  <p className="text-muted-foreground mb-4">No listening tests in the library yet</p>
                  <Button onClick={() => setFormMode("create")}>
                    <Plus className="w-4 h-4 mr-2" />
                    Create First Test
                  </Button>
                </CardContent>
              </Card>
            ) : (
              tests.map((test) => (
                <Card key={test.id} className="hover:border-accent/50 transition-colors">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className={`text-xs px-2 py-0.5 rounded ${
                            test.difficulty === "hard" 
                              ? "bg-red-500/20 text-red-400"
                              : test.difficulty === "easy"
                              ? "bg-green-500/20 text-green-400"
                              : "bg-yellow-500/20 text-yellow-400"
                          }`}>
                            {test.difficulty}
                          </span>
                          <span className="text-xs px-2 py-0.5 rounded bg-blue-500/20 text-blue-400">
                            {test.duration_minutes} min
                          </span>
                          {!test.is_active && (
                            <span className="text-xs px-2 py-0.5 rounded bg-muted text-muted-foreground">
                              Inactive
                            </span>
                          )}
                        </div>
                        <h3 className="font-medium text-foreground mb-1">{test.title}</h3>
                        <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <HelpCircle className="w-3 h-3" />
                            {test.questions.length} questions
                          </span>
                          {test.transcript && (
                            <span className="flex items-center gap-1">
                              <Eye className="w-3 h-3" />
                              Has Transcript
                            </span>
                          )}
                          <span className="flex items-center gap-1">
                            <Music className="w-3 h-3" />
                            Audio uploaded
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 ml-4">
                        <Button variant="outline" size="sm" onClick={() => handleEdit(test)}>
                          Edit
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="text-destructive hover:text-destructive"
                          onClick={() => handleDelete(test.id)}
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
                {formMode === "edit" ? "Edit Listening Test" : "Create New Listening Test"}
              </h2>
            </div>

            {/* Basic Info */}
            <Card className="backdrop-blur-xl bg-card/50 border-border/50">
              <CardHeader>
                <CardTitle className="text-lg font-light flex items-center gap-2">
                  <Headphones className="w-5 h-5 text-accent" />
                  Test Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm">Title</Label>
                    <Input
                      value={formData.title}
                      onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                      placeholder="e.g., Academic Lecture - Climate Change"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label className="text-sm">Duration (minutes)</Label>
                    <Input
                      type="number"
                      value={formData.duration_minutes}
                      onChange={(e) => setFormData(prev => ({ ...prev, duration_minutes: parseInt(e.target.value) || 30 }))}
                      className="mt-1"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
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
                    <Label>Active (visible to students)</Label>
                  </div>
                </div>

                {/* Audio Upload */}
                <div>
                  <Label className="text-sm">Audio File</Label>
                  <div className="mt-1">
                    {formData.audio_url ? (
                      <div className="flex items-center gap-3 p-3 rounded-lg bg-secondary/50">
                        <Music className="w-5 h-5 text-accent" />
                        <audio controls className="flex-1 h-8">
                          <source src={formData.audio_url} />
                        </audio>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setFormData(prev => ({ ...prev, audio_url: "" }))}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    ) : (
                      <div
                        onClick={() => audioInputRef.current?.click()}
                        className="border-2 border-dashed rounded-lg p-8 text-center cursor-pointer hover:border-accent/50 transition-colors"
                      >
                        {uploading ? (
                          <Loader2 className="w-8 h-8 mx-auto animate-spin text-muted-foreground" />
                        ) : (
                          <>
                            <Upload className="w-8 h-8 mx-auto text-muted-foreground mb-2" />
                            <p className="text-sm text-muted-foreground">Click to upload audio file</p>
                            <p className="text-xs text-muted-foreground mt-1">MP3, WAV up to 50MB</p>
                          </>
                        )}
                      </div>
                    )}
                    <input
                      ref={audioInputRef}
                      type="file"
                      accept="audio/*"
                      onChange={handleAudioUpload}
                      className="hidden"
                    />
                  </div>
                </div>

                {/* Transcript */}
                <div>
                  <Label className="text-sm">Transcript (optional - shown after test)</Label>
                  <Textarea
                    value={formData.transcript}
                    onChange={(e) => setFormData(prev => ({ ...prev, transcript: e.target.value }))}
                    placeholder="Full transcript of the audio..."
                    className="mt-1 min-h-[120px]"
                  />
                </div>

                {/* AI Context */}
                <div>
                  <Label className="text-sm flex items-center gap-2">
                    <EyeOff className="w-4 h-4" />
                    AI Grading Context (hidden from students)
                  </Label>
                  <Textarea
                    value={formData.ai_secret_context}
                    onChange={(e) => setFormData(prev => ({ ...prev, ai_secret_context: e.target.value }))}
                    placeholder="Instructions for the grading system..."
                    className="mt-1"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Questions */}
            <Card className="backdrop-blur-xl bg-card/50 border-border/50">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg font-light flex items-center gap-2">
                    <HelpCircle className="w-5 h-5 text-accent" />
                    Questions ({questions.length})
                  </CardTitle>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => addQuestion("gap-fill")}>
                      <Plus className="w-4 h-4 mr-1" />
                      Gap-Fill
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => addQuestion("multiple-choice")}>
                      <Plus className="w-4 h-4 mr-1" />
                      Multiple Choice
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {questions.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <HelpCircle className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p>No questions yet. Add gap-fill or multiple choice questions above.</p>
                  </div>
                ) : (
                  questions.map((q, index) => (
                    <div key={q.id} className="p-4 rounded-lg bg-secondary/30 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">
                          Q{index + 1} - {q.type === "gap-fill" ? "Gap-Fill" : "Multiple Choice"}
                        </span>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-destructive"
                          onClick={() => removeQuestion(q.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>

                      <div>
                        <Label className="text-xs">Question Text</Label>
                        <Input
                          value={q.text}
                          onChange={(e) => updateQuestion(q.id, { text: e.target.value })}
                          placeholder={q.type === "gap-fill" 
                            ? "The conference is scheduled for _____" 
                            : "What is the main topic of the lecture?"
                          }
                          className="mt-1"
                        />
                      </div>

                      {q.type === "multiple-choice" && q.options && (
                        <div className="grid grid-cols-2 gap-2">
                          {q.options.map((opt, optIndex) => (
                            <div key={optIndex}>
                              <Label className="text-xs">Option {String.fromCharCode(65 + optIndex)}</Label>
                              <Input
                                value={opt}
                                onChange={(e) => updateQuestionOption(q.id, optIndex, e.target.value)}
                                placeholder={`Option ${String.fromCharCode(65 + optIndex)}`}
                                className="mt-1"
                              />
                            </div>
                          ))}
                        </div>
                      )}

                      <div>
                        <Label className="text-xs text-accent">Correct Answer</Label>
                        <Input
                          value={answerKey[q.id.toString()] || ""}
                          onChange={(e) => setAnswerKey({ ...answerKey, [q.id.toString()]: e.target.value })}
                          placeholder={q.type === "gap-fill" ? "12th March" : "A"}
                          className="mt-1 border-accent/50"
                        />
                      </div>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>

            {/* Save Button */}
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={resetForm}>
                Cancel
              </Button>
              <Button onClick={handleSave} disabled={saving} className="gap-2">
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                {formMode === "edit" ? "Update Test" : "Create Test"}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
