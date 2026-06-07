import Link from 'next/link'

const PILOT_PHOTOS = [
  { id: '1764547168268-1c8b531bce9f', alt: 'Pilot wearing headset smiles while flying' },
  { id: '1775486766610-18b17c5fd297', alt: 'Young woman pilot wearing headset in cockpit' },
  { id: '1713327023682-d327a6961012', alt: 'Two pilots in the cockpit of a commercial aircraft' },
  { id: '1713327023704-c31f941219fc', alt: 'Two pilots at the flight deck controls' },
]

const SOURCE_BOOKS: { subject: string; books: string[] }[] = [
  {
    subject: 'Meteorology',
    books: [
      'Aviation Meteorology — IC Joshi',
      'Ground Studies for Pilots – Meteorology — Underdown & Standen',
      'Meteorology — Nordian',
      'Meteorology — Oxford',
      'Meteorology for Pilot — Mike Wickson',
      'Aviation Law and Meteorology — Trevor Thom',
    ],
  },
  {
    subject: 'Air Regulations',
    books: [
      'Air Law — Oxford',
      'Air Regulations — RK Bali',
      'Air Law and ATC Procedures — Nordian',
      'Air Regulations for Pilots — V Krishnan & AK Chopra',
      'Aircraft Act 1934 — India',
      'Aircraft Rules 1920, 1937, 1954 & 2003 — India',
      'DGCA Civil Aviation Requirements (CAR) — DGCA',
      'Human Performance & Limitations — Nordian',
      'Human Performance & Limitations — Oxford',
      'ICAO Annexes — ICAO',
      'ICAO Docs — ICAO',
      'AIP India — India',
    ],
  },
  {
    subject: 'Air Navigation',
    books: [
      'Air Navigation — Trevor Thom',
      'JAR ATPL & CPL General Navigation — Keith Williams',
      'Ground Studies for Pilots – Navigation — Underdown & Palmer',
      'General Navigation – Navigation — Nordian',
      'Navigation for Pilot — JE Hitchcock',
      'Flight Performance & Planning 1 — Oxford',
      'Flight Performance & Planning 2 (FP & M) — Oxford',
      'Mass & Balance Flight Performance and Planning — Nordian',
      'Radio Navigation and Instrument Flying — Trevor Thom',
      'Operational Procedures — Nordian',
    ],
  },
  {
    subject: 'Radio Aids & Instruments',
    books: [
      'JAR ATPL(A) and CPL(A) Instruments — Keith Williams',
      'Ground Studies for Pilots – Radio Aids — Underdown & Cockburn',
      'Radio Navigation and Instrument Flying — Trevor Thom',
      'Navigation – 2 Radio Navigation — Oxford',
      'Instrumentation Aircraft General Knowledge — Nordian',
      'Aircraft General Knowledge 4 — Oxford',
      'Ground Studies for Pilots – Flight Instruments and AFCS — David Harris',
      'Avionics and Flight Management for the Professional Pilot — David Robson',
    ],
  },
  {
    subject: 'Technical General',
    books: [
      'JAR ATPL & CPL Principles of Flight — Keith Williams',
      'Aircraft General Knowledge 1 — Oxford',
      'Aircraft General Knowledge 2 — Oxford',
      'Aircraft General Knowledge 3 — Oxford',
      'Airframe and Systems — Nordian',
      'Airframes and Systems Aircraft General Knowledge — Nordian',
      'Powerplant Aircraft General Knowledge — Nordian',
      'Electrics Aircraft General Knowledge — Nordian',
      'Principle of Flight — Nordian',
      'Principle of Flight — Oxford',
    ],
  },
]

