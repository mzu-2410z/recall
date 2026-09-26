'use client'

import { useEffect, useRef, useState, useCallback, useMemo, createContext, useContext } from 'react'
import Link from 'next/link'
import {
  Mic, FileText, Sparkles, CheckSquare, GitBranch, Hash, Search,
  MessageSquareText, Calendar, Clock, Lock, Share2, ArrowRight,
  Plus, Minus, Menu, X, Circle, Command, Zap, Eye, Brain,
  Layers, Shield, Users, ChevronRight, Play, Pause, ArrowUpRight,
  Globe, Headphones, Video, Upload, BarChart3, Target, Lightbulb,
  BookOpen, Timer, Bookmark, ExternalLink, ChevronDown, Star,
  MousePointer2, Wand2, Bot, Cpu, Network, Radio, Volume2
} from 'lucide-react'

/* ═══════════════════════════════════════════════════════════════════════════
   HOOKS & UTILITIES
   ═══════════════════════════════════════════════════════════════════════════ */

function useReveal<T extends HTMLElement = HTMLDivElement>(threshold = 0.08) {
  const ref = useRef<T>(null)
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect() } },
      { threshold, rootMargin: '0px 0px -40px 0px' }
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
      setProgress(Math.min(1, Math.max(0, d.scrollTop / (d.scrollHeight - d.clientHeight))))
    }
    window.addEventListener('scroll', h, { passive: true })
    h()
    return () => window.removeEventListener('scroll', h)
  }, [])
  return progress
}

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
    return () => { el.removeEventListener('mousemove', move); el.removeEventListener('mouseleave', leave) }
  }, [containerRef])
  return pos
}

function useTypingEffect(text: string, speed = 30, trigger = true) {
  const [displayed, setDisplayed] = useState('')
  const [done, setDone] = useState(false)
  useEffect(() => {
    if (!trigger) { setDisplayed(''); setDone(false); return }
    setDisplayed('')
    setDone(false)
    let i = 0
    const interval = setInterval(() => {
      i++
      setDisplayed(text.slice(0, i))
      if (i >= text.length) { clearInterval(interval); setDone(true) }
    }, speed)
    return () => clearInterval(interval)
  }, [text, speed, trigger])
  return { displayed, done }
}

function useCountUp(target: number, duration = 2000, trigger = true) {
  const [value, setValue] = useState(0)
  useEffect(() => {
    if (!trigger) return
    const start = performance.now()
    const step = (now: number) => {
      const p = Math.min(1, (now - start) / duration)
      const eased = 1 - Math.pow(1 - p, 4)
      setValue(Math.floor(eased * target))
      if (p < 1) requestAnimationFrame(step)
    }
    requestAnimationFrame(step)
  }, [target, duration, trigger])
  return value
}

function Reveal({ children, delay = 0, className = '' }: {
  children: React.ReactNode; delay?: number; className?: string
}) {
  const { ref, visible } = useReveal()
  return (
    <div ref={ref} className={className} style={{
      opacity: visible ? 1 : 0,
      transform: visible ? 'translateY(0) scale(1)' : 'translateY(28px) scale(0.99)',
      transition: `opacity 800ms cubic-bezier(0.16,1,0.3,1) ${delay}ms, transform 800ms cubic-bezier(0.16,1,0.3,1) ${delay}ms`,
    }}>{children}</div>
  )
}

function StaggerReveal({ children, stagger = 60, className = '' }: {
  children: React.ReactNode[]; stagger?: number; className?: string
}) {
  const { ref, visible } = useReveal()
  return (
    <div ref={ref} className={className}>
      {children.map((child, i) => (
        <div key={i} style={{
          opacity: visible ? 1 : 0,
          transform: visible ? 'translateY(0)' : 'translateY(20px)',
          transition: `opacity 700ms cubic-bezier(0.16,1,0.3,1) ${i * stagger}ms, transform 700ms cubic-bezier(0.16,1,0.3,1) ${i * stagger}ms`,
        }}>{child}</div>
      ))}
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════════════════
   SCROLL-SHIFTING BACKGROUND
   ═══════════════════════════════════════════════════════════════════════════ */

function ScrollGradientBackground() {
  const progress = useScrollProgress()
  const bg = useMemo(() => {
    const h1 = 30 + progress * 25
    const h2 = 170 + progress * 50
    const h3 = 270 + progress * 40
    const s1 = Math.sin(progress * Math.PI) * 20 + 20
    const s2 = Math.cos(progress * Math.PI * 1.5) * 15 + 25
    return {
      c1: `hsla(${h1}, 55%, 91%, ${0.5 + progress * 0.3})`,
      c2: `hsla(${h2}, 35%, 90%, ${0.25 + progress * 0.35})`,
      c3: `hsla(${h3}, 30%, 92%, ${0.2 + progress * 0.4})`,
      x1: 15 + progress * 55,
      y1: 8 + progress * 35,
      x2: 85 - progress * 55,
      y2: 55 + progress * 25,
      x3: 50 + s1,
      y3: 80 - progress * 45,
    }
  }, [progress])

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: -1, pointerEvents: 'none' }}>
      <div style={{
        position: 'absolute', inset: 0,
        background: `
          radial-gradient(ellipse 80% 55% at ${bg.x1}% ${bg.y1}%, ${bg.c1}, transparent 65%),
          radial-gradient(ellipse 65% 45% at ${bg.x2}% ${bg.y2}%, ${bg.c2}, transparent 65%),
          radial-gradient(ellipse 75% 50% at ${bg.x3}% ${bg.y3}%, ${bg.c3}, transparent 65%),
          linear-gradient(180deg, #FAF9F7 0%, #F6F5F3 40%, #F3F2EF 70%, #FAF9F7 100%)
        `,
        transition: 'background 50ms linear',
      }} />
      <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.018 }} aria-hidden>
        <defs>
          <pattern id="main-grid" width="52" height="52" patternUnits="userSpaceOnUse">
            <path d="M 52 0 L 0 0 0 52" fill="none" stroke="#1C1917" strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#main-grid)" />
      </svg>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════════════════
   PARTICLE CANVAS
   ═══════════════════════════════════════════════════════════════════════════ */

