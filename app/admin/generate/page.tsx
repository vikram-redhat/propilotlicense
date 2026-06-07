'use client'
import { useEffect, useState, useRef } from 'react'
import { supabase } from '@/lib/supabase'
import { Subject, Topic, SourceBook, GeneratedQuestion } from '@/lib/types'
import { IconSparkles, IconCheck, IconTrash, IconEdit, IconBook2 } from '@tabler/icons-react'

const BATCH_SIZE = 5

interface BatchStatus {
  index: number
  total: number
  status: 'waiting' | 'running' | 'done' | 'error'
  startTime?: number
  elapsedMs?: number
  errorMsg?: string
}

interface EditableQuestion extends GeneratedQuestion {
  editing?: boolean
}

function formatElapsed(ms: number) {
  const s = Math.floor(ms / 1000)
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`
}

export default function GeneratePage() {
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [topics, setTopics] = useState<Topic[]>([])
  const [books, setBooks] = useState<SourceBook[]>([])

  const [subjectId, setSubjectId] = useState('')
  const [subjectName, setSubjectName] = useState('')
  const [topicId, setTopicId] = useState('')
  const [topicName, setTopicName] = useState('')
  const [bookId, setBookId] = useState('')
  const [bookTitle, setBookTitle] = useState('')
  const [bookAuthor, setBookAuthor] = useState('')
  const [chapterId, setChapterId] = useState('')
  const [chapterName, setChapterName] = useState('')
  const [chapterNumber, setChapterNumber] = useState(0)
  const [chapters, setChapters] = useState<{ id: string; chapter_number: number; chapter_name: string }[]>([])
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium')
  const [count, setCount] = useState(10)
  const [context, setContext] = useState('')

  const [generating, setGenerating] = useState(false)
  const [checking, setChecking] = useState(false)
  const [checkState, setCheckState] = useState<'idle' | 'blocked' | 'advisory'>('idle')
  const [familiarity, setFamiliarity] = useState<'WELL' | 'PARTIALLY' | 'NOT WELL' | null>(null)
  const [batches, setBatches] = useState<BatchStatus[]>([])
  const [currentElapsed, setCurrentElapsed] = useState(0)
  const [generated, setGenerated] = useState<EditableQuestion[]>([])
  const [generatedCount, setGeneratedCount] = useState(0)
  const [requestedCount, setRequestedCount] = useState(0)
  const [error, setError] = useState('')
  const [saving, setSaving] = useState<Record<number, boolean>>({})
  const [saved, setSaved] = useState<Record<number, boolean>>({})

  const runningBatchStartRef = useRef<number | null>(null)

  useEffect(() => {
    supabase.from('subjects').select('*').order('sort_order').then(({ data }) => setSubjects(data || []))
  }, [])

  useEffect(() => {
    if (!subjectId) { setTopics([]); setBooks([]); setTopicId(''); setTopicName(''); setBookId(''); return }
    Promise.all([
      supabase.from('topics').select('*').eq('subject_id', subjectId).order('sort_order'),
      supabase.from('source_books').select('*').eq('subject_id', subjectId).order('sort_order'),
    ]).then(([{ data: tops }, { data: bks }]) => {
      setTopics(tops || [])
      setBooks(bks || [])
    })
    const sub = subjects.find(s => s.id === subjectId)
    setSubjectName(sub?.name || '')
  }, [subjectId, subjects])

  useEffect(() => {
    if (!bookId) { setChapters([]); setChapterId(''); setChapterName(''); setChapterNumber(0); return }
    supabase
      .from('chapters')
      .select('id, chapter_number, chapter_name')
      .eq('book_id', bookId)
      .order('sort_order')
      .then(({ data }) => setChapters(data || []))
  }, [bookId])

  // Live elapsed timer for the running batch
  useEffect(() => {
    const running = batches.find(b => b.status === 'running')
    if (!running?.startTime) { runningBatchStartRef.current = null; return }
    runningBatchStartRef.current = running.startTime
    const timer = setInterval(() => {
      if (runningBatchStartRef.current) {
        setCurrentElapsed(Date.now() - runningBatchStartRef.current)
      }
    }, 1000)
    return () => clearInterval(timer)
  }, [batches])

  async function generate() {
    if (!subjectId) { setError('Please select a subject'); return }
    setError('')
    setCheckState('idle')
    setFamiliarity(null)

    // If a book is selected, run the pre-flight check first
    if (bookId && bookTitle) {
      setChecking(true)
      try {
        const res = await fetch('/api/admin/check-book', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ bookTitle, bookAuthor, subject: subjectName }),
        })
        const data = await res.json()
        setChecking(false)

        if (!data.relevant) {
          setCheckState('blocked')
          return
        }

        if (data.familiarity === 'NOT WELL') {
          setFamiliarity('NOT WELL')
          setCheckState('advisory')
          return // wait for user to click "Continue anyway"
        }
      } catch {
        setChecking(false)
        // On network error, proceed anyway — don't block generation
      }
    }

    await startGeneration()
  }

  async function startGeneration() {
    setCheckState('idle')
    setGenerating(true)
    setGenerated([])
    setGeneratedCount(0)
    setRequestedCount(count)
    setSaved({})
    setSaving({})

    const numBatches = Math.ceil(count / BATCH_SIZE)
    const initialBatches: BatchStatus[] = Array.from({ length: numBatches }, (_, i) => ({
      index: i,
      total: i < numBatches - 1 ? BATCH_SIZE : count - i * BATCH_SIZE,
      status: 'waiting',
    }))
    setBatches(initialBatches)

    let totalGenerated = 0

    for (let i = 0; i < numBatches; i++) {
      const batchCount = initialBatches[i].total
      const startTime = Date.now()
      setCurrentElapsed(0)

      setBatches(prev => prev.map((b, idx) =>
        idx === i ? { ...b, status: 'running', startTime } : b
      ))

      let success = false
      let attempts = 0

      while (attempts < 2 && !success) {
        attempts++
        try {
          const TIMEOUT_MS = 50000
          const res = await Promise.race([
            fetch('/api/admin/generate', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                subject: subjectName,
                bookTitle,
                bookAuthor,
                focusLine: bookId
                  ? chapterId
                    ? `Chapter: ${chapterNumber} — ${chapterName} (from "${bookTitle}")`
                    : `Book: "${bookTitle}" — cover all chapters`
                  : topicId
                    ? `Topic: ${topicName} — draw from all books`
                    : `General — cover a range of topics across all books for this subject`,
                difficulty,
                count: batchCount,
                context,
              }),
            }),
            new Promise<never>((_, reject) =>
              setTimeout(() => reject(new Error('timeout')), TIMEOUT_MS)
            ),
          ])

          const data = await (res as Response).json()
          if (data.error) throw new Error(data.error)

          const questions: GeneratedQuestion[] = Array.isArray(data.questions) ? data.questions : []
          setGenerated(prev => [...prev, ...questions])
          totalGenerated += questions.length
          setGeneratedCount(totalGenerated)
          setBatches(prev => prev.map((b, idx) =>
            idx === i ? { ...b, status: 'done', elapsedMs: Date.now() - startTime } : b
          ))
          success = true
        } catch (err: unknown) {
          const msg = err instanceof Error ? err.message : String(err)
          const isTimeout = msg === 'timeout'

          if (attempts < 2) {
            setBatches(prev => prev.map((b, idx) =>
              idx === i ? {
                ...b,
                errorMsg: isTimeout
                  ? `Batch ${i + 1} timed out — retrying once…`
                  : `Network error on batch ${i + 1} — retrying…`,
              } : b
            ))
            await new Promise(r => setTimeout(r, 1500))
          } else {
            const errMsg = isTimeout
              ? `Batch ${i + 1} timed out after retry — skipped.`
              : msg.includes('parse') || msg.includes('JSON')
              ? `Batch ${i + 1} returned an unexpected format — skipped. Other batches will continue.`
              : `Batch ${i + 1} failed: ${msg.slice(0, 80)}`
            setBatches(prev => prev.map((b, idx) =>
              idx === i ? { ...b, status: 'error', elapsedMs: Date.now() - startTime, errorMsg: errMsg } : b
            ))
          }
        }
      }
    }

    setGenerating(false)
  }

  async function approve(index: number) {
    const q = generated[index]
    setSaving(prev => ({ ...prev, [index]: true }))

    const { data: newQ } = await supabase
      .from('questions')
      .insert({
        subject_id: subjectId,
        topic_id: bookId ? null : (topicId || null),
        source_book_id: bookId || null,
        question_text: q.question_text,
        difficulty,
        explanation: q.explanation,
        source_chapter: q.source_chapter || null,
        source_page: q.source_page || null,
        citation_verified: false,
        source_type: 'ai',
        active: true,
      })
      .select('id')
      .single()

    if (newQ) {
      const optRows = (['A', 'B', 'C', 'D'] as const).map(letter => ({
        question_id: newQ.id,
        option_letter: letter,
        option_text: q.options[letter],
        is_correct: letter === q.correct_option,
      }))
      await supabase.from('question_options').insert(optRows)
    }

    setSaving(prev => ({ ...prev, [index]: false }))
    setSaved(prev => ({ ...prev, [index]: true }))
  }

  function discard(index: number) {
    setGenerated(prev => prev.filter((_, i) => i !== index))
  }

  function toggleEdit(index: number) {
    setGenerated(prev => prev.map((q, i) => i === index ? { ...q, editing: !q.editing } : q))
  }

  function updateField(index: number, field: keyof GeneratedQuestion, value: unknown) {
    setGenerated(prev => prev.map((q, i) => i === index ? { ...q, [field]: value } : q))
  }

  function updateOption(index: number, letter: 'A' | 'B' | 'C' | 'D', value: string) {
    setGenerated(prev => prev.map((q, i) =>
      i === index ? { ...q, options: { ...q.options, [letter]: value } } : q
    ))
  }

  const doneBatches = batches.filter(b => b.status === 'done').length
  const errorBatches = batches.filter(b => b.status === 'error').length

  return (
    <div className="px-4 py-6">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-xl font-bold text-slate-800 mb-6">AI Question Generator</h1>

        <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-5 mb-6">
          {/* Subject */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Subject *</label>
            <select
              value={subjectId}
              onChange={e => { setSubjectId(e.target.value); setTopicId(''); setTopicName(''); setBookId(''); setChapterId(''); setChapterName('') }}
              className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm text-slate-800 bg-white"
            >
              <option value="">Select subject…</option>
              {subjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
          </div>

          {/* Source book */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Source Book (optional)</label>
            <select
              value={bookId}
              onChange={e => {
                setBookId(e.target.value)
                const b = books.find(b => b.id === e.target.value)
                setBookTitle(b?.title || '')
                setBookAuthor(b?.author || '')
                setChapterId('')
                setChapterName('')
                setChapterNumber(0)
              }}
              className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm text-slate-800 bg-white"
              disabled={!subjectId}
            >
              <option value="">No specific book</option>
              {books.map(b => (
                <option key={b.id} value={b.id}>
                  {b.title}{b.author ? ` — ${b.author}` : ''}
                </option>
              ))}
            </select>
          </div>

          {/* Chapter (when book selected) or Topic (when no book) */}
          {bookId ? (
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Chapter (optional)</label>
              <select
                value={chapterId}
                onChange={e => {
                  setChapterId(e.target.value)
                  const c = chapters.find(c => c.id === e.target.value)
                  setChapterName(c?.chapter_name || '')
                  setChapterNumber(c?.chapter_number || 0)
                }}
                className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm text-slate-800 bg-white"
              >
                <option value="">All chapters</option>
                {chapters.map(c => (
                  <option key={c.id} value={c.id}>Chapter {c.chapter_number} — {c.chapter_name}</option>
                ))}
              </select>
              <p className="text-xs text-slate-400 mt-1.5">
                {chapterId
                  ? `Questions will focus on Chapter ${chapterNumber} of ${bookTitle}`
                  : `Questions will draw from all chapters of ${bookTitle}`}
              </p>
            </div>
          ) : (
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Topic (optional)</label>
              <select
                value={topicId}
                onChange={e => {
                  setTopicId(e.target.value)
                  const t = topics.find(t => t.id === e.target.value)
                  setTopicName(t?.name || '')
                }}
                className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm text-slate-800 bg-white"
                disabled={!subjectId}
              >
                <option value="">All topics</option>
                {topics.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
              </select>
              <p className="text-xs text-slate-400 mt-1.5">
                {topicId
                  ? `Questions on this topic drawn from all books`
                  : `Questions drawn from all topics and all books for this subject`}
              </p>
            </div>
          )}

          {/* Difficulty */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Difficulty</label>
            <div className="flex gap-2">
              {(['easy', 'medium', 'hard'] as const).map(d => (
                <button
                  key={d}
                  onClick={() => setDifficulty(d)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium border-2 capitalize transition-all ${
                    difficulty === d ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-slate-200 text-slate-600'
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>

          {/* Count */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Generate Count</label>
            <div className="flex gap-2">
              {[5, 10, 20].map(n => (
                <button
                  key={n}
                  onClick={() => setCount(n)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium border-2 transition-all ${
                    count === n ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-slate-200 text-slate-600'
                  }`}
                >
                  {n}
                </button>
              ))}
            </div>
            {count > BATCH_SIZE && (
              <p className="text-xs text-slate-400 mt-1.5">
                Generated in {Math.ceil(count / BATCH_SIZE)} batches of {BATCH_SIZE}. This may take up to 30 seconds per batch.
              </p>
            )}
          </div>

          {/* Context */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Additional Context (optional)</label>
            <textarea
              value={context}
              onChange={e => setContext(e.target.value)}
              rows={2}
              className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm text-slate-800 resize-y"
              placeholder="Any specific focus areas, regulations, or guidance…"
            />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-700">{error}</div>
          )}

          {/* Blocked — non-aviation book */}
          {checkState === 'blocked' && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 space-y-2">
              <p className="text-sm font-semibold text-red-700">✗ &ldquo;{bookTitle}&rdquo;{bookAuthor ? ` by ${bookAuthor}` : ''} does not appear to be a recognised aviation training textbook for {subjectName}.</p>
              <p className="text-sm text-red-600">AI generation is only available for aviation training books.</p>
              <ul className="text-sm text-red-600 space-y-1 pl-3">
                <li>• Select a different book</li>
                <li>• Generate without a book — questions will use general aviation knowledge for this subject</li>
                <li>• Add questions manually via the question editor</li>
              </ul>
            </div>
          )}

          {/* Advisory — aviation book but limited Claude knowledge */}
          {checkState === 'advisory' && (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 space-y-3">
              <p className="text-sm font-semibold text-amber-800">⚠ Claude has limited knowledge of this specific book.</p>
              <p className="text-sm text-amber-700">Questions will be aviation-accurate but may not reflect this book&rsquo;s exact content, examples, or structure. Chapter and page references will be approximate. Review carefully before approving.</p>
              <p className="text-xs text-amber-600 italic">Coming soon: upload this book as a PDF to improve question accuracy.</p>
              <div className="flex gap-2 pt-1">
                <button
                  onClick={() => startGeneration()}
                  className="px-4 py-2 rounded-lg text-sm font-semibold text-white"
                  style={{ backgroundColor: '#185FA5' }}
                >
                  Continue anyway
                </button>
                <button
                  onClick={() => setCheckState('idle')}
                  className="px-4 py-2 rounded-lg text-sm font-medium text-slate-600 border border-slate-200 hover:border-slate-300"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {checkState !== 'advisory' && checkState !== 'blocked' && (
            <button
              onClick={generate}
              disabled={generating || checking || !subjectId}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-white text-sm disabled:opacity-50 transition-all"
              style={{ backgroundColor: '#185FA5' }}
            >
              <IconSparkles size={16} />
              {checking ? 'Checking book relevance…' : generating ? 'Generating…' : 'Generate Questions'}
            </button>
          )}
        </div>

        {/* Batch progress */}
        {batches.length > 0 && (
          <div className="bg-white rounded-xl border border-slate-200 p-5 mb-6">
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-semibold text-slate-700 text-sm">Generating questions…</h2>
              {!generating && (
                <span className="text-xs text-slate-500">
                  {generatedCount} of {requestedCount} generated
                  {errorBatches > 0 ? ` (${errorBatches} batch${errorBatches > 1 ? 'es' : ''} failed)` : ''}
                </span>
              )}
            </div>
            <div className="space-y-2">
              {batches.map(b => {
                const start = b.index * BATCH_SIZE + 1
                const end = start + b.total - 1
                return (
                  <div key={b.index} className="flex items-center gap-3 text-sm">
                    <span className="w-3 flex-shrink-0">
                      {b.status === 'done' ? '●' : b.status === 'running' ? '◌' : b.status === 'error' ? '✕' : '○'}
                    </span>
                    <span className={`flex-1 ${b.status === 'done' ? 'text-slate-700' : b.status === 'running' ? 'text-slate-800 font-medium' : b.status === 'error' ? 'text-red-600' : 'text-slate-400'}`}>
                      Batch {b.index + 1} of {batches.length} — Questions {start}–{end}
                    </span>
                    <span className="text-xs text-slate-400 flex-shrink-0">
                      {b.status === 'done' && b.elapsedMs !== undefined && `✓ Done (${formatElapsed(b.elapsedMs)})`}
                      {b.status === 'running' && `Generating… ${formatElapsed(currentElapsed)}`}
                      {b.status === 'error' && 'Failed'}
                      {b.status === 'waiting' && 'Waiting'}
                    </span>
                  </div>
                )
              })}
            </div>
            {batches.some(b => b.errorMsg) && (
              <div className="mt-3 space-y-1">
                {batches.filter(b => b.errorMsg).map(b => (
                  <p key={b.index} className="text-xs text-red-600">{b.errorMsg}</p>
                ))}
              </div>
            )}
            {!generating && doneBatches === batches.length && (
              <p className="text-xs text-green-600 mt-3 font-medium">
                ✓ All {batches.length} batches complete — {generatedCount} questions generated
              </p>
            )}
          </div>
        )}

        {/* Generated questions */}
        {generated.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold text-slate-700">{generated.length} questions generated</h2>
              <span className="text-xs text-slate-400">Click Approve to save to database</span>
            </div>
            {generated.map((q, index) => (
              <div
                key={index}
                className={`bg-white rounded-xl border p-5 transition-all ${
                  saved[index] ? 'border-green-300 opacity-75' : 'border-slate-200'
                }`}
              >
                {q.editing ? (
                  <div className="space-y-3">
                    <textarea
                      value={q.question_text}
                      onChange={e => updateField(index, 'question_text', e.target.value)}
                      rows={3}
                      className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm"
                    />
                    {(['A', 'B', 'C', 'D'] as const).map(letter => (
                      <div key={letter} className="flex items-center gap-2">
                        <input
                          type="radio"
                          checked={q.correct_option === letter}
                          onChange={() => updateField(index, 'correct_option', letter)}
                          className="accent-blue-600"
                        />
                        <span className="w-5 text-xs font-bold text-slate-500">{letter}</span>
                        <input
                          type="text"
                          value={q.options[letter]}
                          onChange={e => updateOption(index, letter, e.target.value)}
                          className="flex-1 border border-slate-200 rounded-lg px-3 py-1.5 text-sm"
                        />
                      </div>
                    ))}
                    <textarea
                      value={q.explanation}
                      onChange={e => updateField(index, 'explanation', e.target.value)}
                      rows={2}
                      className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm"
                      placeholder="Explanation…"
                    />
                    <button onClick={() => toggleEdit(index)} className="text-xs text-blue-600 hover:underline">
                      Done editing
                    </button>
                  </div>
                ) : (
                  <>
                    <p className="text-sm font-medium text-slate-800 mb-3">{q.question_text}</p>
                    <div className="space-y-1.5 mb-3">
                      {(['A', 'B', 'C', 'D'] as const).map(letter => (
                        <div
                          key={letter}
                          className={`flex items-start gap-2 p-2 rounded-lg text-sm ${
                            letter === q.correct_option ? 'bg-green-50 text-green-800 font-medium' : 'text-slate-600'
                          }`}
                        >
                          <span className="font-bold w-4 flex-shrink-0">{letter}.</span>
                          <span>{q.options[letter]}</span>
                        </div>
                      ))}
                    </div>
                    {q.explanation && (
                      <p className="text-xs text-slate-500 border-t border-slate-100 pt-2 mb-2">{q.explanation}</p>
                    )}
                    {bookTitle && (q.source_chapter || q.source_page) && (
                      <div className="flex items-start gap-1.5 pt-2 border-t border-slate-100">
                        <IconBook2 size={13} className="text-slate-400 flex-shrink-0 mt-0.5" />
                        <p className="text-xs text-slate-400">
                          <span className="font-medium">{bookTitle}</span>
                          {bookAuthor && <span> — {bookAuthor}</span>}
                          {q.source_chapter && <span> · {q.source_chapter} (approx.)</span>}
                          {q.source_page && <span> · {q.source_page} (approx.)</span>}
                        </p>
                      </div>
                    )}
                  </>
                )}

                <div className="flex items-center gap-2 mt-4 pt-3 border-t border-slate-100">
                  {saved[index] ? (
                    <span className="flex items-center gap-1 text-xs text-green-600 font-medium">
                      <IconCheck size={14} /> Saved to database
                    </span>
                  ) : (
                    <>
                      <button
                        onClick={() => approve(index)}
                        disabled={saving[index]}
                        className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-green-500 text-white text-xs font-medium hover:bg-green-600 disabled:opacity-50"
                      >
                        <IconCheck size={13} />
                        {saving[index] ? 'Saving…' : 'Approve'}
                      </button>
                      <button
                        onClick={() => toggleEdit(index)}
                        className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-200 text-slate-600 text-xs font-medium hover:border-slate-300"
                      >
                        <IconEdit size={13} />
                        Edit
                      </button>
                      <button
                        onClick={() => discard(index)}
                        className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-red-200 text-red-500 text-xs font-medium hover:border-red-300"
                      >
                        <IconTrash size={13} />
                        Discard
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
