import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { unauthorizedResponse, errorResponse } from '@/lib/validations'

// ── GET /api/search?q=... ────────────────────────────────────────────────────
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return unauthorizedResponse()

    const { searchParams } = new URL(request.url)
    const q = searchParams.get('q')?.trim()
    if (!q || q.length < 2) {
      return NextResponse.json({ results: [] })
    }

    // Max query length guard
    const safeQuery = q.slice(0, 200)

    // Use the PostgreSQL search function defined in migration 003
    const { data, error } = await supabase.rpc('search_meetings', {
      p_user_id: user.id,
      p_query: safeQuery,
      p_limit: 30,
      p_offset: 0,
    })

    if (error) {
      // Fallback to simple ILIKE if tsvector search fails
      const { data: fallback } = await supabase
        .from('meetings')
        .select('id, title, source, started_at')
        .eq('user_id', user.id)
        .ilike('title', `%${safeQuery}%`)
        .limit(20)

      return NextResponse.json({
        results: (fallback ?? []).map((m) => ({
          meeting_id: m.id,
          title: m.title,
          source: m.source,
          started_at: m.started_at,
          snippet: m.title,
          match_type: 'title',
          rank: 1,
        })),
      })
    }

    // Deduplicate by meeting_id (keep highest rank per meeting)
    const seen = new Map<string, any>()
    for (const row of data ?? []) {
      if (!seen.has(row.meeting_id) || row.rank > seen.get(row.meeting_id).rank) {
        seen.set(row.meeting_id, row)
      }
    }

    return NextResponse.json({
      results: Array.from(seen.values()).sort((a, b) => b.rank - a.rank),
      query: safeQuery,
    })
  } catch (err) {
    console.error('[GET /api/search]', err)
    return errorResponse('Search failed')
  }
}
