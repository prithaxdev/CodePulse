"use client"

import { useSyncExternalStore } from "react"
import {
  DEFAULT_PREFS,
  type EditorPrefs,
  type EditorFont,
  type EditorTheme,
} from "@/lib/editor-prefs"

const STORAGE_KEY = "codepulse:editor-prefs"

// Module-level subscriber registry — shared across all hook instances so that
// updating prefs in one component propagates to every mounted consumer.
let _listeners: (() => void)[] = []

function subscribe(callback: () => void): () => void {
  _listeners.push(callback)
  return () => {
    _listeners = _listeners.filter((l) => l !== callback)
  }
}

function getSnapshot(): EditorPrefs {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return DEFAULT_PREFS
    return { ...DEFAULT_PREFS, ...JSON.parse(raw) }
  } catch {
    return DEFAULT_PREFS
  }
}

// Used during SSR *and* the client hydration pass — must match server output.
function getServerSnapshot(): EditorPrefs {
  return DEFAULT_PREFS
}

export function useEditorPrefs() {
  const prefs = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)

  function updatePrefs(updates: Partial<{ theme: EditorTheme; font: EditorFont }>) {
    const next: EditorPrefs = { ...prefs, ...updates }
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
    } catch {}
    _listeners.forEach((l) => l())
  }

  return { prefs, updatePrefs }
}
