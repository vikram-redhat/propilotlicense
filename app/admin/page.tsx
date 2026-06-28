'use client'
import { useEffect, useState, useCallback } from 'react'
import Link from 'next/link'
import { Question, Subject, Chapter } from '@/lib/types'
import { IconPlus, IconSparkles, IconEdit, IconTrash, IconCheck, IconBook } from '@tabler/icons-react'

const DIFFICULTY_COLORS: Record<string, string> = {
  basic: 'bg-green-100 text-green-700',
  advanced: 'bg-amber-100 text-amber-700',
}

const PAGE_SIZE = 20

type BookOption    = { id: string; title: string; author: string | null }
type TopicOption   = { id: string; name: string }

const SELECT_CLS = 'text-sm border border-slate-200 rounded-lg px-3 py-2 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-200 disabled:opacity-40 disabled:cursor-not-allowed'

export default function AdminPage() {
  const [questions, setQuestions]       = useState<Question[]>([])
  const [subjects, setSubjects]         = useState<Subject[]>([])
  const [books, setBooks]               = useState<BookOption[]>([])
  const [chapters, setChapters]         = useState<Chapter[]>([])
  const [topics, setTopics]             = useState<TopicOption[]>([])
  const [filterSubject, setFilterSubject]     = useState('')
  const [filterBook, setFilterBook]           = useState('')
  const [filterDifficulty, setFilterDifficulty] = useState('')
  const [filterChapter, setFilterChapter]     = useState('')
  const [filterTopic, setFilterTopic]         = useState('')
  const [filterStatus, setFilterStatus]       = useState('all')
  const [filterSource, setFilterSource]       = useState('all')
  const [filterCitation, setFilterCitation]   = useState('all')
  const [sort, setSort]                 = useState('newest')
  const [loading, setLoading]           = useState(true)
  const [page, setPage]                 = useState(0)
  const [total, setTotal]               = useState(0)
  const [approveDropdown, setApproveDropdown] = useState<string | null>(null)
  const [stats, setStats]               = useState({ total: 0, pending: 0, published: 0, ai: 0, citVerified: 0, citTotal: 0 })

  const load = useCallback(async () => {
    setLoading(true)
    const params = new URLSearchParams({
      subject: filterSubject, book: filterBook, chapter: filterChapter,
      topic: filterTopic, difficulty: filterDifficulty,
      status: filterStatus, source: filterSource, citation: filterCitation,
      sort, page: String(page),
    })
    const res  = await fetch(`/api/admin/questions?${params}`)
    const data = await res.json()
    setQuestions(data.questions || [])
    setTotal(data.total || 0)
    setStats(data.stats || stats)
    setSubjects(prev => data.subjects?.length ? data.subjects : prev)
    setBooks(data.books || [])
    setTopics(data.topics || [])
    setChapters(data.chapters || [])
    setLoading(false)
  }, [filterSubject, filterBook, filterChapter, filterTopic, filterDifficulty, filterStatus, filterSource, filterCitation, sort, page]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => { load() }, [load])

  function handleSubjectChange(v: string) {
    setFilterSubject(v); setFilterBook(''); setFilterChapter(''); setFilterTopic(''); setPage(0)
  }
  function handleBookChange(v: string) {
    setFilterBook(v); setFilterChapter(''); setPage(0)
  }
  function clearFilters() {
    setFilterSubject(''); setFilterBook(''); setFilterDifficulty(''); setFilterChapter('')
    setFilterTopic(''); setFilterStatus('all'); setFilterSource('all'); setFilterCitation('all')
    setSort('newest'); setPage(0)
  }

  async function approve(id: string, citationVerified = false) {
    await fetch(`/api/admin/questions/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ active: true, citation_verified: citationVerified }),
    })
    setApproveDropdown(null)
    load()
  }

  async function softDelete(id: string) {
    if (!confirm('Deactivate this question?')) return
    await fetch(`/api/admin/questions/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ active: false }),
    })
    load()
  }

  // Active filter labels for summary strip
  const activeFilters = [
    filterSubject    && subjects.find(s => s.id === filterSubject)?.name,
    filterBook       && books.find(b => b.id === filterBook)?.title,
    filterDifficulty && (filterDifficulty === 'basic' ? 'Basic' : 'Advanced'),
    filterChapter    && chapters.find(c => c.id === filterChapter) && `Ch.${chapters.find(c => c.id === filterChapter)!.chapter_number}`,
    filterTopic      && topics.find(t => t.id === filterTopic)?.name,
    filterStatus !== 'all' && filterStatus.charAt(0).toUpperCase() + filterStatus.slice(1),
    filterSource !== 'all' && (filterSource === 'ai' ? 'AI Generated' : 'Manual'),
    filterCitation !== 'all' && (filterCitation === 'verified' ? 'Verified Citations' : 'Approx. Citations'),
  ].filter(Boolean) as string[]

  const hasFilters = activeFilters.length > 0

  return (
    <div className="px-4 py-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-xl font-bold text-slate-800">Question Bank</h1>
          <div className="flex gap-2">
            <Link
              href="/admin/generate"
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-slate-200 bg-white text-sm font-medium text-slate-700 hover:border-slate-300 transition-all"
            >
              <IconSparkles size={15} />
              AI Generate
            </Link>
            <Link
              href="/admin/questions/new"
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium text-white transition-all"
              style={{ backgroundColor: 'var(--clr-primary)' }}
            >
              <IconPlus size={15} />
              New Question
            </Link>
          </div>
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-6">
          {[
            { label: 'Total', value: stats.total, color: 'text-slate-800' },
            { label: 'Pending', value: stats.pending, color: 'text-amber-600' },
            { label: 'Published', value: stats.published, color: 'text-green-600' },
            { label: 'AI Generated', value: stats.ai, color: 'text-purple-600' },
            { label: 'Citations Verified', value: `${stats.citVerified} / ${stats.citTotal}`, color: 'text-blue-600' },
          ].map(s => (
            <div key={s.label} className="bg-white rounded-xl border border-slate-200 p-4">
              <div className={`text-2xl font-bold ${s.color}`}>{s.value}</div>
              <div className="text-xs text-slate-500 mt-0.5">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Filter bar — row 1 */}
        <div className="flex flex-wrap gap-2 mb-2">
          <select value={filterSubject} onChange={e => handleSubjectChange(e.target.value)} className={SELECT_CLS}>
            <option value="">All Subjects</option>
            {subjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
          </select>
          <select value={filterBook} onChange={e => handleBookChange(e.target.value)} className={SELECT_CLS}>
            <option value="">All Books</option>
            {books.map(b => <option key={b.id} value={b.id}>{b.title}{b.author ? ` — ${b.author}` : ''}</option>)}
          </select>
          <select value={filterDifficulty} onChange={e => { setFilterDifficulty(e.target.value); setPage(0) }} className={SELECT_CLS}>
            <option value="">All Difficulties</option>
            <option value="basic">Basic</option>
            <option value="advanced">Advanced</option>
          </select>
          <select value={filterStatus} onChange={e => { setFilterStatus(e.target.value); setPage(0) }} className={SELECT_CLS}>
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="published">Published</option>
            <option value="flagged">Flagged</option>
          </select>
          <select value={filterSource} onChange={e => { setFilterSource(e.target.value); setPage(0) }} className={SELECT_CLS}>
            <option value="all">All Sources</option>
            <option value="manual">Manual</option>
            <option value="ai">AI Generated</option>
          </select>
          <select value={filterCitation} onChange={e => { setFilterCitation(e.target.value); setPage(0) }} className={SELECT_CLS}>
            <option value="all">All Citations</option>
            <option value="verified">Verified</option>
            <option value="approx">Approximate</option>
          </select>
          {hasFilters && (
            <button onClick={clearFilters} className="text-xs text-slate-400 hover:text-slate-600 px-2 transition-colors underline">
              Clear all
            </button>
          )}
        </div>

        {/* Filter bar — row 2 */}
        <div className="flex flex-wrap gap-2 mb-4 items-center justify-between">
          <div className="flex flex-wrap gap-2">
            <select
              value={filterChapter}
              onChange={e => { setFilterChapter(e.target.value); setPage(0) }}
              disabled={!filterBook}
              className={SELECT_CLS}
            >
              <option value="">{filterBook ? 'All Chapters' : 'Select a book first'}</option>
              {chapters.map(c => (
                <option key={c.id} value={c.id}>Ch.{c.chapter_number} — {c.chapter_name}</option>
              ))}
            </select>
            <select value={filterTopic} onChange={e => { setFilterTopic(e.target.value); setPage(0) }} className={SELECT_CLS}>
              <option value="">All Topics</option>
              {topics.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
            </select>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 whitespace-nowrap">Sort:</span>
            <select value={sort} onChange={e => { setSort(e.target.value); setPage(0) }} className={SELECT_CLS}>
              <option value="newest">Newest first</option>
              <option value="oldest">Oldest first</option>
              <option value="basic-first">Basic → Advanced</option>
              <option value="advanced-first">Advanced → Basic</option>
              <option value="alpha">Alphabetical (A–Z)</option>
            </select>
          </div>
        </div>

        {/* Active filter summary */}
        {hasFilters && (
          <div className="flex items-center gap-2 mb-3 px-3 py-2 bg-blue-50 border border-blue-100 rounded-xl text-sm">
            <span className="text-slate-600 font-medium">
              {loading ? '…' : total} {total === 1 ? 'question' : 'questions'}
            </span>
            <span className="text-slate-300">·</span>
            <span className="text-slate-500">{activeFilters.join(' · ')}</span>
            <button
              onClick={clearFilters}
              className="ml-auto text-xs text-blue-500 hover:text-blue-700 transition-colors font-medium"
            >
              ✕ Clear all filters
            </button>
          </div>
        )}

        {/* Question list */}
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <div className="animate-spin w-6 h-6 border-4 border-blue-500 border-t-transparent rounded-full" />
            </div>
          ) : questions.length === 0 ? (
            <div className="text-center py-16 px-8">
              <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-slate-400">
                  <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
                </svg>
              </div>
              <p className="text-slate-700 font-medium mb-1">No questions found</p>
              {hasFilters && (
                <p className="text-sm text-slate-500 mb-4">
                  Current filters: {activeFilters.join(' · ')}
                </p>
              )}
              <p className="text-sm text-slate-400 mb-5">This combination returned no results.</p>
              {hasFilters && (
                <button
                  onClick={clearFilters}
                  className="px-4 py-2 rounded-lg text-sm font-medium text-white transition-all"
                  style={{ backgroundColor: 'var(--clr-primary)' }}
                >
                  Clear all filters
                </button>
              )}
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {questions.map(q => {
                const book    = q.source_book as { title: string; author: string } | null | undefined
                const chapter = q.chapter as { chapter_number: number; chapter_name: string } | null | undefined
                return (
                  <div key={q.id} className="p-4 flex items-start gap-3 hover:bg-slate-50 transition-colors">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-slate-800 mb-2">
                        {q.question_text.slice(0, 120)}{q.question_text.length > 120 ? '…' : ''}
                      </p>

                      {/* Badges */}
                      <div className="flex flex-wrap gap-1.5 mb-1.5">
                        {q.subject && (
                          <span className="text-xs px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 font-medium">
                            {(q.subject as { name: string }).name}
                          </span>
                        )}
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium capitalize ${DIFFICULTY_COLORS[q.difficulty] ?? ''}`}>
                          {q.difficulty}
                        </span>
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                          q.flagged ? 'bg-amber-100 text-amber-700' :
                          q.active  ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'
                        }`}>
                          {q.flagged ? 'Flagged' : q.active ? 'Published' : 'Draft'}
                        </span>
                        {q.source_type === 'ai' && (
                          <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-purple-100 text-purple-700">AI</span>
                        )}
                      </div>

                      {/* Book + chapter context line */}
                      {book && (
                        <div className="flex items-center gap-1 text-xs text-slate-400">
                          <IconBook size={11} className="flex-shrink-0" />
                          <span className="text-slate-500">
                            {book.title}{book.author ? ` — ${book.author}` : ''}
                          </span>
                          {chapter && (
                            <>
                              <span className="text-slate-300">·</span>
                              <span>Ch.{chapter.chapter_number} — {chapter.chapter_name}</span>
                            </>
                          )}
                          <span className={q.citation_verified ? 'text-teal-500 font-medium' : 'text-orange-400 font-medium'}>
                            {q.citation_verified ? '✓' : '~'}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-1 flex-shrink-0">
                      {!q.active && (
                        <div className="relative">
                          <button
                            onClick={() => setApproveDropdown(approveDropdown === q.id ? null : q.id)}
                            className="flex items-center gap-0.5 px-2 py-1 rounded-lg text-xs font-medium text-green-700 bg-green-50 hover:bg-green-100 transition-colors"
                          >
                            <IconCheck size={13} />
                            Approve ▾
                          </button>
                          {approveDropdown === q.id && (
                            <div className="absolute right-0 top-full mt-1 w-44 bg-white border border-slate-200 rounded-lg shadow-lg z-10 overflow-hidden">
                              <button
                                onClick={() => approve(q.id, false)}
                                className="w-full text-left px-3 py-2 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                              >
                                <IconCheck size={13} className="text-green-600" />
                                Approve
                              </button>
                              <button
                                onClick={() => approve(q.id, true)}
                                className="w-full text-left px-3 py-2 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2 border-t border-slate-100"
                              >
                                <IconCheck size={13} className="text-blue-600" />
                                Approve & Verify
                              </button>
                            </div>
                          )}
                        </div>
                      )}
                      <Link
                        href={`/admin/questions/${q.id}/edit`}
                        className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 transition-colors"
                        title="Edit"
                      >
                        <IconEdit size={16} />
                      </Link>
                      <button
                        onClick={() => softDelete(q.id)}
                        className="p-1.5 rounded-lg text-red-400 hover:bg-red-50 transition-colors"
                        title="Deactivate"
                      >
                        <IconTrash size={16} />
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Pagination */}
        {total > PAGE_SIZE && (
          <div className="flex items-center justify-between mt-4 text-sm text-slate-500">
            <span>Showing {page * PAGE_SIZE + 1}–{Math.min((page + 1) * PAGE_SIZE, total)} of {total}</span>
            <div className="flex gap-2">
              <button
                disabled={page === 0}
                onClick={() => setPage(p => p - 1)}
                className="px-3 py-1.5 rounded-lg border border-slate-200 hover:border-slate-300 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <button
                disabled={(page + 1) * PAGE_SIZE >= total}
                onClick={() => setPage(p => p + 1)}
                className="px-3 py-1.5 rounded-lg border border-slate-200 hover:border-slate-300 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
