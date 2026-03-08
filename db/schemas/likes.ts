import { pgTable, text, timestamp, uniqueIndex } from "drizzle-orm/pg-core";
import { nanoid } from "nanoid";

export const likes = pgTable(
  "likes",
  {
    id: text("id").primaryKey().$defaultFn(() => nanoid()),
    contentType: text("content_type").notNull(),
    contentId: text("content_id").notNull(),
    anonymousId: text("anonymous_id").notNull(),
    reactionType: text("reaction_type").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [
    uniqueIndex("likes_content_anonymous_idx").on(
      table.contentType,
      table.contentId,
      table.anonymousId
    ),
  ]
);
