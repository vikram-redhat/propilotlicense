// Bharatiya Vayuyan Niyam, 2026 guide: the inner HTML of <main class="article-wrap"> from
// the editorial source (bharatiya-vayuyan-niyam-2026.html), verbatim except for:
// - the byline's "Updated" date, filled from the registry's updatedAt ({{UPDATED}});
// - the Gazette PDF link, added to the Key facts table and the "Where can I read the full
//   text?" answer (data-cta="bvn-pdf");
// - links to the Adhiniyam guide from the standfirst, the framework table's Act row and
//   the first Related link;
// - real hrefs on the Related links and the CTA (data-cta="bvn-guide"). The CTA goes to
//   Air Regulations practice; logged-out visitors are sent to /login?next= by proxy.ts.
// The editorial content goes to the Captain Panel for review: don't edit it here.
export const ARTICLE_HTML = String.raw`
  <div class="eyebrow">DGCA Exam Guides · Air Regulations</div>
  <h1>Bharatiya Vayuyan Niyam 2026: What Pilots and DGCA Students Need to Know</h1>

  <p class="standfirst">India has replaced the Aircraft Rules, 1937. The Bharatiya Vayuyan Niyam, 2026 was notified on 26 October 2026 and comes into force on 1 January 2027, under the <a href="/guides/dgca-exam-guides/bharatiya-vayuyan-adhiniyam-2024" data-cta="bvn-guide">Bharatiya Vayuyan Adhiniyam, 2024</a>, which replaced the Aircraft Act, 1934. This guide is written from the notified text. It covers what the new rules contain, what changes for pilots and student pilots, and what it means for the DGCA Air Regulations exam, with the rule number for every requirement.</p>

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
      <tr><td><strong>Full name</strong></td><td>Bharatiya Vayuyan Niyam, 2026</td></tr>
      <tr><td><strong>Notification</strong></td><td>G.S.R. 957(E), Ministry of Civil Aviation, dated 26 October 2026, Gazette of India, Extraordinary. <a href="/downloads/bharatiya-vayuyan-niyam-2026-gsr-957e.pdf" data-cta="bvn-pdf" type="application/pdf">Download the notified text (PDF, G.S.R. 957(E))</a></td></tr>
      <tr><td><strong>Made under</strong></td><td>Bharatiya Vayuyan Adhiniyam, 2024 (16 of 2024)</td></tr>
      <tr><td><strong>In force from</strong></td><td class="mono">1 January 2027 (rule 1)</td></tr>
      <tr><td><strong>Repeals</strong></td><td>The Aircraft Rules, 1937; Part IX of the Aircraft Rules, 1920; the Radio Telephone Operator (Restricted) Certificate and Licence Rules, 2025 (rule 220)</td></tr>
      <tr><td><strong>Structure</strong></td><td>220 rules in 8 chapters, with 6 schedules</td></tr>
      <tr><td><strong>CPL and ATPL education</strong></td><td>Class 12 with Physics and Mathematics, unchanged</td></tr>
      <tr><td><strong>CPL and ATPL validity</strong></td><td>Licence 10 years; medical 12 months (rule 79)</td></tr>
      <tr><td><strong>Alcohol</strong></td><td>None within 12 hours of flight, and no detectable alcohol (rule 174)</td></tr>
    </tbody>
  </table>

  <div class="callout blue">
    <strong>Until 31 December 2026, the Aircraft Rules, 1937 are still the law.</strong> The new rules take effect on 1 January 2027. For the exam, though, see below: DGCA papers are already moving to the new framework.
  </div>

  <h2>Adhiniyam, Niyam and CARs: how the new framework fits together</h2>

  <p>"Adhiniyam" means Act and "Niyam" means Rules. Indian aviation law has three layers, and the reforms have replaced the top two.</p>

  <table class="data-table">
    <thead><tr><th>Layer</th><th>Old</th><th>New</th><th>What it does</th></tr></thead>
    <tbody>
      <tr><td><strong>Act</strong> (Parliament)</td><td>Aircraft Act, 1934</td><td><a href="/guides/dgca-exam-guides/bharatiya-vayuyan-adhiniyam-2024" data-cta="bvn-guide">Bharatiya Vayuyan Adhiniyam, 2024</a>, in force from 1 January 2025</td><td>Gives the government the power to regulate aviation and make rules</td></tr>
      <tr><td><strong>Rules</strong> (Central Government)</td><td>Aircraft Rules, 1937</td><td>Bharatiya Vayuyan Niyam, 2026, in force from 1 January 2027</td><td>The legal requirements: registration, airworthiness, licensing, aerodromes, operations, penalties</td></tr>
      <tr><td><strong>CARs</strong> (DGCA)</td><td>Civil Aviation Requirements</td><td>Continue under the new rules</td><td>The technical detail the rules hand to DGCA, such as FDTL limits and medical standards</td></tr>
    </tbody>
  </table>

  <h3>Timeline</h3>
  <table class="data-table">
    <thead><tr><th>Date</th><th>Event</th></tr></thead>
    <tbody>
      <tr><td class="mono">1934</td><td>Aircraft Act passed</td></tr>
      <tr><td class="mono">1937</td><td>Aircraft Rules made under it</td></tr>
      <tr><td class="mono">1 Jan 2025</td><td>Bharatiya Vayuyan Adhiniyam, 2024 in force. The 1937 Rules continued under it.</td></tr>
      <tr><td class="mono">11 Jul 2025</td><td>Draft Bharatiya Vayuyan Niyam, 2025 published for comment, G.S.R. 466(E)</td></tr>
      <tr><td class="mono">26 Oct 2026</td><td>Final rules notified as the Bharatiya Vayuyan Niyam, 2026, G.S.R. 957(E)</td></tr>
      <tr><td class="mono">1 Jan 2027</td><td>Niyam in force; Aircraft Rules, 1937 repealed</td></tr>
    </tbody>
  </table>

  <h2>What it means for the DGCA Air Regulations exam</h2>

  <div class="callout amber">
    <strong>The Captain Panel's advice:</strong> DGCA papers are starting to reflect the 2024 Act and 2026 Rules now, ahead of 1 January 2027. If you're sitting Air Regulations from here on, learn the national law topics under the new Act and Rules.
  </div>

  <ul>
    <li><strong>Most of the syllabus doesn't change.</strong> Rules of the Air, air traffic services, separation, aerodrome markings and lighting, PANS-OPS, search and rescue and the ICAO Annexes come from ICAO standards. A runway marking or a separation minimum is the same under either set of rules.</li>
    <li><strong>National law does change.</strong> Questions on the Act, licensing, documents, alcohol, logbooks, registration, offences and penalties now come from the Adhiniyam and the Niyam, and the rule numbers are different. The table below gives the new rule for the topics most often examined.</li>
    <li><strong>Textbooks haven't caught up.</strong> Current editions of the standard Air Regulations books cite the Aircraft Act, 1934 and the 1937 Rules. Use them for the ICAO material, and use the new rules for national law.</li>
  </ul>

  <h3>Exam topics and where they now sit</h3>
  <table class="data-table">
    <thead><tr><th>Topic</th><th>Bharatiya Vayuyan Niyam, 2026</th></tr></thead>
    <tbody>
      <tr><td>Application of the rules (Indian and foreign aircraft)</td><td>Rule 1</td></tr>
      <tr><td>Definitions</td><td>Rule 2</td></tr>
      <tr><td>Documents to be carried on aircraft</td><td>Rule 5</td></tr>
      <tr><td>Carriage of arms, ammunition and explosives</td><td>Rule 6</td></tr>
      <tr><td>Photography at aerodromes and from aircraft</td><td>Rules 9 and 10</td></tr>
      <tr><td>Dangerous flying</td><td>Rule 15</td></tr>
      <tr><td>Assault and interference with crew</td><td>Rule 18</td></tr>
      <tr><td>Carriage of animals, birds and reptiles</td><td>Rule 21</td></tr>
      <tr><td>Fuelling of aircraft</td><td>Rule 22</td></tr>
      <tr><td>Dropping of articles and parachute descents</td><td>Rule 24</td></tr>
      <tr><td>Sonic boom prohibited</td><td>Rule 26</td></tr>
      <tr><td>Certificate of registration</td><td>Rule 39</td></tr>
      <tr><td>Licensing authority and list of licences</td><td>Rule 69</td></tr>
      <tr><td>Disqualification from holding a licence</td><td>Rule 70</td></tr>
      <tr><td>Validity of licences and medicals</td><td>Rule 79</td></tr>
      <tr><td>Validation of foreign licences</td><td>Rule 83</td></tr>
      <tr><td>Pilot logbooks and logging flight time</td><td>Rule 84</td></tr>
      <tr><td>Carriage of cabin crew</td><td>Rule 115</td></tr>
      <tr><td>Laser lights near aerodromes</td><td>Rule 123</td></tr>
      <tr><td>Fatigue management (FDTL) of flight and cabin crew</td><td>Rule 170</td></tr>
      <tr><td>Alcohol and psychoactive substances</td><td>Rule 174</td></tr>
      <tr><td>Smoking in aircraft</td><td>Rule 175</td></tr>
      <tr><td>Portable electronic devices</td><td>Rule 177</td></tr>
      <tr><td>Scheduled and non-scheduled air transport</td><td>Rules 183 and 184</td></tr>
      <tr><td>Mandatory and voluntary safety reporting</td><td>Rules 204 and 205</td></tr>
      <tr><td>Offences, compounding and penalties</td><td>Rules 214 and 215, Fifth and Sixth Schedules</td></tr>
      <tr><td>Repeal and savings</td><td>Rule 220</td></tr>
      <tr><td>Licence requirements (SPL, PPL, CPL, ATPL, ratings)</td><td>First Schedule</td></tr>
    </tbody>
  </table>

  <h2>The eight chapters</h2>
  <table class="data-table">
    <thead><tr><th>Chapter</th><th>Title</th><th>Rules</th></tr></thead>
    <tbody>
      <tr><td>I</td><td>Preliminary</td><td class="mono">1–2</td></tr>
      <tr><td>II</td><td>General</td><td class="mono">3–26</td></tr>
      <tr><td>III</td><td>Aircraft</td><td class="mono">27–68</td></tr>
      <tr><td>IV</td><td>Personnel</td><td class="mono">69–120</td></tr>
      <tr><td>V</td><td>Aerodrome</td><td class="mono">121–139</td></tr>
      <tr><td>VI</td><td>Air Navigation Services</td><td class="mono">140–167</td></tr>
      <tr><td>VII</td><td>Aircraft Operations</td><td class="mono">168–200</td></tr>
      <tr><td>VIII</td><td>Regulatory, Surveillance and Enforcement</td><td class="mono">201–220</td></tr>
    </tbody>
  </table>
  <p>The six schedules: First, aircraft personnel licensing; Second, air traffic services personnel; Third, aeronautical telecommunication; Fourth, air operator certificates for scheduled air transport; Fifth, punishment and compounding of offences; Sixth, penalties.</p>

  <h2>What changes for pilots and student pilots</h2>

  <h3>Educational qualification (First Schedule, Section A)</h3>
  <ul>
    <li><strong>Class 10:</strong> Student Pilot's Licence, Private Pilot's Licence (aeroplanes and helicopters), Pilot's Licence for gliders, balloons, gyroplanes, microlight and light sport aircraft, and FRTOL (Restricted).</li>
    <li><strong>Class 12 with Physics and Mathematics:</strong> CPL and ATPL (aeroplanes and helicopters), FRTOL, student and flight navigator, and student and flight engineer licences.</li>
  </ul>
  <p>The 2025 draft had proposed dropping Physics and Mathematics for the CPL and ATPL. <strong>The final rules keep the requirement.</strong></p>

  <h3>Licence and medical validity (rule 79)</h3>
  <table class="data-table">
    <thead><tr><th>Licence</th><th>Medical valid for</th><th>Licence valid for</th></tr></thead>
    <tbody>
      <tr><td>ATPL (aeroplanes or helicopters)</td><td class="mono">12 months</td><td class="mono">10 years</td></tr>
      <tr><td>CPL (aeroplanes or helicopters), Flight Navigator</td><td class="mono">12 months</td><td class="mono">10 years</td></tr>
      <tr><td>FRTOL</td><td class="mono">12 months</td><td>Up to the validity of the RTR</td></tr>
      <tr><td>Student Pilot, Student Navigator, Student Flight Engineer</td><td class="mono">24 months</td><td class="mono">10 years</td></tr>
      <tr><td>PPL, Pilot's Licence (microlight, gyroplane, light sport, glider, balloon), FRTOL (Restricted), Flight Engineer</td><td class="mono">24 months</td><td class="mono">10 years</td></tr>
    </tbody>
  </table>
  <ul>
    <li><strong>Medical validity is halved</strong> for CPL and ATPL holders over 40 in single-crew commercial air transport, and over 60 in multi-crew commercial air transport. For PPL and the other category 5 licences, it's halved after 50.</li>
    <li><strong>Renew within 45 days</strong> before expiry and the new validity runs on from the old expiry date. Renew earlier or later and it runs from the renewal date. The same applies to medicals.</li>
  </ul>

  <h3>CPL (Aeroplanes) requirements (First Schedule, Section J)</h3>
  <ul>
    <li><strong>Age:</strong> at least 18.</li>
    <li><strong>Education:</strong> Class 12 with Physics and Mathematics.</li>
    <li><strong>Written exams:</strong> Air Regulations, Air Navigation, Aviation Meteorology, Aircraft and Engines, and Signals (practical).</li>
    <li><strong>Experience:</strong> at least 200 hours of flight time, including:
      <ul>
        <li>100 hours as pilot-in-command, 15 of them in the 6 months before applying</li>
        <li>20 hours cross-country as PIC, including one flight of at least 300 NM with full-stop landings at two different aerodromes</li>
        <li>10 hours of instrument time, no more than 5 of them on an approved simulator</li>
        <li>5 hours by night, with 10 take-offs and 10 landings as PIC within the 6 months before applying</li>
      </ul>
    </li>
    <li><strong>Also required:</strong> a current FRTOL, and a skill test within 6 months before applying.</li>
  </ul>
  <p>Night, for licensing purposes, is from half an hour after sunset to half an hour before sunrise (First Schedule, Section A).</p>

  <h3>Logbooks (rule 84)</h3>
  <ul>
    <li>Every licensed flight crew member keeps a personal logbook, in the form DGCA specifies.</li>
    <li>Dual instruction is logged as "dual", and the instructor records the instruction given.</li>
    <li>A student pilot logs PIC time only when he is the sole occupant.</li>
    <li>Instrument flight time counts only when flying solely by reference to instruments. Over-the-top flying doesn't count.</li>
  </ul>

  <h3>Alcohol and drugs (rule 174)</h3>
  <ul>
    <li>No crew member may take alcohol, a sedative, a narcotic or a stimulant within <strong>12 hours</strong> of the start of a flight, or during it.</li>
    <li>No detectable alcohol is allowed in breath, urine or blood.</li>
    <li>No alcohol may be served or consumed on domestic air transport services.</li>
    <li>Operators must test crew, under conditions set by DGCA.</li>
  </ul>

  <h3>Fatigue (rule 170)</h3>
  <p>DGCA sets the limits on flight time, flight duty period, duty period and minimum rest for flight and cabin crew. Each Indian operator must have a DGCA-approved FDTL scheme in its operations manual, and may run a fatigue risk management system.</p>

  <h3>Disqualification (rule 70)</h3>
  <p>A licence can be refused, suspended or cancelled, after a hearing, for reasons including habitual alcohol or drug misuse, using an aircraft to commit an offence, irresponsible conduct as crew, conviction for certain offences, obtaining a licence on false information, and tampering with a licence or related documents.</p>

  <h3>Cabin crew (rule 115)</h3>
  <ul>
    <li>Aeroplanes with 10 to 50 passenger seats, and helicopters with 20 to 50: at least one cabin crew member.</li>
    <li>More than 50 seats: two, plus one for every 50 seats, or part of 50, above 99.</li>
  </ul>

  <h2>Aircraft, aerodromes and DGCA</h2>
  <ul>
    <li><strong>Registration</strong> (rules 39 to 46): certificate of registration, temporary registration, change of owner or lessor, export and the register of aircraft.</li>
    <li><strong>Airworthiness directives</strong> (rule 35), <strong>modifications and repairs</strong> (rule 52), <strong>weight and balance</strong> (rule 61) and <strong>defects</strong> (rule 62).</li>
    <li><strong>Lasers</strong> (rule 123): no laser beam or light within 10 NM of the aerodrome reference point without the aerodrome operator's written permission.</li>
    <li><strong>Aerodrome licensing</strong> (rules 124 to 139), including the aerodrome manual and entry into public aerodromes.</li>
    <li><strong>Air navigation services</strong> (rules 140 to 167), including airspace classification (rule 142) and fatigue management of air traffic controllers (rule 140).</li>
    <li><strong>DGCA</strong> adopts the Chicago Convention and its Annexes (rule 201), issues directions (rule 202), and runs mandatory and voluntary safety reporting (rules 204 and 205).</li>
  </ul>

  <h2>Offences and penalties</h2>
  <ul>
    <li><strong>Offences</strong> (rule 214, Fifth Schedule): those listed in Table 1 are punishable with imprisonment of up to two years, a fine of up to ₹1 crore, or both. Flying an unregistered aircraft is one. Offences in Table 2 can be compounded by DGCA.</li>
    <li><strong>Penalties</strong> (rule 215, Sixth Schedule): contraventions are graded into ten severity levels. The amount depends on the level, and on whether the offender is an individual or a small, medium or large organisation. Level 1 for an individual is ₹10,000.</li>
    <li><strong>Defence</strong> (rule 214(2)): it's a defence if the contravention was caused by circumstances beyond the person's control, such as stress of weather or a bona fide error.</li>
    <li><strong>Appeals</strong> (rule 216): to a first or second appellate officer, with a fee of ₹1,000.</li>
  </ul>

  <h2>Existing licences</h2>
  <p>Licences, certificates and approvals granted under the 1937 Rules are saved by rule 220, so far as they're consistent with the Act. A pilot licensed before 1 January 2027 doesn't lose the licence when the new rules start. Radio telephone operator certificates issued by the Department of Telecommunications or DGCA stay valid to their expiry, and are renewed under the new rules without re-examination (rule 219).</p>

  <h2>How ProPilotLicence is handling the change</h2>
  <p>We're writing a new set of Air Regulations questions on the Adhiniyam and the Niyam, reviewed by our Captain Panel, and moving national law practice onto the new rules. Questions on ICAO material are unaffected.</p>

  <h2>Frequently asked questions</h2>

  <p class="faq-q">What is the Bharatiya Vayuyan Niyam, 2026?</p>
  <p>India's new civil aviation rules, made under the Bharatiya Vayuyan Adhiniyam, 2024. They replace the Aircraft Rules, 1937 and cover aircraft, personnel licensing, aerodromes, air navigation services, aircraft operations, and enforcement, in 220 rules, 8 chapters and 6 schedules.</p>

  <p class="faq-q">When does the Bharatiya Vayuyan Niyam come into force?</p>
  <p>On 1 January 2027. It was notified as G.S.R. 957(E), dated 26 October 2026. Until then, the Aircraft Rules, 1937 remain in force.</p>

  <p class="faq-q">What is the difference between the Bharatiya Vayuyan Adhiniyam and the Bharatiya Vayuyan Niyam?</p>
  <p>The Adhiniyam is the Act passed by Parliament, which replaced the Aircraft Act, 1934 from 1 January 2025. The Niyam is the set of rules made under that Act, which replaces the Aircraft Rules, 1937 from 1 January 2027.</p>

  <p class="faq-q">Will the DGCA Air Regulations exam change?</p>
  <p>Yes, for national law. DGCA papers are starting to reflect the 2024 Act and 2026 Rules now. Topics based on ICAO standards, such as Rules of the Air, air traffic services and aerodrome markings, don't change.</p>

  <p class="faq-q">Do I still need Physics and Maths for a CPL?</p>
  <p>Yes. The final rules require Class 12 with Physics and Mathematics for the CPL and ATPL. The 2025 draft had proposed removing it, but that wasn't kept.</p>

  <p class="faq-q">How long is a CPL valid under the new rules?</p>
  <p>Ten years. The medical is valid for 12 months, halved after age 40 in single-crew commercial air transport and after 60 in multi-crew commercial air transport (rule 79).</p>

  <p class="faq-q">Is my existing pilot licence still valid?</p>
  <p>Yes. Rule 220 saves licences granted under the Aircraft Rules, 1937, so far as they are consistent with the Act.</p>

  <p class="faq-q">What is the alcohol rule for pilots?</p>
  <p>No alcohol, sedative, narcotic or stimulant within 12 hours of the start of a flight or during it, and no detectable alcohol in breath, urine or blood (rule 174).</p>

  <p class="faq-q">What are the penalties under the Bharatiya Vayuyan Niyam?</p>
  <p>Offences in the Fifth Schedule carry imprisonment of up to two years, a fine of up to ₹1 crore, or both, and some can be compounded. Other contraventions carry graded penalties across ten severity levels in the Sixth Schedule, from ₹10,000 for an individual at level 1.</p>

  <p class="faq-q">Where can I read the full text?</p>
  <p>In the Gazette of India, Extraordinary, Part II, Section 3(i), as G.S.R. 957(E) dated 26 October 2026, and on the Ministry of Civil Aviation's website. <a href="/downloads/bharatiya-vayuyan-niyam-2026-gsr-957e.pdf" data-cta="bvn-pdf" type="application/pdf">Download the notified text (PDF, G.S.R. 957(E))</a>.</p>

  <h2>Related</h2>
  <ul class="related">
    <li><a href="/guides/dgca-exam-guides/bharatiya-vayuyan-adhiniyam-2024" data-cta="bvn-guide">Bharatiya Vayuyan Adhiniyam 2024: the new Aircraft Act explained for pilots</a></li>
    <li><a href="/subjects/air-regulations" data-cta="bvn-guide">Air Regulations: practice questions</a></li>
    <li><a href="/books/rk-bali-air-regulations" data-cta="bvn-guide">RK Bali, Air Regulations: chapter guide</a></li>
    <li><a href="/guides/dgca-exam-guides/dgca-cpl-books" data-cta="bvn-guide">Which books should I study for the DGCA CPL theory exams?</a></li>
  </ul>

  <div class="cta-block">
    <h3>Practise Air Regulations</h3>
    <p>Questions on every topic in the DGCA Air Regulations syllabus, each citing its source. Free to start.</p>
    <a class="cta-btn" href="/cpl/f27577f4-72cd-4f9b-9ec0-fedf966dd9d2" data-cta="bvn-guide">Practise Air Regulations →</a>
  </div>

  <div class="disclaimer">
    <strong>Note:</strong> This guide summarises the Bharatiya Vayuyan Niyam, 2026 (G.S.R. 957(E), 26 October 2026) for exam preparation, with rule references to the notified text. It is not legal advice. Check requirements against the Gazette text and current DGCA CARs. ProPilotLicence.com is not affiliated with DGCA or the Ministry of Civil Aviation. Content reviewed by the ProPilotLicence Captain Panel.
  </div>

`
