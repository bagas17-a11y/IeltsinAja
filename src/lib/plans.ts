/**
 * Single source of truth for Engvolve pricing plans.
 *
 * Use this everywhere a price, period, or feature list is displayed:
 * - Landing-page pricing matrix
 * - Pricing selection page (post-signup)
 * - Upgrade modal
 *
 * Update prices here only.
 */

export type PlanTier = "free" | "pro" | "elite";

export interface PlanDefinition {
  /** Stable key used by the admin/payment_verifications.plan_type column. */
  planKey: "free" | "pro" | "pro_annual" | "road_to_8";
  tier: PlanTier;
  name: string;
  /** Display price, e.g. "IDR 200K". */
  displayPrice: string;
  /** If set, always shows as crossed-out above displayPrice (permanent sale). */
  strikethroughDisplayPrice?: string;
  /** Discounted display price when the BAGASCUTS promo applies. */
  discountedDisplayPrice?: string;
  /** Optional period label, e.g. "per month", "one-time". */
  period: string;
  /** Numeric IDR amount used by Supabase (always full price; promo applied separately). */
  amount: number;
  /**
   * Blurred "teaser" price shown on the Elite card on the landing page.
   * Intentionally obscured so the price isn't the first thing visitors see.
   */
  eliteDisplayTeaserPrice?: string;
  /** Amount when promo BAGASCUTS is applied. */
  discountedAmount?: number;
  description: string;
  features: string[];
  badge?: "Recommended" | "Limited Spots" | null;
}

export const PROMO_CODE = "BAGASCUTS";

export const PLANS: PlanDefinition[] = [
  {
    planKey: "free",
    tier: "free",
    name: "Free",
    displayPrice: "IDR 0",
    period: "",
    amount: 0,
    description: "5 full AI-graded practices per module, no credit card required.",
    features: [
      "5 Reading practices",
      "5 Listening practices",
      "5 Writing practices",
      "5 Speaking practices",
      "Instant AI feedback on every practice",
    ],
    badge: null,
  },
  {
    planKey: "pro",
    tier: "pro",
    name: "Pro",
    displayPrice: "IDR 200K",
    strikethroughDisplayPrice: "IDR 500K",
    discountedDisplayPrice: "IDR 200K",
    period: "per month",
    amount: 200000,
    discountedAmount: 200000,
    description: "Unlimited AI practice across every module.",
    features: [
      "Unlimited AI Reading passages",
      "Unlimited AI Listening tests",
      "Unlimited AI Writing band-score feedback",
      "Unlimited AI Speaking analysis",
      "Unlimited Revision Notes & Flashcards",
      "Study Groups — practice together with friends",
      "Progress analytics dashboard",
      "Email + WhatsApp support",
    ],
    badge: "Recommended",
  },
  {
    planKey: "pro_annual",
    tier: "pro",
    name: "Pro Annual",
    displayPrice: "IDR 90K",
    period: "/ mo",
    amount: 1080000,
    description: "Same unlimited access as Pro monthly — billed IDR 1.08M upfront for the year.",
    features: [
      "Everything in Pro monthly",
      "Study Groups — practice together with friends",
      "Save 55% vs monthly",
      "12-month access — one payment of IDR 1.08M",
      "Priority WhatsApp support",
    ],
    badge: "Best Value",
  },
  {
    planKey: "road_to_8",
    tier: "elite",
    name: "Elite",
    displayPrice: "IDR 2.5M",
    eliteDisplayTeaserPrice: "IDR 6M",
    period: "one-time",
    amount: 2500000,
    description: "A complete done-for-you roadmap: personalised study plan, live coaching, and expert essay reviews — everything you need for a 1+ band increase.",
    features: [
      "Everything in Pro",
      "Personalised 4-week study roadmap built from your diagnostic score",
      "Week-by-week tasks: vocab drilling, writing workshops & full mock",
      "5/10/15 hours 1-on-1 coaching adjusted to your needs",
      "Manual essay reviews from an 8.5+ scorer",
      "Guaranteed 1+ band increase",
      "Unlimited WhatsApp Support",
    ],
    badge: "Limited Spots",
  },
];

/** Convenience helpers — saves duplicating array .find() everywhere. */
export const planByKey = (key: PlanDefinition["planKey"]) =>
  PLANS.find((p) => p.planKey === key)!;

export const planByTier = (tier: PlanTier) =>
  PLANS.find((p) => p.tier === tier)!;

/**
 * Resolve the display + amount for a plan given an optional promo.
 * Promo currently affects Pro only.
 */
export function resolvePrice(plan: PlanDefinition, promoApplied: boolean) {
  if (promoApplied && plan.discountedAmount !== undefined) {
    return {
      displayPrice: plan.discountedDisplayPrice ?? plan.displayPrice,
      amount: plan.discountedAmount,
      originalDisplayPrice: plan.displayPrice,
    };
  }
  return {
    displayPrice: plan.displayPrice,
    amount: plan.amount,
    originalDisplayPrice: null,
  };
}