function ParticleField({ count = 50, color = '120, 113, 108', opacity = 0.5 }: { count?: number; color?: string; opacity?: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    let raf: number
    const resize = () => { canvas.width = canvas.offsetWidth * 2; canvas.height = canvas.offsetHeight * 2; ctx.scale(2, 2) }
    resize()
    window.addEventListener('resize', resize)
    const particles = Array.from({ length: count }, () => ({
      x: Math.random() * canvas.offsetWidth,
      y: Math.random() * canvas.offsetHeight,
      vx: (Math.random() - 0.5) * 0.25,
      vy: (Math.random() - 0.5) * 0.25,
      size: Math.random() * 2 + 0.5,
      o: Math.random() * 0.12 + 0.03,
      life: Math.random() * 1000,
    }))
    const animate = () => {
      const w = canvas.offsetWidth, h = canvas.offsetHeight
      ctx.clearRect(0, 0, w, h)
      particles.forEach(p => {
        p.x += p.vx; p.y += p.vy; p.life += 0.008
        if (p.x < 0) p.x = w; if (p.x > w) p.x = 0
        if (p.y < 0) p.y = h; if (p.y > h) p.y = 0
        const flicker = Math.sin(p.life) * 0.5 + 0.5
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(${color}, ${p.o * flicker})`
        ctx.fill()
      })
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x, dy = particles[i].y - particles[j].y
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < 100) {
            ctx.beginPath()
            ctx.moveTo(particles[i].x, particles[i].y)
            ctx.lineTo(particles[j].x, particles[j].y)
            ctx.strokeStyle = `rgba(${color}, ${0.035 * (1 - dist / 100)})`
            ctx.lineWidth = 0.5
            ctx.stroke()
          }
        }
      }
      raf = requestAnimationFrame(animate)
    }
    animate()
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', resize) }
  }, [count, color])
  return <canvas ref={canvasRef} aria-hidden style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', opacity }} />
}

/* ═══════════════════════════════════════════════════════════════════════════
   FLOATING ORBS
   ═══════════════════════════════════════════════════════════════════════════ */

function FloatingOrbs({ variant = 'warm' }: { variant?: 'warm' | 'cool' | 'mixed' }) {
  const colors = variant === 'warm'
    ? ['rgba(180,83,9,0.12)', 'rgba(217,119,6,0.08)', 'rgba(245,158,11,0.06)']
    : variant === 'cool'
    ? ['rgba(15,118,110,0.1)', 'rgba(20,184,166,0.07)', 'rgba(124,58,237,0.06)']
    : ['rgba(180,83,9,0.1)', 'rgba(15,118,110,0.08)', 'rgba(124,58,237,0.06)']

  return (
    <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden' }} aria-hidden>
      {colors.map((c, i) => (
        <div key={i} className={`rc-orb rc-orb-${i + 1}`} style={{
          position: 'absolute',
          top: `${15 + i * 25}%`,
          left: i === 1 ? 'auto' : `${5 + i * 30}%`,
          right: i === 1 ? '5%' : 'auto',
          width: 200 + i * 60, height: 200 + i * 60,
          borderRadius: '50%',
          background: `radial-gradient(circle, ${c}, transparent 70%)`,
          filter: `blur(${40 + i * 15}px)`,
        }} />
      ))}
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════════════════
   GLASS & LIQUID GLASS COMPONENTS
   ═══════════════════════════════════════════════════════════════════════════ */

function GlassCard({ children, className = '', style = {}, glow = false, glowColor = 'rgba(180,83,9,0.08)', hoverLift = false, ...rest }: {
  children: React.ReactNode; className?: string; style?: React.CSSProperties;
  glow?: boolean; glowColor?: string; hoverLift?: boolean;
  [key: string]: unknown;
}) {
  const containerRef = useRef<HTMLDivElement>(null)
  const mouse = useMousePosition(containerRef)
  return (
    <div ref={containerRef} className={`rc-glass ${hoverLift ? 'rc-hover-lift' : ''} ${className}`} style={{
      position: 'relative',
      background: 'rgba(255,255,255,0.42)',
      backdropFilter: 'blur(24px) saturate(180%)',
      WebkitBackdropFilter: 'blur(24px) saturate(180%)',
      border: '1px solid rgba(255,255,255,0.6)',
      borderRadius: 20,
      boxShadow: '0 0 0 0.5px rgba(255,255,255,0.4) inset, 0 8px 32px -8px rgba(0,0,0,0.06), 0 2px 8px rgba(0,0,0,0.03)',
      overflow: 'hidden',
      transition: 'transform 300ms cubic-bezier(0.16,1,0.3,1), box-shadow 300ms cubic-bezier(0.16,1,0.3,1)',
      ...style,
    }} {...rest}>
      {glow && mouse.active && (
        <div style={{
          position: 'absolute', top: mouse.y - 160, left: mouse.x - 160,
          width: 320, height: 320,
          background: `radial-gradient(circle, ${glowColor}, transparent 65%)`,
          pointerEvents: 'none', zIndex: 0, transition: 'opacity 300ms', opacity: 1,
        }} />
      )}
      <div style={{ position: 'relative', zIndex: 1 }}>{children}</div>
    </div>
  )
}

function LiquidGlass({ children, className = '', style = {}, ...rest }: {
  children: React.ReactNode; className?: string; style?: React.CSSProperties;
  [key: string]: unknown;
}) {
  const containerRef = useRef<HTMLDivElement>(null)
  const mouse = useMousePosition(containerRef)
  return (
    <div ref={containerRef} className={`rc-liquid-glass ${className}`} style={{
      position: 'relative',
      background: `linear-gradient(135deg, rgba(255,255,255,0.65) 0%, rgba(255,255,255,0.3) 40%, rgba(255,255,255,0.45) 60%, rgba(255,255,255,0.65) 100%)`,
      backdropFilter: 'blur(40px) saturate(200%)',
      WebkitBackdropFilter: 'blur(40px) saturate(200%)',
      border: '1px solid rgba(255,255,255,0.7)',
      borderRadius: 24,
      boxShadow: '0 0 0 0.5px rgba(255,255,255,0.5) inset, 0 0 40px rgba(255,255,255,0.25) inset, 0 20px 60px -15px rgba(0,0,0,0.08), 0 4px 16px rgba(0,0,0,0.03)',
      overflow: 'hidden',
      ...style,
    }} {...rest}>
      {mouse.active && (
        <div style={{
          position: 'absolute', top: mouse.y - 220, left: mouse.x - 220,
          width: 440, height: 440,
          background: 'radial-gradient(circle, rgba(255,255,255,0.45) 0%, rgba(255,255,255,0.15) 30%, transparent 55%)',
          pointerEvents: 'none', zIndex: 0, filter: 'blur(20px)',
        }} />
      )}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0, background: 'linear-gradient(135deg, rgba(255,255,255,0.25) 0%, transparent 50%), linear-gradient(315deg, rgba(255,255,255,0.12) 0%, transparent 50%)' }} />
      <div style={{ position: 'relative', zIndex: 1 }}>{children}</div>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════════════════
   BADGE COMPONENT
   ═══════════════════════════════════════════════════════════════════════════ */

function SectionBadge({ children, dotColor = '#B45309' }: { children: React.ReactNode; dotColor?: string }) {
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 7,
      fontSize: 11, color: '#78716C', fontWeight: 550,
      textTransform: 'uppercase', letterSpacing: '1.2px', marginBottom: 26,
      padding: '6px 14px', background: 'rgba(255,255,255,0.5)',
      backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.65)', borderRadius: 100,
      boxShadow: '0 1px 4px rgba(0,0,0,0.03)',
    }}>
      <span style={{ width: 5, height: 5, borderRadius: '50%', background: dotColor, boxShadow: `0 0 6px ${dotColor}60` }} />
      {children}
    </span>
  )
}

/* ═══════════════════════════════════════════════════════════════════════════
   CTA BUTTON COMPONENTS
   ═══════════════════════════════════════════════════════════════════════════ */

function PrimaryCTA({ children, href = '/login', large = false, icon = true }: { children: React.ReactNode; href?: string; large?: boolean; icon?: boolean }) {
  return (
    <Link href={href} className="rc-cta-primary" style={{
      display: 'inline-flex', alignItems: 'center', gap: 8,
      padding: large ? '16px 30px' : '13px 22px',
      background: 'linear-gradient(135deg, #0A0A0A 0%, #1C1917 50%, #292524 100%)',
      color: '#FAF9F7', borderRadius: large ? 16 : 12,
      fontSize: large ? 16 : 14.5, fontWeight: 550, textDecoration: 'none',
      letterSpacing: '-0.15px',
      boxShadow: `0 1px 0 rgba(255,255,255,0.06) inset, 0 4px 16px rgba(0,0,0,0.2), 0 1px 3px rgba(0,0,0,0.1)`,
      transition: 'all 250ms cubic-bezier(0.16,1,0.3,1)',
      position: 'relative', overflow: 'hidden',
    }}>
      <span style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(255,255,255,0.08) 0%, transparent 50%)', pointerEvents: 'none' }} />
      <span style={{ position: 'relative' }}>{children}</span>
      {icon && <ArrowRight size={large ? 17 : 15} strokeWidth={2.2} style={{ position: 'relative' }} />}
    </Link>
  )
}

function SecondaryCTA({ children, href = '#how', large = false }: { children: React.ReactNode; href?: string; large?: boolean }) {
  return (
    <a href={href} className="rc-cta-secondary" style={{
      display: 'inline-flex', alignItems: 'center', gap: 8,
      padding: large ? '16px 26px' : '13px 20px',
      background: 'rgba(255,255,255,0.5)', backdropFilter: 'blur(14px)',
      color: '#1C1917', border: '1px solid rgba(255,255,255,0.7)',
      borderRadius: large ? 16 : 12,
      fontSize: large ? 16 : 14.5, fontWeight: 500, textDecoration: 'none',
      letterSpacing: '-0.15px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.04), 0 0 0 0.5px rgba(255,255,255,0.4) inset',
      transition: 'all 250ms cubic-bezier(0.16,1,0.3,1)',
    }}>{children}</a>
  )
}

function MiniCTA({ children, href = '/login' }: { children: React.ReactNode; href?: string }) {
  return (
    <Link href={href} className="rc-cta-mini" style={{
      display: 'inline-flex', alignItems: 'center', gap: 6,
      padding: '9px 16px', background: 'rgba(255,255,255,0.5)', backdropFilter: 'blur(10px)',
      border: '1px solid rgba(255,255,255,0.6)', borderRadius: 100,
      fontSize: 13, fontWeight: 500, color: '#292524', textDecoration: 'none',
      letterSpacing: '-0.05px', transition: 'all 200ms',
    }}>{children} <ArrowRight size={12} strokeWidth={2.2} /></Link>
  )
}

/* ═══════════════════════════════════════════════════════════════════════════
   DATA
   ═══════════════════════════════════════════════════════════════════════════ */

const PARTICIPANTS = [
  { name: 'Sarah Chen', initials: 'SC', color: '#B45309', role: 'Product Lead' },
  { name: 'Daniel Ortiz', initials: 'DO', color: '#0F766E', role: 'Engineering' },
  { name: 'Priya Menon', initials: 'PM', color: '#7C3AED', role: 'Design Lead' },
  { name: 'James Ward', initials: 'JW', color: '#BE185D', role: 'Backend' },
]

const TRANSCRIPT = [
  { speaker: 'Sarah Chen', time: '00:42', text: "Let's start with the onboarding flow. We're seeing a 34% drop-off at the workspace creation step." },
  { speaker: 'Daniel Ortiz', time: '01:15', text: "I looked at the funnel yesterday. The main issue is we're asking for too much information upfront. We should defer the team invite step until after the first meeting is captured." },
  { speaker: 'Priya Menon', time: '02:03', text: "Agreed. I can have a redesigned flow ready by Friday. Should we A/B test it or ship to everyone?" },
  { speaker: 'Sarah Chen', time: '02:28', text: "Ship to everyone. Our sample size is too small for meaningful A/B tests right now." },
  { speaker: 'James Ward', time: '03:11', text: "On the API side, we need to review the rate limiting before we open up the public endpoints. I'll put together a proposal by Monday." },
  { speaker: 'Daniel Ortiz', time: '03:58', text: "Good call. We should also document the webhook payloads before we go live. I'll add it to the sprint." },
  { speaker: 'Priya Menon', time: '04:22', text: "For the redesign, I'm thinking we reduce it to three steps: create workspace, connect calendar, and capture first meeting." },
]

const SUMMARY_TEXT = "The team reviewed Q4 priorities with a focus on onboarding conversion and API readiness. A 34% drop-off at workspace creation is the highest-priority fix. The team agreed to ship a redesigned flow directly rather than run an A/B test. API rate limiting was flagged as a blocker for the public endpoint launch."

const DECISIONS = [
  'Ship redesigned onboarding to all users — skip A/B test given sample size',
  'Defer team invite step until after first meeting is captured',
  'Public API launch blocked until rate limiting proposal is approved',
  'Reduce onboarding to three steps: workspace, calendar, first meeting',
]

const ACTIONS = [
  { text: 'Redesign onboarding flow with deferred invite step', owner: 'Priya Menon', due: 'Fri, Nov 15', done: false },
  { text: 'Draft API rate limiting proposal', owner: 'James Ward', due: 'Mon, Nov 18', done: false },
  { text: 'Review onboarding funnel metrics weekly', owner: 'Daniel Ortiz', due: 'Ongoing', done: false },
  { text: 'Document webhook payloads before go-live', owner: 'Daniel Ortiz', due: 'Wed, Nov 20', done: false },
  { text: 'Schedule design review for onboarding v2', owner: 'Priya Menon', due: 'Thu, Nov 21', done: false },
]

const TOPICS = ['Onboarding', 'Conversion', 'API Design', 'Rate Limiting', 'Q4 Priorities', 'Webhooks']

/* ═══════════════════════════════════════════════════════════════════════════
   LOGO
   ═══════════════════════════════════════════════════════════════════════════ */

function Logo({ dark = false }: { dark?: boolean }) {
  const fg = dark ? '#FAF9F7' : '#0A0A0A'
  const bg = dark ? 'rgba(255,255,255,0.08)' : 'rgba(10,10,10,0.03)'
  const border = dark ? 'rgba(255,255,255,0.12)' : 'rgba(10,10,10,0.06)'
  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 9 }}>
      <div style={{
        width: 30, height: 30, borderRadius: 9,
        background: bg, backdropFilter: 'blur(8px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        border: `1px solid ${border}`,
      }}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
          <circle cx="12" cy="12" r="7.5" stroke={fg} strokeWidth="1.5" />
          <circle cx="12" cy="12" r="2.5" fill={fg} />
          <circle cx="12" cy="12" r="11" stroke={fg} strokeWidth="0.5" opacity="0.25" strokeDasharray="2.5 2.5" />
        </svg>
      </div>
      <span style={{ fontSize: 18, fontWeight: 600, color: fg, letterSpacing: '-0.45px' }}>Recall</span>
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
    const h = () => setScrolled(window.scrollY > 12)
    h(); window.addEventListener('scroll', h, { passive: true })
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
        padding: scrolled ? '0 clamp(16px, 3vw, 24px)' : '10px clamp(16px, 3vw, 24px)',
        transition: 'all 400ms cubic-bezier(0.16,1,0.3,1)',
      }}>
        <div style={{
          maxWidth: 1320, margin: '0 auto',
          background: scrolled ? 'rgba(255,255,255,0.55)' : 'rgba(255,255,255,0.25)',
          backdropFilter: 'blur(28px) saturate(200%)',
          WebkitBackdropFilter: 'blur(28px) saturate(200%)',
          border: `1px solid ${scrolled ? 'rgba(255,255,255,0.7)' : 'rgba(255,255,255,0.35)'}`,
          borderRadius: scrolled ? 14 : 20,
          boxShadow: scrolled
            ? '0 4px 24px rgba(0,0,0,0.06), 0 1px 4px rgba(0,0,0,0.03), 0 0 0 0.5px rgba(255,255,255,0.5) inset'
            : '0 2px 12px rgba(0,0,0,0.02)',
          padding: '0 clamp(16px, 3vw, 24px)',
          height: scrolled ? 52 : 58,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          transition: 'all 400ms cubic-bezier(0.16,1,0.3,1)',
        }}>
          <Link href="/" style={{ textDecoration: 'none' }} aria-label="Recall home"><Logo /></Link>
          <div className="rc-nav-links" style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            {links.map(l => (
              <a key={l.href} href={l.href} className="rc-nav-link" style={{
                fontSize: 13, fontWeight: 450, color: '#44403C', textDecoration: 'none',
                padding: '7px 13px', borderRadius: 8, letterSpacing: '-0.1px', transition: 'all 200ms',
              }}>{l.label}</a>
            ))}
          </div>
          <div className="rc-nav-cta" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <Link href="/login" className="rc-nav-link" style={{
              fontSize: 13, fontWeight: 450, color: '#44403C', textDecoration: 'none',
              padding: '7px 14px', borderRadius: 8,
            }}>Sign in</Link>
            <Link href="/login" className="rc-cta-primary" style={{
              fontSize: 13, fontWeight: 550, color: '#FAF9F7', textDecoration: 'none',
              padding: '8px 16px', background: 'linear-gradient(135deg, #0A0A0A, #292524)', borderRadius: 10,
              letterSpacing: '-0.1px', display: 'inline-flex', alignItems: 'center', gap: 5,
              boxShadow: '0 2px 8px rgba(0,0,0,0.15), 0 0 0 0.5px rgba(255,255,255,0.06) inset',
              transition: 'all 200ms',
            }}>Get started <ArrowRight size={12} strokeWidth={2.5} /></Link>
          </div>
          <button className="rc-menu-btn" onClick={() => setMenuOpen(v => !v)} aria-label="Toggle menu" aria-expanded={menuOpen}
            style={{ display: 'none', background: 'transparent', border: 'none', padding: 8, cursor: 'pointer', color: '#0A0A0A' }}>
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </nav>
      {menuOpen && (
        <div className="rc-mobile-menu" style={{
          position: 'fixed', inset: 0, zIndex: 99,
          background: 'rgba(255,255,255,0.92)', backdropFilter: 'blur(40px) saturate(200%)',
          padding: '96px 28px 28px', display: 'none', flexDirection: 'column', gap: 4,
          animation: 'rc-fadein 300ms cubic-bezier(0.16,1,0.3,1)',
        }}>
          {links.map(l => (
            <a key={l.href} href={l.href} onClick={() => setMenuOpen(false)} style={{
              fontSize: 24, fontWeight: 500, color: '#0A0A0A', textDecoration: 'none',
              padding: '18px 4px', borderBottom: '1px solid rgba(10,10,10,0.06)', letterSpacing: '-0.5px',
            }}>{l.label}</a>
          ))}
          <div style={{ marginTop: 28, display: 'flex', flexDirection: 'column', gap: 10 }}>
            <Link href="/login" onClick={() => setMenuOpen(false)} style={{
              fontSize: 16, fontWeight: 500, color: '#0A0A0A', textDecoration: 'none',
              padding: '15px 20px', border: '1px solid rgba(10,10,10,0.1)', borderRadius: 14, textAlign: 'center',
            }}>Sign in</Link>
            <Link href="/login" onClick={() => setMenuOpen(false)} style={{
              fontSize: 16, fontWeight: 550, color: '#FAF9F7', textDecoration: 'none',
              padding: '15px 20px', background: '#0A0A0A', borderRadius: 14, textAlign: 'center',
            }}>Get started free</Link>
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
  const mouse = useMousePosition(containerRef)
  const [activeTab, setActiveTab] = useState<'transcript' | 'summary'>('summary')

  return (
    <div ref={containerRef} style={{ position: 'relative', maxWidth: 1120, margin: '0 auto' }}>
      <div style={{
        position: 'absolute', inset: '-80px -60px', pointerEvents: 'none',
        background: 'radial-gradient(50% 35% at 30% 55%, rgba(180,83,9,0.1), transparent 70%), radial-gradient(40% 40% at 75% 40%, rgba(15,118,110,0.08), transparent 70%)',
        filter: 'blur(50px)',
      }} />
      <LiquidGlass style={{ position: 'relative' }}>
        {mouse.active && <div style={{ position: 'absolute', top: mouse.y - 250, left: mouse.x - 250, width: 500, height: 500, background: 'radial-gradient(circle, rgba(180,83,9,0.05), transparent 55%)', pointerEvents: 'none', zIndex: 0, filter: 'blur(40px)' }} />}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 8, padding: '12px 18px',
          background: 'rgba(255,255,255,0.35)', backdropFilter: 'blur(12px)',
          borderBottom: '1px solid rgba(255,255,255,0.45)',
        }}>
          <div style={{ display: 'flex', gap: 6 }}>
            {['#E7E5E4', '#E7E5E4', '#E7E5E4'].map((c, i) => <span key={i} style={{ width: 10, height: 10, borderRadius: '50%', background: c }} />)}
          </div>
          <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '5px 16px', background: 'rgba(255,255,255,0.55)', backdropFilter: 'blur(8px)',
              border: '1px solid rgba(255,255,255,0.7)', borderRadius: 8,
              fontSize: 12, color: '#57534E', fontWeight: 450,
            }}>
              <span className="rc-pulse-dot" style={{ width: 6, height: 6, borderRadius: '50%', background: '#B45309' }} />
              Q4 Roadmap Review · 42 min
            </div>
          </div>
          <div style={{ display: 'flex', gap: 3 }}>
            {['transcript', 'summary'].map(t => (
              <button key={t} onClick={() => setActiveTab(t as 'transcript' | 'summary')} className="rc-mini-tab" style={{
                padding: '4px 10px', borderRadius: 6, border: 'none', cursor: 'pointer',
                background: activeTab === t ? 'rgba(255,255,255,0.6)' : 'transparent',
                color: activeTab === t ? '#0A0A0A' : '#78716C',
                fontSize: 11, fontWeight: activeTab === t ? 550 : 420, textTransform: 'capitalize',
                backdropFilter: activeTab === t ? 'blur(6px)' : 'none',
                boxShadow: activeTab === t ? '0 1px 3px rgba(0,0,0,0.04)' : 'none',
                transition: 'all 200ms',
              }}>{t}</button>
            ))}
          </div>
        </div>
        <div className="rc-hero-body" style={{ display: 'grid', gridTemplateColumns: '1.3fr 1fr', minHeight: 500 }}>
          <div style={{ padding: '24px 28px', borderRight: '1px solid rgba(255,255,255,0.35)', position: 'relative', overflow: 'hidden' }}>
            {activeTab === 'transcript' ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16, animation: 'rc-fadein 400ms ease' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
                  <span style={{ fontSize: 10.5, fontWeight: 600, color: '#78716C', textTransform: 'uppercase', letterSpacing: '0.8px' }}>Live Transcript</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <WaveformBars />
                    <span style={{ fontSize: 10.5, color: '#78716C' }}>{PARTICIPANTS.length} speakers</span>
                  </div>
                </div>
                {TRANSCRIPT.slice(0, 5).map((seg, i) => {
                  const p = PARTICIPANTS.find(x => x.name === seg.speaker)!
                  return (
                    <div key={i} className="rc-transcript-line" style={{ display: 'flex', gap: 12, padding: '10px 12px', borderRadius: 12, transition: 'background 200ms' }}>
                      <div style={{ flexShrink: 0, width: 26, height: 26, borderRadius: '50%', background: `${p.color}15`, color: p.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 9, fontWeight: 700, border: `1.5px solid ${p.color}25` }}>{p.initials}</div>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', gap: 7, alignItems: 'baseline', marginBottom: 3 }}>
                          <span style={{ fontSize: 12.5, fontWeight: 550, color: '#0A0A0A' }}>{seg.speaker}</span>
                          <span style={{ fontSize: 10.5, color: '#A8A29E', fontVariantNumeric: 'tabular-nums' }}>{seg.time}</span>
                        </div>
                        <p style={{ fontSize: 13, color: '#44403C', lineHeight: 1.6, margin: 0 }}>{seg.text}</p>
                      </div>
                    </div>
                  )
                })}
              </div>
            ) : (
              <div style={{ animation: 'rc-fadein 400ms ease' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 16 }}>
                  <div style={{ width: 20, height: 20, borderRadius: 6, background: 'linear-gradient(135deg, #B45309, #D97706)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 6px rgba(180,83,9,0.25)' }}>
                    <Sparkles size={10} color="white" strokeWidth={2.5} />
                  </div>
                  <span style={{ fontSize: 11, fontWeight: 600, color: '#78716C', textTransform: 'uppercase', letterSpacing: '0.7px' }}>AI Summary</span>
                </div>
                <p style={{ fontSize: 13.5, color: '#292524', lineHeight: 1.7, margin: '0 0 22px' }}>{SUMMARY_TEXT}</p>
                <div style={{ display: 'flex', gap: 12, marginBottom: 22 }}>
                  {[{ label: 'Decisions', count: DECISIONS.length, icon: <GitBranch size={12} color="#0F766E" />, color: '#0F766E' },
                    { label: 'Actions', count: ACTIONS.length, icon: <CheckSquare size={12} color="#B45309" />, color: '#B45309' }].map(c => (
                    <GlassCard key={c.label} style={{ padding: '14px 16px', borderRadius: 12, flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: 6 }}>
                        {c.icon}
                        <span style={{ fontSize: 10, fontWeight: 600, color: '#78716C', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{c.label}</span>
                      </div>
                      <span style={{ fontSize: 24, fontWeight: 600, color: '#0A0A0A', letterSpacing: '-0.8px' }}>{c.count}</span>
                    </GlassCard>
                  ))}
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
                  {TOPICS.map(t => (
                    <span key={t} style={{ fontSize: 11, padding: '4px 9px', background: 'rgba(255,255,255,0.5)', backdropFilter: 'blur(6px)', color: '#57534E', borderRadius: 6, fontWeight: 450, border: '1px solid rgba(255,255,255,0.6)' }}>
                      <Hash size={8} strokeWidth={2.5} style={{ display: 'inline', verticalAlign: '-1px', marginRight: 2 }} />{t}
                    </span>
                  ))}
                </div>
              </div>
            )}
            <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 80, background: 'linear-gradient(transparent, rgba(255,255,255,0.7))', backdropFilter: 'blur(2px)', pointerEvents: 'none' }} />
          </div>
          <div style={{ padding: '24px 24px', background: 'rgba(255,255,255,0.2)', display: 'flex', flexDirection: 'column', gap: 18, overflow: 'hidden', position: 'relative' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 12 }}>
                <GitBranch size={12} strokeWidth={2.2} color="#0F766E" />
                <span style={{ fontSize: 10.5, fontWeight: 600, color: '#78716C', textTransform: 'uppercase', letterSpacing: '0.7px' }}>Decisions</span>
              </div>
              {DECISIONS.slice(0, 3).map((d, i) => (
                <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
                  <div style={{ width: 5, height: 5, borderRadius: '50%', background: '#0F766E', flexShrink: 0, marginTop: 7 }} />
                  <p style={{ fontSize: 12.5, color: '#292524', margin: 0, lineHeight: 1.55 }}>{d}</p>
                </div>
              ))}
            </div>
            <div style={{ height: 1, background: 'rgba(10,10,10,0.05)' }} />
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 12 }}>
                <CheckSquare size={12} strokeWidth={2.2} color="#B45309" />
                <span style={{ fontSize: 10.5, fontWeight: 600, color: '#78716C', textTransform: 'uppercase', letterSpacing: '0.7px' }}>Action Items</span>
              </div>
              {ACTIONS.slice(0, 3).map((a, i) => {
                const p = PARTICIPANTS.find(x => x.name === a.owner)!
                return (
                  <div key={i} style={{ display: 'flex', gap: 10, marginBottom: 10 }}>
                    <div style={{ width: 14, height: 14, borderRadius: 4, border: '1.5px solid #A8A29E', flexShrink: 0, marginTop: 2 }} />
                    <div>
                      <p style={{ fontSize: 12.5, color: '#0A0A0A', margin: 0, fontWeight: 500, lineHeight: 1.4 }}>{a.text}</p>
                      <div style={{ display: 'flex', gap: 8, marginTop: 3, alignItems: 'center' }}>
                        <span style={{ width: 14, height: 14, borderRadius: '50%', background: `${p.color}15`, color: p.color, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 7, fontWeight: 700 }}>{p.initials}</span>
                        <span style={{ fontSize: 11, color: '#78716C' }}>{a.owner} · {a.due}</span>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
            <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 60, background: 'linear-gradient(transparent, rgba(255,255,255,0.4))', pointerEvents: 'none' }} />
          </div>
        </div>
      </LiquidGlass>
    </div>
  )
}

function WaveformBars() {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 2, height: 16 }}>
      {[0.4, 0.7, 1, 0.5, 0.85, 0.6, 0.95, 0.5, 0.75].map((h, i) => (
        <span key={i} className="rc-wave-bar" style={{ width: 2, height: `${h * 100}%`, background: '#B45309', borderRadius: 1, opacity: 0.6, animationDelay: `${i * 0.08}s` }} />
      ))}
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════════════════
   HERO
   ═══════════════════════════════════════════════════════════════════════════ */

function Hero() {
  const [mounted, setMounted] = useState(false)
  useEffect(() => { const t = setTimeout(() => setMounted(true), 60); return () => clearTimeout(t) }, [])
  const f = (d: number) => ({
    opacity: mounted ? 1 : 0,
    transform: mounted ? 'translateY(0) scale(1)' : 'translateY(22px) scale(0.99)',
    transition: `opacity 900ms cubic-bezier(0.16,1,0.3,1) ${d}ms, transform 900ms cubic-bezier(0.16,1,0.3,1) ${d}ms`,
  })

  return (
    <section style={{ paddingTop: 'clamp(130px, 18vw, 200px)', paddingBottom: 'clamp(60px, 8vw, 100px)', position: 'relative', overflow: 'hidden' }}>
      <FloatingOrbs variant="mixed" />
      <ParticleField count={45} />
      <div style={{ position: 'absolute', top: '-15%', right: '-8%', width: 700, height: 700, background: 'radial-gradient(circle, rgba(180,83,9,0.06), transparent 55%)', filter: 'blur(80px)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: '-20%', left: '-10%', width: 600, height: 600, background: 'radial-gradient(circle, rgba(15,118,110,0.05), transparent 55%)', filter: 'blur(70px)', pointerEvents: 'none' }} />

      <div style={{ maxWidth: 1320, margin: '0 auto', padding: '0 clamp(20px, 4vw, 32px)', position: 'relative' }}>
        <div style={{ maxWidth: 880, margin: '0 auto', textAlign: 'center' }}>
          <div style={f(0)}>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 9,
              padding: '6px 16px 6px 8px',
              background: 'rgba(255,255,255,0.5)', backdropFilter: 'blur(14px)',
              border: '1px solid rgba(255,255,255,0.7)', borderRadius: 100, marginBottom: 36,
              boxShadow: '0 2px 10px rgba(0,0,0,0.04), 0 0 0 0.5px rgba(255,255,255,0.4) inset',
            }}>
              <span style={{ fontSize: 10, fontWeight: 650, color: '#B45309', background: 'rgba(180,83,9,0.1)', padding: '3px 9px', borderRadius: 100, textTransform: 'uppercase', letterSpacing: '0.6px' }}>New</span>
              <span style={{ fontSize: 13, color: '#44403C', fontWeight: 450, letterSpacing: '-0.1px' }}>Ask Recall — query your meeting history in natural language</span>
              <ArrowRight size={13} color="#78716C" strokeWidth={2} />
            </div>
          </div>

          <h1 style={{
            ...f(120),
            fontSize: 'clamp(42px, 7vw, 86px)', fontWeight: 600,
            letterSpacing: '-3px', lineHeight: 0.98, color: '#0A0A0A', margin: '0 0 30px',
          }}>
            Your meetings<br />shouldn't{' '}
            <span className="rc-hero-gradient" style={{
              background: 'linear-gradient(135deg, #B45309 0%, #0F766E 40%, #7C3AED 80%, #B45309 100%)',
              backgroundSize: '300% 100%',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
            }}>disappear</span>
          </h1>

          <p style={{
            ...f(220),
            fontSize: 'clamp(17px, 2vw, 21px)', lineHeight: 1.55, color: '#57534E',
            fontWeight: 400, letterSpacing: '-0.2px', maxWidth: 660, margin: '0 auto 44px',
          }}>
            Recall turns every conversation into searchable intelligence — transcripts, decisions, action items, and everything your team needs to remember.
          </p>

          <div style={{ ...f(320), display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 24 }}>
            <PrimaryCTA href="/login" large>Start using Recall — it's free</PrimaryCTA>
            <SecondaryCTA href="#how" large>See how it works</SecondaryCTA>
          </div>

          <div style={{
            ...f(420), fontSize: 13.5, color: '#78716C', margin: 0,
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 20, flexWrap: 'wrap',
          }}>
            {['Free during early access', 'Set up in under a minute', 'No credit card needed'].map((t, i) => (
              <span key={t} style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                <svg width="13" height="13" viewBox="0 0 12 12" fill="none"><path d="M3 6l2 2 4-4" stroke="#0F766E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                {t}
              </span>
            ))}
          </div>
        </div>

        <div style={{ ...f(500), marginTop: 'clamp(64px, 9vw, 104px)' }}>
          <HeroVisual />
        </div>

        <div style={{ ...f(600), textAlign: 'center', marginTop: 40 }}>
          <MiniCTA href="/login">Try Recall for your next meeting</MiniCTA>
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
    { label: 'Product teams', icon: <Layers size={14} /> },
    { label: 'Engineering leads', icon: <Cpu size={14} /> },
    { label: 'Founders', icon: <Target size={14} /> },
    { label: 'Researchers', icon: <BookOpen size={14} /> },
    { label: 'Consultants', icon: <BarChart3 size={14} /> },
    { label: 'Design leads', icon: <Eye size={14} /> },
  ]
  return (
    <section style={{ padding: '88px clamp(20px, 4vw, 32px)', position: 'relative' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <Reveal>
          <div style={{ textAlign: 'center' }}>
            <p style={{ fontSize: 17, color: '#292524', fontWeight: 450, letterSpacing: '-0.2px', margin: '0 0 40px', maxWidth: 580, marginInline: 'auto', lineHeight: 1.55 }}>
              Built for people who can't afford to forget what happened in the room.
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 10 }}>
              {audiences.map(a => (
                <GlassCard key={a.label} glow glowColor="rgba(180,83,9,0.06)" hoverLift style={{ borderRadius: 100, padding: '10px 18px', display: 'inline-flex', alignItems: 'center', gap: 9, cursor: 'default' }}>
                  <span style={{ color: '#78716C', display: 'flex' }}>{a.icon}</span>
                  <span style={{ fontSize: 13.5, color: '#44403C', fontWeight: 450, letterSpacing: '-0.05px' }}>{a.label}</span>
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
   PROBLEM
   ═══════════════════════════════════════════════════════════════════════════ */

function Problem() {
  const stages = [
    { label: 'Meeting', desc: 'Everyone shows up.', opacity: 1, icon: <Users size={18} /> },
    { label: 'Conversation', desc: 'Ideas move quickly.', opacity: 0.82, icon: <Volume2 size={18} /> },
    { label: 'Decisions', desc: 'Direction gets set.', opacity: 0.62, icon: <GitBranch size={18} /> },
    { label: 'Tasks', desc: 'Work gets assigned.', opacity: 0.42, icon: <CheckSquare size={18} /> },
    { label: 'Silence', desc: 'The details fade.', opacity: 0.2, icon: <Radio size={18} /> },
  ]

  return (
    <section style={{ padding: 'clamp(100px, 12vw, 170px) clamp(20px, 4vw, 32px)', position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'radial-gradient(ellipse 55% 40% at 50% 35%, rgba(180,83,9,0.04), transparent 70%)', pointerEvents: 'none' }} />
      <div style={{ maxWidth: 1280, margin: '0 auto', position: 'relative' }}>
        <Reveal>
          <div style={{ maxWidth: 740, marginBottom: 88 }}>
            <SectionBadge dotColor="#DC2626">The problem</SectionBadge>
            <h2 style={{ fontSize: 'clamp(34px, 5.5vw, 66px)', fontWeight: 600, letterSpacing: '-2.2px', lineHeight: 1.02, color: '#0A0A0A', margin: '0 0 26px' }}>
              Meetings create<br />information.{' '}
              <span style={{ color: '#A8A29E', fontStyle: 'italic', fontWeight: 400 }}>Humans forget it.</span>
            </h2>
            <p style={{ fontSize: 18, color: '#57534E', lineHeight: 1.65, margin: 0, fontWeight: 400, letterSpacing: '-0.15px', maxWidth: 580 }}>
              A recording tells you what was said. A transcript is 40 pages long. Neither tells you what actually happened, what you decided, or what you owe someone by Friday.
            </p>
          </div>
        </Reveal>

        <Reveal delay={100}>
          <LiquidGlass style={{ padding: 'clamp(32px, 5vw, 56px) clamp(28px, 4vw, 48px)', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: -80, right: -80, width: 250, height: 250, background: 'radial-gradient(circle, rgba(220,38,38,0.05), transparent 70%)', filter: 'blur(40px)', pointerEvents: 'none' }} />
            <div className="rc-stages" style={{ display: 'grid', gridTemplateColumns: `repeat(${stages.length}, 1fr)`, gap: 0, position: 'relative' }}>
              {stages.map((s, i) => (
                <div key={s.label} style={{ padding: '0 clamp(16px, 2vw, 28px)', position: 'relative', borderLeft: i === 0 ? 'none' : '1px solid rgba(10,10,10,0.05)' }}>
                  <div style={{ color: '#0A0A0A', opacity: s.opacity * 0.6, marginBottom: 16 }}>{s.icon}</div>
                  <div style={{ fontSize: 44, fontWeight: 700, letterSpacing: '-1.5px', color: '#0A0A0A', opacity: s.opacity * 0.12, marginBottom: 14, lineHeight: 1, fontVariantNumeric: 'tabular-nums' }}>0{i + 1}</div>
                  <h3 style={{ fontSize: 19, fontWeight: 600, color: '#0A0A0A', margin: '0 0 7px', letterSpacing: '-0.3px', opacity: s.opacity }}>{s.label}</h3>
                  <p style={{ fontSize: 14, color: '#78716C', margin: 0, lineHeight: 1.5, opacity: s.opacity }}>{s.desc}</p>
                </div>
              ))}
            </div>
          </LiquidGlass>
        </Reveal>

        <Reveal delay={200}>
          <div style={{ marginTop: 52, display: 'flex', alignItems: 'center', gap: 20, flexWrap: 'wrap' }}>
            <GlassCard glow glowColor="rgba(180,83,9,0.08)" style={{ display: 'inline-flex', alignItems: 'center', gap: 10, padding: '12px 20px', borderRadius: 100 }}>
              <div style={{ width: 24, height: 24, borderRadius: 7, background: 'linear-gradient(135deg, #B45309, #D97706)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 8px rgba(180,83,9,0.2)' }}>
                <Sparkles size={12} color="white" strokeWidth={2.5} />
              </div>
              <span style={{ fontSize: 14.5, fontWeight: 520, color: '#0A0A0A', letterSpacing: '-0.1px' }}>With Recall</span>
            </GlassCard>
            <p style={{ fontSize: 17, color: '#292524', margin: 0, letterSpacing: '-0.15px', fontWeight: 400, flex: 1, minWidth: 220, lineHeight: 1.55 }}>
              Every meeting becomes a searchable record — with the summary, decisions, and next steps already extracted. Automatically.
            </p>
            <PrimaryCTA href="/login">Try it now</PrimaryCTA>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

/* ═══════════════════════════════════════════════════════════════════════════
   PRODUCT SHOWCASE
   ═══════════════════════════════════════════════════════════════════════════ */

type Tab = 'transcript' | 'summary' | 'decisions' | 'actions'

function ProductShowcase() {
  const [tab, setTab] = useState<Tab>('summary')
  const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: 'transcript', label: 'Transcript', icon: <FileText size={14} /> },
    { id: 'summary', label: 'Summary', icon: <Sparkles size={14} /> },
    { id: 'decisions', label: 'Decisions', icon: <GitBranch size={14} /> },
    { id: 'actions', label: 'Action items', icon: <CheckSquare size={14} /> },
  ]

  return (
    <section id="product" style={{ padding: 'clamp(100px, 12vw, 170px) clamp(20px, 4vw, 32px)', position: 'relative' }}>
      <FloatingOrbs variant="cool" />
      <div style={{ maxWidth: 1320, margin: '0 auto', position: 'relative' }}>
        <Reveal>
          <div style={{ maxWidth: 740, marginBottom: 72 }}>
            <SectionBadge dotColor="#0F766E">The product</SectionBadge>
            <h2 style={{ fontSize: 'clamp(34px, 5.5vw, 62px)', fontWeight: 600, letterSpacing: '-2.2px', lineHeight: 1.02, color: '#0A0A0A', margin: '0 0 22px' }}>
              One meeting.<br />Four ways to remember it.
            </h2>
            <p style={{ fontSize: 18, color: '#57534E', lineHeight: 1.6, margin: 0, fontWeight: 400, letterSpacing: '-0.15px', maxWidth: 560 }}>
              Every conversation gets restructured into the views that actually get used — read, skimmed, referenced, and acted on.
            </p>
          </div>
        </Reveal>

        <Reveal delay={100}>
          <LiquidGlass>
            <div style={{ padding: '18px 24px', borderBottom: '1px solid rgba(255,255,255,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap', background: 'rgba(255,255,255,0.18)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <div style={{ width: 40, height: 40, borderRadius: 11, background: 'linear-gradient(135deg, #292524, #0A0A0A)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.15)' }}>
                  <Mic size={17} color="#FAF9F7" strokeWidth={2} />
                </div>
                <div>
                  <h3 style={{ fontSize: 16, fontWeight: 600, color: '#0A0A0A', margin: 0, letterSpacing: '-0.2px' }}>Q4 Roadmap Review</h3>
                  <p style={{ fontSize: 13, color: '#78716C', margin: '2px 0 0' }}>Nov 12, 2025 · 42 min · {PARTICIPANTS.length} participants</p>
                </div>
              </div>
              <div style={{ display: 'flex', gap: -6 }}>
                {PARTICIPANTS.map((p, i) => (
                  <div key={p.name} title={p.name} style={{ width: 30, height: 30, borderRadius: '50%', background: p.color, color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10.5, fontWeight: 600, marginLeft: i ? -6 : 0, border: '2.5px solid rgba(255,255,255,0.85)', boxShadow: '0 1px 4px rgba(0,0,0,0.1)' }}>{p.initials}</div>
                ))}
              </div>
            </div>
            <div style={{ padding: '10px 20px', borderBottom: '1px solid rgba(255,255,255,0.3)', display: 'flex', gap: 4, overflowX: 'auto', background: 'rgba(255,255,255,0.12)' }} role="tablist">
              {tabs.map(t => (
                <button key={t.id} role="tab" aria-selected={tab === t.id} onClick={() => setTab(t.id)} className="rc-tab" style={{
                  display: 'inline-flex', alignItems: 'center', gap: 7, padding: '10px 16px', border: 'none', borderRadius: 10,
                  background: tab === t.id ? 'rgba(255,255,255,0.65)' : 'transparent', backdropFilter: tab === t.id ? 'blur(8px)' : 'none',
                  color: tab === t.id ? '#0A0A0A' : '#78716C', fontSize: 13.5, fontWeight: tab === t.id ? 550 : 450,
                  letterSpacing: '-0.1px', cursor: 'pointer', whiteSpace: 'nowrap', transition: 'all 200ms',
                  boxShadow: tab === t.id ? '0 1px 4px rgba(0,0,0,0.04), 0 0 0 0.5px rgba(255,255,255,0.5) inset' : 'none',
                }}>{t.icon}{t.label}</button>
              ))}
            </div>
            <div className="rc-showcase-body" style={{ display: 'grid', gridTemplateColumns: '1fr 280px', minHeight: 540 }}>
              <div style={{ padding: '28px 32px', overflow: 'hidden', overflowY: 'auto', maxHeight: 580 }}>
                <ShowcaseTabPanel tab={tab} />
              </div>
              <ShowcaseSidebar />
            </div>
          </LiquidGlass>
        </Reveal>

        <Reveal delay={200}>
          <div style={{ textAlign: 'center', marginTop: 48, display: 'flex', justifyContent: 'center', gap: 12, flexWrap: 'wrap' }}>
            <PrimaryCTA href="/login">Start capturing meetings</PrimaryCTA>
            <MiniCTA href="/login">See it with your own meetings</MiniCTA>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

function ShowcaseTabPanel({ tab }: { tab: Tab }) {
  const [checked, setChecked] = useState<Record<number, boolean>>({})
  return (
    <div key={tab} style={{ animation: 'rc-fadein 400ms cubic-bezier(0.16,1,0.3,1)' }}>
      {tab === 'transcript' && TRANSCRIPT.map((seg, i) => {
        const p = PARTICIPANTS.find(x => x.name === seg.speaker)!
        return (
          <div key={i} className="rc-transcript-line" style={{ display: 'flex', gap: 14, padding: '14px 16px', borderRadius: 14, marginBottom: 4, transition: 'background 200ms' }}>
            <div style={{ flexShrink: 0, width: 30, height: 30, borderRadius: '50%', background: `${p.color}15`, color: p.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 700, border: `1.5px solid ${p.color}25` }}>{p.initials}</div>
            <div>
              <div style={{ display: 'flex', gap: 8, alignItems: 'baseline', marginBottom: 4 }}>
                <span style={{ fontSize: 14, fontWeight: 550, color: '#0A0A0A' }}>{seg.speaker}</span>
                <span style={{ fontSize: 11.5, color: '#A8A29E', fontVariantNumeric: 'tabular-nums' }}>{seg.time}</span>
              </div>
              <p style={{ fontSize: 14.5, color: '#292524', lineHeight: 1.65, margin: 0 }}>{seg.text}</p>
            </div>
          </div>
        )
      })}
      {tab === 'summary' && (
        <div>
          <p style={{ fontSize: 16, color: '#292524', lineHeight: 1.7, margin: '0 0 28px', fontWeight: 400 }}>{SUMMARY_TEXT}</p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }} className="rc-summary-grid">
            {[{ icon: <GitBranch size={15} color="#0F766E" />, label: 'Decisions', count: DECISIONS.length, sub: 'With context', color: '#0F766E' },
              { icon: <CheckSquare size={15} color="#B45309" />, label: 'Actions', count: ACTIONS.length, sub: 'With owners', color: '#B45309' }].map(c => (
              <GlassCard key={c.label} glow glowColor={`${c.color}10`} style={{ padding: 20, borderRadius: 14 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>{c.icon}<span style={{ fontSize: 11, fontWeight: 600, color: '#57534E', textTransform: 'uppercase', letterSpacing: '0.6px' }}>{c.label}</span></div>
                <p style={{ fontSize: 30, fontWeight: 600, color: '#0A0A0A', margin: 0, letterSpacing: '-1px' }}>{c.count}</p>
                <p style={{ fontSize: 13, color: '#78716C', margin: '4px 0 0' }}>{c.sub}</p>
              </GlassCard>
            ))}
          </div>
        </div>
      )}
      {tab === 'decisions' && DECISIONS.map((d, i) => (
        <GlassCard key={i} glow glowColor="rgba(15,118,110,0.06)" style={{ display: 'flex', gap: 14, padding: '20px 22px', borderRadius: 14, marginBottom: 10 }}>
          <div style={{ width: 30, height: 30, borderRadius: 8, background: 'rgba(15,118,110,0.1)', border: '1px solid rgba(15,118,110,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <GitBranch size={14} color="#0F766E" />
          </div>
          <div>
            <p style={{ fontSize: 15, color: '#0A0A0A', margin: 0, lineHeight: 1.55, fontWeight: 450 }}>{d}</p>
            <p style={{ fontSize: 12, color: '#78716C', margin: '8px 0 0', display: 'flex', alignItems: 'center', gap: 5 }}><Clock size={10} />Nov 12, 2025</p>
          </div>
        </GlassCard>
      ))}
      {tab === 'actions' && ACTIONS.map((a, i) => {
        const done = !!checked[i]
        const p = PARTICIPANTS.find(x => x.name === a.owner)!
        return (
          <GlassCard key={i} glow glowColor="rgba(180,83,9,0.05)" style={{ display: 'flex', gap: 14, padding: '18px 20px', borderRadius: 14, marginBottom: 8, opacity: done ? 0.5 : 1, transition: 'all 300ms', transform: done ? 'scale(0.98)' : 'scale(1)' }}>
            <button onClick={() => setChecked(c => ({ ...c, [i]: !c[i] }))} aria-label={done ? 'Undo' : 'Complete'} style={{
              width: 22, height: 22, borderRadius: 6, flexShrink: 0, marginTop: 1,
              border: done ? 'none' : '2px solid #A8A29E', background: done ? '#0A0A0A' : 'transparent', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 200ms',
              boxShadow: done ? '0 2px 8px rgba(0,0,0,0.15)' : 'none',
            }}>
              {done && <svg width="11" height="11" viewBox="0 0 12 12" fill="none"><path d="M2.5 6.5L4.8 8.8L9.5 3.5" stroke="#FAF9F7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>}
            </button>
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: 14.5, color: '#0A0A0A', margin: 0, fontWeight: 500, lineHeight: 1.5, textDecoration: done ? 'line-through' : 'none' }}>{a.text}</p>
              <div style={{ display: 'flex', gap: 10, marginTop: 7, alignItems: 'center', flexWrap: 'wrap' }}>
                <span style={{ fontSize: 12, fontWeight: 450, display: 'inline-flex', alignItems: 'center', gap: 5, padding: '2px 8px', background: `${p.color}10`, borderRadius: 100, color: p.color, border: `1px solid ${p.color}20` }}>
                  <span style={{ width: 14, height: 14, borderRadius: '50%', background: p.color, color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 7, fontWeight: 700 }}>{p.initials}</span>
                  {a.owner}
                </span>
                <span style={{ fontSize: 12, color: '#78716C', display: 'inline-flex', alignItems: 'center', gap: 4 }}><Clock size={10} />{a.due}</span>
              </div>
            </div>
          </GlassCard>
        )
      })}
    </div>
  )
}

function ShowcaseSidebar() {
  return (
    <div style={{ padding: '28px 24px', background: 'rgba(255,255,255,0.2)', borderLeft: '1px solid rgba(255,255,255,0.35)' }} className="rc-showcase-side">
      <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 10.5, fontWeight: 600, color: '#78716C', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: 14 }}>
        <Hash size={10} strokeWidth={2.5} /> Topics
      </span>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 28 }}>
        {TOPICS.map(t => (
          <span key={t} className="rc-topic-chip" style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 11.5, padding: '5px 10px', background: 'rgba(255,255,255,0.5)', backdropFilter: 'blur(6px)', color: '#44403C', borderRadius: 8, fontWeight: 450, border: '1px solid rgba(255,255,255,0.6)', cursor: 'default', transition: 'all 200ms' }}>{t}</span>
        ))}
      </div>
      <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 10.5, fontWeight: 600, color: '#78716C', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: 14 }}>
        <Users size={10} strokeWidth={2.5} /> Participants
      </span>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 28 }}>
        {PARTICIPANTS.map(p => (
          <div key={p.name} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 26, height: 26, borderRadius: '50%', background: `${p.color}15`, color: p.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 9.5, fontWeight: 700, border: `1.5px solid ${p.color}25` }}>{p.initials}</div>
            <div>
              <span style={{ fontSize: 13, color: '#292524', fontWeight: 500, letterSpacing: '-0.05px', display: 'block' }}>{p.name}</span>
              <span style={{ fontSize: 11, color: '#A8A29E' }}>{p.role}</span>
            </div>
          </div>
        ))}
      </div>
      <GlassCard style={{ padding: 18, borderRadius: 14 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}><Timer size={11} color="#78716C" /><span style={{ fontSize: 10.5, fontWeight: 600, color: '#78716C', textTransform: 'uppercase', letterSpacing: '0.6px' }}>Duration</span></div>
        <span style={{ fontSize: 26, fontWeight: 600, color: '#0A0A0A', letterSpacing: '-0.8px' }}>42 min</span>
        <p style={{ fontSize: 12, color: '#78716C', margin: '4px 0 0' }}>Nov 12, 2025</p>
      </GlassCard>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════════════════
   HOW IT WORKS
   ═══════════════════════════════════════════════════════════════════════════ */

function HowItWorks() {
  const steps = [
    { n: '01', title: 'Capture', desc: 'Recall records the conversation — from calendar-linked calls, browser recording, or uploaded audio.', icon: <Mic size={22} strokeWidth={1.5} />, color: '#B45309' },
    { n: '02', title: 'Understand', desc: 'AI restructures the transcript into a summary, decisions, action items, and the topics that matter.', icon: <Sparkles size={22} strokeWidth={1.5} />, color: '#0F766E' },
    { n: '03', title: 'Remember', desc: 'Search across every meeting or ask Recall directly. Answers come with citations to the source moments.', icon: <Search size={22} strokeWidth={1.5} />, color: '#7C3AED' },
    { n: '04', title: 'Act', desc: "Decisions and next steps stop living in someone's head. Every action item has an owner and a deadline.", icon: <Target size={22} strokeWidth={1.5} />, color: '#BE185D' },
  ]

  return (
    <section id="how" style={{ padding: 'clamp(100px, 12vw, 170px) clamp(20px, 4vw, 32px)', position: 'relative' }}>
      <div style={{ maxWidth: 1320, margin: '0 auto', position: 'relative' }}>
        <Reveal>
          <div style={{ maxWidth: 740, marginBottom: 72 }}>
            <SectionBadge dotColor="#7C3AED">How it works</SectionBadge>
            <h2 style={{ fontSize: 'clamp(34px, 5.5vw, 62px)', fontWeight: 600, letterSpacing: '-2.2px', lineHeight: 1.02, color: '#0A0A0A', margin: 0 }}>
              Four steps between the meeting and what you needed from it.
            </h2>
          </div>
        </Reveal>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(270px, 1fr))', gap: 14 }}>
          {steps.map((s, i) => (
            <Reveal key={s.n} delay={i * 80}>
              <GlassCard glow glowColor={`${s.color}10`} hoverLift style={{ padding: '40px 30px', height: '100%', borderRadius: 22 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 40 }}>
                  <span style={{ fontSize: 56, fontWeight: 700, letterSpacing: '-2px', color: '#0A0A0A', opacity: 0.06, lineHeight: 1 }}>{s.n}</span>
                  <div style={{ width: 48, height: 48, borderRadius: 14, background: `${s.color}10`, border: `1px solid ${s.color}20`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: s.color, boxShadow: `0 4px 14px ${s.color}12` }}>{s.icon}</div>
                </div>
                <h3 style={{ fontSize: 22, fontWeight: 600, color: '#0A0A0A', margin: '0 0 12px', letterSpacing: '-0.5px' }}>{s.title}</h3>
                <p style={{ fontSize: 14.5, color: '#57534E', lineHeight: 1.65, margin: 0 }}>{s.desc}</p>
              </GlassCard>
            </Reveal>
          ))}
        </div>
        <Reveal delay={360}>
          <div style={{ textAlign: 'center', marginTop: 48 }}>
            <PrimaryCTA href="/login">Start capturing — it's free</PrimaryCTA>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

/* ═══════════════════════════════════════════════════════════════════════════
   FEATURES
   ═══════════════════════════════════════════════════════════════════════════ */

function Features() {
  const features = [
    { icon: Mic, title: 'Meeting recording', desc: 'Capture any conversation, scheduled or ad-hoc.', accent: '#B45309' },
    { icon: FileText, title: 'Transcription', desc: 'Speaker-attributed transcripts, readable and searchable.', accent: '#0F766E' },
    { icon: Sparkles, title: 'AI summaries', desc: 'The shape of the conversation, without the noise.', accent: '#7C3AED' },
    { icon: CheckSquare, title: 'Action items', desc: 'Extracted automatically with owners and deadlines.', accent: '#BE185D' },
    { icon: GitBranch, title: 'Decision tracking', desc: 'Every commitment, recorded with surrounding context.', accent: '#0F766E' },
    { icon: Hash, title: 'Topic extraction', desc: 'The threads of discussion, structured for reference.', accent: '#B45309' },
    { icon: Search, title: 'Full-text search', desc: "Find any moment across every meeting you've had.", accent: '#7C3AED' },
    { icon: MessageSquareText, title: 'Ask Recall', desc: 'Natural-language Q&A across your meeting history.', accent: '#BE185D' },
    { icon: Calendar, title: 'Calendar sync', desc: 'Recall sees meetings and prepares to capture them.', accent: '#0F766E' },
    { icon: Clock, title: 'Meeting history', desc: 'A durable timeline of everything discussed and decided.', accent: '#B45309' },
    { icon: Lock, title: 'Private by default', desc: 'Your recordings belong to you. Access is explicit.', accent: '#292524' },
    { icon: Share2, title: 'Shareable records', desc: "Send a summary to someone who wasn't there.", accent: '#7C3AED' },
  ]

  return (
    <section id="features" style={{ padding: 'clamp(100px, 12vw, 170px) clamp(20px, 4vw, 32px)', position: 'relative' }}>
      <FloatingOrbs variant="warm" />
      <div style={{ maxWidth: 1320, margin: '0 auto', position: 'relative' }}>
        <Reveal>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: 40, marginBottom: 72, flexWrap: 'wrap' }}>
            <div style={{ maxWidth: 700 }}>
              <SectionBadge dotColor="#0F766E">Features</SectionBadge>
              <h2 style={{ fontSize: 'clamp(34px, 5.5vw, 62px)', fontWeight: 600, letterSpacing: '-2.2px', lineHeight: 1.02, color: '#0A0A0A', margin: 0 }}>
                Everything a meeting needs to outlive the conversation.
              </h2>
            </div>
            <PrimaryCTA href="/login">Get started free</PrimaryCTA>
          </div>
        </Reveal>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(290px, 1fr))', gap: 14 }}>
          {features.map((f, i) => {
            const Icon = f.icon
            return (
              <Reveal key={f.title} delay={i * 30}>
                <GlassCard glow glowColor={`${f.accent}08`} hoverLift className="rc-feature-card" style={{ padding: '30px 26px', height: '100%', borderRadius: 20, cursor: 'default' }}>
                  <div style={{ width: 42, height: 42, borderRadius: 12, background: `${f.accent}08`, border: `1px solid ${f.accent}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: f.accent, marginBottom: 22, boxShadow: `0 3px 10px ${f.accent}08` }}>
                    <Icon size={18} strokeWidth={1.8} />
                  </div>
                  <h3 style={{ fontSize: 17, fontWeight: 600, color: '#0A0A0A', margin: '0 0 8px', letterSpacing: '-0.3px' }}>{f.title}</h3>
                  <p style={{ fontSize: 14.5, color: '#57534E', lineHeight: 1.6, margin: 0 }}>{f.desc}</p>
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
    'What are Priya\'s open action items?',
    'Summarize the last three product meetings.',
  ]
  const answers: Record<string, { text: string; sources: { title: string; date: string }[] }> = {
    [suggestions[0]]: { text: "The team agreed to move the public launch to October 14. Sarah will finalize the release checklist by October 7, and Daniel will coordinate the final QA pass. The soft launch remains scheduled for October 1.", sources: [{ title: 'Q4 Roadmap Review', date: 'Nov 12' }, { title: 'Launch Readiness Sync', date: 'Nov 5' }] },
    [suggestions[1]]: { text: "Priya has three open items: redesign the onboarding flow with a deferred invite step (due Nov 15), draft the customer research summary (due Nov 18), and review the pricing page copy (due Nov 20).", sources: [{ title: 'Q4 Roadmap Review', date: 'Nov 12' }, { title: 'Design Weekly', date: 'Nov 8' }] },
    [suggestions[2]]: { text: "The team focused on onboarding conversion, API readiness, and pricing. The redesigned onboarding ships Friday. The public API is blocked on rate limiting. Pricing page copy review is scheduled for Nov 20.", sources: [{ title: 'Q4 Roadmap Review', date: 'Nov 12' }, { title: 'API Planning', date: 'Nov 8' }, { title: 'Pricing Review', date: 'Nov 6' }] },
  }

  const [selected, setSelected] = useState(suggestions[0])
  const [phase, setPhase] = useState<'idle' | 'thinking' | 'done'>('idle')
  const { ref, visible } = useReveal()

  const ask = useCallback((q: string) => {
    setSelected(q); setPhase('thinking')
    setTimeout(() => setPhase('done'), 900)
  }, [])

  useEffect(() => {
    if (visible && phase === 'idle') {
      const t = setTimeout(() => { setPhase('thinking'); setTimeout(() => setPhase('done'), 900) }, 600)
      return () => clearTimeout(t)
    }
  }, [visible, phase])

  const answer = answers[selected]

  return (
    <section style={{ padding: 'clamp(100px, 12vw, 170px) clamp(20px, 4vw, 32px)', position: 'relative' }}>
      <div style={{ maxWidth: 1320, margin: '0 auto', position: 'relative' }}>
        <div className="rc-ask-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1.35fr', gap: 80, alignItems: 'center' }}>
          <Reveal>
            <div>
              <SectionBadge dotColor="#B45309">Ask Recall</SectionBadge>
              <h2 style={{ fontSize: 'clamp(32px, 4.5vw, 54px)', fontWeight: 600, letterSpacing: '-1.8px', lineHeight: 1.06, color: '#0A0A0A', margin: '0 0 22px' }}>
                A question is faster than scrolling through six recordings.
              </h2>
              <p style={{ fontSize: 17, color: '#57534E', lineHeight: 1.65, margin: '0 0 36px', fontWeight: 400 }}>
                Ask Recall pulls from every meeting you've captured. Answers are grounded in real transcripts, with source moments attached so you can verify everything.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 36 }}>
                {[{ text: 'Natural-language answers', icon: <MessageSquareText size={14} /> },
                  { text: 'Grounded in real transcripts', icon: <FileText size={14} /> },
                  { text: 'Sources cited inline', icon: <Bookmark size={14} /> }].map(item => (
                  <div key={item.text} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{ width: 30, height: 30, borderRadius: 8, background: 'rgba(10,10,10,0.04)', border: '1px solid rgba(10,10,10,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#44403C' }}>{item.icon}</div>
                    <span style={{ fontSize: 15, color: '#292524', letterSpacing: '-0.1px' }}>{item.text}</span>
                  </div>
                ))}
              </div>
              <PrimaryCTA href="/login">Try Ask Recall</PrimaryCTA>
            </div>
          </Reveal>
          <Reveal delay={120}>
            <LiquidGlass ref={ref}>
              <div style={{ padding: '16px 20px', borderBottom: '1px solid rgba(255,255,255,0.4)', display: 'flex', alignItems: 'center', gap: 10, background: 'rgba(255,255,255,0.18)' }}>
                <div style={{ width: 26, height: 26, borderRadius: 8, background: 'linear-gradient(135deg, #B45309, #D97706)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 8px rgba(180,83,9,0.2)' }}>
                  <Sparkles size={12} color="white" strokeWidth={2.5} />
                </div>
                <span style={{ fontSize: 14, fontWeight: 550, color: '#0A0A0A' }}>Ask Recall</span>
                <span style={{ marginLeft: 'auto', fontSize: 11.5, color: '#78716C', display: 'inline-flex', alignItems: 'center', gap: 5, padding: '3px 8px', background: 'rgba(255,255,255,0.45)', borderRadius: 6, border: '1px solid rgba(255,255,255,0.6)' }}>
                  <Command size={10} strokeWidth={2.5} /> K
                </span>
              </div>
              <div style={{ padding: '22px 24px', minHeight: 400 }}>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 24 }}>
                  {suggestions.map(s => (
                    <button key={s} onClick={() => ask(s)} className="rc-suggestion" style={{
                      fontSize: 12.5, padding: '9px 14px', background: selected === s ? '#0A0A0A' : 'rgba(255,255,255,0.45)',
                      backdropFilter: selected === s ? 'none' : 'blur(8px)', color: selected === s ? '#FAF9F7' : '#44403C',
                      border: `1px solid ${selected === s ? '#0A0A0A' : 'rgba(255,255,255,0.7)'}`, borderRadius: 100, cursor: 'pointer', fontWeight: 450, textAlign: 'left', transition: 'all 200ms',
                      boxShadow: selected === s ? '0 2px 8px rgba(0,0,0,0.15)' : '0 1px 4px rgba(0,0,0,0.03)',
                    }}>{s}</button>
                  ))}
                </div>
                {selected && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
                    <div style={{ padding: '12px 16px', background: 'rgba(255,255,255,0.45)', backdropFilter: 'blur(8px)', borderRadius: 12, border: '1px solid rgba(255,255,255,0.6)', fontSize: 14, color: '#292524', display: 'flex', alignItems: 'center', gap: 8 }}>
                      <Search size={13} color="#78716C" strokeWidth={2} />{selected}
                    </div>
                    {phase === 'thinking' ? (
                      <div style={{ display: 'flex', gap: 8, padding: '12px 4px', alignItems: 'center' }}>
                        <div className="rc-spinner" style={{ width: 18, height: 18, borderRadius: '50%', border: '2px solid rgba(180,83,9,0.15)', borderTopColor: '#B45309' }} />
                        <span style={{ fontSize: 13, color: '#78716C' }}>Searching across your meetings…</span>
                      </div>
                    ) : phase === 'done' && answer && (
                      <div style={{ animation: 'rc-fadein 500ms cubic-bezier(0.16,1,0.3,1)' }}>
                        <div style={{ padding: '20px 22px', background: 'rgba(255,255,255,0.45)', backdropFilter: 'blur(12px)', borderRadius: 16, border: '1px solid rgba(255,255,255,0.7)', boxShadow: '0 4px 16px rgba(0,0,0,0.04)' }}>
                          <p style={{ fontSize: 15, color: '#0A0A0A', lineHeight: 1.7, margin: '0 0 18px', fontWeight: 400 }}>{answer.text}</p>
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                            {answer.sources.map(src => (
                              <span key={src.title} className="rc-source-chip" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 12, padding: '6px 12px', background: 'rgba(255,255,255,0.55)', backdropFilter: 'blur(6px)', color: '#44403C', border: '1px solid rgba(255,255,255,0.7)', borderRadius: 8, fontWeight: 450, transition: 'all 200ms', cursor: 'default' }}>
                                <FileText size={10} strokeWidth={2} color="#78716C" />{src.title}<span style={{ color: '#D6D3D1' }}>·</span><span style={{ color: '#78716C' }}>{src.date}</span>
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
              <div style={{ padding: '14px 20px', borderTop: '1px solid rgba(255,255,255,0.35)', display: 'flex', gap: 10, background: 'rgba(255,255,255,0.15)' }}>
                <div style={{ flex: 1, padding: '10px 14px', background: 'rgba(255,255,255,0.45)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.65)', borderRadius: 10, fontSize: 13.5, color: '#A8A29E' }}>Ask about anything you've discussed…</div>
                <Link href="/login" className="rc-cta-primary" style={{ padding: '10px 18px', background: 'linear-gradient(135deg, #0A0A0A, #292524)', color: '#FAF9F7', borderRadius: 10, fontSize: 13, fontWeight: 520, textDecoration: 'none', whiteSpace: 'nowrap', boxShadow: '0 2px 8px rgba(0,0,0,0.15)' }}>Try it</Link>
              </div>
            </LiquidGlass>
          </Reveal>
        </div>
      </div>
    </section>
  )
}

/* ═══════════════════════════════════════════════════════════════════════════
   WORKFLOW / CALENDAR
   ═══════════════════════════════════════════════════════════════════════════ */

function Workflow() {
  const meetings = [
    { time: '09:00', title: 'Product Strategy', dur: '45 min', color: '#B45309', captured: true },
    { time: '11:30', title: 'Engineering Sync', dur: '30 min', color: '#0F766E', captured: true },
    { time: '14:00', title: 'Customer Research', dur: '60 min', color: '#7C3AED', captured: true },
    { time: '16:00', title: 'Weekly Review', dur: '45 min', color: '#BE185D', captured: false },
  ]

  return (
    <section style={{ padding: 'clamp(100px, 12vw, 170px) clamp(20px, 4vw, 32px)', position: 'relative' }}>
      <div style={{ maxWidth: 1320, margin: '0 auto', position: 'relative' }}>
        <div className="rc-workflow-grid" style={{ display: 'grid', gridTemplateColumns: '1.1fr 1fr', gap: 80, alignItems: 'center' }}>
          <Reveal>
            <LiquidGlass style={{ padding: 28 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
                <div>
                  <p style={{ fontSize: 12, color: '#78716C', margin: 0, fontWeight: 550, textTransform: 'uppercase', letterSpacing: '0.7px' }}>Today</p>
                  <p style={{ fontSize: 18, fontWeight: 600, color: '#0A0A0A', margin: '4px 0 0', letterSpacing: '-0.4px' }}>Wednesday, Nov 13</p>
                </div>
                <GlassCard style={{ borderRadius: 100, padding: '7px 14px' }}>
                  <span style={{ fontSize: 11.5, color: '#0F766E', fontWeight: 520, display: 'flex', alignItems: 'center', gap: 5 }}>
                    <Calendar size={12} /> Connected
                  </span>
                </GlassCard>
              </div>
              {meetings.map((m, i) => (
                <Reveal key={m.title} delay={i * 60}>
                  <GlassCard glow glowColor={`${m.color}08`} hoverLift style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '16px 18px', borderRadius: 14, marginBottom: 10 }}>
                    <span style={{ fontSize: 13, fontWeight: 500, color: '#57534E', fontVariantNumeric: 'tabular-nums', width: 44 }}>{m.time}</span>
                    <div style={{ width: 3, height: 38, background: m.color, borderRadius: 2 }} />
                    <div style={{ flex: 1 }}>
                      <p style={{ fontSize: 14.5, fontWeight: 550, color: '#0A0A0A', margin: 0 }}>{m.title}</p>
                      <p style={{ fontSize: 12, color: '#78716C', margin: '3px 0 0' }}>{m.dur}</p>
                    </div>
                    {m.captured ? (
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 11, fontWeight: 520, color: '#0A0A0A', padding: '5px 10px', background: 'rgba(255,255,255,0.5)', backdropFilter: 'blur(6px)', borderRadius: 8, border: '1px solid rgba(255,255,255,0.6)' }}>
                        <Circle size={6} fill="#0A0A0A" stroke="none" />Captured
                      </span>
                    ) : (
                      <span className="rc-pulse-dot-badge" style={{ fontSize: 11, fontWeight: 520, color: '#78716C', padding: '5px 10px', background: 'rgba(255,255,255,0.3)', borderRadius: 8, border: '1px dashed rgba(10,10,10,0.15)' }}>Upcoming</span>
                    )}
                  </GlassCard>
                </Reveal>
              ))}
            </LiquidGlass>
          </Reveal>
          <Reveal delay={120}>
            <div>
              <SectionBadge dotColor="#BE185D">Workflow</SectionBadge>
              <h2 style={{ fontSize: 'clamp(32px, 4.5vw, 54px)', fontWeight: 600, letterSpacing: '-1.8px', lineHeight: 1.06, color: '#0A0A0A', margin: '0 0 22px' }}>
                Recall doesn't create another tool to maintain.
              </h2>
              <p style={{ fontSize: 17, color: '#57534E', lineHeight: 1.65, margin: '0 0 36px', fontWeight: 400 }}>
                Connect your calendar and Recall becomes the memory layer around the meetings you're already having. Every scheduled call turns into a searchable record — automatically.
              </p>
              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                <PrimaryCTA href="/login">Connect your calendar</PrimaryCTA>
                <SecondaryCTA href="#features">Learn more</SecondaryCTA>
              </div>
            </div>
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
    { icon: <Lock size={17} />, title: 'Private by default', desc: "Recordings and transcripts belong to the person who created them. Nothing is shared unless you share it." },
    { icon: <Shield size={17} />, title: 'Authenticated access', desc: 'Meeting data is gated behind authentication. Only signed-in owners can access their content.' },
    { icon: <Users size={17} />, title: 'Controlled sharing', desc: 'When you share a summary, the recipient sees exactly what you chose — and nothing else.' },
    { icon: <Layers size={17} />, title: 'Secure storage', desc: 'Meeting content is stored with modern cloud security practices, isolated per account.' },
  ]
  return (
    <section style={{ padding: 'clamp(100px, 12vw, 170px) clamp(20px, 4vw, 32px)', position: 'relative' }}>
      <div style={{ maxWidth: 1050, margin: '0 auto' }}>
        <Reveal>
          <div style={{ maxWidth: 660, marginBottom: 60 }}>
            <SectionBadge dotColor="#292524"><Shield size={9} /> Privacy</SectionBadge>
            <h2 style={{ fontSize: 'clamp(32px, 4.5vw, 54px)', fontWeight: 600, letterSpacing: '-1.8px', lineHeight: 1.06, color: '#0A0A0A', margin: 0 }}>
              Your meetings are yours.{' '}
              <span style={{ color: '#A8A29E', fontStyle: 'italic', fontWeight: 400 }}>That's the whole point.</span>
            </h2>
          </div>
        </Reveal>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))', gap: 14 }}>
          {points.map((p, i) => (
            <Reveal key={p.title} delay={i * 60}>
              <GlassCard glow glowColor="rgba(10,10,10,0.03)" hoverLift style={{ padding: '30px 26px', height: '100%', borderRadius: 20 }}>
                <div style={{ width: 40, height: 40, borderRadius: 11, background: '#0A0A0A', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FAF9F7', marginBottom: 22, boxShadow: '0 3px 12px rgba(0,0,0,0.15)' }}>{p.icon}</div>
                <h3 style={{ fontSize: 17, fontWeight: 600, color: '#0A0A0A', margin: '0 0 8px', letterSpacing: '-0.3px' }}>{p.title}</h3>
                <p style={{ fontSize: 14.5, color: '#57534E', lineHeight: 1.6, margin: 0 }}>{p.desc}</p>
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
    <section id="pricing" style={{ padding: 'clamp(100px, 12vw, 170px) clamp(20px, 4vw, 32px)', position: 'relative' }}>
      <FloatingOrbs variant="warm" />
      <div style={{ maxWidth: 1050, margin: '0 auto', position: 'relative' }}>
        <Reveal>
          <div style={{ textAlign: 'center', marginBottom: 72 }}>
            <SectionBadge>Pricing</SectionBadge>
            <h2 style={{ fontSize: 'clamp(34px, 5.5vw, 62px)', fontWeight: 600, letterSpacing: '-2.2px', lineHeight: 1.02, color: '#0A0A0A', margin: '0 0 20px' }}>
              Build your memory layer.
            </h2>
            <p style={{ fontSize: 18, color: '#57534E', margin: 0, maxWidth: 540, marginInline: 'auto', lineHeight: 1.6 }}>
              Recall is free during early access. No credit card, no seat minimums, no per-meeting billing.
            </p>
          </div>
        </Reveal>
        <Reveal delay={100}>
          <div className="rc-pricing-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <LiquidGlass style={{ padding: 40 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28 }}>
                <div>
                  <p style={{ fontSize: 15, fontWeight: 600, color: '#0A0A0A', margin: 0 }}>Early Access</p>
                  <p style={{ fontSize: 13, color: '#78716C', margin: '3px 0 0' }}>For individuals and teams</p>
                </div>
                <span style={{ fontSize: 10, fontWeight: 650, color: '#B45309', background: 'rgba(180,83,9,0.1)', padding: '4px 10px', borderRadius: 100, textTransform: 'uppercase', letterSpacing: '0.6px', border: '1px solid rgba(180,83,9,0.2)' }}>Current</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginBottom: 32 }}>
                <span style={{ fontSize: 56, fontWeight: 600, color: '#0A0A0A', letterSpacing: '-3px', lineHeight: 1 }}>Free</span>
                <span style={{ fontSize: 15, color: '#78716C' }}>during early access</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 36 }}>
                {['Unlimited meeting recording', 'Full transcript, summary, decisions & action items', 'Ask Recall across your meeting history', 'Calendar integration', 'Shareable meeting records'].map(fe => (
                  <div key={fe} style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                    <div style={{ width: 18, height: 18, borderRadius: 5, background: '#0A0A0A', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, boxShadow: '0 1px 4px rgba(0,0,0,0.1)' }}>
                      <svg width="10" height="10" viewBox="0 0 12 12" fill="none"><path d="M2.5 6.5L4.8 8.8L9.5 3.5" stroke="#FAF9F7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                    </div>
                    <span style={{ fontSize: 14.5, color: '#292524' }}>{fe}</span>
                  </div>
                ))}
              </div>
              <PrimaryCTA href="/login" large>Get started free</PrimaryCTA>
            </LiquidGlass>
            <GlassCard style={{ padding: 40, borderRadius: 24, border: '1px dashed rgba(10,10,10,0.12)', background: 'rgba(255,255,255,0.28)', display: 'flex', flexDirection: 'column' }}>
              <div style={{ marginBottom: 28 }}>
                <p style={{ fontSize: 15, fontWeight: 600, color: '#0A0A0A', margin: 0 }}>Team</p>
                <p style={{ fontSize: 13, color: '#78716C', margin: '3px 0 0' }}>For organizations</p>
              </div>
              <div style={{ marginBottom: 28 }}>
                <span style={{ fontSize: 56, fontWeight: 600, color: '#0A0A0A', letterSpacing: '-3px', lineHeight: 1 }}>Soon</span>
              </div>
              <p style={{ fontSize: 15, color: '#57534E', lineHeight: 1.6, margin: '0 0 auto' }}>Shared workspaces, team-wide search across meetings, and admin controls are in development. Start with early access today and we'll bring you along.</p>
              <div style={{ marginTop: 32, paddingTop: 24, borderTop: '1px solid rgba(10,10,10,0.06)' }}>
                <MiniCTA href="/login">Start with early access</MiniCTA>
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
    { q: 'How does meeting recording work?', a: 'You can capture meetings directly from Recall in your browser, connect your Google Calendar so scheduled meetings are captured automatically, or import audio from other sources.' },
    { q: 'Can Recall summarize meetings?', a: 'Yes. After a meeting is captured, Recall produces a concise summary along with the key decisions and any action items from the conversation.' },
    { q: 'Can I search across all of my meetings?', a: 'Yes. Full-text search runs across every transcript and summary, so you can find the exact moment something was said — across your entire history.' },
    { q: 'What is Ask Recall?', a: "Ask Recall is a natural-language interface over your meeting history. Ask a question in plain English and get an answer with citations to the specific meetings it came from." },
    { q: 'Does Recall work with Google Calendar?', a: 'Yes. Connect your Google Calendar and Recall will surface your upcoming meetings and prepare to capture them automatically.' },
    { q: 'How is my meeting data handled?', a: 'Recordings and transcripts belong to the account that created them. Access is authenticated, and you decide what to share with others. Nothing is shared by default.' },
  ]
  const [open, setOpen] = useState<number | null>(0)

  return (
    <section id="faq" style={{ padding: 'clamp(100px, 12vw, 170px) clamp(20px, 4vw, 32px)', position: 'relative' }}>
      <div style={{ maxWidth: 900, margin: '0 auto', position: 'relative' }}>
        <Reveal>
          <div style={{ marginBottom: 60 }}>
            <SectionBadge>Questions</SectionBadge>
            <h2 style={{ fontSize: 'clamp(32px, 4.5vw, 54px)', fontWeight: 600, letterSpacing: '-1.8px', lineHeight: 1.06, color: '#0A0A0A', margin: 0 }}>Frequently asked.</h2>
          </div>
        </Reveal>
        <LiquidGlass style={{ overflow: 'hidden' }}>
          {items.map((it, i) => {
            const isOpen = open === i
            return (
              <div key={it.q} style={{ borderBottom: i < items.length - 1 ? '1px solid rgba(255,255,255,0.3)' : 'none' }}>
                <button onClick={() => setOpen(isOpen ? null : i)} aria-expanded={isOpen} className="rc-faq-btn" style={{
                  width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '24px 28px', background: 'transparent', border: 'none', cursor: 'pointer', textAlign: 'left', gap: 20, transition: 'background 200ms',
                }}>
                  <span style={{ fontSize: 16, fontWeight: 500, color: '#0A0A0A', letterSpacing: '-0.2px' }}>{it.q}</span>
                  <span style={{ width: 28, height: 28, borderRadius: 8, background: 'rgba(255,255,255,0.5)', backdropFilter: 'blur(6px)', border: '1px solid rgba(255,255,255,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#44403C', flexShrink: 0, transition: 'transform 300ms cubic-bezier(0.16,1,0.3,1)', transform: isOpen ? 'rotate(180deg)' : 'none' }}>
                    {isOpen ? <Minus size={14} strokeWidth={2.2} /> : <Plus size={14} strokeWidth={2.2} />}
                  </span>
                </button>
                <div style={{ maxHeight: isOpen ? 400 : 0, overflow: 'hidden', transition: 'max-height 400ms cubic-bezier(0.16,1,0.3,1)' }}>
                  <p style={{ fontSize: 15, color: '#57534E', lineHeight: 1.7, margin: 0, padding: '0 28px 24px', maxWidth: 700 }}>{it.a}</p>
                </div>
              </div>
            )
          })}
        </LiquidGlass>
        <Reveal delay={100}>
          <div style={{ textAlign: 'center', marginTop: 48, display: 'flex', justifyContent: 'center', gap: 12, flexWrap: 'wrap' }}>
            <PrimaryCTA href="/login">Get started — it's free</PrimaryCTA>
            <MiniCTA href="#product">See the product</MiniCTA>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

/* ═══════════════════════════════════════════════════════════════════════════
   FINAL CTA
   ═══════════════════════════════════════════════════════════════════════════ */

function FinalCTA() {
  return (
    <section style={{ padding: 'clamp(120px, 16vw, 200px) clamp(20px, 4vw, 32px)', background: '#0A0A0A', position: 'relative', overflow: 'hidden' }}>
      <ParticleField count={35} color="200, 200, 190" opacity={0.25} />
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', background: 'radial-gradient(55% 40% at 30% 50%, rgba(180,83,9,0.18), transparent 60%), radial-gradient(45% 45% at 75% 55%, rgba(15,118,110,0.12), transparent 60%)' }} />
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', opacity: 0.04 }}>
        <svg style={{ width: '100%', height: '100%' }}><defs><pattern id="gd" width="52" height="52" patternUnits="userSpaceOnUse"><path d="M 52 0 L 0 0 0 52" fill="none" stroke="#FAF9F7" strokeWidth="0.5" /></pattern></defs><rect width="100%" height="100%" fill="url(#gd)" /></svg>
      </div>
      <div style={{ maxWidth: 860, margin: '0 auto', textAlign: 'center', position: 'relative' }}>
        <Reveal>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 14px', background: 'rgba(255,255,255,0.06)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 100, marginBottom: 36 }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#0F766E', boxShadow: '0 0 8px rgba(15,118,110,0.5)' }} />
            <span style={{ fontSize: 12.5, fontWeight: 500, color: 'rgba(250,249,247,0.7)' }}>Free during early access · No credit card</span>
          </div>
          <h2 style={{ fontSize: 'clamp(42px, 7vw, 86px)', fontWeight: 600, letterSpacing: '-3px', lineHeight: 0.98, color: '#FAF9F7', margin: '0 0 28px' }}>
            Stop taking notes.<br />
            <span style={{ background: 'linear-gradient(135deg, #D97706, #0D9488, #8B5CF6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Start remembering.</span>
          </h2>
          <p style={{ fontSize: 'clamp(17px, 2vw, 20px)', color: 'rgba(250,249,247,0.5)', lineHeight: 1.6, fontWeight: 400, maxWidth: 580, margin: '0 auto 48px' }}>
            Turn every conversation into something your team can find, understand, and act on.
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 28 }}>
            <Link href="/login" className="rc-cta-inverted" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '16px 30px', background: '#FAF9F7', color: '#0A0A0A', borderRadius: 16, fontSize: 16.5, fontWeight: 560, textDecoration: 'none', boxShadow: '0 4px 20px rgba(250,249,247,0.15)', transition: 'all 200ms' }}>
              Get started free <ArrowRight size={17} strokeWidth={2.2} />
            </Link>
            <a href="#product" className="rc-ghost-dark" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '16px 26px', background: 'rgba(255,255,255,0.06)', backdropFilter: 'blur(12px)', color: '#FAF9F7', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 16, fontSize: 16.5, fontWeight: 500, textDecoration: 'none', transition: 'all 200ms' }}>
              Explore Recall
            </a>
          </div>
          <div style={{ display: 'flex', gap: 20, justifyContent: 'center', flexWrap: 'wrap' }}>
            {['No credit card', 'Set up in 60 seconds', 'Cancel anytime'].map(t => (
              <span key={t} style={{ fontSize: 13, color: 'rgba(250,249,247,0.35)', display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M3 6l2 2 4-4" stroke="rgba(250,249,247,0.35)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                {t}
              </span>
            ))}
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
    { title: 'Product', links: [{ label: 'Features', href: '#features' }, { label: 'How it works', href: '#how' }, { label: 'Pricing', href: '#pricing' }, { label: 'Ask Recall', href: '#product' }] },
    { title: 'Company', links: [{ label: 'About', href: '#product' }, { label: 'Contact', href: '/login' }] },
    { title: 'Resources', links: [{ label: 'FAQ', href: '#faq' }, { label: 'Privacy', href: '/privacy-policy' }, { label: 'Terms', href: '/terms' }] },
  ]
  return (
    <footer style={{ padding: '80px clamp(20px, 4vw, 32px) 52px', background: '#FAF9F7', borderTop: '1px solid rgba(10,10,10,0.06)' }}>
      <div style={{ maxWidth: 1320, margin: '0 auto' }}>
        <div className="rc-footer-grid" style={{ display: 'grid', gridTemplateColumns: '2fr repeat(3, 1fr)', gap: 48 }}>
          <div>
            <Logo />
            <p style={{ fontSize: 14.5, color: '#57534E', margin: '18px 0 24px', maxWidth: 340, lineHeight: 1.6 }}>Meeting intelligence for people who can't afford to forget what happened.</p>
            <PrimaryCTA href="/login">Get started free</PrimaryCTA>
          </div>
          {groups.map(g => (
            <div key={g.title}>
              <p style={{ fontSize: 11, fontWeight: 600, color: '#78716C', textTransform: 'uppercase', letterSpacing: '0.8px', margin: '0 0 18px' }}>{g.title}</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {g.links.map(l => (
                  l.href.startsWith('/') ? (
                    <Link key={l.label} href={l.href} className="rc-footer-link" style={{ fontSize: 14, color: '#57534E', textDecoration: 'none', transition: 'color 200ms' }}>{l.label}</Link>
                  ) : (
                    <a key={l.label} href={l.href} className="rc-footer-link" style={{ fontSize: 14, color: '#57534E', textDecoration: 'none', transition: 'color 200ms' }}>{l.label}</a>
                  )
                ))}
              </div>
            </div>
          ))}
        </div>
        <div style={{ marginTop: 72, paddingTop: 28, borderTop: '1px solid rgba(10,10,10,0.06)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
          <p style={{ fontSize: 13, color: '#78716C', margin: 0 }}>© {new Date().getFullYear()} Recall. All rights reserved.</p>
          <p style={{ fontSize: 13, color: '#A8A29E', margin: 0, fontStyle: 'italic' }}>Meeting intelligence, built quietly.</p>
        </div>
      </div>
    </footer>
  )
}

/* ═══════════════════════════════════════════════════════════════════════════
   SCROLL PROGRESS BAR
   ═══════════════════════════════════════════════════════════════════════════ */

function ScrollProgress() {
  const progress = useScrollProgress()
  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, height: 2, zIndex: 200, pointerEvents: 'none' }}>
      <div style={{
        height: '100%', width: `${progress * 100}%`,
        background: 'linear-gradient(90deg, #B45309, #0F766E, #7C3AED)',
        borderRadius: '0 2px 2px 0',
        transition: 'width 50ms linear',
        boxShadow: '0 0 8px rgba(180,83,9,0.3)',
      }} />
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════════════════
   GLOBAL STYLES
   ═══════════════════════════════════════════════════════════════════════════ */

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;450;500;550;600;700&display=swap');

*{box-sizing:border-box}
html{scroll-behavior:smooth}
html,body{
  margin:0;background:#FAF9F7;color:#0A0A0A;
  font-family:'Inter',-apple-system,BlinkMacSystemFont,'SF Pro Text','Helvetica Neue',sans-serif;
  -webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale;
  text-rendering:optimizeLegibility;font-feature-settings:'ss01','cv11';
}

@keyframes rc-fadein{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:none}}

