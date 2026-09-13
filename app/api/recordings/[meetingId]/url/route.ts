import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { unauthorizedResponse, errorResponse } from '@/lib/validations'
import { getSignedUrl } from '@/lib/services/storage'

type Params = { params: Promise<{ meetingId: string }> }

// ── GET /api/recordings/[meetingId]/url — Returns a signed playback URL ──────
export async function GET(_req: NextRequest, { params }: Params) {
  try {
    const { meetingId } = await params
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return unauthorizedResponse()

    // Verify ownership (IDOR protection)
    const { data: meeting } = await supabase
      .from('meetings')
      .select('recording_path')
      .eq('id', meetingId)
      .eq('user_id', user.id)
      .single()

    if (!meeting) return errorResponse('Meeting not found', 404)
    if (!meeting.recording_path) {
      return errorResponse('No recording available for this meeting', 404)
    }

    // Generate 1-hour signed URL
    const signedUrl = await getSignedUrl(meeting.recording_path, 3600)

    return NextResponse.json({ url: signedUrl, expiresIn: 3600 })
  } catch (err) {
    console.error('[GET /api/recordings/[meetingId]/url]', err)
    return errorResponse('Failed to generate playback URL')
  }
}
