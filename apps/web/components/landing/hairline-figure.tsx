"use client"

import dynamic from "next/dynamic"
import { useRef, type ComponentType } from "react"
import type { HairlineProps } from "@lucasmarkes/hairline/react"
import { cn } from "@/lib/utils"

// The engine is ~60 kB gzipped and every figure sits below the fold, so it
// loads in its own chunk after hydration. The placeholder holds the same 5:4
// box the figure draws into, so nothing shifts when it arrives.
function FigurePlaceholder() {
  return <div aria-hidden="true" className="aspect-5/4 w-full" />
}

const figures = {
  terminal: dynamic(
    () => import("@lucasmarkes/hairline/react").then((m) => m.Terminal),
    { ssr: false, loading: FigurePlaceholder }
  ),
  slow: dynamic(
    () => import("@lucasmarkes/hairline/react").then((m) => m.Slow),
    { ssr: false, loading: FigurePlaceholder }
  ),
  riffle: dynamic(
    () => import("@lucasmarkes/hairline/react").then((m) => m.Riffle),
    { ssr: false, loading: FigurePlaceholder }
  ),
  settle: dynamic(
    () => import("@lucasmarkes/hairline/react").then((m) => m.Settle),
    { ssr: false, loading: FigurePlaceholder }
  ),
  elevator: dynamic(
    () => import("@lucasmarkes/hairline/react").then((m) => m.Elevator),
    { ssr: false, loading: FigurePlaceholder }
  ),
  phosphor: dynamic(
    () => import("@lucasmarkes/hairline/react").then((m) => m.Phosphor),
    { ssr: false, loading: FigurePlaceholder }
  ),
} satisfies Record<string, ComponentType<HairlineProps>>

export type HairlineFigureName = keyof typeof figures

interface HairlineFigureProps {
  name: HairlineFigureName
  /** Accessible description of what the figure shows. */
  label: string
  /** Mono tag in the top-left corner, e.g. a step number. */
  tag?: string
  intensity?: number
  /**
   * What the figure sits on. Its plates are filled to hide what's behind
   * them, so the fill has to match: a card (the default) or the page itself.
   */
  surface?: "card" | "page"
  /** Show the tag and live read-out corners. Off where nothing frames them. */
  readout?: boolean
  className?: string
}

// `.hairline` in globals.css maps the tokens for a card; these re-point the
// three that depend on the surface for a figure drawn on the page.
const pageSurface =
  "[--hairline-plate:var(--background)] [--hairline-mid:color-mix(in_oklab,var(--muted-foreground)_55%,var(--background))] [--hairline-lo:color-mix(in_oklab,var(--foreground)_10%,var(--background))]"

/**
 * A Hairline figure wearing CodePulse's tokens (see `.hairline` in
 * globals.css), with the figure's live caption read out in the top-right
 * corner. The read-out is written straight to the DOM so a playing figure
 * never re-renders React.
 */
export function HairlineFigure({
  name,
  label,
  tag,
  intensity = 0.6,
  surface = "card",
  readout: showReadout = true,
  className,
}: HairlineFigureProps) {
  const readout = useRef<HTMLSpanElement>(null)
  const Figure = figures[name]

  return (
    <div
      className={cn(
        "hairline relative",
        surface === "page" && pageSurface,
        className
      )}
    >
      {/* Rendered before the figure so its ref exists when the figure first reads. */}
      {showReadout && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 z-10 flex items-center justify-between gap-4 font-mono text-[0.6875rem] tracking-wide text-muted-foreground tabular-nums"
        >
          <span className="text-foreground/80">{tag}</span>
          <span ref={readout} className="truncate" />
        </div>
      )}
      <Figure
        label={label}
        intensity={intensity}
        play
        onRead={(text) => {
          if (readout.current) readout.current.textContent = text
        }}
      />
    </div>
  )
}
