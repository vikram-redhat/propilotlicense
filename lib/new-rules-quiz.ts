import { unstable_cache } from 'next/cache'
import { createServiceClient } from '@/lib/supabase'
import { QUIZ_REFS } from '@/lib/new-rules'

// The Niyam and Adhiniyam guides' 5-question quiz (components/guides/NewRulesQuiz.tsx): the
// QUIZ_REFS questions as they are in the database now, so a reviewed question shows its
// current text. Cached for an hour; null if they can't be read (the guide then shows no quiz).
export type QuizQuestion = {
  ref: string
  text: string
  options: { letter: string; text: string }[]
  correct: string // option letter
  explanation: string
  citation: string // "Rule 174(1)"
}

export const newRulesQuiz = unstable_cache(async (): Promise<QuizQuestion[] | null> => {
  const supabase = createServiceClient()
  const { data: qs, error } = await supabase.from('questions')
    .select('id, external_ref, question_text, explanation, source_chapter, active')
    .in('external_ref', [...QUIZ_REFS])
  if (error || !qs) { console.error('[new-rules-quiz]', error?.message); return null }
  const { data: opts, error: optError } = await supabase.from('question_options')
    .select('question_id, option_letter, option_text, is_correct').in('question_id', qs.map(q => q.id))
  if (optError || !opts) { console.error('[new-rules-quiz]', optError?.message); return null }
  const quiz = QUIZ_REFS.map(ref => qs.find(q => q.external_ref === ref && q.active)).filter(q => !!q).map(q => {
    const options = opts.filter(o => o.question_id === q.id).sort((a, b) => a.option_letter.localeCompare(b.option_letter))
    return {
      ref: q.external_ref as string,
      text: q.question_text,
      options: options.map(o => ({ letter: o.option_letter, text: o.option_text })),
      correct: options.find(o => o.is_correct)?.option_letter ?? '',
      explanation: q.explanation ?? '',
      citation: q.source_chapter ?? '',
    }
  })
  return quiz.length === QUIZ_REFS.length && quiz.every(q => q.correct) ? quiz : null
}, ['new-rules-quiz'], { revalidate: 3600 })
