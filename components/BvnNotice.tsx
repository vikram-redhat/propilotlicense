import Link from 'next/link'

// Points readers of national aviation law at the Bharatiya Vayuyan Niyam guide. Used on
// the Air Regulations subject page, the RK Bali book page, the CPL Books guide, the
// /guides index and (as a single line) the homepage.
export const BVN_GUIDE_PATH = '/guides/dgca-exam-guides/bharatiya-vayuyan-niyam-2026'

export default function BvnNotice({ variant = 'block', style }: { variant?: 'block' | 'line'; style?: React.CSSProperties }) {
  const text = (
    <>
      <strong style={{ color: 'var(--clr-text)', fontWeight: 600 }}>New rules from 1 January 2027:</strong>{' '}
      the Bharatiya Vayuyan Niyam, 2026 replaces the Aircraft Rules, 1937.{' '}
      <Link href={BVN_GUIDE_PATH} data-cta="bvn-notice" style={{ color: 'var(--clr-primary)', fontWeight: 600, textDecoration: 'underline', textUnderlineOffset: 2 }}>
        What it means for pilots and the DGCA exam →
      </Link>
    </>
  )
  if (variant === 'line') {
    return <p style={{ fontSize: 14, lineHeight: 1.6, color: 'var(--clr-text-med)', margin: 0, ...style }}>{text}</p>
  }
  return (
    <aside
      aria-label="New aviation rules"
      style={{ fontSize: 14, lineHeight: 1.6, color: 'var(--clr-text-med)', background: 'var(--clr-amber-light)', borderLeft: '3px solid var(--clr-amber)', borderRadius: '0 8px 8px 0', padding: '12px 16px', ...style }}
    >
      {text}
    </aside>
  )
}
