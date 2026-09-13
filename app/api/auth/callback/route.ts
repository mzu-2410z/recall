import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/'

  if (code) {
    const cookieStore = await cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() { return cookieStore.getAll() },
          setAll(cookiesToSet: Array<{ name: string; value: string; options?: any }>) {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          },
        },
      }
    )

    const { data, error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error && data?.session) {
      if (data.session.provider_token) {
        try {
          const { createClient: createServiceClient } = await import('@supabase/supabase-js')
          const adminSupabase = createServiceClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.SUPABASE_SERVICE_ROLE_KEY!,
            { auth: { persistSession: false } }
          )

          const updateData: Record<string, any> = {
            google_access_token: data.session.provider_token,
            updated_at: new Date().toISOString(),
          }
          if (data.session.provider_refresh_token) {
            updateData.google_refresh_token = data.session.provider_refresh_token
          }
          if (data.session.expires_at) {
            updateData.google_token_expiry = new Date(data.session.expires_at * 1000).toISOString()
          }

          await adminSupabase
            .from('profiles')
            .update(updateData)
            .eq('id', data.session.user.id)
        } catch (profileErr) {
          console.error('[auth/callback] Error persisting provider tokens to profile:', profileErr)
        }
      }

      return NextResponse.redirect(`${origin}${next}`)
    }
  }

  return NextResponse.redirect(`${origin}/login?error=auth_callback_failed`)
}
