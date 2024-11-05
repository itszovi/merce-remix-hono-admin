CREATE TABLE IF NOT EXISTS "authors_to_articles" (
	"author_id" integer NOT NULL,
	"article_id" integer NOT NULL,
	CONSTRAINT "authors_to_articles_author_id_article_id_pk" PRIMARY KEY("author_id","article_id")
);
--> statement-breakpoint
ALTER TABLE "articles" ADD COLUMN "updated_by" integer;--> statement-breakpoint
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
