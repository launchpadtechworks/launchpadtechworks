-- Run this once in Supabase: SQL Editor -> New query -> paste -> Run.
-- Students must be assigned by an admin. Never put a service_role key in the website.

create table if not exists public.student_profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  assigned_domain text not null check (assigned_domain in ('artificial_intelligence', 'data_science', 'aiml', 'python')),
  start_date date not null default current_date,
  created_at timestamptz not null default now()
);

create table if not exists public.course_modules (
  id uuid primary key default gen_random_uuid(),
  domain text not null check (domain in ('artificial_intelligence', 'data_science', 'aiml', 'python')),
  day_number smallint not null check (day_number between 1 and 13),
  title text not null,
  description text not null default '',
  note_path text,
  video_path text,
  quiz_questions jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(),
  unique (domain, day_number)
);

-- Answers are deliberately separate: students can never read this table.
create table if not exists public.quiz_answer_keys (
  module_id uuid primary key references public.course_modules(id) on delete cascade,
  answers jsonb not null default '{}'::jsonb
);

create table if not exists public.lesson_progress (
  user_id uuid not null references auth.users(id) on delete cascade,
  module_id uuid not null references public.course_modules(id) on delete cascade,
  notes_completed_at timestamptz,
  quiz_completed_at timestamptz,
  quiz_score integer check (quiz_score >= 0),
  primary key (user_id, module_id)
);

create index if not exists course_modules_domain_day_idx on public.course_modules(domain, day_number);
create index if not exists lesson_progress_user_idx on public.lesson_progress(user_id);

alter table public.student_profiles enable row level security;
alter table public.course_modules enable row level security;
alter table public.quiz_answer_keys enable row level security;
alter table public.lesson_progress enable row level security;

drop policy if exists "Students read only their profile" on public.student_profiles;
create policy "Students read only their profile" on public.student_profiles for select to authenticated
using ((select auth.uid()) = id);

drop policy if exists "Students read only assigned domain modules" on public.course_modules;
create policy "Students read only assigned domain modules" on public.course_modules for select to authenticated
using (exists (select 1 from public.student_profiles p where p.id = (select auth.uid()) and p.assigned_domain = course_modules.domain));

drop policy if exists "Students read own progress" on public.lesson_progress;
create policy "Students read own progress" on public.lesson_progress for select to authenticated
using ((select auth.uid()) = user_id);

drop policy if exists "Students mark notes only in assigned domain" on public.lesson_progress;
create policy "Students mark notes only in assigned domain" on public.lesson_progress for insert to authenticated
with check (
  (select auth.uid()) = user_id and exists (
    select 1 from public.course_modules m join public.student_profiles p on p.id = (select auth.uid())
    where m.id = lesson_progress.module_id and m.domain = p.assigned_domain
  )
);

drop policy if exists "Students update own progress only" on public.lesson_progress;
create policy "Students update own progress only" on public.lesson_progress for update to authenticated
using ((select auth.uid()) = user_id)
with check (
  (select auth.uid()) = user_id and exists (
    select 1 from public.course_modules m join public.student_profiles p on p.id = (select auth.uid())
    where m.id = lesson_progress.module_id and m.domain = p.assigned_domain
  )
);

-- A student may mark notes complete, but cannot forge a quiz result from browser tools.
create or replace function public.guard_lesson_progress()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.user_id <> auth.uid() then raise exception 'Progress access denied'; end if;
  if tg_op = 'UPDATE' and (new.user_id <> old.user_id or new.module_id <> old.module_id) then
    raise exception 'Progress record cannot be moved';
  end if;
  if (tg_op = 'INSERT' and (new.quiz_completed_at is not null or new.quiz_score is not null))
    or (tg_op = 'UPDATE' and (new.quiz_completed_at is distinct from old.quiz_completed_at or new.quiz_score is distinct from old.quiz_score)) then
    if current_setting('launchpad.quiz_submit', true) is distinct from 'true' then
      raise exception 'Quiz results must be submitted through the secure quiz check';
    end if;
  end if;
  return new;
end;
$$;

drop trigger if exists protect_lesson_progress on public.lesson_progress;
create trigger protect_lesson_progress before insert or update on public.lesson_progress
for each row execute function public.guard_lesson_progress();

-- Private storage: put files under domain/day, e.g. python/day-01/notes.pdf.
insert into storage.buckets (id, name, public) values ('course-content', 'course-content', false)
on conflict (id) do update set public = false;

drop policy if exists "Students read private files from their domain" on storage.objects;
create policy "Students read private files from their domain" on storage.objects for select to authenticated
using (
  bucket_id = 'course-content' and exists (
    select 1 from public.course_modules m join public.student_profiles p on p.id = (select auth.uid())
    where m.domain = p.assigned_domain
      and (m.note_path = storage.objects.name or m.video_path = storage.objects.name)
      and current_date >= p.start_date + (m.day_number - 1)
  )
);

-- Grades are checked server-side; correct answers never reach the browser.
create or replace function public.submit_lesson_quiz(p_module_id uuid, p_answers jsonb)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  answer_key jsonb;
  score integer;
  total integer;
begin
  if auth.uid() is null then raise exception 'Not authenticated'; end if;
  if not exists (
    select 1 from public.course_modules m join public.student_profiles p on p.id = auth.uid()
    where m.id = p_module_id and m.domain = p.assigned_domain
  ) then raise exception 'Course access denied'; end if;
  if not exists (
    select 1 from public.lesson_progress where user_id = auth.uid() and module_id = p_module_id and notes_completed_at is not null
  ) then raise exception 'Complete the notes before taking the quiz'; end if;
  select answers into answer_key from public.quiz_answer_keys where module_id = p_module_id;
  total := coalesce(jsonb_object_length(answer_key), 0);
  select count(*) into score from jsonb_each_text(coalesce(answer_key, '{}'::jsonb)) key
    where (p_answers ->> key.key)::integer = key.value::integer;
  perform set_config('launchpad.quiz_submit', 'true', true);
  insert into public.lesson_progress (user_id, module_id, notes_completed_at, quiz_completed_at, quiz_score)
  values (auth.uid(), p_module_id, now(), now(), score)
  on conflict (user_id, module_id) do update set quiz_completed_at = excluded.quiz_completed_at, quiz_score = excluded.quiz_score;
  return jsonb_build_object('score', score, 'total', total);
end;
$$;

revoke all on function public.submit_lesson_quiz(uuid, jsonb) from public;
grant execute on function public.submit_lesson_quiz(uuid, jsonb) to authenticated;

-- Admin examples (run from the SQL Editor after creating/inviting a user):
-- insert into public.student_profiles (id, assigned_domain, start_date)
-- values ('PASTE-USER-UUID', 'python', '2026-08-01');
--
-- After uploading python/day-01/notes.pdf, attach it to Day 1:
-- update public.course_modules set note_path = 'python/day-01/notes.pdf' where domain = 'python' and day_number = 1;
