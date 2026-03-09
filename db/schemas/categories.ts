import { pgTable, text, integer, timestamp, primaryKey } from "drizzle-orm/pg-core";
import { nanoid } from "nanoid";
import { relations } from "drizzle-orm";
import { blogs } from "./blogs";
import { informations } from "./informations";
import { schedules } from "./schedules";
import { videos } from "./videos";
import { newsletters } from "./newsletters";
import { photoLibrary } from "./photo-library";
import { pastEvents } from "./past-events";

// カテゴリーマスタ
export const categories = pgTable("categories", {
  id: text("id").primaryKey().$defaultFn(() => nanoid()),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  parentId: text("parent_id"),
  sortOrder: integer("sort_order").notNull().default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});

// カテゴリーのリレーション
export const categoryRelations = relations(categories, ({ one, many }) => ({
  parent: one(categories, {
    fields: [categories.parentId],
    references: [categories.id],
    relationName: "parentChild",
  }),
  children: many(categories, {
    relationName: "parentChild",
  }),
  blogCategories: many(blogCategories),
  informationCategories: many(informationCategories),
  scheduleCategories: many(scheduleCategories),
  videoCategories: many(videoCategories),
  newsletterCategories: many(newsletterCategories),
  photoLibraryCategories: many(photoLibraryCategories),
  pastEventCategories: many(pastEventCategories),
}));

// ブログ中間テーブル
export const blogCategories = pgTable(
  "blog_categories",
  {
    blogId: text("blog_id")
      .notNull()
      .references(() => blogs.id, { onDelete: "cascade" }),
    categoryId: text("category_id")
      .notNull()
      .references(() => categories.id, { onDelete: "cascade" }),
  },
  (t) => [primaryKey({ columns: [t.blogId, t.categoryId] })],
);

export const blogCategoryRelations = relations(blogCategories, ({ one }) => ({
  blog: one(blogs, {
    fields: [blogCategories.blogId],
    references: [blogs.id],
  }),
  category: one(categories, {
    fields: [blogCategories.categoryId],
    references: [categories.id],
  }),
}));

// お知らせ中間テーブル
export const informationCategories = pgTable(
  "information_categories",
  {
    informationId: text("information_id")
      .notNull()
      .references(() => informations.id, { onDelete: "cascade" }),
    categoryId: text("category_id")
      .notNull()
      .references(() => categories.id, { onDelete: "cascade" }),
  },
  (t) => [primaryKey({ columns: [t.informationId, t.categoryId] })],
);

export const informationCategoryRelations = relations(informationCategories, ({ one }) => ({
  information: one(informations, {
    fields: [informationCategories.informationId],
    references: [informations.id],
  }),
  category: one(categories, {
    fields: [informationCategories.categoryId],
    references: [categories.id],
  }),
}));

// スケジュール中間テーブル
export const scheduleCategories = pgTable(
  "schedule_categories",
  {
    scheduleId: text("schedule_id")
      .notNull()
      .references(() => schedules.id, { onDelete: "cascade" }),
    categoryId: text("category_id")
      .notNull()
      .references(() => categories.id, { onDelete: "cascade" }),
  },
  (t) => [primaryKey({ columns: [t.scheduleId, t.categoryId] })],
);

export const scheduleCategoryRelations = relations(scheduleCategories, ({ one }) => ({
  schedule: one(schedules, {
    fields: [scheduleCategories.scheduleId],
    references: [schedules.id],
  }),
  category: one(categories, {
    fields: [scheduleCategories.categoryId],
    references: [categories.id],
  }),
}));

// 動画中間テーブル
export const videoCategories = pgTable(
  "video_categories",
  {
    videoId: text("video_id")
      .notNull()
      .references(() => videos.id, { onDelete: "cascade" }),
    categoryId: text("category_id")
      .notNull()
      .references(() => categories.id, { onDelete: "cascade" }),
  },
  (t) => [primaryKey({ columns: [t.videoId, t.categoryId] })],
);

export const videoCategoryRelations = relations(videoCategories, ({ one }) => ({
  video: one(videos, {
    fields: [videoCategories.videoId],
    references: [videos.id],
  }),
  category: one(categories, {
    fields: [videoCategories.categoryId],
    references: [categories.id],
  }),
}));

// ニュースレター中間テーブル
export const newsletterCategories = pgTable(
  "newsletter_categories",
  {
    newsletterId: text("newsletter_id")
      .notNull()
      .references(() => newsletters.id, { onDelete: "cascade" }),
    categoryId: text("category_id")
      .notNull()
      .references(() => categories.id, { onDelete: "cascade" }),
  },
  (t) => [primaryKey({ columns: [t.newsletterId, t.categoryId] })],
);

export const newsletterCategoryRelations = relations(newsletterCategories, ({ one }) => ({
  newsletter: one(newsletters, {
    fields: [newsletterCategories.newsletterId],
    references: [newsletters.id],
  }),
  category: one(categories, {
    fields: [newsletterCategories.categoryId],
    references: [categories.id],
  }),
}));

// フォトライブラリ中間テーブル
export const photoLibraryCategories = pgTable(
  "photo_library_categories",
  {
    photoLibraryId: text("photo_library_id")
      .notNull()
      .references(() => photoLibrary.id, { onDelete: "cascade" }),
    categoryId: text("category_id")
      .notNull()
      .references(() => categories.id, { onDelete: "cascade" }),
  },
  (t) => [primaryKey({ columns: [t.photoLibraryId, t.categoryId] })],
);

export const photoLibraryCategoryRelations = relations(photoLibraryCategories, ({ one }) => ({
  photoLibrary: one(photoLibrary, {
    fields: [photoLibraryCategories.photoLibraryId],
    references: [photoLibrary.id],
  }),
  category: one(categories, {
    fields: [photoLibraryCategories.categoryId],
    references: [categories.id],
  }),
}));

// 過去イベント中間テーブル
export const pastEventCategories = pgTable(
  "past_event_categories",
  {
    pastEventId: text("past_event_id")
      .notNull()
      .references(() => pastEvents.id, { onDelete: "cascade" }),
    categoryId: text("category_id")
      .notNull()
      .references(() => categories.id, { onDelete: "cascade" }),
  },
  (t) => [primaryKey({ columns: [t.pastEventId, t.categoryId] })],
);

export const pastEventCategoryRelations = relations(pastEventCategories, ({ one }) => ({
  pastEvent: one(pastEvents, {
    fields: [pastEventCategories.pastEventId],
    references: [pastEvents.id],
  }),
  category: one(categories, {
    fields: [pastEventCategories.categoryId],
    references: [categories.id],
  }),
}));
