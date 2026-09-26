'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import Link from 'next/link'

type IconName =
  | 'arrow'
  | 'calendar'
  | 'check'
  | 'clock'
  | 'close'
  | 'file'
  | 'hash'
  | 'lock'
  | 'menu'
  | 'message'
  | 'mic'
  | 'minus'
  | 'play'
  | 'plus'
  | 'search'
  | 'spark'
  | 'split'
  | 'wave'

type Tab = 'transcript' | 'summary' | 'decisions' | 'actions'

const meeting = {
  title: 'Q4 Product Strategy',
  date: 'Wednesday, November 13',
  duration: '48 min',
  participants: [
    { name: 'Sarah Chen', initials: 'SC', color: '#B45309' },
    { name: 'Daniel Ortiz', initials: 'DO', color: '#0F766E' },
    { name: 'Priya Menon', initials: 'PM', color: '#7C3AED' },
    { name: 'James Ward', initials: 'JW', color: '#BE185D' },
  ],
  transcript: [
    {
      speaker: 'Sarah Chen',
      time: '00:41',
      text: 'The biggest Q4 priority is still onboarding. We are losing people before they experience the first useful moment in Recall.',
    },
    {
      speaker: 'Daniel Ortiz',
      time: '01:18',
      text: 'The workspace setup flow is asking for too much too early. We should get people into their first meeting before asking them to invite a team.',
    },
    {
      speaker: 'Priya Menon',
      time: '02:06',
      text: 'I can simplify that this week. The new flow can defer invitations until the first meeting has been processed.',
    },
    {
      speaker: 'Sarah Chen',
      time: '02:37',
      text: 'Let’s ship the new flow directly. We do not have enough traffic for an A/B test to teach us much right now.',
    },
    {
      speaker: 'James Ward',
      time: '03:22',
      text: 'I will also put together the rate limiting proposal before the public API work moves any further.',
    },
  ],
  summary:
    'The team aligned on making onboarding the highest Q4 priority. The workspace setup flow will be simplified so people can capture their first meeting before being asked to invite teammates. The redesign will ship directly instead of going through an A/B test. Public API work remains dependent on a rate limiting proposal.',
  decisions: [
    'Ship the simplified onboarding flow directly instead of running an A/B test.',
    'Move team invitations until after a user captures their first meeting.',
    'Keep public API work paused until rate limiting is reviewed.',
  ],
  actions: [
    {
      title: 'Redesign onboarding with deferred team invitations',
      owner: 'Priya Menon',
      due: 'Friday',
      color: '#7C3AED',
    },
    {
      title: 'Draft public API rate limiting proposal',
      owner: 'James Ward',
      due: 'Monday',
      color: '#BE185D',
    },
    {
      title: 'Review onboarding funnel after release',
      owner: 'Daniel Ortiz',
      due: 'Next week',
      color: '#0F766E',
    },
  ],
  topics: ['Onboarding', 'Activation', 'API', 'Rate limiting', 'Q4'],
}

const featureData: { icon: IconName; title: string; text: string }[] = [
  {
    icon: 'mic',
    title: 'Meeting capture',
    text: 'Record conversations without changing how your team already works.',
  },
  {
    icon: 'file',
    title: 'Speaker transcripts',
    text: 'Every conversation becomes readable, attributed and searchable.',
  },
  {
    icon: 'spark',
    title: 'Clear summaries',
    text: 'Get the shape of the meeting before you need to revisit every word.',
  },
  {
    icon: 'check',
    title: 'Action items',
    text: 'Tasks are pulled out with owners and dates from the conversation itself.',
  },
  {
    icon: 'split',
    title: 'Decision tracking',
    text: 'The commitments your team makes stay attached to the context behind them.',
  },
  {
    icon: 'hash',
    title: 'Topic mapping',
    text: 'Important themes become durable paths through your meeting history.',
  },
  {
    icon: 'search',
    title: 'Meeting search',
    text: 'Find the moment something was said instead of replaying a call.',
  },
  {
    icon: 'message',
    title: 'Ask Recall',
    text: 'Ask questions across your meetings and inspect the source behind every answer.',
  },
  {
    icon: 'calendar',
    title: 'Calendar context',
    text: 'Connect Google Calendar so scheduled conversations are ready when you are.',
  },
  {
    icon: 'wave',
    title: 'Google Meet import',
    text: 'Bring existing conference recordings and transcripts into the same memory layer.',
  },
  {
    icon: 'play',
    title: 'YouTube import',
    text: 'Turn recorded interviews, webinars and public videos into searchable knowledge.',
  },
  {
    icon: 'lock',
    title: 'Private workspace',
    text: 'Your meeting history stays behind authenticated access and account controls.',
  },
]

function Icon({
  name,
  size = 18,
  stroke = 1.8,
}: {
  name: IconName
  size?: number
  stroke?: number
}) {
  const base = {
    width: size,
    height: size,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: stroke,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    'aria-hidden': true,
  }

  if (name === 'arrow') {
    return (
      <svg {...base}>
        <path d="M5 12h13" />
        <path d="m13 6 6 6-6 6" />
      </svg>
    )
  }

  if (name === 'calendar') {
    return (
      <svg {...base}>
        <rect x="3" y="5" width="18" height="16" rx="3" />
        <path d="M7 3v4M17 3v4M3 10h18" />
      </svg>
    )
  }

  if (name === 'check') {
    return (
      <svg {...base}>
        <rect x="4" y="4" width="16" height="16" rx="4" />
        <path d="m8 12 2.5 2.5L16.5 9" />
      </svg>
    )
  }

  if (name === 'clock') {
    return (
      <svg {...base}>
        <circle cx="12" cy="12" r="8.5" />
        <path d="M12 7v5l3.5 2" />
      </svg>
    )
  }

  if (name === 'close') {
    return (
      <svg {...base}>
        <path d="m6 6 12 12M18 6 6 18" />
      </svg>
    )
  }

  if (name === 'file') {
    return (
      <svg {...base}>
        <path d="M7 3h7l4 4v14H7a3 3 0 0 1-3-3V6a3 3 0 0 1 3-3Z" />
        <path d="M14 3v5h5M8 13h8M8 17h5" />
      </svg>
    )
  }

  if (name === 'hash') {
    return (
      <svg {...base}>
        <path d="M9 3 7 21M17 3l-2 18M4 9h16M3 15h16" />
      </svg>
    )
  }

  if (name === 'lock') {
    return (
      <svg {...base}>
        <rect x="4" y="10" width="16" height="11" rx="3" />
        <path d="M8 10V7a4 4 0 0 1 8 0v3M12 14v3" />
      </svg>
    )
  }

  if (name === 'menu') {
    return (
      <svg {...base}>
        <path d="M4 7h16M4 12h16M4 17h16" />
      </svg>
    )
  }

  if (name === 'message') {
    return (
      <svg {...base}>
        <path d="M5 5.5A3.5 3.5 0 0 1 8.5 2h7A3.5 3.5 0 0 1 19 5.5v7a3.5 3.5 0 0 1-3.5 3.5H10l-5 4v-15Z" />
        <path d="M8 8h8M8 11.5h5" />
      </svg>
    )
  }

  if (name === 'mic') {
    return (
      <svg {...base}>
        <rect x="8" y="3" width="8" height="12" rx="4" />
        <path d="M5 11a7 7 0 0 0 14 0M12 18v3M9 21h6" />
      </svg>
    )
  }

  if (name === 'minus') {
    return (
      <svg {...base}>
        <path d="M6 12h12" />
      </svg>
    )
  }

  if (name === 'play') {
    return (
      <svg {...base}>
        <rect x="3" y="5" width="18" height="14" rx="3" />
        <path d="m10 9 5 3-5 3V9Z" fill="currentColor" stroke="none" />
      </svg>
    )
  }

  if (name === 'plus') {
    return (
      <svg {...base}>
        <path d="M12 5v14M5 12h14" />
      </svg>
    )
  }

  if (name === 'search') {
    return (
      <svg {...base}>
        <circle cx="10.5" cy="10.5" r="6.5" />
        <path d="m16 16 4.5 4.5" />
      </svg>
    )
  }

  if (name === 'spark') {
    return (
      <svg {...base}>
        <path d="m12 2 1.7 6.3L20 10l-6.3 1.7L12 18l-1.7-6.3L4 10l6.3-1.7L12 2Z" />
        <path d="m19 16 .7 2.3L22 19l-2.3.7L19 22l-.7-2.3L16 19l2.3-.7L19 16Z" />
      </svg>
    )
  }

  if (name === 'split') {
    return (
      <svg {...base}>
        <path d="M7 4v5a3 3 0 0 0 3 3h7M7 20v-5a3 3 0 0 1 3-3h7M14 7l3-3 3 3M14 17l3 3 3-3" />
      </svg>
    )
  }

  if (name === 'wave') {
    return (
      <svg {...base}>
        <path d="M3 12h2l2-7 4 14 3-10 2 3h5" />
      </svg>
    )
  }

  return null
}

function Logo({ light = false }: { light?: boolean }) {
  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 9 }}>
      <svg width="25" height="25" viewBox="0 0 25 25" fill="none" aria-hidden>
        <rect x="0.5" y="0.5" width="24" height="24" rx="7" fill={light ? '#F8F7F4' : '#11110F'} />
        <circle cx="12.5" cy="12.5" r="6.2" stroke={light ? '#11110F' : '#F8F7F4'} strokeWidth="1.55" />
        <circle cx="12.5" cy="12.5" r="2.1" fill={light ? '#11110F' : '#F8F7F4'} />
      </svg>
      <span
        style={{
          color: light ? '#F8F7F4' : '#11110F',
          fontWeight: 620,
          fontSize: 17,
          letterSpacing: '-0.55px',
        }}
      >
        Recall
      </span>
    </div>
  )
}

function useReveal() {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const element = ref.current
    if (!element) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        setVisible(true)
        observer.disconnect()
      },
      { threshold: 0.08, rootMargin: '0px 0px -56px 0px' }
    )

    observer.observe(element)
    return () => observer.disconnect()
  }, [])

  return { ref, visible }
}

function Reveal({
  children,
  delay = 0,
  className = '',
}: {
  children: React.ReactNode
  delay?: number
  className?: string
}) {
  const { ref, visible } = useReveal()

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translate3d(0,0,0)' : 'translate3d(0,22px,0)',
        transition: `opacity 760ms cubic-bezier(.16,1,.3,1) ${delay}ms, transform 760ms cubic-bezier(.16,1,.3,1) ${delay}ms`,
      }}
    >
      {children}
    </div>
  )
}

function useScrollAtmosphere() {
  useEffect(() => {
    let frame = 0

    const update = () => {
      frame = 0
      const root = document.documentElement
      const max = Math.max(document.documentElement.scrollHeight - window.innerHeight, 1)
      const y = window.scrollY
      root.style.setProperty('--rc-scroll', `${y}px`)
      root.style.setProperty('--rc-progress', `${Math.min(y / max, 1)}`)
    }

    const onScroll = () => {
      if (frame) return
      frame = window.requestAnimationFrame(update)
    }

    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)

    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      if (frame) window.cancelAnimationFrame(frame)
    }
  }, [])
}

function useTilt() {
  const ref = useRef<HTMLDivElement>(null)

  const onMove = (event: React.MouseEvent<HTMLDivElement>) => {
    const element = ref.current
    if (!element) return
    const bounds = element.getBoundingClientRect()
    const x = (event.clientX - bounds.left) / bounds.width
    const y = (event.clientY - bounds.top) / bounds.height
    element.style.setProperty('--tilt-x', `${(0.5 - y) * 2.1}deg`)
    element.style.setProperty('--tilt-y', `${(x - 0.5) * 2.5}deg`)
  }

  const onLeave = () => {
    const element = ref.current
    if (!element) return
    element.style.setProperty('--tilt-x', '0deg')
    element.style.setProperty('--tilt-y', '0deg')
  }

  return { ref, onMove, onLeave }
}

function Atmosphere() {
  return (
    <div className="rc-atmosphere" aria-hidden>
      <div className="rc-aura rc-aura-one" />
      <div className="rc-aura rc-aura-two" />
      <div className="rc-aura rc-aura-three" />
      <div className="rc-noise" />
      <div className="rc-grid-field" />
    </div>
  )
}

function Nav() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 18)
    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [mobileOpen])

  const links = [
    ['#product', 'Product'],
    ['#how-it-works', 'How it works'],
    ['#features', 'Features'],
    ['#pricing', 'Pricing'],
    ['#faq', 'Resources'],
  ]

  return (
    <>
      <nav className={`rc-nav ${scrolled ? 'rc-nav-scrolled' : ''}`}>
        <div className="rc-nav-inner">
          <Link href="/" aria-label="Recall home" style={{ textDecoration: 'none' }}>
            <Logo />
          </Link>

          <div className="rc-nav-links">
            {links.map(([href, label]) => (
              <a key={href} href={href} className="rc-nav-link">
                {label}
              </a>
            ))}
          </div>

          <div className="rc-nav-actions">
            <Link href="/login" className="rc-signin">
              Sign in
            </Link>
            <Link href="/login" className="rc-top-cta">
              Get started
              <Icon name="arrow" size={14} stroke={2.1} />
            </Link>
          </div>

          <button
            type="button"
            aria-label={mobileOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen(value => !value)}
            className="rc-mobile-trigger"
          >
            <Icon name={mobileOpen ? 'close' : 'menu'} size={21} stroke={2} />
          </button>
        </div>
      </nav>

      <div className={`rc-mobile-sheet ${mobileOpen ? 'rc-mobile-sheet-open' : ''}`}>
        <div className="rc-mobile-sheet-inner">
          {links.map(([href, label]) => (
            <a
              key={href}
              href={href}
              className="rc-mobile-link"
              onClick={() => setMobileOpen(false)}
            >
              {label}
              <Icon name="arrow" size={17} stroke={1.8} />
            </a>
          ))}
          <div className="rc-mobile-sheet-actions">
            <Link href="/login" className="rc-mobile-signin" onClick={() => setMobileOpen(false)}>
              Sign in
            </Link>
            <Link href="/login" className="rc-mobile-cta" onClick={() => setMobileOpen(false)}>
              Get started
              <Icon name="arrow" size={15} stroke={2.1} />
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}

function Avatar({
  initials,
  color,
  size = 28,
}: {
  initials: string
  color: string
  size?: number
}) {
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: '50%',
        background: color,
        color: '#fff',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: size < 26 ? 8.5 : 9.5,
        fontWeight: 650,
        letterSpacing: '-0.2px',
        flexShrink: 0,
      }}
    >
      {initials}
    </div>
  )
}

function Waveform({ dense = false }: { dense?: boolean }) {
  const bars = dense
    ? [0.35, 0.65, 0.94, 0.46, 0.78, 0.38, 0.86, 0.57, 0.98, 0.52, 0.72, 0.42, 0.91, 0.56, 0.34, 0.7]
    : [0.3, 0.62, 0.95, 0.48, 0.75, 0.38, 0.88, 0.59, 0.98, 0.53, 0.69, 0.4]

  return (
    <div className="rc-waveform" aria-label="Audio is being captured">
      {bars.map((height, index) => (
        <span
          key={`${height}-${index}`}
          className="rc-wave-bar"
          style={{
            height: `${height * 100}%`,
            animationDelay: `${index * 90}ms`,
          }}
        />
      ))}
    </div>
  )
}

function HeroProduct() {
  const tilt = useTilt()

  return (
    <div className="rc-hero-product-wrap">
      <div className="rc-orbit rc-orbit-left">
        <div className="rc-orbit-particle rc-orbit-particle-one" />
      </div>
      <div className="rc-orbit rc-orbit-right">
        <div className="rc-orbit-particle rc-orbit-particle-two" />
      </div>

      <div className="rc-float-card rc-float-card-recording">
        <div className="rc-float-icon rc-float-icon-live">
          <span className="rc-live-dot" />
        </div>
        <div>
          <p>Recording in progress</p>
          <span>3 speakers detected</span>
        </div>
      </div>

      <div className="rc-float-card rc-float-card-decision">
        <div className="rc-float-icon rc-float-icon-decision">
          <Icon name="split" size={13} stroke={2.1} />
        </div>
        <div>
          <p>Decision captured</p>
          <span>Just now</span>
        </div>
      </div>

      <div
        ref={tilt.ref}
        onMouseMove={tilt.onMove}
        onMouseLeave={tilt.onLeave}
        className="rc-hero-product"
      >
        <div className="rc-product-shine" />
        <div className="rc-product-topbar">
          <div className="rc-window-controls">
            <span />
            <span />
            <span />
          </div>
          <div className="rc-product-title-pill">
            <span className="rc-product-title-status" />
            Q4 Product Strategy
          </div>
          <div className="rc-product-topbar-avatar">
            <Avatar initials="SC" color="#B45309" size={23} />
          </div>
        </div>

        <div className="rc-product-app">
          <aside className="rc-product-sidebar">
            <div className="rc-sidebar-brand">
              <div className="rc-sidebar-brand-mark">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden>
                  <circle cx="12" cy="12" r="6" stroke="currentColor" strokeWidth="1.8" />
                  <circle cx="12" cy="12" r="2" fill="currentColor" />
                </svg>
              </div>
            </div>

            <div className="rc-sidebar-stack">
              <div className="rc-sidebar-item rc-sidebar-item-active">
                <Icon name="calendar" size={14} stroke={1.9} />
                <span>Meetings</span>
              </div>
              <div className="rc-sidebar-item">
                <Icon name="check" size={14} stroke={1.9} />
                <span>Actions</span>
              </div>
              <div className="rc-sidebar-item">
                <Icon name="search" size={14} stroke={1.9} />
                <span>Search</span>
              </div>
            </div>

            <div className="rc-sidebar-bottom">
              <div className="rc-sidebar-mini-avatar">SC</div>
            </div>
          </aside>

          <section className="rc-product-main">
            <div className="rc-product-main-header">
              <div>
                <div className="rc-eyebrow">Meeting</div>
                <h3>Q4 Product Strategy</h3>
                <p>Today · 48 min · 4 participants</p>
              </div>
              <div className="rc-live-status">
                <span className="rc-live-dot" />
                Live
              </div>
            </div>

            <div className="rc-capture-strip">
              <div className="rc-capture-strip-label">
                <Waveform />
                <span>Capturing conversation</span>
              </div>
              <span className="rc-capture-time">32:41</span>
            </div>

            <div className="rc-product-transcript">
              {meeting.transcript.slice(0, 3).map((segment, index) => {
                const speaker = meeting.participants.find(item => item.name === segment.speaker)!

                return (
                  <div key={segment.time} className="rc-product-segment">
                    <Avatar initials={speaker.initials} color={speaker.color} size={24} />
                    <div>
                      <div className="rc-product-segment-meta">
                        <strong>{segment.speaker}</strong>
                        <span>{segment.time}</span>
                      </div>
                      <p>{segment.text}</p>
                    </div>
                    {index === 2 && <span className="rc-typing-cursor" />}
                  </div>
                )
              })}
            </div>
          </section>

          <aside className="rc-product-ai">
            <div className="rc-product-ai-title">
              <div className="rc-ai-mark">
                <Icon name="spark" size={12} stroke={2.15} />
              </div>
              <span>Recall is listening</span>
            </div>

            <div className="rc-product-insight-card rc-product-insight-card-new">
              <div className="rc-insight-card-head">
                <span className="rc-insight-type rc-insight-type-action">
                  <Icon name="check" size={10} stroke={2.2} />
                  Action
                </span>
                <span>now</span>
              </div>
              <p>Priya to simplify onboarding flow</p>
              <small>Owner: Priya · Due Friday</small>
            </div>

            <div className="rc-product-insight-card">
              <div className="rc-insight-card-head">
                <span className="rc-insight-type rc-insight-type-decision">
                  <Icon name="split" size={10} stroke={2.2} />
                  Decision
                </span>
                <span>12s ago</span>
              </div>
              <p>Ship the redesign without an A/B test</p>
            </div>

            <div className="rc-product-topic-row">
              <span>Topics found</span>
              <div>
                <i>Onboarding</i>
                <i>Activation</i>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}

function Hero() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const timeout = window.setTimeout(() => setMounted(true), 80)
    return () => window.clearTimeout(timeout)
  }, [])

  const appear = (delay: number) => ({
    opacity: mounted ? 1 : 0,
    transform: mounted ? 'translate3d(0,0,0)' : 'translate3d(0,18px,0)',
    transition: `opacity 900ms cubic-bezier(.16,1,.3,1) ${delay}ms, transform 900ms cubic-bezier(.16,1,.3,1) ${delay}ms`,
  })

  return (
    <section className="rc-hero">
      <div className="rc-section-shell rc-hero-shell">
        <div className="rc-hero-copy">
          <div className="rc-hero-kicker" style={appear(0)}>
            <span className="rc-kicker-spark">
              <Icon name="spark" size={12} stroke={2.1} />
            </span>
            Meeting intelligence, quietly working
          </div>

          <h1 style={appear(90)}>
            Your meetings shouldn&apos;t
            <br />
            <em>disappear</em> when the call ends.
          </h1>

          <p className="rc-hero-description" style={appear(170)}>
            Recall turns conversations into a dependable memory layer — with transcripts, decisions, action items and answers your team can return to whenever work needs context.
          </p>

          <div className="rc-hero-actions" style={appear(250)}>
            <Link href="/login" className="rc-button rc-button-dark">
              Start using Recall
              <Icon name="arrow" size={15} stroke={2.2} />
            </Link>
            <a href="#product" className="rc-button rc-button-glass">
              Explore the product
              <span className="rc-button-play">
                <Icon name="play" size={11} stroke={2.2} />
              </span>
            </a>
          </div>

          <div className="rc-hero-note" style={appear(330)}>
            <span className="rc-note-line" />
            Designed for the conversations your work depends on
          </div>
        </div>

        <div style={appear(290)} className="rc-hero-product-entry">
          <HeroProduct />
        </div>
      </div>
    </section>
  )
}

