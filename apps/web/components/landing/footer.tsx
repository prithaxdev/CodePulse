import Link from "next/link"
import { Separator } from "@/components/ui/separator"
import { HugeiconsIcon } from "@hugeicons/react"
import { GithubIcon, NewTwitterIcon, LinkedinIcon } from "@hugeicons/core-free-icons"

type FooterSection = {
  title: string
  links: { title: string; href: string }[]
}

const footerSections: FooterSection[] = [
  {
    title: "Product",
    links: [
      { title: "How it works", href: "#how-it-works" },
      { title: "Features", href: "#features" },
      { title: "Algorithm", href: "#algorithm" },
      { title: "Pricing", href: "#" },
    ],
  },
  {
    title: "Resources",
    links: [
      { title: "GitHub", href: "https://github.com/prithaxdev/CodePulse" },
      { title: "Documentation", href: "#" },
      { title: "Privacy Policy", href: "#" },
      { title: "Terms of Service", href: "#" },
    ],
  },
]

export function Footer() {
  return (
    <footer className="py-10">
      <div className="mx-auto max-w-6xl px-4 lg:px-8">
        <div className="flex flex-col gap-10">
          <div className="grid grid-cols-2 gap-x-8 gap-y-10 md:grid-cols-12">
            {/* Brand column */}
            <div className="col-span-full md:col-span-5">
              <div className="flex flex-col gap-5">
                <Link
                  href="/"
                  style={{
                    fontFamily: "var(--font-heading)",
                    fontSize: "1.15rem",
                    fontWeight: 700,
                    color: "var(--foreground)",
                    textDecoration: "none",
                    letterSpacing: "-0.02em",
                  }}
                >
                  CodePulse
                </Link>
                <p
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "0.8rem",
                    lineHeight: 1.7,
                    color: "var(--muted-foreground)",
                    maxWidth: "32ch",
                  }}
                >
                  Stop re-Googling the same solutions. Save snippets as you learn — CodePulse schedules reviews so you actually remember them.
                </p>
                <div className="flex items-center gap-4">
                  <a
                    href="https://github.com/prithaxdev/CodePulse"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: "var(--muted-foreground)" }}
                    className="hover:text-foreground transition-colors"
                    aria-label="GitHub"
                  >
                    <HugeiconsIcon icon={GithubIcon} size={18} strokeWidth={1.5} />
                  </a>
                  <a
                    href="https://twitter.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: "var(--muted-foreground)" }}
                    className="hover:text-foreground transition-colors"
                    aria-label="X (Twitter)"
                  >
                    <HugeiconsIcon icon={NewTwitterIcon} size={18} strokeWidth={1.5} />
                  </a>
                  <a
                    href="https://linkedin.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: "var(--muted-foreground)" }}
                    className="hover:text-foreground transition-colors"
                    aria-label="LinkedIn"
                  >
                    <HugeiconsIcon icon={LinkedinIcon} size={18} strokeWidth={1.5} />
                  </a>
                </div>
              </div>
            </div>

            {/* Spacer */}
            <div className="hidden md:block md:col-span-1" />

            {/* Link columns */}
            {footerSections.map(({ title, links }) => (
              <div key={title} className="col-span-1 md:col-span-3">
                <div className="flex flex-col gap-4">
                  <p
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: "0.72rem",
                      fontWeight: 600,
                      letterSpacing: "0.1em",
                      textTransform: "uppercase",
                      color: "var(--foreground)",
                    }}
                  >
                    {title}
                  </p>
                  <ul className="flex flex-col gap-3">
                    {links.map(({ title: label, href }) => (
                      <li key={label}>
                        <a
                          href={href}
                          style={{
                            fontFamily: "var(--font-mono)",
                            fontSize: "0.78rem",
                            color: "var(--muted-foreground)",
                            textDecoration: "none",
                          }}
                          className="hover:text-foreground transition-colors"
                        >
                          {label}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}

            {/* Contact column */}
            <div className="col-span-1 md:col-span-3">
              <div className="flex flex-col gap-4">
                <p
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "0.72rem",
                    fontWeight: 600,
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    color: "var(--foreground)",
                  }}
                >
                  Contact
                </p>
                <ul className="flex flex-col gap-3">
                  <li>
                    <p
                      style={{
                        fontFamily: "var(--font-mono)",
                        fontSize: "0.78rem",
                        color: "var(--muted-foreground)",
                      }}
                    >
                      Kathmandu, Nepal
                    </p>
                  </li>
                  <li>
                    <a
                      href="mailto:prithakarki030@gmail.com"
                      style={{
                        fontFamily: "var(--font-mono)",
                        fontSize: "0.78rem",
                        color: "var(--muted-foreground)",
                        textDecoration: "none",
                      }}
                      className="hover:text-foreground transition-colors"
                    >
                      prithakarki030@gmail.com
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <Separator orientation="horizontal" />

          <p
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "0.72rem",
              color: "var(--muted-foreground)",
              textAlign: "center",
              opacity: 0.6,
            }}
          >
            © 2026 CodePulse · Built by Pritha Shrestha · CACS452 Project
          </p>
        </div>
      </div>
    </footer>
  )
}
