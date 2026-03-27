import { useState, useEffect, useRef } from "react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PenTool, Loader2, ChevronRight, Star, AlertTriangle, Target, Edit3, ArrowRight, Lightbulb, FileText, BarChart3, CheckCircle, XCircle, RefreshCw, BookOpen, Play, ArrowLeft, Zap } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { useUserProgress } from "@/hooks/useUserProgress";
import { useFeatureGating } from "@/hooks/useFeatureGating";
import { UpgradeModal } from "@/components/UpgradeModal";
import { WritingCheatsheet } from "@/components/writing/WritingCheatsheet";
import { generationStore } from "@/stores/generationStore";
import { useGenerationEntry } from "@/hooks/useGenerationEntry";

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
  // AI-generated questions only — raw data for chart/map rendering
  visual_type?: string;
  visual_data?: Record<string, unknown>;
}

interface CachedWritingState {
  view: "library" | "practice";
  selectedQuestion: IeltsQuestion | null;
  essay: string;
  revisedEssay: string;
  feedback: any;
  revisionFeedback: any;
  previousScore: number | null;
}

// Grading Rubric for Task 1
const task1Rubric = [
  {
    criterion: "Task Achievement",
    description: "Overview paragraph required. Must include highest, lowest, and significant changes.",
    band9: "Fully addresses all parts of the task; presents a fully developed response",
    band5: "Only partially addresses the task; format may be inappropriate"
  },
  {
    criterion: "Coherence & Cohesion",
    description: "Look for data linkers: 'In stark contrast...', 'Following this...', 'A similar pattern...'",
    band9: "Uses cohesion in such a way that it attracts no attention; paragraphing is skillful",
    band5: "Some organisation but lacks overall progression; inadequate cohesive devices"
  },
  {
    criterion: "Lexical Resource",
    description: "Trend vocabulary: 'plummeted', 'soared', 'remained constant', 'gradual fluctuation'",
    band9: "Uses a wide range of vocabulary with very natural and sophisticated control",
    band5: "Limited range of vocabulary; noticeable errors in spelling/word formation"
  },
  {
    criterion: "Grammatical Range",
    description: "Comparison structures & passive voice for processes",
    band9: "Uses a wide range of structures with full flexibility and accuracy",
    band5: "Uses only a limited range of structures; attempts complex sentences but with limited accuracy"
  }
];

// Grading Rubric for Task 2
const task2Rubric = [
  {
    criterion: "Task Response",
    description: "Clear thesis in introduction. Each paragraph needs topic sentence + support/examples.",
    band9: "Fully addresses all parts; presents a fully developed position",
    band5: "Addresses the task only partially; position unclear"
  },
  {
    criterion: "Coherence & Cohesion",
    description: "Logical progression. Use 'Consequently', 'Paradoxically', 'This suggests that...'",
    band9: "Seamless cohesion; skillful paragraphing",
    band5: "Some organization but lacks overall progression"
  },
  {
    criterion: "Lexical Resource",
    description: "Topic-specific vocabulary. Avoid informal language ('kids', 'stuff', 'bad').",
    band9: "Wide range with sophisticated control of lexical features",
    band5: "Limited range; repetitive; noticeable errors"
  },
  {
    criterion: "Grammatical Range",
    description: "Need 3+ complex sentence types (Conditional, Relative, Passive, Subordinate).",
    band9: "Wide range of structures; full flexibility; rare minor errors",
    band5: "Limited range; attempts complex sentences with limited accuracy"
  }
];

