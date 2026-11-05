"use client"

import { useRef, useState, type KeyboardEvent, type ReactNode } from "react"
import { AnimatePresence, motion } from "motion/react"
import {
  CheckIcon,
  ChevronRightIcon,
  CopyIcon,
  FileCodeIcon,
} from "lucide-react"
import { ALGORITHM_DIR, type AlgorithmSource } from "@/lib/algorithm-sources"
import { cn } from "@/lib/utils"

type RenderedSource = AlgorithmSource & { html: string }

interface AlgorithmExplorerProps {
  sources: RenderedSource[]
  footnote: string
  /** Section heading and intro, rendered above the list. */
  children: ReactNode
}

const NEXT_KEYS: Record<string, number> = {
  ArrowDown: 1,
  ArrowRight: 1,
  ArrowUp: -1,
  ArrowLeft: -1,
}

export function AlgorithmExplorer({
  sources,
  footnote,
  children,
}: AlgorithmExplorerProps) {
  const [activeId, setActiveId] = useState(sources[0].id)
  const tabs = useRef(new Map<string, HTMLButtonElement>())
  const active = sources.find((s) => s.id === activeId) ?? sources[0]
  // Reserve the longest excerpt's height so every line shows and switching
  // tabs never moves the page. Matches the pre metrics below (0.8125rem × 1.7, 3rem padding).
  const maxLines = Math.max(...sources.map((s) => s.code.split("\n").length))
  const symbol = active.code.match(/def (\w+)/)?.[1]

  function select(index: number) {
    const target = sources[(index + sources.length) % sources.length]
    setActiveId(target.id)
    tabs.current.get(target.id)?.focus()
  }

  function handleKeyDown(
    event: KeyboardEvent<HTMLButtonElement>,
    index: number
  ) {
    if (event.key in NEXT_KEYS) select(index + NEXT_KEYS[event.key])
    else if (event.key === "Home") select(0)
    else if (event.key === "End") select(sources.length - 1)
    else return
    event.preventDefault()
  }

  return (
    <div className="grid gap-x-14 gap-y-10 lg:grid-cols-12">
      <div className="flex min-w-0 flex-col gap-8 lg:col-span-5">
        <div className="flex flex-col gap-4">{children}</div>

        <div
          role="tablist"
          aria-label="Algorithms"
          aria-orientation="vertical"
          className="-mx-6 flex gap-1.5 overflow-x-auto px-6 pb-1 lg:mx-0 lg:flex-col lg:gap-0.5 lg:overflow-visible lg:px-0 lg:pb-0"
        >
          {sources.map((source, index) => {
            const selected = source.id === active.id
            return (
              <button
                key={source.id}
                ref={(node) => {
                  if (node) tabs.current.set(source.id, node)
                  else tabs.current.delete(source.id)
                }}
                id={`algorithm-tab-${source.id}`}
                role="tab"
                type="button"
                aria-selected={selected}
                aria-controls="algorithm-panel"
                tabIndex={selected ? 0 : -1}
                onClick={() => setActiveId(source.id)}
                onKeyDown={(event) => handleKeyDown(event, index)}
                className={cn(
                  "flex shrink-0 items-center justify-between gap-6 rounded-lg px-3 py-2.5 text-left transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-ring",
                  selected
                    ? "bg-muted text-foreground"
                    : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                )}
              >
                <span className="flex min-w-0 flex-col gap-0.5">
                  <span className="text-sm font-medium whitespace-nowrap">
                    {source.name}
                  </span>
                  <span className="hidden truncate text-xs text-muted-foreground lg:block">
                    {source.purpose}
                  </span>
                </span>
                <span className="hidden font-mono text-xs whitespace-nowrap text-muted-foreground tabular-nums lg:block">
                  {source.lines} lines
                </span>
              </button>
            )
          })}
        </div>

        <p className="font-mono text-xs text-muted-foreground tabular-nums">
          {footnote}
        </p>
      </div>

      {/* An editor buffer in the spirit of Zed: file tab, breadcrumb to the
          function, gutter, indent guides, status bar. Every label is real. */}
      <figure className="flex min-w-0 flex-col overflow-hidden rounded-2xl border bg-card lg:col-span-7">
        <div className="flex items-stretch justify-between border-b bg-background">
          <div className="-mb-px flex items-center gap-2 border-r bg-card px-4 py-2.5 font-mono text-xs text-foreground">
            <FileCodeIcon
              size={13}
              className="text-muted-foreground"
              aria-hidden="true"
            />
            {active.file}
          </div>
          <div className="flex items-center pr-2">
            <CopyButton text={active.code} />
          </div>
        </div>

        <figcaption className="flex min-w-0 items-center gap-1.5 px-6 pt-4 font-mono text-[0.6875rem] text-muted-foreground">
          <span className="truncate">
            {ALGORITHM_DIR}/{active.file}
          </span>
          {symbol && (
            <>
              <ChevronRightIcon
                size={11}
                className="shrink-0"
                aria-hidden="true"
              />
              <span className="shrink-0 text-foreground/80">{symbol}</span>
            </>
          )}
        </figcaption>

        <div
          id="algorithm-panel"
          role="tabpanel"
          aria-labelledby={`algorithm-tab-${active.id}`}
          tabIndex={0}
          style={{ minHeight: `calc(${maxLines} * 0.8125rem * 1.7 + 3rem)` }}
          className={cn(
            "flex-1 [--gutter:4.5ch] focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-ring sm:[--gutter:7ch]",
            // Shiki output: both themes arrive as CSS variables, the page theme picks.
            "[&_code]:font-(family-name:--font-ibm-plex) [&_pre]:m-0 [&_pre]:py-6 [&_pre]:pr-6 [&_pre]:pl-2 [&_pre]:font-(family-name:--font-ibm-plex) [&_pre]:text-[0.75rem] [&_pre]:leading-[1.7] [&_pre]:[tab-size:4] sm:[&_pre]:text-[0.8125rem]",
            "[&_pre]:text-(--shiki-light) dark:[&_pre]:text-(--shiki-dark) [&_pre_span]:text-(--shiki-light) dark:[&_pre_span]:text-(--shiki-dark)",
            // One block per line, so a line can carry a hover highlight. Long
            // lines soft-wrap and continue at their own indent, like Zed.
            "[&_pre]:[overflow-wrap:anywhere] [&_pre]:whitespace-pre-wrap",
            "[&_code]:flex [&_code]:flex-col [&_code]:[counter-reset:line]",
            "[&_.line]:pl-[calc(var(--gutter)+var(--indent,0)*4ch)] [&_.line]:-indent-[calc(var(--gutter)+var(--indent,0)*4ch)] [&_.line]:before:indent-0",
            "[&_.line]:rounded-sm [&_.line]:transition-colors [&_.line]:duration-100 [&_.line:hover]:bg-muted/60",
            // Gutter: line numbers from a counter, so copied text stays clean.
            "[&_.line]:before:mr-[1.5ch] [&_.line]:before:inline-block [&_.line]:before:w-[calc(var(--gutter)-1.5ch)] [&_.line]:before:text-right [&_.line]:before:text-muted-foreground/45 [&_.line]:before:content-[counter(line)] [&_.line]:before:[counter-increment:line] [&_.line:hover]:before:text-foreground",
            // Indent guides: one hairline per level, starting after the gutter.
            "[&_.line]:[background-image:repeating-linear-gradient(to_right,var(--border)_0_1px,transparent_1px_4ch)] [&_.line]:[background-size:calc(var(--indent,0)*4ch)_100%] [&_.line]:[background-position:var(--gutter)_0] [&_.line]:bg-no-repeat"
          )}
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={active.id}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -2 }}
              transition={{ duration: 0.16, ease: [0.16, 1, 0.3, 1] }}
              dangerouslySetInnerHTML={{ __html: active.html }}
            />
          </AnimatePresence>
        </div>

        <div className="flex items-center justify-between gap-4 border-t bg-background px-4 py-1.5 font-mono text-[0.6875rem] text-muted-foreground tabular-nums">
          <span>Python</span>
          <span>
            excerpt · {active.code.split("\n").length} of {active.lines} lines
          </span>
        </div>
      </figure>
    </div>
  )
}

