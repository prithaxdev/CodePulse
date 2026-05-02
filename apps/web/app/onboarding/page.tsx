"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useUser } from "@clerk/nextjs"
import { cn } from "@/lib/utils"

// ── Language options ─────────────────────────────────────────────────
const LANGUAGES = [
  { id: "typescript", label: "TypeScript", accent: "bg-blue-500/15 border-blue-500/25 text-blue-400",    active: "bg-blue-500/25 border-blue-500/60 text-blue-300" },
  { id: "javascript", label: "JavaScript", accent: "bg-yellow-500/15 border-yellow-500/25 text-yellow-400", active: "bg-yellow-500/25 border-yellow-500/60 text-yellow-300" },
  { id: "python",     label: "Python",     accent: "bg-green-500/15 border-green-500/25 text-green-400",   active: "bg-green-500/25 border-green-500/60 text-green-300" },
  { id: "rust",       label: "Rust",       accent: "bg-orange-500/15 border-orange-500/25 text-orange-400", active: "bg-orange-500/25 border-orange-500/60 text-orange-300" },
  { id: "go",         label: "Go",         accent: "bg-cyan-500/15 border-cyan-500/25 text-cyan-400",       active: "bg-cyan-500/25 border-cyan-500/60 text-cyan-300" },
  { id: "java",       label: "Java",       accent: "bg-red-500/15 border-red-500/25 text-red-400",         active: "bg-red-500/25 border-red-500/60 text-red-300" },
  { id: "css",        label: "CSS",        accent: "bg-pink-500/15 border-pink-500/25 text-pink-400",       active: "bg-pink-500/25 border-pink-500/60 text-pink-300" },
  { id: "html",       label: "HTML",       accent: "bg-orange-400/15 border-orange-400/25 text-orange-300", active: "bg-orange-400/25 border-orange-400/60 text-orange-200" },
  { id: "sql",        label: "SQL",        accent: "bg-violet-500/15 border-violet-500/25 text-violet-400", active: "bg-violet-500/25 border-violet-500/60 text-violet-300" },
  { id: "bash",       label: "Bash",       accent: "bg-primary/10 border-primary/20 text-primary",         active: "bg-primary/25 border-primary/60 text-primary" },
  { id: "json",       label: "JSON",       accent: "bg-muted/40 border-border text-muted-foreground",       active: "bg-muted/70 border-muted-foreground/30 text-foreground" },
  { id: "markdown",   label: "Markdown",   accent: "bg-slate-500/15 border-slate-500/25 text-slate-400",   active: "bg-slate-500/25 border-slate-500/60 text-slate-300" },
] as const

type LanguageId = typeof LANGUAGES[number]["id"]

// ── Check icon ───────────────────────────────────────────────────────
function CheckDot() {
  return (
    <span className="absolute right-1.5 top-1.5">
      <svg viewBox="0 0 8 8" fill="currentColor" aria-hidden className="size-2 opacity-70">
        <circle cx="4" cy="4" r="3" />
      </svg>
    </span>
  )
}

// ── Page ─────────────────────────────────────────────────────────────
export default function OnboardingPage() {
  const router = useRouter()
  const { user, isLoaded } = useUser()

  const [selected, setSelected] = useState<Set<LanguageId>>(
    new Set<LanguageId>(["typescript", "javascript"]),
  )
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Already onboarded users who land here get bounced to dashboard
  if (isLoaded && user?.unsafeMetadata?.onboarded) {
    router.replace("/dashboard")
    return null
  }

  function toggle(id: LanguageId) {
    setSelected((prev) => {
      const next = new Set(prev)
      if (next.has(id)) {
        if (next.size > 1) next.delete(id) // always keep ≥ 1 selected
      } else {
        next.add(id)
      }
      return next
    })
  }

  async function handleStart() {
    if (!user || saving) return
    setSaving(true)
    setError(null)
    try {
      const res = await fetch("/api/onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ preferred_languages: Array.from(selected) }),
      })
      if (!res.ok) {
        const { error } = await res.json()
        throw new Error(error ?? "Failed to save preferences")
      }

      await user.update({ unsafeMetadata: { onboarded: true } })
      router.push("/dashboard")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong")
      setSaving(false)
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="w-full max-w-lg">

        {/* ── Logo ── */}
        <Link
          href="/"
          className="mb-10 inline-flex items-center gap-2.5"
          aria-label="CodePulse home"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/15 ring-1 ring-primary/30">
            <svg width="18" height="18" viewBox="0 0 14 14" fill="none" aria-hidden>
              <path
                d="M2 4l5-2.5L12 4v3c0 2.5-2 4.5-5 5.5C4 11.5 2 9.5 2 7V4Z"
                fill="currentColor"
                className="text-primary"
              />
              <path
                d="M5 7l1.5 1.5L9 5.5"
                stroke="white"
                strokeWidth="1.25"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
          <span className="font-heading text-lg font-semibold tracking-tight">CodePulse</span>
        </Link>

        {/* ── Greeting ── */}
        <div className="mb-8 opacity-0 animate-[fadeSlideUp_0.4s_ease-out_forwards]">
          <h1 className="font-heading text-2xl font-semibold tracking-tight">
            Welcome{user?.firstName ? `, ${user.firstName}` : ""}!
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            CodePulse uses spaced repetition to keep your hard-won knowledge fresh.
            Pick the languages you work with — this personalises your review queue and search.
          </p>
        </div>

        {/* ── Language grid ── */}
        <div className="mb-8 opacity-0 animate-[fadeSlideUp_0.4s_ease-out_0.1s_forwards]">
          <p className="mb-3 text-[11px] font-medium uppercase tracking-[0.08em] text-muted-foreground">
            Your languages
          </p>
          <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
            {LANGUAGES.map((lang) => {
              const isSelected = selected.has(lang.id)
              return (
                <button
                  key={lang.id}
                  type="button"
                  onClick={() => toggle(lang.id)}
                  className={cn(
                    "relative flex items-center justify-center rounded-xl border px-3 py-2.5",
                    "text-sm font-medium",
                    "transition-[border-color,background-color,transform,color] duration-150",
                    "active:scale-[0.96]",
                    isSelected ? lang.active : lang.accent,
                  )}
                >
                  {isSelected && <CheckDot />}
                  {lang.label}
                </button>
              )
            })}
          </div>
          <p className="mt-2.5 text-[11px] text-muted-foreground">
            {selected.size} selected · tap to toggle
          </p>
        </div>

        {/* ── CTA ── */}
        <div className="space-y-3 opacity-0 animate-[fadeSlideUp_0.4s_ease-out_0.2s_forwards]">
          {error && (
            <p className="rounded-lg bg-destructive/10 px-3 py-2 text-xs text-destructive">
              {error}
            </p>
          )}

          <button
            type="button"
            onClick={handleStart}
            disabled={saving || !isLoaded}
            className={cn(
              "flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3",
              "font-medium text-primary-foreground text-sm",
              "active:scale-[0.98] transition-[transform,opacity] duration-100",
              "disabled:cursor-not-allowed disabled:opacity-50",
            )}
          >
            {saving ? (
              <>
                <svg className="size-4 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden>
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2.5" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Setting up your library…
              </>
            ) : (
              "Start building my library →"
            )}
          </button>

          <p className="text-center text-xs text-muted-foreground">
            You can change these any time in{" "}
            <Link href="/settings" className="text-primary hover:underline">
              Settings
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
