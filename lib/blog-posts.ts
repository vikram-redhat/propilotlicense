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
  {
    slug: 'a320-autoflight-system',
    title: 'A320 Autoflight System — AP, FD, ATHR, FCU and FMA Logic',
    metaTitle: 'A320 Autoflight System — AP, FD, ATHR, FCU and FMA Logic | ProPilotLicence',
    metaDescription:
      'A complete guide to the A320 autoflight system. Autopilot modes, Flight Director, Autothrust, FCU operation, FMA logic, and managed vs selected guidance — explained for ATPL and type rating candidates.',
    publishedAt: '2026-07-05',
    updatedAt: '2026-07-05',
    reviewedBy: 'ProPilotLicence Captain Panel',
    excerpt:
      'The A320 autoflight system does not merely fly the aircraft — it communicates its intentions through the FMA on every mode change. Pilots who understand that conversation rarely get surprised.',
    keywords: [
      'A320 autoflight system',
      'A320 FMA',
      'A320 autopilot modes',
      'A320 ATHR',
      'FCU push pull',
      'managed vs selected A320',
    ],
  },
] as const

export type BlogPost = (typeof BLOG_POSTS)[number]
