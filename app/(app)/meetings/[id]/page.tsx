'use client'

import { useEffect, useState, useRef } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  Play, Pause, Volume2, VolumeX,
  Clock, Calendar, User, Share2, Sparkles, CheckSquare, MessageSquare,
  Search, ChevronLeft, Check, Tag
} from 'lucide-react'

// DB field names — must match transcript_segments table columns
interface Segment {
  id: string
  speaker: string | null
  start_time_ms: number
  end_time_ms: number
  text: string
  sequence_num: number
}

interface ActionItem {
  id: string
  task: string
  owner?: string | null
  deadline?: string | null
  completed: boolean
}

interface Highlight {
  id: string
  timestamp_ms: number
  label?: string | null
  note?: string | null
}

interface MeetingSummary {
  id: string
  summary: string
  key_takeaways: string[]
  decisions: string[]
  action_items: Array<{ task: string; owner: string | null; deadline: string | null }>
  topics: string[]
  important_moments: Array<{ timestamp_ms: number | null; description: string }>
}

interface Meeting {
  id: string
  title: string
  created_at: string
  duration_seconds: number | null
  source: string
  status: string
  recording_path?: string | null
  meeting_summaries: MeetingSummary[]
  action_items: ActionItem[]
  highlights: Highlight[]
  transcript_segments: Segment[]
}

// Deterministic speaker color based on name hash
const SPEAKER_COLORS = [
  { bg: 'rgba(0,113,227,0.08)', border: 'rgba(0,113,227,0.2)', text: '#0071e3', dot: '#0071e3' },
  { bg: 'rgba(94,92,230,0.08)', border: 'rgba(94,92,230,0.2)', text: '#5e5ce6', dot: '#5e5ce6' },
  { bg: 'rgba(52,199,89,0.08)', border: 'rgba(52,199,89,0.2)', text: '#30b855', dot: '#34c759' },
  { bg: 'rgba(255,149,0,0.08)', border: 'rgba(255,149,0,0.2)', text: '#c67200', dot: '#FF9500' },
  { bg: 'rgba(191,90,242,0.08)', border: 'rgba(191,90,242,0.2)', text: '#a020d9', dot: '#bf5af2' },
]
const speakerColor = (name: string) => {
  let h = 0
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) >>> 0
  return SPEAKER_COLORS[h % SPEAKER_COLORS.length]
}

