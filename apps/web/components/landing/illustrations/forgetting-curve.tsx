export function ForgettingCurve() {
  return (
    <svg
      viewBox="0 0 480 340"
      width="480"
      height="340"
      style={{ width: "100%", maxWidth: "480px" }}
      aria-hidden="true"
    >
      <defs>
        <radialGradient id="fc-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="oklch(0.72 0.18 162)" stopOpacity="0.08" />
          <stop offset="100%" stopColor="oklch(0.72 0.18 162)" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="fc-curve-red" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="oklch(0.65 0.22 27)" stopOpacity="0.9" />
          <stop offset="100%" stopColor="oklch(0.65 0.22 27)" stopOpacity="0.2" />
        </linearGradient>
        <linearGradient id="fc-curve-green" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="oklch(0.72 0.18 162)" stopOpacity="0.9" />
          <stop offset="100%" stopColor="oklch(0.72 0.18 162)" stopOpacity="0.2" />
        </linearGradient>
        <filter id="fc-glow-filter">
          <feDropShadow dx="0" dy="0" stdDeviation="3" floodColor="oklch(0.72 0.18 162)" floodOpacity="0.4" />
        </filter>
      </defs>

      {/* Background ambient */}
      <rect x="0" y="0" width="480" height="340" fill="none" />
      <ellipse cx="240" cy="200" rx="220" ry="140" fill="url(#fc-glow)" />

      {/* Platform — isometric-ish base surface */}
      <polygon
        points="80,280 400,280 440,310 40,310"
        fill="oklch(0.14 0.014 255)"
        stroke="oklch(1 0 0 / 0.08)" strokeWidth="1"
      />
      {/* Platform left side */}
      <polygon
        points="40,310 80,280 80,300 40,330"
        fill="oklch(0.11 0.013 255)"
      />

      {/* Y-axis — left */}
      <line x1="100" y1="60" x2="100" y2="268" stroke="oklch(1 0 0 / 0.12)" strokeWidth="1" />
      {/* X-axis — bottom */}
      <line x1="100" y1="268" x2="400" y2="268" stroke="oklch(1 0 0 / 0.12)" strokeWidth="1" />

      {/* Grid lines */}
      {[100, 140, 180, 220, 260].map((y) => (
        <line key={y} x1="100" y1={y} x2="400" y2={y}
          stroke="oklch(1 0 0 / 0.05)" strokeWidth="0.5" />
      ))}

      {/* Retention % label */}
      <text x="85" y="75" textAnchor="middle" fontFamily="monospace" fontSize="8" fill="oklch(0.56 0.014 255)" opacity="0.7">
        100%
      </text>
      <text x="85" y="170" textAnchor="middle" fontFamily="monospace" fontSize="8" fill="oklch(0.56 0.014 255)" opacity="0.7">
        50%
      </text>
      <text x="85" y="268" textAnchor="middle" fontFamily="monospace" fontSize="8" fill="oklch(0.56 0.014 255)" opacity="0.7">
        0%
      </text>

      {/* Time axis labels */}
      <text x="130" y="282" textAnchor="middle" fontFamily="monospace" fontSize="7" fill="oklch(0.56 0.014 255)" opacity="0.6">day 1</text>
      <text x="210" y="282" textAnchor="middle" fontFamily="monospace" fontSize="7" fill="oklch(0.56 0.014 255)" opacity="0.6">week 1</text>
      <text x="310" y="282" textAnchor="middle" fontFamily="monospace" fontSize="7" fill="oklch(0.56 0.014 255)" opacity="0.6">month 1</text>
      <text x="385" y="282" textAnchor="middle" fontFamily="monospace" fontSize="7" fill="oklch(0.56 0.014 255)" opacity="0.6">month 3</text>

      {/* WITHOUT review — steep exponential decay curve (red) */}
      {/* Filled area under curve */}
      <path
        d="M 130,72 C 155,82 175,110 210,160 C 240,200 270,230 300,248 C 330,262 360,266 390,268 L 390,268 L 130,268 Z"
        fill="oklch(0.65 0.22 27)" opacity="0.06"
      />
      {/* Curve line */}
      <path
        d="M 130,72 C 155,82 175,110 210,160 C 240,200 270,230 300,248 C 330,262 360,266 390,268"
        fill="none"
        stroke="oklch(0.65 0.22 27)" strokeWidth="2" strokeOpacity="0.8"
        strokeLinecap="round"
      />

      {/* WITH spaced repetition — stays elevated with review steps (emerald) */}
      {/* The curve rises at review points */}
      {/* Filled area */}
      <path
        d="M 130,72 C 145,78 155,88 175,92 L 175,78 C 180,70 190,68 200,68 C 215,70 225,76 240,80 L 240,68 C 245,60 255,58 268,60 C 280,62 292,68 310,72 L 310,62 C 315,54 325,53 338,55 C 352,57 365,64 390,68 L 390,268 L 130,268 Z"
        fill="oklch(0.72 0.18 162)" opacity="0.06"
      />
      {/* Curve with steps at review points */}
      <path
        d="M 130,72 C 145,78 155,88 175,92"
        fill="none" stroke="oklch(0.72 0.18 162)" strokeWidth="2" strokeOpacity="0.9" strokeLinecap="round"
      />
      <line x1="175" y1="92" x2="175" y2="74" stroke="oklch(0.72 0.18 162)" strokeWidth="1.5" strokeOpacity="0.7" />
      <path
        d="M 175,74 C 185,70 195,70 215,72 C 230,74 238,80 250,82"
        fill="none" stroke="oklch(0.72 0.18 162)" strokeWidth="2" strokeOpacity="0.9" strokeLinecap="round"
      />
      <line x1="250" y1="82" x2="250" y2="64" stroke="oklch(0.72 0.18 162)" strokeWidth="1.5" strokeOpacity="0.7" />
      <path
        d="M 250,64 C 265,61 278,63 300,67 C 316,70 326,74 338,76"
        fill="none" stroke="oklch(0.72 0.18 162)" strokeWidth="2" strokeOpacity="0.9" strokeLinecap="round"
      />
      <line x1="338" y1="76" x2="338" y2="60" stroke="oklch(0.72 0.18 162)" strokeWidth="1.5" strokeOpacity="0.7" />
      <path
        d="M 338,60 C 352,57 368,60 390,64"
        fill="none" stroke="oklch(0.72 0.18 162)" strokeWidth="2" strokeOpacity="0.9" strokeLinecap="round"
      />

      {/* Review point markers */}
      {([175, 250, 338] as number[]).map((x) => (
        <g key={x} filter="url(#fc-glow-filter)">
          <circle cx={x} cy={x === 175 ? 92 : x === 250 ? 82 : 76}
            r="4" fill="oklch(0.72 0.18 162)" opacity="0.9" />
          {/* Calendar icon below */}
          <rect x={x - 8} y={x === 175 ? 100 : x === 250 ? 92 : 86}
            width="16" height="13" rx="2"
            fill="none" stroke="oklch(0.72 0.18 162)" strokeWidth="0.8" strokeOpacity="0.5" />
          <line x1={x - 8} y1={x === 175 ? 104 : x === 250 ? 96 : 90}
            x2={x + 8} y2={x === 175 ? 104 : x === 250 ? 96 : 90}
            stroke="oklch(0.72 0.18 162)" strokeWidth="0.8" strokeOpacity="0.4" />
        </g>
      ))}

      {/* Legend */}
      <line x1="108" y1="300" x2="128" y2="300" stroke="oklch(0.65 0.22 27)" strokeWidth="1.5" />
      <circle cx="118" cy="300" r="2" fill="oklch(0.65 0.22 27)" />
      <text x="132" y="304" fontFamily="monospace" fontSize="7.5" fill="oklch(0.56 0.014 255)">Without review</text>

      <line x1="240" y1="300" x2="260" y2="300" stroke="oklch(0.72 0.18 162)" strokeWidth="1.5" />
      <circle cx="250" cy="300" r="2" fill="oklch(0.72 0.18 162)" />
      <text x="264" y="304" fontFamily="monospace" fontSize="7.5" fill="oklch(0.56 0.014 255)">With spaced repetition</text>
    </svg>
  )
}
