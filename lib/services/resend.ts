export interface EmailSummaryPayload {
  to: string
  meetingTitle: string
  summary: string
  keyTakeaways?: string[]
  decisions?: string[]
  actionItems?: Array<{ task: string; owner?: string | null; deadline?: string | null }>
  topics?: string[]
}

/**
  * Sends a meeting summary email using Resend REST API.
  */
export async function sendMeetingSummaryEmail(payload: EmailSummaryPayload) {
  const apiKey = process.env.RESEND_API_KEY
  const fromEmail = process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev'

  if (!apiKey) {
    console.warn('[Resend] RESEND_API_KEY is not set. Email dispatch skipped.')
    return { success: false, error: 'RESEND_API_KEY not configured' }
  }

  const takeawaysHtml = payload.keyTakeaways && payload.keyTakeaways.length > 0
    ? `<div style="margin-top: 16px;">
        <h3 style="font-size: 14px; text-transform: uppercase; color: #86868b; margin-bottom: 8px;">Key Takeaways</h3>
        <ul style="margin: 0; padding-left: 20px;">${payload.keyTakeaways.map(t => `<li style="margin-bottom: 4px;">${t}</li>`).join('')}</ul>
       </div>`
    : ''

  const decisionsHtml = payload.decisions && payload.decisions.length > 0
    ? `<div style="margin-top: 16px;">
        <h3 style="font-size: 14px; text-transform: uppercase; color: #34c759; margin-bottom: 8px;">Decisions Made</h3>
        <ul style="margin: 0; padding-left: 20px;">${payload.decisions.map(d => `<li style="margin-bottom: 4px;">${d}</li>`).join('')}</ul>
       </div>`
    : ''

  const actionItemsHtml = payload.actionItems && payload.actionItems.length > 0
    ? `<div style="margin-top: 16px;">
        <h3 style="font-size: 14px; text-transform: uppercase; color: #0071e3; margin-bottom: 8px;">Action Items</h3>
        <ul style="margin: 0; padding-left: 20px;">${payload.actionItems.map(a => `<li style="margin-bottom: 4px;"><strong>${a.task}</strong>${a.owner ? ` — <em>Owner: ${a.owner}</em>` : ''}${a.deadline ? ` (Due: ${a.deadline})` : ''}</li>`).join('')}</ul>
       </div>`
    : ''

  const html = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #1d1d1f; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="border-bottom: 1px solid #e5e5e5; padding-bottom: 12px; margin-bottom: 20px;">
        <span style="font-size: 12px; font-weight: 600; color: #0071e3; text-transform: uppercase; letter-spacing: 0.05em;">Recall Meeting Summary</span>
        <h1 style="margin: 6px 0 0 0; font-size: 22px; font-weight: 600; color: #1d1d1f;">${payload.meetingTitle}</h1>
      </div>

      <div style="background: #f5f5f7; border-radius: 12px; padding: 16px; margin-bottom: 20px;">
        <h2 style="margin: 0 0 8px 0; font-size: 14px; text-transform: uppercase; color: #86868b;">Executive Summary</h2>
        <p style="margin: 0; font-size: 15px; color: #1d1d1f;">${payload.summary}</p>
      </div>

      ${takeawaysHtml}
      ${decisionsHtml}
      ${actionItemsHtml}

      <div style="border-top: 1px solid #e5e5e5; margin-top: 30px; padding-top: 16px; text-align: center;">
        <p style="margin: 0; font-size: 12px; color: #86868b;">Generated & sent automatically by Recall AI Meeting Notetaker.</p>
      </div>
    </div>
  `

  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: fromEmail,
        to: [payload.to],
        subject: `[Recall] Summary: ${payload.meetingTitle}`,
        html,
      }),
    })

    if (!res.ok) {
      const errText = await res.text()
      console.error('[Resend] API error:', res.status, errText)
      return { success: false, error: errText }
    }

    const data = await res.json()
    console.log('[Resend] Email sent successfully:', data.id)
    return { success: true, data }
  } catch (err: any) {
    console.error('[Resend] Fetch error:', err)
    return { success: false, error: err.message || 'Network error' }
  }
}
