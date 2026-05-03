import { BrainCluster } from "./illustrations/brain-cluster"

export function FeaturesSection() {
  return (
    <section
      id="features"
      style={{
        padding: "6rem 1.5rem",
        maxWidth: "1200px",
        margin: "0 auto",
      }}
    >
      {/* Header */}
      <div style={{ marginBottom: "3rem" }}>
        <p
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "0.7rem",
            color: "var(--muted-foreground)",
            letterSpacing: "0.15em",
            textTransform: "uppercase",
            marginBottom: "0.75rem",
          }}
        >
          Features
        </p>
        <h2
          style={{
            fontFamily: "var(--font-heading)",
            fontSize: "clamp(2rem, 4vw, 3rem)",
            fontWeight: 700,
            lineHeight: 1.1,
            letterSpacing: "-0.025em",
            color: "var(--foreground)",
          }}
        >
          Everything your memory needs.
          <br />
          <span style={{ color: "var(--primary)" }}>Nothing it doesn&apos;t.</span>
        </h2>
      </div>

      {/* Bento grid */}
      <div
        className="bento-grid"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(12, 1fr)",
          gap: "0.875rem",
        }}
      >
        {/* Card 1 — SM-2 Review (large, span 7) */}
        <div
          className="feature-card feature-card-1"
          style={{
            gridColumn: "span 7",
            background: "var(--card)",
            border: "1px solid var(--border)",
            borderRadius: "var(--radius-2xl)",
            padding: "1.75rem",
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* Hover glow */}
          <div
            aria-hidden="true"
            style={{
              position: "absolute",
              inset: 0,
              background: "radial-gradient(ellipse 80% 60% at 50% 0%, oklch(0.72 0.18 162 / 0.05), transparent)",
              pointerEvents: "none",
            }}
          />

          <div style={{ position: "relative" }}>
            {/* Badge */}
            <span
              style={{
                display: "inline-block",
                fontFamily: "var(--font-mono)",
                fontSize: "0.65rem",
                color: "var(--primary)",
                border: "1px solid oklch(0.72 0.18 162 / 0.3)",
                borderRadius: "var(--radius)",
                padding: "0.2rem 0.6rem",
                marginBottom: "1rem",
                letterSpacing: "0.04em",
              }}
            >
              SM-2 Algorithm
            </span>

            <h3
              style={{
                fontFamily: "var(--font-heading)",
                fontSize: "1.25rem",
                fontWeight: 600,
                color: "var(--foreground)",
                marginBottom: "0.5rem",
                letterSpacing: "-0.01em",
              }}
            >
              Never forget with spaced repetition
            </h3>
            <p
              style={{
                fontSize: "0.875rem",
                color: "var(--muted-foreground)",
                lineHeight: 1.6,
                maxWidth: "42ch",
                marginBottom: "1.75rem",
              }}
            >
              The SM-2 algorithm — same science behind Anki — schedules each snippet at the exact moment your memory starts to fade.
            </p>

            {/* Mock review card UI */}
            <div
              style={{
                background: "oklch(0.1 0.012 255)",
                border: "1px solid var(--border)",
                borderRadius: "var(--radius-xl)",
                padding: "1.25rem",
                maxWidth: "380px",
              }}
            >
              {/* Card header */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.875rem" }}>
                <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.7rem", color: "var(--muted-foreground)" }}>
                  useCallback optimization
                </span>
                <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.65rem", color: "var(--primary)", background: "oklch(0.72 0.18 162 / 0.1)", padding: "0.15rem 0.5rem", borderRadius: "var(--radius-sm)" }}>
                  TypeScript
                </span>
              </div>

              {/* Code preview */}
              <div
                style={{
                  background: "oklch(0.14 0.014 255)",
                  borderRadius: "var(--radius-lg)",
                  padding: "0.875rem",
                  marginBottom: "1rem",
                  fontFamily: "var(--font-mono)",
                  fontSize: "0.72rem",
                  color: "var(--muted-foreground)",
                  lineHeight: 1.6,
                }}
              >
                <span style={{ color: "oklch(0.65 0.18 320)" }}>const</span>{" "}
                <span style={{ color: "oklch(0.72 0.18 162)" }}>memoized</span>{" "}
                <span style={{ color: "var(--muted-foreground)" }}>=</span>{" "}
                <span style={{ color: "oklch(0.65 0.18 320)" }}>useCallback</span>
                <span style={{ color: "var(--muted-foreground)" }}>{"(("}</span>
                <span style={{ color: "oklch(0.78 0.17 68)" }}>deps</span>
                <span style={{ color: "var(--muted-foreground)" }}>{") => {"}</span>
                <br />
                &nbsp;&nbsp;<span style={{ color: "var(--muted-foreground)" }}>{"//"} avoid re-renders</span>
                <br />
                <span style={{ color: "var(--muted-foreground)" }}>{"})"}</span>
              </div>

              {/* Rating buttons */}
              <div style={{ display: "flex", gap: "0.5rem" }}>
                <button
                  style={{
                    flex: 1,
                    fontFamily: "var(--font-mono)",
                    fontSize: "0.72rem",
                    padding: "0.5rem",
                    borderRadius: "var(--radius-lg)",
                    border: "1px solid oklch(0.65 0.22 27 / 0.3)",
                    background: "oklch(0.65 0.22 27 / 0.06)",
                    color: "oklch(0.65 0.22 27)",
                    cursor: "pointer",
                    transition: "background 0.15s, transform 0.15s",
                  }}
                >
                  Forgot
                </button>
                <button
                  style={{
                    flex: 1,
                    fontFamily: "var(--font-mono)",
                    fontSize: "0.72rem",
                    padding: "0.5rem",
                    borderRadius: "var(--radius-lg)",
                    border: "1px solid var(--border)",
                    background: "var(--muted)",
                    color: "var(--muted-foreground)",
                    cursor: "pointer",
                    transition: "background 0.15s, transform 0.15s",
                  }}
                >
                  Hard
                </button>
                <button
                  style={{
                    flex: 1,
                    fontFamily: "var(--font-mono)",
                    fontSize: "0.72rem",
                    padding: "0.5rem",
                    borderRadius: "var(--radius-lg)",
                    border: "1px solid oklch(0.72 0.18 162 / 0.3)",
                    background: "oklch(0.72 0.18 162 / 0.08)",
                    color: "var(--primary)",
                    cursor: "pointer",
                    transition: "background 0.15s, transform 0.15s",
                  }}
                >
                  Easy
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Card 2 — Semantic Search (span 5) */}
        <div
          className="feature-card feature-card-2"
          style={{
            gridColumn: "span 5",
            background: "var(--card)",
            border: "1px solid var(--border)",
            borderRadius: "var(--radius-2xl)",
            padding: "1.75rem",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div aria-hidden="true" style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 80% 60% at 50% 0%, oklch(0.72 0.18 162 / 0.04), transparent)", pointerEvents: "none" }} />
          <div style={{ position: "relative" }}>
            <h3 style={{ fontFamily: "var(--font-heading)", fontSize: "1.1rem", fontWeight: 600, color: "var(--foreground)", marginBottom: "0.4rem", letterSpacing: "-0.01em" }}>
              Find anything instantly
            </h3>
            <p style={{ fontSize: "0.8rem", color: "var(--muted-foreground)", lineHeight: 1.6, marginBottom: "1.5rem" }}>
              TF-IDF semantic search ranks results by relevance — not just keyword match. Built from scratch.
            </p>

            {/* Mock search UI */}
            <div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  background: "oklch(0.1 0.012 255)",
                  border: "1px solid var(--border)",
                  borderRadius: "var(--radius-lg)",
                  padding: "0.625rem 0.875rem",
                  marginBottom: "0.75rem",
                }}
              >
                <span style={{ color: "var(--primary)", fontFamily: "var(--font-mono)", fontSize: "0.8rem" }}>&gt;</span>
                <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.78rem", color: "var(--foreground)" }}>
                  useCallback optimization
                </span>
                <span style={{ marginLeft: "auto", width: "6px", height: "14px", background: "var(--primary)", opacity: 0.8, animation: "blink 1s step-end infinite" }} />
              </div>

              {[
                { label: "useCallback with deps", score: "94%" },
                { label: "useMemo vs useCallback", score: "87%" },
                { label: "React.memo performance", score: "71%" },
              ].map((r, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "0.5rem 0.75rem",
                    borderRadius: "var(--radius-lg)",
                    background: i === 0 ? "oklch(0.72 0.18 162 / 0.06)" : "transparent",
                    border: i === 0 ? "1px solid oklch(0.72 0.18 162 / 0.15)" : "1px solid transparent",
                    marginBottom: "0.25rem",
                  }}
                >
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.72rem", color: "var(--foreground)", opacity: i === 0 ? 1 : 0.6 }}>
                    {r.label}
                  </span>
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.65rem", color: "var(--primary)", fontVariantNumeric: "tabular-nums" }}>
                    {r.score}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Card 3 — Duplicate Detection (span 4) */}
        <div
          className="feature-card feature-card-3"
          style={{
            gridColumn: "span 4",
            background: "var(--card)",
            border: "1px solid var(--border)",
            borderRadius: "var(--radius-2xl)",
            padding: "1.75rem",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div aria-hidden="true" style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 80% 60% at 50% 0%, oklch(0.72 0.18 162 / 0.03), transparent)", pointerEvents: "none" }} />
          <div style={{ position: "relative" }}>
            <h3 style={{ fontFamily: "var(--font-heading)", fontSize: "1.05rem", fontWeight: 600, color: "var(--foreground)", marginBottom: "0.4rem", letterSpacing: "-0.01em" }}>
              No duplicate clutter
            </h3>
            <p style={{ fontSize: "0.8rem", color: "var(--muted-foreground)", lineHeight: 1.6, marginBottom: "1.5rem" }}>
              Levenshtein edit distance catches near-identical snippets before you save.
            </p>

            {/* Warning banner mockup */}
            <div
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: "0.625rem",
                background: "oklch(0.78 0.17 68 / 0.06)",
                border: "1px solid oklch(0.78 0.17 68 / 0.25)",
                borderRadius: "var(--radius-lg)",
                padding: "0.875rem",
              }}
            >
              <span style={{ fontSize: "0.9rem", flexShrink: 0, marginTop: "1px" }}>⚠</span>
              <div>
                <p style={{ fontFamily: "var(--font-mono)", fontSize: "0.72rem", color: "var(--pulse)", marginBottom: "0.2rem" }}>
                  87% similar snippet found
                </p>
                <p style={{ fontFamily: "var(--font-mono)", fontSize: "0.68rem", color: "oklch(0.56 0.014 255)" }}>
                  &quot;useEffect cleanup pattern&quot;
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Card 4 — Auto-Clustering (span 4) */}
        <div
          className="feature-card feature-card-4"
          style={{
            gridColumn: "span 4",
            background: "var(--card)",
            border: "1px solid var(--border)",
            borderRadius: "var(--radius-2xl)",
            padding: "1.75rem",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div aria-hidden="true" style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 80% 60% at 50% 0%, oklch(0.72 0.18 162 / 0.04), transparent)", pointerEvents: "none" }} />
          <div style={{ position: "relative" }}>
            <h3 style={{ fontFamily: "var(--font-heading)", fontSize: "1.05rem", fontWeight: 600, color: "var(--foreground)", marginBottom: "0.4rem", letterSpacing: "-0.01em" }}>
              Your snippets auto-organize
            </h3>
            <p style={{ fontSize: "0.8rem", color: "var(--muted-foreground)", lineHeight: 1.6, marginBottom: "1rem" }}>
              K-means clustering groups related snippets into topics — no manual tagging required.
            </p>
            <div style={{ transform: "scale(0.75)", transformOrigin: "top left", width: "133%", pointerEvents: "none" }}>
              <BrainCluster />
            </div>
          </div>
        </div>

        {/* Card 5 — Thread Generator (span 4) */}
        <div
          className="feature-card feature-card-5"
          style={{
            gridColumn: "span 4",
            background: "var(--card)",
            border: "1px solid var(--border)",
            borderRadius: "var(--radius-2xl)",
            padding: "1.75rem",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div aria-hidden="true" style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 80% 60% at 50% 0%, oklch(0.72 0.18 162 / 0.03), transparent)", pointerEvents: "none" }} />
          {/* X watermark */}
          <div aria-hidden="true" style={{ position: "absolute", bottom: "1rem", right: "1.25rem", fontFamily: "var(--font-mono)", fontSize: "1.5rem", color: "var(--border)", opacity: 0.4, fontWeight: 700, lineHeight: 1 }}>
            𝕏
          </div>
          <div style={{ position: "relative" }}>
            <h3 style={{ fontFamily: "var(--font-heading)", fontSize: "1.05rem", fontWeight: 600, color: "var(--foreground)", marginBottom: "0.4rem", letterSpacing: "-0.01em" }}>
              Turn clusters into content
            </h3>
            <p style={{ fontSize: "0.8rem", color: "var(--muted-foreground)", lineHeight: 1.6, marginBottom: "1.25rem" }}>
              Generate a dev tip thread from any topic cluster with one click.
            </p>

            {/* Thread mockup */}
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              {[
                { n: "1/", text: "useCallback vs useMemo — a thread" },
                { n: "2/", text: "useCallback memoizes functions, not values." },
                { n: "3/", text: "useMemo is for expensive computations." },
              ].map((t, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    gap: "0.5rem",
                    padding: "0.5rem 0.625rem",
                    background: i === 0 ? "oklch(0.72 0.18 162 / 0.05)" : "transparent",
                    borderRadius: "var(--radius-lg)",
                    border: i === 0 ? "1px solid oklch(0.72 0.18 162 / 0.12)" : "none",
                  }}
                >
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.65rem", color: "var(--primary)", flexShrink: 0, minWidth: "20px" }}>
                    {i === 0 ? "🧵" : t.n}
                  </span>
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.7rem", color: i === 0 ? "var(--foreground)" : "var(--muted-foreground)", lineHeight: 1.4 }}>
                    {t.text}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .bento-grid > * { grid-column: span 12 !important; }
        }
        @media (min-width: 769px) and (max-width: 1024px) {
          .feature-card-1 { grid-column: span 12 !important; }
          .feature-card-2 { grid-column: span 12 !important; }
          .feature-card-3 { grid-column: span 6 !important; }
          .feature-card-4 { grid-column: span 6 !important; }
          .feature-card-5 { grid-column: span 12 !important; }
        }
      `}</style>
    </section>
  )
}
