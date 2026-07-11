'use client'
import { useEffect, useState, useMemo } from 'react'

type Student = {
  id: string
  email: string | null
  full_name: string | null
  exam_type: 'CPL' | 'Composite' | 'ATPL' | null
  exam_type_set_at: string | null
  subscription_tier: 'free' | 'paid'
  subscription_plan: '30days' | '90days' | null
  subscription_expires_at: string | null
  created_at: string
  session_count: number
}

type StudentStats = {
  sessions: number
  questions_answered: number
  correct_answers: number
}

const EXAM_COLORS: Record<string, string> = {
  CPL: 'bg-blue-100 text-blue-700',
  Composite: 'bg-purple-100 text-purple-700',
  ATPL: 'bg-emerald-100 text-emerald-700',
}

function daysLeft(expiresAt: string | null): number | null {
  if (!expiresAt) return null
  return Math.ceil((new Date(expiresAt).getTime() - Date.now()) / 86400000)
}

function addDays(days: number): string {
  const d = new Date()
  d.setDate(d.getDate() + days)
  return d.toISOString()
}

function isActive(s: Student): boolean {
  if (s.subscription_tier !== 'paid') return false
  const d = daysLeft(s.subscription_expires_at)
  return d !== null && d > 0
}

function fmtDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
}

// ── Edit Modal ──────────────────────────────────────────────────────────────

