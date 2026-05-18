"use client"

import { useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "@tanstack/react-form"
import CodeMirror from "@uiw/react-codemirror"
import {
  getThemeExtension,
  getFontExtension,
  cleanGutter,
} from "@/lib/editor-prefs"
import { useEditorPrefs } from "@/hooks/use-editor-prefs"
import { EditorToolbar } from "@/components/editor-toolbar"
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
import { logActivity } from "@/lib/activity"
import { api } from "@/lib/api"
import { toast } from "sonner"
import type { DuplicateMatch } from "@/types/api"
import { z } from "zod"

export const titleSchema = z
  .string()
  .min(1, "Title is required")
  .max(120, "Keep it under 120 characters")
export const codeSchema = z.string().min(1, "Paste your code to save it")

// Minimum code length before attempting detection.
const DETECT_MIN_LENGTH = 30

// Debounce delay in ms.
const DETECT_DEBOUNCE = 400

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
  const { prefs, updatePrefs } = useEditorPrefs()

  const [duplicates, setDuplicates] = useState<DuplicateMatch[]>([])
  const [ignoreDuplicate, setIgnoreDuplicate] = useState(false)
  const [pendingValues, setPendingValues] = useState<FormValues | null>(null)

  // Language auto-detection state.
  // currentLang mirrors the form's language field so we can compare without
  // adding a form.Subscribe to the fiber tree (which would shift downstream IDs).
  const [detectedLang, setDetectedLang] = useState<Language | null>(null)
  const [isAutoDetected, setIsAutoDetected] = useState(false)
  const [currentLang, setCurrentLang] = useState<Language>("typescript")
  const wasManuallyChanged = useRef(false)
  const detectTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const form = useForm({
    defaultValues: {
      title: "",
      language: "typescript" as Language,
      code: "",
      description: "",
      tags: [] as string[],
    },
    onSubmit: async ({ value }) => {
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
        toast.error(err instanceof Error ? err.message : "Something went wrong")
      }
    },
  })

  async function saveSnippet(value: FormValues) {
    const nextReview = new Date().toISOString().split("T")[0]

    const saved = await createSnippet.mutateAsync({
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

    logActivity("snippet_created", saved.id, {
      title: saved.title,
      language: saved.language,
    })
    toast.success("Snippet saved!")
    router.push("/dashboard")
  }

  // Debounced language detection — fires 400ms after the user stops typing.
  function triggerDetection(code: string) {
    if (detectTimer.current) clearTimeout(detectTimer.current)

    if (code.trim().length < DETECT_MIN_LENGTH) {
      setDetectedLang(null)
      setIsAutoDetected(false)
      return
    }

    detectTimer.current = setTimeout(async () => {
      try {
        const result = await api.language.detect({ code })

        if (result.language === "other" || result.confidence < 0.08) return

        const detected = result.language as Language
        setDetectedLang(detected)

        if (!wasManuallyChanged.current) {
          // User hasn't manually chosen a language — auto-apply silently.
          form.setFieldValue("language", detected)
          setCurrentLang(detected)
          setIsAutoDetected(true)
        }
        // When wasManuallyChanged is true, detectedLang state drives the
        // "Detected: X — Switch?" suggestion rendered below the language row.
      } catch {
        // Fail silently — detection is non-critical.
      }
    }, DETECT_DEBOUNCE)
  }

  function handleLanguageChange(val: Language, fieldChange: (v: Language) => void) {
    fieldChange(val)
    setCurrentLang(val)
    wasManuallyChanged.current = true
    setIsAutoDetected(false)
    setDetectedLang(null)
  }

  function handleApplyDetected() {
    if (!detectedLang) return
    form.setFieldValue("language", detectedLang)
    setCurrentLang(detectedLang)
    wasManuallyChanged.current = false
    setIsAutoDetected(true)
    setDetectedLang(null)
  }

  const handleDismissDuplicate = () => {
    setDuplicates([])
    setPendingValues(null)
  }

  const handleSaveAnyway = async () => {
    if (!pendingValues) return
    setIgnoreDuplicate(true)
    setDuplicates([])
    try {
      await saveSnippet(pendingValues)
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong")
    }
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        form.handleSubmit()
      }}
      className="flex flex-col divide-y divide-border overflow-hidden rounded-2xl border border-border bg-card"
    >
      {/* ── Title ───────────────────────────────────────── */}
      <form.Field
        name="title"
        validators={{
          onChange: ({ value }) => {
            const r = titleSchema.safeParse(value.trim())
            return r.success ? undefined : r.error.issues[0].message
          },
          onSubmit: ({ value }) => {
            const r = titleSchema.safeParse(value.trim())
            return r.success ? undefined : r.error.issues[0].message
          },
        }}
      >
        {(field) => (
          <form.Subscribe selector={(s) => s.submissionAttempts}>
            {(attempts) => (
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
                    "text-wrap-balance"
                  )}
                />
                {attempts > 0 && field.state.meta.errors.length > 0 && (
                  <p className="mt-1.5 text-xs text-destructive">
                    {String(field.state.meta.errors[0])}
                  </p>
                )}
              </div>
            )}
          </form.Subscribe>
        )}
      </form.Field>

      {/* ── Language + Tags ─────────────────────────────── */}
      {/*
        Keep the same tree structure as the original to prevent fiber-position
        shifts that cause Base UI Select to generate mismatched SSR/CSR IDs.
        The Auto badge and suggestion use plain state — no new form.Subscribe.
      */}
      <div className="flex flex-wrap items-center gap-2 px-6 py-3">
        <form.Field name="language">
          {(field) => (
            <Select
              value={field.state.value}
              onValueChange={(val) =>
                handleLanguageChange(val as Language, field.handleChange)
              }
            >
              <SelectTrigger
                size="sm"
                className="font-geist h-7 shrink-0 rounded-md border-border bg-muted/60 px-2.5 text-xs text-muted-foreground"
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

        {/* Auto badge — plain HTML conditional, no React component boundary */}
        {isAutoDetected && (
          <span className="inline-flex animate-in fade-in items-center gap-1 rounded-full border border-primary/20 bg-primary/8 px-2 py-0.5 text-[10px] font-medium text-primary/70 duration-200">
            <span className="size-1.5 rounded-full bg-primary/50" />
            Auto
          </span>
        )}

        {/* Suggestion — plain state comparison, no form.Subscribe */}
        {detectedLang && wasManuallyChanged.current && detectedLang !== currentLang && (
          <div className="flex animate-in fade-in items-center gap-1.5 duration-200">
            <span className="text-[11px] text-muted-foreground/60">Detected:</span>
            <span className="text-[11px] font-medium text-foreground/70">
              {LANGUAGES.find((l) => l.value === detectedLang)?.label}
            </span>
            <button
              type="button"
              onClick={handleApplyDetected}
              className="text-[11px] text-primary underline-offset-2 transition-opacity hover:underline hover:opacity-80"
            >
              Switch?
            </button>
          </div>
        )}

        <div className="h-4 w-px bg-border" />

        <form.Field name="tags">
          {(field) => (
            <TagInput
              value={field.state.value}
              onChange={(tags) => field.handleChange(tags)}
              className="min-h-0 min-w-36 flex-1 rounded-none border-0 bg-transparent px-0 py-0 focus-within:ring-0"
              placeholder="Add tags…"
            />
          )}
        </form.Field>
      </div>

      {/* ── Code editor ─────────────────────────────────── */}
      <form.Field
        name="code"
        validators={{
          onChange: ({ value }) => {
            const r = codeSchema.safeParse(value.trim())
            return r.success ? undefined : r.error.issues[0].message
          },
          onSubmit: ({ value }) => {
            const r = codeSchema.safeParse(value.trim())
            return r.success ? undefined : r.error.issues[0].message
          },
        }}
      >
        {(field) => (
          <form.Subscribe selector={(s) => s.submissionAttempts}>
            {(attempts) => (
              <div
                className={cn(
                  "overflow-hidden",
                  attempts > 0 &&
                    field.state.meta.errors.length > 0 &&
                    "ring-1 ring-destructive/40 ring-inset"
                )}
              >
                <EditorToolbar
                  theme={prefs.theme}
                  font={prefs.font}
                  onThemeChange={(theme) => updatePrefs({ theme })}
                  onFontChange={(font) => updatePrefs({ font })}
                />
                <form.Subscribe selector={(s) => s.values.language}>
                  {(language) => (
                    <CodeMirror
                      value={field.state.value}
                      onChange={(val) => {
                        field.handleChange(val)
                        triggerDetection(val)
                      }}
                      theme={getThemeExtension(prefs.theme)}
                      extensions={[
                        ...(getLanguageExtension(language as Language)
                          ? [getLanguageExtension(language as Language)!]
                          : []),
                        cleanGutter,
                        getFontExtension(prefs.font),
                      ]}
                      minHeight="240px"
                      basicSetup={{
                        lineNumbers: true,
                        foldGutter: false,
                        highlightActiveLine: true,
                        autocompletion: true,
                      }}
                      className="text-sm"
                    />
                  )}
                </form.Subscribe>
                {attempts > 0 && field.state.meta.errors.length > 0 && (
                  <p className="bg-destructive/5 px-4 py-2 text-xs text-destructive">
                    {String(field.state.meta.errors[0])}
                  </p>
                )}
              </div>
            )}
          </form.Subscribe>
        )}
      </form.Field>

      {/* ── Notes / Description ─────────────────────────── */}
      <form.Field name="description">
        {(field) => (
          <div className="px-6 py-4">
            <p className="mb-2 text-[11px] font-medium tracking-widest text-muted-foreground/60 uppercase">
              Notes
            </p>
            <Textarea
              value={field.state.value}
              onChange={(e) => field.handleChange(e.target.value)}
              onBlur={field.handleBlur}
              placeholder="What does this solve? When would you use it? Any gotchas? (optional)"
              className="min-h-28 resize-y border-0 bg-transparent p-0 text-sm shadow-none placeholder:text-muted-foreground/35 focus-visible:ring-0"
            />
          </div>
        )}
      </form.Field>

      {/* ── Duplicate warning ───────────────────────────── */}
      {duplicates.length > 0 && (
        <div className="px-6 py-4">
          <DuplicateWarning
            matches={duplicates}
            onDismiss={handleDismissDuplicate}
          />
        </div>
      )}

      {/* ── Footer ──────────────────────────────────────── */}
      <div className="flex items-center justify-between gap-3 bg-muted/30 px-6 py-3.5">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => router.back()}
          className="text-muted-foreground transition-[transform,opacity] duration-100 hover:text-foreground active:scale-[0.96]"
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
              className="transition-[transform,opacity] duration-100 active:scale-[0.96]"
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
                className="transition-[transform,opacity] duration-100 active:scale-[0.96]"
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
