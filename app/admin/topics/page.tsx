'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { Subject } from '@/lib/types'
import { IconPlus, IconEdit, IconTrash, IconTags } from '@tabler/icons-react'

type TopicWithData = {
  id: string
  subject_id: string
  name: string
  sort_order: number
  subject: { name: string; code: string } | null
  questions: { id: string }[]
}

export default function TopicsPage() {
  const [topics, setTopics] = useState<TopicWithData[]>([])
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [filterSubject, setFilterSubject] = useState('')
  const [loading, setLoading] = useState(true)

  async function load() {
    setLoading(true)
    let query = supabase
      .from('topics')
      .select('*, subject:subjects(name,code), questions:questions(id)')
      .order('sort_order')
    if (filterSubject) query = query.eq('subject_id', filterSubject)
    const { data } = await query
    setTopics((data as TopicWithData[]) || [])
    setLoading(false)
  }

  useEffect(() => {
    supabase.from('subjects').select('*').order('sort_order').then(({ data }) => setSubjects(data || []))
  }, [])

  useEffect(() => { load() }, [filterSubject]) // eslint-disable-line react-hooks/exhaustive-deps

  async function deleteTopic(topic: TopicWithData) {
    const n = topic.questions?.length ?? 0
    const msg = `Delete '${topic.name}'? ${n} question${n !== 1 ? 's' : ''} will lose their topic tag but will not be deleted.`
    if (!confirm(msg)) return
    await supabase.from('topics').delete().eq('id', topic.id)
    load()
  }

  const stats = {
    total: topics.length,
    totalQuestions: topics.reduce((sum, t) => sum + (t.questions?.length ?? 0), 0),
    withQuestions: topics.filter(t => (t.questions?.length ?? 0) > 0).length,
  }

  return (
    <div className="px-4 py-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-xl font-bold text-slate-800">Topics</h1>
          <Link
            href="/admin/topics/new"
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium text-white transition-all"
            style={{ backgroundColor: 'var(--clr-primary)' }}
          >
            <IconPlus size={15} />
            New Topic
          </Link>
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
          {[
            { label: 'Total Topics', value: stats.total, color: 'text-slate-800' },
            { label: 'With Questions', value: stats.withQuestions, color: 'text-green-600' },
            { label: 'Total Questions Tagged', value: stats.totalQuestions, color: 'text-blue-600' },
          ].map(s => (
            <div key={s.label} className="bg-white rounded-xl border border-slate-200 p-4">
              <div className={`text-2xl font-bold ${s.color}`}>{s.value}</div>
              <div className="text-xs text-slate-500 mt-0.5">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Filter */}
        <div className="flex flex-wrap gap-3 mb-4">
          <select
            value={filterSubject}
            onChange={e => setFilterSubject(e.target.value)}
            className="text-sm border border-slate-200 rounded-lg px-3 py-2 bg-white text-slate-700"
          >
            <option value="">All Subjects</option>
            {subjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
          </select>
        </div>

        {/* Topics list */}
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <div className="animate-spin w-6 h-6 border-4 border-blue-500 border-t-transparent rounded-full" />
            </div>
          ) : topics.length === 0 ? (
            <div className="text-center py-16 text-slate-400">
              <IconTags size={32} className="mx-auto mb-2 opacity-40" />
              <p>No topics found.</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {/* Table header */}
              <div className="hidden sm:grid grid-cols-[1fr_auto_auto_auto_auto] gap-4 px-4 py-2 bg-slate-50 text-xs font-medium text-slate-500 uppercase tracking-wide">
                <span>Topic / Chapter</span>
                <span>Subject</span>
                <span>Questions</span>
                <span>Order</span>
                <span></span>
              </div>
              {topics.map(topic => {
                const qCount = topic.questions?.length ?? 0
                return (
                  <div key={topic.id} className="p-4 flex items-center gap-3 hover:bg-slate-50 transition-colors">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-800 truncate">{topic.name}</p>
                      {/* Mobile: show subject inline */}
                      {topic.subject && (
                        <p className="sm:hidden text-xs text-slate-500 mt-0.5">{topic.subject.name}</p>
                      )}
                    </div>
                    <div className="hidden sm:block flex-shrink-0">
                      {topic.subject ? (
                        <span className="text-xs px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 font-medium">
                          {topic.subject.code}
                        </span>
                      ) : (
                        <span className="text-xs text-slate-400">—</span>
                      )}
                    </div>
                    <div className="hidden sm:block flex-shrink-0 w-20 text-center">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                        qCount > 0 ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'
                      }`}>
                        {qCount} q
                      </span>
                    </div>
                    <div className="hidden sm:block flex-shrink-0 w-8 text-center text-xs text-slate-500">
                      {topic.sort_order}
                    </div>
                    <div className="flex items-center gap-1 flex-shrink-0">
                      <Link
                        href={`/admin/topics/${topic.id}/edit`}
                        className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 transition-colors"
                        title="Edit"
                      >
                        <IconEdit size={16} />
                      </Link>
                      <button
                        onClick={() => deleteTopic(topic)}
                        className="p-1.5 rounded-lg text-red-400 hover:bg-red-50 transition-colors"
                        title="Delete"
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
      </div>
    </div>
  )
}
