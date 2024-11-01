import * as table from "config/tables"

/**
 * to make it easier, we create User type
 * from drizzle schema. instead creating new
 * User type.
 */

/**
 * session
 */
export type Session = typeof table.sessions.$inferInsert

/**
 * user
 */
export type User = typeof table.users.$inferInsert

/**
 * password
 */
export type Password = typeof table.passwords.$inferInsert

/**
 * authentication for each user
 */
export type Auth = typeof table.auth.$inferInsert & {
  provider: "github" | "google"
}

/**
 * author
 */
export type Author = typeof table.authors.$inferInsert

/**
 * article
 */
export type Article = typeof table.articles.$inferInsert

/**
 * redirection
 */
export type Redirection = typeof table.redirections.$inferInsert