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
  } catch (err: any) {
    console.error('[POST /api/ask] Exception caught:')
    if (err instanceof Error) {
      console.error(`Name: ${err.name}`)
      console.error(`Message: ${err.message}`)
      console.error(`Stack: ${err.stack}`)
    } else {
      console.error('Raw Error:', err)
    }

    if (err && typeof err === 'object') {
      const extra: Record<string, any> = {}
      if ('status' in err) extra.status = err.status
      if ('statusCode' in err) extra.statusCode = err.statusCode
      if ('code' in err) extra.code = err.code
      if ('details' in err) extra.details = err.details
      if ('hint' in err) extra.hint = err.hint
      if ('error' in err) extra.error = err.error
      if ('body' in err) extra.body = err.body
      if ('response' in err) {
        extra.response = {
          status: err.response?.status,
          statusText: err.response?.statusText,
          data: err.response?.data,
        }
      }

      if (Object.keys(extra).length > 0) {
        console.error('Additional Error Details:', JSON.stringify(extra, null, 2))
      }
    }

    return errorResponse('Failed to answer question. Please try again.')
  }
}
