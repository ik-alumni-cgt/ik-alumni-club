CREATE TABLE "past_event_categories" (
	"past_event_id" text NOT NULL,
	"category_id" text NOT NULL,
	CONSTRAINT "past_event_categories_past_event_id_category_id_pk" PRIMARY KEY("past_event_id","category_id")
);
--> statement-breakpoint
CREATE TABLE "contacts" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"category" text NOT NULL,
	"subject" text NOT NULL,
	"body" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "past_events" (
	"id" text PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"description" text NOT NULL,
	"event_date" timestamp with time zone NOT NULL,
	"image_url" text,
	"published" boolean DEFAULT false NOT NULL,
	"is_member_only" boolean DEFAULT false NOT NULL,
	"author_id" text,
	"author_name" text,
	"author_email" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "past_event_categories" ADD CONSTRAINT "past_event_categories_past_event_id_past_events_id_fk" FOREIGN KEY ("past_event_id") REFERENCES "public"."past_events"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "past_event_categories" ADD CONSTRAINT "past_event_categories_category_id_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "past_events" ADD CONSTRAINT "past_events_author_id_users_id_fk" FOREIGN KEY ("author_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;