import { useState, useEffect, useRef } from "react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Mic, MicOff, Loader2, Play, Square, Volume2, RefreshCw, ChevronRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useSpeechRecognition } from "@/hooks/useSpeechRecognition";
import { useUserProgress } from "@/hooks/useUserProgress";
import { useAuth } from "@/hooks/useAuth";
import { useFeatureGating } from "@/hooks/useFeatureGating";
import { UpgradeModal } from "@/components/UpgradeModal";
import { generationStore } from "@/stores/generationStore";
import { useGenerationEntry } from "@/hooks/useGenerationEntry";

// Fallback IELTS Speaking Questions (used when AI generation is unavailable)
const FALLBACK_SPEAKING_QUESTIONS = {
  part1: [
    { topic: "Hometown", question: "Where do you come from? Can you describe your hometown?" },
    { topic: "Work/Studies", question: "Do you work or are you a student? What do you like most about your job/studies?" },
    { topic: "Hobbies", question: "What do you enjoy doing in your free time? How often do you do this activity?" },
    { topic: "Music", question: "What kind of music do you like? Do you prefer listening to music alone or with others?" },
    { topic: "Reading", question: "Do you like reading? What types of books or articles do you usually read?" },
    { topic: "Travel", question: "Do you like traveling? Where would you like to travel in the future?" },
    { topic: "Food", question: "What is your favorite type of food? Do you prefer eating at home or in restaurants?" },
    { topic: "Weather", question: "What's the weather like in your country? Does the weather affect your mood?" },
  ],
  part2: [
    {
      topic: "A memorable trip",
      cueCard: "Describe a memorable trip you took recently.\n\nYou should say:\n• Where you went\n• Who you went with\n• What you did there\n\nAnd explain why it was memorable.",
      prepTime: "1 minute",
      speakTime: "1-2 minutes"
    },
    {
      topic: "A person who influenced you",
      cueCard: "Describe a person who has influenced you.\n\nYou should say:\n• Who this person is\n• How you know them\n• What qualities they have\n\nAnd explain why they have influenced you.",
      prepTime: "1 minute",
      speakTime: "1-2 minutes"
    },
    {
      topic: "A skill you learned",
      cueCard: "Describe a skill you would like to learn.\n\nYou should say:\n• What the skill is\n• Why you want to learn it\n• How you would learn it\n\nAnd explain how this skill would benefit you.",
      prepTime: "1 minute",
      speakTime: "1-2 minutes"
    },
    {
      topic: "A time you helped someone",
      cueCard: "Describe a time you helped someone.\n\nYou should say:\n• Who you helped\n• What the situation was\n• How you helped them\n\nAnd explain how you felt afterwards.",
      prepTime: "1 minute",
      speakTime: "1-2 minutes"
    },
    {
      topic: "An important decision",
      cueCard: "Describe an important decision you made.\n\nYou should say:\n• What the decision was\n• When you made it\n• What factors you considered\n\nAnd explain how it affected your life.",
      prepTime: "1 minute",
      speakTime: "1-2 minutes"
    },
  ],
  part3: [
    { topic: "Travel & Tourism", questions: [
      "How has tourism changed in recent years?",
      "What are the advantages and disadvantages of mass tourism?",
      "Do you think people will travel more or less in the future?"
    ]},
    { topic: "Influence & Role Models", questions: [
      "Why do people need role models?",
      "How do celebrities influence young people?",
      "Do you think the media presents good role models?"
    ]},
    { topic: "Learning & Skills", questions: [
      "How has the way people learn changed over time?",
      "What skills are most important for success in the modern world?",
      "Should schools teach more practical skills?"
    ]},
    { topic: "Helping Others", questions: [
      "Why is it important to help others?",
      "How can governments encourage people to volunteer?",
      "Do you think people are more or less helpful than in the past?"
    ]},
    { topic: "Decision Making", questions: [
      "How do people make important life decisions?",
      "Should young people seek advice from older generations?",
      "Do you think technology helps or hinders decision-making?"
    ]},
  ]
};

// Types for AI-generated speaking questions (matches generate-speaking edge function output)
interface AISpeakingTest {
  id: string;
  topic: string;
  difficulty: string;
  part1: {
    topics: Array<{ theme: string; questions: string[] }>;
  };
  part2: {
    cue_card: string;
    bullet_points: string[];
    final_instruction: string;
    prep_time: string;
    speak_time: string;
    rounding_off_questions: string[];
  };
  part3: {
    theme: string;
    questions: string[];
  };
}

