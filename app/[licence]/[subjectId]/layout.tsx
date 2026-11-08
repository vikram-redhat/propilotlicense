import { notFound } from 'next/navigation'
import { createServiceClient } from '@/lib/supabase'
import { UUID } from '@/lib/licence-routes'

// The practice picker (a client page) only exists for a real subject. Unknown or
// malformed ids 404 here, before the page renders. The licence is checked by the parent
// layout.
export default async function SubjectLayout({ children, params }: {
  children: React.ReactNode
  params: Promise<{ subjectId: string }>
}) {
  const { subjectId } = await params
  if (!UUID.test(subjectId)) notFound()
  const { data, error } = await createServiceClient().from('subjects').select('id').eq('id', subjectId).maybeSingle()
  if (error) throw new Error(`Subject lookup: ${error.message}`)
  if (!data) notFound()
  return children
}
