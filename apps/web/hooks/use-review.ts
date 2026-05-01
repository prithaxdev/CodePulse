"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { useAuth } from "@clerk/nextjs"
import { snippetKeys } from "@/hooks/use-snippets"
import type { ReviewLog } from "@/types/snippet"

export const reviewKeys = {
  logs: (clerkId: string) => ["review-logs", clerkId] as const,
}

export function useReviewLogs() {
  const { userId: clerkId } = useAuth()

  return useQuery({
    queryKey: reviewKeys.logs(clerkId ?? ""),
    enabled: !!clerkId,
    queryFn: async (): Promise<ReviewLog[]> => {
      const res = await fetch("/api/review-logs")
      if (!res.ok) {
        const { error } = await res.json()
        throw new Error(error ?? "Failed to fetch review logs")
      }
      return res.json()
    },
  })
}

export function useSubmitReview() {
  const { userId: clerkId } = useAuth()
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

    onMutate: async (variables) => {
      // Cancel in-flight fetches so they don't overwrite the optimistic entry
      await queryClient.cancelQueries({ queryKey: reviewKeys.logs(clerkId ?? "") })

      // Snapshot for rollback
      const previousLogs = queryClient.getQueryData<ReviewLog[]>(reviewKeys.logs(clerkId ?? ""))

      const newEntry: ReviewLog = {
        id: crypto.randomUUID(),
        snippet_id: variables.snippetId,
        user_id: "",
        rating: variables.rating,
        ease_factor_after: 0,
        interval_after: 0,
        reviewed_at: new Date().toISOString(),
      }

      // Seed the cache even when empty (cold-start: old may be undefined)
      queryClient.setQueryData<ReviewLog[]>(
        reviewKeys.logs(clerkId ?? ""),
        (old) => (old ? [newEntry, ...old] : [newEntry]),
      )

      return { previousLogs }
    },

    onError: (_err, _variables, context) => {
      // Restore the pre-mutation snapshot
      if (context?.previousLogs !== undefined) {
        queryClient.setQueryData(reviewKeys.logs(clerkId ?? ""), context.previousLogs)
      } else {
        // Cache was empty before the optimistic write — remove the ghost entry
        queryClient.removeQueries({ queryKey: reviewKeys.logs(clerkId ?? "") })
      }
    },

    onSettled: () => {
      // Always sync with server — runs on both success and error
      queryClient.invalidateQueries({ queryKey: snippetKeys.all(clerkId ?? "") })
      queryClient.invalidateQueries({ queryKey: snippetKeys.due(clerkId ?? "") })
      queryClient.invalidateQueries({ queryKey: reviewKeys.logs(clerkId ?? "") })
    },
  })
}
