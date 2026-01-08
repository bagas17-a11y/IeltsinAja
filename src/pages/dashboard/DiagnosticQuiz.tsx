import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { CheckCircle, XCircle, Brain, Target, ArrowRight, Trophy } from "lucide-react";

interface FamiliarityQuestion {
  id: string;
  text: string;
  options: string[];
  type: 'familiarity';
}

interface Question {
  id: number;
  text: string;
  options: string[];
  correctAnswer: number;
  band: 5 | 6 | 7;
  skill: string;
}

const familiarityQuestions: FamiliarityQuestion[] = [
  {
    id: 'english_level',
    text: "How would you describe your current English proficiency?",
    options: [
      "Beginner - I can understand basic phrases",
      "Intermediate - I can handle everyday conversations",
      "Upper-Intermediate - I'm comfortable in most situations",
      "Advanced - I can express complex ideas fluently"
    ],
    type: 'familiarity'
  },
  {
    id: 'english_usage',
    text: "How often do you use English in your daily life?",
    options: [
      "Rarely - mostly in class or study",
      "Sometimes - casual conversations or media",
      "Often - work or study in English",
      "Daily - English is my primary language"
    ],
    type: 'familiarity'
  },
  {
    id: 'ielts_familiarity',
    text: "How familiar are you with the IELTS exam structure?",
    options: [
      "Not at all - this is completely new to me",
      "Slightly - I've heard about it but don't know details",
      "Moderately - I know the 4 sections and format",
      "Very familiar - I've studied or taken it before"
    ],
    type: 'familiarity'
  },
  {
    id: 'ielts_sections',
    text: "Which IELTS sections are you most concerned about?",
    options: [
      "Listening - understanding audio recordings",
      "Reading - comprehending long texts quickly",
      "Writing - organizing and expressing ideas",
      "Speaking - communicating verbally with confidence"
    ],
    type: 'familiarity'
  }
];

const quizQuestions: Question[] = [
  // Band 5: Basic Grammar (Tenses) and Everyday Vocabulary (Q1-5)
  {
    id: 1,
    text: "She ___ to the market every Sunday.",
    options: ["go", "goes", "going", "gone"],
    correctAnswer: 1,
    band: 5,
    skill: "Subject-verb agreement"
  },
  {
    id: 2,
    text: "I ___ my homework before dinner last night.",
    options: ["finish", "finishing", "finished", "finishes"],
    correctAnswer: 2,
    band: 5,
    skill: "Past tense"
  },
  {
    id: 3,
    text: "They ___ watching TV when I arrived.",
    options: ["are", "was", "were", "is"],
    correctAnswer: 2,
    band: 5,
    skill: "Past continuous"
  },
  {
    id: 4,
    text: "The opposite of 'happy' is ___.",
    options: ["angry", "sad", "tired", "excited"],
    correctAnswer: 1,
    band: 5,
    skill: "Basic vocabulary"
  },
  {
    id: 5,
    text: "We ___ have breakfast at 8 AM every day.",
    options: ["usual", "usually", "use", "using"],
    correctAnswer: 1,
    band: 5,
    skill: "Adverbs of frequency"
  },
  
  // Band 6: Synonyms and Connecting Words (Q6-10)
  {
    id: 6,
    text: "The project was successful. ___, we encountered some challenges.",
    options: ["Therefore", "However", "Because", "So"],
    correctAnswer: 1,
    band: 6,
    skill: "Connecting words - contrast"
  },
  {
    id: 7,
    text: "Which word is a synonym for 'increase'?",
    options: ["reduce", "maintain", "rise", "decrease"],
    correctAnswer: 2,
    band: 6,
    skill: "Synonyms"
  },
  {
    id: 8,
    text: "The weather was terrible. ___, the event was cancelled.",
    options: ["In contrast", "Although", "Consequently", "Despite"],
    correctAnswer: 2,
    band: 6,
    skill: "Cause and effect"
  },
  {
    id: 9,
    text: "She studied hard. ___, she passed the exam.",
    options: ["Nevertheless", "As a result", "On the other hand", "In contrast"],
    correctAnswer: 1,
    band: 6,
    skill: "Linking words"
  },
  {
    id: 10,
    text: "Which word means the same as 'significant'?",
    options: ["minor", "important", "small", "irrelevant"],
    correctAnswer: 1,
    band: 6,
    skill: "Academic vocabulary"
  },
  
  // Band 7: Advanced Grammar and Academic Collocations (Q11-15)
  {
    id: 11,
    text: "The book, ___ was written in 1920, is still popular today.",
    options: ["who", "which", "what", "where"],
    correctAnswer: 1,
    band: 7,
    skill: "Relative clauses"
  },
  {
    id: 12,
    text: "By the time she arrived, we ___ already left.",
    options: ["have", "had", "has", "having"],
    correctAnswer: 1,
    band: 7,
    skill: "Past perfect"
  },
  {
    id: 13,
    text: "The researchers ___ a groundbreaking discovery.",
    options: ["did", "made", "took", "got"],
    correctAnswer: 1,
    band: 7,
    skill: "Academic collocations"
  },
  {
    id: 14,
    text: "This evidence ___ the theory that was proposed earlier.",
    options: ["makes", "supports", "does", "gives"],
    correctAnswer: 1,
    band: 7,
    skill: "Academic collocations"
  },
  {
    id: 15,
    text: "The study, the results of ___ were published last week, has attracted attention.",
    options: ["that", "which", "what", "whom"],
    correctAnswer: 1,
    band: 7,
    skill: "Complex relative clauses"
  }
];

