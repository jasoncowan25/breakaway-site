import { FROM_ADDRESS, REPLY_TO, getResend } from "./resend"

export interface CampInterestConfirmationInput {
  to: string
  firstName: string
  campName?: string
}

function firstNameOf(fullName: string): string {
  const trimmed = fullName.trim()
  if (!trimmed) return "there"
  return trimmed.split(/\s+/)[0]
}

function buildHtml(firstName: string, campName: string): string {
  return `<!doctype html>
<html>
  <body style="margin:0;padding:0;background:#f6f7f9;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:#111;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="padding:32px 16px;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#ffffff;border-radius:12px;padding:32px;line-height:1.55;font-size:16px;">
            <tr><td>
              <p style="margin:0 0 16px;">Hi ${firstName},</p>
              <p style="margin:0 0 16px;">Thanks for registering your interest in ${campName}.</p>
              <p style="margin:0 0 16px;">We've received your details and room preference. Our team will review everything and follow up shortly with the next steps, including deposit and payment details.</p>
              <p style="margin:0 0 16px;">If you have any questions in the meantime, just reply to this email.</p>
              <p style="margin:24px 0 0;">Thanks,<br/>Breakaway Pickleball</p>
            </td></tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`
}

function buildText(firstName: string, campName: string): string {
  return [
    `Hi ${firstName},`,
    "",
    `Thanks for registering your interest in ${campName}.`,
    "",
    "We've received your details and room preference. Our team will review everything and follow up shortly with the next steps, including deposit and payment details.",
    "",
    "If you have any questions in the meantime, just reply to this email.",
    "",
    "Thanks,",
    "Breakaway Pickleball",
  ].join("\n")
}

export async function sendCampInterestConfirmation({
  to,
  firstName,
  campName = "Breakaway Pickleball Camps",
}: CampInterestConfirmationInput): Promise<{ ok: boolean; error?: string }> {
  const resend = getResend()
  if (!resend) {
    return { ok: false, error: "RESEND_API_KEY not configured" }
  }

  const name = firstNameOf(firstName)
  const subject = `We received your ${campName} interest`

  const { error } = await resend.emails.send({
    from: FROM_ADDRESS,
    to,
    replyTo: REPLY_TO,
    subject,
    html: buildHtml(name, campName),
    text: buildText(name, campName),
  })

  if (error) return { ok: false, error: error.message }
  return { ok: true }
}
