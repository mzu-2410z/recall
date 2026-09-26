'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import Link from 'next/link'
import {
  Mic, FileText, Sparkles, CheckSquare, GitBranch, Hash, Search, MessageSquareText,
  Calendar, Clock, Lock, Share2, ArrowRight, ArrowUpRight, Plus, Minus, Menu, X,
  Circle, ChevronRight, Command
} from 'lucide-react'

function useReveal<T extends HTMLElement = HTMLDivElement>() {
  const ref = useRef<T>(null)
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect() } },
      { threshold: 0.1, rootMargin: '0px 0px -60px 0px' }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])
  return { ref, visible }
}

function Reveal({ children, delay = 0, className = '', as: As = 'div' }: { children: React.ReactNode; delay?: number; className?: string; as?: React.ElementType }) {
  const { ref, visible } = useReveal<HTMLDivElement>()
  return (
    <As ref={ref} className={className} style={{
      opacity: visible ? 1 : 0,
      transform: visible ? 'translateY(0)' : 'translateY(16px)',
      transition: `opacity 700ms cubic-bezier(0.16,1,0.3,1) ${delay}ms, transform 700ms cubic-bezier(0.16,1,0.3,1) ${delay}ms`,
    }}>{children}</As>
  )
}

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
  ],
  summary: "The team reviewed Q4 priorities with a focus on onboarding conversion and API readiness. A 34% drop-off at workspace creation is the highest-priority fix, and the team agreed to ship a redesigned flow directly rather than run an A/B test. API rate limiting was flagged as a blocker for the public endpoint launch.",
  decisions: [
    'Ship redesigned onboarding to all users; skip A/B test given sample size.',
    'Defer team invite step until after first meeting is captured.',
    'Public API launch blocked until rate limiting proposal is approved.',
  ],
  actions: [
    { text: 'Redesign onboarding flow with deferred invite step', owner: 'Priya Menon', due: 'Fri, Nov 15' },
    { text: 'Draft API rate limiting proposal', owner: 'James Ward', due: 'Mon, Nov 18' },
    { text: 'Review onboarding funnel metrics weekly', owner: 'Daniel Ortiz', due: 'Ongoing' },
  ],
  topics: ['Onboarding', 'Conversion', 'API Design', 'Rate Limiting', 'Q4 Priorities'],
}

function Logo({ size = 22 }: { size?: number }) {
  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden>
        <rect x="1" y="1" width="22" height="22" rx="6" fill="#0A0A0A" />
        <circle cx="12" cy="12" r="6" stroke="#F5F5F4" strokeWidth="1.5" />
        <circle cx="12" cy="12" r="2" fill="#F5F5F4" />
      </svg>
      <span style={{ fontSize: 17, fontWeight: 600, color: '#0A0A0A', letterSpacing: '-0.4px' }}>Recall</span>
    </div>
  )
}

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
        background: scrolled ? 'rgba(250,250,249,0.82)' : 'transparent',
        backdropFilter: scrolled ? 'blur(20px) saturate(180%)' : 'none',
        WebkitBackdropFilter: scrolled ? 'blur(20px) saturate(180%)' : 'none',
        borderBottom: scrolled ? '1px solid rgba(10,10,10,0.06)' : '1px solid transparent',
        transition: 'all 280ms cubic-bezier(0.16,1,0.3,1)',
      }}>
        <div style={{
          maxWidth: 1240, margin: '0 auto',
          padding: `0 clamp(20px, 4vw, 32px)`,
          height: scrolled ? 56 : 68,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          transition: 'height 280ms cubic-bezier(0.16,1,0.3,1)',
        }}>
          <Link href="/" style={{ textDecoration: 'none' }} aria-label="Recall home">
            <Logo />
          </Link>

          <div className="rc-nav-links" style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            {links.map(l => (
              <a key={l.href} href={l.href} className="rc-nav-link" style={{
                fontSize: 13.5, fontWeight: 450, color: '#404040', textDecoration: 'none',
                padding: '8px 12px', borderRadius: 8, letterSpacing: '-0.1px',
                transition: 'color 180ms, background 180ms',
              }}>{l.label}</a>
            ))}
          </div>

          <div className="rc-nav-cta" style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <Link href="/login" className="rc-nav-link" style={{
              fontSize: 13.5, fontWeight: 450, color: '#404040', textDecoration: 'none',
              padding: '8px 14px', borderRadius: 8, letterSpacing: '-0.1px',
            }}>Sign in</Link>
            <Link href="/login" className="rc-btn-primary" style={{
              fontSize: 13.5, fontWeight: 500, color: '#FAFAF9', textDecoration: 'none',
              padding: '8px 16px', background: '#0A0A0A', borderRadius: 8,
              letterSpacing: '-0.1px', display: 'inline-flex', alignItems: 'center', gap: 4,
              transition: 'transform 180ms, background 180ms',
            }}>Get started</Link>
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
          position: 'fixed', top: 56, left: 0, right: 0, bottom: 0, zIndex: 99,
          background: '#FAFAF9', padding: '24px', display: 'none', flexDirection: 'column', gap: 4,
        }}>
          {links.map(l => (
            <a key={l.href} href={l.href} onClick={() => setMenuOpen(false)} style={{
              fontSize: 18, fontWeight: 500, color: '#0A0A0A', textDecoration: 'none',
              padding: '14px 4px', borderBottom: '1px solid rgba(10,10,10,0.06)', letterSpacing: '-0.3px',
            }}>{l.label}</a>
          ))}
          <div style={{ marginTop: 20, display: 'flex', flexDirection: 'column', gap: 8 }}>
            <Link href="/login" onClick={() => setMenuOpen(false)} style={{
              fontSize: 15, fontWeight: 500, color: '#0A0A0A', textDecoration: 'none',
              padding: '13px 18px', border: '1px solid rgba(10,10,10,0.1)', borderRadius: 10, textAlign: 'center',
            }}>Sign in</Link>
            <Link href="/login" onClick={() => setMenuOpen(false)} style={{
              fontSize: 15, fontWeight: 500, color: '#FAFAF9', textDecoration: 'none',
              padding: '13px 18px', background: '#0A0A0A', borderRadius: 10, textAlign: 'center',
            }}>Get started</Link>
          </div>
        </div>
      )}
    </>
  )
}

