import { useState } from "react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PenTool, Loader2, ChevronRight, Star, Users, AlertTriangle, CheckCircle, Target, Edit3, ArrowRight, Lightbulb } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth, isSuperAdmin } from "@/hooks/useAuth";

const modelEssayTask1 = `The line graph displays the stock values of four different high-tech corporations from 2011 to 2016. Overall, Facebook's value steadily increased, while Yahoo's decreased. Apple's stock price fluctuated wildly throughout the period and Google's stayed relatively unchanged.

Facebook started the period with a stock market valuation of approximately 7,500 and this consistently moved up in value year on year to reach a peak of around 20,000 in 2016. Yahoo began the recorded period with a very similar value to Facebook, but in contrast, its stock devalued every year, until it reached a low of about 2,500 in 2016.

Apple stock was valued at just below 5,000 in 2011 and this jumped dramatically to nearly 35,000 the following year, before plummeting to around 7,000 in 2013. It recovered slightly in 2014 to around 12,000 and subsequently fell to a price of just over 5,000 in 2016. Google's shares remained at around 1,000 for the entire period.`;

const modelEssayTask2 = `Experts throughout both the developing and developed world have debated whether the advent of sophisticated modern technology such as mobile phones, laptops and iPad have helped to enhance and improve people's social lives or whether the opposite has become the case.

Personally, I strongly advocate the former view. This essay will discuss both sides using examples from the UK government and Oxford University to demonstrate points and prove arguments.

On the one hand there is ample, powerful, almost daily evidence that such technology can be detrimental especially to the younger generation who are more easily affected by its addictive nature and which can result in people feeling more isolated from the society.

The central reason behind this is twofold, firstly, the invention of online social media sites and apps, such as Twitter and Facebook have reduced crucial face-to-face interactions dramatically. Through use of these appealing and attractive mediums, people feel in touch and connected yet lack key social skills and the ability to communicate.

Secondly, dependence on such devices is built up frighteningly easily which may have a damaging effect on mental health and encourage a sedentary lifestyle. For example, recent scientific research by the UK government demonstrated that 90% of people in their 30s spend over 20 hours per week on Messenger and similar applications to chat with their friends instead of meeting up and spending quality time together or doing sport.

On the other hand, although there are significant downsides to technological developments, its multifold advantages cannot be denied. This is largely because the popularity of technology such as cellphones allows people to connect freely and easily with no geographical barriers.

From the arguments and examples given I firmly believe that overall communication and mans' sociability has been advanced enormously due to the huge technological progress of the past twenty years.`;

