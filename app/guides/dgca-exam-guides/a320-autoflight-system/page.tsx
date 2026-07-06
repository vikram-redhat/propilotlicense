import Link from 'next/link'
import LandingHeader from '@/components/LandingHeader'
import SiteFooter from '@/components/SiteFooter'
import { ArticleSchema } from '@/components/schema/ArticleSchema'
import { buildMetadata } from '@/lib/metadata'

export const metadata = buildMetadata({
  title: 'A320 Autoflight System — AP, FD, ATHR, FCU and FMA Logic | ProPilotLicence',
  description:
    'A complete guide to the A320 autoflight system. Autopilot modes, Flight Director, Autothrust, FCU operation, FMA logic, and managed vs selected guidance — explained for ATPL and type rating candidates.',
  path: '/guides/dgca-exam-guides/a320-autoflight-system',
})

const MONO = "ui-monospace, 'SFMono-Regular', Menlo, Consolas, monospace"

export default function A320AutoflightPost() {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--clr-surface)', color: 'var(--clr-text)' }}>
      <ArticleSchema
        title="A320 Autoflight System — AP, FD, ATHR, FCU and FMA Logic"
        description="A complete guide to the A320 autoflight system. Autopilot modes, Flight Director, Autothrust, FCU operation, FMA logic, and managed vs selected guidance — explained for ATPL and type rating candidates."
        url="https://propilotlicence.com/guides/dgca-exam-guides/a320-autoflight-system"
        publishedAt="2026-07-05"
        updatedAt="2026-07-05"
      />
      <LandingHeader isLoggedIn={false} name={null} />

      <main style={{ maxWidth: 720, margin: '0 auto', padding: '48px 20px 96px' }}>

        {/* Breadcrumb */}
        <nav style={{ fontSize: 13, color: 'var(--clr-text-med)', marginBottom: 24 }}>
          <Link href="/guides/dgca-exam-guides" style={{ color: 'var(--clr-text-med)', textDecoration: 'none' }}>DGCA Exam Guides</Link>
          <span style={{ margin: '0 6px' }}>›</span>
          <span>A320 Autoflight System</span>
        </nav>

        {/* Eyebrow / series badge */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
          <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--clr-text-med)', display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ display: 'inline-block', width: 22, height: 2, background: 'var(--clr-primary)' }} />
            A320 Systems — Autoflight
          </div>
          <span style={{ marginLeft: 'auto', fontSize: 11, fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase', background: 'var(--clr-pri-light)', color: 'var(--clr-primary)', padding: '3px 9px', borderRadius: 5 }}>
            Article 2 of series
          </span>
        </div>

        <h1 style={{ fontFamily: 'var(--font-outfit),sans-serif', fontSize: 30, fontWeight: 700, color: 'var(--clr-text)', letterSpacing: '-0.5px', lineHeight: 1.2, marginBottom: 16 }}>
          A320 Autoflight System — AP, FD, ATHR, FCU and FMA Logic
        </h1>

        <p style={{ fontSize: 16, color: 'var(--clr-text-med)', lineHeight: 1.65, borderLeft: '3px solid var(--clr-primary)', paddingLeft: 16, marginBottom: 24 }}>
          The A320 autoflight system does not merely fly the aircraft — it communicates its intentions through the FMA on every mode change. Pilots who understand that conversation rarely get surprised. Those who don&apos;t get caught in ATPL orals and, more importantly, in line operations.
        </p>

        <div style={{ fontSize: 12, color: 'var(--clr-text-med)', marginBottom: 32, display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
          <span>Reviewed by the Captain Panel — 4 active airline captains, current DGCA ATPL</span>
          <span>·</span>
          <span>ATPL / Type Rating</span>
        </div>

        <Prose>
          <p>
            The autoflight system on the A320 integrates three distinct but interdependent functions: the Autopilot (AP), the Flight Director (FD), and the Autothrust (ATHR). Each can operate independently, but in normal line operations they work as a coordinated system, managed through the Flight Control Unit (FCU) on the glareshield and monitored through the Flight Mode Annunciator (FMA) on the Primary Flight Display.
          </p>
          <p>
            Understanding autoflight means understanding the FMA. Every mode engagement, every mode change, every armed-to-active transition is announced there. Pilots who read the FMA instinctively are ahead of the aircraft. Those who treat it as background noise are behind it.
          </p>
        </Prose>

        <Section title="System architecture — the four components">
          <DiagramBlock label="Diagram 1 — Autoflight system architecture" caption="The FCU is the pilot's interface. AP, FD, and ATHR are the execution layer. The FMA is the readback — it confirms what the system is actually doing.">
            <ArchitectureDiagram />
          </DiagramBlock>

          <Prose>
            <p><strong>Autopilot (AP):</strong> The A320 has two independent autopilots — AP1 and AP2. In normal operations only one is engaged at a time; both engage simultaneously only for CAT II &amp; III approaches where independent monitoring is required. The AP sends commands to the flight control computers (ELAC, SEC, FAC) which move the control surfaces. Engaging the AP does not change what the FD shows — the AP simply follows the same guidance the FD was already presenting.</p>
            <p><strong>Flight Director (FD):</strong> The FD displays guidance bars on the PFD — pitch bar and bank bar — showing the pilot where to point the aircraft to follow the computed flight path. The FD has no authority over control surfaces. It is a display, not a controller. When flying manually with FD on, the pilot follows the bars. When the AP is engaged, the AP follows the bars automatically. Switching the FD off does not disconnect the AP.</p>
            <p><strong>Autothrust (ATHR):</strong> The ATHR controls thrust by commanding the FADECs. Unlike a conventional autothrottle, the A320&apos;s thrust levers do not move when ATHR is active — lever position defines the thrust envelope, not the commanded thrust. This is the most common source of confusion for pilots transitioning from aircraft with moving autothrottle levers. The levers set limits; the ATHR operates within them.</p>
            <p><strong>Flight Control Unit (FCU):</strong> The FCU on the glareshield is the crew&apos;s primary interface with the autoflight system. It controls target values (speed, heading/track, altitude, vertical speed/flight path angle) and switches between managed and selected guidance. Every FCU input either targets a specific value (selected) or hands control to the Flight Management System (managed).</p>
          </Prose>
        </Section>

        <Divider />

        <Section title="Managed vs selected — the fundamental distinction">
          <Prose>
            <p>Every autoflight mode is either <strong>managed</strong> or <strong>selected</strong>. This is the distinction that ATPL orals probe most consistently, because it reveals whether a candidate understands the system or has merely memorised mode names.</p>
            <p><strong>Managed guidance</strong> means the FMS is in control of that parameter. The FCU window for that parameter shows dashes rather than a numerical value. The FMA annunciates the mode in magenta. The aircraft follows the FMS computed profile — the lateral route, the climb or descent profile, the speed schedule.</p>
            <p><strong>Selected guidance</strong> means the pilot has assigned a specific value via the FCU. The FCU window shows the numerical value. The FMA annunciates the mode in green (active) or blue (armed). The aircraft tracks that value.</p>
          </Prose>
          <Callout>
            <strong>The FCU window tells you who is flying:</strong> Dashes in the speed window means the FMS is managing speed. A number means the pilot has selected a target. Same logic applies to heading and vertical guidance windows. Look at the windows — they tell the story at a glance.
          </Callout>
        </Section>

        <Divider />

        <Section title="The FMA — reading the annunciator">
          <Prose>
            <p>The Flight Mode Annunciator occupies the top strip of the Primary Flight Display and is divided into five columns. Reading the FMA correctly, every time, is non-negotiable for safe autoflight operation — and it is the most examined topic in A320 type rating oral assessments.</p>
          </Prose>

          <Prose>
            <p>The five FMA columns, left to right:</p>
            <p><strong>Column 1 — Autothrust mode:</strong> What the ATHR is doing. Common modes: MAN THR (manual thrust, ATHR not active), SPEED (ATHR is maintaining a speed target), or a fixed thrust rating being commanded. The thrust rating appears below the mode — THR CLB, THR MCT, THR IDLE, etc.</p>
            <p><strong>Column 2 — Vertical mode:</strong> How the aircraft is managing altitude and vertical flight path. Modes include: ALT (holding an altitude), ALT* (capturing an altitude — transitioning), CLB / DES (managed climb or descent following FMS profile), OP CLB / OP DES (open climb or descent to selected altitude), V/S (vertical speed mode), FPA (flight path angle mode), G/S* (glideslope capturing), G/S (glideslope captured on ILS approach).</p>
            <p><strong>Column 3 — Lateral mode:</strong> How the aircraft is tracking laterally. Modes include: NAV (following FMS lateral route), HDG (tracking a selected heading), TRACK (tracking a selected track), LOC (localiser captured or capturing), RWY (runway track on takeoff).</p>
            <p><strong>Column 4 — Approach capability:</strong> The approach capability (CAT 1, CAT 2, CAT 3 SINGLE, CAT 3 DUAL) displayed during approach phase. AP OFF in amber indicates the autopilot has disconnected.</p>
            <p><strong>Column 5 — AP, FD and ATHR status:</strong> AP1 or AP2 engagement status, which flight directors are active (1 FD 2 means both are on, left and right), and whether the Autothrust is armed or active (A/THR).</p>
          </Prose>

          <Callout variant="amber">
            <strong>The 10-second box rule:</strong> Any new mode engagement on the FMA is boxed for 10 seconds. This is the system drawing the crew&apos;s attention to a mode change. The correct response is always to look at the FMA, confirm the boxed mode is what you expected, and call it out. A boxed mode you did not expect is an immediate cue to understand why.
          </Callout>
        </Section>

        <Divider />

        <Section title="Vertical modes — the most examined area">
          <DiagramBlock label="Diagram 2 — Vertical mode logic: managed vs selected, and key transitions" caption="Managed modes (green) follow the FMS profile. Selected modes (amber) track a pilot-assigned value. The FCU knob action — push for managed, pull for selected — drives the transition.">
            <VerticalModesDiagram />
          </DiagramBlock>

          <SubSection title="The push/pull logic — the most common oral examination question">
            <Prose>
              <p>The FCU altitude knob has two actions: <strong>push</strong> and <strong>pull</strong>. This is the single most examined autoflight concept in A320 oral assessments, and the one most candidates initially get wrong.</p>
            </Prose>
            <ul style={{ paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 8, fontSize: 15, lineHeight: 1.7, color: 'var(--clr-text)', margin: 0 }}>
              <li><strong>Pull the altitude knob</strong> → Open Climb (OP CLB) or Open Descent (OP DES). The aircraft climbs or descends to the FCU altitude at maximum performance. A selected value is shown in the FCU window. This is the selected guidance mode for the vertical axis.</li>
              <li><strong>Push the altitude knob</strong> → Managed CLB or managed DES. The FMS takes control of the vertical profile. Dashes appear in the altitude window — the FMS is managing. The aircraft follows the FMS computed climb or descent path, which may not use maximum performance.</li>
            </ul>
            <Callout>
              <strong>Memory rule:</strong> Pull = take control (selected). Push = give control to FMS (managed). The same logic applies to the speed and heading knobs — pull gives you a selected value; push gives the FMS control and shows dashes in the window.
            </Callout>
          </SubSection>

          <SubSection title="V/S and FPA modes — and their risk">
            <Prose>
              <p>V/S (Vertical Speed) and FPA (Flight Path Angle) modes are selected by turning and pulling the FCU vertical speed/FPA knob. They allow the pilot to set a specific climb or descent rate.</p>
              <p>The significant operational risk of V/S mode: the ATHR will attempt to maintain the commanded vertical speed even if doing so requires thrust settings that cause the aircraft to decelerate toward minimum speed or accelerate to maximum speed. V/S mode does not protect speed in the way that managed modes do. If an excessive descent rate is selected at a low thrust setting, the aircraft can approach minimum speed while still in an ostensibly normal descent. This is not a theoretical risk — it has been a factor in incidents. V/S must be used with awareness of the speed and thrust state.</p>
            </Prose>
          </SubSection>
        </Section>

        <Divider />

        <Section title="Autothrust modes — speed vs thrust">
          <Prose>
            <p>The ATHR operates in one of two fundamental modes at any time:</p>
            <p><strong>Speed mode:</strong> The ATHR adjusts thrust to maintain the target speed. This is the normal mode during cruise and approach. The FMA annunciates SPEED in column 1. The aircraft holds the speed; altitude is managed by the pitch axis.</p>
            <p><strong>Thrust mode:</strong> The ATHR commands a fixed thrust rating — CLB, MCT, IDLE, or TOGA — and holds it regardless of speed variation. Speed is then controlled by the pitch axis (the FD and AP pitch commands). This is the normal mode during climb and descent in managed guidance. The FMA annunciates the thrust rating (CLB, MCT, etc.) in column 1.</p>
          </Prose>

          <DataTable
            head={['ATHR mode', 'What it controls', 'FMA column 1', 'Typical phase']}
            monoCol={2}
            rows={[
              ['SPEED', 'Adjusts thrust to maintain speed target', 'SPEED', 'Cruise, approach'],
              ['THR CLB', 'Holds climb thrust rating', 'THR CLB', 'Managed climb'],
              ['THR MCT', 'Holds maximum continuous thrust', 'THR MCT', 'Engine-out climb'],
              ['THR IDLE', 'Commands idle thrust', 'THR IDLE', 'Managed descent'],
              ['A.FLOOR', 'Commands TOGA — automatic protection', 'A.FLOOR', 'Alpha floor activation'],
              ['TOGA LK', 'TOGA locked after alpha floor — requires reset', 'TOGA LK', 'After alpha floor event'],
            ]}
          />

          <Prose>
            <p>Alpha Floor is the ATHR protection mode that automatically applies TOGA thrust when the aircraft reaches a high angle of attack threshold, regardless of thrust lever position. Once activated, it locks to TOGA LK on the FMA — the crew must manually move thrust levers to TOGA and then select a lower setting to reset. Alpha Floor activation in normal operations is an abnormal event requiring crew action and understanding of the reset procedure.</p>
          </Prose>
        </Section>

        <Divider />

        <Section title="Key numbers and limitations">
          <DataTable
            head={['Parameter', 'Value']}
            monoCol={1}
            rows={[
              ['Autopilots available', '2 (AP1, AP2)'],
              ['AP engagement minimum height (takeoff)', '100 ft AGL'],
              ['AP engagement minimum height (approach)', 'Per approach type'],
              ['Both APs engaged simultaneously', 'CAT 2/3 approach'],
              ['FMA new mode box duration', '10 seconds'],
              ['Alpha floor activation AoA (approx.)', '~9.5° (conf 0) to ~14° (conf full) — varies by aircraft'],
              ['ATHR speed mode typical activation', 'When thrust mode no longer required'],
              ['FCU altitude knob — pull', 'OP CLB / OP DES (selected)'],
              ['FCU altitude knob — push', 'Managed CLB / DES (FMS)'],
            ]}
          />
        </Section>

        <Divider />

        <Section title="Summary">
          <Prose>
            <p>The A320 autoflight system rewards pilots who understand the logic rather than memorise the modes. The FCU is the interface — every knob push or pull either takes authority away from the FMS or gives it back. The FMA is the readback — it tells you what the system is actually doing, and it boxes every mode change for 10 seconds specifically to demand your attention.</p>
            <p>The managed vs selected distinction runs through every aspect of the system: managed speed shows dashes and annunciates in magenta; selected speed shows a number and annunciates in green. The ATHR is either managing speed or holding a thrust rating — not both simultaneously. The vertical mode is either following the FMS profile or tracking a pilot-selected value.</p>
            <p>Understand those three distinctions clearly and the system becomes predictable. A predictable autoflight system is a safe one.</p>
          </Prose>
        </Section>

        <div style={{ marginTop: 32, padding: 20, background: 'var(--clr-surf-alt)', border: '1px solid var(--clr-border)', borderRadius: 10, fontSize: 13, color: 'var(--clr-text-med)', lineHeight: 1.6 }}>
          <strong style={{ color: 'var(--clr-text)' }}>Note:</strong> This article reflects general A320 family autoflight architecture. Specific mode logic, engagement conditions, and limitations vary by aircraft variant, software standard, and operator procedures. Always refer to your aircraft&apos;s approved FCOM and your operator&apos;s Operations Manual for authoritative procedures. Content reviewed by the ProPilotLicence Captain Panel — four or more active commercial airline captains holding current DGCA CPL and ATPL licences.
        </div>

        <div style={{ marginTop: 48, padding: '24px', background: 'var(--clr-pri-light)', borderRadius: 12, display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div style={{ fontFamily: 'var(--font-outfit),sans-serif', fontSize: 17, fontWeight: 700, color: 'var(--clr-text)' }}>
            More on aircraft systems
          </div>
          <p style={{ fontSize: 14, color: 'var(--clr-text-med)', lineHeight: 1.65, margin: 0 }}>
            ProPilotLicence covers Technical General and Radio Aids &amp; Instruments for the DGCA CPL syllabus, with questions reviewed by active airline captains.
          </p>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginTop: 4 }}>
            <Link href="/subjects/technical-general" style={{ fontSize: 13, fontWeight: 600, color: 'var(--clr-primary)', textDecoration: 'none' }}>Technical General subject →</Link>
            <Link href="/subjects/radio-aids-instruments" style={{ fontSize: 13, fontWeight: 600, color: 'var(--clr-primary)', textDecoration: 'none' }}>Radio Aids &amp; Instruments →</Link>
            <Link href="/guides/dgca-exam-guides" style={{ fontSize: 13, fontWeight: 600, color: 'var(--clr-primary)', textDecoration: 'none' }}>More A320 Systems articles →</Link>
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  )
}

function Divider() {
  return <hr style={{ border: 'none', borderTop: '1px solid var(--clr-border)', margin: '36px 0' }} />
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <h2 style={{ fontFamily: 'var(--font-outfit),sans-serif', fontSize: 22, fontWeight: 700, color: 'var(--clr-text)', letterSpacing: '-0.3px' }}>
        {title}
      </h2>
      {children}
    </section>
  )
}

function SubSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 8 }}>
      <h3 style={{ fontFamily: 'var(--font-outfit),sans-serif', fontSize: 16, fontWeight: 700, color: 'var(--clr-text)' }}>{title}</h3>
      {children}
    </div>
  )
}

