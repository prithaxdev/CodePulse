import { auth } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"
import { createAdminClient } from "@/lib/supabase/admin"

type Params = { params: Promise<{ id: string }> }

async function resolveUser(clerkId: string) {
  const supabase = createAdminClient()
  const { data: user, error } = await supabase
    .from("users")
    .select("id")
    .eq("clerk_id", clerkId)
    .single()
  if (error || !user) return null
  return user.id as string
}

export async function GET(_req: Request, { params }: Params) {
  const { userId: clerkId } = await auth()
  if (!clerkId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { id } = await params
  const supabaseUserId = await resolveUser(clerkId)
  if (!supabaseUserId) return NextResponse.json({ error: "User not found" }, { status: 404 })

  const supabase = createAdminClient()
  const { data, error } = await supabase
    .from("snippets")
    .select("*")
    .eq("id", id)
    .eq("user_id", supabaseUserId)
    .single()

  if (error) return NextResponse.json({ error: "Snippet not found" }, { status: 404 })
  return NextResponse.json(data)
}

export async function PATCH(req: Request, { params }: Params) {
  const { userId: clerkId } = await auth()
  if (!clerkId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { id } = await params
  const supabaseUserId = await resolveUser(clerkId)
  if (!supabaseUserId) return NextResponse.json({ error: "User not found" }, { status: 404 })

  const body = await req.json()
  const allowed = ["title", "description", "code", "language", "tags"]
  const update = Object.fromEntries(
    Object.entries(body).filter(([k]) => allowed.includes(k))
  )

  const supabase = createAdminClient()
  const { data, error } = await supabase
    .from("snippets")
    .update({ ...update, updated_at: new Date().toISOString() })
    .eq("id", id)
    .eq("user_id", supabaseUserId)
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

export async function DELETE(_req: Request, { params }: Params) {
  const { userId: clerkId } = await auth()
  if (!clerkId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { id } = await params
  const supabaseUserId = await resolveUser(clerkId)
  if (!supabaseUserId) return NextResponse.json({ error: "User not found" }, { status: 404 })

  const supabase = createAdminClient()
  const { error } = await supabase
    .from("snippets")
    .delete()
    .eq("id", id)
    .eq("user_id", supabaseUserId)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return new NextResponse(null, { status: 204 })
}
