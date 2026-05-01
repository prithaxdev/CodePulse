"use client"

import { useMemo } from "react"
import { cn, toLocalDateStr } from "@/lib/utils"
import { useAuth } from "@clerk/nextjs"
import { useReviewLogs } from "@/hooks/use-review"
import type { ReviewLog } from "@/types/snippet"

const DAYS = 14

type DayCell = {
  dateStr: string
  dayLabel: string
  dayNum: number
  count: number
  isToday: boolean
}

function buildDays(logs: ReviewLog[]): DayCell[] {
  const counts: Record<string, number> = {}
  for (const log of logs) {
    const d = toLocalDateStr(new Date(log.reviewed_at))
    counts[d] = (counts[d] ?? 0) + 1
  }

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  return Array.from({ length: DAYS }, (_, i) => {
    const date = new Date(today)
    date.setDate(today.getDate() - (DAYS - 1 - i))
    const dateStr = toLocalDateStr(date)
    return {
      dateStr,
      dayLabel: date.toLocaleDateString("en-US", { weekday: "short" }),
      dayNum: date.getDate(),
      count: counts[dateStr] ?? 0,
      isToday: i === DAYS - 1,
    }
  })
}

function cellBg(count: number): string {
  if (count === 0) return "bg-muted/40"
  if (count <= 2)  return "bg-primary/15"
  if (count <= 5)  return "bg-primary/30"
  if (count <= 9)  return "bg-primary/55"
  return "bg-primary/75"
}

// ── Skeleton ─────────────────────────────────────────────────────────
function ReviewActivitySkeleton() {
  return (
    <div className="space-y-3">
      <div className="h-3.5 w-40 animate-pulse rounded-full bg-muted/50" />
      <div className="flex gap-1.5 py-0.5">
        {Array.from({ length: DAYS }, (_, i) => (
          <div
            key={i}
            className="flex min-w-[48px] flex-1 animate-pulse flex-col items-center gap-1.5 rounded-lg border-2 border-transparent bg-muted/30 px-2 py-3"
          >
            <div className="h-2 w-6 rounded-full bg-muted/50" />
            <div className="h-4 w-5 rounded bg-muted/50" />
            <div className="mt-0.5 h-2.5 w-4 rounded-full bg-muted/50" />
          </div>
        ))}
      </div>
    </div>
  )
}

// ── Public component ─────────────────────────────────────────────────
export function ReviewActivity() {
  const { isLoaded: clerkLoaded } = useAuth()
  const { data: logs } = useReviewLogs()

  const cells = useMemo(() => buildDays(logs ?? []), [logs])
  const total = cells.reduce((sum, c) => sum + c.count, 0)

  if (clerkLoaded && logs === undefined) return <ReviewActivitySkeleton />

  return (
    <div className="space-y-3">
      <p className="text-xs text-muted-foreground">
        {total === 0
          ? "No reviews yet in the past 2 weeks"
          : `${total} review${total === 1 ? "" : "s"} in the past 2 weeks`}
      </p>

      {/*
        py-0.5 gives the border-2 on each cell room to render without being
        clipped by the scroll container. All cells carry border-2 so today's
        visible border doesn't shift neighbouring cells.
      */}
      <div className="flex gap-1.5 overflow-x-auto py-0.5">
        {cells.map((cell) => (
          <div
            key={cell.dateStr}
            title={
              cell.count === 0
                ? cell.dateStr
                : `${cell.dateStr} · ${cell.count} review${cell.count === 1 ? "" : "s"}`
            }
            className={cn(
              "flex min-w-[48px] flex-1 cursor-default select-none flex-col items-center gap-0.5",
              "rounded-lg border-2 px-2 py-2.5",
              "transition-colors duration-150",
              cellBg(cell.count),
              cell.isToday ? "border-primary/50" : "border-transparent",
            )}
          >
            {/* Day name */}
            <span className={cn(
              "text-[10px] font-medium",
              cell.count > 0 ? "text-foreground/60" : "text-muted-foreground/50",
            )}>
              {cell.dayLabel}
            </span>

            {/* Day number */}
            <span className={cn(
              "text-sm font-semibold tabular-nums",
              cell.count > 0 ? "text-foreground" : "text-muted-foreground/60",
            )}>
              {cell.dayNum}
            </span>

            {/* Review count */}
            <span className={cn(
              "mt-0.5 text-[11px] font-bold tabular-nums",
              cell.count === 0 ? "text-muted-foreground/25" : "text-primary",
            )}>
              {cell.count === 0 ? "–" : cell.count}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