function Prose({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ fontSize: 16, lineHeight: 1.75, color: 'var(--clr-text)', display: 'flex', flexDirection: 'column', gap: 14 }}>
      {children}
    </div>
  )
}

function Callout({ children, variant = 'primary' }: { children: React.ReactNode; variant?: 'primary' | 'amber' }) {
  const isAmber = variant === 'amber'
  return (
    <div
      style={{
        background: isAmber ? 'var(--clr-amber-light)' : 'var(--clr-pri-light)',
        borderLeft: `3px solid ${isAmber ? 'var(--clr-amber)' : 'var(--clr-primary)'}`,
        borderRadius: '0 8px 8px 0',
        padding: '14px 18px',
        fontSize: 14,
        lineHeight: 1.7,
        color: 'var(--clr-text)',
      }}
    >
      {children}
    </div>
  )
}

function DiagramBlock({ label, caption, children }: { label: string; caption: string; children: React.ReactNode }) {
  return (
    <div style={{ border: '1px solid var(--clr-border)', borderRadius: 10, overflow: 'hidden', background: 'var(--clr-surf-alt)' }}>
      <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--clr-text-med)', padding: '10px 16px', borderBottom: '1px solid var(--clr-border)', background: 'var(--clr-surface)' }}>
        {label}
      </div>
      <div style={{ padding: '20px 16px', overflowX: 'auto' }}>
        {children}
      </div>
      <div style={{ fontSize: 13, color: 'var(--clr-text-med)', padding: '10px 16px', borderTop: '1px solid var(--clr-border)', background: 'var(--clr-surface)', fontStyle: 'italic' }}>
        {caption}
      </div>
    </div>
  )
}

