import Link from 'next/link'
import { buildMetadata } from '@/lib/metadata'
import { getSeries } from '@/lib/guides'
import { A320_SYSTEMS_SERIES } from '@/lib/a320-series'
import { SeriesHubPage } from '@/components/guides/SeriesHubPage'

export const metadata = buildMetadata({
  title: 'A320 Systems — Hydraulics, Flight Controls and Autoflight | ProPilotLicence',
  description:
    'How the A320 family systems work, for type rating and ATPL candidates. Hydraulic system, fly-by-wire flight controls and control laws, autoflight (AP, FD, ATHR, FCU, FMA), with more systems to come.',
  path: '/guides/a320-systems',
})

export default function A320SystemsHubPage() {
  const upcoming = A320_SYSTEMS_SERIES.items.filter(item => !item.slug).map(item => item.label)
  return (
    <SeriesHubPage series={getSeries('a320-systems')!} upcoming={upcoming}>
      Looking for operating technique rather than how the systems are built? ECAM handling, circuits and
      approaches are in{' '}
      <Link href="/guides/a320-procedures" style={{ color: 'var(--clr-primary)', textDecoration: 'none', fontWeight: 600 }}>A320 Operations and Procedures</Link>.
    </SeriesHubPage>
  )
}
