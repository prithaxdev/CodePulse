"use client"

import { useSnippets } from "@/hooks/use-snippets"
import { useReviewLogs } from "@/hooks/use-review"
import { useSupabaseUserId } from "@/hooks/use-user"

export type DashboardStats = {
  totalSnippets: number
  dueToday: number
  reviewStreak: number
  retentionRate: number
}

export function useStats(): { data: DashboardStats | undefined; isLoading: boolean } {
  // useSupabaseUserId drives useReviewLogs (enabled: !!userId).
  // If userId lookup errors (user not yet in Supabase), logs stay disabled —
  // isPending is permanently true for disabled queries in TanStack v5.
  // Tracking isError lets us break out of that stuck state.
  const { isLoading: userIdLoading, isError: userIdError } = useSupabaseUserId()
  const { data: snippets, isPending: snippetsPending } = useSnippets()
  const { data: logs, isPending: logsPending } = useReviewLogs()

  const isLoading = snippetsPending || userIdLoading || (logsPending && !userIdError)

  if (!snippets) return { data: undefined, isLoading }

  // If userId lookup failed, logs will never arrive — treat as empty
  const effectiveLogs = logs ?? []

  const today = new Date().toISOString().split("T")[0]

  const dueToday = snippets.filter((s) => s.next_review <= today).length

  // Retention rate: reviews rated >= 3 out of all reviews (last 30 days)
  const thirtyDaysAgo = new Date()
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
  const recentLogs = effectiveLogs.filter((l) => new Date(l.reviewed_at) >= thirtyDaysAgo)
  const retentionRate =
    recentLogs.length === 0
      ? 0
      : Math.round((recentLogs.filter((l) => l.rating >= 3).length / recentLogs.length) * 100)

  // Review streak: consecutive days with at least one review
  const reviewStreak = computeStreak(effectiveLogs.map((l) => l.reviewed_at))

  return {
    data: {
      totalSnippets: snippets.length,
      dueToday,
      reviewStreak,
      retentionRate,
    },
    isLoading,
  }
}

function computeStreak(reviewedAts: string[]): number {
  if (reviewedAts.length === 0) return 0

  const reviewDays = new Set(reviewedAts.map((d) => d.split("T")[0]))
  const today = new Date()
  let streak = 0
  let current = new Date(today)

  // If no review today, check if yesterday keeps the streak
  if (!reviewDays.has(current.toISOString().split("T")[0])) {
    current.setDate(current.getDate() - 1)
    if (!reviewDays.has(current.toISOString().split("T")[0])) return 0
  }

  while (reviewDays.has(current.toISOString().split("T")[0])) {
    streak++
    current.setDate(current.getDate() - 1)
  }

  return streak
}
