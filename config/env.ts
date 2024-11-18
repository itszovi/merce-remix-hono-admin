import { config } from "dotenv"
import { expand } from "dotenv-expand"
import path from "node:path"
import z from "zod"

expand(
  config({
    path: path.resolve(
      process.cwd(),
      process.env.NODE_ENV === "test" ? ".env.test" : ".env"
    ),
  })
)

const EnvSchema = z.object({
  HOST: z.coerce.string().default("127.0.0.1"),

  PORT: z.coerce.number().default(5174),

  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),

  SECRET: z.string().trim(),

  DATABASE_URL: z.string(),

  DATABASE_DEBUG: z.coerce.boolean().default(false),

  SESSION_SECRET: z.string(),

  GITHUB_CLIENT_ID: z.string(),

  GITHUB_CLIENT_SECRET: z.string(),
})

export type env = z.infer<typeof EnvSchema>

const { data: env, error } = EnvSchema.safeParse(process.env)

if (error) {
  console.error("❌ Invalid env:")
  console.error(JSON.stringify(error.flatten().fieldErrors, null, 2))
  process.exit(1)
}

export default env!