interface QuizResult {
  assignedBand: number;
  band5Score: number;
  band6Score: number;
  band7Score: number;
  stoppedEarly: boolean;
  weakSkills: string[];
  familiarityAnswers: Record<string, number>;
}

type Phase = 'intro' | 'familiarity' | 'quiz' | 'result';

export default function DiagnosticQuiz() {
  const navigate = useNavigate();
  const { user, refreshProfile } = useAuth();
  const [phase, setPhase] = useState<Phase>('intro');
  const [familiarityIndex, setFamiliarityIndex] = useState(0);
  const [familiarityAnswers, setFamiliarityAnswers] = useState<Record<string, number>>({});
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [answers, setAnswers] = useState<(number | null)[]>(new Array(15).fill(null));
  const [result, setResult] = useState<QuizResult | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const currentFamiliarityQ = familiarityQuestions[familiarityIndex];
  const question = quizQuestions[currentQuestion];
  const totalQuestions = familiarityQuestions.length + quizQuestions.length;
  const currentOverallIndex = phase === 'familiarity' 
    ? familiarityIndex + 1 
    : familiarityQuestions.length + currentQuestion + 1;
  const progress = (currentOverallIndex / totalQuestions) * 100;

  const calculateResult = (): QuizResult => {
    let band5Correct = 0;
    let band6Correct = 0;
    let band7Correct = 0;
    const weakSkills: string[] = [];

    // Count correct answers per band
    for (let i = 0; i < 5; i++) {
      if (answers[i] === quizQuestions[i].correctAnswer) {
        band5Correct++;
      } else {
        weakSkills.push(quizQuestions[i].skill);
      }
    }

    // Check if we should stop at Band 5
    const band5Missed = 5 - band5Correct;
    if (band5Missed > 2) {
      return {
        assignedBand: 5,
        band5Score: band5Correct,
        band6Score: 0,
        band7Score: 0,
        stoppedEarly: true,
        weakSkills,
        familiarityAnswers
      };
    }

    // Continue to Band 6
    for (let i = 5; i < 10; i++) {
      if (answers[i] === quizQuestions[i].correctAnswer) {
        band6Correct++;
      } else {
        weakSkills.push(quizQuestions[i].skill);
      }
    }

    // Continue to Band 7
    for (let i = 10; i < 15; i++) {
      if (answers[i] === quizQuestions[i].correctAnswer) {
        band7Correct++;
      } else {
        weakSkills.push(quizQuestions[i].skill);
      }
    }

    // Determine assigned band
    let assignedBand = 5;
    if (band5Correct >= 3 && band6Correct >= 3 && band7Correct === 5) {
      assignedBand = 7;
    } else if (band5Correct >= 3 && band6Correct >= 3) {
      assignedBand = 6.5;
    } else if (band5Correct >= 3) {
      assignedBand = 6;
    } else {
      assignedBand = 5.5;
    }

    return {
      assignedBand,
      band5Score: band5Correct,
      band6Score: band6Correct,
      band7Score: band7Correct,
      stoppedEarly: false,
      weakSkills,
      familiarityAnswers
    };
  };

  const handleNext = () => {
    if (selectedAnswer === null) return;

    const newAnswers = [...answers];
    newAnswers[currentQuestion] = selectedAnswer;
    setAnswers(newAnswers);

    // Check if we should stop early (after Q5)
    if (currentQuestion === 4) {
      let band5Missed = 0;
      for (let i = 0; i <= 4; i++) {
        const answer = i === 4 ? selectedAnswer : newAnswers[i];
        if (answer !== quizQuestions[i].correctAnswer) {
          band5Missed++;
        }
      }
      if (band5Missed > 2) {
        // Stop and assign Band 5
        setAnswers(newAnswers);
        const weakSkills: string[] = [];
        for (let i = 0; i <= 4; i++) {
          const answer = i === 4 ? selectedAnswer : newAnswers[i];
          if (answer !== quizQuestions[i].correctAnswer) {
            weakSkills.push(quizQuestions[i].skill);
          }
        }
        setResult({
          assignedBand: 5,
          band5Score: 5 - band5Missed,
          band6Score: 0,
          band7Score: 0,
          stoppedEarly: true,
          weakSkills,
          familiarityAnswers
        });
        setPhase('result');
        return;
      }
    }

    if (currentQuestion < quizQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
    } else {
      // Quiz complete
      const finalResult = calculateResult();
      setResult(finalResult);
      setPhase('result');
    }
  };

  const handleFamiliarityNext = () => {
    if (selectedAnswer === null) return;
    
    setFamiliarityAnswers({
      ...familiarityAnswers,
      [currentFamiliarityQ.id]: selectedAnswer
    });
    
    if (familiarityIndex < familiarityQuestions.length - 1) {
      setFamiliarityIndex(familiarityIndex + 1);
      setSelectedAnswer(null);
    } else {
      // Move to quiz phase
      setSelectedAnswer(null);
      setPhase('quiz');
    }
  };

  const saveResult = async () => {
    if (!user || !result) return;
    
    setIsSubmitting(true);
    try {
      // Update profile with diagnostic band score
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          current_reading_score: result.assignedBand,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', user.id);

      if (profileError) throw profileError;

      // Save progress entry
      const { error: progressError } = await supabase
        .from('user_progress')
        .insert({
          user_id: user.id,
          exam_type: 'diagnostic',
          band_score: result.assignedBand,
          score: result.band5Score + result.band6Score + result.band7Score,
          total_questions: result.stoppedEarly ? 5 : 15,
          correct_answers: result.band5Score + result.band6Score + result.band7Score,
          feedback: `Diagnostic Quiz completed. Assigned Band: ${result.assignedBand}. Weak areas: ${result.weakSkills.join(', ')}`,
          metadata: {
            band5Score: result.band5Score,
            band6Score: result.band6Score,
            band7Score: result.band7Score,
            stoppedEarly: result.stoppedEarly,
            weakSkills: result.weakSkills
          }
        });

      if (progressError) throw progressError;

      await refreshProfile();
      toast.success("Diagnostic results saved!");
      navigate("/dashboard");
    } catch (error) {
      console.error('Error saving result:', error);
      toast.error("Failed to save results");
    } finally {
      setIsSubmitting(false);
    }
  };

  const getBandLabel = (band: 5 | 6 | 7) => {
    switch (band) {
      case 5: return "Basic Level";
      case 6: return "Intermediate Level";
      case 7: return "Advanced Level";
    }
  };

  if (phase === 'intro') {
    return (
      <DashboardLayout>
        <div className="max-w-2xl mx-auto space-y-8">
          <div className="text-center space-y-4">
            <div className="w-20 h-20 rounded-full bg-accent/10 flex items-center justify-center mx-auto">
              <Brain className="w-10 h-10 text-accent" />
            </div>
            <h1 className="text-3xl font-light">Diagnostic Quiz</h1>
            <p className="text-muted-foreground">
              This assessment will determine your current IELTS band level
              and create a personalized learning path for you.
            </p>
          </div>

          <div className="glass-card p-6 space-y-4">
            <h3 className="font-medium text-lg">How it works:</h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center shrink-0 mt-0.5">
                  <span className="text-sm font-medium text-accent">1</span>
                </div>
                <div>
                  <p className="font-medium">First: 4 Background Questions</p>
                  <p className="text-sm text-muted-foreground">About your English and IELTS familiarity</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center shrink-0 mt-0.5">
                  <span className="text-sm font-medium text-accent">2</span>
                </div>
                <div>
                  <p className="font-medium">Then: 15 Skill Questions</p>
                  <p className="text-sm text-muted-foreground">Testing Band 5, 6, and 7 level skills</p>
                </div>
              </div>
            </div>

            <div className="bg-muted/50 rounded-lg p-4 mt-4">
              <p className="text-sm text-muted-foreground">
                <strong>Note:</strong> If you miss more than 2 questions in the first section, 
                the quiz will stop and assign you Band 5 to focus on fundamentals first.
              </p>
            </div>
          </div>

          <Button 
            onClick={() => setPhase('familiarity')} 
            className="w-full btn-neumorphic-primary"
          >
            Start Diagnostic Quiz
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  if (phase === 'familiarity') {
    return (
      <DashboardLayout>
        <div className="max-w-2xl mx-auto space-y-6">
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Question {familiarityIndex + 1} of {totalQuestions}</span>
              <span className="px-2 py-0.5 rounded-full bg-accent/10 text-accent text-xs">
                Background
              </span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          <div className="glass-card p-8 space-y-6">
            <h2 className="text-xl font-light">{currentFamiliarityQ.text}</h2>

            <RadioGroup
              value={selectedAnswer?.toString()}
              onValueChange={(value) => setSelectedAnswer(parseInt(value))}
              className="space-y-3"
            >
              {currentFamiliarityQ.options.map((option, index) => (
                <div
                  key={index}
                  className={`flex items-center space-x-3 p-4 rounded-xl border transition-all cursor-pointer ${
                    selectedAnswer === index
                      ? "border-accent bg-accent/5"
                      : "border-border hover:border-accent/50"
                  }`}
                  onClick={() => setSelectedAnswer(index)}
                >
                  <RadioGroupItem value={index.toString()} id={`fam-option-${index}`} />
                  <Label 
                    htmlFor={`fam-option-${index}`} 
                    className="flex-1 cursor-pointer text-foreground"
                  >
                    {option}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          <Button
            onClick={handleFamiliarityNext}
            disabled={selectedAnswer === null}
            className="w-full btn-neumorphic-primary"
          >
            {familiarityIndex < familiarityQuestions.length - 1 ? "Next Question" : "Start Skill Assessment"}
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  if (phase === 'result' && result) {
    return (
      <DashboardLayout>
        <div className="max-w-2xl mx-auto space-y-8">
          <div className="text-center space-y-4">
            <div className="w-20 h-20 rounded-full bg-elite-gold/10 flex items-center justify-center mx-auto">
              <Trophy className="w-10 h-10 text-elite-gold" />
            </div>
            <h1 className="text-3xl font-light">Your Diagnostic Results</h1>
            <p className="text-muted-foreground">
              Based on your performance, here's your personalized assessment
            </p>
          </div>

          <div className="glass-card p-8 text-center">
            <p className="text-sm text-muted-foreground mb-2">Your Assigned Band</p>
            <p className="text-6xl font-light text-accent mb-4">{result.assignedBand}</p>
            {result.stoppedEarly && (
              <p className="text-sm text-elite-gold">
                Quiz stopped early to focus on fundamentals
              </p>
            )}
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="glass-card p-4 text-center">
              <p className="text-xs text-muted-foreground mb-1">Band 5 (Basic)</p>
              <p className="text-2xl font-light text-foreground">{result.band5Score}/5</p>
            </div>
            <div className="glass-card p-4 text-center">
              <p className="text-xs text-muted-foreground mb-1">Band 6 (Intermediate)</p>
              <p className="text-2xl font-light text-foreground">
                {result.stoppedEarly ? "—" : `${result.band6Score}/5`}
              </p>
            </div>
            <div className="glass-card p-4 text-center">
              <p className="text-xs text-muted-foreground mb-1">Band 7 (Advanced)</p>
              <p className="text-2xl font-light text-foreground">
                {result.stoppedEarly ? "—" : `${result.band7Score}/5`}
              </p>
            </div>
          </div>

          {result.weakSkills.length > 0 && (
            <div className="glass-card p-6">
              <h3 className="font-medium mb-4 flex items-center gap-2">
                <Target className="w-5 h-5 text-accent" />
                Areas to Improve
              </h3>
              <div className="flex flex-wrap gap-2">
                {result.weakSkills.map((skill, index) => (
                  <span 
                    key={index}
                    className="px-3 py-1 rounded-full bg-destructive/10 text-destructive text-sm"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          <Button 
            onClick={saveResult}
            disabled={isSubmitting}
            className="w-full btn-neumorphic-primary"
          >
            {isSubmitting ? "Saving..." : "Save Results & View Dashboard"}
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Progress */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>Question {currentQuestion + 1} of {quizQuestions.length}</span>
            <span className="px-2 py-0.5 rounded-full bg-accent/10 text-accent text-xs">
              {getBandLabel(question.band)}
            </span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Question Card */}
        <div className="glass-card p-8 space-y-6">
          <div>
            <p className="text-xs text-muted-foreground mb-2">
              Skill: {question.skill}
            </p>
            <h2 className="text-xl font-light">{question.text}</h2>
          </div>

          <RadioGroup
            value={selectedAnswer?.toString()}
            onValueChange={(value) => setSelectedAnswer(parseInt(value))}
            className="space-y-3"
          >
            {question.options.map((option, index) => (
              <div
                key={index}
                className={`flex items-center space-x-3 p-4 rounded-xl border transition-all cursor-pointer ${
                  selectedAnswer === index
                    ? "border-accent bg-accent/5"
                    : "border-border hover:border-accent/50"
                }`}
                onClick={() => setSelectedAnswer(index)}
              >
                <RadioGroupItem value={index.toString()} id={`option-${index}`} />
                <Label 
                  htmlFor={`option-${index}`} 
                  className="flex-1 cursor-pointer text-foreground"
                >
                  {option}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>

        <Button
          onClick={handleNext}
          disabled={selectedAnswer === null}
          className="w-full btn-neumorphic-primary"
        >
          {currentQuestion < quizQuestions.length - 1 ? "Next Question" : "Finish Quiz"}
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </DashboardLayout>
  );
}
