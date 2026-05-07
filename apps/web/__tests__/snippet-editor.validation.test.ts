import { titleSchema, codeSchema } from "@/components/snippet-editor"

describe("titleSchema", () => {
  it("rejects an empty title", () => {
    const result = titleSchema.safeParse("")
    expect(result.success).toBe(false)
    expect(result.error?.issues[0].message).toBe("Title is required")
  })

  it("accepts a valid title", () => {
    const result = titleSchema.safeParse("useCallback Hook")
    expect(result.success).toBe(true)
  })

  it("rejects a title over 120 characters", () => {
    const result = titleSchema.safeParse("a".repeat(121))
    expect(result.success).toBe(false)
    expect(result.error?.issues[0].message).toBe("Keep it under 120 characters")
  })

  it("accepts a title of exactly 120 characters", () => {
    const result = titleSchema.safeParse("a".repeat(120))
    expect(result.success).toBe(true)
  })
})

describe("codeSchema", () => {
  it("rejects an empty string", () => {
    const result = codeSchema.safeParse("")
    expect(result.success).toBe(false)
    expect(result.error?.issues[0].message).toBe("Paste your code to save it")
  })

  it("accepts valid code", () => {
    const result = codeSchema.safeParse("const x = useCallback(() => {}, [])")
    expect(result.success).toBe(true)
  })
})
