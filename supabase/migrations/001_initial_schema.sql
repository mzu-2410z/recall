-- =============================================================================
-- Migration 001: Initial Schema
-- Run: supabase db push  OR  paste into Supabase SQL editor
-- =============================================================================

-- Enable required extensions
create extension if not exists "uuid-ossp";
create extension if not exists "pgcrypto";
create extension if not exists "unaccent";
create extension if not exists "pg_trgm";

-- =============================================================================
-- PROFILES (augments auth.users)
-- =============================================================================
create table if not exists profiles (
  id                   uuid references auth.users on delete cascade primary key,
  email                text not null,
  full_name            text,
  avatar_url           text,
  -- Google tokens (server-side only — never exposed to browser via RLS)
  google_access_token  text,
  google_refresh_token text,
  google_token_expiry  timestamptz,
  google_scopes        text[],
  created_at           timestamptz default now() not null,
  updated_at           timestamptz default now() not null
);

-- =============================================================================
-- MEETINGS
-- =============================================================================
create table if not exists meetings (
  id                    uuid primary key default gen_random_uuid(),
  user_id               uuid references profiles(id) on delete cascade not null,
  title                 text not null,
  source                text not null check (source in ('google_meet','browser','youtube','imported')),
  status                text not null default 'pending'
                          check (status in ('pending','recording','uploading','transcribing','analyzing','complete','failed')),
  started_at            timestamptz,
  ended_at              timestamptz,
  duration_seconds      integer,
  participant_count     integer default 1,
  participants          jsonb default '[]'::jsonb,
  -- Google Meet specific
  google_meet_id        text,       -- spaces/xxx
  google_conference_id  text,       -- conferenceRecords/xxx
  calendar_event_id     text,
  -- Storage
  recording_path        text,       -- Supabase storage path
  -- YouTube specific
  youtube_url           text,
  youtube_video_id      text,
  -- Processing
  processing_error      text,
  -- Metadata for full-text search
  search_vector         tsvector,
  created_at            timestamptz default now() not null,
  updated_at            timestamptz default now() not null
);

-- =============================================================================
-- TRANSCRIPT SEGMENTS
-- =============================================================================
create table if not exists transcript_segments (
  id            uuid primary key default gen_random_uuid(),
  meeting_id    uuid references meetings(id) on delete cascade not null,
  user_id       uuid references profiles(id) on delete cascade not null,
  speaker       text,
  text          text not null,
  start_time_ms integer,
  end_time_ms   integer,
  sequence_num  integer,
  created_at    timestamptz default now() not null
);

-- =============================================================================
-- MEETING SUMMARIES (one per meeting per template)
-- =============================================================================
create table if not exists meeting_summaries (
  id                uuid primary key default gen_random_uuid(),
  meeting_id        uuid references meetings(id) on delete cascade not null,
  user_id           uuid references profiles(id) on delete cascade not null,
  template          text not null default 'general'
                      check (template in ('general','project_update','interview','concise')),
  summary           text,
  key_takeaways     jsonb default '[]'::jsonb,
  decisions         jsonb default '[]'::jsonb,
  action_items      jsonb default '[]'::jsonb,
  topics            jsonb default '[]'::jsonb,
  important_moments jsonb default '[]'::jsonb,
  raw_ai_response   jsonb,
  generated_at      timestamptz default now() not null,
  unique(meeting_id, template)
);

-- =============================================================================
-- ACTION ITEMS (denormalized for fast queries)
-- =============================================================================
create table if not exists action_items (
  id          uuid primary key default gen_random_uuid(),
  meeting_id  uuid references meetings(id) on delete cascade not null,
  user_id     uuid references profiles(id) on delete cascade not null,
  task        text not null,
  owner       text,
  deadline    date,
  completed   boolean default false,
  created_at  timestamptz default now() not null,
  updated_at  timestamptz default now() not null
);

-- =============================================================================
-- HIGHLIGHTS / BOOKMARKS
-- =============================================================================
create table if not exists highlights (
  id           uuid primary key default gen_random_uuid(),
  meeting_id   uuid references meetings(id) on delete cascade not null,
  user_id      uuid references profiles(id) on delete cascade not null,
  timestamp_ms integer not null,
  label        text,
  note         text,
  created_at   timestamptz default now() not null
);

-- =============================================================================
-- SHARED CLIPS
-- =============================================================================
create table if not exists shared_clips (
  id          uuid primary key default gen_random_uuid(),
  meeting_id  uuid references meetings(id) on delete cascade not null,
  created_by  uuid references profiles(id) on delete cascade not null,
  share_token text unique not null default encode(gen_random_bytes(16), 'hex'),
  start_ms    integer not null,
  end_ms      integer not null,
  label       text,
  expires_at  timestamptz,
  view_count  integer default 0,
  created_at  timestamptz default now() not null
);

-- =============================================================================
-- CALENDAR EVENTS (cache)
-- =============================================================================
create table if not exists calendar_events (
  id               uuid primary key default gen_random_uuid(),
  user_id          uuid references profiles(id) on delete cascade not null,
  google_event_id  text not null,
  title            text not null,
  start_time       timestamptz not null,
  end_time         timestamptz not null,
  attendees        jsonb default '[]'::jsonb,
  meet_link        text,
  meet_space_id    text,
  is_google_meet   boolean default false,
  raw_event        jsonb,
  cached_at        timestamptz default now() not null,
  unique(user_id, google_event_id)
);

-- =============================================================================
-- AUTO-UPDATE updated_at
-- =============================================================================
create or replace function update_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_updated_at
  before update on profiles
  for each row execute function update_updated_at();

create trigger meetings_updated_at
  before update on meetings
  for each row execute function update_updated_at();

create trigger action_items_updated_at
  before update on action_items
  for each row execute function update_updated_at();

-- =============================================================================
-- AUTO-CREATE PROFILE ON SIGN-UP
-- =============================================================================
create or replace function handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into profiles (id, email, full_name, avatar_url)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name'),
    new.raw_user_meta_data->>'avatar_url'
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_user();
