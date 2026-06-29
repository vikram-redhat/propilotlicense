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
  {
    slug: 'dgca-cpl-meteorology-preparation',
    title: 'How to Prepare for the DGCA CPL Meteorology Exam — Complete Study Guide',
    metaTitle: 'How to Prepare for the DGCA CPL Meteorology Exam — Complete Study Guide | ProPilotLicence',
    metaDescription:
      'A complete guide to preparing for the DGCA CPL Aviation Meteorology paper. Which book to use, which chapters matter most, how to approach Indian climatology, and what to expect on exam day.',
    publishedAt: '2026-06-15',
    updatedAt: '2026-06-15',
    reviewedBy: 'ProPilotLicence Captain Panel',
    excerpt:
      'The DGCA Meteorology paper catches candidates who studied from international textbooks and skipped Indian climatology. This guide covers exactly what to study, in what order, and where most marks are lost.',
    keywords: [
      'DGCA CPL meteorology preparation',
      'how to prepare DGCA meteorology',
      'DGCA meteorology exam guide',
      'IC Joshi meteorology',
      'DGCA aviation meteorology',
    ],
  },
] as const

export type BlogPost = (typeof BLOG_POSTS)[number]
