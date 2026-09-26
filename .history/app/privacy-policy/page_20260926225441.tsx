'use client'

import { useEffect, useRef, useState, useMemo } from 'react'
import Link from 'next/link'
import {
  ArrowLeft, Shield, Clock, Eye, Lock, Database,
  Key, Globe, ChevronRight, CheckCircle2, Mail, Trash2
} from 'lucide-react'

/* ═══════════════════════════════════════════════════════════════════════════
   HOOKS & INTERACTIONS (Ported from Landing Page visual system)
   ═══════════════════════════════════════════════════════════════════════════ */

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

function useActiveSection(sectionIds: string[], offset = 120) {
  const [activeId, setActiveId] = useState(sectionIds[0])

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + offset

      for (const id of sectionIds) {
        const el = document.getElementById(id)
        if (el) {
          const top = el.offsetTop
          const height = el.offsetHeight

          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveId(id)
            break
          }
        }
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [sectionIds, offset])

  return activeId
}

/* ═══════════════════════════════════════════════════════════════════════════
   SCROLL-SHIFTING BACKGROUND
   ═══════════════════════════════════════════════════════════════════════════ */

function ScrollGradientBackground() {
  const progress = useScrollProgress()
  const bg = useMemo(() => {
    const h1 = 170 + progress * 30
    const h2 = 270 + progress * 20
    return {
      c1: `hsla(${h1}, 35%, 90%, 0.45)`,
      c2: `hsla(${h2}, 30%, 92%, 0.35)`,
      x1: 80 - progress * 35,
      y1: 15 + progress * 20,
      x2: 20 + progress * 35,
      y2: 75 - progress * 25,
    }
  }, [progress])

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: -1, pointerEvents: 'none' }}>
      <div style={{
        position: 'absolute', inset: 0,
        background: `
          radial-gradient(ellipse 80% 55% at ${bg.x1}% ${bg.y1}%, ${bg.c1}, transparent 65%),
          radial-gradient(ellipse 65% 45% at ${bg.x2}% ${bg.y2}%, ${bg.c2}, transparent 65%),
          linear-gradient(180deg, #FAF9F7 0%, #F6F5F3 40%, #F3F2EF 70%, #FAF9F7 100%)
        `,
        transition: 'background 50ms linear',
      }} />
      <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.015 }} aria-hidden>
        <defs>
          <pattern id="privacy-grid" width="52" height="52" patternUnits="userSpaceOnUse">
            <path d="M 52 0 L 0 0 0 52" fill="none" stroke="#1C1917" strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#privacy-grid)" />
      </svg>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════════════════
   FLOATING ORBS
   ═══════════════════════════════════════════════════════════════════════════ */

