-- Add Foreign Key Constraints Migration
-- Ensures referential integrity across tables

-- Add FK for user_progress.user_id
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'fk_user_progress_user_id'
  ) THEN
    ALTER TABLE user_progress
    ADD CONSTRAINT fk_user_progress_user_id
      FOREIGN KEY (user_id)
      REFERENCES auth.users(id)
      ON DELETE CASCADE;
  END IF;
END $$;

-- Add FK for admin_logs.admin_id
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'fk_admin_logs_admin_id'
  ) THEN
    ALTER TABLE admin_logs
    ADD CONSTRAINT fk_admin_logs_admin_id
      FOREIGN KEY (admin_id)
      REFERENCES auth.users(id)
      ON DELETE SET NULL;
  END IF;
END $$;

-- Add FK for admin_logs.target_user_id
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'fk_admin_logs_target_user_id'
  ) THEN
    ALTER TABLE admin_logs
    ADD CONSTRAINT fk_admin_logs_target_user_id
      FOREIGN KEY (target_user_id)
      REFERENCES auth.users(id)
      ON DELETE SET NULL;
  END IF;
END $$;

-- Add FK for payment_verifications.user_id (if not exists)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'fk_payment_verifications_user_id'
  ) THEN
    ALTER TABLE payment_verifications
    ADD CONSTRAINT fk_payment_verifications_user_id
      FOREIGN KEY (user_id)
      REFERENCES auth.users(id)
      ON DELETE CASCADE;
  END IF;
END $$;

-- Add FK for practice_submissions.user_id
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'fk_practice_submissions_user_id'
  ) THEN
    ALTER TABLE practice_submissions
    ADD CONSTRAINT fk_practice_submissions_user_id
      FOREIGN KEY (user_id)
      REFERENCES auth.users(id)
      ON DELETE CASCADE;
  END IF;
END $$;

-- Add FK for listening_submissions.user_id
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'fk_listening_submissions_user_id'
  ) THEN
    ALTER TABLE listening_submissions
    ADD CONSTRAINT fk_listening_submissions_user_id
      FOREIGN KEY (user_id)
      REFERENCES auth.users(id)
      ON DELETE CASCADE;
  END IF;
END $$;

COMMENT ON CONSTRAINT fk_user_progress_user_id ON user_progress IS 'Cascade delete user progress when user is deleted';
COMMENT ON CONSTRAINT fk_admin_logs_admin_id ON admin_logs IS 'Nullify admin_id when admin user is deleted';
COMMENT ON CONSTRAINT fk_payment_verifications_user_id ON payment_verifications IS 'Cascade delete payment records when user is deleted';
