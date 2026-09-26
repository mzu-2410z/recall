'use client'

import { useEffect, useRef, useState, useMemo } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import {
  Mic, Calendar, Sparkles, Lock, Shield, ArrowRight,
  Check, Globe, Info, HelpCircle
} from 'lucide-react'

/* ═══════════════════════════════════════════════════════════════════════════
   HOOKS & INTERACTIONS (Ported from Landing Page visual system)
   ═══════════════════════════════════════════════════════════════════════════ */

function useMousePosition(containerRef: React.RefObject<HTMLElement | null>) {
  const [pos, setPos] = useState({ x: 0, y: 0, active: false })
  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const move = (e: MouseEvent) => {
      const r = el.getBoundingClientRect()
      setPos({ x: e.clientX - r.left, y: e.clientY - r.top, active: true })
    }
    const leave = () => setPos(p => ({ ...p, active: false }))
    el.addEventListener('mousemove', move)
    el.addEventListener('mouseleave', leave)
    return () => {
      el.removeEventListener('mousemove', move)
      el.removeEventListener('mouseleave', leave)
    }
  }, [containerRef])
  return pos
}

/* ═══════════════════════════════════════════════════════════════════════════
   PARTICLE CANVAS (Provides premium organic movement behind the login card)
   ═══════════════════════════════════════════════════════════════════════════ */

