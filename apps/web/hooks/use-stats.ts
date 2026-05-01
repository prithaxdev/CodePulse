"use client"

import { useSnippets } from "@/hooks/use-snippets"
import { useReviewLogs } from "@/hooks/use-review"
import { toLocalDateStr } from "@/lib/utils"

export type DashboardStats = {
  totalSnippets: number
  dueToday: number
  reviewStreak: number
  retentionRate: number
}

export function useStats(): { data: DashboardStats | undefined } {
  const { data: snippets } = useSnippets()
  const { data: logs } = useReviewLogs()

  // data===undefined means snippets haven't hit the cache yet.
  // StatsCards checks data===undefined to decide whether to skeleton —
  // so any other loading state is irrelevant here.
  if (!snippets) return { data: undefined }

  // logs may be undefined if userId lookup is still resolving — treat as empty.
  const effectiveLogs = logs ?? []

  const today = new Date().toISOString().split("T")[0]

  const dueToday = snippets.filter((s) => s.next_review <= today).length

  // Retention rate: reviews rated >= 3 out of all reviews (last 30 days)
  const thirtyDaysAgo = new Date()
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
  const recentLogs = effectiveLogs.filter(
    (l) => new Date(l.reviewed_at) >= thirtyDaysAgo
  )
  const retentionRate =
    recentLogs.length === 0
      ? 0
      : Math.round(
          (recentLogs.filter((l) => l.rating >= 3).length / recentLogs.length) *
            100
        )

  // Review streak: consecutive days with at least one review
  const reviewStreak = computeStreak(effectiveLogs.map((l) => l.reviewed_at))

  return {
    data: {
      totalSnippets: snippets.length,
      dueToday,
      reviewStreak,
      retentionRate,
    },
  }
}

function computeStreak(reviewedAts: string[]): number {
  if (reviewedAts.length === 0) return 0

  // Use local dates so streak matches what the heatmap displays
  const reviewDays = new Set(
    reviewedAts.map((d) => toLocalDateStr(new Date(d)))
  )
  const today = new Date()
  let streak = 0
  const current = new Date(today)

  if (!reviewDays.has(toLocalDateStr(current))) {
    current.setDate(current.getDate() - 1)
    if (!reviewDays.has(toLocalDateStr(current))) return 0
  }

  while (reviewDays.has(toLocalDateStr(current))) {
    streak++
    current.setDate(current.getDate() - 1)
  }

  return streak
}
