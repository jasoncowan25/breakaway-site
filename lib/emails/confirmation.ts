import type { CampInfo } from "@/lib/camps"

export function buildConfirmationEmail(camp: CampInfo, customerName?: string): string {
  const greeting = customerName ? `Hi ${customerName},` : "Hi there,"

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Booking Confirmed</title>
</head>
<body style="margin:0;padding:0;background-color:#f7f7f7;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f7f7f7;padding:40px 20px;">
    <tr>
      <td align="center">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="background-color:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.06);">

          <!-- Header -->
          <tr>
            <td style="background-color:#0c2340;padding:32px 40px;text-align:center;">
              <h1 style="margin:0;color:#ffffff;font-size:24px;font-weight:700;">Breakaway Pickleball Camps</h1>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:40px;">
              <p style="margin:0 0 20px;font-size:16px;color:#333333;line-height:1.6;">
                ${greeting}
              </p>
              <p style="margin:0 0 24px;font-size:16px;color:#333333;line-height:1.6;">
                Thank you for registering! Your spot is confirmed.
              </p>

              <!-- Camp Details Card -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f0f4f8;border-radius:8px;margin-bottom:24px;">
                <tr>
                  <td style="padding:24px;">
                    <h2 style="margin:0 0 16px;font-size:20px;color:#0c2340;font-weight:700;">${camp.title}</h2>
                    <table role="presentation" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="padding:4px 0;font-size:14px;color:#666666;width:80px;vertical-align:top;">Date</td>
                        <td style="padding:4px 0 4px 12px;font-size:14px;color:#333333;font-weight:600;">${camp.date}</td>
                      </tr>
                      <tr>
                        <td style="padding:4px 0;font-size:14px;color:#666666;width:80px;vertical-align:top;">Venue</td>
                        <td style="padding:4px 0 4px 12px;font-size:14px;color:#333333;font-weight:600;">${camp.venue}</td>
                      </tr>
                      ${camp.location ? `<tr>
                        <td style="padding:4px 0;font-size:14px;color:#666666;width:80px;vertical-align:top;">Location</td>
                        <td style="padding:4px 0 4px 12px;font-size:14px;color:#333333;font-weight:600;">${camp.location}</td>
                      </tr>` : ""}
                      <tr>
                        <td style="padding:4px 0;font-size:14px;color:#666666;width:80px;vertical-align:top;">Coach</td>
                        <td style="padding:4px 0 4px 12px;font-size:14px;color:#333333;font-weight:600;">${camp.coach}</td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <p style="margin:0 0 16px;font-size:14px;color:#555555;line-height:1.6;">
                We'll send you a follow-up email before the camp with your schedule, what to bring, and parking information.
              </p>
              <p style="margin:0;font-size:14px;color:#555555;line-height:1.6;">
                Questions? Reply to this email or reach us at
                <a href="mailto:${camp.contactEmail}" style="color:#0c2340;text-decoration:underline;">${camp.contactEmail}</a>.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:24px 40px;border-top:1px solid #e5e7eb;text-align:center;">
              <p style="margin:0;font-size:12px;color:#999999;">
                Breakaway Pickleball Camps
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`
}
