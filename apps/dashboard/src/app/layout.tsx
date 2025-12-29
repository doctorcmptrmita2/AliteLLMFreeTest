import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Roo Code Dashboard',
  description: 'Dashboard panel for Roo Code Test Harness',
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

