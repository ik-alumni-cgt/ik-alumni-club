import { pgTable, text, integer, boolean, timestamp } from "drizzle-orm/pg-core"
import { nanoid } from "nanoid"
import { members } from "./member"

export const profileMembers = pgTable("profile_members", {
  id: text("id").primaryKey().$defaultFn(() => nanoid()),
  name: text("name").notNull(),
  description: text("description").notNull(),
  imageUrl: text("image_url"),
  sortOrder: integer("sort_order").notNull().default(0),
  isVisible: boolean("is_visible").notNull().default(true),
  memberId: text("member_id").references(() => members.id, { onDelete: "set null" }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
})
