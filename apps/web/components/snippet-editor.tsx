"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "@tanstack/react-form"
import CodeMirror from "@uiw/react-codemirror"
import { vscodeDark } from "@uiw/codemirror-theme-vscode"
import { cn } from "@/lib/utils"
import { LANGUAGES, getLanguageExtension, type Language } from "@/lib/languages"
import { TagInput } from "@/components/tag-input"
import { DuplicateWarning } from "@/components/duplicate-warning"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useCreateSnippet, useSnippets } from "@/hooks/use-snippets"
import { api } from "@/lib/api"
import type { DuplicateMatch } from "@/types/api"

type FormValues = {
  title: string
  language: Language
  code: string
  description: string
  tags: string[]
}

export function SnippetEditor() {
  const router = useRouter()
  const createSnippet = useCreateSnippet()
  const { data: existingSnippets = [] } = useSnippets()

  const [duplicates, setDuplicates] = useState<DuplicateMatch[]>([])
  const [ignoreDuplicate, setIgnoreDuplicate] = useState(false)
  const [pendingValues, setPendingValues] = useState<FormValues | null>(null)

  const form = useForm({
    defaultValues: {
      title: "",
      language: "typescript" as Language,
      code: "",
      description: "",
      tags: [] as string[],
    },
    onSubmit: async ({ value }) => {
      // Guard: require title and code
      if (!value.title.trim() || !value.code.trim()) return

      // Step 1: check for duplicates unless user already dismissed
      if (!ignoreDuplicate && value.code) {
        const candidates = existingSnippets
          .filter((s) => s.code)
          .map((s) => ({ id: s.id, code: s.code! }))

        if (candidates.length > 0) {
          const result = await api.duplicate.check({
            new_code: value.code,
            existing_snippets: candidates,
          })

          if (result.is_duplicate) {
            setDuplicates(result.matches)
            setPendingValues(value)
            return
          }
        }
      }

      // Step 2: save to Supabase with SM-2 defaults
      const tomorrow = new Date()
      tomorrow.setDate(tomorrow.getDate() + 1)
      const nextReview = tomorrow.toISOString().split("T")[0]

      await createSnippet.mutateAsync({
        title: value.title,
        language: value.language,
        code: value.code,
        description: value.description || null,
        tags: value.tags,
        ease_factor: 2.5,
        interval_days: 1,
        repetitions: 0,
        next_review: nextReview,
      })

      router.push("/dashboard")
    },
  })

  const handleDismissDuplicate = () => {
    setDuplicates([])
    setPendingValues(null)
  }

  const handleSaveAnyway = async () => {
    if (!pendingValues) return
    setIgnoreDuplicate(true)
    setDuplicates([])

    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    const nextReview = tomorrow.toISOString().split("T")[0]

    await createSnippet.mutateAsync({
      title: pendingValues.title,
      language: pendingValues.language,
      code: pendingValues.code,
      description: pendingValues.description || null,
      tags: pendingValues.tags,
      ease_factor: 2.5,
      interval_days: 1,
      repetitions: 0,
      next_review: nextReview,
    })

    router.push("/dashboard")
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        form.handleSubmit()
      }}
      className="flex flex-col gap-0"
    >
      {/* Title */}
      <form.Field
        name="title"
        validators={{ onBlur: ({ value }) => (!value.trim() ? "Title is required" : undefined) }}
      >
        {(field) => (
          <div className="px-6 pt-8 lg:px-10">
            <input
              id="title"
              type="text"
              value={field.state.value}
              onChange={(e) => field.handleChange(e.target.value)}
              onBlur={field.handleBlur}
              placeholder="Snippet title…"
              autoFocus
              className={cn(
                "w-full bg-transparent font-heading text-2xl font-semibold tracking-tight text-foreground outline-none placeholder:text-muted-foreground/40",
                field.state.meta.errors.length > 0 && "placeholder:text-destructive/50"
              )}
            />
            {field.state.meta.errors.length > 0 && (
              <p className="mt-1 text-xs text-destructive">
                {String(field.state.meta.errors[0])}
              </p>
            )}
          </div>
        )}
      </form.Field>

      {/* Meta row: Language + Tags */}
      <div className="flex flex-wrap items-start gap-3 px-6 py-4 lg:px-10">
        <form.Field name="language">
          {(field) => (
            <Select
              value={field.state.value}
              onValueChange={(val) => field.handleChange(val as Language)}
            >
              <SelectTrigger size="sm" className="rounded-lg border-border bg-input/50 font-mono text-xs">
                <SelectValue placeholder="Language" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {LANGUAGES.map((lang) => (
                    <SelectItem key={lang.value} value={lang.value}>
                      {lang.label}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          )}
        </form.Field>

        <form.Field name="tags">
          {(field) => (
            <div className="flex-1 min-w-48">
              <TagInput
                value={field.state.value}
                onChange={(tags) => field.handleChange(tags)}
              />
            </div>
          )}
        </form.Field>
      </div>

      {/* Divider */}
      <div className="mx-6 h-px bg-border lg:mx-10" />

      {/* Code editor */}
      <form.Field
        name="code"
        validators={{ onBlur: ({ value }) => (!value.trim() ? "Paste your code to save it" : undefined) }}
      >
        {(field) => (
          <div className="flex flex-col">
            <div
              className={cn(
                "min-h-64 overflow-hidden rounded-none",
                field.state.meta.errors.length > 0 && "ring-1 ring-destructive/50"
              )}
            >
              <form.Subscribe selector={(s) => s.values.language}>
                {(language) => (
                  <CodeMirror
                    value={field.state.value}
                    onChange={(val) => field.handleChange(val)}
                    theme={vscodeDark}
                    extensions={[
                      ...(getLanguageExtension(language as Language)
                        ? [getLanguageExtension(language as Language)!]
                        : []),
                    ]}
                    basicSetup={{
                      lineNumbers: true,
                      foldGutter: false,
                      highlightActiveLine: true,
                      autocompletion: true,
                    }}
                    className="text-sm"
                    style={{ fontFamily: "var(--font-mono, monospace)" }}
                  />
                )}
              </form.Subscribe>
            </div>
            {field.state.meta.errors.length > 0 && (
              <p className="px-6 pt-2 text-xs text-destructive lg:px-10">
                {String(field.state.meta.errors[0])}
              </p>
            )}
          </div>
        )}
      </form.Field>

      {/* Divider */}
      <div className="mx-6 h-px bg-border lg:mx-10" />

      {/* Description */}
      <form.Field name="description">
        {(field) => (
          <div className="px-6 py-4 lg:px-10">
            <Textarea
              value={field.state.value}
              onChange={(e) => field.handleChange(e.target.value)}
              onBlur={field.handleBlur}
              placeholder="Add a note — what problem does this solve? (optional)"
              rows={3}
              className="resize-none border-0 bg-transparent p-0 text-sm shadow-none focus-visible:ring-0 placeholder:text-muted-foreground/40"
            />
          </div>
        )}
      </form.Field>

      {/* Duplicate warning */}
      {duplicates.length > 0 && (
        <div className="px-6 pb-4 lg:px-10">
          <DuplicateWarning matches={duplicates} onDismiss={handleDismissDuplicate} />
        </div>
      )}

      {/* Footer actions */}
      <div className="flex items-center justify-between gap-3 border-t border-border px-6 py-4 lg:px-10">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => router.back()}
          className="text-muted-foreground"
        >
          Cancel
        </Button>

        <div className="flex items-center gap-2">
          {duplicates.length > 0 && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleSaveAnyway}
              disabled={createSnippet.isPending}
            >
              Save anyway
            </Button>
          )}

          <form.Subscribe selector={(s) => s.isSubmitting}>
            {(isSubmitting) => (
              <Button
                type="submit"
                size="sm"
                disabled={isSubmitting || createSnippet.isPending}
                className="active:scale-[0.96] transition-[scale,opacity] duration-100"
              >
                {isSubmitting || createSnippet.isPending ? (
                  <span className="flex items-center gap-1.5">
                    <svg
                      className="size-3.5 animate-spin"
                      viewBox="0 0 24 24"
                      fill="none"
                      aria-hidden
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                      />
                    </svg>
                    Saving…
                  </span>
                ) : (
                  "Save snippet"
                )}
              </Button>
            )}
          </form.Subscribe>
        </div>
      </div>
    </form>
  )
}
