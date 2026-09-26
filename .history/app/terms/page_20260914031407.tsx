'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

const LAST_UPDATED = 'April 14, 2025';

const SECTIONS = [
    { id: 'agreement', title: 'Acceptance' },
    { id: 'definitions', title: 'Definitions' },
    { id: 'accounts', title: 'Accounts' },
    { id: 'acceptable-use', title: 'Acceptable Use' },
    { id: 'ip', title: 'Intellectual Property' },
    { id: 'ai-processing', title: 'AI & Processing' },
    { id: 'google-api', title: 'Google API' },
    { id: 'payments', title: 'Payments' },
    { id: 'disclaimer', title: 'Disclaimer' },
    { id: 'termination', title: 'Termination' },
    { id: 'general', title: 'General' },
    { id: 'contact', title: 'Contact' },
];

export default function TermsOfServicePage() {
    const [activeSection, setActiveSection] = useState('agreement');
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
            const scrollPosition = window.scrollY + 140;
            for (const s of SECTIONS) {
                const el = document.getElementById(s.id);
                if (el) {
                    const top = el.offsetTop;
                    const height = el.offsetHeight;
                    if (scrollPosition >= top && scrollPosition < top + height) {
                        setActiveSection(s.id);
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
            const y = el.getBoundingClientRect().top + window.pageYOffset - 90;
            window.scrollTo({ top: y, behavior: 'smooth' });
        }
    };

    return (
        <>
            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;450;500;550;600;650;700&display=swap');

        .terms-root {
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

        .glass-subtle {
          background: rgba(255, 255, 255, 0.55);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 1px solid rgba(0, 0, 0, 0.05);
        }

        .nav-link {
          transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .nav-link:hover { color: #0071e3; background: rgba(0,113,227,0.05); }
        .nav-link.active { color: #0071e3; font-weight: 550; background: rgba(0,113,227,0.08); }

        .apple-btn-primary {
          background: linear-gradient(180deg, #0077ED 0%, #0071e3 100%);
          color: #fff;
          box-shadow: 0 1px 3px rgba(0,113,227,0.25), inset 0 1px 0 rgba(255,255,255,0.15);
          transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .apple-btn-primary:hover {
          background: linear-gradient(180deg, #0080f7 0%, #0077ED 100%);
          box-shadow: 0 2px 8px rgba(0,113,227,0.35);
          transform: translateY(-1px);
        }

        .apple-btn-secondary {
          background: rgba(0,0,0,0.04);
          color: #1d1d1f;
          border: 1px solid rgba(0,0,0,0.07);
          transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .apple-btn-secondary:hover { background: rgba(0,0,0,0.07); transform: translateY(-1px); }

        .prose h2 {
          font-size: 22px;
          font-weight: 600;
          letter-spacing: -0.015em;
          color: #1d1d1f;
          margin-top: 36px;
          margin-bottom: 14px;
          padding-bottom: 10px;
          border-bottom: 1px solid rgba(0,0,0,0.06);
        }
        .prose h3 {
          font-size: 16px;
          font-weight: 600;
          color: #1d1d1f;
          margin-top: 24px;
          margin-bottom: 8px;
        }
        .prose p, .prose ul > li {
          font-size: 15px;
          line-height: 1.65;
          color: #48484a;
        }
        .prose ul { list-style: disc; padding-left: 20px; margin: 8px 0 16px; }
        .prose li { margin-bottom: 6px; }
        .prose a { color: #0071e3; text-decoration: none; }
        .prose a:hover { text-decoration: underline; }

        .callout {
          background: rgba(0,113,227,0.04);
          border: 1px solid rgba(0,113,227,0.15);
          border-radius: 12px;
          padding: 16px 20px;
          margin: 18px 0;
        }
        .callout-red {
          background: rgba(255,59,48,0.04);
          border-color: rgba(255,59,48,0.15);
        }
        .callout-green {
          background: rgba(52,199,89,0.04);
          border-color: rgba(52,199,89,0.15);
        }

        @media (max-width: 860px) {
          .terms-grid { flex-direction: column !important; }
        }
      `}</style>

            <div className="terms-root">
                <header className="glass-nav fixed top-0 left-0 right-0 z-50 h-16 flex items-center px-6">
                    <div className="max-w-6xl w-full mx-auto flex items-center justify-between">
                        <Link href="/" className="flex items-center gap-2.5 text-[#1d1d1f] no-underline">
                            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#0071e3] to-[#34aadc] flex items-center justify-center shadow-sm">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" /><path d="M19 10v2a7 7 0 0 1-14 0v-2" /><line x1="12" y1="19" x2="12" y2="22" /></svg>
                            </div>
                            <span className="font-semibold tracking-tight text-base">Recall</span>
                        </Link>
                        <div className="flex items-center gap-3">
                            <Link href="/" className="apple-btn-secondary px-3.5 py-1.5 rounded-full text-xs font-medium no-underline">Back to Home</Link>
                            <Link href="/login" className="apple-btn-primary px-4 py-1.5 rounded-full text-xs font-medium no-underline">Open App</Link>
                        </div>
                    </div>
                </header>

                <div className="pt-32 pb-10 px-6">
                    <div className="max-w-6xl mx-auto">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0071e3]/10 border border-[#0071e3]/20 mb-5">
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#0071e3" strokeWidth="2.5"><rect x="3" y="11" width="18" height="10" rx="2" ry="2" /><circle cx="12" cy="5" r="2" /></svg>
                            <span className="text-[11px] font-semibold tracking-wide uppercase text-[#0071e3]">Legal</span>
                        </div>
                        <h1 className="text-3xl md:text-4xl lg:text-[44px] font-semibold tracking-tight text-[#1d1d1f] mb-2 leading-[1.1]">Terms of Service</h1>
                        <p className="text-[#86868b] text-sm md:text-base">Effective date: {LAST_UPDATED} · Binding agreement between you and Recall Inc.</p>
                    </div>
                </div>

                <main className="max-w-6xl mx-auto px-6 pb-28 terms-grid flex gap-10">
                    <aside className="hidden lg:block w-[260px] flex-shrink-0">
                        <div className="sticky top-24 glass-card rounded-2xl p-4">
                            <div className="text-[10px] font-semibold uppercase tracking-[0.06em] text-[#86868b] px-3 mb-3">Sections</div>
                            <nav className="space-y-0.5">
                                {SECTIONS.map(s => (
                                    <button
                                        key={s.id}
                                        onClick={() => scrollTo(s.id)}
                                        className={`nav-link w-full text-left px-3 py-2 rounded-xl text-[13px] ${activeSection === s.id ? 'active' : 'text-[#6e6e73]'}`}
                                    >
                                        {s.title}
                                    </button>
                                ))}
                            </nav>
                        </div>
                    </aside>

                    <article className="glass-card rounded-2xl p-7 md:p-10 lg:p-12 flex-1 prose min-w-0">

                        <section id="agreement">
                            <h2>1. Acceptance of Terms</h2>
                            <p>By accessing, using, or registering for Recall ("the Service"), you agree to be bound by these Terms of Service ("Terms"). If you are using the Service on behalf of an organization, you represent that you have authority to bind that organization and accept these Terms on its behalf.</p>
                            <p>We reserve the right to modify these Terms at any time. Material changes will be notified via email or in-app notice at least 30 days before taking effect, unless required by law or for security reasons. Your continued use after changes become effective constitutes your acceptance.</p>
                            <div className="callout callout-green">
                                <strong className="text-sm text-[#1d1d1f]">Free Plan Notice.</strong><br />
                                <span className="text-xs text-[#48484a]">Recall offers a free plan with core transcription and AI summary capabilities. Paid subscriptions enable advanced analytics and larger team workspaces.</span>
                            </div>
                        </section>

                        <section id="definitions">
                            <h2>2. Definitions</h2>
                            <p>In these Terms:</p>
                            <ul>
                                <li><strong>"Content"</strong> refers to all audio recordings, video inputs, transcripts, notes, tags, conversation metadata, and any AI-generated outputs derived from your data.</li>
                                <li><strong>"AI Outputs"</strong> refers to any synthesized summaries, key takeaways, action items, topic indexes, search results, and answers produced by Recall's AI systems.</li>
                                <li><strong>"Workspace"</strong> refers to your organizational account, team members, shared recordings, and collective settings.</li>
                                <li><strong>"User Data"</strong> refers to information collected from or about you as described in our <Link href="/privacy" className="text-[#0071e3]">Privacy Policy</Link>.</li>
                                <li><strong>"Service"</strong> refers to all Recall software, APIs, integrations, browser extensions, mobile applications, and related infrastructure.</li>
                            </ul>
                        </section>

                        <section id="accounts">
                            <h2>3. Accounts & Access</h2>
                            <p>To use Recall, you must create an account using a valid email address or via Google OAuth authentication through our Supabase identity provider. You represent that you are at least 18 years old and have the legal capacity to enter into these Terms.</p>
                            <p>You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. You agree to notify us immediately of any unauthorized use or breach of security.</p>
                            <div className="callout">
                                <strong>Access Restrictions.</strong> You may not attempt to access Recall using automated means (bots, scrapers, crawlers) without express written consent, or interfere with, disrupt, or create an undue burden on our servers.
                            </div>
                        </section>

                        <section id="acceptable-use">
                            <h2>4. Acceptable Use</h2>
                            <p>You agree to use Recall only for lawful purposes. Specifically:</p>
                            <ul>
                                <li>You must have the legal right, consent, and (where required by applicable law) notice to record any conversation you submit to the Service.</li>
                                <li>You may not use Recall to store, process, or transmit content that violates privacy laws, intellectual property rights, or that is defamatory, obscene, or threatening.</li>
                                <li>You may not reverse-engineer, decompile, or disassemble any part of the Service, including the AI inference pipeline.</li>
                                <li>You may not use Recall outputs to deceive, harm, or impersonate others, including generating synthetic representations of people without consent.</li>
                            </ul>
                        </section>

                        <section id="ip">
                            <h2>5. Intellectual Property</h2>
                            <p><strong>Your Content.</strong> You retain full ownership of your Content and all underlying rights. You grant Recall a non-exclusive, worldwide, royalty-free license to use, reproduce, modify, and display your Content solely to provide, improve, and operate the Service for you.</p>
                            <p><strong>Service IP.</strong> Recall retains all rights, title, and interest in the Service, including software, user interfaces, designs, AI model configurations, algorithms, and branding.</p>
                            <p><strong>AI Outputs.</strong> To the extent permitted by law, you receive a license to use AI Outputs for your internal business purposes. Recall does not claim ownership of AI Outputs, but reserves the right to use aggregated, anonymized, and non-identifiable outputs to improve system performance.</p>
                        </section>

                        <section id="ai-processing">
                            <h2>6. AI & Processing</h2>
                            <p>Recall uses secure, enterprise-grade Large Language Model (LLM) APIs with zero-data-retention policies to synthesize summaries, answer questions, and extract action items. Your transcript context is transmitted securely for inference and is not retained by model providers for future model training.</p>
                            <div className="callout callout-red">
                                <strong>AI Disclaimer — Important.</strong><br />
                                <span className="text-xs text-[#48484a]">AI Outputs are probabilistic and may contain errors, omissions, or inaccurate interpretations. They do not constitute professional advice (legal, medical, financial, or technical). You must review and verify all AI-generated content before relying on it in business or personal decisions.</span>
                            </div>
                            <p>By using Recall's AI features, you acknowledge that processing requires sending conversation context to vetted sub-processors solely for the purpose of generating the requested response.</p>
                        </section>

                        <section id="google-api">
                            <h2>7. Google API & Third-Party Integrations</h2>
                            <p>When you connect your Google Account, Recall accesses calendar and meeting data through Google's APIs solely to support meeting scheduling and automated bot attendance. Our use and transfer of information received from Google APIs will adhere to the <a href="https://developers.google.com/terms/api-services-user-data-policy" target="_blank" rel="noopener noreferrer">Google API Services User Data Policy</a>, including the Limited Use requirements.</p>
                            <p>We do not use Google user data to build advertising profiles, sell data, or develop generalized AI models. You may revoke Recall's access to Google data at any time via your Google Account's third-party apps page.</p>
                            <div className="callout">
                                <strong>Limited Use Disclosure.</strong> Our access is limited to the specific permissions explicitly granted by you during OAuth consent and is strictly necessary for the core calendar and recording features described in our documentation.
                            </div>
                        </section>

                        <section id="payments">
                            <h2>8. Payments & Subscription</h2>
                            <p>Some features of Recall are offered under a free plan with usage limits. Paid subscriptions provide expanded storage, advanced analytics, and team collaboration features.</p>
                            <p>Paid subscriptions are billed in advance on a monthly or annual basis and automatically renew unless cancelled. All fees are non-refundable except where required by applicable consumer protection law. You may upgrade, downgrade, or cancel your subscription at any time through your workspace billing settings.</p>
                        </section>

                        <section id="disclaimer">
                            <h2>9. Disclaimer & Limitation of Liability</h2>
                            <p>The Service is provided on an "AS IS" and "AS AVAILABLE" basis. Recall does not warrant that the Service will be uninterrupted, error-free, or that transcripts will be 100% accurate.</p>
                            <p>To the maximum extent permitted by law, Recall shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising out of or relating to your use of the Service. Recall's total aggregate liability arising from or relating to these Terms or your use of the Service shall not exceed the total amount you paid Recall in the twelve (12) months preceding the claim, or one hundred U.S. dollars ($100) if you are on a free plan.</p>
                            <p>You agree to indemnify, defend, and hold harmless Recall and its affiliates from any claim arising from your violation of these Terms, your misuse of the Service, or your failure to comply with applicable laws.</p>
                        </section>

                        <section id="termination">
                            <h2>10. Termination</h2>
                            <p>You may terminate your account at any time by deleting your workspace through account settings. Upon termination, all licenses granted to you immediately cease, and you must delete any copies of Recall content that you have downloaded or exported.</p>
                            <p>We may suspend or terminate your access if you violate these Terms, engage in fraudulent activity, interfere with our systems, or if required by law. We may also terminate accounts that remain inactive for an extended period.</p>
                        </section>

                        <section id="general">
                            <h2>11. General Provisions</h2>
                            <p><strong>Governing Law.</strong> These Terms and any dispute arising from or relating to them shall be governed by the laws of the State of California, without regard to conflict of law principles.</p>
                            <p><strong>Dispute Resolution.</strong> Any dispute will be resolved exclusively in the state or federal courts located in San Francisco County, California.</p>
                            <p><strong>Severability.</strong> If any provision is held invalid, the remainder shall continue in full force.</p>
                        </section>

                        <section id="contact">
                            <h2>12. Contact & Updates</h2>
                            <p>Questions regarding these Terms should be directed to our legal team:</p>
                            <div className="glass-subtle p-4 rounded-xl mt-3 text-xs leading-relaxed space-y-1">
                                <p><strong className="text-[#1d1d1f]">Recall Inc. — Legal & Compliance</strong></p>
                                <p>Email: <a href="mailto:legal@recall.ai">legal@recall.ai</a> · <a href="mailto:privacy@recall.ai">privacy@recall.ai</a></p>
                                <p>San Francisco, CA, United States</p>
                            </div>
                            <p className="mt-4 text-xs text-[#86868b]">We update our Terms periodically. Review this page regularly to stay informed. Material updates will be announced via email or in-product notification at least 30 days prior to taking effect unless a shorter period is required by law.</p>
                        </section>

                    </article>
                </main>

                <footer className="border-t border-black/5 py-10 px-6 bg-white/50">
                    <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-[#86868b]">
                        <div>© {new Date().getFullYear()} Recall Inc. All rights reserved.</div>
                        <div className="flex items-center gap-6">
                            <Link href="/terms" className="text-[#1d1d1f] font-medium no-underline">Terms of Service</Link>
                            <Link href="/privacy" className="no-underline hover:text-[#1d1d1f]">Privacy Policy</Link>
                            <Link href="/login" className="no-underline hover:text-[#1d1d1f]">Sign In</Link>
                        </div>
                    </div>
                </footer>
            </div>
        </>
    );
}