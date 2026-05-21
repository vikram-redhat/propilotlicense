'use client'
import { useEffect, useState, use } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { Session, Question, SessionState } from '@/lib/types'
import { IconCheck, IconX, IconMinus } from '@tabler/icons-react'

export default function ResultsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const [session, setSession] = useState<Session | null>(null)
  const [questions, setQuestions] = useState<Question[]>([])
  const [sessionState, setSessionState] = useState<SessionState | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const stored = localStorage.getItem(`session_${id}`)
      if (!stored) { router.push('/'); return }

      const state: SessionState = JSON.parse(stored)
      setSessionState(state)

      const { data: sess } = await supabase.from('sessions').select('*').eq('id', id).single()
      if (!sess) { router.push('/'); return }
      setSession(sess)

      const { data: qs } = await supabase
        .from('questions')
        .select('*, options:question_options(*)')
        .in('id', sess.question_ids)

      if (qs) {
        const ordered = sess.question_ids
          .map((qid: string) => qs.find(q => q.id === qid))
          .filter(Boolean) as Question[]
        setQuestions(ordered)
      }

      setLoading(false)
    }
    load()
  }, [id, router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full" />
      </div>
    )
  }

  if (!sessionState || !session) return null

  const total = questions.length
  const answered = Object.keys(sessionState.answers).length
  const correct = Object.values(sessionState.answers).filter(a => a.isCorrect).length
  const incorrect = answered - correct
  const skipped = total - answered
  const score = total > 0 ? Math.round((correct / total) * 100) : 0
  const passed = score >= 70

  const incorrectQs = questions.filter(q => {
    const a = sessionState.answers[q.id]
    return a && !a.isCorrect
  })

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <header className="bg-white border-b border-slate-200 px-4 py-3">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <Link href="/" className="text-sm text-slate-400 hover:text-slate-600 transition-colors">
            ← All Subjects
          </Link>
          <span className="text-sm font-medium text-slate-700">Session Results</span>
        </div>
      </header>

      <main className="flex-1 px-4 py-8">
        <div className="max-w-3xl mx-auto space-y-6">
          {/* Score card */}
          <div
            className="rounded-2xl p-8 text-center border"
            style={passed
              ? { backgroundColor: '#EAF3DE', borderColor: '#B8D89A' }
              : { backgroundColor: '#FCEBEB', borderColor: '#F5BEBE' }
            }
          >
            <div
              className="text-7xl font-black mb-2"
              style={{ color: passed ? '#27500A' : '#791F1F' }}
            >
              {score}%
            </div>
            <div
              className="text-xl font-bold"
              style={{ color: passed ? '#27500A' : '#791F1F' }}
            >
              {passed ? 'PASS' : 'FAIL'}
            </div>
            <p className="text-sm mt-2" style={{ color: passed ? '#3a6b10' : '#9b3232' }}>
              {passed ? 'Well done! You scored above the 70% pass threshold.' : 'Keep practicing — you need 70% to pass.'}
            </p>
          </div>

          {/* Stat cards */}
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-white rounded-xl border border-slate-200 p-4 text-center">
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-green-100 mx-auto mb-2">
                <IconCheck size={16} className="text-green-600" />
              </div>
              <div className="text-2xl font-bold text-slate-800">{correct}</div>
              <div className="text-xs text-slate-500 mt-0.5">Correct</div>
            </div>
            <div className="bg-white rounded-xl border border-slate-200 p-4 text-center">
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-red-100 mx-auto mb-2">
                <IconX size={16} className="text-red-600" />
              </div>
              <div className="text-2xl font-bold text-slate-800">{incorrect}</div>
              <div className="text-xs text-slate-500 mt-0.5">Incorrect</div>
            </div>
            <div className="bg-white rounded-xl border border-slate-200 p-4 text-center">
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-slate-100 mx-auto mb-2">
                <IconMinus size={16} className="text-slate-500" />
              </div>
              <div className="text-2xl font-bold text-slate-800">{skipped}</div>
              <div className="text-xs text-slate-500 mt-0.5">Skipped</div>
            </div>
          </div>

          {/* Review incorrect */}
          {incorrectQs.length > 0 && (
            <div>
              <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-3">
                Review Incorrect Answers
              </h2>
              <div className="space-y-4">
                {incorrectQs.map(q => {
                  const userAnswer = sessionState.answers[q.id]
                  const correctOpt = q.options?.find(o => o.is_correct)
                  const userOpt = q.options?.find(o => o.option_letter === userAnswer?.selected)
                  return (
                    <div key={q.id} className="bg-white rounded-xl border border-slate-200 p-5">
                      <p className="text-slate-800 font-medium text-sm mb-4">{q.question_text}</p>
                      {userOpt && (
                        <div className="flex items-start gap-2 p-3 rounded-lg bg-red-50 border border-red-200 mb-2">
                          <IconX size={16} className="text-red-500 flex-shrink-0 mt-0.5" />
                          <div>
                            <span className="text-xs font-semibold text-red-600 block">Your answer</span>
                            <span className="text-sm text-red-700">{userAnswer?.selected}. {userOpt.option_text}</span>
                          </div>
                        </div>
                      )}
                      {correctOpt && (
                        <div className="flex items-start gap-2 p-3 rounded-lg bg-green-50 border border-green-200 mb-3">
                          <IconCheck size={16} className="text-green-500 flex-shrink-0 mt-0.5" />
                          <div>
                            <span className="text-xs font-semibold text-green-600 block">Correct answer</span>
                            <span className="text-sm text-green-700">{correctOpt.option_letter}. {correctOpt.option_text}</span>
                          </div>
                        </div>
                      )}
                      {q.explanation && (
                        <p className="text-xs text-slate-500 border-t border-slate-100 pt-3 leading-relaxed">
                          {q.explanation}
                        </p>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* Action buttons */}
          <div className="flex gap-3 pb-8">
            <Link
              href={`/subject/${session.subject_id}`}
              className="flex-1 py-3 rounded-xl border-2 border-slate-200 text-center font-semibold text-slate-700 hover:border-slate-300 transition-all"
            >
              Try Again
            </Link>
            <Link
              href="/"
              className="flex-1 py-3 rounded-xl text-center font-semibold text-white transition-all"
              style={{ backgroundColor: '#185FA5' }}
            >
              All Subjects
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}
