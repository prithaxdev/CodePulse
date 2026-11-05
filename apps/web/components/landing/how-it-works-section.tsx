import { HairlineFigure, type HairlineFigureName } from "./hairline-figure"
import { ForgettingCurve } from "./illustrations/forgetting-curve"

const steps: {
  tag: string
  title: string
  description: string
  figure: HairlineFigureName
  label: string
}[] = [
  {
    tag: "01 · save",
    title: "Save your snippet",
    description:
      "Paste the code and a line on what you learned. The language is detected as you paste.",
    figure: "terminal",
    label: "A terminal window holding saved code, its history in rows",
  },
  {
    tag: "02 · schedule",
    title: "SM-2 schedules your review",
    description:
      "SM-2 picks the day each snippet comes back, and a daily email tells you when reviews are due.",
    figure: "slow",
    label: "Snippets riding a belt through a timed gate, like a review queue",
  },
  {
    tag: "03 · review",
    title: "Rate and retain",
    description:
      "Rate each card Forgot, Hard or Easy. Forgot brings it back tomorrow; Easy pushes it further out each time.",
    figure: "riffle",
    label: "A tray of flashcards; the card under the pointer stands up",
  },
]

export function HowItWorksSection() {
  return (
    <section id="how-it-works" className="mx-auto max-w-300 px-6 py-24">
      <div className="mb-14 grid gap-6 md:grid-cols-2 md:items-end">
        <h2 className="text-3xl font-medium tracking-tight text-balance text-foreground md:text-5xl">
          Save once. Review smart.{" "}
          <span className="text-muted-foreground">Never forget.</span>
        </h2>
        <p className="max-w-[40ch] text-[0.9375rem] leading-relaxed text-muted-foreground md:justify-self-end">
          You do the saving and the rating. Working out when to review is the
          algorithm&apos;s job.
        </p>
      </div>

      <ol className="grid gap-3.5 md:grid-cols-3">
        {steps.map((step) => (
          <li
            key={step.tag}
            className="flex flex-col overflow-hidden rounded-2xl border bg-card"
          >
            <div className="p-5 pb-3">
              <HairlineFigure
                name={step.figure}
                tag={step.tag}
                label={step.label}
              />
            </div>
            <div className="flex flex-1 flex-col gap-2 border-t p-5">
              <h3 className="text-[1.05rem] font-semibold tracking-[-0.01em] text-foreground">
                {step.title}
              </h3>
              <p className="max-w-[38ch] text-sm leading-relaxed text-muted-foreground">
                {step.description}
              </p>
            </div>
          </li>
        ))}
      </ol>

      {/* The science behind step 02 — same surface, same line language. */}
      <div className="hairline mt-3.5 grid overflow-hidden rounded-2xl border bg-card md:grid-cols-3">
        <div className="flex flex-col gap-3 p-6 md:p-7">
          <h3 className="text-xl font-semibold tracking-[-0.01em] text-foreground">
            Most of it is gone by tomorrow.
          </h3>
          <p className="text-sm leading-relaxed text-muted-foreground">
            Ebbinghaus measured it in 1885: without review, memory drops off a
            cliff within a day and settles near a fifth. CodePulse queues a new
            snippet for the day you save it, then brings it back after 4, 6, 16
            and 45 days while you keep rating it Easy. Each review flattens the
            curve.
          </p>
          <p className="mt-auto pt-2 font-mono text-xs text-muted-foreground/70">
            Illustrative decay, real review days. Drag across the chart to read
            any day.
          </p>
        </div>
        <div className="border-t p-6 md:col-span-2 md:border-t-0 md:border-l md:p-7">
          <ForgettingCurve />
        </div>
      </div>
    </section>
  )
}
