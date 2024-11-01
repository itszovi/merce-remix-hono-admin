import { getPasswordHash } from "./auth.server"
import { describe, expect, it } from "vitest"

describe("getPasswordHash", () => {
  it("should generate a valid password hash", () => {
    const password = "thisCo0l?_42tEst"
    const hash = getPasswordHash(password)

    expect(hash).toBeDefined()
    expect(hash).toBeTruthy()
  })
})