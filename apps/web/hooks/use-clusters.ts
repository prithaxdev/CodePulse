"use client"

import { useQuery } from "@tanstack/react-query"
import { api } from "@/lib/api"
import type { Snippet } from "@/types/snippet"
import type { Cluster } from "@/types/api"

export type ClusterWithSnippets = Cluster & { snippets: Snippet[] }

export function useClusters(snippets: Snippet[]) {
  return useQuery({
    queryKey: ["clusters", snippets.map((s) => s.id).join(",")],
    enabled: snippets.length >= 3,
    staleTime: 5 * 60_000,
    queryFn: async (): Promise<ClusterWithSnippets[]> => {
      const response = await api.clusters.get({
        snippets: snippets.map((s) => ({
          id: s.id,
          title: s.title,
          code: s.code,
          description: s.description,
          tags: s.tags,
        })),
      })

      const snippetMap = new Map(snippets.map((s) => [s.id, s]))

      return response.clusters.map((cluster) => ({
        ...cluster,
        snippets: cluster.snippet_ids
          .map((id) => snippetMap.get(id))
          .filter((s): s is Snippet => s != null),
      }))
    },
  })
}
