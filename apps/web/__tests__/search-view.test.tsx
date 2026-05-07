import React from "react"
import { render, screen } from "@testing-library/react"
import { formatDate, ScoreBadge, CodePreview } from "@/components/search-view"

// ── Module-level mocks to silence imports not under test ──────────────

vi.mock("next/link", () => ({
  default: ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  ),
}))

vi.mock("@hugeicons/react", () => ({ HugeiconsIcon: () => null }))
vi.mock("@hugeicons/core-free-icons", () => ({
  Search01Icon: null,
  LoaderPinwheelIcon: null,
  ArrowLeft01Icon: null,
  ArrowRight01Icon: null,
}))

vi.mock("@/components/ui/input", () => ({
  Input: (props: React.InputHTMLAttributes<HTMLInputElement>) => <input {...props} />,
}))

vi.mock("@/components/ui/badge", () => ({
  Badge: ({
    children,
    className,
  }: {
    children: React.ReactNode
    className?: string
  }) => (
    <span data-testid="badge" className={className}>
      {children}
    </span>
  ),
}))

vi.mock("@/components/ui/button", () => ({
  Button: ({
    children,
    ...props
  }: React.ButtonHTMLAttributes<HTMLButtonElement> & { children?: React.ReactNode }) => (
    <button {...props}>{children}</button>
  ),
}))

vi.mock("@/hooks/use-snippets", () => ({
  useSnippets: () => ({ data: [], isLoading: false }),
}))

vi.mock("@/hooks/use-search", () => ({
  useSearch: () => ({ data: [], isFetching: false }),
}))

// ── formatDate ────────────────────────────────────────────────────────

describe("formatDate", () => {
  it("returns 'today' for the current timestamp", () => {
    expect(formatDate(new Date().toISOString())).toBe("today")
  })

  it("returns 'yesterday' for 1 day ago", () => {
    const d = new Date()
    d.setDate(d.getDate() - 1)
    expect(formatDate(d.toISOString())).toBe("yesterday")
  })

  it("returns 'N days ago' for 2-6 days ago", () => {
    const d = new Date()
    d.setDate(d.getDate() - 3)
    expect(formatDate(d.toISOString())).toBe("3 days ago")
  })

  it("returns 'Nw ago' for 7-29 days ago", () => {
    const d = new Date()
    d.setDate(d.getDate() - 10)
    expect(formatDate(d.toISOString())).toBe("1w ago")
  })

  it("returns month/day for 30+ days ago", () => {
    const d = new Date()
    d.setDate(d.getDate() - 35)
    expect(formatDate(d.toISOString())).toMatch(/^[A-Z][a-z]{2} \d{1,2}$/)
  })
})

// ── ScoreBadge ────────────────────────────────────────────────────────

describe("ScoreBadge", () => {
  it("displays the score as a percentage", () => {
    render(<ScoreBadge score={0.75} />)
    expect(screen.getByTestId("badge")).toHaveTextContent("75%")
  })

  it("rounds to the nearest integer", () => {
    render(<ScoreBadge score={0.456} />)
    expect(screen.getByTestId("badge")).toHaveTextContent("46%")
  })

  it("applies primary color for scores >= 70%", () => {
    render(<ScoreBadge score={0.70} />)
    expect(screen.getByTestId("badge").className).toContain("text-primary")
  })

  it("applies pulse color for scores 40-69%", () => {
    render(<ScoreBadge score={0.55} />)
    expect(screen.getByTestId("badge").className).toContain("text-pulse")
  })

  it("applies muted color for scores below 40%", () => {
    render(<ScoreBadge score={0.20} />)
    expect(screen.getByTestId("badge").className).toContain("text-muted-foreground")
  })
})

// ── CodePreview ───────────────────────────────────────────────────────

describe("CodePreview", () => {
  it("renders all lines when 3 or fewer", () => {
    const { container } = render(<CodePreview code={"line1\nline2\nline3"} />)
    expect(container.querySelector("pre")?.textContent).not.toContain("…")
  })

  it("truncates and appends '…' when code has more than 3 lines", () => {
    const { container } = render(
      <CodePreview code={"line1\nline2\nline3\nline4"} />,
    )
    expect(container.querySelector("pre")?.textContent).toContain("…")
  })

  it("shows only the first 3 lines of truncated code", () => {
    const { container } = render(
      <CodePreview code={"a\nb\nc\nd\ne"} />,
    )
    const text = container.querySelector("code")?.textContent ?? ""
    expect(text).toContain("a")
    expect(text).toContain("b")
    expect(text).toContain("c")
    expect(text).not.toMatch(/\bd\b/)
  })
})
