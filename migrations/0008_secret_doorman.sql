CREATE TABLE IF NOT EXISTS "articles_versions" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"slug" text NOT NULL,
	"path" text,
	"content" text NOT NULL,
	"updated_by" integer,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	"updatedAt" timestamp with time zone DEFAULT now(),
	"publishedAt" timestamp with time zone DEFAULT null,
	CONSTRAINT "articles_versions_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "authors_to_article_versions" (
	"author_id" integer NOT NULL,
	"article_version_id" integer NOT NULL,
	CONSTRAINT "authors_to_article_versions_author_id_article_version_id_pk" PRIMARY KEY("author_id","article_version_id")
);
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
