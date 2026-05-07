/**
 * Edge case tests — empty states, null fields, zero values, very long inputs.
 * Verifies components handle missing/extreme data without crashing or misleading the user.
 */
import React from "react"
import { render, screen } from "@testing-library/react"
import { ReviewCard } from "@/components/review-card"
import { CodePreview } from "@/components/search-view"
import { StatsCards } from "@/components/stats-cards"
import type { Snippet } from "@/types/snippet"

// ── Shared mocks ──────────────────────────────────────────────────────

vi.mock("@uiw/react-codemirror", () => ({
  default: () => <div data-testid="codemirror" />,
}))

vi.mock("@/hooks/use-editor-prefs", () => ({
  useEditorPrefs: () => ({ prefs: { theme: "dark", font: "mono" }, updatePrefs: vi.fn() }),
}))

vi.mock("@/lib/editor-prefs", () => ({
  getThemeExtension: () => [],
  getFontExtension: () => [],
  cleanGutter: [],
}))

vi.mock("@/lib/languages", () => ({
  getLanguageExtension: () => null,
  LANGUAGES: {},
}))

vi.mock("@/components/ui/button", () => ({
  Button: ({ children, onClick, disabled, ...rest }: React.ButtonHTMLAttributes<HTMLButtonElement> & { children?: React.ReactNode }) => (
    <button onClick={onClick} disabled={disabled} {...rest}>{children}</button>
  ),
}))

vi.mock("@/hooks/use-stats", () => ({
  useStats: vi.fn(),
}))

vi.mock("next/link", () => ({
  default: ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  ),
}))

vi.mock("@hugeicons/react", () => ({ HugeiconsIcon: () => null }))
vi.mock("@hugeicons/core-free-icons", () => ({
  Search01Icon: null, LoaderPinwheelIcon: null,
  ArrowLeft01Icon: null, ArrowRight01Icon: null,
}))

vi.mock("@/components/ui/badge", () => ({
  Badge: ({ children, className }: { children: React.ReactNode; className?: string }) => (
    <span data-testid="badge" className={className}>{children}</span>
  ),
}))

import { useStats } from "@/hooks/use-stats"
const mockUseStats = vi.mocked(useStats)

// ── Helpers ───────────────────────────────────────────────────────────

const baseSnippet: Snippet = {
  id: "test-id",
  user_id: "user-1",
  title: "Test Snippet",
  code: "const x = 1",
  description: "A description",
  language: "typescript",
  tags: ["react"],
  ease_factor: 2.5,
  interval_days: 1,
  repetitions: 0,
  next_review: "2026-06-02",
  created_at: "2026-06-01T00:00:00Z",
  updated_at: "2026-06-01T00:00:00Z",
}

// ── ReviewCard — null / empty fields ─────────────────────────────────

describe("ReviewCard — empty/null fields", () => {
  it("renders title even when code is null", () => {
    render(
      <ReviewCard
        snippet={{ ...baseSnippet, code: null }}
        index={0} total={1} onRate={vi.fn()} submittingRating={null}
      />,
    )
    expect(screen.getByText("Test Snippet")).toBeInTheDocument()
  })

  it("does not show 'Show answer' when code is null", () => {
    render(
      <ReviewCard
        snippet={{ ...baseSnippet, code: null }}
        index={0} total={1} onRate={vi.fn()} submittingRating={null}
      />,
    )
    expect(screen.queryByText("Show answer")).not.toBeInTheDocument()
  })

  it("renders without crashing when description is null", () => {
    render(
      <ReviewCard
        snippet={{ ...baseSnippet, description: null }}
        index={0} total={1} onRate={vi.fn()} submittingRating={null}
      />,
    )
    expect(screen.getByText("Test Snippet")).toBeInTheDocument()
  })

  it("renders without crashing when tags is empty", () => {
    render(
      <ReviewCard
        snippet={{ ...baseSnippet, tags: [] }}
        index={0} total={1} onRate={vi.fn()} submittingRating={null}
      />,
    )
    expect(screen.getByText("Test Snippet")).toBeInTheDocument()
  })

  it("shows 1/1 progress for a single-snippet session", () => {
    render(
      <ReviewCard
        snippet={baseSnippet}
        index={0} total={1} onRate={vi.fn()} submittingRating={null}
      />,
    )
    expect(screen.getByText("1 / 1")).toBeInTheDocument()
  })

  it("renders a very long title without crashing", () => {
    render(
      <ReviewCard
        snippet={{ ...baseSnippet, title: "A".repeat(200) }}
        index={0} total={1} onRate={vi.fn()} submittingRating={null}
      />,
    )
    expect(screen.getByText("A".repeat(200))).toBeInTheDocument()
  })
})

// ── CodePreview — edge cases ──────────────────────────────────────────

describe("CodePreview — edge cases", () => {
  it("renders empty string without crashing", () => {
    const { container } = render(<CodePreview code="" />)
    expect(container.querySelector("pre")).toBeInTheDocument()
  })

  it("does not show truncation marker for exactly 3 lines", () => {
    const { container } = render(<CodePreview code={"a\nb\nc"} />)
    expect(container.querySelector("pre")?.textContent).not.toContain("…")
  })

  it("shows truncation for 4 lines", () => {
    const { container } = render(<CodePreview code={"a\nb\nc\nd"} />)
    expect(container.querySelector("pre")?.textContent).toContain("…")
  })

  it("renders a very long single line without crashing", () => {
    const { container } = render(<CodePreview code={"x".repeat(2000)} />)
    expect(container.querySelector("pre")).toBeInTheDocument()
  })

  it("renders a single line with no truncation marker", () => {
    const { container } = render(<CodePreview code={"const x = 1"} />)
    expect(container.querySelector("pre")?.textContent).not.toContain("…")
  })
})

// ── StatsCards — zero / boundary values ──────────────────────────────

describe("StatsCards — zero and boundary values", () => {
  it("renders all zeros without crashing", () => {
    mockUseStats.mockReturnValue({
      data: { totalSnippets: 0, dueToday: 0, reviewStreak: 0, retentionRate: 0 },
    })
    render(<StatsCards />)
    expect(screen.getByText("0%")).toBeInTheDocument()
    expect(screen.getByText("0d")).toBeInTheDocument()
  })

  it("shows '0 due' with plural label", () => {
    mockUseStats.mockReturnValue({
      data: { totalSnippets: 5, dueToday: 0, reviewStreak: 0, retentionRate: 0 },
    })
    render(<StatsCards />)
    expect(screen.getByText("snippets need review")).toBeInTheDocument()
  })

  it("shows 100% retention without crashing", () => {
    mockUseStats.mockReturnValue({
      data: { totalSnippets: 10, dueToday: 0, reviewStreak: 30, retentionRate: 100 },
    })
    render(<StatsCards />)
    expect(screen.getByText("100%")).toBeInTheDocument()
    expect(screen.getByText("30d")).toBeInTheDocument()
  })

  it("shows skeleton when data is undefined (no snippets yet)", () => {
    mockUseStats.mockReturnValue({ data: undefined })
    render(<StatsCards />)
    expect(screen.queryByText(/in your library/)).not.toBeInTheDocument()
  })

  it("shows large snippet count correctly", () => {
    mockUseStats.mockReturnValue({
      data: { totalSnippets: 999, dueToday: 50, reviewStreak: 0, retentionRate: 0 },
    })
    render(<StatsCards />)
    expect(screen.getByText("999")).toBeInTheDocument()
    expect(screen.getByText("50")).toBeInTheDocument()
  })
})
