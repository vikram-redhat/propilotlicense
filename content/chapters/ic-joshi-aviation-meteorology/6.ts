// IC Joshi, Aviation Meteorology — Chapter 6, Winds.
// Editorial content from the Captain Panel source (ic-joshi-ch06-winds.html):
// the inner HTML of <main class="article-wrap">, verbatim, split around the parts the
// page renders live from the database (At a glance, sample questions, CTA).
// The source's mock-up glance panel, practice placeholder and CTA block are dropped;
// nothing else is changed. Chapter links keep href="#" — the page resolves them.
import type { ChapterPageContent } from '@/lib/chapter-pages'

export const CHAPTER_6: ChapterPageContent = {
  chapterNumber: 6,
  slug: 'chapter-6-winds',
  metaTitle: 'IC Joshi Chapter 6 Winds: DGCA Notes and Questions',
  metaDescription: "IC Joshi Aviation Meteorology Chapter 6, Winds. Coriolis, geostrophic and gradient wind, Buys Ballot's law, surface versus upper winds, thermal wind, local winds, monsoon and practice questions.",
  excerpt: 'Winds is a High-weight chapter built on four forces. Know which are in balance and how they change with latitude, height and temperature, and the rest of the chapter follows.',
  publishedAt: '2026-11-05',
  updatedAt: '2026-11-05',
  reviewedBy: 'ProPilotLicence Captain Panel',

  // Fixed sample questions (chosen 2026-11-06): active, syllabus chapter 6, high
  // confidence, with an explanation checked against this page. Fixed so the page is stable.
  sampleQuestionIds: [
    '471679e2-29fd-48da-97f5-9a6df6d578c1', // geostrophic wind: PGF and Coriolis in balance (IC Joshi)
    '46e058b8-0502-4e9a-b039-af1d39e68092', // Buys Ballot in the southern hemisphere (Oxford)
    '7429a957-4cca-4d6b-921f-e95098ce4615', // wind veers with height as friction falls off (Oxford)
  ],

  head: String.raw`
  <div class="eyebrow">IC Joshi · Aviation Meteorology · Chapter 6</div>
  <h1>Winds: IC Joshi Chapter 6, DGCA Notes and Practice Questions</h1>

  <p class="standfirst">Winds is a High-weight chapter and one of the biggest in IC Joshi. Almost every wind question comes back to four forces: the pressure gradient, Coriolis, centrifugal force and friction. Understand which ones are in balance, how they change with latitude, height and temperature, and the geostrophic wind, Buys Ballot's law, surface versus upper winds and the thermal wind all follow.</p>

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
    <li><strong>Terms.</strong> How wind direction is reported, veering and backing, gust, lull, squall and gale, and the Beaufort scale.</li>
    <li><strong>The forces.</strong> Pressure gradient force, Coriolis, centrifugal force and friction, and how Coriolis varies with latitude and speed.</li>
    <li><strong>Balanced winds.</strong> Geostrophic, gradient and cyclostrophic wind, where each applies, and how the geostrophic wind changes with latitude and air density.</li>
    <li><strong>Surface versus upper wind.</strong> How friction changes speed and direction, and how both change through the day.</li>
    <li><strong>Thermal wind.</strong> Why wind changes with height, and what warm and cold advection do to the direction.</li>
    <li><strong>Local and global winds.</strong> Sea and land breezes, anabatic and katabatic winds, fohn, trade winds, westerlies and the monsoon.</li>
  </ol>

  <h2>Describing and measuring the wind</h2>
  <ul>
    <li><strong>Direction</strong> is always the direction the wind is blowing <strong>from</strong>. A westerly blows from the west. METARs, TAFs and upper wind forecasts give it in degrees <strong>true</strong>. The surface wind given by ATC for take-off and landing, and on ATIS, is in degrees <strong>magnetic</strong>, so it can be compared with the runway direction.</li>
    <li><strong>Speed</strong> is given in knots (sometimes km/h or m/s). It's measured by a cup anemometer at a standard height of 10 m above the ground, with direction from a wind vane. The reported surface wind is a mean over 10 minutes <span class="fcom-flag">⚑</span>.</li>
    <li><strong>In a METAR</strong>, gusts are reported when they exceed the mean speed by 10 kt or more <span class="fcom-flag">⚑</span>, for example <span class="mono">27015G28KT</span>. VRB means variable direction, and a range such as <span class="mono">240V300</span> is given when the direction varies widely.</li>
    <li><strong>Veering</strong> is a clockwise change in direction, for example from 270° to 300°. <strong>Backing</strong> is anticlockwise, for example from 270° to 240°. Both apply to a change in time at one place, or to a change with height.</li>
  </ul>

  <table class="data-table">
    <thead><tr><th>Term</th><th>Meaning</th></tr></thead>
    <tbody>
      <tr><td><strong>Gust</strong></td><td>A brief, sudden increase in speed lasting a few seconds</td></tr>
      <tr><td><strong>Lull</strong></td><td>A brief decrease in speed between gusts</td></tr>
      <tr><td><strong>Squall</strong></td><td>A sudden increase of at least 16 kt, reaching 22 kt or more and lasting for at least a minute, often with a change in direction. Comes with thunderstorms, cold fronts and squall lines.</td></tr>
      <tr><td><strong>Gale</strong></td><td>A sustained wind of Beaufort force 8, 34 to 40 kt</td></tr>
    </tbody>
  </table>

  <h3>Beaufort scale: the bands DGCA asks about</h3>
  <table class="data-table">
    <thead><tr><th>Force</th><th>Description</th><th>Speed</th></tr></thead>
    <tbody>
      <tr><td class="mono">0</td><td>Calm</td><td class="mono">under 1 kt</td></tr>
      <tr><td class="mono">4</td><td>Moderate breeze</td><td class="mono">11 to 16 kt</td></tr>
      <tr><td class="mono">7</td><td>Near gale</td><td class="mono">28 to 33 kt</td></tr>
      <tr><td class="mono">8</td><td>Gale</td><td class="mono">34 to 40 kt</td></tr>
      <tr><td class="mono">10</td><td>Storm</td><td class="mono">48 to 55 kt</td></tr>
      <tr><td class="mono">12</td><td>Hurricane force</td><td class="mono">64 kt and above</td></tr>
    </tbody>
  </table>

  <h2>The four forces</h2>

  <table class="data-table">
    <thead><tr><th>Force</th><th>What it does</th></tr></thead>
    <tbody>
      <tr><td><strong>Pressure gradient force (PGF)</strong></td><td>Pushes air from high pressure towards low, at right angles to the isobars. Proportional to the pressure gradient and inversely proportional to air density. It's what starts the wind.</td></tr>
      <tr><td><strong>Coriolis force</strong></td><td>An apparent force from the earth's rotation, acting at right angles to the direction of motion. Deflects air to the <strong>right</strong> in the northern hemisphere and to the left in the southern. Its size is <span class="mono">2Ωv sin φ</span>: it increases with wind speed (v) and with latitude (φ). <strong>Zero at the equator, greatest at the poles</strong>, and zero for still air.</td></tr>
      <tr><td><strong>Centrifugal force</strong></td><td>Acts outward from the centre when air moves along curved isobars, around a low or a high.</td></tr>
      <tr><td><strong>Friction</strong></td><td>Slows the wind near the ground. Because Coriolis depends on speed, it weakens too, the pressure gradient wins, and the wind turns towards low pressure. Effective up to about 2,000 to 3,000 ft, the friction layer <span class="fcom-flag">⚑</span>. Greater over rough land than over sea.</td></tr>
    </tbody>
  </table>

  <h2>Balanced winds</h2>

  <!-- DIAGRAM: geostrophic and surface wind -->
  <div class="diagram-block">
    <div class="diagram-label">Diagram: geostrophic wind aloft and the surface wind, northern hemisphere</div>
    <div class="diagram-inner">
      <svg viewBox="0 0 720 300" role="img">
        <title>With low pressure to the north, the geostrophic wind aloft blows from west to east along the isobars, with pressure gradient force pointing north and Coriolis pointing south. At the surface, friction slows the wind and it backs, crossing the isobars towards the low.</title>
        <defs>
          <marker id="aw" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M2 2L8 5L2 8" fill="none" stroke="#0d1117" stroke-width="1.6"/></marker>
          <marker id="ar" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M2 2L8 5L2 8" fill="none" stroke="#c0392b" stroke-width="1.6"/></marker>
          <marker id="ab" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M2 2L8 5L2 8" fill="none" stroke="#1a4fc4" stroke-width="1.6"/></marker>
          <marker id="ag" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M2 2L8 5L2 8" fill="none" stroke="#0b6e48" stroke-width="1.6"/></marker>
        </defs>
        <g font-family="Inter,sans-serif">
          <text x="360" y="22" text-anchor="middle" font-size="13" font-weight="700" fill="#991f1f">LOW</text>
          <line x1="40" y1="45" x2="680" y2="45" stroke="#9aa0ad" stroke-width="1"/><text x="684" y="49" font-size="9" fill="#6b7080">996</text>
          <line x1="40" y1="110" x2="680" y2="110" stroke="#9aa0ad" stroke-width="1"/><text x="684" y="114" font-size="9" fill="#6b7080">1000</text>
          <line x1="40" y1="175" x2="680" y2="175" stroke="#9aa0ad" stroke-width="1"/><text x="684" y="179" font-size="9" fill="#6b7080">1004</text>
          <line x1="40" y1="240" x2="680" y2="240" stroke="#9aa0ad" stroke-width="1"/><text x="684" y="244" font-size="9" fill="#6b7080">1008</text>
          <text x="360" y="290" text-anchor="middle" font-size="13" font-weight="700" fill="#1a4fc4">HIGH</text>

          <!-- Upper: geostrophic -->
          <text x="60" y="64" font-size="11" font-weight="600" fill="#0d1117">Above the friction layer</text>
          <line x1="120" y1="80" x2="300" y2="80" stroke="#0d1117" stroke-width="2.5" marker-end="url(#aw)"/>
          <text x="210" y="98" text-anchor="middle" font-size="10" fill="#0d1117">geostrophic wind</text>
          <line x1="330" y1="80" x2="330" y2="50" stroke="#c0392b" stroke-width="2" marker-end="url(#ar)"/>
          <text x="338" y="62" font-size="9" fill="#c0392b">pressure gradient</text>
          <line x1="330" y1="80" x2="330" y2="104" stroke="#1a4fc4" stroke-width="2" marker-end="url(#ab)"/>
          <text x="338" y="100" font-size="9" fill="#1a4fc4">Coriolis</text>

          <!-- Surface -->
          <text x="330" y="226" font-size="11" font-weight="600" fill="#0d1117">At the surface</text>
          <line x1="430" y1="230" x2="590" y2="150" stroke="#0b6e48" stroke-width="2.5" marker-end="url(#ag)"/>
          <text x="602" y="138" font-size="10" fill="#0b6e48">surface wind:</text>
          <text x="602" y="151" font-size="10" fill="#0b6e48">slower, backed,</text>
          <text x="602" y="164" font-size="10" fill="#0b6e48">towards the low</text>
          <line x1="430" y1="230" x2="610" y2="230" stroke="#0d1117" stroke-width="1" stroke-dasharray="4 3"/>
          <text x="615" y="234" font-size="9" fill="#6b7080">gradient direction</text>
        </g>
      </svg>
    </div>
    <div class="diagram-caption">Aloft, the pressure gradient force and Coriolis balance and the wind blows along the isobars, with low pressure on the left. Near the ground, friction slows the wind, Coriolis weakens, and the wind backs to cross the isobars towards the low.</div>
  </div>

  <table class="data-table">
    <thead><tr><th>Wind</th><th>Forces in balance</th><th>Where it applies</th></tr></thead>
    <tbody>
      <tr><td><strong>Geostrophic</strong></td><td>PGF and Coriolis</td><td>Straight, parallel isobars, above the friction layer. Not valid near the equator, where Coriolis is close to zero.</td></tr>
      <tr><td><strong>Gradient</strong></td><td>PGF, Coriolis and centrifugal</td><td>Curved isobars. For the same isobar spacing it is <strong>weaker than geostrophic around a low</strong> (sub-geostrophic) and <strong>stronger around a high</strong> (super-geostrophic).</td></tr>
      <tr><td><strong>Cyclostrophic</strong></td><td>PGF and centrifugal</td><td>Small, intense, fast-spinning systems where Coriolis doesn't matter: tornadoes, dust devils, waterspouts, and the inner core of tropical cyclones.</td></tr>
    </tbody>
  </table>

  <h3>What changes the geostrophic wind speed</h3>
  <p>In balance, Coriolis equals the pressure gradient force. Rearranged, the geostrophic wind speed is <span class="mono">V = ΔP / (2Ω ρ sin φ × distance)</span>. Three exam conclusions follow:</p>
  <ul>
    <li><strong>Closer isobars, stronger wind.</strong> Double the gradient and the wind doubles.</li>
    <li><strong>Lower latitude, stronger wind</strong> for the same isobar spacing, because sin φ is smaller. The same chart spacing gives about twice the wind at 30° as at 90° <span class="fcom-flag">⚑</span>.</li>
    <li><strong>Lower density, stronger wind</strong> for the same pressure gradient. So with the same gradient, the wind is stronger at height, and stronger in warm air than cold.</li>
  </ul>

  <h3>Buys Ballot's law</h3>
  <p>In the northern hemisphere, stand with your <strong>back to the wind</strong> and low pressure is on your <strong>left</strong>. In the southern hemisphere it's on your right. It follows from the geostrophic balance, and it's why air circulates anticlockwise round a low and clockwise round a high in the northern hemisphere. For a pilot in the northern hemisphere, a wind from the left (drifting the aircraft to the right) means flying towards lower pressure, and the altimeter will over-read. See <a href="#">Chapter 2, Atmospheric Pressure</a>.</p>

  <h2>Surface wind versus upper wind</h2>

  <table class="data-table">
    <thead><tr><th></th><th>Over land</th><th>Over sea</th></tr></thead>
    <tbody>
      <tr><td>Surface wind backed from the 2,000 ft wind by about</td><td class="mono">30°</td><td class="mono">10°</td></tr>
      <tr><td>Surface speed as a share of the 2,000 ft wind</td><td class="mono">about 50%</td><td class="mono">about 70%</td></tr>
    </tbody>
  </table>
  <p>These are typical figures <span class="fcom-flag">⚑</span>. The sea is smoother, so there's less friction. In the northern hemisphere, climbing out of the friction layer the wind <strong>veers and increases</strong>; descending into it, the wind backs and decreases. In the southern hemisphere the directions reverse: the surface wind is veered from the upper wind.</p>

  <h3>Diurnal variation</h3>
  <table class="data-table">
    <thead><tr><th></th><th>Surface wind</th><th>Wind at about 1,500 to 2,000 ft</th></tr></thead>
    <tbody>
      <tr><td><strong>By day</strong></td><td>Stronger, veers towards the upper wind. Gusty.</td><td>Weaker, as momentum is mixed downwards</td></tr>
      <tr><td><strong>By night</strong></td><td>Lighter, backs. Often near calm under a clear sky.</td><td>Stronger, and can form a low-level jet</td></tr>
    </tbody>
  </table>
  <p>The cause is mixing. Daytime heating stirs the lower air and brings the faster upper wind down. At night a surface inversion forms, the layers decouple, and the wind just above the inversion speeds up. That's a classic source of low-level wind shear on night and early morning approaches. The effect is greatest over land, on clear days and nights.</p>

  <h3>Turbulence and eddies</h3>
  <p>Friction doesn't just slow the wind, it breaks it into eddies. <strong>Mechanical turbulence</strong> comes from wind over rough ground, buildings and hills, and increases with wind speed and surface roughness. <strong>Thermal turbulence</strong> comes from convection over heated ground. Both are confined mainly to the friction layer and are worst in the afternoon. Turbulence in clear air at height is covered in <a href="#">Chapter 16, Clear Air Turbulence</a>.</p>

  <h2>The thermal wind</h2>
  <p>The thermal wind isn't a wind you can measure. It's the <strong>vector difference between the geostrophic wind at two levels</strong>, caused by a horizontal temperature gradient. Because cold columns are shorter than warm ones (see <a href="#">Chapter 2</a>), pressure surfaces slope down towards cold air, and the slope increases with height. So the pressure gradient, and the wind, change with height.</p>
  <ul>
    <li>The thermal wind blows along the <strong>isotherms</strong> (strictly, the lines of equal thickness), with <strong>cold air on the left</strong> in the northern hemisphere. Its strength is proportional to the temperature gradient.</li>
    <li>Since the poles are colder than the tropics, the thermal wind in middle latitudes is westerly. That's why <strong>westerly winds increase with height</strong> up to the tropopause, ending in the jet streams. See <a href="#">Chapter 15, Jet Streams</a>.</li>
    <li><strong>Warm advection</strong> (wind blowing from warm air towards cold): the wind <strong>veers with height</strong>. <strong>Cold advection</strong>: the wind <strong>backs with height</strong>. This applies in the northern hemisphere.</li>
  </ul>

  <h2>Local winds</h2>

  <table class="data-table">
    <thead><tr><th>Wind</th><th>When and why</th><th>Typical character</th></tr></thead>
    <tbody>
      <tr><td><strong>Sea breeze</strong></td><td>By day. The land heats faster than the sea, pressure falls over land, and air flows in from the sea.</td><td>Starts late morning, peaks mid-afternoon. Around 10 to 15 kt, a few thousand feet deep, reaching up to about 15 to 20 nm inland. Can bring low cloud and fog in from the sea, and a sea breeze front with cumulus.</td></tr>
      <tr><td><strong>Land breeze</strong></td><td>At night. The land cools faster, and air flows out to sea.</td><td>Weaker and shallower than the sea breeze. Strongest around dawn.</td></tr>
      <tr><td><strong>Anabatic</strong></td><td>By day, upslope, as sun-heated slopes warm the air against them.</td><td>Gentle. Can build cumulus over ridges.</td></tr>
      <tr><td><strong>Katabatic</strong></td><td>At night, downslope, as cold dense air drains off radiating slopes, especially under clear skies and light gradient winds.</td><td>Can be strong, and much stronger over snow and ice. Pools in valleys as frost and fog.</td></tr>
      <tr><td><strong>Fohn</strong></td><td>Air forced over a mountain range loses moisture as rain on the windward side, then descends the lee side warming at the dry rate.</td><td>Warm, dry, often gusty. Clear skies on the lee side, the "fohn gap" in the cloud.</td></tr>
      <tr><td><strong>Ravine (gap) wind</strong></td><td>Wind funnelled through a valley, gap or pass.</td><td>Accelerated, often turbulent at the exit.</td></tr>
      <tr><td><strong>Loo</strong></td><td>Hot, dry westerly over the plains of north-west and north India in May and June.</td><td>Very hot and dusty in the afternoon, with poor visibility and high density altitude.</td></tr>
    </tbody>
  </table>

  <h3>Worked example: the fohn effect</h3>
  <p>Air at 20°C at sea level crosses a 3,000 m mountain. Use a dry rate of 1°C per 100 m and a saturated rate of 0.6°C per 100 m <span class="fcom-flag">⚑</span>, with cloud base at 1,000 m on the windward side.</p>
  <ul>
    <li>Sea level to cloud base, 1,000 m dry: 20 − 10 = <strong>10°C</strong>.</li>
    <li>Cloud base to the summit, 2,000 m saturated: 10 − 12 = <strong>−2°C</strong>. The moisture has fallen as rain or snow.</li>
    <li>Summit back down to sea level on the lee side, 3,000 m dry: −2 + 30 = <strong>28°C</strong>.</li>
  </ul>
  <p>The air arrives <strong>8°C warmer</strong> and much drier than it started. The gain comes from latent heat released in the cloud on the windward side.</p>

  <h2>Large-scale winds</h2>
  <ul>
    <li><strong>Trade winds:</strong> steady winds in the tropics blowing out of the subtropical highs towards the equator. North-easterly in the northern hemisphere and south-easterly in the southern. They meet at the inter-tropical convergence zone. See <a href="#">Chapter 20, General Circulation</a>.</li>
    <li><strong>Westerlies:</strong> the prevailing winds of the middle latitudes, between the subtropical highs and the polar front. In the southern hemisphere, over open ocean with little land to slow them, they're strong enough to be called the <strong>roaring forties</strong>.</li>
    <li><strong>The monsoon:</strong> a seasonal reversal of wind caused by the different heating of land and sea, and the seasonal shift of the ITCZ. Over India, the <strong>south-west monsoon</strong> blows from June to September and brings most of the year's rain. The <strong>north-east monsoon</strong> blows in winter, dry over most of India but bringing rain to Tamil Nadu. See <a href="#">Chapter 19, Climatology India</a>.</li>
  </ul>

  <h2>Wind shear</h2>
  <p>Wind shear is a change in wind speed or direction over a short distance, vertically or horizontally. It changes the airspeed and lift of an aircraft passing through it. Low-level wind shear, below about 1,600 ft <span class="fcom-flag">⚑</span>, is the most hazardous because there's little height to recover. Common causes:</p>
  <ul>
    <li>Thunderstorms and microbursts. See <a href="#">Chapter 13, Thunderstorm</a>.</li>
    <li>Frontal passage, especially fast-moving cold fronts</li>
    <li>A low-level jet above a night-time inversion</li>
    <li>Strong surface winds over obstructions, and sea breeze fronts</li>
    <li>Mountain waves and rotors. See <a href="#">Chapter 17, Mountain Waves</a>.</li>
  </ul>

  <h2>Common traps</h2>

  <div class="trap">
    <div class="wrong">✗ "A westerly wind blows towards the west."</div>
    <div class="right">✓ It blows from the west. Wind direction is always where it comes from.</div>
  </div>
  <div class="trap">
    <div class="wrong">✗ "The surface wind in a METAR is magnetic, so it can be compared with the runway."</div>
    <div class="right">✓ METAR winds are true. The surface wind from ATC and ATIS is magnetic.</div>
  </div>
  <div class="trap">
    <div class="wrong">✗ "Coriolis is strongest at the equator, where the earth spins fastest."</div>
    <div class="right">✓ Coriolis is zero at the equator and greatest at the poles. That's why the geostrophic wind doesn't apply near the equator.</div>
  </div>
  <div class="trap">
    <div class="wrong">✗ "For the same isobar spacing, the geostrophic wind is stronger at high latitudes."</div>
    <div class="right">✓ It's stronger at low latitudes, because Coriolis is weaker and a faster wind is needed to balance the same gradient.</div>
  </div>
  <div class="trap">
    <div class="wrong">✗ "The gradient wind around a low is stronger than the geostrophic wind."</div>
    <div class="right">✓ Around a low it's weaker. Around a high it's stronger.</div>
  </div>
  <div class="trap">
    <div class="wrong">✗ "Climbing out of the friction layer, the wind backs."</div>
    <div class="right">✓ In the northern hemisphere it veers and increases with height. The surface wind is the backed one.</div>
  </div>
  <div class="trap">
    <div class="wrong">✗ "The surface wind is strongest at night."</div>
    <div class="right">✓ It's strongest in the afternoon, when mixing is greatest. The wind at around 2,000 ft is the one that strengthens at night.</div>
  </div>
  <div class="trap">
    <div class="wrong">✗ "Back to the wind, low pressure is on the right."</div>
    <div class="right">✓ On the left in the northern hemisphere. On the right only in the southern hemisphere.</div>
  </div>
  <div class="trap">
    <div class="wrong">✗ "With warm advection, the wind backs with height."</div>
    <div class="right">✓ Warm advection veers with height. Cold advection backs with height (northern hemisphere).</div>
  </div>
  <div class="trap">
    <div class="wrong">✗ "The fohn is warm because it comes from a warmer region."</div>
    <div class="right">✓ It's warm because it descends at the dry rate after losing its moisture on the windward side, gaining the latent heat released there.</div>
  </div>
  <div class="trap">
    <div class="wrong">✗ "A katabatic wind blows up the slope by day."</div>
    <div class="right">✓ Katabatic is downslope at night. Anabatic is upslope by day.</div>
  </div>
`,

  faq: String.raw`
  <h2>Frequently asked questions</h2>
  <p class="faq-q">Which chapter of IC Joshi covers winds?</p>
  <p>Chapter 6, Winds, in the 2019 edition of Aviation Meteorology by IC Joshi. It covers how wind is described and measured, the forces that drive it, balanced winds, local winds and the large-scale wind systems including the monsoon.</p>
  <p class="faq-q">What is Buys Ballot's law?</p>
  <p>In the northern hemisphere, if you stand with your back to the wind, low pressure is on your left. In the southern hemisphere it is on your right.</p>
  <p class="faq-q">What is the geostrophic wind?</p>
  <p>The wind that blows when the pressure gradient force and the Coriolis force are in balance. It blows parallel to straight isobars, above the friction layer. It does not apply near the equator, where the Coriolis force is too weak.</p>
  <p class="faq-q">Why does the wind veer and increase with height?</p>
  <p>Near the ground, friction slows the wind and weakens the Coriolis force, so the wind is backed and slower. Above the friction layer the wind reaches its geostrophic speed and direction, so in the northern hemisphere it veers and increases with height. Higher up, the thermal wind usually adds a further westerly increase.</p>
`,

  related: String.raw`
  <h2>Related chapters</h2>
  <ul class="related">
    <li><a href="#">Chapter 2, Atmospheric Pressure</a>: the pressure gradient that drives the wind.</li>
    <li><a href="#">Chapter 13, Thunderstorm</a>: squalls, gust fronts and microbursts.</li>
    <li><a href="#">Chapter 15, Jet Streams</a>: where the thermal wind leads.</li>
    <li><a href="#">Chapter 16, Clear Air Turbulence</a>: turbulence at height, away from cloud.</li>
    <li><a href="#">Chapter 17, Mountain Waves</a>: what wind does over high ground.</li>
    <li><a href="#">Chapter 19, Climatology India</a>: the monsoon in detail.</li>
    <li><a href="#">Chapter 20, General Circulation</a>: trade winds and westerlies at global scale.</li>
  </ul>
`,

  disclaimer: String.raw`
  <div class="disclaimer">
    <strong>Note:</strong> This page is a study guide to the topics in Chapter 6 of <em>Aviation Meteorology</em> by IC Joshi (2019 edition) as they relate to the DGCA CPL Meteorology syllabus. It does not reproduce the book. Values marked <span class="fcom-flag">⚑</span> are typical figures from aviation meteorology training material and should be checked against the prescribed textbook. ProPilotLicence.com is not affiliated with, endorsed by, or associated with the author or publisher. Content reviewed by the ProPilotLicence Captain Panel.
  </div>
`,
}
