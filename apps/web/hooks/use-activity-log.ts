"use client"

import { useQuery } from "@tanstack/react-query"
import { useAuth } from "@clerk/nextjs"
import type { ActivityLog } from "@/types/snippet"

export const activityKeys = {
  feed: (clerkId: string) => ["activity-log", clerkId] as const,
}

export function useActivityLog(limit = 15) {
  const { userId: clerkId } = useAuth()

  return useQuery({
    queryKey: activityKeys.feed(clerkId ?? ""),
    enabled: !!clerkId,
    staleTime: 0,
    refetchOnWindowFocus: true,
    queryFn: async (): Promise<ActivityLog[]> => {
      const res = await fetch("/api/activity")
      if (!res.ok) {
        const { error } = await res.json()
        throw new Error(error ?? "Failed to fetch activity")
      }
      const data: ActivityLog[] = await res.json()
      return data.slice(0, limit)
    },
  })
}
