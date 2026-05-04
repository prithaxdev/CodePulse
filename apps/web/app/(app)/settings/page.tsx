"use client"

import { useState, useEffect, useCallback } from "react"
import { useUser } from "@clerk/nextjs"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { ConfirmDialog } from "@/components/confirm-dialog"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

// ── Language definitions ─────────────────────────────────────────────
const LANGUAGES = [
  { id: "typescript", label: "TypeScript", accent: "bg-blue-500/15 border-blue-500/25 text-blue-400",     active: "bg-blue-500/25 border-blue-500/60 text-blue-300" },
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

type LanguageId = (typeof LANGUAGES)[number]["id"]

// ── Check dot ────────────────────────────────────────────────────────
function CheckDot() {
  return (
    <span className="absolute right-1.5 top-1.5">
      <svg viewBox="0 0 8 8" fill="currentColor" aria-hidden className="size-2 opacity-70">
        <circle cx="4" cy="4" r="3" />
      </svg>
    </span>
  )
}

// ── Toggle switch ────────────────────────────────────────────────────
function Toggle({
  checked,
  onChange,
  id,
}: {
  checked: boolean
  onChange: (v: boolean) => void
  id: string
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      id={id}
      onClick={() => onChange(!checked)}
      className={cn(
        "relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full",
        "transition-colors duration-150",
        checked ? "bg-primary" : "bg-muted-foreground/30",
      )}
    >
      <span
        className={cn(
          "inline-block size-3.5 rounded-full bg-white shadow-sm",
          "transition-transform duration-150",
          checked ? "translate-x-[18px]" : "translate-x-[3px]",
        )}
      />
    </button>
  )
}

// ── Section wrapper ──────────────────────────────────────────────────
function Section({
  label,
  children,
}: {
  label: string
  children: React.ReactNode
}) {
  return (
    <section className="rounded-xl border border-border bg-card p-5">
      <p className="mb-4 text-[11px] font-medium uppercase tracking-[0.08em] text-muted-foreground">
        {label}
      </p>
      {children}
    </section>
  )
}

// ── Spinner ──────────────────────────────────────────────────────────
function Spinner({ className }: { className?: string }) {
  return (
    <svg
      className={cn("animate-spin", className)}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden
    >
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2.5" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
    </svg>
  )
}

// ── Time picker helpers ──────────────────────────────────────────────
const HOURS = Array.from({ length: 24 }, (_, i) => i)
const MINUTES = ["00", "15", "30", "45"]

function formatHour(h: number): string {
  if (h === 0) return "12 AM"
  if (h < 12) return `${h} AM`
  if (h === 12) return "12 PM"
  return `${h - 12} PM`
}

function parseTime(t: string): { hour: number; minute: string } {
  const [h, m] = t.split(":")
  const hour = parseInt(h ?? "9")
  const rawMin = parseInt(m ?? "0")
  // snap to nearest quarter
  const snapped = Math.round(rawMin / 15) * 15
  const minute = String(snapped === 60 ? 0 : snapped).padStart(2, "0")
  return { hour, minute }
}

// ── Page ─────────────────────────────────────────────────────────────
export default function SettingsPage() {
  const { user, isLoaded } = useUser()
  const router = useRouter()

  const [languages, setLanguages] = useState<Set<LanguageId>>(
    new Set<LanguageId>(["typescript", "javascript"]),
  )
  const [reminderTime, setReminderTime] = useState("09:00")
  const [emailReminders, setEmailReminders] = useState(true)

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saveMsg, setSaveMsg] = useState<{ ok: boolean; text: string } | null>(null)
  const [exporting, setExporting] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState(false)
  const [deleting, setDeleting] = useState(false)

  const loadPrefs = useCallback(async () => {
    try {
      const res = await fetch("/api/settings")
      if (!res.ok) return
      const data = await res.json()
      if (Array.isArray(data.preferred_languages)) {
        setLanguages(new Set(data.preferred_languages as LanguageId[]))
      }
      if (data.review_reminder_time) {
        setReminderTime(data.review_reminder_time.slice(0, 5))
      }
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (!isLoaded) return
    const meta = user?.unsafeMetadata as Record<string, unknown> | undefined
    if (meta?.emailReminders === false) setEmailReminders(false)
    loadPrefs()
  }, [isLoaded, user, loadPrefs])

  function toggleLanguage(id: LanguageId) {
    setLanguages((prev) => {
      const next = new Set(prev)
      if (next.has(id)) {
        if (next.size > 1) next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }

  async function handleSave() {
    if (saving || !user) return
    setSaving(true)
    setSaveMsg(null)
    try {
      const [settingsRes] = await Promise.all([
        fetch("/api/settings", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            preferred_languages: Array.from(languages),
            review_reminder_time: reminderTime,
          }),
        }),
        user.update({
          unsafeMetadata: {
            ...(user.unsafeMetadata as Record<string, unknown>),
            emailReminders,
          },
        }),
      ])

      if (!settingsRes.ok) {
        const { error } = await settingsRes.json()
        throw new Error(error ?? "Save failed")
      }

      setSaveMsg({ ok: true, text: "Preferences saved." })
    } catch (err) {
      setSaveMsg({
        ok: false,
        text: err instanceof Error ? err.message : "Something went wrong",
      })
    } finally {
      setSaving(false)
      setTimeout(() => setSaveMsg(null), 3000)
    }
  }

  async function handleExport() {
    if (exporting) return
    setExporting(true)
    try {
      const res = await fetch("/api/export")
      if (!res.ok) throw new Error("Export failed")
      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `codepulse-export-${new Date().toISOString().split("T")[0]}.json`
      a.click()
      URL.revokeObjectURL(url)
    } finally {
      setExporting(false)
    }
  }

  async function handleDelete() {
    if (deleting || !user) return
    setDeleting(true)
    try {
      await user.delete()
      router.push("/")
    } catch {
      setDeleting(false)
      setDeleteConfirm(false)
    }
  }

  if (!isLoaded || loading) {
    return (
      <div className="flex h-full items-center justify-center p-8">
        <Spinner className="size-5 text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6 p-6 lg:p-8">
      {/* ── Header ── */}
      <div>
        <h1 className="font-heading text-2xl font-semibold tracking-tight">Settings</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Manage your preferences, data, and account.
        </p>
      </div>

      {/* ── Preferences ── */}
      <Section label="Preferences">
        {/* Language pills */}
        <div className="mb-5">
          <p className="mb-2.5 text-sm font-medium">Preferred languages</p>
          <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
            {LANGUAGES.map((lang) => {
              const isSelected = languages.has(lang.id)
              return (
                <button
                  key={lang.id}
                  type="button"
                  onClick={() => toggleLanguage(lang.id)}
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
          <p className="mt-2 text-[11px] text-muted-foreground">
            {languages.size} selected · used for search ranking
          </p>
        </div>

        {/* Reminder time */}
        <div className="mb-5">
          <p className="mb-2 text-sm font-medium">Daily reminder time</p>
          <div className="flex items-center gap-2">
            {/* Hour */}
            <Select
              value={String(parseTime(reminderTime).hour)}
              onValueChange={(val) => {
                const { minute } = parseTime(reminderTime)
                setReminderTime(`${String(val).padStart(2, "0")}:${minute}`)
              }}
            >
              <SelectTrigger className="w-28">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {HOURS.map((h) => (
                    <SelectItem key={h} value={String(h)}>
                      {formatHour(h)}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>

            <span className="text-sm text-muted-foreground">:</span>

            {/* Minute */}
            <Select
              value={parseTime(reminderTime).minute}
              onValueChange={(val) => {
                const { hour } = parseTime(reminderTime)
                setReminderTime(`${String(hour).padStart(2, "0")}:${val}`)
              }}
            >
              <SelectTrigger className="w-20">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {MINUTES.map((m) => (
                    <SelectItem key={m} value={m}>
                      :{m}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          <p className="mt-1.5 text-[11px] text-muted-foreground">
            Reminder emails are sent at this time (Nepal timezone)
          </p>
        </div>

        {/* Email toggle */}
        <div className="flex items-center justify-between gap-4">
          <div>
            <label htmlFor="email-toggle" className="block text-sm font-medium">
              Email reminders
            </label>
            <p className="mt-0.5 text-[11px] text-muted-foreground">
              Receive a daily email when snippets are due
            </p>
          </div>
          <Toggle id="email-toggle" checked={emailReminders} onChange={setEmailReminders} />
        </div>
      </Section>

      {/* ── Save button ── */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className={cn(
            "flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5",
            "text-sm font-medium text-primary-foreground",
            "active:scale-[0.98] transition-[transform,opacity] duration-100",
            "disabled:cursor-not-allowed disabled:opacity-50",
          )}
        >
          {saving ? (
            <>
              <Spinner className="size-4" />
              Saving…
            </>
          ) : (
            "Save preferences"
          )}
        </button>

        {saveMsg && (
          <p className={cn("text-sm", saveMsg.ok ? "text-emerald-400" : "text-destructive")}>
            {saveMsg.text}
          </p>
        )}
      </div>

      {/* ── Data ── */}
      <Section label="Data">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-medium">Export my data</p>
            <p className="mt-0.5 text-[11px] text-muted-foreground">
              Download all your snippets and review history as JSON
            </p>
          </div>
          <button
            type="button"
            onClick={handleExport}
            disabled={exporting}
            className={cn(
              "flex shrink-0 items-center gap-1.5 rounded-xl border border-border px-3.5 py-2",
              "text-sm font-medium text-foreground",
              "hover:bg-accent transition-colors duration-150",
              "active:scale-[0.97]",
              "disabled:cursor-not-allowed disabled:opacity-50",
            )}
          >
            {exporting ? (
              <>
                <Spinner className="size-3.5" />
                Exporting…
              </>
            ) : (
              <>
                <svg width="13" height="13" viewBox="0 0 13 13" fill="none" aria-hidden>
                  <path
                    d="M6.5 1v7M3.5 5.5L6.5 8.5l3-3M1.5 10h10"
                    stroke="currentColor"
                    strokeWidth="1.4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                Download
              </>
            )}
          </button>
        </div>
      </Section>

      {/* ── Danger zone ── */}
      <Section label="Danger zone">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-medium">Delete account</p>
            <p className="mt-0.5 text-[11px] text-muted-foreground">
              Permanently remove your account, snippets, and all review history
            </p>
          </div>
          <button
            type="button"
            onClick={() => setDeleteConfirm(true)}
            className={cn(
              "shrink-0 rounded-xl border border-destructive/40 px-3.5 py-2",
              "text-sm font-medium text-destructive",
              "hover:bg-destructive/10 transition-colors duration-150",
              "active:scale-[0.97]",
            )}
          >
            Delete account
          </button>
        </div>
      </Section>

      <ConfirmDialog
        open={deleteConfirm}
        onOpenChange={setDeleteConfirm}
        title="Delete account"
        description="This cannot be undone. All your snippets, review history, and account data will be permanently deleted."
        confirmLabel="Yes, delete everything"
        onConfirm={handleDelete}
        loading={deleting}
        variant="destructive"
      />
    </div>
  )
}
