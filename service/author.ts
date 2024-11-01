import { Author } from "schema"
import { Err, Ok, Result } from "utils/result"
import { findAuthorById } from "repository/authors"
import { findAuthors } from "repository/authors"

export const getAuthor = async (id: number): Promise<Result<Author, Err>> => {
  const result = await findAuthorById(id)

  if (result.error) return Err("NOT_FOUND")

  return Ok(result.value)
}

export const getAuthors = async (): Promise<Result<Author[], Err>> => {
  const result = await findAuthors()

  if (result.error) return Err("NOT_FOUND")

  return Ok(result.value)
}