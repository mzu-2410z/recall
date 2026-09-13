import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import {
  unauthorizedResponse, errorResponse, notFoundResponse,
  parseBody, createHighlightSchema
} from '@/lib/validations'

type Params = { params: Promise<{ id: string }> }

// ── GET /api/meetings/[id]/highlights ────────────────────────────────────────
export async function GET(_req: NextRequest, { params }: Params) {
  try {
    const { id } = await params
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return unauthorizedResponse()

    // Verify meeting ownership
    const { data: meeting } = await supabase
      .from('meetings').select('id').eq('id', id).eq('user_id', user.id).single()
    if (!meeting) return notFoundResponse()

    const { data, error } = await supabase
      .from('highlights')
      .select('*')
      .eq('meeting_id', id)
      .eq('user_id', user.id)
      .order('timestamp_ms', { ascending: true })

    if (error) throw error
    return NextResponse.json(data)
  } catch (err) {
    console.error('[GET highlights]', err)
    return errorResponse('Failed to fetch highlights')
  }
}

// ── POST /api/meetings/[id]/highlights ───────────────────────────────────────
export async function POST(request: NextRequest, { params }: Params) {
  try {
    const { id } = await params
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return unauthorizedResponse()

    // Verify meeting ownership
    const { data: meeting } = await supabase
      .from('meetings').select('id').eq('id', id).eq('user_id', user.id).single()
    if (!meeting) return notFoundResponse()

    const body = await request.json()
    const parsed = parseBody(createHighlightSchema, body)
    if (!parsed.success) return parsed.response

    const { data, error } = await supabase
      .from('highlights')
      .insert({ ...parsed.data, meeting_id: id, user_id: user.id })
      .select()
      .single()

    if (error) throw error
    return NextResponse.json(data, { status: 201 })
  } catch (err) {
    console.error('[POST highlights]', err)
    return errorResponse('Failed to create highlight')
  }
}

// ── DELETE /api/meetings/[id]/highlights?highlightId=xxx ─────────────────────
export async function DELETE(request: NextRequest, { params }: Params) {
  try {
    const { id } = await params
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return unauthorizedResponse()

    const { searchParams } = new URL(request.url)
    const highlightId = searchParams.get('highlightId')
    if (!highlightId) return errorResponse('highlightId required', 400)

    const { error } = await supabase
      .from('highlights')
      .delete()
      .eq('id', highlightId)
      .eq('meeting_id', id)
      .eq('user_id', user.id)

    if (error) throw error
    return new NextResponse(null, { status: 204 })
  } catch (err) {
    console.error('[DELETE highlight]', err)
    return errorResponse('Failed to delete highlight')
  }
}
