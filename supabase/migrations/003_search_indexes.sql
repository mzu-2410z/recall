-- =============================================================================
-- Migration 003: Indexes & Full-Text Search
-- =============================================================================

-- ── MEETINGS ─────────────────────────────────────────────────────────────────
create index if not exists meetings_user_id_idx on meetings(user_id);
create index if not exists meetings_status_idx on meetings(status);
create index if not exists meetings_source_idx on meetings(source);
create index if not exists meetings_started_at_idx on meetings(started_at desc nulls last);
create index if not exists meetings_created_at_idx on meetings(created_at desc);
create index if not exists meetings_google_meet_id_idx on meetings(google_meet_id) where google_meet_id is not null;
create index if not exists meetings_calendar_event_id_idx on meetings(calendar_event_id) where calendar_event_id is not null;

-- Full-text search on meetings
create index if not exists meetings_search_idx on meetings using gin(search_vector);

-- Function to update search vector
create or replace function update_meeting_search_vector()
returns trigger language plpgsql as $$
begin
  new.search_vector :=
    setweight(to_tsvector('english', coalesce(new.title, '')), 'A');
  return new;
end;
$$;

create trigger meetings_search_vector_update
  before insert or update of title on meetings
  for each row execute function update_meeting_search_vector();

-- ── TRANSCRIPT SEGMENTS ───────────────────────────────────────────────────────
create index if not exists transcripts_meeting_id_idx on transcript_segments(meeting_id);
create index if not exists transcripts_user_id_idx on transcript_segments(user_id);
create index if not exists transcripts_sequence_idx on transcript_segments(meeting_id, sequence_num);

-- Full-text search on transcripts
create index if not exists transcripts_text_idx on transcript_segments
  using gin(to_tsvector('english', coalesce(text, '')));

-- ── MEETING SUMMARIES ─────────────────────────────────────────────────────────
create index if not exists summaries_meeting_id_idx on meeting_summaries(meeting_id);
create index if not exists summaries_user_id_idx on meeting_summaries(user_id);
create index if not exists summaries_template_idx on meeting_summaries(meeting_id, template);

-- Full-text search on summaries
create index if not exists summaries_text_idx on meeting_summaries
  using gin(to_tsvector('english', coalesce(summary, '')));

-- ── ACTION ITEMS ──────────────────────────────────────────────────────────────
create index if not exists actions_meeting_id_idx on action_items(meeting_id);
create index if not exists actions_user_id_idx on action_items(user_id);
create index if not exists actions_completed_idx on action_items(user_id, completed);

-- ── HIGHLIGHTS ────────────────────────────────────────────────────────────────
create index if not exists highlights_meeting_id_idx on highlights(meeting_id);

-- ── SHARED CLIPS ──────────────────────────────────────────────────────────────
create index if not exists clips_share_token_idx on shared_clips(share_token);
create index if not exists clips_meeting_id_idx on shared_clips(meeting_id);

-- ── CALENDAR EVENTS ───────────────────────────────────────────────────────────
create index if not exists calendar_user_start_idx on calendar_events(user_id, start_time);
create index if not exists calendar_google_event_idx on calendar_events(user_id, google_event_id);

-- =============================================================================
-- FULL-TEXT SEARCH FUNCTION
-- Used by /api/search to search across all content
-- =============================================================================
create or replace function search_meetings(
  p_user_id  uuid,
  p_query    text,
  p_limit    int default 20,
  p_offset   int default 0
)
returns table (
  meeting_id      uuid,
  title           text,
  source          text,
  started_at      timestamptz,
  snippet         text,
  match_type      text,
  rank            float4
)
language sql stable as $$
  -- Match meeting title
  select
    m.id as meeting_id,
    m.title,
    m.source,
    m.started_at,
    left(m.title, 200) as snippet,
    'title' as match_type,
    ts_rank(m.search_vector, websearch_to_tsquery('english', p_query)) as rank
  from meetings m
  where m.user_id = p_user_id
    and m.status = 'complete'
    and m.search_vector @@ websearch_to_tsquery('english', p_query)

  union all

  -- Match transcript text
  select distinct on (ts.meeting_id)
    ts.meeting_id,
    m.title,
    m.source,
    m.started_at,
    left(ts.text, 300) as snippet,
    'transcript' as match_type,
    ts_rank(
      to_tsvector('english', coalesce(ts.text, '')),
      websearch_to_tsquery('english', p_query)
    ) as rank
  from transcript_segments ts
  join meetings m on m.id = ts.meeting_id
  where ts.user_id = p_user_id
    and to_tsvector('english', coalesce(ts.text, '')) @@
        websearch_to_tsquery('english', p_query)

  union all

  -- Match summary text
  select
    ms.meeting_id,
    m.title,
    m.source,
    m.started_at,
    left(ms.summary, 300) as snippet,
    'summary' as match_type,
    ts_rank(
      to_tsvector('english', coalesce(ms.summary, '')),
      websearch_to_tsquery('english', p_query)
    ) as rank
  from meeting_summaries ms
  join meetings m on m.id = ms.meeting_id
  where ms.user_id = p_user_id
    and to_tsvector('english', coalesce(ms.summary, '')) @@
        websearch_to_tsquery('english', p_query)

  order by rank desc
  limit p_limit offset p_offset;
$$;
