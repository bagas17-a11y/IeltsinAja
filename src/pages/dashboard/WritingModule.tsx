import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PenTool, Loader2, ChevronRight, Star, AlertTriangle, Target, Edit3, ArrowRight, Lightbulb, FileText, BarChart3, CheckCircle, XCircle, RefreshCw, BookOpen, Play, ArrowLeft, Zap } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth, isSuperAdmin } from "@/hooks/useAuth";

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
  const [view, setView] = useState<"library" | "practice">("library");
  const [activeTask, setActiveTask] = useState<"Task 1" | "Task 2">("Task 1");
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
  const { toast } = useToast();
  const { user } = useAuth();
  const isAdmin = isSuperAdmin(user?.email);

  const isTask1 = activeTask === "Task 1";
  const minWords = isTask1 ? 150 : 250;
  const currentRubric = isTask1 ? task1Rubric : task2Rubric;

  useEffect(() => {
    fetchQuestions();
  }, []);

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

  const handleAnalyze = async (isRevision = false) => {
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
      
      if (isRevision) {
        setRevisionFeedback(data);
        // Show score improvement
        if (feedback?.overallBand && data?.overallBand) {
          const improvement = data.overallBand - feedback.overallBand;
          if (improvement > 0) {
            toast({
              title: "Score Improved! 🎉",
              description: `Your score went up by ${improvement.toFixed(1)} bands!`,
            });
          }
        }
      } else {
        setPreviousScore(feedback?.overallBand || null);
        setFeedback(data);
        setRevisionFeedback(null);
        setRevisedEssay("");
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
    setActiveTask(task as "Task 1" | "Task 2");
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "easy": return "bg-green-500/20 text-green-400";
      case "hard": return "bg-red-500/20 text-red-400";
      default: return "bg-yellow-500/20 text-yellow-400";
    }
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

      {/* Task 1 Specific Feedback */}
      {isTask1 && feedbackData.overviewAudit && (
        <>
          <div className="p-4 bg-secondary/30 rounded-lg border border-border/30">
            <h3 className="text-sm font-medium text-foreground mb-2 flex items-center gap-2">
              <FileText className="w-4 h-4 text-accent" />
              Overview Audit
            </h3>
            <div className="flex items-center gap-2 mb-2">
              {feedbackData.overviewAudit.hasOverview === "Yes" ? (
                <CheckCircle className="w-4 h-4 text-green-500" />
              ) : feedbackData.overviewAudit.hasOverview === "Partial" ? (
                <AlertTriangle className="w-4 h-4 text-yellow-500" />
              ) : (
                <XCircle className="w-4 h-4 text-red-500" />
              )}
              <span className="text-sm">{feedbackData.overviewAudit.hasOverview}</span>
            </div>
            <p className="text-xs text-muted-foreground">{feedbackData.overviewAudit.analysis}</p>
          </div>

          {feedbackData.dataIntegrity && (
            <div className="p-4 bg-secondary/30 rounded-lg border border-border/30">
              <h3 className="text-sm font-medium text-foreground mb-2 flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-accent" />
                Data Integrity
              </h3>
              {feedbackData.dataIntegrity.missing?.length > 0 && (
                <div className="mb-2">
                  <span className="text-xs text-red-400">Missing data points:</span>
                  <ul className="mt-1 space-y-1">
                    {feedbackData.dataIntegrity.missing.map((item: string, i: number) => (
                      <li key={i} className="text-xs text-muted-foreground flex items-start gap-1">
                        <XCircle className="w-3 h-3 text-red-400 flex-shrink-0 mt-0.5" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {feedbackData.vocabularyForTrends && (
            <div className="p-4 bg-secondary/30 rounded-lg border border-border/30">
              <h3 className="text-sm font-medium text-foreground mb-2">Vocabulary for Trends</h3>
              <div className="mb-2">
                <span className="text-xs text-muted-foreground">Change words used: </span>
                <span className="text-xs text-accent">{feedbackData.vocabularyForTrends.changeWordsUsed?.join(", ") || "None detected"}</span>
              </div>
              {feedbackData.vocabularyForTrends.suggestions?.length > 0 && (
                <div>
                  <span className="text-xs text-green-400">Try these: </span>
                  <span className="text-xs text-muted-foreground">{feedbackData.vocabularyForTrends.suggestions.join(", ")}</span>
                </div>
              )}
            </div>
          )}

          {feedbackData.grammarPrecision && (
            <div className="p-4 bg-secondary/30 rounded-lg border border-border/30">
              <h3 className="text-sm font-medium text-foreground mb-2">Grammar Precision</h3>
              <p className="text-xs text-muted-foreground">{feedbackData.grammarPrecision}</p>
            </div>
          )}
        </>
      )}

      {/* Task 2 Specific Feedback */}
      {!isTask1 && feedbackData.positionCheck && (
        <>
          <div className="p-4 bg-secondary/30 rounded-lg border border-border/30">
            <h3 className="text-sm font-medium text-foreground mb-2 flex items-center gap-2">
              <Target className="w-4 h-4 text-accent" />
              Position Check
            </h3>
            <div className="flex items-center gap-2 mb-2">
              {feedbackData.positionCheck.isClear ? (
                <CheckCircle className="w-4 h-4 text-green-500" />
              ) : (
                <XCircle className="w-4 h-4 text-red-500" />
              )}
              <span className="text-sm">{feedbackData.positionCheck.isClear ? "Clear" : "Unclear"}</span>
            </div>
            <p className="text-xs text-muted-foreground">{feedbackData.positionCheck.analysis}</p>
          </div>

          {feedbackData.argumentDevelopment && (
            <div className="p-4 bg-secondary/30 rounded-lg border border-border/30">
              <h3 className="text-sm font-medium text-foreground mb-2">Argument Development</h3>
              <p className="text-xs text-muted-foreground mb-1">
                Main ideas presented: <span className="text-accent">{feedbackData.argumentDevelopment.mainIdeasCount}</span>
              </p>
              <p className="text-xs text-muted-foreground">{feedbackData.argumentDevelopment.analysis}</p>
            </div>
          )}

          {feedbackData.academicRegister && (
            <div className="p-4 bg-secondary/30 rounded-lg border border-border/30">
              <h3 className="text-sm font-medium text-foreground mb-2">Academic Register</h3>
              <p className="text-xs text-muted-foreground mb-2">
                Tone: <span className={feedbackData.academicRegister.tone === "Formal" ? "text-green-400" : "text-yellow-400"}>
                  {feedbackData.academicRegister.tone}
                </span>
              </p>
              {feedbackData.academicRegister.informalWords?.length > 0 && (
                <div className="space-y-1">
                  {feedbackData.academicRegister.informalWords.map((item: any, i: number) => (
                    <p key={i} className="text-xs">
                      <span className="text-red-400">"{item.word}"</span>
                      <span className="text-muted-foreground"> → </span>
                      <span className="text-green-400">"{item.suggestion}"</span>
                    </p>
                  ))}
                </div>
              )}
            </div>
          )}

          {feedbackData.complexityScore && (
            <div className="p-4 bg-secondary/30 rounded-lg border border-border/30">
              <h3 className="text-sm font-medium text-foreground mb-2">Complexity Score</h3>
              <p className="text-xs text-muted-foreground mb-1">
                Complex sentences found: {feedbackData.complexityScore.complexSentenceTypes?.join(", ") || "None"}
              </p>
              <p className="text-xs text-accent">{feedbackData.complexityScore.recommendation}</p>
            </div>
          )}
        </>
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
                  <CardContent className="flex flex-col items-center justify-center py-12">
                    <BookOpen className="w-12 h-12 text-muted-foreground mb-4" />
                    <p className="text-muted-foreground mb-2">No questions available for {activeTask}</p>
                    <p className="text-sm text-muted-foreground">Check back later or contact your instructor.</p>
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

              {/* Placeholder if no image */}
              {!selectedQuestion.question_image_url && selectedQuestion.task_type.startsWith("Task 1") && (
                <div className="p-4 bg-secondary/20 rounded-lg border border-dashed border-border/50 mb-4">
                  <div className="flex items-center justify-center h-48">
                    <div className="text-center">
                      <BarChart3 className="w-12 h-12 text-muted-foreground mx-auto mb-2" />
                      <p className="text-sm text-muted-foreground">Diagram/chart for this question</p>
                    </div>
                  </div>
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
    </DashboardLayout>
  );
}
