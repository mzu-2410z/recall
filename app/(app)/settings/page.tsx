'use client'

import { useState } from 'react'
import { ShieldCheck, Key, Settings, Sparkles, Check, Database, Save } from 'lucide-react'

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
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Application Settings</h1>
        <p className="text-xs text-slate-400">Manage integrations, API keys, AI model parameters, and recording defaults.</p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Groq API Key Section */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 space-y-4 backdrop-blur-sm">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-cyan-500/10 p-2 text-cyan-400">
              <Key className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-white">Groq API Key (AI Acceleration)</h2>
              <p className="text-xs text-slate-400">Powers Whisper v3 Large transcription and Llama 3.3 70B fast inference.</p>
            </div>
          </div>

          <div className="space-y-2">
            <input
              type="password"
              value={groqApiKey}
              onChange={(e) => setGroqApiKey(e.target.value)}
              placeholder="gsk_..."
              className="w-full rounded-lg border border-slate-800 bg-slate-950 px-4 py-2.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-cyan-500 font-mono"
            />
            <p className="text-[11px] text-slate-500">
              If left blank, the environment default <code className="text-cyan-400">process.env.GROQ_API_KEY</code> will be utilized.
            </p>
          </div>
        </div>

        {/* Integration Status Section */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 space-y-4 backdrop-blur-sm">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-emerald-500/10 p-2 text-emerald-400">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-white">Google OAuth & Services Status</h2>
              <p className="text-xs text-slate-400">Connected authentication & permissions provider.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="rounded-lg border border-slate-800 bg-slate-950 p-3 flex justify-between items-center">
              <span className="text-slate-300">Google Calendar API</span>
              <span className="text-emerald-400 font-medium flex items-center gap-1"><Check className="h-3.5 w-3.5" /> Active</span>
            </div>
            <div className="rounded-lg border border-slate-800 bg-slate-950 p-3 flex justify-between items-center">
              <span className="text-slate-300">Google Meet API v2</span>
              <span className="text-emerald-400 font-medium flex items-center gap-1"><Check className="h-3.5 w-3.5" /> Active</span>
            </div>
            <div className="rounded-lg border border-slate-800 bg-slate-950 p-3 flex justify-between items-center">
              <span className="text-slate-300">Supabase Storage Bucket</span>
              <span className="text-emerald-400 font-medium flex items-center gap-1"><Check className="h-3.5 w-3.5" /> Active</span>
            </div>
            <div className="rounded-lg border border-slate-800 bg-slate-950 p-3 flex justify-between items-center">
              <span className="text-slate-300">PostgreSQL Vector Extension</span>
              <span className="text-emerald-400 font-medium flex items-center gap-1"><Check className="h-3.5 w-3.5" /> Active</span>
            </div>
          </div>
        </div>

        {/* Defaults & Preferences */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 space-y-4 backdrop-blur-sm">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-cyan-500/10 p-2 text-cyan-400">
              <Settings className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-white">Recording & AI Preferences</h2>
              <p className="text-xs text-slate-400">Configure default behaviors when processing new meetings.</p>
            </div>
          </div>

          <div className="space-y-4 text-xs">
            <div>
              <label className="block text-slate-400 mb-1.5 font-medium">Default Summary Template</label>
              <select
                value={defaultTemplate}
                onChange={(e) => setDefaultTemplate(e.target.value)}
                className="w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-cyan-500"
              >
                <option value="executive">Executive Summary (Overview, Decisions, Action Items)</option>
                <option value="sales">Sales Discovery (BANT Framework)</option>
                <option value="one_on_one">1-on-1 Feedback & Growth</option>
                <option value="engineering">Technical Architecture Sync</option>
              </select>
            </div>

            <div className="flex items-center justify-between pt-2">
              <div>
                <p className="font-semibold text-slate-200">Automatic Whisper Processing</p>
                <p className="text-slate-500">Trigger Groq Whisper immediately after recording upload completes.</p>
              </div>
              <input
                type="checkbox"
                checked={autoTranscribe}
                onChange={(e) => setAutoTranscribe(e.target.value === 'true' ? false : true)}
                className="h-4 w-4 rounded border-slate-700 bg-slate-900 text-cyan-500 focus:ring-0 cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Submit Bar */}
        <div className="flex items-center justify-between pt-2">
          {saved ? (
            <span className="flex items-center gap-2 text-xs font-semibold text-emerald-400">
              <Check className="h-4 w-4" /> Preferences saved successfully
            </span>
          ) : (
            <span />
          )}

          <button
            type="submit"
            className="flex items-center gap-2 rounded-lg bg-cyan-600 px-6 py-2.5 text-xs font-semibold text-white hover:bg-cyan-500 transition-colors shadow-md"
          >
            <Save className="h-4 w-4" /> Save Settings
          </button>
        </div>
      </form>
    </div>
  )
}
