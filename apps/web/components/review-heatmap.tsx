"use client"

import { cn } from "@/lib/utils"
import { useReviewLogs } from "@/hooks/use-review"
import type { ReviewLog } from "@/types/snippet"

const WEEKS = 15 // ~3.5 months of history
const ROW_LABELS = [null, "Mon", null, "Wed", null, "Fri", null] // Sun=0 … Sat=6

type Cell = { date: string; count: number; isFuture: boolean }
type MonthMark = { col: number; label: string }

// ── Build the grid data ──────────────────────────────────────────────
function buildGrid(logs: ReviewLog[]): { weeks: Cell[][]; monthMarks: MonthMark[] } {
  const counts: Record<string, number> = {}
  for (const log of logs) {
    const d = log.reviewed_at.split("T")[0]
    counts[d] = (counts[d] ?? 0) + 1
  }

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  // End = Saturday of the current week (so today is always visible)
  const endDate = new Date(today)
  endDate.setDate(endDate.getDate() + (6 - endDate.getDay()))

  // Start = Sunday exactly WEEKS weeks before endDate
  const startDate = new Date(endDate)
  startDate.setDate(startDate.getDate() - (WEEKS * 7 - 1))

  const flat: Cell[] = []
  const monthMarks: MonthMark[] = []
  let lastMonth = -1

  for (let i = 0; i < WEEKS * 7; i++) {
    const date = new Date(startDate)
    date.setDate(startDate.getDate() + i)
    const dateStr = date.toISOString().split("T")[0]
    const isFuture = date > today

    flat.push({ date: dateStr, count: isFuture ? 0 : (counts[dateStr] ?? 0), isFuture })

    // Month label at the first day (Sunday) of each week that starts a new month
    if (i % 7 === 0 && date.getMonth() !== lastMonth) {
      lastMonth = date.getMonth()
      monthMarks.push({
        col: Math.floor(i / 7),
        label: date.toLocaleDateString("en-US", { month: "short" }),
      })
    }
  }

  const weeks: Cell[][] = []
  for (let w = 0; w < WEEKS; w++) {
    weeks.push(flat.slice(w * 7, w * 7 + 7))
  }

  return { weeks, monthMarks }
}

// ── Intensity → CSS class ────────────────────────────────────────────
function intensity(count: number, isFuture: boolean): string {
  if (isFuture) return "bg-muted/20"
  if (count === 0) return "bg-muted/50"
  if (count <= 2)  return "bg-primary/25"
  if (count <= 5)  return "bg-primary/50"
  if (count <= 9)  return "bg-primary/75"
  return "bg-primary"
}

// ── Cell ─────────────────────────────────────────────────────────────
function Cell({ date, count, isFuture }: Cell) {
  const tooltip = isFuture
    ? date
    : count === 0
    ? `${date}: no reviews`
    : `${date}: ${count} review${count === 1 ? "" : "s"}`

  return (
    <div
      title={tooltip}
      className={cn(
        "h-3 w-3 shrink-0 rounded-[3px] cursor-default",
        "transition-[transform,filter] duration-100 hover:scale-125 hover:brightness-110",
        intensity(count, isFuture),
      )}
    />
  )
}

// ── Skeleton ─────────────────────────────────────────────────────────
function HeatmapSkeleton() {
  return (
    <div className="overflow-x-auto">
      <div className="flex min-w-max gap-1 animate-pulse">
        {Array.from({ length: WEEKS }).map((_, w) => (
          <div key={w} className="flex flex-col gap-1">
            {Array.from({ length: 7 }).map((_, d) => (
              <div key={d} className="h-3 w-3 rounded-[3px] bg-muted/40" />
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}

// ── Public component ─────────────────────────────────────────────────
export function ReviewHeatmap() {
  const { data: logs, isLoading } = useReviewLogs()

  if (isLoading) return <HeatmapSkeleton />

  const { weeks, monthMarks } = buildGrid(logs ?? [])

  return (
    <div className="overflow-x-auto">
      <div className="min-w-max space-y-1.5">
        {/* Month labels */}
        <div className="flex gap-1 pl-8">
          {weeks.map((_, w) => {
            const mark = monthMarks.find((m) => m.col === w)
            return (
              <div key={w} className="relative w-3 shrink-0">
                {mark && (
                  <span className="absolute left-0 whitespace-nowrap font-mono text-[9px] text-muted-foreground">
                    {mark.label}
                  </span>
                )}
              </div>
            )
          })}
        </div>

        {/* Grid */}
        <div className="flex items-start gap-1">
          {/* Day-of-week labels */}
          <div className="flex w-7 shrink-0 flex-col gap-1">
            {ROW_LABELS.map((label, i) => (
              <div key={i} className="flex h-3 items-center">
                {label && (
                  <span className="font-mono text-[9px] text-muted-foreground">{label}</span>
                )}
              </div>
            ))}
          </div>

          {/* Cell columns (one per week) */}
          {weeks.map((week, w) => (
            <div key={w} className="flex flex-col gap-1">
              {week.map((cell) => (
                <Cell key={cell.date} {...cell} />
              ))}
            </div>
          ))}
        </div>

        {/* Legend */}
        <div className="flex items-center justify-end gap-1.5 pt-0.5">
          <span className="font-mono text-[9px] text-muted-foreground">Less</span>
          {[0, 2, 4, 7, 10].map((n) => (
            <div key={n} className={cn("h-2.5 w-2.5 rounded-[3px]", intensity(n, false))} />
          ))}
          <span className="font-mono text-[9px] text-muted-foreground">More</span>
        </div>
      </div>
    </div>
  )
}
