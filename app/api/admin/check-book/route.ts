import Anthropic from '@anthropic-ai/sdk'

export const maxDuration = 30

const client = new Anthropic()

export async function POST(req: Request) {
  const { bookTitle, bookAuthor, subject } = await req.json()

  if (!bookTitle || !subject) {
    return Response.json({ error: 'Missing fields' }, { status: 400 })
  }

  // Step 1 — relevance check
  const relevanceRes = await client.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 10,
    messages: [{
      role: 'user',
      content: `Is "${bookTitle}" by ${bookAuthor} a recognised aviation training textbook relevant to ${subject}? Reply with only YES or NO.`,
    }],
  })

  const relevanceText = relevanceRes.content[0].type === 'text'
    ? relevanceRes.content[0].text.trim().toUpperCase()
    : 'NO'

  if (!relevanceText.startsWith('YES')) {
    return Response.json({ relevant: false, familiarity: null })
  }

  // Step 2 — familiarity / depth check
  const depthRes = await client.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 10,
    messages: [{
      role: 'user',
      content: `How well do you know the contents of "${bookTitle}" by ${bookAuthor}? Reply with only: WELL / PARTIALLY / NOT WELL`,
    }],
  })

  const depthText = depthRes.content[0].type === 'text'
    ? depthRes.content[0].text.trim().toUpperCase()
    : 'NOT WELL'

  const familiarity: 'WELL' | 'PARTIALLY' | 'NOT WELL' =
    depthText.includes('NOT WELL') ? 'NOT WELL' :
    depthText.includes('PARTIALLY') ? 'PARTIALLY' : 'WELL'

  return Response.json({ relevant: true, familiarity })
}
