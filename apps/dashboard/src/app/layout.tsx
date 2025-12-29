import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'CodexFlow Dashboard - API Yönetimi',
  description: 'Profesyonel API yönetim dashboard - Kullanım, maliyet ve log takibi',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="tr" className="scroll-smooth">
      <body className="bg-[#0a0a1a] min-h-screen">{children}</body>
    </html>
  )
}
