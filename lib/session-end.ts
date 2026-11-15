import { scoreBand, trackEvent } from '@/lib/analytics'

// Ends a session (records it via /api/session/end) and sends GA4 practice_complete.
// Client-side only. Used by the session page (End session, Submit, the last question, the
// mock timer) and the dashboard's Continue card (End and see results).
//
// practice_complete fires once per session per browser (an ended session can be reopened
// and ended again). Counts and a score band only — never the exact score. score_band is
// on the answered questions, as the results page scores a practice session.
export async function endSession({ sessionId, endedEarly, questions, mode }: {
  sessionId: string
  endedEarly: boolean
  questions: number
  mode: string
}): Promise<void> {
  let answered: number | undefined
  let correct = 0
  try {
    const res = await fetch('/api/session/end', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sessionId, endedEarly }),
    })
    if (res.ok) ({ answered, correct } = await res.json())
  } catch { /* network error: still go to the results */ }
  if (answered === undefined) return

  const key = `ga_practice_complete_${sessionId}`
  let seen = false
  try { seen = sessionStorage.getItem(key) === '1'; sessionStorage.setItem(key, '1') } catch { /* storage blocked */ }
  if (seen) return
  trackEvent('practice_complete', {
    questions,
    answered,
    score_band: answered > 0 ? scoreBand(Math.round((correct / answered) * 100)) : undefined,
    mode,
    ended_early: endedEarly,
  })
}
