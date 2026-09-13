'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import {
  Home, Video, Calendar, Search, Settings,
  MessageSquare, LogOut, Youtube
} from 'lucide-react'
import { useEffect, useState } from 'react'

const NAV_ITEMS = [
  { href: '/dashboard', label: 'Home', icon: Home },
  { href: '/meetings', label: 'Meetings', icon: Video },
  { href: '/calendar', label: 'Calendar', icon: Calendar },
  { href: '/search', label: 'Search', icon: Search },
]

interface Profile {
  full_name: string | null
  avatar_url: string | null
  email: string
}

export default function AppLayoutClient({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()
  const [profile, setProfile] = useState<Profile | null>(null)

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) return
      setProfile({
        full_name: user.user_metadata?.full_name ?? user.user_metadata?.name ?? null,
        avatar_url: user.user_metadata?.avatar_url ?? null,
        email: user.email ?? '',
      })
    })
  }, [])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  return (
    <div className="flex h-screen bg-[#F5F5F7] overflow-hidden">
      {/* Sidebar */}
      <aside className="w-60 flex-shrink-0 bg-white border-r border-black/[0.06] flex flex-col">
        {/* Logo */}
        <div className="px-5 h-[60px] flex items-center border-b border-black/[0.04]">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-[#007AFF] rounded-lg flex items-center justify-center flex-shrink-0">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <circle cx="7" cy="7" r="5" stroke="white" strokeWidth="1.5"/>
                <circle cx="7" cy="7" r="1.75" fill="white"/>
              </svg>
            </div>
            <span className="text-[17px] font-semibold text-[#1D1D1F] tracking-tight">Recall</span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-0.5">
          {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
            const isActive = href === '/dashboard' ? pathname === '/dashboard' : pathname.startsWith(href)
            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-[14px] font-medium transition-colors duration-100 ${
                  isActive
                    ? 'bg-[#007AFF]/10 text-[#007AFF]'
                    : 'text-[#1D1D1F] hover:bg-black/[0.04]'
                }`}
              >
                <Icon size={16} strokeWidth={isActive ? 2.5 : 2} />
                {label}
              </Link>
            )
          })}

          <div className="pt-3 pb-1">
            <p className="px-3 text-[11px] font-semibold text-[#86868B] uppercase tracking-wider mb-1">Tools</p>
          </div>

          <Link
            href="/import"
            className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-[14px] font-medium transition-colors duration-100 ${
              pathname === '/import' ? 'bg-[#007AFF]/10 text-[#007AFF]' : 'text-[#1D1D1F] hover:bg-black/[0.04]'
            }`}
          >
            <Youtube size={16} strokeWidth={2} />
            Import Video
          </Link>
        </nav>

        {/* Ask Recall */}
        <div className="px-3 pb-2">
          <Link
            href="/ask"
            className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-[14px] font-medium transition-all duration-100 ${
              pathname === '/ask'
                ? 'bg-[#1D1D1F] text-white'
                : 'bg-[#F5F5F7] text-[#1D1D1F] hover:bg-black/[0.08]'
            }`}
          >
            <MessageSquare size={15} strokeWidth={2} />
            Ask Recall
          </Link>
        </div>

        {/* Bottom section */}
        <div className="border-t border-black/[0.04] px-3 py-3 space-y-0.5">
          <Link
            href="/settings"
            className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-[14px] font-medium transition-colors duration-100 ${
              pathname === '/settings' ? 'bg-[#007AFF]/10 text-[#007AFF]' : 'text-[#6E6E73] hover:bg-black/[0.04]'
            }`}
          >
            <Settings size={16} strokeWidth={2} />
            Settings
          </Link>

          {profile && (
            <div className="flex items-center gap-2.5 px-3 py-2 mt-2">
              <div className="w-7 h-7 rounded-full bg-[#007AFF]/10 flex items-center justify-center flex-shrink-0 overflow-hidden">
                {profile.avatar_url ? (
                  <img src={profile.avatar_url} alt="" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-[11px] font-semibold text-[#007AFF]">
                    {(profile.full_name || profile.email)[0].toUpperCase()}
                  </span>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[13px] font-medium text-[#1D1D1F] truncate">
                  {profile.full_name || profile.email}
                </p>
              </div>
              <button
                onClick={handleSignOut}
                className="text-[#86868B] hover:text-[#1D1D1F] transition-colors"
                title="Sign out"
              >
                <LogOut size={14} />
              </button>
            </div>
          )}
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  )
}
