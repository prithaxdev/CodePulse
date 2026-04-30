"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@clerk/nextjs"
import { useQueryClient } from "@tanstack/react-query"
import CodeMirror from "@uiw/react-codemirror"
import { vscodeDark } from "@uiw/codemirror-theme-vscode"
import { getLanguageExtension, LANGUAGES, type Language } from "@/lib/languages"
import { snippetKeys } from "@/hooks/use-snippets"
import { cn } from "@/lib/utils"
import type { Snippet } from "@/types/snippet"

interface Props {
  snippet: Snippet
}

export function SnippetDetailClient({ snippet }: Props) {
  const router = useRouter()
  const { userId: clerkId } = useAuth()
  const queryClient = useQueryClient()

  const [editOpen, setEditOpen] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [deleteError, setDeleteError] = useState<string | null>(null)

  const handleDeleted = async () => {
    setDeleting(true)
    setDeleteError(null)
    try {
      const res = await fetch(`/api/snippets/${snippet.id}`, { method: "DELETE" })
      if (!res.ok) {
        const body = await res.json()
        throw new Error(body.error ?? "Delete failed")
      }
      queryClient.invalidateQueries({ queryKey: snippetKeys.all(clerkId ?? "") })
      queryClient.invalidateQueries({ queryKey: snippetKeys.due(clerkId ?? "") })
      router.push("/dashboard")
    } catch (err) {
      setDeleteError(err instanceof Error ? err.message : "Something went wrong")
      setDeleting(false)
      setDeleteConfirm(false)
    }
  }

  const handleSaved = () => {
    setEditOpen(false)
    queryClient.invalidateQueries({ queryKey: snippetKeys.all(clerkId ?? "") })
    queryClient.invalidateQueries({ queryKey: snippetKeys.due(clerkId ?? "") })
    queryClient.removeQueries({ queryKey: snippetKeys.detail(snippet.id) })
    router.refresh()
  }

  return (
    <>
      {/* ── Action buttons ──────────────────────────── */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => setEditOpen(true)}
          className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-border bg-card px-3 text-xs font-medium text-foreground hover:bg-muted active:scale-[0.96] transition-[transform,background-color] duration-100"
        >
          <svg width="13" height="13" viewBox="0 0 13 13" fill="none" aria-hidden>
            <path d="M9.5 1.5l2 2-7 7H2.5v-2l7-7z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
          </svg>
          Edit
        </button>

        {!deleteConfirm ? (
          <button
            type="button"
            onClick={() => setDeleteConfirm(true)}
            className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-destructive/30 bg-destructive/8 px-3 text-xs font-medium text-destructive hover:bg-destructive/15 active:scale-[0.96] transition-[transform,background-color] duration-100"
          >
            <svg width="13" height="13" viewBox="0 0 13 13" fill="none" aria-hidden>
              <path d="M2 3.5h9M5 3.5V2h3v1.5M4.5 3.5v6.5h4V3.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Delete
          </button>
        ) : (
          <div className="flex items-center gap-1.5">
            <span className="text-xs text-muted-foreground">Are you sure?</span>
            <button
              type="button"
              onClick={handleDeleted}
              disabled={deleting}
              className="inline-flex h-8 items-center rounded-lg bg-destructive px-3 text-xs font-semibold text-white disabled:opacity-60 active:scale-[0.96] transition-[transform,opacity] duration-100"
            >
              {deleting ? "Deleting…" : "Yes, delete"}
            </button>
            <button
              type="button"
              onClick={() => setDeleteConfirm(false)}
              className="inline-flex h-8 items-center rounded-lg border border-border px-3 text-xs font-medium text-muted-foreground hover:bg-muted active:scale-[0.96] transition-[transform,background-color] duration-100"
            >
              Cancel
            </button>
          </div>
        )}
      </div>

      {deleteError && (
        <p className="mt-2 text-xs text-destructive">{deleteError}</p>
      )}

      {/* ── Edit dialog ─────────────────────────────── */}
      {editOpen && (
        <EditDialog
          snippet={snippet}
          onClose={() => setEditOpen(false)}
          onSaved={handleSaved}
        />
      )}
    </>
  )
}

