// Verbatim body from the captain-panel-reviewed source, i.e. the inner HTML of
// <main class="article-wrap">. Do NOT hand-edit the diagrams, animation classes,
// ⚑ FCOM flags, or disclaimer — reviewed and approved content.
// Styling is applied via the sibling styles.module.css (scoped; structural vars
// remapped to site palette, Green/Blue/Yellow system colours kept fixed to match
// the diagrams).
export const ARTICLE_HEAD = String.raw`
  <div class="eyebrow">A320 Systems — Hydraulics</div>
  <h1>A320 Hydraulic System — Complete Guide: Systems, Services, Failures and Effects</h1>

  <p class="standfirst">Three independent 3,000 PSI circuits. No single failure removes all hydraulic power. But the effects of each individual failure cascade through flight controls, braking, landing gear, flaps, slats, and the spoilers — and understanding exactly what is lost and what remains is fundamental knowledge for any A320 type rating and ATPL oral.</p>

  <div class="byline">
    <strong>ProPilotLicence Editorial</strong>
    <span class="byline-dot">·</span>
    <span>Reviewed by the ProPilotLicence Captain Panel</span>
    <span class="byline-dot">·</span>
    <span>ATPL / Type Rating</span>
  </div>

`

export const ARTICLE_BODY = String.raw`
  <h2 class="first">System overview</h2>

  <p>The A320 has three independent hydraulic systems — <span class="pill pill-green">Green</span> <span class="pill pill-blue">Blue</span> <span class="pill pill-yellow">Yellow</span> — each operating at a nominal pressure of 3,000 PSI (206 bar). The systems are completely independent: they use separate reservoirs, separate fluid circuits, and separate pressurisation sources. No fluid is shared between circuits under any normal condition. A leak in one system cannot drain another.</p>

  <p>Each system consists of:</p>
  <ul>
    <li>A reservoir (pressurised to prevent pump cavitation)</li>
    <li>One or more pumps (engine-driven and/or electric)</li>
    <li>Pressure regulation and filtration components</li>
    <li>Actuators at each powered surface or system</li>
    <li>A leak measurement system (LMS) for reservoir quantity monitoring</li>
  </ul>

  <p>The working fluid is a phosphate ester hydraulic fluid (Skydrol or equivalent), which is fire-resistant but highly corrosive to skin and eye tissue. Ground engineers handle it with full PPE. The colour coding — green, blue, yellow — exists only in training diagrams; the fluid itself is not coloured differently.</p>

  <!-- DIAGRAM 1: Animated overview -->
  <div class="diagram-block">
    <div class="diagram-label">Diagram 1 — Fluid flow through all three circuits <span class="anim-badge">Animated</span></div>
    <div class="diagram-inner">
      <svg viewBox="0 0 720 460" role="img">
        <title>A320 hydraulic system fluid flow — Green, Blue and Yellow circuits with pumps and powered services</title>
        <defs>
          <marker id="mg" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto">
            <path d="M2 2L8 5L2 8" fill="none" stroke="#1D9E75" stroke-width="1.5" stroke-linecap="round"/>
          </marker>
          <marker id="mb" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto">
            <path d="M2 2L8 5L2 8" fill="none" stroke="#185FA5" stroke-width="1.5" stroke-linecap="round"/>
          </marker>
          <marker id="my" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto">
            <path d="M2 2L8 5L2 8" fill="none" stroke="#BA7517" stroke-width="1.5" stroke-linecap="round"/>
          </marker>
        </defs>

        <!-- GREEN -->
        <rect x="20" y="16" width="210" height="428" rx="10" fill="#e6f4ee" stroke="#1D9E75" stroke-width="1"/>
        <text x="125" y="40" text-anchor="middle" font-family="Inter,sans-serif" font-size="13" font-weight="600" fill="#0b6e48">Green system</text>
        <text x="125" y="56" text-anchor="middle" font-family="Inter,sans-serif" font-size="10" fill="#0F6E56">3,000 PSI · ENG 1 driven</text>
        <!-- Pumps -->
        <rect x="38" y="68" width="174" height="30" rx="5" fill="#fff" stroke="#9FE1CB" stroke-width="0.75"/>
        <text x="125" y="84" text-anchor="middle" font-family="Inter,sans-serif" font-size="10" font-weight="600" fill="#085041">ENG 1 EDP (primary)</text>
        <text x="125" y="96" text-anchor="middle" font-family="Inter,sans-serif" font-size="9" fill="#0F6E56">~37 l/min at 3,000 PSI ⚑</text>
        <rect x="38" y="106" width="174" height="28" rx="5" fill="#fff" stroke="#9FE1CB" stroke-width="0.75"/>
        <text x="125" y="120" text-anchor="middle" font-family="Inter,sans-serif" font-size="10" font-weight="600" fill="#085041">Electric pump (backup)</text>
        <text x="125" y="131" text-anchor="middle" font-family="Inter,sans-serif" font-size="9" fill="#0F6E56">~11 l/min · AC powered ⚑</text>
        <!-- Flow line -->
        <line x1="125" y1="134" x2="125" y2="156" stroke="#1D9E75" stroke-width="2" class="fg" marker-end="url(#mg)"/>
        <!-- Services -->
        <rect x="38" y="158" width="174" height="24" rx="4" fill="#fff" stroke="#9FE1CB" stroke-width="0.75"/>
        <text x="125" y="175" text-anchor="middle" font-family="Inter,sans-serif" font-size="10" fill="#085041">Normal braking</text>
        <rect x="38" y="188" width="174" height="24" rx="4" fill="#fff" stroke="#9FE1CB" stroke-width="0.75"/>
        <text x="125" y="205" text-anchor="middle" font-family="Inter,sans-serif" font-size="10" fill="#085041">Anti-skid (normal)</text>
        <rect x="38" y="218" width="174" height="24" rx="4" fill="#fff" stroke="#9FE1CB" stroke-width="0.75"/>
        <text x="125" y="235" text-anchor="middle" font-family="Inter,sans-serif" font-size="10" fill="#085041">Landing gear (ext/ret)</text>
        <rect x="38" y="248" width="174" height="24" rx="4" fill="#fff" stroke="#9FE1CB" stroke-width="0.75"/>
        <text x="125" y="265" text-anchor="middle" font-family="Inter,sans-serif" font-size="10" fill="#085041">Nose wheel steering</text>
        <rect x="38" y="278" width="174" height="24" rx="4" fill="#fff" stroke="#9FE1CB" stroke-width="0.75"/>
        <text x="125" y="295" text-anchor="middle" font-family="Inter,sans-serif" font-size="10" fill="#085041">Flight controls (primary)</text>
        <rect x="38" y="308" width="174" height="24" rx="4" fill="#fff" stroke="#9FE1CB" stroke-width="0.75"/>
        <text x="125" y="325" text-anchor="middle" font-family="Inter,sans-serif" font-size="10" fill="#085041">Ground spoilers (some)</text>
        <rect x="38" y="338" width="174" height="24" rx="4" fill="#fff" stroke="#9FE1CB" stroke-width="0.75"/>
        <text x="125" y="355" text-anchor="middle" font-family="Inter,sans-serif" font-size="10" fill="#085041">Flaps (via PCU)</text>
        <!-- Reservoir -->
        <rect x="38" y="390" width="174" height="40" rx="6" fill="rgba(255,255,255,0.6)" stroke="#9FE1CB" stroke-width="0.75"/>
        <text x="125" y="408" text-anchor="middle" font-family="Inter,sans-serif" font-size="10" font-weight="600" fill="#0b6e48">Reservoir: ~13 L ⚑</text>
        <text x="125" y="422" text-anchor="middle" font-family="Inter,sans-serif" font-size="9" fill="#0F6E56">Pressurised by bleed air / Yellow sys</text>
        <!-- Animated flow lines between services -->
        <line x1="125" y1="182" x2="125" y2="186" stroke="#1D9E75" stroke-width="1.5" class="fg"/>
        <line x1="125" y1="212" x2="125" y2="216" stroke="#1D9E75" stroke-width="1.5" class="fg"/>
        <line x1="125" y1="242" x2="125" y2="246" stroke="#1D9E75" stroke-width="1.5" class="fg"/>
        <line x1="125" y1="272" x2="125" y2="276" stroke="#1D9E75" stroke-width="1.5" class="fg"/>
        <line x1="125" y1="302" x2="125" y2="306" stroke="#1D9E75" stroke-width="1.5" class="fg"/>
        <line x1="125" y1="332" x2="125" y2="336" stroke="#1D9E75" stroke-width="1.5" class="fg"/>

        <!-- BLUE -->
        <rect x="255" y="16" width="210" height="428" rx="10" fill="#e6f1fb" stroke="#185FA5" stroke-width="1"/>
        <text x="360" y="40" text-anchor="middle" font-family="Inter,sans-serif" font-size="13" font-weight="600" fill="#185FA5">Blue system</text>
        <text x="360" y="56" text-anchor="middle" font-family="Inter,sans-serif" font-size="10" fill="#185FA5">3,000 PSI · Electric pump only</text>
        <rect x="273" y="68" width="174" height="30" rx="5" fill="#fff" stroke="#B5D4F4" stroke-width="0.75"/>
        <text x="360" y="84" text-anchor="middle" font-family="Inter,sans-serif" font-size="10" font-weight="600" fill="#0C447C">Electric pump (primary)</text>
        <text x="360" y="96" text-anchor="middle" font-family="Inter,sans-serif" font-size="9" fill="#185FA5">~11 l/min · AC powered ⚑</text>
        <rect x="273" y="106" width="174" height="28" rx="5" fill="#fff" stroke="#B5D4F4" stroke-width="0.75"/>
        <text x="360" y="120" text-anchor="middle" font-family="Inter,sans-serif" font-size="10" font-weight="600" fill="#0C447C">RAT (emergency)</text>
        <text x="360" y="131" text-anchor="middle" font-family="Inter,sans-serif" font-size="9" fill="#185FA5">Auto-deploys on dual gen fail</text>
        <line x1="360" y1="134" x2="360" y2="156" stroke="#185FA5" stroke-width="2" class="fb" marker-end="url(#mb)"/>
        <rect x="273" y="158" width="174" height="24" rx="4" fill="#fff" stroke="#B5D4F4" stroke-width="0.75"/>
        <text x="360" y="175" text-anchor="middle" font-family="Inter,sans-serif" font-size="10" fill="#0C447C">Flight controls (backup)</text>
        <rect x="273" y="188" width="174" height="24" rx="4" fill="#fff" stroke="#B5D4F4" stroke-width="0.75"/>
        <text x="360" y="205" text-anchor="middle" font-family="Inter,sans-serif" font-size="10" fill="#0C447C">Slats (primary)</text>
        <rect x="273" y="218" width="174" height="24" rx="4" fill="#fff" stroke="#B5D4F4" stroke-width="0.75"/>
        <text x="360" y="235" text-anchor="middle" font-family="Inter,sans-serif" font-size="10" fill="#0C447C">CSM/U (emer. generation)</text>
        <rect x="273" y="248" width="174" height="24" rx="4" fill="#fff" stroke="#B5D4F4" stroke-width="0.75"/>
        <text x="360" y="265" text-anchor="middle" font-family="Inter,sans-serif" font-size="10" fill="#0C447C">Spoilers (some panels)</text>
        <rect x="273" y="278" width="174" height="40" rx="4" fill="rgba(255,255,255,0.5)" stroke="#B5D4F4" stroke-width="0.75"/>
        <text x="360" y="296" text-anchor="middle" font-family="Inter,sans-serif" font-size="10" fill="#0C447C" font-weight="600">No normal braking</text>
        <text x="360" y="309" text-anchor="middle" font-family="Inter,sans-serif" font-size="9" fill="#185FA5">No landing gear</text>
        <text x="360" y="321" text-anchor="middle" font-family="Inter,sans-serif" font-size="9" fill="#185FA5">No nose wheel steering</text>
        <rect x="273" y="390" width="174" height="40" rx="6" fill="rgba(255,255,255,0.6)" stroke="#B5D4F4" stroke-width="0.75"/>
        <text x="360" y="408" text-anchor="middle" font-family="Inter,sans-serif" font-size="10" font-weight="600" fill="#185FA5">Reservoir: ~6.5 L ⚑</text>
        <text x="360" y="422" text-anchor="middle" font-family="Inter,sans-serif" font-size="9" fill="#185FA5">Pressurised by Yellow system</text>
        <line x1="360" y1="182" x2="360" y2="186" stroke="#185FA5" stroke-width="1.5" class="fb"/>
        <line x1="360" y1="212" x2="360" y2="216" stroke="#185FA5" stroke-width="1.5" class="fb"/>
        <line x1="360" y1="242" x2="360" y2="246" stroke="#185FA5" stroke-width="1.5" class="fb"/>
        <line x1="360" y1="272" x2="360" y2="276" stroke="#185FA5" stroke-width="1.5" class="fb"/>

        <!-- YELLOW -->
        <rect x="490" y="16" width="210" height="428" rx="10" fill="#fdf4dc" stroke="#BA7517" stroke-width="1"/>
        <text x="595" y="40" text-anchor="middle" font-family="Inter,sans-serif" font-size="13" font-weight="600" fill="#7a5200">Yellow system</text>
        <text x="595" y="56" text-anchor="middle" font-family="Inter,sans-serif" font-size="10" fill="#854F0B">3,000 PSI · ENG 2 driven</text>
        <rect x="508" y="68" width="174" height="30" rx="5" fill="#fff" stroke="#FAC775" stroke-width="0.75"/>
        <text x="595" y="84" text-anchor="middle" font-family="Inter,sans-serif" font-size="10" font-weight="600" fill="#633806">ENG 2 EDP (primary)</text>
        <text x="595" y="96" text-anchor="middle" font-family="Inter,sans-serif" font-size="9" fill="#854F0B">~37 l/min at 3,000 PSI ⚑</text>
        <rect x="508" y="106" width="174" height="28" rx="5" fill="#fff" stroke="#FAC775" stroke-width="0.75"/>
        <text x="595" y="120" text-anchor="middle" font-family="Inter,sans-serif" font-size="10" font-weight="600" fill="#633806">Electric pump (backup)</text>
        <text x="595" y="131" text-anchor="middle" font-family="Inter,sans-serif" font-size="9" fill="#854F0B">~11 l/min · AC powered ⚑</text>
        <line x1="595" y1="134" x2="595" y2="156" stroke="#BA7517" stroke-width="2" class="fy" marker-end="url(#my)"/>
        <rect x="508" y="158" width="174" height="24" rx="4" fill="#fff" stroke="#FAC775" stroke-width="0.75"/>
        <text x="595" y="175" text-anchor="middle" font-family="Inter,sans-serif" font-size="10" fill="#633806">Alternate braking</text>
        <rect x="508" y="188" width="174" height="24" rx="4" fill="#fff" stroke="#FAC775" stroke-width="0.75"/>
        <text x="595" y="205" text-anchor="middle" font-family="Inter,sans-serif" font-size="10" fill="#633806">Anti-skid (alternate)</text>
        <rect x="508" y="218" width="174" height="24" rx="4" fill="#fff" stroke="#FAC775" stroke-width="0.75"/>
        <text x="595" y="235" text-anchor="middle" font-family="Inter,sans-serif" font-size="10" fill="#633806">Cargo doors</text>
        <rect x="508" y="248" width="174" height="24" rx="4" fill="#fff" stroke="#FAC775" stroke-width="0.75"/>
        <text x="595" y="265" text-anchor="middle" font-family="Inter,sans-serif" font-size="10" fill="#633806">Flight controls (backup)</text>
        <rect x="508" y="278" width="174" height="24" rx="4" fill="#fff" stroke="#FAC775" stroke-width="0.75"/>
        <text x="595" y="295" text-anchor="middle" font-family="Inter,sans-serif" font-size="10" fill="#633806">Spoilers (some panels)</text>
        <rect x="508" y="308" width="174" height="24" rx="4" fill="#fff" stroke="#FAC775" stroke-width="0.75"/>
        <text x="595" y="325" text-anchor="middle" font-family="Inter,sans-serif" font-size="10" fill="#633806">PTU output (to Green)</text>
        <rect x="508" y="338" width="174" height="24" rx="4" fill="#fff" stroke="#FAC775" stroke-width="0.75"/>
        <text x="595" y="355" text-anchor="middle" font-family="Inter,sans-serif" font-size="10" fill="#633806">Pressurises Blue reservoir</text>
        <rect x="508" y="390" width="174" height="40" rx="6" fill="rgba(255,255,255,0.6)" stroke="#FAC775" stroke-width="0.75"/>
        <text x="595" y="408" text-anchor="middle" font-family="Inter,sans-serif" font-size="10" font-weight="600" fill="#7a5200">Reservoir: ~12 L ⚑</text>
        <text x="595" y="422" text-anchor="middle" font-family="Inter,sans-serif" font-size="9" fill="#854F0B">Pressurised by bleed air</text>
        <line x1="595" y1="182" x2="595" y2="186" stroke="#BA7517" stroke-width="1.5" class="fy"/>
        <line x1="595" y1="212" x2="595" y2="216" stroke="#BA7517" stroke-width="1.5" class="fy"/>
        <line x1="595" y1="242" x2="595" y2="246" stroke="#BA7517" stroke-width="1.5" class="fy"/>
        <line x1="595" y1="272" x2="595" y2="276" stroke="#BA7517" stroke-width="1.5" class="fy"/>
        <line x1="595" y1="302" x2="595" y2="306" stroke="#BA7517" stroke-width="1.5" class="fy"/>
        <line x1="595" y1="332" x2="595" y2="336" stroke="#BA7517" stroke-width="1.5" class="fy"/>
      </svg>
    </div>
    <div class="diagram-caption">⚑ = values require verification against your operator's FCOM. Blue system has no engine-driven pump — it relies entirely on an electric pump and the RAT in emergencies. Note that Blue does not power normal braking, landing gear, or nose wheel steering.</div>
  </div>

  <h2>All services — complete breakdown by system</h2>

  <div class="service-grid">
    <div class="service-card green">
      <h3>🟢 Green system services</h3>
      <ul>
        <li>Normal braking system</li>
        <li>Anti-skid (normal mode)</li>
        <li>Landing gear extension and retraction</li>
        <li>Landing gear doors</li>
        <li>Flight controls — primary (elevators, ailerons, spoilers)</li>
        <li>Flaps (via Power Control Unit, shared with Yellow)</li>
        <li>Ground spoilers</li>
        <li>Speed brakes</li>
        <li>Thrust reverser (ENG 1, some variants) ⚑</li>
      </ul>
      <div class="pump-info">
        <strong>Pumps:</strong> ENG 1 EDP (primary) + AC electric pump (backup)<br>
        <strong>Reservoir:</strong> ~13 litres · Pressurised by bleed air or Yellow sys
      </div>
    </div>
    <div class="service-card blue">
      <h3>🔵 Blue system services</h3>
      <ul>
        <li>Flight controls — backup (elevators, ailerons)</li>
        <li>Slats (primary — Blue is the primary slat power source)</li>
        <li>CSM/U (Constant Speed Motor/Generator — emergency AC generation)</li>
        <li>Spoiler panels (selected panels, backup roll)</li>
        <li>Brake accumulator pressurisation (some variants) ⚑</li>
      </ul>
      <div class="pump-info">
        <strong>Pumps:</strong> AC electric pump (primary) + RAT (emergency only)<br>
        <strong>Reservoir:</strong> ~6.5 litres · Pressurised by Yellow system<br>
        <strong>⚠ No normal braking · No landing gear · No nose wheel steering</strong>
      </div>
    </div>
    <div class="service-card yellow">
      <h3>🟡 Yellow system services</h3>
      <ul>
        <li>Alternate braking system</li>
        <li>Anti-skid (alternate mode)</li>
        <li>Flight controls — backup (elevators, rudder, spoilers)</li>
        <li>Cargo door operation (fwd + aft)</li>
        <li>Ground spoilers</li>
        <li>Flaps (via PCU, shared with Green)</li>
        <li>PTU output — pressurises Green when ENG 1 EDP unavailable</li>
        <li>Pressurises Blue reservoir</li>
        <li>Brake accumulator (fills accumulator for parking brake and emergency stops)</li>
      </ul>
      <div class="pump-info">
        <strong>Pumps:</strong> ENG 2 EDP (primary) + AC electric pump (backup)<br>
        <strong>Reservoir:</strong> ~12 litres · Pressurised by bleed air
      </div>
    </div>
  </div>

  <div class="callout amber">
    <strong>Flap and slat split:</strong> Flaps are powered by both Green and Yellow through a shared Power Control Unit (PCU). Both systems can drive flaps, and the PCU protects against asymmetric extension. Slats are primarily powered by Blue, with Green as backup. This means a Green + Blue dual failure would result in loss of slat extension — a critical consideration for approach and landing configuration.
  </div>

  <h2>The PTU — power transfer without fluid transfer</h2>

  <p>The Power Transfer Unit connects <span class="pill pill-green">Green</span> and <span class="pill pill-yellow">Yellow</span> hydraulically via a motor-pump assembly. When a pressure differential of approximately 500 PSI <span class="fcom-flag">⚑ verify</span> develops between the two systems — most commonly when ENG 1 is shut down but ENG 2 remains running — the PTU activates automatically. Yellow pressure drives the PTU motor shaft, which drives a pump on the Green side, restoring Green system pressure.</p>

  <!-- DIAGRAM 2: PTU animated -->
  <div class="diagram-block">
    <div class="diagram-label">Diagram 2 — PTU activation: power transfer without fluid mixing <span class="anim-badge">Animated</span></div>
    <div class="diagram-inner">
      <svg viewBox="0 0 700 260" role="img">
        <title>PTU animation — Yellow drives motor, Green pump restores pressure, no fluid crosses between systems</title>
        <defs>
          <marker id="ptug" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto">
            <path d="M2 2L8 5L2 8" fill="none" stroke="#1D9E75" stroke-width="1.5" stroke-linecap="round"/>
          </marker>
          <marker id="ptuy" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto">
            <path d="M2 2L8 5L2 8" fill="none" stroke="#BA7517" stroke-width="1.5" stroke-linecap="round"/>
          </marker>
        </defs>
        <!-- Green side -->
        <rect x="20" y="60" width="180" height="80" rx="8" fill="#e6f4ee" stroke="#1D9E75" stroke-width="1"/>
        <text x="110" y="88" text-anchor="middle" font-family="Inter,sans-serif" font-size="12" font-weight="600" fill="#0b6e48">Green circuit</text>
        <text x="110" y="104" text-anchor="middle" font-family="Inter,sans-serif" font-size="10" fill="#0F6E56">LOW pressure</text>
        <text x="110" y="118" text-anchor="middle" font-family="Inter,sans-serif" font-size="10" fill="#0F6E56">(ENG 1 shut down)</text>
        <text x="110" y="132" text-anchor="middle" font-family="Inter,sans-serif" font-size="9" fill="#0b6e48">Fluid stays in Green circuit</text>
        <!-- Yellow side -->
        <rect x="500" y="60" width="180" height="80" rx="8" fill="#fdf4dc" stroke="#BA7517" stroke-width="1"/>
        <text x="590" y="88" text-anchor="middle" font-family="Inter,sans-serif" font-size="12" font-weight="600" fill="#7a5200">Yellow circuit</text>
        <text x="590" y="104" text-anchor="middle" font-family="Inter,sans-serif" font-size="10" fill="#854F0B">NORMAL pressure</text>
        <text x="590" y="118" text-anchor="middle" font-family="Inter,sans-serif" font-size="10" fill="#854F0B">(ENG 2 running)</text>
        <text x="590" y="132" text-anchor="middle" font-family="Inter,sans-serif" font-size="9" fill="#7a5200">Fluid stays in Yellow circuit</text>
        <!-- PTU box -->
        <rect x="280" y="76" width="140" height="64" rx="8" fill="#eeecfd" stroke="#4f3eb5" stroke-width="1.5"/>
        <text x="350" y="100" text-anchor="middle" font-family="Inter,sans-serif" font-size="13" font-weight="600" fill="#26215C" class="ptu-p">PTU</text>
        <text x="350" y="116" text-anchor="middle" font-family="Inter,sans-serif" font-size="10" fill="#4f3eb5">Hydraulic motor/pump</text>
        <text x="350" y="130" text-anchor="middle" font-family="Inter,sans-serif" font-size="10" fill="#4f3eb5">No fluid path between sides</text>
        <!-- Yellow → PTU motor -->
        <path d="M500 100 L422 108" stroke="#BA7517" stroke-width="2" fill="none" class="fp" marker-end="url(#ptuy)"/>
        <text x="460" y="92" text-anchor="middle" font-family="Inter,sans-serif" font-size="9" fill="#854F0B">Yellow pressure</text>
        <text x="460" y="104" text-anchor="middle" font-family="Inter,sans-serif" font-size="9" fill="#854F0B">drives motor</text>
        <!-- PTU pump → Green pressure restored -->
        <path d="M280 108 L202 100" stroke="#1D9E75" stroke-width="2" fill="none" class="fp" marker-end="url(#ptug)"/>
        <text x="240" y="92" text-anchor="middle" font-family="Inter,sans-serif" font-size="9" fill="#0b6e48">Pump restores</text>
        <text x="240" y="104" text-anchor="middle" font-family="Inter,sans-serif" font-size="9" fill="#0b6e48">Green pressure</text>
        <!-- Barrier -->
        <rect x="280" y="172" width="140" height="38" rx="6" fill="#f7f8fc" stroke="#e2e4ea"/>
        <text x="350" y="189" text-anchor="middle" font-family="Inter,sans-serif" font-size="11" font-weight="600" fill="#6b7080">⚠ NO FLUID TRANSFER</text>
        <text x="350" y="203" text-anchor="middle" font-family="Inter,sans-serif" font-size="10" fill="#6b7080">Green and Yellow fluids never mix</text>
        <!-- Ground inhibit -->
        <rect x="20" y="212" width="660" height="36" rx="6" fill="#e6f4ee" stroke="#9FE1CB" stroke-width="0.75"/>
        <text x="350" y="230" text-anchor="middle" font-family="Inter,sans-serif" font-size="10" font-weight="600" fill="#085041">PTU ground inhibition: automatic below ~1,500 ft AGL with both engines running and parking brake released</text>
        <text x="350" y="243" text-anchor="middle" font-family="Inter,sans-serif" font-size="9" fill="#0F6E56">Prevents PTU cycling sound at the gate. PTU remains inhibited until airborne or single-engine operation.</text>
      </svg>
    </div>
    <div class="diagram-caption">The PTU is a motor-pump assembly. Yellow fluid drives the motor. The motor drives a pump that is part of the Green circuit. No fluid crosses between systems — this is a mechanical power transfer only.</div>
  </div>

  <div class="callout blue">
    <strong>The barking sound:</strong> During single-engine taxi or after engine shutdown on the gate, the PTU cycles as it responds to the ~500 PSI pressure differential. It activates, restores Green pressure, differential drops below threshold, PTU deactivates, pressure drops again, PTU reactivates — producing the characteristic repetitive sound. It is normal, expected, and stops when the second engine reaches idle. Passengers frequently ask about it. The answer is: it is the hydraulic system doing exactly what it is designed to do.
  </div>

  <h2>The RAT — Ram Air Turbine</h2>

  <p>The Ram Air Turbine is a small variable-pitch propeller that deploys automatically into the airstream on dual generator failure, or can be manually deployed by the crew via a pushbutton on the overhead panel.</p>

  <p>When deployed, the RAT drives a hydraulic pump that pressurises the <span class="pill pill-blue">Blue</span> system to approximately 2,500 PSI <span class="fcom-flag">⚑ verify</span> — lower than the normal 3,000 PSI. Blue pressure then powers:</p>

  <ul>
    <li>Flight controls (Blue circuit — ailerons and elevators)</li>
    <li>The CSM/U (Constant Speed Motor/Generator), which converts Blue hydraulic power into AC electrical power for essential avionics</li>
  </ul>

  <p>The RAT provides sufficient power to fly the aircraft to a landing. It is not sufficient for normal operations — some Blue-powered functions may be degraded at reduced pressure, and systems that require Green or Yellow remain unpowered.</p>

  <p>Minimum effective RAT deployment speed: approximately 140 knots <span class="fcom-flag">⚑ verify</span>. Below this airspeed, turbine output is insufficient to maintain Blue system pressure. This is operationally relevant for approach planning in a dual-generator scenario — if airspeed drops below approximately 140 knots, CSM/U output and Blue system pressure will degrade.</p>



`

