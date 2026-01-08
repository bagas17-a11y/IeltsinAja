import { useMemo } from "react";
import { useAuth } from "./useAuth";

interface SubscriptionStatus {
  isExpired: boolean;
  daysRemaining: number | null;
  expiresAt: Date | null;
  tier: "free" | "pro" | "elite" | null;
  needsRenewal: boolean;
}

export function useSubscriptionStatus(): SubscriptionStatus {
  const { profile } = useAuth();

  return useMemo(() => {
    if (!profile) {
      return {
        isExpired: false,
        daysRemaining: null,
        expiresAt: null,
        tier: null,
        needsRenewal: false,
      };
    }

    const tier = profile.subscription_tier;
    
    // Free and Elite users don't expire
    if (tier === "free" || tier === "elite") {
      return {
        isExpired: false,
        daysRemaining: null,
        expiresAt: null,
        tier,
        needsRenewal: false,
      };
    }

    // Pro users have expiration
    if (tier === "pro" && profile.subscription_expires_at) {
      const expiresAt = new Date(profile.subscription_expires_at);
      const now = new Date();
      const diffTime = expiresAt.getTime() - now.getTime();
      const daysRemaining = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      const isExpired = daysRemaining <= 0;

      return {
        isExpired,
        daysRemaining: isExpired ? 0 : daysRemaining,
        expiresAt,
        tier,
        needsRenewal: isExpired,
      };
    }

    return {
      isExpired: false,
      daysRemaining: null,
      expiresAt: null,
      tier,
      needsRenewal: false,
    };
  }, [profile]);
}
