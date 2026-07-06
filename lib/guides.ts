// Canonical registry for the site's "Guides" content hub — every guide series and
// article lives here. To add a new series: add an entry to GUIDE_SERIES, create
// app/guides/<slug>/page.tsx (a thin wrapper around SeriesHubPage), and add the
// article page.tsx files under app/guides/<slug>/<article-slug>/. Hub pages,
// sitemap, and header nav all derive from this array — nothing else needs editing
// to register a new series.

export type GuidePost = {
  slug: string
  title: string
  metaTitle: string
  metaDescription: string
  publishedAt: string
  updatedAt: string
  excerpt: string
  reviewedBy?: string
  seriesNavLabel?: string // short label for the in-article series-nav; falls back to title
}

export type GuideSeries = {
  slug: string
  navLabel: string
  title: string
  description: string
  posts: GuidePost[]
}

export const GUIDE_SERIES: GuideSeries[] = [
  {
    slug: 'become-a-pilot',
    navLabel: 'Become a Pilot',
    title: 'Become a Pilot in India',
    description:
      'Practical, unsentimental guides for aviation professionals considering the transition to commercial pilot. Honest costs, realistic timelines, and what your existing background gives you — and what it does not.',
    posts: [
      {
        slug: 'cabin-crew-to-pilot',
        title: 'Cabin Crew to Pilot in India — The Complete Transition Guide',
        metaTitle: 'Cabin Crew to Pilot in India — The Complete Transition Guide | ProPilotLicence',
        metaDescription:
          'A practical, unsentimental guide to transitioning from cabin crew to commercial pilot in India. Costs, timeline, medical requirements, age realities, and what nobody tells you before you start.',
        publishedAt: '2026-07-07',
        updatedAt: '2026-07-07',
        excerpt:
          'You already work in aviation. You understand aircraft, operations, and passengers better than most CPL candidates. None of that gives you any credit toward a pilot licence. Here is what the transition actually involves.',
        reviewedBy: 'ProPilotLicence Captain Panel',
        seriesNavLabel: 'Cabin crew to pilot — the complete transition guide',
      },
      {
        slug: 'ame-to-pilot',
        title: 'Aircraft Maintenance Engineer to Pilot in India — The Complete Transition Guide',
        metaTitle: 'AME to Pilot in India — The Complete Transition Guide | ProPilotLicence',
        metaDescription:
          'A practical guide for Aircraft Maintenance Engineers considering the transition to commercial pilot in India. Education eligibility, financial trade-offs, your technical advantage in theory exams, and the age maths you need to do first.',
        publishedAt: '2026-07-07',
        updatedAt: '2026-07-07',
        excerpt:
          'You already understand how aircraft work at a level most CPL candidates will never reach. That knowledge does not exempt you from a single hour of flight training. But it does give you a meaningful head start in ground school.',
        reviewedBy: 'ProPilotLicence Captain Panel',
        seriesNavLabel: 'Aircraft Maintenance Engineer to pilot — the complete transition guide',
      },
      {
        slug: 'aocs-to-pilot',
        title: 'Aviation Operations Staff to Pilot in India — The Complete Transition Guide',
        metaTitle: 'Aviation Operations Staff to Pilot in India — Complete Transition Guide | ProPilotLicence',
        metaDescription:
          'A practical guide for aviation operations staff — ground ops, flight dispatch, load control, crew scheduling — considering the transition to commercial pilot in India. What your ops background gives you, and what it does not.',
        publishedAt: '2026-07-07',
        updatedAt: '2026-07-07',
        excerpt:
          'Ground operations, flight dispatch, load control, crew scheduling — aviation operations staff understand how flights actually happen. That operational context is a genuine asset in pilot training. It does not give you a single credit toward flying hours.',
        reviewedBy: 'ProPilotLicence Captain Panel',
        seriesNavLabel: 'Aviation Operations staff to pilot — the complete transition guide',
      },
    ],
  },
  {
    slug: 'dgca-exam-guides',
    navLabel: 'DGCA Exam Guides',
    title: 'DGCA Exam Guides',
    description: 'Guides written for CPL and ATPL candidates, reviewed by the ProPilotLicence captain panel.',
    posts: [
      {
        slug: 'dgca-cpl-books',
        title: 'Which Books Should I Study for the DGCA CPL Theory Exams? (2026 Guide)',
        metaTitle: 'Which Books to Study for DGCA CPL Exams — Complete 2026 Guide | ProPilotLicence',
        metaDescription:
          'The complete guide to DGCA-prescribed textbooks for CPL theory exams. Which books to buy for Meteorology, Air Regulations, Navigation, Technical General, and Radio Aids.',
        publishedAt: '2026-06-01',
        updatedAt: '2026-06-01',
        excerpt:
          'The DGCA prescribes specific textbooks for each subject. This guide covers the books that actually matter for exam preparation — subject by subject — based on review by active airline captains.',
        reviewedBy: 'ProPilotLicence Captain Panel',
      },
      {
        slug: 'dgca-cpl-meteorology-preparation',
        title: 'How to Prepare for the DGCA CPL Meteorology Exam — Complete Study Guide',
        metaTitle: 'How to Prepare for the DGCA CPL Meteorology Exam — Complete Study Guide | ProPilotLicence',
        metaDescription:
          'A complete guide to preparing for the DGCA CPL Aviation Meteorology paper. Which book to use, which chapters matter most, how to approach Indian climatology, and what to expect on exam day.',
        publishedAt: '2026-06-15',
        updatedAt: '2026-06-15',
        excerpt:
          'The DGCA Meteorology paper catches candidates who studied from international textbooks and skipped Indian climatology. This guide covers exactly what to study, in what order, and where most marks are lost.',
        reviewedBy: 'ProPilotLicence Captain Panel',
      },
      {
        slug: 'a320-autoflight-system',
        title: 'A320 Autoflight System — AP, FD, ATHR, FCU and FMA Logic',
        metaTitle: 'A320 Autoflight System — AP, FD, ATHR, FCU and FMA Logic | ProPilotLicence',
        metaDescription:
          'A complete guide to the A320 autoflight system. Autopilot modes, Flight Director, Autothrust, FCU operation, FMA logic, and managed vs selected guidance — explained for ATPL and type rating candidates.',
        publishedAt: '2026-07-05',
        updatedAt: '2026-07-05',
        excerpt:
          'The A320 autoflight system does not merely fly the aircraft — it communicates its intentions through the FMA on every mode change. Pilots who understand that conversation rarely get surprised.',
        reviewedBy: 'ProPilotLicence Captain Panel',
      },
    ],
  },
]

export function getSeries(slug: string): GuideSeries | undefined {
  return GUIDE_SERIES.find(s => s.slug === slug)
}

export function getPost(seriesSlug: string, postSlug: string): GuidePost | undefined {
  return getSeries(seriesSlug)?.posts.find(p => p.slug === postSlug)
}

const SERIES_NAV_UPCOMING: Record<string, { label: string }[]> = {
  'become-a-pilot': [{ label: '4. Starting from scratch — the complete CPL roadmap for India' }],
}

export function seriesNavItems(seriesSlug: string, currentSlug: string) {
  const series = getSeries(seriesSlug)
  const items = (series?.posts ?? []).map((post, i) => ({
    label: `${i + 1}. ${post.seriesNavLabel ?? post.title}`,
    href: `/guides/${seriesSlug}/${post.slug}`,
    state: (post.slug === currentSlug ? 'current' : 'link') as 'current' | 'link',
  }))
  const upcoming = (SERIES_NAV_UPCOMING[seriesSlug] ?? []).map(u => ({ label: u.label, state: 'upcoming' as const }))
  return [...items, ...upcoming]
}
