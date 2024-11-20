import { Hono } from "hono"
import env from "config/env"
import { auth } from "./routes/auth"
import { user } from "./routes/user"
import { author } from "./routes/author"
import { article } from "./routes/articles"
import { logger } from "hono/logger"
import { cors } from "hono/cors"
import { serve } from "@hono/node-server"
import { HTTPException } from "hono/http-exception"
import { remixMiddleware } from "./middleware/remix"
import { serveStatic } from "@hono/node-server/serve-static"
import { checkAuth, isAuthenticated } from "./middleware/auth"

const app = new Hono()

app.use(logger())


app.use("/assets/*", serveStatic({ root: "./build/client" }))

/**
 * Serve public files
 */
app.use("*", serveStatic({ root: "./build/client" })) // 1 hour

/**
 * always check current user from
 * cookies, and pass it to hono
 * context everywhere
 */
app.use(checkAuth())

/**
 * mount all api routes and
 * export type for hono client
 */
app
  .route("/", auth)
  .route("/", user)
  .route("/", author)
  .route("/", article)
  .onError((err, c) => {
    if (err instanceof HTTPException)
      return c.json({ code: err.status, message: err.message }, err.status)

    return c.json({ code: 500, message: "something wrong" }, 500)
  })

/**
 * instead check in every pages/layout, why not define
 * here to validate authenticated user for these routes.
 */
// ! TODO check this how to make it work???
// app.use("/dashboard", isAuthenticated({ redirect: "/" }))

/**
 * remix handler
 */
app.use("*", remixMiddleware())

/**
 * [PRODUCTION ONLY] Serve assets files from build/client/assets
 */
if (env.NODE_ENV === "production") {
  serve({ ...app, port: env.PORT, hostname: env.HOST }, async (info) => {
    // biome-ignore lint/nursery/noConsole: just to info that app is running
    console.log(`🚀 Server started on http://${info.address}:${info.port}`)
  })
}

serve({ ...app, port: env.PORT, hostname: env.HOST }, async (info) => {
  // biome-ignore lint/nursery/noConsole: just to info that app is running
  console.log(`🚀 Server started on http://${info.address}:${info.port}`)
})

/**
 * export as default so we can use
 * vite dev server to run it in development
 */
export default app
