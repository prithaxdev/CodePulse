"use client"

import { useRouter } from "next/navigation"
import { ArrowRightIcon } from "lucide-react"
import { AnimatedCTAButton } from "@/components/landing/animated-cta-button"
import { useScrollNavigation } from "@/hooks/useScrollNavigation"
import { HairlineFigure } from "./hairline-figure"

// The headline renders on first paint: it is the page's largest element, so
// it never waits on an entrance animation. The figure is the motion.
export function HeroSection() {
  const router = useRouter()
  const { scrollTo } = useScrollNavigation()

  return (
    <section className="mx-auto max-w-300 px-6 pt-32 pb-12 md:pt-40 md:pb-16">
      <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-8">
        <div className="flex min-w-0 flex-col items-start gap-7 lg:col-span-7">
          <h1 className="text-5xl leading-[1.05] font-medium tracking-tight text-balance text-foreground md:text-6xl lg:text-7xl">
            Stop Googling the{" "}
            <span className="text-primary">same thing twice.</span>
          </h1>
          <p className="max-w-[46ch] text-base leading-relaxed text-pretty text-muted-foreground md:text-lg">
            Save code snippets as you learn. CodePulse schedules your reviews
            with the SM-2 algorithm, so you actually remember them.
          </p>
          <div className="mt-2 flex flex-wrap items-center gap-x-6 gap-y-4">
            <AnimatedCTAButton
              label="Start free"
              onClick={() => router.push("/sign-up")}
            />
            <a
              href="#how-it-works"
              onClick={(event) => {
                event.preventDefault()
                scrollTo("#how-it-works")
              }}
              className="group inline-flex items-center gap-1.5 py-2 text-sm whitespace-nowrap text-muted-foreground transition-colors duration-150 hover:text-foreground"
            >
              How it works
              <ArrowRightIcon
                size={14}
                aria-hidden="true"
                className="transition-transform duration-150 group-hover:translate-x-0.5"
              />
            </a>
          </div>
        </div>

        <HairlineFigure
          name="riffle"
          surface="page"
          readout={false}
          label="A tray of flashcards. Use the arrow keys to walk through them."
          intensity={0.65}
          className="mx-auto w-full max-w-md lg:col-span-5 lg:max-w-none"
        />
      </div>
    </section>
  )
}
