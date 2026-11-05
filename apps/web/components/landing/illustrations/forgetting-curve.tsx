"use client"

import { useState, type PointerEvent } from "react"
import { cn } from "@/lib/utils"

/*
 * Ebbinghaus forgetting curve, drawn in Hairline's line language: the same
 * `--hairline-*` tokens as the figures, hairline axes, and a read-out that
 * answers the pointer. Render it inside an element with the `hairline` class.
 *
 * Model: retention = FLOOR + (1 - FLOOR) · e^(-elapsed / stability). Every
 * review resets `elapsed` and raises `stability`. The decay is illustrative;
 * the review days are CodePulse's real schedule (sm2.py) for a snippet saved
 * and reviewed on day 0, then rated Easy each time: gaps of 4, 6, 16, 45 days.
 */

const HORIZON_DAYS = 90
const FLOOR = 0.2
const UNREVIEWED_STABILITY = 0.9
const REVIEW_DAYS = [4, 10, 26, 71]
const STABILITY = [5.8, 16, 56, 176, 300]

const W = 640
const H = 280
const PAD_X = 8
const PAD_Y = 12

const decay = (elapsed: number, stability: number) =>
  FLOOR + (1 - FLOOR) * Math.exp(-elapsed / stability)

const segments = [0, ...REVIEW_DAYS].map((start, i) => ({
  start,
  end: REVIEW_DAYS[i] ?? HORIZON_DAYS,
  stability: STABILITY[i],
}))

function retentionWithout(day: number): number {
  return decay(day, UNREVIEWED_STABILITY)
}

function retentionWithSm2(day: number): number {
  let current = segments[0]
  for (const segment of segments) {
    if (day >= segment.start) current = segment
  }
  return decay(day - current.start, current.stability)
}

// Time runs on a log scale so the first day, where most of the forgetting
// happens, gets room.
const toUnit = (day: number) => Math.log1p(day) / Math.log1p(HORIZON_DAYS)
const toDay = (unit: number) => Math.expm1(unit * Math.log1p(HORIZON_DAYS))
const px = (day: number) => PAD_X + toUnit(day) * (W - 2 * PAD_X)
const py = (retention: number) => PAD_Y + (1 - retention) * (H - 2 * PAD_Y)
const pct = (value: number, of: number) => `${(value / of) * 100}%`
const percent = (retention: number) => `${Math.round(retention * 100)}%`

function sample(from: number, to: number, curve: (day: number) => number) {
  const steps = 48
  const a = toUnit(from)
  const b = toUnit(to)
  return Array.from({ length: steps + 1 }, (_, i) => {
    const day = toDay(a + ((b - a) * i) / steps)
    return `${px(day).toFixed(2)},${py(curve(day)).toFixed(2)}`
  }).join("L")
}

const withoutPath = `M${sample(0, HORIZON_DAYS, retentionWithout)}`

// Joining the segments draws each review as a vertical tick back to 100%.
const sm2Path = `M${segments
  .map(({ start, end, stability }) =>
    sample(start, end, (day) => decay(day - start, stability))
  )
  .join("L")}`

const reviewMarks = segments.slice(0, -1).map(({ start, end, stability }) => ({
  day: end,
  x: px(end),
  y: py(decay(end - start, stability)),
}))

const gridLines = [
  { retention: 1, label: "100%" },
  { retention: 0.5, label: "50%" },
  { retention: 0, label: "0%" },
]

const timeLabels = [
  { day: 1, label: "Day 1", short: "1d" },
  { day: 7, label: "Week 1", short: "1w" },
  { day: 30, label: "Month 1", short: "1mo" },
  { day: 90, label: "Month 3", short: "3mo" },
]

function Swatch({ dashed = false }: { dashed?: boolean }) {
  return (
    <svg
      width="20"
      height="2"
      viewBox="0 0 20 2"
      aria-hidden="true"
      className="shrink-0"
    >
      <line
        x1="0"
        y1="1"
        x2="20"
        y2="1"
        className={
          dashed ? "stroke-(--hairline-edge)" : "stroke-(--hairline-hi)"
        }
        strokeWidth={dashed ? 1.25 : 1.5}
        strokeDasharray={dashed ? "3 3" : undefined}
      />
    </svg>
  )
}

