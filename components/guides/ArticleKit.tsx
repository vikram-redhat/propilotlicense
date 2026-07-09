import Link from 'next/link'

export const MONO = "ui-monospace, 'SFMono-Regular', Menlo, Consolas, monospace"

export type SeriesNavItem = { label: string; href?: string; state: 'current' | 'link' | 'upcoming' }

export function Breadcrumb({ seriesSlug, seriesLabel, current }: { seriesSlug: string; seriesLabel: string; current: string }) {
  const linkStyle = { color: 'var(--clr-text-med)', textDecoration: 'none' }
  return (
    <nav style={{ fontSize: 13, color: 'var(--clr-text-med)', marginBottom: 24 }}>
      <Link href="/guides" style={linkStyle}>Guides</Link>
      <span style={{ margin: '0 6px' }}>›</span>
      <Link href={`/guides/${seriesSlug}`} style={linkStyle}>{seriesLabel}</Link>
      <span style={{ margin: '0 6px' }}>›</span>
      <span>{current}</span>
    </nav>
  )
}

export function ArticleHeader({ seriesLabel, articleNumber, totalArticles, title, standfirst }: {
  seriesLabel: string
  articleNumber: number
  totalArticles: number
  title: string
  standfirst: string
}) {
  return (
    <>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
        <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--clr-text-med)', display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ display: 'inline-block', width: 22, height: 2, background: 'var(--clr-primary)' }} />
          {seriesLabel} — Series
        </div>
        <span style={{ marginLeft: 'auto', fontSize: 11, fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase', background: 'var(--clr-pri-light)', color: 'var(--clr-primary)', padding: '3px 9px', borderRadius: 5 }}>
          Article {articleNumber} of {totalArticles}
        </span>
      </div>

      <h1 style={{ fontFamily: 'var(--font-outfit),sans-serif', fontSize: 30, fontWeight: 700, color: 'var(--clr-text)', letterSpacing: '-0.5px', lineHeight: 1.2, marginBottom: 16 }}>
        {title}
      </h1>

      <p style={{ fontSize: 16, color: 'var(--clr-text-med)', lineHeight: 1.65, borderLeft: '3px solid var(--clr-primary)', paddingLeft: 16, marginBottom: 24 }}>
        {standfirst}
      </p>

      <div style={{ fontSize: 12, color: 'var(--clr-text-med)', marginBottom: 32, display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
        <span>ProPilotLicence Editorial</span>
        <span>·</span>
        <span>Reviewed by the ProPilotLicence Captain Panel</span>
        <span>·</span>
        <span>{seriesLabel} Series</span>
      </div>
    </>
  )
}

export function SeriesNav({ seriesLabel, items }: { seriesLabel: string; items: SeriesNavItem[] }) {
  return (
    <div style={{ background: 'var(--clr-surf-alt)', border: '1px solid var(--clr-border)', borderRadius: 10, padding: '16px 20px', marginBottom: 32 }}>
      <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.07em', textTransform: 'uppercase', color: 'var(--clr-text-med)', marginBottom: 10 }}>
        {seriesLabel} — Article series
      </div>
      <ol style={{ display: 'flex', flexDirection: 'column', gap: 6, paddingLeft: 20, margin: 0 }}>
        {items.map((item, i) => (
          <li
            key={i}
            style={{
              fontSize: 14,
              color: item.state === 'current' ? 'var(--clr-text)' : 'var(--clr-text-med)',
              fontWeight: item.state === 'current' ? 600 : 400,
              fontStyle: item.state === 'upcoming' ? 'italic' : 'normal',
            }}
          >
            {item.href ? <Link href={item.href} style={{ color: 'inherit', textDecoration: 'none' }}>{item.label}</Link> : item.label}
          </li>
        ))}
      </ol>
    </div>
  )
}

export function Section({ title, first, children }: { title: string; first?: boolean; children: React.ReactNode }) {
  return (
    <section style={{ display: 'flex', flexDirection: 'column', gap: 16, marginTop: first ? 0 : 44 }}>
      <h2 style={{ fontFamily: 'var(--font-outfit),sans-serif', fontSize: 22, fontWeight: 700, color: 'var(--clr-text)', letterSpacing: '-0.3px', paddingTop: first ? 0 : 28, borderTop: first ? 'none' : '1px solid var(--clr-border)' }}>
        {title}
      </h2>
      {children}
    </section>
  )
}

export function SubSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 8 }}>
      <h3 style={{ fontFamily: 'var(--font-outfit),sans-serif', fontSize: 16, fontWeight: 700, color: 'var(--clr-text)' }}>{title}</h3>
      {children}
    </div>
  )
}

