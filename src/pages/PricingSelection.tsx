import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Check,
  Sparkles,
  Crown,
  Loader2,
  Tag,
  MessageCircle,
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

const buildDisplayPlans = (promoApplied: boolean): DisplayPlan[] =>
  PLANS.map((plan) => {
    const { displayPrice, amount, originalDisplayPrice } = resolvePrice(plan, promoApplied);
    return {
      ...plan,
      computedDisplayPrice: displayPrice,
      computedAmount: amount,
      computedOriginalPrice: originalDisplayPrice,
    };
  });

const WHATSAPP_RECEIPT_PLACEHOLDER = "whatsapp";

export default function PricingSelection() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user, profile, refreshProfile } = useAuth();
  const [processingPlanKey, setProcessingPlanKey] = useState<string | null>(null);
  const [showPromoInput, setShowPromoInput] = useState(false);
  const [promoCode, setPromoCode] = useState("");
  const [promoApplied, setPromoApplied] = useState(false);

  const plans = buildDisplayPlans(promoApplied);

  useEffect(() => {
    const planKeyParam = searchParams.get("plan");
    if (!planKeyParam || !user) return;
    const target = plans.find((p) => p.planKey === planKeyParam);
    if (!target) return;
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
        if (!result.success) {
          toast.error(result.errorMessage ?? "Could not activate your Free plan.");
          return;
        }
        await refreshProfile();
        navigate("/dashboard");
        toast.success("Welcome! You can start practising now.");
        return;
      }

      await registerPaidPlanRequest(plan);

      const waMessage = planSignupWhatsAppMessage({
        email: user.email ?? profile?.email ?? "—",
        planName: plan.name,
        displayPrice: plan.computedDisplayPrice,
        fullName: profile?.full_name,
      });

      window.open(buildWhatsAppLink(waMessage), "_blank", "noopener,noreferrer");

      toast.success(
        "Opening WhatsApp — send us your email and plan. You can use Free features on the dashboard while we confirm payment.",
        { duration: 8000 }
      );

      navigate("/dashboard");
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Something went wrong";
      console.error("Plan selection error:", error);
      toast.error(message);
    } finally {
      setProcessingPlanKey(null);
    }
  };

  return (
    <div className="min-h-screen bg-atmospheric p-6">
      <div className="max-w-5xl mx-auto pt-12">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-light mb-4 text-foreground">
            Choose Your <span className="text-gradient">Learning Path</span>
          </h1>
          <p className="text-muted-foreground max-w-xl mx-auto mb-4">
            Free starts instantly. For Pro or Elite, we&apos;ll open WhatsApp so you can
            tell us your email and package — payment and activation happen there.
          </p>
          <p className="text-xs text-muted-foreground max-w-md mx-auto flex items-center justify-center gap-1">
            <MessageCircle className="w-3.5 h-3.5 text-accent" />
            No bank transfer or receipt upload on this website.
          </p>

          <div className="max-w-sm mx-auto mt-8">
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
                  {promoApplied ? "Applied!" : "Apply"}
                </Button>
              </div>
            )}
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {plans.map((plan) => {
            const highlighted = plan.badge === "Recommended";
            const isElite = plan.tier === "elite";
            const isProcessing = processingPlanKey === plan.planKey;

            return (
              <div
                key={plan.name}
                className={`relative ${highlighted ? "md:-mt-4 md:mb-4" : ""}`}
              >
                {highlighted && (
                  <div className="absolute -inset-0.5 bg-gradient-to-b from-accent/50 to-accent/20 rounded-2xl blur-sm -z-10" />
                )}
                {isElite && (
                  <div className="absolute -inset-0.5 bg-gradient-to-b from-elite-gold/50 to-elite-gold/20 rounded-2xl blur-sm -z-10" />
                )}

                <Card
                  className={`glass-card h-full flex flex-col ${
                    highlighted
                      ? "border-accent/30"
                      : isElite
                      ? "border-elite-gold/30"
                      : ""
                  }`}
                >
                  <CardHeader className="pb-4">
                    {plan.badge && (
                      <Badge
                        className={`w-fit mb-4 ${
                          plan.badge === "Recommended"
                            ? "bg-accent/20 text-accent border-accent/30"
                            : "bg-elite-gold/20 text-elite-gold border-elite-gold/30"
                        }`}
                      >
                        {plan.badge === "Recommended" ? (
                          <Sparkles className="w-3 h-3 mr-1" />
                        ) : (
                          <Crown className="w-3 h-3 mr-1" />
                        )}
                        {plan.badge}
                      </Badge>
                    )}

                    <CardTitle className="text-xl font-light">{plan.name}</CardTitle>

                    <div className="flex items-baseline gap-1 mt-2">
                      <span className="text-3xl font-light text-foreground">
                        {plan.computedDisplayPrice}
                      </span>
                      {plan.period && (
                        <span className="text-muted-foreground text-sm">{plan.period}</span>
                      )}
                    </div>
                    {plan.computedOriginalPrice && (
                      <p className="text-sm text-muted-foreground line-through mt-1">
                        {plan.computedOriginalPrice}
                      </p>
                    )}

                    <p className="text-sm text-muted-foreground mt-2">{plan.description}</p>
                  </CardHeader>

                  <CardContent className="flex-1 flex flex-col">
                    <ul className="space-y-3 mb-6 flex-1">
                      {plan.features.map((feature) => (
                        <li key={feature} className="flex items-start gap-2">
                          <div className="w-5 h-5 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                            <Check className="w-3 h-3 text-accent" />
                          </div>
                          <span className="text-sm text-foreground/80">{feature}</span>
                        </li>
                      ))}
                    </ul>

                    <Button
                      onClick={() => handleSelectPlan(plan)}
                      disabled={!!processingPlanKey}
                      variant={highlighted ? "default" : "outline"}
                      className={`w-full ${
                        isElite
                          ? "border-elite-gold/30 text-elite-gold hover:bg-elite-gold/10"
                          : plan.tier === "free"
                          ? "border-muted-foreground/30"
                          : ""
                      }`}
                    >
                      {isProcessing ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : plan.tier === "free" ? (
                        "Start free"
                      ) : (
                        <>
                          <MessageCircle className="w-4 h-4 mr-2" />
                          Continue on WhatsApp
                        </>
                      )}
                    </Button>
                  </CardContent>
                </Card>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
