'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { Subject } from '@/lib/types'
import { IconPlus, IconEdit, IconTrash, IconBook2 } from '@tabler/icons-react'

type SubjectWithCount = Subject & {
  questions: { id: string }[]
}

type DeleteCounts = {
  topics: number
  books: number
  questions: number
}

export default function SubjectsPage() {
  const [subjects, setSubjects] = useState<SubjectWithCount[]>([])
  const [loading, setLoading] = useState(true)

  // Delete dialog state
  const [deleteTarget, setDeleteTarget] = useState<SubjectWithCount | null>(null)
  const [deleteCounts, setDeleteCounts] = useState<DeleteCounts | null>(null)
  const [deleteInput, setDeleteInput] = useState('')
  const [deleting, setDeleting] = useState(false)

  async function load() {
    setLoading(true)
    const { data } = await supabase
      .from('subjects')
      .select('*, questions:questions(id)')
      .order('sort_order')
    setSubjects((data as SubjectWithCount[]) || [])
    setLoading(false)
  }

  useEffect(() => { load() }, []) // eslint-disable-line react-hooks/exhaustive-deps

  async function toggleActive(s: SubjectWithCount) {
    await supabase.from('subjects').update({ active: !s.active }).eq('id', s.id)
    load()
  }

  async function openDeleteDialog(s: SubjectWithCount) {
    setDeleteTarget(s)
    setDeleteInput('')
    setDeleteCounts(null)

    const [topicsRes, booksRes, questionsRes] = await Promise.all([
      supabase.from('topics').select('id', { count: 'exact', head: true }).eq('subject_id', s.id),
      supabase.from('source_books').select('id', { count: 'exact', head: true }).eq('subject_id', s.id),
      supabase.from('questions').select('id', { count: 'exact', head: true }).eq('subject_id', s.id),
    ])
    setDeleteCounts({
      topics: topicsRes.count ?? 0,
      books: booksRes.count ?? 0,
      questions: questionsRes.count ?? 0,
    })
  }

  async function confirmDelete() {
    if (!deleteTarget || deleteInput !== deleteTarget.name) return
    setDeleting(true)
    await supabase.from('subjects').delete().eq('id', deleteTarget.id)
    setDeleting(false)
    setDeleteTarget(null)
    setDeleteCounts(null)
    setDeleteInput('')
    load()
  }

  const stats = {
    total: subjects.length,
    cpl: subjects.filter(s => s.licence_types?.includes('CPL')).length,
    atpl: subjects.filter(s => s.licence_types?.includes('ATPL')).length,
  }

  return (
    <div className="px-4 py-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-xl font-bold text-slate-800">Subjects</h1>
          <Link
            href="/admin/subjects/new"
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium text-white transition-all"
            style={{ backgroundColor: 'var(--clr-primary)' }}
          >
            <IconPlus size={15} />
            Add Subject
          </Link>
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
          {[
            { label: 'Total Subjects', value: stats.total, color: 'text-slate-800' },
            { label: 'CPL Licence', value: stats.cpl, color: 'text-blue-600' },
            { label: 'ATPL Licence', value: stats.atpl, color: 'text-purple-600' },
          ].map(s => (
            <div key={s.label} className="bg-white rounded-xl border border-slate-200 p-4">
              <div className={`text-2xl font-bold ${s.color}`}>{s.value}</div>
              <div className="text-xs text-slate-500 mt-0.5">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Subjects list */}
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <div className="animate-spin w-6 h-6 border-4 border-blue-500 border-t-transparent rounded-full" />
            </div>
          ) : subjects.length === 0 ? (
            <div className="text-center py-16 text-slate-400">
              <IconBook2 size={32} className="mx-auto mb-2 opacity-40" />
              <p>No subjects found.</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {/* Table header */}
              <div className="hidden sm:grid grid-cols-[1fr_auto_auto_auto_auto_auto] gap-4 px-4 py-2 bg-slate-50 text-xs font-medium text-slate-500 uppercase tracking-wide">
                <span>Name</span>
                <span>Code</span>
                <span>Licence Types</span>
                <span>Questions</span>
                <span>Active</span>
                <span></span>
              </div>
              {subjects.map(subject => (
                <div key={subject.id} className="p-4 flex items-center gap-3 hover:bg-slate-50 transition-colors">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-800 truncate">{subject.name}</p>
                    {subject.description && (
                      <p className="text-xs text-slate-500 truncate mt-0.5">{subject.description}</p>
                    )}
                  </div>
                  <div className="hidden sm:block flex-shrink-0">
                    <span className="text-xs px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 font-medium">
                      {subject.code}
                    </span>
                  </div>
                  <div className="hidden sm:flex flex-shrink-0 gap-1">
                    {(subject.licence_types || []).map(lt => (
                      <span key={lt} className="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-medium">
                        {lt}
                      </span>
                    ))}
                    {(!subject.licence_types || subject.licence_types.length === 0) && (
                      <span className="text-xs text-slate-400">—</span>
                    )}
                  </div>
                  <div className="hidden sm:block flex-shrink-0 text-center text-xs text-slate-500 w-16">
                    {subject.questions?.length ?? 0}
                  </div>
                  <div className="hidden sm:block flex-shrink-0">
                    <button
                      onClick={() => toggleActive(subject)}
                      className={`text-xs px-2 py-0.5 rounded-full font-medium transition-colors ${
                        subject.active
                          ? 'bg-green-100 text-green-700 hover:bg-green-200'
                          : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                      }`}
                    >
                      {subject.active ? 'Active' : 'Inactive'}
                    </button>
                  </div>
                  <div className="flex items-center gap-1 flex-shrink-0">
                    <Link
                      href={`/admin/subjects/${subject.id}/edit`}
                      className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 transition-colors"
                      title="Edit"
                    >
                      <IconEdit size={16} />
                    </Link>
                    <button
                      onClick={() => openDeleteDialog(subject)}
                      className="p-1.5 rounded-lg text-red-400 hover:bg-red-50 transition-colors"
                      title="Delete"
                    >
                      <IconTrash size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Delete confirmation dialog */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-xl border border-slate-200 shadow-xl w-full max-w-md mx-4 p-6">
            <h2 className="text-base font-bold text-slate-800 mb-2">Delete Subject</h2>
            {deleteCounts === null ? (
              <div className="flex items-center justify-center py-6">
                <div className="animate-spin w-5 h-5 border-4 border-blue-500 border-t-transparent rounded-full" />
              </div>
            ) : (
              <>
                <p className="text-sm text-slate-600 mb-4">
                  Deleting <span className="font-semibold text-slate-800">&apos;{deleteTarget.name}&apos;</span> will
                  permanently remove{' '}
                  <span className="font-semibold">{deleteCounts.topics}</span> topic{deleteCounts.topics !== 1 ? 's' : ''},
                  {' '}<span className="font-semibold">{deleteCounts.books}</span> source book{deleteCounts.books !== 1 ? 's' : ''},
                  {' '}and <span className="font-semibold">{deleteCounts.questions}</span> question{deleteCounts.questions !== 1 ? 's' : ''}.
                </p>
                <p className="text-sm text-slate-600 mb-3">
                  Type <span className="font-mono font-semibold text-slate-800">{deleteTarget.name}</span> to confirm:
                </p>
                <input
                  type="text"
                  value={deleteInput}
                  onChange={e => setDeleteInput(e.target.value)}
                  placeholder={deleteTarget.name}
                  className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-red-400"
                />
                <div className="flex items-center gap-3">
                  <button
                    onClick={confirmDelete}
                    disabled={deleteInput !== deleteTarget.name || deleting}
                    className="px-4 py-2 rounded-lg text-sm font-medium text-white bg-red-600 hover:bg-red-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                  >
                    {deleting ? 'Deleting…' : 'Delete Subject'}
                  </button>
                  <button
                    onClick={() => { setDeleteTarget(null); setDeleteCounts(null); setDeleteInput('') }}
                    className="px-4 py-2 rounded-lg text-sm font-medium text-slate-600 border border-slate-200 hover:border-slate-300 transition-all"
                  >
                    Cancel
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
