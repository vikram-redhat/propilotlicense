'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { Subject, Country } from '@/lib/types'
import { flagEmoji } from '@/lib/countries'

const LICENCE_OPTIONS = ['CPL', 'ATPL']

export default function NewBookPage() {
  const router = useRouter()
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [countries, setCountries] = useState<Country[]>([])
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const [subjectId, setSubjectId] = useState('')
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [edition, setEdition] = useState('')
  const [licenceTypes, setLicenceTypes] = useState<string[]>([])
  const [bookCountries, setBookCountries] = useState<string[]>(['IN'])
  const [sortOrder, setSortOrder] = useState(0)

  useEffect(() => {
    supabase.from('subjects').select('*').order('sort_order').then(({ data }) => setSubjects(data || []))
    supabase.from('countries').select('*').eq('active', true).order('sort_order').then(({ data }) => setCountries(data || []))
  }, [])

  function toggleLicence(lt: string) {
    setLicenceTypes(prev =>
      prev.includes(lt) ? prev.filter(x => x !== lt) : [...prev, lt]
    )
  }

  function toggleCountry(code: string) {
    setBookCountries(prev =>
      prev.includes(code) ? prev.filter(x => x !== code) : [...prev, code]
    )
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!title.trim()) { setError('Title is required.'); return }
    setSaving(true)
    setError('')
    const { error: err } = await supabase.from('source_books').insert({
      subject_id: subjectId || null,
      title: title.trim(),
      author: author.trim() || null,
      edition: edition.trim() || null,
      licence_types: licenceTypes,
      countries: bookCountries,
      sort_order: sortOrder,
    })
    if (err) {
      setError(err.message)
      setSaving(false)
      return
    }
    router.push('/admin/books')
  }

  return (
    <div className="px-4 py-6">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-xl font-bold text-slate-800">New Book</h1>
          <Link
            href="/admin/books"
            className="text-sm text-slate-500 hover:text-slate-700 transition-colors"
          >
            ← Back to Books
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
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Subject</label>
            <select
              value={subjectId}
              onChange={e => setSubjectId(e.target.value)}
              className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">— None —</option>
              {subjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
          </div>

          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="e.g. Air Navigation"
              required
              className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Author */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Author</label>
            <input
              type="text"
              value={author}
              onChange={e => setAuthor(e.target.value)}
              placeholder="e.g. IC Joshi"
              className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Edition */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Edition</label>
            <input
              type="text"
              value={edition}
              onChange={e => setEdition(e.target.value)}
              placeholder="e.g. 3rd Edition or 2006"
              className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
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

          {/* Countries */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Countries</label>
            <div className="flex flex-wrap gap-3">
              {countries.map(c => (
                <label key={c.code} className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={bookCountries.includes(c.code)}
                    onChange={() => toggleCountry(c.code)}
                    className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-slate-700">{flagEmoji(c.code)} {c.name}</span>
                </label>
              ))}
              {countries.length === 0 && (
                <span className="text-xs text-slate-400">
                  No countries set up yet — add one in <Link href="/admin/countries" className="underline">Countries</Link>.
                </span>
              )}
            </div>
            <p className="text-xs text-slate-400 mt-1">Which exam(s)/region(s) this book is relevant to. New countries can be added in Countries.</p>
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
              style={{ backgroundColor: 'var(--clr-primary)' }}
            >
              {saving ? 'Saving…' : 'Save Book'}
            </button>
            <Link
              href="/admin/books"
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
