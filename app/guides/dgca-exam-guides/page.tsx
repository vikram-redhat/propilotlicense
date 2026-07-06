import { buildMetadata } from '@/lib/metadata'
import { getSeries } from '@/lib/guides'
import { SeriesHubPage } from '@/components/guides/SeriesHubPage'

export const metadata = buildMetadata({
  title: 'DGCA Exam Guides | ProPilotLicence',
  description:
    'Guides and resources for DGCA CPL and ATPL theory examinations, reviewed by active commercial airline captains.',
  path: '/guides/dgca-exam-guides',
})

export default function DgcaExamGuidesHubPage() {
  return <SeriesHubPage series={getSeries('dgca-exam-guides')!} />
}
