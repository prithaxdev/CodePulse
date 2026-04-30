"use client"

import { useState } from "react"
import Link from "next/link"
import { useDueSnippets } from "@/hooks/use-snippets"
import { useSubmitReview } from "@/hooks/use-review"
import { ReviewCard } from "@/components/review-card"
import type { Snippet } from "@/types/snippet"

export function ReviewSession() {
  const { data: due = [], isLoading } = useDueSnippets()
  const submitReview = useSubmitReview()

  const [index, setIndex] = useState(0)
  const [done, setDone] = useState(false)
  const [submittingRating, setSubmittingRating] = useState<1 | 3 | 5 | null>(null)
  const [submitError, setSubmitError] = useState<string | null>(null)

  const handleRate = async (snippet: Snippet, rating: 1 | 3 | 5) => {
    setSubmittingRating(rating)
    setSubmitError(null)
    try {
      await submitReview.mutateAsync({
        snippetId: snippet.id,
        rating,
        currentEase: snippet.ease_factor,
        currentInterval: snippet.interval_days,
        currentReps: snippet.repetitions,
      })
      if (index + 1 >= due.length) {
        setDone(true)
      } else {
        setIndex((i) => i + 1)
      }
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "Something went wrong. Try again.")
    } finally {
      setSubmittingRating(null)
    }
  }

  if (isLoading) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6">
        <div className="space-y-4">
          <div className="h-2 w-24 rounded-full bg-muted animate-pulse" />
          <div className="h-48 rounded-2xl bg-muted animate-pulse" />
        </div>
      </div>
    )
  }

  if (done || due.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 flex flex-col items-center text-center gap-4">
        <div className="flex size-16 items-center justify-center rounded-2xl bg-primary/10">
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden>
            <path
              d="M5 14.5l6.5 6.5L23 8"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-primary"
            />
          </svg>
        </div>

        <div>
          <h1 className="font-heading text-2xl font-semibold tracking-tight">
            {done ? "Session complete!" : "All caught up"}
          </h1>
          <p className="mt-1.5 text-sm text-muted-foreground">
            {done
              ? `You reviewed ${due.length} snippet${due.length !== 1 ? "s" : ""}. Come back tomorrow for the next round.`
              : "No snippets are due for review right now. Save more snippets to grow your library."}
          </p>
        </div>

        <div className="flex gap-2 mt-2">
          <Link
            href="/dashboard"
            className="inline-flex h-9 items-center rounded-4xl bg-primary px-4 text-sm font-medium text-primary-foreground active:scale-[0.96] transition-[transform,opacity] duration-100"
          >
            Go to dashboard
          </Link>
          <Link
            href="/new"
            className="inline-flex h-9 items-center rounded-4xl border border-border bg-background px-4 text-sm font-medium text-foreground hover:bg-muted active:scale-[0.96] transition-[transform,background-color,opacity] duration-100"
          >
            Save a snippet
          </Link>
        </div>
      </div>
    )
  }

  const current = due[index]

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6">
      <div className="mb-6">
        <h1 className="font-heading text-lg font-semibold tracking-tight">Review</h1>
        <p className="mt-0.5 text-sm text-muted-foreground">
          <span className="tabular-nums">{due.length}</span>{" "}
          snippet{due.length !== 1 ? "s" : ""} due today
        </p>
      </div>

      {submitError && (
        <div className="rounded-xl border border-destructive/30 bg-destructive/8 px-4 py-3 text-sm text-destructive">
          {submitError}
        </div>
      )}

      <ReviewCard
        key={current.id}
        snippet={current}
        index={index}
        total={due.length}
        onRate={(rating) => handleRate(current, rating)}
        submittingRating={submittingRating}
      />
    </div>
  )
}
