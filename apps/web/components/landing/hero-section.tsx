import Link from "next/link"
import { KnowledgeStack } from "./illustrations/knowledge-stack"

export function HeroSection() {
  return (
    <section
      style={{
        position: "relative",
        minHeight: "100svh",
        display: "flex",
        alignItems: "center",
        overflow: "hidden",
      }}
    >
      {/* Graph paper grid background */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
          maskImage: "linear-gradient(to bottom, black 50%, transparent 100%)",
          WebkitMaskImage: "linear-gradient(to bottom, black 50%, transparent 100%)",
          zIndex: 0,
        }}
      />

      <div
        style={{
          position: "relative",
          zIndex: 1,
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "6rem 1.5rem 4rem",
          width: "100%",
        }}
      >
        <div
          className="hero-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "4rem",
            alignItems: "center",
          }}
        >
          {/* Left — Copy */}
          <div className="hero-copy" style={{ animation: "fadeSlideUp 0.6s ease both" }}>
            {/* Eyebrow badge */}
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.5rem",
                background: "oklch(0.78 0.17 68 / 0.08)",
                border: "1px solid oklch(0.78 0.17 68 / 0.25)",
                borderRadius: "999px",
                padding: "0.3rem 0.875rem",
                marginBottom: "2rem",
              }}
            >
              <span
                style={{
                  width: "7px",
                  height: "7px",
                  borderRadius: "50%",
                  background: "var(--pulse)",
                  boxShadow: "0 0 8px var(--pulse)",
                  display: "inline-block",
                  animation: "pulse-ring 2s ease-out infinite",
                }}
              />
              <span
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "0.75rem",
                  color: "var(--pulse)",
                  letterSpacing: "0.04em",
                }}
              >
                Spaced repetition for developers
              </span>
            </div>

            {/* H1 */}
            <h1
              style={{
                fontFamily: "var(--font-heading)",
                fontSize: "clamp(3rem, 6vw, 5.5rem)",
                fontWeight: 700,
                lineHeight: 1.05,
                letterSpacing: "-0.03em",
                marginBottom: "1.5rem",
                color: "var(--foreground)",
              }}
            >
              Stop Googling
              <br />
              The Same Thing
              <br />
              <span style={{ color: "var(--primary)" }}>Twice.</span>
            </h1>

            {/* Subheadline */}
            <p
              style={{
                fontSize: "1.125rem",
                color: "var(--muted-foreground)",
                maxWidth: "38ch",
                lineHeight: 1.65,
                marginBottom: "2.5rem",
              }}
            >
              Save code snippets as you learn.
              <br />
              CodePulse schedules your reviews so
              <br />
              you actually remember them.
            </p>

            {/* CTA row */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.75rem", alignItems: "center", marginBottom: "2rem" }}>
              <Link
                href="/sign-up"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  fontFamily: "var(--font-mono)",
                  fontSize: "0.9rem",
                  fontWeight: 500,
                  color: "var(--primary-foreground)",
                  textDecoration: "none",
                  padding: "0.75rem 1.5rem",
                  borderRadius: "var(--radius-lg)",
                  background: "var(--primary)",
                  position: "relative",
                  overflow: "hidden",
                  transition: "opacity 0.15s, transform 0.15s",
                  boxShadow: "0 0 24px oklch(0.72 0.18 162 / 0.3)",
                }}
              >
                <span style={{ position: "relative", zIndex: 1 }}>Start free — no credit card</span>
                <span
                  aria-hidden="true"
                  style={{
                    position: "absolute",
                    inset: 0,
                    background: "linear-gradient(90deg, transparent, oklch(1 0 0 / 0.15), transparent)",
                    transform: "translateX(-100%)",
                    animation: "shimmer 3s infinite 0.5s",
                  }}
                />
              </Link>

              <a
                href="#how-it-works"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.375rem",
                  fontFamily: "var(--font-mono)",
                  fontSize: "0.875rem",
                  color: "var(--muted-foreground)",
                  textDecoration: "none",
                  padding: "0.75rem 1.25rem",
                  borderRadius: "var(--radius-lg)",
                  border: "1px solid var(--border)",
                  transition: "color 0.15s, border-color 0.15s",
                }}
              >
                See how it works
                <span aria-hidden="true">↓</span>
              </a>
            </div>

            {/* Social proof micro-copy */}
            <p
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "0.75rem",
                color: "var(--muted-foreground)",
                opacity: 0.7,
              }}
            >
              Join 400+ developers building their second brain
            </p>
          </div>

          {/* Right — Illustration */}
          <div
            className="hero-illustration"
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              position: "relative",
              animation: "fadeSlideUp 0.9s ease 0.2s both",
            }}
          >
            {/* Radial glow behind illustration */}
            <div
              aria-hidden="true"
              style={{
                position: "absolute",
                inset: "-20%",
                background:
                  "radial-gradient(ellipse 60% 50% at 50% 50%, oklch(0.72 0.18 162 / 0.1), transparent)",
                borderRadius: "50%",
                pointerEvents: "none",
              }}
            />
            <KnowledgeStack />
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .hero-grid {
            grid-template-columns: 1fr !important;
            gap: 2rem !important;
          }
          .hero-illustration {
            order: -1;
            max-width: 320px;
            margin: 0 auto;
          }
        }
      `}</style>
    </section>
  )
}
