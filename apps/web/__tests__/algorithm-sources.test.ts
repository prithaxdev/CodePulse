import { describe, expect, it } from "vitest"
import { existsSync, readdirSync, readFileSync } from "node:fs"
import path from "node:path"
import {
  ALLOWED_IMPORTS,
  API_TEST_COUNT,
  algorithmSources,
} from "@/lib/algorithm-sources"

// The landing page claims to show the real algorithm code. These checks keep
// that claim true; they need the API app next to this one, so they skip in a
// web-only checkout.
const apiDir = path.resolve(process.cwd(), "../api")
const algorithmsDir = path.join(apiDir, "app/algorithms")
const hasApi = existsSync(algorithmsDir)

const read = (file: string) =>
  readFileSync(path.join(algorithmsDir, file), "utf8")
const isElision = (line: string) => line.trim() === "" || line.trim() === "# …"

describe.skipIf(!hasApi)("landing algorithm excerpts", () => {
  it.each(algorithmSources.map((s) => [s.file, s] as const))(
    "%s excerpt is copied verbatim from the source",
    (_, source) => {
      const sourceLines = new Set(
        read(source.file)
          .split("\n")
          .map((l) => l.trim())
      )
      const missing = source.code
        .split("\n")
        .filter((line) => !isElision(line))
        .filter((line) => !sourceLines.has(line.trim()))
      expect(missing).toEqual([])
    }
  )

  it.each(algorithmSources.map((s) => [s.file, s] as const))(
    "%s line count matches the file",
    (_, source) => {
      const text = read(source.file)
      const lines = text.endsWith("\n")
        ? text.split("\n").length - 1
        : text.split("\n").length
      expect(lines).toBe(source.lines)
    }
  )

  it("algorithms import nothing outside the standard library", () => {
    const files = readdirSync(algorithmsDir).filter((f) => f.endsWith(".py"))
    const thirdParty = files.flatMap((file) =>
      read(file)
        .split("\n")
        .map((line) => line.match(/^(?:from|import)\s+([\w.]+)/)?.[1])
        .filter((mod): mod is string => mod !== undefined)
        .filter((mod) => !mod.startsWith(".") && !mod.startsWith("app."))
        .filter((mod) => !ALLOWED_IMPORTS.includes(mod.split(".")[0]))
        .map((mod) => `${file}: ${mod}`)
    )
    expect(thirdParty).toEqual([])
  })

  it("the API test count on the page is current", () => {
    const testsDir = path.join(apiDir, "tests")
    const count = readdirSync(testsDir)
      .filter((f) => f.startsWith("test_") && f.endsWith(".py"))
      .reduce(
        (sum, file) =>
          sum +
          (readFileSync(path.join(testsDir, file), "utf8").match(
            /^\s*(?:async\s+)?def test_/gm
          )?.length ?? 0),
        0
      )
    expect(count).toBe(API_TEST_COUNT)
  })
})
