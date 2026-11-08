'use client'
import { createContext, useContext, useEffect, useState } from 'react'
import { trackEvent } from '@/lib/analytics'

export type Palette = 'A' | 'B'

interface ThemeCtxType { palette: Palette; toggle: () => void }
const ThemeCtx = createContext<ThemeCtxType>({ palette: 'A', toggle: () => {} })

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [palette, setPalette] = useState<Palette>('A')

  useEffect(() => {
    const saved = localStorage.getItem('palette') as Palette | null
    if (saved === 'B') {
      setPalette('B')
      document.documentElement.dataset.palette = 'B'
    }
  }, [])

  function toggle() {
    const next: Palette = palette === 'A' ? 'B' : 'A'
    setPalette(next)
    document.documentElement.dataset.palette = next
    localStorage.setItem('palette', next)
    trackEvent('theme_toggle', { theme: next === 'A' ? 'runway_blue' : 'golden_hour' })
  }

  return <ThemeCtx.Provider value={{ palette, toggle }}>{children}</ThemeCtx.Provider>
}

export function useTheme() { return useContext(ThemeCtx) }
