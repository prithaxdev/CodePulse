export const dynamic = "force-dynamic"

// SnippetEditor is a pure-client interactive form (CodeMirror, API calls,
// TanStack Form). Disabling SSR removes it from the hydration pass entirely,
// which eliminates the Base UI Select ID mismatches that occur when
// TanStack Form's internal fiber boundaries differ between the server and
// client renders.
import nextDynamic from "next/dynamic"

const SnippetEditor = nextDynamic(
  () => import("@/components/snippet-editor").then((m) => m.SnippetEditor),
  {
    ssr: false,
    loading: () => (
      <div className="h-[520px] animate-pulse rounded-2xl border border-border bg-card" />
    ),
  }
)

export default function NewSnippetPage() {
  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-5">
        <h1 className="font-heading text-lg font-semibold tracking-tight">New Snippet</h1>
        <p className="mt-0.5 text-sm text-muted-foreground">Save a code snippet to your library</p>
      </div>
      <SnippetEditor />
    </div>
  )
}
