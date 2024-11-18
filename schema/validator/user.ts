import z, { ZodType } from "zod"
import type { User } from "schema"
import { redirect } from "@remix-run/server-runtime"

export type UpdateUserSchema = z.output<typeof updateUserSchema>

export const updateUserSchema = z.object({
  email: z.optional(z.string().email("email not valid")),
  full_name: z.optional(
    z.string().trim().min(2, "full name at least 2 characters")
  ),
  user_name: z.optional(
    z
      .string()
      .trim()
      .regex(
        /^[a-zA-Z0-9]{3,16}$/,
        "username only alphanumeric and be between 3 and 16 characters in length"
      )
  ),
}) satisfies ZodType<Partial<Pick<User, "email" | "full_name" | "user_name">>>

export const loginUserSchema = z.object({
  user_name: z.string().min(1, "Enter your username"),
  password: z.string().min(1, "Enter your password"),
  redirectTo: z.optional(
    z.string().trim()
  ),
}) satisfies ZodType<Partial<Pick<User, "user_name">>>