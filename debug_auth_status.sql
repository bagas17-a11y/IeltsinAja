-- Debug script to check user authentication status
-- Run this in Supabase SQL Editor to check if users are properly confirmed

-- Check all users and their email confirmation status
SELECT
  id,
  email,
  email_confirmed_at,
  created_at,
  last_sign_in_at,
  CASE
    WHEN email_confirmed_at IS NOT NULL THEN 'Confirmed'
    ELSE 'NOT Confirmed'
  END as confirmation_status
FROM auth.users
ORDER BY created_at DESC
LIMIT 10;

-- Check if profiles exist for users
SELECT
  u.id,
  u.email,
  u.email_confirmed_at,
  p.is_verified,
  p.subscription_tier
FROM auth.users u
LEFT JOIN public.profiles p ON u.id = p.user_id
ORDER BY u.created_at DESC
LIMIT 10;
