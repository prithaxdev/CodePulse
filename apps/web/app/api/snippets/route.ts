import { auth } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"
import { createAdminClient } from "@/lib/supabase/admin"

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
    .from("snippets")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json(data)
}

export async function POST(req: Request) {
  const { userId: clerkId } = await auth()
  if (!clerkId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const supabase = createAdminClient()

  // Resolve internal UUID from clerk_id
  const { data: user, error: userError } = await supabase
    .from("users")
    .select("id")
    .eq("clerk_id", clerkId)
    .single()

  if (userError || !user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 })
  }

  const body = await req.json()

  const { data, error } = await supabase
    .from("snippets")
    .insert({ ...body, user_id: user.id })
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data, { status: 201 })
}
