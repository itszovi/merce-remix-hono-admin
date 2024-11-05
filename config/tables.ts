import { createId } from "utils/uid"
import { relations, sql } from "drizzle-orm"
import { text, boolean, pgTable, varchar, timestamp, integer, serial, index, primaryKey } from "drizzle-orm/pg-core"


// model Session {
//   id             String   @id @default(cuid())
//   expirationDate DateTime

//   createdAt DateTime @default(now())
//   updatedAt DateTime @updatedAt

//   user   User   @relation(fields: [userId], references: [id], onDelete: Cascade, onUpdate: Cascade)
//   userId String

//   // non-unique foreign key
//   @@index([userId])
// }

export const sessions = pgTable("session", {
  id: varchar("id", { length: 32 })
    .notNull()
    .primaryKey()
    .$defaultFn(() => createId()),
  expirationDate: timestamp("expiration_date")
    .notNull(),
  userId: varchar("user_id")
    .notNull()
    .references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
})

export const sessionRelations = relations(sessions, ({ one }) => ({
  user: one(users, {
    fields: [sessions.userId],
    references: [users.id],
  }),
}))

/**
 * authentication table schema fro postgresql databases
 * with drizzle
 */
export const auth = pgTable("auth", {
  id: varchar("id", { length: 32 })
    .notNull()
    .primaryKey()
    .$defaultFn(() => createId()),

  provider: text("provider").notNull(),

  provider_id: text("provider_id").notNull(),

  user_id: varchar("user_id", { length: 32 })
    .notNull()
    .references(() => users.id, { onDelete: "no action" }),

  verified: boolean("verified").default(false),

  created_at: timestamp("created_at").defaultNow(),

  updated_at: timestamp("updated_at").defaultNow(),
})

/**
 * relationship between auth and users, many to one
 */
export const auth_relations = relations(auth, ({ one }) => ({
  user: one(users, {
    fields: [auth.user_id],
    references: [users.id],
  }),
}))

/**
 * users table schema for postgresql database with drizzle
 */
export const users = pgTable("users", {
  id: varchar("id", { length: 32 }).unique().notNull().primaryKey(),

  user_name: text("user_name").notNull().unique(),

  full_name: text("full_name").notNull(),

  email: text("email"),

  avatar_url: text("avatar_url"),

  created_at: timestamp("created_at").defaultNow(),

  updated_at: timestamp("updated_at").defaultNow(),
})

export const usersRelations = relations(users, ({ one, many }) => ({
  password: one(passwords),
  sessions: many(sessions),
}))

export const passwords = pgTable("passwords", {
  hash: text("hash")
    .notNull(),
  userId: varchar('user_id').references(() => users.id),
  createdAt: timestamp({ withTimezone: true }),
  updatedAt: timestamp({ withTimezone: true }).defaultNow(),
})

export const passwordsRelations = relations(passwords, ({ one }) => ({
  user: one(users, { fields: [passwords.userId], references: [users.id] }),
}));

export const articles = pgTable("articles", {
  id: serial("id").primaryKey(),
  title: text("title")
    .notNull(),
  slug: text("slug")
    .notNull()
    .unique(),
  path: text("path"),
  content: text("content")
    .notNull(),
  updatedBy: integer('updated_by'),
  createdAt: timestamp({ withTimezone: true, mode: 'string' })
    .notNull().default(sql`now()`),
  updatedAt: timestamp({ withTimezone: true, mode: 'string' }).default(sql`now()`),
  publishedAt: timestamp({ withTimezone: true, mode: 'string' }).default(sql`null`)
});

export const authors = pgTable("authors", {
  id: serial("id").primaryKey(),
  name: text("name")
    .notNull(),
  slug: text("slug")
    .notNull(),
  description: text("description"),
  url: text("url"),
  image: text("image"),
  createdAt: timestamp({ withTimezone: true, mode: 'string' }),
  updatedAt: timestamp({ withTimezone: true, mode: 'string' }).defaultNow(),
});

export const contacts = pgTable("contacts", {
  id: serial("id").primaryKey(),
  label: text("label"),
  url: text("url"),
  authorId: integer("author_id"),
  createdAt: timestamp({ withTimezone: true }),
  updatedAt: timestamp({ withTimezone: true }).defaultNow(),
});

export const articlesRelations = relations(articles, ({ one }) => ({
  author: one(authors, {
    fields: [articles.updatedBy],
    references: [authors.id],
  }),
}));

export const authorsRelations = relations(authors, ({ many }) => ({
  contacts: many(contacts),
  articles: many(articles, { relationName: 'updater' }),
  articleVersions: many(articleVersions, { relationName: 'updater' }),
}));

export const authorsToArticles = pgTable(
  'authors_to_articles',
  {
    authorId: integer('author_id')
      .notNull()
      .references(() => authors.id),
    articleId: integer('article_id')
      .notNull()
      .references(() => articles.id),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.authorId, t.articleId] }),
  }),
);

export const authorsToArticlesRelations = relations(authorsToArticles, ({ one }) => ({
  article: one(articles, {
    fields: [authorsToArticles.articleId],
    references: [articles.id],
  }),
  author: one(authors, {
    fields: [authorsToArticles.authorId],
    references: [authors.id],
  }),
}));

export const contactsRelations = relations(contacts, ({ one }) => ({
  author: one(authors, {
    fields: [contacts.authorId],
    references: [authors.id],
  }),
}));

export const redirections = pgTable("redirections", {
  id: serial("id").primaryKey(),
  from: text("from")
    .notNull()
    .unique(),
  to: text("to")
    .notNull(),
  createdAt: timestamp({ withTimezone: true, mode: 'string' }),
  updatedAt: timestamp({ withTimezone: true, mode: 'string' }),
}, (table) => {
  return {
    fromIdx: index("name_idx").on(table.from),
  };
});

export const articleVersions = pgTable("articles_versions", {
  id: serial("id").primaryKey(),
  title: text("title")
    .notNull(),
  slug: text("slug")
    .notNull()
    .unique(),
  path: text("path"),
  content: text("content")
    .notNull(),
  updatedBy: integer('updated_by'),
  createdAt: timestamp({ withTimezone: true, mode: 'string' })
    .notNull().default(sql`now()`),
  updatedAt: timestamp({ withTimezone: true, mode: 'string' }).default(sql`now()`),
  publishedAt: timestamp({ withTimezone: true, mode: 'string' }).default(sql`null`)
});

export const authorsToArticleVersions = pgTable(
  'authors_to_article_versions',
  {
    authorId: integer('author_id')
      .notNull()
      .references(() => authors.id),
    articleVersionId: integer('article_version_id')
      .notNull()
      .references(() => articleVersions.id),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.authorId, t.articleVersionId] }),
  }),
);

export const authorsToArticleVersionsRelations = relations(authorsToArticleVersions, ({ one }) => ({
  article_version: one(articleVersions, {
    fields: [authorsToArticleVersions.articleVersionId],
    references: [articleVersions.id],
  }),
  author: one(authors, {
    fields: [authorsToArticleVersions.authorId],
    references: [authors.id],
  }),
}));