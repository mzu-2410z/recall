// Marketing layout — server component so we can export dynamic
export const dynamic = 'force-dynamic'

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
