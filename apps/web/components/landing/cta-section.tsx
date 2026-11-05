"use client"

import { useRouter } from "next/navigation"
import { AnimatedCTAButton } from "@/components/landing/animated-cta-button"
import { HairlineFigure } from "./hairline-figure"

export function CTASection() {
  const router = useRouter()

  return (
    <section className="mx-auto max-w-300 px-6 pb-24">
      <div className="grid grid-cols-1 items-center gap-10 rounded-2xl border bg-card p-6 sm:p-10 lg:grid-cols-12 lg:gap-14 lg:p-14">
        <div className="flex flex-col items-start gap-6 lg:col-span-7">
          <h2 className="text-4xl leading-tight font-medium tracking-tight text-balance text-foreground md:text-5xl">
            You&apos;re going to forget{" "}
            <span className="text-muted-foreground">
              what you learned today.
            </span>
          </h2>
          <p className="max-w-[38ch] text-[1.0625rem] leading-relaxed text-muted-foreground">
            Unless you review it tomorrow. CodePulse makes sure you do.
          </p>
          <div className="mt-2 flex flex-col items-start gap-3">
            <AnimatedCTAButton
              label="Start building your memory"
              onClick={() => router.push("/sign-up")}
            />
            <p className="text-xs text-muted-foreground">
              Free forever for students. No credit card. No nonsense.
            </p>
          </div>
        </div>

        {/* Phosphor's painted dots fade on their own: forgetting, drawn. */}
        <HairlineFigure
          name="phosphor"
          tag="without review"
          label="A dot matrix whose lit dots fade away, like memory without review"
          className="lg:col-span-5"
        />
      </div>
    </section>
  )
}