export function Prose({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ fontSize: 16, lineHeight: 1.75, color: 'var(--clr-text)', display: 'flex', flexDirection: 'column', gap: 14 }}>
      {children}
    </div>
  )
}

const CALLOUT_STYLES = {
  blue:  { bg: 'var(--clr-pri-light)',    border: 'var(--clr-primary)' },
  amber: { bg: 'var(--clr-amber-light)',  border: 'var(--clr-amber)'   },
  red:   { bg: 'var(--clr-wrong-bg)',     border: 'var(--clr-wrong)'   },
  green: { bg: 'var(--clr-correct-bg)',   border: 'var(--clr-correct)' },
}

export function Callout({ variant, children }: { variant: keyof typeof CALLOUT_STYLES; children: React.ReactNode }) {
  const s = CALLOUT_STYLES[variant]
  return (
    <div style={{ background: s.bg, borderLeft: `3px solid ${s.border}`, borderRadius: '0 8px 8px 0', padding: '14px 18px', fontSize: 14, lineHeight: 1.7, color: 'var(--clr-text)' }}>
      {children}
    </div>
  )
}

type Cell = string | { text: string; color: 'green' | 'amber' | 'red' }

const CELL_COLORS = { green: 'var(--clr-correct)', amber: 'var(--clr-amber)', red: 'var(--clr-wrong)' }

