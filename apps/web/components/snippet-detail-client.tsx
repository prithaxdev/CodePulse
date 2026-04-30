"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@clerk/nextjs"
import { useQueryClient } from "@tanstack/react-query"
import CodeMirror from "@uiw/react-codemirror"
import { vscodeDark } from "@uiw/codemirror-theme-vscode"
import { HugeiconsIcon } from "@hugeicons/react"
import { Edit01Icon, Delete01Icon } from "@hugeicons/core-free-icons"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { ConfirmDialog } from "@/components/confirm-dialog"
import { getLanguageExtension, LANGUAGES, type Language } from "@/lib/languages"
import { snippetKeys } from "@/hooks/use-snippets"
import type { Snippet } from "@/types/snippet"

interface Props {
  snippet: Snippet
}

export function SnippetDetailClient({ snippet }: Props) {
  const router = useRouter()
  const { userId: clerkId } = useAuth()
  const queryClient = useQueryClient()

  const [editOpen, setEditOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [deleting, setDeleting] = useState(false)

  const handleDelete = async () => {
    setDeleting(true)
    try {
      const res = await fetch(`/api/snippets/${snippet.id}`, { method: "DELETE" })
      if (!res.ok) {
        const body = await res.json()
        throw new Error(body.error ?? "Delete failed")
      }
      queryClient.invalidateQueries({ queryKey: snippetKeys.all(clerkId ?? "") })
      queryClient.invalidateQueries({ queryKey: snippetKeys.due(clerkId ?? "") })
      router.push("/dashboard")
    } catch {
      setDeleting(false)
      setDeleteOpen(false)
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
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setEditOpen(true)}
          className="gap-1.5"
        >
          <HugeiconsIcon icon={Edit01Icon} size={13} strokeWidth={2} />
          Edit
        </Button>

        <Button
          variant="destructive"
          size="sm"
          onClick={() => setDeleteOpen(true)}
          className="gap-1.5"
        >
          <HugeiconsIcon icon={Delete01Icon} size={13} strokeWidth={2} />
          Delete
        </Button>
      </div>

      <ConfirmDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title="Delete snippet"
        description="This snippet and its entire review history will be permanently removed. This cannot be undone."
        confirmLabel="Delete snippet"
        onConfirm={handleDelete}
        loading={deleting}
        variant="destructive"
      />

      <EditDialog
        snippet={snippet}
        open={editOpen}
        onOpenChange={setEditOpen}
        onSaved={handleSaved}
      />
    </>
  )
}

// ── Edit dialog ───────────────────────────────────────────────

function EditDialog({
  snippet,
  open,
  onOpenChange,
  onSaved,
}: {
  snippet: Snippet
  open: boolean
  onOpenChange: (open: boolean) => void
  onSaved: () => void
}) {
  const [title, setTitle] = useState(snippet.title)
  const [description, setDescription] = useState(snippet.description ?? "")
  const [language, setLanguage] = useState<Language>(snippet.language as Language)
  const [tags, setTags] = useState(snippet.tags.join(", "))
  const [code, setCode] = useState(snippet.code ?? "")
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSave = async () => {
    if (!title.trim()) {
      setError("Title is required")
      return
    }
    setSaving(true)
    setError(null)
    const parsedTags = tags.split(",").map((t) => t.trim()).filter(Boolean)
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
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="max-w-2xl gap-0 overflow-hidden p-0"
      >
        <DialogHeader className="border-b border-border px-6 py-4">
          <DialogTitle>Edit snippet</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-4 overflow-y-auto px-6 py-5" style={{ maxHeight: "60vh" }}>
          {/* Title */}
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="edit-title" className="text-xs text-muted-foreground">
              Title
            </Label>
            <Input
              id="edit-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Snippet title"
            />
          </div>

          {/* Language + Tags */}
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <Label className="text-xs text-muted-foreground">Language</Label>
              <Select value={language} onValueChange={(val) => setLanguage(val as Language)}>
                <SelectTrigger className="w-full rounded-xl">
                  <SelectValue placeholder="Language" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {LANGUAGES.map((l) => (
                      <SelectItem key={l.value} value={l.value}>
                        {l.label}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="edit-tags" className="text-xs text-muted-foreground">
                Tags (comma-separated)
              </Label>
              <Input
                id="edit-tags"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                placeholder="hooks, async, react"
              />
            </div>
          </div>

          {/* Description */}
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="edit-description" className="text-xs text-muted-foreground">
              Description
            </Label>
            <Textarea
              id="edit-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
              placeholder="What does this snippet do?"
              className="resize-none"
            />
          </div>

          {/* Code */}
          <div className="flex flex-col gap-1.5">
            <Label className="text-xs text-muted-foreground">Code</Label>
            <div className="overflow-hidden rounded-2xl border border-border">
              <CodeMirror
                value={code}
                onChange={setCode}
                theme={vscodeDark}
                extensions={[
                  ...(getLanguageExtension(language) ? [getLanguageExtension(language)!] : []),
                ]}
                basicSetup={{
                  lineNumbers: true,
                  foldGutter: false,
                  highlightActiveLine: true,
                  autocompletion: false,
                }}
                className="text-sm"
                style={{
                  fontFamily: "var(--font-mono, ui-monospace, monospace)",
                  maxHeight: "280px",
                  overflowY: "auto",
                }}
              />
            </div>
          </div>

          {error && <p className="text-xs text-destructive">{error}</p>}
        </div>

        <DialogFooter
          showCloseButton
          className="border-t border-border px-6 py-4"
        >
          <Button onClick={handleSave} disabled={saving}>
            {saving ? "Saving…" : "Save changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
