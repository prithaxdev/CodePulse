"use client"

import { useState } from "react"
import CodeMirror from "@uiw/react-codemirror"
import { githubDark } from "@uiw/codemirror-theme-github"
import { cn } from "@/lib/utils"
import { getLanguageExtension, type Language } from "@/lib/languages"
import { Button } from "@/components/ui/button"
import type { Snippet } from "@/types/snippet"

interface ReviewCardProps {
  snippet: Snippet
  index: number
  total: number
  onRate: (rating: 1 | 3 | 5) => void
  submittingRating: 1 | 3 | 5 | null
}

export function ReviewCard({ snippet, index, total, onRate, submittingRating }: ReviewCardProps) {
  const isSubmitting = submittingRating !== null
  const [revealed, setReveal] = useState(false)

  return (
    <div className="flex flex-col gap-4">

      {/* ── Progress ─────────────────────────────────────── */}
      <div className="flex items-center gap-3">
        <div className="h-1.5 flex-1 rounded-full bg-border overflow-hidden">
          <div
            className="h-full rounded-full bg-primary transition-[width] duration-500"
            style={{ width: `${(index / total) * 100}%` }}
          />
        </div>
        <span className="shrink-0 font-mono text-xs tabular-nums text-muted-foreground">
          {index + 1} / {total}
        </span>
      </div>

      {/* ── Card ─────────────────────────────────────────── */}
      <div className="rounded-2xl border border-border bg-card overflow-hidden">

        {/* Header */}
        <div className="px-6 pt-6 pb-4 border-b border-border">
          <div className="flex flex-wrap items-center gap-1.5 mb-3">
            <span className="rounded-md bg-muted/60 px-2 py-0.5 font-mono text-[11px] text-muted-foreground">
              {snippet.language}
            </span>
            {snippet.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-md bg-primary/10 px-2 py-0.5 text-[11px] font-medium text-primary"
              >
                {tag}
              </span>
            ))}
          </div>

          <h2 className="font-heading text-xl font-semibold tracking-tight text-foreground text-wrap-balance">
            {snippet.title}
          </h2>

          {snippet.description && (
            <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
              {snippet.description}
            </p>
          )}
        </div>

        {/* Code area */}
        {snippet.code && (
          <div className="relative">
            {/* Blurred overlay when not revealed */}
            {!revealed && (
              <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-3 bg-card/70 backdrop-blur-sm">
                <Button
                  variant="outline"
                  onClick={() => setReveal(true)}
                  className="active:scale-[0.96] transition-[transform,opacity] duration-100 shadow-sm"
                >
                  Show answer
                </Button>
                <p className="text-xs text-muted-foreground">
                  Try to recall the code first
                </p>
              </div>
            )}

            <div className={cn("min-h-48 transition-[filter] duration-300", !revealed && "blur-sm select-none pointer-events-none")}>
              <CodeMirror
                value={snippet.code}
                theme={githubDark}
                extensions={[
                  ...(getLanguageExtension(snippet.language as Language)
                    ? [getLanguageExtension(snippet.language as Language)!]
                    : []),
                ]}
                editable={false}
                basicSetup={{
                  lineNumbers: true,
                  foldGutter: false,
                  highlightActiveLine: false,
                  autocompletion: false,
                }}
                className="text-sm"
                style={{ fontFamily: "var(--font-mono, ui-monospace, monospace)" }}
              />
            </div>
          </div>
        )}
      </div>

      {/* ── Rating buttons ───────────────────────────────── */}
      {revealed && (
        <div className="flex flex-col gap-2">
          <p className="text-center text-xs text-muted-foreground">
            How well did you remember this?
          </p>
          <div className="grid grid-cols-3 gap-2">
            <RatingButton
              label="Forgot"
              sublabel="Start over"
              onClick={() => onRate(1)}
              disabled={isSubmitting}
              isActive={submittingRating === 1}
              variant="forgot"
            />
            <RatingButton
              label="Hard"
              sublabel="Got it, barely"
              onClick={() => onRate(3)}
              disabled={isSubmitting}
              isActive={submittingRating === 3}
              variant="hard"
            />
            <RatingButton
              label="Easy"
              sublabel="Got it!"
              onClick={() => onRate(5)}
              disabled={isSubmitting}
              isActive={submittingRating === 5}
              variant="easy"
            />
          </div>
        </div>
      )}
    </div>
  )
}

function RatingButton({
  label,
  sublabel,
  onClick,
  disabled,
  isActive,
  variant,
}: {
  label: string
  sublabel: string
  onClick: () => void
  disabled: boolean
  isActive: boolean
  variant: "forgot" | "hard" | "easy"
}) {
  const styles = {
    forgot: "border-destructive/30 bg-destructive/8 text-destructive hover:bg-destructive/15",
    hard:   "border-pulse/30 bg-pulse/8 text-pulse hover:bg-pulse/15",
    easy:   "border-primary/30 bg-primary/8 text-primary hover:bg-primary/15",
  }

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "flex flex-col items-center gap-0.5 rounded-xl border px-3 py-3.5",
        "active:scale-[0.96] transition-[transform,background-color,opacity] duration-100",
        "disabled:pointer-events-none",
        isActive ? "opacity-100" : "disabled:opacity-40",
        styles[variant],
      )}
    >
      {isActive ? (
        <svg
          className="size-4 animate-spin"
          viewBox="0 0 24 24"
          fill="none"
          aria-label="Processing"
        >
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2.5" />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
          />
        </svg>
      ) : (
        <span className="text-sm font-semibold">{label}</span>
      )}
      <span className="text-[11px] opacity-70">{isActive ? "Saving…" : sublabel}</span>
    </button>
  )
}
