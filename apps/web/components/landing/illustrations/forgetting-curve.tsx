export function ForgettingCurve() {
  return (
    <svg
      viewBox="0 0 560 420"
      style={{ width: "100%", maxWidth: "480px", display: "block" }}
      aria-hidden="true"
    >
      <defs>
        <radialGradient id="fc-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="oklch(0.72 0.18 162)" stopOpacity="0.07" />
          <stop offset="100%" stopColor="oklch(0.72 0.18 162)" stopOpacity="0" />
        </radialGradient>
        <filter id="fc-node-glow">
          <feDropShadow dx="0" dy="0" stdDeviation="4" floodColor="oklch(0.72 0.18 162)" floodOpacity="0.5" />
        </filter>
      </defs>

      <ellipse cx="290" cy="215" rx="255" ry="170" fill="url(#fc-glow)" />

      {/* ── Chart axes ──
          y-axis: x=118   x-axis: y=300
          chart area: x[118..512] × y[48..300]
          width: 394px    height: 252px
      ── */}
      <line x1="118" y1="48" x2="118" y2="300" stroke="oklch(1 0 0 / 0.12)" strokeWidth="1" />
      <line x1="118" y1="300" x2="512" y2="300" stroke="oklch(1 0 0 / 0.12)" strokeWidth="1" />

      {/* Horizontal grid lines */}
      {[110, 160, 212, 262].map((y) => (
        <line key={y} x1="118" y1={y} x2="512" y2={y}
          stroke="oklch(1 0 0 / 0.05)" strokeWidth="0.5" strokeDasharray="4 6" />
      ))}

      {/* ── Y-axis labels — fontSize 13 ── */}
      <text x="106" y="66"  textAnchor="end" fontFamily="monospace" fontSize="13" fill="oklch(0.62 0.014 255)" opacity="0.85">100%</text>
      <text x="106" y="138" textAnchor="end" fontFamily="monospace" fontSize="13" fill="oklch(0.62 0.014 255)" opacity="0.85">75%</text>
      <text x="106" y="218" textAnchor="end" fontFamily="monospace" fontSize="13" fill="oklch(0.62 0.014 255)" opacity="0.85">50%</text>
      <text x="106" y="300" textAnchor="end" fontFamily="monospace" fontSize="13" fill="oklch(0.62 0.014 255)" opacity="0.85">25%</text>

      {/* ── X-axis labels — fontSize 12 ── */}
      <text x="158" y="320" textAnchor="middle" fontFamily="monospace" fontSize="12" fill="oklch(0.62 0.014 255)" opacity="0.8">Day 1</text>
      <text x="260" y="320" textAnchor="middle" fontFamily="monospace" fontSize="12" fill="oklch(0.62 0.014 255)" opacity="0.8">Week 1</text>
      <text x="382" y="320" textAnchor="middle" fontFamily="monospace" fontSize="12" fill="oklch(0.62 0.014 255)" opacity="0.8">Month 1</text>
      <text x="496" y="320" textAnchor="middle" fontFamily="monospace" fontSize="12" fill="oklch(0.62 0.014 255)" opacity="0.8">Month 3</text>

      {/* ── WITHOUT review — red exponential decay ── */}
      {/* Area fill */}
      <path
        d="M 158,62 C 188,76 220,114 260,164 C 292,206 326,248 368,270 C 404,286 450,296 512,299 L 512,300 L 158,300 Z"
        fill="oklch(0.65 0.22 27)" opacity="0.06"
      />
      {/* Curve */}
      <path
        d="M 158,62 C 188,76 220,114 260,164 C 292,206 326,248 368,270 C 404,286 450,296 512,299"
        fill="none"
        stroke="oklch(0.65 0.22 27)" strokeWidth="2.2" strokeOpacity="0.8"
        strokeLinecap="round"
      />
      {/* Label — sits above where the curve flattens, well clear of the line */}
      <text x="400" y="246" textAnchor="middle" fontFamily="monospace" fontSize="11" fill="oklch(0.65 0.22 27)" opacity="0.85">
        without review
      </text>

      {/* ── WITH spaced repetition — emerald with step-up reviews ── */}
      {/* Area fill */}
      <path
        d="M 158,62 C 180,72 194,80 214,86 L 214,68 C 228,60 246,60 266,62 C 282,65 298,70 314,74 L 314,56 C 330,50 348,50 368,53 C 385,56 400,60 418,64 L 418,50 C 434,46 450,47 470,51 C 486,55 500,59 512,63 L 512,300 L 158,300 Z"
        fill="oklch(0.72 0.18 162)" opacity="0.06"
      />
      {/* Segment 1: initial decay to first review */}
      <path d="M 158,62 C 180,72 194,80 214,86"
        fill="none" stroke="oklch(0.72 0.18 162)" strokeWidth="2.4" strokeOpacity="0.9" strokeLinecap="round" />
      {/* Step 1 */}
      <line x1="214" y1="86" x2="214" y2="68" stroke="oklch(0.72 0.18 162)" strokeWidth="1.6" strokeOpacity="0.55" />
      {/* Segment 2 */}
      <path d="M 214,68 C 228,63 246,62 266,64 C 282,66 298,71 314,74"
        fill="none" stroke="oklch(0.72 0.18 162)" strokeWidth="2.4" strokeOpacity="0.9" strokeLinecap="round" />
      {/* Step 2 */}
      <line x1="314" y1="74" x2="314" y2="56" stroke="oklch(0.72 0.18 162)" strokeWidth="1.6" strokeOpacity="0.55" />
      {/* Segment 3 */}
      <path d="M 314,56 C 330,51 348,51 368,54 C 385,57 400,61 418,64"
        fill="none" stroke="oklch(0.72 0.18 162)" strokeWidth="2.4" strokeOpacity="0.9" strokeLinecap="round" />
      {/* Step 3 */}
      <line x1="418" y1="64" x2="418" y2="50" stroke="oklch(0.72 0.18 162)" strokeWidth="1.6" strokeOpacity="0.55" />
      {/* Segment 4 */}
      <path d="M 418,50 C 434,47 450,48 470,52 C 486,55 500,60 512,63"
        fill="none" stroke="oklch(0.72 0.18 162)" strokeWidth="2.4" strokeOpacity="0.9" strokeLinecap="round" />

      {/* Review point markers */}
      {[
        { x: 214, y: 86 },
        { x: 314, y: 74 },
        { x: 418, y: 64 },
      ].map(({ x, y }, i) => (
        <g key={i} filter="url(#fc-node-glow)">
          <circle cx={x} cy={y} r="8"   fill="none" stroke="oklch(0.72 0.18 162)" strokeWidth="1.2" strokeOpacity="0.4" />
          <circle cx={x} cy={y} r="4.5" fill="oklch(0.72 0.18 162)" opacity="0.9" />
          {/* Mini calendar icon below dot */}
          <rect x={x - 11} y={y + 14} width="22" height="17" rx="3"
            fill="none" stroke="oklch(0.72 0.18 162)" strokeWidth="0.9" strokeOpacity="0.5" />
          <line x1={x - 11} y1={y + 21} x2={x + 11} y2={y + 21}
            stroke="oklch(0.72 0.18 162)" strokeWidth="0.8" strokeOpacity="0.35" />
          <text x={x} y={y + 42} textAnchor="middle" fontFamily="monospace" fontSize="9" fill="oklch(0.72 0.18 162)" opacity="0.75">
            review
          </text>
        </g>
      ))}

      {/* Emerald curve label */}
      <text x="470" y="30" textAnchor="middle" fontFamily="monospace" fontSize="11" fill="oklch(0.72 0.18 162)" opacity="0.88">
        with SM-2
      </text>

      {/* ── Legend ── */}
      <line x1="118" y1="364" x2="142" y2="364" stroke="oklch(0.65 0.22 27)" strokeWidth="2.2" />
      <circle cx="130" cy="364" r="3.5" fill="oklch(0.65 0.22 27)" />
      <text x="150" y="369" fontFamily="monospace" fontSize="12.5" fill="oklch(0.62 0.014 255)">Without review</text>

      <line x1="306" y1="364" x2="330" y2="364" stroke="oklch(0.72 0.18 162)" strokeWidth="2.2" />
      <circle cx="318" cy="364" r="3.5" fill="oklch(0.72 0.18 162)" />
      <text x="338" y="369" fontFamily="monospace" fontSize="12.5" fill="oklch(0.62 0.014 255)">With SM-2</text>

      {/* Axis base bar */}
      <rect x="114" y="302" width="402" height="6" rx="3" fill="oklch(0.16 0.016 255)" stroke="oklch(1 0 0 / 0.06)" strokeWidth="0.5" />
    </svg>
  )
}
