import { Marquee } from "@/components/animations/marquee"

// The published work each part of CodePulse implements, oldest first.
const papers = [
  { year: 1885, name: "The forgetting curve", author: "Ebbinghaus" },
  { year: 1966, name: "Edit distance", author: "Levenshtein" },
  { year: 1967, name: "k-means clustering", author: "MacQueen" },
  { year: 1975, name: "The vector space model", author: "Salton, Wong & Yang" },
  { year: 1988, name: "TF-IDF term weighting", author: "Salton & Buckley" },
  { year: 1990, name: "SM-2 spaced repetition", author: "Woźniak" },
  {
    year: 1994,
    name: "N-gram text categorization",
    author: "Cavnar & Trenkle",
  },
  {
    year: 1998,
    name: "Maximal marginal relevance",
    author: "Carbonell & Goldstein",
  },
]

export function SocialProofBar() {
  return (
    <section
      aria-labelledby="research-heading"
      className="mx-auto max-w-300 px-6 py-10 md:py-14"
    >
      <h2 id="research-heading" className="mb-5 text-sm text-muted-foreground">
        Implemented from the papers, not from a library
      </h2>
      <Marquee
        pauseOnHover
        className="border-y [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)] px-0 py-4 [--duration:60s] [--gap:3rem]"
      >
        {papers.map((paper) => (
          <p
            key={paper.year}
            className="flex items-baseline gap-2.5 text-sm whitespace-nowrap"
          >
            <span className="font-mono text-xs text-primary tabular-nums">
              {paper.year}
            </span>
            <span className="text-foreground">{paper.name}</span>
            <span className="text-muted-foreground">{paper.author}</span>
          </p>
        ))}
      </Marquee>
    </section>
  )
}
