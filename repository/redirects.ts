import { Redirection } from "schema"
import { db } from "config/db"
import { eq, desc } from "drizzle-orm"
import { redirections } from "config/tables"
import { Err, Ok, Result } from "utils/result"
import { NotFoundError } from "utils/error"

/**
 * check if url has a redirection
 */
export const checkUrlRedirection = async (
  path: string
): Promise<Result<Redirection, null>> => {
  const result = await db.query.redirections.findFirst({
    columns: { id: true, from: true, to: true },
    where: eq(redirections.from, path),
    orderBy: [desc(redirections.createdAt)],
  })

  return result ? Ok(result as Redirection) : Ok(null as unknown as Redirection)
}

/**
 * create a url redirection
 */
export const createUrlRedirection = async (
  from: string,
  to: string
): Promise<Result<Redirection, NotFoundError>> => {
  const result = await db
    .insert(redirections)
    .values({ from, to })
    .returning()

  return result ? Ok(result[0] as Redirection) : Err("NOT_FOUND")
}