function FloatingOrbs() {
  return (
    <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden', zIndex: -1 }} aria-hidden>
      <div className="rc-orb rc-orb-1" style={{
        position: 'absolute', top: '10%', right: '10%', width: 380, height: 380,
        borderRadius: '50%', background: 'radial-gradient(circle, rgba(15,118,110,0.06), transparent 70%)', filter: 'blur(55px)',
      }} />
      <div className="rc-orb rc-orb-2" style={{
        position: 'absolute', top: '60%', left: '8%', width: 340, height: 340,
        borderRadius: '50%', background: 'radial-gradient(circle, rgba(124,58,237,0.04), transparent 70%)', filter: 'blur(50px)',
      }} />
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════════════════
   LOGO
   ═══════════════════════════════════════════════════════════════════════════ */

function Logo() {
  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 9 }}>
      <div style={{
        width: 30, height: 30, borderRadius: 9,
        background: 'rgba(10,10,10,0.03)', backdropFilter: 'blur(8px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        border: '1px solid rgba(10,10,10,0.06)',
      }}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
          <circle cx="12" cy="12" r="7.5" stroke="#0A0A0A" strokeWidth="1.5" />
          <circle cx="12" cy="12" r="2.5" fill="#0A0A0A" />
          <circle cx="12" cy="12" r="11" stroke="#0A0A0A" strokeWidth="0.5" opacity="0.25" strokeDasharray="2.5 2.5" />
        </svg>
      </div>
      <span style={{ fontSize: 18, fontWeight: 600, color: '#0A0A0A', letterSpacing: '-0.45px' }}>Recall</span>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════════════════
   DATA SECTIONS
   ═══════════════════════════════════════════════════════════════════════════ */

const SECTIONS = [
  { id: 'collection', title: '1. Information We Collect' },
  { id: 'google-use', title: '2. Google OAuth Permissions' },
  { id: 'processing', title: '3. Processing & AI Storage' },
  { id: 'protection', title: '4. Information Security' },
  { id: 'retention', title: '5. Retention & Deletion' },
  { id: 'cookies', title: '6. Cookies & Tracking' },
  { id: 'user-rights', title: '7. Your Privacy Rights' },
  { id: 'contact', title: '8. Contact Security Desk' },
]

/* ═══════════════════════════════════════════════════════════════════════════
   MAIN PAGE EXPORT
   ═══════════════════════════════════════════════════════════════════════════ */

export default function PrivacyPage() {
  const scrollProgress = useScrollProgress()
  const sectionIds = useMemo(() => SECTIONS.map(s => s.id), [])
  const activeSection = useActiveSection(sectionIds)

  const handleScrollTo = (id: string) => {
    const el = document.getElementById(id)
    if (el) {
      const top = el.getBoundingClientRect().top + window.scrollY - 100
      window.scrollTo({ top, behavior: 'smooth' })
    }
  }

  return (
    <>
      <style>{CSS}</style>
      <ScrollGradientBackground />

      {/* Reading Progress Indicator */}
      <div style={{ position: 'fixed', top: 0, left: 0, right: 0, height: 2, zIndex: 200, pointerEvents: 'none' }}>
        <div style={{
          height: '100%', width: `${scrollProgress * 100}%`,
          background: 'linear-gradient(90deg, #0F766E, #B45309, #7C3AED)',
          borderRadius: '0 2px 2px 0',
          transition: 'width 50ms linear',
          boxShadow: '0 0 8px rgba(15,118,110,0.3)',
        }} />
      </div>

      <FloatingOrbs />

      {/* Subnav Navigation Header */}
      <nav className="privacy-nav">
        <div className="privacy-nav-container">
          <Link href="/" className="privacy-logo-link">
            <Logo />
          </Link>
          <Link href="/" className="btn-back-home">
            <ArrowLeft size={14} strokeWidth={2.2} />
            Back to Home
          </Link>
        </div>
      </nav>

      <main className="privacy-root">
        <div className="privacy-grid-layout">
          
          {/* Sticky Sidebar Navigation (ScrollSpy enabled) */}
          <aside className="privacy-sidebar">
            <div className="sidebar-glass-card">
              <div className="sidebar-header">
                <Shield size={16} color="#0F766E" strokeWidth={2.2} />
                <span>Privacy Centre</span>
              </div>
              <ul className="toc-list">
                {SECTIONS.map(s => (
                  <li key={s.id}>
                    <button
                      onClick={() => handleScrollTo(s.id)}
                      className={`toc-link ${activeSection === s.id ? 'active' : ''}`}
                    >
                      <ChevronRight size={11} className="toc-chevron" strokeWidth={2.5} />
                      {s.title}
                    </button>
                  </li>
                ))}
              </ul>
              <div className="sidebar-footer-info">
                <Clock size={12} color="#78716C" />
                <span>Last Updated: Nov 14, 2025</span>
              </div>
            </div>
          </aside>

          {/* Core Text Body */}
          <article className="privacy-content-card">
            
            {/* Title Section */}
            <div className="content-header">
              <span className="section-badge">
                <span className="badge-dot" />
                Confidentiality Blueprint
              </span>
              <h1 className="privacy-title">Privacy Policy</h1>
              <p className="privacy-subtitle">
                At Recall, we believe your conversations belong to you. Explore how we secure and process your meeting data.
              </p>
              
              <div className="meta-box">
                <div className="meta-item">
                  <Clock size={14} color="#0F766E" />
                  <span>Effective Date: September 26, 2026</span>
                </div>
                <div className="meta-item">
                  <Lock size={14} color="#B45309" />
                  <span>Zero Public Model Training</span>
                </div>
              </div>
            </div>

            <hr className="divider" />

            {/* Privacy Sections */}
            <section id="collection" className="content-section">
              <h2>1. Information We Collect</h2>
              <p>
                To provide secure, automated transcriptions and summaries, Recall collects specific types of data points when you interact with the Service:
              </p>
              <ul>
                <li><strong>Account Information:</strong> Your profile data (name, email address, profile photo) collected during Supabase SSO authentication.</li>
                <li><strong>Meeting Content:</strong> Raw audio feeds, screen frames (where applicable), automatic speaker-attributed text strings, structured action logs, and titles generated via meeting integration interfaces.</li>
                <li><strong>Analytics Metadata:</strong> Anonymized application activity patterns, event latency speeds, and client configurations to optimize platform stability.</li>
              </ul>
              <p>
                We strictly limit our metrics gathering to parameters required to maintain optimal software uptime and platform execution.
              </p>
            </section>

            <section id="google-use" className="content-section">
              <h2>2. Google OAuth Permissions & Data Usage</h2>
              <p>
                Recall operates as a verified partner tool requiring explicit Google authorization. We access API metrics solely to automate workspace coordination. Our application of Google integration permissions meets the strict boundaries defined below:
              </p>
              <div className="callout-box">
                <Eye size={16} color="#0F766E" strokeWidth={2.2} />
                <p>
                  <strong>No Data Sale Guarantee:</strong> Recall never licenses, leases, sells, or monetizes any text, calendar data, audio arrays, or user details retrieved via Google OAuth protocols to third-party brokers, advertisement grids, or analytics consortiums.
                </p>
              </div>
              <p>
                Our requests center explicitly on:
              </p>
              <ul>
                <li><strong>https://www.googleapis.com/auth/calendar.readonly:</strong> Used strictly to cross-reference event timings and invite our session recorder ahead of schedule.</li>
                <li><strong>Google Meet Authorization:</strong> Used strictly to map transcripts back to specific virtual meeting environments.</li>
              </ul>
            </section>

            <section id="processing" className="content-section">
              <h2>3. Processing & AI Storage Boundaries</h2>
              <p>
                To deliver structured decisions, summaries, and conversational search indexes, raw text files pass through advanced natural language processing APIs.
              </p>
              <p>
                Our AI architectures adhere to strict security constraints:
              </p>
              <ul>
                <li><strong>Zero Retention Model Training:</strong> Your private conversation history is never fed back into public foundational models. All summaries are computed using closed, zero-data-retention APIs.</li>
                <li><strong>Data Isolation:</strong> All generated meeting documents are indexed on virtual partitions secured behind active Supabase row-level security policies.</li>
              </ul>
            </section>

            <section id="protection" className="content-section">
              <h2>4. Information Security Blueprint</h2>
              <p>
                We protect your data using enterprise-grade infrastructure. All databases are shielded behind robust physical and network barriers:
              </p>
              <ul>
                <li><strong>Encryption in Transit:</strong> All web requests, workspace uploads, and live socket connections are forced through secure HTTPS connections (TLS 1.3 protocol).</li>
                <li><strong>Encryption at Rest:</strong> Transcripts, session audio arrays, and configuration files are fully encrypted at rest using industry-standard AES-256 databases.</li>
                <li><strong>Isolated Row Boundaries:</strong> Your personal data exists on physically or logically separated server parameters. We prevent inter-tenant data leakage by enforcing absolute access keys.</li>
              </ul>
            </section>

            <section id="retention" className="content-section">
              <h2>5. Data Retention & Permanent Deletion</h2>
              <p>
                You retain ultimate authority over how long Recall keeps your records. Our platform enforces automatic scrubbing protocols:
              </p>
              <div className="callout-box warning">
                <Trash2 size={16} color="#B45309" strokeWidth={2.2} />
                <p>
                  <strong>Permanent Scrubbing:</strong> If you elect to delete your workspace or individual records, we permanently scrub all database parameters, transcript cache strings, and linked summaries within 30 days. Action is irreversible.
                </p>
              </div>
              <p>
                We do not maintain background backups of voluntarily deleted recordings once the final queue execution closes.
              </p>
            </section>

            <section id="cookies" className="content-section">
              <h2>6. Cookies & Tracking Protocols</h2>
              <p>
                Recall utilizes small text strings called cookies to evaluate page state and authenticate identity:
              </p>
              <ul>
                <li><strong>Essential Cookies:</strong> Cookies required by our database partner (Supabase) to securely authenticate your credentials and prevent request forgery.</li>
                <li><strong>Performance Metrics:</strong> Lightweight, first-party cookie counters used to measure load delays and asset display performance.</li>
              </ul>
              <p>
                We do not integrate tracking networks, third-party advertising cookies, or behavior profiles that monitor your journey across other sites.
              </p>
            </section>

            <section id="user-rights" className="content-section">
              <h2>7. Your Privacy Rights</h2>
              <p>
                Depending on your geographic location, you possess explicit statutory entitlements under privacy frameworks (such as GDPR, CCPA, or UK DPA):
              </p>
              <ul>
                <li><strong>Right of Portability:</strong> You may export your meeting transcripts, notes, and records in JSON or plain-text layouts directly from your account dashboard.</li>
                <li><strong>Right of Rectification:</strong> You may edit speaker profiles, update meeting titles, and adjust extracted summaries.</li>
                <li><strong>Right to Object:</strong> You can disconnect calendar access instantly via your workspace integration portal, terminating active sync pipelines.</li>
              </ul>
            </section>

            <section id="contact" className="content-section">
              <h2>8. Contact Our Security Desk</h2>
              <p>
                If you have security concerns, compliance questions regarding Google API boundaries, or request custom data agreements, our engineering and privacy office is directly reachable.
              </p>
              <div className="contact-card">
                <div className="contact-icon">
                  <Mail size={18} color="#0F766E" />
                </div>
                <div>
                  <p className="contact-label">Privacy & Security Office</p>
                  <a href="mailto:security@recall.ai" className="contact-link">security@recall.ai</a>
                </div>
              </div>
            </section>

            {/* Bottom Navigation CTAs */}
            <div className="bottom-cta-box">
              <h3>Secure your conversations today</h3>
              <p>Review our framework anytime or request custom compliance paperwork for your team.</p>
              <div className="button-group">
                <Link href="/terms" className="btn-secondary">
                  View Terms of Service
                </Link>
                <Link href="/" className="btn-primary">
                  Acknowledge & Exit
                  <ArrowLeft size={14} style={{ transform: 'rotate(180deg)' }} />
                </Link>
              </div>
            </div>

          </article>
        </div>
      </main>

      {/* Basic Footer */}
      <footer className="simple-footer">
        <div className="footer-content">
          <p>© {new Date().getFullYear()} Recall. All rights reserved.</p>
          <div className="footer-links">
            <Link href="/terms">Terms of Service</Link>
            <span className="dot-divider">·</span>
            <Link href="/">Back to Home</Link>
          </div>
        </div>
      </footer>
    </>
  )
}

/* ═══════════════════════════════════════════════════════════════════════════
   EMBEDDED STYLES (Fully synchronized with landing brand style sheet)
   ═══════════════════════════════════════════════════════════════════════════ */

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;450;500;550;600;700&display=swap');

* { box-sizing: border-box; }

body {
  margin: 0;
  background: #FAF9F7;
  color: #0A0A0A;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'SF Pro Text', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-rendering: optimizeLegibility;
  font-feature-settings: 'ss01', 'cv11';
}

@keyframes rc-float-1 {
  0%, 100% { transform: translate(0,0) scale(1); }
  33% { transform: translate(30px,-20px) scale(1.05); }
  66% { transform: translate(-15px,15px) scale(0.95); }
}
@keyframes rc-float-2 {
  0%, 100% { transform: translate(0,0) scale(1); }
  33% { transform: translate(-25px,25px) scale(1.06); }
  66% { transform: translate(20px,-10px) scale(0.93); }
}
.rc-orb-1 { animation: rc-float-1 24s ease-in-out infinite; }
.rc-orb-2 { animation: rc-float-2 28s ease-in-out infinite; }

/* ─── Navigation Bar ─── */
.privacy-nav {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 60px;
  background: rgba(255, 255, 255, 0.4);
  backdrop-filter: blur(20px) saturate(180%);
  -webkit-backdrop-filter: blur(20px) saturate(180%);
  border-bottom: 1px solid rgba(255, 255, 255, 0.6);
  z-index: 100;
}

.privacy-nav-container {
  max-width: 1200px;
  height: 100%;
  margin: 0 auto;
  padding: 0 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.privacy-logo-link {
  text-decoration: none;
  transition: transform 200ms;
}
.privacy-logo-link:hover {
  transform: scale(1.02);
}

.btn-back-home {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 14px;
  font-size: 13px;
  font-weight: 500;
  color: #44403C;
  text-decoration: none;
  background: rgba(255, 255, 255, 0.5);
  border: 1px solid rgba(255, 255, 255, 0.7);
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.03);
  transition: all 200ms cubic-bezier(0.16, 1, 0.3, 1);
}

.btn-back-home:hover {
  background: #FFFFFF;
  color: #0A0A0A;
  border-color: rgba(10,10,10,0.1);
  transform: translateY(-1px);
}

/* ─── Page Layout ─── */
.privacy-root {
  max-width: 1200px;
  margin: 0 auto;
  padding: 110px 24px 80px;
}

.privacy-grid-layout {
  display: grid;
  grid-template-columns: 280px 1fr;
  gap: 40px;
}

/* ─── Sidebar Table of Contents ─── */
.privacy-sidebar {
  position: sticky;
  top: 100px;
  height: fit-content;
}

.sidebar-glass-card {
  background: rgba(255, 255, 255, 0.45);
  backdrop-filter: blur(24px) saturate(180%);
  -webkit-backdrop-filter: blur(24px) saturate(180%);
  border: 1px solid rgba(255, 255, 255, 0.65);
  border-radius: 16px;
  padding: 24px 20px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.03);
}

