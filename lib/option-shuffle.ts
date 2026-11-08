// Puts a generated question's correct answer at a random letter. The model favours B
// (the bank was 61% B before scripts/rebalance-option-letters.mjs), so the generator
// shuffles every question before it is shown for review and saved. Explanation
// references ("option B", "options A and C") follow their options. Questions whose
// option text names other options ("Both B and C") are left as generated.

const LETTERS = ['A', 'B', 'C', 'D'] as const
type Letter = (typeof LETTERS)[number]

// Keyword in either case; the letter must be a capital A–D.
const OPTION_REF = /\b([Oo]ptions?|[Aa]nswers?|[Cc]hoices?)(\s+)\(?([A-D])\)?((?:\s*(?:,|and|or|&|\/)\s*\(?[A-D]\)?)*)/g
const NAMES_OTHER_OPTIONS = /\b(both|neither|either)\s+[A-D]\s+(and|nor|or)\b|\b[A-D]\s*(,|and|&)\s*[A-D]\s+(are|is)\b|\ball of the above\b|\bnone of the above\b/i

export function remapOptionRefs(text: string, map: Record<string, string>): string {
  return text.replace(OPTION_REF, (m: string, word: string, space: string, first: string) => {
    const head = m.slice(0, m.indexOf(first, word.length + space.length))
    return head + map[first] + m.slice(head.length + 1).replace(/[A-D]/g, l => map[l])
  })
}

type GeneratedQuestion = {
  options?: Partial<Record<Letter, string>>
  correct_option?: string
  explanation?: string
  [key: string]: unknown
}

export function shuffleGeneratedQuestion<T extends GeneratedQuestion>(q: T): T {
  const opts = q.options
  if (!opts || !LETTERS.every(l => typeof opts[l] === 'string') || !LETTERS.includes(q.correct_option as Letter)) return q
  if (LETTERS.some(l => NAMES_OTHER_OPTIONS.test(opts[l]!))) return q
  const order = [...LETTERS]
  for (let i = order.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [order[i], order[j]] = [order[j], order[i]] }
  // order[k] = the old letter that moves to LETTERS[k]
  const map = Object.fromEntries(order.map((old, k) => [old, LETTERS[k]])) as Record<Letter, Letter>
  return {
    ...q,
    options: Object.fromEntries(LETTERS.map((l, k) => [l, opts[order[k]]])),
    correct_option: map[q.correct_option as Letter],
    ...(typeof q.explanation === 'string' ? { explanation: remapOptionRefs(q.explanation, map) } : {}),
  }
}
