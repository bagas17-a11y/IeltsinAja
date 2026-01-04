import { useState, useRef, useEffect } from "react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Headphones, Play, Pause, Volume2, RotateCcw } from "lucide-react";

// Sample audio URL (royalty-free)
const sampleAudioUrl = "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav";

const sampleTranscript = [
  { time: 0, text: "Welcome to the IELTS Listening practice module." },
  { time: 3, text: "In this section, you will hear a conversation between two university students." },
  { time: 8, text: "Listen carefully and answer the questions that follow." },
  { time: 12, text: "The recording will be played only once, so pay close attention." },
  { time: 17, text: "Now, let's begin with Section One." },
];

export default function ListeningModule() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentLineIndex, setCurrentLineIndex] = useState(-1);
  const audioRef = useRef<HTMLAudioElement>(null);
  const transcriptRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
      
      // Find current transcript line
      const lineIndex = sampleTranscript.findIndex((line, i) => {
        const nextLine = sampleTranscript[i + 1];
        return audio.currentTime >= line.time && (!nextLine || audio.currentTime < nextLine.time);
      });
      
      if (lineIndex !== currentLineIndex) {
        setCurrentLineIndex(lineIndex);
      }
    };

    const handleLoadedMetadata = () => {
      setDuration(audio.duration);
    };

    const handleEnded = () => {
      setIsPlaying(false);
    };

    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("loadedmetadata", handleLoadedMetadata);
    audio.addEventListener("ended", handleEnded);

    return () => {
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
      audio.removeEventListener("ended", handleEnded);
    };
  }, [currentLineIndex]);

  useEffect(() => {
    if (currentLineIndex >= 0 && transcriptRef.current) {
      const lines = transcriptRef.current.querySelectorAll(".transcript-line");
      lines[currentLineIndex]?.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [currentLineIndex]);

  const togglePlayPause = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleRestart = () => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.currentTime = 0;
    setCurrentLineIndex(-1);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <DashboardLayout>
      <div className="max-w-4xl">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center">
            <Headphones className="w-6 h-6 text-accent" />
          </div>
          <div>
            <h1 className="text-2xl font-light">Listening Practice</h1>
            <p className="text-sm text-muted-foreground">Immersive audio with live transcript</p>
          </div>
        </div>

        {/* Audio Player */}
        <div className="glass-card p-6 mb-6">
          <audio ref={audioRef} src={sampleAudioUrl} preload="metadata" />
          
          {/* Waveform Visualization (Simplified) */}
          <div className="h-24 bg-secondary/30 rounded-xl mb-4 flex items-center justify-center relative overflow-hidden">
            <div className="absolute inset-0 flex items-center justify-center gap-1">
              {Array.from({ length: 50 }).map((_, i) => {
                const height = Math.sin(i * 0.3 + currentTime * 2) * 30 + 40;
                const isActive = (i / 50) * 100 <= progress;
                return (
                  <div
                    key={i}
                    className={`w-1 rounded-full transition-all duration-100 ${
                      isActive ? "bg-accent" : "bg-muted-foreground/20"
                    }`}
                    style={{ height: `${height}%` }}
                  />
                );
              })}
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mb-4">
            <div className="h-2 bg-secondary/50 rounded-full overflow-hidden">
              <div
                className="h-full bg-accent rounded-full transition-all duration-100"
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="flex justify-between text-xs text-muted-foreground mt-2">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-center gap-4">
            <Button variant="glass" size="icon" onClick={handleRestart}>
              <RotateCcw className="w-5 h-5" />
            </Button>
            <Button
              variant="neumorphicPrimary"
              size="lg"
              onClick={togglePlayPause}
              className="w-14 h-14 rounded-full"
            >
              {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 ml-1" />}
            </Button>
            <Button variant="glass" size="icon">
              <Volume2 className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Transcript */}
        <div className="glass-card p-6">
          <h2 className="text-lg font-light mb-4 flex items-center gap-2">
            <span>Live Transcript</span>
            <span className="text-xs px-2 py-1 rounded-full bg-accent/10 text-accent">
              Auto-highlighting
            </span>
          </h2>
          
          <div
            ref={transcriptRef}
            className="max-h-64 overflow-y-auto space-y-3 pr-2"
          >
            {sampleTranscript.map((line, index) => (
              <p
                key={index}
                className={`transcript-line p-3 rounded-lg transition-all duration-300 ${
                  index === currentLineIndex
                    ? "bg-accent/10 text-accent border-l-2 border-accent"
                    : index < currentLineIndex
                    ? "text-foreground/50"
                    : "text-foreground/70"
                }`}
              >
                <span className="text-xs text-muted-foreground mr-3">
                  {formatTime(line.time)}
                </span>
                {line.text}
              </p>
            ))}
          </div>
        </div>

        {/* Practice Note */}
        <div className="mt-6 p-4 rounded-xl bg-accent/5 border border-accent/20">
          <p className="text-sm text-muted-foreground">
            <strong className="text-accent">Pro Tip:</strong> Focus on understanding the main ideas first. 
            Don't worry if you miss a few words—context helps fill in the gaps.
          </p>
        </div>
      </div>
    </DashboardLayout>
  );
}
