ALTER TABLE "articles" ALTER COLUMN "createdAt" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "articles" ALTER COLUMN "createdAt" SET NOT NULL;