'use client'
import { useEffect, useState, use } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { Subject, Topic, SourceBook } from '@/lib/types'
import SubjectIcon from '@/components/SubjectIcon'

type Scope = 'topic' | 'book' | 'book_topic' | 'combined'
type Mode = 'practice' | 'mock'
type Difficulty = 'all' | 'easy' | 'medium' | 'hard'
type QuestionCount = 50 | 100

function formatTimeAllowed(questionCount: QuestionCount): string {
  const totalSecs = questionCount * 45
  const mins = Math.floor(totalSecs / 60)
  const secs = totalSecs % 60
  if (secs === 0) return `${mins} minutes`
  return `${mins} minutes ${secs} seconds`
}

export default function SessionConfigPage({ params }: { params: Promise<{ licence: string; subjectId: string }> }) {
  const { licence, subjectId } = use(params)
  const router = useRouter()

  const [subject, setSubject] = useState<Subject | null>(null)
  const [topics, setTopics] = useState<Topic[]>([])
  const [books, setBooks] = useState<SourceBook[]>([])
  const [loading, setLoading] = useState(true)
  const [starting, setStarting] = useState(false)

  const [chapters, setChapters] = useState<{ id: string; chapter_number: number; chapter_name: string }[]>([])
  const [scope, setScope] = useState<Scope | null>(null)
  const [selectedTopicId, setSelectedTopicId] = useState('')
  const [selectedBookId, setSelectedBookId] = useState('')
  const [selectedChapterId, setSelectedChapterId] = useState('')
  const [mode, setMode] = useState<Mode>('practice')
  const [difficulty, setDifficulty] = useState<Difficulty>('all')
  const [questionCount, setQuestionCount] = useState<QuestionCount>(50)

  useEffect(() => {
    async function load() {
      const [{ data: sub }, { data: tops }, { data: bks }] = await Promise.all([
        supabase.from('subjects').select('*').eq('id', subjectId).single(),
        supabase.from('topics').select('*').eq('subject_id', subjectId).order('sort_order'),
        supabase.from('source_books').select('*').eq('subject_id', subjectId).order('sort_order'),
      ])
      setSubject(sub)
      setTopics(tops || [])
      setBooks(bks || [])
      if (tops && tops.length > 0) setSelectedTopicId(tops[0].id)
      setLoading(false)
    }
    load()
  }, [subjectId])

  useEffect(() => {
    if (!selectedBookId) { setChapters([]); setSelectedChapterId(''); return }
    supabase
      .from('chapters')
      .select('id, chapter_number, chapter_name')
      .eq('book_id', selectedBookId)
      .order('sort_order')
      .then(({ data }) => setChapters(data || []))
  }, [selectedBookId])

  const effectiveScope: Scope | null =
    scope === 'book' && selectedChapterId ? 'book_topic' : scope

  const canStart =
    scope === null ? false :
    scope === 'topic' ? !!selectedTopicId :
    scope === 'book' ? !!selectedBookId :
    true

  async function startSession() {
    setStarting(true)
    const res = await fetch('/api/session/start', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        subjectId,
        licenceType: licence.toUpperCase(),
        scope: effectiveScope,
        topicId: scope === 'topic' ? selectedTopicId : effectiveScope === 'book_topic' ? selectedChapterId : null,
        sourceBookId: scope === 'book' ? selectedBookId : null,
        mode,
        difficulty,
        questionCount,
      }),
    })
    const data = await res.json()
    if (data.sessionId) {
      router.push(`/session/${data.sessionId}`)
    } else {
      alert(data.error || 'Failed to start session')
      setStarting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full" />
      </div>
    )
  }

  if (!subject) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-slate-500">Subject not found.</p>
      </div>
    )
  }

  const licenceLabel = licence.toUpperCase()

  const SCOPE_OPTIONS: { value: 'topic' | 'book' | 'combined'; title: string; subtitle: string; hint?: string }[] = [
    {
      value: 'topic',
      title: 'By Topic',
      subtitle: 'Questions from all books on one topic',
      hint: 'e.g. "Thunderstorms · Icing · Fronts"',
    },
    {
      value: 'book',
      title: 'By Source Book',
      subtitle: 'Focus on one textbook — then optionally drill into a specific chapter',
      hint: 'e.g. IC Joshi · Oxford · Keith Williams · RK Bali',
    },
    {
      value: 'combined',
      title: 'Combined Paper',
      subtitle: 'All topics, all books',
      hint: `Full ${licenceLabel} exam`,
    },
  ]

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-white border-b border-slate-200 px-4 py-3">
        <div className="max-w-3xl mx-auto flex items-center gap-2 text-sm">
          <Link href="/" className="text-slate-400 hover:text-slate-600 transition-colors">Home</Link>
          <span className="text-slate-300">/</span>
          <Link href={`/${licence}`} className="text-slate-400 hover:text-slate-600 transition-colors">{licenceLabel}</Link>
          <span className="text-slate-300">/</span>
          <span className="text-slate-700 font-medium">{subject.name}</span>
        </div>
      </header>

      <main className="flex-1 px-4 py-8">
        <div className="max-w-3xl mx-auto">

          {/* Subject description */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 mb-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#EBF4FF' }}>
                <SubjectIcon name={subject.icon_name} size={24} className="text-[#185FA5]" />
              </div>
              <h1 className="text-2xl font-bold text-slate-900">{subject.name}</h1>
            </div>
            {subject.description && (
              <p className="text-slate-600 text-sm leading-relaxed">{subject.description}</p>
            )}
          </div>

          <div className="space-y-4">

            {/* Step 1 — Scope */}
            <div className="bg-white rounded-xl border border-slate-200 p-5">
              <h2 className="font-semibold text-slate-700 mb-1 text-sm uppercase tracking-wider">Step 1 — Scope</h2>
              <p className="text-xs text-slate-400 mb-4">Choose what to include in this session</p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {SCOPE_OPTIONS.map(opt => {
                  const selected = scope === opt.value
                  const hasDropdown = opt.value === 'topic' || opt.value === 'book'
                  return (
                    <div
                      key={opt.value}
                      onClick={() => setScope(opt.value)}
                      style={{
                        border: selected ? '2px solid #185FA5' : '0.5px solid var(--color-border-tertiary, #e2e8f0)',
                        background: selected ? '#E6F1FB' : 'transparent',
                        cursor: 'pointer',
                      }}
                      className="p-4 rounded-xl transition-all"
                    >
                      <div
                        className="font-semibold text-sm leading-tight mb-1"
                        style={{ color: selected ? '#185FA5' : '#1e293b' }}
                      >
                        {opt.title}
                      </div>
                      <div className="text-xs text-slate-500">{opt.subtitle}</div>
                      {opt.hint && (
                        <div className="text-xs text-slate-400 mt-1">{opt.hint}</div>
                      )}

                      {/* In-card dropdown expander */}
                      {hasDropdown && (
                        <div
                          onClick={e => e.stopPropagation()}
                          style={{
                            maxHeight: selected ? '300px' : '0px',
                            overflow: 'hidden',
                            transition: 'max-height 0.2s ease',
                          }}
                        >
                          <div style={{ borderTop: '0.5px solid var(--color-border-tertiary, #e2e8f0)', marginTop: 12, paddingTop: 12 }}>
                            {opt.value === 'topic' ? (
                              <>
                                <label className="block text-xs font-medium text-slate-600 mb-1.5">Select topic</label>
                                <select
                                  value={selectedTopicId}
                                  onChange={e => setSelectedTopicId(e.target.value)}
                                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-800 bg-white"
                                >
                                  <option value="">Select a topic…</option>
                                  {topics.map(t => (
                                    <option key={t.id} value={t.id}>{t.name}</option>
                                  ))}
                                </select>
                              </>
                            ) : (
                              <>
                                <label className="block text-xs font-medium text-slate-600 mb-1.5">Select source book</label>
                                <select
                                  value={selectedBookId}
                                  onChange={e => { setSelectedBookId(e.target.value); setSelectedChapterId('') }}
                                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-800 bg-white"
                                >
                                  <option value="">Select a book…</option>
                                  {books.map(b => (
                                    <option key={b.id} value={b.id}>
                                      {b.title}{b.author ? ` — ${b.author}` : ''}
                                    </option>
                                  ))}
                                </select>
                                {selectedBookId && (
                                  <div className="mt-2">
                                    <label className="block text-xs font-medium text-slate-600 mb-1.5">Chapter (optional)</label>
                                    <select
                                      value={selectedChapterId}
                                      onChange={e => setSelectedChapterId(e.target.value)}
                                      className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-800 bg-white"
                                    >
                                      <option value="">All chapters</option>
                                      {chapters.map(c => (
                                        <option key={c.id} value={c.id}>Ch. {c.chapter_number} — {c.chapter_name}</option>
                                      ))}
                                    </select>
                                  </div>
                                )}
                              </>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Steps 2–4 and Start — only shown once a scope is selected */}
            {scope !== null && <>

            {/* Step 2 — Mode */}
            <div className="bg-white rounded-xl border border-slate-200 p-5">
              <h2 className="font-semibold text-slate-700 mb-1 text-sm uppercase tracking-wider">Step 2 — Mode</h2>
              <p className="text-xs text-slate-400 mb-4">How feedback is delivered</p>
              <div className="grid grid-cols-2 gap-3">
                {([
                  { value: 'practice' as Mode, label: 'Practice', desc: 'Immediate feedback after each answer — untimed' },
                  { value: 'mock' as Mode, label: 'Mock Exam', desc: 'Timed countdown — feedback only at the end' },
                ]).map(m => (
                  <button
                    key={m.value}
                    onClick={() => setMode(m.value)}
                    className={`p-4 rounded-xl border-2 text-left transition-all ${
                      mode === m.value ? 'border-blue-500 bg-blue-50' : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="font-semibold text-slate-800 text-sm">{m.label}</div>
                    <div className="text-xs text-slate-500 mt-1">{m.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Step 3 — Difficulty */}
            <div className="bg-white rounded-xl border border-slate-200 p-5">
              <h2 className="font-semibold text-slate-700 mb-1 text-sm uppercase tracking-wider">Step 3 — Difficulty</h2>
              <p className="text-xs text-slate-400 mb-4">Question mix for this session</p>
              <div className="flex flex-wrap gap-2">
                {([
                  { value: 'all' as Difficulty, label: 'All' },
                  { value: 'easy' as Difficulty, label: 'Easy' },
                  { value: 'medium' as Difficulty, label: 'Medium' },
                  { value: 'hard' as Difficulty, label: 'Hard' },
                ]).map(d => (
                  <button
                    key={d.value}
                    onClick={() => setDifficulty(d.value)}
                    className={`px-5 py-2 rounded-lg text-sm font-medium border-2 transition-all ${
                      difficulty === d.value
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-slate-200 text-slate-600 hover:border-slate-300'
                    }`}
                  >
                    {d.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Step 4 — Number of questions */}
            <div className="bg-white rounded-xl border border-slate-200 p-5">
              <h2 className="font-semibold text-slate-700 mb-1 text-sm uppercase tracking-wider">Step 4 — Number of Questions</h2>
              <p className="text-xs text-slate-400 mb-4">45 seconds allowed per question</p>
              <div className="flex gap-3">
                {([50, 100] as QuestionCount[]).map(n => (
                  <button
                    key={n}
                    onClick={() => setQuestionCount(n)}
                    className={`px-6 py-2.5 rounded-lg text-sm font-medium border-2 transition-all ${
                      questionCount === n
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-slate-200 text-slate-600 hover:border-slate-300'
                    }`}
                  >
                    {n} questions
                  </button>
                ))}
              </div>
              <p className="text-xs text-slate-500 mt-3">
                Time allowed: <span className="font-medium text-slate-700">{formatTimeAllowed(questionCount)}</span>
                <span className="text-slate-400"> (45 sec per question)</span>
              </p>
            </div>

            {/* Start */}
            <button
              onClick={startSession}
              disabled={starting || !canStart}
              className="w-full py-4 rounded-xl font-bold text-white text-base transition-all disabled:opacity-50"
              style={{ backgroundColor: '#185FA5' }}
            >
              {starting ? 'Starting…' : `Start ${mode === 'practice' ? 'Practice' : 'Mock Exam'} →`}
            </button>

            </>}

          </div>
        </div>
      </main>
    </div>
  )
}
