// ponytail: read saved region from localStorage, default IN
export function getRegion(): 'IN' | 'INTL' {
  if (typeof window === 'undefined') return 'IN'
  return localStorage.getItem('region') === 'INTL' ? 'INTL' : 'IN'
}

// Call /api/region (IP-based via Vercel header), save to localStorage
export async function initRegion(): Promise<void> {
  if (typeof window === 'undefined') return
  if (localStorage.getItem('region')) return // already set

  try {
    const res = await fetch('/api/region')
    const { region } = await res.json()
    localStorage.setItem('region', region)
    window.location.reload()
  } catch {
    localStorage.setItem('region', 'IN') // fallback
  }
}
