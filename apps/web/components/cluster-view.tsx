"use client"

import { useState } from "react"
import Link from "next/link"
import { cn } from "@/lib/utils"
import type { ClusterWithSnippets } from "@/hooks/use-clusters"

// ── Accent palette — cycles per cluster index ────────────────────────
const ACCENTS = [
  { dot: "bg-primary",       pill: "bg-primary/10 text-primary",         border: "hover:border-primary/25" },
  { dot: "bg-pulse",         pill: "bg-pulse/10 text-pulse",              border: "hover:border-pulse/25" },
  { dot: "bg-blue-400",      pill: "bg-blue-500/10 text-blue-400",        border: "hover:border-blue-400/25" },
  { dot: "bg-violet-400",    pill: "bg-violet-500/10 text-violet-400",    border: "hover:border-violet-400/25" },
] as const

// ── Individual cluster card ──────────────────────────────────────────
function ClusterCard({ cluster, colorIndex }: { cluster: ClusterWithSnippets; colorIndex: number }) {
  const [expanded, setExpanded] = useState(false)
  const accent = ACCENTS[colorIndex % ACCENTS.length]

  return (
    <div
      className={cn(
        "overflow-hidden rounded-2xl border border-border bg-card",
        "transition-[border-color] duration-200",
        accent.border,
      )}
    >
      {/* ── Toggle header ── */}
      <button
        type="button"
        onClick={() => setExpanded((v) => !v)}
        aria-expanded={expanded}
        className="w-full flex items-start gap-3 p-5 text-left active:scale-[0.99] transition-transform duration-100"
      >
        <span className={cn("mt-[5px] h-2 w-2 shrink-0 rounded-full", accent.dot)} />

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <h3 className="font-heading text-sm font-semibold capitalize truncate text-foreground">
              {cluster.label}
            </h3>
            <div className="flex items-center gap-2 shrink-0">
              <span className={cn("rounded-full px-2 py-0.5 text-[10px] font-semibold tabular-nums", accent.pill)}>
                {cluster.snippets.length}
              </span>
              <svg
                viewBox="0 0 16 16"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.5}
                aria-hidden
                className={cn(
                  "size-3.5 text-muted-foreground transition-transform duration-200",
                  expanded && "rotate-180",
                )}
              >
                <path strokeLinecap="round" d="M4 6l4 4 4-4" />
              </svg>
            </div>
          </div>

          {/* Top TF-IDF terms from the clustering algorithm */}
          <div className="mt-2 flex flex-wrap gap-1">
            {cluster.top_terms.slice(0, 4).map((term) => (
              <span
                key={term}
                className="rounded-md bg-muted px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground"
              >
                {term}
              </span>
            ))}
          </div>
        </div>
      </button>

      {/* ── Expandable snippet list (grid-rows 0fr→1fr trick) ── */}
      <div
        className={cn(
          "grid transition-[grid-template-rows] duration-300 ease-out",
          expanded ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
        )}
      >
        <div className="overflow-hidden">
          <div className="divide-y divide-border border-t border-border">
            {cluster.snippets.slice(0, 8).map((snippet) => (
              <Link
                key={snippet.id}
                href={`/snippets/${snippet.id}`}
                className="flex items-center gap-2.5 px-5 py-2.5 transition-colors duration-150 hover:bg-accent/50"
              >
                <span className="shrink-0 rounded bg-muted/60 px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground">
                  {snippet.language}
                </span>
                <span className="truncate text-xs text-foreground">{snippet.title}</span>
              </Link>
            ))}
            {cluster.snippets.length > 8 && (
              <p className="px-5 py-2.5 text-[11px] text-muted-foreground">
                +{cluster.snippets.length - 8} more
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

// ── Skeleton ─────────────────────────────────────────────────────────
function ClusterSkeleton() {
  return (
    <div className="rounded-2xl border border-border bg-card p-5 animate-pulse">
      <div className="flex items-start gap-3">
        <div className="mt-[5px] h-2 w-2 shrink-0 rounded-full bg-muted" />
        <div className="flex-1">
          <div className="flex items-center justify-between gap-2">
            <div className="h-3.5 w-28 rounded-full bg-muted" />
            <div className="h-4 w-8 rounded-full bg-muted" />
          </div>
          <div className="mt-2 flex gap-1.5">
            <div className="h-4 w-12 rounded-md bg-muted" />
            <div className="h-4 w-16 rounded-md bg-muted" />
            <div className="h-4 w-10 rounded-md bg-muted" />
          </div>
        </div>
      </div>
    </div>
  )
}

// ── Public component ─────────────────────────────────────────────────
export interface ClusterViewProps {
  clusters: ClusterWithSnippets[] | undefined
  isLoading: boolean
  hasEnoughSnippets: boolean
}

export function ClusterView({ clusters, isLoading, hasEnoughSnippets }: ClusterViewProps) {
  if (!hasEnoughSnippets) {
    return (
      <div className="rounded-2xl border border-dashed border-border/60 bg-card/40 px-6 py-10 text-center">
        <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-muted">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} aria-hidden className="size-5 text-muted-foreground">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 18v-2.25ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25a2.25 2.25 0 0 1-2.25-2.25V6ZM13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-2.25A2.25 2.25 0 0 1 13.5 18v-2.25Z" />
          </svg>
        </div>
        <p className="text-sm font-medium text-foreground">3+ snippets needed for clustering</p>
        <p className="mt-1 text-xs text-muted-foreground">
          K-means will auto-group your library by topic as it grows
        </p>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => <ClusterSkeleton key={i} />)}
      </div>
    )
  }

  if (!clusters || clusters.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-border/60 bg-card/40 px-6 py-10 text-center">
        <p className="text-sm text-muted-foreground">
          No clusters found. Try saving a few more snippets.
        </p>
      </div>
    )
  }

  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {clusters.map((cluster, i) => (
        <ClusterCard
          key={`${cluster.label}-${i}`}
          cluster={cluster}
          colorIndex={i}
        />
      ))}
    </div>
  )
}
