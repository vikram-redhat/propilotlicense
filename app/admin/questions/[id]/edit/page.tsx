import { createServiceClient } from '@/lib/supabase'
import QuestionForm from '@/components/QuestionForm'
import { notFound } from 'next/navigation'

export default async function EditQuestionPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = createServiceClient()
  const { data: question } = await supabase
    .from('questions')
    .select('*, options:question_options(*)')
    .eq('id', id)
    .single()

  if (!question) notFound()

  return <QuestionForm question={question} />
}
