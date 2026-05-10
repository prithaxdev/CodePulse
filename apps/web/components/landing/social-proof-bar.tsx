"use client"

import { Marquee } from "@/components/animations/marquee"
import { motion } from "motion/react"

const algorithms = [
  "SM-2 Spaced Repetition",
  "TF-IDF Vectorizer",
  "Cosine Similarity",
  "K-Means Clustering",
  "Levenshtein Distance",
  "Extractive Summarization",
  "Knowledge Dependency Graph",
  "MMR Diversity Selection",
]

function AlgorithmBadge({ name }: { name: string }) {
  return (
    <div className="mr-6 lg:mr-12">
      <span className="text-muted-foreground inline-flex items-center gap-2 rounded border border-border px-3 py-1.5 font-mono text-xs">
        <span className="text-primary opacity-50">◈</span>
        {name}
      </span>
    </div>
  )
}

export function SocialProofBar() {
  return (
    <section>
      <div className="py-6 md:py-10">
        <div className="mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.6, ease: "easeInOut" }}
            className="flex flex-col gap-3"
          >
            {/* Centered label with gradient lines */}
            <div className="relative flex justify-center py-3 text-center md:py-4">
              <div className="flex items-center justify-center gap-4">
                <div className="from-muted-foreground dark:from-muted-foreground hidden h-0.5 w-40 bg-linear-to-l to-white opacity-20 md:block dark:to-transparent" />
                <p className="text-muted-foreground px-10 text-center text-sm font-normal sm:px-2">
                  Powered by algorithms built from scratch
                </p>
                <div className="from-muted-foreground dark:from-muted-foreground hidden h-0.5 w-40 bg-linear-to-r to-white opacity-20 md:block dark:to-transparent" />
              </div>
            </div>

            {/* Marquee */}
            <div className="relative overflow-hidden py-4">
              <Marquee pauseOnHover className="p-0 [--duration:20s]">
                {algorithms.map((name, index) => (
                  <AlgorithmBadge key={index} name={name} />
                ))}
              </Marquee>
              <div className="from-background pointer-events-none absolute inset-y-0 left-0 w-1/4 bg-gradient-to-r" />
              <div className="from-background pointer-events-none absolute inset-y-0 right-0 w-1/4 bg-gradient-to-l" />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
