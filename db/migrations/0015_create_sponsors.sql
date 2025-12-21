CREATE TABLE IF NOT EXISTS "sponsors" (
	"id" text PRIMARY KEY NOT NULL,
	"company_name" text NOT NULL,
	"logo_url" text,
	"representative_name" text NOT NULL,
	"has_flag" boolean DEFAULT false NOT NULL,
	"program_consent" boolean DEFAULT false NOT NULL,
	"website_consent" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
