import Link from "next/link"

export function Footer() {
  return (
    <footer
      style={{
        borderTop: "1px solid var(--border)",
        padding: "2rem 1.5rem",
        fontFamily: "var(--font-mono)",
        fontSize: "0.72rem",
        color: "var(--muted-foreground)",
      }}
    >
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
        }}
      >
        {/* Row 1 */}
        <div
          className="footer-row"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "1rem",
            marginBottom: "1rem",
            flexWrap: "wrap",
          }}
        >
          {/* Logo */}
          <Link
            href="/"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.375rem",
              textDecoration: "none",
              color: "var(--muted-foreground)",
            }}
          >
            <span style={{ color: "var(--primary)", fontWeight: 600 }}>{"</>"}</span>
            <span style={{ fontFamily: "var(--font-heading)", fontSize: "0.85rem", color: "var(--foreground)", fontWeight: 500 }}>
              CodePulse
            </span>
          </Link>

          {/* Links */}
          <nav style={{ display: "flex", gap: "1.5rem", flexWrap: "wrap", justifyContent: "center" }}>
            {[
              { label: "About", href: "#" },
              { label: "GitHub", href: "https://github.com" },
              { label: "Privacy", href: "#" },
              { label: "Status", href: "#" },
            ].map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="footer-link"
                style={{
                  color: "var(--muted-foreground)",
                  textDecoration: "none",
                  opacity: 0.7,
                }}
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Theme hint */}
          <span style={{ opacity: 0.4, fontSize: "0.65rem" }}>dark mode only</span>
        </div>

        {/* Row 2 */}
        <div
          className="footer-row"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "1rem",
            flexWrap: "wrap",
            paddingTop: "1rem",
            borderTop: "1px solid var(--border)",
            opacity: 0.5,
          }}
        >
          <span>© 2026 CodePulse · Built by Pritha Shrestha · CACS452 Project</span>
          <span>Made with spaced repetition 🧠</span>
        </div>
      </div>

      <style>{`
        @media (max-width: 640px) {
          .footer-row { justify-content: center !important; text-align: center; }
        }
      `}</style>
    </footer>
  )
}