.sidebar-header {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 11px;
  font-weight: 650;
  color: #78716C;
  text-transform: uppercase;
  letter-spacing: 1.2px;
  margin-bottom: 20px;
}

.toc-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.toc-link {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 6px;
  background: transparent;
  border: none;
  padding: 8px 10px;
  border-radius: 8px;
  font-size: 13px;
  color: #57534E;
  font-weight: 450;
  text-align: left;
  cursor: pointer;
  transition: all 200ms ease;
  font-family: inherit;
}

.toc-chevron {
  opacity: 0;
  transform: translateX(-4px);
  transition: all 200ms ease;
  color: #0F766E;
}

.toc-link:hover {
  background: rgba(255, 255, 255, 0.5);
  color: #0A0A0A;
}

.toc-link.active {
  background: rgba(255, 255, 255, 0.7);
  color: #0F766E;
  font-weight: 550;
  box-shadow: 0 1px 3px rgba(0,0,0,0.02), 0 0 0 0.5px rgba(255,255,255,0.5) inset;
}

.toc-link.active .toc-chevron {
  opacity: 1;
  transform: none;
}

.sidebar-footer-info {
  margin-top: 24px;
  padding-top: 16px;
  border-top: 1px solid rgba(10,10,10,0.05);
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 11px;
  color: #78716C;
  font-weight: 500;
}

