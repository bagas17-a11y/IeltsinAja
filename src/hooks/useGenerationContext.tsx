import { createContext, useContext, useState, useCallback, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";

type GenStatus = "idle" | "generating" | "done" | "error";

export interface ModuleGenState {
  status: GenStatus;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data?: any;
  errorMessage?: string;
  difficulty?: string;
}

const IDLE: ModuleGenState = { status: "idle" };

interface GenerationContextValue {
  listening: ModuleGenState;
  reading: ModuleGenState;
  startListeningGeneration: (difficulty: string, excludeId?: string | null, excludeTopics?: string[]) => void;
  startReadingGeneration: (difficulty: string) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  consumeListening: () => any | null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  consumeReading: () => any | null;
  resetListening: () => void;
  resetReading: () => void;
}

const GenerationContext = createContext<GenerationContextValue | null>(null);

export function GenerationProvider({ children }: { children: ReactNode }) {
  const [listening, setListening] = useState<ModuleGenState>(IDLE);
  const [reading, setReading] = useState<ModuleGenState>(IDLE);

  const startListeningGeneration = useCallback(
    async (difficulty: string, excludeId?: string | null, excludeTopics?: string[]) => {
      setListening({ status: "generating", difficulty });
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          setListening({ status: "error", errorMessage: "Authentication required" });
          return;
        }
        const { data, error } = await supabase.functions.invoke("generate-listening", {
          body: {
            difficulty,
            exclude_id: excludeId ?? undefined,
            exclude_topics: excludeTopics?.length ? excludeTopics : undefined,
          },
          headers: { Authorization: `Bearer ${session.access_token}` },
        });
        if (error) throw error;

        const resolved = data?.success ? data.data : data;
        if (!resolved?.sections?.length) throw new Error("Invalid response — sections missing");

        setListening({ status: "done", data: resolved, difficulty });
      } catch (err: unknown) {
        let errorMessage = "Failed to generate test. Please try again.";
        try {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const body = await (err as any)?.context?.json?.();
          if (body?.error) errorMessage = body.error;
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          else if ((err as any)?.status === 429 || body?.statusCode === 429) {
            errorMessage = "You've reached the hourly limit. Please wait a few minutes and try again.";
          }
        } catch {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const msg = (err as any)?.message;
          if (msg && !msg.includes("non-2xx")) errorMessage = msg;
        }
        setListening({ status: "error", errorMessage });
      }
    },
    []
  );

  const startReadingGeneration = useCallback(async (difficulty: string) => {
    setReading({ status: "generating", difficulty });
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        setReading({ status: "error", errorMessage: "Authentication required" });
        return;
      }
      const { data, error } = await supabase.functions.invoke("generate-reading", {
        body: { difficulty },
        headers: { Authorization: `Bearer ${session.access_token}` },
      });
      if (error) throw error;

      const resolved = data?.success ? data.data : data;
      if (!resolved?.sections?.length) throw new Error("AI returned no sections");

      setReading({ status: "done", data: resolved, difficulty });
    } catch (err: unknown) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const errorMessage = (err as any)?.message || "Failed to generate test. Please try again.";
      setReading({ status: "error", errorMessage });
    }
  }, []);

  const consumeListening = useCallback(() => {
    if (listening.status === "done") {
      const d = listening.data;
      setListening(IDLE);
      return d;
    }
    return null;
  }, [listening]);

  const consumeReading = useCallback(() => {
    if (reading.status === "done") {
      const d = reading.data;
      setReading(IDLE);
      return d;
    }
    return null;
  }, [reading]);

  const resetListening = useCallback(() => setListening(IDLE), []);
  const resetReading = useCallback(() => setReading(IDLE), []);

  return (
    <GenerationContext.Provider
      value={{
        listening,
        reading,
        startListeningGeneration,
        startReadingGeneration,
        consumeListening,
        consumeReading,
        resetListening,
        resetReading,
      }}
    >
      {children}
    </GenerationContext.Provider>
  );
}

export function useGenerationContext() {
  const ctx = useContext(GenerationContext);
  if (!ctx) throw new Error("useGenerationContext must be used within GenerationProvider");
  return ctx;
}
