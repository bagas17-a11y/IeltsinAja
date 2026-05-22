-- WhatsApp-first signup + admin delete user
-- Safe to run after 20260522000001 (re-applies RPCs if that migration was never pushed).

-- -----------------------------------------------------------------------------
-- payment_verifications: no receipt required (WhatsApp flow)
-- -----------------------------------------------------------------------------
ALTER TABLE public.payment_verifications
  ALTER COLUMN receipt_url DROP NOT NULL;

COMMENT ON COLUMN public.payment_verifications.receipt_url IS
  'Storage path for uploaded receipt, or literal whatsapp when user chose plan via WA chat.';

-- -----------------------------------------------------------------------------
-- change_user_plan (re-apply — fixes "function not found in schema cache")
-- -----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.change_user_plan(
  target_user_id UUID,
  new_tier subscription_tier,
  duration_days INTEGER DEFAULT NULL,
  admin_id UUID DEFAULT NULL
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_caller_id UUID := COALESCE(admin_id, auth.uid());
  v_is_admin BOOLEAN;
  v_is_self BOOLEAN;
  v_new_end TIMESTAMPTZ;
  v_old_tier subscription_tier;
BEGIN
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = v_caller_id AND role = 'admin'
  ) INTO v_is_admin;

  v_is_self := (v_caller_id = target_user_id);

  IF NOT v_is_admin THEN
    IF NOT v_is_self THEN
      RETURN json_build_object(
        'success', false,
        'error', 'Only admins can change another user''s plan',
        'code', 'FORBIDDEN'
      );
    END IF;

    IF new_tier <> 'free' THEN
      RETURN json_build_object(
        'success', false,
        'error', 'Self-service plan changes are only allowed for the Free tier',
        'code', 'FORBIDDEN_TIER'
      );
    END IF;
  END IF;

  SELECT subscription_tier INTO v_old_tier
  FROM public.profiles
  WHERE user_id = target_user_id;

  IF v_old_tier IS NULL THEN
    RETURN json_build_object(
      'success', false,
      'error', 'Profile not found',
      'code', 'NOT_FOUND'
    );
  END IF;

  IF new_tier = 'pro' THEN
    v_new_end := NOW() + ((COALESCE(duration_days, 30))::TEXT || ' days')::INTERVAL;
  ELSE
    v_new_end := NULL;
  END IF;

  UPDATE public.profiles
  SET
    subscription_tier = new_tier,
    subscription_status = 'active',
    subscription_start_date = NOW(),
    subscription_end_date = v_new_end,
    is_verified = TRUE,
    last_payment_date = CASE
      WHEN new_tier IN ('pro', 'elite') THEN NOW()
      ELSE last_payment_date
    END,
    updated_at = NOW()
  WHERE user_id = target_user_id;

  IF v_is_admin THEN
    INSERT INTO public.admin_logs (
      admin_id, target_user_id, action_type, status, details
    ) VALUES (
      v_caller_id,
      target_user_id,
      'change_user_plan',
      'success',
      jsonb_build_object(
        'old_tier', v_old_tier,
        'new_tier', new_tier,
        'duration_days', duration_days,
        'new_end_date', v_new_end
      )
    );
  END IF;

  RETURN json_build_object(
    'success', true,
    'user_id', target_user_id,
    'old_tier', v_old_tier,
    'new_tier', new_tier,
    'subscription_end_date', v_new_end
  );

EXCEPTION
  WHEN OTHERS THEN
    RETURN json_build_object(
      'success', false,
      'error', 'Database error: ' || SQLERRM,
      'code', 'DB_ERROR'
    );
END;
$$;

GRANT EXECUTE ON FUNCTION public.change_user_plan(UUID, subscription_tier, INTEGER, UUID) TO authenticated;

-- -----------------------------------------------------------------------------
-- admin_delete_user
-- -----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.admin_delete_user(
  target_user_id UUID,
  admin_id UUID
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth
AS $$
DECLARE
  v_email TEXT;
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM public.user_roles WHERE user_id = admin_id AND role = 'admin'
  ) THEN
    RETURN json_build_object('success', false, 'error', 'Only admins can delete users', 'code', 'FORBIDDEN');
  END IF;

  IF target_user_id = admin_id THEN
    RETURN json_build_object('success', false, 'error', 'You cannot delete your own account', 'code', 'SELF_DELETE');
  END IF;

  SELECT email INTO v_email FROM auth.users WHERE id = target_user_id;

  IF v_email IS NULL THEN
    RETURN json_build_object('success', false, 'error', 'User not found', 'code', 'NOT_FOUND');
  END IF;

  DELETE FROM auth.users WHERE id = target_user_id;

  INSERT INTO public.admin_logs (admin_id, target_user_id, action_type, status, details)
  VALUES (
    admin_id,
    target_user_id,
    'delete_user',
    'success',
    jsonb_build_object('deleted_email', v_email)
  );

  RETURN json_build_object('success', true, 'deleted_email', v_email);

EXCEPTION
  WHEN OTHERS THEN
    RETURN json_build_object(
      'success', false,
      'error', 'Database error: ' || SQLERRM,
      'code', 'DB_ERROR'
    );
END;
$$;

GRANT EXECUTE ON FUNCTION public.admin_delete_user(UUID, UUID) TO authenticated;

COMMENT ON FUNCTION public.admin_delete_user IS
  'Permanently deletes an auth user and cascaded data. Admin-only; cannot delete self.';