function ParticleField({ count = 30, color = '120, 113, 108', opacity = 0.4 }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    let raf: number
    const resize = () => {
      canvas.width = canvas.offsetWidth * 2
      canvas.height = canvas.offsetHeight * 2
      ctx.scale(2, 2)
    }
    resize()
    window.addEventListener('resize', resize)
    const particles = Array.from({ length: count }, () => ({
      x: Math.random() * canvas.offsetWidth,
      y: Math.random() * canvas.offsetHeight,
      vx: (Math.random() - 0.5) * 0.2,
      vy: (Math.random() - 0.5) * 0.2,
      size: Math.random() * 1.8 + 0.5,
      o: Math.random() * 0.12 + 0.03,
      life: Math.random() * 1000,
    }))
    const animate = () => {
      const w = canvas.offsetWidth, h = canvas.offsetHeight
      ctx.clearRect(0, 0, w, h)
      particles.forEach(p => {
        p.x += p.vx; p.y += p.vy; p.life += 0.006
        if (p.x < 0) p.x = w; if (p.x > w) p.x = 0
        if (p.y < 0) p.y = h; if (p.y > h) p.y = 0
        const flicker = Math.sin(p.life) * 0.5 + 0.5
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(${color}, ${p.o * flicker})`
        ctx.fill()
      })
      raf = requestAnimationFrame(animate)
    }
    animate()
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
    }
  }, [count, color])
  return <canvas ref={canvasRef} aria-hidden style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', opacity }} />
}

/* ═══════════════════════════════════════════════════════════════════════════
   FLOATING ORBS
   ═══════════════════════════════════════════════════════════════════════════ */

function FloatingOrbs() {
  const colors = ['rgba(180,83,9,0.08)', 'rgba(15,118,110,0.06)', 'rgba(124,58,237,0.04)']
  return (
    <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden' }} aria-hidden>
      {colors.map((c, i) => (
        <div key={i} className={`rc-orb rc-orb-${i + 1}`} style={{
          position: 'absolute',
          top: `${20 + i * 20}%`,
          left: i === 1 ? 'auto' : `${10 + i * 25}%`,
          right: i === 1 ? '10%' : 'auto',
          width: 300 + i * 50, height: 300 + i * 50,
          borderRadius: '50%',
          background: `radial-gradient(circle, ${c}, transparent 70%)`,
          filter: `blur(${50 + i * 10}px)`,
        }} />
      ))}
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════════════════
   LOGO (Identical to Landing Page vector branding)
   ═══════════════════════════════════════════════════════════════════════════ */

function Logo() {
  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 9 }}>
      <div style={{
        width: 32, height: 32, borderRadius: 10,
        background: 'rgba(10,10,10,0.03)', backdropFilter: 'blur(8px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        border: '1px solid rgba(10,10,10,0.06)',
      }}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
          <circle cx="12" cy="12" r="7.5" stroke="#0A0A0A" strokeWidth="1.5" />
          <circle cx="12" cy="12" r="2.5" fill="#0A0A0A" />
          <circle cx="12" cy="12" r="11" stroke="#0A0A0A" strokeWidth="0.5" opacity="0.25" strokeDasharray="2.5 2.5" />
        </svg>
      </div>
      <a href="/" style={{ textDecoration: 'none' }}>
        <span style={{ fontSize: 19, fontWeight: 600, color: '#0A0A0A', letterSpacing: '-0.45px' }}>
          Recall
        </span>
      </a>

    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════════════════
   MAIN COMPONENT
   ═══════════════════════════════════════════════════════════════════════════ */

export default function LoginPage() {
  const supabase = createClient()
  const router = useRouter()
  const cardRef = useRef<HTMLDivElement>(null)
  const mouse = useMousePosition(cardRef)
  const [loading, setLoading] = useState(false)

  const handleGoogleSignIn = async () => {
    setLoading(true)
    try {
      await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/api/auth/callback`,
          scopes: 'https://www.googleapis.com/auth/calendar.readonly https://www.googleapis.com/auth/meetings.space.created https://www.googleapis.com/auth/meetings.space.readonly',
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        },
      })
    } catch (error) {
      console.error('Authentication Error:', error)
      setLoading(false)
    }
  }

  return (
    <>
      <style>{CSS}</style>

      {/* Persistent Visual Backing matching Landing Page */}
      <div className="login-bg-layer" />
      <FloatingOrbs />
      <ParticleField count={32} />

      <div className="login-root min-h-screen flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-[440px] relative z-10">
          
          {/* Top Logo Navigation Back-link */}
          <div className="text-center mb-8">
            <div className="inline-block transition-transform duration-300 hover:scale-[1.02] cursor-pointer">
              <Logo />
            </div>
          </div>

          {/* Core Interactive Login Panel */}
          <div 
            ref={cardRef} 
            className="rc-liquid-glass login-card p-8 relative overflow-hidden"
            style={{
              background: 'linear-gradient(135deg, rgba(255,255,255,0.65) 0%, rgba(255,255,255,0.3) 40%, rgba(255,255,255,0.45) 60%, rgba(255,255,255,0.65) 100%)',
              backdropFilter: 'blur(40px) saturate(200%)',
              WebkitBackdropFilter: 'blur(40px) saturate(200%)',
              border: '1px solid rgba(255,255,255,0.7)',
              borderRadius: 24,
              boxShadow: '0 0 0 0.5px rgba(255,255,255,0.5) inset, 0 0 40px rgba(255,255,255,0.25) inset, 0 20px 60px -15px rgba(0,0,0,0.08), 0 4px 16px rgba(0,0,0,0.03)',
            }}
          >
            {/* Dynamic Hover Glow effect */}
            {mouse.active && (
              <div style={{
                position: 'absolute', top: mouse.y - 180, left: mouse.x - 180,
                width: 360, height: 360,
                background: 'radial-gradient(circle, rgba(180,83,9,0.055) 0%, rgba(15,118,110,0.02) 50%, transparent 70%)',
                pointerEvents: 'none', zIndex: 0, filter: 'blur(24px)',
                transition: 'opacity 300ms',
              }} />
            )}

            {/* Header copy */}
            <div className="relative z-10 text-center mb-8">
              <span className="section-badge mb-3">
                <span className="badge-dot" />
                Secure Portal
              </span>
              <h1 className="login-heading font-semibold text-[#0A0A0A] tracking-tight mb-2.5">
                Welcome to Recall
              </h1>
              <p className="login-subheading text-[#57534E]">
                Connect your workspace to deploy your secure meeting memory layer.
              </p>
            </div>

            {/* Primary Action Button */}
            <div className="relative z-10 mb-6">
              <button
                onClick={handleGoogleSignIn}
                disabled={loading}
                className="btn-google-auth w-full flex items-center justify-center gap-3 rounded-16 px-5 py-4 text-[14.5px] font-semibold text-[#1C1917] relative overflow-hidden"
              >
                {loading ? (
                  <div className="rc-spinner" />
                ) : (
                  <>
                    <GoogleIcon />
                    Continue with Google
                    <ArrowRight size={15} strokeWidth={2.2} className="btn-arrow" />
                  </>
                )}
              </button>
            </div>

            {/* Interactive Scope Disclosures (Proves app legitimacy + sets up expectations) */}
            <div className="relative z-10 scope-card p-4 rounded-16 border border-[rgba(255,255,255,0.4)] background-[rgba(255,255,255,0.2)] mb-6">
              <p className="text-[11px] font-bold uppercase tracking-wider text-[#78716C] mb-3 flex items-center gap-1.5">
                <Shield size={11} color="#0F766E" /> Requested Permissions
              </p>
              <div className="flex flex-col gap-2.5">
                <div className="flex items-start gap-2.5">
                  <div className="scope-icon-wrap amber"><Calendar size={13} /></div>
                  <div>
                    <p className="scope-title">Google Calendar Integration</p>
                    <p className="scope-desc">Surfaces upcoming events to prepare ad-hoc transcripts.</p>
                  </div>
                </div>
                <div className="flex items-start gap-2.5">
                  <div className="scope-icon-wrap teal"><Mic size={13} /></div>
                  <div>
                    <p className="scope-title">Google Meet Association</p>
                    <p className="scope-desc">Attaches session recordings directly to scheduled spaces.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Privacy Guarantee */}
            <div className="relative z-10 text-center flex items-center justify-center gap-2 privacy-guarantee">
              <Lock size={12} color="#78716C" />
              <span className="text-[11.5px] text-[#78716C] font-medium">
                Enterprise security standards. Access is fully explicit.
              </span>
            </div>

          </div>

          {/* Integrated Terms & Legal Frame */}
          <div className="text-center mt-8 relative z-10">
            <p className="text-[12.5px] text-[#78716C] font-normal leading-relaxed">
              By accessing your account, you agree to our<br />
              
              <a href="/terms" style={{ textDecoration: 'none' }}>
                <span className="legal-link cursor-pointer">Terms of Service</span>
              </a>

              <span className="text-[#D6D3D1] mx-2">·</span>
              
              <a href="/privacy" style={{ textDecoration: 'none' }}>
                <span className="legal-link cursor-pointer">Privacy Policy</span>
              </a>

            </p>
          </div>

        </div>
      </div>
    </>
  )
}

