import { useState, useRef } from "react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Mic, MicOff, Loader2, Play, Square, Volume2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const speakingPrompts = [
  "Describe a memorable trip you took recently. You should say where you went, who you went with, what you did there, and explain why it was memorable.",
  "Talk about a skill you would like to learn. You should say what the skill is, why you want to learn it, how you would learn it, and explain how this skill would benefit you.",
  "Describe a person who has influenced you. You should say who this person is, how you know them, what qualities they have, and explain why they have influenced you.",
];

export default function SpeakingModule() {
  const [isRecording, setIsRecording] = useState(false);
  const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null);
  const [transcription, setTranscription] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [feedback, setFeedback] = useState<any>(null);
  const [currentPromptIndex, setCurrentPromptIndex] = useState(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const { toast } = useToast();

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: "audio/webm" });
        setRecordedBlob(blob);
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordedBlob(null);
      setFeedback(null);
      setTranscription("");
    } catch (error) {
      toast({
        title: "Microphone access denied",
        description: "Please allow microphone access to record your response.",
        variant: "destructive",
      });
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const analyzeRecording = async () => {
    if (!recordedBlob) return;

    setIsAnalyzing(true);
    
    // For demo purposes, we'll use a mock transcription
    // In production, you would send the audio to a speech-to-text service
    const mockTranscription = "Well, I would like to talk about a memorable trip I took last summer to Bali, Indonesia. I went there with my family, including my parents and my younger sister. We spent about ten days exploring the island. During our trip, we visited many beautiful temples, like Tanah Lot and Uluwatu. We also went to the rice terraces in Ubud, which were absolutely stunning. The reason this trip was so memorable is because it was the first family vacation we had taken in several years. We had been so busy with work and school that we hadn't had the chance to spend quality time together. This trip really brought us closer as a family.";
    
    setTranscription(mockTranscription);

    try {
      const { data, error } = await supabase.functions.invoke("ai-analyze", {
        body: {
          type: "speaking",
          content: mockTranscription,
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

  const nextPrompt = () => {
    setCurrentPromptIndex((prev) => (prev + 1) % speakingPrompts.length);
    setRecordedBlob(null);
    setFeedback(null);
    setTranscription("");
  };

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
            <p className="text-sm text-muted-foreground">Voice AI analysis</p>
          </div>
        </div>

        {/* Prompt Card */}
        <div className="glass-card p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-light">Speaking Prompt</h2>
            <Button variant="ghost" size="sm" onClick={nextPrompt}>
              Next Prompt
            </Button>
          </div>
          <p className="text-foreground/80 leading-relaxed">
            {speakingPrompts[currentPromptIndex]}
          </p>
          <p className="text-xs text-muted-foreground mt-4">
            You will have 1-2 minutes to speak. Press "Start Recording" when ready.
          </p>
        </div>

        {/* Recording Controls */}
        <div className="glass-card p-8 mb-6">
          <div className="flex flex-col items-center">
            {/* Recording Visualization */}
            <div className={`w-32 h-32 rounded-full flex items-center justify-center mb-6 transition-all duration-300 ${
              isRecording 
                ? "bg-destructive/20 animate-pulse" 
                : recordedBlob 
                ? "bg-green-500/20" 
                : "bg-secondary/50"
            }`}>
              {isRecording ? (
                <div className="flex items-center gap-1">
                  {[0, 1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="w-1 bg-destructive rounded-full animate-pulse"
                      style={{
                        height: `${20 + Math.random() * 30}px`,
                        animationDelay: `${i * 0.1}s`,
                      }}
                    />
                  ))}
                </div>
              ) : recordedBlob ? (
                <Volume2 className="w-12 h-12 text-green-500" />
              ) : (
                <Mic className="w-12 h-12 text-muted-foreground" />
              )}
            </div>

            {/* Controls */}
            <div className="flex items-center gap-4">
              {!isRecording && !recordedBlob && (
                <Button variant="neumorphicPrimary" size="lg" onClick={startRecording}>
                  <Mic className="w-5 h-5 mr-2" />
                  Start Recording
                </Button>
              )}
              
              {isRecording && (
                <Button variant="destructive" size="lg" onClick={stopRecording}>
                  <Square className="w-5 h-5 mr-2" />
                  Stop Recording
                </Button>
              )}

              {recordedBlob && !isRecording && (
                <>
                  <Button variant="glass" onClick={startRecording}>
                    <Mic className="w-5 h-5 mr-2" />
                    Re-record
                  </Button>
                  <Button
                    variant="neumorphicPrimary"
                    onClick={analyzeRecording}
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

            {isRecording && (
              <p className="text-sm text-destructive mt-4 animate-pulse">
                Recording in progress...
              </p>
            )}
          </div>
        </div>

        {/* Transcription */}
        {transcription && (
          <div className="glass-card p-6 mb-6">
            <h2 className="text-lg font-light mb-4">Transcription</h2>
            <p className="text-foreground/80 leading-relaxed">{transcription}</p>
          </div>
        )}

        {/* Feedback */}
        {feedback && (
          <div className="glass-card p-6">
            <h2 className="text-lg font-light mb-6">AI Analysis</h2>

            {/* Overall Score */}
            <div className="flex items-center justify-center mb-8">
              <div className="w-24 h-24 rounded-full bg-accent/20 flex items-center justify-center">
                <span className="text-4xl font-light text-accent">{feedback.overallBand}</span>
              </div>
            </div>

            {/* Detailed Scores */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              {[
                { label: "Fluency", score: feedback.fluencyCoherence?.score },
                { label: "Vocabulary", score: feedback.lexicalResource?.score },
                { label: "Grammar", score: feedback.grammaticalRange?.score },
                { label: "Pronunciation", score: feedback.pronunciation?.score },
              ].map((item) => (
                <div key={item.label} className="text-center p-4 bg-secondary/30 rounded-xl">
                  <p className="text-2xl font-light text-accent">{item.score || "—"}</p>
                  <p className="text-xs text-muted-foreground mt-1">{item.label}</p>
                </div>
              ))}
            </div>

            {/* Filler Words */}
            {feedback.fillerWords && (
              <div className="mb-6">
                <h3 className="text-sm font-medium text-accent mb-3">Filler Words Detected</h3>
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-xl bg-destructive/10 flex items-center justify-center">
                    <span className="text-2xl font-light text-destructive">
                      {feedback.fillerWords.count}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {feedback.fillerWords.examples?.map((word: string, i: number) => (
                      <span key={i} className="px-3 py-1 rounded-full bg-destructive/10 text-destructive text-sm">
                        "{word}"
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Improvements */}
            {feedback.improvements && (
              <div>
                <h3 className="text-sm font-medium text-elite-gold mb-3">Areas for Improvement</h3>
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
    </DashboardLayout>
  );
}