function DataTable({ head, rows, monoCol }: { head: string[]; rows: string[][]; monoCol?: number }) {
  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
        <thead>
          <tr>
            {head.map((h) => (
              <th key={h} style={{ textAlign: 'left', fontSize: 11, fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase', color: 'var(--clr-text-med)', padding: '10px 14px', background: 'var(--clr-surf-alt)', borderBottom: '1px solid var(--clr-border)' }}>
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i}>
              {row.map((cell, j) => (
                <td
                  key={j}
                  style={{
                    padding: '11px 14px',
                    borderBottom: i < rows.length - 1 ? '1px solid var(--clr-border)' : 'none',
                    color: j === monoCol ? 'var(--clr-primary)' : 'var(--clr-text)',
                    verticalAlign: 'top',
                    fontFamily: j === monoCol ? MONO : undefined,
                    fontSize: j === monoCol ? 13 : undefined,
                  }}
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function ArchitectureDiagram() {
  return (
    <svg viewBox="0 0 700 440" role="img" style={{ display: 'block', width: '100%' }}>
      <title>A320 Autoflight System Architecture</title>
      <desc>Four components of the autoflight system: FCU (input), AP/FD, ATHR, and FMA (output), with their relationships and what each controls.</desc>
      <defs>
        <marker id="a1" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
          <path d="M2 2L8 5L2 8" fill="none" stroke="context-stroke" strokeWidth="1.5" strokeLinecap="round" />
        </marker>
      </defs>

      <rect x="260" y="24" width="180" height="72" rx="10" fill="#eef2fc" stroke="#1a4fc4" strokeWidth="1" />
      <text x="350" y="50" textAnchor="middle" fontFamily="var(--font-outfit),sans-serif" fontSize="13" fontWeight="600" fill="#1a4fc4">FCU</text>
      <text x="350" y="66" textAnchor="middle" fontFamily="var(--font-outfit),sans-serif" fontSize="10" fill="#1a4fc4">Flight Control Unit</text>
      <text x="350" y="82" textAnchor="middle" fontFamily="var(--font-outfit),sans-serif" fontSize="10" fill="#6b7080">Pilot input — glareshield</text>

      <rect x="40" y="172" width="170" height="96" rx="10" fill="#e6f4ee" stroke="#0b6e48" strokeWidth="1" />
      <text x="125" y="198" textAnchor="middle" fontFamily="var(--font-outfit),sans-serif" fontSize="13" fontWeight="600" fill="#0b6e48">AP</text>
      <text x="125" y="214" textAnchor="middle" fontFamily="var(--font-outfit),sans-serif" fontSize="10" fill="#0b6e48">Autopilot</text>
      <text x="125" y="232" textAnchor="middle" fontFamily="var(--font-outfit),sans-serif" fontSize="10" fill="#353a47">Controls flight surfaces</text>
      <text x="125" y="247" textAnchor="middle" fontFamily="var(--font-outfit),sans-serif" fontSize="10" fill="#353a47">via FAC / ELAC / SEC</text>
      <text x="125" y="262" textAnchor="middle" fontFamily="var(--font-outfit),sans-serif" fontSize="10" fill="#6b7080">2 independent APs</text>

      <rect x="265" y="172" width="170" height="96" rx="10" fill="#eeecfd" stroke="#4f3eb5" strokeWidth="1" />
      <text x="350" y="198" textAnchor="middle" fontFamily="var(--font-outfit),sans-serif" fontSize="13" fontWeight="600" fill="#4f3eb5">FD</text>
      <text x="350" y="214" textAnchor="middle" fontFamily="var(--font-outfit),sans-serif" fontSize="10" fill="#4f3eb5">Flight Director</text>
      <text x="350" y="232" textAnchor="middle" fontFamily="var(--font-outfit),sans-serif" fontSize="10" fill="#353a47">Guidance bars on PFD</text>
      <text x="350" y="247" textAnchor="middle" fontFamily="var(--font-outfit),sans-serif" fontSize="10" fill="#353a47">Commands to fly manually</text>
      <text x="350" y="262" textAnchor="middle" fontFamily="var(--font-outfit),sans-serif" fontSize="10" fill="#6b7080">No surface authority</text>

      <rect x="490" y="172" width="170" height="96" rx="10" fill="#fdf4dc" stroke="#8a5c00" strokeWidth="1" />
      <text x="575" y="198" textAnchor="middle" fontFamily="var(--font-outfit),sans-serif" fontSize="13" fontWeight="600" fill="#8a5c00">ATHR</text>
      <text x="575" y="214" textAnchor="middle" fontFamily="var(--font-outfit),sans-serif" fontSize="10" fill="#8a5c00">Autothrust</text>
      <text x="575" y="232" textAnchor="middle" fontFamily="var(--font-outfit),sans-serif" fontSize="10" fill="#353a47">Controls thrust levers</text>
      <text x="575" y="247" textAnchor="middle" fontFamily="var(--font-outfit),sans-serif" fontSize="10" fill="#353a47">via FADEC commands</text>
      <text x="575" y="262" textAnchor="middle" fontFamily="var(--font-outfit),sans-serif" fontSize="10" fill="#6b7080">Speed or thrust mode</text>

      <rect x="260" y="336" width="180" height="72" rx="10" fill="#0d1117" stroke="#444c63" strokeWidth="1" />
      <text x="350" y="362" textAnchor="middle" fontFamily="var(--font-outfit),sans-serif" fontSize="13" fontWeight="600" fill="#00e676">FMA</text>
      <text x="350" y="378" textAnchor="middle" fontFamily="var(--font-outfit),sans-serif" fontSize="10" fill="#e8eaf6">Flight Mode Annunciator</text>
      <text x="350" y="394" textAnchor="middle" fontFamily="var(--font-outfit),sans-serif" fontSize="10" fill="#444c63">Top of PFD — mode status</text>

      <path d="M300 96 L200 96 L200 170" stroke="#1a4fc4" strokeWidth="1.2" fill="none" markerEnd="url(#a1)" />
      <path d="M350 96 L350 170" stroke="#1a4fc4" strokeWidth="1.2" fill="none" markerEnd="url(#a1)" />
      <path d="M400 96 L500 96 L500 170" stroke="#1a4fc4" strokeWidth="1.2" fill="none" markerEnd="url(#a1)" />

      <path d="M125 268 L125 372 L258 372" stroke="#0b6e48" strokeWidth="1" fill="none" strokeDasharray="4 3" markerEnd="url(#a1)" />
      <path d="M350 268 L350 334" stroke="#4f3eb5" strokeWidth="1" fill="none" strokeDasharray="4 3" markerEnd="url(#a1)" />
      <path d="M575 268 L575 372 L442 372" stroke="#8a5c00" strokeWidth="1" fill="none" strokeDasharray="4 3" markerEnd="url(#a1)" />

      <text x="198" y="92" textAnchor="middle" fontFamily="var(--font-outfit),sans-serif" fontSize="9" fill="#6b7080">commands</text>
      <text x="502" y="92" textAnchor="middle" fontFamily="var(--font-outfit),sans-serif" fontSize="9" fill="#6b7080">commands</text>
      <text x="124" y="320" textAnchor="middle" fontFamily="var(--font-outfit),sans-serif" fontSize="9" fill="#6b7080">annunciates</text>
      <text x="576" y="320" textAnchor="middle" fontFamily="var(--font-outfit),sans-serif" fontSize="9" fill="#6b7080">annunciates</text>

      <line x1="40" y1="424" x2="72" y2="424" stroke="#353a47" strokeWidth="1.2" fill="none" />
      <text x="78" y="428" fontFamily="var(--font-outfit),sans-serif" fontSize="9" fill="#6b7080">Command flow</text>
      <line x1="170" y1="424" x2="202" y2="424" stroke="#353a47" strokeWidth="1.2" strokeDasharray="4 3" fill="none" />
      <text x="208" y="428" fontFamily="var(--font-outfit),sans-serif" fontSize="9" fill="#6b7080">Status / annunciation</text>
    </svg>
  )
}

function VerticalModesDiagram() {
  return (
    <svg viewBox="0 0 700 460" role="img" style={{ display: 'block', width: '100%' }}>
      <title>A320 Vertical Mode Transitions</title>
      <desc>Flow diagram showing how vertical modes transition during a typical flight, from takeoff through cruise to approach.</desc>
      <defs>
        <marker id="a3" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
          <path d="M2 2L8 5L2 8" fill="none" stroke="context-stroke" strokeWidth="1.5" strokeLinecap="round" />
        </marker>
      </defs>

      <text x="60" y="22" fontFamily="var(--font-outfit),sans-serif" fontSize="10" fontWeight="600" fill="#6b7080" letterSpacing="0.06em">TAKEOFF</text>
      <text x="224" y="22" fontFamily="var(--font-outfit),sans-serif" fontSize="10" fontWeight="600" fill="#6b7080" letterSpacing="0.06em">CLIMB</text>
      <text x="378" y="22" fontFamily="var(--font-outfit),sans-serif" fontSize="10" fontWeight="600" fill="#6b7080" letterSpacing="0.06em">CRUISE</text>
      <text x="524" y="22" fontFamily="var(--font-outfit),sans-serif" fontSize="10" fontWeight="600" fill="#6b7080" letterSpacing="0.06em">DESCENT/APPR</text>

      <rect x="28" y="40" width="120" height="52" rx="8" fill="#eeecfd" stroke="#4f3eb5" strokeWidth="1" />
      <text x="88" y="62" textAnchor="middle" fontFamily="var(--font-outfit),sans-serif" fontSize="12" fontWeight="600" fill="#4f3eb5">SRS</text>
      <text x="88" y="78" textAnchor="middle" fontFamily="var(--font-outfit),sans-serif" fontSize="10" fill="#353a47">Speed Reference</text>
      <text x="88" y="90" textAnchor="middle" fontFamily="var(--font-outfit),sans-serif" fontSize="9" fill="#6b7080">V2+10 target / TOGA</text>

      <rect x="192" y="40" width="120" height="52" rx="8" fill="#e6f4ee" stroke="#0b6e48" strokeWidth="1" />
      <text x="252" y="62" textAnchor="middle" fontFamily="var(--font-outfit),sans-serif" fontSize="12" fontWeight="600" fill="#0b6e48">CLB</text>
      <text x="252" y="78" textAnchor="middle" fontFamily="var(--font-outfit),sans-serif" fontSize="10" fill="#353a47">Managed climb</text>
      <text x="252" y="90" textAnchor="middle" fontFamily="var(--font-outfit),sans-serif" fontSize="9" fill="#6b7080">FMS speed + profile</text>

      <rect x="356" y="40" width="120" height="52" rx="8" fill="#e6f4ee" stroke="#0b6e48" strokeWidth="1" />
      <text x="416" y="62" textAnchor="middle" fontFamily="var(--font-outfit),sans-serif" fontSize="12" fontWeight="600" fill="#0b6e48">ALT*</text>
      <text x="416" y="78" textAnchor="middle" fontFamily="var(--font-outfit),sans-serif" fontSize="10" fill="#353a47">Altitude capture</text>
      <text x="416" y="90" textAnchor="middle" fontFamily="var(--font-outfit),sans-serif" fontSize="9" fill="#6b7080">Transitioning to level</text>

      <rect x="520" y="40" width="120" height="52" rx="8" fill="#e6f4ee" stroke="#0b6e48" strokeWidth="1" />
      <text x="580" y="62" textAnchor="middle" fontFamily="var(--font-outfit),sans-serif" fontSize="12" fontWeight="600" fill="#0b6e48">ALT</text>
      <text x="580" y="78" textAnchor="middle" fontFamily="var(--font-outfit),sans-serif" fontSize="10" fill="#353a47">Level hold</text>
      <text x="580" y="90" textAnchor="middle" fontFamily="var(--font-outfit),sans-serif" fontSize="9" fill="#6b7080">At FCU altitude</text>

      <path d="M148 66 L190 66" stroke="#353a47" strokeWidth="1.2" fill="none" markerEnd="url(#a3)" />
      <path d="M312 66 L354 66" stroke="#353a47" strokeWidth="1.2" fill="none" markerEnd="url(#a3)" />
      <path d="M476 66 L518 66" stroke="#353a47" strokeWidth="1.2" fill="none" markerEnd="url(#a3)" />

      <rect x="192" y="140" width="120" height="52" rx="8" fill="#fdf4dc" stroke="#8a5c00" strokeWidth="1" />
      <text x="252" y="162" textAnchor="middle" fontFamily="var(--font-outfit),sans-serif" fontSize="12" fontWeight="600" fill="#8a5c00">OP CLB</text>
      <text x="252" y="178" textAnchor="middle" fontFamily="var(--font-outfit),sans-serif" fontSize="10" fill="#353a47">Open climb</text>
      <text x="252" y="190" textAnchor="middle" fontFamily="var(--font-outfit),sans-serif" fontSize="9" fill="#6b7080">Selected altitude, max thrust</text>

      <rect x="356" y="140" width="120" height="52" rx="8" fill="#fdf4dc" stroke="#8a5c00" strokeWidth="1" />
      <text x="416" y="162" textAnchor="middle" fontFamily="var(--font-outfit),sans-serif" fontSize="12" fontWeight="600" fill="#8a5c00">V/S</text>
      <text x="416" y="178" textAnchor="middle" fontFamily="var(--font-outfit),sans-serif" fontSize="10" fill="#353a47">Vertical speed</text>
      <text x="416" y="190" textAnchor="middle" fontFamily="var(--font-outfit),sans-serif" fontSize="9" fill="#6b7080">Pilot-selected fpm target</text>

      <rect x="520" y="140" width="120" height="52" rx="8" fill="#fdecea" stroke="#991f1f" strokeWidth="1" />
      <text x="580" y="158" textAnchor="middle" fontFamily="var(--font-outfit),sans-serif" fontSize="12" fontWeight="600" fill="#991f1f">DES / OP DES</text>
      <text x="580" y="174" textAnchor="middle" fontFamily="var(--font-outfit),sans-serif" fontSize="10" fill="#353a47">Managed / open descent</text>
      <text x="580" y="190" textAnchor="middle" fontFamily="var(--font-outfit),sans-serif" fontSize="9" fill="#6b7080">FMS path or selected alt</text>

      <rect x="356" y="240" width="120" height="52" rx="8" fill="#eeecfd" stroke="#4f3eb5" strokeWidth="1" />
      <text x="416" y="262" textAnchor="middle" fontFamily="var(--font-outfit),sans-serif" fontSize="12" fontWeight="600" fill="#4f3eb5">G/S</text>
      <text x="416" y="278" textAnchor="middle" fontFamily="var(--font-outfit),sans-serif" fontSize="10" fill="#353a47">Glideslope</text>
      <text x="416" y="290" textAnchor="middle" fontFamily="var(--font-outfit),sans-serif" fontSize="9" fill="#6b7080">ILS glidepath captured</text>

      <rect x="520" y="240" width="120" height="52" rx="8" fill="#eeecfd" stroke="#4f3eb5" strokeWidth="1" />
      <text x="580" y="262" textAnchor="middle" fontFamily="var(--font-outfit),sans-serif" fontSize="12" fontWeight="600" fill="#4f3eb5">FLARE</text>
      <text x="580" y="278" textAnchor="middle" fontFamily="var(--font-outfit),sans-serif" fontSize="10" fill="#353a47">Auto flare</text>
      <text x="580" y="290" textAnchor="middle" fontFamily="var(--font-outfit),sans-serif" fontSize="9" fill="#6b7080">CAT 2/3 only</text>

      <path d="M148 90 L148 166 L190 166" stroke="#8a5c00" strokeWidth="1" strokeDasharray="4 3" fill="none" markerEnd="url(#a3)" />
      <text x="155" y="140" fontFamily="var(--font-outfit),sans-serif" fontSize="9" fill="#8a5c00">pull FCU</text>
      <text x="155" y="152" fontFamily="var(--font-outfit),sans-serif" fontSize="9" fill="#8a5c00">altitude</text>

      <path d="M312 166 L354 166" stroke="#8a5c00" strokeWidth="1" fill="none" markerEnd="url(#a3)" />
      <path d="M476 166 L518 166" stroke="#991f1f" strokeWidth="1" fill="none" markerEnd="url(#a3)" />
      <path d="M476 266 L518 266" stroke="#4f3eb5" strokeWidth="1" fill="none" markerEnd="url(#a3)" />
      <path d="M416 192 L416 238" stroke="#4f3eb5" strokeWidth="1" fill="none" markerEnd="url(#a3)" />
      <text x="420" y="220" fontFamily="var(--font-outfit),sans-serif" fontSize="9" fill="#4f3eb5">ILS armed</text>
      <text x="420" y="232" fontFamily="var(--font-outfit),sans-serif" fontSize="9" fill="#4f3eb5">→ captured</text>

      <rect x="28" y="380" width="14" height="14" rx="3" fill="#e6f4ee" stroke="#0b6e48" strokeWidth="1" />
      <text x="48" y="391" fontFamily="var(--font-outfit),sans-serif" fontSize="10" fill="#6b7080">Managed mode (FMS controls)</text>
      <rect x="220" y="380" width="14" height="14" rx="3" fill="#fdf4dc" stroke="#8a5c00" strokeWidth="1" />
      <text x="240" y="391" fontFamily="var(--font-outfit),sans-serif" fontSize="10" fill="#6b7080">Selected mode (pilot sets target)</text>
      <rect x="450" y="380" width="14" height="14" rx="3" fill="#eeecfd" stroke="#4f3eb5" strokeWidth="1" />
      <text x="470" y="391" fontFamily="var(--font-outfit),sans-serif" fontSize="10" fill="#6b7080">Approach / landing modes</text>

      <text x="350" y="440" textAnchor="middle" fontFamily="var(--font-outfit),sans-serif" fontSize="10" fill="#6b7080">Pulling the FCU altitude knob selects OP CLB/DES. Turning selects a target. Pushing engages managed.</text>
    </svg>
  )
}
