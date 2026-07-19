import Link from 'next/link'

// Compact inline conversion banner for the A320 Systems Series articles. Used at
// the top and middle of each article (the full CtaBlock stays at the bottom).
// Same copy across all three articles. Uses site palette tokens.
export default function A320InlineCta() {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap',
      background: 'var(--clr-pri-light)', border: '1px solid var(--clr-primary)', borderRadius: 10,
      padding: '14px 18px', margin: '28px 0',
    }}>
      <div style={{ fontSize: 14, color: 'var(--clr-text)', lineHeight: 1.5 }}>
        Preparing for the A320? Practise <strong style={{ fontWeight: 700 }}>1,631 ATPL questions</strong> covering every ATA chapter.
      </div>
      <Link
        href="/login?next=/atpl"
        style={{
          flexShrink: 0, background: 'var(--clr-primary)', color: '#fff', fontWeight: 700, fontSize: 13,
          padding: '9px 18px', borderRadius: 8, textDecoration: 'none', whiteSpace: 'nowrap',
          fontFamily: 'var(--font-outfit),sans-serif',
        }}
      >
        Practise A320 questions →
      </Link>
    </div>
  )
}
