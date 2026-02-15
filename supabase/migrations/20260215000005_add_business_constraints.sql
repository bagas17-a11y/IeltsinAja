-- Add Business Rule Constraints Migration
-- Enforces data integrity rules at the database level

-- Payment status must be valid
ALTER TABLE payment_verifications
DROP CONSTRAINT IF EXISTS check_payment_status;

ALTER TABLE payment_verifications
ADD CONSTRAINT check_payment_status
  CHECK (status IN ('pending', 'approved', 'rejected'));

-- Subscription tier must be valid
ALTER TABLE profiles
DROP CONSTRAINT IF EXISTS check_subscription_tier;

ALTER TABLE profiles
ADD CONSTRAINT check_subscription_tier
  CHECK (subscription_tier IN ('free', 'pro', 'elite'));

-- Practice counts constraint moved to 20260215000008 (after columns are added)

-- Band score must be valid IELTS range (0-9) - user_progress has single band_score column
ALTER TABLE user_progress
DROP CONSTRAINT IF EXISTS check_band_score_valid;

ALTER TABLE user_progress
ADD CONSTRAINT check_band_score_valid
  CHECK (band_score IS NULL OR (band_score >= 0 AND band_score <= 9));

-- Listening submission score must be 0-40
ALTER TABLE listening_submissions
DROP CONSTRAINT IF EXISTS check_listening_score_valid;

ALTER TABLE listening_submissions
ADD CONSTRAINT check_listening_score_valid
  CHECK (score IS NULL OR (score >= 0 AND score <= 40));

-- Practice submission band scores must be valid
ALTER TABLE practice_submissions
DROP CONSTRAINT IF EXISTS check_submission_band_score_valid;

ALTER TABLE practice_submissions
ADD CONSTRAINT check_submission_band_score_valid
  CHECK (
    band_score IS NULL OR
    (band_score >= 0 AND band_score <= 9)
  );

COMMENT ON CONSTRAINT check_payment_status ON payment_verifications IS 'Payment status must be pending, approved, or rejected';
COMMENT ON CONSTRAINT check_subscription_tier ON profiles IS 'Subscription tier must be free, pro, or elite';
COMMENT ON CONSTRAINT check_band_score_valid ON user_progress IS 'Band score must be in IELTS range 0-9';
COMMENT ON CONSTRAINT check_listening_score_valid ON listening_submissions IS 'Listening scores range from 0-40';
