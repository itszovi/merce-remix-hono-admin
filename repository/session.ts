import { db } from "config/db"
import { eq } from "drizzle-orm"
import { sessions } from "config/tables"
import { User, Session } from "schema"
import { getSessionExpirationDate } from "utils/auth.server"

export const deleteSessions = async (sessionId: Session["id"]) =>
  await db.delete(sessions).where(eq(sessions.id, sessionId as string))

export const createDBSession = async (userId: User["id"]) => {
  await db
    .insert(sessions)
    .values({
      expirationDate: getSessionExpirationDate(),
      userId,
    })
    .returning({
      id: sessions.id,
      expirationDate: sessions.expirationDate,
      userId: sessions.userId,
    })
  return JSON.stringify({ message: "ok" })
}
