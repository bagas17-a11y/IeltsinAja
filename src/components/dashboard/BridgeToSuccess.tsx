import { useMemo } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useUserProgress } from "@/hooks/useUserProgress";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, Circle, Target, TrendingUp, BookOpen, Lightbulb } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface SkillToUnlock {
  skill: string;
  description: string;
  priority: "high" | "medium" | "low";
}

interface RecommendedLesson {
  title: string;
  description: string;
  path: string;
  bandTarget: string;
}

const getSkillsForBandTransition = (currentBand: number, targetBand: number): SkillToUnlock[] => {
  const skills: SkillToUnlock[] = [];
  
  // Band 5 → 6 transition skills
  if (currentBand < 6 && targetBand >= 6) {
    skills.push(
      { skill: "Subject-Verb Agreement", description: "Focus on avoiding basic subject-verb agreement errors", priority: "high" },
      { skill: "Tense Consistency", description: "Maintain consistent verb tenses throughout your writing", priority: "high" },
      { skill: "Basic Linking Words", description: "Use 'however', 'therefore', 'in addition' correctly", priority: "medium" },
      { skill: "Vocabulary Range", description: "Replace common words with less frequent synonyms", priority: "medium" }
    );
  }
  
  // Band 6 → 7 transition skills
  if (currentBand < 7 && targetBand >= 7) {
    skills.push(
      { skill: "Complex Sentence Structures", description: "Start using relative clauses and conditional sentences", priority: "high" },
      { skill: "Academic Collocations", description: "Use phrases like 'conduct research', 'significant impact'", priority: "high" },
      { skill: "Cohesive Devices", description: "Master advanced linking: 'consequently', 'notwithstanding'", priority: "medium" },
      { skill: "Idiomatic Expressions", description: "Include natural-sounding phrases appropriately", priority: "low" }
    );
  }
  
  // Band 7 → 8+ transition skills
  if (currentBand < 8 && targetBand >= 8) {
    skills.push(
      { skill: "Sophisticated Vocabulary", description: "Use precise academic vocabulary with natural accuracy", priority: "high" },
      { skill: "Error-Free Grammar", description: "Eliminate all grammatical errors in complex structures", priority: "high" },
      { skill: "Native-Like Fluency", description: "Write with native-like flow and natural expression", priority: "medium" }
    );
  }
  
  return skills;
};

const getRecommendedLessons = (currentBand: number): RecommendedLesson[] => {
  const lessons: RecommendedLesson[] = [];
  
  if (currentBand < 6) {
    lessons.push(
      { title: "Grammar Fundamentals", description: "Master tenses, articles, and prepositions", path: "/dashboard/writing", bandTarget: "Band 5 → 6" },
      { title: "Basic Reading Strategies", description: "Skimming and scanning techniques", path: "/dashboard/reading", bandTarget: "Band 5 → 6" },
      { title: "Listening for Main Ideas", description: "Practice identifying key information", path: "/dashboard/listening", bandTarget: "Band 5 → 6" }
    );
  } else if (currentBand < 7) {
    lessons.push(
      { title: "Complex Sentence Workshop", description: "Build sophisticated sentence structures", path: "/dashboard/writing", bandTarget: "Band 6 → 7" },
      { title: "Academic Vocabulary Builder", description: "Learn high-frequency academic words", path: "/dashboard/reading", bandTarget: "Band 6 → 7" },
      { title: "Inference and Detail Practice", description: "Improve comprehension of implicit meaning", path: "/dashboard/listening", bandTarget: "Band 6 → 7" }
    );
  } else {
    lessons.push(
      { title: "Advanced Essay Techniques", description: "Master Band 8+ writing strategies", path: "/dashboard/writing", bandTarget: "Band 7 → 8" },
      { title: "Speed Reading Mastery", description: "Process complex texts efficiently", path: "/dashboard/reading", bandTarget: "Band 7 → 8" },
      { title: "Native Speaker Patterns", description: "Understand natural speech patterns", path: "/dashboard/listening", bandTarget: "Band 7 → 8" }
    );
  }
  
  return lessons;
};

