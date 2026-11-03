import { createServiceClient } from '@/lib/supabase'
import { createAuthClient } from '@/lib/supabase-server'
import { isAdminRequest } from '@/lib/admin-auth'

// Stamp a question as reviewed now, by the current admin (null in bypass mode, which
// has no Supabase session). Body { confirmSyllabus: true } ("Looks good") also marks
// its syllabus chapter as reviewed.
export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!await isAdminRequest(request)) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const { id } = await params

  const authClient = await createAuthClient()
  const { data: { user } } = await authClient.auth.getUser()

  const reviewedAt = new Date().toISOString()
  const { error } = await createServiceClient()
    .from('questions')
    .update({ last_reviewed_at: reviewedAt, last_reviewed_by: user?.id ?? null })
    .eq('id', id)
  if (error) return Response.json({ error: error.message }, { status: 500 })

  const body = await request.json().catch(() => ({}))
  if (body?.confirmSyllabus) {
    const { error: syllabusError } = await createServiceClient()
      .from('questions')
      .update({ syllabus_chapter_source: 'reviewed', syllabus_chapter_confidence: 'high' })
      .eq('id', id)
      .not('syllabus_chapter_id', 'is', null)
    // 42703: syllabus migration not run — nothing to confirm.
    if (syllabusError && syllabusError.code !== '42703') {
      return Response.json({ error: syllabusError.message }, { status: 500 })
    }
  }

  return Response.json({ ok: true, last_reviewed_at: reviewedAt })
}
