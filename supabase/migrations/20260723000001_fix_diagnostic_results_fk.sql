-- diagnostic_results.user_id was pointed at public.profiles(id), but
-- profiles.id is an independent gen_random_uuid() PK, NOT the auth user id.
-- The app always inserts auth.users.id (from useAuth()), so every insert
-- violated this FK and was silently swallowed by the frontend's try/catch,
-- leaving the table permanently empty. Repoint at auth.users(id), matching
-- every other user-scoped table in this schema (rate_limits, ai_usage_log,
-- mentor_assignments, etc).
alter table public.diagnostic_results
  drop constraint diagnostic_results_user_id_fkey;

alter table public.diagnostic_results
  add constraint diagnostic_results_user_id_fkey
  foreign key (user_id) references auth.users(id) on delete cascade;
