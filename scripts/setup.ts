/**
 * ProPilotLicence.com — Setup Script
 *
 * Runs after the DB schema SQL has been executed in Supabase.
 * Does everything in one pass:
 *   1. Seeds subjects, topics, and source books
 *   2. Generates ~50 questions per subject via Claude API
 *      (batches of 5 per topic, spread across all topics)
 *
 * Usage:
 *   npx tsx scripts/setup.ts
 *
 * Requirements:
 *   - Schema SQL already run in Supabase (fresh/reset DB)
 *   - .env.local with NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, ANTHROPIC_API_KEY
 */

import Anthropic from '@anthropic-ai/sdk'
import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// ─── Config ───────────────────────────────────────────────────────────────────

const TARGET_PER_SUBJECT = 50
const BATCH_SIZE = 5 // questions per Claude API call — keeps responses fast and avoids timeouts
const RETRY_LIMIT = 2 // attempts per batch before skipping

const PRIMARY_BOOKS: Record<string, { title: string; author: string }> = {
  MET:  { title: 'Aviation Meteorology',                   author: 'IC Joshi' },
  REG:  { title: 'Air Regulations',                        author: 'RK Bali' },
  NAV:  { title: 'Air Navigation',                         author: 'Trevor Thom' },
  RAI:  { title: 'JAR ATPL(A) and CPL(A) Instruments',    author: 'Keith Williams' },
  TECH: { title: 'JAR ATPL & CPL Principles of Flight',   author: 'Keith Williams' },
}

const DIFFICULTY_CYCLE: Array<'easy'|'medium'|'hard'> = [
  'easy','medium','easy','medium','hard',
]

// ─── Seed Data ────────────────────────────────────────────────────────────────

const subjects = [
  { name:'Meteorology',           code:'MET',  icon_name:'wind',   licence_types:['CPL','ATPL'], sort_order:1,
    description:`Meteorology is the study of the Earth's atmosphere and the weather phenomena that affect aviation. For pilots, a thorough understanding of meteorology is essential for safe flight operations. This subject covers the structure and composition of the atmosphere, pressure systems, temperature and humidity, clouds, precipitation, thunderstorms, icing, visibility, fronts, and the interpretation of aviation weather reports and forecasts including METAR, TAF, SIGMET, and AIRMET. Pilots must be able to anticipate and respond to weather hazards including windshear, microbursts, clear air turbulence, and in-flight icing conditions.` },
  { name:'Air Regulations',       code:'REG',  icon_name:'gavel',  licence_types:['CPL','ATPL'], sort_order:2,
    description:`Air Regulations covers the legal and procedural framework governing civil aviation in India and internationally. This subject includes the Aircraft Act 1934, Aircraft Rules, DGCA Civil Aviation Requirements (CARs), ICAO Annexes and associated documentation, the Aeronautical Information Publication (AIP) India, airspace classification, flight rules (VFR and IFR), ATC procedures, pilot licensing requirements, flight and duty time limitations, accident and incident reporting, and human performance and limitations.` },
  { name:'Air Navigation',        code:'NAV',  icon_name:'route',  licence_types:['CPL','ATPL'], sort_order:3,
    description:`Air Navigation is the science and practice of determining an aircraft's position and directing its flight path from one location to another. This subject encompasses dead reckoning, the wind triangle, flight planning, VOR, NDB, DME, ILS, GPS/GNSS, chart projections, great circle and rhumb line tracks, time zones, magnetic variation, mass and balance, and performance planning.` },
  { name:'Radio Aids & Instruments', code:'RAI', icon_name:'radio', licence_types:['CPL','ATPL'], sort_order:4,
    description:`Radio Aids and Instruments covers the operating principles, capabilities, and limitations of navigation and communication systems installed in modern commercial aircraft, plus the flight instruments used to monitor and control flight parameters. Includes VHF/HF communications, transponders, ADF, VOR, DME, ILS, MLS, GPS/GNSS, TCAS, EGPWS, pitot-static instruments, gyroscopic instruments, EFIS, FMS, and autopilot systems.` },
  { name:'Technical General',     code:'TECH', icon_name:'engine', licence_types:['CPL','ATPL'], sort_order:5,
    description:`Technical General covers the theoretical principles and practical knowledge of aircraft structures, systems, and powerplants required for CPL and ATPL examinations. Covers principles of flight, airframe structures, flight control systems, hydraulic and pneumatic systems, landing gear, piston and gas turbine engines, fuel systems, electrical systems, pressurisation, ice protection, and fire detection and suppression.` },
]

