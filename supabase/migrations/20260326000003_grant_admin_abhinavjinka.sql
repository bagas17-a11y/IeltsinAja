-- Grant admin role to abhinavjinka@berkeley.edu
-- Safe to run multiple times (ON CONFLICT DO NOTHING).
-- Inserts 0 rows if the user hasn't signed up yet.

INSERT INTO public.user_roles (user_id, role)
SELECT id, 'admin'
FROM auth.users
WHERE email = 'abhinavjinka@berkeley.edu'
ON CONFLICT (user_id, role) DO NOTHING;
