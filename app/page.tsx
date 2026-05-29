import Link from 'next/link'

const PILOT_PHOTOS = [
  {
    id: '1436491865332-7a61a109cc05',
    alt: 'Pilot at aircraft controls in cockpit',
  },
  {
    id: '1474302770737-173ee21bab63',
    alt: 'Commercial airline pilot in uniform',
  },
  {
    id: '1551244072-5d12893278bc',
    alt: 'Flight crew preparing for departure',
  },
  {
    id: '1540575467063-178a50c2df87',
    alt: 'Pilot conducting pre-flight checks',
  },
]

const HOW_IT_WORKS = [
  {
    step: '1',
    title: 'Pick your scope',
    description: 'Choose to study by topic, by source textbook, or take a full combined paper across all content.',
  },
  {
    step: '2',
    title: 'Configure your exam',
    description: 'Select your mode (practice or mock), difficulty level, and number of questions — 50 or 100.',
  },
  {
    step: '3',
    title: 'Review and improve',
    description: 'Detailed textbook-style explanations with chapter and page citations after every question.',
  },
]

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <header className="bg-white border-b border-slate-200 px-4 py-3">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: '#185FA5' }}
            >
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

      {/* Hero */}
      <section className="px-4 py-16 text-center" style={{ backgroundColor: '#F0F6FF' }}>
        <div className="max-w-2xl mx-auto">
          <h1 className="text-4xl font-black text-slate-900 mb-3 leading-tight">
            Pass your pilot exams.<br />First attempt.
          </h1>
          <p className="text-slate-600 text-lg mb-8 max-w-xl mx-auto">
            AI-powered practice tests for DGCA CPL and ATPL — by topic, by textbook, or full combined papers.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/cpl"
              className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl font-bold text-white text-base transition-all hover:opacity-90"
              style={{ backgroundColor: '#185FA5' }}
            >
              Start CPL →
            </Link>
            <Link
              href="/atpl"
              className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl font-bold text-base border-2 transition-all hover:border-blue-400"
              style={{ color: '#185FA5', borderColor: '#185FA5' }}
            >
              Start ATPL →
            </Link>
          </div>
        </div>
      </section>

      {/* Pilot imagery strip */}
      <section className="px-4 py-6 bg-white overflow-hidden">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {PILOT_PHOTOS.map(photo => (
              <div
                key={photo.id}
                className="relative h-40 sm:h-48 rounded-xl overflow-hidden"
                style={{ backgroundColor: '#D6E8F7' }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={`https://images.unsplash.com/photo-${photo.id}?auto=format&fit=crop&w=400&h=300`}
                  alt={photo.alt}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats strip */}
      <section className="px-4 py-4 border-y border-slate-100 bg-slate-50">
        <div className="max-w-5xl mx-auto flex flex-wrap items-center justify-center gap-6 text-sm text-slate-600 font-medium">
          <span>2 subjects</span>
          <span className="text-slate-300">·</span>
          <span>17 source books</span>
          <span className="text-slate-300">·</span>
          <span>DGCA official syllabus</span>
        </div>
      </section>

      {/* How it works */}
      <section className="px-4 py-14">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-center text-sm font-semibold text-slate-500 uppercase tracking-wider mb-10">
            How it works
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {HOW_IT_WORKS.map(item => (
              <div key={item.step} className="text-center">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm mx-auto mb-4"
                  style={{ backgroundColor: '#185FA5' }}
                >
                  {item.step}
                </div>
                <h3 className="font-semibold text-slate-800 mb-2">{item.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA strip */}
      <section className="px-4 py-12 text-center border-t border-slate-100">
        <div className="max-w-xl mx-auto">
          <p className="text-slate-500 text-sm mb-1">
            Starting with Meteorology and Air Regulations
          </p>
          <p className="text-xs text-slate-400">
            More subjects coming soon — Navigation, Radio Aids & Instruments, Technical General, Aviation Medicine
          </p>
        </div>
      </section>

      <footer className="border-t border-slate-200 px-4 py-4 bg-white mt-auto">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <span className="text-xs text-slate-400">DGCA Pilot Exam Prep</span>
          <Link href="/admin" className="text-xs text-slate-400 hover:text-slate-600 transition-colors">
            Admin ↗
          </Link>
        </div>
      </footer>
    </div>
  )
}
