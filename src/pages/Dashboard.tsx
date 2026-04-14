import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useSubscriptionStatus } from "@/hooks/useSubscriptionStatus";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { SubscriptionBanner } from "@/components/dashboard/SubscriptionBanner";
import { BridgeToSuccess } from "@/components/dashboard/BridgeToSuccess";
import { BookOpen, Headphones, PenTool, Mic, Target, Edit2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const TARGET_SCORE_OPTIONS = [5.5, 6, 6.5, 7, 7.5, 8, 8.5, 9];

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
  const navigate = useNavigate();
  const [isEditingTarget, setIsEditingTarget] = useState(false);

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

  // Redirect to waiting room if not verified (admins bypass this check)
  useEffect(() => {
    if (isLoading || isCheckingAdmin) return;
    if (!user) {
      navigate("/auth");
      return;
    }
    if (profile && !profile.is_verified && !isAdmin) {
      navigate("/waiting-room");
    }
  }, [isLoading, isCheckingAdmin, user, profile, isAdmin, navigate]);

  return (
    <DashboardLayout>
      {/* Subscription Banner */}
      <SubscriptionBanner />

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-light mb-2">
          Welcome back, <span className="text-accent">{profile?.full_name?.split(" ")[0] || "Student"}</span>
        </h1>
        <p className="text-muted-foreground">
          Continue your journey to IELTS excellence
        </p>
      </div>

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
