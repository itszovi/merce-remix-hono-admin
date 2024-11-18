import z, { ZodType } from "zod"
import type { Article } from "schema"

export type GetArticleBySlugSchema = z.output<typeof getArticleBySlugSchema>

export const getArticleBySlugSchema = z.object({
  slug: z.string(),
}) satisfies ZodType<Partial<Pick<Article, "slug">>>

export type UpdateArticleSchema = z.output<typeof updateArticleSchema>

export const updateArticleSchema = z.object({
  id: z.number(),
  title: z.string().trim().min(2, "title  at least 2 characters"),
  slug: z.string().trim().min(2, "slug  at least 2 characters"),
  path: z.optional(z.string().trim().min(2, "path  at least 2 characters")),
  lead: z.optional(z.string().trim().min(2, "lead  at least 2 characters")),
  content: z.string().trim().min(2, "content  at least 2 characters"),
  publishedAt: z.optional(
    z.string().trim().min(2, "publish date  at least 2 characters")
  ),
  redirectTo: z.optional(
    z.string().trim().min(2, "redirectTo  at least 2 characters")
  ),
  // content: z.optional(z.string().trim().min(2, "content  at least 2 characters")),
}) satisfies ZodType<Partial<Pick<Article, "title" | "slug" | "content">>>
