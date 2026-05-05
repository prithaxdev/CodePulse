"use client"

// Force dynamic rendering — all app pages need auth at request time
export const dynamic = "force-dynamic"

import { useState, useEffect } from "react"
import { useUser } from "@clerk/nextjs"
import { useRouter } from "next/navigation"
import { SidebarNav } from "@/components/sidebar-nav"
import { SidebarToggleIcon } from "@/components/unlumen-ui/sidebar-toggle-icon"
import { AppBreadcrumb } from "@/components/app-breadcrumb"
import { ThemeSwitcher } from "@/components/theme-switcher/theme-switcher"
import { cn } from "@/lib/utils"
import Image from "next/image"

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const { isLoaded, user } = useUser()
  const router = useRouter()

  useEffect(() => {
    if (!isLoaded || !user) return
    if (!user.unsafeMetadata?.onboarded) {
      const accountAgeMs = user.createdAt
        ? Date.now() - user.createdAt.getTime()
        : Infinity
      if (accountAgeMs < 30 * 60 * 1000) {
        router.replace("/onboarding")
      }
    }
  }, [isLoaded, user, router])

  return (
    // Outer background is sidebar color so the sidebar blends in without any border
    <div className="flex h-dvh gap-2 bg-sidebar p-2">
      {/* ── Desktop sidebar — borderless, blends into outer bg ── */}
      <aside
        className={cn(
          "relative hidden shrink-0 overflow-hidden bg-sidebar",
          "transition-[width] duration-300 ease-in-out",
          "lg:flex lg:flex-col",
          sidebarCollapsed ? "w-14" : "w-56"
        )}
      >
        <SidebarNav isCollapsed={sidebarCollapsed} />
      </aside>

      {/* ── Mobile overlay — always in DOM so opacity can animate ── */}
      <div
        className={cn(
          "fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden",
          "transition-opacity duration-300 ease-in-out",
          mobileOpen
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0"
        )}
        onClick={() => setMobileOpen(false)}
        aria-hidden
      />

      {/* ── Mobile drawer ───────────────────────────────────── */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-56 bg-sidebar",
          "transition-transform duration-300 ease-in-out lg:hidden",
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <SidebarNav onClose={() => setMobileOpen(false)} />
      </aside>

      {/* ── Main content — floating rounded card ────────────── */}
      <div className="flex min-w-0 flex-1 flex-col overflow-hidden rounded-2xl border border-border bg-background">
        {/* Desktop topbar */}
        <header className="hidden h-12 shrink-0 items-center gap-2 border-b border-border px-3 lg:flex">
          <button
            onClick={() => setSidebarCollapsed((p) => !p)}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-muted-foreground transition-[background-color,color,transform] duration-150 hover:bg-accent hover:text-foreground active:scale-[0.96]"
            aria-label={
              sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"
            }
          >
            <SidebarToggleIcon
              isOpen={!sidebarCollapsed}
              strokeWidth={1.5}
              className="size-4.5"
            />
          </button>
          <div className="h-4 w-px bg-border" />
          <div className="flex-1">
            <AppBreadcrumb />
          </div>
          <ThemeSwitcher />
        </header>

        {/* Mobile topbar */}
        <header className="flex h-12 shrink-0 items-center gap-3 border-b border-border px-4 lg:hidden">
          <button
            onClick={() => setMobileOpen((p) => !p)}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-[background-color,color,transform] duration-150 hover:bg-accent hover:text-foreground active:scale-[0.96]"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
          >
            <SidebarToggleIcon
              isOpen={mobileOpen}
              strokeWidth={1.5}
              className="size-4.5"
            />
          </button>
          <Image
            src="/codepulse-dark.svg"
            alt="CodePulse"
            width={100}
            height={32}
            className="hidden dark:block"
          />
          <Image
            src="/codepulse-light.svg"
            alt="CodePulse"
            width={100}
            height={32}
            className="block dark:hidden"
          />
          <div className="flex-1" />
          <ThemeSwitcher />
        </header>

        <main className="flex-1 overflow-auto">{children}</main>
      </div>
    </div>
  )
}
