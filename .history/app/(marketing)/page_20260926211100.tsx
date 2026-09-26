'use client'

import { useEffect, useRef, useState, useCallback, useMemo } from 'react'
import Link from 'next/link'
import {
  Mic, FileText, Sparkles, CheckSquare, GitBranch, Hash, Search,
  MessageSquareText, Calendar, Clock, Lock, Share2, ArrowRight,
  Plus, Minus, Menu, X, Circle, Command, Zap, Eye, Brain,
  Layers, Shield, Users, ChevronRight, Play, Pause
} from 'lucide-react'

/* ═══════════════════════════════════════════════════════════════════════════
   HOOKS
   ═══════════════════════════════════════════════════════════════════════════ */

function useReveal<T extends HTMLElement = HTMLDivElement>(threshold = 0.1) {
  const ref = useRef<T>(null)
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect() } },
      { threshold, rootMargin: '0px 0px -60px 0px' }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [threshold])
  return { ref, visible }
}

function useScrollProgress() {
  const [progress, setProgress] = useState(0)
  useEffect(() => {
    const h = () => {
      const d = document.documentElement
      const scrolled = d.scrollTop / (d.scrollHeight - d.clientHeight)
      setProgress(Math.min(1, Math.max(0, scrolled)))
    }
    window.addEventListener('scroll', h, { passive: true })
    h()
    return () => window.removeEventListener('scroll', h)
  }, [])
  return progress
}

function useMouseGlow(containerRef: React.RefObject<HTMLElement | null>) {
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
    return () => { el.removeEventListener('mousemove', move); el.removeEventListener('mouseleave', leave) }
  }, [containerRef])
  return pos
}

function Reveal({ children, delay = 0, className = '', as: As = 'div' }: {
  children: React.ReactNode; delay?: number; className?: string; as?: React.ElementType
}) {
  const { ref, visible } = useReveal<HTMLDivElement>()
  return (
    <As ref={ref} className={className} style={{
      opacity: visible ? 1 : 0,
      transform: visible ? 'translateY(0)' : 'translateY(20px)',
      transition: `opacity 700ms cubic-bezier(0.16,1,0.3,1) ${delay}ms, transform 700ms cubic-bezier(0.16,1,0.3,1) ${delay}ms`,
    }}>{children}</As>
  )
}

/* ═══════════════════════════════════════════════════════════════════════════
   BACKGROUND GRADIENT SYSTEM
   ═══════════════════════════════════════════════════════════════════════════ */

function ScrollGradientBackground() {
  const progress = useScrollProgress()

  const bg1 = useMemo(() => {
    const hue1 = 30 + progress * 20
    const hue2 = 210 + progress * 40
    const hue3 = 280 + progress * 30
    return {
      c1: `hsla(${hue1}, 60%, 92%, ${0.6 + progress * 0.2})`,
      c2: `hsla(${hue2}, 40%, 90%, ${0.3 + progress * 0.3})`,
      c3: `hsla(${hue3}, 35%, 92%, ${0.2 + progress * 0.4})`,
    }
  }, [progress])

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: -1, pointerEvents: 'none' }}>
      <div style={{
        position: 'absolute', inset: 0,
        background: `
          radial-gradient(ellipse 80% 50% at ${20 + progress * 60}% ${10 + progress * 30}%, ${bg1.c1}, transparent 70%),
          radial-gradient(ellipse 60% 40% at ${80 - progress * 50}% ${60 + progress * 20}%, ${bg1.c2}, transparent 70%),
          radial-gradient(ellipse 70% 50% at ${50 + Math.sin(progress * Math.PI * 2) * 20}% ${80 - progress * 40}%, ${bg1.c3}, transparent 70%),
          linear-gradient(180deg, #FAFAF9 0%, #F5F5F0 50%, #FAFAF9 100%)
        `,
        transition: 'all 100ms linear',
      }} />

      <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.015 }}>
        <defs>
          <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
            <path d="M 60 0 L 0 0 0 60" fill="none" stroke="#0A0A0A" strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
      </svg>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════════════════
   GLASSMORPHIC CARD COMPONENT
   ═══════════════════════════════════════════════════════════════════════════ */

function GlassCard({ children, className = '', style = {}, glow = false, glowColor = 'rgba(180,83,9,0.08)', ...rest }: {
  children: React.ReactNode; className?: string; style?: React.CSSProperties;
  glow?: boolean; glowColor?: string;
  [key: string]: unknown;
}) {
  const containerRef = useRef<HTMLDivElement>(null)
  const mouse = useMouseGlow(containerRef)

  return (
    <div ref={containerRef} className={`rc-glass ${className}`} style={{
      position: 'relative',
      background: 'rgba(255,255,255,0.45)',
      backdropFilter: 'blur(24px) saturate(180%)',
      WebkitBackdropFilter: 'blur(24px) saturate(180%)',
      border: '1px solid rgba(255,255,255,0.6)',
      borderRadius: 20,
      boxShadow: `
        0 0 0 0.5px rgba(255,255,255,0.4) inset,
        0 8px 32px -8px rgba(0,0,0,0.08),
        0 2px 8px rgba(0,0,0,0.04)
      `,
      overflow: 'hidden',
      ...style,
    }} {...rest}>
      {glow && mouse.active && (
        <div style={{
          position: 'absolute',
          top: mouse.y - 150,
          left: mouse.x - 150,
          width: 300, height: 300,
          background: `radial-gradient(circle, ${glowColor}, transparent 70%)`,
          pointerEvents: 'none',
          zIndex: 0,
          transition: 'opacity 200ms',
          opacity: mouse.active ? 1 : 0,
        }} />
      )}
      <div style={{ position: 'relative', zIndex: 1 }}>
        {children}
      </div>
    </div>
  )
}

function LiquidGlassCard({ children, className = '', style = {} }: {
  children: React.ReactNode; className?: string; style?: React.CSSProperties;
}) {
  const containerRef = useRef<HTMLDivElement>(null)
  const mouse = useMouseGlow(containerRef)

  return (
    <div ref={containerRef} className={`rc-liquid-glass ${className}`} style={{
      position: 'relative',
      background: `
        linear-gradient(135deg,
          rgba(255,255,255,0.7) 0%,
          rgba(255,255,255,0.35) 40%,
          rgba(255,255,255,0.5) 60%,
          rgba(255,255,255,0.7) 100%
        )
      `,
      backdropFilter: 'blur(40px) saturate(200%)',
      WebkitBackdropFilter: 'blur(40px) saturate(200%)',
      border: '1px solid rgba(255,255,255,0.7)',
      borderRadius: 24,
      boxShadow: `
        0 0 0 0.5px rgba(255,255,255,0.5) inset,
        0 0 40px rgba(255,255,255,0.3) inset,
        0 20px 60px -15px rgba(0,0,0,0.1),
        0 4px 16px rgba(0,0,0,0.04)
      `,
      overflow: 'hidden',
      ...style,
    }}>
      {mouse.active && (
        <div style={{
          position: 'absolute',
          top: mouse.y - 200,
          left: mouse.x - 200,
          width: 400, height: 400,
          background: `radial-gradient(circle,
            rgba(255,255,255,0.5) 0%,
            rgba(255,255,255,0.2) 30%,
            transparent 60%
          )`,
          pointerEvents: 'none', zIndex: 0,
          filter: 'blur(20px)',
        }} />
      )}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0,
        background: `
          linear-gradient(135deg, rgba(255,255,255,0.3) 0%, transparent 50%),
          linear-gradient(315deg, rgba(255,255,255,0.15) 0%, transparent 50%)
        `,
      }} />
      <div style={{ position: 'relative', zIndex: 1 }}>
        {children}
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════════════════
   ANIMATED DECORATIVE ELEMENTS
   ═══════════════════════════════════════════════════════════════════════════ */

function FloatingOrbs() {
  return (
    <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden' }} aria-hidden>
      <div className="rc-orb rc-orb-1" style={{
        position: 'absolute', top: '10%', left: '5%',
        width: 200, height: 200, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(180,83,9,0.12), rgba(180,83,9,0.03) 60%, transparent 80%)',
        filter: 'blur(40px)',
      }} />
      <div className="rc-orb rc-orb-2" style={{
        position: 'absolute', top: '40%', right: '8%',
        width: 280, height: 280, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(15,118,110,0.1), rgba(15,118,110,0.02) 60%, transparent 80%)',
        filter: 'blur(50px)',
      }} />
      <div className="rc-orb rc-orb-3" style={{
        position: 'absolute', bottom: '15%', left: '20%',
        width: 240, height: 240, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(124,58,237,0.08), rgba(124,58,237,0.02) 60%, transparent 80%)',
        filter: 'blur(45px)',
      }} />
    </div>
  )
}

function DoodleLine({ d, color = '#0A0A0A', opacity = 0.06, delay = 0 }: {
  d: string; color?: string; opacity?: number; delay?: number
}) {
  const { ref, visible } = useReveal<HTMLDivElement>(0.05)
  return (
    <svg ref={ref} viewBox="0 0 200 200" fill="none" style={{
      position: 'absolute', width: '100%', height: '100%', pointerEvents: 'none',
    }} aria-hidden>
      <path
        d={d}
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeDasharray="600"
        strokeDashoffset={visible ? '0' : '600'}
        opacity={opacity}
        style={{
          transition: `stroke-dashoffset 2s cubic-bezier(0.16,1,0.3,1) ${delay}ms`,
        }}
      />
    </svg>
  )
}

