import { useState } from "react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { BookOpen, Lightbulb, Loader2, CheckCircle, XCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const samplePassage = `The concept of sustainable architecture has evolved significantly over the past few decades. Initially focused primarily on energy efficiency, the field has expanded to encompass a holistic approach that considers environmental, social, and economic factors throughout a building's lifecycle.

Modern sustainable buildings incorporate various strategies to minimize their environmental impact. These include the use of renewable energy sources, such as solar panels and wind turbines, as well as passive design techniques that reduce the need for mechanical heating and cooling. Additionally, sustainable architects prioritize the use of locally sourced, recycled, and low-impact materials to reduce the carbon footprint associated with construction.

The benefits of sustainable architecture extend beyond environmental considerations. Studies have shown that green buildings can improve occupant health and productivity, reduce operating costs, and enhance property values. Furthermore, sustainable design practices often lead to innovative solutions that challenge conventional approaches to building design.`;

const sampleQuestion = {
  text: "According to the passage, sustainable architecture initially focused on:",
  options: [
    "A) Social and economic factors",
    "B) Energy efficiency",
    "C) Property values",
    "D) Occupant health",
  ],
  correct: "B",
  userAnswer: "",
};

export default function ReadingModule() {
  const [userAnswer, setUserAnswer] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [aiExplanation, setAiExplanation] = useState<any>(null);
  const { toast } = useToast();

  const handleSubmit = async () => {
    if (!userAnswer) {
      toast({ title: "Please select an answer", variant: "destructive" });
      return;
    }

    setIsSubmitted(true);
    const isCorrect = userAnswer === sampleQuestion.correct;

    if (!isCorrect) {
      setIsLoading(true);
      try {
        const { data, error } = await supabase.functions.invoke("ai-analyze", {
          body: {
            type: "reading",
            content: `Passage: ${samplePassage}\n\nQuestion: ${sampleQuestion.text}\nOptions: ${sampleQuestion.options.join(", ")}\nCorrect Answer: ${sampleQuestion.correct}\nStudent's Answer: ${userAnswer}`,
          },
        });

        if (error) throw error;
        setAiExplanation(data);
      } catch (error: any) {
        console.error("AI analysis error:", error);
        toast({
          title: "Could not generate explanation",
          description: "Please try again later.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleReset = () => {
    setUserAnswer("");
    setIsSubmitted(false);
    setAiExplanation(null);
  };

  return (
    <DashboardLayout>
      <div className="max-w-5xl">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center">
            <BookOpen className="w-6 h-6 text-accent" />
          </div>
          <div>
            <h1 className="text-2xl font-light">Reading Practice</h1>
            <p className="text-sm text-muted-foreground">AI-powered passage analysis</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-5 gap-6">
          {/* Passage */}
          <div className="lg:col-span-3">
            <div className="glass-card p-6">
              <h2 className="text-lg font-light mb-4 text-foreground">Reading Passage</h2>
              <div className="prose prose-invert max-w-none">
                <p className="text-foreground/80 leading-relaxed whitespace-pre-line">
                  {samplePassage}
                </p>
              </div>
            </div>

            {/* Question */}
            <div className="glass-card p-6 mt-6">
              <h3 className="text-lg font-light mb-4 text-foreground">Question 1</h3>
              <p className="text-foreground/80 mb-4">{sampleQuestion.text}</p>
              
              <div className="space-y-3">
                {sampleQuestion.options.map((option) => {
                  const optionLetter = option.charAt(0);
                  const isSelected = userAnswer === optionLetter;
                  const isCorrect = optionLetter === sampleQuestion.correct;
                  
                  return (
                    <button
                      key={option}
                      onClick={() => !isSubmitted && setUserAnswer(optionLetter)}
                      disabled={isSubmitted}
                      className={`w-full text-left p-4 rounded-xl border transition-all ${
                        isSubmitted
                          ? isCorrect
                            ? "border-green-500 bg-green-500/10"
                            : isSelected
                            ? "border-destructive bg-destructive/10"
                            : "border-border/30 opacity-50"
                          : isSelected
                          ? "border-accent bg-accent/10"
                          : "border-border/30 hover:border-border/50"
                      }`}
                    >
                      <span className="text-foreground/80">{option}</span>
                      {isSubmitted && isCorrect && (
                        <CheckCircle className="inline-block ml-2 w-4 h-4 text-green-500" />
                      )}
                      {isSubmitted && isSelected && !isCorrect && (
                        <XCircle className="inline-block ml-2 w-4 h-4 text-destructive" />
                      )}
                    </button>
                  );
                })}
              </div>

              <div className="mt-6 flex gap-3">
                {!isSubmitted ? (
                  <Button variant="neumorphicPrimary" onClick={handleSubmit}>
                    Submit Answer
                  </Button>
                ) : (
                  <Button variant="glass" onClick={handleReset}>
                    Try Another Question
                  </Button>
                )}
              </div>
            </div>
          </div>

          {/* AI Insight Sidebar */}
          <div className="lg:col-span-2">
            <div className="glass-card p-6 sticky top-8">
              <div className="flex items-center gap-2 mb-4">
                <Lightbulb className="w-5 h-5 text-accent" />
                <h3 className="text-lg font-light">AI Insight</h3>
              </div>

              {!isSubmitted && (
                <p className="text-sm text-muted-foreground">
                  Submit your answer to receive step-by-step logic explanation for incorrect responses.
                </p>
              )}

              {isSubmitted && userAnswer === sampleQuestion.correct && (
                <div className="text-green-500">
                  <CheckCircle className="w-8 h-8 mx-auto mb-3" />
                  <p className="text-center font-medium">Correct!</p>
                  <p className="text-sm text-muted-foreground text-center mt-2">
                    Great job! You identified the correct answer.
                  </p>
                </div>
              )}

              {isSubmitted && userAnswer !== sampleQuestion.correct && (
                <>
                  {isLoading ? (
                    <div className="flex flex-col items-center py-8">
                      <Loader2 className="w-8 h-8 text-accent animate-spin mb-3" />
                      <p className="text-sm text-muted-foreground">Generating explanation...</p>
                    </div>
                  ) : aiExplanation ? (
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm font-medium text-accent mb-2">Correct Answer</p>
                        <p className="text-foreground">{aiExplanation.correctAnswer}</p>
                      </div>

                      {aiExplanation.stepByStepLogic && (
                        <div>
                          <p className="text-sm font-medium text-accent mb-2">Step-by-Step Logic</p>
                          <ul className="space-y-2">
                            {aiExplanation.stepByStepLogic.map((step: string, i: number) => (
                              <li key={i} className="text-sm text-foreground/80 flex gap-2">
                                <span className="text-accent">{i + 1}.</span>
                                {step.replace(/^Step \d+:\s*/i, "")}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {aiExplanation.keySignalWords && (
                        <div>
                          <p className="text-sm font-medium text-accent mb-2">Key Signal Words</p>
                          <div className="flex flex-wrap gap-2">
                            {aiExplanation.keySignalWords.map((word: string, i: number) => (
                              <span key={i} className="px-2 py-1 rounded bg-accent/10 text-accent text-xs">
                                {word}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {aiExplanation.technique && (
                        <div>
                          <p className="text-sm font-medium text-accent mb-2">Technique</p>
                          <p className="text-sm text-foreground/80">{aiExplanation.technique}</p>
                        </div>
                      )}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      Unable to generate explanation. Please try again.
                    </p>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
