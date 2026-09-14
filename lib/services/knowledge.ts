import { createClient } from '@/lib/supabase/server'
import { askAboutMeetings } from './ai'
import { SHOWCASE_MEETING_TITLE } from '@/lib/seeds/showcase-transcript'

function generateDemoAnswer(question: string): string {
  const q = question.toLowerCase().trim()

  // 1. Specific Person / Feature / Metric queries
  if (q.includes('daniel') || q.includes('api') || q.includes('uptime') || q.includes('rate limit')) {
    return `Daniel (Tech Lead) reported that traffic spikes degraded p99 API latency to 800ms. He is leading rate limiter refactoring and database connection pooling to hit a 99.9% uptime SLA by next Wednesday. Alex is assisting with Redis cluster upgrades.`
  }
  if (q.includes('emily') || q.includes('onboarding') || q.includes('figma') || q.includes('ux')) {
    return `Emily (UX Lead) presented the onboarding redesign, which streamlined account creation from 7 steps down to 3 and reduced user drop-off by 34%. She will hand off final Figma specs to Marcus on Tuesday.`
  }
  if (q.includes('priya') || q.includes('analytics') || q.includes('dashboard') || q.includes('sentiment')) {
    return `Priya (Data Eng) confirmed that real-time analytics pipelines aggregating meeting metrics, sentiment, and action item completion are fully operational and ready for frontend visualization.`
  }
  if (q.includes('jordan') || q.includes('devops') || q.includes('ci/cd') || q.includes('deployment')) {
    return `Jordan (DevOps Lead) provisioned multi-region failover staging/production environments and is finalizing CI/CD deployment pipelines and security scanning rules by Thursday.`
  }
  if (q.includes('david') || q.includes('qa') || q.includes('test')) {
    return `David (QA Lead) is preparing automated end-to-end regression suites for the onboarding redesign and analytics dashboard, scheduled to run on Friday after Marcus merges frontend components.`
  }

  // 2. Key Takeaways
  if (
    q.includes('takeaway') ||
    q.includes('key point') ||
    q.includes('insight') ||
    q.includes('highlight')
  ) {
    return `Key takeaways from the ${SHOWCASE_MEETING_TITLE}:\n\n` +
      `1. **API Reliability**: Infrastructure must complete rate limiter refactoring and connection pooling by Wednesday to achieve 99.9% uptime SLA after p99 latency spiked to 800ms.\n` +
      `2. **Onboarding Redesign**: UX streamlined account creation from 7 steps down to 3, yielding a 34% reduction in drop-off during user testing.\n` +
      `3. **Analytics Dashboard**: Real-time aggregation pipelines (meeting metrics, sentiment, action item completion) are operational on the backend.\n` +
      `4. **QA & Launch Prep**: Automated integration test suites execute Friday following frontend component merges; DevOps deployment rules finalize Thursday.`
  }

  // 3. Decisions Made
  if (
    q.includes('decision') ||
    q.includes('decide') ||
    q.includes('agreed') ||
    q.includes('approved') ||
    q.includes('resolved')
  ) {
    return `Key decisions made during the ${SHOWCASE_MEETING_TITLE}:\n\n` +
      `1. **Onboarding Redesign**: Approved the 3-step signup flow and Figma asset handoff scheduled for Tuesday.\n` +
      `2. **Uptime SLA**: Confirmed 99.9% API uptime target supported by database connection pooling and rate limiter refactoring.\n` +
      `3. **Analytics Pipeline**: Approved exposing real-time metric and sentiment aggregation endpoints to the frontend.\n` +
      `4. **QA & Deployment**: Agreed on automated regression testing on Friday and multi-region failover CI/CD pipeline rules for Thursday.`
  }

  // 4. Who is responsible / Owners / Assignees
  if (
    q.includes('responsible') ||
    q.includes('owner') ||
    q.includes('assigned') ||
    q.includes('who is') ||
    q.includes('who owns') ||
    q.includes('who will') ||
    q.includes('who handles')
  ) {
    return `Owners and task responsibilities from the meeting:\n\n` +
      `• **Daniel (Tech Lead)**: API rate limiter refactoring & DB connection pooling (Due: Wednesday)\n` +
      `• **Emily (UX Lead)**: Onboarding redesign Figma asset handoff (Due: Tuesday)\n` +
      `• **Marcus (Frontend Eng)**: Implementing onboarding UI components & design tokens (Due: Friday)\n` +
      `• **Alex (Backend Lead)**: Redis cluster upgrade, API gateway query optimization & caching\n` +
      `• **Priya (Data Eng)**: Exposing real-time analytics aggregation endpoints\n` +
      `• **David (QA Lead)**: End-to-end automated regression testing (Due: Friday)\n` +
      `• **Jordan (DevOps Lead)**: Finalizing CI/CD pipelines & security scanning (Due: Thursday)`
  }

  // 5. Action Items / Tasks / Next Steps
  if (
    q.includes('action') ||
    q.includes('task') ||
    q.includes('todo') ||
    q.includes('to-do') ||
    q.includes('next step') ||
    q.includes('commitment') ||
    q.includes('deliverable')
  ) {
    return `Action items and next steps from the ${SHOWCASE_MEETING_TITLE}:\n\n` +
      `1. **Emily**: Finalize onboarding redesign assets & hand off Figma specs to Marcus by Tuesday.\n` +
      `2. **Daniel**: Complete rate limiter refactoring and DB connection pooling by Wednesday.\n` +
      `3. **Alex**: Complete Redis cluster upgrade and query optimization for the API gateway.\n` +
      `4. **Jordan**: Finalize CI/CD deployment pipelines & security scanning rules by Thursday.\n` +
      `5. **Marcus**: Complete frontend onboarding implementation for QA review by Friday.\n` +
      `6. **Priya**: Expose real-time analytics endpoints to Marcus for visualization.\n` +
      `7. **David**: Execute automated integration test runs on Friday.`
  }

  // 6. Topics / What did they discuss / Main topics
  if (
    q.includes('topic') ||
    q.includes('discuss') ||
    q.includes('cover') ||
    q.includes('talk about') ||
    q.includes('agenda') ||
    q.includes('subject')
  ) {
    return `Main topics discussed during the ${SHOWCASE_MEETING_TITLE}:\n\n` +
      `1. **Q4 Roadmap Alignment**: Overall product milestones and launch planning.\n` +
      `2. **API Reliability**: Resolving 800ms latency spikes and targeting a 99.9% uptime SLA.\n` +
      `3. **Onboarding Redesign**: Streamlining account creation from 7 steps to 3 to reduce drop-off.\n` +
      `4. **Analytics Dashboard**: Backend pipelines for real-time meeting metrics and sentiment.\n` +
      `5. **QA & DevOps Launch Rules**: Automated regression testing, CI/CD, and multi-region failover.`
  }

  // 7. Summarize / Summary / Overview
  if (
    q.includes('summary') ||
    q.includes('summarize') ||
    q.includes('overview') ||
    q.includes('synopsis') ||
    q.includes('brief') ||
    q.includes('what happened')
  ) {
    return `Summary of the ${SHOWCASE_MEETING_TITLE}:\n\n` +
      `The product and engineering leads aligned on key Q4 roadmap initiatives. Infrastructure focused on API reliability (Daniel & Alex) to guarantee a 99.9% uptime SLA by Wednesday. UX finalized a streamlined 3-step onboarding flow (Emily & Marcus) that reduced user drop-off by 34%. Data engineering completed real-time analytics pipelines (Priya), and QA/DevOps (David & Jordan) prepared automated testing and multi-region deployment pipelines for Friday.`
  }

  // 8. General fallback
  return `During the ${SHOWCASE_MEETING_TITLE}, the team reviewed Q4 key initiatives: API reliability (Daniel/Alex), onboarding redesign (Emily/Marcus), real-time analytics dashboard (Priya/Marcus), and launch deployment pipelines (David/Jordan). All teams reported on-track progress for Q4 release.`
}

async function getDemoAnswer(
  userId: string,
  question: string
): Promise<{
  answer: string
  sourceMeetings: Array<{ meetingId: string; title: string; startedAt: string }>
}> {
  let sourceMeetings: Array<{ meetingId: string; title: string; startedAt: string }> = []
  try {
    const supabase = await createClient()
    const { data: dbMeetings } = await supabase
      .from('meetings')
      .select('id, title, started_at')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(3)

    if (dbMeetings && dbMeetings.length > 0) {
      sourceMeetings = dbMeetings.map((m) => ({
        meetingId: m.id,
        title: m.title,
        startedAt: m.started_at ?? new Date().toISOString(),
      }))
    }
  } catch (err) {
    // Ignore DB error in fallback
  }

  if (sourceMeetings.length === 0) {
    sourceMeetings = [
      {
        meetingId: 'demo-showcase-meeting',
        title: SHOWCASE_MEETING_TITLE,
        startedAt: new Date().toISOString(),
      },
    ]
  }

  const answer = generateDemoAnswer(question)

  return {
    answer,
    sourceMeetings,
  }
}

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
  if (process.env.DEMO_MODE === 'true') {
    return getDemoAnswer(userId, question)
  }

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
