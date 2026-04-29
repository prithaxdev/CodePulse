// Server Component — no "use client"
import { codeToHtml } from "shiki"
import { cn } from "@/lib/utils"

interface CodeDisplayProps {
  code: string
  language: string
  className?: string
}

// Maps our internal language names to Shiki bundle language IDs
function toShikiLang(lang: string): string {
  const map: Record<string, string> = {
    typescript: "typescript",
    javascript: "javascript",
    python:     "python",
    css:        "css",
    html:       "html",
    json:       "json",
    bash:       "bash",
    sh:         "bash",
    shell:      "bash",
    sql:        "sql",
    markdown:   "markdown",
    md:         "markdown",
    other:      "text",
  }
  return map[lang.toLowerCase()] ?? "text"
}

export async function CodeDisplay({ code, language, className }: CodeDisplayProps) {
  let html: string

  try {
    html = await codeToHtml(code, {
      lang: toShikiLang(language),
      theme: "github-dark",
    })
  } catch {
    // Fallback: render as plain text if language is unsupported
    html = await codeToHtml(code, { lang: "text", theme: "github-dark" })
  }

  return (
    <div
      className={cn(
        // Shiki wraps output in <pre><code> — style them here
        "[&_pre]:m-0 [&_pre]:overflow-x-auto",
        "[&_pre]:p-5 [&_pre]:text-sm [&_pre]:leading-[1.65]",
        "[&_pre]:font-[family-name:var(--font-mono,ui-monospace,monospace)]",
        "[&_pre]:[font-variant-numeric:tabular-nums]",
        // Let shiki control the background color via its theme
        className,
      )}
      // biome-ignore lint: shiki output is trusted server-side HTML
      dangerouslySetInnerHTML={{ __html: html }}
    />
  )
}
