"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { useAuth } from "@clerk/nextjs"
import { createClient } from "@/lib/supabase/client"
import { api } from "@/lib/api"
import { snippetKeys } from "@/hooks/use-snippets"
import type { ReviewLog, ReviewLogInsert } from "@/types/snippet"

export const reviewKeys = {
  logs: (userId: string) => ["review-logs", userId] as const,
}

export function useReviewLogs() {
  const { userId } = useAuth()
  const supabase = createClient()

  return useQuery({
    queryKey: reviewKeys.logs(userId ?? ""),
    enabled: !!userId,
    queryFn: async (): Promise<ReviewLog[]> => {
      const { data, error } = await supabase
        .from("review_logs")
        .select("*")
        .eq("user_id", userId!)
        .order("reviewed_at", { ascending: false })
        .limit(500)

      if (error) throw error
      return data
    },
  })
}

export function useSubmitReview() {
  const { userId } = useAuth()
  const queryClient = useQueryClient()
  const supabase = createClient()

  return useMutation({
    mutationFn: async ({
      snippetId,
      rating,
      currentEase,
      currentInterval,
      currentReps,
    }: {
      snippetId: string
      rating: number
      currentEase: number
      currentInterval: number
      currentReps: number
    }): Promise<void> => {
      // Call SM-2 algorithm via FastAPI
      const schedule = await api.review.schedule({
        snippet_id: snippetId,
        rating,
        current_ease: currentEase,
        current_interval: currentInterval,
        current_reps: currentReps,
      })

      // Update snippet SM-2 state in Supabase
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

      if (snippetError) throw snippetError

      // Log the review event
      const log: ReviewLogInsert = {
        snippet_id: snippetId,
        user_id: userId!,
        rating,
        ease_factor_after: schedule.ease_factor,
        interval_after: schedule.interval_days,
      }

      const { error: logError } = await supabase.from("review_logs").insert(log)
      if (logError) throw logError
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: snippetKeys.due(userId ?? "") })
      queryClient.invalidateQueries({ queryKey: reviewKeys.logs(userId ?? "") })
    },
  })
}
