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
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { Json } from "@/integrations/supabase/types";
import { 
  Plus, Save, Trash2, Loader2, ArrowLeft, 
  Headphones, Eye, EyeOff, Upload, X, Music, HelpCircle, Image, Grid3X3, ListChecks
} from "lucide-react";

type QuestionType = "multiple-choice" | "matching" | "map-diagram" | "form-table" | "sentence-completion";

interface MatchingItem {
  id: string;
  text: string;
}

interface TableCell {
  value: string;
  isBlank: boolean;
}

interface Question {
  id: number;
  type: QuestionType;
  text: string;
  // Multiple choice
  options?: string[];
  // Matching
  matchingOptions?: string[];
  matchingItems?: MatchingItem[];
  // Map/Diagram
  diagramImageUrl?: string;
  labels?: { id: string; label: string }[];
  // Form/Table
  tableRows?: number;
  tableCols?: number;
  tableHeaders?: string[];
  tableData?: TableCell[][];
  // Sentence completion uses text field with blanks
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

const QUESTION_TYPES: { value: QuestionType; label: string; icon: any }[] = [
  { value: "multiple-choice", label: "Multiple Choice", icon: ListChecks },
  { value: "matching", label: "Matching", icon: ListChecks },
  { value: "map-diagram", label: "Plan/Map/Diagram Labelling", icon: Image },
  { value: "form-table", label: "Form/Table/Flow-chart Completion", icon: Grid3X3 },
  { value: "sentence-completion", label: "Sentence Completion", icon: HelpCircle },
];

export default function ListeningManager() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  // isAdmin comes from useAuth hook
  const audioInputRef = useRef<HTMLInputElement>(null);
  const diagramInputRef = useRef<HTMLInputElement>(null);
  const [uploadingDiagramForId, setUploadingDiagramForId] = useState<number | null>(null);

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

