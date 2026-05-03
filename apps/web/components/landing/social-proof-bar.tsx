import { TestimonialsMarquee } from "@/components/ui/testimonials-marquee"

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
  "React 19",
  "Supabase",
]

function Item({ label }: { label: string }) {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "1.5rem",
        fontFamily: "var(--font-mono)",
        fontSize: "0.72rem",
        color: "var(--muted-foreground)",
        letterSpacing: "0.06em",
        whiteSpace: "nowrap",
        padding: "0 1.25rem",
      }}
    >
      {label}
      <span aria-hidden="true" style={{ color: "var(--border)", opacity: 0.6 }}>·</span>
    </span>
  )
}

export function SocialProofBar() {
  return (
    <div
      style={{
        height: "48px",
        background: "var(--card)",
        borderTop: "1px solid var(--border)",
        borderBottom: "1px solid var(--border)",
        display: "flex",
        alignItems: "center",
        overflow: "hidden",
      }}
    >
      <TestimonialsMarquee speed={35} pauseOnHover={false}>
        {items.map((item) => (
          <Item key={item} label={item} />
        ))}
      </TestimonialsMarquee>
    </div>
  )
}
