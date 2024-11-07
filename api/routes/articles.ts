import { Hono } from "hono"
import { getArticles, getArticleBySlug, updateArticle, getArticleVersions } from "service/article"
import { handleResultError } from "api/utils/error"
import z from "zod"
import { zValidator } from "@hono/zod-validator"
import { getArticleBySlugSchema, updateArticleSchema } from "schema/validator/article"

export type ArticleAPI = typeof article

/**
 * Placing the basePath here instead of in index.ts has
 * specific purpose. currently, hc (hono/client) use
 * types generates from hono routes, when our route
 * became bigger and bigger, typescript cannot handle it
 * because it's too deep and too big. so I separate each API
 * endpoint to different file with basePath, also export the
 * type to use directly in hc instead singgle bih API types.
 *
 * @ref `app/rpc/article.ts`
 */
export const article = new Hono()
  .basePath("/api/articles")
  .get("/", async (c) => {
    const articles = await getArticles()

    if (articles.error) return handleResultError(articles.error)

    return c.json(articles.value)
  })
  .get("/:slug",
    async (c) => {
      const slug = c.req.param('slug')
      const articleBySlug = await getArticleBySlug(slug)

      if (articleBySlug.error) return handleResultError(articleBySlug.error)

      return c.json(articleBySlug.value)
    })
  .put("/:slug", zValidator("json", updateArticleSchema), async (c) => {
    const { id } = c.req.valid('json')

    const updated = await updateArticle(id, c.req.valid("json"))

    if (updated.error) return handleResultError(updated.error)

    return c.json(updated.value)
  })
  .get("/:id/versions",
    async (c) => {
      const id = c.req.param('id')
      // const articleById = await getArticleById(Number(id))

      const versions = await getArticleVersions(Number(id))

      if (versions.error) return handleResultError(versions.error)

      return c.json(versions.value)
    })
