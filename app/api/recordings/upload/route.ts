import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { unauthorizedResponse, errorResponse } from '@/lib/validations'

type Params = { params: Promise<{ meetingId: string }> }

const MAX_SIZE = parseInt(process.env.MAX_UPLOAD_BYTES ?? '524288000') // 500MB

// ── POST /api/recordings/upload — Handles recording file upload ──────────────
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return unauthorizedResponse()

    // Parse FormData — the record page sends: file, title, duration
    const formData = await request.formData()
    const file = formData.get('file') as File | null
    const title = formData.get('title') as string ?? 'Untitled Meeting'
    const durationStr = formData.get('duration') as string ?? '0'
    const duration = parseInt(durationStr, 10) || 0

    if (!file) return errorResponse('No recording file provided', 400)

    if (file.size > MAX_SIZE) {
      return errorResponse(`Recording too large. Maximum size is ${MAX_SIZE / 1024 / 1024}MB`, 413)
    }

    const contentType = file.type || 'video/webm'
    const allowedTypes = ['audio/webm', 'video/webm', 'audio/ogg', 'audio/mp4', 'video/mp4']
    if (!allowedTypes.some((t) => contentType.startsWith(t))) {
      return errorResponse('Unsupported file type', 415)
    }

    // Use service role for DB + storage operations
    const { createClient: createServiceClient } = await import('@supabase/supabase-js')
    const adminSupabase = createServiceClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      { auth: { persistSession: false } }
    )

    // 1. Create meeting record first
    const { data: meeting, error: meetingError } = await adminSupabase
      .from('meetings')
      .insert({
        user_id: user.id,
        title,
        source: 'browser',
        status: 'uploading',
        started_at: new Date().toISOString(),
        duration_seconds: duration > 0 ? duration : null,
      })
      .select('id')
      .single()

    if (meetingError || !meeting) {
      throw new Error(`Failed to create meeting: ${meetingError?.message}`)
    }

    const meetingId = meeting.id

    // 2. Upload to Supabase storage
    const ext = contentType.includes('ogg') ? 'ogg' : contentType.includes('mp4') ? 'mp4' : 'webm'
    const storagePath = `recordings/${user.id}/${meetingId}/recording.${ext}`

    const blob = new Blob([await file.arrayBuffer()], { type: contentType })

    const { error: uploadError } = await adminSupabase.storage
      .from('recordings')
      .upload(storagePath, blob, { contentType, upsert: true })

    if (uploadError) {
      // Clean up meeting record if upload failed
      await adminSupabase.from('meetings').delete().eq('id', meetingId)
      throw new Error(`Upload failed: ${uploadError.message}`)
    }

    // 3. Update meeting with recording path and status
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