@keyframes rc-pulse{0%,100%{opacity:1;transform:scale(1)}50%{opacity:.35;transform:scale(1.35)}}
.rc-pulse-dot{animation:rc-pulse 2s cubic-bezier(.4,0,.6,1) infinite}

@keyframes rc-wave{0%,100%{transform:scaleY(.45);opacity:.5}50%{transform:scaleY(1);opacity:1}}
.rc-wave-bar{animation:rc-wave 1.2s ease-in-out infinite;transform-origin:bottom}

@keyframes rc-spin{from{transform:rotate(0)}to{transform:rotate(360deg)}}
.rc-spinner{animation:rc-spin .75s linear infinite}

@keyframes rc-float-1{0%,100%{transform:translate(0,0) scale(1)}33%{transform:translate(35px,-25px) scale(1.06)}66%{transform:translate(-18px,18px) scale(.94)}}
@keyframes rc-float-2{0%,100%{transform:translate(0,0) scale(1)}33%{transform:translate(-28px,28px) scale(1.08)}66%{transform:translate(22px,-12px) scale(.92)}}
@keyframes rc-float-3{0%,100%{transform:translate(0,0) scale(1)}33%{transform:translate(22px,18px) scale(.96)}66%{transform:translate(-32px,-22px) scale(1.04)}}
.rc-orb-1{animation:rc-float-1 22s ease-in-out infinite}
.rc-orb-2{animation:rc-float-2 28s ease-in-out infinite}
.rc-orb-3{animation:rc-float-3 25s ease-in-out infinite}

