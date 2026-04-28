"use client"

import { useSnippets } from "@/hooks/use-snippets"
import { useReviewLogs } from "@/hooks/use-review"

export type DashboardStats = {
  totalSnippets: number
  dueToday: number
  reviewStreak: number
  retentionRate: number
}

export function useStats(): { data: DashboardStats | undefined; isLoading: boolean } {
  const { data: snippets, isLoading: snippetsLoading } = useSnippets()
  const { data: logs, isLoading: logsLoading } = useReviewLogs()

  const isLoading = snippetsLoading || logsLoading

  if (!snippets || !logs) return { data: undefined, isLoading }

  const today = new Date().toISOString().split("T")[0]

  const dueToday = snippets.filter((s) => s.next_review <= today).length

  // Retention rate: reviews rated >= 3 out of all reviews (last 30 days)
  const thirtyDaysAgo = new Date()
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
  const recentLogs = logs.filter((l) => new Date(l.reviewed_at) >= thirtyDaysAgo)
  const retentionRate =
    recentLogs.length === 0
      ? 0
      : Math.round((recentLogs.filter((l) => l.rating >= 3).length / recentLogs.length) * 100)

  // Review streak: consecutive days with at least one review
  const reviewStreak = computeStreak(logs.map((l) => l.reviewed_at))

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
