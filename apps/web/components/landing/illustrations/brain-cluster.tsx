export function BrainCluster() {
  const nodes = [
    { cx: 215, cy: 140, label: "</>", group: 0, size: 34 },
    { cx: 312, cy: 100, label: "{}", group: 0, size: 32 },
    { cx: 268, cy: 218, label: "fn()", group: 0, size: 34 },
    { cx: 120, cy: 222, label: "git", group: 1, size: 32 },
    { cx: 80, cy: 155, label: "css", group: 1, size: 32 },
    { cx: 400, cy: 232, label: "pkg", group: 2, size: 32 },
    { cx: 452, cy: 160, label: "api", group: 2, size: 34 },
    { cx: 390, cy: 308, label: "db", group: 2, size: 32 },
  ]

  const edges = [
    [0, 1],
    [0, 2],
    [1, 2],
    [3, 4],
    [5, 6],
    [5, 7],
    [6, 7],
    [0, 3],
    [2, 5],
  ]

  const groupColors = [
    "oklch(0.72 0.18 162)",
    "oklch(0.6 0.16 232)",
    "oklch(0.78 0.17 68)",
  ]

  const groupGlows = [
    { cx: 265, cy: 153, rx: 136, ry: 106 },
    { cx: 100, cy: 190, rx: 86, ry: 82 },
    { cx: 415, cy: 235, rx: 104, ry: 102 },
  ]

  return (
    <svg
      viewBox="0 0 560 420"
      style={{ width: "100%", maxWidth: "480px", display: "block" }}
      aria-hidden="true"
    >
      <defs>
        <radialGradient id="bc-glow-0" cx="50%" cy="50%" r="50%">
          <stop
            offset="0%"
            stopColor="oklch(0.72 0.18 162)"
            stopOpacity="0.14"
          />
          <stop
            offset="100%"
            stopColor="oklch(0.72 0.18 162)"
            stopOpacity="0"
          />
        </radialGradient>
        <radialGradient id="bc-glow-1" cx="50%" cy="50%" r="50%">
          <stop
            offset="0%"
            stopColor="oklch(0.6 0.16 232)"
            stopOpacity="0.14"
          />
          <stop offset="100%" stopColor="oklch(0.6 0.16 232)" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="bc-glow-2" cx="50%" cy="50%" r="50%">
          <stop
            offset="0%"
            stopColor="oklch(0.78 0.17 68)"
            stopOpacity="0.14"
          />
          <stop offset="100%" stopColor="oklch(0.78 0.17 68)" stopOpacity="0" />
        </radialGradient>
        <filter id="bc-node-glow">
          <feDropShadow
            dx="0"
            dy="0"
            stdDeviation="7"
            floodColor="oklch(0.72 0.18 162)"
            floodOpacity="0.4"
          />
        </filter>
        <style>{`
          .bc-float { animation: float 5s ease-in-out infinite; transform-origin: 280px 192px; }
        `}</style>
      </defs>

      <g className="bc-float">
        {/* Cluster glow auras */}
        {groupGlows.map((g, i) => (
          <ellipse
            key={i}
            cx={g.cx}
            cy={g.cy}
            rx={g.rx}
            ry={g.ry}
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
              x1={na.cx}
              y1={na.cy}
              x2={nb.cx}
              y2={nb.cy}
              stroke={isCross ? "oklch(1 0 0 / 0.1)" : groupColors[na.group]}
              strokeWidth={isCross ? 0.8 : 1.2}
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
              <circle
                cx={node.cx}
                cy={node.cy}
                r={r + 10}
                fill="none"
                stroke={groupColors[node.group]}
                strokeWidth="0.8"
                strokeOpacity="0.2"
              />
              {/* Node body */}
              <circle
                cx={node.cx}
                cy={node.cy}
                r={r}
                fill="oklch(0.17 0.017 255)"
                stroke={groupColors[node.group]}
                strokeWidth="1.4"
                strokeOpacity="0.7"
              />
              {/* Inner tint */}
              <circle
                cx={node.cx}
                cy={node.cy}
                r={r - 20}
                fill={groupColors[node.group]}
                opacity="0.07"
              />
              {/* Label */}
              <text
                x={node.cx}
                y={node.cy + 5}
                textAnchor="middle"
                fontFamily="monospace"
                fontSize="15"
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
        <circle
          cx="190"
          cy="76"
          r="3"
          fill="oklch(0.72 0.18 162)"
          opacity="0.4"
          style={{ animation: "float 4.2s ease-in-out 0.3s infinite" }}
        />
        <circle
          cx="478"
          cy="118"
          r="2.5"
          fill="oklch(0.78 0.17 68)"
          opacity="0.38"
          style={{ animation: "float 3.8s ease-in-out 0.9s infinite" }}
        />
        <circle
          cx="64"
          cy="298"
          r="3"
          fill="oklch(0.6 0.16 232)"
          opacity="0.38"
          style={{ animation: "float 4.8s ease-in-out 0.6s infinite" }}
        />
        <circle
          cx="494"
          cy="322"
          r="2.5"
          fill="oklch(0.72 0.18 162)"
          opacity="0.3"
          style={{ animation: "float 4s   ease-in-out 1.1s infinite" }}
        />
      </g>

      {/* Cluster labels — below illustration */}
      <text
        x="265"
        y="358"
        textAnchor="middle"
        fontFamily="monospace"
        fontSize="20"
        fill="oklch(0.72 0.18 162)"
        opacity="0.82"
      >
        React Patterns
      </text>
      <text
        x="100"
        y="358"
        textAnchor="middle"
        fontFamily="monospace"
        fontSize="20"
        fill="oklch(0.6 0.16 232)"
        opacity="0.82"
      >
        Tooling
      </text>
      <text
        x="420"
        y="364"
        textAnchor="middle"
        fontFamily="monospace"
        fontSize="20"
        fill="oklch(0.78 0.17 68)"
        opacity="0.82"
      >
        Backend
      </text>
    </svg>
  )
}
