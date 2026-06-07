import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { Brain, Target, ArrowRight, Trophy, Edit2 } from "lucide-react";

interface FamiliarityQuestion {
  id: string;
  text: string;
  options: string[];
  type: 'familiarity';
}

interface Question {
  id: number;
  text: string;
  passage?: string;
  options: string[];
  correctAnswer: number;
  band: 5 | 6 | 7 | 8;
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
  // ── Band 5 ── Explicit reading comprehension, basic academic grammar & vocabulary
  {
    id: 1,
    passage: "Deforestation is the removal of trees from forested areas. This process has several negative effects on the environment, including increased greenhouse gas emissions and loss of animal habitats. Governments in many countries have introduced laws to protect forested areas from further destruction.",
    text: "According to the passage, what is one consequence of deforestation?",
    options: [
      "It primarily affects urban areas",
      "It releases gases that contribute to climate change",
      "Animals benefit from reduced tree cover",
      "Governments have done nothing to address it"
    ],
    correctAnswer: 1,
    band: 5,
    skill: "Explicit reading comprehension"
  },
  {
    id: 2,
    text: "Despite the extensive clinical trials, the new medication proved ___; patients showed no measurable improvement in their condition.",
    options: ["effective", "conclusive", "ineffective", "promising"],
    correctAnswer: 2,
    band: 5,
    skill: "Vocabulary in context"
  },
  {
    id: 3,
    text: "If global temperatures continue to rise at the current rate, many coastal species ___ face extinction within the century.",
    options: ["would", "will", "can", "might have"],
    correctAnswer: 1,
    band: 5,
    skill: "First conditional"
  },
  {
    id: 4,
    text: "Scientists need to ___ further research into the long-term effects of the compound on human health.",
    options: ["do", "make", "conduct", "take"],
    correctAnswer: 2,
    band: 5,
    skill: "Academic collocations"
  },
  {
    id: 5,
    text: "The ancient ruins ___ to be at least 3,000 years old, based on carbon-dating evidence.",
    options: ["believe", "are believed", "believing", "believed"],
    correctAnswer: 1,
    band: 5,
    skill: "Passive voice"
  },

  // ── Band 6 ── Inferential reading, discourse markers, subjunctive, precise vocabulary
  {
    id: 6,
    passage: "Urban heat islands occur when cities are significantly warmer than surrounding rural areas. This phenomenon results from the replacement of natural vegetation with buildings and roads, which absorb and retain solar energy. While increasing urban greenery can mitigate this effect, most city planning continues to prioritize commercial and residential development over green infrastructure.",
    text: "What can be inferred from the passage about urban heat islands?",
    options: [
      "Rural areas are completely unaffected by the heat island phenomenon",
      "Industrial pollution is the primary driver of higher city temperatures",
      "Prevailing urban planning priorities are likely to make the problem worse",
      "Increasing urban greenery has been shown to be ineffective as a solution"
    ],
    correctAnswer: 2,
    band: 6,
    skill: "Inferential reading comprehension"
  },
  {
    id: 7,
    text: "Sales figures were deeply disappointing last quarter; ___, the board decided not to dismiss the chief executive.",
    options: ["consequently", "as a result", "furthermore", "nonetheless"],
    correctAnswer: 3,
    band: 6,
    skill: "Discourse markers — contrast"
  },
  {
    id: 8,
    text: "The researchers hoped to ___ a clear correlation between adolescent screen time and disrupted sleep patterns.",
    options: ["find out", "establish", "discover out", "research into"],
    correctAnswer: 1,
    band: 6,
    skill: "Academic collocations"
  },
  {
    id: 9,
    text: "The report was considered ___ because it presented only the evidence that supported its predetermined conclusions, ignoring contradictory data.",
    options: ["thorough", "comprehensive", "biased", "objective"],
    correctAnswer: 2,
    band: 6,
    skill: "Academic vocabulary — precision"
  },
  {
    id: 10,
    text: "The review board insisted that the entire project ___ by an independent committee before any findings could be published.",
    options: ["was approved", "is approved", "be approved", "approved"],
    correctAnswer: 2,
    band: 6,
    skill: "Subjunctive mood"
  },

