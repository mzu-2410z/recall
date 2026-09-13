'use client'

import { useState } from 'react'
import { ShieldCheck, Key, Settings, Check, Save, Sliders, Zap } from 'lucide-react'

export default function SettingsPage() {
  const [groqApiKey, setGroqApiKey] = useState('')
  const [autoTranscribe, setAutoTranscribe] = useState(true)
  const [defaultTemplate, setDefaultTemplate] = useState('executive')
  const [saved, setSaved] = useState(false)

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  return (
    <div
      className="min-h-screen relative"
      style={{
        background: 'linear-gradient(180deg, #fbfbfd 0%, #f5f5f7 40%, #fbfbfd 100%)',
        fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", "Helvetica Neue", Helvetica, Arial, sans-serif',
      }}
    >
      {/* Ambient washes */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-[25%] -right-[10%] w-[600px] h-[600px] rounded-full bg-gradient-to-bl from-blue-100/25 via-indigo-50/15 to-transparent blur-[100px]" />
        <div className="absolute -bottom-[25%] -left-[10%] w-[500px] h-[500px] rounded-full bg-gradient-to-tr from-teal-100/20 via-cyan-50/10 to-transparent blur-[90px]" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-6 sm:px-8 py-10 sm:py-14">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-[34px] sm:text-[42px] font-semibold text-[#1d1d1f] tracking-[-0.02em] leading-tight">
            Settings
          </h1>
          <p className="text-[17px] text-[#86868b] mt-2 font-normal leading-relaxed">
            Manage integrations, API keys, and recording preferences.
          </p>
        </div>

        <form onSubmit={handleSave} className="space-y-6">
          {/* Groq API Key Section */}
          <section className="relative rounded-[22px] bg-white/70 backdrop-blur-2xl border border-black/[0.04] shadow-[0_1px_3px_rgba(0,0,0,0.04),0_8px_24px_rgba(0,0,0,0.03)] overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50/20 to-transparent pointer-events-none" />
            <div className="relative z-10 p-6 sm:p-7">
              <div className="flex items-start gap-4 mb-5">
                <div className="w-11 h-11 rounded-[14px] bg-gradient-to-b from-[#007AFF] to-[#005EC4] flex items-center justify-center shadow-[0_2px_8px_-2px_rgba(0,122,255,0.35)] flex-shrink-0">
                  <Key className="h-[18px] w-[18px] text-white" strokeWidth={2.2} />
                </div>
                <div className="flex-1 min-w-0">
                  <h2 className="text-[17px] font-semibold text-[#1d1d1f] tracking-tight">Groq API Key</h2>
                  <p className="text-[13px] text-[#86868b] mt-1 font-normal leading-relaxed">
                    Powers Whisper v3 Large transcription and Llama 3.3 70B inference.
                  </p>
                </div>
              </div>

              <div className="space-y-2.5">
                <input
                  type="password"
                  value={groqApiKey}
                  onChange={(e) => setGroqApiKey(e.target.value)}
                  placeholder="gsk_•••••••••••••••••••••••••••"
                  className="w-full rounded-[14px] bg-[#f5f5f7] border border-black/[0.04] px-4 py-3 text-[14px] text-[#1d1d1f] placeholder-[#aeaeb2] focus:outline-none focus:bg-white focus:border-[#007AFF]/30 focus:ring-2 focus:ring-[#007AFF]/10 transition-all duration-200"
                  style={{ fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Menlo, monospace' }}
                />
                <p className="text-[12px] text-[#86868b] font-normal leading-relaxed pl-1">
                  Leave blank to use the environment default{' '}
                  <code className="px-1.5 py-0.5 rounded-md bg-[#f5f5f7] border border-black/[0.04] text-[#007AFF] text-[11px]" style={{ fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Menlo, monospace' }}>
                    process.env.GROQ_API_KEY
                  </code>
                </p>
              </div>
            </div>
          </section>

          {/* Integration Status Section */}
          <section className="relative rounded-[22px] bg-white/70 backdrop-blur-2xl border border-black/[0.04] shadow-[0_1px_3px_rgba(0,0,0,0.04),0_8px_24px_rgba(0,0,0,0.03)] overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-green-50/20 to-transparent pointer-events-none" />
            <div className="relative z-10 p-6 sm:p-7">
              <div className="flex items-start gap-4 mb-5">
                <div className="w-11 h-11 rounded-[14px] bg-gradient-to-b from-[#34C759] to-[#248A3D] flex items-center justify-center shadow-[0_2px_8px_-2px_rgba(52,199,89,0.35)] flex-shrink-0">
                  <ShieldCheck className="h-[18px] w-[18px] text-white" strokeWidth={2.2} />
                </div>
                <div className="flex-1 min-w-0">
                  <h2 className="text-[17px] font-semibold text-[#1d1d1f] tracking-tight">Connected Services</h2>
                  <p className="text-[13px] text-[#86868b] mt-1 font-normal leading-relaxed">
                    Google OAuth, storage, and database integrations.
                  </p>
                </div>
              </div>

              <div className="rounded-[14px] bg-[#f5f5f7]/60 border border-black/[0.03] overflow-hidden divide-y divide-black/[0.04]">
                {[
                  { name: 'Google Calendar API', desc: 'Event sync and meeting discovery' },
                  { name: 'Google Meet API v2', desc: 'Direct meeting integration' },
                  { name: 'Supabase Storage', desc: 'Recording file storage bucket' },
                  { name: 'PostgreSQL Vector', desc: 'Semantic search embeddings' },
                ].map((service) => (
                  <div key={service.name} className="flex items-center justify-between px-4 py-3.5">
                    <div className="min-w-0">
                      <p className="text-[14px] font-medium text-[#1d1d1f] tracking-tight">{service.name}</p>
                      <p className="text-[12px] text-[#86868b] mt-0.5 font-normal">{service.desc}</p>
                    </div>
                    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#34C759]/10 border border-[#34C759]/15">
                      <span className="relative flex h-1.5 w-1.5">
                        <span className="absolute inline-flex h-full w-full rounded-full bg-[#34C759] opacity-60 animate-ping" />
                        <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[#34C759]" />
                      </span>
                      <span className="text-[11px] font-semibold text-[#248A3D] tracking-tight">Active</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Preferences Section */}
          <section className="relative rounded-[22px] bg-white/70 backdrop-blur-2xl border border-black/[0.04] shadow-[0_1px_3px_rgba(0,0,0,0.04),0_8px_24px_rgba(0,0,0,0.03)] overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-50/20 to-transparent pointer-events-none" />
            <div className="relative z-10 p-6 sm:p-7">
              <div className="flex items-start gap-4 mb-5">
                <div className="w-11 h-11 rounded-[14px] bg-gradient-to-b from-[#AF52DE] to-[#8944AB] flex items-center justify-center shadow-[0_2px_8px_-2px_rgba(175,82,222,0.35)] flex-shrink-0">
                  <Sliders className="h-[18px] w-[18px] text-white" strokeWidth={2.2} />
                </div>
                <div className="flex-1 min-w-0">
                  <h2 className="text-[17px] font-semibold text-[#1d1d1f] tracking-tight">Recording & AI Preferences</h2>
                  <p className="text-[13px] text-[#86868b] mt-1 font-normal leading-relaxed">
                    Default behaviors when processing new meetings.
                  </p>
                </div>
              </div>

              <div className="rounded-[14px] bg-[#f5f5f7]/60 border border-black/[0.03] divide-y divide-black/[0.04]">
                {/* Default template row */}
                <div className="px-4 py-4">
                  <label className="block text-[14px] font-medium text-[#1d1d1f] mb-2 tracking-tight">
                    Default summary template
                  </label>
                  <div className="relative">
                    <select
                      value={defaultTemplate}
                      onChange={(e) => setDefaultTemplate(e.target.value)}
                      className="w-full appearance-none rounded-[10px] bg-white border border-black/[0.06] px-3.5 py-2.5 pr-9 text-[14px] text-[#1d1d1f] focus:outline-none focus:border-[#007AFF]/30 focus:ring-2 focus:ring-[#007AFF]/10 transition-all duration-200 cursor-pointer"
                    >
                      <option value="executive">Executive Summary — Overview, Decisions, Action Items</option>
                      <option value="sales">Sales Discovery — BANT Framework</option>
                      <option value="one_on_one">1-on-1 — Feedback & Growth</option>
                      <option value="engineering">Engineering — Technical Architecture Sync</option>
                    </select>
                    <svg className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-[#86868b]" width="12" height="12" viewBox="0 0 12 12" fill="none">
                      <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                </div>

                {/* Auto transcribe toggle row */}
                <div className="flex items-center justify-between px-4 py-4 gap-4">
                  <div className="min-w-0 flex-1">
                    <p className="text-[14px] font-medium text-[#1d1d1f] tracking-tight">Automatic transcription</p>
                    <p className="text-[12px] text-[#86868b] mt-0.5 font-normal leading-relaxed">
                      Trigger Groq Whisper immediately after upload completes.
                    </p>
                  </div>
                  {/* iOS-style toggle */}
                  <button
                    type="button"
                    onClick={() => setAutoTranscribe(!autoTranscribe)}
                    className={`relative inline-flex h-[31px] w-[51px] flex-shrink-0 rounded-full transition-colors duration-300 ease-in-out ${autoTranscribe ? 'bg-[#34C759]' : 'bg-[#e9e9ea]'
                      }`}
                    role="switch"
                    aria-checked={autoTranscribe}
                  >
                    <input
                      type="checkbox"
                      checked={autoTranscribe}
                      onChange={(e) => setAutoTranscribe(e.target.value === 'true' ? false : true)}
                      className="sr-only"
                    />
                    <span
                      className={`inline-block h-[27px] w-[27px] transform rounded-full bg-white shadow-[0_3px_8px_rgba(0,0,0,0.15),0_1px_1px_rgba(0,0,0,0.06)] transition-transform duration-300 ease-in-out mt-[2px] ${autoTranscribe ? 'translate-x-[22px]' : 'translate-x-[2px]'
                        }`}
                    />
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* Submit Bar */}
          <div className="sticky bottom-4 z-20">
            <div className="flex items-center justify-between gap-4 rounded-[18px] bg-white/80 backdrop-blur-2xl border border-black/[0.05] shadow-[0_4px_20px_-4px_rgba(0,0,0,0.08)] px-5 py-3">
              <div className="flex-1 min-w-0">
                {saved ? (
                  <span className="flex items-center gap-2 text-[13px] font-semibold text-[#248A3D] animate-in fade-in slide-in-from-left-2 duration-300">
                    <div className="w-6 h-6 rounded-full bg-[#34C759]/10 flex items-center justify-center">
                      <Check className="h-3.5 w-3.5 text-[#34C759]" strokeWidth={3} />
                    </div>
                    Preferences saved successfully
                  </span>
                ) : (
                  <span className="text-[13px] text-[#86868b] font-normal">Changes apply immediately after saving.</span>
                )}
              </div>

              <button
                type="submit"
                className="flex items-center gap-2 rounded-full bg-[#007AFF] hover:bg-[#0071EB] px-6 py-2.5 text-[14px] font-semibold text-white transition-all duration-200 shadow-[0_1px_4px_rgba(0,122,255,0.20)] hover:shadow-[0_4px_16px_-4px_rgba(0,122,255,0.4)] active:scale-[0.97]"
              >
                <Save className="h-4 w-4" strokeWidth={2.2} />
                Save Settings
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}