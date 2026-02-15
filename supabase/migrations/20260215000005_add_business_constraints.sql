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

-- Practice counts cannot be negative
ALTER TABLE user_progress
DROP CONSTRAINT IF EXISTS check_practice_counts_positive;

ALTER TABLE user_progress
ADD CONSTRAINT check_practice_counts_positive
  CHECK (
    (reading_count IS NULL OR reading_count >= 0) AND
    (listening_count IS NULL OR listening_count >= 0) AND
    (writing_count IS NULL OR writing_count >= 0) AND
    (speaking_count IS NULL OR speaking_count >= 0)
  );

-- Band scores must be valid IELTS range (0-9)
ALTER TABLE user_progress
DROP CONSTRAINT IF EXISTS check_band_scores_valid;

ALTER TABLE user_progress
ADD CONSTRAINT check_band_scores_valid
  CHECK (
    (reading_band IS NULL OR (reading_band >= 0 AND reading_band <= 9)) AND
    (listening_band IS NULL OR (listening_band >= 0 AND listening_band <= 9)) AND
    (writing_band IS NULL OR (writing_band >= 0 AND writing_band <= 9)) AND
    (speaking_band IS NULL OR (speaking_band >= 0 AND speaking_band <= 9))
  );

-- Listening submission score must be 0-40
ALTER TABLE listening_submissions
DROP CONSTRAINT IF EXISTS check_listening_score_valid;

ALTER TABLE listening_submissions
ADD CONSTRAINT check_listening_score_valid
  CHECK (score IS NULL OR (score >= 0 AND score <= 40));

-- Practice submission scores must be valid
ALTER TABLE practice_submissions
DROP CONSTRAINT IF EXISTS check_submission_score_valid;

ALTER TABLE practice_submissions
ADD CONSTRAINT check_submission_score_valid
  CHECK (
    score IS NULL OR
    (score >= 0 AND score <= 9)
  );

COMMENT ON CONSTRAINT check_payment_status ON payment_verifications IS 'Payment status must be pending, approved, or rejected';
COMMENT ON CONSTRAINT check_subscription_tier ON profiles IS 'Subscription tier must be free, pro, or elite';
COMMENT ON CONSTRAINT check_practice_counts_positive ON user_progress IS 'Practice counts cannot be negative';
COMMENT ON CONSTRAINT check_band_scores_valid ON user_progress IS 'Band scores must be in IELTS range 0-9';
COMMENT ON CONSTRAINT check_listening_score_valid ON listening_submissions IS 'Listening scores range from 0-40';
