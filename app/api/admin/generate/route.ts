import Anthropic from '@anthropic-ai/sdk'
import { createServiceClient } from '@/lib/supabase'
import { isAdminRequest } from '@/lib/admin-auth'

export const maxDuration = 60

const client = new Anthropic()

export async function POST(req: Request) {
  if (!await isAdminRequest(req)) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const {
    subject, bookTitle, bookAuthor, bookId,
    focusLine, chapterName, topicName,
    difficulty, count, context,
    previousQuestions = [],
    pageRangeStart, pageRangeEnd,
  } = await req.json()

  if (!subject || !difficulty || !count) {
    return Response.json({ error: 'Missing required fields' }, { status: 400 })
  }

  const avoidBlock = previousQuestions.length > 0
    ? `\n\nIMPORTANT — do not repeat or closely paraphrase any of these already-generated questions:\n` +
      (previousQuestions as string[]).map((q: string, i: number) => `${i + 1}. ${q}`).join('\n') + '\n'
    : ''

  // ── PDF-grounded generation ──────────────────────────────────────────────
  if (bookId) {
    const supabase = createServiceClient()
    const { data: book } = await supabase
      .from('source_books')
      .select('pdf_storage_path, pdf_filename')
      .eq('id', bookId)
      .single()

    if (book?.pdf_storage_path) {
      const { data: fileData, error: fileError } = await supabase
        .storage
        .from('reference-documents')
        .download(book.pdf_storage_path)

      if (fileError || !fileData) {
        return Response.json({ error: 'Failed to retrieve PDF from storage' }, { status: 500 })
      }

      const arrayBuffer = await fileData.arrayBuffer()
      const base64 = Buffer.from(arrayBuffer).toString('base64')

      const focusBlock = chapterName
        ? `Chapter: ${chapterName}`
        : topicName
        ? `Topic: ${topicName}`
        : `General — cover a range of topics throughout the document`

      const pageBlock = pageRangeStart && pageRangeEnd
        ? `Focus your questions on pages ${pageRangeStart} to ${pageRangeEnd} of the document.`
        : ''

      const prompt =
        `You are an expert aviation examiner creating questions for the DGCA (India) pilot licence exam.\n\n` +
        `Subject: ${subject}\n` +
        `Source document: "${bookTitle}"${bookAuthor ? ` by ${bookAuthor}` : ''}\n` +
        `${focusBlock}\n` +
        `${pageBlock}\n` +
        `Difficulty: ${difficulty}\n` +
        `${context ? `Additional context: ${context}` : ''}\n\n` +
        `Generate exactly ${count} multiple choice question${count > 1 ? 's' : ''} based ONLY on the content in the attached document.\n\n` +
        `Difficulty guide:\n` +
        `- basic: factual recall, definitions from the document\n` +
        `- advanced: application, edge cases, interpretation of rules from the document\n\n` +
        `EXPLANATION: 5–6 lines quoting or paraphrasing the relevant section. Reference the specific part, section, or paragraph where possible.\n\n` +
        `CITATION: Provide the exact page number from the document where the relevant content appears.\n\n` +
        `CRITICAL: Return ONLY a valid JSON array. No markdown fences, no preamble, no trailing text.\n\n` +
        `Each element:\n` +
        `{"question_text":"...","options":{"A":"...","B":"...","C":"...","D":"..."},"correct_option":"B","explanation":"...","source_chapter":"Part III, Section 8","source_page":"Page 24","difficulty":"${difficulty}","citation_verified":true}` +
        avoidBlock

      try {
        const response = await client.messages.create({
          model: 'claude-sonnet-4-6',
          max_tokens: 4000,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          messages: [{
            role: 'user',
            content: [
              { type: 'document', source: { type: 'base64', media_type: 'application/pdf', data: base64 } },
              { type: 'text', text: prompt },
            ],
          }] as any,
        })

        const text = response.content[0].type === 'text' ? response.content[0].text : ''
        const questions = JSON.parse(text.trim())
        return Response.json({ questions, source: 'pdf' })
      } catch (err) {
        return Response.json(
          { error: 'Failed to parse AI response', details: String(err) },
          { status: 500 }
        )
      }
    }
  }

  // ── Memory-based generation (no PDF) ────────────────────────────────────
  const topicLine = focusLine ?? `General — cover a range of topics across all books for this subject`

  const bookLine = bookTitle
    ? `Source book: "${bookTitle}"${bookAuthor ? ` by ${bookAuthor}` : ''}`
    : `No specific book — generate from general DGCA ${subject} knowledge. Do not attribute questions to any specific book.`

  const prompt = `You are an expert aviation examiner creating questions for the DGCA (India) pilot licence exams.

Generate exactly ${count} multiple choice question${count > 1 ? 's' : ''}.

Subject: ${subject}
${topicLine}
${bookLine}
Difficulty: ${difficulty}
${context ? `Additional context: ${context}` : ''}

Difficulty guide:
- basic: factual recall, definitions, simple identification
- advanced: application of concepts, regulatory edge cases, combined topics

EXPLANATION: Write a full paragraph of 5–6 lines in the authoritative voice of the source. Educational, covering the broader concept. A student reading it should understand the topic more deeply.

CITATION: Estimate the chapter and page in "${bookTitle || 'the reference material'}" where this content is covered. Always provide a genuine estimate — never write "unknown". These will be marked as approximate.
${avoidBlock}
CRITICAL: Return ONLY a valid JSON array. No markdown fences, no preamble, no trailing text.

Each element:
{
  "question_text": "Full question text here?",
  "options": { "A": "First option", "B": "Second option", "C": "Third option", "D": "Fourth option" },
  "correct_option": "B",
  "explanation": "5–6 line textbook-style paragraph...",
  "source_chapter": "Chapter 4",
  "source_page": "Page 67",
  "difficulty": "${difficulty}",
  "citation_verified": false
}`

  try {
    const response = await client.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 4000,
      messages: [{ role: 'user', content: prompt }],
    })

    const text = response.content[0].type === 'text' ? response.content[0].text : ''
    const questions = JSON.parse(text.trim())
    return Response.json({ questions, source: 'memory' })
  } catch (err) {
    return Response.json(
      { error: 'Failed to parse AI response', details: String(err) },
      { status: 500 }
    )
  }
}
