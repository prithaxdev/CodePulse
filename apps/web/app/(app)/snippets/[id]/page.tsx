export const dynamic = "force-dynamic"

import { notFound } from "next/navigation"
import { auth } from "@clerk/nextjs/server"
import { createAdminClient } from "@/lib/supabase/admin"
import { CodeDisplay } from "@/components/code-display"
import { SnippetDetailClient } from "@/components/snippet-detail-client"

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

  const nextReview = new Date(snippet.next_review)
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const daysUntil = Math.ceil((nextReview.getTime() - today.getTime()) / 86_400_000)
  const nextReviewLabel =
    daysUntil === 0 ? "Today" :
    daysUntil === 1 ? "Tomorrow" :
    daysUntil < 0 ? "Overdue" :
    `In ${daysUntil} days`

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">

      {/* ── Header ─────────────────────────────────────── */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-1.5 mb-2">
            <span className="rounded-md bg-muted/60 px-2 py-0.5 font-mono text-[11px] text-muted-foreground">
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
          <h1 className="font-heading text-2xl font-semibold tracking-tight text-foreground text-wrap-balance">
            {snippet.title}
          </h1>
          {snippet.description && (
            <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
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
      <div className="rounded-2xl border border-border bg-card overflow-hidden">
        <div className="px-5 py-3.5 border-b border-border">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            Review schedule
          </h2>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-border">
          <StatCell
            label="Next review"
            value={nextReviewLabel}
            accent={daysUntil <= 0}
          />
          <StatCell
            label="Interval"
            value={`${snippet.interval_days} day${snippet.interval_days !== 1 ? "s" : ""}`}
          />
          <StatCell
            label="Repetitions"
            value={String(snippet.repetitions)}
          />
          <StatCell
            label="Ease factor"
            value={snippet.ease_factor.toFixed(2)}
          />
        </div>
      </div>
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
      <span className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground">
        {label}
      </span>
      <span className={accent ? "text-sm font-semibold text-primary" : "text-sm font-semibold text-foreground"}>
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
