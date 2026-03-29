import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";
import { useSubscriptionStatus } from "./useSubscriptionStatus";

type ModuleType = "reading" | "listening" | "writing" | "speaking";

interface FeatureGatingResult {
  canAccess: (module: ModuleType) => boolean;
  practiceCount: Record<ModuleType, number>;
  isLoading: boolean;
  checkAccess: (module: ModuleType) => boolean;
  refreshCounts: () => Promise<void>;
  isSubscriptionExpired: boolean;
}

const FREE_PRACTICE_LIMIT = 1;

export function useFeatureGating(): FeatureGatingResult {
  const { user, profile, isLoading: isAuthLoading } = useAuth();
  const { isExpired } = useSubscriptionStatus();
  const [practiceCount, setPracticeCount] = useState<Record<ModuleType, number>>({
    reading: 0,
    listening: 0,
    writing: 0,
    speaking: 0,
  });
  const [isCountLoading, setIsCountLoading] = useState(true);

  // isLoading is true until BOTH auth (profile) AND practice counts are resolved.
  // This prevents canAccess from making tier decisions before profile is known,
  // which would incorrectly apply free-tier limits to paid users.
  const isLoading = isAuthLoading || isCountLoading;

  const fetchPracticeCounts = useCallback(async () => {
    if (!user) {
      setIsCountLoading(false);
      return;
    }

    try {
      let sessionStart = sessionStorage.getItem('ielts-session-start');
      if (!sessionStart) {
        sessionStart = new Date().toISOString();
        sessionStorage.setItem('ielts-session-start', sessionStart);
      }

      const { data, error } = await supabase
        .from("user_progress")
        .select("exam_type")
        .eq("user_id", user.id)
        .gte("completed_at", sessionStart);

      if (error) {
        console.error("Error fetching practice counts:", error);
        return;
      }

      const counts: Record<ModuleType, number> = {
        reading: 0,
        listening: 0,
        writing: 0,
        speaking: 0,
      };

      data?.forEach((entry) => {
        const type = entry.exam_type.toLowerCase() as ModuleType;
        if (type in counts) {
          counts[type]++;
        }
      });

      setPracticeCount(counts);
    } catch (error) {
      console.error("Error in fetchPracticeCounts:", error);
    } finally {
      setIsCountLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchPracticeCounts();
  }, [fetchPracticeCounts]);

  const canAccess = useCallback(
    (module: ModuleType): boolean => {
      // Treat null profile (not yet loaded) as free tier — never grant unlimited access by default
      if (!profile) {
        return practiceCount[module] < FREE_PRACTICE_LIMIT;
      }

      // If pro subscription is expired, treat as free tier
      if (profile.subscription_tier === "pro" && isExpired) {
        return practiceCount[module] < FREE_PRACTICE_LIMIT;
      }

      // Paid tier with valid subscription — unlimited access
      if (profile.subscription_tier !== "free") {
        return true;
      }

      // Free tier: one practice per module
      return practiceCount[module] < FREE_PRACTICE_LIMIT;
    },
    [profile, practiceCount, isExpired]
  );

  const checkAccess = useCallback(
    (module: ModuleType): boolean => {
      return canAccess(module);
    },
    [canAccess]
  );

  const refreshCounts = useCallback(async () => {
    await fetchPracticeCounts();
  }, [fetchPracticeCounts]);

  return {
    canAccess,
    practiceCount,
    isLoading,
    checkAccess,
    refreshCounts,
    isSubscriptionExpired: isExpired,
  };
}