export const ARTICLE_BODY_2 = String.raw`
  <h2>Failure effects — complete analysis</h2>

  <h3>Effects on flight controls</h3>

  <p>The A320 flight control surfaces draw hydraulic power from multiple systems to ensure that no single hydraulic failure removes control of any axis. The distribution is as follows:</p>

  <table class="data-table">
    <thead><tr><th>Surface</th><th>Primary supply</th><th>Backup supply</th><th>If primary lost</th></tr></thead>
    <tbody>
      <tr><td>Elevators (2)</td><td class="mono">Green + Yellow</td><td class="mono">Blue</td><td>Blue actuators maintain pitch control</td></tr>
      <tr><td>Ailerons (2)</td><td class="mono">Green + Blue</td><td class="mono">Spoilers (diff.)</td><td>Spoiler differential provides roll control</td></tr>
      <tr><td>Rudder</td><td class="mono">Green + Yellow + Blue</td><td class="mono">—</td><td>Triple redundancy — very robust</td></tr>
      <tr><td>Spoilers (roll)</td><td class="mono">Green + Yellow + Blue (split)</td><td class="mono">—</td><td>Reduced roll authority, asymmetric</td></tr>
      <tr><td>Ground spoilers</td><td class="mono">Green + Yellow</td><td class="mono">—</td><td>Reduced or no ground lift dump</td></tr>
      <tr><td>Speed brakes</td><td class="mono">Green + Yellow</td><td class="mono">—</td><td>Reduced speed brake effectiveness</td></tr>
      <tr><td>THS (trim)</td><td class="mono">Green + Yellow</td><td class="mono">Mechanical (electric motor)</td><td>Electric motor drives THS directly</td></tr>
    </tbody>
  </table>

  <div class="callout green">
    <strong>Spoilers and the mechanical stabiliser in hydraulic failures:</strong> In partial hydraulic failures, spoilers take on increased importance as a roll control surface when ailerons are degraded. Each spoiler panel has a specific hydraulic supply — a Green + Blue dual failure removes most roll spoiler authority, leaving the aircraft dependent on any remaining Blue or Yellow panels. The THS (Trimmable Horizontal Stabiliser) has an electric motor drive that remains available even in significant hydraulic failures, providing pitch trim capability independent of hydraulic pressure.
  </div>

  <h3>Effects on braking</h3>

  <p>The A320 braking system has three modes, each drawing from a different hydraulic source:</p>

  <table class="data-table">
    <thead><tr><th>Brake mode</th><th>Hydraulic source</th><th>Anti-skid</th><th>Availability</th></tr></thead>
    <tbody>
      <tr><td><strong>Normal braking</strong></td><td class="mono">Green</td><td>Yes (full anti-skid)</td><td>Whenever Green pressure available</td></tr>
      <tr><td><strong>Alternate braking</strong></td><td class="mono">Yellow</td><td>Yes (alternate anti-skid)</td><td>Whenever Yellow available, Green failed</td></tr>
      <tr><td><strong>Emergency braking</strong></td><td class="mono">Accumulator (Yellow pre-charged)</td><td>No anti-skid</td><td>Always — accumulator holds ~7 brake applications ⚑</td></tr>
    </tbody>
  </table>

  <p>The brake accumulator is pre-charged from the Yellow system and maintains pressure for parking brake application and emergency braking independent of any hydraulic system availability. This is why brake pressure is available even with all hydraulic pumps off and on a cold-and-dark aircraft.</p>

  <p><strong>Green system failure — braking effect:</strong> Normal braking is lost. Alternate braking (Yellow) activates automatically. Anti-skid protection remains available through the alternate system. No change to stopping distance in normal conditions — alternate braking is essentially equivalent to normal braking in terms of deceleration capability.</p>

  <p><strong>Yellow system failure — braking effect:</strong> Alternate braking is lost. Normal braking (Green) remains fully available. The accumulator continues to hold pressure for parking brake and emergency use. No change to normal braking.</p>

  <p><strong>Green + Yellow dual failure — braking effect:</strong> Both normal and alternate braking are lost. Only the pre-charged accumulator remains for braking. No anti-skid protection. The accumulator provides a limited number of brake applications — approximately 7 full brake applications <span class="fcom-flag">⚑ verify</span> — before pressure is depleted. Landing distance will increase significantly. This scenario requires immediate ECAM action and careful energy management on approach.</p>

  <div class="callout red">
    <strong>Accumulator braking — the critical points:</strong> Without anti-skid, aggressive braking risks tyre burst. The crew must apply firm but controlled braking to use the available accumulator pressure efficiently. Maximum use of ground spoilers (if available) and aerodynamic braking (holding the nose high for as long as safely possible) reduces the demand on the limited accumulator pressure. If a runway overrun is possible, airport emergency services should be alerted before landing.
  </div>

  <h3>Effects on landing gear</h3>

  <p>Landing gear extension and retraction is powered exclusively by the <span class="pill pill-green">Green</span> system. Landing gear doors are also Green-powered.</p>

  <p><strong>Green system failure — landing gear effect:</strong></p>
  <ul>
    <li>Normal (hydraulic) gear extension is unavailable</li>
    <li>Gravity extension via the manual free-fall handle is always available as a backup</li>
    <li>Gravity extension procedure: flight crew manually trip the uplocks, allowing gear to free-fall to the down-and-locked position under gravity and aerodynamic drag</li>
    <li>After gravity extension, the gear cannot be retracted — it is a one-way operation</li>
    <li>Gear doors may not close fully after gravity extension, increasing drag for the approach</li>
    <li>Nose wheel steering (also Green-powered) is lost. Ground directional control after landing is via differential braking and rudder.</li>
  </ul>

  <div class="callout amber">
    <strong>Gravity extension check:</strong> After operating the gravity extension handle, the crew must positively confirm three greens (gear locked down) before continuing the approach. If any leg fails to lock, further steps are available per the ECAM/QRH procedure. Do not rush the gear down confirmation — the gear takes longer to lock via gravity extension than via normal hydraulic extension.
  </div>

  <h3>Effects on flaps and slats</h3>

  <p>Flaps and slats have separate hydraulic supplies, which means they can be affected differently by hydraulic failures.</p>

  <p><strong>Flaps</strong> are powered by Green and Yellow through a shared Power Control Unit (PCU). The PCU protects against asymmetric flap extension. If one system fails, the other continues to drive both flap surfaces, though at reduced speed. If both Green and Yellow fail, flaps are hydraulically locked in their current position.</p>

  <p><strong>Slats</strong> are primarily powered by Blue, with Green as backup. If Blue fails, slat extension continues via Green. If both Blue and Green fail, slats are hydraulically locked.</p>

  <table class="data-table">
    <thead><tr><th>Failure</th><th>Flap effect</th><th>Slat effect</th><th>Approach implication</th></tr></thead>
    <tbody>
      <tr><td>Green only failed</td><td class="deg">Reduced extension speed · Yellow drives both</td><td class="deg">Slats now Blue only · Green backup lost</td><td>Config achievable but degraded redundancy</td></tr>
      <tr><td>Blue only failed</td><td class="avail">Normal (Green + Yellow)</td><td class="deg">Green drives slats as backup</td><td>Config achievable, note slat redundancy reduced</td></tr>
      <tr><td>Yellow only failed</td><td class="deg">Reduced extension speed · Green drives both</td><td class="avail">Normal (Blue primary)</td><td>Config achievable but degraded redundancy</td></tr>
      <tr><td>Green + Yellow failed</td><td class="lost">Flaps hydraulically locked</td><td class="deg">Blue drives slats only</td><td>Flaps stuck at current position · Max config limited · Higher approach speed</td></tr>
      <tr><td>Green + Blue failed</td><td class="deg">Yellow drives flaps only</td><td class="lost">Slats hydraulically locked</td><td>Slats stuck · High approach speed · Significant performance impact</td></tr>
      <tr><td>All three failed</td><td class="lost">All hydraulically locked</td><td class="lost">All hydraulically locked</td><td>Flaps and slats at current position · Extremely high approach and landing speed</td></tr>
    </tbody>
  </table>

  <div class="callout red">
    <strong>Locked flaps and slats — operational impact:</strong> A landing with flaps locked at 0° (clean) requires approach speeds significantly above normal (potentially above 200 knots) and a very long runway. The ECAM and QRH provide specific procedures and speed references for degraded flap/slat configurations. VREF clean with appropriate factors must be calculated. This is not a "land normally" scenario — it requires early coordination with ATC, declaration of emergency if appropriate, and selection of the longest available runway.
  </div>

  <h2>Complete failure mode summary</h2>

  <table class="failure-table">
    <thead>
      <tr>
        <th style="width:12%">System lost</th>
        <th style="width:22%">Flight controls</th>
        <th style="width:18%">Braking</th>
        <th style="width:16%">Landing gear</th>
        <th style="width:16%">Flaps / Slats</th>
        <th style="width:16%">Other</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><span class="sys g">Green</span></td>
        <td><span class="deg">Reduced: Blue + Yellow cover most surfaces</span></td>
        <td><span class="deg">Normal lost · Alternate (Yellow) auto</span></td>
        <td><span class="lost">Hydraulic lost · Gravity extension available</span><br><span class="lost">NWS lost</span></td>
        <td><span class="deg">Flaps: Yellow only (slower) · Slats: Blue backup only</span></td>
        <td><span class="lost">Nose wheel steering lost</span></td>
      </tr>
      <tr>
        <td><span class="sys b">Blue</span></td>
        <td><span class="deg">Reduced: Green + Yellow cover primary surfaces</span><br><span class="lost">Slat backup lost</span></td>
        <td><span class="avail">Normal (Green) unaffected</span></td>
        <td><span class="avail">Unaffected (Green powered)</span></td>
        <td><span class="avail">Flaps normal</span><br><span class="deg">Slats: Green backup only</span></td>
        <td><span class="lost">CSM/U lost (emer. gen. compromised) · RAT now critical</span></td>
      </tr>
      <tr>
        <td><span class="sys y">Yellow</span></td>
        <td><span class="deg">Reduced: Green + Blue cover most</span></td>
        <td><span class="deg">Alternate lost · Normal (Green) available</span></td>
        <td><span class="avail">Unaffected (Green powered)</span></td>
        <td><span class="deg">Flaps: Green only (slower) · Slats: normal</span></td>
        <td><span class="lost">Cargo doors manual · PTU lost · Blue reservoir pressurisation lost</span></td>
      </tr>
      <tr>
        <td><span class="sys g">Green</span> + <span class="sys b">Blue</span></td>
        <td><span class="lost">Very limited: Yellow only · Roll highly degraded</span></td>
        <td><span class="deg">Alternate (Yellow) only</span></td>
        <td><span class="lost">Gravity extension only · NWS lost</span></td>
        <td><span class="deg">Flaps: Yellow only · </span><span class="lost">Slats locked</span></td>
        <td><span class="lost">CSM/U lost. High approach speed. Declare emergency.</span></td>
      </tr>
      <tr>
        <td><span class="sys g">Green</span> + <span class="sys y">Yellow</span></td>
        <td><span class="deg">Blue only — sufficient for control</span></td>
        <td><span class="lost">Normal + alternate lost · Accumulator only · No anti-skid</span></td>
        <td><span class="lost">Gravity extension only · NWS lost</span></td>
        <td><span class="lost">Flaps locked · </span><span class="deg">Slats: Blue only</span></td>
        <td><span class="lost">Declare emergency. RAT powers Blue. Very limited stopping ability.</span></td>
      </tr>
      <tr>
        <td><span class="sys b">Blue</span> + <span class="sys y">Yellow</span></td>
        <td><span class="deg">Green only — primary axis control maintained</span></td>
        <td><span class="avail">Normal (Green) available</span></td>
        <td><span class="avail">Normal (Green) available</span></td>
        <td><span class="lost">Flaps locked · Slats locked</span></td>
        <td><span class="lost">CSM/U lost. Very high approach/landing speed. Declare emergency.</span></td>
      </tr>
    </tbody>
  </table>

  <h2>ECAM monitoring and hydraulic indications</h2>

  <p>The ECAM System Display HYD page provides real-time status of all three hydraulic systems. In normal operations, the HYD page is not continuously displayed — it appears automatically when an abnormality is detected. The crew can also call it manually via the SD selector.</p>

  <p>Key indications on the HYD page:</p>
  <ul>
    <li><strong>System pressure:</strong> Each system shows current pressure. Low pressure is indicated by amber colouring when pressure drops below the low-pressure threshold.</li>
    <li><strong>Pump status:</strong> Each pump shows ON/OFF/FAULT. A pump running with no pressure output indicates a pump fault, not necessarily a system leak.</li>
    <li><strong>Reservoir quantity:</strong> Shown as a percentage. Decreasing quantity indicates either normal consumption (small amount) or a leak (significant, progressive decrease). A leak decreasing quantity toward zero is a system emergency.</li>
    <li><strong>Reservoir temperature:</strong> Shown for each system. High temperature indicates excessive pump cycling or restriction in return lines.</li>
    <li><strong>PTU status:</strong> AUTO in normal operations. AUTO inhibited on ground with both engines running and parking brake released.</li>
  </ul>

  <div class="callout amber">
    <strong>Differentiating a pump fault from a system failure:</strong> If a system shows low pressure but the reservoir quantity is normal and not decreasing, the fault is in the pump (not delivering pressure) rather than a leak. If the reservoir quantity is progressively decreasing, a leak is likely. The ECAM message and associated procedures will guide the response — do not attempt to diagnose without following ECAM actions first.
  </div>

  <h2>Key numbers</h2>

  <table class="data-table">
    <thead><tr><th>Parameter</th><th>Value</th></tr></thead>
    <tbody>
      <tr><td>Normal system pressure (all three)</td><td class="mono">3,000 PSI (206 bar)</td></tr>
      <tr><td>PTU activation differential pressure</td><td class="mono">~500 PSI <span class="fcom-flag">⚑</span></td></tr>
      <tr><td>Green reservoir capacity</td><td class="mono">~13 litres <span class="fcom-flag">⚑</span></td></tr>
      <tr><td>Yellow reservoir capacity</td><td class="mono">~12 litres <span class="fcom-flag">⚑</span></td></tr>
      <tr><td>Blue reservoir capacity</td><td class="mono">~6.5 litres <span class="fcom-flag">⚑</span></td></tr>
      <tr><td>EDP flow rate (Green + Yellow)</td><td class="mono">~37 litres/min <span class="fcom-flag">⚑</span></td></tr>
      <tr><td>Electric pump flow rate (all three)</td><td class="mono">~11 litres/min <span class="fcom-flag">⚑</span></td></tr>
      <tr><td>RAT minimum deployment speed</td><td class="mono">~140 knots <span class="fcom-flag">⚑</span></td></tr>
      <tr><td>RAT hydraulic output pressure</td><td class="mono">~2,500 PSI (reduced) <span class="fcom-flag">⚑</span></td></tr>
      <tr><td>Brake accumulator applications (emergency)</td><td class="mono">~7 full applications <span class="fcom-flag">⚑</span></td></tr>
      <tr><td>PTU — fluid transfer between systems</td><td class="warn">No — power only, never fluid</td></tr>
    </tbody>
  </table>

  <p style="font-size:0.82rem; color:var(--ink-3); margin-top:-0.75rem;"><span class="fcom-flag">⚑</span> = Verify against your operator's FCOM before use in training or operations. Values vary by aircraft variant and modification state.</p>

  <div class="cta-block">
    <h3>Practise A320 questions</h3>
    <p>ProPilotLicence has 12,000+ DGCA ATPL and CPL practice questions — including a full A320 question bank covering every ATA chapter, verified by active airline captains. Free to start.</p>
    <a class="cta-btn" href="/login?next=/atpl">Practise A320 questions →</a>
  </div>

  <div class="disclaimer">
    <strong>Note:</strong> This article reflects general A320 family hydraulic system architecture based on publicly available aviation training materials. Specific values, procedures, limitations, and failure effects vary by aircraft variant (A318/A319/A320/A321), modification state (MSN), software standard, and operator. Values marked <span class="fcom-flag">⚑</span> require verification against your aircraft's approved FCOM before use in training, assessment, or operations. Always refer to your approved FCOM and your operator's Operations Manual for authoritative procedures. Content reviewed by the ProPilotLicence Captain Panel — four or more active commercial airline captains holding current DGCA CPL and ATPL licences.
  </div>
`
