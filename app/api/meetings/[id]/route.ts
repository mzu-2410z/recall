import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import {
  unauthorizedResponse, errorResponse, notFoundResponse,
  parseBody, updateMeetingSchema
} from '@/lib/validations'

type Params = { params: Promise<{ id: string }> }

// ── GET /api/meetings/[id] ───────────────────────────────────────────────────
export async function GET(_req: NextRequest, { params }: Params) {
  try {
    const { id } = await params
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return unauthorizedResponse()

    // Fetch meeting with summaries, highlights, action items
    const { data: meeting, error } = await supabase
      .from('meetings')
      .select(`
        *,
        meeting_summaries(*),
        highlights(*),
        action_items(*),
        transcript_segments(id, speaker, text, start_time_ms, end_time_ms, sequence_num)
      `)
      .eq('id', id)
      .eq('user_id', user.id)  // IDOR protection
      .single()

    if (error || !meeting) return notFoundResponse()

    return NextResponse.json(meeting)
  } catch (err) {
    console.error('[GET /api/meetings/[id]]', err)
    return errorResponse('Failed to fetch meeting')
  }
}

// ── PATCH /api/meetings/[id] ─────────────────────────────────────────────────
export async function PATCH(request: NextRequest, { params }: Params) {
  try {
    const { id } = await params
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return unauthorizedResponse()

    const body = await request.json()
    const parsed = parseBody(updateMeetingSchema, body)
    if (!parsed.success) return parsed.response

    const { data, error } = await supabase
      .from('meetings')
      .update({ ...parsed.data, updated_at: new Date().toISOString() })
      .eq('id', id)
      .eq('user_id', user.id)  // IDOR protection
      .select()
      .single()

    if (error) return notFoundResponse()

    return NextResponse.json(data)
  } catch (err) {
    console.error('[PATCH /api/meetings/[id]]', err)
    return errorResponse('Failed to update meeting')
  }
}

// ── DELETE /api/meetings/[id] ────────────────────────────────────────────────
export async function DELETE(_req: NextRequest, { params }: Params) {
  try {
    const { id } = await params
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return unauthorizedResponse()

    // Get recording path before deleting
    const { data: meeting } = await supabase
      .from('meetings')
      .select('recording_path')
      .eq('id', id)
      .eq('user_id', user.id)
      .single()

    const { error } = await supabase
      .from('meetings')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id)  // IDOR protection

    if (error) return notFoundResponse()

    // Async storage cleanup (don't block response)
    if (meeting?.recording_path) {
      import('@/lib/services/storage')
        .then(({ deleteRecording }) => deleteRecording(meeting.recording_path!))
        .catch(console.error)
    }

    return new NextResponse(null, { status: 204 })
  } catch (err) {
    console.error('[DELETE /api/meetings/[id]]', err)
    return errorResponse('Failed to delete meeting')
  }
}
