// IC Joshi, Aviation Meteorology — Chapter 2, Atmospheric Pressure.
// Editorial content from the Captain Panel source (ic-joshi-ch02-atmospheric-pressure.html):
// the inner HTML of <main class="article-wrap">, verbatim, split around the parts the
// page renders live from the database (At a glance, sample questions, CTA).
// The source's mock-up glance panel, practice placeholder and CTA block are dropped;
// nothing else is changed. Chapter links keep href="#" — the page resolves them.
import type { ChapterPageContent } from '@/lib/chapter-pages'

export const CHAPTER_2: ChapterPageContent = {
  chapterNumber: 2,
  slug: 'chapter-2-atmospheric-pressure',
  metaTitle: 'IC Joshi Ch 2 Atmospheric Pressure: DGCA Notes and Questions',
  metaDescription: 'IC Joshi Aviation Meteorology Chapter 2, Atmospheric Pressure. QNH, QFE, QFF and QNE, altimeter errors, transition procedures, five worked numericals and practice questions.',
  excerpt: 'Atmospheric Pressure is a High-weight chapter and home to the numericals. Get QNH, QFE, QFF and QNE exact, understand why temperature changes the altimeter, and these become the easiest marks in the paper.',
  publishedAt: '2026-11-05',
  updatedAt: '2026-11-05',
  reviewedBy: 'ProPilotLicence Captain Panel',

  // Fixed sample questions (chosen 2026-11-06): active, syllabus chapter 2, high
  // confidence, with an explanation checked against this page. Fixed so the page is stable.
  sampleQuestionIds: [
    '73033c14-7750-4bef-9703-be7b279d036a', // high to low pressure: true altitude decreases (IC Joshi)
    'ec90d8dc-1871-4b32-89cd-5e6c9d237cc0', // colder than ISA: true altitude lower (Underdown & Standen)
    'cca1c758-5799-4abc-8e85-d6ef5f544599', // QNH set on the ground reads aerodrome elevation (Oxford)
  ],

  head: String.raw`
  <div class="eyebrow">IC Joshi · Aviation Meteorology · Chapter 2</div>
  <h1>Atmospheric Pressure: IC Joshi Chapter 2, DGCA Notes and Practice Questions</h1>

  <p class="standfirst">Atmospheric Pressure is a High-weight chapter, and it's where the numericals live. QNH, QFE, QFF, pressure altitude, density altitude and altimeter errors turn up in almost every DGCA Meteorology paper. Get the definitions exact, understand why pressure behaves as it does with height and temperature, and practise the arithmetic until it's automatic.</p>

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
    <li><strong>Definitions.</strong> Height, altitude, elevation and flight level, and the four Q codes: QFE, QNH, QFF and QNE.</li>
    <li><strong>Numericals.</strong> QFE to QNH, pressure altitude, true altitude after a pressure change, density altitude, and the effect of a wrong subscale setting.</li>
    <li><strong>Altimeter errors.</strong> Whether the aircraft is higher or lower than indicated, and by how much.</li>
    <li><strong>Transition procedures.</strong> Transition altitude, transition level, the transition layer, and how QNH moves the transition level.</li>
    <li><strong>Pressure behaviour.</strong> How pressure falls with height and why temperature changes the rate, the semi-diurnal variation, pressure tendency, and the shapes on a pressure chart.</li>
  </ol>

  <h2>Pressure: what it is and how it's measured</h2>

  <ul>
    <li><strong>Static pressure</strong> is the weight of the column of air above a point, per unit area, acting equally in all directions. It's what a barometer and an altimeter measure.</li>
    <li><strong>Dynamic pressure</strong> is the extra pressure from air in motion against a surface, ½ρV². The pitot tube senses total pressure (static plus dynamic). The airspeed indicator subtracts static to get dynamic.</li>
    <li><strong>Units.</strong> Pressure is reported in hectopascals (hPa), equal to millibars (mb). 1013.25 hPa equals 29.92 inches of mercury and 760 mm of mercury.</li>
    <li><strong>Instruments.</strong> The mercury barometer is the standard reference. The aneroid barometer uses a sealed, partly evacuated capsule and is the principle behind the altimeter. The barograph records pressure against time. See <a href="#">Chapter 23, Met Instruments</a>.</li>
  </ul>

  <h3>ISA values worth knowing cold</h3>
  <table class="data-table">
    <thead><tr><th>ISA value</th><th>Figure</th></tr></thead>
    <tbody>
      <tr><td>Mean sea level pressure</td><td class="mono">1013.25 hPa</td></tr>
      <tr><td>Mean sea level temperature</td><td class="mono">+15°C</td></tr>
      <tr><td>Mean sea level density</td><td class="mono">1.225 kg/m³</td></tr>
      <tr><td>Temperature lapse rate to the tropopause</td><td class="mono">1.98°C per 1,000 ft (6.5°C per km)</td></tr>
      <tr><td>Tropopause</td><td class="mono">36,090 ft (11 km), −56.5°C</td></tr>
    </tbody>
  </table>

  <h2>Vertical variation of pressure</h2>

  <p>Pressure falls with height, quickly at first and then more slowly, because the air is compressed by its own weight and is densest near the ground. Near mean sea level it falls by about <strong>1 hPa for every 27 ft</strong>. This is the figure to use in DGCA calculations. Some books round it to 30 ft to make the arithmetic easier.</p>

  <table class="data-table">
    <thead><tr><th>Pressure level</th><th>Approximate ISA height</th><th>Approximate ft per hPa</th></tr></thead>
    <tbody>
      <tr><td class="mono">1013 hPa</td><td>Mean sea level</td><td class="mono">27</td></tr>
      <tr><td class="mono">850 hPa</td><td>5,000 ft</td><td class="mono">32</td></tr>
      <tr><td class="mono">700 hPa</td><td>10,000 ft</td><td class="mono">37</td></tr>
      <tr><td class="mono">500 hPa</td><td>18,000 ft</td><td class="mono">50</td></tr>
      <tr><td class="mono">300 hPa</td><td>30,000 ft</td><td class="mono">73</td></tr>
      <tr><td class="mono">200 hPa</td><td>39,000 ft</td><td class="mono">105</td></tr>
    </tbody>
  </table>
  <p>The heights are standard pressure levels used on upper-air charts, rounded. Note that pressure halves at roughly 18,000 ft.</p>

  <h3>Why temperature changes the rate</h3>
  <p>Cold air is denser than warm air, so a column of cold air is shorter than a column of warm air holding the same weight of air. That means <strong>pressure falls faster with height in cold air</strong> and more slowly in warm air. Two consequences matter for the exam:</p>
  <ul>
    <li>In cold air, a given pressure level, and so a given altimeter reading, sits <strong>lower</strong> than in ISA. In warm air it sits higher. That's the temperature error of the altimeter.</li>
    <li>On an upper-air (constant pressure) chart, high contour heights mark warm columns of air and low contour heights mark cold ones. Pressure systems therefore tilt with height: a cold-core low strengthens with height, and a warm-core high strengthens with height.</li>
  </ul>

  <h2>Pressure changes over time</h2>

  <h3>Semi-diurnal variation</h3>
  <p>Even with no weather system moving through, surface pressure rises and falls twice a day, because of atmospheric tides driven by solar heating. It peaks around <strong>10:00 and 22:00</strong> local time and dips around <strong>04:00 and 16:00</strong>. The swing is up to about 3 hPa in the tropics <span class="fcom-flag">⚑</span>, and almost nothing at high latitudes, so it matters across India. In the tropics, the daily variation is often larger than the change caused by weather systems. A fall in pressure that goes against the daily pattern, or is larger than it, can be the first sign of a developing depression.</p>

  <h3>Pressure tendency</h3>
  <p>The change in surface pressure over the last three hours is the pressure tendency, reported in synoptic observations. Lines joining places with equal tendency are <strong>isallobars</strong>. A steady, rapid fall usually means an approaching depression or trough. A steady rise means a ridge or high building in.</p>

  <h2>Pressure patterns</h2>
  <p>Surface pressure charts plot <strong>QFF</strong> (pressure reduced to sea level), with lines of equal pressure called isobars, usually drawn every 2 or 4 hPa.</p>
  <table class="data-table">
    <thead><tr><th>Pattern</th><th>Features</th><th>Typical weather</th></tr></thead>
    <tbody>
      <tr><td><strong>Low (depression)</strong></td><td>Closed isobars, lowest pressure in the centre. Air converges at the surface and rises.</td><td>Cloud, precipitation, stronger winds. Anticlockwise circulation in the northern hemisphere.</td></tr>
      <tr><td><strong>High (anticyclone)</strong></td><td>Closed isobars, highest pressure in the centre. Air subsides and diverges at the surface.</td><td>Usually settled. Subsidence can cause an inversion, trapping haze, smoke and fog. Clockwise in the northern hemisphere.</td></tr>
      <tr><td><strong>Trough</strong></td><td>A V-shaped extension of low pressure.</td><td>Similar to a low, often with a line of cloud and showers along its axis.</td></tr>
      <tr><td><strong>Ridge</strong></td><td>A U-shaped extension of high pressure.</td><td>Similar to a high, usually fair.</td></tr>
      <tr><td><strong>Col</strong></td><td>The neutral area between two highs and two lows.</td><td>Light, variable winds. Fog in winter, thunderstorms in summer.</td></tr>
    </tbody>
  </table>
  <p>The <strong>pressure gradient</strong> is the rate of change of pressure with horizontal distance, measured at right angles to the isobars. Isobars close together mean a steep gradient and strong winds. That's the link to <a href="#">Chapter 6, Winds</a>.</p>

  <h2>Height, altitude, elevation and flight level</h2>

  <table class="data-table">
    <thead><tr><th>Term</th><th>Measured from</th><th>Altimeter setting</th></tr></thead>
    <tbody>
      <tr><td><strong>Height</strong></td><td>A specified datum, usually the aerodrome</td><td>QFE</td></tr>
      <tr><td><strong>Altitude</strong></td><td>Mean sea level</td><td>QNH</td></tr>
      <tr><td><strong>Elevation</strong></td><td>Mean sea level, for a point or level on the ground</td><td>None. It's a fixed property of the place.</td></tr>
      <tr><td><strong>Flight level</strong></td><td>The 1013.25 hPa pressure surface, in hundreds of feet</td><td>1013.25 hPa (standard)</td></tr>
      <tr><td><strong>Pressure altitude</strong></td><td>The 1013.25 hPa pressure surface</td><td>1013.25 hPa. FL 75 means a pressure altitude of 7,500 ft.</td></tr>
    </tbody>
  </table>

  <h2>The four Q codes</h2>

  <!-- DIAGRAM: Q codes -->
  <div class="diagram-block">
    <div class="diagram-label">Diagram: what the altimeter reads on the ground with each setting</div>
    <div class="diagram-inner">
      <svg viewBox="0 0 720 300" role="img">
        <title>An aerodrome at 600 ft elevation. With QFE set the altimeter reads zero, with QNH it reads 600 ft, and with 1013.25 hPa set it reads the aerodrome's pressure altitude, which is QNE.</title>
        <!-- MSL -->
        <line x1="20" y1="250" x2="700" y2="250" stroke="#1a4fc4" stroke-width="1.5"/>
        <text x="24" y="268" font-family="Inter,sans-serif" font-size="10" fill="#1a4fc4">Mean sea level</text>
        <!-- terrain / aerodrome -->
        <path d="M20 250 L180 250 L240 150 L700 150 L700 250 Z" fill="#e6f4ee" stroke="#0b6e48" stroke-width="1.2"/>
        <!-- 1013 datum, drawn over the terrain -->
        <line x1="20" y1="215" x2="700" y2="215" stroke="#7a5200" stroke-width="1.2" stroke-dasharray="6 4"/>
        <text x="24" y="209" font-family="Inter,sans-serif" font-size="10" fill="#7a5200">1013.25 hPa</text>
        <text x="300" y="142" font-family="Inter,sans-serif" font-size="11" font-weight="600" fill="#0b6e48">Aerodrome, elevation 600 ft</text>
        <!-- elevation arrow -->
        <line x1="270" y1="150" x2="270" y2="250" stroke="#0b6e48" stroke-width="1" stroke-dasharray="3 3"/>
        <!-- three altimeters -->
        <g font-family="Inter,sans-serif">
          <rect x="320" y="30" width="110" height="64" rx="8" fill="#fff" stroke="#e2e4ea"/>
          <text x="375" y="52" text-anchor="middle" font-size="12" font-weight="600" fill="#0d1117">QFE set</text>
          <text x="375" y="72" text-anchor="middle" font-size="16" font-weight="600" fill="#0b6e48">0 ft</text>
          <text x="375" y="87" text-anchor="middle" font-size="9" fill="#6b7080">height above aerodrome</text>

          <rect x="445" y="30" width="110" height="64" rx="8" fill="#fff" stroke="#e2e4ea"/>
          <text x="500" y="52" text-anchor="middle" font-size="12" font-weight="600" fill="#0d1117">QNH set</text>
          <text x="500" y="72" text-anchor="middle" font-size="16" font-weight="600" fill="#1a4fc4">600 ft</text>
          <text x="500" y="87" text-anchor="middle" font-size="9" fill="#6b7080">elevation (altitude)</text>

          <rect x="570" y="30" width="125" height="64" rx="8" fill="#fff" stroke="#e2e4ea"/>
          <text x="632" y="52" text-anchor="middle" font-size="12" font-weight="600" fill="#0d1117">1013.25 set</text>
          <text x="632" y="72" text-anchor="middle" font-size="16" font-weight="600" fill="#7a5200">QNE</text>
          <text x="632" y="87" text-anchor="middle" font-size="9" fill="#6b7080">pressure altitude of field</text>
        </g>
      </svg>
    </div>
    <div class="diagram-caption">The same aircraft on the same apron gives three different readings. QFE gives height above the aerodrome, QNH gives elevation, and 1013.25 hPa gives the aerodrome's pressure altitude. The 1013.25 hPa level is drawn above sea level, as on a day when QNH is above 1013.</div>
  </div>

  <table class="data-table">
    <thead><tr><th>Code</th><th>What it is</th><th>On the ground, the altimeter reads</th></tr></thead>
    <tbody>
      <tr><td class="mono">QFE</td><td>Pressure at aerodrome level (officially, at the runway threshold or aerodrome reference point)</td><td>Zero</td></tr>
      <tr><td class="mono">QNH</td><td>Aerodrome pressure reduced to mean sea level using the <strong>ISA</strong> temperature</td><td>Aerodrome elevation</td></tr>
      <tr><td class="mono">QFF</td><td>Aerodrome pressure reduced to mean sea level using the <strong>actual</strong> temperature. Plotted on synoptic charts, not set on an altimeter.</td><td>Not used for altimetry</td></tr>
      <tr><td class="mono">QNE</td><td>The altimeter reading on the ground with 1013.25 hPa set</td><td>The aerodrome's pressure altitude</td></tr>
    </tbody>
  </table>

  <h3>QNH versus QFF: which is bigger?</h3>
  <p>Both reduce aerodrome pressure to sea level, and the only difference is the temperature assumed for the imaginary column of air between the aerodrome and sea level. This makes a popular technical question:</p>
  <ul>
    <li><strong>Colder than ISA:</strong> the actual column is denser, so pressure increases faster going down. <strong>QFF is greater than QNH.</strong></li>
    <li><strong>Warmer than ISA:</strong> the column is less dense. <strong>QFF is less than QNH.</strong></li>
    <li><strong>ISA conditions, or an aerodrome at sea level:</strong> QFF equals QNH.</li>
  </ul>

  <h2>Transition procedures</h2>
  <ul>
    <li><strong>Transition altitude:</strong> at or below it, vertical position is given as altitude on QNH. <strong>Climbing</strong> through it, set 1013.25 hPa.</li>
    <li><strong>Transition level:</strong> the lowest flight level available above the transition altitude. <strong>Descending</strong> through it, set QNH.</li>
    <li><strong>Transition layer:</strong> the airspace between the two. Level flight within it isn't normally allowed.</li>
  </ul>
  <p>The transition altitude is fixed and published. The transition level moves with QNH. When QNH is low, flight levels sit lower in true altitude, so the transition level has to be raised to keep the transition layer at least the required depth. <strong>The lower the QNH, the higher the transition level.</strong></p>

  <p>The depth of the transition layer itself also depends on the QNH:</p>
  <table class="data-table">
    <thead><tr><th>QNH</th><th>Transition layer depth</th></tr></thead>
    <tbody>
      <tr><td class="mono">1013 hPa or above</td><td class="mono">1,000 ft</td></tr>
      <tr><td class="mono">995 to 1013 hPa</td><td class="mono">1,500 ft</td></tr>
      <tr><td class="mono">Below 995 hPa</td><td class="mono">2,000 ft</td></tr>
    </tbody>
  </table>

  <h2>Altimeter errors</h2>

  <!-- DIAGRAM: high to low -->
  <div class="diagram-block">
    <div class="diagram-label">Diagram: flying from high pressure to low pressure without resetting the altimeter</div>
    <div class="diagram-inner">
      <svg viewBox="0 0 720 280" role="img">
        <title>An aircraft holds a constant altimeter reading by following a constant pressure surface. Flying from high pressure towards low pressure, that surface slopes down, so the aircraft descends without the altimeter showing it.</title>
        <defs>
          <marker id="ah" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M2 2L8 5L2 8" fill="none" stroke="#991f1f" stroke-width="1.6"/></marker>
        </defs>
        <g font-family="Inter,sans-serif">
          <line x1="20" y1="240" x2="700" y2="240" stroke="#1a4fc4" stroke-width="1.5"/>
          <text x="24" y="258" font-size="10" fill="#1a4fc4">Mean sea level</text>
          <line x1="20" y1="90" x2="700" y2="90" stroke="#9aa0ad" stroke-width="1" stroke-dasharray="3 4"/>
          <text x="24" y="84" font-size="9" fill="#6b7080">3,000 ft true altitude</text>
          <path d="M60 90 C 260 92, 460 140, 660 160" stroke="#7a5200" stroke-width="1.5" fill="none" stroke-dasharray="6 4"/>
          <text x="470" y="125" font-size="9" fill="#7a5200">constant pressure surface the altimeter follows</text>
          <path d="M70 92 C 270 94, 460 140, 640 158" stroke="#991f1f" stroke-width="2.2" fill="none" marker-end="url(#ah)"/>
          <text x="80" y="40" font-size="13" font-weight="700" fill="#1a4fc4">HIGH</text>
          <text x="80" y="56" font-size="9" fill="#6b7080">QNH 1013 set here</text>
          <text x="600" y="40" font-size="13" font-weight="700" fill="#991f1f">LOW</text>
          <text x="600" y="56" font-size="9" fill="#6b7080">actual QNH 993</text>
          <line x1="660" y1="90" x2="660" y2="160" stroke="#991f1f" stroke-width="1"/>
          
          <path d="M200 240 L260 200 L320 240 Z" fill="#e6f4ee" stroke="#0b6e48"/>
          <path d="M540 240 L610 192 L680 240 Z" fill="#e6f4ee" stroke="#0b6e48"/>
          <text x="340" y="205" font-size="10" font-weight="600" fill="#991f1f">reads 3,000 ft, actually about 2,460 ft</text>
        </g>
      </svg>
    </div>
    <div class="diagram-caption">Holding 3,000 ft on the altimeter means following a pressure surface, not a fixed height. Flying from high to low pressure, that surface slopes down towards the terrain. 20 hPa × 27 ft = 540 ft lower than indicated.</div>
  </div>

  <table class="data-table">
    <thead><tr><th>You fly from</th><th>Without resetting, the altimeter</th><th>So the aircraft is</th></tr></thead>
    <tbody>
      <tr><td>High pressure to low pressure</td><td>Over-reads</td><td><strong>Lower than indicated</strong></td></tr>
      <tr><td>Low pressure to high pressure</td><td>Under-reads</td><td>Higher than indicated</td></tr>
      <tr><td>Warm air to cold air (colder than ISA)</td><td>Over-reads</td><td><strong>Lower than indicated</strong></td></tr>
      <tr><td>Cold air to warm air (warmer than ISA)</td><td>Under-reads</td><td>Higher than indicated</td></tr>
    </tbody>
  </table>

  <div class="callout red">
    <strong>"High to low, look out below":</strong> the rule covers both pressure and temperature. Flying into lower pressure or colder air puts the aircraft lower than the altimeter shows, which is the dangerous direction near terrain. Cold-temperature corrections to minimum altitudes exist for exactly this reason.
  </div>

  <h3>Subscale setting errors</h3>
  <p>Turning the subscale up increases the altimeter reading, at 27 ft per hPa. If the correct QNH is 1005 but 1015 is set, the altimeter reads <strong>270 ft too high</strong>, so the aircraft is 270 ft lower than indicated. A higher setting than the true value always makes the aircraft lower than it thinks.</p>

  <h2>Worked numericals</h2>

  <h3>1. QFE to QNH</h3>
  <p>An aerodrome has an elevation of 540 ft and a QFE of 995 hPa. At 27 ft per hPa, 540 ft is 20 hPa. QNH is higher than QFE for an aerodrome above sea level, so <strong>QNH = 995 + 20 = 1015 hPa</strong>.</p>

  <h3>2. Pressure altitude</h3>
  <p>The same aerodrome, with QNH 1003 hPa. The difference from standard is 1013 − 1003 = 10 hPa, which is 270 ft. Lower pressure means a higher pressure altitude, so <strong>pressure altitude = 540 + 270 = 810 ft</strong>. With 1013.25 set on the ground, the altimeter reads 810 ft, which is the QNE.</p>

  <h3>3. True altitude after a pressure change</h3>
  <p>An aircraft departs with QNH 1013 set and holds 3,000 ft on the altimeter into an area where QNH is 993. The altimeter is now over-reading by 20 × 27 = 540 ft. <strong>True altitude ≈ 2,460 ft.</strong></p>

  <h3>4. Density altitude</h3>
  <p>Add about 120 ft to the pressure altitude for every 1°C the temperature is above ISA <span class="fcom-flag">⚑</span>. An aerodrome has a pressure altitude of 2,000 ft and a temperature of +36°C. ISA at 2,000 ft is 15 − 4 = 11°C, so it's ISA +25. Density altitude ≈ 2,000 + (25 × 120) = <strong>5,000 ft</strong>. The aircraft performs as if it were at 5,000 ft: longer take-off run and poorer climb. See <a href="#">Chapter 4, Air Density</a>.</p>

  <h2>Common traps</h2>

  <div class="trap">
    <div class="wrong">✗ "QFF and QNH are the same thing."</div>
    <div class="right">✓ QNH uses the ISA temperature and is set on altimeters. QFF uses the actual temperature and is used for charts. They're equal only in ISA conditions or at a sea-level aerodrome.</div>
  </div>
  <div class="trap">
    <div class="wrong">✗ "On a cold day at an elevated aerodrome, QNH is greater than QFF."</div>
    <div class="right">✓ QFF is greater. The colder, denser column means pressure increases faster on the way down to sea level.</div>
  </div>
  <div class="trap">
    <div class="wrong">✗ "Flying into lower pressure, the aircraft is higher than indicated."</div>
    <div class="right">✓ It's lower than indicated. The altimeter over-reads. High to low, look out below.</div>
  </div>
  <div class="trap">
    <div class="wrong">✗ "Setting a higher QNH than the actual value makes the altimeter under-read."</div>
    <div class="right">✓ A higher setting makes it over-read, by 27 ft per hPa. The aircraft is lower than indicated.</div>
  </div>
  <div class="trap">
    <div class="wrong">✗ "Change to 1013.25 at the transition level when climbing."</div>
    <div class="right">✓ Climbing, change at the transition altitude. Descending, change to QNH at the transition level.</div>
  </div>
  <div class="trap">
    <div class="wrong">✗ "When QNH is low, the transition level comes down."</div>
    <div class="right">✓ It goes up. Low QNH puts flight levels lower in true altitude, so a higher level is needed to keep the transition layer.</div>
  </div>
  <div class="trap">
    <div class="wrong">✗ "Pressure peaks at noon when heating is greatest."</div>
    <div class="right">✓ The semi-diurnal maxima are around 10:00 and 22:00 local time, with minima around 04:00 and 16:00.</div>
  </div>
  <div class="trap">
    <div class="wrong">✗ "For an aerodrome above sea level, QNH is lower than QFE."</div>
    <div class="right">✓ QNH is higher. Pressure is reduced to sea level, which is lower down, where pressure is greater.</div>
  </div>
  <div class="trap">
    <div class="wrong">✗ "Pressure falls by the same amount for every 1,000 ft of height."</div>
    <div class="right">✓ It falls fastest near the surface and more slowly with height: about 27 ft per hPa at sea level, about 50 ft per hPa at 18,000 ft.</div>
  </div>
`,

  faq: String.raw`
  <h2>Frequently asked questions</h2>
  <p class="faq-q">Which chapter of IC Joshi covers atmospheric pressure?</p>
  <p>Chapter 2, Atmospheric Pressure, in the 2019 edition of Aviation Meteorology by IC Joshi. It covers static and dynamic pressure, how pressure varies with height and through the day, pressure patterns, and altimetry.</p>
  <p class="faq-q">What is the difference between QNH and QFE?</p>
  <p>QFE is the pressure at aerodrome level. With it set, the altimeter reads zero on the ground and shows height above the aerodrome. QNH is that pressure reduced to mean sea level using the ISA temperature. With it set, the altimeter reads the aerodrome elevation on the ground and shows altitude above mean sea level.</p>
  <p class="faq-q">How many feet is 1 hPa for altimeter calculations?</p>
  <p>About 27 ft per hPa near mean sea level, which is the figure to use in DGCA calculations. It is sometimes rounded to 30 ft. The figure increases with height, to about 50 ft per hPa at 18,000 ft.</p>
  <p class="faq-q">What is the difference between transition altitude and transition level?</p>
  <p>Transition altitude is where a climbing aircraft changes from QNH to 1013.25 hPa. Transition level is the lowest usable flight level above it, where a descending aircraft changes from 1013.25 hPa to QNH. The space between them is the transition layer.</p>
`,

  related: String.raw`
  <h2>Related chapters</h2>
  <ul class="related">
    <li><a href="#">Chapter 1, Atmosphere</a>: the ISA values behind every altimetry calculation.</li>
    <li><a href="#">Chapter 3, Temperature</a>: why temperature changes how fast pressure falls with height.</li>
    <li><a href="#">Chapter 4, Air Density</a>: pressure altitude and density altitude.</li>
    <li><a href="#">Chapter 6, Winds</a>: the pressure gradient as the force behind the wind.</li>
    <li><a href="#">Chapter 23, Met Instruments</a>: barometers and barographs.</li>
  </ul>
`,

  disclaimer: String.raw`
  <div class="disclaimer">
    <strong>Note:</strong> This page is a study guide to the topics in Chapter 2 of <em>Aviation Meteorology</em> by IC Joshi (2019 edition) as they relate to the DGCA CPL Meteorology syllabus. It does not reproduce the book. Values marked <span class="fcom-flag">⚑</span> are typical figures from aviation meteorology training material and should be checked against the prescribed textbook. Altimeter setting procedures in operation are as published in the AIP and by ATC. ProPilotLicence.com is not affiliated with, endorsed by, or associated with the author or publisher. Content reviewed by the ProPilotLicence Captain Panel.
  </div>
`,
}
