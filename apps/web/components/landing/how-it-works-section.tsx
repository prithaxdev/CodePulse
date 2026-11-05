"use client"

import { motion } from "motion/react"
import { Badge } from "@/components/ui/badge"
import { HairlineFigure, type HairlineFigureName } from "./hairline-figure"
import { ForgettingCurve } from "./illustrations/forgetting-curve"

const EASE = [0.21, 0.47, 0.32, 0.98] as const

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
      "Paste code and write what you learned. Tags and language are auto-detected.",
    figure: "terminal",
    label: "A terminal window holding saved code, its history in rows",
  },
  {
    tag: "02 · schedule",
    title: "SM-2 schedules your review",
    description:
      "The algorithm calculates exactly when you'll start to forget — and reminds you.",
    figure: "slow",
    label: "Snippets riding a belt through a timed gate, like a review queue",
  },
  {
    tag: "03 · review",
    title: "Rate and retain",
    description:
      "Quick flashcard review. Forgot it? Review again sooner. Nailed it? See you in 3 weeks.",
    figure: "riffle",
    label: "A tray of flashcards; the card under the pointer stands up",
  },
]

export function HowItWorksSection() {
  return (
    <section id="how-it-works" className="mx-auto max-w-300 px-6 py-24">
      <motion.div
        initial={{ y: -40, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: EASE }}
        className="mx-auto mb-16 flex max-w-xl flex-col items-center justify-center gap-4 text-center"
      >
        <Badge variant="outline" className="h-auto px-3 py-1 text-sm">
          How it works
        </Badge>
        <h2 className="text-3xl font-medium text-balance text-foreground md:text-5xl">
          Save once.{" "}
          <span
            className="tracking-tight text-primary italic"
            style={{ fontFamily: "'Instrument Serif', serif" }}
          >
            Review smart.
          </span>{" "}
          Never forget.
        </h2>
      </motion.div>

      <ol className="grid gap-3.5 md:grid-cols-3">
        {steps.map((step, i) => (
          <motion.li
            key={step.tag}
            initial={{ y: 16, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, delay: i * 0.1, ease: EASE }}
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
          </motion.li>
        ))}
      </ol>

      {/* The science behind step 02 — same surface, same line language. */}
      <motion.div
        initial={{ y: 16, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.6, ease: EASE }}
        className="hairline mt-3.5 grid overflow-hidden rounded-2xl border bg-card md:grid-cols-3"
      >
        <div className="flex flex-col gap-3 p-6 md:p-7">
          <p className="font-mono text-[0.6875rem] tracking-[0.1em] text-muted-foreground uppercase">
            The science
          </p>
          <h3 className="text-xl font-semibold tracking-[-0.01em] text-foreground">
            Most of it is gone by tomorrow.
          </h3>
          <p className="text-sm leading-relaxed text-muted-foreground">
            Ebbinghaus measured it in 1885: without review, memory drops off a
            cliff within a day and settles near a fifth. SM-2 reviews you after
            1 day, then 6, then about 2.5× longer each time, and every review
            flattens the curve.
          </p>
          <p className="mt-auto pt-2 font-mono text-xs text-muted-foreground/70">
            Drag across the chart to read any day.
          </p>
        </div>
        <div className="border-t p-6 md:col-span-2 md:border-t-0 md:border-l md:p-7">
          <ForgettingCurve />
        </div>
      </motion.div>
    </section>
  )
}
