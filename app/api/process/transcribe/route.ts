import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { unauthorizedResponse, errorResponse } from '@/lib/validations'
import { checkRateLimit } from '@/lib/rate-limit'
import { transcribeAudio, saveTranscriptSegments } from '@/lib/services/transcription'
import { createClient as createServiceClient } from '@supabase/supabase-js'

// ── POST /api/process/transcribe ─────────────────────────────────────────────
// Fetches the recording from storage and transcribes it via Groq Whisper
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return unauthorizedResponse()

    const rl = checkRateLimit(`${user.id}:transcribe`, 5, 60 * 60 * 1000)
    if (!rl.allowed) {
      return NextResponse.json({ error: 'Rate limit exceeded.' }, { status: 429 })
    }

    const body = await request.json()
    const meetingId = body?.meetingId as string
    if (!meetingId) return errorResponse('meetingId required', 400)

    // Verify ownership
    const { data: meeting } = await supabase
      .from('meetings')
      .select('id, recording_path, status')
      .eq('id', meetingId)
      .eq('user_id', user.id)
      .single()

    if (!meeting) return errorResponse('Meeting not found', 404)
    if (!meeting.recording_path) return errorResponse('No recording file found', 404)

    const adminSupabase = createServiceClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      { auth: { persistSession: false } }
    )

    // Update status
    await adminSupabase
      .from('meetings')
      .update({ status: 'transcribing', updated_at: new Date().toISOString() })
      .eq('id', meetingId)

    // Download recording from storage
    const { data: fileData, error: downloadError } = await adminSupabase.storage
      .from('recordings')
      .download(meeting.recording_path)

    if (downloadError || !fileData) {
      throw new Error(`Failed to download recording: ${downloadError?.message}`)
    }

    // Transcribe with Groq Whisper
    const segments = await transcribeAudio(fileData, 'recording.webm')

    // Save segments
    await saveTranscriptSegments(meetingId, user.id, segments)

    // Update meeting status
    await adminSupabase
      .from('meetings')
      .update({
        status: 'analyzing',
        updated_at: new Date().toISOString(),
      })
      .eq('id', meetingId)

    return NextResponse.json({
      success: true,
      segmentCount: segments.length,
      meetingId,
    })
  } catch (err) {
    console.error('[POST /api/process/transcribe]', err)

    // Mark meeting as failed
    const body = await request.json().catch(() => ({}))
    if (body?.meetingId) {
      const adminSupabase = createServiceClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!,
        { auth: { persistSession: false } }
      )
      await adminSupabase
        .from('meetings')
        .update({
          status: 'failed',
          processing_error: 'Transcription failed',
          updated_at: new Date().toISOString(),
        })
        .eq('id', body.meetingId)
    }

    return errorResponse('Transcription failed. Please try again.')
  }
}
