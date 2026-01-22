import { pgTable, serial, varchar, text, decimal, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";

export const memberPlans = pgTable("member_plans", {
  id: serial("id").primaryKey(),
  planCode: varchar("plan_code", { length: 50 }).notNull().unique(),
  planName: varchar("plan_name", { length: 100 }).notNull(),
  displayName: varchar("display_name", { length: 100 }).notNull(),
  description: text("description"),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  hierarchyLevel: integer("hierarchy_level").notNull(),
  isBusinessPlan: boolean("is_business_plan").default(false),
  features: jsonb("features"),
  color: varchar("color", { length: 20 }),
  isActive: boolean("is_active").default(true).notNull(),

  // Stripe連携
  stripePriceId: varchar("stripe_price_id", { length: 255 }),
  stripeOneTimePriceId: varchar("stripe_one_time_price_id", { length: 255 }),

  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});
