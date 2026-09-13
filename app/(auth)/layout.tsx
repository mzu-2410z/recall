import type { Metadata } from 'next'

// All auth pages require runtime env vars — disable static generation
export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Recall — Meeting Intelligence',
  description: 'Capture, transcribe, and understand your meetings automatically.',
}

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return children
}
