'use client'
import { useEffect, useState } from 'react'

type Row = { counts: Record<string, number>; total: number }
type Data = { overall: Row; subjects: (Row & { name: string })[] }

const LETTERS = ['A', 'B', 'C', 'D']

// A letter's share is fine within 20–30% (an even spread is 25%), worth a look within
// 15–35%, and a problem outside that. Subjects with few questions swing more, so they're
// only judged once they have 100.
function level(share: number, total: number): 'ok' | 'watch' | 'bad' {
  if (total < 100) return 'ok'
  if (share < 0.15 || share > 0.35) return 'bad'
  if (share < 0.2 || share > 0.3) return 'watch'
  return 'ok'
}
const COLOUR = { ok: 'text-slate-700', watch: 'text-amber-600 font-semibold', bad: 'text-red-600 font-bold' }

// Correct-answer balance across A–D for active questions, overall and per subject.
export default function AnswerBalance() {
  const [data, setData] = useState<Data | null>(null)
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    fetch('/api/admin/answer-balance')
      .then(r => r.ok ? r.json() : Promise.reject())
      .then(setData)
      .catch(() => setFailed(true))
  }, [])

  if (failed) return <div className="bg-white rounded-xl border border-slate-200 p-4 mb-6 text-sm text-slate-500">Couldn&apos;t load the correct-answer balance.</div>
  if (!data) return <div className="bg-white rounded-xl border border-slate-200 p-4 mb-6 text-sm text-slate-400">Loading correct-answer balance…</div>

  const rows = [{ name: 'All subjects', ...data.overall }, ...data.subjects]
  const worst = rows.flatMap(r => LETTERS.map(l => level(r.total ? r.counts[l] / r.total : 0, r.total)))
  const status = worst.includes('bad') ? 'bad' : worst.includes('watch') ? 'watch' : 'ok'

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-4 mb-6">
      <div className="flex items-baseline justify-between gap-3 flex-wrap mb-3">
        <div>
          <div className="text-sm font-semibold text-slate-800">Correct-answer balance</div>
          <div className="text-xs text-slate-500">Which letter holds the right answer, across active questions. An even spread is 25% each.</div>
        </div>
        <span className={`text-xs font-semibold px-2 py-0.5 rounded ${status === 'ok' ? 'bg-green-100 text-green-700' : status === 'watch' ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'}`}>
          {status === 'ok' ? 'Balanced' : status === 'watch' ? 'Drifting' : 'Skewed'}
        </span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-xs text-slate-500 text-left">
              <th className="py-1 pr-3 font-medium">Subject</th>
              {LETTERS.map(l => <th key={l} className="py-1 px-2 font-medium text-right">{l}</th>)}
              <th className="py-1 pl-2 font-medium text-right">Questions</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={r.name} className={i === 0 ? 'border-b border-slate-200 font-semibold' : 'border-b border-slate-100 last:border-0'}>
                <td className="py-1.5 pr-3 text-slate-700">{r.name}</td>
                {LETTERS.map(l => {
                  const share = r.total ? r.counts[l] / r.total : 0
                  return <td key={l} className={`py-1.5 px-2 text-right tabular-nums ${COLOUR[level(share, r.total)]}`}>{(share * 100).toFixed(0)}%</td>
                })}
                <td className="py-1.5 pl-2 text-right tabular-nums text-slate-500">{r.total.toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
