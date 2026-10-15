// Verbatim body from the captain-panel-reviewed source, i.e. the inner HTML of
// <main class="article-wrap">. Do NOT hand-edit the diagrams, animation classes,
// ⚑ FCOM flags, or disclaimer — reviewed and approved content.
// The source's hand-written series-nav is replaced by the shared <A320SeriesNav>
// (rendered between ARTICLE_HEAD and ARTICLE_BODY in page.tsx). Styling comes
// from the sibling styles.module.css (scoped; structural vars remapped to the
// site palette, ECAM red/amber/blue/green colour code kept fixed).
export const ARTICLE_HEAD = String.raw`

  <div class="eyebrow">A320 Procedures — ECAM</div>
  <h1>A320 ECAM Handling Philosophy — Alert Levels, Task Sharing and Actions</h1>

  <p class="standfirst">ECAM does not fly the aircraft. It tells you what has failed, ranks it by urgency, and gives you an ordered list of things to do about it. Everything that goes wrong in an ECAM scenario goes wrong because a crew actioned faster than they flew, or actioned an item they had not confirmed. Understanding the philosophy matters more than memorising any individual procedure.</p>

  <div class="byline">
    <strong>ProPilotLicence Editorial</strong>
    <span class="byline-dot">·</span>
    <span>Reviewed by the ProPilotLicence Captain Panel</span>
    <span class="byline-dot">·</span>
    <span>ATPL / Type Rating</span>
  </div>

  `

