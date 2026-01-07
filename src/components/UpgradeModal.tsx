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

interface UpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  featureName: string;
}

const plans = [
  {
    name: "Pro",
    price: "IDR 500K",
    period: "for 2 months",
    features: [
      "Unlimited practice for all modules",
      "AI-powered feedback",
      "Progress analytics",
    ],
    highlighted: true,
  },
  {
    name: "Road to 8.0+",
    price: "IDR 2.5M",
    period: "one-time",
    features: [
      "Everything in Pro",
      "1-on-1 consultation",
      "VIP support",
    ],
    highlighted: false,
  },
];

export function UpgradeModal({ isOpen, onClose, featureName }: UpgradeModalProps) {
  const navigate = useNavigate();

  const handleUpgrade = () => {
    onClose();
    navigate("/pricing-selection");
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mb-4">
            <Lock className="w-8 h-8 text-accent" />
          </div>
          <DialogTitle className="text-2xl font-light">
            Upgrade to Continue
          </DialogTitle>
          <DialogDescription className="text-base">
            You've used your free {featureName} practice. Upgrade to unlock unlimited access.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 mt-6">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`p-4 rounded-xl border ${
                plan.highlighted
                  ? "border-accent/30 bg-accent/5"
                  : "border-elite-gold/30 bg-elite-gold/5"
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  {plan.highlighted ? (
                    <Sparkles className="w-4 h-4 text-accent" />
                  ) : (
                    <Crown className="w-4 h-4 text-elite-gold" />
                  )}
                  <span className="font-medium text-foreground">{plan.name}</span>
                </div>
                <div className="text-right">
                  <span className="text-lg font-light text-foreground">{plan.price}</span>
                  <span className="text-xs text-muted-foreground ml-1">{plan.period}</span>
                </div>
              </div>
              <ul className="space-y-1">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Check className="w-3 h-3 text-accent" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="flex gap-3 mt-6">
          <Button variant="outline" onClick={onClose} className="flex-1">
            Maybe Later
          </Button>
          <Button onClick={handleUpgrade} className="flex-1">
            View Plans
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
