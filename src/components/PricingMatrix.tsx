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
  Zap,
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
            if (index !== -1) setRevealedCards((prev) => new Set([...prev, index]));
          }
        });
      },
      { threshold: 0.15 }
    );
    cardRefs.current.forEach((ref) => { if (ref) observer.observe(ref); });
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
    const target = user
      ? `/pricing-selection?plan=${planKey}`
      : `/auth?mode=signup&plan=${planKey}`;
    navigate(target);
  };

  const getCtaLabel = (planKey: string) => {
    if (planKey === "free") return user ? "Continue with Free" : "Start free";
    if (planKey === "road_to_8") return profile?.subscription_tier === "elite" ? "You're on Elite" : "Talk to us";
    return "Choose this";
  };

  return (
    <section id="pricing" className="py-24 md:py-32 relative">
      <div className="container mx-auto px-6">
        <div className="text-center mb-14 md:mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-light mb-4">
            Simple pricing for your <span className="text-gradient">band-score plan</span>
          </h2>
          <p className="text-base md:text-lg max-w-2xl mx-auto mb-8 text-foreground/70">
            Start free to see if IELTSInAja fits your routine. Upgrade only when you're
            ready for unlimited practice or live coaching.
          </p>

          <div className="max-w-sm mx-auto">
            {!showPromoInput ? (
              <Button variant="ghost" onClick={() => setShowPromoInput(true)} className="text-accent hover:text-accent/80">
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

        {/* 4-column pricing grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-6xl mx-auto items-start">
          {PLANS.map((plan, index) => {
            const isRevealed = revealedCards.has(index);
            const { displayPrice, originalDisplayPrice } = resolvePrice(plan, promoApplied);
            const isCurrent = profile?.subscription_tier === plan.tier;
            const isElite = plan.tier === "elite";
            const isBestValue = plan.badge === "Best Value";
            const isRecommended = plan.badge === "Recommended";
            const ctaLabel = getCtaLabel(plan.planKey);

            return (
              <div
                key={plan.name}
                ref={(el) => (cardRefs.current[index] = el)}
                className={`relative transition-all duration-700 ${isRevealed ? "revealed" : "scroll-reveal"} ${isBestValue ? "lg:-mt-3" : ""}`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                {/* Glow behind featured card */}
                {isBestValue && (
                  <div className="absolute -inset-px bg-gradient-to-b from-accent to-accent/30 rounded-2xl blur-md -z-10 opacity-60" />
                )}
                {isElite && (
                  <div className="absolute -inset-px bg-gradient-to-b from-elite-gold/60 to-elite-gold/20 rounded-2xl blur-md -z-10" />
                )}

                <div
                  className={`rounded-2xl flex flex-col h-full overflow-hidden border ${
                    isBestValue
                      ? "bg-accent/10 border-accent/40"
                      : isElite
                      ? "bg-elite-gold/5 border-elite-gold/30 glass-card"
                      : "glass-card border-border/20"
                  }`}
                >
                  {/* Card header */}
                  <div className={`px-6 pt-6 pb-4 ${isBestValue ? "border-b border-accent/20" : isElite ? "border-b border-elite-gold/20" : "border-b border-border/20"}`}>
                    {/* Badge */}
                    {plan.badge && (
                      <div className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium mb-3 ${
                        isBestValue ? "bg-accent text-background" : isRecommended ? "bg-accent/20 text-accent" : "bg-elite-gold/20 text-elite-gold"
                      }`}>
                        {isBestValue ? <Zap className="w-3 h-3" /> : isRecommended ? <Sparkles className="w-3 h-3" /> : <Crown className="w-3 h-3" />}
                        {plan.badge}
                      </div>
                    )}

                    <h3 className="text-lg font-medium text-foreground mb-3">{plan.name}</h3>

                    {/* Price */}
                    {isElite ? (
                      <div className="mb-3">
                        <p className="text-sm line-through blur-sm text-muted-foreground mb-0.5 pointer-events-none select-none">
                          {plan.eliteDisplayTeaserPrice ?? "IDR 6M"}
                        </p>
                        <div className="flex items-baseline gap-1.5">
                          <span className={`text-3xl font-light ${isElite ? "text-elite-gold" : "text-foreground"}`}>???</span>
                          <span className="text-sm text-muted-foreground">one-time</span>
                        </div>
                      </div>
                    ) : (
                      <div className="mb-3">
                        {(plan.strikethroughDisplayPrice || originalDisplayPrice) && (
                          <p className="text-sm text-muted-foreground line-through mb-0.5">
                            {originalDisplayPrice ?? plan.strikethroughDisplayPrice}
                          </p>
                        )}
                        <div className="flex items-baseline gap-1.5">
                          <span className={`text-3xl font-light ${isBestValue ? "text-accent" : "text-foreground"}`}>
                            {displayPrice}
                          </span>
                          {plan.period && (
                            <span className="text-sm text-muted-foreground">{plan.period}</span>
                          )}
                        </div>
                      </div>
                    )}

                    <p className="text-xs text-foreground/50 mb-4 leading-snug">{plan.description}</p>

                    {/* CTA button — top of card for quick scanning */}
                    {isElite ? (
                      <div className="space-y-2">
                        <Button
                          onClick={() => handleSelectPlan(plan.planKey)}
                          variant="outline"
                          className="w-full border-elite-gold/40 text-elite-gold hover:bg-elite-gold/10 text-sm"
                          disabled={isCurrent}
                        >
                          {isCurrent ? "You're on Elite" : "Talk to us"}
                          {!isCurrent && <ArrowRight className="w-3.5 h-3.5 ml-1.5" />}
                        </Button>
                        <a
                          href={buildWhatsAppLink(CONTACT_MESSAGES.bookConsultation)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block text-xs text-center text-muted-foreground hover:text-elite-gold transition-colors"
                        >
                          or chat on WhatsApp →
                        </a>
                      </div>
                    ) : (
                      <Button
                        onClick={() => handleSelectPlan(plan.planKey)}
                        className={`w-full text-sm ${
                          isBestValue
                            ? "bg-accent hover:bg-accent/90 text-background font-medium"
                            : ""
                        }`}
                        variant={isBestValue ? "default" : isRecommended ? "neumorphicPrimary" : "outline"}
                        disabled={isCurrent}
                      >
                        {isCurrent ? "Current plan" : ctaLabel}
                        {!isCurrent && plan.tier !== "free" && <ArrowRight className="w-3.5 h-3.5 ml-1.5" />}
                      </Button>
                    )}
                  </div>

                  {/* Features list */}
                  <div className="px-6 py-5 flex-1">
                    <ul className="space-y-2.5">
                      {plan.features.map((feature) => (
                        <li key={feature} className="flex items-start gap-2.5">
                          <div className={`w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${
                            isBestValue ? "bg-accent/20" : "bg-accent/10"
                          }`}>
                            <Check className={`w-2.5 h-2.5 ${isBestValue ? "text-accent" : "text-accent"}`} />
                          </div>
                          <span className="text-xs text-foreground/75 leading-snug">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
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
