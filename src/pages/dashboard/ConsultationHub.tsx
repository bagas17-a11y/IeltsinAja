import { useState } from "react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Users, Calendar, Crown, Lock, Clock, Star } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";

const consultants = [
  {
    name: "Dr. Sarah Mitchell",
    title: "Former IELTS Chief Examiner",
    experience: "15+ years",
    specialization: "Writing & Speaking",
    rating: 4.9,
    sessions: 2400,
    image: null,
  },
  {
    name: "Prof. James Crawford",
    title: "Ex-British Council Examiner",
    experience: "12+ years",
    specialization: "Academic Writing",
    rating: 4.8,
    sessions: 1850,
    image: null,
  },
  {
    name: "Ms. Emily Chen",
    title: "IELTS Master Trainer",
    experience: "10+ years",
    specialization: "Speaking & Fluency",
    rating: 4.9,
    sessions: 1620,
    image: null,
  },
];

const timeSlots = [
  "09:00 AM", "10:00 AM", "11:00 AM",
  "02:00 PM", "03:00 PM", "04:00 PM",
  "07:00 PM", "08:00 PM",
];

export default function ConsultationHub() {
  const { profile } = useAuth();
  const navigate = useNavigate();
  const [selectedConsultant, setSelectedConsultant] = useState<typeof consultants[0] | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedTime, setSelectedTime] = useState<string>("");

  const isElite = profile?.subscription_tier === "elite";

  if (!isElite) {
    return (
      <DashboardLayout>
        <div className="max-w-2xl mx-auto text-center py-16">
          <div className="w-20 h-20 rounded-full bg-elite-gold/10 flex items-center justify-center mx-auto mb-6">
            <Lock className="w-10 h-10 text-elite-gold" />
          </div>
          <h1 className="text-3xl font-light mb-4">
            Unlock <span className="text-elite-gold">Consultation Hub</span>
          </h1>
          <p className="text-muted-foreground mb-8 max-w-lg mx-auto">
            Get personalized 1-on-1 sessions with former IELTS examiners. 
            Upgrade to the Road to 8.0+ plan to access this exclusive feature.
          </p>
          <div className="glass-card p-6 mb-8">
            <h3 className="text-lg font-light mb-4">What's Included:</h3>
            <ul className="space-y-3 text-left max-w-md mx-auto">
              {[
                "5 hours of 1-on-1 consultation",
                "Personalized study roadmap",
                "Manual examiner essay reviews",
                "VIP priority support",
                "Guaranteed score improvement",
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
            onClick={() => navigate("/#pricing")}
            className="bg-elite-gold/20 text-elite-gold border-elite-gold/30"
          >
            Upgrade to Road to 8.0+
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-6xl">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 rounded-xl bg-elite-gold/10 flex items-center justify-center">
            <Users className="w-6 h-6 text-elite-gold" />
          </div>
          <div>
            <h1 className="text-2xl font-light">Consultation Hub</h1>
            <p className="text-sm text-muted-foreground">Book 1-on-1 sessions with ex-examiners</p>
          </div>
        </div>

        {/* Consultant Cards */}
        <h2 className="text-lg font-light mb-4">Master Consultants</h2>
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {consultants.map((consultant) => (
            <button
              key={consultant.name}
              onClick={() => setSelectedConsultant(consultant)}
              className={`glass-card p-6 text-left transition-all duration-300 ${
                selectedConsultant?.name === consultant.name
                  ? "border-elite-gold/50 bg-elite-gold/5"
                  : "hover:border-border/50"
              }`}
            >
              {/* Avatar */}
              <div className="w-16 h-16 rounded-full bg-elite-gold/20 flex items-center justify-center mb-4">
                <span className="text-xl font-medium text-elite-gold">
                  {consultant.name.split(" ").map((n) => n[0]).join("")}
                </span>
              </div>

              <h3 className="text-lg font-light mb-1">{consultant.name}</h3>
              <p className="text-sm text-elite-gold mb-2">{consultant.title}</p>
              <p className="text-xs text-muted-foreground mb-4">
                {consultant.experience} • {consultant.specialization}
              </p>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-elite-gold fill-elite-gold" />
                  <span className="text-sm text-foreground">{consultant.rating}</span>
                </div>
                <span className="text-xs text-muted-foreground">
                  {consultant.sessions.toLocaleString()} sessions
                </span>
              </div>
            </button>
          ))}
        </div>

        {/* Booking Section */}
        {selectedConsultant && (
          <div className="glass-card p-6">
            <h2 className="text-lg font-light mb-6 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-elite-gold" />
              Book with {selectedConsultant.name}
            </h2>

            <div className="grid md:grid-cols-2 gap-8">
              {/* Date Selection */}
              <div>
                <label className="text-sm text-muted-foreground mb-3 block">Select Date</label>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  min={new Date().toISOString().split("T")[0]}
                  className="w-full p-3 rounded-xl bg-secondary/30 border border-border/30 text-foreground"
                />
              </div>

              {/* Time Selection */}
              <div>
                <label className="text-sm text-muted-foreground mb-3 block">Select Time (WIB)</label>
                <div className="grid grid-cols-4 gap-2">
                  {timeSlots.map((time) => (
                    <button
                      key={time}
                      onClick={() => setSelectedTime(time)}
                      className={`p-2 rounded-lg text-sm transition-all ${
                        selectedTime === time
                          ? "bg-elite-gold/20 text-elite-gold border border-elite-gold/30"
                          : "bg-secondary/30 text-foreground/70 hover:bg-secondary/50"
                      }`}
                    >
                      {time}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Session Info */}
            <div className="flex items-center gap-4 mt-6 p-4 bg-secondary/20 rounded-xl">
              <Clock className="w-5 h-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-foreground">60-minute session</p>
                <p className="text-xs text-muted-foreground">Includes video call and written feedback</p>
              </div>
            </div>

            {/* Confirm Button */}
            <Button
              variant="neumorphicPrimary"
              size="lg"
              className="w-full mt-6 bg-elite-gold/20 text-elite-gold"
              disabled={!selectedDate || !selectedTime}
            >
              Confirm Booking
            </Button>
          </div>
        )}

        {/* Roadmap Section */}
        <div className="glass-card p-6 mt-8">
          <h2 className="text-lg font-light mb-4 flex items-center gap-2">
            <Crown className="w-5 h-5 text-elite-gold" />
            Your Personalized Roadmap
          </h2>
          <p className="text-muted-foreground mb-6">
            Based on your current performance, here's your customized path to Band 8.0+
          </p>
          <div className="space-y-4">
            {[
              { week: "Week 1-2", focus: "Foundation Building", tasks: "Grammar review, vocabulary expansion" },
              { week: "Week 3-4", focus: "Writing Mastery", tasks: "Task 1 & 2 practice, structure refinement" },
              { week: "Week 5-6", focus: "Speaking Fluency", tasks: "Mock interviews, pronunciation drills" },
              { week: "Week 7-8", focus: "Full Mock Tests", tasks: "Timed practice, strategy refinement" },
            ].map((phase, i) => (
              <div key={i} className="flex items-start gap-4 p-4 bg-secondary/20 rounded-xl">
                <div className="w-12 h-12 rounded-xl bg-elite-gold/10 flex items-center justify-center flex-shrink-0">
                  <span className="text-sm font-medium text-elite-gold">{i + 1}</span>
                </div>
                <div>
                  <p className="text-sm text-elite-gold">{phase.week}</p>
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
