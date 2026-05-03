"use client"

import Link from "next/link"
import { FluidGradientText } from "@/components/fluid-gradient-text/fluid-gradient-text"
import { useScrollNavigation } from "@/hooks/useScrollNavigation"

const NAV_LINKS = [
  { label: "How it works", href: "#how-it-works" },
  { label: "Features", href: "#features" },
  { label: "Algorithm", href: "#algorithm" },
]

export function Footer() {
  const { scrollTo } = useScrollNavigation()

  const handleNavClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string
  ) => {
    if (href.startsWith("#")) {
      e.preventDefault()
      scrollTo(href)
    }
  }

  return (
    <footer
      style={{
        borderTop: "1px solid var(--border)",
        background: "var(--background)",
      }}
    >
      {/* Top — nav + tagline */}
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "3.5rem 1.5rem 2.5rem",
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          gap: "2rem",
          flexWrap: "wrap",
        }}
      >
        {/* Left — description */}
        <p
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "0.78rem",
            lineHeight: 1.8,
            color: "var(--muted-foreground)",
            maxWidth: "36ch",
          }}
        >
          Stop re-Googling the same solutions.
          <br />
          Save snippets as you learn — CodePulse schedules
          <br />
          reviews so you actually remember them.
        </p>

        {/* Right — nav links */}
        <div
          style={{ display: "flex", flexDirection: "column", gap: "0.875rem" }}
        >
          <p
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "0.68rem",
              fontWeight: 600,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: "var(--foreground)",
              marginBottom: "0.125rem",
            }}
          >
            Product
          </p>
          {NAV_LINKS.map(({ label, href }) => (
            <a
              key={href}
              href={href}
              onClick={(e) => handleNavClick(e, href)}
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "0.78rem",
                color: "var(--muted-foreground)",
                textDecoration: "none",
                transition: "color 0.15s",
                cursor: "pointer",
              }}
              className="hover:text-foreground!"
            >
              {label}
            </a>
          ))}
        </div>
      </div>

      {/* Fluid gradient "CodePulse" — full width */}
      <div
        style={{
          height: "120px",
          overflow: "hidden",
          color: "var(--foreground)",
        }}
      >
        <FluidGradientText
          text="CodePulse"
          svgViewBoxWidth={1200}
          svgViewBoxHeight={280}
        />
      </div>

      {/* Bottom bar */}
      <div
        style={{
          borderTop: "1px solid var(--border)",
          padding: "1.25rem 1.5rem",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <p
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "0.7rem",
            color: "var(--muted-foreground)",
            opacity: 0.5,
          }}
        >
          © 2026 CodePulse · Built by Pritha
        </p>
      </div>
    </footer>
  )
}
