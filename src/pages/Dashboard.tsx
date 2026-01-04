import { useAuth } from "@/hooks/useAuth";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { BookOpen, Headphones, PenTool, Mic, TrendingUp, Target } from "lucide-react";
import { useNavigate } from "react-router-dom";

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
  const { profile } = useAuth();
  const navigate = useNavigate();

  const scores = [
    { label: "Reading", score: profile?.current_reading_score },
    { label: "Listening", score: profile?.current_listening_score },
    { label: "Writing", score: profile?.current_writing_score },
    { label: "Speaking", score: profile?.current_speaking_score },
  ];

  const overallScore = scores.filter(s => s.score).length > 0
    ? (scores.reduce((acc, s) => acc + (Number(s.score) || 0), 0) / scores.filter(s => s.score).length).toFixed(1)
    : null;

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-light mb-2">
          Welcome back, <span className="text-accent">{profile?.full_name?.split(" ")[0] || "Student"}</span>
        </h1>
        <p className="text-muted-foreground">
          Continue your journey to IELTS excellence
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {/* Overall Score */}
        <div className="glass-card p-6 col-span-1">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm text-muted-foreground">Overall Score</span>
            <TrendingUp className="w-5 h-5 text-accent" />
          </div>
          <p className="text-4xl font-light text-accent">
            {overallScore || "—"}
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            {overallScore ? "Current estimate" : "Complete practice to see score"}
          </p>
        </div>

        {/* Target Score */}
        <div className="glass-card p-6 col-span-1">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm text-muted-foreground">Target Score</span>
            <Target className="w-5 h-5 text-elite-gold" />
          </div>
          <p className="text-4xl font-light text-elite-gold">
            {profile?.target_band_score || 7.0}
          </p>
          <p className="text-xs text-muted-foreground mt-1">Band score goal</p>
        </div>

        {/* Score Breakdown */}
        <div className="glass-card p-6 col-span-1 lg:col-span-1">
          <span className="text-sm text-muted-foreground block mb-4">Module Scores</span>
          <div className="grid grid-cols-2 gap-3">
            {scores.map((item) => (
              <div key={item.label} className="text-center">
                <p className="text-xs text-muted-foreground mb-1">{item.label}</p>
                <p className="text-lg font-light text-foreground">
                  {item.score || "—"}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Module Cards */}
      <h2 className="text-xl font-light mb-4">Practice Modules</h2>
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
