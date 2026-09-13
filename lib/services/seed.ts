import { createClient as createServiceClient } from '@supabase/supabase-js'
import {
  SHOWCASE_MEETING_TITLE,
  SHOWCASE_PARTICIPANTS,
  SHOWCASE_TRANSCRIPT,
} from '@/lib/seeds/showcase-transcript'
import { analyzeMeeting, parseDeadlineDate } from '@/lib/services/ai'

function getAdminSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
  if (!url || !serviceKey) {
    throw new Error('Supabase URL or Service Role Key missing in environment')
  }
  return createServiceClient(url, serviceKey, { auth: { persistSession: false } })
}

export async function runShowcaseSeed(userId: string) {
  console.log(`[Seed Service] Starting showcase seed process for userId: ${userId}`)
  const adminSupabase = getAdminSupabase()

  // 1. Check if showcase meeting already exists for this user to allow clean re-seeding
  const { data: existingMeetings } = await adminSupabase
    .from('meetings')
    .select('id')
    .eq('user_id', userId)
    .eq('title', SHOWCASE_MEETING_TITLE)

  let meetingId: string

  if (existingMeetings && existingMeetings.length > 0) {
    meetingId = existingMeetings[0].id
    console.log(`[Seed Service] Found existing showcase meeting ID: ${meetingId}, re-processing...`)
    await adminSupabase
      .from('meetings')
      .update({
        status: 'analyzing',
        participant_count: SHOWCASE_PARTICIPANTS.length,
        participants: SHOWCASE_PARTICIPANTS,
        updated_at: new Date().toISOString(),
      })
      .eq('id', meetingId)
  } else {
    const { data: newMeeting, error: createError } = await adminSupabase
      .from('meetings')
      .insert({
        user_id: userId,
        title: SHOWCASE_MEETING_TITLE,
        source: 'browser',
        status: 'analyzing',
        participant_count: SHOWCASE_PARTICIPANTS.length,
        participants: SHOWCASE_PARTICIPANTS,
        duration_seconds: 135,
        started_at: new Date().toISOString(),
        ended_at: new Date(Date.now() + 135000).toISOString(),
      })
      .select('id')
      .single()

    if (createError || !newMeeting) {
      throw new Error(`Failed to create showcase meeting record: ${createError?.message}`)
    }
    meetingId = newMeeting.id
    console.log(`[Seed Service] Created new showcase meeting ID: ${meetingId}`)
  }

  // 2. Insert/replace transcript segments
  await adminSupabase.from('transcript_segments').delete().eq('meeting_id', meetingId)

  const segmentRows = SHOWCASE_TRANSCRIPT.map((seg, idx) => ({
    meeting_id: meetingId,
    user_id: userId,
    speaker: seg.speaker,
    text: seg.text,
    start_time_ms: seg.start_time_ms,
    end_time_ms: seg.end_time_ms,
    sequence_num: idx,
  }))

  const { error: segmentError } = await adminSupabase.from('transcript_segments').insert(segmentRows)
  if (segmentError) {
    throw new Error(`Failed to save transcript segments: ${segmentError.message}`)
  }
  console.log(`[Seed Service] Inserted ${segmentRows.length} transcript segments`)

  // 3. Build transcript text for real Groq AI analysis
  const transcriptText = SHOWCASE_TRANSCRIPT.map((s) => `${s.speaker}: ${s.text}`).join('\n')

  // 4. Run real Groq AI analysis using existing AI service
  console.log(`[Seed Service] Invoking real Groq AI service for analysis...`)
  const analysis = await analyzeMeeting(transcriptText, 'project_update', SHOWCASE_MEETING_TITLE)

  // 5. Persist summary into meeting_summaries table
  const { data: summaryRecord, error: summaryError } = await adminSupabase
    .from('meeting_summaries')
    .upsert(
      {
        meeting_id: meetingId,
        user_id: userId,
        template: 'project_update',
        summary: analysis.summary,
        key_takeaways: analysis.key_takeaways,
        decisions: analysis.decisions,
        action_items: analysis.action_items,
        topics: analysis.topics,
        important_moments: analysis.important_moments,
        raw_ai_response: analysis,
        generated_at: new Date().toISOString(),
      },
      { onConflict: 'meeting_id,template' }
    )
    .select()
    .single()

  if (summaryError) {
    throw new Error(`Failed to save meeting summary: ${summaryError.message}`)
  }
  console.log(`[Seed Service] Persisted meeting summary successfully`)

  // 6. Persist action items into action_items table
  await adminSupabase.from('action_items').delete().eq('meeting_id', meetingId).eq('user_id', userId)

  if (analysis.action_items.length > 0) {
    const actionRows = analysis.action_items.map((ai) => ({
      meeting_id: meetingId,
      user_id: userId,
      task: ai.task,
      owner: ai.owner,
      deadline: parseDeadlineDate(ai.deadline),
    }))
    const { error: actionError } = await adminSupabase.from('action_items').insert(actionRows)
    if (actionError) {
      console.warn(`[Seed Service] Warning: error saving action items table: ${actionError.message}`)
    } else {
      console.log(`[Seed Service] Persisted ${actionRows.length} action items`)
    }
  }

  // 7. Update meeting status to complete
  await adminSupabase
    .from('meetings')
    .update({
      status: 'complete',
      updated_at: new Date().toISOString(),
    })
    .eq('id', meetingId)

  console.log(`[Seed Service] Showcase meeting seeding complete! Status set to 'complete'`)

  return {
    meetingId,
    title: SHOWCASE_MEETING_TITLE,
    summary: summaryRecord,
    analysis,
  }
}
