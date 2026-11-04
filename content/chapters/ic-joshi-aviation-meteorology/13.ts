// IC Joshi, Aviation Meteorology — Chapter 13, Thunderstorm.
// Editorial content from the Captain Panel source (ic-joshi-ch13-thunderstorm.html):
// the inner HTML of <main class="article-wrap">, verbatim, split around the parts the
// page renders live from the database (At a glance, sample questions, FAQ, CTA).
// The source's mock-up glance panel, practice placeholder and CTA block are dropped;
// nothing else is changed. Chapter links keep href="#" — the page resolves them.
import type { ChapterPageContent } from '@/lib/chapter-pages'

export const CHAPTER_13: ChapterPageContent = {
  chapterNumber: 13,
  slug: 'chapter-13-thunderstorm',
  metaTitle: 'IC Joshi Chapter 13 Thunderstorm: DGCA Notes and Questions',
  metaDescription: "IC Joshi Aviation Meteorology Chapter 13, Thunderstorm. What DGCA asks, the three stages, conditions for formation, hazards, nor'westers, avoidance rules and practice questions.",
  excerpt: 'Thunderstorm is one of the two High-weight chapters in IC Joshi. Know the three stages, the three ingredients, and exactly which hazards occur when, and most DGCA thunderstorm questions answer themselves.',
  publishedAt: '2026-11-04',
  updatedAt: '2026-11-04',
  reviewedBy: 'ProPilotLicence Captain Panel',

  // Fixed sample questions (chosen 2026-11-04): active, syllabus chapter 13, high
  // confidence, with an explanation; two already reviewed. Fixed so the page is stable.
  sampleQuestionIds: [
    '1b17cca4-a8c6-4abc-923e-8eb190541b8c', // mature stage: updraughts + downdraughts (IC Joshi)
    'c762b757-4a52-4d55-9908-b18d426dae81', // primary requirement: instability (IC Joshi)
    '7ed70b13-27a6-4032-a0f8-8e62c1c79024', // microburst sequence on approach (Oxford)
  ],

  // Visible FAQ + FAQPage schema. Answers are taken from the body text below.
  faqs: [
    {
      q: 'Which chapter of IC Joshi covers thunderstorms?',
      a: "Chapter 13, Thunderstorm, of the 2019 edition of IC Joshi's Aviation Meteorology. It covers the conditions a thunderstorm needs to form, the three stages of its life cycle, the hazards to aircraft, Indian storms such as nor'westers and dust storms, and detection and avoidance.",
    },
    {
      q: 'What are the three stages of a thunderstorm?',
      a: 'Cumulus, mature and dissipating. The cumulus stage has updraughts throughout the cloud. The mature stage has updraughts and downdraughts side by side and is the most hazardous. In the dissipating stage downdraughts spread through the whole cell and the supply of warm moist air is cut off.',
    },
    {
      q: 'When does the mature stage of a thunderstorm begin?',
      a: 'When precipitation first reaches the surface. That is also when the first gust, the sharp temperature drop and the pressure jump arrive at the surface, and when turbulence, hail, icing and lightning are all at their worst.',
    },
    {
      q: "What is a nor'wester?",
      a: "A violent pre-monsoon thunderstorm, also called Kalbaishakhi, over West Bengal, Odisha, Assam and Bangladesh, mainly in April and May. Nor'westers usually move from the north-west towards the south-east and bring squalls, hail and heavy rain, often in the afternoon or evening.",
    },
  ],

  head: String.raw`
<div class="eyebrow">IC Joshi · Aviation Meteorology · Chapter 13</div>
  <h1>Thunderstorm: IC Joshi Chapter 13, DGCA Notes and Practice Questions</h1>

  <p class="standfirst">Thunderstorm is one of only two High-weight chapters in IC Joshi, and it draws on half the book: stability, clouds, icing, winds and met services all meet here. Know the three ingredients, the three stages, and which hazard belongs to which stage, and most DGCA thunderstorm questions answer themselves.</p>

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

  <p>Thunderstorm questions in the DGCA Meteorology paper fall into five groups. If you can answer one question from each group without hesitating, you have the chapter.</p>

  <ol>
    <li><strong>Formation.</strong> The three conditions a thunderstorm needs, and which trigger produces which type of storm.</li>
    <li><strong>Life cycle.</strong> The three stages, what defines the start of each, how long each lasts, and what the vertical air currents are doing.</li>
    <li><strong>Hazards.</strong> Turbulence, icing, hail, lightning, gusts, microbursts, wind shear and altimeter errors, and when in the life cycle each is worst.</li>
    <li><strong>Indian storms.</strong> Nor'westers, dust storms and the pre-monsoon thunderstorm season.</li>
    <li><strong>Avoidance.</strong> Distances, radar detection and what not to do around a cumulonimbus.</li>
  </ol>

  <h2>The three ingredients</h2>

  <p>A thunderstorm needs all three of these at once. Remove any one and you get, at most, a large cumulus.</p>

  <table class="data-table">
    <thead><tr><th>Ingredient</th><th>Why it matters</th></tr></thead>
    <tbody>
      <tr><td><strong>A deep layer of moist air</strong></td><td>Condensation releases latent heat, which keeps the rising air warmer than its surroundings and feeds the updraught.</td></tr>
      <tr><td><strong>Instability through a great depth</strong></td><td>Usually conditional instability: an environmental lapse rate between the SALR and the DALR, so saturated air keeps rising once lifted. Covered in <a href="#">Chapter 9, Stability of Atmosphere</a>.</td></tr>
      <tr><td><strong>A trigger to start the lift</strong></td><td>Surface heating, a front, hills or mountains, or low-level convergence. The trigger decides the type of storm.</td></tr>
    </tbody>
  </table>

  <h3>Types, by trigger</h3>
  <ul>
    <li><strong>Air mass (heat or convective) thunderstorms:</strong> surface heating on hot afternoons over land. Usually isolated, typically forming in the afternoon and decaying by evening.</li>
    <li><strong>Frontal thunderstorms:</strong> lift along a front, most violently a cold front. Can form at any time of day and often appear in lines.</li>
    <li><strong>Orographic thunderstorms:</strong> moist unstable air forced up a mountain slope.</li>
    <li><strong>Squall lines:</strong> a line or band of active thunderstorms, often ahead of a cold front. Among the most severe for aviation, because there may be no way round.</li>
  </ul>

  <h2>Life cycle: the three stages</h2>

  <p>Every thunderstorm cell goes through the same three stages. A large storm is often several cells at different stages side by side, which is why a storm can last for hours while each cell lives for well under one.</p>

  <!-- DIAGRAM: life cycle -->
  <div class="diagram-block">
    <div class="diagram-label">Diagram: the three stages of a thunderstorm cell <span class="anim-badge">Animated</span></div>
    <div class="diagram-inner">
      <svg viewBox="0 0 720 340" role="img">
        <title>Thunderstorm life cycle: cumulus stage with updraughts only, mature stage with updraughts and downdraughts and rain reaching the ground, dissipating stage with downdraughts only</title>
        <defs>
          <marker id="aup" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="5" markerHeight="5" orient="auto"><path d="M1 8L5 2L9 8" fill="none" stroke="#c0392b" stroke-width="1.6"/></marker>
          <marker id="adn" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="5" markerHeight="5" orient="auto"><path d="M1 2L5 8L9 2" fill="none" stroke="#1a4fc4" stroke-width="1.6"/></marker>
        </defs>
        <!-- ground -->
        <line x1="20" y1="290" x2="700" y2="290" stroke="#6b7080" stroke-width="1.5"/>
        <!-- freezing level -->
        <line x1="20" y1="170" x2="700" y2="170" stroke="#9aa0ad" stroke-width="1" stroke-dasharray="4 4"/>
        <text x="24" y="164" font-family="Inter,sans-serif" font-size="9" fill="#6b7080">freezing level</text>

        <!-- STAGE 1: cumulus -->
        <path d="M60 290 C55 220 70 150 120 120 C170 150 185 220 180 290 Z" fill="#f7f8fc" stroke="#9aa0ad" stroke-width="1.2"/>
        <path d="M95 280 L95 150" stroke="#c0392b" stroke-width="2" fill="none" class="up" marker-end="url(#aup)"/>
        <path d="M120 280 L120 135" stroke="#c0392b" stroke-width="2" fill="none" class="up" marker-end="url(#aup)"/>
        <path d="M145 280 L145 150" stroke="#c0392b" stroke-width="2" fill="none" class="up" marker-end="url(#aup)"/>
        <text x="120" y="312" text-anchor="middle" font-family="Inter,sans-serif" font-size="11" font-weight="600" fill="#0d1117">1. Cumulus</text>
        <text x="120" y="327" text-anchor="middle" font-family="Inter,sans-serif" font-size="9" fill="#6b7080">Updraughts only · no rain at surface</text>

        <!-- STAGE 2: mature -->
        <path d="M265 290 C255 200 270 110 300 70 L250 52 L470 52 L420 70 C450 110 465 200 455 290 Z" fill="#eef2fc" stroke="#1a4fc4" stroke-width="1.2"/>
        <text x="360" y="46" text-anchor="middle" font-family="Inter,sans-serif" font-size="9" fill="#1a4fc4">anvil</text>
        <path d="M320 280 L320 85" stroke="#c0392b" stroke-width="2.2" fill="none" class="up" marker-end="url(#aup)"/>
        <path d="M345 280 L345 80" stroke="#c0392b" stroke-width="2.2" fill="none" class="up" marker-end="url(#aup)"/>
        <path d="M385 90 L385 285" stroke="#1a4fc4" stroke-width="2.2" fill="none" class="down" marker-end="url(#adn)"/>
        <path d="M410 100 L410 285" stroke="#1a4fc4" stroke-width="2.2" fill="none" class="down" marker-end="url(#adn)"/>
        <!-- rain -->
        <g stroke="#1a4fc4" stroke-width="1" opacity="0.6">
          <line x1="375" y1="292" x2="371" y2="300"/><line x1="392" y1="292" x2="388" y2="300"/><line x1="408" y1="292" x2="404" y2="300"/><line x1="424" y1="292" x2="420" y2="300"/>
        </g>
        <!-- gust front -->
        <path d="M430 286 L505 286" stroke="#1a4fc4" stroke-width="1.8" fill="none" marker-end="url(#adn)" transform="rotate(0)"/>
        <text x="512" y="282" font-family="Inter,sans-serif" font-size="9" fill="#1a4fc4">gust front</text>
        <text x="360" y="312" text-anchor="middle" font-family="Inter,sans-serif" font-size="11" font-weight="600" fill="#991f1f">2. Mature</text>
        <text x="360" y="327" text-anchor="middle" font-family="Inter,sans-serif" font-size="9" fill="#6b7080">Up and down · rain reaches surface · most hazardous</text>

        <!-- STAGE 3: dissipating -->
        <path d="M570 290 C565 220 575 140 600 110 L565 96 L695 96 L665 110 C690 140 700 220 690 290 Z" fill="#f7f8fc" stroke="#9aa0ad" stroke-width="1.2" opacity="0.85"/>
        <path d="M605 125 L605 285" stroke="#1a4fc4" stroke-width="2" fill="none" class="down" marker-end="url(#adn)"/>
        <path d="M630 120 L630 285" stroke="#1a4fc4" stroke-width="2" fill="none" class="down" marker-end="url(#adn)"/>
        <path d="M655 125 L655 285" stroke="#1a4fc4" stroke-width="2" fill="none" class="down" marker-end="url(#adn)"/>
        <text x="630" y="312" text-anchor="middle" font-family="Inter,sans-serif" font-size="11" font-weight="600" fill="#0d1117">3. Dissipating</text>
        <text x="630" y="327" text-anchor="middle" font-family="Inter,sans-serif" font-size="9" fill="#6b7080">Downdraughts only · rain easing</text>
      </svg>
    </div>
    <div class="diagram-caption">Red arrows are updraughts, blue are downdraughts. The mature stage is the only one with both, and it begins when precipitation first reaches the ground.</div>
  </div>

  <table class="data-table">
    <thead><tr><th>Stage</th><th>Begins when</th><th>Air currents</th><th>Typical duration</th></tr></thead>
    <tbody>
      <tr><td><strong>Cumulus</strong></td><td>Cumulus cloud starts growing vertically</td><td>Updraughts throughout the cloud</td><td class="mono">10 to 15 min <span class="fcom-flag">⚑</span></td></tr>
      <tr><td><strong>Mature</strong></td><td>Precipitation first reaches the surface</td><td>Updraughts and downdraughts side by side. Strongest of the cycle.</td><td class="mono">15 to 30 min <span class="fcom-flag">⚑</span></td></tr>
      <tr><td><strong>Dissipating</strong></td><td>Downdraughts spread through the whole cell</td><td>Downdraughts only. The supply of warm moist air is cut off.</td><td class="mono">about 30 min <span class="fcom-flag">⚑</span></td></tr>
    </tbody>
  </table>

  <div class="callout blue">
    <strong>The one fact most questions turn on:</strong> the mature stage starts when rain or hail first reaches the ground. That's also when the first gust, the sharp temperature drop and the pressure jump arrive at the surface, and when turbulence, hail, icing and lightning are all at their worst.
  </div>

  <h2>Hazards to aircraft</h2>

  <table class="data-table">
    <thead><tr><th>Hazard</th><th>What to know for the exam</th></tr></thead>
    <tbody>
      <tr><td><strong>Turbulence</strong></td><td>Severe to extreme inside the cloud, from adjacent updraughts and downdraughts. Also found below the cloud, around it, and in clear air near the top and under the anvil.</td></tr>
      <tr><td><strong>Icing</strong></td><td>Heavy clear (glaze) ice is likely in the updraughts above the freezing level, where large supercooled drops are carried aloft. See <a href="#">Chapter 12, Ice Accretion</a>.</td></tr>
      <tr><td><strong>Hail</strong></td><td>Most likely in the mature stage. Can fall from under the anvil, in clear air, well ahead of the storm.</td></tr>
      <tr><td><strong>Lightning</strong></td><td>Can strike aircraft in or near the cloud. Effects include temporary blindness, compass errors, and damage to radio and electrical equipment.</td></tr>
      <tr><td><strong>Gust front and squall</strong></td><td>Cold downdraught air spreading out ahead of the storm. A sudden wind shift and increase, a sharp drop in temperature and a rise in pressure, often before the rain arrives.</td></tr>
      <tr><td><strong>Microburst</strong></td><td>An intense, small-scale downdraught. Under about 4 km across, lasting about 5 to 15 minutes <span class="fcom-flag">⚑</span>. The most dangerous low-level wind shear for an aircraft on approach or departure.</td></tr>
      <tr><td><strong>Altimeter errors</strong></td><td>Rapid pressure changes under and around the storm make the altimeter unreliable near the ground.</td></tr>
      <tr><td><strong>Heavy rain and reduced visibility</strong></td><td>Torrential rain, possible water ingestion, and visibility near zero in the heaviest showers.</td></tr>
    </tbody>
  </table>

  <h3>Microburst on approach: the sequence</h3>
  <p>This is examined often because the first sign is misleading. An aircraft flying through a microburst on approach meets three things in turn:</p>
  <ol>
    <li><strong>Headwind increase.</strong> Airspeed and performance rise, and the aircraft tends to go above the glidepath. The natural reaction is to reduce power.</li>
    <li><strong>Downdraught.</strong> Strong sinking air in the centre.</li>
    <li><strong>Tailwind.</strong> Airspeed and lift fall sharply, just when the aircraft is lowest and the power has been reduced.</li>
  </ol>
  <p>That's why a sudden, unexplained airspeed gain near a thunderstorm on approach is a warning sign, not good news.</p>

  <h2>Thunderstorms in India</h2>

  <p>DGCA questions use Indian examples, and IC Joshi covers them in detail.</p>
  <ul>
    <li><strong>Nor'westers (Kalbaishakhi):</strong> violent pre-monsoon thunderstorms over West Bengal, Odisha, Assam and Bangladesh, mainly in April and May. Named for the direction they arrive from: they usually move from the north-west towards the south-east. They bring squalls, hail and heavy rain, often in the afternoon or evening.</li>
    <li><strong>Dust storms (Andhi):</strong> pre-monsoon storms over north-west India, including Rajasthan, Punjab and Haryana. Strong winds lift dust and sand, and visibility can drop to near zero.</li>
    <li><strong>The pre-monsoon season</strong> (March to May) is the peak thunderstorm period for much of India. See <a href="#">Chapter 19, Climatology India</a>.</li>
  </ul>

  <h2>Detection and avoidance</h2>

  <ul>
    <li><strong>Weather radar</strong> detects precipitation, not cloud or turbulence. The strongest echoes and the steepest gradients between them mark the worst areas. A hook or finger-shaped echo suggests severe weather.</li>
    <li><strong>Radar attenuation:</strong> heavy rain close to the aircraft can hide a more severe cell behind it.</li>
    <li><strong>Avoid severe thunderstorms by at least 20 NM</strong> <span class="fcom-flag">⚑</span>, and treat an embedded or obscured storm as severe.</li>
    <li><strong>Don't fly under the anvil</strong>: hail can fall from it in apparently clear air.</li>
    <li><strong>Don't take off or land</strong> with a thunderstorm approaching or overhead the aerodrome.</li>
    <li><strong>Reports and forecasts:</strong> TS and CB appear in METARs and TAFs, and active thunderstorm areas are warned of by SIGMET. See <a href="#">Chapter 21, Meteorological Services for Aviation</a>.</li>
  </ul>

  <div class="callout red">
    <strong>Going over the top:</strong> flying over the top of a thunderstorm isn't safe just because the aircraft can clear it. Severe turbulence and hail can extend well above and around the visible cloud top, and the storm can grow faster than the aircraft can climb.
  </div>

  <h2>Common traps</h2>

  <div class="trap">
    <div class="wrong">✗ "The cumulus stage ends when the cloud reaches its maximum height."</div>
    <div class="right">✓ The mature stage begins when precipitation first reaches the surface. That's the boundary DGCA tests.</div>
  </div>
  <div class="trap">
    <div class="wrong">✗ "Hail only falls from the main body of the storm."</div>
    <div class="right">✓ Hail can fall from under the anvil, ahead of the storm, in air that looks clear.</div>
  </div>
  <div class="trap">
    <div class="wrong">✗ "An airspeed increase on approach near a storm means the conditions are improving."</div>
    <div class="right">✓ It's often the first phase of a microburst. The downdraught and tailwind come next.</div>
  </div>
  <div class="trap">
    <div class="wrong">✗ "Nor'westers blow from the north-west."</div>
    <div class="right">✓ They're named for the direction they arrive from: the storms move from north-west to south-east. The squall wind itself can come from various directions.</div>
  </div>
  <div class="trap">
    <div class="wrong">✗ "Radar shows turbulence."</div>
    <div class="right">✓ Radar shows precipitation. Turbulence is inferred from echo intensity and gradients.</div>
  </div>
`,

  related: String.raw`
  <h2>Related chapters</h2>
  <ul class="related">
    <li><a href="#">Chapter 8, Clouds</a>: the cumulonimbus as a cloud type, separate from the storm process.</li>
    <li><a href="#">Chapter 9, Stability of Atmosphere</a>: conditional instability, the reason thunderstorms form at all.</li>
    <li><a href="#">Chapter 12, Ice Accretion</a>: clear ice in convective cloud.</li>
    <li><a href="#">Chapter 14, Air Masses and Western Disturbances</a>: frontal thunderstorms.</li>
    <li><a href="#">Chapter 16, Clear Air Turbulence</a>: not to be confused with turbulence in and around a storm.</li>
    <li><a href="#">Chapter 21, Meteorological Services for Aviation</a>: SIGMETs for thunderstorms.</li>
  </ul>
`,

  disclaimer: String.raw`
  <div class="disclaimer">
    <strong>Note:</strong> This page is a study guide to the topics in Chapter 13 of <em>Aviation Meteorology</em> by IC Joshi (2019 edition) as they relate to the DGCA CPL Meteorology syllabus. It does not reproduce the book. Values marked <span class="fcom-flag">⚑</span> are typical figures from aviation meteorology training material and should be checked against the prescribed textbook. ProPilotLicence.com is not affiliated with, endorsed by, or associated with the author or publisher. Content reviewed by the ProPilotLicence Captain Panel.
  </div>
`,
}
