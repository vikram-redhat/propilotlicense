'use client'
import { useState } from 'react'
import Link from 'next/link'
import { trackEvent } from '@/lib/analytics'
import type { QuizQuestion } from '@/lib/new-rules-quiz'

// The Niyam and Adhiniyam guides' 5-question quiz on the new rules (lib/new-rules-quiz.ts),
// no login needed. One question at a time; after each choice, the right answer and the
// explanation with its rule reference. At the end, the score and a link into the
// "New rules 2026" practice set (lib/new-rules.ts): through signup when logged out.
// Rendered on the server with the first question showing; the guide links to it as
// #new-rules-quiz. GA4: quiz_start (first answer), quiz_answer (question_number, correct),
// quiz_complete (score), each with quiz = niyam | adhiniyam; the end link is cta_click with
// cta_location "<quiz>-quiz".
export const QUIZ_ANCHOR = 'new-rules-quiz'

export default function NewRulesQuiz({ quiz, questions, ctaHref, isLoggedIn }: {
  quiz: 'niyam' | 'adhiniyam'
  questions: QuizQuestion[]
  ctaHref: string
  isLoggedIn: boolean
}) {
  const [index, setIndex] = useState(0)
  const [chosen, setChosen] = useState<string | null>(null)
  const [score, setScore] = useState(0)
  const [done, setDone] = useState(false)
  const q = questions[index]
  const total = questions.length

  function choose(letter: string) {
    if (chosen) return
    const correct = letter === q.correct
    setChosen(letter)
    if (correct) setScore(s => s + 1)
    if (index === 0) trackEvent('quiz_start', { quiz })
    trackEvent('quiz_answer', { quiz, question_number: index + 1, correct })
  }

  function next() {
    if (index + 1 < total) {
      setIndex(index + 1)
      setChosen(null)
    } else {
      setDone(true)
      trackEvent('quiz_complete', { quiz, score })
    }
  }

  const card: React.CSSProperties = { border: '1px solid var(--rule)', borderRadius: 10, background: 'var(--surface-2)', padding: '1.25rem', margin: '1rem 0 2rem' }
  const button: React.CSSProperties = { display: 'block', width: '100%', textAlign: 'left', padding: '0.7rem 0.9rem', marginBottom: '0.5rem', borderRadius: 8, border: '1px solid var(--rule)', background: 'var(--surface)', color: 'var(--ink)', font: 'inherit', fontSize: '0.95rem', lineHeight: 1.45, cursor: 'pointer' }
  const primary: React.CSSProperties = { display: 'inline-block', background: 'var(--accent)', color: '#fff', fontWeight: 700, fontSize: '0.92rem', padding: '0.65rem 1.25rem', borderRadius: 6, border: 'none', textDecoration: 'none', cursor: 'pointer', font: 'inherit' }

  return (
    <section id={QUIZ_ANCHOR} style={{ scrollMarginTop: 80 }}>
      <h2>DGCA papers already test the new rules. Try 5 questions</h2>
      <div style={card}>
        {done ? (
          <div style={{ textAlign: 'center', padding: '0.5rem 0' }}>
            <p style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--ink)', marginBottom: '1rem' }}>You scored {score}/{total}.</p>
            <Link href={ctaHref} data-cta={`${quiz}-quiz`} style={{ ...primary, fontWeight: 700 }}>
              {isLoggedIn ? 'Practise the new rules →' : 'Get 10 more new-rules questions free →'}
            </Link>
          </div>
        ) : (
          <>
            <div style={{ fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--ink-3)', marginBottom: '0.5rem' }}>
              Question {index + 1} of {total}
            </div>
            <p style={{ fontWeight: 600, color: 'var(--ink)', marginBottom: '0.9rem' }}>{q.text}</p>
            <div role="group" aria-label={`Question ${index + 1} options`}>
              {q.options.map(o => {
                const isRight = chosen && o.letter === q.correct
                const isWrongPick = chosen === o.letter && o.letter !== q.correct
                return (
                  <button
                    key={o.letter}
                    type="button"
                    onClick={() => choose(o.letter)}
                    disabled={!!chosen}
                    aria-pressed={chosen === o.letter}
                    style={{
                      ...button,
                      cursor: chosen ? 'default' : 'pointer',
                      ...(isRight ? { borderColor: 'var(--green)', background: 'var(--green-bg)' } : {}),
                      ...(isWrongPick ? { borderColor: 'var(--red)', background: 'var(--red-bg)' } : {}),
                    }}
                  >
                    <strong style={{ marginRight: '0.5rem' }}>{o.letter}.</strong>{o.text}
                  </button>
                )
              })}
            </div>
            {chosen && (
              <div aria-live="polite" style={{ marginTop: '0.75rem' }}>
                <p style={{ fontWeight: 700, color: chosen === q.correct ? 'var(--green)' : 'var(--red)', marginBottom: '0.35rem' }}>
                  {chosen === q.correct ? 'Correct.' : `Not quite. The answer is ${q.correct}.`}
                </p>
                <p style={{ fontSize: '0.92rem', marginBottom: '0.9rem' }}>
                  {q.explanation}{q.citation && <> <span style={{ color: 'var(--ink-3)' }}>({q.citation}, Bharatiya Vayuyan Niyam, 2026)</span></>}
                </p>
                <button type="button" onClick={next} style={primary}>
                  {index + 1 < total ? 'Next question →' : 'See your score →'}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  )
}
