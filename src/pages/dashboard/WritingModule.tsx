import { useState } from "react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { PenTool, Loader2, ChevronRight, Star, Users } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";

const modelEssay = `The question of whether governments should invest more in public transportation or roads has become increasingly relevant in modern urban planning. While both options have their merits, I firmly believe that prioritizing public transportation offers more substantial long-term benefits for society.

First and foremost, investing in public transportation significantly reduces environmental impact. Buses, trains, and metros can transport hundreds of passengers simultaneously, drastically reducing per-capita carbon emissions compared to private vehicles. In cities like Copenhagen and Tokyo, robust public transit systems have contributed to measurably lower pollution levels and improved air quality.

Furthermore, enhanced public transportation promotes social equity. Unlike private vehicles, which require significant financial investment, public transit provides affordable mobility for all citizens regardless of income level. This democratization of transportation enables lower-income individuals to access employment opportunities, healthcare facilities, and educational institutions that might otherwise be unreachable.

However, it would be remiss to completely dismiss road infrastructure investment. Well-maintained roads are essential for emergency services, freight transportation, and connecting rural areas where public transit may not be economically viable. The key lies in striking a balanced approach.

In conclusion, while roads remain necessary components of transportation infrastructure, governments should prioritize public transportation investment. The environmental benefits, social equity improvements, and efficient use of urban space make it the superior choice for sustainable urban development.`;

export default function WritingModule() {
  const [essay, setEssay] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [feedback, setFeedback] = useState<any>(null);
  const { toast } = useToast();
  const { profile } = useAuth();

  const handleAnalyze = async () => {
    if (essay.trim().length < 100) {
      toast({
        title: "Essay too short",
        description: "Please write at least 100 words for meaningful feedback.",
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
          taskType: "Task 2",
        },
      });

      if (error) throw error;
      setFeedback(data);
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

  const ScoreCircle = ({ score, label }: { score: number; label: string }) => (
    <div className="text-center">
      <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-2">
        <span className="text-xl font-light text-accent">{score}</span>
      </div>
      <p className="text-xs text-muted-foreground">{label}</p>
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
              <p className="text-sm text-muted-foreground">AI-powered essay analysis</p>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Model Essay */}
          <div className="glass-card p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-light flex items-center gap-2">
                <Star className="w-4 h-4 text-elite-gold" />
                Band 9 Model Essay
              </h2>
              <span className="text-xs px-2 py-1 rounded-full bg-elite-gold/10 text-elite-gold">
                Task 2
              </span>
            </div>
            <p className="text-xs text-muted-foreground mb-4">
              Topic: Should governments invest more in public transportation or roads?
            </p>
            <div className="h-[400px] overflow-y-auto pr-2">
              <p className="text-sm text-foreground/80 leading-relaxed whitespace-pre-line">
                {modelEssay}
              </p>
            </div>
          </div>

          {/* User Essay */}
          <div className="glass-card p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-light">Your Essay</h2>
              <span className="text-xs text-muted-foreground">
                {essay.split(/\s+/).filter(Boolean).length} words
              </span>
            </div>
            <Textarea
              value={essay}
              onChange={(e) => setEssay(e.target.value)}
              placeholder="Write your essay here... (minimum 100 words)"
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
          <div className="glass-card p-6 mt-6">
            <h2 className="text-lg font-light mb-6">AI Analysis Results</h2>
            
            {/* Score Overview */}
            <div className="flex items-center justify-around mb-8 py-4 border-y border-border/30">
              <div className="text-center">
                <div className="w-20 h-20 rounded-full bg-accent/20 flex items-center justify-center mx-auto mb-2">
                  <span className="text-3xl font-light text-accent">{feedback.overallBand}</span>
                </div>
                <p className="text-sm text-muted-foreground">Overall Band</p>
              </div>
              <ScoreCircle score={feedback.taskAchievement?.score || 0} label="Task Achievement" />
              <ScoreCircle score={feedback.coherenceCohesion?.score || 0} label="Coherence" />
              <ScoreCircle score={feedback.lexicalResource?.score || 0} label="Lexical Resource" />
              <ScoreCircle score={feedback.grammaticalRange?.score || 0} label="Grammar" />
            </div>

            {/* Detailed Feedback */}
            <div className="grid md:grid-cols-2 gap-6">
              {feedback.taskAchievement?.feedback && (
                <div>
                  <h3 className="text-sm font-medium text-accent mb-2">Task Achievement</h3>
                  <p className="text-sm text-foreground/70">{feedback.taskAchievement.feedback}</p>
                </div>
              )}
              {feedback.coherenceCohesion?.feedback && (
                <div>
                  <h3 className="text-sm font-medium text-accent mb-2">Coherence & Cohesion</h3>
                  <p className="text-sm text-foreground/70">{feedback.coherenceCohesion.feedback}</p>
                </div>
              )}
              {feedback.lexicalResource?.feedback && (
                <div>
                  <h3 className="text-sm font-medium text-accent mb-2">Lexical Resource</h3>
                  <p className="text-sm text-foreground/70">{feedback.lexicalResource.feedback}</p>
                </div>
              )}
              {feedback.grammaticalRange?.feedback && (
                <div>
                  <h3 className="text-sm font-medium text-accent mb-2">Grammatical Range</h3>
                  <p className="text-sm text-foreground/70">{feedback.grammaticalRange.feedback}</p>
                </div>
              )}
            </div>

            {/* Improvements */}
            {feedback.improvements && (
              <div className="mt-6">
                <h3 className="text-sm font-medium text-elite-gold mb-3">Key Improvements</h3>
                <ul className="space-y-2">
                  {feedback.improvements.map((item: string, i: number) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-foreground/70">
                      <ChevronRight className="w-4 h-4 text-elite-gold flex-shrink-0 mt-0.5" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
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
