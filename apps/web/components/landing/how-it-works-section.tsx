import { ForgettingCurve } from "./illustrations/forgetting-curve"

const steps = [
  {
    number: "01",
    title: "Save your snippet",
    description: "Paste code and write what you learned. Tags and language are auto-detected.",
    icon: (
      <svg viewBox="0 0 48 48" width="48" height="48" fill="none" aria-hidden="true">
        <rect x="8" y="6" width="32" height="36" rx="4" fill="oklch(0.18 0.016 255)" stroke="oklch(0.72 0.18 162)" strokeWidth="1.2" strokeOpacity="0.5" />
        <line x1="14" y1="16" x2="34" y2="16" stroke="oklch(0.72 0.18 162)" strokeWidth="1.5" strokeOpacity="0.7" strokeLinecap="round" />
        <line x1="14" y1="22" x2="28" y2="22" stroke="oklch(0.56 0.014 255)" strokeWidth="1" strokeOpacity="0.6" strokeLinecap="round" />
        <line x1="14" y1="28" x2="32" y2="28" stroke="oklch(0.56 0.014 255)" strokeWidth="1" strokeOpacity="0.6" strokeLinecap="round" />
        <line x1="14" y1="34" x2="22" y2="34" stroke="oklch(0.78 0.17 68)" strokeWidth="1" strokeOpacity="0.7" strokeLinecap="round" />
        <circle cx="36" cy="36" r="8" fill="oklch(0.72 0.18 162)" />
        <line x1="36" y1="32" x2="36" y2="40" stroke="oklch(0.1 0.012 255)" strokeWidth="2" strokeLinecap="round" />
        <line x1="32" y1="36" x2="40" y2="36" stroke="oklch(0.1 0.012 255)" strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    number: "02",
    title: "SM-2 schedules your review",
    description: "The algorithm calculates exactly when you'll start to forget — and reminds you.",
    icon: (
      <svg viewBox="0 0 48 48" width="48" height="48" fill="none" aria-hidden="true">
        <rect x="8" y="10" width="32" height="30" rx="3" fill="oklch(0.18 0.016 255)" stroke="oklch(0.72 0.18 162)" strokeWidth="1.2" strokeOpacity="0.5" />
        <line x1="8" y1="18" x2="40" y2="18" stroke="oklch(0.72 0.18 162)" strokeWidth="0.8" strokeOpacity="0.3" />
        <line x1="16" y1="8" x2="16" y2="14" stroke="oklch(0.72 0.18 162)" strokeWidth="2" strokeLinecap="round" />
        <line x1="32" y1="8" x2="32" y2="14" stroke="oklch(0.72 0.18 162)" strokeWidth="2" strokeLinecap="round" />
        <rect x="14" y="22" width="7" height="6" rx="1" fill="oklch(0.72 0.18 162)" opacity="0.8" />
        <rect x="25" y="22" width="7" height="6" rx="1" fill="oklch(0.78 0.17 68)" opacity="0.6" />
        <rect x="14" y="30" width="7" height="6" rx="1" fill="oklch(0.56 0.014 255)" opacity="0.4" />
        <rect x="25" y="30" width="7" height="6" rx="1" fill="oklch(0.56 0.014 255)" opacity="0.3" />
      </svg>
    ),
  },
  {
    number: "03",
    title: "Rate and retain",
    description: "Quick flashcard review. Forgot it? Review again sooner. Nailed it? See you in 3 weeks.",
    icon: (
      <svg viewBox="0 0 48 48" width="48" height="48" fill="none" aria-hidden="true">
        <rect x="6" y="10" width="36" height="26" rx="4" fill="oklch(0.18 0.016 255)" stroke="oklch(0.72 0.18 162)" strokeWidth="1.2" strokeOpacity="0.5" />
        <line x1="14" y1="19" x2="34" y2="19" stroke="oklch(0.56 0.014 255)" strokeWidth="1" strokeOpacity="0.5" strokeLinecap="round" />
        <line x1="14" y1="24" x2="28" y2="24" stroke="oklch(0.56 0.014 255)" strokeWidth="1" strokeOpacity="0.4" strokeLinecap="round" />
        <circle cx="24" cy="40" r="4" fill="oklch(0.72 0.18 162)" />
        <polyline points="21,40 23,42 27,38" stroke="oklch(0.1 0.012 255)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      </svg>
    ),
  },
]

export function HowItWorksSection() {
  return (
    <section
      id="how-it-works"
      style={{
        padding: "6rem 1.5rem",
        maxWidth: "1000px",
        margin: "0 auto",
      }}
    >
      {/* Section header */}
      <div style={{ textAlign: "center", marginBottom: "4rem" }}>
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
          How it works
        </p>
        <h2
          style={{
            fontFamily: "var(--font-heading)",
            fontSize: "clamp(2.25rem, 4.5vw, 3.5rem)",
            fontWeight: 700,
            lineHeight: 1.1,
            letterSpacing: "-0.025em",
            color: "var(--foreground)",
          }}
        >
          Save once.{" "}
          <span style={{ color: "var(--primary)" }}>Review smart.</span>
          <br />
          Never forget.
        </h2>
      </div>

      {/* 3 Steps */}
      <div
        className="steps-grid"
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr",
          gap: "0",
          position: "relative",
          marginBottom: "5rem",
        }}
      >
        {/* Connecting dashed line */}
        <div
          aria-hidden="true"
          className="steps-connector"
          style={{
            position: "absolute",
            top: "36px",
            left: "calc(16.66% + 36px)",
            right: "calc(16.66% + 36px)",
            height: "1px",
            background: "none",
            borderTop: "1.5px dashed oklch(0.72 0.18 162 / 0.3)",
            zIndex: 0,
          }}
        />

        {steps.map((step, i) => (
          <div
            key={i}
            className="stagger-children"
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              textAlign: "center",
              padding: "0 1.5rem",
              position: "relative",
              zIndex: 1,
            }}
          >
            {/* Step number + icon */}
            <div style={{ position: "relative", marginBottom: "1.5rem" }}>
              {/* Icon */}
              <div
                style={{
                  width: "72px",
                  height: "72px",
                  borderRadius: "50%",
                  background: "var(--card)",
                  border: "1px solid var(--border)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  position: "relative",
                  zIndex: 1,
                  boxShadow: "0 0 0 4px var(--background)",
                }}
              >
                {step.icon}
              </div>
              {/* Step number badge */}
              <div
                style={{
                  position: "absolute",
                  top: "-6px",
                  right: "-6px",
                  width: "22px",
                  height: "22px",
                  borderRadius: "50%",
                  background: "var(--primary)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  zIndex: 2,
                }}
              >
                <span
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "0.65rem",
                    fontWeight: 600,
                    color: "var(--primary-foreground)",
                  }}
                >
                  {step.number}
                </span>
              </div>
            </div>

            <h3
              style={{
                fontFamily: "var(--font-heading)",
                fontSize: "1.1rem",
                fontWeight: 600,
                color: "var(--foreground)",
                marginBottom: "0.625rem",
                letterSpacing: "-0.01em",
              }}
            >
              {step.title}
            </h3>
            <p
              style={{
                fontSize: "0.875rem",
                color: "var(--muted-foreground)",
                lineHeight: 1.6,
                maxWidth: "22ch",
              }}
            >
              {step.description}
            </p>
          </div>
        ))}
      </div>

      {/* Forgetting Curve illustration */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "1.25rem",
        }}
      >
        <p
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "0.72rem",
            color: "var(--muted-foreground)",
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            opacity: 0.7,
          }}
        >
          The science — Ebbinghaus Forgetting Curve
        </p>
        <div
          style={{
            background: "var(--card)",
            border: "1px solid var(--border)",
            borderRadius: "var(--radius-2xl)",
            padding: "2rem",
            maxWidth: "560px",
            width: "100%",
          }}
        >
          <ForgettingCurve />
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .steps-grid {
            grid-template-columns: 1fr !important;
            gap: 2.5rem !important;
          }
          .steps-connector { display: none; }
        }
      `}</style>
    </section>
  )
}
