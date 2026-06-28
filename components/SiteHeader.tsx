import Link from 'next/link'
import UserMenu from './UserMenu'

interface Props {
  right?: React.ReactNode
}

export default function SiteHeader({ right }: Props) {
  return (
    <nav style={{ position: 'sticky', top: 0, zIndex: 200, background: '#F8FAFF', borderBottom: '1px solid #D4E1F0' }}>
      <div className="px-5 sm:px-9 lg:px-[60px]" style={{ height: 54, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Link href="/" style={{ textDecoration: 'none', fontFamily: 'var(--font-outfit),sans-serif', fontSize: 17, fontWeight: 700, letterSpacing: '-0.3px', color: '#0D1B2E', userSelect: 'none', flexShrink: 0 }}>
          ProPilot<span style={{ color: '#EF9F27' }}>Licence</span>
        </Link>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {right !== undefined ? right : <UserMenu />}
        </div>
      </div>
    </nav>
  )
}
