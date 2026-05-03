"use client"

import { useEffect, useRef, useState } from "react"

type CodeToken = { text: string; color: string }
type CodeLine = CodeToken[]

const codeLines: CodeLine[] = [
  [{ text: "# SM-2 Spaced Repetition — CodePulse", color: "oklch(0.56 0.014 255)" }],
  [
    { text: "def ", color: "oklch(0.65 0.18 320)" },
    { text: "sm2_schedule", color: "oklch(0.72 0.18 162)" },
    { text: "(", color: "oklch(0.94 0.006 240)" },
    { text: "quality", color: "oklch(0.78 0.17 68)" },
    { text: ": int, ", color: "oklch(0.94 0.006 240)" },
    { text: "repetitions", color: "oklch(0.78 0.17 68)" },
    { text: ": int,", color: "oklch(0.94 0.006 240)" },
  ],
  [
    { text: "                 ", color: "oklch(0.94 0.006 240)" },
    { text: "ease_factor", color: "oklch(0.78 0.17 68)" },
    { text: ": float, ", color: "oklch(0.94 0.006 240)" },
    { text: "interval", color: "oklch(0.78 0.17 68)" },
    { text: ": int):", color: "oklch(0.94 0.006 240)" },
  ],
  [
    { text: "    if ", color: "oklch(0.65 0.18 320)" },
    { text: "quality ", color: "oklch(0.94 0.006 240)" },
    { text: "< ", color: "oklch(0.65 0.22 27)" },
    { text: "3", color: "oklch(0.78 0.17 68)" },
    { text: ":", color: "oklch(0.94 0.006 240)" },
  ],
  [
    { text: "        return ", color: "oklch(0.65 0.18 320)" },
    { text: "1", color: "oklch(0.78 0.17 68)" },
    { text: ", ", color: "oklch(0.94 0.006 240)" },
    { text: "0", color: "oklch(0.78 0.17 68)" },
    { text: ", ", color: "oklch(0.94 0.006 240)" },
    { text: "max", color: "oklch(0.72 0.18 162)" },
    { text: "(", color: "oklch(0.94 0.006 240)" },
    { text: "1.3", color: "oklch(0.78 0.17 68)" },
    { text: ", ease_factor - ", color: "oklch(0.94 0.006 240)" },
    { text: "0.2", color: "oklch(0.78 0.17 68)" },
    { text: ")", color: "oklch(0.94 0.006 240)" },
  ],
  [{ text: "", color: "" }],
  [
    { text: "    ef ", color: "oklch(0.94 0.006 240)" },
    { text: "= ", color: "oklch(0.65 0.22 27)" },
    { text: "ease_factor ", color: "oklch(0.94 0.006 240)" },
    { text: "+ (", color: "oklch(0.65 0.22 27)" },
    { text: "0.1 ", color: "oklch(0.78 0.17 68)" },
    { text: "- (", color: "oklch(0.65 0.22 27)" },
    { text: "5 ", color: "oklch(0.78 0.17 68)" },
    { text: "- quality) ", color: "oklch(0.94 0.006 240)" },
    { text: "*", color: "oklch(0.65 0.22 27)" },
  ],
  [
    { text: "         (", color: "oklch(0.94 0.006 240)" },
    { text: "0.08 ", color: "oklch(0.78 0.17 68)" },
    { text: "+ (", color: "oklch(0.65 0.22 27)" },
    { text: "5 ", color: "oklch(0.78 0.17 68)" },
    { text: "- quality) ", color: "oklch(0.94 0.006 240)" },
    { text: "* ", color: "oklch(0.65 0.22 27)" },
    { text: "0.02", color: "oklch(0.78 0.17 68)" },
    { text: "))", color: "oklch(0.94 0.006 240)" },
  ],
  [{ text: "", color: "" }],
  [
    { text: "    if ", color: "oklch(0.65 0.18 320)" },
    { text: "repetitions ", color: "oklch(0.94 0.006 240)" },
    { text: "== ", color: "oklch(0.65 0.22 27)" },
    { text: "0", color: "oklch(0.78 0.17 68)" },
    { text: ": interval ", color: "oklch(0.94 0.006 240)" },
    { text: "= ", color: "oklch(0.65 0.22 27)" },
    { text: "1", color: "oklch(0.78 0.17 68)" },
  ],
  [
    { text: "    elif ", color: "oklch(0.65 0.18 320)" },
    { text: "repetitions ", color: "oklch(0.94 0.006 240)" },
    { text: "== ", color: "oklch(0.65 0.22 27)" },
    { text: "1", color: "oklch(0.78 0.17 68)" },
    { text: ": interval ", color: "oklch(0.94 0.006 240)" },
    { text: "= ", color: "oklch(0.65 0.22 27)" },
    { text: "6", color: "oklch(0.78 0.17 68)" },
  ],
  [
    { text: "    else", color: "oklch(0.65 0.18 320)" },
    { text: ": interval ", color: "oklch(0.94 0.006 240)" },
    { text: "= ", color: "oklch(0.65 0.22 27)" },
    { text: "round", color: "oklch(0.72 0.18 162)" },
    { text: "(interval ", color: "oklch(0.94 0.006 240)" },
    { text: "* ", color: "oklch(0.65 0.22 27)" },
    { text: "ease_factor)", color: "oklch(0.94 0.006 240)" },
  ],
  [{ text: "", color: "" }],
  [
    { text: "    return ", color: "oklch(0.65 0.18 320)" },
    { text: "interval, repetitions ", color: "oklch(0.94 0.006 240)" },
    { text: "+ ", color: "oklch(0.65 0.22 27)" },
    { text: "1", color: "oklch(0.78 0.17 68)" },
    { text: ", ", color: "oklch(0.94 0.006 240)" },
    { text: "max", color: "oklch(0.72 0.18 162)" },
    { text: "(", color: "oklch(0.94 0.006 240)" },
    { text: "1.3", color: "oklch(0.78 0.17 68)" },
    { text: ", ef)", color: "oklch(0.94 0.006 240)" },
  ],
]

