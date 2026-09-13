// Server Component wrapper — allows `dynamic` export which is not possible in client components.
// The actual UI shell lives in layout-client.tsx (a 'use client' component).
export const dynamic = 'force-dynamic'

import AppLayoutClient from './layout-client'

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return <AppLayoutClient>{children}</AppLayoutClient>
}
