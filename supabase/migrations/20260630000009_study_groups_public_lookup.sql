-- The existing study_groups SELECT policy only lets members see groups they belong to.
-- This blocks the join-by-code flow: a user who isn't yet a member can't look up the
-- group to join it. Add a policy that lets any authenticated user look up any group
-- (name + join_code are not sensitive; the code itself is the security gate).

DROP POLICY IF EXISTS "Authenticated users can look up any group" ON public.study_groups;
CREATE POLICY "Authenticated users can look up any group"
  ON public.study_groups FOR SELECT
  USING (auth.uid() IS NOT NULL);
