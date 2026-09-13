'use client'

import { useState } from 'react'
import { Sparkles, Plus, Check, Edit2, Trash2, FileText, CheckCircle2 } from 'lucide-react'

interface Template {
  id: string
  name: string
  description: string
  systemPrompt: string
  isDefault?: boolean
  category: 'sales' | 'management' | 'engineering' | 'general'
}

const DEFAULT_TEMPLATES: Template[] = [
  {
    id: '1',
    name: 'Executive Summary',
    description: 'General high-level overview with key points, decisions, and clear action items.',
    category: 'general',
    isDefault: true,
    systemPrompt: 'Extract an executive summary, list of bulleted key points, explicit decisions made, and assigned action items.'
  },
  {
    id: '2',
    name: 'Sales Discovery Call',
    description: 'Extract prospect pain points, budget, authority, timeline, and next steps (BANT).',
    category: 'sales',
    systemPrompt: 'Identify prospect pain points, budget range, decision makers, timeline constraints, objections raised, and agreed next steps.'
  },
  {
    id: '3',
    name: '1-on-1 Sync',
    description: 'Track feedback, career growth discussions, blockers, and personal action items.',
    category: 'management',
    systemPrompt: 'Extract feedback exchanged, current project blockers, career growth topics, and commitments made by manager or report.'
  },
  {
    id: '4',
    name: 'Sprint Planning / Tech Arch',
    description: 'Technical decisions, architecture trade-offs, ticket estimates, and technical debt items.',
    category: 'engineering',
    systemPrompt: 'Extract technical decisions, architecture trade-offs, scope changes, open engineering questions, and task assignments.'
  }
]

export default function TemplatesPage() {
  const [templates, setTemplates] = useState<Template[]>(DEFAULT_TEMPLATES)
  const [selectedTemplate, setSelectedTemplate] = useState<string>('1')
  const [isCreating, setIsCreating] = useState(false)
  const [newName, setNewName] = useState('')
  const [newDesc, setNewDesc] = useState('')
  const [newPrompt, setNewPrompt] = useState('')

  const handleCreateTemplate = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newName.trim() || !newPrompt.trim()) return

    const created: Template = {
      id: Date.now().toString(),
      name: newName,
      description: newDesc,
      systemPrompt: newPrompt,
      category: 'general'
    }

    setTemplates(prev => [...prev, created])
    setNewName('')
    setNewDesc('')
    setNewPrompt('')
    setIsCreating(false)
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Summary & AI Templates</h1>
          <p className="text-xs text-slate-400">Customize how Recall synthesizes meeting notes and action items.</p>
        </div>

        <button
          onClick={() => setIsCreating(!isCreating)}
          className="flex items-center gap-2 rounded-lg bg-cyan-600 px-4 py-2 text-xs font-semibold text-white hover:bg-cyan-500 transition-colors shadow-md"
        >
          <Plus className="h-4 w-4" /> Create Custom Template
        </button>
      </div>

      {/* New Template Form */}
      {isCreating && (
        <form onSubmit={handleCreateTemplate} className="rounded-xl border border-cyan-500/30 bg-slate-900/90 p-5 space-y-4 backdrop-blur-sm">
          <h3 className="text-sm font-semibold text-cyan-400 flex items-center gap-2">
            <Sparkles className="h-4 w-4" /> New AI Summary Template
          </h3>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Template Name</label>
              <input
                type="text"
                required
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="e.g. Board Meeting Brief"
                className="w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-slate-100 focus:outline-none focus:ring-1 focus:ring-cyan-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Short Description</label>
              <input
                type="text"
                value={newDesc}
                onChange={(e) => setNewDesc(e.target.value)}
                placeholder="e.g. Focus on financial metrics and governance"
                className="w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-slate-100 focus:outline-none focus:ring-1 focus:ring-cyan-500"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">Custom Prompt Instructions</label>
            <textarea
              required
              rows={3}
              value={newPrompt}
              onChange={(e) => setNewPrompt(e.target.value)}
              placeholder="Instruct the AI model what specific details to extract..."
              className="w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-slate-100 focus:outline-none focus:ring-1 focus:ring-cyan-500"
            />
          </div>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsCreating(false)}
              className="rounded-lg border border-slate-800 px-3 py-1.5 text-xs text-slate-400 hover:bg-slate-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-lg bg-cyan-600 px-4 py-1.5 text-xs font-semibold text-white hover:bg-cyan-500"
            >
              Save Template
            </button>
          </div>
        </form>
      )}

      {/* Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {templates.map(tmpl => {
          const isSelected = selectedTemplate === tmpl.id
          return (
            <div
              key={tmpl.id}
              onClick={() => setSelectedTemplate(tmpl.id)}
              className={`group cursor-pointer rounded-xl border p-5 transition-all space-y-3 ${
                isSelected
                  ? 'border-cyan-500/50 bg-cyan-500/10 shadow-lg shadow-cyan-500/5'
                  : 'border-slate-800 bg-slate-900/60 hover:border-slate-700'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2.5">
                  <div className={`rounded-lg p-2 ${isSelected ? 'bg-cyan-500 text-slate-950' : 'bg-slate-800 text-slate-300'}`}>
                    <FileText className="h-4 w-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                      {tmpl.name}
                      {tmpl.isDefault && (
                        <span className="rounded-full bg-slate-800 px-2 py-0.5 text-[10px] text-slate-400 font-normal">Default</span>
                      )}
                    </h3>
                    <span className="text-[10px] font-medium text-cyan-400 uppercase tracking-wider">{tmpl.category}</span>
                  </div>
                </div>

                {isSelected && (
                  <CheckCircle2 className="h-5 w-5 text-cyan-400" />
                )}
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">{tmpl.description}</p>

              <div className="rounded-lg bg-slate-950/60 p-3 border border-slate-800/80">
                <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1">Prompt Logic</p>
                <p className="text-[11px] font-mono text-slate-400 line-clamp-2">{tmpl.systemPrompt}</p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
