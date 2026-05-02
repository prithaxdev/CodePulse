"use client"

import { useEffect, useRef, useState } from "react"
import { cn } from "@/lib/utils"
import { Dialog, DialogClose, DialogContent, DialogTitle } from "@/components/ui/dialog"
import type { ClusterWithSnippets } from "@/hooks/use-clusters"
import type { ThreadPoint } from "@/types/api"

// ── Helpers ───────────────────────────────────────────────────────────
const TWEET_LIMIT = 280

function charColor(len: number) {
  if (len <= 240) return "text-muted-foreground"
  if (len <= 260) return "text-yellow-500"
  return "text-red-500"
}

// ── Clipboard icon (inline, no dep) ──────────────────────────────────
function CopyIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      aria-hidden
      className={className}
    >
      <rect x="7" y="7" width="10" height="11" rx="2" strokeLinecap="round" strokeLinejoin="round" />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M13 7V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2"
      />
    </svg>
  )
}

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      aria-hidden
      className={className}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 10l4 4 8-8" />
    </svg>
  )
}

// ── Single tweet card ─────────────────────────────────────────────────
function TweetCard({
  index,
  text,
  onChange,
}: {
  index: number
  text: string
  onChange: (val: string) => void
}) {
  const [copied, setCopied] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  function autoResize() {
    const el = textareaRef.current
    if (!el) return
    el.style.height = "auto"
    el.style.height = `${el.scrollHeight}px`
  }

  useEffect(() => {
    autoResize()
  }, [text])

  async function handleCopy() {
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 1800)
  }

  const over = text.length > TWEET_LIMIT

  return (
    <div
      className={cn(
        "group relative rounded-xl border bg-card transition-colors duration-150",
        over ? "border-red-500/40 bg-red-500/[0.03]" : "border-border hover:border-border/80",
      )}
    >
      {/* number pill + copy */}
      <div className="flex items-center justify-between px-4 pt-3 pb-1">
        <span className="font-mono text-[10px] font-semibold tabular-nums text-muted-foreground/60 select-none">
          {String(index + 1).padStart(2, "0")}
        </span>
        <button
          type="button"
          onClick={handleCopy}
          aria-label="Copy tweet"
          className={cn(
            "flex h-6 w-6 items-center justify-center rounded-md transition-all duration-150",
            "opacity-0 group-hover:opacity-100 focus-visible:opacity-100",
            copied
              ? "text-green-500"
              : "text-muted-foreground hover:bg-accent hover:text-foreground",
          )}
        >
          {copied ? <CheckIcon className="size-3.5" /> : <CopyIcon className="size-3.5" />}
        </button>
      </div>

      {/* editable content */}
      <textarea
        ref={textareaRef}
        value={text}
        onChange={(e) => {
          onChange(e.target.value)
          autoResize()
        }}
        rows={1}
        className={cn(
          "w-full resize-none bg-transparent px-4 pb-2 text-sm leading-relaxed text-foreground",
          "outline-none placeholder:text-muted-foreground/40",
        )}
        placeholder="Write your tweet…"
        spellCheck
      />

      {/* char counter — only show near limit */}
      {text.length > 220 && (
        <div className={cn("px-4 pb-2 text-right font-mono text-[10px] tabular-nums", charColor(text.length))}>
          {TWEET_LIMIT - text.length}
        </div>
      )}
    </div>
  )
}

// ── Skeleton while loading ─────────────────────────────────────────────
function ThreadSkeleton() {
  return (
    <div className="space-y-3">
      {[80, 120, 100, 90].map((w, i) => (
        <div
          key={i}
          className="animate-pulse rounded-xl border border-border bg-card p-4"
          style={{ animationDelay: `${i * 80}ms` }}
        >
          <div className="h-2.5 w-6 rounded-full bg-muted mb-3" />
          <div className="space-y-1.5">
            <div className="h-2.5 rounded-full bg-muted" style={{ width: `${w}%` }} />
            <div className="h-2.5 rounded-full bg-muted" style={{ width: `${Math.max(40, w - 25)}%` }} />
          </div>
        </div>
      ))}
    </div>
  )
}

