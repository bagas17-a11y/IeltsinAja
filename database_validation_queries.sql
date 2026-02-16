-- ====================================================================
-- COMPREHENSIVE DATABASE VALIDATION QUERIES
-- Run these in Supabase SQL Editor to validate signup flow
-- ====================================================================

-- ====================================================================
-- 1. SCHEMA VALIDATION
-- ====================================================================

-- Check profiles table structure
SELECT
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns
WHERE table_schema = 'public'
  AND table_name = 'profiles'
ORDER BY ordinal_position;

-- Expected columns:
-- ✓ id (uuid)
-- ✓ user_id (uuid)
-- ✓ email (text, nullable)
-- ✓ full_name (text, nullable)
-- ✓ phone_number (text, nullable) -- Should exist now
-- ✓ avatar_url (text, nullable)
-- ✓ subscription_tier (text/enum, default 'free')
-- ✓ subscription_end_date (timestamp, nullable) -- NOT subscription_expires_at
-- ✓ is_verified (boolean, default false)
-- ✓ created_at (timestamp)
-- ✓ updated_at (timestamp)

-- ====================================================================
-- 2. CONSTRAINT VALIDATION
-- ====================================================================

-- Check all constraints on profiles table
SELECT
  con.conname AS constraint_name,
  con.contype AS constraint_type,
  pg_get_constraintdef(con.oid) AS constraint_definition
FROM pg_constraint con
JOIN pg_class rel ON rel.oid = con.conrelid
JOIN pg_namespace nsp ON nsp.oid = rel.relnamespace
WHERE nsp.nspname = 'public'
  AND rel.relname = 'profiles'
ORDER BY con.contype, con.conname;

-- Expected constraints:
-- ✓ check_subscription_tier (subscription_tier IN ('free', 'pro', 'elite'))
-- ✓ check_elite_no_expiration (elite tier has no expiration)
-- ✓ check_pro_has_expiration (pro tier has expiration)
-- ✓ check_free_no_expiration (free tier has no expiration)
-- ✓ check_phone_number_format (Indonesian phone format)
-- ✓ Primary key on id
-- ✓ Unique on user_id

-- ====================================================================
-- 3. TRIGGER VALIDATION
-- ====================================================================

-- Check if handle_new_user trigger exists and is active
SELECT
  tgname AS trigger_name,
  tgtype AS trigger_type,
  tgenabled AS enabled,
  pg_get_triggerdef(oid) AS trigger_definition
FROM pg_trigger
WHERE tgname = 'on_auth_user_created'
  AND tgrelid = 'auth.users'::regclass;

-- Should return 1 row with tgenabled = 'O' (enabled)

-- ====================================================================
-- 4. DATA INTEGRITY CHECKS
-- ====================================================================