/* ═══════════════════════════════════════════════════════════════════════════
   STATIC ASSETS
   ═══════════════════════════════════════════════════════════════════════════ */

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" className="flex-shrink-0 relative z-10">
      <path d="M17.64 9.205c0-.639-.057-1.252-.164-1.841H9v3.481h4.844a4.14 4.14 0 01-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4" />
      <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z" fill="#34A853" />
      <path d="M3.964 10.71A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 000 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05" />
      <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335" />
    </svg>
  )
}

/* ═══════════════════════════════════════════════════════════════════════════
   EMBEDDED STYLES (Synchronized with Landing Page global/class layout)
   ═══════════════════════════════════════════════════════════════════════════ */

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;450;500;550;600;700&display=swap');

body {
  margin: 0;
  background: #FAF9F7;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  overflow-x: hidden;
  -webkit-font-smoothing: antialiased;
}

.login-bg-layer {
  position: fixed;
  inset: 0;
  z-index: -2;
  background: 
    linear-gradient(180deg, #FAF9F7 0%, #F6F5F3 40%, #F3F2EF 70%, #FAF9F7 100%);
  pointer-events: none;
}

/* Float Animations matching Landing Page */
@keyframes rc-float-1 {
  0%, 100% { transform: translate(0,0) scale(1); }
  33% { transform: translate(25px,-15px) scale(1.04); }
  66% { transform: translate(-10px,10px) scale(0.96); }
}
@keyframes rc-float-2 {
  0%, 100% { transform: translate(0,0) scale(1); }
  33% { transform: translate(-20px,20px) scale(1.05); }
  66% { transform: translate(15px,-10px) scale(0.95); }
}
@keyframes rc-float-3 {
  0%, 100% { transform: translate(0,0) scale(1); }
  33% { transform: translate(15px,12px) scale(0.98); }
  66% { transform: translate(-20px,-15px) scale(1.02); }
}

.rc-orb-1 { animation: rc-float-1 20s ease-in-out infinite; }
.rc-orb-2 { animation: rc-float-2 25s ease-in-out infinite; }
.rc-orb-3 { animation: rc-float-3 22s ease-in-out infinite; }

/* Interactive Loading Spinner */
@keyframes rc-spin {
  from { transform: rotate(0); }
  to { transform: rotate(360deg); }
}
.rc-spinner {
  width: 18px;
  height: 18px;
  border-radius: 50%;
  border: 2px solid rgba(180,83,9,0.15);
  border-top-color: #B45309;
  animation: rc-spin 0.7s linear infinite;
}

/* Glass Badge */
.section-badge {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  font-size: 11px;
  color: #78716C;
  font-weight: 550;
  text-transform: uppercase;
  letter-spacing: 1.2px;
  padding: 6px 14px;
  background: rgba(255,255,255,0.5);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255,255,255,0.65);
  border-radius: 100px;
  box-shadow: 0 1px 4px rgba(0,0,0,0.03);
}

