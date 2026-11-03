'use client'
import { useCallback, useEffect, useState } from 'react'
import QuestionForm from '@/components/QuestionForm'
import { Question } from '@/lib/types'
import { IconCheck, IconEdit, IconPlayerSkipForward, IconTrash, IconFlag, IconBook, IconRefresh } from '@tabler/icons-react'

type Flag = { reason: string | null; resolved: boolean; created_at: string }
type ReviewQuestion = Question & {
  options: { option_letter: 'A' | 'B' | 'C' | 'D'; option_text: string; is_correct: boolean }[]
  subject: { name: string; code: string } | null
  topic: { name: string } | null
  source_book: { title: string; author: string | null } | null
  chapter: { chapter_number: number; chapter_name: string } | null
  flags: Flag[]
  answer_stats: { answered: number; correct: number; picks: Record<string, number> }
  last_reviewed_by_name: string | null
}
type Outcome = 'reviewed' | 'edited' | 'deactivated' | 'skipped'
type SyllabusChapter = { id: string; chapter_number: number; chapter_name: string; book_id: string; subject_id: string | null }

const SELECT_CLS = 'text-sm border border-slate-200 rounded-lg px-3 py-2 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-200 disabled:opacity-40 disabled:cursor-not-allowed'

const OUTCOME_LABEL: Record<Outcome, { text: string; cls: string }> = {
  reviewed:    { text: 'Reviewed ✓',           cls: 'bg-green-100 text-green-700' },
  edited:      { text: 'Edited & reviewed ✓',  cls: 'bg-blue-100 text-blue-700' },
  deactivated: { text: 'Deactivated',          cls: 'bg-red-100 text-red-700' },
  skipped:     { text: 'Skipped',              cls: 'bg-slate-100 text-slate-500' },
}

function fmtDate(iso: string | null | undefined) {
  return iso ? new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : ''
}

