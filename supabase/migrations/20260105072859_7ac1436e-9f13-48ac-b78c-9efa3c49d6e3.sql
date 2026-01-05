-- Update approve_payment function to also set is_verified
CREATE OR REPLACE FUNCTION public.approve_payment(payment_id uuid, admin_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_user_id UUID;
    v_plan_type TEXT;
    v_new_tier subscription_tier;
BEGIN
    -- Get payment details
    SELECT user_id, plan_type INTO v_user_id, v_plan_type
    FROM public.payment_verifications
    WHERE id = payment_id;
    
    -- Determine new tier
    IF v_plan_type = 'pro' THEN
        v_new_tier := 'pro';
    ELSE
        v_new_tier := 'elite';
    END IF;
    
    -- Update payment status
    UPDATE public.payment_verifications
    SET status = 'approved', reviewed_at = now(), reviewed_by = admin_id
    WHERE id = payment_id;
    
    -- Update user's subscription tier AND is_verified
    UPDATE public.profiles
    SET subscription_tier = v_new_tier, is_verified = true, updated_at = now()
    WHERE user_id = v_user_id;
END;
$$;