import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createClient as createServiceClient } from '@supabase/supabase-js'
import { unauthorizedResponse, errorResponse } from '@/lib/validations'
import { runShowcaseSeed } from '@/lib/services/seed'

// ── POST /api/seed ───────────────────────────────────────────────────────────
// Seeds the showcase meeting transcript and executes real Groq AI analysis
export async function POST(_request: NextRequest) {
  try {
    let userId: string | undefined

    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    userId = user?.id

    // Fallback: If unauthenticated in local/demo mode, use the primary profile in DB
    if (!userId) {
      const adminSupabase = createServiceClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!,
        { auth: { persistSession: false } }
      )
      const { data: profiles } = await adminSupabase.from('profiles').select('id').limit(1)
      userId = profiles?.[0]?.id
    }

    if (!userId) {
      return unauthorizedResponse()
    }

    const result = await runShowcaseSeed(userId)

    return NextResponse.json({
      success: true,
      message: 'Showcase transcript seeded and analyzed via Groq AI successfully',
      meetingId: result.meetingId,
      title: result.title,
      summary: result.summary,
    }, { status: 201 })
  } catch (err: any) {
    console.error('[POST /api/seed]', err)
    return errorResponse(err?.message || 'Failed to seed showcase meeting', 500)
  }
}
