import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { unauthorizedResponse, errorResponse, parseBody, createClipSchema } from '@/lib/validations'
import { createClient as createServiceClient } from '@supabase/supabase-js'

// ── POST /api/clips ───────────────────────────────────────────────────────────
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return unauthorizedResponse()

    const body = await request.json()
    const parsed = parseBody(createClipSchema, body)
    if (!parsed.success) return parsed.response

    // Verify the meeting belongs to this user (IDOR protection)
    const { data: meeting } = await supabase
      .from('meetings')
      .select('id, title, recording_path')
      .eq('id', parsed.data.meeting_id)
      .eq('user_id', user.id)
      .single()

    if (!meeting) return errorResponse('Meeting not found', 404)

    const adminSupabase = createServiceClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      { auth: { persistSession: false } }
    )

    const { data: clip, error } = await adminSupabase
      .from('shared_clips')
      .insert({
        meeting_id: parsed.data.meeting_id,
        created_by: user.id,
        start_ms: parsed.data.start_ms,
        end_ms: parsed.data.end_ms,
        label: parsed.data.label,
        expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days
      })
      .select()
      .single()

    if (error) throw error

    return NextResponse.json(
      {
        shareToken: clip.share_token,
        shareUrl: `${process.env.NEXT_PUBLIC_APP_URL}/share/${clip.share_token}`,
        clip,
      },
      { status: 201 }
    )
  } catch (err) {
    console.error('[POST /api/clips]', err)
    return errorResponse('Failed to create share link')
  }
}
