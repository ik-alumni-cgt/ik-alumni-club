import { pgTable, text, boolean, integer, timestamp } from "drizzle-orm/pg-core";
import { users } from "./auth";
import { nanoid } from "nanoid";
import { relations } from "drizzle-orm";
import { newsletterCategories } from "./categories";

export const newsletters = pgTable("newsletters", {
  // 基本情報
  id: text("id").primaryKey().$defaultFn(() => nanoid()),
  issueNumber: integer("issue_number").notNull().unique(),
  title: text("title").notNull(),
  excerpt: text("excerpt").notNull(),
  content: text("content").notNull(),

  // メディア
  thumbnailUrl: text("thumbnail_url"),
  pdfUrl: text("pdf_url"),

  // 作成者情報
  authorId: text("author_id").references(() => users.id, { onDelete: "set null" }),
  authorName: text("author_name"),

  // メタ情報
  category: text("category"), // 'regular', 'special', 'extra'
  viewCount: integer("view_count").notNull().default(0),

  // 公開管理
  published: boolean("published").notNull().default(false),
  isMemberOnly: boolean("is_member_only").notNull().default(true), // ニュースレターはデフォルトで会員限定
  publishedAt: timestamp("published_at"),

  // タイムスタンプ
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});

export const newsletterRelations = relations(newsletters, ({ one, many }) => ({
  author: one(users, {
    fields: [newsletters.authorId],
    references: [users.id],
  }),
  newsletterCategories: many(newsletterCategories),
}));
