import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { unauthorizedResponse, errorResponse, notFoundResponse } from '@/lib/validations'
import { getConferenceRecords, getTranscriptEntries, meetTranscriptToSegments } from '@/lib/services/google-meet'
import { saveTranscriptSegments } from '@/lib/services/transcription'
import { createClient as createServiceClient } from '@supabase/supabase-js'

type Params = { params: Promise<{ spaceId: string }> }

// ── POST /api/meet/conferences/[spaceId] — Polls for conference record ────────
// Called after a meeting ends to retrieve artifacts
export async function POST(_req: NextRequest, { params }: Params) {
  try {
    const { spaceId } = await params
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return unauthorizedResponse()

    // Verify meeting ownership
    const { data: meeting } = await supabase
      .from('meetings')
      .select('id, title')
      .eq('google_meet_id', `spaces/${spaceId}`)
      .eq('user_id', user.id)
      .single()

    if (!meeting) return notFoundResponse()

    // Poll for conference records
    const conferences = await getConferenceRecords(user.id, spaceId)

    if (conferences.length === 0) {
      return NextResponse.json({
        found: false,
        message: 'No conference record found yet. This may take a few minutes after the meeting ends. ' +
          'Note: Conference records require a Google Workspace account with recording enabled.',
      })
    }

    const latestConference = conferences[conferences.length - 1]
    const adminSupabase = createServiceClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      { auth: { persistSession: false } }
    )

    // Update meeting with conference ID
    await adminSupabase
      .from('meetings')
      .update({
        google_conference_id: latestConference.name,
        status: 'transcribing',
        updated_at: new Date().toISOString(),
      })
      .eq('id', meeting.id)

    // Try to get transcript entries
    const transcriptEntries = await getTranscriptEntries(user.id, latestConference.name)

    if (transcriptEntries.length > 0) {
      const segments = meetTranscriptToSegments(transcriptEntries)
      await saveTranscriptSegments(meeting.id, user.id, segments)

      await adminSupabase
        .from('meetings')
        .update({ status: 'analyzing', updated_at: new Date().toISOString() })
        .eq('id', meeting.id)

      return NextResponse.json({
        found: true,
        conferenceId: latestConference.name,
        transcriptSegments: segments.length,
        nextStep: 'summarize',
      })
    }

    return NextResponse.json({
      found: true,
      conferenceId: latestConference.name,
      transcriptSegments: 0,
      message: 'Conference record found but no transcript available. Try browser recording as fallback.',
    })
  } catch (err) {
    console.error('[POST /api/meet/conferences/[spaceId]]', err)
    return errorResponse('Failed to retrieve conference record')
  }
}
