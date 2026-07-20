import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useSubscriptionStatus } from "@/hooks/useSubscriptionStatus";
import { useUserProgress } from "@/hooks/useUserProgress";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { SubscriptionBanner } from "@/components/dashboard/SubscriptionBanner";
import { BridgeToSuccess } from "@/components/dashboard/BridgeToSuccess";
import { ExamCountdown } from "@/components/dashboard/ExamCountdown";
import { WeeklyInsights } from "@/components/dashboard/WeeklyInsights";
import { Button } from "@/components/ui/button";
import {
  BookOpen,
  Headphones,
  PenTool,
  Mic,
  Edit2,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";

const TARGET_SCORE_OPTIONS = [5.5, 6, 6.5, 7, 7.5, 8, 8.5, 9];

function bandColor(band: number | null | undefined) {
  if (band === null || band === undefined) return "text-muted-foreground";
  if (band >= 7) return "text-emerald-400";
  if (band >= 5.5) return "text-amber-400";
  return "text-red-400";
}

interface LatestDiagnostic {
  overall_band: number;
  reading_band: number | null;
  writing_band: number | null;
  listening_band: number | null;
  speaking_band: number | null;
  taken_at: string;
}

const moduleCards = [
  {
    icon: BookOpen,
    title: "Reading",
    description: "AI-powered passage analysis",
    path: "/dashboard/reading",
    color: "accent",
  },
  {
    icon: Headphones,
    title: "Listening",
    description: "Immersive audio practice",
    path: "/dashboard/listening",
    color: "accent",
  },
  {
    icon: PenTool,
    title: "Writing",
    description: "Examiner-style feedback",
    path: "/dashboard/writing",
    color: "elite-gold",
  },
  {
    icon: Mic,
    title: "Speaking",
    description: "Voice AI analysis",
    path: "/dashboard/speaking",
    color: "elite-gold",
  },
];

export default function Dashboard() {
  const { profile, user, isLoading, isAdmin, isCheckingAdmin, refreshProfile } = useAuth();
  const { isExpired, tier } = useSubscriptionStatus();
  const { progress } = useUserProgress();
  const navigate = useNavigate();
  const [isEditingTarget, setIsEditingTarget] = useState(false);
  const [latestDiagnostic, setLatestDiagnostic] = useState<LatestDiagnostic | null>(null);

  // Source of truth for "has this user taken the diagnostic" — reads
  // diagnostic_results directly rather than the user_progress flag, since
  // older diagnostic attempts (before that flag was wired up) wouldn't have
  // a matching user_progress row.
  useEffect(() => {
    if (!user?.id) return;
    supabase
      .from("diagnostic_results")
      .select("overall_band, reading_band, writing_band, listening_band, speaking_band, taken_at")
      .eq("user_id", user.id)
      .order("taken_at", { ascending: false })
      .limit(1)
      .maybeSingle()
      .then(({ data }) => setLatestDiagnostic(data));
  }, [user?.id]);

  const diagnosticTaken = !!latestDiagnostic || progress.some((p) => (p.exam_type as string) === "diagnostic");
  const firstName = profile?.full_name?.split(" ")[0];

  const handleTargetChange = async (value: string) => {
    if (!user) return;
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ target_band_score: parseFloat(value) })
        .eq('user_id', user.id);
      
      if (error) throw error;
      await refreshProfile();
      toast.success("Target score updated!");
      setIsEditingTarget(false);
    } catch (error) {
      toast.error("Failed to update target score");
    }
  };

  useEffect(() => {
    if (isLoading || isCheckingAdmin) return;
    if (!user) {
      navigate("/auth");
    }
  }, [isLoading, isCheckingAdmin, user, navigate]);

  return (
    <DashboardLayout>
      {/* Subscription Banner */}
      <SubscriptionBanner />

      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-light mb-2">
          {diagnosticTaken ? "Welcome back" : "Welcome"},{" "}
          <span className="text-accent">{firstName || "Student"}</span>
        </h1>
        <p className="text-muted-foreground">
          {diagnosticTaken
            ? "Continue your journey to IELTS excellence."
            : "Start by taking the 5-minute diagnostic so we can tailor your path."}
        </p>
      </div>

      {/* Exam countdown / date setter */}
      <ExamCountdown />

      {/* Diagnostic score summary */}
      {latestDiagnostic && (
        <div className="glass-card p-5 mb-8 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Your Diagnostic Score</p>
              <p className={`text-4xl font-light ${bandColor(latestDiagnostic.overall_band)}`}>
                {latestDiagnostic.overall_band}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Taken {formatDistanceToNow(new Date(latestDiagnostic.taken_at), { addSuffix: true })}
              </p>
            </div>
            <Button variant="outline" size="sm" onClick={() => navigate("/dashboard/diagnostic")}>
              View Full Results
            </Button>
          </div>
          <div className="grid grid-cols-4 gap-2">
            {[
              { label: "Reading", band: latestDiagnostic.reading_band },
              { label: "Writing", band: latestDiagnostic.writing_band },
              { label: "Listening", band: latestDiagnostic.listening_band },
              { label: "Speaking", band: latestDiagnostic.speaking_band },
            ].map((m) => (
              <div key={m.label} className="text-center p-2 rounded-lg bg-secondary/30">
                <p className={`text-lg font-semibold ${bandColor(m.band)}`}>{m.band ?? "—"}</p>
                <p className="text-[10px] text-muted-foreground">{m.label}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Target Score */}
      <div className="glass-card p-6 mb-8 max-w-xs">
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm text-muted-foreground">Target Score</span>
          <button
            onClick={() => setIsEditingTarget(!isEditingTarget)}
            className="flex items-center gap-1 text-elite-gold hover:text-elite-gold/80 transition-colors"
          >
            <Edit2 className="w-4 h-4" />
          </button>
        </div>
        {isEditingTarget ? (
          <Select
            defaultValue={(profile?.target_band_score || 7).toString()}
            onValueChange={handleTargetChange}
          >
            <SelectTrigger className="w-full text-3xl font-light text-elite-gold border-elite-gold/30 bg-transparent h-auto py-1">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-background border-border">
              {TARGET_SCORE_OPTIONS.map((score) => (
                <SelectItem key={score} value={score.toString()}>
                  {score}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        ) : (
          <p className="text-4xl font-light text-elite-gold">
            {profile?.target_band_score || 7.0}
          </p>
        )}
        <p className="text-xs text-muted-foreground mt-1">
          {isEditingTarget ? "Select new target" : "Click edit to change"}
        </p>
      </div>

      {/* Bridge to Success - Gap Analysis */}
      <h2 className="text-xl font-light mb-4">Your Path to Success</h2>
      <BridgeToSuccess />

      {/* Weekly insights */}
      <WeeklyInsights />

      {/* Module Cards */}
      <h2 className="text-xl font-light mb-4 mt-8">Practice Modules</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {moduleCards.map((module) => {
          const Icon = module.icon;
          return (
            <button
              key={module.title}
              onClick={() => navigate(module.path)}
              className="glass-card p-6 text-left group hover:scale-[1.02] transition-all duration-300"
            >
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110 ${
                module.color === "accent" ? "bg-accent/10 text-accent" : "bg-elite-gold/10 text-elite-gold"
              }`}>
                <Icon className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-light mb-1 text-foreground">{module.title}</h3>
              <p className="text-sm text-muted-foreground">{module.description}</p>
            </button>
          );
        })}
      </div>
    </DashboardLayout>
  );
}
