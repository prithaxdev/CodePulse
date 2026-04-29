"use client"

import { useQuery } from "@tanstack/react-query"
import { useAuth } from "@clerk/nextjs"
import { createClient } from "@/lib/supabase/client"

/** Resolves the internal Supabase UUID for the current Clerk user.
 *  Cached with staleTime: Infinity — the UUID never changes. */
export function useSupabaseUserId() {
  const { userId: clerkId } = useAuth()
  const supabase = createClient()

  return useQuery({
    queryKey: ["supabase-user-id", clerkId],
    enabled: !!clerkId,
    staleTime: Infinity,
    queryFn: async (): Promise<string> => {
      const { data, error } = await supabase
        .from("users")
        .select("id")
        .eq("clerk_id", clerkId!)
        .single()

      if (error) throw error
      return data.id
    },
  })
}
