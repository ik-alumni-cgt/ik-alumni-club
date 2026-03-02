ALTER TYPE "public"."members_role" ADD VALUE 'officer' BEFORE 'member';--> statement-breakpoint
ALTER TABLE "members" ADD COLUMN "welcome_gift_sent" boolean DEFAULT false NOT NULL;