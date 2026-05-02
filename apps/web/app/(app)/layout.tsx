"use client"

// Force dynamic rendering — all app pages need auth at request time
export const dynamic = "force-dynamic"

import { useState, useEffect } from "react"
import { useUser } from "@clerk/nextjs"
import { useRouter } from "next/navigation"
import { SidebarNav } from "@/components/sidebar-nav"
import { cn } from "@/lib/utils"

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const { isLoaded, user } = useUser()
  const router = useRouter()

  useEffect(() => {
    if (!isLoaded || !user) return
    if (!user.unsafeMetadata?.onboarded) {
      const accountAgeMs = user.createdAt ? Date.now() - user.createdAt.getTime() : Infinity
      if (accountAgeMs < 30 * 60 * 1000) {
        router.replace("/onboarding")
      }
    }
  }, [isLoaded, user, router])

  return (
    <div className="flex h-dvh overflow-hidden bg-background">
      {/* ── Desktop sidebar ─────────────────────────────────── */}
      <aside className="relative hidden w-56 shrink-0 overflow-y-auto border-r border-border bg-sidebar lg:flex lg:flex-col">
        <SidebarNav />
      </aside>

      {/* ── Mobile overlay ──────────────────────────────────── */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={() => setMobileOpen(false)}
          aria-hidden
        />
      )}

      {/* ── Mobile drawer ───────────────────────────────────── */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-56 border-r border-border bg-sidebar",
          "transition-transform duration-200 ease-out lg:hidden",
          mobileOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <SidebarNav />
      </aside>

      {/* ── Main content ────────────────────────────────────── */}
      <div className="flex flex-1 flex-col min-w-0">
        {/* Mobile top bar */}
        <header className="flex h-12 items-center gap-3 border-b border-border px-4 lg:hidden">
          <button
            onClick={() => setMobileOpen(true)}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-accent hover:text-foreground active:scale-[0.96] transition-[scale,background-color] duration-150"
            aria-label="Open menu"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
              <path d="M2 4h12M2 8h12M2 12h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>
          <span className="font-heading text-sm font-semibold tracking-tight">CodePulse</span>
        </header>

        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  )
}
