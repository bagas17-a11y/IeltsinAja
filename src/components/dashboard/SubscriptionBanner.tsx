import { useNavigate } from "react-router-dom";
import { useSubscriptionStatus } from "@/hooks/useSubscriptionStatus";
import { Button } from "@/components/ui/button";
import { Clock, AlertTriangle } from "lucide-react";

export function SubscriptionBanner() {
  const navigate = useNavigate();
  const { tier, daysRemaining, isExpired, needsRenewal } = useSubscriptionStatus();

  // Only show for Pro users
  if (tier !== "pro") {
    return null;
  }

  if (isExpired || needsRenewal) {
    return (
      <div className="bg-destructive/10 border border-destructive/30 rounded-xl p-4 mb-6">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-destructive" />
            <div>
              <p className="font-medium text-destructive">Subscription Expired</p>
              <p className="text-sm text-muted-foreground">
                Your Pro subscription has expired. Renew to continue practicing.
              </p>
            </div>
          </div>
          <Button 
            onClick={() => navigate("/pricing-selection")}
            variant="default"
            size="sm"
          >
            Renew Subscription
          </Button>
        </div>
      </div>
    );
  }

  if (daysRemaining !== null && daysRemaining <= 7) {
    return (
      <div className="bg-warning/10 border border-warning/30 rounded-xl p-4 mb-6">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3">
            <Clock className="w-5 h-5 text-warning" />
            <div>
              <p className="font-medium text-foreground">
                {daysRemaining} day{daysRemaining !== 1 ? "s" : ""} remaining
              </p>
              <p className="text-sm text-muted-foreground">
                Your Pro subscription expires soon. Renew to keep practicing.
              </p>
            </div>
          </div>
          <Button 
            onClick={() => navigate("/pricing-selection")}
            variant="outline"
            size="sm"
          >
            Renew Now
          </Button>
        </div>
      </div>
    );
  }

  // Show countdown for all Pro users
  if (daysRemaining !== null) {
    return (
      <div className="bg-accent/5 border border-accent/20 rounded-xl p-3 mb-6">
        <div className="flex items-center gap-3">
          <Clock className="w-4 h-4 text-accent" />
          <p className="text-sm text-muted-foreground">
            <span className="text-foreground font-medium">{daysRemaining} day{daysRemaining !== 1 ? "s" : ""}</span> remaining in your Pro subscription
          </p>
        </div>
      </div>
    );
  }

  return null;
}
