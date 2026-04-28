"use client"

import { useDueSnippets } from "@/hooks/use-snippets"

export function DueBadge() {
  const { data: dueSnippets } = useDueSnippets()
  const count = dueSnippets?.length ?? 0

  if (count === 0) return null

  return (
    <span
      data-tabular
      className="ml-auto flex h-5 min-w-5 items-center justify-center rounded-full bg-pulse px-1.5 text-[10px] font-semibold leading-none text-pulse-foreground tabular-nums"
      aria-label={`${count} snippets due for review`}
    >
      {count > 99 ? "99+" : count}
    </span>
  )
}