const topicsData: Record<string, string[]> = {
  MET:  ['Atmosphere structure','Pressure and altimetry','Temperature','Winds and circulation','Clouds and precipitation','Thunderstorms','Icing','Visibility and fog','Fronts','ITCZ','METAR and TAF decode','SIGMET and AIRMET','Turbulence','Wind shear'],
  REG:  ['ICAO annexes','DGCA CAR series','Aircraft Act and Rules','Flight rules – VFR','Flight rules – IFR','ATC procedures','Airspace classification','Licensing requirements','Flight and duty time limitations','Accident and incident reporting','Human performance and limitations','AIP India'],
  NAV:  ['Dead reckoning','Wind triangle calculations','VOR navigation','NDB and ADF','DME operations','ILS approach','GPS and GNSS','Celestial navigation','Chart projections','Time zones and date line','Great circle and rhumb line','Flight planning','Mass and balance','Performance planning'],
  RAI:  ['VHF communications','HF communications','Transponder and SSR','ADF and NDB','VOR principles','DME','ILS and MLS','GPS and GNSS','TCAS','EGPWS and GPWS','Pitot-static instruments','Gyroscopic instruments','Magnetic compass','Autopilot and AFCS','EFIS and FMS'],
  TECH: ['Principles of flight','Lift and drag','Stability and control','Airframe structures','Flight control systems','Hydraulic systems','Landing gear','Piston engines','Gas turbine engines','Fuel systems','Electrical systems','Pressurisation','Ice and rain protection','Fire protection'],
}

