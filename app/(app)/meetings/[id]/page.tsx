'use client'

import { useEffect, useState, useRef } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  Play, Pause, Volume2, VolumeX, Maximize, SkipBack, SkipForward,
  Clock, Calendar, User, Share2, Sparkles, CheckSquare, MessageSquare,
  Search, Download, Scissors, ChevronLeft, Check, Copy, Tag, RefreshCw
} from 'lucide-react'

interface Segment {
  id: string
  speaker_name: string
  speaker_avatar_url?: string
  start_time: number
  end_time: number
  text: string
}

interface ActionItem {
  id: string
  text: string
  assignee?: string
  due_date?: string
  completed: boolean
}

interface Highlight {
  id: string
  category: 'decision' | 'action' | 'insight' | 'key_point'
  text: string
  start_time: number
  end_time: number
}

interface Summary {
  overview: string
  key_points: string[]
  decisions: string[]
  topics: { title: string; timestamp: number }[]
}

interface Meeting {
  id: string
  title: string
  created_at: string
  duration_seconds: number
  source: 'google_meet' | 'browser_recorder' | 'youtube'
  status: 'transcribing' | 'analyzing' | 'completed' | 'failed'
  meeting_url?: string
  summary?: Summary
  segments: Segment[]
  actionItems: ActionItem[]
  highlights: Highlight[]
}

