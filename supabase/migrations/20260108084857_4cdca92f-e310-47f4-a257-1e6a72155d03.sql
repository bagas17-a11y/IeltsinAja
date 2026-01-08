-- Update approve_payment function to set subscription expiration for pro users
CREATE OR REPLACE FUNCTION public.approve_payment(payment_id uuid, admin_id uuid)
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
    v_user_id UUID;
    v_plan_type TEXT;
    v_new_tier subscription_tier;
    v_expires_at TIMESTAMP WITH TIME ZONE;
BEGIN
    -- Get payment details
    SELECT user_id, plan_type INTO v_user_id, v_plan_type
    FROM public.payment_verifications
    WHERE id = payment_id;
    
    -- Determine new tier and expiration
    IF v_plan_type = 'pro' THEN
        v_new_tier := 'pro';
        -- Pro subscription expires in 31 days
        v_expires_at := now() + interval '31 days';
    ELSE
        v_new_tier := 'elite';
        -- Elite has no expiration (one-time)
        v_expires_at := NULL;
    END IF;
    
    -- Update payment status
    UPDATE public.payment_verifications
    SET status = 'approved', reviewed_at = now(), reviewed_by = admin_id
    WHERE id = payment_id;
    
    -- Update user's subscription tier, is_verified, and expiration
    UPDATE public.profiles
    SET subscription_tier = v_new_tier, 
        is_verified = true, 
        subscription_expires_at = v_expires_at,
        updated_at = now()
    WHERE user_id = v_user_id;
END;
$function$;