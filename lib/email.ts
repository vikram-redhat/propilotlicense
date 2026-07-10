import { Resend } from 'resend'

// Lazy singleton — avoids constructing the client (and needing the key) at import time,
// so builds/previews without RESEND_API_KEY don't crash.
let _resend: Resend | null = null
function client(): Resend | null {
  const key = process.env.RESEND_API_KEY
  if (!key) return null
  if (!_resend) _resend = new Resend(key)
  return _resend
}

const FROM = 'ProPilotLicence <noreply@propilotlicence.com>'
const SITE = 'https://propilotlicence.com'

const BRAND = '#185FA5'
const INK = '#0d1117'
const INK_MED = '#4a4f5c'
const SURFACE = '#f7f8fc'
const BORDER = '#e2e4ea'

function welcomeHtml(firstName: string): string {
  const greeting = firstName ? `Hi ${firstName},` : 'Hi there,'
  return `<!doctype html>
<html>
<body style="margin:0;padding:0;background:${SURFACE};font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:${INK};">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${SURFACE};padding:32px 16px;">
    <tr><td align="center">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;background:#ffffff;border:1px solid ${BORDER};border-radius:14px;overflow:hidden;">
        <tr><td style="background:${BRAND};padding:22px 28px;">
          <span style="color:#ffffff;font-size:18px;font-weight:700;letter-spacing:-0.2px;">ProPilotLicence</span>
        </td></tr>
        <tr><td style="padding:28px;">
          <p style="margin:0 0 14px;font-size:16px;line-height:1.6;color:${INK};">${greeting}</p>
          <p style="margin:0 0 14px;font-size:15px;line-height:1.7;color:${INK_MED};">
            Welcome aboard — your account is ready. ProPilotLicence gives you practice questions across every DGCA CPL and ATPL theory subject, organised by book and chapter and verified by active airline captains.
          </p>
          <p style="margin:0 0 18px;font-size:15px;line-height:1.7;color:${INK_MED};">
            To get you started, here are our two guide series — free to read, written and reviewed by the same captain panel:
          </p>

          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 8px;">
            <tr><td style="padding:0 0 12px;">
              <a href="${SITE}/guides/become-a-pilot" style="display:block;border:1px solid ${BORDER};border-radius:10px;padding:16px 18px;text-decoration:none;">
                <span style="display:block;font-size:15px;font-weight:700;color:${BRAND};margin-bottom:4px;">Become a Pilot in India →</span>
                <span style="display:block;font-size:13px;line-height:1.5;color:${INK_MED};">The complete CPL roadmap plus transition guides for cabin crew, AMEs, and ops staff — honest costs, timelines, and medicals.</span>
              </a>
            </td></tr>
            <tr><td style="padding:0 0 20px;">
              <a href="${SITE}/guides/dgca-exam-guides" style="display:block;border:1px solid ${BORDER};border-radius:10px;padding:16px 18px;text-decoration:none;">
                <span style="display:block;font-size:15px;font-weight:700;color:${BRAND};margin-bottom:4px;">DGCA Exam Guides →</span>
                <span style="display:block;font-size:13px;line-height:1.5;color:${INK_MED};">Which books to study, how to prepare subject by subject, and deep-dives like the A320 autoflight system.</span>
              </a>
            </td></tr>
          </table>

          <table role="presentation" cellpadding="0" cellspacing="0" style="margin:4px 0 8px;">
            <tr><td style="background:${BRAND};border-radius:8px;">
              <a href="${SITE}/subjects" style="display:inline-block;padding:12px 26px;font-size:14px;font-weight:700;color:#ffffff;text-decoration:none;">Start practising free →</a>
            </td></tr>
          </table>
        </td></tr>
        <tr><td style="padding:18px 28px;border-top:1px solid ${BORDER};">
          <p style="margin:0;font-size:12px;line-height:1.6;color:#8a8f9c;">
            You're receiving this because you created a ProPilotLicence account. Questions? Just reply to this email.
          </p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`
}

// Best-effort welcome email. Returns true only on a confirmed successful send so the
// caller stamps welcome_email_sent_at only when the email actually went out.
export async function sendWelcomeEmail({ to, name }: { to: string; name: string | null }): Promise<boolean> {
  const resend = client()
  if (!resend) {
    console.warn('[email] RESEND_API_KEY not set — skipping welcome email')
    return false
  }
  const firstName = (name ?? '').trim().split(/\s+/)[0] ?? ''
  const { error } = await resend.emails.send({
    from: FROM,
    to,
    subject: 'Welcome to ProPilotLicence — your DGCA prep starts here',
    html: welcomeHtml(firstName),
  })
  if (error) {
    console.error('[email] welcome send failed:', error)
    return false
  }
  return true
}
