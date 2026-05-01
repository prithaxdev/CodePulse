"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { useAuth } from "@clerk/nextjs"
import { createClient } from "@/lib/supabase/client"
import { snippetKeys } from "@/hooks/use-snippets"
import type { ReviewLog } from "@/types/snippet"

export const reviewKeys = {
  // Keyed on Clerk ID so the cache hit is immediate when Clerk hydrates —
  // no need to wait for the supabase UUID lookup chain to complete.
  logs: (clerkId: string) => ["review-logs", clerkId] as const,
}

export function useReviewLogs() {
  const { userId: clerkId } = useAuth()
  const supabase = createClient()

  return useQuery({
    // Only depends on clerkId — available immediately from Clerk's cookie.
    // The supabase UUID lookup is inlined in queryFn and only runs on actual
    // network fetches (first load / post-invalidation), not on cache hits.
    queryKey: reviewKeys.logs(clerkId ?? ""),
    enabled: !!clerkId,
    queryFn: async (): Promise<ReviewLog[]> => {
      const { data: user, error: userError } = await supabase
        .from("users")
        .select("id")
        .eq("clerk_id", clerkId!)
        .maybeSingle()

      if (userError) throw userError
      if (!user) return []

      const { data, error } = await supabase
        .from("review_logs")
        .select("*")
        .eq("user_id", user.id)
        .order("reviewed_at", { ascending: false })
        .limit(500)

      if (error) throw error
      return data ?? []
    },
  })
}

export function useSubmitReview() {
  // clerkId must match the key used by useDueSnippets — they both use snippetKeys.due(clerkId)
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
    onSuccess: (_data, variables) => {
      // Immediately write the new log into the cache so the heatmap reflects
      // the review the moment the user navigates to dashboard — no waiting for
      // a background refetch. The invalidation below then syncs server truth.
      queryClient.setQueryData<ReviewLog[]>(
        reviewKeys.logs(clerkId ?? ""),
        (old) => {
          if (!old) return old
          return [
            {
              id: crypto.randomUUID(),
              snippet_id: variables.snippetId,
              user_id: "",
              rating: variables.rating,
              ease_factor_after: 0,
              interval_after: 0,
              reviewed_at: new Date().toISOString(),
            },
            ...old,
          ]
        },
      )
      queryClient.invalidateQueries({ queryKey: snippetKeys.due(clerkId ?? "") })
      queryClient.invalidateQueries({ queryKey: reviewKeys.logs(clerkId ?? "") })
    },
  })
}
