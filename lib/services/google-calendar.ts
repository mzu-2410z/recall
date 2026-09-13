import { createClient } from '@/lib/supabase/server'

export interface CalendarEvent {
  id: string
  title: string
  startTime: string
  endTime: string
  attendees: Array<{ name: string; email: string }>
  meetLink: string | null
  meetSpaceId: string | null
  isGoogleMeet: boolean
  rawEvent: any
}

/**
 * Refreshes an expired Google access token using the stored refresh token.
 */
export async function getValidAccessToken(userId: string): Promise<string> {
  const supabase = await createClient()

  const { data: profile, error } = await supabase
    .from('profiles')
    .select('google_access_token, google_refresh_token, google_token_expiry')
    .eq('id', userId)
    .single()

  if (error || !profile?.google_refresh_token) {
    throw new Error('Google OAuth not connected. Please connect your Google account.')
  }

  const expiryDate = profile.google_token_expiry ? new Date(profile.google_token_expiry) : null
  const isExpired = !expiryDate || expiryDate.getTime() - Date.now() < 5 * 60 * 1000

  if (!isExpired && profile.google_access_token) {
    return profile.google_access_token
  }

  // Refresh token via OAuth2 token endpoint
  const params = new URLSearchParams({
    client_id: process.env.GOOGLE_CLIENT_ID || '',
    client_secret: process.env.GOOGLE_CLIENT_SECRET || '',
    refresh_token: profile.google_refresh_token,
    grant_type: 'refresh_token',
  })

  const response = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: params.toString(),
  })

  if (!response.ok) {
    throw new Error('Failed to refresh Google access token.')
  }

  const data = await response.json()
  const newAccessToken = data.access_token
  const newExpiry = new Date(Date.now() + (data.expires_in || 3600) * 1000).toISOString()

  await supabase
    .from('profiles')
    .update({
      google_access_token: newAccessToken,
      google_token_expiry: newExpiry,
    })
    .eq('id', userId)

  return newAccessToken
}

/**
 * Fetches upcoming Google Calendar events for the next 7 days using REST API.
 */
export async function getUpcomingEvents(userId: string): Promise<CalendarEvent[]> {
  const accessToken = await getValidAccessToken(userId)

  const now = new Date()
  const weekLater = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000)

  const url = new URL('https://www.googleapis.com/calendar/v3/calendars/primary/events')
  url.searchParams.set('timeMin', now.toISOString())
  url.searchParams.set('timeMax', weekLater.toISOString())
  url.searchParams.set('singleEvents', 'true')
  url.searchParams.set('orderBy', 'startTime')
  url.searchParams.set('maxResults', '50')

  const res = await fetch(url.toString(), {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      Accept: 'application/json',
    },
  })

  if (!res.ok) {
    console.warn(`[getUpcomingEvents] Google Calendar API error: ${res.statusText}`)
    return []
  }

  const data = await res.json()
  const items = data.items || []

  return items.map((event: any): CalendarEvent => {
    const meetLink =
      event.hangoutLink ||
      event.conferenceData?.entryPoints?.find(
        (ep: any) => ep.entryPointType === 'video'
      )?.uri ||
      null

    let meetSpaceId: string | null = null
    if (meetLink) {
      const match = meetLink.match(/meet\.google\.com\/([a-z0-9-]+)/)
      if (match) meetSpaceId = match[1]
    }

    const isGoogleMeet =
      !!meetLink ||
      event.conferenceData?.conferenceSolution?.key?.type === 'hangoutsMeet'

    return {
      id: event.id,
      title: event.summary || 'Untitled Meeting',
      startTime: event.start?.dateTime || event.start?.date || '',
      endTime: event.end?.dateTime || event.end?.date || '',
      attendees: (event.attendees || []).map((a: any) => ({
        name: a.displayName || a.email || '',
        email: a.email || '',
      })),
      meetLink,
      meetSpaceId,
      isGoogleMeet,
      rawEvent: event,
    }
  })
}

/**
 * Caches calendar events in Supabase for offline access.
 */
export async function syncCalendarEvents(userId: string): Promise<CalendarEvent[]> {
  const events = await getUpcomingEvents(userId)
  const supabase = await createClient()

  const rows = events.map((ev) => ({
    user_id: userId,
    google_event_id: ev.id,
    title: ev.title,
    start_time: ev.startTime,
    end_time: ev.endTime,
    attendees: ev.attendees,
    meet_link: ev.meetLink,
    meet_space_id: ev.meetSpaceId,
    is_google_meet: ev.isGoogleMeet,
    raw_event: ev.rawEvent,
    cached_at: new Date().toISOString(),
  }))

  if (rows.length > 0) {
    await supabase
      .from('calendar_events')
      .upsert(rows, { onConflict: 'user_id,google_event_id' })
  }

  return events
}
