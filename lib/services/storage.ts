import { createClient } from '@/lib/supabase/server'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!

export type StoragePath = string // e.g. "recordings/user-id/meeting-id/recording.webm"

/**
 * Uploads a recording blob to Supabase Storage.
 * Returns the storage path.
 */
export async function uploadRecording(
  userId: string,
  meetingId: string,
  blob: Blob,
  extension = 'webm'
): Promise<StoragePath> {
  const { createClient: createServiceClient } = await import('@supabase/supabase-js')
  const supabase = createServiceClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
    auth: { persistSession: false },
  })

  const path = `recordings/${userId}/${meetingId}/recording.${extension}`

  const { error } = await supabase.storage
    .from('recordings')
    .upload(path, blob, {
      contentType: blob.type || `audio/${extension}`,
      upsert: true,
    })

  if (error) throw new Error(`Storage upload failed: ${error.message}`)

  return path
}

/**
 * Generates a short-lived signed URL for playback.
 * Never returns a permanent public URL.
 */
export async function getSignedUrl(
  path: StoragePath,
  expiresInSeconds = 3600
): Promise<string> {
  const { createClient: createServiceClient } = await import('@supabase/supabase-js')
  const supabase = createServiceClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
    auth: { persistSession: false },
  })

  const { data, error } = await supabase.storage
    .from('recordings')
    .createSignedUrl(path, expiresInSeconds)

  if (error || !data?.signedUrl) {
    throw new Error(`Failed to create signed URL: ${error?.message}`)
  }

  return data.signedUrl
}

/**
 * Deletes a recording from storage.
 */
export async function deleteRecording(path: StoragePath): Promise<void> {
  const { createClient: createServiceClient } = await import('@supabase/supabase-js')
  const supabase = createServiceClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
    auth: { persistSession: false },
  })

  const { error } = await supabase.storage.from('recordings').remove([path])
  if (error) throw new Error(`Failed to delete recording: ${error.message}`)
}

/**
 * Generates an upload URL for direct browser upload (avoids routing through server).
 */
export async function getUploadSignedUrl(
  userId: string,
  meetingId: string,
  extension = 'webm'
): Promise<{ uploadUrl: string; path: StoragePath }> {
  const { createClient: createServiceClient } = await import('@supabase/supabase-js')
  const supabase = createServiceClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
    auth: { persistSession: false },
  })

  const path = `recordings/${userId}/${meetingId}/recording.${extension}`

  const { data, error } = await supabase.storage
    .from('recordings')
    .createSignedUploadUrl(path)

  if (error || !data?.signedUrl) {
    throw new Error(`Failed to create upload URL: ${error?.message}`)
  }

  return { uploadUrl: data.signedUrl, path }
}
