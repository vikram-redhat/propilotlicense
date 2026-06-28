'use client'
import { use, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'

const LICENCE_OPTIONS = ['CPL', 'ATPL']

export default function EditSubjectPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const [name, setName] = useState('')
  const [code, setCode] = useState('')
  const [description, setDescription] = useState('')
  const [iconName, setIconName] = useState('')
  const [licenceTypes, setLicenceTypes] = useState<string[]>([])
  const [sortOrder, setSortOrder] = useState(0)
  const [active, setActive] = useState(true)

  useEffect(() => {
    async function loadSubject() {
      const { data } = await supabase.from('subjects').select('*').eq('id', id).single()
      if (data) {
        setName(data.name || '')
        setCode(data.code || '')
        setDescription(data.description || '')
        setIconName(data.icon_name || '')
        setLicenceTypes(data.licence_types || [])
        setSortOrder(data.sort_order ?? 0)
        setActive(data.active ?? true)
      }
      setLoading(false)
    }
    loadSubject()
  }, [id])

  function toggleLicence(lt: string) {
    setLicenceTypes(prev =>
      prev.includes(lt) ? prev.filter(x => x !== lt) : [...prev, lt]
    )
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim()) { setError('Name is required.'); return }
    if (!code.trim()) { setError('Code is required.'); return }
    setSaving(true)
    setError('')
    const { error: err } = await supabase.from('subjects').update({
      name: name.trim(),
      code: code.trim().toUpperCase(),
      description: description.trim() || null,
      icon_name: iconName.trim() || null,
      licence_types: licenceTypes,
      sort_order: sortOrder,
      active,
    }).eq('id', id)
    if (err) {
      setError(err.message)
      setSaving(false)
      return
    }
    router.push('/admin/subjects')
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <div className="animate-spin w-6 h-6 border-4 border-blue-500 border-t-transparent rounded-full" />
      </div>
    )
  }

  return (
    <div className="px-4 py-6">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-xl font-bold text-slate-800">Edit Subject</h1>
          <Link
            href="/admin/subjects"
            className="text-sm text-slate-500 hover:text-slate-700 transition-colors"
          >
            ← Back to Subjects
          </Link>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-slate-200 p-6 space-y-5">
          {error && (
            <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-3">
              {error}
            </div>
          )}

          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="e.g. Meteorology"
              required
              className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Code */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Code <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={code}
              onChange={e => setCode(e.target.value.toUpperCase().replace(/\s/g, ''))}
              placeholder="e.g. MET"
              required
              className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
            />
            <p className="text-xs text-slate-400 mt-1">Used internally, e.g. MET, NAV</p>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Description</label>
            <textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              rows={3}
              placeholder="Brief description of the subject"
              className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
          </div>

          {/* Icon name */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Icon Name</label>
            <input
              type="text"
              value={iconName}
              onChange={e => setIconName(e.target.value)}
              placeholder="e.g. wind"
              className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <p className="text-xs text-slate-400 mt-1">Tabler icon name, e.g. &apos;wind&apos;. Browse at tabler-icons.io</p>
          </div>

          {/* Licence types */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Licence Types</label>
            <div className="flex gap-4">
              {LICENCE_OPTIONS.map(lt => (
                <label key={lt} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={licenceTypes.includes(lt)}
                    onChange={() => toggleLicence(lt)}
                    className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-slate-700">{lt}</span>
                </label>
              ))}
            </div>
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

          {/* Active */}
          <div>
            <label className="flex items-center gap-3 cursor-pointer">
              <div className="relative">
                <input
                  type="checkbox"
                  checked={active}
                  onChange={e => setActive(e.target.checked)}
                  className="sr-only"
                />
                <div
                  onClick={() => setActive(prev => !prev)}
                  className={`w-10 h-6 rounded-full transition-colors cursor-pointer ${active ? 'bg-blue-500' : 'bg-slate-300'}`}
                >
                  <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${active ? 'translate-x-5' : 'translate-x-1'}`} />
                </div>
              </div>
              <span className="text-sm font-medium text-slate-700">Active</span>
            </label>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3 pt-2">
            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium text-white disabled:opacity-50 transition-all"
              style={{ backgroundColor: 'var(--clr-primary)' }}
            >
              {saving ? 'Saving…' : 'Save Changes'}
            </button>
            <Link
              href="/admin/subjects"
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
