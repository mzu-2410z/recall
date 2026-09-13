import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { unauthorizedResponse, errorResponse, parseBody, youtubeProcessSchema } from '@/lib/validations'
import { checkRateLimit, rateLimitHeaders } from '@/lib/rate-limit'
import { extractVideoId, fetchYouTubeTranscript, transcriptToText, youtubeSegmentsToInternal } from '@/lib/services/youtube'
import { analyzeMeeting } from '@/lib/services/ai'
import { createClient as createServiceClient } from '@supabase/supabase-js'

// ── POST /api/youtube/process ─────────────────────────────────────────────────
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return unauthorizedResponse()

    const rl = checkRateLimit(`${user.id}:youtube`, 10, 60 * 60 * 1000)
    if (!rl.allowed) {
      return NextResponse.json({ error: 'Rate limit exceeded.' }, { status: 429 })
    }

    const body = await request.json()
    const parsed = parseBody(youtubeProcessSchema, body)
    if (!parsed.success) return parsed.response

    // Extract + validate video ID (SSRF protection inside extractVideoId)
    let videoId: string
    try {
      videoId = extractVideoId(parsed.data.url)
    } catch (err: any) {
      return errorResponse(err.message, 400)
    }

    // Fetch transcript
    const ytSegments = await fetchYouTubeTranscript(videoId)
    if (!ytSegments) {
      return errorResponse(
        'No transcript available for this video. The creator may have disabled captions, or the video may be restricted.',
        422
      )
    }

    const transcriptText = transcriptToText(ytSegments)
    const title = parsed.data.title || `YouTube: ${videoId}`

    const adminSupabase = createServiceClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      { auth: { persistSession: false } }
    )

    // Create meeting record
    const { data: meeting, error: meetingError } = await adminSupabase
      .from('meetings')
      .insert({
        user_id: user.id,
        title,
        source: 'youtube',
        status: 'analyzing',
        youtube_url: parsed.data.url,
        youtube_video_id: videoId,
      })
      .select()
      .single()

    if (meetingError) throw meetingError

    // Save transcript segments
    const segments = youtubeSegmentsToInternal(ytSegments, meeting.id, user.id)
    if (segments.length > 0) {
      await adminSupabase.from('transcript_segments').insert(segments)
    }

    // Run AI analysis
    const analysis = await analyzeMeeting(transcriptText, 'general', title)

    // Save summary
    await adminSupabase.from('meeting_summaries').insert({
      meeting_id: meeting.id,
      user_id: user.id,
      template: 'general',
      summary: analysis.summary,
      key_takeaways: analysis.key_takeaways,
      decisions: analysis.decisions,
      action_items: analysis.action_items,
      topics: analysis.topics,
      important_moments: analysis.important_moments,
      raw_ai_response: analysis,
    })

    // Save action items
    if (analysis.action_items.length > 0) {
      await adminSupabase.from('action_items').insert(
        analysis.action_items.map((ai) => ({
          meeting_id: meeting.id,
          user_id: user.id,
          task: ai.task,
          owner: ai.owner,
          deadline: ai.deadline,
        }))
      )
    }

    // Mark complete
    await adminSupabase
      .from('meetings')
      .update({
        status: 'complete',
        duration_seconds: Math.round(
          (ytSegments[ytSegments.length - 1]?.start ?? 0) +
          (ytSegments[ytSegments.length - 1]?.duration ?? 0)
        ),
        updated_at: new Date().toISOString(),
      })
      .eq('id', meeting.id)

    return NextResponse.json({ meetingId: meeting.id, title }, {
      status: 201,
      headers: rateLimitHeaders(rl),
    })
  } catch (err) {
    console.error('[POST /api/youtube/process]', err)
    return errorResponse('Failed to process YouTube video. Please try again.')
  }
}
