import { hc } from "hono/client"
import { type AuthorAPI } from "api/routes/author"
// import { type UpdateUserSchema } from "schema/validator/author"

const client = hc<AuthorAPI>(import.meta.env.BASE_URL)

export const getUser = async () => {
  const res = await client.api.authors.$get()

  return res.json()
}

// export const updateUser = async (user: UpdateUserSchema) => {
//   const res = await client.api.user.$post({ json: user })

//   return res.json()
// }
