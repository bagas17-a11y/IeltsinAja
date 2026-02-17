-- Grant Human+AI (elite) package access to bagasshryo@gmail.com
-- Run once; safe if user does not exist yet (updates 0 rows).
-- Uses only columns that exist: subscription_tier, subscription_status, is_verified, subscription_start_date, subscription_end_date.

UPDATE public.profiles
SET
  subscription_tier = 'elite',
  subscription_status = 'active',
  is_verified = true,
  subscription_start_date = COALESCE(subscription_start_date, NOW()),
  subscription_end_date = COALESCE(subscription_end_date, NOW() + INTERVAL '1 year'),
  updated_at = NOW()
WHERE user_id = (
  SELECT id FROM auth.users WHERE email = 'bagasshryo@gmail.com' LIMIT 1
);