// ── Error state ────────────────────────────────────────────────────────
function ThreadError({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-red-500/10">
        <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth={1.5} className="size-5 text-red-500" aria-hidden>
          <path strokeLinecap="round" strokeLinejoin="round" d="M10 6v5m0 3h.01M4.07 16h11.86A2 2 0 0 0 17.74 13L11.87 3a2.25 2.25 0 0 0-3.74 0L2.26 13a2 2 0 0 0 1.81 3Z" />
        </svg>
      </div>
      <p className="text-sm font-medium text-foreground">Failed to generate thread</p>
      <p className="mt-1 text-xs text-muted-foreground">Make sure the algorithm API is running</p>
      <button
        type="button"
        onClick={onRetry}
        className="mt-4 rounded-lg bg-muted px-4 py-1.5 text-xs font-medium text-foreground hover:bg-accent transition-colors duration-150"
      >
        Try again
      </button>
    </div>
  )
}

// ── Public component ──────────────────────────────────────────────────
export interface ThreadDraftProps {
  cluster: ClusterWithSnippets | null
  points: ThreadPoint[] | undefined
  isLoading: boolean
  isError: boolean
  onRetry: () => void
  onClose: () => void
}

export function ThreadDraft({
  cluster,
  points,
  isLoading,
  isError,
  onRetry,
  onClose,
}: ThreadDraftProps) {
  const [drafts, setDrafts] = useState<string[]>([])
  const [allCopied, setAllCopied] = useState(false)

  // sync drafts when new points arrive
  useEffect(() => {
    if (points) setDrafts(points.map((p) => p.point))
  }, [points])

  function updateDraft(i: number, val: string) {
    setDrafts((prev) => {
      const next = [...prev]
      next[i] = val
      return next
    })
  }

  async function copyAll() {
    const text = drafts
      .map((d, i) => `${i + 1}/ ${d}`)
      .join("\n\n")
    await navigator.clipboard.writeText(text)
    setAllCopied(true)
    setTimeout(() => setAllCopied(false), 2000)
  }

  const isOpen = cluster !== null

  return (
    <Dialog open={isOpen} onOpenChange={(open) => { if (!open) onClose() }}>
      <DialogContent
        showCloseButton={false}
        className={cn(
          "flex max-h-[85dvh] w-full max-w-lg flex-col gap-0 overflow-hidden",
          "rounded-2xl border border-border bg-background p-0",
        )}
      >
        {/* ── Header ── */}
        <div className="flex items-center gap-2 border-b border-border px-4 py-3">
          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-primary/10">
            <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth={1.5} className="size-4 text-primary" aria-hidden>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
            </svg>
          </div>
          <div className="min-w-0 flex-1">
            <DialogTitle className="truncate font-heading text-sm font-semibold capitalize text-foreground">
              {cluster?.label ?? "Thread draft"}
            </DialogTitle>
            <p className="text-[11px] text-muted-foreground">
              {drafts.length > 0
                ? `${drafts.length} tweet${drafts.length !== 1 ? "s" : ""} · edit before posting`
                : "Generating from cluster snippets…"}
            </p>
          </div>

          {/* copy all — only shown when there are drafts */}
          {drafts.length > 0 && (
            <button
              type="button"
              onClick={copyAll}
              className={cn(
                "flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-[11px] font-medium transition-all duration-150",
                allCopied
                  ? "bg-green-500/10 text-green-500"
                  : "bg-muted text-foreground hover:bg-accent",
              )}
            >
              {allCopied ? (
                <>
                  <CheckIcon className="size-3" />
                  Copied!
                </>
              ) : (
                <>
                  <CopyIcon className="size-3" />
                  Copy all
                </>
              )}
            </button>
          )}

          {/* explicit close — no overlap with dialog's built-in button */}
          <DialogClose
            className={cn(
              "flex h-7 w-7 shrink-0 items-center justify-center rounded-lg",
              "text-muted-foreground hover:bg-accent hover:text-foreground",
              "transition-colors duration-150",
            )}
            aria-label="Close"
          >
            <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth={1.75} aria-hidden className="size-3.5">
              <path strokeLinecap="round" d="M3 3l10 10M13 3L3 13" />
            </svg>
          </DialogClose>
        </div>

        {/* ── Body ── */}
        <div className="flex-1 overflow-y-auto px-5 py-4">
          {isLoading && <ThreadSkeleton />}
          {isError && <ThreadError onRetry={onRetry} />}
          {!isLoading && !isError && drafts.length > 0 && (
            <div className="space-y-3">
              {drafts.map((text, i) => (
                <TweetCard
                  key={i}
                  index={i}
                  text={text}
                  onChange={(val) => updateDraft(i, val)}
                />
              ))}
            </div>
          )}
        </div>

        {/* ── Footer hint ── */}
        {!isLoading && !isError && drafts.length > 0 && (
          <div className="border-t border-border px-5 py-3">
            <p className="text-center text-[11px] text-muted-foreground/60">
              Generated by extractive summarization · edit freely
            </p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
