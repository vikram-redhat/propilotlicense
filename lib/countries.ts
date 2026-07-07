// Converts a 2-letter ISO 3166-1 alpha-2 code into its Unicode flag emoji
// by mapping each letter to a regional indicator symbol (no image assets needed).
export function flagEmoji(code: string): string {
  if (!code || code.length !== 2) return ''
  const points = [...code.toUpperCase()].map(c => 0x1f1e6 + c.charCodeAt(0) - 65)
  return String.fromCodePoint(...points)
}

// Shared visibility rule for country-scoped content (books, and questions via their
// linked book). Used by both the session-start API (server) and the book picker (client)
// so the two can't silently drift.
//
// `bookCountries` semantics:
//   - null/undefined (no book at all, or a book whose countries column was never set —
//     legacy/pre-migration data) -> universal, visible regardless of student country.
//   - [] (a book explicitly tagged with zero countries, e.g. an admin unchecked every
//     box) -> hidden from every country. This is a deliberate "no countries assigned"
//     state, distinct from "never tagged".
//   - non-empty array -> visible only if it contains the student's country.
export function isVisibleForCountry(bookCountries: string[] | null | undefined, studentCountry: string | null): boolean {
  if (!studentCountry) return true
  if (bookCountries == null) return true
  if (bookCountries.length === 0) return false
  return bookCountries.includes(studentCountry)
}
