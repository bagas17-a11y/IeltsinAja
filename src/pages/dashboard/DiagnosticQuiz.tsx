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
import { Brain, Target, ArrowRight, Trophy, Edit2, Crown, Map, Sparkles, CheckCircle } from "lucide-react";

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
  // ── Band 5 ── Reading comprehension, basic academic grammar, writing fundamentals
  {
    id: 1,
    passage: "Many people around the world do not have access to clean drinking water. This is a serious health problem because contaminated water can cause diseases such as cholera and typhoid. Governments and international organisations are working together to improve water supplies in affected regions.",
    text: "According to the passage, why is lack of clean water a serious problem?",
    options: [
      "It makes farming more difficult in rural areas",
      "It can lead to dangerous illnesses in people",
      "It causes economic problems for governments",
      "It reduces the amount of water available for industry"
    ],
    correctAnswer: 1,
    band: 5,
    skill: "Explicit reading comprehension"
  },
  {
    id: 2,
    text: "Which sentence is written correctly for an academic report?",
    options: [
      "The results shows that pollution have increased in recent years.",
      "The results show that pollution has increased in recent years.",
      "The results are showing that pollution increased in the recent years.",
      "The result show that pollution are increasing in recent year."
    ],
    correctAnswer: 1,
    band: 5,
    skill: "Writing — subject-verb agreement and tense"
  },
  {
    id: 3,
    text: "If the company does not reduce its carbon emissions, it ___ face significant financial penalties.",
    options: ["would", "will", "can", "had"],
    correctAnswer: 1,
    band: 5,
    skill: "First conditional"
  },
  {
    id: 4,
    text: "There are two main causes of traffic congestion in cities. ___, the number of private car owners has grown rapidly. Secondly, public transport has not kept pace with population growth.",
    options: ["Firstly", "For example", "However", "Therefore"],
    correctAnswer: 0,
    band: 5,
    skill: "Writing — sequencing connectors"
  },
  {
    id: 5,
    text: "The report ___ by a team of independent researchers over a period of twelve months.",
    options: ["wrote", "was written", "is writing", "has written"],
    correctAnswer: 1,
    band: 5,
    skill: "Passive voice"
  },

  // ── Band 6 ── Inferential reading, writing structure, discourse markers, vocabulary precision
  {
    id: 6,
    passage: "Many companies have introduced flexible working arrangements, allowing employees to work from home several days a week. Studies suggest this has raised overall productivity, though some managers worry that remote work reduces team cohesion and makes it harder to support junior staff who benefit from day-to-day contact with more experienced colleagues.",
    text: "What concern do some managers have about remote working?",
    options: [
      "Employees work too many hours at home",
      "It may be harder to keep teams connected and develop junior staff",
      "Home offices are too expensive for companies to fund",
      "Productivity falls significantly when staff work remotely"
    ],
    correctAnswer: 1,
    band: 6,
    skill: "Inferential reading comprehension"
  },
  {
    id: 7,
    text: "Which is the best opening sentence for an IELTS Task 2 essay on the topic: 'Some people think zoos serve an important purpose; others argue they should be closed.'?",
    options: [
      "I think zoos are good because animals can be protected there.",
      "Zoos are places where animals live and people go to see them.",
      "The role of zoos in modern society is a subject of considerable debate, with strong arguments on both sides.",
      "In this essay I will talk about zoos and why some people like them and some do not."
    ],
    correctAnswer: 2,
    band: 6,
    skill: "Writing — Task 2 essay introduction"
  },
  {
    id: 8,
    text: "The scientists hoped to ___ a connection between air quality and the rise in childhood respiratory conditions.",
    options: ["find out", "establish", "discover out", "research into"],
    correctAnswer: 1,
    band: 6,
    skill: "Academic collocations"
  },
  {
    id: 9,
    text: "Many students struggle with time management during examinations. ___, practising under timed conditions can lead to significant improvement.",
    options: ["Furthermore", "As a result", "Nevertheless", "In addition"],
    correctAnswer: 2,
    band: 6,
    skill: "Writing — contrast discourse markers"
  },
  {
    id: 10,
    text: "Which sentence would make the best thesis statement for a Task 2 essay arguing that technology has more benefits than drawbacks?",
    options: [
      "Technology is very important in today's world and affects many people.",
      "Although technology carries certain risks, its benefits to communication, education, and economic development considerably outweigh its drawbacks.",
      "I will discuss the advantages and disadvantages of technology in this essay.",
      "Technology has good and bad points that we need to think about carefully."
    ],
    correctAnswer: 1,
    band: 6,
    skill: "Writing — Task 2 thesis statement"
  },

  // ── Band 7 ── Critical reading, paragraph development, precise vocabulary, grammar, register
  {
    id: 11,
    passage: "The debate over four-day working weeks has grown in recent years, with several pilot programmes reporting improvements in employee wellbeing and productivity. Proponents argue that a shorter schedule encourages workers to cut inefficiencies and focus on outcomes. Sceptics, however, note that such pilots have overwhelmingly involved office-based, knowledge-work roles, and caution against assuming the results are transferable to sectors such as manufacturing, healthcare, and retail, where continuous coverage is essential.",
    text: "What is the main concern raised by sceptics regarding the four-day working week?",
    options: [
      "Employees will become less motivated with more leisure time",
      "Pilot programmes have not demonstrated genuine gains in productivity",
      "The positive findings may not apply equally across all types of employment",
      "Office-based workers are less productive than those in physical industries"
    ],
    correctAnswer: 2,
    band: 7,
    skill: "Critical reading — author's perspective"
  },
  {
    id: 12,
    text: "Which paragraph most effectively develops an argument for an IELTS Task 2 essay?",
    options: [
      "There are many advantages of social media. People use it to communicate. It is also used for business. Social media can be addictive though.",
      "One significant advantage of social media is its capacity to connect people across geographical boundaries. Platforms such as Instagram allow families separated by distance to maintain close relationships, reducing social isolation.",
      "Social media is very popular today and many people around the world use it for many different purposes including talking to friends and family.",
      "Social media has advantages and disadvantages. It helps people communicate but it also has problems like addiction and misinformation."
    ],
    correctAnswer: 1,
    band: 7,
    skill: "Writing — PEEL paragraph structure"
  },
  {
    id: 13,
    text: "The government introduced a series of ___ measures to address the housing crisis, covering tax incentives for developers, subsidies for buyers, and new planning regulations.",
    options: ["comprehensive", "general", "common", "normal"],
    correctAnswer: 0,
    band: 7,
    skill: "Academic vocabulary — precision"
  },
  {
    id: 14,
    text: "Which sentence uses the most appropriate style for a formal academic essay?",
    options: [
      "A lot of people think that governments should do more to help people living in poverty.",
      "Many individuals believe that governments should take further steps to support those in poverty.",
      "It is widely argued that governments bear a responsibility to implement more robust policies addressing systemic poverty.",
      "Governments really need to do much more for poor people, and most people agree with this."
    ],
    correctAnswer: 2,
    band: 7,
    skill: "Writing — academic register and nominalization"
  },
  {
    id: 15,
    text: "The research institute, ___ entire funding was withdrawn following the financial scandal, closed its doors permanently last year.",
    options: ["that", "which", "whose", "who's"],
    correctAnswer: 2,
    band: 7,
    skill: "Possessive relative clauses"
  },

  // ── Band 8 ── Complex inference, rare vocabulary, advanced grammar, sophisticated writing
  {
    id: 16,
    passage: "The concept of planned obsolescence — designing products to become outdated or non-functional within a set timeframe — has attracted growing criticism. Manufacturers argue that continuous product cycles drive innovation and keep prices competitive. Critics counter that this model prioritises profit over sustainability, generating vast quantities of electronic waste while compelling consumers to purchase replacements they do not genuinely need.",
    text: "How does the passage present the manufacturers' justification for planned obsolescence?",
    options: [
      "It is presented as a fully convincing argument that the passage endorses",
      "It is acknowledged, but the broader framing of the passage gives more weight to critics",
      "It is dismissed outright as irrelevant to the environmental debate",
      "It is treated as more credible than the critics' position"
    ],
    correctAnswer: 1,
    band: 8,
    skill: "Reading — author framing and implied stance"
  },
  {
    id: 17,
    text: "Which sentence demonstrates the most sophisticated academic writing?",
    options: [
      "Climate change is a really big problem and governments are not doing enough about it.",
      "Many people think that governments are not handling climate change as well as they should be.",
      "Governments around the world are clearly failing to deal with climate change.",
      "The inadequacy of governmental responses to climate change has drawn increasing criticism from both the scientific community and civil society."
    ],
    correctAnswer: 3,
    band: 8,
    skill: "Writing — advanced nominalization and register"
  },
  {
    id: 18,
    text: "___ the research team secured additional funding at an earlier stage, the study could have been expanded to include a far more representative sample.",
    options: ["Should", "If only", "Had", "Were"],
    correctAnswer: 2,
    band: 8,
    skill: "Third conditional — subject-auxiliary inversion"
  },
  {
    id: 19,
    text: "Which sentence makes the most effective conclusion for a Task 2 essay on renewable energy investment?",
    options: [
      "In conclusion, I have discussed both sides of the argument and there are many things to consider.",
      "In conclusion, while there are merits to both perspectives, the evidence suggests that the long-term economic and social benefits of investing in renewable energy considerably outweigh the short-term costs.",
      "To summarise, this essay has looked at the advantages and disadvantages of the topic in detail.",
      "Overall, this is a very complex issue and different people have different opinions on what should happen."
    ],
    correctAnswer: 1,
    band: 8,
    skill: "Writing — Task 2 conclusion"
  },
  {
    id: 20,
    text: "The historian's analysis was criticised as ___: she had applied the moral standards of the present to evaluate decisions made in an entirely different social and political context.",
    options: ["parochial", "reductive", "anachronistic", "ethnocentric"],
    correctAnswer: 2,
    band: 8,
    skill: "Advanced academic vocabulary — precision"
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
      navigate("/dashboard/study-plan");
    } catch (error) {
      console.error('Error saving result:', error);
      toast.error("Failed to save results");
    } finally {
      setIsSubmitting(false);
    }
  };

  const getTierConfig = (band: number) => {
    if (band <= 5.5) return {
      name: "Foundation",
      headline: "Start with the fundamentals",
      description: "Your English foundations need strengthening before exam technique can kick in. Your 8-week plan front-loads grammar and vocabulary, then adds each exam skill one at a time.",
      goal: "6.0–6.5",
      badge: "bg-blue-500/20 text-blue-400 border-blue-500/30",
      icon: Brain,
    };
    if (band <= 6.5) return {
      name: "Developing",
      headline: "Bridge the Band 7 gap",
      description: "You understand IELTS but need strategic depth. Your 8-week plan targets the exact skills that separate Band 6 from Band 7 — overview writing, data grouping, argument structure, and vocabulary precision.",
      goal: "7.0–7.5",
      badge: "bg-purple-500/20 text-purple-400 border-purple-500/30",
      icon: Target,
    };
    return {
      name: "Polishing",
      headline: "The final push to Band 8+",
      description: "You're performing at a high level. Your 6-week plan targets precision vocabulary, advanced grammar variety, and nuanced argument structure to close the Band 8 gap.",
      goal: "8.0–8.5",
      badge: "bg-amber-500/20 text-amber-400 border-amber-500/30",
      icon: Trophy,
    };
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
                Questions include grammar, vocabulary, short reading passages, and writing tasks.
                Answer honestly — your result is a genuine prediction of your current IELTS band.
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

          {/* Tier summary */}
          {(() => {
            const tier = getTierConfig(result.assignedBand);
            const TierIcon = tier.icon;
            return (
              <div className="glass-card p-6 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-accent/10 flex items-center justify-center">
                    <TierIcon className="w-5 h-5 text-accent" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full border ${tier.badge}`}>{tier.name} Track</span>
                      <span className="text-xs text-muted-foreground">→ Target Band {tier.goal}</span>
                    </div>
                    <p className="text-sm font-semibold text-foreground mt-0.5">{tier.headline}</p>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">{tier.description}</p>
                <div className="flex flex-wrap gap-2 pt-1">
                  {[
                    "Week-by-week study roadmap",
                    "Platform resource links",
                    "Task completion tracking",
                  ].map(f => (
                    <span key={f} className="flex items-center gap-1 text-xs text-muted-foreground bg-secondary/30 px-2.5 py-1 rounded-full border border-border/30">
                      <CheckCircle className="w-3 h-3 text-accent" /> {f}
                    </span>
                  ))}
                </div>
              </div>
            );
          })()}

          {/* Elite upsell for non-Elite users */}
          {profile?.subscription_tier !== "elite" && (
            <div className="glass-card p-5 border border-elite-gold/30 bg-elite-gold/5">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-elite-gold/20 flex items-center justify-center shrink-0">
                  <Crown className="w-5 h-5 text-elite-gold" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-foreground">Guaranteed +1.5 band increase with Elite</p>
                  <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
                    Your roadmap shows the path. Elite gives you the fuel — 1-on-1 coaching sessions, AI feedback on every submission, MudahinAja interactive tutorials, and full mock exams.
                  </p>
                  <div className="flex flex-wrap gap-2 mt-3">
                    <Button size="sm"
                      className="bg-elite-gold/20 text-elite-gold border border-elite-gold/30 hover:bg-elite-gold/30"
                      onClick={() => navigate("/pricing-selection")}>
                      Upgrade to Elite <Crown className="w-3.5 h-3.5 ml-1.5" />
                    </Button>
                    <Button size="sm" variant="ghost" className="text-muted-foreground"
                      onClick={saveResult} disabled={isSubmitting}>
                      {isSubmitting ? "Saving..." : "Save & continue free"}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}

          <Button
            onClick={saveResult}
            disabled={isSubmitting}
            className="w-full btn-neumorphic-primary"
          >
            {isSubmitting ? "Saving..." : "Save Results & View My Study Plan"}
            <Map className="w-4 h-4 ml-2" />
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
