'use client'

import { useEffect, useRef, useState, useMemo } from 'react'
import Link from 'next/link'
import {
  ArrowLeft, Scale, Clock, ShieldCheck, Lock,
  Globe, ChevronRight, FileText, ExternalLink
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
    const h1 = 30 + progress * 20
    const h2 = 170 + progress * 40
    return {
      c1: `hsla(${h1}, 55%, 91%, 0.5)`,
      c2: `hsla(${h2}, 35%, 90%, 0.3)`,
      x1: 15 + progress * 40,
      y1: 8 + progress * 25,
      x2: 85 - progress * 40,
      y2: 55 + progress * 20,
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
          <pattern id="terms-grid" width="52" height="52" patternUnits="userSpaceOnUse">
            <path d="M 52 0 L 0 0 0 52" fill="none" stroke="#1C1917" strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#terms-grid)" />
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
        position: 'absolute', top: '15%', left: '5%', width: 350, height: 350,
        borderRadius: '50%', background: 'radial-gradient(circle, rgba(180,83,9,0.06), transparent 70%)', filter: 'blur(50px)',
      }} />
      <div className="rc-orb rc-orb-2" style={{
        position: 'absolute', top: '55%', right: '5%', width: 400, height: 400,
        borderRadius: '50%', background: 'radial-gradient(circle, rgba(15,118,110,0.05), transparent 70%)', filter: 'blur(60px)',
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
  { id: 'acceptance', title: '1. Acceptance of Terms' },
  { id: 'description', title: '2. Description of Service' },
  { id: 'accounts', title: '3. User Accounts & Security' },
  { id: 'privacy-google', title: '4. Data & Google Permissions' },
  { id: 'proprietary-rights', title: '5. Proprietary Rights' },
  { id: 'prohibited-conduct', title: '6. Prohibited Actions' },
  { id: 'liability', title: '7. Limitation of Liability' },
  { id: 'termination', title: '8. Account Termination' },
]

/* ═══════════════════════════════════════════════════════════════════════════
   MAIN PAGE EXPORT
   ═══════════════════════════════════════════════════════════════════════════ */

export default function TermsPage() {
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
          background: 'linear-gradient(90deg, #B45309, #0F766E, #7C3AED)',
          borderRadius: '0 2px 2px 0',
          transition: 'width 50ms linear',
          boxShadow: '0 0 8px rgba(180,83,9,0.3)',
        }} />
      </div>

      <FloatingOrbs />

      {/* Subnav Navigation Header */}
      <nav className="terms-nav">
        <div className="terms-nav-container">
          <Link href="/" className="terms-logo-link">
            <Logo />
          </Link>
          <Link href="/" className="btn-back-home">
            <ArrowLeft size={14} strokeWidth={2.2} />
            Back to Home
          </Link>
        </div>
      </nav>

      <main className="terms-root">
        <div className="terms-grid-layout">
          
          {/* Sticky Sidebar Navigation (ScrollSpy enabled) */}
          <aside className="terms-sidebar">
            <div className="sidebar-glass-card">
              <div className="sidebar-header">
                <Scale size={16} color="#B45309" strokeWidth={2.2} />
                <span>Documents</span>
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
          <article className="terms-content-card">
            
            {/* Title Section */}
            <div className="content-header">
              <span className="section-badge">
                <span className="badge-dot" />
                Legal Framework
              </span>
              <h1 className="terms-title">Terms of Service</h1>
              <p className="terms-subtitle">
                Please read these terms carefully before deploying or connecting your calendar workspace to Recall.
              </p>
              
              <div className="meta-box">
                <div className="meta-item">
                  <Clock size={14} color="#B45309" />
                  <span>Effective Date: September 26, 2026</span>
                </div>
                <div className="meta-item">
                  <ShieldCheck size={14} color="#0F766E" />
                  <span>Verified Security Standards</span>
                </div>
              </div>
            </div>

            <hr className="divider" />

            {/* Terms Sections */}
            <section id="acceptance" className="content-section">
              <h2>1. Acceptance of Terms</h2>
              <p>
                By creating an account, authenticating via Google OAuth, or using any component of the Recall meeting intelligence platform ("Service"), you agree to be bound by these Terms of Service ("Terms") and our Privacy Policy.
              </p>
              <p>
                If you are entering into these terms on behalf of a company, organization, or other legal entity, you represent that you possess the authority to bind such entity to these commitments. If you do not agree to these Terms, you may not access or use the Service.
              </p>
            </section>

            <section id="description" className="content-section">
              <h2>2. Description of Service</h2>
              <p>
                Recall operates as a secure, automated meeting analysis, transcription, and intelligence tool. It records your meetings, generates transcripts, structures summaries, and enables natural language querying over your collective conversation history.
              </p>
              <p>
                We reserve the right to modify, suspend, or discontinue any aspect of the platform (either globally or for individual workspaces) at any time without prior liability or notice.
              </p>
            </section>

            <section id="accounts" className="content-section">
              <h2>3. User Accounts & Workspace Security</h2>
              <p>
                To utilize the core features of Recall, you must connect an authenticated user identity via Supabase auth integrations. You are entirely responsible for maintaining the privacy and security of your credentials and workspace configurations.
              </p>
              <div className="callout-box">
                <Lock size={16} color="#B45309" strokeWidth={2.2} />
                <p>
                  <strong>Security Guarantee:</strong> Recall staff cannot access your raw meeting logs, transcripts, or credentials. All session tokens and workspace data points are encrypted at rest and isolated inside verified multi-tenant cloud architectures.
                </p>
              </div>
              <p>
                You must immediately notify Recall support of any unauthorized use of your account or any other breach of security that you notice.
              </p>
            </section>

            <section id="privacy-google" className="content-section">
              <h2>4. Data Handling & Google Permissions</h2>
              <p>
                By linking your Google account, the Service requests specific read/write scopes to capture your calendar entries and associate files with Google Meet spaces. 
              </p>
              <p>
                Specifically, Recall requests permissions to:
              </p>
              <ul>
                <li><strong>Google Calendar (.readonly):</strong> To view your timeline of scheduled events and automatically prepare session listeners.</li>
                <li><strong>Google Meet Permissions:</strong> To safely locate and retrieve recording logs associated with your meetings.</li>
              </ul>
              <p>
                Your connected accounts data is exclusively processed to deliver the core Service functions. We do not sell, distribute, or utilize your conversation content to train general public AI/ML models.
              </p>
            </section>

            <section id="proprietary-rights" className="content-section">
              <h2>5. Proprietary Rights & Content Ownership</h2>
              <p>
                Recall does not claim ownership of the media files, voice streams, text transcripts, summaries, or metadata that you upload or capture using our Service ("User Content"). <strong>Your meetings belong entirely to you.</strong>
              </p>
              <p>
                You grant Recall a limited, non-exclusive, royalty-free, worldwide license to process, host, parse, and regenerate your User Content solely to perform the functions of the platform for your authenticated account.
              </p>
              <p>
                The Recall logo, platform architecture, custom visualization UI, visual designs, assets, and software processes are the exclusive intellectual property of Recall.
              </p>
            </section>

            <section id="prohibited-conduct" className="content-section">
              <h2>6. Prohibited Actions</h2>
              <p>
                When using the Service, you agree not to:
              </p>
              <ul>
                <li>Record conversations without the explicit knowledge and legal consent of all participating parties in jurisdictions where consent is legally required.</li>
                <li>Attempt to bypass, reverse engineer, decompile, or break security restrictions guarding the platform's multi-tenant data barriers.</li>
                <li>Impersonate individuals or access another workspace without explicit written authorization.</li>
                <li>Utilize automated crawlers or scripts that burden our API rate limiting boundaries.</li>
              </ul>
            </section>

            <section id="liability" className="content-section">
              <h2>7. Limitation of Liability</h2>
              <p>
                THE SERVICE IS PROVIDED ON AN "AS IS" AND "AS AVAILABLE" BASIS. RECALL EXPRESSLY DISCLAIMS ALL WARRANTIES OF ANY KIND, WHETHER EXPLICIT OR IMPLIED, INCLUDING BUT NOT LIMITED TO MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT.
              </p>
              <p>
                IN NO EVENT SHALL RECALL OR ITS AFFILIATES BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING LOSS OF PROFITS, DATA, USE, GOODWILL, OR OTHER INTANGIBLE LOSSES, RESULTING FROM YOUR ACCESS TO OR INABILITY TO USE THE SERVICE.
              </p>
            </section>

            <section id="termination" className="content-section">
              <h2>8. Account Termination</h2>
              <p>
                You may delete your account and terminate your association with these terms at any time by configuring your account settings or emailing our security desk. Upon deletion, all transcripts, recordings, and cached tokens will be permanently scrubbed from our active cloud databases within 30 days.
              </p>
              <p>
                We reserve the right to temporarily suspend or permanently delete accounts found in explicit violation of Section 6 (Prohibited Actions).
              </p>
            </section>

            {/* Bottom Navigation CTAs */}
            <div className="bottom-cta-box">
              <h3>Have questions about these terms?</h3>
              <p>We believe in absolute transparency. Contact our legal and engineering team for clarification.</p>
              <div className="button-group">
                <a href="mailto:legal@recall.ai" className="btn-secondary">
                  <Globe size={14} />
                  Contact Legal Desk
                </a>
                <Link href="/" className="btn-primary">
                  Accept & Return
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
            <Link href="/privacy-policy">Privacy Policy</Link>
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
.terms-nav {
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

.terms-nav-container {
  max-width: 1200px;
  height: 100%;
  margin: 0 auto;
  padding: 0 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.terms-logo-link {
  text-decoration: none;
  transition: transform 200ms;
}
.terms-logo-link:hover {
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
.terms-root {
  max-width: 1200px;
  margin: 0 auto;
  padding: 110px 24px 80px;
}

.terms-grid-layout {
  display: grid;
  grid-template-columns: 280px 1fr;
  gap: 40px;
}

/* ─── Sidebar Table of Contents ─── */
.terms-sidebar {
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
  color: #B45309;
}

.toc-link:hover {
  background: rgba(255, 255, 255, 0.5);
  color: #0A0A0A;
}

.toc-link.active {
  background: rgba(255, 255, 255, 0.7);
  color: #B45309;
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
.terms-content-card {
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
  background: #B45309;
  box-shadow: 0 0 6px rgba(180, 83, 9, 0.4);
}

.terms-title {
  font-size: 36px;
  font-weight: 600;
  color: #0A0A0A;
  letter-spacing: -1.2px;
  margin: 0 0 12px;
}

.terms-subtitle {
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
  background: rgba(180, 83, 9, 0.05);
  border: 1px solid rgba(180, 83, 9, 0.15);
  border-radius: 12px;
  padding: 16px 20px;
  margin: 24px 0;
}

.callout-box p {
  font-size: 13.5px;
  line-height: 1.55;
  color: #57534E;
  margin: 0;
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
  background: rgba(180, 83, 9, 0.12);
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
  .terms-grid-layout {
    grid-template-columns: 1fr;
    gap: 32px;
  }
  .terms-sidebar {
    display: none;
  }
  .terms-content-card {
    padding: 32px 24px;
  }
  .terms-title {
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