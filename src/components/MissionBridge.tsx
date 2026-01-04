import { useEffect, useRef, useState } from "react";

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
    <section
      ref={sectionRef}
      className="relative py-32 md:py-40 overflow-hidden"
    >
      {/* Dark background with gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-navy to-background" />
      
      {/* Atmospheric elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-border to-transparent" />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-border to-transparent" />
        <div className="absolute top-1/2 left-0 -translate-y-1/2 w-[400px] h-[400px] rounded-full bg-accent/5 blur-[100px]" />
        <div className="absolute top-1/2 right-0 -translate-y-1/2 w-[300px] h-[300px] rounded-full bg-glow-warm/5 blur-[100px]" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div
          className={`max-w-4xl mx-auto text-center transition-all duration-1000 ${
            isRevealed ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          {/* Decorative element */}
          <div className="flex items-center justify-center gap-4 mb-12">
            <div className="w-12 h-px bg-accent/50" />
            <div className="w-2 h-2 rounded-full bg-accent animate-pulse-glow" />
            <div className="w-12 h-px bg-accent/50" />
          </div>

          <blockquote className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-light leading-[1.3] mb-8">
            <span className="text-foreground/90">AI automates the practice,</span>
            <br />
            <span className="text-foreground/90">but humans </span>
            <span className="text-gradient">master the nuance</span>
            <span className="text-foreground/90">.</span>
          </blockquote>

          <p className="text-lg md:text-xl text-foreground/60 max-w-2xl mx-auto">
            We built IELTS Elite to bridge the gap between{" "}
            <span className="text-foreground/90">'good enough'</span> and{" "}
            <span className="text-accent">Band 9</span>.
          </p>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 mt-16 pt-16 border-t border-border/30">
            {[
              { value: "50,000+", label: "Students Trained" },
              { value: "8.2", label: "Average Band Score" },
              { value: "97%", label: "Success Rate" },
            ].map((stat, index) => (
              <div
                key={stat.label}
                className={`transition-all duration-700 ${
                  isRevealed
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-5"
                }`}
                style={{ transitionDelay: `${300 + index * 150}ms` }}
              >
                <p className="text-3xl md:text-4xl font-light text-accent mb-2">
                  {stat.value}
                </p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
