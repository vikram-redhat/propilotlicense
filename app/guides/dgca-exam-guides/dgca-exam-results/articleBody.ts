// DGCA exam results guide: the inner HTML of <main class="article-wrap"> from the editorial
// source (dgca-exam-results.html), verbatim except for the data-driven parts, filled by
// page.tsx:
// - {{LAST_CHECKED}}, {{LATEST_RESULTS}}, {{AWAITING_RESULTS}}: from
//   lib/data/dgca-exam-sessions.json (lib/dgca-exams.ts), in place of the source's mock-ups;
// - {{SUBJECT_LINKS}}: one link per CPL subject with its live question count (the /subjects counts).
// Real hrefs on the exam dates link, the Related links and the CTA. The CTA and the subject
// links are tracked as data-cta="results-page". The source's comment about the resit
// waiting period is left out: the figure waits for Captain Panel confirmation.
// The editorial content goes to the Captain Panel for review: don't edit it here.
export const ARTICLE_HTML = String.raw`
  <div class="eyebrow">DGCA Exam Guides · Exams</div>
  <h1>DGCA Exam Results: Latest Sessions, How to Check Yours, and What to Do Next</h1>

  <p class="standfirst">The latest DGCA pilot exam results, with links to DGCA's own result notices, how to check your result on the Pariksha portal, and what to do if you didn't pass a paper.</p>

  <div class="byline">
    <strong>ProPilotLicence Editorial</strong>
    <span class="byline-dot">·</span>
    <span>Reviewed by the ProPilotLicence Captain Panel</span>
    <span class="byline-dot">·</span>
    <span>Last checked against DGCA: {{LAST_CHECKED}}</span>
  </div>

  <h2 class="first">Latest DGCA results</h2>
{{LATEST_RESULTS}}
  <p>Links go to DGCA's own notices on the Pariksha portal. A notice tells you a session's results are out; your own result is in your Pariksha login. We check for new results every week.</p>

{{AWAITING_RESULTS}}

  <h2>How DGCA publishes results</h2>
  <p>When a session's results are ready, DGCA posts a public notice on the Pariksha portal's <strong>Notice Board – Pilot</strong> announcing that they've been declared. The notice doesn't list candidates: DGCA's notices say results are not published separately, and each candidate checks their own result through their <strong>Pariksha portal login</strong>.</p>

  <h2>How to check your result</h2>
  <ol>
    <li>Go to <a href="https://pariksha.dgca.gov.in">pariksha.dgca.gov.in</a>.</li>
    <li>Check the <strong>Notice Board – Pilot</strong> (or the table above) to see whether your session's results have been declared.</li>
    <li>Log in with your DGCA Computer Number and password.</li>
    <li>Your result for each paper is in your candidate account.</li>
  </ol>

  <div class="callout blue">
    <strong>The pass mark is 70%</strong> in each paper.
  </div>

  <h2>If you didn't pass a paper</h2>
  <ul>
    <li><strong>Plan the resit.</strong> Look at the next sessions on our <a href="/guides/dgca-exam-guides/dgca-exam-dates">DGCA exam dates page</a>. On-demand (OLODE) sessions run eight times a year, so they're often the quickest way back in. DGCA sets a minimum waiting period before you can resit a failed paper; check the current rule in the session notice before you book.</li>
    <li><strong>Find out where you lost marks.</strong> Go back to the topics you were unsure of in the exam, not just the whole subject.</li>
    <li><strong>Practise that subject by chapter.</strong> Short sessions on your weakest chapters move your score faster than another full read of the book.</li>
  </ul>

  <h3>Practise the paper you need to resit</h3>
{{SUBJECT_LINKS}}

  <h2>Frequently asked questions</h2>

  <p class="faq-q">How do I check my DGCA exam result?</p>
  <p>Log in to the Pariksha portal, pariksha.dgca.gov.in, with your DGCA Computer Number. Your result for each paper is in your candidate account. DGCA announces that a session's results are out with a notice on the Notice Board – Pilot, but doesn't publish a list of candidates.</p>

  <p class="faq-q">What is the pass mark in DGCA exams?</p>
  <p>70% in each paper.</p>

  <p class="faq-q">Where can I find the latest DGCA result?</p>
  <p>The table at the top of this page lists the latest pilot exam sessions whose results DGCA has declared, with links to DGCA's own notices. We check DGCA's notice board every week.</p>

  <p class="faq-q">I failed a DGCA paper. When can I sit it again?</p>
  <p>After DGCA's minimum waiting period for a failed paper, in the next regular or on-demand session you can book. Check the current waiting period in the session notice, and see our exam dates page for upcoming sessions.</p>

  <h2>Related</h2>
  <ul class="related">
    <li><a href="/guides/dgca-exam-guides/dgca-exam-dates">DGCA exam dates: next sessions, portal windows and centres</a></li>
    <li><a href="/subjects">All DGCA CPL subjects and practice questions</a></li>
    <li><a href="/guides/dgca-exam-guides/dgca-cpl-books">Which books should I study for the DGCA CPL theory exams?</a></li>
  </ul>

  <div class="cta-block">
    <h3>Get ready for the resit</h3>
    <p>Practise the subject you need by chapter, with explanations and textbook citations. Free to start.</p>
    <a class="cta-btn" href="/subjects" data-cta="results-page">Start practising →</a>
  </div>

  <div class="disclaimer">
    <strong>Note:</strong> DGCA declares results on the Pariksha portal and candidates see them in their own login; we link to DGCA's notices and don't host results. Always confirm your result on <a href="https://pariksha.dgca.gov.in">pariksha.dgca.gov.in</a>. ProPilotLicence.com is not affiliated with DGCA.
  </div>

`
