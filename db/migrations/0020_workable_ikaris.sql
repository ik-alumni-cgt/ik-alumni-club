CREATE TABLE "blog_categories" (
	"blog_id" text NOT NULL,
	"category_id" text NOT NULL,
	CONSTRAINT "blog_categories_blog_id_category_id_pk" PRIMARY KEY("blog_id","category_id")
);
--> statement-breakpoint
CREATE TABLE "categories" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"slug" text NOT NULL,
	"parent_id" text,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "categories_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "information_categories" (
	"information_id" text NOT NULL,
	"category_id" text NOT NULL,
	CONSTRAINT "information_categories_information_id_category_id_pk" PRIMARY KEY("information_id","category_id")
);
--> statement-breakpoint
CREATE TABLE "newsletter_categories" (
	"newsletter_id" text NOT NULL,
	"category_id" text NOT NULL,
	CONSTRAINT "newsletter_categories_newsletter_id_category_id_pk" PRIMARY KEY("newsletter_id","category_id")
);
--> statement-breakpoint
CREATE TABLE "schedule_categories" (
	"schedule_id" text NOT NULL,
	"category_id" text NOT NULL,
	CONSTRAINT "schedule_categories_schedule_id_category_id_pk" PRIMARY KEY("schedule_id","category_id")
);
--> statement-breakpoint
CREATE TABLE "video_categories" (
	"video_id" text NOT NULL,
	"category_id" text NOT NULL,
	CONSTRAINT "video_categories_video_id_category_id_pk" PRIMARY KEY("video_id","category_id")
);
--> statement-breakpoint
ALTER TABLE "blog_categories" ADD CONSTRAINT "blog_categories_blog_id_blogs_id_fk" FOREIGN KEY ("blog_id") REFERENCES "public"."blogs"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "blog_categories" ADD CONSTRAINT "blog_categories_category_id_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "information_categories" ADD CONSTRAINT "information_categories_information_id_informations_id_fk" FOREIGN KEY ("information_id") REFERENCES "public"."informations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "information_categories" ADD CONSTRAINT "information_categories_category_id_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "newsletter_categories" ADD CONSTRAINT "newsletter_categories_newsletter_id_newsletters_id_fk" FOREIGN KEY ("newsletter_id") REFERENCES "public"."newsletters"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "newsletter_categories" ADD CONSTRAINT "newsletter_categories_category_id_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "schedule_categories" ADD CONSTRAINT "schedule_categories_schedule_id_schedules_id_fk" FOREIGN KEY ("schedule_id") REFERENCES "public"."schedules"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "schedule_categories" ADD CONSTRAINT "schedule_categories_category_id_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "video_categories" ADD CONSTRAINT "video_categories_video_id_videos_id_fk" FOREIGN KEY ("video_id") REFERENCES "public"."videos"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "video_categories" ADD CONSTRAINT "video_categories_category_id_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE cascade ON UPDATE no action;