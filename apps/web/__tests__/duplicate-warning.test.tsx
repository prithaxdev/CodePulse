import React from "react"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { DuplicateWarning } from "@/components/duplicate-warning"
import type { DuplicateMatch } from "@/types/api"

vi.mock("next/link", () => ({
  default: ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  ),
}))

const makeMatch = (overrides: Partial<DuplicateMatch> = {}): DuplicateMatch => ({
  id: "snip-001",
  similarity: 0.92,
  ...overrides,
})

describe("DuplicateWarning", () => {
  it("shows the similarity percentage for the top match", () => {
    render(<DuplicateWarning matches={[makeMatch({ similarity: 0.92 })]} onDismiss={vi.fn()} />)
    expect(screen.getByText(/92% match/)).toBeInTheDocument()
  })

  it("links to the existing snippet detail page", () => {
    render(<DuplicateWarning matches={[makeMatch({ id: "abc-123" })]} onDismiss={vi.fn()} />)
    const link = screen.getByRole("link", { name: /view existing snippet/i })
    expect(link).toHaveAttribute("href", "/snippets/abc-123")
  })

  it("shows 'and N more' when there are multiple matches", () => {
    render(
      <DuplicateWarning
        matches={[makeMatch(), makeMatch({ id: "snip-002" }), makeMatch({ id: "snip-003" })]}
        onDismiss={vi.fn()}
      />,
    )
    expect(screen.getByText(/and 2 more/)).toBeInTheDocument()
  })

  it("does not show 'and N more' for a single match", () => {
    render(<DuplicateWarning matches={[makeMatch()]} onDismiss={vi.fn()} />)
    expect(screen.queryByText(/and \d more/)).not.toBeInTheDocument()
  })

  it("calls onDismiss when the dismiss button is clicked", async () => {
    const user = userEvent.setup()
    const onDismiss = vi.fn()
    render(<DuplicateWarning matches={[makeMatch()]} onDismiss={onDismiss} />)
    await user.click(screen.getByRole("button", { name: /dismiss warning/i }))
    expect(onDismiss).toHaveBeenCalledOnce()
  })

  it("rounds similarity to a whole percentage", () => {
    render(<DuplicateWarning matches={[makeMatch({ similarity: 0.876 })]} onDismiss={vi.fn()} />)
    expect(screen.getByText(/88% match/)).toBeInTheDocument()
  })
})
