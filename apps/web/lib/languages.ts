import { javascript } from "@codemirror/lang-javascript"
import { python } from "@codemirror/lang-python"
import { css } from "@codemirror/lang-css"
import { html } from "@codemirror/lang-html"
import { json } from "@codemirror/lang-json"
import { markdown } from "@codemirror/lang-markdown"
import type { LanguageSupport } from "@codemirror/language"

export const LANGUAGES = [
  { value: "typescript", label: "TypeScript" },
  { value: "javascript", label: "JavaScript" },
  { value: "python", label: "Python" },
  { value: "css", label: "CSS" },
  { value: "html", label: "HTML" },
  { value: "json", label: "JSON" },
  { value: "markdown", label: "Markdown" },
  { value: "bash", label: "Bash" },
  { value: "sql", label: "SQL" },
  { value: "other", label: "Other" },
] as const

export type Language = (typeof LANGUAGES)[number]["value"]

export function getLanguageExtension(lang: Language): LanguageSupport | null {
  switch (lang) {
    case "typescript":
      return javascript({ typescript: true })
    case "javascript":
      return javascript()
    case "python":
      return python()
    case "css":
      return css()
    case "html":
      return html()
    case "json":
      return json()
    case "markdown":
      return markdown()
    default:
      return null
  }
}
