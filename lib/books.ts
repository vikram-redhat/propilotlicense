export const BOOKS = [
  {
    slug: 'ic-joshi-aviation-meteorology',
    updatedAt: '2026-11-08', // last change to this book page's own content; the sitemap also counts chapter and question changes
    title: 'Aviation Meteorology',
    author: 'Group Captain IC Joshi (IAF, Retd.)',
    authorShort: 'IC Joshi',
    publisher: 'Himalayan Books',
    subjectSlug: 'aviation-meteorology',
    subjectTitle: 'Aviation Meteorology',
    dgcaPrescribed: true,
    description:
      'The primary DGCA-prescribed textbook for the CPL and ATPL Meteorology examination. The only prescribed Indian text that covers Indian climatology, the monsoon system, and subcontinent-specific weather phenomena in the depth the DGCA tests.',
    // Chapter list is read from the chapters table (Captain Panel verified, 2019 edition).
    sourceBookId: 'd05dc941-d49b-4fb3-aab8-a1759e518e8b',
    faqs: [
      {
        q: 'Is IC Joshi sufficient for the DGCA CPL Meteorology exam?',
        a: 'IC Joshi covers the DGCA Meteorology syllabus comprehensively and is the primary reference for the exam. Most successful candidates use Joshi as their main text and supplement with the DGCA AIP India for current METAR/TAF formats.',
      },
      {
        q: 'Which chapters of IC Joshi are most heavily tested in the DGCA exam?',
        a: 'The ProPilotLicence Captain Panel rates nine chapters High exam weight: Chapters 1 to 7 (Atmosphere, Atmospheric Pressure, Temperature, Air Density, Humidity, Winds, and Visibility and Fog), Chapter 13 (Thunderstorm) and Chapter 21 (Meteorological Services for Aviation). The weight of every chapter is shown in the chapter-by-chapter breakdown on this page.',
      },
      {
        q: 'Can I practise just one chapter of IC Joshi at a time on ProPilotLicence?',
        a: 'Yes. The chapter-wise practice mode lets you select any chapter of IC Joshi and drill only those questions. You can also combine chapters in a single session.',
      },
      {
        q: 'Is the IC Joshi question bank on ProPilotLicence up to date?',
        a: 'All questions are reviewed by the ProPilotLicence captain panel for current accuracy against the DGCA syllabus and the 2019 edition of the book.',
      },
    ],
    sampleQuestion: {
      text: 'During the southwest monsoon season in India, which of the following statements about the ITCZ position is correct?',
      options: [
        'The ITCZ lies south of the equator over the Indian subcontinent',
        'The ITCZ shifts northward, bringing moist southwesterly winds across peninsular India',
        'The ITCZ remains stationary over the Bay of Bengal throughout the monsoon season',
        'The ITCZ weakens significantly during peak monsoon months',
      ],
      correctIndex: 1,
      explanation:
        'During the southwest monsoon (June–September), the Inter-Tropical Convergence Zone (ITCZ) shifts northward over the Indian subcontinent, drawing warm moist air from the Arabian Sea and Bay of Bengal across peninsular India. This northward displacement is the primary driver of the southwest monsoon onset. The ITCZ does not remain stationary — its northward migration is what brings rainfall progressively from Kerala through to northern India.',
      sourceChapter: 19,
      sourceChapterTitle: 'Climatology India',
    },
  },
  {
    slug: 'rk-bali-air-regulations',
    updatedAt: '2026-11-08',
    title: 'Air Regulations for CPL/ATPL',
    author: 'Wing Commander RK Bali (IAF, Retd.)',
    authorShort: 'RK Bali',
    publisher: 'Sterling Book House',
    subjectSlug: 'air-regulations',
    subjectTitle: 'Air Regulations',
    // Question count (lib/live-counts.ts) is the active questions citing this book.
    questionsBookId: '15db3a2f-0718-4f98-beeb-177d9b92a4a4',
    dgcaPrescribed: true,
    description:
      'The standard DGCA-prescribed reference for the CPL and ATPL Air Regulations examination. Covers all 18 ICAO Annexes as applicable to Indian operations, DGCA Civil Aviation Requirements, Rules of the Air, licensing, and ATC procedures.',
    chapterBreakdown: [
      { number: 1, title: 'Introduction to Air Law', notes: 'Sources of air law, ICAO structure, the Chicago Convention. The DGCA tests the relationship between ICAO SARPs and domestic regulation.' },
      { number: 2, title: 'ICAO and International Conventions', notes: 'Chicago, Tokyo, Hague, Montreal Conventions. Know what each covers, not just that it exists.' },
      { number: 3, title: 'Aircraft Nationality and Registration', notes: 'Straightforward chapter — reliable source of easy marks. Know the Indian nationality mark (VT-).' },
      { number: 4, title: 'Airworthiness', notes: 'Certificate of Airworthiness validity and conditions under which it lapses are tested consistently.' },
      { number: 5, title: 'Licensing', notes: 'Most consistently tested chapter. CPL vs ATPL privileges, recency requirements, medical classes — know them precisely.' },
      { number: 6, title: 'Rules of the Air', notes: 'Right-of-way hierarchy and VFR minima by airspace class appear in virtually every paper.' },
      { number: 7, title: 'Air Traffic Services', notes: 'Communication failure procedures are tested specifically — the sequence and transponder code matter.' },
      { number: 8, title: 'Aerodromes', notes: 'Visual aid identification (runway markings, holding position signs, runway guard lights) appears regularly.' },
      { number: 9, title: 'Facilitation', notes: 'Lighter chapter in exam weight but produces straightforward marks when studied.' },
      { number: 10, title: 'Search and Rescue', notes: 'SAR phases (uncertainty, alert, distress) and their trigger conditions are tested reliably.' },
      { number: 11, title: 'Aircraft Accident Investigation', notes: 'Annex 13 definitions are tested exactly — learn the difference between accident, serious incident, and incident word-for-word.' },
      { number: 12, title: 'Civil Aviation Requirements (CARs)', notes: 'Where regulatory currency matters most. ProPilotLicence questions in this section are reviewed against current DGCA CARs.' },
    ],
    faqs: [
      {
        q: 'Is RK Bali sufficient for the DGCA Air Regulations exam?',
        a: 'Bali covers the syllabus comprehensively and is sufficient for most of the paper. For regulatory content updated after your edition of Bali, supplement with current DGCA CARs available free on the DGCA website. ProPilotLicence questions are reviewed against current CARs.',
      },
      {
        q: 'Which chapters of RK Bali are most heavily tested?',
        a: 'Chapter 5 (Licensing) and Chapter 6 (Rules of the Air) are the most consistently tested. Chapter 7 (Air Traffic Services), specifically communication failure procedures, produces questions candidates lose marks on disproportionately. Chapter 11 (Accident Investigation) definitions are tested exactly — learn the Annex 13 definitions precisely.',
      },
      {
        q: 'How often does the Air Regulations syllabus change?',
        a: 'DGCA Civil Aviation Requirements are updated regularly. In 2024–25, significant updates included amendments to drone regulations and RTR(A) licensing. The ProPilotLicence captain panel reviews Air Regulations questions specifically for currency.',
      },
      {
        q: 'Can I practise just the CARs-related questions separately from ICAO Annex questions?',
        a: 'Yes. ProPilotLicence allows filtering by chapter, separating ICAO Annex chapters from CARs-specific content.',
      },
    ],
    sampleQuestion: {
      text: 'An aircraft in distress has right of way over all other aircraft. Which of the following aircraft has the LOWEST priority in the right of way hierarchy under ICAO Annex 2?',
      options: [
        'An aircraft on final approach to land',
        'An aircraft towing another aircraft or object',
        'An airship',
        'A powered aircraft',
      ],
      correctIndex: 3,
      explanation:
        'Under ICAO Annex 2, the right of way hierarchy (highest to lowest priority) is: aircraft in distress → balloons → gliders → airships → aircraft towing → powered aircraft. A powered aircraft has the lowest priority, meaning it must give way to all other categories. This is frequently tested because candidates instinctively assume powered aircraft have priority over slower or less manoeuvrable types. The rule is the opposite.',
      sourceChapter: 6,
      sourceChapterTitle: 'Rules of the Air',
    },
  },
] as const

export type Book = (typeof BOOKS)[number]

export function getBookBySlug(slug: string): Book | undefined {
  return BOOKS.find((b) => b.slug === slug)
}
