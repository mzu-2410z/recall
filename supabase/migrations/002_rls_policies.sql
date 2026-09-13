-- =============================================================================
-- Migration 002: Row Level Security Policies
-- =============================================================================

-- ── PROFILES ─────────────────────────────────────────────────────────────────
alter table profiles enable row level security;

-- Users can only read/update their own profile
create policy "profiles_select_own"
  on profiles for select
  using (auth.uid() = id);

create policy "profiles_update_own"
  on profiles for update
  using (auth.uid() = id);

-- Service role bypasses RLS (for token storage)
-- No additional policy needed; service_role bypasses RLS by default

-- ── MEETINGS ─────────────────────────────────────────────────────────────────
alter table meetings enable row level security;

create policy "meetings_select_own"
  on meetings for select
  using (auth.uid() = user_id);

create policy "meetings_insert_own"
  on meetings for insert
  with check (auth.uid() = user_id);

create policy "meetings_update_own"
  on meetings for update
  using (auth.uid() = user_id);

create policy "meetings_delete_own"
  on meetings for delete
  using (auth.uid() = user_id);

-- ── TRANSCRIPT SEGMENTS ───────────────────────────────────────────────────────
alter table transcript_segments enable row level security;

create policy "transcripts_select_own"
  on transcript_segments for select
  using (auth.uid() = user_id);

create policy "transcripts_insert_own"
  on transcript_segments for insert
  with check (auth.uid() = user_id);

create policy "transcripts_delete_own"
  on transcript_segments for delete
  using (auth.uid() = user_id);

-- ── MEETING SUMMARIES ─────────────────────────────────────────────────────────
alter table meeting_summaries enable row level security;

create policy "summaries_select_own"
  on meeting_summaries for select
  using (auth.uid() = user_id);

create policy "summaries_insert_own"
  on meeting_summaries for insert
  with check (auth.uid() = user_id);

create policy "summaries_update_own"
  on meeting_summaries for update
  using (auth.uid() = user_id);

create policy "summaries_delete_own"
  on meeting_summaries for delete
  using (auth.uid() = user_id);

-- ── ACTION ITEMS ──────────────────────────────────────────────────────────────
alter table action_items enable row level security;

create policy "actions_select_own"
  on action_items for select
  using (auth.uid() = user_id);

create policy "actions_insert_own"
  on action_items for insert
  with check (auth.uid() = user_id);

create policy "actions_update_own"
  on action_items for update
  using (auth.uid() = user_id);

create policy "actions_delete_own"
  on action_items for delete
  using (auth.uid() = user_id);

-- ── HIGHLIGHTS ────────────────────────────────────────────────────────────────
alter table highlights enable row level security;

create policy "highlights_select_own"
  on highlights for select
  using (auth.uid() = user_id);

create policy "highlights_insert_own"
  on highlights for insert
  with check (auth.uid() = user_id);

create policy "highlights_delete_own"
  on highlights for delete
  using (auth.uid() = user_id);

-- ── SHARED CLIPS ──────────────────────────────────────────────────────────────
alter table shared_clips enable row level security;

-- Owner can do everything
create policy "clips_select_own"
  on shared_clips for select
  using (auth.uid() = created_by);

create policy "clips_insert_own"
  on shared_clips for insert
  with check (auth.uid() = created_by);

create policy "clips_delete_own"
  on shared_clips for delete
  using (auth.uid() = created_by);

-- Public can read by share_token (no auth required — for share page)
create policy "clips_select_public_by_token"
  on shared_clips for select
  using (true);
-- Note: The share page route handler uses service_role to look up by token
-- and does NOT expose the meeting recording URL without additional auth check

-- ── CALENDAR EVENTS ───────────────────────────────────────────────────────────
alter table calendar_events enable row level security;

create policy "calendar_select_own"
  on calendar_events for select
  using (auth.uid() = user_id);

create policy "calendar_insert_own"
  on calendar_events for insert
  with check (auth.uid() = user_id);

create policy "calendar_update_own"
  on calendar_events for update
  using (auth.uid() = user_id);

create policy "calendar_delete_own"
  on calendar_events for delete
  using (auth.uid() = user_id);
