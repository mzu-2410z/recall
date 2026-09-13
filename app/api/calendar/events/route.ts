import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { unauthorizedResponse, errorResponse } from '@/lib/validations'
import { syncCalendarEvents, isDemoMode, getDemoCalendarEvents } from '@/lib/services/google-calendar'

// ── GET /api/calendar/events ──────────────────────────────────────────────────
// Returns cached calendar events. If stale, returns cached data + triggers sync.
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return unauthorizedResponse()

    if (isDemoMode()) {
      const events = getDemoCalendarEvents()
      return NextResponse.json({ events, synced: true, isDemo: true })
    }

    const { searchParams } = new URL(request.url)
    const forceSync = searchParams.get('sync') === 'true'

    // If forced sync or no cached data, sync from Google
    const { data: cached } = await supabase
      .from('calendar_events')
      .select('*')
      .eq('user_id', user.id)
      .gte('start_time', new Date().toISOString())
      .order('start_time', { ascending: true })
      .limit(50)

    const cacheAge = cached?.[0]?.cached_at
      ? Date.now() - new Date(cached[0].cached_at).getTime()
      : Infinity

    // Auto-sync if cache is >15 minutes old or forced
    if (forceSync || cacheAge > 15 * 60 * 1000 || !cached?.length) {
      try {
        const events = await syncCalendarEvents(user.id)
        return NextResponse.json({ events, synced: true })
      } catch (err: any) {
        // Google not connected — return cached data
        if (cached?.length) {
          return NextResponse.json({ events: cached, synced: false, cached: true })
        }
        if (err.message?.includes('Google not connected')) {
          return NextResponse.json(
            { error: 'Google Calendar not connected. Please authorize access.', needsAuth: true },
            { status: 403 }
          )
        }
        throw err
      }
    }

    return NextResponse.json({ events: cached, synced: false, cached: true })
  } catch (err) {
    console.error('[GET /api/calendar/events]', err)
    return errorResponse('Failed to fetch calendar events')
  }
}
