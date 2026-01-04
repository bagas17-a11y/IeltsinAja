import { Button } from "@/components/ui/button";
import { Check, Sparkles } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const plans = [
  {
    name: "Basic",
    price: "$29",
    period: "/month",
    description: "Essential AI-powered practice for self-starters",
    features: [
      "AI Reading Engine access",
      "AI Listening Lab access",
      "Progress analytics dashboard",
      "5 practice tests per module",
      "Email support",
    ],
    highlighted: false,
    badge: null,
  },
  {
    name: "Pro",
    price: "$79",
    period: "/month",
    description: "Complete AI suite with expert feedback",
    features: [
      "Everything in Basic",
      "AI Writing Suite with feedback",
      "1 full mock test monthly",
      "Detailed score breakdown",
      "Priority support",
      "Speaking practice module",
    ],
    highlighted: true,
    badge: "Recommended",
  },
  {
    name: "Elite",
    price: "$249",
    period: "/month",
    description: "Premium experience with personal consultation",
    features: [
      "Everything in Pro",
      "5 hours 1-on-1 consultation",
      "Ex-examiner feedback sessions",
      "Personalized study roadmap",
      "Unlimited mock tests",
      "Guaranteed score improvement",
    ],
    highlighted: false,
    badge: "Limited Spots",
  },
];

export const PricingMatrix = () => {
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
    <section id="pricing" className="py-24 md:py-32 relative">
      <div className="container mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-16 md:mb-20">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-light mb-6">
            Investment in Your <span className="text-gradient">Future</span>
          </h2>
          <p className="text-lg max-w-2xl mx-auto">
            Choose the path that matches your ambition. Every plan is designed
            to deliver measurable results.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid lg:grid-cols-3 gap-6 lg:gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => {
            const isRevealed = revealedCards.has(index);

            return (
              <div
                key={plan.name}
                ref={(el) => (cardRefs.current[index] = el)}
                className={`relative transition-all duration-700 ${
                  isRevealed ? "revealed" : "scroll-reveal"
                } ${plan.highlighted ? "lg:-mt-4 lg:mb-4" : ""}`}
                style={{ transitionDelay: `${index * 150}ms` }}
              >
                {/* Highlight glow for Pro plan */}
                {plan.highlighted && (
                  <div className="absolute -inset-0.5 bg-gradient-to-b from-accent/50 to-accent/20 rounded-2xl blur-sm -z-10" />
                )}

                <div
                  className={`glass-card p-8 h-full flex flex-col ${
                    plan.highlighted ? "border-accent/30" : ""
                  }`}
                >
                  {/* Badge */}
                  {plan.badge && (
                    <div
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium mb-6 w-fit ${
                        plan.badge === "Recommended"
                          ? "bg-accent/20 text-accent"
                          : "bg-glow-warm/20 text-glow-warm"
                      }`}
                    >
                      {plan.badge === "Recommended" && (
                        <Sparkles className="w-3 h-3" />
                      )}
                      {plan.badge}
                    </div>
                  )}

                  {/* Plan Name */}
                  <h3 className="text-2xl font-light mb-2 text-foreground">
                    {plan.name}
                  </h3>

                  {/* Price */}
                  <div className="flex items-baseline gap-1 mb-4">
                    <span className="text-4xl md:text-5xl font-light text-foreground">
                      {plan.price}
                    </span>
                    <span className="text-muted-foreground">{plan.period}</span>
                  </div>

                  {/* Description */}
                  <p className="text-foreground/60 mb-8">{plan.description}</p>

                  {/* Features */}
                  <ul className="space-y-4 mb-8 flex-1">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-3">
                        <div className="w-5 h-5 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <Check className="w-3 h-3 text-accent" />
                        </div>
                        <span className="text-sm text-foreground/80">
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>

                  {/* CTA Button */}
                  <Button
                    variant={plan.highlighted ? "neumorphicPrimary" : "glass"}
                    className="w-full"
                    size="lg"
                  >
                    {plan.name === "Elite" ? "Apply Now" : "Get Started"}
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
