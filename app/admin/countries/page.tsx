'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { Country } from '@/lib/types'
import { flagEmoji } from '@/lib/countries'
import { IconPlus, IconEdit, IconTrash, IconFlag } from '@tabler/icons-react'

type CountryWithBooks = Country & { books: { id: string }[] }

export default function CountriesPage() {
  const [countries, setCountries] = useState<CountryWithBooks[]>([])
  const [loading, setLoading] = useState(true)

  async function load() {
    setLoading(true)
    const { data: rows } = await supabase.from('countries').select('*').order('sort_order')
    const { data: books } = await supabase.from('source_books').select('id, countries')
    const withBooks = (rows || []).map(c => ({
      ...c,
      books: (books || []).filter(b => (b.countries || []).includes(c.code)).map(b => ({ id: b.id })),
    }))
    setCountries(withBooks)
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  async function deleteCountry(country: CountryWithBooks) {
    const n = country.books.length
    if (n > 0) {
      alert(`Can't delete ${country.name} — ${n} book${n !== 1 ? 's' : ''} still tagged with it. Untag them first, or mark it inactive instead.`)
      return
    }
    if (!confirm(`Delete ${country.name} (${country.code})?`)) return
    await supabase.from('countries').delete().eq('id', country.id)
    load()
  }

  const stats = {
    total: countries.length,
    active: countries.filter(c => c.active).length,
  }

  return (
    <div className="px-4 py-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-xl font-bold text-slate-800">Countries</h1>
          <Link
            href="/admin/countries/new"
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium text-white transition-all"
            style={{ backgroundColor: 'var(--clr-primary)' }}
          >
            <IconPlus size={15} />
            New Country
          </Link>
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
          {[
            { label: 'Total Countries', value: stats.total, color: 'text-slate-800' },
            { label: 'Active', value: stats.active, color: 'text-green-600' },
          ].map(s => (
            <div key={s.label} className="bg-white rounded-xl border border-slate-200 p-4">
              <div className={`text-2xl font-bold ${s.color}`}>{s.value}</div>
              <div className="text-xs text-slate-500 mt-0.5">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Countries list */}
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <div className="animate-spin w-6 h-6 border-4 border-blue-500 border-t-transparent rounded-full" />
            </div>
          ) : countries.length === 0 ? (
            <div className="text-center py-16 text-slate-400">
              <IconFlag size={32} className="mx-auto mb-2 opacity-40" />
              <p>No countries found.</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              <div className="hidden sm:grid grid-cols-[1fr_auto_auto_auto_auto] gap-4 px-4 py-2 bg-slate-50 text-xs font-medium text-slate-500 uppercase tracking-wide">
                <span>Country</span>
                <span>Books</span>
                <span>Status</span>
                <span>Order</span>
                <span></span>
              </div>
              {countries.map(country => (
                <div key={country.id} className="p-4 flex items-center gap-3 hover:bg-slate-50 transition-colors">
                  <div className="flex-1 min-w-0 flex items-center gap-2">
                    <span className="text-xl leading-none">{flagEmoji(country.code)}</span>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-slate-800 truncate">{country.name}</p>
                      <p className="text-xs text-slate-500">{country.code}</p>
                    </div>
                  </div>
                  <div className="hidden sm:block flex-shrink-0 w-16 text-center">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                      country.books.length > 0 ? 'bg-blue-50 text-blue-700' : 'bg-slate-100 text-slate-500'
                    }`}>
                      {country.books.length}
                    </span>
                  </div>
                  <div className="hidden sm:block flex-shrink-0">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                      country.active ? 'bg-green-50 text-green-700' : 'bg-slate-100 text-slate-500'
                    }`}>
                      {country.active ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  <div className="hidden sm:block flex-shrink-0 w-8 text-center text-xs text-slate-500">
                    {country.sort_order}
                  </div>
                  <div className="flex items-center gap-1 flex-shrink-0">
                    <Link
                      href={`/admin/countries/${country.id}/edit`}
                      className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 transition-colors"
                      title="Edit"
                    >
                      <IconEdit size={16} />
                    </Link>
                    <button
                      onClick={() => deleteCountry(country)}
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
    </div>
  )
}
