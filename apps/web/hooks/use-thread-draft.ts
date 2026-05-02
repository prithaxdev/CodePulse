"use client"

import { useMutation } from "@tanstack/react-query"
import { api } from "@/lib/api"
import type { ClusterWithSnippets } from "@/hooks/use-clusters"
import type { ThreadPoint } from "@/types/api"

export function useThreadDraft() {
  return useMutation({
    mutationFn: (cluster: ClusterWithSnippets): Promise<ThreadPoint[]> =>
      api.summarize
        .generate({
          snippets: cluster.snippets.map((s) => ({
            id: s.id,
            description: s.description,
          })),
        })
        .then((r) => r.thread_draft),
  })
}