const booksData = [
  { code:'MET',  title:'Aviation Meteorology',                    author:'IC Joshi',            licence_types:['CPL','ATPL'], sort_order:1 },
  { code:'MET',  title:'Ground Studies for Pilots – Meteorology', author:'Underdown & Standen', licence_types:['CPL','ATPL'], sort_order:2 },
  { code:'MET',  title:'Meteorology',                             author:'Nordian',             licence_types:['CPL','ATPL'], sort_order:3 },
  { code:'MET',  title:'Meteorology',                             author:'Oxford',              licence_types:['CPL','ATPL'], sort_order:4 },
  { code:'MET',  title:'Meteorology for Pilot',                   author:'Mike Wickson',        licence_types:['CPL','ATPL'], sort_order:5 },
  { code:'MET',  title:'Aviation Law and Meteorology',            author:'Trevor Thom',         licence_types:['CPL'],        sort_order:6 },
  { code:'REG',  title:'Air Law',                                 author:'Oxford',                  licence_types:['CPL','ATPL'], sort_order:1 },
  { code:'REG',  title:'Air Regulations',                         author:'RK Bali',                 licence_types:['CPL','ATPL'], sort_order:2 },
  { code:'REG',  title:'Air Law and ATC Procedures',              author:'Nordian',                 licence_types:['CPL','ATPL'], sort_order:3 },
  { code:'REG',  title:'Air Regulations for Pilots',              author:'V Krishnan & AK Chopra',  licence_types:['CPL','ATPL'], sort_order:4 },
  { code:'REG',  title:'Aircraft Act 1934',                       author:'India',                   licence_types:['CPL','ATPL'], sort_order:5 },
  { code:'REG',  title:'Aircraft Rules 1920, 1937, 1954 & 2003', author:'India',                   licence_types:['CPL','ATPL'], sort_order:6 },
  { code:'REG',  title:'DGCA Civil Aviation Requirements (CAR)', author:'DGCA',                    licence_types:['CPL','ATPL'], sort_order:7 },
  { code:'REG',  title:'Human Performance & Limitations',         author:'Nordian',                 licence_types:['CPL','ATPL'], sort_order:8 },
  { code:'REG',  title:'Human Performance & Limitations',         author:'Oxford',                  licence_types:['CPL','ATPL'], sort_order:9 },
  { code:'REG',  title:'ICAO Annexes',                            author:'ICAO',                    licence_types:['CPL','ATPL'], sort_order:10 },
  { code:'REG',  title:'ICAO Docs',                               author:'ICAO',                    licence_types:['CPL','ATPL'], sort_order:11 },
  { code:'REG',  title:'AIP India',                               author:'India',                   licence_types:['CPL','ATPL'], sort_order:12 },
  { code:'NAV',  title:'Air Navigation',                                author:'Trevor Thom',        licence_types:['CPL','ATPL'], sort_order:1 },
  { code:'NAV',  title:'JAR ATPL & CPL General Navigation',             author:'Keith Williams',     licence_types:['CPL','ATPL'], sort_order:2 },
  { code:'NAV',  title:'Ground Studies for Pilots – Navigation',        author:'Underdown & Palmer', licence_types:['CPL','ATPL'], sort_order:3 },
  { code:'NAV',  title:'General Navigation – Navigation',               author:'Nordian',            licence_types:['CPL','ATPL'], sort_order:4 },
  { code:'NAV',  title:'Navigation for Pilot',                          author:'JE Hitchcock',       licence_types:['CPL','ATPL'], sort_order:5 },
  { code:'NAV',  title:'Flight Performance & Planning 1',               author:'Oxford',             licence_types:['CPL','ATPL'], sort_order:6 },
  { code:'NAV',  title:'Flight Performance & Planning 2 (FP & M)',      author:'Oxford',             licence_types:['CPL','ATPL'], sort_order:7 },
  { code:'NAV',  title:'Mass & Balance Flight Performance and Planning', author:'Nordian',            licence_types:['CPL','ATPL'], sort_order:8 },
  { code:'NAV',  title:'Radio Navigation and Instrument Flying',        author:'Trevor Thom',        licence_types:['CPL','ATPL'], sort_order:9 },
  { code:'NAV',  title:'Operational Procedures',                        author:'Nordian',            licence_types:['CPL','ATPL'], sort_order:10 },
  { code:'RAI',  title:'JAR ATPL(A) and CPL(A) Instruments',           author:'Keith Williams',       licence_types:['CPL','ATPL'], sort_order:1 },
  { code:'RAI',  title:'Ground Studies for Pilots – Radio Aids',        author:'Underdown & Cockburn', licence_types:['CPL','ATPL'], sort_order:2 },
  { code:'RAI',  title:'Radio Navigation and Instrument Flying',        author:'Trevor Thom',          licence_types:['CPL','ATPL'], sort_order:3 },
  { code:'RAI',  title:'Navigation – 2 Radio Navigation',              author:'Oxford',               licence_types:['CPL','ATPL'], sort_order:4 },
  { code:'RAI',  title:'Instrumentation Aircraft General Knowledge',    author:'Nordian',              licence_types:['CPL','ATPL'], sort_order:5 },
  { code:'RAI',  title:'Aircraft General Knowledge 4',                  author:'Oxford',               licence_types:['CPL','ATPL'], sort_order:6 },
  { code:'RAI',  title:'Ground Studies for Pilots – Flight Instruments and Automatic Flight Control Systems', author:'David Harris', licence_types:['CPL','ATPL'], sort_order:7 },
  { code:'RAI',  title:'Avionics and Flight Management for the Professional Pilot', author:'David Robson', licence_types:['ATPL'], sort_order:8 },
  { code:'TECH', title:'JAR ATPL & CPL Principles of Flight',              author:'Keith Williams', licence_types:['CPL','ATPL'], sort_order:1 },
  { code:'TECH', title:'Aircraft General Knowledge 1',                     author:'Oxford',         licence_types:['CPL','ATPL'], sort_order:2 },
  { code:'TECH', title:'Aircraft General Knowledge 2',                     author:'Oxford',         licence_types:['CPL','ATPL'], sort_order:3 },
  { code:'TECH', title:'Aircraft General Knowledge 3',                     author:'Oxford',         licence_types:['CPL','ATPL'], sort_order:4 },
  { code:'TECH', title:'Airframe and Systems',                             author:'Nordian',        licence_types:['CPL','ATPL'], sort_order:5 },
  { code:'TECH', title:'Airframes and Systems Aircraft General Knowledge', author:'Nordian',        licence_types:['CPL','ATPL'], sort_order:6 },
  { code:'TECH', title:'Powerplant Aircraft General Knowledge',            author:'Nordian',        licence_types:['CPL','ATPL'], sort_order:7 },
  { code:'TECH', title:'Electrics Aircraft General Knowledge',             author:'Nordian',        licence_types:['CPL','ATPL'], sort_order:8 },
  { code:'TECH', title:'Principle of Flight',                              author:'Nordian',        licence_types:['CPL','ATPL'], sort_order:9 },
  { code:'TECH', title:'Principle of Flight',                              author:'Oxford',         licence_types:['CPL','ATPL'], sort_order:10 },
]

// ─── Helpers ──────────────────────────────────────────────────────────────────

function sleep(ms: number) { return new Promise(r => setTimeout(r, ms)) }