  const handleDiagramUpload = async (e: React.ChangeEvent<HTMLInputElement>, questionId: number) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid file type",
        description: "Please upload an image file (PNG, JPG, etc.)",
        variant: "destructive",
      });
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please upload an image smaller than 10MB",
        variant: "destructive",
      });
      return;
    }

    setUploadingDiagramForId(questionId);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `diagrams/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('question-images')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('question-images')
        .getPublicUrl(filePath);

      updateQuestion(questionId, { diagramImageUrl: publicUrl });

      toast({
        title: "Image uploaded",
        description: "The diagram has been uploaded successfully",
      });
    } catch (error) {
      console.error("Upload error:", error);
      toast({
        title: "Upload failed",
        description: "Please try again",
        variant: "destructive",
      });
    } finally {
      setUploadingDiagramForId(null);
    }
  };

  const addQuestion = (type: QuestionType) => {
    const newId = questions.length + 1;
    const newQuestion: Question = {
      id: newId,
      type,
      text: "",
    };

    // Initialize type-specific fields
    switch (type) {
      case "multiple-choice":
        newQuestion.options = ["", "", "", ""];
        break;
      case "matching":
        newQuestion.matchingOptions = ["A", "B", "C", "D"];
        newQuestion.matchingItems = [
          { id: "1", text: "" },
          { id: "2", text: "" },
          { id: "3", text: "" },
        ];
        break;
      case "map-diagram":
        newQuestion.diagramImageUrl = "";
        newQuestion.labels = [
          { id: "1", label: "" },
          { id: "2", label: "" },
          { id: "3", label: "" },
        ];
        break;
      case "form-table":
        newQuestion.tableRows = 3;
        newQuestion.tableCols = 3;
        newQuestion.tableHeaders = ["Column 1", "Column 2", "Column 3"];
        newQuestion.tableData = Array(3).fill(null).map(() =>
          Array(3).fill(null).map(() => ({ value: "", isBlank: false }))
        );
        break;
      case "sentence-completion":
        // Uses text field with underscores for blanks
        break;
    }

    setQuestions([...questions, newQuestion]);
    
    // For matching and table types, we might have multiple answers per question
    if (type === "matching") {
      setAnswerKey({ 
        ...answerKey, 
        [`${newId}-1`]: "", 
        [`${newId}-2`]: "", 
        [`${newId}-3`]: "" 
      });
    } else if (type === "map-diagram") {
      setAnswerKey({ 
        ...answerKey, 
        [`${newId}-1`]: "", 
        [`${newId}-2`]: "", 
        [`${newId}-3`]: "" 
      });
    } else if (type === "form-table") {
      // We'll add answer keys as blanks are marked
    } else {
      setAnswerKey({ ...answerKey, [newId.toString()]: "" });
    }
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

  const addMultipleChoiceOption = (questionId: number) => {
    setQuestions(questions.map(q => {
      if (q.id === questionId && q.options) {
        return { ...q, options: [...q.options, ""] };
      }
      return q;
    }));
  };

  const removeMultipleChoiceOption = (questionId: number, optionIndex: number) => {
    setQuestions(questions.map(q => {
      if (q.id === questionId && q.options && q.options.length > 2) {
        const newOptions = q.options.filter((_, i) => i !== optionIndex);
        return { ...q, options: newOptions };
      }
      return q;
    }));
  };

  const updateMatchingOption = (questionId: number, optionIndex: number, value: string) => {
    setQuestions(questions.map(q => {
      if (q.id === questionId && q.matchingOptions) {
        const newOptions = [...q.matchingOptions];
        newOptions[optionIndex] = value;
        return { ...q, matchingOptions: newOptions };
      }
      return q;
    }));
  };

  const addMatchingOption = (questionId: number) => {
    setQuestions(questions.map(q => {
      if (q.id === questionId && q.matchingOptions) {
        return { ...q, matchingOptions: [...q.matchingOptions, ""] };
      }
      return q;
    }));
  };

  const updateMatchingItem = (questionId: number, itemId: string, text: string) => {
    setQuestions(questions.map(q => {
      if (q.id === questionId && q.matchingItems) {
        const newItems = q.matchingItems.map(item => 
          item.id === itemId ? { ...item, text } : item
        );
        return { ...q, matchingItems: newItems };
      }
      return q;
    }));
  };

  const addMatchingItem = (questionId: number) => {
    setQuestions(questions.map(q => {
      if (q.id === questionId && q.matchingItems) {
        const newId = (q.matchingItems.length + 1).toString();
        const newItems = [...q.matchingItems, { id: newId, text: "" }];
        return { ...q, matchingItems: newItems };
      }
      return q;
    }));
    // Add answer key for new item
    const question = questions.find(q => q.id === questionId);
    if (question?.matchingItems) {
      const newItemId = (question.matchingItems.length + 1).toString();
      setAnswerKey({ ...answerKey, [`${questionId}-${newItemId}`]: "" });
    }
  };

  const updateDiagramLabel = (questionId: number, labelId: string, label: string) => {
    setQuestions(questions.map(q => {
      if (q.id === questionId && q.labels) {
        const newLabels = q.labels.map(l => 
          l.id === labelId ? { ...l, label } : l
        );
        return { ...q, labels: newLabels };
      }
      return q;
    }));
  };

  const addDiagramLabel = (questionId: number) => {
    setQuestions(questions.map(q => {
      if (q.id === questionId && q.labels) {
        const newId = (q.labels.length + 1).toString();
        const newLabels = [...q.labels, { id: newId, label: "" }];
        return { ...q, labels: newLabels };
      }
      return q;
    }));
    // Add answer key for new label
    const question = questions.find(q => q.id === questionId);
    if (question?.labels) {
      const newLabelId = (question.labels.length + 1).toString();
      setAnswerKey({ ...answerKey, [`${questionId}-${newLabelId}`]: "" });
    }
  };

  const updateTableDimensions = (questionId: number, rows: number, cols: number) => {
    setQuestions(questions.map(q => {
      if (q.id === questionId) {
        const newHeaders = Array(cols).fill("").map((_, i) => 
          q.tableHeaders?.[i] || `Column ${i + 1}`
        );
        const newData = Array(rows).fill(null).map((_, rowIndex) =>
          Array(cols).fill(null).map((_, colIndex) => 
            q.tableData?.[rowIndex]?.[colIndex] || { value: "", isBlank: false }
          )
        );
        return { 
          ...q, 
          tableRows: rows, 
          tableCols: cols, 
          tableHeaders: newHeaders,
          tableData: newData 
        };
      }
      return q;
    }));
  };

  const updateTableHeader = (questionId: number, colIndex: number, value: string) => {
    setQuestions(questions.map(q => {
      if (q.id === questionId && q.tableHeaders) {
        const newHeaders = [...q.tableHeaders];
        newHeaders[colIndex] = value;
        return { ...q, tableHeaders: newHeaders };
      }
      return q;
    }));
  };

  const updateTableCell = (questionId: number, rowIndex: number, colIndex: number, updates: Partial<TableCell>) => {
    setQuestions(questions.map(q => {
      if (q.id === questionId && q.tableData) {
        const newData = q.tableData.map((row, rIdx) =>
          row.map((cell, cIdx) =>
            rIdx === rowIndex && cIdx === colIndex ? { ...cell, ...updates } : cell
          )
        );
        return { ...q, tableData: newData };
      }
      return q;
    }));

    // Handle answer key for blank cells
    if (updates.isBlank !== undefined) {
      const key = `${questionId}-r${rowIndex}c${colIndex}`;
      if (updates.isBlank) {
        setAnswerKey({ ...answerKey, [key]: "" });
      } else {
        const newAnswerKey = { ...answerKey };
        delete newAnswerKey[key];
        setAnswerKey(newAnswerKey);
      }
    }
  };

  const removeQuestion = (id: number) => {
    setQuestions(questions.filter(q => q.id !== id));
    // Clean up all answer keys related to this question
    const newAnswerKey = { ...answerKey };
    Object.keys(newAnswerKey).forEach(key => {
      if (key.startsWith(`${id}-`) || key === id.toString()) {
        delete newAnswerKey[key];
      }
    });
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

  const getQuestionTypeLabel = (type: QuestionType) => {
    return QUESTION_TYPES.find(t => t.value === type)?.label || type;
  };

  const renderQuestionEditor = (q: Question, index: number) => {
    const Icon = QUESTION_TYPES.find(t => t.value === q.type)?.icon || HelpCircle;
    
    return (
      <div key={q.id} className="p-4 rounded-lg bg-secondary/30 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Icon className="w-4 h-4 text-accent" />
            <span className="text-sm font-medium">
              Q{index + 1} - {getQuestionTypeLabel(q.type)}
            </span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="text-destructive"
            onClick={() => removeQuestion(q.id)}
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>

        {/* Question Text (common) */}
        <div>
          <Label className="text-xs">Question/Instructions</Label>
          <Input
            value={q.text}
            onChange={(e) => updateQuestion(q.id, { text: e.target.value })}
            placeholder={getPlaceholderForType(q.type)}
            className="mt-1"
          />
        </div>

        {/* Type-specific UI */}
        {q.type === "multiple-choice" && renderMultipleChoiceEditor(q)}
        {q.type === "matching" && renderMatchingEditor(q)}
        {q.type === "map-diagram" && renderMapDiagramEditor(q)}
        {q.type === "form-table" && renderFormTableEditor(q)}
        {q.type === "sentence-completion" && renderSentenceCompletionEditor(q)}
      </div>
    );
  };

  const getPlaceholderForType = (type: QuestionType) => {
    switch (type) {
      case "multiple-choice": return "What is the main topic of the lecture?";
      case "matching": return "Match each person with the correct statement";
      case "map-diagram": return "Label the map/diagram below";
      case "form-table": return "Complete the form/table below";
      case "sentence-completion": return "Complete the sentences below (use _____ for blanks)";
    }
  };

  const renderMultipleChoiceEditor = (q: Question) => (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <Label className="text-xs">Options</Label>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => addMultipleChoiceOption(q.id)}
          className="h-6 text-xs"
        >
          <Plus className="w-3 h-3 mr-1" />
          Add Option
        </Button>
      </div>
      <div className="grid gap-2">
        {q.options?.map((opt, optIndex) => (
          <div key={optIndex} className="flex items-center gap-2">
            <span className="text-xs font-medium w-6">{String.fromCharCode(65 + optIndex)}.</span>
            <Input
              value={opt}
              onChange={(e) => updateQuestionOption(q.id, optIndex, e.target.value)}
              placeholder={`Option ${String.fromCharCode(65 + optIndex)}`}
              className="flex-1"
            />
            {(q.options?.length || 0) > 2 && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => removeMultipleChoiceOption(q.id, optIndex)}
                className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
              >
                <X className="w-3 h-3" />
              </Button>
            )}
          </div>
        ))}
      </div>
      <div>
        <Label className="text-xs text-accent">Correct Answer (e.g., A, B, C)</Label>
        <Input
          value={answerKey[q.id.toString()] || ""}
          onChange={(e) => setAnswerKey({ ...answerKey, [q.id.toString()]: e.target.value })}
          placeholder="A"
          className="mt-1 border-accent/50 w-24"
        />
      </div>
    </div>
  );

  const renderMatchingEditor = (q: Question) => (
    <div className="space-y-4">
      {/* Options List (A, B, C, etc.) */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label className="text-xs">Options to Match From</Label>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => addMatchingOption(q.id)}
            className="h-6 text-xs"
          >
            <Plus className="w-3 h-3 mr-1" />
            Add Option
          </Button>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {q.matchingOptions?.map((opt, optIndex) => (
            <div key={optIndex} className="flex items-center gap-2">
              <span className="text-xs font-medium w-6">{String.fromCharCode(65 + optIndex)}.</span>
              <Input
                value={opt}
                onChange={(e) => updateMatchingOption(q.id, optIndex, e.target.value)}
                placeholder={`Option ${String.fromCharCode(65 + optIndex)}`}
                className="flex-1"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Items to Match */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label className="text-xs">Items to be Matched</Label>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => addMatchingItem(q.id)}
            className="h-6 text-xs"
          >
            <Plus className="w-3 h-3 mr-1" />
            Add Item
          </Button>
        </div>
        {q.matchingItems?.map((item, idx) => (
          <div key={item.id} className="flex items-center gap-2 p-2 rounded bg-background/50">
            <span className="text-xs font-medium w-6">{item.id}.</span>
            <Input
              value={item.text}
              onChange={(e) => updateMatchingItem(q.id, item.id, e.target.value)}
              placeholder="Statement or question to match"
              className="flex-1"
            />
            <div className="flex items-center gap-1">
              <Label className="text-xs text-accent">Ans:</Label>
              <Input
                value={answerKey[`${q.id}-${item.id}`] || ""}
                onChange={(e) => setAnswerKey({ ...answerKey, [`${q.id}-${item.id}`]: e.target.value })}
                placeholder="A"
                className="w-12 border-accent/50 text-center"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderMapDiagramEditor = (q: Question) => (
    <div className="space-y-4">
      {/* Image Upload */}
      <div>
        <Label className="text-xs">Diagram/Map Image</Label>
        <div className="mt-1">
          {q.diagramImageUrl ? (
            <div className="space-y-2">
              <div className="relative rounded-lg overflow-hidden border border-border">
                <img 
                  src={q.diagramImageUrl} 
                  alt="Diagram" 
                  className="max-h-48 w-full object-contain bg-muted"
                />
                <Button
                  variant="destructive"
                  size="sm"
                  className="absolute top-2 right-2"
                  onClick={() => updateQuestion(q.id, { diagramImageUrl: "" })}
                >
                  <X className="w-3 h-3" />
                </Button>
              </div>
            </div>
          ) : (
            <div
              onClick={() => {
                diagramInputRef.current?.click();
                setUploadingDiagramForId(q.id);
              }}
              className="border-2 border-dashed rounded-lg p-6 text-center cursor-pointer hover:border-accent/50 transition-colors"
            >
              {uploadingDiagramForId === q.id ? (
                <Loader2 className="w-6 h-6 mx-auto animate-spin text-muted-foreground" />
              ) : (
                <>
                  <Image className="w-6 h-6 mx-auto text-muted-foreground mb-2" />
                  <p className="text-xs text-muted-foreground">Click to upload diagram</p>
                </>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Labels */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label className="text-xs">Labels (students will fill these)</Label>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => addDiagramLabel(q.id)}
            className="h-6 text-xs"
          >
            <Plus className="w-3 h-3 mr-1" />
            Add Label
          </Button>
        </div>
        {q.labels?.map((label) => (
          <div key={label.id} className="flex items-center gap-2 p-2 rounded bg-background/50">
            <span className="text-xs font-medium w-6">{label.id}.</span>
            <Input
              value={label.label}
              onChange={(e) => updateDiagramLabel(q.id, label.id, e.target.value)}
              placeholder="Label description (e.g., 'Reception area')"
              className="flex-1"
            />
            <div className="flex items-center gap-1">
              <Label className="text-xs text-accent">Ans:</Label>
              <Input
                value={answerKey[`${q.id}-${label.id}`] || ""}
                onChange={(e) => setAnswerKey({ ...answerKey, [`${q.id}-${label.id}`]: e.target.value })}
                placeholder="Answer"
                className="w-24 border-accent/50"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderFormTableEditor = (q: Question) => (
    <div className="space-y-4">
      {/* Table Dimensions */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <Label className="text-xs">Rows:</Label>
          <Input
            type="number"
            min={1}
            max={10}
            value={q.tableRows || 3}
            onChange={(e) => updateTableDimensions(q.id, parseInt(e.target.value) || 3, q.tableCols || 3)}
            className="w-16"
          />
        </div>
        <div className="flex items-center gap-2">
          <Label className="text-xs">Columns:</Label>
          <Input
            type="number"
            min={1}
            max={6}
            value={q.tableCols || 3}
            onChange={(e) => updateTableDimensions(q.id, q.tableRows || 3, parseInt(e.target.value) || 3)}
            className="w-16"
          />
        </div>
      </div>

      {/* Table Builder */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr>
              {q.tableHeaders?.map((header, colIdx) => (
                <th key={colIdx} className="border border-border p-1">
                  <Input
                    value={header}
                    onChange={(e) => updateTableHeader(q.id, colIdx, e.target.value)}
                    placeholder={`Column ${colIdx + 1}`}
                    className="text-xs h-8 text-center font-medium"
                  />
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {q.tableData?.map((row, rowIdx) => (
              <tr key={rowIdx}>
                {row.map((cell, colIdx) => (
                  <td key={colIdx} className="border border-border p-1">
                    <div className="flex items-center gap-1">
                      <Input
                        value={cell.value}
                        onChange={(e) => updateTableCell(q.id, rowIdx, colIdx, { value: e.target.value })}
                        placeholder={cell.isBlank ? "(blank)" : "Value"}
                        className={`text-xs h-8 ${cell.isBlank ? "border-accent/50 bg-accent/5" : ""}`}
                        disabled={cell.isBlank}
                      />
                      <Button
                        variant={cell.isBlank ? "default" : "ghost"}
                        size="sm"
                        className="h-8 w-8 p-0 shrink-0"
                        onClick={() => updateTableCell(q.id, rowIdx, colIdx, { isBlank: !cell.isBlank })}
                        title={cell.isBlank ? "Remove blank" : "Mark as blank (student fills)"}
                      >
                        {cell.isBlank ? <X className="w-3 h-3" /> : <HelpCircle className="w-3 h-3" />}
                      </Button>
                    </div>
                    {cell.isBlank && (
                      <Input
                        value={answerKey[`${q.id}-r${rowIdx}c${colIdx}`] || ""}
                        onChange={(e) => setAnswerKey({ ...answerKey, [`${q.id}-r${rowIdx}c${colIdx}`]: e.target.value })}
                        placeholder="Correct answer"
                        className="text-xs h-6 mt-1 border-accent/50"
                      />
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-xs text-muted-foreground">
        Click the <HelpCircle className="w-3 h-3 inline" /> icon on any cell to mark it as a blank for students to fill.
      </p>
    </div>
  );

  const renderSentenceCompletionEditor = (q: Question) => (
    <div className="space-y-3">
      <div>
        <Label className="text-xs">Sentences (use _____ for blanks, one per line)</Label>
        <Textarea
          value={q.text}
          onChange={(e) => updateQuestion(q.id, { text: e.target.value })}
          placeholder={`1. The conference is scheduled for _____.\n2. Participants must register by _____.\n3. The venue is located at _____.`}
          className="mt-1 min-h-[120px] font-mono text-sm"
        />
      </div>
      <div>
        <Label className="text-xs text-accent">Correct Answers (comma-separated, in order)</Label>
        <Input
          value={answerKey[q.id.toString()] || ""}
          onChange={(e) => setAnswerKey({ ...answerKey, [q.id.toString()]: e.target.value })}
          placeholder="12th March, 5pm, Central Hall"
          className="mt-1 border-accent/50"
        />
        <p className="text-xs text-muted-foreground mt-1">
          Enter answers in order, separated by commas. Each answer corresponds to a blank.
        </p>
      </div>
    </div>
  );

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-6xl mx-auto">
        {/* Hidden file inputs */}
        <input
          ref={diagramInputRef}
          type="file"
          accept="image/*"
          onChange={(e) => uploadingDiagramForId !== null && handleDiagramUpload(e, uploadingDiagramForId)}
          className="hidden"
        />

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
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Question Type Selector */}
                <div className="p-4 rounded-lg bg-accent/5 border border-accent/20">
                  <Label className="text-sm font-medium mb-3 block">Add Question by Type</Label>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                    {QUESTION_TYPES.map((type) => {
                      const Icon = type.icon;
                      return (
                        <Button
                          key={type.value}
                          variant="outline"
                          size="sm"
                          onClick={() => addQuestion(type.value)}
                          className="flex flex-col h-auto py-3 px-2 gap-1"
                        >
                          <Icon className="w-4 h-4" />
                          <span className="text-xs text-center leading-tight">{type.label}</span>
                        </Button>
                      );
                    })}
                  </div>
                </div>

                {/* Question List */}
                {questions.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <HelpCircle className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p>No questions yet. Select a question type above to add one.</p>
                  </div>
                ) : (
                  questions.map((q, index) => renderQuestionEditor(q, index))
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
