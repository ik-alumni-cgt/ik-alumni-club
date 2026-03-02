ALTER TABLE "sponsors" ALTER COLUMN "company_name" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "members" ADD COLUMN "is_migrated" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "members" ADD COLUMN "migrated_at" timestamp;