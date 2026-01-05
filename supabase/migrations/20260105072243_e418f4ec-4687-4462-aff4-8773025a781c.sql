-- Add is_verified column to profiles table
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS is_verified boolean NOT NULL DEFAULT false;

-- Create function to unlock user (sets is_verified to true)
CREATE OR REPLACE FUNCTION public.unlock_user(target_user_id uuid, admin_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    -- Check if admin has admin role
    IF NOT has_role(admin_id, 'admin') THEN
        RAISE EXCEPTION 'Unauthorized: Admin role required';
    END IF;
    
    -- Update user's is_verified status
    UPDATE public.profiles
    SET is_verified = true, updated_at = now()
    WHERE user_id = target_user_id;
END;
$$;