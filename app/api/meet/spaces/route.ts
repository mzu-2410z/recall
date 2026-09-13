import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { unauthorizedResponse, errorResponse } from '@/lib/validations'
import { createMeetSpace } from '@/lib/services/google-meet'
import { createClient as createServiceClient } from '@supabase/supabase-js'

// ── POST /api/meet/spaces — Creates a new Google Meet space ───────────────────
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return unauthorizedResponse()

    const body = await request.json().catch(() => ({}))
    const title = (body?.title as string)?.trim() || 'Recall Meeting'

    // Create the Meet space
    const space = await createMeetSpace(user.id)

    // Create a meeting record
    const adminSupabase = createServiceClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      { auth: { persistSession: false } }
    )

    const { data: meeting, error } = await adminSupabase
      .from('meetings')
      .insert({
        user_id: user.id,
        title,
        source: 'google_meet',
        status: 'pending',
        google_meet_id: space.name,
      })
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({
      meeting,
      space: {
        name: space.name,
        meetingUri: space.meetingUri,
        meetingCode: space.meetingCode,
      },
    }, { status: 201 })
  } catch (err: any) {
    console.error('[POST /api/meet/spaces]', err)
    if (err?.message?.includes('Google Calendar not connected') || err?.message?.includes('Google not connected')) {
      return errorResponse('Google account not connected. Please authorize Google access in Settings.', 403)
    }
    return errorResponse(err?.message || 'Failed to create Google Meet space', 500)
  }
}
