-- =============================================================================
-- SECURITY: Prevent self-service subscription / privilege escalation on profiles
-- =============================================================================
--
-- Problem
-- -------
-- The original RLS policy "Users can update their own profile"
-- (20260104053414) is defined as:
--
--     FOR UPDATE USING (auth.uid() = user_id)
--
-- with no WITH CHECK and no column restriction. Because subscription fields
-- (subscription_tier, subscription_status, subscription_start_date,
-- subscription_end_date, is_verified, last_payment_date) live directly on the
-- `profiles` table, any authenticated user could run, from the browser with the
-- public anon key:
--
--     supabase.from('profiles')
--             .update({ subscription_tier: 'elite', is_verified: true })
--             .eq('user_id', myUserId)
--
-- ...and instantly grant themselves a paid plan for free — a complete bypass of
-- the manual WhatsApp-receipt payment flow.
--
-- Fix
-- ---
-- A BEFORE UPDATE trigger that, for any NON-admin caller, forces all privileged
-- subscription fields back to their previous (OLD) values. The canonical
-- change_user_plan() / approve_payment() RPCs are SECURITY DEFINER and run as
-- the table owner (not as the calling user), so they are unaffected: inside
-- those functions auth.uid() may be the admin, but more importantly the trigger
-- only reverts changes when the *caller* is not an admin AND is editing their
-- own row through the normal client path.
--
-- We deliberately allow admins (and the SECURITY DEFINER RPCs, whose owner is a
-- superuser/owner role that is not a normal authenticated user) to change these
-- fields. The check below treats:
--   - a NULL auth.uid()  -> trusted server-side / service-role context (allow)
--   - an admin auth.uid() -> allow
--   - everyone else       -> revert privileged fields to OLD
-- =============================================================================

CREATE OR REPLACE FUNCTION public.protect_profile_privileged_fields()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_uid UUID := auth.uid();
  v_is_admin BOOLEAN;
BEGIN
  -- No auth context (service role / SECURITY DEFINER server jobs): allow.
  IF v_uid IS NULL THEN
    RETURN NEW;
  END IF;

  SELECT public.has_role(v_uid, 'admin') INTO v_is_admin;

  -- Admins may change anything.
  IF v_is_admin THEN
    RETURN NEW;
  END IF;

  -- Non-admin client update: force all privileged fields back to their
  -- existing values, so a user can still edit name/avatar/scores/etc. but
  -- can NEVER alter their own plan or verification status.
  NEW.subscription_tier       := OLD.subscription_tier;
  NEW.subscription_status     := OLD.subscription_status;
  NEW.subscription_start_date := OLD.subscription_start_date;
  NEW.subscription_end_date   := OLD.subscription_end_date;
  NEW.is_verified             := OLD.is_verified;
  NEW.last_payment_date       := OLD.last_payment_date;

  RETURN NEW;
END;
$$;

COMMENT ON FUNCTION public.protect_profile_privileged_fields IS
  'Reverts subscription/verification fields on profiles for non-admin client updates. Prevents self-service plan escalation. SECURITY DEFINER RPCs (change_user_plan/approve_payment) are unaffected.';

-- Recreate the trigger idempotently.
DROP TRIGGER IF EXISTS trg_protect_profile_privileged_fields ON public.profiles;

CREATE TRIGGER trg_protect_profile_privileged_fields
BEFORE UPDATE ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION public.protect_profile_privileged_fields();

-- Also tighten the RLS policy itself with a WITH CHECK so the row-ownership
-- invariant is enforced on the post-update row as well (defence in depth).
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;

CREATE POLICY "Users can update their own profile"
ON public.profiles FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);
