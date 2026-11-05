"use client"

import { useRouter } from "next/navigation"
import { motion } from "motion/react"
import { AnimatedCTAButton } from "@/components/landing/animated-cta-button"

export function HeroSection() {
  const router = useRouter()

  return (
    <section className="relative h-full w-full">
      <div className="relative w-full pt-28 pb-6 md:pt-36 md:pb-10">
        <div className="relative z-10 container mx-auto">
          {/* Headline */}
          <div className="mx-auto flex max-w-5xl flex-col gap-8">
            <motion.h1
              initial={{ opacity: 0, y: 32 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: "easeInOut" }}
              className="text-center text-5xl leading-14 font-medium tracking-tight text-balance md:text-7xl md:leading-20 lg:text-8xl lg:leading-24"
            >
              Stop Googling the{" "}
              <span className="text-primary">same thing twice.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 32 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.1, ease: "easeInOut" }}
              className="mx-auto max-w-2xl text-center text-base font-normal text-muted-foreground"
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
