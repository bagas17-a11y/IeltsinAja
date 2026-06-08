import { useEffect, useRef, useState } from "react";
import { Sparkles, Users2, MessageCircle } from "lucide-react";

const valuePillars = [
  {
    icon: Sparkles,
    label: "AI for volume",
    description:
      "Generate fresh Reading, Listening, Writing, and Speaking practice on demand, with band-score feedback in seconds.",
  },
  {
    icon: Users2,
    label: "Humans for nuance",
    description:
      "Elite members get 5 hours of live coaching with an 8.5+ scorer who'll point at the exact sentence that's holding your band back.",
  },
  {
    icon: MessageCircle,
    label: "Indonesian first",
    description:
      "Hybrid English + Bahasa explanations, WhatsApp support during Jakarta hours, and a payment flow built for Indonesia.",
  },
];

export const MissionBridge = () => {
  const [isRevealed, setIsRevealed] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsRevealed(true);
        }
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="relative py-24 md:py-32 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-navy to-background" />

      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-border to-transparent" />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-border to-transparent" />
        <div className="absolute top-1/2 left-0 -translate-y-1/2 w-[400px] h-[400px] rounded-full bg-accent/5 blur-[100px]" />
        <div className="absolute top-1/2 right-0 -translate-y-1/2 w-[300px] h-[300px] rounded-full bg-glow-warm/5 blur-[100px]" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div
          className={`max-w-4xl mx-auto text-center transition-opacity transition-transform duration-500 ${
            isRevealed ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
          style={{ transitionTimingFunction: "cubic-bezier(0.23, 1, 0.32, 1)" }}
        >
          <div className="flex items-center justify-center gap-4 mb-8">
            <div className="w-12 h-px bg-accent/50" />
            <div className="w-2 h-2 rounded-full bg-accent animate-pulse-glow" />
            <div className="w-12 h-px bg-accent/50" />
          </div>

          <blockquote className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-light leading-[1.3] mb-6">
            <span className="text-foreground/90">AI handles the practice,</span>
            <br />
            <span className="text-foreground/90">humans handle the </span>
            <span className="text-gradient">nuance</span>
            <span className="text-foreground/90">.</span>
          </blockquote>

          <p className="text-base md:text-lg text-foreground/60 max-w-2xl mx-auto mb-16">
            We're a pilot-stage product. Honest about it. We're building IELTSinAja with
            real Indonesian learners — and we read every piece of feedback.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-5 max-w-5xl mx-auto">
          {valuePillars.map((pillar, i) => {
            const Icon = pillar.icon;
            return (
              <div
                key={pillar.label}
                className={`glass-card p-6 text-left transition-opacity transition-transform duration-500 ${
                  isRevealed ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
                }`}
                style={{
                  transitionDelay: `${300 + i * 70}ms`,
                  transitionTimingFunction: "cubic-bezier(0.23, 1, 0.32, 1)",
                }}
              >
                <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center mb-4">
                  <Icon className="w-5 h-5 text-accent" />
                </div>
                <h3 className="text-lg font-light text-foreground mb-2">
                  {pillar.label}
                </h3>
                <p className="text-sm text-foreground/65 leading-relaxed">
                  {pillar.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
