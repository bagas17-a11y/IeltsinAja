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
  const [proAnnual, setProAnnual] = useState(false);
  const [showPromoInput, setShowPromoInput] = useState(false);
  const [promoCode, setPromoCode] = useState("");
  const [promoApplied, setPromoApplied] = useState(false);
  const [revealedCards, setRevealedCards] = useState<Set<number>>(new Set());
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

  const freePlan   = PLANS.find((p) => p.planKey === "free")!;
  const proPlan    = PLANS.find((p) => p.planKey === "pro")!;
  const proAnnPlan = PLANS.find((p) => p.planKey === "pro_annual")!;
  const elitePlan  = PLANS.find((p) => p.planKey === "road_to_8")!;

  const activePro = proAnnual ? proAnnPlan : proPlan;
  const { displayPrice: proPrice, originalDisplayPrice: proOriginal } = resolvePrice(activePro, promoApplied);

  const cards = [
    { plan: freePlan,  index: 0 },
    { plan: activePro, index: 1 },
    { plan: elitePlan, index: 2 },
  ];

  const isCurrent = (tier: string) => profile?.subscription_tier === tier;

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

        {/* 3-column grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-5xl mx-auto items-start">

          {/* ── Free ── */}
          <div
            ref={(el) => (cardRefs.current[0] = el)}
            className={`relative transition-all duration-700 ${revealedCards.has(0) ? "revealed" : "scroll-reveal"}`}
          >
            <div className="rounded-2xl flex flex-col h-full overflow-hidden border glass-card border-border/20">
              <div className="px-6 pt-6 pb-4 border-b border-border/20">
                <h3 className="text-lg font-medium text-foreground mb-3">Free</h3>
                <div className="flex items-baseline gap-1.5 mb-3">
                  <span className="text-3xl font-light text-foreground">IDR 0</span>
                </div>
                <p className="text-xs text-foreground/50 mb-4 leading-snug">{freePlan.description}</p>
                <Button
                  onClick={() => handleSelectPlan("free")}
                  variant="outline"
                  className="w-full text-sm border-border/40"
                  disabled={isCurrent("free")}
                >
                  {isCurrent("free") ? "Current plan" : user ? "Continue with Free" : "Start free"}
                </Button>
              </div>
              <div className="px-6 py-5 flex-1">
                <ul className="space-y-2.5">
                  {freePlan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2.5">
                      <div className="w-4 h-4 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Check className="w-2.5 h-2.5 text-accent" />
                      </div>
                      <span className="text-xs text-foreground/75 leading-snug">{f}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* ── Pro (with monthly/annual toggle) ── */}
          <div
            ref={(el) => (cardRefs.current[1] = el)}
            className={`relative transition-all duration-700 ${revealedCards.has(1) ? "revealed" : "scroll-reveal"} md:-mt-3`}
            style={{ transitionDelay: "100ms" }}
          >
            <div className="absolute -inset-px bg-gradient-to-b from-accent to-accent/30 rounded-2xl blur-md -z-10 opacity-60" />
            <div className="rounded-2xl flex flex-col h-full overflow-hidden border bg-accent/10 border-accent/40">
              <div className="px-6 pt-6 pb-4 border-b border-accent/20">
                {/* Badge */}
                <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium mb-3 bg-accent/20 text-accent">
                  <Sparkles className="w-3 h-3" />
                  Recommended
                </div>

                <h3 className="text-lg font-medium text-foreground mb-3">Pro</h3>

                {/* Monthly / Annual toggle */}
                <div className="flex rounded-lg bg-background/30 p-0.5 mb-4 gap-0.5">
                  <button
                    onClick={() => setProAnnual(false)}
                    className={`flex-1 text-xs py-1.5 rounded-md transition-all ${
                      !proAnnual
                        ? "bg-background text-foreground shadow-sm font-medium"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    Monthly
                  </button>
                  <button
                    onClick={() => setProAnnual(true)}
                    className={`flex-1 text-xs py-1.5 rounded-md transition-all flex items-center justify-center gap-1.5 ${
                      proAnnual
                        ? "bg-background text-foreground shadow-sm font-medium"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    Annual
                    <span className="text-accent text-[10px] font-semibold">-55%</span>
                  </button>
                </div>

                {/* Price */}
                <div className="mb-1">
                  {(proOriginal || proPlan.strikethroughDisplayPrice) && !proAnnual && (
                    <p className="text-sm text-muted-foreground line-through mb-0.5">
                      {proOriginal ?? proPlan.strikethroughDisplayPrice}
                    </p>
                  )}
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-3xl font-light text-accent">{proPrice}</span>
                    <span className="text-sm text-muted-foreground">{activePro.period}</span>
                  </div>
                  {proAnnual && (
                    <p className="text-xs text-muted-foreground mt-1">
                      Billed IDR 1.08M upfront · save IDR 1.32M vs monthly
                    </p>
                  )}
                </div>

                <p className="text-xs text-foreground/50 mb-4 mt-3 leading-snug">{activePro.description}</p>

                <Button
                  onClick={() => handleSelectPlan(proAnnual ? "pro_annual" : "pro")}
                  className="w-full text-sm bg-accent hover:bg-accent/90 text-background font-medium"
                  disabled={isCurrent("pro")}
                >
                  {isCurrent("pro") ? "Current plan" : "Choose this"}
                  {!isCurrent("pro") && <ArrowRight className="w-3.5 h-3.5 ml-1.5" />}
                </Button>
              </div>
              <div className="px-6 py-5 flex-1">
                <ul className="space-y-2.5">
                  {activePro.features.map((f) => (
                    <li key={f} className="flex items-start gap-2.5">
                      <div className="w-4 h-4 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Check className="w-2.5 h-2.5 text-accent" />
                      </div>
                      <span className="text-xs text-foreground/75 leading-snug">{f}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* ── Elite ── */}
          <div
            ref={(el) => (cardRefs.current[2] = el)}
            className={`relative transition-all duration-700 ${revealedCards.has(2) ? "revealed" : "scroll-reveal"}`}
            style={{ transitionDelay: "200ms" }}
          >
            <div className="absolute -inset-px bg-gradient-to-b from-elite-gold/60 to-elite-gold/20 rounded-2xl blur-md -z-10" />
            <div className="rounded-2xl flex flex-col h-full overflow-hidden border bg-elite-gold/5 border-elite-gold/30 glass-card">
              <div className="px-6 pt-6 pb-4 border-b border-elite-gold/20">
                <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium mb-3 bg-elite-gold/20 text-elite-gold">
                  <Crown className="w-3 h-3" />
                  Limited Spots
                </div>

                <h3 className="text-lg font-medium text-foreground mb-3">Elite</h3>

                <div className="flex items-baseline gap-1.5 mb-3">
                  <span className="text-3xl font-light text-elite-gold">From IDR 2.5M</span>
                  <span className="text-sm text-muted-foreground">one-time</span>
                </div>

                <p className="text-xs text-foreground/50 mb-4 leading-snug">{elitePlan.description}</p>

                <div className="space-y-2">
                  <Button
                    onClick={() => handleSelectPlan(elitePlan.planKey)}
                    variant="outline"
                    className="w-full border-elite-gold/40 text-elite-gold hover:bg-elite-gold/10 text-sm"
                    disabled={isCurrent("elite")}
                  >
                    {isCurrent("elite") ? "You're on Elite" : "Talk to us"}
                    {!isCurrent("elite") && <ArrowRight className="w-3.5 h-3.5 ml-1.5" />}
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
              </div>
              <div className="px-6 py-5 flex-1">
                <ul className="space-y-2.5">
                  {elitePlan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2.5">
                      <div className="w-4 h-4 rounded-full bg-elite-gold/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Check className="w-2.5 h-2.5 text-elite-gold" />
                      </div>
                      <span className="text-xs text-foreground/75 leading-snug">{f}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

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
