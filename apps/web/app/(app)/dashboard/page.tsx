"use client"

import Link from "next/link"
import { useUser } from "@clerk/nextjs"
import { StatsCards } from "@/components/stats-cards"
import { ClusterView } from "@/components/cluster-view"
import { ReviewHeatmap } from "@/components/review-heatmap"
import { useSnippets } from "@/hooks/use-snippets"
import { useClusters } from "@/hooks/use-clusters"

function greeting() {
  const h = new Date().getHours()
  if (h < 12) return "Good morning"
  if (h < 17) return "Good afternoon"
  return "Good evening"
}

export default function DashboardPage() {
  const { user } = useUser()
  const { data: snippets = [] } = useSnippets()
  const { data: clusters, isLoading: clustersLoading } = useClusters(snippets)

  const name = user?.firstName ?? "there"
  const todayLabel = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  })

  return (
    <div className="mx-auto max-w-6xl space-y-10 p-6 lg:p-8">

      {/* ── Header ───────────────────────────────────────────── */}
      <div
        className="opacity-0 animate-[fadeSlideUp_0.35s_ease-out_forwards]"
        style={{ animationDelay: "0ms" }}
      >
        <h1 className="font-heading text-2xl font-semibold tracking-tight">
          {greeting()}, {name}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">{todayLabel}</p>
      </div>

      {/* ── Stat cards ───────────────────────────────────────── */}
      <StatsCards />

      {/* ── Topic clusters ───────────────────────────────────── */}
      <section
        className="opacity-0 animate-[fadeSlideUp_0.35s_ease-out_forwards]"
        style={{ animationDelay: "280ms" }}
      >
        <div className="mb-4 flex items-center gap-2">
          <h2 className="font-heading text-base font-semibold tracking-tight">Topic Clusters</h2>
          <span className="rounded-full bg-muted px-2 py-0.5 font-mono text-[10px] text-muted-foreground">
            k-means
          </span>
        </div>
        <ClusterView
          clusters={clusters}
          isLoading={clustersLoading}
          hasEnoughSnippets={snippets.length >= 3}
        />
      </section>

      {/* ── Review activity heatmap ──────────────────────────── */}
      <section
        className="opacity-0 animate-[fadeSlideUp_0.35s_ease-out_forwards]"
        style={{ animationDelay: "380ms" }}
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-heading text-base font-semibold tracking-tight">Review Activity</h2>
          <span className="font-mono text-[10px] text-muted-foreground">last {15} weeks</span>
        </div>
        <div className="rounded-2xl border border-border bg-card p-5">
          <ReviewHeatmap />
        </div>
      </section>

      {/* ── Empty state CTA (no snippets yet) ───────────────── */}
      {snippets.length === 0 && (
        <div
          className="rounded-2xl border border-dashed border-border/60 bg-card/40 px-8 py-12 text-center opacity-0 animate-[fadeSlideUp_0.35s_ease-out_forwards]"
          style={{ animationDelay: "480ms" }}
        >
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} aria-hidden className="size-6 text-primary">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
          </div>
          <p className="font-heading text-sm font-semibold text-foreground">Your library is empty</p>
          <p className="mt-1 text-xs text-muted-foreground">
            Save your first code snippet and start building your spaced-repetition library.
          </p>
          <Link
            href="/new"
            className="mt-4 inline-flex h-9 items-center gap-2 rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground active:scale-[0.96] transition-[transform,opacity] duration-100"
          >
            Save first snippet →
          </Link>
        </div>
      )}
    </div>
  )
}
