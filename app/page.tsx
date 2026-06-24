import Link from 'next/link'
import SiteFooter from '@/components/SiteFooter'
import LandingHeader from '@/components/LandingHeader'
import { createAuthClient } from '@/lib/supabase-server'
import { createServiceClient } from '@/lib/supabase'

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

export default async function HomePage() {
  const supabase = await createAuthClient()
  const { data: { user } } = await supabase.auth.getUser()
  const name = user?.user_metadata?.full_name ?? user?.email?.split('@')[0] ?? null

  const svc = createServiceClient()
  const [subjectsRes, bookCountRes, subjectCountRes] = await Promise.all([
    svc.from('subjects')
      .select('id, name, sort_order, source_books(id, title, author, sort_order)')
      .eq('active', true)
      .order('sort_order'),
    svc.from('source_books').select('*', { count: 'exact', head: true }),
    svc.from('subjects').select('*', { count: 'exact', head: true }).eq('active', true),
  ])

  const subjects = (subjectsRes.data || []).map(s => ({
    ...s,
    source_books: [...((s.source_books as { id: string; title: string; author: string | null; sort_order: number }[]) || [])].sort((a, b) => a.sort_order - b.sort_order),
  }))

  const bookCount = bookCountRes.count ?? 0
  const subjectCount = subjectCountRes.count ?? 0

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <LandingHeader isLoggedIn={!!user} name={name} />

      {/* Hero — dimmed aircraft background + two-column content */}
      <section className="relative overflow-hidden min-h-[520px]">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url('https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=1600&q=80')` }}
        />
        <div className="absolute inset-0 bg-slate-900/75" />

        <div className="relative z-10 max-w-5xl mx-auto px-6 py-16 flex flex-col md:flex-row items-center gap-10">

          {/* Mobile: portrait as banner */}
          <div className="md:hidden w-full h-48 rounded-xl overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://images.unsplash.com/photo-1764547168268-1c8b531bce9f?auto=format&fit=crop&w=800&h=400"
              alt="Licensed commercial pilot"
              className="w-full h-full object-cover object-top"
            />
          </div>

          {/* Desktop: portrait */}
          <div className="hidden md:block flex-shrink-0 w-64 h-80 rounded-2xl overflow-hidden shadow-2xl ring-2 ring-white/20">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://images.unsplash.com/photo-1764547168268-1c8b531bce9f?auto=format&fit=crop&w=400&h=500"
              alt="Licensed commercial pilot"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Headline + CTAs */}
          <div className="flex-1 text-white">
            <div className="inline-flex items-center gap-2 text-xs font-medium bg-white/10 text-white/80 px-3 py-1 rounded-full mb-4 backdrop-blur-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400" />
              DGCA CPL &amp; ATPL Exam Preparation
            </div>

            <h1 className="text-4xl md:text-5xl font-semibold leading-tight mb-4">
              Pass your pilot exams.<br />
              <span className="text-blue-400">First attempt.</span>
            </h1>

            <p className="text-white/70 text-base leading-relaxed mb-8 max-w-md">
              Practice tests for DGCA CPL and ATPL — by topic, by textbook, or full combined papers. Questions verified by licensed pilots.
            </p>

            <div className="flex gap-3 flex-wrap">
              <Link
                href={user ? '/cpl' : '/login?next=/cpl'}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium text-sm transition-colors"
              >
                {user ? 'Continue CPL →' : 'Start CPL →'}
              </Link>
              <Link
                href={user ? '/atpl' : '/login?next=/atpl'}
                className="bg-white/10 hover:bg-white/20 text-white border border-white/20 px-6 py-3 rounded-lg font-medium text-sm backdrop-blur-sm transition-colors"
              >
                {user ? 'Continue ATPL →' : 'Start ATPL →'}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats strip */}
      <section className="px-4 py-4 border-b border-slate-100 bg-white">
        <div className="max-w-5xl mx-auto flex flex-wrap items-center justify-center gap-6 text-sm text-slate-500 font-medium">
          <span>{subjectCount} subjects</span>
          <span className="text-slate-200">·</span>
          <span>{bookCount} source books</span>
          <span className="text-slate-200">·</span>
          <span>CPL &amp; ATPL</span>
          <span className="text-slate-200">·</span>
          <span>DGCA official syllabus</span>
        </div>
      </section>

      {/* Source Books — dynamic */}
      <section className="px-4 py-14 bg-slate-50 border-b border-slate-100">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-center text-sm font-semibold text-slate-500 uppercase tracking-wider mb-8">
            Questions sourced from these textbooks
          </h2>

          <div className="bg-white border border-slate-200 rounded-xl p-5 mb-10 space-y-3">
            <p className="text-xs font-semibold text-slate-700 uppercase tracking-wider">Reference Materials</p>
            <p className="text-xs text-slate-500 leading-relaxed">
              The following textbooks and publications are prescribed by the Directorate General of Civil Aviation (DGCA), India, as reference material for CPL and ATPL theory examinations. They are listed here for the benefit of students preparing for these examinations.
            </p>
            <p className="text-xs text-slate-500 leading-relaxed">
              ProPilotLicence.com is an independent examination preparation service. We are not affiliated with, endorsed by, or in partnership with any of the authors, publishers, or organisations listed below. All titles, author names, and trademarks remain the property of their respective owners.
            </p>
            <p className="text-xs text-slate-500 leading-relaxed">
              The practice questions on this platform are original content created for examination preparation purposes. They are informed by the subject matter covered in the prescribed syllabus and reference materials but do not reproduce text, diagrams, tables, or any other content from the publications listed below.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {subjects.map(subject => (
              <div key={subject.id}>
                <h3 className="text-xs font-bold uppercase tracking-wider mb-3" style={{ color: '#185FA5' }}>
                  {subject.name}
                </h3>
                <ul className="space-y-1.5">
                  {subject.source_books.map(book => (
                    <li key={book.id} className="text-sm text-slate-600 leading-snug flex items-start gap-2">
                      <span className="mt-1.5 w-1 h-1 rounded-full bg-slate-300 flex-shrink-0" />
                      {book.title}{book.author ? ` — ${book.author}` : ''}
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

      {/* Trust section */}
      <section className="px-4 py-14 border-t border-slate-100" style={{ backgroundColor: '#F0F6FF' }}>
        <div className="max-w-2xl mx-auto text-center">
          <p className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: '#185FA5' }}>
            ✓ Human verified
          </p>
          <h2 className="text-2xl font-black text-slate-900 mb-4 leading-snug">
            Created and verified by licensed pilots
          </h2>
          <p className="text-slate-600 leading-relaxed mb-4">
            Every question in our bank has been written and reviewed by licensed commercial pilots holding DGCA CPL and ATPL qualifications. Questions are cross-referenced against the prescribed DGCA syllabus and the source textbooks listed above, with chapter and page citations verified against the actual books.
          </p>
          <p className="text-slate-600 leading-relaxed">
            We use AI as a tool to assist question drafting — but every question is checked, edited, and approved by a licensed pilot before it reaches you. No question goes live without human sign-off.
          </p>
        </div>
      </section>

      <SiteFooter />
    </div>
  )
}
