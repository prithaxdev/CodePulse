"use client"

import { cn } from "@/lib/utils"
import { useStats } from "@/hooks/use-stats"

// ── Inline SVG icon paths ────────────────────────────────────────────
const PATHS = {
  snippets:
    "M9 12h6m-6 4h6m2 5H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5.586a1 1 0 0 1 .707.293l5.414 5.414a1 1 0 0 1 .293.707V19a2 2 0 0 1-2 2z",
  clock:
    "M12 8v4l3 3m6-3a9 9 0 1 1-18 0 9 9 0 0 1 18 0z",
  flame:
    "M17.657 18.657A8 8 0 0 1 6.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0 1 20 13a7.975 7.975 0 0 1-2.343 5.657z",
  bars:
    "M9 19v-6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2zm0 0V9a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v10m-6 0a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2m0 0V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-2a2 2 0 0 1-2-2z",
} as const

// ── Accent themes ────────────────────────────────────────────────────
type Accent = "neutral" | "pulse" | "primary"

const ACCENT: Record<Accent, { icon: string; value: string }> = {
  neutral: { icon: "bg-muted text-muted-foreground",  value: "text-foreground" },
  pulse:   { icon: "bg-pulse/10 text-pulse",           value: "text-pulse" },
  primary: { icon: "bg-primary/10 text-primary",       value: "text-primary" },
}

// ── Single stat card ─────────────────────────────────────────────────
interface StatCardProps {
  label: string
  value: string
  sublabel: string
  iconPath: string
  accent: Accent
}

function StatCard({ label, value, sublabel, iconPath, accent }: StatCardProps) {
  const s = ACCENT[accent]
  return (
    <div
      className="flex flex-col justify-between gap-4 rounded-2xl border border-border bg-card p-5"
    >
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-medium uppercase tracking-[0.08em] text-muted-foreground">
          {label}
        </span>
        <div className={cn("flex h-7 w-7 items-center justify-center rounded-lg", s.icon)}>
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.5}
            aria-hidden
            className="size-4"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d={iconPath} />
          </svg>
        </div>
      </div>
      <div>
        <p className={cn("font-heading text-[2rem] font-bold leading-none tabular-nums", s.value)}>
          {value}
        </p>
        <p className="mt-1.5 text-xs text-muted-foreground">{sublabel}</p>
      </div>
    </div>
  )
}

function StatSkeleton() {
  return (
    <div className="flex flex-col justify-between gap-4 rounded-2xl border border-border bg-card p-5 animate-pulse">
      <div className="flex items-center justify-between">
        <div className="h-2.5 w-20 rounded-full bg-muted" />
        <div className="h-7 w-7 rounded-lg bg-muted" />
      </div>
      <div>
        <div className="h-8 w-14 rounded-lg bg-muted" />
        <div className="mt-1.5 h-2.5 w-28 rounded-full bg-muted" />
      </div>
    </div>
  )
}

// ── Public component ─────────────────────────────────────────────────
export function StatsCards() {
  const { data, isLoading } = useStats()

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => <StatSkeleton key={i} />)}
      </div>
    )
  }

  const s = data ?? { totalSnippets: 0, dueToday: 0, reviewStreak: 0, retentionRate: 0 }

  const cards: StatCardProps[] = [
    {
      label: "Snippets saved",
      value: String(s.totalSnippets),
      sublabel: "in your library",
      iconPath: PATHS.snippets,
      accent: "neutral",
    },
    {
      label: "Due today",
      value: String(s.dueToday),
      sublabel: s.dueToday === 1 ? "snippet needs review" : "snippets need review",
      iconPath: PATHS.clock,
      accent: s.dueToday > 0 ? "pulse" : "neutral",
    },
    {
      label: "Review streak",
      value: `${s.reviewStreak}d`,
      sublabel: s.reviewStreak === 1 ? "day in a row" : "days in a row",
      iconPath: PATHS.flame,
      accent: s.reviewStreak > 0 ? "primary" : "neutral",
    },
    {
      label: "Retention rate",
      value: `${s.retentionRate}%`,
      sublabel: "rated ≥3 · last 30 days",
      iconPath: PATHS.bars,
      accent: s.retentionRate >= 70 ? "primary" : s.retentionRate >= 40 ? "pulse" : "neutral",
    },
  ]

  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      {cards.map((card) => (
        <StatCard key={card.label} {...card} />
      ))}
    </div>
  )
}