export function ForgettingCurve() {
  const [hoverDay, setHoverDay] = useState<number | null>(null)
  const day = hoverDay ?? HORIZON_DAYS

  function handlePointerMove(event: PointerEvent<HTMLDivElement>) {
    const rect = event.currentTarget.getBoundingClientRect()
    const x = ((event.clientX - rect.left) / rect.width) * W
    const unit = Math.min(1, Math.max(0, (x - PAD_X) / (W - 2 * PAD_X)))
    setHoverDay(Math.round(toDay(unit)))
  }

  return (
    <div className="flex flex-col gap-5">
      {/* The legend doubles as the read-out: swatches name the lines, the
          numbers follow the pointer and rest on day 90. */}
      <div className="flex flex-wrap items-center gap-x-5 gap-y-2 font-mono text-xs text-muted-foreground tabular-nums">
        <span className="flex items-center gap-2">
          <Swatch />
          With SM-2
          <span className="text-foreground">
            {percent(retentionWithSm2(day))}
          </span>
        </span>
        <span className="flex items-center gap-2">
          <Swatch dashed />
          Without review
          <span className="text-foreground">
            {percent(retentionWithout(day))}
          </span>
        </span>
        <span className="ml-auto">Day {day}</span>
      </div>

      <div className="grid grid-cols-[auto_1fr] gap-x-3">
        {/* Y labels share the plot's coordinates, so they stay on their
            gridlines at any width. The invisible label sizes the column. */}
        <div
          aria-hidden="true"
          className="relative font-mono text-[0.6875rem] leading-none text-muted-foreground tabular-nums"
        >
          <span className="invisible">100%</span>
          {gridLines.map(({ retention, label }) => (
            <span
              key={label}
              className="absolute right-0 -translate-y-1/2"
              style={{ top: pct(py(retention), H) }}
            >
              {label}
            </span>
          ))}
        </div>

        <div
          className="touch-pan-y"
          onPointerMove={handlePointerMove}
          onPointerLeave={() => setHoverDay(null)}
        >
          <svg
            viewBox={`0 0 ${W} ${H}`}
            role="img"
            aria-label="Modelled memory retention over 90 days. Without review it falls to about 20% within a week. With CodePulse reviews on days 0, 4, 10, 26 and 71 it stays above 60% and ends near 95%."
            className="block h-auto w-full overflow-visible fill-none"
          >
            {gridLines.map(({ retention, label }) => (
              <line
                key={label}
                x1={0}
                x2={W}
                y1={py(retention)}
                y2={py(retention)}
                className={
                  retention === 0
                    ? "stroke-(--hairline-mid)"
                    : "stroke-(--hairline-lo)"
                }
                strokeWidth={0.9}
                vectorEffect="non-scaling-stroke"
              />
            ))}

            <path
              d={withoutPath}
              className="stroke-(--hairline-edge)"
              strokeWidth={1.25}
              strokeDasharray="3 3"
              strokeLinecap="round"
              vectorEffect="non-scaling-stroke"
            />
            <path
              d={sm2Path}
              className="stroke-(--hairline-hi)"
              strokeWidth={1.5}
              strokeLinejoin="round"
              strokeLinecap="round"
              vectorEffect="non-scaling-stroke"
            />

            {reviewMarks.map(({ day: reviewDay, x, y }) => (
              <circle
                key={reviewDay}
                cx={x}
                cy={y}
                r={4}
                className="fill-(--hairline-plate) stroke-(--hairline-hi)"
                strokeWidth={1.25}
                vectorEffect="non-scaling-stroke"
              />
            ))}

            {hoverDay !== null && (
              <g>
                <line
                  x1={px(hoverDay)}
                  x2={px(hoverDay)}
                  y1={py(1)}
                  y2={py(0)}
                  className="stroke-(--hairline-mid)"
                  strokeWidth={0.9}
                  vectorEffect="non-scaling-stroke"
                />
                <circle
                  cx={px(hoverDay)}
                  cy={py(retentionWithout(hoverDay))}
                  r={4}
                  className="fill-(--hairline-plate) stroke-(--hairline-edge)"
                  strokeWidth={1.25}
                  vectorEffect="non-scaling-stroke"
                />
                <circle
                  cx={px(hoverDay)}
                  cy={py(retentionWithSm2(hoverDay))}
                  r={4}
                  className="fill-(--hairline-hi) stroke-(--hairline-plate)"
                  strokeWidth={2}
                  vectorEffect="non-scaling-stroke"
                />
              </g>
            )}
          </svg>
        </div>

        <div
          aria-hidden="true"
          className="relative col-start-2 mt-2.5 h-4 font-mono text-[0.6875rem] text-muted-foreground"
        >
          {timeLabels.map(({ day: labelDay, label, short }, i) => (
            <span
              key={label}
              className={cn(
                "absolute top-0 whitespace-nowrap",
                i === timeLabels.length - 1
                  ? "-translate-x-full"
                  : "-translate-x-1/2"
              )}
              style={{ left: pct(px(labelDay), W) }}
            >
              {/* Long labels collide on phones; the short ones keep the ticks. */}
              <span className="sm:hidden">{short}</span>
              <span className="hidden sm:inline">{label}</span>
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}
