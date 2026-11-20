// The "New rules 2026" practice set: the BVN26 questions on the Bharatiya Vayuyan Niyam,
// 2026 (the Niyam source book, imported by scripts/import-bvn26.mjs). A session on it is a
// whole-book session (scope 'book') on that book, drawing only questions whose external_ref
// starts BVN26-. A free account gets one 10-question session of it, like a chapter taster
// (lib/chapter-taster.ts), without the 5 quiz questions; an unfinished one is resumed, and a
// new one after that gets the upgrade message. Paid accounts get the full set.
// Started from /practice/new-rules, which the Niyam and Adhiniyam guides link to (through
// signup when logged out, then straight into the session).

export const NEW_RULES_BOOK_ID = '294228e2-6a2b-41c1-b098-53fda68fc156'
export const NEW_RULES_SUBJECT_ID = 'f27577f4-72cd-4f9b-9ec0-fedf966dd9d2' // Air Regulations
export const NEW_RULES_REF_PREFIX = 'BVN26-'
export const NEW_RULES_PATH = '/practice/new-rules'
export const NEW_RULES_TASTER_QUESTIONS = 10
export const NEW_RULES_USED_ERROR = 'free_tier_new_rules_used'

// The guides' 5-question quiz, in this order: commencement, alcohol, CPL validity,
// CPL education, medical validity after 40. There are no Adhiniyam questions in the set yet,
// so both guides use these.
export const QUIZ_REFS = ['BVN26-001', 'BVN26-018', 'BVN26-025', 'BVN26-034', 'BVN26-028'] as const

export function isNewRulesSession(scope: string, sourceBookId: string | null | undefined): boolean {
  return scope === 'book' && sourceBookId === NEW_RULES_BOOK_ID
}

// Logged out: signup first, which comes back to the practice route.
export function newRulesHref(isLoggedIn: boolean): string {
  return isLoggedIn ? NEW_RULES_PATH : `/signup?next=${encodeURIComponent(NEW_RULES_PATH)}`
}
