import { Author } from "schema"
import { db } from "config/db"
import { eq } from "drizzle-orm"
import { authors } from "config/tables"
import { Err, Ok, Result } from "utils/result"
import { DatabaseError, NotFoundError } from "utils/error"

/**
 * insert or update the users data
 */
// export const saveOrUpdateUser = async (
//   user: User
// ): Promise<Result<User, DatabaseError>> => {
//   try {
//     const saved = { ...user, updated_at: new Date() }

//     const result = await db
//       .insert(users)
//       .values(saved)
//       .onConflictDoUpdate({
//         set: saved,
//         where: eq(users.id, user.id),
//         target: [users.id],
//       })
//       .returning({
//         id: users.id,
//         full_name: users.full_name,
//         user_name: users.user_name,
//         created_at: users.created_at,
//         updated_at: users.updated_at,
//       })

//     return Ok(result[0])
//   } catch {
//     return Err("DATABASE_ERROR", "failed to save user data")
//   }
// }

// export const savePartialUser = async (
//   id: string,
//   user: Partial<Omit<User, "id" | "email">>
// ): Promise<Result<User>> => {
//   try {
//     const result = await db
//       .update(users)
//       .set(user)
//       .where(eq(users.id, id))
//       .returning({
//         id: users.id,
//         full_name: users.full_name,
//         user_name: users.user_name,
//         created_at: users.created_at,
//         updated_at: users.updated_at,
//       })

//     return Ok(result[0])
//   } catch {
//     return Err("DATABASE_ERROR", "failed to save user data")
//   }
// }

/**
 * check username already taken or not
 */
// export const checkUserName = async (
//   username: string
// ): Promise<Result<boolean>> => {
//   const result = await db.query.users.findFirst({
//     columns: { id: true },
//     where: eq(users.user_name, username),
//   })

//   return result ? Ok(true) : Ok(false)
// }

/**
 * find author by id
 */
export const findAuthorById = async (
  id: number
): Promise<Result<Author, NotFoundError>> => {
  const result = await db.query.authors.findFirst({
    where: eq(authors.id, id),
    with: {
      contacts: true,
    },
  })

  return result ? Ok(result as Author) : Err("NOT_FOUND")
}

/**
 * get authors
 */
export const findAuthors = async (): Promise<
  Result<Author[], NotFoundError>
> => {
  const result = await db.query.authors.findMany({
    with: {
      contacts: true,
    },
  })

  return result ? Ok(result as Author[]) : Err("NOT_FOUND")
}
