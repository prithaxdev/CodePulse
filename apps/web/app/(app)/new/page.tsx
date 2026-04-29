export const dynamic = "force-dynamic"

import { SnippetEditor } from "@/components/snippet-editor"

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
