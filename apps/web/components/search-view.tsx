"use client"

import { useRef, useState } from "react"
import Link from "next/link"
import { useSnippets } from "@/hooks/use-snippets"
import { useSearch } from "@/hooks/use-search"
import { cn } from "@/lib/utils"

export function SearchView() {
  const [inputValue, setInputValue] = useState("")
  const [debouncedQuery, setDebouncedQuery] = useState("")
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const { data: snippets = [], isLoading: snippetsLoading } = useSnippets()
  const { data: results = [], isFetching } = useSearch(debouncedQuery, snippets)

  const handleChange = (value: string) => {
    setInputValue(value)
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    timeoutRef.current = setTimeout(() => setDebouncedQuery(value), 300)
  }

  const isSearching = debouncedQuery.trim().length >= 2
  const isEmpty = isSearching && !isFetching && results.length === 0

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6">
      <div className="mb-6">
        <h1 className="font-heading text-lg font-semibold tracking-tight">Search</h1>
        <p className="mt-0.5 text-sm text-muted-foreground">
          Find snippets by title, code, description, or tags
        </p>
      </div>

      {/* ── Search input ─────────────────────────────────────── */}
      <div className="relative mb-6">
        <svg
          className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground"
          viewBox="0 0 16 16"
          fill="none"
          aria-hidden
        >
          <circle cx="6.5" cy="6.5" r="4.5" stroke="currentColor" strokeWidth="1.5" />
          <path d="M10 10.5l3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>

        <input
          type="search"
          value={inputValue}
          onChange={(e) => handleChange(e.target.value)}
          placeholder="Search your snippets…"
          autoFocus
          className={cn(
            "w-full rounded-xl border border-border bg-card py-2.5 pl-10 pr-10",
            "text-sm text-foreground placeholder:text-muted-foreground/60",
            "outline-none ring-0 focus:border-primary/50 focus:ring-2 focus:ring-primary/15",
            "transition-[border-color,box-shadow] duration-150",
          )}
        />

        {/* Inline spinner while TF-IDF call is in-flight */}
        {isFetching && (
          <svg
            className="absolute right-3.5 top-1/2 -translate-y-1/2 size-4 animate-spin text-muted-foreground"
            viewBox="0 0 24 24"
            fill="none"
            aria-label="Searching"
          >
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
        )}
      </div>

      {/* ── Results / states ─────────────────────────────────── */}
      {!isSearching && (
        <SearchHint snippetCount={snippets.length} loading={snippetsLoading} />
      )}

      {isEmpty && (
        <div className="py-16 text-center">
          <p className="text-sm font-medium text-foreground">No results for &ldquo;{debouncedQuery}&rdquo;</p>
          <p className="mt-1 text-xs text-muted-foreground">
            Try different keywords, or check the spelling
          </p>
        </div>
      )}

      {results.length > 0 && (
        <ul className="flex flex-col divide-y divide-border rounded-2xl border border-border bg-card overflow-hidden">
          {results.map((result) => (
            <li key={result.snippet_id}>
              <Link
                href={`/snippets/${result.snippet_id}`}
                className="group flex flex-col gap-3 px-5 py-4 hover:bg-muted/40 transition-colors duration-100"
              >
                {/* Top row: title + score */}
                <div className="flex items-start gap-3">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-1.5 mb-1.5">
                      <span className="rounded-md bg-muted/60 px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground">
                        {result.snippet.language}
                      </span>
                      {result.snippet.tags.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className="rounded-md bg-primary/10 px-1.5 py-0.5 text-[10px] font-medium text-primary"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    <h2 className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors duration-100 leading-snug">
                      {result.snippet.title}
                    </h2>
                    {result.snippet.description && (
                      <p className="mt-0.5 text-xs text-muted-foreground line-clamp-1">
                        {result.snippet.description}
                      </p>
                    )}
                  </div>

                  {/* Similarity score */}
                  <ScoreBadge score={result.similarity_score} />
                </div>

                {/* Code preview */}
                {result.snippet.code && (
                  <CodePreview code={result.snippet.code} />
                )}

                {/* Date */}
                <p className="text-[11px] text-muted-foreground/60">
                  Saved {formatDate(result.snippet.created_at)}
                </p>
              </Link>
            </li>
          ))}
        </ul>
      )}

      {results.length > 0 && (
        <p className="mt-3 text-center text-xs text-muted-foreground">
          {results.length} result{results.length !== 1 ? "s" : ""} ranked by relevance
        </p>
      )}
    </div>
  )
}

// ── Sub-components ────────────────────────────────────────────

function SearchHint({ snippetCount, loading }: { snippetCount: number; loading: boolean }) {
  if (loading) {
    return (
      <div className="py-12 flex flex-col items-center gap-3">
        <div className="h-2 w-40 rounded-full bg-muted animate-pulse" />
        <div className="h-2 w-28 rounded-full bg-muted animate-pulse" />
      </div>
    )
  }

  if (snippetCount === 0) {
    return (
      <div className="py-16 text-center">
        <p className="text-sm font-medium text-foreground">No snippets yet</p>
        <p className="mt-1 text-xs text-muted-foreground">
          Save your first snippet to start searching
        </p>
      </div>
    )
  }

  return (
    <div className="py-12 text-center">
      <p className="text-xs text-muted-foreground">
        Searching across{" "}
        <span className="font-medium text-foreground tabular-nums">{snippetCount}</span>{" "}
        snippet{snippetCount !== 1 ? "s" : ""}
      </p>
    </div>
  )
}

function ScoreBadge({ score }: { score: number }) {
  const pct = Math.round(score * 100)
  const color =
    pct >= 70 ? "text-primary bg-primary/10" :
    pct >= 40 ? "text-pulse bg-pulse/10" :
    "text-muted-foreground bg-muted/60"

  return (
    <span className={cn("shrink-0 rounded-lg px-2 py-0.5 font-mono text-[11px] font-semibold tabular-nums", color)}>
      {pct}%
    </span>
  )
}

function CodePreview({ code }: { code: string }) {
  const lines = code.split("\n").slice(0, 3)
  const preview = lines.join("\n")
  const truncated = code.split("\n").length > 3

  return (
    <pre className="overflow-hidden rounded-lg bg-muted/50 px-3 py-2.5 font-mono text-[11px] leading-relaxed text-muted-foreground">
      <code>{preview}{truncated ? "\n…" : ""}</code>
    </pre>
  )
}

function formatDate(iso: string): string {
  const d = new Date(iso)
  const now = new Date()
  const diffDays = Math.floor((now.getTime() - d.getTime()) / 86_400_000)

  if (diffDays === 0) return "today"
  if (diffDays === 1) return "yesterday"
  if (diffDays < 7) return `${diffDays} days ago`
  if (diffDays < 30) return `${Math.floor(diffDays / 7)}w ago`
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" })
}
