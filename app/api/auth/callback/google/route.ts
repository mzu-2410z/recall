import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createClient as createServiceClient } from '@supabase/supabase-js'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const code = searchParams.get('code')
  const state = searchParams.get('state')
  const error = searchParams.get('error')

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

  if (error || !code) {
    return NextResponse.redirect(`${appUrl}/settings?error=google_auth_failed`)
  }

  try {
    const clientId = process.env.GOOGLE_CLIENT_ID || ''
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET || ''
    const redirectUri = process.env.GOOGLE_REDIRECT_URI || `${appUrl}/api/auth/callback/google`

    const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri,
        grant_type: 'authorization_code',
      }).toString(),
    })

    if (!tokenRes.ok) {
      return NextResponse.redirect(`${appUrl}/settings?error=no_tokens`)
    }

    const tokens = await tokenRes.json()

    let userId: string | null = state
    if (!userId) {
      const supabase = await createClient()
      const { data: { user } } = await supabase.auth.getUser()
      userId = user?.id || null
    }

    if (!userId) {
      return NextResponse.redirect(`${appUrl}/login`)
    }

    const adminSupabase = createServiceClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      { auth: { persistSession: false } }
    )

    const updateData: Record<string, any> = {
      google_access_token: tokens.access_token,
      google_token_expiry: tokens.expires_in
        ? new Date(Date.now() + tokens.expires_in * 1000).toISOString()
        : null,
      google_scopes: tokens.scope?.split(' ') ?? [],
      updated_at: new Date().toISOString(),
    }

    if (tokens.refresh_token) {
      updateData.google_refresh_token = tokens.refresh_token
    }

    await adminSupabase
      .from('profiles')
      .update(updateData)
      .eq('id', userId)

    return NextResponse.redirect(`${appUrl}/settings?success=google_connected`)
  } catch (err) {
    console.error('[Google OAuth callback error]', err)
    return NextResponse.redirect(`${appUrl}/settings?error=google_auth_failed`)
  }
}
