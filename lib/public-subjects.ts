import { SUBJECTS } from '@/lib/subjects'
import { bookChapterPracticeOrNull, subjectQuestionCounts, type SubjectCount } from '@/lib/live-counts'
import { HUMAN_PERFORMANCE } from '@/lib/human-performance'

// The subjects shown publicly, in /subjects order: the homepage tiles, the header's Subjects
// menu (through /api/public-subjects) and the homepage's subject count all read this list.
//
// A subject with fewer than PUBLIC_SUBJECT_MIN_QUESTIONS active questions is left out, so an
// unfinished subject (ATR72, General Aviation Knowledge) appears by itself once it has enough.
// A subject in the database without a page of its own goes before the A320, linking to its
// practice page (through login when logged out).
export const PUBLIC_SUBJECT_MIN_QUESTIONS = 50

export type PublicSubject = {
  key: string // subjects.code, or 'HP'
  title: string
  note?: string // Human Performance: where it sits in the syllabus
  questions: number | null // null when the count couldn't be read
  iconName: string | null
  href: string // where its /subjects card goes, logged out
  hrefLoggedIn: string // ... and logged in (differs only for the A320)
  practiceHref: string // a logged-in homepage tile: the practice page
  subjectId?: string
}

const A320_CODE = 'A320FAMILY'

export async function publicSubjects(): Promise<PublicSubject[]> {
  const [rows, hp] = await Promise.all([
    subjectQuestionCounts().catch((e): SubjectCount[] | null => { console.error(e); return null }),
    bookChapterPracticeOrNull(HUMAN_PERFORMANCE.bookSlug, HUMAN_PERFORMANCE.chapterId),
  ])
  const byCode = new Map((rows ?? []).map(r => [r.code, r]))
  // Counts unavailable: show the subjects that have pages rather than hide them all.
  const shown = (n: number | null) => n == null || n >= PUBLIC_SUBJECT_MIN_QUESTIONS

  const list: PublicSubject[] = []
  for (const s of SUBJECTS) {
    const row = byCode.get(s.code)
    const href = `/subjects/${s.slug}`
    list.push({
      key: s.code, title: s.title, questions: row?.count ?? null, iconName: row?.icon_name ?? null,
      href, hrefLoggedIn: href, practiceHref: row ? `/cpl/${row.id}` : href, subjectId: row?.id,
    })
    if (s.code === 'REG') {
      list.push({
        key: 'HP', title: 'Human Performance and Limitations',
        note: hp ? `Part of Air Regulations · RK Bali chapter ${hp.number}` : 'Part of Air Regulations · RK Bali',
        questions: hp?.questions ?? null, iconName: 'stethoscope',
        href: HUMAN_PERFORMANCE.subjectPath, hrefLoggedIn: HUMAN_PERFORMANCE.subjectPath, practiceHref: HUMAN_PERFORMANCE.subjectPath,
      })
    }
  }

  const known = new Set<string | null>([...SUBJECTS.map(s => s.code), A320_CODE])
  for (const row of rows ?? []) {
    if (known.has(row.code)) continue
    const practice = `/cpl/${row.id}`
    list.push({
      key: row.code ?? row.id, title: row.name, questions: row.count, iconName: row.icon_name,
      href: `/login?next=${practice}`, hrefLoggedIn: practice, practiceHref: practice, subjectId: row.id,
    })
  }

  const a320 = byCode.get(A320_CODE)
  if (a320 || !rows) {
    list.push({
      key: A320_CODE, title: 'Airbus A320', questions: a320?.count ?? null, iconName: 'A320',
      href: '/guides/a320-systems', hrefLoggedIn: '/atpl', practiceHref: '/atpl', subjectId: a320?.id,
    })
  }

  return list.filter(s => shown(s.questions))
}
