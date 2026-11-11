// Bharatiya Vayuyan Adhiniyam, 2024 guide: the inner HTML of <main class="article-wrap"> from
// the editorial source (bharatiya-vayuyan-adhiniyam-2024.html), verbatim except for:
// - the byline's "Updated" date, filled from the registry's updatedAt ({{UPDATED}});
// - the Act PDF link, added to the Key facts Act number row (data-cta="bva-pdf");
// - real hrefs on the Key facts Niyam link, the Related links and the CTA
//   (data-cta="bva-guide"). The CTA goes to Air Regulations practice; logged-out visitors
//   are sent to /login?next= by proxy.ts.
// The editorial content goes to the Captain Panel for review: don't edit it here.
export const ARTICLE_HTML = String.raw`
  <div class="eyebrow">DGCA Exam Guides · Air Regulations</div>
  <h1>Bharatiya Vayuyan Adhiniyam 2024: The New Aircraft Act Explained for Pilots</h1>

  <p class="standfirst">The Bharatiya Vayuyan Adhiniyam, 2024 replaced the Aircraft Act, 1934 on 1 January 2025. It is the Act every Indian aviation rule now hangs from, including the new Bharatiya Vayuyan Niyam, 2026. This guide covers what the Act does, its 43 sections, the powers and penalties DGCA students are examined on, and how it differs from the 1934 Act, with section numbers throughout.</p>

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
      <tr><td><strong>Full name</strong></td><td>The Bharatiya Vayuyan Adhiniyam, 2024</td></tr>
      <tr><td><strong>Act number</strong></td><td class="mono">No. 16 of 2024<br><a href="/downloads/bharatiya-vayuyan-adhiniyam-2024.pdf" data-cta="bva-pdf" type="application/pdf">Download the Act (PDF, Gazette of India, 11 December 2024)</a></td></tr>
      <tr><td><strong>Presidential assent</strong></td><td class="mono">11 December 2024</td></tr>
      <tr><td><strong>In force from</strong></td><td class="mono">1 January 2025</td></tr>
      <tr><td><strong>Replaces</strong></td><td>The Aircraft Act, 1934 (22 of 1934), repealed by section 43</td></tr>
      <tr><td><strong>Length</strong></td><td>43 sections</td></tr>
      <tr><td><strong>Rules made under it</strong></td><td>The Aircraft Rules, 1937 continued under it until the <a href="/guides/dgca-exam-guides/bharatiya-vayuyan-niyam-2026" data-cta="bva-guide">Bharatiya Vayuyan Niyam, 2026</a> replaces them on 1 January 2027</td></tr>
      <tr><td><strong>Maximum punishment</strong></td><td>Generally up to 2 years' imprisonment, a fine up to ₹1 crore, or both. Up to 3 years for slaughter or waste dumping near aerodromes, and for disobeying an emergency order.</td></tr>
    </tbody>
  </table>

  <h2>Act and rules: what the Adhiniyam does</h2>
  <p>"Adhiniyam" means Act. The Adhiniyam is passed by Parliament and gives the Central Government its powers: to set up the regulators, to make rules, to detain aircraft, to control obstacles near aerodromes, and to punish offences. The detailed requirements pilots work with, such as licences, documents, alcohol limits and cabin crew, are in the rules made under it, which are the Bharatiya Vayuyan Niyam, 2026 ("Niyam" means Rules).</p>
  <p>So in an exam, a question about <strong>who has the power</strong>, the <strong>regulators</strong>, <strong>offences and appeals</strong> is usually an Act question. A question about a <strong>specific requirement</strong> is usually a Rules question.</p>

  <h2>Application (section 1)</h2>
  <p>The Act extends to the whole of India and applies to:</p>
  <ul>
    <li>citizens of India, wherever they may be;</li>
    <li>aircraft registered in India, and persons on them, wherever they may be;</li>
    <li>aircraft registered outside India, and persons on them, while in or over India;</li>
    <li>aircraft operated by a person who isn't an Indian citizen but has his principal place of business or permanent residence in India.</li>
  </ul>
  <p>It does not apply to aircraft belonging to or used exclusively by the Navy, Army or Air Force, or to persons in those forces working on them, except for the public health rules under sections 13 and 14 (section 41).</p>

  <h2>Key definitions (section 2)</h2>
  <ul>
    <li><strong>Aircraft:</strong> any machine that can derive support in the atmosphere from reactions of the air, other than reactions of the air against the earth's surface.</li>
    <li><strong>Aerodrome:</strong> any definite or limited ground or water area intended to be used, wholly or in part, for the landing, departure and surface movement of aircraft, including buildings and structures on it.</li>
    <li><strong>Aerodrome reference point:</strong> a designated point in the horizontal plane at or near the geometric centre of the part of the aerodrome reserved for the departure or landing of aircraft.</li>
    <li><strong>Design, maintenance and manufacture</strong> are defined for the first time, reflecting the Act's role in regulating aircraft built and maintained in India.</li>
  </ul>

  <h2>The three regulators</h2>
  <table class="data-table">
    <thead><tr><th>Body</th><th>Section</th><th>Role</th><th>Power to direct</th></tr></thead>
    <tbody>
      <tr><td><strong>Directorate General of Civil Aviation</strong> (DGCA)</td><td>3</td><td>Safety oversight and regulation</td><td>Section 4</td></tr>
      <tr><td><strong>Bureau of Civil Aviation Security</strong> (BCAS)</td><td>5</td><td>Aviation security regulation and oversight</td><td>Section 6</td></tr>
      <tr><td><strong>Aircraft Accidents Investigation Bureau</strong> (AAIB)</td><td>7</td><td>Investigation of accidents and incidents</td><td>n/a</td></tr>
    </tbody>
  </table>
  <p>All three existed under the 1934 Act and are treated as constituted under the new Act. The Central Government superintends them (section 8) and can review directions issued by the DGCA or BCAS Director General (section 9).</p>

  <h2>Key powers of the Central Government</h2>
  <table class="data-table">
    <thead><tr><th>Section</th><th>Power</th></tr></thead>
    <tbody>
      <tr><td class="mono">10</td><td>Make rules on almost every aspect of civil aviation: registration and marking, airworthiness, licensing of pilots, controllers and radio operators, aerodromes, air navigation services, dangerous goods, logbooks, fees and penalties</td></tr>
      <tr><td class="mono">11</td><td>Make rules to implement the Chicago Convention, including the Radio Telephone Operator (Restricted) Certificate and Licence</td></tr>
      <tr><td class="mono">12</td><td>Make rules for the investigation of accidents and incidents</td></tr>
      <tr><td class="mono">13, 14</td><td>Make rules, and use emergency powers, to protect public health</td></tr>
      <tr><td class="mono">15</td><td>Make orders in an emergency, in the interest of public safety or tranquillity, including taking possession of aircraft and aerodromes</td></tr>
      <tr><td class="mono">17</td><td>Detain aircraft</td></tr>
      <tr><td class="mono">18</td><td>Prohibit or regulate buildings, structures and trees within <strong>20 km</strong> of an aerodrome reference point</td></tr>
      <tr><td class="mono">19</td><td>Restrict, suspend or cancel a licence, certificate or approval, after giving a hearing</td></tr>
      <tr><td class="mono">20</td><td>Exempt aircraft or persons from the Act or rules</td></tr>
      <tr><td class="mono">22–24</td><td>Compensation for loss caused by section 18 directions, settled by agreement or an arbitrator</td></tr>
    </tbody>
  </table>

  <h2>Offences, penalties and appeals</h2>
  <table class="data-table">
    <thead><tr><th>Section</th><th>Offence or procedure</th><th>Maximum</th></tr></thead>
    <tbody>
      <tr><td class="mono">15(5)</td><td>Knowingly disobeying an emergency order under section 15. The court may order forfeiture of the aircraft or thing involved.</td><td><strong>3 years</strong>, a fine, or both</td></tr>
      <tr><td class="mono">25(1)</td><td>Breach of rules on carrying arms, explosives or dangerous goods, or false information about them</td><td>2 years, ₹1 crore, or both</td></tr>
      <tr><td class="mono">25(2)</td><td>Breach of rules on slaughtering or flaying animals, or dumping waste, within 10 km of the aerodrome reference point. Cognizable.</td><td><strong>3 years</strong>, ₹1 crore, or both</td></tr>
      <tr><td class="mono">25(4)</td><td>Breach of other rules the Central Government declares punishable</td><td>2 years, ₹1 crore, or both</td></tr>
      <tr><td class="mono">26</td><td>Wilfully flying so as to endanger persons or property on land, water or in the air</td><td>2 years, ₹1 crore, or both</td></tr>
      <tr><td class="mono">27</td><td>Wilfully failing to comply with directions under section 4 or 6</td><td>2 years, ₹1 crore, or both</td></tr>
      <tr><td class="mono">28</td><td>Failing to comply with a section 18 notification on buildings or trees</td><td>2 years, ₹1 crore, or both</td></tr>
      <tr><td class="mono">29</td><td>Abetting or attempting an offence</td><td>Same as the offence</td></tr>
      <tr><td class="mono">30</td><td>Compounding by the Director General of DGCA, BCAS or AAIB, before or after prosecution starts. Not available for offences punishable with imprisonment only, or with imprisonment and fine together, or for a similar offence within 5 years of an earlier one that was compounded or led to conviction.</td><td>Up to ₹1 crore</td></tr>
      <tr><td class="mono">31</td><td>Courts act only on a complaint by, or with the written sanction of, the Director General, made within <strong>one year</strong> of the DG learning of the offence. No court below a Judicial Magistrate of the first class tries these offences.</td><td>n/a</td></tr>
      <tr><td class="mono">32</td><td>Adjudication of monetary penalties for breaches of rules, by designated officers after a hearing</td><td>₹1 crore</td></tr>
      <tr><td class="mono">33</td><td>Appeals against an order suspending, cancelling or restricting a licence (section 19) or imposing a penalty (section 32): first appellate officer, then second appellate officer. Orders of the DGCA or BCAS Director General go to the Central Government. File within <strong>30 days</strong>, extendable by up to 30 more.</td><td>n/a</td></tr>
      <tr><td class="mono">36</td><td>A court may order forfeiture of an aircraft or article involved in certain offences</td><td>n/a</td></tr>
    </tbody>
  </table>

  <h2>Other sections worth knowing</h2>
  <ul>
    <li><strong>Section 34:</strong> rules must be published in draft before they are made, unless the Central Government dispenses with this in the public interest. That's why the Niyam was published as a draft in July 2025.</li>
    <li><strong>Section 35:</strong> rules are laid before both Houses of Parliament, which can modify or annul them.</li>
    <li><strong>Section 37:</strong> the law on wreck and salvage at sea applies to aircraft on or over the sea or tidal waters.</li>
    <li><strong>Section 39:</strong> no suit for trespass or nuisance lies merely because an aircraft flew over property at a reasonable height.</li>
    <li><strong>Section 40:</strong> protection for action taken in good faith under the Act.</li>
    <li><strong>Section 42:</strong> the Central Government can make orders to remove difficulties, but only within two years of commencement.</li>
    <li><strong>Section 43:</strong> repeals the Aircraft Act, 1934. Anything done under it, including licences, certificates and rules, continues as if done under the new Act, so far as it is consistent with it.</li>
  </ul>

  <h2>What changed from the Aircraft Act, 1934</h2>
  <ul>
    <li><strong>A new Act, not an amendment.</strong> The 1934 Act had been amended 21 times. The Adhiniyam re-enacts it in one modern text.</li>
    <li><strong>From control to regulation.</strong> The Act regulates the design, manufacture, maintenance, possession, use, operation, sale, export and import of aircraft, and defines design, maintenance and manufacture for the first time (section 2).</li>
    <li><strong>Indian design and manufacture</strong> are given an explicit place, to support aircraft built in India.</li>
    <li><strong>Radio telephone certificates.</strong> The Act gives the power to make rules for the Radio Telephone Operator (Restricted) Certificate and Licence (section 11(2)). These were previously issued by the Department of Telecommunications. The Niyam now provides for them, valid to age 80.</li>
    <li><strong>A second level of appeal.</strong> Appeals go to a first and then a second appellate officer, and orders of the DGCA and BCAS Directors General go directly to the Central Government (section 33).</li>
    <li><strong>What didn't change:</strong> DGCA, BCAS and AAIB were already statutory bodies, and the ₹1 crore maximum fine dates from the 2020 amendment of the 1934 Act.</li>
  </ul>

  <h2>All 43 sections</h2>
  <table class="data-table">
    <thead><tr><th>Section</th><th>Heading</th></tr></thead>
    <tbody>
      <tr><td class="mono">1</td><td>Short title, extent, application and commencement</td></tr>
      <tr><td class="mono">2</td><td>Definitions</td></tr>
      <tr><td class="mono">3</td><td>Directorate General of Civil Aviation</td></tr>
      <tr><td class="mono">4</td><td>Power of Director General of Civil Aviation to issue directions</td></tr>
      <tr><td class="mono">5</td><td>Bureau of Civil Aviation Security</td></tr>
      <tr><td class="mono">6</td><td>Power of Director General of Bureau of Civil Aviation Security to issue directions</td></tr>
      <tr><td class="mono">7</td><td>Aircraft Accidents Investigation Bureau</td></tr>
      <tr><td class="mono">8</td><td>Superintendence of Central Government</td></tr>
      <tr><td class="mono">9</td><td>Power of Central Government to review orders passed under section 4 or section 6</td></tr>
      <tr><td class="mono">10</td><td>Power of Central Government to make rules</td></tr>
      <tr><td class="mono">11</td><td>Power of Central Government to make rules to implement Convention</td></tr>
      <tr><td class="mono">12</td><td>Power of Central Government to make rules for investigation of accidents</td></tr>
      <tr><td class="mono">13</td><td>Power of Central Government to make rules for protecting public health</td></tr>
      <tr><td class="mono">14</td><td>Emergency powers of Central Government for protecting public health</td></tr>
      <tr><td class="mono">15</td><td>Power of Central Government to make orders in emergency</td></tr>
      <tr><td class="mono">16</td><td>Power of Central Government to make rules for securing safe custody and re-delivery of unclaimed property</td></tr>
      <tr><td class="mono">17</td><td>Power to detain aircraft</td></tr>
      <tr><td class="mono">18</td><td>Power of Central Government to prohibit or regulate construction of buildings, planting of trees, and the like</td></tr>
      <tr><td class="mono">19</td><td>Power of Central Government to restrict, suspend or cancel licence, certificate or approval</td></tr>
      <tr><td class="mono">20</td><td>Power of Central Government to exempt certain aircraft</td></tr>
      <tr><td class="mono">21</td><td>Power of Central Government to delegate</td></tr>
      <tr><td class="mono">22</td><td>Manner of determination and payment of compensation for loss or damage</td></tr>
      <tr><td class="mono">23</td><td>Appeal from award in respect of compensation</td></tr>
      <tr><td class="mono">24</td><td>Arbitrator to have certain powers of civil courts</td></tr>
      <tr><td class="mono">25</td><td>Penalty for contravention of rule made under this Act</td></tr>
      <tr><td class="mono">26</td><td>Penalty for flying so as to cause danger</td></tr>
      <tr><td class="mono">27</td><td>Penalty for failure to comply with directions issued under section 4 or section 6</td></tr>
      <tr><td class="mono">28</td><td>Penalty for failure to comply with directions issued under section 18</td></tr>
      <tr><td class="mono">29</td><td>Penalty for abetment of offences and attempted offences</td></tr>
      <tr><td class="mono">30</td><td>Composition of offences</td></tr>
      <tr><td class="mono">31</td><td>Cognizance of offences</td></tr>
      <tr><td class="mono">32</td><td>Adjudication of penalties</td></tr>
      <tr><td class="mono">33</td><td>Appeal</td></tr>
      <tr><td class="mono">34</td><td>Rules to be made after publication</td></tr>
      <tr><td class="mono">35</td><td>Laying of rules before Parliament</td></tr>
      <tr><td class="mono">36</td><td>Power of Court to order forfeiture</td></tr>
      <tr><td class="mono">37</td><td>Wreck and salvage</td></tr>
      <tr><td class="mono">38</td><td>Use of patented invention on aircraft not registered in India</td></tr>
      <tr><td class="mono">39</td><td>Bar of certain suits</td></tr>
      <tr><td class="mono">40</td><td>Protection of action taken in good faith</td></tr>
      <tr><td class="mono">41</td><td>Savings of application of Act</td></tr>
      <tr><td class="mono">42</td><td>Power to remove difficulty</td></tr>
      <tr><td class="mono">43</td><td>Repeal and savings</td></tr>
    </tbody>
  </table>

  <h2>Frequently asked questions</h2>

  <p class="faq-q">What is the Bharatiya Vayuyan Adhiniyam, 2024?</p>
  <p>It is India's civil aviation Act, No. 16 of 2024, which replaced the Aircraft Act, 1934. It sets up the regulators (DGCA, BCAS and AAIB), gives the Central Government its rule-making and enforcement powers, and sets out offences, penalties and appeals.</p>

  <p class="faq-q">When did the Bharatiya Vayuyan Adhiniyam come into force?</p>
  <p>On 1 January 2025. It received Presidential assent on 11 December 2024.</p>

  <p class="faq-q">What is the difference between the Bharatiya Vayuyan Adhiniyam and the Bharatiya Vayuyan Niyam?</p>
  <p>The Adhiniyam is the Act passed by Parliament. The Niyam is the set of rules made under it, which replaces the Aircraft Rules, 1937 from 1 January 2027. The Act gives the powers; the rules set the detailed requirements.</p>

  <p class="faq-q">Is a licence issued under the Aircraft Act, 1934 still valid?</p>
  <p>Yes. Section 43 saves licences, certificates and other things done under the 1934 Act, so far as they are consistent with the new Act.</p>

  <p class="faq-q">What is the penalty for dangerous flying under the Bharatiya Vayuyan Adhiniyam?</p>
  <p>Under section 26, wilfully flying an aircraft so as to endanger any person or property on land, water or in the air is punishable with imprisonment of up to two years, a fine of up to ₹1 crore, or both.</p>

  <p class="faq-q">Within what distance of an aerodrome can the government restrict buildings and trees?</p>
  <p>Up to 20 km from the aerodrome reference point, under section 18.</p>

  <p class="faq-q">How long do I have to appeal against an order under the Act?</p>
  <p>Thirty days from receiving the order, extendable by up to thirty more days for reasons recorded in writing (section 33).</p>

  <p class="faq-q">Does the Bharatiya Vayuyan Adhiniyam apply to military aircraft?</p>
  <p>No. Under section 41, it does not apply to aircraft belonging to or used exclusively by the Navy, Army or Air Force, except for the public health rules under sections 13 and 14.</p>

  <h2>Related</h2>
  <ul class="related">
    <li><a href="/guides/dgca-exam-guides/bharatiya-vayuyan-niyam-2026" data-cta="bva-guide">Bharatiya Vayuyan Niyam 2026: what pilots and DGCA students need to know</a></li>
    <li><a href="/subjects/air-regulations" data-cta="bva-guide">Air Regulations: practice questions</a></li>
    <li><a href="/books/rk-bali-air-regulations" data-cta="bva-guide">RK Bali, Air Regulations: chapter guide</a></li>
  </ul>

  <div class="cta-block">
    <h3>Practise Air Regulations</h3>
    <p>Questions on every topic in the DGCA Air Regulations syllabus, each citing its source. Free to start.</p>
    <a class="cta-btn" href="/cpl/f27577f4-72cd-4f9b-9ec0-fedf966dd9d2" data-cta="bva-guide">Practise Air Regulations →</a>
  </div>

  <div class="disclaimer">
    <strong>Note:</strong> This guide summarises the Bharatiya Vayuyan Adhiniyam, 2024 (No. 16 of 2024) for exam preparation, with section references to the Act as published in the Gazette of India. It is not legal advice. Check the Act's text for exact wording. ProPilotLicence.com is not affiliated with DGCA or the Ministry of Civil Aviation. Content reviewed by the ProPilotLicence Captain Panel.
  </div>
`
