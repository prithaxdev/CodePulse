import { Resend } from "resend"

export const resend = new Resend(process.env.RESEND_API_KEY)

export function reviewReminderHtml({
  firstName,
  dueCount,
  appUrl,
}: {
  firstName: string
  dueCount: number
  appUrl: string
}): string {
  const snippetWord = dueCount === 1 ? "snippet" : "snippets"
  const reviewUrl = `${appUrl}/review`

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Your CodePulse review is ready</title>
</head>
<body style="margin:0;padding:0;background:#09090b;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#09090b;padding:40px 16px;">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;">

          <!-- Logo -->
          <tr>
            <td style="padding-bottom:32px;">
              <table cellpadding="0" cellspacing="0">
                <tr>
                  <td style="width:36px;height:36px;vertical-align:middle;">
                    <img src="${appUrl}/codepulse-icon.svg" width="36" height="36" alt="CodePulse" style="display:block;border-radius:10px;" />
                  </td>
                  <td style="padding-left:10px;font-size:17px;font-weight:600;color:#fafafa;letter-spacing:-0.3px;">
                    CodePulse
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Card -->
          <tr>
            <td style="background:#18181b;border:1px solid #27272a;border-radius:16px;padding:36px 32px;">

              <!-- Heading -->
              <p style="margin:0 0 8px;font-size:22px;font-weight:700;color:#fafafa;letter-spacing:-0.4px;">
                Time to review, ${firstName} 👋
              </p>
              <p style="margin:0 0 28px;font-size:15px;color:#a1a1aa;line-height:1.6;">
                You have <strong style="color:#fafafa;">${dueCount} ${snippetWord}</strong> due for review today.
                Keeping up your streak locks in the concepts before they fade.
              </p>

              <!-- CTA -->
              <table cellpadding="0" cellspacing="0">
                <tr>
                  <td style="background:#10b981;border-radius:10px;">
                    <a href="${reviewUrl}"
                       style="display:inline-block;padding:13px 28px;font-size:15px;font-weight:600;color:#09090b;text-decoration:none;letter-spacing:-0.1px;">
                      Review now
                    </a>
                  </td>
                </tr>
              </table>

              <!-- Divider -->
              <hr style="border:none;border-top:1px solid #27272a;margin:28px 0;" />

              <!-- Footer note -->
              <p style="margin:0;font-size:12px;color:#52525b;line-height:1.6;">
                CodePulse uses the SM-2 spaced repetition algorithm to schedule reviews at
                the optimal moment — right before you&rsquo;d forget.
                <br />
                Manage your reminder time in
                <a href="${appUrl}/settings" style="color:#10b981;text-decoration:none;">Settings</a>.
              </p>

            </td>
          </tr>

          <!-- Bottom -->
          <tr>
            <td style="padding-top:20px;text-align:center;font-size:11px;color:#3f3f46;">
              CodePulse &mdash; spaced repetition for developers
              &nbsp;&middot;&nbsp;
              <a href="${appUrl}/settings" style="color:#3f3f46;">Unsubscribe</a>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`
}
