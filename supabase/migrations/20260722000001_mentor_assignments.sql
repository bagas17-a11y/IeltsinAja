-- Mentor profiles (currently the 4 admins who also act as human coaches)
-- and a 1-mentor-per-student assignment table, so a student's Consultation
-- Hub can show their specific mentor's profile and WhatsApp number instead
-- of a generic hardcoded coach.
create table public.mentors (
  user_id uuid primary key references auth.users(id) on delete cascade,
  name text not null,
  title text not null default 'IELTS Coach',
  bio text,
  ielts_score_display text,
  focus_areas text[] not null default '{}',
  whatsapp_number text not null,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- One row per student — reassigning a student just updates their row.
create table public.mentor_assignments (
  student_id uuid primary key references auth.users(id) on delete cascade,
  mentor_user_id uuid not null references public.mentors(user_id) on delete cascade,
  assigned_by uuid references auth.users(id),
  assigned_at timestamptz not null default now()
);

create index idx_mentor_assignments_mentor on public.mentor_assignments(mentor_user_id);

alter table public.mentors enable row level security;
alter table public.mentor_assignments enable row level security;

-- Mentors table: admins manage it fully; any signed-in user can read only
-- the mentor they've actually been assigned to (not browse all 4 profiles
-- / phone numbers freely).
create policy "Admins can manage mentors"
  on public.mentors for all
  using (has_role(auth.uid(), 'admin'::app_role))
  with check (has_role(auth.uid(), 'admin'::app_role));

create policy "Users can view their assigned mentor"
  on public.mentors for select
  using (
    user_id in (
      select mentor_user_id from public.mentor_assignments where student_id = auth.uid()
    )
  );

-- Assignments table: admins manage everything; a student can see their own row.
create policy "Admins can manage mentor assignments"
  on public.mentor_assignments for all
  using (has_role(auth.uid(), 'admin'::app_role))
  with check (has_role(auth.uid(), 'admin'::app_role));

create policy "Users can view their own mentor assignment"
  on public.mentor_assignments for select
  using (student_id = auth.uid());
