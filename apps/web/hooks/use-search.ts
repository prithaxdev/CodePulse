"use client"

import { useQuery } from "@tanstack/react-query"
import { api } from "@/lib/api"
import type { Snippet } from "@/types/snippet"
import type { SearchResult } from "@/types/api"

type RankedSnippet = SearchResult & { snippet: Snippet }

export function useSearch(query: string, snippets: Snippet[]) {
  return useQuery({
    queryKey: ["search", query, snippets.length],
    enabled: query.trim().length >= 2 && snippets.length > 0,
    staleTime: 30_000,
    queryFn: async (): Promise<RankedSnippet[]> => {
      const response = await api.search.query({
        query,
        snippets: snippets.map((s) => ({
          id: s.id,
          title: s.title,
          code: s.code,
          description: s.description,
          tags: s.tags,
        })),
      })

      const snippetMap = new Map(snippets.map((s) => [s.id, s]))

      return response.results
        .filter((r) => r.similarity_score > 0.05)
        .map((r) => ({ ...r, snippet: snippetMap.get(r.snippet_id)! }))
        .filter((r) => r.snippet != null)
    },
  })
}
