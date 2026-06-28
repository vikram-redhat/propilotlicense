'use client'
import { useEffect, useState, use } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { Subject, Topic, SourceBook, Profile } from '@/lib/types'
import { isSubscribed } from '@/lib/subscription'
import UserMenu from '@/components/UserMenu'

type Scope = 'topic' | 'book' | 'book_chapter' | 'combined'
type Mode = 'practice' | 'mock'
type Difficulty = 'all' | 'basic' | 'advanced'
type QuestionCount = 10 | 50 | 100

function UpgradeModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4" onClick={onClose}>
      <div className="bg-white rounded-2xl p-7 max-w-sm w-full shadow-xl" onClick={e => e.stopPropagation()}>
        <div className="text-3xl mb-3">🔒</div>
        <h3 className="font-bold text-lg mb-1" style={{ color: '#0D1B2E' }}>Unlock full access</h3>
        <p className="text-sm mb-5 leading-relaxed" style={{ color: '#4A5E78' }}>
          This feature requires a paid plan. Get unlimited questions, mock exams,
          book/chapter sessions, and difficulty selection.
        </p>
        <div className="flex gap-2">
          <Link href="/pricing" className="flex-1 text-center rounded-xl py-2.5 text-sm font-semibold text-white" style={{ backgroundColor: '#185FA5', textDecoration: 'none' }}>
            View plans from ₹250 →
          </Link>
          <button onClick={onClose} className="px-4 py-2.5 rounded-xl text-sm border" style={{ color: '#4A5E78', borderColor: '#D4E1F0' }}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}

function Chip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      style={{
        flex: 1, padding: '10px 0', borderRadius: 10,
        border: `1.5px solid ${active ? '#185FA5' : '#D4E1F0'}`,
        background: active ? '#E8F0FB' : '#F8FAFF',
        fontFamily: 'var(--font-outfit),sans-serif', fontSize: 13, fontWeight: 600,
        color: active ? '#185FA5' : '#4A5E78', cursor: 'pointer',
      }}
    >
      {children}
    </button>
  )
}

function Pill({ active, onClick, locked, children }: { active: boolean; onClick: () => void; locked?: boolean; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: '8px 15px', borderRadius: 20,
        border: `1.5px solid ${active ? '#185FA5' : '#D4E1F0'}`,
        background: active ? '#E8F0FB' : '#F8FAFF',
        fontSize: 13, fontWeight: 500,
        color: active ? '#185FA5' : locked ? '#D4E1F0' : '#4A5E78',
        cursor: locked ? 'default' : 'pointer',
        opacity: locked ? 0.5 : 1,
      }}
    >
      {children}
    </button>
  )
}

