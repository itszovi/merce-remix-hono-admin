ALTER TABLE "passwords" ALTER COLUMN "user_id" SET DATA TYPE varchar;--> statement-breakpoint
ALTER TABLE "passwords" ALTER COLUMN "user_id" DROP NOT NULL;