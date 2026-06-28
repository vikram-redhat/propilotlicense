'use client'
import Link from 'next/link'
import HeaderAuth from './HeaderAuth'
import { useTheme } from '@/components/ThemeProvider'

interface Props {
  right?: React.ReactNode
}

export default function SiteHeader({ right }: Props) {
  const { palette, toggle } = useTheme()
  return (
    <nav style={{ position: 'sticky', top: 0, zIndex: 200, background: 'var(--clr-surface)', borderBottom: '1px solid var(--clr-border)' }}>
      <div className="px-5 sm:px-9 lg:px-[60px]" style={{ height: 54, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Link href="/" style={{ textDecoration: 'none', fontFamily: 'var(--font-outfit),sans-serif', fontSize: 17, fontWeight: 700, letterSpacing: '-0.3px', color: 'var(--clr-text)', userSelect: 'none', flexShrink: 0 }}>
          ProPilot<span style={{ color: 'var(--clr-amber)' }}>Licence</span>
        </Link>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <button
            onClick={toggle}
            style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '5px 11px', borderRadius: 20, border: '1px solid var(--clr-border)', background: 'transparent', fontSize: 11, fontWeight: 600, color: 'var(--clr-text-med)', cursor: 'pointer' }}
          >
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--clr-amber)', flexShrink: 0 }} />
            {palette === 'A' ? 'Runway Blue' : 'Golden Hour'}
          </button>
          {right !== undefined ? right : <HeaderAuth />}
        </div>
      </div>
    </nav>
  )
}
