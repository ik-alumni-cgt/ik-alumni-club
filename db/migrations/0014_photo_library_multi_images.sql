-- photo_library テーブルのカラム変更
ALTER TABLE "photo_library" RENAME COLUMN "image_url" TO "cover_image_url";
ALTER TABLE "photo_library" DROP COLUMN IF EXISTS "thumbnail_url";
ALTER TABLE "photo_library" ALTER COLUMN "cover_image_url" DROP NOT NULL;

-- photo_library_images テーブル作成
CREATE TABLE IF NOT EXISTS "photo_library_images" (
  "id" text PRIMARY KEY NOT NULL,
  "photo_library_id" text NOT NULL REFERENCES "photo_library"("id") ON DELETE CASCADE,
  "image_url" text NOT NULL,
  "caption" text,
  "sort_order" integer NOT NULL DEFAULT 0,
  "created_at" timestamp DEFAULT now() NOT NULL
);
