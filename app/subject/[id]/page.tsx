'use client'
import { useEffect, useState, use } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { Subject, Topic } from '@/lib/types'
import SubjectIcon from '@/components/SubjectIcon'

type Mode = 'practice' | 'mock'
type Difficulty = 'all' | 'easy' | 'medium' | 'hard'
type QuestionCount = 5 | 10 | 20 | 50 | 100

export default function SubjectPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const [subject, setSubject] = useState<Subject | null>(null)
  const [topics, setTopics] = useState<Topic[]>([])
  const [selectedTopics, setSelectedTopics] = useState<string[]>([])
  const [mode, setMode] = useState<Mode>('practice')
  const [difficulty, setDifficulty] = useState<Difficulty>('all')
  const [questionCount, setQuestionCount] = useState<QuestionCount>(5)
  const [loading, setLoading] = useState(true)
  const [starting, setStarting] = useState(false)

  useEffect(() => {
    async function load() {
      const [{ data: sub }, { data: tops }] = await Promise.all([
        supabase.from('subjects').select('*').eq('id', id).single(),
        supabase.from('topics').select('*').eq('subject_id', id).order('sort_order'),
      ])
      setSubject(sub)
      setTopics(tops || [])
      setSelectedTopics((tops || []).map(t => t.id))
      setLoading(false)
    }
    load()
  }, [id])

  function toggleTopic(topicId: string) {
    setSelectedTopics(prev =>
      prev.includes(topicId) ? prev.filter(t => t !== topicId) : [...prev, topicId]
    )
  }

  async function startSession() {
    setStarting(true)
    const res = await fetch('/api/session/start', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        subjectId: id,
        mode,
        difficulty,
        questionCount,
        topicIds: selectedTopics,
      }),
    })
    const data = await res.json()
    if (data.sessionId) {
      router.push(`/session/${data.sessionId}`)
    } else {
      alert(data.error || 'Failed to start session')
      setStarting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full" />
      </div>
    )
  }

  if (!subject) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-slate-500">Subject not found.</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-white border-b border-slate-200 px-4 py-3">
        <div className="max-w-3xl mx-auto flex items-center gap-3">
          <Link href="/" className="text-slate-400 hover:text-slate-600 transition-colors text-sm">
            ← All Subjects
          </Link>
        </div>
      </header>

      <main className="flex-1 px-4 py-8">
        <div className="max-w-3xl mx-auto">
          {/* Subject header */}
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#EBF4FF' }}>
              <SubjectIcon name={subject.icon_name} size={24} className="text-[#185FA5]" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">{subject.name}</h1>
              {subject.description && (
                <p className="text-slate-500 text-sm mt-0.5">{subject.description}</p>
              )}
            </div>
          </div>

          <div className="space-y-6">
            {/* Mode */}
            <div className="bg-white rounded-xl border border-slate-200 p-5">
              <h2 className="font-semibold text-slate-700 mb-3">Session Mode</h2>
              <div className="grid grid-cols-2 gap-3">
                {(['practice', 'mock'] as Mode[]).map(m => (
                  <button
                    key={m}
                    onClick={() => setMode(m)}
                    className={`p-4 rounded-lg border-2 text-left transition-all ${
                      mode === m
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="font-semibold text-slate-800 capitalize">{m === 'practice' ? 'Practice' : 'Mock Exam'}</div>
                    <div className="text-xs text-slate-500 mt-1">
                      {m === 'practice' ? 'Immediate feedback after each answer' : 'Timed, no feedback until end'}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Difficulty */}
            <div className="bg-white rounded-xl border border-slate-200 p-5">
              <h2 className="font-semibold text-slate-700 mb-3">Difficulty</h2>
              <div className="flex flex-wrap gap-2">
                {(['all', 'easy', 'medium', 'hard'] as Difficulty[]).map(d => (
                  <button
                    key={d}
                    onClick={() => setDifficulty(d)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium border-2 transition-all capitalize ${
                      difficulty === d
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-slate-200 text-slate-600 hover:border-slate-300'
                    }`}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>

            {/* Question count */}
            <div className="bg-white rounded-xl border border-slate-200 p-5">
              <h2 className="font-semibold text-slate-700 mb-3">Number of Questions</h2>
              <div className="flex gap-2">
                {([5, 10, 20, 50, 100] as QuestionCount[]).map(n => (
                  <button
                    key={n}
                    onClick={() => setQuestionCount(n)}
                    className={`px-5 py-2 rounded-lg text-sm font-medium border-2 transition-all ${
                      questionCount === n
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-slate-200 text-slate-600 hover:border-slate-300'
                    }`}
                  >
                    {n}
                  </button>
                ))}
              </div>
            </div>

            {/* Topics */}
            {topics.length > 0 && (
              <div className="bg-white rounded-xl border border-slate-200 p-5">
                <div className="flex items-center justify-between mb-3">
                  <h2 className="font-semibold text-slate-700">Topics</h2>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setSelectedTopics(topics.map(t => t.id))}
                      className="text-xs text-blue-600 hover:underline"
                    >
                      All
                    </button>
                    <span className="text-slate-300">|</span>
                    <button
                      onClick={() => setSelectedTopics([])}
                      className="text-xs text-blue-600 hover:underline"
                    >
                      None
                    </button>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  {topics.map(topic => (
                    <button
                      key={topic.id}
                      onClick={() => toggleTopic(topic.id)}
                      className={`px-3 py-1.5 rounded-full text-sm border transition-all ${
                        selectedTopics.includes(topic.id)
                          ? 'border-blue-400 text-blue-700 font-medium'
                          : 'border-slate-200 text-slate-500'
                      }`}
                      style={selectedTopics.includes(topic.id) ? { backgroundColor: '#EBF4FF' } : {}}
                    >
                      {topic.name}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Start button */}
            <button
              onClick={startSession}
              disabled={starting || selectedTopics.length === 0}
              className="w-full py-3.5 rounded-xl font-semibold text-white text-base transition-all disabled:opacity-50"
              style={{ backgroundColor: '#185FA5' }}
            >
              {starting ? 'Starting…' : `Start ${mode === 'practice' ? 'Practice' : 'Mock Exam'}`}
            </button>
          </div>
        </div>
      </main>
    </div>
  )
}
