import { createServiceClient } from '@/lib/supabase'
import { isAdminRequest } from '@/lib/admin-auth'

export const maxDuration = 120

export async function POST(req: Request) {
  if (!await isAdminRequest(req)) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { bookId } = await req.json()
  if (!bookId) return Response.json({ error: 'bookId required' }, { status: 400 })

  const supabase = createServiceClient()

  const { data: book } = await supabase
    .from('source_books')
    .select('id, title, pdf_storage_path')
    .eq('id', bookId)
    .single()

  if (!book?.pdf_storage_path) {
    return Response.json({ error: 'No PDF found for this book' }, { status: 400 })
  }

  await supabase.from('source_books').update({
    pdf_processed: false,
    pdf_processing_error: null,
  }).eq('id', bookId)

  try {
    const { data: fileData, error: fileError } = await supabase.storage
      .from('reference-documents')
      .download(book.pdf_storage_path)

    if (fileError || !fileData) throw new Error(fileError?.message ?? 'Failed to download PDF')

    const uint8Array = new Uint8Array(await fileData.arrayBuffer())

    const { extractText } = await import('unpdf')
    const { text: pages, totalPages } = await extractText(uint8Array, { mergePages: false })
    const fullText: string = (pages as string[]).join('\n\n')
    const pageCount: number = totalPages

    const chunks = splitIntoChunks(fullText, pageCount)

    await supabase.from('source_books').update({
      pdf_page_count: pageCount,
    }).eq('id', bookId)

    await supabase.from('pdf_chunks').delete().eq('book_id', bookId)

    const chunkRows = chunks.map((chunk, i) => ({
      book_id: bookId,
      chunk_index: i,
      heading: chunk.heading,
      page_start: chunk.pageStart,
      page_end: chunk.pageEnd,
      content: chunk.content,
      token_estimate: Math.ceil(chunk.content.length / 4),
    }))

    const { error: insertError } = await supabase.from('pdf_chunks').insert(chunkRows)
    if (insertError) throw new Error(insertError.message)

    await supabase.from('source_books').update({
      pdf_processed: true,
      pdf_processed_at: new Date().toISOString(),
      pdf_processing_error: null,
    }).eq('id', bookId)

    return Response.json({ success: true, pageCount, chunksCreated: chunks.length })

  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err)
    await supabase.from('source_books').update({
      pdf_processing_error: msg,
    }).eq('id', bookId)
    return Response.json({ error: msg }, { status: 500 })
  }
}

// ── Chunking ──────────────────────────────────────────────────────────────

interface Chunk { heading: string; pageStart: number; pageEnd: number; content: string }

function splitIntoChunks(text: string, totalPages: number): Chunk[] {
  const headingPattern = /(?:^|\n)((?:Chapter|CHAPTER|Section|SECTION)\s+\d+[^\n]{0,60}|\d{1,2}\.\s+[A-Z][^\n]{5,60})/gm
  const matches = [...text.matchAll(headingPattern)]

  if (matches.length < 2) {
    // No headings — split into ~3,000-word fixed chunks
    const words = text.split(/\s+/).filter(Boolean)
    const CHUNK_WORDS = 3000
    const chunks: Chunk[] = []
    for (let i = 0; i < words.length; i += CHUNK_WORDS) {
      const content = words.slice(i, i + CHUNK_WORDS).join(' ')
      const pageEst = Math.floor((i / words.length) * totalPages)
      chunks.push({
        heading: `Part ${Math.floor(i / CHUNK_WORDS) + 1}`,
        pageStart: pageEst,
        pageEnd: Math.min(pageEst + 10, totalPages),
        content: content.slice(0, 15000),
      })
    }
    return chunks
  }

  return matches.map((match, i) => {
    const nextMatch = matches[i + 1]
    const start = match.index ?? 0
    const end = nextMatch?.index ?? text.length
    const content = text.slice(start, end).trim()
    const pageEst = Math.floor((start / text.length) * totalPages)
    return {
      heading: match[1].trim(),
      pageStart: pageEst,
      pageEnd: Math.min(pageEst + 15, totalPages),
      content: content.slice(0, 15000),
    }
  })
}
