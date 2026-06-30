-- The study_group_members SELECT policy was self-referential:
--   "group_id IN (SELECT group_id FROM study_group_members WHERE user_id = auth.uid())"
-- That subquery hits the same table → triggers the same policy → infinite recursion.
--
-- Fix: use a SECURITY DEFINER function to fetch the current user's group IDs.
-- SECURITY DEFINER runs as the function owner (postgres), bypassing RLS on the
-- inner query and breaking the recursion.

CREATE OR REPLACE FUNCTION public.my_group_ids()
RETURNS SETOF UUID
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
  SELECT group_id FROM public.study_group_members WHERE user_id = auth.uid();
$$;

-- Re-create study_groups SELECT policy using the helper
DROP POLICY IF EXISTS "Members can view their groups" ON public.study_groups;
CREATE POLICY "Members can view their groups" ON public.study_groups
  FOR SELECT USING (
    id IN (SELECT public.my_group_ids())
    OR created_by = auth.uid()
  );

-- Re-create study_group_members SELECT policy using the helper (no longer recursive)
DROP POLICY IF EXISTS "Members can view membership" ON public.study_group_members;
CREATE POLICY "Members can view membership" ON public.study_group_members
  FOR SELECT USING (
    group_id IN (SELECT public.my_group_ids())
  );
