"use client"

import { useState, useEffect, useCallback } from "react"
import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import { Menu, X } from "lucide-react"
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
  SheetClose,
} from "@/components/ui/sheet"
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu"
import { cn } from "@/lib/utils"
import { useScrollNavigation } from "@/hooks/useScrollNavigation"
import { useActiveSection } from "@/hooks/useActiveSection"

const NAV_LINKS = [
  { label: "How it works", href: "#how-it-works", id: "how-it-works" },
  { label: "Features", href: "#features", id: "features" },
  { label: "Algorithm", href: "#algorithm", id: "algorithm" },
]

const NavBadge = ({ children }: { children: React.ReactNode }) => (
  <span
    style={{
      display: "inline-flex",
      alignItems: "center",
      fontFamily: "var(--font-mono)",
      fontSize: "0.7rem",
      letterSpacing: "0.02em",
    }}
  >
    {children}
  </span>
)

export function Navbar() {
  const [sticky, setSticky] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const { scrollTo } = useScrollNavigation()
  const sectionIds = NAV_LINKS.map((l) => l.id)
  const activeSection = useActiveSection(sectionIds)

  const handleScroll = useCallback(() => setSticky(window.scrollY >= 50), [])
  const handleResize = useCallback(() => {
    if (window.innerWidth >= 1024) setIsOpen(false)
  }, [])

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true })
    window.addEventListener("resize", handleResize)
    return () => {
      window.removeEventListener("scroll", handleScroll)
      window.removeEventListener("resize", handleResize)
    }
  }, [handleScroll, handleResize])

  const handleLinkClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string
  ) => {
    if (href.startsWith("#")) {
      e.preventDefault()
      scrollTo(href, () => setIsOpen(false))
    }
  }

  return (
    <motion.header
      initial={{ opacity: 0, y: -24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      style={{
        position: "fixed",
        top: 0,
        zIndex: 50,
        display: "flex",
        height: "72px",
        width: "100%",
        alignItems: "center",
        justifyContent: "center",
        padding: "0 1rem",
      }}
    >
      <div
        className={cn(
          "flex w-full max-w-5xl items-center justify-between gap-4 transition-all duration-500",
          sticky
            ? "rounded-full border border-border bg-background/80 px-4 py-2.5 shadow-2xl shadow-black/10 backdrop-blur-xl dark:shadow-black/30"
            : "bg-transparent"
        )}
      >
        {/* Logo */}
        <Link href="/" className="shrink-0">
          <Image
            src="/codepulse-dark.svg"
            alt="CodePulse"
            width={110}
            height={35}
            className="hidden dark:block"
            priority
          />
          <Image
            src="/codepulse-light.svg"
            alt="CodePulse"
            width={110}
            height={35}
            className="block dark:hidden"
            priority
          />
        </Link>

        {/* Desktop nav pills */}
        <NavigationMenu className="hidden rounded-full border border-border bg-muted/40 p-1 lg:flex">
          <NavigationMenuList className="flex gap-0">
            {NAV_LINKS.map((item) => {
              const isActive = activeSection === item.id
              return (
                <NavigationMenuItem key={item.href}>
                  <NavigationMenuLink
                    href={item.href}
                    onClick={(e) =>
                      handleLinkClick(
                        e as React.MouseEvent<HTMLAnchorElement>,
                        item.href
                      )
                    }
                    className={cn(
                      "cursor-pointer rounded-full px-3 py-1.5 transition-all duration-200",
                      isActive
                        ? "bg-muted text-foreground"
                        : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"
                    )}
                  >
                    <NavBadge>{item.label}</NavBadge>
                  </NavigationMenuLink>
                </NavigationMenuItem>
              )
            })}
          </NavigationMenuList>
        </NavigationMenu>

        {/* Desktop CTAs */}
        <div className="hidden shrink-0 items-center gap-2 lg:flex">
          <Link
            href="/sign-in"
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "0.78rem",
              color: "var(--muted-foreground)",
              textDecoration: "none",
              padding: "0.4rem 0.875rem",
              borderRadius: "999px",
              border: "1px solid var(--border)",
              transition: "color 0.15s, border-color 0.15s",
            }}
            className="hover:border-foreground/20! hover:text-foreground!"
          >
            Sign in
          </Link>
          <Link
            href="/sign-up"
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "0.78rem",
              fontWeight: 500,
              color: "var(--primary-foreground)",
              textDecoration: "none",
              padding: "0.4rem 0.875rem",
              borderRadius: "999px",
              background: "var(--primary)",
              transition: "opacity 0.15s, transform 0.15s",
              display: "inline-block",
            }}
            className="active:scale-[0.96]"
          >
            Start free
          </Link>
        </div>

        {/* Mobile menu trigger */}
        <div className="flex items-center gap-2 lg:hidden">
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger
              render={
                <button
                  aria-label="Open menu"
                  style={{
                    borderRadius: "50%",
                    border: "1px solid var(--border)",
                    padding: "0.45rem",
                    background: "none",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    color: "var(--muted-foreground)",
                    width: "40px",
                    height: "40px",
                  }}
                />
              }
            >
              <Menu size={18} />
            </SheetTrigger>

            <SheetContent
              side="right"
              showCloseButton={false}
              style={{
                background: "var(--background)",
                backdropFilter: "blur(16px)",
                WebkitBackdropFilter: "blur(16px)",
                borderLeft: "1px solid var(--border)",
                padding: 0,
                width: "min(320px, 100vw)",
              }}
            >
              <SheetTitle className="sr-only">Navigation menu</SheetTitle>

              {/* Sheet header */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "1.25rem 1.5rem",
                  borderBottom: "1px solid var(--border)",
                }}
              >
                <Link href="/" onClick={() => setIsOpen(false)}>
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
                </Link>
                <SheetClose
                  render={
                    <button
                      aria-label="Close menu"
                      style={{
                        borderRadius: "50%",
                        border: "1px solid var(--border)",
                        padding: "0.45rem",
                        background: "none",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        cursor: "pointer",
                        color: "var(--muted-foreground)",
                        width: "36px",
                        height: "36px",
                      }}
                    />
                  }
                >
                  <X size={16} />
                </SheetClose>
              </div>

              {/* Sheet body */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  padding: "1.5rem",
                  gap: "0.5rem",
                  height: "calc(100% - 73px)",
                }}
              >
                <NavigationMenu
                  orientation="vertical"
                  className="w-full flex-none items-start"
                >
                  <NavigationMenuList className="flex w-full flex-col items-start gap-1">
                    {NAV_LINKS.map((item) => {
                      const isActive = activeSection === item.id
                      return (
                        <NavigationMenuItem key={item.href} className="w-full">
                          <NavigationMenuLink
                            href={item.href}
                            onClick={(e) =>
                              handleLinkClick(
                                e as React.MouseEvent<HTMLAnchorElement>,
                                item.href
                              )
                            }
                            className={cn(
                              "group/nav flex w-full cursor-pointer items-center py-2.5 text-lg font-medium tracking-tight transition-all duration-200",
                              isActive
                                ? "text-foreground"
                                : "text-muted-foreground hover:translate-x-1 hover:text-foreground/80"
                            )}
                            style={{ fontFamily: "var(--font-heading)" }}
                          >
                            <div
                              className={cn(
                                "h-0.5 bg-primary transition-all duration-300",
                                isActive
                                  ? "mr-3 w-4 opacity-100"
                                  : "w-0 opacity-0 group-hover/nav:mr-3 group-hover/nav:w-4 group-hover/nav:opacity-100"
                              )}
                            />
                            {item.label}
                          </NavigationMenuLink>
                        </NavigationMenuItem>
                      )
                    })}
                  </NavigationMenuList>
                </NavigationMenu>

                <div
                  style={{
                    marginTop: "auto",
                    display: "flex",
                    flexDirection: "column",
                    gap: "0.625rem",
                  }}
                >
                  <Link
                    href="/sign-in"
                    onClick={() => setIsOpen(false)}
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: "0.875rem",
                      color: "var(--muted-foreground)",
                      textDecoration: "none",
                      padding: "0.75rem 1rem",
                      border: "1px solid var(--border)",
                      borderRadius: "var(--radius-lg)",
                      textAlign: "center",
                      display: "block",
                    }}
                  >
                    Sign in
                  </Link>
                  <Link
                    href="/sign-up"
                    onClick={() => setIsOpen(false)}
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: "0.875rem",
                      color: "var(--primary-foreground)",
                      textDecoration: "none",
                      padding: "0.75rem 1rem",
                      background: "var(--primary)",
                      borderRadius: "var(--radius-lg)",
                      textAlign: "center",
                      display: "block",
                    }}
                  >
                    Start free
                  </Link>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </motion.header>
  )
}
