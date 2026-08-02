import { pgEnum, pgTable, text, timestamp, varchar, integer, boolean } from "drizzle-orm/pg-core";
import { users } from "./auth";
import { memberPlans } from "./member-plans";
import { nanoid } from "nanoid";
import { relations } from "drizzle-orm";

export const membersRole = ["admin", "officer", "member"] as const;
export const membersStatus = ["pending_profile", "active", "inactive"] as const;
export const paymentStatus = ["pending", "completed", "failed", "canceled"] as const;

export const membersRoleEnum = pgEnum("members_role", membersRole);
export const membersStatusEnum = pgEnum("members_status", membersStatus);
export const paymentStatusEnum = pgEnum("payment_status", paymentStatus);

export const members = pgTable("members", {
  id: text("id").primaryKey().$defaultFn(() => nanoid()),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),

  // 基本情報
  email: varchar("email", { length: 255 }).unique(),

  // 氏名情報
  lastName: varchar("last_name", { length: 100 }),
  firstName: varchar("first_name", { length: 100 }),
  lastNameKana: varchar("last_name_kana", { length: 100 }),
  firstNameKana: varchar("first_name_kana", { length: 100 }),

  // 住所情報
  postalCode: varchar("postal_code", { length: 8 }),
  prefecture: varchar("prefecture", { length: 50 }),
  city: varchar("city", { length: 100 }),
  address: varchar("address", { length: 255 }),
  building: varchar("building", { length: 255 }),

  // 連絡先情報
  phoneNumber: varchar("phone_number", { length: 20 }),

  // プラン・権限情報
  planId: integer("plan_id").references(() => memberPlans.id, { onDelete: "restrict" }),
  role: membersRoleEnum("role").notNull(),

  // 編集者権限（メンバーブログの執筆可否）
  // role とは独立したフラグ。「支払い済みの会員」かつ「編集者」を同時に表現するため。
  // 付与は当面 DB 直接更新で運用する。
  isEditor: boolean("is_editor").default(false).notNull(),

  // ステータス管理
  status: membersStatusEnum("status").default("pending_profile"),
  profileCompleted: boolean("profile_completed").default(false).notNull(),
  isActive: boolean("is_active").default(true).notNull(),

  // Stripe支払い情報
  paymentStatus: paymentStatusEnum("payment_status").default("pending"),
  stripeSubscriptionId: varchar("stripe_subscription_id", { length: 255 }),
  subscriptionStartDate: timestamp("subscription_start_date"),
  subscriptionEndDate: timestamp("subscription_end_date"),

  // 移行情報
  isMigrated: boolean("is_migrated").default(false).notNull(),
  migratedAt: timestamp("migrated_at"),

  // 初回特典
  welcomeGiftSent: boolean("welcome_gift_sent").default(false).notNull(),

  // 法人情報（スポンサーフォーム回答済み）
  sponsorFormCompleted: boolean("sponsor_form_completed").default(false).notNull(),

  // メタデータ
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});

export const membersRelations = relations(members, ({ one }) => ({
  user: one(users, {
    fields: [members.userId],
    references: [users.id],
  }),
  plan: one(memberPlans, {
    fields: [members.planId],
    references: [memberPlans.id],
  }),
}));