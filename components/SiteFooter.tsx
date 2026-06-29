import Link from 'next/link'

export default function SiteFooter({ label }: { label?: string }) {
  return (
    <footer className="border-t border-slate-200 bg-white px-4 pt-6 pb-4">
      <div className="max-w-5xl mx-auto">
        <p className="text-xs text-slate-400 leading-relaxed mb-3">
          ProPilotLicence.com is an independent DGCA exam preparation platform and is not affiliated with, endorsed by, or associated with any textbook author, publisher, or aviation authority. All referenced titles remain the property of their respective owners. Practice questions are original content and do not reproduce material from any publication.
        </p>
        <div className="flex items-center justify-between flex-wrap gap-3">
          <span className="text-xs text-slate-400">{label || 'DGCA Pilot Exam Prep'}</span>
          <div className="flex items-center flex-wrap gap-x-4 gap-y-1">
            <Link href="/about" className="text-xs text-slate-400 hover:text-slate-600 transition-colors">About</Link>
            <Link href="/subjects" className="text-xs text-slate-400 hover:text-slate-600 transition-colors">Subjects</Link>
            <Link href="/blog" className="text-xs text-slate-400 hover:text-slate-600 transition-colors">Blog</Link>
            <Link href="/pricing" className="text-xs text-slate-400 hover:text-slate-600 transition-colors">Pricing</Link>
            <Link href="/privacy" className="text-xs text-slate-400 hover:text-slate-600 transition-colors">Privacy</Link>
            <Link href="/terms" className="text-xs text-slate-400 hover:text-slate-600 transition-colors">Terms of Use</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
