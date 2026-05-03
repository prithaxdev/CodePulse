export function KnowledgeStack() {
  return (
    <svg
      viewBox="0 0 560 480"
      style={{ width: "100%", maxWidth: "480px", display: "block" }}
      aria-hidden="true"
    >
      <defs>
        <radialGradient id="ks-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="oklch(0.72 0.18 162)" stopOpacity="0.18" />
          <stop offset="100%" stopColor="oklch(0.72 0.18 162)" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="ks-screen-glow" cx="50%" cy="45%" r="65%">
          <stop offset="0%" stopColor="oklch(0.72 0.18 162)" stopOpacity="0.13" />
          <stop offset="100%" stopColor="oklch(0.06 0.009 255)" stopOpacity="1" />
        </radialGradient>
        <filter id="ks-glow-filter">
          <feDropShadow dx="0" dy="0" stdDeviation="14" floodColor="oklch(0.72 0.18 162)" floodOpacity="0.28" />
        </filter>
        <filter id="ks-card-shadow">
          <feDropShadow dx="0" dy="6" stdDeviation="10" floodColor="oklch(0.05 0.01 255)" floodOpacity="0.7" />
        </filter>
        {/* Clip matches the screen cavity polygon exactly */}
        <clipPath id="ks-screen-clip">
          <polygon points="196,165 364,199 364,316 196,282" />
        </clipPath>
        <style>{`
          .ks-scene  { animation: float 4.5s ease-in-out infinite;       transform-origin: 280px 242px; }
          .ks-card-1 { animation: float 5.5s ease-in-out 0.5s infinite;  transform-origin: 84px  128px; }
          .ks-card-2 { animation: float 5s   ease-in-out 1s   infinite;  transform-origin: 436px 112px; }
          .ks-card-3 { animation: float 6s   ease-in-out 0.3s infinite;  transform-origin: 470px 341px; }
          .ks-cursor { animation: blink 1.1s step-end infinite; }
          .ks-ring   { animation: pulse-ring 3s ease-out infinite;        transform-origin: 280px 242px; }
        `}</style>
      </defs>

      {/* Ambient glow */}
      <ellipse cx="280" cy="246" rx="218" ry="164" fill="url(#ks-glow)" />

      {/* Pulse ring */}
      <ellipse
        className="ks-ring"
        cx="280" cy="246" rx="154" ry="110"
        fill="none"
        stroke="oklch(0.72 0.18 162)"
        strokeWidth="1"
        strokeOpacity="0.28"
      />

      {/* Dashed connector lines — updated endpoints to match shifted cards */}
      <path d="M 130,128 C 148,138 162,150 178,162"
        fill="none" stroke="oklch(0.72 0.18 162)" strokeWidth="1" strokeOpacity="0.35" strokeDasharray="5 4" />
      <path d="M 393,126 C 388,148 380,164 368,186"
        fill="none" stroke="oklch(0.72 0.18 162)" strokeWidth="1" strokeOpacity="0.35" strokeDasharray="5 4" />
      <path d="M 428,320 C 412,310 392,302 370,298"
        fill="none" stroke="oklch(0.72 0.18 162)" strokeWidth="1" strokeOpacity="0.35" strokeDasharray="5 4" />

      {/* ── Monitor ── */}
      <g className="ks-scene" filter="url(#ks-glow-filter)">

        {/* Top face */}
        <polygon
          points="180,148 380,188 402,170 202,130"
          fill="oklch(0.26 0.022 255)"
          stroke="oklch(0.72 0.18 162)" strokeWidth="0.8" strokeOpacity="0.45"
        />
        {/* Right side face */}
        <polygon
          points="380,188 402,170 402,315 380,333"
          fill="oklch(0.13 0.014 255)"
          stroke="oklch(0.72 0.18 162)" strokeWidth="0.8" strokeOpacity="0.22"
        />
        {/* Front face — bezel */}
        <polygon
          points="180,148 380,188 380,333 180,293"
          fill="oklch(0.20 0.020 255)"
          stroke="oklch(0.72 0.18 162)" strokeWidth="1.2" strokeOpacity="0.55"
        />

        {/* Screen cavity */}
        <polygon
          points="196,165 364,199 364,316 196,282"
          fill="oklch(0.06 0.008 255)"
        />
        {/* Screen glow */}
        <polygon
          points="198,167 362,200 362,314 198,280"
          fill="url(#ks-screen-glow)"
        />

        {/*
          Screen content.

          Outer <g> holds the clipPath in un-transformed screen space.
          Inner <g> applies skewY(11°) centred at (280, 224) — matching the
          front-face slope of 40/200 = 0.20 ≈ tan(11.3°).

          At pivot x=280 the skew has zero y-shift; at x=210 it shifts
          text up by (210-280)×tan(11°) ≈ −13.6 px, so baseline y values
          are written 14 px higher than the desired visual positions to
          compensate (196→visual 182, 215→201, …, 289→275 at x=210).
        */}
        <g clipPath="url(#ks-screen-clip)">
          <g transform="translate(280,224) skewY(11) translate(-280,-224)">
            <text x="210" y="196" fontFamily="monospace" fontSize="12.5" fontWeight="500"
              fill="oklch(0.72 0.18 162)" opacity="0.92">
              $ sm2_run
            </text>
            <text x="210" y="215" fontFamily="monospace" fontSize="12"
              fill="oklch(0.56 0.014 255)" opacity="0.85">
              quality: 5
            </text>
            <text x="210" y="234" fontFamily="monospace" fontSize="12"
              fill="oklch(0.56 0.014 255)" opacity="0.85">
              interval: 42
            </text>
            <text x="210" y="253" fontFamily="monospace" fontSize="12"
              fill="oklch(0.72 0.18 162)" opacity="0.88">
              next in:
            </text>
            <text x="210" y="272" fontFamily="monospace" fontSize="12.5" fontWeight="600"
              fill="oklch(0.78 0.17 68)" opacity="1">
              42 days ✓
            </text>
            <text x="210" y="289" fontFamily="monospace" fontSize="12.5"
              fill="oklch(0.72 0.18 162)" opacity="0.85">
              &gt;
            </text>
            <rect className="ks-cursor" x="219" y="278" width="9" height="13" fill="oklch(0.72 0.18 162)" />
          </g>
        </g>

        {/* Camera dot — top bezel */}
        <circle cx="280" cy="157" r="2.5" fill="oklch(0.72 0.18 162)" opacity="0.35" />

        {/* Stand neck */}
        <rect
          x="269" y="314" width="22" height="34" rx="2"
          fill="oklch(0.17 0.017 255)"
          stroke="oklch(1 0 0 / 0.07)" strokeWidth="0.5"
        />
        {/* Base */}
        <ellipse cx="280" cy="351" rx="48" ry="13"
          fill="oklch(0.20 0.019 255)"
          stroke="oklch(1 0 0 / 0.08)" strokeWidth="0.5"
        />
        <ellipse cx="280" cy="348" rx="36" ry="8"
          fill="oklch(0.26 0.022 255)" opacity="0.5"
        />
      </g>

      {/* ── Floating cards ──
          Card 1: shifted −20 left, −20 up  → centre (84, 128)
          Card 2: shifted +20 right, −20 up → centre (436, 112)
          Card 3: shifted +30 right          → centre (470, 341)
      ── */}

      {/* Card 1 — top left */}
      <g className="ks-card-1" filter="url(#ks-card-shadow)">
        <rect x="38" y="94" width="92" height="68" rx="6"
          fill="oklch(0.17 0.017 255)"
          stroke="oklch(0.72 0.18 162)" strokeWidth="1" strokeOpacity="0.6"
          transform="rotate(-8, 84, 128)"
        />
        <rect x="46" y="102" width="36" height="4" rx="2"
          fill="oklch(0.72 0.18 162)" opacity="0.25"
          transform="rotate(-8, 84, 128)" />
        <rect x="46" y="112" width="48" height="2" rx="1" fill="oklch(0.72 0.18 162)" opacity="0.85" transform="rotate(-8, 84, 128)" />
        <rect x="46" y="120" width="64" height="2" rx="1" fill="oklch(0.56 0.014 255)" opacity="0.65" transform="rotate(-8, 84, 128)" />
        <rect x="46" y="128" width="56" height="2" rx="1" fill="oklch(0.56 0.014 255)" opacity="0.6"  transform="rotate(-8, 84, 128)" />
        <rect x="46" y="136" width="38" height="2" rx="1" fill="oklch(0.78 0.17 68)"   opacity="0.75" transform="rotate(-8, 84, 128)" />
        <rect x="46" y="144" width="52" height="2" rx="1" fill="oklch(0.56 0.014 255)" opacity="0.5"  transform="rotate(-8, 84, 128)" />
        <circle cx="108" cy="100" r="4" fill="oklch(0.72 0.18 162)" opacity="0.7" transform="rotate(-8, 84, 128)" />
      </g>

      {/* Card 2 — top right */}
      <g className="ks-card-2" filter="url(#ks-card-shadow)">
        <rect x="392" y="82" width="88" height="60" rx="6"
          fill="oklch(0.17 0.017 255)"
          stroke="oklch(0.72 0.18 162)" strokeWidth="1" strokeOpacity="0.5"
          transform="rotate(7, 436, 112)"
        />
        <rect x="400" y="90" width="32" height="4" rx="2"
          fill="oklch(0.72 0.18 162)" opacity="0.2"
          transform="rotate(7, 436, 112)" />
        <rect x="400" y="100" width="44" height="2" rx="1" fill="oklch(0.72 0.18 162)" opacity="0.8"  transform="rotate(7, 436, 112)" />
        <rect x="400" y="108" width="60" height="2" rx="1" fill="oklch(0.56 0.014 255)" opacity="0.6"  transform="rotate(7, 436, 112)" />
        <rect x="400" y="116" width="50" height="2" rx="1" fill="oklch(0.56 0.014 255)" opacity="0.55" transform="rotate(7, 436, 112)" />
        <rect x="400" y="124" width="68" height="2" rx="1" fill="oklch(0.72 0.18 162)" opacity="0.45" transform="rotate(7, 436, 112)" />
        <rect x="400" y="132" width="34" height="2" rx="1" fill="oklch(0.78 0.17 68)"   opacity="0.65" transform="rotate(7, 436, 112)" />
      </g>

      {/* Card 3 — bottom right */}
      <g className="ks-card-3" filter="url(#ks-card-shadow)">
        <rect x="426" y="308" width="88" height="66" rx="6"
          fill="oklch(0.17 0.017 255)"
          stroke="oklch(0.72 0.18 162)" strokeWidth="1" strokeOpacity="0.45"
          transform="rotate(-5, 470, 341)"
        />
        <rect x="434" y="316" width="32" height="4" rx="2"
          fill="oklch(0.78 0.17 68)" opacity="0.2"
          transform="rotate(-5, 470, 341)" />
        <rect x="434" y="326" width="52" height="2" rx="1" fill="oklch(0.78 0.17 68)"   opacity="0.7"  transform="rotate(-5, 470, 341)" />
        <rect x="434" y="334" width="62" height="2" rx="1" fill="oklch(0.56 0.014 255)" opacity="0.55" transform="rotate(-5, 470, 341)" />
        <rect x="434" y="342" width="44" height="2" rx="1" fill="oklch(0.72 0.18 162)" opacity="0.65" transform="rotate(-5, 470, 341)" />
        <rect x="434" y="350" width="56" height="2" rx="1" fill="oklch(0.56 0.014 255)" opacity="0.5"  transform="rotate(-5, 470, 341)" />
        <rect x="434" y="358" width="38" height="2" rx="1" fill="oklch(0.56 0.014 255)" opacity="0.45" transform="rotate(-5, 470, 341)" />
      </g>

      {/* Floating particles */}
      <circle cx="174" cy="82"  r="3"   fill="oklch(0.72 0.18 162)" opacity="0.6"  style={{ animation: "float 3.5s ease-in-out 0.4s infinite" }} />
      <circle cx="338" cy="62"  r="2.5" fill="oklch(0.78 0.17 68)"  opacity="0.55" style={{ animation: "float 4.2s ease-in-out 0.8s infinite" }} />
      <circle cx="490" cy="196" r="3.5" fill="oklch(0.72 0.18 162)" opacity="0.45" style={{ animation: "float 4s   ease-in-out 1.1s infinite" }} />
      <circle cx="508" cy="298" r="2.5" fill="oklch(0.78 0.17 68)"  opacity="0.4"  style={{ animation: "float 4.8s ease-in-out 0.6s infinite" }} />
      <circle cx="468" cy="418" r="3"   fill="oklch(0.72 0.18 162)" opacity="0.35" style={{ animation: "float 3.8s ease-in-out 1.3s infinite" }} />
      <circle cx="82"  cy="256" r="2.5" fill="oklch(0.72 0.18 162)" opacity="0.5"  style={{ animation: "float 4.5s ease-in-out 0.9s infinite" }} />
      <circle cx="64"  cy="376" r="3"   fill="oklch(0.78 0.17 68)"  opacity="0.38" style={{ animation: "float 4s   ease-in-out 0.7s infinite" }} />
      <circle cx="198" cy="430" r="2"   fill="oklch(0.72 0.18 162)" opacity="0.35" style={{ animation: "float 4.6s ease-in-out 0.2s infinite" }} />
    </svg>
  )
}
