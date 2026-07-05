'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { flagEmoji } from '@/lib/countries'

export default function NewCountryPage() {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const [code, setCode] = useState('')
  const [name, setName] = useState('')
  const [sortOrder, setSortOrder] = useState(0)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const trimmedCode = code.trim().toUpperCase()
    if (trimmedCode.length !== 2) { setError('Country code must be exactly 2 letters (ISO 3166-1 alpha-2, e.g. IN, US, AU).'); return }
    if (!name.trim()) { setError('Name is required.'); return }
    setSaving(true)
    setError('')
    const { error: err } = await supabase.from('countries').insert({
      code: trimmedCode,
      name: name.trim(),
      sort_order: sortOrder,
    })
    if (err) {
      setError(err.message.includes('duplicate') ? `A country with code ${trimmedCode} already exists.` : err.message)
      setSaving(false)
      return
    }
    router.push('/admin/countries')
  }

  return (
    <div className="px-4 py-6">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-xl font-bold text-slate-800">New Country</h1>
          <Link href="/admin/countries" className="text-sm text-slate-500 hover:text-slate-700 transition-colors">
            ← Back to Countries
          </Link>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-slate-200 p-6 space-y-5">
          {error && (
            <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-3">{error}</div>
          )}

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Country Code <span className="text-red-500">*</span>
            </label>
            <div className="flex items-center gap-3">
              <input
                type="text"
                value={code}
                onChange={e => setCode(e.target.value.toUpperCase().slice(0, 2))}
                placeholder="e.g. IN"
                maxLength={2}
                required
                className="w-24 text-sm border border-slate-200 rounded-lg px-3 py-2 uppercase focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <span className="text-2xl leading-none">{flagEmoji(code)}</span>
            </div>
            <p className="text-xs text-slate-400 mt-1">ISO 3166-1 alpha-2 — 2 letters, drives the flag automatically.</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="e.g. India"
              required
              className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Sort Order</label>
            <input
              type="number"
              value={sortOrder}
              onChange={e => setSortOrder(Number(e.target.value))}
              className="w-32 text-sm border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex items-center gap-3 pt-2">
            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium text-white disabled:opacity-50 transition-all"
              style={{ backgroundColor: 'var(--clr-primary)' }}
            >
              {saving ? 'Saving…' : 'Save Country'}
            </button>
            <Link
              href="/admin/countries"
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
