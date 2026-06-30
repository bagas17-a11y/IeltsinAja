import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Check,
  Sparkles,
  Crown,
  Loader2,
  Tag,
  MessageCircle,
  ArrowRight,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { PLANS, PROMO_CODE, resolvePrice, type PlanDefinition } from "@/lib/plans";
import { buildWhatsAppLink, planSignupWhatsAppMessage } from "@/lib/contact";
import { selfServiceActivateFree } from "@/lib/subscription";

interface DisplayPlan extends PlanDefinition {
  computedDisplayPrice: string;
  computedAmount: number;
  computedOriginalPrice: string | null;
}

const toDisplay = (plan: PlanDefinition, promoApplied: boolean): DisplayPlan => {
  const { displayPrice, amount, originalDisplayPrice } = resolvePrice(plan, promoApplied);
  return { ...plan, computedDisplayPrice: displayPrice, computedAmount: amount, computedOriginalPrice: originalDisplayPrice };
};

const WHATSAPP_RECEIPT_PLACEHOLDER = "whatsapp";

export default function PricingSelection() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user, profile, refreshProfile } = useAuth();
  const [processingPlanKey, setProcessingPlanKey] = useState<string | null>(null);
  const [proAnnual, setProAnnual] = useState(false);
  const [showPromoInput, setShowPromoInput] = useState(false);
  const [promoCode, setPromoCode] = useState("");
  const [promoApplied, setPromoApplied] = useState(false);

  const freePlan   = toDisplay(PLANS.find((p) => p.planKey === "free")!,       promoApplied);
  const proPlan    = toDisplay(PLANS.find((p) => p.planKey === "pro")!,        promoApplied);
  const proAnnPlan = toDisplay(PLANS.find((p) => p.planKey === "pro_annual")!, promoApplied);
  const elitePlan  = toDisplay(PLANS.find((p) => p.planKey === "road_to_8")!,  promoApplied);

  const activePro = proAnnual ? proAnnPlan : proPlan;

  // Auto-trigger if ?plan= param is present
  useEffect(() => {
    const planKeyParam = searchParams.get("plan");
    if (!planKeyParam || !user) return;
    const allPlans = [freePlan, proPlan, proAnnPlan, elitePlan];
    const target = allPlans.find((p) => p.planKey === planKeyParam);
    if (!target) return;
    if (planKeyParam === "pro_annual") setProAnnual(true);
    void handleSelectPlan(target);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams, user]);

  const handleApplyPromo = () => {
    if (promoCode.trim().toUpperCase() === PROMO_CODE) {
      setPromoApplied(true);
      toast.success("Promo applied — mention BAGASCUTS on WhatsApp for 50% off Pro.");
    } else {
      toast.error("Invalid promo code");
    }
  };

  const registerPaidPlanRequest = async (plan: DisplayPlan) => {
    if (!user) return;
    const { data: existing } = await supabase
      .from("payment_verifications")
      .select("id")
      .eq("user_id", user.id)
      .eq("status", "pending")
      .maybeSingle();
    if (!existing) {
      const { error } = await supabase.from("payment_verifications").insert({
        user_id: user.id,
        plan_type: plan.planKey,
        amount: plan.computedAmount,
        receipt_url: WHATSAPP_RECEIPT_PLACEHOLDER,
        status: "pending",
      });
      if (error) throw error;
    }
  };

  const handleSelectPlan = async (plan: DisplayPlan) => {
    if (!user) {
      navigate(`/auth?mode=signup&plan=${plan.planKey}`);
      return;
    }
    setProcessingPlanKey(plan.planKey);
    try {
      if (plan.tier === "free") {
        const result = await selfServiceActivateFree(user.id);
        if (!result.success) { toast.error(result.errorMessage ?? "Could not activate Free plan."); return; }
        await refreshProfile();
        navigate("/dashboard");
        toast.success("Welcome! You can start practising now.");
        return;
      }

      await registerPaidPlanRequest(plan);

      for (let i = 0; i < 5; i++) {
        const { data } = await supabase.from("profiles").select("id").eq("user_id", user.id).maybeSingle();
        if (data) break;
        await new Promise((r) => setTimeout(r, 1000));
      }

      const waMessage = planSignupWhatsAppMessage({
        email: user.email ?? profile?.email ?? "—",
        planName: plan.name,
        displayPrice: plan.computedDisplayPrice,
        fullName: profile?.full_name,
        phoneNumber: profile?.phone_number,
      });
      window.open(buildWhatsAppLink(waMessage), "_blank", "noopener,noreferrer");
      navigate("/waiting-room");
    } catch (error: unknown) {
      toast.error(error instanceof Error ? error.message : "Something went wrong");
    } finally {
      setProcessingPlanKey(null);
    }
  };

  const isProcessing = (key: string) => processingPlanKey === key;

  return (
    <div className="min-h-screen bg-atmospheric p-6">
      <div className="max-w-5xl mx-auto pt-12">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-light mb-4 text-foreground">
            Choose Your <span className="text-gradient">Learning Path</span>
          </h1>
          <p className="text-muted-foreground max-w-xl mx-auto mb-4">
            Free starts instantly. For Pro or Elite, we'll open WhatsApp so you can
            tell us your email and package — payment and activation happen there.
          </p>
          <p className="text-xs text-muted-foreground max-w-md mx-auto flex items-center justify-center gap-1">
            <MessageCircle className="w-3.5 h-3.5 text-accent" />
            No bank transfer or receipt upload on this website.
          </p>

          <div className="max-w-sm mx-auto mt-8">
            {!showPromoInput ? (
              <Button variant="ghost" onClick={() => setShowPromoInput(true)} className="text-accent hover:text-accent/80">
                <Tag className="w-4 h-4 mr-2" />
                Have a promo code?
              </Button>
            ) : (
              <div className="flex gap-2">
                <Input placeholder="Enter promo code" value={promoCode} onChange={(e) => setPromoCode(e.target.value)} className="flex-1" disabled={promoApplied} />
                <Button onClick={handleApplyPromo} disabled={promoApplied || !promoCode}>
                  {promoApplied ? "Applied!" : "Apply"}
                </Button>
              </div>
            )}
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-5 items-start">

          {/* ── Free ── */}
          <div className="glass-card border border-border/20 rounded-2xl flex flex-col overflow-hidden">
            <div className="px-6 pt-6 pb-4 border-b border-border/20">
              <h2 className="text-xl font-light mb-3">Free</h2>
              <div className="flex items-baseline gap-1 mb-3">
                <span className="text-3xl font-light">IDR 0</span>
              </div>
              <p className="text-sm text-muted-foreground mb-5">{freePlan.description}</p>
              <Button
                onClick={() => handleSelectPlan(freePlan)}
                disabled={!!processingPlanKey}
                variant="outline"
                className="w-full border-muted-foreground/30"
              >
                {isProcessing("free") ? <Loader2 className="w-4 h-4 animate-spin" /> : "Start free"}
              </Button>
            </div>
            <div className="px-6 py-5 flex-1">
              <ul className="space-y-3">
                {freePlan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2">
                    <div className="w-5 h-5 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Check className="w-3 h-3 text-accent" />
                    </div>
                    <span className="text-sm text-foreground/80">{f}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* ── Pro (with toggle) ── */}
          <div className="relative md:-mt-4 md:mb-4">
            <div className="absolute -inset-0.5 bg-gradient-to-b from-accent/50 to-accent/20 rounded-2xl blur-sm -z-10" />
            <div className="glass-card border border-accent/30 rounded-2xl flex flex-col overflow-hidden">
              <div className="px-6 pt-6 pb-4 border-b border-accent/20">
                <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium mb-3 bg-accent/20 text-accent">
                  <Sparkles className="w-3 h-3" />
                  Recommended
                </div>

                <h2 className="text-xl font-light mb-3">Pro</h2>

                {/* Toggle */}
                <div className="flex rounded-lg bg-secondary/40 p-0.5 mb-4 gap-0.5">
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
                <div className="mb-3">
                  {!proAnnual && proPlan.strikethroughDisplayPrice && (
                    <p className="text-sm text-muted-foreground line-through mb-0.5">{proPlan.strikethroughDisplayPrice}</p>
                  )}
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-light text-foreground">{activePro.computedDisplayPrice}</span>
                    <span className="text-muted-foreground text-sm">{activePro.period}</span>
                  </div>
                  {proAnnual && (
                    <p className="text-xs text-muted-foreground mt-1">
                      Billed IDR 1.08M upfront · save IDR 1.32M vs monthly
                    </p>
                  )}
                </div>

                <p className="text-sm text-muted-foreground mb-5">{activePro.description}</p>

                <Button
                  onClick={() => handleSelectPlan(activePro)}
                  disabled={!!processingPlanKey}
                  className="w-full"
                >
                  {isProcessing(activePro.planKey) ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <>Choose this <ArrowRight className="w-4 h-4 ml-2" /></>
                  )}
                </Button>
              </div>
              <div className="px-6 py-5 flex-1">
                <ul className="space-y-3">
                  {activePro.features.map((f) => (
                    <li key={f} className="flex items-start gap-2">
                      <div className="w-5 h-5 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Check className="w-3 h-3 text-accent" />
                      </div>
                      <span className="text-sm text-foreground/80">{f}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* ── Elite ── */}
          <div className="relative">
            <div className="absolute -inset-0.5 bg-gradient-to-b from-elite-gold/50 to-elite-gold/20 rounded-2xl blur-sm -z-10" />
            <div className="glass-card border border-elite-gold/30 rounded-2xl flex flex-col overflow-hidden">
              <div className="px-6 pt-6 pb-4 border-b border-elite-gold/20">
                <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium mb-3 bg-elite-gold/20 text-elite-gold">
                  <Crown className="w-3 h-3" />
                  Limited Spots
                </div>

                <h2 className="text-xl font-light mb-3">Elite</h2>

                <div className="flex items-baseline gap-1 mb-3">
                  <span className="text-3xl font-light text-elite-gold">From IDR 2.5M</span>
                  <span className="text-muted-foreground text-sm">one-time</span>
                </div>

                <p className="text-sm text-muted-foreground mb-5">{elitePlan.description}</p>

                <Button
                  onClick={() => handleSelectPlan(elitePlan)}
                  disabled={!!processingPlanKey}
                  variant="outline"
                  className="w-full border-elite-gold/30 text-elite-gold hover:bg-elite-gold/10"
                >
                  {isProcessing("road_to_8") ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <>Choose this <ArrowRight className="w-4 h-4 ml-2" /></>
                  )}
                </Button>
              </div>
              <div className="px-6 py-5 flex-1">
                <ul className="space-y-3">
                  {elitePlan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2">
                      <div className="w-5 h-5 rounded-full bg-elite-gold/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Check className="w-3 h-3 text-elite-gold" />
                      </div>
                      <span className="text-sm text-foreground/80">{f}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