export const ARTICLE_BODY = String.raw`
  <h2 class="first">What ECAM is, and what it is not</h2>

  <p>ECAM stands for Electronic Centralised Aircraft Monitor. It is a monitoring and alerting system, not an automation system. It detects failures, classifies them by urgency, displays them in priority order, and presents the corrective actions as a checklist the crew works through.</p>

  <p>What ECAM does not do is take action on its own. It does not shut down an engine, close a bleed, or reconfigure a bus. Those reconfigurations that happen automatically (electrical bus transfers, hydraulic PTU activation) are done by the system's own controllers, not by ECAM. ECAM simply tells you they have happened.</p>

  <p>ECAM also does not know what the aircraft is doing. It has flight phase awareness for inhibition purposes, but it does not know that you are 300 ft on final with a crosswind. The judgement about when to start actioning is the crew's alone, and that judgement is the single most important element of ECAM handling.</p>

  <div class="callout blue">
    <strong>The one-line philosophy:</strong> Fly, navigate, communicate, then manage the failure. ECAM sits in the fourth position, and it stays there no matter how loud the aural warning is.
  </div>

  <h2>Display architecture</h2>

  <p>ECAM presents on two displays in the centre instrument panel:</p>

  <ul>
    <li><strong>E/WD — Engine/Warning Display (upper):</strong> Primary engine parameters (N1, EGT, N2, fuel flow), fuel on board, slat and flap position indication, and the warning, caution and memo message area. This is where failure titles and the actions to take are displayed.</li>
    <li><strong>SD — System Display (lower):</strong> Synoptic pages for each system (ENG, BLEED, PRESS, ELEC, HYD, FUEL, APU, COND, DOOR, WHEEL, F/CTL), plus the CRUISE page and the STATUS page. On a failure, the relevant system page is called automatically.</li>
  </ul>

  <h3>The computers behind the displays</h3>

  <table class="data-table">
    <thead><tr><th>Computer</th><th>Quantity</th><th>Function</th></tr></thead>
    <tbody>
      <tr><td><strong>FWC</strong> — Flight Warning Computer</td><td class="mono">2</td><td>Generates warnings and cautions, aural alerts, and synthetic voice messages. Determines flight phase. Drives message priority and inhibition logic.</td></tr>
      <tr><td><strong>SDAC</strong> — System Data Acquisition Concentrator</td><td class="mono">2</td><td>Gathers system data from sensors and sends it to the FWCs and DMCs. Handles data for amber cautions and SD page content.</td></tr>
      <tr><td><strong>DMC</strong> — Display Management Computer</td><td class="mono">3</td><td>Drives the display units themselves — generates the symbology shown on E/WD and SD.</td></tr>
    </tbody>
  </table>

  <div class="callout amber">
    <strong>Red warnings bypass the SDACs:</strong> Data for red (Level 3) warnings goes directly to the FWCs, not via the SDACs. This is deliberate. A dual SDAC failure degrades the amber caution and SD page capability, but red warnings continue to function. This is a common type rating oral question. <span class="fcom-flag">⚑</span>
  </div>

  <!-- DIAGRAM 1: ECAM architecture -->
  <div class="diagram-block">
    <div class="diagram-label">Diagram 1 — ECAM computer and display architecture <span class="anim-badge">Animated</span></div>
    <div class="diagram-inner">
      <svg viewBox="0 0 720 360" role="img">
        <title>A320 ECAM architecture showing aircraft systems feeding SDACs and FWCs, DMCs driving the E/WD and SD displays, with red warnings bypassing the SDACs</title>
        <defs>
          <marker id="ea1" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto">
            <path d="M2 2L8 5L2 8" fill="none" stroke="#1a4fc4" stroke-width="1.5" stroke-linecap="round"/>
          </marker>
          <marker id="ea2" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto">
            <path d="M2 2L8 5L2 8" fill="none" stroke="#991f1f" stroke-width="1.5" stroke-linecap="round"/>
          </marker>
        </defs>

        <!-- Aircraft systems -->
        <rect x="20" y="20" width="680" height="44" rx="8" fill="#f7f8fc" stroke="#e2e4ea" stroke-width="1"/>
        <text x="360" y="40" text-anchor="middle" font-family="Inter,sans-serif" font-size="11" font-weight="600" fill="#353a47">Aircraft systems — sensors, valves, computers, switches</text>
        <text x="360" y="55" text-anchor="middle" font-family="Inter,sans-serif" font-size="9" fill="#6b7080">ENG · BLEED · PRESS · ELEC · HYD · FUEL · APU · F/CTL · WHEEL · DOOR · COND</text>

        <!-- SDACs -->
        <rect x="80" y="110" width="200" height="54" rx="8" fill="#eef2fc" stroke="#1a4fc4" stroke-width="1"/>
        <text x="180" y="132" text-anchor="middle" font-family="Inter,sans-serif" font-size="11" font-weight="600" fill="#1a4fc4">SDAC 1  ·  SDAC 2</text>
        <text x="180" y="147" text-anchor="middle" font-family="Inter,sans-serif" font-size="9" fill="#1a4fc4">Data acquisition · amber cautions</text>
        <text x="180" y="159" text-anchor="middle" font-family="Inter,sans-serif" font-size="9" fill="#6b7080">SD page content</text>

        <!-- FWCs -->
        <rect x="440" y="110" width="200" height="54" rx="8" fill="#fdecea" stroke="#c0392b" stroke-width="1.5"/>
        <text x="540" y="132" text-anchor="middle" font-family="Inter,sans-serif" font-size="11" font-weight="600" fill="#991f1f">FWC 1  ·  FWC 2</text>
        <text x="540" y="147" text-anchor="middle" font-family="Inter,sans-serif" font-size="9" fill="#991f1f">Warnings · aurals · flight phase</text>
        <text x="540" y="159" text-anchor="middle" font-family="Inter,sans-serif" font-size="9" fill="#6b7080">Priority and inhibition logic</text>

        <!-- DMCs -->
        <rect x="260" y="206" width="200" height="44" rx="8" fill="#eeecfd" stroke="#4f3eb5" stroke-width="1"/>
        <text x="360" y="227" text-anchor="middle" font-family="Inter,sans-serif" font-size="11" font-weight="600" fill="#4f3eb5">DMC 1 · DMC 2 · DMC 3</text>
        <text x="360" y="241" text-anchor="middle" font-family="Inter,sans-serif" font-size="9" fill="#4f3eb5">Display symbology generation</text>

        <!-- Displays -->
        <rect x="120" y="292" width="200" height="50" rx="6" fill="#0d1117" stroke="#353a47" stroke-width="1"/>
        <text x="220" y="313" text-anchor="middle" font-family="Inter,sans-serif" font-size="11" font-weight="600" fill="#fff">E/WD (upper)</text>
        <text x="220" y="329" text-anchor="middle" font-family="Inter,sans-serif" font-size="9" fill="#9aa0ad">Engine params · warnings · memo</text>

        <rect x="400" y="292" width="200" height="50" rx="6" fill="#0d1117" stroke="#353a47" stroke-width="1"/>
        <text x="500" y="313" text-anchor="middle" font-family="Inter,sans-serif" font-size="11" font-weight="600" fill="#fff">SD (lower)</text>
        <text x="500" y="329" text-anchor="middle" font-family="Inter,sans-serif" font-size="9" fill="#9aa0ad">System synoptics · STATUS</text>

        <!-- Flow lines -->
        <path d="M180 64 L180 108" stroke="#1a4fc4" stroke-width="1.8" fill="none" class="fd" marker-end="url(#ea1)"/>
        <path d="M540 64 L540 108" stroke="#991f1f" stroke-width="2.2" fill="none" class="fd" marker-end="url(#ea2)"/>
        <path d="M280 140 L438 140" stroke="#1a4fc4" stroke-width="1.5" fill="none" class="fd2" marker-end="url(#ea1)"/>
        <path d="M230 164 L330 204" stroke="#1a4fc4" stroke-width="1.5" fill="none" class="fd2" marker-end="url(#ea1)"/>
        <path d="M490 164 L390 204" stroke="#991f1f" stroke-width="1.5" fill="none" class="fd2" marker-end="url(#ea2)"/>
        <path d="M320 250 L240 290" stroke="#4f3eb5" stroke-width="1.5" fill="none" class="fd" marker-end="url(#ea1)"/>
        <path d="M400 250 L480 290" stroke="#4f3eb5" stroke-width="1.5" fill="none" class="fd" marker-end="url(#ea1)"/>

        <!-- Labels -->
        <text x="196" y="92" font-family="Inter,sans-serif" font-size="8" fill="#6b7080">system data</text>
        <text x="556" y="92" font-family="Inter,sans-serif" font-size="8" fill="#991f1f">red warnings — direct, no SDAC</text>
        <text x="300" y="134" font-family="Inter,sans-serif" font-size="8" fill="#6b7080">amber data</text>
      </svg>
    </div>
    <div class="diagram-caption">Amber caution data and SD page content route through the SDACs. Red warning data goes straight to the FWCs. A dual SDAC failure therefore degrades cautions and synoptic pages while red warnings continue to function.</div>
  </div>

  <h2>Alert levels</h2>

  <p>ECAM classifies every alert into one of three levels, and the level determines the colour, the aural, the master light, and above all what the crew is expected to do about it.</p>

  <div class="level-grid">
    <div class="level-card l3">
      <h4>Level 3 — Warning (red)</h4>
      <ul>
        <li>Configuration or failure requiring <strong>immediate</strong> action</li>
        <li>Colour: red</li>
        <li>Aural: CRC (continuous repetitive chime) or specific sound</li>
        <li>Master WARN light: flashing red</li>
        <li>Examples: ENG FIRE, CONFIG, DUAL HYD LO PR, EXCESS CAB ALT</li>
      </ul>
    </div>
    <div class="level-card l2">
      <h4>Level 2 — Caution (amber)</h4>
      <ul>
        <li>Failure requiring crew <strong>awareness</strong> but no immediate action</li>
        <li>Colour: amber</li>
        <li>Aural: SC (single chime)</li>
        <li>Master CAUT light: steady amber</li>
        <li>Examples: single hydraulic system low pressure, single generator fault, pack fault</li>
      </ul>
    </div>
    <div class="level-card l1">
      <h4>Level 1 — Advisory (amber)</h4>
      <ul>
        <li>Degradation of <strong>redundancy</strong> only</li>
        <li>Colour: amber</li>
        <li>Aural: none</li>
        <li>Master light: none</li>
        <li>Displayed on E/WD only. No immediate operational effect.</li>
      </ul>
    </div>
  </div>

  <p>Two further categories sit outside the three levels:</p>

  <ul>
    <li><strong>Advisory (pulsing parameter):</strong> A parameter on an SD page drifting out of its normal range pulses green to draw attention. The SD page is called automatically. There is no aural and no master light. It is a "watch this" indication rather than a failure.</li>
    <li><strong>Memo:</strong> Green messages on the E/WD reminding the crew of normal configuration items — SEAT BELTS, NO SMOKING, APU AVAIL, ANTI ICE. Memos in amber indicate a configuration item that should not normally be active at that phase. <span class="fcom-flag">⚑</span></li>
  </ul>

  <h3>Aural alerts</h3>

  <table class="data-table">
    <thead><tr><th>Aural</th><th>Meaning</th><th>Cancel</th></tr></thead>
    <tbody>
      <tr><td class="warn">CRC — continuous repetitive chime</td><td>Level 3 warning</td><td>MASTER WARN pushbutton</td></tr>
      <tr><td class="cau">SC — single chime</td><td>Level 2 caution</td><td>Self-cancelling (single tone)</td></tr>
      <tr><td class="warn">Cavalry charge</td><td>Autopilot disconnect</td><td>Second press of sidestick AP disconnect pushbutton</td></tr>
      <tr><td class="cau">Triple click</td><td>Attention-getter for a flight control law change or mode reversion</td><td>Self-cancelling</td></tr>
      <tr><td class="warn">Continuous horn</td><td>Landing gear not down configuration warning <span class="fcom-flag">⚑</span></td><td>Per configuration or gear extension</td></tr>
      <tr><td class="warn">Synthetic voice</td><td>PRIORITY LEFT/RIGHT, DUAL INPUT, RETARD, SPEED SPEED SPEED, STALL, WINDSHEAR, and EGPWS callouts</td><td>Condition-dependent</td></tr>
    </tbody>
  </table>

  <div class="callout amber">
    <strong>Cancelling the aural is not managing the failure:</strong> Pressing MASTER WARN silences the CRC and extinguishes the flashing light. It does not clear the message, does not action anything, and does not mean the failure has been dealt with. Silence the noise so you can think and communicate, then fly the aircraft, then action.
  </div>

  <h2>Colour conventions on the E/WD</h2>

  <table class="data-table">
    <thead><tr><th>Colour</th><th>Used for</th></tr></thead>
    <tbody>
      <tr><td><span class="pill pill-red">Red</span></td><td>Level 3 warning titles. Configuration or failure requiring immediate action. Also the red LAND ASAP message.</td></tr>
      <tr><td><span class="pill pill-amber">Amber</span></td><td>Level 2 caution titles and Level 1 advisories. Also the amber LAND ASAP message.</td></tr>
      <tr><td><span class="pill pill-blue">Blue</span></td><td>Action line items — the things the crew is to do. Also limitations shown on the STATUS page.</td></tr>
      <tr><td><span class="pill pill-green">Green</span></td><td>Normal operation values and memo messages.</td></tr>
      <tr><td>White</td><td>System page titles and sub-system labels on the SD.</td></tr>
      <tr><td>Magenta</td><td>Messages relating to inhibition and to particular conditions. <span class="fcom-flag">⚑</span></td></tr>
    </tbody>
  </table>

  <div class="callout red">
    <strong>Red LAND ASAP versus amber LAND ASAP:</strong> Red LAND ASAP means land at the nearest airport at which a safe landing can be made. It is not a suggestion. Amber LAND ASAP means consider the severity of the situation and land at the nearest suitable airport, with crew judgement applied to what "suitable" means. Knowing which colour you are looking at changes the diversion decision entirely.
  </div>

  <h2>Flight phase inhibition</h2>

  <p>The FWCs determine the current flight phase and inhibit certain alerts during critical phases, so that a caution about a galley bus does not compete for attention during rotation. The A320 has ten flight phases. <span class="fcom-flag">⚑</span></p>

  <table class="data-table">
    <thead><tr><th>Phase</th><th>From</th><th>To</th></tr></thead>
    <tbody>
      <tr><td class="mono">1</td><td>Electrical power on</td><td>First engine start</td></tr>
      <tr><td class="mono">2</td><td>First engine start</td><td>Last engine start</td></tr>
      <tr><td class="mono">3</td><td>Last engine start</td><td>Takeoff power application</td></tr>
      <tr><td class="mono">4</td><td>Takeoff power</td><td>80 kt</td></tr>
      <tr><td class="mono">5</td><td>80 kt</td><td>Liftoff</td></tr>
      <tr><td class="mono">6</td><td>Liftoff</td><td>1,500 ft AGL (or a time limit)</td></tr>
      <tr><td class="mono">7</td><td>1,500 ft AGL climb</td><td>800 ft AGL on approach</td></tr>
      <tr><td class="mono">8</td><td>800 ft AGL approach</td><td>Touchdown</td></tr>
      <tr><td class="mono">9</td><td>Touchdown</td><td>80 kt</td></tr>
      <tr><td class="mono">10</td><td>80 kt on rollout</td><td>Engine shutdown / a time limit after</td></tr>
    </tbody>
  </table>

  <p>During the inhibited phases, T.O. INHIBIT and LDG INHIBIT memos are displayed on the E/WD to tell the crew that alerting is suppressed. When the phase ends, any suppressed alert that is still valid is displayed.</p>

  <div class="callout blue">
    <strong>What inhibition does not suppress:</strong> Red warnings related to fire and to engine failure are not inhibited during the critical phases, because they are exactly the failures that need to be known about at those moments. Inhibition removes noise, not the things you must act on. <span class="fcom-flag">⚑</span>
  </div>

  `

