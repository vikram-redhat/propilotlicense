'use client'
import { useEffect, useState, use } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { Session, Question, SessionState, SourceBook } from '@/lib/types'
import { IconCheck, IconX, IconMinus, IconBook, IconBook2 } from '@tabler/icons-react'
import SiteFooter from '@/components/SiteFooter'
import SiteHeader from '@/components/SiteHeader'

export default function ResultsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const [session, setSession] = useState<Session | null>(null)
  const [questions, setQuestions] = useState<Question[]>([])
  const [sessionState, setSessionState] = useState<SessionState | null>(null)
  const [books, setBooks] = useState<Record<string, SourceBook>>({})
  const [chapters, setChapters] = useState<Record<string, { chapter_number: number; chapter_name: string }>>({})
  const [subjectName, setSubjectName] = useState('')
  const [topicName, setTopicName] = useState('')
  const [subjectMap, setSubjectMap] = useState<Record<string, string>>({})
  const [codeMap, setCodeMap] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const { data: sess } = await supabase.from('sessions').select('*').eq('id', id).single()
      if (!sess) { router.push('/'); return }
      setSession(sess)

      // Fetch saved answers from DB
      const { data: dbAnswers } = await supabase
        .from('session_answers')
        .select('question_id, selected_option_id, is_correct')
        .eq('session_id', id)

      const subjectNameForScope =
        sess.scope === 'nav_rai_combined' ? 'Air Navigation + Radio Aids' :
        sess.scope === 'composite' ? 'Composite Paper' : null

      const [{ data: qs }, { data: sub }] = await Promise.all([
        supabase.from('questions').select('*, options:question_options(*)').in('id', sess.question_ids),
        subjectNameForScope
          ? Promise.resolve({ data: { name: subjectNameForScope } })
          : supabase.from('subjects').select('name').eq('id', sess.subject_id).single(),
      ])

      let topicDisplayName = ''
      if (sess.scope === 'topic' && sess.topic_id) {
        const { data: topic } = await supabase.from('topics').select('name').eq('id', sess.topic_id).single()
        topicDisplayName = topic?.name || ''
      }

      if (qs) {
        const ordered = sess.question_ids
          .map((qid: string) => qs.find((q: Question) => q.id === qid))
          .filter(Boolean) as Question[]
        setQuestions(ordered)

        // Reconstruct answers map from DB answers + loaded question options
        const answersMap: SessionState['answers'] = {}
        for (const ans of dbAnswers ?? []) {
          const q = ordered.find(q => q.id === ans.question_id)
          const opt = q?.options?.find(o => o.id === ans.selected_option_id)
          if (opt) {
            answersMap[ans.question_id] = { selected: opt.option_letter, isCorrect: ans.is_correct }
          }
        }
        setSessionState({ sessionId: id, currentIndex: 0, answers: answersMap, startedAt: sess.created_at })

        const bookIds = [...new Set(ordered.map(q => q.source_book_id).filter(Boolean))] as string[]
        if (bookIds.length > 0) {
          const { data: bks } = await supabase.from('source_books').select('*').in('id', bookIds)
          const bkMap: Record<string, SourceBook> = {}
          bks?.forEach(b => { bkMap[b.id] = b })
          setBooks(bkMap)
        }

        const chapterIds = [...new Set(ordered.map(q => q.chapter_id).filter(Boolean))] as string[]
        if (chapterIds.length > 0) {
          const { data: chs } = await supabase
            .from('chapters')
            .select('id, chapter_number, chapter_name')
            .in('id', chapterIds)
          const chMap: Record<string, { chapter_number: number; chapter_name: string }> = {}
          chs?.forEach(c => { chMap[c.id] = c })
          setChapters(chMap)
        }

        if (sess.scope === 'nav_rai_combined' || sess.scope === 'composite') {
          const subjectIds = [...new Set(ordered.map(q => q.subject_id).filter(Boolean))] as string[]
          if (subjectIds.length > 0) {
            const { data: subs } = await supabase.from('subjects').select('id, name, code').in('id', subjectIds)
            const sMap: Record<string, string> = {}
            const cMap: Record<string, string> = {}
            subs?.forEach(s => { sMap[s.id] = s.name; cMap[s.id] = s.code })
            setSubjectMap(sMap)
            setCodeMap(cMap)
          }
        }
      }

      setSubjectName(sub?.name || '')
      setTopicName(topicDisplayName)
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
  const answeredCount = Object.keys(sessionState.answers).length
  const correct = Object.values(sessionState.answers).filter(a => a.isCorrect).length
  const incorrect = answeredCount - correct
  const skipped = total - answeredCount
  const score = total > 0 ? Math.round((correct / total) * 100) : 0
  const passed = score >= 70

  const incorrectQs = questions.filter(q => {
    const a = sessionState.answers[q.id]
    return a && !a.isCorrect
  })
  const correctQs = questions.filter(q => {
    const a = sessionState.answers[q.id]
    return a && a.isCorrect
  })
  const reviewOrder = [...incorrectQs, ...correctQs]

  const scopeLabel =
    session.scope === 'nav_rai_combined' ? 'Air Navigation + Radio Aids' :
    session.scope === 'composite' ? 'Composite Paper' :
    session.scope === 'book' && session.source_book_id && books[session.source_book_id]
      ? books[session.source_book_id].title :
    session.scope === 'topic' && topicName ? topicName :
    'Combined Paper'

  const backHref =
    session.scope === 'nav_rai_combined' || session.scope === 'composite'
      ? `/${session.licence_type.toLowerCase()}`
      : `/${session.licence_type.toLowerCase()}/${session.subject_id}`

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#F8FAFF', color: '#0D1B2E' }}>
      <SiteHeader />

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
            <div className="text-7xl font-black mb-2" style={{ color: passed ? '#27500A' : '#791F1F' }}>
              {score}%
            </div>
            <div className="text-xl font-bold" style={{ color: passed ? '#27500A' : '#791F1F' }}>
              {passed ? 'PASS' : 'FAIL'}
            </div>
            <p className="text-sm mt-2" style={{ color: passed ? '#3a6b10' : '#9b3232' }}>
              {passed ? 'Well done! You scored above the 70% pass threshold.' : 'Keep practising — you need 70% to pass.'}
            </p>
          </div>

          {/* Per-subject breakdown for nav_rai_combined */}
          {session.scope === 'nav_rai_combined' && Object.keys(subjectMap).length > 0 && (
            <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #D4E1F0', padding: '16px 20px' }}>
              {Object.entries(subjectMap).map(([sid, sName]) => {
                const subQs = questions.filter(q => q.subject_id === sid)
                const subCorrect = subQs.filter(q => sessionState.answers[q.id]?.isCorrect).length
                const subPct = subQs.length > 0 ? Math.round((subCorrect / subQs.length) * 100) : 0
                return (
                  <div key={sid} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #EEF3FA' }}>
                    <span style={{ fontSize: 20, fontWeight: 500, color: '#0D1B2E' }}>{sName}</span>
                    <span style={{ fontSize: 20, color: '#4A5E78' }}>
                      <span style={{ fontWeight: 700, color: subPct >= 70 ? '#1A7A4A' : '#B83232' }}>{subCorrect}/{subQs.length}</span>
                      <span style={{ marginLeft: 6, fontSize: 18 }}>({subPct}%)</span>
                    </span>
                  </div>
                )
              })}
            </div>
          )}

          {/* Per-section breakdown for composite */}
          {session.scope === 'composite' && Object.keys(codeMap).length > 0 && (() => {
            const groups = [
              { label: 'Navigation + Radio Aids', codes: ['NAV', 'RAI'] },
              { label: 'Meteorology', codes: ['MET'] },
              { label: 'Air Regulations', codes: ['REG'] },
            ]
            return (
              <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #D4E1F0', padding: '16px 20px' }}>
                {groups.map((g, i) => {
                  const gQs = questions.filter(q => g.codes.includes(codeMap[q.subject_id ?? '']))
                  const gCorrect = gQs.filter(q => sessionState.answers[q.id]?.isCorrect).length
                  const gPct = gQs.length > 0 ? Math.round((gCorrect / gQs.length) * 100) : 0
                  return (
                    <div key={g.label} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 0', borderBottom: i < groups.length - 1 ? '1px solid #EEF3FA' : 'none' }}>
                      <span style={{ fontSize: 20, fontWeight: 500, color: '#0D1B2E' }}>{g.label}</span>
                      <span style={{ fontSize: 20, color: '#4A5E78' }}>
                        <span style={{ fontWeight: 700, color: gPct >= 70 ? '#1A7A4A' : '#B83232' }}>{gCorrect}/{gQs.length}</span>
                        <span style={{ marginLeft: 6, fontSize: 18 }}>({gPct}%)</span>
                      </span>
                    </div>
                  )
                })}
              </div>
            )
          })()}

          {/* Stat cards */}
          <div className="grid grid-cols-3 gap-3">
            {[
              { icon: <IconCheck size={16} className="text-green-600" />, bg: 'bg-green-100', value: correct, label: 'Correct' },
              { icon: <IconX size={16} className="text-red-600" />, bg: 'bg-red-100', value: incorrect, label: 'Incorrect' },
              { icon: <IconMinus size={16} className="text-slate-500" />, bg: 'bg-slate-100', value: skipped, label: 'Skipped' },
            ].map(s => (
              <div key={s.label} className="bg-white rounded-xl border border-slate-200 p-4 text-center">
                <div className={`flex items-center justify-center w-8 h-8 rounded-full ${s.bg} mx-auto mb-2`}>
                  {s.icon}
                </div>
                <div className="text-2xl font-bold text-slate-800">{s.value}</div>
                <div className="text-xs text-slate-500 mt-0.5">{s.label}</div>
              </div>
            ))}
          </div>

          {/* Session context badges */}
          <div className="flex flex-wrap gap-2">
            <span className="text-xs px-3 py-1.5 rounded-full bg-slate-100 text-slate-600 font-medium">
              {session.licence_type}
            </span>
            <span className="text-xs px-3 py-1.5 rounded-full bg-slate-100 text-slate-600 font-medium">
              {scopeLabel}
            </span>
            <span className={`text-xs px-3 py-1.5 rounded-full font-medium capitalize ${
              session.difficulty === 'all' ? 'bg-slate-100 text-slate-600' :
              session.difficulty === 'basic' ? 'bg-green-100 text-green-700' :
              'bg-amber-100 text-amber-700'
            }`}>
              {session.difficulty === 'all' ? 'All difficulties' : session.difficulty}
            </span>
            <span className="text-xs px-3 py-1.5 rounded-full bg-slate-100 text-slate-600 font-medium capitalize">
              {session.mode}
            </span>
            <span className="text-xs px-3 py-1.5 rounded-full bg-slate-100 text-slate-600 font-medium">
              {total} questions
            </span>
          </div>

          {/* Review section — incorrect first, then correct */}
          {reviewOrder.length > 0 && (
            <div>
              <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-3">
                Review Answers
              </h2>
              <div className="space-y-4">
                {reviewOrder.map(q => {
                  const userAnswer = sessionState.answers[q.id]
                  const correctOpt = q.options?.find(o => o.is_correct)
                  const userOpt = userAnswer ? q.options?.find(o => o.option_letter === userAnswer.selected) : null
                  const book = q.source_book_id ? books[q.source_book_id] : null
                  const chapter = q.chapter_id ? chapters[q.chapter_id] : null
                  const chapterDisplay = chapter
                    ? `Chapter ${chapter.chapter_number} — ${chapter.chapter_name}`
                    : q.source_chapter ?? null
                  const isWrong = userAnswer && !userAnswer.isCorrect

                  return (
                    <div
                      key={q.id}
                      className={`bg-white rounded-xl border p-5 ${isWrong ? 'border-red-100' : 'border-slate-200'}`}
                    >
                      <p className="text-slate-800 font-medium text-sm mb-4">{q.question_text}</p>

                      {userOpt && isWrong && (
                        <div className="flex items-start gap-2 p-3 rounded-lg bg-red-50 border border-red-200 mb-2">
                          <IconX size={16} className="text-red-500 flex-shrink-0 mt-0.5" />
                          <div>
                            <span className="text-xs font-semibold text-red-600 block">Your answer</span>
                            <span className="text-sm text-red-700">{userAnswer.selected}. {userOpt.option_text}</span>
                          </div>
                        </div>
                      )}

                      {correctOpt && (
                        <div className="flex items-start gap-2 p-3 rounded-lg bg-green-50 border border-green-200 mb-3">
                          <IconCheck size={16} className="text-green-500 flex-shrink-0 mt-0.5" />
                          <div>
                            <span className="text-xs font-semibold text-green-600 block">
                              {isWrong ? 'Correct answer' : 'Your answer'}
                            </span>
                            <span className="text-sm text-green-700">{correctOpt.option_letter}. {correctOpt.option_text}</span>
                          </div>
                        </div>
                      )}

                      {q.explanation && (
                        <p className="text-sm text-slate-600 border-t border-slate-100 pt-3 leading-relaxed">
                          {q.explanation}
                        </p>
                      )}

                      {book && (
                        <div className="flex items-start gap-1.5 mt-3 pt-3 border-t border-slate-100">
                          {q.citation_verified ? (
                            <IconBook size={13} className="text-slate-400 flex-shrink-0 mt-0.5" />
                          ) : (
                            <IconBook2 size={13} className="text-slate-400 flex-shrink-0 mt-0.5" />
                          )}
                          <p className="text-xs text-slate-400 leading-relaxed">
                            <span className="font-medium">{book.title}</span>
                            {book.author && <span> — {book.author}</span>}
                            {book.edition && <span> · {book.edition}</span>}
                            {chapterDisplay && (
                              <span>
                                {' · '}
                                {q.citation_verified ? chapterDisplay : `${chapterDisplay} (approx.)`}
                              </span>
                            )}
                            {q.source_page && (
                              <span>
                                {' · '}
                                {q.citation_verified ? q.source_page : `${q.source_page} (approx.)`}
                              </span>
                            )}
                          </p>
                          <p className="text-xs text-slate-300 italic mt-1">
                            Source reference only. Question content is original and does not reproduce text from this publication.
                          </p>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* CTAs */}
          <div className="flex gap-3 pb-8">
            <Link
              href={backHref}
              className="flex-1 py-3 rounded-xl border-2 border-slate-200 text-center font-semibold text-slate-700 hover:border-slate-300 transition-all"
            >
              Try Again
            </Link>
            <Link
              href={`/${session.licence_type.toLowerCase()}`}
              className="flex-1 py-3 rounded-xl text-center font-semibold text-white transition-all"
              style={{ backgroundColor: '#185FA5' }}
            >
              All Subjects
            </Link>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  )
}
