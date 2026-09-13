'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Youtube, Sparkles, AlertCircle, CheckCircle, ArrowRight, ChevronLeft } from 'lucide-react'

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
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/" className="rounded-lg border border-slate-800 p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white">
          <ChevronLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-white">Import YouTube Meeting / Video</h1>
          <p className="text-xs text-slate-400">Import webinars, keynotes, recorded Zoom links on YouTube, or tech talks into Recall.</p>
        </div>
      </div>

      <form onSubmit={handleImport} className="rounded-xl border border-slate-800 bg-slate-900/60 p-6 backdrop-blur-sm space-y-6">
        <div className="space-y-2">
          <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider">YouTube Video URL</label>
          <div className="relative">
            <div className="absolute left-3 top-3 text-red-500">
              <Youtube className="h-5 w-5" />
            </div>
            <input
              type="url"
              required
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://www.youtube.com/watch?v=..."
              className="w-full rounded-xl border border-slate-800 bg-slate-950 pl-11 pr-4 py-3 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-cyan-500"
            />
          </div>
        </div>

        {statusMessage && !error && (
          <div className="flex items-center gap-2 rounded-lg border border-cyan-500/20 bg-cyan-500/10 p-3 text-xs text-cyan-300">
            <Sparkles className="h-4 w-4 animate-spin text-cyan-400" />
            {statusMessage}
          </div>
        )}

        {error && (
          <div className="flex items-center gap-2 rounded-lg border border-red-500/20 bg-red-500/10 p-3 text-xs text-red-400">
            <AlertCircle className="h-4 w-4 shrink-0" />
            {error}
          </div>
        )}

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={loading || !url.trim()}
            className="flex items-center gap-2 rounded-xl bg-cyan-600 px-6 py-3 text-xs font-semibold text-white hover:bg-cyan-500 transition-colors disabled:opacity-50 shadow-lg shadow-cyan-600/20"
          >
            <Sparkles className="h-4 w-4" /> Process & Summarize
          </button>
        </div>
      </form>
    </div>
  )
}
