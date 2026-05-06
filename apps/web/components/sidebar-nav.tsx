"use client"

import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { useUser, UserButton } from "@clerk/nextjs"
import { HugeiconsIcon } from "@hugeicons/react"
import type { IconSvgElement } from "@hugeicons/react"
import {
  DashboardBrowsingIcon,
  PlusSignCircleIcon,
  Clock01Icon,
  Search01Icon,
  Settings01Icon,
  LeftToRightListBulletIcon,
} from "@hugeicons/core-free-icons"
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip"
import { DueBadge } from "@/components/due-badge"
import { cn } from "@/lib/utils"

type NavItem = {
  href: string
  label: string
  icon: IconSvgElement
  badge?: React.ReactNode
}

const navItems: NavItem[] = [
  {
    href: "/dashboard",
    label: "Dashboard",
    icon: DashboardBrowsingIcon as unknown as IconSvgElement,
  },
  {
    href: "/new",
    label: "New Snippet",
    icon: PlusSignCircleIcon as unknown as IconSvgElement,
  },
  {
    href: "/review",
    label: "Review",
    icon: Clock01Icon as unknown as IconSvgElement,
    badge: <DueBadge />,
  },
  {
    href: "/search",
    label: "Search",
    icon: Search01Icon as unknown as IconSvgElement,
  },
  {
    href: "/activity",
    label: "Activity",
    icon: LeftToRightListBulletIcon as unknown as IconSvgElement,
  },
  {
    href: "/settings",
    label: "Settings",
    icon: Settings01Icon as unknown as IconSvgElement,
  },
]

interface SidebarNavProps {
  isCollapsed?: boolean
  onClose?: () => void
}

export function SidebarNav({ isCollapsed = false, onClose }: SidebarNavProps) {
  const pathname = usePathname()
  const { user } = useUser()

  const displayName = user?.firstName
    ? `${user.firstName}${user.lastName ? " " + user.lastName : ""}`
    : (user?.primaryEmailAddress?.emailAddress ?? "")

  return (
    // pb-3 only — no top padding so the h-12 logo sits flush with the topbar
    <nav className="flex h-full flex-col pb-3">
      {/* ── Logo — h-12 matches topbar, border-b separates from nav ── */}
      <div className="relative h-12 shrink-0">
        {/* Icon: visible when collapsed */}
        <div
          className={cn(
            "absolute inset-0 flex items-center justify-center",
            "transition-opacity duration-200",
            isCollapsed
              ? "pointer-events-auto opacity-100"
              : "pointer-events-none opacity-0"
          )}
        >
          <Link href="/dashboard" onClick={onClose}>
            <Image
              src="/codepulse-icon.svg"
              alt="CodePulse"
              width={28}
              height={28}
              priority
            />
          </Link>
        </div>

        {/* Wordmark: visible when expanded */}
        <div
          className={cn(
            "absolute inset-0 flex items-center px-3.5",
            "transition-opacity duration-200",
            isCollapsed
              ? "pointer-events-none opacity-0"
              : "pointer-events-auto opacity-100"
          )}
        >
          <Link href="/dashboard" onClick={onClose}>
            <Image
              src="/codepulse-dark.svg"
              alt="CodePulse"
              width={100}
              height={32}
              className="hidden dark:block"
              priority
            />
            <Image
              src="/codepulse-light.svg"
              alt="CodePulse"
              width={100}
              height={32}
              className="block dark:hidden"
              priority
            />
          </Link>
        </div>
      </div>

      {/* ── Nav items ── */}
      <ul className="mt-4 flex flex-1 flex-col gap-0.5 px-2">
        {navItems.map((item) => {
          const isActive =
            pathname === item.href || pathname.startsWith(item.href + "/")

          const linkEl = (
            <Link
              href={item.href}
              onClick={onClose}
              className={cn(
                "group relative flex h-9 items-center gap-2.5 rounded-xl text-sm font-medium",
                "transition-[background-color,color,transform] duration-150 active:scale-[0.97]",
                isCollapsed ? "justify-center gap-0 px-0" : "px-2.5",
                isActive
                  ? "bg-primary/12 text-primary"
                  : "text-muted-foreground hover:bg-accent hover:text-foreground"
              )}
            >
              {/* Active indicator — always in DOM, just changes opacity */}
              <span
                className={cn(
                  "absolute -left-2 h-5 w-0.5 rounded-r-full bg-primary",
                  "transition-opacity duration-200",
                  isActive && !isCollapsed ? "opacity-100" : "opacity-0"
                )}
                aria-hidden
              />

              {/* Icon */}
              <span
                className={cn(
                  "shrink-0 transition-colors duration-150",
                  isActive
                    ? "text-primary"
                    : "text-muted-foreground group-hover:text-foreground"
                )}
              >
                <HugeiconsIcon
                  icon={item.icon}
                  size={18}
                  color="currentColor"
                />
              </span>

              {/* Label — always in DOM, fades + collapses with the sidebar */}
              <span
                className={cn(
                  "min-w-0 overflow-hidden whitespace-nowrap",
                  "transition-opacity duration-150",
                  isCollapsed
                    ? "max-w-0 opacity-0"
                    : "flex-1 opacity-100 delay-100"
                )}
              >
                {item.label}
              </span>

              {/* Badge — always in DOM, same fade */}
              {item.badge && (
                <span
                  className={cn(
                    "overflow-hidden transition-opacity duration-150",
                    isCollapsed ? "max-w-0 opacity-0" : "opacity-100 delay-100"
                  )}
                >
                  {item.badge}
                </span>
              )}
            </Link>
          )

          return (
            <li key={item.href}>
              {isCollapsed ? (
                <Tooltip>
                  <TooltipTrigger render={<div />}>{linkEl}</TooltipTrigger>
                  <TooltipContent side="right" sideOffset={12}>
                    <span className="font-medium">{item.label}</span>
                    {item.badge && <span className="ml-1.5">{item.badge}</span>}
                  </TooltipContent>
                </Tooltip>
              ) : (
                linkEl
              )}
            </li>
          )
        })}
      </ul>

      {/* ── Footer: Clerk UserButton ── */}
      <div
        suppressHydrationWarning
        className={cn(
          "mt-2 border-t border-border px-3 pt-3",
          isCollapsed ? "flex justify-center" : "flex items-center gap-2.5"
        )}
      >
        <UserButton
          appearance={{
            elements: { avatarBox: isCollapsed ? "size-8" : "size-7" },
          }}
        />
        <span
          className={cn(
            "overflow-hidden whitespace-nowrap transition-opacity duration-150",
            isCollapsed ? "max-w-0 opacity-0" : "flex-1 opacity-100 delay-100"
          )}
        >
          <span className="block truncate text-xs font-medium text-foreground">
            {displayName}
          </span>
        </span>
      </div>
    </nav>
  )
}
