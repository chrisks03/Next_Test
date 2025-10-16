import type { Metadata } from 'next'
import './globals.css'
import './style-guide.css'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'

export const metadata: Metadata = {
  title: 'Generative Tool Boilerplate',
  description: 'A modular Next.js boilerplate for creating custom generative design tools',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable}`}>
      <body className={GeistMono.className}>{children}</body>
    </html>
  )
}
