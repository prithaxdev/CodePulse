import { EditorView } from "@codemirror/view"
import { githubDark, githubLight } from "@uiw/codemirror-theme-github"
import { dracula } from "@uiw/codemirror-theme-dracula"
import { tokyoNight } from "@uiw/codemirror-theme-tokyo-night"
import { nord } from "@uiw/codemirror-theme-nord"
import { oneDark } from "@codemirror/theme-one-dark"
import type { Extension } from "@codemirror/state"

export const EDITOR_THEMES = [
  { value: "github-dark",   label: "GitHub Dark" },
  { value: "github-light",  label: "GitHub Light" },
  { value: "dracula",       label: "Dracula" },
  { value: "tokyo-night",   label: "Tokyo Night" },
  { value: "nord",          label: "Nord" },
  { value: "one-dark",      label: "One Dark" },
] as const

export const EDITOR_FONTS = [
  { value: "geist-mono",    label: "Geist Mono",     css: "var(--font-mono, ui-monospace, monospace)" },
  { value: "jetbrains",     label: "JetBrains Mono", css: "var(--font-jetbrains, 'JetBrains Mono', monospace)" },
  { value: "fira-code",     label: "Fira Code",      css: "var(--font-fira, 'Fira Code', monospace)" },
  { value: "ibm-plex",      label: "IBM Plex Mono",  css: "var(--font-ibm-plex, 'IBM Plex Mono', monospace)" },
] as const

export type EditorTheme = (typeof EDITOR_THEMES)[number]["value"]
export type EditorFont  = (typeof EDITOR_FONTS)[number]["value"]

export interface EditorPrefs {
  theme: EditorTheme
  font:  EditorFont
}

export const DEFAULT_PREFS: EditorPrefs = { theme: "github-dark", font: "geist-mono" }

export function getThemeExtension(theme: EditorTheme): Extension {
  switch (theme) {
    case "github-dark":  return githubDark
    case "github-light": return githubLight
    case "dracula":      return dracula
    case "tokyo-night":  return tokyoNight
    case "nord":         return nord
    case "one-dark":     return oneDark
  }
}

export function getFontCss(font: EditorFont): string {
  return EDITOR_FONTS.find((f) => f.value === font)?.css ?? EDITOR_FONTS[0].css
}

// CodeMirror sets font-family on .cm-scroller internally, so a wrapper style prop
// has no effect. This extension targets the internal elements directly.
export function getFontExtension(font: EditorFont): Extension {
  const family = getFontCss(font)
  return EditorView.theme({
    "&":             { fontFamily: family },
    ".cm-scroller":  { fontFamily: family },
    ".cm-content":   { fontFamily: family },
    ".cm-tooltip":   { fontFamily: family },
  })
}

// Cleans up the line-number gutter across all themes:
// transparent background, subtle separator, tabular-nums, muted color.
export const cleanGutter = EditorView.theme({
  ".cm-gutters": {
    backgroundColor: "transparent !important",
    borderRight: "1px solid rgba(128,128,128,0.10) !important",
    paddingRight: "0",
  },
  ".cm-lineNumbers .cm-gutterElement": {
    fontVariantNumeric: "tabular-nums",
    paddingLeft: "12px",
    paddingRight: "14px",
    fontSize: "11.5px",
    color: "rgba(128,128,128,0.40)",
    minWidth: "2.75rem",
    userSelect: "none",
  },
  ".cm-activeLineGutter": {
    backgroundColor: "transparent !important",
    color: "rgba(128,128,128,0.70) !important",
  },
})
