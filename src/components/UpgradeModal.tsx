import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Lock, Sparkles, Crown, Check } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { PLANS } from "@/lib/plans";

interface UpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  featureName: string;
}

const upgradePlans = PLANS.filter((p) => p.tier !== "free");

export function UpgradeModal({ isOpen, onClose, featureName }: UpgradeModalProps) {
  const navigate = useNavigate();

  const handleUpgrade = (planKey?: string) => {
    onClose();
    navigate(planKey ? `/pricing-selection?plan=${planKey}` : "/pricing-selection");
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mb-4">
            <Lock className="w-8 h-8 text-accent" />
          </div>
          <DialogTitle className="text-2xl font-light">
            Upgrade to keep practising
          </DialogTitle>
          <DialogDescription className="text-base">
            You've used your free {featureName} practice. Upgrade for unlimited AI-graded
            practice across every module.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 mt-6">
          {upgradePlans.map((plan) => {
            const highlighted = plan.tier === "pro";
            return (
              <button
                key={plan.name}
                onClick={() => handleUpgrade(plan.planKey)}
                className={`w-full p-4 rounded-xl border text-left transition-all hover:shadow-md ${
                  highlighted
                    ? "border-accent/40 bg-accent/5 hover:border-accent/60"
                    : "border-elite-gold/40 bg-elite-gold/5 hover:border-elite-gold/60"
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    {highlighted ? (
                      <Sparkles className="w-4 h-4 text-accent" />
                    ) : (
                      <Crown className="w-4 h-4 text-elite-gold" />
                    )}
                    <span className="font-medium text-foreground">{plan.name}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-lg font-light text-foreground">{plan.displayPrice}</span>
                    {plan.period && (
                      <span className="text-xs text-muted-foreground ml-1">{plan.period}</span>
                    )}
                  </div>
                </div>
                <ul className="space-y-1">
                  {plan.features.slice(0, 3).map((feature) => (
                    <li key={feature} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Check className="w-3 h-3 text-accent" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </button>
            );
          })}
        </div>

        <div className="flex gap-3 mt-6">
          <Button variant="outline" onClick={onClose} className="flex-1">
            Maybe later
          </Button>
          <Button onClick={() => handleUpgrade()} className="flex-1">
            See full plans
          </Button>
        </div>
        <p className="text-[11px] text-muted-foreground text-center mt-2">
          Pro &amp; Elite: continue on WhatsApp after you pick a plan.
        </p>
      </DialogContent>
    </Dialog>
  );
}
