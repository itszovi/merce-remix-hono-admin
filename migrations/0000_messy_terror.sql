CREATE TABLE IF NOT EXISTS "articles_versions" (
	"article_id" integer NOT NULL,
	"slug" text NOT NULL,
	"id" serial PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"path" text,
	"lead" text,
	"content" text NOT NULL,
	"is_in_trash" boolean DEFAULT false,
	"updated_by" integer,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	"updatedAt" timestamp with time zone DEFAULT now(),
	"publishedAt" timestamp with time zone DEFAULT null
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "articles" (
	"slug" text NOT NULL,
	"id" serial PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"path" text,
	"lead" text,
	"content" text NOT NULL,
	"is_in_trash" boolean DEFAULT false,
	"updated_by" integer,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	"updatedAt" timestamp with time zone DEFAULT now(),
	"publishedAt" timestamp with time zone DEFAULT null,
	CONSTRAINT "articles_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "auth" (
	"id" varchar(32) PRIMARY KEY NOT NULL,
	"provider" text NOT NULL,
	"provider_id" text NOT NULL,
	"user_id" varchar(32) NOT NULL,
	"verified" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "authors" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"slug" text NOT NULL,
	"description" text,
	"url" text,
	"image" text,
	"createdAt" timestamp with time zone,
	"updatedAt" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "authors_to_article_versions" (
	"author_id" integer NOT NULL,
	"article_version_id" integer NOT NULL,
	CONSTRAINT "authors_to_article_versions_author_id_article_version_id_pk" PRIMARY KEY("author_id","article_version_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "authors_to_articles" (
	"author_id" integer NOT NULL,
	"article_id" integer NOT NULL,
	CONSTRAINT "authors_to_articles_author_id_article_id_pk" PRIMARY KEY("author_id","article_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "contacts" (
	"id" serial PRIMARY KEY NOT NULL,
	"label" text,
	"url" text,
	"author_id" integer,
	"createdAt" timestamp with time zone,
	"updatedAt" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "passwords" (
	"hash" text NOT NULL,
	"user_id" varchar,
	"createdAt" timestamp with time zone,
	"updatedAt" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "redirections" (
	"id" serial PRIMARY KEY NOT NULL,
	"from" text NOT NULL,
	"to" text NOT NULL,
	"createdAt" timestamp with time zone,
	"updatedAt" timestamp with time zone,
	CONSTRAINT "redirections_from_unique" UNIQUE("from")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "session" (
	"id" varchar(32) PRIMARY KEY NOT NULL,
	"expiration_date" timestamp NOT NULL,
	"user_id" varchar NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "users" (
	"id" varchar(32) PRIMARY KEY NOT NULL,
	"user_name" text NOT NULL,
	"full_name" text NOT NULL,
	"email" text,
	"avatar_url" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "users_id_unique" UNIQUE("id"),
	CONSTRAINT "users_user_name_unique" UNIQUE("user_name")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "articles_versions" ADD CONSTRAINT "articles_versions_article_id_articles_id_fk" FOREIGN KEY ("article_id") REFERENCES "public"."articles"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "auth" ADD CONSTRAINT "auth_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "authors_to_article_versions" ADD CONSTRAINT "authors_to_article_versions_author_id_authors_id_fk" FOREIGN KEY ("author_id") REFERENCES "public"."authors"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "authors_to_article_versions" ADD CONSTRAINT "authors_to_article_versions_article_version_id_articles_versions_id_fk" FOREIGN KEY ("article_version_id") REFERENCES "public"."articles_versions"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "authors_to_articles" ADD CONSTRAINT "authors_to_articles_author_id_authors_id_fk" FOREIGN KEY ("author_id") REFERENCES "public"."authors"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "authors_to_articles" ADD CONSTRAINT "authors_to_articles_article_id_articles_id_fk" FOREIGN KEY ("article_id") REFERENCES "public"."articles"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "passwords" ADD CONSTRAINT "passwords_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "session" ADD CONSTRAINT "session_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "name_idx" ON "redirections" USING btree ("from");