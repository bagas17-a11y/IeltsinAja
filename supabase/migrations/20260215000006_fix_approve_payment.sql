-- Fix Payment Approval Function
-- Adds idempotency and better error handling

CREATE OR REPLACE FUNCTION approve_payment(
  payment_id UUID,
  admin_id UUID
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user_id UUID;
  v_status TEXT;
  v_plan_type TEXT;
  v_user_email TEXT;
BEGIN
  -- Check if payment exists
  SELECT user_id, status, plan_type INTO v_user_id, v_status, v_plan_type
  FROM payment_verifications
  WHERE id = payment_id;

  IF NOT FOUND THEN
    RETURN json_build_object(
      'success', false,
      'error', 'Payment not found',
      'code', 'NOT_FOUND'
    );
  END IF;

  -- Check if already processed (idempotency)
  IF v_status = 'approved' THEN
    RETURN json_build_object(
      'success', true,
      'message', 'Payment already approved',
      'user_id', v_user_id,
      'idempotent', true
    );
  END IF;

  IF v_status = 'rejected' THEN
    RETURN json_build_object(
      'success', false,
      'error', 'Payment was previously rejected',
      'code', 'ALREADY_REJECTED'
    );
  END IF;

  -- Validate plan type
  IF v_plan_type NOT IN ('pro', 'elite') THEN
    RETURN json_build_object(
      'success', false,
      'error', 'Invalid plan type: ' || COALESCE(v_plan_type, 'null'),
      'code', 'INVALID_PLAN'
    );
  END IF;

  -- Get user email for logging
  SELECT email INTO v_user_email
  FROM auth.users
  WHERE id = v_user_id;

  -- Update payment status
  UPDATE payment_verifications
  SET
    status = 'approved',
    reviewed_at = NOW(),
    reviewed_by = admin_id
  WHERE id = payment_id;

  -- Upgrade user subscription
  IF v_plan_type = 'pro' THEN
    -- Pro: Monthly subscription with 30-day expiration
    UPDATE profiles
    SET
      subscription_tier = 'pro',
      subscription_end_date = NOW() + INTERVAL '30 days'
    WHERE id = v_user_id;
  ELSIF v_plan_type = 'elite' THEN
    -- Elite: One-time purchase, no expiration
    UPDATE profiles
    SET
      subscription_tier = 'elite',
      subscription_end_date = NULL
    WHERE id = v_user_id;
  END IF;

  -- Log admin action
  INSERT INTO admin_logs (admin_id, action_type, target_user_id, details)
  VALUES (
    admin_id,
    'approve_payment',
    v_user_id,
    json_build_object(
      'payment_id', payment_id,
      'plan_type', v_plan_type,
      'user_email', v_user_email
    )
  );

  RETURN json_build_object(
    'success', true,
    'user_id', v_user_id,
    'plan_type', v_plan_type,
    'message', 'Payment approved successfully'
  );

EXCEPTION
  WHEN OTHERS THEN
    -- Log error and return failure
    RAISE WARNING 'approve_payment error: % %', SQLERRM, SQLSTATE;
    RETURN json_build_object(
      'success', false,
      'error', 'Database error: ' || SQLERRM,
      'code', 'DB_ERROR'
    );
END;
$$;

-- Create similar function for rejecting payments
CREATE OR REPLACE FUNCTION reject_payment(
  payment_id UUID,
  admin_id UUID,
  rejection_reason TEXT DEFAULT NULL
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user_id UUID;
  v_status TEXT;
  v_user_email TEXT;
BEGIN
  -- Check if payment exists
  SELECT user_id, status INTO v_user_id, v_status
  FROM payment_verifications
  WHERE id = payment_id;

  IF NOT FOUND THEN
    RETURN json_build_object(
      'success', false,
      'error', 'Payment not found',
      'code', 'NOT_FOUND'
    );
  END IF;

  -- Check if already processed (idempotency)
  IF v_status = 'rejected' THEN
    RETURN json_build_object(
      'success', true,
      'message', 'Payment already rejected',
      'idempotent', true
    );
  END IF;

  IF v_status = 'approved' THEN
    RETURN json_build_object(
      'success', false,
      'error', 'Payment was previously approved',
      'code', 'ALREADY_APPROVED'
    );
  END IF;

  -- Get user email for logging
  SELECT email INTO v_user_email
  FROM auth.users
  WHERE id = v_user_id;

  -- Update payment status
  UPDATE payment_verifications
  SET
    status = 'rejected',
    reviewed_at = NOW(),
    reviewed_by = admin_id
  WHERE id = payment_id;

  -- Log admin action
  INSERT INTO admin_logs (admin_id, action_type, target_user_id, details)
  VALUES (
    admin_id,
    'reject_payment',
    v_user_id,
    json_build_object(
      'payment_id', payment_id,
      'rejection_reason', rejection_reason,
      'user_email', v_user_email
    )
  );

  RETURN json_build_object(
    'success', true,
    'message', 'Payment rejected successfully'
  );

EXCEPTION
  WHEN OTHERS THEN
    RAISE WARNING 'reject_payment error: % %', SQLERRM, SQLSTATE;
    RETURN json_build_object(
      'success', false,
      'error', 'Database error: ' || SQLERRM,
      'code', 'DB_ERROR'
    );
END;
$$;

COMMENT ON FUNCTION approve_payment IS 'Approves payment and upgrades user subscription (idempotent)';
COMMENT ON FUNCTION reject_payment IS 'Rejects payment with optional reason (idempotent)';
