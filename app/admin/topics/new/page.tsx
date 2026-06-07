'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { Subject } from '@/lib/types'

export default function NewTopicPage() {
  const router = useRouter()
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const [subjectId, setSubjectId] = useState('')
  const [name, setName] = useState('')
  const [sortOrder, setSortOrder] = useState(0)

  useEffect(() => {
    supabase.from('subjects').select('*').order('sort_order').then(({ data }) => setSubjects(data || []))
  }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!subjectId) { setError('Subject is required.'); return }
    if (!name.trim()) { setError('Topic name is required.'); return }
    setSaving(true)
    setError('')
    const { error: err } = await supabase.from('topics').insert({
      subject_id: subjectId,
      name: name.trim(),
      sort_order: sortOrder,
    })
    if (err) {
      setError(err.message)
      setSaving(false)
      return
    }
    router.push('/admin/topics')
  }

  return (
    <div className="px-4 py-6">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-xl font-bold text-slate-800">New Topic</h1>
          <Link
            href="/admin/topics"
            className="text-sm text-slate-500 hover:text-slate-700 transition-colors"
          >
            ← Back to Topics
          </Link>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-slate-200 p-6 space-y-5">
          {error && (
            <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-3">
              {error}
            </div>
          )}

          {/* Subject */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Subject <span className="text-red-500">*</span>
            </label>
            <select
              value={subjectId}
              onChange={e => setSubjectId(e.target.value)}
              required
              className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">— Select subject —</option>
              {subjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
          </div>

          {/* Topic name */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Topic / Chapter Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="e.g. Radio Navigation Aids"
              required
              className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Sort order */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Sort Order</label>
            <input
              type="number"
              value={sortOrder}
              onChange={e => setSortOrder(Number(e.target.value))}
              className="w-32 text-sm border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3 pt-2">
            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium text-white disabled:opacity-50 transition-all"
              style={{ backgroundColor: '#185FA5' }}
            >
              {saving ? 'Saving…' : 'Save Topic'}
            </button>
            <Link
              href="/admin/topics"
              className="px-4 py-2 rounded-lg text-sm font-medium text-slate-600 border border-slate-200 hover:border-slate-300 transition-all"
            >
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}
