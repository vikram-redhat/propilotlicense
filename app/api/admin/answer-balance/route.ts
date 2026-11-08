import { createServiceClient } from '@/lib/supabase'
import { isAdminRequest } from '@/lib/admin-auth'

const LETTERS = ['A', 'B', 'C', 'D'] as const

// Which letter holds the correct answer across active questions, overall and per
// subject. The admin dashboard shows it so any drift back towards one letter (the bank
// was 61% B before scripts/rebalance-option-letters.mjs) is visible straight away.
export async function GET(request: Request) {
  if (!await isAdminRequest(request)) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const supabase = createServiceClient()
  const { data: subjects, error } = await supabase.from('subjects').select('id, name').order('sort_order')
  if (error) return Response.json({ error: error.message }, { status: 500 })

  // Count-only queries (no rows fetched), so no 1,000-row cap applies.
  const count = async (letter: string, subjectId?: string) => {
    let q = supabase.from('question_options')
      .select('id, question:questions!inner(active, subject_id)', { count: 'exact', head: true })
      .eq('is_correct', true).eq('option_letter', letter).eq('question.active', true)
    if (subjectId) q = q.eq('question.subject_id', subjectId)
    const { count, error } = await q
    if (error) throw new Error(error.message)
    return count ?? 0
  }

  try {
    const [overall, ...perSubject] = await Promise.all([
      Promise.all(LETTERS.map(l => count(l))),
      ...subjects.map(s => Promise.all(LETTERS.map(l => count(l, s.id)))),
    ])
    const row = (counts: number[]) => ({ counts: Object.fromEntries(LETTERS.map((l, i) => [l, counts[i]])), total: counts.reduce((a, b) => a + b, 0) })
    return Response.json({
      overall: row(overall),
      subjects: subjects.map((s, i) => ({ name: s.name, ...row(perSubject[i]) })).filter(s => s.total > 0),
    })
  } catch (e) {
    return Response.json({ error: (e as Error).message }, { status: 500 })
  }
}
