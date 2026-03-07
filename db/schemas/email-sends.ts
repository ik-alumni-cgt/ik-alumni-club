import { pgEnum, pgTable, text, varchar, integer, timestamp } from "drizzle-orm/pg-core";
import { users } from "./auth";
import { members } from "./member";
import { nanoid } from "nanoid";
import { relations } from "drizzle-orm";

export const emailSendStatus = ["pending", "success", "failed"] as const;
export const emailSendStatusEnum = pgEnum("email_send_status", emailSendStatus);

export const emailSends = pgTable("email_sends", {
  id: text("id").primaryKey().$defaultFn(() => nanoid()),
  subject: varchar("subject", { length: 255 }).notNull(),
  body: text("body").notNull(),
  sentBy: text("sent_by").references(() => users.id, { onDelete: "set null" }),
  totalCount: integer("total_count").notNull(),
  successCount: integer("success_count").notNull().default(0),
  failCount: integer("fail_count").notNull().default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});

export const emailSendRecipients = pgTable("email_send_recipients", {
  id: text("id").primaryKey().$defaultFn(() => nanoid()),
  emailSendId: text("email_send_id")
    .notNull()
    .references(() => emailSends.id, { onDelete: "cascade" }),
  memberId: text("member_id").references(() => members.id, { onDelete: "set null" }),
  email: varchar("email", { length: 255 }).notNull(),
  status: emailSendStatusEnum("status").notNull().default("pending"),
  errorMessage: text("error_message"),
  sentAt: timestamp("sent_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const emailSendsRelations = relations(emailSends, ({ one, many }) => ({
  sender: one(users, {
    fields: [emailSends.sentBy],
    references: [users.id],
  }),
  recipients: many(emailSendRecipients),
}));

export const emailSendRecipientsRelations = relations(emailSendRecipients, ({ one }) => ({
  emailSend: one(emailSends, {
    fields: [emailSendRecipients.emailSendId],
    references: [emailSends.id],
  }),
  member: one(members, {
    fields: [emailSendRecipients.memberId],
    references: [members.id],
  }),
}));
