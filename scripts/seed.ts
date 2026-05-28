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
    description: 'Weather patterns, atmosphere, METAR/TAF, and aviation weather hazards.',
    licence_types: ['CPL', 'ATPL'],
    sort_order: 1,
    active: true,
  },
  {
    name: 'Air Regulations',
    code: 'REG',
    icon_name: 'gavel',
    description: 'ICAO annexes, DGCA requirements, air law, and ATC procedures.',
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
    'Icing', 'Visibility and fog', 'Fronts', 'ITCZ', 'METAR/TAF decode',
    'SIGMET and AIRMET', 'Turbulence', 'Wind shear',
  ],
  REG: [
    'ICAO annexes', 'DGCA CAR series', 'Aircraft Act and Rules',
    'Flight rules – VFR', 'Flight rules – IFR', 'ATC procedures',
    'Airspace classification', 'Licensing requirements',
    'Flight time limitations', 'Accident and incident reporting',
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
      explanation: 'The International Standard Atmosphere (ISA) defines a lapse rate of 2°C per 1,000 ft (6.5°C per 1,000 m) in the troposphere.',
      options: { A: '1°C per 1,000 ft', B: '2°C per 1,000 ft', C: '3°C per 1,000 ft', D: '4°C per 1,000 ft' },
      correct: 'B',
      bookTitle: 'Aviation Meteorology',
      source_chapter: 'Chapter 2',
      source_page: 'Page 18',
    },
    {
      question_text: 'A METAR observation of "TS" indicates:',
      difficulty: 'easy',
      explanation: 'In a METAR, "TS" is the present weather code for thunderstorm.',
      options: { A: 'Turbulent conditions only', B: 'Thunderstorm', C: 'Transient shower', D: 'Towering cumulus' },
      correct: 'B',
      bookTitle: 'Aviation Meteorology',
      source_chapter: 'Chapter 11',
      source_page: 'Page 142',
    },
    {
      question_text: 'In the Northern Hemisphere, wind flows around a low pressure system:',
      difficulty: 'medium',
      explanation: 'Coriolis force deflects air to the right in the Northern Hemisphere, resulting in counter-clockwise (cyclonic) flow around a low.',
      options: { A: 'Clockwise and outward', B: 'Clockwise and inward', C: 'Counter-clockwise and inward', D: 'Counter-clockwise and outward' },
      correct: 'C',
      bookTitle: 'Aviation Meteorology',
      source_chapter: 'Chapter 4',
      source_page: 'Page 52',
    },
    {
      question_text: 'Structural icing is most likely to occur in which cloud type?',
      difficulty: 'medium',
      explanation: 'Cumulonimbus clouds contain large supercooled water droplets and strong updrafts, making them the most hazardous for airframe icing.',
      options: { A: 'Cirrus', B: 'Cumulonimbus', C: 'Altostratus', D: 'Stratocumulus' },
      correct: 'B',
      bookTitle: 'Aviation Meteorology',
      source_chapter: 'Chapter 7',
      source_page: 'Page 89',
    },
    {
      question_text: 'Mountain wave turbulence is most intense:',
      difficulty: 'hard',
      explanation: 'Mountain wave turbulence is most severe in the rotor zone beneath the wave crests on the leeward side, and can extend to altitudes well above the mountain top.',
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
      explanation: 'ICAO Annex 2 contains the Rules of the Air — international standards for VFR and IFR flight.',
      options: { A: 'Personnel licensing', B: 'Rules of the Air', C: 'Aerodromes', D: 'Air traffic services' },
      correct: 'B',
      bookTitle: 'ICAO Annexes',
      source_chapter: 'Annex 2',
      source_page: 'Page 1',
    },
    {
      question_text: 'Under DGCA regulations, the minimum visibility for VFR flight in Class G airspace below 3,000 ft AMSL is:',
      difficulty: 'easy',
      explanation: 'In Class G airspace at and below 3,000 ft AMSL (or 1,000 ft AGL, whichever is higher), DGCA requires a minimum flight visibility of 5 km for VFR.',
      options: { A: '1.5 km', B: '3 km', C: '5 km', D: '8 km' },
      correct: 'C',
      bookTitle: 'DGCA Civil Aviation Requirements (CAR)',
      source_chapter: 'CAR Section 2',
      source_page: 'Page 34',
    },
    {
      question_text: 'An aircraft operating IFR must maintain a minimum altitude of ___ above the highest obstacle within ___ nm of track:',
      difficulty: 'medium',
      explanation: 'ICAO IFR minimum obstacle clearance altitude (MOCA) requires 1,000 ft above the highest obstacle within 5 nm in non-mountainous terrain.',
      options: { A: '500 ft within 5 nm', B: '1,000 ft within 5 nm', C: '2,000 ft within 10 nm', D: '1,500 ft within 8 nm' },
      correct: 'B',
      bookTitle: 'Air Regulations',
      source_chapter: 'Chapter 8',
      source_page: 'Page 112',
    },
    {
      question_text: 'Class B airspace requires all of the following EXCEPT:',
      difficulty: 'medium',
      explanation: 'Class B requires ATC clearance, a Mode C/ADS-B transponder, and two-way communication. A filed flight plan is NOT a Class B entry requirement.',
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
      explanation: 'ICAO Annex 1 requires 3 take-offs and 3 landings as pilot flying within 90 days to maintain recency for pilot-in-command privileges.',
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
  const bookMap: Record<string, Record<string, string>> = {} // code → title → id

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
