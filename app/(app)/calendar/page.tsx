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
  const [error, setError] = useState<string | null>(null)

  const fetchCalendarEvents = async () => {
    try {
      setLoading(true)
      setError(null)
      const res = await fetch('/api/calendar/events')
      const data = await res.json()
      if (res.ok) {
        const rawEvents = data.events || []
        const mappedEvents: CalendarEvent[] = rawEvents.map((e: any) => ({
          id: e.id || e.google_event_id,
          title: e.title || 'Untitled Meeting',
          start: e.start || e.start_time || e.startTime || new Date().toISOString(),
          end: e.end || e.end_time || e.endTime || new Date().toISOString(),
          meetLink: e.meetLink || e.meet_link || undefined,
          autoJoin: Boolean(e.autoJoin ?? e.auto_join ?? false),
          attendees: Array.isArray(e.attendees)
            ? e.attendees.map((a: any) => (typeof a === 'string' ? a : (a.email || a.name || '')))
            : []
        }))
        setEvents(mappedEvents)
      } else {
        setError(data.error || 'Failed to load Google Calendar events.')
        setEvents([])
      }
    } catch (err) {
      console.error('Error fetching calendar events:', err)
      setError('Unable to connect to calendar service.')
      setEvents([])
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
      const data = await res.json()
      if (res.ok) {
        const uri = data.space?.meetingUri || data.meetingUri
        if (uri) {
          window.open(uri, '_blank')
        }
      } else {
        alert(data.error || 'Failed to create Google Meet space. Make sure Google account is connected with Meet permissions.')
      }
    } catch (err) {
      console.error('Error launching Google Meet space:', err)
      alert('Unable to connect to Google Meet service.')
    }
  }

  return (
    <>
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');

        .calendar-root {
          font-family: -apple-system, 'Inter', BlinkMacSystemFont, 'SF Pro Display', 'SF Pro Text', 'Helvetica Neue', sans-serif;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
        }

        .glass-card {
          background: rgba(255, 255, 255, 0.72);
          backdrop-filter: blur(40px) saturate(180%);
          -webkit-backdrop-filter: blur(40px) saturate(180%);
          border: 1px solid rgba(255, 255, 255, 0.85);
          box-shadow:
            0 0 0 0.5px rgba(0, 0, 0, 0.03),
            0 1px 3px rgba(0, 0, 0, 0.04),
            0 8px 32px rgba(0, 0, 0, 0.06);
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .glass-card:hover {
          border-color: rgba(255, 255, 255, 1);
          box-shadow:
            0 0 0 0.5px rgba(0, 0, 0, 0.03),
            0 4px 12px rgba(0, 0, 0, 0.05),
            0 12px 40px rgba(0, 0, 0, 0.08);
          transform: translateY(-1px);
        }

        .btn-apple-primary {
          background: linear-gradient(180deg, #0077ED 0%, #0071e3 100%);
          box-shadow: 0 1px 3px rgba(0, 113, 227, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.15);
          transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .btn-apple-primary:hover {
          background: linear-gradient(180deg, #0080f7 0%, #0077ED 100%);
          box-shadow: 0 2px 8px rgba(0, 113, 227, 0.35), inset 0 1px 0 rgba(255, 255, 255, 0.15);
        }

        .btn-apple-secondary {
          background: rgba(255, 255, 255, 0.75);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 1px solid rgba(0, 0, 0, 0.08);
          box-shadow: 0 1px 2px rgba(0, 0, 0, 0.03), inset 0 1px 0 rgba(255, 255, 255, 0.5);
          transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .btn-apple-secondary:hover:not(:disabled) {
          background: rgba(255, 255, 255, 0.95);
          border-color: rgba(0, 0, 0, 0.15);
        }

        .banner-emerald {
          background: rgba(52, 199, 89, 0.04);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 1px solid rgba(52, 199, 89, 0.25);
          box-shadow: 0 1px 3px rgba(52, 199, 89, 0.02);
        }

        .badge-cyan {
          background: rgba(0, 113, 227, 0.06);
          border: 1px solid rgba(0, 113, 227, 0.12);
          transition: all 0.2s ease;
        }

        .badge-cyan:hover {
          background: rgba(0, 113, 227, 0.1);
          border-color: rgba(0, 113, 227, 0.25);
        }

        .apple-toggle {
          appearance: none;
          width: 36px;
          height: 20px;
          background: rgba(120, 120, 128, 0.16);
          border-radius: 100px;
          position: relative;
          outline: none;
          transition: background-color 0.2s cubic-bezier(0.16, 1, 0.3, 1);
          cursor: pointer;
        }

        .apple-toggle:checked {
          background: #34c759;
        }

        .apple-toggle::before {
          content: '';
          position: absolute;
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: white;
          top: 2px;
          left: 2px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.15);
          transition: transform 0.2s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .apple-toggle:checked::before {
          transform: translateX(16px);
        }

        .btn-call-action {
          background: linear-gradient(180deg, #34c759 0%, #30b855 100%);
          box-shadow: 0 1px 3px rgba(52, 199, 89, 0.3);
          transition: all 0.2s ease;
        }

        .btn-call-action:hover {
          background: linear-gradient(180deg, #3dd865 0%, #34c759 100%);
          box-shadow: 0 2px 8px rgba(52, 199, 89, 0.35);
        }
      `}</style>

      <div className="calendar-root min-h-screen" style={{ background: 'linear-gradient(180deg, #f5f5f7 0%, #fbfbfd 40%, #f5f5f7 100%)' }}>
        <div className="max-w-5xl mx-auto px-6 py-10 lg:py-14 space-y-8">

          {/* Header Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 pb-2">
            <div>
              <h1
                className="font-semibold tracking-tight"
                style={{ fontSize: '28px', lineHeight: '1.15', color: '#1d1d1f', letterSpacing: '-0.015em' }}
              >
                Google Calendar Sync
              </h1>
              <p
                className="mt-1.5"
                style={{ fontSize: '14px', color: '#86868b', fontWeight: 400 }}
              >
                Manage auto-recording schedules and instant Google Meet room creation.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={handleSync}
                disabled={syncing}
                className="btn-apple-secondary flex items-center gap-2 rounded-xl px-4 py-2.5 text-[13px] font-medium text-[#1d1d1f]"
              >
                <RefreshCw className={`h-4 w-4 ${syncing ? 'animate-spin' : ''}`} style={{ color: syncing ? '#0071e3' : '#86868b' }} />
                Sync Calendar
              </button>

              <button
                onClick={handleCreateMeetSpace}
                className="btn-apple-primary flex items-center gap-2 rounded-xl px-4.5 py-2.5 text-[13px] font-semibold text-white"
              >
                <Video className="h-4 w-4" /> Create Instant Meet
              </button>
            </div>
          </div>

          {/* Connection Banner */}
          <div className="banner-emerald rounded-2xl p-5 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="rounded-xl bg-white/60 p-2.5 flex items-center justify-center shadow-sm" style={{ border: '1px solid rgba(52, 199, 89, 0.15)' }}>
                <ShieldCheck className="h-5 w-5 text-[#34c759]" />
              </div>
              <div>
                <p className="text-[14px] font-semibold text-[#30b855] tracking-tight">Google Workspace OAuth Active</p>
                <p className="text-[12px] text-[#86868b] mt-0.5 leading-relaxed">Google Calendar API and Meet API scopes connected for automated event scanning.</p>
              </div>
            </div>
            <span className="inline-flex items-center gap-1.5 text-[13px] text-[#30b855] font-medium bg-emerald-500/10 px-3.5 py-1.5 rounded-full">
              <Check className="h-4 w-4" strokeWidth={2.5} /> Connected
            </span>
          </div>

          {/* Events Section */}
          <div className="space-y-4">
            <h2
              className="font-semibold uppercase tracking-wider"
              style={{ fontSize: '12px', color: '#86868b', letterSpacing: '0.04em' }}
            >
              Upcoming Scheduled Meetings
            </h2>

            {error ? (
              <div className="glass-card rounded-2xl p-6 text-center border-amber-500/20 bg-amber-500/5">
                <p className="font-semibold text-amber-800" style={{ fontSize: '15px' }}>{error}</p>
                <p className="mt-1" style={{ fontSize: '13px', color: '#86868b' }}>Connect or re-authorize your Google account in Settings to sync calendar events.</p>
              </div>
            ) : loading ? (
              <div className="flex h-56 items-center justify-center rounded-2xl glass-card">
                <RefreshCw className="h-7 w-7 animate-spin" style={{ color: '#0071e3' }} />
              </div>
            ) : events.length === 0 ? (
              <div className="glass-card rounded-2xl p-12 text-center">
                <div className="w-14 h-14 rounded-2xl bg-black/[0.02] flex items-center justify-center mx-auto mb-4">
                  <CalendarIcon className="h-7 w-7" style={{ color: '#c7c7cc' }} />
                </div>
                <p className="font-semibold text-[#1d1d1f]" style={{ fontSize: '17px' }}>No upcoming meetings found</p>
                <p className="mt-1" style={{ fontSize: '13px', color: '#86868b' }}>Calendar events with video meeting links will automatically show up here.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-3.5">
                {events.map(event => (
                  <div
                    key={event.id}
                    className="glass-card flex flex-col md:flex-row md:items-center justify-between rounded-2xl p-5 md:p-6 gap-5"
                  >
                    <div className="space-y-2.5">
                      <div className="flex flex-wrap items-center gap-3">
                        <h3 className="font-semibold text-[#1d1d1f] tracking-tight" style={{ fontSize: '16px' }}>{event.title}</h3>
                        {event.meetLink && (
                          <a
                            href={event.meetLink}
                            target="_blank"
                            rel="noreferrer"
                            className="badge-cyan inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-medium text-[#0071e3]"
                          >
                            Google Meet <ExternalLink className="h-3 w-3" />
                          </a>
                        )}
                      </div>

                      <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-[13px]" style={{ color: '#86868b' }}>
                        <span className="flex items-center gap-1.5 font-medium">
                          <Clock className="h-4 w-4" style={{ color: '#c7c7cc' }} />
                          {new Date(event.start).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - {new Date(event.end).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                        <span className="w-1.5 h-1.5 rounded-full bg-[#c7c7cc] hidden sm:inline" />
                        <span className="font-medium">{event.attendees.length} participants</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between md:justify-end gap-6 border-t md:border-t-0 pt-4 md:pt-0 border-black/[0.04]">
                      <label className="flex items-center gap-3 cursor-pointer select-none">
                        <span className="text-[13px] font-medium text-[#86868b]">Auto-record</span>
                        <input
                          type="checkbox"
                          checked={event.autoJoin}
                          onChange={() => toggleAutoJoin(event.id, event.autoJoin)}
                          className="apple-toggle"
                        />
                      </label>

                      {event.meetLink && (
                        <a
                          href={event.meetLink}
                          target="_blank"
                          rel="noreferrer"
                          className="btn-call-action flex items-center gap-2 rounded-full text-[13px] font-semibold text-white px-5 py-2"
                        >
                          <Video className="h-4 w-4" /> Join Call
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}