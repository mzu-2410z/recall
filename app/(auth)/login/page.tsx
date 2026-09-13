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
    <>
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');

        .login-root {
          font-family: -apple-system, 'Inter', BlinkMacSystemFont, 'SF Pro Display', 'SF Pro Text', 'Helvetica Neue', sans-serif;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
          background: 
            radial-gradient(circle at 0% 0%, rgba(0, 113, 227, 0.05) 0%, transparent 40%),
            radial-gradient(circle at 100% 100%, rgba(0, 113, 227, 0.03) 0%, transparent 40%),
            #f5f5f7;
        }

        .apple-logo-glow {
          background: linear-gradient(135deg, #2997ff 0%, #0071e3 50%, #0059b3 100%);
          box-shadow: 
            0 2px 8px rgba(0, 113, 227, 0.2),
            inset 0 1px 0 rgba(255, 255, 255, 0.2);
        }

        .login-glass-card {
          background: rgba(255, 255, 255, 0.65);
          backdrop-filter: blur(40px) saturate(200%);
          -webkit-backdrop-filter: blur(40px) saturate(200%);
          border: 1px solid rgba(255, 255, 255, 0.7);
          box-shadow: 
            0 0 0 0.5px rgba(0, 0, 0, 0.02),
            0 2px 10px rgba(0, 0, 0, 0.02),
            0 20px 50px rgba(0, 0, 0, 0.05);
        }

        .btn-google-apple {
          background: rgba(255, 255, 255, 0.85);
          border: 1px solid rgba(0, 0, 0, 0.08);
          box-shadow: 
            0 1px 2px rgba(0, 0, 0, 0.02),
            inset 0 1px 0 rgba(255, 255, 255, 0.5);
          transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .btn-google-apple:hover {
          background: #ffffff;
          border-color: rgba(0, 0, 0, 0.15);
          transform: translateY(-1px);
          box-shadow: 
            0 4px 12px rgba(0, 0, 0, 0.04),
            inset 0 1px 0 rgba(255, 255, 255, 1);
        }

        .btn-google-apple:active {
          transform: translateY(0);
          background: #f5f5f7;
          box-shadow: 
            0 1px 2px rgba(0, 0, 0, 0.02),
            inset 0 1px 3px rgba(0, 0, 0, 0.05);
        }

        .legal-link {
          position: relative;
          color: #0071e3;
          font-weight: 400;
          text-decoration: none;
          transition: opacity 0.15s ease;
        }

        .legal-link:hover {
          opacity: 0.8;
          text-decoration: underline;
        }
      `}</style>

      <div className="login-root min-h-screen flex items-center justify-center px-4">
        <div className="w-full max-w-[380px]">
          {/* Logo & Header Section */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2.5 mb-6">
              <div className="w-10 h-10 apple-logo-glow rounded-[11px] flex items-center justify-center">
                <svg width="22" height="22" viewBox="0 0 20 20" fill="none">
                  <circle cx="10" cy="10" r="7" stroke="white" strokeWidth="2" strokeLinecap="round" />
                  <circle cx="10" cy="10" r="2.5" fill="white" />
                </svg>
              </div>
              <span className="text-[23px] font-semibold text-[#1d1d1f] tracking-tight" style={{ letterSpacing: '-0.02em' }}>
                Recall
              </span>
            </div>

            <h1
              className="font-semibold text-[#1d1d1f] tracking-tight leading-[1.15] mb-3"
              style={{ fontSize: '28px', letterSpacing: '-0.02em' }}
            >
              Meeting intelligence,<br />finally organized.
            </h1>

            <p
              className="text-[#86868b] leading-relaxed"
              style={{ fontSize: '15px', letterSpacing: '-0.01em' }}
            >
              Capture, transcribe, and understand your meetings automatically.
            </p>
          </div>

          {/* Sign in card */}
          <div className="login-glass-card rounded-2xl p-8">
            <button
              onClick={handleGoogleSignIn}
              className="btn-google-apple w-full flex items-center justify-center gap-3 rounded-xl px-4 py-3.5 text-[15px] font-medium text-[#1d1d1f]"
            >
              <GoogleIcon />
              Continue with Google
            </button>

            <div className="mt-6 text-center">
              <p
                className="text-[#86868b] leading-relaxed"
                style={{ fontSize: '12px', letterSpacing: '-0.005em' }}
              >
                Recall requests read access to your Google Calendar<br />
                and Google Meet to surface your upcoming meetings.
              </p>
            </div>
          </div>

          {/* Legal / Footer */}
          <p
            className="text-center text-[#86868b] mt-8 leading-relaxed"
            style={{ fontSize: '12px', letterSpacing: '-0.005em' }}
          >
            By signing in, you agree to Recall's{' '}
            <span className="legal-link cursor-pointer">Terms</span> and{' '}
            <span className="legal-link cursor-pointer">Privacy Policy</span>.
          </p>
        </div>
      </div>
    </>
  )
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" className="flex-shrink-0">
      <path d="M17.64 9.205c0-.639-.057-1.252-.164-1.841H9v3.481h4.844a4.14 4.14 0 01-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4" />
      <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z" fill="#34A853" />
      <path d="M3.964 10.71A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 000 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05" />
      <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335" />
    </svg>
  )
}