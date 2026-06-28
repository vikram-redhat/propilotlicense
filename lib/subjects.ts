export const SUBJECTS = [
  {
    slug: 'aviation-meteorology',
    title: 'Aviation Meteorology',
    shortTitle: 'Meteorology',
    questionCount: 1851,
    examQuestions: 50,
    examMinutes: 90,
    passMarkPct: 70,
    description:
      'Cloud formations, weather systems, Indian climatology, METARs, TAFs, and atmospheric phenomena tested in the DGCA CPL and ATPL Meteorology paper.',
    primaryBookSlug: 'ic-joshi-aviation-meteorology',
    primaryBookLabel: 'Aviation Meteorology by IC Joshi',
    topicsHighYield: ['Thunderstorms', 'Indian Climatology', 'METAR/TAF decoding', 'Frontal systems', 'Icing'],
    faqs: [
      {
        q: 'How many questions are in the DGCA CPL Meteorology paper?',
        a: 'The DGCA CPL Meteorology paper contains 50 questions to be completed in 90 minutes. A minimum score of 70% (35 questions correct) is required to pass.',
      },
      {
        q: 'Which book should I use for DGCA CPL Meteorology?',
        a: 'Aviation Meteorology by Group Captain IC Joshi is the primary DGCA-prescribed textbook for the Meteorology paper. It is the only prescribed Indian text that covers Indian climatology and the monsoon system in the depth the DGCA tests.',
      },
      {
        q: 'Which topics in the DGCA Meteorology paper are most heavily tested?',
        a: 'Based on review by the ProPilotLicence captain panel: Thunderstorms (Chapter 8 of IC Joshi), Indian Climatology (Chapter 11), and METAR/TAF decoding (Chapter 12) are the highest-yield topics. Frontal weather sequences and icing conditions are also tested consistently.',
      },
      {
        q: 'Is the DGCA Meteorology paper difficult?',
        a: 'Meteorology is considered one of the more manageable CPL subjects by candidates who study IC Joshi thoroughly. The most common failure point is Indian climatology — candidates who use international textbooks only are underprepared for this section.',
      },
    ],
  },
  {
    slug: 'air-regulations',
    title: 'Air Regulations',
    shortTitle: 'Air Regulations',
    questionCount: 1228,
    examQuestions: 50,
    examMinutes: 90,
    passMarkPct: 70,
    description:
      'ICAO Annexes, DGCA Civil Aviation Requirements (CARs), Rules of the Air, airspace classification, licensing requirements, and ATC procedures.',
    primaryBookSlug: 'rk-bali-air-regulations',
    primaryBookLabel: 'Air Regulations for CPL/ATPL by RK Bali',
    topicsHighYield: ['Rules of the Air', 'Licensing', 'Communication failure', 'Accident investigation definitions', 'ICAO Annex 2'],
    faqs: [
      {
        q: 'How many questions are in the DGCA CPL Air Regulations paper?',
        a: 'The DGCA CPL Air Regulations paper contains 50 questions to be completed in 90 minutes. A minimum score of 70% is required to pass.',
      },
      {
        q: 'Which book should I use for DGCA Air Regulations?',
        a: 'Air Regulations for CPL/ATPL by Wing Commander RK Bali is the primary prescribed text for the DGCA Air Regulations paper. For regulatory content updated after your edition of Bali, supplement with current DGCA Civil Aviation Requirements (CARs) available free on the DGCA website.',
      },
      {
        q: 'Why do more candidates fail Air Regulations than other CPL subjects?',
        a: 'Air Regulations fails more candidates than any other CPL subject for two reasons: volume (the syllabus covers 18 ICAO Annexes plus the full body of DGCA CARs) and specificity (the DGCA tests precise regulatory values, not general understanding). Vague familiarity with the material does not pass this paper.',
      },
      {
        q: 'Does the DGCA Air Regulations paper reflect current regulations?',
        a: 'Yes. The DGCA updates its examination content to reflect current Civil Aviation Requirements. ProPilotLicence questions are reviewed against current DGCA CARs by the captain panel before publication, ensuring they reflect the regulatory environment as it stands today.',
      },
    ],
  },
  {
    slug: 'air-navigation',
    title: 'Air Navigation',
    shortTitle: 'Navigation',
    questionCount: 1906,
    examQuestions: 100,
    examMinutes: 180,
    passMarkPct: 70,
    description:
      'Dead reckoning, chart projections, VOR/DME/NDB navigation, GPS, flight planning, wind triangle calculations, mass and balance, and fuel planning.',
    primaryBookSlug: null,
    primaryBookLabel: null,
    topicsHighYield: ['Wind triangle calculations', '1-in-60 rule', 'Chart projections', 'VOR/DME', 'Mass and balance'],
    faqs: [
      {
        q: 'How many questions are in the DGCA CPL Air Navigation paper?',
        a: 'The DGCA CPL Air Navigation paper contains 100 questions to be completed in 180 minutes. A minimum score of 70% is required to pass.',
      },
      {
        q: 'Which book should I use for DGCA Air Navigation?',
        a: 'Air Navigation by Group Captain DP Khanna is the primary Indian reference for the DGCA Navigation paper. Navigation for Pilots by RK Bali is also prescribed and commonly used alongside Khanna. Candidates wanting additional worked examples often supplement with the Oxford Aviation Academy Navigation volume.',
      },
      {
        q: 'Is the DGCA Navigation paper calculation-heavy?',
        a: 'Yes. Air Navigation includes both conceptual questions and numerical problems. The wind triangle, 1-in-60 rule, and fuel endurance calculations must be executable accurately under exam time pressure. Practice with worked examples is essential — understanding the method is not sufficient without repetition.',
      },
    ],
  },
  {
    slug: 'technical-general',
    title: 'Technical General',
    shortTitle: 'Technical General',
    questionCount: 963,
    examQuestions: 100,
    examMinutes: 180,
    passMarkPct: 70,
    description:
      'Airframe systems, powerplant, hydraulics, electrical systems, pressurisation, and flight instruments applicable to all aircraft types.',
    primaryBookSlug: null,
    primaryBookLabel: null,
    topicsHighYield: ['Hydraulic systems', 'Pressurisation', 'Electrical systems', 'Flight instruments', 'Powerplant'],
    faqs: [
      {
        q: 'How many questions are in the DGCA CPL Technical General paper?',
        a: 'The DGCA CPL Technical General paper contains 100 questions to be completed in 180 minutes. A minimum score of 70% is required to pass.',
      },
      {
        q: 'Which book should I use for DGCA Technical General?',
        a: 'Aircraft General Engineering and Maintenance Practices by AK Garg is the standard Indian reference. The Oxford Aviation Academy Airframes and Systems and Powerplant volumes are used by candidates wanting more engineering depth.',
      },
      {
        q: 'What is the best approach to studying Technical General?',
        a: 'Technical General rewards understanding of how systems work over memorisation of facts. Study each system (hydraulic, electrical, pressurisation, etc.) by understanding its function, components, and failure modes — not just its definition. The DGCA tests application: what happens when a component fails, what does an abnormal reading indicate.',
      },
    ],
  },
  {
    slug: 'radio-aids-instruments',
    title: 'Radio Aids and Instruments',
    shortTitle: 'Radio Aids',
    questionCount: 1047,
    examQuestions: 50,
    examMinutes: 90,
    passMarkPct: 70,
    description:
      'Navigation instruments, radio navigation aids (VOR, DME, NDB, ILS), radar principles, GNSS, and electronic flight instruments.',
    primaryBookSlug: null,
    primaryBookLabel: null,
    topicsHighYield: ['ILS', 'VOR errors', 'GNSS/GPS', 'Transponder/SSR', 'Instrument errors'],
    faqs: [
      {
        q: 'How many questions are in the DGCA CPL Radio Aids and Instruments paper?',
        a: 'The DGCA CPL Radio Aids and Instruments paper contains 50 questions to be completed in 90 minutes. A minimum score of 70% is required to pass.',
      },
      {
        q: 'Which book should I use for DGCA Radio Aids and Instruments?',
        a: 'Radio Aids by RK Bali is the primary prescribed text for this subject. The Oxford Aviation Academy Radio Navigation volume is used by candidates wanting additional depth, particularly on ILS, VOR error analysis, and GNSS principles.',
      },
      {
        q: 'Has the DGCA increased GNSS content in the Radio Aids paper?',
        a: 'Yes. The DGCA has increased GPS and GNSS-related content in the Radio Aids paper in recent years. Candidates using older study materials should ensure their GNSS coverage is current. ProPilotLicence questions reflect the current paper composition.',
      },
    ],
  },
] as const

export type Subject = (typeof SUBJECTS)[number]

export function getSubjectBySlug(slug: string): Subject | undefined {
  return SUBJECTS.find((s) => s.slug === slug)
}
