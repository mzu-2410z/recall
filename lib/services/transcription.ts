import Groq from 'groq-sdk'
import { createClient } from '@/lib/supabase/server'

let _groq: Groq | null = null
function getGroq(): Groq {
  if (!_groq) {
    const apiKey = process.env.GROQ_API_KEY
    if (!apiKey) throw new Error('GROQ_API_KEY environment variable is not set')
    _groq = new Groq({ apiKey })
  }
  return _groq
}

export interface TranscriptSegment {
  speaker: string | null
  text: string
  start_time_ms: number
  end_time_ms: number
  sequence_num: number
}

/**
 * Transcribes an audio blob using Groq Whisper.
 * Returns an array of timestamped segments.
 */
export async function transcribeAudio(
  audioBlob: Blob,
  filename = 'recording.webm'
): Promise<TranscriptSegment[]> {
  const file = new File([audioBlob], filename, { type: audioBlob.type || 'audio/webm' })

  const transcription = await getGroq().audio.transcriptions.create({
    file,
    model: process.env.GROQ_WHISPER_MODEL ?? 'whisper-large-v3',
    response_format: 'verbose_json',
    timestamp_granularities: ['segment'],
  })

  // verbose_json includes segments with start/end timestamps
  const segments = (transcription as any).segments ?? []

  return segments.map((seg: any, idx: number) => ({
    speaker: null, // Whisper doesn't diarize — label as null
    text: (seg.text as string).trim(),
    start_time_ms: Math.round((seg.start as number) * 1000),
    end_time_ms: Math.round((seg.end as number) * 1000),
    sequence_num: idx,
  }))
}

/**
 * Saves transcript segments to the database.
 * Clears existing segments for the meeting first (idempotent).
 */
export async function saveTranscriptSegments(
  meetingId: string,
  userId: string,
  segments: TranscriptSegment[]
): Promise<void> {
  const supabase = await createClient()

  // Clear existing segments
  await supabase
    .from('transcript_segments')
    .delete()
    .eq('meeting_id', meetingId)
    .eq('user_id', userId)

  if (segments.length === 0) return

  const rows = segments.map((seg) => ({
    meeting_id: meetingId,
    user_id: userId,
    speaker: seg.speaker,
    text: seg.text,
    start_time_ms: seg.start_time_ms,
    end_time_ms: seg.end_time_ms,
    sequence_num: seg.sequence_num,
  }))

  const { error } = await supabase.from('transcript_segments').insert(rows)
  if (error) throw new Error(`Failed to save transcript: ${error.message}`)
}