function HeroVisual() {
  return (
    <div style={{
      position: 'relative', maxWidth: 1080, margin: '0 auto',
    }}>
      <div style={{
        position: 'absolute', inset: '-40px -20px', pointerEvents: 'none',
        background: 'radial-gradient(60% 50% at 50% 50%, rgba(180, 83, 9, 0.08), transparent 70%)',
      }} />
      <div style={{
        position: 'relative',
        background: '#FFFFFF',
        borderRadius: 14,
        border: '1px solid rgba(10,10,10,0.08)',
        boxShadow: '0 1px 0 rgba(255,255,255,0.9) inset, 0 30px 60px -20px rgba(10,10,10,0.18), 0 12px 24px -12px rgba(10,10,10,0.1)',
        overflow: 'hidden',
      }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 8,
          padding: '10px 14px',
          background: '#FAFAF9',
          borderBottom: '1px solid rgba(10,10,10,0.06)',
        }}>
          <div style={{ display: 'flex', gap: 6 }}>
            <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#E7E5E4' }} />
            <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#E7E5E4' }} />
            <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#E7E5E4' }} />
          </div>
          <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '4px 12px', background: '#FFFFFF',
              border: '1px solid rgba(10,10,10,0.06)', borderRadius: 6,
              fontSize: 11.5, color: '#57534E', fontWeight: 450, letterSpacing: '-0.1px',
            }}>
              <Circle size={7} fill="#0A0A0A" stroke="none" />
              {MEETING.title} · {MEETING.duration}
            </div>
          </div>
          <div style={{ width: 48 }} />
        </div>

        <div className="rc-hero-body" style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', minHeight: 460 }}>
          <div style={{
            padding: '22px 24px', borderRight: '1px solid rgba(10,10,10,0.06)',
            position: 'relative', overflow: 'hidden',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
              <span style={{ fontSize: 10.5, fontWeight: 600, color: '#78716C', textTransform: 'uppercase', letterSpacing: '0.8px' }}>Transcript</span>
              <div style={{ display: 'flex', gap: -6 }}>
                {MEETING.participants.map((p, i) => (
                  <div key={p.name} style={{
                    width: 22, height: 22, borderRadius: '50%',
                    background: p.color, color: 'white',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 9, fontWeight: 600, marginLeft: i === 0 ? 0 : -6,
                    border: '2px solid white', letterSpacing: 0,
                  }}>{p.initials}</div>
                ))}
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {MEETING.transcript.slice(0, 4).map((seg, i) => {
                const p = MEETING.participants.find(x => x.name === seg.speaker)!
                return (
                  <div key={i} style={{ display: 'flex', gap: 11 }}>
                    <div style={{
                      flexShrink: 0, width: 24, height: 24, borderRadius: '50%',
                      background: p.color, color: 'white',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 9, fontWeight: 600,
                    }}>{p.initials}</div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', gap: 8, alignItems: 'baseline', marginBottom: 3 }}>
                        <span style={{ fontSize: 12.5, fontWeight: 550, color: '#0A0A0A', letterSpacing: '-0.1px' }}>{seg.speaker}</span>
                        <span style={{ fontSize: 10.5, color: '#A8A29E', fontVariantNumeric: 'tabular-nums' }}>{seg.time}</span>
                      </div>
                      <p style={{ fontSize: 12.5, color: '#404040', lineHeight: 1.55, margin: 0, letterSpacing: '-0.05px' }}>{seg.text}</p>
                    </div>
                  </div>
                )
              })}
            </div>
            <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 80, background: 'linear-gradient(transparent, #FFFFFF)', pointerEvents: 'none' }} />
          </div>

          <div style={{ padding: '22px 24px', background: '#FAFAF9', display: 'flex', flexDirection: 'column', gap: 20, overflow: 'hidden' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10 }}>
                <Sparkles size={12} strokeWidth={2} color="#B45309" />
                <span style={{ fontSize: 10.5, fontWeight: 600, color: '#78716C', textTransform: 'uppercase', letterSpacing: '0.8px' }}>Summary</span>
              </div>
              <p style={{ fontSize: 12.5, color: '#292524', lineHeight: 1.6, margin: 0, letterSpacing: '-0.05px' }}>{MEETING.summary}</p>
            </div>

            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10 }}>
                <GitBranch size={12} strokeWidth={2} color="#0F766E" />
                <span style={{ fontSize: 10.5, fontWeight: 600, color: '#78716C', textTransform: 'uppercase', letterSpacing: '0.8px' }}>Decisions</span>
              </div>
              {MEETING.decisions.slice(0, 2).map((d, i) => (
                <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 6 }}>
                  <span style={{ color: '#0F766E', fontSize: 11, flexShrink: 0, marginTop: 3, fontWeight: 700 }}>·</span>
                  <p style={{ fontSize: 12.5, color: '#292524', margin: 0, lineHeight: 1.5 }}>{d}</p>
                </div>
              ))}
            </div>

            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10 }}>
                <CheckSquare size={12} strokeWidth={2} color="#0A0A0A" />
                <span style={{ fontSize: 10.5, fontWeight: 600, color: '#78716C', textTransform: 'uppercase', letterSpacing: '0.8px' }}>Action items</span>
              </div>
              {MEETING.actions.slice(0, 2).map((a, i) => (
                <div key={i} style={{ display: 'flex', gap: 10, marginBottom: 8 }}>
                  <div style={{
                    width: 13, height: 13, borderRadius: 3, border: '1.5px solid #A8A29E',
                    flexShrink: 0, marginTop: 2,
                  }} />
                  <div style={{ minWidth: 0 }}>
                    <p style={{ fontSize: 12.5, color: '#0A0A0A', margin: 0, fontWeight: 500, letterSpacing: '-0.05px', lineHeight: 1.4 }}>{a.text}</p>
                    <p style={{ fontSize: 11, color: '#78716C', margin: '2px 0 0' }}>{a.owner} · {a.due}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function Hero() {
  const [mounted, setMounted] = useState(false)
  useEffect(() => { const t = setTimeout(() => setMounted(true), 40); return () => clearTimeout(t) }, [])

  const fade = (d: number) => ({
    opacity: mounted ? 1 : 0,
    transform: mounted ? 'translateY(0)' : 'translateY(14px)',
    transition: `opacity 800ms cubic-bezier(0.16,1,0.3,1) ${d}ms, transform 800ms cubic-bezier(0.16,1,0.3,1) ${d}ms`,
  })

  return (
    <section style={{
      paddingTop: 'clamp(110px, 14vw, 160px)', paddingBottom: 'clamp(60px, 8vw, 100px)',
      background: '#FAFAF9', position: 'relative', overflow: 'hidden',
    }}>
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: '60%',
        background: 'radial-gradient(80% 60% at 50% 0%, rgba(180,83,9,0.05), transparent 70%)',
        pointerEvents: 'none',
      }} />

      <div style={{ maxWidth: 1240, margin: '0 auto', padding: '0 clamp(20px, 4vw, 32px)', position: 'relative' }}>
        <div style={{ maxWidth: 820, margin: '0 auto', textAlign: 'center' }}>
          <div style={{
            ...fade(0),
            display: 'inline-flex', alignItems: 'center', gap: 8,
            padding: '5px 12px 5px 8px',
            background: '#FFFFFF', border: '1px solid rgba(10,10,10,0.08)',
            borderRadius: 100, marginBottom: 28,
            boxShadow: '0 1px 2px rgba(10,10,10,0.04)',
          }}>
            <span style={{
              fontSize: 10, fontWeight: 600, color: '#B45309',
              background: 'rgba(180,83,9,0.08)', padding: '2px 7px', borderRadius: 100,
              textTransform: 'uppercase', letterSpacing: '0.5px',
            }}>New</span>
            <span style={{ fontSize: 12.5, color: '#404040', fontWeight: 450, letterSpacing: '-0.1px' }}>
              Ask Recall — query your meeting history in natural language
            </span>
          </div>

          <h1 style={{
            ...fade(80),
            fontSize: 'clamp(38px, 6.2vw, 78px)', fontWeight: 600,
            letterSpacing: '-2.4px', lineHeight: 1.02, color: '#0A0A0A',
            margin: '0 0 24px',
          }}>
            Your meetings shouldn't<br />
            <span style={{ color: '#78716C', fontStyle: 'italic', fontWeight: 400 }}>disappear</span> when the call ends.
          </h1>

          <p style={{
            ...fade(160),
            fontSize: 'clamp(16px, 1.8vw, 19px)', lineHeight: 1.55, color: '#57534E',
            fontWeight: 400, letterSpacing: '-0.15px',
            maxWidth: 620, margin: '0 auto 40px',
          }}>
            Recall turns meetings into searchable intelligence — capturing conversations, decisions, action items and everything your team needs to remember.
          </p>

          <div style={{ ...fade(240), display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 22 }}>
            <Link href="/login" className="rc-btn-primary" style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              padding: '13px 22px', background: '#0A0A0A', color: '#FAFAF9',
              borderRadius: 10, fontSize: 14.5, fontWeight: 500, textDecoration: 'none',
              letterSpacing: '-0.1px',
              transition: 'transform 180ms, background 180ms',
            }}>
              Start using Recall <ArrowRight size={15} strokeWidth={2.2} />
            </Link>
            <a href="#how" className="rc-btn-ghost" style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              padding: '13px 20px', background: 'transparent', color: '#0A0A0A',
              border: '1px solid rgba(10,10,10,0.12)', borderRadius: 10,
              fontSize: 14.5, fontWeight: 500, textDecoration: 'none', letterSpacing: '-0.1px',
              transition: 'background 180ms, border-color 180ms',
            }}>
              See how it works
            </a>
          </div>

          <p style={{ ...fade(320), fontSize: 12.5, color: '#78716C', margin: 0, letterSpacing: '-0.05px' }}>
            Free while in early access · Connects to your calendar in under a minute
          </p>
        </div>

        <div style={{ ...fade(400), marginTop: 'clamp(56px, 8vw, 88px)' }}>
          <HeroVisual />
        </div>
      </div>
    </section>
  )
}

