"use client"

import { useRouter } from "next/navigation"
import { AnimatedCTAButton } from "@/components/landing/animated-cta-button"
import { Badge } from "@/components/ui/badge"
import { motion } from "motion/react"

export function CTASection() {
  const router = useRouter()

  return (
    <section className="relative overflow-hidden px-6 py-24 text-center">
      {/* Decorative horizontal lines */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          top: 0,
          left: "5%",
          right: "5%",
          height: "1px",
          background:
            "linear-gradient(90deg, transparent, var(--border), transparent)",
        }}
      />
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          bottom: 0,
          left: "5%",
          right: "5%",
          height: "1px",
          background:
            "linear-gradient(90deg, transparent, var(--border), transparent)",
        }}
      />

      {/* Radial emerald glow */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse 70% 60% at 50% 50%, oklch(0.72 0.18 162 / 0.08), transparent)",
          pointerEvents: "none",
        }}
      />

      <div
        style={{ position: "relative", maxWidth: "680px", margin: "0 auto" }}
      >
        {/* Badge + H2 */}
        <motion.div
          initial={{ y: -40, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.21, 0.47, 0.32, 0.98] }}
          className="mb-6 flex flex-col items-center justify-center gap-4"
        >
          <Badge variant="outline" className="h-auto px-3 py-1 text-sm">
            Start today
          </Badge>
        </motion.div>

        {/* H2 — same two-font pattern as hero */}
        <h2 className="text-balance text-center text-4xl font-medium leading-tight md:text-5xl lg:text-6xl" style={{ marginBottom: "1.5rem" }}>
          You&apos;re going to forget{" "}
          <span
            className="tracking-tight italic"
            style={{ fontFamily: "'Instrument Serif', serif" }}
          >
            what you learned today.
          </span>
        </h2>

        <p
          style={{
            fontSize: "1.0625rem",
            color: "var(--muted-foreground)",
            lineHeight: 1.65,
            marginBottom: "3rem",
            maxWidth: "38ch",
            margin: "0 auto 3rem",
          }}
        >
          Unless you review it tomorrow.
          <br />
          CodePulse makes sure you do.
        </p>

        {/* CTA button */}
        <AnimatedCTAButton
          label="Start building your memory"
          onClick={() => router.push("/sign-up")}
        />

        <p
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "0.75rem",
            color: "var(--muted-foreground)",
            marginTop: "1.25rem",
            opacity: 0.6,
          }}
        >
          Free forever for students. No credit card. No nonsense.
        </p>
      </div>
    </section>
  )
}