function elapsed(startMs: number) {
  const s = Math.floor((Date.now() - startMs) / 1000)
  return `${Math.floor(s/60)}:${String(s%60).padStart(2,'0')}`
}

// ─── Phase 1: Seed reference data ─────────────────────────────────────────────

async function seedReferenceData() {
  console.log('\n📋 Phase 1 — Seeding reference data\n')

  // Subjects
  const { error: sErr } = await supabase.from('subjects').insert(subjects)
  if (sErr) throw new Error(`Subjects insert failed: ${sErr.message}`)
  console.log(`  ✓ ${subjects.length} subjects`)

  // Fetch inserted subjects for IDs
  const { data: insertedSubjects } = await supabase
    .from('subjects').select('id, code')
  const subjectMap: Record<string,string> = {}
  insertedSubjects?.forEach(s => { subjectMap[s.code] = s.id })

  // Topics
  const topicRows = Object.entries(topicsData).flatMap(([code, names]) =>
    names.map((name, i) => ({
      subject_id: subjectMap[code],
      name,
      sort_order: i + 1,
    }))
  )
  const { error: tErr } = await supabase.from('topics').insert(topicRows)
  if (tErr) throw new Error(`Topics insert failed: ${tErr.message}`)
  console.log(`  ✓ ${topicRows.length} topics`)

  // Books
  const bookRows = booksData.map((b, i) => ({
    subject_id: subjectMap[b.code],
    title: b.title,
    author: b.author,
    licence_types: b.licence_types,
    sort_order: b.sort_order,
  }))
  const { error: bErr } = await supabase.from('source_books').insert(bookRows)
  if (bErr) throw new Error(`Books insert failed: ${bErr.message}`)
  console.log(`  ✓ ${bookRows.length} source books`)

  return subjectMap
}

// ─── Phase 2: Generate questions ──────────────────────────────────────────────

interface GeneratedQ {
  question_text: string
  options: { A:string; B:string; C:string; D:string }
  correct_option: 'A'|'B'|'C'|'D'
  explanation: string
  source_chapter: string
  source_page: string
  difficulty: string
}

async function callClaude(
  subjectName: string, bookTitle: string, bookAuthor: string,
  topic: string, difficulty: string, count: number
): Promise<GeneratedQ[]> {
  const prompt = `You are an expert aviation examiner creating questions for the DGCA (India) pilot licence exams.

Generate exactly ${count} multiple choice question${count>1?'s':''}.

Subject: ${subjectName}
Topic: ${topic}
Source book: "${bookTitle}" by ${bookAuthor}
Difficulty: ${difficulty}

Difficulty guide:
- easy: factual recall, definitions, simple identification
- medium: application of a concept, standard calculation, interpreting data
- hard: multi-step problems, nuanced regulatory edge cases, combined concepts

EXPLANATION: Write a full paragraph of 5–6 lines in the authoritative voice of "${bookTitle}". It should read like a textbook excerpt — educational, covering the broader concept, not just the answer.

CITATION: Estimate the chapter and page in "${bookTitle}" where this content is covered. Always provide a genuine estimate — never write "unknown".

CRITICAL: Return ONLY a valid JSON array. No markdown fences, no preamble, no trailing text.

Each element:
{
  "question_text": "...",
  "options": { "A": "...", "B": "...", "C": "...", "D": "..." },
  "correct_option": "B",
  "explanation": "5–6 line textbook-style paragraph...",
  "source_chapter": "Chapter 4",
  "source_page": "Page 67",
  "difficulty": "${difficulty}"
}`

  const response = await anthropic.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 4000,
    messages: [{ role:'user', content: prompt }],
  })

  const text = response.content[0].type === 'text' ? response.content[0].text : ''
  return JSON.parse(text.trim())
}

async function insertQuestion(
  subjectId: string, topicId: string|null, bookId: string|null,
  q: GeneratedQ
): Promise<boolean> {
  const { data: inserted, error: qErr } = await supabase
    .from('questions')
    .insert({
      subject_id: subjectId,
      topic_id: topicId,
      source_book_id: bookId,
      question_text: q.question_text,
      difficulty: q.difficulty,
      explanation: q.explanation,
      source_chapter: q.source_chapter,
      source_page: q.source_page,
      citation_verified: false,
      source_type: 'ai',
      active: true,
    })
    .select('id')
    .single()

  if (qErr || !inserted) return false

  const options = (['A','B','C','D'] as const).map(letter => ({
    question_id: inserted.id,
    option_letter: letter,
    option_text: q.options[letter],
    is_correct: letter === q.correct_option,
  }))

  const { error: oErr } = await supabase.from('question_options').insert(options)

  if (oErr) {
    await supabase.from('questions').delete().eq('id', inserted.id)
    return false
  }

  return true
}

