-- Create diagnostic_results table to store per-user IELTS diagnostic quiz results
create table if not exists public.diagnostic_results (
  id              uuid        default gen_random_uuid() primary key,
  user_id         uuid        references public.profiles(id) on delete cascade not null,
  taken_at        timestamptz default now() not null,
  overall_band    numeric(3,1) not null,
  reading_band    numeric(3,1),
  reading_score   integer,
  listening_band  numeric(3,1),
  listening_score integer,
  writing_band    numeric(3,1),
  writing_t1_band numeric(3,1),
  writing_t2_band numeric(3,1),
  writing_t1_feedback text,
  writing_t2_feedback text,
  speaking_band   numeric(3,1),
  speaking_feedback text,
  reading_answers    jsonb,
  task1_text         text,
  task2_text         text,
  speaking_transcripts jsonb
);

alter table public.diagnostic_results enable row level security;

create policy "Users can insert their own diagnostic results"
  on public.diagnostic_results for insert
  to authenticated
  with check (auth.uid() = user_id);

create policy "Users can view their own diagnostic results"
  on public.diagnostic_results for select
  to authenticated
  using (auth.uid() = user_id);

-- Admins can read all results
create policy "Admins can view all diagnostic results"
  on public.diagnostic_results for select
  to authenticated
  using (has_role(auth.uid(), 'admin'::app_role));
