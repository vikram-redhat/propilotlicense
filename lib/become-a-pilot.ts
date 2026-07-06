export const BECOME_A_PILOT_POSTS = [
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
  },
] as const

export type BecomeAPilotPost = (typeof BECOME_A_PILOT_POSTS)[number]

const SERIES_NAV_BASE = [
  { slug: 'cabin-crew-to-pilot', label: '1. Cabin crew to pilot — the complete transition guide' },
  { slug: 'ame-to-pilot', label: '2. Aircraft Maintenance Engineer to pilot — the complete transition guide' },
  { slug: 'aocs-to-pilot', label: '3. Aviation Operations staff to pilot — the complete transition guide' },
]

export function seriesNavItems(currentSlug: string) {
  return [
    ...SERIES_NAV_BASE.map(item => ({
      label: item.label,
      href: `/become-a-pilot/${item.slug}`,
      state: (item.slug === currentSlug ? 'current' : 'link') as 'current' | 'link',
    })),
    { label: '4. Starting from scratch — the complete CPL roadmap for India', state: 'upcoming' as const },
  ]
}
