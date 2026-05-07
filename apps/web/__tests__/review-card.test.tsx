import React from "react"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { ReviewCard } from "@/components/review-card"
import type { Snippet } from "@/types/snippet"

vi.mock("@uiw/react-codemirror", () => ({
  default: () => <div data-testid="codemirror" />,
}))

vi.mock("@/hooks/use-editor-prefs", () => ({
  useEditorPrefs: () => ({
    prefs: { theme: "dark", font: "mono" },
    updatePrefs: vi.fn(),
  }),
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

const mockSnippet: Partial<Snippet> = {
  id: "abc123",
  user_id: "user-1",
  title: "useCallback Hook",
  code: "const cb = useCallback(() => {}, [])",
  description: "Memoize a function between renders",
  language: "typescript",
  tags: ["react", "hooks"],
  ease_factor: 2.5,
  interval_days: 1,
  repetitions: 0,
  next_review: "2026-05-08",
  created_at: "2026-05-01T00:00:00Z",
  updated_at: "2026-05-01T00:00:00Z",
}

describe("ReviewCard — initial state", () => {
  it("renders the snippet title", () => {
    render(
      <ReviewCard
        snippet={mockSnippet as Snippet}
        index={0}
        total={5}
        onRate={vi.fn()}
        submittingRating={null}
      />,
    )
    expect(screen.getByText("useCallback Hook")).toBeInTheDocument()
  })

  it("shows the 'Show answer' button before reveal", () => {
    render(
      <ReviewCard
        snippet={mockSnippet as Snippet}
        index={0}
        total={5}
        onRate={vi.fn()}
        submittingRating={null}
      />,
    )
    expect(screen.getByText("Show answer")).toBeInTheDocument()
  })

  it("hides rating buttons before reveal", () => {
    render(
      <ReviewCard
        snippet={mockSnippet as Snippet}
        index={0}
        total={5}
        onRate={vi.fn()}
        submittingRating={null}
      />,
    )
    expect(screen.queryByText("Forgot")).not.toBeInTheDocument()
    expect(screen.queryByText("Hard")).not.toBeInTheDocument()
    expect(screen.queryByText("Easy")).not.toBeInTheDocument()
  })

  it("shows progress counter", () => {
    render(
      <ReviewCard
        snippet={mockSnippet as Snippet}
        index={2}
        total={10}
        onRate={vi.fn()}
        submittingRating={null}
      />,
    )
    expect(screen.getByText("3 / 10")).toBeInTheDocument()
  })
})

describe("ReviewCard — after reveal", () => {
  it("shows rating buttons after clicking Show answer", async () => {
    const user = userEvent.setup()
    render(
      <ReviewCard
        snippet={mockSnippet as Snippet}
        index={0}
        total={5}
        onRate={vi.fn()}
        submittingRating={null}
      />,
    )
    await user.click(screen.getByText("Show answer"))
    expect(screen.getByText("Forgot")).toBeInTheDocument()
    expect(screen.getByText("Hard")).toBeInTheDocument()
    expect(screen.getByText("Easy")).toBeInTheDocument()
  })

  it("calls onRate(1) when Forgot is clicked", async () => {
    const user = userEvent.setup()
    const onRate = vi.fn()
    render(
      <ReviewCard
        snippet={mockSnippet as Snippet}
        index={0}
        total={5}
        onRate={onRate}
        submittingRating={null}
      />,
    )
    await user.click(screen.getByText("Show answer"))
    await user.click(screen.getByText("Forgot"))
    expect(onRate).toHaveBeenCalledWith(1)
  })

  it("calls onRate(3) when Hard is clicked", async () => {
    const user = userEvent.setup()
    const onRate = vi.fn()
    render(
      <ReviewCard
        snippet={mockSnippet as Snippet}
        index={0}
        total={5}
        onRate={onRate}
        submittingRating={null}
      />,
    )
    await user.click(screen.getByText("Show answer"))
    await user.click(screen.getByText("Hard"))
    expect(onRate).toHaveBeenCalledWith(3)
  })

  it("calls onRate(5) when Easy is clicked", async () => {
    const user = userEvent.setup()
    const onRate = vi.fn()
    render(
      <ReviewCard
        snippet={mockSnippet as Snippet}
        index={0}
        total={5}
        onRate={onRate}
        submittingRating={null}
      />,
    )
    await user.click(screen.getByText("Show answer"))
    await user.click(screen.getByText("Easy"))
    expect(onRate).toHaveBeenCalledWith(5)
  })
})

describe("ReviewCard — submitting state", () => {
  it("disables all rating buttons while a rating is submitting", async () => {
    const user = userEvent.setup()
    const { rerender } = render(
      <ReviewCard
        snippet={mockSnippet as Snippet}
        index={0}
        total={5}
        onRate={vi.fn()}
        submittingRating={null}
      />,
    )
    await user.click(screen.getByText("Show answer"))

    // Keep revealed state, just change submittingRating
    rerender(
      <ReviewCard
        snippet={mockSnippet as Snippet}
        index={0}
        total={5}
        onRate={vi.fn()}
        submittingRating={3}
      />,
    )

    // All 3 rating buttons should now be disabled
    const allButtons = screen.getAllByRole("button")
    const ratingButtons = allButtons.filter((b) =>
      ["Forgot", "Easy", "Saving…"].some((label) => b.textContent?.includes(label)),
    )
    expect(ratingButtons.length).toBeGreaterThan(0)
    ratingButtons.forEach((btn) => expect(btn).toBeDisabled())
  })
})
