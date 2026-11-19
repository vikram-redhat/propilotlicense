// DGCA exam dates guide: the inner HTML of <main class="article-wrap"> from the editorial
// source (dgca-exam-dates.html), verbatim except for the data-driven parts, filled by
// page.tsx from lib/data/dgca-exam-sessions.json (lib/dgca-exams.ts):
// - {{LAST_CHECKED}}: the byline's "Last checked against DGCA" date;
// - {{NEXT_EXAMS}}, {{VENUES}} (and {{VENUE_SESSION}}), {{CALENDAR}} (and {{CAL_YEAR}}),
//   {{CALENDAR_NEXT_YEAR}}: the source's DATA REGIONs, in place of its mock-ups;
// - {{NEXT_REGULAR}}: the first sentence of the first FAQ answer, naming the next regular session.
// Real hrefs on the Related links and the CTA (data-cta="exam-dates-page"). The source's
// comment about a fees row is left out: fees wait for Captain Panel confirmation.
// The editorial content goes to the Captain Panel for review: don't edit it here.
export const ARTICLE_HTML = String.raw`
  <div class="eyebrow">DGCA Exam Guides · Exams</div>
  <h1>DGCA Exam Dates: Next Sessions, Portal Windows, Centres and How to Apply</h1>

  <p class="standfirst">When the next DGCA pilot exams are, when the Pariksha portal opens and closes, where the exam centres are, and the difference between regular and on-demand sessions. Taken from DGCA's own calendar and notices, and checked against them every week.</p>

  <div class="byline">
    <strong>ProPilotLicence Editorial</strong>
    <span class="byline-dot">·</span>
    <span>Reviewed by the ProPilotLicence Captain Panel</span>
    <span class="byline-dot">·</span>
    <span>Last checked against DGCA: {{LAST_CHECKED}}</span>
  </div>

  <h2 class="first">Next DGCA exams</h2>
{{NEXT_EXAMS}}

  <div class="callout amber">
    <strong>Missed the portal window?</strong> DGCA doesn't accept late applications. You'll need to apply for the next session, so check the portal dates as soon as a session is announced.
  </div>

  <h2>Regular and on-demand (OLODE) sessions</h2>
  <p>DGCA runs CPL and ATPL theory exams in two kinds of session.</p>
  <table class="data-table">
    <thead><tr><th></th><th>Regular session</th><th>On-demand (OLODE)</th></tr></thead>
    <tbody>
      <tr><td>How often</td><td>4 a year (March, June, September, December in 2026)</td><td>8 a year</td></tr>
      <tr><td>Length</td><td>5 days</td><td>3 days</td></tr>
      <tr><td>Exam date</td><td>Fixed by DGCA</td><td>You choose a centre, date and time slot while seats last</td></tr>
      <tr><td>Papers</td><td colspan="2">The same DGCA papers and pass mark. Each session's notice lists the papers offered.</td></tr>
    </tbody>
  </table>

  <h3>Which should you choose?</h3>
  <ul>
    <li><strong>On-demand</strong> suits you if you have one or two papers left, or you need a particular date: it runs twice as often and you pick your slot.</li>
    <li><strong>Regular</strong> suits you if you're sitting several papers in one go and can plan around DGCA's fixed dates.</li>
    <li>The paper, syllabus and pass mark are the same either way, so choose on timing and convenience.</li>
  </ul>

  <h2>How to apply</h2>
  <ol>
    <li><strong>Get your DGCA Computer Number</strong> through eGCA. You need it to log in to the Pariksha portal.</li>
    <li><strong>Log in to <a href="https://pariksha.dgca.gov.in">pariksha.dgca.gov.in</a></strong> while the portal window for the session is open.</li>
    <li><strong>Choose the session and papers.</strong> For on-demand, also choose a centre, date and time slot. Popular centres fill quickly, so don't leave it to the last day.</li>
    <li><strong>Pay the fee</strong> online through Bharatkosh, in one go.</li>
    <li><strong>Download your admit card</strong> from the portal. For on-demand sessions, DGCA makes it available three days before the exam. Check that your details match your registration.</li>
  </ol>

  <h2>On exam day</h2>
  <ul>
    <li><strong>Arrive early.</strong> Entry opens 60 minutes before your batch starts and closes 30 minutes before. Be in your seat 30 minutes before the start.</li>
    <li><strong>Bring your admit card</strong>, preferably printed in colour, and <strong>one original photo ID</strong>: passport, Aadhaar, Voter ID, BCAS airport entry card, defence ID, or a school or degree certificate with a clear photo, among others listed on the notice.</li>
    <li><strong>Leave electronics at home.</strong> Phones, smartwatches, ordinary watches, wristbands and calculators aren't allowed in the exam room, even switched off, and there's no safe custody at the centre.</li>
    <li><strong>Exception:</strong> a navigation computer and a scientific calculator are allowed for Air Navigation and composite papers. They can't be shared.</li>
  </ul>

  <h2>Exam centres</h2>
  <p>DGCA publishes a venue list for each session, so centres can change. These were the Flight Crew centres for <strong>{{VENUE_SESSION}}</strong>:</p>
{{VENUES}}
  <p>Your admit card gives the exact address of your centre.</p>

  <h2>DGCA exam calendar {{CAL_YEAR}}</h2>
  <p>All CPL/ATPL regular and on-demand sessions, plus FIR/AFIR orals, from DGCA's published {{CAL_YEAR}} calendar. DGCA says the dates are tentative and may change for holidays or festivals. FATA exams are held twice a month.</p>
{{CALENDAR}}

{{CALENDAR_NEXT_YEAR}}

  <h2>Frequently asked questions</h2>

  <p class="faq-q">When is the next DGCA exam?</p>
  <p>{{NEXT_REGULAR}} On-demand (OLODE) sessions run eight times a year. See the table at the top of this page for every upcoming session and its portal window.</p>

  <p class="faq-q">Which is better, the DGCA on-demand exam or the regular exam?</p>
  <p>Neither is easier. Both are the same DGCA papers with the same pass mark. On-demand (OLODE) runs eight times a year and lets you choose your date and slot; regular sessions run four times a year on fixed dates. Choose on timing and convenience.</p>

  <p class="faq-q">I missed the Pariksha portal window. Can I still apply?</p>
  <p>No. DGCA doesn't accept applications after the portal closes. Apply for the next regular or on-demand session instead.</p>

  <p class="faq-q">When will the DGCA 2027 exam calendar be released?</p>
  <p>DGCA hasn't published it yet. It usually appears around the turn of the year, and we'll add it to this page as soon as it's out.</p>

  <p class="faq-q">Where are the DGCA exam centres?</p>
  <p>For on-demand sessions, DGCA has centres in Bengaluru, Bhopal, Chennai, Gurugram, Hyderabad, Kolkata, Lucknow, Mumbai, New Delhi, Noida and Pune. Centres can change from session to session, and your admit card gives the exact address.</p>

  <p class="faq-q">Can I take a calculator into the DGCA exam?</p>
  <p>Only for Air Navigation and composite papers, where a navigation computer and a scientific calculator are allowed. Phones, watches and other electronic devices aren't allowed in any paper.</p>

  <h2>Related</h2>
  <ul class="related">
    <li><a href="/guides/dgca-exam-guides/dgca-exam-results">DGCA exam results: how to check yours, and what to do next</a></li>
    <li><a href="/guides/dgca-exam-guides/dgca-cpl-books">Which books should I study for the DGCA CPL theory exams?</a></li>
    <li><a href="/subjects">All DGCA CPL subjects and practice questions</a></li>
    <li><a href="/dgca-updates">All DGCA updates: exam dates, results and rule changes</a></li>
  </ul>

  <div class="cta-block">
    <h3>Get ready for your next session</h3>
    <p>Practice questions for every DGCA CPL paper, organised by textbook chapter. Free to start.</p>
    <a class="cta-btn" href="/subjects" data-cta="exam-dates-page">Start practising →</a>
  </div>

  <div class="disclaimer">
    <strong>Note:</strong> Dates, portal windows and centres are taken from DGCA's published calendar and notices on the Pariksha portal, and checked weekly. DGCA can change them at short notice: always confirm on <a href="https://pariksha.dgca.gov.in">pariksha.dgca.gov.in</a> before you apply or travel. ProPilotLicence.com is not affiliated with DGCA.
  </div>

`
