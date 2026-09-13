import { createClient } from '@/lib/supabase/server'
import { askAboutMeetings } from './ai'

/**
 * Knowledge service — retrieves relevant meeting context and answers questions.
 * Uses PostgreSQL full-text search to find relevant meetings.
 */
export async function answerQuestion(
  userId: string,
  question: string
): Promise<{
  answer: string
  sourceMeetings: Array<{ meetingId: string; title: string; startedAt: string }>
}> {
  const supabase = await createClient()

  // Search for relevant transcript segments
  const { data: segments } = await supabase
    .from('transcript_segments')
    .select(`
      text,
      start_time_ms,
      meeting_id,
      meetings!inner(id, title, started_at, status, user_id)
    `)
    .eq('meetings.user_id', userId)
    .eq('meetings.status', 'complete')
    .textSearch('text', question, { type: 'websearch', config: 'english' })
    .limit(20)

  // Search for relevant summaries
  const { data: summaries } = await supabase
    .from('meeting_summaries')
    .select(`
      summary,
      key_takeaways,
      decisions,
      meeting_id,
      meetings!inner(id, title, started_at, status, user_id)
    `)
    .eq('meetings.user_id', userId)
    .eq('meetings.status', 'complete')
    .textSearch('summary', question, { type: 'websearch', config: 'english' })
    .limit(5)

  // Build bounded context (max ~4000 chars)
  const contextParts: string[] = []
  const sourceMeetings: Map<string, { meetingId: string; title: string; startedAt: string }> = new Map()

  // Add summary context
  for (const s of summaries ?? []) {
    const meeting = (s as any).meetings
    if (!meeting) continue
    const key = meeting.id
    if (!sourceMeetings.has(key)) {
      sourceMeetings.set(key, {
        meetingId: meeting.id,
        title: meeting.title,
        startedAt: meeting.started_at ?? '',
      })
    }
    contextParts.push(
      `[Meeting: "${meeting.title}"]\nSummary: ${s.summary ?? ''}\nKey points: ${
        Array.isArray(s.key_takeaways) ? (s.key_takeaways as string[]).join('; ') : ''
      }\nDecisions: ${
        Array.isArray(s.decisions) ? (s.decisions as string[]).join('; ') : ''
      }`
    )
  }

  // Add transcript context
  for (const seg of segments ?? []) {
    const meeting = (seg as any).meetings
    if (!meeting) continue
    const key = meeting.id
    if (!sourceMeetings.has(key)) {
      sourceMeetings.set(key, {
        meetingId: meeting.id,
        title: meeting.title,
        startedAt: meeting.started_at ?? '',
      })
    }
    contextParts.push(`[${meeting.title}]: ${seg.text}`)
  }

  if (contextParts.length === 0) {
    return {
      answer: "I couldn't find relevant information in your meeting history for that question.",
      sourceMeetings: [],
    }
  }

  // Cap context at ~4000 chars to avoid excessive token usage
  let context = contextParts.join('\n\n')
  if (context.length > 4000) {
    context = context.slice(0, 4000) + '...'
  }

  const sources = Array.from(sourceMeetings.values())
  const result = await askAboutMeetings(question, context, sources)

  return result
}
