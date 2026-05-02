import { auth } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"
import { createAdminClient } from "@/lib/supabase/admin"

export async function POST(req: Request) {
  const { userId: clerkId } = await auth()
  if (!clerkId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { preferred_languages } = await req.json()

  const supabase = createAdminClient()

  const { error } = await supabase
    .from("users")
    .update({ preferred_languages })
    .eq("clerk_id", clerkId)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ ok: true })
}