function TrustStrip() {
  const roles = ['Product teams', 'Engineering leaders', 'Founders', 'Researchers', 'Consultants']

  return (
    <section className="rc-trust-strip">
      <Reveal>
        <div className="rc-section-shell rc-trust-inner">
          <p>For people who cannot afford to forget what happened in the room.</p>
          <div className="rc-trust-roles">
            {roles.map(role => (
              <span key={role}>
                <i />
                {role}
              </span>
            ))}
          </div>
        </div>
      </Reveal>
    </section>
  )
}

function InformationLeakVisual() {
  return (
    <div className="rc-leak-visual">
      <div className="rc-leak-lines">
        <span />
        <span />
        <span />
        <span />
        <span />
        <span />
        <span />
        <span />
      </div>
      <div className="rc-leak-meeting-card rc-leak-meeting-card-main">
        <div className="rc-leak-card-head">
          <span className="rc-leak-card-dot" />
          <span>Weekly strategy</span>
        </div>
        <div className="rc-leak-card-line" />
        <div className="rc-leak-card-line rc-leak-card-line-short" />
        <div className="rc-leak-card-line rc-leak-card-line-medium" />
      </div>
      <div className="rc-leak-meeting-card rc-leak-meeting-card-small">
        <div className="rc-leak-card-head">
          <span className="rc-leak-card-dot rc-leak-card-dot-purple" />
          <span>Customer research</span>
        </div>
        <div className="rc-leak-card-line" />
        <div className="rc-leak-card-line rc-leak-card-line-short" />
      </div>
      <div className="rc-leak-fading-note rc-leak-fading-note-one">Launch moved to October</div>
      <div className="rc-leak-fading-note rc-leak-fading-note-two">Daniel owns QA review</div>
      <div className="rc-leak-fading-note rc-leak-fading-note-three">Revisit pricing next week</div>
      <div className="rc-leak-pulse">
        <span />
        <span />
        <span />
      </div>
    </div>
  )
}

