CREATE TABLE "hero_slides" (
	"id" text PRIMARY KEY NOT NULL,
	"type" text NOT NULL,
	"image_url" text NOT NULL,
	"link_url" text,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
