CREATE TABLE IF NOT EXISTS public.study_groups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  created_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  join_code TEXT NOT NULL UNIQUE,
  exam_target_date DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.study_group_members (
  group_id UUID NOT NULL REFERENCES public.study_groups(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  joined_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (group_id, user_id)
);

-- RLS
ALTER TABLE public.study_groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.study_group_members ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Members can view their groups" ON public.study_groups;
CREATE POLICY "Members can view their groups" ON public.study_groups
  FOR SELECT USING (
    id IN (SELECT group_id FROM public.study_group_members WHERE user_id = auth.uid())
    OR created_by = auth.uid()
  );

DROP POLICY IF EXISTS "Users can create groups" ON public.study_groups;
CREATE POLICY "Users can create groups" ON public.study_groups
  FOR INSERT WITH CHECK (created_by = auth.uid());

DROP POLICY IF EXISTS "Members can view membership" ON public.study_group_members;
CREATE POLICY "Members can view membership" ON public.study_group_members
  FOR SELECT USING (
    group_id IN (SELECT group_id FROM public.study_group_members WHERE user_id = auth.uid())
  );

DROP POLICY IF EXISTS "Users can join groups" ON public.study_group_members;
CREATE POLICY "Users can join groups" ON public.study_group_members
  FOR INSERT WITH CHECK (user_id = auth.uid());

-- Helper function to generate a random 6-char uppercase join code
CREATE OR REPLACE FUNCTION public.generate_join_code()
RETURNS TEXT LANGUAGE sql AS $$
  SELECT upper(substr(md5(random()::text), 1, 6));
$$;
