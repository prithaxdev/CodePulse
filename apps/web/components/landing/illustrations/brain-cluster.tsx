export function BrainCluster() {
  const nodes = [
    { cx: 240, cy: 130, label: "</>", group: 0 },
    { cx: 320, cy: 100, label: "{}", group: 0 },
    { cx: 280, cy: 195, label: "fn()", group: 0 },
    { cx: 140, cy: 220, label: "git", group: 1 },
    { cx: 100, cy: 160, label: "css", group: 1 },
    { cx: 380, cy: 220, label: "pkg", group: 2 },
    { cx: 420, cy: 160, label: "api", group: 2 },
    { cx: 360, cy: 280, label: "db", group: 2 },
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
    { cx: 280, cy: 145, rx: 90, ry: 70 },
    { cx: 120, cy: 195, rx: 60, ry: 55 },
    { cx: 390, cy: 222, rx: 70, ry: 65 },
  ]

  return (
    <svg
      viewBox="0 0 520 380"
      width="520"
      height="380"
      style={{ width: "100%", maxWidth: "480px" }}
      aria-hidden="true"
    >
      <defs>
        <radialGradient id="bc-glow-0" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="oklch(0.72 0.18 162)" stopOpacity="0.12" />
          <stop offset="100%" stopColor="oklch(0.72 0.18 162)" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="bc-glow-1" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="oklch(0.6 0.16 232)" stopOpacity="0.12" />
          <stop offset="100%" stopColor="oklch(0.6 0.16 232)" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="bc-glow-2" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="oklch(0.78 0.17 68)" stopOpacity="0.12" />
          <stop offset="100%" stopColor="oklch(0.78 0.17 68)" stopOpacity="0" />
        </radialGradient>
        <filter id="bc-node-glow">
          <feDropShadow dx="0" dy="0" stdDeviation="5" floodColor="oklch(0.72 0.18 162)" floodOpacity="0.4" />
        </filter>
        <style>{`
          .bc-float { animation: float 5s ease-in-out infinite; transform-origin: 260px 200px; }
          .bc-node-pulse {
            animation: pulse-ring 3s ease-out infinite;
          }
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
          const isCross = (na.group !== nb.group)
          return (
            <line
              key={i}
              x1={na.cx} y1={na.cy}
              x2={nb.cx} y2={nb.cy}
              stroke={isCross ? "oklch(1 0 0 / 0.1)" : groupColors[na.group]}
              strokeWidth={isCross ? 0.5 : 0.8}
              strokeOpacity={isCross ? 0.3 : 0.5}
              strokeDasharray={isCross ? "3 4" : undefined}
            />
          )
        })}

        {/* Nodes */}
        {nodes.map((node, i) => (
          <g key={i}>
            {/* Outer glow ring */}
            <circle
              cx={node.cx} cy={node.cy} r="22"
              fill="none"
              stroke={groupColors[node.group]}
              strokeWidth="0.5"
              strokeOpacity="0.25"
            />
            {/* Node background */}
            <circle
              cx={node.cx} cy={node.cy} r="17"
              fill="oklch(0.16 0.016 255)"
              stroke={groupColors[node.group]}
              strokeWidth="1"
              strokeOpacity="0.6"
            />
            {/* Node inner fill */}
            <circle
              cx={node.cx} cy={node.cy} r="12"
              fill={groupColors[node.group]}
              opacity="0.08"
            />
            {/* Label */}
            <text
              x={node.cx} y={node.cy + 4}
              textAnchor="middle"
              fontFamily="monospace"
              fontSize="8"
              fill={groupColors[node.group]}
              opacity="0.9"
            >
              {node.label}
            </text>
          </g>
        ))}

        {/* Floating particles */}
        <circle cx="190" cy="80" r="2" fill="oklch(0.72 0.18 162)" opacity="0.4" style={{ animation: "float 4s ease-in-out 0.3s infinite" }} />
        <circle cx="450" cy="130" r="1.5" fill="oklch(0.78 0.17 68)" opacity="0.4" style={{ animation: "float 3.5s ease-in-out 0.8s infinite" }} />
        <circle cx="80" cy="280" r="2" fill="oklch(0.6 0.16 232)" opacity="0.4" style={{ animation: "float 4.5s ease-in-out 0.5s infinite" }} />
        <circle cx="460" cy="310" r="1.5" fill="oklch(0.72 0.18 162)" opacity="0.3" style={{ animation: "float 3.8s ease-in-out 1s infinite" }} />
      </g>

      {/* Cluster labels */}
      <text x="280" y="310" textAnchor="middle" fontFamily="monospace" fontSize="7" fill="oklch(0.72 0.18 162)" opacity="0.5">React Patterns</text>
      <text x="120" y="310" textAnchor="middle" fontFamily="monospace" fontSize="7" fill="oklch(0.6 0.16 232)" opacity="0.5">Tooling</text>
      <text x="390" y="320" textAnchor="middle" fontFamily="monospace" fontSize="7" fill="oklch(0.78 0.17 68)" opacity="0.5">Backend</text>
    </svg>
  )
}
