import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Check, Sparkles, Crown, Tag } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { PurchaseRegistrationModal } from "./PurchaseRegistrationModal";
import { toast } from "sonner";

const getPlans = (hasPromoCode: boolean) => [
  {
    name: "Free",
    price: "IDR 0",
    originalPrice: null,
    period: "",
    description: "Try 1 practice for each feature",
    amount: 0,
    features: [
      "1 Reading practice",
      "1 Listening practice",
      "1 Writing practice",
      "1 Speaking practice",
    ],
    highlighted: false,
    badge: null,
    tier: "free",
    planKey: "free",
  },
  {
    name: "Pro",
    price: hasPromoCode ? "IDR 250K" : "IDR 500K",
    originalPrice: hasPromoCode ? "IDR 500K" : null,
    period: "for 2 months",
    description: "Complete AI suite for serious learners",
    amount: hasPromoCode ? 250000 : 500000,
    features: [
      "Unlimited AI Reading Analysis",
      "Full Listening Lab access",
      "Instant AI Writing Band Scores",
      "Voice-to-Text Speaking Practice",
      "Progress analytics dashboard",
      "Priority support",
    ],
    highlighted: true,
    badge: "Recommended",
    tier: "pro",
    planKey: "pro",
  },
  {
    name: "Human+AI",
    price: "IDR 2.5M",
    originalPrice: null,
    period: "one-time",
    description: "Premium experience with personal consultation",
    amount: 2500000,
    features: [
      "Everything in Pro",
      "5 hours 1-on-1 consultation",
      "Senior Consultant Sessions",
      "Bespoke Study Roadmap",
      "Manual Examiner Essay Reviews",
      "VIP Priority Support",
    ],
    highlighted: false,
    badge: "Limited Spots",
    tier: "elite",
    planKey: "road_to_8",
  },
];

export const PricingMatrix = () => {
  const [revealedCards, setRevealedCards] = useState<Set<number>>(new Set());
  const [showRegistrationModal, setShowRegistrationModal] = useState(false);
  const [showPromoInput, setShowPromoInput] = useState(false);
  const [promoCode, setPromoCode] = useState("");
  const [promoApplied, setPromoApplied] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<{
    key: string;
    name: string;
    price: string;
    amount: number;
  } | null>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const { user } = useAuth();

  const plans = getPlans(promoApplied);

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

  const handleApplyPromo = () => {
    if (promoCode.toUpperCase() === "BAGASCUTS") {
      setPromoApplied(true);
      toast.success("Promo code applied! 50% off Pro plan.");
    } else {
      toast.error("Invalid promo code");
    }
  };

  const handleSubscribe = (plan: typeof plans[0]) => {
    setSelectedPlan({
      key: plan.planKey,
      name: plan.name,
      price: plan.price,
      amount: plan.amount,
    });
    setShowRegistrationModal(true);
  };

  return (
    <>
      <PurchaseRegistrationModal
        isOpen={showRegistrationModal}
        onClose={() => setShowRegistrationModal(false)}
        selectedPlan={selectedPlan}
      />
    <section id="pricing" className="py-24 md:py-32 relative">
      <div className="container mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-16 md:mb-20">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-light mb-6">
            Investment in Your <span className="text-gradient">Future</span>
          </h2>
          <p className="text-lg max-w-2xl mx-auto mb-8">
            Choose the path that matches your ambition. Every plan is designed
            to deliver measurable results.
          </p>
          
          {/* Promo Code Section */}
          <div className="max-w-sm mx-auto">
            {!showPromoInput ? (
              <Button
                variant="ghost"
                onClick={() => setShowPromoInput(true)}
                className="text-accent hover:text-accent/80"
              >
                <Tag className="w-4 h-4 mr-2" />
                Have a promo code?
              </Button>
            ) : (
              <div className="flex gap-2">
                <Input
                  placeholder="Enter promo code"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  className="flex-1"
                  disabled={promoApplied}
                />
                <Button 
                  onClick={handleApplyPromo}
                  disabled={promoApplied || !promoCode}
                >
                  {promoApplied ? "Applied!" : "Apply"}
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-6 lg:gap-8 max-w-5xl mx-auto">
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

                {/* Elite gold glow */}
                {plan.tier === "elite" && (
                  <div className="absolute -inset-0.5 bg-gradient-to-b from-elite-gold/50 to-elite-gold/20 rounded-2xl blur-sm -z-10" />
                )}

                <div
                  className={`glass-card p-8 h-full flex flex-col ${
                    plan.highlighted ? "border-accent/30" : plan.tier === "elite" ? "border-elite-gold/30" : ""
                  }`}
                >
                  {/* Badge */}
                  {plan.badge && (
                    <div
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium mb-6 w-fit ${
                        plan.badge === "Recommended"
                          ? "bg-accent/20 text-accent"
                          : "bg-elite-gold/20 text-elite-gold"
                      }`}
                    >
                      {plan.badge === "Recommended" ? (
                        <Sparkles className="w-3 h-3" />
                      ) : (
                        <Crown className="w-3 h-3" />
                      )}
                      {plan.badge}
                    </div>
                  )}

                  {/* Plan Name */}
                  <h3 className="text-2xl font-light mb-2 text-foreground">
                    {plan.name}
                  </h3>

                  {/* Price */}
                  <div className="flex items-baseline gap-2 mb-4">
                    <span className="text-4xl md:text-5xl font-light text-foreground">
                      {plan.price}
                    </span>
                    <span className="text-muted-foreground">{plan.period}</span>
                  </div>
                  {plan.originalPrice && (
                    <p className="text-sm text-muted-foreground line-through mb-2">
                      {plan.originalPrice}
                    </p>
                  )}

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
                    className={`w-full ${plan.tier === "elite" ? "border-elite-gold/30 text-elite-gold hover:bg-elite-gold/10" : ""}`}
                    size="lg"
                    onClick={() => handleSubscribe(plan)}
                  >
                    Sign me Up!
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
    </>
  );
};
