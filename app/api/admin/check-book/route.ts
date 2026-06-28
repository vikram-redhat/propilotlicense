import Anthropic from '@anthropic-ai/sdk'
import { createAuthClient } from '@/lib/supabase-server'

export const maxDuration = 30

const client = new Anthropic()

export async function POST(req: Request) {
  const authClient = await createAuthClient()
  const { data: { user } } = await authClient.auth.getUser()
  if (!user?.user_metadata?.is_admin) return Response.json({ error: 'Unauthorized' }, { status: 403 })

  const { bookTitle, bookAuthor, subject } = await req.json()

  if (!bookTitle || !subject) {
    return Response.json({ error: 'Missing fields' }, { status: 400 })
  }

  // Books come from the admin's own curated database — relevance is assumed.
  // Only run the depth check to surface the amber advisory for obscure books.

  // Depth check
  const depthRes = await client.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 10,
    messages: [{
      role: 'user',
      content:
        `The book "${bookTitle}" by ${bookAuthor} is a DGCA-prescribed aviation training textbook for ${subject}. ` +
        `How well do you know the specific contents, chapter structure, and page layout of this edition? ` +
        `Reply with only: WELL, PARTIALLY, or NOT WELL.`,
    }],
  })

  const depthText = depthRes.content[0].type === 'text'
    ? depthRes.content[0].text.trim().toUpperCase()
    : 'NOT WELL'

  const familiarity: 'WELL' | 'PARTIALLY' | 'NOT WELL' =
    depthText.includes('NOT WELL') ? 'NOT WELL' :
    depthText.includes('PARTIALLY') ? 'PARTIALLY' : 'WELL'

  return Response.json({ relevant: true, familiarity })
  // Note: relevant is always true — books come from the admin's curated DB
}
