import { after } from 'next/server'
import { createServiceClient } from '@/lib/supabase'
import { isAdminRequest } from '@/lib/admin-auth'
import { sendFlagResolvedEmail } from '@/lib/email'

// Called by the admin QuestionForm after a flagged question has been edited.
// Clears the question's flag, resolves its open question_flags rows, and emails a
// thank-you / "corrected" notice to each student who flagged it. Only rows this call
// actually flips from unresolved → resolved are emailed, so a repeat call (or a second
// save) never re-sends.
export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!await isAdminRequest(request)) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const { id } = await params
  const supabase = createServiceClient()

  const { error: qErr } = await supabase.from('questions').update({ flagged: false }).eq('id', id)
  if (qErr) return Response.json({ error: qErr.message }, { status: 500 })

  const { data: resolved, error: fErr } = await supabase
    .from('question_flags')
    .update({ resolved: true })
    .eq('question_id', id)
    .eq('resolved', false)
    .select('user_id')
  if (fErr) return Response.json({ error: fErr.message }, { status: 500 })

  const userIds = [...new Set((resolved ?? []).map(r => r.user_id).filter(Boolean))]

  if (userIds.length) {
    after(async () => {
      const [{ data: question }, { data: profiles }] = await Promise.all([
        supabase.from('questions').select('question_text').eq('id', id).single(),
        supabase.from('profiles').select('id, email, full_name').in('id', userIds),
      ])
      if (!question) return
      for (const p of profiles ?? []) {
        if (!p.email) continue
        await sendFlagResolvedEmail({ to: p.email, name: p.full_name, questionText: question.question_text })
      }
    })
  }

  return Response.json({ ok: true, notified: userIds.length })
}