export default function WritingModule() {
  // useAuth MUST be called before any useState that references user?.id
  const { user, profile, isAdmin } = useAuth();
  const isElite = profile?.subscription_tier === "elite";

  // isMountedRef: tracks whether component is currently mounted
  const isMountedRef = useRef(true);
  useEffect(() => {
    isMountedRef.current = true;
    return () => { isMountedRef.current = false; };
  }, []);

  // Background generation store — survives component unmount/remount
  const genEntry = useGenerationEntry('writing');
  const [view, setView] = useState<"library" | "practice">("library");
  const [activeTask, setActiveTask] = useState<"Task 1" | "Task 2">(() => {
    if (typeof window !== "undefined") {
      const stored = sessionStorage.getItem(`ielts-writing-active-task-${user?.id || 'guest'}`);
      if (stored === "Task 1" || stored === "Task 2") return stored;
    }
    return "Task 1";
  });
  const [questions, setQuestions] = useState<IeltsQuestion[]>([]);
  const [loadingQuestions, setLoadingQuestions] = useState(true);
  const [selectedQuestion, setSelectedQuestion] = useState<IeltsQuestion | null>(null);
  const [essay, setEssay] = useState("");
  const [revisedEssay, setRevisedEssay] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isAnalyzingRevision, setIsAnalyzingRevision] = useState(false);
  const [feedback, setFeedback] = useState<any>(null);
  const [revisionFeedback, setRevisionFeedback] = useState<any>(null);
  const [previousScore, setPreviousScore] = useState<number | null>(null);
  const [adminNote, setAdminNote] = useState("");
  const [adminOverrideScore, setAdminOverrideScore] = useState("");
  const [showRubric, setShowRubric] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [generateDifficulty, setGenerateDifficulty] = useState<"easy" | "medium" | "hard">("medium");
  const { toast } = useToast();
  const { saveProgress } = useUserProgress();
  const { canAccess, refreshCounts } = useFeatureGating();

  const isTask1 = activeTask === "Task 1";
  const minWords = isTask1 ? 150 : 250;
  const currentRubric = isTask1 ? task1Rubric : task2Rubric;

  useEffect(() => {
    fetchQuestions();
  }, []);

  // Restore and Sync cache based on active task
  useEffect(() => {
    if (!user?.id) return;
    try {
      const stored = sessionStorage.getItem(`ielts-writing-cache-${user.id}-${activeTask}`);
      if (stored) {
        const state = JSON.parse(stored) as CachedWritingState;
        if (state.selectedQuestion) {
          setView(state.view || "library");
          setSelectedQuestion(state.selectedQuestion);
          setEssay(state.essay || "");
          setRevisedEssay(state.revisedEssay || "");
          setFeedback(state.feedback || null);
          setRevisionFeedback(state.revisionFeedback || null);
          setPreviousScore(state.previousScore || null);
          return;
        }
      }
    } catch (err) { console.error("Cache load error:", err); }
    
    // Reset if no deep cache found
    setView("library");
    setSelectedQuestion(null);
    setEssay("");
    setRevisedEssay("");
    setFeedback(null);
    setRevisionFeedback(null);
    setPreviousScore(null);
  }, [user?.id, activeTask]);

  useEffect(() => {
    if (!user?.id || !selectedQuestion) return;
    const state: CachedWritingState = {
      view, selectedQuestion, essay, revisedEssay, feedback, revisionFeedback, previousScore
    };
    sessionStorage.setItem(`ielts-writing-cache-${user.id}-${activeTask}`, JSON.stringify(state));
  }, [user?.id, activeTask, view, selectedQuestion, essay, revisedEssay, feedback, revisionFeedback, previousScore]);

  // Apply generation results that arrived while this component was unmounted
  useEffect(() => {
    if (genEntry.isGenerating) return;
    if (genEntry.result) {
      const { generatedQuestion, generatingTask } = genEntry.result;
      generationStore.clearEntry('writing');
      if (isMountedRef.current) {
        if (activeTask === generatingTask) {
          handleStartPractice(generatedQuestion);
        } else {
          toast({ title: "Background Generation Complete", description: `${generatingTask} is ready to practice!` });
        }
      }
    } else if (genEntry.error) {
      generationStore.clearEntry('writing');
      if (isMountedRef.current) {
        toast({ title: "Generation failed", description: genEntry.error, variant: "destructive" });
      }
    }
  }, [genEntry]); // eslint-disable-line react-hooks/exhaustive-deps

  const fetchQuestions = async () => {
    try {
      const { data, error } = await supabase
        .from("ielts_library")
        .select("*")
        .eq("is_active", true)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setQuestions(data || []);
    } catch (error) {
      console.error("Error fetching questions:", error);
    } finally {
      setLoadingQuestions(false);
    }
  };

  const generateQuestion = async () => {
    let currentSession;
    try {
      const { data: { session: refreshedSession } } = await supabase.auth.refreshSession();
      currentSession = refreshedSession || (await supabase.auth.getSession()).data.session;
    } catch (e) {
      console.error(e);
    }
    
    if (!currentSession) {
      toast({ title: "Authentication required", description: "You must be logged in.", variant: "destructive" });
      return;
    }

    const generatingTask = activeTask;
    try {
      if (user?.id) sessionStorage.setItem(`ielts-writing-active-task-${user.id}`, generatingTask);
    } catch(e) {}
    generationStore.startGen('writing', { task: generatingTask });
    try {
      const { data, error } = await supabase.functions.invoke("generate-writing", {
        body: { task_type: generatingTask, difficulty: generateDifficulty },
        headers: {
          Authorization: `Bearer ${currentSession.access_token}`,
        },
      });
      if (error) throw error;

      const aiData = data?.data ?? data;

      const title = aiData.topic || "AI Writing Prompt";
      let questionPrompt = aiData.instruction || "";
      let secretContext = "";

      if (activeTask === "Task 1") {
        // Append data description to the prompt
        if (aiData.data) {
          const d = aiData.data;
          const dataLines = [
            d.title ? `**${d.title}**` : "",
            d.key_features?.length
              ? `Key features: ${d.key_features.join("; ")}`
              : "",
          ].filter(Boolean).join("\n");
          questionPrompt = `${questionPrompt}\n\n${dataLines}`.trim();
        }
        secretContext = aiData.model_answer_guide
          ? JSON.stringify(aiData.model_answer_guide)
          : "";
      } else {
        // Task 2: append statement
        if (aiData.statement) {
          questionPrompt = `${aiData.statement}\n\n${questionPrompt}`.trim();
        }
        secretContext = aiData.model_answer_guide
          ? JSON.stringify(aiData.model_answer_guide)
          : "";
      }

      const generatedQuestion: IeltsQuestion = {
        id: `ai-${Date.now()}`,
        task_type: generatingTask,
        title,
        question_prompt: questionPrompt,
        question_image_url: null,
        model_answer_band9: null,
        ai_secret_context: secretContext,
        target_keywords: null,
        difficulty: generateDifficulty,
        is_active: true,
        visual_type: generatingTask === "Task 1" ? (aiData.visual_type ?? undefined) : undefined,
        visual_data: generatingTask === "Task 1" ? (aiData.data ?? undefined) : undefined,
      };

      const newCache: CachedWritingState = {
        view: "practice",
        selectedQuestion: generatedQuestion,
        essay: "",
        revisedEssay: "",
        feedback: null,
        revisionFeedback: null,
        previousScore: null
      };

      try {
        if (user?.id) sessionStorage.setItem(`ielts-writing-cache-${user.id}-${generatingTask}`, JSON.stringify(newCache));
      } catch (err) { console.error("Cache save error:", err); }

      if (isMountedRef.current) {
        generationStore.clearEntry('writing');
        if (activeTask === generatingTask) {
          handleStartPractice(generatedQuestion);
        } else {
          toast({ title: "Background Generation Complete", description: `${generatingTask} is ready to practice!` });
        }
      } else {
        // Component unmounted — store result for remount to apply
        generationStore.finishGen('writing', { generatedQuestion, generatingTask });
      }
    } catch (error: any) {
      console.error("generate-writing error:", error);
      const msg = error.message || "Could not generate a writing prompt. Please try again.";
      if (isMountedRef.current) {
        generationStore.clearEntry('writing');
        toast({ title: "Generation failed", description: msg, variant: "destructive" });
      } else {
        generationStore.failGen('writing', msg);
      }
    }
  };

  const filteredQuestions = questions.filter(q => {
    if (activeTask === "Task 1") {
      return q.task_type.startsWith("Task 1");
    }
    return q.task_type === "Task 2";
  });

  const handleStartPractice = (question: IeltsQuestion) => {
    setSelectedQuestion(question);
    setEssay("");
    setRevisedEssay("");
    setFeedback(null);
    setRevisionFeedback(null);
    setPreviousScore(null);
    setView("practice");
  };

  const handleBackToLibrary = () => {
    setView("library");
    setSelectedQuestion(null);
    setEssay("");
    setRevisedEssay("");
    setFeedback(null);
    setRevisionFeedback(null);
    setPreviousScore(null);
  };

  const handleRestartPractice = () => {
    setEssay("");
    setRevisedEssay("");
    setFeedback(null);
    setRevisionFeedback(null);
    setPreviousScore(null);
  };

  const handleAnalyze = async (isRevision = false) => {
    // Check feature gating before analyzing (only for initial analysis, not revisions)
    if (!isRevision && !canAccess("writing")) {
      setShowUpgradeModal(true);
      return;
    }

    const essayContent = isRevision ? revisedEssay : essay;
    
    if (essayContent.trim().length < 50) {
      toast({
        title: "Essay too short",
        description: "Please write more content for meaningful feedback.",
        variant: "destructive",
      });
      return;
    }

    if (isRevision) {
      setIsAnalyzingRevision(true);
    } else {
      setIsAnalyzing(true);
    }

    try {
      const { data, error } = await supabase.functions.invoke("ai-analyze", {
        body: {
          type: "writing",
          content: essayContent,
          taskType: activeTask,
          isRevision,
          questionId: selectedQuestion?.id,
          secretContext: selectedQuestion?.ai_secret_context,
          modelAnswer: selectedQuestion?.model_answer_band9,
          targetKeywords: selectedQuestion?.target_keywords,
        },
      });

      if (error) throw error;

      // Unwrap response: supabase.functions.invoke returns {success, data} wrapper
      const unwrappedData = data?.success ? data.data : data;

      if (isRevision) {
        setRevisionFeedback(unwrappedData);
        // Show score improvement
        if (feedback?.overallBand && unwrappedData?.overallBand) {
          const improvement = unwrappedData.overallBand - feedback.overallBand;
          if (improvement > 0) {
            toast({
              title: "Score Improved! 🎉",
              description: `Your score went up by ${improvement.toFixed(1)} bands!`,
            });
          }
        }
      } else {
        setPreviousScore(feedback?.overallBand || null);
        setFeedback(unwrappedData);
        setRevisionFeedback(null);
        setRevisedEssay("");

        // Save progress to user_progress for stats tracking
        if (unwrappedData?.overallBand && user) {
          try {
            await saveProgress({
              exam_type: "writing",
              score: null,
              band_score: unwrappedData.overallBand,
              total_questions: null,
              correct_answers: null,
              feedback: `${activeTask}: ${selectedQuestion?.title || 'Practice'}`,
              completed_at: new Date().toISOString(),
              time_taken: null,
              errors_log: [],
              metadata: {
                taskType: activeTask,
                questionId: selectedQuestion?.id,
                questionTitle: selectedQuestion?.title,
                wordCount: essay.split(/\s+/).filter(Boolean).length,
              },
            });
            await refreshCounts();
          } catch (err) {
            console.error("Failed to save writing progress:", err);
          }
        }
      }
      
      setAdminNote("");
      setAdminOverrideScore("");
    } catch (error: any) {
      console.error("Analysis error:", error);
      toast({
        title: "Analysis failed",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      if (isRevision) {
        setIsAnalyzingRevision(false);
      } else {
        setIsAnalyzing(false);
      }
    }
  };

  const handleAdminOverride = () => {
    if (adminOverrideScore && feedback) {
      const newScore = parseFloat(adminOverrideScore);
      if (newScore >= 1 && newScore <= 9) {
        setFeedback({
          ...feedback,
          overallBand: newScore,
          adminOverride: true,
          adminNote: adminNote
        });
        toast({
          title: "Score Override Applied",
          description: `Band score updated to ${newScore}`,
        });
      }
    }
  };

  const handleTaskChange = (task: string) => {
    const newTask = task as "Task 1" | "Task 2";
    setActiveTask(newTask);
    try {
      if (user?.id) sessionStorage.setItem(`ielts-writing-active-task-${user.id}`, newTask);
    } catch(e) {}
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "easy": return "bg-green-500/20 text-green-400";
      case "hard": return "bg-red-500/20 text-red-400";
      default: return "bg-yellow-500/20 text-yellow-400";
    }
  };

  const VisualDataRenderer = ({ visualType, data }: { visualType: string; data: Record<string, unknown> }) => {
    if (visualType === "map") {
      const features = (data.key_features as string[]) ?? [];
      const title = data.title as string ?? "";
      return (
        <div className="space-y-3">
          {title && <p className="text-xs font-medium text-accent">{title}</p>}
          <p className="text-xs text-muted-foreground uppercase tracking-wide">Key changes</p>
          <ul className="space-y-2">
            {features.map((f, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-foreground/80">
                <span className="text-accent mt-0.5">→</span>
                <span>{f}</span>
              </li>
            ))}
          </ul>
        </div>
      );
    }

    if (visualType === "process_diagram") {
      const stages = (data.stages as Array<{ stage: number; description: string }>) ?? [];
      const title = data.title as string ?? "";
      return (
        <div className="space-y-2">
          {title && <p className="text-xs font-medium text-accent mb-2">{title}</p>}
          <div className="flex flex-wrap gap-2 items-center">
            {stages.map((s, i) => (
              <div key={i} className="flex items-center gap-1">
                <div className="px-2 py-1 bg-accent/10 border border-accent/30 rounded text-xs text-foreground/80 max-w-[120px] text-center">
                  {s.description}
                </div>
                {i < stages.length - 1 && <span className="text-accent text-xs">→</span>}
              </div>
            ))}
          </div>
        </div>
      );
    }

    // For bar_chart, line_graph, table, pie_chart, bar_line_combo — render a data table
    const series = (data.series as Array<{ label: string; values: Record<string, number> }>) ?? [];
    const segments = (data.segments as Array<{ label: string; percentage: number }>) ?? [];
    const title = data.title as string ?? "";
    const unit = data.unit as string ?? "";

    if (segments.length > 0) {
      return (
        <div className="space-y-2">
          {title && <p className="text-xs font-medium text-accent">{title}</p>}
          <div className="grid grid-cols-2 gap-2">
            {segments.map((s, i) => (
              <div key={i} className="flex justify-between items-center px-3 py-1.5 bg-secondary/30 rounded text-xs">
                <span className="text-foreground/80">{s.label}</span>
                <span className="text-accent font-medium">{s.percentage}%</span>
              </div>
            ))}
          </div>
        </div>
      );
    }

    if (series.length > 0) {
      const allKeys = Object.keys(series[0]?.values ?? {});
      return (
        <div className="space-y-2 overflow-x-auto">
          {title && <p className="text-xs font-medium text-accent">{title}{unit ? ` (${unit})` : ""}</p>}
          <table className="text-xs w-full border-collapse">
            <thead>
              <tr>
                <th className="text-left px-2 py-1 text-muted-foreground font-normal border-b border-border/30"></th>
                {allKeys.map(k => <th key={k} className="px-2 py-1 text-muted-foreground font-normal border-b border-border/30 text-right">{k}</th>)}
              </tr>
            </thead>
            <tbody>
              {series.map((s, i) => (
                <tr key={i} className="border-b border-border/20">
                  <td className="px-2 py-1 text-foreground/80">{s.label}</td>
                  {allKeys.map(k => <td key={k} className="px-2 py-1 text-accent text-right">{s.values[k]}</td>)}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    }

    return (
      <div className="flex items-center justify-center h-16">
        <p className="text-xs text-muted-foreground">Data not available for this question type</p>
      </div>
    );
  };

  const ScoreCell = ({ label, score, justification }: { label: string; score: number; justification?: string }) => (
    <div className="p-4 bg-secondary/30 rounded-lg border border-border/30">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-foreground">{label}</span>
        <span className="text-lg font-light text-accent">{score}</span>
      </div>
      {justification && (
        <p className="text-xs text-muted-foreground">{justification}</p>
      )}
    </div>
  );

  const StructuralGradeItem = ({ label, status, checks, feedback }: { 
    label: string; 
    status: string; 
    checks: { label: string; passed: boolean }[];
    feedback: string;
  }) => (
    <div className="p-4 bg-secondary/30 rounded-lg border border-border/30">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-foreground">{label}</span>
        {status === "executed" ? (
          <span className="flex items-center gap-1 text-xs text-green-500"><CheckCircle className="w-3 h-3" /> Executed</span>
        ) : status === "partial" ? (
          <span className="flex items-center gap-1 text-xs text-yellow-500"><AlertTriangle className="w-3 h-3" /> Partial</span>
        ) : (
          <span className="flex items-center gap-1 text-xs text-red-500"><XCircle className="w-3 h-3" /> Missing</span>
        )}
      </div>
      <div className="flex flex-wrap gap-2 mb-2">
        {checks.map((check, i) => (
          <span key={i} className={`text-xs px-2 py-0.5 rounded ${check.passed ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
            {check.passed ? '✓' : '✗'} {check.label}
          </span>
        ))}
      </div>
      <p className="text-xs text-muted-foreground">{feedback}</p>
    </div>
  );

  const FeedbackDisplay = ({ feedbackData, isRevisionFeedback = false }: { feedbackData: any; isRevisionFeedback?: boolean }) => (
    <div className="space-y-6">
      {isRevisionFeedback && (
        <div className="p-3 bg-green-500/10 rounded-lg border border-green-500/20 mb-4">
          <p className="text-sm text-green-500 flex items-center gap-2">
            <RefreshCw className="w-4 h-4" />
            Revised Essay Feedback
            {feedback?.overallBand && feedbackData?.overallBand && (
              <span className="ml-2">
                {feedbackData.overallBand > feedback.overallBand ? (
                  <span className="text-green-400">↑ +{(feedbackData.overallBand - feedback.overallBand).toFixed(1)} bands</span>
                ) : feedbackData.overallBand < feedback.overallBand ? (
                  <span className="text-red-400">↓ {(feedbackData.overallBand - feedback.overallBand).toFixed(1)} bands</span>
                ) : (
                  <span className="text-muted-foreground">Same score</span>
                )}
              </span>
            )}
          </p>
        </div>
      )}

      {/* Overall Score */}
      <div className="flex items-center justify-center py-4">
        <div className="text-center">
          <div className="w-24 h-24 rounded-full bg-accent/20 flex items-center justify-center mx-auto mb-2">
            <span className="text-4xl font-light text-accent">{feedbackData.overallBand}</span>
          </div>
          <p className="text-sm text-muted-foreground">Overall Band Score</p>
        </div>
      </div>

      {/* 🏆 Structural Grade - Task 1 */}
      {isTask1 && feedbackData.structuralGrade && (
        <div>
          <h3 className="text-sm font-medium text-foreground mb-4 flex items-center gap-2">
            🏆 Structural Grade
          </h3>
          <div className="grid gap-3">
            <StructuralGradeItem
              label="Paragraph 1: Introduction"
              status={feedbackData.structuralGrade.paragraph1_introduction?.status || "missing"}
              checks={[
                { label: "Paraphrased", passed: feedbackData.structuralGrade.paragraph1_introduction?.paraphrased },
                { label: "No Opinions", passed: feedbackData.structuralGrade.paragraph1_introduction?.noOpinions }
              ]}
              feedback={feedbackData.structuralGrade.paragraph1_introduction?.feedback || ""}
            />
            <StructuralGradeItem
              label="Paragraph 2: Overview"
              status={feedbackData.structuralGrade.paragraph2_overview?.status || "missing"}
              checks={[
                { label: `${feedbackData.structuralGrade.paragraph2_overview?.trendsCount || 0} Trends`, passed: (feedbackData.structuralGrade.paragraph2_overview?.trendsCount || 0) >= 2 },
                { label: "General Terms", passed: feedbackData.structuralGrade.paragraph2_overview?.usedGeneralTerms }
              ]}
              feedback={feedbackData.structuralGrade.paragraph2_overview?.feedback || ""}
            />
            <StructuralGradeItem
              label="Paragraph 3: Body 1"
              status={feedbackData.structuralGrade.paragraph3_body1?.status || "missing"}
              checks={[
                { label: "Key Feature", passed: feedbackData.structuralGrade.paragraph3_body1?.hasKeyFeature },
                { label: "Data Support", passed: feedbackData.structuralGrade.paragraph3_body1?.hasDataSupport }
              ]}
              feedback={feedbackData.structuralGrade.paragraph3_body1?.feedback || ""}
            />
            <StructuralGradeItem
              label="Paragraph 4: Body 2"
              status={feedbackData.structuralGrade.paragraph4_body2?.status || "missing"}
              checks={[
                { label: "Second Feature", passed: feedbackData.structuralGrade.paragraph4_body2?.hasSecondFeature },
                { label: "Precise Figures", passed: feedbackData.structuralGrade.paragraph4_body2?.hasPreciseFigures }
              ]}
              feedback={feedbackData.structuralGrade.paragraph4_body2?.feedback || ""}
            />
          </div>
        </div>
      )}

      {/* 📍 Key Features Audit - Task 1 */}
      {isTask1 && feedbackData.keyFeaturesAudit && (
        <div className="p-4 bg-secondary/30 rounded-lg border border-border/30">
          <h3 className="text-sm font-medium text-foreground mb-3 flex items-center gap-2">
            📍 Key Features Audit
          </h3>
          {feedbackData.keyFeaturesAudit.identified?.length > 0 && (
            <div className="mb-3">
              <span className="text-xs text-green-400">Identified:</span>
              <div className="flex flex-wrap gap-2 mt-1">
                {feedbackData.keyFeaturesAudit.identified.map((item: string, i: number) => (
                  <span key={i} className="text-xs px-2 py-1 bg-green-500/10 text-green-400 rounded">{item}</span>
                ))}
              </div>
            </div>
          )}
          {feedbackData.keyFeaturesAudit.missed?.length > 0 && (
            <div>
              <span className="text-xs text-red-400">Missed:</span>
              <div className="flex flex-wrap gap-2 mt-1">
                {feedbackData.keyFeaturesAudit.missed.map((item: string, i: number) => (
                  <span key={i} className="text-xs px-2 py-1 bg-red-500/10 text-red-400 rounded">{item}</span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ✍️ Vocabulary Suggestion Box - Task 1 */}
      {isTask1 && feedbackData.vocabularySuggestions && (
        <div className="p-4 bg-secondary/30 rounded-lg border border-border/30">
          <h3 className="text-sm font-medium text-foreground mb-3 flex items-center gap-2">
            ✍️ Vocabulary Suggestion Box
          </h3>
          <div className="grid grid-cols-2 gap-3">
            {feedbackData.vocabularySuggestions.sequencing?.length > 0 && (
              <div>
                <span className="text-xs text-blue-400 font-medium">Sequencing:</span>
                <p className="text-xs text-muted-foreground mt-1">{feedbackData.vocabularySuggestions.sequencing.join(", ")}</p>
              </div>
            )}
            {feedbackData.vocabularySuggestions.contrast?.length > 0 && (
              <div>
                <span className="text-xs text-purple-400 font-medium">Contrast:</span>
                <p className="text-xs text-muted-foreground mt-1">{feedbackData.vocabularySuggestions.contrast.join(", ")}</p>
              </div>
            )}
            {feedbackData.vocabularySuggestions.result?.length > 0 && (
              <div>
                <span className="text-xs text-orange-400 font-medium">Result:</span>
                <p className="text-xs text-muted-foreground mt-1">{feedbackData.vocabularySuggestions.result.join(", ")}</p>
              </div>
            )}
            {feedbackData.vocabularySuggestions.emphasis?.length > 0 && (
              <div>
                <span className="text-xs text-green-400 font-medium">Emphasis:</span>
                <p className="text-xs text-muted-foreground mt-1">{feedbackData.vocabularySuggestions.emphasis.join(", ")}</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 🏆 Structural Grade - Task 2 */}
      {!isTask1 && feedbackData.structuralGrade && (
        <div>
          <h3 className="text-sm font-medium text-foreground mb-4 flex items-center gap-2">
            🏆 Structural Grade
          </h3>
          <div className="grid gap-3">
            <StructuralGradeItem
              label="Paragraph 1: Introduction"
              status={feedbackData.structuralGrade.paragraph1_introduction?.status || "missing"}
              checks={[
                { label: "Paraphrased", passed: feedbackData.structuralGrade.paragraph1_introduction?.paraphrased },
                { label: "Has Thesis", passed: feedbackData.structuralGrade.paragraph1_introduction?.hasThesis }
              ]}
              feedback={feedbackData.structuralGrade.paragraph1_introduction?.feedback || ""}
            />
            <StructuralGradeItem
              label="Paragraph 2: Body 1 (First Argument)"
              status={feedbackData.structuralGrade.paragraph2_body1?.status || "missing"}
              checks={[
                { label: "Topic Sentence", passed: feedbackData.structuralGrade.paragraph2_body1?.hasTopicSentence },
                { label: "Has Example", passed: feedbackData.structuralGrade.paragraph2_body1?.hasExample }
              ]}
              feedback={feedbackData.structuralGrade.paragraph2_body1?.feedback || ""}
            />
            <StructuralGradeItem
              label="Paragraph 3: Body 2 (Second Argument)"
              status={feedbackData.structuralGrade.paragraph3_body2?.status || "missing"}
              checks={[
                { label: "Topic Sentence", passed: feedbackData.structuralGrade.paragraph3_body2?.hasTopicSentence },
                { label: "Developed/Counter", passed: feedbackData.structuralGrade.paragraph3_body2?.developedOrCounterArg }
              ]}
              feedback={feedbackData.structuralGrade.paragraph3_body2?.feedback || ""}
            />
            <StructuralGradeItem
              label="Paragraph 4: Conclusion"
              status={feedbackData.structuralGrade.paragraph4_conclusion?.status || "missing"}
              checks={[
                { label: "Summarized", passed: feedbackData.structuralGrade.paragraph4_conclusion?.summarized },
                { label: "No New Ideas", passed: feedbackData.structuralGrade.paragraph4_conclusion?.noNewIdeas }
              ]}
              feedback={feedbackData.structuralGrade.paragraph4_conclusion?.feedback || ""}
            />
          </div>
        </div>
      )}

      {/* 💎 Band 9 Highlights - Task 2 */}
      {!isTask1 && feedbackData.band9Highlights && (
        <div className="p-4 bg-elite-gold/5 rounded-lg border border-elite-gold/20">
          <h3 className="text-sm font-medium text-elite-gold mb-4 flex items-center gap-2">
            💎 Band 9 Highlights
          </h3>
          <div className="space-y-4">
            {feedbackData.band9Highlights.hedgingUsed && (
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-medium text-foreground">Hedging Technique:</span>
                  {feedbackData.band9Highlights.hedgingUsed.found ? (
                    <span className="text-xs text-green-400">✓ Found</span>
                  ) : (
                    <span className="text-xs text-red-400">✗ Not Found</span>
                  )}
                </div>
                {feedbackData.band9Highlights.hedgingUsed.examples?.length > 0 && (
                  <p className="text-xs text-green-400/80 mb-1">Examples: {feedbackData.band9Highlights.hedgingUsed.examples.join(", ")}</p>
                )}
                {feedbackData.band9Highlights.hedgingUsed.suggestions?.length > 0 && (
                  <p className="text-xs text-muted-foreground">Try: {feedbackData.band9Highlights.hedgingUsed.suggestions.join(", ")}</p>
                )}
              </div>
            )}
            {feedbackData.band9Highlights.cohesiveProgression && (
              <div>
                <span className="text-xs font-medium text-foreground">Cohesive Progression: </span>
                <span className={`text-xs ${feedbackData.band9Highlights.cohesiveProgression.score === "Strong" ? "text-green-400" : feedbackData.band9Highlights.cohesiveProgression.score === "Adequate" ? "text-yellow-400" : "text-red-400"}`}>
                  {feedbackData.band9Highlights.cohesiveProgression.score}
                </span>
                <p className="text-xs text-muted-foreground mt-1">{feedbackData.band9Highlights.cohesiveProgression.feedback}</p>
              </div>
            )}
            {feedbackData.band9Highlights.ideaDepth && (
              <div>
                <span className="text-xs font-medium text-foreground">Idea Depth: </span>
                <span className={`text-xs ${feedbackData.band9Highlights.ideaDepth.score === "Deep" ? "text-green-400" : feedbackData.band9Highlights.ideaDepth.score === "Moderate" ? "text-yellow-400" : "text-red-400"}`}>
                  {feedbackData.band9Highlights.ideaDepth.score}
                </span>
                <p className="text-xs text-muted-foreground mt-1">{feedbackData.band9Highlights.ideaDepth.feedback}</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 📚 Vocabulary Upgrades - Task 2 */}
      {!isTask1 && feedbackData.vocabularyUpgrades && feedbackData.vocabularyUpgrades.length > 0 && (
        <div className="p-4 bg-secondary/30 rounded-lg border border-border/30">
          <h3 className="text-sm font-medium text-foreground mb-3 flex items-center gap-2">
            📚 Academic Vocabulary Upgrades
          </h3>
          <div className="space-y-2">
            {feedbackData.vocabularyUpgrades.map((upgrade: any, i: number) => (
              <div key={i} className="flex items-center gap-2 text-xs">
                <span className="px-2 py-0.5 bg-muted rounded text-muted-foreground">{upgrade.function}</span>
                <span className="text-red-400">"{upgrade.original}"</span>
                <ArrowRight className="w-3 h-3 text-muted-foreground" />
                <span className="text-green-400">"{upgrade.upgrade}"</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Scoring Grid */}
      {feedbackData.scoringGrid && (
        <div>
          <h3 className="text-sm font-medium text-foreground mb-4">The Scoring Grid</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <ScoreCell 
              label="Task Response" 
              score={feedbackData.scoringGrid.taskResponse?.score || 0}
              justification={feedbackData.scoringGrid.taskResponse?.justification}
            />
            <ScoreCell 
              label="Coherence & Cohesion" 
              score={feedbackData.scoringGrid.coherenceCohesion?.score || 0}
              justification={feedbackData.scoringGrid.coherenceCohesion?.justification}
            />
            <ScoreCell 
              label="Lexical Resource" 
              score={feedbackData.scoringGrid.lexicalResource?.score || 0}
              justification={feedbackData.scoringGrid.lexicalResource?.justification}
            />
            <ScoreCell 
              label="Grammatical Range & Accuracy" 
              score={feedbackData.scoringGrid.grammaticalRange?.score || 0}
              justification={feedbackData.scoringGrid.grammaticalRange?.justification}
            />
          </div>
        </div>
      )}

      {/* Band 8.0+ Transformations */}
      {feedbackData.band8Transformations && feedbackData.band8Transformations.length > 0 && (
        <div>
          <h3 className="text-sm font-medium text-elite-gold mb-4 flex items-center gap-2">
            <Star className="w-4 h-4" />
            The Band 8.0+ Transformation
          </h3>
          <div className="space-y-4">
            {feedbackData.band8Transformations.map((transform: any, i: number) => (
              <div key={i} className="p-4 bg-secondary/30 rounded-lg border border-border/30">
                <div className="mb-3">
                  <span className="text-xs text-muted-foreground uppercase tracking-wide">Original</span>
                  <p className="text-sm text-red-400/80 mt-1 italic">"{transform.original}"</p>
                </div>
                <div className="flex items-center gap-2 mb-3">
                  <ArrowRight className="w-4 h-4 text-elite-gold" />
                  <span className="text-xs text-elite-gold uppercase tracking-wide">Band 8.0+ Rewrite</span>
                </div>
                <p className="text-sm text-green-400/80 italic mb-3">"{transform.rewrite}"</p>
                <div className="pt-3 border-t border-border/30">
                  <p className="text-xs text-muted-foreground">
                    <strong className="text-foreground/70">Why it's better:</strong> {transform.explanation}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Critical Fixes */}
      {feedbackData.criticalFixes && feedbackData.criticalFixes.length > 0 && (
        <div className="p-4 bg-red-500/5 rounded-lg border border-red-500/20">
          <h3 className="text-sm font-medium text-red-500 mb-3 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4" />
            Critical Fixes
          </h3>
          <ul className="space-y-2">
            {feedbackData.criticalFixes.map((fix: string, i: number) => (
              <li key={i} className="flex items-start gap-2 text-sm text-foreground/70">
                <ChevronRight className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
                {fix}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Actionable Next Step */}
      {feedbackData.actionableNextStep && (
        <div className="p-4 bg-green-500/5 rounded-lg border border-green-500/20">
          <h3 className="text-sm font-medium text-green-500 mb-2 flex items-center gap-2">
            <Lightbulb className="w-4 h-4" />
            Actionable Next Step
          </h3>
          <p className="text-sm text-foreground/80">{feedbackData.actionableNextStep}</p>
        </div>
      )}
    </div>
  );

  return (
    <DashboardLayout>
      <div className="max-w-7xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            {view === "practice" && (
              <Button variant="ghost" onClick={handleBackToLibrary} className="mr-2">
                <ArrowLeft className="w-4 h-4" />
              </Button>
            )}
            <div className="w-12 h-12 rounded-xl bg-elite-gold/10 flex items-center justify-center">
              <PenTool className="w-6 h-6 text-elite-gold" />
            </div>
            <div>
              <h1 className="text-2xl font-light">Writing Suite</h1>
              <p className="text-sm text-muted-foreground">
                {view === "library" ? "Choose a question to practice" : selectedQuestion?.title}
              </p>
            </div>
          </div>
        </div>

        {/* Library View */}
        {view === "library" && (
          <>
            {isElite ? (
              <Tabs defaultValue="practice" className="w-full">
                <TabsList className="mb-6">
                  <TabsTrigger value="practice">Practice Questions</TabsTrigger>
                  <TabsTrigger value="cheatsheet">MudahInAja</TabsTrigger>
                </TabsList>
                <TabsContent value="practice" className="mt-0">
                  {/* Task Tabs */}
                  <Tabs value={activeTask} onValueChange={handleTaskChange} className="mb-6">
                    <TabsList className="grid w-full max-w-md grid-cols-2">
                      <TabsTrigger value="Task 1" className="data-[state=active]:bg-accent data-[state=active]:text-accent-foreground">
                        Task 1 (Report)
                      </TabsTrigger>
                      <TabsTrigger value="Task 2" className="data-[state=active]:bg-accent data-[state=active]:text-accent-foreground">
                        Task 2 (Essay)
                      </TabsTrigger>
                    </TabsList>
                  </Tabs>

                  {/* Question Library */}
                  <div className="space-y-4">
                    {loadingQuestions ? (
                      <div className="flex items-center justify-center py-12">
                        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
                      </div>
                    ) : filteredQuestions.length === 0 ? (
                      <Card className="border-dashed">
                        <CardContent className="flex flex-col items-center justify-center py-12 gap-4">
                          <BookOpen className="w-12 h-12 text-muted-foreground" />
                          <div className="text-center">
                            <p className="text-muted-foreground mb-1">No questions available for {activeTask}</p>
                            <p className="text-sm text-muted-foreground">Generate one with AI now.</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <select
                              value={generateDifficulty}
                              onChange={(e) => setGenerateDifficulty(e.target.value as typeof generateDifficulty)}
                              className="bg-secondary/50 border border-border/50 rounded-md px-3 py-2 text-sm text-foreground"
                            >
                              <option value="easy">Easy</option>
                              <option value="medium">Medium</option>
                              <option value="hard">Hard</option>
                            </select>
                            <Button
                              onClick={() => !canAccess("writing") ? setShowUpgradeModal(true) : generateQuestion()}
                              disabled={(genEntry.isGenerating && genEntry.config?.task === activeTask)}
                              className="gap-2"
                            >
                              {(genEntry.isGenerating && genEntry.config?.task === activeTask) ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                              ) : (
                                <Zap className="w-4 h-4" />
                              )}
                              {(genEntry.isGenerating && genEntry.config?.task === activeTask) ? "Generating in background..." : "Generate AI Question"}
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ) : (
                      filteredQuestions.map((q) => (
                        <Card key={q.id} className="hover:border-accent/50 transition-colors cursor-pointer group" onClick={() => handleStartPractice(q)}>
                          <CardContent className="p-6">
                            <div className="flex items-start justify-between">
                              <div className="flex-1 pr-4">
                                <div className="flex items-center gap-2 mb-3">
                                  <span className={`text-xs px-2 py-0.5 rounded ${
                                    q.task_type === "Task 2" 
                                      ? "bg-purple-500/20 text-purple-400"
                                      : q.task_type === "Task 1 General"
                                      ? "bg-teal-500/20 text-teal-400"
                                      : "bg-blue-500/20 text-blue-400"
                                  }`}>
                                    {q.task_type}
                                  </span>
                                  <span className={`text-xs px-2 py-0.5 rounded flex items-center gap-1 ${getDifficultyColor(q.difficulty)}`}>
                                    <Zap className="w-3 h-3" />
                                    {q.difficulty}
                                  </span>
                                </div>
                                <h3 className="font-medium text-foreground mb-2 group-hover:text-accent transition-colors">
                                  {q.title}
                                </h3>
                                <p className="text-sm text-muted-foreground line-clamp-2">
                                  {q.question_prompt}
                                </p>
                              </div>
                              <Button variant="outline" size="sm" className="flex-shrink-0 gap-2 group-hover:bg-accent group-hover:text-accent-foreground transition-colors">
                                <Play className="w-4 h-4" />
                                Start Practice
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))
                    )}
                  </div>
                </TabsContent>
                <TabsContent value="cheatsheet" className="mt-0">
                  <div className="glass-card p-6">
                    <h2 className="text-lg font-semibold mb-4">Everything You Need for Writing Module (with an example)</h2>
                    <WritingCheatsheet />
                  </div>
                </TabsContent>
              </Tabs>
            ) : (
              <>
                {/* Task Tabs */}
                <Tabs value={activeTask} onValueChange={handleTaskChange} className="mb-6">
                  <TabsList className="grid w-full max-w-md grid-cols-2">
                    <TabsTrigger value="Task 1" className="data-[state=active]:bg-accent data-[state=active]:text-accent-foreground">
                      Task 1 (Report)
                    </TabsTrigger>
                    <TabsTrigger value="Task 2" className="data-[state=active]:bg-accent data-[state=active]:text-accent-foreground">
                      Task 2 (Essay)
                    </TabsTrigger>
                  </TabsList>
                </Tabs>

                {/* Question Library */}
                <div className="space-y-4">
                  {loadingQuestions ? (
                    <div className="flex items-center justify-center py-12">
                      <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
                    </div>
                  ) : filteredQuestions.length === 0 ? (
                    <Card className="border-dashed">
                      <CardContent className="flex flex-col items-center justify-center py-12 gap-4">
                        <BookOpen className="w-12 h-12 text-muted-foreground" />
                        <div className="text-center">
                          <p className="text-muted-foreground mb-1">No questions available for {activeTask}</p>
                          <p className="text-sm text-muted-foreground">Generate one with AI now.</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <select
                            value={generateDifficulty}
                            onChange={(e) => setGenerateDifficulty(e.target.value as typeof generateDifficulty)}
                            className="bg-secondary/50 border border-border/50 rounded-md px-3 py-2 text-sm text-foreground"
                          >
                            <option value="easy">Easy</option>
                            <option value="medium">Medium</option>
                            <option value="hard">Hard</option>
                          </select>
                          <Button
                            onClick={() => !canAccess("writing") ? setShowUpgradeModal(true) : generateQuestion()}
                            disabled={(genEntry.isGenerating && genEntry.config?.task === activeTask)}
                            className="gap-2"
                          >
                            {(genEntry.isGenerating && genEntry.config?.task === activeTask) ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <Zap className="w-4 h-4" />
                            )}
                            {(genEntry.isGenerating && genEntry.config?.task === activeTask) ? "Generating in background..." : "Generate AI Question"}
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ) : (
                    filteredQuestions.map((q) => (
                      <Card key={q.id} className="hover:border-accent/50 transition-colors cursor-pointer group" onClick={() => handleStartPractice(q)}>
                        <CardContent className="p-6">
                          <div className="flex items-start justify-between">
                            <div className="flex-1 pr-4">
                              <div className="flex items-center gap-2 mb-3">
                                <span className={`text-xs px-2 py-0.5 rounded ${
                                  q.task_type === "Task 2" 
                                    ? "bg-purple-500/20 text-purple-400"
                                    : q.task_type === "Task 1 General"
                                    ? "bg-teal-500/20 text-teal-400"
                                    : "bg-blue-500/20 text-blue-400"
                                }`}>
                                  {q.task_type}
                                </span>
                                <span className={`text-xs px-2 py-0.5 rounded flex items-center gap-1 ${getDifficultyColor(q.difficulty)}`}>
                                  <Zap className="w-3 h-3" />
                                  {q.difficulty}
                                </span>
                              </div>
                              <h3 className="font-medium text-foreground mb-2 group-hover:text-accent transition-colors">
                                {q.title}
                              </h3>
                              <p className="text-sm text-muted-foreground line-clamp-2">
                                {q.question_prompt}
                              </p>
                            </div>
                            <Button variant="outline" size="sm" className="flex-shrink-0 gap-2 group-hover:bg-accent group-hover:text-accent-foreground transition-colors">
                              <Play className="w-4 h-4" />
                              Start Practice
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  )}
                </div>
              </>
            )}
          </>
        )}

        {/* Practice View */}
        {view === "practice" && selectedQuestion && (
          <>
            {/* Question Section */}
            <div className="glass-card p-6 mb-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-light flex items-center gap-2">
                  <FileText className="w-4 h-4 text-accent" />
                  {selectedQuestion.task_type} Question
                </h2>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowRubric(!showRubric)}
                  className="text-xs"
                >
                  <BookOpen className="w-3 h-3 mr-1" />
                  {showRubric ? "Hide" : "Show"} Rubric
                </Button>
              </div>
              
              <div className="p-4 bg-secondary/30 rounded-lg border border-border/30 mb-4">
                <p className="text-sm text-foreground">{selectedQuestion.question_prompt}</p>
              </div>

              {/* Question Image */}
              {selectedQuestion.question_image_url && (
                <div className="p-4 bg-secondary/20 rounded-lg border border-border/50 mb-4">
                  <img 
                    src={selectedQuestion.question_image_url} 
                    alt="Question diagram" 
                    className="max-w-full h-auto rounded"
                  />
                </div>
              )}

              {/* Visual data for AI-generated Task 1 questions */}
              {!selectedQuestion.question_image_url && selectedQuestion.task_type.startsWith("Task 1") && (
                <div className="p-4 bg-secondary/20 rounded-lg border border-border/50 mb-4">
                  {selectedQuestion.visual_data ? (
                    <VisualDataRenderer
                      visualType={selectedQuestion.visual_type ?? "bar_chart"}
                      data={selectedQuestion.visual_data}
                    />
                  ) : (
                    <div className="flex items-center justify-center h-24">
                      <div className="text-center">
                        <BarChart3 className="w-10 h-10 text-muted-foreground mx-auto mb-2" />
                        <p className="text-sm text-muted-foreground">Diagram/chart for this question</p>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Rubric Section */}
            {showRubric && (
              <div className="glass-card p-6 mb-6">
                <h2 className="text-lg font-light mb-4">Grading Rubric - {activeTask}</h2>
                <div className="space-y-4">
                  {currentRubric.map((item, i) => (
                    <div key={i} className="p-4 bg-secondary/30 rounded-lg border border-border/30">
                      <h3 className="text-sm font-medium text-foreground mb-1">{item.criterion}</h3>
                      <p className="text-xs text-accent mb-2">{item.description}</p>
                      <div className="grid md:grid-cols-2 gap-2 mt-2">
                        <div className="p-2 bg-green-500/5 rounded border border-green-500/20">
                          <span className="text-xs font-medium text-green-500">Band 9:</span>
                          <p className="text-xs text-muted-foreground mt-1">{item.band9}</p>
                        </div>
                        <div className="p-2 bg-yellow-500/5 rounded border border-yellow-500/20">
                          <span className="text-xs font-medium text-yellow-500">Band 5:</span>
                          <p className="text-xs text-muted-foreground mt-1">{item.band5}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Essay Writing Area */}
            <div className="glass-card p-6 mb-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-light">Your Essay</h2>
                <span className={`text-xs ${essay.split(/\s+/).filter(Boolean).length < minWords ? 'text-red-400' : 'text-muted-foreground'}`}>
                  {essay.split(/\s+/).filter(Boolean).length} / {minWords} words min
                </span>
              </div>
              <Textarea
                value={essay}
                onChange={(e) => setEssay(e.target.value)}
                placeholder={`Write your ${selectedQuestion.task_type} response here... (minimum ${minWords} words)`}
                className="h-[300px] bg-secondary/30 border-border/30 resize-none"
              />
              <div className="flex items-center justify-between mt-4">
                <div className="flex gap-2">
                  <Button
                    variant="default"
                    onClick={() => handleAnalyze(false)}
                    disabled={isAnalyzing}
                  >
                    {isAnalyzing ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Analyzing...
                      </>
                    ) : (
                      <>
                        Get AI Feedback
                        <ChevronRight className="w-4 h-4 ml-2" />
                      </>
                    )}
                  </Button>
                  {feedback && (
                    <Button
                      variant="outline"
                      onClick={handleRestartPractice}
                    >
                      <RefreshCw className="w-4 h-4 mr-2" />
                      Restart
                    </Button>
                  )}
                </div>
              </div>
            </div>

            {/* Original Feedback Section */}
            {feedback && (
              <div className="glass-card p-6 mb-6">
                <h2 className="text-lg font-light mb-6">Diagnostic Feedback Report</h2>
                <FeedbackDisplay feedbackData={feedback} />

                {/* Admin Override Section */}
                {isAdmin && (
                  <Card className="border-destructive/30 bg-destructive/5 mt-6">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm font-medium text-destructive flex items-center gap-2">
                        <Edit3 className="w-4 h-4" />
                        Admin Score Override
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center gap-4">
                        <div className="flex-1">
                          <label className="text-xs text-muted-foreground mb-1 block">Override Band Score</label>
                          <Input
                            type="number"
                            min="1"
                            max="9"
                            step="0.5"
                            placeholder="e.g., 7.5"
                            value={adminOverrideScore}
                            onChange={(e) => setAdminOverrideScore(e.target.value)}
                            className="max-w-[120px]"
                          />
                        </div>
                        <Button variant="destructive" size="sm" onClick={handleAdminOverride}>
                          Apply Override
                        </Button>
                      </div>
                      <div>
                        <label className="text-xs text-muted-foreground mb-1 block">Admin Note</label>
                        <Textarea
                          placeholder="Add a note explaining the override..."
                          value={adminNote}
                          onChange={(e) => setAdminNote(e.target.value)}
                          className="h-20"
                        />
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            )}

            {/* Revision Section - Only shows after getting feedback */}
            {feedback && (
              <div className="glass-card p-6">
                <div className="flex items-center gap-2 mb-4">
                  <RefreshCw className="w-5 h-5 text-accent" />
                  <h2 className="text-lg font-light">Revise & Resubmit</h2>
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  Based on the feedback above, revise your essay and submit it for re-grading. Your score will update if you've improved!
                </p>
                
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-muted-foreground">Revised Essay</span>
                  <span className={`text-xs ${revisedEssay.split(/\s+/).filter(Boolean).length < minWords ? 'text-red-400' : 'text-muted-foreground'}`}>
                    {revisedEssay.split(/\s+/).filter(Boolean).length} / {minWords} words min
                  </span>
                </div>
                <Textarea
                  value={revisedEssay}
                  onChange={(e) => setRevisedEssay(e.target.value)}
                  placeholder="Paste or write your revised essay here..."
                  className="h-[250px] bg-secondary/30 border-border/30 resize-none mb-4"
                />
                <Button
                  variant="outline"
                  onClick={() => handleAnalyze(true)}
                  disabled={isAnalyzingRevision || revisedEssay.trim().length < 50}
                >
                  {isAnalyzingRevision ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Analyzing Revision...
                    </>
                  ) : (
                    <>
                      <RefreshCw className="w-4 h-4 mr-2" />
                      Get Revised Feedback
                    </>
                  )}
                </Button>

                {/* Revision Feedback */}
                {revisionFeedback && (
                  <div className="mt-6 pt-6 border-t border-border/30">
                    <FeedbackDisplay feedbackData={revisionFeedback} isRevisionFeedback />
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>

      <UpgradeModal
        isOpen={showUpgradeModal}
        onClose={() => setShowUpgradeModal(false)}
        featureName="Writing"
      />
    </DashboardLayout>
  );
}
