import { NextResponse } from "next/server"
import { createAdminClient } from "@/lib/supabase/admin"
import { resend, reviewReminderHtml } from "@/lib/email"

// Vercel Cron calls this endpoint hourly at :15 (e.g. 00:15, 01:15 UTC).
// Nepal is UTC+5:45, so cron at X:15 UTC = (X+6):00 Nepal — each UTC hour
// aligns with exactly one Nepal clock hour, making per-user reminder times work.
// Requires Vercel Pro for hourly execution; on Hobby it fires once daily.
export async function GET(req: Request) {
  const authHeader = req.headers.get("authorization")
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  // Compute current Nepal hour (UTC+5:45). Cron fires at :15 past the hour,
  // which corresponds to the top of the next Nepal hour.
  const now = new Date()
  const nepalOffsetMs = (5 * 60 + 45) * 60 * 1000
  const nepalNow = new Date(now.getTime() + nepalOffsetMs)
  const nepalHour = nepalNow.getUTCHours()

  const supabase = createAdminClient()
  const appUrl =
    process.env.NEXT_PUBLIC_APP_URL ?? "https://web-two-beta-49.vercel.app"
  const today = new Date().toISOString().split("T")[0]

  // Fetch all snippets due today or earlier, with their owner's email preferences.
  const { data: dueRows, error } = await supabase
    .from("snippets")
    .select(
      "user_id, users!inner(email, display_name, email_reminders_enabled, review_reminder_time)"
    )
    .lte("next_review", today)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  if (!dueRows || dueRows.length === 0) {
    return NextResponse.json({ sent: 0, message: "No due snippets today" })
  }

  type UserInfo = { email: string; display_name: string | null; count: number }
  const byUser = new Map<string, UserInfo>()

  for (const row of dueRows) {
    const u = row.users as unknown as {
      email: string
      display_name: string | null
      email_reminders_enabled: boolean | null
      review_reminder_time: string | null
    }

    // Skip users who have opted out of email reminders.
    if (u.email_reminders_enabled === false) continue

    // Only send during the user's preferred Nepal hour.
    // Default to 9 AM Nepal (03:15 UTC) if preference is unset.
    const preferredHour = u.review_reminder_time
      ? parseInt(u.review_reminder_time.split(":")[0] ?? "9", 10)
      : 9
    if (preferredHour !== nepalHour) continue

    const existing = byUser.get(row.user_id)
    if (existing) {
      existing.count++
    } else {
      byUser.set(row.user_id, {
        email: u.email,
        display_name: u.display_name,
        count: 1,
      })
    }
  }

  if (byUser.size === 0) {
    return NextResponse.json({ sent: 0, message: "No eligible users this hour" })
  }

  const results = await Promise.allSettled(
    Array.from(byUser.values()).map(({ email, display_name, count }) =>
      resend.emails.send({
        from: "CodePulse <reminders@codepulse.pritha.me>",
        to: email,
        subject: `${count} snippet${count === 1 ? "" : "s"} due for review today`,
        html: reviewReminderHtml({
          firstName: display_name?.split(" ")[0] ?? "there",
          dueCount: count,
          appUrl,
        }),
      })
    )
  )

  const sent = results.filter((r) => r.status === "fulfilled").length
  const failed = results.filter((r) => r.status === "rejected").length

  return NextResponse.json({ sent, failed, total: byUser.size })
}
