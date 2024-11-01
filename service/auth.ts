import { User } from "schema"
import { Err, Ok, Result } from "utils/result"
import { ServiceError } from "utils/error"
import { appendId, createId } from "utils/uid"
import { findByProviderAndId, updateAuthData } from "repository/auth"
import { findUserById, checkUserName, saveOrUpdateUser, verifyUserPassword } from "repository/users"
import { createDBSession, deleteSessions } from "repository/session"
import { authSessionStorage, getUserSession } from "utils/auth.server"
import { redirect } from "@remix-run/node"

const USER_SESSION_KEY = "userId";
interface GithubUser {
  id: number
  login: string
  type: string
  name: string
  avatar_url: string
  bio: string | null
  blog: string | null
  email: string | null
  company: string | null
  location: string | null
}

export const login = async ({
  username,
  password,
}: {
  username: User['user_name']
  password: string
}) => {
  const user = await verifyUserPassword(username, password)
  if (user == null) {
    return null
  }
  const session = await createDBSession(request, user.id)

  return session
}

export const logout = async (request: Request) => {
  const session = await getUserSession(request)


  const cookie = request.headers.get("Cookie");
  // const authSession = await authSessionStorage.getSession(cookie)
  
  // const sessionId = authSession.get(sessionKey)

  // console.log(sessionId)
  // // if this fails, we still need to delete the session from the user's browser
  // // and it doesn't do any harm staying in the db anyway.
  // if (sessionId) {
  //   // the .catch is important because that's what triggers the query.
  //   // learn more about PrismaPromise: https://www.prisma.io/docs/orm/reference/prisma-client-reference#prismapromise-behavior
  //   await deleteSessions(sessionId)
  // }

  return redirect("/", {
    headers: {
      "Set-Cookie": await authSessionStorage.destroySession(session),
    },
  });
}

export const createUserSession = async (request: Request, userId: User['id']) => {
  const session = await getUserSession(request);
  session.set(USER_SESSION_KEY, userId);

  await createDBSession(userId)

  return redirect("/dashboard", {
    headers: {
      "Set-Cookie": await authSessionStorage.commitSession(session, {
        maxAge: 60 * 60 * 24 * 7 // 7 days,
      }),
    },
  });
}

export async function getUserId(
  request: Request
): Promise<User["id"] | undefined> {
  const session = await getUserSession(request);
  const userId = session.get(USER_SESSION_KEY);
  return userId;
}