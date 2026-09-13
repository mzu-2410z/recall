import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { unauthorizedResponse, errorResponse, parseBody, askSchema } from '@/lib/validations'
import { checkRateLimit, rateLimitHeaders } from '@/lib/rate-limit'
import { answerQuestion } from '@/lib/services/knowledge'

// ── POST /api/ask ────────────────────────────────────────────────────────────
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return unauthorizedResponse()

    const rl = checkRateLimit(
      `${user.id}:ask`,
      parseInt(process.env.RATE_LIMIT_AI_RPH ?? '20'),
      60 * 60 * 1000
    )
    if (!rl.allowed) {
      return NextResponse.json(
        { error: 'Rate limit exceeded. Please wait before asking again.' },
        { status: 429 }
      )
    }

    const body = await request.json()
    const parsed = parseBody(askSchema, body)
    if (!parsed.success) return parsed.response

    const result = await answerQuestion(user.id, parsed.data.question)

    return NextResponse.json(result, { headers: rateLimitHeaders(rl) })
  } catch (err) {
    console.error('[POST /api/ask]', err)
    return errorResponse('Failed to answer question. Please try again.')
  }
}
