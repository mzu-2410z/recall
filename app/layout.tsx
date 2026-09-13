import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Recall — Meeting Intelligence Platform',
  description: 'Capture, transcribe, and extract actionable insights from your meetings automatically.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="h-full bg-slate-900 text-slate-100 antialiased">
      <body className={`${inter.className} min-h-full flex flex-col`}>
        {children}
      </body>
    </html>
  )
}