function EditModal({ student, onClose, onSaved }: {
  student: Student
  onClose: () => void
  onSaved: (updated: Partial<Student>) => void
}) {
  const [stats, setStats] = useState<StudentStats | null>(null)
  const [saving, setSaving] = useState<string | null>(null)
  const [examType, setExamType] = useState<string>(student.exam_type ?? '')
  const [customDays, setCustomDays] = useState('30')

  useEffect(() => {
    fetch(`/api/admin/students/${student.id}`)
      .then(r => r.json())
      .then(d => setStats(d))
  }, [student.id])

  async function patch(body: Partial<Student>, label: string) {
    setSaving(label)
    const res = await fetch(`/api/admin/students/${student.id}`, {
      method: 'PATCH', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
    if (res.ok) { onSaved(body); }
    else { alert('Failed: ' + (await res.json()).error) }
    setSaving(null)
  }

  const days = daysLeft(student.subscription_expires_at)
  const active = isActive(student)
  const score = stats && stats.questions_answered > 0
    ? Math.round(stats.correct_answers / stats.questions_answered * 100)
    : null

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden" onClick={e => e.stopPropagation()}>

        {/* Header */}
        <div className="bg-slate-900 px-6 py-4 flex items-start justify-between">
          <div>
            <p className="text-white font-semibold text-sm">{student.email}</p>
            {student.full_name && <p className="text-slate-400 text-xs mt-0.5">{student.full_name}</p>}
            <p className="text-slate-500 text-xs mt-1">Joined {fmtDate(student.created_at)}</p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white text-lg leading-none mt-0.5">✕</button>
        </div>

        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">

          {/* Activity stats */}
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Activity</p>
            {stats ? (
              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: 'Sessions', value: stats.sessions },
                  { label: 'Answered', value: stats.questions_answered },
                  { label: 'Avg score', value: score !== null ? `${score}%` : '—' },
                ].map(s => (
                  <div key={s.label} className="bg-slate-50 rounded-xl p-3 text-center border border-slate-100">
                    <div className="text-lg font-bold text-slate-800">{s.value}</div>
                    <div className="text-xs text-slate-500 mt-0.5">{s.label}</div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-xs text-slate-400 animate-pulse">Loading…</div>
            )}
          </div>

          {/* Exam Type */}
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Exam Type</p>
            <div className="flex gap-2 mb-3">
              {(['CPL', 'Composite', 'ATPL'] as const).map(t => (
                <button
                  key={t}
                  onClick={() => setExamType(t)}
                  className={`flex-1 py-2 rounded-lg text-sm font-semibold border transition-all ${
                    examType === t
                      ? 'bg-slate-800 text-white border-slate-800'
                      : 'bg-white text-slate-600 border-slate-200 hover:border-slate-400'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => patch({ exam_type: examType as Student['exam_type'] }, 'exam')}
                disabled={saving === 'exam' || examType === student.exam_type}
                className="flex-1 py-2 rounded-lg text-sm font-semibold bg-slate-800 text-white disabled:opacity-40 hover:bg-slate-700 transition-all"
              >
                {saving === 'exam' ? 'Saving…' : 'Save exam type'}
              </button>
              <button
                onClick={() => {
                  setExamType('')
                  patch({ exam_type: null, exam_type_set_at: null } as Partial<Student>, 'reset')
                }}
                disabled={saving === 'reset' || !student.exam_type}
                className="px-4 py-2 rounded-lg text-sm font-medium text-red-600 border border-red-200 hover:bg-red-50 disabled:opacity-40 transition-all"
                title="Clears exam type — user will be prompted again on next login"
              >
                {saving === 'reset' ? '…' : 'Reset'}
              </button>
            </div>
            <p className="text-xs text-slate-400 mt-1.5">Reset clears the choice — user will be prompted on next login.</p>
          </div>

          {/* Subscription */}
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Subscription</p>

            {/* Status */}
            <div className={`rounded-lg px-4 py-3 mb-4 flex items-center justify-between ${
              active ? 'bg-green-50 border border-green-200' : 'bg-slate-50 border border-slate-200'
            }`}>
              <div>
                <span className={`text-sm font-semibold ${active ? 'text-green-800' : 'text-slate-700'}`}>
                  {active ? 'Full access' : 'Free plan'}
                </span>
                {active && days !== null && (
                  <span className="text-xs text-green-600 ml-2">· {days} day{days !== 1 ? 's' : ''} remaining</span>
                )}
                {student.subscription_expires_at && !active && (
                  <span className="text-xs text-slate-400 ml-2">· expired {fmtDate(student.subscription_expires_at)}</span>
                )}
              </div>
              {active && (
                <button
                  onClick={() => patch({
                    subscription_tier: 'free',
                    subscription_plan: null,
                    subscription_expires_at: null,
                  }, 'revoke')}
                  disabled={saving === 'revoke'}
                  className="text-xs text-red-600 hover:text-red-800 font-medium disabled:opacity-40"
                >
                  {saving === 'revoke' ? '…' : 'Revoke'}
                </button>
              )}
            </div>

            {/* Grant buttons */}
            <div className="grid grid-cols-3 gap-2 mb-3">
              {[
                { label: '30 days', days: 30, plan: '30days' },
                { label: '90 days', days: 90, plan: '90days' },
              ].map(opt => (
                <button
                  key={opt.days}
                  onClick={() => patch({
                    subscription_tier: 'paid',
                    subscription_plan: opt.plan as '30days' | '90days',
                    subscription_expires_at: addDays(opt.days),
                  }, `grant${opt.days}`)}
                  disabled={!!saving}
                  className="py-2 rounded-lg text-sm font-medium bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-40 transition-all"
                >
                  {saving === `grant${opt.days}` ? '…' : `Grant ${opt.label}`}
                </button>
              ))}

              <div className="flex gap-1">
                <input
                  type="number"
                  min={1}
                  value={customDays}
                  onChange={e => setCustomDays(e.target.value)}
                  className="w-16 px-2 py-2 text-sm border border-slate-200 rounded-lg text-center focus:outline-none focus:ring-2 focus:ring-blue-200"
                />
                <button
                  onClick={() => {
                    const d = parseInt(customDays)
                    if (!d || d < 1) return
                    patch({
                      subscription_tier: 'paid',
                      subscription_plan: null,
                      subscription_expires_at: addDays(d),
                    }, 'grantCustom')
                  }}
                  disabled={!!saving}
                  className="flex-1 py-2 rounded-lg text-sm font-medium bg-slate-700 text-white hover:bg-slate-600 disabled:opacity-40 transition-all"
                >
                  {saving === 'grantCustom' ? '…' : 'Days'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ── Main Page ───────────────────────────────────────────────────────────────

export default function StudentsPage() {
  const [students, setStudents] = useState<Student[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filterExam, setFilterExam] = useState('')
  const [filterTier, setFilterTier] = useState('')
  const [editing, setEditing] = useState<Student | null>(null)

  useEffect(() => {
    fetch('/api/admin/students')
      .then(r => r.json())
      .then(d => { setStudents(d.students ?? []); setLoading(false) })
  }, [])

  function handleSaved(id: string, update: Partial<Student>) {
    setStudents(prev => prev.map(s => s.id === id ? { ...s, ...update } : s))
    if (editing?.id === id) setEditing(prev => prev ? { ...prev, ...update } : prev)
  }

  const now = Date.now()
  const stats = useMemo(() => {
    const paid = students.filter(isActive)
    const thisMonth = new Date(); thisMonth.setDate(1); thisMonth.setHours(0, 0, 0, 0)
    return {
      total: students.length,
      paid: paid.length,
      free: students.length - paid.length,
      newThisMonth: students.filter(s => new Date(s.created_at) >= thisMonth).length,
      cpl: students.filter(s => s.exam_type === 'CPL').length,
      composite: students.filter(s => s.exam_type === 'Composite').length,
      atpl: students.filter(s => s.exam_type === 'ATPL').length,
      unset: students.filter(s => !s.exam_type).length,
    }
  }, [students])

  const filtered = useMemo(() => students.filter(s => {
    if (search && !s.email?.toLowerCase().includes(search.toLowerCase()) && !s.full_name?.toLowerCase().includes(search.toLowerCase())) return false
    if (filterExam && s.exam_type !== filterExam) return false
    if (filterTier === 'paid' && !isActive(s)) return false
    if (filterTier === 'free' && isActive(s)) return false
    return true
  }), [students, search, filterExam, filterTier])

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3 mb-6">
        {[
          { label: 'Total', value: stats.total, color: 'text-slate-800' },
          { label: 'Paid', value: stats.paid, color: 'text-green-700' },
          { label: 'Free', value: stats.free, color: 'text-slate-500' },
          { label: 'New this month', value: stats.newThisMonth, color: 'text-blue-700' },
          { label: 'CPL', value: stats.cpl, color: 'text-blue-600' },
          { label: 'Composite', value: stats.composite, color: 'text-purple-600' },
          { label: 'ATPL', value: stats.atpl, color: 'text-emerald-600' },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-xl border border-slate-200 p-3 text-center">
            <div className={`text-2xl font-bold ${s.color}`}>{s.value}</div>
            <div className="text-xs text-slate-500 mt-0.5">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2 mb-4">
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search by email or name…"
          className="flex-1 min-w-48 text-sm border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-200"
        />
        <select value={filterExam} onChange={e => setFilterExam(e.target.value)}
          className="text-sm border border-slate-200 rounded-lg px-3 py-2 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-200">
          <option value="">All exam types</option>
          <option value="CPL">CPL</option>
          <option value="Composite">Composite</option>
          <option value="ATPL">ATPL</option>
        </select>
        <select value={filterTier} onChange={e => setFilterTier(e.target.value)}
          className="text-sm border border-slate-200 rounded-lg px-3 py-2 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-200">
          <option value="">All tiers</option>
          <option value="paid">Paid (active)</option>
          <option value="free">Free / expired</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        {loading ? (
          <div className="py-16 text-center text-sm text-slate-400 animate-pulse">Loading students…</div>
        ) : filtered.length === 0 ? (
          <div className="py-16 text-center text-sm text-slate-400">No students match.</div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50">
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Student</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Exam</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Subscription</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Sessions</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider hidden sm:table-cell">Joined</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filtered.map(s => {
                const active = isActive(s)
                const days = daysLeft(s.subscription_expires_at)
                return (
                  <tr key={s.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="font-medium text-slate-800 truncate max-w-xs">{s.email}</div>
                      {s.full_name && <div className="text-xs text-slate-400 mt-0.5">{s.full_name}</div>}
                    </td>
                    <td className="px-4 py-3">
                      {s.exam_type ? (
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${EXAM_COLORS[s.exam_type]}`}>
                          {s.exam_type}
                        </span>
                      ) : (
                        <span className="text-xs text-slate-300 italic">Not set</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {active ? (
                        <div>
                          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700">
                            Paid
                          </span>
                          {days !== null && (
                            <span className="text-xs text-slate-400 ml-2">{days}d left</span>
                          )}
                        </div>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-500">
                          Free
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {s.session_count > 0 ? (
                        <span className="font-medium text-slate-700">{s.session_count}</span>
                      ) : (
                        <span className="text-slate-300">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-xs text-slate-400 hidden sm:table-cell">
                      {fmtDate(s.created_at)}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => setEditing(s)}
                        className="text-xs font-medium text-blue-600 hover:text-blue-800 px-3 py-1.5 rounded-lg border border-blue-100 hover:border-blue-300 hover:bg-blue-50 transition-all"
                      >
                        Edit
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        )}
      </div>

      {filtered.length > 0 && (
        <p className="text-xs text-slate-400 mt-3 text-right">{filtered.length} of {students.length} students</p>
      )}

      {editing && (
        <EditModal
          student={editing}
          onClose={() => setEditing(null)}
          onSaved={update => handleSaved(editing.id, update)}
        />
      )}
    </div>
  )
}
