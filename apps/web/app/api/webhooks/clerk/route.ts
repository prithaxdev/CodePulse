import { headers } from "next/headers"
import { Webhook } from "svix"
import type { WebhookEvent } from "@clerk/nextjs/server"
import { createAdminClient } from "@/lib/supabase/admin"

export async function POST(request: Request) {
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET

  if (!WEBHOOK_SECRET) {
    return new Response("Missing CLERK_WEBHOOK_SECRET", { status: 500 })
  }

  const headerPayload = await headers()
  const svixId = headerPayload.get("svix-id")
  const svixTimestamp = headerPayload.get("svix-timestamp")
  const svixSignature = headerPayload.get("svix-signature")

  if (!svixId || !svixTimestamp || !svixSignature) {
    return new Response("Missing svix headers", { status: 400 })
  }

  const payload = await request.json()
  const body = JSON.stringify(payload)

  const wh = new Webhook(WEBHOOK_SECRET)
  let event: WebhookEvent

  try {
    event = wh.verify(body, {
      "svix-id": svixId,
      "svix-timestamp": svixTimestamp,
      "svix-signature": svixSignature,
    }) as WebhookEvent
  } catch {
    return new Response("Invalid webhook signature", { status: 400 })
  }

  const supabase = createAdminClient()

  if (event.type === "user.created") {
    const { id, email_addresses, first_name, last_name } = event.data
    const email = email_addresses[0]?.email_address ?? ""
    const displayName = [first_name, last_name].filter(Boolean).join(" ") || null

    const { error } = await supabase.from("users").insert({
      clerk_id: id,
      email,
      display_name: displayName,
    })

    if (error) {
      console.error("Failed to sync user to Supabase:", error)
      return new Response("Database error", { status: 500 })
    }
  }

  if (event.type === "user.updated") {
    const { id, email_addresses, first_name, last_name } = event.data
    const email = email_addresses[0]?.email_address ?? ""
    const displayName = [first_name, last_name].filter(Boolean).join(" ") || null

    const { error } = await supabase
      .from("users")
      .update({ email, display_name: displayName, updated_at: new Date().toISOString() })
      .eq("clerk_id", id)

    if (error) {
      console.error("Failed to update user in Supabase:", error)
      return new Response("Database error", { status: 500 })
    }
  }

  if (event.type === "user.deleted") {
    const { id } = event.data
    if (!id) return new Response("Missing user id", { status: 400 })

    const { error } = await supabase.from("users").delete().eq("clerk_id", id)

    if (error) {
      console.error("Failed to delete user from Supabase:", error)
      return new Response("Database error", { status: 500 })
    }
  }

  return new Response(null, { status: 200 })
}