export default function WritingModule() {
  const [activeTask, setActiveTask] = useState<"Task 1" | "Task 2">("Task 1");
  const [essay, setEssay] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [feedback, setFeedback] = useState<any>(null);
  const [adminNote, setAdminNote] = useState("");
  const [adminOverrideScore, setAdminOverrideScore] = useState("");
  const { toast } = useToast();
  const { profile, user } = useAuth();
  const isAdmin = isSuperAdmin(user?.email);

  const minWords = activeTask === "Task 1" ? 150 : 250;
  const currentModelEssay = activeTask === "Task 1" ? modelEssayTask1 : modelEssayTask2;

  const handleAnalyze = async () => {
    if (essay.trim().length < 50) {
      toast({
        title: "Essay too short",
        description: "Please write more content for meaningful feedback.",
        variant: "destructive",
      });
      return;
    }

    setIsAnalyzing(true);
    try {
      const { data, error } = await supabase.functions.invoke("ai-analyze", {
        body: {
          type: "writing",
          content: essay,
          taskType: activeTask,
        },
      });

      if (error) throw error;
      setFeedback(data);
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
      setIsAnalyzing(false);
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
    setEssay("");
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

          <TabsContent value="Task 1" className="mt-6">
            <p className="text-sm text-muted-foreground mb-4">
              <strong>Task 1 Academic:</strong> Describe and summarize visual information (graph, chart, table, diagram, map, or process). Minimum 150 words.
            </p>
          </TabsContent>
          <TabsContent value="Task 2" className="mt-6">
            <p className="text-sm text-muted-foreground mb-4">
              <strong>Task 2:</strong> Write an essay in response to a point of view, argument, or problem. Minimum 250 words.
            </p>
          </TabsContent>
        </Tabs>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Model Essay */}
          <div className="glass-card p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-light flex items-center gap-2">
                <Star className="w-4 h-4 text-elite-gold" />
                Band 9 Model Essay
              </h2>
              <span className="text-xs px-2 py-1 rounded-full bg-elite-gold/10 text-elite-gold">
                {activeTask}
              </span>
            </div>
            <p className="text-xs text-muted-foreground mb-4">
              {activeTask === "Task 1" 
                ? "Topic: Stock values of high-tech corporations (2011-2016)"
                : "Topic: Has technology improved or harmed our social lives?"}
            </p>
            <div className="h-[400px] overflow-y-auto pr-2">
              <p className="text-sm text-foreground/80 leading-relaxed whitespace-pre-line">
                {currentModelEssay}
              </p>
            </div>
          </div>

          {/* User Essay */}
          <div className="glass-card p-6">
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
              className="h-[350px] bg-secondary/30 border-border/30 resize-none"
            />
            <div className="flex items-center justify-between mt-4">
              <Button
                variant="neumorphicPrimary"
                onClick={handleAnalyze}
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
        </div>

        {/* Feedback Section */}
        {feedback && (
          <div className="glass-card p-6 mt-6 space-y-6">
            <h2 className="text-lg font-light mb-6">Diagnostic Feedback Report</h2>
            
            {/* Executive Summary */}
            {feedback.executiveSummary && (
              <div className="p-4 bg-accent/10 rounded-lg border border-accent/20">
                <h3 className="text-sm font-medium text-accent mb-2 flex items-center gap-2">
                  <Target className="w-4 h-4" />
                  Executive Summary
                </h3>
                <p className="text-sm text-foreground/80">{feedback.executiveSummary}</p>
              </div>
            )}

            {/* Overall Score */}
            <div className="flex items-center justify-center py-4">
              <div className="text-center">
                <div className="w-24 h-24 rounded-full bg-accent/20 flex items-center justify-center mx-auto mb-2">
                  <span className="text-4xl font-light text-accent">{feedback.overallBand}</span>
                </div>
                <p className="text-sm text-muted-foreground">Overall Band Score</p>
              </div>
            </div>

            {/* Scoring Grid */}
            {feedback.scoringGrid && (
              <div>
                <h3 className="text-sm font-medium text-foreground mb-4">The Scoring Grid</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <ScoreCell 
                    label="Task Response" 
                    score={feedback.scoringGrid.taskResponse?.score || 0}
                    justification={feedback.scoringGrid.taskResponse?.justification}
                  />
                  <ScoreCell 
                    label="Coherence & Cohesion" 
                    score={feedback.scoringGrid.coherenceCohesion?.score || 0}
                    justification={feedback.scoringGrid.coherenceCohesion?.justification}
                  />
                  <ScoreCell 
                    label="Lexical Resource" 
                    score={feedback.scoringGrid.lexicalResource?.score || 0}
                    justification={feedback.scoringGrid.lexicalResource?.justification}
                  />
                  <ScoreCell 
                    label="Grammatical Range & Accuracy" 
                    score={feedback.scoringGrid.grammaticalRange?.score || 0}
                    justification={feedback.scoringGrid.grammaticalRange?.justification}
                  />
                </div>
              </div>
            )}

            {/* Band 8.0+ Transformations */}
            {feedback.band8Transformations && feedback.band8Transformations.length > 0 && (
              <div>
                <h3 className="text-sm font-medium text-elite-gold mb-4 flex items-center gap-2">
                  <Star className="w-4 h-4" />
                  The Band 8.0+ Transformation
                </h3>
                <div className="space-y-4">
                  {feedback.band8Transformations.map((transform: any, i: number) => (
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
            {feedback.criticalFixes && feedback.criticalFixes.length > 0 && (
              <div className="p-4 bg-red-500/5 rounded-lg border border-red-500/20">
                <h3 className="text-sm font-medium text-red-500 mb-3 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4" />
                  Critical Fixes
                </h3>
                <ul className="space-y-2">
                  {feedback.criticalFixes.map((fix: string, i: number) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-foreground/70">
                      <ChevronRight className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
                      {fix}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Actionable Next Step */}
            {feedback.actionableNextStep && (
              <div className="p-4 bg-green-500/5 rounded-lg border border-green-500/20">
                <h3 className="text-sm font-medium text-green-500 mb-2 flex items-center gap-2">
                  <Lightbulb className="w-4 h-4" />
                  Actionable Next Step
                </h3>
                <p className="text-sm text-foreground/80">{feedback.actionableNextStep}</p>
              </div>
            )}

            {/* Legacy feedback support */}
            {!feedback.scoringGrid && feedback.taskAchievement && (
              <div className="grid md:grid-cols-2 gap-4">
                <ScoreCell label="Task Achievement" score={feedback.taskAchievement?.score || 0} />
                <ScoreCell label="Coherence" score={feedback.coherenceCohesion?.score || 0} />
                <ScoreCell label="Lexical Resource" score={feedback.lexicalResource?.score || 0} />
                <ScoreCell label="Grammar" score={feedback.grammaticalRange?.score || 0} />
              </div>
            )}

            {/* Admin Override Section */}
            {isAdmin && (
              <Card className="border-destructive/30 bg-destructive/5">
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
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={handleAdminOverride}
                      disabled={!adminOverrideScore}
                    >
                      Apply Override
                    </Button>
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground mb-1 block">Admin Note</label>
                    <Textarea
                      placeholder="Add a note explaining the override..."
                      value={adminNote}
                      onChange={(e) => setAdminNote(e.target.value)}
                      className="min-h-[80px]"
                    />
                  </div>
                  {feedback.adminOverride && (
                    <div className="text-xs text-destructive">
                      ⚠️ Score has been manually overridden by admin
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {/* Consultant Upsell */}
        <div className="glass-card p-6 mt-6 bg-elite-gold/5 border-elite-gold/20">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-elite-gold/20 flex items-center justify-center flex-shrink-0">
              <Users className="w-6 h-6 text-elite-gold" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-light text-elite-gold mb-1">
                Break the Band 7 Ceiling
              </h3>
              <p className="text-sm text-muted-foreground">
                AI can check your grammar, but only a Senior Consultant can perfect your tone. 
                Book a 1-on-1 session with an ex-examiner for personalized feedback.
              </p>
            </div>
            <Button
              variant="glass"
              className="border-elite-gold/30 text-elite-gold hover:bg-elite-gold/10"
              onClick={() => window.location.href = "/dashboard/consultation"}
            >
              Book Session
            </Button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
