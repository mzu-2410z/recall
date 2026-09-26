'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

const LAST_UPDATED = 'April 14, 2025';

const SECTIONS = [
    { id: 'summary', title: 'Privacy at a Glance' },
    { id: 'collection', title: '1. Information We Collect' },
    { id: 'usage', title: '2. How We Use Information' },
    { id: 'ai-processing', title: '3. AI & LLM Processing' },
    { id: 'google-data', title: '4. Google API Disclosure' },
    { id: 'storage-security', title: '5. Storage & Security' },
    { id: 'retention-deletion', title: '6. Retention & Deletion' },
    { id: 'your-rights', title: '7. Your Rights & Choices' },
    { id: 'contact', title: '8. Contact Us' },
];

export default function PrivacyPolicyPage() {
    const [activeSection, setActiveSection] = useState('summary');
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);

            const scrollPosition = window.scrollY + 140;
            for (const section of SECTIONS) {
                const el = document.getElementById(section.id);
                if (el) {
                    const top = el.offsetTop;
                    const height = el.offsetHeight;
                    if (scrollPosition >= top && scrollPosition < top + height) {
                        setActiveSection(section.id);
                        break;
                    }
                }
            }
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const scrollTo = (id: string) => {
        const el = document.getElementById(id);
        if (el) {
            const yOffset = -90;
            const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
            window.scrollTo({ top: y, behavior: 'smooth' });
        }
    };

    return (
        <>
            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;450;500;550;600;650;700&display=swap');

        .privacy-root {
          font-family: -apple-system, 'Inter', BlinkMacSystemFont, 'SF Pro Display', 'SF Pro Text', 'Helvetica Neue', sans-serif;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
          background: #f5f5f7;
          color: #1d1d1f;
          min-height: 100vh;
        }

        .glass-nav {
          background: ${scrolled ? 'rgba(255, 255, 255, 0.82)' : 'rgba(255, 255, 255, 0.6)'};
          backdrop-filter: blur(30px) saturate(180%);
          -webkit-backdrop-filter: blur(30px) saturate(180%);
          border-bottom: 1px solid rgba(0, 0, 0, ${scrolled ? '0.08' : '0.04'});
          transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .glass-card {
          background: rgba(255, 255, 255, 0.75);
          backdrop-filter: blur(40px) saturate(180%);
          -webkit-backdrop-filter: blur(40px) saturate(180%);
          border: 1px solid rgba(255, 255, 255, 0.9);
          box-shadow: 
            0 0 0 0.5px rgba(0, 0, 0, 0.03),
            0 2px 6px rgba(0, 0, 0, 0.02),
            0 12px 32px rgba(0, 0, 0, 0.04);
        }

        .glass-card-subtle {
          background: rgba(255, 255, 255, 0.5);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 1px solid rgba(0, 0, 0, 0.04);
        }

        .nav-item {
          transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .nav-item:hover {
          color: #0071e3;
          background: rgba(0, 113, 227, 0.05);
        }
        .nav-item.active {
          color: #0071e3;
          font-weight: 550;
          background: rgba(0, 113, 227, 0.08);
        }

        .apple-btn-secondary {
          background: rgba(0, 0, 0, 0.04);
          color: #1d1d1f;
          border: 1px solid rgba(0, 0, 0, 0.06);
          transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .apple-btn-secondary:hover {
          background: rgba(0, 0, 0, 0.07);
          transform: translateY(-1px);
        }

        .apple-btn-primary {
          background: linear-gradient(180deg, #0077ED 0%, #0071e3 100%);
          color: #ffffff;
          box-shadow: 0 1px 3px rgba(0, 113, 227, 0.25);
          transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .apple-btn-primary:hover {
          background: linear-gradient(180deg, #0080f7 0%, #0077ED 100%);
          box-shadow: 0 2px 8px rgba(0, 113, 227, 0.35);
          transform: translateY(-1px);
        }

        .prose-content h2 {
          font-size: 22px;
          font-weight: 600;
          letter-spacing: -0.015em;
          color: #1d1d1f;
          margin-top: 40px;
          margin-bottom: 16px;
          padding-bottom: 10px;
          border-bottom: 1px solid rgba(0, 0, 0, 0.06);
        }

        .prose-content h3 {
          font-size: 16px;
          font-weight: 600;
          color: #1d1d1f;
          margin-top: 24px;
          margin-bottom: 8px;
        }

        .prose-content p, .prose-content li {
          font-size: 15px;
          line-height: 1.65;
          color: #48484a;
        }

        .prose-content ul {
          list-style-type: disc;
          padding-left: 20px;
          margin-top: 8px;
          margin-bottom: 16px;
        }

        .prose-content li {
          margin-bottom: 6px;
        }

        .highlight-box {
          background: rgba(0, 113, 227, 0.04);
          border: 1px solid rgba(0, 113, 227, 0.15);
          border-radius: 12px;
          padding: 16px 20px;
          margin: 20px 0;
        }
      `}</style>

            <div className="privacy-root">
                {/* Navigation */}
                <header className="glass-nav fixed top-0 left-0 right-0 z-50 h-16 flex items-center px-6">
                    <div className="max-w-6xl w-full mx-auto flex items-center justify-between">
                        <Link href="/" className="flex items-center gap-2.5 text-[#1d1d1f] no-underline group">
                            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#0071e3] to-[#34aadc] flex items-center justify-center shadow-sm">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
                                    <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                                    <line x1="12" y1="19" x2="12" y2="22" />
                                </svg>
                            </div>
                            <span className="font-semibold tracking-tight text-base">Recall</span>
                        </Link>

                        <div className="flex items-center gap-3">
                            <Link href="/" className="apple-btn-secondary px-3.5 py-1.5 rounded-full text-xs font-medium no-underline">
                                Back to Home
                            </Link>
                            <Link href="/login" className="apple-btn-primary px-4 py-1.5 rounded-full text-xs font-medium no-underline">
                                Open App
                            </Link>
                        </div>
                    </div>
                </header>

                {/* Hero Section */}
                <div className="pt-32 pb-12 px-6">
                    <div className="max-w-6xl mx-auto">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0071e3]/10 border border-[#0071e3]/20 mb-4">
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#0071e3" strokeWidth="2.5">
                                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                            </svg>
                            <span className="text-[11px] font-semibold tracking-wide uppercase text-[#0071e3]">Trust & Transparency</span>
                        </div>
                        <h1 className="text-3xl md:text-4xl lg:text-5xl font-semibold tracking-tight text-[#1d1d1f] mb-3">
                            Privacy Policy
                        </h1>
                        <p className="text-[#86868b] text-sm md:text-base">
                            Last updated: {LAST_UPDATED} · Effective date: April 14, 2025
                        </p>
                    </div>
                </div>

                {/* Main Content Area */}
                <div className="max-w-6xl mx-auto px-6 pb-24">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                        {/* Sticky Sidebar Navigation */}
                        <aside className="hidden lg:block lg:col-span-4">
                            <div className="sticky top-24 glass-card rounded-2xl p-4">
                                <div className="text-xs font-semibold uppercase tracking-wider text-[#86868b] px-3 mb-2">
                                    Contents
                                </div>
                                <nav className="space-y-1">
                                    {SECTIONS.map((s) => (
                                        <button
                                            key={s.id}
                                            onClick={() => scrollTo(s.id)}
                                            className={`nav-item w-full text-left px-3 py-2 rounded-xl text-xs flex items-center justify-between ${activeSection === s.id ? 'active' : 'text-[#6e6e73]'
                                                }`}
                                        >
                                            <span className="truncate">{s.title}</span>
                                            {activeSection === s.id && (
                                                <div className="w-1.5 h-1.5 rounded-full bg-[#0071e3]" />
                                            )}
                                        </button>
                                    ))}
                                </nav>
                            </div>
                        </aside>

                        {/* Document Body */}
                        <main className="lg:col-span-8 space-y-8">

                            {/* Highlight Cards */}
                            <section id="summary" className="glass-card rounded-2xl p-6 md:p-8">
                                <h2 className="text-lg font-semibold text-[#1d1d1f] mb-4 flex items-center gap-2">
                                    <span className="w-2 h-2 rounded-full bg-[#34c759]" />
                                    Privacy Highlights
                                </h2>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                                    <div className="glass-card-subtle p-4 rounded-xl">
                                        <div className="font-medium text-[#1d1d1f] mb-1">Zero Training on User Data</div>
                                        <div className="text-[#6e6e73] leading-relaxed">
                                            We do not train generative AI foundation models on your meeting audio, notes, or transcripts.
                                        </div>
                                    </div>
                                    <div className="glass-card-subtle p-4 rounded-xl">
                                        <div className="font-medium text-[#1d1d1f] mb-1">Encrypted by Default</div>
                                        <div className="text-[#6e6e73] leading-relaxed">
                                            All data is secured via AES-256 at rest and TLS 1.3 in transit.
                                        </div>
                                    </div>
                                    <div className="glass-card-subtle p-4 rounded-xl">
                                        <div className="font-medium text-[#1d1d1f] mb-1">You Own Your Recordings</div>
                                        <div className="text-[#6e6e73] leading-relaxed">
                                            You can export or permanently delete your transcripts and audio at any time.
                                        </div>
                                    </div>
                                    <div className="glass-card-subtle p-4 rounded-xl">
                                        <div className="font-medium text-[#1d1d1f] mb-1">No Data Reselling</div>
                                        <div className="text-[#6e6e73] leading-relaxed">
                                            We never sell, rent, or monetize your personal conversations or metadata to third parties.
                                        </div>
                                    </div>
                                </div>
                            </section>

                            {/* Prose Sections */}
                            <div className="glass-card rounded-2xl p-6 md:p-10 prose-content">

                                <section id="collection">
                                    <h2>1. Information We Collect</h2>
                                    <p>When you use Recall, we collect information necessary to capture, transcribe, summarize, and retrieve meeting records on your behalf.</p>

                                    <h3>A. Information You Provide</h3>
                                    <ul>
                                        <li><strong>Account Credentials:</strong> Name, email address, and profile photo when authenticating via Google OAuth or Supabase Auth.</li>
                                        <li><strong>Audio & Video Inputs:</strong> Real-time browser audio streams, uploaded recordings, and YouTube audio URLs you submit for processing.</li>
                                        <li><strong>Transcripts & Notes:</strong> Spoken content transcribed by our speech-to-text models and any manual notes or tags you add.</li>
                                    </ul>

                                    <h3>B. Integrated Service Information</h3>
                                    <ul>
                                        <li><strong>Google Calendar Data:</strong> With your permission, we read meeting titles, times, attendees, and Google Meet URLs to allow scheduled captures.</li>
                                    </ul>
                                </section>

                                <section id="usage">
                                    <h2>2. How We Use Information</h2>
                                    <p>We process your data strictly to deliver and improve the Recall service:</p>
                                    <ul>
                                        <li>Generating real-time speech-to-text meeting transcripts.</li>
                                        <li>Synthesizing key decisions, summaries, action items, and topic indexes.</li>
                                        <li>Powering semantic search and conversational queries in "Ask Recall".</li>
                                        <li>Synchronizing meeting schedules and automated bot join links.</li>
                                    </ul>
                                </section>

                                <section id="ai-processing">
                                    <h2>3. AI & LLM Processing</h2>
                                    <div className="highlight-box">
                                        <p className="text-[#0071e3] font-medium mb-1">Our AI Promise</p>
                                        <p className="text-xs text-[#48484a] leading-relaxed m-0">
                                            Recall uses enterprise-grade Large Language Model (LLM) APIs with zero-data-retention (ZDR) agreements. Your raw conversation transcripts are not used by model providers to train or improve their underlying public models.
                                        </p>
                                    </div>
                                    <p>
                                        When processing meeting summaries and questions, your transcript context is securely transmitted to vetted AI sub-processors solely for prompt-completion and immediately purged from memory once the response is delivered.
                                    </p>
                                </section>

                                <section id="google-data">
                                    <h2>4. Google API Limited Use Disclosure</h2>
                                    <p>
                                        Recall’s use and transfer to any other app of information received from Google APIs will adhere to the{' '}
                                        <a
                                            href="https://developers.google.com/terms/api-services-user-data-policy"
                                            target="_blank"
                                            rel="noreferrer"
                                            className="text-[#0071e3] hover:underline"
                                        >
                                            Google API Services User Data Policy
                                        </a>
                                        , including the Limited Use requirements.
                                    </p>
                                    <p>
                                        We only request read-only access to Calendar events and basic profile information. We do not transfer this data to external ad networks or data brokers.
                                    </p>
                                </section>

                                <section id="storage-security">
                                    <h2>5. Storage & Security</h2>
                                    <p>
                                        We apply enterprise-grade safeguards designed to prevent unauthorized access, exposure, or alteration of your recordings:
                                    </p>
                                    <ul>
                                        <li><strong>Encryption:</strong> AES-256 encryption at rest and TLS 1.3 in transit.</li>
                                        <li><strong>Access Controls:</strong> Strict Row-Level Security (RLS) ensuring only authenticated account owners can read their meeting records.</li>
                                        <li><strong>Infrastructure:</strong> Hosted on ISO 27001 and SOC 2 certified cloud infrastructure.</li>
                                    </ul>
                                </section>

                                <section id="retention-deletion">
                                    <h2>6. Retention & Deletion</h2>
                                    <p>
                                        You maintain complete ownership of your data. You may delete individual recordings, transcripts, or your entire account at any point via your workspace settings.
                                    </p>
                                    <p>
                                        Upon account deletion, all associated audio files, transcripts, vector embeddings, and cached answers are permanently purged from our active databases within 30 days.
                                    </p>
                                </section>

                                <section id="your-rights">
                                    <h2>7. Your Rights & Choices</h2>
                                    <p>Depending on your jurisdiction (including GDPR in the EU and CCPA/CPRA in California), you have rights regarding your personal information:</p>
                                    <ul>
                                        <li>The right to access and receive an export of your meeting data.</li>
                                        <li>The right to rectify inaccurate transcripts or profile details.</li>
                                        <li>The right to request immediate erasure of your data.</li>
                                        <li>The right to withdraw OAuth consent at any time through your Google Account settings.</li>
                                    </ul>
                                </section>

                                <section id="contact">
                                    <h2>8. Contact Us</h2>
                                    <p>
                                        If you have questions about this Privacy Policy or wish to exercise your data protection rights, please contact our Data Protection Officer:
                                    </p>
                                    <div className="glass-card-subtle p-4 rounded-xl mt-3 text-xs leading-relaxed">
                                        <p className="font-semibold text-[#1d1d1f] m-0">Recall Privacy & Legal Team</p>
                                        <p className="text-[#6e6e73] m-0">Email: <a href="mailto:privacy@recall.ai" className="text-[#0071e3] hover:underline">privacy@recall.ai</a></p>
                                        <p className="text-[#6e6e73] m-0">San Francisco, CA, United States</p>
                                    </div>
                                </section>

                            </div>
                        </main>
                    </div>
                </div>

                {/* Clean Apple Footer */}
                <footer className="border-t border-black/5 py-10 px-6 bg-white/40">
                    <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#86868b]">
                        <div>© {new Date().getFullYear()} Recall Inc. All rights reserved.</div>
                        <div className="flex items-center gap-6">
                            <Link href="/privacy" className="text-[#1d1d1f] font-medium no-underline">Privacy Policy</Link>
                            <Link href="/terms" className="text-[#86868b] hover:text-[#1d1d1f] no-underline">Terms of Service</Link>
                            <Link href="/login" className="text-[#86868b] hover:text-[#1d1d1f] no-underline">Sign In</Link>
                        </div>
                    </div>
                </footer>
            </div>
        </>
    );
}