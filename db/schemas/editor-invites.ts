import { integer, pgTable, text, timestamp, unique, varchar } from "drizzle-orm/pg-core";
import { nanoid } from "nanoid";
import { relations } from "drizzle-orm";
import { users } from "./auth";

/**
 * 編集者の招待。
 * 1 本のリンクをチームで共有して使う前提。
 * 上限人数と有効期限で、リンクが外に漏れたときの影響を絞る。
 * 氏名は招待には含めず、ログインした本人に入力してもらう。
 */
export const editorInvites = pgTable("editor_invites", {
  id: text("id").primaryKey().$defaultFn(() => nanoid()),

  // 招待 URL に埋め込むトークン。推測されないよう長めにする
  token: text("token").notNull().unique().$defaultFn(() => nanoid(32)),

  // 何のための招待かを管理者が判別するためのメモ
  label: varchar("label", { length: 100 }),

  createdBy: text("created_by").references(() => users.id, { onDelete: "set null" }),
  expiresAt: timestamp("expires_at").notNull(),

  // 上限人数。ここに達したらリンクは使えなくなる
  maxUses: integer("max_uses").notNull().default(30),
  usedCount: integer("used_count").notNull().default(0),

  createdAt: timestamp("created_at").defaultNow().notNull(),
});

/**
 * 招待を誰が使ったかの記録。
 * 同じ人が二度開いても上限を余計に消費しないよう、招待とユーザーの組で一意にする。
 */
export const editorInviteUses = pgTable(
  "editor_invite_uses",
  {
    id: text("id").primaryKey().$defaultFn(() => nanoid()),
    inviteId: text("invite_id")
      .notNull()
      .references(() => editorInvites.id, { onDelete: "cascade" }),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    usedAt: timestamp("used_at").defaultNow().notNull(),
  },
  (table) => [unique("editor_invite_uses_invite_user_unique").on(table.inviteId, table.userId)],
);

export const editorInvitesRelations = relations(editorInvites, ({ one, many }) => ({
  creator: one(users, {
    fields: [editorInvites.createdBy],
    references: [users.id],
  }),
  uses: many(editorInviteUses),
}));

export const editorInviteUsesRelations = relations(editorInviteUses, ({ one }) => ({
  invite: one(editorInvites, {
    fields: [editorInviteUses.inviteId],
    references: [editorInvites.id],
  }),
  user: one(users, {
    fields: [editorInviteUses.userId],
    references: [users.id],
  }),
}));
