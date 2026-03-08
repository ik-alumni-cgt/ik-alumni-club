CREATE TABLE "likes" (
	"id" text PRIMARY KEY NOT NULL,
	"content_type" text NOT NULL,
	"content_id" text NOT NULL,
	"anonymous_id" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX "likes_content_anonymous_idx" ON "likes" USING btree ("content_type","content_id","anonymous_id");