// Map AI response to the legacy question format used by the component
function mapAIToLegacy(ai: AISpeakingTest) {
  const p1topics = ai.part1?.topics ?? [];
  const part1Questions = p1topics.flatMap(t =>
    (t.questions ?? []).map(q => ({ topic: t.theme, question: q }))
  );

  const p2 = ai.part2;
  const cueCardText = p2
    ? `${p2.cue_card}\n\nYou should say:\n${(p2.bullet_points ?? []).map(b => `• ${b}`).join('\n')}\n\n${p2.final_instruction}`
    : "";

  const part2Questions = p2 ? [{
    topic: ai.topic ?? "AI Generated",
    cueCard: cueCardText,
    prepTime: p2.prep_time ?? "1 minute",
    speakTime: p2.speak_time ?? "1–2 minutes",
  }] : [];

  const p3 = ai.part3;
  const part3Questions = p3 ? [{
    topic: p3.theme ?? ai.topic ?? "Discussion",
    questions: p3.questions ?? [],
  }] : [];

  return { part1: part1Questions, part2: part2Questions, part3: part3Questions };
}

type SpeakingPart = 'part1' | 'part2' | 'part3';

interface CachedSpeakingState {
  activeQuestions: typeof FALLBACK_SPEAKING_QUESTIONS;
  currentPart: SpeakingPart;
  currentQuestionIndex: number;
  feedback: any;
}

