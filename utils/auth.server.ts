import { createCookieSessionStorage, redirect } from "@remix-run/node";
import env from "config/env";
import bcrypt from 'bcryptjs'

export async function getPasswordHash(password: string) {
	const hash = await bcrypt.hash(password, 10)
	return hash
}

export const SESSION_EXPIRATION_TIME = 1000 * 60 * 60 * 24 * 30

export const getSessionExpirationDate = () =>
  new Date(Date.now() + SESSION_EXPIRATION_TIME)

export const authSessionStorage = createCookieSessionStorage({
  cookie: {
    name: "__session",
    httpOnly: true,
    path: "/",
    sameSite: "lax",
    secrets: [env.SESSION_SECRET],
    secure: process.env.NODE_ENV === "production",
  },
});

// we have to do this because every time you commit the session you overwrite it
// so we store the expiration time in the cookie and reset it every time we commit
const originalCommitSession = authSessionStorage.commitSession

Object.defineProperty(authSessionStorage, 'commitSession', {
  value: async function commitSession(
    ...args: Parameters<typeof originalCommitSession>
  ) {
    const [session, options] = args
    if (options?.expires) {
      session.set('expires', options.expires)
    }
    if (options?.maxAge) {
      session.set('expires', new Date(Date.now() + options.maxAge * 1000))
    }
    const expires = session.has('expires')
      ? new Date(session.get('expires'))
      : undefined
    const setCookieHeader = await originalCommitSession(session, {
      ...options,
      expires,
    })
    return setCookieHeader
  },
})

export function getUserSession(request: Request) {
  return authSessionStorage.getSession(request.headers.get("Cookie"));
}

export const { commitSession, getSession } = authSessionStorage