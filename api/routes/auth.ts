import { Hono } from "hono"
import { login } from "service/auth"
import { removeAuth } from "api/middleware/auth"

export type AuthAPI = typeof auth

export const auth = new Hono()
  .basePath("/api/auth")
  .get("/logout", async (c) => {
    console.log("hello")
    console.log(c.res.json())
  })
  .post("/login", async (c) => {
    const body = await c.req.json()

    const session = await login({
      username: body.username,
      password: body.password,
    })

    if (!session) return c.json({ message: "Invalid credentials" }, 401)

    return c.json(body)
  })
