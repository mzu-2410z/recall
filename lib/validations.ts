import { z } from 'zod'
import { NextResponse } from 'next/server'

// ── Common field validators ───────────────────────────────────────────────────

export const uuidSchema = z.string().uuid()

export const meetingSourceSchema = z.enum(['google_meet', 'browser', 'youtube', 'imported'])

export const summaryTemplateSchema = z.enum(['general', 'project_update', 'interview', 'concise'])

// ── Request body schemas ──────────────────────────────────────────────────────

export const createMeetingSchema = z.object({
  title: z.string().min(1).max(300).trim(),
  source: meetingSourceSchema,
  started_at: z.string().datetime().optional(),
  participant_count: z.number().int().min(1).max(1000).optional(),
  participants: z.array(z.object({
    name: z.string().max(200),
    email: z.string().email().optional(),
  })).max(100).optional(),
  calendar_event_id: z.string().max(500).optional(),
  google_meet_id: z.string().max(500).optional(),
  youtube_url: z.string().url().optional(),
})

export const updateMeetingSchema = z.object({
  title: z.string().min(1).max(300).trim().optional(),
  status: z.enum(['pending','recording','uploading','transcribing','analyzing','complete','failed']).optional(),
  ended_at: z.string().datetime().optional(),
  duration_seconds: z.number().int().min(0).optional(),
})

export const createHighlightSchema = z.object({
  timestamp_ms: z.number().int().min(0),
  label: z.string().max(500).trim().optional(),
  note: z.string().max(2000).trim().optional(),
})

export const createClipSchema = z.object({
  meeting_id: z.string().uuid(),
  start_ms: z.number().int().min(0),
  end_ms: z.number().int().min(0),
  label: z.string().max(500).trim().optional(),
}).refine((data) => data.end_ms > data.start_ms, {
  message: 'end_ms must be greater than start_ms',
})

export const youtubeProcessSchema = z.object({
  url: z.string().url().refine((url) => {
    try {
      const u = new URL(url)
      return ['youtube.com', 'www.youtube.com', 'youtu.be', 'm.youtube.com'].includes(u.hostname)
    } catch {
      return false
    }
  }, { message: 'Must be a valid YouTube URL' }),
  title: z.string().max(300).trim().optional(),
})

export const askSchema = z.object({
  question: z.string().min(1).max(1000).trim(),
})

export const analyzeMeetingSchema = z.object({
  template: summaryTemplateSchema.optional(),
})

// ── Helper to parse and validate ─────────────────────────────────────────────

export function parseBody<T>(schema: z.ZodSchema<T>, body: unknown):
  | { success: true; data: T }
  | { success: false; response: NextResponse } {
  const result = schema.safeParse(body)
  if (!result.success) {
    return {
      success: false,
      response: NextResponse.json(
        { error: 'Invalid request', details: result.error.flatten() },
        { status: 400 }
      ),
    }
  }
  return { success: true, data: result.data }
}

// ── Standard error responses ──────────────────────────────────────────────────

export function errorResponse(message: string, status = 500): NextResponse {
  // Never leak internal error details to the client
  const safeMessage =
    status < 500 ? message : 'An unexpected error occurred. Please try again.'
  return NextResponse.json({ error: safeMessage }, { status })
}

export function unauthorizedResponse(): NextResponse {
  return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
}

export function notFoundResponse(): NextResponse {
  return NextResponse.json({ error: 'Not found' }, { status: 404 })
}

export function rateLimitedResponse(): NextResponse {
  return NextResponse.json(
    { error: 'Rate limit exceeded. Please wait before trying again.' },
    { status: 429 }
  )
}
