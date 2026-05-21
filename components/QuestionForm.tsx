'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { Question, Subject, Topic, SourceBook } from '@/lib/types'

interface QuestionFormProps {
  question?: Question & { options?: { option_letter: string; option_text: string; is_correct: boolean }[] }
}

export default function QuestionForm({ question }: QuestionFormProps) {
  const router = useRouter()
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [topics, setTopics] = useState<Topic[]>([])
  const [sourceBooks, setSourceBooks] = useState<SourceBook[]>([])
  const [saving, setSaving] = useState(false)

  const [subjectId, setSubjectId] = useState(question?.subject_id || '')
  const [topicId, setTopicId] = useState(question?.topic_id || '')
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>(question?.difficulty || 'medium')
  const [questionText, setQuestionText] = useState(question?.question_text || '')
  const [options, setOptions] = useState<Record<'A' | 'B' | 'C' | 'D', string>>({
    A: question?.options?.find(o => o.option_letter === 'A')?.option_text || '',
    B: question?.options?.find(o => o.option_letter === 'B')?.option_text || '',
    C: question?.options?.find(o => o.option_letter === 'C')?.option_text || '',
    D: question?.options?.find(o => o.option_letter === 'D')?.option_text || '',
  })
  const [correctAnswer, setCorrectAnswer] = useState<'A' | 'B' | 'C' | 'D'>(
    (question?.options?.find(o => o.is_correct)?.option_letter as 'A' | 'B' | 'C' | 'D') || 'A'
  )
  const [explanation, setExplanation] = useState(question?.explanation || '')
  const [active, setActive] = useState(question?.active ?? false)

  useEffect(() => {
    supabase.from('subjects').select('*').order('sort_order').then(({ data }) => setSubjects(data || []))
  }, [])

  useEffect(() => {
    if (!subjectId) { setTopics([]); setSourceBooks([]); return }
    Promise.all([
      supabase.from('topics').select('*').eq('subject_id', subjectId).order('sort_order'),
      supabase.from('source_books').select('*').eq('subject_id', subjectId),
    ]).then(([{ data: tops }, { data: books }]) => {
      setTopics(tops || [])
      setSourceBooks(books || [])
    })
  }, [subjectId])

  async function save() {
    if (!subjectId || !questionText.trim() || !options.A || !options.B || !options.C || !options.D) {
      alert('Please fill in all required fields')
      return
    }
    setSaving(true)

    const payload = {
      subject_id: subjectId,
      topic_id: topicId || null,
      question_text: questionText.trim(),
      difficulty,
      explanation: explanation.trim() || null,
      source_type: question?.source_type || 'manual',
      active,
    }

    let qId = question?.id
    if (qId) {
      await supabase.from('questions').update(payload).eq('id', qId)
      await supabase.from('question_options').delete().eq('question_id', qId)
    } else {
      const { data } = await supabase.from('questions').insert(payload).select('id').single()
      qId = data?.id
    }

    if (qId) {
      const optRows = (['A', 'B', 'C', 'D'] as const).map(letter => ({
        question_id: qId,
        option_letter: letter,
        option_text: options[letter],
        is_correct: letter === correctAnswer,
      }))
      await supabase.from('question_options').insert(optRows)
    }

    setSaving(false)
    router.push('/admin')
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-5">
      <h1 className="text-xl font-bold text-slate-800">
        {question ? 'Edit Question' : 'New Question'}
      </h1>

      {/* Subject */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Subject *</label>
        <select
          value={subjectId}
          onChange={e => { setSubjectId(e.target.value); setTopicId('') }}
          className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm text-slate-800 bg-white"
        >
          <option value="">Select subject…</option>
          {subjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
        </select>
      </div>

      {/* Topic */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Topic</label>
        <select
          value={topicId}
          onChange={e => setTopicId(e.target.value)}
          className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm text-slate-800 bg-white"
          disabled={!subjectId}
        >
          <option value="">No topic</option>
          {topics.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
        </select>
      </div>

      {/* Difficulty */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Difficulty *</label>
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

      {/* Question text */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Question Text *</label>
        <textarea
          value={questionText}
          onChange={e => setQuestionText(e.target.value)}
          rows={4}
          className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm text-slate-800 resize-y"
          placeholder="Enter the question…"
        />
      </div>

      {/* Options */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">Answer Options *</label>
        <div className="space-y-2">
          {(['A', 'B', 'C', 'D'] as const).map(letter => (
            <div key={letter} className="flex items-center gap-2">
              <input
                type="radio"
                name="correct"
                checked={correctAnswer === letter}
                onChange={() => setCorrectAnswer(letter)}
                className="w-4 h-4 accent-blue-600"
              />
              <span className="w-5 text-sm font-bold text-slate-500">{letter}</span>
              <input
                type="text"
                value={options[letter]}
                onChange={e => setOptions(prev => ({ ...prev, [letter]: e.target.value }))}
                className="flex-1 border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-800"
                placeholder={`Option ${letter}`}
              />
            </div>
          ))}
          <p className="text-xs text-slate-400 pl-6">Select the radio button next to the correct answer</p>
        </div>
      </div>

      {/* Explanation */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Explanation</label>
        <textarea
          value={explanation}
          onChange={e => setExplanation(e.target.value)}
          rows={3}
          className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm text-slate-800 resize-y"
          placeholder="Why is this answer correct?"
        />
      </div>

      {/* Status */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => setActive(!active)}
          className={`relative w-11 h-6 rounded-full transition-colors ${active ? 'bg-green-500' : 'bg-slate-300'}`}
        >
          <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all ${active ? 'left-5' : 'left-0.5'}`} />
        </button>
        <span className="text-sm text-slate-700">
          {active ? 'Published (active)' : 'Draft (inactive)'}
        </span>
      </div>

      {/* Save */}
      <div className="flex gap-3 pt-2">
        <button
          onClick={save}
          disabled={saving}
          className="px-6 py-2.5 rounded-xl font-semibold text-white text-sm disabled:opacity-50"
          style={{ backgroundColor: '#185FA5' }}
        >
          {saving ? 'Saving…' : 'Save Question'}
        </button>
        <button
          onClick={() => router.push('/admin')}
          className="px-6 py-2.5 rounded-xl font-semibold text-slate-600 text-sm border border-slate-200 hover:border-slate-300"
        >
          Cancel
        </button>
      </div>
    </div>
  )
}
