"use client"

import { usePathname } from "next/navigation"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { useSnippet } from "@/hooks/use-snippets"
import React from "react"

const LABELS: Record<string, string> = {
  dashboard: "Dashboard",
  new: "New Snippet",
  review: "Review",
  search: "Search",
  activity: "Activity",
  settings: "Settings",
  snippets: "Snippets",
  onboarding: "Onboarding",
}

// Segments that have no corresponding page — shown as plain text, not links
const NON_LINKABLE = new Set(["snippets"])

function SnippetBreadcrumbTitle({ id }: { id: string }) {
  const { data } = useSnippet(id)
  return <>{data?.title ?? "Loading…"}</>
}

export function AppBreadcrumb() {
  const pathname = usePathname()

  const segments = pathname.split("/").filter(Boolean)
  if (segments.length === 0) return null

  const snippetId =
    segments[0] === "snippets" && segments.length === 2 ? segments[1] : null

  const crumbs = segments.map((seg, i) => {
    const isLast = i === segments.length - 1
    const href = "/" + segments.slice(0, i + 1).join("/")
    const isLinkable = !isLast && !NON_LINKABLE.has(seg)

    const label: React.ReactNode =
      snippetId && i === 1
        ? <SnippetBreadcrumbTitle id={snippetId} />
        : (LABELS[seg] ?? seg)

    return { label, href, isLast, isLinkable }
  })

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {crumbs.flatMap((crumb, i) => {
          const items: React.ReactNode[] = [
            <BreadcrumbItem key={crumb.href}>
              {crumb.isLast ? (
                <BreadcrumbPage>{crumb.label}</BreadcrumbPage>
              ) : crumb.isLinkable ? (
                <BreadcrumbLink href={crumb.href}>{crumb.label}</BreadcrumbLink>
              ) : (
                <span className="text-sm text-muted-foreground">{crumb.label}</span>
              )}
            </BreadcrumbItem>,
          ]
          if (!crumb.isLast) {
            items.push(<BreadcrumbSeparator key={`sep-${i}`} />)
          }
          return items
        })}
      </BreadcrumbList>
    </Breadcrumb>
  )
}
