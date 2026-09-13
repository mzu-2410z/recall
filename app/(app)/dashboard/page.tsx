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

      const meetingsRes = await fetch('/api/meetings?limit=6&status=complete')
      if (meetingsRes.ok) {
        const meetingsData = await meetingsRes.json()
        setMeetings(meetingsData.meetings ?? (Array.isArray(meetingsData) ? meetingsData : []))
      }

      const calendarRes = await fetch('/api/calendar/events')
      if (calendarRes.ok) {
        const calData = await calendarRes.json()
        setUpcomingEvents((calData.events ?? []).slice(0, 3))
      }

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
    <div
      className="min-h-screen relative"
      style={{
        background: 'linear-gradient(180deg, #fbfbfd 0%, #f5f5f7 40%, #fbfbfd 100%)',
        fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", "Helvetica Neue", Helvetica, Arial, sans-serif',
      }}
    >
      {/* Subtle ambient washes */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-[30%] -right-[10%] w-[700px] h-[700px] rounded-full bg-gradient-to-bl from-blue-100/40 via-indigo-50/20 to-transparent blur-[100px]" />
        <div className="absolute -bottom-[20%] -left-[10%] w-[500px] h-[500px] rounded-full bg-gradient-to-tr from-purple-100/30 via-pink-50/10 to-transparent blur-[80px]" />
        <div className="absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] rounded-full bg-gradient-to-r from-cyan-50/20 via-blue-50/10 to-violet-50/20 blur-[120px]" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-6 sm:px-8 py-10 sm:py-14">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-[34px] sm:text-[42px] font-semibold tracking-[-0.02em] text-[#1d1d1f] leading-tight">
            {greeting()}{userName ? `, ${userName}` : ''}.
          </h1>
          <p className="text-[17px] text-[#86868b] mt-2 font-normal tracking-normal leading-relaxed">
            What would you like to capture today?
          </p>
        </div>

        {/* Quick actions */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-12">
          {/* Record Meeting — primary action */}
          <Link
            href="/record"
            className="group relative rounded-[22px] transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_12px_48px_-12px_rgba(0,122,255,0.20)]"
          >
            <div className="rounded-[22px] bg-gradient-to-b from-[#007AFF] to-[#0066DD] p-6 h-full relative overflow-hidden shadow-[0_2px_16px_-4px_rgba(0,122,255,0.25)]">
              <div className="absolute inset-0 bg-gradient-to-br from-white/[0.12] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/30 to-transparent" />
              <div className="relative z-10">
                <div className="w-11 h-11 rounded-[14px] bg-white/20 backdrop-blur-sm flex items-center justify-center mb-5 border border-white/10">
                  <Mic size={20} className="text-white" />
                </div>
                <p className="text-[16px] font-semibold text-white tracking-tight">Record Meeting</p>
                <p className="text-[13px] text-white/70 mt-1 font-normal">Browser capture</p>
              </div>
            </div>
          </Link>

          {/* Upcoming Meetings */}
          <Link
            href="/calendar"
            className="group relative rounded-[22px] transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_12px_48px_-12px_rgba(0,0,0,0.08)]"
          >
            <div className="rounded-[22px] bg-white/70 backdrop-blur-2xl p-6 h-full relative overflow-hidden border border-black/[0.04] shadow-[0_1px_3px_rgba(0,0,0,0.04),0_4px_12px_rgba(0,0,0,0.03)]">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-50/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative z-10">
                <div className="w-11 h-11 rounded-[14px] bg-[#f5f5f7] flex items-center justify-center mb-5 border border-black/[0.04] group-hover:bg-purple-50 transition-colors duration-300">
                  <Calendar size={20} className="text-[#AF52DE]" />
                </div>
                <p className="text-[16px] font-semibold text-[#1d1d1f] tracking-tight">Upcoming Meetings</p>
                <p className="text-[13px] text-[#86868b] mt-1 font-normal">From Calendar</p>
              </div>
            </div>
          </Link>

          {/* Summarize Video */}
          <Link
            href="/import"
            className="group relative rounded-[22px] transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_12px_48px_-12px_rgba(0,0,0,0.08)]"
          >
            <div className="rounded-[22px] bg-white/70 backdrop-blur-2xl p-6 h-full relative overflow-hidden border border-black/[0.04] shadow-[0_1px_3px_rgba(0,0,0,0.04),0_4px_12px_rgba(0,0,0,0.03)]">
              <div className="absolute inset-0 bg-gradient-to-br from-red-50/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative z-10">
                <div className="w-11 h-11 rounded-[14px] bg-[#f5f5f7] flex items-center justify-center mb-5 border border-black/[0.04] group-hover:bg-red-50 transition-colors duration-300">
                  <Youtube size={20} className="text-[#FF3B30]" />
                </div>
                <p className="text-[16px] font-semibold text-[#1d1d1f] tracking-tight">Summarize Pre-Recorded Meeting</p>
                <p className="text-[13px] text-[#86868b] mt-1 font-normal">Paste YouTube link</p>
              </div>
            </div>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Left column */}
          <div className="lg:col-span-3 space-y-8">
            {/* Recent meetings */}
            <section>
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-[22px] font-semibold text-[#1d1d1f] tracking-[-0.01em]">
                  Recent meetings
                </h2>
                <Link
                  href="/meetings"
                  className="text-[14px] text-[#007AFF] flex items-center gap-1.5 hover:text-[#0066DD] transition-colors font-medium"
                >
                  See all <ArrowRight size={13} strokeWidth={2.5} />
                </Link>
              </div>

              {loading ? (
                <div className="space-y-3">
                  {[1, 2, 3].map(i => (
                    <div
                      key={i}
                      className="h-[72px] rounded-2xl bg-gradient-to-r from-black/[0.02] to-black/[0.01] animate-pulse border border-black/[0.03]"
                    />
                  ))}
                </div>
              ) : meetings.length === 0 ? (
                <div className="rounded-[22px] bg-white/60 backdrop-blur-2xl p-12 text-center border border-black/[0.04] shadow-[0_1px_3px_rgba(0,0,0,0.03)]">
                  <div className="w-16 h-16 rounded-full bg-[#f5f5f7] flex items-center justify-center mx-auto mb-5">
                    <Video size={28} className="text-[#c7c7cc]" />
                  </div>
                  <p className="text-[17px] font-semibold text-[#1d1d1f] tracking-tight">No meetings yet</p>
                  <p className="text-[15px] text-[#86868b] mt-2 max-w-[300px] mx-auto leading-relaxed font-normal">
                    Record your first meeting or import a YouTube video to get started.
                  </p>
                </div>
              ) : (
                <div className="rounded-[20px] bg-white/60 backdrop-blur-2xl border border-black/[0.04] shadow-[0_1px_3px_rgba(0,0,0,0.03),0_4px_12px_rgba(0,0,0,0.02)] overflow-hidden divide-y divide-black/[0.04]">
                  {meetings.map(m => (
                    <Link
                      key={m.id}
                      href={`/meetings/${m.id}`}
                      className="group flex items-center gap-4 px-5 py-4 hover:bg-black/[0.015] transition-colors duration-150"
                    >
                      <div className="w-10 h-10 rounded-[12px] flex items-center justify-center flex-shrink-0 bg-[#f5f5f7] border border-black/[0.04] group-hover:bg-[#e8e8ed] transition-colors duration-200">
                        {m.source === 'youtube' ? (
                          <Youtube size={17} className="text-[#FF3B30]" />
                        ) : (
                          <Video size={17} className="text-[#007AFF]" />
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <p className="text-[15px] font-medium text-[#1d1d1f] truncate group-hover:text-[#007AFF] transition-colors duration-200 tracking-tight">
                          {m.title}
                        </p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <p className="text-[13px] text-[#86868b] font-normal">
                            {formatDate(m.started_at || m.created_at)}
                          </p>
                          {m.duration_seconds && (
                            <>
                              <span className="w-[3px] h-[3px] rounded-full bg-[#d1d1d6]" />
                              <p className="text-[13px] text-[#86868b] font-normal">{formatDuration(m.duration_seconds)}</p>
                            </>
                          )}
                        </div>
                      </div>

                      <ChevronRight
                        size={16}
                        strokeWidth={2.5}
                        className="text-[#c7c7cc] group-hover:text-[#007AFF] group-hover:translate-x-0.5 transition-all duration-200 flex-shrink-0"
                      />
                    </Link>
                  ))}
                </div>
              )}
            </section>

            {/* Today's schedule */}
            <section>
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-[22px] font-semibold text-[#1d1d1f] tracking-[-0.01em]">
                  Today&apos;s schedule
                </h2>
                <Link
                  href="/calendar"
                  className="text-[14px] text-[#007AFF] hover:text-[#0066DD] transition-colors font-medium"
                >
                  View calendar
                </Link>
              </div>

              {upcomingEvents.length === 0 ? (
                <div className="rounded-[20px] bg-white/50 backdrop-blur-2xl border border-black/[0.04] p-8 text-center shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
                  <p className="text-[15px] text-[#86868b] font-normal">No upcoming events scheduled for today.</p>
                </div>
              ) : (
                <div className="rounded-[20px] bg-white/60 backdrop-blur-2xl border border-black/[0.04] shadow-[0_1px_3px_rgba(0,0,0,0.03),0_4px_12px_rgba(0,0,0,0.02)] overflow-hidden divide-y divide-black/[0.04]">
                  {upcomingEvents.map(event => (
                    <div
                      key={event.id}
                      className="flex items-center justify-between px-5 py-4"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-[12px] bg-[#f5f5f7] border border-black/[0.04] flex items-center justify-center">
                          <Clock size={17} className="text-[#86868b]" />
                        </div>
                        <div>
                          <p className="text-[15px] font-medium text-[#1d1d1f] tracking-tight">{event.title}</p>
                          <p className="text-[13px] text-[#86868b] mt-0.5 font-normal">{formatTime(event.start_time)}</p>
                        </div>
                      </div>

                      {event.meet_link && (
                        <a
                          href={event.meet_link}
                          target="_blank"
                          rel="noreferrer"
                          className="text-[13px] font-semibold text-white bg-[#34C759] hover:bg-[#30B350] px-5 py-2 rounded-full transition-all duration-200 shadow-[0_1px_4px_rgba(52,199,89,0.25)] hover:shadow-[0_4px_16px_-4px_rgba(52,199,89,0.35)] active:scale-[0.97]"
                        >
                          Join
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </section>
          </div>

          {/* Right column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Ask Recall widget */}
            <section className="rounded-[22px] bg-white/70 backdrop-blur-2xl border border-black/[0.04] shadow-[0_1px_3px_rgba(0,0,0,0.04),0_8px_24px_rgba(0,0,0,0.04)] overflow-hidden relative">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 via-transparent to-violet-50/20 pointer-events-none" />
              <div className="relative z-10 p-6">
                <div className="flex items-center gap-3 mb-1">
                  <div className="w-9 h-9 rounded-[12px] bg-gradient-to-b from-[#007AFF] to-[#005EC4] flex items-center justify-center shadow-[0_2px_8px_-2px_rgba(0,122,255,0.35)]">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" className="text-white">
                      <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                  <h2 className="text-[18px] font-semibold text-[#1d1d1f] tracking-tight">
                    Ask Recall
                  </h2>
                </div>
                <p className="text-[13px] text-[#86868b] mb-5 ml-12 font-normal leading-relaxed">
                  Query your meeting history using natural language.
                </p>

                <form onSubmit={handleAsk} className="space-y-3">
                  <input
                    type="text"
                    value={askInput}
                    onChange={e => setAskInput(e.target.value)}
                    placeholder="e.g. What were the Q3 priorities?"
                    className="w-full bg-[#f5f5f7] border border-black/[0.04] rounded-[14px] px-4 py-3 text-[14px] text-[#1d1d1f] placeholder-[#aeaeb2] focus:outline-none focus:bg-white focus:border-[#007AFF]/30 focus:ring-2 focus:ring-[#007AFF]/10 transition-all duration-200"
                  />
                  <button
                    type="submit"
                    disabled={askLoading || !askInput.trim()}
                    className="w-full bg-[#007AFF] hover:bg-[#0071EB] text-white rounded-[14px] py-3 text-[14px] font-semibold transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed shadow-[0_1px_4px_rgba(0,122,255,0.20)] hover:shadow-[0_4px_16px_-4px_rgba(0,122,255,0.35)] active:scale-[0.98]"
                  >
                    {askLoading ? (
                      <span className="flex items-center justify-center gap-2">
                        <svg className="animate-spin h-4 w-4 text-white/80" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        Searching…
                      </span>
                    ) : (
                      'Ask AI'
                    )}
                  </button>
                </form>

                {askAnswer && (
                  <div className="mt-4 p-4 bg-[#f5f5f7] rounded-[14px] border border-black/[0.03] text-[14px] text-[#48484a] leading-[1.65]">
                    {askAnswer}
                  </div>
                )}
              </div>
            </section>

            {/* Pending action items */}
            <section className="rounded-[22px] bg-white/70 backdrop-blur-2xl border border-black/[0.04] shadow-[0_1px_3px_rgba(0,0,0,0.04),0_8px_24px_rgba(0,0,0,0.04)] p-6">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-[18px] font-semibold text-[#1d1d1f] tracking-tight">
                  Open action items
                </h2>
                <span className="text-[12px] font-medium text-[#86868b] bg-[#f5f5f7] px-3 py-1.5 rounded-full border border-black/[0.03]">
                  {actionItems.length} pending
                </span>
              </div>

              {actionItems.length === 0 ? (
                <div className="text-center py-8">
                  <div className="w-14 h-14 rounded-full bg-[#f0faf0] flex items-center justify-center mx-auto mb-3 border border-[#34C759]/10">
                    <CheckSquare size={22} className="text-[#34C759]" />
                  </div>
                  <p className="text-[15px] text-[#86868b] font-normal">All action items completed!</p>
                </div>
              ) : (
                <div className="space-y-1">
                  {actionItems.map(item => (
                    <div
                      key={item.id}
                      className="flex items-start gap-3.5 text-[14px] rounded-[14px] p-3.5 hover:bg-[#f5f5f7]/60 transition-colors duration-150"
                    >
                      <div className="w-[22px] h-[22px] rounded-[7px] border-[1.5px] border-[#007AFF]/30 bg-[#007AFF]/[0.06] flex items-center justify-center flex-shrink-0 mt-[1px]">
                        <CheckSquare size={12} className="text-[#007AFF]" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[#1d1d1f] leading-relaxed font-normal">{item.task}</p>
                        {item.meetings?.title && (
                          <p className="text-[12px] text-[#aeaeb2] mt-1 font-normal truncate">{item.meetings.title}</p>
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
    </div>
  )
}