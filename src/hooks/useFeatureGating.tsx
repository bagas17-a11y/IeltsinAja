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
  const { user, profile } = useAuth();
  const { isExpired } = useSubscriptionStatus();
  const [practiceCount, setPracticeCount] = useState<Record<ModuleType, number>>({
    reading: 0,
    listening: 0,
    writing: 0,
    speaking: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  const fetchPracticeCounts = useCallback(async () => {
    if (!user) {
      setIsLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from("user_progress")
        .select("exam_type")
        .eq("user_id", user.id);

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
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchPracticeCounts();
  }, [fetchPracticeCounts]);

  const canAccess = useCallback(
    (module: ModuleType): boolean => {
      // If pro subscription is expired, treat as free tier
      if (profile?.subscription_tier === "pro" && isExpired) {
        return practiceCount[module] < FREE_PRACTICE_LIMIT;
      }

      // If user is not on free tier, they have unlimited access
      if (profile?.subscription_tier !== "free") {
        return true;
      }

      // Free tier users can only do 1 practice per module
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