function ParticleField() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let raf: number
    let particles: Array<{ x: number; y: number; vx: number; vy: number; size: number; opacity: number; life: number }> = []

    const resize = () => {
      canvas.width = canvas.offsetWidth * 2
      canvas.height = canvas.offsetHeight * 2
      ctx.scale(2, 2)
    }
    resize()
    window.addEventListener('resize', resize)

    for (let i = 0; i < 40; i++) {
      particles.push({
        x: Math.random() * canvas.offsetWidth,
        y: Math.random() * canvas.offsetHeight,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        size: Math.random() * 2 + 0.5,
        opacity: Math.random() * 0.15 + 0.03,
        life: Math.random() * 1000,
      })
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.offsetWidth, canvas.offsetHeight)
      const w = canvas.offsetWidth
      const h = canvas.offsetHeight

      particles.forEach(p => {
        p.x += p.vx
        p.y += p.vy
        p.life += 0.01

        if (p.x < 0) p.x = w
        if (p.x > w) p.x = 0
        if (p.y < 0) p.y = h
        if (p.y > h) p.y = 0

        const flicker = Math.sin(p.life) * 0.5 + 0.5
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(120, 113, 108, ${p.opacity * flicker})`
        ctx.fill()
      })

      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x
          const dy = particles[i].y - particles[j].y
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < 120) {
            ctx.beginPath()
            ctx.moveTo(particles[i].x, particles[i].y)
            ctx.lineTo(particles[j].x, particles[j].y)
            ctx.strokeStyle = `rgba(120, 113, 108, ${0.04 * (1 - dist / 120)})`
            ctx.lineWidth = 0.5
            ctx.stroke()
          }
        }
      }

      raf = requestAnimationFrame(animate)
    }
    animate()

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      style={{
        position: 'absolute', inset: 0, width: '100%', height: '100%',
        pointerEvents: 'none', opacity: 0.6,
      }}
    />
  )
}

/* ═══════════════════════════════════════════════════════════════════════════
   ANIMATED COUNTER
   ═══════════════════════════════════════════════════════════════════════════ */

function AnimatedNumber({ value, duration = 2000 }: { value: number; duration?: number }) {
  const [display, setDisplay] = useState(0)
  const { ref, visible } = useReveal()

  useEffect(() => {
    if (!visible) return
    let start = 0
    const startTime = performance.now()
    const step = (time: number) => {
      const elapsed = time - startTime
      const p = Math.min(1, elapsed / duration)
      const eased = 1 - Math.pow(1 - p, 4)
      setDisplay(Math.floor(eased * value))
      if (p < 1) requestAnimationFrame(step)
    }
    requestAnimationFrame(step)
  }, [visible, value, duration])

  return <span ref={ref}>{display}</span>
}

/* ═══════════════════════════════════════════════════════════════════════════
   DATA
   ═══════════════════════════════════════════════════════════════════════════ */

const MEETING = {
  title: 'Q4 Roadmap Review',
  date: 'Nov 12, 2025',
  duration: '42 min',
  participants: [
    { name: 'Sarah Chen', initials: 'SC', color: '#B45309' },
    { name: 'Daniel Ortiz', initials: 'DO', color: '#0F766E' },
    { name: 'Priya Menon', initials: 'PM', color: '#7C3AED' },
    { name: 'James Ward', initials: 'JW', color: '#BE185D' },
  ],
  transcript: [
    { speaker: 'Sarah Chen', time: '00:42', text: "Let's start with the onboarding flow. We're seeing a 34% drop-off at the workspace creation step." },
    { speaker: 'Daniel Ortiz', time: '01:15', text: "I looked at the funnel yesterday. The main issue is we're asking for too much information upfront. We should defer the team invite step until after the first meeting is captured." },
    { speaker: 'Priya Menon', time: '02:03', text: "Agreed. I can have a redesigned flow ready by Friday. Should we A/B test it or ship to everyone?" },
    { speaker: 'Sarah Chen', time: '02:28', text: "Ship to everyone. Our sample size is too small for meaningful A/B tests right now." },
    { speaker: 'James Ward', time: '03:11', text: "On the API side, we need to review the rate limiting before we open up the public endpoints. I'll put together a proposal by Monday." },
    { speaker: 'Daniel Ortiz', time: '03:58', text: "Good call. We should also document the webhook payloads before we go live. I'll add it to the sprint." },
  ],
  summary: "The team reviewed Q4 priorities with a focus on onboarding conversion and API readiness. A 34% drop-off at workspace creation is the highest-priority fix, and the team agreed to ship a redesigned flow directly rather than run an A/B test. API rate limiting was flagged as a blocker for the public endpoint launch.",
  decisions: [
    'Ship redesigned onboarding to all users; skip A/B test given sample size.',
    'Defer team invite step until after first meeting is captured.',
    'Public API launch blocked until rate limiting proposal is approved.',
  ],
  actions: [
    { text: 'Redesign onboarding flow with deferred invite step', owner: 'Priya Menon', due: 'Fri, Nov 15', done: false },
    { text: 'Draft API rate limiting proposal', owner: 'James Ward', due: 'Mon, Nov 18', done: false },
    { text: 'Review onboarding funnel metrics weekly', owner: 'Daniel Ortiz', due: 'Ongoing', done: false },
    { text: 'Document webhook payloads before go-live', owner: 'Daniel Ortiz', due: 'Wed, Nov 20', done: false },
  ],
  topics: ['Onboarding', 'Conversion', 'API Design', 'Rate Limiting', 'Q4 Priorities', 'Webhooks'],
}

/* ═══════════════════════════════════════════════════════════════════════════
   LOGO
   ═══════════════════════════════════════════════════════════════════════════ */

function Logo({ size = 22, dark = false }: { size?: number; dark?: boolean }) {
  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
      <div style={{
        width: size + 6, height: size + 6, borderRadius: 8,
        background: dark ? 'rgba(255,255,255,0.1)' : 'rgba(10,10,10,0.04)',
        backdropFilter: 'blur(8px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        border: `1px solid ${dark ? 'rgba(255,255,255,0.15)' : 'rgba(10,10,10,0.08)'}`,
      }}>
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden>
          <circle cx="12" cy="12" r="7" stroke={dark ? '#FAFAF9' : '#0A0A0A'} strokeWidth="1.5" />
          <circle cx="12" cy="12" r="2.5" fill={dark ? '#FAFAF9' : '#0A0A0A'} />
          <circle cx="12" cy="12" r="11" stroke={dark ? '#FAFAF9' : '#0A0A0A'} strokeWidth="0.5" opacity="0.3" strokeDasharray="3 3" />
        </svg>
      </div>
      <span style={{
        fontSize: 17, fontWeight: 600,
        color: dark ? '#FAFAF9' : '#0A0A0A',
        letterSpacing: '-0.4px',
      }}>Recall</span>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════════════════
   NAVIGATION
   ═══════════════════════════════════════════════════════════════════════════ */

function Nav() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 8)
    h()
    window.addEventListener('scroll', h, { passive: true })
    return () => window.removeEventListener('scroll', h)
  }, [])

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  const links = [
    { href: '#product', label: 'Product' },
    { href: '#how', label: 'How it works' },
    { href: '#features', label: 'Features' },
    { href: '#pricing', label: 'Pricing' },
    { href: '#faq', label: 'Resources' },
  ]

  return (
    <>
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        padding: scrolled ? '0 clamp(16px, 3vw, 24px)' : '8px clamp(16px, 3vw, 24px)',
        transition: 'all 400ms cubic-bezier(0.16,1,0.3,1)',
      }}>
        <div style={{
          maxWidth: 1280, margin: '0 auto',
          background: scrolled
            ? 'rgba(255,255,255,0.55)'
            : 'rgba(255,255,255,0.3)',
          backdropFilter: 'blur(24px) saturate(200%)',
          WebkitBackdropFilter: 'blur(24px) saturate(200%)',
          border: `1px solid ${scrolled ? 'rgba(255,255,255,0.7)' : 'rgba(255,255,255,0.4)'}`,
          borderRadius: scrolled ? 14 : 18,
          boxShadow: scrolled
            ? '0 4px 24px rgba(0,0,0,0.06), 0 1px 4px rgba(0,0,0,0.03), 0 0 0 0.5px rgba(255,255,255,0.5) inset'
            : '0 2px 12px rgba(0,0,0,0.03)',
          padding: `0 clamp(16px, 3vw, 24px)`,
          height: scrolled ? 54 : 60,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          transition: 'all 400ms cubic-bezier(0.16,1,0.3,1)',
        }}>
          <Link href="/" style={{ textDecoration: 'none' }} aria-label="Recall home">
            <Logo />
          </Link>

          <div className="rc-nav-links" style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            {links.map(l => (
              <a key={l.href} href={l.href} className="rc-nav-link" style={{
                fontSize: 13, fontWeight: 450, color: '#404040', textDecoration: 'none',
                padding: '7px 12px', borderRadius: 8, letterSpacing: '-0.1px',
                transition: 'all 200ms',
              }}>{l.label}</a>
            ))}
          </div>

          <div className="rc-nav-cta" style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <Link href="/login" className="rc-nav-link" style={{
              fontSize: 13, fontWeight: 450, color: '#404040', textDecoration: 'none',
              padding: '7px 14px', borderRadius: 8, letterSpacing: '-0.1px',
            }}>Sign in</Link>
            <Link href="/login" className="rc-cta-btn" style={{
              fontSize: 13, fontWeight: 500, color: '#FAFAF9', textDecoration: 'none',
              padding: '8px 16px',
              background: 'linear-gradient(135deg, #0A0A0A 0%, #262626 100%)',
              borderRadius: 10,
              letterSpacing: '-0.1px', display: 'inline-flex', alignItems: 'center', gap: 5,
              boxShadow: '0 2px 8px rgba(0,0,0,0.15), 0 0 0 0.5px rgba(255,255,255,0.1) inset',
              transition: 'transform 200ms, box-shadow 200ms',
            }}>Get started <ArrowRight size={12} strokeWidth={2.5} /></Link>
          </div>

          <button
            className="rc-menu-btn"
            onClick={() => setMenuOpen(v => !v)}
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
            style={{
              display: 'none', background: 'transparent', border: 'none',
              padding: 8, cursor: 'pointer', color: '#0A0A0A',
            }}
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </nav>

      {menuOpen && (
        <div className="rc-mobile-menu" style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 99,
          background: 'rgba(255,255,255,0.9)',
          backdropFilter: 'blur(40px) saturate(200%)',
          WebkitBackdropFilter: 'blur(40px) saturate(200%)',
          padding: '90px 24px 24px', display: 'none', flexDirection: 'column', gap: 4,
          animation: 'rc-fadein 300ms cubic-bezier(0.16,1,0.3,1)',
        }}>
          {links.map(l => (
            <a key={l.href} href={l.href} onClick={() => setMenuOpen(false)} style={{
              fontSize: 22, fontWeight: 500, color: '#0A0A0A', textDecoration: 'none',
              padding: '16px 4px', borderBottom: '1px solid rgba(10,10,10,0.06)', letterSpacing: '-0.4px',
            }}>{l.label}</a>
          ))}
          <div style={{ marginTop: 24, display: 'flex', flexDirection: 'column', gap: 10 }}>
            <Link href="/login" onClick={() => setMenuOpen(false)} style={{
              fontSize: 15, fontWeight: 500, color: '#0A0A0A', textDecoration: 'none',
              padding: '14px 18px', border: '1px solid rgba(10,10,10,0.1)', borderRadius: 12, textAlign: 'center',
            }}>Sign in</Link>
            <Link href="/login" onClick={() => setMenuOpen(false)} style={{
              fontSize: 15, fontWeight: 500, color: '#FAFAF9', textDecoration: 'none',
              padding: '14px 18px', background: '#0A0A0A', borderRadius: 12, textAlign: 'center',
            }}>Get started</Link>
          </div>
        </div>
      )}
    </>
  )
}

/* ═══════════════════════════════════════════════════════════════════════════
   HERO PRODUCT VISUAL
   ═══════════════════════════════════════════════════════════════════════════ */

function HeroVisual() {
  const containerRef = useRef<HTMLDivElement>(null)
  const mouse = useMouseGlow(containerRef)

  return (
    <div ref={containerRef} style={{ position: 'relative', maxWidth: 1100, margin: '0 auto' }}>
      <div style={{
        position: 'absolute', inset: '-60px -40px', pointerEvents: 'none',
        background: `
          radial-gradient(50% 40% at 30% 50%, rgba(180,83,9,0.1), transparent 70%),
          radial-gradient(40% 50% at 70% 50%, rgba(15,118,110,0.08), transparent 70%)
        `,
        filter: 'blur(40px)',
      }} />

      <LiquidGlassCard style={{ position: 'relative' }}>
        {mouse.active && (
          <div style={{
            position: 'absolute',
            top: mouse.y - 200, left: mouse.x - 200,
            width: 400, height: 400,
            background: 'radial-gradient(circle, rgba(180,83,9,0.06), transparent 60%)',
            pointerEvents: 'none', zIndex: 0, filter: 'blur(30px)',
          }} />
        )}

        <div style={{
          display: 'flex', alignItems: 'center', gap: 8,
          padding: '11px 16px',
          background: 'rgba(255,255,255,0.4)',
          backdropFilter: 'blur(12px)',
          borderBottom: '1px solid rgba(255,255,255,0.5)',
        }}>
          <div style={{ display: 'flex', gap: 6 }}>
            <span style={{ width: 10, height: 10, borderRadius: '50%', background: 'rgba(10,10,10,0.1)' }} />
            <span style={{ width: 10, height: 10, borderRadius: '50%', background: 'rgba(10,10,10,0.1)' }} />
            <span style={{ width: 10, height: 10, borderRadius: '50%', background: 'rgba(10,10,10,0.1)' }} />
          </div>
          <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '4px 14px',
              background: 'rgba(255,255,255,0.6)',
              backdropFilter: 'blur(8px)',
              border: '1px solid rgba(255,255,255,0.7)',
              borderRadius: 8,
              fontSize: 11.5, color: '#57534E', fontWeight: 450, letterSpacing: '-0.1px',
            }}>
              <div className="rc-recording-dot" style={{
                width: 6, height: 6, borderRadius: '50%', background: '#B45309',
              }} />
              {MEETING.title} · {MEETING.duration}
            </div>
          </div>
          <div style={{ width: 48 }} />
        </div>

        <div className="rc-hero-body" style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', minHeight: 480 }}>
          <div style={{
            padding: '24px 28px',
            borderRight: '1px solid rgba(255,255,255,0.4)',
            position: 'relative', overflow: 'hidden',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: 6,
                fontSize: 10.5, fontWeight: 600, color: '#78716C',
                textTransform: 'uppercase', letterSpacing: '0.8px',
                padding: '4px 10px', background: 'rgba(255,255,255,0.5)',
                borderRadius: 100, border: '1px solid rgba(255,255,255,0.6)',
              }}>
                <FileText size={10} strokeWidth={2.5} />
                Transcript
              </div>
              <div style={{ display: 'flex', gap: -6 }}>
                {MEETING.participants.map((p, i) => (
                  <div key={p.name} style={{
                    width: 24, height: 24, borderRadius: '50%',
                    background: p.color, color: 'white',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 9, fontWeight: 600, marginLeft: i === 0 ? 0 : -6,
                    border: '2px solid rgba(255,255,255,0.8)',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                  }}>{p.initials}</div>
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
              {MEETING.transcript.slice(0, 5).map((seg, i) => {
                const p = MEETING.participants.find(x => x.name === seg.speaker)!
                return (
                  <div key={i} className="rc-transcript-line" style={{
                    display: 'flex', gap: 12,
                    padding: '12px 14px',
                    borderRadius: 12,
                    transition: 'background 200ms',
                  }}>
                    <div style={{
                      flexShrink: 0, width: 28, height: 28, borderRadius: '50%',
                      background: `${p.color}18`, color: p.color,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 9, fontWeight: 700,
                      border: `1.5px solid ${p.color}30`,
                    }}>{p.initials}</div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', gap: 8, alignItems: 'baseline', marginBottom: 3 }}>
                        <span style={{ fontSize: 12.5, fontWeight: 550, color: '#0A0A0A', letterSpacing: '-0.1px' }}>{seg.speaker}</span>
                        <span style={{ fontSize: 10.5, color: '#A8A29E', fontVariantNumeric: 'tabular-nums' }}>{seg.time}</span>
                      </div>
                      <p style={{ fontSize: 13, color: '#404040', lineHeight: 1.6, margin: 0, letterSpacing: '-0.05px' }}>{seg.text}</p>
                    </div>
                  </div>
                )
              })}
            </div>
            <div style={{
              position: 'absolute', bottom: 0, left: 0, right: 0, height: 100,
              background: 'linear-gradient(transparent, rgba(255,255,255,0.8))',
              backdropFilter: 'blur(4px)',
              pointerEvents: 'none',
            }} />
          </div>

          <div style={{
            padding: '24px 28px',
            background: 'rgba(255,255,255,0.25)',
            display: 'flex', flexDirection: 'column', gap: 22,
            overflow: 'hidden', position: 'relative',
          }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 12 }}>
                <div style={{
                  width: 20, height: 20, borderRadius: 6,
                  background: 'linear-gradient(135deg, #B45309, #D97706)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  boxShadow: '0 2px 6px rgba(180,83,9,0.25)',
                }}>
                  <Sparkles size={10} color="white" strokeWidth={2.5} />
                </div>
                <span style={{ fontSize: 11, fontWeight: 600, color: '#78716C', textTransform: 'uppercase', letterSpacing: '0.7px' }}>AI Summary</span>
              </div>
              <p style={{ fontSize: 13, color: '#292524', lineHeight: 1.65, margin: 0, letterSpacing: '-0.05px' }}>{MEETING.summary}</p>
            </div>

            <div style={{ height: 1, background: 'rgba(10,10,10,0.06)' }} />

            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10 }}>
                <GitBranch size={12} strokeWidth={2.2} color="#0F766E" />
                <span style={{ fontSize: 10.5, fontWeight: 600, color: '#78716C', textTransform: 'uppercase', letterSpacing: '0.7px' }}>Decisions</span>
              </div>
              {MEETING.decisions.slice(0, 2).map((d, i) => (
                <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
                  <div style={{
                    width: 5, height: 5, borderRadius: '50%', background: '#0F766E',
                    flexShrink: 0, marginTop: 7,
                  }} />
                  <p style={{ fontSize: 12.5, color: '#292524', margin: 0, lineHeight: 1.55 }}>{d}</p>
                </div>
              ))}
            </div>

            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10 }}>
                <CheckSquare size={12} strokeWidth={2.2} color= '#0A0A0A' />
                <span style={{ fontSize: 10.5, fontWeight: 600, color: '#78716C', textTransform: 'uppercase', letterSpacing: '0.7px' }}>Action Items</span>
              </div>
              {MEETING.actions.slice(0, 2).map((a, i) => (
                <div key={i} style={{ display: 'flex', gap: 10, marginBottom: 10 }}>
                  <div style={{
                    width: 14, height: 14, borderRadius: 4,
                    border: '1.5px solid #A8A29E', flexShrink: 0, marginTop: 2,
                  }} />
                  <div style={{ minWidth: 0 }}>
                    <p style={{ fontSize: 12.5, color: '#0A0A0A', margin: 0, fontWeight: 500, letterSpacing: '-0.05px', lineHeight: 1.4 }}>{a.text}</p>
                    <p style={{ fontSize: 11, color: '#78716C', margin: '3px 0 0' }}>{a.owner} · {a.due}</p>
                  </div>
                </div>
              ))}
            </div>

            <div style={{
              position: 'absolute', bottom: 0, left: 0, right: 0, height: 60,
              background: 'linear-gradient(transparent, rgba(255,255,255,0.5))',
              pointerEvents: 'none',
            }} />
          </div>
        </div>
      </LiquidGlassCard>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════════════════
   HERO SECTION
   ═══════════════════════════════════════════════════════════════════════════ */

function Hero() {
  const [mounted, setMounted] = useState(false)
  useEffect(() => { const t = setTimeout(() => setMounted(true), 60); return () => clearTimeout(t) }, [])

  const f = (d: number) => ({
    opacity: mounted ? 1 : 0,
    transform: mounted ? 'translateY(0)' : 'translateY(18px)',
    transition: `opacity 900ms cubic-bezier(0.16,1,0.3,1) ${d}ms, transform 900ms cubic-bezier(0.16,1,0.3,1) ${d}ms`,
  })

  return (
    <section style={{
      paddingTop: 'clamp(120px, 16vw, 180px)',
      paddingBottom: 'clamp(60px, 8vw, 100px)',
      position: 'relative', overflow: 'hidden',
    }}>
      <FloatingOrbs />
      <ParticleField />

      <div style={{
        position: 'absolute', top: '-10%', right: '-5%', width: 600, height: 600,
        background: 'radial-gradient(circle, rgba(180,83,9,0.06), transparent 60%)',
        filter: 'blur(80px)', pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute', bottom: '-20%', left: '-10%', width: 500, height: 500,
        background: 'radial-gradient(circle, rgba(15,118,110,0.06), transparent 60%)',
        filter: 'blur(60px)', pointerEvents: 'none',
      }} />

      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 clamp(20px, 4vw, 32px)', position: 'relative' }}>
        <div style={{ maxWidth: 860, margin: '0 auto', textAlign: 'center' }}>
          <div style={{
            ...f(0),
            display: 'inline-flex', alignItems: 'center', gap: 8,
            padding: '6px 14px 6px 8px',
            background: 'rgba(255,255,255,0.5)',
            backdropFilter: 'blur(12px)',
            border: '1px solid rgba(255,255,255,0.7)',
            borderRadius: 100, marginBottom: 32,
            boxShadow: '0 2px 8px rgba(0,0,0,0.04), 0 0 0 0.5px rgba(255,255,255,0.4) inset',
          }}>
            <span style={{
              fontSize: 10, fontWeight: 600, color: '#B45309',
              background: 'rgba(180,83,9,0.1)', padding: '3px 8px', borderRadius: 100,
              textTransform: 'uppercase', letterSpacing: '0.5px',
            }}>New</span>
            <span style={{ fontSize: 12.5, color: '#404040', fontWeight: 450, letterSpacing: '-0.1px' }}>
              Ask Recall — query your meeting history in natural language
            </span>
            <ArrowRight size={12} color="#78716C" strokeWidth={2} />
          </div>

          <h1 style={{
            ...f(100),
            fontSize: 'clamp(40px, 6.5vw, 82px)', fontWeight: 600,
            letterSpacing: '-2.8px', lineHeight: 1.0, color: '#0A0A0A',
            margin: '0 0 28px',
          }}>
            Your meetings shouldn't<br />
            <span className="rc-hero-gradient" style={{
              background: 'linear-gradient(135deg, #B45309 0%, #0F766E 50%, #7C3AED 100%)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              backgroundSize: '200% 200%',
            }}>disappear</span> when the<br />call ends
          </h1>

          <p style={{
            ...f(200),
            fontSize: 'clamp(16px, 1.9vw, 20px)', lineHeight: 1.55, color: '#57534E',
            fontWeight: 400, letterSpacing: '-0.2px',
            maxWidth: 640, margin: '0 auto 44px',
          }}>
            Recall turns meetings into searchable intelligence — capturing conversations, decisions, action items and everything your team needs to remember.
          </p>

          <div style={{ ...f(300), display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 28 }}>
            <Link href="/login" className="rc-cta-btn rc-cta-btn-large" style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '15px 28px',
              background: 'linear-gradient(135deg, #0A0A0A 0%, #262626 100%)',
              color: '#FAFAF9',
              borderRadius: 14, fontSize: 15.5, fontWeight: 550, textDecoration: 'none',
              letterSpacing: '-0.15px',
              boxShadow: '0 4px 16px rgba(0,0,0,0.2), 0 0 0 0.5px rgba(255,255,255,0.1) inset, 0 1px 0 rgba(255,255,255,0.08) inset',
              transition: 'transform 200ms, box-shadow 200ms',
            }}>
              Start using Recall <ArrowRight size={16} strokeWidth={2.2} />
            </Link>
            <a href="#how" className="rc-ghost-btn-large" style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '15px 24px',
              background: 'rgba(255,255,255,0.5)',
              backdropFilter: 'blur(12px)',
              color: '#0A0A0A',
              border: '1px solid rgba(255,255,255,0.7)',
              borderRadius: 14,
              fontSize: 15.5, fontWeight: 500, textDecoration: 'none', letterSpacing: '-0.15px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.04), 0 0 0 0.5px rgba(255,255,255,0.4) inset',
              transition: 'all 200ms',
            }}>
              See how it works
            </a>
          </div>

          <p style={{
            ...f(400), fontSize: 13, color: '#78716C', margin: 0, letterSpacing: '-0.05px',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16, flexWrap: 'wrap',
          }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M3 6l2 2 4-4" stroke="#0F766E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
              Free during early access
            </span>
            <span style={{ width: 3, height: 3, borderRadius: '50%', background: '#D6D3D1' }} />
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M3 6l2 2 4-4" stroke="#0F766E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
              Connects in under a minute
            </span>
          </p>
        </div>

        <div style={{ ...f(500), marginTop: 'clamp(60px, 8vw, 96px)' }}>
          <HeroVisual />
        </div>
      </div>
    </section>
  )
}

/* ═══════════════════════════════════════════════════════════════════════════
   TRUST STRIP
   ═══════════════════════════════════════════════════════════════════════════ */

function TrustStrip() {
  const audiences = [
    { label: 'Product teams', icon: <Layers size={13} strokeWidth={2} /> },
    { label: 'Engineering leads', icon: <Zap size={13} strokeWidth={2} /> },
    { label: 'Founders', icon: <Sparkles size={13} strokeWidth={2} /> },
    { label: 'Researchers', icon: <Eye size={13} strokeWidth={2} /> },
    { label: 'Consultants', icon: <Brain size={13} strokeWidth={2} /> },
    { label: 'Design leads', icon: <Users size={13} strokeWidth={2} /> },
  ]
  return (
    <section style={{ padding: '80px clamp(20px, 4vw, 32px)', position: 'relative' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <Reveal>
          <div style={{ textAlign: 'center' }}>
            <p style={{
              fontSize: 16, color: '#292524', fontWeight: 450, letterSpacing: '-0.2px',
              margin: '0 0 36px', maxWidth: 580, marginInline: 'auto', lineHeight: 1.55,
            }}>
              Built for people who can't afford to forget what happened in the room.
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 10 }}>
              {audiences.map((a, i) => (
                <GlassCard key={a.label} glow glowColor="rgba(180,83,9,0.06)" style={{
                  borderRadius: 100, padding: '9px 16px',
                  display: 'inline-flex', alignItems: 'center', gap: 8,
                  cursor: 'default',
                }}>
                  <span style={{ color: '#78716C' }}>{a.icon}</span>
                  <span style={{
                    fontSize: 13, color: '#404040', fontWeight: 450, letterSpacing: '-0.05px',
                  }}>{a.label}</span>
                </GlassCard>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

/* ═══════════════════════════════════════════════════════════════════════════
   PROBLEM SECTION
   ═══════════════════════════════════════════════════════════════════════════ */

function Problem() {
  const stages = [
    { label: 'Meeting', desc: 'Everyone shows up.', opacity: 1 },
    { label: 'Conversation', desc: 'Ideas move quickly.', opacity: 0.85 },
    { label: 'Decisions', desc: 'Direction gets set.', opacity: 0.65 },
    { label: 'Tasks', desc: 'Work gets assigned.', opacity: 0.45 },
    { label: 'Silence', desc: 'The details fade.', opacity: 0.25 },
  ]

  return (
    <section style={{
      padding: 'clamp(100px, 12vw, 160px) clamp(20px, 4vw, 32px)',
      position: 'relative', overflow: 'hidden',
    }}>
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
        background: 'radial-gradient(ellipse 60% 40% at 50% 40%, rgba(180,83,9,0.04), transparent 70%)',
        pointerEvents: 'none',
      }} />

      <div style={{ maxWidth: 1200, margin: '0 auto', position: 'relative' }}>
        <Reveal>
          <div style={{ maxWidth: 720, marginBottom: 80 }}>
            <span style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              fontSize: 11.5, color: '#78716C', fontWeight: 500,
              textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 24,
              padding: '5px 12px', background: 'rgba(255,255,255,0.5)',
              backdropFilter: 'blur(8px)',
              border: '1px solid rgba(255,255,255,0.6)', borderRadius: 100,
            }}>
              <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#B45309' }} />
              The problem
            </span>
            <h2 style={{
              fontSize: 'clamp(32px, 5vw, 62px)', fontWeight: 600,
              letterSpacing: '-2px', lineHeight: 1.04, color: '#0A0A0A', margin: '0 0 24px',
            }}>
              Meetings create information.<br />
              <span style={{ color: '#A8A29E' }}>Humans forget it.</span>
            </h2>
            <p style={{
              fontSize: 18, color: '#57534E', lineHeight: 1.65, margin: 0, fontWeight: 400,
              letterSpacing: '-0.15px', maxWidth: 560,
            }}>
              A recording tells you what was said. A transcript is 40 pages long. Neither tells you what actually happened, what you decided, or what you owe someone by Friday.
            </p>
          </div>
        </Reveal>

        <Reveal delay={120}>
          <LiquidGlassCard style={{ padding: '48px 40px', position: 'relative', overflow: 'hidden' }}>
            <div style={{
              position: 'absolute', top: -60, right: -60, width: 200, height: 200,
              background: 'radial-gradient(circle, rgba(180,83,9,0.06), transparent 70%)',
              filter: 'blur(40px)', pointerEvents: 'none',
            }} />
            <div className="rc-stages" style={{
              display: 'grid', gridTemplateColumns: `repeat(${stages.length}, 1fr)`, gap: 0,
              position: 'relative',
            }}>
              {stages.map((s, i) => (
                <div key={s.label} style={{
                  padding: '0 24px', position: 'relative',
                  borderLeft: i === 0 ? 'none' : '1px solid rgba(10,10,10,0.06)',
                }}>
                  <div style={{
                    fontSize: 40, fontWeight: 700, letterSpacing: '-1px',
                    color: '#0A0A0A', opacity: s.opacity, marginBottom: 12,
                    lineHeight: 1,
                    fontVariantNumeric: 'tabular-nums',
                  }}>0{i + 1}</div>
                  <h3 style={{
                    fontSize: 18, fontWeight: 600, color: '#0A0A0A',
                    margin: '0 0 6px', letterSpacing: '-0.3px',
                    opacity: s.opacity,
                  }}>{s.label}</h3>
                  <p style={{
                    fontSize: 13.5, color: '#78716C', margin: 0, lineHeight: 1.5,
                    opacity: s.opacity,
                  }}>{s.desc}</p>
                  {i === stages.length - 1 && (
                    <div style={{
                      position: 'absolute', top: -12, right: -12,
                      width: 120, height: 120,
                      background: 'radial-gradient(circle, rgba(220,38,38,0.06), transparent 60%)',
                      filter: 'blur(20px)', pointerEvents: 'none',
                    }} />
                  )}
                </div>
              ))}
            </div>
          </LiquidGlassCard>
        </Reveal>

        <Reveal delay={240}>
          <div style={{ marginTop: 48, display: 'flex', alignItems: 'center', gap: 20, flexWrap: 'wrap' }}>
            <GlassCard glow glowColor="rgba(180,83,9,0.08)" style={{
              display: 'inline-flex', alignItems: 'center', gap: 10,
              padding: '11px 18px', borderRadius: 100,
            }}>
              <div style={{
                width: 22, height: 22, borderRadius: 6,
                background: 'linear-gradient(135deg, #B45309, #D97706)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 2px 6px rgba(180,83,9,0.2)',
              }}>
                <Sparkles size={11} color="white" strokeWidth={2.5} />
              </div>
              <span style={{ fontSize: 14, fontWeight: 500, color: '#0A0A0A', letterSpacing: '-0.1px' }}>With Recall</span>
            </GlassCard>
            <p style={{ fontSize: 16, color: '#292524', margin: 0, letterSpacing: '-0.15px', fontWeight: 400, flex: 1, minWidth: 200 }}>
              Every meeting becomes a searchable record — with the summary, decisions, and next steps already extracted.
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

/* ═══════════════════════════════════════════════════════════════════════════
   PRODUCT SHOWCASE WITH TABS
   ═══════════════════════════════════════════════════════════════════════════ */

type Tab = 'transcript' | 'summary' | 'decisions' | 'actions'

function TabPanel({ tab }: { tab: Tab }) {
  return (
    <div key={tab} style={{ animation: 'rc-fadein 400ms cubic-bezier(0.16,1,0.3,1)' }}>
      {tab === 'transcript' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {MEETING.transcript.map((seg, i) => {
            const p = MEETING.participants.find(x => x.name === seg.speaker)!
            return (
              <div key={i} className="rc-transcript-line" style={{
                display: 'flex', gap: 14, padding: '14px 16px', borderRadius: 14, transition: 'background 200ms',
              }}>
                <div style={{
                  flexShrink: 0, width: 30, height: 30, borderRadius: '50%',
                  background: `${p.color}15`, color: p.color,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 10, fontWeight: 700, border: `1.5px solid ${p.color}25`,
                }}>{p.initials}</div>
                <div>
                  <div style={{ display: 'flex', gap: 8, alignItems: 'baseline', marginBottom: 4 }}>
                    <span style={{ fontSize: 14, fontWeight: 550, color: '#0A0A0A', letterSpacing: '-0.1px' }}>{seg.speaker}</span>
                    <span style={{ fontSize: 11.5, color: '#A8A29E', fontVariantNumeric: 'tabular-nums' }}>{seg.time}</span>
                  </div>
                  <p style={{ fontSize: 14.5, color: '#292524', lineHeight: 1.65, margin: 0, letterSpacing: '-0.1px' }}>{seg.text}</p>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {tab === 'summary' && (
        <div>
          <p style={{ fontSize: 16, color: '#292524', lineHeight: 1.7, margin: '0 0 28px', letterSpacing: '-0.1px', fontWeight: 400 }}>
            {MEETING.summary}
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }} className="rc-summary-grid">
            {[
              { icon: <GitBranch size={14} color="#0F766E" strokeWidth={2} />, label: 'Decisions', count: MEETING.decisions.length, sub: 'Recorded with context', color: '#0F766E' },
              { icon: <CheckSquare size={14} color="#B45309" strokeWidth={2} />, label: 'Actions', count: MEETING.actions.length, sub: 'Assigned with owners', color: '#B45309' },
            ].map(c => (
              <GlassCard key={c.label} glow glowColor={`${c.color}10`} style={{ padding: 20, borderRadius: 14 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                  {c.icon}
                  <span style={{ fontSize: 11, fontWeight: 600, color: '#57534E', textTransform: 'uppercase', letterSpacing: '0.6px' }}>{c.label}</span>
                </div>
                <p style={{ fontSize: 28, fontWeight: 600, color: '#0A0A0A', margin: 0, letterSpacing: '-1px' }}>{c.count}</p>
                <p style={{ fontSize: 12.5, color: '#78716C', margin: '4px 0 0' }}>{c.sub}</p>
              </GlassCard>
            ))}
          </div>

          <div style={{ marginTop: 20 }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {MEETING.topics.map(t => (
                <span key={t} style={{
                  display: 'inline-flex', alignItems: 'center', gap: 4,
                  fontSize: 11.5, padding: '5px 10px',
                  background: 'rgba(255,255,255,0.6)',
                  backdropFilter: 'blur(8px)',
                  color: '#404040', borderRadius: 8, fontWeight: 450,
                  border: '1px solid rgba(255,255,255,0.7)',
                  letterSpacing: '-0.05px',
                }}>
                  <Hash size={9} strokeWidth={2.5} color="#A8A29E" />{t}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {tab === 'decisions' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {MEETING.decisions.map((d, i) => (
            <GlassCard key={i} glow glowColor="rgba(15,118,110,0.06)" style={{
              display: 'flex', gap: 14, padding: '20px 22px', borderRadius: 14,
            }}>
              <div style={{
                width: 30, height: 30, borderRadius: 8, flexShrink: 0,
                background: 'rgba(15,118,110,0.1)',
                border: '1px solid rgba(15,118,110,0.2)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <GitBranch size={14} color="#0F766E" strokeWidth={2} />
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: 15, color: '#0A0A0A', margin: 0, lineHeight: 1.55, fontWeight: 450, letterSpacing: '-0.1px' }}>{d}</p>
                <p style={{ fontSize: 12, color: '#78716C', margin: '8px 0 0', display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Clock size={10} strokeWidth={2} />
                  Decided at {MEETING.date}
                </p>
              </div>
            </GlassCard>
          ))}
        </div>
      )}

      {tab === 'actions' && <ActionsPanel />}
    </div>
  )
}

function ActionsPanel() {
  const [checked, setChecked] = useState<Record<number, boolean>>({})
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      {MEETING.actions.map((a, i) => {
        const done = !!checked[i]
        return (
          <GlassCard key={i} glow glowColor="rgba(180,83,9,0.06)" style={{
            display: 'flex', gap: 14, padding: '18px 20px', borderRadius: 14,
            opacity: done ? 0.6 : 1, transition: 'opacity 300ms',
          }}>
            <button
              onClick={() => setChecked(c => ({ ...c, [i]: !c[i] }))}
              aria-label={done ? 'Mark incomplete' : 'Mark complete'}
              style={{
                width: 22, height: 22, borderRadius: 6, flexShrink: 0, marginTop: 1,
                border: done ? 'none' : '2px solid #A8A29E',
                background: done ? '#0A0A0A' : 'transparent', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'all 200ms',
                boxShadow: done ? '0 2px 6px rgba(0,0,0,0.15)' : 'none',
              }}
            >
              {done && (
                <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
                  <path d="M2.5 6.5L4.8 8.8L9.5 3.5" stroke="#FAFAF9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
            </button>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{
                fontSize: 14.5, color: '#0A0A0A', margin: 0, fontWeight: 500,
                letterSpacing: '-0.1px', lineHeight: 1.5,
                textDecoration: done ? 'line-through' : 'none',
                transition: 'all 200ms',
              }}>{a.text}</p>
              <div style={{ display: 'flex', gap: 12, marginTop: 8, alignItems: 'center', flexWrap: 'wrap' }}>
                <span style={{
                  fontSize: 12, color: '#57534E', fontWeight: 450,
                  display: 'inline-flex', alignItems: 'center', gap: 5,
                }}>
                  <Users size={10} strokeWidth={2} />{a.owner}
                </span>
                <span style={{ width: 3, height: 3, borderRadius: '50%', background: '#D6D3D1' }} />
                <span style={{
                  fontSize: 12, color: '#78716C',
                  display: 'inline-flex', alignItems: 'center', gap: 5,
                }}>
                  <Clock size={10} strokeWidth={2} />{a.due}
                </span>
              </div>
            </div>
          </GlassCard>
        )
      })}
    </div>
  )
}

function ProductShowcase() {
  const [tab, setTab] = useState<Tab>('summary')
  const containerRef = useRef<HTMLDivElement>(null)

  const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: 'transcript', label: 'Transcript', icon: <FileText size={14} strokeWidth={2} /> },
    { id: 'summary', label: 'Summary', icon: <Sparkles size={14} strokeWidth={2} /> },
    { id: 'decisions', label: 'Decisions', icon: <GitBranch size={14} strokeWidth={2} /> },
    { id: 'actions', label: 'Action items', icon: <CheckSquare size={14} strokeWidth={2} /> },
  ]

  return (
    <section id="product" style={{
      padding: 'clamp(100px, 12vw, 160px) clamp(20px, 4vw, 32px)',
      position: 'relative',
    }}>
      <div style={{ maxWidth: 1280, margin: '0 auto' }}>
        <Reveal>
          <div style={{ maxWidth: 720, marginBottom: 64 }}>
            <span style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              fontSize: 11.5, color: '#78716C', fontWeight: 500,
              textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 24,
              padding: '5px 12px', background: 'rgba(255,255,255,0.5)',
              backdropFilter: 'blur(8px)',
              border: '1px solid rgba(255,255,255,0.6)', borderRadius: 100,
            }}>
              <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#0F766E' }} />
              The product
            </span>
            <h2 style={{
              fontSize: 'clamp(32px, 5vw, 58px)', fontWeight: 600,
              letterSpacing: '-2px', lineHeight: 1.04, color: '#0A0A0A', margin: '0 0 20px',
            }}>
              One meeting.<br />Four ways to remember it.
            </h2>
            <p style={{ fontSize: 18, color: '#57534E', lineHeight: 1.6, margin: 0, fontWeight: 400, letterSpacing: '-0.15px', maxWidth: 560 }}>
              Every conversation gets restructured into the views that actually get used — read, skimmed, referenced, and acted on.
            </p>
          </div>
        </Reveal>

        <Reveal delay={100}>
          <LiquidGlassCard ref={containerRef}>
            <div style={{
              padding: '18px 24px',
              borderBottom: '1px solid rgba(255,255,255,0.4)',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap',
              background: 'rgba(255,255,255,0.2)',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <div style={{
                  width: 38, height: 38, borderRadius: 10,
                  background: 'linear-gradient(135deg, #292524, #0A0A0A)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                }}>
                  <Mic size={16} color="#FAFAF9" strokeWidth={2} />
                </div>
                <div>
                  <h3 style={{ fontSize: 16, fontWeight: 600, color: '#0A0A0A', margin: 0, letterSpacing: '-0.2px' }}>{MEETING.title}</h3>
                  <p style={{ fontSize: 13, color: '#78716C', margin: '2px 0 0' }}>
                    {MEETING.date} · {MEETING.duration} · {MEETING.participants.length} participants
                  </p>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: -6 }}>
                {MEETING.participants.map((p, i) => (
                  <div key={p.name} title={p.name} style={{
                    width: 28, height: 28, borderRadius: '50%',
                    background: p.color, color: 'white',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 10, fontWeight: 600, marginLeft: i === 0 ? 0 : -6,
                    border: '2px solid rgba(255,255,255,0.8)',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                  }}>{p.initials}</div>
                ))}
              </div>
            </div>

            <div style={{
              padding: '8px 20px',
              borderBottom: '1px solid rgba(255,255,255,0.3)',
              display: 'flex', gap: 4, overflowX: 'auto',
              background: 'rgba(255,255,255,0.15)',
            }} role="tablist" aria-label="Meeting views">
              {tabs.map(t => (
                <button
                  key={t.id}
                  role="tab"
                  aria-selected={tab === t.id}
                  onClick={() => setTab(t.id)}
                  className="rc-tab"
                  style={{
                    display: 'inline-flex', alignItems: 'center', gap: 7,
                    padding: '10px 16px', border: 'none', borderRadius: 10,
                    background: tab === t.id
                      ? 'rgba(255,255,255,0.7)'
                      : 'transparent',
                    backdropFilter: tab === t.id ? 'blur(8px)' : 'none',
                    color: tab === t.id ? '#0A0A0A' : '#78716C',
                    fontSize: 13.5, fontWeight: tab === t.id ? 550 : 450,
                    letterSpacing: '-0.1px', cursor: 'pointer', whiteSpace: 'nowrap',
                    transition: 'all 200ms',
                    boxShadow: tab === t.id ? '0 1px 4px rgba(0,0,0,0.04), 0 0 0 0.5px rgba(255,255,255,0.5) inset' : 'none',
                  }}
                >
                  {t.icon}{t.label}
                </button>
              ))}
            </div>

            <div style={{
              display: 'grid', gridTemplateColumns: '1fr 280px',
              minHeight: 520,
            }} className="rc-showcase-body">
              <div style={{ padding: '28px 32px', overflow: 'hidden', overflowY: 'auto', maxHeight: 560 }}>
                <TabPanel tab={tab} />
              </div>
              <div style={{
                padding: '28px 24px',
                background: 'rgba(255,255,255,0.25)',
                borderLeft: '1px solid rgba(255,255,255,0.4)',
              }} className="rc-showcase-side">
                <span style={{
                  display: 'flex', alignItems: 'center', gap: 6,
                  fontSize: 10.5, fontWeight: 600, color: '#78716C',
                  textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: 14,
                }}>
                  <Hash size={10} strokeWidth={2.5} /> Topics
                </span>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 32 }}>
                  {MEETING.topics.map(t => (
                    <span key={t} className="rc-topic-chip" style={{
                      display: 'inline-flex', alignItems: 'center', gap: 4,
                      fontSize: 11.5, padding: '5px 10px',
                      background: 'rgba(255,255,255,0.5)', backdropFilter: 'blur(6px)',
                      color: '#404040', borderRadius: 8, fontWeight: 450,
                      border: '1px solid rgba(255,255,255,0.6)',
                      letterSpacing: '-0.05px', cursor: 'default',
                      transition: 'all 200ms',
                    }}>{t}</span>
                  ))}
                </div>

                <span style={{
                  display: 'flex', alignItems: 'center', gap: 6,
                  fontSize: 10.5, fontWeight: 600, color: '#78716C',
                  textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: 14,
                }}>
                  <Users size={10} strokeWidth={2.5} /> Participants
                </span>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {MEETING.participants.map(p => (
                    <div key={p.name} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{
                        width: 26, height: 26, borderRadius: '50%',
                        background: `${p.color}15`, color: p.color,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: 9, fontWeight: 700, border: `1.5px solid ${p.color}25`,
                      }}>{p.initials}</div>
                      <span style={{ fontSize: 13, color: '#292524', fontWeight: 450, letterSpacing: '-0.05px' }}>{p.name}</span>
                    </div>
                  ))}
                </div>

                <div style={{ marginTop: 32, padding: '18px', borderRadius: 14, background: 'rgba(255,255,255,0.4)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.5)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
                    <Clock size={11} strokeWidth={2} color="#78716C" />
                    <span style={{ fontSize: 10.5, fontWeight: 600, color: '#78716C', textTransform: 'uppercase', letterSpacing: '0.6px' }}>Duration</span>
                  </div>
                  <span style={{ fontSize: 22, fontWeight: 600, color: '#0A0A0A', letterSpacing: '-0.5px' }}>{MEETING.duration}</span>
                </div>
              </div>
            </div>
          </LiquidGlassCard>
        </Reveal>
      </div>
    </section>
  )
}

/* ═══════════════════════════════════════════════════════════════════════════
   HOW IT WORKS
   ═══════════════════════════════════════════════════════════════════════════ */

function HowItWorks() {
  const steps = [
    { n: '01', title: 'Capture', desc: 'Recall records the conversation, from calendar-linked calls or manual capture directly in your browser.', icon: <Mic size={20} strokeWidth={1.5} />, color: '#B45309' },
    { n: '02', title: 'Understand', desc: 'The transcript is restructured into a summary, decisions, action items, and the topics that were discussed.', icon: <Sparkles size={20} strokeWidth={1.5} />, color: '#0F766E' },
    { n: '03', title: 'Remember', desc: 'Search across every meeting or ask Recall directly. Answers come with references to the moment they were said.', icon: <Search size={20} strokeWidth={1.5} />, color: '#7C3AED' },
    { n: '04', title: 'Act', desc: "Decisions and next steps stop living in someone's head. Every action item has an owner and a deadline attached.", icon: <CheckSquare size={20} strokeWidth={1.5} />, color: '#BE185D' },
  ]

  return (
    <section id="how" style={{
      padding: 'clamp(100px, 12vw, 160px) clamp(20px, 4vw, 32px)',
      position: 'relative',
    }}>
      <div style={{
        position: 'absolute', top: '20%', right: '5%', width: 400, height: 400,
        background: 'radial-gradient(circle, rgba(124,58,237,0.04), transparent 60%)',
        filter: 'blur(60px)', pointerEvents: 'none',
      }} />

      <div style={{ maxWidth: 1280, margin: '0 auto', position: 'relative' }}>
        <Reveal>
          <div style={{ maxWidth: 720, marginBottom: 72 }}>
            <span style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              fontSize: 11.5, color: '#78716C', fontWeight: 500,
              textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 24,
              padding: '5px 12px', background: 'rgba(255,255,255,0.5)',
              backdropFilter: 'blur(8px)',
              border: '1px solid rgba(255,255,255,0.6)', borderRadius: 100,
            }}>
              <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#7C3AED' }} />
              How it works
            </span>
            <h2 style={{
              fontSize: 'clamp(32px, 5vw, 58px)', fontWeight: 600,
              letterSpacing: '-2px', lineHeight: 1.04, color: '#0A0A0A', margin: 0,
            }}>
              Four steps between the meeting and what you needed from it.
            </h2>
          </div>
        </Reveal>

        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: 16,
        }}>
          {steps.map((s, i) => (
            <Reveal key={s.n} delay={i * 80}>
              <GlassCard glow glowColor={`${s.color}10`} style={{
                padding: '36px 28px', height: '100%', borderRadius: 20,
              }}>
                <div style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  marginBottom: 36,
                }}>
                  <span style={{
                    fontSize: 48, fontWeight: 700, letterSpacing: '-2px',
                    color: '#0A0A0A', opacity: 0.08, lineHeight: 1,
                  }}>{s.n}</span>
                  <div style={{
                    width: 44, height: 44, borderRadius: 12,
                    background: `${s.color}10`,
                    border: `1px solid ${s.color}20`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: s.color,
                    boxShadow: `0 4px 12px ${s.color}10`,
                  }}>{s.icon}</div>
                </div>
                <h3 style={{
                  fontSize: 20, fontWeight: 600, color: '#0A0A0A',
                  margin: '0 0 10px', letterSpacing: '-0.4px',
                }}>{s.title}</h3>
                <p style={{ fontSize: 14, color: '#57534E', lineHeight: 1.6, margin: 0, letterSpacing: '-0.05px' }}>{s.desc}</p>
              </GlassCard>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ═══════════════════════════════════════════════════════════════════════════
   FEATURES GRID
   ═══════════════════════════════════════════════════════════════════════════ */

function Features() {
  const features = [
    { icon: Mic, title: 'Meeting recording', desc: 'Capture any conversation, whether scheduled through your calendar or started ad-hoc.', size: 'large' },
    { icon: FileText, title: 'Transcription', desc: 'Speaker-attributed transcripts you can read, skim, or reference.', size: 'normal' },
    { icon: Sparkles, title: 'AI summaries', desc: 'The essential shape of the conversation, without a wall of text.', size: 'normal' },
    { icon: CheckSquare, title: 'Action items', desc: 'Automatically extracted with owners and due dates.', size: 'normal' },
    { icon: GitBranch, title: 'Decision tracking', desc: 'Every commitment made in a meeting, stored with context.', size: 'normal' },
    { icon: Hash, title: 'Topic extraction', desc: 'The threads of what was actually discussed, structured for reference.', size: 'large' },
    { icon: Search, title: 'Full-text search', desc: "Find any moment across every meeting you've ever had.", size: 'normal' },
    { icon: MessageSquareText, title: 'Ask Recall', desc: 'Ask questions in natural language. Get answers with sources.', size: 'large' },
    { icon: Calendar, title: 'Calendar sync', desc: 'Recall sees upcoming meetings and prepares to capture them.', size: 'normal' },
    { icon: Clock, title: 'Meeting history', desc: 'A durable timeline of everything your team has discussed.', size: 'normal' },
    { icon: Lock, title: 'Private by default', desc: 'Recordings belong to their owner. Access is explicit.', size: 'normal' },
    { icon: Share2, title: 'Shareable records', desc: "Send a meeting summary to someone who wasn't there.", size: 'normal' },
  ]

  return (
    <section id="features" style={{
      padding: 'clamp(100px, 12vw, 160px) clamp(20px, 4vw, 32px)',
      position: 'relative',
    }}>
      <div style={{
        position: 'absolute', bottom: '10%', left: '10%', width: 500, height: 500,
        background: 'radial-gradient(circle, rgba(15,118,110,0.04), transparent 60%)',
        filter: 'blur(80px)', pointerEvents: 'none',
      }} />

      <div style={{ maxWidth: 1280, margin: '0 auto', position: 'relative' }}>
        <Reveal>
          <div style={{ maxWidth: 700, marginBottom: 72 }}>
            <span style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              fontSize: 11.5, color: '#78716C', fontWeight: 500,
              textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 24,
              padding: '5px 12px', background: 'rgba(255,255,255,0.5)',
              backdropFilter: 'blur(8px)',
              border: '1px solid rgba(255,255,255,0.6)', borderRadius: 100,
            }}>
              <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#0F766E' }} />
              Features
            </span>
            <h2 style={{
              fontSize: 'clamp(32px, 5vw, 58px)', fontWeight: 600,
              letterSpacing: '-2px', lineHeight: 1.04, color: '#0A0A0A', margin: 0,
            }}>
              Everything a meeting needs to outlive the conversation.
            </h2>
          </div>
        </Reveal>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: 14,
        }}>
          {features.map((f, i) => {
            const Icon = f.icon
            return (
              <Reveal key={f.title} delay={i * 30}>
                <GlassCard glow glowColor="rgba(180,83,9,0.05)" className="rc-feature-card" style={{
                  padding: '28px 24px', height: '100%', borderRadius: 18,
                  cursor: 'default',
                }}>
                  <div style={{
                    width: 38, height: 38, borderRadius: 10,
                    background: 'rgba(255,255,255,0.6)', backdropFilter: 'blur(8px)',
                    border: '1px solid rgba(255,255,255,0.7)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: '#0A0A0A', marginBottom: 20,
                    boxShadow: '0 2px 8px rgba(0,0,0,0.04), 0 0 0 0.5px rgba(255,255,255,0.5) inset',
                  }}>
                    <Icon size={17} strokeWidth={1.8} />
                  </div>
                  <h3 style={{
                    fontSize: 16, fontWeight: 600, color: '#0A0A0A',
                    margin: '0 0 8px', letterSpacing: '-0.25px',
                  }}>{f.title}</h3>
                  <p style={{ fontSize: 14, color: '#57534E', lineHeight: 1.6, margin: 0, letterSpacing: '-0.05px' }}>{f.desc}</p>
                </GlassCard>
              </Reveal>
            )
          })}
        </div>
      </div>
    </section>
  )
}

/* ═══════════════════════════════════════════════════════════════════════════
   ASK RECALL
   ═══════════════════════════════════════════════════════════════════════════ */

function AskRecall() {
  const suggestions = [
    'What did we decide about the launch timeline?',
    'What are all the action items assigned to Priya?',
    'Summarize the last three product meetings.',
  ]
  const answers: Record<string, { text: string; sources: { title: string; date: string }[] }> = {
    'What did we decide about the launch timeline?': {
      text: "The team agreed to move the public launch to October 14. Sarah will finalize the release checklist by October 7, and Daniel will coordinate the final QA pass in parallel. The internal soft launch remains scheduled for October 1.",
      sources: [
        { title: 'Q4 Roadmap Review', date: 'Nov 12' },
        { title: 'Launch Readiness Sync', date: 'Nov 5' },
      ],
    },
    'What are all the action items assigned to Priya?': {
      text: "Priya has three open action items: redesign the onboarding flow with a deferred invite step (due Nov 15), draft the customer research summary from last week's interviews (due Nov 18), and review the new pricing page copy (due Nov 20).",
      sources: [
        { title: 'Q4 Roadmap Review', date: 'Nov 12' },
        { title: 'Design Weekly', date: 'Nov 8' },
      ],
    },
    'Summarize the last three product meetings.': {
      text: "The team focused on onboarding conversion, API readiness, and pricing. The redesigned onboarding flow ships Friday. The public API launch is blocked on rate limiting. Pricing page copy is being reviewed for a Nov 20 update.",
      sources: [
        { title: 'Q4 Roadmap Review', date: 'Nov 12' },
        { title: 'API Planning', date: 'Nov 8' },
        { title: 'Pricing Review', date: 'Nov 6' },
      ],
    },
  }

  const [selected, setSelected] = useState<string>(suggestions[0])
  const [phase, setPhase] = useState<'idle' | 'answering' | 'done'>('idle')
  const { ref, visible } = useReveal<HTMLDivElement>()

  const ask = useCallback((q: string) => {
    setSelected(q)
    setPhase('answering')
    setTimeout(() => setPhase('done'), 800)
  }, [])

  useEffect(() => {
    if (visible && phase === 'idle') {
      const t = setTimeout(() => { setPhase('answering'); setTimeout(() => setPhase('done'), 800) }, 500)
      return () => clearTimeout(t)
    }
  }, [visible, phase])

  const answer = answers[selected]

  return (
    <section style={{
      padding: 'clamp(100px, 12vw, 160px) clamp(20px, 4vw, 32px)',
      position: 'relative',
    }}>
      <div style={{
        position: 'absolute', top: '30%', left: '5%', width: 400, height: 400,
        background: 'radial-gradient(circle, rgba(180,83,9,0.05), transparent 60%)',
        filter: 'blur(80px)', pointerEvents: 'none',
      }} />

      <div style={{ maxWidth: 1280, margin: '0 auto', position: 'relative' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.3fr', gap: 72, alignItems: 'center' }} className="rc-ask-grid">
          <Reveal>
            <div>
              <span style={{
                display: 'inline-flex', alignItems: 'center', gap: 6,
                fontSize: 11.5, color: '#78716C', fontWeight: 500,
                textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 24,
                padding: '5px 12px', background: 'rgba(255,255,255,0.5)',
                backdropFilter: 'blur(8px)',
                border: '1px solid rgba(255,255,255,0.6)', borderRadius: 100,
              }}>
                <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#B45309' }} />
                Ask Recall
              </span>
              <h2 style={{
                fontSize: 'clamp(30px, 4.5vw, 50px)', fontWeight: 600,
                letterSpacing: '-1.6px', lineHeight: 1.06, color: '#0A0A0A', margin: '0 0 22px',
              }}>
                A question is faster than scrolling through six meetings.
              </h2>
              <p style={{
                fontSize: 17, color: '#57534E', lineHeight: 1.65, margin: '0 0 32px',
                fontWeight: 400, letterSpacing: '-0.1px',
              }}>
                Ask Recall pulls from every meeting you've captured and answers with the source moments attached, so you can verify what you're told.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {[
                  { text: 'Natural-language answers', icon: <MessageSquareText size={13} strokeWidth={2} /> },
                  { text: 'Grounded in real transcripts', icon: <FileText size={13} strokeWidth={2} /> },
                  { text: 'Sources cited inline', icon: <Search size={13} strokeWidth={2} /> },
                ].map(item => (
                  <div key={item.text} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{
                      width: 28, height: 28, borderRadius: 8,
                      background: 'rgba(10,10,10,0.04)',
                      border: '1px solid rgba(10,10,10,0.06)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: '#404040',
                    }}>{item.icon}</div>
                    <span style={{ fontSize: 14.5, color: '#292524', letterSpacing: '-0.1px' }}>{item.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>

          <Reveal delay={120}>
            <LiquidGlassCard ref={ref}>
              <div style={{
                padding: '16px 20px',
                borderBottom: '1px solid rgba(255,255,255,0.4)',
                display: 'flex', alignItems: 'center', gap: 10,
                background: 'rgba(255,255,255,0.2)',
              }}>
                <div style={{
                  width: 26, height: 26, borderRadius: 8,
                  background: 'linear-gradient(135deg, #B45309, #D97706)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  boxShadow: '0 2px 8px rgba(180,83,9,0.2)',
                }}>
                  <Sparkles size={12} color="white" strokeWidth={2.5} />
                </div>
                <span style={{ fontSize: 14, fontWeight: 550, color: '#0A0A0A', letterSpacing: '-0.1px' }}>Ask Recall</span>
                <span style={{
                  marginLeft: 'auto', fontSize: 11.5, color: '#78716C',
                  display: 'inline-flex', alignItems: 'center', gap: 5,
                  padding: '3px 8px', background: 'rgba(255,255,255,0.5)',
                  borderRadius: 6, border: '1px solid rgba(255,255,255,0.6)',
                }}>
                  <Command size={10} strokeWidth={2.5} /> K
                </span>
              </div>

              <div style={{ padding: '22px 24px', minHeight: 380 }}>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 24 }}>
                  {suggestions.map(s => (
                    <button
                      key={s}
                      onClick={() => ask(s)}
                      className="rc-suggestion"
                      style={{
                        fontSize: 12.5, padding: '8px 14px',
                        background: selected === s ? '#0A0A0A' : 'rgba(255,255,255,0.5)',
                        backdropFilter: selected === s ? 'none' : 'blur(8px)',
                        color: selected === s ? '#FAFAF9' : '#404040',
                        border: `1px solid ${selected === s ? '#0A0A0A' : 'rgba(255,255,255,0.7)'}`,
                        borderRadius: 100, cursor: 'pointer', fontWeight: 450,
                        letterSpacing: '-0.05px', textAlign: 'left',
                        transition: 'all 200ms',
                        boxShadow: selected === s ? '0 2px 8px rgba(0,0,0,0.15)' : '0 1px 4px rgba(0,0,0,0.03)',
                      }}
                    >{s}</button>
                  ))}
                </div>

                {selected && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
                    <div style={{
                      padding: '12px 16px',
                      background: 'rgba(255,255,255,0.5)', backdropFilter: 'blur(8px)',
                      borderRadius: 12, border: '1px solid rgba(255,255,255,0.6)',
                      fontSize: 14, color: '#292524', letterSpacing: '-0.1px',
                      display: 'flex', alignItems: 'center', gap: 8,
                    }}>
                      <Search size={13} color="#78716C" strokeWidth={2} />
                      {selected}
                    </div>

                    {phase === 'answering' ? (
                      <div style={{ display: 'flex', gap: 8, padding: '12px 4px', alignItems: 'center' }}>
                        <div className="rc-thinking-spinner" style={{
                          width: 18, height: 18, borderRadius: '50%',
                          border: '2px solid rgba(180,83,9,0.15)',
                          borderTopColor: '#B45309',
                        }} />
                        <span style={{ fontSize: 13, color: '#78716C' }}>Searching across your meetings…</span>
                      </div>
                    ) : phase === 'done' && answer && (
                      <div style={{ animation: 'rc-fadein 500ms cubic-bezier(0.16,1,0.3,1)' }}>
                        <div style={{
                          padding: '18px 20px',
                          background: 'rgba(255,255,255,0.5)', backdropFilter: 'blur(12px)',
                          borderRadius: 14, border: '1px solid rgba(255,255,255,0.7)',
                          boxShadow: '0 4px 16px rgba(0,0,0,0.04)',
                        }}>
                          <p style={{
                            fontSize: 14.5, color: '#0A0A0A', lineHeight: 1.7,
                            margin: '0 0 18px', letterSpacing: '-0.1px', fontWeight: 400,
                          }}>{answer.text}</p>
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                            {answer.sources.map(src => (
                              <span key={src.title} className="rc-source-chip" style={{
                                display: 'inline-flex', alignItems: 'center', gap: 6,
                                fontSize: 11.5, padding: '6px 12px',
                                background: 'rgba(255,255,255,0.6)', backdropFilter: 'blur(6px)',
                                color: '#404040',
                                border: '1px solid rgba(255,255,255,0.7)', borderRadius: 8,
                                fontWeight: 450, letterSpacing: '-0.05px',
                                transition: 'all 200ms', cursor: 'default',
                              }}>
                                <FileText size={10} strokeWidth={2} color="#78716C" />
                                {src.title}
                                <span style={{ color: '#D6D3D1' }}>·</span>
                                <span style={{ color: '#78716C' }}>{src.date}</span>
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div style={{
                padding: '14px 20px',
                borderTop: '1px solid rgba(255,255,255,0.4)',
                display: 'flex', gap: 10,
                background: 'rgba(255,255,255,0.2)',
              }}>
                <div style={{
                  flex: 1, padding: '10px 14px',
                  background: 'rgba(255,255,255,0.5)', backdropFilter: 'blur(8px)',
                  border: '1px solid rgba(255,255,255,0.7)', borderRadius: 10,
                  fontSize: 13.5, color: '#A8A29E', letterSpacing: '-0.05px',
                }}>Ask about anything you've discussed…</div>
                <Link href="/login" className="rc-cta-btn" style={{
                  padding: '10px 18px',
                  background: 'linear-gradient(135deg, #0A0A0A, #262626)',
                  color: '#FAFAF9',
                  borderRadius: 10, fontSize: 13, fontWeight: 500, textDecoration: 'none',
                  letterSpacing: '-0.05px', whiteSpace: 'nowrap',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                }}>Try it</Link>
              </div>
            </LiquidGlassCard>
          </Reveal>
        </div>
      </div>
    </section>
  )
}

/* ═══════════════════════════════════════════════════════════════════════════
   CALENDAR WORKFLOW
   ═══════════════════════════════════════════════════════════════════════════ */

function Workflow() {
  const meetings = [
    { time: '09:00', title: 'Product Strategy', duration: '45 min', color: '#B45309', captured: true },
    { time: '11:30', title: 'Engineering Sync', duration: '30 min', color: '#0F766E', captured: true },
    { time: '14:00', title: 'Customer Research', duration: '60 min', color: '#7C3AED', captured: true },
    { time: '16:00', title: 'Weekly Review', duration: '45 min', color: '#BE185D', captured: false },
  ]

  return (
    <section style={{
      padding: 'clamp(100px, 12vw, 160px) clamp(20px, 4vw, 32px)',
      position: 'relative',
    }}>
      <div style={{
        position: 'absolute', top: '20%', left: '10%', width: 400, height: 400,
        background: 'radial-gradient(circle, rgba(180,83,9,0.04), transparent 60%)',
        filter: 'blur(60px)', pointerEvents: 'none',
      }} />

      <div style={{ maxWidth: 1280, margin: '0 auto', position: 'relative' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 1fr', gap: 72, alignItems: 'center' }} className="rc-workflow-grid">
          <Reveal>
            <LiquidGlassCard style={{ padding: 24 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
                <div>
                  <p style={{ fontSize: 12, color: '#78716C', margin: 0, fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.6px' }}>Today</p>
                  <p style={{ fontSize: 17, fontWeight: 600, color: '#0A0A0A', margin: '4px 0 0', letterSpacing: '-0.3px' }}>Wednesday, Nov 13</p>
                </div>
                <GlassCard style={{ borderRadius: 100, padding: '6px 12px' }}>
                  <div style={{
                    fontSize: 11, color: '#0F766E', fontWeight: 500,
                    display: 'flex', alignItems: 'center', gap: 5,
                  }}>
                    <Calendar size={11} strokeWidth={2} /> Connected
                  </div>
                </GlassCard>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {meetings.map((m, i) => (
                  <Reveal key={m.title} delay={i * 60}>
                    <GlassCard glow glowColor={`${m.color}08`} style={{
                      display: 'flex', alignItems: 'center', gap: 14, padding: '16px 18px',
                      borderRadius: 14,
                    }}>
                      <div style={{
                        fontSize: 12.5, fontWeight: 500, color: '#57534E',
                        fontVariantNumeric: 'tabular-nums', letterSpacing: '-0.05px',
                        width: 44,
                      }}>{m.time}</div>
                      <div style={{ width: 3, height: 36, background: m.color, borderRadius: 2 }} />
                      <div style={{ flex: 1 }}>
                        <p style={{ fontSize: 14, fontWeight: 550, color: '#0A0A0A', margin: 0, letterSpacing: '-0.15px' }}>{m.title}</p>
                        <p style={{ fontSize: 12, color: '#78716C', margin: '3px 0 0' }}>{m.duration}</p>
                      </div>
                      {m.captured ? (
                        <span style={{
                          display: 'inline-flex', alignItems: 'center', gap: 5,
                          fontSize: 11, fontWeight: 500, color: '#0A0A0A',
                          padding: '5px 10px',
                          background: 'rgba(255,255,255,0.5)', backdropFilter: 'blur(6px)',
                          borderRadius: 8, border: '1px solid rgba(255,255,255,0.6)',
                        }}>
                          <Circle size={6} fill="#0A0A0A" stroke="none" />
                          Captured
                        </span>
                      ) : (
                        <span className="rc-upcoming-badge" style={{
                          fontSize: 11, fontWeight: 500, color: '#78716C',
                          padding: '5px 10px',
                          background: 'rgba(255,255,255,0.3)',
                          borderRadius: 8,
                          border: '1px dashed rgba(10,10,10,0.15)',
                        }}>Upcoming</span>
                      )}
                    </GlassCard>
                  </Reveal>
                ))}
              </div>
            </LiquidGlassCard>
          </Reveal>

          <Reveal delay={120}>
            <div>
              <span style={{
                display: 'inline-flex', alignItems: 'center', gap: 6,
                fontSize: 11.5, color: '#78716C', fontWeight: 500,
                textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 24,
                padding: '5px 12px', background: 'rgba(255,255,255,0.5)',
                backdropFilter: 'blur(8px)',
                border: '1px solid rgba(255,255,255,0.6)', borderRadius: 100,
              }}>
                <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#BE185D' }} />
                Workflow
              </span>
              <h2 style={{
                fontSize: 'clamp(30px, 4.5vw, 50px)', fontWeight: 600,
                letterSpacing: '-1.6px', lineHeight: 1.06, color: '#0A0A0A', margin: '0 0 22px',
              }}>
                Recall doesn't create another place you have to maintain.
              </h2>
              <p style={{
                fontSize: 17, color: '#57534E', lineHeight: 1.65, margin: '0 0 36px',
                fontWeight: 400, letterSpacing: '-0.1px',
              }}>
                Connect your calendar and Recall becomes the memory layer around meetings you're already having. Every scheduled call turns into a searchable record — automatically.
              </p>
              <Link href="/login" className="rc-ghost-btn-large" style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                padding: '13px 22px',
                background: 'rgba(255,255,255,0.5)', backdropFilter: 'blur(12px)',
                border: '1px solid rgba(255,255,255,0.7)', borderRadius: 12,
                fontSize: 14.5, fontWeight: 500, color: '#0A0A0A', textDecoration: 'none',
                letterSpacing: '-0.1px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                transition: 'all 200ms',
              }}>
                Connect your calendar <ArrowRight size={15} strokeWidth={2} />
              </Link>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}

/* ═══════════════════════════════════════════════════════════════════════════
   ACTION ITEMS SHOWCASE
   ═══════════════════════════════════════════════════════════════════════════ */

function ActionItems() {
  const actions = [
    { text: 'Finalize onboarding flow redesign', owner: 'Priya Menon', due: 'Fri, Nov 15', priority: 'high' },
    { text: 'Review API architecture and rate limiting', owner: 'James Ward', due: 'Mon, Nov 18', priority: 'high' },
    { text: 'Send customer research notes to stakeholders', owner: 'Daniel Ortiz', due: 'Tue, Nov 19', priority: 'medium' },
    { text: 'Update pricing page copy', owner: 'Sarah Chen', due: 'Wed, Nov 20', priority: 'medium' },
    { text: 'Schedule design review for onboarding v2', owner: 'Priya Menon', due: 'Thu, Nov 21', priority: 'low' },
  ]
  const [checked, setChecked] = useState<Record<number, boolean>>({})

  return (
    <section style={{
      padding: 'clamp(100px, 12vw, 160px) clamp(20px, 4vw, 32px)',
      position: 'relative',
    }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', position: 'relative' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: 72, alignItems: 'center' }} className="rc-ask-grid">
          <Reveal>
            <div>
              <span style={{
                display: 'inline-flex', alignItems: 'center', gap: 6,
                fontSize: 11.5, color: '#78716C', fontWeight: 500,
                textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 24,
                padding: '5px 12px', background: 'rgba(255,255,255,0.5)',
                backdropFilter: 'blur(8px)',
                border: '1px solid rgba(255,255,255,0.6)', borderRadius: 100,
              }}>
                <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#B45309' }} />
                Action items
              </span>
              <h2 style={{
                fontSize: 'clamp(30px, 4.5vw, 50px)', fontWeight: 600,
                letterSpacing: '-1.6px', lineHeight: 1.06, color: '#0A0A0A', margin: '0 0 22px',
              }}>
                Conversations become<br />commitments.
              </h2>
              <p style={{
                fontSize: 17, color: '#57534E', lineHeight: 1.65, margin: '0 0 28px',
                fontWeight: 400, letterSpacing: '-0.1px',
              }}>
                Every action item is extracted automatically from the conversation — with an owner, a deadline, and the context around why it was assigned.
              </p>
            </div>
          </Reveal>

          <Reveal delay={100}>
            <LiquidGlassCard style={{ padding: 24 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
                <span style={{
                  display: 'flex', alignItems: 'center', gap: 6,
                  fontSize: 11, fontWeight: 600, color: '#78716C',
                  textTransform: 'uppercase', letterSpacing: '0.7px',
                }}>
                  <CheckSquare size={11} strokeWidth={2.5} /> {actions.length} items · This week
                </span>
                <span style={{
                  fontSize: 12, color: '#0F766E', fontWeight: 500,
                  display: 'flex', alignItems: 'center', gap: 4,
                }}>
                  <AnimatedNumber value={Object.values(checked).filter(Boolean).length} duration={400} /> / {actions.length} done
                </span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {actions.map((a, i) => {
                  const done = !!checked[i]
                  const p = MEETING.participants.find(x => x.name === a.owner)
                  return (
                    <GlassCard key={i} glow glowColor="rgba(180,83,9,0.05)" style={{
                      display: 'flex', gap: 14, padding: '16px 18px', borderRadius: 14,
                      opacity: done ? 0.5 : 1, transition: 'all 300ms',
                      transform: done ? 'scale(0.98)' : 'scale(1)',
                    }}>
                      <button
                        onClick={() => setChecked(c => ({ ...c, [i]: !c[i] }))}
                        aria-label={done ? 'Mark incomplete' : 'Mark complete'}
                        style={{
                          width: 22, height: 22, borderRadius: 7, flexShrink: 0, marginTop: 1,
                          border: done ? 'none' : '2px solid #A8A29E',
                          background: done ? '#0A0A0A' : 'transparent', cursor: 'pointer',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          transition: 'all 200ms',
                          boxShadow: done ? '0 2px 8px rgba(0,0,0,0.15)' : 'none',
                        }}
                      >
                        {done && (
                          <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
                            <path d="M2.5 6.5L4.8 8.8L9.5 3.5" stroke="#FAFAF9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        )}
                      </button>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{
                          fontSize: 14, color: '#0A0A0A', margin: 0, fontWeight: 500,
                          letterSpacing: '-0.1px', lineHeight: 1.45,
                          textDecoration: done ? 'line-through' : 'none',
                        }}>{a.text}</p>
                        <div style={{ display: 'flex', gap: 10, marginTop: 7, alignItems: 'center', flexWrap: 'wrap' }}>
                          {p && (
                            <span style={{
                              fontSize: 11.5, fontWeight: 450,
                              display: 'inline-flex', alignItems: 'center', gap: 5,
                              padding: '2px 8px', background: `${p.color}10`,
                              borderRadius: 100, color: p.color,
                              border: `1px solid ${p.color}20`,
                            }}>
                              <span style={{
                                width: 14, height: 14, borderRadius: '50%',
                                background: p.color, color: 'white',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                fontSize: 7, fontWeight: 700,
                              }}>{p.initials}</span>
                              {a.owner}
                            </span>
                          )}
                          <span style={{
                            fontSize: 11.5, color: '#78716C',
                            display: 'inline-flex', alignItems: 'center', gap: 4,
                          }}>
                            <Clock size={10} strokeWidth={2} />{a.due}
                          </span>
                        </div>
                      </div>
                    </GlassCard>
                  )
                })}
              </div>
            </LiquidGlassCard>
          </Reveal>
        </div>
      </div>
    </section>
  )
}

/* ═══════════════════════════════════════════════════════════════════════════
   PRIVACY
   ═══════════════════════════════════════════════════════════════════════════ */

function Privacy() {
  const points = [
    { icon: <Lock size={16} strokeWidth={1.8} />, title: 'Private by default', desc: "Recordings and transcripts belong to the person who created them. Nothing is shared unless it's explicitly shared." },
    { icon: <Shield size={16} strokeWidth={1.8} />, title: 'Authenticated access', desc: 'Meeting data is gated behind account authentication. Only signed-in owners can access their recordings.' },
    { icon: <Users size={16} strokeWidth={1.8} />, title: 'Controlled sharing', desc: 'When you share a meeting summary, the recipient sees exactly what you chose to share — and nothing else.' },
    { icon: <Layers size={16} strokeWidth={1.8} />, title: 'Secure storage', desc: 'Meeting content is stored with modern cloud security practices, isolated per account.' },
  ]

  return (
    <section style={{
      padding: 'clamp(100px, 12vw, 160px) clamp(20px, 4vw, 32px)',
      position: 'relative',
    }}>
      <div style={{ maxWidth: 1000, margin: '0 auto', position: 'relative' }}>
        <Reveal>
          <div style={{ maxWidth: 640, marginBottom: 56 }}>
            <span style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              fontSize: 11.5, color: '#78716C', fontWeight: 500,
              textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 24,
              padding: '5px 12px', background: 'rgba(255,255,255,0.5)',
              backdropFilter: 'blur(8px)',
              border: '1px solid rgba(255,255,255,0.6)', borderRadius: 100,
            }}>
              <Shield size={10} strokeWidth={2.5} /> Privacy
            </span>
            <h2 style={{
              fontSize: 'clamp(30px, 4.5vw, 50px)', fontWeight: 600,
              letterSpacing: '-1.6px', lineHeight: 1.06, color: '#0A0A0A', margin: 0,
            }}>
              Your meetings are yours.<br />
              <span style={{ color: '#A8A29E' }}>That's the whole point.</span>
            </h2>
          </div>
        </Reveal>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 14 }}>
          {points.map((p, i) => (
            <Reveal key={p.title} delay={i * 60}>
              <GlassCard glow glowColor="rgba(10,10,10,0.03)" style={{
                padding: '28px 24px', height: '100%', borderRadius: 18,
              }}>
                <div style={{
                  width: 38, height: 38, borderRadius: 10,
                  background: '#0A0A0A',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: '#FAFAF9', marginBottom: 20,
                  boxShadow: '0 2px 10px rgba(0,0,0,0.15)',
                }}>{p.icon}</div>
                <h3 style={{ fontSize: 16, fontWeight: 600, color: '#0A0A0A', margin: '0 0 8px', letterSpacing: '-0.25px' }}>{p.title}</h3>
                <p style={{ fontSize: 14, color: '#57534E', lineHeight: 1.6, margin: 0, letterSpacing: '-0.05px' }}>{p.desc}</p>
              </GlassCard>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ═══════════════════════════════════════════════════════════════════════════
   PRICING
   ═══════════════════════════════════════════════════════════════════════════ */

function Pricing() {
  return (
    <section id="pricing" style={{
      padding: 'clamp(100px, 12vw, 160px) clamp(20px, 4vw, 32px)',
      position: 'relative',
    }}>
      <div style={{ maxWidth: 1000, margin: '0 auto', position: 'relative' }}>
        <Reveal>
          <div style={{ textAlign: 'center', marginBottom: 64 }}>
            <span style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              fontSize: 11.5, color: '#78716C', fontWeight: 500,
              textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 24,
              padding: '5px 12px', background: 'rgba(255,255,255,0.5)',
              backdropFilter: 'blur(8px)',
              border: '1px solid rgba(255,255,255,0.6)', borderRadius: 100,
            }}>Pricing</span>
            <h2 style={{
              fontSize: 'clamp(32px, 5vw, 58px)', fontWeight: 600,
              letterSpacing: '-2px', lineHeight: 1.04, color: '#0A0A0A', margin: '0 0 18px',
            }}>
              Build your memory layer.
            </h2>
            <p style={{ fontSize: 17, color: '#57534E', margin: 0, letterSpacing: '-0.1px', maxWidth: 520, marginInline: 'auto', lineHeight: 1.6 }}>
              Recall is free during early access. No credit card, no seat minimums, no per-meeting billing.
            </p>
          </div>
        </Reveal>

        <Reveal delay={100}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }} className="rc-pricing-grid">
            <LiquidGlassCard style={{ padding: 36 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
                <div>
                  <p style={{ fontSize: 14, fontWeight: 600, color: '#0A0A0A', margin: 0, letterSpacing: '-0.15px' }}>Early Access</p>
                  <p style={{ fontSize: 12.5, color: '#78716C', margin: '3px 0 0' }}>For individuals and teams</p>
                </div>
                <span style={{
                  fontSize: 10, fontWeight: 600, color: '#B45309',
                  background: 'rgba(180,83,9,0.1)', padding: '4px 10px', borderRadius: 100,
                  textTransform: 'uppercase', letterSpacing: '0.5px',
                  border: '1px solid rgba(180,83,9,0.2)',
                }}>Current</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 28 }}>
                <span style={{ fontSize: 52, fontWeight: 600, color: '#0A0A0A', letterSpacing: '-2.5px', lineHeight: 1 }}>Free</span>
                <span style={{ fontSize: 14, color: '#78716C' }}>during early access</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 32 }}>
                {['Unlimited meeting recording', 'Full transcript, summary, decisions & action items', 'Ask Recall across your meeting history', 'Calendar integration'].map(fe => (
                  <div key={fe} style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                    <div style={{
                      width: 18, height: 18, borderRadius: 5, background: '#0A0A0A',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                      boxShadow: '0 1px 4px rgba(0,0,0,0.1)',
                    }}>
                      <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
                        <path d="M2.5 6.5L4.8 8.8L9.5 3.5" stroke="#FAFAF9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                    <span style={{ fontSize: 14, color: '#292524', letterSpacing: '-0.05px' }}>{fe}</span>
                  </div>
                ))}
              </div>
              <Link href="/login" className="rc-cta-btn" style={{
                display: 'block', textAlign: 'center', padding: '14px 22px',
                background: 'linear-gradient(135deg, #0A0A0A, #262626)',
                color: '#FAFAF9', borderRadius: 12,
                fontSize: 15, fontWeight: 550, textDecoration: 'none', letterSpacing: '-0.1px',
                boxShadow: '0 4px 16px rgba(0,0,0,0.2), 0 0 0 0.5px rgba(255,255,255,0.1) inset',
              }}>Get started</Link>
            </LiquidGlassCard>

            <GlassCard style={{
              padding: 36, borderRadius: 24,
              border: '1px dashed rgba(10,10,10,0.12)',
              background: 'rgba(255,255,255,0.3)',
              display: 'flex', flexDirection: 'column',
            }}>
              <div style={{ marginBottom: 24 }}>
                <p style={{ fontSize: 14, fontWeight: 600, color: '#0A0A0A', margin: 0, letterSpacing: '-0.15px' }}>Team</p>
                <p style={{ fontSize: 12.5, color: '#78716C', margin: '3px 0 0' }}>For organizations</p>
              </div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 28 }}>
                <span style={{ fontSize: 52, fontWeight: 600, color: '#0A0A0A', letterSpacing: '-2.5px', lineHeight: 1 }}>Soon</span>
              </div>
              <p style={{ fontSize: 14.5, color: '#57534E', lineHeight: 1.6, margin: '0 0 auto', letterSpacing: '-0.05px' }}>
                Shared workspaces, team-wide search across meetings, and administrative controls are in development. Get started with early access today.
              </p>
              <div style={{ marginTop: 32, paddingTop: 22, borderTop: '1px solid rgba(10,10,10,0.06)' }}>
                <Link href="/login" style={{
                  display: 'inline-flex', alignItems: 'center', gap: 6,
                  fontSize: 14, fontWeight: 500, color: '#0A0A0A', textDecoration: 'none',
                  letterSpacing: '-0.05px',
                }} className="rc-ghost-link">
                  Start with early access <ArrowRight size={14} strokeWidth={2} />
                </Link>
              </div>
            </GlassCard>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

/* ═══════════════════════════════════════════════════════════════════════════
   FAQ
   ═══════════════════════════════════════════════════════════════════════════ */

function FAQ() {
  const items = [
    { q: 'What is Recall?', a: 'Recall is a meeting intelligence tool. It records your meetings, transcribes them, and turns each conversation into a structured record — with a summary, decisions, action items, and searchable topics.' },
    { q: 'How does meeting recording work?', a: 'You can capture meetings directly from Recall, or connect your calendar so scheduled meetings are captured automatically. Recall handles the transcription and processing afterward.' },
    { q: 'Can Recall summarize meetings?', a: 'Yes. After a meeting is captured, Recall produces a concise summary along with the key decisions and any action items that came out of the conversation.' },
    { q: 'Can I search across all of my meetings?', a: 'Yes. Full-text search runs across every transcript and summary in your workspace, so you can find the exact moment something was said.' },
    { q: 'What is Ask Recall?', a: "Ask Recall is a natural-language interface over your meeting history. Instead of scrubbing through recordings, you ask a question and get an answer with citations to the meetings it came from." },
    { q: 'Does Recall work with Google Calendar?', a: 'Yes. Connect your Google Calendar and Recall will surface your upcoming meetings and prepare to capture them automatically.' },
    { q: 'How is my meeting data handled?', a: 'Recordings and transcripts belong to the account that created them. Access is authenticated, and you decide what — if anything — to share with others.' },
  ]

  const [open, setOpen] = useState<number | null>(0)

  return (
    <section id="faq" style={{
      padding: 'clamp(100px, 12vw, 160px) clamp(20px, 4vw, 32px)',
      position: 'relative',
    }}>
      <div style={{ maxWidth: 860, margin: '0 auto', position: 'relative' }}>
        <Reveal>
          <div style={{ marginBottom: 56 }}>
            <span style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              fontSize: 11.5, color: '#78716C', fontWeight: 500,
              textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 24,
              padding: '5px 12px', background: 'rgba(255,255,255,0.5)',
              backdropFilter: 'blur(8px)',
              border: '1px solid rgba(255,255,255,0.6)', borderRadius: 100,
            }}>Questions</span>
            <h2 style={{
              fontSize: 'clamp(30px, 4.5vw, 50px)', fontWeight: 600,
              letterSpacing: '-1.6px', lineHeight: 1.06, color: '#0A0A0A', margin: 0,
            }}>
              Frequently asked.
            </h2>
          </div>
        </Reveal>

        <LiquidGlassCard style={{ overflow: 'hidden' }}>
          {items.map((it, i) => {
            const isOpen = open === i
            return (
              <div key={it.q} style={{
                borderBottom: i < items.length - 1 ? '1px solid rgba(255,255,255,0.3)' : 'none',
              }}>
                <button
                  onClick={() => setOpen(isOpen ? null : i)}
                  aria-expanded={isOpen}
                  className="rc-faq-btn"
                  style={{
                    width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '22px 28px', background: 'transparent', border: 'none',
                    cursor: 'pointer', textAlign: 'left', gap: 20,
                    transition: 'background 200ms',
                  }}
                >
                  <span style={{ fontSize: 15.5, fontWeight: 500, color: '#0A0A0A', letterSpacing: '-0.2px' }}>{it.q}</span>
                  <span style={{
                    width: 26, height: 26, borderRadius: 8,
                    background: 'rgba(255,255,255,0.5)', backdropFilter: 'blur(6px)',
                    border: '1px solid rgba(255,255,255,0.6)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: '#404040', flexShrink: 0, transition: 'transform 300ms cubic-bezier(0.16,1,0.3,1)',
                    transform: isOpen ? 'rotate(180deg)' : 'none',
                  }}>
                    {isOpen ? <Minus size={13} strokeWidth={2.2} /> : <Plus size={13} strokeWidth={2.2} />}
                  </span>
                </button>
                <div style={{
                  maxHeight: isOpen ? 400 : 0, overflow: 'hidden',
                  transition: 'max-height 400ms cubic-bezier(0.16,1,0.3,1)',
                }}>
                  <p style={{
                    fontSize: 14.5, color: '#57534E', lineHeight: 1.7,
                    margin: 0, padding: '0 28px 24px', letterSpacing: '-0.05px',
                    maxWidth: 680,
                  }}>{it.a}</p>
                </div>
              </div>
            )
          })}
        </LiquidGlassCard>
      </div>
    </section>
  )
}

/* ═══════════════════════════════════════════════════════════════════════════
   FINAL CTA
   ═══════════════════════════════════════════════════════════════════════════ */

function FinalCTA() {
  return (
    <section style={{
      padding: 'clamp(100px, 14vw, 180px) clamp(20px, 4vw, 32px)',
      background: '#0A0A0A', position: 'relative', overflow: 'hidden',
    }}>
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        background: `
          radial-gradient(60% 40% at 30% 50%, rgba(180,83,9,0.15), transparent 60%),
          radial-gradient(50% 50% at 70% 50%, rgba(15,118,110,0.1), transparent 60%)
        `,
      }} />

      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none', opacity: 0.03,
      }}>
        <svg style={{ width: '100%', height: '100%' }}>
          <defs>
            <pattern id="grid-dark" width="60" height="60" patternUnits="userSpaceOnUse">
              <path d="M 60 0 L 0 0 0 60" fill="none" stroke="#FAFAF9" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid-dark)" />
        </svg>
      </div>

      <div style={{ maxWidth: 800, margin: '0 auto', textAlign: 'center', position: 'relative' }}>
        <Reveal>
          <h2 style={{
            fontSize: 'clamp(40px, 6.5vw, 80px)', fontWeight: 600,
            letterSpacing: '-2.8px', lineHeight: 1.0, color: '#FAFAF9', margin: '0 0 26px',
          }}>
            Stop taking notes.<br />
            <span style={{
              background: 'linear-gradient(135deg, #D97706, #0D9488, #8B5CF6)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}>Start remembering.</span>
          </h2>
          <p style={{
            fontSize: 'clamp(16px, 1.9vw, 19px)',
            color: 'rgba(250,250,249,0.5)',
            lineHeight: 1.6, fontWeight: 400, letterSpacing: '-0.15px',
            maxWidth: 560, margin: '0 auto 48px',
          }}>
            Turn every conversation into something your team can find, understand, and act on.
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/login" className="rc-cta-btn-inverted" style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '16px 28px', background: '#FAFAF9', color: '#0A0A0A',
              borderRadius: 14, fontSize: 16, fontWeight: 550, textDecoration: 'none',
              letterSpacing: '-0.15px',
              boxShadow: '0 4px 16px rgba(250,250,249,0.15)',
              transition: 'transform 200ms, box-shadow 200ms',
            }}>
              Get started <ArrowRight size={16} strokeWidth={2.2} />
            </Link>
            <a href="#product" style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '16px 24px', background: 'rgba(255,255,255,0.06)',
              backdropFilter: 'blur(12px)',
              color: '#FAFAF9',
              border: '1px solid rgba(255,255,255,0.12)', borderRadius: 14,
              fontSize: 16, fontWeight: 500, textDecoration: 'none', letterSpacing: '-0.15px',
              transition: 'background 200ms',
            }} className="rc-ghost-btn-dark">
              Explore Recall
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

/* ═══════════════════════════════════════════════════════════════════════════
   FOOTER
   ═══════════════════════════════════════════════════════════════════════════ */

function Footer() {
  const groups = [
    {
      title: 'Product',
      links: [
        { label: 'Features', href: '#features' },
        { label: 'How it works', href: '#how' },
        { label: 'Pricing', href: '#pricing' },
      ],
    },
    {
      title: 'Company',
      links: [
        { label: 'About', href: '#product' },
        { label: 'Contact', href: '/login' },
      ],
    },
    {
      title: 'Resources',
      links: [
        { label: 'FAQ', href: '#faq' },
        { label: 'Privacy', href: '/privacy-policy' },
        { label: 'Terms', href: '/terms' },
      ],
    },
  ]

  return (
    <footer style={{
      padding: '72px clamp(20px, 4vw, 32px) 48px',
      background: '#FAFAF9',
      borderTop: '1px solid rgba(10,10,10,0.06)',
    }}>
      <div style={{ maxWidth: 1280, margin: '0 auto' }}>
        <div style={{
          display: 'grid', gridTemplateColumns: '1.8fr repeat(3, 1fr)', gap: 48,
        }} className="rc-footer-grid">
          <div>
            <Logo />
            <p style={{
              fontSize: 14, color: '#57534E', margin: '16px 0 0', maxWidth: 320,
              lineHeight: 1.6, letterSpacing: '-0.05px',
            }}>
              Meeting intelligence for people who can't afford to forget what happened.
            </p>
          </div>
          {groups.map(g => (
            <div key={g.title}>
              <p style={{
                fontSize: 11, fontWeight: 600, color: '#78716C',
                textTransform: 'uppercase', letterSpacing: '0.8px', margin: '0 0 16px',
              }}>{g.title}</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {g.links.map(l => (
                  l.href.startsWith('/') || l.href.startsWith('http') ? (
                    <Link key={l.label} href={l.href} className="rc-footer-link" style={{
                      fontSize: 13.5, color: '#57534E', textDecoration: 'none',
                      letterSpacing: '-0.05px', transition: 'color 200ms',
                    }}>{l.label}</Link>
                  ) : (
                    <a key={l.label} href={l.href} className="rc-footer-link" style={{
                      fontSize: 13.5, color: '#57534E', textDecoration: 'none',
                      letterSpacing: '-0.05px', transition: 'color 200ms',
                    }}>{l.label}</a>
                  )
                ))}
              </div>
            </div>
          ))}
        </div>
        <div style={{
          marginTop: 64, paddingTop: 28,
          borderTop: '1px solid rgba(10,10,10,0.06)',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          flexWrap: 'wrap', gap: 12,
        }}>
          <p style={{ fontSize: 12.5, color: '#78716C', margin: 0, letterSpacing: '-0.05px' }}>
            © {new Date().getFullYear()} Recall. All rights reserved.
          </p>
          <p style={{ fontSize: 12.5, color: '#A8A29E', margin: 0, letterSpacing: '-0.05px', fontStyle: 'italic' }}>
            Meeting intelligence, built quietly.
          </p>
        </div>
      </div>
    </footer>
  )
}

/* ═══════════════════════════════════════════════════════════════════════════
   GLOBAL CSS
   ═══════════════════════════════════════════════════════════════════════════ */

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;450;500;550;600;700&display=swap');

  * { box-sizing: border-box; }
  html { scroll-behavior: smooth; }
  html, body {
    margin: 0; background: #FAFAF9; color: #0A0A0A;
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Helvetica Neue', sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-rendering: optimizeLegibility;
    font-feature-settings: 'ss01', 'cv11';
  }

  @keyframes rc-fadein {
    from { opacity: 0; transform: translateY(8px); }
    to { opacity: 1; transform: none; }
  }

  @keyframes rc-dot {
    0%, 100% { opacity: 0.3; transform: scale(0.8); }
    50% { opacity: 1; transform: scale(1); }
  }
  .rc-dot { animation: rc-dot 1.1s cubic-bezier(0.16,1,0.3,1) infinite; }

  @keyframes rc-recording-pulse {
    0%, 100% { opacity: 1; transform: scale(1); }
    50% { opacity: 0.4; transform: scale(1.3); }
  }
  .rc-recording-dot { animation: rc-recording-pulse 1.8s cubic-bezier(0.4,0,0.6,1) infinite; }

  @keyframes rc-float-1 {
    0%, 100% { transform: translate(0, 0) scale(1); }
    33% { transform: translate(30px, -20px) scale(1.05); }
    66% { transform: translate(-15px, 15px) scale(0.95); }
  }
  @keyframes rc-float-2 {
    0%, 100% { transform: translate(0, 0) scale(1); }
    33% { transform: translate(-25px, 25px) scale(1.08); }
    66% { transform: translate(20px, -10px) scale(0.92); }
  }
  @keyframes rc-float-3 {
    0%, 100% { transform: translate(0, 0) scale(1); }
    33% { transform: translate(20px, 15px) scale(0.96); }
    66% { transform: translate(-30px, -20px) scale(1.04); }
  }
  .rc-orb-1 { animation: rc-float-1 20s ease-in-out infinite; }
  .rc-orb-2 { animation: rc-float-2 25s ease-in-out infinite; }
  .rc-orb-3 { animation: rc-float-3 22s ease-in-out infinite; }

  @keyframes rc-hero-gradient-shift {
    0% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
  }
  .rc-hero-gradient {
    animation: rc-hero-gradient-shift 6s ease-in-out infinite;
  }

  @keyframes rc-spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
  .rc-thinking-spinner {
    animation: rc-spin 0.8s linear infinite;
  }

  .rc-nav-link:hover { color: #0A0A0A !important; background: rgba(10,10,10,0.04); }
  .rc-cta-btn:hover { transform: translateY(-1px) !important; box-shadow: 0 6px 24px rgba(0,0,0,0.25), 0 0 0 0.5px rgba(255,255,255,0.1) inset !important; }
  .rc-cta-btn-large:hover { transform: translateY(-2px) !important; box-shadow: 0 8px 32px rgba(0,0,0,0.3), 0 0 0 0.5px rgba(255,255,255,0.15) inset, 0 1px 0 rgba(255,255,255,0.1) inset !important; }
  .rc-ghost-btn-large:hover { background: rgba(255,255,255,0.7) !important; border-color: rgba(255,255,255,0.9) !important; }
  .rc-ghost-btn-dark:hover { background: rgba(255,255,255,0.1) !important; }
  .rc-cta-btn-inverted:hover { transform: translateY(-2px) !important; box-shadow: 0 8px 32px rgba(250,250,249,0.25) !important; }
  .rc-tab:hover { background: rgba(255,255,255,0.4); color: #0A0A0A; }
  .rc-suggestion:hover { border-color: rgba(10,10,10,0.2) !important; background: rgba(255,255,255,0.7) !important; }
  .rc-feature-card:hover .rc-glass { background: rgba(255,255,255,0.6) !important; }
  .rc-footer-link:hover { color: #0A0A0A !important; }
  .rc-ghost-link:hover { opacity: 0.7; }
  .rc-transcript-line:hover { background: rgba(255,255,255,0.3); }
  .rc-topic-chip:hover { background: rgba(255,255,255,0.7) !important; }
  .rc-source-chip:hover { background: rgba(255,255,255,0.8) !important; }
  .rc-faq-btn:hover { background: rgba(255,255,255,0.2) !important; }

  *:focus-visible {
    outline: 2px solid #0A0A0A;
    outline-offset: 2px;
    border-radius: 4px;
  }

  @media (max-width: 900px) {
    .rc-nav-links, .rc-nav-cta { display: none !important; }
    .rc-menu-btn { display: inline-flex !important; }
    .rc-mobile-menu { display: flex !important; }
  }

  @media (max-width: 860px) {
    .rc-hero-body { grid-template-columns: 1fr !important; }
    .rc-hero-body > div:first-child { border-right: none !important; border-bottom: 1px solid rgba(255,255,255,0.3); }
    .rc-showcase-body { grid-template-columns: 1fr !important; }
    .rc-showcase-side { border-left: none !important; border-top: 1px solid rgba(255,255,255,0.3); }
    .rc-ask-grid, .rc-workflow-grid { grid-template-columns: 1fr !important; gap: 48px !important; }
    .rc-pricing-grid { grid-template-columns: 1fr !important; }
    .rc-stages { grid-template-columns: 1fr 1fr !important; gap: 28px !important; }
    .rc-stages > div { border-left: none !important; }
    .rc-summary-grid { grid-template-columns: 1fr !important; }
    .rc-footer-grid { grid-template-columns: 1fr 1fr !important; }
  }

  @media (max-width: 480px) {
    .rc-footer-grid { grid-template-columns: 1fr !important; gap: 36px !important; }
    .rc-stages { grid-template-columns: 1fr !important; }
  }

  @media (prefers-reduced-motion: reduce) {
    *, *::before, *::after {
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.01ms !important;
    }
    html { scroll-behavior: auto; }
    .rc-orb-1, .rc-orb-2, .rc-orb-3,
    .rc-hero-gradient,
    .rc-recording-dot,
    .rc-thinking-spinner { animation: none !important; }
  }

  ::selection {
    background: rgba(180,83,9,0.15);
    color: #0A0A0A;
  }

  ::-webkit-scrollbar {
    width: 8px;
  }
  ::-webkit-scrollbar-track {
    background: transparent;
  }
  ::-webkit-scrollbar-thumb {
    background: rgba(10,10,10,0.12);
    border-radius: 100px;
    border: 2px solid transparent;
    background-clip: content-box;
  }
  ::-webkit-scrollbar-thumb:hover {
    background: rgba(10,10,10,0.2);
    background-clip: content-box;
  }
`

/* ═══════════════════════════════════════════════════════════════════════════
   PAGE
   ═══════════════════════════════════════════════════════════════════════════ */

export default function LandingPage() {
  return (
    <>
      <style>{CSS}</style>
      <ScrollGradientBackground />
      <Nav />
      <main>
        <Hero />
        <TrustStrip />
        <Problem />
        <ProductShowcase />
        <HowItWorks />
        <Features />
        <AskRecall />
        <Workflow />
        <ActionItems />
        <Privacy />
        <Pricing />
        <FAQ />
        <FinalCTA />
      </main>
      <Footer />
    </>
  )
}