export const ARTICLE_BODY_2 = String.raw`
  <h2>The handling sequence</h2>

  <p>The sequence below is the standard ECAM handling flow. The exact wording of calls varies by operator, so use your own Operations Manual for the phraseology. The structure and the order do not vary.</p>

  <!-- DIAGRAM 2: sequence -->
  <div class="diagram-block">
    <div class="diagram-label">Diagram 2 — ECAM handling sequence <span class="anim-badge">Animated</span></div>
    <div class="diagram-inner">
      <svg viewBox="0 0 720 300" role="img">
        <title>A320 ECAM handling sequence from recognition through flight path stabilisation, ECAM actions, status review and decision making</title>
        <defs>
          <marker id="sa" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto">
            <path d="M2 2L8 5L2 8" fill="none" stroke="#6b7080" stroke-width="1.5" stroke-linecap="round"/>
          </marker>
        </defs>

        <!-- Step 1 -->
        <rect x="14" y="40" width="126" height="76" rx="8" fill="#fdecea" stroke="#c0392b" stroke-width="1.2" class="sp1"/>
        <text x="77" y="64" text-anchor="middle" font-family="Inter,sans-serif" font-size="10" font-weight="600" fill="#991f1f">1. RECOGNISE</text>
        <text x="77" y="81" text-anchor="middle" font-family="Inter,sans-serif" font-size="8.5" fill="#991f1f">Aural + master light</text>
        <text x="77" y="94" text-anchor="middle" font-family="Inter,sans-serif" font-size="8.5" fill="#991f1f">Cancel the aural</text>
        <text x="77" y="107" text-anchor="middle" font-family="Inter,sans-serif" font-size="8.5" fill="#6b7080">Do not touch anything else</text>

        <!-- Step 2 -->
        <rect x="158" y="40" width="126" height="76" rx="8" fill="#eef2fc" stroke="#1a4fc4" stroke-width="1.2" class="sp2"/>
        <text x="221" y="64" text-anchor="middle" font-family="Inter,sans-serif" font-size="10" font-weight="600" fill="#1a4fc4">2. FLY</text>
        <text x="221" y="81" text-anchor="middle" font-family="Inter,sans-serif" font-size="8.5" fill="#1a4fc4">Stabilise flight path</text>
        <text x="221" y="94" text-anchor="middle" font-family="Inter,sans-serif" font-size="8.5" fill="#1a4fc4">Confirm who is flying</text>
        <text x="221" y="107" text-anchor="middle" font-family="Inter,sans-serif" font-size="8.5" fill="#6b7080">Above 400 ft AGL ⚑</text>

        <!-- Step 3 -->
        <rect x="302" y="40" width="126" height="76" rx="8" fill="#e6f4ee" stroke="#0b6e48" stroke-width="1.2" class="sp3"/>
        <text x="365" y="64" text-anchor="middle" font-family="Inter,sans-serif" font-size="10" font-weight="600" fill="#0b6e48">3. ECAM ACTIONS</text>
        <text x="365" y="81" text-anchor="middle" font-family="Inter,sans-serif" font-size="8.5" fill="#0b6e48">PF commands</text>
        <text x="365" y="94" text-anchor="middle" font-family="Inter,sans-serif" font-size="8.5" fill="#0b6e48">PM reads and actions</text>
        <text x="365" y="107" text-anchor="middle" font-family="Inter,sans-serif" font-size="8.5" fill="#6b7080">Confirm irreversibles</text>

        <!-- Step 4 -->
        <rect x="446" y="40" width="126" height="76" rx="8" fill="#fdf4dc" stroke="#BA7517" stroke-width="1.2" class="sp4"/>
        <text x="509" y="64" text-anchor="middle" font-family="Inter,sans-serif" font-size="10" font-weight="600" fill="#7a5200">4. STATUS</text>
        <text x="509" y="81" text-anchor="middle" font-family="Inter,sans-serif" font-size="8.5" fill="#854F0B">Limitations</text>
        <text x="509" y="94" text-anchor="middle" font-family="Inter,sans-serif" font-size="8.5" fill="#854F0B">INOP systems</text>
        <text x="509" y="107" text-anchor="middle" font-family="Inter,sans-serif" font-size="8.5" fill="#6b7080">Procedures to apply</text>

        <!-- Step 5 -->
        <rect x="590" y="40" width="116" height="76" rx="8" fill="#eeecfd" stroke="#4f3eb5" stroke-width="1.2" class="sp5"/>
        <text x="648" y="64" text-anchor="middle" font-family="Inter,sans-serif" font-size="10" font-weight="600" fill="#4f3eb5">5. DECIDE</text>
        <text x="648" y="81" text-anchor="middle" font-family="Inter,sans-serif" font-size="8.5" fill="#4f3eb5">QRH supplements</text>
        <text x="648" y="94" text-anchor="middle" font-family="Inter,sans-serif" font-size="8.5" fill="#4f3eb5">Fuel · performance</text>
        <text x="648" y="107" text-anchor="middle" font-family="Inter,sans-serif" font-size="8.5" fill="#6b7080">Divert or continue</text>

        <!-- Arrows -->
        <path d="M140 78 L156 78" stroke="#6b7080" stroke-width="1.4" fill="none" marker-end="url(#sa)"/>
        <path d="M284 78 L300 78" stroke="#6b7080" stroke-width="1.4" fill="none" marker-end="url(#sa)"/>
        <path d="M428 78 L444 78" stroke="#6b7080" stroke-width="1.4" fill="none" marker-end="url(#sa)"/>
        <path d="M572 78 L588 78" stroke="#6b7080" stroke-width="1.4" fill="none" marker-end="url(#sa)"/>

        <!-- Underlying rule -->
        <rect x="14" y="160" width="692" height="46" rx="8" fill="#eef2fc" stroke="#1a4fc4" stroke-width="1"/>
        <text x="360" y="181" text-anchor="middle" font-family="Inter,sans-serif" font-size="11" font-weight="600" fill="#1a4fc4">Aviate → Navigate → Communicate → Manage the failure</text>
        <text x="360" y="197" text-anchor="middle" font-family="Inter,sans-serif" font-size="9" fill="#1a4fc4">ECAM is the fourth priority, always. Steps 3 to 5 do not begin until step 2 is complete.</text>

        <!-- Below 400 ft note -->
        <rect x="14" y="228" width="692" height="46" rx="8" fill="#fdecea" stroke="#c0392b" stroke-width="1"/>
        <text x="360" y="249" text-anchor="middle" font-family="Inter,sans-serif" font-size="11" font-weight="600" fill="#991f1f">Below 400 ft AGL: no ECAM actions ⚑</text>
        <text x="360" y="265" text-anchor="middle" font-family="Inter,sans-serif" font-size="9" fill="#991f1f">Fly the aircraft. Only memory items and essential configuration actions. ECAM waits.</text>
      </svg>
    </div>
    <div class="diagram-caption">The sequence is invariant. Recognition and aural cancellation are immediate; everything after that waits until the flight path is stable and the aircraft is above the operator's minimum height for ECAM actions.</div>
  </div>

  <h3>Task sharing and calls</h3>

  <p>ECAM handling is a two-crew activity with a strict division of labour. The Pilot Flying keeps flying and commands; the Pilot Monitoring reads and actions. That division does not swap mid-procedure.</p>

  <div class="call-flow">
    <div class="call-row pf"><div class="call-who">PF</div><div class="call-what">Cancels the aural (MASTER WARN or MASTER CAUT). Continues to fly. <em>Does not look down at the ECAM yet.</em></div></div>
    <div class="call-row pf"><div class="call-who">PF</div><div class="call-what">"I have control" if there is any doubt. Stabilises flight path, selects appropriate thrust, confirms navigation.</div></div>
    <div class="call-row pf"><div class="call-who">PF</div><div class="call-what">"ECAM ACTIONS" <em>— only once the flight path is stable and above the minimum height.</em></div></div>
    <div class="call-row pm"><div class="call-who">PM</div><div class="call-what">Reads the failure title aloud, then reads each blue action line item before performing it.</div></div>
    <div class="call-row pm"><div class="call-who">PM</div><div class="call-what">For any irreversible item: states the item and the specific control, and waits. <em>"ENG 2 MASTER — OFF, confirm?"</em></div></div>
    <div class="call-row pf"><div class="call-who">PF</div><div class="call-what">Independently identifies the correct control, then "CONFIRM". <em>PF looks at the actual switch, not at the ECAM.</em></div></div>
    <div class="call-row pm"><div class="call-who">PM</div><div class="call-what">Actions the item. The line clears from the display once complete.</div></div>
    <div class="call-row pm"><div class="call-who">PM</div><div class="call-what">"ECAM ACTIONS COMPLETE" when all line items are actioned and cleared.</div></div>
    <div class="call-row pm"><div class="call-who">PM</div><div class="call-what">Reviews the STATUS page. Reads limitations, INOP systems, and any procedure to apply.</div></div>
  </div>

  <div class="callout red">
    <strong>The confirmation rule exists because of shutdown errors:</strong> Any action that cannot be undone gets an independent cross-check by both pilots before it is performed. Engine master switches, engine fire pushbuttons, IDG disconnects, guarded switches, generator and bleed pushbuttons. The PM identifies the control and the PF independently verifies it is the correct one, physically, before confirming. The whole history of wrong-engine shutdowns is the reason this rule is not negotiable.
  </div>

  <h2>ECAM control panel</h2>

  <table class="data-table">
    <thead><tr><th>Control</th><th>Function</th></tr></thead>
    <tbody>
      <tr><td class="mono">CLR</td><td>Clears the displayed warning or caution once its actions are complete. If further failures are queued, the next one is displayed.</td></tr>
      <tr><td class="mono">STS</td><td>Calls the STATUS page manually. Used after actions are complete and any time the crew wants to re-read limitations.</td></tr>
      <tr><td class="mono">RCL</td><td>Recalls warnings and cautions that were previously cleared or cancelled, provided the condition still exists.</td></tr>
      <tr><td class="mono">EMER CANC</td><td>Cancels an aural and suppresses that specific caution for the remainder of the flight. Use with care — the caution will not reappear.</td></tr>
      <tr><td class="mono">System page keys</td><td>ENG, BLEED, PRESS, ELEC, HYD, FUEL, APU, COND, DOOR, WHEEL, F/CTL. Manual call of any synoptic page.</td></tr>
      <tr><td class="mono">ALL</td><td>Cycles through every system page in sequence. Useful during a walkaround of the systems after a complex failure.</td></tr>
    </tbody>
  </table>

  <div class="callout amber">
    <strong>Do not clear early:</strong> Pressing CLR before all the blue line items are actioned removes the checklist from the display. It does not undo the failure, and the remaining actions still need doing. If a message is cleared prematurely, RCL will bring it back provided the condition persists.
  </div>

  <h2>The STATUS page</h2>

  <p>STATUS is where the failure's operational consequences live. It is not a summary of what broke; it is a list of what the crew now has to work with. It is reviewed after ECAM actions are complete and before any approach briefing is updated.</p>

  <table class="data-table">
    <thead><tr><th>STATUS section</th><th>Contains</th></tr></thead>
    <tbody>
      <tr><td><strong>LIMITATIONS</strong></td><td>Approach speed increments, maximum flap or slat configuration, maximum altitude, maximum speed, autoland availability, and any other restriction now applying.</td></tr>
      <tr><td><strong>INOP SYS</strong></td><td>Every system now inoperative as a consequence of the failure. This is the list that drives the landing performance and diversion decision.</td></tr>
      <tr><td><strong>PROCEDURE</strong></td><td>Any procedure still to be applied, including approach and landing procedures specific to the failed configuration.</td></tr>
      <tr><td><strong>CANCELLED CAUTION</strong></td><td>Cautions suppressed via EMER CANC. Worth reviewing so nothing has been forgotten.</td></tr>
      <tr><td><strong>MAINTENANCE</strong></td><td>Items for the engineers on the ground. No crew action required in flight.</td></tr>
    </tbody>
  </table>

  <h2>ECAM and the QRH</h2>

  <p>ECAM is the primary source for failures the aircraft can detect. The QRH covers what ECAM cannot.</p>

  <table class="data-table">
    <thead><tr><th>Use ECAM for</th><th>Use the QRH for</th></tr></thead>
    <tbody>
      <tr><td>Any failure the aircraft detects and annunciates</td><td>Failures with no ECAM annunciation (unreliable airspeed, certain smoke scenarios, control difficulties)</td></tr>
      <tr><td>The ordered corrective actions for that failure</td><td>Memory items, actioned before ECAM and from memory</td></tr>
      <tr><td>Resulting limitations and INOP systems via STATUS</td><td>Supplementary procedures referenced by the STATUS page</td></tr>
      <tr><td>System reconfiguration guidance</td><td>Landing distance and performance data for the failed configuration</td></tr>
    </tbody>
  </table>

  <h3>Memory items come first</h3>

  <p>A small set of procedures are actioned from memory, immediately, before any ECAM reading. They exist because there is no time to read. Typical A320 memory item procedures include stall recovery, windshear escape, EGPWS terrain escape, loss of braking, and the initial actions for unreliable airspeed. <span class="fcom-flag">⚑</span></p>

  <p>The operator's Operations Manual is the authority on which procedures are memory items for your fleet. That list is short by design, and the items on it are the ones to know cold.</p>

  <h2>Common handling errors</h2>

  <table class="data-table">
    <thead><tr><th>Error</th><th>Why it happens</th><th>What to do instead</th></tr></thead>
    <tbody>
      <tr><td class="warn">Starting ECAM actions too low</td><td>The aural is loud and the instinct is to make it stop and fix it</td><td>Cancel the aural, fly, climb to a safe height, then action</td></tr>
      <tr><td class="warn">Actioning without confirming</td><td>Time pressure, and the ECAM line looks unambiguous</td><td>Both pilots physically identify the control before any irreversible action</td></tr>
      <tr><td class="warn">Clearing before actions are complete</td><td>Reading the title as the whole message</td><td>Work every blue line item until the display clears itself</td></tr>
      <tr><td class="warn">Skipping the STATUS page</td><td>The failure feels handled once the actions are done</td><td>STATUS is where the approach speed increment and INOP list live. Always review it.</td></tr>
      <tr><td class="warn">Treating amber LAND ASAP as red</td><td>Both messages look similar under pressure</td><td>Read the colour deliberately. It changes the diversion decision.</td></tr>
      <tr><td class="warn">Both pilots heads-down on the ECAM</td><td>Complex failure, natural curiosity</td><td>PF flies. Full stop. The PM owns the ECAM.</td></tr>
      <tr><td class="warn">Over-using EMER CANC</td><td>A recurring caution is distracting</td><td>Suppressed cautions do not return. Use only where the procedure calls for it.</td></tr>
    </tbody>
  </table>

  <h2>Key points</h2>

  <table class="data-table">
    <thead><tr><th>Item</th><th>Detail</th></tr></thead>
    <tbody>
      <tr><td>ECAM displays</td><td class="mono">E/WD (upper) · SD (lower)</td></tr>
      <tr><td>Flight Warning Computers</td><td class="mono">2 × FWC</td></tr>
      <tr><td>System Data Acquisition Concentrators</td><td class="mono">2 × SDAC</td></tr>
      <tr><td>Display Management Computers</td><td class="mono">3 × DMC</td></tr>
      <tr><td>Red warning data path</td><td class="mono">Direct to FWC — bypasses SDAC ⚑</td></tr>
      <tr><td>Level 3 aural / light</td><td class="mono">CRC · flashing red MASTER WARN</td></tr>
      <tr><td>Level 2 aural / light</td><td class="mono">Single chime · steady amber MASTER CAUT</td></tr>
      <tr><td>Level 1 aural / light</td><td class="mono">None · none</td></tr>
      <tr><td>Action line item colour</td><td class="mono">Blue</td></tr>
      <tr><td>Number of flight phases</td><td class="mono">10 ⚑</td></tr>
      <tr><td>Minimum height for ECAM actions</td><td class="mono">400 ft AGL ⚑ (operator-specific)</td></tr>
      <tr><td>Red LAND ASAP</td><td class="warn">Land at nearest airport where a safe landing can be made</td></tr>
      <tr><td>Amber LAND ASAP</td><td class="cau">Consider severity; land at nearest suitable airport</td></tr>
      <tr><td>EMER CANC effect</td><td class="warn">Suppresses that caution for the remainder of the flight</td></tr>
    </tbody>
  </table>

  <p style="font-size:0.82rem;color:var(--ink-3);margin-top:-0.75rem"><span class="fcom-flag">⚑</span> = Verify against your operator's FCOM and Operations Manual. Phraseology, minimum heights, and memory item lists are operator-specific.</p>

  <div class="cta-block">
    <h3>Practise A320 questions</h3>
    <p>ProPilotLicence has 12,000+ DGCA ATPL and CPL practice questions — including a full A320 question bank covering every ATA chapter, verified by active airline captains. Free to start.</p>
    <a class="cta-btn" href="/login?next=/atpl">Practise A320 questions →</a>
  </div>

  <div class="disclaimer">
    <strong>Note:</strong> This article reflects general A320 family ECAM philosophy and handling technique based on publicly available aviation training materials. Alert classifications, phraseology, minimum heights for ECAM actions, memory item lists, and flight phase definitions vary by aircraft variant (A318/A319/A320/A321), modification state (MSN), software standard, and operator. Values and procedures marked <span class="fcom-flag">⚑</span> require verification against your aircraft's approved FCOM and your operator's Operations Manual before use in training, assessment, or operations. This article is not a substitute for approved training material. Content reviewed by the ProPilotLicence Captain Panel — four or more active commercial airline captains holding current DGCA CPL and ATPL licences.
  </div>

`
