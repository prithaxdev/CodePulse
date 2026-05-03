"use client"

import { useEffect, useState } from "react"
import Link from "next/link"

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <>
      <nav
        style={{
          position: "sticky",
          top: 0,
          zIndex: 50,
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          background: "oklch(0.1 0.012 255 / 0.85)",
          borderBottom: "1px solid var(--border)",
          boxShadow: scrolled ? "0 1px 0 var(--border)" : "none",
          transition: "box-shadow 0.2s",
        }}
      >
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 1.5rem" }}>
          <div style={{ display: "flex", alignItems: "center", height: "60px", gap: "2rem" }}>
            {/* Logo */}
            <Link href="/" style={{ display: "flex", alignItems: "center", gap: "0.5rem", textDecoration: "none", flexShrink: 0 }}>
              <span
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "1.1rem",
                  color: "var(--primary)",
                  fontWeight: 600,
                  letterSpacing: "-0.02em",
                }}
              >
                {"</>"}
              </span>
              <span
                style={{
                  fontFamily: "var(--font-heading)",
                  fontSize: "1.1rem",
                  fontWeight: 600,
                  color: "var(--foreground)",
                  letterSpacing: "-0.02em",
                }}
              >
                CodePulse
              </span>
            </Link>

            {/* Center nav links — desktop only */}
            <div className="nav-links-desktop" style={{ display: "flex", alignItems: "center", gap: "0.25rem", flex: 1 }}>
              {[
                { label: "How it works", href: "#how-it-works" },
                { label: "Features", href: "#features" },
                { label: "Algorithm", href: "#algorithm" },
                { label: "GitHub", href: "https://github.com" },
              ].map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "0.8rem",
                    color: "var(--muted-foreground)",
                    textDecoration: "none",
                    padding: "0.4rem 0.75rem",
                    borderRadius: "var(--radius)",
                    transition: "color 0.15s, background 0.15s",
                    letterSpacing: "0.01em",
                  }}
                  onMouseEnter={(e) => {
                    ;(e.target as HTMLElement).style.color = "var(--foreground)"
                    ;(e.target as HTMLElement).style.background = "var(--muted)"
                  }}
                  onMouseLeave={(e) => {
                    ;(e.target as HTMLElement).style.color = "var(--muted-foreground)"
                    ;(e.target as HTMLElement).style.background = "transparent"
                  }}
                >
                  {link.label}
                </a>
              ))}
            </div>

            {/* Right — CTA buttons */}
            <div className="nav-cta-desktop" style={{ display: "flex", alignItems: "center", gap: "0.5rem", flexShrink: 0 }}>
              <Link
                href="/sign-in"
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "0.8rem",
                  color: "var(--muted-foreground)",
                  textDecoration: "none",
                  padding: "0.4rem 0.875rem",
                  borderRadius: "var(--radius)",
                  border: "1px solid var(--border)",
                  transition: "color 0.15s, border-color 0.15s",
                }}
                onMouseEnter={(e) => {
                  ;(e.currentTarget as HTMLElement).style.color = "var(--foreground)"
                  ;(e.currentTarget as HTMLElement).style.borderColor = "oklch(1 0 0 / 0.18)"
                }}
                onMouseLeave={(e) => {
                  ;(e.currentTarget as HTMLElement).style.color = "var(--muted-foreground)"
                  ;(e.currentTarget as HTMLElement).style.borderColor = "var(--border)"
                }}
              >
                Sign in
              </Link>
              <Link
                href="/sign-up"
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "0.8rem",
                  fontWeight: 500,
                  color: "var(--primary-foreground)",
                  textDecoration: "none",
                  padding: "0.4rem 0.875rem",
                  borderRadius: "var(--radius)",
                  background: "var(--primary)",
                  transition: "opacity 0.15s, transform 0.15s",
                }}
                onMouseEnter={(e) => {
                  ;(e.currentTarget as HTMLElement).style.opacity = "0.9"
                }}
                onMouseLeave={(e) => {
                  ;(e.currentTarget as HTMLElement).style.opacity = "1"
                }}
                onMouseDown={(e) => {
                  ;(e.currentTarget as HTMLElement).style.transform = "scale(0.96)"
                }}
                onMouseUp={(e) => {
                  ;(e.currentTarget as HTMLElement).style.transform = "scale(1)"
                }}
              >
                Start free
              </Link>

              {/* Mobile hamburger */}
              <button
                className="nav-hamburger"
                onClick={() => setMobileOpen(!mobileOpen)}
                aria-label="Toggle menu"
                style={{
                  display: "none",
                  background: "none",
                  border: "1px solid var(--border)",
                  borderRadius: "var(--radius)",
                  padding: "0.4rem 0.5rem",
                  color: "var(--muted-foreground)",
                  cursor: "pointer",
                  flexDirection: "column",
                  gap: "4px",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "40px",
                  height: "40px",
                }}
              >
                <span style={{ display: "block", width: "16px", height: "1.5px", background: "currentColor", transition: "transform 0.2s, opacity 0.2s", transform: mobileOpen ? "rotate(45deg) translate(4px, 4px)" : "none" }} />
                <span style={{ display: "block", width: "16px", height: "1.5px", background: "currentColor", opacity: mobileOpen ? 0 : 1, transition: "opacity 0.2s" }} />
                <span style={{ display: "block", width: "16px", height: "1.5px", background: "currentColor", transition: "transform 0.2s, opacity 0.2s", transform: mobileOpen ? "rotate(-45deg) translate(4px, -4px)" : "none" }} />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div
          style={{
            position: "fixed",
            top: "60px",
            right: 0,
            bottom: 0,
            width: "280px",
            background: "oklch(0.12 0.013 255)",
            borderLeft: "1px solid var(--border)",
            zIndex: 49,
            padding: "1.5rem",
            display: "flex",
            flexDirection: "column",
            gap: "0.5rem",
          }}
        >
          {[
            { label: "How it works", href: "#how-it-works" },
            { label: "Features", href: "#features" },
            { label: "Algorithm", href: "#algorithm" },
            { label: "GitHub", href: "https://github.com" },
          ].map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "0.9rem",
                color: "var(--muted-foreground)",
                textDecoration: "none",
                padding: "0.75rem 1rem",
                borderRadius: "var(--radius)",
                display: "block",
              }}
            >
              {link.label}
            </a>
          ))}
          <div style={{ marginTop: "auto", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            <Link href="/sign-in" onClick={() => setMobileOpen(false)} style={{ fontFamily: "var(--font-mono)", fontSize: "0.875rem", color: "var(--muted-foreground)", textDecoration: "none", padding: "0.75rem 1rem", border: "1px solid var(--border)", borderRadius: "var(--radius)", textAlign: "center" }}>
              Sign in
            </Link>
            <Link href="/sign-up" onClick={() => setMobileOpen(false)} style={{ fontFamily: "var(--font-mono)", fontSize: "0.875rem", color: "var(--primary-foreground)", textDecoration: "none", padding: "0.75rem 1rem", background: "var(--primary)", borderRadius: "var(--radius)", textAlign: "center", display: "block" }}>
              Start free
            </Link>
          </div>
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .nav-links-desktop { display: none !important; }
          .nav-cta-desktop > a { display: none !important; }
          .nav-hamburger { display: flex !important; }
        }
      `}</style>
    </>
  )
}