export function BridgeToSuccess() {
  const { profile } = useAuth();
  const { progress } = useUserProgress();
  const navigate = useNavigate();
  
  const currentBand = useMemo(() => {
    // Get from diagnostic quiz or calculate from scores
    const diagnosticResult = progress.find(p => (p.exam_type as string) === 'diagnostic');
    if (diagnosticResult?.band_score) {
      return Number(diagnosticResult.band_score);
    }
    
    // Fallback to reading score or default
    return Number(profile?.current_reading_score) || 5;
  }, [progress, profile]);
  
  const targetBand = Number(profile?.target_band_score) || 7;
  
  const progressPercentage = useMemo(() => {
    const gap = targetBand - 5; // Assuming minimum is 5
    const achieved = currentBand - 5;
    return Math.min(100, Math.max(0, (achieved / gap) * 100));
  }, [currentBand, targetBand]);
  
  const skillsToUnlock = useMemo(() => 
    getSkillsForBandTransition(currentBand, targetBand),
    [currentBand, targetBand]
  );
  
  const recommendedLessons = useMemo(() => 
    getRecommendedLessons(currentBand),
    [currentBand]
  );
  
  const diagnosticTaken = progress.some(p => (p.exam_type as string) === 'diagnostic');

  if (!diagnosticTaken) {
    return (
      <div className="glass-card p-6 space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center">
            <Target className="w-5 h-5 text-accent" />
          </div>
          <div>
            <h3 className="font-medium">Take the Diagnostic Quiz</h3>
            <p className="text-sm text-muted-foreground">
              Discover your current level and get a personalized learning path
            </p>
          </div>
        </div>
        <button
          onClick={() => navigate("/dashboard/diagnostic")}
          className="w-full btn-neumorphic-primary text-sm py-3"
        >
          Start Diagnostic Quiz
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Path to Target Visual */}
      <div className="glass-card p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-medium flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-accent" />
            Path to Target
          </h3>
          <span className="text-xs text-muted-foreground">
            {(targetBand - currentBand).toFixed(1)} bands to go
          </span>
        </div>
        
        <div className="relative pt-8 pb-4">
          {/* Progress Line */}
          <div className="relative h-3 bg-muted rounded-full overflow-hidden">
            <div 
              className="absolute left-0 top-0 h-full bg-gradient-to-r from-accent to-elite-gold rounded-full transition-all duration-500"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
          
          {/* Current Band Marker */}
          <div 
            className="absolute top-0 transform -translate-x-1/2"
            style={{ left: `${progressPercentage}%` }}
          >
            <div className="flex flex-col items-center">
              <span className="text-2xl font-light text-accent">{currentBand}</span>
              <span className="text-xs text-muted-foreground">Current</span>
            </div>
          </div>
          
          {/* Target Band Marker */}
          <div className="absolute top-0 right-0 transform translate-x-1/2">
            <div className="flex flex-col items-center">
              <span className="text-2xl font-light text-elite-gold">{targetBand}</span>
              <span className="text-xs text-muted-foreground">Target</span>
            </div>
          </div>
          
          {/* Band milestones */}
          <div className="flex justify-between mt-4 px-2">
            {[5, 5.5, 6, 6.5, 7, 7.5, 8].map((band) => (
              <div 
                key={band}
                className={`w-2 h-2 rounded-full ${
                  band <= currentBand 
                    ? "bg-accent" 
                    : band <= targetBand 
                      ? "bg-muted-foreground/30" 
                      : "bg-muted"
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Skills to Unlock */}
      <div className="glass-card p-6 space-y-4">
        <h3 className="font-medium flex items-center gap-2">
          <Lightbulb className="w-5 h-5 text-elite-gold" />
          Skills to Unlock
        </h3>
        <p className="text-sm text-muted-foreground">
          Focus on these areas to move from Band {currentBand} to Band {Math.min(currentBand + 1, targetBand)}
        </p>
        
        <div className="space-y-3">
          {skillsToUnlock.slice(0, 4).map((skill, index) => (
            <div 
              key={index}
              className="flex items-start gap-3 p-3 rounded-lg bg-muted/30"
            >
              <div className={`mt-0.5 ${
                skill.priority === "high" 
                  ? "text-destructive" 
                  : skill.priority === "medium"
                    ? "text-elite-gold"
                    : "text-muted-foreground"
              }`}>
                {skill.priority === "high" ? (
                  <Circle className="w-4 h-4 fill-current" />
                ) : (
                  <Circle className="w-4 h-4" />
                )}
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">{skill.skill}</p>
                <p className="text-xs text-muted-foreground">{skill.description}</p>
              </div>
              {skill.priority === "high" && (
                <span className="text-xs px-2 py-0.5 rounded-full bg-destructive/10 text-destructive">
                  Priority
                </span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Recommended Lessons */}
      <div className="glass-card p-6 space-y-4">
        <h3 className="font-medium flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-accent" />
          Recommended Lessons
        </h3>
        <p className="text-sm text-muted-foreground">
          Exercises tailored to your "Bridge" level
        </p>
        
        <div className="space-y-3">
          {recommendedLessons.map((lesson, index) => (
            <button
              key={index}
              onClick={() => navigate(lesson.path)}
              className="w-full flex items-center gap-4 p-4 rounded-xl border border-border hover:border-accent/50 transition-all text-left group"
            >
              <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                <BookOpen className="w-5 h-5 text-accent" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm truncate">{lesson.title}</p>
                <p className="text-xs text-muted-foreground truncate">{lesson.description}</p>
              </div>
              <span className="text-xs px-2 py-1 rounded-full bg-accent/10 text-accent whitespace-nowrap">
                {lesson.bandTarget}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
