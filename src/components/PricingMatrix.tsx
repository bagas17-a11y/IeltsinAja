import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Check,
  Sparkles,
  Crown,
  Tag,
  ArrowRight,
  ShieldCheck,
  MessageCircle,
  UserPlus,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { PLANS, PROMO_CODE, resolvePrice } from "@/lib/plans";
import { buildWhatsAppLink, CONTACT_MESSAGES } from "@/lib/contact";

export const PricingMatrix = () => {
  const navigate = useNavigate();
  const { user, profile } = useAuth();
  const [revealedCards, setRevealedCards] = useState<Set<number>>(new Set());
  const [showPromoInput, setShowPromoInput] = useState(false);
  const [promoCode, setPromoCode] = useState("");
  const [promoApplied, setPromoApplied] = useState(false);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = cardRefs.current.findIndex((ref) => ref === entry.target);
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
    if (promoCode.trim().toUpperCase() === PROMO_CODE) {
      setPromoApplied(true);
      toast.success("Promo applied — 50% off Pro for your first month.");
    } else {
      toast.error("Invalid promo code");
    }
  };

  const handleSelectPlan = (planKey: string) => {
    // Logged-in users go straight to the in-app pricing/payment flow so their
    // profile is updated correctly. Cold visitors go to signup with the plan
    // they wanted carried through.
    const target = user
      ? `/pricing-selection?plan=${planKey}`
      : `/auth?mode=signup&plan=${planKey}`;
    navigate(target);
  };

  const getCtaLabel = (planKey: string) => {
    if (planKey === "free") return user ? "Continue with Free" : "Start free";
    if (planKey === "pro") return profile?.subscription_tier === "pro" ? "Manage Pro" : "Choose Pro";
    return profile?.subscription_tier === "elite" ? "You're on Elite" : "Talk to us for Elite";
  };

  return (
    <section id="pricing" className="py-24 md:py-32 relative">
      <div className="container mx-auto px-6">
        <div className="text-center mb-14 md:mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-light mb-4">
            Simple pricing for your <span className="text-gradient">band-score plan</span>
          </h2>
          <p className="text-base md:text-lg max-w-2xl mx-auto mb-8 text-foreground/70">
            Start free to see if Eng-InAja fits your routine. Upgrade only when you're
            ready for unlimited practice or live coaching.
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
                <Button onClick={handleApplyPromo} disabled={promoApplied || !promoCode}>
                  {promoApplied ? "Applied" : "Apply"}
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-6 lg:gap-8 max-w-5xl mx-auto">
          {PLANS.map((plan, index) => {
            const isRevealed = revealedCards.has(index);
            const { displayPrice, originalDisplayPrice } = resolvePrice(plan, promoApplied);
            const isCurrent = profile?.subscription_tier === plan.tier;
            const isElite = plan.tier === "elite";

            return (
              <div
                key={plan.name}
                ref={(el) => (cardRefs.current[index] = el)}
                className={`relative transition-all duration-700 ${
                  isRevealed ? "revealed" : "scroll-reveal"
                } ${plan.badge === "Recommended" ? "lg:-mt-4 lg:mb-4" : ""}`}
                style={{ transitionDelay: `${index * 150}ms` }}
              >
                {plan.badge === "Recommended" && (
                  <div className="absolute -inset-0.5 bg-gradient-to-b from-accent/50 to-accent/20 rounded-2xl blur-sm -z-10" />
                )}
                {isElite && (
                  <div className="absolute -inset-0.5 bg-gradient-to-b from-elite-gold/50 to-elite-gold/20 rounded-2xl blur-sm -z-10" />
                )}

                <div
                  className={`glass-card p-8 h-full flex flex-col ${
                    plan.badge === "Recommended"
                      ? "border-accent/30"
                      : isElite
                      ? "border-elite-gold/30"
                      : ""
                  }`}
                >
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

                  <h3 className="text-2xl font-light mb-2 text-foreground">{plan.name}</h3>

                  {isElite ? (
                    <div className="mb-1 select-none">
                      {/* Blurred strikethrough "original" price — value from plans.ts */}
                      <p className="text-sm line-through blur-sm text-muted-foreground mb-0.5 pointer-events-none">
                        {plan.eliteDisplayTeaserPrice ?? "IDR 6M"}
                      </p>
                      {/* Actual price shown as ??? */}
                      <div className="flex items-baseline gap-2">
                        <span className="text-4xl md:text-5xl font-light text-foreground">???</span>
                        <span className="text-muted-foreground">one-time</span>
                      </div>
                    </div>
                  ) : (
                    <div>
                      {(plan.strikethroughDisplayPrice || originalDisplayPrice) && (
                        <p className="text-sm text-muted-foreground line-through mb-0.5">
                          {originalDisplayPrice ?? plan.strikethroughDisplayPrice}
                        </p>
                      )}
                      <div className="flex items-baseline gap-2 mb-1">
                        <span className="text-4xl md:text-5xl font-light text-foreground">
                          {displayPrice}
                        </span>
                        {plan.period && (
                          <span className="text-muted-foreground">{plan.period}</span>
                        )}
                      </div>
                    </div>
                  )}

                  <p className="text-foreground/60 mb-6">{plan.description}</p>

                  <ul className="space-y-3 mb-8 flex-1">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-3">
                        <div className="w-5 h-5 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <Check className="w-3 h-3 text-accent" />
                        </div>
                        <span className="text-sm text-foreground/80">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  {/* CTA */}
                  {isElite ? (
                    <div className="flex flex-col gap-2">
                      <Button
                        onClick={() => handleSelectPlan(plan.planKey)}
                        variant="outline"
                        className="w-full border-elite-gold/30 text-elite-gold hover:bg-elite-gold/10"
                        disabled={isCurrent}
                      >
                        {isCurrent ? "You're on Elite" : "Book a Meeting"}
                        {!isCurrent && <ArrowRight className="w-4 h-4 ml-2" />}
                      </Button>
                      <a
                        href={buildWhatsAppLink(CONTACT_MESSAGES.bookConsultation)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-center text-muted-foreground hover:text-elite-gold transition-colors"
                      >
                        or chat with us first on WhatsApp →
                      </a>
                    </div>
                  ) : (
                    <Button
                      onClick={() => handleSelectPlan(plan.planKey)}
                      variant={plan.badge === "Recommended" ? "neumorphicPrimary" : "outline"}
                      className="w-full"
                      disabled={isCurrent}
                    >
                      {isCurrent ? "Current plan" : getCtaLabel(plan.planKey)}
                      {!isCurrent && <ArrowRight className="w-4 h-4 ml-2" />}
                    </Button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* How signup works */}
        <div className="max-w-4xl mx-auto mt-16 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="glass-card p-5 flex items-start gap-3">
            <UserPlus className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-foreground">Sign up free</p>
              <p className="text-xs text-muted-foreground mt-1">
                Create your account in under a minute. Free tier unlocks instantly.
              </p>
            </div>
          </div>
          <div className="glass-card p-5 flex items-start gap-3">
            <MessageCircle className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-foreground">WhatsApp for Pro / Elite</p>
              <p className="text-xs text-muted-foreground mt-1">
                Pick a paid plan and we open WhatsApp with your email and package.
                Pay and send proof there — no checkout on this site.
              </p>
            </div>
          </div>
          <div className="glass-card p-5 flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-foreground">We activate you</p>
              <p className="text-xs text-muted-foreground mt-1">
                After we confirm payment on WhatsApp, your dashboard unlocks the full
                plan — usually within a few hours.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
