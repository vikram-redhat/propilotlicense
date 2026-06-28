import Link from 'next/link'
import { createServiceClient } from '@/lib/supabase'
import { Subject } from '@/lib/types'
import SubjectIcon from '@/components/SubjectIcon'
import SiteHeader from '@/components/SiteHeader'
import SiteFooter from '@/components/SiteFooter'
import { notFound } from 'next/navigation'

const VALID_LICENCES = ['cpl', 'atpl']

const LICENCE_LABELS: Record<string, string> = {
  cpl: 'CPL',
  atpl: 'ATPL',
}

async function getSubjectsForLicence(licence: string): Promise<(Subject & { book_count: number })[]> {
  const supabase = createServiceClient()
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
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#F8FAFF', color: '#0D1B2E' }}>
      <SiteHeader />

      <section style={{ borderBottom: '1px solid #D4E1F0', padding: '24px 20px' }} className="sm:px-9 lg:px-[60px]">
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 44, height: 44, borderRadius: 12, background: '#185FA5', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontFamily: 'var(--font-outfit),sans-serif', fontWeight: 800, fontSize: 15, flexShrink: 0 }}>
            {label}
          </div>
          <div>
            <h1 style={{ fontFamily: 'var(--font-outfit),sans-serif', fontSize: 20, fontWeight: 700, color: '#0D1B2E', letterSpacing: '-0.3px' }}>
              {label === 'CPL' ? 'Commercial Pilot Licence' : 'Airline Transport Pilot Licence'}
            </h1>
            <p style={{ fontSize: 13, color: '#4A5E78', marginTop: 2 }}>Select a subject to start practising</p>
          </div>
        </div>
      </section>

      <main className="flex-1 px-5 sm:px-9 lg:px-[60px] py-8">
          {subjects.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '64px 0', color: '#4A5E78' }}>
              <p style={{ fontSize: 16 }}>No subjects available yet.</p>
              <p style={{ fontSize: 13, marginTop: 4 }}>Run the seed script to populate the database.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {subjects.map(subject => (
                <Link
                  key={subject.id}
                  href={`/${licence}/${subject.id}`}
                  className="hover:border-[#185FA5] transition-colors"
                  style={{ background: '#EEF3FA', borderRadius: 13, border: '1px solid #D4E1F0', padding: 16, display: 'flex', flexDirection: 'column', gap: 8, textDecoration: 'none' }}
                >
                  <div style={{ width: 38, height: 38, borderRadius: 9, background: '#E8F0FB', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <SubjectIcon name={subject.icon_name} size={20} className="text-[#185FA5]" />
                  </div>
                  <div style={{ fontFamily: 'var(--font-outfit),sans-serif', fontWeight: 600, fontSize: 13, color: '#0D1B2E', lineHeight: 1.3 }}>
                    {subject.name}
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                    <span style={{ fontSize: 11, fontWeight: 600, padding: '3px 9px', borderRadius: 20, background: '#E8F0FB', color: '#185FA5' }}>
                      {subject.question_count} questions
                    </span>
                    {subject.book_count > 0 && (
                      <span style={{ fontSize: 11, fontWeight: 500, padding: '3px 9px', borderRadius: 20, background: '#F8FAFF', color: '#4A5E78', border: '1px solid #D4E1F0' }}>
                        {subject.book_count} books
                      </span>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          )}
      </main>

      <SiteFooter label={`DGCA ${label} Exam Prep`} />
    </div>
  )
}