export default function ReviewPage() {
  const [subjects, setSubjects] = useState<{ id: string; name: string }[]>([])
  const [books, setBooks]       = useState<{ id: string; title: string; author: string | null }[]>([])
  const [chapters, setChapters] = useState<{ id: string; chapter_number: number; chapter_name: string }[]>([])
  const [subject, setSubject]   = useState('')
  const [book, setBook]         = useState('')
  const [chapter, setChapter]   = useState('')
  const [status, setStatus]     = useState('published')
  const [syllabusChapters, setSyllabusChapters] = useState<SyllabusChapter[]>([])
  const [syllabus, setSyllabus] = useState('')
  const [syllabusConfidence, setSyllabusConfidence] = useState('')

  const [batch, setBatch]       = useState<ReviewQuestion[]>([])
  const [progress, setProgress] = useState({ total: 0, neverReviewed: 0 })
  const [outcomes, setOutcomes] = useState<Record<string, Outcome>>({})
  const [skipped, setSkipped]   = useState<string[]>([]) // kept out of later batches this sitting
  const [editingId, setEditingId] = useState<string | null>(null)
  const [loading, setLoading]   = useState(true)
  const [notice, setNotice]     = useState<string | null>(null)

  const load = useCallback(async (exclude: string[]) => {
    setLoading(true)
    setNotice(null)
    const params = new URLSearchParams({ subject, book, chapter, status, syllabus, syllabusConfidence, exclude: exclude.join(',') })
    const res = await fetch(`/api/admin/review?${params}`)
    const data = await res.json()
    if (!res.ok) {
      setNotice(data.message || data.error || 'Could not load the review batch.')
      setBatch([])
    } else {
      setBatch(data.questions)
      setProgress(data.progress)
      setSubjects(prev => data.subjects?.length ? data.subjects : prev)
      setBooks(data.books)
      setChapters(data.chapters)
      setSyllabusChapters(data.syllabusChapters ?? [])
    }
    setOutcomes({})
    setEditingId(null)
    setLoading(false)
    window.scrollTo({ top: 0 })
  }, [subject, book, chapter, status, syllabus, syllabusConfidence])

  // New filters start a fresh sitting (forget skips).
  useEffect(() => { setSkipped([]); load([]) }, [load])

  // "Looks good" also confirms the syllabus chapter (source 'reviewed'). If he already
  // changed it on the card it's 'reviewed' already, so confirming again changes nothing.
  async function markReviewed(id: string, outcome: Outcome, confirmSyllabus = false) {
    const res = await fetch(`/api/admin/review/${id}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ confirmSyllabus }),
    })
    if (!res.ok) { alert('Could not mark as reviewed — please try again.'); return }
    setOutcomes(prev => ({ ...prev, [id]: outcome }))
    setProgress(prev => batch.find(q => q.id === id && !q.last_reviewed_at)
      ? { ...prev, neverReviewed: Math.max(0, prev.neverReviewed - 1) }
      : prev)
  }

  async function deactivate(id: string) {
    if (!confirm('Deactivate this question? Students will stop seeing it.')) return
    const res = await fetch(`/api/admin/questions/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ active: false }),
    })
    if (!res.ok) { alert('Could not deactivate — please try again.'); return }
    await markReviewed(id, 'deactivated')
  }

  // Keep the batch copy current after a card saves something, so a later Edit opens the
  // form on the saved values instead of stale ones.
  function patchQuestion(id: string, fields: Partial<ReviewQuestion>) {
    setBatch(prev => prev.map(q => q.id === id ? { ...q, ...fields } : q))
  }

  function skip(id: string) {
    setSkipped(prev => [...prev, id])
    setOutcomes(prev => ({ ...prev, [id]: 'skipped' }))
  }

  const done = batch.filter(q => outcomes[q.id]).length
  const filterSyllabus = subject ? syllabusChapters.filter(c => c.subject_id === subject) : syllabusChapters
  const reviewedPct = progress.total ? Math.round(100 * (progress.total - progress.neverReviewed) / progress.total) : 0

  return (
    <div className="px-4 py-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-start justify-between gap-4 mb-5 flex-wrap">
          <div>
            <h1 className="text-xl font-bold text-slate-800">Review Questions</h1>
            <p className="text-sm text-slate-500 mt-0.5">
              Batches of 20 — never-reviewed questions first (the ones students get wrong most at the top), then the ones reviewed longest ago.
            </p>
          </div>
          {!notice && (
            <div className="bg-white rounded-xl border border-slate-200 px-4 py-3 text-right">
              <div className="text-lg font-bold text-slate-800">{reviewedPct}% reviewed</div>
              <div className="text-xs text-slate-500">
                {progress.neverReviewed.toLocaleString()} of {progress.total.toLocaleString()} matching questions never reviewed
              </div>
            </div>
          )}
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-2 mb-5">
          <select value={subject} onChange={e => { setSubject(e.target.value); setBook(''); setChapter(''); setSyllabus('') }} className={SELECT_CLS}>
            <option value="">All Subjects</option>
            {subjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
          </select>
          <select value={book} onChange={e => { setBook(e.target.value); setChapter('') }} className={SELECT_CLS}>
            <option value="">All Books</option>
            {books.map(b => <option key={b.id} value={b.id}>{b.title}{b.author ? ` — ${b.author}` : ''}</option>)}
          </select>
          <select value={chapter} onChange={e => setChapter(e.target.value)} className={SELECT_CLS} disabled={!book}>
            <option value="">All Chapters</option>
            {chapters.map(c => <option key={c.id} value={c.id}>Ch.{c.chapter_number} — {c.chapter_name}</option>)}
          </select>
          <select value={status} onChange={e => setStatus(e.target.value)} className={SELECT_CLS}>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
            <option value="flagged">Flagged</option>
            <option value="all">All Status</option>
          </select>
          <select value={syllabus} onChange={e => setSyllabus(e.target.value)} className={SELECT_CLS} disabled={!filterSyllabus.length}>
            <option value="">All Syllabus Chapters</option>
            {filterSyllabus.map(c => <option key={c.id} value={c.id}>{c.chapter_number} {c.chapter_name}</option>)}
          </select>
          <select value={syllabusConfidence} onChange={e => setSyllabusConfidence(e.target.value)} className={SELECT_CLS}>
            <option value="">Any Syllabus Confidence</option>
            <option value="high">High confidence</option>
            <option value="medium">Medium confidence</option>
            <option value="low">Low confidence</option>
          </select>
        </div>

        {notice && (
          <div className="bg-amber-50 border border-amber-200 text-amber-800 rounded-xl px-4 py-3 text-sm mb-5">{notice}</div>
        )}

        {loading ? (
          <div className="text-center text-slate-400 py-16 text-sm">Loading batch…</div>
        ) : !notice && batch.length === 0 ? (
          <div className="text-center text-slate-500 py-16 text-sm">No questions match these filters.</div>
        ) : (
          <div className="space-y-4">
            {batch.map((q, i) => (
              <ReviewCard
                key={q.id}
                q={q}
                index={i + 1}
                outcome={outcomes[q.id]}
                editing={editingId === q.id}
                syllabusChapters={syllabusChapters.filter(c => c.subject_id === q.subject_id)}
                onReviewed={() => markReviewed(q.id, 'reviewed', true)}
                onPatch={fields => patchQuestion(q.id, fields)}
                onEdit={() => setEditingId(q.id)}
                onEditCancel={() => setEditingId(null)}
                onEdited={async () => { setEditingId(null); await markReviewed(q.id, 'edited') }}
                onDeactivate={() => deactivate(q.id)}
                onSkip={() => skip(q.id)}
              />
            ))}
          </div>
        )}

        {/* Batch footer */}
        {!loading && batch.length > 0 && (
          <div className="sticky bottom-0 mt-6 -mx-4 px-4 py-3 bg-slate-50/95 backdrop-blur border-t border-slate-200 flex items-center justify-between gap-3">
            <span className="text-sm text-slate-600">
              <strong className="text-slate-800">{done}</strong> of {batch.length} done in this batch
            </span>
            <button
              onClick={() => load(skipped)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold text-white"
              style={{ backgroundColor: done === batch.length ? 'var(--clr-primary)' : '#64748b' }}
            >
              <IconRefresh size={15} />
              Next batch
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

function ReviewCard({ q, index, outcome, editing, syllabusChapters, onReviewed, onPatch, onEdit, onEditCancel, onEdited, onDeactivate, onSkip }: {
  q: ReviewQuestion
  index: number
  outcome?: Outcome
  editing: boolean
  syllabusChapters: SyllabusChapter[]
  onReviewed: () => void
  onPatch: (fields: Partial<ReviewQuestion>) => void
  onEdit: () => void
  onEditCancel: () => void
  onEdited: () => void
  onDeactivate: () => void
  onSkip: () => void
}) {
  const [syllabusDraft, setSyllabusDraft] = useState(q.syllabus_chapter_id ?? '')
  const [savingSyllabus, setSavingSyllabus] = useState(false)
  const [savingCitation, setSavingCitation] = useState(false)
  const currentSyllabus = syllabusChapters.find(c => c.id === q.syllabus_chapter_id)

  async function saveSyllabus() {
    setSavingSyllabus(true)
    const res = await fetch(`/api/admin/review/${q.id}/syllabus`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chapterId: syllabusDraft }),
    })
    const data = await res.json().catch(() => ({}))
    setSavingSyllabus(false)
    if (!res.ok) { alert(data.error || 'Could not change the syllabus chapter — please try again.'); return }
    const picked = syllabusChapters.find(c => c.id === syllabusDraft)
    onPatch({
      ...data.fields,
      // IC Joshi questions: the citation chapter moved too.
      ...(data.fields.chapter_id && picked ? { chapter: { chapter_number: picked.chapter_number, chapter_name: picked.chapter_name } } : {}),
    })
  }

  async function toggleCitation(verified: boolean) {
    setSavingCitation(true)
    const res = await fetch(`/api/admin/questions/${q.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ citation_verified: verified }),
    })
    setSavingCitation(false)
    if (!res.ok) { alert('Could not update the citation — please try again.'); return }
    onPatch({ citation_verified: verified })
  }

  const openFlags = q.flags.filter(f => !f.resolved)
  const { answered, correct, picks } = q.answer_stats
  const pickTotal = Object.values(picks).reduce((a, b) => a + b, 0)

  if (outcome) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 px-4 py-3 flex items-center gap-3 opacity-70">
        <span className="text-xs font-semibold text-slate-400 w-6">#{index}</span>
        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${OUTCOME_LABEL[outcome].cls}`}>{OUTCOME_LABEL[outcome].text}</span>
        <span className="text-sm text-slate-600 truncate">{q.question_text}</span>
      </div>
    )
  }

  return (
    <div className={`bg-white rounded-xl border p-5 ${openFlags.length ? 'border-amber-300' : 'border-slate-200'}`}>
      {/* Badges */}
      <div className="flex flex-wrap items-center gap-1.5 mb-3 text-xs">
        <span className="font-semibold text-slate-400 mr-1">#{index}</span>
        <span className={`px-2 py-0.5 rounded-full font-medium ${q.flagged ? 'bg-amber-100 text-amber-700' : q.active ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-600'}`}>
          {q.flagged ? 'Flagged' : q.active ? 'Published' : 'Draft'}
        </span>
        <span className={`px-2 py-0.5 rounded-full font-medium capitalize ${q.difficulty === 'advanced' ? 'bg-amber-50 text-amber-700' : 'bg-green-50 text-green-700'}`}>{q.difficulty}</span>
        <span className={`px-2 py-0.5 rounded-full font-medium ${q.source_type === 'ai' ? 'bg-purple-100 text-purple-700' : 'bg-slate-100 text-slate-600'}`}>
          {q.source_type === 'ai' ? 'AI generated' : 'Manual'}
        </span>
        {q.subject && <span className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 font-medium">{q.subject.name}</span>}
        <span className="ml-auto text-slate-400">
          {q.last_reviewed_at
            ? <>Last reviewed {fmtDate(q.last_reviewed_at)}{q.last_reviewed_by_name ? ` by ${q.last_reviewed_by_name}` : ''}</>
            : <span className="text-amber-600 font-medium">Never reviewed</span>}
        </span>
      </div>

      {editing ? (
        <div className="border-t border-slate-100 pt-4">
          <QuestionForm embedded question={q} onSaved={onEdited} onCancel={onEditCancel} />
        </div>
      ) : (
        <>
          <p className="text-[15px] font-medium text-slate-800 leading-relaxed whitespace-pre-wrap mb-3">{q.question_text}</p>

          {/* Options */}
          <div className="space-y-1.5 mb-4">
            {q.options.map(o => {
              const n = picks[o.option_letter] ?? 0
              return (
                <div
                  key={o.option_letter}
                  className={`flex items-start gap-2 rounded-lg px-3 py-2 text-sm border ${o.is_correct ? 'bg-green-50 border-green-200 text-green-900' : 'bg-white border-slate-200 text-slate-700'}`}
                >
                  <span className={`font-bold w-4 flex-shrink-0 ${o.is_correct ? 'text-green-700' : 'text-slate-400'}`}>{o.option_letter}</span>
                  <span className="flex-1 whitespace-pre-wrap">{o.option_text}</span>
                  {o.is_correct && <IconCheck size={16} className="text-green-600 flex-shrink-0 mt-0.5" />}
                  {pickTotal > 0 && (
                    <span className="text-xs text-slate-400 flex-shrink-0 w-16 text-right">{n} pick{n !== 1 ? 's' : ''}</span>
                  )}
                </div>
              )
            })}
          </div>

          {/* Explanation */}
          <div className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-2.5 mb-3">
            <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-1">Explanation</div>
            {q.explanation
              ? <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">{q.explanation}</p>
              : <p className="text-sm text-amber-700">No explanation.</p>}
          </div>

          {/* Source + performance */}
          <div className="flex flex-wrap gap-x-5 gap-y-1.5 text-xs text-slate-500 mb-3">
            <span className="flex items-center gap-1">
              <IconBook size={12} />
              {q.source_book
                ? <>
                    {q.source_book.title}{q.source_book.author ? ` — ${q.source_book.author}` : ''}
                    {q.chapter && ` · Ch.${q.chapter.chapter_number} — ${q.chapter.chapter_name}`}
                    {!q.chapter && q.source_chapter && ` · ${q.source_chapter}`}
                    {q.source_page && ` · ${q.source_page}`}
                    <span className={q.citation_verified ? 'text-teal-600 font-medium' : 'text-orange-500 font-medium'}>
                      {q.citation_verified ? ' · citation verified' : ' · citation approximate'}
                    </span>
                    <label className="ml-2 inline-flex items-center gap-1 text-slate-600 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={q.citation_verified}
                        disabled={savingCitation}
                        onChange={e => toggleCitation(e.target.checked)}
                        className="accent-teal-600"
                      />
                      Citation correct
                    </label>
                  </>
                : q.topic ? `Common pool · ${q.topic.name}` : 'Common pool · no topic'}
            </span>
            <span>
              {answered
                ? <>Answered {answered}× · <strong className={correct / answered < 0.5 ? 'text-red-600' : 'text-slate-700'}>{Math.round(100 * correct / answered)}% correct</strong></>
                : 'Not yet answered by students'}
            </span>
            <span>Created {fmtDate(q.created_at)}</span>
          </div>

          {/* Syllabus chapter — the topic tested, separate from the source citation above */}
          {syllabusChapters.length > 0 && (
            <div className="flex flex-wrap items-center gap-2 text-xs text-slate-600 mb-3">
              <span>
                Syllabus chapter:{' '}
                <strong className="text-slate-800">
                  {currentSyllabus ? `${currentSyllabus.chapter_number} ${currentSyllabus.chapter_name}` : 'not set'}
                </strong>
                {q.syllabus_chapter_source && (
                  <span className={q.syllabus_chapter_confidence === 'high' ? 'text-slate-500' : 'text-orange-500 font-medium'}>
                    {' '}({q.syllabus_chapter_source}, {q.syllabus_chapter_confidence})
                  </span>
                )}
              </span>
              <select
                value={syllabusDraft}
                onChange={e => setSyllabusDraft(e.target.value)}
                className="text-xs border border-slate-200 rounded-md px-2 py-1 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-200"
              >
                {!q.syllabus_chapter_id && <option value="">Choose…</option>}
                {syllabusChapters.map(c => <option key={c.id} value={c.id}>{c.chapter_number} {c.chapter_name}</option>)}
              </select>
              {syllabusDraft && syllabusDraft !== (q.syllabus_chapter_id ?? '') && (
                <button
                  onClick={saveSyllabus}
                  disabled={savingSyllabus}
                  className="px-2.5 py-1 rounded-md text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
                >
                  {savingSyllabus ? 'Saving…' : 'Save chapter'}
                </button>
              )}
            </div>
          )}

          {/* Flags */}
          {q.flags.length > 0 && (
            <div className={`rounded-lg px-3 py-2.5 mb-3 text-sm ${openFlags.length ? 'bg-amber-50 border border-amber-200' : 'bg-slate-50 border border-slate-200'}`}>
              <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-700 mb-1">
                <IconFlag size={13} />
                {openFlags.length} open flag{openFlags.length !== 1 ? 's' : ''}
                {q.flags.length > openFlags.length && <span className="text-slate-400 font-normal">· {q.flags.length - openFlags.length} resolved</span>}
              </div>
              {openFlags.map((f, i) => (
                <div key={i} className="text-slate-700">
                  <span className="text-xs text-slate-400 mr-2">{fmtDate(f.created_at)}</span>
                  {f.reason || <span className="italic text-slate-400">No reason given</span>}
                </div>
              ))}
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <button
              onClick={onReviewed}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-semibold text-white bg-green-600 hover:bg-green-700 transition-colors"
            >
              <IconCheck size={15} /> Looks good — mark reviewed
            </button>
            <button
              onClick={onEdit}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-medium text-slate-700 border border-slate-200 hover:border-slate-300 bg-white"
            >
              <IconEdit size={15} /> Edit
            </button>
            {q.active && (
              <button
                onClick={onDeactivate}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-medium text-red-600 border border-red-200 hover:bg-red-50 bg-white"
              >
                <IconTrash size={15} /> Deactivate
              </button>
            )}
            <button
              onClick={onSkip}
              className="ml-auto flex items-center gap-1 px-3 py-2 rounded-lg text-sm text-slate-500 hover:text-slate-700"
            >
              <IconPlayerSkipForward size={15} /> Skip
            </button>
          </div>
        </>
      )}
    </div>
  )
}
