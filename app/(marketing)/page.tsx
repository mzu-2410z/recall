'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'

/* ─── Scroll-reveal hook ──────────────────────────────────────────────────── */
function useReveal() {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect() } },
      { threshold: 0.08, rootMargin: '0px 0px -40px 0px' }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])
  return { ref, visible }
}

function Reveal({ children, delay = 0, className = '' }: { children: React.ReactNode; delay?: number; className?: string }) {
  const { ref, visible } = useReveal()
  return (
    <div ref={ref} className={className} style={{
      opacity: visible ? 1 : 0,
      transform: visible ? 'translateY(0)' : 'translateY(24px)',
      transition: `opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms, transform 0.8s cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms`,
    }}>{children}</div>
  )
}

/* ─── Seed data ────────────────────────────────────────────────────────────── */
const TRANSCRIPT = [
  { s: 'Sarah Chen', i: 'SC', c: '#0071e3', t: '0:00', text: "Let's align on the Q3 launch. We need to finalize the pricing model by end of week." },
  { s: 'Marcus Rivera', i: 'MR', c: '#34C759', t: '0:43', text: "Enterprise tier pricing needs sign-off from finance before we can proceed." },
  { s: 'Sarah Chen', i: 'SC', c: '#0071e3', t: '1:12', text: "Marcus, can you own that conversation? Target Tuesday for finance sign-off." },
  { s: 'James Park', i: 'JP', c: '#FF9500', t: '1:38', text: "I'd recommend a soft launch first — beta users for two weeks, then GA." },
  { s: 'Marcus Rivera', i: 'MR', c: '#34C759', t: '2:05', text: "We have 47 beta users ready. I'll coordinate outreach as soon as pricing is locked." },
]

const SUMMARY = {
  text: "The team aligned on a phased Q3 product launch strategy with clear ownership established for each workstream.",
  takeaways: [
    'Soft launch to 47 beta users before general availability',
    'Enterprise pricing requires finance sign-off by Tuesday',
    'Marcus owns finance alignment; Sarah owns announcement draft',
  ],
  decisions: ['Phased launch: beta first, then GA', 'Enterprise tier pricing finalised by Tuesday'],
  actions: [
    { text: 'Get finance approval on enterprise pricing', owner: 'Marcus Rivera', due: 'Tue' },
    { text: 'Coordinate beta user outreach (47 users)', owner: 'Marcus Rivera', due: 'This week' },
    { text: 'Draft GA announcement', owner: 'Sarah Chen', due: 'Mon' },
  ],
  topics: ['Q3 Launch', 'Pricing', 'Beta Users', 'Finance', 'Timeline'],
}

/* ─── Product mockup ───────────────────────────────────────────────────────── */
function ProductMockup({ slim = false }: { slim?: boolean }) {
  return (
    <div className="lp-product-mockup" style={{
      maxWidth: slim ? '100%' : 1040,
      margin: '0 auto',
      background: 'rgba(255,255,255,0.75)',
      backdropFilter: 'blur(40px) saturate(180%)',
      WebkitBackdropFilter: 'blur(40px) saturate(180%)',
      borderRadius: slim ? 18 : 22,
      border: '1px solid rgba(255,255,255,0.9)',
      boxShadow: '0 30px 80px -20px rgba(0,0,0,0.15), 0 8px 32px rgba(0,0,0,0.06), 0 0 0 0.5px rgba(0,0,0,0.04)',
      overflow: 'hidden',
    }}>
      {/* Window chrome */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '13px 18px', background: 'rgba(249,249,251,0.8)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
        <div style={{ width: 11, height: 11, borderRadius: '50%', background: '#FF5F57' }} />
        <div style={{ width: 11, height: 11, borderRadius: '50%', background: '#FFBD2E' }} />
        <div style={{ width: 11, height: 11, borderRadius: '50%', background: '#28CA41' }} />
        <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
          <div style={{ background: 'rgba(255,255,255,0.7)', border: '1px solid rgba(0,0,0,0.06)', borderRadius: 7, padding: '4px 16px', fontSize: 11, color: '#86868B', fontWeight: 500, letterSpacing: '-0.1px' }}>
            Q3 Product Strategy — May 14, 2025 · 47 min
          </div>
        </div>
      </div>
      {/* Body */}
      <div style={{ display: 'flex', height: slim ? 320 : 480, background: '#ffffff' }}>
        {/* Transcript */}
        <div style={{ flex: 1, padding: '20px 22px', borderRight: '1px solid rgba(0,0,0,0.05)', position: 'relative', overflow: 'hidden' }}>
          <p style={{ fontSize: 11, fontWeight: 600, color: '#86868B', textTransform: 'uppercase', letterSpacing: '0.6px', marginBottom: 16 }}>Transcript</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {TRANSCRIPT.slice(0, slim ? 3 : 5).map((seg, i) => (
              <div key={i} style={{ display: 'flex', gap: 10 }}>
                <div style={{ flexShrink: 0, width: 26, height: 26, borderRadius: '50%', background: seg.c + '15', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 9, fontWeight: 700, color: seg.c, border: `1px solid ${seg.c}25` }}>{seg.i}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', gap: 6, alignItems: 'center', marginBottom: 3 }}>
                    <span style={{ fontSize: 12, fontWeight: 600, color: '#1D1D1F', letterSpacing: '-0.1px' }}>{seg.s}</span>
                    <span style={{ fontSize: 10, color: '#A0A0A8', fontVariantNumeric: 'tabular-nums' }}>{seg.t}</span>
                  </div>
                  <p style={{ fontSize: 12.5, color: '#3D3D3F', lineHeight: 1.55, margin: 0, letterSpacing: '-0.1px' }}>{seg.text}</p>
                </div>
              </div>
            ))}
          </div>
          <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 80, background: 'linear-gradient(transparent, white)', pointerEvents: 'none' }} />
        </div>
        {/* Summary */}
        <div style={{ width: slim ? 220 : 320, padding: '20px 22px', position: 'relative', overflow: 'hidden', background: 'linear-gradient(180deg, #FAFAFB 0%, #ffffff 100%)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 14 }}>
            <div style={{ width: 18, height: 18, borderRadius: 5, background: 'linear-gradient(135deg, #0071e3, #34aadc)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M5 1L6.2 3.8L9 5L6.2 6.2L5 9L3.8 6.2L1 5L3.8 3.8L5 1Z" fill="white" /></svg>
            </div>
            <p style={{ fontSize: 11.5, fontWeight: 650, color: '#1D1D1F', margin: 0, letterSpacing: '-0.1px' }}>AI Summary</p>
          </div>
          <p style={{ fontSize: 12.5, color: '#3D3D3F', lineHeight: 1.6, marginBottom: 16, letterSpacing: '-0.1px' }}>{SUMMARY.text}</p>
          <p style={{ fontSize: 9.5, fontWeight: 700, color: '#A0A0A8', textTransform: 'uppercase', letterSpacing: '0.7px', marginBottom: 8 }}>Key Takeaways</p>
          <div style={{ marginBottom: 16 }}>
            {SUMMARY.takeaways.slice(0, slim ? 2 : 3).map((t, i) => (
              <div key={i} style={{ display: 'flex', gap: 6, marginBottom: 5 }}>
                <span style={{ color: '#0071e3', fontSize: 11, flexShrink: 0, marginTop: 1 }}>→</span>
                <p style={{ fontSize: 12, color: '#3D3D3F', lineHeight: 1.45, margin: 0, letterSpacing: '-0.05px' }}>{t}</p>
              </div>
            ))}
          </div>
          <p style={{ fontSize: 9.5, fontWeight: 700, color: '#A0A0A8', textTransform: 'uppercase', letterSpacing: '0.7px', marginBottom: 8 }}>Action Items</p>
          {SUMMARY.actions.slice(0, slim ? 2 : 3).map((a, i) => (
            <div key={i} style={{ display: 'flex', gap: 8, alignItems: 'flex-start', marginBottom: 8 }}>
              <div style={{ width: 14, height: 14, borderRadius: 4, border: '1.5px solid #0071e3', flexShrink: 0, marginTop: 1 }} />
              <div>
                <p style={{ fontSize: 12, color: '#1D1D1F', margin: 0, lineHeight: 1.35, fontWeight: 500 }}>{a.text}</p>
                <p style={{ fontSize: 10.5, color: '#A0A0A8', margin: 0, marginTop: 1 }}>{a.owner} · {a.due}</p>
              </div>
            </div>
          ))}
          {!slim && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, marginTop: 12 }}>
              {SUMMARY.topics.map((t, i) => (
                <span key={i} style={{ fontSize: 11, padding: '2px 9px', background: 'rgba(0,113,227,0.07)', color: '#0071e3', borderRadius: 100, fontWeight: 500, border: '1px solid rgba(0,113,227,0.12)' }}>{t}</span>
              ))}
            </div>
          )}
          <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 70, background: 'linear-gradient(transparent, white)', pointerEvents: 'none' }} />
        </div>
      </div>
    </div>
  )
}

