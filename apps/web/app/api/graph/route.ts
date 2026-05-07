import { auth } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"
import { createAdminClient } from "@/lib/supabase/admin"
import { api } from "@/lib/api"

export async function POST() {
  const { userId: clerkId } = await auth()
  if (!clerkId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const supabase = createAdminClient()

  const { data: user } = await supabase
    .from("users")
    .select("id")
    .eq("clerk_id", clerkId)
    .single()

  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 })

  const { data: snippets } = await supabase
    .from("snippets")
    .select("id, title, code, description, tags, created_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: true })

  if (!snippets || snippets.length < 2) {
    return NextResponse.json({ edges: [], count: 0 })
  }

  const { edges } = await api.graph.build({
    snippets: snippets.map((s) => ({
      id: s.id,
      title: s.title ?? "",
      code: s.code ?? "",
      description: s.description ?? "",
      tags: s.tags ?? [],
      created_at: s.created_at,
    })),
  })

  // Delete old edges for this user, then insert the fresh set
  await supabase.from("snippet_dependencies").delete().eq("user_id", user.id)

  if (edges.length > 0) {
    const { error } = await supabase.from("snippet_dependencies").insert(
      edges.map((e) => ({
        from_id: e.from_id,
        to_id: e.to_id,
        user_id: user.id,
        confidence: e.confidence,
      }))
    )
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ edges, count: edges.length })
}
