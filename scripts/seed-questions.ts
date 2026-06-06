/**
 * ProPilotLicense.com — Auto Question Seeder
 * 
 * Generates ~50 questions per subject using the Claude API.
 * Questions are spread across all topics with mixed difficulty.
 * All questions inserted as active: true (ready for student use).
 * citation_verified is false — Vineet reviews chapter/page estimates in admin.
 * 
 * Run AFTER the main seed.ts script has populated subjects, topics, and source_books.
 * 
 * Usage:
 *   npx tsx scripts/seed-questions.ts
 * 
 * Requires env vars:
 *   NEXT_PUBLIC_SUPABASE_URL
 *   SUPABASE_SERVICE_ROLE_KEY
 *   ANTHROPIC_API_KEY
 */

import Anthropic from '@anthropic-ai/sdk'
import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'
import { resolve } from 'path'

dotenv.config({ path: resolve(process.cwd(), '.env.local') })

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// Target questions per subject
const TARGET_PER_SUBJECT = 50

// Difficulty distribution across generated questions
const DIFFICULTY_SEQUENCE = [
  'easy', 'medium', 'easy', 'medium', 'hard',   // repeating pattern
] as const
type Difficulty = 'easy' | 'medium' | 'hard'

// Primary source book per subject (used for seeding)
const PRIMARY_BOOKS: Record<string, { title: string; author: string }> = {
  MET:  { title: 'Aviation Meteorology',                      author: 'IC Joshi' },
  REG:  { title: 'Air Regulations',                           author: 'RK Bali' },
  NAV:  { title: 'Air Navigation',                            author: 'Trevor Thom' },
  RAI:  { title: 'JAR ATPL(A) and CPL(A) Instruments',       author: 'Keith Williams' },
  TECH: { title: 'JAR ATPL & CPL Principles of Flight',      author: 'Keith Williams' },
}

interface GeneratedQuestion {
  question_text: string
  options: { A: string; B: string; C: string; D: string }
  correct_option: 'A' | 'B' | 'C' | 'D'
  explanation: string
  source_chapter: string
  source_page: string
  difficulty: Difficulty
}

async function generateQuestions(
  subjectName: string,
  bookTitle: string,
  bookAuthor: string,
  topic: string,
  difficulty: Difficulty,
  count: number
): Promise<GeneratedQuestion[]> {
  const prompt = `You are an expert aviation examiner creating questions for the DGCA (India) pilot licence exams.

Generate exactly ${count} multiple choice question${count > 1 ? 's' : ''}.

Subject: ${subjectName}
Topic: ${topic}
Source book: "${bookTitle}" by ${bookAuthor}
Difficulty: ${difficulty}

Difficulty guide:
- easy: factual recall, definitions, simple identification
- medium: application of a concept, standard calculation, interpreting data
- hard: multi-step problems, nuanced regulatory edge cases, combined concepts

EXPLANATION REQUIREMENT — critical:
Write the explanation as a full paragraph of 5–6 lines, in the authoritative voice of "${bookTitle}".
It should read like a textbook excerpt — educational and covering the surrounding concept,
not just why the correct option was right. A student reading it should understand the topic more deeply.

Also provide your best estimate of the chapter and page in "${bookTitle}" where this topic is covered.
These will be marked as approximate and verified by a human editor.
Format: "Chapter N" and "Page N". Always provide a genuine estimate — never write "unknown".

IMPORTANT: Return ONLY a valid JSON array. No markdown fences, no preamble, no trailing text.

Each element must have exactly this shape:
{
  "question_text": "Full question text here?",
  "options": {
    "A": "First option text",
    "B": "Second option text",
    "C": "Third option text",
    "D": "Fourth option text"
  },
  "correct_option": "B",
  "explanation": "Full 5–6 line paragraph explanation in textbook style...",
  "source_chapter": "Chapter 4",
  "source_page": "Page 67",
  "difficulty": "${difficulty}"
}`

  try {
    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 6000,
      messages: [{ role: 'user', content: prompt }],
    })

    const text = response.content[0].type === 'text' ? response.content[0].text : ''
    const questions = JSON.parse(text.trim())
    return Array.isArray(questions) ? questions : [questions]
  } catch (err) {
    console.error(`    ✗ Failed to generate/parse for topic "${topic}" (${difficulty}):`, err)
    return []
  }
}

