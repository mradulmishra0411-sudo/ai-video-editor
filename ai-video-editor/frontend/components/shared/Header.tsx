'use client'

'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function Header() {
  const router = useRouter()

  return (
    <header className="bg-secondary border-b border-muted sticky top-0 z-50 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center group-hover:shadow-lg group-hover:shadow-accent/25 transition-shadow">
            <span className="text-accent-foreground font-bold">AI</span>
          </div>
          <span className="text-xl font-bold text-foreground">VideoEditor</span>
        </Link>

        <nav className="flex items-center gap-6">
          <Link href="/" className="text-muted-foreground hover:text-foreground transition">
            Dashboard
          </Link>
          <Link href="/editor/demo-1" className="text-muted-foreground hover:text-foreground transition">
            Demo Editor
          </Link>
          <button
            onClick={() => router.push('/editor/demo-1')}
            className="px-4 py-2 bg-accent text-accent-foreground rounded-lg hover:opacity-90 transition hover:shadow-lg hover:shadow-accent/25"
          >
            Try Demo
          </button>
        </nav>
      </div>
    </header>
  )
}