// ── Edit dialog ───────────────────────────────────────────────

function EditDialog({
  snippet,
  onClose,
  onSaved,
}: {
  snippet: Snippet
  onClose: () => void
  onSaved: () => void
}) {
  const [title, setTitle] = useState(snippet.title)
  const [description, setDescription] = useState(snippet.description ?? "")
  const [language, setLanguage] = useState<Language>(snippet.language as Language)
  const [tags, setTags] = useState(snippet.tags.join(", "))
  const [code, setCode] = useState(snippet.code ?? "")
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const parsedTags = tags
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean)

  const handleSave = async () => {
    if (!title.trim()) {
      setError("Title is required")
      return
    }
    setSaving(true)
    setError(null)
    try {
      const res = await fetch(`/api/snippets/${snippet.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: title.trim(), description, language, tags: parsedTags, code }),
      })
      if (!res.ok) {
        const body = await res.json()
        throw new Error(body.error ?? "Save failed")
      }
      onSaved()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong")
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden
      />

      {/* Panel */}
      <div className="relative z-10 w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl border border-border bg-card shadow-2xl flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <h2 className="font-heading text-base font-semibold tracking-tight">Edit snippet</h2>
          <button
            type="button"
            onClick={onClose}
            className="flex size-7 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-colors duration-100"
            aria-label="Close"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
              <path d="M1 1l12 12M13 1L1 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        <div className="flex flex-col gap-4 px-6 py-5">
          {/* Title */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-muted-foreground">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/60 outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/15 transition-[border-color,box-shadow] duration-150"
            />
          </div>

          {/* Language + Tags row */}
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-muted-foreground">Language</label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value as Language)}
                className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/15 transition-[border-color,box-shadow] duration-150"
              >
                {LANGUAGES.map((l) => (
                  <option key={l.value} value={l.value}>{l.label}</option>
                ))}
              </select>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-muted-foreground">Tags (comma-separated)</label>
              <input
                type="text"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                placeholder="hooks, async, react"
                className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/60 outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/15 transition-[border-color,box-shadow] duration-150"
              />
            </div>
          </div>

          {/* Description */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-muted-foreground">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
              placeholder="What does this snippet do?"
              className="w-full resize-none rounded-xl border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/60 outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/15 transition-[border-color,box-shadow] duration-150"
            />
          </div>

          {/* Code */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-muted-foreground">Code</label>
            <div className="overflow-hidden rounded-xl border border-border">
              <CodeMirror
                value={code}
                onChange={setCode}
                theme={vscodeDark}
                extensions={[
                  ...(getLanguageExtension(language)
                    ? [getLanguageExtension(language)!]
                    : []),
                ]}
                basicSetup={{
                  lineNumbers: true,
                  foldGutter: false,
                  highlightActiveLine: true,
                  autocompletion: false,
                }}
                className="text-sm"
                style={{ fontFamily: "var(--font-mono, ui-monospace, monospace)", maxHeight: "280px", overflowY: "auto" }}
              />
            </div>
          </div>

          {error && (
            <p className="text-xs text-destructive">{error}</p>
          )}
        </div>

        <div className="flex items-center justify-end gap-2 px-6 py-4 border-t border-border">
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-8 items-center rounded-lg border border-border px-4 text-xs font-medium text-muted-foreground hover:bg-muted active:scale-[0.96] transition-[transform,background-color] duration-100"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="inline-flex h-8 items-center rounded-lg bg-primary px-4 text-xs font-semibold text-primary-foreground disabled:opacity-60 active:scale-[0.96] transition-[transform,opacity] duration-100"
          >
            {saving ? "Saving…" : "Save changes"}
          </button>
        </div>
      </div>
    </div>
  )
}
