"use client"

import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { useState } from "react"

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            // Data stays fresh for 5 minutes. CodePulse data only changes through
            // explicit user actions (save/review), and every mutation already calls
            // invalidateQueries — so aggressive background polling is unnecessary.
            staleTime: 5 * 60 * 1000,
            // Don't refetch just because the user switched browser tabs.
            // Same reasoning: if nothing mutated, nothing changed.
            refetchOnWindowFocus: false,
          },
        },
      }),
  )

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )
}