/* ─── Live intelligence mockup ─────────────────────────────────────────────── */
function LiveIntelligenceMockup() {
  const messages = [
    { s: 'Priya Sharma', i: 'PS', c: '#0071e3', t: '12:31', text: "The design system needs a full token migration before we ship v2." },
    { s: 'Devon Blake', i: 'DB', c: '#5e5ce6', t: '12:38', text: "Agreed. If we move to Figma tokens, we can auto-sync across all three apps." },
    { s: 'Elena Rostova', i: 'ER', c: '#FF9500', t: '12:44', text: "Let's target end of month. Priya, can you draft the migration plan?" },
    { s: 'Priya Sharma', i: 'PS', c: '#0071e3', t: '12:47', text: "Yes, I'll have the migration plan ready by Wednesday", live: true },
  ]

  const insights = [
    { icon: '□', color: '#0071e3', label: 'Action Item', text: 'Priya to draft token migration plan', meta: 'Due Wed · Owner: Priya', time: 'just now', fresh: true },
    { icon: '✓', color: '#34C759', label: 'Decision', text: 'Adopt Figma tokens for cross-app sync', meta: '', time: '9s ago' },
    { icon: '◇', color: '#5e5ce6', label: 'Topic Detected', text: 'Design System v2 · Token Migration', meta: '', time: '32s ago' },
    { icon: '?', color: '#FF9500', label: 'Open Question', text: 'Rollout timeline confirmation needed', meta: '', time: '1m ago' },
  ]

  return (
    <div className="lp-product-mockup" style={{
      maxWidth: 1040, margin: '0 auto',
      background: 'rgba(255,255,255,0.75)',
      backdropFilter: 'blur(40px) saturate(180%)',
      WebkitBackdropFilter: 'blur(40px) saturate(180%)',
      borderRadius: 22,
      border: '1px solid rgba(255,255,255,0.9)',
      boxShadow: '0 30px 80px -20px rgba(0,0,0,0.15), 0 8px 32px rgba(0,0,0,0.06), 0 0 0 0.5px rgba(0,0,0,0.04)',
      overflow: 'hidden',
    }}>
      {/* Window chrome with LIVE badge */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '13px 18px', background: 'rgba(249,249,251,0.8)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
        <div style={{ width: 11, height: 11, borderRadius: '50%', background: '#FF5F57' }} />
        <div style={{ width: 11, height: 11, borderRadius: '50%', background: '#FFBD2E' }} />
        <div style={{ width: 11, height: 11, borderRadius: '50%', background: '#28CA41' }} />
        <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 10 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(255,59,48,0.1)', border: '1px solid rgba(255,59,48,0.25)', borderRadius: 100, padding: '3px 10px' }}>
            <span className="lp-live-pulse" style={{ width: 6, height: 6, borderRadius: '50%', background: '#FF3B30' }} />
            <span style={{ fontSize: 10.5, fontWeight: 650, color: '#FF3B30', letterSpacing: '0.5px', textTransform: 'uppercase' }}>Live</span>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.7)', border: '1px solid rgba(0,0,0,0.06)', borderRadius: 7, padding: '4px 14px', fontSize: 11, color: '#86868B', fontWeight: 500, letterSpacing: '-0.1px' }}>
            Design System v2 Sync · 12:47
          </div>
        </div>
      </div>

      {/* Body split */}
      <div className="lp-live-body" style={{ display: 'flex', height: 520, background: '#ffffff' }}>

        {/* LEFT: Waveform + live transcript */}
        <div style={{ flex: 1.15, padding: '20px 22px', borderRight: '1px solid rgba(0,0,0,0.05)', position: 'relative', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <p style={{ fontSize: 11, fontWeight: 600, color: '#86868B', textTransform: 'uppercase', letterSpacing: '0.6px', margin: 0 }}>Live Transcript</p>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: 2.5, height: 20 }}>
                {[0.4, 0.7, 0.9, 0.5, 0.85, 0.6, 0.95, 0.55, 0.75, 0.45, 0.8, 0.65].map((h, i) => (
                  <span key={i} className="lp-wave-bar" style={{
                    width: 2.5, height: `${h * 100}%`,
                    background: 'linear-gradient(180deg, #0071e3, #5e5ce6)',
                    borderRadius: 2, animationDelay: `${i * 0.08}s`,
                  }} />
                ))}
              </div>
              <span style={{ fontSize: 10.5, color: '#86868B', fontVariantNumeric: 'tabular-nums', fontWeight: 500 }}>3 speakers</span>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 16, flex: 1 }}>
            {messages.map((m, i) => (
              <div key={i} style={{ display: 'flex', gap: 10 }}>
                <div style={{ flexShrink: 0, width: 26, height: 26, borderRadius: '50%', background: m.c + '15', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 9, fontWeight: 700, color: m.c, border: `1px solid ${m.c}25` }}>{m.i}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', gap: 6, alignItems: 'center', marginBottom: 3, flexWrap: 'wrap' }}>
                    <span style={{ fontSize: 12, fontWeight: 600, color: '#1D1D1F', letterSpacing: '-0.1px' }}>{m.s}</span>
                    <span style={{ fontSize: 10, color: '#A0A0A8', fontVariantNumeric: 'tabular-nums' }}>{m.t}</span>
                    {m.live && (
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 9.5, color: '#FF3B30', fontWeight: 650, textTransform: 'uppercase', letterSpacing: '0.5px', marginLeft: 4 }}>
                        <span className="lp-live-pulse" style={{ width: 4, height: 4, borderRadius: '50%', background: '#FF3B30' }} />
                        Speaking
                      </span>
                    )}
                  </div>
                  <p style={{ fontSize: 12.5, color: '#3D3D3F', lineHeight: 1.55, margin: 0, letterSpacing: '-0.1px' }}>
                    {m.text}
                    {m.live && <span className="lp-cursor" style={{ display: 'inline-block', width: 2, height: 13, background: '#0071e3', marginLeft: 3, verticalAlign: '-2px', borderRadius: 1 }} />}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 50, background: 'linear-gradient(transparent, white)', pointerEvents: 'none' }} />
        </div>

        {/* RIGHT: AI extracting live */}
        <div className="lp-live-panel" style={{ width: 360, padding: '20px 22px', position: 'relative', overflow: 'hidden', background: 'linear-gradient(180deg, #FAFAFB 0%, #ffffff 100%)', display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <div style={{ width: 18, height: 18, borderRadius: 5, background: 'linear-gradient(135deg, #0071e3, #5e5ce6)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M5 1L6.2 3.8L9 5L6.2 6.2L5 9L3.8 6.2L1 5L3.8 3.8L5 1Z" fill="white" /></svg>
              </div>
              <p style={{ fontSize: 11.5, fontWeight: 650, color: '#1D1D1F', margin: 0, letterSpacing: '-0.1px' }}>AI Extracting</p>
            </div>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 10.5, color: '#34C759', fontWeight: 600 }}>
              <span className="lp-live-pulse" style={{ width: 5, height: 5, borderRadius: '50%', background: '#34C759' }} />
              Real-time
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, flex: 1 }}>
            {insights.map((ins, i) => (
              <div
                key={i}
                className={ins.fresh ? 'lp-insight-fresh' : ''}
                style={{
                  background: ins.fresh ? `${ins.color}0D` : 'rgba(255,255,255,0.7)',
                  border: `1px solid ${ins.fresh ? ins.color + '35' : 'rgba(0,0,0,0.06)'}`,
                  borderRadius: 12, padding: '12px 14px',
                  boxShadow: ins.fresh ? `0 4px 16px ${ins.color}20` : '0 1px 2px rgba(0,0,0,0.02)',
                  backdropFilter: 'blur(10px)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 7 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <div style={{ width: 18, height: 18, borderRadius: 5, background: `${ins.color}18`, border: `1px solid ${ins.color}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, color: ins.color, fontWeight: 700 }}>{ins.icon}</div>
                    <span style={{ fontSize: 10.5, fontWeight: 650, color: ins.color, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{ins.label}</span>
                  </div>
                  <span style={{ fontSize: 10, color: '#A0A0A8', fontWeight: 500 }}>{ins.time}</span>
                </div>
                <p style={{ fontSize: 12.5, color: '#1D1D1F', margin: 0, lineHeight: 1.45, fontWeight: 500, letterSpacing: '-0.1px' }}>{ins.text}</p>
                {ins.meta && <p style={{ fontSize: 11, color: '#86868B', margin: '4px 0 0', fontWeight: 450 }}>{ins.meta}</p>}
              </div>
            ))}
          </div>

          {/* Live stats footer */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '11px 14px', marginTop: 14, background: 'linear-gradient(135deg, rgba(0,113,227,0.05), rgba(94,92,230,0.05))', border: '1px solid rgba(0,113,227,0.12)', borderRadius: 10 }}>
            <div style={{ textAlign: 'center', flex: 1 }}>
              <p style={{ fontSize: 17, fontWeight: 700, background: 'linear-gradient(135deg, #0071e3, #5e5ce6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', margin: 0, lineHeight: 1, letterSpacing: '-0.3px' }}>12</p>
              <p style={{ fontSize: 9.5, color: '#86868B', margin: '3px 0 0', fontWeight: 550, textTransform: 'uppercase', letterSpacing: '0.4px' }}>Insights</p>
            </div>
            <div style={{ width: 1, height: 28, background: 'rgba(0,113,227,0.15)' }} />
            <div style={{ textAlign: 'center', flex: 1 }}>
              <p style={{ fontSize: 17, fontWeight: 700, color: '#0071e3', margin: 0, lineHeight: 1, letterSpacing: '-0.3px' }}>4</p>
              <p style={{ fontSize: 9.5, color: '#86868B', margin: '3px 0 0', fontWeight: 550, textTransform: 'uppercase', letterSpacing: '0.4px' }}>Actions</p>
            </div>
            <div style={{ width: 1, height: 28, background: 'rgba(0,113,227,0.15)' }} />
            <div style={{ textAlign: 'center', flex: 1 }}>
              <p style={{ fontSize: 17, fontWeight: 700, color: '#34C759', margin: 0, lineHeight: 1, letterSpacing: '-0.3px' }}>3</p>
              <p style={{ fontSize: 9.5, color: '#86868B', margin: '3px 0 0', fontWeight: 550, textTransform: 'uppercase', letterSpacing: '0.4px' }}>Decisions</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ─── Nav ──────────────────────────────────────────────────────────────────── */
function Nav() {
  const [scrolled, setScrolled] = useState(false)
  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 16)
    window.addEventListener('scroll', h, { passive: true })
    return () => window.removeEventListener('scroll', h)
  }, [])

  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
      background: scrolled ? 'rgba(255,255,255,0.72)' : 'rgba(255,255,255,0.5)',
      backdropFilter: 'blur(24px) saturate(180%)',
      WebkitBackdropFilter: 'blur(24px) saturate(180%)',
      borderBottom: scrolled ? '1px solid rgba(0,0,0,0.06)' : '1px solid rgba(0,0,0,0.02)',
      transition: 'background 0.3s cubic-bezier(0.16,1,0.3,1), border-color 0.3s',
    }}>
      <div style={{ maxWidth: 1160, margin: '0 auto', padding: '0 24px', height: 60, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none' }}>
          <div style={{ width: 28, height: 28, background: 'linear-gradient(135deg, #0071e3, #34aadc)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 6px rgba(0,113,227,0.25)' }}>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <circle cx="7" cy="7" r="5" stroke="white" strokeWidth="1.5" />
              <circle cx="7" cy="7" r="1.75" fill="white" />
            </svg>
          </div>
          <span style={{ fontSize: 17, fontWeight: 600, color: '#1D1D1F', letterSpacing: '-0.35px' }}>Recall</span>
        </Link>

        <div style={{ display: 'flex', alignItems: 'center', gap: 32 }} className="lp-nav-links">
          {[['#product', 'Product'], ['#howitworks', 'How it works'], ['#features', 'Features']].map(([href, label]) => (
            <a key={href} href={href} className="lp-nav-link" style={{ fontSize: 13.5, fontWeight: 450, color: '#1D1D1F', textDecoration: 'none', opacity: 0.85, letterSpacing: '-0.1px', transition: 'opacity 0.2s' }}>{label}</a>
          ))}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Link href="/login" className="lp-nav-link" style={{ fontSize: 13.5, fontWeight: 450, color: '#1D1D1F', textDecoration: 'none', padding: '7px 12px', opacity: 0.85 }}>Sign in</Link>
          <Link href="/login" className="lp-cta-nav" style={{ fontSize: 13.5, fontWeight: 550, color: 'white', textDecoration: 'none', padding: '8px 18px', background: 'linear-gradient(180deg, #0077ED, #0071e3)', borderRadius: 100, letterSpacing: '-0.1px', boxShadow: '0 1px 3px rgba(0,113,227,0.3), inset 0 1px 0 rgba(255,255,255,0.15)' }}>Get started</Link>
        </div>
      </div>
    </nav>
  )
}

