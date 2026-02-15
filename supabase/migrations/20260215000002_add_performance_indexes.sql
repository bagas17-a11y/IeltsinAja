-- Add performance indexes for frequently queried tables
-- These indexes improve query performance for common operations

-- Indexes for payment_verifications table
-- Used by admin dashboard to filter payments by status and user
CREATE INDEX IF NOT EXISTS idx_payment_verifications_user_id
  ON payment_verifications(user_id);

CREATE INDEX IF NOT EXISTS idx_payment_verifications_status
  ON payment_verifications(status);

CREATE INDEX IF NOT EXISTS idx_payment_verifications_created_at
  ON payment_verifications(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_payment_verifications_user_status
  ON payment_verifications(user_id, status);

-- Indexes for practice_submissions table
-- Used by user progress tracking and analytics
CREATE INDEX IF NOT EXISTS idx_practice_submissions_user_id
  ON practice_submissions(user_id);

CREATE INDEX IF NOT EXISTS idx_practice_submissions_module_type
  ON practice_submissions(module_type);

CREATE INDEX IF NOT EXISTS idx_practice_submissions_created_at
  ON practice_submissions(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_practice_submissions_user_module
  ON practice_submissions(user_id, module_type);

-- Indexes for listening_submissions table
-- Used by listening practice history
CREATE INDEX IF NOT EXISTS idx_listening_submissions_user_id
  ON listening_submissions(user_id);

CREATE INDEX IF NOT EXISTS idx_listening_submissions_listening_id
  ON listening_submissions(listening_id);

CREATE INDEX IF NOT EXISTS idx_listening_submissions_created_at
  ON listening_submissions(created_at DESC);

-- Indexes for user_progress table
-- Used by dashboard and progress tracking
CREATE INDEX IF NOT EXISTS idx_user_progress_user_id
  ON user_progress(user_id);

CREATE INDEX IF NOT EXISTS idx_user_progress_exam_type
  ON user_progress(exam_type);

CREATE INDEX IF NOT EXISTS idx_user_progress_user_exam
  ON user_progress(user_id, exam_type);

-- Indexes for user_roles table
-- Used by admin authentication checks
CREATE INDEX IF NOT EXISTS idx_user_roles_user_role
  ON user_roles(user_id, role);

CREATE INDEX IF NOT EXISTS idx_user_roles_role
  ON user_roles(role);

-- Indexes for profiles table
-- Used by subscription tier queries and expiration checks
CREATE INDEX IF NOT EXISTS idx_profiles_subscription_tier
  ON profiles(subscription_tier);

CREATE INDEX IF NOT EXISTS idx_profiles_subscription_end_date
  ON profiles(subscription_end_date)
  WHERE subscription_end_date IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_profiles_user_id
  ON profiles(user_id);

-- Indexes for admin_logs table
-- Used by admin activity tracking
CREATE INDEX IF NOT EXISTS idx_admin_logs_admin_id
  ON admin_logs(admin_id);

CREATE INDEX IF NOT EXISTS idx_admin_logs_action_type
  ON admin_logs(action_type);

CREATE INDEX IF NOT EXISTS idx_admin_logs_created_at
  ON admin_logs(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_admin_logs_target_user
  ON admin_logs(target_user_id)
  WHERE target_user_id IS NOT NULL;

-- Add comments for documentation
COMMENT ON INDEX idx_payment_verifications_user_id IS 'Speeds up payment queries by user';
COMMENT ON INDEX idx_practice_submissions_user_module IS 'Composite index for user practice history by module type';
COMMENT ON INDEX idx_user_roles_user_role IS 'Optimizes admin role checks (used by has_role RPC)';
COMMENT ON INDEX idx_profiles_subscription_end_date IS 'Partial index for finding expired subscriptions';
