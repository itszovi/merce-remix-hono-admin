import { hc } from "hono/client"
import type { ArticleAPI } from "api/routes/articles"
import { UpdateArticleSchema } from "schema/validator/article"
import { Err } from "utils/result"

const client = hc<ArticleAPI>(import.meta.env.VITE_BASE_URL)

export const getArticles = async () => {
  const res = await client.api.articles.$get()

  return res.json()
}

export const getArticleBySlug = async (slug: string) => {
  console.log("slug:" + slug)
  const res = await client.api.articles[":slug"].$get({ param: { slug } })


  if (res.status === 500) return Err("SERVER_ERROR")
  return res.json()
}

export const updateArticle = async (article: UpdateArticleSchema) => {
  console.log("updateArticle")
  const res = await client.api.articles[":slug"].$put({
    param: { slug: article.slug! },
    json: { ...article },
  })

  return res.json()
}
