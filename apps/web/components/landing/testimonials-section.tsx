import { TestimonialsMarquee } from "@/components/ui/testimonials-marquee"

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
  {
    initials: "DT",
    name: "Dev T.",
    role: "Full-Stack Dev, Bangalore",
    quote:
      "I've tried Anki for code before. CodePulse is the first tool that makes the review loop feel natural instead of tedious.",
  },
  {
    initials: "NK",
    name: "Nina K.",
    role: "Frontend Engineer, Pokhara",
    quote:
      "The duplicate detection saved me from saving the same useRef pattern three times. Small feature, huge quality-of-life improvement.",
  },
  {
    initials: "SB",
    name: "Sujal B.",
    role: "CS Student, TU",
    quote:
      "My retention rate went from 40% to 78% in six weeks of daily reviews. The data in the dashboard is weirdly motivating.",
  },
]

function TestimonialCard({ initials, name, role, quote }: (typeof testimonials)[0]) {
  return (
    <div
      style={{
        width: "320px",
        flexShrink: 0,
        background: "var(--card)",
        border: "1px solid var(--border)",
        borderRadius: "var(--radius-2xl)",
        padding: "1.5rem",
        display: "flex",
        flexDirection: "column",
        gap: "1rem",
      }}
    >
      <p
        style={{
          fontSize: "0.9rem",
          color: "var(--foreground)",
          lineHeight: 1.65,
          opacity: 0.85,
          flex: 1,
        }}
      >
        &ldquo;{quote}&rdquo;
      </p>
      <div style={{ display: "flex", alignItems: "center", gap: "0.625rem" }}>
        <div
          style={{
            width: "34px",
            height: "34px",
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
              fontSize: "0.6rem",
              color: "var(--primary)",
              fontWeight: 600,
              letterSpacing: "0.04em",
            }}
          >
            {initials}
          </span>
        </div>
        <div>
          <p style={{ fontFamily: "var(--font-mono)", fontSize: "0.75rem", color: "var(--foreground)", fontWeight: 500, marginBottom: "0.1rem" }}>
            {name}
          </p>
          <p style={{ fontFamily: "var(--font-mono)", fontSize: "0.67rem", color: "var(--muted-foreground)" }}>
            {role}
          </p>
        </div>
      </div>
    </div>
  )
}

export function TestimonialsSection() {
  const row1 = testimonials.slice(0, 3)
  const row2 = testimonials.slice(3)

  return (
    <section
      style={{
        padding: "6rem 0",
        overflow: "hidden",
      }}
    >
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 1.5rem", marginBottom: "3rem" }}>
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

      <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        {/* Row 1 — left to right */}
        <TestimonialsMarquee speed={45} pauseOnHover>
          {row1.map((t) => (
            <TestimonialCard key={t.initials} {...t} />
          ))}
        </TestimonialsMarquee>

        {/* Row 2 — right to left */}
        <TestimonialsMarquee speed={38} reverse pauseOnHover>
          {row2.map((t) => (
            <TestimonialCard key={t.initials} {...t} />
          ))}
        </TestimonialsMarquee>
      </div>
    </section>
  )
}
