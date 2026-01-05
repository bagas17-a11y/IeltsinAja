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
            <span className="text-gradient">IELTSinAja</span>.
          </h1>

          {/* Subheading */}
          <p className="text-lg md:text-xl max-w-2xl mx-auto mb-12 animate-entrance delay-200">IELTS-trained AI & 1 on 1 Consultation with 8.5+ Scorers </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20 animate-entrance delay-300">
            <Button variant="neumorphicPrimary" size="xl" className="group" onClick={() => document.getElementById('pricing')?.scrollIntoView({
            behavior: 'smooth'
          })}>
              Get Started
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button variant="glass" size="xl">
              Watch Demo
            </Button>
          </div>

          {/* Dashboard Mockup */}
          <div className="relative animate-entrance delay-400">
            

            {/* Glow effect */}
            <div className="absolute -inset-4 bg-gradient-to-t from-accent/10 via-transparent to-transparent blur-2xl -z-10" />
          </div>
        </div>
      </div>
    </section>;
};