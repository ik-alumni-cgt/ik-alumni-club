CREATE TABLE "photo_library_categories" (
	"photo_library_id" text NOT NULL,
	"category_id" text NOT NULL,
	CONSTRAINT "photo_library_categories_photo_library_id_category_id_pk" PRIMARY KEY("photo_library_id","category_id")
);
--> statement-breakpoint
ALTER TABLE "photo_library_categories" ADD CONSTRAINT "photo_library_categories_photo_library_id_photo_library_id_fk" FOREIGN KEY ("photo_library_id") REFERENCES "public"."photo_library"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "photo_library_categories" ADD CONSTRAINT "photo_library_categories_category_id_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE cascade ON UPDATE no action;