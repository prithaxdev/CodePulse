export const dynamic = "force-dynamic"

import { SnippetEditor } from "@/components/snippet-editor"

export default function NewSnippetPage() {
  return (
    <div className="mx-auto w-full max-w-3xl">
      <div className="px-6 pt-8 pb-1 lg:px-10">
        <h1 className="font-heading text-xs font-medium uppercase tracking-widest text-muted-foreground">
          New Snippet
        </h1>
      </div>
      <SnippetEditor />
    </div>
  )
}
