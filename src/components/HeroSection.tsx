import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";
export const HeroSection = () => {
  return <section className="relative min-h-screen flex items-center justify-center bg-atmospheric overflow-hidden">
      {/* Atmospheric gradient orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-1/4 w-[600px] h-[600px] rounded-full bg-glow-accent/5 blur-[100px]" />
        <div className="absolute bottom-1/4 -right-1/4 w-[500px] h-[500px] rounded-full bg-glow-warm/10 blur-[100px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-navy/50 blur-[120px]" />
      </div>

      <div className="container mx-auto px-6 pt-32 pb-20 relative z-10">
        <div className="max-w-5xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 glass-card px-4 py-2 mb-8 animate-entrance">
            <Sparkles className="w-4 h-4 text-accent" />
            <span className="text-sm text-foreground/80">AI-Powered IELTS Preparation</span>
          </div>

          {/* Main Heading */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-light leading-[1.1] mb-8 animate-entrance delay-100">
            The Intelligence to{" "}
            <span className="text-gradient">Simplify</span>.
            <br />
            The Guidance to{" "}
            <span className="text-gradient">IELTS</span>.
          </h1>

          {/* Subheading */}
          <p className="text-lg md:text-xl max-w-2xl mx-auto mb-12 animate-entrance delay-200">Where cutting-edge AI meets elite human expertise. Master every IELTS module with precision technology and personalized consultation.</p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20 animate-entrance delay-300">
            <Button 
              variant="neumorphicPrimary" 
              size="xl" 
              className="group"
              onClick={() => document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Get Started
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button variant="glass" size="xl">
              Watch Demo
            </Button>
          </div>

          {/* Dashboard Mockup */}
          <div className="relative animate-entrance delay-400">
            <div className="glass-card p-6 md:p-8 max-w-4xl mx-auto">
              <div className="aspect-[16/10] rounded-xl bg-secondary/50 overflow-hidden relative">
                {/* Mock Dashboard UI */}
                <div className="absolute inset-0 p-6">
                  {/* Top bar */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center">
                        <span className="text-accent font-medium text-sm">JD</span>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">Welcome back, Dilan</p>
                        <p className="text-xs text-muted-foreground">Your Band Score Journey</p>
                      </div>
                    </div>
                    <div className="glass-card px-4 py-2">
                      <p className="text-xs text-muted-foreground">Current Score</p>
                      <p className="text-2xl font-light text-accent">8.5</p>
                    </div>
                  </div>

                  {/* Score Cards */}
                  <div className="grid grid-cols-4 gap-4 mb-6">
                    {[{
                    label: "Reading",
                    score: "8.5",
                    color: "accent"
                  }, {
                    label: "Listening",
                    score: "9.0",
                    color: "accent"
                  }, {
                    label: "Writing",
                    score: "8.0",
                    color: "glow-warm"
                  }, {
                    label: "Speaking",
                    score: "8.5",
                    color: "accent"
                  }].map(item => <div key={item.label} className="glass-card p-4 text-center">
                        <p className="text-xs text-muted-foreground mb-1">{item.label}</p>
                        <p className={`text-xl font-light ${item.color === 'accent' ? 'text-accent' : 'text-glow-warm'}`}>
                          {item.score}
                        </p>
                      </div>)}
                  </div>

                  {/* Progress indicator */}
                  <div className="glass-card p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-foreground">Progress to Band 9</span>
                      <span className="text-sm text-accent">94%</span>
                    </div>
                    <div className="h-2 rounded-full bg-secondary overflow-hidden">
                      <div className="h-full w-[94%] rounded-full bg-gradient-to-r from-accent to-glow-warm" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Glow effect */}
            <div className="absolute -inset-4 bg-gradient-to-t from-accent/10 via-transparent to-transparent blur-2xl -z-10" />
          </div>
        </div>
      </div>
    </section>;
};