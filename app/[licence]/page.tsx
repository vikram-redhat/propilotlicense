import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { Subject } from '@/lib/types'
import SubjectIcon from '@/components/SubjectIcon'
import SiteFooter from '@/components/SiteFooter'
import { notFound } from 'next/navigation'

const VALID_LICENCES = ['cpl', 'atpl']

const LICENCE_LABELS: Record<string, string> = {
  cpl: 'CPL',
  atpl: 'ATPL',
}

async function getSubjectsForLicence(licence: string): Promise<(Subject & { book_count: number })[]> {
  const licenceUpper = licence.toUpperCase()

  const { data: subjects } = await supabase
    .from('subjects')
    .select('*')
    .eq('active', true)
    .contains('licence_types', [licenceUpper])
    .order('sort_order')

  if (!subjects) return []

  const { data: qCounts } = await supabase
    .from('questions')
    .select('subject_id')
    .eq('active', true)

  const { data: bookCounts } = await supabase
    .from('source_books')
    .select('subject_id')

  const qMap: Record<string, number> = {}
  qCounts?.forEach(q => { qMap[q.subject_id] = (qMap[q.subject_id] || 0) + 1 })

  const bMap: Record<string, number> = {}
  bookCounts?.forEach(b => { bMap[b.subject_id] = (bMap[b.subject_id] || 0) + 1 })

  return subjects.map(s => ({
    ...s,
    question_count: qMap[s.id] || 0,
    book_count: bMap[s.id] || 0,
  }))
}

export default async function LicencePage({ params }: { params: Promise<{ licence: string }> }) {
  const { licence } = await params

  if (!VALID_LICENCES.includes(licence.toLowerCase())) notFound()

  const subjects = await getSubjectsForLicence(licence)
  const label = LICENCE_LABELS[licence.toLowerCase()]

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-white border-b border-slate-200 px-4 py-3">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="text-slate-400 hover:text-slate-600 transition-colors text-sm">
              ← Home
            </Link>
            <span className="text-slate-300">/</span>
            <span className="text-sm font-medium text-slate-700">{label}</span>
          </div>
        </div>
      </header>

      <section className="bg-white border-b border-slate-100 px-4 py-8">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-3">
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-black text-lg"
              style={{ backgroundColor: '#185FA5' }}
            >
              {label}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">
                {label === 'CPL' ? 'Commercial Pilot Licence' : 'Airline Transport Pilot Licence'}
              </h1>
              <p className="text-slate-500 text-sm">Select a subject to start practising</p>
            </div>
          </div>
        </div>
      </section>

      <main className="flex-1 px-4 py-8">
        <div className="max-w-5xl mx-auto">
          {subjects.length === 0 ? (
            <div className="text-center py-16 text-slate-400">
              <p className="text-lg">No subjects available yet.</p>
              <p className="text-sm mt-1">Run the seed script to populate the database.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {subjects.map(subject => (
                <Link
                  key={subject.id}
                  href={`/${licence}/${subject.id}`}
                  className="bg-white rounded-xl border border-slate-200 p-5 hover:border-blue-300 hover:shadow-md transition-all group"
                >
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center mb-3"
                    style={{ backgroundColor: '#EBF4FF' }}
                  >
                    <SubjectIcon name={subject.icon_name} size={20} className="text-[#185FA5]" />
                  </div>
                  <h3 className="font-semibold text-slate-800 text-sm leading-tight mb-2">
                    {subject.name}
                  </h3>
                  <div className="flex flex-wrap gap-1.5">
                    <span
                      className="inline-block text-xs font-medium px-2 py-0.5 rounded-full"
                      style={{ backgroundColor: '#EBF4FF', color: '#185FA5' }}
                    >
                      {subject.question_count} questions
                    </span>
                    {subject.book_count > 0 && (
                      <span className="inline-block text-xs font-medium px-2 py-0.5 rounded-full bg-slate-100 text-slate-500">
                        {subject.book_count} books
                      </span>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>

      <SiteFooter label={`DGCA ${label} Exam Prep`} />
    </div>
  )
}
