import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'AI Video Editor - Viral-Ready Video Creation',
  description: 'Create engaging, viral-ready videos with AI-powered editing. Analyze trends, sync audio, and produce Instagram Reels and YouTube Shorts in minutes.',
  keywords: ['video editing', 'AI', 'Instagram Reels', 'YouTube Shorts', 'automation'],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="theme-color" content="#0a0a0a" />
      </head>
      <body className="bg-background">
        {children}
      </body>
    </html>
  )
}
