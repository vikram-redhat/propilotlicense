export const BOOKS = [
  {
    slug: 'ic-joshi-aviation-meteorology',
    title: 'Aviation Meteorology',
    author: 'Group Captain IC Joshi (IAF, Retd.)',
    authorShort: 'IC Joshi',
    publisher: 'Himalayan Books',
    subjectSlug: 'aviation-meteorology',
    subjectTitle: 'Aviation Meteorology',
    questionCount: 1851,
    dgcaPrescribed: true,
    description:
      'The primary DGCA-prescribed textbook for the CPL and ATPL Meteorology examination. The only prescribed Indian text that covers Indian climatology, the monsoon system, and subcontinent-specific weather phenomena in the depth the DGCA tests.',
    chapterBreakdown: [
      { number: 1, title: 'The Atmosphere', notes: 'Structure of the atmosphere, ISA values, lapse rates. ISA calculations appear in every paper — know the numbers.' },
      { number: 2, title: 'Temperature', notes: 'Temperature inversions and their role in fog formation are tested frequently.' },
      { number: 3, title: 'Atmospheric Pressure', notes: 'Altimeter settings (QNH, QFE, QNE) and pressure altitude. These appear in both Meteorology and Navigation papers.' },
      { number: 4, title: 'Wind', notes: 'Geostrophic wind, wind shear, jet streams. The DGCA tests jet stream characteristics at cruising altitude.' },
      { number: 5, title: 'Humidity, Clouds and Fog', notes: 'Cloud type identification and fog formation (radiation, advection, steam) are tested frequently.' },
      { number: 6, title: 'Precipitation', notes: 'Freezing rain and ice pellets are tested specifically for their icing risk implications.' },
      { number: 7, title: 'Air Masses and Fronts', notes: 'Frontal weather sequences are a staple — expect 2–3 questions on weather before, during, and after a front passage.' },
      { number: 8, title: 'Thunderstorms', notes: 'The highest-yield topic in the entire Meteorology paper. The DGCA tests this chapter more heavily than any other.' },
      { number: 9, title: 'Icing', notes: 'Icing questions often combine meteorological conditions with performance implications.' },
      { number: 10, title: 'Turbulence', notes: 'Clear air turbulence (CAT) associated with jet streams is tested consistently.' },
      { number: 11, title: 'Indian Climatology', notes: 'The chapter that separates candidates who studied Joshi from those who used international texts only. Expect 3–5 questions per paper.' },
      { number: 12, title: 'Aviation Weather Reports and Forecasts', notes: 'METAR decoding questions appear in almost every paper. Know the format cold.' },
    ],
    faqs: [
      {
        q: 'Is IC Joshi sufficient for the DGCA CPL Meteorology exam?',
        a: 'IC Joshi covers the DGCA Meteorology syllabus comprehensively and is the primary reference for the exam. Most successful candidates use Joshi as their main text and supplement with the DGCA AIP India for current METAR/TAF formats.',
      },
      {
        q: 'Which chapters of IC Joshi are most heavily tested in the DGCA exam?',
        a: 'Based on review by the ProPilotLicence captain panel: Chapter 8 (Thunderstorms) and Chapter 11 (Indian Climatology) are consistently the highest-yield chapters. Chapter 12 (Aviation Weather Reports) is reliable for METAR/TAF decoding questions. Chapter 7 (Air Masses and Fronts) produces consistent questions on frontal sequences.',
      },
      {
        q: 'Can I practise just one chapter of IC Joshi at a time on ProPilotLicence?',
        a: 'Yes. The chapter-wise practice mode lets you select any chapter of IC Joshi and drill only those questions. You can also combine chapters in a single session.',
      },
      {
        q: 'Is the IC Joshi question bank on ProPilotLicence up to date?',
        a: 'All questions are reviewed by the ProPilotLicence captain panel for current accuracy against the DGCA syllabus and current edition of the book.',
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
      sourceChapter: 11,
      sourceChapterTitle: 'Indian Climatology',
    },
  },
  {
    slug: 'rk-bali-air-regulations',
    title: 'Air Regulations for CPL/ATPL',
    author: 'Wing Commander RK Bali (IAF, Retd.)',
    authorShort: 'RK Bali',
    publisher: 'Sterling Book House',
    subjectSlug: 'air-regulations',
    subjectTitle: 'Air Regulations',
    questionCount: 1228,
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
