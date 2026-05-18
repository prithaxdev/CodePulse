"use client"

import { useSyncExternalStore } from "react"
import {
  DEFAULT_PREFS,
  type EditorPrefs,
  type EditorFont,
  type EditorTheme,
} from "@/lib/editor-prefs"

const STORAGE_KEY = "codepulse:editor-prefs"

// Module-level subscriber registry — shared across all hook instances.
let _listeners: (() => void)[] = []

// Cached snapshot — useSyncExternalStore requires getSnapshot to return the
// same reference when the underlying data has not changed, otherwise React
// will loop indefinitely trying to stabilise the store value.
let _cachedRaw: string | null | undefined = undefined
let _cachedPrefs: EditorPrefs = DEFAULT_PREFS

function subscribe(callback: () => void): () => void {
  _listeners.push(callback)
  return () => {
    _listeners = _listeners.filter((l) => l !== callback)
  }
}

function getSnapshot(): EditorPrefs {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    // Return the cached object when raw hasn't changed — keeps reference stable.
    if (raw === _cachedRaw) return _cachedPrefs
    _cachedRaw = raw
    _cachedPrefs = raw
      ? { ...DEFAULT_PREFS, ...JSON.parse(raw) }
      : DEFAULT_PREFS
    return _cachedPrefs
  } catch {
    return DEFAULT_PREFS
  }
}

// Used during SSR and the client hydration pass — must match server output.
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
    // Invalidate cache so getSnapshot re-reads on the next call.
    _cachedRaw = undefined
    _listeners.forEach((l) => l())
  }

  return { prefs, updatePrefs }
}
