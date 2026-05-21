import Link from 'next/link'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-slate-900 text-white px-4 py-3">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/admin" className="font-bold text-white text-base">
              ProPilotLicense Admin
            </Link>
            <nav className="hidden sm:flex items-center gap-4 text-sm text-slate-300">
              <Link href="/admin" className="hover:text-white transition-colors">Questions</Link>
              <Link href="/admin/generate" className="hover:text-white transition-colors">AI Generate</Link>
            </nav>
          </div>
          <Link href="/" className="text-xs text-slate-400 hover:text-white transition-colors">
            ← Student view
          </Link>
        </div>
      </header>
      <div className="flex-1 bg-slate-50">
        {children}
      </div>
    </div>
  )
}
