'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Video, Youtube, Search as SearchIcon, Clock, ChevronRight, Users } from 'lucide-react'

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

const SOURCE_LABELS: Record<string, string> = {
  google_meet: 'Google Meet',
  browser: 'Browser',
  youtube: 'YouTube',
  imported: 'Imported',
}

export default function MeetingsPage() {
  const [meetings, setMeetings] = useState<Meeting[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState<string>('all')
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)

  useEffect(() => {
    loadMeetings()
  }, [page, filter])

  async function loadMeetings() {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        page: String(page),
        limit: '20',
      })
      if (filter !== 'all') params.set('source', filter)
      const res = await fetch(`/api/meetings?${params}`)
      const data = await res.json()
      setMeetings(data.meetings ?? [])
      setTotal(data.total ?? 0)
    } finally {
      setLoading(false)
    }
  }

  const filtered = search
    ? meetings.filter(m => m.title.toLowerCase().includes(search.toLowerCase()))
    : meetings

  const formatDuration = (s: number | null) => {
    if (!s) return null
    const h = Math.floor(s / 3600)
    const m = Math.floor((s % 3600) / 60)
    return h > 0 ? `${h}h ${m}m` : `${m}m`
  }

  const formatDate = (d: string | null) => {
    if (!d) return ''
    return new Date(d).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
  }

  return (
    <div
      className="min-h-screen relative"
      style={{
        background: 'linear-gradient(180deg, #fbfbfd 0%, #f5f5f7 40%, #fbfbfd 100%)',
        fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", "Helvetica Neue", Helvetica, Arial, sans-serif',
      }}
    >
      {/* Ambient washes */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-[30%] -left-[10%] w-[600px] h-[600px] rounded-full bg-gradient-to-br from-blue-100/30 via-indigo-50/15 to-transparent blur-[100px]" />
        <div className="absolute -bottom-[20%] -right-[10%] w-[500px] h-[500px] rounded-full bg-gradient-to-tl from-purple-100/25 via-pink-50/10 to-transparent blur-[90px]" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-6 sm:px-8 py-10 sm:py-14">
        {/* Header */}
        <div className="flex items-end justify-between mb-8">
          <div>
            <h1 className="text-[34px] sm:text-[42px] font-semibold text-[#1d1d1f] tracking-[-0.02em] leading-tight">
              Meetings
            </h1>
            <p className="text-[17px] text-[#86868b] mt-2 font-normal">
              {total} {total === 1 ? 'meeting' : 'meetings'} in your library
            </p>
          </div>
        </div>

        {/* Search + filter bar */}
        <div className="rounded-[20px] bg-white/70 backdrop-blur-2xl border border-black/[0.04] shadow-[0_1px_3px_rgba(0,0,0,0.04),0_8px_24px_rgba(0,0,0,0.03)] p-4 mb-6">
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Search */}
            <div className="flex-1 relative group">
              <SearchIcon
                size={16}
                strokeWidth={2.5}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#aeaeb2] group-focus-within:text-[#007AFF] transition-colors duration-200"
              />
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search meetings…"
                className="w-full pl-10 pr-4 py-2.5 bg-[#f5f5f7] border border-black/[0.04] rounded-[12px] text-[14px] text-[#1d1d1f] placeholder-[#aeaeb2] outline-none focus:bg-white focus:border-[#007AFF]/30 focus:ring-2 focus:ring-[#007AFF]/10 transition-all duration-200"
              />
            </div>

            {/* Segmented filter */}
            <div className="flex gap-1 p-1 bg-[#f5f5f7] rounded-[12px] border border-black/[0.04]">
              {['all', 'google_meet', 'browser', 'youtube'].map(f => (
                <button
                  key={f}
                  onClick={() => { setFilter(f); setPage(1) }}
                  className={`px-3.5 py-1.5 rounded-[9px] text-[13px] font-medium transition-all duration-200 whitespace-nowrap ${filter === f
                      ? 'bg-white text-[#1d1d1f] shadow-[0_1px_3px_rgba(0,0,0,0.08),0_1px_2px_rgba(0,0,0,0.04)]'
                      : 'text-[#86868b] hover:text-[#1d1d1f]'
                    }`}
                >
                  {f === 'all' ? 'All' : SOURCE_LABELS[f]}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Meetings list */}
        {loading ? (
          <div className="rounded-[20px] bg-white/60 backdrop-blur-2xl border border-black/[0.04] overflow-hidden divide-y divide-black/[0.04]">
            {[1, 2, 3, 4, 5].map(i => (
              <div key={i} className="h-[76px] bg-gradient-to-r from-black/[0.02] to-transparent animate-pulse" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="rounded-[22px] bg-white/70 backdrop-blur-2xl border border-black/[0.04] shadow-[0_1px_3px_rgba(0,0,0,0.04)] p-14 text-center">
            <div className="w-16 h-16 rounded-full bg-[#f5f5f7] flex items-center justify-center mx-auto mb-5">
              <Video size={28} className="text-[#c7c7cc]" />
            </div>
            <p className="text-[17px] font-semibold text-[#1d1d1f] tracking-tight">No meetings found</p>
            <p className="text-[15px] text-[#86868b] mt-2 max-w-[320px] mx-auto leading-relaxed font-normal">
              {search ? 'Try a different search term or clear your filters.' : 'Record a meeting or import a YouTube video to get started.'}
            </p>
          </div>
        ) : (
          <div className="rounded-[20px] bg-white/70 backdrop-blur-2xl border border-black/[0.04] shadow-[0_1px_3px_rgba(0,0,0,0.04),0_8px_24px_rgba(0,0,0,0.03)] overflow-hidden divide-y divide-black/[0.04]">
            {filtered.map(m => (
              <Link
                key={m.id}
                href={`/meetings/${m.id}`}
                className="group flex items-center gap-4 px-5 py-4 hover:bg-black/[0.015] transition-colors duration-150"
              >
                <div className="w-11 h-11 rounded-[13px] flex items-center justify-center flex-shrink-0 bg-[#f5f5f7] border border-black/[0.04] group-hover:bg-[#e8e8ed] transition-colors duration-200">
                  {m.source === 'youtube' ? (
                    <Youtube size={18} className="text-[#FF3B30]" />
                  ) : (
                    <Video size={18} className="text-[#007AFF]" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-[15px] font-medium text-[#1d1d1f] truncate group-hover:text-[#007AFF] transition-colors duration-200 tracking-tight">
                      {m.title}
                    </p>
                    <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full flex-shrink-0 ${m.status === 'complete' ? 'bg-[#34C759]/10 text-[#248A3D]' :
                        m.status === 'failed' ? 'bg-[#FF3B30]/10 text-[#D70015]' :
                          'bg-[#FF9500]/10 text-[#C93400]'
                      }`}>
                      {m.status === 'complete' ? 'Ready' : m.status}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mt-1 flex-wrap">
                    <span className="text-[13px] text-[#86868b] font-normal">{formatDate(m.started_at || m.created_at)}</span>
                    {m.duration_seconds && (
                      <>
                        <span className="w-[3px] h-[3px] rounded-full bg-[#d1d1d6]" />
                        <span className="text-[13px] text-[#86868b] font-normal flex items-center gap-1">
                          <Clock size={11} strokeWidth={2.5} /> {formatDuration(m.duration_seconds)}
                        </span>
                      </>
                    )}
                    {m.participant_count > 1 && (
                      <>
                        <span className="w-[3px] h-[3px] rounded-full bg-[#d1d1d6]" />
                        <span className="text-[13px] text-[#86868b] font-normal flex items-center gap-1">
                          <Users size={11} strokeWidth={2.5} /> {m.participant_count}
                        </span>
                      </>
                    )}
                  </div>
                </div>

                <span className="hidden sm:inline-flex text-[12px] font-medium text-[#86868b] bg-[#f5f5f7] px-2.5 py-1 rounded-full border border-black/[0.03]">
                  {SOURCE_LABELS[m.source]}
                </span>

                <ChevronRight
                  size={16}
                  strokeWidth={2.5}
                  className="text-[#c7c7cc] group-hover:text-[#007AFF] group-hover:translate-x-0.5 transition-all duration-200 flex-shrink-0"
                />
              </Link>
            ))}
          </div>
        )}

        {/* Pagination */}
        {total > 20 && (
          <div className="flex items-center justify-center gap-3 mt-8">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-5 py-2.5 bg-white/70 backdrop-blur-xl border border-black/[0.05] rounded-full text-[13px] font-medium text-[#1d1d1f] disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white hover:shadow-[0_2px_8px_rgba(0,0,0,0.06)] transition-all duration-200 active:scale-[0.97]"
            >
              Previous
            </button>
            <span className="text-[13px] text-[#86868b] font-medium tabular-nums">
              Page {page} of {Math.ceil(total / 20)}
            </span>
            <button
              onClick={() => setPage(p => p + 1)}
              disabled={page >= Math.ceil(total / 20)}
              className="px-5 py-2.5 bg-white/70 backdrop-blur-xl border border-black/[0.05] rounded-full text-[13px] font-medium text-[#1d1d1f] disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white hover:shadow-[0_2px_8px_rgba(0,0,0,0.06)] transition-all duration-200 active:scale-[0.97]"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  )
}