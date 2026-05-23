'use client'

export default function Sidebar() {
  return (
    <aside className="w-64 bg-secondary border-r border-muted h-screen flex flex-col">
      <div className="p-6 border-b border-muted">
        <h2 className="text-lg font-semibold text-foreground">Navigation</h2>
      </div>
      
      <nav className="flex-1 overflow-y-auto p-4 space-y-2">
        <a
          href="/"
          className="block px-4 py-2 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition"
        >
          Dashboard
        </a>
        <a
          href="/editor"
          className="block px-4 py-2 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition"
        >
          Editor
        </a>
        <a
          href="/settings"
          className="block px-4 py-2 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition"
        >
          Settings
        </a>
      </nav>
      
      <div className="p-4 border-t border-muted">
        <button className="w-full px-4 py-2 bg-destructive text-destructive-foreground rounded-lg hover:opacity-90 transition">
          Sign Out
        </button>
      </div>
    </aside>
  )
}
