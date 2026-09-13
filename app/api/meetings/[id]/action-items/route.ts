import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { unauthorizedResponse, errorResponse, notFoundResponse } from '@/lib/validations'

type Params = { params: Promise<{ id: string }> }

// ── GET /api/meetings/[id]/action-items ─────────────────────────────────────
export async function GET(_req: NextRequest, { params }: Params) {
  try {
    const { id } = await params
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return unauthorizedResponse()

    // IDOR: verify meeting belongs to user
    const { data: meeting } = await supabase
      .from('meetings').select('id').eq('id', id).eq('user_id', user.id).single()
    if (!meeting) return notFoundResponse()

    const { data, error } = await supabase
      .from('action_items')
      .select('*')
      .eq('meeting_id', id)
      .eq('user_id', user.id)
      .order('created_at', { ascending: true })

    if (error) throw error
    return NextResponse.json(data)
  } catch (err) {
    console.error('[GET action-items]', err)
    return errorResponse('Failed to fetch action items')
  }
}

// ── PATCH /api/meetings/[id]/action-items?itemId=xxx ─────────────────────────
export async function PATCH(request: NextRequest, { params }: Params) {
  try {
    const { id } = await params
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return unauthorizedResponse()

    const { searchParams } = new URL(request.url)
    const body = await request.json().catch(() => ({}))

    const itemId = searchParams.get('itemId') || searchParams.get('id') || body.itemId || body.id
    if (!itemId) return errorResponse('itemId required', 400)

    const completed = typeof body.completed === 'boolean' ? body.completed : undefined
    if (completed === undefined) return errorResponse('completed field required', 400)

    const { data, error } = await supabase
      .from('action_items')
      .update({ completed, updated_at: new Date().toISOString() })
      .eq('id', itemId)
      .eq('meeting_id', id)
      .eq('user_id', user.id)
      .select()
      .single()

    if (error) return notFoundResponse()
    return NextResponse.json(data)
  } catch (err) {
    console.error('[PATCH action-items]', err)
    return errorResponse('Failed to update action item')
  }
}
