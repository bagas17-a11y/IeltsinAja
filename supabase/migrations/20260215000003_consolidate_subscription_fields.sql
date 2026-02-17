-- Consolidate Subscription Fields Migration
-- Removes duplicate subscription_expires_at field and keeps subscription_end_date

-- Migrate any data from old field to new field (if needed)
UPDATE profiles
SET subscription_end_date = subscription_expires_at
WHERE subscription_end_date IS NULL
  AND subscription_expires_at IS NOT NULL;

-- Drop the old column
ALTER TABLE profiles DROP COLUMN IF EXISTS subscription_expires_at;

-- Add business rule constraints
-- Elite tier: one-time payment, no expiration
ALTER TABLE profiles
ADD CONSTRAINT check_elite_no_expiration
  CHECK (
    subscription_tier != 'elite' OR
    (subscription_tier = 'elite' AND subscription_end_date IS NULL)
  );

-- Pro tier: monthly subscription, must have expiration
ALTER TABLE profiles
ADD CONSTRAINT check_pro_has_expiration
  CHECK (
    subscription_tier != 'pro' OR
    (subscription_tier = 'pro' AND subscription_end_date IS NOT NULL)
  );

-- Free tier: no payment, no expiration
ALTER TABLE profiles
ADD CONSTRAINT check_free_no_expiration
  CHECK (
    subscription_tier != 'free' OR
    (subscription_tier = 'free' AND subscription_end_date IS NULL)
  );

COMMENT ON CONSTRAINT check_elite_no_expiration ON profiles IS 'Elite subscriptions are one-time purchases with no expiration';
COMMENT ON CONSTRAINT check_pro_has_expiration ON profiles IS 'Pro subscriptions are monthly and must have an end date';
COMMENT ON CONSTRAINT check_free_no_expiration ON profiles IS 'Free tier has no subscription end date';
