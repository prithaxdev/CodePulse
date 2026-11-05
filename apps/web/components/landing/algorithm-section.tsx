import { codeToHtml, type ShikiTransformer } from "shiki"
import { algorithmSources, totalAlgorithmLines } from "@/lib/algorithm-sources"
import { AlgorithmExplorer } from "./algorithm-explorer"

// Tags each line with its indent depth (4 spaces per level) so the editor can
// draw indent guides. Blank lines take the shallower of their neighbours, so
// guides run through them the way an editor draws them.
function indentGuides(code: string): ShikiTransformer {
  const depths = code
    .split("\n")
    .map((line) =>
      line.trim()
        ? Math.floor((line.length - line.trimStart().length) / 4)
        : null
    )
  const filled = depths.map((depth, i) => {
    if (depth !== null) return depth
    const prev = depths.slice(0, i).findLast((d) => d !== null) ?? 0
    const next = depths.slice(i + 1).find((d) => d !== null) ?? 0
    return Math.min(prev, next)
  })
  return {
    line(node, line) {
      const depth = filled[line - 1]
      if (depth > 0) node.properties.style = `--indent:${depth}`
    },
  }
}

// Highlighted on the server with both themes; the page's theme picks the
// colours through the tab panel's classes in algorithm-explorer.tsx.
async function highlight(code: string) {
  const html = await codeToHtml(code, {
    lang: "python",
    themes: { light: "github-light", dark: "github-dark" },
    defaultColor: false,
    transformers: [indentGuides(code)],
  })
  // The tab panel is already the scrollable focus stop; drop Shiki's own.
  return html.replace(' tabindex="0"', "")
}

export async function AlgorithmSection() {
  const sources = await Promise.all(
    algorithmSources.map(async (source) => ({
      ...source,
      html: await highlight(source.code),
    }))
  )

  return (
    <section id="algorithm" className="mx-auto max-w-300 px-6 py-28">
      <AlgorithmExplorer
        sources={sources}
        footnote={`${totalAlgorithmLines.toLocaleString("en")} lines · Python standard library only`}
      >
        <h2 className="text-3xl font-medium tracking-tight text-balance text-foreground md:text-4xl">
          Built from scratch.{" "}
          <span className="text-muted-foreground">No black boxes.</span>
        </h2>
        <p className="max-w-[44ch] text-[0.9375rem] leading-relaxed text-muted-foreground">
          Eight algorithms in plain Python: no scikit-learn, no NLTK, no numpy,
          no pre-trained models. Pick one to read the code that runs it.
        </p>
      </AlgorithmExplorer>
    </section>
  )
}
