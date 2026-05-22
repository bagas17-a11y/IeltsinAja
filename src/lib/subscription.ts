/**
 * Shared subscription / plan-assignment helpers.
 *
 * Every place that moves a user between Free / Pro / Elite goes through here.
 * The DB-side counterpart is the `change_user_plan` RPC defined in
 * `supabase/migrations/20260522000001_unified_plan_management.sql`.
 *
 * Used by:
 *   - PricingSelection.tsx        (Free signup — instant access)
 *   - admin/UserManagement.tsx    (Change Plan modal)
 *   - admin/PaymentVerification   (delegates via approve_payment RPC)
 */

import { supabase } from "@/integrations/supabase/client";

export type Tier = "free" | "pro" | "elite";

export interface ChangeUserPlanArgs {
  /** Profile.user_id (auth uid) of the user being changed. */
  targetUserId: string;
  /** Plan to assign. */
  tier: Tier;
  /**
   * Duration in days for the new subscription. Only meaningful for `pro`.
   * Defaults: pro = 30 days, free/elite ignored.
   */
  durationDays?: number;
  /**
   * Admin acting on behalf of the user. Required for admin-initiated changes
   * (any tier other than Free); the DB RPC will reject the call otherwise.
   * Pass `null` for the user's own Free-signup self-service call.
   */
  adminId?: string | null;
}

export interface ChangeUserPlanResult {
  success: boolean;
  /** Present on success */
  newTier?: Tier;
  oldTier?: Tier;
  userId?: string;
  subscriptionEndDate?: string | null;
  /** Present on failure */
  errorMessage?: string;
  errorCode?: string;
}

/** Default subscription duration in days per plan. */
export const PLAN_DEFAULT_DAYS: Record<Tier, number | null> = {
  free: null,
  pro: 30,
  elite: null, // one-time
};

/**
 * Call the `change_user_plan` RPC. This is the single entry point that
 * keeps profile fields (tier, status, end_date, is_verified, last_payment_date)
 * consistent across signup, admin UI, and payment approval.
 */
export async function changeUserPlan({
  targetUserId,
  tier,
  durationDays,
  adminId,
}: ChangeUserPlanArgs): Promise<ChangeUserPlanResult> {
  const effectiveDuration =
    durationDays ?? PLAN_DEFAULT_DAYS[tier] ?? null;

  const { data, error } = await supabase.rpc("change_user_plan", {
    target_user_id: targetUserId,
    new_tier: tier,
    duration_days: effectiveDuration,
    admin_id: adminId ?? null,
  });

  if (error) {
    return {
      success: false,
      errorMessage: error.message,
      errorCode: "RPC_ERROR",
    };
  }

  // The RPC returns a JSON object — Supabase types this as `Json`.
  const payload = data as
    | {
        success: boolean;
        user_id?: string;
        old_tier?: Tier;
        new_tier?: Tier;
        subscription_end_date?: string | null;
        error?: string;
        code?: string;
      }
    | null;

  if (!payload?.success) {
    return {
      success: false,
      errorMessage: payload?.error ?? "Unknown error",
      errorCode: payload?.code ?? "RPC_FAILED",
    };
  }

  return {
    success: true,
    userId: payload.user_id,
    oldTier: payload.old_tier,
    newTier: payload.new_tier,
    subscriptionEndDate: payload.subscription_end_date ?? null,
  };
}

/**
 * Convenience: a user moving themselves to Free during signup.
 * Wraps `changeUserPlan` with adminId=null so the RPC's self-service path runs.
 */
export function selfServiceActivateFree(userId: string) {
  return changeUserPlan({
    targetUserId: userId,
    tier: "free",
    adminId: null,
  });
}

/** Permanently delete a user (admin only). Cascades profile and related rows. */
export async function adminDeleteUser(
  targetUserId: string,
  adminId: string
): Promise<{ success: boolean; errorMessage?: string }> {
  const { data, error } = await supabase.rpc("admin_delete_user", {
    target_user_id: targetUserId,
    admin_id: adminId,
  });

  if (error) {
    return { success: false, errorMessage: error.message };
  }

  const payload = data as { success?: boolean; error?: string } | null;
  if (!payload?.success) {
    return { success: false, errorMessage: payload?.error ?? "Delete failed" };
  }

  return { success: true };
}

/** Human-readable plan label. */
export function planLabel(tier: Tier): string {
  switch (tier) {
    case "free":
      return "Free";
    case "pro":
      return "Pro";
    case "elite":
      return "Elite";
  }
}
