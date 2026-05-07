"use client"

import { useRouter } from "next/navigation"

export type DependencySnippet = {
  id: string
  title: string
  language: string
  confidence: number
}

type Props = {
  currentTitle: string
  prerequisites: DependencySnippet[]
  dependents: DependencySnippet[]
}

// Layout constants
const NW = 148    // node width
const NH = 54     // node height
const NR = 10     // corner radius
const HGAP = 80   // horizontal gap between columns
const VGAP = 72   // vertical gap between rows in same column
const PAD_X = 16  // canvas horizontal padding
const PAD_Y = 24  // canvas vertical padding
const ARROW_PAD = 2  // stop path this many px before node rect

function clip(s: string, n = 17) {
  return s.length > n ? s.slice(0, n - 1) + "…" : s
}

function rowY(i: number, total: number, canvasH: number) {
  const colH = NH + (total - 1) * VGAP
  return (canvasH - colH) / 2 + i * VGAP
}

export function DependencyGraph({ currentTitle, prerequisites, dependents }: Props) {
  const router = useRouter()

  if (!prerequisites.length && !dependents.length) return null

  const hasPre = prerequisites.length > 0
  const hasDep = dependents.length > 0
  const maxRows = Math.max(prerequisites.length, dependents.length, 1)
  const canvasH = Math.max(NH + PAD_Y * 2, maxRows * VGAP + PAD_Y * 2)

  // Column left-edge x positions
  let prereqX: number, curX: number, depX: number, canvasW: number
  if (hasPre && hasDep) {
    prereqX = PAD_X
    curX    = PAD_X + NW + HGAP
    depX    = PAD_X + NW * 2 + HGAP * 2
    canvasW = depX + NW + PAD_X
  } else if (hasPre) {
    prereqX = PAD_X
    curX    = PAD_X + NW + HGAP
    depX    = 0
    canvasW = curX + NW + PAD_X
  } else {
    prereqX = 0
    curX    = PAD_X
    depX    = PAD_X + NW + HGAP
    canvasW = depX + NW + PAD_X
  }

  const curY = (canvasH - NH) / 2

  function NavNode({
    x, y, snippet,
  }: {
    x: number
    y: number
    snippet: DependencySnippet
  }) {
    return (
      <g
        className="cursor-pointer"
        onClick={() => router.push(`/snippets/${snippet.id}`)}
        role="link"
        aria-label={snippet.title}
        tabIndex={0}
        onKeyDown={(e) => e.key === "Enter" && router.push(`/snippets/${snippet.id}`)}
      >
        <rect
          x={x} y={y} width={NW} height={NH} rx={NR}
          className="fill-muted/50 stroke-border transition-colors"
          strokeWidth="1"
        />
        {/* hover overlay — separate transparent rect so transition works cleanly */}
        <rect
          x={x} y={y} width={NW} height={NH} rx={NR}
          className="fill-transparent hover:fill-muted/60 transition-colors"
        />
        <text
          x={x + 12} y={y + 21}
          fontSize={12} fontWeight={500}
          className="fill-foreground pointer-events-none select-none"
        >
          {clip(snippet.title)}
        </text>
        <text
          x={x + 12} y={y + 37}
          fontSize={10}
          className="fill-muted-foreground pointer-events-none select-none"
          opacity={0.7}
        >
          {snippet.language}
        </text>
        <text
          x={x + NW - 10} y={y + 37}
          fontSize={10} textAnchor="end"
          className="fill-muted-foreground pointer-events-none select-none"
          opacity={0.7}
        >
          {Math.round(snippet.confidence * 100)}%
        </text>
      </g>
    )
  }

  return (
    <div className="mt-6 rounded-2xl border border-border bg-card overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-3.5 border-b border-border">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
          Knowledge graph
        </h2>
        <span className="text-[11px] text-muted-foreground/60 tabular-nums">
          {hasPre && hasDep
            ? "← builds on  ·  needed by →"
            : hasPre
            ? "← builds on"
            : "needed by →"}
        </span>
      </div>

      {/* Graph canvas */}
      <div className="overflow-x-auto p-4">
        <svg
          width={canvasW}
          height={canvasH}
          viewBox={`0 0 ${canvasW} ${canvasH}`}
          style={{ display: "block", minWidth: canvasW, fontFamily: "inherit" }}
        >
          <defs>
            <marker
              id="arrowhead"
              markerWidth="7" markerHeight="5"
              refX="6" refY="2.5"
              orient="auto"
            >
              <polygon
                points="0 0, 7 2.5, 0 5"
                className="fill-border"
                opacity="0.8"
              />
            </marker>
          </defs>

          {/* ── Prerequisite nodes + edges to current ── */}
          {prerequisites.map((s, i) => {
            const ny = rowY(i, prerequisites.length, canvasH)
            const x1 = prereqX + NW
            const y1 = ny + NH / 2
            const x2 = curX - ARROW_PAD
            const y2 = curY + NH / 2
            const mx = (x1 + x2) / 2
            return (
              <g key={s.id}>
                <path
                  d={`M ${x1} ${y1} C ${mx} ${y1}, ${mx} ${y2}, ${x2} ${y2}`}
                  fill="none"
                  className="stroke-border"
                  strokeWidth="1.5"
                  strokeOpacity={0.5}
                  markerEnd="url(#arrowhead)"
                />
                <NavNode x={prereqX} y={ny} snippet={s} />
              </g>
            )
          })}

          {/* ── Current snippet (center) ── */}
          <rect
            x={curX} y={curY} width={NW} height={NH} rx={NR}
            className="fill-primary/10 stroke-primary/40"
            strokeWidth="1.5"
          />
          <text
            x={curX + 12} y={curY + 21}
            fontSize={12} fontWeight={600}
            className="fill-foreground select-none"
          >
            {clip(currentTitle)}
          </text>
          <text
            x={curX + 12} y={curY + 37}
            fontSize={10}
            className="fill-primary select-none"
            opacity={0.75}
          >
            this snippet
          </text>

          {/* ── Dependent nodes + edges from current ── */}
          {dependents.map((s, i) => {
            const ny = rowY(i, dependents.length, canvasH)
            const x1 = curX + NW
            const y1 = curY + NH / 2
            const x2 = depX - ARROW_PAD
            const y2 = ny + NH / 2
            const mx = (x1 + x2) / 2
            return (
              <g key={s.id}>
                <path
                  d={`M ${x1} ${y1} C ${mx} ${y1}, ${mx} ${y2}, ${x2} ${y2}`}
                  fill="none"
                  className="stroke-border"
                  strokeWidth="1.5"
                  strokeOpacity={0.5}
                  markerEnd="url(#arrowhead)"
                />
                <NavNode x={depX} y={ny} snippet={s} />
              </g>
            )
          })}
        </svg>
      </div>
    </div>
  )
}