const algoTags = [
  "SM-2 Scheduling",
  "TF-IDF Vectorization",
  "Cosine Similarity",
  "K-Means Clustering",
  "Levenshtein Distance",
]

export function AlgorithmSection() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const [revealed, setRevealed] = useState(false)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setRevealed(true)
          observer.disconnect()
        }
      },
      { threshold: 0.25 },
    )
    if (sectionRef.current) observer.observe(sectionRef.current)
    return () => observer.disconnect()
  }, [])

  function handleCopy() {
    const code = codeLines.map((line) => line.map((t) => t.text).join("")).join("\n")
    navigator.clipboard.writeText(code).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  return (
    <section
      id="algorithm"
      ref={sectionRef}
      style={{
        padding: "6rem 1.5rem",
        maxWidth: "1200px",
        margin: "0 auto",
      }}
    >
      <div
        className="algo-grid"
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "5rem",
          alignItems: "center",
        }}
      >
        {/* Left — copy */}
        <div>
          <p
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "0.7rem",
              color: "var(--muted-foreground)",
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              marginBottom: "1rem",
            }}
          >
            Under the hood
          </p>
          <h2
            style={{
              fontFamily: "var(--font-heading)",
              fontSize: "clamp(2rem, 3.5vw, 2.75rem)",
              fontWeight: 700,
              lineHeight: 1.1,
              letterSpacing: "-0.025em",
              color: "var(--foreground)",
              marginBottom: "1.5rem",
            }}
          >
            Built from scratch.
            <br />
            <span style={{ color: "var(--primary)" }}>No black boxes.</span>
          </h2>
          <p
            style={{
              fontSize: "0.9375rem",
              color: "var(--muted-foreground)",
              lineHeight: 1.7,
              marginBottom: "2.5rem",
              maxWidth: "44ch",
            }}
          >
            All 5 algorithms implemented in pure Python — no scikit-learn, no NLTK, no pre-trained models.
            Because we wanted to understand every calculation that touches your memory.
          </p>

          {/* Algorithm pills */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
            {algoTags.map((tag) => (
              <span
                key={tag}
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "0.7rem",
                  color: "var(--muted-foreground)",
                  border: "1px solid var(--border)",
                  borderRadius: "var(--radius)",
                  padding: "0.25rem 0.75rem",
                  letterSpacing: "0.02em",
                }}
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Right — animated code block */}
        <div
          style={{
            background: "var(--card)",
            border: "1px solid var(--border)",
            borderRadius: "var(--radius-2xl)",
            overflow: "hidden",
            position: "relative",
          }}
        >
          {/* Code block header */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "0.75rem 1.25rem",
              borderBottom: "1px solid var(--border)",
              background: "oklch(0.12 0.013 255)",
            }}
          >
            <div style={{ display: "flex", gap: "0.5rem" }}>
              <span style={{ width: "10px", height: "10px", borderRadius: "50%", background: "oklch(0.65 0.22 27 / 0.4)", display: "block" }} />
              <span style={{ width: "10px", height: "10px", borderRadius: "50%", background: "oklch(0.78 0.17 68 / 0.4)", display: "block" }} />
              <span style={{ width: "10px", height: "10px", borderRadius: "50%", background: "oklch(0.72 0.18 162 / 0.4)", display: "block" }} />
            </div>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.65rem", color: "var(--muted-foreground)" }}>
              sm2.py
            </span>
            <button
              onClick={handleCopy}
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "0.65rem",
                color: copied ? "var(--primary)" : "var(--muted-foreground)",
                background: "none",
                border: "1px solid var(--border)",
                borderRadius: "var(--radius-sm)",
                padding: "0.2rem 0.5rem",
                cursor: "pointer",
                transition: "color 0.15s, border-color 0.15s",
              }}
            >
              {copied ? "Copied!" : "Copy"}
            </button>
          </div>

          {/* Code lines */}
          <div
            style={{
              padding: "1.25rem 0",
              overflowX: "auto",
            }}
          >
            {codeLines.map((line, lineIndex) => (
              <div
                key={lineIndex}
                style={{
                  display: "flex",
                  alignItems: "baseline",
                  padding: "0 1.25rem",
                  minHeight: "1.5em",
                  opacity: revealed ? 1 : 0,
                  transform: revealed ? "translateY(0)" : "translateY(4px)",
                  transition: `opacity 0.3s ease ${lineIndex * 0.04}s, transform 0.3s ease ${lineIndex * 0.04}s`,
                }}
              >
                {/* Line number */}
                <span
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "0.72rem",
                    color: "oklch(0.56 0.014 255)",
                    opacity: 0.4,
                    minWidth: "2rem",
                    marginRight: "1.25rem",
                    userSelect: "none",
                    fontVariantNumeric: "tabular-nums",
                  } as React.CSSProperties}
                >
                  {lineIndex + 1}
                </span>
                {/* Tokens */}
                <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.78rem", lineHeight: 1.7, whiteSpace: "pre" }}>
                  {line.map((token, ti) => (
                    <span key={ti} style={{ color: token.color || "var(--foreground)" }}>
                      {token.text}
                    </span>
                  ))}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .algo-grid {
            grid-template-columns: 1fr !important;
            gap: 2.5rem !important;
          }
        }
      `}</style>
    </section>
  )
}
