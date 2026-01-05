import { useState } from "react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PenTool, Loader2, ChevronRight, Star, AlertTriangle, Target, Edit3, ArrowRight, Lightbulb, FileText, BarChart3, CheckCircle, XCircle, RefreshCw, BookOpen } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth, isSuperAdmin } from "@/hooks/useAuth";

// Task 1 Question and Key Features
const task1Question = {
  prompt: "The chart below shows the percentage of households in owned and rented accommodation in England and Wales between 1918 and 2011.",
  instruction: "Summarise the information by selecting and reporting the main features, and make comparisons where relevant.",
  keyFeatures: [
    "Owned accommodation started at ~23% in 1918 and rose to ~68% by 2001",
    "Rented accommodation started at ~77% in 1918 and fell to ~32% by 2001",
    "The crossover point occurred around 1971 (both ~50%)",
    "By 2011, owned accommodation was ~64% and rented was ~36%",
    "The trends reversed after 2001 (owned decreased, rented increased)"
  ]
};

// Task 2 Question
const task2Question = {
  prompt: "Some people believe that unpaid community service should be a compulsory part of high school programmes (for example, working for a charity, improving the neighbourhood, or teaching sports to younger children).",
  instruction: "To what extent do you agree or disagree?",
  keyPoints: [
    "Clear position required (agree/disagree/partially)",
    "Must discuss benefits OR drawbacks of compulsory community service",
    "Provide specific examples to support arguments",
    "Consider counterarguments",
    "Conclude with a clear restatement of position"
  ]
};

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
  const [activeTask, setActiveTask] = useState<"Task 1" | "Task 2">("Task 1");
  const [essay, setEssay] = useState("");
  const [revisedEssay, setRevisedEssay] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isAnalyzingRevision, setIsAnalyzingRevision] = useState(false);
  const [feedback, setFeedback] = useState<any>(null);
  const [revisionFeedback, setRevisionFeedback] = useState<any>(null);
  const [adminNote, setAdminNote] = useState("");
  const [adminOverrideScore, setAdminOverrideScore] = useState("");
  const [showRubric, setShowRubric] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();
  const isAdmin = isSuperAdmin(user?.email);

  const minWords = activeTask === "Task 1" ? 150 : 250;
  const currentQuestion = activeTask === "Task 1" ? task1Question : task2Question;
  const currentRubric = activeTask === "Task 1" ? task1Rubric : task2Rubric;

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
        },
      });

      if (error) throw error;
      
      if (isRevision) {
        setRevisionFeedback(data);
      } else {
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
    setFeedback(null);
    setRevisionFeedback(null);
    setEssay("");
    setRevisedEssay("");
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
          </p>
        </div>
      )}

      {/* Task 1 Specific Feedback */}
      {activeTask === "Task 1" && feedbackData.overviewAudit && (
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
      {activeTask === "Task 2" && feedbackData.positionCheck && (
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
            <div className="w-12 h-12 rounded-xl bg-elite-gold/10 flex items-center justify-center">
              <PenTool className="w-6 h-6 text-elite-gold" />
            </div>
            <div>
              <h1 className="text-2xl font-light">Writing Suite</h1>
              <p className="text-sm text-muted-foreground">AI-powered diagnostic feedback</p>
            </div>
          </div>
        </div>

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

        {/* Question Section */}
        <div className="glass-card p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-light flex items-center gap-2">
              <FileText className="w-4 h-4 text-accent" />
              {activeTask} Question
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
            <p className="text-sm text-foreground mb-3">{currentQuestion.prompt}</p>
            <p className="text-sm text-accent italic">{currentQuestion.instruction}</p>
          </div>

          {/* Task 1 Diagram Placeholder */}
          {activeTask === "Task 1" && (
            <div className="p-4 bg-secondary/20 rounded-lg border border-dashed border-border/50 mb-4">
              <div className="flex items-center justify-center h-48">
                <div className="text-center">
                  <BarChart3 className="w-12 h-12 text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">Line graph showing housing tenure</p>
                  <p className="text-xs text-muted-foreground mt-1">England and Wales: 1918 - 2011</p>
                  <div className="mt-4 flex justify-center gap-4 text-xs">
                    <span className="flex items-center gap-1">
                      <div className="w-3 h-3 bg-blue-500 rounded-sm"></div>
                      Owned
                    </span>
                    <span className="flex items-center gap-1">
                      <div className="w-3 h-3 bg-orange-500 rounded-sm"></div>
                      Rented
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Key Features / Points */}
          <div className="p-3 bg-accent/5 rounded-lg border border-accent/20">
            <p className="text-xs font-medium text-accent mb-2">
              {activeTask === "Task 1" ? "Key Features to Include:" : "Key Points to Address:"}
            </p>
            <ul className="space-y-1">
              {(activeTask === "Task 1" ? task1Question.keyFeatures : task2Question.keyPoints).map((point, i) => (
                <li key={i} className="text-xs text-muted-foreground flex items-start gap-2">
                  <CheckCircle className="w-3 h-3 text-accent flex-shrink-0 mt-0.5" />
                  {point}
                </li>
              ))}
            </ul>
          </div>
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
            placeholder={`Write your ${activeTask} response here... (minimum ${minWords} words)`}
            className="h-[300px] bg-secondary/30 border-border/30 resize-none"
          />
          <div className="flex items-center justify-between mt-4">
            <Button
              variant="neumorphicPrimary"
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
              Based on the feedback above, revise your essay and submit it for re-grading to track your improvement.
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
      </div>
    </DashboardLayout>
  );
}
