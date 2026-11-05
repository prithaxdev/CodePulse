import { API_TEST_COUNT } from "@/lib/algorithm-sources"

// A note from the person who built it, in place of quotes from people who
// don't exist. Every fact beside it can be checked against the repo.
const facts = [
  { label: "Started", value: "16 April 2026" },
  { label: "Built by", value: "One BCA student" },
  { label: "Tests", value: `${API_TEST_COUNT}, run in CI on every push` },
  { label: "Stack", value: "Next.js · FastAPI · Supabase" },
]

export function BuilderNoteSection() {
  return (
    <section
      aria-labelledby="builder-note-heading"
      className="mx-auto max-w-300 px-6 pt-8 pb-28 md:pt-12"
    >
      <h2 id="builder-note-heading" className="sr-only">
        Why CodePulse exists
      </h2>
      <div className="grid gap-12 lg:grid-cols-12">
        <article className="flex flex-col gap-6 lg:col-span-7">
          <p className="text-2xl leading-snug font-medium tracking-tight text-pretty text-foreground md:text-3xl">
            I kept re-Googling the same things: the flex trick for centering a
            div, the cleanup in a useEffect, the git command that undoes the
            last commit. I had learned each one, more than once.
          </p>
          <p className="max-w-[56ch] text-[0.9375rem] leading-relaxed text-muted-foreground">
            So I built the tool I wanted. Save the snippet once, and let the
            schedule bring it back right before it slips. I wrote every
            algorithm behind it from scratch, so I can explain every number it
            shows you.
          </p>
          <p className="text-sm text-foreground">
            Pritha
            <span className="text-muted-foreground">
              {" "}
              · built CodePulse as a final-year project
            </span>
          </p>
        </article>

        <dl className="self-end border-t text-sm lg:col-span-4 lg:col-start-9">
          {facts.map((fact) => (
            <div
              key={fact.label}
              className="flex items-baseline justify-between gap-6 border-b py-3"
            >
              <dt className="text-muted-foreground">{fact.label}</dt>
              <dd className="text-right text-foreground tabular-nums">
                {fact.value}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  )
}
