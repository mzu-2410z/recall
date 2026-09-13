import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import {
  unauthorizedResponse, errorResponse, notFoundResponse,
  rateLimitedResponse, parseBody, analyzeMeetingSchema
} from '@/lib/validations'
import { checkRateLimit, rateLimitHeaders } from '@/lib/rate-limit'
import { analyzeMeeting, type SummaryTemplate } from '@/lib/services/ai'
import { createClient as createServiceClient } from '@supabase/supabase-js'

type Params = { params: Promise<{ id: string }> }

// ── POST /api/meetings/[id]/summarize ────────────────────────────────────────
export async function POST(request: NextRequest, { params }: Params) {
  try {
    const { id } = await params
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return unauthorizedResponse()

    // Rate limit AI requests
    const rl = checkRateLimit(
      `${user.id}:ai`,
      parseInt(process.env.RATE_LIMIT_AI_RPH ?? '20'),
      60 * 60 * 1000
    )
    if (!rl.allowed) {
      return rateLimitedResponse()
    }

    const body = await request.json().catch(() => ({}))
    const parsed = parseBody(analyzeMeetingSchema, body)
    if (!parsed.success) return parsed.response
    const template: SummaryTemplate = parsed.data.template ?? 'general'

    // Verify ownership (IDOR protection)
    const { data: meeting } = await supabase
      .from('meetings')
      .select('id, title, status')
      .eq('id', id)
      .eq('user_id', user.id)
      .single()

    if (!meeting) return notFoundResponse()

    // Fetch transcript
    const { data: segments } = await supabase
      .from('transcript_segments')
      .select('speaker, text, start_time_ms, sequence_num')
      .eq('meeting_id', id)
      .order('sequence_num', { ascending: true })

    if (!segments || segments.length === 0) {
      return errorResponse('No transcript available for this meeting. Please transcribe first.', 400)
    }

    // Build transcript text
    const transcriptText = segments
      .map((s) => (s.speaker ? `${s.speaker}: ${s.text}` : s.text))
      .join('\n')

    // Run AI analysis
    const analysis = await analyzeMeeting(transcriptText, template, meeting.title)

    // Save to database (upsert — one per meeting per template)
    const adminSupabase = createServiceClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      { auth: { persistSession: false } }
    )

    const { data: saved, error } = await adminSupabase
      .from('meeting_summaries')
      .upsert(
        {
          meeting_id: id,
          user_id: user.id,
          template,
          summary: analysis.summary,
          key_takeaways: analysis.key_takeaways,
          decisions: analysis.decisions,
          action_items: analysis.action_items,
          topics: analysis.topics,
          important_moments: analysis.important_moments,
          raw_ai_response: analysis,
          generated_at: new Date().toISOString(),
        },
        { onConflict: 'meeting_id,template' }
      )
      .select()
      .single()

    if (error) throw error

    // Also upsert action items to the action_items table
    if (analysis.action_items.length > 0) {
      // Delete old AI-generated action items for this meeting
      await adminSupabase
        .from('action_items')
        .delete()
        .eq('meeting_id', id)
        .eq('user_id', user.id)

      await adminSupabase.from('action_items').insert(
        analysis.action_items.map((ai) => ({
          meeting_id: id,
          user_id: user.id,
          task: ai.task,
          owner: ai.owner,
          deadline: ai.deadline,
        }))
      )
    }

    // Update meeting status
    await adminSupabase
      .from('meetings')
      .update({ status: 'complete', updated_at: new Date().toISOString() })
      .eq('id', id)

    return NextResponse.json(saved, {
      headers: rateLimitHeaders(rl),
    })
  } catch (err) {
    console.error('[POST /api/meetings/[id]/summarize]', err)
    return errorResponse('AI analysis failed. Please try again.')
  }
}
