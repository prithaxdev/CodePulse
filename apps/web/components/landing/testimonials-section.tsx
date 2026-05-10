"use client"

import { Marquee } from "@/components/animations/marquee"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { motion } from "motion/react"

const testimonials = [
  {
    initials: "PS",
    name: "Pritha S.",
    username: "@pritha_dev",
    role: "BCA Student, Kathmandu",
    quote:
      "I used to re-Google the same Tailwind flex trick every week. After 3 weeks of CodePulse reviews, it's just in my head.",
  },
  {
    initials: "RK",
    name: "Rahul K.",
    username: "@rahulk_js",
    role: "Junior Developer, Delhi",
    quote:
      "The SM-2 algorithm is shockingly good. I reviewed a tricky useEffect cleanup once, and I still remember it 6 weeks later without touching it.",
  },
  {
    initials: "AM",
    name: "Aisha M.",
    username: "@aisha_codes",
    role: "CS Final Year, Pune",
    quote:
      "The cluster view is my favorite part. I didn't realize how many React performance patterns I'd saved until they appeared as a group.",
  },
  {
    initials: "DT",
    name: "Dev T.",
    username: "@devtiwari",
    role: "Full-Stack Dev, Bangalore",
    quote:
      "I've tried Anki for code before. CodePulse is the first tool that makes the review loop feel natural instead of tedious.",
  },
  {
    initials: "NK",
    name: "Nina K.",
    username: "@nina_frontend",
    role: "Frontend Engineer, Pokhara",
    quote:
      "The duplicate detection saved me from saving the same useRef pattern three times. Small feature, huge quality-of-life improvement.",
  },
  {
    initials: "SB",
    name: "Sujal B.",
    username: "@sujal_b",
    role: "CS Student, TU",
    quote:
      "My retention rate went from 40% to 78% in six weeks of daily reviews. The data in the dashboard is weirdly motivating.",
  },
]

const firstRow = testimonials.slice(0, Math.ceil(testimonials.length / 2))
const secondRow = testimonials.slice(Math.ceil(testimonials.length / 2))

function TestimonialCard({
  initials,
  name,
  username,
  role,
  quote,
}: (typeof testimonials)[0]) {
  return (
    <Card className="relative h-full w-72 cursor-pointer rounded-2xl border-border bg-card p-4 shadow-none ring-0">
      <CardContent className="flex flex-col gap-3 p-0">
        <div className="flex flex-row items-center gap-2.5">
          <div
            style={{
              width: "34px",
              height: "34px",
              borderRadius: "50%",
              background: "var(--card)",
              border: "1.5px solid var(--primary)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <span
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "0.6rem",
                color: "var(--primary)",
                fontWeight: 600,
                letterSpacing: "0.04em",
              }}
            >
              {initials}
            </span>
          </div>
          <div className="flex flex-col">
            <p className="text-sm font-medium text-foreground">{name}</p>
            <p
              className="text-xs text-muted-foreground"
              style={{ fontFamily: "var(--font-mono)" }}
            >
              {username} · {role}
            </p>
          </div>
        </div>
        <p className="line-clamp-3 text-sm leading-relaxed text-foreground/80">
          &ldquo;{quote}&rdquo;
        </p>
      </CardContent>
    </Card>
  )
}

export function TestimonialsSection() {
  return (
    <section className="overflow-hidden py-24">
      <div className="mx-auto mb-12 max-w-[1200px] px-6">
        <motion.div
          initial={{ y: -40, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.21, 0.47, 0.32, 0.98] }}
          className="flex flex-col items-center justify-center gap-4 text-center"
        >
          <Badge variant="outline" className="h-auto px-3 py-1 text-sm">
            Developers say
          </Badge>
          <h2 className="text-balance text-3xl font-medium text-foreground md:text-5xl">
            What developers say{" "}
            <span
              className="block tracking-tight italic text-primary"
              style={{ fontFamily: "'Instrument Serif', serif" }}
            >
              after using it for a week.
            </span>
          </h2>
        </motion.div>
      </div>

      <div className="relative flex w-full flex-col items-center justify-center gap-4 overflow-hidden">
        <Marquee pauseOnHover className="[--duration:25s]">
          {firstRow.map((t) => (
            <TestimonialCard key={t.initials} {...t} />
          ))}
        </Marquee>
        <Marquee reverse pauseOnHover className="[--duration:22s]">
          {secondRow.map((t) => (
            <TestimonialCard key={t.initials} {...t} />
          ))}
        </Marquee>
        <div className="pointer-events-none absolute inset-y-0 left-0 w-1/4 bg-linear-to-r from-background" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-1/4 bg-linear-to-l from-background" />
      </div>
    </section>
  )
}
