'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Subject, Topic, GeneratedQuestion } from '@/lib/types'
import { IconSparkles, IconCheck, IconTrash, IconEdit, IconX } from '@tabler/icons-react'

interface EditableQuestion extends GeneratedQuestion {
  editing?: boolean
}

export default function GeneratePage() {
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [topics, setTopics] = useState<Topic[]>([])
  const [subjectId, setSubjectId] = useState('')
  const [subjectName, setSubjectName] = useState('')
  const [topicId, setTopicId] = useState('')
  const [topicName, setTopicName] = useState('')
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium')
  const [count, setCount] = useState(5)
  const [context, setContext] = useState('')
  const [generating, setGenerating] = useState(false)
  const [generated, setGenerated] = useState<EditableQuestion[]>([])
  const [error, setError] = useState('')
  const [saving, setSaving] = useState<Record<number, boolean>>({})
  const [saved, setSaved] = useState<Record<number, boolean>>({})

  useEffect(() => {
    supabase.from('subjects').select('*').order('sort_order').then(({ data }) => setSubjects(data || []))
  }, [])

  useEffect(() => {
    if (!subjectId) { setTopics([]); setTopicId(''); setTopicName(''); return }
    supabase.from('topics').select('*').eq('subject_id', subjectId).order('sort_order').then(({ data }) => {
      setTopics(data || [])
    })
    const sub = subjects.find(s => s.id === subjectId)
    setSubjectName(sub?.name || '')
  }, [subjectId, subjects])

  async function generate() {
    if (!subjectId || !topicId) {
      setError('Please select a subject and topic')
      return
    }
    setGenerating(true)
    setError('')
    setGenerated([])

    const res = await fetch('/api/admin/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ subject: subjectName, topic: topicName, difficulty, count, context }),
    })
    const data = await res.json()
    if (data.error) {
      setError(data.error)
    } else {
      setGenerated(data.questions)
    }
    setGenerating(false)
  }

  async function approve(index: number) {
    const q = generated[index]
    setSaving(prev => ({ ...prev, [index]: true }))

    const { data: newQ } = await supabase
      .from('questions')
      .insert({
        subject_id: subjectId,
        topic_id: topicId,
        question_text: q.question_text,
        difficulty,
        explanation: q.explanation,
        source_type: 'ai',
        active: true,
      })
      .select('id')
      .single()

    if (newQ) {
      const optRows = (['A', 'B', 'C', 'D'] as const).map(letter => ({
        question_id: newQ.id,
        option_letter: letter,
        option_text: q.options[letter],
        is_correct: letter === q.correct_option,
      }))
      await supabase.from('question_options').insert(optRows)
    }

    setSaving(prev => ({ ...prev, [index]: false }))
    setSaved(prev => ({ ...prev, [index]: true }))
  }

  function discard(index: number) {
    setGenerated(prev => prev.filter((_, i) => i !== index))
    setSaved(prev => {
      const next = { ...prev }
      delete next[index]
      return next
    })
  }

  function toggleEdit(index: number) {
    setGenerated(prev => prev.map((q, i) => i === index ? { ...q, editing: !q.editing } : q))
  }

  function updateField(index: number, field: keyof GeneratedQuestion, value: unknown) {
    setGenerated(prev => prev.map((q, i) => i === index ? { ...q, [field]: value } : q))
  }

  function updateOption(index: number, letter: 'A' | 'B' | 'C' | 'D', value: string) {
    setGenerated(prev => prev.map((q, i) =>
      i === index ? { ...q, options: { ...q.options, [letter]: value } } : q
    ))
  }

  return (
    <div className="px-4 py-6">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-xl font-bold text-slate-800 mb-6">AI Question Generator</h1>

        <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-5 mb-6">
          {/* Subject */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Subject *</label>
              <select
                value={subjectId}
                onChange={e => { setSubjectId(e.target.value); setTopicId(''); setTopicName('') }}
                className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm text-slate-800 bg-white"
              >
                <option value="">Select subject…</option>
                {subjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Topic *</label>
              <select
                value={topicId}
                onChange={e => {
                  setTopicId(e.target.value)
                  const t = topics.find(t => t.id === e.target.value)
                  setTopicName(t?.name || '')
                }}
                className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm text-slate-800 bg-white"
                disabled={!subjectId}
              >
                <option value="">Select topic…</option>
                {topics.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
              </select>
            </div>
          </div>

          {/* Difficulty */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Difficulty</label>
            <div className="flex gap-2">
              {(['easy', 'medium', 'hard'] as const).map(d => (
                <button
                  key={d}
                  onClick={() => setDifficulty(d)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium border-2 capitalize transition-all ${
                    difficulty === d ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-slate-200 text-slate-600'
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>

          {/* Count */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Generate Count</label>
            <div className="flex gap-2">
              {[5, 10, 20].map(n => (
                <button
                  key={n}
                  onClick={() => setCount(n)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium border-2 transition-all ${
                    count === n ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-slate-200 text-slate-600'
                  }`}
                >
                  {n}
                </button>
              ))}
            </div>
          </div>

          {/* Context */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Additional Context (optional)</label>
            <textarea
              value={context}
              onChange={e => setContext(e.target.value)}
              rows={2}
              className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm text-slate-800 resize-y"
              placeholder="Any specific focus areas, regulations, or guidance…"
            />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <button
            onClick={generate}
            disabled={generating}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-white text-sm disabled:opacity-50 transition-all"
            style={{ backgroundColor: '#185FA5' }}
          >
            <IconSparkles size={16} />
            {generating ? 'Generating…' : 'Generate Questions'}
          </button>
        </div>

        {/* Generated questions */}
        {generated.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold text-slate-700">{generated.length} questions generated</h2>
              <span className="text-xs text-slate-400">Click Approve to save to database</span>
            </div>
            {generated.map((q, index) => (
              <div
                key={index}
                className={`bg-white rounded-xl border p-5 transition-all ${
                  saved[index] ? 'border-green-300 opacity-75' : 'border-slate-200'
                }`}
              >
                {q.editing ? (
                  <div className="space-y-3">
                    <textarea
                      value={q.question_text}
                      onChange={e => updateField(index, 'question_text', e.target.value)}
                      rows={3}
                      className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm"
                    />
                    {(['A', 'B', 'C', 'D'] as const).map(letter => (
                      <div key={letter} className="flex items-center gap-2">
                        <input
                          type="radio"
                          checked={q.correct_option === letter}
                          onChange={() => updateField(index, 'correct_option', letter)}
                          className="accent-blue-600"
                        />
                        <span className="w-5 text-xs font-bold text-slate-500">{letter}</span>
                        <input
                          type="text"
                          value={q.options[letter]}
                          onChange={e => updateOption(index, letter, e.target.value)}
                          className="flex-1 border border-slate-200 rounded-lg px-3 py-1.5 text-sm"
                        />
                      </div>
                    ))}
                    <textarea
                      value={q.explanation}
                      onChange={e => updateField(index, 'explanation', e.target.value)}
                      rows={2}
                      className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm"
                      placeholder="Explanation…"
                    />
                    <button
                      onClick={() => toggleEdit(index)}
                      className="text-xs text-blue-600 hover:underline"
                    >
                      Done editing
                    </button>
                  </div>
                ) : (
                  <>
                    <p className="text-sm font-medium text-slate-800 mb-3">{q.question_text}</p>
                    <div className="space-y-1.5 mb-3">
                      {(['A', 'B', 'C', 'D'] as const).map(letter => (
                        <div
                          key={letter}
                          className={`flex items-start gap-2 p-2 rounded-lg text-sm ${
                            letter === q.correct_option
                              ? 'bg-green-50 text-green-800 font-medium'
                              : 'text-slate-600'
                          }`}
                        >
                          <span className="font-bold w-4 flex-shrink-0">{letter}.</span>
                          <span>{q.options[letter]}</span>
                        </div>
                      ))}
                    </div>
                    {q.explanation && (
                      <p className="text-xs text-slate-500 border-t border-slate-100 pt-2">
                        {q.explanation}
                      </p>
                    )}
                  </>
                )}

                <div className="flex items-center gap-2 mt-4 pt-3 border-t border-slate-100">
                  {saved[index] ? (
                    <span className="flex items-center gap-1 text-xs text-green-600 font-medium">
                      <IconCheck size={14} /> Saved to database
                    </span>
                  ) : (
                    <>
                      <button
                        onClick={() => approve(index)}
                        disabled={saving[index]}
                        className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-green-500 text-white text-xs font-medium hover:bg-green-600 disabled:opacity-50"
                      >
                        <IconCheck size={13} />
                        {saving[index] ? 'Saving…' : 'Approve'}
                      </button>
                      <button
                        onClick={() => toggleEdit(index)}
                        className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-200 text-slate-600 text-xs font-medium hover:border-slate-300"
                      >
                        <IconEdit size={13} />
                        Edit
                      </button>
                      <button
                        onClick={() => discard(index)}
                        className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-red-200 text-red-500 text-xs font-medium hover:border-red-300"
                      >
                        <IconTrash size={13} />
                        Discard
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
