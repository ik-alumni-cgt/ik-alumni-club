import { pgTable, text, integer, timestamp } from "drizzle-orm/pg-core";
import { nanoid } from "nanoid";

// トップページのヒーロー画像（カルーセル / 背景スライドショー）
export const heroSlides = pgTable("hero_slides", {
  id: text("id").primaryKey().$defaultFn(() => nanoid()),
  // "carousel" または "background"
  type: text("type").notNull(),
  imageUrl: text("image_url").notNull(),
  // カルーセルのみ使用。背景は null
  linkUrl: text("link_url"),
  sortOrder: integer("sort_order").notNull().default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});
