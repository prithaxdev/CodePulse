"use client"

import { useMutation } from "@tanstack/react-query"

export function useBuildGraph() {
  return useMutation({
    mutationFn: async () => {
      const res = await fetch("/api/graph", { method: "POST" })
      if (!res.ok) {
        const body = await res.json().catch(() => ({ error: "Graph build failed" }))
        throw new Error(body.error ?? "Graph build failed")
      }
      return res.json() as Promise<{ edges: unknown[]; count: number }>
    },
  })
}