/* ─── Reading Area Card ─── */
.privacy-content-card {
  background: rgba(255, 255, 255, 0.42);
  backdrop-filter: blur(32px) saturate(180%);
  -webkit-backdrop-filter: blur(32px) saturate(180%);
  border: 1px solid rgba(255, 255, 255, 0.6);
  border-radius: 20px;
  padding: 40px 48px;
  box-shadow: 0 8px 32px -8px rgba(0,0,0,0.05);
}

.content-header {
  margin-bottom: 32px;
}

.section-badge {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  font-size: 10.5px;
  color: #78716C;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 1.2px;
  padding: 6px 14px;
  background: rgba(255,255,255,0.6);
  border: 1px solid rgba(255,255,255,0.7);
  border-radius: 100px;
  margin-bottom: 16px;
}

.badge-dot {
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: #0F766E;
  box-shadow: 0 0 6px rgba(15, 118, 110, 0.4);
}

.privacy-title {
  font-size: 36px;
  font-weight: 600;
  color: #0A0A0A;
  letter-spacing: -1.2px;
  margin: 0 0 12px;
}

.privacy-subtitle {
  font-size: 16px;
  color: #57534E;
  line-height: 1.5;
  margin: 0 0 24px;
}

.meta-box {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12.5px;
  font-weight: 500;
  color: #44403C;
}

