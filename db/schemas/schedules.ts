import { pgTable, text, timestamp, boolean, integer } from "drizzle-orm/pg-core";
import { users } from "./auth";
import { nanoid } from "nanoid";
import { relations } from "drizzle-orm";
import { scheduleCategories } from "./categories";

export const schedules = pgTable("schedules", {
  id: text("id").primaryKey().$defaultFn(() => nanoid()),
  title: text("title").notNull(),
  content: text("content").notNull(),
  eventDate: timestamp("event_date", { withTimezone: true }).notNull(),
  imageUrl: text("image_url"),
  linkUrl: text("link_url"),
  sortOrder: integer("sort_order").notNull().default(0),
  published: boolean("published").notNull().default(false),
  isMemberOnly: boolean("is_member_only").notNull().default(false),
  authorId: text("author_id").references(() => users.id, { onDelete: "set null" }),
  authorName: text("author_name"),
  authorEmail: text("author_email"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});

export const scheduleRelations = relations(schedules, ({ one, many }) => ({
  author: one(users, {
    fields: [schedules.authorId],
    references: [users.id],
  }),
  scheduleCategories: many(scheduleCategories),
}));
