import Link from "next/link"

export function CTASection() {
  return (
    <section
      style={{
        padding: "6rem 1.5rem",
        position: "relative",
        overflow: "hidden",
        textAlign: "center",
      }}
    >
      {/* Decorative horizontal lines */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          top: 0,
          left: "5%",
          right: "5%",
          height: "1px",
          background: "linear-gradient(90deg, transparent, var(--border), transparent)",
        }}
      />
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          bottom: 0,
          left: "5%",
          right: "5%",
          height: "1px",
          background: "linear-gradient(90deg, transparent, var(--border), transparent)",
        }}
      />

      {/* Radial emerald glow */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse 70% 60% at 50% 50%, oklch(0.72 0.18 162 / 0.08), transparent)",
          pointerEvents: "none",
        }}
      />

      <div style={{ position: "relative", maxWidth: "680px", margin: "0 auto" }}>
        {/* Eyebrow */}
        <p
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "0.7rem",
            color: "var(--muted-foreground)",
            letterSpacing: "0.15em",
            textTransform: "uppercase",
            marginBottom: "2rem",
          }}
        >
          Start today
        </p>

        <h2
          style={{
            fontFamily: "var(--font-heading)",
            fontSize: "clamp(2.25rem, 5vw, 4rem)",
            fontWeight: 700,
            lineHeight: 1.08,
            letterSpacing: "-0.03em",
            color: "var(--foreground)",
            marginBottom: "1.5rem",
          }}
        >
          You&apos;re going to forget
          <br />
          what you learned today.
        </h2>

        <p
          style={{
            fontSize: "1.0625rem",
            color: "var(--muted-foreground)",
            lineHeight: 1.65,
            marginBottom: "3rem",
            maxWidth: "38ch",
            margin: "0 auto 3rem",
          }}
        >
          Unless you review it tomorrow.
          <br />
          CodePulse makes sure you do.
        </p>

        {/* CTA button */}
        <Link
          href="/sign-up"
          className="cta-primary-btn"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.5rem",
            fontFamily: "var(--font-mono)",
            fontSize: "1rem",
            fontWeight: 500,
            color: "var(--primary-foreground)",
            textDecoration: "none",
            padding: "1rem 2.25rem",
            borderRadius: "var(--radius-lg)",
            background: "var(--primary)",
            position: "relative",
            overflow: "hidden",
            boxShadow: "0 0 40px oklch(0.72 0.18 162 / 0.35), 0 2px 8px oklch(0.05 0.01 255 / 0.4)",
          }}
        >
          <span style={{ position: "relative", zIndex: 1 }}>
            Start building your memory →
          </span>
          {/* Shimmer */}
          <span
            aria-hidden="true"
            style={{
              position: "absolute",
              inset: 0,
              background: "linear-gradient(90deg, transparent 0%, oklch(1 0 0 / 0.15) 50%, transparent 100%)",
              transform: "translateX(-100%)",
              animation: "shimmer 2.5s infinite 1s",
            }}
          />
        </Link>

        <p
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "0.75rem",
            color: "var(--muted-foreground)",
            marginTop: "1.25rem",
            opacity: 0.6,
          }}
        >
          Free forever for students. No credit card. No nonsense.
        </p>
      </div>
    </section>
  )
}
