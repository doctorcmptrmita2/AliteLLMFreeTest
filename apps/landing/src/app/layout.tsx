import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Roo Code Test Harness',
  description: 'Planner → Coder → Reviewer workflow with LiteLLM',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="tr">
      <body>{children}</body>
    </html>
  )
}

