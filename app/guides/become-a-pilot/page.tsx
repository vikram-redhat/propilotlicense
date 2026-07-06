import { buildMetadata } from '@/lib/metadata'
import { getSeries } from '@/lib/guides'
import { SeriesHubPage } from '@/components/guides/SeriesHubPage'

export const metadata = buildMetadata({
  title: 'Become a Pilot in India — Career Transition Guides | ProPilotLicence',
  description:
    'Practical guides for aviation professionals considering the transition to commercial pilot in India. Cabin crew, AMEs, and operations staff — honest costs, timelines, and what your background gives you.',
  path: '/guides/become-a-pilot',
})

export default function BecomeAPilotHubPage() {
  return <SeriesHubPage series={getSeries('become-a-pilot')!} />
}
