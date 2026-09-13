'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Mic, Video, Square, Play, Pause, CheckCircle, AlertCircle, Sparkles, ChevronLeft, Monitor, Volume2, Shield } from 'lucide-react'
import Link from 'next/link'

export default function RecordPage() {
  const router = useRouter()
  const [meetingTitle, setMeetingTitle] = useState('Browser Session - ' + new Date().toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }))

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

      const displayStream = await navigator.mediaDevices.getDisplayMedia({
        video: { displaySurface: 'browser' } as any,
        audio: true
      })

      let micStream: MediaStream | null = null
      try {
        micStream = await navigator.mediaDevices.getUserMedia({ audio: true })
      } catch (e) {
        console.warn('Microphone permission denied or not available:', e)
      }

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

      recorder.start(1000)
      setIsRecording(true)
      setStatusMessage('Recording active...')

      setRecordingTime(0)
      timerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1)
      }, 1000)

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
        const errData = await uploadRes.json().catch(() => ({}))
        throw new Error(errData.error || 'Failed to upload recording file.')
      }

      const { meetingId } = await uploadRes.json()

      setStatusMessage('Transcribing meeting audio via Groq Whisper...')
      const transcribeRes = await fetch('/api/process/transcribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ meetingId })
      })

      if (transcribeRes.ok) {
        // Auto-trigger AI summarization in the background
        setStatusMessage('Generating AI summary...')
        fetch(`/api/meetings/${meetingId}/summarize`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ template: 'general' })
        }).catch(err => console.warn('Background summarization failed:', err))
      } else {
        console.warn('Transcription returned non-OK status, skipping auto-summarize.')
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
    <div
      className="min-h-screen relative"
      style={{
        background: 'linear-gradient(180deg, #fbfbfd 0%, #f5f5f7 40%, #fbfbfd 100%)',
        fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", "Helvetica Neue", Helvetica, Arial, sans-serif',
      }}
    >
      {/* Ambient washes — shift to red when recording for subtle environmental feedback */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div
          className={`absolute -top-[30%] -right-[10%] w-[700px] h-[700px] rounded-full blur-[110px] transition-all duration-[2000ms] ${isRecording && !isPaused
              ? 'bg-gradient-to-bl from-red-200/40 via-orange-100/20 to-transparent'
              : 'bg-gradient-to-bl from-blue-100/30 via-indigo-50/15 to-transparent'
            }`}
        />
        <div className="absolute -bottom-[20%] -left-[10%] w-[500px] h-[500px] rounded-full bg-gradient-to-tr from-purple-100/25 via-pink-50/10 to-transparent blur-[90px]" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-6 sm:px-8 py-10 sm:py-14">
        {/* Header */}
        <div className="flex items-center gap-4 mb-10">
          <Link
            href="/dashboard"
            className="group flex items-center justify-center w-10 h-10 rounded-full bg-white/70 backdrop-blur-xl border border-black/[0.05] shadow-[0_1px_3px_rgba(0,0,0,0.04)] hover:bg-white hover:shadow-[0_2px_8px_rgba(0,0,0,0.06)] transition-all duration-200"
          >
            <ChevronLeft className="h-[18px] w-[18px] text-[#1d1d1f] group-hover:-translate-x-0.5 transition-transform duration-200" strokeWidth={2.5} />
          </Link>
          <div className="flex-1">
            <h1 className="text-[32px] sm:text-[36px] font-semibold text-[#1d1d1f] tracking-[-0.02em] leading-tight">
              Browser Recorder
            </h1>
            <p className="text-[15px] text-[#86868b] mt-1 font-normal leading-relaxed">
              Record any Google Meet, Zoom, or web tab — no extensions required.
            </p>
          </div>

          {/* Live status pill in header */}
          {isRecording && (
            <div className={`hidden sm:flex items-center gap-2 px-3.5 py-2 rounded-full backdrop-blur-xl border transition-all duration-300 ${isPaused
                ? 'bg-[#FF9500]/10 border-[#FF9500]/20 text-[#C93400]'
                : 'bg-[#FF3B30]/10 border-[#FF3B30]/20 text-[#D70015]'
              }`}>
              <span className="relative flex h-2 w-2">
                {!isPaused && <span className="absolute inline-flex h-full w-full rounded-full bg-[#FF3B30] opacity-75 animate-ping" />}
                <span className={`relative inline-flex rounded-full h-2 w-2 ${isPaused ? 'bg-[#FF9500]' : 'bg-[#FF3B30]'}`} />
              </span>
              <span className="text-[12px] font-semibold tabular-nums tracking-tight">
                {isPaused ? 'PAUSED' : 'LIVE'} · {formatTime(recordingTime)}
              </span>
            </div>
          )}
        </div>

        {/* Main Recording Card */}
        <div className="relative rounded-[24px] bg-white/70 backdrop-blur-2xl border border-black/[0.04] shadow-[0_1px_3px_rgba(0,0,0,0.04),0_12px_40px_-8px_rgba(0,0,0,0.06)] overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50/20 via-transparent to-purple-50/15 pointer-events-none" />

          <div className="relative z-10 p-6 sm:p-8 space-y-6">
            {/* Title Input */}
            <div className="space-y-2.5">
              <label className="block text-[13px] font-semibold text-[#1d1d1f] tracking-tight">
                Meeting Title
              </label>
              <input
                type="text"
                value={meetingTitle}
                onChange={(e) => setMeetingTitle(e.target.value)}
                disabled={isRecording}
                className="w-full rounded-[14px] bg-[#f5f5f7] border border-black/[0.04] px-4 py-3 text-[15px] text-[#1d1d1f] placeholder-[#aeaeb2] focus:outline-none focus:bg-white focus:border-[#007AFF]/30 focus:ring-2 focus:ring-[#007AFF]/10 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>

            {/* Video Preview */}
            <div className="relative aspect-video w-full overflow-hidden rounded-[18px] bg-gradient-to-br from-[#1d1d1f] to-[#000000] flex items-center justify-center shadow-[inset_0_0_0_1px_rgba(255,255,255,0.05)]">
              <video
                ref={videoPreviewRef}
                autoPlay
                muted
                className="h-full w-full object-contain"
              />

              {!isRecording && status === 'idle' && (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 text-center p-8 bg-gradient-to-br from-[#1d1d1f] to-[#000000]">
                  {/* Concentric ring animation */}
                  <div className="relative">
                    <div className="absolute inset-0 rounded-full bg-[#007AFF]/20 blur-2xl scale-150" />
                    <div className="relative rounded-full bg-white/[0.06] backdrop-blur-xl p-5 border border-white/10">
                      <Monitor className="h-9 w-9 text-white/90" strokeWidth={1.5} />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-[17px] font-semibold text-white tracking-tight">Ready to record</h3>
                    <p className="text-[13px] text-white/60 mt-1.5 max-w-sm leading-relaxed font-normal">
                      Choose your meeting tab or entire screen when prompted. Audio and video are processed securely.
                    </p>
                  </div>
                </div>
              )}

              {/* Recording overlay badge */}
              {isRecording && (
                <div className="absolute top-4 left-4 flex items-center gap-2 rounded-full bg-black/60 backdrop-blur-xl border border-white/10 px-3.5 py-1.5">
                  <span className="relative flex h-2 w-2">
                    {!isPaused && <span className="absolute inline-flex h-full w-full rounded-full bg-[#FF3B30] opacity-75 animate-ping" />}
                    <span className={`relative inline-flex rounded-full h-2 w-2 ${isPaused ? 'bg-[#FF9500]' : 'bg-[#FF3B30]'}`} />
                  </span>
                  <span className="text-[12px] font-semibold tabular-nums tracking-tight text-white">
                    {isPaused ? 'PAUSED' : 'REC'} · {formatTime(recordingTime)}
                  </span>
                </div>
              )}

              {/* Processing overlay */}
              {status === 'processing' && (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-gradient-to-br from-[#1d1d1f]/95 to-[#000000]/95 backdrop-blur-md">
                  <div className="relative">
                    <div className="absolute inset-0 rounded-full bg-[#007AFF]/30 blur-2xl scale-150 animate-pulse" />
                    <div className="relative rounded-full bg-white/[0.08] backdrop-blur-xl p-5 border border-white/10">
                      <Sparkles className="h-9 w-9 text-[#007AFF] animate-pulse" strokeWidth={1.5} />
                    </div>
                  </div>
                  <div className="text-center">
                    <h3 className="text-[17px] font-semibold text-white tracking-tight">Processing</h3>
                    <p className="text-[13px] text-white/60 mt-1.5 max-w-sm leading-relaxed font-normal">{statusMessage}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Status message row (non-video states) */}
            {statusMessage && status !== 'processing' && status !== 'recording' && (
              <div className={`flex items-center gap-3 rounded-[14px] p-3.5 border animate-in fade-in slide-in-from-top-1 duration-300 ${status === 'error'
                  ? 'bg-[#FF3B30]/[0.06] border-[#FF3B30]/15'
                  : status === 'completed'
                    ? 'bg-[#34C759]/[0.08] border-[#34C759]/20'
                    : 'bg-[#007AFF]/[0.06] border-[#007AFF]/15'
                }`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${status === 'error' ? 'bg-[#FF3B30]/10' : status === 'completed' ? 'bg-[#34C759]/10' : 'bg-[#007AFF]/10'
                  }`}>
                  {status === 'error' && <AlertCircle className="h-4 w-4 text-[#FF3B30]" />}
                  {status === 'completed' && <CheckCircle className="h-4 w-4 text-[#34C759]" />}
                </div>
                <p className={`text-[14px] font-medium tracking-tight ${status === 'error' ? 'text-[#D70015]' : status === 'completed' ? 'text-[#248A3D]' : 'text-[#007AFF]'
                  }`}>
                  {statusMessage}
                </p>
              </div>
            )}

            {/* Controls */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              {!isRecording && status !== 'processing' && (
                <button
                  onClick={startRecording}
                  className="group relative flex items-center gap-2.5 rounded-full bg-[#FF3B30] hover:bg-[#E5352B] px-8 py-3.5 text-[15px] font-semibold text-white transition-all duration-200 shadow-[0_2px_8px_rgba(255,59,48,0.25)] hover:shadow-[0_8px_24px_-4px_rgba(255,59,48,0.4)] active:scale-[0.97]"
                >
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="absolute inline-flex h-full w-full rounded-full bg-white opacity-60 animate-ping" />
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-white" />
                  </span>
                  Start Recording
                </button>
              )}

              {isRecording && (
                <>
                  <button
                    onClick={pauseRecording}
                    className="flex items-center gap-2 rounded-full bg-white border border-black/[0.06] px-6 py-3 text-[14px] font-semibold text-[#1d1d1f] hover:bg-[#f5f5f7] transition-all duration-200 shadow-[0_1px_3px_rgba(0,0,0,0.04)] active:scale-[0.97]"
                  >
                    {isPaused ? (
                      <>
                        <Play className="h-4 w-4 text-[#34C759]" fill="currentColor" />
                        Resume
                      </>
                    ) : (
                      <>
                        <Pause className="h-4 w-4 text-[#FF9500]" fill="currentColor" />
                        Pause
                      </>
                    )}
                  </button>

                  <button
                    onClick={stopRecording}
                    className="flex items-center gap-2 rounded-full bg-[#FF3B30] hover:bg-[#E5352B] px-7 py-3 text-[14px] font-semibold text-white transition-all duration-200 shadow-[0_2px_8px_rgba(255,59,48,0.25)] hover:shadow-[0_8px_24px_-4px_rgba(255,59,48,0.4)] active:scale-[0.97]"
                  >
                    <Square className="h-3.5 w-3.5 fill-white" strokeWidth={0} />
                    Stop & Save
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Info cards */}
        {!isRecording && status === 'idle' && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-6">
            <div className="rounded-[18px] bg-white/50 backdrop-blur-xl border border-black/[0.03] p-5">
              <div className="w-9 h-9 rounded-[10px] bg-[#007AFF]/10 flex items-center justify-center mb-3">
                <Monitor className="h-4 w-4 text-[#007AFF]" />
              </div>
              <p className="text-[13px] font-semibold text-[#1d1d1f] tracking-tight">Screen + Tab</p>
              <p className="text-[12px] text-[#86868b] mt-1 font-normal leading-relaxed">Capture any tab or your full screen.</p>
            </div>

            <div className="rounded-[18px] bg-white/50 backdrop-blur-xl border border-black/[0.03] p-5">
              <div className="w-9 h-9 rounded-[10px] bg-[#AF52DE]/10 flex items-center justify-center mb-3">
                <Volume2 className="h-4 w-4 text-[#AF52DE]" />
              </div>
              <p className="text-[13px] font-semibold text-[#1d1d1f] tracking-tight">Mixed audio</p>
              <p className="text-[12px] text-[#86868b] mt-1 font-normal leading-relaxed">System sound + your microphone.</p>
            </div>

            <div className="rounded-[18px] bg-white/50 backdrop-blur-xl border border-black/[0.03] p-5">
              <div className="w-9 h-9 rounded-[10px] bg-[#34C759]/10 flex items-center justify-center mb-3">
                <Shield className="h-4 w-4 text-[#34C759]" />
              </div>
              <p className="text-[13px] font-semibold text-[#1d1d1f] tracking-tight">Private & secure</p>
              <p className="text-[12px] text-[#86868b] mt-1 font-normal leading-relaxed">Processed on your own account.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}