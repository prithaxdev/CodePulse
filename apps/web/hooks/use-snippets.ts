"use client"

import { useAuth } from "@clerk/nextjs"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { createClient } from "@/lib/supabase/client"
import { logActivity } from "@/lib/activity"
import type { Snippet, SnippetInsert, SnippetUpdate } from "@/types/snippet"

export const snippetKeys = {
  all: (clerkId: string) => ["snippets", clerkId] as const,
  due: (clerkId: string) => ["snippets", clerkId, "due"] as const,
  detail: (id: string) => ["snippets", "detail", id] as const,
}

export function useSnippets() {
  const { userId: clerkId } = useAuth()

  return useQuery({
    queryKey: snippetKeys.all(clerkId ?? ""),
    enabled: !!clerkId,
    queryFn: async (): Promise<Snippet[]> => {
      const res = await fetch("/api/snippets")
      if (!res.ok) {
        const { error } = await res.json()
        throw new Error(error ?? "Failed to fetch snippets")
      }
      return res.json()
    },
  })
}

export function useDueSnippets() {
  // Gate on Clerk ID — available instantly from the client-side JWT.
  // The server route handles its own auth; we don't need the Supabase UUID here.
  const { userId: clerkId } = useAuth()

  return useQuery({
    queryKey: snippetKeys.due(clerkId ?? ""),
    enabled: !!clerkId,
    queryFn: async (): Promise<Snippet[]> => {
      const res = await fetch("/api/snippets/due")
      if (!res.ok) {
        const { error } = await res.json()
        throw new Error(error ?? "Failed to fetch due snippets")
      }
      return res.json()
    },
  })
}

export function useSnippet(id: string) {
  return useQuery({
    queryKey: snippetKeys.detail(id),
    enabled: !!id,
    queryFn: async (): Promise<Snippet> => {
      const res = await fetch(`/api/snippets/${id}`)
      if (!res.ok) {
        const { error } = await res.json()
        throw new Error(error ?? "Snippet not found")
      }
      return res.json()
    },
  })
}

export function useCreateSnippet() {
  const { userId: clerkId } = useAuth()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (input: Omit<SnippetInsert, "user_id">): Promise<Snippet> => {
      const res = await fetch("/api/snippets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      })
      if (!res.ok) {
        const { error } = await res.json()
        throw new Error(error ?? "Failed to save snippet")
      }
      return res.json()
    },
    onSuccess: (data) => {
      logActivity("snippet_created", data.id, { title: data.title, language: data.language })
      queryClient.invalidateQueries({ queryKey: snippetKeys.all(clerkId ?? "") })
      queryClient.invalidateQueries({ queryKey: snippetKeys.due(clerkId ?? "") })
    },
  })
}

export function useUpdateSnippet() {
  const { userId: clerkId } = useAuth()
  const queryClient = useQueryClient()
  const supabase = createClient()

  return useMutation({
    mutationFn: async ({ id, ...update }: SnippetUpdate & { id: string }): Promise<Snippet> => {
      const { data, error } = await supabase
        .from("snippets")
        .update({ ...update, updated_at: new Date().toISOString() })
        .eq("id", id)
        .select()
        .single()

      if (error) throw error
      return data
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: snippetKeys.all(clerkId ?? "") })
      queryClient.invalidateQueries({ queryKey: snippetKeys.due(clerkId ?? "") })
      queryClient.setQueryData(snippetKeys.detail(data.id), data)
    },
  })
}

export function useDeleteSnippet() {
  const { userId: clerkId } = useAuth()
  const queryClient = useQueryClient()
  const supabase = createClient()

  return useMutation({
    mutationFn: async (id: string): Promise<void> => {
      const { error } = await supabase.from("snippets").delete().eq("id", id)
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: snippetKeys.all(clerkId ?? "") })
      queryClient.invalidateQueries({ queryKey: snippetKeys.due(clerkId ?? "") })
    },
  })
}