const iconMotion = {
  initial: { opacity: 0, scale: 0.25, filter: "blur(4px)" },
  animate: { opacity: 1, scale: 1, filter: "blur(0px)" },
  exit: { opacity: 0, scale: 0.25, filter: "blur(4px)" },
  transition: { type: "spring", duration: 0.3, bounce: 0 },
} as const

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false)
  const timer = useRef<number | undefined>(undefined)

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(text)
    } catch {
      return
    }
    setCopied(true)
    window.clearTimeout(timer.current)
    timer.current = window.setTimeout(() => setCopied(false), 1600)
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      aria-label="Copy code"
      className="relative grid size-8 shrink-0 place-items-center rounded-md text-muted-foreground transition-[color,scale] duration-150 before:absolute before:-inset-1 hover:text-foreground focus-visible:outline-2 focus-visible:outline-ring active:scale-[0.96]"
    >
      <AnimatePresence mode="popLayout" initial={false}>
        {copied ? (
          <motion.span key="check" {...iconMotion} className="text-primary">
            <CheckIcon size={15} aria-hidden="true" />
          </motion.span>
        ) : (
          <motion.span key="copy" {...iconMotion}>
            <CopyIcon size={15} aria-hidden="true" />
          </motion.span>
        )}
      </AnimatePresence>
      <span className="sr-only" aria-live="polite">
        {copied ? "Copied" : ""}
      </span>
    </button>
  )
}