function TrustStrip() {
  const audiences = ['Product teams', 'Engineering leads', 'Founders', 'Researchers', 'Consultants', 'Design leads']
  return (
    <section style={{ padding: '72px clamp(20px, 4vw, 32px)', background: '#FFFFFF', borderTop: '1px solid rgba(10,10,10,0.05)' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <Reveal>
          <div style={{ textAlign: 'center' }}>
            <p style={{
              fontSize: 15, color: '#292524', fontWeight: 450, letterSpacing: '-0.15px',
              margin: '0 0 32px', maxWidth: 560, marginInline: 'auto', lineHeight: 1.5,
            }}>
              Built for people who can't afford to forget what happened in the room.
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 8 }}>
              {audiences.map((a, i) => (
                <span key={a} style={{
                  fontSize: 12.5, color: '#57534E', fontWeight: 450, letterSpacing: '-0.05px',
                  padding: '7px 14px', background: '#FAFAF9',
                  border: '1px solid rgba(10,10,10,0.06)', borderRadius: 100,
                }}>{a}</span>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

function Problem() {
  const stages = [
    { label: 'Meeting', desc: 'Everyone shows up.' },
    { label: 'Conversation', desc: 'Ideas move quickly.' },
    { label: 'Decisions', desc: 'Direction gets set.' },
    { label: 'Tasks', desc: 'Work gets assigned.' },
    { label: 'Silence', desc: 'The details fade.' },
  ]

  return (
    <section style={{ padding: 'clamp(80px, 10vw, 130px) clamp(20px, 4vw, 32px)', background: '#FAFAF9' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <Reveal>
          <div style={{ maxWidth: 720, marginBottom: 72 }}>
            <span style={{
              display: 'inline-block', fontSize: 11.5, color: '#78716C', fontWeight: 500,
              textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 20,
            }}>The problem</span>
            <h2 style={{
              fontSize: 'clamp(30px, 4.5vw, 56px)', fontWeight: 600,
              letterSpacing: '-1.6px', lineHeight: 1.05, color: '#0A0A0A', margin: '0 0 20px',
            }}>
              Meetings create information.<br />
              <span style={{ color: '#78716C' }}>Humans forget it.</span>
            </h2>
            <p style={{ fontSize: 17, color: '#57534E', lineHeight: 1.6, margin: 0, fontWeight: 400, letterSpacing: '-0.15px', maxWidth: 560 }}>
              A recording tells you what was said. A transcript is 40 pages long. Neither of them tells you what actually happened, what you decided, or what you owe someone by Friday.
            </p>
          </div>
        </Reveal>

        <Reveal delay={120}>
          <div style={{
            position: 'relative', padding: '40px 0',
            borderTop: '1px solid rgba(10,10,10,0.08)',
            borderBottom: '1px solid rgba(10,10,10,0.08)',
          }}>
            <div className="rc-stages" style={{
              display: 'grid', gridTemplateColumns: `repeat(${stages.length}, 1fr)`, gap: 0,
              position: 'relative',
            }}>
              {stages.map((s, i) => (
                <div key={s.label} style={{
                  padding: '0 20px', position: 'relative',
                  opacity: 1 - (i * 0.15),
                  borderLeft: i === 0 ? 'none' : '1px solid rgba(10,10,10,0.06)',
                }}>
                  <div style={{
                    fontSize: 10.5, fontWeight: 500, color: '#A8A29E',
                    fontVariantNumeric: 'tabular-nums', marginBottom: 12,
                  }}>0{i + 1}</div>
                  <h3 style={{
                    fontSize: 17, fontWeight: 550, color: '#0A0A0A',
                    margin: '0 0 6px', letterSpacing: '-0.3px',
                  }}>{s.label}</h3>
                  <p style={{ fontSize: 13, color: '#78716C', margin: 0, lineHeight: 1.5 }}>{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </Reveal>

        <Reveal delay={220}>
          <div style={{ marginTop: 44, display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 10,
              padding: '10px 16px', background: '#0A0A0A', color: '#FAFAF9',
              borderRadius: 100, fontSize: 13.5, fontWeight: 450, letterSpacing: '-0.1px',
            }}>
              <Sparkles size={13} strokeWidth={2} />
              With Recall
            </div>
            <p style={{ fontSize: 15.5, color: '#292524', margin: 0, letterSpacing: '-0.1px', fontWeight: 400 }}>
              Every meeting becomes a searchable record — with the summary, decisions, and next steps already extracted.
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

type Tab = 'transcript' | 'summary' | 'decisions' | 'actions'

function ProductShowcase() {
  const [tab, setTab] = useState<Tab>('summary')

  const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: 'transcript', label: 'Transcript', icon: <FileText size={13} strokeWidth={2} /> },
    { id: 'summary', label: 'Summary', icon: <Sparkles size={13} strokeWidth={2} /> },
    { id: 'decisions', label: 'Decisions', icon: <GitBranch size={13} strokeWidth={2} /> },
    { id: 'actions', label: 'Action items', icon: <CheckSquare size={13} strokeWidth={2} /> },
  ]

  return (
    <section id="product" style={{ padding: 'clamp(80px, 10vw, 130px) clamp(20px, 4vw, 32px)', background: '#FFFFFF' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <Reveal>
          <div style={{ maxWidth: 720, marginBottom: 56 }}>
            <span style={{
              display: 'inline-block', fontSize: 11.5, color: '#78716C', fontWeight: 500,
              textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 20,
            }}>The product</span>
            <h2 style={{
              fontSize: 'clamp(30px, 4.5vw, 54px)', fontWeight: 600,
              letterSpacing: '-1.6px', lineHeight: 1.05, color: '#0A0A0A', margin: '0 0 20px',
            }}>
              One meeting.<br />Four ways to remember it.
            </h2>
            <p style={{ fontSize: 17, color: '#57534E', lineHeight: 1.6, margin: 0, fontWeight: 400, letterSpacing: '-0.15px', maxWidth: 540 }}>
              Every conversation gets restructured into the views that actually get used — read, skimmed, referenced, and acted on.
            </p>
          </div>
        </Reveal>

        <Reveal delay={100}>
          <div style={{
            background: '#FFFFFF', borderRadius: 16,
            border: '1px solid rgba(10,10,10,0.08)',
            boxShadow: '0 20px 50px -20px rgba(10,10,10,0.14), 0 8px 20px -12px rgba(10,10,10,0.08)',
            overflow: 'hidden',
          }}>
            <div style={{
              padding: '18px 24px', borderBottom: '1px solid rgba(10,10,10,0.06)',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <div style={{
                  width: 36, height: 36, borderRadius: 8,
                  background: 'linear-gradient(135deg, #292524, #0A0A0A)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <Mic size={16} color="#FAFAF9" strokeWidth={2} />
                </div>
                <div>
                  <h3 style={{ fontSize: 15, fontWeight: 600, color: '#0A0A0A', margin: 0, letterSpacing: '-0.2px' }}>{MEETING.title}</h3>
                  <p style={{ fontSize: 12.5, color: '#78716C', margin: '2px 0 0' }}>
                    {MEETING.date} · {MEETING.duration} · {MEETING.participants.length} participants
                  </p>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: -6 }}>
                {MEETING.participants.map((p, i) => (
                  <div key={p.name} title={p.name} style={{
                    width: 26, height: 26, borderRadius: '50%',
                    background: p.color, color: 'white',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 10, fontWeight: 600, marginLeft: i === 0 ? 0 : -6,
                    border: '2px solid #FFFFFF',
                  }}>{p.initials}</div>
                ))}
              </div>
            </div>

            <div style={{
              padding: '8px 20px', borderBottom: '1px solid rgba(10,10,10,0.06)',
              display: 'flex', gap: 2, overflowX: 'auto',
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
                    padding: '10px 14px', border: 'none', borderRadius: 8,
                    background: tab === t.id ? '#F5F5F4' : 'transparent',
                    color: tab === t.id ? '#0A0A0A' : '#78716C',
                    fontSize: 13, fontWeight: tab === t.id ? 550 : 450,
                    letterSpacing: '-0.1px', cursor: 'pointer', whiteSpace: 'nowrap',
                    transition: 'all 180ms',
                  }}
                >
                  {t.icon}{t.label}
                </button>
              ))}
            </div>

            <div style={{
              display: 'grid', gridTemplateColumns: '1fr 260px',
              minHeight: 480,
            }} className="rc-showcase-body">
              <div style={{ padding: '28px 32px', overflow: 'hidden' }}>
                <TabPanel tab={tab} />
              </div>
              <div style={{
                padding: '28px 24px', background: '#FAFAF9',
                borderLeft: '1px solid rgba(10,10,10,0.06)',
              }} className="rc-showcase-side">
                <span style={{
                  display: 'block', fontSize: 10.5, fontWeight: 600, color: '#78716C',
                  textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: 12,
                }}>Topics</span>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 28 }}>
                  {MEETING.topics.map(t => (
                    <span key={t} style={{
                      display: 'inline-flex', alignItems: 'center', gap: 4,
                      fontSize: 11.5, padding: '4px 9px', background: '#FFFFFF',
                      color: '#404040', borderRadius: 6, fontWeight: 450,
                      border: '1px solid rgba(10,10,10,0.06)', letterSpacing: '-0.05px',
                    }}>
                      <Hash size={9} strokeWidth={2.5} color="#A8A29E" />{t}
                    </span>
                  ))}
                </div>

                <span style={{
                  display: 'block', fontSize: 10.5, fontWeight: 600, color: '#78716C',
                  textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: 12,
                }}>Participants</span>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {MEETING.participants.map(p => (
                    <div key={p.name} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div style={{
                        width: 22, height: 22, borderRadius: '50%',
                        background: p.color, color: 'white',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: 9, fontWeight: 600,
                      }}>{p.initials}</div>
                      <span style={{ fontSize: 12.5, color: '#292524', fontWeight: 450, letterSpacing: '-0.05px' }}>{p.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

function TabPanel({ tab }: { tab: Tab }) {
  return (
    <div key={tab} style={{ animation: 'rc-fadein 400ms cubic-bezier(0.16,1,0.3,1)' }}>
      {tab === 'transcript' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {MEETING.transcript.map((seg, i) => {
            const p = MEETING.participants.find(x => x.name === seg.speaker)!
            return (
              <div key={i} style={{ display: 'flex', gap: 12 }}>
                <div style={{
                  flexShrink: 0, width: 28, height: 28, borderRadius: '50%',
                  background: p.color, color: 'white',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 10, fontWeight: 600,
                }}>{p.initials}</div>
                <div>
                  <div style={{ display: 'flex', gap: 8, alignItems: 'baseline', marginBottom: 4 }}>
                    <span style={{ fontSize: 13.5, fontWeight: 550, color: '#0A0A0A', letterSpacing: '-0.1px' }}>{seg.speaker}</span>
                    <span style={{ fontSize: 11.5, color: '#A8A29E', fontVariantNumeric: 'tabular-nums' }}>{seg.time}</span>
                  </div>
                  <p style={{ fontSize: 14, color: '#292524', lineHeight: 1.6, margin: 0, letterSpacing: '-0.05px' }}>{seg.text}</p>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {tab === 'summary' && (
        <div>
          <p style={{ fontSize: 15, color: '#292524', lineHeight: 1.65, margin: '0 0 24px', letterSpacing: '-0.1px', fontWeight: 400 }}>
            {MEETING.summary}
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }} className="rc-summary-grid">
            <div style={{
              padding: 18, background: '#FAFAF9', borderRadius: 10,
              border: '1px solid rgba(10,10,10,0.06)',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
                <GitBranch size={12} color="#0F766E" strokeWidth={2.2} />
                <span style={{ fontSize: 11, fontWeight: 600, color: '#57534E', textTransform: 'uppercase', letterSpacing: '0.6px' }}>Decisions</span>
              </div>
              <p style={{ fontSize: 22, fontWeight: 600, color: '#0A0A0A', margin: 0, letterSpacing: '-0.6px' }}>{MEETING.decisions.length}</p>
              <p style={{ fontSize: 12, color: '#78716C', margin: '2px 0 0' }}>Recorded with context</p>
            </div>
            <div style={{
              padding: 18, background: '#FAFAF9', borderRadius: 10,
              border: '1px solid rgba(10,10,10,0.06)',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
                <CheckSquare size={12} color="#B45309" strokeWidth={2.2} />
                <span style={{ fontSize: 11, fontWeight: 600, color: '#57534E', textTransform: 'uppercase', letterSpacing: '0.6px' }}>Actions</span>
              </div>
              <p style={{ fontSize: 22, fontWeight: 600, color: '#0A0A0A', margin: 0, letterSpacing: '-0.6px' }}>{MEETING.actions.length}</p>
              <p style={{ fontSize: 12, color: '#78716C', margin: '2px 0 0' }}>Assigned with owners</p>
            </div>
          </div>
        </div>
      )}

      {tab === 'decisions' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {MEETING.decisions.map((d, i) => (
            <div key={i} style={{
              display: 'flex', gap: 14, padding: '18px 20px',
              background: '#FAFAF9', borderRadius: 10,
              border: '1px solid rgba(10,10,10,0.06)',
            }}>
              <div style={{
                width: 26, height: 26, borderRadius: 7, flexShrink: 0,
                background: 'rgba(15,118,110,0.1)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <GitBranch size={13} color="#0F766E" strokeWidth={2.2} />
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: 14.5, color: '#0A0A0A', margin: 0, lineHeight: 1.5, fontWeight: 450, letterSpacing: '-0.1px' }}>{d}</p>
                <p style={{ fontSize: 11.5, color: '#78716C', margin: '6px 0 0' }}>Decided at {MEETING.date}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === 'actions' && <ActionsList />}
    </div>
  )
}

function ActionsList() {
  const [checked, setChecked] = useState<Record<number, boolean>>({})
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      {MEETING.actions.map((a, i) => {
        const done = !!checked[i]
        return (
          <div key={i} style={{
            display: 'flex', gap: 14, padding: '16px 18px',
            background: done ? '#FAFAF9' : '#FFFFFF',
            borderRadius: 10, border: '1px solid rgba(10,10,10,0.08)',
            transition: 'background 200ms',
          }}>
            <button
              onClick={() => setChecked(c => ({ ...c, [i]: !c[i] }))}
              aria-label={done ? 'Mark incomplete' : 'Mark complete'}
              style={{
                width: 20, height: 20, borderRadius: 5, flexShrink: 0, marginTop: 2,
                border: done ? 'none' : '1.5px solid #A8A29E',
                background: done ? '#0A0A0A' : 'transparent', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'all 180ms',
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
                opacity: done ? 0.5 : 1, transition: 'all 180ms',
              }}>{a.text}</p>
              <div style={{ display: 'flex', gap: 12, marginTop: 6, alignItems: 'center' }}>
                <span style={{ fontSize: 12, color: '#57534E', fontWeight: 450 }}>{a.owner}</span>
                <span style={{ width: 3, height: 3, borderRadius: '50%', background: '#D6D3D1' }} />
                <span style={{ fontSize: 12, color: '#78716C', display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                  <Clock size={10} strokeWidth={2.2} />{a.due}
                </span>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

function HowItWorks() {
  const steps = [
    { n: '01', title: 'Capture', desc: 'Recall records the conversation, whether it happens in a browser, over calendar-linked calls, or from uploaded audio.', icon: <Mic size={18} strokeWidth={1.8} /> },
    { n: '02', title: 'Understand', desc: 'The transcript is restructured into a summary, decisions, action items, and the topics that were actually discussed.', icon: <Sparkles size={18} strokeWidth={1.8} /> },
    { n: '03', title: 'Remember', desc: 'Search across every meeting or ask Recall a direct question. Answers come with references to the moment they were said.', icon: <Search size={18} strokeWidth={1.8} /> },
    { n: '04', title: 'Act', desc: 'Decisions and next steps stop living in someone\'s notebook. Every action item has an owner and a deadline attached to it.', icon: <CheckSquare size={18} strokeWidth={1.8} /> },
  ]

  return (
    <section id="how" style={{ padding: 'clamp(80px, 10vw, 130px) clamp(20px, 4vw, 32px)', background: '#FAFAF9' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <Reveal>
          <div style={{ maxWidth: 720, marginBottom: 64 }}>
            <span style={{
              display: 'inline-block', fontSize: 11.5, color: '#78716C', fontWeight: 500,
              textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 20,
            }}>How it works</span>
            <h2 style={{
              fontSize: 'clamp(30px, 4.5vw, 54px)', fontWeight: 600,
              letterSpacing: '-1.6px', lineHeight: 1.05, color: '#0A0A0A', margin: 0,
            }}>
              Four steps between the meeting<br />and what you actually needed from it.
            </h2>
          </div>
        </Reveal>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 1, background: 'rgba(10,10,10,0.08)', border: '1px solid rgba(10,10,10,0.08)', borderRadius: 12, overflow: 'hidden' }}>
          {steps.map((s, i) => (
            <Reveal key={s.n} delay={i * 80}>
              <div style={{
                padding: '32px 28px', background: '#FFFFFF', height: '100%',
              }}>
                <div style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  marginBottom: 32,
                }}>
                  <span style={{
                    fontSize: 12, fontWeight: 500, color: '#A8A29E',
                    fontVariantNumeric: 'tabular-nums', letterSpacing: '0.5px',
                  }}>{s.n}</span>
                  <div style={{
                    width: 32, height: 32, borderRadius: 8,
                    background: '#FAFAF9',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: '#0A0A0A',
                  }}>{s.icon}</div>
                </div>
                <h3 style={{
                  fontSize: 19, fontWeight: 600, color: '#0A0A0A',
                  margin: '0 0 8px', letterSpacing: '-0.4px',
                }}>{s.title}</h3>
                <p style={{ fontSize: 13.5, color: '#57534E', lineHeight: 1.55, margin: 0, letterSpacing: '-0.05px' }}>{s.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

function Features() {
  const features = [
    { icon: Mic, title: 'Meeting recording', desc: 'Capture any conversation, whether scheduled through your calendar or ad-hoc.' },
    { icon: FileText, title: 'Transcription', desc: 'Speaker-attributed transcripts you can read, skim, or reference.' },
    { icon: Sparkles, title: 'AI summaries', desc: 'The essential shape of the conversation, without a wall of text.' },
    { icon: CheckSquare, title: 'Action items', desc: 'Automatically extracted with owners and due dates when they were mentioned.' },
    { icon: GitBranch, title: 'Decision tracking', desc: 'Every commitment made in a meeting, stored with the context around it.' },
    { icon: Hash, title: 'Topic extraction', desc: 'The threads of what was actually discussed, structured for future reference.' },
    { icon: Search, title: 'Full-text search', desc: 'Find any moment across every meeting you\'ve ever had.' },
    { icon: MessageSquareText, title: 'Ask Recall', desc: 'Ask questions in natural language. Get answers with sources.' },
    { icon: Calendar, title: 'Calendar sync', desc: 'Recall sees upcoming meetings and prepares to capture them.' },
    { icon: Clock, title: 'Meeting history', desc: 'A durable timeline of everything your team has discussed and decided.' },
    { icon: Lock, title: 'Private by default', desc: 'Recordings belong to their owner. Access is explicit.' },
    { icon: Share2, title: 'Shareable records', desc: 'Send a meeting summary to someone who wasn\'t there.' },
  ]

  return (
    <section id="features" style={{ padding: 'clamp(80px, 10vw, 130px) clamp(20px, 4vw, 32px)', background: '#FFFFFF' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <Reveal>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: 40, marginBottom: 64, flexWrap: 'wrap' }}>
            <div style={{ maxWidth: 640 }}>
              <span style={{
                display: 'inline-block', fontSize: 11.5, color: '#78716C', fontWeight: 500,
                textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 20,
              }}>Features</span>
              <h2 style={{
                fontSize: 'clamp(30px, 4.5vw, 54px)', fontWeight: 600,
                letterSpacing: '-1.6px', lineHeight: 1.05, color: '#0A0A0A', margin: 0,
              }}>
                Everything a meeting needs to<br />outlive the conversation.
              </h2>
            </div>
          </div>
        </Reveal>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: 1, background: 'rgba(10,10,10,0.06)',
          border: '1px solid rgba(10,10,10,0.06)', borderRadius: 12, overflow: 'hidden',
        }}>
          {features.map((f, i) => {
            const Icon = f.icon
            return (
              <Reveal key={f.title} delay={i * 30}>
                <div className="rc-feature" style={{
                  padding: '28px 26px', background: '#FFFFFF', height: '100%',
                  transition: 'background 200ms',
                }}>
                  <div style={{
                    width: 34, height: 34, borderRadius: 8,
                    background: '#FAFAF9', border: '1px solid rgba(10,10,10,0.06)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: '#0A0A0A', marginBottom: 20,
                  }}>
                    <Icon size={16} strokeWidth={1.8} />
                  </div>
                  <h3 style={{
                    fontSize: 15, fontWeight: 600, color: '#0A0A0A',
                    margin: '0 0 6px', letterSpacing: '-0.2px',
                  }}>{f.title}</h3>
                  <p style={{ fontSize: 13.5, color: '#57534E', lineHeight: 1.55, margin: 0, letterSpacing: '-0.05px' }}>{f.desc}</p>
                </div>
              </Reveal>
            )
          })}
        </div>
      </div>
    </section>
  )
}

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
      text: "The team focused on onboarding conversion, API readiness, and pricing. Onboarding drop-off is the top priority, with a redesigned flow shipping Friday. The public API launch is blocked on rate limiting. Pricing page copy is being reviewed for a Nov 20 update.",
      sources: [
        { title: 'Q4 Roadmap Review', date: 'Nov 12' },
        { title: 'API Planning', date: 'Nov 8' },
        { title: 'Pricing Review', date: 'Nov 6' },
      ],
    },
  }

  const [selected, setSelected] = useState<string | null>(suggestions[0])
  const [phase, setPhase] = useState<'idle' | 'answering' | 'done'>('done')
  const { ref, visible } = useReveal<HTMLDivElement>()

  const ask = useCallback((q: string) => {
    setSelected(q)
    setPhase('answering')
    setTimeout(() => setPhase('done'), 700)
  }, [])

  useEffect(() => {
    if (visible) {
      setPhase('answering')
      const t = setTimeout(() => setPhase('done'), 900)
      return () => clearTimeout(t)
    }
  }, [visible])

  const answer = selected ? answers[selected] : null

  return (
    <section style={{ padding: 'clamp(80px, 10vw, 130px) clamp(20px, 4vw, 32px)', background: '#FAFAF9' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.4fr', gap: 64, alignItems: 'center' }} className="rc-ask-grid">
          <Reveal>
            <div>
              <span style={{
                display: 'inline-block', fontSize: 11.5, color: '#78716C', fontWeight: 500,
                textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 20,
              }}>Ask Recall</span>
              <h2 style={{
                fontSize: 'clamp(28px, 4vw, 46px)', fontWeight: 600,
                letterSpacing: '-1.4px', lineHeight: 1.08, color: '#0A0A0A', margin: '0 0 20px',
              }}>
                A question is faster than<br />scrolling through six meetings.
              </h2>
              <p style={{ fontSize: 16, color: '#57534E', lineHeight: 1.6, margin: '0 0 28px', fontWeight: 400, letterSpacing: '-0.1px' }}>
                Ask Recall pulls from every meeting you've captured and answers in your own words — with the source moments attached, so you can verify what you're being told.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {[
                  'Natural-language answers',
                  'Grounded in real transcripts',
                  'Sources cited inline',
                ].map(item => (
                  <div key={item} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{
                      width: 16, height: 16, borderRadius: 4, background: '#0A0A0A',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      <svg width="9" height="9" viewBox="0 0 12 12" fill="none">
                        <path d="M2.5 6.5L4.8 8.8L9.5 3.5" stroke="#FAFAF9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                    <span style={{ fontSize: 14, color: '#292524', letterSpacing: '-0.1px' }}>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>

          <Reveal delay={120}>
            <div ref={ref} style={{
              background: '#FFFFFF', borderRadius: 14,
              border: '1px solid rgba(10,10,10,0.08)',
              boxShadow: '0 20px 40px -20px rgba(10,10,10,0.14)',
              overflow: 'hidden',
            }}>
              <div style={{
                padding: '14px 18px', borderBottom: '1px solid rgba(10,10,10,0.06)',
                display: 'flex', alignItems: 'center', gap: 10,
              }}>
                <div style={{
                  width: 24, height: 24, borderRadius: 6, background: '#0A0A0A',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <Sparkles size={12} color="#FAFAF9" strokeWidth={2} />
                </div>
                <span style={{ fontSize: 13, fontWeight: 550, color: '#0A0A0A', letterSpacing: '-0.1px' }}>Ask Recall</span>
                <span style={{ marginLeft: 'auto', fontSize: 11.5, color: '#78716C', display: 'inline-flex', alignItems: 'center', gap: 5 }}>
                  <Command size={11} strokeWidth={2} /> K
                </span>
              </div>

              <div style={{ padding: '20px 22px', minHeight: 340 }}>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 22 }}>
                  {suggestions.map(s => (
                    <button
                      key={s}
                      onClick={() => ask(s)}
                      className="rc-suggestion"
                      style={{
                        fontSize: 12.5, padding: '7px 12px',
                        background: selected === s ? '#0A0A0A' : '#FAFAF9',
                        color: selected === s ? '#FAFAF9' : '#404040',
                        border: '1px solid ' + (selected === s ? '#0A0A0A' : 'rgba(10,10,10,0.08)'),
                        borderRadius: 100, cursor: 'pointer', fontWeight: 450,
                        letterSpacing: '-0.05px', textAlign: 'left',
                        transition: 'all 180ms',
                      }}
                    >{s}</button>
                  ))}
                </div>

                {selected && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                    <div style={{
                      padding: '10px 14px', background: '#FAFAF9', borderRadius: 8,
                      border: '1px solid rgba(10,10,10,0.06)',
                      fontSize: 13.5, color: '#292524', letterSpacing: '-0.1px',
                    }}>{selected}</div>

                    {phase === 'answering' ? (
                      <div style={{ display: 'flex', gap: 6, padding: '8px 4px' }}>
                        {[0, 1, 2].map(i => (
                          <span key={i} className="rc-dot" style={{
                            width: 6, height: 6, borderRadius: '50%', background: '#A8A29E',
                            animationDelay: `${i * 0.15}s`,
                          }} />
                        ))}
                      </div>
                    ) : answer && (
                      <div style={{ animation: 'rc-fadein 400ms cubic-bezier(0.16,1,0.3,1)' }}>
                        <p style={{
                          fontSize: 14, color: '#0A0A0A', lineHeight: 1.65,
                          margin: '0 0 16px', letterSpacing: '-0.1px', fontWeight: 400,
                        }}>{answer.text}</p>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                          {answer.sources.map(src => (
                            <span key={src.title} style={{
                              display: 'inline-flex', alignItems: 'center', gap: 6,
                              fontSize: 11.5, padding: '5px 10px',
                              background: '#FFFFFF', color: '#404040',
                              border: '1px solid rgba(10,10,10,0.08)', borderRadius: 6,
                              fontWeight: 450, letterSpacing: '-0.05px',
                            }}>
                              <FileText size={10} strokeWidth={2} color="#78716C" />
                              {src.title}
                              <span style={{ color: '#A8A29E' }}>·</span>
                              <span style={{ color: '#78716C' }}>{src.date}</span>
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div style={{
                padding: '12px 18px', borderTop: '1px solid rgba(10,10,10,0.06)',
                display: 'flex', gap: 8, background: '#FAFAF9',
              }}>
                <div style={{
                  flex: 1, padding: '9px 12px', background: '#FFFFFF',
                  border: '1px solid rgba(10,10,10,0.08)', borderRadius: 8,
                  fontSize: 13, color: '#A8A29E', letterSpacing: '-0.05px',
                }}>Ask about anything you've discussed…</div>
                <Link href="/login" style={{
                  padding: '9px 16px', background: '#0A0A0A', color: '#FAFAF9',
                  borderRadius: 8, fontSize: 13, fontWeight: 500, textDecoration: 'none',
                  letterSpacing: '-0.05px', whiteSpace: 'nowrap',
                }}>Try it</Link>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}

function Workflow() {
  const meetings = [
    { time: '09:00', title: 'Product Strategy', duration: '45 min', color: '#B45309', captured: true },
    { time: '11:30', title: 'Engineering Sync', duration: '30 min', color: '#0F766E', captured: true },
    { time: '14:00', title: 'Customer Research', duration: '60 min', color: '#7C3AED', captured: true },
    { time: '16:00', title: 'Weekly Review', duration: '45 min', color: '#BE185D', captured: false },
  ]

  return (
    <section style={{ padding: 'clamp(80px, 10vw, 130px) clamp(20px, 4vw, 32px)', background: '#FFFFFF' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 1fr', gap: 64, alignItems: 'center' }} className="rc-workflow-grid">
          <Reveal>
            <div style={{
              background: '#FAFAF9', borderRadius: 14, padding: 22,
              border: '1px solid rgba(10,10,10,0.06)',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
                <div>
                  <p style={{ fontSize: 11.5, color: '#78716C', margin: 0, fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.6px' }}>Today</p>
                  <p style={{ fontSize: 16, fontWeight: 600, color: '#0A0A0A', margin: '2px 0 0', letterSpacing: '-0.2px' }}>Wednesday, November 13</p>
                </div>
                <div style={{
                  fontSize: 11, color: '#57534E', padding: '5px 10px',
                  background: '#FFFFFF', border: '1px solid rgba(10,10,10,0.08)', borderRadius: 100,
                  fontWeight: 450,
                }}>Calendar connected</div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {meetings.map(m => (
                  <div key={m.title} style={{
                    display: 'flex', alignItems: 'center', gap: 14, padding: '14px 16px',
                    background: '#FFFFFF', borderRadius: 10, border: '1px solid rgba(10,10,10,0.06)',
                  }}>
                    <div style={{
                      fontSize: 12, fontWeight: 500, color: '#57534E',
                      fontVariantNumeric: 'tabular-nums', letterSpacing: '-0.05px',
                      width: 44,
                    }}>{m.time}</div>
                    <div style={{ width: 3, alignSelf: 'stretch', background: m.color, borderRadius: 2 }} />
                    <div style={{ flex: 1 }}>
                      <p style={{ fontSize: 13.5, fontWeight: 550, color: '#0A0A0A', margin: 0, letterSpacing: '-0.15px' }}>{m.title}</p>
                      <p style={{ fontSize: 11.5, color: '#78716C', margin: '2px 0 0' }}>{m.duration}</p>
                    </div>
                    {m.captured ? (
                      <span style={{
                        display: 'inline-flex', alignItems: 'center', gap: 4,
                        fontSize: 11, fontWeight: 500, color: '#0A0A0A',
                        padding: '4px 8px', background: '#F5F5F4', borderRadius: 6,
                      }}>
                        <Circle size={6} fill="#0A0A0A" stroke="none" />
                        Captured
                      </span>
                    ) : (
                      <span style={{
                        fontSize: 11, fontWeight: 500, color: '#78716C',
                        padding: '4px 8px', background: '#FAFAF9', borderRadius: 6,
                        border: '1px dashed rgba(10,10,10,0.15)',
                      }}>Upcoming</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </Reveal>

          <Reveal delay={120}>
            <div>
              <span style={{
                display: 'inline-block', fontSize: 11.5, color: '#78716C', fontWeight: 500,
                textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 20,
              }}>Workflow</span>
              <h2 style={{
                fontSize: 'clamp(28px, 4vw, 46px)', fontWeight: 600,
                letterSpacing: '-1.4px', lineHeight: 1.08, color: '#0A0A0A', margin: '0 0 20px',
              }}>
                Recall doesn't create another<br />place you have to maintain.
              </h2>
              <p style={{ fontSize: 16, color: '#57534E', lineHeight: 1.6, margin: '0 0 28px', fontWeight: 400, letterSpacing: '-0.1px' }}>
                Connect your calendar and Recall becomes the memory layer around meetings you're already having. Every scheduled call turns into a searchable record — automatically.
              </p>
              <Link href="/login" className="rc-btn-ghost" style={{
                display: 'inline-flex', alignItems: 'center', gap: 6,
                padding: '11px 18px', border: '1px solid rgba(10,10,10,0.12)', borderRadius: 10,
                fontSize: 14, fontWeight: 500, color: '#0A0A0A', textDecoration: 'none',
                letterSpacing: '-0.1px', transition: 'background 180ms',
              }}>
                Connect your calendar <ArrowRight size={14} strokeWidth={2.2} />
              </Link>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}

function Privacy() {
  const points = [
    { title: 'Private by default', desc: 'Recordings and transcripts belong to the person who created them. Nothing is shared unless it\'s explicitly shared.' },
    { title: 'Authenticated access', desc: 'Meeting data is gated behind account authentication. Only signed-in owners can access their recordings.' },
    { title: 'Controlled sharing', desc: 'When you share a meeting summary, the recipient sees exactly what you chose to share — and nothing else.' },
    { title: 'Secure storage', desc: 'Meeting content is stored with modern cloud security practices, isolated per account.' },
  ]

  return (
    <section style={{ padding: 'clamp(80px, 10vw, 130px) clamp(20px, 4vw, 32px)', background: '#FAFAF9' }}>
      <div style={{ maxWidth: 1000, margin: '0 auto' }}>
        <Reveal>
          <div style={{ maxWidth: 640, marginBottom: 48 }}>
            <span style={{
              display: 'inline-block', fontSize: 11.5, color: '#78716C', fontWeight: 500,
              textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 20,
            }}>Privacy</span>
            <h2 style={{
              fontSize: 'clamp(28px, 4vw, 46px)', fontWeight: 600,
              letterSpacing: '-1.4px', lineHeight: 1.08, color: '#0A0A0A', margin: 0,
            }}>
              Your meetings are yours.<br />That's the whole point.
            </h2>
          </div>
        </Reveal>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 32 }}>
          {points.map((p, i) => (
            <Reveal key={p.title} delay={i * 60}>
              <div>
                <div style={{
                  width: 28, height: 28, borderRadius: 7,
                  background: '#0A0A0A',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  marginBottom: 16,
                }}>
                  <Lock size={13} color="#FAFAF9" strokeWidth={2} />
                </div>
                <h3 style={{ fontSize: 15, fontWeight: 600, color: '#0A0A0A', margin: '0 0 6px', letterSpacing: '-0.2px' }}>{p.title}</h3>
                <p style={{ fontSize: 13.5, color: '#57534E', lineHeight: 1.55, margin: 0, letterSpacing: '-0.05px' }}>{p.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

function Pricing() {
  return (
    <section id="pricing" style={{ padding: 'clamp(80px, 10vw, 130px) clamp(20px, 4vw, 32px)', background: '#FFFFFF' }}>
      <div style={{ maxWidth: 1000, margin: '0 auto' }}>
        <Reveal>
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <span style={{
              display: 'inline-block', fontSize: 11.5, color: '#78716C', fontWeight: 500,
              textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 20,
            }}>Pricing</span>
            <h2 style={{
              fontSize: 'clamp(30px, 4.5vw, 54px)', fontWeight: 600,
              letterSpacing: '-1.6px', lineHeight: 1.05, color: '#0A0A0A', margin: '0 0 16px',
            }}>
              Build your memory layer.
            </h2>
            <p style={{ fontSize: 16, color: '#57534E', margin: 0, letterSpacing: '-0.1px', maxWidth: 480, marginInline: 'auto', lineHeight: 1.55 }}>
              Recall is free during early access. No credit card, no seat minimums, no per-meeting billing.
            </p>
          </div>
        </Reveal>

        <Reveal delay={100}>
          <div style={{
            display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16,
          }} className="rc-pricing-grid">
            <div style={{
              padding: 32, background: '#FAFAF9',
              border: '1px solid rgba(10,10,10,0.08)', borderRadius: 14,
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
                <div>
                  <p style={{ fontSize: 13, fontWeight: 550, color: '#0A0A0A', margin: 0, letterSpacing: '-0.1px' }}>Early Access</p>
                  <p style={{ fontSize: 12, color: '#78716C', margin: '2px 0 0' }}>For individuals and teams</p>
                </div>
                <span style={{
                  fontSize: 10.5, fontWeight: 600, color: '#B45309',
                  background: 'rgba(180,83,9,0.08)', padding: '3px 9px', borderRadius: 100,
                  textTransform: 'uppercase', letterSpacing: '0.5px',
                }}>Current</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 24 }}>
                <span style={{ fontSize: 44, fontWeight: 600, color: '#0A0A0A', letterSpacing: '-2px', lineHeight: 1 }}>Free</span>
                <span style={{ fontSize: 13, color: '#78716C' }}>during early access</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 28 }}>
                {['Unlimited meeting recording', 'Full transcript, summary, decisions & action items', 'Ask Recall across your meeting history', 'Calendar integration'].map(f => (
                  <div key={f} style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                    <div style={{
                      width: 15, height: 15, borderRadius: 4, background: '#0A0A0A',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                    }}>
                      <svg width="9" height="9" viewBox="0 0 12 12" fill="none">
                        <path d="M2.5 6.5L4.8 8.8L9.5 3.5" stroke="#FAFAF9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                    <span style={{ fontSize: 13.5, color: '#292524', letterSpacing: '-0.05px' }}>{f}</span>
                  </div>
                ))}
              </div>
              <Link href="/login" style={{
                display: 'block', textAlign: 'center', padding: '12px 20px',
                background: '#0A0A0A', color: '#FAFAF9', borderRadius: 10,
                fontSize: 14, fontWeight: 500, textDecoration: 'none', letterSpacing: '-0.1px',
              }}>Get started</Link>
            </div>

            <div style={{
              padding: 32, background: '#FFFFFF',
              border: '1px dashed rgba(10,10,10,0.15)', borderRadius: 14,
              display: 'flex', flexDirection: 'column',
            }}>
              <div style={{ marginBottom: 20 }}>
                <p style={{ fontSize: 13, fontWeight: 550, color: '#0A0A0A', margin: 0, letterSpacing: '-0.1px' }}>Team</p>
                <p style={{ fontSize: 12, color: '#78716C', margin: '2px 0 0' }}>For organizations</p>
              </div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 24 }}>
                <span style={{ fontSize: 44, fontWeight: 600, color: '#0A0A0A', letterSpacing: '-2px', lineHeight: 1 }}>Soon</span>
              </div>
              <p style={{ fontSize: 13.5, color: '#57534E', lineHeight: 1.55, margin: '0 0 auto', letterSpacing: '-0.05px' }}>
                Shared workspaces, team-wide search across meetings, and administrative controls are in development. Get started with early access today and we'll bring you along.
              </p>
              <div style={{ marginTop: 28, paddingTop: 20, borderTop: '1px solid rgba(10,10,10,0.06)' }}>
                <Link href="/login" className="rc-btn-ghost" style={{
                  display: 'inline-flex', alignItems: 'center', gap: 6,
                  fontSize: 13.5, fontWeight: 500, color: '#0A0A0A', textDecoration: 'none',
                  letterSpacing: '-0.05px',
                }}>
                  Start with early access <ArrowRight size={13} strokeWidth={2.2} />
                </Link>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

function FAQ() {
  const items = [
    { q: 'What is Recall?', a: 'Recall is a meeting intelligence tool. It records your meetings, transcribes them, and turns each conversation into a structured record — with a summary, decisions, action items, and searchable topics.' },
    { q: 'How does meeting recording work?', a: 'You can capture meetings directly from Recall, or connect your calendar so scheduled meetings are captured automatically. Recall handles the transcription and processing afterwards.' },
    { q: 'Can Recall summarize meetings?', a: 'Yes. After a meeting is captured, Recall produces a concise summary along with the key decisions and any action items that came out of the conversation.' },
    { q: 'Can I search across all of my meetings?', a: 'Yes. Full-text search runs across every transcript and summary in your workspace, so you can find the exact moment something was said.' },
    { q: 'What is Ask Recall?', a: 'Ask Recall is a natural-language interface over your meeting history. Instead of scrubbing through recordings, you ask a question and get an answer with citations to the meetings it came from.' },
    { q: 'Does Recall work with Google Calendar?', a: 'Yes. Connect your Google Calendar and Recall will surface your upcoming meetings and prepare to capture them automatically.' },
    { q: 'How is my meeting data handled?', a: 'Recordings and transcripts belong to the account that created them. Access is authenticated, and you decide what — if anything — to share with others.' },
  ]

  const [open, setOpen] = useState<number | null>(0)

  return (
    <section id="faq" style={{ padding: 'clamp(80px, 10vw, 130px) clamp(20px, 4vw, 32px)', background: '#FAFAF9' }}>
      <div style={{ maxWidth: 860, margin: '0 auto' }}>
        <Reveal>
          <div style={{ marginBottom: 48 }}>
            <span style={{
              display: 'inline-block', fontSize: 11.5, color: '#78716C', fontWeight: 500,
              textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 20,
            }}>Questions</span>
            <h2 style={{
              fontSize: 'clamp(28px, 4vw, 46px)', fontWeight: 600,
              letterSpacing: '-1.4px', lineHeight: 1.08, color: '#0A0A0A', margin: 0,
            }}>
              Frequently asked.
            </h2>
          </div>
        </Reveal>

        <div style={{
          background: '#FFFFFF', borderRadius: 14,
          border: '1px solid rgba(10,10,10,0.08)', overflow: 'hidden',
        }}>
          {items.map((it, i) => {
            const isOpen = open === i
            return (
              <div key={it.q} style={{
                borderBottom: i < items.length - 1 ? '1px solid rgba(10,10,10,0.06)' : 'none',
              }}>
                <button
                  onClick={() => setOpen(isOpen ? null : i)}
                  aria-expanded={isOpen}
                  style={{
                    width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '20px 24px', background: 'transparent', border: 'none',
                    cursor: 'pointer', textAlign: 'left', gap: 20,
                  }}
                >
                  <span style={{ fontSize: 15, fontWeight: 500, color: '#0A0A0A', letterSpacing: '-0.15px' }}>{it.q}</span>
                  <span style={{
                    width: 22, height: 22, borderRadius: 6, background: '#FAFAF9',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: '#404040', flexShrink: 0, transition: 'transform 200ms',
                    transform: isOpen ? 'rotate(180deg)' : 'none',
                  }}>
                    {isOpen ? <Minus size={12} strokeWidth={2.2} /> : <Plus size={12} strokeWidth={2.2} />}
                  </span>
                </button>
                <div style={{
                  maxHeight: isOpen ? 300 : 0, overflow: 'hidden',
                  transition: 'max-height 300ms cubic-bezier(0.16,1,0.3,1)',
                }}>
                  <p style={{
                    fontSize: 14, color: '#57534E', lineHeight: 1.65,
                    margin: 0, padding: '0 24px 22px', letterSpacing: '-0.05px',
                    maxWidth: 680,
                  }}>{it.a}</p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

function FinalCTA() {
  return (
    <section style={{
      padding: 'clamp(90px, 12vw, 140px) clamp(20px, 4vw, 32px)',
      background: '#0A0A0A', position: 'relative', overflow: 'hidden',
    }}>
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        background: 'radial-gradient(60% 50% at 50% 40%, rgba(180,83,9,0.14), transparent 70%)',
      }} />
      <div style={{ maxWidth: 780, margin: '0 auto', textAlign: 'center', position: 'relative' }}>
        <Reveal>
          <h2 style={{
            fontSize: 'clamp(38px, 6vw, 74px)', fontWeight: 600,
            letterSpacing: '-2.4px', lineHeight: 1.02, color: '#FAFAF9', margin: '0 0 22px',
          }}>
            Stop taking notes.<br />
            <span style={{ color: '#A8A29E', fontStyle: 'italic', fontWeight: 400 }}>Start remembering.</span>
          </h2>
          <p style={{
            fontSize: 'clamp(16px, 1.8vw, 18px)', color: 'rgba(250,250,249,0.6)',
            lineHeight: 1.55, fontWeight: 400, letterSpacing: '-0.15px',
            maxWidth: 540, margin: '0 auto 40px',
          }}>
            Turn every conversation into something your team can find, understand, and act on.
          </p>
          <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/login" style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              padding: '14px 24px', background: '#FAFAF9', color: '#0A0A0A',
              borderRadius: 10, fontSize: 15, fontWeight: 550, textDecoration: 'none',
              letterSpacing: '-0.1px', transition: 'transform 180ms',
            }} className="rc-btn-primary">
              Get started <ArrowRight size={15} strokeWidth={2.2} />
            </Link>
            <a href="#product" style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              padding: '14px 22px', background: 'transparent', color: '#FAFAF9',
              border: '1px solid rgba(250,250,249,0.18)', borderRadius: 10,
              fontSize: 15, fontWeight: 500, textDecoration: 'none', letterSpacing: '-0.1px',
              transition: 'background 180ms',
            }} className="rc-btn-ghost-dark">
              Explore Recall
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

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
    <footer style={{ padding: '64px clamp(20px, 4vw, 32px) 40px', background: '#FFFFFF', borderTop: '1px solid rgba(10,10,10,0.06)' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div style={{
          display: 'grid', gridTemplateColumns: '1.6fr repeat(3, 1fr)', gap: 40,
        }} className="rc-footer-grid">
          <div>
            <Logo />
            <p style={{
              fontSize: 13, color: '#57534E', margin: '14px 0 0', maxWidth: 300,
              lineHeight: 1.6, letterSpacing: '-0.05px',
            }}>
              Meeting intelligence for people who can't afford to forget what happened.
            </p>
          </div>
          {groups.map(g => (
            <div key={g.title}>
              <p style={{
                fontSize: 11.5, fontWeight: 600, color: '#78716C',
                textTransform: 'uppercase', letterSpacing: '0.8px', margin: '0 0 14px',
              }}>{g.title}</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {g.links.map(l => (
                  l.href.startsWith('/') ? (
                    <Link key={l.label} href={l.href} className="rc-footer-link" style={{
                      fontSize: 13, color: '#404040', textDecoration: 'none',
                      letterSpacing: '-0.05px', transition: 'color 180ms',
                    }}>{l.label}</Link>
                  ) : (
                    <a key={l.label} href={l.href} className="rc-footer-link" style={{
                      fontSize: 13, color: '#404040', textDecoration: 'none',
                      letterSpacing: '-0.05px', transition: 'color 180ms',
                    }}>{l.label}</a>
                  )
                ))}
              </div>
            </div>
          ))}
        </div>
        <div style={{
          marginTop: 56, paddingTop: 24,
          borderTop: '1px solid rgba(10,10,10,0.06)',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          flexWrap: 'wrap', gap: 12,
        }}>
          <p style={{ fontSize: 12, color: '#78716C', margin: 0, letterSpacing: '-0.05px' }}>
            © {new Date().getFullYear()} Recall. All rights reserved.
          </p>
          <p style={{ fontSize: 12, color: '#78716C', margin: 0, letterSpacing: '-0.05px' }}>
            Meeting intelligence, built quietly.
          </p>
        </div>
      </div>
    </footer>
  )
}

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

  @keyframes rc-fadein { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: none; } }
  @keyframes rc-dot { 0%, 100% { opacity: 0.3; transform: scale(0.8); } 50% { opacity: 1; transform: scale(1); } }
  .rc-dot { animation: rc-dot 1.1s cubic-bezier(0.16,1,0.3,1) infinite; }

  .rc-nav-link:hover { color: #0A0A0A !important; background: rgba(10,10,10,0.04); }
  .rc-btn-primary:hover { background: #262626 !important; transform: translateY(-1px); }
  .rc-btn-ghost:hover { background: #F5F5F4 !important; border-color: rgba(10,10,10,0.16) !important; }
  .rc-btn-ghost-dark:hover { background: rgba(250,250,249,0.08) !important; }
  .rc-tab:hover { background: #FAFAF9; color: #0A0A0A; }
  .rc-suggestion:hover { border-color: rgba(10,10,10,0.16) !important; }
  .rc-feature:hover { background: #FAFAF9 !important; }
  .rc-footer-link:hover { color: #0A0A0A !important; }

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
    .rc-hero-body > div:first-child { border-right: none !important; border-bottom: 1px solid rgba(10,10,10,0.06); }
    .rc-showcase-body { grid-template-columns: 1fr !important; }
    .rc-showcase-side { border-left: none !important; border-top: 1px solid rgba(10,10,10,0.06); }
    .rc-ask-grid, .rc-workflow-grid { grid-template-columns: 1fr !important; gap: 40px !important; }
    .rc-pricing-grid { grid-template-columns: 1fr !important; }
    .rc-stages { grid-template-columns: 1fr 1fr !important; gap: 24px !important; }
    .rc-stages > div { border-left: none !important; }
    .rc-summary-grid { grid-template-columns: 1fr !important; }
    .rc-footer-grid { grid-template-columns: 1fr 1fr !important; }
  }

  @media (max-width: 480px) {
    .rc-footer-grid { grid-template-columns: 1fr !important; gap: 32px !important; }
    .rc-stages { grid-template-columns: 1fr !important; }
  }

  @media (prefers-reduced-motion: reduce) {
    *, *::before, *::after {
      animation-duration: 0.01ms !important;
      transition-duration: 0.01ms !important;
    }
    html { scroll-behavior: auto; }
  }
`

export default function LandingPage() {
  return (
    <>
      <style>{CSS}</style>
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