'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Youtube, Sparkles, AlertCircle, ArrowRight, ChevronLeft, Link2, FileText, Zap } from 'lucide-react'

export default function ImportPage() {
  const router = useRouter()
  const [url, setUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [statusMessage, setStatusMessage] = useState('')
  const [error, setError] = useState('')

  const handleImport = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!url.trim() || loading) return

    setLoading(true)
    setError('')
    setStatusMessage('Extracting YouTube video metadata & audio...')

    try {
      const res = await fetch('/api/youtube/process', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url })
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Failed to import YouTube video')
      }

      const { meetingId } = await res.json()
      setStatusMessage('Transcribing & running AI summary...')

      setTimeout(() => {
        router.push(`/meetings/${meetingId}`)
      }, 1200)

    } catch (err: any) {
      console.error('Error importing YouTube video:', err)
      setError(err.message || 'Error processing YouTube video.')
    } finally {
      setLoading(false)
    }
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
        <div className="absolute -top-[20%] -right-[15%] w-[600px] h-[600px] rounded-full bg-gradient-to-bl from-red-100/30 via-orange-50/15 to-transparent blur-[100px]" />
        <div className="absolute -bottom-[30%] -left-[10%] w-[500px] h-[500px] rounded-full bg-gradient-to-tr from-blue-100/25 via-indigo-50/10 to-transparent blur-[90px]" />
      </div>

      <div className="relative z-10 max-w-3xl mx-auto px-6 sm:px-8 py-10 sm:py-14">
        {/* Header */}
        <div className="flex items-center gap-4 mb-10">
          <Link
            href="/"
            className="group flex items-center justify-center w-10 h-10 rounded-full bg-white/70 backdrop-blur-xl border border-black/[0.05] shadow-[0_1px_3px_rgba(0,0,0,0.04)] hover:bg-white hover:shadow-[0_2px_8px_rgba(0,0,0,0.06)] transition-all duration-200"
          >
            <ChevronLeft className="h-[18px] w-[18px] text-[#1d1d1f] group-hover:-translate-x-0.5 transition-transform duration-200" strokeWidth={2.5} />
          </Link>
          <div>
            <h1 className="text-[32px] sm:text-[36px] font-semibold text-[#1d1d1f] tracking-[-0.02em] leading-tight">
              Import from YouTube
            </h1>
            <p className="text-[15px] text-[#86868b] mt-1 font-normal leading-relaxed">
              Turn webinars, keynotes, and tech talks into searchable meetings.
            </p>
          </div>
        </div>

        {/* Main card */}
        <form
          onSubmit={handleImport}
          className="relative rounded-[24px] bg-white/70 backdrop-blur-2xl border border-black/[0.04] shadow-[0_1px_3px_rgba(0,0,0,0.04),0_12px_40px_-8px_rgba(0,0,0,0.06)] overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-red-50/20 via-transparent to-blue-50/15 pointer-events-none" />

          <div className="relative z-10 p-7 sm:p-8 space-y-7">
            {/* URL input */}
            <div className="space-y-3">
              <label className="flex items-center gap-2 text-[13px] font-semibold text-[#1d1d1f] tracking-tight">
                <div className="w-6 h-6 rounded-[7px] bg-[#FF3B30]/10 flex items-center justify-center">
                  <Youtube className="h-3.5 w-3.5 text-[#FF3B30]" />
                </div>
                YouTube Video URL
              </label>

              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#aeaeb2] group-focus-within:text-[#007AFF] transition-colors duration-200">
                  <Link2 className="h-[18px] w-[18px]" strokeWidth={2} />
                </div>
                <input
                  type="url"
                  required
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://www.youtube.com/watch?v=..."
                  className="w-full rounded-[14px] bg-[#f5f5f7] border border-black/[0.04] pl-11 pr-4 py-3.5 text-[15px] text-[#1d1d1f] placeholder-[#aeaeb2] focus:outline-none focus:bg-white focus:border-[#007AFF]/30 focus:ring-2 focus:ring-[#007AFF]/10 transition-all duration-200"
                />
              </div>
              <p className="text-[12px] text-[#86868b] font-normal pl-1">
                Paste any public YouTube URL — Recall handles the rest.
              </p>
            </div>

            {/* Status message */}
            {statusMessage && !error && (
              <div className="flex items-center gap-3 rounded-[14px] bg-[#007AFF]/[0.06] border border-[#007AFF]/15 p-4 animate-in fade-in slide-in-from-top-1 duration-300">
                <div className="relative flex-shrink-0">
                  <div className="w-8 h-8 rounded-full bg-[#007AFF]/10 flex items-center justify-center">
                    <Sparkles className="h-4 w-4 text-[#007AFF] animate-pulse" />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[14px] font-medium text-[#007AFF] tracking-tight">Processing your video</p>
                  <p className="text-[13px] text-[#007AFF]/70 mt-0.5 font-normal">{statusMessage}</p>
                </div>
              </div>
            )}

            {/* Error message */}
            {error && (
              <div className="flex items-start gap-3 rounded-[14px] bg-[#FF3B30]/[0.06] border border-[#FF3B30]/15 p-4 animate-in fade-in slide-in-from-top-1 duration-300">
                <div className="w-8 h-8 rounded-full bg-[#FF3B30]/10 flex items-center justify-center flex-shrink-0">
                  <AlertCircle className="h-4 w-4 text-[#FF3B30]" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[14px] font-medium text-[#FF3B30] tracking-tight">Import failed</p>
                  <p className="text-[13px] text-[#FF3B30]/80 mt-0.5 font-normal">{error}</p>
                </div>
              </div>
            )}

            {/* Submit button */}
            <div className="flex justify-end pt-1">
              <button
                type="submit"
                disabled={loading || !url.trim()}
                className="group flex items-center gap-2 rounded-full bg-[#007AFF] hover:bg-[#0071EB] px-6 py-3 text-[14px] font-semibold text-white transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed shadow-[0_1px_4px_rgba(0,122,255,0.20)] hover:shadow-[0_4px_16px_-4px_rgba(0,122,255,0.4)] active:scale-[0.97]"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin h-4 w-4 text-white/90" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Processing…
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4" />
                    Process & Summarize
                    <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform duration-200" strokeWidth={2.5} />
                  </>
                )}
              </button>
            </div>
          </div>
        </form>

        {/* Feature highlights */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-6">
          <div className="rounded-[18px] bg-white/50 backdrop-blur-xl border border-black/[0.03] p-5">
            <div className="w-9 h-9 rounded-[10px] bg-[#AF52DE]/10 flex items-center justify-center mb-3">
              <FileText className="h-4 w-4 text-[#AF52DE]" />
            </div>
            <p className="text-[13px] font-semibold text-[#1d1d1f] tracking-tight">Full transcript</p>
            <p className="text-[12px] text-[#86868b] mt-1 font-normal leading-relaxed">Word-for-word searchable text.</p>
          </div>

          <div className="rounded-[18px] bg-white/50 backdrop-blur-xl border border-black/[0.03] p-5">
            <div className="w-9 h-9 rounded-[10px] bg-[#34C759]/10 flex items-center justify-center mb-3">
              <Sparkles className="h-4 w-4 text-[#34C759]" />
            </div>
            <p className="text-[13px] font-semibold text-[#1d1d1f] tracking-tight">AI summary</p>
            <p className="text-[12px] text-[#86868b] mt-1 font-normal leading-relaxed">Key points and takeaways.</p>
          </div>

          <div className="rounded-[18px] bg-white/50 backdrop-blur-xl border border-black/[0.03] p-5">
            <div className="w-9 h-9 rounded-[10px] bg-[#FF9500]/10 flex items-center justify-center mb-3">
              <Zap className="h-4 w-4 text-[#FF9500]" />
            </div>
            <p className="text-[13px] font-semibold text-[#1d1d1f] tracking-tight">Action items</p>
            <p className="text-[12px] text-[#86868b] mt-1 font-normal leading-relaxed">Extracted tasks & follow-ups.</p>
          </div>
        </div>
      </div>
    </div>
  )
}