CREATE TABLE IF NOT EXISTS "redirections" (
	"id" serial PRIMARY KEY NOT NULL,
	"from" text NOT NULL,
	"to" text NOT NULL,
	"createdAt" timestamp with time zone,
	"updatedAt" timestamp with time zone,
	CONSTRAINT "redirections_from_unique" UNIQUE("from")
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "name_idx" ON "redirections" USING btree ("from");