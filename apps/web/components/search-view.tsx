"use client"

import { useRef, useState } from "react"
import Link from "next/link"
import { HugeiconsIcon } from "@hugeicons/react"
import { Search01Icon, LoaderPinwheelIcon } from "@hugeicons/core-free-icons"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
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
        <h1 className="font-heading text-lg font-semibold tracking-tight text-wrap-balance">
          Search
        </h1>
        <p className="mt-0.5 text-sm text-muted-foreground">
          Find snippets by title, code, description, or tags
        </p>
      </div>

      {/* ── Search input ─────────────────────────────────── */}
      <div className="relative mb-6">
        <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
          <HugeiconsIcon icon={Search01Icon} size={15} strokeWidth={2} />
        </div>
        <Input
          type="search"
          value={inputValue}
          onChange={(e) => handleChange(e.target.value)}
          placeholder="Search your snippets…"
          autoFocus
          className="pl-8 pr-9"
        />
        {isFetching && (
          <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
            <HugeiconsIcon icon={LoaderPinwheelIcon} size={15} strokeWidth={2} className="animate-spin" />
          </div>
        )}
      </div>

      {/* ── States ───────────────────────────────────────── */}
      {!isSearching ? (
        <SearchHint snippetCount={snippets.length} loading={snippetsLoading} />
      ) : isEmpty ? (
        <div className="py-16 text-center">
          <p className="text-sm font-medium text-foreground">
            No results for &ldquo;{debouncedQuery}&rdquo;
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            Try different keywords, or check the spelling
          </p>
        </div>
      ) : null}

      {/* ── Results list ─────────────────────────────────── */}
      {results.length > 0 && (
        <>
          <ul className="flex flex-col divide-y divide-border rounded-2xl border border-border bg-card overflow-hidden">
            {results.map((result) => (
              <li key={result.snippet_id}>
                <Link
                  href={`/snippets/${result.snippet_id}`}
                  className="group flex flex-col gap-3 px-5 py-4 transition-colors duration-100 hover:bg-muted/40"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <div className="mb-1.5 flex flex-wrap items-center gap-1.5">
                        <Badge variant="outline" className="font-mono text-[10px]">
                          {result.snippet.language}
                        </Badge>
                        {result.snippet.tags.slice(0, 3).map((tag) => (
                          <Badge key={tag} variant="secondary" className="text-[10px]">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                      <h2 className="text-sm font-semibold leading-snug text-foreground text-wrap-balance transition-colors duration-100 group-hover:text-primary">
                        {result.snippet.title}
                      </h2>
                      {result.snippet.description && (
                        <p className="mt-0.5 line-clamp-1 text-xs text-muted-foreground">
                          {result.snippet.description}
                        </p>
                      )}
                    </div>
                    <ScoreBadge score={result.similarity_score} />
                  </div>

                  {result.snippet.code && <CodePreview code={result.snippet.code} />}

                  <p className="text-[11px] tabular-nums text-muted-foreground/60">
                    Saved {formatDate(result.snippet.created_at)}
                  </p>
                </Link>
              </li>
            ))}
          </ul>

          <p className="mt-3 text-center text-xs tabular-nums text-muted-foreground">
            {results.length} result{results.length !== 1 ? "s" : ""} ranked by relevance
          </p>
        </>
      )}
    </div>
  )
}

// ── Sub-components (module-level, never inline) ───────────────

function SearchHint({ snippetCount, loading }: { snippetCount: number; loading: boolean }) {
  if (loading) {
    return (
      <div className="flex flex-col items-center gap-3 py-12">
        <div className="h-2 w-40 animate-pulse rounded-full bg-muted" />
        <div className="h-2 w-28 animate-pulse rounded-full bg-muted" />
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
        <span className="tabular-nums font-medium text-foreground">{snippetCount}</span>{" "}
        snippet{snippetCount !== 1 ? "s" : ""}
      </p>
    </div>
  )
}

function ScoreBadge({ score }: { score: number }) {
  const pct = Math.round(score * 100)
  return (
    <Badge
      className={cn(
        "shrink-0 font-mono tabular-nums border-transparent",
        pct >= 70
          ? "bg-primary/10 text-primary"
          : pct >= 40
          ? "bg-pulse/10 text-pulse"
          : "bg-muted text-muted-foreground",
      )}
    >
      {pct}%
    </Badge>
  )
}

function CodePreview({ code }: { code: string }) {
  const lines = code.split("\n")
  const preview = lines.slice(0, 3).join("\n")
  const truncated = lines.length > 3
  return (
    <pre className="overflow-hidden rounded-xl bg-muted/50 px-3 py-2.5 font-mono text-[11px] leading-relaxed text-muted-foreground">
      <code>{preview}{truncated ? "\n…" : ""}</code>
    </pre>
  )
}

function formatDate(iso: string): string {
  const d = new Date(iso)
  const diffDays = Math.floor((Date.now() - d.getTime()) / 86_400_000)
  if (diffDays === 0) return "today"
  if (diffDays === 1) return "yesterday"
  if (diffDays < 7) return `${diffDays} days ago`
  if (diffDays < 30) return `${Math.floor(diffDays / 7)}w ago`
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" })
}
