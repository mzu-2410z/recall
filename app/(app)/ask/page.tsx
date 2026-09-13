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
    <>
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');

        .ask-root {
          font-family: -apple-system, 'Inter', BlinkMacSystemFont, 'SF Pro Display', 'SF Pro Text', 'Helvetica Neue', sans-serif;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
        }

        .chat-container {
          background: rgba(255, 255, 255, 0.45);
          backdrop-filter: blur(40px) saturate(180%);
          -webkit-backdrop-filter: blur(40px) saturate(180%);
          border: 1px solid rgba(255, 255, 255, 0.7);
          box-shadow: 
            0 0 0 0.5px rgba(0, 0, 0, 0.02),
            0 4px 20px rgba(0, 0, 0, 0.03);
        }

        .user-bubble {
          background: linear-gradient(135deg, #0071e3 0%, #0059b3 100%);
          box-shadow: 0 2px 8px rgba(0, 113, 227, 0.15);
          color: #ffffff;
        }

        .assistant-bubble {
          background: rgba(255, 255, 255, 0.85);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.9);
          box-shadow: 
            0 1px 3px rgba(0, 0, 0, 0.02),
            0 4px 12px rgba(0, 0, 0, 0.03);
          color: #1d1d1f;
        }

        .source-card {
          background: rgba(255, 255, 255, 0.6);
          border: 1px solid rgba(0, 0, 0, 0.05);
          box-shadow: 0 1px 2px rgba(0, 0, 0, 0.01);
          transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .source-card:hover {
          background: rgba(255, 255, 255, 0.95);
          border-color: rgba(0, 113, 227, 0.2);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.04);
          transform: translateY(-0.5px);
        }

        .btn-send {
          background: linear-gradient(180deg, #0077ED 0%, #0071e3 100%);
          box-shadow: 0 1px 3px rgba(0, 113, 227, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.15);
          transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .btn-send:hover:not(:disabled) {
          background: linear-gradient(180deg, #0080f7 0%, #0077ED 100%);
          box-shadow: 0 2px 8px rgba(0, 113, 227, 0.35);
        }

        .btn-send:disabled {
          opacity: 0.4;
        }

        .spotlight-input {
          background: rgba(255, 255, 255, 0.8);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 1px solid rgba(0, 0, 0, 0.08);
          box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.02);
          transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .spotlight-input:focus {
          background: #ffffff;
          border-color: rgba(0, 113, 227, 0.4);
          box-shadow: 
            inset 0 1px 2px rgba(0, 0, 0, 0.02),
            0 0 0 3px rgba(0, 113, 227, 0.1);
        }

        .ai-avatar {
          background: linear-gradient(135deg, #5e5ce6 0%, #bf5af2 100%);
          box-shadow: 0 2px 6px rgba(94, 92, 230, 0.2);
        }

        .user-avatar {
          background: #e5e5ea;
          border: 1px solid rgba(0, 0, 0, 0.04);
        }

        /* Customize scrollbars to be ultra subtle */
        .custom-scroll::-webkit-scrollbar {
          width: 5px;
        }
        .custom-scroll::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scroll::-webkit-scrollbar-thumb {
          background: rgba(0, 0, 0, 0.1);
          border-radius: 99px;
        }
        .custom-scroll::-webkit-scrollbar-thumb:hover {
          background: rgba(0, 0, 0, 0.2);
        }
      `}</style>

      <div className="ask-root min-h-screen" style={{ background: 'linear-gradient(180deg, #f5f5f7 0%, #fbfbfd 40%, #f5f5f7 100%)' }}>
        <div className="max-w-4xl mx-auto px-6 py-10 lg:py-14 flex flex-col h-screen max-h-[100vh] space-y-6">

          {/* Header */}
          <div className="flex items-center gap-4 shrink-0">
            <div className="rounded-xl p-3 flex items-center justify-center bg-white border border-black/[0.04] shadow-sm">
              <Sparkles className="h-6 w-6 text-[#0071e3]" />
            </div>
            <div>
              <h1 className="font-semibold tracking-tight" style={{ fontSize: '24px', color: '#1d1d1f', letterSpacing: '-0.01em' }}>
                Ask Recall
              </h1>
              <p className="mt-0.5" style={{ fontSize: '13px', color: '#86868b' }}>
                Search and ask questions across your entire organization meeting memory.
              </p>
            </div>
          </div>

          {/* Chat Conversation Box */}
          <div className="custom-scroll flex-1 overflow-y-auto rounded-2xl chat-container p-6 space-y-5 flex flex-col">
            {messages.map(msg => (
              <div
                key={msg.id}
                className={`flex gap-4 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.role === 'assistant' && (
                  <div className="h-9 w-9 rounded-full ai-avatar flex items-center justify-center shrink-0 text-white">
                    <Bot className="h-5 w-5" />
                  </div>
                )}

                <div
                  className={`max-w-[80%] md:max-w-xl rounded-2xl p-5 space-y-4 ${msg.role === 'user'
                      ? 'user-bubble rounded-tr-sm text-[14px]'
                      : 'assistant-bubble rounded-tl-sm text-[14px]'
                    }`}
                  style={{ lineHeight: '1.5', letterSpacing: '-0.005em' }}
                >
                  <p className="whitespace-pre-wrap">{msg.content}</p>

                  {/* Sources & Citations */}
                  {msg.sources && msg.sources.length > 0 && (
                    <div className="pt-4 border-t border-black/[0.06] space-y-3">
                      <p
                        className="font-semibold uppercase tracking-wider text-[#0071e3]"
                        style={{ fontSize: '11px', letterSpacing: '0.04em' }}
                      >
                        Cited Sources
                      </p>
                      <div className="grid grid-cols-1 gap-2.5">
                        {msg.sources.map((src, idx) => (
                          <Link
                            key={idx}
                            href={`/meetings/${src.meetingId}`}
                            className="source-card group flex items-start justify-between rounded-xl p-3.5 transition-colors"
                          >
                            <div className="space-y-1.5 min-w-0 pr-4">
                              <p className="font-semibold text-[#1d1d1f] group-hover:text-[#0071e3] transition-colors flex items-center gap-1.5 text-[13px] tracking-tight">
                                <MessageSquare className="h-3.5 w-3.5 text-[#0071e3]" />
                                {src.meetingTitle}
                              </p>
                              <p className="text-[12px] text-[#86868b] line-clamp-2 italic pr-2">
                                &ldquo;{src.snippet}&rdquo;
                              </p>
                              <p className="text-[11px] text-[#86868b] font-medium">
                                — {src.speaker}
                              </p>
                            </div>
                            <span
                              className="text-[11px] font-mono text-[#0071e3] shrink-0 bg-[#0071e3]/5 px-2.5 py-1 rounded-full border border-[#0071e3]/10 font-medium"
                            >
                              {formatTime(src.timestamp)}
                            </span>
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {msg.role === 'user' && (
                  <div className="h-9 w-9 rounded-full user-avatar flex items-center justify-center shrink-0 text-[#1d1d1f]">
                    <User className="h-5 w-5 text-[#86868b]" />
                  </div>
                )}
              </div>
            ))}

            {loading && (
              <div className="flex gap-4">
                <div className="h-9 w-9 rounded-full ai-avatar flex items-center justify-center shrink-0 text-white">
                  <Bot className="h-5 w-5 animate-pulse" />
                </div>
                <div className="assistant-bubble rounded-2xl rounded-tl-sm p-5 text-[14px] flex items-center gap-3">
                  <Sparkles className="h-4 w-4 text-[#0071e3] animate-pulse shrink-0" />
                  <span className="text-[#86868b]">Searching transcripts & synthesizing answer...</span>
                </div>
              </div>
            )}
          </div>

          {/* Query Form Bar */}
          <form onSubmit={handleSend} className="shrink-0 flex gap-3">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Ask a question (e.g., 'What was decided about the Q3 budget?')..."
              className="spotlight-input flex-1 rounded-xl px-4.5 py-3.5 text-[14px] text-[#1d1d1f] placeholder-slate-400 outline-none"
            />
            <button
              type="submit"
              disabled={loading || !query.trim()}
              className="btn-send rounded-xl px-6 py-3.5 text-[14px] font-semibold text-white flex items-center gap-2 shrink-0"
            >
              <Send className="h-4 w-4" /> Ask
            </button>
          </form>

        </div>
      </div>
    </>
  )
}