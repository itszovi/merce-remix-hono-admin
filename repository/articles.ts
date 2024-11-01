import { Article } from "schema"
import { db } from "config/db"
import { eq } from "drizzle-orm"
import { articles } from "config/tables"
import { Err, Ok, Result } from "utils/result"
import { NotFoundError } from "utils/error"

// /**
//  * find author by id
//  */
// export const findArticleById = async (
//   id: Article["id"]
// ): Promise<Result<Article, NotFoundError>> => {
//   const result = await db.query.articles.findFirst({
//     where: eq(articles.id, id),
//     with: {
//       contacts: true,
//     },
//   })

//   return result ? Ok(result as Article) : Err("NOT_FOUND")
// }

/**
 * get articles
 */
export const findArticles = async (): Promise<Result<Article[], NotFoundError>> => {
  const result = await db.query.articles.findMany()

  return result ? Ok(result as Article[]) : Err("NOT_FOUND")
}

/**
 * get article by slug
 */
export const findArticleBySlug = async (slug: Article["slug"]): Promise<Result<Article, NotFoundError>> => {
  const result = await db.query.articles.findFirst({
    where: eq(articles.slug, slug),
  })

  return result ? Ok(result as Article) : Err("NOT_FOUND")
}

/**
 * get article by id
 */
export const findArticleById = async (id: Article["id"]): Promise<Result<Article, NotFoundError>> => {
  const result = await db.query.articles.findFirst({
    where: eq(articles.id, Number(id)),
  })

  return result ? Ok(result as Article) : Err("NOT_FOUND")
}

/**
 * check slug already taken or not
 */
export const checkArticleSlug = async (
  slug: string
): Promise<Result<boolean>> => {
  const result = await db.query.articles.findFirst({
    columns: { id: true },
    where: eq(articles.slug, slug),
  })

  return result ? Ok(true) : Ok(false)
}

export const savePartialArticle = async (
  id: number,
  article: Partial<Omit<Article, "id" | "email">>
): Promise<Result<Article>> => {
  try {
    const result = await db
      .update(articles)
      .set(article)
      .where(eq(articles.id, Number(id)))
      .returning({
        id: articles.id,
        title: articles.title,
        slug: articles.slug,
        content: articles.content,
        path: articles.path,
        publishedAt: articles.publishedAt,
      })

    return Ok(result[0])
  } catch {
    return Err("DATABASE_ERROR", "failed to save article data")
  }
}