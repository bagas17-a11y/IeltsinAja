-- Track which questions/tests each user has completed, per module.
-- Replaces localStorage-only tracking so progress persists across devices and sessions.

CREATE TABLE IF NOT EXISTS public.user_completed_questions (
  id           UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      UUID        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  module       TEXT        NOT NULL CHECK (module IN ('reading', 'writing', 'listening', 'speaking')),
  question_id  TEXT        NOT NULL,
  completed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (user_id, module, question_id)
);

CREATE INDEX IF NOT EXISTS idx_ucq_user_module
  ON public.user_completed_questions (user_id, module);

ALTER TABLE public.user_completed_questions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "users_select_own_completions"
  ON public.user_completed_questions
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "users_insert_own_completions"
  ON public.user_completed_questions
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

COMMENT ON TABLE public.user_completed_questions IS
  'Source of truth for done/not-done UI state per user per module. question_id is a UUID for reading/writing/listening, or "part1-TopicName" for speaking.';
