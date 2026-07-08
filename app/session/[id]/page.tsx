'use client'
import { useEffect, useState, useCallback, use } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { Session, Question, SessionState, SourceBook } from '@/lib/types'

const LIGHTS = 15

function formatTime(seconds: number) {
  const m = Math.floor(seconds / 60).toString().padStart(2, '0')
  const s = (seconds % 60).toString().padStart(2, '0')
  return `${m}:${s}`
}

export default function SessionPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const [session, setSession]         = useState<Session | null>(null)
  const [questions, setQuestions]     = useState<Question[]>([])
  const [sessionState, setSessionState] = useState<SessionState | null>(null)
  const [books, setBooks]             = useState<Record<string, SourceBook>>({})
  const [chapters, setChapters]       = useState<Record<string, { chapter_number: number; chapter_name: string }>>({})
  const [subjectName, setSubjectName] = useState('')
  const [loading, setLoading]         = useState(true)
  const [timeLeft, setTimeLeft]       = useState<number | null>(null)
  const [flagged, setFlagged]         = useState<Set<string>>(new Set())
  const [userId, setUserId]           = useState<string | null>(null)

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      setUserId(user?.id ?? null)

      const { data: sess } = await supabase.from('sessions').select('*').eq('id', id).single()
      if (!sess) { router.push('/'); return }
      setSession(sess)

      const { data: qs } = await supabase.from('questions').select('*, options:question_options(*)').in('id', sess.question_ids)
      if (!qs) { setLoading(false); return }

      const ordered = sess.question_ids.map((qid: string) => qs.find((q: Question) => q.id === qid)).filter(Boolean) as Question[]
      setQuestions(ordered)

      if (sess.scope === 'nav_rai_combined') {
        setSubjectName('Air Navigation + Radio Aids')
      } else if (sess.scope === 'composite') {
        setSubjectName('Composite Paper')
      } else {
        const { data: sub } = await supabase.from('subjects').select('name').eq('id', sess.subject_id).single()
        setSubjectName(sub?.name ?? '')
      }

      const bookIds = [...new Set(ordered.map(q => q.source_book_id).filter(Boolean))] as string[]
      if (bookIds.length > 0) {
        const { data: bks } = await supabase.from('source_books').select('*').in('id', bookIds)
        const bkMap: Record<string, SourceBook> = {}
        bks?.forEach(b => { bkMap[b.id] = b })
        setBooks(bkMap)
      }

      const chapterIds = [...new Set(ordered.map(q => q.chapter_id).filter(Boolean))] as string[]
      if (chapterIds.length > 0) {
        const { data: chs } = await supabase.from('chapters').select('id, chapter_number, chapter_name').in('id', chapterIds)
        const chMap: Record<string, { chapter_number: number; chapter_name: string }> = {}
        chs?.forEach(c => { chMap[c.id] = c })
        setChapters(chMap)
      }

      const { data: dbAnswers } = await supabase.from('session_answers').select('question_id, selected_option_id, is_correct').eq('session_id', id)
      const answersMap: SessionState['answers'] = {}
      for (const ans of dbAnswers ?? []) {
        const q = ordered.find(q => q.id === ans.question_id)
        const opt = q?.options?.find(o => o.id === ans.selected_option_id)
        if (opt) answersMap[ans.question_id] = { selected: opt.option_letter, isCorrect: ans.is_correct }
      }

      const firstUnanswered = ordered.findIndex(q => !answersMap[q.id])
      const answeredCount = Object.keys(answersMap).length
      const startIndex = answeredCount === ordered.length ? ordered.length - 1 : Math.max(0, firstUnanswered)

      setSessionState({ sessionId: id, currentIndex: startIndex, answers: answersMap, startedAt: sess.created_at })

      if (sess.mode === 'mock') {
        const elapsed = Math.floor((Date.now() - new Date(sess.created_at).getTime()) / 1000)
        setTimeLeft(Math.max(0, (sess.time_limit_secs ?? sess.question_ids.length * 45) - elapsed))
      }

      setLoading(false)
    }
    load()
  }, [id, router])

  const submitExam = useCallback(() => { router.push(`/results/${id}`) }, [id, router])

  useEffect(() => {
    if (session?.mode !== 'mock' || timeLeft === null) return
    if (timeLeft <= 0) { submitExam(); return }
    const t = setTimeout(() => setTimeLeft(t => (t ?? 1) - 1), 1000)
    return () => clearTimeout(t)
  })

  async function handleAnswer(letter: string) {
    if (!sessionState || !questions.length) return
    const q = questions[sessionState.currentIndex]
    if (sessionState.answers[q.id]) return

    const correctOption = q.options?.find(o => o.is_correct)
    const isCorrect = correctOption?.option_letter === letter
    const selectedOption = q.options?.find(o => o.option_letter === letter)

    await supabase.from('session_answers').insert({
      session_id: id, question_id: q.id,
      selected_option_id: selectedOption?.id ?? null, is_correct: isCorrect,
    })

    setSessionState(prev => prev ? { ...prev, answers: { ...prev.answers, [q.id]: { selected: letter, isCorrect } } } : prev)
  }

  function goNext() {
    if (!sessionState || !questions.length) return
    const nextIndex = sessionState.currentIndex + 1
    if (nextIndex >= questions.length) { submitExam(); return }
    setSessionState(prev => prev ? { ...prev, currentIndex: nextIndex } : prev)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function goPrev() {
    if (!sessionState || sessionState.currentIndex === 0) return
    setSessionState(prev => prev ? { ...prev, currentIndex: prev.currentIndex - 1 } : prev)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function jumpTo(index: number) {
    setSessionState(prev => prev ? { ...prev, currentIndex: index } : prev)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  async function flagQuestion() {
    if (!sessionState || !questions.length || !userId) return
    const q = questions[sessionState.currentIndex]
    setFlagged(prev => new Set([...prev, q.id])) // optimistic
    await fetch('/api/session/flag', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ questionId: q.id }),
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--clr-surface)' }}>
        <div className="animate-spin w-8 h-8 border-4 border-t-transparent rounded-full" style={{ borderColor: 'var(--clr-primary)', borderTopColor: 'transparent' }}/>
      </div>
    )
  }

  if (!session || !sessionState || questions.length === 0) {
    return <div className="min-h-screen flex items-center justify-center" style={{ color: 'var(--clr-text-med)' }}>Session not found.</div>
  }

  const currentQ    = questions[sessionState.currentIndex]
  const answered    = sessionState.answers[currentQ?.id]
  const correctOpt  = currentQ?.options?.find(o => o.is_correct)
  const isMock      = session.mode === 'mock'
  const isLastQ     = sessionState.currentIndex === questions.length - 1
  const answeredCount = Object.keys(sessionState.answers).length
  const currentBook = currentQ?.source_book_id ? books[currentQ.source_book_id] : null
  const currentChapter = currentQ?.chapter_id ? chapters[currentQ.chapter_id] : null
  const chapterLabel = currentChapter
    ? `Chapter ${currentChapter.chapter_number} — ${currentChapter.chapter_name}`
    : currentQ?.source_chapter ?? null

  const filledLights = Math.min(LIGHTS, Math.round((answeredCount / questions.length) * LIGHTS))

  const diffStyles: Record<string, { bg: string; color: string }> = {
    basic:    { bg: '#E5F7ED', color: '#1A7A4A' },
    advanced: { bg: '#FDEAEA', color: '#B83232' },
    all:      { bg: 'var(--clr-amber-light)', color: '#9A6000' },
  }
  const diffStyle = diffStyles[currentQ?.difficulty ?? 'all'] ?? diffStyles.all
  const diffLabel = currentQ?.difficulty === 'basic' ? 'Basic' : currentQ?.difficulty === 'advanced' ? 'Advanced' : 'Mixed'

  const isCorrect = answered && answered.isCorrect
  const explBg          = isCorrect ? '#E5F7ED' : '#FDEAEA'
  const explBorderColor = isCorrect ? '#1A7A4A' : '#B83232'
  const explLabelColor  = isCorrect ? '#1A7A4A' : '#B83232'

  return (
    <div style={{ minHeight: '100vh', background: 'var(--clr-surface)', color: 'var(--clr-text)' }}>

      {/* ── Sticky sub-nav ── */}
      <div style={{ position: 'sticky', top: 0, zIndex: 150, background: 'var(--clr-surface)', borderBottom: '1px solid var(--clr-border)' }}>
        <div className="px-5 sm:px-9 lg:px-[60px]" style={{ paddingTop: 12, paddingBottom: 12 }}>
          {/* Top row: breadcrumb + Q counter */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 11 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <button
                onClick={() => router.back()}
                style={{ fontSize: 12, color: 'var(--clr-text-med)', background: 'transparent', border: 'none', cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center', gap: 3 }}
              >
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M8 2.5L4 6l4 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                Session
              </button>
              <span style={{ color: 'var(--clr-border)', fontSize: 14 }}>›</span>
              <span style={{ fontSize: 12, color: 'var(--clr-text)', fontWeight: 500 }}>{subjectName}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              {isMock && (
                <>
                  <span style={{ fontFamily: 'var(--font-outfit),sans-serif', fontSize: 12, fontWeight: 600, color: (timeLeft ?? 0) <= 60 ? '#B83232' : 'var(--clr-text-med)', background: (timeLeft ?? 0) <= 60 ? '#FDEAEA' : 'var(--clr-surf-alt)', padding: '3px 8px', borderRadius: 6 }}>
                    {formatTime(timeLeft ?? 0)}
                  </span>
                  <button onClick={submitExam} style={{ fontSize: 11, background: '#B83232', color: '#fff', border: 'none', padding: '4px 10px', borderRadius: 7, cursor: 'pointer', fontWeight: 600 }}>Submit</button>
                </>
              )}
              <div style={{ fontFamily: 'var(--font-outfit),sans-serif', fontSize: 12, fontWeight: 600, color: 'var(--clr-text-med)' }}>
                <span style={{ color: 'var(--clr-text)', fontSize: 15, fontWeight: 700 }}>{sessionState.currentIndex + 1}</span>
                {' '}/ {questions.length}
              </div>
            </div>
          </div>

          {/* Runway centreline lights */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
            {Array.from({ length: LIGHTS }, (_, i) => (
              <div
                key={i}
                style={{
                  width: 18, height: 4, borderRadius: 1, flexShrink: 0,
                  background: i < filledLights ? 'var(--clr-amber)' : 'var(--clr-border)',
                  transition: 'background 0.35s ease',
                }}
              />
            ))}
          </div>

          {/* Question navigator strip — mock mode only, always visible */}
          {isMock && (
            <div style={{ display: 'flex', gap: 6, overflowX: 'auto', marginTop: 10, paddingBottom: 2 }}>
              {questions.map((q, i) => {
                const isAns = !!sessionState.answers[q.id]
                const isCur = i === sessionState.currentIndex
                return (
                  <button
                    key={q.id}
                    onClick={() => jumpTo(i)}
                    style={{
                      flexShrink: 0, width: 26, height: 26, borderRadius: '50%',
                      fontSize: 11, fontWeight: 600, cursor: 'pointer',
                      border: isCur ? '2px solid var(--clr-amber)' : '1px solid transparent',
                      background: isAns ? 'var(--clr-primary)' : 'var(--clr-surf-alt)',
                      color: isAns ? '#fff' : 'var(--clr-text-med)',
                    }}
                  >
                    {i + 1}
                  </button>
                )
              })}
            </div>
          )}
        </div>
      </div>

      {/* ── Question body ── */}
      <div style={{ maxWidth: 900, margin: '0 auto', padding: '18px 16px 48px' }}>

        {/* Tags */}
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 16 }}>
          <span style={{ fontSize: 11, fontWeight: 600, padding: '4px 10px', borderRadius: 20, background: 'var(--clr-pri-light)', color: 'var(--clr-primary)' }}>{subjectName}</span>
          {chapterLabel && (
            <span style={{ fontSize: 11, fontWeight: 500, padding: '4px 10px', borderRadius: 20, background: 'var(--clr-surf-alt)', color: 'var(--clr-text-med)', border: '1px solid var(--clr-border)' }}>{chapterLabel}</span>
          )}
          <span style={{ fontSize: 11, fontWeight: 600, padding: '4px 10px', borderRadius: 20, background: diffStyle.bg, color: diffStyle.color }}>{diffLabel}</span>
        </div>

        {/* Question text */}
        <h2 style={{ fontFamily: 'var(--font-outfit),sans-serif', fontSize: 22, fontWeight: 600, lineHeight: 1.5, color: 'var(--clr-text)', letterSpacing: '-0.2px', marginBottom: 20, maxWidth: 660 }}>
          {currentQ?.question_text}
        </h2>

        {/* Options */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 9, marginBottom: 18, maxWidth: 660 }}>
          {(['A', 'B', 'C', 'D'] as const).map(letter => {
            const opt = currentQ?.options?.find(o => o.option_letter === letter)
            if (!opt) return null

            let borderColor = 'var(--clr-border)', bg = 'var(--clr-surface)', labelBg = 'var(--clr-surf-alt)', labelColor = 'var(--clr-text-med)', textColor = 'var(--clr-text)'
            if (answered) {
              if (isMock) {
                if (answered.selected === letter) { borderColor = 'var(--clr-primary)'; bg = 'var(--clr-pri-light)'; labelBg = 'var(--clr-primary)'; labelColor = '#fff' }
                else { textColor = 'var(--clr-text-med)' }
              } else {
                if (letter === correctOpt?.option_letter) { bg = '#E5F7ED'; borderColor = '#1A7A4A'; labelBg = '#1A7A4A'; labelColor = '#fff'; textColor = '#1A7A4A' }
                else if (answered.selected === letter && !answered.isCorrect) { bg = '#FDEAEA'; borderColor = '#B83232'; labelBg = '#B83232'; labelColor = '#fff'; textColor = '#B83232' }
                else { textColor = 'var(--clr-text-med)' }
              }
            }

            return (
              <div
                key={letter}
                onClick={() => !answered && handleAnswer(letter)}
                style={{ display: 'flex', alignItems: 'flex-start', gap: 11, padding: 14, borderRadius: 13, border: `1.5px solid ${borderColor}`, background: bg, cursor: answered ? 'default' : 'pointer', transition: 'border-color 0.25s, background 0.25s' }}
              >
                <div style={{ width: 28, height: 28, borderRadius: 7, background: labelBg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <span style={{ fontFamily: 'var(--font-outfit),sans-serif', fontSize: 12, fontWeight: 700, color: labelColor }}>{letter}</span>
                </div>
                <span style={{ fontSize: 15, color: textColor, lineHeight: 1.52, paddingTop: 5, flex: 1 }}>{opt.option_text}</span>
              </div>
            )
          })}
        </div>

        {/* Explanation (practice mode, after answer) */}
        {!isMock && answered && (
          <div style={{ animation: 'slideUp 0.36s cubic-bezier(0.16,1,0.3,1) both', background: explBg, border: `1px solid ${explBorderColor}`, borderRadius: 14, padding: 16, marginBottom: 14, maxWidth: 660 }}>
            <style>{`@keyframes slideUp { from{opacity:0;transform:translateY(22px)} to{opacity:1;transform:translateY(0)} }`}</style>
            <div style={{ fontFamily: 'var(--font-outfit),sans-serif', fontSize: 13, fontWeight: 700, color: explLabelColor, marginBottom: 9 }}>
              {isCorrect ? 'Correct!' : 'Incorrect — review this'}
            </div>
            {currentQ?.explanation && (
              <p style={{ fontSize: 14, color: 'var(--clr-text)', lineHeight: 1.66, marginBottom: 11 }}>{currentQ.explanation}</p>
            )}
            {currentBook && (
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 7, padding: '9px 11px', background: 'var(--clr-surface)', borderRadius: 8 }}>
                <svg width="13" height="13" viewBox="0 0 13 13" fill="none" style={{ flexShrink: 0, marginTop: 1 }}>
                  <rect x="1" y="1" width="11" height="11" rx="1.5" stroke="var(--clr-text-med)" strokeWidth="1.1"/>
                  <path d="M3 4.5h7M3 7h5" stroke="var(--clr-text-med)" strokeWidth="1" strokeLinecap="round"/>
                </svg>
                <span style={{ fontSize: 12.5, color: 'var(--clr-text-med)', fontStyle: 'italic', lineHeight: 1.5 }}>
                  {currentBook.title}{currentBook.author ? ` — ${currentBook.author}` : ''}
                  {chapterLabel ? ` · ${chapterLabel}` : ''}
                  {currentQ.source_page ? ` · ${currentQ.source_page}` : ''}
                  {!currentQ.citation_verified && ' (approx.)'}
                </span>
              </div>
            )}
          </div>
        )}

        {/* Next button (after answer, or always in mock) */}
        {(isMock || answered) && (
          <button
            onClick={goNext}
            style={{ width: '100%', maxWidth: 660, padding: 14, background: 'var(--clr-amber)', color: '#fff', border: 'none', borderRadius: 13, fontFamily: 'var(--font-outfit),sans-serif', fontSize: 16, fontWeight: 700, cursor: 'pointer', boxShadow: '0 4px 16px var(--clr-amber-glow)', marginBottom: 14, display: 'block' }}
          >
            {isLastQ ? (isMock ? 'Submit exam →' : 'See results →') : 'Next question →'}
          </button>
        )}

        {/* Back / Forward — practice mode only */}
        {!isMock && (
          <div style={{ display: 'flex', gap: 20, marginBottom: 4 }}>
            <button
              onClick={goPrev}
              disabled={sessionState.currentIndex === 0}
              style={{
                fontSize: 14, background: 'transparent', border: 'none', padding: '8px 0',
                textDecoration: 'underline', textUnderlineOffset: 3,
                color: sessionState.currentIndex === 0 ? 'var(--clr-border)' : 'var(--clr-text-med)',
                cursor: sessionState.currentIndex === 0 ? 'default' : 'pointer',
              }}
            >
              ‹ Back
            </button>
            <button
              onClick={goNext}
              style={{ fontSize: 14, color: 'var(--clr-text-med)', background: 'transparent', border: 'none', cursor: 'pointer', textDecoration: 'underline', textUnderlineOffset: 3, padding: '8px 0' }}
            >
              {isLastQ ? 'Finish ›' : 'Forward ›'}
            </button>
          </div>
        )}

        {/* Skip + Flag row */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: 4 }}>
          {!answered && (
            <button onClick={goNext} style={{ fontSize: 14, color: 'var(--clr-text-med)', background: 'transparent', border: 'none', cursor: 'pointer', textDecoration: 'underline', textUnderlineOffset: 3, padding: '8px 0' }}>
              Skip question
            </button>
          )}
          <button
            onClick={flagQuestion}
            disabled={flagged.has(currentQ?.id) || !userId}
            style={{ fontSize: 12, color: flagged.has(currentQ?.id) ? 'var(--clr-amber)' : 'var(--clr-text-med)', background: 'transparent', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4, marginLeft: 'auto' }}
          >
            <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M2.5 2v9M2.5 2h7.5l-2 3.5 2 3.5H2.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/></svg>
            {flagged.has(currentQ?.id) ? 'Flagged' : 'Flag this question'}
          </button>
        </div>
      </div>
    </div>
  )
}
