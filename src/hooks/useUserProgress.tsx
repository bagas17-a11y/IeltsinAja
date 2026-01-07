import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Json } from "@/integrations/supabase/types";

export interface ProgressEntry {
  id: string;
  user_id: string;
  exam_type: "reading" | "listening" | "writing" | "speaking";
  score: number | null;
  band_score: number | null;
  total_questions: number | null;
  correct_answers: number | null;
  feedback: string | null;
  completed_at: string;
  time_taken: number | null;
  errors_log: ErrorLogEntry[];
  metadata: Record<string, unknown>;
  created_at: string;
}

export interface ErrorLogEntry {
  type: string;
  count: number;
  details?: string;
}

export interface SkillBreakdown {
  reading: number;
  listening: number;
  writing: number;
  speaking: number;
}

export interface AIRecommendation {
  weakness: string;
  suggestion: string;
  practiceType: string;
}

export function useUserProgress() {
  const { user } = useAuth();
  const [progress, setProgress] = useState<ProgressEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProgress = useCallback(async () => {
    if (!user) {
      setProgress([]);
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      const { data, error: fetchError } = await supabase
        .from("user_progress")
        .select("*")
        .eq("user_id", user.id)
        .order("completed_at", { ascending: false });

      if (fetchError) throw fetchError;

      const mapped = (data || []).map((entry) => ({
        ...entry,
        exam_type: entry.exam_type as ProgressEntry["exam_type"],
        errors_log: Array.isArray(entry.errors_log) 
          ? (entry.errors_log as unknown as ErrorLogEntry[])
          : [],
        metadata: (entry.metadata as Record<string, unknown>) || {},
      }));

      setProgress(mapped);
      setError(null);
    } catch (err: unknown) {
      console.error("Error fetching progress:", err);
      setError(err instanceof Error ? err.message : "Failed to fetch progress");
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchProgress();
  }, [fetchProgress]);

  // Real-time subscription
  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel("user_progress_changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "user_progress",
          filter: `user_id=eq.${user.id}`,
        },
        () => {
          fetchProgress();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, fetchProgress]);

  const saveProgress = async (entry: Omit<ProgressEntry, "id" | "user_id" | "created_at">) => {
    if (!user) throw new Error("User not authenticated");

    const { data, error: insertError } = await supabase
      .from("user_progress")
      .insert({
        user_id: user.id,
        exam_type: entry.exam_type,
        score: entry.score,
        band_score: entry.band_score,
        total_questions: entry.total_questions,
        correct_answers: entry.correct_answers,
        feedback: entry.feedback,
        completed_at: entry.completed_at,
        time_taken: entry.time_taken,
        errors_log: entry.errors_log as unknown as Json,
        metadata: entry.metadata as unknown as Json,
      })
      .select()
      .single();

    if (insertError) throw insertError;
    return data;
  };

  const getRecentByType = (type: ProgressEntry["exam_type"], limit = 10) => {
    return progress
      .filter((p) => p.exam_type === type)
      .slice(0, limit);
  };

  const getBandScoreTrend = (limit = 10) => {
    return progress
      .slice(0, limit)
      .reverse()
      .map((p) => ({
        date: new Date(p.completed_at).toLocaleDateString(),
        score: p.band_score || 0,
        type: p.exam_type,
      }));
  };

  const getSkillBreakdown = (): SkillBreakdown => {
    const skills: SkillBreakdown = { reading: 0, listening: 0, writing: 0, speaking: 0 };
    const counts = { reading: 0, listening: 0, writing: 0, speaking: 0 };

    progress.forEach((p) => {
      if (p.band_score) {
        skills[p.exam_type] += p.band_score;
        counts[p.exam_type]++;
      }
    });

    return {
      reading: counts.reading ? skills.reading / counts.reading : 0,
      listening: counts.listening ? skills.listening / counts.listening : 0,
      writing: counts.writing ? skills.writing / counts.writing : 0,
      speaking: counts.speaking ? skills.speaking / counts.speaking : 0,
    };
  };

  const getAIRecommendations = (): AIRecommendation[] => {
    const recent = progress.slice(0, 5);
    if (recent.length === 0) return [];

    const recommendations: AIRecommendation[] = [];
    const skills = getSkillBreakdown();
    const weakestSkill = Object.entries(skills)
      .filter(([, v]) => v > 0)
      .sort((a, b) => a[1] - b[1])[0];

    if (weakestSkill && weakestSkill[1] < 7) {
      recommendations.push({
        weakness: `Low ${weakestSkill[0]} score (${weakestSkill[1].toFixed(1)})`,
        suggestion: `Focus on ${weakestSkill[0]} practice to improve your overall band score`,
        practiceType: weakestSkill[0],
      });
    }

    // Analyze error patterns
    const errorCounts: Record<string, number> = {};
    recent.forEach((p) => {
      p.errors_log.forEach((e) => {
        errorCounts[e.type] = (errorCounts[e.type] || 0) + e.count;
      });
    });

    const topErrors = Object.entries(errorCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 2);

    topErrors.forEach(([errorType, count]) => {
      recommendations.push({
        weakness: `${errorType} errors (${count} in last 5 exams)`,
        suggestion: `Practice exercises targeting ${errorType.toLowerCase()}`,
        practiceType: errorType,
      });
    });

    return recommendations;
  };

  const getOverallAverage = () => {
    const withScores = progress.filter((p) => p.band_score);
    if (withScores.length === 0) return null;
    return withScores.reduce((sum, p) => sum + (p.band_score || 0), 0) / withScores.length;
  };

  return {
    progress,
    isLoading,
    error,
    saveProgress,
    fetchProgress,
    getRecentByType,
    getBandScoreTrend,
    getSkillBreakdown,
    getAIRecommendations,
    getOverallAverage,
  };
}
