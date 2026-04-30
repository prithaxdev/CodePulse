"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { UserButton } from "@clerk/nextjs"
import { DueBadge } from "@/components/due-badge"
import { cn } from "@/lib/utils"

type NavItem = {
  href: string
  label: string
  icon: React.ReactNode
  badge?: React.ReactNode
}

const navItems: NavItem[] = [
  {
    href: "/dashboard",
    label: "Dashboard",
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
        <rect x="1" y="1" width="6" height="6" rx="1.5" fill="currentColor" opacity="0.9" />
        <rect x="9" y="1" width="6" height="6" rx="1.5" fill="currentColor" opacity="0.5" />
        <rect x="1" y="9" width="6" height="6" rx="1.5" fill="currentColor" opacity="0.5" />
        <rect x="9" y="9" width="6" height="6" rx="1.5" fill="currentColor" opacity="0.9" />
      </svg>
    ),
  },
  {
    href: "/new",
    label: "New Snippet",
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
        <circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.25" />
        <path d="M8 5v6M5 8h6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    href: "/review",
    label: "Review",
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
        <path
          d="M2 8a6 6 0 1 1 12 0A6 6 0 0 1 2 8Z"
          stroke="currentColor"
          strokeWidth="1.25"
        />
        <path d="M8 5.5V8l2 1.5" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    badge: <DueBadge />,
  },
  {
    href: "/search",
    label: "Search",
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
        <circle cx="7" cy="7" r="4.5" stroke="currentColor" strokeWidth="1.25" />
        <path d="M10.5 10.5L13.5 13.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    href: "/settings",
    label: "Settings",
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
        <circle cx="8" cy="8" r="2" fill="currentColor" />
        <path
          d="M8 1.5v1M8 13.5v1M1.5 8h1M13.5 8h1M3.4 3.4l.7.7M11.9 11.9l.7.7M3.4 12.6l.7-.7M11.9 4.1l.7-.7"
          stroke="currentColor"
          strokeWidth="1.25"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
]

export function SidebarNav() {
  const pathname = usePathname()

  return (
    <nav className="flex h-full flex-col px-3 py-4">
      {/* Logo */}
      <Link
        href="/dashboard"
        className="mb-6 flex items-center gap-2.5 px-2 py-1"
      >
        <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/15 ring-1 ring-primary/30">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
            <path
              d="M2 4l5-2.5L12 4v3c0 2.5-2 4.5-5 5.5C4 11.5 2 9.5 2 7V4Z"
              fill="currentColor"
              className="text-primary"
            />
            <path
              d="M5 7l1.5 1.5L9 5.5"
              stroke="white"
              strokeWidth="1.25"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
        <span className="font-heading text-sm font-semibold tracking-tight text-foreground">
          CodePulse
        </span>
      </Link>

      {/* Nav items */}
      <ul className="flex flex-1 flex-col gap-0.5">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/")

          return (
            <li key={item.href}>
              <Link
                href={item.href}
                className={cn(
                  "group flex h-9 items-center gap-2.5 rounded-lg px-2.5 text-sm font-medium",
                  "transition-colors duration-150",
                  "active:scale-[0.97] transition-[scale,background-color] duration-150",
                  isActive
                    ? "bg-primary/12 text-primary"
                    : "text-muted-foreground hover:bg-accent hover:text-foreground",
                )}
              >
                {/* Active indicator line */}
                <span
                  className={cn(
                    "absolute left-0 h-5 w-0.5 rounded-r-full bg-primary transition-all duration-200",
                    isActive ? "opacity-100" : "opacity-0",
                  )}
                  aria-hidden
                />
                <span
                  className={cn(
                    "shrink-0 transition-colors duration-150",
                    isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground",
                  )}
                >
                  {item.icon}
                </span>
                <span className="flex-1 truncate">{item.label}</span>
                {item.badge}
              </Link>
            </li>
          )
        })}
      </ul>

      {/* Bottom — user profile */}
      <div className="flex items-center gap-2.5 px-2 py-1 mt-2 border-t border-border pt-3">
        <UserButton
          appearance={{
            elements: {
              avatarBox: "h-7 w-7",
            },
          }}
        />
        <span className="truncate text-xs text-muted-foreground">Account</span>
      </div>
    </nav>
  )
}
