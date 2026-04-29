"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { createClient } from "@/lib/supabase/client"
import { useSupabaseUserId } from "@/hooks/use-user"
import type { Snippet, SnippetInsert, SnippetUpdate } from "@/types/snippet"

export const snippetKeys = {
  all: (userId: string) => ["snippets", userId] as const,
  due: (userId: string) => ["snippets", userId, "due"] as const,
  detail: (id: string) => ["snippets", "detail", id] as const,
}

export function useSnippets() {
  const { data: userId } = useSupabaseUserId()
  const supabase = createClient()

  return useQuery({
    queryKey: snippetKeys.all(userId ?? ""),
    enabled: !!userId,
    queryFn: async (): Promise<Snippet[]> => {
      const { data, error } = await supabase
        .from("snippets")
        .select("*")
        .eq("user_id", userId!)
        .order("created_at", { ascending: false })

      if (error) throw error
      return data
    },
  })
}

export function useDueSnippets() {
  const { data: userId } = useSupabaseUserId()
  const supabase = createClient()
  const today = new Date().toISOString().split("T")[0]

  return useQuery({
    queryKey: snippetKeys.due(userId ?? ""),
    enabled: !!userId,
    queryFn: async (): Promise<Snippet[]> => {
      const { data, error } = await supabase
        .from("snippets")
        .select("*")
        .eq("user_id", userId!)
        .lte("next_review", today)
        .order("next_review", { ascending: true })

      if (error) throw error
      return data
    },
  })
}

export function useSnippet(id: string) {
  const supabase = createClient()

  return useQuery({
    queryKey: snippetKeys.detail(id),
    enabled: !!id,
    queryFn: async (): Promise<Snippet> => {
      const { data, error } = await supabase
        .from("snippets")
        .select("*")
        .eq("id", id)
        .single()

      if (error) throw error
      return data
    },
  })
}

export function useCreateSnippet() {
  const { data: userId } = useSupabaseUserId()
  const queryClient = useQueryClient()
  const supabase = createClient()

  return useMutation({
    mutationFn: async (input: Omit<SnippetInsert, "user_id">): Promise<Snippet> => {
      if (!userId) throw new Error("User not ready")

      const { data, error } = await supabase
        .from("snippets")
        .insert({ ...input, user_id: userId })
        .select()
        .single()

      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: snippetKeys.all(userId ?? "") })
      queryClient.invalidateQueries({ queryKey: snippetKeys.due(userId ?? "") })
    },
  })
}

export function useUpdateSnippet() {
  const { data: userId } = useSupabaseUserId()
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
      queryClient.invalidateQueries({ queryKey: snippetKeys.all(userId ?? "") })
      queryClient.invalidateQueries({ queryKey: snippetKeys.due(userId ?? "") })
      queryClient.setQueryData(snippetKeys.detail(data.id), data)
    },
  })
}

export function useDeleteSnippet() {
  const { data: userId } = useSupabaseUserId()
  const queryClient = useQueryClient()
  const supabase = createClient()

  return useMutation({
    mutationFn: async (id: string): Promise<void> => {
      const { error } = await supabase.from("snippets").delete().eq("id", id)
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: snippetKeys.all(userId ?? "") })
      queryClient.invalidateQueries({ queryKey: snippetKeys.due(userId ?? "") })
    },
  })
}
