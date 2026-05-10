"use client"

import { useRouter } from "next/navigation"
import { motion } from "motion/react"
import { AnimatedCTAButton } from "@/components/landing/animated-cta-button"

export function HeroSection() {
  const router = useRouter()

  return (
    <section className="relative h-full w-full">
      <div className="relative w-full pt-28 pb-6 before:absolute before:top-24 before:-z-10 before:h-full before:w-full before:rounded-full before:bg-linear-to-r before:from-emerald-950/60 before:via-background before:to-amber-950/30 before:blur-3xl md:pt-36 md:pb-10">
        <div className="relative z-10 container mx-auto">

          {/* Headline */}
          <div className="mx-auto flex max-w-5xl flex-col gap-8">
            <motion.h1
              initial={{ opacity: 0, y: 32 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: "easeInOut" }}
              className="text-balance text-center text-5xl leading-14 font-medium md:text-7xl md:leading-20 lg:text-8xl lg:leading-24"
            >
              Stop Googling the{" "}
              <span
                className="tracking-tight italic"
                style={{ fontFamily: "'Instrument Serif', serif" }}
              >
                Same Thing Twice.
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 32 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.1, ease: "easeInOut" }}
              className="text-muted-foreground mx-auto max-w-2xl text-center text-base font-normal"
            >
              Save code snippets as you learn. CodePulse schedules your reviews
              using the SM-2 algorithm so you actually remember them.
            </motion.p>
          </div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2, ease: "easeInOut" }}
            className="my-10 flex items-center justify-center"
          >
            <AnimatedCTAButton
              label="Start free"
              onClick={() => router.push("/sign-up")}
            />
          </motion.div>

        </div>
      </div>
    </section>
  )
}
