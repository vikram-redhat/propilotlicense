import Link from 'next/link'
import { createServiceClient } from '@/lib/supabase'
import { createAuthClient } from '@/lib/supabase-server'
import { Subject } from '@/lib/types'
import { isSubscribed } from '@/lib/subscription'
import SubjectIcon from '@/components/SubjectIcon'
import SiteHeader from '@/components/SiteHeader'
import SiteFooter from '@/components/SiteFooter'
import CompositeCard from '@/components/CompositeCard'
import { notFound } from 'next/navigation'

const VALID_LICENCES = ['cpl', 'atpl']

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

  const bookCountRes = await supabase.from('source_books').select('subject_id')
  const bMap: Record<string, number> = {}
  bookCountRes.data?.forEach(b => { bMap[b.subject_id] = (bMap[b.subject_id] || 0) + 1 })

  return subjects.map(s => ({ ...s, book_count: bMap[s.id] || 0 }))
}

export default async function LicencePage({ params }: { params: Promise<{ licence: string }> }) {
  const { licence } = await params
  if (!VALID_LICENCES.includes(licence.toLowerCase())) notFound()

  const authClient = await createAuthClient()
  const { data: { user } } = await authClient.auth.getUser()
  const examType = (user?.user_metadata?.exam_type as string) || null

  const subjects = await getSubjectsForLicence(licence)
  const licenceUpper = licence.toUpperCase()

  // Fetch subscription status for Composite modal
  let subscribed = user?.user_metadata?.is_admin === true
  if (!subscribed && user) {
    const svc = createServiceClient()
    const { data: profile } = await svc.from('profiles').select('subscription_tier, subscription_expires_at').eq('id', user.id).single()
    subscribed = isSubscribed(profile as Parameters<typeof isSubscribed>[0])
  }

  // Composite view — only on /cpl for Composite exam type users
  if (examType === 'Composite' && licence.toLowerCase() === 'cpl') {
    const byCode: Record<string, Subject & { book_count: number }> = {}
    subjects.forEach(s => { byCode[s.code] = s })

    return (
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#F8FAFF', color: '#0D1B2E' }}>
        <SiteHeader />

        <section style={{ borderBottom: '1px solid #D4E1F0', padding: '24px 20px' }} className="sm:px-9 lg:px-[60px]">
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 44, height: 44, borderRadius: 12, background: '#185FA5', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontFamily: 'var(--font-outfit),sans-serif', fontWeight: 800, fontSize: 13, flexShrink: 0, textAlign: 'center', lineHeight: 1.2 }}>
              COM
            </div>
            <div>
              <h1 style={{ fontFamily: 'var(--font-outfit),sans-serif', fontSize: 20, fontWeight: 700, color: '#0D1B2E', letterSpacing: '-0.3px' }}>
                Composite Licence Conversion
              </h1>
              <p style={{ fontSize: 13, color: '#4A5E78', marginTop: 2 }}>Foreign licence conversion · 2 papers</p>
            </div>
          </div>
        </section>

        <main className="flex-1 px-5 sm:px-9 lg:px-[60px] py-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4" style={{ maxWidth: 680 }}>

            {/* Air Regulations card */}
            {byCode['REG'] && (
              <Link
                href={`/cpl/${byCode['REG'].id}`}
                className="hover:border-[#185FA5] transition-colors"
                style={{ background: '#EEF3FA', borderRadius: 13, border: '1px solid #D4E1F0', padding: 18, display: 'flex', flexDirection: 'column', gap: 8, textDecoration: 'none' }}
              >
                <div style={{ width: 38, height: 38, borderRadius: 9, background: '#E8F0FB', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <SubjectIcon name={byCode['REG'].icon_name} size={20} className="text-[#185FA5]" />
                </div>
                <div style={{ fontFamily: 'var(--font-outfit),sans-serif', fontWeight: 600, fontSize: 13, color: '#0D1B2E', lineHeight: 1.3 }}>
                  {byCode['REG'].name}
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  <span style={{ fontSize: 11, fontWeight: 600, padding: '3px 9px', borderRadius: 20, background: '#E8F0FB', color: '#185FA5' }}>
                    {byCode['REG'].question_count ?? 0} questions
                  </span>
                  {(byCode['REG'].book_count ?? 0) > 0 && (
                    <span style={{ fontSize: 11, fontWeight: 500, padding: '3px 9px', borderRadius: 20, background: '#F8FAFF', color: '#4A5E78', border: '1px solid #D4E1F0' }}>
                      {byCode['REG'].book_count} books
                    </span>
                  )}
                </div>
              </Link>
            )}

            {/* Composite Paper card */}
            <CompositeCard
              metId={byCode['MET']?.id}
              navId={byCode['NAV']?.id}
              raiId={byCode['RAI']?.id}
              regId={byCode['REG']?.id}
              subscribed={subscribed}
            />
          </div>
        </main>

        <SiteFooter label="DGCA Composite Exam Prep" />
      </div>
    )
  }

  // Standard CPL / ATPL view
  const dashboardNote =
    licenceUpper === 'CPL'
      ? 'CPL requires 4 papers — Navigation and Radio Aids are examined together.'
      : 'ATPL requires 7 papers (6 core + Performance for aircraft over 5,700 kg).'

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#F8FAFF', color: '#0D1B2E' }}>
      <SiteHeader />

      <section style={{ borderBottom: '1px solid #D4E1F0', padding: '24px 20px' }} className="sm:px-9 lg:px-[60px]">
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 44, height: 44, borderRadius: 12, background: '#185FA5', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontFamily: 'var(--font-outfit),sans-serif', fontWeight: 800, fontSize: 15, flexShrink: 0 }}>
            {licenceUpper}
          </div>
          <div>
            <h1 style={{ fontFamily: 'var(--font-outfit),sans-serif', fontSize: 20, fontWeight: 700, color: '#0D1B2E', letterSpacing: '-0.3px' }}>
              {licenceUpper === 'CPL' ? 'Commercial Pilot Licence' : 'Airline Transport Pilot Licence'}
            </h1>
            <p style={{ fontSize: 13, color: '#4A5E78', marginTop: 2 }}>{dashboardNote}</p>
          </div>
        </div>
      </section>

      <main className="flex-1 px-5 sm:px-9 lg:px-[60px] py-8">
        {subjects.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '64px 0', color: '#4A5E78' }}>
            <p style={{ fontSize: 16 }}>No subjects available yet.</p>
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
                    {subject.question_count ?? 0} questions
                  </span>
                  {(subject.book_count ?? 0) > 0 && (
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

      <SiteFooter label={`DGCA ${licenceUpper} Exam Prep`} />
    </div>
  )
}
