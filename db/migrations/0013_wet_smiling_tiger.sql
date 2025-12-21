CREATE TABLE "photo_library" (
	"id" text PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"image_url" text NOT NULL,
	"thumbnail_url" text,
	"published" boolean DEFAULT false NOT NULL,
	"is_member_only" boolean DEFAULT true NOT NULL,
	"created_by" text,
	"view_count" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "photo_library" ADD CONSTRAINT "photo_library_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;