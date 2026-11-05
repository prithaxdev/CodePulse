// The published work each part of CodePulse implements, in order. Read as a
// timeline: one hairline axis, a dot per paper, the file that carries it.
const papers: { year: number; name: string; author: string; file?: string }[] =
  [
    { year: 1885, name: "Forgetting curve", author: "Ebbinghaus" },
    {
      year: 1966,
      name: "Edit distance",
      author: "Levenshtein",
      file: "duplicate.py",
    },
    {
      year: 1967,
      name: "k-means clustering",
      author: "MacQueen",
      file: "clustering.py",
    },
    {
      year: 1975,
      name: "Vector space model",
      author: "Salton, Wong & Yang",
      file: "similarity.py",
    },
    {
      year: 1988,
      name: "TF-IDF weighting",
      author: "Salton & Buckley",
      file: "tfidf.py",
    },
    { year: 1990, name: "SM-2", author: "Woźniak", file: "sm2.py" },
    {
      year: 1994,
      name: "N-gram profiles",
      author: "Cavnar & Trenkle",
      file: "language_detector.py",
    },
    {
      year: 1998,
      name: "Marginal relevance",
      author: "Carbonell & Goldstein",
      file: "summarizer.py",
    },
  ]

export function ResearchTimeline() {
  return (
    <section
      aria-labelledby="research-heading"
      className="mx-auto max-w-300 px-6 py-12 md:py-16"
    >
      <h2 id="research-heading" className="mb-8 text-sm text-muted-foreground">
        Implemented from the papers, not from a library
      </h2>
      <ol className="grid grid-cols-2 gap-y-8 sm:grid-cols-4 lg:grid-cols-8">
        {papers.map((paper) => (
          <li
            key={paper.year}
            className="relative flex min-w-0 flex-col gap-1 border-t pt-5 pr-4 before:absolute before:top-0 before:left-0 before:size-1.75 before:-translate-y-1/2 before:rounded-full before:bg-primary"
          >
            <span className="font-mono text-xs text-primary tabular-nums">
              {paper.year}
            </span>
            <span className="truncate text-sm text-foreground">
              {paper.name}
            </span>
            <span className="text-xs text-muted-foreground">
              {paper.author}
            </span>
            {paper.file && (
              <span className="mt-1 truncate font-mono text-[0.6875rem] text-muted-foreground/70">
                {paper.file}
              </span>
            )}
          </li>
        ))}
      </ol>
    </section>
  )
}
