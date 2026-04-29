import { auth } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"
import { createAdminClient } from "@/lib/supabase/admin"
import { api } from "@/lib/api"

export async function POST(req: Request) {
  const { userId: clerkId } = await auth()
  if (!clerkId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const supabase = createAdminClient()

  const { data: user, error: userError } = await supabase
    .from("users")
    .select("id")
    .eq("clerk_id", clerkId)
    .single()

  if (userError || !user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 })
  }

  const { snippetId, rating, currentEase, currentInterval, currentReps } = await req.json()

  // Call SM-2 algorithm
  const schedule = await api.review.schedule({
    snippet_id: snippetId,
    rating,
    current_ease: currentEase,
    current_interval: currentInterval,
    current_reps: currentReps,
  })

  // Update snippet SM-2 fields
  const { error: snippetError } = await supabase
    .from("snippets")
    .update({
      ease_factor: schedule.ease_factor,
      interval_days: schedule.interval_days,
      repetitions: schedule.repetitions,
      next_review: schedule.next_review,
      updated_at: new Date().toISOString(),
    })
    .eq("id", snippetId)

  if (snippetError) {
    return NextResponse.json({ error: snippetError.message }, { status: 500 })
  }

  // Log the review
  const { error: logError } = await supabase.from("review_logs").insert({
    snippet_id: snippetId,
    user_id: user.id,
    rating,
    ease_factor_after: schedule.ease_factor,
    interval_after: schedule.interval_days,
  })

  if (logError) {
    return NextResponse.json({ error: logError.message }, { status: 500 })
  }

  return NextResponse.json(schedule)
}
