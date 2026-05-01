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
      // .maybeSingle() returns null (not a 406) when 0 rows match.
      // .single() throws PGRST116 / HTTP 406 for 0 rows — noisy and misleading.
      const { data, error } = await supabase
        .from("users")
        .select("id")
        .eq("clerk_id", clerkId!)
        .maybeSingle()

      if (error) throw error
      if (!data) throw new Error("User record not found — Clerk webhook may not have fired yet")
      return data.id
    },
  })
}
