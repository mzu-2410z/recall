'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Video, Youtube, Search as SearchIcon, Filter, Clock, ChevronRight, CheckSquare } from 'lucide-react'

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
    <div className="max-w-4xl mx-auto px-6 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-[28px] font-semibold text-[#1D1D1F] tracking-tight">Meetings</h1>
          <p className="text-[15px] text-[#6E6E73] mt-0.5">{total} total</p>
        </div>
      </div>

      {/* Search + filter bar */}
      <div className="flex gap-3 mb-5">
        <div className="flex-1 relative">
          <SearchIcon size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#86868B]" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search meetings…"
            className="w-full pl-9 pr-4 py-2.5 bg-white border border-black/[0.08] rounded-xl text-[14px] text-[#1D1D1F] placeholder-[#86868B] outline-none focus:border-[#007AFF] transition-colors"
          />
        </div>
        <div className="flex gap-2">
          {['all', 'google_meet', 'browser', 'youtube'].map(f => (
            <button
              key={f}
              onClick={() => { setFilter(f); setPage(1) }}
              className={`px-3 py-2 rounded-xl text-[13px] font-medium transition-colors ${
                filter === f
                  ? 'bg-[#007AFF] text-white'
                  : 'bg-white border border-black/[0.08] text-[#6E6E73] hover:border-[#007AFF]/30'
              }`}
            >
              {f === 'all' ? 'All' : SOURCE_LABELS[f]}
            </button>
          ))}
        </div>
      </div>

      {/* Meetings list */}
      {loading ? (
        <div className="space-y-2">
          {[1,2,3,4,5].map(i => (
            <div key={i} className="h-18 bg-white rounded-xl animate-pulse" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-black/[0.06] p-12 text-center">
          <Video size={40} className="mx-auto text-[#C7C7CC] mb-4" />
          <p className="text-[17px] font-medium text-[#1D1D1F]">No meetings found</p>
          <p className="text-[14px] text-[#86868B] mt-1">
            {search ? 'Try a different search term.' : 'Record a meeting or import a YouTube video to get started.'}
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map(m => (
            <Link
              key={m.id}
              href={`/meetings/${m.id}`}
              className="flex items-center gap-4 bg-white rounded-xl border border-black/[0.06] px-4 py-4 hover:border-[#007AFF]/20 hover:bg-[#007AFF]/[0.01] transition-all duration-100 group"
            >
              <div className="w-10 h-10 rounded-xl bg-[#007AFF]/10 flex items-center justify-center flex-shrink-0">
                {m.source === 'youtube' ? (
                  <Youtube size={18} className="text-[#FF3B30]" />
                ) : (
                  <Video size={18} className="text-[#007AFF]" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[15px] font-medium text-[#1D1D1F] truncate">{m.title}</p>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-[12px] text-[#86868B]">{formatDate(m.started_at || m.created_at)}</span>
                  {m.duration_seconds && (
                    <>
                      <span className="text-[#C7C7CC]">·</span>
                      <span className="text-[12px] text-[#86868B] flex items-center gap-1">
                        <Clock size={11} /> {formatDuration(m.duration_seconds)}
                      </span>
                    </>
                  )}
                  {m.participant_count > 1 && (
                    <>
                      <span className="text-[#C7C7CC]">·</span>
                      <span className="text-[12px] text-[#86868B]">{m.participant_count} people</span>
                    </>
                  )}
                  <span className={`text-[11px] font-medium px-1.5 py-0.5 rounded-md ml-1 ${
                    m.status === 'complete' ? 'bg-[#34C759]/10 text-[#34C759]' :
                    m.status === 'failed' ? 'bg-[#FF3B30]/10 text-[#FF3B30]' :
                    'bg-[#FF9500]/10 text-[#FF9500]'
                  }`}>
                    {m.status === 'complete' ? 'Ready' : m.status}
                  </span>
                </div>
              </div>
              <span className="text-[12px] text-[#86868B]">{SOURCE_LABELS[m.source]}</span>
              <ChevronRight size={15} className="text-[#C7C7CC] group-hover:text-[#007AFF] transition-colors flex-shrink-0" />
            </Link>
          ))}
        </div>
      )}

      {/* Pagination */}
      {total > 20 && (
        <div className="flex justify-center gap-2 mt-6">
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-4 py-2 bg-white border border-black/[0.08] rounded-xl text-[14px] text-[#6E6E73] disabled:opacity-40 hover:border-[#007AFF]/30 transition-colors"
          >
            Previous
          </button>
          <span className="px-4 py-2 text-[14px] text-[#6E6E73]">
            Page {page} of {Math.ceil(total / 20)}
          </span>
          <button
            onClick={() => setPage(p => p + 1)}
            disabled={page >= Math.ceil(total / 20)}
            className="px-4 py-2 bg-white border border-black/[0.08] rounded-xl text-[14px] text-[#6E6E73] disabled:opacity-40 hover:border-[#007AFF]/30 transition-colors"
          >
            Next
          </button>
        </div>
      )}
    </div>
  )
}