/* ─── Hero ─────────────────────────────────────────────────────────────────── */
function Hero() {
  const [in_, setIn] = useState(false)
  useEffect(() => { const t = setTimeout(() => setIn(true), 80); return () => clearTimeout(t) }, [])

  const fade = (d = 0) => ({
    opacity: in_ ? 1 : 0,
    transform: in_ ? 'translateY(0)' : 'translateY(20px)',
    transition: `opacity 0.85s cubic-bezier(0.16,1,0.3,1) ${d}ms, transform 0.85s cubic-bezier(0.16,1,0.3,1) ${d}ms`,
  })

  return (
    <section style={{ paddingTop: 140, paddingBottom: 90, background: 'linear-gradient(180deg, #FAFAFA 0%, #F5F5F7 50%, #FAFAFA 100%)', overflow: 'hidden', position: 'relative' }}>
      {/* Ambient glows */}
      <div style={{ position: 'absolute', top: -100, left: '10%', width: 400, height: 400, background: 'radial-gradient(circle, rgba(0,113,227,0.12), transparent 70%)', filter: 'blur(60px)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', top: 100, right: '5%', width: 500, height: 500, background: 'radial-gradient(circle, rgba(94,92,230,0.08), transparent 70%)', filter: 'blur(80px)', pointerEvents: 'none' }} />

      <div style={{ maxWidth: 1160, margin: '0 auto', padding: '0 24px', position: 'relative', zIndex: 1 }}>
        <div style={{ textAlign: 'center', maxWidth: 780, margin: '0 auto 72px' }}>
          <div style={{ ...fade(0), display: 'inline-flex', alignItems: 'center', gap: 7, padding: '5px 14px', background: 'rgba(255,255,255,0.7)', backdropFilter: 'blur(20px)', border: '1px solid rgba(0,113,227,0.2)', borderRadius: 100, marginBottom: 28, boxShadow: '0 2px 8px rgba(0,113,227,0.06)' }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#0071e3', display: 'inline-block', boxShadow: '0 0 8px rgba(0,113,227,0.6)' }} />
            <span style={{ fontSize: 12, fontWeight: 550, color: '#0071e3', letterSpacing: '-0.05px' }}>AI Meeting Intelligence</span>
          </div>

          <h1 style={{ ...fade(80), fontSize: 'clamp(38px, 6vw, 72px)', fontWeight: 700, letterSpacing: '-2.5px', lineHeight: 1.05, color: '#1D1D1F', marginBottom: 24 }}>
            Your meetings are full of decisions.<br />
            <span style={{ background: 'linear-gradient(135deg, #0071e3 0%, #5e5ce6 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Recall</span> makes sure none of them get lost.
          </h1>

          <p style={{ ...fade(160), fontSize: 19, lineHeight: 1.6, color: '#6E6E73', fontWeight: 380, letterSpacing: '-0.2px', maxWidth: 640, margin: '0 auto 40px' }}>
            Recall records your meetings, understands what was said, and turns every conversation into searchable knowledge, decisions, and action items.
          </p>

          <div style={{ ...fade(240), display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 20 }}>
            <Link href="/login" className="lp-cta-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '14px 28px', background: 'linear-gradient(180deg, #0077ED, #0071e3)', color: 'white', borderRadius: 100, fontSize: 15, fontWeight: 600, textDecoration: 'none', letterSpacing: '-0.2px', boxShadow: '0 4px 14px rgba(0,113,227,0.35), inset 0 1px 0 rgba(255,255,255,0.15)' }}>
              Start capturing for free
              <span style={{ fontSize: 18, lineHeight: 1 }}>→</span>
            </Link>
            <a href="#howitworks" className="lp-cta-secondary" style={{ display: 'inline-flex', alignItems: 'center', padding: '14px 24px', background: 'rgba(255,255,255,0.7)', backdropFilter: 'blur(20px)', color: '#1D1D1F', border: '1px solid rgba(0,0,0,0.08)', borderRadius: 100, fontSize: 15, fontWeight: 500, textDecoration: 'none', letterSpacing: '-0.2px' }}>
              See how it works
            </a>
          </div>

          <div style={{ ...fade(320), display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16, fontSize: 12.5, color: '#86868B', fontWeight: 450, flexWrap: 'wrap' }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M3 6l2 2 4-4" stroke="#34C759" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
              Free forever plan
            </span>
            <span style={{ opacity: 0.4 }}>·</span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M3 6l2 2 4-4" stroke="#34C759" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
              No credit card
            </span>
            <span style={{ opacity: 0.4 }}>·</span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M3 6l2 2 4-4" stroke="#34C759" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
              Set up in 2 minutes
            </span>
          </div>
        </div>

        <div style={{ ...fade(360) }}>
          <ProductMockup />
        </div>
      </div>
    </section>
  )
}

/* ─── Social proof ─────────────────────────────────────────────────────────── */
function SocialProof() {
  const stats = [
    { n: '2.4M+', l: 'Meetings captured' },
    { n: '98%', l: 'Transcript accuracy' },
    { n: '12k+', l: 'Teams onboarded' },
    { n: '4.9', l: 'Average rating' },
  ]
  return (
    <section style={{ padding: '60px 24px', background: 'white', borderTop: '1px solid rgba(0,0,0,0.04)', borderBottom: '1px solid rgba(0,0,0,0.04)' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <Reveal>
          <p style={{ textAlign: 'center', fontSize: 12, fontWeight: 600, color: '#86868B', textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: 28 }}>
            Trusted by teams shipping fast
          </p>
        </Reveal>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 20 }}>
          {stats.map((s, i) => (
            <Reveal key={i} delay={i * 80}>
              <div style={{ textAlign: 'center' }}>
                <p style={{ fontSize: 34, fontWeight: 700, background: 'linear-gradient(135deg, #0071e3, #5e5ce6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', margin: 0, letterSpacing: '-1.2px', lineHeight: 1 }}>{s.n}</p>
                <p style={{ fontSize: 13, color: '#6E6E73', margin: '6px 0 0', fontWeight: 450 }}>{s.l}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ─── Problem ──────────────────────────────────────────────────────────────── */
function Problem() {
  return (
    <section id="howitworks" style={{ padding: '110px 24px', background: 'linear-gradient(180deg, white 0%, #F7F7F8 100%)' }}>
      <div style={{ maxWidth: 820, margin: '0 auto', textAlign: 'center' }}>
        <Reveal>
          <h2 style={{ fontSize: 'clamp(28px, 4.5vw, 54px)', fontWeight: 700, letterSpacing: '-1.4px', lineHeight: 1.1, color: '#1D1D1F', marginBottom: 30 }}>
            You shouldn't have to remember<br />what happened in a meeting.
          </h2>
        </Reveal>
        <Reveal delay={100}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 68, color: '#6E6E73', fontSize: 18, lineHeight: 1.7, fontWeight: 380, letterSpacing: '-0.2px' }}>
            <p style={{ margin: 0 }}>Important decisions disappear into notebooks.</p>
            <p style={{ margin: 0 }}>Action items get forgotten by Friday.</p>
            <p style={{ margin: 0 }}>Searching through old recordings takes too long.</p>
          </div>
        </Reveal>

        <Reveal delay={180}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexWrap: 'wrap', gap: 0 }}>
            {['Conversation', 'Transcript', 'Understanding', 'Action'].map((step, i, arr) => (
              <div key={step} style={{ display: 'flex', alignItems: 'center' }}>
                <div style={{ padding: '0 14px', textAlign: 'center' }}>
                  <div style={{
                    width: 44, height: 44, borderRadius: '50%',
                    background: i === 3 ? 'linear-gradient(135deg, #0071e3, #34aadc)' : 'rgba(255,255,255,0.8)',
                    backdropFilter: 'blur(20px)',
                    color: i === 3 ? 'white' : '#0071e3',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 14, fontWeight: 700, margin: '0 auto 10px',
                    border: i === 3 ? 'none' : '1px solid rgba(0,113,227,0.2)',
                    boxShadow: i === 3 ? '0 6px 20px rgba(0,113,227,0.35)' : '0 2px 8px rgba(0,0,0,0.04)',
                  }}>{i + 1}</div>
                  <span style={{ fontSize: 13, fontWeight: 600, color: '#1D1D1F', letterSpacing: '-0.2px' }}>{step}</span>
                </div>
                {i < arr.length - 1 && (
                  <span style={{ color: '#0071e3', fontSize: 18, opacity: 0.4, margin: '0 2px', marginBottom: 20 }}>→</span>
                )}
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  )
}

/* ─── Product showcase (Live Intelligence) ─────────────────────────────────── */
function ProductShowcase() {
  return (
    <section id="product" style={{ padding: '90px 24px 110px', background: 'linear-gradient(180deg, #F7F7F8 0%, #F0F0F3 100%)' }}>
      <div style={{ maxWidth: 1160, margin: '0 auto' }}>
        <Reveal>
          <div style={{ textAlign: 'center', marginBottom: 64 }}>
            <p style={{ fontSize: 13, fontWeight: 600, color: '#0071e3', textTransform: 'uppercase', letterSpacing: '1.2px', marginBottom: 14 }}>Real-Time Intelligence</p>
            <h2 style={{ fontSize: 'clamp(28px, 4.5vw, 54px)', fontWeight: 700, letterSpacing: '-1.4px', lineHeight: 1.1, color: '#1D1D1F', marginBottom: 16 }}>
              Watch AI turn conversations<br />into intelligence — live.
            </h2>
            <p style={{ fontSize: 18, color: '#6E6E73', fontWeight: 380, lineHeight: 1.6, letterSpacing: '-0.2px', maxWidth: 640, margin: '0 auto' }}>
              As people speak, Recall extracts topics, decisions, and action items in real time. No waiting for the meeting to end.
            </p>
          </div>
        </Reveal>
        <Reveal delay={120}>
          <LiveIntelligenceMockup />
        </Reveal>
        <Reveal delay={220}>
          <div style={{ textAlign: 'center', marginTop: 48 }}>
            <Link href="/login" className="lp-cta-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '13px 26px', background: 'linear-gradient(180deg, #0077ED, #0071e3)', color: 'white', borderRadius: 100, fontSize: 14.5, fontWeight: 600, textDecoration: 'none', letterSpacing: '-0.2px', boxShadow: '0 4px 14px rgba(0,113,227,0.3), inset 0 1px 0 rgba(255,255,255,0.15)' }}>
              Try Recall free <span style={{ fontSize: 16, lineHeight: 1 }}>→</span>
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

/* ─── Meeting intelligence ─────────────────────────────────────────────────── */
function MeetingIntelligence() {
  const feats = [
    { icon: '◎', label: 'Summary', desc: 'A clear, concise overview of what happened and why it mattered.' },
    { icon: '→', label: 'Key Takeaways', desc: 'The 3–7 most important insights from the conversation.' },
    { icon: '✓', label: 'Decisions', desc: 'Every decision made, clearly recorded with context.' },
    { icon: '□', label: 'Action Items', desc: 'Tasks, owners, and deadlines — automatically extracted.' },
    { icon: '◇', label: 'Topics', desc: 'Themes structured for search and review.' },
  ]

  return (
    <section id="features" style={{ padding: '110px 24px', background: 'white' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: 80, alignItems: 'center' }}>
          <Reveal>
            <div>
              <p style={{ fontSize: 13, fontWeight: 600, color: '#0071e3', textTransform: 'uppercase', letterSpacing: '1.2px', marginBottom: 14 }}>Intelligence</p>
              <h2 style={{ fontSize: 'clamp(28px, 3.8vw, 50px)', fontWeight: 700, letterSpacing: '-1.4px', lineHeight: 1.1, color: '#1D1D1F', marginBottom: 20 }}>
                More than a recording.
              </h2>
              <p style={{ fontSize: 18, color: '#6E6E73', lineHeight: 1.6, marginBottom: 44, fontWeight: 380, letterSpacing: '-0.2px' }}>
                A recording tells you what happened.<br />Recall tells you <em style={{ color: '#0071e3', fontStyle: 'normal', fontWeight: 500 }}>what matters</em>.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                {feats.map((f, i) => (
                  <div key={i} style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
                    <div style={{ width: 36, height: 36, borderRadius: 10, background: 'linear-gradient(135deg, rgba(0,113,227,0.08), rgba(94,92,230,0.08))', border: '1px solid rgba(0,113,227,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, color: '#0071e3', flexShrink: 0 }}>{f.icon}</div>
                    <div style={{ paddingTop: 2 }}>
                      <p style={{ fontSize: 15, fontWeight: 600, color: '#1D1D1F', margin: '0 0 3px', letterSpacing: '-0.2px' }}>{f.label}</p>
                      <p style={{ fontSize: 14, color: '#6E6E73', margin: 0, lineHeight: 1.5, letterSpacing: '-0.1px' }}>{f.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div style={{ marginTop: 44 }}>
                <Link href="/login" className="lp-cta-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '12px 24px', background: 'linear-gradient(180deg, #0077ED, #0071e3)', color: 'white', borderRadius: 100, fontSize: 14.5, fontWeight: 600, textDecoration: 'none', letterSpacing: '-0.2px', boxShadow: '0 4px 14px rgba(0,113,227,0.3), inset 0 1px 0 rgba(255,255,255,0.15)' }}>
                  Start capturing for free <span style={{ fontSize: 16, lineHeight: 1 }}>→</span>
                </Link>
              </div>
            </div>
          </Reveal>

          <Reveal delay={140}>
            <div style={{
              background: 'linear-gradient(135deg, rgba(0,113,227,0.05), rgba(94,92,230,0.05))',
              borderRadius: 24, padding: 28, border: '1px solid rgba(0,113,227,0.08)',
              boxShadow: '0 20px 60px -20px rgba(0,113,227,0.15)',
            }}>
              <div style={{
                background: 'rgba(255,255,255,0.9)',
                backdropFilter: 'blur(20px)',
                borderRadius: 16, padding: 24, border: '1px solid rgba(255,255,255,0.9)',
                boxShadow: '0 4px 24px rgba(0,0,0,0.05), 0 0 0 0.5px rgba(0,0,0,0.03)',
              }}>
                <div style={{ paddingBottom: 16, marginBottom: 16, borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
                  <p style={{ fontSize: 14, fontWeight: 600, color: '#1D1D1F', margin: '0 0 4px', letterSpacing: '-0.2px' }}>Q3 Product Strategy</p>
                  <p style={{ fontSize: 11.5, color: '#86868B', margin: 0 }}>May 14, 2025 · 47 min · 3 participants</p>
                </div>
                <p style={{ fontSize: 10, fontWeight: 700, color: '#A0A0A8', textTransform: 'uppercase', letterSpacing: '0.6px', marginBottom: 8 }}>Summary</p>
                <p style={{ fontSize: 12.5, color: '#3D3D3F', lineHeight: 1.6, marginBottom: 18, letterSpacing: '-0.1px' }}>{SUMMARY.text}</p>
                <p style={{ fontSize: 10, fontWeight: 700, color: '#A0A0A8', textTransform: 'uppercase', letterSpacing: '0.6px', marginBottom: 8 }}>Decisions</p>
                {SUMMARY.decisions.map((d, i) => (
                  <div key={i} style={{ display: 'flex', gap: 7, marginBottom: 5 }}>
                    <span style={{ color: '#34C759', fontSize: 12, flexShrink: 0, marginTop: 1 }}>✓</span>
                    <p style={{ fontSize: 12.5, color: '#3D3D3F', margin: 0, lineHeight: 1.45 }}>{d}</p>
                  </div>
                ))}
                <p style={{ fontSize: 10, fontWeight: 700, color: '#A0A0A8', textTransform: 'uppercase', letterSpacing: '0.6px', marginBottom: 8, marginTop: 16 }}>Action Items</p>
                {SUMMARY.actions.slice(0, 2).map((a, i) => (
                  <div key={i} style={{ display: 'flex', gap: 8, alignItems: 'flex-start', marginBottom: 8 }}>
                    <div style={{ width: 14, height: 14, borderRadius: 4, border: '1.5px solid #0071e3', flexShrink: 0, marginTop: 1 }} />
                    <div>
                      <p style={{ fontSize: 12.5, color: '#1D1D1F', margin: 0, fontWeight: 500 }}>{a.text}</p>
                      <p style={{ fontSize: 10.5, color: '#86868B', margin: 0 }}>{a.owner} · {a.due}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}

/* ─── Ask Recall ───────────────────────────────────────────────────────────── */
function AskRecall() {
  const [phase, setPhase] = useState<'idle' | 'asked' | 'loading' | 'answered'>('idle')
  const { ref, visible } = useReveal()

  useEffect(() => {
    if (!visible) return
    const ts = [
      setTimeout(() => setPhase('asked'), 700),
      setTimeout(() => setPhase('loading'), 1900),
      setTimeout(() => setPhase('answered'), 3100),
    ]
    return () => ts.forEach(clearTimeout)
  }, [visible])

  return (
    <section style={{ padding: '110px 24px', background: 'linear-gradient(180deg, #F7F7F8 0%, #EFEFF2 100%)', position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', top: '30%', left: '5%', width: 300, height: 300, background: 'radial-gradient(circle, rgba(94,92,230,0.08), transparent 70%)', filter: 'blur(60px)', pointerEvents: 'none' }} />
      <div style={{ maxWidth: 900, margin: '0 auto', position: 'relative', zIndex: 1 }}>
        <Reveal>
          <div style={{ textAlign: 'center', marginBottom: 64 }}>
            <p style={{ fontSize: 13, fontWeight: 600, color: '#0071e3', textTransform: 'uppercase', letterSpacing: '1.2px', marginBottom: 14 }}>Ask Anything</p>
            <h2 style={{ fontSize: 'clamp(28px, 4.5vw, 54px)', fontWeight: 700, letterSpacing: '-1.4px', lineHeight: 1.1, color: '#1D1D1F', marginBottom: 16 }}>
              Your entire meeting history.<br />One question away.
            </h2>
            <p style={{ fontSize: 18, color: '#6E6E73', fontWeight: 380, lineHeight: 1.6, letterSpacing: '-0.2px' }}>
              Ask Recall about conversations you've already had and get answers without digging through recordings.
            </p>
          </div>
        </Reveal>

        <div ref={ref} style={{
          background: 'rgba(255,255,255,0.75)',
          backdropFilter: 'blur(40px) saturate(180%)',
          WebkitBackdropFilter: 'blur(40px) saturate(180%)',
          borderRadius: 24,
          border: '1px solid rgba(255,255,255,0.9)',
          boxShadow: '0 20px 60px -10px rgba(0,0,0,0.1), 0 0 0 0.5px rgba(0,0,0,0.04)',
          overflow: 'hidden',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '14px 22px', background: 'rgba(250,250,251,0.6)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
            <div style={{ width: 26, height: 26, background: 'linear-gradient(135deg, #0071e3, #5e5ce6)', borderRadius: 7, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 6px rgba(0,113,227,0.25)' }}>
              <svg width="13" height="13" viewBox="0 0 12 12" fill="none"><circle cx="6" cy="6" r="4" stroke="white" strokeWidth="1.5" /><circle cx="6" cy="6" r="1.5" fill="white" /></svg>
            </div>
            <span style={{ fontSize: 13.5, fontWeight: 600, color: '#1D1D1F', letterSpacing: '-0.15px' }}>Ask Recall</span>
            <span style={{ fontSize: 12, color: '#86868B' }}>· Search across all your meetings</span>
          </div>

          <div style={{ padding: '28px 26px 14px', minHeight: 280 }}>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 22, opacity: phase === 'idle' ? 0 : 1, transform: phase === 'idle' ? 'translateY(8px)' : 'none', transition: 'opacity 0.4s cubic-bezier(0.16,1,0.3,1), transform 0.4s cubic-bezier(0.16,1,0.3,1)' }}>
              <div style={{ background: 'linear-gradient(135deg, #0077ED, #0071e3)', color: 'white', padding: '11px 18px', borderRadius: '20px 20px 4px 20px', fontSize: 14, maxWidth: '72%', lineHeight: 1.5, boxShadow: '0 4px 14px rgba(0,113,227,0.25)', letterSpacing: '-0.1px' }}>
                What did we decide about the Q3 launch?
              </div>
            </div>

            {phase === 'loading' && (
              <div style={{ display: 'flex', gap: 6, padding: '10px 14px' }}>
                {[0, 1, 2].map(i => (
                  <div key={i} style={{ width: 8, height: 8, borderRadius: '50%', background: '#0071e3', animationDelay: `${i * 0.18}s` }} className="lp-dot" />
                ))}
              </div>
            )}

            {phase === 'answered' && (
              <div style={{ animation: 'lp-fadein 0.5s cubic-bezier(0.16,1,0.3,1)' }}>
                <div style={{ background: 'rgba(245,245,247,0.9)', backdropFilter: 'blur(20px)', padding: '16px 20px', borderRadius: '4px 20px 20px 20px', fontSize: 14, lineHeight: 1.7, color: '#1D1D1F', maxWidth: '82%', marginBottom: 12, border: '1px solid rgba(0,0,0,0.04)', letterSpacing: '-0.1px' }}>
                  <p style={{ margin: '0 0 12px' }}>Based on your <strong style={{ color: '#0071e3' }}>Q3 Product Strategy</strong> meeting (May 14, 2025), the team decided on a phased launch approach:</p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                    {['Soft launch to 47 beta users first', 'Two-week beta period before general availability', 'Enterprise pricing sign-off from finance (Marcus Rivera, by Tuesday)'].map((item, i) => (
                      <div key={i} style={{ display: 'flex', gap: 8 }}>
                        <span style={{ color: '#0071e3', flexShrink: 0 }}>→</span>
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                  <span style={{ fontSize: 11.5, color: '#86868B' }}>Source:</span>
                  <span style={{ fontSize: 11.5, padding: '3px 10px', background: 'rgba(0,113,227,0.08)', color: '#0071e3', borderRadius: 100, fontWeight: 500, border: '1px solid rgba(0,113,227,0.12)' }}>Q3 Product Strategy · May 14, 2025</span>
                </div>
              </div>
            )}
          </div>

          <div style={{ display: 'flex', gap: 10, padding: '14px 22px', borderTop: '1px solid rgba(0,0,0,0.05)', alignItems: 'center', background: 'rgba(250,250,251,0.5)' }}>
            <div style={{ flex: 1, padding: '11px 16px', background: 'rgba(255,255,255,0.7)', border: '1px solid rgba(0,0,0,0.06)', borderRadius: 100, fontSize: 13, color: '#86868B', letterSpacing: '-0.1px' }}>
              Ask anything about your meetings...
            </div>
            <Link href="/login" className="lp-cta-primary" style={{ padding: '11px 20px', background: 'linear-gradient(180deg, #0077ED, #0071e3)', color: 'white', borderRadius: 100, fontSize: 13, fontWeight: 600, textDecoration: 'none', whiteSpace: 'nowrap', boxShadow: '0 2px 8px rgba(0,113,227,0.3), inset 0 1px 0 rgba(255,255,255,0.15)', letterSpacing: '-0.1px' }}>
              Try it free
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ─── Capture ──────────────────────────────────────────────────────────────── */
function Capture() {
  const methods = [
    {
      title: 'Browser Recording',
      desc: 'Capture any meeting directly from your browser. Works with Zoom, Teams, Meet — no extension required.',
      color: '#0071e3',
      icon: (
        <svg width="22" height="22" viewBox="0 0 20 20" fill="none">
          <circle cx="10" cy="10" r="7" stroke="currentColor" strokeWidth="1.5" />
          <circle cx="10" cy="10" r="3" fill="currentColor" />
        </svg>
      ),
    },
    {
      title: 'Calendar Integration',
      desc: 'Connect Google Calendar. Recall sees your upcoming meetings and prepares automatically.',
      color: '#5e5ce6',
      icon: (
        <svg width="22" height="22" viewBox="0 0 20 20" fill="none">
          <rect x="3" y="4" width="14" height="13" rx="2" stroke="currentColor" strokeWidth="1.5" />
          <path d="M3 8h14" stroke="currentColor" strokeWidth="1.5" />
          <path d="M7 2v3M13 2v3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      ),
    },
    {
      title: 'Google Meet',
      desc: 'Native Google Meet integration for Workspace users. Conference records and transcripts fetched automatically.',
      color: '#34C759',
      icon: (
        <svg width="22" height="22" viewBox="0 0 20 20" fill="none">
          <rect x="2" y="5" width="11" height="10" rx="2" stroke="currentColor" strokeWidth="1.5" />
          <path d="M13 8.5l5-3v9l-5-3V8.5z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
        </svg>
      ),
    },
    {
      title: 'YouTube Import',
      desc: 'Import public YouTube videos, webinars, or recorded calls. Recall transcribes and adds them to your knowledge base.',
      color: '#FF3B30',
      icon: (
        <svg width="22" height="22" viewBox="0 0 20 20" fill="none">
          <rect x="2" y="5" width="16" height="10" rx="2" stroke="currentColor" strokeWidth="1.5" />
          <path d="M8 8l5 2.5L8 13V8z" fill="currentColor" />
        </svg>
      ),
    },
  ]

  return (
    <section style={{ padding: '110px 24px', background: 'white' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <Reveal>
          <div style={{ textAlign: 'center', marginBottom: 68 }}>
            <p style={{ fontSize: 13, fontWeight: 600, color: '#0071e3', textTransform: 'uppercase', letterSpacing: '1.2px', marginBottom: 14 }}>Capture Everywhere</p>
            <h2 style={{ fontSize: 'clamp(28px, 4.5vw, 54px)', fontWeight: 700, letterSpacing: '-1.4px', lineHeight: 1.1, color: '#1D1D1F', marginBottom: 16 }}>
              Capture the conversation.<br />We'll handle the rest.
            </h2>
          </div>
        </Reveal>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 18 }}>
          {methods.map((m, i) => (
            <Reveal key={i} delay={i * 80}>
              <div className="lp-capture-card" style={{
                padding: 28,
                background: 'rgba(255,255,255,0.7)',
                backdropFilter: 'blur(20px)',
                borderRadius: 20,
                border: '1px solid rgba(0,0,0,0.06)',
                height: '100%',
                boxShadow: '0 2px 12px rgba(0,0,0,0.04), 0 0 0 0.5px rgba(0,0,0,0.02)',
                transition: 'transform 0.3s cubic-bezier(0.16,1,0.3,1), box-shadow 0.3s cubic-bezier(0.16,1,0.3,1)',
              }}>
                <div style={{ width: 46, height: 46, borderRadius: 12, background: `${m.color}12`, border: `1px solid ${m.color}25`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: m.color, marginBottom: 18 }}>
                  {m.icon}
                </div>
                <h3 style={{ fontSize: 16, fontWeight: 600, color: '#1D1D1F', marginBottom: 8, letterSpacing: '-0.3px' }}>{m.title}</h3>
                <p style={{ fontSize: 13.5, color: '#6E6E73', lineHeight: 1.55, margin: 0, letterSpacing: '-0.1px' }}>{m.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={360}>
          <div style={{ textAlign: 'center', marginTop: 52 }}>
            <Link href="/login" className="lp-cta-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '13px 26px', background: 'linear-gradient(180deg, #0077ED, #0071e3)', color: 'white', borderRadius: 100, fontSize: 14.5, fontWeight: 600, textDecoration: 'none', letterSpacing: '-0.2px', boxShadow: '0 4px 14px rgba(0,113,227,0.3), inset 0 1px 0 rgba(255,255,255,0.15)' }}>
              Connect your first source <span style={{ fontSize: 16, lineHeight: 1 }}>→</span>
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

/* ─── Search ───────────────────────────────────────────────────────────────── */
const RESULTS = [
  { title: 'Q3 Product Strategy', date: 'May 14', snippet: '...enterprise tier pricing needs approval from finance before we can proceed with the launch...', speaker: 'Marcus Rivera', time: '0:43' },
  { title: 'Sales Pipeline Review', date: 'May 10', snippet: '...our pricing strategy for enterprise needs to be competitive with the two main alternatives in market...', speaker: 'Sarah Chen', time: '12:20' },
  { title: 'Investor Update Q2', date: 'May 3', snippet: '...the pricing model we adopted is generating stronger margins than the original strategy suggested...', speaker: 'James Park', time: '8:15' },
]

function Search() {
  const [phase, setPhase] = useState<'idle' | 'typed' | 'results'>('idle')
  const { ref, visible } = useReveal()

  useEffect(() => {
    if (!visible) return
    const ts = [setTimeout(() => setPhase('typed'), 500), setTimeout(() => setPhase('results'), 1600)]
    return () => ts.forEach(clearTimeout)
  }, [visible])

  const QUERY = 'pricing strategy'

  return (
    <section style={{ padding: '110px 24px', background: 'linear-gradient(180deg, #F7F7F8 0%, #FAFAFA 100%)' }}>
      <div style={{ maxWidth: 820, margin: '0 auto' }}>
        <Reveal>
          <div style={{ textAlign: 'center', marginBottom: 60 }}>
            <p style={{ fontSize: 13, fontWeight: 600, color: '#0071e3', textTransform: 'uppercase', letterSpacing: '1.2px', marginBottom: 14 }}>Instant Search</p>
            <h2 style={{ fontSize: 'clamp(28px, 4.5vw, 54px)', fontWeight: 700, letterSpacing: '-1.4px', lineHeight: 1.1, color: '#1D1D1F', marginBottom: 16 }}>
              Everything you've said.<br />Nothing gets lost.
            </h2>
            <p style={{ fontSize: 18, color: '#6E6E73', fontWeight: 380, lineHeight: 1.6, letterSpacing: '-0.2px' }}>
              Full-text search across every transcript, summary, and decision — instantly.
            </p>
          </div>
        </Reveal>

        <div ref={ref}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 12,
            background: 'rgba(255,255,255,0.85)',
            backdropFilter: 'blur(20px)',
            border: `1.5px solid ${phase === 'idle' ? 'rgba(0,0,0,0.08)' : '#0071e3'}`,
            borderRadius: 14, padding: '13px 18px', marginBottom: 16,
            boxShadow: phase === 'idle' ? '0 4px 20px rgba(0,0,0,0.06)' : '0 4px 20px rgba(0,113,227,0.2), 0 0 0 4px rgba(0,113,227,0.08)',
            transition: 'border-color 0.3s cubic-bezier(0.16,1,0.3,1), box-shadow 0.3s cubic-bezier(0.16,1,0.3,1)',
          }}>
            <svg width="18" height="18" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0, opacity: phase === 'idle' ? 0.38 : 0.7, color: phase === 'idle' ? '#1D1D1F' : '#0071e3', transition: 'all 0.3s' }}>
              <circle cx="6.5" cy="6.5" r="4.5" stroke="currentColor" strokeWidth="1.5" />
              <path d="M10 10L13.5 13.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            <div style={{ flex: 1, fontSize: 15.5, color: phase === 'idle' ? '#A0A0A8' : '#1D1D1F', fontWeight: phase === 'idle' ? 400 : 500, transition: 'color 0.3s', letterSpacing: '-0.15px' }}>
              {phase === 'idle' ? 'Search across meetings...' : QUERY}
            </div>
            {phase !== 'idle' && <span style={{ fontSize: 12, color: '#86868B', fontWeight: 500 }}>{RESULTS.length} results</span>}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {RESULTS.map((r, i) => (
              <div key={i} className="lp-search-result" style={{
                background: 'rgba(255,255,255,0.85)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(0,0,0,0.05)',
                borderRadius: 14, padding: '15px 20px',
                opacity: phase === 'results' ? 1 : 0,
                transform: phase === 'results' ? 'translateY(0)' : 'translateY(12px)',
                transition: `opacity 0.5s cubic-bezier(0.16,1,0.3,1) ${i * 100}ms, transform 0.5s cubic-bezier(0.16,1,0.3,1) ${i * 100}ms, box-shadow 0.3s`,
                boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                cursor: 'pointer',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
                    <span style={{ fontSize: 14, fontWeight: 600, color: '#1D1D1F', letterSpacing: '-0.2px' }}>{r.title}</span>
                    <span style={{ fontSize: 11.5, color: '#86868B' }}>May {r.date.split(' ')[1]}</span>
                  </div>
                  <span style={{ fontSize: 11.5, color: '#A0A0A8', fontVariantNumeric: 'tabular-nums' }}>{r.time}</span>
                </div>
                <p style={{ fontSize: 13.5, color: '#3D3D3F', lineHeight: 1.55, margin: '0 0 6px', letterSpacing: '-0.1px' }}>
                  {r.snippet.split(QUERY).map((part, j, arr) => (
                    <span key={j}>{part}{j < arr.length - 1 && <mark style={{ background: 'rgba(0,113,227,0.14)', color: '#0071e3', borderRadius: 3, padding: '1px 4px', fontWeight: 500 }}>{QUERY}</mark>}</span>
                  ))}
                </p>
                <span style={{ fontSize: 11.5, color: '#86868B', fontWeight: 500 }}>{r.speaker}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

/* ─── Testimonial ──────────────────────────────────────────────────────────── */
function Testimonial() {
  const quotes = [
    { q: "We stopped taking meeting notes six months ago. Recall handles it better than any human could.", n: "Priya Sharma", r: "Head of Product, Loom" },
    { q: "The Ask Recall feature is magical. It's like having perfect memory across every conversation.", n: "David Chen", r: "CEO, Notion" },
    { q: "Cut our meeting follow-up time by 90%. Every action item, captured automatically.", n: "Elena Rostova", r: "COO, Linear" },
  ]

  return (
    <section style={{ padding: '110px 24px', background: 'white' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <Reveal>
          <div style={{ textAlign: 'center', marginBottom: 60 }}>
            <p style={{ fontSize: 13, fontWeight: 600, color: '#0071e3', textTransform: 'uppercase', letterSpacing: '1.2px', marginBottom: 14 }}>Loved by teams</p>
            <h2 style={{ fontSize: 'clamp(28px, 4vw, 46px)', fontWeight: 700, letterSpacing: '-1.4px', lineHeight: 1.15, color: '#1D1D1F' }}>
              Built for teams who ship.
            </h2>
          </div>
        </Reveal>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20 }}>
          {quotes.map((t, i) => (
            <Reveal key={i} delay={i * 100}>
              <div style={{
                padding: 30,
                background: 'linear-gradient(180deg, rgba(0,113,227,0.02), rgba(94,92,230,0.02))',
                border: '1px solid rgba(0,0,0,0.06)',
                borderRadius: 20,
                height: '100%',
              }}>
                <div style={{ display: 'flex', gap: 3, marginBottom: 14 }}>
                  {[1, 2, 3, 4, 5].map(s => (
                    <svg key={s} width="14" height="14" viewBox="0 0 14 14" fill="#FFB020">
                      <path d="M7 0.5l1.75 4.5H13l-3.5 2.75L11 12.5 7 9.75 3 12.5l1.5-4.75L1 5h4.25L7 0.5z" />
                    </svg>
                  ))}
                </div>
                <p style={{ fontSize: 15, color: '#1D1D1F', lineHeight: 1.55, margin: '0 0 20px', letterSpacing: '-0.2px', fontWeight: 450 }}>"{t.q}"</p>
                <div>
                  <p style={{ fontSize: 13.5, fontWeight: 600, color: '#1D1D1F', margin: '0 0 2px', letterSpacing: '-0.1px' }}>{t.n}</p>
                  <p style={{ fontSize: 12.5, color: '#6E6E73', margin: 0 }}>{t.r}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ─── Final CTA ────────────────────────────────────────────────────────────── */
function FinalCTA() {
  return (
    <section style={{ padding: '120px 24px 130px', background: 'linear-gradient(135deg, #000000 0%, #1D1D1F 50%, #1a1a3a 100%)', position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', top: '20%', left: '15%', width: 500, height: 500, background: 'radial-gradient(circle, rgba(0,113,227,0.25), transparent 70%)', filter: 'blur(80px)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: '10%', right: '10%', width: 400, height: 400, background: 'radial-gradient(circle, rgba(94,92,230,0.2), transparent 70%)', filter: 'blur(80px)', pointerEvents: 'none' }} />

      <div style={{ maxWidth: 720, margin: '0 auto', textAlign: 'center', position: 'relative', zIndex: 1 }}>
        <Reveal>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 7, padding: '5px 14px', background: 'rgba(255,255,255,0.08)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 100, marginBottom: 28 }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#34C759', display: 'inline-block', boxShadow: '0 0 8px rgba(52,199,89,0.6)' }} />
            <span style={{ fontSize: 12, fontWeight: 550, color: 'rgba(255,255,255,0.9)', letterSpacing: '-0.05px' }}>Free forever · No credit card</span>
          </div>

          <h2 style={{ fontSize: 'clamp(34px, 6vw, 72px)', fontWeight: 700, letterSpacing: '-2.5px', color: 'white', lineHeight: 1.05, marginBottom: 22 }}>
            Stop taking notes.<br />
            <span style={{ background: 'linear-gradient(135deg, #0091ff 0%, #a78bfa 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Start remembering.</span>
          </h2>
          <p style={{ fontSize: 18, color: 'rgba(255,255,255,0.65)', lineHeight: 1.6, fontWeight: 380, letterSpacing: '-0.2px', maxWidth: 560, margin: '0 auto 44px' }}>
            Turn every conversation into knowledge your team can actually use.
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 24 }}>
            <Link href="/login" className="lp-cta-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '15px 32px', background: 'linear-gradient(180deg, #0091ff, #0071e3)', color: 'white', borderRadius: 100, fontSize: 16, fontWeight: 600, textDecoration: 'none', letterSpacing: '-0.2px', boxShadow: '0 8px 24px rgba(0,113,227,0.45), inset 0 1px 0 rgba(255,255,255,0.2)' }}>
              Start capturing for free
              <span style={{ fontSize: 18, lineHeight: 1 }}>→</span>
            </Link>
            <Link href="/dashboard" className="lp-cta-secondary-dark" style={{ display: 'inline-flex', alignItems: 'center', padding: '15px 28px', background: 'rgba(255,255,255,0.08)', backdropFilter: 'blur(20px)', color: 'white', borderRadius: 100, fontSize: 16, fontWeight: 500, textDecoration: 'none', letterSpacing: '-0.2px', border: '1px solid rgba(255,255,255,0.15)' }}>
              Explore Recall
            </Link>
          </div>
          <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', margin: 0, fontWeight: 400 }}>
            Join 12,000+ teams already using Recall.
          </p>
        </Reveal>
      </div>
    </section>
  )
}

/* ─── Footer ───────────────────────────────────────────────────────────────── */
function Footer() {
  return (
    <footer style={{ padding: '48px 24px 52px', background: '#000', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 32 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
            <div style={{ width: 24, height: 24, background: 'linear-gradient(135deg, #0071e3, #34aadc)', borderRadius: 7, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 6px rgba(0,113,227,0.35)' }}>
              <svg width="12" height="12" viewBox="0 0 14 14" fill="none"><circle cx="7" cy="7" r="5" stroke="white" strokeWidth="1.5" /><circle cx="7" cy="7" r="1.75" fill="white" /></svg>
            </div>
            <span style={{ fontSize: 15, fontWeight: 600, color: 'white', letterSpacing: '-0.2px' }}>Recall</span>
          </div>
          <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', margin: 0, letterSpacing: '-0.1px' }}>AI meeting intelligence.</p>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {[['#product', 'Product'], ['#howitworks', 'How it works'], ['#features', 'Features'], ['/login', 'Sign in']].map(([href, label]) => (
            href.startsWith('/') || href.startsWith('http')
              ? <Link key={href} href={href} className="lp-footer-link" style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', textDecoration: 'none', transition: 'color 0.2s' }}>{label}</Link>
              : <a key={href} href={href} className="lp-footer-link" style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', textDecoration: 'none', transition: 'color 0.2s' }}>{label}</a>
          ))}
        </div>
      </div>
    </footer>
  )
}

/* ─── Global styles ────────────────────────────────────────────────────────── */
const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;450;500;550;600;650;700&display=swap');
  
  @keyframes lp-fadein { from { opacity:0; transform:translateY(10px) } to { opacity:1; transform:none } }
  @keyframes lp-dot { 0%,100% { opacity:.25; transform:scale(0.8) } 50% { opacity:1; transform:scale(1.1) } }
  .lp-dot { animation: lp-dot 1.1s cubic-bezier(0.16,1,0.3,1) infinite; }

  @keyframes lp-live-pulse { 0%,100% { opacity:1; transform:scale(1); } 50% { opacity:.35; transform:scale(1.25); } }
  .lp-live-pulse { animation: lp-live-pulse 1.5s cubic-bezier(0.4,0,0.6,1) infinite; }

  @keyframes lp-wave { 0%,100% { transform:scaleY(0.55); opacity:.6 } 50% { transform:scaleY(1); opacity:1 } }
  .lp-wave-bar { animation: lp-wave 1.1s ease-in-out infinite; transform-origin: bottom; }

  @keyframes lp-cursor { 0%,49% { opacity:1 } 50%,100% { opacity:0 } }
  .lp-cursor { animation: lp-cursor 1s step-end infinite; }

  @keyframes lp-insight-fresh { 0% { transform:translateY(-6px); opacity:0 } 100% { transform:none; opacity:1 } }
  .lp-insight-fresh { animation: lp-insight-fresh 0.55s cubic-bezier(0.16,1,0.3,1); }

  .lp-nav-links { display:flex; }
  
  * { box-sizing:border-box; }
  html, body { 
    margin:0; 
    background:white; 
    font-family: -apple-system, 'Inter', BlinkMacSystemFont, 'SF Pro Display', 'SF Pro Text', 'Helvetica Neue', sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
  
  .lp-nav-link:hover { opacity: 1 !important; }
  .lp-cta-nav:hover { transform: translateY(-1px); box-shadow: 0 4px 12px rgba(0,113,227,0.4), inset 0 1px 0 rgba(255,255,255,0.15) !important; }
  .lp-cta-primary { transition: transform 0.2s cubic-bezier(0.16,1,0.3,1), box-shadow 0.2s cubic-bezier(0.16,1,0.3,1); }
  .lp-cta-primary:hover { transform: translateY(-1px) scale(1.01); box-shadow: 0 8px 24px rgba(0,113,227,0.45), inset 0 1px 0 rgba(255,255,255,0.2) !important; }
  .lp-cta-secondary { transition: background 0.2s, transform 0.2s; }
  .lp-cta-secondary:hover { background: rgba(255,255,255,0.95) !important; transform: translateY(-1px); }
  .lp-cta-secondary-dark:hover { background: rgba(255,255,255,0.15) !important; }
  .lp-capture-card:hover { transform: translateY(-3px); box-shadow: 0 12px 32px rgba(0,0,0,0.08), 0 0 0 0.5px rgba(0,0,0,0.02) !important; }
  .lp-search-result:hover { box-shadow: 0 6px 20px rgba(0,113,227,0.12), 0 0 0 1px rgba(0,113,227,0.15) !important; }
  .lp-footer-link:hover { color: white !important; }
  .lp-product-mockup { transition: transform 0.5s cubic-bezier(0.16,1,0.3,1); }
  
  @media (max-width:640px) { .lp-nav-links { display:none; } }
  @media (max-width:860px) {
    .lp-live-body { flex-direction: column !important; height: auto !important; }
    .lp-live-panel { width: 100% !important; border-top: 1px solid rgba(0,0,0,0.05); }
  }
  @media (max-width:768px) {
    section { padding-left:20px !important; padding-right:20px !important; }
  }
`

/* ─── Page ─────────────────────────────────────────────────────────────────── */
export default function LandingPage() {
  return (
    <>
      <style>{CSS}</style>
      <Nav />
      <Hero />
      <SocialProof />
      <Problem />
      <ProductShowcase />
      <MeetingIntelligence />
      <AskRecall />
      <Capture />
      <Search />
      <Testimonial />
      <FinalCTA />
      <Footer />
    </>
  )
}