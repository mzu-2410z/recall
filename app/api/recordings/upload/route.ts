import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { unauthorizedResponse, errorResponse } from '@/lib/validations'
import { getSignedUrl } from '@/lib/services/storage'

type Params = { params: Promise<{ meetingId: string }> }

const MAX_SIZE = parseInt(process.env.MAX_UPLOAD_BYTES ?? '524288000') // 500MB

// ── POST /api/recordings/upload — Handles recording file upload ──────────────
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return unauthorizedResponse()

    const meetingId = request.nextUrl.searchParams.get('meetingId')
    if (!meetingId) return errorResponse('meetingId required', 400)

    // Verify meeting ownership
    const { data: meeting } = await supabase
      .from('meetings')
      .select('id, status')
      .eq('id', meetingId)
      .eq('user_id', user.id)
      .single()

    if (!meeting) return errorResponse('Meeting not found', 404)

    // Check content length
    const contentLength = request.headers.get('content-length')
    if (contentLength && parseInt(contentLength) > MAX_SIZE) {
      return errorResponse(`Recording too large. Maximum size is ${MAX_SIZE / 1024 / 1024}MB`, 413)
    }

    const contentType = request.headers.get('content-type') || 'audio/webm'
    // Validate content type
    const allowedTypes = ['audio/webm', 'video/webm', 'audio/ogg', 'audio/mp4', 'video/mp4']
    if (!allowedTypes.some((t) => contentType.startsWith(t))) {
      return errorResponse('Unsupported file type', 415)
    }

    const ext = contentType.includes('ogg') ? 'ogg' : contentType.includes('mp4') ? 'mp4' : 'webm'
    const storagePath = `recordings/${user.id}/${meetingId}/recording.${ext}`

    // Stream directly to Supabase storage using service role
    const { createClient: createServiceClient } = await import('@supabase/supabase-js')
    const adminSupabase = createServiceClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      { auth: { persistSession: false } }
    )

    const blob = await request.blob()
    const { error: uploadError } = await adminSupabase.storage
      .from('recordings')
      .upload(storagePath, blob, { contentType, upsert: true })

    if (uploadError) throw new Error(`Upload failed: ${uploadError.message}`)

    // Update meeting record
    await adminSupabase
      .from('meetings')
      .update({
        recording_path: storagePath,
        status: 'transcribing',
        updated_at: new Date().toISOString(),
      })
      .eq('id', meetingId)

    return NextResponse.json({ path: storagePath, meetingId }, { status: 201 })
  } catch (err) {
    console.error('[POST /api/recordings/upload]', err)
    return errorResponse('Upload failed. Please try again.')
  }
}
