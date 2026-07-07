import Link from 'next/link'
import { Country } from '@/lib/types'
import { flagEmoji } from '@/lib/countries'

export function CountryCheckboxGroup({ countries, selected, onToggle }: {
  countries: Country[]
  selected: string[]
  onToggle: (code: string) => void
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-slate-700 mb-1.5">Countries</label>
      <div className="flex flex-wrap gap-3">
        {countries.map(c => (
          <label key={c.code} className="flex items-center gap-1.5 cursor-pointer">
            <input
              type="checkbox"
              checked={selected.includes(c.code)}
              onChange={() => onToggle(c.code)}
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
      {countries.length > 0 && selected.length === 0 && (
        <p className="text-xs text-amber-600 mt-1">No countries selected — this book will be hidden from every country&apos;s students.</p>
      )}
    </div>
  )
}
