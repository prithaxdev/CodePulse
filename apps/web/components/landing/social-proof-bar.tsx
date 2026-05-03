const items = [
  "★ SM-2 Algorithm",
  "TypeScript",
  "Next.js",
  "Spaced Repetition",
  "TF-IDF Search",
  "Auto-Clustering",
  "Open Source",
  "FastAPI",
  "Levenshtein Distance",
  "K-Means",
  "React",
  "Supabase",
]

export function SocialProofBar() {
  const doubled = [...items, ...items]

  return (
    <div
      style={{
        height: "48px",
        background: "var(--card)",
        borderTop: "1px solid var(--border)",
        borderBottom: "1px solid var(--border)",
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "0",
          animation: "marquee 35s linear infinite",
          whiteSpace: "nowrap",
          willChange: "transform",
        }}
      >
        {doubled.map((item, i) => (
          <span
            key={i}
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "0.72rem",
              color: "var(--muted-foreground)",
              padding: "0 2rem",
              letterSpacing: "0.06em",
              display: "flex",
              alignItems: "center",
              gap: "2rem",
            }}
          >
            {item}
            <span aria-hidden="true" style={{ color: "var(--border)", opacity: 0.8 }}>
              ·
            </span>
          </span>
        ))}
      </div>
    </div>
  )
}
