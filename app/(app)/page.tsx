'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ArrowRight, Calendar, Video, Mic, ChevronRight, Youtube, CheckSquare, Clock } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

interface Meeting {
  id: string
  title: string
  source: string
  status: string
  started_at: string | null
  duration_seconds: number | null
  participant_count: number
  created_at: string
}

interface CalendarEvent {
  id: string
  title: string
  start_time: string
  end_time: string
  attendees: Array<{ name: string; email: string }>
  meet_link: string | null
  is_google_meet: boolean
}

export default function DashboardPage() {
  const [userName, setUserName] = useState('')
  const [meetings, setMeetings] = useState<Meeting[]>([])
  const [upcomingEvents, setUpcomingEvents] = useState<CalendarEvent[]>([])
  const [actionItems, setActionItems] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [askInput, setAskInput] = useState('')
  const [askAnswer, setAskAnswer] = useState('')
  const [askLoading, setAskLoading] = useState(false)
  const supabase = createClient()

  useEffect(() => {
    loadData()
  }, [])

  async function loadData() {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        setUserName(user.user_metadata?.full_name?.split(' ')[0] || 'there')
      }

      // Load recent meetings
      const meetingsRes = await fetch('/api/meetings?limit=6&status=complete')
      if (meetingsRes.ok) {
        const meetingsData = await meetingsRes.json()
        setMeetings(meetingsData.meetings ?? (Array.isArray(meetingsData) ? meetingsData : []))
      }

      // Load upcoming calendar events
      const calendarRes = await fetch('/api/calendar/events')
      if (calendarRes.ok) {
        const calData = await calendarRes.json()
        setUpcomingEvents((calData.events ?? []).slice(0, 3))
      }

      // Load pending action items from recent meetings
      const { data: items } = await supabase
        .from('action_items')
        .select('*, meetings(title)')
        .eq('completed', false)
        .order('created_at', { ascending: false })
        .limit(5)
      setActionItems(items ?? [])
    } catch (err) {
      console.error('Error loading dashboard data:', err)
    } finally {
      setLoading(false)
    }
  }

  async function handleAsk(e: React.FormEvent) {
    e.preventDefault()
    if (!askInput.trim()) return
    setAskLoading(true)
    setAskAnswer('')
    try {
      const res = await fetch('/api/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: askInput }),
      })
      const data = await res.json()
      setAskAnswer(data.answer || 'No answer found.')
    } catch {
      setAskAnswer('Failed to get an answer. Please try again.')
    } finally {
      setAskLoading(false)
    }
  }

  const greeting = () => {
    const h = new Date().getHours()
    if (h < 12) return 'Good morning'
    if (h < 18) return 'Good afternoon'
    return 'Good evening'
  }

  const formatDuration = (seconds: number | null) => {
    if (!seconds) return ''
    const m = Math.floor(seconds / 60)
    return `${m} min`
  }

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return ''
    return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }

  const formatTime = (dateStr: string) => {
    return new Date(dateStr).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })
  }

  return (
    <div className="max-w-5xl mx-auto px-6 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-[28px] font-semibold text-white tracking-tight">
          {greeting()}{userName ? `, ${userName}` : ''}.
        </h1>
        <p className="text-[15px] text-slate-400 mt-1">What would you like to capture today?</p>
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-8">
        <Link
          href="/record"
          className="bg-cyan-600 hover:bg-cyan-500 text-white rounded-2xl p-5 text-left transition-colors duration-150 shadow-md"
        >
          <Mic size={22} className="mb-3" />
          <p className="text-[15px] font-semibold">Record Meeting</p>
          <p className="text-[13px] text-cyan-100 mt-0.5">Browser capture</p>
        </Link>

        <Link
          href="/calendar"
          className="bg-slate-900/80 border border-slate-800 hover:border-cyan-500/30 text-white rounded-2xl p-5 text-left transition-all duration-150 shadow-sm group"
        >
          <Calendar size={22} className="mb-3 text-cyan-400" />
          <p className="text-[15px] font-semibold">Upcoming Meetings</p>
          <p className="text-[13px] text-slate-400 mt-0.5">From Calendar</p>
        </Link>

        <Link
          href="/import"
          className="bg-slate-900/80 border border-slate-800 hover:border-red-500/30 text-white rounded-2xl p-5 text-left transition-all duration-150 shadow-sm"
        >
          <Youtube size={22} className="mb-3 text-red-500" />
          <p className="text-[15px] font-semibold">Summarize Video</p>
          <p className="text-[13px] text-slate-400 mt-0.5">Paste YouTube link</p>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Left column — meetings + events */}
        <div className="lg:col-span-3 space-y-6">
          {/* Recent meetings */}
          <section>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-[17px] font-semibold text-white">Recent meetings</h2>
              <Link href="/meetings" className="text-[14px] text-cyan-400 flex items-center gap-1 hover:opacity-70">
                See all <ArrowRight size={13} />
              </Link>
            </div>

            {loading ? (
              <div className="space-y-2">
                {[1, 2, 3].map(i => (
                  <div key={i} className="h-16 bg-slate-900/60 rounded-xl animate-pulse" />
                ))}
              </div>
            ) : meetings.length === 0 ? (
              <div className="bg-slate-900/60 rounded-2xl border border-slate-800 p-8 text-center">
                <Video size={32} className="mx-auto text-slate-600 mb-3" />
                <p className="text-[15px] font-medium text-slate-300">No meetings yet</p>
                <p className="text-[13px] text-slate-500 mt-1">Record your first meeting or import a YouTube video.</p>
              </div>
            ) : (
              <div className="space-y-2">
                {meetings.map(m => (
                  <Link
                    key={m.id}
                    href={`/meetings/${m.id}`}
                    className="flex items-center gap-3 bg-slate-900/60 rounded-xl border border-slate-800 px-4 py-3.5 hover:border-cyan-500/30 transition-all duration-100 group"
                  >
                    <div className="w-8 h-8 rounded-lg bg-cyan-500/10 flex items-center justify-center flex-shrink-0">
                      {m.source === 'youtube' ? (
                        <Youtube size={15} className="text-red-500" />
                      ) : (
                        <Video size={15} className="text-cyan-400" />
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className="text-[14px] font-medium text-slate-200 truncate group-hover:text-cyan-400">
                        {m.title}
                      </p>
                      <p className="text-[12px] text-slate-500">
                        {formatDate(m.started_at || m.created_at)}
                        {m.duration_seconds && ` · ${formatDuration(m.duration_seconds)}`}
                      </p>
                    </div>

                    <ChevronRight size={16} className="text-slate-600 group-hover:text-cyan-400 transition-colors" />
                  </Link>
                ))}
              </div>
            )}
          </section>

          {/* Upcoming calendar events */}
          <section>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-[17px] font-semibold text-white">Today's schedule</h2>
              <Link href="/calendar" className="text-[14px] text-cyan-400 hover:opacity-70">
                View calendar
              </Link>
            </div>

            {upcomingEvents.length === 0 ? (
              <div className="bg-slate-900/40 rounded-xl border border-slate-800/80 p-4 text-center text-[13px] text-slate-500">
                No upcoming events scheduled for today.
              </div>
            ) : (
              <div className="space-y-2">
                {upcomingEvents.map(event => (
                  <div
                    key={event.id}
                    className="flex items-center justify-between bg-slate-900/60 rounded-xl border border-slate-800 px-4 py-3"
                  >
                    <div className="flex items-center gap-3">
                      <Clock size={16} className="text-slate-500" />
                      <div>
                        <p className="text-[14px] font-medium text-slate-200">{event.title}</p>
                        <p className="text-[12px] text-slate-500">{formatTime(event.start_time)}</p>
                      </div>
                    </div>

                    {event.meet_link && (
                      <a
                        href={event.meet_link}
                        target="_blank"
                        rel="noreferrer"
                        className="text-[12px] font-medium text-white bg-cyan-600 hover:bg-cyan-500 px-3 py-1.5 rounded-lg transition-colors"
                      >
                        Join Meet
                      </a>
                    )}
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>

        {/* Right column — Ask Recall + Action items */}
        <div className="lg:col-span-2 space-y-6">
          {/* Ask Recall widget */}
          <section className="bg-slate-900/60 rounded-2xl border border-slate-800 p-5">
            <h2 className="text-[16px] font-semibold text-white mb-1">Ask Recall</h2>
            <p className="text-[13px] text-slate-400 mb-4">Query your meeting history using natural language.</p>

            <form onSubmit={handleAsk} className="space-y-3">
              <input
                type="text"
                value={askInput}
                onChange={e => setAskInput(e.target.value)}
                placeholder="e.g. What were the Q3 priorities?"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-[13px] text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-cyan-500"
              />
              <button
                type="submit"
                disabled={askLoading || !askInput.trim()}
                className="w-full bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl py-2 text-[13px] font-semibold transition-colors disabled:opacity-50"
              >
                {askLoading ? 'Searching...' : 'Ask AI'}
              </button>
            </form>

            {askAnswer && (
              <div className="mt-4 p-3 bg-slate-950/80 rounded-xl border border-slate-800 text-[13px] text-slate-300 leading-relaxed">
                {askAnswer}
              </div>
            )}
          </section>

          {/* Pending action items */}
          <section className="bg-slate-900/60 rounded-2xl border border-slate-800 p-5">
            <h2 className="text-[16px] font-semibold text-white mb-3 flex items-center justify-between">
              <span>Open action items</span>
              <span className="text-[12px] font-normal text-slate-500">{actionItems.length} pending</span>
            </h2>

            {actionItems.length === 0 ? (
              <p className="text-[13px] text-slate-500 text-center py-4">All action items completed!</p>
            ) : (
              <div className="space-y-2">
                {actionItems.map(item => (
                  <div key={item.id} className="flex items-start gap-2.5 text-[13px] text-slate-300">
                    <CheckSquare size={16} className="text-cyan-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <p>{item.task}</p>
                      {item.meetings?.title && (
                        <p className="text-[11px] text-slate-500 mt-0.5">{item.meetings.title}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  )
}
