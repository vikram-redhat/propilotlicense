// IC Joshi, Aviation Meteorology — Chapter 7, Visibility and Fog.
// Editorial content from the Captain Panel source (ic-joshi-ch07-visibility-and-fog.html):
// the inner HTML of <main class="article-wrap">, verbatim, split around the parts the
// page renders live from the database (At a glance, sample questions, CTA).
// The source's mock-up glance panel, practice placeholder and CTA block are dropped;
// nothing else is changed. Chapter links keep href="#" — the page resolves them.
import type { ChapterPageContent } from '@/lib/chapter-pages'

export const CHAPTER_7: ChapterPageContent = {
  chapterNumber: 7,
  slug: 'chapter-7-visibility-and-fog',
  metaTitle: 'IC Joshi Chapter 7 Visibility and Fog: DGCA Notes',
  metaDescription: 'IC Joshi Aviation Meteorology Chapter 7, Visibility and Fog. Visibility, RVR, slant visibility, fog, mist and haze, radiation and advection fog, winter fog over north India and practice questions.',
  excerpt: 'Visibility and Fog is a High-weight chapter and the one that shuts Indian airports every winter. Most questions turn on one word: wind speed, surface or time of day.',
  publishedAt: '2026-11-11',
  updatedAt: '2026-11-11',
  reviewedBy: 'ProPilotLicence Captain Panel',

  // Fixed sample questions (chosen 2026-11-11): IC Joshi-sourced, active, syllabus
  // chapter 7, high confidence, with an explanation checked against this page. None in
  // this chapter had been reviewed yet. Fixed so the page is stable.
  sampleQuestionIds: [
    'cf2f9cf8-15dc-4784-ba6b-d0aa2b27af27', // mist is 1,000 to 5,000 m, fog below 1,000 m (B)
    'aacc89cc-8ff2-44fa-88ce-fab061792a45', // RVR: what a pilot on the centreline sees of markings or lights (A)
    '9654b52d-ead6-4b6d-87fe-a36241b21ac6', // steam fog: cold air over warm water (B)
  ],

  head: String.raw`
  <div class="eyebrow">IC Joshi · Aviation Meteorology · Chapter 7</div>
  <h1>Visibility and Fog: IC Joshi Chapter 7, DGCA Notes and Practice Questions</h1>

  <p class="standfirst">Visibility and Fog is a High-weight chapter, and for Indian pilots it's the one that shuts airports every winter. DGCA asks about definitions (fog, mist, haze, RVR), about how each type of fog forms and clears, and about the gap between what the tower reports and what the pilot actually sees on approach. Learn the formation conditions precisely, because most questions turn on one word: wind speed, surface, or time of day.</p>

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
    <li><strong>Definitions.</strong> Visibility, prevailing visibility, RVR, slant and vertical visibility, and the visibility limits that separate fog, mist and haze.</li>
    <li><strong>Obscurations.</strong> What each one is made of (water or dry particles), and its METAR code.</li>
    <li><strong>Fog types.</strong> Radiation, advection, steaming, frontal and hill fog: the exact conditions each needs, when and where it forms, and how it clears.</li>
    <li><strong>Measurement.</strong> Transmissometers, forward scatter meters and how RVR is reported.</li>
    <li><strong>Operational effects.</strong> Shallow fog, slant visibility on approach, and winter fog over north India.</li>
  </ol>

  <h2>Visibility: the definitions</h2>

  <h3>Meteorological visibility</h3>
  <p>For aviation, visibility is the greater of two distances <span class="fcom-flag">⚑</span>:</p>
  <ul>
    <li>the greatest distance at which a black object of suitable size, near the ground, can be seen and recognised against a bright background (the daytime measure), and</li>
    <li>the greatest distance at which lights of about 1,000 candelas can be seen and identified against an unlit background (the night measure).</li>
  </ul>
  <p>The two give different values in the same air, because a light can be seen further through haze or fog than a dark object can. That's why the definition takes whichever is greater.</p>

  <h3>Prevailing visibility</h3>
  <p>Visibility is rarely the same in every direction. The <strong>prevailing visibility</strong> is the value reached or exceeded within at least half the horizon circle, or half the aerodrome surface. It's the figure given in the METAR. Where visibility in one direction is much lower, a minimum visibility and its direction are added <span class="fcom-flag">⚑</span>, for example <span class="mono">3000 1200SW</span>.</p>

  <h3>Runway visual range (RVR)</h3>
  <p>RVR is the range over which the pilot of an aircraft on the runway centreline can see the runway surface markings, or the lights delineating the runway or identifying its centreline. It's a <strong>runway</strong> measurement, not a general one, and it takes account of the runway lighting intensity.</p>
  <ul>
    <li>Measured by instruments, usually at three points: <strong>touchdown, mid-point and stop end</strong>.</li>
    <li>Reported when visibility or RVR falls below 1,500 m <span class="fcom-flag">⚑</span>.</li>
    <li>In a METAR it appears per runway, with a tendency: <span class="mono">R28/0550U</span> means runway 28, RVR 550 m, increasing. <span class="mono">D</span> is decreasing and <span class="mono">N</span> is no distinct change.</li>
    <li>Because runway lights are bright, RVR is usually <strong>greater</strong> than the meteorological visibility in fog, especially at night.</li>
  </ul>

  <h3>Vertical and slant visibility</h3>
  <ul>
    <li><strong>Vertical visibility</strong> is how far you can see straight up into an obscuring layer. When fog or heavy precipitation hides the sky, the METAR gives vertical visibility in hundreds of feet instead of cloud: <span class="mono">VV002</span> means 200 ft.</li>
    <li><strong>Slant visibility</strong> is what a pilot on approach actually sees, looking down and ahead at the runway. It can be very different from the horizontal visibility measured at the surface.</li>
  </ul>

  <!-- DIAGRAM: shallow fog and slant visibility -->
  <div class="diagram-block">
    <div class="diagram-label">Diagram: shallow fog and slant visibility on approach</div>
    <div class="diagram-inner">
      <svg viewBox="0 0 720 280" role="img">
        <title>Shallow radiation fog lies over the airfield. From overhead, the pilot can see the runway lights straight down through the thin layer. On final approach the line of sight runs at a shallow angle through the full length of the fog, and the runway disappears.</title>
        <defs>
          <marker id="vs" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M2 2L8 5L2 8" fill="none" stroke="#0d1117" stroke-width="1.6"/></marker>
        </defs>
        <g font-family="Inter,sans-serif">
          <!-- ground and runway -->
          <line x1="20" y1="240" x2="700" y2="240" stroke="#6b7080" stroke-width="1.5"/>
          <rect x="430" y="236" width="230" height="6" fill="#353a47"/>
          <text x="545" y="258" text-anchor="middle" font-size="10" fill="#353a47">runway</text>
          <!-- fog layer -->
          <rect x="20" y="200" width="680" height="40" fill="#c9cfdd" opacity="0.65"/>
          <text x="30" y="194" font-size="10" fill="#6b7080">shallow fog, about 100 ft deep</text>
          <!-- overhead aircraft -->
          <text x="545" y="40" text-anchor="middle" font-size="11" font-weight="600" fill="#0b6e48">Overhead</text>
          <line x1="545" y1="50" x2="545" y2="232" stroke="#0b6e48" stroke-width="2" marker-end="url(#vs)"/>
          <text x="555" y="120" font-size="10" fill="#0b6e48">looks down through</text>
          <text x="555" y="133" font-size="10" fill="#0b6e48">100 ft of fog: runway visible</text>
          <!-- approach aircraft -->
          <text x="80" y="100" font-size="11" font-weight="600" fill="#991f1f">On final</text>
          <line x1="80" y1="125" x2="420" y2="232" stroke="#991f1f" stroke-width="2" stroke-dasharray="6 4" marker-end="url(#vs)"/>
          <text x="140" y="118" font-size="10" fill="#991f1f">enters the fog and looks</text>
          <text x="140" y="131" font-size="10" fill="#991f1f">through it lengthways: runway lost</text>
        </g>
      </svg>
    </div>
    <div class="diagram-caption">With shallow fog, a pilot overhead can see the runway, and may be told the vertical visibility is good, yet lose sight of it on short final once the line of sight runs along the fog layer instead of through it.</div>
  </div>

  <h2>What reduces visibility</h2>

  <p>Obscurations divide into two families: <strong>water</strong> (droplets or ice) and <strong>dry particles</strong> (dust, smoke, salt). The humidity usually tells you which you're looking at.</p>

  <table class="data-table">
    <thead><tr><th>Phenomenon</th><th>Made of</th><th>Visibility</th><th>METAR code</th></tr></thead>
    <tbody>
      <tr><td><strong>Fog</strong></td><td>Water droplets (or ice crystals in ice fog)</td><td class="mono">below 1,000 m</td><td class="mono">FG</td></tr>
      <tr><td><strong>Mist</strong></td><td>Water droplets, high humidity</td><td class="mono">1,000 to 5,000 m</td><td class="mono">BR</td></tr>
      <tr><td><strong>Haze</strong></td><td>Dry particles (dust, salt, smoke), lower humidity</td><td class="mono">5,000 m or less to be reported</td><td class="mono">HZ</td></tr>
      <tr><td><strong>Smoke</strong></td><td>Combustion particles</td><td class="mono">5,000 m or less to be reported</td><td class="mono">FU</td></tr>
      <tr><td><strong>Dust</strong></td><td>Dust held in suspension, widespread</td><td>Variable</td><td class="mono">DU</td></tr>
      <tr><td><strong>Dust storm / sandstorm</strong></td><td>Dust or sand raised by strong wind</td><td>Can fall below 1,000 m</td><td class="mono">DS / SS</td></tr>
      <tr><td><strong>Smog</strong></td><td>Smoke and fog together, typically over cities under an inversion</td><td>Often below 1,000 m</td><td>Reported as FG or FU</td></tr>
    </tbody>
  </table>
  <p>The visibility limits and the 5,000 m reporting threshold follow standard METAR practice <span class="fcom-flag">⚑</span>. The humidity rule of thumb: mist when the relative humidity is high (around 95% or more), haze when it's well below that <span class="fcom-flag">⚑</span>.</p>

  <h3>Fog descriptors in a METAR</h3>
  <table class="data-table">
    <thead><tr><th>Code</th><th>Meaning</th></tr></thead>
    <tbody>
      <tr><td class="mono">MIFG</td><td>Shallow fog, less than 2 m deep over land <span class="fcom-flag">⚑</span>. Visibility at eye level can be good.</td></tr>
      <tr><td class="mono">BCFG</td><td>Fog patches covering part of the aerodrome</td></tr>
      <tr><td class="mono">PRFG</td><td>Fog covering a substantial part of the aerodrome</td></tr>
      <tr><td class="mono">FZFG</td><td>Freezing fog: droplets at below 0°C, which can deposit rime ice on aircraft</td></tr>
      <tr><td class="mono">VCFG</td><td>Fog in the vicinity, not at the aerodrome itself</td></tr>
    </tbody>
  </table>

  <h2>How fog forms</h2>

  <p>Fog is cloud at ground level, and forms the same way: air is either <strong>cooled to its dew point</strong>, or has <strong>moisture added</strong> until it saturates. Each fog type is one of those two mechanisms in a particular setting. The dew point itself is covered in <a href="#">Chapter 5, Humidity</a>.</p>

  <table class="data-table">
    <thead><tr><th>Type</th><th>How it forms</th><th>Where and when</th><th>Wind</th><th>How it clears</th></tr></thead>
    <tbody>
      <tr><td><strong>Radiation</strong></td><td>The ground cools by radiation on a clear night and cools the moist air above it to its dew point</td><td>Over <strong>land only</strong>. Clear nights, long nights, autumn and winter. Low-lying ground and valleys.</td><td>Light, about 2 to 8 kt <span class="fcom-flag">⚑</span></td><td>Sun heating the ground, or an increase in wind. Often lifts into low stratus first.</td></tr>
      <tr><td><strong>Advection</strong></td><td>Warm, moist air moves over a colder surface and is cooled to its dew point</td><td>Over sea and coasts (sea fog), or over cold land. Any time of day, any season.</td><td>Up to about 15 kt or more <span class="fcom-flag">⚑</span>. Stronger wind lifts it to stratus.</td><td>A change of wind direction or air mass. Not cleared by the sun alone, so it can persist all day.</td></tr>
      <tr><td><strong>Steaming</strong> (Arctic sea smoke)</td><td>Very cold air passes over much warmer water. Water evaporates into the cold air and immediately condenses.</td><td>Over warm water in cold air: high latitudes, lakes and rivers in winter</td><td>Light</td><td>Usually shallow, with turbulent wisps</td></tr>
      <tr><td><strong>Frontal</strong></td><td>Rain from warm air above a front falls into colder air below, evaporates and saturates it</td><td>Mainly ahead of a warm front, in the zone of continuous rain</td><td>Varies</td><td>When the front passes</td></tr>
      <tr><td><strong>Hill (upslope)</strong></td><td>Moist air forced up a slope cools adiabatically to its dew point</td><td>Windward slopes and high ground</td><td>Any, often moderate</td><td>A change of wind direction</td></tr>
    </tbody>
  </table>

  <h3>Radiation fog in detail</h3>
  <p>This is the most examined type, because every condition is specific:</p>
  <ul>
    <li><strong>Clear sky.</strong> Cloud acts as a blanket and stops the ground radiating heat away.</li>
    <li><strong>Moist air near the surface</strong>, with a small spread between temperature and dew point at dusk.</li>
    <li><strong>Light wind.</strong> Just enough turbulence to spread the cooling through a layer of air. In <strong>calm</strong> conditions only the air touching the ground cools, giving dew, frost or very shallow fog. In <strong>stronger</strong> wind the cooling is mixed through too deep a layer, giving low stratus instead of fog.</li>
    <li><strong>Long nights</strong>, which give more time to cool. That's why it's a winter phenomenon.</li>
    <li><strong>A surface inversion</strong> forms as the ground cools, trapping the fog. See <a href="#">Chapter 9, Stability of Atmosphere</a>.</li>
  </ul>
  <p>Radiation fog usually forms after midnight and is thickest <strong>around or just after sunrise</strong>. Early sunlight can stir the layer and briefly make it thicker before it clears <span class="fcom-flag">⚑</span>. It then thins from the edges and the top, or lifts into stratus, usually by mid-morning. It <strong>never forms over the sea</strong>, because the sea's temperature hardly changes between day and night.</p>

  <h3>Advection fog in detail</h3>
  <p>Advection fog doesn't need a clear sky or a calm night. It needs a moving supply of warm, moist air and a cold surface beneath it, so it can arrive at any hour, in quite fresh winds, and stay for days. Sea fog off a coast, and fog over land when a warm, moist airstream moves over ground chilled by snow or a cold spell, are both advection fog. Because the sun can't burn it off from below the way it can with radiation fog, advection fog is generally the more persistent of the two.</p>

  <h2>Fog and haze in India</h2>
  <ul>
    <li><strong>Winter fog over the Indo-Gangetic plains.</strong> From December to January, long clear nights, light winds, moist ground and polluted air give dense radiation fog across Punjab, Haryana, Delhi, Uttar Pradesh and Bihar. It can last for days and is why Delhi runs CAT III approaches. Pollution adds smoke and turns fog into smog. See <a href="#">Chapter 19, Climatology India</a>.</li>
    <li><strong>Western disturbances</strong> bring moisture and then clearing skies behind them, which often sets up the next fog spell. See <a href="#">Chapter 14, Air Masses and Western Disturbances</a>.</li>
    <li><strong>Pre-monsoon dust and haze.</strong> Over north-west India in April to June, hot dusty winds and dust storms reduce visibility, sometimes for a whole day.</li>
    <li><strong>Coastal fog and mist</strong> occur at times around the coasts, mainly in the cooler months.</li>
  </ul>

  <h2>Measuring visibility</h2>
  <ul>
    <li><strong>Observer.</strong> Visibility can be assessed by eye against marker objects at known distances by day, and lights by night.</li>
    <li><strong>Transmissometer.</strong> Measures how much light from a projector reaches a receiver over a fixed baseline along the runway. Used for RVR. It measures the transparency of the air directly.</li>
    <li><strong>Forward scatter meter.</strong> Measures how much light a small volume of air scatters. Compact and now widely used for RVR and visibility.</li>
    <li><strong>Scopograph.</strong> An instrument for measuring visibility, listed in the syllabus and described in IC Joshi.</li>
    <li><strong>Ceilometer.</strong> Measures cloud base, and vertical visibility in fog. See <a href="#">Chapter 23, Met Instruments</a>.</li>
  </ul>

  <h2>Common traps</h2>

  <div class="trap">
    <div class="wrong">✗ "Mist is thin fog with visibility below 1,000 m."</div>
    <div class="right">✓ Below 1,000 m is fog. Mist is 1,000 m or more, up to 5,000 m.</div>
  </div>
  <div class="trap">
    <div class="wrong">✗ "Haze and mist are the same thing in different amounts."</div>
    <div class="right">✓ Mist is water droplets in humid air. Haze is dry particles in drier air.</div>
  </div>
  <div class="trap">
    <div class="wrong">✗ "Radiation fog forms best in calm conditions."</div>
    <div class="right">✓ Calm gives dew, frost or very shallow fog. A light wind of a few knots is needed to spread the cooling. Too much wind gives stratus.</div>
  </div>
  <div class="trap">
    <div class="wrong">✗ "Radiation fog can form over the sea on a clear night."</div>
    <div class="right">✓ Never. The sea surface barely cools at night. Fog over the sea is advection or steaming fog.</div>
  </div>
  <div class="trap">
    <div class="wrong">✗ "Advection fog clears once the sun comes up."</div>
    <div class="right">✓ It needs a change of air mass or wind direction. It can persist all day, in winds that would disperse radiation fog.</div>
  </div>
  <div class="trap">
    <div class="wrong">✗ "Steaming fog forms when warm air moves over a cold sea."</div>
    <div class="right">✓ That's advection fog. Steaming fog is the reverse: cold air over warm water.</div>
  </div>
  <div class="trap">
    <div class="wrong">✗ "RVR is the same as visibility, measured on the runway."</div>
    <div class="right">✓ RVR is what a pilot on the centreline sees of the markings or lights. With bright runway lights it's usually greater than the meteorological visibility.</div>
  </div>
  <div class="trap">
    <div class="wrong">✗ "If the runway is visible from overhead, it will be visible on final."</div>
    <div class="right">✓ In shallow fog the vertical view can be good while the slant view on short final is almost nil.</div>
  </div>
  <div class="trap">
    <div class="wrong">✗ "Radiation fog is thickest around midnight."</div>
    <div class="right">✓ It's usually thickest around or just after sunrise, when the ground is coldest.</div>
  </div>
`,

  faq: String.raw`
<h2>Frequently asked questions</h2>
  <p class="faq-q">Which chapter of IC Joshi covers fog and visibility?</p>
  <p>Chapter 7, Visibility and Fog, in the 2019 edition of Aviation Meteorology by IC Joshi. It covers the definitions of visibility and RVR, the obscurations that reduce visibility, the types of fog and how they form and clear, and how visibility is measured.</p>
  <p class="faq-q">What is the difference between fog and mist?</p>
  <p>Both are made of water droplets. Fog reduces visibility to below 1,000 m. Mist is reported when visibility is 1,000 m or more, up to 5,000 m, in humid air.</p>
  <p class="faq-q">What is runway visual range (RVR)?</p>
  <p>The range over which the pilot of an aircraft on the runway centreline can see the runway surface markings or the runway lights. It is measured by instruments at the touchdown, mid-point and stop end of the runway, and reported when visibility or RVR is below 1,500 m.</p>
  <p class="faq-q">What is the difference between radiation fog and advection fog?</p>
  <p>Radiation fog forms over land on clear nights with light winds, when the ground cools the air above it, and usually clears in the morning. Advection fog forms when warm, moist air moves over a colder surface such as the sea. It can form at any time, in stronger winds, and can persist all day.</p>
`,

  related: String.raw`
<h2>Related chapters</h2>
  <ul class="related">
    <li><a href="#">Chapter 5, Humidity</a>: dew point, and why air saturates.</li>
    <li><a href="#">Chapter 9, Stability of Atmosphere</a>: the surface inversion that traps fog.</li>
    <li><a href="#">Chapter 14, Air Masses and Western Disturbances</a>: frontal fog, and the weather that sets up north Indian fog spells.</li>
    <li><a href="#">Chapter 19, Climatology India</a>: the winter fog season in detail.</li>
    <li><a href="#">Chapter 23, Met Instruments</a>: transmissometers and ceilometers.</li>
    <li><a href="#">Chapter 25, Aviation Weather Reports and Codes</a>: visibility, RVR and fog codes in the METAR.</li>
  </ul>
`,

  disclaimer: String.raw`
<div class="disclaimer">
    <strong>Note:</strong> This page is a study guide to the topics in Chapter 7 of <em>Aviation Meteorology</em> by IC Joshi (2019 edition) as they relate to the DGCA CPL Meteorology syllabus. It does not reproduce the book. Values marked <span class="fcom-flag">⚑</span> are typical figures from aviation meteorology training material and should be checked against the prescribed textbook. Operating minima and RVR requirements in operation are as published in the AIP and the operator's manuals. ProPilotLicence.com is not affiliated with, endorsed by, or associated with the author or publisher. Content reviewed by the ProPilotLicence Captain Panel.
  </div>
`,
}
