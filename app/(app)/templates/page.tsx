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

const CATEGORY_STYLES: Record<Template['category'], { gradient: string; label: string }> = {
  general: { gradient: 'linear-gradient(135deg, #0071e3 0%, #2997ff 100%)', label: 'General' },
  sales: { gradient: 'linear-gradient(135deg, #34c759 0%, #30d158 100%)', label: 'Sales' },
  management: { gradient: 'linear-gradient(135deg, #ff9f0a 0%, #ff6723 100%)', label: 'Management' },
  engineering: { gradient: 'linear-gradient(135deg, #5e5ce6 0%, #bf5af2 100%)', label: 'Engineering' },
}

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
    <>
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');

        .templates-root {
          font-family: -apple-system, 'Inter', BlinkMacSystemFont, 'SF Pro Display', 'SF Pro Text', 'Helvetica Neue', sans-serif;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
        }

        .glass-panel {
          background: rgba(255, 255, 255, 0.72);
          backdrop-filter: blur(40px) saturate(180%);
          -webkit-backdrop-filter: blur(40px) saturate(180%);
          border: 1px solid rgba(255, 255, 255, 0.85);
          box-shadow:
            0 0 0 0.5px rgba(0, 0, 0, 0.03),
            0 1px 3px rgba(0, 0, 0, 0.04),
            0 8px 32px rgba(0, 0, 0, 0.06);
        }

        .glass-form {
          background: rgba(255, 255, 255, 0.85);
          backdrop-filter: blur(60px) saturate(200%);
          -webkit-backdrop-filter: blur(60px) saturate(200%);
          border: 1px solid rgba(0, 113, 227, 0.2);
          box-shadow:
            0 0 0 0.5px rgba(0, 0, 0, 0.03),
            0 4px 16px rgba(0, 113, 227, 0.08),
            0 20px 60px rgba(0, 0, 0, 0.08);
        }

        .glass-input {
          background: rgba(255, 255, 255, 0.6);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 1px solid rgba(0, 0, 0, 0.08);
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
          color: #1d1d1f;
        }

        .glass-input::placeholder {
          color: #a1a1a6;
        }

        .glass-input:focus {
          background: rgba(255, 255, 255, 0.9);
          border-color: rgba(0, 113, 227, 0.4);
          box-shadow: 0 0 0 3px rgba(0, 113, 227, 0.1);
          outline: none;
        }

        .apple-btn-primary {
          background: linear-gradient(180deg, #0077ED 0%, #0071e3 100%);
          box-shadow: 0 1px 3px rgba(0, 113, 227, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.15);
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .apple-btn-primary:hover:not(:disabled) {
          background: linear-gradient(180deg, #0080f7 0%, #0077ED 100%);
          box-shadow: 0 2px 8px rgba(0, 113, 227, 0.35), inset 0 1px 0 rgba(255, 255, 255, 0.15);
          transform: translateY(-0.5px);
        }

        .apple-btn-secondary {
          background: rgba(255, 255, 255, 0.7);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 1px solid rgba(0, 0, 0, 0.08);
          color: #1d1d1f;
          transition: all 0.2s ease;
        }

        .apple-btn-secondary:hover {
          background: rgba(255, 255, 255, 0.95);
          border-color: rgba(0, 0, 0, 0.12);
        }

        .template-card {
          background: rgba(255, 255, 255, 0.68);
          backdrop-filter: blur(40px) saturate(180%);
          -webkit-backdrop-filter: blur(40px) saturate(180%);
          border: 1px solid rgba(255, 255, 255, 0.85);
          box-shadow:
            0 0 0 0.5px rgba(0, 0, 0, 0.03),
            0 1px 3px rgba(0, 0, 0, 0.04),
            0 8px 32px rgba(0, 0, 0, 0.05);
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .template-card:hover {
          transform: translateY(-2px);
          box-shadow:
            0 0 0 0.5px rgba(0, 0, 0, 0.03),
            0 4px 12px rgba(0, 0, 0, 0.06),
            0 16px 48px rgba(0, 0, 0, 0.08);
        }

        .template-card-selected {
          background: rgba(255, 255, 255, 0.9);
          border: 1px solid rgba(0, 113, 227, 0.35);
          box-shadow:
            0 0 0 3px rgba(0, 113, 227, 0.08),
            0 4px 16px rgba(0, 113, 227, 0.12),
            0 16px 48px rgba(0, 113, 227, 0.08);
          transform: translateY(-2px);
        }

        .prompt-preview {
          background: rgba(0, 0, 0, 0.025);
          border: 1px solid rgba(0, 0, 0, 0.04);
        }

        .category-badge {
          background: rgba(0, 0, 0, 0.04);
          color: #86868b;
        }

        .form-slide-in {
          animation: slideIn 0.35s cubic-bezier(0.4, 0, 0.2, 1);
        }

        @keyframes slideIn {
          from { opacity: 0; transform: translateY(-8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <div className="templates-root min-h-screen" style={{ background: 'linear-gradient(180deg, #f5f5f7 0%, #fbfbfd 40%, #f5f5f7 100%)' }}>
        <div className="max-w-6xl mx-auto px-6 py-10 lg:py-14 space-y-8">

          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-5">
            <div>
              <h1
                className="font-semibold tracking-tight"
                style={{ fontSize: '34px', lineHeight: '1.1', color: '#1d1d1f', letterSpacing: '-0.015em' }}
              >
                Summary & AI Templates
              </h1>
              <p
                className="mt-2"
                style={{ fontSize: '17px', color: '#86868b', fontWeight: 400, letterSpacing: '-0.005em' }}
              >
                Customize how Recall synthesizes meeting notes and action items.
              </p>
            </div>

            <button
              onClick={() => setIsCreating(!isCreating)}
              className="apple-btn-primary flex items-center gap-2 rounded-full text-white font-semibold self-start sm:self-auto"
              style={{ fontSize: '14px', padding: '10px 20px' }}
            >
              <Plus className="h-4 w-4" />
              Create Custom Template
            </button>
          </div>

          {/* New Template Form */}
          {isCreating && (
            <form onSubmit={handleCreateTemplate} className="glass-form form-slide-in rounded-2xl p-7 space-y-5">
              <div className="flex items-center gap-3">
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center"
                  style={{ background: 'linear-gradient(135deg, #0071e3 0%, #2997ff 100%)' }}
                >
                  <Sparkles className="h-4 w-4 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold" style={{ fontSize: '17px', color: '#1d1d1f', letterSpacing: '-0.01em' }}>
                    New AI Summary Template
                  </h3>
                  <p style={{ fontSize: '13px', color: '#86868b', marginTop: '1px' }}>
                    Define how the AI should structure your meeting notes.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 pt-2">
                <div>
                  <label
                    className="block font-medium mb-2"
                    style={{ fontSize: '13px', color: '#1d1d1f' }}
                  >
                    Template Name
                  </label>
                  <input
                    type="text"
                    required
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    placeholder="e.g. Board Meeting Brief"
                    className="glass-input w-full rounded-xl px-4 py-2.5"
                    style={{ fontSize: '14px' }}
                  />
                </div>
                <div>
                  <label
                    className="block font-medium mb-2"
                    style={{ fontSize: '13px', color: '#1d1d1f' }}
                  >
                    Short Description
                  </label>
                  <input
                    type="text"
                    value={newDesc}
                    onChange={(e) => setNewDesc(e.target.value)}
                    placeholder="e.g. Focus on financial metrics and governance"
                    className="glass-input w-full rounded-xl px-4 py-2.5"
                    style={{ fontSize: '14px' }}
                  />
                </div>
              </div>

              <div>
                <label
                  className="block font-medium mb-2"
                  style={{ fontSize: '13px', color: '#1d1d1f' }}
                >
                  Custom Prompt Instructions
                </label>
                <textarea
                  required
                  rows={4}
                  value={newPrompt}
                  onChange={(e) => setNewPrompt(e.target.value)}
                  placeholder="Instruct the AI model what specific details to extract..."
                  className="glass-input w-full rounded-xl px-4 py-3 resize-none"
                  style={{ fontSize: '14px', lineHeight: '1.5' }}
                />
              </div>

              <div className="flex justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setIsCreating(false)}
                  className="apple-btn-secondary rounded-full font-medium"
                  style={{ fontSize: '14px', padding: '9px 18px' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="apple-btn-primary rounded-full text-white font-semibold"
                  style={{ fontSize: '14px', padding: '9px 20px' }}
                >
                  Save Template
                </button>
              </div>
            </form>
          )}

          {/* Templates Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {templates.map(tmpl => {
              const isSelected = selectedTemplate === tmpl.id
              const categoryStyle = CATEGORY_STYLES[tmpl.category]

              return (
                <div
                  key={tmpl.id}
                  onClick={() => setSelectedTemplate(tmpl.id)}
                  className={`cursor-pointer rounded-2xl p-6 space-y-4 ${isSelected ? 'template-card-selected' : 'template-card'}`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3.5 min-w-0">
                      <div
                        className="w-11 h-11 rounded-2xl flex items-center justify-center flex-shrink-0"
                        style={{
                          background: categoryStyle.gradient,
                          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.2)',
                        }}
                      >
                        <FileText className="h-5 w-5 text-white" />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3
                            className="font-semibold truncate"
                            style={{ fontSize: '17px', color: '#1d1d1f', letterSpacing: '-0.01em' }}
                          >
                            {tmpl.name}
                          </h3>
                          {tmpl.isDefault && (
                            <span
                              className="category-badge rounded-full font-medium"
                              style={{ fontSize: '11px', padding: '2px 8px' }}
                            >
                              Default
                            </span>
                          )}
                        </div>
                        <span
                          className="font-medium"
                          style={{
                            fontSize: '12px',
                            background: categoryStyle.gradient,
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            backgroundClip: 'text',
                            letterSpacing: '0.02em',
                          }}
                        >
                          {categoryStyle.label}
                        </span>
                      </div>
                    </div>

                    {isSelected && (
                      <div
                        className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0"
                        style={{
                          background: 'linear-gradient(180deg, #0077ED 0%, #0071e3 100%)',
                          boxShadow: '0 2px 6px rgba(0, 113, 227, 0.35)',
                        }}
                      >
                        <Check className="h-3.5 w-3.5 text-white" strokeWidth={3} />
                      </div>
                    )}
                  </div>

                  <p style={{ fontSize: '14px', color: '#424245', lineHeight: '1.5' }}>
                    {tmpl.description}
                  </p>

                  <div className="prompt-preview rounded-xl p-3.5">
                    <p
                      className="font-semibold uppercase mb-1.5"
                      style={{ fontSize: '10px', color: '#86868b', letterSpacing: '0.08em' }}
                    >
                      Prompt Logic
                    </p>
                    <p
                      className="line-clamp-2"
                      style={{
                        fontSize: '12px',
                        color: '#6e6e73',
                        lineHeight: '1.5',
                        fontFamily: 'ui-monospace, "SF Mono", Menlo, monospace',
                      }}
                    >
                      {tmpl.systemPrompt}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </>
  )
}