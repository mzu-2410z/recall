import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { unauthorizedResponse, errorResponse } from '@/lib/validations'
import { sendMeetingSummaryEmail } from '@/lib/services/resend'

// ── POST /api/email/send ──────────────────────────────────────────────────────
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user || !user.email) return unauthorizedResponse()

    const body = await request.json()
    const { meetingTitle, summary, keyTakeaways, decisions, actionItems, topics, recipientEmail } = body

    const toEmail = recipientEmail || user.email

    const result = await sendMeetingSummaryEmail({
      to: toEmail,
      meetingTitle: meetingTitle || 'Meeting Summary',
      summary: summary || '',
      keyTakeaways: keyTakeaways || [],
      decisions: decisions || [],
      actionItems: actionItems || [],
      topics: topics || [],
    })

    if (!result.success) {
      return errorResponse(result.error || 'Failed to send email summary', 500)
    }

    return NextResponse.json({ success: true, data: result.data })
  } catch (err) {
    console.error('[POST /api/email/send]', err)
    return errorResponse('Failed to send email summary')
  }
}
