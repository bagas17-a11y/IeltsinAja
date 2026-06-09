import { useState, useEffect, useCallback, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";

type Module = "reading" | "writing" | "listening" | "speaking";

const cacheKey = (userId: string, module: Module) =>
  `ielts-completed-${module}-${userId}`;

/**
 * Tracks which questions/tests a user has completed for a given module.
 * Supabase is the source of truth; localStorage is a read-through cache
 * so the Done badges appear instantly on the next visit without waiting
 * for the network round-trip.
 */
export function useCompletedQuestions(module: Module) {
  const { user } = useAuth();
  const [completedIds, setCompletedIds] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(true);
  const inFlightRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    if (!user?.id) {
      setCompletedIds(new Set());
      setIsLoading(false);
      return;
    }

    // Paint with cache immediately so Done badges appear at once
    try {
      const raw = localStorage.getItem(cacheKey(user.id, module));
      if (raw) setCompletedIds(new Set(JSON.parse(raw)));
    } catch { /* ignore */ }

    // Fetch authoritative data from Supabase and merge in
    let cancelled = false;
    setIsLoading(true);

    (supabase as any)
      .from("user_completed_questions")
      .select("question_id")
      .eq("user_id", user.id)
      .eq("module", module)
      .then(({ data, error }: { data: { question_id: string }[] | null; error: any }) => {
        if (cancelled) return;
        if (error) {
          console.error("[useCompletedQuestions] fetch error:", error);
          setIsLoading(false);
          return;
        }
        const serverIds = new Set<string>(data?.map((r) => r.question_id) ?? []);
        setCompletedIds((prev) => {
          const merged = new Set([...prev, ...serverIds]);
          try {
            localStorage.setItem(cacheKey(user!.id, module), JSON.stringify([...merged]));
          } catch { /* ignore */ }
          return merged;
        });
        setIsLoading(false);
      });

    return () => { cancelled = true; };
  }, [user?.id, module]);

  const markCompleted = useCallback(
    (questionId: string) => {
      if (!user?.id || !questionId) return;

      // Optimistic local update first
      setCompletedIds((prev) => {
        if (prev.has(questionId)) return prev;
        const next = new Set(prev);
        next.add(questionId);
        try {
          localStorage.setItem(cacheKey(user!.id, module), JSON.stringify([...next]));
        } catch { /* ignore */ }
        return next;
      });

      // Deduplicate in-flight writes (e.g. double-submit)
      if (inFlightRef.current.has(questionId)) return;
      inFlightRef.current.add(questionId);

      (supabase as any)
        .from("user_completed_questions")
        .upsert(
          { user_id: user.id, module, question_id: questionId },
          { onConflict: "user_id,module,question_id", ignoreDuplicates: true }
        )
        .then(({ error }: { error: any }) => {
          inFlightRef.current.delete(questionId);
          if (error) console.error("[useCompletedQuestions] upsert error:", error);
        });
    },
    [user?.id, module]
  );

  return { completedIds, markCompleted, isLoading };
}
