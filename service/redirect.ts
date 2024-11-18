import { Result } from "hono/router"
import { checkUrlRedirection } from "repository/redirects"
import { Article, Redirection } from "schema"
import { Err, Ok } from "utils/result"

export const getRedirectionsForPath = async (path: string) => {
  const result = await checkUrlRedirection(path)

  if (result.error) return Err("NOT_FOUND")

  return result.value ? Ok(result.value) : null
}