.divider {
  border: none;
  height: 1px;
  background: rgba(10,10,10,0.06);
  margin: 32px 0;
}

/* ─── Legal Text Details ─── */
.content-section {
  margin-bottom: 44px;
  scroll-margin-top: 100px;
}

.content-section h2 {
  font-size: 20px;
  font-weight: 600;
  color: #0A0A0A;
  letter-spacing: -0.4px;
  margin: 0 0 16px;
}

.content-section p {
  font-size: 14.5px;
  color: #44403C;
  line-height: 1.65;
  margin: 0 0 16px;
  font-weight: 400;
}

.content-section ul {
  padding-left: 20px;
  margin: 0 0 16px;
}

.content-section li {
  font-size: 14.5px;
  color: #44403C;
  line-height: 1.6;
  margin-bottom: 8px;
}

.callout-box {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  background: rgba(15, 118, 110, 0.05);
  border: 1px solid rgba(15, 118, 110, 0.15);
  border-radius: 12px;
  padding: 16px 20px;
  margin: 24px 0;
}

.callout-box.warning {
  background: rgba(180, 83, 9, 0.05);
  border-color: rgba(180, 83, 9, 0.15);
}

.callout-box p {
  font-size: 13.5px;
  line-height: 1.55;
  color: #57534E;
  margin: 0;
}

