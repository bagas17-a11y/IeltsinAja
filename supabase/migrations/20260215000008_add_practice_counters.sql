-- Add Practice Counters for Optimized Feature Gating
-- Reduces query complexity by tracking counts directly in profiles table

-- Add counter columns to profiles if they don't exist
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS reading_practice_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS listening_practice_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS writing_practice_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS speaking_practice_count INTEGER DEFAULT 0;

-- Add constraints to ensure non-negative counts
ALTER TABLE profiles
DROP CONSTRAINT IF EXISTS check_practice_counters_positive;

ALTER TABLE profiles
ADD CONSTRAINT check_practice_counters_positive
  CHECK (
    reading_practice_count >= 0 AND
    listening_practice_count >= 0 AND
    writing_practice_count >= 0 AND
    speaking_practice_count >= 0
  );

-- Backfill existing counts from submissions
-- Reading: Count from user_progress where exam_type matches reading patterns
UPDATE profiles p
SET reading_practice_count = COALESCE((
  SELECT COUNT(*)
  FROM user_progress
  WHERE user_id = p.id
    AND (exam_type ILIKE '%reading%' OR exam_type = 'reading')
), 0)
WHERE reading_practice_count = 0;

-- Listening: Count from listening_submissions
UPDATE profiles p
SET listening_practice_count = COALESCE((
  SELECT COUNT(*)
  FROM listening_submissions
  WHERE user_id = p.id
), 0)
WHERE listening_practice_count = 0;

-- Writing: Count from practice_submissions where module_type is writing
UPDATE profiles p
SET writing_practice_count = COALESCE((
  SELECT COUNT(*)
  FROM practice_submissions
  WHERE user_id = p.id
    AND module_type = 'writing'
), 0)
WHERE writing_practice_count = 0;

-- Speaking: Count from practice_submissions where module_type is speaking
UPDATE profiles p
SET speaking_practice_count = COALESCE((
  SELECT COUNT(*)
  FROM practice_submissions
  WHERE user_id = p.id
    AND module_type = 'speaking'
), 0)
WHERE speaking_practice_count = 0;

-- Create function to increment practice counter
CREATE OR REPLACE FUNCTION increment_practice_counter(
  _user_id UUID,
  _module_type TEXT
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  CASE _module_type
    WHEN 'reading' THEN
      UPDATE profiles
      SET reading_practice_count = reading_practice_count + 1
      WHERE id = _user_id;
    WHEN 'listening' THEN
      UPDATE profiles
      SET listening_practice_count = listening_practice_count + 1
      WHERE id = _user_id;
    WHEN 'writing' THEN
      UPDATE profiles
      SET writing_practice_count = writing_practice_count + 1
      WHERE id = _user_id;
    WHEN 'speaking' THEN
      UPDATE profiles
      SET speaking_practice_count = speaking_practice_count + 1
      WHERE id = _user_id;
    ELSE
      RAISE EXCEPTION 'Invalid module type: %', _module_type;
  END CASE;
END;
$$;

-- Create trigger function for automatic counter updates
CREATE OR REPLACE FUNCTION auto_increment_practice_count()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  -- For practice_submissions table
  IF TG_TABLE_NAME = 'practice_submissions' THEN
    PERFORM increment_practice_counter(NEW.user_id, NEW.module_type);
  END IF;

  -- For listening_submissions table
  IF TG_TABLE_NAME = 'listening_submissions' THEN
    PERFORM increment_practice_counter(NEW.user_id, 'listening');
  END IF;

  -- For user_progress table (reading)
  IF TG_TABLE_NAME = 'user_progress' AND (NEW.exam_type ILIKE '%reading%' OR NEW.exam_type = 'reading') THEN
    PERFORM increment_practice_counter(NEW.user_id, 'reading');
  END IF;

  RETURN NEW;
END;
$$;

-- Create triggers for automatic counting
DROP TRIGGER IF EXISTS trigger_increment_practice_submissions ON practice_submissions;
CREATE TRIGGER trigger_increment_practice_submissions
  AFTER INSERT ON practice_submissions
  FOR EACH ROW
  EXECUTE FUNCTION auto_increment_practice_count();

DROP TRIGGER IF EXISTS trigger_increment_listening_submissions ON listening_submissions;
CREATE TRIGGER trigger_increment_listening_submissions
  AFTER INSERT ON listening_submissions
  FOR EACH ROW
  EXECUTE FUNCTION auto_increment_practice_count();

DROP TRIGGER IF EXISTS trigger_increment_user_progress ON user_progress;
CREATE TRIGGER trigger_increment_user_progress
  AFTER INSERT ON user_progress
  FOR EACH ROW
  EXECUTE FUNCTION auto_increment_practice_count();

-- Create index for fast counter lookups
CREATE INDEX IF NOT EXISTS idx_profiles_practice_counts
  ON profiles(user_id, reading_practice_count, listening_practice_count, writing_practice_count, speaking_practice_count);

COMMENT ON COLUMN profiles.reading_practice_count IS 'Cached count of reading practices for fast feature gating';
COMMENT ON COLUMN profiles.listening_practice_count IS 'Cached count of listening practices for fast feature gating';
COMMENT ON COLUMN profiles.writing_practice_count IS 'Cached count of writing practices for fast feature gating';
COMMENT ON COLUMN profiles.speaking_practice_count IS 'Cached count of speaking practices for fast feature gating';
COMMENT ON FUNCTION increment_practice_counter IS 'Increments practice counter for a specific module type';
COMMENT ON FUNCTION auto_increment_practice_count IS 'Trigger function to auto-increment practice counters';

-- Add constraint to ensure practice counts cannot be negative
ALTER TABLE profiles
DROP CONSTRAINT IF EXISTS check_practice_counts_positive;

ALTER TABLE profiles
ADD CONSTRAINT check_practice_counts_positive
  CHECK (
    (reading_practice_count IS NULL OR reading_practice_count >= 0) AND
    (listening_practice_count IS NULL OR listening_practice_count >= 0) AND
    (writing_practice_count IS NULL OR writing_practice_count >= 0) AND
    (speaking_practice_count IS NULL OR speaking_practice_count >= 0)
  );

COMMENT ON CONSTRAINT check_practice_counts_positive ON profiles IS 'Practice counts cannot be negative';
