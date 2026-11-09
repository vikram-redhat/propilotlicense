// IC Joshi, Aviation Meteorology — Chapter 1, Atmosphere.
// Editorial content from the Captain Panel source (ic-joshi-ch01-atmosphere.html):
// the inner HTML of <main class="article-wrap">, verbatim, split around the parts the
// page renders live from the database (At a glance, sample questions, CTA).
// The source's mock-up glance panel, practice placeholder and CTA block are dropped;
// nothing else is changed. Chapter links keep href="#" — the page resolves them.
import type { ChapterPageContent } from '@/lib/chapter-pages'

export const CHAPTER_1: ChapterPageContent = {
  chapterNumber: 1,
  slug: 'chapter-1-atmosphere',
  metaTitle: 'IC Joshi Chapter 1 Atmosphere: DGCA Notes and Questions',
  metaDescription: 'IC Joshi Aviation Meteorology Chapter 1, Atmosphere. Composition of air, the layers, tropopause over the equator and poles, the ISA with worked deviation examples, heating and practice questions.',
  excerpt: 'The Atmosphere is a High-weight chapter and the foundation for the rest of the book. Learn the layers, the tropopause and the ISA figures exactly, because they come back in pressure, temperature and altimetry questions.',
  publishedAt: '2026-11-10',
  updatedAt: '2026-11-10',
  reviewedBy: 'ProPilotLicence Captain Panel',

  // Fixed sample questions (chosen 2026-11-10): IC Joshi-sourced, active, syllabus
  // chapter 1, high confidence, with an explanation checked against this page. None in
  // this chapter had been reviewed yet. Fixed so the page is stable.
  sampleQuestionIds: [
    '300872b6-8159-4191-8e13-3470c9b7003a', // ISA lapse rate applies up to 36,090 ft (B)
    'db512f99-92cd-414c-b99d-704e0b30dec7', // troposphere holds about 75% of the mass (A)
    '0dfbb89e-40c6-4c25-8e24-0bae85a77165', // oxygen is about 21% by volume (C)
  ],

  head: String.raw`
  <div class="eyebrow">IC Joshi · Aviation Meteorology · Chapter 1</div>
  <h1>The Atmosphere: IC Joshi Chapter 1, DGCA Notes and Practice Questions</h1>

  <p class="standfirst">The Atmosphere is a High-weight chapter and the foundation for everything after it. DGCA asks about the composition of air, the layers and their boundaries, the tropopause, and the International Standard Atmosphere. The ISA figures in particular come back in pressure, temperature, density and altimetry questions, so learn them exactly here.</p>

  <div class="byline">
    <strong>ProPilotLicence Editorial</strong>
    <span class="byline-dot">·</span>
    <span>Reviewed by the ProPilotLicence Captain Panel</span>
    <span class="byline-dot">·</span>
    <span>DGCA CPL Meteorology</span>
  </div>
`,

  body: String.raw`
<h2 class="first">What DGCA asks from this chapter</h2>

  <ol>
    <li><strong>Composition.</strong> The gases in dry air and their proportions, and where water vapour and ozone fit in.</li>
    <li><strong>Vertical structure.</strong> The layers, their boundaries, and how temperature changes in each.</li>
    <li><strong>The tropopause.</strong> Its height and temperature over the equator and the poles, and how it changes with season.</li>
    <li><strong>The ISA.</strong> Sea level values, lapse rates, the tropopause, and ISA deviation questions.</li>
    <li><strong>Heating.</strong> How the sun heats the earth and the earth heats the air.</li>
  </ol>

  <h2>Composition of the atmosphere</h2>

  <p>Dry air is a mixture of gases in almost constant proportions up to about 80 km <span class="fcom-flag">⚑</span>. This lower, well-mixed region is sometimes called the homosphere.</p>

  <table class="data-table">
    <thead><tr><th>Gas</th><th>By volume</th><th>Why it matters</th></tr></thead>
    <tbody>
      <tr><td><strong>Nitrogen</strong></td><td class="mono">78.08%</td><td>The bulk of the air. Chemically inactive in weather.</td></tr>
      <tr><td><strong>Oxygen</strong></td><td class="mono">20.95%</td><td>Combustion and breathing. The percentage stays the same with height; the partial pressure falls, which causes hypoxia.</td></tr>
      <tr><td><strong>Argon</strong></td><td class="mono">0.93%</td><td>Inert</td></tr>
      <tr><td><strong>Carbon dioxide</strong></td><td class="mono">about 0.04%</td><td>Absorbs long-wave radiation from the earth (greenhouse effect)</td></tr>
      <tr><td>Other trace gases</td><td>Very small</td><td>Neon, helium, methane, hydrogen and others</td></tr>
    </tbody>
  </table>

  <p>Two gases vary and sit outside that table:</p>
  <ul>
    <li><strong>Water vapour</strong>: from almost nothing to about 4% by volume <span class="fcom-flag">⚑</span>. Most of it is in the lowest few kilometres, and almost all of it is in the troposphere. It's the gas that makes weather: cloud, fog, precipitation and the release of latent heat. See <a href="#">Chapter 5, Humidity</a>.</li>
    <li><strong>Ozone</strong>: concentrated in the stratosphere, with the highest concentration around 20 to 25 km <span class="fcom-flag">⚑</span>. It absorbs the sun's ultraviolet radiation, which is why the stratosphere warms with height.</li>
  </ul>
  <p>The air also carries solid and liquid particles: dust, smoke, salt and pollen. They act as <strong>condensation nuclei</strong>, without which cloud droplets would hardly form, and they're what you see as haze.</p>

  <h2>The layers of the atmosphere</h2>

  <p>The atmosphere is divided by how temperature changes with height. Each boundary is called a "pause", where the trend reverses or stops.</p>

  <!-- DIAGRAM: temperature profile and layers -->
  <div class="diagram-block">
    <div class="diagram-label">Diagram: temperature with height through the atmosphere</div>
    <div class="diagram-inner">
      <svg viewBox="0 0 740 350" role="img">
        <title>Temperature falls with height through the troposphere from 15 degrees at sea level to minus 56.5 at about 11 km, stays constant to 20 km, rises through the stratosphere to about 0 degrees at 50 km, falls through the mesosphere to about minus 90 at 85 km, then rises in the thermosphere.</title>
        <g font-family="Inter,sans-serif">
          <!-- ozone band 20-30 km -->
          <rect x="80" y="223" width="600" height="29" fill="#e9e1f5" opacity="0.8"/>
          <text x="690" y="242" text-anchor="end" font-size="10" fill="#5b3a8c">ozone layer</text>
          <!-- boundaries -->
          <line x1="80" y1="278" x2="700" y2="278" stroke="#6b7080" stroke-width="1" stroke-dasharray="4 4"/>
          <line x1="80" y1="165" x2="700" y2="165" stroke="#6b7080" stroke-width="1" stroke-dasharray="4 4"/>
          <line x1="80" y1="63.5" x2="700" y2="63.5" stroke="#6b7080" stroke-width="1" stroke-dasharray="4 4"/>
          <text x="700" y="274" text-anchor="end" font-size="10" fill="#6b7080">tropopause, about 11 km (ISA)</text>
          <text x="700" y="161" text-anchor="end" font-size="10" fill="#6b7080">stratopause, about 50 km</text>
          <text x="700" y="59" text-anchor="end" font-size="10" fill="#6b7080">mesopause, about 85 km</text>
          <!-- layer names -->
          <text x="90" y="300" font-size="11" font-weight="600" fill="#0d1117">Troposphere</text>
          <text x="90" y="205" font-size="11" font-weight="600" fill="#0d1117">Stratosphere</text>
          <text x="90" y="110" font-size="11" font-weight="600" fill="#0d1117">Mesosphere</text>
          <text x="90" y="40" font-size="11" font-weight="600" fill="#0d1117">Thermosphere</text>
          <!-- axes -->
          <line x1="80" y1="310" x2="700" y2="310" stroke="#353a47" stroke-width="1.2"/>
          <text x="80" y="326" text-anchor="middle" font-size="10" fill="#6b7080">−100°C</text>
          <text x="330" y="326" text-anchor="middle" font-size="10" fill="#6b7080">−50°C</text>
          <text x="580" y="326" text-anchor="middle" font-size="10" fill="#6b7080">0°C</text>
          <text x="390" y="344" text-anchor="middle" font-size="10" fill="#6b7080">temperature (height not to scale)</text>
          <!-- profile -->
          <polyline points="655,310 297.5,278 297.5,252 567.5,165 130,63.5 380,20" fill="none" stroke="#1a4fd6" stroke-width="2.5" stroke-linejoin="round"/>
          <text x="664" y="298" font-size="10" fill="#1a4fd6">MSL 15°C</text>
          <text x="305" y="268" font-size="10" fill="#1a4fd6">−56.5°C, constant 11 to 20 km</text>
          <text x="122" y="80" text-anchor="end" font-size="10" fill="#1a4fd6">about −90°C</text>
        </g>
      </svg>
    </div>
    <div class="diagram-caption">The profile shown is the ISA up to 32 km, and typical values above. Temperature falls in the troposphere and mesosphere, and rises in the stratosphere (ozone absorbing ultraviolet) and thermosphere.</div>
  </div>

  <table class="data-table">
    <thead><tr><th>Layer</th><th>Height (typical)</th><th>Temperature trend</th><th>Key facts</th></tr></thead>
    <tbody>
      <tr><td><strong>Troposphere</strong></td><td>Surface to 8 to 18 km</td><td>Falls, about 6.5°C per km</td><td>Almost all water vapour and weather. About three quarters of the atmosphere's mass <span class="fcom-flag">⚑</span>. Vertical mixing and convection.</td></tr>
      <tr><td><strong>Tropopause</strong></td><td>8 to 9 km at the poles, 16 to 18 km at the equator</td><td>Lapse rate stops</td><td>Boundary layer. Breaks in it near jet streams. Caps most cloud tops, though large Cb can overshoot it.</td></tr>
      <tr><td><strong>Stratosphere</strong></td><td>Tropopause to about 50 km</td><td>Constant at first, then rises</td><td>Very dry, very stable, little vertical motion. Ozone layer. Nacreous clouds are rare.</td></tr>
      <tr><td><strong>Mesosphere</strong></td><td>50 to about 85 km</td><td>Falls</td><td>Coldest part of the atmosphere, about −90°C at the mesopause. Noctilucent clouds. Meteors burn up here.</td></tr>
      <tr><td><strong>Thermosphere</strong></td><td>Above about 85 km</td><td>Rises sharply</td><td>Air is extremely thin, so high temperature means fast molecules, not heat you would feel. Aurora.</td></tr>
      <tr><td><strong>Exosphere</strong></td><td>Outer fringe, above about 500 km</td><td>n/a</td><td>Molecules escape to space</td></tr>
    </tbody>
  </table>

  <p>The <strong>ionosphere</strong> isn't a temperature layer. It's the electrically charged region from roughly 60 to several hundred kilometres <span class="fcom-flag">⚑</span>, overlapping the mesosphere and thermosphere, which reflects HF radio waves and makes long-range HF communication possible.</p>

  <h2>The tropopause</h2>

  <p>The tropopause is examined more than any other boundary. Its height depends on how warm, and so how deep, the troposphere below it is.</p>

  <table class="data-table">
    <thead><tr><th></th><th>Over the equator</th><th>Over the poles</th></tr></thead>
    <tbody>
      <tr><td>Height</td><td class="mono">about 16 to 18 km (FL 520 to 590)</td><td class="mono">about 8 to 9 km (FL 260 to 300)</td></tr>
      <tr><td>Temperature</td><td class="mono">about −75 to −80°C</td><td class="mono">about −45 to −55°C</td></tr>
      <tr><td>Why</td><td colspan="2">Warm air over the equator rises and convects to a great height. Temperature keeps falling all the way up, so a higher tropopause is a colder one.</td></tr>
    </tbody>
  </table>
  <p>Figures are typical values <span class="fcom-flag">⚑</span>. Two further points:</p>
  <ul>
    <li><strong>Season.</strong> The tropopause is higher in summer and lower in winter, for the same reason.</li>
    <li><strong>Breaks.</strong> It isn't continuous from equator to pole. It drops in steps, and the jet streams are found at these breaks, typically just below the tropopause. See <a href="#">Chapter 15, Jet Streams</a>.</li>
  </ul>
  <p>Over India the tropopause is high, around 16 km, for much of the year <span class="fcom-flag">⚑</span>, which is one reason monsoon and pre-monsoon cumulonimbus tops can reach well above FL 450.</p>

  <h2>The International Standard Atmosphere (ISA)</h2>

  <p>The ISA is an agreed, average atmosphere. Real conditions are almost never exactly ISA, but it gives a common reference for calibrating altimeters and airspeed indicators, and for comparing aircraft performance.</p>

  <table class="data-table">
    <thead><tr><th>Quantity</th><th>ISA value</th></tr></thead>
    <tbody>
      <tr><td>Mean sea level temperature</td><td class="mono">+15°C (288.15 K)</td></tr>
      <tr><td>Mean sea level pressure</td><td class="mono">1013.25 hPa (29.92 inHg)</td></tr>
      <tr><td>Mean sea level density</td><td class="mono">1.225 kg/m³</td></tr>
      <tr><td>Lapse rate, sea level to 11 km</td><td class="mono">6.5°C per km (1.98°C per 1,000 ft)</td></tr>
      <tr><td>Tropopause</td><td class="mono">11 km (36,090 ft), −56.5°C</td></tr>
      <tr><td>11 km to 20 km</td><td class="mono">Isothermal at −56.5°C</td></tr>
      <tr><td>20 km to 32 km</td><td class="mono">Rises at 1°C per km</td></tr>
      <tr><td>Air</td><td>Dry, a perfect gas</td></tr>
    </tbody>
  </table>
  <p>The ISA tropopause at 11 km is a mid-latitude average. It isn't the tropopause height over India or the equator.</p>

  <h3>ISA temperature and ISA deviation</h3>
  <p>For exam questions, use 2°C per 1,000 ft. ISA temperature at a level in the troposphere is:</p>
  <div class="callout blue">
    <strong>ISA temperature = 15 − (2 × height in thousands of feet)</strong>, down to −56.5°C at 36,090 ft. Above that, it stays at −56.5°C to about 65,600 ft.
  </div>
  <p><strong>ISA deviation</strong> is the actual temperature minus the ISA temperature at that level. Warmer than ISA is ISA plus; colder is ISA minus.</p>

  <h3>1. ISA deviation at FL 300</h3>
  <p>ISA at FL 300 = 15 − (2 × 30) = <strong>−45°C</strong>. The actual temperature is −35°C. Deviation = −35 − (−45) = <strong>ISA +10</strong>.</p>

  <h3>2. Actual temperature from a deviation</h3>
  <p>At FL 180 the forecast is ISA −8. ISA at FL 180 = 15 − 36 = −21°C. <strong>Actual = −21 − 8 = −29°C</strong>.</p>

  <h3>3. Above the tropopause</h3>
  <p>At FL 390 the temperature is −52°C. FL 390 is above the ISA tropopause, so ISA is −56.5°C. Deviation = −52 − (−56.5) = <strong>ISA +4.5</strong>. A common error is to carry on subtracting 2°C per 1,000 ft, which gives −63°C and the wrong answer.</p>

  <h3>4. Freezing level in ISA</h3>
  <p>The 0°C level is where 15 − 2h = 0, so h = 7.5. <strong>The ISA freezing level is about 7,500 ft.</strong> In an ISA +10 atmosphere it's about 12,500 ft.</p>

  <p>How the ISA feeds into altimeter errors and pressure altitude is covered in <a href="#">Chapter 2, Atmospheric Pressure</a>, and density altitude in <a href="#">Chapter 4, Air Density</a>.</p>

  <h2>Heating of the atmosphere</h2>

  <ul>
    <li><strong>The sun</strong> radiates mainly short-wave radiation. The atmosphere absorbs relatively little of it on the way down, so most reaches the surface or is reflected.</li>
    <li><strong>The earth's surface</strong> absorbs that radiation, warms, and radiates long-wave (infrared) radiation back up. Water vapour, carbon dioxide and cloud absorb much of this long-wave radiation.</li>
    <li>So the <strong>atmosphere is heated mainly from below</strong>, by the surface, not directly by the sun. That's why temperature normally falls with height in the troposphere.</li>
  </ul>

  <h3>How heat moves</h3>
  <table class="data-table">
    <thead><tr><th>Process</th><th>What it is</th><th>Example</th></tr></thead>
    <tbody>
      <tr><td><strong>Radiation</strong></td><td>Transfer by electromagnetic waves, no medium needed</td><td>Sun to earth; ground cooling on a clear night</td></tr>
      <tr><td><strong>Conduction</strong></td><td>Transfer by contact. Air is a poor conductor, so it only affects a thin layer.</td><td>Air in contact with hot ground by day, or cold ground by night</td></tr>
      <tr><td><strong>Convection</strong></td><td>Vertical transfer by rising and sinking air</td><td>Thermals and cumulus over heated land</td></tr>
      <tr><td><strong>Advection</strong></td><td>Horizontal transfer by the wind</td><td>Warm, moist air carried over a cold sea</td></tr>
      <tr><td><strong>Latent heat</strong></td><td>Heat absorbed in evaporation and released in condensation</td><td>Energy that drives thunderstorms and tropical cyclones</td></tr>
    </tbody>
  </table>

  <h3>What controls how much the surface heats</h3>
  <ul>
    <li><strong>Sun's angle</strong>: latitude, season and time of day. A high sun concentrates the energy on a smaller area.</li>
    <li><strong>Length of day.</strong></li>
    <li><strong>Cloud cover</strong>: reflects incoming radiation by day and traps outgoing radiation by night.</li>
    <li><strong>Surface type</strong>: albedo (fresh snow reflects most radiation, dark ground and forest absorb most), and land versus sea. Land heats and cools quickly; the sea heats and cools slowly, because of its high specific heat, mixing, and the sun penetrating its depth. That contrast drives land and sea breezes, and the monsoon. See <a href="#">Chapter 3, Temperature</a>.</li>
  </ul>

  <h2>Common traps</h2>

  <div class="trap">
    <div class="wrong">✗ "The tropopause is colder over the poles than over the equator."</div>
    <div class="right">✓ The reverse. The equatorial tropopause is higher, and so colder, about −75 to −80°C.</div>
  </div>
  <div class="trap">
    <div class="wrong">✗ "The percentage of oxygen falls as you climb."</div>
    <div class="right">✓ It stays at about 21%. The partial pressure of oxygen falls, because total pressure falls.</div>
  </div>
  <div class="trap">
    <div class="wrong">✗ "The stratosphere warms with height because it is closer to the sun."</div>
    <div class="right">✓ It warms because ozone absorbs ultraviolet radiation.</div>
  </div>
  <div class="trap">
    <div class="wrong">✗ "In the ISA, temperature keeps falling at 2°C per 1,000 ft above 36,000 ft."</div>
    <div class="right">✓ It stays at −56.5°C from 11 km to 20 km.</div>
  </div>
  <div class="trap">
    <div class="wrong">✗ "The atmosphere is heated directly by the sun."</div>
    <div class="right">✓ Mainly from below, by the earth's surface. That's why temperature normally falls with height.</div>
  </div>
  <div class="trap">
    <div class="wrong">✗ "The ISA tropopause at 11 km is the actual height of the tropopause."</div>
    <div class="right">✓ It's a mid-latitude average. It ranges from about 8 km over the poles to 18 km over the equator.</div>
  </div>
  <div class="trap">
    <div class="wrong">✗ "The coldest part of the atmosphere is the tropopause."</div>
    <div class="right">✓ The mesopause, around 85 km, at about −90°C, is colder.</div>
  </div>
  <div class="trap">
    <div class="wrong">✗ "Water vapour makes up a fixed 1% of the air."</div>
    <div class="right">✓ It varies, from almost nothing to about 4%, and is mostly in the lower troposphere.</div>
  </div>
  <div class="trap">
    <div class="wrong">✗ "The tropopause is higher in winter."</div>
    <div class="right">✓ Lower in winter, higher in summer, following the depth of warm air below it.</div>
  </div>
`,

  faq: String.raw`
<h2>Frequently asked questions</h2>
  <p class="faq-q">Which chapter of IC Joshi covers the structure of the atmosphere?</p>
  <p>Chapter 1, Atmosphere, in the 2019 edition of Aviation Meteorology by IC Joshi. It covers the composition of the air, the layers of the atmosphere, the tropopause, the International Standard Atmosphere and how the atmosphere is heated.</p>
  <p class="faq-q">What is the composition of the atmosphere?</p>
  <p>Dry air is about 78% nitrogen, 21% oxygen, 0.93% argon and about 0.04% carbon dioxide, with traces of other gases. Water vapour varies from almost nothing to about 4%. These proportions stay nearly constant up to about 80 km.</p>
  <p class="faq-q">Why is the tropopause higher and colder over the equator?</p>
  <p>Strong surface heating over the equator drives convection to a great height, so the troposphere is deeper there, about 16 to 18 km against 8 to 9 km over the poles. Temperature keeps falling with height through the troposphere, so the higher tropopause is colder, at about −75 to −80°C.</p>
  <p class="faq-q">What are the ISA sea level values?</p>
  <p>Temperature +15°C, pressure 1013.25 hPa and density 1.225 kg/m³. Temperature falls at 1.98°C per 1,000 ft to the tropopause at 36,090 ft, where it is −56.5°C, and stays constant up to about 65,600 ft.</p>
`,

  related: String.raw`
<h2>Related chapters</h2>
  <ul class="related">
    <li><a href="#">Chapter 2, Atmospheric Pressure</a>: pressure with height, and the ISA in altimetry.</li>
    <li><a href="#">Chapter 3, Temperature</a>: lapse rates, inversions and diurnal variation.</li>
    <li><a href="#">Chapter 4, Air Density</a>: density altitude and aircraft performance.</li>
    <li><a href="#">Chapter 5, Humidity</a>: water vapour, dew point and latent heat.</li>
    <li><a href="#">Chapter 9, Stability of Atmosphere</a>: why the stratosphere is stable.</li>
    <li><a href="#">Chapter 15, Jet Streams</a>: tropopause breaks and the jets.</li>
  </ul>
`,

  disclaimer: String.raw`
<div class="disclaimer">
    <strong>Note:</strong> This page is a study guide to the topics in Chapter 1 of <em>Aviation Meteorology</em> by IC Joshi (2019 edition) as they relate to the DGCA CPL Meteorology syllabus. It does not reproduce the book. Values marked <span class="fcom-flag">⚑</span> are typical figures from aviation meteorology training material and should be checked against the prescribed textbook. ProPilotLicence.com is not affiliated with, endorsed by, or associated with the author or publisher. Content reviewed by the ProPilotLicence Captain Panel.
  </div>
`,
}
