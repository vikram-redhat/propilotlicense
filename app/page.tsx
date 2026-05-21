import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { Subject } from '@/lib/types'
import SubjectIcon from '@/components/SubjectIcon'

async function getSubjectsWithCounts(): Promise<Subject[]> {
  const { data: subjects } = await supabase
    .from('subjects')
    .select('*')
    .eq('active', true)
    .order('sort_order')

  if (!subjects) return []

  const { data: counts } = await supabase
    .from('questions')
    .select('subject_id')
    .eq('active', true)

  const countMap: Record<string, number> = {}
  counts?.forEach(q => {
    countMap[q.subject_id] = (countMap[q.subject_id] || 0) + 1
  })

  return subjects.map(s => ({ ...s, question_count: countMap[s.id] || 0 }))
}

export default async function HomePage() {
  const subjects = await getSubjectsWithCounts()

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
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

      {/* Hero */}
      <section className="bg-white border-b border-slate-100 px-4 py-10">
        <div className="max-w-5xl mx-auto text-center">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">
            Ace Your DGCA CPL Theory Exam
          </h1>
          <p className="text-slate-500 text-lg max-w-xl mx-auto">
            Practice with real-style questions across all 8 subjects. Practice mode or timed mock exams.
          </p>
        </div>
      </section>

      {/* Subjects grid */}
      <main className="flex-1 px-4 py-8">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4">
            Choose a Subject
          </h2>
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
                  href={`/subject/${subject.id}`}
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
                  <span
                    className="inline-block text-xs font-medium px-2 py-0.5 rounded-full"
                    style={{ backgroundColor: '#EBF4FF', color: '#185FA5' }}
                  >
                    {subject.question_count} questions
                  </span>
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 px-4 py-4 bg-white">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <span className="text-xs text-slate-400">DGCA CPL Exam Prep</span>
          <Link href="/admin" className="text-xs text-slate-400 hover:text-slate-600 transition-colors">
            Admin ↗
          </Link>
        </div>
      </footer>
    </div>
  )
}
