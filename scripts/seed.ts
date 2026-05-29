import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'
import { resolve } from 'path'

dotenv.config({ path: resolve(process.cwd(), '.env.local') })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const subjects = [
  {
    name: 'Meteorology',
    code: 'MET',
    icon_name: 'wind',
    description: `Meteorology is the study of the Earth's atmosphere and the weather phenomena that affect aviation. For pilots, a thorough understanding of meteorology is essential for safe flight operations. This subject covers the structure and composition of the atmosphere, pressure systems, temperature and humidity, clouds, precipitation, thunderstorms, icing, visibility, fronts, and the interpretation of aviation weather reports and forecasts including METAR, TAF, SIGMET, and AIRMET. Pilots must be able to anticipate and respond to weather hazards including windshear, microbursts, clear air turbulence, and in-flight icing conditions.`,
    licence_types: ['CPL', 'ATPL'],
    sort_order: 1,
    active: true,
  },
  {
    name: 'Air Regulations',
    code: 'REG',
    icon_name: 'gavel',
    description: `Air Regulations covers the legal and procedural framework governing civil aviation in India and internationally. This subject includes the Aircraft Act 1934, Aircraft Rules, DGCA Civil Aviation Requirements (CARs), ICAO Annexes and associated documentation, the Aeronautical Information Publication (AIP) India, airspace classification, flight rules (VFR and IFR), ATC procedures, pilot licensing requirements, flight and duty time limitations, accident and incident reporting, and human performance and limitations. A sound knowledge of air regulations is a legal requirement for all licensed pilots operating in Indian and international airspace.`,
    licence_types: ['CPL', 'ATPL'],
    sort_order: 2,
    active: true,
  },
]

const sourceBooks: { subjectCode: string; title: string; author: string; licence_types: string[]; sort_order: number }[] = [
  // Meteorology
  { subjectCode: 'MET', title: 'Aviation Meteorology',                    author: 'IC Joshi',               licence_types: ['CPL', 'ATPL'], sort_order: 1 },
  { subjectCode: 'MET', title: 'Ground Studies for Pilots – Meteorology', author: 'Underdown & Standen',    licence_types: ['CPL', 'ATPL'], sort_order: 2 },
  { subjectCode: 'MET', title: 'Meteorology',                             author: 'Nordian',                licence_types: ['CPL', 'ATPL'], sort_order: 3 },
  { subjectCode: 'MET', title: 'Meteorology',                             author: 'Oxford',                 licence_types: ['CPL', 'ATPL'], sort_order: 4 },
  { subjectCode: 'MET', title: 'Meteorology for Pilot',                   author: 'Mike Wickson',           licence_types: ['CPL', 'ATPL'], sort_order: 5 },
  // Air Regulations
  { subjectCode: 'REG', title: 'Air Law',                                 author: 'Oxford',                 licence_types: ['CPL', 'ATPL'], sort_order: 1 },
  { subjectCode: 'REG', title: 'Air Regulations',                         author: 'RK Bali',                licence_types: ['CPL', 'ATPL'], sort_order: 2 },
  { subjectCode: 'REG', title: 'Air Law and ATC Procedures',              author: 'Nordian',                licence_types: ['CPL', 'ATPL'], sort_order: 3 },
  { subjectCode: 'REG', title: 'Air Regulations for Pilots',              author: 'V Krishnan & AK Chopra', licence_types: ['CPL', 'ATPL'], sort_order: 4 },
  { subjectCode: 'REG', title: 'Aircraft Act 1934',                       author: 'India',                  licence_types: ['CPL', 'ATPL'], sort_order: 5 },
  { subjectCode: 'REG', title: 'Aircraft Rules 1920, 1937, 1954 & 2003', author: 'India',                  licence_types: ['CPL', 'ATPL'], sort_order: 6 },
  { subjectCode: 'REG', title: 'DGCA Civil Aviation Requirements (CAR)',  author: 'DGCA',                   licence_types: ['CPL', 'ATPL'], sort_order: 7 },
  { subjectCode: 'REG', title: 'Human Performance & Limitations',         author: 'Nordian',                licence_types: ['CPL', 'ATPL'], sort_order: 8 },
  { subjectCode: 'REG', title: 'Human Performance & Limitations',         author: 'Oxford',                 licence_types: ['CPL', 'ATPL'], sort_order: 9 },
  { subjectCode: 'REG', title: 'ICAO Annexes',                            author: 'ICAO',                   licence_types: ['CPL', 'ATPL'], sort_order: 10 },
  { subjectCode: 'REG', title: 'ICAO Docs',                               author: 'ICAO',                   licence_types: ['CPL', 'ATPL'], sort_order: 11 },
  { subjectCode: 'REG', title: 'AIP India',                               author: 'India',                  licence_types: ['CPL', 'ATPL'], sort_order: 12 },
]

