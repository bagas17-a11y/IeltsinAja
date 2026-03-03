import { ReactNode } from "react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Lock, Crown } from "lucide-react";

interface HumanPlusAILockScreenProps {
  title: string;
  description?: string;
  features: string[];
  icon?: ReactNode;
}

export function HumanPlusAILockScreen({
  title,
  description = "Upgrade to the Elite package to use this feature.",
  features,
}: HumanPlusAILockScreenProps) {
  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto text-center py-16">
        <div className="w-20 h-20 rounded-full bg-elite-gold/10 flex items-center justify-center mx-auto mb-6">
          <Lock className="w-10 h-10 text-elite-gold" />
        </div>
        <h1 className="text-3xl font-light mb-4">
          Unlock <span className="text-elite-gold">Elite {title}</span>
        </h1>
        <p className="text-muted-foreground mb-8 max-w-lg mx-auto">
          {description}
        </p>
        <div className="glass-card p-6 mb-8">
          <h3 className="text-lg font-light mb-4">What you get:</h3>
          <ul className="space-y-3 text-left max-w-md mx-auto">
            {features.map((feature) => (
              <li key={feature} className="flex items-center gap-3 text-foreground/80">
                <Crown className="w-4 h-4 text-elite-gold flex-shrink-0" />
                {feature}
              </li>
            ))}
          </ul>
        </div>
        <Button
          onClick={() => window.location.assign("/pricing-selection")}
          className="bg-elite-gold/20 text-elite-gold border border-elite-gold/30 hover:bg-elite-gold/30"
        >
          View plans
        </Button>
      </div>
    </DashboardLayout>
  );
}
