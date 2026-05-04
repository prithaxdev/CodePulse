"use client"

import { useRef, useState, useEffect } from "react"
import Link from "next/link"
import { HugeiconsIcon } from "@hugeicons/react"
import { Search01Icon, LoaderPinwheelIcon, ArrowLeft01Icon, ArrowRight01Icon } from "@hugeicons/core-free-icons"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useSnippets } from "@/hooks/use-snippets"
import { useSearch } from "@/hooks/use-search"
import { cn } from "@/lib/utils"
const PAGE_SIZE = 8

export function SearchView() {
  const [inputValue, setInputValue] = useState("")
  const [debouncedQuery, setDebouncedQuery] = useState("")
  const [page, setPage] = useState(1)
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const { data: snippets = [], isLoading: snippetsLoading } = useSnippets()
  const { data: results = [], isFetching } = useSearch(debouncedQuery, snippets)

  const handleChange = (value: string) => {
    setInputValue(value)
    setPage(1)
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    timeoutRef.current = setTimeout(() => setDebouncedQuery(value), 300)
  }

  const isSearching = debouncedQuery.trim().length >= 2
  const isEmpty = isSearching && !isFetching && results.length === 0

  // reset to page 1 whenever results change
  useEffect(() => { setPage(1) }, [debouncedQuery])

  // browsing mode — all snippets sorted newest first
  const browseItems = [...snippets].sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
  )

  // pick the active list
  const activeList = isSearching ? results.map((r) => ({ ...r.snippet, _score: r.similarity_score })) : browseItems.map((s) => ({ ...s, _score: undefined }))
  const totalPages = Math.max(1, Math.ceil(activeList.length / PAGE_SIZE))
  const paginated = activeList.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

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

      {/* ── Empty / loading states ───────────────────────── */}
      {snippetsLoading ? (
        <div className="flex flex-col gap-2.5">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-24 animate-pulse rounded-2xl bg-muted/50" />
          ))}
        </div>
      ) : snippets.length === 0 ? (
        <div className="py-16 text-center">
          <p className="text-sm font-medium">No snippets yet</p>
          <p className="mt-1 text-xs text-muted-foreground">
            Save your first snippet to start searching
          </p>
        </div>
      ) : isEmpty ? (
        <div className="py-16 text-center">
          <p className="text-sm font-medium">
            No results for &ldquo;{debouncedQuery}&rdquo;
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            Try different keywords, or check the spelling
          </p>
        </div>
      ) : (
        <>
          {/* ── List ─────────────────────────────────────── */}
          <ul className="flex flex-col divide-y divide-border overflow-hidden rounded-2xl border border-border bg-card">
            {paginated.map((item) => (
              <li key={item.id}>
                <Link
                  href={`/snippets/${item.id}`}
                  className="group flex flex-col gap-3 px-5 py-4 transition-colors duration-100 hover:bg-muted/40"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <div className="mb-1.5 flex flex-wrap items-center gap-1.5">
                        <Badge variant="outline" className="font-mono text-[10px]">
                          {item.language}
                        </Badge>
                        {item.tags.slice(0, 3).map((tag) => (
                          <Badge key={tag} variant="secondary" className="text-[10px]">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                      <h2 className="text-sm font-semibold leading-snug text-foreground text-wrap-balance transition-colors duration-100 group-hover:text-primary">
                        {item.title}
                      </h2>
                      {item.description && (
                        <p className="mt-0.5 line-clamp-1 text-xs text-muted-foreground">
                          {item.description}
                        </p>
                      )}
                    </div>
                    {item._score !== undefined && <ScoreBadge score={item._score} />}
                  </div>

                  {item.code && <CodePreview code={item.code} />}

                  <p className="text-[11px] tabular-nums text-muted-foreground/60">
                    Saved {formatDate(item.created_at)}
                  </p>
                </Link>
              </li>
            ))}
          </ul>

          {/* ── Pagination ───────────────────────────────── */}
          <div className="mt-4 flex items-center justify-between gap-3">
            <p className="text-xs tabular-nums text-muted-foreground">
              {isSearching
                ? `${activeList.length} result${activeList.length !== 1 ? "s" : ""} · ranked by relevance`
                : `${activeList.length} snippet${activeList.length !== 1 ? "s" : ""}`}
            </p>

            {totalPages > 1 && (
              <div className="flex items-center gap-1.5">
                <Button
                  variant="outline"
                  size="icon-sm"
                  disabled={page === 1}
                  onClick={() => setPage((p) => p - 1)}
                  aria-label="Previous page"
                >
                  <HugeiconsIcon icon={ArrowLeft01Icon} size={14} strokeWidth={2} />
                </Button>

                <span className="min-w-16 text-center text-xs tabular-nums text-muted-foreground">
                  {page} / {totalPages}
                </span>

                <Button
                  variant="outline"
                  size="icon-sm"
                  disabled={page === totalPages}
                  onClick={() => setPage((p) => p + 1)}
                  aria-label="Next page"
                >
                  <HugeiconsIcon icon={ArrowRight01Icon} size={14} strokeWidth={2} />
                </Button>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  )
}

// ── Sub-components ───────────────────────────────────────────

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