export default function SessionConfigPage({ params }: { params: Promise<{ licence: string; subjectId: string }> }) {
  const { licence, subjectId } = use(params)
  const router = useRouter()

  const [subject, setSubject]     = useState<Subject | null>(null)
  const [topics, setTopics]       = useState<Topic[]>([])
  const [books, setBooks]         = useState<SourceBook[]>([])
  const [profile, setProfile]     = useState<Profile | null>(null)
  const [isAdmin, setIsAdmin]     = useState(false)
  const [loading, setLoading]     = useState(true)
  const [starting, setStarting]   = useState(false)
  const [showUpgrade, setShowUpgrade] = useState(false)

  const [chapters, setChapters]               = useState<{ id: string; chapter_number: number; chapter_name: string }[]>([])
  const [scope, setScope]                     = useState<Scope>('combined')
  const [selectedTopicId, setSelectedTopicId] = useState('')
  const [selectedBookId, setSelectedBookId]   = useState('')
  const [selectedChapterId, setSelectedChapterId] = useState('')
  const [mode, setMode]           = useState<Mode>('practice')
  const [difficulty, setDifficulty] = useState<Difficulty>('all')
  const [questionCount, setQuestionCount] = useState<QuestionCount>(10)

  const subscribed = isAdmin || isSubscribed(profile)

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      const adminUser = user?.user_metadata?.is_admin === true
      setIsAdmin(adminUser)
      const [{ data: sub }, { data: tops }, { data: bks }, profileRes] = await Promise.all([
        supabase.from('subjects').select('*').eq('id', subjectId).single(),
        supabase.from('topics').select('*').eq('subject_id', subjectId).order('sort_order'),
        supabase.from('source_books').select('*').eq('subject_id', subjectId).order('sort_order'),
        user ? supabase.from('profiles').select('*').eq('id', user.id).single() : Promise.resolve({ data: null }),
      ])
      setSubject(sub)
      setTopics(tops || [])
      setBooks(bks || [])
      setProfile(profileRes.data)

      const userSubscribed = adminUser || isSubscribed(profileRes.data)
      if (!userSubscribed) {
        setScope('combined'); setMode('practice'); setDifficulty('all'); setQuestionCount(10)
      } else {
        setQuestionCount(50)
        if (tops && tops.length > 0) setSelectedTopicId(tops[0].id)
      }
      setLoading(false)
    }
    load()
  }, [subjectId])

  useEffect(() => {
    if (!selectedBookId) { setChapters([]); setSelectedChapterId(''); return }
    supabase.from('chapters').select('id, chapter_number, chapter_name').eq('book_id', selectedBookId).order('sort_order')
      .then(({ data }) => setChapters(data || []))
  }, [selectedBookId])

  const effectiveScope: Scope = scope === 'book' && selectedChapterId ? 'book_chapter' : scope
  const canStart = scope === 'topic' ? !!selectedTopicId : scope === 'book' ? !!selectedBookId : true

  function locked() { setShowUpgrade(true) }

  function selectScope(s: 'topic' | 'book' | 'combined') {
    if ((s === 'topic' || s === 'book') && !subscribed) { locked(); return }
    setScope(prev => prev === s ? 'combined' : s)
  }

  async function startSession() {
    setStarting(true)
    const res = await fetch('/api/session/start', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        subjectId, licenceType: licence.toUpperCase(),
        scope: effectiveScope,
        topicId: scope === 'topic' ? selectedTopicId : null,
        sourceBookId: scope === 'book' ? selectedBookId : null,
        chapterId: effectiveScope === 'book_chapter' ? selectedChapterId : null,
        mode, difficulty, questionCount,
      }),
    })
    const data = await res.json()
    if (data.sessionId) {
      router.push(`/session/${data.sessionId}`)
    } else {
      const msg =
        data.error === 'free_tier_scope'  ? 'Upgrade to access this scope.' :
        data.error === 'free_tier_count'  ? 'Upgrade to use more than 10 questions.' :
        data.error === 'free_tier_mode'   ? 'Upgrade to access mock exam mode.' :
        data.error || 'Failed to start session'
      alert(msg)
      setStarting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#F8FAFF' }}>
        <div className="animate-spin w-8 h-8 border-4 border-t-transparent rounded-full" style={{ borderColor: '#185FA5', borderTopColor: 'transparent' }}/>
      </div>
    )
  }

  if (!subject) return <div className="min-h-screen flex items-center justify-center" style={{ color: '#4A5E78' }}>Subject not found.</div>

  const scopeCards: { key: 'topic' | 'book' | 'combined'; title: string; subtitle: string; requiresPro: boolean }[] = [
    { key: 'topic', title: 'By topic', subtitle: 'Target specific subject areas', requiresPro: true },
    { key: 'book', title: 'By book', subtitle: 'Practice from a specific source', requiresPro: true },
    { key: 'combined', title: 'Combined paper', subtitle: 'All topics, all books', requiresPro: false },
  ]

  return (
    <div style={{ minHeight: '100vh', background: '#F8FAFF', color: '#0D1B2E' }}>
      {showUpgrade && <UpgradeModal onClose={() => setShowUpgrade(false)} />}

      {/* Nav */}
      <nav style={{ position: 'sticky', top: 0, zIndex: 200, background: '#F8FAFF', borderBottom: '1px solid #D4E1F0' }}>
        <div className="px-5 sm:px-9 lg:px-[60px]" style={{ height: 54, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <button
              onClick={() => router.back()}
              style={{ width: 36, height: 36, borderRadius: '50%', border: '1px solid #D4E1F0', background: 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0D1B2E', flexShrink: 0 }}
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M9.5 3L5.5 7l4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </button>
            <div>
              <div style={{ fontFamily: 'var(--font-outfit),sans-serif', fontSize: 16, fontWeight: 700, color: '#0D1B2E', letterSpacing: '-0.3px', lineHeight: 1.2 }}>Configure session</div>
              <div style={{ fontSize: 12, color: '#4A5E78', marginTop: 1 }}>{subject.name} · {licence.toUpperCase()}</div>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            {!subscribed && (
              <Link href="/pricing" style={{ fontSize: 12, fontWeight: 600, padding: '5px 12px', borderRadius: 20, border: '1px solid #D4E1F0', color: '#EF9F27', textDecoration: 'none' }}>Upgrade</Link>
            )}
            <UserMenu />
          </div>
        </div>
      </nav>

      {/* Two-panel layout */}
      <div style={{ maxWidth: 900, margin: '0 auto', padding: '24px 16px 100px' }}>
        {!subscribed && (
          <div style={{ marginBottom: 20, padding: '10px 14px', background: '#FEF4DC', border: '1px solid #EF9F27', borderRadius: 10, fontSize: 13, color: '#9A6000', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
            <span><strong>Free plan:</strong> Combined paper · 10 questions · Practice only</span>
            <Link href="/pricing" style={{ fontSize: 12, fontWeight: 700, color: '#185FA5', textDecoration: 'none', whiteSpace: 'nowrap' }}>Upgrade →</Link>
          </div>
        )}

        <div className="flex flex-col lg:flex-row lg:items-start lg:gap-[52px]">

          {/* LEFT — Scope */}
          <div className="flex-1">
            <p style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: '0.9px', textTransform: 'uppercase', color: '#4A5E78', marginBottom: 10 }}>Scope</p>

            {scopeCards.map(({ key, title, subtitle, requiresPro }) => {
              const isLocked = requiresPro && !subscribed
              const isSelected = scope === key
              const isOpen = isSelected && key !== 'combined'
              return (
                <div
                  key={key}
                  onClick={() => selectScope(key)}
                  style={{
                    border: `1.5px solid ${isSelected ? '#185FA5' : '#D4E1F0'}`,
                    background: isSelected ? '#E8F0FB' : '#F8FAFF',
                    borderRadius: 13, padding: 14, marginBottom: 8, cursor: 'pointer',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 11 }}>
                      <div style={{ width: 32, height: 32, borderRadius: 8, background: isSelected ? '#185FA5' : '#EEF3FA', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        {key === 'topic' && (
                          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                            <circle cx="8" cy="8" r="5.5" stroke={isSelected ? '#fff' : '#4A5E78'} strokeWidth="1.5"/>
                            <circle cx="8" cy="8" r="2.5" fill={isSelected ? '#fff' : '#4A5E78'}/>
                          </svg>
                        )}
                        {key === 'book' && (
                          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                            <rect x="2.5" y="1.5" width="11" height="13" rx="1.5" stroke={isSelected ? '#fff' : '#4A5E78'} strokeWidth="1.5"/>
                            <path d="M5 5.5h6M5 8.5h6M5 11.5h3.5" stroke={isSelected ? '#fff' : '#4A5E78'} strokeWidth="1.2" strokeLinecap="round"/>
                          </svg>
                        )}
                        {key === 'combined' && (
                          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                            <path d="M2 8h12M8 2v12" stroke={isSelected ? '#fff' : '#4A5E78'} strokeWidth="1.6" strokeLinecap="round"/>
                            <rect x="1.5" y="1.5" width="13" height="13" rx="2" stroke={isSelected ? '#fff' : '#4A5E78'} strokeWidth="1.2" opacity="0.4"/>
                          </svg>
                        )}
                      </div>
                      <div>
                        <div style={{ fontFamily: 'var(--font-outfit),sans-serif', fontSize: 14, fontWeight: 600, color: isSelected ? '#185FA5' : '#0D1B2E' }}>
                          {title}{isLocked && <span style={{ marginLeft: 6, fontSize: 11, color: '#EF9F27' }}>🔒 Pro</span>}
                        </div>
                        <div style={{ fontSize: 12, color: '#4A5E78', marginTop: 1 }}>{subtitle}</div>
                      </div>
                    </div>
                    <div style={{ width: 18, height: 18, borderRadius: '50%', border: `1.5px solid ${isSelected ? '#185FA5' : '#D4E1F0'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      {isSelected && <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#185FA5' }}/>}
                    </div>
                  </div>

                  {/* Expand dropdown */}
                  {isOpen && (
                    <div onClick={e => e.stopPropagation()} style={{ marginTop: 13, paddingTop: 13, borderTop: '1px solid #D4E1F0' }}>
                      {key === 'topic' ? (
                        <>
                          <p style={{ fontSize: 10, fontWeight: 700, color: '#4A5E78', marginBottom: 7, letterSpacing: '0.6px', textTransform: 'uppercase' }}>Select subject area</p>
                          <div style={{ position: 'relative' }}>
                            <select
                              value={selectedTopicId}
                              onChange={e => setSelectedTopicId(e.target.value)}
                              style={{ width: '100%', padding: '10px 36px 10px 12px', borderRadius: 9, border: '1px solid #D4E1F0', background: '#F8FAFF', fontSize: 13.5, color: '#0D1B2E', cursor: 'pointer', outline: 'none', appearance: 'none' }}
                            >
                              <option value="">Select a topic…</option>
                              {topics.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                            </select>
                            <svg style={{ position: 'absolute', right: 11, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M3 4.5l3 3 3-3" stroke="#4A5E78" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/></svg>
                          </div>
                        </>
                      ) : key === 'book' ? (
                        <>
                          <p style={{ fontSize: 10, fontWeight: 700, color: '#4A5E78', marginBottom: 7, letterSpacing: '0.6px', textTransform: 'uppercase' }}>Select book</p>
                          <div style={{ position: 'relative' }}>
                            <select
                              value={selectedBookId}
                              onChange={e => { setSelectedBookId(e.target.value); setSelectedChapterId('') }}
                              style={{ width: '100%', padding: '10px 36px 10px 12px', borderRadius: 9, border: '1px solid #D4E1F0', background: '#F8FAFF', fontSize: 13.5, color: '#0D1B2E', cursor: 'pointer', outline: 'none', appearance: 'none' }}
                            >
                              <option value="">Select a book…</option>
                              {books.map(b => <option key={b.id} value={b.id}>{b.title}{b.author ? ` — ${b.author}` : ''}</option>)}
                            </select>
                            <svg style={{ position: 'absolute', right: 11, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M3 4.5l3 3 3-3" stroke="#4A5E78" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/></svg>
                          </div>
                          {selectedBookId && chapters.length > 0 && (
                            <div style={{ marginTop: 8, position: 'relative' }}>
                              <select
                                value={selectedChapterId}
                                onChange={e => setSelectedChapterId(e.target.value)}
                                style={{ width: '100%', padding: '10px 36px 10px 12px', borderRadius: 9, border: '1px solid #D4E1F0', background: '#F8FAFF', fontSize: 13.5, color: '#0D1B2E', cursor: 'pointer', outline: 'none', appearance: 'none' }}
                              >
                                <option value="">All chapters</option>
                                {chapters.map(c => <option key={c.id} value={c.id}>Ch. {c.chapter_number} — {c.chapter_name}</option>)}
                              </select>
                              <svg style={{ position: 'absolute', right: 11, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M3 4.5l3 3 3-3" stroke="#4A5E78" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/></svg>
                            </div>
                          )}
                        </>
                      ) : (
                        <p style={{ fontSize: 12.5, color: '#4A5E78', lineHeight: 1.6 }}>
                          Draws from all topics and books for this subject — ideal for a full-paper exam simulation.
                        </p>
                      )}
                    </div>
                  )}
                </div>
              )
            })}
          </div>

          {/* RIGHT — Options + Start (sticky on desktop) */}
          <div className="mt-6 lg:mt-0 lg:w-[310px] lg:shrink-0 lg:sticky lg:top-[90px]">

            <p style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: '0.9px', textTransform: 'uppercase', color: '#4A5E78', marginBottom: 10 }}>Mode</p>
            <div style={{ display: 'flex', gap: 8, marginBottom: 22 }}>
              <Chip active={mode === 'practice'} onClick={() => setMode('practice')}>Practice</Chip>
              <Chip active={mode === 'mock'} onClick={() => subscribed ? setMode('mock') : locked()}>
                Mock exam{!subscribed && ' 🔒'}
              </Chip>
            </div>

            <p style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: '0.9px', textTransform: 'uppercase', color: '#4A5E78', marginBottom: 10 }}>Difficulty</p>
            <div style={{ display: 'flex', gap: 7, flexWrap: 'wrap', marginBottom: 22 }}>
              <Pill active={difficulty === 'all'} onClick={() => setDifficulty('all')}>All</Pill>
              <Pill active={difficulty === 'basic'} locked={!subscribed} onClick={() => subscribed ? setDifficulty('basic') : locked()}>Basic</Pill>
              <Pill active={difficulty === 'advanced'} locked={!subscribed} onClick={() => subscribed ? setDifficulty('advanced') : locked()}>Advanced</Pill>
            </div>

            <p style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: '0.9px', textTransform: 'uppercase', color: '#4A5E78', marginBottom: 10 }}>Questions</p>
            <div style={{ display: 'flex', gap: 7, marginBottom: 28 }}>
              {([
                { val: 10 as QuestionCount, pro: false },
                { val: 50 as QuestionCount, pro: true },
                { val: 100 as QuestionCount, pro: true },
              ]).map(({ val, pro }) => {
                const isLocked = pro && !subscribed
                return (
                  <button
                    key={val}
                    onClick={() => isLocked ? locked() : setQuestionCount(val)}
                    style={{
                      flex: 1, padding: '9px 0', borderRadius: 10,
                      border: `1.5px solid ${questionCount === val ? '#185FA5' : '#D4E1F0'}`,
                      background: questionCount === val ? '#E8F0FB' : '#F8FAFF',
                      fontFamily: 'var(--font-outfit),sans-serif', fontSize: 14, fontWeight: 600,
                      color: questionCount === val ? '#185FA5' : isLocked ? '#D4E1F0' : '#4A5E78',
                      cursor: isLocked ? 'default' : 'pointer',
                      opacity: isLocked ? 0.5 : 1,
                    }}
                  >
                    {val}
                  </button>
                )
              })}
            </div>

            <button
              onClick={startSession}
              disabled={starting || !canStart}
              style={{
                width: '100%', padding: 15, background: '#EF9F27', color: '#fff', border: 'none',
                borderRadius: 13, fontFamily: 'var(--font-outfit),sans-serif', fontSize: 16, fontWeight: 700,
                cursor: starting || !canStart ? 'not-allowed' : 'pointer',
                boxShadow: '0 4px 20px rgba(239,159,39,0.32)', letterSpacing: '0.1px',
                opacity: starting || !canStart ? 0.6 : 1,
              }}
            >
              {starting ? 'Starting…' : 'Start session →'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
