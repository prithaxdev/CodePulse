export function KnowledgeStack() {
  return (
    <svg
      viewBox="0 0 560 480"
      style={{ width: "100%", maxWidth: "480px", display: "block" }}
      aria-hidden="true"
    >
      <defs>
        <radialGradient id="ks-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="oklch(0.72 0.18 162)" stopOpacity="0.2" />
          <stop offset="100%" stopColor="oklch(0.72 0.18 162)" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="ks-screen-glow" cx="50%" cy="50%" r="60%">
          <stop offset="0%" stopColor="oklch(0.72 0.18 162)" stopOpacity="0.12" />
          <stop offset="100%" stopColor="oklch(0.1 0.012 255)" stopOpacity="1" />
        </radialGradient>
        <filter id="ks-glow-filter">
          <feDropShadow dx="0" dy="0" stdDeviation="10" floodColor="oklch(0.72 0.18 162)" floodOpacity="0.3" />
        </filter>
        <filter id="ks-card-shadow">
          <feDropShadow dx="0" dy="6" stdDeviation="10" floodColor="oklch(0.05 0.01 255)" floodOpacity="0.7" />
        </filter>
        <clipPath id="ks-screen-clip">
          {/* Clip to the screen face of the monitor */}
          <polygon points="252,188 336,234 336,326 252,276" />
        </clipPath>
        <style>{`
          .ks-scene { animation: float 4.5s ease-in-out infinite; transform-origin: 280px 270px; }
          .ks-card-1 { animation: float 5.5s ease-in-out 0.5s infinite; transform-origin: 102px 148px; }
          .ks-card-2 { animation: float 5s ease-in-out 1s infinite; transform-origin: 412px 130px; }
          .ks-card-3 { animation: float 6s ease-in-out 0.3s infinite; transform-origin: 434px 340px; }
          .ks-cursor { animation: blink 1.1s step-end infinite; }
          .ks-ring { animation: pulse-ring 3s ease-out infinite; transform-origin: 295px 275px; }
        `}</style>
      </defs>

      {/* Ambient glow behind monitor */}
      <ellipse cx="295" cy="270" rx="220" ry="170" fill="url(#ks-glow)" />

      {/* Pulse ring */}
      <ellipse
        className="ks-ring"
        cx="295" cy="275" rx="145" ry="100"
        fill="none"
        stroke="oklch(0.72 0.18 162)"
        strokeWidth="1"
        strokeOpacity="0.35"
      />

      {/* Connecting lines (behind monitor) */}
      <path d="M 148,148 C 190,165 220,195 248,210"
        fill="none" stroke="oklch(0.72 0.18 162)" strokeWidth="1" strokeOpacity="0.35" strokeDasharray="5 4" />
      <path d="M 374,138 C 358,158 346,178 338,208"
        fill="none" stroke="oklch(0.72 0.18 162)" strokeWidth="1" strokeOpacity="0.35" strokeDasharray="5 4" />
      <path d="M 400,322 C 380,308 360,292 338,280"
        fill="none" stroke="oklch(0.72 0.18 162)" strokeWidth="1" strokeOpacity="0.35" strokeDasharray="5 4" />

      {/* ── Monitor (isometric box) ── */}
      <g className="ks-scene" filter="url(#ks-glow-filter)">
        {/* Top face */}
        <polygon
          points="240,172 352,234 304,260 192,198"
          fill="oklch(0.22 0.02 255)"
          stroke="oklch(0.72 0.18 162)" strokeWidth="1" strokeOpacity="0.35"
        />
        {/* Left face */}
        <polygon
          points="240,172 192,198 192,310 240,284"
          fill="oklch(0.13 0.015 255)"
          stroke="oklch(0.72 0.18 162)" strokeWidth="1" strokeOpacity="0.2"
        />
        {/* Front face (bezel) */}
        <polygon
          points="240,172 352,234 352,346 240,284"
          fill="oklch(0.17 0.017 255)"
          stroke="oklch(0.72 0.18 162)" strokeWidth="1.2" strokeOpacity="0.5"
        />

        {/* Screen bezel inset */}
        <polygon
          points="252,188 336,232 336,328 252,278"
          fill="oklch(0.09 0.011 255)"
        />
        {/* Screen glow */}
        <polygon
          points="254,190 334,232 334,326 254,276"
          fill="url(#ks-screen-glow)"
        />

        {/* Screen content */}
        <g clipPath="url(#ks-screen-clip)">
          {/* Scan line effect */}
          <rect x="252" y="188" width="84" height="138" fill="oklch(0.72 0.18 162)" opacity="0.015" />

          {/* Terminal lines */}
          <text x="260" y="210" fontFamily="monospace" fontSize="9" fill="oklch(0.72 0.18 162)" opacity="0.65">
            $ sm2_schedule
          </text>
          <text x="260" y="224" fontFamily="monospace" fontSize="8" fill="oklch(0.56 0.014 255)" opacity="0.8">
            quality: 5
          </text>
          <text x="260" y="238" fontFamily="monospace" fontSize="8" fill="oklch(0.56 0.014 255)" opacity="0.8">
            interval: 42
          </text>
          <text x="260" y="252" fontFamily="monospace" fontSize="8" fill="oklch(0.72 0.18 162)" opacity="0.85">
            → next review
          </text>
          <text x="260" y="266" fontFamily="monospace" fontSize="8" fill="oklch(0.78 0.17 68)" opacity="0.9" fontWeight="500">
            in 42 days ✓
          </text>
          <text x="260" y="282" fontFamily="monospace" fontSize="9" fill="oklch(0.72 0.18 162)">
            &gt;{" "}
          </text>
          <rect className="ks-cursor" x="272" y="273" width="7" height="10" fill="oklch(0.72 0.18 162)" />
        </g>

        {/* Stand */}
        <rect
          x="280" y="346" width="18" height="30" rx="2"
          fill="oklch(0.15 0.015 255)"
          stroke="oklch(1 0 0 / 0.06)" strokeWidth="0.5"
        />
        {/* Base */}
        <ellipse cx="289" cy="378" rx="32" ry="9"
          fill="oklch(0.17 0.017 255)"
          stroke="oklch(1 0 0 / 0.08)" strokeWidth="0.5"
        />
      </g>

      {/* ── Floating cards ── */}

      {/* Card 1 — top left */}
      <g className="ks-card-1" filter="url(#ks-card-shadow)">
        <rect x="58" y="114" width="92" height="68" rx="6"
          fill="oklch(0.17 0.017 255)"
          stroke="oklch(0.72 0.18 162)" strokeWidth="1" strokeOpacity="0.6"
          transform="rotate(-8, 104, 148)"
        />
        {/* Card header */}
        <rect x="66" y="122" width="36" height="4" rx="2"
          fill="oklch(0.72 0.18 162)" opacity="0.25"
          transform="rotate(-8, 104, 148)" />
        {/* Code lines */}
        <rect x="66" y="132" width="48" height="2" rx="1" fill="oklch(0.72 0.18 162)" opacity="0.85" transform="rotate(-8, 104, 148)" />
        <rect x="66" y="140" width="64" height="2" rx="1" fill="oklch(0.56 0.014 255)" opacity="0.65" transform="rotate(-8, 104, 148)" />
        <rect x="66" y="148" width="56" height="2" rx="1" fill="oklch(0.56 0.014 255)" opacity="0.6" transform="rotate(-8, 104, 148)" />
        <rect x="66" y="156" width="38" height="2" rx="1" fill="oklch(0.78 0.17 68)" opacity="0.75" transform="rotate(-8, 104, 148)" />
        <rect x="66" y="164" width="52" height="2" rx="1" fill="oklch(0.56 0.014 255)" opacity="0.5" transform="rotate(-8, 104, 148)" />
        {/* Dot indicator */}
        <circle cx="128" cy="120" r="4" fill="oklch(0.72 0.18 162)" opacity="0.7" transform="rotate(-8, 104, 148)" />
      </g>

      {/* Card 2 — top right */}
      <g className="ks-card-2" filter="url(#ks-card-shadow)">
        <rect x="372" y="102" width="88" height="60" rx="6"
          fill="oklch(0.17 0.017 255)"
          stroke="oklch(0.72 0.18 162)" strokeWidth="1" strokeOpacity="0.5"
          transform="rotate(7, 416, 132)"
        />
        <rect x="380" y="110" width="32" height="4" rx="2"
          fill="oklch(0.72 0.18 162)" opacity="0.2"
          transform="rotate(7, 416, 132)" />
        <rect x="380" y="120" width="44" height="2" rx="1" fill="oklch(0.72 0.18 162)" opacity="0.8" transform="rotate(7, 416, 132)" />
        <rect x="380" y="128" width="60" height="2" rx="1" fill="oklch(0.56 0.014 255)" opacity="0.6" transform="rotate(7, 416, 132)" />
        <rect x="380" y="136" width="50" height="2" rx="1" fill="oklch(0.56 0.014 255)" opacity="0.55" transform="rotate(7, 416, 132)" />
        <rect x="380" y="144" width="68" height="2" rx="1" fill="oklch(0.72 0.18 162)" opacity="0.45" transform="rotate(7, 416, 132)" />
        <rect x="380" y="152" width="34" height="2" rx="1" fill="oklch(0.78 0.17 68)" opacity="0.65" transform="rotate(7, 416, 132)" />
      </g>

      {/* Card 3 — bottom right */}
      <g className="ks-card-3" filter="url(#ks-card-shadow)">
        <rect x="396" y="308" width="88" height="66" rx="6"
          fill="oklch(0.17 0.017 255)"
          stroke="oklch(0.72 0.18 162)" strokeWidth="1" strokeOpacity="0.45"
          transform="rotate(-5, 440, 341)"
        />
        <rect x="404" y="316" width="32" height="4" rx="2"
          fill="oklch(0.78 0.17 68)" opacity="0.2"
          transform="rotate(-5, 440, 341)" />
        <rect x="404" y="326" width="52" height="2" rx="1" fill="oklch(0.78 0.17 68)" opacity="0.7" transform="rotate(-5, 440, 341)" />
        <rect x="404" y="334" width="62" height="2" rx="1" fill="oklch(0.56 0.014 255)" opacity="0.55" transform="rotate(-5, 440, 341)" />
        <rect x="404" y="342" width="44" height="2" rx="1" fill="oklch(0.72 0.18 162)" opacity="0.65" transform="rotate(-5, 440, 341)" />
        <rect x="404" y="350" width="56" height="2" rx="1" fill="oklch(0.56 0.014 255)" opacity="0.5" transform="rotate(-5, 440, 341)" />
        <rect x="404" y="358" width="38" height="2" rx="1" fill="oklch(0.56 0.014 255)" opacity="0.45" transform="rotate(-5, 440, 341)" />
      </g>

      {/* Floating particles */}
      <circle cx="174" cy="82" r="3" fill="oklch(0.72 0.18 162)" opacity="0.6" style={{ animation: "float 3.5s ease-in-out 0.4s infinite" }} />
      <circle cx="338" cy="62" r="2.5" fill="oklch(0.78 0.17 68)" opacity="0.55" style={{ animation: "float 4.2s ease-in-out 0.8s infinite" }} />
      <circle cx="490" cy="196" r="3.5" fill="oklch(0.72 0.18 162)" opacity="0.45" style={{ animation: "float 4s ease-in-out 1.1s infinite" }} />
      <circle cx="508" cy="298" r="2.5" fill="oklch(0.78 0.17 68)" opacity="0.4" style={{ animation: "float 4.8s ease-in-out 0.6s infinite" }} />
      <circle cx="468" cy="418" r="3" fill="oklch(0.72 0.18 162)" opacity="0.35" style={{ animation: "float 3.8s ease-in-out 1.3s infinite" }} />
      <circle cx="82" cy="256" r="2.5" fill="oklch(0.72 0.18 162)" opacity="0.5" style={{ animation: "float 4.5s ease-in-out 0.9s infinite" }} />
      <circle cx="64" cy="376" r="3" fill="oklch(0.78 0.17 68)" opacity="0.38" style={{ animation: "float 4s ease-in-out 0.7s infinite" }} />
      <circle cx="198" cy="430" r="2" fill="oklch(0.72 0.18 162)" opacity="0.35" style={{ animation: "float 4.6s ease-in-out 0.2s infinite" }} />
    </svg>
  )
}
