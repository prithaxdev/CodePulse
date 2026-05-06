import { auth } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"
import { createAdminClient } from "@/lib/supabase/admin"
import type { ActivityAction } from "@/types/snippet"

export async function GET() {
  const { userId: clerkId } = await auth()
  if (!clerkId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const supabase = createAdminClient()

  const { data: user, error: userError } = await supabase
    .from("users")
    .select("id")
    .eq("clerk_id", clerkId)
    .single()

  if (userError || !user) return NextResponse.json({ error: "User not found" }, { status: 404 })

  const { data, error } = await supabase
    .from("activity_logs")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(50)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json(data)
}

export async function POST(req: Request) {
  const { userId: clerkId } = await auth()
  if (!clerkId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const supabase = createAdminClient()

  const { data: user, error: userError } = await supabase
    .from("users")
    .select("id")
    .eq("clerk_id", clerkId)
    .single()

  if (userError || !user) return NextResponse.json({ error: "User not found" }, { status: 404 })

  const body = await req.json()
  const { action, entity_id, metadata } = body as {
    action: ActivityAction
    entity_id: string | null
    metadata: Record<string, unknown> | null
  }

  const { error } = await supabase.from("activity_logs").insert({
    user_id: user.id,
    action,
    entity_id: entity_id ?? null,
    metadata: metadata ?? null,
  })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ ok: true }, { status: 201 })
}
