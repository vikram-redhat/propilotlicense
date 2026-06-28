export const BLOG_POSTS = [
  {
    slug: 'dgca-cpl-books',
    title: 'Which Books Should I Study for the DGCA CPL Theory Exams? (2026 Guide)',
    metaTitle: 'Which Books to Study for DGCA CPL Exams — Complete 2026 Guide | ProPilotLicence',
    metaDescription:
      'The complete guide to DGCA-prescribed textbooks for CPL theory exams. Which books to buy for Meteorology, Air Regulations, Navigation, Technical General, and Radio Aids.',
    publishedAt: '2026-06-01',
    updatedAt: '2026-06-01',
    reviewedBy: 'ProPilotLicence Captain Panel',
    excerpt:
      'The DGCA prescribes specific textbooks for each subject. This guide covers the books that actually matter for exam preparation — subject by subject — based on review by active airline captains.',
    keywords: [
      'DGCA CPL books',
      'DGCA prescribed textbooks',
      'which books for DGCA CPL',
      'IC Joshi DGCA',
      'RK Bali DGCA',
    ],
  },
] as const

export type BlogPost = (typeof BLOG_POSTS)[number]
