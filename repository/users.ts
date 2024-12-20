import { Password, User } from "schema"
import { db } from "config/db"
import { eq } from "drizzle-orm"
import { users } from "config/tables"
import { Err, Ok, Result } from "utils/result"
import { DatabaseError, NotFoundError } from "utils/error"
import bcrypt from "bcryptjs"

/**
 * insert or update the users data
 */
export const saveOrUpdateUser = async (
  user: User
): Promise<Result<User, DatabaseError>> => {
  try {
    const saved = { ...user, updated_at: new Date() }

    const result = await db
      .insert(users)
      .values(saved)
      .onConflictDoUpdate({
        set: saved,
        where: eq(users.id, user.id),
        target: [users.id],
      })
      .returning({
        id: users.id,
        full_name: users.full_name,
        user_name: users.user_name,
        created_at: users.created_at,
        updated_at: users.updated_at,
      })

    return Ok(result[0])
  } catch {
    return Err("DATABASE_ERROR", "failed to save user data")
  }
}

export const savePartialUser = async (
  id: string,
  user: Partial<Omit<User, "id" | "email">>
): Promise<Result<User>> => {
  try {
    const result = await db
      .update(users)
      .set(user)
      .where(eq(users.id, id))
      .returning({
        id: users.id,
        full_name: users.full_name,
        user_name: users.user_name,
        created_at: users.created_at,
        updated_at: users.updated_at,
      })

    return Ok(result[0])
  } catch {
    return Err("DATABASE_ERROR", "failed to save user data")
  }
}

/**
 * check username already taken or not
 */
export const checkUserName = async (
  username: string
): Promise<Result<boolean>> => {
  const result = await db.query.users.findFirst({
    columns: { id: true },
    where: eq(users.user_name, username),
  })

  return result ? Ok(true) : Ok(false)
}

/**
 * find user by id
 */
export const findUserById = async (
  id: string
): Promise<Result<User, NotFoundError>> => {
  const result = await db.query.users.findFirst({
    where: eq(users.id, id),
  })

  return result ? Ok(result as User) : Err("NOT_FOUND")
}

export async function verifyUserPassword(
  username: User["user_name"],
  password: Password["hash"]
) {
  const userWithPassword = await db.query.users.findFirst({
    where: eq(users.user_name, username),
    with: { password: true },
  })

  console.log(username)
  console.log(password)

  if (!userWithPassword || !userWithPassword.password) {
    return null
  }

  const isValid = await bcrypt.compare(password, userWithPassword.password.hash)

  if (!isValid) {
    return null
  }

  return { id: userWithPassword.id }
}
