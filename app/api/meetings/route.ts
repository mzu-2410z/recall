import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { unauthorizedResponse, errorResponse, parseBody, createMeetingSchema } from '@/lib/validations'

// ── GET /api/meetings ────────────────────────────────────────────────────────
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return unauthorizedResponse()

    const { searchParams } = new URL(request.url)
    const page = Math.max(1, parseInt(searchParams.get('page') ?? '1'))
    const limit = Math.min(50, Math.max(1, parseInt(searchParams.get('limit') ?? '20')))
    const offset = (page - 1) * limit
    const status = searchParams.get('status')
    const source = searchParams.get('source')

    let query = supabase
      .from('meetings')
      .select('*', { count: 'exact' })
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    if (status) query = query.eq('status', status)
    if (source) query = query.eq('source', source)

    const { data, error, count } = await query
    if (error) throw error

    return NextResponse.json({
      meetings: data,
      total: count ?? 0,
      page,
      limit,
    })
  } catch (err) {
    console.error('[GET /api/meetings]', err)
    return errorResponse('Failed to fetch meetings')
  }
}

// ── POST /api/meetings ───────────────────────────────────────────────────────
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return unauthorizedResponse()

    const body = await request.json()
    const parsed = parseBody(createMeetingSchema, body)
    if (!parsed.success) return parsed.response

    const { data, error } = await supabase
      .from('meetings')
      .insert({ ...parsed.data, user_id: user.id })
      .select()
      .single()

    if (error) throw error

    return NextResponse.json(data, { status: 201 })
  } catch (err) {
    console.error('[POST /api/meetings]', err)
    return errorResponse('Failed to create meeting')
  }
}
