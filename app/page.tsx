import Link from 'next/link'

const LICENCES = [
  {
    code: 'cpl',
    label: 'CPL',
    name: 'Commercial Pilot Licence',
    description: 'For aspiring commercial pilots. 7 theory subjects covering meteorology, air regulations, navigation, and more.',
    exams: '7 subjects',
  },
  {
    code: 'atpl',
    label: 'ATPL',
    name: 'Airline Transport Pilot Licence',
    description: 'For airline pilot candidates. 8 theory subjects including all CPL topics plus advanced systems.',
    exams: '8 subjects',
  },
]

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-white border-b border-slate-200 px-4 py-3">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#185FA5' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
              </svg>
            </div>
            <span className="font-bold text-slate-800 text-lg">ProPilotLicense</span>
          </div>
          <Link href="/admin" className="text-xs text-slate-400 hover:text-slate-600 transition-colors">
            Admin
          </Link>
        </div>
      </header>

      <section className="bg-white border-b border-slate-100 px-4 py-12">
        <div className="max-w-5xl mx-auto text-center">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">
            Ace Your DGCA Theory Exam
          </h1>
          <p className="text-slate-500 text-lg max-w-xl mx-auto">
            Practice with real-style questions, timed mock exams, and book-referenced explanations.
          </p>
        </div>
      </section>

      <main className="flex-1 px-4 py-10">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-5 text-center">
            Choose your licence type
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {LICENCES.map(lic => (
              <Link
                key={lic.code}
                href={`/${lic.code}`}
                className="bg-white rounded-2xl border-2 border-slate-200 p-6 hover:border-blue-400 hover:shadow-lg transition-all group"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-black text-lg"
                    style={{ backgroundColor: '#185FA5' }}
                  >
                    {lic.label}
                  </div>
                  <div>
                    <div className="font-bold text-slate-800 text-base">{lic.label}</div>
                    <div className="text-xs text-slate-500">{lic.name}</div>
                  </div>
                </div>
                <p className="text-sm text-slate-600 leading-relaxed mb-4">
                  {lic.description}
                </p>
                <div className="flex items-center justify-between">
                  <span
                    className="text-xs font-medium px-2.5 py-1 rounded-full"
                    style={{ backgroundColor: '#EBF4FF', color: '#185FA5' }}
                  >
                    {lic.exams}
                  </span>
                  <span className="text-sm font-semibold group-hover:translate-x-1 transition-transform" style={{ color: '#185FA5' }}>
                    Start →
                  </span>
                </div>
              </Link>
            ))}
          </div>

          <p className="text-center text-xs text-slate-400 mt-6">
            Starting with Meteorology and Air Regulations — more subjects coming soon
          </p>
        </div>
      </main>

      <footer className="border-t border-slate-200 px-4 py-4 bg-white">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <span className="text-xs text-slate-400">DGCA Exam Prep</span>
          <Link href="/admin" className="text-xs text-slate-400 hover:text-slate-600 transition-colors">
            Admin ↗
          </Link>
        </div>
      </footer>
    </div>
  )
}
