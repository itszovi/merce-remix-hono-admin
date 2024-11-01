ALTER TABLE "articles" ALTER COLUMN "updatedAt" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "articles" ADD COLUMN "publishedAt" timestamp with time zone DEFAULT null;