  // ── Band 7 ── Author stance, inversion, precise academic vocabulary, register, possessive relative clause
  {
    id: 11,
    passage: "The concept of 'cognitive offloading' — using external tools to extend mental capacity — is not new. Ancient humans used cave paintings as memory aids long before writing systems emerged. What modern technology has changed is not the practice itself, but its pervasiveness and the degree of reliance upon it. Critics contend that this dependency erodes autonomous thought; proponents counter that freeing working memory from routine storage enables engagement with more complex problems.",
    text: "Which statement best describes the author's approach to the topic of cognitive offloading?",
    options: [
      "The author argues that cognitive offloading is harmful to human cognition",
      "The author presents competing perspectives without endorsing a definitive position",
      "The author implies that ancient cognitive practices were superior to modern ones",
      "The author concludes that technology has permanently damaged human intelligence"
    ],
    correctAnswer: 1,
    band: 7,
    skill: "Author's stance — critical reading"
  },
  {
    id: 12,
    text: "Not only ___ results consistent with previous studies, but the experiment also uncovered a previously unknown variable.",
    options: [
      "the experiment produced",
      "the experiment did produce",
      "did the experiment produce",
      "produced the experiment"
    ],
    correctAnswer: 2,
    band: 7,
    skill: "Inversion after negative adverbials"
  },
  {
    id: 13,
    text: "The government's response to the crisis was widely described as ___: it was designed to appear decisive while actually deferring any real commitment indefinitely.",
    options: ["ambiguous", "equivocal", "vague", "speculative"],
    correctAnswer: 1,
    band: 7,
    skill: "Precise academic vocabulary"
  },
  {
    id: 14,
    text: "Which sentence is most appropriate for a formal academic essay?",
    options: [
      "The economy got a lot better because companies started hiring more workers.",
      "Economic recovery was driven largely by growth in private-sector employment.",
      "Things improved economically once businesses decided to take on more staff.",
      "The economic situation improved a lot after more people managed to get jobs."
    ],
    correctAnswer: 1,
    band: 7,
    skill: "Academic register and nominalization"
  },
  {
    id: 15,
    text: "The research institute, ___ entire funding was withdrawn following the financial scandal, permanently closed its doors last year.",
    options: ["that", "which", "whose", "what"],
    correctAnswer: 2,
    band: 7,
    skill: "Possessive relative clauses"
  },

  // ── Band 8 ── Complex philosophical passage, rare vocabulary, third-conditional inversion, sophisticated register
  {
    id: 16,
    passage: "The paradox of tolerance, as articulated by philosopher Karl Popper, posits that unlimited tolerance must eventually lead to the disappearance of tolerance itself. A tolerant society that extends unrestricted acceptance to intolerant ideologies risks dismantlement by those very ideologies. Popper therefore argues that rational societies must reserve the right to suppress intolerance — not by prohibiting the expression of intolerant ideas, but by refusing to legitimize them and by treating their resort to force as criminal.",
    text: "According to Popper's argument, which scenario would most clearly justify a society actively suppressing an intolerant group?",
    options: [
      "When their ideas are considered offensive by a majority of citizens",
      "When they begin using violence or coercion to advance their ideology",
      "When their philosophical views contradict established democratic principles",
      "When they seek to limit the free expression of other groups"
    ],
    correctAnswer: 1,
    band: 8,
    skill: "Complex philosophical text — precise inference"
  },
  {
    id: 17,
    text: "The professor's interpretation was criticized as ___: she had imposed her own cultural framework onto texts produced by a fundamentally different civilization.",
    options: ["parochial", "ethnocentric", "anachronistic", "reductive"],
    correctAnswer: 1,
    band: 8,
    skill: "Advanced academic vocabulary"
  },
  {
    id: 18,
    text: "___ the authorities acted more swiftly upon initial reports, the outbreak might have been contained within the originating region.",
    options: ["Should", "If only", "Had", "Were"],
    correctAnswer: 2,
    band: 8,
    skill: "Third conditional — subject-auxiliary inversion"
  },
  {
    id: 19,
    text: "Which sentence demonstrates the most sophisticated academic register through effective nominalization?",
    options: [
      "People often disagree about how to understand ambiguous scientific findings.",
      "There is frequent disagreement regarding the interpretation of ambiguous scientific findings.",
      "Scientists sometimes cannot agree on how to read confusing data from experiments.",
      "Confusing scientific data leads to disagreements, so researchers often fail to reach consensus."
    ],
    correctAnswer: 1,
    band: 8,
    skill: "Nominalization and formal academic register"
  },
  {
    id: 20,
    passage: "Archaeological evidence indicates that Stonehenge was constructed in multiple phases over approximately 1,500 years, with the earliest phase dating to around 3000 BCE. The monument's bluestones were transported from quarries up to 240 miles distant — a logistical undertaking that, given the technology available at the time, would have required extraordinary communal organization. The precise purpose of the site remains contested, though the alignment of certain stones with the summer solstice sunrise implies both astronomical knowledge and possibly ritual significance.",
    text: "What does the passage most clearly imply about the society that constructed Stonehenge?",
    options: [
      "They possessed astronomical knowledge equivalent to that of modern scientists",
      "Their society was capable of sophisticated planning and large-scale collective effort",
      "The primary and definitive purpose of Stonehenge was religious ritual",
      "Archaeologists have now reached consensus about the monument's original function"
    ],
    correctAnswer: 1,
    band: 8,
    skill: "Complex inference — archaeological text"
  }
];

