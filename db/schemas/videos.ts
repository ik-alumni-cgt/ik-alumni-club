import { pgTable, text, date, boolean, integer, timestamp } from "drizzle-orm/pg-core";
import { users } from "./auth";
import { nanoid } from "nanoid";
import { relations } from "drizzle-orm";
import { videoCategories } from "./categories";

export const videos = pgTable("videos", {
  id: text("id").primaryKey().$defaultFn(() => nanoid()),
  title: text("title").notNull(),
  videoDate: date("video_date").notNull(),
  videoUrl: text("video_url").notNull(),
  thumbnailUrl: text("thumbnail_url"),
  published: boolean("published").notNull().default(false),
  isMemberOnly: boolean("is_member_only").notNull().default(false),
  authorId: text("author_id").references(() => users.id, { onDelete: "set null" }),
  authorName: text("author_name"),
  viewCount: integer("view_count").notNull().default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});

export const videoRelations = relations(videos, ({ one, many }) => ({
  author: one(users, {
    fields: [videos.authorId],
    references: [users.id],
  }),
  videoCategories: many(videoCategories),
}));