@keyframes rc-gradient-shift{0%{background-position:0% 50%}50%{background-position:100% 50%}100%{background-position:0% 50%}}
.rc-hero-gradient{animation:rc-gradient-shift 5s ease-in-out infinite}

.rc-nav-link:hover{color:#0A0A0A!important;background:rgba(10,10,10,.04)}
.rc-cta-primary:hover{transform:translateY(-2px)!important;box-shadow:0 8px 28px rgba(0,0,0,.25),0 0 0 .5px rgba(255,255,255,.08) inset!important}
.rc-cta-secondary:hover{background:rgba(255,255,255,.7)!important;border-color:rgba(255,255,255,.9)!important;transform:translateY(-1px)}
.rc-cta-mini:hover{background:rgba(255,255,255,.7)!important;border-color:rgba(255,255,255,.8)!important;transform:translateY(-1px)}
.rc-cta-inverted:hover{transform:translateY(-2px)!important;box-shadow:0 8px 32px rgba(250,249,247,.25)!important}
.rc-ghost-dark:hover{background:rgba(255,255,255,.1)!important}
.rc-tab:hover{background:rgba(255,255,255,.35);color:#0A0A0A}
.rc-suggestion:hover{border-color:rgba(10,10,10,.18)!important;background:rgba(255,255,255,.65)!important}
.rc-footer-link:hover{color:#0A0A0A!important}
.rc-transcript-line:hover{background:rgba(255,255,255,.25)}
.rc-topic-chip:hover{background:rgba(255,255,255,.7)!important}
.rc-source-chip:hover{background:rgba(255,255,255,.75)!important}
.rc-faq-btn:hover{background:rgba(255,255,255,.15)!important}
.rc-mini-tab:hover{background:rgba(255,255,255,.4)!important;color:#0A0A0A!important}
.rc-hover-lift:hover{transform:translateY(-3px)!important;box-shadow:0 0 0 .5px rgba(255,255,255,.5) inset,0 16px 48px -8px rgba(0,0,0,.1),0 6px 16px rgba(0,0,0,.04)!important}

*:focus-visible{outline:2px solid #0A0A0A;outline-offset:2px;border-radius:4px}

@media(max-width:900px){
  .rc-nav-links,.rc-nav-cta{display:none!important}
  .rc-menu-btn{display:inline-flex!important}
  .rc-mobile-menu{display:flex!important}
}
@media(max-width:860px){
  .rc-hero-body{grid-template-columns:1fr!important}
  .rc-hero-body>div:first-child{border-right:none!important;border-bottom:1px solid rgba(255,255,255,.3)}
  .rc-showcase-body{grid-template-columns:1fr!important}
  .rc-showcase-side{border-left:none!important;border-top:1px solid rgba(255,255,255,.3)}
  .rc-ask-grid,.rc-workflow-grid{grid-template-columns:1fr!important;gap:48px!important}
  .rc-pricing-grid{grid-template-columns:1fr!important}
  .rc-stages{grid-template-columns:1fr 1fr!important;gap:28px!important}
  .rc-stages>div{border-left:none!important}
  .rc-summary-grid{grid-template-columns:1fr!important}
  .rc-footer-grid{grid-template-columns:1fr 1fr!important}
}
@media(max-width:480px){
  .rc-footer-grid{grid-template-columns:1fr!important;gap:36px!important}
  .rc-stages{grid-template-columns:1fr!important}
}

@media(prefers-reduced-motion:reduce){
  *,*::before,*::after{animation-duration:.01ms!important;animation-iteration-count:1!important;transition-duration:.01ms!important}
  html{scroll-behavior:auto}
  .rc-orb-1,.rc-orb-2,.rc-orb-3,.rc-hero-gradient,.rc-pulse-dot,.rc-spinner,.rc-wave-bar{animation:none!important}
}

::selection{background:rgba(180,83,9,.12);color:#0A0A0A}
::-webkit-scrollbar{width:7px}
::-webkit-scrollbar-track{background:transparent}
::-webkit-scrollbar-thumb{background:rgba(10,10,10,.1);border-radius:100px;border:1.5px solid transparent;background-clip:content-box}
::-webkit-scrollbar-thumb:hover{background:rgba(10,10,10,.18);background-clip:content-box}
`

/* ═══════════════════════════════════════════════════════════════════════════
   PAGE EXPORT
   ═══════════════════════════════════════════════════════════════════════════ */

export default function LandingPage() {
  return (
    <>
      <style>{CSS}</style>
      <ScrollGradientBackground />
      <ScrollProgress />
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
        <Privacy />
        <Pricing />
        <FAQ />
        <FinalCTA />
      </main>
      <Footer />
    </>
  )
}