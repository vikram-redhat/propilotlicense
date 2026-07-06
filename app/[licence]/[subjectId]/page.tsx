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
        <h3 className="font-bold text-lg mb-1" style={{ color: 'var(--clr-text)' }}>Unlock full access</h3>
        <p className="text-sm mb-5 leading-relaxed" style={{ color: 'var(--clr-text-med)' }}>
          This feature requires a paid plan. Get unlimited questions, mock exams,
          book/chapter sessions, and difficulty selection.
        </p>
        <div className="flex gap-2">
          <Link href="/pricing" className="flex-1 text-center rounded-xl py-2.5 text-sm font-semibold text-white" style={{ backgroundColor: 'var(--clr-primary)', textDecoration: 'none' }}>
            View plans from ₹250 →
          </Link>
          <button onClick={onClose} className="px-4 py-2.5 rounded-xl text-sm border" style={{ color: 'var(--clr-text-med)', borderColor: 'var(--clr-border)' }}>
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
        border: `1.5px solid ${active ? 'var(--clr-primary)' : 'var(--clr-border)'}`,
        background: active ? 'var(--clr-pri-light)' : 'var(--clr-surface)',
        fontFamily: 'var(--font-outfit),sans-serif', fontSize: 15, fontWeight: 600,
        color: active ? 'var(--clr-primary)' : 'var(--clr-text-med)', cursor: 'pointer',
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
        border: `1.5px solid ${active ? 'var(--clr-primary)' : 'var(--clr-border)'}`,
        background: active ? 'var(--clr-pri-light)' : 'var(--clr-surface)',
        fontSize: 15, fontWeight: 500,
        color: active ? 'var(--clr-primary)' : locked ? 'var(--clr-border)' : 'var(--clr-text-med)',
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
  const [pairedSubject, setPairedSubject] = useState<Subject | null>(null)
  const [combineNavRai, setCombineNavRai] = useState(true)

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
      const studentCountry = profileRes.data?.country ?? null
      const visibleBooks = studentCountry
        ? (bks || []).filter(b => !b.countries?.length || b.countries.includes(studentCountry))
        : (bks || [])

      setSubject(sub)
      setTopics(tops || [])
      setBooks(visibleBooks)
      setProfile(profileRes.data)

      if ((sub?.code === 'NAV' || sub?.code === 'RAI') && licence.toLowerCase() === 'cpl') {
        const pairedCode = sub.code === 'NAV' ? 'RAI' : 'NAV'
        const { data: paired } = await supabase.from('subjects').select('*').eq('code', pairedCode).single()
        setPairedSubject(paired || null)
      }

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
    const isNavOrRai = subscribed && !!pairedSubject && mode === 'mock' && combineNavRai &&
      !!subject && (subject.code === 'NAV' || subject.code === 'RAI') && licence.toLowerCase() === 'cpl'

    const body = isNavOrRai ? {
      subjectId, licenceType: licence.toUpperCase(),
      scope: 'nav_rai_combined',
      pairedSubjectId: pairedSubject!.id,
      mode: 'mock', difficulty, questionCount: 100,
    } : {
      subjectId, licenceType: licence.toUpperCase(),
      scope: effectiveScope,
      topicId: scope === 'topic' ? selectedTopicId : null,
      sourceBookId: scope === 'book' ? selectedBookId : null,
      chapterId: effectiveScope === 'book_chapter' ? selectedChapterId : null,
      mode, difficulty, questionCount,
    }

    const res = await fetch('/api/session/start', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
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
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--clr-surface)' }}>
        <div className="animate-spin w-8 h-8 border-4 border-t-transparent rounded-full" style={{ borderColor: 'var(--clr-primary)', borderTopColor: 'transparent' }}/>
      </div>
    )
  }

  if (!subject) return <div className="min-h-screen flex items-center justify-center" style={{ color: 'var(--clr-text-med)' }}>Subject not found.</div>

  const scopeCards: { key: 'topic' | 'book' | 'combined'; title: string; subtitle: string; requiresPro: boolean }[] = [
    { key: 'topic', title: 'By topic', subtitle: 'Target specific subject areas', requiresPro: true },
    { key: 'book', title: 'By book', subtitle: 'Practice from a specific source', requiresPro: true },
    { key: 'combined', title: 'Combined paper', subtitle: 'All topics, all books', requiresPro: false },
  ]

  return (
    <div style={{ minHeight: '100vh', background: 'var(--clr-surface)', color: 'var(--clr-text)' }}>
      {showUpgrade && <UpgradeModal onClose={() => setShowUpgrade(false)} />}

      {/* Nav */}
      <nav style={{ position: 'sticky', top: 0, zIndex: 200, background: 'var(--clr-surface)', borderBottom: '1px solid var(--clr-border)' }}>
        <div className="px-5 sm:px-9 lg:px-[60px]" style={{ height: 54, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <button
              onClick={() => router.back()}
              style={{ width: 36, height: 36, borderRadius: '50%', border: '1px solid var(--clr-border)', background: 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--clr-text)', flexShrink: 0 }}
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M9.5 3L5.5 7l4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </button>
            <div>
              <div style={{ fontFamily: 'var(--font-outfit),sans-serif', fontSize: 16, fontWeight: 700, color: 'var(--clr-text)', letterSpacing: '-0.3px', lineHeight: 1.2 }}>Configure session</div>
              <div style={{ fontSize: 12, color: 'var(--clr-text-med)', marginTop: 1 }}>{subject.name} · {licence.toUpperCase()}</div>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            {!subscribed && (
              <Link href="/pricing" style={{ fontSize: 12, fontWeight: 600, padding: '5px 12px', borderRadius: 20, border: '1px solid var(--clr-border)', color: 'var(--clr-amber)', textDecoration: 'none' }}>Upgrade</Link>
            )}
            <UserMenu />
          </div>
        </div>
      </nav>

      {/* Two-panel layout */}
      <div style={{ maxWidth: 900, margin: '0 auto', padding: '24px 16px 100px' }}>
        {!subscribed && (
          <div style={{ marginBottom: 20, padding: '10px 14px', background: 'var(--clr-amber-light)', border: '1px solid var(--clr-amber)', borderRadius: 10, fontSize: 13, color: '#9A6000', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
            <span><strong>Free plan:</strong> Combined paper · 10 questions · Practice only</span>
            <Link href="/pricing" style={{ fontSize: 12, fontWeight: 700, color: 'var(--clr-primary)', textDecoration: 'none', whiteSpace: 'nowrap' }}>Upgrade →</Link>
          </div>
        )}

        <div className="flex flex-col lg:flex-row lg:items-start lg:gap-[52px]">

          {/* LEFT — Scope */}
          <div className="flex-1">
            <p style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.9px', textTransform: 'uppercase', color: 'var(--clr-text-med)', marginBottom: 10 }}>Scope</p>

            {scopeCards.map(({ key, title, subtitle, requiresPro }) => {
              const isLocked = requiresPro && !subscribed
              const isSelected = scope === key
              const isOpen = isSelected && key !== 'combined'
              return (
                <div
                  key={key}
                  onClick={() => selectScope(key)}
                  style={{
                    border: `1.5px solid ${isSelected ? 'var(--clr-primary)' : 'var(--clr-border)'}`,
                    background: isSelected ? 'var(--clr-pri-light)' : 'var(--clr-surface)',
                    borderRadius: 13, padding: 14, marginBottom: 8, cursor: 'pointer',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 11 }}>
                      <div style={{ width: 32, height: 32, borderRadius: 8, background: isSelected ? 'var(--clr-primary)' : 'var(--clr-surf-alt)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        {key === 'topic' && (
                          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                            <circle cx="8" cy="8" r="5.5" stroke={isSelected ? '#fff' : 'var(--clr-text-med)'} strokeWidth="1.5"/>
                            <circle cx="8" cy="8" r="2.5" fill={isSelected ? '#fff' : 'var(--clr-text-med)'}/>
                          </svg>
                        )}
                        {key === 'book' && (
                          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                            <rect x="2.5" y="1.5" width="11" height="13" rx="1.5" stroke={isSelected ? '#fff' : 'var(--clr-text-med)'} strokeWidth="1.5"/>
                            <path d="M5 5.5h6M5 8.5h6M5 11.5h3.5" stroke={isSelected ? '#fff' : 'var(--clr-text-med)'} strokeWidth="1.2" strokeLinecap="round"/>
                          </svg>
                        )}
                        {key === 'combined' && (
                          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                            <path d="M2 8h12M8 2v12" stroke={isSelected ? '#fff' : 'var(--clr-text-med)'} strokeWidth="1.6" strokeLinecap="round"/>
                            <rect x="1.5" y="1.5" width="13" height="13" rx="2" stroke={isSelected ? '#fff' : 'var(--clr-text-med)'} strokeWidth="1.2" opacity="0.4"/>
                          </svg>
                        )}
                      </div>
                      <div>
                        <div style={{ fontFamily: 'var(--font-outfit),sans-serif', fontSize: 15, fontWeight: 600, color: isSelected ? 'var(--clr-primary)' : 'var(--clr-text)' }}>
                          {title}{isLocked && <span style={{ marginLeft: 6, fontSize: 11, color: 'var(--clr-amber)' }}>🔒 Pro</span>}
                        </div>
                        <div style={{ fontSize: 12, color: 'var(--clr-text-med)', marginTop: 1 }}>{subtitle}</div>
                      </div>
                    </div>
                    <div style={{ width: 18, height: 18, borderRadius: '50%', border: `1.5px solid ${isSelected ? 'var(--clr-primary)' : 'var(--clr-border)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      {isSelected && <div style={{ width: 10, height: 10, borderRadius: '50%', background: 'var(--clr-primary)' }}/>}
                    </div>
                  </div>

                  {/* Expand dropdown */}
                  {isOpen && (
                    <div onClick={e => e.stopPropagation()} style={{ marginTop: 13, paddingTop: 13, borderTop: '1px solid var(--clr-border)' }}>
                      {key === 'topic' ? (
                        <>
                          <p style={{ fontSize: 11.5, fontWeight: 700, color: 'var(--clr-text-med)', marginBottom: 7, letterSpacing: '0.6px', textTransform: 'uppercase' }}>Select subject area</p>
                          <div style={{ position: 'relative' }}>
                            <select
                              value={selectedTopicId}
                              onChange={e => setSelectedTopicId(e.target.value)}
                              style={{ width: '100%', padding: '10px 36px 10px 12px', borderRadius: 9, border: '1px solid var(--clr-border)', background: 'var(--clr-surface)', fontSize: 13.5, color: 'var(--clr-text)', cursor: 'pointer', outline: 'none', appearance: 'none' }}
                            >
                              <option value="">Select a topic…</option>
                              {topics.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                            </select>
                            <svg style={{ position: 'absolute', right: 11, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M3 4.5l3 3 3-3" stroke="var(--clr-text-med)" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/></svg>
                          </div>
                        </>
                      ) : key === 'book' ? (
                        <>
                          <p style={{ fontSize: 11.5, fontWeight: 700, color: 'var(--clr-text-med)', marginBottom: 7, letterSpacing: '0.6px', textTransform: 'uppercase' }}>Select book</p>
                          <div style={{ position: 'relative' }}>
                            <select
                              value={selectedBookId}
                              onChange={e => { setSelectedBookId(e.target.value); setSelectedChapterId('') }}
                              style={{ width: '100%', padding: '10px 36px 10px 12px', borderRadius: 9, border: '1px solid var(--clr-border)', background: 'var(--clr-surface)', fontSize: 13.5, color: 'var(--clr-text)', cursor: 'pointer', outline: 'none', appearance: 'none' }}
                            >
                              <option value="">Select a book…</option>
                              {books.map(b => <option key={b.id} value={b.id}>{b.title}{b.author ? ` — ${b.author}` : ''}</option>)}
                            </select>
                            <svg style={{ position: 'absolute', right: 11, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M3 4.5l3 3 3-3" stroke="var(--clr-text-med)" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/></svg>
                          </div>
                          {selectedBookId && chapters.length > 0 && (
                            <div style={{ marginTop: 8, position: 'relative' }}>
                              <select
                                value={selectedChapterId}
                                onChange={e => setSelectedChapterId(e.target.value)}
                                style={{ width: '100%', padding: '10px 36px 10px 12px', borderRadius: 9, border: '1px solid var(--clr-border)', background: 'var(--clr-surface)', fontSize: 13.5, color: 'var(--clr-text)', cursor: 'pointer', outline: 'none', appearance: 'none' }}
                              >
                                <option value="">All chapters</option>
                                {chapters.map(c => <option key={c.id} value={c.id}>Ch. {c.chapter_number} — {c.chapter_name}</option>)}
                              </select>
                              <svg style={{ position: 'absolute', right: 11, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M3 4.5l3 3 3-3" stroke="var(--clr-text-med)" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/></svg>
                            </div>
                          )}
                        </>
                      ) : (
                        <p style={{ fontSize: 12.5, color: 'var(--clr-text-med)', lineHeight: 1.6 }}>
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

            <p style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.9px', textTransform: 'uppercase', color: 'var(--clr-text-med)', marginBottom: 10 }}>Mode</p>
            <div style={{ display: 'flex', gap: 8, marginBottom: 14 }}>
              <Chip active={mode === 'practice'} onClick={() => setMode('practice')}>Practice</Chip>
              <Chip active={mode === 'mock'} onClick={() => subscribed ? setMode('mock') : locked()}>
                Mock exam{!subscribed && ' 🔒'}
              </Chip>
            </div>

            {/* NAV + RAI combine toggle — CPL mock exam only */}
            {subscribed && !!pairedSubject && !!subject && (subject.code === 'NAV' || subject.code === 'RAI') && licence.toLowerCase() === 'cpl' && mode === 'mock' && (
              <div
                onClick={() => setCombineNavRai(v => !v)}
                style={{
                  marginBottom: 22, border: `1.5px solid ${combineNavRai ? 'var(--clr-primary)' : 'var(--clr-border)'}`,
                  background: combineNavRai ? 'var(--clr-pri-light)' : 'var(--clr-surface)',
                  borderRadius: 10, padding: '12px 14px',
                  cursor: 'pointer', display: 'flex', alignItems: 'flex-start', gap: 10,
                }}
              >
                <div style={{
                  width: 18, height: 18, borderRadius: 4, flexShrink: 0, marginTop: 1,
                  border: `1.5px solid ${combineNavRai ? 'var(--clr-primary)' : 'var(--clr-border)'}`,
                  background: combineNavRai ? 'var(--clr-primary)' : 'var(--clr-surface)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  {combineNavRai && (
                    <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                      <path d="M1 4l2.5 2.5L9 1" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  )}
                </div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: combineNavRai ? 'var(--clr-primary)' : 'var(--clr-text)', marginBottom: 3 }}>
                    Combine with {subject.code === 'NAV' ? 'Radio Aids & Instruments' : 'Air Navigation'}
                  </div>
                  <div style={{ fontSize: 11.5, color: 'var(--clr-text-med)', lineHeight: 1.5 }}>
                    Reflects the real CPL exam format — Navigation and Radio Aids are examined together as one paper.
                  </div>
                </div>
              </div>
            )}

            <p style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.9px', textTransform: 'uppercase', color: 'var(--clr-text-med)', marginBottom: 10 }}>Difficulty</p>
            <div style={{ display: 'flex', gap: 7, flexWrap: 'wrap', marginBottom: 22 }}>
              <Pill active={difficulty === 'all'} onClick={() => setDifficulty('all')}>All</Pill>
              <Pill active={difficulty === 'basic'} locked={!subscribed} onClick={() => subscribed ? setDifficulty('basic') : locked()}>Basic</Pill>
              <Pill active={difficulty === 'advanced'} locked={!subscribed} onClick={() => subscribed ? setDifficulty('advanced') : locked()}>Advanced</Pill>
            </div>

            <p style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.9px', textTransform: 'uppercase', color: 'var(--clr-text-med)', marginBottom: 10 }}>Questions</p>
            {subscribed && !!pairedSubject && !!subject && (subject.code === 'NAV' || subject.code === 'RAI') && licence.toLowerCase() === 'cpl' && mode === 'mock' && combineNavRai ? (
              <div style={{ marginBottom: 28, padding: '9px 14px', background: 'var(--clr-surf-alt)', borderRadius: 10, border: '1px solid var(--clr-border)' }}>
                <span style={{ fontFamily: 'var(--font-outfit),sans-serif', fontSize: 14, fontWeight: 600, color: 'var(--clr-primary)' }}>100</span>
                <span style={{ fontSize: 12, color: 'var(--clr-text-med)' }}> questions · fixed for combined paper</span>
              </div>
            ) : (
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
                        border: `1.5px solid ${questionCount === val ? 'var(--clr-primary)' : 'var(--clr-border)'}`,
                        background: questionCount === val ? 'var(--clr-pri-light)' : 'var(--clr-surface)',
                        fontFamily: 'var(--font-outfit),sans-serif', fontSize: 14, fontWeight: 600,
                        color: questionCount === val ? 'var(--clr-primary)' : isLocked ? 'var(--clr-border)' : 'var(--clr-text-med)',
                        cursor: isLocked ? 'default' : 'pointer',
                        opacity: isLocked ? 0.5 : 1,
                      }}
                    >
                      {val}
                    </button>
                  )
                })}
              </div>
            )}

            <button
              onClick={startSession}
              disabled={starting || !canStart}
              style={{
                width: '100%', padding: 15, background: 'var(--clr-amber)', color: '#fff', border: 'none',
                borderRadius: 13, fontFamily: 'var(--font-outfit),sans-serif', fontSize: 16, fontWeight: 700,
                cursor: starting || !canStart ? 'not-allowed' : 'pointer',
                boxShadow: '0 4px 20px var(--clr-amber-glow)', letterSpacing: '0.1px',
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
