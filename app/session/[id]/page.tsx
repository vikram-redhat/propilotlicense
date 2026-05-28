'use client'
import { useEffect, useState, useCallback, use } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { Session, Question, SessionState, SourceBook } from '@/lib/types'
import { IconFlag, IconChevronRight, IconBook, IconBook2 } from '@tabler/icons-react'

export default function SessionPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const [session, setSession] = useState<Session | null>(null)
  const [questions, setQuestions] = useState<Question[]>([])
  const [sessionState, setSessionState] = useState<SessionState | null>(null)
  const [books, setBooks] = useState<Record<string, SourceBook>>({})
  const [loading, setLoading] = useState(true)
  const [timeLeft, setTimeLeft] = useState<number | null>(null)
  const [showNavigator, setShowNavigator] = useState(false)
  const [flagged, setFlagged] = useState<Set<string>>(new Set())

  const saveState = useCallback((state: SessionState) => {
    localStorage.setItem(`session_${id}`, JSON.stringify(state))
    setSessionState(state)
  }, [id])

  useEffect(() => {
    async function load() {
      const { data: sess } = await supabase
        .from('sessions')
        .select('*')
        .eq('id', id)
        .single()

      if (!sess) { router.push('/'); return }
      setSession(sess)

      const { data: qs } = await supabase
        .from('questions')
        .select('*, options:question_options(*)')
        .in('id', sess.question_ids)

      if (!qs) { setLoading(false); return }

      const ordered = sess.question_ids
        .map((qid: string) => qs.find((q: Question) => q.id === qid))
        .filter(Boolean) as Question[]

      setQuestions(ordered)

      // Load source books for questions that have one
      const bookIds = [...new Set(ordered.map(q => q.source_book_id).filter(Boolean))] as string[]
      if (bookIds.length > 0) {
        const { data: bks } = await supabase.from('source_books').select('*').in('id', bookIds)
        const bkMap: Record<string, SourceBook> = {}
        bks?.forEach(b => { bkMap[b.id] = b })
        setBooks(bkMap)
      }

      const stored = localStorage.getItem(`session_${id}`)
      const state: SessionState = stored
        ? JSON.parse(stored)
        : { sessionId: id, currentIndex: 0, answers: {}, startedAt: new Date().toISOString() }
      setSessionState(state)

      if (sess.mode === 'mock') {
        const elapsed = stored
          ? Math.floor((Date.now() - new Date(JSON.parse(stored).startedAt).getTime()) / 1000)
          : 0
        const totalSeconds = sess.question_ids.length * 60
        setTimeLeft(Math.max(0, totalSeconds - elapsed))
      }

      setLoading(false)
    }
    load()
  }, [id, router])

  useEffect(() => {
    if (session?.mode !== 'mock' || timeLeft === null) return
    if (timeLeft <= 0) { submitExam(); return }
    const t = setTimeout(() => setTimeLeft(t => (t ?? 1) - 1), 1000)
    return () => clearTimeout(t)
  })

  const submitExam = useCallback(() => {
    if (!sessionState) return
    const updated = { ...sessionState, submittedAt: new Date().toISOString() }
    localStorage.setItem(`session_${id}`, JSON.stringify(updated))
    router.push(`/results/${id}`)
  }, [sessionState, id, router])

  function handleAnswer(letter: string) {
    if (!sessionState || !questions.length) return
    const q = questions[sessionState.currentIndex]
    if (sessionState.answers[q.id]) return
    const correctOption = q.options?.find(o => o.is_correct)
    const isCorrect = correctOption?.option_letter === letter
    saveState({ ...sessionState, answers: { ...sessionState.answers, [q.id]: { selected: letter, isCorrect } } })
  }

  function goNext() {
    if (!sessionState || !questions.length) return
    const nextIndex = sessionState.currentIndex + 1
    if (nextIndex >= questions.length) { submitExam(); return }
    saveState({ ...sessionState, currentIndex: nextIndex })
  }

  function jumpTo(index: number) {
    if (!sessionState) return
    saveState({ ...sessionState, currentIndex: index })
    setShowNavigator(false)
  }

  async function flagQuestion() {
    if (!sessionState || !questions.length) return
    const q = questions[sessionState.currentIndex]
    await supabase.from('questions').update({ flagged: true }).eq('id', q.id)
    setFlagged(prev => new Set([...prev, q.id]))
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full" />
      </div>
    )
  }

  if (!session || !sessionState || questions.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center text-slate-400">
        Session not found.
      </div>
    )
  }

  const currentQ = questions[sessionState.currentIndex]
  const answered = sessionState.answers[currentQ?.id]
  const correctOption = currentQ?.options?.find(o => o.is_correct)
  const isMock = session.mode === 'mock'
  const isLastQuestion = sessionState.currentIndex === questions.length - 1
  const answeredCount = Object.keys(sessionState.answers).length
  const currentBook = currentQ?.source_book_id ? books[currentQ.source_book_id] : null

  const optionLetters: Array<'A' | 'B' | 'C' | 'D'> = ['A', 'B', 'C', 'D']

  function formatTime(seconds: number) {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0')
    const s = (seconds % 60).toString().padStart(2, '0')
    return `${m}:${s}`
  }

  function getOptionStyle(letter: string) {
    if (!answered) return 'border-slate-200 bg-white hover:border-blue-300 cursor-pointer'
    if (isMock) {
      return answered.selected === letter
        ? 'border-blue-400 bg-blue-50 cursor-default'
        : 'border-slate-200 bg-white cursor-default opacity-70'
    }
    if (letter === correctOption?.option_letter) return 'border-green-400 bg-green-50 cursor-default'
    if (answered.selected === letter && !answered.isCorrect) return 'border-red-400 bg-red-50 cursor-default'
    return 'border-slate-200 bg-white cursor-default opacity-70'
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <header className="bg-white border-b border-slate-200 px-4 py-3 sticky top-0 z-10">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <span className="text-sm text-slate-500 font-medium">
            Question {sessionState.currentIndex + 1} of {questions.length}
          </span>
          {isMock ? (
            <div className="flex items-center gap-3">
              <span
                className={`text-sm font-mono font-semibold px-3 py-1 rounded-lg ${
                  (timeLeft ?? 0) < 300 ? 'bg-red-50 text-red-600' : 'bg-slate-100 text-slate-700'
                }`}
              >
                {formatTime(timeLeft ?? 0)}
              </span>
              <button
                onClick={() => setShowNavigator(!showNavigator)}
                className="text-xs text-blue-600 hover:underline"
              >
                Navigator
              </button>
              <button
                onClick={submitExam}
                className="text-xs bg-red-500 text-white px-3 py-1.5 rounded-lg hover:bg-red-600 font-medium"
              >
                Submit
              </button>
            </div>
          ) : (
            <span className="text-sm text-slate-400">Practice Mode</span>
          )}
        </div>
        <div className="max-w-3xl mx-auto mt-2">
          <div className="h-1 bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all"
              style={{
                width: `${((sessionState.currentIndex + 1) / questions.length) * 100}%`,
                backgroundColor: '#185FA5',
              }}
            />
          </div>
        </div>
      </header>

      {isMock && showNavigator && (
        <div className="fixed inset-0 bg-black/40 z-20 flex items-start justify-end" onClick={() => setShowNavigator(false)}>
          <div className="bg-white w-72 h-full p-4 overflow-y-auto shadow-xl" onClick={e => e.stopPropagation()}>
            <h3 className="font-semibold text-slate-700 mb-3">Question Navigator</h3>
            <div className="grid grid-cols-5 gap-2">
              {questions.map((q, i) => {
                const isAnswered = !!sessionState.answers[q.id]
                const isCurrent = i === sessionState.currentIndex
                return (
                  <button
                    key={q.id}
                    onClick={() => jumpTo(i)}
                    className={`w-10 h-10 rounded-lg text-sm font-medium transition-all ${
                      isCurrent ? 'ring-2 ring-blue-500' : ''
                    } ${isAnswered ? 'text-white' : 'bg-slate-100 text-slate-500'}`}
                    style={isAnswered ? { backgroundColor: '#185FA5' } : {}}
                  >
                    {i + 1}
                  </button>
                )
              })}
            </div>
            <div className="mt-4 text-xs text-slate-500">{answeredCount} / {questions.length} answered</div>
          </div>
        </div>
      )}

      <main className="flex-1 px-4 py-6">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-xl border border-slate-200 p-6 mb-4">
            <p className="text-slate-900 text-base leading-relaxed font-medium">{currentQ?.question_text}</p>
          </div>

          <div className="space-y-3 mb-4">
            {optionLetters.map(letter => {
              const opt = currentQ?.options?.find(o => o.option_letter === letter)
              if (!opt) return null
              return (
                <button
                  key={letter}
                  onClick={() => !answered && handleAnswer(letter)}
                  className={`w-full text-left p-4 rounded-xl border-2 transition-all ${getOptionStyle(letter)}`}
                >
                  <div className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-7 h-7 rounded-full border-2 border-current flex items-center justify-center text-xs font-bold">
                      {letter}
                    </span>
                    <span className="text-slate-700 text-sm leading-relaxed">{opt.option_text}</span>
                  </div>
                </button>
              )
            })}
          </div>

          {/* Explanation + citation (practice mode, after answering) */}
          {!isMock && answered && (
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-4 space-y-3">
              {currentQ?.explanation && (
                <div>
                  <h4 className="font-semibold text-blue-800 text-sm mb-1">Explanation</h4>
                  <p className="text-blue-700 text-sm leading-relaxed">{currentQ.explanation}</p>
                </div>
              )}
              {currentBook && (
                <div className="flex items-start gap-2 pt-2 border-t border-blue-200">
                  {currentQ.citation_verified ? (
                    <IconBook size={15} className="text-blue-500 flex-shrink-0 mt-0.5" />
                  ) : (
                    <IconBook2 size={15} className="text-blue-400 flex-shrink-0 mt-0.5" />
                  )}
                  <p className="text-xs text-blue-600 leading-relaxed">
                    <span className="font-medium">{currentBook.title}</span>
                    {currentBook.author && <span> — {currentBook.author}</span>}
                    {currentQ.source_chapter && (
                      <span>
                        {' · '}
                        {currentQ.citation_verified ? currentQ.source_chapter : `${currentQ.source_chapter} (approx.)`}
                      </span>
                    )}
                    {currentQ.source_page && (
                      <span>
                        {' · '}
                        {currentQ.citation_verified ? currentQ.source_page : `${currentQ.source_page} (approx.)`}
                      </span>
                    )}
                    {!currentQ.citation_verified && (
                      <span className="text-blue-400"> · AI estimate</span>
                    )}
                  </p>
                </div>
              )}
            </div>
          )}

          <div className="flex items-center justify-between">
            <button
              onClick={flagQuestion}
              disabled={flagged.has(currentQ?.id)}
              className={`flex items-center gap-1.5 text-xs transition-colors ${
                flagged.has(currentQ?.id) ? 'text-amber-500' : 'text-slate-400 hover:text-amber-500'
              }`}
            >
              <IconFlag size={14} />
              {flagged.has(currentQ?.id) ? 'Flagged' : 'Flag question'}
            </button>

            {(isMock || answered) && (
              <button
                onClick={goNext}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-white text-sm transition-all"
                style={{ backgroundColor: '#185FA5' }}
              >
                {isLastQuestion ? (isMock ? 'Review & Submit' : 'See Results') : 'Next Question'}
                <IconChevronRight size={16} />
              </button>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
