-- Admins need to read all rows on three tables to power the Student Progress page.
-- Each table currently only has USING (auth.uid() = user_id), so admins see only
-- their own row. Adding a separate admin SELECT policy fixes this without touching
-- the existing user policies.

-- profiles
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
CREATE POLICY "Admins can view all profiles"
  ON public.profiles FOR SELECT
  USING (has_role(auth.uid(), 'admin'::app_role));

-- user_progress
DROP POLICY IF EXISTS "Admins can view all progress" ON public.user_progress;
CREATE POLICY "Admins can view all progress"
  ON public.user_progress FOR SELECT
  USING (has_role(auth.uid(), 'admin'::app_role));

-- user_completed_questions
DROP POLICY IF EXISTS "Admins can view all completed questions" ON public.user_completed_questions;
CREATE POLICY "Admins can view all completed questions"
  ON public.user_completed_questions FOR SELECT
  USING (has_role(auth.uid(), 'admin'::app_role));
