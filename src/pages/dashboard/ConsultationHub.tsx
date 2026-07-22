import { useEffect, useMemo, useState } from "react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Users,
  Calendar,
  Crown,
  Lock,
  MessageCircle,
  CheckCircle2,
  CalendarClock,
  Loader2,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { buildWhatsAppLink } from "@/lib/contact";
import { supabase } from "@/integrations/supabase/client";

interface AssignedMentor {
  name: string;
  title: string;
  bio: string | null;
  ielts_score_display: string | null;
  focus_areas: string[];
  whatsapp_number: string;
}

export default function ConsultationHub() {
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const [assignedMentor, setAssignedMentor] = useState<AssignedMentor | null>(null);
  const [isLoadingMentor, setIsLoadingMentor] = useState(true);

  const isElite = profile?.subscription_tier === "elite";
  // Unlocked either by Elite subscription, or by having a mentor explicitly
  // assigned (e.g. a Developing-tier student whose study plan includes
  // mentor-led sessions) — access isn't purely tier-gated anymore.
  const canAccess = isElite || !!assignedMentor;

  useEffect(() => {
    if (!user?.id) { setIsLoadingMentor(false); return; }
    supabase
      .from("mentor_assignments")
      .select("mentors(name, title, bio, ielts_score_display, focus_areas, whatsapp_number)")
      .eq("student_id", user.id)
      .maybeSingle()
      .then(({ data }) => {
        setAssignedMentor((data?.mentors as AssignedMentor | null) ?? null);
        setIsLoadingMentor(false);
      });
  }, [user?.id]);

  const waMessage = useMemo(() => {
    const name = profile?.full_name?.trim() || "an Engvolve member";
    const mentorName = assignedMentor?.name ? ` with ${assignedMentor.name}` : "";
    return `Hi Engvolve team, this is ${name}. I'd like to book a 1-on-1 coaching session${mentorName}.`;
  }, [profile?.full_name, assignedMentor?.name]);

  if (isLoadingMentor) {
    return (
      <DashboardLayout>
        <div className="flex justify-center py-24">
          <Loader2 className="w-8 h-8 animate-spin text-elite-gold" />
        </div>
      </DashboardLayout>
    );
  }

  if (!canAccess) {
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
          {assignedMentor ? (
            <div className="glass-card p-6 text-left border-elite-gold/50 bg-elite-gold/5">
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 rounded-full bg-elite-gold/20 flex items-center justify-center flex-shrink-0">
                  <span className="text-xl font-medium text-elite-gold">
                    {assignedMentor.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                  </span>
                </div>
                <div className="flex-1">
                  <div className="flex flex-wrap items-baseline gap-2">
                    <h3 className="text-lg font-light">{assignedMentor.name}</h3>
                    {assignedMentor.ielts_score_display && (
                      <Badge variant="outline" className="bg-elite-gold/10 text-elite-gold border-elite-gold/30">
                        {assignedMentor.ielts_score_display}
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-elite-gold mt-0.5">{assignedMentor.title}</p>
                  {assignedMentor.bio && <p className="text-sm text-foreground/70 mt-2">{assignedMentor.bio}</p>}
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {assignedMentor.focus_areas.map((f) => (
                      <Badge key={f} variant="outline" className="text-xs">
                        {f}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="glass-card p-6 text-center border-dashed">
              <p className="text-sm text-foreground/80 font-medium">Your mentor hasn't been assigned yet</p>
              <p className="text-sm text-muted-foreground mt-1">
                We're setting you up with a coach — check back soon, or message us on WhatsApp below if you'd like to follow up.
              </p>
            </div>
          )}
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
            href={buildWhatsAppLink(waMessage, assignedMentor?.whatsapp_number)}
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
      </div>
    </DashboardLayout>
  );
}
