// Converts a 2-letter ISO 3166-1 alpha-2 code into its Unicode flag emoji
// by mapping each letter to a regional indicator symbol (no image assets needed).
export function flagEmoji(code: string): string {
  if (!code || code.length !== 2) return ''
  const points = [...code.toUpperCase()].map(c => 0x1f1e6 + c.charCodeAt(0) - 65)
  return String.fromCodePoint(...points)
}