async function seedSubject(subjectCode: string) {
  const book = PRIMARY_BOOKS[subjectCode]
  if (!book) {
    console.log(`  ⚠ No primary book configured for ${subjectCode}, skipping.`)
    return
  }

  // Fetch subject
  const { data: subject, error: subjectErr } = await supabase
    .from('subjects')
    .select('id, name')
    .eq('code', subjectCode)
    .single()

  if (subjectErr || !subject) {
    console.error(`  ✗ Subject ${subjectCode} not found in DB. Run seed.ts first.`)
    return
  }

  // Fetch topics
  const { data: topics, error: topicsErr } = await supabase
    .from('topics')
    .select('id, name')
    .eq('subject_id', subject.id)
    .order('sort_order')

  if (topicsErr || !topics?.length) {
    console.error(`  ✗ No topics found for ${subjectCode}.`)
    return
  }

  // Fetch source book ID
  const { data: sourceBook } = await supabase
    .from('source_books')
    .select('id')
    .eq('subject_id', subject.id)
    .eq('title', book.title)
    .eq('author', book.author)
    .single()

  const sourceBookId = sourceBook?.id ?? null

  // Calculate questions per topic to reach target
  const qPerTopic = Math.ceil(TARGET_PER_SUBJECT / topics.length)
  // Use 1-2 questions per topic to spread coverage
  const batchSize = Math.min(Math.max(qPerTopic, 1), 3)

  console.log(`  📚 ${subject.name} — ${topics.length} topics, ~${batchSize}/topic, target ${TARGET_PER_SUBJECT}`)

  let totalInserted = 0
  let difficultyIndex = 0

  for (const topic of topics) {
    if (totalInserted >= TARGET_PER_SUBJECT) break

    const remaining = TARGET_PER_SUBJECT - totalInserted
    const count = Math.min(batchSize, remaining)
    const difficulty = DIFFICULTY_SEQUENCE[difficultyIndex % DIFFICULTY_SEQUENCE.length]
    difficultyIndex++

    process.stdout.write(`    → ${topic.name} (${difficulty}, ${count}q)... `)

    const generated = await generateQuestions(
      subject.name,
      book.title,
      book.author,
      topic.name,
      difficulty,
      count
    )

    if (!generated.length) continue

    // Insert questions
    for (const q of generated) {
      // Insert question row
      const { data: inserted, error: qErr } = await supabase
        .from('questions')
        .insert({
          subject_id: subject.id,
          topic_id: topic.id,
          source_book_id: sourceBookId,
          question_text: q.question_text,
          difficulty: q.difficulty ?? difficulty,
          explanation: q.explanation,
          source_chapter: q.source_chapter,
          source_page: q.source_page,
          citation_verified: false,
          source_type: 'ai',
          active: true,
          flagged: false,
        })
        .select('id')
        .single()

      if (qErr || !inserted) {
        console.error('\n    ✗ Failed to insert question:', qErr?.message)
        continue
      }

      // Insert options
      const letters = ['A', 'B', 'C', 'D'] as const
      const optionRows = letters.map((letter) => ({
        question_id: inserted.id,
        option_letter: letter,
        option_text: q.options[letter],
        is_correct: letter === q.correct_option,
      }))

      const { error: optErr } = await supabase
        .from('question_options')
        .insert(optionRows)

      if (optErr) {
        console.error('\n    ✗ Failed to insert options:', optErr.message)
        // Clean up orphaned question
        await supabase.from('questions').delete().eq('id', inserted.id)
        continue
      }

      totalInserted++
    }

    console.log(`✓ (${totalInserted} total)`)

    // Small delay to avoid rate limiting
    await new Promise((r) => setTimeout(r, 500))
  }

  console.log(`  ✅ ${subject.name} complete — ${totalInserted} questions inserted\n`)
}

async function main() {
  console.log('🛫 ProPilotLicense — Question Bank Seeder')
  console.log('==========================================')
  console.log(`Target: ${TARGET_PER_SUBJECT} questions per subject\n`)

  const subjects = Object.keys(PRIMARY_BOOKS)

  for (const code of subjects) {
    console.log(`\n📖 Seeding ${code}...`)
    await seedSubject(code)
  }

  console.log('\n🏁 Seeding complete.')
  console.log('All questions are active and ready for student use.')
  console.log('Chapter/page citations are approximate — review in /admin to verify.')
}

main().catch((err) => {
  console.error('Fatal error:', err)
  process.exit(1)
})
