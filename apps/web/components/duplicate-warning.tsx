"use client"

import Link from "next/link"
import type { DuplicateMatch } from "@/types/api"

interface DuplicateWarningProps {
  matches: DuplicateMatch[]
  onDismiss: () => void
}

export function DuplicateWarning({ matches, onDismiss }: DuplicateWarningProps) {
  const top = matches[0]
  const pct = Math.round(top.similarity * 100)

  return (
    <div className="flex items-start gap-3 rounded-xl border border-pulse/30 bg-pulse/8 p-4 text-sm">
      <span className="mt-0.5 shrink-0 text-pulse">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
          <path
            d="M8 1.5a6.5 6.5 0 1 1 0 13 6.5 6.5 0 0 1 0-13ZM8 5v4M8 10.5v1"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinecap="round"
          />
        </svg>
      </span>
      <div className="flex-1 min-w-0">
        <p className="font-medium text-foreground">
          Similar snippet found ({pct}% match)
        </p>
        <p className="mt-0.5 text-muted-foreground">
          You may already have this code saved.{" "}
          <Link
            href={`/snippets/${top.id}`}
            className="text-primary underline underline-offset-2 hover:opacity-80 transition-opacity"
          >
            View existing snippet
          </Link>
          {matches.length > 1 && ` and ${matches.length - 1} more`}.
        </p>
      </div>
      <button
        type="button"
        onClick={onDismiss}
        className="shrink-0 rounded-lg p-1 text-muted-foreground hover:text-foreground active:scale-[0.96] transition-[scale,color] duration-100"
        aria-label="Dismiss warning"
      >
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
          <path d="M2 2l10 10M12 2L2 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </button>
    </div>
  )
}
