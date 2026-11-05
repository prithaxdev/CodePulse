"use client"

import Image from "next/image"
import Link from "next/link"
import { useScrollNavigation } from "@/hooks/useScrollNavigation"

const NAV_LINKS = [
  { label: "How it works", href: "#how-it-works" },
  { label: "Features", href: "#features" },
  { label: "Algorithm", href: "#algorithm" },
]

export function Footer() {
  const { scrollTo } = useScrollNavigation()

  function handleNavClick(
    event: React.MouseEvent<HTMLAnchorElement>,
    href: string
  ) {
    event.preventDefault()
    scrollTo(href)
  }

  return (
    <footer className="border-t">
      <div className="mx-auto flex max-w-300 flex-col gap-6 px-6 py-10 text-sm md:flex-row md:items-center md:justify-between">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
          <Link href="/" className="shrink-0">
            <Image
              src="/codepulse-dark.svg"
              alt="CodePulse"
              width={96}
              height={30}
              className="hidden dark:block"
            />
            <Image
              src="/codepulse-light.svg"
              alt="CodePulse"
              width={96}
              height={30}
              className="block dark:hidden"
            />
          </Link>
          <p className="text-muted-foreground">
            Spaced repetition for the code you learn.
          </p>
        </div>

        <nav aria-label="Footer">
          <ul className="flex flex-wrap gap-x-6 gap-y-1">
            {NAV_LINKS.map(({ label, href }) => (
              <li key={href}>
                <a
                  href={href}
                  onClick={(event) => handleNavClick(event, href)}
                  className="inline-block py-2 whitespace-nowrap text-muted-foreground transition-colors duration-150 hover:text-foreground"
                >
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <p className="text-muted-foreground">
          © 2026 CodePulse · Built by Pritha
        </p>
      </div>
    </footer>
  )
}
