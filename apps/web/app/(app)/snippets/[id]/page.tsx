export const dynamic = "force-dynamic"

import Link from "next/link"
import { notFound } from "next/navigation"
import { auth } from "@clerk/nextjs/server"
import { createAdminClient } from "@/lib/supabase/admin"
import { CodeDisplay } from "@/components/code-display"
import { SnippetDetailClient } from "@/components/snippet-detail-client"
import {
  DependencyGraph,
  type DependencySnippet,
} from "@/components/dependency-graph"

type Props = { params: Promise<{ id: string }> }

export default async function SnippetDetailPage({ params }: Props) {
  const { id } = await params
  const { userId: clerkId } = await auth()
  if (!clerkId) notFound()

  const supabase = createAdminClient()

  const { data: user } = await supabase
    .from("users")
    .select("id")
    .eq("clerk_id", clerkId)
    .single()

  if (!user) notFound()

  const { data: snippet } = await supabase
    .from("snippets")
    .select("*")
    .eq("id", id)
    .eq("user_id", user.id)
    .single()

  if (!snippet) notFound()

  // Query prerequisite edges (snippets this one builds on)
  const { data: prereqEdges } = await supabase
    .from("snippet_dependencies")
    .select("from_id, confidence")
    .eq("to_id", id)
    .order("confidence", { ascending: false })
    .limit(5)

  // Query dependent edges (snippets that need this one)
  const { data: dependentEdges } = await supabase
    .from("snippet_dependencies")
    .select("to_id, confidence")
    .eq("from_id", id)
    .order("confidence", { ascending: false })
    .limit(5)

  let prerequisites: DependencySnippet[] = []
  if (prereqEdges && prereqEdges.length > 0) {
    const { data: prereqSnippets } = await supabase
      .from("snippets")
      .select("id, title, language")
      .in(
        "id",
        prereqEdges.map((e) => e.from_id)
      )
    prerequisites = (prereqSnippets ?? []).map((s) => ({
      ...s,
      confidence: prereqEdges.find((e) => e.from_id === s.id)?.confidence ?? 0,
    }))
  }

  let dependents: DependencySnippet[] = []
  if (dependentEdges && dependentEdges.length > 0) {
    const { data: dependentSnippets } = await supabase
      .from("snippets")
      .select("id, title, language")
      .in(
        "id",
        dependentEdges.map((e) => e.to_id)
      )
    dependents = (dependentSnippets ?? []).map((s) => ({
      ...s,
      confidence: dependentEdges.find((e) => e.to_id === s.id)?.confidence ?? 0,
    }))
  }

  const nextReview = new Date(snippet.next_review)
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const daysUntil = Math.ceil(
    (nextReview.getTime() - today.getTime()) / 86_400_000
  )
  const nextReviewLabel =
    daysUntil === 0
      ? "Today"
      : daysUntil === 1
        ? "Tomorrow"
        : daysUntil < 0
          ? "Overdue"
          : `In ${daysUntil} days`

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      {/* ── Back button ────────────────────────────────── */}
      <Link
        href="/dashboard"
        className="mb-6 inline-flex items-center gap-1.5 text-xs text-muted-foreground transition-colors duration-150 hover:text-foreground"
      >
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
          <path
            d="M9 11L5 7l4-4"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        Dashboard
      </Link>

      {/* ── Header ─────────────────────────────────────── */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <div className="mb-2 flex flex-wrap items-center gap-1.5">
            <span className="font-geist rounded-md bg-muted/60 px-2 py-0.5 text-[11px] text-muted-foreground">
              {snippet.language}
            </span>
            {snippet.tags.map((tag: string) => (
              <span
                key={tag}
                className="rounded-md bg-primary/10 px-2 py-0.5 text-[11px] font-medium text-primary"
              >
                {tag}
              </span>
            ))}
          </div>
          <h1 className="text-wrap-balance font-heading text-2xl font-semibold tracking-tight text-foreground">
            {snippet.title}
          </h1>
          {snippet.description && (
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              {snippet.description}
            </p>
          )}
          <p className="mt-2 text-xs text-muted-foreground/60">
            Saved {formatDate(snippet.created_at)}
            {snippet.updated_at !== snippet.created_at && (
              <> · Updated {formatDate(snippet.updated_at)}</>
            )}
          </p>
        </div>

        {/* Edit / Delete — client component */}
        <div className="shrink-0">
          <SnippetDetailClient snippet={snippet} />
        </div>
      </div>

      {/* ── Code ───────────────────────────────────────── */}
      {snippet.code && (
        <div className="mb-6 overflow-hidden rounded-2xl border border-border">
          <CodeDisplay code={snippet.code} language={snippet.language} />
        </div>
      )}

      {/* ── SM-2 State ─────────────────────────────────── */}
      <div className="overflow-hidden rounded-2xl border border-border bg-card">
        <div className="border-b border-border px-5 py-3.5">
          <h2 className="text-xs font-semibold tracking-widest text-muted-foreground uppercase">
            Review schedule
          </h2>
        </div>
        <div className="grid grid-cols-2 divide-y divide-border sm:grid-cols-4 sm:divide-x sm:divide-y-0">
          <StatCell
            label="Next review"
            value={nextReviewLabel}
            accent={daysUntil <= 0}
          />
          <StatCell
            label="Interval"
            value={`${snippet.interval_days} day${snippet.interval_days !== 1 ? "s" : ""}`}
          />
          <StatCell label="Repetitions" value={String(snippet.repetitions)} />
          <StatCell
            label="Ease factor"
            value={snippet.ease_factor.toFixed(2)}
          />
        </div>
      </div>

      {/* ── Knowledge Graph ────────────────────────────── */}
      <DependencyGraph
        currentTitle={snippet.title}
        prerequisites={prerequisites}
        dependents={dependents}
      />
    </div>
  )
}

function StatCell({
  label,
  value,
  accent = false,
}: {
  label: string
  value: string
  accent?: boolean
}) {
  return (
    <div className="flex flex-col gap-0.5 px-5 py-4">
      <span className="text-[10px] font-medium tracking-widest text-muted-foreground uppercase">
        {label}
      </span>
      <span
        className={
          accent
            ? "text-sm font-semibold text-primary"
            : "text-sm font-semibold text-foreground"
        }
      >
        {value}
      </span>
    </div>
  )
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })
}