async function generateForSubject(
  subjectCode: string,
  subjectMap: Record<string,string>
) {
  const book = PRIMARY_BOOKS[subjectCode]
  const subjectId = subjectMap[subjectCode]

  const { data: subjectRow } = await supabase
    .from('subjects').select('name').eq('id', subjectId).single()
  const subjectName = subjectRow?.name ?? subjectCode

  const { data: topics } = await supabase
    .from('topics').select('id, name').eq('subject_id', subjectId).order('sort_order')
  if (!topics?.length) { console.log(`  ⚠ No topics found — skipping`); return }

  const { data: bookRow } = await supabase
    .from('source_books')
    .select('id').eq('subject_id', subjectId)
    .eq('title', book.title).eq('author', book.author).single()
  const bookId = bookRow?.id ?? null

  const qPerTopic = Math.max(1, Math.ceil(TARGET_PER_SUBJECT / topics.length))
  let total = 0
  let diffIdx = 0

  for (const topic of topics) {
    if (total >= TARGET_PER_SUBJECT) break
    const remaining = TARGET_PER_SUBJECT - total
    const count = Math.min(qPerTopic, remaining, BATCH_SIZE)
    const difficulty = DIFFICULTY_CYCLE[diffIdx % DIFFICULTY_CYCLE.length]
    diffIdx++

    let questions: GeneratedQ[] = []
    let attempts = 0
    const batchStart = Date.now()

    while (attempts < RETRY_LIMIT && !questions.length) {
      attempts++
      try {
        process.stdout.write(
          `    ${attempts > 1 ? '[retry] ' : ''}${topic.name} (${difficulty}, ${count}q)... `
        )
        questions = await callClaude(subjectName, book.title, book.author, topic.name, difficulty, count)
      } catch (err: any) {
        const msg = err?.message ?? String(err)
        if (attempts < RETRY_LIMIT) {
          process.stdout.write(`failed (${msg.slice(0,40)}) — retrying...\n`)
          await sleep(2000)
        } else {
          process.stdout.write(`failed after ${RETRY_LIMIT} attempts — skipped\n`)
        }
      }
    }

    if (!questions.length) continue

    let inserted = 0
    for (const q of questions) {
      const ok = await insertQuestion(subjectId, topic.id, bookId, q)
      if (ok) { inserted++; total++ }
    }

    console.log(`✓ ${inserted} inserted (${elapsed(batchStart)}) — ${total} total`)
    await sleep(400)
  }

  console.log(`  ✅ ${subjectName} complete — ${total} questions\n`)
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  console.log('🛫  ProPilotLicence.com — Setup Script')
  console.log('=======================================')
  console.log(`Target: ~${TARGET_PER_SUBJECT} questions per subject`)
  console.log(`Batches of ${BATCH_SIZE} questions per Claude API call`)
  console.log(`Retry limit: ${RETRY_LIMIT} attempts per batch\n`)

  let subjectMap: Record<string,string>

  try {
    subjectMap = await seedReferenceData()
  } catch (err: any) {
    console.error('\n❌ Reference data seeding failed:', err.message)
    console.error('Ensure the schema SQL has been run in Supabase first.')
    process.exit(1)
  }

  console.log('\n🤖 Phase 2 — Generating questions via Claude API\n')
  console.log('This will take approximately 5–10 minutes for all subjects.\n')

  const codes = Object.keys(PRIMARY_BOOKS)
  for (const code of codes) {
    const book = PRIMARY_BOOKS[code]
    console.log(`📖 ${code} — using "${book.title}" by ${book.author}`)
    await generateForSubject(code, subjectMap)
  }

  // Final count
  const { count } = await supabase
    .from('questions').select('*', { count:'exact', head:true })
  
  console.log('🏁 Setup complete')
  console.log(`   Total questions in DB: ${count}`)
  console.log('   All questions are active and ready for students.')
  console.log('   Chapter/page citations are approximate — review in /admin to verify.')
  console.log('\n   Next: Deploy to Vercel and point propilotlicence.com to the deployment.')
}

main().catch(err => {
  console.error('\n❌ Fatal error:', err)
  process.exit(1)
})
