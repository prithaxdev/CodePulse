const testimonials = [
  {
    initials: "PS",
    name: "Pritha S.",
    role: "BCA Student, Kathmandu",
    quote:
      "I used to re-Google the same Tailwind flex trick every week. After 3 weeks of CodePulse reviews, it's just... in my head.",
  },
  {
    initials: "RK",
    name: "Rahul K.",
    role: "Junior Developer, Delhi",
    quote:
      "The SM-2 algorithm is shockingly good. I reviewed a tricky useEffect cleanup once, and I still remember it 6 weeks later without touching it.",
  },
  {
    initials: "AM",
    name: "Aisha M.",
    role: "CS Final Year, Pune",
    quote:
      "The cluster view is my favorite part. I didn't realize how many React performance patterns I'd saved until they appeared as a group.",
  },
]

export function TestimonialsSection() {
  return (
    <section
      style={{
        padding: "6rem 1.5rem",
        maxWidth: "1200px",
        margin: "0 auto",
      }}
    >
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
          Developers say
        </p>
        <h2
          style={{
            fontFamily: "var(--font-heading)",
            fontSize: "clamp(1.75rem, 3.5vw, 2.75rem)",
            fontWeight: 700,
            lineHeight: 1.15,
            letterSpacing: "-0.025em",
            color: "var(--foreground)",
          }}
        >
          What developers say
          <br />
          <span style={{ color: "var(--primary)" }}>after using it for a week.</span>
        </h2>
      </div>

      <div
        className="testimonials-grid"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "1rem",
        }}
      >
        {testimonials.map((t, i) => (
          <div
            key={i}
            className="testimonial-card"
            style={{
              background: "var(--card)",
              border: "1px solid var(--border)",
              borderRadius: "var(--radius-2xl)",
              padding: "1.75rem",
              display: "flex",
              flexDirection: "column",
              gap: "1.25rem",
            }}
          >
            {/* Quote */}
            <p
              style={{
                fontSize: "0.9375rem",
                color: "var(--foreground)",
                lineHeight: 1.65,
                opacity: 0.85,
                flex: 1,
              }}
            >
              &ldquo;{t.quote}&rdquo;
            </p>

            {/* Attribution */}
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
              {/* Initials avatar */}
              <div
                style={{
                  width: "36px",
                  height: "36px",
                  borderRadius: "50%",
                  background: "var(--card)",
                  border: "1.5px solid var(--primary)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <span
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "0.65rem",
                    color: "var(--primary)",
                    fontWeight: 600,
                    letterSpacing: "0.04em",
                  }}
                >
                  {t.initials}
                </span>
              </div>
              <div>
                <p
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "0.78rem",
                    color: "var(--foreground)",
                    fontWeight: 500,
                    marginBottom: "0.1rem",
                  }}
                >
                  {t.name}
                </p>
                <p
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "0.7rem",
                    color: "var(--muted-foreground)",
                  }}
                >
                  {t.role}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <style>{`
        @media (max-width: 768px) {
          .testimonials-grid { grid-template-columns: 1fr !important; }
        }
        @media (min-width: 769px) and (max-width: 960px) {
          .testimonials-grid { grid-template-columns: 1fr 1fr !important; }
        }
      `}</style>
    </section>
  )
}
