import { useState, useEffect, useRef, useCallback } from "react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  BookOpen, 
  Loader2, 
  Clock, 
  RefreshCw,
  CheckCircle,
  XCircle,
  ChevronRight,
  Lightbulb,
  Target,
  AlertCircle
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useReadingCache, CachedPassage } from "@/hooks/useLocalStorage";
import { useUserProgress } from "@/hooks/useUserProgress";
import { useAuth } from "@/hooks/useAuth";
import { useFeatureGating } from "@/hooks/useFeatureGating";
import { UpgradeModal } from "@/components/UpgradeModal";

interface Question {
  number: number;
  type: 'tfng' | 'mcq' | 'completion';
  statement?: string;
  question?: string;
  sentence?: string;
  options?: Record<string, string>;
  answer: string;
  evidence: string;
  explanation: string;
}

interface ReadingTest {
  id: string;
  passage: {
    title: string;
    content: string;
    topic: string;
    wordCount: number;
  };
  difficulty: string;
  questions: {
    typeA: {
      instruction: string;
      items: any[];
    };
    typeB: {
      instruction: string;
      items: any[];
    };
    typeC: {
      instruction: string;
      items: any[];
    };
  };
  metadata: {
    estimatedTime: string;
    skillsFocus: string[];
  };
  generatedAt: string;
}

