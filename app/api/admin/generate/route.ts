import Anthropic from '@anthropic-ai/sdk'
import { createServiceClient } from '@/lib/supabase'
import { isAdminRequest } from '@/lib/admin-auth'

export const maxDuration = 120

// Bound the Claude call so a slow/overloaded request fails fast and cleanly
// (returning a real error the client can show + retry) instead of hanging until
// the connection is dropped and the browser reports "Failed to fetch".
const client = new Anthropic({ timeout: 50_000, maxRetries: 1 })

export async function POST(req: Request) {
  if (!await isAdminRequest(req)) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const {
    subject, bookTitle, bookAuthor, bookId,
    focusLine, chapterName, topicName,
    difficulty, count, context,
    previousQuestions = [],
  } = await req.json()

  if (!subject || !difficulty || !count) {
    return Response.json({ error: 'Missing required fields' }, { status: 400 })
  }

  const avoidBlock = previousQuestions.length > 0
    ? `\n\nIMPORTANT — do not repeat or closely paraphrase any of these already-generated questions:\n` +
      (previousQuestions as string[]).map((q: string, i: number) => `${i + 1}. ${q}`).join('\n') + '\n'
    : ''

  // ── Book context — chunk if processed, else memory ─────────────────────
  let bookContext = ''
  let citationVerifiedValue = false

  if (bookId) {
    const supabase = createServiceClient()
    const { data: book } = await supabase
      .from('source_books')
      .select('pdf_processed')
      .eq('id', bookId)
      .single()

    if (book?.pdf_processed) {
      const chunk = await getRelevantChunk(supabase, bookId, chapterName, topicName)
      if (chunk) {
        bookContext =
          `The following is an excerpt from "${bookTitle}"${bookAuthor ? ` by ${bookAuthor}` : ''}:\n\n` +
          `---\n${chunk}\n---\n\n` +
          `Generate questions based ONLY on the content above.`
        citationVerifiedValue = true
      }
    }
  }

  if (!bookContext) {
    const topicLine = focusLine ?? `General — cover a range of topics across all books for this subject`
    bookContext = bookTitle
      ? `Source book: "${bookTitle}"${bookAuthor ? ` by ${bookAuthor}` : ''}\n${topicLine}\n` +
        `Generate from your knowledge of this book. Citations will be approximate.`
      : `No specific book — generate from general DGCA ${subject} knowledge.`
  }

  const prompt =
    `You are an expert aviation examiner creating questions for the DGCA (India) pilot licence exam.\n\n` +
    `Subject: ${subject}\n` +
    `Difficulty: ${difficulty}\n` +
    `${context ? `Additional context: ${context}\n` : ''}` +
    `${bookContext}\n\n` +
    `Generate exactly ${count} multiple choice question${count > 1 ? 's' : ''}.\n\n` +
    `Difficulty guide:\n` +
    `- basic: factual recall, definitions\n` +
    `- advanced: application, edge cases, regulatory interpretation\n\n` +
    `EXPLANATION: Write 5–6 lines in an authoritative, educational voice. Cover the broader concept so a student learns deeply.\n\n` +
    `CITATION: ${citationVerifiedValue
      ? 'Reference the specific section or paragraph in the excerpt above.'
      : `Estimate the chapter and page in "${bookTitle || 'the reference material'}". Always provide a genuine estimate — never write "unknown". These will be marked approximate.`
    }\n` +
    avoidBlock +
    `\nCRITICAL: Return ONLY a valid JSON array. No markdown fences, no preamble, no trailing text.\n\n` +
    `Each element:\n` +
    `{"question_text":"...","options":{"A":"...","B":"...","C":"...","D":"..."},"correct_option":"B",` +
    `"explanation":"...","source_chapter":"Chapter 4","source_page":"Page 67",` +
    `"difficulty":"${difficulty}","citation_verified":${citationVerifiedValue}}`

  // ── Claude call (Anthropic API errors: rate limit, overload, timeout) ──
  let response
  try {
    response = await client.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 4000,
      messages: [{ role: 'user', content: prompt }],
    })
  } catch (err) {
    const e = err as { status?: number; name?: string; message?: string }
    let error = 'Question generation failed — please retry'
    if (e?.status === 429) error = 'Anthropic rate limit reached — wait a few seconds and retry'
    else if (e?.status === 529) error = 'Anthropic API is temporarily overloaded — retry shortly'
    else if (/timeout/i.test(e?.name ?? '') || /timeout/i.test(e?.message ?? '')) error = 'The AI request timed out — retry'
    else if (e?.message) error = `Generation error: ${e.message.slice(0, 140)}`
    return Response.json({ error, details: String(err) }, { status: e?.status ?? 500 })
  }

  // ── Parse the model output (may be truncated if it hit the token limit) ──
  const text = response.content[0]?.type === 'text' ? response.content[0].text : ''
  try {
    const questions = JSON.parse(text.trim())
    return Response.json({
      questions,
      source: citationVerifiedValue ? 'pdf_chunk' : 'memory',
    })
  } catch {
    const error = response.stop_reason === 'max_tokens'
      ? 'AI response was cut off at the token limit — try a smaller batch or count'
      : 'AI returned an unreadable response — please retry'
    return Response.json({ error }, { status: 502 })
  }
}

async function getRelevantChunk(
  supabase: ReturnType<typeof createServiceClient>,
  bookId: string,
  chapterName?: string,
  topicName?: string,
): Promise<string | null> {
  const searchTerm = chapterName || topicName

  if (searchTerm) {
    const { data } = await supabase
      .from('pdf_chunks')
      .select('content')
      .eq('book_id', bookId)
      .ilike('heading', `%${searchTerm}%`)
      .order('chunk_index')
      .limit(1)
    if (data?.[0]?.content) return data[0].content
  }

  // Fall back to first chunk
  const { data } = await supabase
    .from('pdf_chunks')
    .select('content')
    .eq('book_id', bookId)
    .order('chunk_index')
    .limit(1)
  return data?.[0]?.content ?? null
}
