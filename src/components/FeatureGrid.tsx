import { BookOpen, Headphones, PenTool, Users } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const features = [
  {
    icon: BookOpen,
    title: "Reading",
    subtitle: "Contextual Pattern Recognition",
    description:
      "AI-powered analysis identifies key patterns and logic structures in IELTS passages, teaching you to decode any text systematically.",
    color: "accent",
  },
  {
    icon: Headphones,
    title: "Listening",
    subtitle: "Adaptive Audio Environments",
    description:
      "Immersive practice with real accents—British, Australian, American—plus AI gap analysis to target your weakest areas.",
    color: "accent",
  },
  {
    icon: PenTool,
    title: "Writing",
    subtitle: "Strategic Linguistic Feedback",
    description:
      "Compare your essays to Band 9 models in real-time. Our AI highlights structural gaps while consultants perfect your voice.",
    color: "glow-warm",
  },
  {
    icon: Users,
    title: "Consulting",
    subtitle: "1-on-1 Examiner Precision",
    description:
      "Connect with ex-IELTS examiners who understand scoring criteria intimately. Break through the Band 7 ceiling with personalized guidance.",
    color: "glow-warm",
  },
];

export const FeatureGrid = () => {
  const [revealedCards, setRevealedCards] = useState<Set<number>>(new Set());
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = cardRefs.current.findIndex(
              (ref) => ref === entry.target
            );
            if (index !== -1) {
              setRevealedCards((prev) => new Set([...prev, index]));
            }
          }
        });
      },
      { threshold: 0.2 }
    );

    cardRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <section id="features" className="py-24 md:py-32 relative">
      <div className="container mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-16 md:mb-20">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-light mb-6">
            The Four Pillars of <span className="text-gradient">Excellence</span>
          </h2>
          <p className="text-lg max-w-2xl mx-auto">
            A comprehensive ecosystem designed to elevate every dimension of your IELTS performance.
          </p>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid md:grid-cols-2 gap-6 lg:gap-8 max-w-5xl mx-auto">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            const isRevealed = revealedCards.has(index);

            return (
              <div
                key={feature.title}
                ref={(el) => (cardRefs.current[index] = el)}
                className={`glass-card p-8 lg:p-10 group cursor-pointer transition-all duration-700 ${
                  isRevealed ? "revealed" : "scroll-reveal"
                }`}
                style={{ transitionDelay: `${index * 100}ms` }}
                id={feature.title.toLowerCase()}
              >
                {/* Icon */}
                <div
                  className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 transition-all duration-500 group-hover:scale-110 ${
                    feature.color === "accent"
                      ? "bg-accent/10 text-accent"
                      : "bg-glow-warm/10 text-glow-warm"
                  }`}
                >
                  <Icon className="w-6 h-6" />
                </div>

                {/* Content */}
                <h3 className="text-2xl font-light mb-2 text-foreground">
                  {feature.title}
                </h3>
                <p
                  className={`text-sm font-medium mb-4 ${
                    feature.color === "accent" ? "text-accent" : "text-glow-warm"
                  }`}
                >
                  {feature.subtitle}
                </p>
                <p className="text-foreground/70 leading-relaxed">
                  {feature.description}
                </p>

                {/* Hover accent line */}
                <div
                  className={`h-0.5 w-0 group-hover:w-16 mt-6 transition-all duration-500 ${
                    feature.color === "accent" ? "bg-accent" : "bg-glow-warm"
                  }`}
                />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
