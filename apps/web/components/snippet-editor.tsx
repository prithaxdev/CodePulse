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
import { z } from "zod"

const titleSchema = z.string().min(1, "Title is required").max(120, "Keep it under 120 characters")
const codeSchema = z.string().min(1, "Paste your code to save it")

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
  const [saveError, setSaveError] = useState<string | null>(null)

  const form = useForm({
    defaultValues: {
      title: "",
      language: "typescript" as Language,
      code: "",
      description: "",
      tags: [] as string[],
    },
    onSubmit: async ({ value }) => {
      setSaveError(null)
      if (!value.title.trim() || !value.code.trim()) return

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

      try {
        await saveSnippet(value)
      } catch (err) {
        setSaveError(err instanceof Error ? err.message : "Something went wrong")
      }
    },
  })

  async function saveSnippet(value: FormValues) {
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
  }

  const handleDismissDuplicate = () => {
    setDuplicates([])
    setPendingValues(null)
  }

  const handleSaveAnyway = async () => {
    if (!pendingValues) return
    setSaveError(null)
    setIgnoreDuplicate(true)
    setDuplicates([])
    try {
      await saveSnippet(pendingValues)
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : "Something went wrong")
    }
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        form.handleSubmit()
      }}
      className="flex flex-col divide-y divide-border rounded-2xl border border-border bg-card overflow-hidden"
    >
      {/* ── Title ───────────────────────────────────────── */}
      <form.Field
        name="title"
        validators={{
          onBlur: ({ value }) => {
            const r = titleSchema.safeParse(value.trim())
            return r.success ? undefined : r.error.issues[0].message
          },
        }}
      >
        {(field) => (
          <div className="px-6 pt-6 pb-5">
            <input
              id="title"
              type="text"
              value={field.state.value}
              onChange={(e) => field.handleChange(e.target.value)}
              onBlur={field.handleBlur}
              placeholder="Snippet title…"
              autoFocus
              className={cn(
                "w-full bg-transparent font-heading text-xl font-semibold tracking-tight text-foreground outline-none placeholder:text-muted-foreground/35",
                "text-wrap-balance",
              )}
            />
            {field.state.meta.errors.length > 0 && (
              <p className="mt-1.5 text-xs text-destructive">
                {String(field.state.meta.errors[0])}
              </p>
            )}
          </div>
        )}
      </form.Field>

      {/* ── Language + Tags ─────────────────────────────── */}
      <div className="flex flex-wrap items-center gap-2 px-6 py-3">
        <form.Field name="language">
          {(field) => (
            <Select
              value={field.state.value}
              onValueChange={(val) => field.handleChange(val as Language)}
            >
              <SelectTrigger
                size="sm"
                className="h-7 shrink-0 rounded-md border-border bg-muted/60 px-2.5 font-mono text-xs text-muted-foreground"
              >
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

        <div className="h-4 w-px bg-border" />

        <form.Field name="tags">
          {(field) => (
            <TagInput
              value={field.state.value}
              onChange={(tags) => field.handleChange(tags)}
              className="flex-1 min-w-36 min-h-0 border-0 bg-transparent px-0 py-0 rounded-none focus-within:ring-0"
              placeholder="Add tags…"
            />
          )}
        </form.Field>
      </div>

      {/* ── Code editor ─────────────────────────────────── */}
      <form.Field
        name="code"
        validators={{
          onBlur: ({ value }) => {
            const r = codeSchema.safeParse(value.trim())
            return r.success ? undefined : r.error.issues[0].message
          },
        }}
      >
        {(field) => (
          <div className={cn(field.state.meta.errors.length > 0 && "ring-1 ring-inset ring-destructive/40")}>
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
                  minHeight="240px"
                  basicSetup={{
                    lineNumbers: true,
                    foldGutter: false,
                    highlightActiveLine: true,
                    autocompletion: true,
                  }}
                  className="text-sm"
                  style={{ fontFamily: "var(--font-mono, ui-monospace, monospace)" }}
                />
              )}
            </form.Subscribe>
            {field.state.meta.errors.length > 0 && (
              <p className="px-4 py-2 text-xs text-destructive bg-destructive/5">
                {String(field.state.meta.errors[0])}
              </p>
            )}
          </div>
        )}
      </form.Field>

      {/* ── Notes / Description ─────────────────────────── */}
      <form.Field name="description">
        {(field) => (
          <div className="px-6 py-4">
            <p className="mb-2 text-[11px] font-medium uppercase tracking-widest text-muted-foreground/60">
              Notes
            </p>
            <Textarea
              value={field.state.value}
              onChange={(e) => field.handleChange(e.target.value)}
              onBlur={field.handleBlur}
              placeholder="What does this solve? When would you use it? Any gotchas? (optional)"
              className="min-h-28 resize-y border-0 bg-transparent p-0 text-sm shadow-none focus-visible:ring-0 placeholder:text-muted-foreground/35"
            />
          </div>
        )}
      </form.Field>

      {/* ── Save error ──────────────────────────────────── */}
      {saveError && (
        <div className="px-6 py-3 text-sm text-destructive bg-destructive/8 border-destructive/20 flex items-center gap-2">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden className="shrink-0">
            <path d="M7 1.5a5.5 5.5 0 1 1 0 11 5.5 5.5 0 0 1 0-11ZM7 4.5v3M7 9h.01" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
          </svg>
          {saveError}
        </div>
      )}

      {/* ── Duplicate warning ───────────────────────────── */}
      {duplicates.length > 0 && (
        <div className="px-6 py-4">
          <DuplicateWarning matches={duplicates} onDismiss={handleDismissDuplicate} />
        </div>
      )}

      {/* ── Footer ──────────────────────────────────────── */}
      <div className="flex items-center justify-between gap-3 px-6 py-3.5 bg-muted/30">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => router.back()}
          className="text-muted-foreground hover:text-foreground active:scale-[0.96] transition-[transform,opacity] duration-100"
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
              className="active:scale-[0.96] transition-[transform,opacity] duration-100"
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
                className="active:scale-[0.96] transition-[transform,opacity] duration-100"
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
