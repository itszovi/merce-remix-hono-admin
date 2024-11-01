import { Article } from "schema"
import { Err, Ok, Result } from "utils/result"
import { UpdateArticleSchema } from "schema/validator/article"
import { findArticles, findArticleBySlug, findArticleById, checkArticleSlug, savePartialArticle } from "repository/articles"
import { createUrlRedirection } from "repository/redirects"
import { formatArticlePublishDateToPath, formatArticleSlugAndDateToPath } from "utils/article"

export const getArticles = async (): Promise<Result<Article[], Err>> => {
  console.log('find articles')
  const result = await findArticles()

  if (result.error) return Err("NOT_FOUND")

  return Ok(result.value)
}

export const getArticleBySlug = async (slug: Article["slug"]): Promise<Result<Article, Err>> => {
  const result = await findArticleBySlug(slug)

  if (result.error) return Err("NOT_FOUND")

  return Ok(result.value)
}

export const getArticleById = async (id: Article["id"]): Promise<Result<Article, Err>> => {
  const result = await findArticleById(id)

  if (result.error) return Err("NOT_FOUND")

  return Ok(result.value)
}

export const updateArticle = async (
  id: number,
  article: UpdateArticleSchema
) => {
  let articleToSave = article
  let isRedirectionCreated = false

  const alreadyExistingArticle = await findArticleById(Number(id))

  if (!alreadyExistingArticle.value) return Err("NOT_FOUND", "no article to update")

  if (articleToSave.publishedAt && alreadyExistingArticle.value.path && articleToSave.slug && articleToSave.slug !== alreadyExistingArticle.value.slug) {
    const datePath = formatArticlePublishDateToPath(articleToSave.publishedAt)
    const newPath = formatArticleSlugAndDateToPath(articleToSave.slug, datePath)
    await createUrlRedirection(alreadyExistingArticle.value.path, newPath)

    articleToSave.path = newPath
    isRedirectionCreated = true
  }
  const saved = await savePartialArticle(id, {
    ...article,
    // ! TODO fix the date stuff, maybe just switch to strings...
    publishedAt: articleToSave.publishedAt ? new Date(articleToSave.publishedAt) : null,
  })

  if (saved.error) return Err("SERVICE_ERROR", "failed to save user data")

  return Ok({ redirectTo: isRedirectionCreated ? `/articles/${article.slug}/edit` : false, article: saved.value })
}