export default function ReadingModule() {
  const [currentTest, setCurrentTest] = useState<ReadingTest | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium');
  const [userAnswers, setUserAnswers] = useState<Record<number, string>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(20 * 60); // 20 minutes
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [highlightedEvidence, setHighlightedEvidence] = useState<string | null>(null);
  const [selectedQuestion, setSelectedQuestion] = useState<number | null>(null);
  const [testStartTime, setTestStartTime] = useState<Date | null>(null);
  const passageRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const { cache, addToCache, updateCacheEntry, getLatestPassage } = useReadingCache();
  const { saveProgress } = useUserProgress();
  const { user } = useAuth();
  const { canAccess, refreshCounts } = useFeatureGating();
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  // Load cached passage on mount
  useEffect(() => {
    const cached = getLatestPassage();
    if (cached && !cached.submitted) {
      setCurrentTest(cached as ReadingTest);
      setUserAnswers(cached.userAnswers || {});
      setIsSubmitted(cached.submitted || false);
      toast({
        title: "Progress restored",
        description: "Your previous test has been loaded from cache.",
      });
    }
  }, []);

  // Timer logic
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isTimerActive && timeRemaining > 0 && !isSubmitted) {
      interval = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            handleSubmit();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerActive, timeRemaining, isSubmitted]);

  // Auto-save to cache when answers change
  useEffect(() => {
    if (currentTest && Object.keys(userAnswers).length > 0) {
      updateCacheEntry(currentTest.id, { userAnswers });
    }
  }, [userAnswers, currentTest?.id]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const generateNewTest = async () => {
    // Check feature gating for free users
    if (!canAccess("reading")) {
      setShowUpgradeModal(true);
      return;
    }

    setIsGenerating(true);
    setIsSubmitted(false);
    setUserAnswers({});
    setHighlightedEvidence(null);
    setSelectedQuestion(null);
    setTimeRemaining(20 * 60);
    setIsTimerActive(false);
    setTestStartTime(new Date());

    try {
      const { data, error } = await supabase.functions.invoke("generate-reading", {
        body: { difficulty },
      });

      if (error) throw error;
      
      if (data.error) {
        throw new Error(data.error);
      }

      setCurrentTest(data);
      addToCache(data as CachedPassage);
      setIsTimerActive(true);
      
      toast({
        title: "Test generated!",
        description: `${data.passage.topic} passage ready. Timer started.`,
      });
    } catch (error: any) {
      console.error("Generate error:", error);
      toast({
        title: "Generation failed",
        description: error.message || "Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleAnswerChange = (questionNumber: number, answer: string) => {
    if (isSubmitted) return;
    setUserAnswers((prev) => ({ ...prev, [questionNumber]: answer }));
  };

  const getAllQuestions = useCallback((): Question[] => {
    if (!currentTest) return [];
    
    const questions: Question[] = [];
    
    // Type A - True/False/Not Given
    currentTest.questions.typeA.items.forEach((item) => {
      questions.push({
        number: item.number,
        type: 'tfng',
        statement: item.statement,
        answer: item.answer,
        evidence: item.evidence,
        explanation: item.explanation,
      });
    });
    
    // Type B - Multiple Choice
    currentTest.questions.typeB.items.forEach((item) => {
      questions.push({
        number: item.number,
        type: 'mcq',
        question: item.question,
        options: item.options,
        answer: item.answer,
        evidence: item.evidence,
        explanation: item.explanation,
      });
    });
    
    // Type C - Completion
    currentTest.questions.typeC.items.forEach((item) => {
      questions.push({
        number: item.number,
        type: 'completion',
        sentence: item.sentence,
        answer: item.answer,
        evidence: item.evidence,
        explanation: item.explanation,
      });
    });
    
    return questions.sort((a, b) => a.number - b.number);
  }, [currentTest]);

  const handleSubmit = async () => {
    if (!currentTest || !user) return;
    
    setIsSubmitted(true);
    setIsTimerActive(false);
    
    const questions = getAllQuestions();
    let correct = 0;
    const errorsLog: { type: string; count: number }[] = [];
    const errorCounts: Record<string, number> = { 'TFNG': 0, 'MCQ': 0, 'Completion': 0 };
    
    questions.forEach((q) => {
      const userAnswer = userAnswers[q.number]?.trim().toUpperCase();
      const correctAnswer = q.answer.trim().toUpperCase();
      if (userAnswer === correctAnswer) {
        correct++;
      } else {
        // Track error types
        if (q.type === 'tfng') errorCounts['TFNG']++;
        else if (q.type === 'mcq') errorCounts['MCQ']++;
        else errorCounts['Completion']++;
      }
    });

    // Build errors log
    Object.entries(errorCounts).forEach(([type, count]) => {
      if (count > 0) errorsLog.push({ type, count });
    });
    
    const total = questions.length;
    const percentage = (correct / total) * 100;
    
    // Calculate band score
    let bandScore = 4.0;
    if (percentage >= 90) bandScore = 9.0;
    else if (percentage >= 80) bandScore = 8.0;
    else if (percentage >= 70) bandScore = 7.5;
    else if (percentage >= 60) bandScore = 7.0;
    else if (percentage >= 50) bandScore = 6.5;
    else if (percentage >= 40) bandScore = 6.0;
    else if (percentage >= 30) bandScore = 5.5;
    else if (percentage >= 20) bandScore = 5.0;

    // Calculate time taken
    const timeTaken = testStartTime 
      ? Math.floor((new Date().getTime() - testStartTime.getTime()) / 1000)
      : 20 * 60 - timeRemaining;
    
    updateCacheEntry(currentTest.id, { 
      submitted: true, 
      score: correct,
      userAnswers 
    });

    // Save to user_progress table
    try {
      await saveProgress({
        exam_type: "reading",
        score: correct,
        band_score: bandScore,
        total_questions: total,
        correct_answers: correct,
        feedback: `Topic: ${currentTest.passage.title}. Difficulty: ${currentTest.difficulty}`,
        completed_at: new Date().toISOString(),
        time_taken: timeTaken,
        errors_log: errorsLog,
        metadata: {
          topic: currentTest.passage.topic,
          difficulty: currentTest.difficulty,
          passageId: currentTest.id,
        },
      });
    } catch (err) {
      console.error("Failed to save progress:", err);
    }
    
    toast({
      title: `Score: ${correct}/${total}`,
      description: `Estimated Band Score: ${bandScore}`,
    });
  };

  const handleQuestionClick = (questionNumber: number) => {
    const questions = getAllQuestions();
    const question = questions.find(q => q.number === questionNumber);
    
    if (question && isSubmitted) {
      setSelectedQuestion(questionNumber);
      setHighlightedEvidence(question.evidence);
      
      // Scroll to evidence in passage
      if (passageRef.current && question.evidence) {
        const passageText = passageRef.current.innerText;
        const evidenceIndex = passageText.toLowerCase().indexOf(question.evidence.toLowerCase().substring(0, 50));
        if (evidenceIndex !== -1) {
          passageRef.current.scrollTop = Math.max(0, evidenceIndex * 0.5);
        }
      }
    }
  };

  const getQuestionResult = (questionNumber: number): 'correct' | 'incorrect' | null => {
    if (!isSubmitted) return null;
    const questions = getAllQuestions();
    const question = questions.find(q => q.number === questionNumber);
    if (!question) return null;
    
    const userAnswer = userAnswers[questionNumber]?.trim().toUpperCase();
    const correctAnswer = question.answer.trim().toUpperCase();
    return userAnswer === correctAnswer ? 'correct' : 'incorrect';
  };

  const highlightPassage = (content: string): string => {
    if (!highlightedEvidence || !isSubmitted) return content;
    
    const evidenceStart = highlightedEvidence.substring(0, 100);
    const index = content.toLowerCase().indexOf(evidenceStart.toLowerCase());
    
    if (index !== -1) {
      const before = content.substring(0, index);
      const match = content.substring(index, index + highlightedEvidence.length);
      const after = content.substring(index + highlightedEvidence.length);
      return `${before}<mark class="bg-accent/30 text-foreground px-1 rounded">${match}</mark>${after}`;
    }
    
    return content;
  };

  const calculateScore = () => {
    const questions = getAllQuestions();
    let correct = 0;
    questions.forEach((q) => {
      const userAnswer = userAnswers[q.number]?.trim().toUpperCase();
      const correctAnswer = q.answer.trim().toUpperCase();
      if (userAnswer === correctAnswer) correct++;
    });
    return { correct, total: questions.length };
  };

  const getDifficultyColor = (diff: string) => {
    switch (diff) {
      case 'easy': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'medium': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'hard': return 'bg-red-500/20 text-red-400 border-red-500/30';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <DashboardLayout>
      <div className="h-[calc(100vh-2rem)] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between mb-4 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-accent" />
            </div>
            <div>
              <h1 className="text-xl font-light">Reading Practice</h1>
              <p className="text-xs text-muted-foreground">AI-generated IELTS passages</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Timer */}
            {currentTest && (
              <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border ${
                timeRemaining < 300 ? 'border-destructive/50 bg-destructive/10' : 'border-border bg-card'
              }`}>
                <Clock className={`w-4 h-4 ${timeRemaining < 300 ? 'text-destructive' : 'text-muted-foreground'}`} />
                <span className={`font-mono text-sm ${timeRemaining < 300 ? 'text-destructive' : 'text-foreground'}`}>
                  {formatTime(timeRemaining)}
                </span>
              </div>
            )}

            {/* Difficulty Selector */}
            <div className="flex items-center gap-1 p-1 rounded-lg bg-card border border-border">
              {(['easy', 'medium', 'hard'] as const).map((d) => (
                <button
                  key={d}
                  onClick={() => setDifficulty(d)}
                  className={`px-3 py-1 text-xs rounded-md transition-all capitalize ${
                    difficulty === d
                      ? getDifficultyColor(d)
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>

            {/* Generate Button */}
            <Button
              onClick={generateNewTest}
              disabled={isGenerating}
              variant="neumorphicPrimary"
              size="sm"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Generate Test
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Score Bar (when submitted) */}
        {isSubmitted && currentTest && (
          <div className="glass-card p-4 mb-4 flex-shrink-0">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Target className="w-5 h-5 text-accent" />
                  <span className="text-lg font-light">
                    Score: <span className="text-accent font-medium">{calculateScore().correct}/{calculateScore().total}</span>
                  </span>
                </div>
                <Badge variant="outline" className="text-accent border-accent">
                  Band {(() => {
                    const { correct, total } = calculateScore();
                    const p = (correct / total) * 100;
                    if (p >= 90) return '9.0';
                    if (p >= 80) return '8.0';
                    if (p >= 70) return '7.5';
                    if (p >= 60) return '7.0';
                    if (p >= 50) return '6.5';
                    if (p >= 40) return '6.0';
                    return '5.5';
                  })()}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                Click on any wrong answer to see the evidence in the passage
              </p>
            </div>
          </div>
        )}

        {/* Main Content */}
        {!currentTest ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center max-w-md">
              <BookOpen className="w-16 h-16 text-accent/30 mx-auto mb-4" />
              <h2 className="text-xl font-light mb-2">Ready to Practice?</h2>
              <p className="text-muted-foreground mb-6">
                Generate an AI-powered IELTS Academic Reading passage with 13 questions. 
                Select your difficulty level and click the button above.
              </p>
              {cache.length > 0 && (
                <div className="text-sm text-muted-foreground">
                  <p>{cache.length} cached test(s) available</p>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-4 min-h-0">
            {/* Left Panel - Passage */}
            <div className="glass-card flex flex-col min-h-0">
              <div className="p-4 border-b border-border/30 flex-shrink-0">
                <div className="flex items-center justify-between">
                  <h2 className="font-serif text-lg font-medium">{currentTest.passage.title}</h2>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className={getDifficultyColor(currentTest.difficulty)}>
                      {currentTest.difficulty}
                    </Badge>
                    <Badge variant="outline" className="text-muted-foreground">
                      {currentTest.passage.wordCount} words
                    </Badge>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Topic: {currentTest.passage.topic}
                </p>
              </div>
              
              <ScrollArea className="flex-1 p-4">
                <div 
                  ref={passageRef}
                  className="prose prose-invert max-w-none font-serif text-[15px] leading-relaxed"
                  dangerouslySetInnerHTML={{ 
                    __html: highlightPassage(currentTest.passage.content)
                      .split('\n\n')
                      .map(p => `<p class="mb-4 text-foreground/85">${p}</p>`)
                      .join('')
                  }}
                />
              </ScrollArea>
            </div>

            {/* Right Panel - Questions */}
            <div className="glass-card flex flex-col min-h-0">
              <div className="p-4 border-b border-border/30 flex-shrink-0">
                <h2 className="font-light text-lg">Questions 1-13</h2>
                <p className="text-xs text-muted-foreground">
                  Answer all questions based on the passage
                </p>
              </div>

              <ScrollArea className="flex-1">
                <div className="p-4 space-y-6">
                  {/* Type A - True/False/Not Given */}
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <Badge variant="secondary" className="text-xs">Questions 1-5</Badge>
                      <span className="text-xs text-muted-foreground">True / False / Not Given</span>
                    </div>
                    <p className="text-xs text-muted-foreground mb-4 italic">
                      {currentTest.questions.typeA.instruction}
                    </p>
                    <div className="space-y-3">
                      {currentTest.questions.typeA.items.map((item) => (
                        <QuestionItem
                          key={item.number}
                          number={item.number}
                          type="tfng"
                          content={item.statement}
                          options={['TRUE', 'FALSE', 'NOT GIVEN']}
                          userAnswer={userAnswers[item.number] || ''}
                          correctAnswer={item.answer}
                          explanation={item.explanation}
                          isSubmitted={isSubmitted}
                          result={getQuestionResult(item.number)}
                          isSelected={selectedQuestion === item.number}
                          onAnswerChange={handleAnswerChange}
                          onQuestionClick={handleQuestionClick}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Type B - Multiple Choice */}
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <Badge variant="secondary" className="text-xs">Questions 6-9</Badge>
                      <span className="text-xs text-muted-foreground">Multiple Choice</span>
                    </div>
                    <p className="text-xs text-muted-foreground mb-4 italic">
                      {currentTest.questions.typeB.instruction}
                    </p>
                    <div className="space-y-4">
                      {currentTest.questions.typeB.items.map((item) => (
                        <QuestionItem
                          key={item.number}
                          number={item.number}
                          type="mcq"
                          content={item.question}
                          options={item.options}
                          userAnswer={userAnswers[item.number] || ''}
                          correctAnswer={item.answer}
                          explanation={item.explanation}
                          isSubmitted={isSubmitted}
                          result={getQuestionResult(item.number)}
                          isSelected={selectedQuestion === item.number}
                          onAnswerChange={handleAnswerChange}
                          onQuestionClick={handleQuestionClick}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Type C - Completion */}
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <Badge variant="secondary" className="text-xs">Questions 10-13</Badge>
                      <span className="text-xs text-muted-foreground">Sentence Completion</span>
                    </div>
                    <p className="text-xs text-muted-foreground mb-4 italic">
                      {currentTest.questions.typeC.instruction}
                    </p>
                    <div className="space-y-3">
                      {currentTest.questions.typeC.items.map((item) => (
                        <QuestionItem
                          key={item.number}
                          number={item.number}
                          type="completion"
                          content={item.sentence}
                          userAnswer={userAnswers[item.number] || ''}
                          correctAnswer={item.answer}
                          explanation={item.explanation}
                          isSubmitted={isSubmitted}
                          result={getQuestionResult(item.number)}
                          isSelected={selectedQuestion === item.number}
                          onAnswerChange={handleAnswerChange}
                          onQuestionClick={handleQuestionClick}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </ScrollArea>

              {/* Submit Footer */}
              <div className="p-4 border-t border-border/30 flex-shrink-0">
                {!isSubmitted ? (
                  <Button 
                    onClick={handleSubmit} 
                    className="w-full"
                    variant="neumorphicPrimary"
                    disabled={Object.keys(userAnswers).length === 0}
                  >
                    Submit and Review
                    <ChevronRight className="w-4 h-4 ml-2" />
                  </Button>
                ) : (
                  <div className="flex gap-3">
                    <Button 
                      onClick={generateNewTest} 
                      className="flex-1"
                      variant="glass"
                    >
                      <RefreshCw className="w-4 h-4 mr-2" />
                      New Test
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

// Question Item Component
interface QuestionItemProps {
  number: number;
  type: 'tfng' | 'mcq' | 'completion';
  content: string;
  options?: string[] | Record<string, string>;
  userAnswer: string;
  correctAnswer: string;
  explanation: string;
  isSubmitted: boolean;
  result: 'correct' | 'incorrect' | null;
  isSelected: boolean;
  onAnswerChange: (num: number, answer: string) => void;
  onQuestionClick: (num: number) => void;
}

function QuestionItem({
  number,
  type,
  content,
  options,
  userAnswer,
  correctAnswer,
  explanation,
  isSubmitted,
  result,
  isSelected,
  onAnswerChange,
  onQuestionClick,
}: QuestionItemProps) {
  const handleClick = () => {
    if (isSubmitted && result === 'incorrect') {
      onQuestionClick(number);
    }
  };

  return (
    <div 
      className={`p-3 rounded-lg border transition-all ${
        isSelected 
          ? 'border-accent bg-accent/10' 
          : result === 'correct'
          ? 'border-green-500/30 bg-green-500/5'
          : result === 'incorrect'
          ? 'border-destructive/30 bg-destructive/5 cursor-pointer hover:bg-destructive/10'
          : 'border-border/30 bg-card/50'
      }`}
      onClick={handleClick}
    >
      <div className="flex items-start gap-3">
        <span className="text-xs font-medium text-muted-foreground w-5 flex-shrink-0">
          {number}.
        </span>
        <div className="flex-1 min-w-0">
          <p className="text-sm text-foreground/90 mb-2">{content}</p>
          
          {type === 'tfng' && Array.isArray(options) && (
            <div className="flex gap-2 flex-wrap">
              {options.map((opt) => (
                <button
                  key={opt}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (!isSubmitted) onAnswerChange(number, opt);
                  }}
                  disabled={isSubmitted}
                  className={`px-3 py-1 text-xs rounded-md border transition-all ${
                    userAnswer === opt
                      ? isSubmitted
                        ? opt === correctAnswer
                          ? 'bg-green-500/20 border-green-500 text-green-400'
                          : 'bg-destructive/20 border-destructive text-destructive'
                        : 'bg-accent/20 border-accent text-accent'
                      : isSubmitted && opt === correctAnswer
                      ? 'bg-green-500/20 border-green-500 text-green-400'
                      : 'border-border/50 text-muted-foreground hover:border-border'
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          )}
          
          {type === 'mcq' && options && typeof options === 'object' && !Array.isArray(options) && (
            <div className="space-y-1.5">
              {Object.entries(options).map(([key, value]) => (
                <button
                  key={key}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (!isSubmitted) onAnswerChange(number, key);
                  }}
                  disabled={isSubmitted}
                  className={`w-full text-left px-3 py-2 text-xs rounded-md border transition-all ${
                    userAnswer === key
                      ? isSubmitted
                        ? key === correctAnswer
                          ? 'bg-green-500/20 border-green-500 text-green-400'
                          : 'bg-destructive/20 border-destructive text-destructive'
                        : 'bg-accent/20 border-accent text-accent'
                      : isSubmitted && key === correctAnswer
                      ? 'bg-green-500/20 border-green-500 text-green-400'
                      : 'border-border/50 text-muted-foreground hover:border-border'
                  }`}
                >
                  <span className="font-medium mr-2">{key}.</span>
                  {value}
                </button>
              ))}
            </div>
          )}
          
          {type === 'completion' && (
            <input
              type="text"
              value={userAnswer}
              onChange={(e) => onAnswerChange(number, e.target.value)}
              disabled={isSubmitted}
              placeholder="Your answer..."
              className={`w-full px-3 py-2 text-sm rounded-md border bg-background/50 outline-none transition-all ${
                isSubmitted
                  ? result === 'correct'
                    ? 'border-green-500 text-green-400'
                    : 'border-destructive text-destructive'
                  : 'border-border/50 focus:border-accent'
              }`}
            />
          )}
          
          {/* Show explanation for ALL questions after submission */}
          {isSubmitted && (
            <div className={`mt-3 pt-3 border-t ${result === 'correct' ? 'border-green-500/20' : 'border-destructive/20'}`}>
              <div className="flex items-center gap-2 mb-2">
                {result === 'correct' ? (
                  <>
                    <CheckCircle className="w-3 h-3 text-green-400" />
                    <span className="text-xs text-green-400">Correct!</span>
                  </>
                ) : (
                  <>
                    <XCircle className="w-3 h-3 text-destructive" />
                    <span className="text-xs text-destructive">
                      Your answer: {userAnswer || '(no answer)'}
                    </span>
                    <span className="text-xs text-muted-foreground mx-1">→</span>
                    <CheckCircle className="w-3 h-3 text-green-400" />
                    <span className="text-xs text-green-400">Correct: {correctAnswer}</span>
                  </>
                )}
              </div>
              <div className="flex items-start gap-2 bg-muted/30 p-2 rounded-md">
                <Lightbulb className="w-3 h-3 text-accent mt-0.5 flex-shrink-0" />
                <p className="text-xs text-muted-foreground leading-relaxed">{explanation}</p>
              </div>
            </div>
          )}
        </div>
      </div>
      
      <UpgradeModal
        isOpen={showUpgradeModal}
        onClose={() => setShowUpgradeModal(false)}
        featureName="Reading"
      />
    </div>
  );
}