.badge-dot {
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: #B45309;
  box-shadow: 0 0 6px rgba(180, 83, 9, 0.4);
}

/* Typography elements */
.login-heading {
  font-size: 26px;
  letter-spacing: -0.8px;
  line-height: 1.15;
}

.login-subheading {
  font-size: 14px;
  line-height: 1.5;
  font-weight: 400;
  max-width: 320px;
  margin: 0 auto;
}

/* Primary Action Button - Custom Premium styling */
.btn-google-auth {
  background: rgba(255, 255, 255, 0.6);
  backdrop-filter: blur(8px);
  border: 1px solid rgba(10, 10, 10, 0.08);
  border-radius: 14px;
  box-shadow: 
    0 1px 2px rgba(0,0,0,0.03),
    0 4px 12px rgba(0,0,0,0.02),
    0 0 0 1px rgba(255, 255, 255, 0.6) inset;
  cursor: pointer;
  transition: all 250ms cubic-bezier(0.16, 1, 0.3, 1);
}

.btn-google-auth:hover {
  background: #FFFFFF;
  border-color: rgba(10, 10, 10, 0.18);
  transform: translateY(-2px);
  box-shadow: 
    0 10px 24px -6px rgba(0,0,0,0.06),
    0 4px 12px rgba(0,0,0,0.03),
    0 0 0 1px rgba(255, 255, 255, 0.9) inset;
}

.btn-google-auth:hover .btn-arrow {
  transform: translateX(4px);
}

.btn-arrow {
  transition: transform 200ms ease;
  color: #78716C;
}

.btn-google-auth:active {
  transform: translateY(0);
  background: rgba(255, 255, 255, 0.4);
}

/* Credentials visual board */
.scope-card {
  background: rgba(255, 255, 255, 0.3);
  backdrop-filter: blur(4px);
}

.scope-icon-wrap {
  width: 24px;
  height: 24px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  margin-top: 2px;
}

.scope-icon-wrap.amber {
  background: rgba(180, 83, 9, 0.08);
  border: 1px solid rgba(180, 83, 9, 0.15);
  color: #B45309;
}

.scope-icon-wrap.teal {
  background: rgba(15, 118, 110, 0.08);
  border: 1px solid rgba(15, 118, 110, 0.15);
  color: #0F766E;
}

.scope-title {
  font-size: 12.5px;
  font-weight: 600;
  color: #1C1917;
  margin: 0 0 2px 0;
}

.scope-desc {
  font-size: 11.5px;
  color: #78716C;
  line-height: 1.4;
  margin: 0;
}

/* Footer elements */
.legal-link {
  color: #292524;
  font-weight: 500;
  text-decoration: none;
  transition: color 200ms ease;
  border-bottom: 1px solid rgba(10, 10, 10, 0.1);
  padding-bottom: 1px;
}

.legal-link:hover {
  color: #B45309;
  border-color: rgba(180, 83, 9, 0.4);
}

.privacy-guarantee {
  animation: rc-fadein 800ms cubic-bezier(0.16, 1, 0.3, 1);
}

@keyframes rc-fadein {
  from { opacity: 0; transform: translateY(6px); }
  to { opacity: 1; transform: none; }
}

/* Utilities */
.rounded-16 { border-radius: 16px !important; }
`