const topicsByCode: Record<string, string[]> = {
  MET: [
    'Atmosphere structure', 'Pressure and altimetry', 'Temperature',
    'Winds and circulation', 'Clouds and precipitation', 'Thunderstorms',
    'Icing', 'Visibility and fog', 'Fronts', 'ITCZ',
    'METAR and TAF decode', 'SIGMET and AIRMET', 'Turbulence', 'Wind shear',
  ],
  REG: [
    'ICAO annexes', 'DGCA CAR series', 'Aircraft Act and Rules',
    'Flight rules – VFR', 'Flight rules – IFR', 'ATC procedures',
    'Airspace classification', 'Licensing requirements',
    'Flight and duty time limitations', 'Accident and incident reporting',
    'Human performance and limitations', 'AIP India',
  ],
}

const sampleQuestions: Record<string, {
  question_text: string
  difficulty: 'easy' | 'medium' | 'hard'
  explanation: string
  options: { A: string; B: string; C: string; D: string }
  correct: 'A' | 'B' | 'C' | 'D'
  bookTitle: string
  source_chapter: string
  source_page: string
}[]> = {
  MET: [
    {
      question_text: 'The standard lapse rate of temperature in the troposphere is approximately:',
      difficulty: 'easy',
      explanation: 'The International Standard Atmosphere (ISA) defines the standard temperature lapse rate in the troposphere as 2°C per 1,000 feet (6.5°C per 1,000 metres). This rate represents the average decrease in temperature with altitude under standard conditions. In practice, the actual lapse rate varies considerably depending on local meteorological conditions, moisture content, and time of day. When the lapse rate exceeds 3°C per 1,000 feet, the atmosphere is considered superadiabatic and highly unstable. Pilots must account for temperature deviations from ISA when calculating aircraft performance, as a warmer-than-standard atmosphere reduces air density, adversely affecting engine output and lift generation.',
      options: { A: '1°C per 1,000 ft', B: '2°C per 1,000 ft', C: '3°C per 1,000 ft', D: '4°C per 1,000 ft' },
      correct: 'B',
      bookTitle: 'Aviation Meteorology',
      source_chapter: 'Chapter 2',
      source_page: 'Page 18',
    },
    {
      question_text: 'A METAR observation of "TS" indicates:',
      difficulty: 'easy',
      explanation: 'In METAR weather observations, the present weather group uses two-letter codes standardised by ICAO to describe significant weather phenomena. The code "TS" denotes thunderstorm, defined as a discharge of atmospheric electricity accompanied by thunder and lightning. A thunderstorm is one of the most hazardous meteorological phenomena in aviation, associated with severe turbulence, heavy precipitation, icing, strong wind shear, and lightning. When "TS" appears without a precipitation qualifier, it indicates a thunderstorm is occurring at the aerodrome without precipitation reaching the surface. Pilots must treat any thunderstorm observation in a METAR as a significant operational hazard requiring careful route and approach planning.',
      options: { A: 'Turbulent conditions only', B: 'Thunderstorm', C: 'Transient shower', D: 'Towering cumulus' },
      correct: 'B',
      bookTitle: 'Aviation Meteorology',
      source_chapter: 'Chapter 11',
      source_page: 'Page 142',
    },
    {
      question_text: 'In the Northern Hemisphere, wind flows around a low pressure system:',
      difficulty: 'medium',
      explanation: 'In the Northern Hemisphere, the Coriolis force deflects moving air parcels to the right of their direction of motion. As surface pressure gradients drive air inward toward a low pressure centre, this rightward Coriolis deflection causes the converging air to spiral counter-clockwise around the low — a circulation pattern known as cyclonic flow. The combination of the pressure gradient force, the Coriolis force, and surface friction produces the characteristic inward and counter-clockwise flow associated with Northern Hemisphere surface lows. At higher altitudes, friction diminishes and the flow becomes nearly geostrophic — parallel to the isobars. In the Southern Hemisphere, Coriolis deflection is to the left, reversing the pattern so that air circulates clockwise around a low.',
      options: { A: 'Clockwise and outward', B: 'Clockwise and inward', C: 'Counter-clockwise and inward', D: 'Counter-clockwise and outward' },
      correct: 'C',
      bookTitle: 'Aviation Meteorology',
      source_chapter: 'Chapter 4',
      source_page: 'Page 52',
    },
    {
      question_text: 'Structural icing is most likely to occur in which cloud type?',
      difficulty: 'medium',
      explanation: 'Structural icing — the accretion of ice on exposed aircraft surfaces — requires two conditions: air temperature at or below 0°C, and the presence of supercooled liquid water droplets. Cumulonimbus clouds present the greatest icing hazard because they contain dense concentrations of large supercooled water droplets throughout a deep vertical column, often extending from near the freezing level to well above −20°C. The strong updrafts within cumulonimbus maintain supercooled droplets in suspension far below the temperature at which spontaneous freezing would otherwise occur. When an aircraft surface contacts these droplets, rapid freezing produces clear or mixed ice — the most structurally disruptive forms. Flight into or near cumulonimbus should be avoided for this reason, in addition to the hazards of severe turbulence and lightning.',
      options: { A: 'Cirrus', B: 'Cumulonimbus', C: 'Altostratus', D: 'Stratocumulus' },
      correct: 'B',
      bookTitle: 'Aviation Meteorology',
      source_chapter: 'Chapter 7',
      source_page: 'Page 89',
    },
    {
      question_text: 'Mountain wave turbulence is most intense:',
      difficulty: 'hard',
      explanation: 'Mountain waves form when stable air flows over a terrain barrier and the displaced air oscillates in standing waves on the lee side. The most severe turbulence occurs in the rotor zone — a region of closed, eddying circulation below the wave crests on the leeward side of the mountain. Rotor turbulence can be extreme and is particularly hazardous because it frequently occurs beneath the visible wave clouds, in clear air, and at altitudes well below the mountain peaks. The rotor zone is characterised by violent, irregular updrafts and downdrafts that can overwhelm the aircraft\'s structural limits. Pilots should maintain a substantial horizontal and vertical clearance from known rotor zones, and remain alert for the characteristic lenticular (lens-shaped) clouds that mark the wave crests above.',
      options: {
        A: 'On the windward side at mountain level',
        B: 'In the rotor zone beneath the wave crests on the leeward side',
        C: 'Directly over the mountain peaks',
        D: 'At altitudes above the tropopause only',
      },
      correct: 'B',
      bookTitle: 'Aviation Meteorology',
      source_chapter: 'Chapter 13',
      source_page: 'Page 178',
    },
  ],
  REG: [
    {
      question_text: 'ICAO Annex 2 covers:',
      difficulty: 'easy',
      explanation: 'ICAO Annex 2 — Rules of the Air — contains the international standards and recommended practices that govern how aircraft shall be operated in international airspace. The annex prescribes the general rules applicable to all aircraft, the visual flight rules (VFR), and the instrument flight rules (IFR), together with the signals used in air traffic communications. Annex 2 is one of nineteen technical annexes to the Convention on International Civil Aviation (Chicago Convention 1944) and has been adopted by all ICAO Contracting States as the basis for their national air law. Compliance with the Rules of the Air is a fundamental legal obligation for all pilots operating in controlled and uncontrolled airspace worldwide.',
      options: { A: 'Personnel licensing', B: 'Rules of the Air', C: 'Aerodromes', D: 'Air traffic services' },
      correct: 'B',
      bookTitle: 'ICAO Annexes',
      source_chapter: 'Annex 2',
      source_page: 'Page 1',
    },
    {
      question_text: 'Under DGCA regulations, the minimum visibility for VFR flight in Class G airspace below 3,000 ft AMSL is:',
      difficulty: 'easy',
      explanation: 'DGCA regulations, consistent with ICAO Annex 2 provisions, prescribe a minimum flight visibility of 5 km for VFR flight in Class G uncontrolled airspace at and below 3,000 feet above mean sea level (AMSL) or 1,000 feet above ground level (AGL), whichever is the higher altitude. Below this level, pilots are additionally required to remain clear of cloud, maintain sight of the surface, and maintain a minimum of 500 feet vertical distance from cloud when operating outside controlled airspace. These visibility requirements ensure that VFR pilots at low altitudes have sufficient forward visibility to detect and avoid other traffic, terrain, and obstacles. Non-compliance constitutes a serious airworthiness and safety violation under the Aircraft Rules.',
      options: { A: '1.5 km', B: '3 km', C: '5 km', D: '8 km' },
      correct: 'C',
      bookTitle: 'DGCA Civil Aviation Requirements (CAR)',
      source_chapter: 'CAR Section 2',
      source_page: 'Page 34',
    },
    {
      question_text: 'An aircraft operating IFR must maintain a minimum altitude of ___ above the highest obstacle within ___ nm of track:',
      difficulty: 'medium',
      explanation: 'Under ICAO Annex 2 and supporting procedures, aircraft operating in IFR conditions must maintain a minimum obstacle clearance altitude (MOCA) that ensures safe vertical separation from terrain and obstacles along the route of flight. In non-mountainous areas, the prescribed minimum altitude is 1,000 feet above the highest obstacle within 5 nautical miles either side of the intended track. In mountainous or designated high-terrain areas, this buffer is increased to 2,000 feet within the same lateral distance. These minima are designed to provide adequate clearance during normal instrument flight, taking into account altimetry errors, turbulence effects, and navigation system tolerances. Operators must verify the selected altitude for each segment provides the required obstacle clearance throughout.',
      options: { A: '500 ft within 5 nm', B: '1,000 ft within 5 nm', C: '2,000 ft within 10 nm', D: '1,500 ft within 8 nm' },
      correct: 'B',
      bookTitle: 'Air Regulations',
      source_chapter: 'Chapter 8',
      source_page: 'Page 112',
    },
    {
      question_text: 'Class B airspace requires all of the following EXCEPT:',
      difficulty: 'medium',
      explanation: 'Class B airspace in the ICAO classification system is typically established around the busiest commercial airports. To enter and operate within Class B airspace, a pilot must obtain an explicit ATC clearance before entry, maintain continuous two-way radio communication with ATC, and carry a functioning Mode C or ADS-B Out transponder that transmits altitude information. A filed flight plan, while standard practice for IFR operations, is not a statutory requirement for entry into Class B airspace under ICAO Annex 11. All traffic within Class B receives an ATC separation service. Pilots who penetrate Class B without a clearance commit a serious regulatory infringement and may face enforcement action by the relevant civil aviation authority.',
      options: {
        A: 'ATC clearance',
        B: 'Mode C or ADS-B Out transponder',
        C: 'Filed flight plan at least 1 hour prior',
        D: 'Two-way radio communication',
      },
      correct: 'C',
      bookTitle: 'ICAO Annexes',
      source_chapter: 'Annex 11',
      source_page: 'Page 45',
    },
    {
      question_text: 'Under ICAO Annex 1, an ATPL holder acting as P1 on a multi-crew aircraft must have performed within the preceding 90 days at least:',
      difficulty: 'hard',
      explanation: 'ICAO Annex 1 — Personnel Licensing — establishes the recency requirements that a pilot must maintain to exercise the privileges of a pilot licence on a specific aircraft type. For a pilot to act as pilot-in-command (P1) on a multi-crew aircraft, Annex 1 requires that within the preceding 90 days the pilot has completed at least 3 take-offs and 3 landings as the pilot flying (PF) on that aircraft type or on an approved simulator. These take-offs and landings must be performed in the capacity of pilot flying — passive observation or performing as pilot monitoring does not satisfy the requirement. The 90-day recency window runs continuously and must be maintained at all times while the pilot is exercising P1 privileges. Failure to maintain recency renders the licence privileges non-current until a check flight or simulator session is completed.',
      options: {
        A: '3 take-offs and 3 landings as pilot flying',
        B: '5 take-offs and 5 landings in any capacity',
        C: '1 instrument approach as pilot flying',
        D: '10 hours as P1 in the aircraft type',
      },
      correct: 'A',
      bookTitle: 'ICAO Annexes',
      source_chapter: 'Annex 1',
      source_page: 'Page 22',
    },
  ],
}