export default function MeetingDetailPage() {
  const params = useParams()
  const meetingId = params.id as string
  const router = useRouter()

  const [meeting, setMeeting] = useState<Meeting | null>(null)
  const [loading, setLoading] = useState(true)
  const [playbackUrl, setPlaybackUrl] = useState<string | null>(null)

  const videoRef = useRef<HTMLVideoElement | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [isMuted, setIsMuted] = useState(false)

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
          if (res.status === 404) { router.push('/meetings'); return }
          throw new Error('Failed to fetch meeting')
        }
        const data = await res.json()
        setMeeting(data.meeting || data)

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
    if (meetingId) fetchMeetingData()
  }, [meetingId, router])

  const togglePlay = () => {
    if (!videoRef.current) return
    if (isPlaying) videoRef.current.pause()
    else videoRef.current.play()
    setIsPlaying(!isPlaying)
  }

  const handleTimeUpdate = () => {
    if (videoRef.current) setCurrentTime(videoRef.current.currentTime)
  }

  const handleLoadedMetadata = () => {
    if (videoRef.current) setDuration(videoRef.current.duration)
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
    setMeeting(prev => {
      if (!prev) return null
      return {
        ...prev,
        action_items: prev.action_items.map(item =>
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
      const res = await fetch(`/api/meetings/${meetingId}/summarize`, { method: 'POST' })
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

  const CSS = `
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;450;500;550;600;650;700&display=swap');

    .meeting-root {
      font-family: -apple-system, 'Inter', BlinkMacSystemFont, 'SF Pro Display', 'SF Pro Text', 'Helvetica Neue', sans-serif;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
      background: linear-gradient(180deg, #f5f5f7 0%, #fbfbfd 40%, #f5f5f7 100%);
      color: #1d1d1f;
      min-height: 100vh;
    }

    .glass-card {
      background: rgba(255, 255, 255, 0.72);
      backdrop-filter: blur(40px) saturate(180%);
      -webkit-backdrop-filter: blur(40px) saturate(180%);
      border: 1px solid rgba(255, 255, 255, 0.85);
      box-shadow:
        0 0 0 0.5px rgba(0,0,0,0.03),
        0 1px 3px rgba(0,0,0,0.04),
        0 8px 32px rgba(0,0,0,0.06);
    }

    .glass-elevated {
      background: rgba(255, 255, 255, 0.82);
      backdrop-filter: blur(60px) saturate(200%);
      -webkit-backdrop-filter: blur(60px) saturate(200%);
      border: 1px solid rgba(255, 255, 255, 0.9);
      box-shadow:
        0 0 0 0.5px rgba(0,0,0,0.03),
        0 2px 8px rgba(0,0,0,0.04),
        0 12px 48px rgba(0,0,0,0.08);
    }

    .btn-primary {
      background: linear-gradient(180deg, #0077ED 0%, #0071e3 100%);
      color: white;
      box-shadow: 0 1px 3px rgba(0,113,227,0.3), inset 0 1px 0 rgba(255,255,255,0.15);
      transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
    }
    .btn-primary:hover:not(:disabled) {
      background: linear-gradient(180deg, #0080f7 0%, #0077ED 100%);
      box-shadow: 0 2px 8px rgba(0,113,227,0.35);
      transform: translateY(-1px);
    }
    .btn-primary:disabled { opacity: 0.45; }

    .btn-secondary {
      background: rgba(255,255,255,0.7);
      color: #1d1d1f;
      border: 1px solid rgba(0,0,0,0.08);
      transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
    }
    .btn-secondary:hover {
      background: rgba(255,255,255,0.95);
      transform: translateY(-1px);
      box-shadow: 0 2px 8px rgba(0,0,0,0.05);
    }

    .back-btn {
      background: rgba(255,255,255,0.6);
      border: 1px solid rgba(0,0,0,0.06);
      color: #6e6e73;
      transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
    }
    .back-btn:hover {
      background: rgba(255,255,255,0.95);
      color: #1d1d1f;
      transform: translateX(-1px);
    }

    .tab-btn {
      background: transparent;
      color: #6e6e73;
      border: 1px solid transparent;
      transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
    }
    .tab-btn:hover {
      color: #1d1d1f;
      background: rgba(0,0,0,0.03);
    }
    .tab-btn.active {
      background: rgba(0,113,227,0.08);
      color: #0071e3;
      border-color: rgba(0,113,227,0.15);
    }

    .segment-card {
      background: rgba(255,255,255,0.55);
      border: 1px solid rgba(0,0,0,0.05);
      transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
      cursor: pointer;
    }
    .segment-card:hover {
      background: rgba(255,255,255,0.85);
      border-color: rgba(0,0,0,0.08);
      transform: translateX(2px);
    }
    .segment-card.active {
      background: rgba(0,113,227,0.06);
      border-color: rgba(0,113,227,0.25);
      box-shadow: 0 2px 12px rgba(0,113,227,0.08);
    }

    .action-card {
      background: rgba(255,255,255,0.6);
      border: 1px solid rgba(0,0,0,0.05);
      transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
    }
    .action-card:hover {
      background: rgba(255,255,255,0.9);
      border-color: rgba(0,0,0,0.08);
    }

    .apple-input {
      background: rgba(255,255,255,0.7);
      border: 1px solid rgba(0,0,0,0.08);
      color: #1d1d1f;
      transition: all 0.15s cubic-bezier(0.16, 1, 0.3, 1);
    }
    .apple-input:focus {
      outline: none;
      background: rgba(255,255,255,0.95);
      border-color: rgba(0,113,227,0.4);
      box-shadow: 0 0 0 4px rgba(0,113,227,0.08);
    }
    .apple-input::placeholder { color: #a0a0a8; }

    .apple-checkbox {
      appearance: none;
      width: 20px; height: 20px;
      border-radius: 6px;
      border: 1.5px solid rgba(0,113,227,0.4);
      background: rgba(255,255,255,0.8);
      cursor: pointer;
      position: relative;
      transition: all 0.15s cubic-bezier(0.16, 1, 0.3, 1);
      flex-shrink: 0;
    }
    .apple-checkbox:checked {
      background: #0071e3;
      border-color: #0071e3;
    }
    .apple-checkbox:checked::after {
      content: '';
      position: absolute;
      left: 5px; top: 1px;
      width: 6px; height: 11px;
      border: solid white;
      border-width: 0 2px 2px 0;
      transform: rotate(45deg);
    }

    .video-shell {
      background: linear-gradient(135deg, #1d1d1f 0%, #2d2d2f 100%);
      border-radius: 20px;
      overflow: hidden;
      border: 1px solid rgba(0,0,0,0.08);
      box-shadow:
        0 0 0 0.5px rgba(0,0,0,0.03),
        0 2px 8px rgba(0,0,0,0.06),
        0 20px 60px rgba(0,0,0,0.12);
      position: relative;
    }

    .video-progress {
      -webkit-appearance: none;
      appearance: none;
      width: 100%;
      height: 4px;
      background: rgba(255,255,255,0.2);
      border-radius: 100px;
      outline: none;
      cursor: pointer;
    }
    .video-progress::-webkit-slider-thumb {
      -webkit-appearance: none;
      appearance: none;
      width: 14px; height: 14px;
      background: white;
      border-radius: 50%;
      cursor: pointer;
      box-shadow: 0 1px 3px rgba(0,0,0,0.3);
      transition: transform 0.15s;
    }
    .video-progress::-webkit-slider-thumb:hover { transform: scale(1.2); }
    .video-progress::-moz-range-thumb {
      width: 14px; height: 14px;
      background: white;
      border: none;
      border-radius: 50%;
      cursor: pointer;
      box-shadow: 0 1px 3px rgba(0,0,0,0.3);
    }

    .video-ctrl-btn {
      background: transparent;
      color: white;
      transition: all 0.15s;
      padding: 6px;
      border-radius: 8px;
    }
    .video-ctrl-btn:hover {
      background: rgba(255,255,255,0.15);
    }

    .source-pill {
      background: rgba(0,0,0,0.05);
      color: #48484a;
      padding: 3px 10px;
      border-radius: 100px;
      font-size: 11px;
      font-weight: 500;
      text-transform: capitalize;
    }

    .speaker-chip {
      background: rgba(255,255,255,0.75);
      border: 1px solid rgba(0,0,0,0.06);
      padding: 5px 12px 5px 5px;
      border-radius: 100px;
      display: inline-flex;
      align-items: center;
      gap: 8px;
      font-size: 12px;
      font-weight: 500;
      color: #1d1d1f;
      transition: all 0.15s cubic-bezier(0.16, 1, 0.3, 1);
    }
    .speaker-chip:hover {
      background: rgba(255,255,255,0.95);
    }
    .speaker-avatar {
      width: 22px; height: 22px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-size: 10px;
      font-weight: 600;
    }

    .section-label {
      font-size: 11px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.06em;
      color: #86868b;
    }

    .decision-card {
      background: rgba(52,199,89,0.06);
      border: 1px solid rgba(52,199,89,0.2);
      color: #1d1d1f;
    }

    .topic-tag {
      background: rgba(0,0,0,0.04);
      border: 1px solid rgba(0,0,0,0.06);
      color: #48484a;
      padding: 4px 10px;
      border-radius: 100px;
      font-size: 11px;
      font-weight: 500;
    }

    .custom-scroll::-webkit-scrollbar { width: 5px; }
    .custom-scroll::-webkit-scrollbar-track { background: transparent; }
    .custom-scroll::-webkit-scrollbar-thumb {
      background: rgba(0,0,0,0.1);
      border-radius: 99px;
    }
    .custom-scroll::-webkit-scrollbar-thumb:hover { background: rgba(0,0,0,0.2); }

    @keyframes shimmer {
      0% { background-position: -1000px 0; }
      100% { background-position: 1000px 0; }
    }
    .skeleton {
      background: linear-gradient(90deg,
        rgba(0,0,0,0.03) 0%,
        rgba(0,0,0,0.06) 50%,
        rgba(0,0,0,0.03) 100%);
      background-size: 1000px 100%;
      animation: shimmer 1.8s infinite linear;
      border-radius: 12px;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }
    .spin { animation: spin 0.8s linear infinite; }
  `

  if (loading) {
    return (
      <>
        <style jsx global>{CSS}</style>
        <div className="meeting-root">
          <div className="max-w-7xl mx-auto px-6 py-10 lg:py-14 space-y-6">
            <div className="skeleton h-8 w-64" />
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-7 space-y-4">
                <div className="skeleton aspect-video rounded-2xl" />
                <div className="skeleton h-24 rounded-2xl" />
              </div>
              <div className="lg:col-span-5">
                <div className="skeleton h-[600px] rounded-2xl" />
              </div>
            </div>
          </div>
        </div>
      </>
    )
  }

  if (!meeting) {
    return (
      <>
        <style jsx global>{CSS}</style>
        <div className="meeting-root flex items-center justify-center px-6" style={{ minHeight: '100vh' }}>
          <div className="glass-card rounded-2xl p-10 text-center max-w-md">
            <h2 className="text-xl font-semibold text-[#1d1d1f] tracking-tight mb-2">Meeting not found</h2>
            <p className="text-sm text-[#86868b] mb-6">This meeting doesn&apos;t exist or you don&apos;t have access to it.</p>
            <Link href="/meetings" className="btn-secondary inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium no-underline">
              <ChevronLeft className="h-4 w-4" /> Back to Meetings
            </Link>
          </div>
        </div>
      </>
    )
  }

  const segments = meeting.transcript_segments || []
  const summary = (meeting.meeting_summaries || [])[0] ?? null
  const speakers = Array.from(new Set(segments.map(s => s.speaker ?? 'Unknown')))

  const filteredSegments = segments.filter(segment => {
    const matchesSpeaker = selectedSpeaker === 'all' || (segment.speaker ?? 'Unknown') === selectedSpeaker
    const matchesSearch = searchQuery === '' || segment.text.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesSpeaker && matchesSearch
  })

  return (
    <>
      <style jsx global>{CSS}</style>
      <div className="meeting-root">
        <div className="max-w-7xl mx-auto px-6 py-10 lg:py-14 space-y-6">

          {/* Header */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-3">
                <Link href="/meetings" className="back-btn p-2 rounded-full no-underline flex items-center justify-center">
                  <ChevronLeft className="h-4 w-4" />
                </Link>
                <h1 className="text-[28px] font-semibold text-[#1d1d1f] tracking-tight leading-tight truncate" style={{ letterSpacing: '-0.015em' }}>
                  {meeting.title}
                </h1>
              </div>
              <div className="mt-3 ml-11 flex flex-wrap items-center gap-x-4 gap-y-2 text-[13px] text-[#86868b]">
                <span className="flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5" />
                  {new Date(meeting.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </span>
                <span className="w-1 h-1 rounded-full bg-[#c7c7cc]" />
                <span className="flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5" />
                  {Math.round((meeting.duration_seconds || 0) / 60)} min
                </span>
                <span className="w-1 h-1 rounded-full bg-[#c7c7cc]" />
                <span className="source-pill">{meeting.source.replace('_', ' ')}</span>
              </div>
            </div>

            <div className="flex items-center gap-2 flex-shrink-0">
              <button onClick={copyShareLink} className="btn-secondary flex items-center gap-2 px-4 py-2 rounded-full text-[13px] font-medium">
                {copied ? <Check className="h-4 w-4 text-[#34c759]" /> : <Share2 className="h-4 w-4" />}
                {copied ? 'Copied' : 'Share'}
              </button>
              <button
                onClick={handleTriggerSummary}
                disabled={isSummarizing}
                className="btn-primary flex items-center gap-2 px-4 py-2 rounded-full text-[13px] font-medium"
              >
                <Sparkles className={`h-4 w-4 ${isSummarizing ? 'spin' : ''}`} />
                {isSummarizing ? 'Analyzing…' : 'Re-summarize'}
              </button>
            </div>
          </div>

          {/* Main Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

            {/* LEFT — Player + Speakers */}
            <div className="space-y-4 lg:col-span-7">
              <div className="video-shell aspect-video">
                {playbackUrl ? (
                  <video
                    ref={videoRef}
                    src={playbackUrl}
                    onTimeUpdate={handleTimeUpdate}
                    onLoadedMetadata={handleLoadedMetadata}
                    onEnded={() => setIsPlaying(false)}
                    muted={isMuted}
                    className="h-full w-full object-contain"
                  />
                ) : (
                  <div className="flex h-full w-full flex-col items-center justify-center p-8 text-center">
                    <div className="rounded-full p-5 mb-4" style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)' }}>
                      <Play className="h-8 w-8 text-white" fill="white" />
                    </div>
                    <p className="text-[15px] font-medium text-white/90">Audio-only recording</p>
                    <p className="mt-1.5 text-[13px] text-white/50 max-w-sm">
                      Click any timestamp in the transcript to jump to that moment.
                    </p>
                  </div>
                )}

                {playbackUrl && (
                  <div className="absolute bottom-0 inset-x-0 p-4 flex flex-col gap-2.5"
                    style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.7), rgba(0,0,0,0.35), transparent)' }}>
                    <input
                      type="range"
                      min="0"
                      max={duration || 100}
                      value={currentTime}
                      onChange={(e) => seekTo(parseFloat(e.target.value))}
                      className="video-progress"
                    />
                    <div className="flex items-center justify-between text-[12px] text-white/90 font-medium">
                      <div className="flex items-center gap-3">
                        <button onClick={togglePlay} className="video-ctrl-btn">
                          {isPlaying ? <Pause className="h-5 w-5" fill="white" /> : <Play className="h-5 w-5" fill="white" />}
                        </button>
                        <span className="font-mono tabular-nums" style={{ fontVariantNumeric: 'tabular-nums' }}>
                          {formatTime(currentTime)} <span className="text-white/50">/ {formatTime(duration)}</span>
                        </span>
                      </div>
                      <button onClick={() => setIsMuted(!isMuted)} className="video-ctrl-btn">
                        {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {speakers.length > 0 && (
                <div className="glass-card rounded-2xl p-5">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="section-label">Participants</h3>
                    <span className="text-[11px] text-[#86868b] font-medium">{speakers.length}</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {speakers.map(speaker => {
                      const c = speakerColor(speaker)
                      const initial = speaker.charAt(0).toUpperCase()
                      return (
                        <span key={speaker} className="speaker-chip">
                          <span className="speaker-avatar" style={{ background: c.dot }}>{initial}</span>
                          {speaker}
                        </span>
                      )
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* RIGHT — Tabbed Content */}
            <div className="lg:col-span-5">
              <div className="glass-elevated rounded-2xl flex flex-col overflow-hidden" style={{ height: '640px' }}>
                {/* Tabs */}
                <div className="flex gap-1 p-2 border-b border-black/5 overflow-x-auto custom-scroll">
                  <button
                    onClick={() => setActiveTab('summary')}
                    className={`tab-btn flex items-center gap-1.5 px-3 py-2 rounded-lg text-[12px] font-medium whitespace-nowrap ${activeTab === 'summary' ? 'active' : ''}`}
                  >
                    <Sparkles className="h-3.5 w-3.5" /> Summary
                  </button>
                  <button
                    onClick={() => setActiveTab('transcript')}
                    className={`tab-btn flex items-center gap-1.5 px-3 py-2 rounded-lg text-[12px] font-medium whitespace-nowrap ${activeTab === 'transcript' ? 'active' : ''}`}
                  >
                    <MessageSquare className="h-3.5 w-3.5" /> Transcript
                  </button>
                  <button
                    onClick={() => setActiveTab('action-items')}
                    className={`tab-btn flex items-center gap-1.5 px-3 py-2 rounded-lg text-[12px] font-medium whitespace-nowrap ${activeTab === 'action-items' ? 'active' : ''}`}
                  >
                    <CheckSquare className="h-3.5 w-3.5" /> Actions
                    {(meeting.action_items?.length || 0) > 0 && (
                      <span className="ml-0.5 px-1.5 py-0.5 rounded-full text-[10px] font-semibold" style={{ background: 'rgba(0,113,227,0.1)', color: '#0071e3' }}>
                        {meeting.action_items.length}
                      </span>
                    )}
                  </button>
                  <button
                    onClick={() => setActiveTab('highlights')}
                    className={`tab-btn flex items-center gap-1.5 px-3 py-2 rounded-lg text-[12px] font-medium whitespace-nowrap ${activeTab === 'highlights' ? 'active' : ''}`}
                  >
                    <Tag className="h-3.5 w-3.5" /> Highlights
                  </button>
                </div>

                {/* Tab Content */}
                <div className="flex-1 overflow-y-auto custom-scroll p-5">

                  {activeTab === 'summary' && (
                    <div className="space-y-6">
                      {!summary ? (
                        <div className="text-center py-12">
                          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl mb-4"
                            style={{ background: 'linear-gradient(135deg, #5e5ce6 0%, #bf5af2 100%)' }}>
                            <Sparkles className="h-6 w-6 text-white" />
                          </div>
                          <h3 className="text-[15px] font-semibold text-[#1d1d1f] mb-1.5">No summary yet</h3>
                          <p className="text-[13px] text-[#86868b] mb-5 max-w-xs mx-auto">
                            Generate an AI summary to extract key takeaways, decisions, and topics.
                          </p>
                          <button
                            onClick={handleTriggerSummary}
                            disabled={isSummarizing}
                            className="btn-primary inline-flex items-center gap-2 px-4 py-2 rounded-full text-[13px] font-medium"
                          >
                            <Sparkles className={`h-4 w-4 ${isSummarizing ? 'spin' : ''}`} />
                            {isSummarizing ? 'Generating…' : 'Generate Summary'}
                          </button>
                        </div>
                      ) : (
                        <>
                          <div>
                            <h3 className="section-label mb-2.5">Executive Summary</h3>
                            <p className="text-[14px] text-[#1d1d1f] leading-relaxed">
                              {summary.summary || 'No summary available.'}
                            </p>
                          </div>

                          {summary.key_takeaways?.length > 0 && (
                            <div>
                              <h3 className="section-label mb-2.5">Key Takeaways</h3>
                              <ul className="space-y-2.5">
                                {summary.key_takeaways.map((pt, idx) => (
                                  <li key={idx} className="flex items-start gap-2.5 text-[13px] text-[#1d1d1f] leading-relaxed">
                                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[#0071e3] shrink-0" />
                                    <span>{pt}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}

                          {summary.decisions?.length > 0 && (
                            <div>
                              <h3 className="section-label mb-2.5" style={{ color: '#30b855' }}>Decisions Made</h3>
                              <div className="space-y-2">
                                {summary.decisions.map((dec, idx) => (
                                  <div key={idx} className="decision-card rounded-xl p-3 text-[13px] leading-relaxed">
                                    <div className="flex items-start gap-2">
                                      <Check className="h-4 w-4 text-[#34c759] mt-0.5 shrink-0" />
                                      <span>{dec}</span>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {summary.topics?.length > 0 && (
                            <div>
                              <h3 className="section-label mb-2.5">Topics</h3>
                              <div className="flex flex-wrap gap-1.5">
                                {summary.topics.map((topic, idx) => (
                                  <span key={idx} className="topic-tag">{topic}</span>
                                ))}
                              </div>
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  )}

                  {activeTab === 'transcript' && (
                    <div className="space-y-4">
                      <div className="flex gap-2">
                        <div className="relative flex-1">
                          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#a0a0a8] pointer-events-none" />
                          <input
                            type="text"
                            placeholder="Search transcript…"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="apple-input w-full rounded-lg pl-9 pr-3 py-2 text-[13px]"
                          />
                        </div>
                        <select
                          value={selectedSpeaker}
                          onChange={(e) => setSelectedSpeaker(e.target.value)}
                          className="apple-input rounded-lg px-3 py-2 text-[13px] font-medium cursor-pointer"
                        >
                          <option value="all">All</option>
                          {speakers.map(s => (
                            <option key={s} value={s}>{s}</option>
                          ))}
                        </select>
                      </div>

                      <div className="space-y-2.5">
                        {filteredSegments.length === 0 ? (
                          <p className="text-center py-8 text-[13px] text-[#86868b]">No transcript matching your search.</p>
                        ) : (
                          filteredSegments.map(segment => {
                            const startSecs = (segment.start_time_ms ?? 0) / 1000
                            const endSecs = (segment.end_time_ms ?? 0) / 1000
                            const isActive = currentTime >= startSecs && currentTime <= endSecs
                            const speakerName = segment.speaker ?? 'Speaker'
                            const c = speakerColor(speakerName)
                            return (
                              <div
                                key={segment.id}
                                onClick={() => seekTo(startSecs)}
                                className={`segment-card rounded-xl p-3.5 ${isActive ? 'active' : ''}`}
                              >
                                <div className="flex items-center justify-between mb-1.5">
                                  <div className="flex items-center gap-2">
                                    <span className="w-1.5 h-1.5 rounded-full" style={{ background: c.dot }} />
                                    <span className="text-[12px] font-semibold" style={{ color: c.text }}>{speakerName}</span>
                                  </div>
                                  <span className="text-[11px] font-mono text-[#86868b]" style={{ fontVariantNumeric: 'tabular-nums' }}>
                                    {formatTime(startSecs)}
                                  </span>
                                </div>
                                <p className="text-[13px] text-[#1d1d1f] leading-relaxed">{segment.text}</p>
                              </div>
                            )
                          })
                        )}
                      </div>
                    </div>
                  )}

                  {activeTab === 'action-items' && (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="section-label">Extracted Action Items</h3>
                        {meeting.action_items?.length > 0 && (
                          <span className="text-[11px] text-[#86868b] font-medium">
                            {meeting.action_items.filter(i => i.completed).length} / {meeting.action_items.length} done
                          </span>
                        )}
                      </div>
                      {(!meeting.action_items || meeting.action_items.length === 0) ? (
                        <div className="text-center py-12">
                          <div className="text-[28px] mb-3">🎉</div>
                          <p className="text-[13px] text-[#86868b]">No action items — you&apos;re all clear.</p>
                        </div>
                      ) : (
                        meeting.action_items.map(item => (
                          <div key={item.id} className="action-card flex items-start gap-3 rounded-xl p-3.5">
                            <input
                              type="checkbox"
                              checked={item.completed}
                              onChange={() => handleToggleActionItem(item.id, item.completed)}
                              className="apple-checkbox mt-0.5"
                            />
                            <div className="flex-1 min-w-0">
                              <p className={`text-[13px] leading-relaxed ${item.completed ? 'text-[#a0a0a8] line-through' : 'text-[#1d1d1f]'}`}>
                                {item.task}
                              </p>
                              {(item.owner || item.deadline) && (
                                <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px]">
                                  {item.owner && (
                                    <span className="flex items-center gap-1 text-[#0071e3] font-medium">
                                      <User className="h-3 w-3" /> {item.owner}
                                    </span>
                                  )}
                                  {item.deadline && (
                                    <span className="flex items-center gap-1 text-[#FF9500] font-medium">
                                      <Clock className="h-3 w-3" /> {item.deadline}
                                    </span>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  )}

                  {activeTab === 'highlights' && (
                    <div className="space-y-3">
                      <h3 className="section-label mb-1">Key Moments</h3>
                      {(!meeting.highlights || meeting.highlights.length === 0) ? (
                        <div className="text-center py-12">
                          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl mb-3"
                            style={{ background: 'rgba(0,113,227,0.08)' }}>
                            <Tag className="h-5 w-5 text-[#0071e3]" />
                          </div>
                          <p className="text-[13px] text-[#86868b]">No highlights recorded yet.</p>
                        </div>
                      ) : (
                        meeting.highlights.map(hl => (
                          <div
                            key={hl.id}
                            onClick={() => seekTo((hl.timestamp_ms ?? 0) / 1000)}
                            className="segment-card rounded-xl p-3.5"
                          >
                            <div className="flex items-center justify-between mb-1.5">
                              <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full"
                                style={{ background: 'rgba(0,113,227,0.1)', color: '#0071e3' }}>
                                {hl.label ?? 'Highlight'}
                              </span>
                              <span className="text-[11px] font-mono text-[#86868b]" style={{ fontVariantNumeric: 'tabular-nums' }}>
                                {formatTime((hl.timestamp_ms ?? 0) / 1000)}
                              </span>
                            </div>
                            {hl.note && <p className="text-[13px] text-[#1d1d1f] leading-relaxed">{hl.note}</p>}
                          </div>
                        ))
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}