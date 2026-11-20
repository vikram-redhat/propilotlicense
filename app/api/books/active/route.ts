import { activeBooks } from '@/lib/live-counts'

// Ids of the source books with active questions (lib/active-books.ts), for the practice
// picker's book list. Cached for an hour with lib/live-counts.ts.
export async function GET() {
  try {
    return Response.json({ ids: (await activeBooks()).map(b => b.id) })
  } catch (e) {
    return Response.json({ error: e instanceof Error ? e.message : String(e) }, { status: 500 })
  }
}
