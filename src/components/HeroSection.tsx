import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, CheckCircle2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

const heroBullets = [
  "AI feedback on every Reading, Listening, Writing & Speaking practice",
  "Built for Indonesian learners — explained in English & Bahasa",
  "1-on-1 coaching with an 8.5+ scorer on the Elite plan",
];

const previewCriteria = [
  { label: "Task Achievement", score: "7.0", pct: 78 },
  { label: "Coherence & Cohesion", score: "7.0", pct: 78 },
  { label: "Lexical Resource", score: "6.5", pct: 72 },
  { label: "Grammar Accuracy", score: "7.0", pct: 78 },
];

export const HeroSection = () => {
  const navigate = useNavigate();

  return (
    <section className="relative min-h-screen flex items-center justify-center bg-atmospheric overflow-hidden">
      {/* Atmospheric gradient orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-1/4 w-[600px] h-[600px] rounded-full bg-glow-accent/5 blur-[100px]" />
        <div className="absolute bottom-1/4 -right-1/4 w-[500px] h-[500px] rounded-full bg-glow-warm/10 blur-[100px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-navy/50 blur-[120px]" />
      </div>

      <div className="container mx-auto px-6 pt-32 pb-20 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 glass-card px-4 py-2 mb-8 animate-entrance">
            <Sparkles className="w-4 h-4 text-accent" />
            <span className="text-sm text-foreground/80">
              AI + alumni coaching for Indonesian IELTS candidates
            </span>
          </div>

          {/* Main Heading */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-light leading-[1.1] mb-6 animate-entrance delay-100">
            Latihan IELTS lengkap.
            <br />
            <span className="text-gradient">Feedback AI dalam detik.</span>
          </h1>

          {/* Subheading */}
          <p className="text-lg md:text-xl text-foreground/75 max-w-2xl mx-auto mb-8 animate-entrance delay-200">
            Practice Reading, Listening, Writing, and Speaking with instant AI band-score
            feedback — then accelerate with a real 8.5+ scorer on Elite.
          </p>

          {/* Trust bullets */}
          <ul className="flex flex-col sm:flex-row sm:items-center justify-center gap-3 sm:gap-6 mb-10 animate-entrance delay-300 text-left sm:text-center max-w-3xl mx-auto">
            {heroBullets.map((bullet) => (
              <li
                key={bullet}
                className="flex items-start sm:items-center gap-2 text-sm text-foreground/70"
              >
                <CheckCircle2 className="w-4 h-4 text-accent flex-shrink-0 mt-0.5 sm:mt-0" />
                <span>{bullet}</span>
              </li>
            ))}
          </ul>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-5 animate-entrance delay-300">
            <Button
              variant="neumorphicPrimary"
              size="xl"
              className="group w-full sm:w-auto"
              onClick={() => navigate("/auth?mode=signup")}
            >
              Start free — no card needed
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-150" />
            </Button>
            <Button
              variant="glass"
              size="xl"
              className="w-full sm:w-auto"
              onClick={() =>
                document
                  .getElementById("pricing")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
            >
              See pricing
            </Button>
          </div>

          <p className="text-xs text-muted-foreground mb-12 animate-entrance delay-400">
            Free plan includes one practice for each module. Pro from IDR 500K / month.
          </p>

          {/* AI feedback preview card */}
          <div className="animate-entrance-delayed max-w-xs mx-auto" style={{ animationDelay: '550ms' }}>
            <div className="glass-card p-5 text-left border border-border/60">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
                  <span className="text-[11px] font-medium text-muted-foreground tracking-wide uppercase">
                    AI Writing Feedback
                  </span>
                </div>
                <span className="text-[10px] text-muted-foreground/60">just now</span>
              </div>

              <div className="space-y-2.5 mb-4">
                {previewCriteria.map((item) => (
                  <div key={item.label} className="flex items-center gap-2.5">
                    <span className="text-[10px] text-foreground/50 w-32 flex-shrink-0 leading-tight">
                      {item.label}
                    </span>
                    <div className="flex-1 h-1 bg-muted/60 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${item.pct}%`,
                          background: "hsl(var(--accent) / 0.7)",
                        }}
                      />
                    </div>
                    <span className="text-[11px] text-foreground/60 w-6 text-right tabular-nums">
                      {item.score}
                    </span>
                  </div>
                ))}
              </div>

              <div className="pt-3 border-t border-border/20 flex items-center justify-between">
                <span className="text-[10px] text-muted-foreground">Overall Band Score</span>
                <span className="text-lg font-light text-gradient">7.0</span>
              </div>
            </div>

            <p className="text-[10px] text-muted-foreground/40 text-center mt-2">
              Sample output — your real feedback goes deeper
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
