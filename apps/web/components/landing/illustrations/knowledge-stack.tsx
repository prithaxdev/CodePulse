export function KnowledgeStack() {
  return (
    <svg
      viewBox="0 0 520 440"
      width="520"
      height="440"
      style={{ width: "100%", maxWidth: "520px" }}
      aria-hidden="true"
    >
      <defs>
        <radialGradient id="ks-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="oklch(0.72 0.18 162)" stopOpacity="0.18" />
          <stop offset="100%" stopColor="oklch(0.72 0.18 162)" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="ks-screen-glow" cx="50%" cy="50%" r="60%">
          <stop offset="0%" stopColor="oklch(0.72 0.18 162)" stopOpacity="0.08" />
          <stop offset="100%" stopColor="oklch(0.1 0.012 255)" stopOpacity="1" />
        </radialGradient>
        <filter id="ks-drop-glow">
          <feDropShadow dx="0" dy="0" stdDeviation="6" floodColor="oklch(0.72 0.18 162)" floodOpacity="0.25" />
        </filter>
        <filter id="ks-card-shadow">
          <feDropShadow dx="0" dy="4" stdDeviation="8" floodColor="oklch(0.05 0.01 255)" floodOpacity="0.6" />
        </filter>
        <clipPath id="ks-screen-clip">
          <polygon points="247,182 320,222 320,302 247,258" />
        </clipPath>
        <style>{`
          .ks-float { animation: float 4s ease-in-out infinite; transform-origin: 260px 240px; }
          .ks-card-1 { animation: float 5s ease-in-out 0.4s infinite; transform-origin: 95px 120px; }
          .ks-card-2 { animation: float 5.5s ease-in-out 0.8s infinite; transform-origin: 400px 110px; }
          .ks-card-3 { animation: float 4.8s ease-in-out 0.2s infinite; transform-origin: 425px 318px; }
          .ks-cursor { animation: blink 1s step-end infinite; }
          .ks-pulse-ring {
            animation: pulse-ring 2.5s ease-out infinite;
            transform-origin: 284px 262px;
          }
        `}</style>
      </defs>

      {/* Background ambient glow */}
      <ellipse cx="270" cy="260" rx="200" ry="160" fill="url(#ks-glow)" />

      {/* Pulse ring behind monitor */}
      <ellipse
        className="ks-pulse-ring"
        cx="284" cy="262" rx="110" ry="80"
        fill="none"
        stroke="oklch(0.72 0.18 162)"
        strokeWidth="1"
        opacity="0.4"
      />

      {/* Floating cards — back layer */}
      <g className="ks-card-3" filter="url(#ks-card-shadow)">
        {/* Card 3 — bottom right */}
        <rect x="388" y="294" width="78" height="56" rx="5"
          fill="oklch(0.16 0.016 255)" stroke="oklch(0.72 0.18 162)" strokeWidth="0.8" strokeOpacity="0.5"
          transform="rotate(-5, 427, 322)"
        />
        <rect x="394" y="306" width="38" height="1.5" rx="1" fill="oklch(0.72 0.18 162)" opacity="0.9"
          transform="rotate(-5, 427, 322)" />
        <rect x="394" y="312" width="52" height="1.5" rx="1" fill="oklch(0.56 0.014 255)" opacity="0.7"
          transform="rotate(-5, 427, 322)" />
        <rect x="394" y="318" width="44" height="1.5" rx="1" fill="oklch(0.56 0.014 255)" opacity="0.7"
          transform="rotate(-5, 427, 322)" />
        <rect x="394" y="324" width="30" height="1.5" rx="1" fill="oklch(0.78 0.17 68)" opacity="0.8"
          transform="rotate(-5, 427, 322)" />
        <rect x="394" y="330" width="48" height="1.5" rx="1" fill="oklch(0.56 0.014 255)" opacity="0.5"
          transform="rotate(-5, 427, 322)" />
        {/* Card label */}
        <rect x="394" y="298" width="30" height="5" rx="2" fill="oklch(0.72 0.18 162)" opacity="0.25"
          transform="rotate(-5, 427, 322)" />
      </g>

      {/* Connecting lines — drawn before monitor so monitor overlaps them */}
      {/* Line from card1 to monitor */}
      <path
        d="M 152,122 C 190,140 210,170 244,188"
        fill="none" stroke="oklch(0.72 0.18 162)" strokeWidth="0.8" strokeOpacity="0.4"
        strokeDasharray="4 3"
      />
      {/* Line from card2 to monitor */}
      <path
        d="M 370,114 C 350,140 334,165 322,196"
        fill="none" stroke="oklch(0.72 0.18 162)" strokeWidth="0.8" strokeOpacity="0.4"
        strokeDasharray="4 3"
      />
      {/* Line from card3 to monitor */}
      <path
        d="M 392,305 C 375,285 352,270 322,262"
        fill="none" stroke="oklch(0.72 0.18 162)" strokeWidth="0.8" strokeOpacity="0.4"
        strokeDasharray="4 3"
      />

      {/* Monitor — main floating group */}
      <g className="ks-float" filter="url(#ks-drop-glow)">
        {/* Top face */}
        <polygon
          points="230,162 334,222 291,247 187,187"
          fill="oklch(0.20 0.018 255)"
          stroke="oklch(0.72 0.18 162)" strokeWidth="1" strokeOpacity="0.3"
        />
        {/* Left face */}
        <polygon
          points="230,262 187,287 187,187 230,162"
          fill="oklch(0.12 0.014 255)"
          stroke="oklch(0.72 0.18 162)" strokeWidth="1" strokeOpacity="0.2"
        />
        {/* Front face (bezel) */}
        <polygon
          points="230,262 334,322 334,222 230,162"
          fill="oklch(0.16 0.016 255)"
          stroke="oklch(0.72 0.18 162)" strokeWidth="1" strokeOpacity="0.4"
        />
        {/* Screen bezel inset */}
        <polygon
          points="245,182 322,222 322,304 245,258"
          fill="oklch(0.10 0.012 255)"
        />
        {/* Screen glow */}
        <polygon
          points="247,184 320,222 320,302 247,256"
          fill="url(#ks-screen-glow)"
        />
        {/* Screen content — clipped */}
        <g clipPath="url(#ks-screen-clip)">
          {/* Terminal prompt lines */}
          <text x="252" y="200" fontFamily="monospace" fontSize="7" fill="oklch(0.72 0.18 162)" opacity="0.6">
            $ sm2_schedule
          </text>
          <text x="252" y="212" fontFamily="monospace" fontSize="7" fill="oklch(0.56 0.014 255)" opacity="0.8">
            quality: 5
          </text>
          <text x="252" y="224" fontFamily="monospace" fontSize="7" fill="oklch(0.56 0.014 255)" opacity="0.8">
            interval: 42
          </text>
          <text x="252" y="236" fontFamily="monospace" fontSize="7" fill="oklch(0.72 0.18 162)" opacity="0.9">
            → next review
          </text>
          <text x="252" y="250" fontFamily="monospace" fontSize="7" fill="oklch(0.78 0.17 68)" opacity="0.9">
            in 42 days ✓
          </text>
          <text x="252" y="268" fontFamily="monospace" fontSize="7" fill="oklch(0.72 0.18 162)">
            &gt;{" "}
          </text>
          <rect className="ks-cursor" x="264" y="260" width="6" height="8" fill="oklch(0.72 0.18 162)" />
        </g>

        {/* Monitor stand */}
        <rect x="272" y="322" width="18" height="28" rx="2"
          fill="oklch(0.14 0.014 255)" stroke="oklch(1 0 0 / 0.08)" strokeWidth="0.5" />
        {/* Stand base */}
        <ellipse cx="281" cy="352" rx="28" ry="8"
          fill="oklch(0.16 0.016 255)" stroke="oklch(1 0 0 / 0.08)" strokeWidth="0.5" />
      </g>

      {/* Floating cards — front layer */}
      <g className="ks-card-1" filter="url(#ks-card-shadow)">
        {/* Card 1 — top left */}
        <rect x="56" y="94" width="80" height="60" rx="5"
          fill="oklch(0.16 0.016 255)" stroke="oklch(0.72 0.18 162)" strokeWidth="0.8" strokeOpacity="0.6"
          transform="rotate(-8, 96, 124)"
        />
        <rect x="64" y="106" width="42" height="1.5" rx="1" fill="oklch(0.72 0.18 162)" opacity="0.9"
          transform="rotate(-8, 96, 124)" />
        <rect x="64" y="113" width="56" height="1.5" rx="1" fill="oklch(0.56 0.014 255)" opacity="0.7"
          transform="rotate(-8, 96, 124)" />
        <rect x="64" y="120" width="48" height="1.5" rx="1" fill="oklch(0.56 0.014 255)" opacity="0.6"
          transform="rotate(-8, 96, 124)" />
        <rect x="64" y="127" width="34" height="1.5" rx="1" fill="oklch(0.78 0.17 68)" opacity="0.8"
          transform="rotate(-8, 96, 124)" />
        <rect x="64" y="134" width="50" height="1.5" rx="1" fill="oklch(0.56 0.014 255)" opacity="0.5"
          transform="rotate(-8, 96, 124)" />
        {/* Card badge */}
        <rect x="64" y="98" width="32" height="4" rx="2" fill="oklch(0.72 0.18 162)" opacity="0.2"
          transform="rotate(-8, 96, 124)" />
      </g>

      <g className="ks-card-2" filter="url(#ks-card-shadow)">
        {/* Card 2 — top right */}
        <rect x="362" y="84" width="76" height="54" rx="5"
          fill="oklch(0.16 0.016 255)" stroke="oklch(0.72 0.18 162)" strokeWidth="0.8" strokeOpacity="0.5"
          transform="rotate(6, 400, 111)"
        />
        <rect x="370" y="96" width="36" height="1.5" rx="1" fill="oklch(0.72 0.18 162)" opacity="0.9"
          transform="rotate(6, 400, 111)" />
        <rect x="370" y="103" width="50" height="1.5" rx="1" fill="oklch(0.56 0.014 255)" opacity="0.7"
          transform="rotate(6, 400, 111)" />
        <rect x="370" y="110" width="44" height="1.5" rx="1" fill="oklch(0.56 0.014 255)" opacity="0.6"
          transform="rotate(6, 400, 111)" />
        <rect x="370" y="117" width="58" height="1.5" rx="1" fill="oklch(0.72 0.18 162)" opacity="0.5"
          transform="rotate(6, 400, 111)" />
        <rect x="370" y="124" width="28" height="1.5" rx="1" fill="oklch(0.78 0.17 68)" opacity="0.7"
          transform="rotate(6, 400, 111)" />
      </g>

      {/* Floating particles */}
      <circle cx="162" cy="72" r="2.5" fill="oklch(0.72 0.18 162)" opacity="0.7" style={{ animation: "float 3.2s ease-in-out 0.3s infinite" }} />
      <circle cx="320" cy="52" r="2" fill="oklch(0.78 0.17 68)" opacity="0.6" style={{ animation: "float 4s ease-in-out 0.7s infinite" }} />
      <circle cx="460" cy="180" r="3" fill="oklch(0.72 0.18 162)" opacity="0.5" style={{ animation: "float 3.8s ease-in-out 1s infinite" }} />
      <circle cx="480" cy="260" r="2" fill="oklch(0.78 0.17 68)" opacity="0.5" style={{ animation: "float 4.5s ease-in-out 0.5s infinite" }} />
      <circle cx="440" cy="380" r="2.5" fill="oklch(0.72 0.18 162)" opacity="0.4" style={{ animation: "float 3.6s ease-in-out 1.2s infinite" }} />
      <circle cx="80" cy="230" r="2" fill="oklch(0.72 0.18 162)" opacity="0.5" style={{ animation: "float 4.2s ease-in-out 0.9s infinite" }} />
      <circle cx="70" cy="340" r="3" fill="oklch(0.78 0.17 68)" opacity="0.4" style={{ animation: "float 3.9s ease-in-out 0.6s infinite" }} />
      <circle cx="180" cy="400" r="2" fill="oklch(0.72 0.18 162)" opacity="0.4" style={{ animation: "float 4.4s ease-in-out 0.1s infinite" }} />
    </svg>
  )
}
