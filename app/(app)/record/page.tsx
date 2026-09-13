'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Mic, Video, Square, Play, Pause, Upload, CheckCircle, AlertCircle, Sparkles, ChevronLeft } from 'lucide-react'
import Link from 'next/link'

export default function RecordPage() {
  const router = useRouter()
  const [meetingTitle, setMeetingTitle] = useState('Browser Session - ' + new Date().toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }))
  
  // Media streams & recording state
  const [isRecording, setIsRecording] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [recordingTime, setRecordingTime] = useState(0)
  const [status, setStatus] = useState<'idle' | 'recording' | 'processing' | 'completed' | 'error'>('idle')
  const [statusMessage, setStatusMessage] = useState('')

  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<Blob[]>([])
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const videoPreviewRef = useRef<HTMLVideoElement | null>(null)

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop())
      }
    }
  }, [])

  const startRecording = async () => {
    try {
      setStatus('recording')
      setStatusMessage('Requesting screen and audio permissions...')

      // Capture screen/tab audio & video
      const displayStream = await navigator.mediaDevices.getDisplayMedia({
        video: { displaySurface: 'browser' } as any,
        audio: true
      })

      // Capture microphone audio
      let micStream: MediaStream | null = null
      try {
        micStream = await navigator.mediaDevices.getUserMedia({ audio: true })
      } catch (e) {
        console.warn('Microphone permission denied or not available:', e)
      }

      // Combine audio tracks using Web Audio API if mic is available
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
      const dest = audioContext.createMediaStreamDestination()

      if (displayStream.getAudioTracks().length > 0) {
        const displaySource = audioContext.createMediaStreamSource(new MediaStream([displayStream.getAudioTracks()[0]]))
        displaySource.connect(dest)
      }

      if (micStream && micStream.getAudioTracks().length > 0) {
        const micSource = audioContext.createMediaStreamSource(new MediaStream([micStream.getAudioTracks()[0]]))
        micSource.connect(dest)
      }

      // Final combined stream
      const combinedTracks = [
        ...displayStream.getVideoTracks(),
        ...dest.stream.getAudioTracks()
      ]
      const combinedStream = new MediaStream(combinedTracks)
      streamRef.current = combinedStream

      if (videoPreviewRef.current) {
        videoPreviewRef.current.srcObject = combinedStream
      }

      const mimeType = MediaRecorder.isTypeSupported('video/webm;codecs=vp9,opus')
        ? 'video/webm;codecs=vp9,opus'
        : 'video/webm'

      const recorder = new MediaRecorder(combinedStream, { mimeType })
      mediaRecorderRef.current = recorder
      chunksRef.current = []

      recorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          chunksRef.current.push(event.data)
        }
      }

      recorder.onstop = async () => {
        await processAndUploadRecording()
      }

      recorder.start(1000) // Chunk every 1s
      setIsRecording(true)
      setStatusMessage('Recording active...')

      // Start timer
      setRecordingTime(0)
      timerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1)
      }, 1000)

      // Handle user stopping stream via browser native UI bar
      displayStream.getVideoTracks()[0].onended = () => {
        stopRecording()
      }

    } catch (err: any) {
      console.error('Error starting recording:', err)
      setStatus('error')
      setStatusMessage(err.message || 'Failed to access screen or microphone.')
    }
  }

  const pauseRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      if (isPaused) {
        mediaRecorderRef.current.resume()
        setIsPaused(false)
        timerRef.current = setInterval(() => setRecordingTime(prev => prev + 1), 1000)
      } else {
        mediaRecorderRef.current.pause()
        setIsPaused(true)
        if (timerRef.current) clearInterval(timerRef.current)
      }
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      setIsRecording(false)
      if (timerRef.current) clearInterval(timerRef.current)
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop())
      }
    }
  }

  const processAndUploadRecording = async () => {
    try {
      setStatus('processing')
      setStatusMessage('Creating recording blob and uploading...')

      const blob = new Blob(chunksRef.current, { type: 'video/webm' })
      const formData = new FormData()
      formData.append('file', blob, 'recording.webm')
      formData.append('title', meetingTitle)
      formData.append('duration', recordingTime.toString())

      const uploadRes = await fetch('/api/recordings/upload', {
        method: 'POST',
        body: formData
      })

      if (!uploadRes.ok) {
        throw new Error('Failed to upload recording file.')
      }

      const { meetingId } = await uploadRes.json()

      setStatusMessage('Transcribing meeting audio via Groq Whisper...')
      const transcribeRes = await fetch('/api/process/transcribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ meetingId })
      })

      if (!transcribeRes.ok) {
        console.warn('Transcription warning, redirecting to meeting detail page.')
      }

      setStatus('completed')
      setStatusMessage('Meeting processed successfully!')
      setTimeout(() => {
        router.push(`/meetings/${meetingId}`)
      }, 1500)

    } catch (err: any) {
      console.error('Error processing recording:', err)
      setStatus('error')
      setStatusMessage(err.message || 'Error processing recording.')
    }
  }

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60)
    const s = secs % 60
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/" className="rounded-lg border border-slate-800 p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white">
          <ChevronLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-white">Browser Meeting Recorder</h1>
          <p className="text-xs text-slate-400">Record any Google Meet, Zoom, or web tab directly with zero extension downloads.</p>
        </div>
      </div>

      {/* Main Recording Card */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-6 backdrop-blur-sm space-y-6">
        {/* Title Input */}
        <div>
          <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Meeting Title</label>
          <input
            type="text"
            value={meetingTitle}
            onChange={(e) => setMeetingTitle(e.target.value)}
            disabled={isRecording}
            className="w-full rounded-lg border border-slate-800 bg-slate-950 px-4 py-2.5 text-sm text-slate-100 focus:outline-none focus:ring-1 focus:ring-cyan-500 disabled:opacity-50"
          />
        </div>

        {/* Video Preview Canvas */}
        <div className="relative aspect-video w-full overflow-hidden rounded-xl border border-slate-800 bg-slate-950 flex items-center justify-center">
          <video
            ref={videoPreviewRef}
            autoPlay
            muted
            className="h-full w-full object-contain"
          />
          {!isRecording && status === 'idle' && (
            <div className="absolute flex flex-col items-center gap-3 text-center p-6">
              <div className="rounded-full bg-cyan-500/10 p-4 border border-cyan-500/20 text-cyan-400">
                <Video className="h-8 w-8" />
              </div>
              <h3 className="text-sm font-semibold text-slate-200">Ready to Record</h3>
              <p className="text-xs text-slate-400 max-w-sm">
                Select your meeting tab or entire screen when prompted. Audio and video will be processed locally and AI-analyzed.
              </p>
            </div>
          )}

          {/* Recording Timer Badge Overlay */}
          {isRecording && (
            <div className="absolute top-4 left-4 flex items-center gap-2 rounded-full border border-red-500/30 bg-red-950/80 px-3 py-1 text-xs font-mono text-red-400 backdrop-blur-md">
              <span className="h-2 w-2 rounded-full bg-red-500 animate-ping" />
              REC {formatTime(recordingTime)}
            </div>
          )}
        </div>

        {/* Action Controls Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
          <div className="text-xs text-slate-400">
            {statusMessage && (
              <span className="flex items-center gap-2">
                {status === 'processing' && <Sparkles className="h-4 w-4 text-cyan-400 animate-spin" />}
                {status === 'error' && <AlertCircle className="h-4 w-4 text-red-400" />}
                {status === 'completed' && <CheckCircle className="h-4 w-4 text-emerald-400" />}
                {statusMessage}
              </span>
            )}
          </div>

          <div className="flex items-center gap-3">
            {!isRecording && status !== 'processing' && (
              <button
                onClick={startRecording}
                className="flex items-center gap-2 rounded-lg bg-cyan-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-cyan-500 transition-colors shadow-lg shadow-cyan-600/20"
              >
                <Video className="h-4 w-4" /> Start Recording
              </button>
            )}

            {isRecording && (
              <>
                <button
                  onClick={pauseRecording}
                  className="flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-800 px-4 py-2.5 text-sm font-medium text-slate-200 hover:bg-slate-700 transition-colors"
                >
                  {isPaused ? <Play className="h-4 w-4 text-emerald-400" /> : <Pause className="h-4 w-4 text-amber-400" />}
                  {isPaused ? 'Resume' : 'Pause'}
                </button>

                <button
                  onClick={stopRecording}
                  className="flex items-center gap-2 rounded-lg bg-red-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-red-500 transition-colors shadow-lg shadow-red-600/20"
                >
                  <Square className="h-4 w-4 fill-white" /> Stop & Save
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
