"use client"

import { cn } from "@/lib/utils"
import { useActivityLog } from "@/hooks/use-activity-log"
import type { ActivityLog, ActivityAction } from "@/types/snippet"

// ── Relative time ─────────────────────────────────────────────────────
function relativeTime(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime()
  const s = Math.floor(diff / 1000)
  if (s < 60) return "just now"
  const m = Math.floor(s / 60)
  if (m < 60) return `${m}m ago`
  const h = Math.floor(m / 60)
  if (h < 24) return `${h}h ago`
  const d = Math.floor(h / 24)
  if (d === 1) return "yesterday"
  if (d < 7) return `${d}d ago`
  return new Date(dateStr).toLocaleDateString("en-US", { month: "short", day: "numeric" })
}

// ── Action config ─────────────────────────────────────────────────────
const ACTION_CONFIG: Record<
  ActivityAction,
  { label: string; color: string; dot: string; icon: string }
> = {
  snippet_created: {
    label: "Saved",
    color: "text-emerald-400",
    dot: "bg-emerald-400",
    icon: "+",
  },
  snippet_edited: {
    label: "Edited",
    color: "text-sky-400",
    dot: "bg-sky-400",
    icon: "~",
  },
  snippet_deleted: {
    label: "Deleted",
    color: "text-rose-400",
    dot: "bg-rose-400",
    icon: "×",
  },
  review_rated: {
    label: "Reviewed",
    color: "text-amber-400",
    dot: "bg-amber-400",
    icon: "★",
  },
  review_session_completed: {
    label: "Session",
    color: "text-violet-400",
    dot: "bg-violet-400",
    icon: "✓",
  },
}

const RATING_LABEL: Record<number, { text: string; cls: string }> = {
  1: { text: "Forgot", cls: "text-rose-400/80 bg-rose-400/8" },
  3: { text: "Hard", cls: "text-amber-400/80 bg-amber-400/8" },
  5: { text: "Easy", cls: "text-emerald-400/80 bg-emerald-400/8" },
}

// ── Entry text builder ────────────────────────────────────────────────
function entryText(log: ActivityLog): {
  name: string
  badge?: { text: string; cls: string }
} {
  const m = log.metadata as Record<string, unknown> | null

  switch (log.action as ActivityAction) {
    case "snippet_created":
    case "snippet_edited":
      return {
        name: String(m?.title ?? "snippet"),
        badge: m?.language
          ? { text: String(m.language), cls: "text-muted-foreground bg-muted/60" }
          : undefined,
      }
    case "snippet_deleted":
      return { name: String(m?.title ?? "snippet") }
    case "review_rated": {
      const rating = Number(m?.rating ?? 5)
      return {
        name: String(m?.snippet_title ?? "snippet"),
        badge: RATING_LABEL[rating] ?? RATING_LABEL[5],
      }
    }
    case "review_session_completed":
      return {
        name: `${m?.count ?? 0} snippet${Number(m?.count ?? 0) !== 1 ? "s" : ""}`,
        badge: { text: "complete", cls: "text-violet-400/80 bg-violet-400/8" },
      }
    default:
      return { name: "–" }
  }
}

// ── Skeleton ──────────────────────────────────────────────────────────
function ActivityFeedSkeleton() {
  return (
    <div className="space-y-0 pl-3">
      {Array.from({ length: 5 }, (_, i) => (
        <div key={i} className="flex items-center gap-3 py-2.5">
          <div className="size-2 shrink-0 animate-pulse rounded-full bg-muted/50" />
          <div className="flex flex-1 items-center gap-2">
            <div
              className="h-2 animate-pulse rounded-full bg-muted/50"
              style={{ width: `${48 + (i % 3) * 18}px` }}
            />
            <div
              className="h-2 animate-pulse rounded-full bg-muted/40"
              style={{ width: `${80 + (i % 4) * 14}px` }}
            />
          </div>
          <div className="h-2 w-10 animate-pulse rounded-full bg-muted/30" />
        </div>
      ))}
    </div>
  )
}

// ── Single entry ──────────────────────────────────────────────────────
function ActivityEntry({
  log,
  index,
  isLast,
}: {
  log: ActivityLog
  index: number
  isLast: boolean
}) {
  const action = log.action as ActivityAction
  const config = ACTION_CONFIG[action] ?? ACTION_CONFIG.snippet_created
  const { name, badge } = entryText(log)

  return (
    <div
      className="group relative flex items-start gap-3"
      style={{
        animation: `activityFadeUp 0.3s ease both`,
        animationDelay: `${index * 40}ms`,
      }}
    >
      {/* Timeline track */}
      {!isLast && (
        <div className="absolute left-[5px] top-5 bottom-0 w-px bg-border/50" />
      )}

      {/* Dot */}
      <div
        className={cn(
          "relative z-10 mt-[9px] size-2.5 shrink-0 rounded-full ring-2 ring-background",
          config.dot,
        )}
      />

      {/* Content */}
      <div className="flex min-w-0 flex-1 items-center gap-2 py-2">
        {/* Action label */}
        <span className={cn("shrink-0 text-xs font-semibold", config.color)}>
          {config.label}
        </span>

        {/* Entity name */}
        <span className="min-w-0 truncate text-xs text-foreground/80 font-medium">
          {name}
        </span>

        {/* Badge */}
        {badge && (
          <span
            className={cn(
              "shrink-0 rounded-md px-1.5 py-0.5 font-mono text-[10px] font-medium",
              badge.cls,
            )}
          >
            {badge.text}
          </span>
        )}
      </div>

      {/* Timestamp */}
      <span className="mt-2 shrink-0 text-[11px] tabular-nums text-muted-foreground/50">
        {relativeTime(log.created_at)}
      </span>
    </div>
  )
}

// ── Empty state ───────────────────────────────────────────────────────
function EmptyFeed() {
  return (
    <div className="flex flex-col items-center gap-2 py-8 text-center">
      <div className="flex size-9 items-center justify-center rounded-xl bg-muted/40">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.5}
          aria-hidden
          className="size-4 text-muted-foreground/50"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 6v6l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      </div>
      <p className="text-xs text-muted-foreground/60">No activity yet</p>
    </div>
  )
}

// ── Public component ──────────────────────────────────────────────────
export function ActivityFeed({ limit = 15 }: { limit?: number }) {
  const { data: logs, isLoading } = useActivityLog(limit)

  if (isLoading) return <ActivityFeedSkeleton />
  if (!logs || logs.length === 0) return <EmptyFeed />

  return (
    <>
      <style>{`
        @keyframes activityFadeUp {
          from { opacity: 0; transform: translateY(5px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <div className="pl-1">
        {logs.map((log, i) => (
          <ActivityEntry
            key={log.id}
            log={log}
            index={i}
            isLast={i === logs.length - 1}
          />
        ))}
      </div>
    </>
  )
}
