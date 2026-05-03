export function BrainCluster() {
  const nodes = [
    { cx: 220, cy: 145, label: "</>", group: 0, size: 22 },
    { cx: 305, cy: 108, label: "{}", group: 0, size: 20 },
    { cx: 265, cy: 210, label: "fn()", group: 0, size: 22 },
    { cx: 130, cy: 225, label: "git", group: 1, size: 20 },
    { cx: 92, cy: 162, label: "css", group: 1, size: 20 },
    { cx: 382, cy: 228, label: "pkg", group: 2, size: 20 },
    { cx: 428, cy: 162, label: "api", group: 2, size: 22 },
    { cx: 368, cy: 295, label: "db", group: 2, size: 20 },
  ]

  const edges = [
    [0, 1], [0, 2], [1, 2],
    [3, 4],
    [5, 6], [5, 7], [6, 7],
    [0, 3], [2, 5],
  ]

  const groupColors = [
    "oklch(0.72 0.18 162)",
    "oklch(0.6 0.16 232)",
    "oklch(0.78 0.17 68)",
  ]

  const groupGlows = [
    { cx: 264, cy: 157, rx: 100, ry: 82 },
    { cx: 112, cy: 198, rx: 66, ry: 62 },
    { cx: 396, cy: 230, rx: 80, ry: 76 },
  ]

  return (
    <svg
      viewBox="0 0 540 400"
      style={{ width: "100%", maxWidth: "480px", display: "block" }}
      aria-hidden="true"
    >
      <defs>
        <radialGradient id="bc-glow-0" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="oklch(0.72 0.18 162)" stopOpacity="0.14" />
          <stop offset="100%" stopColor="oklch(0.72 0.18 162)" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="bc-glow-1" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="oklch(0.6 0.16 232)" stopOpacity="0.14" />
          <stop offset="100%" stopColor="oklch(0.6 0.16 232)" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="bc-glow-2" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="oklch(0.78 0.17 68)" stopOpacity="0.14" />
          <stop offset="100%" stopColor="oklch(0.78 0.17 68)" stopOpacity="0" />
        </radialGradient>
        <filter id="bc-node-glow">
          <feDropShadow dx="0" dy="0" stdDeviation="6" floodColor="oklch(0.72 0.18 162)" floodOpacity="0.45" />
        </filter>
        <style>{`
          .bc-float { animation: float 5s ease-in-out infinite; transform-origin: 270px 205px; }
        `}</style>
      </defs>

      <g className="bc-float">
        {/* Cluster glow auras */}
        {groupGlows.map((g, i) => (
          <ellipse
            key={i}
            cx={g.cx} cy={g.cy}
            rx={g.rx} ry={g.ry}
            fill={`url(#bc-glow-${i})`}
          />
        ))}

        {/* Edges */}
        {edges.map(([a, b], i) => {
          const na = nodes[a]
          const nb = nodes[b]
          const isCross = na.group !== nb.group
          return (
            <line
              key={i}
              x1={na.cx} y1={na.cy}
              x2={nb.cx} y2={nb.cy}
              stroke={isCross ? "oklch(1 0 0 / 0.1)" : groupColors[na.group]}
              strokeWidth={isCross ? 0.6 : 1}
              strokeOpacity={isCross ? 0.3 : 0.5}
              strokeDasharray={isCross ? "4 5" : undefined}
            />
          )
        })}

        {/* Nodes */}
        {nodes.map((node, i) => {
          const r = node.size
          return (
            <g key={i} filter="url(#bc-node-glow)">
              {/* Outer ring glow */}
              <circle cx={node.cx} cy={node.cy} r={r + 8}
                fill="none"
                stroke={groupColors[node.group]}
                strokeWidth="0.6"
                strokeOpacity="0.2"
              />
              {/* Node body */}
              <circle cx={node.cx} cy={node.cy} r={r}
                fill="oklch(0.17 0.017 255)"
                stroke={groupColors[node.group]}
                strokeWidth="1.2"
                strokeOpacity="0.7"
              />
              {/* Inner tint */}
              <circle cx={node.cx} cy={node.cy} r={r - 6}
                fill={groupColors[node.group]}
                opacity="0.07"
              />
              {/* Label */}
              <text
                x={node.cx}
                y={node.cy + 4}
                textAnchor="middle"
                fontFamily="monospace"
                fontSize="9"
                fontWeight="500"
                fill={groupColors[node.group]}
                opacity="0.92"
              >
                {node.label}
              </text>
            </g>
          )
        })}

        {/* Floating micro-particles */}
        <circle cx="192" cy="80" r="2.5" fill="oklch(0.72 0.18 162)" opacity="0.4" style={{ animation: "float 4.2s ease-in-out 0.3s infinite" }} />
        <circle cx="468" cy="124" r="2" fill="oklch(0.78 0.17 68)" opacity="0.38" style={{ animation: "float 3.8s ease-in-out 0.9s infinite" }} />
        <circle cx="74" cy="296" r="2.5" fill="oklch(0.6 0.16 232)" opacity="0.38" style={{ animation: "float 4.8s ease-in-out 0.6s infinite" }} />
        <circle cx="486" cy="320" r="2" fill="oklch(0.72 0.18 162)" opacity="0.3" style={{ animation: "float 4s ease-in-out 1.1s infinite" }} />
      </g>

      {/* Cluster labels — below illustration */}
      <text x="264" y="325" textAnchor="middle" fontFamily="monospace" fontSize="8" fill="oklch(0.72 0.18 162)" opacity="0.5">
        React Patterns
      </text>
      <text x="112" y="325" textAnchor="middle" fontFamily="monospace" fontSize="8" fill="oklch(0.6 0.16 232)" opacity="0.5">
        Tooling
      </text>
      <text x="400" y="340" textAnchor="middle" fontFamily="monospace" fontSize="8" fill="oklch(0.78 0.17 68)" opacity="0.5">
        Backend
      </text>
    </svg>
  )
}
