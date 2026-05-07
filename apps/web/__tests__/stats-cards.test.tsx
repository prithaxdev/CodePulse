import React from "react"
import { render, screen } from "@testing-library/react"
import { StatsCards } from "@/components/stats-cards"
import type { DashboardStats } from "@/hooks/use-stats"

vi.mock("@/hooks/use-stats", () => ({
  useStats: vi.fn(),
}))

import { useStats } from "@/hooks/use-stats"
const mockUseStats = vi.mocked(useStats)

function renderWithStats(data: DashboardStats | undefined) {
  mockUseStats.mockReturnValue({ data })
  return render(<StatsCards />)
}

// ── Skeleton ──────────────────────────────────────────────────────────

describe("StatsCards — loading state", () => {
  it("renders 4 skeleton cards when data is undefined", () => {
    renderWithStats(undefined)
    // No stat values should be in the DOM
    expect(screen.queryByText(/in your library/)).not.toBeInTheDocument()
  })
})

// ── Stat values ───────────────────────────────────────────────────────

describe("StatsCards — values", () => {
  it("displays total snippet count", () => {
    renderWithStats({ totalSnippets: 42, dueToday: 0, reviewStreak: 0, retentionRate: 0 })
    expect(screen.getByText("42")).toBeInTheDocument()
  })

  it("displays due today count", () => {
    renderWithStats({ totalSnippets: 10, dueToday: 5, reviewStreak: 0, retentionRate: 0 })
    expect(screen.getByText("5")).toBeInTheDocument()
  })

  it("displays retention rate with % suffix", () => {
    renderWithStats({ totalSnippets: 0, dueToday: 0, reviewStreak: 0, retentionRate: 85 })
    expect(screen.getByText("85%")).toBeInTheDocument()
  })

  it("displays review streak with 'd' suffix", () => {
    renderWithStats({ totalSnippets: 0, dueToday: 0, reviewStreak: 7, retentionRate: 0 })
    expect(screen.getByText("7d")).toBeInTheDocument()
  })
})

// ── Sublabel pluralization ────────────────────────────────────────────

describe("StatsCards — sublabel pluralization", () => {
  it("uses singular 'snippet needs review' when dueToday is 1", () => {
    renderWithStats({ totalSnippets: 5, dueToday: 1, reviewStreak: 0, retentionRate: 0 })
    expect(screen.getByText("snippet needs review")).toBeInTheDocument()
  })

  it("uses plural 'snippets need review' when dueToday is not 1", () => {
    renderWithStats({ totalSnippets: 5, dueToday: 3, reviewStreak: 0, retentionRate: 0 })
    expect(screen.getByText("snippets need review")).toBeInTheDocument()
  })

  it("uses 'snippets need review' when dueToday is 0", () => {
    renderWithStats({ totalSnippets: 5, dueToday: 0, reviewStreak: 0, retentionRate: 0 })
    expect(screen.getByText("snippets need review")).toBeInTheDocument()
  })

  it("uses singular 'day in a row' when reviewStreak is 1", () => {
    renderWithStats({ totalSnippets: 5, dueToday: 0, reviewStreak: 1, retentionRate: 0 })
    expect(screen.getByText("day in a row")).toBeInTheDocument()
  })

  it("uses plural 'days in a row' when reviewStreak is not 1", () => {
    renderWithStats({ totalSnippets: 5, dueToday: 0, reviewStreak: 5, retentionRate: 0 })
    expect(screen.getByText("days in a row")).toBeInTheDocument()
  })
})
