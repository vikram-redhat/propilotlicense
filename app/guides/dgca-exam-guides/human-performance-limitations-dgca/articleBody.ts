// Human Performance and Limitations guide: the inner HTML of <main class="article-wrap"> from
// the editorial source (human-performance-limitations-dgca.html), verbatim except for:
// - the byline's "Updated" date, filled from the registry's updatedAt ({{UPDATED}});
// - the question count, live from the database ({{HP_QUESTIONS}}, three places: Key facts,
//   the last FAQ answer and the CTA), the same count as the subject page;
// - real hrefs on the Niyam link, the Related links and the CTA. The CTA goes to Human
//   Performance chapter practice ({{HP_PRACTICE}}, by chapter record), tracked as
//   data-cta="hp-guide"; logged-out visitors are sent to /login?next= by proxy.ts.
// The editorial content goes to the Captain Panel for review: don't edit it here.
export const ARTICLE_HTML = String.raw`
  <div class="eyebrow">DGCA Exam Guides · Air Regulations</div>
  <h1>Human Performance and Limitations (Human Factors) for the DGCA CPL: What to Study and Where</h1>

  <p class="standfirst">Human Performance and Limitations, usually called human factors, is examined as part of the DGCA Air Regulations paper. Students often can't find it, because it isn't a separate subject. This guide covers which book to use, what the chapter contains, the facts DGCA asks about most, and the traps that cost marks.</p>

  <div class="byline">
    <strong>ProPilotLicence Editorial</strong>
    <span class="byline-dot">·</span>
    <span>Reviewed by the ProPilotLicence Captain Panel</span>
    <span class="byline-dot">·</span>
    <span>Updated {{UPDATED}}</span>
  </div>

  <h2 class="first">Key facts</h2>
  <table class="data-table">
    <tbody>
      <tr><td><strong>Which paper</strong></td><td>Air Regulations. There is no separate Human Performance paper.</td></tr>
      <tr><td><strong>Recommended book</strong></td><td>RK Bali, <em>Air Regulations for CPL/ATPL</em>, Eleventh Revised Edition, 2018, <strong>Chapter 23, Human Performance and Limitations</strong> (pp. 557–630)</td></tr>
      <tr><td><strong>Why that book</strong></td><td>The ProPilotLicence Captain Panel recommends it as the best single text for the DGCA paper</td></tr>
      <tr><td><strong>Practice questions</strong></td><td>{{HP_QUESTIONS}} on ProPilotLicence, grouped under RK Bali Chapter 23</td></tr>
    </tbody>
  </table>

  <div class="callout blue">
    <strong>Watch the chapter number.</strong> In the 2018 edition, Human Performance is Chapter 23. Chapter 22 is Security (Annex 17). Some study notes and question banks still say "Chapter 22".
  </div>

  <h2>What the chapter covers</h2>
  <table class="data-table">
    <thead><tr><th>Topic</th><th>What to know</th></tr></thead>
    <tbody>
      <tr><td><strong>The body and flight</strong></td><td>The nervous system (central, peripheral, autonomic), the heart and circulation, blood, and respiration. Enough anatomy to explain why altitude affects performance.</td></tr>
      <tr><td><strong>Hypoxia</strong></td><td>The four types, their causes, symptoms, and what to do</td></tr>
      <tr><td><strong>Hyperventilation</strong></td><td>Causes, symptoms, and how to tell it from hypoxia</td></tr>
      <tr><td><strong>Pressure effects</strong></td><td>Trapped gas, ear and sinus barotrauma, decompression sickness and its forms, flying after scuba diving</td></tr>
      <tr><td><strong>Vision</strong></td><td>The eye, rods and cones, night vision and dark adaptation, the blind spot, empty field myopia, common defects</td></tr>
      <tr><td><strong>Hearing and balance</strong></td><td>The ear, semicircular canals and otoliths, noise-induced hearing loss</td></tr>
      <tr><td><strong>Spatial disorientation and illusions</strong></td><td>The leans, somatogravic, Coriolis, graveyard spin and spiral, black hole, false horizon, autokinesis, flicker vertigo</td></tr>
      <tr><td><strong>Acceleration</strong></td><td>Greyout, blackout and loss of consciousness under positive g</td></tr>
      <tr><td><strong>Health and fitness to fly</strong></td><td>Alcohol, smoking, blood donation, medication, heart conditions, fits and faints</td></tr>
      <tr><td><strong>Sleep and fatigue</strong></td><td>Circadian rhythm, sleep stages, sleep cycles, fatigue and its effects</td></tr>
      <tr><td><strong>Human factors in the cockpit</strong></td><td>The SHEL model, flight deck design, the eye datum point, displays, anthropometry</td></tr>
      <tr><td><strong>The mind</strong></td><td>Stress, arousal and performance, workload, decision-making, crew resource management</td></tr>
    </tbody>
  </table>

  <h2>High-yield facts</h2>

  <h3>The four types of hypoxia</h3>
  <table class="data-table">
    <thead><tr><th>Type</th><th>What's wrong</th><th>Example</th></tr></thead>
    <tbody>
      <tr><td><strong>Hypoxic</strong></td><td>Not enough oxygen gets into the blood, because its partial pressure is low</td><td>Altitude. The usual one in aviation.</td></tr>
      <tr><td><strong>Anaemic</strong> (hypaemic)</td><td>The blood can't carry enough oxygen</td><td>Carbon monoxide, blood loss, anaemia</td></tr>
      <tr><td><strong>Stagnant</strong> (ischaemic)</td><td>Blood doesn't flow well enough to deliver it</td><td>High g, a cold limb, heart problems</td></tr>
      <tr><td><strong>Histotoxic</strong></td><td>The cells can't use the oxygen they receive</td><td>Alcohol, some drugs, poisons</td></tr>
    </tbody>
  </table>

  <p><strong>Time of useful consciousness</strong> (how long a pilot can act usefully without oxygen) varies widely with altitude, activity, fitness and how quickly the oxygen was lost. Learn the idea and the fact that it shortens sharply with altitude, rather than exact figures.</p>

  <h3>Other facts that are asked often</h3>
  <ul>
    <li><strong>Oxygen is about 21%</strong> of the air at every altitude. What falls with height is its partial pressure.</li>
    <li><strong>Semicircular canals</strong> sense angular acceleration (rotation). <strong>Otoliths</strong> sense linear acceleration and gravity.</li>
    <li><strong>Somatogravic illusion:</strong> forward acceleration feels like a nose-up pitch, as on a go-around or take-off at night, and can lead the pilot to push the nose down.</li>
    <li><strong>Rods</strong> work in dim light and give night vision; <strong>cones</strong> give colour and fine detail. Full dark adaptation takes about 30 minutes.</li>
    <li><strong>Alcohol:</strong> under rule 174 of the Bharatiya Vayuyan Niyam, 2026, crew may not drink within 12 hours of a flight, and no detectable alcohol is allowed. See our <a href="/guides/dgca-exam-guides/bharatiya-vayuyan-niyam-2026">Bharatiya Vayuyan Niyam guide</a>.</li>
    <li><strong>The SHEL model:</strong> Software, Hardware, Environment and Liveware, with the human (Liveware) at the centre.</li>
  </ul>

  <h2>Spatial disorientation and illusions</h2>
  <p>This is one of the most examined parts of the chapter. The balance organs and the eyes can both mislead, especially without a visible horizon.</p>
  <table class="data-table">
    <thead><tr><th>Illusion</th><th>When it happens</th><th>What the pilot feels or sees</th><th>Danger</th></tr></thead>
    <tbody>
      <tr><td><strong>The leans</strong></td><td>Rolling level after a prolonged, gentle turn</td><td>A bank in the opposite direction</td><td>Pilot leans or rolls back into the original turn</td></tr>
      <tr><td><strong>Graveyard spiral</strong></td><td>A prolonged turn in cloud or at night</td><td>The turn sensation fades, so the aircraft feels level while it loses height</td><td>Pilot pulls back, tightening a descending spiral</td></tr>
      <tr><td><strong>Graveyard spin</strong></td><td>Recovering from a spin</td><td>A spin in the opposite direction</td><td>Pilot re-enters the original spin</td></tr>
      <tr><td><strong>Coriolis</strong></td><td>Moving the head sharply during a turn</td><td>Tumbling or rotating in another axis</td><td>Severe disorientation; the most dangerous vestibular illusion</td></tr>
      <tr><td><strong>Somatogravic</strong></td><td>Strong forward acceleration, as on take-off or a go-around at night</td><td>Nose-up pitch (deceleration gives nose-down)</td><td>Pilot pushes the nose down towards the ground</td></tr>
      <tr><td><strong>Inversion</strong></td><td>Abrupt level-off from a climb</td><td>Tumbling backwards</td><td>Pilot pushes forward</td></tr>
      <tr><td><strong>Black hole approach</strong></td><td>Night approach over water or dark terrain to a lit runway</td><td>Being higher than actual</td><td>Pilot flies a low approach</td></tr>
      <tr><td><strong>Runway width and slope</strong></td><td>Unfamiliar runways</td><td>A narrow or upsloping runway looks as if you're high; a wide or downsloping one, low</td><td>Low approach on narrow or upsloping runways; high on wide or downsloping ones</td></tr>
      <tr><td><strong>False horizon</strong></td><td>Sloping cloud tops, or ground lights confused with stars</td><td>A tilted horizon</td><td>Pilot banks to match it</td></tr>
      <tr><td><strong>Autokinesis</strong></td><td>Staring at a single light in the dark</td><td>The light appears to move</td><td>Pilot follows a stationary light</td></tr>
    </tbody>
  </table>
  <p>The cure in every case is the same: believe the instruments, not the body.</p>

  <h2>Vision in more detail</h2>
  <ul>
    <li><strong>The fovea</strong>, at the centre of the retina, is packed with cones: sharp, colour vision in good light. <strong>Rods</strong> are in the periphery, so at night you see a faint object better by looking slightly to one side of it (off-centre viewing).</li>
    <li><strong>The blind spot</strong> is where the optic nerve leaves the eye. With both eyes open each covers the other's, but an object can still hide behind a windscreen pillar.</li>
    <li><strong>Empty field myopia:</strong> with nothing to focus on, such as a hazy sky or cloud tops, the eye relaxes to focus a metre or two away, and distant traffic is missed. Scan in short, regular movements, focusing on objects in turn.</li>
    <li><strong>Night vision</strong> is one of the first things hypoxia affects, so it degrades at lower altitudes than other faculties.</li>
    <li><strong>Defects:</strong> myopia (short sight), hypermetropia (long sight), astigmatism, and presbyopia (loss of near focus with age, usually from the mid-40s). Colour vision defects matter because of light signals and displays.</li>
  </ul>

  <h2>Ears, pressure and decompression</h2>
  <ul>
    <li><strong>The Eustachian tube</strong> connects the middle ear to the throat. On the climb, expanding air escapes easily; on the descent, air must be pushed back in, so ear blocks are more common descending. Don't fly with a cold.</li>
    <li><strong>Sinuses and teeth</strong> can also trap gas and cause pain as pressure changes.</li>
    <li><strong>Decompression sickness</strong> is nitrogen coming out of solution in the body as pressure falls. Its forms: <strong>the bends</strong> (joint pain), <strong>the chokes</strong> (chest and breathing), <strong>the creeps</strong> (skin itching and tingling) and <strong>the staggers</strong> (nervous system: vision, balance, paralysis).</li>
    <li><strong>Scuba diving</strong> loads the body with nitrogen, so flying soon after diving makes decompression sickness more likely. Allow the waiting period your textbook and DGCA require.</li>
  </ul>

  <h2>Sleep, fatigue and stress</h2>
  <ul>
    <li><strong>Circadian rhythm:</strong> the body clock runs on a cycle of about 24 hours, set by daylight. Alertness and body temperature are lowest in the early morning hours. Crossing time zones causes jet lag; flying east is usually harder to adjust to than flying west.</li>
    <li><strong>Sleep cycles:</strong> sleep alternates between non-REM (light to deep, restorative sleep) and REM (dreaming) sleep in cycles of about 90 minutes.</li>
    <li><strong>Fatigue</strong> is either acute (short-term, after a long day) or chronic (built up over time without enough recovery). Both slow reactions and narrow attention.</li>
    <li><strong>Stress and performance:</strong> a moderate level of arousal gives the best performance; too little or too much reduces it (the inverted-U, or Yerkes-Dodson, relationship).</li>
  </ul>

  <h2>The SHEL model and CRM</h2>
  <p>The SHEL model places the human, <strong>Liveware</strong>, at the centre, and looks at how well it fits the other parts of the system:</p>
  <table class="data-table">
    <thead><tr><th>Interface</th><th>Between the pilot and</th><th>Example of a mismatch</th></tr></thead>
    <tbody>
      <tr><td><strong>L–H</strong></td><td>Hardware: controls, displays, seats</td><td>A badly placed switch, or a seat that can't reach the eye datum point</td></tr>
      <tr><td><strong>L–S</strong></td><td>Software: procedures, checklists, charts</td><td>An ambiguous checklist or a cluttered chart</td></tr>
      <tr><td><strong>L–E</strong></td><td>Environment: noise, heat, light, altitude</td><td>Glare, cockpit noise, cold</td></tr>
      <tr><td><strong>L–L</strong></td><td>Liveware: other people</td><td>Poor communication or a steep authority gradient between captain and first officer</td></tr>
    </tbody>
  </table>
  <p><strong>Crew resource management (CRM)</strong> is the use of all available resources (people, equipment and information) to fly safely: communication, teamwork, workload management, situational awareness and decision-making.</p>

  <h2>Common traps</h2>
  <div class="trap">
    <div class="wrong">✗ "The percentage of oxygen falls as you climb."</div>
    <div class="right">✓ It stays at about 21%. The partial pressure falls.</div>
  </div>
  <div class="trap">
    <div class="wrong">✗ "Carbon monoxide causes histotoxic hypoxia."</div>
    <div class="right">✓ It causes anaemic hypoxia, by occupying the haemoglobin. Histotoxic hypoxia is the cells failing to use oxygen.</div>
  </div>
  <div class="trap">
    <div class="wrong">✗ "Hypoxia and hyperventilation are treated the same way."</div>
    <div class="right">✓ At altitude, assume hypoxia first and use oxygen. Hyperventilation is treated by slowing the breathing rate.</div>
  </div>
  <div class="trap">
    <div class="wrong">✗ "The semicircular canals detect a steady turn."</div>
    <div class="right">✓ They detect changes in rotation. In a prolonged turn the fluid catches up and the sensation of turning fades, which causes the leans and the graveyard spiral.</div>
  </div>
  <div class="trap">
    <div class="wrong">✗ "Human Performance is a separate DGCA paper."</div>
    <div class="right">✓ It is examined within Air Regulations.</div>
  </div>

  <h2>How to study it</h2>
  <ol>
    <li><strong>Read RK Bali Chapter 23 once, end to end.</strong> It's about 70 pages, and it's the text the Captain Panel recommends.</li>
    <li><strong>Learn the tables above by heart:</strong> the hypoxia types, the illusions and the SHEL interfaces. They're the easiest marks in the chapter.</li>
    <li><strong>Practise by topic, not just at random.</strong> Our questions are grouped under RK Bali Chapter 23, so you can practise this chapter on its own.</li>
    <li><strong>Revise it with the rest of Air Regulations.</strong> It's part of the same paper, so don't leave it to the end.</li>
  </ol>
  <p>The Oxford and Nordian Human Performance books go deeper if you want more, and many of our practice questions draw on them. For the DGCA paper, RK Bali is enough.</p>

  <h2>Frequently asked questions</h2>

  <p class="faq-q">Is Human Performance a separate paper in the DGCA CPL exam?</p>
  <p>No. Human Performance and Limitations is examined as part of the DGCA Air Regulations paper.</p>

  <p class="faq-q">Which book should I use for Human Performance for the DGCA exam?</p>
  <p>RK Bali, Air Regulations for CPL/ATPL, Eleventh Revised Edition, 2018, Chapter 23, Human Performance and Limitations (pages 557 to 630). The ProPilotLicence Captain Panel recommends it as the best single text for the DGCA paper.</p>

  <p class="faq-q">Which chapter of RK Bali covers human factors?</p>
  <p>Chapter 23, Human Performance and Limitations, in the 2018 edition. Chapter 22 in that edition is Security.</p>

  <p class="faq-q">What are the four types of hypoxia?</p>
  <p>Hypoxic hypoxia (low oxygen partial pressure, as at altitude), anaemic hypoxia (the blood can't carry enough oxygen, for example from carbon monoxide), stagnant hypoxia (poor blood flow, for example under high g) and histotoxic hypoxia (the cells can't use oxygen, for example because of alcohol or poisons).</p>

  <p class="faq-q">What is the somatogravic illusion?</p>
  <p>A false sensation of pitching nose-up during strong forward acceleration, such as a take-off or go-around at night, caused by the otoliths in the inner ear. A pilot who believes it may push the nose down towards the ground.</p>

  <p class="faq-q">Where can I practise Human Performance questions?</p>
  <p>ProPilotLicence has {{HP_QUESTIONS}} Human Performance practice questions, grouped under RK Bali Chapter 23 within Air Regulations, each with an explanation.</p>

  <h2>Related</h2>
  <ul class="related">
    <li><a href="/subjects/human-performance">Human Performance and Limitations: practice questions</a></li>
    <li><a href="/books/rk-bali-air-regulations">RK Bali, Air Regulations: chapter guide</a></li>
    <li><a href="/guides/dgca-exam-guides/bharatiya-vayuyan-niyam-2026">Bharatiya Vayuyan Niyam 2026: what pilots need to know</a></li>
    <li><a href="/guides/dgca-exam-guides/dgca-cpl-books">Which books should I study for the DGCA CPL theory exams?</a></li>
  </ul>

  <div class="cta-block">
    <h3>Practise Human Performance</h3>
    <p>{{HP_QUESTIONS}} questions grouped under RK Bali Chapter 23, each with an explanation. Free to start.</p>
    <a class="cta-btn" href="{{HP_PRACTICE}}" data-cta="hp-guide">Practise Human Performance →</a>
  </div>

  <div class="disclaimer">
    <strong>Note:</strong> This guide covers the topics in Chapter 23 of <em>Air Regulations for CPL/ATPL</em> by Wg Cdr RK Bali (Retd), Eleventh Revised Edition, 2018, as they relate to the DGCA Air Regulations paper. It does not reproduce the book. ProPilotLicence.com is not affiliated with, endorsed by, or associated with the author or publisher. Content reviewed by the ProPilotLicence Captain Panel.
  </div>

`
