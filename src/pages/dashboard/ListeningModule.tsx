import { useState, useRef, useEffect, useCallback } from "react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Headphones, 
  Play, 
  Volume2, 
  VolumeX, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  FileText,
  RefreshCw,
  ChevronRight
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { useUserProgress } from "@/hooks/useUserProgress";
import { useFeatureGating } from "@/hooks/useFeatureGating";
import { UpgradeModal } from "@/components/UpgradeModal";

interface Question {
  id: number;
  type: "gap-fill" | "multiple-choice";
  part: number;
  text: string;
  options?: string[];
  blankPosition?: number; // For inline gap-fill
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
}

interface UserAnswers {
  [questionId: string]: string;
}

interface CachedListeningState {
  testId: string;
  answers: UserAnswers;
  notes: string;
  hasPlayed: boolean;
  timeRemaining: number;
  isSubmitted: boolean;
  score?: number;
  results?: Record<string, { correct: boolean; correctAnswer: string }>;
}

const LISTENING_CACHE_KEY = "ielts-listening-cache";

export default function ListeningModule() {
  const { user } = useAuth();
  const [tests, setTests] = useState<ListeningTest[]>([]);
  const [currentTest, setCurrentTest] = useState<ListeningTest | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [answers, setAnswers] = useState<UserAnswers>({});
  const [notes, setNotes] = useState("");
  const [hasPlayed, setHasPlayed] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [score, setScore] = useState<number | null>(null);
  const [results, setResults] = useState<Record<string, { correct: boolean; correctAnswer: string }>>({});
  const [showTranscript, setShowTranscript] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  
  const audioRef = useRef<HTMLAudioElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  
  const [cachedState, setCachedState] = useLocalStorage<CachedListeningState | null>(
    LISTENING_CACHE_KEY,
    null
  );
  const { saveProgress } = useUserProgress();
  const { canAccess, refreshCounts } = useFeatureGating();

  // Load available tests
  useEffect(() => {
    fetchTests();
  }, []);

  // Restore cached state
  useEffect(() => {
    if (cachedState && tests.length > 0 && !currentTest) {
      const cachedTest = tests.find(t => t.id === cachedState.testId);
      if (cachedTest) {
        setCurrentTest(cachedTest);
        setAnswers(cachedState.answers);
        setNotes(cachedState.notes);
        setHasPlayed(cachedState.hasPlayed);
        setTimeRemaining(cachedState.timeRemaining);
        setIsSubmitted(cachedState.isSubmitted);
        if (cachedState.score !== undefined) setScore(cachedState.score);
        if (cachedState.results) setResults(cachedState.results);
      }
    }
  }, [tests, cachedState]);

  // Save state to cache
  useEffect(() => {
    if (currentTest) {
      setCachedState({
        testId: currentTest.id,
        answers,
        notes,
        hasPlayed,
        timeRemaining,
        isSubmitted,
        score: score ?? undefined,
        results: Object.keys(results).length > 0 ? results : undefined,
      });
    }
  }, [currentTest, answers, notes, hasPlayed, timeRemaining, isSubmitted, score, results]);

  // Timer logic
  useEffect(() => {
    if (hasPlayed && !isSubmitted && timeRemaining > 0) {
      timerRef.current = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            handleSubmit();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [hasPlayed, isSubmitted, timeRemaining]);

  const fetchTests = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("listening_library")
        .select("*")
        .eq("is_active", true);

      if (error) throw error;

      const formattedTests: ListeningTest[] = (data || []).map(test => ({
        id: test.id,
        title: test.title,
        audio_url: test.audio_url,
        transcript: test.transcript,
        questions: test.questions as unknown as Question[],
        answer_key: test.answer_key as unknown as Record<string, string>,
        difficulty: test.difficulty || "medium",
        duration_minutes: test.duration_minutes || 30,
      }));

      setTests(formattedTests);
    } catch (error) {
      console.error("Error fetching listening tests:", error);
      toast.error("Failed to load listening tests");
    } finally {
      setIsLoading(false);
    }
  };

  const startTest = (test: ListeningTest) => {
    // Check feature gating before starting a test
    if (!canAccess("listening")) {
      setShowUpgradeModal(true);
      return;
    }
    
    setCurrentTest(test);
    setAnswers({});
    setNotes("");
    setHasPlayed(false);
    setIsSubmitted(false);
    setScore(null);
    setResults({});
    setShowTranscript(false);
    setTimeRemaining(test.duration_minutes * 60);
  };

  const handlePlay = () => {
    if (audioRef.current && !hasPlayed) {
      audioRef.current.play();
      setIsPlaying(true);
      setHasPlayed(true);
    }
  };

  const handleAudioEnded = () => {
    setIsPlaying(false);
  };

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
  };

  const handleAnswerChange = (questionId: string, value: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }));
  };

  const normalizeAnswer = (answer: string): string => {
    return answer.toLowerCase().trim();
  };

  const checkAnswer = useCallback((userAnswer: string, correctAnswer: string): boolean => {
    const normalizedUser = normalizeAnswer(userAnswer);
    const normalizedCorrect = normalizeAnswer(correctAnswer);
    
    // Direct match
    if (normalizedUser === normalizedCorrect) return true;
    
    // Number word equivalents
    const numberWords: Record<string, string> = {
      "0": "zero", "1": "one", "2": "two", "3": "three", "4": "four",
      "5": "five", "6": "six", "7": "seven", "8": "eight", "9": "nine",
      "10": "ten", "11": "eleven", "12": "twelve", "13": "thirteen",
      "14": "fourteen", "15": "fifteen", "16": "sixteen", "17": "seventeen",
      "18": "eighteen", "19": "nineteen", "20": "twenty"
    };
    
    // Check if user typed number and correct is word (or vice versa)
    if (numberWords[normalizedUser] === normalizedCorrect) return true;
    const reverseMap = Object.fromEntries(
      Object.entries(numberWords).map(([k, v]) => [v, k])
    );
    if (reverseMap[normalizedUser] === normalizedCorrect) return true;
    
    return false;
  }, []);

  const handleSubmit = async () => {
    if (!currentTest) return;
    
    if (timerRef.current) clearInterval(timerRef.current);
    
    let correctCount = 0;
    const newResults: Record<string, { correct: boolean; correctAnswer: string }> = {};
    
    Object.entries(currentTest.answer_key).forEach(([questionId, correctAnswer]) => {
      const userAnswer = answers[questionId] || "";
      const isCorrect = checkAnswer(userAnswer, correctAnswer);
      if (isCorrect) correctCount++;
      newResults[questionId] = { correct: isCorrect, correctAnswer };
    });
    
    const totalQuestions = Object.keys(currentTest.answer_key).length;
    const bandScore = calculateBandScore(correctCount, totalQuestions);
    
    setScore(correctCount);
    setResults(newResults);
    setIsSubmitted(true);
    
    // Save to database
    if (user) {
      try {
        await supabase.from("listening_submissions").insert({
          user_id: user.id,
          listening_id: currentTest.id,
          answers,
          score: correctCount,
          total_questions: totalQuestions,
          band_score: bandScore,
          completed_at: new Date().toISOString(),
        });

        // Save to user_progress for stats tracking
        await saveProgress({
          exam_type: "listening",
          score: correctCount,
          band_score: bandScore,
          total_questions: totalQuestions,
          correct_answers: correctCount,
          feedback: `Test: ${currentTest.title}. Difficulty: ${currentTest.difficulty}`,
          completed_at: new Date().toISOString(),
          time_taken: currentTest.duration_minutes * 60 - timeRemaining,
          errors_log: [],
          metadata: {
            testId: currentTest.id,
            testTitle: currentTest.title,
            difficulty: currentTest.difficulty,
          },
        });
      } catch (error) {
        console.error("Error saving submission:", error);
      }
    }
    
    toast.success(`Test completed! Score: ${correctCount}/${totalQuestions}`);
  };

  const calculateBandScore = (correct: number, total: number): number => {
    const percentage = (correct / total) * 100;
    if (percentage >= 95) return 9;
    if (percentage >= 87) return 8.5;
    if (percentage >= 80) return 8;
    if (percentage >= 72) return 7.5;
    if (percentage >= 65) return 7;
    if (percentage >= 57) return 6.5;
    if (percentage >= 50) return 6;
    if (percentage >= 42) return 5.5;
    if (percentage >= 35) return 5;
    if (percentage >= 27) return 4.5;
    if (percentage >= 20) return 4;
    return 3.5;
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const resetTest = () => {
    setCachedState(null);
    setCurrentTest(null);
    setAnswers({});
    setNotes("");
    setHasPlayed(false);
    setIsSubmitted(false);
    setScore(null);
    setResults({});
    setShowTranscript(false);
  };

  const renderQuestion = (question: Question) => {
    const result = results[question.id.toString()];
    const isCorrect = result?.correct;
    const userAnswer = answers[question.id.toString()] || "";
    
    return (
      <div 
        key={question.id} 
        className={`p-4 rounded-lg border transition-all ${
          isSubmitted 
            ? isCorrect 
              ? "border-green-500/50 bg-green-500/5" 
              : "border-red-500/50 bg-red-500/5"
            : "border-border/50 bg-secondary/20"
        }`}
      >
        <div className="flex items-start gap-3">
          <span className="flex-shrink-0 w-8 h-8 rounded-full bg-accent/10 text-accent flex items-center justify-center text-sm font-medium">
            {question.id}
          </span>
          
          <div className="flex-1">
            {question.type === "gap-fill" ? (
              <div className="space-y-3">
                <p className="text-foreground leading-relaxed font-serif">
                  {question.text.split("_____").map((part, idx, arr) => (
                    <span key={idx}>
                      {part}
                      {idx < arr.length - 1 && (
                        <Input
                          value={userAnswer}
                          onChange={(e) => handleAnswerChange(question.id.toString(), e.target.value)}
                          className={`inline-block w-32 mx-1 h-8 text-center ${
                            isSubmitted 
                              ? isCorrect 
                                ? "border-green-500 bg-green-500/10" 
                                : "border-red-500 bg-red-500/10"
                              : ""
                          }`}
                          disabled={isSubmitted}
                          placeholder="..."
                        />
                      )}
                    </span>
                  ))}
                </p>
                {isSubmitted && !isCorrect && (
                  <p className="text-sm text-green-600">
                    Correct answer: <span className="font-medium">{result.correctAnswer}</span>
                  </p>
                )}
              </div>
            ) : (
              <div className="space-y-3">
                <p className="text-foreground leading-relaxed">{question.text}</p>
                <div className="space-y-2">
                  {question.options?.map((option, idx) => {
                    const optionLetter = String.fromCharCode(65 + idx);
                    const isSelected = userAnswer === optionLetter;
                    const isCorrectOption = result?.correctAnswer === optionLetter;
                    
                    return (
                      <label
                        key={idx}
                        className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all ${
                          isSubmitted
                            ? isCorrectOption
                              ? "bg-green-500/10 border border-green-500/50"
                              : isSelected && !isCorrectOption
                              ? "bg-red-500/10 border border-red-500/50"
                              : "bg-secondary/20 border border-transparent"
                            : isSelected
                            ? "bg-accent/10 border border-accent/50"
                            : "bg-secondary/20 border border-transparent hover:bg-secondary/40"
                        }`}
                      >
                        <input
                          type="radio"
                          name={`question-${question.id}`}
                          value={optionLetter}
                          checked={isSelected}
                          onChange={(e) => handleAnswerChange(question.id.toString(), e.target.value)}
                          disabled={isSubmitted}
                          className="w-4 h-4 text-accent"
                        />
                        <span className="font-medium text-muted-foreground mr-2">{optionLetter}.</span>
                        <span className="text-foreground">{option}</span>
                        {isSubmitted && isCorrectOption && (
                          <CheckCircle2 className="w-4 h-4 text-green-500 ml-auto" />
                        )}
                        {isSubmitted && isSelected && !isCorrectOption && (
                          <XCircle className="w-4 h-4 text-red-500 ml-auto" />
                        )}
                      </label>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  // Group questions by part
  const groupedQuestions = currentTest?.questions.reduce((acc, q) => {
    const part = q.part || 1;
    if (!acc[part]) acc[part] = [];
    acc[part].push(q);
    return acc;
  }, {} as Record<number, Question[]>) || {};

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent" />
        </div>
      </DashboardLayout>
    );
  }

  if (!currentTest) {
    return (
      <DashboardLayout>
        <div className="max-w-4xl">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center">
              <Headphones className="w-6 h-6 text-accent" />
            </div>
            <div>
              <h1 className="text-2xl font-light">Listening Practice</h1>
              <p className="text-sm text-muted-foreground">Select a test to begin</p>
            </div>
          </div>

          {tests.length === 0 ? (
            <div className="glass-card p-12 text-center">
              <Headphones className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
              <h2 className="text-xl font-light mb-2">No Tests Available</h2>
              <p className="text-muted-foreground">
                Your administrator hasn't uploaded any listening tests yet.
              </p>
            </div>
          ) : (
            <div className="grid gap-4">
              {tests.map((test) => (
                <button
                  key={test.id}
                  onClick={() => startTest(test)}
                  className="glass-card p-6 text-left hover:scale-[1.01] transition-all group"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-light mb-1">{test.title}</h3>
                      <div className="flex items-center gap-3 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {test.duration_minutes} mins
                        </span>
                        <Badge variant={
                          test.difficulty === "hard" ? "destructive" : 
                          test.difficulty === "easy" ? "secondary" : "default"
                        }>
                          {test.difficulty}
                        </Badge>
                        <span>{test.questions.length} questions</span>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-accent transition-colors" />
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="h-[calc(100vh-120px)] flex flex-col">
        {/* Header */}
        <div className="flex-shrink-0 flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
              <Headphones className="w-5 h-5 text-accent" />
            </div>
            <div>
              <h1 className="text-xl font-light">{currentTest.title}</h1>
              <Badge variant={
                currentTest.difficulty === "hard" ? "destructive" : 
                currentTest.difficulty === "easy" ? "secondary" : "default"
              }>
                {currentTest.difficulty}
              </Badge>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            {/* Timer */}
            <div className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
              timeRemaining < 60 ? "bg-red-500/10 text-red-500" : "bg-secondary/50"
            }`}>
              <Clock className="w-4 h-4" />
              <span className="font-mono text-lg">{formatTime(timeRemaining)}</span>
            </div>
            
            {isSubmitted && (
              <Button variant="outline" onClick={resetTest}>
                <RefreshCw className="w-4 h-4 mr-2" />
                New Test
              </Button>
            )}
          </div>
        </div>

        {/* Audio Player */}
        <div className="flex-shrink-0 glass-card p-4 mb-4">
          <audio 
            ref={audioRef} 
            src={currentTest.audio_url} 
            onEnded={handleAudioEnded}
            preload="metadata"
          />
          
          <div className="flex items-center gap-4">
            {/* Play Button - Hidden after played */}
            {!hasPlayed ? (
              <Button 
                onClick={handlePlay}
                variant="neumorphicPrimary"
                size="lg"
                className="rounded-full w-14 h-14"
              >
                <Play className="w-6 h-6 ml-1" />
              </Button>
            ) : (
              <div className="w-14 h-14 rounded-full bg-secondary/50 flex items-center justify-center">
                {isPlaying ? (
                  <div className="flex gap-1">
                    {[...Array(3)].map((_, i) => (
                      <div
                        key={i}
                        className="w-1 bg-accent rounded-full animate-pulse"
                        style={{ 
                          height: `${12 + Math.random() * 12}px`,
                          animationDelay: `${i * 0.15}s`
                        }}
                      />
                    ))}
                  </div>
                ) : (
                  <CheckCircle2 className="w-6 h-6 text-green-500" />
                )}
              </div>
            )}
            
            <div className="flex-1">
              {!hasPlayed ? (
                <p className="text-muted-foreground">
                  Press play to start. <span className="text-accent font-medium">Audio plays once only.</span>
                </p>
              ) : isPlaying ? (
                <p className="text-accent">Audio playing... Listen carefully!</p>
              ) : (
                <p className="text-green-600">Audio complete. Answer the questions below.</p>
              )}
            </div>
            
            {/* Volume Control */}
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" onClick={toggleMute}>
                {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
              </Button>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={volume}
                onChange={handleVolumeChange}
                className="w-20 accent-accent"
              />
            </div>
          </div>
        </div>

        {/* Score Banner */}
        {isSubmitted && score !== null && (
          <div className="flex-shrink-0 glass-card p-4 mb-4 bg-gradient-to-r from-accent/10 to-elite-gold/10">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Your Score</p>
                <p className="text-3xl font-light">
                  <span className="text-accent">{score}</span>
                  <span className="text-muted-foreground">/{Object.keys(currentTest.answer_key).length}</span>
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Estimated Band</p>
                <p className="text-3xl font-light text-elite-gold">
                  {calculateBandScore(score, Object.keys(currentTest.answer_key).length)}
                </p>
              </div>
              {currentTest.transcript && (
                <Button 
                  variant="outline" 
                  onClick={() => setShowTranscript(!showTranscript)}
                >
                  <FileText className="w-4 h-4 mr-2" />
                  {showTranscript ? "Hide" : "Show"} Transcript
                </Button>
              )}
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-4 gap-4 min-h-0">
          {/* Questions Panel */}
          <div className="lg:col-span-3 glass-card p-4 flex flex-col min-h-0">
            <h2 className="text-lg font-light mb-4 flex-shrink-0">Questions</h2>
            
            <ScrollArea className="flex-1">
              <div className="space-y-6 pr-4">
                {showTranscript && currentTest.transcript ? (
                  <div className="p-4 bg-secondary/30 rounded-lg">
                    <h3 className="font-medium mb-3 text-accent">Transcript</h3>
                    <p className="whitespace-pre-wrap font-serif text-foreground/90 leading-relaxed">
                      {currentTest.transcript}
                    </p>
                  </div>
                ) : (
                  Object.entries(groupedQuestions).map(([part, questions]) => (
                    <div key={part}>
                      <h3 className="text-sm font-medium text-muted-foreground mb-3 uppercase tracking-wide">
                        Part {part}
                      </h3>
                      <div className="space-y-4">
                        {questions.map(renderQuestion)}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </ScrollArea>
          </div>

          {/* Notes Sidebar */}
          <div className="glass-card p-4 flex flex-col min-h-0">
            <h2 className="text-lg font-light mb-4 flex-shrink-0 flex items-center gap-2">
              <FileText className="w-4 h-4 text-muted-foreground" />
              Notes
            </h2>
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Jot down keywords while listening..."
              className="flex-1 resize-none bg-secondary/20 border-border/30"
              disabled={isSubmitted}
            />
          </div>
        </div>

        {/* Footer */}
        {!isSubmitted && (
          <div className="flex-shrink-0 mt-4 flex justify-end">
            <Button 
              onClick={handleSubmit}
              size="lg"
              className="bg-accent hover:bg-accent/90"
              disabled={!hasPlayed}
            >
              Submit and Review
            </Button>
          </div>
        )}
      </div>

      <UpgradeModal
        isOpen={showUpgradeModal}
        onClose={() => setShowUpgradeModal(false)}
        featureName="Listening"
      />
    </DashboardLayout>
  );
}
