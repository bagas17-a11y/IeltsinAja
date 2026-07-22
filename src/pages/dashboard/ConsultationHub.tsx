import { useMemo, useState } from "react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Users,
  Calendar,
  Crown,
  Lock,
  Clock,
  MessageCircle,
  CheckCircle2,
  CalendarClock,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { buildWhatsAppLink } from "@/lib/contact";

const COACHES = [
  {
    id: "bagas",
    name: "Bagas H. Wicaksono",
    title: "Founder & lead coach",
    score: "IELTS 8.5",
    bio: "Built Engvolve to give Indonesian learners the kind of feedback he wished he'd had. Focus: Writing & Speaking strategy.",
    focus: ["Writing", "Speaking"],
  },
];

const roadmap = [
  { week: "Week 1-2", focus: "Diagnose", tasks: "Take the diagnostic, identify your two weakest skills." },
  { week: "Week 3-4", focus: "Build", tasks: "AI-graded daily writing, targeted listening drills." },
  { week: "Week 5-6", focus: "Refine", tasks: "1-on-1 review sessions on your essays + speaking recordings." },
  { week: "Week 7-8", focus: "Mock", tasks: "Full-section mock under timed conditions, dry run with your coach." },
];

export default function ConsultationHub() {
  const { profile } = useAuth();
  const navigate = useNavigate();
  const [selectedCoach, setSelectedCoach] = useState(COACHES[0]);

  const isElite = profile?.subscription_tier === "elite";

  const waMessage = useMemo(() => {
    const name = profile?.full_name?.trim() || "an Engvolve Elite member";
    return `Hi Engvolve team, this is ${name}. I'd like to book a 1-on-1 coaching session with ${selectedCoach.name}.`;
  }, [profile?.full_name, selectedCoach.name]);

  if (!isElite) {
    return (
      <DashboardLayout>
        <div className="max-w-2xl mx-auto text-center py-16">
          <div className="w-20 h-20 rounded-full bg-elite-gold/10 flex items-center justify-center mx-auto mb-6">
            <Lock className="w-10 h-10 text-elite-gold" />
          </div>
          <h1 className="text-3xl font-light mb-4">
            Unlock the <span className="text-elite-gold">Consultation Hub</span>
          </h1>
          <p className="text-muted-foreground mb-8 max-w-lg mx-auto">
            1-on-1 coaching is part of the Elite plan. Get live coaching with
            an 8.5+ scorer who'll give you the kind of feedback the AI can't.
          </p>
          <div className="glass-card p-6 mb-8">
            <h3 className="text-lg font-light mb-4">What's included</h3>
            <ul className="space-y-3 text-left max-w-md mx-auto">
              {[
                "1-on-1 video coaching",
                "Manual essay reviews by an 8.5+ scorer",
                "Personalised 4-week study roadmap",
                "Priority WhatsApp support",
                "Scheduling within 24 hours of payment",
              ].map((feature) => (
                <li key={feature} className="flex items-center gap-3 text-foreground/80">
                  <Crown className="w-4 h-4 text-elite-gold flex-shrink-0" />
                  {feature}
                </li>
              ))}
            </ul>
          </div>
          <Button
            variant="neumorphicPrimary"
            size="lg"
            onClick={() => navigate("/pricing-selection")}
            className="bg-elite-gold/20 text-elite-gold border-elite-gold/30"
          >
            See Elite plan
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 rounded-xl bg-elite-gold/10 flex items-center justify-center">
            <Users className="w-6 h-6 text-elite-gold" />
          </div>
          <div>
            <h1 className="text-2xl font-light">Consultation Hub</h1>
            <p className="text-sm text-muted-foreground">
              Book a 1-on-1 session with your Engvolve coach.
            </p>
          </div>
        </div>

        {/* Honest pilot framing */}
        <div className="glass-card p-5 mb-8 border border-elite-gold/20 bg-elite-gold/5">
          <p className="text-sm text-foreground/90 flex items-start gap-2">
            <CalendarClock className="w-5 h-5 text-elite-gold flex-shrink-0 mt-0.5" />
            <span>
              <strong>How booking works during the pilot.</strong> Send us a WhatsApp message
              with your preferred date/time and we'll confirm within 24 hours. We're keeping
              scheduling personal until we have a critical mass of Elite members.
            </span>
          </p>
        </div>

        {/* Coach card */}
        <h2 className="text-lg font-light mb-4">Your coach</h2>
        <div className="grid md:grid-cols-1 gap-6 mb-8">
          {COACHES.map((coach) => (
            <div
              key={coach.id}
              onClick={() => setSelectedCoach(coach)}
              className={`glass-card p-6 text-left cursor-pointer transition-all ${
                selectedCoach.id === coach.id
                  ? "border-elite-gold/50 bg-elite-gold/5"
                  : "hover:border-border/50"
              }`}
            >
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 rounded-full bg-elite-gold/20 flex items-center justify-center flex-shrink-0">
                  <span className="text-xl font-medium text-elite-gold">
                    {coach.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                  </span>
                </div>
                <div className="flex-1">
                  <div className="flex flex-wrap items-baseline gap-2">
                    <h3 className="text-lg font-light">{coach.name}</h3>
                    <Badge variant="outline" className="bg-elite-gold/10 text-elite-gold border-elite-gold/30">
                      {coach.score}
                    </Badge>
                  </div>
                  <p className="text-sm text-elite-gold mt-0.5">{coach.title}</p>
                  <p className="text-sm text-foreground/70 mt-2">{coach.bio}</p>
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {coach.focus.map((f) => (
                      <Badge key={f} variant="outline" className="text-xs">
                        {f}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Booking */}
        <div className="glass-card p-6 mb-8">
          <h2 className="text-lg font-light mb-4 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-elite-gold" />
            Book a session
          </h2>
          <ul className="space-y-2 text-sm text-foreground/80 mb-6">
            {[
              "60-minute video call + written follow-up notes",
              "We work on Jakarta hours (WIB), evening + weekend slots available",
              "Cancel or reschedule up to 12 hours before",
            ].map((line) => (
              <li key={line} className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-elite-gold flex-shrink-0 mt-0.5" />
                <span>{line}</span>
              </li>
            ))}
          </ul>
          <a
            href={buildWhatsAppLink(waMessage)}
            target="_blank"
            rel="noopener noreferrer"
            className="block"
          >
            <Button
              variant="neumorphicPrimary"
              size="lg"
              className="w-full bg-elite-gold/20 text-elite-gold border border-elite-gold/30"
            >
              <MessageCircle className="w-4 h-4 mr-2" />
              Book on WhatsApp
            </Button>
          </a>
          <p className="text-xs text-muted-foreground text-center mt-3">
            We aim to confirm your slot within a few hours during Jakarta business hours.
          </p>
        </div>

        {/* Roadmap */}
        <div className="glass-card p-6">
          <h2 className="text-lg font-light mb-2 flex items-center gap-2">
            <Crown className="w-5 h-5 text-elite-gold" />
            Sample 8-week roadmap
          </h2>
          <p className="text-muted-foreground mb-6 text-sm">
            Your coach will tailor this to your diagnostic results during your first call.
          </p>
          <div className="space-y-3">
            {roadmap.map((phase, i) => (
              <div key={i} className="flex items-start gap-4 p-4 bg-secondary/20 rounded-xl">
                <div className="w-10 h-10 rounded-xl bg-elite-gold/10 flex items-center justify-center flex-shrink-0">
                  <span className="text-sm font-medium text-elite-gold">{i + 1}</span>
                </div>
                <div>
                  <p className="text-sm text-elite-gold flex items-center gap-2">
                    {phase.week}
                    <Clock className="w-3 h-3" />
                  </p>
                  <p className="font-light text-foreground">{phase.focus}</p>
                  <p className="text-xs text-muted-foreground">{phase.tasks}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
