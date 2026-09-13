import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  // Use fallback empty strings so that prerender at build time doesn't throw.
  // The client will fail gracefully at runtime if real values are not set.
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL ?? '',
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? ''
  )
}
