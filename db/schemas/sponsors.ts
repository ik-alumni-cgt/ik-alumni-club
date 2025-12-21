import { pgTable, text, boolean, timestamp } from "drizzle-orm/pg-core"
import { nanoid } from "nanoid"

export const sponsors = pgTable("sponsors", {
  id: text("id").primaryKey().$defaultFn(() => nanoid()),
  companyName: text("company_name").notNull(),
  logoUrl: text("logo_url"),
  representativeName: text("representative_name").notNull(),
  hasFlag: boolean("has_flag").notNull().default(false),
  programConsent: boolean("program_consent").notNull().default(false),
  websiteConsent: boolean("website_consent").notNull().default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
})
