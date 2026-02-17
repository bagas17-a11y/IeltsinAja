-- Seed initial super admin using user_roles table
-- This replaces the hardcoded email check in the frontend

-- Insert admin role for the initial super admin
-- bagasshryo@gmail.com
INSERT INTO user_roles (user_id, role)
SELECT id, 'admin'
FROM auth.users
WHERE email = 'bagasshryo@gmail.com'
ON CONFLICT (user_id, role) DO NOTHING;

-- Add comment for documentation
COMMENT ON TABLE user_roles IS 'RBAC table - use has_role() RPC function to check user permissions instead of hardcoded email checks';

-- Note: has_role() RPC function already exists from previous migrations
-- Frontend now uses this function instead of hardcoded email checks
