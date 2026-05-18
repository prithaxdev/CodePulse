"use client"

// Dynamic import with ssr:false must live inside a Client Component.
// This wrapper is what the Server Component page imports.
import dynamic from "next/dynamic"

export const SnippetEditor = dynamic(
  () => import("@/components/snippet-editor").then((m) => m.SnippetEditor),
  {
    ssr: false,
    loading: () => (
      <div className="h-[520px] animate-pulse rounded-2xl border border-border bg-card" />
    ),
  }
)
