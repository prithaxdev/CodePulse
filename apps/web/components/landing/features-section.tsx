import type { ReactNode } from "react"
import { SearchIcon, TriangleAlertIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { HairlineFigure } from "./hairline-figure"

// Every value in the mock UIs is real output: the review intervals and ease
// come from sm2.py for a first review, the duplicate pair scores 88% in
// duplicate.py, and the threshold is the API default.

const ratings = [
  { label: "Forgot", next: "1 day" },
  { label: "Hard", next: "2 days" },
  { label: "Easy", next: "4 days", picked: true },
]

const results = [
  { title: "useEffect cleanup", score: 0.82 },
  { title: "clearTimeout on unmount", score: 0.47 },
  { title: "AbortController in fetch", score: 0.21 },
]

const thread = [
  "useCallback vs useMemo, in three posts.",
  "useCallback memoizes the function itself, not what it returns.",
  "useMemo is for the expensive value. Measure before reaching for either.",
]

const secondary = [
  {
    title: "Language auto-detect",
    description: "Paste code and the language fills itself in. Nine languages.",
  },
  {
    title: "Prerequisite links",
    description: "Each snippet lists what it builds on and what needs it.",
  },
  {
    title: "Daily reminder",
    description: "One email on the days you have reviews due.",
  },
  {
    title: "Export anytime",
    description: "Every snippet and review, downloaded as JSON.",
  },
]

const code = "font-(family-name:--font-ibm-plex) text-[0.75rem] leading-relaxed"

function FeatureCard({
  title,
  file,
  description,
  split = false,
  className,
  children,
}: {
  title: string
  file: string
  description: string
  split?: boolean
  className?: string
  children: ReactNode
}) {
  return (
    <article
      className={cn(
        "flex min-w-0 flex-col gap-7 rounded-2xl border bg-card p-6 md:p-7",
        split && "lg:flex-row lg:gap-10",
        className
      )}
    >
      <div
        className={cn("flex flex-col gap-2", split && "lg:w-64 lg:shrink-0")}
      >
        <div className="flex items-baseline justify-between gap-4">
          <h3 className="text-[1.0625rem] font-semibold tracking-[-0.01em] text-foreground">
            {title}
          </h3>
          <span className="shrink-0 font-mono text-xs text-muted-foreground">
            {file}
          </span>
        </div>
        <p className="text-sm leading-relaxed text-muted-foreground">
          {description}
        </p>
      </div>
      <div className={cn("mt-auto", split && "lg:mt-0 lg:min-w-0 lg:flex-1")}>
        {children}
      </div>
    </article>
  )
}

function ReviewMock() {
  return (
    <div
      aria-hidden="true"
      className="flex flex-col gap-3 rounded-xl border bg-background p-4"
    >
      <div className="flex items-center justify-between gap-3 text-xs">
        <span className="font-medium text-foreground">useEffect cleanup</span>
        <span className="rounded-md bg-muted px-2 py-0.5 text-muted-foreground">
          TypeScript
        </span>
      </div>
      <code
        className={cn(
          "block overflow-x-auto rounded-lg bg-muted/60 px-3.5 py-3 whitespace-pre text-muted-foreground",
          code
        )}
      >
        <span className="text-chart-5">useEffect</span>
        {"(() => {\n  const id = "}
        <span className="text-primary">setInterval</span>
        {"(tick, 1000)\n  "}
        <span className="text-chart-5">return</span>
        {" () => "}
        <span className="text-primary">clearInterval</span>
        {"(id)\n}, [])"}
      </code>
      <div className="grid grid-cols-3 gap-2">
        {ratings.map((rating) => (
          <div
            key={rating.label}
            className={cn(
              "flex flex-col items-center gap-0.5 rounded-lg border px-2 py-2",
              rating.picked && "border-primary/50 bg-primary/5"
            )}
          >
            <span className="text-xs text-foreground">{rating.label}</span>
            <span className="font-mono text-[0.6875rem] text-muted-foreground tabular-nums">
              {rating.next}
            </span>
          </div>
        ))}
      </div>
      <p className="font-mono text-[0.6875rem] text-muted-foreground tabular-nums">
        Easy · next review in 4 days · ease 2.5 → 2.6
      </p>
    </div>
  )
}

function SearchMock() {
  return (
    <div aria-hidden="true" className="flex flex-col gap-1">
      <div className="mb-2 flex items-center gap-2.5 rounded-lg border bg-background px-3 py-2.5 text-sm">
        <SearchIcon size={14} className="shrink-0 text-muted-foreground" />
        <span className="text-foreground">cleanup interval</span>
      </div>
      {results.map((result, i) => (
        <div key={result.title} className="flex flex-col gap-2 px-3 py-2">
          <div className="flex items-baseline justify-between gap-3 text-sm">
            <span
              className={i === 0 ? "text-foreground" : "text-muted-foreground"}
            >
              {result.title}
            </span>
            <span className="font-mono text-xs text-muted-foreground tabular-nums">
              {result.score.toFixed(2)}
            </span>
          </div>
          <div className="h-0.5 rounded-full bg-border">
            <div
              className={cn(
                "h-full rounded-full",
                i === 0 ? "bg-primary" : "bg-muted-foreground/40"
              )}
              style={{ width: `${result.score * 100}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  )
}

function DuplicateMock() {
  return (
    <div aria-hidden="true" className="flex flex-col gap-3">
      <code
        className={cn(
          "block overflow-x-auto rounded-lg border bg-background px-3.5 py-3 whitespace-pre text-muted-foreground",
          code
        )}
      >
        {"clearInterval("}
        <span className="rounded-sm bg-muted px-0.5 text-foreground">id</span>
        {")     saved\nclearInterval("}
        <span className="rounded-sm bg-primary/15 px-0.5 text-foreground">
          timer
        </span>
        {")  new"}
      </code>
      <div className="flex items-start gap-2.5 rounded-lg border border-pulse/30 bg-pulse/10 px-3.5 py-3">
        <span className="mt-px grid size-4.5 shrink-0 place-items-center rounded-full bg-pulse text-pulse-foreground">
          <TriangleAlertIcon size={11} strokeWidth={2.5} />
        </span>
        <div className="flex flex-col gap-0.5 text-xs">
          <span className="text-foreground">
            88% similar to “useEffect cleanup”
          </span>
          <span className="text-muted-foreground">
            Flagged above 85%. Save anyway?
          </span>
        </div>
      </div>
    </div>
  )
}

function ThreadMock() {
  return (
    <ol aria-hidden="true" className="flex flex-col gap-1">
      {thread.map((post, i) => (
        <li
          key={post}
          className={cn(
            "flex gap-3 rounded-lg px-3 py-2.5 text-xs leading-relaxed",
            i === 0
              ? "border bg-background text-foreground"
              : "text-muted-foreground"
          )}
        >
          <span className="font-mono text-muted-foreground tabular-nums">
            {i + 1}/{thread.length}
          </span>
          {post}
        </li>
      ))}
    </ol>
  )
}

export function FeaturesSection() {
  return (
    <section id="features" className="mx-auto max-w-300 px-6 py-24">
      <h2 className="mb-12 max-w-2xl text-3xl font-medium tracking-tight text-balance text-foreground md:text-5xl">
        Everything your memory needs.{" "}
        <span className="text-muted-foreground">Nothing it doesn&apos;t.</span>
      </h2>

      <div className="grid grid-cols-1 gap-3.5 md:grid-cols-6 lg:grid-cols-12">
        <FeatureCard
          split
          title="Spaced repetition"
          file="sm2.py"
          description="SM-2, the scheduler Anki was built on, decides when each snippet comes back: soon after a miss, further out each time you remember it."
          className="md:col-span-6 lg:col-span-7"
        >
          <ReviewMock />
        </FeatureCard>

        <FeatureCard
          title="Search by relevance"
          file="tfidf.py"
          description="Results are ranked by how much they share with your query, not by whether one keyword matches."
          className="md:col-span-6 lg:col-span-5"
        >
          <SearchMock />
        </FeatureCard>

        <FeatureCard
          title="No duplicate clutter"
          file="duplicate.py"
          description="Edit distance catches a snippet you already saved, even when the variable names changed."
          className="md:col-span-3 lg:col-span-4"
        >
          <DuplicateMock />
        </FeatureCard>

        <FeatureCard
          title="Topics sort themselves"
          file="clustering.py"
          description="k-means groups related snippets into clusters. No manual tagging."
          className="md:col-span-3 lg:col-span-4"
        >
          <HairlineFigure
            name="settle"
            tag="k-means"
            label="Scattered tiles sliding into an ordered tree around a hub"
          />
        </FeatureCard>

        <FeatureCard
          title="Clusters into threads"
          file="summarizer.py"
          description="Draft a thread from any topic cluster, edit each point, then copy it out."
          className="md:col-span-6 lg:col-span-4"
        >
          <ThreadMock />
        </FeatureCard>
      </div>

      <dl className="mt-3.5 grid gap-px overflow-hidden rounded-2xl border bg-border sm:grid-cols-2 lg:grid-cols-4">
        {secondary.map((item) => (
          <div
            key={item.title}
            className="flex flex-col gap-1.5 bg-background p-6"
          >
            <dt className="text-sm font-medium text-foreground">
              {item.title}
            </dt>
            <dd className="text-sm leading-relaxed text-muted-foreground">
              {item.description}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  )
}
