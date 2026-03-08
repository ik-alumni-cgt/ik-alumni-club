import { pgTable, text, date, boolean, timestamp } from "drizzle-orm/pg-core";
import { users } from "./auth";
import { nanoid } from "nanoid";
import { relations } from "drizzle-orm";
import { informationCategories } from "./categories";

export const informations = pgTable("informations", {
  id: text("id").primaryKey().$defaultFn(() => nanoid()),
  date: date("date").notNull(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  imageUrl: text("image_url"),
  url: text("url"),
  published: boolean("published").notNull().default(false),
  isMemberOnly: boolean("is_member_only").notNull().default(false),
  createdBy: text("created_by").references(() => users.id, { onDelete: "set null" }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});

export const informationRelations = relations(informations, ({ one, many }) => ({
  creator: one(users, {
    fields: [informations.createdBy],
    references: [users.id],
  }),
  informationCategories: many(informationCategories),
}));