export default function SpeakingModule() {
  // useAuth MUST be called before any useState that references user?.id
  const { user } = useAuth();

  // isMountedRef: tracks whether component is currently mounted
  const isMountedRef = useRef(true);
  useEffect(() => {
    isMountedRef.current = true;
    return () => { isMountedRef.current = false; };
  }, []);

  // Background generation store — survives component unmount/remount
  const genEntry = useGenerationEntry('speaking');
  const isGenerating = genEntry.isGenerating;

  const [currentPart, setCurrentPart] = useState<SpeakingPart>(() => {
    if (typeof window !== "undefined") {
      const stored = sessionStorage.getItem(`ielts-speaking-active-part-${user?.id || 'guest'}`);
      if (stored === "part1" || stored === "part2" || stored === "part3") return stored as SpeakingPart;
    }
    return "part1";
  });
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [feedback, setFeedback] = useState<any>(null);

  // Background analysis store — persists isAnalyzing across module navigation
  const analysisEntry = useGenerationEntry('speaking-analysis');
  const isAnalyzing = analysisEntry.isGenerating;
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [activeQuestions, setActiveQuestions] = useState(FALLBACK_SPEAKING_QUESTIONS);
  const { toast } = useToast();
  const { saveProgress } = useUserProgress();
  const { canAccess, refreshCounts, isLoading: isGatingLoading } = useFeatureGating();

  useEffect(() => {
    if (!user?.id) return;
    try {
      const stored = sessionStorage.getItem(`ielts-speaking-cache-${user.id}`);
      if (stored) {
        const state = JSON.parse(stored) as CachedSpeakingState;
        if (state.activeQuestions) setActiveQuestions(state.activeQuestions);
        if (state.currentPart) setCurrentPart(state.currentPart);
        if (state.currentQuestionIndex !== undefined) setCurrentQuestionIndex(state.currentQuestionIndex);
        if (state.feedback) setFeedback(state.feedback);
      }
    } catch (err) { console.error("Cache load error:", err); }
  }, [user?.id]);

  useEffect(() => {
    if (!user?.id) return;
    const state: CachedSpeakingState = {
      activeQuestions,
      currentPart,
      currentQuestionIndex,
      feedback
    };
    sessionStorage.setItem(`ielts-speaking-cache-${user.id}`, JSON.stringify(state));
    sessionStorage.setItem(`ielts-speaking-active-part-${user.id}`, currentPart);
  }, [user?.id, activeQuestions, currentPart, currentQuestionIndex, feedback]);

  // Apply generation results that arrived while this component was unmounted
  useEffect(() => {
    if (genEntry.isGenerating) return;
    if (genEntry.result) {
      const { mapped } = genEntry.result;
      generationStore.clearEntry('speaking');
      if (isMountedRef.current) {
        setActiveQuestions(mapped);
        setCurrentPart('part1');
        setCurrentQuestionIndex(0);
        toast({ title: "Test Generated", description: "Your AI speaking practice is ready!" });
      }
    } else if (genEntry.error) {
      generationStore.clearEntry('speaking');
      if (isMountedRef.current) {
        toast({ title: "Generation failed", description: genEntry.error, variant: "destructive" });
      }
    }
  }, [genEntry]); // eslint-disable-line react-hooks/exhaustive-deps

  // Apply analysis results that arrived while this component was unmounted
  useEffect(() => {
    if (analysisEntry.isGenerating) return;
    if (analysisEntry.result) {
      const { feedbackData } = analysisEntry.result;
      generationStore.clearEntry('speaking-analysis');
      if (isMountedRef.current) {
        setFeedback(feedbackData);
      }
    } else if (analysisEntry.error) {
      generationStore.clearEntry('speaking-analysis');
      if (isMountedRef.current) {
        toast({ title: "Analysis failed", description: analysisEntry.error, variant: "destructive" });
      }
    }
  }, [analysisEntry]); // eslint-disable-line react-hooks/exhaustive-deps

  const {
    isListening,
    transcript,
    interimTranscript,
    startListening,
    stopListening,
    resetTranscript,
    isSupported,
    audioLevel
  } = useSpeechRecognition();

  const getCurrentQuestion = () => {
    switch (currentPart) {
      case 'part1':
        return activeQuestions.part1[currentQuestionIndex % activeQuestions.part1.length];
      case 'part2':
        return activeQuestions.part2[currentQuestionIndex % activeQuestions.part2.length];
      case 'part3':
        return activeQuestions.part3[currentQuestionIndex % activeQuestions.part3.length];
    }
  };

  const generateNewQuestion = async () => {
    if (isGatingLoading) return;
    if (!canAccess("speaking")) {
      setShowUpgradeModal(true);
      return;
    }

    let currentSession;
    try {
      const { data: { session: refreshedSession } } = await supabase.auth.refreshSession();
      currentSession = refreshedSession || (await supabase.auth.getSession()).data.session;
    } catch (e) {
      console.error(e);
    }
    
    if (!currentSession) {
      toast({ title: "Authentication required", description: "You must be logged in.", variant: "destructive" });
      return;
    }

    resetTranscript();
    setFeedback(null);
    generationStore.startGen('speaking');
    try {
      const { data, error } = await supabase.functions.invoke("generate-speaking", {
        body: { difficulty: "medium" },
        headers: {
          Authorization: `Bearer ${currentSession.access_token}`,
        },
      });
      if (error) throw error;
      const aiData: AISpeakingTest = data?.success ? data.data : data;
      if (aiData?.part1 && aiData?.part2 && aiData?.part3) {
        const mapped = mapAIToLegacy(aiData) as typeof FALLBACK_SPEAKING_QUESTIONS;

        // Always persist to sessionStorage (survives component unmount)
        try {
          if (user?.id) {
            const newCache: CachedSpeakingState = { activeQuestions: mapped, currentPart: "part1", currentQuestionIndex: 0, feedback: null };
            sessionStorage.setItem(`ielts-speaking-cache-${user.id}`, JSON.stringify(newCache));
            sessionStorage.setItem(`ielts-speaking-active-part-${user.id}`, "part1");
          }
        } catch (e) {
          console.error("Failed to save generation to cache:", e);
        }

        if (isMountedRef.current) {
          generationStore.clearEntry('speaking');
          setActiveQuestions(mapped);
          setCurrentPart('part1');
          setCurrentQuestionIndex(0);
          toast({ title: "Test Generated", description: "Your AI speaking practice is ready!" });
        } else {
          // Component unmounted — store result for remount to apply
          generationStore.finishGen('speaking', { mapped });
        }
      } else {
        throw new Error("Incomplete AI response");
      }
    } catch (err: any) {
      console.error("Failed to generate AI speaking questions, using fallback:", err);
      if (isMountedRef.current) {
        generationStore.clearEntry('speaking');
        // Cycle through fallback questions instead
        const maxIndex = FALLBACK_SPEAKING_QUESTIONS[currentPart].length;
        setCurrentQuestionIndex((prev) => (prev + 1) % maxIndex);
      } else {
        generationStore.failGen('speaking', err?.message || "Generation failed");
      }
    }
  };

  const handleRestartPractice = () => {
    resetTranscript();
    setFeedback(null);
  };

  const handlePartChange = (part: SpeakingPart) => {
    setCurrentPart(part);
    setCurrentQuestionIndex(0);
    resetTranscript();
    setFeedback(null);
  };

  const handleStartRecording = () => {
    if (!isSupported) {
      toast({
        title: "Browser not supported",
        description: "Speech recognition is not supported in your browser. Please use Chrome or Edge.",
        variant: "destructive",
      });
      return;
    }
    resetTranscript();
    setFeedback(null);
    startListening();
  };

  const handleStopRecording = () => {
    stopListening();
  };

  const analyzeTranscript = async () => {
    // Check feature gating before analyzing
    if (!canAccess("speaking")) {
      setShowUpgradeModal(true);
      return;
    }

    const finalTranscript = transcript.trim();
    if (!finalTranscript) {
      toast({
        title: "No speech detected",
        description: "Please record your response first.",
        variant: "destructive",
      });
      return;
    }

    generationStore.startGen('speaking-analysis');

    try {
      const currentQuestion = getCurrentQuestion();
      const questionContext = currentPart === 'part2'
        ? (currentQuestion as any).cueCard
        : currentPart === 'part3'
        ? (currentQuestion as any).questions.join('\n')
        : (currentQuestion as any).question;

      const { data, error } = await supabase.functions.invoke("ai-analyze", {
        body: {
          type: "speaking",
          content: finalTranscript,
          speakingPart: currentPart,
          question: questionContext,
        },
      });

      if (error) throw error;

      // Unwrap response: supabase.functions.invoke returns {success, data} wrapper
      const unwrappedData = data?.success ? data.data : data;

      // Save progress regardless of mount state
      if (unwrappedData?.overallBand && user) {
        try {
          await saveProgress({
            exam_type: "speaking",
            score: null,
            band_score: unwrappedData.overallBand,
            total_questions: null,
            correct_answers: null,
            feedback: `${currentPart.toUpperCase()}: ${(currentQuestion as any).topic || 'Practice'}`,
            completed_at: new Date().toISOString(),
            time_taken: null,
            errors_log: [],
            metadata: {
              speakingPart: currentPart,
              topic: (currentQuestion as any).topic,
              wordCount: finalTranscript.split(/\s+/).filter(Boolean).length,
            },
          });
          await refreshCounts();
        } catch (err) {
          console.error("Failed to save speaking progress:", err);
        }
      }

      // Save feedback to sessionStorage so it survives navigation
      try {
        if (user?.id) {
          const existingRaw = sessionStorage.getItem(`ielts-speaking-cache-${user.id}`);
          const existing = existingRaw ? JSON.parse(existingRaw) : {};
          sessionStorage.setItem(`ielts-speaking-cache-${user.id}`, JSON.stringify({ ...existing, feedback: unwrappedData }));
        }
      } catch (e) {}

      if (isMountedRef.current) {
        generationStore.clearEntry('speaking-analysis');
        setFeedback(unwrappedData);
      } else {
        // Component unmounted — store result for remount to apply
        generationStore.finishGen('speaking-analysis', { feedbackData: unwrappedData });
      }
    } catch (error: any) {
      console.error("Analysis error:", error);
      const msg = error.message || "Please try again later.";
      if (isMountedRef.current) {
        generationStore.clearEntry('speaking-analysis');
        toast({ title: "Analysis failed", description: msg, variant: "destructive" });
      } else {
        generationStore.failGen('speaking-analysis', msg);
      }
    }
  };

  const currentQuestion = getCurrentQuestion();

  // Generate waveform bars based on audio level
  const waveformBars = Array.from({ length: 12 }, (_, i) => {
    const baseHeight = 8;
    const maxHeight = 40;
    const variation = Math.sin((i + Date.now() / 100) * 0.5) * 0.3 + 0.7;
    const height = isListening 
      ? baseHeight + (maxHeight - baseHeight) * audioLevel * variation
      : baseHeight;
    return height;
  });

  return (
    <DashboardLayout>
      <div className="max-w-4xl">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 rounded-xl bg-elite-gold/10 flex items-center justify-center">
            <Mic className="w-6 h-6 text-elite-gold" />
          </div>
          <div>
            <h1 className="text-2xl font-light">Speaking Practice</h1>
            <p className="text-sm text-muted-foreground">Real-time voice transcription with AI analysis</p>
          </div>
        </div>

        {/* Part Selection */}
        <div className="flex gap-2 mb-6">
          {(['part1', 'part2', 'part3'] as const).map((part) => (
            <Button
              key={part}
              variant={currentPart === part ? "default" : "outline"}
              onClick={() => handlePartChange(part)}
              className="flex-1"
            >
              Part {part.slice(-1)}
              <span className="ml-2 text-xs opacity-70">
                {part === 'part1' ? 'Introduction' : part === 'part2' ? 'Cue Card' : 'Discussion'}
              </span>
            </Button>
          ))}
        </div>

        {/* Question Card */}
        <div className="glass-card p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium">
                {currentPart === 'part1' ? (currentQuestion as any).topic : 
                 currentPart === 'part2' ? (currentQuestion as any).topic :
                 (currentQuestion as any).topic}
              </span>
              {currentPart === 'part2' && (
                <span className="text-xs text-muted-foreground">
                  Prep: {(currentQuestion as any).prepTime} | Speak: {(currentQuestion as any).speakTime}
                </span>
              )}
            </div>
            <Button variant="ghost" size="sm" onClick={() => !canAccess("speaking") ? setShowUpgradeModal(true) : generateNewQuestion()} disabled={isGenerating}>
              {isGenerating
                ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Generating…</>
                : <><RefreshCw className="w-4 h-4 mr-2" />New Question</>
              }
            </Button>
          </div>
          
          {currentPart === 'part1' && (
            <p className="text-foreground/80 leading-relaxed text-lg">
              {(currentQuestion as any).question}
            </p>
          )}
          
          {currentPart === 'part2' && (
            <div className="bg-secondary/30 rounded-xl p-4">
              <pre className="whitespace-pre-wrap text-foreground/80 leading-relaxed font-sans">
                {(currentQuestion as any).cueCard}
              </pre>
            </div>
          )}
          
          {currentPart === 'part3' && (
            <div className="space-y-3">
              {(currentQuestion as any).questions.map((q: string, i: number) => (
                <div key={i} className="flex items-start gap-2">
                  <ChevronRight className="w-4 h-4 text-primary mt-1 flex-shrink-0" />
                  <p className="text-foreground/80 leading-relaxed">{q}</p>
                </div>
              ))}
            </div>
          )}

          <p className="text-xs text-muted-foreground mt-4">
            {currentPart === 'part1' 
              ? "Answer in 2-3 sentences. This simulates the examiner's introductory questions."
              : currentPart === 'part2'
              ? "You have 1 minute to prepare, then speak for 1-2 minutes on this topic."
              : "Discuss these abstract questions related to the topic. Aim for detailed, analytical responses."}
          </p>
        </div>

        {/* Recording Controls */}
        <div className="glass-card p-8 mb-6">
          <div className="flex flex-col items-center">
            {/* Waveform Visualization */}
            <div className={`w-full max-w-md h-24 flex items-center justify-center gap-1 mb-6 rounded-xl transition-all duration-300 ${
              isListening 
                ? "bg-destructive/10" 
                : transcript 
                ? "bg-green-500/10" 
                : "bg-secondary/30"
            }`}>
              {isListening ? (
                waveformBars.map((height, i) => (
                  <div
                    key={i}
                    className="w-2 bg-destructive rounded-full transition-all duration-75"
                    style={{ height: `${height}px` }}
                  />
                ))
              ) : transcript ? (
                <Volume2 className="w-12 h-12 text-green-500" />
              ) : (
                <Mic className="w-12 h-12 text-muted-foreground" />
              )}
            </div>

            {/* Browser Support Warning */}
            {!isSupported && (
              <p className="text-sm text-destructive mb-4">
                ⚠️ Speech recognition not supported. Please use Chrome or Edge.
              </p>
            )}

            {/* Controls */}
            <div className="flex items-center gap-4">
              {!isListening && !transcript && (
                <Button 
                  variant="neumorphicPrimary" 
                  size="lg" 
                  onClick={handleStartRecording}
                  disabled={!isSupported}
                >
                  <Mic className="w-5 h-5 mr-2" />
                  Start Speaking
                </Button>
              )}
              
              {isListening && (
                <Button variant="destructive" size="lg" onClick={handleStopRecording}>
                  <Square className="w-5 h-5 mr-2" />
                  Stop Recording
                </Button>
              )}

              {transcript && !isListening && (
                <>
                  <Button variant="glass" onClick={handleStartRecording}>
                    <Mic className="w-5 h-5 mr-2" />
                    Re-record
                  </Button>
                  <Button
                    variant="neumorphicPrimary"
                    onClick={analyzeTranscript}
                    disabled={isAnalyzing}
                  >
                    {isAnalyzing ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        Analyzing...
                      </>
                    ) : (
                      <>
                        <Play className="w-5 h-5 mr-2" />
                        Analyze Response
                      </>
                    )}
                  </Button>
                </>
              )}
            </div>

            {isListening && (
              <p className="text-sm text-destructive mt-4 animate-pulse">
                🎤 Recording in progress... Speak naturally
              </p>
            )}
          </div>
        </div>

        {/* Live Transcription */}
        {(transcript || interimTranscript) && (
          <div className="glass-card p-6 mb-6">
            <h2 className="text-lg font-light mb-4 flex items-center gap-2">
              Transcription
              {isListening && <span className="w-2 h-2 rounded-full bg-destructive animate-pulse" />}
            </h2>
            <p className="text-foreground/80 leading-relaxed">
              {transcript}
              {interimTranscript && (
                <span className="text-muted-foreground italic">{interimTranscript}</span>
              )}
            </p>
            {transcript.includes('[pause]') && (
              <p className="text-xs text-muted-foreground mt-3">
                💡 <span className="text-elite-gold">[pause]</span> markers indicate silences longer than 1.5 seconds
              </p>
            )}
          </div>
        )}

        {/* AI Feedback */}
        {feedback && (
          <div className="glass-card p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-light">🎯 AI Speaking Analysis</h2>
              <Button variant="outline" size="sm" onClick={handleRestartPractice}>
                <RefreshCw className="w-4 h-4 mr-2" />
                New Response
              </Button>
            </div>

            {/* Overall Score */}
            <div className="flex items-center justify-center mb-8">
              <div className="w-28 h-28 rounded-full bg-accent/20 flex flex-col items-center justify-center">
                <span className="text-4xl font-light text-accent">{feedback.overallBand}</span>
                <span className="text-xs text-muted-foreground">Overall Band</span>
              </div>
            </div>

            {/* Detailed Scores Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              {[
                { label: "Fluency & Coherence", score: feedback.fluencyCoherence?.score, key: "fluencyCoherence" },
                { label: "Lexical Resource", score: feedback.lexicalResource?.score, key: "lexicalResource" },
                { label: "Grammar Range", score: feedback.grammaticalRange?.score, key: "grammaticalRange" },
                { label: "Pronunciation", score: feedback.pronunciation?.score, key: "pronunciation" },
              ].map((item) => (
                <div key={item.label} className="text-center p-4 bg-secondary/30 rounded-xl">
                  <p className="text-2xl font-light text-accent">{item.score || "—"}</p>
                  <p className="text-xs text-muted-foreground mt-1">{item.label}</p>
                </div>
              ))}
            </div>

            {/* Fluency Analysis with Pause Detection */}
            {feedback.fluencyCoherence && (
              <div className="mb-6 p-4 bg-secondary/20 rounded-xl">
                <h3 className="text-sm font-medium text-accent mb-3">📊 Fluency Analysis</h3>
                <p className="text-sm text-foreground/70 mb-3">{feedback.fluencyCoherence.feedback}</p>
                
                {feedback.pauseAnalysis && (
                  <div className="flex items-center gap-4 mt-3">
                    <div className="px-4 py-2 rounded-lg bg-elite-gold/10">
                      <span className="text-lg font-medium text-elite-gold">{feedback.pauseAnalysis.count}</span>
                      <span className="text-xs text-muted-foreground ml-2">Pauses Detected</span>
                    </div>
                    {feedback.pauseAnalysis.impact && (
                      <p className="text-xs text-muted-foreground">{feedback.pauseAnalysis.impact}</p>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Filler Words */}
            {feedback.fillerWords && feedback.fillerWords.count > 0 && (
              <div className="mb-6 p-4 bg-destructive/5 rounded-xl">
                <h3 className="text-sm font-medium text-destructive mb-3">⚠️ Filler Words Detected</h3>
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-xl bg-destructive/10 flex items-center justify-center">
                    <span className="text-2xl font-light text-destructive">
                      {feedback.fillerWords.count}
                    </span>
                  </div>
                  <div className="flex-1">
                    <div className="flex flex-wrap gap-2 mb-2">
                      {feedback.fillerWords.examples?.map((word: string, i: number) => (
                        <span key={i} className="px-3 py-1 rounded-full bg-destructive/10 text-destructive text-sm">
                          "{word}"
                        </span>
                      ))}
                    </div>
                    {feedback.fillerWords.impact && (
                      <p className="text-xs text-muted-foreground">{feedback.fillerWords.impact}</p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Lexical Resource */}
            {feedback.lexicalResource && (
              <div className="mb-6 p-4 bg-secondary/20 rounded-xl">
                <h3 className="text-sm font-medium text-primary mb-3">📚 Vocabulary Analysis</h3>
                <p className="text-sm text-foreground/70 mb-3">{feedback.lexicalResource.feedback}</p>
                
                {feedback.lexicalResource.idiomaticExpressions && feedback.lexicalResource.idiomaticExpressions.length > 0 && (
                  <div className="mb-3">
                    <p className="text-xs text-muted-foreground mb-2">✅ Good Expressions Used:</p>
                    <div className="flex flex-wrap gap-2">
                      {feedback.lexicalResource.idiomaticExpressions.map((expr: string, i: number) => (
                        <span key={i} className="px-2 py-1 rounded bg-green-500/10 text-green-600 text-xs">
                          {expr}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                
                {feedback.lexicalResource.suggestions && feedback.lexicalResource.suggestions.length > 0 && (
                  <div>
                    <p className="text-xs text-muted-foreground mb-2">💡 Vocabulary Upgrades:</p>
                    <div className="flex flex-wrap gap-2">
                      {feedback.lexicalResource.suggestions.map((sugg: string, i: number) => (
                        <span key={i} className="px-2 py-1 rounded bg-elite-gold/10 text-elite-gold text-xs">
                          {sugg}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Grammar Analysis */}
            {feedback.grammaticalRange && (
              <div className="mb-6 p-4 bg-secondary/20 rounded-xl">
                <h3 className="text-sm font-medium text-accent mb-3">📝 Grammar Analysis</h3>
                <p className="text-sm text-foreground/70 mb-3">{feedback.grammaticalRange.feedback}</p>
                
                {feedback.grammaticalRange.complexStructures && feedback.grammaticalRange.complexStructures.length > 0 && (
                  <div className="mb-3">
                    <p className="text-xs text-muted-foreground mb-2">✅ Complex Structures Used:</p>
                    <ul className="space-y-1">
                      {feedback.grammaticalRange.complexStructures.map((struct: string, i: number) => (
                        <li key={i} className="text-xs text-green-600">• {struct}</li>
                      ))}
                    </ul>
                  </div>
                )}
                
                {feedback.grammarErrors && feedback.grammarErrors.length > 0 && (
                  <div>
                    <p className="text-xs text-muted-foreground mb-2">⚠️ Errors to Fix:</p>
                    <ul className="space-y-1">
                      {feedback.grammarErrors.map((err: string, i: number) => (
                        <li key={i} className="text-xs text-destructive">• {err}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {/* Improvements */}
            {feedback.improvements && feedback.improvements.length > 0 && (
              <div className="p-4 bg-elite-gold/5 rounded-xl">
                <h3 className="text-sm font-medium text-elite-gold mb-3">🚀 Areas for Improvement</h3>
                <ul className="space-y-2">
                  {feedback.improvements.map((item: string, i: number) => (
                    <li key={i} className="text-sm text-foreground/70 flex items-start gap-2">
                      <span className="text-elite-gold">•</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>

      <UpgradeModal
        isOpen={showUpgradeModal}
        onClose={() => setShowUpgradeModal(false)}
        featureName="Speaking"
      />
    </DashboardLayout>
  );
}