export default function MeetingDetailPage() {
  const params = useParams()
  const meetingId = params.id as string
  const router = useRouter()

  const [meeting, setMeeting] = useState<Meeting | null>(null)
  const [loading, setLoading] = useState(true)
  const [playbackUrl, setPlaybackUrl] = useState<string | null>(null)
  
  // Media Player State
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(1)
  const [isMuted, setIsMuted] = useState(false)
  
  // UI Tabs & Filters
  const [activeTab, setActiveTab] = useState<'summary' | 'transcript' | 'action-items' | 'highlights'>('summary')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedSpeaker, setSelectedSpeaker] = useState<string>('all')
  const [copied, setCopied] = useState(false)
  const [isSummarizing, setIsSummarizing] = useState(false)

  useEffect(() => {
    async function fetchMeetingData() {
      try {
        setLoading(true)
        const res = await fetch(`/api/meetings/${meetingId}`)
        if (!res.ok) {
          if (res.status === 404) {
            router.push('/meetings')
            return
          }
          throw new Error('Failed to fetch meeting')
        }
        const data = await res.json()
        setMeeting(data.meeting || data)

        // Fetch playback URL
        const urlRes = await fetch(`/api/recordings/${meetingId}/url`)
        if (urlRes.ok) {
          const urlData = await urlRes.json()
          setPlaybackUrl(urlData.url)
        }
      } catch (err) {
        console.error('Error loading meeting details:', err)
      } finally {
        setLoading(false)
      }
    }
    if (meetingId) {
      fetchMeetingData()
    }
  }, [meetingId, router])

  const togglePlay = () => {
    if (!videoRef.current) return
    if (isPlaying) {
      videoRef.current.pause()
    } else {
      videoRef.current.play()
    }
    setIsPlaying(!isPlaying)
  }

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime)
    }
  }

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration)
    }
  }

  const seekTo = (seconds: number) => {
    if (videoRef.current) {
      videoRef.current.currentTime = seconds
      setCurrentTime(seconds)
      if (!isPlaying) {
        videoRef.current.play()
        setIsPlaying(true)
      }
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const handleToggleActionItem = async (itemId: string, currentStatus: boolean) => {
    if (!meeting) return
    // Optimistic update
    setMeeting(prev => {
      if (!prev) return null
      return {
        ...prev,
        actionItems: prev.actionItems.map(item =>
          item.id === itemId ? { ...item, completed: !currentStatus } : item
        )
      }
    })

    try {
      await fetch(`/api/meetings/${meetingId}/action-items`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ itemId, completed: !currentStatus })
      })
    } catch (err) {
      console.error('Failed to update action item', err)
    }
  }

  const handleTriggerSummary = async () => {
    setIsSummarizing(true)
    try {
      const res = await fetch(`/api/meetings/${meetingId}/summarize`, {
        method: 'POST'
      })
      if (res.ok) {
        const data = await res.json()
        setMeeting(prev => prev ? { ...prev, summary: data.summary } : null)
      }
    } catch (err) {
      console.error('Failed to re-summarize', err)
    } finally {
      setIsSummarizing(false)
    }
  }

  const copyShareLink = () => {
    navigator.clipboard.writeText(window.location.href)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-cyan-500 border-t-transparent" />
          <p className="text-sm text-slate-400">Loading meeting intelligence...</p>
        </div>
      </div>
    )
  }

  if (!meeting) {
    return (
      <div className="p-8 text-center">
        <h2 className="text-lg font-semibold text-slate-200">Meeting Not Found</h2>
        <p className="mt-2 text-sm text-slate-400">The requested meeting does not exist or you do not have access.</p>
        <Link href="/meetings" className="mt-4 inline-flex items-center gap-2 text-sm text-cyan-400 hover:text-cyan-300">
          <ChevronLeft className="h-4 w-4" /> Back to Meetings
        </Link>
      </div>
    )
  }

  const speakers = Array.from(new Set((meeting.segments || []).map(s => s.speaker_name)))

  const filteredSegments = (meeting.segments || []).filter(segment => {
    const matchesSpeaker = selectedSpeaker === 'all' || segment.speaker_name === selectedSpeaker
    const matchesSearch = searchQuery === '' || segment.text.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesSpeaker && matchesSearch
  })

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <Link href="/meetings" className="rounded-lg border border-slate-800 p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white">
              <ChevronLeft className="h-5 w-5" />
            </Link>
            <h1 className="text-2xl font-bold text-white">{meeting.title}</h1>
          </div>
          <div className="mt-2 flex flex-wrap items-center gap-4 text-xs text-slate-400">
            <span className="flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5 text-slate-500" />
              {new Date(meeting.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5 text-slate-500" />
              {Math.round((meeting.duration_seconds || 0) / 60)} min duration
            </span>
            <span className="rounded-full bg-slate-800 px-2.5 py-0.5 font-medium text-slate-300 capitalize">
              {meeting.source.replace('_', ' ')}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={copyShareLink}
            className="flex items-center gap-2 rounded-lg border border-slate-800 bg-slate-900 px-3 py-2 text-xs font-medium text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
          >
            {copied ? <Check className="h-4 w-4 text-emerald-400" /> : <Share2 className="h-4 w-4" />}
            {copied ? 'Copied Link' : 'Share'}
          </button>

          <button
            onClick={handleTriggerSummary}
            disabled={isSummarizing}
            className="flex items-center gap-2 rounded-lg bg-cyan-600 px-3 py-2 text-xs font-medium text-white hover:bg-cyan-500 transition-colors disabled:opacity-50"
          >
            <Sparkles className={`h-4 w-4 ${isSummarizing ? 'animate-spin' : ''}`} />
            {isSummarizing ? 'Analyzing...' : 'Re-summarize AI'}
          </button>
        </div>
      </div>

      {/* Main Grid: Video Player + Content Tabs */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Left Column: Player & Video Controls */}
        <div className="space-y-4 lg:col-span-7">
          <div className="relative overflow-hidden rounded-xl border border-slate-800 bg-slate-950 aspect-video shadow-2xl">
            {playbackUrl ? (
              <video
                ref={videoRef}
                src={playbackUrl}
                onTimeUpdate={handleTimeUpdate}
                onLoadedMetadata={handleLoadedMetadata}
                onEnded={() => setIsPlaying(false)}
                className="h-full w-full object-contain"
              />
            ) : (
              <div className="flex h-full w-full flex-col items-center justify-center p-6 text-center">
                <div className="rounded-full bg-slate-900 p-4 text-cyan-400 mb-3 border border-slate-800">
                  <Play className="h-8 w-8" />
                </div>
                <p className="text-sm font-medium text-slate-300">Audio / Video Processing</p>
                <p className="mt-1 text-xs text-slate-500 max-w-sm">
                  Full audio wave interactive playback available. Click timestamps in the transcript to navigate segments.
                </p>
              </div>
            )}

            {/* Custom Overlay Controls */}
            {playbackUrl && (
              <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-slate-950/90 via-slate-950/50 to-transparent p-4 flex flex-col gap-2">
                {/* Progress Bar */}
                <input
                  type="range"
                  min="0"
                  max={duration || 100}
                  value={currentTime}
                  onChange={(e) => seekTo(parseFloat(e.target.value))}
                  className="w-full h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cyan-400"
                />

                <div className="flex items-center justify-between text-xs text-slate-300">
                  <div className="flex items-center gap-3">
                    <button onClick={togglePlay} className="hover:text-white p-1">
                      {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
                    </button>
                    <span>{formatTime(currentTime)} / {formatTime(duration)}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setIsMuted(!isMuted)}
                      className="hover:text-white p-1"
                    >
                      {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Speakers List */}
          {speakers.length > 0 && (
            <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-4 backdrop-blur-sm">
              <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Participants ({speakers.length})</h3>
              <div className="flex flex-wrap gap-2">
                {speakers.map(speaker => (
                  <span
                    key={speaker}
                    className="inline-flex items-center gap-2 rounded-full border border-slate-800 bg-slate-900 px-3 py-1 text-xs text-slate-300"
                  >
                    <User className="h-3 w-3 text-cyan-400" />
                    {speaker}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Tabbed Content (Summary, Transcript, Action Items, Highlights) */}
        <div className="flex flex-col rounded-xl border border-slate-800 bg-slate-900/60 lg:col-span-5 h-[600px] overflow-hidden">
          {/* Navigation Tabs Header */}
          <div className="flex border-b border-slate-800 bg-slate-900/80 p-2 gap-1 overflow-x-auto">
            <button
              onClick={() => setActiveTab('summary')}
              className={`flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium transition-colors ${
                activeTab === 'summary'
                  ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <Sparkles className="h-3.5 w-3.5" /> Summary
            </button>
            <button
              onClick={() => setActiveTab('transcript')}
              className={`flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium transition-colors ${
                activeTab === 'transcript'
                  ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <MessageSquare className="h-3.5 w-3.5" /> Transcript
            </button>
            <button
              onClick={() => setActiveTab('action-items')}
              className={`flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium transition-colors ${
                activeTab === 'action-items'
                  ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <CheckSquare className="h-3.5 w-3.5" /> Action Items ({meeting.actionItems?.length || 0})
            </button>
            <button
              onClick={() => setActiveTab('highlights')}
              className={`flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium transition-colors ${
                activeTab === 'highlights'
                  ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <Tag className="h-3.5 w-3.5" /> Highlights
            </button>
          </div>

          {/* Tab Contents */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {/* TAB 1: Summary */}
            {activeTab === 'summary' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-xs font-semibold text-cyan-400 uppercase tracking-wider mb-2">Executive Summary</h3>
                  <p className="text-sm text-slate-300 leading-relaxed bg-slate-950/40 rounded-lg p-3 border border-slate-800/60">
                    {meeting.summary?.overview || 'AI summary generated automatically from transcript analysis.'}
                  </p>
                </div>

                {meeting.summary?.key_points && meeting.summary.key_points.length > 0 && (
                  <div>
                    <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Key Discussion Points</h3>
                    <ul className="space-y-2">
                      {meeting.summary.key_points.map((pt, idx) => (
                        <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-300">
                          <span className="mt-1 h-1.5 w-1.5 rounded-full bg-cyan-400 shrink-0" />
                          <span>{pt}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {meeting.summary?.decisions && meeting.summary.decisions.length > 0 && (
                  <div>
                    <h3 className="text-xs font-semibold text-emerald-400 uppercase tracking-wider mb-2">Decisions Made</h3>
                    <div className="space-y-2">
                      {meeting.summary.decisions.map((dec, idx) => (
                        <div key={idx} className="rounded-lg border border-emerald-500/20 bg-emerald-500/5 p-3 text-xs text-emerald-300">
                          {dec}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* TAB 2: Interactive Synchronized Transcript */}
            {activeTab === 'transcript' && (
              <div className="space-y-4">
                {/* Search & Speaker Filter */}
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-500" />
                    <input
                      type="text"
                      placeholder="Search transcript..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full rounded-lg border border-slate-800 bg-slate-950 pl-8 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-cyan-500"
                    />
                  </div>
                  <select
                    value={selectedSpeaker}
                    onChange={(e) => setSelectedSpeaker(e.target.value)}
                    className="rounded-lg border border-slate-800 bg-slate-950 px-3 py-1.5 text-xs text-slate-300 focus:outline-none focus:ring-1 focus:ring-cyan-500"
                  >
                    <option value="all">All Speakers</option>
                    {speakers.map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>

                {/* Segments List */}
                <div className="space-y-3">
                  {filteredSegments.length === 0 ? (
                    <p className="text-center py-8 text-xs text-slate-500">No transcript matching search query.</p>
                  ) : (
                    filteredSegments.map(segment => {
                      const isActive = currentTime >= segment.start_time && currentTime <= segment.end_time
                      return (
                        <div
                          key={segment.id}
                          onClick={() => seekTo(segment.start_time)}
                          className={`group cursor-pointer rounded-lg border p-3 transition-all ${
                            isActive
                              ? 'border-cyan-500/40 bg-cyan-500/10 shadow-sm'
                              : 'border-slate-800/80 bg-slate-950/40 hover:border-slate-700 hover:bg-slate-900/60'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-1.5">
                            <span className="text-xs font-semibold text-cyan-400">{segment.speaker_name}</span>
                            <span className="text-[10px] font-mono text-slate-500 group-hover:text-cyan-300">
                              {formatTime(segment.start_time)}
                            </span>
                          </div>
                          <p className="text-xs text-slate-300 leading-relaxed">{segment.text}</p>
                        </div>
                      )
                    })
                  )}
                </div>
              </div>
            )}

            {/* TAB 3: Action Items */}
            {activeTab === 'action-items' && (
              <div className="space-y-3">
                <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Extracted Action Items</h3>
                {(!meeting.actionItems || meeting.actionItems.length === 0) ? (
                  <p className="text-xs text-slate-500 text-center py-8">No action items extracted for this meeting.</p>
                ) : (
                  meeting.actionItems.map(item => (
                    <div
                      key={item.id}
                      onClick={() => handleToggleActionItem(item.id, item.completed)}
                      className={`flex items-start gap-3 rounded-lg border p-3 cursor-pointer transition-colors ${
                        item.completed
                          ? 'border-slate-800 bg-slate-950/30 text-slate-500 line-through'
                          : 'border-slate-800 bg-slate-950/60 text-slate-200 hover:border-slate-700'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={item.completed}
                        onChange={() => {}}
                        className="mt-0.5 rounded border-slate-700 bg-slate-900 text-cyan-500 focus:ring-0 cursor-pointer"
                      />
                      <div className="flex-1 text-xs">
                        <p>{item.text}</p>
                        {item.assignee && (
                          <p className="mt-1 text-[10px] text-cyan-400">Assigned: {item.assignee}</p>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* TAB 4: Highlights */}
            {activeTab === 'highlights' && (
              <div className="space-y-3">
                <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Key Highlights</h3>
                {(!meeting.highlights || meeting.highlights.length === 0) ? (
                  <p className="text-xs text-slate-500 text-center py-8">No key highlights recorded.</p>
                ) : (
                  meeting.highlights.map(hl => (
                    <div
                      key={hl.id}
                      onClick={() => seekTo(hl.start_time)}
                      className="cursor-pointer rounded-lg border border-slate-800 bg-slate-950/50 p-3 hover:border-cyan-500/40 transition-colors"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className={`text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full ${
                          hl.category === 'decision' ? 'bg-emerald-500/20 text-emerald-400' :
                          hl.category === 'action' ? 'bg-amber-500/20 text-amber-400' : 'bg-cyan-500/20 text-cyan-400'
                        }`}>
                          {hl.category}
                        </span>
                        <span className="text-[10px] font-mono text-slate-500">{formatTime(hl.start_time)}</span>
                      </div>
                      <p className="text-xs text-slate-300 mt-1">{hl.text}</p>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
