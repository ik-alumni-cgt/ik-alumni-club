import { pgTable, text, boolean, integer, timestamp } from "drizzle-orm/pg-core";
import { users } from "./auth";
import { nanoid } from "nanoid";
import { relations } from "drizzle-orm";
import { photoLibraryCategories } from "./categories";

// フォトライブラリ（アルバム）テーブル
export const photoLibrary = pgTable("photo_library", {
  id: text("id").primaryKey().$defaultFn(() => nanoid()),
  title: text("title").notNull(),
  description: text("description"),
  coverImageUrl: text("cover_image_url"),
  published: boolean("published").notNull().default(false),
  isMemberOnly: boolean("is_member_only").notNull().default(true),
  createdBy: text("created_by").references(() => users.id, { onDelete: "set null" }),
  viewCount: integer("view_count").notNull().default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});

// フォトライブラリの画像テーブル
export const photoLibraryImages = pgTable("photo_library_images", {
  id: text("id").primaryKey().$defaultFn(() => nanoid()),
  photoLibraryId: text("photo_library_id").notNull().references(() => photoLibrary.id, { onDelete: "cascade" }),
  imageUrl: text("image_url").notNull(),
  caption: text("caption"),
  sortOrder: integer("sort_order").notNull().default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const photoLibraryRelations = relations(photoLibrary, ({ one, many }) => ({
  creator: one(users, {
    fields: [photoLibrary.createdBy],
    references: [users.id],
  }),
  images: many(photoLibraryImages),
  photoLibraryCategories: many(photoLibraryCategories),
}));

export const photoLibraryImagesRelations = relations(photoLibraryImages, ({ one }) => ({
  photoLibrary: one(photoLibrary, {
    fields: [photoLibraryImages.photoLibraryId],
    references: [photoLibrary.id],
  }),
}));
