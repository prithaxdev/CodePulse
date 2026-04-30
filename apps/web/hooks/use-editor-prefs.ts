"use client"

import { useState } from "react"
import { DEFAULT_PREFS, type EditorPrefs, type EditorFont, type EditorTheme } from "@/lib/editor-prefs"

const STORAGE_KEY = "codepulse:editor-prefs"

function readStored(): EditorPrefs {
  if (typeof window === "undefined") return DEFAULT_PREFS
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return DEFAULT_PREFS
    return { ...DEFAULT_PREFS, ...JSON.parse(raw) }
  } catch {
    return DEFAULT_PREFS
  }
}

export function useEditorPrefs() {
  const [prefs, setPrefs] = useState<EditorPrefs>(readStored)

  const updatePrefs = (updates: Partial<{ theme: EditorTheme; font: EditorFont }>) => {
    setPrefs((prev) => {
      const next: EditorPrefs = { ...prev, ...updates }
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(next)) } catch {}
      return next
    })
  }

  return { prefs, updatePrefs }
}