const HOW_IT_WORKS = [
  {
    step: '1',
    title: 'Pick your scope',
    description: 'Study by topic, by source textbook and chapter, or take a full combined paper across all content.',
  },
  {
    step: '2',
    title: 'Configure your exam',
    description: 'Select practice or mock mode, difficulty level, and number of questions — 50 or 100.',
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
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#185FA5' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
              </svg>
            </div>
            <span className="font-bold text-slate-800 text-lg">ProPilotLicence</span>
          </div>
          <Link href="/admin" className="text-xs text-slate-400 hover:text-slate-600 transition-colors">Admin</Link>
        </div>
      </header>

      {/* Hero — text left, photos right */}
      <section className="px-4 py-12 sm:py-16" style={{ backgroundColor: '#F0F6FF' }}>
        <div className="max-w-5xl mx-auto flex flex-col lg:flex-row items-center gap-10">
          {/* Text */}
          <div className="flex-1 text-center lg:text-left">
            <h1 className="text-4xl sm:text-5xl font-black text-slate-900 mb-4 leading-tight">
              Pass your pilot exams.<br />First attempt.
            </h1>
            <p className="text-slate-600 text-lg mb-8 max-w-xl">
              Practice and build your question papers by topic, by textbook, or full combined papers — for DGCA CPL and ATPL.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
              <Link
                href="/cpl"
                className="inline-flex items-center justify-center px-8 py-3.5 rounded-xl font-bold text-white text-base transition-all hover:opacity-90"
                style={{ backgroundColor: '#185FA5' }}
              >
                Start CPL →
              </Link>
              <Link
                href="/atpl"
                className="inline-flex items-center justify-center px-8 py-3.5 rounded-xl font-bold text-base border-2 transition-all hover:border-blue-400"
                style={{ color: '#185FA5', borderColor: '#185FA5' }}
              >
                Start ATPL →
              </Link>
            </div>
          </div>

          {/* Photos 2×2 */}
          <div className="flex-shrink-0 w-full lg:w-auto">
            <div className="grid grid-cols-2 gap-3 max-w-sm mx-auto lg:mx-0" style={{ width: '360px' }}>
              {PILOT_PHOTOS.map(photo => (
                <div
                  key={photo.id}
                  className="relative rounded-xl overflow-hidden"
                  style={{ height: '160px', backgroundColor: '#D6E8F7' }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={`https://images.unsplash.com/photo-${photo.id}?auto=format&fit=crop&w=400&h=320`}
                    alt={photo.alt}
                    className="w-full h-full object-cover"
                    loading="eager"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Stats strip */}
      <section className="px-4 py-4 border-b border-slate-100 bg-white">
        <div className="max-w-5xl mx-auto flex flex-wrap items-center justify-center gap-6 text-sm text-slate-500 font-medium">
          <span>5 subjects</span>
          <span className="text-slate-200">·</span>
          <span>46 source books</span>
          <span className="text-slate-200">·</span>
          <span>CPL &amp; ATPL</span>
          <span className="text-slate-200">·</span>
          <span>DGCA official syllabus</span>
        </div>
      </section>

      {/* Source Books */}
      <section className="px-4 py-14 bg-slate-50 border-b border-slate-100">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-center text-sm font-semibold text-slate-500 uppercase tracking-wider mb-10">
            Questions sourced from these textbooks
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {SOURCE_BOOKS.map(group => (
              <div key={group.subject}>
                <h3 className="text-xs font-bold uppercase tracking-wider mb-3" style={{ color: '#185FA5' }}>
                  {group.subject}
                </h3>
                <ul className="space-y-1.5">
                  {group.books.map(book => (
                    <li key={book} className="text-sm text-slate-600 leading-snug flex items-start gap-2">
                      <span className="mt-1.5 w-1 h-1 rounded-full bg-slate-300 flex-shrink-0" />
                      {book}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
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

      <footer className="border-t border-slate-200 px-4 py-4 bg-white mt-auto">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <span className="text-xs text-slate-400">DGCA Pilot Exam Prep</span>
          <Link href="/admin" className="text-xs text-slate-400 hover:text-slate-600 transition-colors">Admin ↗</Link>
        </div>
      </footer>
    </div>
  )
}
