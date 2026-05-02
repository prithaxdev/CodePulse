import { NextResponse } from "next/server"
import { createAdminClient } from "@/lib/supabase/admin"
import { resend, reviewReminderHtml } from "@/lib/email"

// Vercel Cron calls this endpoint daily at 09:00 Nepal time (03:15 UTC).
// It is secured by the CRON_SECRET env var that Vercel sets automatically —
// the same secret is forwarded as `Authorization: Bearer <secret>` in the
// cron request headers.
export async function GET(req: Request) {
  const authHeader = req.headers.get("authorization")
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const supabase = createAdminClient()
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://web-two-beta-49.vercel.app"
  const today = new Date().toISOString().split("T")[0]

  // Fetch all snippets due today or earlier, joined with their owner's profile.
  const { data: dueRows, error } = await supabase
    .from("snippets")
    .select("user_id, users!inner(email, display_name)")
    .lte("next_review", today)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  if (!dueRows || dueRows.length === 0) {
    return NextResponse.json({ sent: 0, message: "No due snippets today" })
  }

  // Group by user so each person gets one email with their total count.
  type UserInfo = { email: string; display_name: string | null; count: number }
  const byUser = new Map<string, UserInfo>()

  for (const row of dueRows) {
    const u = row.users as { email: string; display_name: string | null }
    const existing = byUser.get(row.user_id)
    if (existing) {
      existing.count++
    } else {
      byUser.set(row.user_id, { email: u.email, display_name: u.display_name, count: 1 })
    }
  }

  // Send one email per user, collect results.
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
