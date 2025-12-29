import type { Metadata } from 'next'
import './globals.css'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

export const metadata: Metadata = {
  title: 'CodexFlow.dev - AI ile Profesyonel Kod Yazımı',
  description: 'Planner → Coder → Reviewer workflow ile profesyonel yazılım geliştirme. API satışı ile kaliteli kod üretimi.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="tr" className="scroll-smooth">
      <body className="min-h-screen flex flex-col bg-[#0a0a1a]">
        <Navbar />
        <main className="flex-grow">{children}</main>
        <Footer />
      </body>
    </html>
  )
}