/* ─── Specific Contact Card ─── */
.contact-card {
  display: flex;
  align-items: center;
  gap: 14px;
  background: rgba(255, 255, 255, 0.45);
  border: 1px solid rgba(255, 255, 255, 0.7);
  border-radius: 12px;
  padding: 16px 20px;
  margin-top: 16px;
}

.contact-icon {
  width: 36px;
  height: 36px;
  border-radius: 8px;
  background: rgba(15, 118, 110, 0.08);
  border: 1px solid rgba(15, 118, 110, 0.15);
  display: flex;
  align-items: center;
  justify-content: center;
}

.contact-label {
  font-size: 13px;
  font-weight: 600;
  color: #0A0A0A;
  margin: 0 0 2px !important;
}

.contact-link {
  font-size: 14px;
  color: #0F766E !important;
  text-decoration: none;
  font-weight: 500;
}

.contact-link:hover {
  text-decoration: underline;
}

/* ─── Bottom Actions card ─── */
.bottom-cta-box {
  background: rgba(255, 255, 255, 0.45);
  border: 1px solid rgba(255, 255, 255, 0.7);
  border-radius: 14px;
  padding: 24px 28px;
  margin-top: 56px;
}

.bottom-cta-box h3 {
  font-size: 16px;
  font-weight: 600;
  color: #0A0A0A;
  margin: 0 0 6px;
}

.bottom-cta-box p {
  font-size: 14px;
  color: #57534E;
  margin: 0 0 18px;
  line-height: 1.5;
}

.button-group {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.btn-primary {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 11px 20px;
  font-size: 13.5px;
  font-weight: 550;
  color: #FAF9F7;
  text-decoration: none;
  background: linear-gradient(135deg, #0A0A0A, #292524);
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  transition: all 200ms cubic-bezier(0.16,1,0.3,1);
}

.btn-primary:hover {
  transform: translateY(-1px);
  box-shadow: 0 6px 16px rgba(0,0,0,0.15);
}

.btn-secondary {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 11px 18px;
  font-size: 13.5px;
  font-weight: 500;
  color: #292524;
  text-decoration: none;
  background: rgba(255, 255, 255, 0.5);
  border: 1px solid rgba(255, 255, 255, 0.7);
  border-radius: 10px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.03);
  transition: all 200ms cubic-bezier(0.16,1,0.3,1);
}

.btn-secondary:hover {
  background: #FFFFFF;
  border-color: rgba(10,10,10,0.1);
  transform: translateY(-1px);
}

/* ─── Footer ─── */
.simple-footer {
  border-top: 1px solid rgba(10,10,10,0.06);
  padding: 32px 24px;
  background: #FAF9F7;
  position: relative;
  z-index: 10;
}

.footer-content {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px;
}

.simple-footer p {
  font-size: 12.5px;
  color: #78716C;
  margin: 0;
}

.footer-links {
  display: flex;
  align-items: center;
  gap: 12px;
}

.footer-links a {
  font-size: 12.5px;
  color: #57534E;
  text-decoration: none;
  transition: color 200ms;
}

.footer-links a:hover {
  color: #0A0A0A;
}

.dot-divider {
  color: #D6D3D1;
}

/* ─── Selection ─── */
::selection {
  background: rgba(15, 118, 110, 0.12);
  color: #0A0A0A;
}

/* ─── Focus ─── */
*:focus-visible {
  outline: 2px solid #0A0A0A;
  outline-offset: 2px;
  border-radius: 4px;
}

/* ─── Responsive Breakdown ─── */
@media (max-width: 900px) {
  .privacy-grid-layout {
    grid-template-columns: 1fr;
    gap: 32px;
  }
  .privacy-sidebar {
    display: none;
  }
  .privacy-content-card {
    padding: 32px 24px;
  }
  .privacy-title {
    font-size: 30px;
  }
}

@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
  html { scroll-behavior: auto; }
  .rc-orb-1, .rc-orb-2 {
    animation: none !important;
  }
}
`