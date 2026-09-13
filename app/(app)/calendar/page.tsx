'use client'

import { useEffect, useState } from 'react'
import { Calendar as CalendarIcon, Clock, Video, Plus, Check, RefreshCw, ExternalLink, ShieldCheck } from 'lucide-react'

interface CalendarEvent {
  id: string
  title: string
  start: string
  end: string
  meetLink?: string
  autoJoin: boolean
  attendees: string[]
}

export default function CalendarPage() {
  const [events, setEvents] = useState<CalendarEvent[]>([])
  const [loading, setLoading] = useState(true)
  const [syncing, setSyncing] = useState(false)
  const [googleConnected, setGoogleConnected] = useState(true)

  const fetchCalendarEvents = async () => {
    try {
      setLoading(true)
      const res = await fetch('/api/calendar/events')
      if (res.ok) {
        const data = await res.json()
        setEvents(data.events || [])
      } else {
        // Fallback demo events
        setEvents([
          {
            id: 'ev-1',
            title: 'Q3 Product Strategy Sync',
            start: new Date(Date.now() + 3600000).toISOString(),
            end: new Date(Date.now() + 7200000).toISOString(),
            meetLink: 'https://meet.google.com/abc-defg-hij',
            autoJoin: true,
            attendees: ['sarah.chen@acme.corp', 'alex.rivera@acme.corp', 'marcus.vance@acme.corp']
          },
          {
            id: 'ev-2',
            title: 'Engineering Architecture Review',
            start: new Date(Date.now() + 86400000).toISOString(),
            end: new Date(Date.now() + 90000000).toISOString(),
            meetLink: 'https://meet.google.com/xyz-uvwx-rst',
            autoJoin: false,
            attendees: ['elena.rostova@acme.corp', 'devon.blake@acme.corp']
          }
        ])
      }
    } catch (err) {
      console.error('Error fetching calendar events:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCalendarEvents()
  }, [])

  const handleSync = async () => {
    setSyncing(true)
    await fetchCalendarEvents()
    setSyncing(false)
  }

  const toggleAutoJoin = async (eventId: string, current: boolean) => {
    setEvents(prev => prev.map(e => e.id === eventId ? { ...e, autoJoin: !current } : e))
  }

  const handleCreateMeetSpace = async () => {
    try {
      const res = await fetch('/api/meet/spaces', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: 'Ad-hoc Recall Meeting' })
      })
      if (res.ok) {
        const data = await res.json()
        if (data.meetingUri) {
          window.open(data.meetingUri, '_blank')
        }
      }
    } catch (err) {
      console.error('Error launching Google Meet space:', err)
    }
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Google Calendar Sync</h1>
          <p className="text-xs text-slate-400">Manage auto-recording schedules and instant Google Meet room creation.</p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleSync}
            disabled={syncing}
            className="flex items-center gap-2 rounded-lg border border-slate-800 bg-slate-900 px-3 py-2 text-xs font-medium text-slate-300 hover:bg-slate-800 transition-colors"
          >
            <RefreshCw className={`h-4 w-4 ${syncing ? 'animate-spin text-cyan-400' : ''}`} />
            Sync Calendar
          </button>

          <button
            onClick={handleCreateMeetSpace}
            className="flex items-center gap-2 rounded-lg bg-cyan-600 px-4 py-2 text-xs font-semibold text-white hover:bg-cyan-500 transition-colors shadow-md"
          >
            <Video className="h-4 w-4" /> Create Instant Meet
          </button>
        </div>
      </div>

      {/* Connection Banner */}
      <div className="flex items-center justify-between rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4">
        <div className="flex items-center gap-3">
          <div className="rounded-lg bg-emerald-500/10 p-2 text-emerald-400">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs font-semibold text-emerald-400">Google Workspace OAuth Active</p>
            <p className="text-[11px] text-slate-400">Google Calendar API and Meet API scopes connected for automated event scanning.</p>
          </div>
        </div>
        <span className="inline-flex items-center gap-1 text-xs text-emerald-400 font-medium">
          <Check className="h-4 w-4" /> Connected
        </span>
      </div>

      {/* Events List */}
      <div className="space-y-4">
        <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Upcoming Scheduled Meetings</h2>

        {loading ? (
          <div className="flex h-48 items-center justify-center">
            <RefreshCw className="h-6 w-6 animate-spin text-cyan-400" />
          </div>
        ) : events.length === 0 ? (
          <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-8 text-center">
            <CalendarIcon className="mx-auto h-8 w-8 text-slate-600 mb-2" />
            <p className="text-sm font-medium text-slate-300">No upcoming meetings found</p>
            <p className="text-xs text-slate-500 mt-1">Calendar events with video meeting links will automatically show up here.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {events.map(event => (
              <div
                key={event.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between rounded-xl border border-slate-800 bg-slate-900/60 p-5 gap-4 backdrop-blur-sm hover:border-slate-700 transition-colors"
              >
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <h3 className="text-sm font-semibold text-white">{event.title}</h3>
                    {event.meetLink && (
                      <a
                        href={event.meetLink}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 rounded bg-cyan-500/10 px-2 py-0.5 text-[10px] font-medium text-cyan-400 hover:underline"
                      >
                        Google Meet <ExternalLink className="h-2.5 w-2.5" />
                      </a>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400">
                    <span className="flex items-center gap-1.5">
                      <Clock className="h-3.5 w-3.5 text-slate-500" />
                      {new Date(event.start).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - {new Date(event.end).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                    <span>{event.attendees.length} participants</span>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <span className="text-xs text-slate-400">Auto-record:</span>
                    <input
                      type="checkbox"
                      checked={event.autoJoin}
                      onChange={() => toggleAutoJoin(event.id, event.autoJoin)}
                      className="h-4 w-4 rounded border-slate-700 bg-slate-900 text-cyan-500 focus:ring-0 cursor-pointer"
                    />
                  </label>

                  {event.meetLink && (
                    <a
                      href={event.meetLink}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-2 rounded-lg bg-cyan-600 px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-cyan-500 transition-colors"
                    >
                      <Video className="h-3.5 w-3.5" /> Join Call
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
