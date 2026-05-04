"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname, useRouter } from "next/navigation"
import { useUser, useClerk } from "@clerk/nextjs"
import { DueBadge } from "@/components/due-badge"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
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

// ── Sign-out confirmation dialog ─────────────────────────────────────
function SignOutDialog({
  open,
  onOpenChange,
  onConfirm,
  isSigningOut,
}: {
  open: boolean
  onOpenChange: (v: boolean) => void
  onConfirm: () => void
  isSigningOut: boolean
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent showCloseButton={false}>
        <DialogHeader>
          <DialogTitle>Sign out of CodePulse?</DialogTitle>
          <DialogDescription>
            Your snippets and review progress are saved. You can sign back in any time.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <button
            onClick={() => onOpenChange(false)}
            disabled={isSigningOut}
            className="inline-flex h-9 items-center justify-center rounded-lg border border-border bg-transparent px-4 text-sm font-medium text-foreground transition-[background-color,transform] duration-100 hover:bg-accent active:scale-[0.96] disabled:pointer-events-none disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isSigningOut}
            className="inline-flex h-9 items-center justify-center gap-2 rounded-lg bg-destructive px-4 text-sm font-medium text-white transition-[opacity,transform] duration-100 hover:opacity-90 active:scale-[0.96] disabled:pointer-events-none disabled:opacity-60"
          >
            {isSigningOut ? (
              <>
                <svg className="size-3.5 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden>
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2.5" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Signing out…
              </>
            ) : (
              "Sign out"
            )}
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export function SidebarNav() {
  const pathname = usePathname()
  const router = useRouter()
  const { user } = useUser()
  const { signOut } = useClerk()
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [isSigningOut, setIsSigningOut] = useState(false)

  async function handleSignOut() {
    setIsSigningOut(true)
    try {
      await signOut()
      router.push("/")
    } finally {
      setIsSigningOut(false)
      setConfirmOpen(false)
    }
  }

  // Build initials fallback for avatar
  const initials = user
    ? ((user.firstName?.[0] ?? "") + (user.lastName?.[0] ?? "")).toUpperCase() || user.primaryEmailAddress?.emailAddress[0]?.toUpperCase() || "?"
    : "?"
  const displayName = user?.firstName
    ? `${user.firstName}${user.lastName ? " " + user.lastName : ""}`
    : user?.primaryEmailAddress?.emailAddress ?? ""

  return (
    <>
    <SignOutDialog
      open={confirmOpen}
      onOpenChange={setConfirmOpen}
      onConfirm={handleSignOut}
      isSigningOut={isSigningOut}
    />
    <nav className="flex h-full flex-col px-3 py-4">
      {/* Logo */}
      <Link href="/dashboard" className="mb-6 px-2 py-1">
        <Image src="/codepulse-dark.svg" alt="CodePulse" width={108} height={34} className="hidden dark:block" priority />
        <Image src="/codepulse-light.svg" alt="CodePulse" width={108} height={34} className="block dark:hidden" priority />
      </Link>

      {/* Nav items */}
      <ul className="flex flex-1 flex-col gap-0.5">
        {navItems.map((item) => {
          const isActive =
            pathname === item.href ||
            pathname.startsWith(item.href + "/")

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

      {/* Bottom — user + sign out */}
      <div className="mt-2 border-t border-border pt-3">
        <div className="flex items-center gap-2.5 rounded-lg px-2 py-1.5">
          {/* Avatar */}
          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/15 ring-1 ring-primary/20 text-[10px] font-semibold text-primary overflow-hidden">
            {user?.imageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={user.imageUrl} alt="" className="h-full w-full object-cover" />
            ) : (
              initials
            )}
          </div>
          <span className="flex-1 truncate text-xs font-medium text-foreground">
            {displayName}
          </span>
          {/* Sign-out trigger */}
          <button
            onClick={() => setConfirmOpen(true)}
            title="Sign out"
            className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-muted-foreground transition-[color,background-color,transform] duration-100 hover:bg-accent hover:text-foreground active:scale-[0.90]"
            aria-label="Sign out"
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
          </button>
        </div>
      </div>
    </nav>
    </>
  )
}
