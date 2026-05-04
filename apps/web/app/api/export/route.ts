import { auth } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"
import { createAdminClient } from "@/lib/supabase/admin"

export async function GET() {
  const { userId: clerkId } = await auth()
  if (!clerkId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const supabase = createAdminClient()

  const { data: user, error: userError } = await supabase
    .from("users")
    .select("id, email, display_name, preferred_languages, created_at")
    .eq("clerk_id", clerkId)
    .single()

  if (userError || !user) return NextResponse.json({ error: "User not found" }, { status: 404 })

  const [{ data: snippets }, { data: reviewLogs }] = await Promise.all([
    supabase
      .from("snippets")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: true }),
    supabase
      .from("review_logs")
      .select("*")
      .eq("user_id", user.id)
      .order("reviewed_at", { ascending: true }),
  ])

  const exportData = {
    exported_at: new Date().toISOString(),
    user: {
      email: user.email,
      display_name: user.display_name,
      preferred_languages: user.preferred_languages,
      member_since: user.created_at,
    },
    snippets: snippets ?? [],
    review_logs: reviewLogs ?? [],
  }

  return new NextResponse(JSON.stringify(exportData, null, 2), {
    headers: {
      "Content-Type": "application/json",
      "Content-Disposition": `attachment; filename="codepulse-export-${new Date().toISOString().split("T")[0]}.json"`,
    },
  })
}
