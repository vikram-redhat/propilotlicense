'use client'
import { useEffect, useState, useCallback } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { Question, Subject } from '@/lib/types'
import { IconPlus, IconSparkles, IconEdit, IconTrash, IconCheck, IconBook, IconBook2 } from '@tabler/icons-react'

const DIFFICULTY_COLORS = {
  easy: 'bg-green-100 text-green-700',
  medium: 'bg-amber-100 text-amber-700',
  hard: 'bg-red-100 text-red-700',
}

export default function AdminPage() {
  const [questions, setQuestions] = useState<Question[]>([])
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [filterSubject, setFilterSubject] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [filterSource, setFilterSource] = useState('all')
  const [filterCitation, setFilterCitation] = useState('all')
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(0)
  const [total, setTotal] = useState(0)

  const PAGE_SIZE = 20

  const load = useCallback(async () => {
    setLoading(true)
    let query = supabase
      .from('questions')
      .select('*, subject:subjects(name,code), topic:topics(name), source_book:source_books(title,author)', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(page * PAGE_SIZE, (page + 1) * PAGE_SIZE - 1)

    if (filterSubject) query = query.eq('subject_id', filterSubject)
    if (filterStatus === 'published') query = query.eq('active', true)
    if (filterStatus === 'pending') query = query.eq('active', false).eq('flagged', false)
    if (filterStatus === 'flagged') query = query.eq('flagged', true)
    if (filterSource === 'manual') query = query.eq('source_type', 'manual')
    if (filterSource === 'ai') query = query.eq('source_type', 'ai')
    if (filterCitation === 'verified') query = query.eq('citation_verified', true)
    if (filterCitation === 'approx') query = query.eq('citation_verified', false).not('source_book_id', 'is', null)

    const { data, count } = await query
    setQuestions(data || [])
    setTotal(count || 0)
    setLoading(false)
  }, [filterSubject, filterStatus, filterSource, filterCitation, page])

  useEffect(() => {
    supabase.from('subjects').select('*').order('sort_order').then(({ data }) => setSubjects(data || []))
  }, [])

  useEffect(() => { load() }, [load])

  const [approveDropdown, setApproveDropdown] = useState<string | null>(null)

  async function approve(id: string, citationVerified = false) {
    await supabase.from('questions').update({ active: true, citation_verified: citationVerified }).eq('id', id)
    setApproveDropdown(null)
    load()
  }

  async function softDelete(id: string) {
    if (!confirm('Deactivate this question?')) return
    await supabase.from('questions').update({ active: false }).eq('id', id)
    load()
  }

  const [stats, setStats] = useState({ total: 0, pending: 0, published: 0, ai: 0, citVerified: 0, citTotal: 0 })
  useEffect(() => {
    async function loadStats() {
      const { data } = await supabase
        .from('questions')
        .select('active, source_type, citation_verified, source_book_id')
      if (!data) return
      const withBook = data.filter(q => q.source_book_id)
      setStats({
        total: data.length,
        pending: data.filter(q => !q.active).length,
        published: data.filter(q => q.active).length,
        ai: data.filter(q => q.source_type === 'ai').length,
        citVerified: withBook.filter(q => q.citation_verified).length,
        citTotal: withBook.length,
      })
    }
    loadStats()
  }, [questions])

  return (
    <div className="px-4 py-6">
      <div className="max-w-6xl mx-auto">
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
              style={{ backgroundColor: '#185FA5' }}
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

        {/* Filters */}
        <div className="flex flex-wrap gap-3 mb-4">
          <select
            value={filterSubject}
            onChange={e => { setFilterSubject(e.target.value); setPage(0) }}
            className="text-sm border border-slate-200 rounded-lg px-3 py-2 bg-white text-slate-700"
          >
            <option value="">All Subjects</option>
            {subjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
          </select>
          <select
            value={filterStatus}
            onChange={e => { setFilterStatus(e.target.value); setPage(0) }}
            className="text-sm border border-slate-200 rounded-lg px-3 py-2 bg-white text-slate-700"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="published">Published</option>
            <option value="flagged">Flagged</option>
          </select>
          <select
            value={filterSource}
            onChange={e => { setFilterSource(e.target.value); setPage(0) }}
            className="text-sm border border-slate-200 rounded-lg px-3 py-2 bg-white text-slate-700"
          >
            <option value="all">All Sources</option>
            <option value="manual">Manual</option>
            <option value="ai">AI Generated</option>
          </select>
          <select
            value={filterCitation}
            onChange={e => { setFilterCitation(e.target.value); setPage(0) }}
            className="text-sm border border-slate-200 rounded-lg px-3 py-2 bg-white text-slate-700"
          >
            <option value="all">All Citations</option>
            <option value="verified">Verified</option>
            <option value="approx">Approximate</option>
          </select>
        </div>

        {/* Question list */}
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <div className="animate-spin w-6 h-6 border-4 border-blue-500 border-t-transparent rounded-full" />
            </div>
          ) : questions.length === 0 ? (
            <div className="text-center py-16 text-slate-400">
              <p>No questions found.</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {questions.map(q => {
                const book = q.source_book as { title: string; author: string } | null | undefined
                return (
                  <div key={q.id} className="p-4 flex items-start gap-3 hover:bg-slate-50 transition-colors">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-slate-800 truncate mb-2">
                        {q.question_text.slice(0, 100)}{q.question_text.length > 100 ? '…' : ''}
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {q.subject && (
                          <span className="text-xs px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 font-medium">
                            {(q.subject as { name: string }).name}
                          </span>
                        )}
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium capitalize ${DIFFICULTY_COLORS[q.difficulty]}`}>
                          {q.difficulty}
                        </span>
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                          q.active ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'
                        }`}>
                          {q.active ? 'Published' : 'Draft'}
                        </span>
                        {q.source_type === 'ai' && (
                          <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-purple-100 text-purple-700">AI</span>
                        )}
                        {q.flagged && (
                          <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-amber-100 text-amber-700">Flagged</span>
                        )}
                        {book && (
                          <span className="flex items-center gap-1 text-xs px-2 py-0.5 rounded-full font-medium bg-slate-100 text-slate-600">
                            {q.citation_verified ? <IconBook size={11} /> : <IconBook2 size={11} />}
                            {book.title.length > 25 ? book.title.slice(0, 25) + '…' : book.title}
                          </span>
                        )}
                        {book && (
                          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                            q.citation_verified ? 'bg-teal-100 text-teal-700' : 'bg-orange-50 text-orange-600'
                          }`}>
                            {q.citation_verified ? '✓ Verified' : '~ Approx.'}
                          </span>
                        )}
                      </div>
                    </div>
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
                            <div className="absolute right-0 top-full mt-1 w-40 bg-white border border-slate-200 rounded-lg shadow-lg z-10 overflow-hidden">
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
