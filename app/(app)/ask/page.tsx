'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Sparkles, Send, Search, MessageSquare, Clock, ArrowRight, Bot, User } from 'lucide-react'

interface SourceCitation {
  meetingId: string
  meetingTitle: string
  timestamp: number
  speaker: string
  snippet: string
}

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  sources?: SourceCitation[]
  created_at: string
}

export default function AskPage() {
  const [query, setQuery] = useState('')
  const [loading, setLoading] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Hello! I am Recall AI. Ask me anything across all your meeting transcripts, decisions, action items, or key discussions.',
      created_at: new Date().toISOString()
    }
  ])

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!query.trim() || loading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: query,
      created_at: new Date().toISOString()
    }

    setMessages(prev => [...prev, userMessage])
    const currentQuery = query
    setQuery('')
    setLoading(true)

    try {
      const res = await fetch('/api/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: currentQuery })
      })

      if (!res.ok) throw new Error('Failed to query Recall AI')

      const data = await res.json()
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.answer,
        sources: data.sources || [],
        created_at: new Date().toISOString()
      }

      setMessages(prev => [...prev, assistantMessage])
    } catch (err) {
      console.error('Error querying AI:', err)
      setMessages(prev => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: 'Sorry, I ran into an issue searching your meetings. Please check your Groq API key or try again.',
          created_at: new Date().toISOString()
        }
      ])
    } finally {
      setLoading(false)
    }
  }

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60)
    const s = Math.floor(secs % 60)
    return `${m}:${s.toString().padStart(2, '0')}`
  }

  return (
    <div className="max-w-4xl mx-auto flex flex-col h-[calc(100vh-140px)]">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="rounded-lg bg-cyan-500/10 p-2 text-cyan-400 border border-cyan-500/20">
          <Sparkles className="h-6 w-6" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white">Ask Recall</h1>
          <p className="text-xs text-slate-400">Search and ask questions across your entire organization meeting memory.</p>
        </div>
      </div>

      {/* Chat Conversation Box */}
      <div className="flex-1 overflow-y-auto rounded-xl border border-slate-800 bg-slate-900/60 p-4 space-y-4 backdrop-blur-sm">
        {messages.map(msg => (
          <div
            key={msg.id}
            className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {msg.role === 'assistant' && (
              <div className="h-8 w-8 rounded-full bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center shrink-0 text-cyan-400 mt-1">
                <Bot className="h-4 w-4" />
              </div>
            )}

            <div className={`max-w-2xl rounded-xl p-4 text-xs space-y-3 ${
              msg.role === 'user'
                ? 'bg-cyan-600 text-white rounded-br-none'
                : 'bg-slate-950/80 border border-slate-800 text-slate-200 rounded-bl-none'
            }`}>
              <p className="leading-relaxed whitespace-pre-wrap">{msg.content}</p>

              {/* Sources & Citations */}
              {msg.sources && msg.sources.length > 0 && (
                <div className="pt-3 border-t border-slate-800/80 space-y-2">
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-cyan-400">Cited Sources</p>
                  <div className="grid grid-cols-1 gap-2">
                    {msg.sources.map((src, idx) => (
                      <Link
                        key={idx}
                        href={`/meetings/${src.meetingId}`}
                        className="group flex items-start justify-between rounded-lg border border-slate-800 bg-slate-900 p-2.5 hover:border-cyan-500/40 transition-colors"
                      >
                        <div className="space-y-1">
                          <p className="font-semibold text-slate-200 group-hover:text-cyan-400 flex items-center gap-1.5">
                            <MessageSquare className="h-3 w-3 text-cyan-400" />
                            {src.meetingTitle}
                          </p>
                          <p className="text-[11px] text-slate-400 line-clamp-1 italic">&ldquo;{src.snippet}&rdquo;</p>
                          <p className="text-[10px] text-slate-500">— {src.speaker}</p>
                        </div>
                        <span className="text-[10px] font-mono text-cyan-400 shrink-0 ml-2 bg-cyan-500/10 px-2 py-0.5 rounded">
                          {formatTime(src.timestamp)}
                        </span>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {msg.role === 'user' && (
              <div className="h-8 w-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center shrink-0 text-slate-300 mt-1">
                <User className="h-4 w-4" />
              </div>
            )}
          </div>
        ))}

        {loading && (
          <div className="flex gap-3">
            <div className="h-8 w-8 rounded-full bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center shrink-0 text-cyan-400">
              <Bot className="h-4 w-4 animate-spin" />
            </div>
            <div className="rounded-xl bg-slate-950/80 border border-slate-800 p-4 text-xs text-slate-400 flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-cyan-400 animate-pulse" />
              Searching transcript vector store & synthesizing answer...
            </div>
          </div>
        )}
      </div>

      {/* Query Form Bar */}
      <form onSubmit={handleSend} className="mt-4 flex gap-2">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Ask a question (e.g., 'What was decided about the Q3 budget?')..."
          className="flex-1 rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-cyan-500"
        />
        <button
          type="submit"
          disabled={loading || !query.trim()}
          className="rounded-xl bg-cyan-600 px-5 py-3 text-xs font-semibold text-white hover:bg-cyan-500 transition-colors disabled:opacity-50 flex items-center gap-2"
        >
          <Send className="h-4 w-4" /> Ask
        </button>
      </form>
    </div>
  )
}