async function seed() {
  console.log('Seeding subjects…')
  const { data: insertedSubjects, error: subErr } = await supabase
    .from('subjects')
    .upsert(subjects, { onConflict: 'code' })
    .select()

  if (subErr) { console.error('Subjects error:', subErr); return }
  console.log(`  ✓ ${insertedSubjects?.length} subjects`)

  const subjectMap: Record<string, string> = {}
  insertedSubjects?.forEach(s => { subjectMap[s.code] = s.id })

  console.log('Seeding source books…')
  let bookCount = 0
  const bookMap: Record<string, Record<string, string>> = {}

  for (const book of sourceBooks) {
    const subId = subjectMap[book.subjectCode]
    if (!subId) continue
    const { data: b, error: bErr } = await supabase
      .from('source_books')
      .insert({ subject_id: subId, title: book.title, author: book.author, licence_types: book.licence_types, sort_order: book.sort_order })
      .select('id')
      .single()
    if (bErr) { console.error(`Book error (${book.title}):`, bErr); continue }
    if (!bookMap[book.subjectCode]) bookMap[book.subjectCode] = {}
    bookMap[book.subjectCode][book.title] = b!.id
    bookCount++
  }
  console.log(`  ✓ ${bookCount} source books`)

  console.log('Seeding topics…')
  let topicCount = 0
  const topicMap: Record<string, Record<string, string>> = {}

  for (const [code, topicNames] of Object.entries(topicsByCode)) {
    const subId = subjectMap[code]
    if (!subId) continue
    const rows = topicNames.map((name, i) => ({ subject_id: subId, name, sort_order: i + 1 }))
    const { data: tops, error: topErr } = await supabase.from('topics').upsert(rows, { onConflict: 'subject_id,name' }).select()
    if (topErr) { console.error(`Topics error (${code}):`, topErr); continue }
    topicCount += tops?.length || 0
    topicMap[code] = {}
    tops?.forEach(t => { topicMap[code][t.name] = t.id })
  }
  console.log(`  ✓ ${topicCount} topics`)

  console.log('Seeding sample questions…')
  let questionCount = 0

  for (const [code, qs] of Object.entries(sampleQuestions)) {
    const subId = subjectMap[code]
    if (!subId) continue

    for (const q of qs) {
      const bookId = bookMap[code]?.[q.bookTitle] ?? null

      const { data: newQ, error: qErr } = await supabase
        .from('questions')
        .insert({
          subject_id: subId,
          topic_id: null,
          source_book_id: bookId,
          question_text: q.question_text,
          difficulty: q.difficulty,
          explanation: q.explanation,
          source_chapter: q.source_chapter,
          source_page: q.source_page,
          citation_verified: false,
          source_type: 'manual',
          active: true,
        })
        .select('id')
        .single()

      if (qErr) { console.error(`Question error (${code}):`, qErr); continue }

      const optRows = (['A', 'B', 'C', 'D'] as const).map(letter => ({
        question_id: newQ!.id,
        option_letter: letter,
        option_text: q.options[letter],
        is_correct: letter === q.correct,
      }))
      await supabase.from('question_options').insert(optRows)
      questionCount++
    }
  }
  console.log(`  ✓ ${questionCount} questions with options`)
  console.log('\nSeed complete.')
}

seed().catch(console.error)
