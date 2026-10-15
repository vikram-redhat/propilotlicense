import Link from 'next/link'
import { buildMetadata } from '@/lib/metadata'
import { getSeries } from '@/lib/guides'
import { A320_PROCEDURES_SERIES } from '@/lib/a320-series'
import { SeriesHubPage } from '@/components/guides/SeriesHubPage'

export const metadata = buildMetadata({
  title: 'A320 Operations and Procedures — ECAM, Circuits and Approaches | ProPilotLicence',
  description:
    'A320 operating technique for type rating and ATPL candidates. ECAM handling philosophy, visual circuit, precision and non-precision approaches, RNP and RNP AR operations.',
  path: '/guides/a320-procedures',
})

export default function A320ProceduresHubPage() {
  const upcoming = A320_PROCEDURES_SERIES.items.filter(item => !item.slug).map(item => item.label)
  return (
    <SeriesHubPage series={getSeries('a320-procedures')!} upcoming={upcoming}>
      Looking for how the systems themselves work? The A320 Systems Series — hydraulics, flight controls,
      autoflight and more — lives in{' '}
      <Link href="/guides/dgca-exam-guides" style={{ color: 'var(--clr-primary)', textDecoration: 'none', fontWeight: 600 }}>DGCA Exam Guides</Link>.
    </SeriesHubPage>
  )
}