function Problem() {
  const stages = [
    ['01', 'Meeting', 'The room fills up.'],
    ['02', 'Conversation', 'The important part moves fast.'],
    ['03', 'Decisions', 'Direction gets set.'],
    ['04', 'Tasks', 'Work gets assigned.'],
    ['05', 'Silence', 'Details begin to disappear.'],
  ]

  return (
    <section id="story" className="rc-section rc-problem-section">
      <div className="rc-section-shell">
        <div className="rc-problem-grid">
          <Reveal>
            <div className="rc-problem-copy">
              <div className="rc-section-label">The problem</div>
              <h2>
                Meetings create information.
                <br />
                <span>Humans forget it.</span>
              </h2>
              <p>
                Most teams leave a meeting with a recording, an incomplete note, and a different version of what happened in every person&apos;s head.
              </p>
              <p>
                Recall turns the temporary conversation into a durable part of how your team remembers.
              </p>
              <a href="#how-it-works" className="rc-text-link">
                See the workflow
                <Icon name="arrow" size={15} stroke={2.2} />
              </a>
            </div>
          </Reveal>

          <Reveal delay={120}>
            <InformationLeakVisual />
          </Reveal>
        </div>

        <Reveal delay={180}>
          <div className="rc-problem-stages">
            {stages.map(([number, title, text], index) => (
              <div
                key={number}
                className={`rc-stage ${index === stages.length - 1 ? 'rc-stage-fade' : ''}`}
              >
                <span>{number}</span>
                <h3>{title}</h3>
                <p>{text}</p>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  )
}

function TranscriptView() {
  return (
    <div className="rc-meeting-panel rc-meeting-transcript">
      {meeting.transcript.map(segment => {
        const speaker = meeting.participants.find(item => item.name === segment.speaker)!

        return (
          <div key={segment.time} className="rc-full-segment">
            <Avatar initials={speaker.initials} color={speaker.color} size={30} />
            <div>
              <div className="rc-full-segment-meta">
                <strong>{segment.speaker}</strong>
                <span>{segment.time}</span>
              </div>
              <p>{segment.text}</p>
            </div>
          </div>
        )
      })}
    </div>
  )
}

function SummaryView() {
  return (
    <div className="rc-meeting-panel rc-summary-view">
      <div className="rc-summary-featured">
        <div className="rc-summary-featured-title">
          <span>
            <Icon name="spark" size={14} stroke={2.2} />
          </span>
          Overview
        </div>
        <p>{meeting.summary}</p>
      </div>

      <div className="rc-summary-stat-grid">
        <div>
          <span>Participants</span>
          <strong>4</strong>
          <small>across product and engineering</small>
        </div>
        <div>
          <span>Decisions</span>
          <strong>3</strong>
          <small>stored with their context</small>
        </div>
        <div>
          <span>Action items</span>
          <strong>3</strong>
          <small>assigned before the call ended</small>
        </div>
      </div>

      <div className="rc-summary-thread">
        <span>Conversation arc</span>
        <div>
          <i>Onboarding</i>
          <b />
          <i>Activation</i>
          <b />
          <i>API readiness</i>
        </div>
      </div>
    </div>
  )
}

function DecisionsView() {
  return (
    <div className="rc-meeting-panel rc-decision-view">
      {meeting.decisions.map((decision, index) => (
        <article key={decision} className="rc-decision-item">
          <div className="rc-decision-index">0{index + 1}</div>
          <div className="rc-decision-icon">
            <Icon name="split" size={15} stroke={2.1} />
          </div>
          <div>
            <p>{decision}</p>
            <span>Captured from Q4 Product Strategy · Today</span>
          </div>
        </article>
      ))}
    </div>
  )
}

function MeetingActionsView() {
  const [done, setDone] = useState<Record<number, boolean>>({})

  return (
    <div className="rc-meeting-panel rc-actions-view">
      {meeting.actions.map((action, index) => (
        <article key={action.title} className={`rc-action-item ${done[index] ? 'rc-action-complete' : ''}`}>
          <button
            type="button"
            aria-label={done[index] ? `Mark ${action.title} incomplete` : `Mark ${action.title} complete`}
            aria-pressed={!!done[index]}
            onClick={() => setDone(current => ({ ...current, [index]: !current[index] }))}
            className="rc-action-check"
          >
            {done[index] && <Icon name="check" size={13} stroke={2.3} />}
          </button>
          <div className="rc-action-copy">
            <p>{action.title}</p>
            <div>
              <span className="rc-action-owner">
                <i style={{ background: action.color }} />
                {action.owner}
              </span>
              <span className="rc-action-divider" />
              <span className="rc-action-due">
                <Icon name="clock" size={11} stroke={2.1} />
                Due {action.due}
              </span>
            </div>
          </div>
          <button type="button" className="rc-action-menu" aria-label={`More options for ${action.title}`}>
            <span />
            <span />
            <span />
          </button>
        </article>
      ))}
    </div>
  )
}

function ProductShowcase() {
  const [tab, setTab] = useState<Tab>('summary')

  const tabs: { id: Tab; label: string; icon: IconName }[] = [
    { id: 'transcript', label: 'Transcript', icon: 'file' },
    { id: 'summary', label: 'Summary', icon: 'spark' },
    { id: 'decisions', label: 'Decisions', icon: 'split' },
    { id: 'actions', label: 'Action items', icon: 'check' },
  ]

  const panel = {
    transcript: <TranscriptView />,
    summary: <SummaryView />,
    decisions: <DecisionsView />,
    actions: <MeetingActionsView />,
  }[tab]

  return (
    <section id="product" className="rc-section rc-product-section">
      <div className="rc-section-shell">
        <Reveal>
          <div className="rc-section-heading rc-product-heading">
            <div>
              <div className="rc-section-label">Inside Recall</div>
              <h2>
                One conversation.
                <br />
                <span>Every useful way to revisit it.</span>
              </h2>
            </div>
            <p>
              Recall does not ask you to read a transcript just to find one decision. It restructures every meeting around how people actually look for context later.
            </p>
          </div>
        </Reveal>

        <Reveal delay={100}>
          <div className="rc-meeting-window">
            <div className="rc-meeting-window-top">
              <div className="rc-window-controls rc-window-controls-muted">
                <span />
                <span />
                <span />
              </div>

              <div className="rc-meeting-window-title">
                <div className="rc-meeting-window-icon">
                  <Icon name="mic" size={15} stroke={2.1} />
                </div>
                <div>
                  <strong>{meeting.title}</strong>
                  <span>{meeting.date} · {meeting.duration} · 4 participants</span>
                </div>
              </div>

              <button type="button" className="rc-share-button">
                <span className="rc-share-symbol">↗</span>
                Share
              </button>
            </div>

            <div className="rc-meeting-window-nav" role="tablist" aria-label="Meeting data">
              {tabs.map(item => (
                <button
                  key={item.id}
                  type="button"
                  role="tab"
                  aria-selected={tab === item.id}
                  onClick={() => setTab(item.id)}
                  className={`rc-meeting-tab ${tab === item.id ? 'rc-meeting-tab-active' : ''}`}
                >
                  <Icon name={item.icon} size={13} stroke={2} />
                  {item.label}
                </button>
              ))}
            </div>

            <div className="rc-meeting-window-content">
              <section className="rc-meeting-main-content" key={tab}>
                {panel}
              </section>

              <aside className="rc-meeting-sidebar">
                <div className="rc-side-section">
                  <span className="rc-side-title">Participants</span>
                  <div className="rc-participant-list">
                    {meeting.participants.map(person => (
                      <div key={person.name}>
                        <Avatar initials={person.initials} color={person.color} size={24} />
                        <span>{person.name}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="rc-side-section">
                  <span className="rc-side-title">Topics</span>
                  <div className="rc-topic-list">
                    {meeting.topics.map(topic => (
                      <span key={topic}>
                        <Icon name="hash" size={10} stroke={2.3} />
                        {topic}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="rc-side-section rc-side-source">
                  <span className="rc-side-title">Source</span>
                  <p>
                    <Icon name="wave" size={13} stroke={2} />
                    Original audio and speaker transcript linked to this record.
                  </p>
                </div>
              </aside>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

function HowItWorks() {
  const steps = [
    {
      number: '01',
      icon: 'mic' as IconName,
      title: 'Capture',
      text: 'Recall records the conversation from the places you already meet.',
    },
    {
      number: '02',
      icon: 'spark' as IconName,
      title: 'Understand',
      text: 'The raw conversation becomes a structured record of what mattered.',
    },
    {
      number: '03',
      icon: 'search' as IconName,
      title: 'Remember',
      text: 'Search the transcript or ask a direct question when context is needed.',
    },
    {
      number: '04',
      icon: 'check' as IconName,
      title: 'Act',
      text: 'Decisions and next steps remain visible after the energy of the call is gone.',
    },
  ]

  return (
    <section id="how-it-works" className="rc-section rc-how-section">
      <div className="rc-section-shell">
        <Reveal>
          <div className="rc-how-intro">
            <div className="rc-section-label">How it works</div>
            <h2>
              From live conversation
              <br />
              <span>to useful memory.</span>
            </h2>
          </div>
        </Reveal>

        <div className="rc-how-path">
          <div className="rc-how-path-line" />
          {steps.map((step, index) => (
            <Reveal key={step.number} delay={index * 80}>
              <article className="rc-how-step">
                <div className="rc-how-step-top">
                  <span>{step.number}</span>
                  <div className="rc-how-step-icon">
                    <Icon name={step.icon} size={17} stroke={1.95} />
                  </div>
                </div>
                <h3>{step.title}</h3>
                <p>{step.text}</p>
              </article>
            </Reveal>
          ))}
        </div>

        <Reveal delay={280}>
          <div className="rc-how-bottom-note">
            <div className="rc-how-bottom-signature">
              <span />
              <span />
              <span />
              <span />
            </div>
            <p>Less time reconstructing what happened. More time moving the work forward.</p>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

function FeatureSignalVisual() {
  return (
    <div className="rc-feature-signal">
      <span className="rc-feature-signal-label">live understanding</span>
      <div className="rc-feature-signal-graph">
        {[15, 25, 47, 32, 70, 41, 85, 52, 36, 67, 44, 82, 58, 39, 62].map((height, index) => (
          <i key={`${height}-${index}`} style={{ height: `${height}%`, animationDelay: `${index * 90}ms` }} />
        ))}
      </div>
      <div className="rc-feature-signal-caption">
        <span>Decision detected</span>
        <b>02:37</b>
      </div>
    </div>
  )
}

function FeatureSearchVisual() {
  return (
    <div className="rc-feature-search">
      <div>
        <Icon name="search" size={14} stroke={2} />
        <span>launch timeline</span>
        <kbd>⌘ K</kbd>
      </div>
      <p>
        Q4 Product Strategy
        <small>…launch moved to October 14 with QA completing the week before…</small>
      </p>
      <p>
        Launch Readiness Sync
        <small>…Sarah will finalize the release checklist by October 7…</small>
      </p>
    </div>
  )
}

function FeatureCalendarVisual() {
  return (
    <div className="rc-feature-calendar">
      <div className="rc-feature-calendar-days">
        <span>Mon</span>
        <span>Tue</span>
        <span className="rc-day-active">Wed</span>
        <span>Thu</span>
        <span>Fri</span>
      </div>
      <div className="rc-feature-calendar-events">
        <i style={{ left: '4%', width: '58%', top: '18%' }}>Product strategy</i>
        <i style={{ left: '30%', width: '54%', top: '52%' }}>Research review</i>
        <i style={{ left: '52%', width: '36%', top: '76%' }}>Weekly review</i>
      </div>
    </div>
  )
}

function Features() {
  return (
    <section id="features" className="rc-section rc-features-section">
      <div className="rc-section-shell">
        <Reveal>
          <div className="rc-section-heading rc-features-heading">
            <div>
              <div className="rc-section-label">Capabilities</div>
              <h2>
                Quiet infrastructure
                <br />
                <span>for team memory.</span>
              </h2>
            </div>
            <p>
              A focused set of tools for turning the conversations around your work into something durable, searchable and ready to use.
            </p>
          </div>
        </Reveal>

        <div className="rc-feature-bento">
          <Reveal delay={30} className="rc-bento-cell rc-bento-wide">
            <article className="rc-feature-card rc-feature-card-signal">
              <div className="rc-feature-card-copy">
                <div className="rc-feature-icon">
                  <Icon name="spark" size={17} stroke={2} />
                </div>
                <h3>Understanding as the meeting happens</h3>
                <p>Recall identifies useful signals while the conversation is still moving.</p>
              </div>
              <FeatureSignalVisual />
            </article>
          </Reveal>

          <Reveal delay={90} className="rc-bento-cell">
            <article className="rc-feature-card">
              <div className="rc-feature-icon">
                <Icon name="file" size={17} stroke={2} />
              </div>
              <h3>Speaker transcripts</h3>
              <p>Readable, attributed conversation records without losing the original context.</p>
            </article>
          </Reveal>

          <Reveal delay={150} className="rc-bento-cell">
            <article className="rc-feature-card">
              <div className="rc-feature-icon rc-feature-icon-warm">
                <Icon name="check" size={17} stroke={2} />
              </div>
              <h3>Action items</h3>
              <p>Tasks, owners and timing extracted from the words already spoken.</p>
            </article>
          </Reveal>

          <Reveal delay={60} className="rc-bento-cell">
            <article className="rc-feature-card">
              <div className="rc-feature-icon rc-feature-icon-green">
                <Icon name="split" size={17} stroke={2} />
              </div>
              <h3>Decision history</h3>
              <p>Keep the why beside the decision, not buried in a six-week-old recording.</p>
            </article>
          </Reveal>

          <Reveal delay={120} className="rc-bento-cell rc-bento-wide">
            <article className="rc-feature-card rc-feature-card-search">
              <div className="rc-feature-card-copy">
                <div className="rc-feature-icon rc-feature-icon-blue">
                  <Icon name="search" size={17} stroke={2} />
                </div>
                <h3>Find the exact moment</h3>
                <p>Search across transcripts, summaries and decisions without having to remember which meeting held the answer.</p>
              </div>
              <FeatureSearchVisual />
            </article>
          </Reveal>

          <Reveal delay={180} className="rc-bento-cell">
            <article className="rc-feature-card">
              <div className="rc-feature-icon rc-feature-icon-purple">
                <Icon name="message" size={17} stroke={2} />
              </div>
              <h3>Ask Recall</h3>
              <p>Ask directly and inspect the source meetings behind the answer.</p>
            </article>
          </Reveal>

          <Reveal delay={80} className="rc-bento-cell rc-bento-wide">
            <article className="rc-feature-card rc-feature-card-calendar">
              <div className="rc-feature-card-copy">
                <div className="rc-feature-icon">
                  <Icon name="calendar" size={17} stroke={2} />
                </div>
                <h3>Fits around your day</h3>
                <p>Connect Google Calendar and turn the scheduled conversations you already have into an organized meeting history.</p>
              </div>
              <FeatureCalendarVisual />
            </article>
          </Reveal>

          {featureData.slice(9).map((feature, index) => (
            <Reveal key={feature.title} delay={index * 60 + 100} className="rc-bento-cell">
              <article className="rc-feature-card rc-feature-card-small">
                <div className="rc-feature-icon">
                  <Icon name={feature.icon} size={17} stroke={2} />
                </div>
                <h3>{feature.title}</h3>
                <p>{feature.text}</p>
              </article>
            </Reveal>
          ))}
        </div>

        <Reveal delay={200}>
          <div className="rc-feature-footer">
            <span>
              <Icon name="hash" size={14} stroke={2.1} />
              Every captured meeting becomes part of one searchable history.
            </span>
            <Link href="/login" className="rc-text-link">
              Start building yours
              <Icon name="arrow" size={15} stroke={2.2} />
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

const askAnswers = {
  'What did we decide about the launch timeline?': {
    answer:
      'The team agreed to move the public launch to October 14. Sarah will finalize the release checklist by October 7, while Daniel will coordinate the final QA pass before the public date.',
    sources: [
      ['Q4 Product Strategy', 'Nov 13'],
      ['Launch Readiness Sync', 'Nov 6'],
    ],
  },
  'What work is assigned to Priya?': {
    answer:
      'Priya owns the onboarding redesign with a deferred invitation step, the customer research synthesis from last week, and a review of the pricing page language before the next product review.',
    sources: [
      ['Q4 Product Strategy', 'Nov 13'],
      ['Design Weekly', 'Nov 8'],
    ],
  },
  'Summarize our latest product conversations.': {
    answer:
      'Recent product meetings centered on onboarding conversion, launch readiness and API planning. The onboarding redesign is moving first, while the public API remains dependent on a rate limiting proposal.',
    sources: [
      ['Q4 Product Strategy', 'Nov 13'],
      ['API Planning', 'Nov 8'],
      ['Launch Readiness Sync', 'Nov 6'],
    ],
  },
}

function AskRecall() {
  const suggestions = Object.keys(askAnswers)
  const [question, setQuestion] = useState(suggestions[0])
  const [activeQuestion, setActiveQuestion] = useState(suggestions[0])
  const [state, setState] = useState<'ready' | 'thinking' | 'done'>('done')
  const timeout = useRef<number | null>(null)

  useEffect(() => {
    return () => {
      if (timeout.current) window.clearTimeout(timeout.current)
    }
  }, [])

  const ask = useCallback(
    (value: string) => {
      const selected = suggestions.includes(value) ? value : suggestions[0]
      setQuestion(selected)
      setActiveQuestion(selected)
      setState('thinking')

      if (timeout.current) window.clearTimeout(timeout.current)

      timeout.current = window.setTimeout(() => {
        setState('done')
      }, 680)
    },
    [suggestions]
  )

  const current = askAnswers[activeQuestion as keyof typeof askAnswers]

  return (
    <section className="rc-section rc-ask-section">
      <div className="rc-section-shell">
        <div className="rc-ask-layout">
          <Reveal>
            <div className="rc-ask-copy">
              <div className="rc-section-label">Ask Recall</div>
              <h2>
                Your team has already
                <br />
                <span>said the answer somewhere.</span>
              </h2>
              <p>
                Ask a direct question instead of reconstructing a decision from fragments across old calls, messages and people&apos;s memory.
              </p>

              <div className="rc-ask-principles">
                <div>
                  <span className="rc-principle-number">01</span>
                  Natural-language questions
                </div>
                <div>
                  <span className="rc-principle-number">02</span>
                  Grounded in real conversations
                </div>
                <div>
                  <span className="rc-principle-number">03</span>
                  Sources shown with every answer
                </div>
              </div>
            </div>
          </Reveal>

          <Reveal delay={120}>
            <div className="rc-ask-window">
              <div className="rc-ask-window-header">
                <div className="rc-ask-window-brand">
                  <div className="rc-ask-window-brand-icon">
                    <Icon name="spark" size={13} stroke={2.2} />
                  </div>
                  <div>
                    <strong>Ask Recall</strong>
                    <span>Across your meeting history</span>
                  </div>
                </div>
                <div className="rc-ask-online">
                  <span />
                  Ready
                </div>
              </div>

              <div className="rc-ask-content">
                <div className="rc-suggested-label">Try a question</div>
                <div className="rc-suggestion-list">
                  {suggestions.map(suggestion => (
                    <button
                      type="button"
                      key={suggestion}
                      onClick={() => ask(suggestion)}
                      className={`rc-suggestion ${activeQuestion === suggestion ? 'rc-suggestion-active' : ''}`}
                    >
                      {suggestion}
                      <Icon name="arrow" size={13} stroke={2.1} />
                    </button>
                  ))}
                </div>

                <div className="rc-question-bubble">{activeQuestion}</div>

                {state === 'thinking' ? (
                  <div className="rc-thinking">
                    <span />
                    <span />
                    <span />
                    <small>Reviewing meeting history</small>
                  </div>
                ) : (
                  <div className="rc-answer-block">
                    <div className="rc-answer-mark">
                      <Icon name="spark" size={12} stroke={2.2} />
                    </div>
                    <p>{current.answer}</p>
                    <div className="rc-answer-sources">
                      <span>Sources</span>
                      <div>
                        {current.sources.map(([title, date]) => (
                          <button type="button" key={title} className="rc-source-chip">
                            <Icon name="file" size={10} stroke={2.1} />
                            {title}
                            <i />
                            {date}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <form
                className="rc-ask-input-row"
                onSubmit={event => {
                  event.preventDefault()
                  ask(question)
                }}
              >
                <Icon name="message" size={15} stroke={1.9} />
                <input
                  value={question}
                  onChange={event => setQuestion(event.target.value)}
                  aria-label="Ask Recall a question"
                  placeholder="Ask about your meetings..."
                />
                <button type="submit" aria-label="Submit question">
                  <Icon name="arrow" size={15} stroke={2.2} />
                </button>
              </form>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}

function CalendarWorkflow() {
  const events = [
    {
      time: '09:00',
      title: 'Product Strategy',
      duration: '45 min',
      color: '#C97820',
      note: 'Summary and action items ready',
      captured: true,
    },
    {
      time: '11:30',
      title: 'Engineering Sync',
      duration: '30 min',
      color: '#0F766E',
      note: 'Transcript available',
      captured: true,
    },
    {
      time: '14:00',
      title: 'Customer Research',
      duration: '60 min',
      color: '#7C3AED',
      note: 'Recording processed',
      captured: true,
    },
    {
      time: '16:00',
      title: 'Weekly Review',
      duration: '45 min',
      color: '#BE185D',
      note: 'Recall will be ready',
      captured: false,
    },
  ]

  const [selected, setSelected] = useState(0)
  const current = events[selected]

  return (
    <section className="rc-section rc-workflow-section">
      <div className="rc-section-shell">
        <div className="rc-workflow-layout">
          <Reveal>
            <div className="rc-workflow-calendar liquid-card">
              <div className="rc-calendar-head">
                <div>
                  <span>Connected calendar</span>
                  <strong>Wednesday, November 13</strong>
                </div>
                <div className="rc-calendar-connected">
                  <span />
                  Synced
                </div>
              </div>

              <div className="rc-calendar-list">
                {events.map((event, index) => (
                  <button
                    type="button"
                    key={event.title}
                    onClick={() => setSelected(index)}
                    className={`rc-calendar-event ${selected === index ? 'rc-calendar-event-active' : ''}`}
                  >
                    <time>{event.time}</time>
                    <span className="rc-calendar-event-bar" style={{ background: event.color }} />
                    <span className="rc-calendar-event-copy">
                      <strong>{event.title}</strong>
                      <small>{event.duration}</small>
                    </span>
                    <span className={`rc-calendar-event-state ${event.captured ? 'rc-state-ready' : ''}`}>
                      {event.captured ? 'Captured' : 'Upcoming'}
                    </span>
                  </button>
                ))}
              </div>

              <div className="rc-calendar-preview">
                <div className="rc-calendar-preview-title">
                  <span style={{ background: current.color }} />
                  <div>
                    <strong>{current.title}</strong>
                    <small>{current.note}</small>
                  </div>
                </div>
                <div className="rc-calendar-preview-tags">
                  {current.captured ? (
                    <>
                      <i>Transcript</i>
                      <i>Summary</i>
                      <i>Actions</i>
                    </>
                  ) : (
                    <i>Ready to capture</i>
                  )}
                </div>
              </div>
            </div>
          </Reveal>

          <Reveal delay={120}>
            <div className="rc-workflow-copy">
              <div className="rc-section-label">Your workflow, uninterrupted</div>
              <h2>
                A memory layer around
                <br />
                <span>the workday you already have.</span>
              </h2>
              <p>
                Recall does not ask your team to create more meetings, fill out more templates or maintain another project space. It sits around your existing conversations and preserves what they produce.
              </p>

              <div className="rc-workflow-callout">
                <div className="rc-workflow-callout-icon">
                  <Icon name="calendar" size={17} stroke={2} />
                </div>
                <p>
                  Connect Google Calendar and upcoming meetings are already waiting in the right place.
                </p>
              </div>

              <Link href="/login" className="rc-button rc-button-glass">
                Connect your calendar
                <Icon name="arrow" size={15} stroke={2.2} />
              </Link>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}

function ActionsSection() {
  const tasks = [
    {
      title: 'Finalize onboarding flow',
      owner: 'Sarah',
      initials: 'SC',
      color: '#B45309',
      due: 'Friday',
      source: 'Product Strategy',
    },
    {
      title: 'Review API architecture',
      owner: 'Daniel',
      initials: 'DO',
      color: '#0F766E',
      due: 'Monday',
      source: 'Engineering Sync',
    },
    {
      title: 'Send customer research notes',
      owner: 'Priya',
      initials: 'PM',
      color: '#7C3AED',
      due: 'Tuesday',
      source: 'Research Review',
    },
  ]

  const [completed, setCompleted] = useState<Record<number, boolean>>({})

  return (
    <section className="rc-section rc-actions-section">
      <div className="rc-section-shell">
        <Reveal>
          <div className="rc-section-heading rc-actions-heading">
            <div>
              <div className="rc-section-label">From conversation to work</div>
              <h2>
                The things people said they&apos;d do
                <br />
                <span>should not be the first things forgotten.</span>
              </h2>
            </div>
            <p>
              Recall pulls commitments out of the meeting and leaves them where they can be seen, assigned and completed.
            </p>
          </div>
        </Reveal>

        <Reveal delay={120}>
          <div className="rc-task-board liquid-card">
            <div className="rc-task-board-head">
              <div>
                <span className="rc-task-board-eyebrow">Meeting actions</span>
                <h3>Open from your recent conversations</h3>
              </div>
              <div className="rc-task-count">
                <strong>{tasks.length - Object.values(completed).filter(Boolean).length}</strong>
                remaining
              </div>
            </div>

            <div className="rc-task-list">
              {tasks.map((task, index) => (
                <article
                  key={task.title}
                  className={`rc-board-task ${completed[index] ? 'rc-board-task-complete' : ''}`}
                >
                  <button
                    type="button"
                    aria-label={completed[index] ? `Mark ${task.title} incomplete` : `Mark ${task.title} complete`}
                    aria-pressed={!!completed[index]}
                    className="rc-board-task-check"
                    onClick={() => setCompleted(current => ({ ...current, [index]: !current[index] }))}
                  >
                    {completed[index] && <Icon name="check" size={13} stroke={2.4} />}
                  </button>

                  <div className="rc-board-task-copy">
                    <p>{task.title}</p>
                    <span>
                      From <b>{task.source}</b>
                    </span>
                  </div>

                  <div className="rc-board-task-owner">
                    <Avatar initials={task.initials} color={task.color} size={25} />
                    <span>{task.owner}</span>
                  </div>

                  <div className="rc-board-task-due">
                    <Icon name="clock" size={12} stroke={2.1} />
                    {task.due}
                  </div>
                </article>
              ))}
            </div>

            <div className="rc-task-board-footer">
              <span>
                <Icon name="spark" size={13} stroke={2.1} />
                Automatically extracted from the way your team already speaks.
              </span>
              <Link href="/login">
                Open Recall
                <Icon name="arrow" size={13} stroke={2.2} />
              </Link>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

function PrivacySection() {
  const points = [
    ['Private by default', 'Meeting records belong to the account that creates them.'],
    ['Authenticated access', 'Saved recordings and transcripts live behind sign-in.'],
    ['Controlled visibility', 'Access to meeting content remains tied to your workspace.'],
  ]

  return (
    <section className="rc-section rc-privacy-section">
      <div className="rc-section-shell">
        <div className="rc-privacy-panel">
          <div className="rc-privacy-light" />
          <Reveal>
            <div className="rc-privacy-copy">
              <div className="rc-section-label rc-section-label-light">Privacy and control</div>
              <h2>
                Your meetings are yours.
                <br />
                <span>That is the entire premise.</span>
              </h2>
              <p>
                Recall is built around private meeting history. Your conversations are not a public feed, and the record of your work should remain under your account&apos;s control.
              </p>
              <Link href="/privacy-policy" className="rc-text-link rc-text-link-light">
                Read our privacy policy
                <Icon name="arrow" size={15} stroke={2.2} />
              </Link>
            </div>
          </Reveal>

          <div className="rc-privacy-points">
            {points.map(([title, text], index) => (
              <Reveal key={title} delay={index * 80}>
                <div className="rc-privacy-point">
                  <div>
                    <Icon name="lock" size={15} stroke={2} />
                  </div>
                  <h3>{title}</h3>
                  <p>{text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

function Pricing() {
  return (
    <section id="pricing" className="rc-section rc-pricing-section">
      <div className="rc-section-shell">
        <Reveal>
          <div className="rc-pricing-intro">
            <div className="rc-section-label">Early access</div>
            <h2>
              Start building your
              <br />
              <span>memory layer.</span>
            </h2>
            <p>
              Recall is currently available through early access. Create an account, connect your workflow and begin turning meetings into useful context.
            </p>
          </div>
        </Reveal>

        <Reveal delay={100}>
          <div className="rc-pricing-card liquid-card">
            <div className="rc-pricing-card-main">
              <div className="rc-pricing-card-label">
                <span />
                Early access
              </div>
              <h3>Everything you need to stop losing the thread.</h3>
              <p>
                Begin with meeting capture, structured intelligence, search and Ask Recall across your own conversation history.
              </p>

              <div className="rc-pricing-included">
                {[
                  'Meeting recording and transcripts',
                  'Summaries, decisions and action items',
                  'Search across meeting history',
                  'Ask Recall and calendar connection',
                ].map(item => (
                  <span key={item}>
                    <i>
                      <Icon name="check" size={11} stroke={2.4} />
                    </i>
                    {item}
                  </span>
                ))}
              </div>
            </div>

            <div className="rc-pricing-card-cta">
              <div className="rc-pricing-orbit">
                <span />
                <span />
                <span />
              </div>
              <p>Get started with Recall today.</p>
              <Link href="/login" className="rc-button rc-button-dark">
                Create your account
                <Icon name="arrow" size={15} stroke={2.2} />
              </Link>
              <small>No fabricated tiers. No unnecessary complexity.</small>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

function FAQ() {
  const entries = [
    [
      'What is Recall?',
      'Recall is a meeting intelligence product. It records meetings, creates speaker transcripts, extracts summaries, decisions and action items, and makes your meeting history searchable.',
    ],
    [
      'How does meeting recording work?',
      'Recall can capture meetings directly and can work around calendar-connected meetings. Once a conversation is captured, the transcript and structured meeting record are processed automatically.',
    ],
    [
      'Can Recall summarize meetings?',
      'Yes. Recall creates concise summaries that explain what happened, what decisions were made and what the team needs to remember after the meeting.',
    ],
    [
      'Can I search across all meetings?',
      'Yes. Recall makes transcripts and meeting records searchable so you can find discussion, decisions and key moments without replaying calls.',
    ],
    [
      'What is Ask Recall?',
      'Ask Recall is a natural-language way to explore your meeting history. It answers questions based on your meeting records and presents the source conversations behind the answer.',
    ],
    [
      'Does Recall work with Google Calendar?',
      'Recall supports Google Calendar connection so upcoming meetings can be visible and ready within your existing schedule.',
    ],
    [
      'How is meeting data handled?',
      'Meeting data is connected to authenticated account access. Recordings and records are intended to remain within the workspace and account controls around them.',
    ],
  ]

  const [active, setActive] = useState<number | null>(0)

  return (
    <section id="faq" className="rc-section rc-faq-section">
      <div className="rc-section-shell rc-faq-shell">
        <Reveal>
          <div className="rc-faq-intro">
            <div className="rc-section-label">Questions</div>
            <h2>Frequently asked.</h2>
            <p>A few useful things to know before you begin.</p>
          </div>
        </Reveal>

        <Reveal delay={100}>
          <div className="rc-faq-list liquid-card">
            {entries.map(([question, answer], index) => {
              const expanded = active === index

              return (
                <article key={question} className={`rc-faq-item ${expanded ? 'rc-faq-item-open' : ''}`}>
                  <button
                    type="button"
                    aria-expanded={expanded}
                    onClick={() => setActive(current => (current === index ? null : index))}
                  >
                    <span>{question}</span>
                    <i>
                      <Icon name={expanded ? 'minus' : 'plus'} size={14} stroke={2.1} />
                    </i>
                  </button>
                  <div className="rc-faq-answer">
                    <p>{answer}</p>
                  </div>
                </article>
              )
            })}
          </div>
        </Reveal>
      </div>
    </section>
  )
}

function FinalCTA() {
  return (
    <section className="rc-final-section">
      <div className="rc-final-aura rc-final-aura-one" />
      <div className="rc-final-aura rc-final-aura-two" />
      <div className="rc-section-shell rc-final-shell">
        <Reveal>
          <div className="rc-final-kicker">
            <span />
            Your next meeting can remember itself
          </div>
          <h2>
            Stop taking notes.
            <br />
            <em>Start remembering.</em>
          </h2>
          <p>
            Turn every conversation into something your team can find, understand and act on.
          </p>
          <div className="rc-final-actions">
            <Link href="/login" className="rc-button rc-button-light">
              Get started
              <Icon name="arrow" size={15} stroke={2.2} />
            </Link>
            <a href="#product" className="rc-button rc-button-dark-glass">
              Explore Recall
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

function Footer() {
  return (
    <footer className="rc-footer">
      <div className="rc-section-shell">
        <div className="rc-footer-top">
          <div className="rc-footer-brand">
            <Logo light />
            <p>Meeting intelligence for work that needs a memory.</p>
          </div>

          <div className="rc-footer-columns">
            <div>
              <span>Product</span>
              <a href="#features">Features</a>
              <a href="#how-it-works">How it works</a>
              <a href="#pricing">Early access</a>
            </div>
            <div>
              <span>Resources</span>
              <a href="#faq">FAQ</a>
              <Link href="/privacy-policy">Privacy</Link>
              <Link href="/terms">Terms</Link>
            </div>
            <div>
              <span>Access</span>
              <Link href="/login">Sign in</Link>
              <Link href="/login">Get started</Link>
              <Link href="/dashboard">Dashboard</Link>
            </div>
          </div>
        </div>

        <div className="rc-footer-bottom">
          <span>© {new Date().getFullYear()} Recall</span>
          <span>Built for conversations worth keeping.</span>
        </div>
      </div>
    </footer>
  )
}

const CSS = `
  :root {
    --rc-scroll: 0px;
    --rc-progress: 0;
    --rc-ink: #11110f;
    --rc-muted: #696762;
    --rc-faint: #a8a59f;
    --rc-paper: #f8f7f4;
    --rc-line: rgba(26, 25, 23, 0.1);
    --rc-glass: rgba(255, 255, 253, 0.56);
    --rc-ease: cubic-bezier(.16,1,.3,1);
  }

  * {
    box-sizing: border-box;
  }

  html {
    background: #f8f7f4;
    scroll-behavior: smooth;
  }

  body {
    min-width: 320px;
    margin: 0;
    background: #f8f7f4;
    color: var(--rc-ink);
    font-family: -apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", Inter, "Helvetica Neue", Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-rendering: optimizeLegibility;
    font-feature-settings: "ss01", "cv11", "cv02";
  }

  button,
  input {
    font: inherit;
  }

  button {
    -webkit-tap-highlight-color: transparent;
  }

  a,
  button {
    -webkit-tap-highlight-color: transparent;
  }

  a:focus-visible,
  button:focus-visible,
  input:focus-visible {
    outline: 2px solid #a65c14;
    outline-offset: 3px;
  }

  .rc-atmosphere {
    position: fixed;
    z-index: 0;
    inset: 0;
    overflow: hidden;
    pointer-events: none;
    background:
      radial-gradient(circle at 50% 4%, rgba(255,255,255,.8), transparent 35%),
      linear-gradient(180deg, #f8f7f4 0%, #f4f2ed 48%, #f8f7f4 100%);
  }

  .rc-aura {
    position: absolute;
    border-radius: 999px;
    filter: blur(18px);
    opacity: .9;
    will-change: transform;
  }

  .rc-aura-one {
    width: 50vw;
    min-width: 420px;
    aspect-ratio: 1;
    top: -22vw;
    left: -16vw;
    background: radial-gradient(circle at 45% 45%, rgba(232, 171, 91, .23), rgba(238, 203, 157, .09) 38%, transparent 68%);
    transform: translate3d(calc(var(--rc-scroll) * .04), calc(var(--rc-scroll) * -.045), 0);
  }

  .rc-aura-two {
    width: 54vw;
    min-width: 480px;
    aspect-ratio: 1;
    top: 22vh;
    right: -28vw;
    background: radial-gradient(circle at 45% 45%, rgba(102, 191, 181, .16), rgba(180, 220, 216, .09) 43%, transparent 70%);
    transform: translate3d(calc(var(--rc-scroll) * -.065), calc(var(--rc-scroll) * -.018), 0);
  }

  .rc-aura-three {
    width: 55vw;
    min-width: 460px;
    aspect-ratio: 1;
    top: 60vh;
    left: -32vw;
    background: radial-gradient(circle at 50% 50%, rgba(181, 158, 225, .12), rgba(217, 208, 237, .08) 42%, transparent 72%);
    transform: translate3d(calc(var(--rc-scroll) * .055), calc(var(--rc-scroll) * -.028), 0);
  }

  .rc-grid-field {
    position: absolute;
    inset: 0;
    opacity: .34;
    background-image:
      linear-gradient(rgba(31, 29, 27, .025) 1px, transparent 1px),
      linear-gradient(90deg, rgba(31, 29, 27, .025) 1px, transparent 1px);
    background-size: 52px 52px;
    mask-image: linear-gradient(to bottom, black, transparent 25%, transparent 74%, black);
  }

  .rc-noise {
    position: absolute;
    inset: 0;
    opacity: .025;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 150 150' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='.92'/%3E%3C/svg%3E");
  }

  .rc-nav {
    position: fixed;
    z-index: 100;
    top: 0;
    left: 0;
    right: 0;
    height: 78px;
    transition: height 320ms var(--rc-ease), background 320ms var(--rc-ease), border-color 320ms var(--rc-ease), box-shadow 320ms var(--rc-ease);
  }

  .rc-nav-scrolled {
    height: 62px;
    background: rgba(248, 247, 244, .74);
    backdrop-filter: blur(22px) saturate(1.35);
    -webkit-backdrop-filter: blur(22px) saturate(1.35);
    border-bottom: 1px solid rgba(26, 25, 23, .07);
    box-shadow: 0 10px 30px rgba(30, 27, 22, .035);
  }

  .rc-nav-inner,
  .rc-section-shell {
    width: min(1240px, calc(100% - 48px));
    margin: 0 auto;
  }

  .rc-nav-inner {
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .rc-nav-links,
  .rc-nav-actions {
    display: flex;
    align-items: center;
  }

  .rc-nav-links {
    gap: 2px;
  }

  .rc-nav-actions {
    gap: 8px;
  }

  .rc-nav-link,
  .rc-signin {
    padding: 8px 12px;
    color: #595752;
    border-radius: 8px;
    text-decoration: none;
    font-size: 13px;
    font-weight: 480;
    letter-spacing: -.12px;
    transition: background 180ms ease, color 180ms ease;
  }

  .rc-nav-link:hover,
  .rc-signin:hover {
    background: rgba(17, 17, 15, .045);
    color: var(--rc-ink);
  }

  .rc-top-cta {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    padding: 9px 13px 9px 15px;
    border-radius: 9px;
    background: #161614;
    color: #fbfaf7;
    text-decoration: none;
    font-size: 13px;
    font-weight: 560;
    letter-spacing: -.12px;
    box-shadow: inset 0 1px 0 rgba(255,255,255,.12), 0 4px 10px rgba(18,17,15,.15);
    transition: transform 180ms var(--rc-ease), background 180ms ease, box-shadow 180ms ease;
  }

  .rc-top-cta:hover {
    transform: translateY(-1px);
    background: #292825;
    box-shadow: inset 0 1px 0 rgba(255,255,255,.14), 0 8px 18px rgba(18,17,15,.19);
  }

  .rc-mobile-trigger {
    display: none;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
    margin-right: -8px;
    border: 0;
    border-radius: 9px;
    background: transparent;
    color: var(--rc-ink);
    cursor: pointer;
  }

  .rc-mobile-sheet {
    position: fixed;
    z-index: 90;
    inset: 61px 0 0;
    display: none;
    padding: 20px 24px 28px;
    background: rgba(248, 247, 244, .96);
    backdrop-filter: blur(26px);
    -webkit-backdrop-filter: blur(26px);
    opacity: 0;
    pointer-events: none;
    transform: translateY(-10px);
    transition: opacity 240ms var(--rc-ease), transform 240ms var(--rc-ease);
  }

  .rc-mobile-sheet-open {
    opacity: 1;
    pointer-events: auto;
    transform: translateY(0);
  }

  .rc-mobile-sheet-inner {
    display: flex;
    flex-direction: column;
  }

  .rc-mobile-link {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 17px 0;
    color: var(--rc-ink);
    border-bottom: 1px solid rgba(25,23,20,.08);
    text-decoration: none;
    font-size: 18px;
    font-weight: 530;
    letter-spacing: -.45px;
  }

  .rc-mobile-sheet-actions {
    display: grid;
    grid-template-columns: 1fr 1.2fr;
    gap: 9px;
    margin-top: 24px;
  }

  .rc-mobile-signin,
  .rc-mobile-cta {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 7px;
    min-height: 46px;
    border-radius: 10px;
    text-decoration: none;
    font-size: 14px;
    font-weight: 560;
  }

  .rc-mobile-signin {
    border: 1px solid rgba(25,23,20,.12);
    color: var(--rc-ink);
  }

  .rc-mobile-cta {
    background: var(--rc-ink);
    color: #fff;
  }

  .rc-hero,
  .rc-section,
  .rc-trust-strip,
  .rc-final-section,
  .rc-footer {
    position: relative;
    z-index: 1;
  }

  .rc-hero {
    padding: 166px 0 92px;
    overflow: hidden;
  }

  .rc-hero-shell {
    display: grid;
    grid-template-columns: minmax(0, .93fr) minmax(560px, 1.07fr);
    align-items: center;
    gap: clamp(40px, 5vw, 84px);
  }

  .rc-hero-copy {
    position: relative;
    z-index: 2;
    padding-top: 8px;
  }

  .rc-hero-kicker,
  .rc-section-label,
  .rc-final-kicker {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    color: #706d67;
    font-size: 11px;
    font-weight: 620;
    letter-spacing: .92px;
    line-height: 1;
    text-transform: uppercase;
  }

  .rc-hero-kicker {
    padding: 6px 10px 6px 7px;
    border: 1px solid rgba(40, 35, 28, .09);
    border-radius: 999px;
    background: rgba(255, 255, 252, .52);
    box-shadow: 0 3px 12px rgba(50, 41, 26, .035), inset 0 1px 1px rgba(255,255,255,.85);
    text-transform: none;
    letter-spacing: -.08px;
    font-size: 12px;
    font-weight: 490;
  }

  .rc-kicker-spark {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 19px;
    height: 19px;
    border-radius: 50%;
    background: linear-gradient(135deg, #c67d29, #9f5410);
    color: white;
    box-shadow: 0 2px 5px rgba(150, 85, 15, .2);
  }

  .rc-hero h1,
  .rc-section h2,
  .rc-final-section h2 {
    margin: 0;
    color: var(--rc-ink);
    font-weight: 610;
    letter-spacing: -2.8px;
    line-height: .995;
  }

  .rc-hero h1 {
    margin-top: 24px;
    max-width: 650px;
    font-size: clamp(48px, 5.1vw, 76px);
  }

  .rc-hero h1 em,
  .rc-section h2 span,
  .rc-final-section h2 em {
    color: #76726b;
    font-family: Georgia, "Times New Roman", serif;
    font-weight: 400;
    letter-spacing: -3.2px;
  }

  .rc-hero-description {
    max-width: 560px;
    margin: 28px 0 0;
    color: #5e5a54;
    font-size: 17px;
    font-weight: 420;
    letter-spacing: -.22px;
    line-height: 1.6;
  }

  .rc-hero-actions,
  .rc-final-actions {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    margin-top: 34px;
  }

  .rc-button {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    min-height: 48px;
    padding: 0 17px;
    border: 1px solid transparent;
    border-radius: 10px;
    font-size: 14px;
    font-weight: 570;
    letter-spacing: -.18px;
    text-decoration: none;
    transition: transform 220ms var(--rc-ease), box-shadow 220ms var(--rc-ease), background 220ms ease, border-color 220ms ease;
  }

  .rc-button:hover {
    transform: translateY(-2px);
  }

  .rc-button-dark {
    background: linear-gradient(180deg, #22211f, #11110f);
    color: #fff;
    box-shadow: inset 0 1px 0 rgba(255,255,255,.12), 0 8px 20px rgba(26, 22, 17, .16);
  }

  .rc-button-dark:hover {
    background: linear-gradient(180deg, #35332f, #191816);
    box-shadow: inset 0 1px 0 rgba(255,255,255,.14), 0 13px 28px rgba(26, 22, 17, .22);
  }

  .rc-button-glass {
    border-color: rgba(34,31,27,.12);
    background: rgba(255,255,253,.45);
    color: #24221e;
    box-shadow: inset 0 1px 0 rgba(255,255,255,.9), 0 4px 10px rgba(35, 29, 20, .035);
    backdrop-filter: blur(14px);
    -webkit-backdrop-filter: blur(14px);
  }

  .rc-button-glass:hover {
    background: rgba(255,255,253,.8);
    border-color: rgba(34,31,27,.18);
  }

  .rc-button-play {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 19px;
    height: 19px;
    border: 1px solid rgba(34,31,27,.13);
    border-radius: 50%;
  }

  .rc-hero-note {
    display: flex;
    align-items: center;
    gap: 9px;
    margin-top: 24px;
    color: #89857e;
    font-size: 11.5px;
    font-weight: 470;
    letter-spacing: -.1px;
  }

  .rc-note-line {
    width: 26px;
    height: 1px;
    background: #bcb7ae;
  }

  .rc-hero-product-entry {
    min-width: 0;
  }

  .rc-hero-product-wrap {
    position: relative;
    width: 100%;
    min-height: 570px;
    padding: 35px 0 35px 12px;
  }

  .rc-hero-product-wrap::before {
    position: absolute;
    inset: 0 -16% 0 0;
    border-radius: 50%;
    background:
      radial-gradient(circle at 45% 45%, rgba(246, 214, 171, .46), transparent 28%),
      radial-gradient(circle at 67% 57%, rgba(144, 209, 200, .25), transparent 35%);
    filter: blur(18px);
    content: "";
  }

  .rc-orbit {
    position: absolute;
    border: 1px solid rgba(130, 112, 85, .12);
    border-radius: 50%;
    pointer-events: none;
  }

  .rc-orbit-left {
    top: 42px;
    right: -58px;
    width: 460px;
    height: 460px;
    transform: rotate(-24deg);
  }

  .rc-orbit-right {
    bottom: 26px;
    left: -100px;
    width: 350px;
    height: 350px;
    border-color: rgba(48, 126, 118, .11);
    transform: rotate(38deg);
  }

  .rc-orbit-particle {
    position: absolute;
    width: 8px;
    height: 8px;
    border-radius: 50%;
    box-shadow: 0 0 0 5px rgba(255,255,255,.42);
  }

  .rc-orbit-particle-one {
    top: 67px;
    right: 32px;
    background: #c67d29;
  }

  .rc-orbit-particle-two {
    bottom: 25px;
    left: 65px;
    background: #0f766e;
  }

  .rc-hero-product {
    --tilt-x: 0deg;
    --tilt-y: 0deg;
    position: relative;
    z-index: 2;
    width: 100%;
    overflow: hidden;
    border: 1px solid rgba(48, 40, 28, .17);
    border-radius: 16px;
    background: rgba(255,255,254,.62);
    box-shadow:
      0 35px 80px -29px rgba(62, 43, 21, .29),
      0 13px 30px -14px rgba(48, 35, 19, .18),
      inset 0 1px 0 rgba(255,255,255,.96);
    backdrop-filter: blur(18px) saturate(1.28);
    -webkit-backdrop-filter: blur(18px) saturate(1.28);
    transform: perspective(1500px) rotateX(var(--tilt-x)) rotateY(var(--tilt-y));
    transform-origin: 50% 53%;
    transition: transform 280ms var(--rc-ease);
  }

  .rc-product-shine {
    position: absolute;
    z-index: 5;
    top: 0;
    left: 7%;
    width: 44%;
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,.95), transparent);
    pointer-events: none;
  }

  .rc-product-topbar {
    display: grid;
    grid-template-columns: 1fr auto 1fr;
    align-items: center;
    min-height: 45px;
    padding: 0 13px;
    border-bottom: 1px solid rgba(30, 27, 23, .07);
    background: rgba(250,249,246,.68);
  }

  .rc-window-controls {
    display: flex;
    gap: 5px;
  }

  .rc-window-controls span {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: #ddd8cf;
  }

  .rc-window-controls span:nth-child(2) {
    background: #d2cec5;
  }

  .rc-window-controls span:nth-child(3) {
    background: #c9c5bd;
  }

  .rc-product-title-pill {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 4px 11px;
    color: #6c6860;
    border: 1px solid rgba(30,27,23,.06);
    border-radius: 6px;
    background: rgba(255,255,255,.55);
    font-size: 10px;
    font-weight: 520;
    letter-spacing: -.08px;
  }

  .rc-product-title-status {
    width: 5px;
    height: 5px;
    border-radius: 50%;
    background: #b4691b;
    box-shadow: 0 0 0 3px rgba(180,105,27,.11);
  }

  .rc-product-topbar-avatar {
    justify-self: end;
  }

  .rc-product-app {
    display: grid;
    grid-template-columns: 56px minmax(0, 1.25fr) minmax(200px, .75fr);
    min-height: 408px;
    background: rgba(255,255,254,.42);
  }

  .rc-product-sidebar {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 13px 8px;
    border-right: 1px solid rgba(31,27,21,.07);
    background: rgba(247,246,242,.64);
  }

  .rc-sidebar-brand,
  .rc-sidebar-item,
  .rc-sidebar-bottom {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .rc-sidebar-brand-mark {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 26px;
    height: 26px;
    border-radius: 7px;
    background: #181714;
    color: white;
    box-shadow: 0 3px 7px rgba(20,17,12,.16);
  }

  .rc-sidebar-stack {
    display: flex;
    flex-direction: column;
    gap: 7px;
    margin: auto 0;
  }

  .rc-sidebar-item {
    width: 38px;
    height: 33px;
    color: #908b83;
    border-radius: 8px;
  }

  .rc-sidebar-item span {
    display: none;
  }

  .rc-sidebar-item-active {
    color: #1e1b17;
    background: rgba(255,255,255,.9);
    box-shadow: 0 2px 5px rgba(26,20,13,.08);
  }

  .rc-sidebar-mini-avatar {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 25px;
    height: 25px;
    border-radius: 50%;
    background: #b45309;
    color: white;
    font-size: 8px;
    font-weight: 700;
  }

  .rc-product-main {
    min-width: 0;
    padding: 20px 19px 0;
    border-right: 1px solid rgba(31,27,21,.07);
  }

  .rc-product-main-header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 12px;
    margin-bottom: 17px;
  }

  .rc-eyebrow {
    margin-bottom: 4px;
    color: #98928a;
    font-size: 9px;
    font-weight: 650;
    letter-spacing: .72px;
    text-transform: uppercase;
  }

  .rc-product-main-header h3 {
    margin: 0;
    color: #1c1915;
    font-size: 15px;
    font-weight: 630;
    letter-spacing: -.28px;
  }

  .rc-product-main-header p {
    margin: 4px 0 0;
    color: #8c8780;
    font-size: 10px;
    letter-spacing: -.07px;
  }

  .rc-live-status {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    margin-top: 3px;
    color: #a15515;
    font-size: 9px;
    font-weight: 680;
    letter-spacing: .52px;
    text-transform: uppercase;
  }

  .rc-live-dot {
    display: inline-block;
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: #c76824;
    box-shadow: 0 0 0 4px rgba(199,104,36,.1);
    animation: rcPulse 1.8s ease-in-out infinite;
  }

  .rc-capture-strip {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 9px;
    padding: 8px 9px;
    border: 1px solid rgba(172,106,42,.13);
    border-radius: 7px;
    background: linear-gradient(90deg, rgba(231,177,109,.13), rgba(255,255,255,.34));
  }

  .rc-capture-strip-label {
    display: flex;
    align-items: center;
    gap: 8px;
    color: #80552d;
    font-size: 9.5px;
    font-weight: 550;
  }

  .rc-capture-time {
    color: #8c8377;
    font-size: 9px;
    font-variant-numeric: tabular-nums;
  }

  .rc-waveform {
    display: flex;
    align-items: center;
    gap: 1.5px;
    width: 35px;
    height: 15px;
  }

  .rc-wave-bar {
    display: block;
    width: 2px;
    min-height: 3px;
    border-radius: 4px;
    background: linear-gradient(#d18a3a, #aa5f19);
    animation: rcWave 1.1s ease-in-out infinite;
    transform-origin: center;
  }

  .rc-product-transcript {
    display: flex;
    flex-direction: column;
    gap: 16px;
    padding-top: 18px;
  }

  .rc-product-segment {
    display: grid;
    grid-template-columns: 24px minmax(0, 1fr);
    gap: 9px;
  }

  .rc-product-segment-meta {
    display: flex;
    align-items: baseline;
    gap: 6px;
    margin-bottom: 3px;
  }

  .rc-product-segment-meta strong {
    color: #2a2824;
    font-size: 10.5px;
    font-weight: 630;
    letter-spacing: -.1px;
  }

  .rc-product-segment-meta span {
    color: #aaa49b;
    font-size: 9px;
    font-variant-numeric: tabular-nums;
  }

  .rc-product-segment p {
    margin: 0;
    color: #5d5952;
    font-size: 10px;
    line-height: 1.52;
    letter-spacing: -.08px;
  }

  .rc-typing-cursor {
    display: inline-block;
    width: 1.5px;
    height: 10px;
    margin-left: 2px;
    background: #af631d;
    vertical-align: -2px;
    animation: rcBlink 1.05s step-end infinite;
  }

  .rc-product-ai {
    padding: 20px 14px;
    background: linear-gradient(180deg, rgba(246,245,240,.85), rgba(251,250,247,.48));
  }

  .rc-product-ai-title {
    display: flex;
    align-items: center;
    gap: 7px;
    margin-bottom: 14px;
    color: #575149;
    font-size: 10px;
    font-weight: 630;
    letter-spacing: -.1px;
  }

  .rc-ai-mark {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 19px;
    height: 19px;
    border-radius: 6px;
    background: linear-gradient(135deg, #b86b20, #8c4e15);
    color: white;
    box-shadow: 0 2px 5px rgba(144,75,15,.18);
  }

  .rc-product-insight-card {
    margin-bottom: 8px;
    padding: 10px;
    border: 1px solid rgba(37,32,26,.07);
    border-radius: 8px;
    background: rgba(255,255,255,.65);
    box-shadow: 0 3px 7px rgba(31,24,16,.025);
  }

  .rc-product-insight-card-new {
    border-color: rgba(180,98,28,.19);
    background: linear-gradient(135deg, rgba(247,220,183,.42), rgba(255,255,255,.72));
    box-shadow: 0 5px 15px rgba(168,91,20,.08);
    animation: rcInsight 1s var(--rc-ease) both;
  }

  .rc-insight-card-head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 6px;
  }

  .rc-insight-card-head > span:last-child {
    color: #aaa39a;
    font-size: 8px;
  }

  .rc-insight-type {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    font-size: 8px;
    font-weight: 680;
    letter-spacing: .35px;
    text-transform: uppercase;
  }

  .rc-insight-type-action {
    color: #9a581c;
  }

  .rc-insight-type-decision {
    color: #0f766e;
  }

  .rc-product-insight-card p {
    margin: 0;
    color: #3a3630;
    font-size: 10px;
    font-weight: 550;
    letter-spacing: -.08px;
    line-height: 1.35;
  }

  .rc-product-insight-card small {
    display: block;
    margin-top: 4px;
    color: #847d73;
    font-size: 8.5px;
  }

  .rc-product-topic-row {
    margin-top: 14px;
  }

  .rc-product-topic-row > span {
    display: block;
    margin-bottom: 6px;
    color: #989188;
    font-size: 8px;
    font-weight: 680;
    letter-spacing: .58px;
    text-transform: uppercase;
  }

  .rc-product-topic-row div {
    display: flex;
    flex-wrap: wrap;
    gap: 4px;
  }

  .rc-product-topic-row i {
    padding: 3px 5px;
    border: 1px solid rgba(25,23,20,.07);
    border-radius: 4px;
    background: rgba(255,255,255,.63);
    color: #6e6860;
    font-size: 8px;
    font-style: normal;
  }

  .rc-float-card {
    position: absolute;
    z-index: 4;
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 9px 11px;
    border: 1px solid rgba(255,255,255,.65);
    border-radius: 10px;
    background: rgba(255,255,252,.58);
    box-shadow: 0 14px 30px rgba(61,41,16,.11), inset 0 1px 0 rgba(255,255,255,.9);
    backdrop-filter: blur(18px) saturate(1.25);
    -webkit-backdrop-filter: blur(18px) saturate(1.25);
  }

  .rc-float-card p,
  .rc-float-card span {
    display: block;
    margin: 0;
    white-space: nowrap;
    letter-spacing: -.1px;
  }

  .rc-float-card p {
    color: #302b24;
    font-size: 10px;
    font-weight: 610;
  }

  .rc-float-card span {
    margin-top: 2px;
    color: #82796d;
    font-size: 8.5px;
  }

  .rc-float-card-recording {
    top: 4px;
    left: -33px;
    animation: rcFloatOne 5.8s ease-in-out infinite;
  }

  .rc-float-card-decision {
    right: -36px;
    bottom: 14px;
    animation: rcFloatTwo 6.5s ease-in-out infinite;
  }

  .rc-float-icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 24px;
    height: 24px;
    border-radius: 7px;
  }

  .rc-float-icon-live {
    background: rgba(199,104,36,.1);
  }

  .rc-float-icon-live .rc-live-dot {
    width: 7px;
    height: 7px;
  }

  .rc-float-icon-decision {
    background: rgba(15,118,110,.1);
    color: #0f766e;
  }

  .rc-trust-strip {
    padding: 33px 0;
    border-top: 1px solid rgba(35,31,26,.07);
    border-bottom: 1px solid rgba(35,31,26,.07);
    background: rgba(255,255,253,.32);
    backdrop-filter: blur(14px);
    -webkit-backdrop-filter: blur(14px);
  }

  .rc-trust-inner {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 28px;
  }

  .rc-trust-inner > p {
    margin: 0;
    color: #5d5952;
    font-size: 14px;
    font-weight: 480;
    letter-spacing: -.16px;
  }

  .rc-trust-roles {
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-end;
    gap: 18px;
  }

  .rc-trust-roles span {
    display: inline-flex;
    align-items: center;
    gap: 7px;
    color: #817c75;
    font-size: 12px;
    font-weight: 510;
    letter-spacing: -.08px;
    white-space: nowrap;
  }

  .rc-trust-roles i {
    width: 4px;
    height: 4px;
    border-radius: 50%;
    background: #b66f24;
  }

  .rc-section {
    padding: 142px 0;
  }

  .rc-problem-section {
    padding-top: 154px;
  }

  .rc-problem-grid {
    display: grid;
    grid-template-columns: minmax(0, .9fr) minmax(430px, 1.1fr);
    align-items: center;
    gap: clamp(58px, 9vw, 135px);
  }

  .rc-section-label {
    margin-bottom: 20px;
  }

  .rc-problem-copy h2,
  .rc-section-heading h2,
  .rc-how-intro h2,
  .rc-ask-copy h2,
  .rc-workflow-copy h2,
  .rc-pricing-intro h2,
  .rc-faq-intro h2 {
    font-size: clamp(37px, 4.1vw, 58px);
  }

  .rc-problem-copy p,
  .rc-workflow-copy > p,
  .rc-ask-copy > p {
    max-width: 490px;
    margin: 23px 0 0;
    color: #605c56;
    font-size: 16px;
    font-weight: 420;
    letter-spacing: -.18px;
    line-height: 1.64;
  }

  .rc-problem-copy p + p {
    margin-top: 14px;
  }

  .rc-text-link {
    display: inline-flex;
    align-items: center;
    gap: 7px;
    margin-top: 27px;
    color: #26231e;
    font-size: 13px;
    font-weight: 590;
    letter-spacing: -.12px;
    text-decoration: none;
    transition: gap 180ms ease, color 180ms ease;
  }

  .rc-text-link:hover {
    gap: 11px;
    color: #a15817;
  }

  .rc-leak-visual {
    position: relative;
    min-height: 400px;
    overflow: hidden;
    border: 1px solid rgba(43,37,29,.1);
    border-radius: 18px;
    background:
      radial-gradient(circle at 67% 26%, rgba(232,177,99,.2), transparent 29%),
      radial-gradient(circle at 33% 75%, rgba(117,199,189,.16), transparent 33%),
      rgba(255,255,253,.43);
    box-shadow: inset 0 1px 0 rgba(255,255,255,.86), 0 20px 42px rgba(50,39,21,.06);
    backdrop-filter: blur(18px) saturate(1.18);
    -webkit-backdrop-filter: blur(18px) saturate(1.18);
  }

  .rc-leak-lines {
    position: absolute;
    inset: 0;
    opacity: .45;
    background-image:
      linear-gradient(90deg, transparent 49.8%, rgba(42,36,28,.08) 50%, transparent 50.2%),
      linear-gradient(rgba(42,36,28,.065) 1px, transparent 1px);
    background-size: 100% 100%, 100% 51px;
  }

  .rc-leak-lines span {
    position: absolute;
    left: 50%;
    width: 1px;
    height: 100%;
    background: linear-gradient(transparent, rgba(42,36,28,.1), transparent);
    transform-origin: top;
  }

  .rc-leak-lines span:nth-child(1) { transform: rotate(-53deg); }
  .rc-leak-lines span:nth-child(2) { transform: rotate(-37deg); }
  .rc-leak-lines span:nth-child(3) { transform: rotate(-21deg); }
  .rc-leak-lines span:nth-child(4) { transform: rotate(-8deg); }
  .rc-leak-lines span:nth-child(5) { transform: rotate(12deg); }
  .rc-leak-lines span:nth-child(6) { transform: rotate(28deg); }
  .rc-leak-lines span:nth-child(7) { transform: rotate(43deg); }
  .rc-leak-lines span:nth-child(8) { transform: rotate(59deg); }

  .rc-leak-meeting-card {
    position: absolute;
    width: 220px;
    padding: 15px;
    border: 1px solid rgba(59,49,35,.09);
    border-radius: 11px;
    background: rgba(255,255,252,.64);
    box-shadow: 0 12px 25px rgba(50,35,17,.08), inset 0 1px 0 rgba(255,255,255,.94);
    backdrop-filter: blur(15px);
    -webkit-backdrop-filter: blur(15px);
  }

  .rc-leak-meeting-card-main {
    top: 61px;
    left: 15%;
    transform: rotate(-4deg);
  }

  .rc-leak-meeting-card-small {
    right: 11%;
    bottom: 55px;
    width: 180px;
    opacity: .65;
    transform: rotate(7deg);
  }

  .rc-leak-card-head {
    display: flex;
    align-items: center;
    gap: 6px;
    margin-bottom: 13px;
    color: #48423a;
    font-size: 10px;
    font-weight: 620;
  }

  .rc-leak-card-dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: #c67822;
  }

  .rc-leak-card-dot-purple {
    background: #7c5db6;
  }

  .rc-leak-card-line {
    width: 100%;
    height: 6px;
    margin-top: 8px;
    border-radius: 99px;
    background: rgba(82,75,66,.14);
  }

  .rc-leak-card-line-short {
    width: 58%;
  }

  .rc-leak-card-line-medium {
    width: 78%;
  }

  .rc-leak-fading-note {
    position: absolute;
    padding: 8px 10px;
    border: 1px solid rgba(70,58,39,.08);
    border-radius: 6px;
    background: rgba(254,251,240,.53);
    color: #746b5e;
    box-shadow: 0 5px 12px rgba(50,36,17,.04);
    font-size: 9.5px;
    letter-spacing: -.05px;
    backdrop-filter: blur(8px);
    -webkit-backdrop-filter: blur(8px);
  }

  .rc-leak-fading-note-one {
    top: 28px;
    right: 15%;
    opacity: .78;
    transform: rotate(5deg);
  }

  .rc-leak-fading-note-two {
    bottom: 28px;
    left: 7%;
    opacity: .47;
    transform: rotate(-7deg);
  }

  .rc-leak-fading-note-three {
    top: 57%;
    left: 45%;
    opacity: .25;
    transform: rotate(3deg);
  }

  .rc-leak-pulse {
    position: absolute;
    top: 50%;
    left: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 76px;
    height: 76px;
    border-radius: 50%;
    background: rgba(17,17,15,.92);
    box-shadow: 0 10px 30px rgba(37,29,18,.25);
    transform: translate(-50%, -50%);
  }

  .rc-leak-pulse::before,
  .rc-leak-pulse::after {
    position: absolute;
    border: 1px solid rgba(120,91,48,.22);
    border-radius: 50%;
    content: "";
  }

  .rc-leak-pulse::before {
    width: 120px;
    height: 120px;
  }

  .rc-leak-pulse::after {
    width: 178px;
    height: 178px;
    opacity: .55;
  }

  .rc-leak-pulse span {
    position: relative;
    z-index: 2;
    width: 4px;
    margin: 0 2px;
    border-radius: 8px;
    background: #f7e6cc;
    animation: rcWave 1.1s ease-in-out infinite;
  }

  .rc-leak-pulse span:nth-child(1) {
    height: 15px;
  }

  .rc-leak-pulse span:nth-child(2) {
    height: 29px;
    animation-delay: .14s;
  }

  .rc-leak-pulse span:nth-child(3) {
    height: 19px;
    animation-delay: .28s;
  }

  .rc-problem-stages {
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    margin-top: 104px;
    border-top: 1px solid rgba(30,27,22,.1);
    border-bottom: 1px solid rgba(30,27,22,.1);
  }

  .rc-stage {
    min-height: 177px;
    padding: 25px 22px 22px;
    border-right: 1px solid rgba(30,27,22,.075);
    transition: background 220ms ease;
  }

  .rc-stage:first-child {
    padding-left: 0;
  }

  .rc-stage:last-child {
    border-right: 0;
  }

  .rc-stage:hover {
    background: rgba(255,255,253,.28);
  }

  .rc-stage > span {
    display: block;
    margin-bottom: 35px;
    color: #aaa49b;
    font-size: 10px;
    font-weight: 620;
    letter-spacing: .5px;
  }

  .rc-stage h3 {
    margin: 0;
    color: #26231e;
    font-size: 16px;
    font-weight: 590;
    letter-spacing: -.26px;
  }

  .rc-stage p {
    margin: 6px 0 0;
    color: #817b73;
    font-size: 12px;
    line-height: 1.45;
  }

  .rc-stage-fade {
    opacity: .52;
  }

  .rc-product-section {
    padding-top: 126px;
    background: linear-gradient(180deg, transparent, rgba(255,255,253,.35) 55%, transparent);
  }

  .rc-section-heading {
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    gap: 60px;
    margin-bottom: 58px;
  }

  .rc-section-heading > div {
    max-width: 680px;
  }

  .rc-section-heading > p {
    max-width: 350px;
    margin: 0 0 4px;
    color: #615d56;
    font-size: 15px;
    font-weight: 420;
    letter-spacing: -.16px;
    line-height: 1.62;
  }

  .rc-meeting-window {
    overflow: hidden;
    border: 1px solid rgba(36,31,25,.13);
    border-radius: 17px;
    background: rgba(255,255,253,.58);
    box-shadow:
      0 32px 70px -38px rgba(48,32,13,.24),
      0 12px 25px -17px rgba(44,30,14,.16),
      inset 0 1px 0 rgba(255,255,255,.94);
    backdrop-filter: blur(19px) saturate(1.24);
    -webkit-backdrop-filter: blur(19px) saturate(1.24);
  }

  .rc-meeting-window-top {
    display: grid;
    grid-template-columns: 1fr auto 1fr;
    align-items: center;
    min-height: 72px;
    padding: 0 22px;
    border-bottom: 1px solid rgba(30,27,22,.07);
    background: rgba(250,249,246,.52);
  }

  .rc-window-controls-muted span {
    background: #dedbd4;
  }

  .rc-meeting-window-title {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .rc-meeting-window-icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 33px;
    height: 33px;
    border-radius: 8px;
    background: linear-gradient(135deg, #2a2824, #11110f);
    color: #fff;
    box-shadow: 0 3px 7px rgba(22,19,15,.16);
  }

  .rc-meeting-window-title strong,
  .rc-meeting-window-title span {
    display: block;
  }

  .rc-meeting-window-title strong {
    color: #292621;
    font-size: 13px;
    font-weight: 630;
    letter-spacing: -.18px;
  }

  .rc-meeting-window-title span {
    margin-top: 3px;
    color: #8a847b;
    font-size: 10.5px;
    letter-spacing: -.08px;
  }

  .rc-share-button {
    justify-self: end;
    display: inline-flex;
    align-items: center;
    gap: 5px;
    padding: 7px 10px;
    border: 1px solid rgba(33,29,23,.1);
    border-radius: 7px;
    background: rgba(255,255,255,.52);
    color: #58534c;
    font-size: 11px;
    font-weight: 540;
    cursor: pointer;
    transition: background 180ms ease, transform 180ms ease;
  }

  .rc-share-button:hover {
    background: #fff;
    transform: translateY(-1px);
  }

  .rc-share-symbol {
    color: #a15817;
    font-size: 13px;
    line-height: 1;
  }

  .rc-meeting-window-nav {
    display: flex;
    gap: 3px;
    padding: 9px 15px;
    overflow-x: auto;
    border-bottom: 1px solid rgba(30,27,22,.07);
    background: rgba(255,255,255,.2);
  }

  .rc-meeting-tab {
    display: inline-flex;
    align-items: center;
    gap: 7px;
    padding: 9px 12px;
    border: 0;
    border-radius: 7px;
    background: transparent;
    color: #817b73;
    font-size: 12px;
    font-weight: 510;
    letter-spacing: -.1px;
    white-space: nowrap;
    cursor: pointer;
    transition: color 180ms ease, background 180ms ease, box-shadow 180ms ease;
  }

  .rc-meeting-tab:hover {
    color: #38332d;
    background: rgba(246,244,239,.7);
  }

  .rc-meeting-tab-active {
    background: rgba(255,255,255,.86);
    color: #211e1a;
    box-shadow: 0 2px 6px rgba(35,28,19,.07), inset 0 0 0 1px rgba(35,28,19,.06);
  }

  .rc-meeting-window-content {
    display: grid;
    grid-template-columns: minmax(0, 1fr) 260px;
    min-height: 488px;
  }

  .rc-meeting-main-content {
    padding: 29px 32px;
    border-right: 1px solid rgba(30,27,22,.07);
  }

  .rc-meeting-panel {
    animation: rcPanelIn 360ms var(--rc-ease);
  }

  .rc-full-segment {
    display: grid;
    grid-template-columns: 30px minmax(0,1fr);
    gap: 12px;
    margin-bottom: 22px;
  }

  .rc-full-segment-meta {
    display: flex;
    align-items: baseline;
    gap: 8px;
    margin-bottom: 5px;
  }

  .rc-full-segment-meta strong {
    color: #292621;
    font-size: 13px;
    font-weight: 620;
    letter-spacing: -.15px;
  }

  .rc-full-segment-meta span {
    color: #a39d94;
    font-size: 10.5px;
    font-variant-numeric: tabular-nums;
  }

  .rc-full-segment p {
    max-width: 650px;
    margin: 0;
    color: #514d46;
    font-size: 13.5px;
    font-weight: 420;
    letter-spacing: -.1px;
    line-height: 1.6;
  }

  .rc-summary-featured {
    padding: 19px 20px;
    border: 1px solid rgba(179,106,32,.15);
    border-radius: 11px;
    background: linear-gradient(135deg, rgba(247,221,185,.39), rgba(255,255,255,.44));
  }

  .rc-summary-featured-title {
    display: flex;
    align-items: center;
    gap: 7px;
    color: #8f581e;
    font-size: 10.5px;
    font-weight: 670;
    letter-spacing: .56px;
    text-transform: uppercase;
  }

  .rc-summary-featured-title > span {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 21px;
    height: 21px;
    border-radius: 6px;
    background: #a96019;
    color: white;
  }

  .rc-summary-featured p {
    margin: 13px 0 0;
    color: #3c3730;
    font-size: 14.5px;
    font-weight: 430;
    letter-spacing: -.15px;
    line-height: 1.65;
  }

  .rc-summary-stat-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 9px;
    margin-top: 14px;
  }

  .rc-summary-stat-grid > div {
    padding: 15px;
    border: 1px solid rgba(36,30,22,.07);
    border-radius: 9px;
    background: rgba(250,249,246,.58);
  }

  .rc-summary-stat-grid span,
  .rc-summary-stat-grid strong,
  .rc-summary-stat-grid small {
    display: block;
  }

  .rc-summary-stat-grid span {
    color: #918b83;
    font-size: 9px;
    font-weight: 650;
    letter-spacing: .56px;
    text-transform: uppercase;
  }

  .rc-summary-stat-grid strong {
    margin-top: 8px;
    color: #27231f;
    font-size: 28px;
    font-weight: 620;
    letter-spacing: -1.1px;
    line-height: 1;
  }

  .rc-summary-stat-grid small {
    margin-top: 5px;
    color: #807971;
    font-size: 10px;
    line-height: 1.35;
  }

  .rc-summary-thread {
    margin-top: 22px;
  }

  .rc-summary-thread > span {
    color: #8e8880;
    font-size: 10px;
    font-weight: 650;
    letter-spacing: .58px;
    text-transform: uppercase;
  }

  .rc-summary-thread > div {
    display: flex;
    align-items: center;
    margin-top: 10px;
  }

  .rc-summary-thread i {
    padding: 6px 8px;
    border: 1px solid rgba(39,34,27,.08);
    border-radius: 6px;
    background: rgba(255,255,255,.68);
    color: #5d574f;
    font-size: 10.5px;
    font-style: normal;
    white-space: nowrap;
  }

  .rc-summary-thread b {
    width: 18px;
    height: 1px;
    background: #c6c0b7;
  }

  .rc-decision-view {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .rc-decision-item {
    display: grid;
    grid-template-columns: 22px 31px minmax(0,1fr);
    gap: 12px;
    align-items: start;
    padding: 16px;
    border: 1px solid rgba(27,72,67,.1);
    border-radius: 10px;
    background: linear-gradient(135deg, rgba(184,226,219,.18), rgba(255,255,255,.57));
  }

  .rc-decision-index {
    padding-top: 4px;
    color: #9b9690;
    font-size: 9px;
    font-weight: 650;
    letter-spacing: .4px;
  }

  .rc-decision-icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 30px;
    height: 30px;
    border-radius: 8px;
    background: rgba(15,118,110,.11);
    color: #0f766e;
  }

  .rc-decision-item p {
    margin: 3px 0 0;
    color: #2f3b38;
    font-size: 13.5px;
    font-weight: 510;
    letter-spacing: -.12px;
    line-height: 1.45;
  }

  .rc-decision-item span {
    display: block;
    margin-top: 6px;
    color: #77817e;
    font-size: 10px;
  }

  .rc-actions-view {
    display: flex;
    flex-direction: column;
    gap: 9px;
  }

  .rc-action-item {
    display: flex;
    gap: 13px;
    align-items: flex-start;
    padding: 15px;
    border: 1px solid rgba(33,29,22,.09);
    border-radius: 10px;
    background: rgba(255,255,255,.57);
    transition: opacity 180ms ease, background 180ms ease;
  }

  .rc-action-complete {
    opacity: .56;
    background: rgba(246,245,241,.72);
  }

  .rc-action-check,
  .rc-board-task-check {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    width: 20px;
    height: 20px;
    margin-top: 1px;
    border: 1.5px solid #aba49a;
    border-radius: 5px;
    background: transparent;
    color: white;
    cursor: pointer;
    transition: background 180ms ease, border-color 180ms ease, transform 180ms ease;
  }

  .rc-action-check:hover,
  .rc-board-task-check:hover {
    border-color: #39342d;
    transform: scale(1.06);
  }

  .rc-action-complete .rc-action-check,
  .rc-board-task-complete .rc-board-task-check {
    border-color: #1e1b17;
    background: #1e1b17;
  }

  .rc-action-copy {
    min-width: 0;
    flex: 1;
  }

  .rc-action-copy p {
    margin: 0;
    color: #282520;
    font-size: 13px;
    font-weight: 560;
    letter-spacing: -.1px;
    line-height: 1.45;
  }

  .rc-action-complete .rc-action-copy p {
    text-decoration: line-through;
  }

  .rc-action-copy > div {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-top: 6px;
  }

  .rc-action-owner,
  .rc-action-due {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    color: #79736b;
    font-size: 10.5px;
  }

  .rc-action-owner i {
    width: 5px;
    height: 5px;
    border-radius: 50%;
  }

  .rc-action-divider {
    width: 3px;
    height: 3px;
    border-radius: 50%;
    background: #c4beb5;
  }

  .rc-action-menu {
    display: flex;
    flex-direction: column;
    gap: 2px;
    padding: 6px 2px;
    border: 0;
    background: transparent;
    cursor: pointer;
  }

  .rc-action-menu span {
    width: 3px;
    height: 3px;
    border-radius: 50%;
    background: #a7a097;
  }

  .rc-meeting-sidebar {
    padding: 26px 20px;
    background: rgba(247,246,242,.48);
  }

  .rc-side-section {
    margin-bottom: 28px;
  }

  .rc-side-title {
    display: block;
    margin-bottom: 10px;
    color: #938d84;
    font-size: 9.5px;
    font-weight: 650;
    letter-spacing: .63px;
    text-transform: uppercase;
  }

  .rc-participant-list {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .rc-participant-list > div {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .rc-participant-list span {
    color: #514b44;
    font-size: 11.5px;
    font-weight: 510;
    letter-spacing: -.08px;
  }

  .rc-topic-list {
    display: flex;
    flex-wrap: wrap;
    gap: 5px;
  }

  .rc-topic-list span {
    display: inline-flex;
    align-items: center;
    gap: 3px;
    padding: 5px 7px;
    border: 1px solid rgba(34,30,24,.07);
    border-radius: 5px;
    background: rgba(255,255,255,.58);
    color: #6f6961;
    font-size: 10px;
    letter-spacing: -.05px;
  }

  .rc-side-source {
    padding-top: 19px;
    border-top: 1px solid rgba(34,30,24,.07);
  }

  .rc-side-source p {
    display: flex;
    gap: 7px;
    margin: 0;
    color: #79736b;
    font-size: 10.5px;
    line-height: 1.48;
  }

  .rc-how-section {
    padding-top: 124px;
  }

  .rc-how-intro {
    max-width: 700px;
  }

  .rc-how-path {
    position: relative;
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 1px;
    margin-top: 61px;
    border: 1px solid rgba(35,30,24,.09);
    border-radius: 15px;
    background: rgba(35,30,24,.09);
    overflow: hidden;
  }

  .rc-how-path-line {
    position: absolute;
    z-index: 2;
    top: 88px;
    left: 11%;
    width: 77%;
    height: 1px;
    background: linear-gradient(90deg, #bf7a31, #7fb4aa 35%, #8f7abd 68%, #bd7d91);
    opacity: .45;
    pointer-events: none;
  }

  .rc-how-step {
    position: relative;
    z-index: 3;
    min-height: 275px;
    padding: 27px;
    background: rgba(255,255,253,.6);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
  }

  .rc-how-step-top {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .rc-how-step-top > span {
    color: #a39c92;
    font-size: 10px;
    font-weight: 670;
    letter-spacing: .6px;
  }

  .rc-how-step-icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 37px;
    height: 37px;
    border: 1px solid rgba(34,30,24,.09);
    border-radius: 9px;
    background: rgba(255,255,255,.8);
    color: #302c26;
    box-shadow: 0 3px 8px rgba(39,31,19,.06);
  }

  .rc-how-step h3 {
    margin: 58px 0 8px;
    color: #282520;
    font-size: 19px;
    font-weight: 610;
    letter-spacing: -.4px;
  }

  .rc-how-step p {
    max-width: 220px;
    margin: 0;
    color: #706a62;
    font-size: 13px;
    font-weight: 430;
    letter-spacing: -.1px;
    line-height: 1.55;
  }

  .rc-how-bottom-note {
    display: flex;
    align-items: center;
    gap: 14px;
    margin-top: 22px;
    color: #777169;
    font-size: 13px;
    letter-spacing: -.1px;
  }

  .rc-how-bottom-note p {
    margin: 0;
  }

  .rc-how-bottom-signature {
    display: flex;
    align-items: center;
    gap: 3px;
    height: 18px;
  }

  .rc-how-bottom-signature span {
    width: 3px;
    border-radius: 4px;
    background: #b46c23;
  }

  .rc-how-bottom-signature span:nth-child(1) { height: 6px; }
  .rc-how-bottom-signature span:nth-child(2) { height: 14px; }
  .rc-how-bottom-signature span:nth-child(3) { height: 9px; }
  .rc-how-bottom-signature span:nth-child(4) { height: 17px; }

  .rc-features-section {
    padding-top: 148px;
  }

  .rc-feature-bento {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 11px;
  }

  .rc-bento-cell {
    min-width: 0;
  }

  .rc-bento-wide {
    grid-column: span 2;
  }

  .rc-feature-card {
    position: relative;
    height: 100%;
    min-height: 244px;
    overflow: hidden;
    padding: 27px;
    border: 1px solid rgba(36,31,25,.1);
    border-radius: 14px;
    background: rgba(255,255,253,.5);
    box-shadow: inset 0 1px 0 rgba(255,255,255,.9), 0 8px 22px rgba(42,31,16,.025);
    backdrop-filter: blur(15px) saturate(1.1);
    -webkit-backdrop-filter: blur(15px) saturate(1.1);
    transition: transform 300ms var(--rc-ease), background 300ms ease, border-color 300ms ease, box-shadow 300ms var(--rc-ease);
  }

  .rc-feature-card:hover {
    border-color: rgba(36,31,25,.17);
    background: rgba(255,255,253,.76);
    box-shadow: inset 0 1px 0 rgba(255,255,255,.98), 0 20px 36px rgba(42,31,16,.07);
    transform: translateY(-4px);
  }

  .rc-feature-icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 35px;
    height: 35px;
    margin-bottom: 20px;
    border: 1px solid rgba(38,34,28,.08);
    border-radius: 9px;
    background: rgba(245,243,237,.84);
    color: #37322c;
  }

  .rc-feature-icon-warm {
    background: rgba(240,191,124,.18);
    color: #a35816;
  }

  .rc-feature-icon-green {
    background: rgba(136,203,194,.16);
    color: #0f766e;
  }

  .rc-feature-icon-blue {
    background: rgba(141,180,209,.15);
    color: #426d8c;
  }

  .rc-feature-icon-purple {
    background: rgba(178,157,219,.16);
    color: #72529e;
  }

  .rc-feature-card h3 {
    max-width: 260px;
    margin: 0 0 8px;
    color: #26231e;
    font-size: 17px;
    font-weight: 610;
    letter-spacing: -.35px;
    line-height: 1.15;
  }

  .rc-feature-card p {
    max-width: 285px;
    margin: 0;
    color: #6b655e;
    font-size: 13px;
    font-weight: 430;
    letter-spacing: -.1px;
    line-height: 1.55;
  }

  .rc-feature-card-signal,
  .rc-feature-card-search,
  .rc-feature-card-calendar {
    display: flex;
    align-items: stretch;
    justify-content: space-between;
    min-height: 283px;
  }

  .rc-feature-card-copy {
    position: relative;
    z-index: 2;
    width: min(48%, 320px);
  }

  .rc-feature-signal {
    position: absolute;
    right: 22px;
    bottom: 20px;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    width: 42%;
    min-width: 210px;
    height: 192px;
    padding: 15px;
    overflow: hidden;
    border: 1px solid rgba(77,54,27,.1);
    border-radius: 11px;
    background:
      linear-gradient(rgba(36,32,26,.035) 1px, transparent 1px),
      linear-gradient(90deg, rgba(36,32,26,.035) 1px, transparent 1px),
      rgba(255,255,253,.6);
    background-size: 100% 25%, 24px 100%, auto;
    box-shadow: 0 12px 24px rgba(63,42,16,.06);
  }

  .rc-feature-signal-label {
    position: absolute;
    top: 14px;
    left: 14px;
    color: #8b8378;
    font-size: 9px;
    font-weight: 650;
    letter-spacing: .55px;
    text-transform: uppercase;
  }

  .rc-feature-signal-graph {
    display: flex;
    align-items: center;
    gap: 4px;
    height: 88px;
    margin-top: 22px;
  }

  .rc-feature-signal-graph i {
    display: block;
    width: 5px;
    min-height: 6px;
    border-radius: 9px;
    background: linear-gradient(#d3954b, #9f5b19);
    animation: rcWave 1.5s ease-in-out infinite;
  }

  .rc-feature-signal-caption {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: 13px;
    padding-top: 11px;
    border-top: 1px solid rgba(45,38,30,.08);
  }

  .rc-feature-signal-caption span {
    color: #664725;
    font-size: 10px;
    font-weight: 560;
  }

  .rc-feature-signal-caption b {
    color: #998e80;
    font-size: 9px;
    font-weight: 520;
  }

  .rc-feature-search {
    position: absolute;
    right: 21px;
    bottom: 22px;
    width: 42%;
    min-width: 220px;
  }

  .rc-feature-search > div {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 10px;
    border: 1px solid rgba(58,72,83,.15);
    border-radius: 8px;
    background: rgba(255,255,255,.75);
    color: #46667b;
    box-shadow: 0 5px 14px rgba(49,72,86,.08);
    font-size: 10px;
    font-weight: 550;
  }

  .rc-feature-search kbd {
    margin-left: auto;
    padding: 2px 4px;
    border: 1px solid rgba(50,70,84,.13);
    border-radius: 3px;
    color: #8a9aa5;
    font-size: 8px;
    font-family: inherit;
  }

  .rc-feature-search p {
    max-width: none;
    margin-top: 6px;
    padding: 10px;
    border: 1px solid rgba(47,65,75,.08);
    border-radius: 8px;
    background: rgba(255,255,255,.54);
    color: #45413c;
    font-size: 10px;
    font-weight: 590;
    line-height: 1.38;
  }

  .rc-feature-search small {
    display: block;
    margin-top: 3px;
    color: #7c7b77;
    font-size: 9px;
    font-weight: 420;
  }

  .rc-feature-calendar {
    position: absolute;
    right: 20px;
    bottom: 19px;
    width: 42%;
    min-width: 216px;
    height: 188px;
    padding: 14px;
    border: 1px solid rgba(37,35,30,.08);
    border-radius: 11px;
    background: rgba(255,255,255,.61);
    box-shadow: 0 12px 24px rgba(35,31,20,.06);
  }

  .rc-feature-calendar-days {
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    gap: 3px;
    color: #918b83;
    font-size: 8px;
    font-weight: 630;
    text-align: center;
  }

  .rc-feature-calendar-days span {
    padding-bottom: 7px;
  }

  .rc-feature-calendar-days .rc-day-active {
    color: #a45d18;
  }

  .rc-feature-calendar-events {
    position: relative;
    height: 132px;
    border-top: 1px solid rgba(37,35,30,.08);
    background-image: linear-gradient(rgba(37,35,30,.055) 1px, transparent 1px);
    background-size: 100% 33px;
  }

  .rc-feature-calendar-events i {
    position: absolute;
    z-index: 2;
    padding: 5px 6px;
    overflow: hidden;
    border: 1px solid rgba(39,35,30,.06);
    border-left: 2px solid #c87a26;
    border-radius: 4px;
    background: rgba(247,221,184,.62);
    color: #6d4c29;
    font-size: 8px;
    font-style: normal;
    white-space: nowrap;
  }

  .rc-feature-calendar-events i:nth-child(2) {
    border-left-color: #7c5cb1;
    background: rgba(212,199,235,.5);
    color: #684f92;
  }

  .rc-feature-calendar-events i:nth-child(3) {
    border-left-color: #0f766e;
    background: rgba(181,221,216,.5);
    color: #246861;
  }

  .rc-feature-card-small {
    min-height: 228px;
  }

  .rc-feature-footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 22px;
    margin-top: 27px;
    padding-top: 24px;
    border-top: 1px solid rgba(37,31,24,.1);
  }

  .rc-feature-footer > span {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    color: #777169;
    font-size: 13px;
    letter-spacing: -.1px;
  }

  .rc-feature-footer > span svg {
    color: #a35e1c;
  }

  .rc-feature-footer .rc-text-link {
    margin: 0;
    white-space: nowrap;
  }

  .rc-ask-section {
    background: linear-gradient(180deg, rgba(255,255,253,.24), rgba(239,236,228,.4) 52%, rgba(255,255,253,.26));
  }

  .rc-ask-layout {
    display: grid;
    grid-template-columns: minmax(0, .87fr) minmax(520px, 1.13fr);
    align-items: center;
    gap: clamp(55px, 9vw, 130px);
  }

  .rc-ask-copy > p {
    max-width: 500px;
  }

  .rc-ask-principles {
    display: flex;
    flex-direction: column;
    gap: 11px;
    margin-top: 31px;
  }

  .rc-ask-principles div {
    display: flex;
    align-items: center;
    gap: 10px;
    color: #4f4a43;
    font-size: 13px;
    font-weight: 500;
    letter-spacing: -.1px;
  }

  .rc-principle-number {
    width: 22px;
    color: #a29b91;
    font-size: 9px;
    font-weight: 650;
    letter-spacing: .45px;
  }

  .rc-ask-window {
    overflow: hidden;
    border: 1px solid rgba(41,35,27,.13);
    border-radius: 16px;
    background: rgba(255,255,253,.62);
    box-shadow:
      0 32px 70px -32px rgba(42,31,16,.2),
      inset 0 1px 0 rgba(255,255,255,.96);
    backdrop-filter: blur(20px) saturate(1.23);
    -webkit-backdrop-filter: blur(20px) saturate(1.23);
  }

  .rc-ask-window-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 15px 17px;
    border-bottom: 1px solid rgba(35,30,24,.07);
    background: rgba(250,249,246,.53);
  }

  .rc-ask-window-brand {
    display: flex;
    align-items: center;
    gap: 9px;
  }

  .rc-ask-window-brand-icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 25px;
    height: 25px;
    border-radius: 7px;
    background: linear-gradient(135deg, #b66b22, #82450f);
    color: white;
    box-shadow: 0 3px 7px rgba(133,68,13,.17);
  }

  .rc-ask-window-brand strong,
  .rc-ask-window-brand span {
    display: block;
  }

  .rc-ask-window-brand strong {
    color: #28241f;
    font-size: 12px;
    font-weight: 630;
    letter-spacing: -.15px;
  }

  .rc-ask-window-brand span {
    margin-top: 2px;
    color: #888178;
    font-size: 9.5px;
  }

  .rc-ask-online {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    color: #62716d;
    font-size: 10px;
    font-weight: 560;
  }

  .rc-ask-online > span,
  .rc-calendar-connected > span,
  .rc-final-kicker > span {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: #0f766e;
    box-shadow: 0 0 0 4px rgba(15,118,110,.1);
  }

  .rc-ask-content {
    min-height: 397px;
    padding: 21px;
  }

  .rc-suggested-label {
    margin-bottom: 9px;
    color: #989188;
    font-size: 9px;
    font-weight: 670;
    letter-spacing: .65px;
    text-transform: uppercase;
  }

  .rc-suggestion-list {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
  }

  .rc-suggestion {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 7px 9px;
    border: 1px solid rgba(38,32,25,.09);
    border-radius: 6px;
    background: rgba(249,248,245,.65);
    color: #6d665e;
    font-size: 10.5px;
    font-weight: 490;
    letter-spacing: -.08px;
    text-align: left;
    cursor: pointer;
    transition: color 180ms ease, background 180ms ease, transform 180ms var(--rc-ease), border-color 180ms ease;
  }

  .rc-suggestion:hover {
    border-color: rgba(38,32,25,.18);
    background: rgba(255,255,255,.92);
    color: #322e29;
    transform: translateY(-1px);
  }

  .rc-suggestion-active {
    border-color: rgba(172,95,22,.25);
    background: rgba(248,225,194,.62);
    color: #82531f;
  }

  .rc-question-bubble {
    width: fit-content;
    max-width: 80%;
    margin: 24px 0 18px auto;
    padding: 10px 13px;
    border-radius: 10px 10px 2px 10px;
    background: linear-gradient(135deg, #302d28, #181715);
    color: #f8f7f4;
    box-shadow: 0 5px 12px rgba(27,23,17,.16);
    font-size: 12px;
    font-weight: 470;
    letter-spacing: -.1px;
    line-height: 1.45;
  }

  .rc-thinking {
    display: flex;
    align-items: center;
    gap: 5px;
    min-height: 95px;
    padding-left: 4px;
  }

  .rc-thinking span {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: #b76920;
    animation: rcDot 1.1s ease-in-out infinite;
  }

  .rc-thinking span:nth-child(2) {
    animation-delay: .15s;
  }

  .rc-thinking span:nth-child(3) {
    animation-delay: .3s;
  }

  .rc-thinking small {
    margin-left: 5px;
    color: #8c857c;
    font-size: 10px;
  }

  .rc-answer-block {
    position: relative;
    padding: 0 0 0 34px;
    animation: rcPanelIn 350ms var(--rc-ease);
  }

  .rc-answer-mark {
    position: absolute;
    top: 1px;
    left: 0;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 24px;
    height: 24px;
    border-radius: 7px;
    background: linear-gradient(135deg, #c67b2b, #934f13);
    color: white;
  }

  .rc-answer-block > p {
    margin: 0;
    color: #37332d;
    font-size: 13px;
    font-weight: 430;
    letter-spacing: -.12px;
    line-height: 1.62;
  }

  .rc-answer-sources {
    margin-top: 15px;
  }

  .rc-answer-sources > span {
    display: block;
    margin-bottom: 7px;
    color: #968f86;
    font-size: 9px;
    font-weight: 670;
    letter-spacing: .62px;
    text-transform: uppercase;
  }

  .rc-answer-sources > div {
    display: flex;
    flex-wrap: wrap;
    gap: 5px;
  }

  .rc-source-chip {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    padding: 5px 7px;
    border: 1px solid rgba(39,33,26,.08);
    border-radius: 5px;
    background: rgba(255,255,255,.66);
    color: #6a645c;
    font-size: 9.5px;
    font-weight: 520;
    cursor: pointer;
    transition: border-color 180ms ease, background 180ms ease;
  }

  .rc-source-chip:hover {
    border-color: rgba(172,95,22,.24);
    background: #fff;
  }

  .rc-source-chip i {
    width: 2px;
    height: 2px;
    border-radius: 50%;
    background: #b8b0a5;
  }

  .rc-ask-input-row {
    display: flex;
    align-items: center;
    gap: 9px;
    padding: 11px 13px;
    border-top: 1px solid rgba(35,30,24,.07);
    background: rgba(248,247,243,.68);
    color: #8b847a;
  }

  .rc-ask-input-row input {
    min-width: 0;
    flex: 1;
    padding: 0;
    border: 0;
    outline: 0;
    background: transparent;
    color: #37322c;
    font-size: 12px;
    font-weight: 450;
    letter-spacing: -.1px;
  }

  .rc-ask-input-row input::placeholder {
    color: #a9a299;
  }

  .rc-ask-input-row button {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 28px;
    height: 28px;
    border: 0;
    border-radius: 7px;
    background: #23211e;
    color: white;
    cursor: pointer;
    transition: transform 180ms var(--rc-ease), background 180ms ease;
  }

  .rc-ask-input-row button:hover {
    background: #a25b18;
    transform: translateX(1px);
  }

  .rc-workflow-section {
    background: rgba(255,255,253,.28);
  }

  .rc-workflow-layout {
    display: grid;
    grid-template-columns: minmax(480px, 1.07fr) minmax(0, .93fr);
    align-items: center;
    gap: clamp(54px, 9vw, 135px);
  }

  .liquid-card {
    border: 1px solid rgba(39,33,26,.12);
    background:
      linear-gradient(135deg, rgba(255,255,255,.68), rgba(248,247,243,.42)),
      rgba(255,255,253,.48);
    box-shadow:
      inset 0 1px 0 rgba(255,255,255,.94),
      inset 0 -1px 0 rgba(107,93,68,.035),
      0 24px 50px rgba(47,34,15,.07);
    backdrop-filter: blur(20px) saturate(1.18);
    -webkit-backdrop-filter: blur(20px) saturate(1.18);
  }

  .rc-workflow-calendar {
    overflow: hidden;
    border-radius: 16px;
  }

  .rc-calendar-head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 21px 22px;
    border-bottom: 1px solid rgba(37,32,25,.08);
  }

  .rc-calendar-head span,
  .rc-calendar-head strong {
    display: block;
  }

  .rc-calendar-head span {
    color: #969087;
    font-size: 9.5px;
    font-weight: 660;
    letter-spacing: .62px;
    text-transform: uppercase;
  }

  .rc-calendar-head strong {
    margin-top: 4px;
    color: #302d28;
    font-size: 14px;
    font-weight: 620;
    letter-spacing: -.18px;
  }

  .rc-calendar-connected {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 6px 8px;
    border: 1px solid rgba(15,118,110,.12);
    border-radius: 999px;
    background: rgba(166,220,211,.17);
    color: #36716b;
    font-size: 9.5px;
    font-weight: 620;
  }

  .rc-calendar-connected > span {
    width: 5px;
    height: 5px;
  }

  .rc-calendar-list {
    display: flex;
    flex-direction: column;
    gap: 5px;
    padding: 14px;
  }

  .rc-calendar-event {
    display: grid;
    grid-template-columns: 48px 3px minmax(0,1fr) auto;
    gap: 11px;
    align-items: center;
    width: 100%;
    padding: 11px;
    border: 1px solid transparent;
    border-radius: 9px;
    background: transparent;
    color: inherit;
    text-align: left;
    cursor: pointer;
    transition: background 180ms ease, border-color 180ms ease, transform 180ms var(--rc-ease);
  }

  .rc-calendar-event:hover {
    background: rgba(255,255,255,.48);
  }

  .rc-calendar-event-active {
    border-color: rgba(39,33,26,.09);
    background: rgba(255,255,255,.76);
    box-shadow: 0 4px 10px rgba(39,30,17,.035);
    transform: translateX(2px);
  }

  .rc-calendar-event time {
    color: #665f57;
    font-size: 11px;
    font-weight: 570;
    font-variant-numeric: tabular-nums;
  }

  .rc-calendar-event-bar {
    align-self: stretch;
    min-height: 32px;
    border-radius: 5px;
  }

  .rc-calendar-event-copy strong,
  .rc-calendar-event-copy small {
    display: block;
  }

  .rc-calendar-event-copy strong {
    color: #39342d;
    font-size: 12.5px;
    font-weight: 590;
    letter-spacing: -.12px;
  }

  .rc-calendar-event-copy small {
    margin-top: 3px;
    color: #918a82;
    font-size: 10px;
  }

  .rc-calendar-event-state {
    padding: 4px 6px;
    border: 1px dashed rgba(41,35,27,.13);
    border-radius: 5px;
    color: #999188;
    font-size: 8.5px;
    font-weight: 620;
  }

  .rc-state-ready {
    border: 1px solid rgba(15,118,110,.11);
    background: rgba(162,216,208,.16);
    color: #37706a;
  }

  .rc-calendar-preview {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
    margin: 0 14px 14px;
    padding: 13px;
    border: 1px solid rgba(37,32,25,.08);
    border-radius: 9px;
    background: rgba(247,246,242,.6);
  }

  .rc-calendar-preview-title {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .rc-calendar-preview-title > span {
    width: 6px;
    height: 28px;
    border-radius: 4px;
  }

  .rc-calendar-preview-title strong,
  .rc-calendar-preview-title small {
    display: block;
  }

  .rc-calendar-preview-title strong {
    color: #433d36;
    font-size: 11.5px;
    font-weight: 600;
  }

  .rc-calendar-preview-title small {
    margin-top: 3px;
    color: #8d867d;
    font-size: 9.5px;
  }

  .rc-calendar-preview-tags {
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-end;
    gap: 4px;
  }

  .rc-calendar-preview-tags i {
    padding: 4px 5px;
    border: 1px solid rgba(37,32,25,.07);
    border-radius: 4px;
    background: rgba(255,255,255,.7);
    color: #6c655c;
    font-size: 8.5px;
    font-style: normal;
  }

  .rc-workflow-copy > p {
    max-width: 500px;
  }

  .rc-workflow-callout {
    display: flex;
    align-items: center;
    gap: 10px;
    max-width: 455px;
    margin: 28px 0;
    padding: 13px;
    border-left: 2px solid #b66b22;
    border-radius: 0 9px 9px 0;
    background: rgba(246,219,182,.23);
  }

  .rc-workflow-callout-icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 27px;
    height: 27px;
    border-radius: 7px;
    background: rgba(191,111,31,.12);
    color: #a35d18;
  }

  .rc-workflow-callout p {
    margin: 0;
    color: #705637;
    font-size: 12px;
    font-weight: 480;
    letter-spacing: -.08px;
    line-height: 1.45;
  }

  .rc-actions-section {
    padding-top: 151px;
  }

  .rc-actions-heading {
    margin-bottom: 55px;
  }

  .rc-task-board {
    overflow: hidden;
    border-radius: 16px;
  }

  .rc-task-board-head {
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    padding: 25px 27px;
    border-bottom: 1px solid rgba(37,31,23,.08);
    background:
      radial-gradient(circle at 87% 7%, rgba(237,185,112,.2), transparent 24%),
      rgba(255,255,255,.22);
  }

  .rc-task-board-eyebrow {
    display: block;
    margin-bottom: 7px;
    color: #928a80;
    font-size: 9.5px;
    font-weight: 650;
    letter-spacing: .67px;
    text-transform: uppercase;
  }

  .rc-task-board-head h3 {
    margin: 0;
    color: #2c2822;
    font-size: 16px;
    font-weight: 610;
    letter-spacing: -.28px;
  }

  .rc-task-count {
    padding: 8px 10px;
    border: 1px solid rgba(42,35,26,.08);
    border-radius: 8px;
    background: rgba(255,255,255,.6);
    color: #867e74;
    font-size: 10px;
    font-weight: 530;
  }

  .rc-task-count strong {
    margin-right: 3px;
    color: #39342d;
    font-size: 14px;
    font-weight: 650;
  }

  .rc-task-list {
    padding: 11px;
  }

  .rc-board-task {
    display: grid;
    grid-template-columns: 21px minmax(0,1fr) 125px 85px;
    gap: 14px;
    align-items: center;
    padding: 14px 13px;
    border-bottom: 1px solid rgba(37,31,23,.065);
    transition: opacity 180ms ease, background 180ms ease;
  }

  .rc-board-task:last-child {
    border-bottom: 0;
  }

  .rc-board-task:hover {
    border-radius: 8px;
    background: rgba(255,255,255,.5);
  }

  .rc-board-task-complete {
    opacity: .55;
  }

  .rc-board-task-copy p {
    margin: 0;
    color: #38332d;
    font-size: 13px;
    font-weight: 570;
    letter-spacing: -.1px;
  }

  .rc-board-task-complete .rc-board-task-copy p {
    text-decoration: line-through;
  }

  .rc-board-task-copy span {
    display: block;
    margin-top: 4px;
    color: #8f877d;
    font-size: 10px;
  }

  .rc-board-task-copy b {
    color: #756e65;
    font-weight: 570;
  }

  .rc-board-task-owner {
    display: flex;
    align-items: center;
    gap: 6px;
    color: #685f56;
    font-size: 11px;
    font-weight: 520;
  }

  .rc-board-task-due {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    color: #827a70;
    font-size: 10.5px;
  }

  .rc-task-board-footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 15px;
    padding: 15px 24px;
    border-top: 1px solid rgba(37,31,23,.07);
    background: rgba(249,248,244,.58);
  }

  .rc-task-board-footer > span {
    display: inline-flex;
    align-items: center;
    gap: 7px;
    color: #7b746b;
    font-size: 11px;
    letter-spacing: -.06px;
  }

  .rc-task-board-footer > span svg {
    color: #a65d18;
  }

  .rc-task-board-footer a {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    color: #453f37;
    font-size: 11px;
    font-weight: 600;
    text-decoration: none;
    white-space: nowrap;
  }

  .rc-privacy-section {
    padding-top: 124px;
  }

  .rc-privacy-panel {
    position: relative;
    overflow: hidden;
    padding: clamp(40px, 6vw, 72px);
    border: 1px solid rgba(255,255,255,.11);
    border-radius: 18px;
    background:
      radial-gradient(circle at 86% 12%, rgba(219,157,76,.2), transparent 28%),
      radial-gradient(circle at 15% 90%, rgba(61,145,136,.16), transparent 35%),
      linear-gradient(135deg, #1c1b18, #11110f 64%, #181b19);
    box-shadow: 0 30px 60px rgba(34,27,18,.17), inset 0 1px 0 rgba(255,255,255,.1);
  }

  .rc-privacy-light {
    position: absolute;
    top: -100px;
    left: 36%;
    width: 290px;
    height: 260px;
    border-radius: 50%;
    background: rgba(255,255,255,.04);
    filter: blur(38px);
  }

  .rc-privacy-copy {
    position: relative;
    z-index: 2;
    max-width: 660px;
  }

  .rc-section-label-light {
    color: rgba(247,245,239,.52);
  }

  .rc-privacy-copy h2 {
    margin: 0;
    color: #f9f8f4;
    font-size: clamp(34px, 4.2vw, 57px);
    font-weight: 600;
    letter-spacing: -2px;
    line-height: 1.03;
  }

  .rc-privacy-copy h2 span {
    color: rgba(249,248,244,.54);
    font-family: Georgia, "Times New Roman", serif;
    font-weight: 400;
  }

  .rc-privacy-copy p {
    max-width: 570px;
    margin: 22px 0 0;
    color: rgba(249,248,244,.65);
    font-size: 15px;
    font-weight: 410;
    letter-spacing: -.13px;
    line-height: 1.63;
  }

  .rc-text-link-light {
    color: #f7f4ee;
  }

  .rc-text-link-light:hover {
    color: #f0ba77;
  }

  .rc-privacy-points {
    position: relative;
    z-index: 2;
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 16px;
    margin-top: 57px;
  }

  .rc-privacy-point {
    min-height: 154px;
    padding: 18px;
    border: 1px solid rgba(255,255,255,.1);
    border-radius: 11px;
    background: rgba(255,255,255,.047);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
  }

  .rc-privacy-point > div {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 29px;
    height: 29px;
    border-radius: 7px;
    background: rgba(255,255,255,.1);
    color: #f7ead9;
  }

  .rc-privacy-point h3 {
    margin: 21px 0 6px;
    color: #f7f5f0;
    font-size: 13px;
    font-weight: 590;
    letter-spacing: -.16px;
  }

  .rc-privacy-point p {
    margin: 0;
    color: rgba(247,245,239,.54);
    font-size: 11.5px;
    line-height: 1.52;
    letter-spacing: -.08px;
  }

  .rc-pricing-section {
    padding-top: 148px;
  }

  .rc-pricing-intro {
    max-width: 710px;
    margin: 0 auto 55px;
    text-align: center;
  }

  .rc-pricing-intro p {
    max-width: 515px;
    margin: 20px auto 0;
    color: #656057;
    font-size: 15px;
    font-weight: 420;
    letter-spacing: -.14px;
    line-height: 1.62;
  }

  .rc-pricing-card {
    display: grid;
    grid-template-columns: 1.2fr .8fr;
    overflow: hidden;
    border-radius: 17px;
  }

  .rc-pricing-card-main {
    padding: clamp(30px, 4vw, 48px);
  }

  .rc-pricing-card-label {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    color: #9c5a19;
    font-size: 10px;
    font-weight: 670;
    letter-spacing: .62px;
    text-transform: uppercase;
  }

  .rc-pricing-card-label > span {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: #bd7224;
    box-shadow: 0 0 0 4px rgba(189,114,36,.11);
  }

  .rc-pricing-card-main h3 {
    max-width: 490px;
    margin: 19px 0 13px;
    color: #2a2621;
    font-size: clamp(24px, 3vw, 37px);
    font-weight: 610;
    letter-spacing: -1px;
    line-height: 1.08;
  }

  .rc-pricing-card-main > p {
    max-width: 540px;
    margin: 0;
    color: #686158;
    font-size: 14px;
    line-height: 1.58;
    letter-spacing: -.1px;
  }

  .rc-pricing-included {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 11px 16px;
    margin-top: 29px;
  }

  .rc-pricing-included span {
    display: flex;
    align-items: center;
    gap: 7px;
    color: #49433c;
    font-size: 12px;
    font-weight: 490;
    letter-spacing: -.08px;
  }

  .rc-pricing-included i {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    width: 16px;
    height: 16px;
    border-radius: 4px;
    background: #24211d;
    color: white;
  }

  .rc-pricing-card-cta {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: center;
    min-height: 320px;
    padding: clamp(28px, 4vw, 44px);
    overflow: hidden;
    border-left: 1px solid rgba(39,33,26,.08);
    background:
      radial-gradient(circle at 100% 0%, rgba(222,166,92,.34), transparent 35%),
      linear-gradient(145deg, #e9e3d8, #ddd8ce);
  }

  .rc-pricing-orbit {
    position: absolute;
    right: -56px;
    bottom: -56px;
    width: 210px;
    height: 210px;
    border: 1px solid rgba(92,70,37,.2);
    border-radius: 50%;
  }

  .rc-pricing-orbit::before,
  .rc-pricing-orbit::after {
    position: absolute;
    border: 1px solid rgba(92,70,37,.14);
    border-radius: 50%;
    content: "";
  }

  .rc-pricing-orbit::before {
    inset: 24px;
  }

  .rc-pricing-orbit::after {
    inset: 52px;
  }

  .rc-pricing-orbit span {
    position: absolute;
    z-index: 2;
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: #a45c18;
  }

  .rc-pricing-orbit span:nth-child(1) {
    top: 16px;
    left: 46px;
  }

  .rc-pricing-orbit span:nth-child(2) {
    right: 28px;
    bottom: 61px;
    background: #16796f;
  }

  .rc-pricing-orbit span:nth-child(3) {
    bottom: 17px;
    left: 85px;
    background: #7859a8;
  }

  .rc-pricing-card-cta > p,
  .rc-pricing-card-cta > a,
  .rc-pricing-card-cta > small {
    position: relative;
    z-index: 3;
  }

  .rc-pricing-card-cta > p {
    max-width: 210px;
    margin: 0 0 20px;
    color: #3e352a;
    font-size: 17px;
    font-weight: 580;
    letter-spacing: -.3px;
    line-height: 1.23;
  }

  .rc-pricing-card-cta > small {
    margin-top: 15px;
    color: #776c60;
    font-size: 9.5px;
  }

  .rc-faq-section {
    padding-top: 152px;
    padding-bottom: 150px;
  }

  .rc-faq-shell {
    display: grid;
    grid-template-columns: minmax(270px, .75fr) minmax(0, 1.25fr);
    gap: clamp(50px, 9vw, 130px);
    align-items: start;
  }

  .rc-faq-intro {
    position: sticky;
    top: 105px;
  }

  .rc-faq-intro p {
    margin: 17px 0 0;
    color: #6b655e;
    font-size: 14px;
    line-height: 1.55;
  }

  .rc-faq-list {
    overflow: hidden;
    border-radius: 14px;
  }

  .rc-faq-item {
    border-bottom: 1px solid rgba(37,31,23,.08);
  }

  .rc-faq-item:last-child {
    border-bottom: 0;
  }

  .rc-faq-item > button {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 20px;
    width: 100%;
    padding: 20px 21px;
    border: 0;
    background: transparent;
    color: #2e2a24;
    font-size: 14px;
    font-weight: 570;
    letter-spacing: -.16px;
    text-align: left;
    cursor: pointer;
  }

  .rc-faq-item > button > i {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    width: 24px;
    height: 24px;
    border: 1px solid rgba(37,31,23,.08);
    border-radius: 6px;
    background: rgba(255,255,255,.52);
    color: #736c63;
    font-style: normal;
    transition: color 180ms ease, background 180ms ease, transform 220ms var(--rc-ease);
  }

  .rc-faq-item-open > button > i {
    background: #292621;
    color: white;
    transform: rotate(180deg);
  }

  .rc-faq-answer {
    max-height: 0;
    overflow: hidden;
    transition: max-height 350ms var(--rc-ease);
  }

  .rc-faq-item-open .rc-faq-answer {
    max-height: 220px;
  }

  .rc-faq-answer p {
    max-width: 680px;
    margin: 0;
    padding: 0 64px 21px 21px;
    color: #6a635b;
    font-size: 13px;
    font-weight: 420;
    letter-spacing: -.1px;
    line-height: 1.62;
  }

  .rc-final-section {
    overflow: hidden;
    padding: 140px 0 145px;
    background: #151411;
  }

  .rc-final-aura {
    position: absolute;
    border-radius: 50%;
    filter: blur(24px);
    opacity: .7;
  }

  .rc-final-aura-one {
    top: -220px;
    left: -100px;
    width: 550px;
    height: 550px;
    background: radial-gradient(circle, rgba(196,116,31,.34), transparent 67%);
    transform: translate3d(calc(var(--rc-scroll) * .025), calc(var(--rc-scroll) * -.014), 0);
  }

  .rc-final-aura-two {
    right: -170px;
    bottom: -220px;
    width: 600px;
    height: 600px;
    background: radial-gradient(circle, rgba(49,140,130,.23), transparent 67%);
    transform: translate3d(calc(var(--rc-scroll) * -.035), calc(var(--rc-scroll) * -.01), 0);
  }

  .rc-final-shell {
    position: relative;
    z-index: 2;
    text-align: center;
  }

  .rc-final-kicker {
    justify-content: center;
    color: rgba(248,246,240,.57);
  }

  .rc-final-kicker > span {
    background: #d5903f;
    box-shadow: 0 0 0 4px rgba(213,144,63,.12);
  }

  .rc-final-section h2 {
    margin-top: 25px;
    color: #f9f8f4;
    font-size: clamp(47px, 6vw, 78px);
  }

  .rc-final-section h2 em {
    color: rgba(248,246,240,.49);
  }

  .rc-final-section p {
    max-width: 515px;
    margin: 25px auto 0;
    color: rgba(248,246,240,.62);
    font-size: 17px;
    font-weight: 410;
    letter-spacing: -.16px;
    line-height: 1.6;
  }

  .rc-final-actions {
    justify-content: center;
    margin-top: 35px;
  }

  .rc-button-light {
    background: #f9f8f4;
    color: #1c1a17;
    box-shadow: inset 0 1px 0 #fff, 0 9px 21px rgba(0,0,0,.2);
  }

  .rc-button-light:hover {
    background: #fff;
    box-shadow: inset 0 1px 0 #fff, 0 14px 27px rgba(0,0,0,.28);
  }

  .rc-button-dark-glass {
    border-color: rgba(255,255,255,.16);
    background: rgba(255,255,255,.07);
    color: #f8f7f3;
    backdrop-filter: blur(14px);
    -webkit-backdrop-filter: blur(14px);
  }

  .rc-button-dark-glass:hover {
    border-color: rgba(255,255,255,.25);
    background: rgba(255,255,255,.12);
  }

  .rc-footer {
    padding: 64px 0 30px;
    background: #11110f;
    color: #f7f5ef;
  }

  .rc-footer-top {
    display: grid;
    grid-template-columns: 1.35fr 1fr;
    gap: 70px;
  }

  .rc-footer-brand p {
    max-width: 265px;
    margin: 16px 0 0;
    color: rgba(247,245,239,.48);
    font-size: 13px;
    line-height: 1.56;
    letter-spacing: -.08px;
  }

  .rc-footer-columns {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 25px;
  }

  .rc-footer-columns > div {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }

  .rc-footer-columns span {
    margin-bottom: 4px;
    color: rgba(247,245,239,.38);
    font-size: 9.5px;
    font-weight: 670;
    letter-spacing: .62px;
    text-transform: uppercase;
  }

  .rc-footer-columns a {
    color: rgba(247,245,239,.67);
    font-size: 12px;
    font-weight: 480;
    letter-spacing: -.08px;
    text-decoration: none;
    transition: color 180ms ease;
  }

  .rc-footer-columns a:hover {
    color: #fff;
  }

  .rc-footer-bottom {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 15px;
    margin-top: 63px;
    padding-top: 20px;
    border-top: 1px solid rgba(255,255,255,.09);
    color: rgba(247,245,239,.34);
    font-size: 10.5px;
    letter-spacing: -.04px;
  }

  @keyframes rcWave {
    0%, 100% {
      opacity: .58;
      transform: scaleY(.68);
    }
    50% {
      opacity: 1;
      transform: scaleY(1);
    }
  }

  @keyframes rcPulse {
    0%, 100% {
      opacity: 1;
      transform: scale(1);
    }
    50% {
      opacity: .52;
      transform: scale(1.2);
    }
  }

  @keyframes rcBlink {
    0%, 45% {
      opacity: 1;
    }
    46%, 100% {
      opacity: 0;
    }
  }

  @keyframes rcInsight {
    from {
      opacity: 0;
      transform: translateY(-8px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes rcFloatOne {
    0%, 100% {
      transform: translate3d(0, 0, 0) rotate(-2deg);
    }
    50% {
      transform: translate3d(0, -9px, 0) rotate(-1deg);
    }
  }

  @keyframes rcFloatTwo {
    0%, 100% {
      transform: translate3d(0, 0, 0) rotate(2deg);
    }
    50% {
      transform: translate3d(0, 8px, 0) rotate(1deg);
    }
  }

  @keyframes rcPanelIn {
    from {
      opacity: 0;
      transform: translate3d(0, 8px, 0);
    }
    to {
      opacity: 1;
      transform: translate3d(0, 0, 0);
    }
  }

  @keyframes rcDot {
    0%, 100% {
      opacity: .28;
      transform: scale(.75);
    }
    50% {
      opacity: 1;
      transform: scale(1);
    }
  }

  @media (max-width: 1120px) {
    .rc-hero-shell {
      grid-template-columns: minmax(0, .88fr) minmax(500px, 1.12fr);
      gap: 35px;
    }

    .rc-hero-product-wrap {
      min-height: 515px;
    }

    .rc-product-app {
      grid-template-columns: 47px minmax(0, 1.3fr) minmax(175px, .7fr);
    }

    .rc-product-main,
    .rc-product-ai {
      padding-left: 13px;
      padding-right: 13px;
    }

    .rc-float-card-recording {
      left: -14px;
    }

    .rc-float-card-decision {
      right: -16px;
    }

    .rc-section-heading {
      gap: 35px;
    }

    .rc-feature-card-signal,
    .rc-feature-card-search,
    .rc-feature-card-calendar {
      min-height: 275px;
    }

    .rc-feature-card-copy {
      width: 52%;
    }

    .rc-feature-signal,
    .rc-feature-search,
    .rc-feature-calendar {
      right: 15px;
      width: 39%;
      min-width: 185px;
    }
  }

  @media (max-width: 960px) {
    .rc-nav-links,
    .rc-nav-actions {
      display: none;
    }

    .rc-mobile-trigger,
    .rc-mobile-sheet {
      display: flex;
    }

    .rc-hero {
      padding-top: 130px;
    }

    .rc-hero-shell {
      grid-template-columns: 1fr;
      gap: 46px;
    }

    .rc-hero-copy {
      max-width: 700px;
    }

    .rc-hero-description {
      max-width: 620px;
    }

    .rc-hero-product-wrap {
      max-width: 790px;
      min-height: 552px;
      margin: 0 auto;
    }

    .rc-problem-grid,
    .rc-ask-layout,
    .rc-workflow-layout {
      grid-template-columns: 1fr;
    }

    .rc-problem-copy,
    .rc-ask-copy,
    .rc-workflow-copy {
      max-width: 650px;
    }

    .rc-problem-copy p,
    .rc-workflow-copy > p,
    .rc-ask-copy > p {
      max-width: 610px;
    }

    .rc-leak-visual {
      max-width: 720px;
    }

    .rc-section-heading {
      display: block;
    }

    .rc-section-heading > p {
      max-width: 590px;
      margin-top: 18px;
    }

    .rc-meeting-window-content {
      grid-template-columns: minmax(0, 1fr) 220px;
    }

    .rc-feature-bento {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }

    .rc-feature-bento > .rc-bento-cell:nth-child(8) {
      grid-column: span 2;
    }

    .rc-faq-shell {
      grid-template-columns: 1fr;
      gap: 38px;
    }

    .rc-faq-intro {
      position: static;
    }

    .rc-footer-top {
      grid-template-columns: 1fr;
      gap: 47px;
    }
  }

  @media (max-width: 720px) {
    .rc-nav-inner,
    .rc-section-shell {
      width: min(100% - 36px, 1240px);
    }

    .rc-nav {
      height: 63px;
    }

    .rc-hero {
      padding: 111px 0 66px;
    }

    .rc-hero h1 {
      margin-top: 20px;
      font-size: clamp(42px, 12vw, 59px);
      letter-spacing: -2.2px;
    }

    .rc-hero h1 em,
    .rc-section h2 span,
    .rc-final-section h2 em {
      letter-spacing: -2.4px;
    }

    .rc-hero-description {
      margin-top: 23px;
      font-size: 15.5px;
    }

    .rc-hero-actions {
      margin-top: 28px;
    }

    .rc-hero-actions .rc-button {
      flex: 1;
    }

    .rc-hero-product-wrap {
      min-height: auto;
      padding: 18px 0 33px;
    }

    .rc-product-app {
      grid-template-columns: minmax(0, 1fr);
    }

    .rc-product-sidebar {
      display: none;
    }

    .rc-product-main {
      padding: 17px 15px 0;
      border-right: 0;
    }

    .rc-product-ai {
      display: none;
    }

    .rc-float-card {
      display: none;
    }

    .rc-orbit {
      display: none;
    }

    .rc-product-transcript {
      gap: 12px;
      padding-bottom: 16px;
    }

    .rc-product-segment:nth-child(3) {
      display: none;
    }

    .rc-trust-strip {
      padding: 26px 0;
    }

    .rc-trust-inner {
      display: block;
    }

    .rc-trust-inner > p {
      margin-bottom: 18px;
      font-size: 13px;
      line-height: 1.45;
    }

    .rc-trust-roles {
      justify-content: flex-start;
      gap: 9px 15px;
    }

    .rc-section {
      padding: 92px 0;
    }

    .rc-problem-section {
      padding-top: 106px;
    }

    .rc-problem-copy h2,
    .rc-section-heading h2,
    .rc-how-intro h2,
    .rc-ask-copy h2,
    .rc-workflow-copy h2,
    .rc-pricing-intro h2,
    .rc-faq-intro h2 {
      font-size: clamp(34px, 10vw, 45px);
      letter-spacing: -1.65px;
    }

    .rc-problem-copy p,
    .rc-workflow-copy > p,
    .rc-ask-copy > p {
      font-size: 15px;
    }

    .rc-leak-visual {
      min-height: 325px;
      border-radius: 14px;
    }

    .rc-leak-meeting-card-main {
      top: 47px;
      left: 8%;
      width: 194px;
    }

    .rc-leak-meeting-card-small {
      right: 4%;
      bottom: 33px;
      width: 155px;
    }

    .rc-leak-fading-note-three,
    .rc-leak-fading-note-two {
      display: none;
    }

    .rc-leak-pulse {
      width: 58px;
      height: 58px;
    }

    .rc-leak-pulse::before {
      width: 93px;
      height: 93px;
    }

    .rc-leak-pulse::after {
      width: 132px;
      height: 132px;
    }

    .rc-problem-stages {
      grid-template-columns: repeat(2, 1fr);
      margin-top: 62px;
    }

    .rc-stage {
      min-height: 146px;
      padding: 20px 16px;
      border-bottom: 1px solid rgba(30,27,22,.075);
    }

    .rc-stage:first-child {
      padding-left: 16px;
    }

    .rc-stage:nth-child(2n) {
      border-right: 0;
    }

    .rc-stage:last-child {
      grid-column: span 2;
      border-bottom: 0;
    }

    .rc-stage > span {
      margin-bottom: 23px;
    }

    .rc-product-section {
      padding-top: 90px;
    }

    .rc-section-heading {
      margin-bottom: 36px;
    }

    .rc-meeting-window {
      border-radius: 13px;
    }

    .rc-meeting-window-top {
      display: flex;
      min-height: auto;
      padding: 15px;
    }

    .rc-window-controls-muted,
    .rc-share-button {
      display: none;
    }

    .rc-meeting-window-title {
      width: 100%;
    }

    .rc-meeting-window-content {
      grid-template-columns: 1fr;
    }

    .rc-meeting-main-content {
      padding: 19px 15px;
      border-right: 0;
    }

    .rc-meeting-sidebar {
      padding: 18px 15px;
      border-top: 1px solid rgba(30,27,22,.07);
    }

    .rc-side-section {
      margin-bottom: 19px;
    }

    .rc-side-section:last-child {
      display: none;
    }

    .rc-participant-list {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 8px;
    }

    .rc-summary-stat-grid {
      grid-template-columns: 1fr;
    }

    .rc-summary-thread > div {
      flex-wrap: wrap;
      gap: 5px;
    }

    .rc-summary-thread b {
      display: none;
    }

    .rc-decision-item {
      grid-template-columns: 18px 29px minmax(0,1fr);
      gap: 8px;
      padding: 12px;
    }

    .rc-decision-item p {
      font-size: 12.5px;
    }

    .rc-how-section {
      padding-top: 93px;
    }

    .rc-how-path {
      grid-template-columns: 1fr;
      margin-top: 37px;
    }

    .rc-how-path-line {
      top: 30px;
      left: 45px;
      width: 1px;
      height: calc(100% - 57px);
      background: linear-gradient(#bf7a31, #7fb4aa 35%, #8f7abd 68%, #bd7d91);
    }

    .rc-how-step {
      min-height: auto;
      padding: 22px;
    }

    .rc-how-step h3 {
      margin-top: 31px;
    }

    .rc-how-bottom-note {
      align-items: flex-start;
      margin-top: 17px;
      font-size: 12px;
      line-height: 1.45;
    }

    .rc-feature-bento {
      grid-template-columns: 1fr;
    }

    .rc-bento-wide,
    .rc-feature-bento > .rc-bento-cell:nth-child(8) {
      grid-column: span 1;
    }

    .rc-feature-card,
    .rc-feature-card-small {
      min-height: 220px;
      padding: 22px;
    }

    .rc-feature-card-signal,
    .rc-feature-card-search,
    .rc-feature-card-calendar {
      display: block;
      min-height: 355px;
    }

    .rc-feature-card-copy {
      width: 100%;
    }

    .rc-feature-signal,
    .rc-feature-search,
    .rc-feature-calendar {
      right: 15px;
      bottom: 15px;
      width: calc(100% - 30px);
      min-width: 0;
      height: 158px;
    }

    .rc-feature-calendar-events {
      height: 103px;
    }

    .rc-feature-footer {
      align-items: flex-start;
      flex-direction: column;
      margin-top: 19px;
      padding-top: 18px;
    }

    .rc-ask-content {
      min-height: 425px;
      padding: 16px;
    }

    .rc-question-bubble {
      max-width: 94%;
    }

    .rc-ask-window {
      border-radius: 13px;
    }

    .rc-ask-principles {
      margin-top: 25px;
    }

    .rc-workflow-calendar {
      border-radius: 13px;
    }

    .rc-calendar-head {
      padding: 17px;
    }

    .rc-calendar-event {
      grid-template-columns: 40px 3px minmax(0,1fr);
      gap: 8px;
      padding: 10px 8px;
    }

    .rc-calendar-event-state {
      display: none;
    }

    .rc-calendar-preview {
      align-items: flex-start;
      flex-direction: column;
    }

    .rc-calendar-preview-tags {
      justify-content: flex-start;
    }

    .rc-actions-heading {
      margin-bottom: 36px;
    }

    .rc-task-board {
      border-radius: 13px;
    }

    .rc-task-board-head {
      align-items: flex-start;
      padding: 20px 17px;
    }

    .rc-task-count {
      display: none;
    }

    .rc-task-list {
      padding: 5px;
    }

    .rc-board-task {
      grid-template-columns: 20px minmax(0,1fr) auto;
      gap: 10px;
      padding: 14px 10px;
    }

    .rc-board-task-owner {
      grid-column: 2;
      margin-top: -4px;
    }

    .rc-board-task-due {
      grid-column: 3;
      grid-row: 1;
    }

    .rc-task-board-footer {
      align-items: flex-start;
      flex-direction: column;
      padding: 14px 16px;
    }

    .rc-privacy-panel {
      padding: 33px 22px 22px;
      border-radius: 14px;
    }

    .rc-privacy-copy h2 {
      font-size: clamp(33px, 10vw, 44px);
      letter-spacing: -1.5px;
    }

    .rc-privacy-points {
      grid-template-columns: 1fr;
      margin-top: 37px;
    }

    .rc-privacy-point {
      min-height: auto;
    }

    .rc-pricing-section {
      padding-top: 103px;
    }

    .rc-pricing-intro {
      margin-bottom: 36px;
      text-align: left;
    }

    .rc-pricing-intro p {
      margin-left: 0;
    }

    .rc-pricing-card {
      grid-template-columns: 1fr;
      border-radius: 14px;
    }

    .rc-pricing-card-main {
      padding: 25px 20px;
    }

    .rc-pricing-card-main h3 {
      font-size: 28px;
    }

    .rc-pricing-included {
      grid-template-columns: 1fr;
      gap: 10px;
    }

    .rc-pricing-card-cta {
      min-height: 220px;
      padding: 28px 20px;
      border-top: 1px solid rgba(39,33,26,.08);
      border-left: 0;
    }

    .rc-faq-section {
      padding-top: 106px;
      padding-bottom: 98px;
    }

    .rc-faq-item > button {
      padding: 17px 15px;
      font-size: 13px;
    }

    .rc-faq-answer p {
      padding: 0 48px 17px 15px;
      font-size: 12.5px;
    }

    .rc-final-section {
      padding: 100px 0;
    }

    .rc-final-section h2 {
      font-size: clamp(42px, 12vw, 57px);
      letter-spacing: -2.1px;
    }

    .rc-final-section p {
      font-size: 15px;
    }

    .rc-final-actions .rc-button {
      flex: 1;
    }

    .rc-footer {
      padding: 48px 0 23px;
    }

    .rc-footer-columns {
      grid-template-columns: 1fr 1fr;
      gap: 31px 18px;
    }

    .rc-footer-bottom {
      align-items: flex-start;
      flex-direction: column;
      gap: 7px;
      margin-top: 45px;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    *,
    *::before,
    *::after {
      animation-duration: .01ms !important;
      animation-iteration-count: 1 !important;
      scroll-behavior: auto !important;
      transition-duration: .01ms !important;
    }

    .rc-hero-product {
      transform: none !important;
    }
  }
`

export default function LandingPage() {
  useScrollAtmosphere()

  return (
    <>
      <style>{CSS}</style>
      <Atmosphere />
      <Nav />
      <main>
        <Hero />
        <TrustStrip />
        <Problem />
        <ProductShowcase />
        <HowItWorks />
        <Features />
        <AskRecall />
        <CalendarWorkflow />
        <ActionsSection />
        <PrivacySection />
        <Pricing />
        <FAQ />
        <FinalCTA />
      </main>
      <Footer />
    </>
  )
}
