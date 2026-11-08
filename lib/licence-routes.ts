// The /[licence] and /[licence]/[subjectId] routes catch any one- or two-segment path no
// other route claims. Shared by their layouts (which 404 anything invalid) and proxy.ts
// (which 404s such paths for logged-out visitors instead of sending them to log in).
export const LICENCES: ReadonlySet<string> = new Set(['cpl', 'atpl'])

export const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

// Top-level folders in app/ other than [licence]. A path under one of these belongs to
// that route, not to /[licence]. Add new top-level route folders here; a missing entry
// only means a logged-out visitor gets a 404 for it instead of the login redirect.
const TOP_LEVEL_ROUTES: ReadonlySet<string> = new Set([
  'about', 'admin', 'api', 'auth', 'books', 'checkout', 'forgot-password', 'guides', 'login',
  'practice', 'pricing', 'privacy', 'profile', 'reset-password', 'results', 'session',
  'signup', 'subjects', 'terms', 'verify',
])

// True for a path that can only reach /[licence] routes and would 404 there: a bad
// licence, or a subject id that isn't even UUID-shaped. (A UUID-shaped id that isn't a
// real subject needs the database, so the subject layout handles it.)
export function isDeadLicencePath(pathname: string): boolean {
  const segs = pathname.split('/').filter(Boolean)
  if (segs.length < 1 || segs.length > 2) return false
  if (segs[0].includes('.') || TOP_LEVEL_ROUTES.has(segs[0])) return false
  return !LICENCES.has(segs[0]) || (segs.length === 2 && !UUID.test(segs[1]))
}
