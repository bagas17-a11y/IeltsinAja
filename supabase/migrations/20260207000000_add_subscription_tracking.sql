-- Add subscription tracking columns to profiles table
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS subscription_status TEXT DEFAULT 'none';
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS subscription_start_date TIMESTAMPTZ;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS subscription_end_date TIMESTAMPTZ;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS auto_renew BOOLEAN DEFAULT FALSE;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS last_payment_date TIMESTAMPTZ;

-- Add indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_profiles_subscription_status ON profiles(subscription_status);
CREATE INDEX IF NOT EXISTS idx_profiles_subscription_end_date ON profiles(subscription_end_date);

-- Create RPC function to extend a user's subscription by N days
CREATE OR REPLACE FUNCTION extend_subscription(target_user_id UUID, days_to_add INTEGER, admin_id UUID)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Verify the caller is an admin
  IF NOT EXISTS (SELECT 1 FROM user_roles WHERE user_id = admin_id AND role = 'admin') THEN
    RAISE EXCEPTION 'Only admins can extend subscriptions';
  END IF;

  UPDATE profiles
  SET
    subscription_end_date = COALESCE(subscription_end_date, NOW()) + (days_to_add || ' days')::INTERVAL,
    subscription_status = 'active',
    updated_at = NOW()
  WHERE user_id = target_user_id;

  -- Log the action
  INSERT INTO admin_logs (admin_id, target_user_id, action_type, status, details)
  VALUES (admin_id, target_user_id, 'extend_subscription', 'success',
    jsonb_build_object('days_added', days_to_add));
END;
$$;

-- Create RPC function to toggle admin role for a user
CREATE OR REPLACE FUNCTION toggle_admin_role(target_user_id UUID, admin_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  is_currently_admin BOOLEAN;
BEGIN
  -- Verify the caller is an admin
  IF NOT EXISTS (SELECT 1 FROM user_roles WHERE user_id = admin_id AND role = 'admin') THEN
    RAISE EXCEPTION 'Only admins can toggle admin roles';
  END IF;

  -- Check if the target user currently has the admin role
  SELECT EXISTS (SELECT 1 FROM user_roles WHERE user_id = target_user_id AND role = 'admin')
  INTO is_currently_admin;

  IF is_currently_admin THEN
    DELETE FROM user_roles WHERE user_id = target_user_id AND role = 'admin';
  ELSE
    INSERT INTO user_roles (user_id, role) VALUES (target_user_id, 'admin');
  END IF;

  -- Log the action
  INSERT INTO admin_logs (admin_id, target_user_id, action_type, status, details)
  VALUES (admin_id, target_user_id, 'toggle_admin', 'success',
    jsonb_build_object('was_admin', is_currently_admin, 'is_admin_now', NOT is_currently_admin));

  RETURN NOT is_currently_admin;
END;
$$;
