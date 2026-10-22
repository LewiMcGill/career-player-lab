create table if not exists public.career_player_lab_state (
 id text primary key, state jsonb not null default '{}'::jsonb, updated_at timestamptz not null default now()
);
alter table public.career_player_lab_state enable row level security;
drop policy if exists "career player lab public read" on public.career_player_lab_state;
drop policy if exists "career player lab public insert" on public.career_player_lab_state;
drop policy if exists "career player lab public update" on public.career_player_lab_state;
create policy "career player lab public read" on public.career_player_lab_state for select to anon, authenticated using (true);
create policy "career player lab public insert" on public.career_player_lab_state for insert to anon, authenticated with check (true);
create policy "career player lab public update" on public.career_player_lab_state for update to anon, authenticated using (true) with check (true);
