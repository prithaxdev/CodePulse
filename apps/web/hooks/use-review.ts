"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { useAuth } from "@clerk/nextjs"
import { createClient } from "@/lib/supabase/client"
import { snippetKeys } from "@/hooks/use-snippets"
import { useSupabaseUserId } from "@/hooks/use-user"
import type { ReviewLog } from "@/types/snippet"

export const reviewKeys = {
  logs: (userId: string) => ["review-logs", userId] as const,
}

export function useReviewLogs() {
  const { data: userId } = useSupabaseUserId()
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
  // clerkId must match the key used by useDueSnippets — they both use snippetKeys.due(clerkId)
  const { userId: clerkId } = useAuth()
  const { data: supabaseUserId } = useSupabaseUserId()
  const queryClient = useQueryClient()

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
      const res = await fetch("/api/review", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ snippetId, rating, currentEase, currentInterval, currentReps }),
      })
      if (!res.ok) {
        const { error } = await res.json()
        throw new Error(error ?? "Failed to submit review")
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: snippetKeys.due(clerkId ?? "") })
      if (supabaseUserId) {
        queryClient.invalidateQueries({ queryKey: reviewKeys.logs(supabaseUserId) })
      }
    },
  })
}