export function DataTable({ head, rows, monoCol }: { head: string[]; rows: Cell[][]; monoCol?: number }) {
  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
        <thead>
          <tr>
            {head.map(h => (
              <th key={h} style={{ textAlign: 'left', fontSize: 11, fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase', color: 'var(--clr-text-med)', padding: '10px 14px', background: 'var(--clr-surf-alt)', borderBottom: '1px solid var(--clr-border)' }}>
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i}>
              {row.map((cell, j) => {
                const isObj = typeof cell !== 'string'
                const text = isObj ? cell.text : cell
                const color = isObj ? CELL_COLORS[cell.color] : (j === monoCol ? 'var(--clr-primary)' : 'var(--clr-text)')
                return (
                  <td
                    key={j}
                    style={{
                      padding: '11px 14px',
                      borderBottom: i < rows.length - 1 ? '1px solid var(--clr-border)' : 'none',
                      color,
                      fontWeight: isObj ? 600 : undefined,
                      fontFamily: j === monoCol ? MONO : undefined,
                      fontSize: j === monoCol ? 13 : undefined,
                      verticalAlign: 'top',
                    }}
                  >
                    {text}
                  </td>
                )
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

type FinCell = { value: string; variant: 'neg' | 'pos' | 'mono' }
const FIN_COLORS = { neg: 'var(--clr-wrong)', pos: 'var(--clr-correct)', mono: 'var(--clr-primary)' }

export function FinancialTable({ heading, rows }: { heading: string; rows: [string, FinCell, string][] }) {
  return (
    <div style={{ border: '1px solid var(--clr-border)', borderRadius: 10, overflow: 'hidden', margin: '8px 0' }}>
      <div style={{ background: 'var(--clr-hero)', color: '#fff', padding: '10px 18px', fontSize: 12, fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
        {heading}
      </div>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
          <thead>
            <tr>
              {['Item', 'Approximate figure', 'Notes'].map(h => (
                <th key={h} style={{ textAlign: 'left', fontSize: 11, fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase', color: 'var(--clr-text-med)', padding: '10px 18px', background: 'var(--clr-surf-alt)', borderBottom: '1px solid var(--clr-border)' }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map(([label, cell, note], i) => (
              <tr key={i}>
                <td style={{ padding: '11px 18px', borderBottom: i < rows.length - 1 ? '1px solid var(--clr-border)' : 'none', color: 'var(--clr-text)', verticalAlign: 'top' }}>{label}</td>
                <td style={{ padding: '11px 18px', borderBottom: i < rows.length - 1 ? '1px solid var(--clr-border)' : 'none', color: FIN_COLORS[cell.variant], fontFamily: MONO, fontSize: 13, fontWeight: 600, verticalAlign: 'top', whiteSpace: 'nowrap' }}>{cell.value}</td>
                <td style={{ padding: '11px 18px', borderBottom: i < rows.length - 1 ? '1px solid var(--clr-border)' : 'none', color: 'var(--clr-text-med)', fontSize: 13, verticalAlign: 'top' }}>{note}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export type Step = {
  title: string
  body: string
  tags: { label: string; variant: 'time' | 'cost' | 'action' }[]
}

const TAG_STYLES = {
  time:   { bg: 'var(--clr-pri-light)',   color: 'var(--clr-primary)' },
  cost:   { bg: 'var(--clr-amber-light)', color: 'var(--clr-amber)'   },
  action: { bg: 'var(--clr-correct-bg)',  color: 'var(--clr-correct)' },
}

export function StepList({ steps }: { steps: Step[] }) {
  return (
    <ol style={{ listStyle: 'none', padding: 0, margin: '8px 0', display: 'flex', flexDirection: 'column', gap: 0 }}>
      {steps.map((step, i) => (
        <li
          key={i}
          style={{
            display: 'flex', gap: 16,
            paddingBottom: i < steps.length - 1 ? 24 : 0,
            marginBottom: i < steps.length - 1 ? 24 : 0,
            borderBottom: i < steps.length - 1 ? '1px solid var(--clr-border)' : 'none',
          }}
        >
          <div style={{ flexShrink: 0, width: 30, height: 30, borderRadius: '50%', background: 'var(--clr-primary)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700, marginTop: 2 }}>
            {i + 1}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <h3 style={{ fontFamily: 'var(--font-outfit),sans-serif', fontSize: 15, fontWeight: 700, color: 'var(--clr-text)', marginBottom: 6 }}>{step.title}</h3>
            <p style={{ fontSize: 14, lineHeight: 1.7, color: 'var(--clr-text-med)', marginBottom: 10 }}>{step.body}</p>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {step.tags.map((tag, j) => (
                <span key={j} style={{ fontSize: 11, fontWeight: 700, padding: '3px 9px', borderRadius: 5, letterSpacing: '0.02em', background: TAG_STYLES[tag.variant].bg, color: TAG_STYLES[tag.variant].color }}>
                  {tag.label}
                </span>
              ))}
            </div>
          </div>
        </li>
      ))}
    </ol>
  )
}

const LEVEL_STYLES = {
  high:   { bg: 'var(--clr-correct-bg)', color: 'var(--clr-correct)' },
  medium: { bg: 'var(--clr-amber-light)', color: 'var(--clr-amber)' },
  low:    { bg: 'var(--clr-surface)', color: 'var(--clr-text-med)', border: '1px solid var(--clr-border)' },
}

export function SubjectAdvantageGrid({ rows }: { rows: { name: string; level: 'high' | 'medium' | 'low'; note: string }[] }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10, margin: '8px 0' }}>
      {rows.map((row, i) => (
        <div key={i} style={{ display: 'grid', gridTemplateColumns: '160px 90px 1fr', gap: 16, alignItems: 'start', padding: '14px 16px', border: '1px solid var(--clr-border)', borderRadius: 8, background: 'var(--clr-surf-alt)' }}>
          <div style={{ fontWeight: 700, fontSize: 14, color: 'var(--clr-text)' }}>{row.name}</div>
          <div>
            <span style={{ fontSize: 11, fontWeight: 700, textAlign: 'center', display: 'inline-block', padding: '3px 8px', borderRadius: 5, textTransform: 'capitalize', ...LEVEL_STYLES[row.level] }}>
              {row.level}
            </span>
          </div>
          <div style={{ fontSize: 13, lineHeight: 1.65, color: 'var(--clr-text-med)' }}>{row.note}</div>
        </div>
      ))}
    </div>
  )
}

export function RoleGrid({ rows }: { rows: { name: string; note: string }[] }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10, margin: '8px 0' }}>
      {rows.map((row, i) => (
        <div key={i} style={{ display: 'grid', gridTemplateColumns: '200px 1fr', gap: 16, alignItems: 'start', padding: '14px 16px', border: '1px solid var(--clr-border)', borderRadius: 8, background: 'var(--clr-surf-alt)' }}>
          <div style={{ fontWeight: 700, fontSize: 14, color: 'var(--clr-text)' }}>{row.name}</div>
          <div style={{ fontSize: 13, lineHeight: 1.65, color: 'var(--clr-text-med)' }}>{row.note}</div>
        </div>
      ))}
    </div>
  )
}

export type RoadmapStage = {
  n: string
  title: string
  detail: string
  time: string
  cost: string
  done?: boolean
  split?: { title: string; detail: string; cost: string }[]
}

// Palette-aware vertical roadmap. Money figures (containing ₹) render amber;
// nominal/free costs render green. Use `split` for stages that run concurrently.
export function Roadmap({ label, caption, stages }: { label: string; caption?: string; stages: RoadmapStage[] }) {
  const costColor = (cost: string) => (cost.includes('₹') ? 'var(--clr-amber)' : 'var(--clr-correct)')
  return (
    <div style={{ border: '1px solid var(--clr-border)', borderRadius: 12, overflow: 'hidden', margin: '8px 0' }}>
      <div style={{ padding: '10px 16px', borderBottom: '1px solid var(--clr-border)', background: 'var(--clr-surf-alt)', fontSize: 11, fontWeight: 700, letterSpacing: '0.07em', textTransform: 'uppercase', color: 'var(--clr-text-med)' }}>
        {label}
      </div>
      <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 12 }}>
        {stages.map((s, i) => {
          const accent = s.done ? 'var(--clr-correct)' : 'var(--clr-primary)'
          const bg = s.done ? 'var(--clr-correct-bg)' : 'var(--clr-pri-light)'
          return (
            <div key={i} style={{ display: 'flex', gap: 14 }}>
              <div style={{ flexShrink: 0, width: 30, height: 30, borderRadius: '50%', background: accent, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700, marginTop: 2 }}>
                {s.n}
              </div>
              <div style={{ flex: 1, minWidth: 0, background: bg, border: `1px solid ${accent}`, borderRadius: 8, padding: '12px 14px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10, flexWrap: 'wrap', alignItems: 'baseline' }}>
                  <span style={{ fontSize: 14, fontWeight: 700, color: accent }}>{s.title}</span>
                  <span style={{ fontFamily: MONO, fontSize: 12, color: 'var(--clr-text-med)', whiteSpace: 'nowrap' }}>{s.time}</span>
                </div>
                <p style={{ fontSize: 13, lineHeight: 1.6, color: 'var(--clr-text-med)', margin: '4px 0 0' }}>{s.detail}</p>
                {s.split ? (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 10, marginTop: 10 }}>
                    {s.split.map((c, j) => (
                      <div key={j} style={{ background: 'var(--clr-surface)', border: '1px solid var(--clr-border)', borderRadius: 6, padding: '10px 12px' }}>
                        <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--clr-text)' }}>{c.title}</div>
                        <p style={{ fontSize: 12, lineHeight: 1.55, color: 'var(--clr-text-med)', margin: '3px 0 6px' }}>{c.detail}</p>
                        <span style={{ fontFamily: MONO, fontSize: 12, color: costColor(c.cost) }}>{c.cost}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div style={{ marginTop: 8, fontFamily: MONO, fontSize: 12, color: costColor(s.cost) }}>{s.cost}</div>
                )}
              </div>
            </div>
          )
        })}
      </div>
      {caption && (
        <div style={{ padding: '10px 16px', borderTop: '1px solid var(--clr-border)', background: 'var(--clr-surf-alt)', fontSize: 12, fontStyle: 'italic', color: 'var(--clr-text-med)', lineHeight: 1.6 }}>
          {caption}
        </div>
      )}
    </div>
  )
}

export function ComparisonGrid({ cards }: { cards: { title: string; flag?: string; points: string[] }[] }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 12, margin: '8px 0' }}>
      {cards.map((card, i) => (
        <div key={i} style={{ border: '1px solid var(--clr-border)', borderRadius: 8, padding: '14px 16px', background: 'var(--clr-surf-alt)' }}>
          <h3 style={{ fontSize: 14, fontWeight: 700, color: 'var(--clr-text)', marginBottom: 8 }}>
            {card.flag && <span style={{ marginRight: 6 }}>{card.flag}</span>}
            {card.title}
          </h3>
          <ul style={{ margin: 0, paddingLeft: 18, display: 'flex', flexDirection: 'column', gap: 4 }}>
            {card.points.map((p, j) => (
              <li key={j} style={{ fontSize: 13, lineHeight: 1.55, color: 'var(--clr-text-med)' }}>{p}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  )
}

export function CardGrid({ cards }: { cards: { title: string; desc: string }[] }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 12, margin: '8px 0' }}>
      {cards.map((card, i) => (
        <div key={i} style={{ border: '1px solid var(--clr-border)', borderRadius: 8, padding: '14px 16px', background: 'var(--clr-surf-alt)' }}>
          <h3 style={{ fontSize: 14, fontWeight: 700, color: 'var(--clr-primary)', marginBottom: 6 }}>{card.title}</h3>
          <p style={{ fontSize: 13, lineHeight: 1.6, color: 'var(--clr-text-med)', margin: 0 }}>{card.desc}</p>
        </div>
      ))}
    </div>
  )
}

export function CtaBlock({ title, body, href, label }: { title: string; body: string; href: string; label: string }) {
  return (
    <div style={{ background: 'var(--clr-hero)', borderRadius: 14, padding: '28px 32px', margin: '16px 0', textAlign: 'center' }}>
      <h3 style={{ color: '#fff', fontSize: 18, fontWeight: 700, marginBottom: 8, fontFamily: 'var(--font-outfit),sans-serif' }}>{title}</h3>
      <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: 14, marginBottom: 20 }}>{body}</p>
      <Link href={href} style={{ display: 'inline-block', background: '#fff', color: 'var(--clr-hero)', fontWeight: 700, fontSize: 14, padding: '11px 28px', borderRadius: 8, textDecoration: 'none' }}>
        {label}
      </Link>
    </div>
  )
}

export function Disclaimer({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ marginTop: 16, padding: 20, background: 'var(--clr-surf-alt)', border: '1px solid var(--clr-border)', borderRadius: 10, fontSize: 13, color: 'var(--clr-text-med)', lineHeight: 1.6 }}>
      <strong style={{ color: 'var(--clr-text)' }}>Note:</strong> {children}
    </div>
  )
}

export function ReadyBox({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ border: '1.5px solid var(--clr-border)', borderRadius: 10, padding: '18px 20px', margin: '8px 0', background: 'var(--clr-surf-alt)' }}>
      <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--clr-text-med)', marginBottom: 10 }}>{label}</div>
      {children}
    </div>
  )
}
