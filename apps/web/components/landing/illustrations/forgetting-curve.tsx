export function ForgettingCurve() {
  return (
    <svg
      viewBox="0 0 520 360"
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

      <ellipse cx="260" cy="210" rx="240" ry="150" fill="url(#fc-glow)" />

      {/* ── Chart axes ── */}
      <line x1="90" y1="55" x2="90" y2="278" stroke="oklch(1 0 0 / 0.1)" strokeWidth="1" />
      <line x1="90" y1="278" x2="460" y2="278" stroke="oklch(1 0 0 / 0.1)" strokeWidth="1" />

      {/* Grid lines */}
      {[100, 140, 180, 220, 260].map((y) => (
        <line key={y} x1="90" y1={y} x2="460" y2={y}
          stroke="oklch(1 0 0 / 0.05)" strokeWidth="0.5" strokeDasharray="4 6" />
      ))}

      {/* Y-axis labels */}
      <text x="80" y="68" textAnchor="end" fontFamily="monospace" fontSize="9" fill="oklch(0.56 0.014 255)" opacity="0.7">100%</text>
      <text x="80" y="148" textAnchor="end" fontFamily="monospace" fontSize="9" fill="oklch(0.56 0.014 255)" opacity="0.7">75%</text>
      <text x="80" y="218" textAnchor="end" fontFamily="monospace" fontSize="9" fill="oklch(0.56 0.014 255)" opacity="0.7">50%</text>
      <text x="80" y="278" textAnchor="end" fontFamily="monospace" fontSize="9" fill="oklch(0.56 0.014 255)" opacity="0.7">25%</text>

      {/* X-axis labels */}
      <text x="130" y="293" textAnchor="middle" fontFamily="monospace" fontSize="8" fill="oklch(0.56 0.014 255)" opacity="0.65">Day 1</text>
      <text x="220" y="293" textAnchor="middle" fontFamily="monospace" fontSize="8" fill="oklch(0.56 0.014 255)" opacity="0.65">Week 1</text>
      <text x="330" y="293" textAnchor="middle" fontFamily="monospace" fontSize="8" fill="oklch(0.56 0.014 255)" opacity="0.65">Month 1</text>
      <text x="440" y="293" textAnchor="middle" fontFamily="monospace" fontSize="8" fill="oklch(0.56 0.014 255)" opacity="0.65">Month 3</text>

      {/* ── WITHOUT review — red decay curve ── */}
      {/* Area fill */}
      <path
        d="M 130,65 C 160,78 190,112 230,162 C 260,202 290,242 330,258 C 365,272 405,276 450,278 L 450,278 L 130,278 Z"
        fill="oklch(0.65 0.22 27)" opacity="0.05"
      />
      {/* Curve */}
      <path
        d="M 130,65 C 160,78 190,112 230,162 C 260,202 290,242 330,258 C 365,272 405,276 450,278"
        fill="none"
        stroke="oklch(0.65 0.22 27)" strokeWidth="2" strokeOpacity="0.75"
        strokeLinecap="round"
      />
      {/* Label */}
      <text x="370" y="268" textAnchor="middle" fontFamily="monospace" fontSize="7.5" fill="oklch(0.65 0.22 27)" opacity="0.75">
        without review
      </text>

      {/* ── WITH spaced repetition — emerald curve with steps ── */}
      {/* Area fill */}
      <path
        d="M 130,65 C 152,75 165,85 182,90 L 182,74 C 188,62 200,62 215,64 C 232,68 248,76 268,82 L 268,68 C 274,56 288,56 302,58 C 318,62 332,68 352,74 L 352,60 C 358,50 372,50 388,52 C 404,56 420,62 450,68 L 450,278 L 130,278 Z"
        fill="oklch(0.72 0.18 162)" opacity="0.05"
      />

      {/* Curve segment 1: initial decay to first review */}
      <path d="M 130,65 C 152,75 165,85 182,90"
        fill="none" stroke="oklch(0.72 0.18 162)" strokeWidth="2.2" strokeOpacity="0.9" strokeLinecap="round" />
      {/* Review 1 step up */}
      <line x1="182" y1="90" x2="182" y2="72" stroke="oklch(0.72 0.18 162)" strokeWidth="1.5" strokeOpacity="0.6" />
      {/* Curve segment 2 */}
      <path d="M 182,72 C 196,68 212,68 232,70 C 248,72 260,78 268,82"
        fill="none" stroke="oklch(0.72 0.18 162)" strokeWidth="2.2" strokeOpacity="0.9" strokeLinecap="round" />
      {/* Review 2 step up */}
      <line x1="268" y1="82" x2="268" y2="66" stroke="oklch(0.72 0.18 162)" strokeWidth="1.5" strokeOpacity="0.6" />
      {/* Curve segment 3 */}
      <path d="M 268,66 C 284,62 300,62 320,64 C 338,67 348,72 352,74"
        fill="none" stroke="oklch(0.72 0.18 162)" strokeWidth="2.2" strokeOpacity="0.9" strokeLinecap="round" />
      {/* Review 3 step up */}
      <line x1="352" y1="74" x2="352" y2="58" stroke="oklch(0.72 0.18 162)" strokeWidth="1.5" strokeOpacity="0.6" />
      {/* Curve segment 4 */}
      <path d="M 352,58 C 368,54 388,56 410,60 C 428,63 440,66 450,68"
        fill="none" stroke="oklch(0.72 0.18 162)" strokeWidth="2.2" strokeOpacity="0.9" strokeLinecap="round" />

      {/* Review point markers */}
      {[
        { x: 182, y: 90 },
        { x: 268, y: 82 },
        { x: 352, y: 74 },
      ].map(({ x, y }, i) => (
        <g key={i} filter="url(#fc-node-glow)">
          {/* Outer ring */}
          <circle cx={x} cy={y} r="7" fill="none" stroke="oklch(0.72 0.18 162)" strokeWidth="1" strokeOpacity="0.4" />
          {/* Inner dot */}
          <circle cx={x} cy={y} r="4" fill="oklch(0.72 0.18 162)" opacity="0.9" />
          {/* Calendar icon below point */}
          <rect x={x - 9} y={y + 12} width="18" height="15" rx="2.5"
            fill="none" stroke="oklch(0.72 0.18 162)" strokeWidth="0.8" strokeOpacity="0.5" />
          <line x1={x - 9} y1={y + 17} x2={x + 9} y2={y + 17}
            stroke="oklch(0.72 0.18 162)" strokeWidth="0.7" strokeOpacity="0.35" />
          <text x={x} y={y + 26} textAnchor="middle" fontFamily="monospace" fontSize="6" fill="oklch(0.72 0.18 162)" opacity="0.7">
            review
          </text>
        </g>
      ))}

      {/* Emerald label */}
      <text x="415" y="57" textAnchor="middle" fontFamily="monospace" fontSize="7.5" fill="oklch(0.72 0.18 162)" opacity="0.8">
        with SM-2
      </text>

      {/* Legend */}
      <line x1="98" y1="318" x2="118" y2="318" stroke="oklch(0.65 0.22 27)" strokeWidth="2" />
      <circle cx="108" cy="318" r="2.5" fill="oklch(0.65 0.22 27)" />
      <text x="124" y="322" fontFamily="monospace" fontSize="8.5" fill="oklch(0.56 0.014 255)">Without review</text>

      <line x1="258" y1="318" x2="278" y2="318" stroke="oklch(0.72 0.18 162)" strokeWidth="2" />
      <circle cx="268" cy="318" r="2.5" fill="oklch(0.72 0.18 162)" />
      <text x="284" y="322" fontFamily="monospace" fontSize="8.5" fill="oklch(0.56 0.014 255)">With spaced repetition</text>

      {/* Platform base */}
      <rect x="86" y="280" width="378" height="6" rx="3" fill="oklch(0.16 0.016 255)" stroke="oklch(1 0 0 / 0.06)" strokeWidth="0.5" />
    </svg>
  )
}