-- Check for orphaned profiles (profile exists but user doesn't)
SELECT
  p.id,
  p.user_id,
  p.email,
  'ORPHANED: User does not exist in auth.users' AS issue
FROM public.profiles p
WHERE NOT EXISTS (
  SELECT 1 FROM auth.users u WHERE u.id = p.user_id
);
-- Expected: 0 rows (no orphaned profiles)

-- Check for users without profiles (user exists but profile doesn't)
SELECT
  u.id,
  u.email,
  u.created_at,
  'MISSING PROFILE: User has no profile record' AS issue
FROM auth.users u
WHERE NOT EXISTS (
  SELECT 1 FROM public.profiles p WHERE p.user_id = u.id
);
-- Expected: 0 rows (all users have profiles)

-- Check subscription field consistency
-- Elite users should NOT have expiration
SELECT
  id,
  user_id,
  email,
  subscription_tier,
  subscription_end_date,
  'VIOLATION: Elite user has expiration date' AS issue
FROM public.profiles
WHERE subscription_tier = 'elite'
  AND subscription_end_date IS NOT NULL;
-- Expected: 0 rows

-- Pro users SHOULD have expiration
SELECT
  id,
  user_id,
  email,
  subscription_tier,
  subscription_end_date,
  'WARNING: Pro user missing expiration date' AS issue
FROM public.profiles
WHERE subscription_tier = 'pro'
  AND subscription_end_date IS NULL;
-- Expected: 0 rows (or investigate each case)

-- Free users should NOT have expiration
SELECT
  id,
  user_id,
  email,
  subscription_tier,
  subscription_end_date,
  'VIOLATION: Free user has expiration date' AS issue
FROM public.profiles
WHERE subscription_tier = 'free'
  AND subscription_end_date IS NOT NULL;
-- Expected: 0 rows

-- Check for invalid phone numbers
SELECT
  id,
  user_id,
  email,
  phone_number,
  'INVALID: Phone number does not match Indonesian format' AS issue
FROM public.profiles
WHERE phone_number IS NOT NULL
  AND phone_number !~ '^(\+62|62|0)?8[1-9][0-9]{7,11}$';
-- Expected: 0 rows (all phone numbers valid)

-- ====================================================================
-- 5. RECENT USER SIGNUPS (for testing)
-- ====================================================================

-- View recent user signups with full details
SELECT
  u.id AS user_id,
  u.email,
  u.email_confirmed_at,
  u.created_at AS user_created,
  u.last_sign_in_at,
  p.full_name,
  p.phone_number,
  p.subscription_tier,
  p.is_verified,
  p.created_at AS profile_created,
  CASE
    WHEN p.id IS NULL THEN 'NO PROFILE'
    WHEN u.email_confirmed_at IS NULL THEN 'EMAIL NOT CONFIRMED'
    WHEN NOT p.is_verified THEN 'PAYMENT NOT VERIFIED'
    ELSE 'READY'
  END AS status
FROM auth.users u
LEFT JOIN public.profiles p ON p.user_id = u.id
ORDER BY u.created_at DESC
LIMIT 10;

-- ====================================================================
-- 6. ADMIN ROLE CHECK
-- ====================================================================

-- Check which users have admin role
SELECT
  ur.user_id,
  u.email,
  ur.role,
  ur.created_at
FROM public.user_roles ur
JOIN auth.users u ON u.id = ur.user_id
WHERE ur.role = 'admin'
ORDER BY ur.created_at;

-- Should include: bagasshryo@gmail.com

-- ====================================================================
-- 7. PHONE NUMBER TEST DATA
-- ====================================================================

-- Check if phone numbers are being stored correctly
SELECT
  email,
  phone_number,
  LENGTH(phone_number) AS phone_length,
  CASE
    WHEN phone_number ~ '^08[1-9][0-9]{7,11}$' THEN 'Valid (08 format)'
    WHEN phone_number ~ '^\+628[1-9][0-9]{7,11}$' THEN 'Valid (+62 format)'
    WHEN phone_number ~ '^628[1-9][0-9]{7,11}$' THEN 'Valid (62 format)'
    ELSE 'Invalid format'
  END AS format_validation
FROM public.profiles
WHERE phone_number IS NOT NULL
ORDER BY created_at DESC
LIMIT 10;

-- ====================================================================
-- 8. RLS POLICY CHECK
-- ====================================================================

-- Check RLS policies on profiles table
SELECT
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual AS using_expression,
  with_check AS with_check_expression
FROM pg_policies
WHERE schemaname = 'public'
  AND tablename = 'profiles'
ORDER BY policyname;

-- Should have policies for:
-- ✓ Users can view own profile
-- ✓ Users can update own profile
-- ✓ Admins can view all profiles
-- ✓ Service role has full access

-- ====================================================================
-- 9. FUNCTION EXISTENCE CHECK
-- ====================================================================

-- Check if all required functions exist
SELECT
  routine_name,
  routine_type,
  security_type,
  routine_definition
FROM information_schema.routines
WHERE routine_schema = 'public'
  AND routine_name IN (
    'handle_new_user',
    'approve_payment',
    'has_role',
    'normalize_phone_number'
  )
ORDER BY routine_name;

-- Expected: 4 functions found

-- ====================================================================
-- 10. SUBSCRIPTION STATUS SUMMARY
-- ====================================================================

-- Get summary of all subscription tiers
SELECT
  subscription_tier,
  COUNT(*) AS user_count,
  COUNT(CASE WHEN is_verified THEN 1 END) AS verified_count,
  COUNT(CASE WHEN NOT is_verified THEN 1 END) AS unverified_count,
  COUNT(CASE WHEN subscription_end_date IS NOT NULL THEN 1 END) AS with_expiration
FROM public.profiles
GROUP BY subscription_tier
ORDER BY
  CASE subscription_tier
    WHEN 'elite' THEN 1
    WHEN 'pro' THEN 2
    WHEN 'free' THEN 3
  END;

-- ====================================================================
-- QUICK HEALTH CHECK QUERY (Run this first!)
-- ====================================================================

SELECT
  'Database Health Check' AS check_name,
  (SELECT COUNT(*) FROM auth.users) AS total_users,
  (SELECT COUNT(*) FROM public.profiles) AS total_profiles,
  (SELECT COUNT(*) FROM auth.users u
   WHERE NOT EXISTS (SELECT 1 FROM public.profiles p WHERE p.user_id = u.id)
  ) AS users_without_profiles,
  (SELECT COUNT(*) FROM public.profiles
   WHERE subscription_tier = 'elite' AND subscription_end_date IS NOT NULL
  ) AS elite_with_expiration_violations,
  (SELECT COUNT(*) FROM public.user_roles WHERE role = 'admin') AS admin_count,
  (SELECT COUNT(*) FROM public.profiles
   WHERE phone_number IS NOT NULL
     AND phone_number !~ '^(\+62|62|0)?8[1-9][0-9]{7,11}$'
  ) AS invalid_phone_numbers,
  CASE
    WHEN (SELECT COUNT(*) FROM auth.users) = (SELECT COUNT(*) FROM public.profiles)
      AND (SELECT COUNT(*) FROM public.profiles WHERE subscription_tier = 'elite' AND subscription_end_date IS NOT NULL) = 0
      AND (SELECT COUNT(*) FROM public.profiles WHERE phone_number IS NOT NULL AND phone_number !~ '^(\+62|62|0)?8[1-9][0-9]{7,11}$') = 0
    THEN '✅ ALL CHECKS PASSED'
    ELSE '⚠️  ISSUES FOUND - Run detailed queries above'
  END AS overall_status;