interface QuizResult {
  assignedBand: number;
  band5Score: number;
  band6Score: number;
  band7Score: number;
  band8Score: number;
  weakSkills: string[];
  familiarityAnswers: Record<string, number>;
}

type Phase = 'intro' | 'familiarity' | 'quiz' | 'result';

const TARGET_SCORE_OPTIONS = [5.5, 6, 6.5, 7, 7.5, 8, 8.5, 9];

export default function DiagnosticQuiz() {
  const navigate = useNavigate();
  const { user, profile, refreshProfile } = useAuth();
  const [phase, setPhase] = useState<Phase>('intro');
  const [familiarityIndex, setFamiliarityIndex] = useState(0);
  const [familiarityAnswers, setFamiliarityAnswers] = useState<Record<string, number>>({});
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [answers, setAnswers] = useState<(number | null)[]>(new Array(20).fill(null));
  const [result, setResult] = useState<QuizResult | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [targetScore, setTargetScore] = useState<number>(profile?.target_band_score || 7);

  const currentFamiliarityQ = familiarityQuestions[familiarityIndex];
  const question = quizQuestions[currentQuestion];
  const totalQuestions = familiarityQuestions.length + quizQuestions.length;
  const currentOverallIndex = phase === 'familiarity'
    ? familiarityIndex + 1
    : familiarityQuestions.length + currentQuestion + 1;
  const progress = (currentOverallIndex / totalQuestions) * 100;

  const calculateResult = (finalAnswers: (number | null)[]): QuizResult => {
    let band5Correct = 0;
    let band6Correct = 0;
    let band7Correct = 0;
    let band8Correct = 0;
    const weakSkills: string[] = [];

    for (let i = 0; i < 5; i++) {
      if (finalAnswers[i] === quizQuestions[i].correctAnswer) {
        band5Correct++;
      } else {
        weakSkills.push(quizQuestions[i].skill);
      }
    }
    for (let i = 5; i < 10; i++) {
      if (finalAnswers[i] === quizQuestions[i].correctAnswer) {
        band6Correct++;
      } else {
        weakSkills.push(quizQuestions[i].skill);
      }
    }
    for (let i = 10; i < 15; i++) {
      if (finalAnswers[i] === quizQuestions[i].correctAnswer) {
        band7Correct++;
      } else {
        weakSkills.push(quizQuestions[i].skill);
      }
    }
    for (let i = 15; i < 20; i++) {
      if (finalAnswers[i] === quizQuestions[i].correctAnswer) {
        band8Correct++;
      } else {
        weakSkills.push(quizQuestions[i].skill);
      }
    }

    // Weighted score: Band5×1 + Band6×2 + Band7×3 + Band8×4 (max = 50)
    const weightedScore = band5Correct * 1 + band6Correct * 2 + band7Correct * 3 + band8Correct * 4;

    let assignedBand: number;
    if (weightedScore >= 47) assignedBand = 8.5;
    else if (weightedScore >= 41) assignedBand = 8;
    else if (weightedScore >= 35) assignedBand = 7.5;
    else if (weightedScore >= 30) assignedBand = 7;
    else if (weightedScore >= 24) assignedBand = 6.5;
    else if (weightedScore >= 18) assignedBand = 6;
    else if (weightedScore >= 12) assignedBand = 5.5;
    else if (weightedScore >= 6) assignedBand = 5;
    else assignedBand = 4.5;

    return {
      assignedBand,
      band5Score: band5Correct,
      band6Score: band6Correct,
      band7Score: band7Correct,
      band8Score: band8Correct,
      weakSkills,
      familiarityAnswers
    };
  };

  const handleNext = () => {
    if (selectedAnswer === null) return;

    const newAnswers = [...answers];
    newAnswers[currentQuestion] = selectedAnswer;
    setAnswers(newAnswers);

    if (currentQuestion < quizQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
    } else {
      const finalResult = calculateResult(newAnswers);
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
      setSelectedAnswer(null);
      setPhase('quiz');
    }
  };

  useEffect(() => {
    if (result) {
      const suggestedTarget = Math.min(result.assignedBand + 1, 9);
      setTargetScore(suggestedTarget);
    }
  }, [result]);

  const saveResult = async () => {
    if (!user || !result) return;

    setIsSubmitting(true);
    try {
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          current_reading_score: result.assignedBand,
          target_band_score: targetScore,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', user.id);

      if (profileError) throw profileError;

      const totalCorrect = result.band5Score + result.band6Score + result.band7Score + result.band8Score;

      const { error: progressError } = await supabase
        .from('user_progress')
        .insert({
          user_id: user.id,
          exam_type: 'diagnostic',
          band_score: result.assignedBand,
          score: totalCorrect,
          total_questions: 20,
          correct_answers: totalCorrect,
          feedback: `Diagnostic Quiz completed. Assigned Band: ${result.assignedBand}. Target: ${targetScore}. Weak areas: ${result.weakSkills.join(', ')}`,
          metadata: {
            band5Score: result.band5Score,
            band6Score: result.band6Score,
            band7Score: result.band7Score,
            band8Score: result.band8Score,
            weakSkills: result.weakSkills,
            targetScore
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
              This assessment accurately determines your current IELTS band level
              and creates a personalized learning path for you.
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
                  <p className="font-medium">4 Background Questions</p>
                  <p className="text-sm text-muted-foreground">About your English and IELTS familiarity</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center shrink-0 mt-0.5">
                  <span className="text-sm font-medium text-accent">2</span>
                </div>
                <div>
                  <p className="font-medium">20 Skill Questions</p>
                  <p className="text-sm text-muted-foreground">Covering Bands 5 through 8 — answer all for the most accurate result</p>
                </div>
              </div>
            </div>

            <div className="bg-muted/50 rounded-lg p-4 mt-4">
              <p className="text-sm text-muted-foreground">
                Take your time and answer honestly. The harder questions are intentionally challenging —
                your result reflects a genuine prediction of your current IELTS band.
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
              Based on your performance, here is your predicted IELTS band score
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="glass-card p-8 text-center">
              <p className="text-sm text-muted-foreground mb-2">Your Predicted Band</p>
              <p className="text-5xl font-light text-accent mb-2">{result.assignedBand}</p>
            </div>

            <div className="glass-card p-8 text-center">
              <p className="text-sm text-muted-foreground mb-2 flex items-center justify-center gap-1">
                Your Target Band
                <Edit2 className="w-3 h-3" />
              </p>
              <Select
                value={targetScore.toString()}
                onValueChange={(val) => setTargetScore(parseFloat(val))}
              >
                <SelectTrigger className="w-32 mx-auto text-4xl font-light text-elite-gold border-none bg-transparent justify-center h-auto py-0">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {TARGET_SCORE_OPTIONS.filter(score => score > result.assignedBand).map((score) => (
                    <SelectItem key={score} value={score.toString()}>
                      {score}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground mt-2">
                Click to change
              </p>
            </div>
          </div>

          <div className="grid grid-cols-4 gap-3">
            <div className="glass-card p-4 text-center">
              <p className="text-xs text-muted-foreground mb-1">Band 5</p>
              <p className="text-2xl font-light text-foreground">{result.band5Score}/5</p>
            </div>
            <div className="glass-card p-4 text-center">
              <p className="text-xs text-muted-foreground mb-1">Band 6</p>
              <p className="text-2xl font-light text-foreground">{result.band6Score}/5</p>
            </div>
            <div className="glass-card p-4 text-center">
              <p className="text-xs text-muted-foreground mb-1">Band 7</p>
              <p className="text-2xl font-light text-foreground">{result.band7Score}/5</p>
            </div>
            <div className="glass-card p-4 text-center">
              <p className="text-xs text-muted-foreground mb-1">Band 8</p>
              <p className="text-2xl font-light text-foreground">{result.band8Score}/5</p>
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

  // Quiz phase
  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>Question {currentQuestion + 1} of {quizQuestions.length}</span>
            <span className="px-2 py-0.5 rounded-full bg-accent/10 text-accent text-xs">
              Skill Assessment
            </span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        <div className="glass-card p-8 space-y-6">
          {question.passage && (
            <div className="bg-muted/40 rounded-xl p-4 text-sm leading-relaxed border-l-4 border-accent/40 text-muted-foreground">
              {question.passage}
            </div>
          )}

          <h2 className="text-xl font-light">{question.text}</h2>

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
