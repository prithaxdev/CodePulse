import Link from "next/link"

export type DependencySnippet = {
  id: string
  title: string
  language: string
  confidence: number
}

type Props = {
  prerequisites: DependencySnippet[]
  dependents: DependencySnippet[]
}

export function DependencyGraph({ prerequisites, dependents }: Props) {
  if (prerequisites.length === 0 && dependents.length === 0) return null

  return (
    <div className="rounded-2xl border border-border bg-card overflow-hidden">
      <div className="px-5 py-3.5 border-b border-border">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
          Knowledge graph
        </h2>
      </div>
      <div className="divide-y divide-border">
        {prerequisites.length > 0 && (
          <DependencySection
            label="Builds on"
            description="Prerequisite concepts this snippet depends on"
            snippets={prerequisites}
          />
        )}
        {dependents.length > 0 && (
          <DependencySection
            label="Needed by"
            description="Concepts that build on top of this snippet"
            snippets={dependents}
          />
        )}
      </div>
    </div>
  )
}

function DependencySection({
  label,
  description,
  snippets,
}: {
  label: string
  description: string
  snippets: DependencySnippet[]
}) {
  return (
    <div className="px-5 py-4">
      <div className="mb-3">
        <span className="text-xs font-semibold text-foreground">{label}</span>
        <p className="mt-0.5 text-[11px] text-muted-foreground">{description}</p>
      </div>
      <ul className="space-y-2">
        {snippets.map((s) => (
          <li key={s.id}>
            <Link
              href={`/snippets/${s.id}`}
              className="flex items-center justify-between gap-3 rounded-lg border border-border bg-muted/30 px-3 py-2.5 transition-colors hover:bg-muted/60"
            >
              <div className="min-w-0">
                <span className="block truncate text-[13px] font-medium text-foreground">
                  {s.title}
                </span>
                <span className="font-mono text-[11px] text-muted-foreground">{s.language}</span>
              </div>
              <span className="shrink-0 tabular-nums text-[11px] text-muted-foreground">
                {Math.round(s.confidence * 100)}% match
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
