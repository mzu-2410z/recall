'use client'

import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const supabase = createClient()
  const router = useRouter()

  const handleGoogleSignIn = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/api/auth/callback`,
        queryParams: {
          access_type: 'offline',
          prompt: 'select_account',
        },
      },
    })
  }

  return (
    <div className="min-h-screen bg-[#F5F5F7] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 mb-6">
            <div className="w-9 h-9 bg-[#007AFF] rounded-xl flex items-center justify-center">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <circle cx="10" cy="10" r="7" stroke="white" strokeWidth="2"/>
                <circle cx="10" cy="10" r="2.5" fill="white"/>
              </svg>
            </div>
            <span className="text-[22px] font-semibold text-[#1D1D1F] tracking-tight">Recall</span>
          </div>
          <h1 className="text-[28px] font-semibold text-[#1D1D1F] tracking-tight leading-tight mb-2">
            Meeting intelligence,<br/>finally organized.
          </h1>
          <p className="text-[15px] text-[#6E6E73] leading-relaxed">
            Capture, transcribe, and understand your meetings automatically.
          </p>
        </div>

        {/* Sign in card */}
        <div className="bg-white rounded-2xl shadow-sm border border-black/[0.06] p-8">
          <button
            onClick={handleGoogleSignIn}
            className="w-full flex items-center justify-center gap-3 bg-white border border-black/[0.12] rounded-xl px-4 py-3.5 text-[15px] font-medium text-[#1D1D1F] hover:bg-[#F5F5F7] transition-colors duration-150 shadow-sm"
          >
            <GoogleIcon />
            Continue with Google
          </button>

          <div className="mt-6 text-center">
            <p className="text-[13px] text-[#86868B] leading-relaxed">
              Recall requests read access to your Google Calendar<br/>
              and Google Meet to surface your upcoming meetings.
            </p>
          </div>
        </div>

        {/* Legal */}
        <p className="text-center text-[12px] text-[#86868B] mt-6 leading-relaxed">
          By signing in, you agree to Recall's{' '}
          <span className="text-[#007AFF] cursor-pointer">Terms</span> and{' '}
          <span className="text-[#007AFF] cursor-pointer">Privacy Policy</span>.
        </p>
      </div>
    </div>
  )
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <path d="M17.64 9.205c0-.639-.057-1.252-.164-1.841H9v3.481h4.844a4.14 4.14 0 01-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/>
      <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z" fill="#34A853"/>
      <path d="M3.964 10.71A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 000 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05"/>
      <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
    </svg>
  )
}
