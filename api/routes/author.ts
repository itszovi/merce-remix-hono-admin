import { Hono } from "hono"
import { zValidator } from "@hono/zod-validator"
import { getAuthors } from "service/author"
import { HTTPException } from "hono/http-exception"
import { handleResultError } from "api/utils/error"
import { isAuthenticated } from "api/middleware/auth"

export type AuthorAPI = typeof author

/**
 * Placing the basePath here instead of in index.ts has
 * specific purpose. currently, hc (hono/client) use
 * types generates from hono routes, when our route
 * became bigger and bigger, typescript cannot handle it
 * because it's too deep and too big. so I separate each API
 * endpoint to different file with basePath, also export the
 * type to use directly in hc instead singgle bih API types.
 *
 * @ref `app/rpc/author.ts`
 */
export const author = new Hono()
  .basePath("/api/authors")
  .get("/", async (c) => {
    const author = await getAuthors()
    console.log(author)

    if (author.error) return handleResultError(author.error)

    return c.json(author.value)
  })
